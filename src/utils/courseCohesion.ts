import type {
  CEFRLevel,
  GlossWord,
  LanguageCode,
  LessonStep,
  Topic,
  VocabCard,
} from '../types/learning';
import { exampleMatchesWord } from './vocabValidation';
import {
  buildUnitScriptPhonicsStep,
  createScriptPhonicsContext,
} from './unitScriptPhonics';

const MODULE_TITLES_BY_LEVEL: Record<CEFRLevel, string[]> = {
  A1: [
    'Módulo 1 · Primeiros Contatos & Sobrevivência',
    'Módulo 2 · Rotina, Cidade & Compras',
    'Módulo 3 · Comunicação do Dia a Dia',
  ],
  A2: [
    'Módulo 4 · Experiências, Viagens & Serviços',
    'Módulo 5 · Planos, Saúde & Vida Social',
    'Módulo 6 · Situações Práticas & Cultura',
  ],
  B1: [
    'Módulo 7 · Trabalho, Opiniões & Narrativas',
    'Módulo 8 · Conexões, Mídia & Resolução de Problemas',
    'Módulo 9 · Autonomia Comunicativa',
  ],
  B2: [
    'Módulo 10 · Argumentação, Negócios & Tecnologia',
    'Módulo 11 · Fluência Crítica & Debates',
    'Módulo 12 · Nuances & Expressões Reais',
  ],
  C1: [
    'Módulo 13 · Alta Performance & Liderança',
    'Módulo 14 · Retórica, Cultura & Registro Nativo',
    'Módulo 15 · Domínio Avançado & Exames',
  ],
};

function findSentenceWithWord(text: string, word: string): string {
  const sentences = text
    .split(/(?<=[.!?؟。])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const found = sentences.find((s) =>
    s.toLowerCase().includes(word.toLowerCase()),
  );
  return found ?? sentences[0] ?? text.slice(0, 120);
}

function collectTopicFullText(topic: Topic): string {
  const parts: string[] = [];
  for (const s of topic.steps) {
    if (s.type === 'listening' || s.type === 'dictation') parts.push(s.audioText);
    if (s.type === 'reading') parts.push(s.text);
    if (s.type === 'story') parts.push(...s.lines.map((l) => l.text));
    if (s.type === 'speaking') parts.push(s.targetSentence);
  }
  return parts.join(' ');
}

/**
 * Enriches a language's curriculum for v8.0.0 pedagogical cohesion:
 * 1. Groups units into Busuu-style Modules (`moduleIndex`, `moduleTitlePt`).
 * 2. Inserts `script_phonics` steps inside non-Latin units (`ru`, `ar`, `ja`, `zh`)
 *    introducing new letters/Kanji BEFORE comprehension & production steps.
 * 3. Expands every unit's vocabulary to 8–10 cohesive cards (extracting Reading
 *    glossary gaps + adding up to 2 spiral-review cards from earlier units).
 * 4. Enriches Reading glossaries with both current & previously learned words.
 * 5. Enriches Matching pairs with up to 4–5 unit vocabulary pairs.
 */
export function enrichCourseCohesion(
  languageCode: LanguageCode,
  topics: Topic[],
  vocab: VocabCard[],
): { topics: Topic[]; vocab: VocabCard[] } {
  const vocabByTopic = new Map<string, VocabCard[]>();
  for (const card of vocab) {
    const list = vocabByTopic.get(card.topicId) ?? [];
    list.push(card);
    vocabByTopic.set(card.topicId, list);
  }

  const scriptCtx = createScriptPhonicsContext();
  const priorCards: Array<{ card: VocabCard; topicTitle: string; topicId: string }> = [];
  const levelCounter: Record<CEFRLevel, number> = {
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
    C1: 0,
  };

  const enrichedTopics: Topic[] = [];
  const enrichedVocab: VocabCard[] = [];

  topics.forEach((topic, idx) => {
    const baseUnitVocab = [...(vocabByTopic.get(topic.id) ?? [])];
    const seenWords = new Set(
      baseUnitVocab.map((c) => c.word.trim().toLowerCase()),
    );
    const fullText = collectTopicFullText(topic);
    const fullTextLower = fullText.toLowerCase();

    // 1) Ensure any Reading glossary word not yet in unit vocab is added cleanly
    for (const step of topic.steps) {
      if (step.type !== 'reading') continue;
      for (const g of step.glossary) {
        if (baseUnitVocab.length >= 10) break;
        const cleanWord = g.word.trim();
        const key = cleanWord.toLowerCase();
        if (!cleanWord || seenWords.has(key)) continue;
        const exSentence = findSentenceWithWord(step.text, cleanWord);
        if (!exampleMatchesWord(exSentence, cleanWord, languageCode)) continue;
        seenWords.add(key);
        baseUnitVocab.push({
          id: `voc-coh-${topic.id}-${baseUnitVocab.length + 1}`,
          topicId: topic.id,
          languageCode,
          word: cleanWord,
          translation: g.translation,
          ipa: g.ipa ?? '',
          exampleEn: exSentence,
          examplePt: g.note ?? `${g.translation} (do texto da unidade)`,
          category: 'Leitura & Contexto',
          strength: 'weak',
          reviewCount: 0,
        });
      }
    }

    // 2) Detect spiral links from previously taught units
    const recycledLinksMap = new Map<string, { topicId: string; titlePt: string; words: string[] }>();
    const recycledCandidates: Array<{ card: VocabCard; topicTitle: string }> = [];

    for (const prev of priorCards) {
      if (prev.card.isRecycled) continue;
      const w = prev.card.word.trim();
      const wKey = w.toLowerCase();
      if (w.length >= 2 && fullTextLower.includes(wKey) && !seenWords.has(wKey)) {
        const entry = recycledLinksMap.get(prev.topicId) ?? {
          topicId: prev.topicId,
          titlePt: prev.topicTitle,
          words: [],
        };
        if (!entry.words.includes(w)) entry.words.push(w);
        recycledLinksMap.set(prev.topicId, entry);
        recycledCandidates.push({ card: prev.card, topicTitle: prev.topicTitle });
      }
    }

    // Fallback spiral review from recent prior units (idx-1, idx-2, idx-4) so every unit > 0 reinforces earlier material
    if (recycledCandidates.length < 2 && priorCards.length > 0) {
      const stepOffsets = [1, 3, 6, 10];
      for (const off of stepOffsets) {
        const probe = priorCards[priorCards.length - off];
        if (!probe || probe.card.isRecycled) continue;
        const wKey = probe.card.word.trim().toLowerCase();
        if (seenWords.has(wKey)) continue;
        if (!recycledCandidates.some((c) => c.card.word.toLowerCase() === wKey)) {
          recycledCandidates.push({ card: probe.card, topicTitle: probe.topicTitle });
        }
        if (recycledCandidates.length >= 2) break;
      }
    }

    // Add up to 2 spiral-review cards (targeting 8-10 cohesive cards per unit)
    const unitVocab: VocabCard[] = [...baseUnitVocab];
    for (const cand of recycledCandidates) {
      if (unitVocab.length >= 10) break;
      if (unitVocab.filter((c) => c.isRecycled).length >= 2) break;
      const wKey = cand.card.word.trim().toLowerCase();
      if (seenWords.has(wKey)) continue;
      seenWords.add(wKey);
      unitVocab.push({
        ...cand.card,
        id: `voc-rec-${topic.id}-${cand.card.id}`,
        topicId: topic.id,
        languageCode,
        isRecycled: true,
        recycledFromTitle: cand.topicTitle,
      });
    }

    // 3) Enrich Reading glossaries & Matching pairs with cohesive unit + prior vocab
    const cohesiveKnownCards = [
      ...unitVocab,
      ...priorCards.slice(-24).map((p) => p.card),
    ];

    const updatedSteps: LessonStep[] = topic.steps.map((step) => {
      if (step.type === 'reading') {
        const lowerRead = step.text.toLowerCase();
        const glossMap = new Map<string, GlossWord>();
        for (const g of step.glossary) {
          glossMap.set(g.word.toLowerCase(), g);
        }
        for (const c of cohesiveKnownCards) {
          if (glossMap.size >= 6) break;
          const clean = c.word.replace(/[¡!¿?.,;:()]/g, '').trim();
          if (clean.length < 2) continue;
          const lowerClean = clean.toLowerCase();
          if (lowerRead.includes(lowerClean) && !glossMap.has(lowerClean)) {
            glossMap.set(lowerClean, {
              word: clean,
              translation: c.translation,
              ipa: c.ipa || undefined,
              note: c.isRecycled
                ? `Revisão espiral (${c.recycledFromTitle ?? 'unidade anterior'})`
                : undefined,
            });
          }
        }
        return {
          ...step,
          glossary: Array.from(glossMap.values()),
        };
      }

      if (step.type === 'matching' && unitVocab.length >= 4) {
        const pairs = unitVocab.slice(0, 5).map((v, vIdx) => ({
          id: `${topic.id}-coh-m-${vIdx + 1}`,
          target: v.word,
          pt: v.translation,
        }));
        return { ...step, pairs };
      }

      return step;
    });

    // 4) Insert progressive Script & Phonics step for ru, ar, ja, zh
    const scriptStep = buildUnitScriptPhonicsStep(
      languageCode,
      topic,
      unitVocab,
      idx,
      scriptCtx,
    );
    const finalSteps: LessonStep[] = scriptStep
      ? [scriptStep, ...updatedSteps]
      : updatedSteps;

    // 5) Assign Busuu-style Module metadata
    const lvlIdx = levelCounter[topic.level] ?? 0;
    levelCounter[topic.level] = lvlIdx + 1;
    const modGroupIdx = Math.floor(lvlIdx / 5);
    const modTitles = MODULE_TITLES_BY_LEVEL[topic.level];
    const moduleTitlePt =
      modTitles[modGroupIdx % modTitles.length] ??
      `Módulo ${modGroupIdx + 1} · ${topic.level}`;
    const levelBase =
      topic.level === 'A1'
        ? 0
        : topic.level === 'A2'
          ? 3
          : topic.level === 'B1'
            ? 6
            : topic.level === 'B2'
              ? 9
              : 12;

    enrichedTopics.push({
      ...topic,
      moduleIndex: levelBase + modGroupIdx + 1,
      moduleTitlePt,
      recycledLinks: Array.from(recycledLinksMap.values()).slice(0, 3),
      steps: finalSteps,
    });

    for (const c of unitVocab) {
      enrichedVocab.push(c);
      if (!c.isRecycled) {
        priorCards.push({
          card: c,
          topicTitle: topic.titlePt,
          topicId: topic.id,
        });
      }
    }
  });

  return { topics: enrichedTopics, vocab: enrichedVocab };
}

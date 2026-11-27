/**
 * @file src/utils/courseCohesion.ts
 * @description Enriquecimento de coesão espiral (enrichCourseCohesion): injeta vocabulário reciclado, matching, cloze, módulos sequenciais e fonética.
 * @exports CourseModuleGroup, buildCourseModules, enrichCourseCohesion
 */
import {
  CEFRLevel,
  FillBlankStep,
  LanguageCode,
  LessonStep,
  ListeningStep,
  MatchingStep,
  ReadingStep,
  StoryStep,
  Topic,
  VocabCard,
  WritingFreeStep,
} from '../types/learning';
import { IN_LESSON_LEXICON, InLessonLexiconEntry } from '../data/inLessonLexicon';
import {
  buildUnitScriptPhonicsStep,
  createScriptPhonicsContext,
} from './unitScriptPhonics';
import { exampleMatchesWord } from './vocabValidation';

/**
 * Temas dos módulos por nível (SEM número). O número exibido é sequencial e
 * global no curso (ver `enrichCourseCohesion`), e a lista tem temas de sobra
 * para nunca reciclar o mesmo título para blocos diferentes (bug da v8.2.0:
 * só havia 3 títulos por nível para 4–5 blocos, repetindo "Módulo 1/2/3").
 */
const MODULE_THEMES_BY_LEVEL: Record<CEFRLevel, string[]> = {
  A1: [
    'Primeiros Contatos & Sobrevivência',
    'Rotina, Cidade & Compras',
    'Comunicação do Dia a Dia',
    'Pessoas, Lugares & Hábitos',
    'Consolidação Básica',
    'Revisão & Prática Integrada',
  ],
  A2: [
    'Experiências, Viagens & Serviços',
    'Planos, Saúde & Vida Social',
    'Situações Práticas & Cultura',
    'Histórias, Opiniões Simples & Convivência',
    'Consolidação Elementar',
    'Revisão & Prática Integrada',
  ],
  B1: [
    'Trabalho, Opiniões & Narrativas',
    'Conexões, Mídia & Resolução de Problemas',
    'Autonomia Comunicativa',
    'Expressões, Registro & Situações Reais',
    'Consolidação Intermediária',
    'Revisão & Prática Integrada',
  ],
  B2: [
    'Argumentação, Negócios & Tecnologia',
    'Fluência Crítica & Debates',
    'Nuances & Expressões Reais',
    'Idiomas, Gírias & Registro',
    'Consolidação Avançada',
    'Revisão & Prática Integrada',
  ],
  C1: [
    'Alta Performance & Liderança',
    'Retórica, Cultura & Registro Nativo',
    'Domínio Avançado & Exames',
    'Precisão, Estilo & Nuances Nativas',
    'Consolidação Final',
    'Revisão & Prática Integrada',
  ],
};

const LEVEL_BASE: Record<CEFRLevel, number> = {
  A1: 0,
  A2: 3,
  B1: 6,
  B2: 9,
  C1: 12,
};

export interface CourseModuleGroup {
  moduleNumber: number;
  title: string;
  subtitle: string;
  level: string;
  topics: Topic[];
}

const CJK_OR_ARABIC_RE = /[\u3040-\u30ff\u4e00-\u9fff\u0600-\u06ff\u0590-\u05ff]/;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeWordKey(word?: string): string {
  return (word ?? '').trim().toLowerCase();
}

function containsWordInText(
  text: string,
  word: string,
  languageCode: LanguageCode,
): boolean {
  const cleanWord = word.trim();
  if (!cleanWord || !text) return false;
  if (
    languageCode === 'ja' ||
    languageCode === 'zh' ||
    languageCode === 'ar' ||
    CJK_OR_ARABIC_RE.test(cleanWord)
  ) {
    return text.toLowerCase().includes(cleanWord.toLowerCase());
  }
  try {
    const regex = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegex(cleanWord)}(?![\\p{L}\\p{N}])`,
      'iu',
    );
    return regex.test(text);
  } catch {
    return text.toLowerCase().includes(cleanWord.toLowerCase());
  }
}

function extractMatchingSentence(
  sentences: string[],
  word: string,
  languageCode: LanguageCode,
): string | null {
  for (const s of sentences) {
    const trimmed = s.trim();
    if (
      trimmed.length >= 6 &&
      trimmed.length <= 160 &&
      exampleMatchesWord(trimmed, word, languageCode)
    ) {
      return trimmed;
    }
  }
  return null;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?。！？])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Agrupa a trilha plana de unidades (topics) em módulos pedagógicos coesos
 * de 4 unidades por módulo, seguindo o padrão Busuu de unidades + check-in.
 */
export function buildCourseModules(topics: Topic[]): CourseModuleGroup[] {
  const groups: CourseModuleGroup[] = [];
  const chunkSize = 4;

  for (let i = 0; i < topics.length; i += chunkSize) {
    const slice = topics.slice(i, i + chunkSize);
    const first = slice[0];
    const moduleNumber = Math.floor(i / chunkSize) + 1;
    const cleanSubtitle = slice
      .map((t) => t.titlePt.split(':')[0].split('·')[0].trim())
      .filter(Boolean)
      .slice(0, 2)
      .join(' · ');

    groups.push({
      moduleNumber,
      title: `Módulo ${moduleNumber}: ${first.titlePt.split(':')[0].trim()}`,
      subtitle: cleanSubtitle || first.subtitle,
      level: first.level,
      topics: slice,
    });
  }

  return groups;
}

interface CatalogCandidate {
  word: string;
  ipa: string;
  translation: string;
  category: string;
  exampleEn: string;
  examplePt: string;
  level?: string;
}

function buildLanguageCatalog(
  languageCode: LanguageCode,
  topics: Topic[],
  vocab: VocabCard[],
): CatalogCandidate[] {
  const topicLevelMap = new Map<string, string>();
  for (const t of topics) {
    topicLevelMap.set(t.id, t.level);
  }

  const seen = new Set<string>();
  const catalog: CatalogCandidate[] = [];

  const pushCandidate = (cand: CatalogCandidate) => {
    const key = normalizeWordKey(cand.word);
    if (!key || seen.has(key)) return;
    if (!exampleMatchesWord(cand.exampleEn, cand.word, languageCode)) return;
    seen.add(key);
    catalog.push(cand);
  };

  for (const card of vocab) {
    pushCandidate({
      word: card.word,
      ipa: card.ipa,
      translation: card.translation,
      category: card.category,
      exampleEn: card.exampleEn,
      examplePt: card.examplePt,
      level: topicLevelMap.get(card.topicId),
    });
  }

  const lexiconEntries: InLessonLexiconEntry[] =
    IN_LESSON_LEXICON[languageCode] ?? [];
  for (const entry of lexiconEntries) {
    pushCandidate({
      word: entry.word,
      ipa: entry.ipa,
      translation: entry.translation,
      category: entry.category,
      exampleEn: entry.exampleEn,
      examplePt: entry.examplePt,
    });
  }

  return catalog;
}

function buildCohesiveFillBlankStep(
  topic: Topic,
  unitVocab: VocabCard[],
  languageCode: LanguageCode,
): FillBlankStep | null {
  // Prefer newly introduced or expanded cards (indices 4..9), fallback to any
  const orderedIndices = [
    ...Array.from({ length: Math.max(0, unitVocab.length - 4) }, (_, i) => i + 4),
    0,
    1,
    2,
    3,
  ];

  const tryBuildFromCard = (
    targetCard: { word: string; translation: string; category: string; exampleEn: string; examplePt: string },
    idx: number,
    allowStemFallback: boolean,
  ): FillBlankStep | null => {
    const sentence = targetCard.exampleEn.trim();
    const word = targetCard.word.trim();
    if (!sentence || !word) return null;

    let matchIndex = -1;
    let matchedExact = word;

    if (
      languageCode === 'ja' ||
      languageCode === 'zh' ||
      languageCode === 'ar' ||
      CJK_OR_ARABIC_RE.test(word)
    ) {
      matchIndex = sentence.toLowerCase().indexOf(word.toLowerCase());
      if (matchIndex >= 0) {
        matchedExact = sentence.slice(matchIndex, matchIndex + word.length);
      }
    } else {
      try {
        const re = new RegExp(
          `(?<![\\p{L}\\p{N}])(${escapeRegex(word)})(?![\\p{L}\\p{N}])`,
          'iu',
        );
        const m = re.exec(sentence);
        if (m && m.index !== undefined) {
          matchIndex = m.index;
          matchedExact = m[1];
        } else if (allowStemFallback && word.length >= 4) {
          const stem = word.slice(0, Math.max(3, Math.floor(word.length * 0.65)));
          const stemRe = new RegExp(
            `(?<![\\p{L}\\p{N}])(${escapeRegex(stem)}[\\p{L}\\p{N}]*)(?![\\p{L}\\p{N}])`,
            'iu',
          );
          const sm = stemRe.exec(sentence);
          if (sm && sm.index !== undefined) {
            matchIndex = sm.index;
            matchedExact = sm[1];
          }
        }
      } catch {
        matchIndex = sentence.toLowerCase().indexOf(word.toLowerCase());
        if (matchIndex >= 0) {
          matchedExact = sentence.slice(matchIndex, matchIndex + word.length);
        }
      }
    }

    if (matchIndex < 0) return null;

    const sentenceBefore = sentence.slice(0, matchIndex);
    const sentenceAfter = sentence.slice(matchIndex + matchedExact.length);

    const distractors = unitVocab
      .filter((c) => normalizeWordKey(c.word) !== normalizeWordKey(word))
      .slice(0, 3)
      .map((c) => c.word);

    if (distractors.length < 3) return null;

    const correctIndex = idx % 4;
    const options = [...distractors];
    options.splice(correctIndex, 0, matchedExact);

    return {
      id: `${topic.id}-cohesive-vocab-cloze`,
      type: 'fill_blank',
      promptPt: `Complete a frase usando o vocabulário estudado nesta unidade (${targetCard.translation}):`,
      sentenceBefore,
      sentenceAfter,
      verbHint: `${targetCard.translation} · ${targetCard.category}`,
      options,
      correctIndex,
      explanation: `"${matchedExact}" significa "${targetCard.translation}" (${targetCard.examplePt}).`,
      hintTip: `Tradução completa: "${targetCard.examplePt}"`,
    };
  };

  for (const idx of orderedIndices) {
    const card = unitVocab[idx];
    if (!card) continue;
    const built = tryBuildFromCard(card, idx, false);
    if (built) return built;
  }

  for (const idx of orderedIndices) {
    const card = unitVocab[idx];
    if (!card) continue;
    const built = tryBuildFromCard(card, idx, true);
    if (built) return built;
  }

  const fallbackEntries = IN_LESSON_LEXICON[languageCode] ?? [];
  for (let i = 0; i < fallbackEntries.length; i++) {
    const built = tryBuildFromCard(fallbackEntries[i], i, true);
    if (built) return built;
  }

  return null;
}

/**
 * Enriquece cada unidade em tempo de carga garantindo:
 * 1. Mínimo de 10 cartões de vocabulário coesos em TODAS as unidades (incluindo Unidade 0);
 * 2. Extração de palavras usadas em Listening, Reading, Story, Dictation e Speaking para o Passo 1;
 * 3. Glossário do Reading enriquecido com até 12 termos da unidade;
 * 4. Revisão em espiral (até 2 cards de unidades anteriores quando disponível);
 * 5. Matching ampliado para 5 pares, Cloze coeso do vocabulário e Checklist no Writing;
 * 6. Passo de sons e letras (script_phonics) em idiomas com escrita não-latina (ru, ar, ja, zh).
 */
export function enrichCourseCohesion(
  languageCode: LanguageCode,
  topics: Topic[],
  vocab: VocabCard[],
): { topics: Topic[]; vocab: VocabCard[] } {
  // Número de exibição sequencial e global (1, 2, 3, … até o último bloco do curso)
  const moduleDisplayNo = new Map<string, number>();
  const vocabByTopic = new Map<string, VocabCard[]>();
  for (const card of vocab) {
    const list = vocabByTopic.get(card.topicId) ?? [];
    list.push({ ...card });
    vocabByTopic.set(card.topicId, list);
  }

  const catalog = buildLanguageCatalog(languageCode, topics, vocab);
  const phonicsCtx = createScriptPhonicsContext();
  const levelCounts: Record<CEFRLevel, number> = {
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
    C1: 0,
  };
  const enrichedVocab: VocabCard[] = [];
  const enrichedTopics: Topic[] = [];

  topics.forEach((topic, idx) => {
    const unitVocab = [...(vocabByTopic.get(topic.id) ?? [])];
    const existingWords = new Set(unitVocab.map((v) => normalizeWordKey(v.word)));

    // 1. Collect all unit texts and sentences for in-lesson word extraction
    const rawTexts: string[] = [];
    const readingGlossaryMap = new Map<
      string,
      { word: string; ipa?: string; translation: string; note?: string }
    >();

    for (const step of topic.steps) {
      if (step.type === 'listening') {
        rawTexts.push(step.audioText);
      } else if (step.type === 'reading') {
        rawTexts.push(step.text);
        for (const g of step.glossary) {
          readingGlossaryMap.set(normalizeWordKey(g.word), g);
        }
      } else if (step.type === 'story') {
        for (const l of step.lines) {
          rawTexts.push(l.text);
        }
      } else if (step.type === 'dictation') {
        rawTexts.push(step.audioText);
      } else if (step.type === 'speaking') {
        rawTexts.push(step.targetSentence);
      }
    }

    const combinedUnitText = rawTexts.join('\n');
    const unitSentences = splitSentences(combinedUnitText);

    // 2. Promote in-lesson words from Reading glossary or language catalog
    let promotedCount = 0;
    const maxPromoted = 5;

    for (const g of readingGlossaryMap.values()) {
      if (promotedCount >= maxPromoted) break;
      const key = normalizeWordKey(g.word);
      if (existingWords.has(key)) continue;

      const catMatch = catalog.find((c) => normalizeWordKey(c.word) === key);
      const matchingSentence =
        extractMatchingSentence(unitSentences, g.word, languageCode) ??
        (catMatch && exampleMatchesWord(catMatch.exampleEn, g.word, languageCode)
          ? catMatch.exampleEn
          : null);

      if (!matchingSentence) continue;

      existingWords.add(key);
      unitVocab.push({
        id: `voc-inlesson-${topic.id}-${promotedCount + 1}`,
        topicId: topic.id,
        languageCode,
        word: g.word,
        translation: g.translation,
        ipa: g.ipa || catMatch?.ipa || '',
        exampleEn: matchingSentence,
        examplePt: catMatch?.examplePt ?? g.note ?? `Uso em contexto: ${g.translation}`,
        category: topic.titlePt.split(':')[0].trim(),
        strength: 'weak',
        reviewCount: 0,
      });
      promotedCount++;
    }

    if (promotedCount < maxPromoted) {
      for (const cand of catalog) {
        if (promotedCount >= maxPromoted) break;
        const key = normalizeWordKey(cand.word);
        if (existingWords.has(key)) continue;
        if (!containsWordInText(combinedUnitText, cand.word, languageCode)) continue;

        const matchingSentence =
          extractMatchingSentence(unitSentences, cand.word, languageCode) ??
          cand.exampleEn;
        if (!exampleMatchesWord(matchingSentence, cand.word, languageCode)) continue;

        existingWords.add(key);
        unitVocab.push({
          id: `voc-inlesson-${topic.id}-${promotedCount + 1}`,
          topicId: topic.id,
          languageCode,
          word: cand.word,
          translation: cand.translation,
          ipa: cand.ipa,
          exampleEn: matchingSentence,
          examplePt:
            matchingSentence === cand.exampleEn
              ? cand.examplePt
              : `Contexto da unidade (${cand.translation})`,
          category: cand.category || topic.titlePt.split(':')[0].trim(),
          strength: 'weak',
          reviewCount: 0,
        });
        promotedCount++;
      }
    }

    // 3. Spiral review: add up to 2 cards from earlier units when idx > 0
    const recycledLinksMap = new Map<
      string,
      { topicId: string; titlePt: string; words: string[] }
    >();
    if (idx > 0) {
      const lookbackStart = Math.max(0, idx - 3);
      let addedRecycled = 0;
      for (let prevIdx = lookbackStart; prevIdx < idx && addedRecycled < 2; prevIdx++) {
        const prevTopic = topics[prevIdx];
        const prevCards = vocabByTopic.get(prevTopic.id) ?? [];
        const candidate = prevCards.find(
          (c) =>
            !existingWords.has(normalizeWordKey(c.word)) &&
            exampleMatchesWord(c.exampleEn, c.word, languageCode),
        );
        if (candidate) {
          existingWords.add(normalizeWordKey(candidate.word));
          const prevTitle = prevTopic.titlePt.split(':')[0].trim();
          unitVocab.push({
            ...candidate,
            id: `voc-recycled-${topic.id}-${candidate.id}`,
            topicId: topic.id,
            isRecycled: true,
            recycledFromTitle: prevTitle,
          });
          const linkEntry = recycledLinksMap.get(prevTopic.id) ?? {
            topicId: prevTopic.id,
            titlePt: prevTopic.titlePt,
            words: [],
          };
          if (!linkEntry.words.includes(candidate.word)) {
            linkEntry.words.push(candidate.word);
          }
          recycledLinksMap.set(prevTopic.id, linkEntry);
          addedRecycled++;
        }
      }
    }

    // 4. Guarantee unitVocab.length >= 10 on EVERY unit (including Unit 0)
    let topUpCounter = 1;
    // Prefer same-level catalog cards first, then any catalog/lexicon card
    const prioritizedCatalog = [
      ...catalog.filter((c) => c.level === topic.level),
      ...catalog.filter((c) => c.level !== topic.level),
    ];

    for (const cand of prioritizedCatalog) {
      if (unitVocab.length >= 10) break;
      const key = normalizeWordKey(cand.word);
      if (existingWords.has(key)) continue;
      if (!exampleMatchesWord(cand.exampleEn, cand.word, languageCode)) continue;

      existingWords.add(key);
      unitVocab.push({
        id: `voc-lex-${topic.id}-${topUpCounter++}`,
        topicId: topic.id,
        languageCode,
        word: cand.word,
        translation: cand.translation,
        ipa: cand.ipa,
        exampleEn: cand.exampleEn,
        examplePt: cand.examplePt,
        category: cand.category || topic.titlePt.split(':')[0].trim(),
        strength: 'weak',
        reviewCount: 0,
      });
    }

    // 5. Enrich Reading glossaries, Matching pairs, and Writing checklists
    const hasCohesiveClozeAlready = topic.steps.some(
      (s) => s.id === `${topic.id}-cohesive-vocab-cloze`,
    );

    const updatedSteps: LessonStep[] = topic.steps.map((step) => {
      if (step.type === 'reading') {
        const rStep = step as ReadingStep;
        const glossWords = new Set(rStep.glossary.map((g) => normalizeWordKey(g.word)));
        const extraGlossary = [...rStep.glossary];

        for (const card of unitVocab) {
          if (extraGlossary.length >= 12) break;
          const key = normalizeWordKey(card.word);
          if (glossWords.has(key)) continue;
          if (containsWordInText(rStep.text, card.word, languageCode)) {
            glossWords.add(key);
            extraGlossary.push({
              word: card.word,
              ipa: card.ipa,
              translation: card.translation,
              note: card.isRecycled
                ? `Revisão em espiral (${card.recycledFromTitle})`
                : `Vocabulário da unidade: ${card.category}`,
            });
          }
        }
        return { ...rStep, glossary: extraGlossary };
      }

      if (step.type === 'matching') {
        const mStep = step as MatchingStep;
        const pairTargets = new Set(mStep.pairs.map((p) => normalizeWordKey(p.target)));
        const extraPairs = [...mStep.pairs];

        for (const card of unitVocab) {
          if (extraPairs.length >= 5) break;
          const key = normalizeWordKey(card.word);
          if (pairTargets.has(key)) continue;
          if (card.word.length <= 34 && card.translation.length <= 44) {
            pairTargets.add(key);
            extraPairs.push({
              id: `m-${topic.id}-${extraPairs.length + 1}`,
              target: card.word,
              pt: card.translation,
            });
          }
        }
        return { ...mStep, pairs: extraPairs };
      }

      if (step.type === 'writing_free') {
        const wStep = step as WritingFreeStep;
        const currentChecklist = wStep.checklist ?? [];
        const sampleCards = unitVocab.slice(0, 3);
        const sampleWords = sampleCards.map((c) => `"${c.word}"`).join(', ');
        const vocabCheck = {
          label: `Use pelo menos 1 palavra da unidade (ex.: ${sampleWords})`,
          keywords: sampleCards.map((c) => c.word.toLowerCase()),
        };
        if (!currentChecklist.some((c) => c.label.includes('palavra da unidade'))) {
          return {
            ...wStep,
            checklist: [...currentChecklist, vocabCheck],
          };
        }
      }

      if (step.type === 'listening') {
        return step as ListeningStep;
      }
      if (step.type === 'story') {
        return step as StoryStep;
      }

      return step;
    });

    // 6. Insert cohesive unit-vocab FillBlankStep after the first fill_blank (or matching/reading)
    if (!hasCohesiveClozeAlready) {
      const cohesiveCloze = buildCohesiveFillBlankStep(
        topic,
        unitVocab,
        languageCode,
      );
      if (cohesiveCloze) {
        const fillIdx = updatedSteps.findIndex((s) => s.type === 'fill_blank');
        const matchingIdx = updatedSteps.findIndex((s) => s.type === 'matching');
        const readingIdx = updatedSteps.findIndex((s) => s.type === 'reading');
        const insertAt =
          fillIdx >= 0
            ? fillIdx + 1
            : matchingIdx >= 0
              ? matchingIdx + 1
              : readingIdx >= 0
                ? readingIdx + 1
                : updatedSteps.length;
        updatedSteps.splice(insertAt, 0, cohesiveCloze);
      }
    }

    // 7. Insert Script & Phonics step for non-Latin scripts (ru, ar, ja, zh)
    const phonicsStep = buildUnitScriptPhonicsStep(
      languageCode,
      { ...topic, steps: updatedSteps },
      unitVocab,
      idx,
      phonicsCtx,
    );
    const hasPhonics = updatedSteps.some((s) => s.type === 'script_phonics');
    const finalSteps =
      phonicsStep && !hasPhonics ? [phonicsStep, ...updatedSteps] : updatedSteps;

    const lvlIdx = levelCounts[topic.level] ?? 0;
    levelCounts[topic.level] = lvlIdx + 1;
    const modGroupIdx = Math.floor(lvlIdx / 5);
    const moduleIndex = LEVEL_BASE[topic.level] + modGroupIdx + 1;
    const modThemes = MODULE_THEMES_BY_LEVEL[topic.level];
    const modKey = `${topic.level}:${modGroupIdx}`;
    let displayNo = moduleDisplayNo.get(modKey);
    if (displayNo === undefined) {
      displayNo = moduleDisplayNo.size + 1;
      moduleDisplayNo.set(modKey, displayNo);
    }
    const isPtEnglishBase =
      languageCode === 'pt' && topic.level !== 'B2' && topic.level !== 'C1';
    const moduleTitlePt =
      topic.moduleTitlePt ||
      `${isPtEnglishBase ? 'Module' : 'Módulo'} ${displayNo} · ${
        modThemes[modGroupIdx] ??
        `${modThemes[modThemes.length - 1]} ${modGroupIdx - modThemes.length + 2}`
      }`;

    enrichedVocab.push(...unitVocab);
    enrichedTopics.push({
      ...topic,
      moduleIndex,
      moduleTitlePt,
      recycledLinks: Array.from(recycledLinksMap.values()).slice(0, 3),
      steps: finalSteps,
    });
  });

  return { topics: enrichedTopics, vocab: enrichedVocab };
}

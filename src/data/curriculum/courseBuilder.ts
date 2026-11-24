import type {
  CEFRLevel,
  GlossWord,
  LanguageCode,
  TipCategory,
  Topic,
  VocabCard,
} from '../../types/learning';
import { getImmersionStrings, isImmersionLevel } from '../../utils/immersion';

export interface RichLanguageBlueprint {
  id: string;
  level: CEFRLevel;
  titlePt: string;
  titleTarget: string;
  subtitle: string;
  icon: string;
  color: string;
  minutes: number;
  tipTitle: string;
  tipSummary: string;
  tipDetails: string;
  aff: string;
  neg: string;
  int: string;
  exampleTarget: string;
  examplePt: string;
  tip2Category?: TipCategory;
  tip2Title?: string;
  tip2Summary?: string;
  tip2Details?: string;
  tip2Warning?: string;
  audioText: string;
  listenQ: string;
  listenRight: string;
  listenWrong: string;
  readTitle: string;
  readFormat?: 'chat' | 'menu' | 'email' | 'boarding_pass' | 'article';
  readText: string;
  glossary?: GlossWord[];
  readQ: string;
  readRight: string;
  readWrong: string;
  dictationTarget: string;
  dictationPt: string;
  fillBefore: string;
  fillAfter: string;
  fillHint: string;
  fillOptions: string[];
  storyTitle: string;
  storyLine1: string;
  storyLine1Pt: string;
  storyLine2: string;
  storyLine2Pt: string;
  storyQ: string;
  storyRight: string;
  storyWrong: string;
  speakTarget: string;
  speakPt: string;
  speakIpa: string;
  speakBr: string;
  speakFocus: string;
  writePrompt: string;
  writeModel: string;
  vocab: Array<{
    word: string;
    ipa: string;
    pt: string;
    cat: string;
    exampleTarget?: string;
    examplePt?: string;
  }>;
}

export interface CourseDialectMeta {
  languageCode: LanguageCode;
  languageNamePt: string;
  speaker1: string;
  dialect1: string;
  speaker2: string;
  dialect2: string;
  settingPt: string;
}

function rotateOptions(
  options: string[],
  shift: number,
): { options: string[]; correctIndex: number } {
  if (options.length === 0) return { options: [], correctIndex: 0 };
  const s = ((shift % options.length) + options.length) % options.length;
  if (s === 0) return { options: [...options], correctIndex: 0 };
  const rotated = [...options.slice(options.length - s), ...options.slice(0, options.length - s)];
  return { options: rotated, correctIndex: s };
}

function buildAutoGlossary(b: RichLanguageBlueprint): GlossWord[] {
  const lowerText = b.readText.toLowerCase();
  if (b.glossary && b.glossary.length > 0) {
    return b.glossary.filter((g) => lowerText.includes(g.word.toLowerCase()));
  }
  const picked: GlossWord[] = [];
  for (const v of b.vocab) {
    const cleanWord = v.word.replace(/[¡!¿?.,;:()]/g, '').trim();
    if (!cleanWord) continue;
    const candidate = cleanWord.split(/\s+/)[0];
    const matchTarget = lowerText.includes(cleanWord.toLowerCase())
      ? cleanWord
      : candidate.length >= 4 && lowerText.includes(candidate.toLowerCase())
        ? candidate
        : null;
    if (matchTarget && !picked.some((p) => p.word.toLowerCase() === matchTarget.toLowerCase())) {
      picked.push({
        word: matchTarget,
        translation: v.pt,
        ipa: v.ipa,
      });
    }
    if (picked.length >= 3) break;
  }
  return picked;
}

export function buildRichLanguageTopic(
  b: RichLanguageBlueprint,
  idx: number,
  meta: CourseDialectMeta,
): Topic {
  const listenOdd = idx % 2 === 1;
  const listenOptions = listenOdd
    ? [b.listenWrong, b.listenRight]
    : [b.listenRight, b.listenWrong];

  const readOdd = idx % 2 === 1;
  const readOptions = readOdd ? [b.readWrong, b.readRight] : [b.readRight, b.readWrong];

  const storyOdd = idx % 2 === 1;
  const storyOptions = storyOdd
    ? [b.storyWrong, b.storyRight]
    : [b.storyRight, b.storyWrong];

  const fillRotated = rotateOptions(b.fillOptions, idx % 4);
  const glossary = buildAutoGlossary(b);
  const matchingPairs = b.vocab.slice(0, 3).map((v, vIdx) => ({
    id: `${b.id}-m-${vIdx + 1}`,
    target: v.word,
    pt: v.pt,
  }));

  const imm = getImmersionStrings(meta.languageCode, b.level);
  const immersion = isImmersionLevel(b.level);

  const leadVocab = b.vocab[0];
  const tip2Category: TipCategory = b.tip2Category ?? 'pronunciation';
  const tip2Title =
    b.tip2Title ??
    `${imm.tip2TitlePrefix}: "${leadVocab?.word ?? b.titleTarget}"`;
  const tip2Summary = b.tip2Summary ?? b.speakFocus;
  const tip2Details =
    b.tip2Details ??
    imm.tip2DetailsTemplate(b.speakTarget, b.speakIpa, b.speakBr);
  const tip2Warning =
    b.tip2Warning ??
    imm.keyVocabWarning(
      leadVocab?.word ?? '',
      leadVocab?.ipa ?? '',
      leadVocab?.pt ?? '',
    );

  return {
    id: b.id,
    languageCode: meta.languageCode,
    titlePt: immersion ? b.titleTarget : b.titlePt,
    titleEn: b.titleTarget,
    subtitle: b.subtitle,
    level: b.level,
    estimatedMinutes: b.minutes,
    icon: b.icon,
    color: b.color,
    topicTipsSummary: [
      b.tipTitle,
      b.tipSummary,
      `${imm.pronunciationPrefix}: ${b.speakFocus}`,
    ],
    steps: [
      {
        id: `${b.id}-tip`,
        type: 'tip',
        tip: {
          id: `tip-${b.id}`,
          category: 'grammar',
          title: b.tipTitle,
          summary: b.tipSummary,
          details: b.tipDetails,
          grammarFormula: {
            aff: `[+] ${b.aff}`,
            neg: `[-] ${b.neg}`,
            int: `[?] ${b.int}`,
          },
          examples: [{ en: b.exampleTarget, pt: b.examplePt }],
        },
      },
      {
        id: `${b.id}-tip-2`,
        type: 'tip',
        tip: {
          id: `tip2-${b.id}`,
          category: tip2Category,
          title: tip2Title,
          summary: tip2Summary,
          details: tip2Details,
          examples: [{ en: b.speakTarget, pt: b.speakPt }],
          warning: tip2Warning,
        },
      },
      {
        id: `${b.id}-listen`,
        type: 'listening',
        speakerLabel: immersion
          ? `${imm.speakerAudioLabel} · ${b.level}`
          : `Áudio em ${meta.languageNamePt} · ${b.level}`,
        contextPt: imm.listeningContext,
        audioText: b.audioText,
        question: b.listenQ,
        options: listenOptions,
        correctIndex: listenOdd ? 1 : 0,
        explanation: `${imm.audioSaysPrefix}: "${b.audioText}".`,
        hintTip: imm.listeningHint,
      },
      {
        id: `${b.id}-read`,
        type: 'reading',
        title: b.readTitle,
        format: b.readFormat ?? 'article',
        text: b.readText,
        glossary,
        question: b.readQ,
        options: readOptions,
        correctIndex: readOdd ? 1 : 0,
        explanation: imm.answerInText,
        hintTip: imm.readingHint,
      },
      {
        id: `${b.id}-match`,
        type: 'matching',
        promptPt: immersion
          ? imm.matchingPrompt
          : `Associe as expressões em ${meta.languageNamePt} ao seu significado:`,
        pairs: matchingPairs,
        hintTip: imm.matchingHint,
      },
      {
        id: `${b.id}-dict`,
        type: 'dictation',
        promptPt: immersion
          ? imm.dictationPrompt
          : `Ditado Auditivo em ${meta.languageNamePt}: ouça e escreva a frase:`,
        audioText: b.dictationTarget,
        translationPt: b.dictationPt,
        hintTip: imm.dictationHint,
      },
      {
        id: `${b.id}-fill`,
        type: 'fill_blank',
        promptPt: immersion
          ? imm.fillBlankPrompt
          : `Complete a frase em ${meta.languageNamePt}:`,
        sentenceBefore: b.fillBefore,
        sentenceAfter: b.fillAfter,
        verbHint: b.fillHint,
        options: fillRotated.options,
        correctIndex: fillRotated.correctIndex,
        explanation: `${imm.correctFormPrefix}: "${b.fillOptions[0]}".`,
        hintTip: imm.fillBlankHint,
      },
      {
        id: `${b.id}-story`,
        type: 'story',
        title: b.storyTitle,
        settingPt: immersion ? b.subtitle : meta.settingPt,
        lines: [
          {
            speaker: meta.speaker1,
            voice: 'male',
            dialectCode: meta.dialect1,
            text: b.storyLine1,
            translationPt: b.storyLine1Pt,
          },
          {
            speaker: meta.speaker2,
            voice: 'female',
            dialectCode: meta.dialect2,
            text: b.storyLine2,
            translationPt: b.storyLine2Pt,
          },
        ],
        question: b.storyQ,
        options: storyOptions,
        correctIndex: storyOdd ? 1 : 0,
        explanation: `${imm.confirmedInLinePrefix}: "${b.storyLine2}".`,
        hintTip: imm.storyHint,
      },
      {
        id: `${b.id}-speak`,
        type: 'speaking',
        promptPt: immersion
          ? imm.speakingPrompt
          : `Pratique em voz alta em ${meta.languageNamePt}:`,
        targetSentence: b.speakTarget,
        translationPt: b.speakPt,
        ipa: b.speakIpa,
        brPhoneticHint: b.speakBr,
        focusTip: b.speakFocus,
      },
      {
        id: `${b.id}-write`,
        type: 'writing_free',
        promptPt: b.writePrompt,
        scenarioPt: immersion
          ? imm.writingScenario
          : `Escreva sua resposta em ${meta.languageNamePt} para praticar (ou envie ao Prof. Silas).`,
        minWords: 6,
        checklist: [
          {
            label: immersion
              ? imm.writingMinWordsLabel
              : `Pelo menos 6 palavras em ${meta.languageNamePt}`,
            keywords: [' '],
          },
        ],
        modelAnswer: b.writeModel,
        hintTip: imm.writingHint,
      },
    ],
  };
}

function normalizeTokenForMatch(raw: string): string {
  return raw
    .normalize('NFKC')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[¡!¿?.,;:«»"'`“”‘’]/g, ' ')
    .trim()
    .toLowerCase()
    .replace(
      /^(to|a|an|the|el|la|los|las|un|una|unos|unas|le|l'|les|il|lo|i|gli|der|die|das|ein|eine|een|het|de|en|ett|’n)\s+/i,
      '',
    )
    .replace(/\s+/g, ' ')
    .trim();
}

function sentenceContainsWord(sentence: string, rawWord: string): boolean {
  const normSent = sentence.normalize('NFKC').toLowerCase();
  const variants = rawWord
    .split(/[\/|]/)
    .map(normalizeTokenForMatch)
    .filter(Boolean);

  for (const v of variants) {
    if (normSent.includes(v)) return true;
    const parts = v.split(/\s+/).filter(Boolean);
    for (const part of parts) {
      const minLen = /[\u3040-\u30ff\u3400-\u9fff\u0600-\u06ff]/.test(part) ? 2 : 4;
      if (part.length >= minLen && normSent.includes(part)) {
        return true;
      }
    }
  }
  return false;
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?؟。])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 12);
}

function buildContextualFallbackExample(
  word: string,
  pt: string,
  topicTarget: string,
  topicPt: string,
  lang: LanguageCode,
  idx: number,
): { en: string; pt: string } {
  const cleanWord = word.replace(/\([^)]*\)/g, '').trim();
  const templates: Record<LanguageCode, Array<{ en: string; pt: string }>> = {
    en: [
      { en: `We often use "${cleanWord}" when talking about ${topicTarget.toLowerCase()}.`, pt: `Usamos "${cleanWord}" (${pt}) ao falar sobre ${topicPt}.` },
      { en: `Could you repeat "${cleanWord}" in a natural sentence?`, pt: `Você poderia repetir "${cleanWord}" (${pt}) em uma frase natural?` },
      { en: `Remember to apply "${cleanWord}" during real conversations today.`, pt: `Lembre-se de usar "${cleanWord}" (${pt}) em conversas reais hoje.` },
      { en: `In this context, "${cleanWord}" expresses "${pt}" clearly.`, pt: `Neste contexto, "${cleanWord}" expressa "${pt}" com clareza.` },
    ],
    es: [
      { en: `En esta situación usamos "${cleanWord}" para expresar "${pt}".`, pt: `Nesta situação usamos "${cleanWord}" para expressar "${pt}".` },
      { en: `¿Puedes usar "${cleanWord}" en una frase sobre ${topicTarget.toLowerCase()}?`, pt: `Você consegue usar "${cleanWord}" (${pt}) em uma frase sobre ${topicPt}?` },
      { en: `Recuerda practicar "${cleanWord}" en voz alta cada día.`, pt: `Lembre-se de praticar "${cleanWord}" (${pt}) em voz alta todos os dias.` },
      { en: `La expresión "${cleanWord}" es muy útil en conversaciones reales.`, pt: `A expressão "${cleanWord}" (${pt}) é muito útil em conversas reais.` },
    ],
    fr: [
      { en: `Dans ce contexte, on emploie souvent « ${cleanWord} » au quotidien.`, pt: `Neste contexto, usa-se muito "${cleanWord}" (${pt}) no dia a dia.` },
      { en: `Pouvez-vous utiliser « ${cleanWord} » dans une phrase complète ?`, pt: `Você consegue usar "${cleanWord}" (${pt}) em uma frase completa?` },
      { en: `N’oubliez pas de réutiliser « ${cleanWord} » à l’oral aujourd’hui.`, pt: `Não esqueça de reutilizar "${cleanWord}" (${pt}) na fala hoje.` },
      { en: `L’expression « ${cleanWord} » est essentielle pour parler de ${topicTarget.toLowerCase()}.`, pt: `A expressão "${cleanWord}" (${pt}) é essencial em ${topicPt}.` },
    ],
    it: [
      { en: `In questo contesto si usa spesso "${cleanWord}" nella vita reale.`, pt: `Neste contexto usa-se muito "${cleanWord}" (${pt}) na vida real.` },
      { en: `Prova a inserire "${cleanWord}" in una frase chiara e naturale.`, pt: `Tente inserir "${cleanWord}" (${pt}) em uma frase clara e natural.` },
      { en: `Ricorda che "${cleanWord}" significa "${pt}" in questa unità.`, pt: `Lembre que "${cleanWord}" significa "${pt}" nesta unidade.` },
      { en: `Usiamo "${cleanWord}" quando parliamo di ${topicTarget.toLowerCase()}.`, pt: `Usamos "${cleanWord}" (${pt}) ao falar de ${topicPt}.` },
    ],
    de: [
      { en: `Im Alltag verwendet man „${cleanWord}“ sehr häufig in diesem Zusammenhang.`, pt: `No dia a dia usa-se muito "${cleanWord}" (${pt}) neste contexto.` },
      { en: `Kannst du einen klaren Satz mit „${cleanWord}“ bilden?`, pt: `Você consegue formar uma frase clara com "${cleanWord}" (${pt})?` },
      { en: `Merke dir „${cleanWord}“ für Gespräche über ${topicTarget}.`, pt: `Guarde "${cleanWord}" (${pt}) para conversas sobre ${topicPt}.` },
      { en: `Der Ausdruck „${cleanWord}“ passt hervorragend zu dieser Situation.`, pt: `A expressão "${cleanWord}" (${pt}) combina perfeitamente com esta situação.` },
    ],
    ru: [
      { en: `В этой ситуации часто используют выражение «${cleanWord}».`, pt: `Nesta situação usa-se com frequência "${cleanWord}" (${pt}).` },
      { en: `Попробуйте составить простое предложение со словом «${cleanWord}».`, pt: `Tente montar uma frase simples com "${cleanWord}" (${pt}).` },
      { en: `Запомните слово «${cleanWord}» для живого общения каждый день.`, pt: `Memorize "${cleanWord}" (${pt}) para a comunicação diária.` },
      { en: `Выражение «${cleanWord}» очень полезно в этой теме.`, pt: `A expressão "${cleanWord}" (${pt}) é muito útil neste tema.` },
    ],
    ja: [
      { en: `この 場面では「${cleanWord}」を よく 使います。`, pt: `Nesta situação usa-se muito "${cleanWord}" (${pt}).` },
      { en: `「${cleanWord}」を 使って 短い 文を 作ってみましょう。`, pt: `Vamos criar uma frase curta usando "${cleanWord}" (${pt}).` },
      { en: `日常会話で「${cleanWord}」は とても 便利です。`, pt: `Na conversa diária, "${cleanWord}" (${pt}) é muito útil.` },
      { en: `「${cleanWord}」の 発音と 意味を 一緒に 覚えましょう。`, pt: `Vamos memorizar a pronúncia e o sentido de "${cleanWord}" (${pt}).` },
    ],
    zh: [
      { en: `在这个场景中，大家经常使用“${cleanWord}”。`, pt: `Neste cenário, costuma-se usar bastante "${cleanWord}" (${pt}).` },
      { en: `请试着用“${cleanWord}”造一个自然的句子。`, pt: `Tente montar uma frase natural usando "${cleanWord}" (${pt}).` },
      { en: `平时交流时，“${cleanWord}”是一个非常实用的表达。`, pt: `No dia a dia, "${cleanWord}" (${pt}) é uma expressão muito prática.` },
      { en: `记住“${cleanWord}”的声调和意思，多加练习！`, pt: `Memorize o tom e o sentido de "${cleanWord}" (${pt}) e pratique!` },
    ],
    ar: [
      { en: `نستخدم عبارة «${cleanWord}» كثيراً في هذا الموقف اليومي.`, pt: `Usamos muito a expressão "${cleanWord}" (${pt}) nesta situação.` },
      { en: `حاول أن تضع «${cleanWord}» في جملة قصيرة وواضحة.`, pt: `Tente colocar "${cleanWord}" (${pt}) em uma frase curta e clara.` },
      { en: `تذكّر نطق «${cleanWord}» جيداً عند التحدث باللغة العربية.`, pt: `Lembre-se bem da pronúncia de "${cleanWord}" (${pt}) ao falar árabe.` },
      { en: `كلمة «${cleanWord}» مهمة جداً في هذا السياق.`, pt: `A palavra "${cleanWord}" (${pt}) é muito importante neste contexto.` },
    ],
    nl: [
      { en: `In het dagelijks leven gebruik je „${cleanWord}“ heel vaak.`, pt: `No dia a dia você usa "${cleanWord}" (${pt}) com muita frequência.` },
      { en: `Kun je een duidelijke zin maken met „${cleanWord}“?`, pt: `Você consegue montar uma frase clara com "${cleanWord}" (${pt})?` },
      { en: `Onthoud „${cleanWord}“ voor gesprekken over ${topicTarget.toLowerCase()}.`, pt: `Guarde "${cleanWord}" (${pt}) para conversas sobre ${topicPt}.` },
      { en: `De uitdrukking „${cleanWord}“ past heel goed bij dit onderwerp.`, pt: `A expressão "${cleanWord}" (${pt}) combina muito bem com este assunto.` },
    ],
    af: [
      { en: `In die alledaagse lewe gebruik ons „${cleanWord}“ baie gereeld.`, pt: `No dia a dia usamos "${cleanWord}" (${pt}) com muita frequência.` },
      { en: `Kan jy ’n duidelike sin met „${cleanWord}“ maak?`, pt: `Você consegue criar uma frase clara com "${cleanWord}" (${pt})?` },
      { en: `Onthou „${cleanWord}“ wanneer jy oor ${topicTarget.toLowerCase()} praat.`, pt: `Lembre-se de "${cleanWord}" (${pt}) ao falar sobre ${topicPt}.` },
      { en: `Die uitdrukking „${cleanWord}“ is baie nuttig in hierdie konteks.`, pt: `A expressão "${cleanWord}" (${pt}) é muito útil neste contexto.` },
    ],
    sv: [
      { en: `I vardagen använder man ofta „${cleanWord}“ i det här sammanhanget.`, pt: `No dia a dia usa-se muito "${cleanWord}" (${pt}) neste contexto.` },
      { en: `Kan du bilda en tydlig mening med „${cleanWord}“?`, pt: `Você consegue formar uma frase clara com "${cleanWord}" (${pt})?` },
      { en: `Kom ihåg „${cleanWord}“ när du pratar om ${topicTarget.toLowerCase()}.`, pt: `Lembre-se de "${cleanWord}" (${pt}) ao falar sobre ${topicPt}.` },
      { en: `Uttrycket „${cleanWord}“ passar utmärkt i den här situationen.`, pt: `A expressão "${cleanWord}" (${pt}) encaixa perfeitamente nesta situação.` },
    ],
  };
  const list = templates[lang] ?? templates.en;
  return list[idx % list.length];
}

export function buildLanguageVocab(
  blueprints: RichLanguageBlueprint[],
  languageCode: LanguageCode,
): VocabCard[] {
  return blueprints.flatMap((b) => {
    const usedEn = new Set<string>();

    const exactPairs: Array<{ en: string; pt: string }> = [
      { en: b.exampleTarget, pt: b.examplePt },
      { en: b.speakTarget, pt: b.speakPt },
      { en: b.dictationTarget, pt: b.dictationPt },
      { en: b.storyLine1, pt: b.storyLine1Pt },
      { en: b.storyLine2, pt: b.storyLine2Pt },
    ].filter((p) => p.en && p.pt);

    const fillCompleted =
      b.fillOptions[0] && (b.fillBefore || b.fillAfter)
        ? `${b.fillBefore}${b.fillOptions[0]}${b.fillAfter}`.trim()
        : '';

    const rawSentences = [
      ...[b.aff, b.neg, b.int].filter(
        (s) => s && s.length >= 12 && !/[|\[\]]/.test(s),
      ),
      ...(fillCompleted.length >= 12 && !/[()]/.test(fillCompleted)
        ? [fillCompleted]
        : []),
      ...splitIntoSentences(b.audioText),
      ...splitIntoSentences(b.readText),
      ...splitIntoSentences(b.writeModel),
    ];

    return b.vocab.map((v, vIdx) => {
      let chosenEn = '';
      let chosenPt = '';

      if (v.exampleTarget && v.examplePt && !usedEn.has(v.exampleTarget.trim().toLowerCase())) {
        chosenEn = v.exampleTarget.trim();
        chosenPt = v.examplePt.trim();
      }

      if (!chosenEn) {
        const matchedPair = exactPairs.find(
          (p) =>
            !usedEn.has(p.en.trim().toLowerCase()) &&
            sentenceContainsWord(p.en, v.word),
        );
        if (matchedPair) {
          chosenEn = matchedPair.en.trim();
          chosenPt = matchedPair.pt.trim();
        }
      }

      if (!chosenEn) {
        const matchedSentence = rawSentences.find(
          (s) =>
            !usedEn.has(s.trim().toLowerCase()) &&
            sentenceContainsWord(s, v.word),
        );
        if (matchedSentence) {
          chosenEn = matchedSentence.trim();
          chosenPt = `Uso de "${v.word}" (${v.pt}) — ${b.titlePt}`;
        }
      }

      if (!chosenEn) {
        const fallback = buildContextualFallbackExample(
          v.word,
          v.pt,
          b.titleTarget,
          b.titlePt,
          languageCode,
          vIdx,
        );
        chosenEn = fallback.en;
        chosenPt = fallback.pt;
        if (usedEn.has(chosenEn.toLowerCase())) {
          chosenEn = `${chosenEn} (${vIdx + 1})`;
        }
      }

      usedEn.add(chosenEn.toLowerCase());

      return {
        id: `voc-${b.id}-${vIdx + 1}`,
        topicId: b.id,
        languageCode,
        word: v.word,
        translation: v.pt,
        ipa: v.ipa,
        exampleEn: chosenEn,
        examplePt: chosenPt,
        category: v.cat,
        strength: 'weak',
        reviewCount: 0,
      };
    });
  });
}

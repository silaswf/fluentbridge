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
  vocab: Array<{ word: string; ipa: string; pt: string; cat: string }>;
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

export function buildLanguageVocab(
  blueprints: RichLanguageBlueprint[],
  languageCode: LanguageCode,
): VocabCard[] {
  return blueprints.flatMap((b) =>
    b.vocab.map((v, vIdx) => ({
      id: `voc-${b.id}-${vIdx + 1}`,
      topicId: b.id,
      languageCode,
      word: v.word,
      translation: v.pt,
      ipa: v.ipa,
      exampleEn: b.exampleTarget,
      examplePt: b.examplePt,
      category: v.cat,
      strength: 'weak',
      reviewCount: 0,
    })),
  );
}

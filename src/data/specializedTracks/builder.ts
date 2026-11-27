/**
 * @file src/data/specializedTracks/builder.ts
 * @description Tipos, metadados e construtor compartilhado (buildUnitAndVocab) para as 4 Trilhas Especializadas inéditas em todos os 17 idiomas.
 * @exports SpecializedTrackId, SpecializedTrackMeta, SPECIALIZED_TRACKS_META, RawVocabSpec, RawUnitSpec, buildUnitAndVocab
 */
import type {
  CEFRLevel,
  LanguageCode,
  LessonStep,
  TipCategory,
  Topic,
  TrackTag,
  VocabCard,
} from '../../types/learning';

export type SpecializedTrackId = 'business' | 'tech' | 'health' | 'travel';

export interface SpecializedTrackMeta {
  id: SpecializedTrackId;
  titlePt: string;
  subtitlePt: string;
  badgePt: string;
  icon: 'Briefcase' | 'Cpu' | 'HeartPulse' | 'Plane';
  accentColor: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  trackTags: TrackTag[];
}

export const SPECIALIZED_TRACKS_META: SpecializedTrackMeta[] = [
  {
    id: 'business',
    titlePt: 'Negócios & Liderança',
    subtitlePt: 'Cap table, governança de conselho, M&A e unit economics SaaS.',
    badgePt: 'Executivo B2–C1',
    icon: 'Briefcase',
    accentColor: '#4F46E5',
    bgClass: 'bg-indigo-50/70',
    borderClass: 'border-indigo-200',
    badgeClass: 'bg-indigo-100 text-indigo-800',
    trackTags: ['business', 'career'],
  },
  {
    id: 'tech',
    titlePt: 'Tecnologia & Engenharia',
    subtitlePt: 'Resiliência distribuída, observabilidade, SLOs e contratos de API.',
    badgePt: 'Engenharia B2–C1',
    icon: 'Cpu',
    accentColor: '#0891B2',
    bgClass: 'bg-cyan-50/70',
    borderClass: 'border-cyan-200',
    badgeClass: 'bg-cyan-100 text-cyan-800',
    trackTags: ['career', 'business'],
  },
  {
    id: 'health',
    titlePt: 'Saúde & Prática Clínica',
    subtitlePt: 'Anamnese, protocolos de triagem, farmacovigilância e telemedicina.',
    badgePt: 'Clínico B1–C1',
    icon: 'HeartPulse',
    accentColor: '#DB2777',
    bgClass: 'bg-rose-50/70',
    borderClass: 'border-rose-200',
    badgeClass: 'bg-rose-100 text-rose-800',
    trackTags: ['career', 'daily'],
  },
  {
    id: 'travel',
    titlePt: 'Viagens & Mobilidade Global',
    subtitlePt: 'Rerouting aéreo, despacho aduaneiro, sub-rogação e assistência consular.',
    badgePt: 'Mobilidade B1–C1',
    icon: 'Plane',
    accentColor: '#2563EB',
    bgClass: 'bg-blue-50/70',
    borderClass: 'border-blue-200',
    badgeClass: 'bg-blue-100 text-blue-800',
    trackTags: ['travel', 'daily'],
  },
];

export interface RawVocabSpec {
  word: string;
  translation: string;
  ipa: string;
  exampleTarget: string;
  examplePt: string;
  visualConceptId: string;
}

export interface RawUnitSpec {
  trackId: SpecializedTrackId;
  unitIndex: 1 | 2 | 3;
  level: CEFRLevel;
  titlePt: string;
  titleEn: string;
  subtitle: string;
  estimatedMinutes: number;
  coverConceptId: string;
  tipCategory: TipCategory;
  tipTitle: string;
  tipSummary: string;
  tipDetails: string;
  tipExamples: Array<{ en: string; pt: string; highlight?: string }>;
  vocab: RawVocabSpec[];
  listening: {
    speakerLabel: string;
    contextPt: string;
    audioText: string;
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
    hintTip: string;
  };
  reading: {
    title: string;
    format: 'email' | 'article' | 'chat';
    text: string;
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
    hintTip: string;
  };
  speaking: {
    promptPt: string;
    targetSentence: string;
    translationPt: string;
    ipa: string;
    brPhoneticHint: string;
    focusTip: string;
  };
  writing: {
    promptPt: string;
    scenarioPt: string;
    minWords: number;
    checklist: Array<{ label: string; keywords: string[] }>;
    modelAnswer: string;
    hintTip: string;
  };
}

const TRACK_META_MAP: Record<SpecializedTrackId, SpecializedTrackMeta> = {
  business: SPECIALIZED_TRACKS_META[0],
  tech: SPECIALIZED_TRACKS_META[1],
  health: SPECIALIZED_TRACKS_META[2],
  travel: SPECIALIZED_TRACKS_META[3],
};

export function buildUnitAndVocab(
  lang: LanguageCode,
  spec: RawUnitSpec,
): { topic: Topic; vocab: VocabCard[] } {
  const meta = TRACK_META_MAP[spec.trackId];
  const topicId = `spec-${lang}-${spec.trackId}-${spec.unitIndex}`;

  const vocab: VocabCard[] = spec.vocab.map((v, idx) => ({
    id: `${topicId}-v${idx + 1}`,
    topicId,
    languageCode: lang,
    word: v.word,
    translation: v.translation,
    ipa: v.ipa,
    exampleEn: v.exampleTarget,
    examplePt: v.examplePt,
    category: `specialized_${spec.trackId}`,
    strength: 'weak',
    reviewCount: 0,
    visualConceptId: v.visualConceptId,
  }));

  const steps: LessonStep[] = [
    {
      id: `${topicId}-vocab`,
      type: 'vocab_intro',
      titlePt: `Léxico Técnico: ${spec.titlePt}`,
      cards: vocab,
    },
    {
      id: `${topicId}-tip`,
      type: 'tip',
      tip: {
        id: `${topicId}-tip-content`,
        category: spec.tipCategory,
        title: spec.tipTitle,
        summary: spec.tipSummary,
        details: spec.tipDetails,
        examples: spec.tipExamples,
      },
    },
    {
      id: `${topicId}-listen`,
      type: 'listening',
      speakerLabel: spec.listening.speakerLabel,
      contextPt: spec.listening.contextPt,
      audioText: spec.listening.audioText,
      question: spec.listening.question,
      options: spec.listening.options,
      correctIndex: spec.listening.correctIndex,
      explanation: spec.listening.explanation,
      hintTip: spec.listening.hintTip,
    },
    {
      id: `${topicId}-read`,
      type: 'reading',
      title: spec.reading.title,
      format: spec.reading.format,
      text: spec.reading.text,
      glossary: spec.vocab.slice(0, 4).map((v) => ({
        word: v.word,
        translation: v.translation,
        ipa: v.ipa,
      })),
      question: spec.reading.question,
      options: spec.reading.options,
      correctIndex: spec.reading.correctIndex,
      explanation: spec.reading.explanation,
      hintTip: spec.reading.hintTip,
    },
    {
      id: `${topicId}-speak`,
      type: 'speaking',
      promptPt: spec.speaking.promptPt,
      targetSentence: spec.speaking.targetSentence,
      translationPt: spec.speaking.translationPt,
      ipa: spec.speaking.ipa,
      brPhoneticHint: spec.speaking.brPhoneticHint,
      focusTip: spec.speaking.focusTip,
    },
    {
      id: `${topicId}-write`,
      type: 'writing_free',
      promptPt: spec.writing.promptPt,
      scenarioPt: spec.writing.scenarioPt,
      minWords: spec.writing.minWords,
      checklist: spec.writing.checklist,
      modelAnswer: spec.writing.modelAnswer,
      hintTip: spec.writing.hintTip,
    },
  ];

  const topic: Topic = {
    id: topicId,
    languageCode: lang,
    titlePt: spec.titlePt,
    titleEn: spec.titleEn,
    subtitle: spec.subtitle,
    level: spec.level,
    estimatedMinutes: spec.estimatedMinutes,
    icon: meta.icon,
    color: meta.accentColor,
    coverConceptId: spec.coverConceptId,
    trackTags: meta.trackTags,
    topicTipsSummary: [spec.tipTitle, spec.tipSummary],
    steps,
  };

  return { topic, vocab };
}

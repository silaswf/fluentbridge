import type {
  ClassGroup,
  PlatformState,
  StudentSubmission,
  Topic,
  UserProfile,
  VocabCard,
} from '../types/learning';
import {
  AFRIKAANS_100_TOPICS,
  AFRIKAANS_100_VOCAB,
  ARABIC_100_TOPICS,
  ARABIC_100_VOCAB,
  CHINESE_100_TOPICS,
  CHINESE_100_VOCAB,
  DUTCH_100_TOPICS,
  DUTCH_100_VOCAB,
  ENGLISH_ALL_TOPICS,
  ENGLISH_ALL_VOCAB,
  FRENCH_100_TOPICS,
  FRENCH_100_VOCAB,
  GERMAN_100_TOPICS,
  GERMAN_100_VOCAB,
  ITALIAN_100_TOPICS,
  ITALIAN_100_VOCAB,
  JAPANESE_100_TOPICS,
  JAPANESE_100_VOCAB,
  RUSSIAN_100_TOPICS,
  RUSSIAN_100_VOCAB,
  SPANISH_100_TOPICS,
  SPANISH_100_VOCAB,
  SWEDISH_100_TOPICS,
  SWEDISH_100_VOCAB,
  TURKISH_150_TOPICS,
  TURKISH_150_VOCAB,
  HEBREW_150_TOPICS,
  HEBREW_150_VOCAB,
  NORWEGIAN_150_TOPICS,
  NORWEGIAN_150_VOCAB,
  DANISH_150_TOPICS,
  DANISH_150_VOCAB,
  PORTUGUESE_150_TOPICS,
  PORTUGUESE_150_VOCAB,
} from './languages';

export const BUILTIN_TOPICS: Topic[] = ENGLISH_ALL_TOPICS;

export const ALL_BUILTIN_TOPICS: Topic[] = [
  ...ENGLISH_ALL_TOPICS,
  ...SPANISH_100_TOPICS,
  ...FRENCH_100_TOPICS,
  ...ITALIAN_100_TOPICS,
  ...GERMAN_100_TOPICS,
  ...RUSSIAN_100_TOPICS,
  ...JAPANESE_100_TOPICS,
  ...CHINESE_100_TOPICS,
  ...ARABIC_100_TOPICS,
  ...DUTCH_100_TOPICS,
  ...AFRIKAANS_100_TOPICS,
  ...SWEDISH_100_TOPICS,
  ...TURKISH_150_TOPICS,
  ...HEBREW_150_TOPICS,
  ...NORWEGIAN_150_TOPICS,
  ...DANISH_150_TOPICS,
  ...PORTUGUESE_150_TOPICS,
];

export const INITIAL_VOCABULARY: VocabCard[] = ENGLISH_ALL_VOCAB;

export const ALL_INITIAL_VOCABULARY: VocabCard[] = [
  ...ENGLISH_ALL_VOCAB,
  ...SPANISH_100_VOCAB,
  ...FRENCH_100_VOCAB,
  ...ITALIAN_100_VOCAB,
  ...GERMAN_100_VOCAB,
  ...RUSSIAN_100_VOCAB,
  ...JAPANESE_100_VOCAB,
  ...CHINESE_100_VOCAB,
  ...ARABIC_100_VOCAB,
  ...DUTCH_100_VOCAB,
  ...AFRIKAANS_100_VOCAB,
  ...SWEDISH_100_VOCAB,
  ...TURKISH_150_VOCAB,
  ...HEBREW_150_VOCAB,
  ...NORWEGIAN_150_VOCAB,
  ...DANISH_150_VOCAB,
  ...PORTUGUESE_150_VOCAB,
];

export function cloneInitialVocab(): VocabCard[] {
  return ALL_INITIAL_VOCABULARY.map((c) => ({ ...c }));
}

export const INITIAL_CLASSES: ClassGroup[] = [
  {
    id: 'class-a1',
    languageCode: 'en',
    name: 'Turma A1 · Fundamentos & Viagens',
    code: 'TURMA-A1',
    level: 'A1',
    schedule: 'Seg e Qua · 19h00',
    description: 'Foco em base sólida, pronúncia desde o dia 1 e comunicação cotidiana.',
    createdAt: '2026-02-01',
  },
  {
    id: 'class-b1',
    languageCode: 'en',
    name: 'Turma B1 · Carreira & Reuniões',
    code: 'TURMA-B1',
    level: 'B1',
    schedule: 'Ter e Qui · 20h00',
    description: 'Inglês para entrevistas, reuniões remotas e conversação fluente.',
    createdAt: '2026-02-05',
  },
  {
    id: 'class-vip',
    languageCode: 'en',
    name: 'Mentoria VIP · Executivos B2/C1',
    code: 'VIP-2026',
    level: 'B2',
    schedule: 'Sábados · 10h00',
    description: 'Apresentações de alto impacto, negociações e debates avançados.',
    createdAt: '2026-02-10',
  },
];

const DEFAULT_DAILY_QUESTS = {
  lessonsCompletedToday: 0,
  vocabReviewedToday: 0,
  tutorSessionsToday: 0,
  claimedQuestIds: [] as string[],
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-master-silas',
    name: 'Prof. Silas',
    email: 'silaswf@gmail.com',
    password: 'admin123',
    role: 'teacher',
    isMasterAdmin: true,
    teacherInviteCode: 'PROF-SILAS',
    avatarColor: '#0F172A',
    activeLanguage: 'en',
    dialectByLanguage: {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      it: 'it-IT',
      de: 'de-DE',
      ru: 'ru-RU',
      ja: 'ja-JP',
      zh: 'zh-CN',
      ar: 'ar-SA',
      nl: 'nl-NL',
      af: 'af-ZA',
      sv: 'sv-SE',
    },
    accent: 'en-US',
    recommendedLevel: 'C1',
    dailyGoalMinutes: 20,
    todayMinutes: 0,
    xp: 0,
    streakDays: 1,
    completedTopicIds: [],
    skillScores: { listening: 90, reading: 90, speaking: 90, writing: 90 },
    vocab: cloneInitialVocab(),
    issuedCertificates: [],
    dailyQuests: { ...DEFAULT_DAILY_QUESTS },
    createdAt: '2026-01-10',
  },
];

export const INITIAL_SUBMISSIONS: StudentSubmission[] = [];

export const DEFAULT_PLATFORM_STATE: PlatformState = {
  schoolName: 'FluentBridge Academy',
  teacherName: 'Prof. Silas',
  currentUserId: null,
  classes: INITIAL_CLASSES,
  users: INITIAL_USERS,
  customTopics: [],
  submissions: INITIAL_SUBMISSIONS,
  cloudConfig: {
    supabaseUrl: '',
    supabaseAnonKey: '',
    geminiApiKey: '',
  },
};

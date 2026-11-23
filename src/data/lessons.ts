import type {
  ClassGroup,
  PlatformState,
  StudentSubmission,
  Topic,
  UserProfile,
  VocabCard,
} from '../types/learning';
import {
  CHINESE_ALL_TOPICS,
  CHINESE_ALL_VOCAB,
  ENGLISH_ALL_TOPICS,
  ENGLISH_ALL_VOCAB,
  FRENCH_ALL_TOPICS,
  FRENCH_ALL_VOCAB,
  GERMAN_ALL_TOPICS,
  GERMAN_ALL_VOCAB,
  ITALIAN_ALL_TOPICS,
  ITALIAN_ALL_VOCAB,
  JAPANESE_ALL_TOPICS,
  JAPANESE_ALL_VOCAB,
  RUSSIAN_ALL_TOPICS,
  RUSSIAN_ALL_VOCAB,
  SPANISH_ALL_TOPICS,
  SPANISH_ALL_VOCAB,
} from './languages';

export const BUILTIN_TOPICS: Topic[] = ENGLISH_ALL_TOPICS;

export const ALL_BUILTIN_TOPICS: Topic[] = [
  ...ENGLISH_ALL_TOPICS,
  ...SPANISH_ALL_TOPICS,
  ...FRENCH_ALL_TOPICS,
  ...ITALIAN_ALL_TOPICS,
  ...GERMAN_ALL_TOPICS,
  ...RUSSIAN_ALL_TOPICS,
  ...JAPANESE_ALL_TOPICS,
  ...CHINESE_ALL_TOPICS,
];

export const INITIAL_VOCABULARY: VocabCard[] = ENGLISH_ALL_VOCAB;

export const ALL_INITIAL_VOCABULARY: VocabCard[] = [
  ...ENGLISH_ALL_VOCAB,
  ...SPANISH_ALL_VOCAB,
  ...FRENCH_ALL_VOCAB,
  ...ITALIAN_ALL_VOCAB,
  ...GERMAN_ALL_VOCAB,
  ...RUSSIAN_ALL_VOCAB,
  ...JAPANESE_ALL_VOCAB,
  ...CHINESE_ALL_VOCAB,
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

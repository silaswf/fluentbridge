/**
 * @file src/data/platformDefaults.ts
 * @description Metadados dos 17 cursos (LANGUAGE_COURSES_META) e estado inicial padrão da plataforma (DEFAULT_PLATFORM_STATE).
 * @exports LANGUAGE_COURSES_META, getLanguageCourseMeta, getActiveDialectMeta, INITIAL_CLASSES, INITIAL_USERS, INITIAL_SUBMISSIONS, DEFAULT_PLATFORM_STATE
 */
import type {
  ClassGroup,
  LanguageCode,
  LanguageCourse,
  PlatformState,
  StudentSubmission,
  UserProfile,
} from '../types/learning';

export const LANGUAGE_COURSES_META: LanguageCourse[] = [
  {
    code: 'en',
    namePt: 'Inglês',
    nativeName: 'English',
    flag: '🇬🇧',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em inglês), 200 guias gramaticais, ditado, pares mínimos, histórias e Tutor IA.',
    dialects: [
      { code: 'en-US', label: 'Americano', flag: '🇺🇸' },
      { code: 'en-GB', label: 'Britânico', flag: '🇬🇧' },
    ],
  },
  {
    code: 'es',
    namePt: 'Espanhol',
    nativeName: 'Español',
    flag: '🇪🇸',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em espanhol), 200 guias gramaticais, vozes neurais (ES/MX) e combate ao portunhol.',
    dialects: [
      { code: 'es-ES', label: 'Espanha', flag: '🇪🇸' },
      { code: 'es-MX', label: 'México', flag: '🇲🇽' },
    ],
  },
  {
    code: 'fr',
    namePt: 'Francês',
    nativeName: 'Français',
    flag: '🇫🇷',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em francês), 200 guias gramaticais, vozes neurais Gemini (FR/CA) e ligações fonéticas.',
    dialects: [
      { code: 'fr-FR', label: 'França', flag: '🇫🇷' },
      { code: 'fr-CA', label: 'Canadá', flag: '🇨🇦' },
    ],
  },
  {
    code: 'it',
    namePt: 'Italiano',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em italiano), 200 guias gramaticais, vozes neurais Gemini (IT/CH) e falsos amigos BR.',
    dialects: [
      { code: 'it-IT', label: 'Itália', flag: '🇮🇹' },
      { code: 'it-CH', label: 'Suíça (IT)', flag: '🇨🇭' },
    ],
  },
  {
    code: 'de',
    namePt: 'Alemão',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em alemão), 200 guias gramaticais, vozes neurais Gemini (DE/AT) e casos/TeKaMoLo.',
    dialects: [
      { code: 'de-DE', label: 'Alemanha', flag: '🇩🇪' },
      { code: 'de-AT', label: 'Áustria', flag: '🇦🇹' },
    ],
  },
  {
    code: 'ru',
    namePt: 'Russo',
    nativeName: 'Русский',
    flag: '🇷🇺',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em russo), 200 guias gramaticais, vozes neurais Gemini (Moscou/S. Petersburgo), cirílico e os 6 casos.',
    dialects: [
      { code: 'ru-RU', label: 'Moscou', flag: '🇷🇺' },
      { code: 'ru-SPB', label: 'S. Petersburgo', flag: '🏛️' },
    ],
  },
  {
    code: 'ja',
    namePt: 'Japonês',
    nativeName: '日本語',
    flag: '🇯🇵',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 (JLPT N5–N1) com 150 unidades (imersão B2/C1 em japonês), 200 guias gramaticais, vozes neurais Gemini (Tóquio/Kansai) e Keigo.',
    dialects: [
      { code: 'ja-JP', label: 'Tóquio', flag: '🇯🇵' },
      { code: 'ja-KANSAI', label: 'Kansai', flag: '🏯' },
    ],
  },
  {
    code: 'zh',
    namePt: 'Chinês',
    nativeName: '中文',
    flag: '🇨🇳',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 (HSK 1–6) com 150 unidades (imersão B2/C1 em mandarim), 200 guias gramaticais, vozes neurais Gemini (Pequim/Taiwan), tons e Pinyin.',
    dialects: [
      { code: 'zh-CN', label: 'Mandarim (CN)', flag: '🇨🇳' },
      { code: 'zh-TW', label: 'Taiwan (TW)', flag: '🇹🇼' },
    ],
  },
  {
    code: 'ar',
    namePt: 'Árabe',
    nativeName: 'العربية',
    flag: '🇸🇦',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em árabe, escrita RTL), 200 guias gramaticais, alfabeto árabe completo e vozes neurais (SA/EG).',
    dialects: [
      { code: 'ar-SA', label: 'Padrão (MSA)', flag: '🇸🇦' },
      { code: 'ar-EG', label: 'Egito (EG)', flag: '🇪🇬' },
    ],
  },
  {
    code: 'nl',
    namePt: 'Holandês',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em holandês), 200 guias gramaticais, ordem V2, ditongos UI/IJ e vozes neurais (NL/BE).',
    dialects: [
      { code: 'nl-NL', label: 'Holanda (NL)', flag: '🇳🇱' },
      { code: 'nl-BE', label: 'Bélgica (BE)', flag: '🇧🇪' },
    ],
  },
  {
    code: 'af',
    namePt: 'Africâner',
    nativeName: 'Afrikaans',
    flag: '🇿🇦',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em africâner), 200 guias gramaticais, dupla negação (nie...nie), STOMPI e vozes neurais (ZA/NA).',
    dialects: [
      { code: 'af-ZA', label: 'África do Sul', flag: '🇿🇦' },
      { code: 'af-NA', label: 'Namíbia (NA)', flag: '🇳🇦' },
    ],
  },
  {
    code: 'sv',
    namePt: 'Sueco',
    nativeName: 'Svenska',
    flag: '🇸🇪',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em sueco), 200 guias gramaticais, regra V2/BIFF, fika e vozes neurais (SE/FI).',
    dialects: [
      { code: 'sv-SE', label: 'Suécia (SE)', flag: '🇸🇪' },
      { code: 'sv-FI', label: 'Finlândia (FI)', flag: '🇫🇮' },
    ],
  },
  {
    code: 'tr',
    namePt: 'Turco',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em turco), 200+ guias gramaticais, harmonia vocálica, aglutinação e sotaques (TR/CY).',
    dialects: [
      { code: 'tr-TR', label: 'Istambul (TR)', flag: '🇹🇷' },
      { code: 'tr-TR-ANK', label: 'Ancara (TR)', flag: '🏛️' },
    ],
  },
  {
    code: 'he',
    namePt: 'Hebraico',
    nativeName: 'עברית',
    flag: '🇮🇱',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (escrita RTL, Alefbet completo, alternador Niqqud/Moderno), 200+ guias e vozes neurais (Tel Aviv/Jerusalém).',
    dialects: [
      { code: 'he-IL', label: 'Tel Aviv (IL)', flag: '🇮🇱' },
      { code: 'he-IL-JER', label: 'Jerusalém', flag: '🕊️' },
    ],
  },
  {
    code: 'nb',
    namePt: 'Norueguês',
    nativeName: 'Norsk (Bokmål)',
    flag: '🇳🇴',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades em Bokmål (imersão B2/C1), 200+ guias gramaticais, ordem V2, notas de Nynorsk e vozes (Oslo/Bergen).',
    dialects: [
      { code: 'nb-NO', label: 'Oslo (NO)', flag: '🇳🇴' },
      { code: 'nb-NO-BGO', label: 'Bergen (NO)', flag: '⛰️' },
    ],
  },
  {
    code: 'da',
    namePt: 'Dinamarquês',
    nativeName: 'Dansk',
    flag: '🇩🇰',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 150 unidades (imersão B2/C1 em dinamarquês), 200+ guias gramaticais, stød, vogais suaves e vozes (Copenhague/Aarhus).',
    dialects: [
      { code: 'da-DK', label: 'Copenhague (DK)', flag: '🇩🇰' },
      { code: 'da-DK-AAR', label: 'Aarhus (DK)', flag: '⛵' },
    ],
  },
  {
    code: 'pt',
    namePt: 'Português (PLE)',
    nativeName: 'Português · For English Speakers',
    flag: '🇧🇷',
    available: true,
    descriptionPt:
      'Complete Portuguese course (CEFR A1–C1) for English speakers: 150 units (English A1–B1, 100% Portuguese immersion B2–C1), 200+ grammar guides, CELPE-Bras & BR/PT accents.',
    dialects: [
      { code: 'pt-BR-SP', label: 'Brasil (São Paulo)', flag: '🇧🇷' },
      { code: 'pt-PT', label: 'Portugal (Lisboa)', flag: '🇵🇹' },
    ],
  },
];

export function getLanguageCourseMeta(code: LanguageCode): LanguageCourse {
  return (
    LANGUAGE_COURSES_META.find((c) => c.code === code) ??
    LANGUAGE_COURSES_META[0]
  );
}

export function getActiveDialectMeta(
  activeLanguage: LanguageCode,
  dialectByLanguage: Record<string, string> | undefined,
  fallbackAccent: string,
): string {
  const saved = dialectByLanguage?.[activeLanguage];
  if (saved) return saved;
  if (activeLanguage === 'en') return fallbackAccent || 'en-US';
  return getLanguageCourseMeta(activeLanguage).dialects[0]?.code ?? 'en-US';
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
    vocab: [],
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
  liveSessions: [],
  cloudConfig: {
    supabaseUrl: '',
    supabaseAnonKey: '',
    geminiApiKey: '',
  },
};

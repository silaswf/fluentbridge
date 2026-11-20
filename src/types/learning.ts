export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type SkillType = 'listening' | 'reading' | 'speaking' | 'writing';

export type TipCategory = 'grammar' | 'pronunciation' | 'false_friend' | 'culture';

export type Accent = 'en-US' | 'en-GB';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'it';

export type UserRole = 'teacher' | 'student';

export interface LanguageDialect {
  code: string;
  label: string;
  flag: string;
}

export interface LanguageCourse {
  code: LanguageCode;
  namePt: string;
  nativeName: string;
  flag: string;
  dialects: LanguageDialect[];
  available: boolean;
  descriptionPt: string;
}

export interface TipExample {
  en: string;
  pt: string;
  highlight?: string;
}

export interface GrammarFormula {
  aff: string;
  neg: string;
  int: string;
  keywords?: string;
}

export interface TipContent {
  id: string;
  category: TipCategory;
  title: string;
  summary: string;
  details: string;
  grammarFormula?: GrammarFormula;
  examples: TipExample[];
  warning?: string;
}

export interface GlossWord {
  word: string;
  translation: string;
  ipa?: string;
  note?: string;
}

export interface TipStep {
  id: string;
  type: 'tip';
  tip: TipContent;
}

export interface ListeningStep {
  id: string;
  type: 'listening';
  audioText: string;
  speakerLabel: string;
  contextPt: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hintTip: string;
}

export interface ReadingStep {
  id: string;
  type: 'reading';
  title: string;
  format: 'chat' | 'menu' | 'email' | 'boarding_pass' | 'article';
  text: string;
  glossary: GlossWord[];
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hintTip: string;
}

export interface SpeakingStep {
  id: string;
  type: 'speaking';
  promptPt: string;
  targetSentence: string;
  translationPt: string;
  ipa: string;
  brPhoneticHint: string;
  focusTip: string;
}

export interface WritingBuilderStep {
  id: string;
  type: 'writing_builder';
  promptPt: string;
  targetSentence: string;
  words: string[];
  distractors?: string[];
  explanation: string;
  hintTip: string;
}

export interface WritingChecklistItem {
  label: string;
  keywords: string[];
}

export interface WritingFreeStep {
  id: string;
  type: 'writing_free';
  promptPt: string;
  scenarioPt: string;
  minWords: number;
  checklist: WritingChecklistItem[];
  modelAnswer: string;
  hintTip: string;
}

export interface MatchingPair {
  id: string;
  target: string;
  pt: string;
}

export interface MatchingStep {
  id: string;
  type: 'matching';
  promptPt: string;
  pairs: MatchingPair[];
  hintTip: string;
}

export interface FillBlankStep {
  id: string;
  type: 'fill_blank';
  promptPt: string;
  sentenceBefore: string;
  sentenceAfter: string;
  verbHint?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hintTip: string;
}

export type LessonStep =
  | TipStep
  | ListeningStep
  | ReadingStep
  | SpeakingStep
  | WritingBuilderStep
  | WritingFreeStep
  | MatchingStep
  | FillBlankStep;

export interface Topic {
  id: string;
  languageCode?: LanguageCode;
  titlePt: string;
  titleEn: string;
  subtitle: string;
  level: CEFRLevel;
  estimatedMinutes: number;
  icon: string;
  color: string;
  isCustom?: boolean;
  topicTipsSummary: string[];
  steps: LessonStep[];
}

export interface VocabCard {
  id: string;
  topicId: string;
  languageCode?: LanguageCode;
  word: string;
  translation: string;
  ipa: string;
  exampleEn: string;
  examplePt: string;
  category: string;
  strength: 'weak' | 'medium' | 'mastered';
  reviewCount: number;
}

export interface PronunciationRubric {
  clarity: number;
  intonation: number;
  rhythm: number;
}

export interface StudentSubmission {
  id: string;
  languageCode?: LanguageCode;
  type: 'writing' | 'speaking';
  studentId: string;
  studentName: string;
  classId?: string;
  topicId: string;
  topicTitle: string;
  promptPt: string;
  responseText: string;
  audioId?: string;
  audioDataUrl?: string;
  audioPath?: string;
  audioDurationSec?: number;
  targetSentence?: string;
  autoPronunciationScore?: number;
  createdAt: string;
  status: 'pending' | 'reviewed';
  teacherFeedback?: string;
  correctedText?: string;
  teacherBadge?: string;
  pronunciationRubric?: PronunciationRubric;
}

export interface ClassGroup {
  id: string;
  languageCode?: LanguageCode;
  name: string;
  code: string;
  level: CEFRLevel;
  schedule: string;
  description: string;
  createdAt: string;
}

export interface CertificateRecord {
  id: string;
  languageCode?: LanguageCode;
  level: CEFRLevel;
  studentId: string;
  studentName: string;
  issuedAt: string;
  verificationCode: string;
  issuedBy: string;
  avgScore: number;
  totalHours: number;
  skillScores: Record<SkillType, number>;
}

export interface DailyQuestsProgress {
  lessonsCompletedToday: number;
  vocabReviewedToday: number;
  tutorSessionsToday: number;
  claimedQuestIds: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isMasterAdmin?: boolean;
  classId?: string;
  avatarColor: string;
  activeLanguage: LanguageCode;
  dialectByLanguage: Record<string, string>;
  accent: Accent;
  recommendedLevel?: CEFRLevel;
  dailyGoalMinutes: number;
  todayMinutes: number;
  xp: number;
  streakDays: number;
  completedTopicIds: string[];
  skillScores: Record<SkillType, number>;
  vocab: VocabCard[];
  issuedCertificates: CertificateRecord[];
  dailyQuests: DailyQuestsProgress;
  createdAt: string;
}

export interface CloudConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  geminiApiKey: string;
  lastSyncedAt?: string;
}

export interface PlatformState {
  schoolName: string;
  teacherName: string;
  currentUserId: string | null;
  classes: ClassGroup[];
  users: UserProfile[];
  customTopics: Topic[];
  submissions: StudentSubmission[];
  cloudConfig: CloudConfig;
  deletedUserIds?: string[];
  deletedClassIds?: string[];
  deletedTopicIds?: string[];
}

export interface AITutorScenario {
  id: string;
  languageCode?: LanguageCode;
  titlePt: string;
  titleEn: string;
  level: CEFRLevel;
  personaName: string;
  personaRole: string;
  settingPt: string;
  goalsPt: string[];
  openingEn: string;
  openingPt: string;
  initialSuggestions: string[];
}

export interface TutorMessage {
  id: string;
  sender: 'tutor' | 'student';
  textEn: string;
  translationPt?: string;
  feedbackPt?: string;
  correctedEn?: string;
  timestamp: string;
}

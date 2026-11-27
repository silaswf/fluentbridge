/**
 * @file src/types/learning.ts
 * @description Definições TypeScript centrais do domínio pedagógico: LanguageCode (17 idiomas), CEFRLevel, Topic, LessonStep, VocabCard, MockExam, UserProfile e PlatformState.
 * @exports CEFRLevel, SkillType, TipCategory, Accent, LanguageCode, UserRole, StudentEnrollmentType, LanguageDialect (+46)
 */
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type SkillType = 'listening' | 'reading' | 'speaking' | 'writing';

export type TipCategory = 'grammar' | 'pronunciation' | 'false_friend' | 'culture';

export type Accent = 'en-US' | 'en-GB';

export type LanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'ru'
  | 'ja'
  | 'zh'
  | 'ar'
  | 'nl'
  | 'af'
  | 'sv'
  | 'tr'
  | 'he'
  | 'nb'
  | 'da'
  | 'pt';

export type UserRole = 'teacher' | 'student';

export type StudentEnrollmentType = 'class' | 'vip' | 'independent';

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

export interface DictationStep {
  id: string;
  type: 'dictation';
  promptPt: string;
  audioText: string;
  translationPt: string;
  hintTip: string;
}

export interface MinimalPairOption {
  word: string;
  ipa: string;
  meaningPt: string;
}

export interface MinimalPairsStep {
  id: string;
  type: 'minimal_pairs';
  promptPt: string;
  targetWord: string;
  targetIpa: string;
  contrastWord: string;
  contrastIpa: string;
  options: MinimalPairOption[];
  correctIndex: number;
  explanation: string;
  hintTip: string;
}

export interface StoryDialogueLine {
  speaker: string;
  voice: 'female' | 'male';
  dialectCode: string;
  text: string;
  translationPt: string;
}

export interface StoryStep {
  id: string;
  type: 'story';
  title: string;
  settingPt: string;
  lines: StoryDialogueLine[];
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hintTip: string;
}

export interface VocabIntroStep {
  id: string;
  type: 'vocab_intro';
  titlePt?: string;
  cards: VocabCard[];
}

export interface ScriptPhonicsChar {
  char: string;
  reading: string;
  meaningPt: string;
  exampleWord: string;
  examplePt: string;
  strokes?: number;
  strokeHints?: string[];
  cursiveNote?: string;
  direction?: 'ltr' | 'rtl';
  jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  forms?: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
}

export interface ScriptPhonicsStep {
  id: string;
  type: 'script_phonics';
  stageLabelPt?: string;
  categoryTitlePt: string;
  introPt: string;
  languageCode: 'ru' | 'ar' | 'ja' | 'zh' | 'he';
  items: ScriptPhonicsChar[];
  soundQuiz: {
    promptPt: string;
    audioText: string;
    options: Array<{ char: string; reading: string }>;
    correctIndex: number;
    explanationPt: string;
  };
}

export type LessonStep =
  | VocabIntroStep
  | ScriptPhonicsStep
  | TipStep
  | ListeningStep
  | ReadingStep
  | SpeakingStep
  | WritingBuilderStep
  | WritingFreeStep
  | MatchingStep
  | FillBlankStep
  | DictationStep
  | MinimalPairsStep
  | StoryStep;

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
  moduleIndex?: number;
  moduleTitlePt?: string;
  conceptKey?: string;
  prerequisiteConcepts?: string[];
  recycledLinks?: Array<{ topicId: string; titlePt: string; words: string[] }>;
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
  nextReviewAt?: string;
  intervalDays?: number;
  easeFactor?: number;
  repetitions?: number;
  lapses?: number;
  isRecycled?: boolean;
  recycledFromTitle?: string;
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
  teacherId?: string;
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
  createdAtIso?: string;
  audioArchived?: boolean;
  audioExpiredAt?: string;
  status: 'pending' | 'reviewed';
  teacherFeedback?: string;
  correctedText?: string;
  teacherBadge?: string;
  pronunciationRubric?: PronunciationRubric;
}

export interface ClassGroup {
  id: string;
  languageCode?: LanguageCode;
  teacherId?: string;
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

export interface TeacherAssignment {
  id: string;
  title: string;
  description: string;
  classId?: string;
  studentId?: string;
  teacherId?: string;
  languageCode: LanguageCode;
  topicId?: string;
  dueDate: string;
  createdAt: string;
  createdBy: string;
}

export interface TopicProgressRecord {
  stepIdx: number;
  completedSteps: number[];
  totalSteps: number;
  updatedAt: string;
}

export interface MistakeEntry {
  id: string;
  languageCode: LanguageCode;
  topicId: string;
  topicTitle: string;
  skill: SkillType | 'grammar' | 'vocab';
  prompt: string;
  studentAnswer: string;
  expectedAnswer: string;
  explanation: string;
  createdAt: string;
  reviewCount: number;
  resolved?: boolean;
}

export interface PronunciationHistoryEntry {
  id: string;
  languageCode: LanguageCode;
  topicId: string;
  score: number;
  weakWords: string[];
  createdAt: string;
}

export interface ExamAttemptRecord {
  id: string;
  examId: string;
  examTypeId: string;
  languageCode: LanguageCode;
  officialScoreLabel: string;
  rawPercent: number;
  passed: boolean;
  sectionScores: Record<string, number>;
  practiceCategory?: string;
  completedAt: string;
}

export interface CommunityReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarColor: string;
  authorRole: UserRole;
  content: string;
  correctionSuggestion?: string;
  likes: string[];
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  languageCode: LanguageCode;
  authorId: string;
  authorName: string;
  authorAvatarColor: string;
  authorRole: UserRole;
  level: CEFRLevel;
  category: 'question' | 'correction' | 'culture' | 'milestone' | 'study_partner';
  title: string;
  body: string;
  targetSnippet?: string;
  likes: string[];
  reactions?: Record<string, string[]>;
  acceptedReplyId?: string;
  replies: CommunityReply[];
  pinned?: boolean;
  createdAt: string;
}

export type LearningGoalType = 'travel' | 'career' | 'exam' | 'abroad' | 'culture';

export interface LiveSessionRecord {
  id: string;
  languageCode: LanguageCode;
  teacherId: string;
  teacherName: string;
  studentId?: string;
  classId?: string;
  title: string;
  scheduledAt: string;
  durationMin: number;
  roomSlug: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  notes: string;
  generatedAssignmentId?: string;
  createdAt: string;
}

export type SubscriptionPlanId =
  | 'free'
  | 'school_grant'
  | 'student_pro'
  | 'student_vip'
  | 'school_b2b';

export type SubscriptionStatus =
  | 'lifetime_free'
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled';

export type BillingProvider = 'none' | 'manual' | 'stripe' | 'mercadopago';

export interface UserSubscription {
  planId: SubscriptionPlanId;
  status: SubscriptionStatus;
  provider?: BillingProvider;
  externalCustomerId?: string;
  externalSubscriptionId?: string;
  currentPeriodEnd?: string;
  grantedByAdmin?: boolean;
  updatedAt?: string;
}

export interface BillingConfig {
  billingEnabled: boolean;
  provider: BillingProvider;
  freeNoticePt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  teacherDisplayName?: string;
  email: string;
  password: string;
  role: UserRole;
  isMasterAdmin?: boolean;
  blocked?: boolean;
  blockedReason?: string;
  classId?: string;
  assignedTeacherId?: string;
  enrollmentType?: StudentEnrollmentType;
  teacherInviteCode?: string;
  unlinkedNoticePending?: boolean;
  unlinkedByTeacherName?: string;
  avatarColor: string;
  activeLanguage: LanguageCode;
  dialectByLanguage: Record<string, string>;
  accent: Accent;
  recommendedLevel?: CEFRLevel;
  recommendedLevelByLanguage?: Partial<Record<LanguageCode, CEFRLevel>>;
  learningGoal?: LearningGoalType;
  goalTargetDate?: string;
  dailyGoalMinutes: number;
  todayMinutes: number;
  xp: number;
  xpByLanguage?: Partial<Record<LanguageCode, number>>;
  weeklyXpByLanguage?: Partial<Record<LanguageCode, number>>;
  weeklyXpWeekKey?: string;
  pronunciationHistory?: PronunciationHistoryEntry[];
  examAttempts?: ExamAttemptRecord[];
  streakDays: number;
  completedTopicIds: string[];
  completedCheckpoints?: string[];
  topicStepProgress?: Record<string, TopicProgressRecord>;
  learnedVocabIds?: string[];
  mistakeBank?: MistakeEntry[];
  skillScores: Record<SkillType, number>;
  vocab: VocabCard[];
  issuedCertificates: CertificateRecord[];
  dailyQuests: DailyQuestsProgress;
  claimedChallengeIds?: string[];
  streakFreezes?: number;
  lastStudyDate?: string;
  themeMode?: 'light' | 'dark' | 'system';
  reminderEnabled?: boolean;
  reminderTime?: string;
  subscription?: UserSubscription;
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
  teacherAccessCode?: string;
  currentUserId: string | null;
  classes: ClassGroup[];
  users: UserProfile[];
  customTopics: Topic[];
  submissions: StudentSubmission[];
  assignments?: TeacherAssignment[];
  communityPosts?: CommunityPost[];
  liveSessions?: LiveSessionRecord[];
  cloudConfig: CloudConfig;
  billingConfig?: BillingConfig;
  deletedUserIds?: string[];
  deletedClassIds?: string[];
  deletedTopicIds?: string[];
  deletedAssignmentIds?: string[];
  deletedCommunityPostIds?: string[];
  deletedLiveSessionIds?: string[];
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

export interface ProsodyAnalysis {
  wpm: number;
  paceLabel: 'Lento' | 'Natural' | 'Rápido';
  intonationScore: number;
  fluencyScore: number;
  speechDurationSec: number;
  fillerWords: string[];
  tipPt: string;
}

export interface TutorMessage {
  id: string;
  sender: 'tutor' | 'student';
  textEn: string;
  translationPt?: string;
  feedbackPt?: string;
  correctedEn?: string;
  prosody?: ProsodyAnalysis;
  timestamp: string;
}

/**
 * @file src/types/exams.ts
 * @description Arquivo estrutural src/types/exams.ts do FluentBridge Academy.
 * @exports ExamPracticeCategory, ExamBandReference, ExamTypeMeta, ExamQuestion, ExamWritingTask, ExamSpeakingPart, ExamSpeakingTask, WritingCriterionScore (+3)
 */
import type { CEFRLevel, LanguageCode } from './learning';

export type ExamPracticeCategory =
  | 'full'
  | 'reading'
  | 'listening'
  | 'language_use'
  | 'writing'
  | 'speaking';

export interface ExamBandReference {
  label: string;
  minScore: number;
  maxScore: number;
  cefr: CEFRLevel | 'C2' | 'Pré-A1';
  meaningPt: string;
  passing?: boolean;
}

export interface ExamTypeMeta {
  id: string;
  languageCode: LanguageCode;
  name: string;
  officialOrg: string;
  scaleLabel: string;
  passingRulePt: string;
  durationMinutes: number;
  referenceTable: ExamBandReference[];
}

export interface ExamQuestion {
  id: string;
  section: 'reading' | 'listening' | 'language_use';
  passageTitle?: string;
  passageText?: string;
  audioText?: string;
  audioPlaysLimit?: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExamWritingTask {
  prompt: string;
  minWords: number;
  rubricCriteria: string[];
  expectedKeywords: string[];
  modelAnswer: string;
}

export interface ExamSpeakingPart {
  id: string;
  partLabel: string;
  prepSeconds: number;
  speakSeconds: number;
  prompt: string;
  bulletPoints: string[];
  evaluationCriteria: string[];
}

export interface ExamSpeakingTask {
  title: string;
  instructionsPt: string;
  parts: ExamSpeakingPart[];
}

export interface WritingCriterionScore {
  name: string;
  score: number;
  commentPt: string;
}

export interface AnalyticalWritingRubric {
  overallPercent: number;
  estimatedBandLabel: string;
  criteria: WritingCriterionScore[];
  strengthsPt: string;
  improvementsPt: string;
  c1c2Rewrite: string;
  usedAi: boolean;
}

export interface SpeakingEvaluationResult {
  overallPercent: number;
  wpm: number;
  criteria: WritingCriterionScore[];
  feedbackPt: string;
  usedAi: boolean;
}

export interface MockExam {
  id: string;
  examTypeId: string;
  languageCode: LanguageCode;
  simulationNumber: 1 | 2 | 3 | 4;
  title: string;
  targetCefr: CEFRLevel;
  durationMinutes: number;
  questions: ExamQuestion[];
  writingTask: ExamWritingTask;
  speakingTask?: ExamSpeakingTask;
}

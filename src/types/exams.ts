import type { CEFRLevel, LanguageCode } from './learning';

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
}

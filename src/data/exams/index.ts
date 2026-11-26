import type { MockExam } from '../../types/exams';
import type { LanguageCode } from '../../types/learning';
import { CELPIP_MOCK_EXAMS } from './examsCelpip';
import { DET_MOCK_EXAMS } from './examsDet';
import { ENGLISH_MOCK_EXAMS } from './examsEnglish';
import { enrichMockExams } from './examEnrichment';
import { GERMANIC_MOCK_EXAMS } from './examsGermanic';
import { EXAMS_NORDIC_SEMITIC } from './examsNordicSemitic';
import { ROMANCE_MOCK_EXAMS } from './examsRomance';
import { SCRIPTS_MOCK_EXAMS } from './examsScripts';

export const ALL_MOCK_EXAMS: MockExam[] = [
  ...enrichMockExams(ENGLISH_MOCK_EXAMS),
  ...CELPIP_MOCK_EXAMS,
  ...enrichMockExams(DET_MOCK_EXAMS),
  ...enrichMockExams(ROMANCE_MOCK_EXAMS),
  ...enrichMockExams(GERMANIC_MOCK_EXAMS),
  ...enrichMockExams(SCRIPTS_MOCK_EXAMS),
  ...enrichMockExams(EXAMS_NORDIC_SEMITIC),
];

export function getExamsByLanguage(languageCode: LanguageCode): MockExam[] {
  return ALL_MOCK_EXAMS.filter((e) => e.languageCode === languageCode);
}

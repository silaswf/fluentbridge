import type { MockExam } from '../../types/exams';
import type { LanguageCode } from '../../types/learning';
import { ENGLISH_MOCK_EXAMS } from './examsEnglish';
import { GERMANIC_MOCK_EXAMS } from './examsGermanic';
import { ROMANCE_MOCK_EXAMS } from './examsRomance';
import { SCRIPTS_MOCK_EXAMS } from './examsScripts';

export const ALL_MOCK_EXAMS: MockExam[] = [
  ...ENGLISH_MOCK_EXAMS,
  ...ROMANCE_MOCK_EXAMS,
  ...GERMANIC_MOCK_EXAMS,
  ...SCRIPTS_MOCK_EXAMS,
];

export function getExamsByLanguage(languageCode: LanguageCode): MockExam[] {
  return ALL_MOCK_EXAMS.filter((e) => e.languageCode === languageCode);
}

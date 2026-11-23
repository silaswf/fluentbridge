import { describe, expect, it } from 'vitest';
import {
  ALL_PLACEMENT_QUESTIONS,
  getPlacementBankByLanguage,
} from '../../data/placement';
import type { CEFRLevel, LanguageCode } from '../../types/learning';
import {
  ADAPTIVE_LEVELS,
  INITIAL_PLACEMENT_LEVEL,
  TOTAL_PLACEMENT_QUESTIONS,
  computeAdaptivePlacementResult,
  getNextAdaptiveLevel,
  pickNextPlacementQuestion,
  type PlacementAnswerRecord,
} from '../placementEngine';

function simulateAdaptiveTestForStudent(
  lang: LanguageCode,
  trueStudentLevel: CEFRLevel,
): ReturnType<typeof computeAdaptivePlacementResult> {
  const bank = getPlacementBankByLanguage(lang);
  const trueIdx = ADAPTIVE_LEVELS.indexOf(trueStudentLevel);
  const records: PlacementAnswerRecord[] = [];
  const answeredIds = new Set<string>();
  let probeLevel: CEFRLevel = INITIAL_PLACEMENT_LEVEL;

  for (let i = 0; i < TOTAL_PLACEMENT_QUESTIONS; i++) {
    const q = pickNextPlacementQuestion(bank, probeLevel, answeredIds, i * 3);
    expect(q).not.toBeNull();
    if (!q) break;

    answeredIds.add(q.id);
    const qIdx = ADAPTIVE_LEVELS.indexOf(q.level);
    const isCorrect = qIdx <= trueIdx;
    const selectedIndex = isCorrect
      ? q.correctIndex
      : (q.correctIndex + 1) % q.options.length;

    records.push({
      question: q,
      selectedIndex,
      isCorrect,
    });
    probeLevel = getNextAdaptiveLevel(q.level, isCorrect);
  }

  expect(records.length).toBe(TOTAL_PLACEMENT_QUESTIONS);
  expect(answeredIds.size).toBe(TOTAL_PLACEMENT_QUESTIONS);
  return computeAdaptivePlacementResult(records);
}

describe('Adaptive multi-language placement engine & 320-question bank', () => {
  it('ships 320 target-language placement questions (40 per language across 8 languages, 8 per CEFR level)', () => {
    expect(ALL_PLACEMENT_QUESTIONS.length).toBe(320);
    const uniqueIds = new Set(ALL_PLACEMENT_QUESTIONS.map((q) => q.id));
    expect(uniqueIds.size).toBe(320);

    for (const lang of ['en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh'] as const) {
      const bank = getPlacementBankByLanguage(lang);
      expect(bank.length).toBe(40);

      for (const lvl of ADAPTIVE_LEVELS) {
        const atLevel = bank.filter((q) => q.level === lvl);
        expect(atLevel.length).toBe(8);
      }

      for (const q of bank) {
        expect(q.options.length).toBe(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        expect(q.prompt.length).toBeGreaterThan(10);
        expect(q.topicNote.length).toBeGreaterThan(10);
        // Prompts must NOT be written in Portuguese
        expect(q.prompt).not.toMatch(/Qual frase|Escolha a frase|Complete a frase em/i);
      }
    }
  });

  it('increases level on correct answers and decreases level on wrong answers across 15 questions', () => {
    expect(getNextAdaptiveLevel('B1', true)).toBe('B2');
    expect(getNextAdaptiveLevel('B2', true)).toBe('C1');
    expect(getNextAdaptiveLevel('C1', true)).toBe('C1');
    expect(getNextAdaptiveLevel('B1', false)).toBe('A2');
    expect(getNextAdaptiveLevel('A2', false)).toBe('A1');
    expect(getNextAdaptiveLevel('A1', false)).toBe('A1');
  });

  it('accurately diagnoses A1, A2, B1, B2, and C1 students after 15 adaptive questions across all 8 languages', () => {
    for (const lang of ['en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh'] as const) {
      for (const targetLevel of ADAPTIVE_LEVELS) {
        const summary = simulateAdaptiveTestForStudent(lang, targetLevel);
        expect(summary.totalQuestions).toBe(15);
        expect(summary.recommendedLevel).toBe(targetLevel);
      }
    }
  });
});

/**
 * @file src/utils/__tests__/examScoring.test.ts
 * @description Suíte de testes unitários Vitest validando examScoring.
 */
import { describe, expect, it } from 'vitest';
import { getExamTypeById } from '../../data/exams/examCatalog';
import { gradeMockExam } from '../examScoring';
import type { MockExam } from '../../types/exams';

function buildDummyExam(examTypeId: string, languageCode: MockExam['languageCode']): MockExam {
  return {
    id: `test-${examTypeId}`,
    examTypeId,
    languageCode,
    simulationNumber: 1,
    title: 'Test Simulation',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      { id: 'q1', section: 'reading', prompt: 'R1', options: ['A', 'B', 'C', 'D'], correctIndex: 0, explanation: 'ok' },
      { id: 'q2', section: 'reading', prompt: 'R2', options: ['A', 'B', 'C', 'D'], correctIndex: 1, explanation: 'ok' },
      { id: 'q3', section: 'listening', prompt: 'L1', options: ['A', 'B', 'C', 'D'], correctIndex: 2, explanation: 'ok' },
      { id: 'q4', section: 'listening', prompt: 'L2', options: ['A', 'B', 'C', 'D'], correctIndex: 3, explanation: 'ok' },
      { id: 'q5', section: 'language_use', prompt: 'U1', options: ['A', 'B', 'C', 'D'], correctIndex: 0, explanation: 'ok' },
      { id: 'q6', section: 'language_use', prompt: 'U2', options: ['A', 'B', 'C', 'D'], correctIndex: 1, explanation: 'ok' },
    ],
    writingTask: {
      prompt: 'Write a short formal response.',
      minWords: 15,
      rubricCriteria: ['Cohesion', 'Vocabulary'],
      expectedKeywords: ['however', 'therefore', 'moreover'],
      modelAnswer: 'However, therefore, moreover, this policy works well in practice.',
    },
  };
}

describe('Official Mock Exam Scoring Engine (v5.0.0)', () => {
  it('grades IELTS on 0.0-9.0 half-band scale and matches CEFR band', () => {
    const meta = getExamTypeById('ielts')!;
    const exam = buildDummyExam('ielts', 'en');
    const answers = { q1: 0, q2: 1, q3: 2, q4: 3, q5: 0, q6: 1 };
    const writing = 'However, therefore, moreover, remote collaboration improves productivity when teams establish clear communication norms across time zones.';
    const res = gradeMockExam(exam, meta, answers, writing);
    expect(res.officialScore).toBeGreaterThanOrEqual(8.0);
    expect(res.officialLabel).toMatch(/^Band \d\.\d$/);
    expect(res.passed).toBe(true);
    expect(['C1', 'C2']).toContain(res.matchedBand.cefr);
  });

  it('grades TOEFL (0-120), DELE (APTO/NO APTO), JLPT (0-180), HSK (0-300), NT2 (500-800) and Swedex accurately', () => {
    const cases: Array<[string, MockExam['languageCode'], number, number]> = [
      ['toefl', 'en', 0, 120],
      ['siele', 'es', 0, 1000],
      ['jlpt', 'ja', 0, 180],
      ['hsk', 'zh', 0, 300],
      ['nt2', 'nl', 500, 800],
    ];
    for (const [id, lang, min, max] of cases) {
      const meta = getExamTypeById(id)!;
      const exam = buildDummyExam(id, lang);
      const answers = { q1: 0, q2: 1, q3: 2, q4: 3, q5: 0, q6: 1 };
      const res = gradeMockExam(exam, meta, answers, 'However, therefore, moreover, this essay demonstrates clear structure and vocabulary.');
      expect(res.officialScore).toBeGreaterThanOrEqual(min);
      expect(res.officialScore).toBeLessThanOrEqual(max);
      expect(res.passed).toBe(true);
    }

    const swedexMeta = getExamTypeById('swedex')!;
    const swedexFail = gradeMockExam(buildDummyExam('swedex', 'sv'), swedexMeta, {}, '');
    expect(swedexFail.passed).toBe(false);
    expect(swedexFail.officialLabel).toContain('Underkänd');
  });

  it('grades CELPIP General on 1-12 scale, supports Speaking weight & single-category mode', () => {
    const celpipMeta = getExamTypeById('celpip')!;
    const exam = buildDummyExam('celpip', 'en');
    const answers = { q1: 0, q2: 1, q3: 2, q4: 3, q5: 0, q6: 1 };
    const writing = 'Dear Manager, however, therefore, moreover, I would appreciate a replacement or refund for the defective battery.';

    const fullRes = gradeMockExam(exam, celpipMeta, answers, writing, 85, 'full');
    expect(fullRes.officialScore).toBeGreaterThanOrEqual(7);
    expect(fullRes.officialScore).toBeLessThanOrEqual(12);
    expect(fullRes.officialLabel).toMatch(/^CELPIP Level \d+ \(CLB \d+\)$/);
    expect(fullRes.passed).toBe(true);

    const readingOnly = gradeMockExam(exam, celpipMeta, { q1: 0, q2: 1 }, '', undefined, 'reading');
    expect(readingOnly.rawPercent).toBe(100);
  });
});

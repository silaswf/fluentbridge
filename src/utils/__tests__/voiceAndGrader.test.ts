/**
 * @file src/utils/__tests__/voiceAndGrader.test.ts
 * @description Suíte de testes unitários Vitest validando voiceAndGrader.
 */
import { describe, expect, it, vi } from 'vitest';
import { getExamTypeById } from '../../data/exams/examCatalog';
import { ALL_MOCK_EXAMS } from '../../data/exams';
import { gradeSpeakingWithRubric, gradeWritingWithRubric } from '../examAiGrader';
import { analyzeProsody } from '../voiceVadEngine';

describe('Full-Duplex VAD Prosody & Exam Analytical Rubric (v6.0.0)', () => {
  it('analyzes speech rate (WPM), intonation variance, fillers & fluency', () => {
    const natural = analyzeProsody(
      'I would love to schedule our meeting for tomorrow morning because the team is ready.',
      6200,
      400,
      [0.02, 0.09, 0.04, 0.12, 0.03, 0.08, 0.05],
    );
    expect(natural.wpm).toBeGreaterThanOrEqual(95);
    expect(natural.wpm).toBeLessThanOrEqual(165);
    expect(natural.paceLabel).toBe('Natural');
    expect(natural.intonationScore).toBeGreaterThanOrEqual(65);
    expect(natural.fluencyScore).toBeGreaterThanOrEqual(70);
    expect(natural.fillerWords).toEqual([]);

    const hesitant = analyzeProsody('uh um maybe tomorrow', 4500, 2500, [0.03, 0.03, 0.03, 0.03]);
    expect(hesitant.fillerWords).toEqual(['uh', 'um']);
    expect(hesitant.paceLabel).toBe('Lento');
  });

  it('evaluates Writing across 4 official criteria & Speaking across 4 oral criteria (offline fallback)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const celpip = ALL_MOCK_EXAMS.find((e) => e.examTypeId === 'celpip')!;
    const meta = getExamTypeById('celpip')!;

    const wRes = await gradeWritingWithRubric(celpip, meta, '');
    expect(wRes.criteria.length).toBe(4);
    expect(wRes.overallPercent).toBe(0);
    expect(wRes.c1c2Rewrite.length).toBeGreaterThan(20);

    const sRes = await gradeSpeakingWithRubric(celpip, meta, [
      {
        partLabel: 'Task 1',
        transcript: 'You should research the company carefully and prepare clear examples before the interview.',
        durationSec: 7,
      },
    ]);
    expect(sRes.criteria.length).toBe(4);
    expect(sRes.overallPercent).toBeGreaterThan(40);
    expect(sRes.wpm).toBeGreaterThan(40);
    vi.unstubAllGlobals();
  });
});

/**
 * @file src/utils/__tests__/examV2.test.ts
 * @description Testes unitários para Simulados Oficiais Cronometrados v2: evolução comparativa, redação cronometrada e regras do Modo Prova Real.
 * @exports none
 */
import { describe, expect, it } from 'vitest';
import { computeExamEvolutionStats } from '../../components/exams/ExamEvolutionPanel';
import {
  canPlayListeningAudio,
  computeWritingStats,
  getEffectiveAudioPlaysLimit,
} from '../../components/MockExamHub';
import type { ExamAttemptRecord } from '../../types/learning';

describe('computeExamEvolutionStats', () => {
  it('returns zeroed stats and null deltas for empty attempts', () => {
    const stats = computeExamEvolutionStats([]);
    expect(stats.totalAttempts).toBe(0);
    expect(stats.bestScore).toBe(0);
    expect(stats.averageScore).toBe(0);
    expect(stats.passRate).toBe(0);
    expect(stats.latestScore).toBeNull();
    expect(stats.previousScore).toBeNull();
    expect(stats.deltaVsPrevious).toBeNull();
    expect(stats.chronologicalAttempts).toEqual([]);
    expect(stats.skillEvolution).toHaveLength(5);
    expect(stats.skillEvolution.every((s) => s.delta === 0)).toBe(true);
  });

  it('computes KPIs, chronological order, delta vs previous, and per-skill evolution', () => {
    const attempts: ExamAttemptRecord[] = [
      {
        id: 'att-2',
        examId: 'ielts-sim-2',
        examTypeId: 'ielts',
        languageCode: 'en',
        officialScoreLabel: 'Band 7.5',
        rawPercent: 80,
        passed: true,
        practiceCategory: 'full',
        sectionScores: {
          reading: 85,
          listening: 80,
          language_use: 75,
          writing: 78,
          speaking: 82,
        },
        completedAt: '2026-11-10',
      },
      {
        id: 'att-1',
        examId: 'ielts-sim-1',
        examTypeId: 'ielts',
        languageCode: 'en',
        officialScoreLabel: 'Band 6.0',
        rawPercent: 60,
        passed: false,
        practiceCategory: 'full',
        sectionScores: {
          reading: 65,
          listening: 60,
          language_use: 55,
          writing: 58,
          speaking: 62,
        },
        completedAt: '2026-11-01',
      },
      {
        id: 'att-3',
        examId: 'ielts-sim-3',
        examTypeId: 'ielts',
        languageCode: 'en',
        officialScoreLabel: 'Band 8.0',
        rawPercent: 88,
        passed: true,
        practiceCategory: 'full',
        sectionScores: {
          reading: 90,
          listening: 88,
          language_use: 85,
          writing: 86,
          speaking: 91,
        },
        completedAt: '2026-11-20',
      },
    ];

    const stats = computeExamEvolutionStats(attempts);
    expect(stats.totalAttempts).toBe(3);
    expect(stats.bestScore).toBe(88);
    expect(stats.averageScore).toBe(76); // (60 + 80 + 88) / 3 = 76
    expect(stats.passRate).toBe(67); // 2/3 = 66.67 -> 67
    expect(stats.latestScore).toBe(88);
    expect(stats.previousScore).toBe(80);
    expect(stats.deltaVsPrevious).toBe(8);
    expect(stats.chronologicalAttempts.map((a) => a.id)).toEqual([
      'att-1',
      'att-2',
      'att-3',
    ]);

    const reading = stats.skillEvolution.find((s) => s.skill === 'reading');
    expect(reading).toEqual({
      skill: 'reading',
      label: 'Reading',
      firstScore: 65,
      latestScore: 90,
      delta: 25,
    });

    const speaking = stats.skillEvolution.find((s) => s.skill === 'speaking');
    expect(speaking?.delta).toBe(29);
  });
});

describe('computeWritingStats', () => {
  it('handles empty text as Abaixo do mínimo', () => {
    const res = computeWritingStats('   ', 150);
    expect(res.wordCount).toBe(0);
    expect(res.paragraphCount).toBe(0);
    expect(res.progressPercent).toBe(0);
    expect(res.status).toBe('Abaixo do mínimo');
  });

  it('counts words, characters, paragraphs and detects Meta atingida ✓', () => {
    const text = 'First paragraph here has ten words in total right now.\n\nSecond paragraph also has ten words in total right now.';
    const res = computeWritingStats(text, 20);
    expect(res.wordCount).toBe(20);
    expect(res.charCount).toBe(text.length);
    expect(res.paragraphCount).toBe(2);
    expect(res.progressPercent).toBe(100);
    expect(res.status).toBe('Meta atingida ✓');
  });

  it('detects Extensão avançada ★ when >= 140% of minWords', () => {
    const words = Array.from({ length: 140 }, (_, i) => `word${i}`).join(' ');
    const res = computeWritingStats(words, 100);
    expect(res.wordCount).toBe(140);
    expect(res.progressPercent).toBe(100);
    expect(res.status).toBe('Extensão avançada ★');
  });
});

describe('Real Exam Mode rules', () => {
  it('enforces max 2 listening audio plays in Real Exam mode even if questionLimit is higher', () => {
    expect(getEffectiveAudioPlaysLimit(true, 5)).toBe(2);
    expect(getEffectiveAudioPlaysLimit(false, 5)).toBe(5);
    expect(getEffectiveAudioPlaysLimit(false, undefined)).toBe(2);
  });

  it('blocks listening playback after 2 plays in Real Exam mode', () => {
    expect(canPlayListeningAudio(0, true, 4)).toBe(true);
    expect(canPlayListeningAudio(1, true, 4)).toBe(true);
    expect(canPlayListeningAudio(2, true, 4)).toBe(false);
    expect(canPlayListeningAudio(2, false, 4)).toBe(true);
  });
});

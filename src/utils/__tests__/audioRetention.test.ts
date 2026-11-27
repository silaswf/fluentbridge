/**
 * @file src/utils/__tests__/audioRetention.test.ts
 * @description Suíte de testes unitários Vitest validando audioRetention.
 */
import { describe, expect, it } from 'vitest';
import type { StudentSubmission } from '../../types/learning';
import {
  AUDIO_RETENTION_DAYS,
  getAudioRetentionSummary,
  isSubmissionAudioExpired,
  purgeExpiredSpeakingAudios,
} from '../audioRetention';

const BASE_NOW_MS = Date.UTC(2026, 10, 23, 18, 0, 0);
const DAY_MS = 24 * 60 * 60 * 1000;

function makeSub(overrides: Partial<StudentSubmission>): StudentSubmission {
  return {
    id: 'sub-s-1795000000000',
    languageCode: 'en',
    type: 'speaking',
    studentId: 'stu-1',
    studentName: 'Aluno Teste',
    topicId: 'a1-greetings',
    topicTitle: 'Greetings',
    promptPt: 'Fale em voz alta',
    responseText: 'Hello, my name is Lucas.',
    audioId: 'clip-1',
    audioPath: 'speaking/sub-1.webm',
    audioDataUrl: 'data:audio/webm;base64,AAAA',
    audioDurationSec: 4,
    autoPronunciationScore: 92,
    teacherFeedback: 'Excelente pronúncia e ritmo!',
    correctedText: 'Hello, my name is Lucas.',
    teacherBadge: 'Pronúncia Natural',
    pronunciationRubric: { clarity: 5, intonation: 5, rhythm: 4 },
    createdAt: '20/09/2026',
    createdAtIso: new Date(BASE_NOW_MS - 65 * DAY_MS).toISOString(),
    status: 'reviewed',
    ...overrides,
  };
}

describe('60-day audio retention & cleanup engine', () => {
  it('flags speaking audio older than 60 days as expired while ignoring recent & writing submissions', () => {
    const expiredSpeaking = makeSub({
      id: 'sub-s-old',
      createdAtIso: new Date(BASE_NOW_MS - (AUDIO_RETENTION_DAYS + 1) * DAY_MS).toISOString(),
    });
    const recentSpeaking = makeSub({
      id: 'sub-s-recent',
      createdAtIso: new Date(BASE_NOW_MS - 15 * DAY_MS).toISOString(),
    });
    const oldWriting = makeSub({
      id: 'sub-w-old',
      type: 'writing',
      audioId: undefined,
      audioPath: undefined,
      audioDataUrl: undefined,
      createdAtIso: new Date(BASE_NOW_MS - 120 * DAY_MS).toISOString(),
    });

    expect(isSubmissionAudioExpired(expiredSpeaking, BASE_NOW_MS)).toBe(true);
    expect(isSubmissionAudioExpired(recentSpeaking, BASE_NOW_MS)).toBe(false);
    expect(isSubmissionAudioExpired(oldWriting, BASE_NOW_MS)).toBe(false);

    const summary = getAudioRetentionSummary(
      [expiredSpeaking, recentSpeaking, oldWriting],
      BASE_NOW_MS,
    );
    expect(summary.totalSpeaking).toBe(2);
    expect(summary.activeAudioCount).toBe(2);
    expect(summary.expiredPendingCount).toBe(1);
    expect(summary.archivedCount).toBe(0);
  });

  it('purges expired audio payloads while 100% preserving written feedback, transcripts, scores, and badges', async () => {
    const expiredSpeaking = makeSub({
      id: 'sub-s-old',
      createdAtIso: new Date(BASE_NOW_MS - 70 * DAY_MS).toISOString(),
    });
    const recentSpeaking = makeSub({
      id: 'sub-s-recent',
      createdAtIso: new Date(BASE_NOW_MS - 10 * DAY_MS).toISOString(),
    });

    const result = await purgeExpiredSpeakingAudios(
      [expiredSpeaking, recentSpeaking],
      undefined,
      { nowMs: BASE_NOW_MS, skipSideEffects: true },
    );

    expect(result.purgedCount).toBe(1);
    const cleaned = result.nextSubmissions.find((s) => s.id === 'sub-s-old')!;
    expect(cleaned.audioArchived).toBe(true);
    expect(cleaned.audioExpiredAt).toBeDefined();
    expect(cleaned.audioId).toBeUndefined();
    expect(cleaned.audioPath).toBeUndefined();
    expect(cleaned.audioDataUrl).toBeUndefined();

    // Written feedbacks & rubrics MUST remain untouched
    expect(cleaned.responseText).toBe('Hello, my name is Lucas.');
    expect(cleaned.teacherFeedback).toBe('Excelente pronúncia e ritmo!');
    expect(cleaned.correctedText).toBe('Hello, my name is Lucas.');
    expect(cleaned.teacherBadge).toBe('Pronúncia Natural');
    expect(cleaned.autoPronunciationScore).toBe(92);
    expect(cleaned.pronunciationRubric).toEqual({
      clarity: 5,
      intonation: 5,
      rhythm: 4,
    });

    const untouched = result.nextSubmissions.find((s) => s.id === 'sub-s-recent')!;
    expect(untouched.audioArchived).toBeUndefined();
    expect(untouched.audioPath).toBe('speaking/sub-1.webm');
  });
});

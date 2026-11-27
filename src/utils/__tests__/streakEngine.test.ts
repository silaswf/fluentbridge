/**
 * @file src/utils/__tests__/streakEngine.test.ts
 * @description Suíte de testes unitários Vitest validando streakEngine.
 */
import { describe, expect, it } from 'vitest';
import { DEFAULT_PLATFORM_STATE } from '../../data/lessons';
import { recordStudyActivity } from '../streakEngine';

describe('streak & streak freeze engine', () => {
  const baseUser = {
    ...DEFAULT_PLATFORM_STATE.users[0],
    streakDays: 6,
    streakFreezes: 1,
    lastStudyDate: '2026-11-22',
  };

  it('increments streak on consecutive day and awards +1 freeze on 7-day milestone', () => {
    const res = recordStudyActivity(baseUser, new Date('2026-11-23T14:00:00'));
    expect(res.incremented).toBe(true);
    expect(res.user.streakDays).toBe(7);
    expect(res.earnedFreeze).toBe(true);
    expect(res.user.streakFreezes).toBe(2);
    expect(res.user.todayMinutes).toBe(0);
  });

  it('consumes 1 streak freeze when exactly one day was skipped', () => {
    const res = recordStudyActivity(
      { ...baseUser, streakDays: 4, streakFreezes: 1, lastStudyDate: '2026-11-21' },
      new Date('2026-11-23T14:00:00'),
    );
    expect(res.freezeUsed).toBe(true);
    expect(res.user.streakFreezes).toBe(0);
    expect(res.user.streakDays).toBe(5);
  });

  it('resets streak to 1 if multiple days are missed without protection', () => {
    const res = recordStudyActivity(
      { ...baseUser, streakDays: 10, streakFreezes: 1, lastStudyDate: '2026-11-18' },
      new Date('2026-11-23T14:00:00'),
    );
    expect(res.freezeUsed).toBe(false);
    expect(res.user.streakDays).toBe(1);
  });
});

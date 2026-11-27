/**
 * @file src/utils/__tests__/communityEngine.test.ts
 * @description Suíte de testes unitários Vitest validando communityEngine.
 */
import { describe, expect, it } from 'vitest';
import {
  computeLanguageLeaderboard,
  getCurrentWeekKey,
  getLeagueForWeeklyXp,
  getStarterPostsForLanguage,
} from '../communityEngine';
import type { UserProfile } from '../../types/learning';

function makeUser(id: string, name: string, weeklyEn: number): UserProfile {
  const week = getCurrentWeekKey();
  return {
    id,
    name,
    email: `${id}@test.com`,
    password: 'hash',
    role: 'student',
    avatarColor: '#116DFF',
    activeLanguage: 'en',
    dialectByLanguage: { en: 'en-US' },
    accent: 'en-US',
    dailyGoalMinutes: 15,
    todayMinutes: 0,
    xp: weeklyEn * 2,
    xpByLanguage: { en: weeklyEn * 2 },
    weeklyXpByLanguage: { en: weeklyEn },
    weeklyXpWeekKey: week,
    streakDays: 3,
    completedTopicIds: [],
    skillScores: { listening: 50, reading: 50, speaking: 50, writing: 50 },
    vocab: [],
    issuedCertificates: [],
    dailyQuests: {
      lessonsCompletedToday: 0,
      vocabReviewedToday: 0,
      tutorSessionsToday: 0,
      claimedQuestIds: [],
    },
    createdAt: '2026-11-01',
  };
}

describe('Community Leagues & Language Forum Engine (v5.0.0)', () => {
  it('maps weekly XP to the right league tier', () => {
    expect(getLeagueForWeeklyXp(0).id).toBe('bronze');
    expect(getLeagueForWeeklyXp(360).id).toBe('gold');
    expect(getLeagueForWeeklyXp(2100).id).toBe('diamond');
  });

  it('computes sorted per-language leaderboard and starter posts for all 12 languages', () => {
    const u1 = makeUser('u1', 'Alice', 900);
    const u2 = makeUser('u2', 'Bruno', 400);
    const board = computeLanguageLeaderboard([u1, u2], u1, 'en');
    expect(board.length).toBeGreaterThanOrEqual(8);
    expect(board[0].weeklyXp).toBeGreaterThanOrEqual(board[1].weeklyXp);
    expect(board.some((e) => e.id === 'u1' && e.isCurrentUser)).toBe(true);

    for (const lang of ['en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh', 'ar', 'nl', 'af', 'sv'] as const) {
      expect(getStarterPostsForLanguage(lang).length).toBeGreaterThanOrEqual(2);
    }
  });
});

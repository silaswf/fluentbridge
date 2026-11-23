import type { UserProfile } from '../types/learning';

const MAX_STREAK_FREEZES = 3;

export function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function daysBetweenLocalKeys(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split('-').map(Number);
  const [ty, tm, td] = toKey.split('-').map(Number);
  if (!fy || !fm || !fd || !ty || !tm || !td) return 0;
  const fromUtc = Date.UTC(fy, fm - 1, fd);
  const toUtc = Date.UTC(ty, tm - 1, td);
  return Math.round((toUtc - fromUtc) / (24 * 60 * 60 * 1000));
}

export interface StreakUpdateResult {
  user: UserProfile;
  freezeUsed: boolean;
  earnedFreeze: boolean;
  incremented: boolean;
}

export function recordStudyActivity(
  user: UserProfile,
  now: Date = new Date(),
): StreakUpdateResult {
  const todayKey = getLocalDateKey(now);
  const currentFreezes = user.streakFreezes ?? 1;
  const lastKey = user.lastStudyDate;

  if (!lastKey) {
    return {
      user: {
        ...user,
        streakDays: Math.max(1, user.streakDays || 1),
        streakFreezes: currentFreezes,
        lastStudyDate: todayKey,
      },
      freezeUsed: false,
      earnedFreeze: false,
      incremented: false,
    };
  }

  if (lastKey === todayKey) {
    return {
      user: {
        ...user,
        streakFreezes: currentFreezes,
      },
      freezeUsed: false,
      earnedFreeze: false,
      incremented: false,
    };
  }

  const diffDays = daysBetweenLocalKeys(lastKey, todayKey);
  let nextStreak = user.streakDays || 1;
  let nextFreezes = currentFreezes;
  let freezeUsed = false;
  let earnedFreeze = false;

  if (diffDays === 1) {
    nextStreak += 1;
  } else if (diffDays === 2 && currentFreezes > 0) {
    // 1 dia perdido coberto pelo Streak Freeze
    nextFreezes -= 1;
    nextStreak += 1;
    freezeUsed = true;
  } else if (diffDays > 1) {
    nextStreak = 1;
  }

  if (nextStreak > 0 && nextStreak % 7 === 0 && nextFreezes < MAX_STREAK_FREEZES) {
    nextFreezes += 1;
    earnedFreeze = true;
  }

  // Novo dia de calendário: reinicia metas diárias
  return {
    user: {
      ...user,
      streakDays: nextStreak,
      streakFreezes: nextFreezes,
      lastStudyDate: todayKey,
      todayMinutes: 0,
      dailyQuests: {
        lessonsCompletedToday: 0,
        vocabReviewedToday: 0,
        tutorSessionsToday: 0,
        claimedQuestIds: [],
      },
    },
    freezeUsed,
    earnedFreeze,
    incremented: true,
  };
}

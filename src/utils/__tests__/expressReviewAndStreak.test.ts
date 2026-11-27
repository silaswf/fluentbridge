/**
 * @file src/utils/__tests__/expressReviewAndStreak.test.ts
 * @description Testes unitários para mérito de Streak Freeze (limite de 3) e status/envio de Web Notifications.
 * @exports (test suite)
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PLATFORM_STATE } from '../../data/lessons';
import { awardMeritStreakFreeze } from '../streakEngine';
import { getWebNotificationStatus, sendTestStreakNotification } from '../notifications';

describe('awardMeritStreakFreeze', () => {
  const baseUser = {
    ...DEFAULT_PLATFORM_STATE.users[0],
    streakDays: 7,
    streakFreezes: 1,
  };

  it('grants +1 streakFreeze for streak_7d and checkpoint when below cap', () => {
    const res1 = awardMeritStreakFreeze(baseUser, 'streak_7d');
    expect(res1.awarded).toBe(true);
    expect(res1.user.streakFreezes).toBe(2);

    const res2 = awardMeritStreakFreeze(res1.user, 'checkpoint');
    expect(res2.awarded).toBe(true);
    expect(res2.user.streakFreezes).toBe(3);
  });

  it('caps streakFreezes at 3 and returns awarded=false when already at 3', () => {
    const maxedUser = { ...baseUser, streakFreezes: 3 };
    const res = awardMeritStreakFreeze(maxedUser, 'checkpoint');
    expect(res.awarded).toBe(false);
    expect(res.user.streakFreezes).toBe(3);
  });
});

describe('getWebNotificationStatus & sendTestStreakNotification', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns unsupported when window or Notification API is unavailable', () => {
    vi.stubGlobal('window', {});
    expect(getWebNotificationStatus()).toBe('unsupported');
    expect(sendTestStreakNotification('Escola Alfa')).toBe(false);
  });

  it('returns browser permission status and dispatches notification when granted', () => {
    const notificationSpy = vi.fn();
    class MockNotification {
      static permission: NotificationPermission = 'granted';
      constructor(title: string, options?: NotificationOptions) {
        notificationSpy(title, options);
      }
    }
    vi.stubGlobal('window', { Notification: MockNotification });

    expect(getWebNotificationStatus()).toBe('granted');
    expect(sendTestStreakNotification('Escola Alfa')).toBe(true);
    expect(notificationSpy).toHaveBeenCalledTimes(1);
    expect(notificationSpy.mock.calls[0][0]).toContain('Escola Alfa');

    MockNotification.permission = 'denied';
    expect(getWebNotificationStatus()).toBe('denied');
    expect(sendTestStreakNotification()).toBe(false);

    MockNotification.permission = 'default';
    expect(getWebNotificationStatus()).toBe('default');
  });
});

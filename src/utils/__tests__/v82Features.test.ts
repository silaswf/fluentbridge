import { describe, expect, it } from 'vitest';
import { REGIONAL_ACCENTS_BY_LANGUAGE, getRegionalAccents } from '../../data/regionalAccents';
import { DEFAULT_PLATFORM_STATE } from '../../data/platformDefaults';
import type { LanguageCode } from '../../types/learning';
import { computeAdaptiveProfile } from '../adaptiveDifficulty';
import {
  clearOfflineOutbox,
  enqueueOfflineMutation,
  flushOfflineOutbox,
  listOutboxItems,
} from '../offlineOutbox';
import { computeRetentionAlerts } from '../retentionNotifications';
import { analyzeWritingLineByLine } from '../writingDiffGrader';

const ALL_LANGUAGES: LanguageCode[] = [
  'en',
  'es',
  'fr',
  'it',
  'de',
  'ru',
  'ja',
  'zh',
  'ar',
  'nl',
  'af',
  'sv',
];

describe('FluentBridge v8.2.0 features', () => {
  it('ships 49 regional accents across all 12 languages', () => {
    let total = 0;
    for (const lang of ALL_LANGUAGES) {
      const list = getRegionalAccents(lang);
      expect(list.length).toBeGreaterThanOrEqual(3);
      expect(REGIONAL_ACCENTS_BY_LANGUAGE[lang]).toBeDefined();
      total += list.length;
    }
    expect(total).toBe(49);
  });

  it('writingDiffGrader computes word diff, suggestions and mistake items', () => {
    const res = analyzeWritingLineByLine(
      'hello i work in london',
      'Hello, I work in London every day.',
      [{ label: 'Use "work"', keywords: ['work'] }],
      'en',
    );
    expect(res.score).toBeGreaterThan(0);
    expect(res.diffTokens.some((t) => t.type === 'keep')).toBe(true);
    expect(res.suggestionsPt.some((s) => s.includes('"I"'))).toBe(true);
    expect(res.mistakeItems.length).toBeGreaterThanOrEqual(1);
  });

  it('adaptiveDifficulty adjusts rate and hints based on performance and manual override', () => {
    const guided = computeAdaptiveProfile(1, 2, 0, null);
    expect(guided.mode).toBe('guided');
    expect(guided.recommendedRate).toBeLessThan(1);
    expect(guided.autoShowHints).toBe(true);

    const immersive = computeAdaptiveProfile(6, 0, 5, null);
    expect(immersive.mode).toBe('immersive');
    expect(immersive.recommendedRate).toBeGreaterThan(1);

    const manual = computeAdaptiveProfile(0, 0, 0, 'guided');
    expect(manual.mode).toBe('guided');
  });

  it('offlineOutbox enqueues, lists, flushes and clears pending items', async () => {
    await clearOfflineOutbox();
    await enqueueOfflineMutation('telemetry', { message: 'test-offline' });
    await enqueueOfflineMutation('lesson_complete', { topicId: 'en-a1-1' });
    const items = await listOutboxItems();
    expect(items.length).toBe(2);

    const flushed = await flushOfflineOutbox(async () => true);
    expect(flushed.flushed).toBe(2);
    expect(flushed.remaining).toBe(0);
  });

  it('computeRetentionAlerts surfaces due SRS, streak risk and teacher reviews', () => {
    const sampleUser = {
      ...DEFAULT_PLATFORM_STATE.users[0],
      streakDays: 5,
      todayMinutes: 0,
      vocab: [
        {
          id: 'v1',
          topicId: 'en-t1',
          languageCode: 'en' as const,
          word: 'schedule',
          translation: 'agenda',
          ipa: '/ˈskedʒuːl/',
          category: 'Work',
          exampleEn: 'Let us check the schedule.',
          examplePt: 'Vamos conferir a agenda.',
          strength: 'weak' as const,
          reviewCount: 0,
        },
      ],
    };
    const alerts = computeRetentionAlerts(sampleUser, 2, 'Aula VIP 19:00');
    expect(alerts.some((a) => a.kind === 'srs_due')).toBe(true);
    expect(alerts.some((a) => a.kind === 'streak_risk')).toBe(true);
    expect(alerts.some((a) => a.kind === 'teacher_review')).toBe(true);
    expect(alerts.some((a) => a.kind === 'live_class')).toBe(true);
  });
});

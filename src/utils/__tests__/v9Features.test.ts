import { describe, expect, it } from 'vitest';
import { isRtlLanguage } from '../platform';
import { stripHebrewNiqqud } from '../hebrewNiqqud';
import {
  buildOfflineYouTubeStudyPack,
  extractYouTubeVideoId,
  parseManualTranscript,
} from '../youtubeStudy';
import { ALL_BUILTIN_TOPICS } from '../../data/lessons';
import { HEBREW_ALEFBET, NORDIC_SPECIAL_LETTERS, TURKISH_SPECIAL_LETTERS } from '../../data/scriptTrainerData';
import type { LanguageCode } from '../../types/learning';

describe('v9.0.0 Features — 16 Languages, 150 Units & YouTube Study Lab', () => {
  it('supports RTL for both Arabic and Hebrew and strips Hebrew Niqqud cleanly', () => {
    expect(isRtlLanguage('ar')).toBe(true);
    expect(isRtlLanguage('he')).toBe(true);
    expect(isRtlLanguage('tr')).toBe(false);
    expect(isRtlLanguage('nb')).toBe(false);
    expect(isRtlLanguage('da')).toBe(false);

    expect(stripHebrewNiqqud('שָׁלוֹם')).toBe('שלום');
    expect(stripHebrewNiqqud('תּוֹדָה רַבָּה')).toBe('תודה רבה');
  });

  it('includes complete Hebrew Alefbet + Turkish/Nordic special letters in Script Trainer', () => {
    expect(HEBREW_ALEFBET.length).toBeGreaterThanOrEqual(27);
    expect(TURKISH_SPECIAL_LETTERS.length).toBeGreaterThanOrEqual(7);
    expect(NORDIC_SPECIAL_LETTERS.length).toBeGreaterThanOrEqual(3);
  });

  it('parses YouTube URLs, SRT/VTT transcripts and builds offline study packs', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeVideoId('https://youtu.be/M7lc1UVf-VE?t=12')).toBe('M7lc1UVf-VE');
    expect(extractYouTubeVideoId('https://youtube.com/shorts/abcDEF12345')).toBe('abcDEF12345');
    expect(extractYouTubeVideoId('not-a-valid-youtube-url')).toBeNull();

    const parsed = parseManualTranscript('0:00 Hello world\n0:08 We use connectors naturally.');
    expect(parsed.length).toBe(2);
    expect(parsed[0].startSec).toBe(0);
    expect(parsed[1].startSec).toBe(8);

    const pack = buildOfflineYouTubeStudyPack(
      'dQw4w9WgXcQ',
      'tr',
      'B1',
      '0:00 İstanbul çok güzel bir şehir.',
    );
    expect(pack.subtitles.length).toBe(1);
    expect(pack.grammarInsights.length).toBeGreaterThan(0);
    expect(pack.checkpoints.length).toBeGreaterThan(0);
  });

  it('guarantees zero duplicate titlePt within any of the 16 languages (150 units each)', () => {
    const langs: LanguageCode[] = [
      'en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh',
      'ar', 'nl', 'af', 'sv', 'tr', 'he', 'nb', 'da',
    ];
    for (const lang of langs) {
      const topics = ALL_BUILTIN_TOPICS.filter((t) => (t.languageCode ?? 'en') === lang);
      expect(topics.length).toBe(150);
      const uniqueTitles = new Set(topics.map((t) => t.titlePt.trim().toLowerCase()));
      expect(uniqueTitles.size, `Duplicate titlePt in ${lang}`).toBe(150);
    }
  });
});

import { describe, expect, it } from 'vitest';
import { loadLanguageCourseData } from '../../data/courseLoader';
import { EXAM_TYPES } from '../../data/exams/examCatalog';
import { getExamsByLanguage } from '../../data/exams';
import { getInteractiveVideosByLanguage } from '../../data/interactiveVideos';
import { PODCAST_EPISODES } from '../../data/podcastEpisodes';
import type { LanguageCode } from '../../types/learning';
import { gradeMockExam } from '../examScoring';
import { toJapaneseKana } from '../japaneseKana';
import { exampleMatchesWord } from '../vocabValidation';

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

describe('FluentBridge v8.0.0 features', () => {
  it('toJapaneseKana converts Kanji sentences cleanly into 100% Kana', () => {
    const samples = [
      'はじめまして。私は東京駅で会社員として働いています。',
      '日本語の勉強は毎日楽しいです。よろしくお願いします。',
      '今日は友達と温泉に行きます。',
    ];
    for (const s of samples) {
      const kana = toJapaneseKana(s);
      expect(/[\u4E00-\u9FFF]/.test(kana)).toBe(false);
    }
  });

  it('enrichCourseCohesion delivers cohesive 8-10 vocab cards, spiral links & script_phonics steps', async () => {
    for (const lang of ['en', 'ja', 'ru', 'ar'] as LanguageCode[]) {
      const bundle = await loadLanguageCourseData(lang);
      expect(bundle.topics.length).toBe(103);

      // Every unit has >= 6 and <= 10 cohesive vocab cards, and valid examples
      const byTopic = new Map<string, typeof bundle.vocab>();
      for (const c of bundle.vocab) {
        const list = byTopic.get(c.topicId) ?? [];
        list.push(c);
        byTopic.set(c.topicId, list);
        expect(
          exampleMatchesWord(c.exampleEn, c.word, lang),
          `Lang=${lang} Topic=${c.topicId} Word=${c.word} Ex=${c.exampleEn}`,
        ).toBe(true);
      }

      for (const t of bundle.topics) {
        const cards = byTopic.get(t.id) ?? [];
        expect(cards.length).toBeGreaterThanOrEqual(6);
        expect(cards.length).toBeLessThanOrEqual(10);
        expect(t.moduleTitlePt).toBeTruthy();
      }

      // Non-Latin languages embed script_phonics steps inside units
      if (lang !== 'en') {
        const withScript = bundle.topics.filter((t) =>
          t.steps.some((s) => s.type === 'script_phonics'),
        );
        expect(withScript.length).toBeGreaterThanOrEqual(10);
      }
    }
  });

  it('provides 4 Duolingo English Test (DET) simulations scored on 10-160 scale', () => {
    const detMeta = EXAM_TYPES.find((e) => e.id === 'det');
    expect(detMeta).toBeDefined();

    const detExams = getExamsByLanguage('en').filter((e) => e.examTypeId === 'det');
    expect(detExams.length).toBe(4);

    const first = detExams[0];
    const answers: Record<string, number> = {};
    for (const q of first.questions) {
      answers[q.id] = q.correctIndex;
    }
    const graded = gradeMockExam(
      first,
      detMeta!,
      answers,
      first.writingTask.modelAnswer,
      92,
      'full',
    );
    expect(graded.officialScore).toBeGreaterThanOrEqual(130);
    expect(graded.officialScore).toBeLessThanOrEqual(160);
    expect(graded.officialScore % 5).toBe(0);
    expect(graded.passed).toBe(true);
  });

  it('expands all 60 podcasts (>=10 lines, 3 checkpoints) & 36 interactive videos (>=8 lines, 2 checkpoints)', () => {
    expect(PODCAST_EPISODES.length).toBe(60);
    for (const ep of PODCAST_EPISODES) {
      expect(ep.lines.length).toBeGreaterThanOrEqual(10);
      expect(ep.checkpoints.length).toBeGreaterThanOrEqual(3);
    }

    let totalVideos = 0;
    for (const lang of ALL_LANGUAGES) {
      const clips = getInteractiveVideosByLanguage(lang);
      totalVideos += clips.length;
      for (const clip of clips) {
        expect(clip.lines.length).toBeGreaterThanOrEqual(8);
        expect(clip.checkpoints?.length ?? 0).toBeGreaterThanOrEqual(2);
      }
    }
    expect(totalVideos).toBe(36);
  });
});

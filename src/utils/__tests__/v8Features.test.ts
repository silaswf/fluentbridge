import { describe, expect, it } from 'vitest';
import { loadLanguageCourseData } from '../../data/courseLoader';
import { EXAM_TYPES } from '../../data/exams/examCatalog';
import { getExamsByLanguage } from '../../data/exams';
import { getInteractiveVideosByLanguage } from '../../data/interactiveVideos';
import { PODCAST_EPISODES } from '../../data/podcastEpisodes';
import type { LanguageCode } from '../../types/learning';
import { gradeMockExam } from '../examScoring';
import { toJapaneseKana } from '../japaneseKana';
import { DEFAULT_PLATFORM_STATE } from '../../data/platformDefaults';
import { normalizePlatformState } from '../storage';
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
  'tr',
  'he',
  'nb',
  'da',
  'pt',
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

  it('enrichCourseCohesion delivers >=10 cohesive vocab cards, 5-pair matching, cohesive cloze & script_phonics across all 12 languages', async () => {
    for (const lang of ALL_LANGUAGES) {
      const bundle = await loadLanguageCourseData(lang);
      expect(bundle.topics.length).toBe(150);

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
        expect(
          cards.length,
          `Lang=${lang} Topic=${t.id} has ${cards.length} cards`,
        ).toBeGreaterThanOrEqual(10);
        expect(t.moduleTitlePt).toBeTruthy();

        const matchingStep = t.steps.find((s) => s.type === 'matching');
        if (matchingStep && matchingStep.type === 'matching') {
          expect(matchingStep.pairs.length).toBeGreaterThanOrEqual(5);
        }

        expect(
          t.steps.some((s) => s.id === `${t.id}-cohesive-vocab-cloze`),
          `Lang=${lang} Topic=${t.id} missing cohesive cloze`,
        ).toBe(true);
      }

      if (lang === 'ja' || lang === 'it') {
        const u0 = bundle.topics[0];
        const readingStep = u0.steps.find((s) => s.type === 'reading');
        expect(readingStep).toBeDefined();
        if (readingStep && readingStep.type === 'reading') {
          const matchedTerms = readingStep.glossary.filter((g) =>
            readingStep.text.toLowerCase().includes(g.word.toLowerCase()),
          );
          expect(matchedTerms.length).toBeGreaterThanOrEqual(2);
        }
      }

      // Non-Latin languages embed script_phonics steps inside units
      if (lang === 'ru' || lang === 'ar' || lang === 'ja' || lang === 'zh') {
        const withScript = bundle.topics.filter((t) =>
          t.steps.some((s) => s.type === 'script_phonics'),
        );
        expect(withScript.length).toBeGreaterThanOrEqual(10);
      }
    }
  }, 120000);

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

  it('expands all 85 podcasts (>=10 lines, 3 checkpoints) & 51 interactive videos (>=8 lines, 2 checkpoints)', () => {
    expect(PODCAST_EPISODES.length).toBe(85);
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
    expect(totalVideos).toBe(51);
  });

  it('normalizePlatformState preserves user vocab when masterVocab is empty or single-language', () => {
    const sampleEn = {
      id: 'en-v-keep',
      topicId: 'en-t1',
      languageCode: 'en' as const,
      word: 'resilient',
      translation: 'resiliente',
      ipa: '/rɪˈzɪl.jənt/',
      category: 'Qualities',
      exampleEn: 'She is resilient under pressure.',
      examplePt: 'Ela é resiliente sob pressão.',
      strength: 'mastered' as const,
      reviewCount: 4,
    };
    const sampleJa = {
      id: 'ja-v-keep',
      topicId: 'ja-a1-1',
      languageCode: 'ja' as const,
      word: 'はじめまして',
      translation: 'Muito prazer',
      ipa: '/hajimemashite/',
      category: 'Saudações',
      exampleEn: 'はじめまして、ルカスです。',
      examplePt: 'Muito prazer, sou Lucas.',
      strength: 'medium' as const,
      reviewCount: 2,
    };
    const baseUser = {
      ...DEFAULT_PLATFORM_STATE.users[0],
      vocab: [sampleEn, sampleJa],
    };

    const afterEmptyMaster = normalizePlatformState(
      { ...DEFAULT_PLATFORM_STATE, users: [baseUser] },
      DEFAULT_PLATFORM_STATE,
      [],
    );
    expect(afterEmptyMaster.users[0].vocab.length).toBe(2);

    const afterSingleLangMaster = normalizePlatformState(
      { ...DEFAULT_PLATFORM_STATE, users: [baseUser] },
      DEFAULT_PLATFORM_STATE,
      [{ ...sampleEn, strength: 'weak', reviewCount: 0 }],
    );
    expect(afterSingleLangMaster.users[0].vocab.some((v) => v.id === 'ja-v-keep')).toBe(true);
    expect(
      afterSingleLangMaster.users[0].vocab.find((v) => v.id === 'en-v-keep')?.strength,
    ).toBe('mastered');
  });
});

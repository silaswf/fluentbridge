import { describe, expect, it } from 'vitest';
import { EXAM_TYPES } from '../../data/exams/examCatalog';
import { ALL_MOCK_EXAMS } from '../../data/exams';
import {
  ALL_GRAMMAR_GUIDE,
  getGrammarGuideByLanguage,
} from '../../data/grammarGuide';
import { INTERACTIVE_VIDEO_CLIPS } from '../../data/interactiveVideos';
import {
  ALL_BUILTIN_TOPICS,
  ALL_INITIAL_VOCABULARY,
  BUILTIN_TOPICS,
} from '../../data/lessons';
import { PODCAST_EPISODES } from '../../data/podcastEpisodes';
import {
  ARABIC_ALPHABET,
  JAPANESE_HIRAGANA,
  JAPANESE_KATAKANA,
  RUSSIAN_CYRILLIC,
} from '../../data/scriptTrainerData';
import {
  AI_TUTOR_SCENARIOS,
  UNIT_ROLEPLAY_ANGLES,
} from '../../data/tutorScenarios';
import { getAllVoiceDiagnostics } from '../speech';
import { exampleMatchesWord, isMetaFallbackExample } from '../vocabValidation';

const ALL_17_LANGS = [
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
] as const;

describe('Multi-language curriculum, immersion, exams & videos integrity (v9.2.0)', () => {
  it('ships 2550 units across 17 languages (150 per language, 30 per CEFR level) with >= 300 tips each', () => {
    expect(BUILTIN_TOPICS.length).toBe(150);
    expect(ALL_BUILTIN_TOPICS.length).toBe(2550);

    for (const lang of ALL_17_LANGS) {
      const langTopics = ALL_BUILTIN_TOPICS.filter(
        (t) => (t.languageCode ?? 'en') === lang,
      );
      expect(langTopics.length, `Lang ${lang} topic count`).toBe(150);

      expect(langTopics.filter((t) => t.level === 'A1').length).toBe(30);
      expect(langTopics.filter((t) => t.level === 'A2').length).toBe(30);
      expect(langTopics.filter((t) => t.level === 'B1').length).toBe(30);
      expect(langTopics.filter((t) => t.level === 'B2').length).toBe(30);
      expect(langTopics.filter((t) => t.level === 'C1').length).toBe(30);

      const tipCount = langTopics.reduce(
        (acc, t) => acc + t.steps.filter((s) => s.type === 'tip').length,
        0,
      );
      expect(tipCount).toBeGreaterThanOrEqual(300);
    }

    const topicIds = new Set(ALL_BUILTIN_TOPICS.map((t) => t.id));
    expect(topicIds.size).toBe(2550);

    for (const v of ALL_INITIAL_VOCABULARY) {
      expect(topicIds.has(v.topicId)).toBe(true);
      expect(v.exampleEn.trim().length).toBeGreaterThan(0);
      expect(v.examplePt.trim().length).toBeGreaterThan(0);
      expect(
        isMetaFallbackExample(v.exampleEn),
        `Meta fallback example in ${v.topicId} (${v.id}): "${v.exampleEn}"`,
      ).toBe(false);
      expect(
        exampleMatchesWord(v.exampleEn, v.word, v.languageCode),
        `Example does not match word "${v.word}" in ${v.topicId} (${v.id}, ${v.languageCode}): "${v.exampleEn}"`,
      ).toBe(true);
    }

    const vocabByTopic = new Map<string, typeof ALL_INITIAL_VOCABULARY>();
    for (const v of ALL_INITIAL_VOCABULARY) {
      const list = vocabByTopic.get(v.topicId) ?? [];
      list.push(v);
      vocabByTopic.set(v.topicId, list);
    }
    for (const t of ALL_BUILTIN_TOPICS) {
      const list = vocabByTopic.get(t.id) ?? [];
      expect(
        list.length,
        `Topic ${t.id} (${t.languageCode}) has fewer than 3 vocab cards (${list.length})`,
      ).toBeGreaterThanOrEqual(3);
    }
    for (const [tid, list] of vocabByTopic.entries()) {
      const uniqueWords = new Set(list.map((c) => c.word.trim().toLowerCase()));
      expect(uniqueWords.size, `Duplicate word inside topic ${tid}`).toBe(list.length);
      const uniqueExamples = new Set(list.map((c) => c.exampleEn.trim().toLowerCase()));
      expect(uniqueExamples.size, `Duplicate exampleEn inside topic ${tid}`).toBe(list.length);
    }

    expect(getAllVoiceDiagnostics().length).toBe(17);

    for (const t of ALL_BUILTIN_TOPICS) {
      const types = new Set(t.steps.map((s) => s.type));
      expect(types.has('tip')).toBe(true);
      expect(types.has('listening')).toBe(true);
      expect(types.has('reading')).toBe(true);
      expect(types.has('speaking')).toBe(true);
      expect(types.has('writing_free')).toBe(true);
      expect(
        types.has('writing_builder') ||
          (types.has('dictation') && types.has('story')),
      ).toBe(true);
    }
  });

  it('enforces target-language immersion on B2/C1 units (no Portuguese boilerplate)', () => {
    const b2c1Topics = ALL_BUILTIN_TOPICS.filter(
      (t) => t.level === 'B2' || t.level === 'C1',
    );
    expect(b2c1Topics.length).toBe(1020);

    const ptBoilerplate = [
      'Ouça o áudio com atenção',
      'Pratique em voz alta em',
      'Ditado Auditivo em',
      'A resposta está diretamente no texto',
    ];

    for (const t of b2c1Topics) {
      const serialized = JSON.stringify(t.steps);
      for (const phrase of ptBoilerplate) {
        expect(serialized).not.toContain(phrase);
      }
    }
  });

  it('ships 3400 grammar reference entries (200 per language across 17 languages)', () => {
    expect(ALL_GRAMMAR_GUIDE.length).toBe(3400);
    for (const lang of ALL_17_LANGS) {
      expect(getGrammarGuideByLanguage(lang).length).toBe(200);
    }
  });

  it('ships 850 AI tutor scenarios, 85 podcasts & 51 interactive video clips across 17 languages', () => {
    expect(AI_TUTOR_SCENARIOS.length).toBe(850);
    expect(PODCAST_EPISODES.length).toBe(85);
    expect(INTERACTIVE_VIDEO_CLIPS.length).toBe(51);
    for (const lang of ALL_17_LANGS) {
      expect(
        AI_TUTOR_SCENARIOS.filter((s) => s.languageCode === lang).length,
      ).toBe(50);
      expect(
        PODCAST_EPISODES.filter((p) => p.languageCode === lang).length,
      ).toBe(5);
      expect(
        INTERACTIVE_VIDEO_CLIPS.filter((v) => v.languageCode === lang).length,
      ).toBe(3);
    }
    expect(UNIT_ROLEPLAY_ANGLES.length).toBe(10);
  });

  it('ships complete alphabets and 100 full official mock exams (25 exam types incl. CELPIP, DET, TÖMER, YAEL, Norskprøve, PD3 & CELPE-Bras)', () => {
    expect(JAPANESE_HIRAGANA.length).toBe(46);
    expect(JAPANESE_KATAKANA.length).toBe(46);
    expect(RUSSIAN_CYRILLIC.length).toBe(33);
    expect(ARABIC_ALPHABET.length).toBe(28);

    expect(EXAM_TYPES.length).toBe(25);
    expect(ALL_MOCK_EXAMS.length).toBe(100);
    for (const meta of EXAM_TYPES) {
      const ofType = ALL_MOCK_EXAMS.filter((e) => e.examTypeId === meta.id);
      expect(ofType.length).toBe(4);
      for (const exam of ofType) {
        expect(exam.questions.length).toBeGreaterThanOrEqual(12);
        expect(exam.speakingTask?.parts.length).toBe(3);
      }
    }
  });
});

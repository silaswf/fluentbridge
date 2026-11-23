import { describe, expect, it } from 'vitest';
import {
  ALL_GRAMMAR_GUIDE,
  getGrammarGuideByLanguage,
} from '../../data/grammarGuide';
import {
  ALL_BUILTIN_TOPICS,
  ALL_INITIAL_VOCABULARY,
  BUILTIN_TOPICS,
} from '../../data/lessons';
import {
  AI_TUTOR_SCENARIOS,
  UNIT_ROLEPLAY_ANGLES,
} from '../../data/tutorScenarios';

describe('Multi-language curriculum, immersion & AI tutor integrity (v3.0.0)', () => {
  it('ships 410 units across 8 languages (60 EN + 50 each for ES/FR/IT/DE/RU/JA/ZH) with >= 100 tips each', () => {
    expect(BUILTIN_TOPICS.length).toBe(60);
    expect(ALL_BUILTIN_TOPICS.length).toBe(410);

    for (const lang of ['en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh'] as const) {
      const langTopics = ALL_BUILTIN_TOPICS.filter(
        (t) => (t.languageCode ?? 'en') === lang,
      );
      expect(langTopics.length).toBe(lang === 'en' ? 60 : 50);

      const tipCount = langTopics.reduce(
        (acc, t) => acc + t.steps.filter((s) => s.type === 'tip').length,
        0,
      );
      expect(tipCount).toBeGreaterThanOrEqual(100);
    }

    const topicIds = new Set(ALL_BUILTIN_TOPICS.map((t) => t.id));
    expect(topicIds.size).toBe(410);

    for (const v of ALL_INITIAL_VOCABULARY) {
      expect(topicIds.has(v.topicId)).toBe(true);
      expect(v.exampleEn.trim().length).toBeGreaterThan(0);
      expect(v.examplePt.trim().length).toBeGreaterThan(0);
    }

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
    expect(b2c1Topics.length).toBeGreaterThanOrEqual(100);

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

  it('ships 800 grammar reference entries (100 per language across 8 languages)', () => {
    expect(ALL_GRAMMAR_GUIDE.length).toBe(800);
    for (const lang of ['en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh'] as const) {
      expect(getGrammarGuideByLanguage(lang).length).toBe(100);
    }
  });

  it('ships 160 AI tutor scenarios (20 per language across 8 languages) and 10 unit roleplay angles', () => {
    expect(AI_TUTOR_SCENARIOS.length).toBe(160);
    for (const lang of ['en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh'] as const) {
      expect(
        AI_TUTOR_SCENARIOS.filter((s) => s.languageCode === lang).length,
      ).toBe(20);
    }
    expect(UNIT_ROLEPLAY_ANGLES.length).toBe(10);
  });
});

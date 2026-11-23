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

describe('Multi-language curriculum, immersion & AI tutor integrity (v2.3.0)', () => {
  it('ships 260 units across EN (60), ES (50), FR (50), IT (50), and DE (50) with >= 100 tips each', () => {
    expect(BUILTIN_TOPICS.length).toBe(60);
    expect(ALL_BUILTIN_TOPICS.length).toBe(260);

    for (const lang of ['en', 'es', 'fr', 'it', 'de'] as const) {
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
    expect(topicIds.size).toBe(260);

    for (const v of ALL_INITIAL_VOCABULARY) {
      expect(topicIds.has(v.topicId)).toBe(true);
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

  it('ships 500 grammar reference entries (100 per language)', () => {
    expect(ALL_GRAMMAR_GUIDE.length).toBe(500);
    expect(getGrammarGuideByLanguage('en').length).toBe(100);
    expect(getGrammarGuideByLanguage('es').length).toBe(100);
    expect(getGrammarGuideByLanguage('fr').length).toBe(100);
    expect(getGrammarGuideByLanguage('it').length).toBe(100);
    expect(getGrammarGuideByLanguage('de').length).toBe(100);
  });

  it('ships 100 AI tutor scenarios (20 per language) and 10 unit roleplay angles', () => {
    expect(AI_TUTOR_SCENARIOS.length).toBe(100);
    for (const lang of ['en', 'es', 'fr', 'it', 'de'] as const) {
      expect(
        AI_TUTOR_SCENARIOS.filter((s) => s.languageCode === lang).length,
      ).toBe(20);
    }
    expect(UNIT_ROLEPLAY_ANGLES.length).toBe(10);
  });
});

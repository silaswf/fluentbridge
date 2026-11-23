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

describe('Multi-language curriculum integrity (EN, ES, FR, IT, DE)', () => {
  it('ships 194 units across EN (50), ES (36), FR (36), IT (36), and DE (36) with valid steps and vocab', () => {
    expect(BUILTIN_TOPICS.length).toBe(50);
    expect(ALL_BUILTIN_TOPICS.length).toBe(194);

    const esTopics = ALL_BUILTIN_TOPICS.filter((t) => t.languageCode === 'es');
    const frTopics = ALL_BUILTIN_TOPICS.filter((t) => t.languageCode === 'fr');
    const itTopics = ALL_BUILTIN_TOPICS.filter((t) => t.languageCode === 'it');
    const deTopics = ALL_BUILTIN_TOPICS.filter((t) => t.languageCode === 'de');
    expect(esTopics.length).toBe(36);
    expect(frTopics.length).toBe(36);
    expect(itTopics.length).toBe(36);
    expect(deTopics.length).toBe(36);

    const topicIds = new Set(ALL_BUILTIN_TOPICS.map((t) => t.id));
    expect(topicIds.size).toBe(194);

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

  it('ships 144 grammar reference tables across EN (32), ES (28), FR (28), IT (28), and DE (28)', () => {
    expect(ALL_GRAMMAR_GUIDE.length).toBe(144);
    expect(getGrammarGuideByLanguage('en').length).toBe(32);
    expect(getGrammarGuideByLanguage('es').length).toBe(28);
    expect(getGrammarGuideByLanguage('fr').length).toBe(28);
    expect(getGrammarGuideByLanguage('it').length).toBe(28);
    expect(getGrammarGuideByLanguage('de').length).toBe(28);
  });
});

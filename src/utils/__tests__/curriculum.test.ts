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

describe('Phase 9 multi-language curriculum integrity', () => {
  it('ships 92 units across EN (50), ES (22), and FR (20) with valid steps and vocab', () => {
    expect(BUILTIN_TOPICS.length).toBe(50);
    expect(ALL_BUILTIN_TOPICS.length).toBe(92);

    const esTopics = ALL_BUILTIN_TOPICS.filter((t) => t.languageCode === 'es');
    const frTopics = ALL_BUILTIN_TOPICS.filter((t) => t.languageCode === 'fr');
    expect(esTopics.length).toBe(22);
    expect(frTopics.length).toBe(20);

    const topicIds = new Set(ALL_BUILTIN_TOPICS.map((t) => t.id));
    expect(topicIds.size).toBe(92);

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

  it('ships 56 grammar reference tables across EN (32), ES (12), and FR (12)', () => {
    expect(ALL_GRAMMAR_GUIDE.length).toBe(56);
    expect(getGrammarGuideByLanguage('en').length).toBe(32);
    expect(getGrammarGuideByLanguage('es').length).toBe(12);
    expect(getGrammarGuideByLanguage('fr').length).toBe(12);
  });
});

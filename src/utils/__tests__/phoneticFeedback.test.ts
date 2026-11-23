import { describe, expect, it } from 'vitest';
import { analyzePhoneticFeedback, splitSyllables } from '../phoneticFeedback';

describe('Phonetic & syllable feedback engine', () => {
  it('splits Latin and CJK words into readable syllables/characters', () => {
    expect(splitSyllables('international').length).toBeGreaterThanOrEqual(3);
    expect(splitSyllables('ありがとうございます')).toEqual(
      Array.from('ありがとうございます'),
    );
  });

  it('detects Brazilian phonetic pitfalls for English, French, and Mandarin', () => {
    const enRes = analyzePhoneticFeedback(
      'Thank you, they worked with the weather report.',
      'Tank you, dey worked wit de weader report.',
      'en',
    );
    expect(enRes.phoneticTips.length).toBeGreaterThan(0);
    expect(enRes.words.some((w) => !w.matched)).toBe(true);

    const frRes = analyzePhoneticFeedback(
      'Bonjour monsieur, je voudrais un bon croissant.',
      'Bonjour monsieur, je voudrais',
      'fr',
    );
    expect(frRes.phoneticTips.length).toBeGreaterThan(0);

    const zhRes = analyzePhoneticFeedback('你好，请问洗手间在哪里？', '你好', 'zh');
    expect(zhRes.phoneticTips[0]?.ruleTitle).toContain('Mandarim');
  });
});

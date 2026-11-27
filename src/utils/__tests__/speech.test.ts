/**
 * @file src/utils/__tests__/speech.test.ts
 * @description Suíte de testes unitários Vitest validando speech.
 */
import { describe, expect, it } from 'vitest';
import { evaluatePronunciation } from '../speech';

describe('speech pronunciation evaluator', () => {
  it('scores 100% on exact or contracted matches', () => {
    const res = evaluatePronunciation(
      "I'd like an iced coffee, please.",
      'I would like an iced coffee please',
    );
    expect(res.score).toBe(100);
    expect(res.words.every((w) => w.matched)).toBe(true);
  });

  it('highlights missed words accurately', () => {
    const res = evaluatePronunciation(
      'Could I have the menu please',
      'Could I have menu',
    );
    expect(res.score).toBe(67);
    const theWord = res.words.find((w) => w.word === 'the');
    expect(theWord?.matched).toBe(false);
  });
});

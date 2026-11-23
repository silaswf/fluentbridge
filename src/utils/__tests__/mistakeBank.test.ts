import { describe, expect, it } from 'vitest';
import {
  addMistakeEntry,
  getActiveMistakesByLanguage,
  markMistakeResolved,
} from '../mistakeBank';

describe('Smart Mistake Notebook (Caderno de Erros)', () => {
  it('captures mistakes without duplicating identical topicId+expectedAnswer and resolves them', () => {
    let bank = addMistakeEntry([], {
      languageCode: 'de',
      topicId: 'de-a1-1',
      topicTitle: 'Begrüßung',
      skill: 'grammar',
      prompt: 'Complete:',
      studentAnswer: 'Ich bin kalt',
      expectedAnswer: 'Mir ist kalt',
      explanation: 'Em alemão usa-se dativo: Mir ist kalt.',
    });
    expect(bank.length).toBe(1);

    bank = addMistakeEntry(bank, {
      languageCode: 'de',
      topicId: 'de-a1-1',
      topicTitle: 'Begrüßung',
      skill: 'grammar',
      prompt: 'Complete:',
      studentAnswer: 'Ich habe kalt',
      expectedAnswer: 'Mir ist kalt',
      explanation: 'Em alemão usa-se dativo: Mir ist kalt.',
    });
    expect(bank.length).toBe(1);
    expect(bank[0].studentAnswer).toBe('Ich habe kalt');
    expect(getActiveMistakesByLanguage(bank, 'de').length).toBe(1);

    bank = markMistakeResolved(bank, bank[0].id, true);
    expect(getActiveMistakesByLanguage(bank, 'de').length).toBe(0);
    expect(bank[0].reviewCount).toBe(1);
  });
});

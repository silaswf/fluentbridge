/**
 * @file src/utils/__tests__/vocabUnlock.test.ts
 * @description Suíte de testes unitários Vitest validando vocabUnlock.
 */
import { describe, expect, it } from 'vitest';
import type { VocabCard } from '../../types/learning';
import { getUnlockedVocabCards } from '../vocabUnlock';

const SAMPLE_VOCAB: VocabCard[] = [
  {
    id: 'v1',
    topicId: 'de-a1-1',
    languageCode: 'de',
    word: 'Guten Tag',
    translation: 'Boa tarde / Olá',
    ipa: '/ˈɡuːtn̩ taːk/',
    exampleEn: 'Guten Tag, wie geht es Ihnen?',
    examplePt: 'Boa tarde, como vai o(a) senhor(a)?',
    category: 'Saudações',
    strength: 'weak',
    reviewCount: 0,
  },
  {
    id: 'v2',
    topicId: 'de-a1-2',
    languageCode: 'de',
    word: 'Danke schön',
    translation: 'Muito obrigado',
    ipa: '/ˈdaŋkə øːn/',
    exampleEn: 'Danke schön für Ihre Hilfe!',
    examplePt: 'Muito obrigado pela sua ajuda!',
    category: 'Cortesia',
    strength: 'weak',
    reviewCount: 0,
  },
  {
    id: 'v3',
    topicId: 'de-b2-1',
    languageCode: 'de',
    word: 'Nachhaltigkeit',
    translation: 'Sustentabilidade',
    ipa: '/ˈnaːxhaltɪçkaɪt/',
    exampleEn: 'Nachhaltigkeit spielt heute eine zentrale Rolle.',
    examplePt: 'Sustentabilidade desempenha um papel central hoje.',
    category: 'Negócios',
    strength: 'weak',
    reviewCount: 0,
  },
];

describe('Duolingo/Busuu-style progressive vocabulary unlock', () => {
  it('starts empty for a new user with no studied units or learned cards', () => {
    const unlocked = getUnlockedVocabCards(SAMPLE_VOCAB, {
      completedTopicIds: [],
      learnedVocabIds: [],
    });
    expect(unlocked).toEqual([]);
  });

  it('unlocks cards as soon as the student advances through the unit Vocab stage or completes the unit', () => {
    const unlocked = getUnlockedVocabCards(SAMPLE_VOCAB, {
      completedTopicIds: ['de-a1-1'],
      learnedVocabIds: ['v2'],
    });
    expect(unlocked.map((c) => c.id)).toEqual(['v1', 'v2']);
  });

  it('always keeps cards that already have SRS reviewCount > 0', () => {
    const withHistory: VocabCard[] = [
      ...SAMPLE_VOCAB.slice(0, 2),
      { ...SAMPLE_VOCAB[2], reviewCount: 2 },
    ];
    const unlocked = getUnlockedVocabCards(withHistory, {
      completedTopicIds: [],
      learnedVocabIds: [],
    });
    expect(unlocked.map((c) => c.id)).toEqual(['v3']);
  });
});

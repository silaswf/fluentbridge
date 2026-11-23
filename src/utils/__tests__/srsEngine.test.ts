import { describe, expect, it } from 'vitest';
import type { VocabCard } from '../../types/learning';
import {
  isCardDue,
  previewNextIntervalLabel,
  reviewVocabCardSM2,
} from '../srsEngine';

const SAMPLE_CARD: VocabCard = {
  id: 'v-test-1',
  topicId: 't-1',
  word: 'actually',
  translation: 'na verdade',
  ipa: '/ˈæk.tʃu.ə.li/',
  exampleEn: 'Actually, I live in Brazil.',
  examplePt: 'Na verdade, eu moro no Brasil.',
  category: 'Falso cognato',
  strength: 'weak',
  reviewCount: 0,
};

describe('SM-2 spaced repetition engine', () => {
  it('marks unscheduled weak/medium cards as due and mastered cards as not due', () => {
    expect(isCardDue(SAMPLE_CARD)).toBe(true);
    expect(isCardDue({ ...SAMPLE_CARD, strength: 'mastered' })).toBe(false);
  });

  it('schedules increasing intervals on good/easy ratings and resets on again', () => {
    const now = new Date('2026-11-23T12:00:00.000Z');
    const firstGood = reviewVocabCardSM2(SAMPLE_CARD, 'good', now);
    expect(firstGood.intervalDays).toBe(1);
    expect(firstGood.repetitions).toBe(1);
    expect(isCardDue(firstGood, now)).toBe(false);

    const secondGood = reviewVocabCardSM2(firstGood, 'good', now);
    expect(secondGood.intervalDays).toBe(3);
    expect(secondGood.strength).toBe('medium');

    const thirdEasy = reviewVocabCardSM2(secondGood, 'easy', now);
    expect((thirdEasy.intervalDays ?? 0) >= 6).toBe(true);
    expect(thirdEasy.strength).toBe('mastered');

    const lapsed = reviewVocabCardSM2(thirdEasy, 'again', now);
    expect(lapsed.intervalDays).toBe(0);
    expect(lapsed.strength).toBe('weak');
    expect(lapsed.lapses).toBe(1);
  });

  it('previews readable labels for each SM-2 button', () => {
    expect(previewNextIntervalLabel(SAMPLE_CARD, 'again')).toBe('10 min');
    expect(previewNextIntervalLabel(SAMPLE_CARD, 'hard')).toBe('1 dia');
    expect(previewNextIntervalLabel(SAMPLE_CARD, 'easy')).toBe('4 dias');
  });
});

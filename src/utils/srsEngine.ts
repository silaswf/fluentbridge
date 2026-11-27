/**
 * @file src/utils/srsEngine.ts
 * @description Algoritmo SM-2 de repetição espaçada: calcula intervalo, fator de facilidade e próxima revisão de flashcards.
 * @exports SrsRating, isCardDue, previewNextIntervalLabel, reviewVocabCardSM2, sortCardsForReview, buildClozePrompt
 */
import type { VocabCard } from '../types/learning';

export type SrsRating = 'again' | 'hard' | 'good' | 'easy';

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;
const DAY_MS = 24 * 60 * 60 * 1000;

export function isCardDue(card: VocabCard, now: Date = new Date()): boolean {
  if (!card.nextReviewAt) {
    // Cards sem data SM-2 vencem imediatamente se não estiverem dominados
    return card.strength !== 'mastered';
  }
  const dueMs = Date.parse(card.nextReviewAt);
  if (Number.isNaN(dueMs)) return card.strength !== 'mastered';
  return dueMs <= now.getTime();
}

function computeSm2Step(card: VocabCard, rating: SrsRating) {
  const prevEase =
    typeof card.easeFactor === 'number' && card.easeFactor >= MIN_EASE
      ? card.easeFactor
      : DEFAULT_EASE;
  const prevReps = card.repetitions ?? (card.reviewCount > 0 ? 1 : 0);
  const prevInterval = card.intervalDays ?? (card.strength === 'mastered' ? 6 : card.strength === 'medium' ? 2 : 0);
  const prevLapses = card.lapses ?? 0;

  let nextEase = prevEase;
  let nextReps = prevReps;
  let nextIntervalDays = 1;
  let nextLapses = prevLapses;
  let nextStrength: VocabCard['strength'] = card.strength;

  if (rating === 'again') {
    nextReps = 0;
    nextIntervalDays = 0; // Re-aparece hoje (~10 min / mesma sessão)
    nextEase = Math.max(MIN_EASE, Number((prevEase - 0.2).toFixed(2)));
    nextLapses = prevLapses + 1;
    nextStrength = 'weak';
  } else if (rating === 'hard') {
    nextReps = Math.max(1, prevReps);
    nextIntervalDays = prevInterval <= 1 ? 1 : Math.max(1, Math.round(prevInterval * 1.2));
    nextEase = Math.max(MIN_EASE, Number((prevEase - 0.14).toFixed(2)));
    nextStrength = nextIntervalDays >= 5 ? 'medium' : 'weak';
  } else if (rating === 'good') {
    nextReps = prevReps + 1;
    if (nextReps === 1) {
      nextIntervalDays = 1;
    } else if (nextReps === 2) {
      nextIntervalDays = 3;
    } else {
      nextIntervalDays = Math.max(3, Math.round((prevInterval || 3) * prevEase));
    }
    nextStrength = nextIntervalDays >= 6 ? 'mastered' : 'medium';
  } else {
    // easy
    nextReps = prevReps + 1;
    const base =
      nextReps === 1
        ? 4
        : nextReps === 2
          ? 7
          : Math.round((prevInterval || 4) * prevEase * 1.3);
    nextIntervalDays = Math.max(4, base);
    nextEase = Number((prevEase + 0.12).toFixed(2));
    nextStrength = nextIntervalDays >= 4 ? 'mastered' : 'medium';
  }

  return {
    nextEase,
    nextReps,
    nextIntervalDays,
    nextLapses,
    nextStrength,
  };
}

export function previewNextIntervalLabel(card: VocabCard, rating: SrsRating): string {
  const { nextIntervalDays } = computeSm2Step(card, rating);
  if (nextIntervalDays <= 0) return '10 min';
  if (nextIntervalDays === 1) return '1 dia';
  return `${nextIntervalDays} dias`;
}

export function reviewVocabCardSM2(
  card: VocabCard,
  rating: SrsRating,
  now: Date = new Date(),
): VocabCard {
  const step = computeSm2Step(card, rating);
  const nextMs =
    step.nextIntervalDays <= 0
      ? now.getTime() + 10 * 60 * 1000
      : now.getTime() + step.nextIntervalDays * DAY_MS;

  return {
    ...card,
    strength: step.nextStrength,
    reviewCount: (card.reviewCount ?? 0) + 1,
    intervalDays: step.nextIntervalDays,
    easeFactor: step.nextEase,
    repetitions: step.nextReps,
    lapses: step.nextLapses,
    nextReviewAt: new Date(nextMs).toISOString(),
  };
}

export function sortCardsForReview(
  cards: VocabCard[],
  now: Date = new Date(),
): VocabCard[] {
  const strengthRank: Record<VocabCard['strength'], number> = {
    weak: 0,
    medium: 1,
    mastered: 2,
  };
  return [...cards].sort((a, b) => {
    const dueA = isCardDue(a, now) ? 0 : 1;
    const dueB = isCardDue(b, now) ? 0 : 1;
    if (dueA !== dueB) return dueA - dueB;
    const rankDiff = strengthRank[a.strength] - strengthRank[b.strength];
    if (rankDiff !== 0) return rankDiff;
    return (a.intervalDays ?? 0) - (b.intervalDays ?? 0);
  });
}

export function buildClozePrompt(
  exampleEn: string,
  rawWord: string,
): { maskedSentence: string; answer: string } {
  const cleanWord = rawWord
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\.{2,}|…/g, ' ')
    .split(/[\/|,;]+/)[0]
    .trim();

  const stripped = cleanWord
    .replace(
      /^(to|att|a|an|the|el|la|los|las|un|una|le|les|l'|il|lo|der|die|das|ein|eine|de|het|een|en|ett|'n)\s+/i,
      '',
    )
    .trim();

  const candidates = [cleanWord, stripped].filter((c) => c.length >= 2);
  for (const cand of candidates) {
    const escaped = cand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'i');
    if (re.test(exampleEn)) {
      return {
        maskedSentence: exampleEn.replace(re, '______'),
        answer: cand,
      };
    }
  }

  const tokens = stripped.split(/\s+/).filter((t) => t.length >= 4);
  if (tokens.length > 0) {
    const stem = tokens[0].slice(0, Math.max(3, tokens[0].length - 2));
    const stemRe = new RegExp(`\\b${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\p{L}]*`, 'iu');
    const m = exampleEn.match(stemRe);
    if (m) {
      return {
        maskedSentence: exampleEn.replace(stemRe, '______'),
        answer: m[0],
      };
    }
  }

  return {
    maskedSentence: `${exampleEn} ( ______ )`,
    answer: stripped || cleanWord,
  };
}

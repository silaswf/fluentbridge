import type { CEFRLevel, LanguageCode } from '../types/learning';

export interface PlacementQuestion {
  id: string;
  languageCode: LanguageCode;
  level: CEFRLevel;
  prompt: string;
  options: string[];
  correctIndex: number;
  topicNote: string;
}

export interface PlacementAnswerRecord {
  question: PlacementQuestion;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface LevelBreakdown {
  level: CEFRLevel;
  answered: number;
  correct: number;
}

export interface AdaptivePlacementSummary {
  recommendedLevel: CEFRLevel;
  correctCount: number;
  totalQuestions: number;
  abilityScore: number;
  highestMasteredLevel: CEFRLevel;
  breakdownByLevel: LevelBreakdown[];
}

export const ADAPTIVE_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const TOTAL_PLACEMENT_QUESTIONS = 15;
export const INITIAL_PLACEMENT_LEVEL: CEFRLevel = 'B1';

const LEVEL_NUMERIC: Record<CEFRLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
};

export function getNextAdaptiveLevel(
  currentLevel: CEFRLevel,
  isCorrect: boolean,
): CEFRLevel {
  const idx = ADAPTIVE_LEVELS.indexOf(currentLevel);
  const safeIdx = idx === -1 ? 2 : idx;
  const nextIdx = isCorrect
    ? Math.min(ADAPTIVE_LEVELS.length - 1, safeIdx + 1)
    : Math.max(0, safeIdx - 1);
  return ADAPTIVE_LEVELS[nextIdx];
}

export function pickNextPlacementQuestion(
  bank: PlacementQuestion[],
  targetLevel: CEFRLevel,
  answeredIds: Set<string>,
  stepSeed = 0,
): PlacementQuestion | null {
  const remaining = bank.filter((q) => !answeredIds.has(q.id));
  if (remaining.length === 0) return null;

  const targetIdx = ADAPTIVE_LEVELS.indexOf(targetLevel);
  const levelOrder = [...ADAPTIVE_LEVELS].sort(
    (a, b) =>
      Math.abs(ADAPTIVE_LEVELS.indexOf(a) - targetIdx) -
      Math.abs(ADAPTIVE_LEVELS.indexOf(b) - targetIdx),
  );

  for (const lvl of levelOrder) {
    const candidates = remaining.filter((q) => q.level === lvl);
    if (candidates.length > 0) {
      const pickIdx = Math.abs(stepSeed) % candidates.length;
      return candidates[pickIdx];
    }
  }

  return remaining[0];
}

export function computeAdaptivePlacementResult(
  records: PlacementAnswerRecord[],
): AdaptivePlacementSummary {
  const breakdownMap: Record<CEFRLevel, { answered: number; correct: number }> = {
    A1: { answered: 0, correct: 0 },
    A2: { answered: 0, correct: 0 },
    B1: { answered: 0, correct: 0 },
    B2: { answered: 0, correct: 0 },
    C1: { answered: 0, correct: 0 },
  };

  if (records.length === 0) {
    return {
      recommendedLevel: 'A1',
      correctCount: 0,
      totalQuestions: 0,
      abilityScore: 1,
      highestMasteredLevel: 'A1',
      breakdownByLevel: ADAPTIVE_LEVELS.map((level) => ({
        level,
        answered: 0,
        correct: 0,
      })),
    };
  }

  let weightedSum = 0;
  let weightTotal = 0;
  let correctCount = 0;

  records.forEach((rec, index) => {
    const lvl = rec.question.level;
    const d = LEVEL_NUMERIC[lvl] ?? 3;
    breakdownMap[lvl].answered += 1;
    if (rec.isCorrect) {
      breakdownMap[lvl].correct += 1;
      correctCount += 1;
    }

    // Converges to L + 0.25 when a student passes level L and misses L + 1
    const stepOutcome = rec.isCorrect ? d + 0.25 : Math.max(1, d - 0.75);
    // Weight later questions higher once the adaptive staircase has converged
    const weight = index >= 5 ? 1.5 : 1.0;
    weightedSum += stepOutcome * weight;
    weightTotal += weight;
  });

  const abilityScore = Number((weightedSum / Math.max(1, weightTotal)).toFixed(2));

  let recommendedLevel: CEFRLevel = 'A1';
  if (abilityScore >= 4.65) {
    recommendedLevel = 'C1';
  } else if (abilityScore >= 3.75) {
    recommendedLevel = 'B2';
  } else if (abilityScore >= 2.75) {
    recommendedLevel = 'B1';
  } else if (abilityScore >= 1.75) {
    recommendedLevel = 'A2';
  } else {
    recommendedLevel = 'A1';
  }

  let highestMasteredLevel: CEFRLevel = 'A1';
  for (const lvl of ADAPTIVE_LEVELS) {
    const stats = breakdownMap[lvl];
    if (stats.correct >= 2 || (stats.answered === 1 && stats.correct === 1)) {
      highestMasteredLevel = lvl;
    }
  }

  return {
    recommendedLevel,
    correctCount,
    totalQuestions: records.length,
    abilityScore,
    highestMasteredLevel,
    breakdownByLevel: ADAPTIVE_LEVELS.map((level) => ({
      level,
      answered: breakdownMap[level].answered,
      correct: breakdownMap[level].correct,
    })),
  };
}

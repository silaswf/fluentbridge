/**
 * @file src/utils/vocabUnlock.ts
 * @description Controla desbloqueio progressivo de vocabulário e metadados das etapas dentro do LessonPlayer.
 * @exports getUnlockedVocabCards, LessonStageKey, getStepStageMeta
 */
import type { LessonStep, UserProfile, VocabCard } from '../types/learning';

/**
 * Progressive Duolingo/Busuu-style vocabulary unlocking:
 * A card enters the student's active SRS review deck only after:
 * 1) The student completes or advances past that unit's Vocabulary stage (`learnedVocabIds`), OR
 * 2) The student has completed the unit (`completedTopicIds`), OR
 * 3) The card already has review history (`reviewCount > 0`).
 */
export function getUnlockedVocabCards(
  courseVocab: VocabCard[],
  user: Pick<UserProfile, 'completedTopicIds' | 'learnedVocabIds'>,
): VocabCard[] {
  const completedSet = new Set(user.completedTopicIds ?? []);
  const learnedSet = new Set(user.learnedVocabIds ?? []);

  return courseVocab.filter(
    (card) =>
      learnedSet.has(card.id) ||
      completedSet.has(card.topicId) ||
      card.reviewCount > 0,
  );
}

export type LessonStageKey =
  | 'vocab'
  | 'script'
  | 'tips'
  | 'listening'
  | 'reading'
  | 'practice'
  | 'speaking'
  | 'writing';

export function getStepStageMeta(step: LessonStep): {
  key: LessonStageKey;
  label: string;
} {
  switch (step.type) {
    case 'vocab_intro':
      return { key: 'vocab', label: 'Vocabulário' };
    case 'script_phonics':
      return { key: 'script', label: step.stageLabelPt ?? 'Letras & Sons' };
    case 'tip':
      return { key: 'tips', label: 'Dicas' };
    case 'listening':
    case 'dictation':
    case 'minimal_pairs':
      return { key: 'listening', label: 'Listening' };
    case 'reading':
    case 'story':
      return { key: 'reading', label: 'Reading' };
    case 'matching':
    case 'fill_blank':
      return { key: 'practice', label: 'Prática' };
    case 'speaking':
      return { key: 'speaking', label: 'Speaking' };
    case 'writing_builder':
    case 'writing_free':
      return { key: 'writing', label: 'Writing' };
  }
}

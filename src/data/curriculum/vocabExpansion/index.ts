/**
 * @file src/data/curriculum/vocabExpansion/index.ts
 * @description Expansão e correções lexicais de vocabulário para o curso de index.
 * @exports mergeCourseVocab
 */
import type { LanguageCode, VocabCard } from '../../../types/learning';
import type { VocabExampleFixMap, VocabExpansionTuple } from './types';

export { VOCAB_EXP_EN, VOCAB_FIXES_EN } from './vocabExpEn';
export { VOCAB_EXP_ES, VOCAB_FIXES_ES } from './vocabExpEs';
export { VOCAB_EXP_FR, VOCAB_FIXES_FR } from './vocabExpFr';
export { VOCAB_EXP_IT, VOCAB_FIXES_IT } from './vocabExpIt';
export { VOCAB_EXP_DE, VOCAB_FIXES_DE } from './vocabExpDe';
export { VOCAB_EXP_RU, VOCAB_FIXES_RU } from './vocabExpRu';
export { VOCAB_EXP_JA, VOCAB_FIXES_JA } from './vocabExpJa';
export { VOCAB_EXP_ZH, VOCAB_FIXES_ZH } from './vocabExpZh';
export { VOCAB_EXP_AR, VOCAB_FIXES_AR } from './vocabExpAr';
export { VOCAB_EXP_NL, VOCAB_FIXES_NL } from './vocabExpNl';
export { VOCAB_EXP_AF, VOCAB_FIXES_AF } from './vocabExpAf';
export { VOCAB_EXP_SV, VOCAB_FIXES_SV } from './vocabExpSv';

export function mergeCourseVocab(
  languageCode: LanguageCode,
  baseVocab: VocabCard[],
  extraTuples: VocabExpansionTuple[],
  exampleFixes: VocabExampleFixMap,
): VocabCard[] {
  const seenWordsByTopic = new Map<string, Set<string>>();

  const patchedBase = baseVocab.map((card) => {
    const words = seenWordsByTopic.get(card.topicId) ?? new Set<string>();
    words.add(card.word.trim().toLowerCase());
    seenWordsByTopic.set(card.topicId, words);

    const fix = exampleFixes[card.id];
    if (!fix) return card;
    return {
      ...card,
      exampleEn: fix.exampleEn,
      examplePt: fix.examplePt,
    };
  });

  const localCounters = new Map<string, number>();
  const added: VocabCard[] = [];

  for (const [topicId, word, ipa, translation, category, exampleEn, examplePt] of extraTuples) {
    const normWord = word.trim().toLowerCase();
    const words = seenWordsByTopic.get(topicId) ?? new Set<string>();
    if (words.has(normWord)) continue;
    words.add(normWord);
    seenWordsByTopic.set(topicId, words);

    const nextIdx = (localCounters.get(topicId) ?? 0) + 1;
    localCounters.set(topicId, nextIdx);

    added.push({
      id: `voc-exp-${topicId}-${nextIdx}`,
      topicId,
      languageCode,
      word,
      translation,
      ipa,
      exampleEn,
      examplePt,
      category,
      strength: 'weak',
      reviewCount: 0,
    });
  }

  return [...patchedBase, ...added];
}

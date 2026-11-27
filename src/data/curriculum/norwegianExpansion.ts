/**
 * @file src/data/curriculum/norwegianExpansion.ts
 * @description Conteúdo curricular (norwegianExpansion) do curso de idiomas.
 * @exports NORWEGIAN_EXP_TOPICS, NORWEGIAN_EXP_VOCAB, NORWEGIAN_150_TOPICS, NORWEGIAN_150_VOCAB
 */
import type { Topic, VocabCard } from '../../types/learning';
import { buildLanguageVocab, buildRichLanguageTopic } from './courseBuilder';
import { NORWEGIAN_BASE_TOPICS, NORWEGIAN_BASE_VOCAB, NORWEGIAN_META } from './norwegianCourse';
import { NORWEGIAN_EXP_PART1_BLUEPRINTS } from './norwegianExpansionPart1';
import { NORWEGIAN_EXP_PART2_BLUEPRINTS } from './norwegianExpansionPart2';

const NORWEGIAN_EXP_BLUEPRINTS = [
  ...NORWEGIAN_EXP_PART1_BLUEPRINTS,
  ...NORWEGIAN_EXP_PART2_BLUEPRINTS,
];

export const NORWEGIAN_EXP_TOPICS: Topic[] = NORWEGIAN_EXP_BLUEPRINTS.map(
  (bp, idx) => buildRichLanguageTopic(bp, idx + 75, NORWEGIAN_META),
);

export const NORWEGIAN_EXP_VOCAB: VocabCard[] = buildLanguageVocab(
  NORWEGIAN_EXP_BLUEPRINTS,
  'nb',
);

export const NORWEGIAN_150_TOPICS: Topic[] = [
  ...NORWEGIAN_BASE_TOPICS,
  ...NORWEGIAN_EXP_TOPICS,
];

export const NORWEGIAN_150_VOCAB: VocabCard[] = [
  ...NORWEGIAN_BASE_VOCAB,
  ...NORWEGIAN_EXP_VOCAB,
];

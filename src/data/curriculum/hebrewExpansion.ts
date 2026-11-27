/**
 * @file src/data/curriculum/hebrewExpansion.ts
 * @description Conteúdo curricular (hebrewExpansion) do curso de idiomas.
 * @exports HEBREW_EXP_TOPICS, HEBREW_EXP_VOCAB, HEBREW_150_TOPICS, HEBREW_150_VOCAB
 */
import type { Topic, VocabCard } from '../../types/learning';
import { buildLanguageVocab, buildRichLanguageTopic } from './courseBuilder';
import { HEBREW_BASE_TOPICS, HEBREW_BASE_VOCAB, HEBREW_META } from './hebrewCourse';
import { HEBREW_EXP_PART1_BLUEPRINTS } from './hebrewExpansionPart1';
import { HEBREW_EXP_PART2_BLUEPRINTS } from './hebrewExpansionPart2';

const HEBREW_EXP_BLUEPRINTS = [
  ...HEBREW_EXP_PART1_BLUEPRINTS,
  ...HEBREW_EXP_PART2_BLUEPRINTS,
];

export const HEBREW_EXP_TOPICS: Topic[] = HEBREW_EXP_BLUEPRINTS.map((bp, idx) =>
  buildRichLanguageTopic(bp, idx + HEBREW_BASE_TOPICS.length, HEBREW_META),
);

export const HEBREW_EXP_VOCAB: VocabCard[] = buildLanguageVocab(
  HEBREW_EXP_BLUEPRINTS,
  'he',
);

export const HEBREW_150_TOPICS: Topic[] = [
  ...HEBREW_BASE_TOPICS,
  ...HEBREW_EXP_TOPICS,
];

export const HEBREW_150_VOCAB: VocabCard[] = [
  ...HEBREW_BASE_VOCAB,
  ...HEBREW_EXP_VOCAB,
];

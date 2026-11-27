/**
 * @file src/data/curriculum/expansionV9/expV9_ar.ts
 * @description Expansão curricular v9.0 (+47 unidades coesas A1–C1 para completar 150 unidades) em Árabe (RTL).
 * @exports AR_V9_TOPICS, AR_V9_VOCAB
 */
import type { Topic, VocabCard } from '../../../types/learning';
import { buildLanguageVocab, buildRichLanguageTopic } from '../courseBuilder';
import { ARABIC_META } from '../arabicCourse';
import { AR_V9_PART1_BLUEPRINTS } from './expV9_ar_part1';
import { AR_V9_PART2_BLUEPRINTS } from './expV9_ar_part2';

const AR_V9_BLUEPRINTS = [
  ...AR_V9_PART1_BLUEPRINTS,
  ...AR_V9_PART2_BLUEPRINTS,
];

export const AR_V9_TOPICS: Topic[] = AR_V9_BLUEPRINTS.map((bp, idx) => ({
  ...buildRichLanguageTopic(bp, idx + 103, ARABIC_META),
  conceptKey: bp.conceptKey,
  ...(bp.prerequisiteConcepts ? { prerequisiteConcepts: bp.prerequisiteConcepts } : {}),
}));

export const AR_V9_VOCAB: VocabCard[] = buildLanguageVocab(
  AR_V9_BLUEPRINTS,
  'ar',
);

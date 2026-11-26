import type { Topic, VocabCard } from '../../types/learning';
import {
  PORTUGUESE_EXP_A1B1_TOPICS,
  PORTUGUESE_EXP_A1B1_VOCAB,
} from './portugueseExpansionA1B1';
import {
  PORTUGUESE_EXP_B2C1_TOPICS,
  PORTUGUESE_EXP_B2C1_VOCAB,
} from './portugueseExpansionB2C1';
export type { Topic, VocabCard } from '../../types/learning';

const TRIMMED_IDS = new Set(['pt-exp-b1-19', 'pt-exp-b1-20', 'pt-exp-b2-20']);

export const PORTUGUESE_EXPANSION_TOPICS: Topic[] = [
  ...PORTUGUESE_EXP_A1B1_TOPICS,
  ...PORTUGUESE_EXP_B2C1_TOPICS,
].filter((t) => !TRIMMED_IDS.has(t.id));

export const PORTUGUESE_EXPANSION_VOCAB: VocabCard[] = [
  ...PORTUGUESE_EXP_A1B1_VOCAB,
  ...PORTUGUESE_EXP_B2C1_VOCAB,
].filter((v) => !TRIMMED_IDS.has(v.topicId));

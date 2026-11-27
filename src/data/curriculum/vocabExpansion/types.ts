/**
 * @file src/data/curriculum/vocabExpansion/types.ts
 * @description Expansão e correções lexicais de vocabulário para o curso de types.
 * @exports VocabExpansionTuple, VocabExampleFixMap
 */
export type VocabExpansionTuple = [
  topicId: string,
  word: string,
  ipa: string,
  translationPt: string,
  category: string,
  exampleTarget: string,
  examplePt: string,
];

export type VocabExampleFixMap = Record<
  string,
  { exampleEn: string; examplePt: string }
>;

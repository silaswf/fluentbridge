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

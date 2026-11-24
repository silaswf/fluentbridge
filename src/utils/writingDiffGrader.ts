import type { LanguageCode, WritingChecklistItem } from '../types/learning';

export interface WritingDiffToken {
  type: 'keep' | 'remove' | 'add';
  text: string;
}

export interface WritingLineFeedback {
  score: number;
  wordCount: number;
  diffTokens: WritingDiffToken[];
  suggestionsPt: string[];
  naturalRewrite: string;
  mistakeItems: Array<{
    prompt: string;
    studentAnswer: string;
    expectedAnswer: string;
    explanation: string;
  }>;
}

function tokenizeWords(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function computeWordDiff(studentWords: string[], modelWords: string[]): WritingDiffToken[] {
  const m = studentWords.length;
  const n = modelWords.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array<number>(n + 1).fill(0),
  );

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (studentWords[i].toLowerCase() === modelWords[j].toLowerCase()) {
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const tokens: WritingDiffToken[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (studentWords[i].toLowerCase() === modelWords[j].toLowerCase()) {
      tokens.push({ type: 'keep', text: studentWords[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      tokens.push({ type: 'remove', text: studentWords[i] });
      i++;
    } else {
      tokens.push({ type: 'add', text: modelWords[j] });
      j++;
    }
  }
  while (i < m) {
    tokens.push({ type: 'remove', text: studentWords[i++] });
  }
  while (j < n) {
    tokens.push({ type: 'add', text: modelWords[j++] });
  }

  return tokens;
}

export function analyzeWritingLineByLine(
  studentText: string,
  modelAnswer: string,
  checklist: WritingChecklistItem[],
  languageCode: LanguageCode,
): WritingLineFeedback {
  const cleanStudent = studentText.trim();
  const cleanModel = modelAnswer.trim();
  const studentWords = tokenizeWords(cleanStudent);
  const modelWords = tokenizeWords(cleanModel);

  const diffTokens = computeWordDiff(
    studentWords.slice(0, 60),
    modelWords.slice(0, 60),
  );

  const suggestionsPt: string[] = [];
  const mistakeItems: WritingLineFeedback['mistakeItems'] = [];

  if (studentWords.length === 0) {
    return {
      score: 0,
      wordCount: 0,
      diffTokens: [],
      suggestionsPt: ['Escreva sua resposta antes de solicitar a análise linha a linha.'],
      naturalRewrite: cleanModel,
      mistakeItems: [],
    };
  }

  if (!/[.!?。！？]$/.test(cleanStudent)) {
    suggestionsPt.push('Finalize sua frase com pontuação adequada (., ! ou ?).');
  }

  if (
    languageCode !== 'ja' &&
    languageCode !== 'zh' &&
    languageCode !== 'ar' &&
    /^[a-z]/.test(cleanStudent)
  ) {
    suggestionsPt.push('Inicie a primeira frase com letra maiúscula.');
  }

  if (languageCode === 'en' && /\bi\b/.test(cleanStudent)) {
    suggestionsPt.push('Em inglês, o pronome "I" (eu) é sempre escrito em maiúscula.');
    mistakeItems.push({
      prompt: 'Capitalização do pronome "I"',
      studentAnswer: 'i',
      expectedAnswer: 'I',
      explanation: 'No inglês escrito, o pronome pessoal "I" nunca fica em minúscula.',
    });
  }

  const lower = cleanStudent.toLowerCase();
  const missedChecklist = checklist.filter(
    (item) => !item.keywords.some((kw) => lower.includes(kw.toLowerCase())),
  );
  for (const missed of missedChecklist.slice(0, 2)) {
    suggestionsPt.push(`Inclua o requisito do roteiro: "${missed.label}".`);
  }

  if (studentWords.length < Math.max(4, Math.floor(modelWords.length * 0.45))) {
    suggestionsPt.push(
      `Desenvolva um pouco mais a resposta (${studentWords.length} palavras; referência sugerida ~${modelWords.length}).`,
    );
  }

  const keptCount = diffTokens.filter((t) => t.type === 'keep').length;
  const checklistScore =
    checklist.length > 0
      ? ((checklist.length - missedChecklist.length) / checklist.length) * 55
      : 55;
  const overlapScore =
    modelWords.length > 0
      ? Math.min(45, (keptCount / Math.max(1, modelWords.length)) * 55)
      : 35;

  const score = Math.max(
    15,
    Math.min(100, Math.round(checklistScore + overlapScore)),
  );

  if (suggestionsPt.length === 0) {
    suggestionsPt.push('Excelente coesão, pontuação e vocabulário alinhado ao modelo!');
  }

  return {
    score,
    wordCount: studentWords.length,
    diffTokens,
    suggestionsPt,
    naturalRewrite: cleanModel,
    mistakeItems,
  };
}

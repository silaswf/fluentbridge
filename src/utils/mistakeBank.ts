import type { LanguageCode, MistakeEntry, SkillType } from '../types/learning';

export const MAX_MISTAKE_BANK_ITEMS = 150;

export function addMistakeEntry(
  existing: MistakeEntry[] | undefined,
  payload: {
    languageCode: LanguageCode;
    topicId: string;
    topicTitle: string;
    skill: SkillType | 'grammar' | 'vocab';
    prompt: string;
    studentAnswer: string;
    expectedAnswer: string;
    explanation: string;
  },
): MistakeEntry[] {
  const list = existing ?? [];
  const normExpected = payload.expectedAnswer.trim().toLowerCase();
  const idx = list.findIndex(
    (m) =>
      m.languageCode === payload.languageCode &&
      m.topicId === payload.topicId &&
      m.expectedAnswer.trim().toLowerCase() === normExpected,
  );

  const nowIso = new Date().toISOString();
  if (idx >= 0) {
    const updated = [...list];
    const current = updated[idx];
    updated[idx] = {
      ...current,
      studentAnswer: payload.studentAnswer || current.studentAnswer,
      explanation: payload.explanation || current.explanation,
      createdAt: nowIso,
      resolved: false,
      reviewCount: current.reviewCount,
    };
    return updated;
  }

  const entry: MistakeEntry = {
    id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    languageCode: payload.languageCode,
    topicId: payload.topicId,
    topicTitle: payload.topicTitle,
    skill: payload.skill,
    prompt: payload.prompt,
    studentAnswer: payload.studentAnswer,
    expectedAnswer: payload.expectedAnswer,
    explanation: payload.explanation,
    createdAt: nowIso,
    reviewCount: 0,
    resolved: false,
  };

  return [entry, ...list].slice(0, MAX_MISTAKE_BANK_ITEMS);
}

export function markMistakeResolved(
  existing: MistakeEntry[] | undefined,
  mistakeId: string,
  resolved = true,
): MistakeEntry[] {
  return (existing ?? []).map((m) =>
    m.id === mistakeId
      ? {
          ...m,
          resolved,
          reviewCount: m.reviewCount + 1,
        }
      : m,
  );
}

export function getActiveMistakesByLanguage(
  existing: MistakeEntry[] | undefined,
  languageCode: LanguageCode,
): MistakeEntry[] {
  return (existing ?? []).filter(
    (m) => m.languageCode === languageCode && !m.resolved,
  );
}

import type { LanguageCode, MistakeEntry, VocabCard } from '../types/learning';

export interface PedagogicalMemorySummary {
  weakWords: string[];
  recentMistakes: string[];
  promptInstruction: string;
}

export function buildPedagogicalMemoryContext(
  languageCode: LanguageCode,
  vocab: VocabCard[],
  mistakeBank: MistakeEntry[] | undefined,
): PedagogicalMemorySummary {
  const langVocab = vocab.filter((c) => (c.languageCode ?? 'en') === languageCode);
  const weakCards = [...langVocab]
    .filter((c) => c.strength === 'weak' || (c.lapses ?? 0) > 0 || c.reviewCount > 0)
    .sort((a, b) => {
      const scoreA = (a.strength === 'weak' ? -2 : a.strength === 'medium' ? 0 : 2) - (a.lapses ?? 0);
      const scoreB = (b.strength === 'weak' ? -2 : b.strength === 'medium' ? 0 : 2) - (b.lapses ?? 0);
      return scoreA - scoreB;
    })
    .slice(0, 5);

  const weakWords = weakCards.map((c) => c.word);
  const recentMistakes = (mistakeBank ?? [])
    .filter((m) => (m.languageCode ?? 'en') === languageCode && !m.resolved)
    .slice(0, 5)
    .map((m) => `${m.expectedAnswer} (erro: "${m.studentAnswer}")`);

  const parts: string[] = [];
  if (weakWords.length > 0) {
    parts.push(
      `Vocabulário prioritário do aluno no SRS para reforçar naturalmente na conversa: ${weakWords.join(', ')}.`,
    );
  }
  if (recentMistakes.length > 0) {
    parts.push(
      `Erros recentes do aluno no Caderno de Erros para corrigir com delicadeza se surgirem: ${recentMistakes.join('; ')}.`,
    );
  }

  return {
    weakWords,
    recentMistakes,
    promptInstruction: parts.join(' '),
  };
}

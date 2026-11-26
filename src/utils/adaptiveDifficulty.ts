export type AdaptiveDifficultyMode = 'guided' | 'balanced' | 'immersive';

export interface AdaptiveProfile {
  mode: AdaptiveDifficultyMode;
  labelPt: string;
  recommendedRate: number;
  autoShowHints: boolean;
  summaryPt: string;
}

export function computeAdaptiveProfile(
  correctCount: number,
  wrongCount: number,
  combo: number,
  manualOverride?: AdaptiveDifficultyMode | null,
): AdaptiveProfile {
  if (manualOverride === 'guided') {
    return {
      mode: 'guided',
      labelPt: 'Guiado (0.85x · Dicas)',
      recommendedRate: 0.85,
      autoShowHints: true,
      summaryPt: 'Áudio mais pausado e apoio extra em português.',
    };
  }
  if (manualOverride === 'immersive') {
    return {
      mode: 'immersive',
      labelPt: 'Desafio Nativo (1.08x)',
      recommendedRate: 1.08,
      autoShowHints: false,
      summaryPt: 'Velocidade natural/rápida sem dicas automáticas.',
    };
  }
  if (manualOverride === 'balanced') {
    return {
      mode: 'balanced',
      labelPt: 'Equilibrado (1.0x)',
      recommendedRate: 1.0,
      autoShowHints: false,
      summaryPt: 'Ritmo padrão adaptado ao seu nível.',
    };
  }

  const total = correctCount + wrongCount;
  const accuracy = total > 0 ? correctCount / total : 1;

  if (wrongCount >= 2 || (total >= 3 && accuracy < 0.6)) {
    return {
      mode: 'guided',
      labelPt: 'Guiado (Auto · 0.85x)',
      recommendedRate: 0.85,
      autoShowHints: true,
      summaryPt: 'Ritmo desacelerado automaticamente após erros recentes.',
    };
  }

  if (combo >= 4 && accuracy >= 0.88) {
    return {
      mode: 'immersive',
      labelPt: 'Desafio Nativo (Auto · 1.08x)',
      recommendedRate: 1.08,
      autoShowHints: false,
      summaryPt: 'Combo alto detectado: áudio em ritmo nativo fluido.',
    };
  }

  return {
    mode: 'balanced',
    labelPt: 'Equilibrado (1.0x)',
    recommendedRate: 1.0,
    autoShowHints: false,
    summaryPt: 'Ritmo padrão adaptado ao seu desempenho.',
  };
}

export interface AdaptiveHistoryState {
  recent: boolean[];
  manualOverride: AdaptiveDifficultyMode | null;
}

function getAdaptiveStorageKey(userId: string, languageCode: string): string {
  return `fb_adaptive_v1:${userId || 'anon'}:${languageCode || 'en'}`;
}

export function loadAdaptiveHistory(
  userId: string,
  languageCode: string,
): AdaptiveHistoryState {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return { recent: [], manualOverride: null };
  }
  try {
    const raw = window.localStorage.getItem(getAdaptiveStorageKey(userId, languageCode));
    if (!raw) return { recent: [], manualOverride: null };
    const parsed = JSON.parse(raw) as Partial<AdaptiveHistoryState>;
    const recent = Array.isArray(parsed.recent)
      ? parsed.recent.filter((v): v is boolean => typeof v === 'boolean').slice(-20)
      : [];
    const manualOverride =
      parsed.manualOverride === 'guided' ||
      parsed.manualOverride === 'balanced' ||
      parsed.manualOverride === 'immersive'
        ? parsed.manualOverride
        : null;
    return { recent, manualOverride };
  } catch {
    return { recent: [], manualOverride: null };
  }
}

function persistAdaptiveHistory(
  userId: string,
  languageCode: string,
  next: AdaptiveHistoryState,
): void {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(
      getAdaptiveStorageKey(userId, languageCode),
      JSON.stringify({
        recent: next.recent.slice(-20),
        manualOverride: next.manualOverride,
      }),
    );
  } catch {
    // Ignore quota errors
  }
}

export function recordAdaptiveAttempt(
  userId: string,
  languageCode: string,
  isCorrect: boolean,
): AdaptiveHistoryState {
  const current = loadAdaptiveHistory(userId, languageCode);
  const next: AdaptiveHistoryState = {
    ...current,
    recent: [...current.recent, isCorrect].slice(-20),
  };
  persistAdaptiveHistory(userId, languageCode, next);
  return next;
}

export function saveAdaptiveOverride(
  userId: string,
  languageCode: string,
  mode: AdaptiveDifficultyMode | null,
): AdaptiveHistoryState {
  const current = loadAdaptiveHistory(userId, languageCode);
  const next: AdaptiveHistoryState = {
    ...current,
    manualOverride: mode,
  };
  persistAdaptiveHistory(userId, languageCode, next);
  return next;
}

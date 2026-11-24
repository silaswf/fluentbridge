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

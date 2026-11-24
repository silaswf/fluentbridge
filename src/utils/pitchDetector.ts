/**
 * Autocorrelation-based F0 (fundamental frequency) pitch detector for real-time
 * Mandarin tone (1–4) and Japanese pitch accent visual feedback.
 */
export function detectPitchHz(
  buffer: Float32Array,
  sampleRate: number,
): number | null {
  const SIZE = buffer.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.015) return null; // Silence / background noise

  let r1 = 0;
  let r2 = SIZE - 1;
  const threshold = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  const trimmed = buffer.slice(r1, r2);
  const n = trimmed.length;
  if (n < 32) return null;

  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n - i; j++) {
      sum += trimmed[j] * trimmed[j + i];
    }
    c[i] = sum;
  }

  let d = 0;
  while (d < n - 1 && c[d] > c[d + 1]) {
    d++;
  }
  let maxVal = -1;
  let maxPos = -1;
  for (let i = d; i < n; i++) {
    if (c[i] > maxVal) {
      maxVal = c[i];
      maxPos = i;
    }
  }
  if (maxPos <= 0 || maxVal <= 0) return null;

  const freq = sampleRate / maxPos;
  if (freq < 65 || freq > 550) return null;
  return Math.round(freq * 10) / 10;
}

export function normalizePitchToContour(hzSamples: number[]): number[] {
  const valid = hzSamples.filter((v) => Number.isFinite(v) && v > 0);
  if (valid.length === 0) return [];
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const span = Math.max(25, max - min);
  return valid.map((hz) => Math.max(0.08, Math.min(0.95, (hz - min) / span)));
}

export function getMandarinToneContour(tone: 1 | 2 | 3 | 4): {
  labelPt: string;
  points: number[];
} {
  switch (tone) {
    case 1:
      return { labelPt: '1º Tom (55 · Alto e estável)', points: [0.85, 0.85, 0.85, 0.85, 0.85] };
    case 2:
      return { labelPt: '2º Tom (35 · Subindo)', points: [0.45, 0.55, 0.68, 0.8, 0.9] };
    case 3:
      return { labelPt: '3º Tom (214 · Cai e sobe)', points: [0.38, 0.2, 0.14, 0.35, 0.68] };
    case 4:
      return { labelPt: '4º Tom (51 · Queda firme)', points: [0.92, 0.72, 0.5, 0.28, 0.12] };
  }
}

export function getJapanesePitchContour(
  pattern: 'heiban' | 'atamadaka' | 'nakadaka' | 'odaka',
): { labelPt: string; points: number[] } {
  switch (pattern) {
    case 'heiban':
      return { labelPt: 'Heiban (L-H-H-H · Plano)', points: [0.25, 0.78, 0.8, 0.8, 0.8] };
    case 'atamadaka':
      return { labelPt: 'Atamadaka (H-L-L · Cai no início)', points: [0.86, 0.35, 0.25, 0.22, 0.2] };
    case 'nakadaka':
      return { labelPt: 'Nakadaka (L-H-L · Pico no meio)', points: [0.25, 0.8, 0.82, 0.28, 0.22] };
    case 'odaka':
      return { labelPt: 'Odaka (L-H-H-L · Cai na partícula)', points: [0.25, 0.76, 0.8, 0.8, 0.24] };
  }
}

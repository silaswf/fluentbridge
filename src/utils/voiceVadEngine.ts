/**
 * @file src/utils/voiceVadEngine.ts
 * @description Utilitário voiceVadEngine da camada de lógica do FluentBridge.
 * @exports VadSessionState, VadUtterancePayload, ContinuousVadOptions, analyzeProsody, startContinuousVadSession
 */
import type { ProsodyAnalysis } from '../types/learning';

export type VadSessionState = 'idle' | 'listening' | 'speaking' | 'processing';

export interface VadUtterancePayload {
  blob: Blob;
  speechDurationMs: number;
  pauseMs: number;
  rmsSamples: number[];
}

export interface ContinuousVadOptions {
  silenceMs?: number;
  speechThreshold?: number;
  silenceThreshold?: number;
  isAssistantSpeaking: () => boolean;
  bargeInEnabled: () => boolean;
  onBargeIn?: () => void;
  onLevel: (level: number, bars: number[]) => void;
  onStateChange: (state: VadSessionState) => void;
  onUtterance: (payload: VadUtterancePayload) => void;
  onError: (msg: string) => void;
}

const CJK_CHAR_RE = /[\u3040-\u30ff\u3400-\u9fff]/g;
const FILLER_RE = /\b(uh|um|erm|eh|ah|hmm|tipo|né|euh|äh|este|ehh)\b/gi;

export function analyzeProsody(
  transcript: string,
  speechDurationMs: number,
  pauseMs: number,
  rmsSamples: number[],
): ProsodyAnalysis {
  const clean = transcript.trim();
  const cjkMatches = clean.match(CJK_CHAR_RE);
  const wordCount = cjkMatches
    ? Math.max(1, Math.round(cjkMatches.length / 1.8))
    : clean.split(/\s+/).filter(Boolean).length;

  const effectiveSec = Math.max(0.8, speechDurationMs / 1000);
  const rawWpm = Math.round((wordCount / effectiveSec) * 60);
  const wpm = Math.max(20, Math.min(240, rawWpm));

  const paceLabel: ProsodyAnalysis['paceLabel'] =
    wpm < 95 ? 'Lento' : wpm <= 165 ? 'Natural' : 'Rápido';

  // Intonation / dynamic energy modulation from RMS variance
  let intonationScore = 76;
  if (rmsSamples.length >= 4) {
    const mean = rmsSamples.reduce((a, b) => a + b, 0) / rmsSamples.length;
    const variance =
      rmsSamples.reduce((acc, v) => acc + (v - mean) ** 2, 0) / rmsSamples.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0.005 ? stdDev / mean : 0.25;
    // Expressive speech typically has coefficient of variation 0.35 - 0.85
    intonationScore = Math.round(Math.max(45, Math.min(98, 52 + cv * 62)));
  }

  const fillerMatches = clean.match(FILLER_RE) ?? [];
  const fillerWords = Array.from(new Set(fillerMatches.map((f) => f.toLowerCase())));

  const totalTimeMs = Math.max(1000, speechDurationMs + pauseMs);
  const speechRatio = speechDurationMs / totalTimeMs;
  const paceBonus = paceLabel === 'Natural' ? 12 : 4;
  const fillerPenalty = fillerMatches.length * 6;
  const rawFluency = Math.round(
    55 + speechRatio * 30 + paceBonus + (wordCount >= 5 ? 6 : 0) - fillerPenalty,
  );
  const fluencyScore = Math.max(35, Math.min(99, rawFluency));

  let tipPt = '';
  if (fillerWords.length > 0) {
    tipPt = `Detectamos hesitações (${fillerWords.join(', ')}). Tente fazer uma pausa silenciosa curta antes de iniciar a frase.`;
  } else if (paceLabel === 'Lento') {
    tipPt = `Ritmo pausado (${wpm} WPM). Tente conectar grupos de 3–4 palavras sem pausar entre cada termo.`;
  } else if (paceLabel === 'Rápido') {
    tipPt = `Ritmo acelerado (${wpm} WPM). Respire nas vírgulas e destaque as sílabas tônicas para ganhar clareza.`;
  } else if (intonationScore < 65) {
    tipPt = `Boa velocidade (${wpm} WPM), mas entonação um pouco linear. Dê mais ênfase nas palavras-chave e suba o tom em perguntas.`;
  } else {
    tipPt = `Excelente prosódia (${wpm} WPM)! Ritmo natural, boa variação de entonação e fluência consistente.`;
  }

  return {
    wpm,
    paceLabel,
    intonationScore,
    fluencyScore,
    speechDurationSec: Number(effectiveSec.toFixed(1)),
    fillerWords,
    tipPt,
  };
}

function pickSupportedAudioMime(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
  ];
  for (const mime of candidates) {
    if (MediaRecorder.isTypeSupported?.(mime)) return mime;
  }
  return '';
}

export async function startContinuousVadSession(
  options: ContinuousVadOptions,
): Promise<{ stop: () => void } | null> {
  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices?.getUserMedia ||
    typeof MediaRecorder === 'undefined'
  ) {
    options.onError('Microfone ou gravação contínua não suportada neste navegador.');
    return null;
  }

  const silenceMs = options.silenceMs ?? 950;
  const speechThreshold = options.speechThreshold ?? 0.026;
  const silenceThreshold = options.silenceThreshold ?? 0.015;

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch {
    options.onError('Permissão de microfone negada para a chamada ao vivo.');
    return null;
  }

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) {
    stream.getTracks().forEach((t) => t.stop());
    options.onError('Web Audio API indisponível neste dispositivo.');
    return null;
  }

  const audioCtx = new AudioCtx();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);

  const timeBuffer = new Float32Array(analyser.fftSize);
  const freqBuffer = new Uint8Array(analyser.frequencyBinCount);
  const mimeType = pickSupportedAudioMime();

  let stopped = false;
  let activeRecorder: MediaRecorder | null = null;
  let chunks: BlobPart[] = [];
  let speechStartAt = 0;
  let lastVoiceAt = 0;
  let bargeInStartAt = 0;
  let pauseAccumMs = 0;
  let wasBelowInUtterance = false;
  let lastSampleAt = Date.now();
  let rmsSamples: number[] = [];

  options.onStateChange('listening');

  const beginRecordingSegment = () => {
    if (stopped || activeRecorder) return;
    try {
      const rec = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      chunks = [];
      rmsSamples = [];
      pauseAccumMs = 0;
      wasBelowInUtterance = false;
      speechStartAt = Date.now();
      lastVoiceAt = speechStartAt;

      rec.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };

      rec.onstop = () => {
        const duration = Math.max(0, Date.now() - speechStartAt);
        const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
        const capturedRms = [...rmsSamples];
        const capturedPause = pauseAccumMs;
        activeRecorder = null;
        chunks = [];
        if (!stopped && duration >= 400 && blob.size > 600) {
          options.onUtterance({
            blob,
            speechDurationMs: Math.max(400, duration - capturedPause),
            pauseMs: capturedPause,
            rmsSamples: capturedRms,
          });
        } else if (!stopped) {
          options.onStateChange('listening');
        }
      };

      activeRecorder = rec;
      rec.start(120);
      options.onStateChange('speaking');
    } catch {
      activeRecorder = null;
    }
  };

  const intervalId = window.setInterval(() => {
    if (stopped) return;
    const now = Date.now();
    const dt = now - lastSampleAt;
    lastSampleAt = now;

    analyser.getFloatTimeDomainData(timeBuffer);
    let sumSq = 0;
    for (let i = 0; i < timeBuffer.length; i++) {
      sumSq += timeBuffer[i] * timeBuffer[i];
    }
    const rms = Math.sqrt(sumSq / timeBuffer.length);

    analyser.getByteFrequencyData(freqBuffer);
    const bars: number[] = [];
    const step = Math.max(1, Math.floor(freqBuffer.length / 24));
    for (let b = 0; b < 12; b++) {
      const val = freqBuffer[b * step] ?? 0;
      bars.push(Math.min(100, Math.max(8, Math.round((val / 255) * 100))));
    }
    options.onLevel(Math.min(1, rms * 5), bars);

    const assistantSpeaking = options.isAssistantSpeaking();
    if (assistantSpeaking && !activeRecorder) {
      if (options.bargeInEnabled() && rms > speechThreshold * 2.1) {
        if (bargeInStartAt === 0) bargeInStartAt = now;
        if (now - bargeInStartAt >= 180) {
          bargeInStartAt = 0;
          options.onBargeIn?.();
          beginRecordingSegment();
        }
      } else {
        bargeInStartAt = 0;
      }
      return;
    }

    if (!activeRecorder) {
      if (rms >= speechThreshold) {
        beginRecordingSegment();
      }
      return;
    }

    rmsSamples.push(rms);
    if (rms >= silenceThreshold) {
      lastVoiceAt = now;
      wasBelowInUtterance = false;
    } else {
      if (wasBelowInUtterance) {
        pauseAccumMs += dt;
      }
      wasBelowInUtterance = true;
      if (now - lastVoiceAt >= silenceMs) {
        try {
          activeRecorder.stop();
        } catch {
          activeRecorder = null;
          options.onStateChange('listening');
        }
      }
    }
  }, 60);

  return {
    stop: () => {
      stopped = true;
      window.clearInterval(intervalId);
      if (activeRecorder && activeRecorder.state !== 'inactive') {
        try {
          activeRecorder.stop();
        } catch {
          // Ignore stop errors
        }
      }
      activeRecorder = null;
      stream.getTracks().forEach((t) => t.stop());
      void audioCtx.close().catch(() => undefined);
      options.onStateChange('idle');
    },
  };
}

import { Capacitor } from '@capacitor/core';
import { DEFAULT_BACKEND_API_URL } from '../config/appConfig';
import type { Accent } from '../types/learning';
import { getAudioClip, saveAudioClip } from './audioDb';
import { isAudioRecordingSupported, startAudioRecording } from './audioRecorder';

interface SpeakOptions {
  accent?: Accent | string;
  langCode?: string;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionEventLike {
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface WindowWithSpeech extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function refreshVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
    return [];
  }
  const list = window.speechSynthesis.getVoices();
  if (list.length > 0) {
    cachedVoices = list;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
  refreshVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    refreshVoices();
  });
}

function scoreVoiceQuality(voice: SpeechSynthesisVoice, targetLocale: string): number {
  const vLang = voice.lang.toLowerCase().replace('_', '-');
  const wanted = targetLocale.toLowerCase();
  const base = wanted.split('-')[0];

  if (!vLang.startsWith(base)) return -1000;

  let score = vLang === wanted || vLang.startsWith(wanted) ? 220 : 60;
  const name = voice.name.toLowerCase();

  // Prioritize Neural / Natural cloud & OS voices (Microsoft Edge, Chrome Google, Apple Siri/Enhanced)
  if (name.includes('natural') || name.includes('neural')) score += 160;
  if (name.includes('google')) score += 130;
  if (
    name.includes('online') ||
    name.includes('premium') ||
    name.includes('enhanced') ||
    name.includes('siri')
  ) {
    score += 95;
  }
  if (
    name.includes('aria') ||
    name.includes('jenny') ||
    name.includes('guy') ||
    name.includes('sonia') ||
    name.includes('ryan') ||
    name.includes('libby') ||
    name.includes('samantha') ||
    name.includes('daniel') ||
    name.includes('karen') ||
    name.includes('moira')
  ) {
    score += 75;
  }
  if (!voice.localService) score += 45;

  // Deprioritize legacy robotic SAPI5 Windows desktop voices
  if (
    name.includes('desktop') ||
    name.includes('david') ||
    name.includes('zira') ||
    name.includes('mark') ||
    name.includes('hazel') ||
    name.includes('george') ||
    name.includes('susan')
  ) {
    score -= 95;
  }

  return score;
}

export function pickBestNaturalVoice(
  voices: SpeechSynthesisVoice[],
  targetLocale: string,
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -999;

  for (const voice of voices) {
    const sc = scoreVoiceQuality(voice, targetLocale);
    if (sc > bestScore) {
      bestScore = sc;
      best = voice;
    }
  }
  return bestScore > -500 ? best : null;
}

let activePlayToken = 0;
let activeHtmlAudio: HTMLAudioElement | null = null;
let activeObjectUrl: string | null = null;
let activeFinishCallback: (() => void) | null = null;
const ttsInFlightRequests = new Map<string, Promise<Blob | null>>();

function hashTtsKey(text: string): string {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

function normalizeTtsLocale(locale: string): string {
  const lower = locale.trim().toLowerCase();
  if (lower === 'en-gb' || lower.startsWith('en-gb') || lower === 'uk') return 'en-GB';
  if (lower === 'es-es') return 'es-ES';
  if (lower.startsWith('es')) return 'es-MX';
  if (lower.startsWith('fr')) return 'fr-FR';
  if (lower.startsWith('pt')) return 'pt-BR';
  return 'en-US';
}

async function fetchNeuralTtsBlob(text: string, targetLocale: string): Promise<Blob | null> {
  const apiBase = DEFAULT_BACKEND_API_URL.trim().replace(/\/+$/, '');
  if (!apiBase || typeof fetch === 'undefined') return null;

  const cleanText = text.trim().slice(0, 750);
  if (!cleanText) return null;

  const normLocale = normalizeTtsLocale(targetLocale);
  const cacheId = `tts-v2:${normLocale}:${cleanText.length}:${hashTtsKey(cleanText)}`;

  const cachedBlob = await getAudioClip(cacheId);
  if (cachedBlob && cachedBlob.size > 200) {
    return cachedBlob;
  }

  const pending = ttsInFlightRequests.get(cacheId);
  if (pending) return pending;

  const requestPromise = (async () => {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId =
      controller !== null
        ? globalThis.setTimeout(() => controller.abort(), 7500)
        : undefined;

    try {
      const endpoint = `${apiBase}/api/tts?lang=${encodeURIComponent(normLocale)}&text=${encodeURIComponent(
        cleanText,
      )}`;
      const response = await fetch(endpoint, {
        method: 'GET',
        signal: controller?.signal,
      });
      if (!response.ok) return null;

      const blob = await response.blob();
      if (!blob || blob.size <= 200) return null;

      void saveAudioClip(cacheId, blob);
      return blob;
    } catch {
      return null;
    } finally {
      if (timeoutId !== undefined) {
        globalThis.clearTimeout(timeoutId);
      }
      ttsInFlightRequests.delete(cacheId);
    }
  })();

  ttsInFlightRequests.set(cacheId, requestPromise);
  return requestPromise;
}

export function getSelectedVoiceLabels(): { us: string; uk: string } {
  const apiBase = DEFAULT_BACKEND_API_URL.trim();
  if (apiBase) {
    return {
      us: 'Deepgram Aura-2 · Thalia (Neural US)',
      uk: 'Deepgram Aura-2 · Pandora (Neural UK)',
    };
  }
  const voices = refreshVoices();
  const us = pickBestNaturalVoice(voices, 'en-US');
  const uk = pickBestNaturalVoice(voices, 'en-GB');
  return {
    us: us?.name ?? 'Voz padrão US',
    uk: uk?.name ?? 'Voz padrão UK',
  };
}

export function stopSpeaking(): void {
  activePlayToken += 1;
  if (activeFinishCallback) {
    const cb = activeFinishCallback;
    activeFinishCallback = null;
    cb();
  }
  if (activeHtmlAudio) {
    try {
      activeHtmlAudio.onended = null;
      activeHtmlAudio.onerror = null;
      activeHtmlAudio.pause();
      activeHtmlAudio.currentTime = 0;
    } catch {
      // Ignore cleanup errors
    }
    activeHtmlAudio = null;
  }
  if (activeObjectUrl && typeof URL !== 'undefined') {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore speech synthesis cancellation errors in restricted browsers
    }
  }
}

function speakWithBrowserSynthesis(
  text: string,
  targetLocale: string,
  rate: number,
  playToken: number,
  finish: () => void,
): void {
  if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
    globalThis.setTimeout(finish, 600);
    return;
  }
  if (playToken !== activePlayToken) {
    finish();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLocale;

    const voices = refreshVoices();
    const chosen = pickBestNaturalVoice(voices, targetLocale);
    if (chosen) {
      utterance.voice = chosen;
      const lowerName = chosen.name.toLowerCase();
      const isNeural =
        lowerName.includes('natural') ||
        lowerName.includes('neural') ||
        lowerName.includes('google') ||
        !chosen.localService;
      utterance.rate = isNeural ? rate : rate * 0.96;
      utterance.pitch = isNeural ? 1.0 : 1.03;
    } else {
      utterance.rate = rate;
      utterance.pitch = 1.02;
    }

    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);

    // Safety timeout in case a headless browser does not emit onend
    const estimatedMs = Math.max(1200, Math.min(9000, text.length * 75));
    window.setTimeout(finish, estimatedMs);
  } catch {
    finish();
  }
}

export function speakText(text: string, options: SpeakOptions = {}): void {
  const { accent = 'en-US', langCode, rate = 1, onStart, onEnd } = options;
  const targetLocale = langCode ?? accent;
  const cleanText = text.trim();

  if (!cleanText) {
    onEnd?.();
    return;
  }

  stopSpeaking();
  const myToken = activePlayToken;

  let ended = false;
  const finish = () => {
    if (ended) return;
    ended = true;
    if (activeFinishCallback === finish) {
      activeFinishCallback = null;
    }
    onEnd?.();
  };
  activeFinishCallback = finish;

  if (typeof window === 'undefined') {
    onStart?.();
    globalThis.setTimeout(finish, 600);
    return;
  }

  onStart?.();

  void (async () => {
    const neuralBlob = await fetchNeuralTtsBlob(cleanText, targetLocale);
    if (myToken !== activePlayToken) return;

    if (neuralBlob && typeof Audio !== 'undefined' && typeof URL !== 'undefined') {
      try {
        const objectUrl = URL.createObjectURL(neuralBlob);
        if (myToken !== activePlayToken) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        const audio = new Audio(objectUrl);
        audio.playbackRate = Math.max(0.65, Math.min(1.5, rate));
        if ('preservesPitch' in audio) {
          audio.preservesPitch = true;
        }

        activeObjectUrl = objectUrl;
        activeHtmlAudio = audio;

        audio.onended = () => {
          if (activeHtmlAudio === audio) {
            activeHtmlAudio = null;
          }
          if (activeObjectUrl === objectUrl) {
            URL.revokeObjectURL(objectUrl);
            activeObjectUrl = null;
          }
          finish();
        };

        audio.onerror = () => {
          if (activeHtmlAudio === audio) {
            activeHtmlAudio = null;
          }
          if (activeObjectUrl === objectUrl) {
            URL.revokeObjectURL(objectUrl);
            activeObjectUrl = null;
          }
          speakWithBrowserSynthesis(cleanText, targetLocale, rate, myToken, finish);
        };

        await audio.play();
        return;
      } catch {
        // Fallback to Web Speech API if HTMLAudio autoplay or decode fails
      }
    }

    speakWithBrowserSynthesis(cleanText, targetLocale, rate, myToken, finish);
  })();
}

export function speakEnglish(text: string, options: SpeakOptions = {}): void {
  speakText(text, options);
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as WindowWithSpeech;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

let preferCloudStt = false;

function shouldUseCloudStt(): boolean {
  if (!DEFAULT_BACKEND_API_URL.trim() || !isAudioRecordingSupported()) {
    return false;
  }
  if (preferCloudStt) return true;
  if (Capacitor.isNativePlatform()) return true;
  if (typeof navigator !== 'undefined' && /Electron/i.test(navigator.userAgent)) {
    return true;
  }
  return getSpeechRecognitionConstructor() === null;
}

export async function transcribeAudioBlob(
  blob: Blob,
  langCode = 'en-US',
): Promise<{ ok: boolean; text?: string; error?: string }> {
  const apiBase = DEFAULT_BACKEND_API_URL.trim().replace(/\/+$/, '');
  if (!apiBase || typeof fetch === 'undefined') {
    return { ok: false, error: 'Serviço de transcrição em nuvem não configurado.' };
  }
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId =
    controller !== null
      ? globalThis.setTimeout(() => controller.abort(), 15000)
      : undefined;
  try {
    const res = await fetch(`${apiBase}/api/stt?lang=${encodeURIComponent(langCode)}`, {
      method: 'POST',
      headers: {
        'Content-Type': blob.type || 'audio/webm',
      },
      body: blob,
      signal: controller?.signal,
    });
    if (!res.ok) {
      return { ok: false, error: `Falha ao transcrever áudio (${res.status}).` };
    }
    const data = (await res.json()) as { ok?: boolean; text?: string; error?: string };
    const text = (data.text ?? '').trim();
    if (!text) {
      return {
        ok: false,
        error: 'Não captamos fala clara. Tente falar mais perto do microfone.',
      };
    }
    return { ok: true, text };
  } catch {
    return {
      ok: false,
      error: 'Sem conexão para transcrever agora. Você pode gravar para o Professor ou praticar manualmente.',
    };
  } finally {
    if (timeoutId !== undefined) {
      globalThis.clearTimeout(timeoutId);
    }
  }
}

export function isSpeechRecognitionSupported(): boolean {
  return (
    getSpeechRecognitionConstructor() !== null ||
    (isAudioRecordingSupported() && DEFAULT_BACKEND_API_URL.trim().length > 0)
  );
}

export function startSpeechRecognition(
  langCode: string,
  callbacks: {
    onResult: (transcript: string) => void;
    onError: (message: string) => void;
    onEnd: () => void;
    onStatus?: (message: string) => void;
  },
): () => void {
  let finished = false;
  const finish = () => {
    if (!finished) {
      finished = true;
      callbacks.onEnd();
    }
  };

  let activeStopFn: () => void = () => undefined;
  let cancelled = false;

  const startCloudStt = () => {
    callbacks.onStatus?.('Gravando... toque no microfone para analisar');
    void startAudioRecording({
      maxSeconds: 12,
      onComplete: async (blob) => {
        if (cancelled) {
          finish();
          return;
        }
        callbacks.onStatus?.('Analisando sua pronúncia...');
        const stt = await transcribeAudioBlob(blob, langCode);
        if (!cancelled) {
          if (stt.ok && stt.text) {
            callbacks.onResult(stt.text);
          } else {
            callbacks.onError(
              stt.error ?? 'Não captamos áudio claro. Tente falar mais perto do microfone.',
            );
          }
        }
        finish();
      },
      onError: (msg) => {
        if (!cancelled) callbacks.onError(msg);
        finish();
      },
    }).then((handle) => {
      if (!handle) {
        finish();
        return;
      }
      if (cancelled) {
        handle.cancel();
        return;
      }
      activeStopFn = () => handle.stop();
    });
  };

  const Recognition = getSpeechRecognitionConstructor();
  if (shouldUseCloudStt() || !Recognition) {
    if (!isAudioRecordingSupported() || !DEFAULT_BACKEND_API_URL.trim()) {
      callbacks.onError(
        'Reconhecimento de voz não disponível neste navegador. Use o botão de prática manual abaixo.',
      );
      finish();
      return () => undefined;
    }
    startCloudStt();
    return () => {
      activeStopFn();
    };
  }

  const recognition = new Recognition();
  recognition.lang = langCode;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  let switchedToCloud = false;
  callbacks.onStatus?.('Ouvindo...');

  recognition.onresult = (event) => {
    const first = event.results[0];
    const transcript = first?.[0]?.transcript?.trim() ?? '';
    if (transcript) {
      callbacks.onResult(transcript);
    } else {
      callbacks.onError('Não captamos áudio claro. Tente falar mais perto do microfone.');
    }
  };

  recognition.onerror = (event) => {
    if (
      (event.error === 'network' || event.error === 'service-not-allowed') &&
      isAudioRecordingSupported() &&
      DEFAULT_BACKEND_API_URL.trim()
    ) {
      // WebView/Chrome sem serviço Google Speech -> muda automaticamente para Cloud Whisper STT
      preferCloudStt = true;
      switchedToCloud = true;
      try {
        recognition.abort();
      } catch {
        // Ignore abort errors
      }
      startCloudStt();
      return;
    }

    if (event.error === 'not-allowed') {
      callbacks.onError('Permissão de microfone negada. Libere o microfone ou use a prática sem microfone.');
    } else if (event.error === 'no-speech') {
      callbacks.onError('Nenhuma fala detectada. Tente novamente!');
    } else {
      callbacks.onError(`Erro no microfone (${event.error}). Você pode usar a prática sem microfone.`);
    }
    finish();
  };

  recognition.onend = () => {
    if (!switchedToCloud) {
      finish();
    }
  };

  try {
    recognition.start();
    activeStopFn = () => {
      try {
        recognition.stop();
      } catch {
        try {
          recognition.abort();
        } catch {
          // Ignore abort errors
        }
      }
    };
  } catch {
    if (isAudioRecordingSupported() && DEFAULT_BACKEND_API_URL.trim()) {
      preferCloudStt = true;
      switchedToCloud = true;
      startCloudStt();
    } else {
      callbacks.onError('Não foi possível iniciar o microfone neste momento.');
      finish();
    }
  }

  return () => {
    if (switchedToCloud) {
      activeStopFn();
    } else {
      cancelled = true;
      activeStopFn();
    }
  };
}

const CONTRACTION_EXPANSIONS: Record<string, string[]> = {
  "i'm": ['i', 'am'],
  "i'd": ['i', 'would'],
  "i'll": ['i', 'will'],
  "i've": ['i', 'have'],
  "you're": ['you', 'are'],
  "we're": ['we', 'are'],
  "they're": ['they', 'are'],
  "it's": ['it', 'is'],
  "that's": ['that', 'is'],
  "don't": ['do', 'not'],
  "doesn't": ['does', 'not'],
  "didn't": ['did', 'not'],
  "can't": ['cannot', 'can', 'not'],
  "won't": ['will', 'not'],
  "wouldn't": ['would', 'not'],
  "couldn't": ['could', 'not'],
  "isn't": ['is', 'not'],
  "aren't": ['are', 'not'],
};

function cleanToken(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9']/g, '');
}

function expandTokens(sentence: string): string[] {
  const rawTokens = sentence.split(/\s+/).map(cleanToken).filter(Boolean);
  const expanded: string[] = [];
  for (const token of rawTokens) {
    const mapped = CONTRACTION_EXPANSIONS[token];
    if (mapped) {
      expanded.push(...mapped);
    } else {
      expanded.push(token.replace(/'/g, ''));
    }
  }
  return expanded;
}

export function evaluatePronunciation(
  target: string,
  spoken: string,
): { score: number; words: { word: string; matched: boolean }[] } {
  const displayWords = target.split(/\s+/).filter(Boolean);
  const spokenExpanded = expandTokens(spoken);
  const spokenSet = new Set(spokenExpanded);

  let matchedCount = 0;
  const words = displayWords.map((rawWord) => {
    const cleaned = cleanToken(rawWord);
    const expanded = CONTRACTION_EXPANSIONS[cleaned] ?? [cleaned.replace(/'/g, '')];
    const matched = expanded.every((part) => spokenSet.has(part));
    if (matched) matchedCount += 1;
    return { word: rawWord, matched };
  });

  const score =
    displayWords.length === 0
      ? 0
      : Math.round((matchedCount / displayWords.length) * 100);

  return { score, words };
}

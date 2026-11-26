import { Capacitor } from '@capacitor/core';
import { DEFAULT_BACKEND_API_URL } from '../config/appConfig';
import { REGIONAL_ACCENTS_BY_LANGUAGE } from '../data/regionalAccents';
import type { Accent } from '../types/learning';
import { getAudioClip, saveAudioClip } from './audioDb';
import { isAudioRecordingSupported, startAudioRecording } from './audioRecorder';
import { getSupabaseAccessToken } from './cloudSync';

interface SpeakOptions {
  accent?: Accent | string;
  langCode?: string;
  voice?: 'female' | 'male';
  rate?: number;
  onLoading?: (loading: boolean) => void;
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

const REGIONAL_TTS_CODES: Map<string, string> = new Map(
  Object.values(REGIONAL_ACCENTS_BY_LANGUAGE)
    .flat()
    .map((acc) => [acc.code.toLowerCase(), acc.code] as [string, string]),
);

function normalizeTtsLocale(locale: string): string {
  const lower = locale.trim().toLowerCase();
  // Sotaques regionais (49) precisam chegar intactos ao Worker; antes eram
  // colapsados para o idioma base (ex.: en-AU → en-US, es-AR → es-MX) e por isso
  // todos soavam iguais ao sotaque padrão.
  const regional = REGIONAL_TTS_CODES.get(lower);
  if (regional) return regional;
  if (lower === 'en-gb' || lower.startsWith('en-gb') || lower === 'uk') return 'en-GB';
  if (lower === 'es-es') return 'es-ES';
  if (lower.startsWith('es')) return 'es-MX';
  if (lower === 'fr-ca') return 'fr-CA';
  if (lower.startsWith('fr')) return 'fr-FR';
  if (lower === 'it-ch') return 'it-CH';
  if (lower.startsWith('it')) return 'it-IT';
  if (lower === 'de-at') return 'de-AT';
  if (lower.startsWith('de')) return 'de-DE';
  if (lower === 'ru-spb') return 'ru-SPB';
  if (lower.startsWith('ru')) return 'ru-RU';
  if (lower === 'ja-kansai') return 'ja-KANSAI';
  if (lower.startsWith('ja')) return 'ja-JP';
  if (lower === 'zh-tw') return 'zh-TW';
  if (lower.startsWith('zh')) return 'zh-CN';
  if (lower === 'ar-eg') return 'ar-EG';
  if (lower.startsWith('ar')) return 'ar-SA';
  if (lower === 'nl-be') return 'nl-BE';
  if (lower.startsWith('nl')) return 'nl-NL';
  if (lower === 'af-na') return 'af-NA';
  if (lower.startsWith('af')) return 'af-ZA';
  if (lower === 'sv-fi') return 'sv-FI';
  if (lower.startsWith('sv')) return 'sv-SE';
  if (lower === 'tr-cy') return 'tr-CY';
  if (lower === 'tr-tr-ank') return 'tr-TR-ANK';
  if (lower.startsWith('tr')) return 'tr-TR';
  if (lower === 'he-il-jer') return 'he-IL-JER';
  if (lower === 'he-il-sep') return 'he-IL-SEP';
  if (lower.startsWith('he') || lower.startsWith('iw')) return 'he-IL';
  if (lower === 'nb-no-bgo') return 'nb-NO-BGO';
  if (lower === 'nb-no-trd') return 'nb-NO-TRD';
  if (lower.startsWith('nb') || lower.startsWith('no')) return 'nb-NO';
  if (lower === 'da-dk-aar') return 'da-DK-AAR';
  if (lower === 'da-dk-ode') return 'da-DK-ODE';
  if (lower.startsWith('da')) return 'da-DK';
  if (lower.startsWith('pt')) return 'pt-BR';
  return 'en-US';
}

export async function fetchNeuralTtsBlob(
  text: string,
  targetLocale: string,
  voice?: 'female' | 'male',
): Promise<Blob | null> {
  const apiBase = DEFAULT_BACKEND_API_URL.trim().replace(/\/+$/, '');
  if (!apiBase || typeof fetch === 'undefined') return null;

  const cleanText = text.trim().slice(0, 750);
  if (!cleanText) return null;

  const normLocale = normalizeTtsLocale(targetLocale);
  const voiceTag = voice === 'male' ? 'male' : 'default';
  const cacheId = `tts-v6:${normLocale}:${voiceTag}:${cleanText.length}:${hashTtsKey(cleanText)}`;

  const cachedBlob = await getAudioClip(cacheId);
  if (cachedBlob && cachedBlob.size > 200) {
    return cachedBlob;
  }

  const pending = ttsInFlightRequests.get(cacheId);
  if (pending) return pending;

  const requestPromise = (async () => {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    // A síntese neural de trechos longos (ex.: áudios de simulados com 200–500
    // caracteres) leva 11–20 s na primeira geração (depois fica em cache R2).
    const timeoutMs = Math.min(70000, 15000 + cleanText.length * 100);
    const timeoutId =
      controller !== null
        ? globalThis.setTimeout(() => controller.abort(), timeoutMs)
        : undefined;

    try {
      const voiceQuery = voice ? `&voice=${encodeURIComponent(voice)}` : '';
      const endpoint = `${apiBase}/api/tts?lang=${encodeURIComponent(normLocale)}${voiceQuery}&text=${encodeURIComponent(
        cleanText,
      )}`;
      let response = await fetch(endpoint, {
        method: 'GET',
        signal: controller?.signal,
      });
      if (!response.ok && response.status >= 500 && !controller?.signal.aborted) {
        await new Promise((r) => globalThis.setTimeout(r, 400));
        response = await fetch(endpoint, {
          method: 'GET',
          signal: controller?.signal,
        });
      }
      if (!response.ok) return null;

      const isEmergencyFallback =
        response.headers?.get?.('X-TTS-Fallback') === 'true';
      const blob = await response.blob();
      if (!blob || blob.size <= 200) return null;

      if (!isEmergencyFallback) {
        void saveAudioClip(cacheId, blob);
      }
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
      us: 'Gemini 2.5 Native TTS · Zephyr / Puck (Neural US)',
      uk: 'Gemini 2.5 Native TTS · Aoede / Charon (Neural UK)',
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

export function getAllVoiceProviderLabels() {
  return {
    enUs: 'Gemini 2.5 Native TTS (en-US) · Zephyr / Puck (US)',
    enGb: 'Gemini 2.5 Native TTS (en-GB) · Aoede / Charon (UK)',
    esEs: 'Gemini 2.5 Native TTS (es-ES) · Aoede / Charon (ES)',
    esMx: 'Gemini 2.5 Native TTS (es-MX) · Zephyr / Puck (MX)',
    frFr: 'Gemini 2.5 Native TTS (fr-FR) · Aoede / Charon (Paris)',
    frCa: 'Gemini 2.5 Native TTS (fr-CA) · Zephyr / Puck (Canadá)',
    itIt: 'Gemini 2.5 Native TTS (it-IT) · Leda / Orus (Itália)',
    itCh: 'Gemini 2.5 Native TTS (it-IT) · Leda / Orus (Suíça IT)',
    deDe: 'Gemini 2.5 Native TTS (de-DE) · Vindemiatrix / Charon (Alemanha)',
    deAt: 'Gemini 2.5 Native TTS (de-DE) · Vindemiatrix / Charon (Áustria)',
    ruRu: 'Gemini 2.5 Native TTS (ru-RU) · Kore / Fenrir (Moscou)',
    ruSpb: 'Gemini 2.5 Native TTS (ru-RU) · Leda / Orus (São Petersburgo)',
    jaJp: 'Gemini 2.5 Native TTS (ja-JP) · Aoede / Fenrir (Tóquio)',
    jaKansai: 'Gemini 2.5 Native TTS (ja-JP) · Aoede / Fenrir (Kansai)',
    zhCn: 'Gemini 2.5 Native TTS (cmn-CN) · Kore / Puck (Mandarim CN)',
    zhTw: 'Gemini 2.5 Native TTS (cmn-TW) · Kore / Puck (Taiwan TW)',
    arSa: 'Gemini 2.5 Native TTS (ar-XA) · Sadaltager / Alnilam (MSA)',
    arEg: 'Gemini 2.5 Native TTS (ar-EG) · Sadaltager / Alnilam (Egito)',
    nlNl: 'Gemini 2.5 Native TTS (nl-NL) · Despina / Schedar (Holanda)',
    nlBe: 'Gemini 2.5 Native TTS (nl-BE) · Despina / Schedar (Bélgica)',
    afZa: 'Gemini 2.5 Native TTS (af-ZA) · Gacrux / Iapetus (África do Sul)',
    afNa: 'Gemini 2.5 Native TTS (af-ZA) · Gacrux / Iapetus (Namíbia)',
    svSe: 'Gemini 2.5 Native TTS (sv-SE) · Callirrhoe / Umbriel (Suécia)',
    svFi: 'Gemini 2.5 Native TTS (sv-SE) · Callirrhoe / Umbriel (Finlândia)',
    trTr: 'Gemini 2.5 Native TTS (tr-TR) · Kore / Orus (Istambul / Ancara / Chipre)',
    heIl: 'Gemini 2.5 Native TTS (he-IL) · Zephyr / Fenrir (Tel Aviv / Jerusalém)',
    nbNo: 'Gemini 2.5 Native TTS (nb-NO) · Callirrhoe / Umbriel (Oslo / Bergen / Trondheim)',
    daDk: 'Gemini 2.5 Native TTS (da-DK) · Despina / Schedar (Copenhague / Aarhus / Odense)',
  };
}

export interface VoiceDiagnosticItem {
  code: string;
  symbol: string;
  namePt: string;
  dialectsLabel: string;
  providerLabel: string;
  primaryDialect: string;
  sampleText: string;
}

export function getAllVoiceDiagnostics(): VoiceDiagnosticItem[] {
  const v = getAllVoiceProviderLabels();
  return [
    { code: 'en', symbol: 'EN', namePt: 'Inglês', dialectsLabel: 'US / UK', providerLabel: `${v.enUs} · ${v.enGb}`, primaryDialect: 'en-US', sampleText: 'Hello! Welcome to FluentBridge.' },
    { code: 'es', symbol: 'ES', namePt: 'Espanhol', dialectsLabel: 'ES / MX', providerLabel: `${v.esEs} · ${v.esMx}`, primaryDialect: 'es-ES', sampleText: '¡Hola! Bienvenido a FluentBridge.' },
    { code: 'fr', symbol: 'FR', namePt: 'Francês', dialectsLabel: 'FR / CA', providerLabel: v.frFr, primaryDialect: 'fr-FR', sampleText: 'Bonjour ! Bienvenue sur FluentBridge.' },
    { code: 'it', symbol: 'IT', namePt: 'Italiano', dialectsLabel: 'IT / CH', providerLabel: v.itIt, primaryDialect: 'it-IT', sampleText: 'Ciao! Benvenuto su FluentBridge.' },
    { code: 'de', symbol: 'DE', namePt: 'Alemão', dialectsLabel: 'DE / AT', providerLabel: v.deDe, primaryDialect: 'de-DE', sampleText: 'Guten Tag! Willkommen bei FluentBridge.' },
    { code: 'ru', symbol: 'РУ', namePt: 'Russo', dialectsLabel: 'Moscou / SPB', providerLabel: v.ruRu, primaryDialect: 'ru-RU', sampleText: 'Здравствуйте! Добро пожаловать.' },
    { code: 'ja', symbol: '日本', namePt: 'Japonês', dialectsLabel: 'Tóquio / Kansai', providerLabel: v.jaJp, primaryDialect: 'ja-JP', sampleText: 'こんにちは！ようこそ。' },
    { code: 'zh', symbol: '中文', namePt: 'Chinês', dialectsLabel: 'CN / TW', providerLabel: v.zhCn, primaryDialect: 'zh-CN', sampleText: '你好！欢迎来到 FluentBridge。' },
    { code: 'ar', symbol: 'عربي', namePt: 'Árabe', dialectsLabel: 'MSA / Egito', providerLabel: v.arSa, primaryDialect: 'ar-SA', sampleText: 'مرحباً! أهلاً وسهلاً بكم.' },
    { code: 'nl', symbol: 'NL', namePt: 'Holandês', dialectsLabel: 'NL / BE', providerLabel: v.nlNl, primaryDialect: 'nl-NL', sampleText: 'Goedemorgen! Welkom bij FluentBridge.' },
    { code: 'af', symbol: 'AF', namePt: 'Africâner', dialectsLabel: 'ZA / NA', providerLabel: v.afZa, primaryDialect: 'af-ZA', sampleText: 'Goeiemôre! Welkom by FluentBridge.' },
    { code: 'sv', symbol: 'SV', namePt: 'Sueco', dialectsLabel: 'SE / FI', providerLabel: v.svSe, primaryDialect: 'sv-SE', sampleText: 'Hej! Välkommen till FluentBridge.' },
    { code: 'tr', symbol: 'TR', namePt: 'Turco', dialectsLabel: 'IST / ANK / CY', providerLabel: v.trTr, primaryDialect: 'tr-TR', sampleText: 'Merhaba! FluentBridge’e hoş geldiniz.' },
    { code: 'he', symbol: 'עב', namePt: 'Hebraico', dialectsLabel: 'TLV / JER / SEP', providerLabel: v.heIl, primaryDialect: 'he-IL', sampleText: 'שלום! ברוכים הבאים ל-FluentBridge.' },
    { code: 'nb', symbol: 'NB', namePt: 'Norueguês', dialectsLabel: 'OSL / BGO / TRD', providerLabel: v.nbNo, primaryDialect: 'nb-NO', sampleText: 'Hei! Velkommen til FluentBridge.' },
    { code: 'da', symbol: 'DA', namePt: 'Dinamarquês', dialectsLabel: 'CPH / AAR / ODE', providerLabel: v.daDk, primaryDialect: 'da-DK', sampleText: 'Hej! Velkommen til FluentBridge.' },
  ];
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

const SILENT_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

let sharedUnlockedAudio: HTMLAudioElement | null = null;

function getOrUnlockAudioElement(): HTMLAudioElement | null {
  if (typeof Audio === 'undefined') return null;
  if (!sharedUnlockedAudio) {
    try {
      sharedUnlockedAudio = new Audio();
    } catch {
      return null;
    }
  }
  try {
    // Desbloqueio síncrono durante o clique do usuário para evitar NotAllowedError
    // caso a síntese neural leve >5 segundos antes de iniciar o áudio.
    if (sharedUnlockedAudio.paused) {
      sharedUnlockedAudio.src = SILENT_WAV_DATA_URI;
      sharedUnlockedAudio.muted = true;
      const p = sharedUnlockedAudio.play();
      if (p && typeof p.then === 'function') {
        void p
          .then(() => {
            if (sharedUnlockedAudio?.src === SILENT_WAV_DATA_URI) {
              sharedUnlockedAudio.pause();
            }
          })
          .catch(() => undefined);
      }
    }
  } catch {
    // Ignore autoplay unlock errors
  }
  return sharedUnlockedAudio;
}

export function speakText(text: string, options: SpeakOptions = {}): void {
  const {
    accent = 'en-US',
    langCode,
    voice,
    rate = 1,
    onLoading,
    onStart,
    onEnd,
  } = options;
  const targetLocale = langCode ?? accent;
  const cleanText = text.trim();

  if (!cleanText) {
    onLoading?.(false);
    onEnd?.();
    return;
  }

  stopSpeaking();
  const myToken = activePlayToken;

  let ended = false;
  const finish = () => {
    if (ended) return;
    ended = true;
    onLoading?.(false);
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

  const unlockedAudio = getOrUnlockAudioElement();
  onLoading?.(true);

  void (async () => {
    const neuralBlob = await fetchNeuralTtsBlob(cleanText, targetLocale, voice);
    if (myToken !== activePlayToken) {
      onLoading?.(false);
      return;
    }

    if (neuralBlob && typeof Audio !== 'undefined' && typeof URL !== 'undefined') {
      try {
        const objectUrl = URL.createObjectURL(neuralBlob);
        if (myToken !== activePlayToken) {
          URL.revokeObjectURL(objectUrl);
          onLoading?.(false);
          return;
        }
        const audio = unlockedAudio ?? new Audio();
        audio.muted = false;
        audio.src = objectUrl;
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
          onLoading?.(false);
          onStart?.();
          speakWithBrowserSynthesis(cleanText, targetLocale, rate, myToken, finish);
        };

        onLoading?.(false);
        onStart?.();
        await audio.play();
        return;
      } catch {
        // Fallback to Web Speech API if HTMLAudio autoplay or decode fails
      }
    }

    onLoading?.(false);
    onStart?.();
    speakWithBrowserSynthesis(cleanText, targetLocale, rate, myToken, finish);
  })();
}

export function speakTextAsync(
  text: string,
  options: Omit<SpeakOptions, 'onEnd'> = {},
): Promise<void> {
  return new Promise((resolve) => {
    speakText(text, {
      ...options,
      onEnd: () => resolve(),
    });
  });
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

export interface SttWordConfidence {
  word: string;
  probability?: number;
  start?: number;
  end?: number;
}

export interface DetailedSttResult {
  ok: boolean;
  text?: string;
  words?: SttWordConfidence[];
  error?: string;
}

export async function transcribeAudioBlobDetailed(
  blob: Blob,
  langCode = 'en-US',
): Promise<DetailedSttResult> {
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
    let token: string | null = null;
    try {
      token = await getSupabaseAccessToken();
    } catch {
      token = null;
    }
    const headers: Record<string, string> = {
      'Content-Type': blob.type || 'audio/webm',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${apiBase}/api/stt?lang=${encodeURIComponent(langCode)}`, {
      method: 'POST',
      headers,
      body: blob,
      signal: controller?.signal,
    });
    if (!res.ok) {
      return { ok: false, error: `Falha ao transcrever áudio (${res.status}).` };
    }
    const data = (await res.json()) as {
      ok?: boolean;
      text?: string;
      words?: SttWordConfidence[];
      error?: string;
    };
    const text = (data.text ?? '').trim();
    if (!text) {
      return {
        ok: false,
        error: 'Não captamos fala clara. Tente falar mais perto do microfone.',
      };
    }
    return { ok: true, text, words: Array.isArray(data.words) ? data.words : undefined };
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

export async function transcribeAudioBlob(
  blob: Blob,
  langCode = 'en-US',
): Promise<{ ok: boolean; text?: string; error?: string }> {
  const res = await transcribeAudioBlobDetailed(blob, langCode);
  return { ok: res.ok, text: res.text, error: res.error };
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
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u0300-\u036f\u064B-\u065F\u0670]/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}']/gu, '');
}

const CJK_SCRIPT_REGEX = /[\u3040-\u30ff\u3400-\u9fff]/;

function expandTokens(sentence: string): string[] {
  if (CJK_SCRIPT_REGEX.test(sentence)) {
    const chars = Array.from(cleanToken(sentence).replace(/'/g, ''));
    return chars;
  }
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
  const isCjk = CJK_SCRIPT_REGEX.test(target);
  const displayWords = isCjk
    ? target
        .split(/\s+/)
        .flatMap((chunk) => {
          const cleanedChunk = cleanToken(chunk).replace(/'/g, '');
          return cleanedChunk ? [chunk] : [];
        })
    : target.split(/\s+/).filter(Boolean);

  const spokenExpanded = expandTokens(spoken);
  const spokenSet = new Set(spokenExpanded);

  if (isCjk && displayWords.length <= 2) {
    const targetChars = Array.from(cleanToken(target).replace(/'/g, ''));
    let charHits = 0;
    const charWords = targetChars.map((ch) => {
      const matched = spokenSet.has(ch);
      if (matched) charHits += 1;
      return { word: ch, matched };
    });
    const score =
      targetChars.length === 0
        ? 0
        : Math.round((charHits / targetChars.length) * 100);
    return { score, words: charWords };
  }

  let matchedCount = 0;
  const words = displayWords.map((rawWord) => {
    const cleaned = cleanToken(rawWord);
    if (isCjk) {
      const chars = Array.from(cleaned.replace(/'/g, ''));
      const matched = chars.length > 0 && chars.filter((c) => spokenSet.has(c)).length >= Math.ceil(chars.length * 0.6);
      if (matched) matchedCount += 1;
      return { word: rawWord, matched };
    }
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

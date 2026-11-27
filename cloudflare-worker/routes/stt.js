/**
 * @file cloudflare-worker/routes/stt.js
 * @description Rota POST /api/stt do Worker: transcrição Whisper v3 Turbo via Cloudflare Workers AI com fallback para Whisper padrão.
 * @exports resolveSttLanguage, handleSttRequest
 */
import { jsonResponse } from '../lib/http.js';
import { base64ToUint8Array } from './tts.js';

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

export function resolveSttLanguage(rawLang) {
  const lower = (rawLang || 'en').trim().toLowerCase();
  if (lower.startsWith('es')) return 'es';
  if (lower.startsWith('fr')) return 'fr';
  if (lower.startsWith('it')) return 'it';
  if (lower.startsWith('de')) return 'de';
  if (lower.startsWith('ru')) return 'ru';
  if (lower.startsWith('ja')) return 'ja';
  if (lower.startsWith('zh')) return 'zh';
  if (lower.startsWith('ar')) return 'ar';
  if (lower.startsWith('nl')) return 'nl';
  if (lower.startsWith('af')) return 'af';
  if (lower.startsWith('sv')) return 'sv';
  if (lower.startsWith('tr')) return 'tr';
  if (lower.startsWith('he') || lower.startsWith('iw')) return 'he';
  if (lower.startsWith('nb') || lower.startsWith('no')) return 'no';
  if (lower.startsWith('da')) return 'da';
  if (lower.startsWith('pt')) return 'pt';
  return 'en';
}

export async function handleSttRequest(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }
  if (!env.AI) {
    return jsonResponse({ error: 'Workers AI binding unavailable' }, 503);
  }

  const url = new URL(request.url);
  let lang = url.searchParams.get('lang') || 'en-US';
  let audioBuffer = null;
  let base64Audio = '';

  const contentType = (request.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('application/json')) {
    try {
      const body = await request.json();
      if (typeof body.lang === 'string') lang = body.lang;
      if (typeof body.audioBase64 === 'string' && body.audioBase64.trim()) {
        base64Audio = body.audioBase64.includes(',')
          ? body.audioBase64.split(',')[1]
          : body.audioBase64.trim();
        audioBuffer = base64ToUint8Array(base64Audio).buffer;
      }
    } catch {
      return jsonResponse({ error: 'Invalid JSON payload for /api/stt' }, 400);
    }
  } else {
    audioBuffer = await request.arrayBuffer();
  }

  if (!audioBuffer || audioBuffer.byteLength <= 100) {
    return jsonResponse({ error: 'Audio payload too small or empty' }, 400);
  }
  if (audioBuffer.byteLength > 4_000_000) {
    return jsonResponse({ error: 'Audio payload exceeds 4MB limit' }, 413);
  }

  if (!base64Audio) {
    base64Audio = arrayBufferToBase64(audioBuffer);
  }

  const isoLang = resolveSttLanguage(lang);

  try {
    const turboRes = await env.AI.run('@cf/openai/whisper-large-v3-turbo', {
      audio: base64Audio,
      language: isoLang,
      task: 'transcribe',
      vad_filter: true,
    });
    const text = typeof turboRes?.text === 'string' ? turboRes.text.trim() : '';
    if (text) {
      return jsonResponse({
        ok: true,
        text,
        words: Array.isArray(turboRes?.words) ? turboRes.words : undefined,
        segments: Array.isArray(turboRes?.segments) ? turboRes.segments : undefined,
        model: '@cf/openai/whisper-large-v3-turbo',
      });
    }
  } catch (err) {
    console.warn('Whisper turbo error:', err instanceof Error ? err.message : String(err));
  }

  try {
    const fallbackRes = await env.AI.run('@cf/openai/whisper', {
      audio: [...new Uint8Array(audioBuffer)],
    });
    const text = typeof fallbackRes?.text === 'string' ? fallbackRes.text.trim() : '';
    return jsonResponse({
      ok: true,
      text,
      model: '@cf/openai/whisper',
    });
  } catch (err) {
    return jsonResponse(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Whisper transcription failed',
      },
      502,
    );
  }
}

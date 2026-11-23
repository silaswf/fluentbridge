/**
 * FluentBridge Cloud API Worker
 * - /api/tts: Neural TTS via Cloudflare Workers AI (Deepgram Aura-2) + Google TTS fallback
 * - /api/stt: Cloud Whisper STT via Cloudflare Workers AI (@cf/openai/whisper-large-v3-turbo)
 * - /api/gemini-tutor: Secure proxy for Gemini AI Tutor without exposing API keys in client JS
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

const GEMINI_FALLBACK_MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash'];
const MAX_TTS_CHARS = 800;

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

function resolveTtsConfig(rawLang, rawVoice) {
  const lower = (rawLang || 'en-US').trim().toLowerCase();
  const isMale = (rawVoice || '').trim().toLowerCase() === 'male';

  if (lower === 'en-gb' || lower.startsWith('en-gb') || lower === 'uk') {
    return {
      engine: 'deepgram',
      locale: 'en-GB',
      model: '@cf/deepgram/aura-2-en',
      speaker: isMale ? 'draco' : 'pandora',
      googleLang: 'en-GB',
    };
  }
  if (lower === 'es-es') {
    return {
      engine: 'deepgram',
      locale: 'es-ES',
      model: '@cf/deepgram/aura-2-es',
      speaker: isMale ? 'nestor' : 'carina',
      googleLang: 'es-ES',
    };
  }
  if (lower.startsWith('es')) {
    return {
      engine: 'deepgram',
      locale: 'es-MX',
      model: '@cf/deepgram/aura-2-es',
      speaker: isMale ? 'javier' : 'estrella',
      googleLang: 'es',
    };
  }
  if (lower === 'fr-ca') {
    return {
      engine: 'gemini-tts',
      locale: 'fr-CA',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Puck' : 'Kore',
      promptPrefix: 'Read aloud the following Québécois French text naturally and clearly, without adding any commentary:',
      googleLang: 'fr-CA',
    };
  }
  if (lower.startsWith('fr')) {
    return {
      engine: 'gemini-tts',
      locale: 'fr-FR',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Charon' : 'Aoede',
      promptPrefix: 'Read aloud the following Parisian French text naturally and clearly, without adding any commentary:',
      googleLang: 'fr',
    };
  }
  if (lower === 'it-ch') {
    return {
      engine: 'gemini-tts',
      locale: 'it-CH',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Puck' : 'Kore',
      promptPrefix: 'Read aloud the following Swiss Italian text clearly and naturally, without adding any commentary:',
      googleLang: 'it',
    };
  }
  if (lower.startsWith('it')) {
    return {
      engine: 'gemini-tts',
      locale: 'it-IT',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Charon' : 'Aoede',
      promptPrefix: 'Read aloud the following standard Italian text clearly and naturally, without adding any commentary:',
      googleLang: 'it',
    };
  }
  if (lower === 'de-at') {
    return {
      engine: 'gemini-tts',
      locale: 'de-AT',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Puck' : 'Kore',
      promptPrefix: 'Read aloud the following Austrian German text clearly and naturally, without adding any commentary:',
      googleLang: 'de',
    };
  }
  if (lower.startsWith('de')) {
    return {
      engine: 'gemini-tts',
      locale: 'de-DE',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Charon' : 'Aoede',
      promptPrefix: 'Read aloud the following standard High German (Hochdeutsch) text clearly and naturally, without adding any commentary:',
      googleLang: 'de',
    };
  }
  if (lower.startsWith('pt')) {
    return {
      engine: 'gemini-tts',
      locale: 'pt-BR',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Puck' : 'Aoede',
      promptPrefix: 'Leia o texto a seguir em português brasileiro com voz natural:',
      googleLang: 'pt-BR',
    };
  }
  return {
    engine: 'deepgram',
    locale: 'en-US',
    model: '@cf/deepgram/aura-2-en',
    speaker: isMale ? 'apollo' : 'thalia',
    googleLang: 'en-US',
  };
}

function pcm16ToWavBuffer(pcmBytes, sampleRate = 24000, numChannels = 1) {
  const byteLength = pcmBytes.byteLength;
  const wavBuffer = new ArrayBuffer(44 + byteLength);
  const view = new DataView(wavBuffer);
  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + byteLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, byteLength, true);
  new Uint8Array(wavBuffer, 44).set(pcmBytes);
  return wavBuffer;
}

async function synthesizeGeminiNeuralTts(text, cfg, env) {
  const apiKey = (env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return null;

  const models = [cfg.model || 'gemini-2.5-flash-preview-tts', 'gemini-3.8-flash-lite-tts'];
  const promptText = `${cfg.promptPrefix || 'Read aloud naturally:'} ${text}`;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model,
      )}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: cfg.speaker },
              },
            },
          },
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const inlineData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (!inlineData?.data) continue;

      const pcmBytes = base64ToUint8Array(inlineData.data);
      if (pcmBytes.byteLength <= 200) continue;

      const mime = (inlineData.mimeType || '').toLowerCase();
      if (mime.includes('wav') || mime.includes('mpeg') || mime.includes('mp3')) {
        return {
          buffer: pcmBytes.buffer,
          contentType: mime.includes('wav') ? 'audio/wav' : 'audio/mpeg',
          provider: `gemini-neural-tts:${cfg.speaker}`,
        };
      }

      const rateMatch = mime.match(/rate=(\d+)/);
      const sampleRate = rateMatch ? Number(rateMatch[1]) : 24000;
      const wavBuffer = pcm16ToWavBuffer(pcmBytes, sampleRate, 1);
      return {
        buffer: wavBuffer,
        contentType: 'audio/wav',
        provider: `gemini-neural-tts:${cfg.speaker}`,
      };
    } catch {
      // Try next Gemini TTS model
    }
  }
  return null;
}

function base64ToUint8Array(base64) {
  const clean = base64.includes(',') ? base64.split(',')[1] : base64;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function aiResultToArrayBuffer(result) {
  if (!result) return null;
  if (result instanceof ArrayBuffer) return result;
  if (ArrayBuffer.isView(result)) {
    return result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength);
  }
  if (typeof ReadableStream !== 'undefined' && result instanceof ReadableStream) {
    return await new Response(result).arrayBuffer();
  }
  if (result instanceof Response) {
    return await result.arrayBuffer();
  }
  if (typeof result === 'object' && typeof result.audio === 'string') {
    return base64ToUint8Array(result.audio).buffer;
  }
  if (typeof result === 'object' && typeof result.getReader === 'function') {
    return await new Response(result).arrayBuffer();
  }
  return null;
}

async function fetchGoogleTtsFallback(text, googleLang) {
  const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(
    googleLang,
  )}&q=${encodeURIComponent(text.slice(0, 200))}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    },
  });
  if (!res.ok) return null;
  const buf = await res.arrayBuffer();
  return buf.byteLength > 200 ? buf : null;
}

async function handleTtsRequest(request, env, ctx) {
  let text = '';
  let lang = 'en-US';
  let voice = '';

  if (request.method === 'GET') {
    const url = new URL(request.url);
    text = (url.searchParams.get('text') || '').trim();
    lang = url.searchParams.get('lang') || 'en-US';
    voice = url.searchParams.get('voice') || '';
  } else if (request.method === 'POST') {
    try {
      const body = await request.json();
      text = typeof body.text === 'string' ? body.text.trim() : '';
      lang = typeof body.lang === 'string' ? body.lang : 'en-US';
      voice = typeof body.voice === 'string' ? body.voice : '';
    } catch {
      return jsonResponse({ error: 'Invalid JSON body for /api/tts' }, 400);
    }
  } else {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  if (!text) {
    return jsonResponse({ error: 'Missing text parameter' }, 400);
  }

  const clippedText = text.slice(0, MAX_TTS_CHARS);
  const cfg = resolveTtsConfig(lang, voice);
  const cacheUrl = new URL(
    `https://fluentbridge-tts-cache.internal/v3/${encodeURIComponent(cfg.locale)}/${encodeURIComponent(cfg.speaker)}/${encodeURIComponent(clippedText)}`,
  );
  const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
  const cache = typeof caches !== 'undefined' ? caches.default : null;

  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      const hitHeaders = new Headers(cached.headers);
      Object.entries(CORS_HEADERS).forEach(([k, v]) => hitHeaders.set(k, v));
      hitHeaders.set('X-TTS-Cache', 'HIT');
      return new Response(cached.body, {
        status: 200,
        headers: hitHeaders,
      });
    }
  }

  let audioBuffer = null;
  let contentType = 'audio/mpeg';
  let provider = 'none';

  if (cfg.engine === 'gemini-tts') {
    const gem = await synthesizeGeminiNeuralTts(clippedText, cfg, env);
    if (gem && gem.buffer && gem.buffer.byteLength > 200) {
      audioBuffer = gem.buffer;
      contentType = gem.contentType;
      provider = gem.provider;
    }
  } else if (cfg.model && env.AI) {
    try {
      const aiResult = await env.AI.run(cfg.model, {
        text: clippedText,
        speaker: cfg.speaker,
        encoding: 'mp3',
      });
      const buf = await aiResultToArrayBuffer(aiResult);
      if (buf && buf.byteLength > 200) {
        audioBuffer = buf;
        provider = `deepgram-aura-2:${cfg.speaker}`;
      }
    } catch (err) {
      try {
        const retryResult = await env.AI.run(cfg.model, {
          text: clippedText,
          speaker: cfg.speaker,
        });
        const retryBuf = await aiResultToArrayBuffer(retryResult);
        if (retryBuf && retryBuf.byteLength > 200) {
          audioBuffer = retryBuf;
          provider = `deepgram-aura-2:${cfg.speaker}`;
        }
      } catch {
        console.warn('Workers AI TTS error:', err instanceof Error ? err.message : String(err));
      }
    }
  }

  if (!audioBuffer) {
    audioBuffer = await fetchGoogleTtsFallback(clippedText, cfg.googleLang);
    if (audioBuffer) {
      contentType = 'audio/mpeg';
      provider = 'google-tts-fallback';
    }
  }

  if (!audioBuffer) {
    return jsonResponse({ error: 'Unable to synthesize speech' }, 502);
  }

  const responseHeaders = {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=604800',
    'X-TTS-Provider': provider,
    'X-TTS-Locale': cfg.locale,
    'X-TTS-Cache': 'MISS',
    ...CORS_HEADERS,
  };

  if (cache && ctx && typeof ctx.waitUntil === 'function') {
    const toCache = new Response(audioBuffer.slice(0), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800',
        'X-TTS-Provider': provider,
        'X-TTS-Locale': cfg.locale,
      },
    });
    ctx.waitUntil(cache.put(cacheKey, toCache));
  }

  return new Response(audioBuffer, {
    status: 200,
    headers: responseHeaders,
  });
}

async function handleGeminiTutorRequest(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const apiKey = (env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    return jsonResponse({ error: 'GEMINI_API_KEY not configured in Worker secrets' }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  if (!body || !Array.isArray(body.contents) || body.contents.length === 0) {
    return jsonResponse({ error: 'Missing Gemini contents array' }, 400);
  }

  const payload = {
    contents: body.contents,
    ...(body.systemInstruction ? { systemInstruction: body.systemInstruction } : {}),
    ...(body.generationConfig ? { generationConfig: body.generationConfig } : {}),
  };

  const candidateModels =
    typeof body.model === 'string' && body.model.trim()
      ? [body.model.trim(), ...GEMINI_FALLBACK_MODELS.filter((m) => m !== body.model.trim())]
      : GEMINI_FALLBACK_MODELS;

  let lastStatus = 502;
  let lastErrorText = 'Gemini upstream unavailable';

  for (const model of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model,
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    try {
      const upstream = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (upstream.ok) {
        const data = await upstream.json();
        return new Response(JSON.stringify({ ...data, _modelUsed: model }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...CORS_HEADERS,
          },
        });
      }

      lastStatus = upstream.status;
      lastErrorText = await upstream.text().catch(() => '');
      // Continue trying fallback model on 404/429/500+
    } catch (err) {
      lastErrorText = err instanceof Error ? err.message : String(err);
    }
  }

  return jsonResponse(
    {
      error: 'Gemini tutor request failed',
      upstreamStatus: lastStatus,
      detail: lastErrorText.slice(0, 400),
    },
    lastStatus >= 400 && lastStatus < 600 ? lastStatus : 502,
  );
}

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

function resolveSttLanguage(rawLang) {
  const lower = (rawLang || 'en').trim().toLowerCase();
  if (lower.startsWith('es')) return 'es';
  if (lower.startsWith('fr')) return 'fr';
  if (lower.startsWith('it')) return 'it';
  if (lower.startsWith('de')) return 'de';
  if (lower.startsWith('pt')) return 'pt';
  return 'en';
}

async function handleSttRequest(request, env) {
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

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/' || path === '/health') {
      return jsonResponse({
        ok: true,
        service: 'fluentbridge-api',
        endpoints: ['/api/tts', '/api/stt', '/api/gemini-tutor'],
        hasAiBinding: Boolean(env.AI),
        hasGeminiSecret: Boolean(env.GEMINI_API_KEY),
      });
    }

    if (path === '/api/tts') {
      return handleTtsRequest(request, env, ctx);
    }

    if (path === '/api/stt') {
      return handleSttRequest(request, env);
    }

    if (path === '/api/gemini-tutor') {
      return handleGeminiTutorRequest(request, env);
    }

    return jsonResponse({ error: 'Not found' }, 404);
  },
};

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

function resolveTtsConfig(rawLang) {
  const lower = (rawLang || 'en-US').trim().toLowerCase();
  if (lower === 'en-gb' || lower.startsWith('en-gb') || lower === 'uk') {
    return {
      locale: 'en-GB',
      model: '@cf/deepgram/aura-2-en',
      speaker: 'pandora',
      googleLang: 'en-GB',
    };
  }
  if (lower === 'es-es') {
    return {
      locale: 'es-ES',
      model: '@cf/deepgram/aura-2-es',
      speaker: 'nestor',
      googleLang: 'es-ES',
    };
  }
  if (lower.startsWith('es')) {
    return {
      locale: 'es-MX',
      model: '@cf/deepgram/aura-2-es',
      speaker: 'estrella',
      googleLang: 'es',
    };
  }
  if (lower.startsWith('fr')) {
    return {
      locale: 'fr-FR',
      model: null,
      speaker: 'google-fr',
      googleLang: 'fr',
    };
  }
  if (lower.startsWith('pt')) {
    return {
      locale: 'pt-BR',
      model: null,
      speaker: 'google-pt',
      googleLang: 'pt-BR',
    };
  }
  return {
    locale: 'en-US',
    model: '@cf/deepgram/aura-2-en',
    speaker: 'thalia',
    googleLang: 'en-US',
  };
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

  if (request.method === 'GET') {
    const url = new URL(request.url);
    text = (url.searchParams.get('text') || '').trim();
    lang = url.searchParams.get('lang') || 'en-US';
  } else if (request.method === 'POST') {
    try {
      const body = await request.json();
      text = typeof body.text === 'string' ? body.text.trim() : '';
      lang = typeof body.lang === 'string' ? body.lang : 'en-US';
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
  const cfg = resolveTtsConfig(lang);
  const cacheUrl = new URL(
    `https://fluentbridge-tts-cache.internal/v2/${encodeURIComponent(cfg.locale)}/${encodeURIComponent(clippedText)}`,
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
  let provider = 'none';

  if (cfg.model && env.AI) {
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
      // Fallback gracefully if encoding/model call fails
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
      provider = 'google-tts-fallback';
    }
  }

  if (!audioBuffer) {
    return jsonResponse({ error: 'Unable to synthesize speech' }, 502);
  }

  const responseHeaders = {
    'Content-Type': 'audio/mpeg',
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
        'Content-Type': 'audio/mpeg',
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

/**
 * @file cloudflare-worker/routes/gemini.js
 * @description Rota POST /api/gemini-tutor do Worker: proxy autenticado para modelos Gemini com fallback automático sem expor GEMINI_API_KEY no cliente.
 * @exports handleGeminiTutorRequest
 */
import { CORS_HEADERS, GEMINI_FALLBACK_MODELS, jsonResponse } from '../lib/http.js';

export async function handleGeminiTutorRequest(request, env) {
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

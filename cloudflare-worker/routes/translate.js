/**
 * @file cloudflare-worker/routes/translate.js
 * @description Rota POST /api/translate: tradutor bidirecional por curso com Gemini, retorno de IPA, nota literal, alternativas de registro e vocabulário extraível.
 * @exports handleTranslateRequest
 */
import { GEMINI_FALLBACK_MODELS, jsonResponse } from '../lib/http.js';

export async function handleTranslateRequest(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }
  const apiKey = (env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    return jsonResponse({ error: 'GEMINI_API_KEY missing on server' }, 503);
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const text = String(body.text || '').trim().slice(0, 1200);
  if (!text) {
    return jsonResponse({ ok: false, error: 'Texto vazio para tradução.' }, 400);
  }

  const sourceLang = String(body.sourceLang || 'pt').slice(0, 16);
  const targetLang = String(body.targetLang || 'en').slice(0, 16);
  const courseLang = String(body.courseLang || targetLang).slice(0, 16);
  const register = String(body.register || 'natural').slice(0, 16);
  const explanationLang = body.explanationLang === 'en' ? 'English' : 'Portuguese (Brazilian)';

  const prompt = `You are a bilingual master linguist at FluentBridge Academy.
Translate the following text from "${sourceLang}" to "${targetLang}" (course context: "${courseLang}", preferred register: "${register}").
Write all explanatory notes ("literalNote", "alternatives[].label", "vocabulary[].note") in ${explanationLang}.
Text:
"""
${text}
"""

Return ONLY valid JSON (no markdown) with this exact shape:
{
  "translatedText": "accurate, natural translation in ${targetLang}",
  "pronunciationIpa": "/IPA or transliteration for the translatedText/",
  "literalNote": "1-2 concise sentences explaining grammar, register, or false-friend nuance",
  "alternatives": [
    { "label": "Formal", "text": "formal alternative in ${targetLang}" },
    { "label": "Informal", "text": "informal/everyday alternative in ${targetLang}" }
  ],
  "vocabulary": [
    { "word": "key word or expression in ${targetLang}", "translation": "meaning in ${sourceLang}", "ipa": "/.../", "note": "short usage tip" }
  ]
}
Include 2 alternatives and 2 to 5 key vocabulary items.`;

  for (const model of GEMINI_FALLBACK_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
          }),
        },
      );
      if (!res.ok) continue;
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      if (!parsed?.translatedText) continue;

      return jsonResponse({
        ok: true,
        source: 'gemini-cloud',
        sourceLang,
        targetLang,
        translatedText: String(parsed.translatedText),
        pronunciationIpa: String(parsed.pronunciationIpa || ''),
        literalNote: String(parsed.literalNote || ''),
        alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives.slice(0, 3) : [],
        vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary.slice(0, 6) : [],
      });
    } catch {
      // Try fallback model
    }
  }

  return jsonResponse({ ok: false, error: 'Falha ao traduzir via IA.' }, 502);
}

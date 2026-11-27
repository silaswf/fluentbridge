/**
 * @file cloudflare-worker/routes/youtubeStudy.js
 * @description Rota POST /api/youtube-study: extrai metadados/legendas do YouTube (ou SRT manual) e gera estudo tokenizado, notas gramaticais e quiz via Gemini.
 * @exports extractYouTubeIdServer, handleYouTubeStudyRequest
 */
import { GEMINI_FALLBACK_MODELS, jsonResponse } from '../lib/http.js';

export function extractYouTubeIdServer(rawUrl) {
  const s = String(rawUrl || '').trim();
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m?.[1]) return m[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  return null;
}

function decodeHtmlEntities(str) {
  return String(str || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchYouTubeCaptionsBestEffort(videoId, languageCode) {
  try {
    const watchRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': `${languageCode},en;q=0.8`,
      },
    });
    if (!watchRes.ok) return [];
    const html = await watchRes.text();
    const marker = '"captionTracks":';
    const idx = html.indexOf(marker);
    if (idx === -1) return [];
    const slice = html.slice(idx + marker.length);
    const endIdx = slice.indexOf(']');
    if (endIdx === -1) return [];
    const tracks = JSON.parse(slice.slice(0, endIdx + 1));
    if (!Array.isArray(tracks) || tracks.length === 0) return [];
    const preferred =
      tracks.find((t) => String(t.languageCode || '').toLowerCase().startsWith(languageCode.toLowerCase())) ||
      tracks[0];
    if (!preferred?.baseUrl) return [];
    const capRes = await fetch(preferred.baseUrl);
    if (!capRes.ok) return [];
    const xml = await capRes.text();
    const lines = [];
    const re = /<text start="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g;
    let m;
    while ((m = re.exec(xml)) !== null && lines.length < 18) {
      const text = decodeHtmlEntities(m[2].replace(/<[^>]+>/g, ''));
      if (text) {
        lines.push({ startSec: Math.floor(Number(m[1]) || 0), text });
      }
    }
    return lines;
  } catch {
    return [];
  }
}

export async function handleYouTubeStudyRequest(request, env) {
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
  const videoId = extractYouTubeIdServer(body.url);
  if (!videoId) {
    return jsonResponse({ ok: false, error: 'URL do YouTube inválida.' }, 400);
  }
  const languageCode = String(body.languageCode || 'en').slice(0, 8);
  const level = String(body.level || 'B1').slice(0, 4);
  const manualTranscript = String(body.manualTranscript || '').trim().slice(0, 4000);

  let title = `YouTube Video (${videoId})`;
  let author = 'YouTube Creator';
  try {
    const oeRes = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`,
    );
    if (oeRes.ok) {
      const oe = await oeRes.json();
      if (oe?.title) title = String(oe.title);
      if (oe?.author_name) author = String(oe.author_name);
    }
  } catch {
    // Ignore oembed error
  }

  let rawCaptions = [];
  if (manualTranscript) {
    rawCaptions = manualTranscript
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !/^\d+$/.test(l) && !/-->/.test(l) && !/^WEBVTT/i.test(l))
      .slice(0, 14)
      .map((text, idx) => ({ startSec: idx * 6, text }));
  } else {
    rawCaptions = await fetchYouTubeCaptionsBestEffort(videoId, languageCode);
  }

  const transcriptBlock =
    rawCaptions.length > 0
      ? rawCaptions.map((c) => `[${c.startSec}s] ${c.text}`).join('\n')
      : `Sem legenda automática disponível. Gere 6 linhas de diálogo realistas no idioma "${languageCode}" (nível ${level}) inspiradas fielmente no tema do vídeo "${title}" (${author}).`;

  const prompt = `Você é professor especialista do FluentBridge Academy. Analise este vídeo do YouTube para um estudante brasileiro de "${languageCode}" (nível ${level}).
Título: "${title}" | Canal: "${author}"
Conteúdo/Legenda:
${transcriptBlock}

Retorne APENAS JSON válido (sem markdown) exatamente com este formato:
{
  "subtitles": [
    {
      "id": "sub-1",
      "startSec": 0,
      "textTarget": "frase no idioma alvo",
      "textPt": "tradução natural em português",
      "tokens": [
        { "surface": "palavra", "lemma": "forma base", "translationPt": "tradução", "ipa": "/.../", "partOfSpeech": "verbo/substantivo", "notePt": "dica curta de uso" }
      ]
    }
  ],
  "grammarInsights": [
    {
      "id": "g-1",
      "expression": "estrutura ou expressão real do vídeo",
      "structureType": "Tempo verbal / Conector / Expressão",
      "level": "${level}",
      "whyUsedPt": "Por que o falante escolheu esta estrutura neste contexto",
      "usageTipPt": "Dica prática para o aluno brasileiro aplicar sem erro",
      "registerNotePt": "Formal / Informal / Neutro",
      "exampleAlternative": "outra frase usando a mesma estrutura"
    }
  ],
  "checkpoints": [
    {
      "id": "cp-1",
      "questionPt": "Pergunta de compreensão ou uso gramatical sobre o vídeo",
      "options": ["Opção A", "Opção B", "Opção C"],
      "correctIndex": 0,
      "explanationPt": "Explicação pedagógica objetiva"
    }
  ]
}
Gere 6 a 10 linhas em subtitles (com 3 a 5 tokens por linha), 3 a 4 grammarInsights ricos e 2 checkpoints.`;

  for (const model of GEMINI_FALLBACK_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
          }),
        },
      );
      if (!res.ok) continue;
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      return jsonResponse({
        ok: true,
        videoId,
        title,
        author,
        languageCode,
        source: rawCaptions.length > 0 ? (manualTranscript ? 'manual-transcript' : 'youtube-captions') : 'ai-topic-synthesis',
        subtitles: Array.isArray(parsed.subtitles) ? parsed.subtitles : [],
        grammarInsights: Array.isArray(parsed.grammarInsights) ? parsed.grammarInsights : [],
        checkpoints: Array.isArray(parsed.checkpoints) ? parsed.checkpoints : [],
      });
    } catch {
      // Try next fallback model
    }
  }
  return jsonResponse({ ok: false, error: 'Falha ao gerar estudo de YouTube via IA.' }, 502);
}

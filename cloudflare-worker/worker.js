/**
 * FluentBridge Cloud API Worker
 * - /api/tts: Neural TTS via Cloudflare Workers AI (Deepgram Aura-2) + Google TTS fallback
 * - /api/stt: Cloud Whisper STT via Cloudflare Workers AI (@cf/openai/whisper-large-v3-turbo)
 * - /api/gemini-tutor: Secure proxy for Gemini AI Tutor without exposing API keys in client JS
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Range',
  'Access-Control-Expose-Headers': 'Accept-Ranges, Content-Range, Content-Length, X-TTS-Cache',
  'Access-Control-Max-Age': '86400',
};

const GEMINI_FALLBACK_MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash'];
const MAX_TTS_CHARS = 800;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimitBuckets = new Map();
const jwtCache = new Map();
const memoryTelemetryLogs = [];

async function verifySupabaseJwt(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return { authenticated: false, userId: null, email: null };
  }
  const token = authHeader.slice(7).trim();
  if (!token || token.length < 20) {
    return { authenticated: false, userId: null, email: null };
  }
  const now = Date.now();
  const cached = jwtCache.get(token);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }
  const supabaseUrl = (env.SUPABASE_URL || 'https://wyonvrrcdoikrspbpeis.supabase.co').replace(/\/+$/, '');
  const apiKey = (env.SUPABASE_ANON_KEY || '').trim();
  try {
    const headers = { Authorization: `Bearer ${token}` };
    if (apiKey) headers.apikey = apiKey;
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, { headers });
    if (!res.ok) {
      return { authenticated: false, userId: null, email: null };
    }
    const user = await res.json();
    const value = {
      authenticated: Boolean(user?.id),
      userId: user?.id || null,
      email: user?.email || null,
    };
    if (jwtCache.size > 400) jwtCache.clear();
    jwtCache.set(token, { value, expiresAt: now + 5 * 60_000 });
    return value;
  } catch {
    return { authenticated: false, userId: null, email: null };
  }
}

async function buildR2TtsKey(locale, speaker, text) {
  const data = new TextEncoder().encode(`${locale}|${speaker}|${text}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `tts/v6/${locale}/${hex}.audio`;
}

function checkRateLimit(request, routeKey, maxPerMinute, userId = null) {
  const ip =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown';
  const now = Date.now();
  const bucketKey = userId ? `${routeKey}:user:${userId}` : `${routeKey}:ip:${ip}`;
  if (rateLimitBuckets.size > 500) {
    for (const [k, v] of rateLimitBuckets.entries()) {
      if (v.resetAt <= now) rateLimitBuckets.delete(k);
    }
  }
  const existing = rateLimitBuckets.get(bucketKey);
  if (!existing || existing.resetAt <= now) {
    rateLimitBuckets.set(bucketKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: maxPerMinute - 1, resetSec: 60 };
  }
  existing.count += 1;
  const resetSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  if (existing.count > maxPerMinute) {
    return { allowed: false, remaining: 0, resetSec };
  }
  return {
    allowed: true,
    remaining: Math.max(0, maxPerMinute - existing.count),
    resetSec,
  };
}

async function checkPersistentDailyQuota(env, request, routeKey, dailyLimit, userId = null) {
  if (!env.MEDIA_BUCKET) return { allowed: true, remaining: dailyLimit };
  const ip =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown';
  const day = new Date().toISOString().slice(0, 10);
  const rawId = (userId ? `u_${userId}` : `ip_${ip}`).replace(/[^a-zA-Z0-9._-]/g, '_');
  const quotaKey = `quotas/${day}/${routeKey}/${rawId}.json`;
  try {
    let count = 0;
    const existing = await env.MEDIA_BUCKET.get(quotaKey);
    if (existing) {
      const parsed = await existing.json();
      count = Number(parsed?.count || 0);
    }
    if (count >= dailyLimit) {
      return { allowed: false, remaining: 0 };
    }
    await env.MEDIA_BUCKET.put(
      quotaKey,
      JSON.stringify({ count: count + 1, updatedAt: new Date().toISOString() }),
      { httpMetadata: { contentType: 'application/json' } },
    );
    return { allowed: true, remaining: Math.max(0, dailyLimit - (count + 1)) };
  } catch {
    return { allowed: true, remaining: dailyLimit };
  }
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

// Sotaques regionais com prompt nativo próprio (antes caíam no padrão do idioma e soavam iguais)
const EXTRA_REGIONAL_TTS = {
  'it-it-mil': { loc: 'it-IT-MIL', bcp47: 'it-IT', gl: 'it', f: 'Leda', m: 'Orus', qo: '«', qc: '»',
    p: 'Leggi esclusivamente ad alta voce il seguente testo in italiano con il tipico accento milanese (Lombardia), naturale e senza commenti:' },
  'it-it-nap': { loc: 'it-IT-NAP', bcp47: 'it-IT', gl: 'it', f: 'Leda', m: 'Orus', qo: '«', qc: '»',
    p: 'Leggi esclusivamente ad alta voce il seguente testo in italiano con il tipico accento napoletano (Campania), naturale e senza commenti:' },
  'de-ch': { loc: 'de-CH', bcp47: 'de-DE', gl: 'de', f: 'Vindemiatrix', m: 'Charon', qo: '«', qc: '»',
    p: 'Lies ausschließlich den folgenden Text als Muttersprachler mit Schweizer Hochdeutsch-Akzent (Zürich) laut vor, ohne Kommentar:' },
  'de-de-by': { loc: 'de-DE-BY', bcp47: 'de-DE', gl: 'de', f: 'Vindemiatrix', m: 'Charon', qo: '„', qc: '“',
    p: 'Lies ausschließlich den folgenden Text als Muttersprachler mit bairischem Akzent (München) laut vor, ohne Kommentar:' },
  'ru-kz': { loc: 'ru-KZ', bcp47: 'ru-RU', gl: 'ru', f: 'Leda', m: 'Orus', qo: '«', qc: '»',
    p: 'Прочитай вслух только следующий текст как носитель русского языка из Казахстана (Алматы), без комментариев:' },
  'ja-fuk': { loc: 'ja-FUK', bcp47: 'ja-JP', gl: 'ja', f: 'Aoede', m: 'Fenrir', qo: '「', qc: '」',
    p: '次の日本語の文章だけを、福岡（博多）の話者らしいイントネーションで、余計な説明なしにそのまま音読してください：' },
  'zh-sg': { loc: 'zh-SG', bcp47: 'cmn-CN', gl: 'zh-CN', f: 'Kore', m: 'Puck', qo: '“', qc: '”',
    p: '请仅朗读以下内容，使用新加坡华语的母语发音和语调，不要添加任何说明：' },
  'ar-lb': { loc: 'ar-LB', bcp47: 'ar-XA', gl: 'ar', f: 'Sadaltager', m: 'Alnilam', qo: '«', qc: '»',
    p: 'اقرأ النص العربي التالي فقط بصوت واضح وبلكنة لبنانية (بيروت) أصلية بدون أي تعليق إضافي:' },
  'ar-ma': { loc: 'ar-MA', bcp47: 'ar-XA', gl: 'ar', f: 'Sadaltager', m: 'Alnilam', qo: '«', qc: '»',
    p: 'اقرأ النص العربي التالي فقط بصوت واضح وبلكنة مغربية (الدار البيضاء) أصلية بدون أي تعليق إضافي:' },
  'ar-ae': { loc: 'ar-AE', bcp47: 'ar-XA', gl: 'ar', f: 'Sadaltager', m: 'Alnilam', qo: '«', qc: '»',
    p: 'اقرأ النص العربي التالي فقط بصوت واضح وبلكنة خليجية إماراتية (دبي) أصلية بدون أي تعليق إضافي:' },
  'nl-sr': { loc: 'nl-SR', bcp47: 'nl-NL', gl: 'nl', f: 'Despina', m: 'Schedar', qo: '„', qc: '”',
    p: 'Lees uitsluitend de volgende tekst voor met een natuurlijk Surinaams Nederlands accent (Paramaribo), zonder commentaar:' },
  'af-cpt': { loc: 'af-CPT', bcp47: 'af-ZA', gl: 'af', f: 'Gacrux', m: 'Iapetus', qo: '„', qc: '”',
    p: 'Lees slegs die volgende Afrikaanse teks hardop voor met ’n natuurlike Kaapse Afrikaanse aksent (Kaapstad), sonder kommentaar:' },
  'sv-gbg': { loc: 'sv-GBG', bcp47: 'sv-SE', gl: 'sv', f: 'Callirrhoe', m: 'Umbriel', qo: '”', qc: '”',
    p: 'Läs endast upp följande text på göteborgska med naturlig göteborgsk intonation, utan kommentarer:' },
};

function resolveTtsConfig(rawLang, rawVoice) {
  const lower = (rawLang || 'en-US').trim().toLowerCase();
  const isMale = (rawVoice || '').trim().toLowerCase() === 'male';

  const extra = EXTRA_REGIONAL_TTS[lower];
  if (extra) {
    return {
      engine: 'gemini-tts',
      locale: extra.loc,
      bcp47: extra.bcp47,
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? extra.m : extra.f,
      promptPrefix: extra.p,
      quoteOpen: extra.qo,
      quoteClose: extra.qc,
      googleLang: extra.gl,
    };
  }

  if (lower === 'en-gb' || lower === 'uk') {
    return {
      engine: 'gemini-tts',
      locale: 'en-GB',
      bcp47: 'en-GB',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Charon' : 'Aoede',
      promptPrefix: 'Read only the following text aloud in natural British English (London RP), clear and expressive, no commentary:',
      quoteOpen: '"',
      quoteClose: '"',
      fallbackModel: '@cf/deepgram/aura-2-en',
      fallbackSpeaker: isMale ? 'draco' : 'pandora',
      googleLang: 'en-GB',
    };
  }
  if (lower === 'en-gb-sct') {
    return {
      engine: 'gemini-tts',
      locale: 'en-GB-SCT',
      bcp47: 'en-GB',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Charon' : 'Aoede',
      promptPrefix: 'Read only the following text aloud with a natural Scottish English (Edinburgh) accent, no commentary:',
      quoteOpen: '"',
      quoteClose: '"',
      fallbackModel: '@cf/deepgram/aura-2-en',
      fallbackSpeaker: isMale ? 'draco' : 'pandora',
      googleLang: 'en-GB',
    };
  }
  if (lower === 'en-au' || lower === 'en-ca' || lower === 'en-ie' || lower === 'en-in' || lower === 'en-za') {
    const regionMap = {
      'en-au': { label: 'Australian English (Sydney)', bcp47: 'en-AU' },
      'en-ca': { label: 'Canadian English (Toronto)', bcp47: 'en-CA' },
      'en-ie': { label: 'Irish English (Dublin)', bcp47: 'en-IE' },
      'en-in': { label: 'Indian English', bcp47: 'en-IN' },
      'en-za': { label: 'South African English', bcp47: 'en-ZA' },
    };
    const r = regionMap[lower];
    return {
      engine: 'gemini-tts',
      locale: lower.toUpperCase(),
      bcp47: r.bcp47,
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Puck' : 'Zephyr',
      promptPrefix: `Read only the following text aloud as a native ${r.label} speaker, without commentary:`,
      quoteOpen: '"',
      quoteClose: '"',
      fallbackModel: '@cf/deepgram/aura-2-en',
      fallbackSpeaker: lower === 'en-ie' ? (isMale ? 'draco' : 'pandora') : (isMale ? 'apollo' : 'thalia'),
      googleLang: r.bcp47,
    };
  }
  if (lower === 'es-es') {
    return {
      engine: 'gemini-tts',
      locale: 'es-ES',
      bcp47: 'es-ES',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Charon' : 'Aoede',
      promptPrefix: 'Lee únicamente en voz alta el siguiente texto como hablante nativo de español de Madrid (España), con entonación natural y sin comentarios:',
      quoteOpen: '«',
      quoteClose: '»',
      fallbackModel: '@cf/deepgram/aura-2-es',
      fallbackSpeaker: isMale ? 'nestor' : 'carina',
      googleLang: 'es-ES',
    };
  }
  if (lower === 'es-ar' || lower === 'es-co' || lower === 'es-cl' || lower === 'es-pr') {
    const esMap = {
      'es-ar': { label: 'español rioplatense de Buenos Aires', bcp47: 'es-AR' },
      'es-co': { label: 'español colombiano de Bogotá', bcp47: 'es-CO' },
      'es-cl': { label: 'español chileno de Santiago', bcp47: 'es-CL' },
      'es-pr': { label: 'español caribeño de Puerto Rico', bcp47: 'es-PR' },
    };
    const r = esMap[lower];
    return {
      engine: 'gemini-tts',
      locale: lower.toUpperCase(),
      bcp47: r.bcp47,
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Charon' : 'Aoede',
      promptPrefix: `Lee únicamente en voz alta el siguiente texto como hablante nativo de ${r.label}, sin comentarios:`,
      quoteOpen: '«',
      quoteClose: '»',
      fallbackModel: '@cf/deepgram/aura-2-es',
      fallbackSpeaker: isMale ? 'javier' : 'estrella',
      googleLang: r.bcp47,
    };
  }
  if (lower.startsWith('es')) {
    return {
      engine: 'gemini-tts',
      locale: 'es-MX',
      bcp47: 'es-MX',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Puck' : 'Zephyr',
      promptPrefix: 'Lee únicamente en voz alta el siguiente texto como hablante nativo de español mexicano natural, sin comentarios:',
      quoteOpen: '«',
      quoteClose: '»',
      fallbackModel: '@cf/deepgram/aura-2-es',
      fallbackSpeaker: isMale ? 'javier' : 'estrella',
      googleLang: 'es',
    };
  }
  if (lower === 'fr-ca' || lower === 'fr-be' || lower === 'fr-ch') {
    const frLabel =
      lower === 'fr-ca'
        ? 'français québécois'
        : lower === 'fr-be'
          ? 'français belge de Bruxelles'
          : 'français suisse de Genève';
    return {
      engine: 'gemini-tts',
      locale: lower.toUpperCase(),
      bcp47: lower === 'fr-ca' ? 'fr-CA' : lower === 'fr-be' ? 'fr-BE' : 'fr-CH',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Puck' : 'Zephyr',
      promptPrefix: `Lis uniquement à voix haute le texte suivant en ${frLabel} naturel, sans aucun accent étranger et sans commentaire :`,
      quoteOpen: '« ',
      quoteClose: ' »',
      googleLang: lower,
    };
  }
  if (lower.startsWith('fr')) {
    return {
      engine: 'gemini-tts',
      locale: 'fr-FR',
      bcp47: 'fr-FR',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Charon' : 'Aoede',
      promptPrefix: 'Lis uniquement à voix haute le texte suivant en français parisien natif, avec une prononciation naturelle et sans commentaire :',
      quoteOpen: '« ',
      quoteClose: ' »',
      googleLang: 'fr',
    };
  }
  if (lower === 'it-ch') {
    return {
      engine: 'gemini-tts',
      locale: 'it-CH',
      bcp47: 'it-IT',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Orus' : 'Leda',
      promptPrefix: 'Leggi esclusivamente ad alta voce il seguente testo in italiano svizzero naturale, senza accento straniero e senza commenti:',
      quoteOpen: '«',
      quoteClose: '»',
      googleLang: 'it',
    };
  }
  if (lower.startsWith('it')) {
    return {
      engine: 'gemini-tts',
      locale: 'it-IT',
      bcp47: 'it-IT',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Orus' : 'Leda',
      promptPrefix: 'Leggi esclusivamente ad alta voce il seguente testo in italiano standard nativo, con pronuncia chiara e senza aggiungere commenti:',
      quoteOpen: '«',
      quoteClose: '»',
      googleLang: 'it',
    };
  }
  if (lower === 'de-at') {
    return {
      engine: 'gemini-tts',
      locale: 'de-AT',
      bcp47: 'de-DE',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Charon' : 'Vindemiatrix',
      promptPrefix: 'Lies ausschließlich den folgenden Text auf österreichischem Deutsch als Muttersprachler laut vor, ohne fremden Akzent und ohne Kommentar:',
      quoteOpen: '„',
      quoteClose: '“',
      googleLang: 'de',
    };
  }
  if (lower.startsWith('de')) {
    return {
      engine: 'gemini-tts',
      locale: 'de-DE',
      bcp47: 'de-DE',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Charon' : 'Vindemiatrix',
      promptPrefix: 'Lies ausschließlich den folgenden Text auf Hochdeutsch als Muttersprachler klar und natürlich laut vor, ohne Kommentar:',
      quoteOpen: '„',
      quoteClose: '“',
      googleLang: 'de',
    };
  }
  if (lower === 'ru-spb') {
    return {
      engine: 'gemini-tts',
      locale: 'ru-SPB',
      bcp47: 'ru-RU',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Orus' : 'Leda',
      promptPrefix: 'Прочитай вслух только следующий русский текст как носитель языка из Санкт-Петербурга, с чистым русским произношением, без иностранного акцента и без комментариев:',
      quoteOpen: '«',
      quoteClose: '»',
      googleLang: 'ru',
    };
  }
  if (lower.startsWith('ru')) {
    return {
      engine: 'gemini-tts',
      locale: 'ru-RU',
      bcp47: 'ru-RU',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Fenrir' : 'Kore',
      promptPrefix: 'Прочитай вслух только следующий русский текст как носитель московского произношения, с естественной русской интонацией, без английского акцента и без лишних слов:',
      quoteOpen: '«',
      quoteClose: '»',
      googleLang: 'ru',
    };
  }
  if (lower === 'ja-kansai') {
    return {
      engine: 'gemini-tts',
      locale: 'ja-KANSAI',
      bcp47: 'ja-JP',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Fenrir' : 'Aoede',
      promptPrefix: '次の日本語の文章だけを、自然な関西弁のイントネーションを持つネイティブ話者として、余計な説明なしでそのまま音読してください：',
      quoteOpen: '「',
      quoteClose: '」',
      googleLang: 'ja',
    };
  }
  if (lower.startsWith('ja')) {
    return {
      engine: 'gemini-tts',
      locale: 'ja-JP',
      bcp47: 'ja-JP',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Fenrir' : 'Aoede',
      promptPrefix: '次の日本語の文章だけを、標準的な東京のネイティブ発音と自然なピッチアクセントで、解説を加えずにそのまま音読してください：',
      quoteOpen: '「',
      quoteClose: '」',
      googleLang: 'ja',
    };
  }
  if (lower === 'zh-tw') {
    return {
      engine: 'gemini-tts',
      locale: 'zh-TW',
      bcp47: 'cmn-TW',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Puck' : 'Kore',
      promptPrefix: '請僅朗讀以下繁體中文內容，使用自然的台灣國語母語發音與準確聲調，不要添加任何說明：',
      quoteOpen: '「',
      quoteClose: '」',
      googleLang: 'zh-TW',
    };
  }
  if (lower.startsWith('zh')) {
    return {
      engine: 'gemini-tts',
      locale: 'zh-CN',
      bcp47: 'cmn-CN',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Puck' : 'Kore',
      promptPrefix: '请仅朗读以下中文内容，使用标准地道的普通话母语发音和准确声调，不要添加任何额外说明：',
      quoteOpen: '“',
      quoteClose: '”',
      googleLang: 'zh-CN',
    };
  }
  if (lower === 'ar-eg') {
    return {
      engine: 'gemini-tts',
      locale: 'ar-EG',
      bcp47: 'ar-EG',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Alnilam' : 'Sadaltager',
      promptPrefix: 'اقرأ النص العربي التالي فقط بصوت واضح وطبيعي وبلكنة عربية مصرية أصلية بدون أي تعليق إضافي:',
      quoteOpen: '«',
      quoteClose: '»',
      googleLang: 'ar',
    };
  }
  if (lower.startsWith('ar')) {
    return {
      engine: 'gemini-tts',
      locale: 'ar-SA',
      bcp47: 'ar-XA',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Alnilam' : 'Sadaltager',
      promptPrefix: 'اقرأ النص العربي الفصيح التالي فقط بصوت ناطق أصلي وبنطق عربي سليم وواضح دون أي إضافة:',
      quoteOpen: '«',
      quoteClose: '»',
      googleLang: 'ar',
    };
  }
  if (lower === 'nl-be') {
    return {
      engine: 'gemini-tts',
      locale: 'nl-BE',
      bcp47: 'nl-BE',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Schedar' : 'Despina',
      promptPrefix: 'Lees uitsluitend de volgende tekst voor in natuurlijk Vlaams Nederlands als moedertaalspreker, zonder commentaar:',
      quoteOpen: '„',
      quoteClose: '”',
      googleLang: 'nl',
    };
  }
  if (lower.startsWith('nl')) {
    return {
      engine: 'gemini-tts',
      locale: 'nl-NL',
      bcp47: 'nl-NL',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Schedar' : 'Despina',
      promptPrefix: 'Lees uitsluitend de volgende tekst hardop voor in natuurlijk Standaardnederlands als moedertaalspreker, zonder commentaar:',
      quoteOpen: '„',
      quoteClose: '”',
      googleLang: 'nl',
    };
  }
  if (lower === 'af-na') {
    return {
      engine: 'gemini-tts',
      locale: 'af-NA',
      bcp47: 'af-ZA',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Iapetus' : 'Gacrux',
      promptPrefix: 'Lees slegs die volgende Afrikaanse teks hardop voor as ’n moedertaalspreker, duidelik en natuurlik sonder kommentaar:',
      quoteOpen: '„',
      quoteClose: '”',
      googleLang: 'af',
    };
  }
  if (lower.startsWith('af')) {
    return {
      engine: 'gemini-tts',
      locale: 'af-ZA',
      bcp47: 'af-ZA',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Iapetus' : 'Gacrux',
      promptPrefix: 'Lees slegs die volgende Suid-Afrikaanse Afrikaanse teks hardop voor as ’n moedertaalspreker, sonder kommentaar:',
      quoteOpen: '„',
      quoteClose: '”',
      googleLang: 'af',
    };
  }
  if (lower === 'sv-fi') {
    return {
      engine: 'gemini-tts',
      locale: 'sv-FI',
      bcp47: 'sv-SE',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Umbriel' : 'Callirrhoe',
      promptPrefix: 'Läs endast upp följande text på finlandssvenska som en modersmålstalare, tydligt och utan kommentarer:',
      quoteOpen: '”',
      quoteClose: '”',
      googleLang: 'sv',
    };
  }
  if (lower.startsWith('sv')) {
    return {
      engine: 'gemini-tts',
      locale: 'sv-SE',
      bcp47: 'sv-SE',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Umbriel' : 'Callirrhoe',
      promptPrefix: 'Läs endast upp följande text på naturlig rikssvenska som en modersmålstalare, utan utländsk brytning och utan kommentarer:',
      quoteOpen: '”',
      quoteClose: '”',
      googleLang: 'sv',
    };
  }
  if (lower.startsWith('pt')) {
    return {
      engine: 'gemini-tts',
      locale: 'pt-BR',
      bcp47: 'pt-BR',
      model: 'gemini-2.5-flash-preview-tts',
      speaker: isMale ? 'Puck' : 'Aoede',
      promptPrefix: 'Leia em voz alta apenas o texto a seguir em português brasileiro natural, sem comentários:',
      quoteOpen: '“',
      quoteClose: '”',
      googleLang: 'pt-BR',
    };
  }
  return {
    engine: 'gemini-tts',
    locale: 'en-US',
    bcp47: 'en-US',
    model: 'gemini-2.5-flash-preview-tts',
    speaker: isMale ? 'Puck' : 'Zephyr',
    promptPrefix: 'Read only the following text aloud in natural American English, clear and expressive, no commentary:',
    quoteOpen: '"',
    quoteClose: '"',
    fallbackModel: '@cf/deepgram/aura-2-en',
    fallbackSpeaker: isMale ? 'apollo' : 'thalia',
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
  const qOpen = cfg.quoteOpen || '«';
  const qClose = cfg.quoteClose || '»';
  const promptText = `${cfg.promptPrefix || ''} ${qOpen}${text}${qClose}`.trim();

  const speechConfigs = cfg.bcp47
    ? [
        { voiceConfig: { prebuiltVoiceConfig: { voiceName: cfg.speaker } }, languageCode: cfg.bcp47 },
        { voiceConfig: { prebuiltVoiceConfig: { voiceName: cfg.speaker } } },
      ]
    : [{ voiceConfig: { prebuiltVoiceConfig: { voiceName: cfg.speaker } } }];

  for (const model of models) {
    for (const sc of speechConfigs) {
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
              speechConfig: sc,
            },
          }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const inlineData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        if (!inlineData?.data) continue;

        const pcmBytes = base64ToUint8Array(inlineData.data);
        if (pcmBytes.byteLength <= 200) continue;
        // Sanity guard: if a short word (<=25 chars) produces >4.5s of audio (~216KB), Gemini likely hallucinated commentary
        if (text.length <= 25 && pcmBytes.byteLength > 216_000) {
          return null;
        }

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
        // Try next speechConfig / model
      }
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
    `https://fluentbridge-tts-cache.internal/v6/${encodeURIComponent(cfg.locale)}/${encodeURIComponent(cfg.speaker)}/${encodeURIComponent(clippedText)}`,
  );
  const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  const r2Key = env.MEDIA_BUCKET ? await buildR2TtsKey(cfg.locale, cfg.speaker, clippedText) : null;

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

  if (env.MEDIA_BUCKET && r2Key) {
    try {
      const r2Obj = await env.MEDIA_BUCKET.get(r2Key);
      if (r2Obj) {
        const r2Buf = await r2Obj.arrayBuffer();
        const r2ContentType = r2Obj.httpMetadata?.contentType || 'audio/mpeg';
        const r2Provider = r2Obj.customMetadata?.provider || 'r2-cache';
        const hitHeaders = {
          'Content-Type': r2ContentType,
          'Cache-Control': 'public, max-age=604800',
          'X-TTS-Provider': r2Provider,
          'X-TTS-Locale': cfg.locale,
          'X-TTS-Cache': 'R2-HIT',
          ...CORS_HEADERS,
        };
        if (cache && ctx && typeof ctx.waitUntil === 'function') {
          ctx.waitUntil(cache.put(cacheKey, new Response(r2Buf.slice(0), { status: 200, headers: hitHeaders })));
        }
        return new Response(r2Buf, { status: 200, headers: hitHeaders });
      }
    } catch {
      // Continue to synthesis if R2 read fails
    }
  }

  let audioBuffer = null;
  let contentType = 'audio/mpeg';
  let provider = 'none';
  let isEmergencyFallback = false;

  // Tier 1: Gemini 2.5 Native Neural TTS (prosódia natural em todos os 49 sotaques)
  if (cfg.engine === 'gemini-tts') {
    const gem = await synthesizeGeminiNeuralTts(clippedText, cfg, env);
    if (gem && gem.buffer && gem.buffer.byteLength > 200) {
      audioBuffer = gem.buffer;
      contentType = gem.contentType;
      provider = gem.provider;
    }
  }

  // Tier 2: Deepgram Aura-2 Neural (fallback neural para EN/ES ou quando engine === 'deepgram')
  const dgModel = cfg.fallbackModel || (cfg.engine === 'deepgram' ? cfg.model : null);
  const dgSpeaker = cfg.fallbackSpeaker || cfg.speaker;
  if (!audioBuffer && dgModel && env.AI) {
    try {
      const aiResult = await env.AI.run(dgModel, {
        text: clippedText,
        speaker: dgSpeaker,
        encoding: 'mp3',
      });
      const buf = await aiResultToArrayBuffer(aiResult);
      if (buf && buf.byteLength > 200) {
        audioBuffer = buf;
        provider = `deepgram-aura-2:${dgSpeaker}`;
      }
    } catch (err) {
      try {
        const retryResult = await env.AI.run(dgModel, {
          text: clippedText,
          speaker: dgSpeaker,
        });
        const retryBuf = await aiResultToArrayBuffer(retryResult);
        if (retryBuf && retryBuf.byteLength > 200) {
          audioBuffer = retryBuf;
          provider = `deepgram-aura-2:${dgSpeaker}`;
        }
      } catch {
        console.warn('Workers AI TTS error:', err instanceof Error ? err.message : String(err));
      }
    }
  }

  // Tier 3: Emergencial (nunca gravar no R2 nem no Edge Cache para não envenenar o cache com voz robótica)
  if (!audioBuffer) {
    audioBuffer = await fetchGoogleTtsFallback(clippedText, cfg.googleLang);
    if (audioBuffer) {
      contentType = 'audio/mpeg';
      provider = 'google-tts-fallback';
      isEmergencyFallback = true;
    }
  }

  if (!audioBuffer) {
    return jsonResponse({ error: 'Unable to synthesize speech' }, 502);
  }

  const responseHeaders = {
    'Content-Type': contentType,
    'Cache-Control': isEmergencyFallback ? 'no-store' : 'public, max-age=604800',
    'X-TTS-Provider': provider,
    'X-TTS-Locale': cfg.locale,
    'X-TTS-Cache': isEmergencyFallback ? 'BYPASS' : 'MISS',
    ...(isEmergencyFallback ? { 'X-TTS-Fallback': 'true' } : {}),
    ...CORS_HEADERS,
  };

  if (!isEmergencyFallback && cache && ctx && typeof ctx.waitUntil === 'function') {
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

  if (!isEmergencyFallback && env.MEDIA_BUCKET && r2Key && ctx && typeof ctx.waitUntil === 'function') {
    ctx.waitUntil(
      env.MEDIA_BUCKET.put(r2Key, audioBuffer.slice(0), {
        httpMetadata: { contentType },
        customMetadata: { provider, locale: cfg.locale },
      }).catch(() => undefined),
    );
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
  if (lower.startsWith('ru')) return 'ru';
  if (lower.startsWith('ja')) return 'ja';
  if (lower.startsWith('zh')) return 'zh';
  if (lower.startsWith('ar')) return 'ar';
  if (lower.startsWith('nl')) return 'nl';
  if (lower.startsWith('af')) return 'af';
  if (lower.startsWith('sv')) return 'sv';
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

async function handleMediaRequest(request, env, path) {
  if (!env.MEDIA_BUCKET) {
    return jsonResponse({ error: 'R2 MEDIA_BUCKET not configured' }, 503);
  }

  if (path === '/api/media/upload') {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }
    const auth = await verifySupabaseJwt(request, env);
    if (env.REQUIRE_SUPABASE_JWT === 'true' && !auth.authenticated) {
      return jsonResponse({ error: 'Authentication required for media upload' }, 401);
    }
    const url = new URL(request.url);
    let rawKey = (url.searchParams.get('key') || `clip-${Date.now()}.mp4`).trim();
    let contentType = request.headers.get('content-type') || 'video/mp4';
    let bodyBytes;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      if (!file || typeof file === 'string') {
        return jsonResponse({ error: 'Missing file in multipart form' }, 400);
      }
      rawKey = String(form.get('key') || file.name || rawKey);
      contentType = file.type || 'video/mp4';
      bodyBytes = await file.arrayBuffer();
    } else {
      bodyBytes = await request.arrayBuffer();
    }

    if (!bodyBytes || bodyBytes.byteLength === 0) {
      return jsonResponse({ error: 'Empty media payload' }, 400);
    }
    if (bodyBytes.byteLength > 15 * 1024 * 1024) {
      return jsonResponse({ error: 'Media payload exceeds 15MB limit' }, 413);
    }

    const safeName = rawKey.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^_+/, '');
    const key = safeName.startsWith('videos/') ? safeName : `videos/${safeName}`;
    await env.MEDIA_BUCKET.put(key, bodyBytes, {
      httpMetadata: { contentType },
      customMetadata: { uploadedBy: auth.userId || 'local' },
    });
    const baseUrl = `${url.origin}/api/media/${key}`;
    return jsonResponse({ ok: true, key, url: baseUrl, size: bodyBytes.byteLength });
  }

  if (path === '/api/media/list') {
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }
    const url = new URL(request.url);
    const listed = await env.MEDIA_BUCKET.list({ prefix: 'videos/', limit: 100 });
    const items = (listed.objects || []).map((obj) => ({
      key: obj.key,
      url: `${url.origin}/api/media/${obj.key}`,
      size: obj.size,
      uploaded: obj.uploaded,
    }));
    return jsonResponse({ ok: true, items });
  }

  const key = decodeURIComponent(path.replace(/^\/api\/media\//, '')).replace(/^\/+/, '');
  if (!key) {
    return jsonResponse({ error: 'Missing media key' }, 400);
  }
  const rangeHeader = request.headers.get('Range');
  if (rangeHeader) {
    const headObj = await env.MEDIA_BUCKET.head(key);
    if (!headObj) {
      return jsonResponse({ error: 'Media not found' }, 404);
    }
    const total = headObj.size;
    const match = /^bytes=(\d+)-(\d*)$/i.exec(rangeHeader.trim());
    if (!match) {
      return new Response('Invalid Range', { status: 416, headers: CORS_HEADERS });
    }
    const start = Number(match[1]);
    const end = match[2] ? Math.min(Number(match[2]), total - 1) : total - 1;
    if (start >= total || start > end) {
      return new Response('Range Not Satisfiable', {
        status: 416,
        headers: { ...CORS_HEADERS, 'Content-Range': `bytes */${total}` },
      });
    }
    const length = end - start + 1;
    const sliced = await env.MEDIA_BUCKET.get(key, { range: { offset: start, length } });
    if (!sliced) {
      return jsonResponse({ error: 'Media not found' }, 404);
    }
    const headers = new Headers();
    sliced.writeHttpMetadata(headers);
    if (!headers.get('Content-Type')) headers.set('Content-Type', 'video/mp4');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Range', `bytes ${start}-${end}/${total}`);
    headers.set('Content-Length', String(length));
    headers.set('Cache-Control', 'public, max-age=31536000');
    Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v));
    return new Response(sliced.body, { status: 206, headers });
  }

  const obj = await env.MEDIA_BUCKET.get(key);
  if (!obj) {
    return jsonResponse({ error: 'Media not found' }, 404);
  }
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  if (!headers.get('Content-Type')) headers.set('Content-Type', 'application/octet-stream');
  headers.set('Accept-Ranges', 'bytes');
  if (typeof obj.size === 'number') {
    headers.set('Content-Length', String(obj.size));
  }
  headers.set('Cache-Control', 'public, max-age=31536000');
  Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v));
  return new Response(obj.body, { status: 200, headers });
}

async function handleTelemetryRequest(request, env) {
  const TELEMETRY_KEY = 'telemetry/errors.json';
  if (request.method === 'GET') {
    if (env.REQUIRE_SUPABASE_JWT === 'true') {
      const auth = await verifySupabaseJwt(request, env);
      if (!auth.authenticated) {
        return jsonResponse({ ok: false, error: 'Authentication required for telemetry read' }, 401);
      }
    }
    let logs = [...memoryTelemetryLogs];
    if (env.MEDIA_BUCKET) {
      try {
        const obj = await env.MEDIA_BUCKET.get(TELEMETRY_KEY);
        if (obj) {
          const parsed = await obj.json();
          if (Array.isArray(parsed)) logs = parsed;
        }
      } catch {
        // Ignore R2 read error
      }
    }
    return jsonResponse({ ok: true, logs });
  }

  if (request.method === 'POST') {
    let body = {};
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON payload' }, 400);
    }
    const entry = {
      id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      message: String(body.message || 'Unknown error').slice(0, 300),
      stack: String(body.stack || '').slice(0, 800),
      route: String(body.route || '/').slice(0, 120),
      version: String(body.version || 'unknown').slice(0, 32),
      platform: String(body.platform || 'web').slice(0, 32),
      timestamp: new Date().toISOString(),
    };
    memoryTelemetryLogs.unshift(entry);
    if (memoryTelemetryLogs.length > 100) memoryTelemetryLogs.length = 100;

    if (env.MEDIA_BUCKET) {
      try {
        let existing = [];
        const prev = await env.MEDIA_BUCKET.get(TELEMETRY_KEY);
        if (prev) {
          const parsed = await prev.json().catch(() => []);
          if (Array.isArray(parsed)) existing = parsed;
        }
        const next = [entry, ...existing].slice(0, 100);
        await env.MEDIA_BUCKET.put(TELEMETRY_KEY, JSON.stringify(next), {
          httpMetadata: { contentType: 'application/json' },
        });
        const dayKey = `telemetry/daily-${entry.timestamp.slice(0, 10)}.json`;
        await env.MEDIA_BUCKET.put(dayKey, JSON.stringify(next.slice(0, 50)), {
          httpMetadata: { contentType: 'application/json' },
        });
      } catch {
        // Keep memory fallback
      }
    }
    return jsonResponse({ ok: true, id: entry.id });
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/' || path === '/health' || path === '/api/health') {
      return jsonResponse({
        ok: true,
        service: 'fluentbridge-api',
        version: '8.4.0',
        accentCount: 49,
        supportedLanguages: ['en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh', 'ar', 'nl', 'af', 'sv'],
        endpoints: ['/api/health', '/api/tts', '/api/stt', '/api/gemini-tutor', '/api/media/list', '/api/media/*', '/api/telemetry'],
        rateLimits: {
          ttsPerMin: 120,
          sttPerMin: 30,
          geminiTutorPerMin: 30,
          dailyQuotas: { stt: 200, geminiTutor: 250 },
        },
        hasAiBinding: Boolean(env.AI),
        hasGeminiSecret: Boolean(env.GEMINI_API_KEY),
        hasR2Bucket: Boolean(env.MEDIA_BUCKET),
        jwtMode: env.REQUIRE_SUPABASE_JWT === 'true' ? 'strict' : 'hybrid',
      });
    }

    if (path === '/api/tts') {
      const rl = checkRateLimit(request, 'tts', 120);
      if (!rl.allowed) {
        return jsonResponse(
          { ok: false, error: 'Rate limit exceeded for /api/tts', retryAfterSec: rl.resetSec },
          429,
          {
            'Retry-After': String(rl.resetSec),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rl.resetSec),
          },
        );
      }
      return handleTtsRequest(request, env, ctx);
    }

    if (path === '/api/stt') {
      const auth = await verifySupabaseJwt(request, env);
      if (env.REQUIRE_SUPABASE_JWT === 'true' && !auth.authenticated) {
        return jsonResponse({ ok: false, error: 'Authentication required' }, 401);
      }
      const rl = checkRateLimit(request, 'stt', auth.authenticated ? 60 : 30, auth.userId);
      if (!rl.allowed) {
        return jsonResponse(
          { ok: false, error: 'Rate limit exceeded for /api/stt', retryAfterSec: rl.resetSec },
          429,
          {
            'Retry-After': String(rl.resetSec),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rl.resetSec),
          },
        );
      }
      const dq = await checkPersistentDailyQuota(env, request, 'stt', 200, auth.userId);
      if (!dq.allowed) {
        return jsonResponse({ ok: false, error: 'Daily STT quota exceeded' }, 429);
      }
      return handleSttRequest(request, env);
    }

    if (path === '/api/gemini-tutor') {
      const auth = await verifySupabaseJwt(request, env);
      if (env.REQUIRE_SUPABASE_JWT === 'true' && !auth.authenticated) {
        return jsonResponse({ ok: false, error: 'Authentication required' }, 401);
      }
      const rl = checkRateLimit(request, 'gemini', auth.authenticated ? 60 : 30, auth.userId);
      if (!rl.allowed) {
        return jsonResponse(
          { ok: false, error: 'Rate limit exceeded for /api/gemini-tutor', retryAfterSec: rl.resetSec },
          429,
          {
            'Retry-After': String(rl.resetSec),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rl.resetSec),
          },
        );
      }
      const dq = await checkPersistentDailyQuota(env, request, 'gemini', 250, auth.userId);
      if (!dq.allowed) {
        return jsonResponse({ ok: false, error: 'Daily AI Tutor quota exceeded' }, 429);
      }
      return handleGeminiTutorRequest(request, env);
    }

    if (path.startsWith('/api/media/')) {
      return handleMediaRequest(request, env, path);
    }

    if (path === '/api/telemetry') {
      const rl = checkRateLimit(request, 'telemetry', 20);
      if (!rl.allowed) {
        return jsonResponse({ ok: false, error: 'Rate limit exceeded for /api/telemetry' }, 429);
      }
      return handleTelemetryRequest(request, env);
    }

    return jsonResponse({ error: 'Not found' }, 404);
  },
};

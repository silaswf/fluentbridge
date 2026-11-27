/**
 * @file cloudflare-worker/worker.js
 * @description Ponto de entrada do Cloudflare Worker (Edge API): roteia /api/health, /api/tts, /api/stt, /api/gemini-tutor, /api/translate, /api/youtube-study, /api/media/*, /api/billing/*, /api/telemetry e /api/admin/quotas com rate limit, verificação JWT e telemetria de latência.
 * @exports default
 */
import { CORS_HEADERS, jsonResponse } from './lib/http.js';
import { checkPersistentDailyQuota, recordRouteLatency } from './lib/quotas.js';
import { handleAdminQuotasRequest } from './routes/adminQuotas.js';
import { handleBillingRequest } from './routes/billing.js';
import { handleGeminiTutorRequest } from './routes/gemini.js';
import { handleMediaRequest } from './routes/media.js';
import { handleSttRequest } from './routes/stt.js';
import { handleTranslateRequest } from './routes/translate.js';
import { handleTtsRequest } from './routes/tts.js';
import { handleYouTubeStudyRequest } from './routes/youtubeStudy.js';

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

async function withLatencyMetric(routeKey, fn) {
  const startedAt = Date.now();
  try {
    return await fn();
  } finally {
    recordRouteLatency(routeKey, Date.now() - startedAt);
  }
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
        version: '11.6.0',
        accentCount: 65,
        supportedLanguages: ['en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh', 'ar', 'nl', 'af', 'sv', 'tr', 'he', 'nb', 'da', 'pt'],
        endpoints: ['/api/health', '/api/tts', '/api/stt', '/api/gemini-tutor', '/api/translate', '/api/youtube-study', '/api/media/list', '/api/media/*', '/api/billing/plans', '/api/billing/checkout', '/api/billing/webhook', '/api/telemetry', '/api/admin/quotas'],
        billingEnabled: env.BILLING_ENABLED === 'true',
        rateLimits: {
          ttsPerMin: 120,
          sttPerMin: 30,
          geminiTutorPerMin: 30,
          translatePerMin: 40,
          youtubePerMin: 20,
          dailyQuotas: { stt: 200, geminiTutor: 250, translate: 300, youtube: 100 },
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
          { 'Retry-After': String(rl.resetSec), 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': String(rl.resetSec) },
        );
      }
      return withLatencyMetric('tts', () => handleTtsRequest(request, env, ctx));
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
          { 'Retry-After': String(rl.resetSec), 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': String(rl.resetSec) },
        );
      }
      const dq = await checkPersistentDailyQuota(env, request, 'stt', 200, auth.userId);
      if (!dq.allowed) {
        return jsonResponse({ ok: false, error: 'Daily STT quota exceeded' }, 429);
      }
      return withLatencyMetric('stt', () => handleSttRequest(request, env));
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
          { 'Retry-After': String(rl.resetSec), 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': String(rl.resetSec) },
        );
      }
      const dq = await checkPersistentDailyQuota(env, request, 'gemini', 250, auth.userId);
      if (!dq.allowed) {
        return jsonResponse({ ok: false, error: 'Daily AI Tutor quota exceeded' }, 429);
      }
      return withLatencyMetric('gemini', () => handleGeminiTutorRequest(request, env));
    }

    if (path === '/api/translate') {
      const auth = await verifySupabaseJwt(request, env);
      if (env.REQUIRE_SUPABASE_JWT === 'true' && !auth.authenticated) {
        return jsonResponse({ ok: false, error: 'Authentication required' }, 401);
      }
      const rl = checkRateLimit(request, 'translate', 40, auth.userId);
      if (!rl.allowed) {
        return jsonResponse({ ok: false, error: 'Rate limit exceeded for /api/translate' }, 429);
      }
      const dq = await checkPersistentDailyQuota(env, request, 'translate', 300, auth.userId);
      if (!dq.allowed) {
        return jsonResponse({ ok: false, error: 'Daily translator quota exceeded' }, 429);
      }
      return withLatencyMetric('translate', () => handleTranslateRequest(request, env));
    }

    if (path === '/api/youtube-study') {
      const auth = await verifySupabaseJwt(request, env);
      if (env.REQUIRE_SUPABASE_JWT === 'true' && !auth.authenticated) {
        return jsonResponse({ ok: false, error: 'Authentication required' }, 401);
      }
      const rl = checkRateLimit(request, 'youtube', 20, auth.userId);
      if (!rl.allowed) {
        return jsonResponse({ ok: false, error: 'Rate limit exceeded for /api/youtube-study' }, 429);
      }
      const dq = await checkPersistentDailyQuota(env, request, 'youtube', 100, auth.userId);
      if (!dq.allowed) {
        return jsonResponse({ ok: false, error: 'Daily YouTube study quota exceeded' }, 429);
      }
      return withLatencyMetric('youtube', () => handleYouTubeStudyRequest(request, env));
    }

    if (path.startsWith('/api/media/')) {
      return handleMediaRequest(request, env, path, { verifySupabaseJwt });
    }

    if (path.startsWith('/api/billing/')) {
      const limit = path === '/api/billing/webhook' ? 60 : 30;
      const rl = checkRateLimit(request, 'billing', limit);
      if (!rl.allowed) {
        return jsonResponse({ ok: false, error: 'Rate limit exceeded for /api/billing/*' }, 429);
      }
      return handleBillingRequest(request, env, path, { verifySupabaseJwt });
    }

    if (path === '/api/admin/quotas') {
      const rl = checkRateLimit(request, 'admin-quotas', 30);
      if (!rl.allowed) {
        return jsonResponse({ ok: false, error: 'Rate limit exceeded for /api/admin/quotas' }, 429);
      }
      return handleAdminQuotasRequest(request, env, { verifySupabaseJwt });
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

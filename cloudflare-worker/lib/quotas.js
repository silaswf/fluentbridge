export const DAILY_QUOTA_LIMITS = {
  stt: { limit: 200, label: 'Transcrição Whisper STT', endpoint: '/api/stt' },
  gemini: { limit: 250, label: 'Tutor IA & Corretor Gemini', endpoint: '/api/gemini-tutor' },
  translate: { limit: 300, label: 'Tradutor Bidirecional', endpoint: '/api/translate' },
  youtube: { limit: 100, label: 'YouTube Study Lab', endpoint: '/api/youtube-study' },
};

export async function checkPersistentDailyQuota(env, request, routeKey, dailyLimit, userId = null) {
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

async function sumRouteDayQuota(bucket, day, routeKey) {
  let total = 0;
  let actors = 0;
  try {
    const listed = await bucket.list({ prefix: `quotas/${day}/${routeKey}/`, limit: 100 });
    const objs = listed?.objects || [];
    actors = objs.length;
    const counts = await Promise.all(
      objs.map(async (obj) => {
        try {
          const item = await bucket.get(obj.key);
          if (!item) return 0;
          const parsed = await item.json();
          return Number(parsed?.count || 0);
        } catch {
          return 0;
        }
      }),
    );
    for (const c of counts) total += c;
  } catch {
    // Keep 0 on R2 read error
  }
  return { total, actors };
}

export async function getDailyQuotasSnapshot(env, days = 7) {
  const safeDays = Math.min(14, Math.max(1, Number(days) || 7));
  const now = Date.now();
  const dateList = Array.from({ length: safeDays }, (_, i) =>
    new Date(now - i * 86400000).toISOString().slice(0, 10),
  );
  const today = dateList[0];

  if (!env.MEDIA_BUCKET) {
    return {
      ok: true,
      date: today,
      days: safeDays,
      r2Connected: false,
      routes: Object.entries(DAILY_QUOTA_LIMITS).map(([key, meta]) => ({
        key,
        label: meta.label,
        endpoint: meta.endpoint,
        usedToday: 0,
        limitPerActor: meta.limit,
        activeActorsToday: 0,
        sevenDayTotal: 0,
      })),
      generatedAt: new Date().toISOString(),
    };
  }

  const routes = await Promise.all(
    Object.entries(DAILY_QUOTA_LIMITS).map(async ([key, meta]) => {
      const perDay = await Promise.all(
        dateList.map((d) => sumRouteDayQuota(env.MEDIA_BUCKET, d, key)),
      );
      const todayStat = perDay[0] || { total: 0, actors: 0 };
      const sevenDayTotal = perDay.reduce((acc, item) => acc + item.total, 0);
      return {
        key,
        label: meta.label,
        endpoint: meta.endpoint,
        usedToday: todayStat.total,
        limitPerActor: meta.limit,
        activeActorsToday: todayStat.actors,
        sevenDayTotal,
      };
    }),
  );

  return {
    ok: true,
    date: today,
    days: safeDays,
    r2Connected: true,
    routes,
    generatedAt: new Date().toISOString(),
  };
}

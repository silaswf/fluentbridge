/**
 * @file cloudflare-worker/routes/adminQuotas.js
 * @description Rota GET /api/admin/quotas do Worker: retorna consumo diário, acumulado de 7 dias e latência média/p95 por rota para o painel Admin.
 * @exports handleAdminQuotasRequest
 */
import { jsonResponse } from '../lib/http.js';
import { getDailyQuotasSnapshot } from '../lib/quotas.js';

export async function handleAdminQuotasRequest(request, env, { verifySupabaseJwt }) {
  if (request.method !== 'GET') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
  }

  if (env.REQUIRE_SUPABASE_JWT === 'true') {
    const auth = await verifySupabaseJwt(request, env);
    if (!auth.authenticated) {
      return jsonResponse(
        { ok: false, error: 'Authentication required for admin quotas' },
        401,
      );
    }
  }

  const url = new URL(request.url);
  const daysParam = Number(url.searchParams.get('days') || '7');
  const snapshot = await getDailyQuotasSnapshot(env, daysParam);
  return jsonResponse(snapshot);
}

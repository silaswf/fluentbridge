/**
 * @file cloudflare-worker/routes/billing.js
 * @description Rotas de preparação do motor de planos e assinaturas (/api/billing/plans, /api/billing/checkout, /api/billing/webhook), operando em modo 100% gratuito enquanto BILLING_ENABLED != 'true'.
 * @exports handleBillingRequest
 */
import { jsonResponse } from '../lib/http.js';

const PLAN_CATALOG = [
  { id: 'free', name: 'Acesso Livre (Gratuito)', active: true },
  { id: 'school_grant', name: 'Bolsa Escola / Aluno Vinculado', active: true },
  { id: 'student_pro', name: 'Aluno Autônomo Pro', active: false },
  { id: 'student_vip', name: 'Mentoria VIP', active: false },
  { id: 'school_b2b', name: 'Escola Parceira (B2B)', active: false },
];

async function verifyStripeHmac(rawBody, sigHeader, secret) {
  if (!sigHeader || !secret) return false;
  const parts = Object.fromEntries(
    sigHeader.split(',').map((kv) => {
      const [k, v] = kv.trim().split('=');
      return [k, v];
    }),
  );
  if (!parts.t || !parts.v1) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${parts.t}.${rawBody}`),
  );
  const expectedHex = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return expectedHex === parts.v1;
}

export async function handleBillingRequest(request, env, path, { verifySupabaseJwt }) {
  const billingEnabled = env.BILLING_ENABLED === 'true';
  const hasStripe = Boolean(env.STRIPE_SECRET_KEY);
  const hasMercadoPago = Boolean(env.MERCADOPAGO_ACCESS_TOKEN);

  if (path === '/api/billing/plans') {
    if (request.method !== 'GET') {
      return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
    }
    return jsonResponse({
      ok: true,
      billingEnabled,
      mode: billingEnabled ? 'active' : 'free',
      providers: {
        stripe: hasStripe,
        mercadopago: hasMercadoPago,
      },
      plans: PLAN_CATALOG.map((p) => ({
        ...p,
        active: billingEnabled ? true : p.id === 'free' || p.id === 'school_grant',
      })),
    });
  }

  if (path === '/api/billing/checkout') {
    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
    }
    if (!billingEnabled) {
      return jsonResponse({
        ok: true,
        billingEnabled: false,
        mode: 'free',
        message: 'Cobrança desativada — acesso 100% gratuito por tempo indeterminado.',
      });
    }

    const auth = await verifySupabaseJwt(request, env);
    if (env.REQUIRE_SUPABASE_JWT === 'true' && !auth.authenticated) {
      return jsonResponse({ ok: false, error: 'Authentication required for checkout' }, 401);
    }

    let body = {};
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: 'Invalid JSON payload' }, 400);
    }

    const planId = String(body.planId || 'student_pro');
    const validPlan = PLAN_CATALOG.some((p) => p.id === planId);
    if (!validPlan) {
      return jsonResponse({ ok: false, error: 'Unknown planId' }, 400);
    }

    if (!hasStripe && !hasMercadoPago) {
      return jsonResponse(
        {
          ok: false,
          billingEnabled: true,
          mode: 'active',
          error: 'Configure STRIPE_SECRET_KEY ou MERCADOPAGO_ACCESS_TOKEN nos secrets do Worker.',
        },
        503,
      );
    }

    return jsonResponse({
      ok: true,
      billingEnabled: true,
      mode: 'active',
      planId,
      provider: hasStripe ? 'stripe' : 'mercadopago',
      message: 'Sessão de checkout pronta para integração com o provedor configurado.',
    });
  }

  if (path === '/api/billing/webhook') {
    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
    }
    const rawBody = await request.text();
    const stripeSig = request.headers.get('stripe-signature');
    if (stripeSig && env.STRIPE_WEBHOOK_SECRET) {
      const valid = await verifyStripeHmac(rawBody, stripeSig, env.STRIPE_WEBHOOK_SECRET);
      if (!valid) {
        return jsonResponse({ ok: false, error: 'Invalid Stripe webhook signature' }, 401);
      }
    }

    let parsed = {};
    try {
      parsed = JSON.parse(rawBody || '{}');
    } catch {
      return jsonResponse({ ok: false, error: 'Invalid webhook JSON' }, 400);
    }

    const eventId = String(parsed.id || `evt-${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const day = new Date().toISOString().slice(0, 10);
    if (env.MEDIA_BUCKET) {
      try {
        await env.MEDIA_BUCKET.put(
          `billing/events/${day}/${eventId}.json`,
          JSON.stringify({
            id: eventId,
            provider: stripeSig ? 'stripe' : 'mercadopago',
            type: parsed.type || parsed.action || 'unknown',
            billingEnabled,
            receivedAt: new Date().toISOString(),
          }),
          { httpMetadata: { contentType: 'application/json' } },
        );
      } catch {
        // Ignore R2 write failure on webhook log
      }
    }

    return jsonResponse({ ok: true, received: true, id: eventId, billingEnabled });
  }

  return jsonResponse({ ok: false, error: 'Unknown billing endpoint' }, 404);
}

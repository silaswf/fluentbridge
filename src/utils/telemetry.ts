/**
 * @file src/utils/telemetry.ts
 * @description Captura global de erros de cliente, envio para /api/telemetry, health checks sintéticos e consulta de cotas R2 (/api/admin/quotas).
 * @exports TelemetryErrorLog, SyntheticHealthResult, reportClientError, installGlobalErrorListeners, fetchTelemetryLogs, runSyntheticHealthChecks, AdminQuotaRouteStat, AdminQuotaSnapshot (+1)
 */
import { APP_VERSION, DEFAULT_BACKEND_API_URL } from '../config/appConfig';
import { getActivePlatformLabel } from './appUpdater';
import { enqueueOfflineMutation } from './offlineOutbox';

export interface TelemetryErrorLog {
  id: string;
  message: string;
  stack?: string;
  route?: string;
  version: string;
  platform: string;
  timestamp: string;
}

export interface SyntheticHealthResult {
  name: string;
  ok: boolean;
  status: number;
  latencyMs: number;
  detail: string;
}

let listenersInstalled = false;

export async function reportClientError(
  error: unknown,
  route = '/',
): Promise<void> {
  if (typeof fetch === 'undefined') return;
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Unexpected client error';
  const stack = error instanceof Error ? error.stack || '' : '';
  const apiBase = DEFAULT_BACKEND_API_URL.replace(/\/+$/, '');
  if (!apiBase) return;

  const payload = {
    message: msg.slice(0, 300),
    stack: stack.slice(0, 800),
    route: route.slice(0, 120),
    version: APP_VERSION,
    platform: getActivePlatformLabel(),
  };

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    await enqueueOfflineMutation('telemetry', payload);
    return;
  }

  try {
    const res = await fetch(`${apiBase}/api/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      await enqueueOfflineMutation('telemetry', payload);
    }
    const sentryDsn = (
      import.meta as unknown as { env?: Record<string, string | undefined> }
    ).env?.VITE_SENTRY_DSN;
    if (sentryDsn && typeof sentryDsn === 'string' && sentryDsn.startsWith('https://')) {
      try {
        const parsed = new URL(sentryDsn);
        const projectId = parsed.pathname.replace(/^\/+/, '');
        const publicKey = parsed.username;
        if (projectId && publicKey) {
          const envelopeUrl = `${parsed.protocol}//${parsed.host}/api/${projectId}/envelope/?sentry_key=${publicKey}&sentry_version=7`;
          const event = {
            event_id: crypto.randomUUID?.().replace(/-/g, '') || `${Date.now()}`,
            timestamp: Date.now() / 1000,
            platform: 'javascript',
            release: `fluentbridge@${APP_VERSION}`,
            exception: { values: [{ type: 'ClientError', value: payload.message }] },
            tags: { route: payload.route, appPlatform: payload.platform },
          };
          const envelope = `${JSON.stringify({ event_id: event.event_id, sent_at: new Date().toISOString() })}\n${JSON.stringify({ type: 'event' })}\n${JSON.stringify(event)}`;
          void fetch(envelopeUrl, { method: 'POST', body: envelope }).catch(() => {});
        }
      } catch {
        // Ignore invalid optional VITE_SENTRY_DSN
      }
    }
  } catch {
    await enqueueOfflineMutation('telemetry', payload);
  }
}

export function installGlobalErrorListeners(): void {
  if (typeof window === 'undefined' || listenersInstalled) return;
  listenersInstalled = true;

  window.addEventListener('error', (event) => {
    if (!event.error && !event.message) return;
    void reportClientError(event.error ?? event.message, window.location.pathname);
  });

  window.addEventListener('unhandledrejection', (event) => {
    void reportClientError(event.reason, window.location.pathname);
  });
}

export async function fetchTelemetryLogs(): Promise<TelemetryErrorLog[]> {
  if (typeof fetch === 'undefined') return [];
  const apiBase = DEFAULT_BACKEND_API_URL.replace(/\/+$/, '');
  if (!apiBase) return [];
  try {
    const res = await fetch(`${apiBase}/api/telemetry`);
    if (!res.ok) return [];
    const data = (await res.json()) as { ok?: boolean; logs?: TelemetryErrorLog[] };
    return Array.isArray(data.logs) ? data.logs : [];
  } catch {
    return [];
  }
}

export async function runSyntheticHealthChecks(): Promise<SyntheticHealthResult[]> {
  if (typeof fetch === 'undefined') return [];
  const apiBase = DEFAULT_BACKEND_API_URL.replace(/\/+$/, '');
  const checks = [
    {
      name: 'Manifesto Web (version.json)',
      url: '/version.json',
      parseDetail: async (res: Response) => {
        const j = (await res.json()) as { version?: string };
        return `v${j.version ?? '?'}`;
      },
    },
    {
      name: 'Cloudflare Worker (/api/health)',
      url: `${apiBase}/api/health`,
      parseDetail: async (res: Response) => {
        const j = (await res.json()) as { version?: string; jwtMode?: string };
        return `v${j.version ?? '?'} · jwt=${j.jwtMode ?? 'hybrid'}`;
      },
    },
    {
      name: 'Vozes Neurais (/api/tts)',
      url: `${apiBase}/api/tts?lang=en-US&text=Health`,
      parseDetail: async (res: Response) =>
        `cache=${res.headers.get('X-TTS-Cache') ?? 'OK'}`,
    },
  ];

  const results: SyntheticHealthResult[] = [];
  for (const c of checks) {
    const started = Date.now();
    try {
      const res = await fetch(c.url);
      const latencyMs = Date.now() - started;
      const detail = res.ok ? await c.parseDetail(res) : `HTTP ${res.status}`;
      results.push({
        name: c.name,
        ok: res.ok,
        status: res.status,
        latencyMs,
        detail,
      });
    } catch (err) {
      results.push({
        name: c.name,
        ok: false,
        status: 0,
        latencyMs: Date.now() - started,
        detail: err instanceof Error ? err.message : 'Network error',
      });
    }
  }
  return results;
}

export interface AdminQuotaRouteStat {
  key: string;
  label: string;
  endpoint: string;
  usedToday: number;
  limitPerActor: number;
  activeActorsToday: number;
  sevenDayTotal: number;
}

export interface AdminQuotaSnapshot {
  ok: boolean;
  date: string;
  days: number;
  r2Connected: boolean;
  routes: AdminQuotaRouteStat[];
  generatedAt: string;
}

export async function fetchAdminQuotas(days = 7): Promise<AdminQuotaSnapshot | null> {
  if (typeof fetch === 'undefined') return null;
  const apiBase = DEFAULT_BACKEND_API_URL.replace(/\/+$/, '');
  if (!apiBase) return null;
  try {
    const res = await fetch(`${apiBase}/api/admin/quotas?days=${days}`);
    if (!res.ok) return null;
    const data = (await res.json()) as AdminQuotaSnapshot;
    return data?.ok && Array.isArray(data.routes) ? data : null;
  } catch {
    return null;
  }
}

import { APP_VERSION, DEFAULT_BACKEND_API_URL } from '../config/appConfig';
import { getActivePlatformLabel } from './appUpdater';

export interface TelemetryErrorLog {
  id: string;
  message: string;
  stack?: string;
  route?: string;
  version: string;
  platform: string;
  timestamp: string;
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

  try {
    await fetch(`${apiBase}/api/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: msg.slice(0, 300),
        stack: stack.slice(0, 800),
        route: route.slice(0, 120),
        version: APP_VERSION,
        platform: getActivePlatformLabel(),
      }),
    });
  } catch {
    // Telemetry is best-effort
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

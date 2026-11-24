import { Browser } from '@capacitor/browser';
import {
  ANDROID_APK_DOWNLOAD_URL,
  APP_VERSION,
  GITHUB_RELEASES_URL,
  WINDOWS_DOWNLOAD_URL,
} from '../config/appConfig';
import { isElectronDesktop, isNativeAndroid } from './platform';

export interface AppUpdateInfo {
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  releaseNotes: string;
  publishedAt: string;
  windowsUrl: string;
  androidUrl: string;
  releasePageUrl: string;
  checkedAt: string;
  error?: string;
}

export interface DesktopUpdaterBridge {
  isElectron?: boolean;
  downloadAndInstallUpdate?: (
    url: string,
    version: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  openExternal?: (url: string) => Promise<void>;
  onUpdateProgress?: (
    cb: (data: { percent: number; status: string }) => void,
  ) => () => void;
}

declare global {
  interface Window {
    fluentBridgeDesktop?: DesktopUpdaterBridge;
  }
}

export function compareVersions(a: string, b: string): number {
  const cleanA = a.replace(/^v/i, '').split('-')[0].split('.').map((n) => Number(n) || 0);
  const cleanB = b.replace(/^v/i, '').split('-')[0].split('.').map((n) => Number(n) || 0);
  const len = Math.max(cleanA.length, cleanB.length, 3);
  for (let i = 0; i < len; i++) {
    const va = cleanA[i] ?? 0;
    const vb = cleanB[i] ?? 0;
    if (va > vb) return 1;
    if (va < vb) return -1;
  }
  return 0;
}

export function getDesktopBridge(): DesktopUpdaterBridge | null {
  if (typeof window === 'undefined') return null;
  return window.fluentBridgeDesktop ?? null;
}

export async function checkForAppUpdate(): Promise<AppUpdateInfo> {
  const fallback: AppUpdateInfo = {
    currentVersion: APP_VERSION,
    latestVersion: APP_VERSION,
    hasUpdate: false,
    releaseNotes: '',
    publishedAt: '',
    windowsUrl: WINDOWS_DOWNLOAD_URL,
    androidUrl: ANDROID_APK_DOWNLOAD_URL,
    releasePageUrl: GITHUB_RELEASES_URL,
    checkedAt: new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  if (typeof fetch === 'undefined') return fallback;

  const controller =
    typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId =
    controller !== null
      ? globalThis.setTimeout(() => controller.abort(), 8000)
      : undefined;

  try {
    const res = await fetch(
      'https://api.github.com/repos/silaswf/fluentbridge/releases/latest',
      {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller?.signal,
      },
    );
    if (!res.ok) {
      return { ...fallback, error: `HTTP ${res.status} ao verificar versão.` };
    }
    const data = (await res.json()) as {
      tag_name?: string;
      body?: string;
      published_at?: string;
      html_url?: string;
      assets?: Array<{ name?: string; browser_download_url?: string }>;
    };

    const latestVersion = (data.tag_name ?? APP_VERSION).replace(/^v/i, '');
    const assets = Array.isArray(data.assets) ? data.assets : [];
    const winAsset = assets.find((a) =>
      (a.name ?? '').toLowerCase().endsWith('.exe'),
    );
    const apkAsset = assets.find((a) =>
      (a.name ?? '').toLowerCase().endsWith('.apk'),
    );

    return {
      currentVersion: APP_VERSION,
      latestVersion,
      hasUpdate: compareVersions(latestVersion, APP_VERSION) > 0,
      releaseNotes: (data.body ?? '').trim().slice(0, 600),
      publishedAt: data.published_at ? data.published_at.slice(0, 10) : '',
      windowsUrl: winAsset?.browser_download_url || WINDOWS_DOWNLOAD_URL,
      androidUrl: apkAsset?.browser_download_url || ANDROID_APK_DOWNLOAD_URL,
      releasePageUrl: data.html_url || GITHUB_RELEASES_URL,
      checkedAt: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  } catch {
    return {
      ...fallback,
      error: 'Sem conexão com o servidor de atualizações no momento.',
    };
  } finally {
    if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
  }
}

export async function triggerAndroidApkUpdate(apkUrl: string): Promise<void> {
  if (isNativeAndroid()) {
    await Browser.open({ url: apkUrl });
    return;
  }
  if (typeof window !== 'undefined') {
    window.open(apkUrl, '_blank', 'noopener,noreferrer');
  }
}

export async function applyWebOtaRefresh(): Promise<void> {
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.update()));
    } catch {
      // Ignore SW errors
    }
  }
  if (typeof caches !== 'undefined') {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch {
      // Ignore cache clear errors
    }
  }
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

export function getActivePlatformLabel(): 'Windows Desktop' | 'Android' | 'Web PWA' {
  if (isElectronDesktop()) return 'Windows Desktop';
  if (isNativeAndroid()) return 'Android';
  return 'Web PWA';
}

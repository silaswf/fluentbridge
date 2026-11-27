/**
 * @file src/utils/__tests__/appUpdater.test.ts
 * @description Suíte de testes unitários Vitest validando appUpdater.
 */
import { describe, expect, it, vi } from 'vitest';
import { checkForAppUpdate, compareVersions } from '../appUpdater';

describe('App Updater Engine (v6.1.0)', () => {
  it('compares semantic versions accurately', () => {
    expect(compareVersions('6.2.0', '6.1.0')).toBe(1);
    expect(compareVersions('v6.1.0', '6.1.0')).toBe(0);
    expect(compareVersions('6.0.9', '6.1.0')).toBe(-1);
    expect(compareVersions('7.0.0', '6.9.9')).toBe(1);
  });

  it('parses Cloudflare Pages version.json manifest and falls back gracefully offline', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          version: '99.0.0',
          releaseNotes: 'Correções e novidades',
          publishedAt: '2026-12-01',
          releasePageUrl: 'https://github.com/silaswf/fluentbridge/releases/tag/v99.0.0',
          windowsUrl: 'https://github.com/silaswf/fluentbridge/releases/download/v99.0.0/FluentBridge-Setup-99.0.0.exe',
          androidUrl: 'https://github.com/silaswf/fluentbridge/releases/download/v99.0.0/FluentBridge-v99.0.0.apk',
        }),
      }),
    );

    const res = await checkForAppUpdate();
    expect(res.hasUpdate).toBe(true);
    expect(res.latestVersion).toBe('99.0.0');
    expect(res.windowsUrl).toContain('FluentBridge-Setup-99.0.0.exe');
    expect(res.androidUrl).toContain('FluentBridge-v99.0.0.apk');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const offline = await checkForAppUpdate();
    expect(offline.hasUpdate).toBe(false);
    expect(offline.error).toBeTruthy();
    vi.unstubAllGlobals();
  });
});

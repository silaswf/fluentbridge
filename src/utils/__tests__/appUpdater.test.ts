import { describe, expect, it, vi } from 'vitest';
import { checkForAppUpdate, compareVersions } from '../appUpdater';

describe('App Updater Engine (v6.1.0)', () => {
  it('compares semantic versions accurately', () => {
    expect(compareVersions('6.2.0', '6.1.0')).toBe(1);
    expect(compareVersions('v6.1.0', '6.1.0')).toBe(0);
    expect(compareVersions('6.0.9', '6.1.0')).toBe(-1);
    expect(compareVersions('7.0.0', '6.9.9')).toBe(1);
  });

  it('parses latest GitHub Release assets and falls back gracefully offline', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          tag_name: 'v6.9.0',
          body: 'Correções e novidades',
          published_at: '2026-12-01T10:00:00Z',
          html_url: 'https://github.com/silaswf/fluentbridge/releases/tag/v6.9.0',
          assets: [
            {
              name: 'FluentBridge-Setup-6.9.0.exe',
              browser_download_url: 'https://github.com/silaswf/fluentbridge/releases/download/v6.9.0/FluentBridge-Setup-6.9.0.exe',
            },
            {
              name: 'FluentBridge-v6.9.0.apk',
              browser_download_url: 'https://github.com/silaswf/fluentbridge/releases/download/v6.9.0/FluentBridge-v6.9.0.apk',
            },
          ],
        }),
      }),
    );

    const res = await checkForAppUpdate();
    expect(res.hasUpdate).toBe(true);
    expect(res.latestVersion).toBe('6.9.0');
    expect(res.windowsUrl).toContain('FluentBridge-Setup-6.9.0.exe');
    expect(res.androidUrl).toContain('FluentBridge-v6.9.0.apk');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const offline = await checkForAppUpdate();
    expect(offline.hasUpdate).toBe(false);
    expect(offline.error).toBeTruthy();
    vi.unstubAllGlobals();
  });
});

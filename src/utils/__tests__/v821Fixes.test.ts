/**
 * @file src/utils/__tests__/v821Fixes.test.ts
 * @description Suíte de testes unitários Vitest validando v821Fixes.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadLanguageCourseData } from '../../data/courseLoader';
import { REGIONAL_ACCENTS_BY_LANGUAGE } from '../../data/regionalAccents';
import type { LanguageCode } from '../../types/learning';

vi.mock('../audioDb', () => ({
  getAudioClip: vi.fn(async () => null),
  saveAudioClip: vi.fn(async () => undefined),
}));

const LANGS: LanguageCode[] = [
  'en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh', 'ar', 'nl', 'af', 'sv', 'tr', 'he', 'nb', 'da',
];

describe('v8.2.1 — módulos da trilha sem repetição', () => {
  it('cada bloco da trilha tem título único e numeração sequencial 1..N em todos os 12 idiomas', async () => {
    for (const code of LANGS) {
      const { topics } = await loadLanguageCourseData(code);
      const groups: Array<{ level: string; title: string; units: number }> = [];
      for (const t of topics) {
        const title = t.moduleTitlePt ?? '';
        const last = groups[groups.length - 1];
        if (last && last.level === t.level && last.title === title) last.units += 1;
        else groups.push({ level: t.level, title, units: 1 });
      }
      const titles = groups.map((g) => `${g.level}::${g.title}`);
      expect(new Set(titles).size, `${code}: títulos de módulo repetidos`).toBe(titles.length);

      const numbers = groups.map((g) => Number(/^Módulo (\d+) ·/.exec(g.title)?.[1]));
      expect(numbers, `${code}: numeração deve ser 1..N`).toEqual(
        groups.map((_, i) => i + 1),
      );
      expect(new Set(topics.map((t) => t.id)).size).toBe(topics.length);
    }
  }, 120000);
});

describe('v8.2.1 — áudio: sotaques regionais e timeout', () => {
  const workerSrc =
    readFileSync(
      resolve(__dirname, '../../../cloudflare-worker/worker.js'),
      'utf8',
    ) +
    '\n' +
    readFileSync(
      resolve(__dirname, '../../../cloudflare-worker/routes/tts.js'),
      'utf8',
    );
  const BASE_DEFAULTS = new Set([
    'en-US', 'es-MX', 'fr-FR', 'it-IT', 'de-DE', 'ru-RU', 'ja-JP', 'zh-CN',
    'ar-SA', 'nl-NL', 'af-ZA', 'sv-SE', 'tr-TR', 'he-IL', 'nb-NO', 'da-DK', 'pt-BR',
  ]);

  it('o Worker tem configuração própria para TODOS os 65 sotaques (nenhum cai no padrão do idioma)', () => {
    const missing: string[] = [];
    for (const accents of Object.values(REGIONAL_ACCENTS_BY_LANGUAGE)) {
      for (const acc of accents) {
        if (BASE_DEFAULTS.has(acc.code)) continue;
        const lower = acc.code.toLowerCase();
        if (!workerSrc.includes(`'${lower}'`)) missing.push(acc.code);
      }
    }
    expect(missing).toEqual([]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('o cliente envia o código regional intacto ao Worker (en-AU, it-IT-NAP, ar-MA)', async () => {
    const { fetchNeuralTtsBlob } = await import('../speech');
    const urls: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        urls.push(url);
        return new Response(new Uint8Array(500), { status: 200 });
      }),
    );
    for (const loc of ['en-AU', 'it-IT-NAP', 'ar-MA', 'ja-FUK']) {
      await fetchNeuralTtsBlob(`Teste ${loc}`, loc);
    }
    const langs = urls.map((u) => new URL(u).searchParams.get('lang'));
    expect(langs).toEqual(['en-AU', 'it-IT-NAP', 'ar-MA', 'ja-FUK']);
  });

  it('o cliente aguarda a síntese longa de simulados (≥ 20 s) em vez de abortar aos 9 s', async () => {
    vi.useFakeTimers();
    const { fetchNeuralTtsBlob } = await import('../speech');
    const longText = 'Listening passage sentence for the exam. '.repeat(12).trim();
    let aborted = false;
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init?: RequestInit) =>
          new Promise<Response>((resolveFetch, reject) => {
            init?.signal?.addEventListener('abort', () => {
              aborted = true;
              reject(new DOMException('aborted', 'AbortError'));
            });
            setTimeout(
              () => resolveFetch(new Response(new Uint8Array(900), { status: 200 })),
              20000,
            );
          }),
      ),
    );
    const pending = fetchNeuralTtsBlob(`${longText} unique-${Date.now()}`, 'en-US');
    await vi.advanceTimersByTimeAsync(21000);
    const blob = await pending;
    expect(aborted).toBe(false);
    expect(blob?.size).toBe(900);
  });
});

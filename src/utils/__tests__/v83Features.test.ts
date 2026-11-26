import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { REGIONAL_ACCENTS_BY_LANGUAGE } from '../../data/regionalAccents';
import { resolvePreferredAccent } from '../accentPreference';
import {
  computeAdaptiveProfile,
  loadAdaptiveHistory,
  recordAdaptiveAttempt,
  saveAdaptiveOverride,
} from '../adaptiveDifficulty';
import {
  AMBIENT_INTENSITY_OPTIONS,
  setAmbientNoiseIntensity,
  startAmbientNoise,
  stopAmbientNoise,
} from '../ambientNoiseEngine';
import { getAllUiTranslationKeys, tUi } from '../i18n';
import {
  clearOfflineOutbox,
  enqueueOfflineMutation,
  flushProgressOutbox,
  listOutboxItems,
} from '../offlineOutbox';
import { analyzeWritingHybrid } from '../writingDiffGrader';

describe('v8.3.0 — Vozes Neurais Naturais (Worker + Cliente)', () => {
  const workerSrc = readFileSync(
    resolve(__dirname, '../../../cloudflare-worker/worker.js'),
    'utf8',
  );

  it('Worker usa tts/v6/, nunca grava google-tts-fallback no cache e eleva EN/ES para gemini-tts com fallback Deepgram', () => {
    expect(workerSrc).toContain('tts/v6/${locale}');
    expect(workerSrc).toContain('/v6/${encodeURIComponent(cfg.locale)}');
    expect(workerSrc).toContain("X-TTS-Fallback");
    expect(workerSrc).toContain('!isEmergencyFallback && cache');
    expect(workerSrc).toContain('!isEmergencyFallback && env.MEDIA_BUCKET');
    expect(workerSrc).toContain("fallbackModel: '@cf/deepgram/aura-2-en'");
    expect(workerSrc).toContain("fallbackModel: '@cf/deepgram/aura-2-es'");
    // Não deve mais haver engine: 'deepgram' primária
    expect(workerSrc).not.toContain("engine: 'deepgram'");
  });

  it('speech.ts usa tts-v6:, ignora cache de X-TTS-Fallback e expõe speakTextAsync', () => {
    const speechSrc = readFileSync(resolve(__dirname, '../speech.ts'), 'utf8');
    expect(speechSrc).toContain('tts-v6:');
    expect(speechSrc).toContain("X-TTS-Fallback");
    expect(speechSrc).toContain('export function speakTextAsync');
    expect(speechSrc).toContain('Gemini 2.5 Native TTS');
  });
});

describe('v8.3.0 — Itens Funcionais F-01 a F-07', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it('F-01: resolvePreferredAccent persiste qualquer dos 49 sotaques regionais', () => {
    const itNap = resolvePreferredAccent('it', { it: 'it-IT-NAP' }, 'en-US');
    expect(itNap.code).toBe('it-IT-NAP');
    const jaFuk = resolvePreferredAccent('ja', { ja: 'ja-FUK' }, 'en-US');
    expect(jaFuk.code).toBe('ja-FUK');
    expect(Object.values(REGIONAL_ACCENTS_BY_LANGUAGE).flat().length).toBe(49);
  });

  it('F-02: analyzeWritingHybrid aceita resposta alternativa correta via IA (>=80%) e cai no local quando offline', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        correctedText: 'I normally wake up around seven in the morning.',
                        score: 94,
                        cefrFeedbackPt: 'Resposta natural e gramaticalmente correta.',
                        suggestionsPt: ['Ótima escolha lexical ("around seven").'],
                        mistakeItems: [],
                      }),
                    },
                  ],
                },
              },
            ],
          }),
          { status: 200 },
        ),
      ),
    );

    const aiRes = await analyzeWritingHybrid(
      'I normally wake up around seven in the morning.',
      'I usually get up at 7 a.m. every day.',
      [],
      'en',
      'Descreva sua rotina matinal',
      'Rotina',
    );
    expect(aiRes.source).toBe('ai');
    expect(aiRes.score).toBeGreaterThanOrEqual(80);

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('Network down');
      }),
    );
    const localRes = await analyzeWritingHybrid(
      'I normally wake up around seven in the morning.',
      'I usually get up at 7 a.m. every day.',
      [],
      'en',
    );
    expect(localRes.source).toBe('local');
  });

  it('F-03: adaptiveDifficulty persiste tentativas e ativa autoShowHints após erros', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
        removeItem: (k: string) => store.delete(k),
        clear: () => store.clear(),
      },
    });
    recordAdaptiveAttempt('aluno-1', 'en', false);
    recordAdaptiveAttempt('aluno-1', 'en', false);
    const hist = loadAdaptiveHistory('aluno-1', 'en');
    expect(hist.recent).toEqual([false, false]);

    const profile = computeAdaptiveProfile(0, 2, 0, hist.manualOverride);
    expect(profile.mode).toBe('guided');
    expect(profile.autoShowHints).toBe(true);

    saveAdaptiveOverride('aluno-1', 'en', 'immersive');
    const hist2 = loadAdaptiveHistory('aluno-1', 'en');
    expect(hist2.manualOverride).toBe('immersive');
  });

  it('F-04: offlineOutbox enfileira e drena lesson_complete, srs_review e checkpoint', async () => {
    await clearOfflineOutbox();
    await enqueueOfflineMutation('lesson_complete', { topicId: 't1', xpEarned: 50 });
    await enqueueOfflineMutation('srs_review', { cardId: 'c1', rating: 3 });
    await enqueueOfflineMutation('checkpoint', { checkpointId: 'chk-1', scorePercent: 100 });

    const before = await listOutboxItems();
    expect(before.length).toBe(3);

    const syncedKinds: string[] = [];
    const res = await flushProgressOutbox({
      onTelemetry: async () => true,
      onSyncProgressBatch: async (items) => {
        syncedKinds.push(...items.map((i) => i.kind));
        return true;
      },
    });
    expect(res.flushed).toBe(3);
    expect(res.remaining).toBe(0);
    expect(syncedKinds).toEqual(['lesson_complete', 'srs_review', 'checkpoint']);
  });

  it('F-05: ambientNoiseEngine suporta 3 intensidades (Suave, Real, Desafio)', () => {
    expect(AMBIENT_INTENSITY_OPTIONS.map((o) => o.id)).toEqual([
      'soft',
      'real',
      'challenge',
    ]);
    expect(() => startAmbientNoise('cafe', 'soft')).not.toThrow();
    expect(() => setAmbientNoiseIntensity('challenge')).not.toThrow();
    expect(() => stopAmbientNoise()).not.toThrow();
  });

  it('F-06: deleteMyCloudAccount chama rpc("delete_my_account_data") e signOut em ordem', async () => {
    const calls: string[] = [];
    const fakeClient = {
      auth: {
        getSession: async () => ({ data: { session: { user: { id: 'u-1' } } } }),
        signOut: async () => {
          calls.push('signOut');
        },
      },
      rpc: async (fn: string) => {
        calls.push(`rpc:${fn}`);
        return { error: null };
      },
    };
    const { deleteMyCloudAccount } = await import('../cloudSync');
    const res = await deleteMyCloudAccount(
      {
        supabaseUrl: 'https://demo.supabase.co',
        supabaseAnonKey: 'anon-key-123456',
        geminiApiKey: '',
      },
      fakeClient as never,
    );
    expect(res).toEqual({ ok: true, cloudDeleted: true });
    expect(calls).toEqual(['rpc:delete_my_account_data', 'signOut']);
  });

  it('U-06: i18n tem paridade 100% de chaves entre pt, en e es', () => {
    const keys = getAllUiTranslationKeys();
    expect(keys.length).toBeGreaterThanOrEqual(45);
    for (const k of keys) {
      const pt = tUi('pt', k);
      const en = tUi('en', k);
      const es = tUi('es', k);
      expect(pt.trim().length, `pt missing ${k}`).toBeGreaterThan(0);
      expect(en.trim().length, `en missing ${k}`).toBeGreaterThan(0);
      expect(es.trim().length, `es missing ${k}`).toBeGreaterThan(0);
      expect(en, `en fell back to key ${k}`).not.toBe(k);
      expect(es, `es fell back to key ${k}`).not.toBe(k);
    }
  });
});

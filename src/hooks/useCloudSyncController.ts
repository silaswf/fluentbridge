/**
 * @file src/hooks/useCloudSyncController.ts
 * @description Arquivo estrutural src/hooks/useCloudSyncController.ts do FluentBridge Academy.
 * @exports useCloudSyncController
 */
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import {
  fetchCurrentSupabaseUser,
  mergePlatformStates,
  pullStateFromCloud,
  pushStateToCloud,
  syncRelationalTablesBestEffort,
  type SupabaseAuthUserInfo,
} from '../utils/cloudSync';
import type { PlatformState, VocabCard } from '../types/learning';
import { purgeExpiredSpeakingAudios } from '../utils/audioRetention';
import { syncRelationalFullState } from '../utils/relationalSync';
import { normalizePlatformState } from '../utils/storage';

interface UseCloudSyncControllerOptions {
  state: PlatformState;
  setState: Dispatch<SetStateAction<PlatformState>>;
  isCloudConfigured: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  defaultState: PlatformState;
  masterVocab: VocabCard[];
  onSupabaseUserHydrated: (authUser: SupabaseAuthUserInfo) => void;
}

export function useCloudSyncController({
  state,
  setState,
  isCloudConfigured,
  supabaseUrl,
  supabaseAnonKey,
  defaultState,
  masterVocab,
  onSupabaseUserHydrated,
}: UseCloudSyncControllerOptions) {
  const [autoSyncStatus, setAutoSyncStatus] = useState<{
    state: 'idle' | 'syncing' | 'synced' | 'error';
    message?: string;
    updatedAt?: string;
  }>({ state: 'idle' });

  const hasBootstrappedCloudRef = useRef(false);
  const skipNextCloudPushRef = useRef(false);
  const masterVocabRef = useRef(masterVocab);
  masterVocabRef.current = masterVocab;

  // Bootstrap from Supabase & hydrate Supabase OAuth / Auth user on startup
  useEffect(() => {
    if (!isCloudConfigured || hasBootstrappedCloudRef.current) return;
    hasBootstrappedCloudRef.current = true;

    let cancelled = false;
    void (async () => {
      const pullRes = await pullStateFromCloud(supabaseUrl, supabaseAnonKey);
      if (!cancelled && pullRes.ok && pullRes.state) {
        skipNextCloudPushRef.current = true;
        setState((prev) => {
          const merged = mergePlatformStates(prev, pullRes.state, 'remote');
          return normalizePlatformState(
            merged,
            defaultState,
            masterVocabRef.current,
          );
        });
        setAutoSyncStatus({
          state: 'synced',
          message: 'Dados sincronizados ao iniciar.',
          updatedAt: new Date().toISOString(),
        });
      }

      const authUser = await fetchCurrentSupabaseUser(state.cloudConfig);
      if (!cancelled && authUser?.email) {
        onSupabaseUserHydrated(authUser);
      }

      // Automatic 60-day audio retention check (throttled once per 24h)
      if (!cancelled && typeof window !== 'undefined') {
        const RETENTION_KEY = 'fluentbridge_last_audio_retention_run';
        const lastRun = Number(window.localStorage.getItem(RETENTION_KEY) || '0');
        const nowMs = Date.now();
        if (!Number.isFinite(lastRun) || nowMs - lastRun >= 24 * 60 * 60 * 1000) {
          window.localStorage.setItem(RETENTION_KEY, String(nowMs));
          const latestSubs =
            pullRes.ok && pullRes.state?.submissions
              ? pullRes.state.submissions
              : state.submissions;
          const res = await purgeExpiredSpeakingAudios(latestSubs, {
            supabaseUrl,
            supabaseAnonKey,
            geminiApiKey: state.cloudConfig.geminiApiKey,
          });
          if (!cancelled && res.purgedCount > 0) {
            setState((prev) => ({
              ...prev,
              submissions: prev.submissions.map((s) => {
                const updated = res.nextSubmissions.find((u) => u.id === s.id);
                return updated ?? s;
              }),
            }));
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isCloudConfigured, supabaseUrl, supabaseAnonKey]);

  // Background debounced sync to Supabase (JSONB + Phase 10 relational best-effort)
  useEffect(() => {
    if (!isCloudConfigured) return;
    if (skipNextCloudPushRef.current) {
      skipNextCloudPushRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      setAutoSyncStatus((prev) => ({ ...prev, state: 'syncing' }));
      void pushStateToCloud(state).then((res) => {
        if (res.ok) {
          void syncRelationalTablesBestEffort(state, supabaseUrl, supabaseAnonKey);
          void syncRelationalFullState(state, supabaseUrl, supabaseAnonKey);
          setAutoSyncStatus({
            state: 'synced',
            message: 'Sincronizado automaticamente com a nuvem.',
            updatedAt: res.syncedAt ?? new Date().toISOString(),
          });
        } else {
          setAutoSyncStatus({
            state: 'error',
            message: res.message,
          });
        }
      });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [state, isCloudConfigured, supabaseUrl, supabaseAnonKey]);

  return {
    autoSyncStatus,
    skipNextCloudPushRef,
  };
}

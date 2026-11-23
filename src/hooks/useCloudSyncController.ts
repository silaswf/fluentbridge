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
          return normalizePlatformState(merged, defaultState, masterVocab);
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

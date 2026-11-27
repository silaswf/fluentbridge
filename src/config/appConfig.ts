/**
 * @file src/config/appConfig.ts
 * @description Configurações centrais do app: versão atual, URLs de release, e-mail Admin Mestre, código docente padrão, endpoints de API e chaves efetivas Supabase/Gemini.
 * @exports APP_VERSION, GITHUB_RELEASES_URL, WINDOWS_DOWNLOAD_URL, ANDROID_APK_DOWNLOAD_URL, MASTER_ADMIN_EMAIL, DEFAULT_TEACHER_ACCESS_CODE, DEFAULT_BACKEND_API_URL, CLOUD_GEMINI_PROXY_TOKEN (+7)
 */
import type { CloudConfig } from '../types/learning';

export const APP_VERSION = '10.0.0';
export const GITHUB_RELEASES_URL =
  'https://github.com/silaswf/fluentbridge-releases/releases/latest';
export const WINDOWS_DOWNLOAD_URL =
  'https://github.com/silaswf/fluentbridge-releases/releases/download/v10.0.0/FluentBridge-Setup-10.0.0.exe';
export const ANDROID_APK_DOWNLOAD_URL =
  'https://github.com/silaswf/fluentbridge-releases/releases/download/v10.0.0/FluentBridge-v10.0.0.apk';

export const MASTER_ADMIN_EMAIL = 'silaswf@gmail.com';
export const DEFAULT_TEACHER_ACCESS_CODE = 'SILAS-PROF-2026';

function readViteEnv(key: string): string {
  try {
    const meta = import.meta as unknown as {
      env?: Record<string, string | undefined>;
    };
    return meta?.env?.[key]?.trim() ?? '';
  } catch {
    return '';
  }
}

/**
 * Chaves fixas embutidas no app (preenchidas via .env no build ou direto aqui).
 * Caso o usuário informe chaves próprias no Modo Professor, elas funcionam como fallback/override.
 */
export const DEFAULT_BACKEND_API_URL: string =
  readViteEnv('VITE_BACKEND_API_URL') ||
  'https://fluentbridge-api.silaswf.workers.dev';

/** Token simbólico quando a IA usa o proxy seguro no Cloudflare Worker */
export const CLOUD_GEMINI_PROXY_TOKEN = '__CLOUD_PROXY__';

export const DEFAULT_GEMINI_API_KEY: string =
  readViteEnv('VITE_DEFAULT_GEMINI_API_KEY') || '';

export const DEFAULT_SUPABASE_URL: string =
  readViteEnv('VITE_DEFAULT_SUPABASE_URL') ||
  'https://wyonvrrcdoikrspbpeis.supabase.co';

export const DEFAULT_SUPABASE_ANON_KEY: string =
  readViteEnv('VITE_DEFAULT_SUPABASE_ANON_KEY') ||
  'sb_publishable_IIRfAMcQTelBwQurVxGPgg_UZqUI3OJ';

export function isMasterAdminEmail(email?: string): boolean {
  return (email ?? '').trim().toLowerCase() === MASTER_ADMIN_EMAIL;
}

export function getEffectiveGeminiKey(customKey?: string): string {
  const custom = (customKey ?? '').trim();
  if (custom.length > 0) return custom;
  const localEnv = DEFAULT_GEMINI_API_KEY.trim();
  if (localEnv.length > 0) return localEnv;
  return CLOUD_GEMINI_PROXY_TOKEN;
}

export function hasEmbeddedGeminiKey(): boolean {
  return DEFAULT_BACKEND_API_URL.trim().length > 0 || DEFAULT_GEMINI_API_KEY.trim().length > 0;
}

export function getEffectiveSupabaseConfig(cloudConfig?: CloudConfig): {
  url: string;
  anonKey: string;
  source: 'custom' | 'embedded' | 'none';
} {
  const customUrl = (cloudConfig?.supabaseUrl ?? '').trim();
  const customKey = (cloudConfig?.supabaseAnonKey ?? '').trim();
  if (customUrl && customKey) {
    return { url: customUrl, anonKey: customKey, source: 'custom' };
  }
  if (DEFAULT_SUPABASE_URL.trim() && DEFAULT_SUPABASE_ANON_KEY.trim()) {
    return {
      url: DEFAULT_SUPABASE_URL.trim(),
      anonKey: DEFAULT_SUPABASE_ANON_KEY.trim(),
      source: 'embedded',
    };
  }
  return { url: customUrl, anonKey: customKey, source: 'none' };
}

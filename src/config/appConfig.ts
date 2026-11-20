import type { CloudConfig } from '../types/learning';

export const MASTER_ADMIN_EMAIL = 'silaswf@gmail.com';

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
export const DEFAULT_GEMINI_API_KEY: string =
  readViteEnv('VITE_DEFAULT_GEMINI_API_KEY') ||
  'AQ.Ab8RN6JyYi46qHxxkTLWu8RFjNTBhomZ_Pgg6QcAWpBUKdVUYw';

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
  return DEFAULT_GEMINI_API_KEY.trim();
}

export function hasEmbeddedGeminiKey(): boolean {
  return DEFAULT_GEMINI_API_KEY.trim().length > 0;
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

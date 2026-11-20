import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getEffectiveSupabaseConfig } from '../config/appConfig';
import type { CloudConfig, PlatformState, UserRole } from '../types/learning';

export const SUPABASE_SQL_SCHEMA = `-- Execute este SQL completo no SQL Editor do seu projeto Supabase
create table if not exists public.fb_school_state (
  school_slug text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.fb_school_state enable row level security;
drop policy if exists "Allow anon read write school state" on public.fb_school_state;
create policy "Allow anon read write school state"
  on public.fb_school_state for all using (true) with check (true);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null check (role in ('teacher', 'student')) default 'student',
  active_language text not null default 'en',
  dialect_by_language jsonb not null default '{"en":"en-US","es":"es-ES","fr":"fr-FR"}'::jsonb,
  avatar_color text not null default '#116DFF',
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  invite_code text unique not null,
  language_code text not null default 'en',
  level text not null check (level in ('A1','A2','B1','B2','C1')),
  schedule text not null default '',
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.class_members (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

create table if not exists public.student_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  language_code text not null default 'en',
  xp integer not null default 0,
  streak_days integer not null default 1,
  daily_goal_minutes integer not null default 15,
  today_minutes integer not null default 0,
  recommended_level text,
  completed_topic_ids text[] not null default '{}',
  skill_scores jsonb not null default '{"listening":45,"reading":45,"speaking":40,"writing":45}'::jsonb,
  vocab_state jsonb not null default '[]'::jsonb,
  daily_quests jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, language_code)
);

create table if not exists public.custom_topics (
  id text primary key,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  language_code text not null default 'en',
  level text not null check (level in ('A1','A2','B1','B2','C1')),
  topic_payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id text primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid references public.classes(id) on delete set null,
  language_code text not null default 'en',
  type text not null check (type in ('writing','speaking')),
  topic_id text not null,
  topic_title text not null,
  prompt_pt text not null,
  response_text text not null default '',
  audio_path text,
  audio_duration_sec integer,
  target_sentence text,
  auto_pronunciation_score integer,
  status text not null check (status in ('pending','reviewed')) default 'pending',
  teacher_feedback text,
  corrected_text text,
  teacher_badge text,
  pronunciation_rubric jsonb,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.certificates (
  id text primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  language_code text not null default 'en',
  level text not null check (level in ('A1','A2','B1','B2','C1')),
  verification_code text unique not null,
  issued_by text not null,
  avg_score integer not null,
  total_hours integer not null,
  skill_scores jsonb not null,
  issued_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.student_progress enable row level security;
alter table public.custom_topics enable row level security;
alter table public.submissions enable row level security;
alter table public.certificates enable row level security;

create or replace function public.is_teacher()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher');
$$;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles for select using (id = auth.uid() or public.is_teacher());
drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert" on public.profiles for insert with check (id = auth.uid());
drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles for update using (id = auth.uid());

drop policy if exists "classes_read_all_auth" on public.classes;
create policy "classes_read_all_auth" on public.classes for select using (auth.uid() is not null);
drop policy if exists "classes_teacher_manage" on public.classes;
create policy "classes_teacher_manage" on public.classes for all using (teacher_id = auth.uid() and public.is_teacher()) with check (teacher_id = auth.uid() and public.is_teacher());

drop policy if exists "class_members_read" on public.class_members;
create policy "class_members_read" on public.class_members for select using (student_id = auth.uid() or public.is_teacher());
drop policy if exists "class_members_insert_self" on public.class_members;
create policy "class_members_insert_self" on public.class_members for insert with check (student_id = auth.uid() or public.is_teacher());

drop policy if exists "progress_self_rw" on public.student_progress;
create policy "progress_self_rw" on public.student_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "progress_teacher_read" on public.student_progress;
create policy "progress_teacher_read" on public.student_progress for select using (public.is_teacher());

drop policy if exists "topics_read_all" on public.custom_topics;
create policy "topics_read_all" on public.custom_topics for select using (auth.uid() is not null);
drop policy if exists "topics_teacher_write" on public.custom_topics;
create policy "topics_teacher_write" on public.custom_topics for all using (teacher_id = auth.uid() and public.is_teacher()) with check (teacher_id = auth.uid() and public.is_teacher());

drop policy if exists "submissions_student_rw" on public.submissions;
create policy "submissions_student_rw" on public.submissions for select using (student_id = auth.uid() or public.is_teacher());
drop policy if exists "submissions_student_insert" on public.submissions;
create policy "submissions_student_insert" on public.submissions for insert with check (student_id = auth.uid());
drop policy if exists "submissions_teacher_grade" on public.submissions;
create policy "submissions_teacher_grade" on public.submissions for update using (public.is_teacher());

drop policy if exists "certificates_read" on public.certificates;
create policy "certificates_read" on public.certificates for select using (student_id = auth.uid() or public.is_teacher());
drop policy if exists "certificates_insert" on public.certificates;
create policy "certificates_insert" on public.certificates for insert with check (student_id = auth.uid() or public.is_teacher());

insert into storage.buckets (id, name, public) values ('speaking-audios', 'speaking-audios', false) on conflict (id) do nothing;
drop policy if exists "speaking_audio_upload_own" on storage.objects;
create policy "speaking_audio_upload_own" on storage.objects for insert to authenticated with check (bucket_id = 'speaking-audios' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "speaking_audio_read_own_or_teacher" on storage.objects;
create policy "speaking_audio_read_own_or_teacher" on storage.objects for select to authenticated using (bucket_id = 'speaking-audios' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_teacher()));

grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
`;

const DEFAULT_SLUG = 'fluentbridge-main';

let cachedAuthClientKey = '';
let cachedAuthClient: SupabaseClient | null = null;

function buildClient(
  url: string,
  anonKey: string,
  persistSession = false,
): SupabaseClient {
  if (persistSession) {
    const cacheKey = `${url.trim()}::${anonKey.trim()}`;
    if (cachedAuthClient && cachedAuthClientKey === cacheKey) {
      return cachedAuthClient;
    }
    cachedAuthClient = createClient(url.trim(), anonKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    cachedAuthClientKey = cacheKey;
    return cachedAuthClient;
  }

  return createClient(url.trim(), anonKey.trim(), {
    auth: { persistSession: false },
  });
}

function resolveSupabaseCredentials(
  urlOrConfig?: string | CloudConfig,
  explicitAnonKey?: string,
) {
  if (typeof urlOrConfig === 'string') {
    return getEffectiveSupabaseConfig({
      supabaseUrl: urlOrConfig,
      supabaseAnonKey: explicitAnonKey ?? '',
      geminiApiKey: '',
    });
  }
  return getEffectiveSupabaseConfig(urlOrConfig);
}

function formatSupabaseError(prefix: string, error: { code?: string; message: string }): string {
  if (error.code === '42501' || error.message.toLowerCase().includes('permission denied')) {
    return `${prefix}: permissão negada (42501). Execute no SQL Editor do Supabase: GRANT USAGE ON SCHEMA public TO anon, authenticated; GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;`;
  }
  return `${prefix}: ${error.message}`;
}

export async function testSupabaseConnection(
  url?: string,
  anonKey?: string,
): Promise<{ ok: boolean; message: string }> {
  const cfg = resolveSupabaseCredentials(url, anonKey);
  if (!cfg.url || !cfg.anonKey) {
    return {
      ok: false,
      message: 'Informe a URL do projeto e a Anon Key do Supabase.',
    };
  }
  try {
    const client = buildClient(cfg.url, cfg.anonKey);
    const { error } = await client
      .from('fb_school_state')
      .select('school_slug, updated_at')
      .limit(1);

    if (error) {
      return {
        ok: false,
        message: formatSupabaseError(
          'Erro no Supabase (confirme o SQL/permissões)',
          error,
        ),
      };
    }
    return {
      ok: true,
      message:
        cfg.source === 'embedded'
          ? 'Conexão confirmada via chaves fixas do app! Tabela fb_school_state pronta.'
          : 'Conexão confirmada! Tabela fb_school_state pronta para sincronizar.',
    };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? `Falha de rede: ${err.message}`
          : 'Erro desconhecido ao conectar com o Supabase.',
    };
  }
}

export async function pushStateToCloud(
  state: PlatformState,
): Promise<{ ok: boolean; message: string; syncedAt?: string }> {
  const cfg = getEffectiveSupabaseConfig(state.cloudConfig);
  if (!cfg.url || !cfg.anonKey) {
    return {
      ok: false,
      message: 'Configure a URL e a Anon Key do Supabase antes de enviar.',
    };
  }

  try {
    const client = buildClient(cfg.url, cfg.anonKey);
    const nowIso = new Date().toISOString();
    // Avoid storing sensitive local API keys inside shared cloud JSON snapshot
    const sanitizedState: PlatformState = {
      ...state,
      cloudConfig: {
        ...state.cloudConfig,
        geminiApiKey: '',
        lastSyncedAt: nowIso,
      },
    };

    const { error } = await client.from('fb_school_state').upsert({
      school_slug: DEFAULT_SLUG,
      state: sanitizedState,
      updated_at: nowIso,
    });

    if (error) {
      return { ok: false, message: formatSupabaseError('Erro ao salvar na nuvem', error) };
    }
    return {
      ok: true,
      message: 'Dados da escola, turmas e alunos sincronizados com a nuvem!',
      syncedAt: nowIso,
    };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : 'Erro inesperado ao enviar para o Supabase.',
    };
  }
}

export async function pullStateFromCloud(
  url?: string,
  anonKey?: string,
): Promise<{ ok: boolean; message: string; state?: Partial<PlatformState> }> {
  const cfg = resolveSupabaseCredentials(url, anonKey);
  if (!cfg.url || !cfg.anonKey) {
    return {
      ok: false,
      message: 'Configure a URL e a Anon Key do Supabase antes de baixar.',
    };
  }

  try {
    const client = buildClient(cfg.url, cfg.anonKey);
    const { data, error } = await client
      .from('fb_school_state')
      .select('state, updated_at')
      .eq('school_slug', DEFAULT_SLUG)
      .maybeSingle();

    if (error) {
      return { ok: false, message: formatSupabaseError('Erro ao baixar da nuvem', error) };
    }
    if (!data || !data.state) {
      return {
        ok: false,
        message: 'Nenhum snapshot encontrado na nuvem ainda. Clique em "Enviar para Nuvem" primeiro.',
      };
    }

    return {
      ok: true,
      message: 'Dados baixados da nuvem com sucesso!',
      state: data.state as Partial<PlatformState>,
    };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : 'Erro inesperado ao baixar do Supabase.',
    };
  }
}

export interface SupabaseAuthUserInfo {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
}

export async function signInWithSupabaseEmail(
  email: string,
  password: string,
  cloudConfig?: CloudConfig,
): Promise<{ ok: boolean; user?: SupabaseAuthUserInfo; error?: string }> {
  const cfg = getEffectiveSupabaseConfig(cloudConfig);
  if (!cfg.url || !cfg.anonKey) {
    return { ok: false, error: 'Supabase não configurado.' };
  }
  try {
    const client = buildClient(cfg.url, cfg.anonKey, true);
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error || !data.user?.email) {
      return {
        ok: false,
        error: error?.message ?? 'Falha ao autenticar no Supabase.',
      };
    }
    const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
    return {
      ok: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name:
          typeof meta.full_name === 'string' && meta.full_name.trim()
            ? meta.full_name
            : data.user.email.split('@')[0],
        role: meta.role === 'teacher' ? 'teacher' : 'student',
      },
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Erro ao conectar ao Supabase Auth.',
    };
  }
}

export async function signUpWithSupabaseEmail(
  payload: { name: string; email: string; password: string; role: UserRole },
  cloudConfig?: CloudConfig,
): Promise<{
  ok: boolean;
  needsEmailConfirmation?: boolean;
  user?: SupabaseAuthUserInfo;
  error?: string;
}> {
  const cfg = getEffectiveSupabaseConfig(cloudConfig);
  if (!cfg.url || !cfg.anonKey) {
    return { ok: false, error: 'Supabase não configurado.' };
  }
  try {
    const client = buildClient(cfg.url, cfg.anonKey, true);
    const { data, error } = await client.auth.signUp({
      email: payload.email.trim(),
      password: payload.password,
      options: {
        data: {
          full_name: payload.name.trim(),
          role: payload.role,
        },
      },
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return {
      ok: true,
      needsEmailConfirmation: !data.session,
      user: data.user?.email
        ? {
            id: data.user.id,
            email: data.user.email,
            name: payload.name.trim(),
            role: payload.role,
          }
        : undefined,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Erro ao cadastrar no Supabase Auth.',
    };
  }
}

export async function signInWithSupabaseGoogle(
  cloudConfig?: CloudConfig,
): Promise<{ ok: boolean; error?: string }> {
  const cfg = getEffectiveSupabaseConfig(cloudConfig);
  if (!cfg.url || !cfg.anonKey) {
    return { ok: false, error: 'Supabase não configurado.' };
  }
  try {
    const client = buildClient(cfg.url, cfg.anonKey, true);
    const redirectTo =
      typeof window !== 'undefined' && window.location.protocol.startsWith('http')
        ? window.location.origin
        : undefined;
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: redirectTo ? { redirectTo } : undefined,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Falha ao abrir login Google.',
    };
  }
}

export async function fetchCurrentSupabaseUser(
  cloudConfig?: CloudConfig,
): Promise<SupabaseAuthUserInfo | null> {
  const cfg = getEffectiveSupabaseConfig(cloudConfig);
  if (!cfg.url || !cfg.anonKey) return null;
  try {
    const client = buildClient(cfg.url, cfg.anonKey, true);
    const { data, error } = await client.auth.getUser();
    if (error || !data.user?.email) return null;
    const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
    return {
      id: data.user.id,
      email: data.user.email,
      name:
        typeof meta.full_name === 'string' && meta.full_name.trim()
          ? meta.full_name
          : typeof meta.name === 'string' && meta.name.trim()
            ? meta.name
            : data.user.email.split('@')[0],
      role: meta.role === 'teacher' ? 'teacher' : 'student',
    };
  } catch {
    return null;
  }
}

export async function signOutSupabase(cloudConfig?: CloudConfig): Promise<void> {
  const cfg = getEffectiveSupabaseConfig(cloudConfig);
  if (!cfg.url || !cfg.anonKey) return;
  try {
    const client = buildClient(cfg.url, cfg.anonKey, true);
    await client.auth.signOut();
  } catch {
    // Ignore sign-out errors offline
  }
}

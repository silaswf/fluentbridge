import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getEffectiveSupabaseConfig } from '../config/appConfig';
import type {
  ClassGroup,
  CloudConfig,
  PlatformState,
  StudentSubmission,
  Topic,
  UserProfile,
  UserRole,
  VocabCard,
} from '../types/learning';
import { blobToDataUrl } from './audioDb';

export const NATIVE_OAUTH_REDIRECT_URL = 'com.fluentbridge.app://auth-callback';

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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  assigned_role text;
begin
  assigned_role := case
    when lower(coalesce(new.email, '')) = 'silaswf@gmail.com' then 'teacher'
    when coalesce(new.raw_user_meta_data->>'role', '') = 'teacher' then 'teacher'
    else 'student'
  end;

  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      split_part(coalesce(new.email, 'aluno'), '@', 1)
    ),
    coalesce(new.email, ''),
    assigned_role
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        role = case
          when lower(excluded.email) = 'silaswf@gmail.com' then 'teacher'
          else public.profiles.role
        end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
`;

const DEFAULT_SLUG = 'fluentbridge-main';

let cachedClientKey = '';
let cachedClient: SupabaseClient | null = null;

function getSupabaseClient(url: string, anonKey: string): SupabaseClient {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();
  const cacheKey = `${cleanUrl}::${cleanKey}`;
  if (cachedClient && cachedClientKey === cacheKey) {
    return cachedClient;
  }
  cachedClient = createClient(cleanUrl, cleanKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  cachedClientKey = cacheKey;
  return cachedClient;
}

function mapSupabaseUserToInfo(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}): SupabaseAuthUserInfo | null {
  if (!user.email) return null;
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email,
    name:
      typeof meta.full_name === 'string' && meta.full_name.trim()
        ? meta.full_name
        : typeof meta.name === 'string' && meta.name.trim()
          ? meta.name
          : user.email.split('@')[0],
    role: meta.role === 'teacher' ? 'teacher' : 'student',
  };
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
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
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

const STRENGTH_RANK: Record<VocabCard['strength'], number> = {
  weak: 0,
  medium: 1,
  mastered: 2,
};

function mergeVocabCards(
  primary: VocabCard[] | undefined,
  secondary: VocabCard[] | undefined,
): VocabCard[] {
  const map = new Map<string, VocabCard>();
  for (const card of secondary ?? []) {
    map.set(card.id, card);
  }
  for (const card of primary ?? []) {
    const other = map.get(card.id);
    if (!other) {
      map.set(card.id, card);
      continue;
    }
    const usePrimaryStrength =
      STRENGTH_RANK[card.strength] >= STRENGTH_RANK[other.strength];
    map.set(card.id, {
      ...card,
      strength: usePrimaryStrength ? card.strength : other.strength,
      reviewCount: Math.max(card.reviewCount ?? 0, other.reviewCount ?? 0),
    });
  }
  return Array.from(map.values());
}

function mergeUserProfiles(
  localUser: UserProfile,
  remoteUser: UserProfile,
  preferSide: 'local' | 'remote',
): UserProfile {
  const primary = preferSide === 'local' ? localUser : remoteUser;
  const secondary = preferSide === 'local' ? remoteUser : localUser;

  const completedTopicIds = Array.from(
    new Set([
      ...(localUser.completedTopicIds ?? []),
      ...(remoteUser.completedTopicIds ?? []),
    ]),
  );

  const certMap = new Map<string, (typeof localUser.issuedCertificates)[number]>();
  for (const cert of [...(secondary.issuedCertificates ?? []), ...(primary.issuedCertificates ?? [])]) {
    const key = `${cert.languageCode ?? 'en'}:${cert.level}`;
    if (!certMap.has(key)) certMap.set(key, cert);
  }

  const claimedQuestIds = Array.from(
    new Set([
      ...(localUser.dailyQuests?.claimedQuestIds ?? []),
      ...(remoteUser.dailyQuests?.claimedQuestIds ?? []),
    ]),
  );

  return {
    ...secondary,
    ...primary,
    password: primary.password || secondary.password,
    completedTopicIds,
    xp: Math.max(localUser.xp ?? 0, remoteUser.xp ?? 0),
    streakDays: Math.max(localUser.streakDays ?? 1, remoteUser.streakDays ?? 1),
    todayMinutes: Math.max(localUser.todayMinutes ?? 0, remoteUser.todayMinutes ?? 0),
    skillScores: {
      listening: Math.max(
        localUser.skillScores?.listening ?? 45,
        remoteUser.skillScores?.listening ?? 45,
      ),
      reading: Math.max(
        localUser.skillScores?.reading ?? 45,
        remoteUser.skillScores?.reading ?? 45,
      ),
      speaking: Math.max(
        localUser.skillScores?.speaking ?? 40,
        remoteUser.skillScores?.speaking ?? 40,
      ),
      writing: Math.max(
        localUser.skillScores?.writing ?? 45,
        remoteUser.skillScores?.writing ?? 45,
      ),
    },
    vocab: mergeVocabCards(primary.vocab, secondary.vocab),
    issuedCertificates: Array.from(certMap.values()),
    dailyQuests: {
      lessonsCompletedToday: Math.max(
        localUser.dailyQuests?.lessonsCompletedToday ?? 0,
        remoteUser.dailyQuests?.lessonsCompletedToday ?? 0,
      ),
      vocabReviewedToday: Math.max(
        localUser.dailyQuests?.vocabReviewedToday ?? 0,
        remoteUser.dailyQuests?.vocabReviewedToday ?? 0,
      ),
      tutorSessionsToday: Math.max(
        localUser.dailyQuests?.tutorSessionsToday ?? 0,
        remoteUser.dailyQuests?.tutorSessionsToday ?? 0,
      ),
      claimedQuestIds,
    },
  };
}

function mergeSubmissions(
  localSubs: StudentSubmission[],
  remoteSubs: StudentSubmission[],
  preferSide: 'local' | 'remote',
): StudentSubmission[] {
  const ordered =
    preferSide === 'local'
      ? [...remoteSubs, ...localSubs]
      : [...localSubs, ...remoteSubs];
  const map = new Map<string, StudentSubmission>();

  for (const sub of ordered) {
    const existing = map.get(sub.id);
    if (!existing) {
      map.set(sub.id, sub);
      continue;
    }
    const existingReviewed = existing.status === 'reviewed';
    const nextReviewed = sub.status === 'reviewed';
    const winningReview =
      existingReviewed && !nextReviewed ? existing : sub;

    map.set(sub.id, {
      ...existing,
      ...sub,
      status: existingReviewed || nextReviewed ? 'reviewed' : 'pending',
      teacherFeedback: winningReview.teacherFeedback ?? existing.teacherFeedback ?? sub.teacherFeedback,
      correctedText: winningReview.correctedText ?? existing.correctedText ?? sub.correctedText,
      teacherBadge: winningReview.teacherBadge ?? existing.teacherBadge ?? sub.teacherBadge,
      pronunciationRubric:
        winningReview.pronunciationRubric ??
        existing.pronunciationRubric ??
        sub.pronunciationRubric,
      audioId: sub.audioId ?? existing.audioId,
      audioPath: sub.audioPath ?? existing.audioPath,
      audioDataUrl: sub.audioDataUrl ?? existing.audioDataUrl,
      audioDurationSec: sub.audioDurationSec ?? existing.audioDurationSec,
    });
  }

  return Array.from(map.values());
}

/**
 * Mescla granularmente dois snapshots (local vs nuvem) sem sobrescrever alunos,
 * progresso, envios de áudio/escrita ou correções feitas em outros dispositivos.
 */
export function mergePlatformStates(
  local: PlatformState,
  remote: Partial<PlatformState> | undefined,
  preferSide: 'local' | 'remote' = 'local',
): PlatformState {
  if (!remote) return local;

  const deletedUserIds = new Set<string>([
    ...(local.deletedUserIds ?? []),
    ...(Array.isArray(remote.deletedUserIds) ? remote.deletedUserIds : []),
  ]);
  const deletedClassIds = new Set<string>([
    ...(local.deletedClassIds ?? []),
    ...(Array.isArray(remote.deletedClassIds) ? remote.deletedClassIds : []),
  ]);
  const deletedTopicIds = new Set<string>([
    ...(local.deletedTopicIds ?? []),
    ...(Array.isArray(remote.deletedTopicIds) ? remote.deletedTopicIds : []),
  ]);

  // Users by email (preserve master admin even if somehow listed)
  const localUsers = local.users ?? [];
  const remoteUsers = Array.isArray(remote.users) ? remote.users : [];
  const userByEmail = new Map<string, UserProfile>();

  const seedFirst = preferSide === 'local' ? remoteUsers : localUsers;
  const seedSecond = preferSide === 'local' ? localUsers : remoteUsers;

  for (const u of seedFirst) {
    if (!u?.email) continue;
    if (deletedUserIds.has(u.id) && !u.isMasterAdmin) continue;
    userByEmail.set(u.email.toLowerCase(), u);
  }
  for (const u of seedSecond) {
    if (!u?.email) continue;
    if (deletedUserIds.has(u.id) && !u.isMasterAdmin) continue;
    const key = u.email.toLowerCase();
    const other = userByEmail.get(key);
    if (!other) {
      userByEmail.set(key, u);
    } else {
      const merged =
        preferSide === 'local'
          ? mergeUserProfiles(u, other, 'local')
          : mergeUserProfiles(other, u, 'remote');
      userByEmail.set(key, merged);
    }
  }

  // Classes by id
  const classMap = new Map<string, ClassGroup>();
  const remoteClasses = Array.isArray(remote.classes) ? remote.classes : [];
  const orderedClasses =
    preferSide === 'local'
      ? [...remoteClasses, ...(local.classes ?? [])]
      : [...(local.classes ?? []), ...remoteClasses];
  for (const c of orderedClasses) {
    if (!c?.id || deletedClassIds.has(c.id)) continue;
    classMap.set(c.id, c);
  }

  // Custom topics by id
  const topicMap = new Map<string, Topic>();
  const remoteTopics = Array.isArray(remote.customTopics) ? remote.customTopics : [];
  const orderedTopics =
    preferSide === 'local'
      ? [...remoteTopics, ...(local.customTopics ?? [])]
      : [...(local.customTopics ?? []), ...remoteTopics];
  for (const t of orderedTopics) {
    if (!t?.id || deletedTopicIds.has(t.id)) continue;
    topicMap.set(t.id, t);
  }

  // Submissions by id
  const remoteSubs = Array.isArray(remote.submissions) ? remote.submissions : [];
  const mergedSubs = mergeSubmissions(local.submissions ?? [], remoteSubs, preferSide);

  return {
    schoolName:
      preferSide === 'remote' && remote.schoolName
        ? remote.schoolName
        : local.schoolName,
    teacherName:
      preferSide === 'remote' && remote.teacherName
        ? remote.teacherName
        : local.teacherName,
    currentUserId: local.currentUserId,
    classes: Array.from(classMap.values()),
    users: Array.from(userByEmail.values()),
    customTopics: Array.from(topicMap.values()),
    submissions: mergedSubs,
    deletedUserIds: Array.from(deletedUserIds),
    deletedClassIds: Array.from(deletedClassIds),
    deletedTopicIds: Array.from(deletedTopicIds),
    cloudConfig: {
      ...(remote.cloudConfig ?? {}),
      ...local.cloudConfig,
      supabaseUrl: local.cloudConfig.supabaseUrl,
      supabaseAnonKey: local.cloudConfig.supabaseAnonKey,
      geminiApiKey: local.cloudConfig.geminiApiKey,
    },
  };
}

export async function uploadSpeakingAudioToCloud(
  blob: Blob,
  submissionId: string,
  cloudConfig?: CloudConfig,
): Promise<{ audioPath?: string; audioDataUrl?: string }> {
  const cfg = getEffectiveSupabaseConfig(cloudConfig);
  const ext = blob.type.includes('mp4')
    ? 'm4a'
    : blob.type.includes('ogg')
      ? 'ogg'
      : 'webm';
  const objectPath = `speaking/${submissionId}.${ext}`;

  if (cfg.url && cfg.anonKey) {
    try {
      const client = getSupabaseClient(cfg.url, cfg.anonKey);
      const { error } = await client.storage
        .from('fb-audio')
        .upload(objectPath, blob, {
          upsert: true,
          contentType: blob.type || 'audio/webm',
        });
      if (!error) {
        return { audioPath: objectPath };
      }
    } catch {
      // Fallback below to compact Data URL
    }
  }

  // Fallback sem configuração adicional: embute áudio compacto (< 450 KB) para tocar no PC do professor
  if (blob.size <= 450_000) {
    try {
      const dataUrl = await blobToDataUrl(blob);
      return { audioDataUrl: dataUrl };
    } catch {
      // Ignore conversion error
    }
  }

  return {};
}

export function resolveSubmissionAudioUrl(
  submission: StudentSubmission,
  cloudConfig?: CloudConfig,
): string | null {
  if (submission.audioPath) {
    const cfg = getEffectiveSupabaseConfig(cloudConfig);
    if (cfg.url && cfg.anonKey) {
      try {
        const client = getSupabaseClient(cfg.url, cfg.anonKey);
        const { data } = client.storage
          .from('fb-audio')
          .getPublicUrl(submission.audioPath);
        if (data?.publicUrl) return data.publicUrl;
      } catch {
        // Fallback to inline Data URL
      }
    }
  }
  if (submission.audioDataUrl) {
    return submission.audioDataUrl;
  }
  return null;
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
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
    const nowIso = new Date().toISOString();

    // Mescla estado remoto antes de gravar para preservar envios/alunos de outros dispositivos
    let stateToSave: PlatformState = state;
    try {
      const { data: existingRow } = await client
        .from('fb_school_state')
        .select('state')
        .eq('school_slug', DEFAULT_SLUG)
        .maybeSingle();
      if (existingRow?.state) {
        stateToSave = mergePlatformStates(
          state,
          existingRow.state as Partial<PlatformState>,
          'local',
        );
      }
    } catch {
      // Proceed with local snapshot if pre-fetch fails
    }

    // Never persist client Gemini keys inside shared cloud JSON snapshot
    const sanitizedState: PlatformState = {
      ...stateToSave,
      currentUserId: null,
      cloudConfig: {
        ...stateToSave.cloudConfig,
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
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
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
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
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
    const info = mapSupabaseUserToInfo(data.user);
    return info ? { ok: true, user: info } : { ok: false, error: 'Usuário sem e-mail.' };
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
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
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
    const client = getSupabaseClient(cfg.url, cfg.anonKey);

    if (Capacitor.isNativePlatform()) {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: NATIVE_OAUTH_REDIRECT_URL,
          skipBrowserRedirect: true,
        },
      });
      if (error || !data?.url) {
        return {
          ok: false,
          error: error?.message ?? 'Não foi possível gerar URL de login Google.',
        };
      }
      await Browser.open({ url: data.url, windowName: '_self' });
      return { ok: true };
    }

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

export async function handleNativeOAuthCallbackUrl(
  callbackUrl: string,
  cloudConfig?: CloudConfig,
): Promise<SupabaseAuthUserInfo | null> {
  if (!callbackUrl || !callbackUrl.startsWith(NATIVE_OAUTH_REDIRECT_URL)) {
    return null;
  }

  try {
    await Browser.close();
  } catch {
    // Chrome Custom Tabs may already be closed
  }

  const cfg = getEffectiveSupabaseConfig(cloudConfig);
  if (!cfg.url || !cfg.anonKey) return null;

  try {
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
    const parsed = new URL(callbackUrl);
    const hashParams = new URLSearchParams(
      parsed.hash.startsWith('#') ? parsed.hash.slice(1) : parsed.hash,
    );
    const queryParams = parsed.searchParams;

    const accessToken =
      hashParams.get('access_token') ?? queryParams.get('access_token');
    const refreshToken =
      hashParams.get('refresh_token') ?? queryParams.get('refresh_token');
    const authCode = queryParams.get('code') ?? hashParams.get('code');

    if (accessToken && refreshToken) {
      await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } else if (authCode) {
      await client.auth.exchangeCodeForSession(authCode);
    }

    return await fetchCurrentSupabaseUser(cloudConfig);
  } catch {
    return null;
  }
}

export function registerNativeOAuthListener(
  cloudConfig: CloudConfig | undefined,
  onUser: (user: SupabaseAuthUserInfo) => void,
): () => void {
  if (!Capacitor.isNativePlatform()) {
    return () => {};
  }

  let disposed = false;
  let listenerHandle: { remove: () => Promise<void> } | null = null;

  const processUrl = async (incomingUrl?: string | null) => {
    if (!incomingUrl || disposed) return;
    const authUser = await handleNativeOAuthCallbackUrl(incomingUrl, cloudConfig);
    if (!disposed && authUser) {
      onUser(authUser);
    }
  };

  void CapApp.getLaunchUrl()
    .then((res) => processUrl(res?.url))
    .catch(() => {});

  void CapApp.addListener('appUrlOpen', ({ url }) => {
    void processUrl(url);
  }).then((handle) => {
    if (disposed) {
      void handle.remove();
    } else {
      listenerHandle = handle;
    }
  });

  return () => {
    disposed = true;
    if (listenerHandle) {
      void listenerHandle.remove();
    }
  };
}

export async function fetchCurrentSupabaseUser(
  cloudConfig?: CloudConfig,
): Promise<SupabaseAuthUserInfo | null> {
  const cfg = getEffectiveSupabaseConfig(cloudConfig);
  if (!cfg.url || !cfg.anonKey) return null;
  try {
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
    const { data: sessionData } = await client.auth.getSession();
    if (sessionData.session?.user) {
      return mapSupabaseUserToInfo(sessionData.session.user);
    }
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) return null;
    return mapSupabaseUserToInfo(data.user);
  } catch {
    return null;
  }
}

export function subscribeSupabaseAuthChanges(
  cloudConfig: CloudConfig | undefined,
  onAuthenticated: (user: SupabaseAuthUserInfo, isSignInEvent: boolean) => void,
): () => void {
  const cfg = getEffectiveSupabaseConfig(cloudConfig);
  if (!cfg.url || !cfg.anonKey) return () => {};

  const client = getSupabaseClient(cfg.url, cfg.anonKey);
  let disposed = false;

  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((event, session) => {
    if (disposed || !session?.user) return;
    if (
      event === 'INITIAL_SESSION' ||
      event === 'SIGNED_IN' ||
      event === 'TOKEN_REFRESHED' ||
      event === 'USER_UPDATED'
    ) {
      const info = mapSupabaseUserToInfo(session.user);
      if (info) {
        onAuthenticated(info, event === 'SIGNED_IN');
      }
    }
  });

  void client.auth
    .getSession()
    .then(({ data }) => {
      if (disposed || !data.session?.user) return;
      const info = mapSupabaseUserToInfo(data.session.user);
      if (info) {
        onAuthenticated(info, false);
      }
    })
    .catch(() => {});

  return () => {
    disposed = true;
    subscription.unsubscribe();
  };
}

export async function signOutSupabase(cloudConfig?: CloudConfig): Promise<void> {
  const cfg = getEffectiveSupabaseConfig(cloudConfig);
  if (!cfg.url || !cfg.anonKey) return;
  try {
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
    await client.auth.signOut();
  } catch {
    // Ignore sign-out errors offline
  }
}

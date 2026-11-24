-- ============================================================================
-- FluentBridge Production Database & Storage Schema (Supabase / PostgreSQL)
-- Execute este script completo no SQL Editor do seu projeto Supabase.
-- ============================================================================

-- 1. Tabela de Snapshot Rápido (usada pelo botão "Enviar/Baixar da Nuvem" no app)
create table if not exists public.fb_school_state (
  school_slug text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.fb_school_state enable row level security;

drop policy if exists "Allow anon read write school state" on public.fb_school_state;
create policy "Allow anon read write school state"
  on public.fb_school_state
  for all
  using (true)
  with check (true);

-- ============================================================================
-- 2. Tabelas Relacionais Completas (com Supabase Auth + RLS por Aluno/Professor)
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null check (role in ('teacher', 'student')) default 'student',
  active_language text not null default 'en' check (active_language in ('en','es','fr','it','de','ru','ja','zh')),
  dialect_by_language jsonb not null default '{"en":"en-US","es":"es-ES","fr":"fr-FR","it":"it-IT","de":"de-DE","ru":"ru-RU","ja":"ja-JP","zh":"zh-CN"}'::jsonb,
  assigned_teacher_id uuid references public.profiles(id) on delete set null,
  enrollment_type text not null default 'independent' check (enrollment_type in ('class','vip','independent')),
  teacher_invite_code text unique,
  unlinked_notice_pending boolean not null default false,
  unlinked_by_teacher_name text,
  blocked boolean not null default false,
  blocked_reason text,
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

-- ============================================================================
-- 3. Row Level Security (RLS) — Segurança em Produção
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.student_progress enable row level security;
alter table public.custom_topics enable row level security;
alter table public.submissions enable row level security;
alter table public.certificates enable row level security;

-- Helper: verifica se o usuário autenticado é professor
create or replace function public.is_teacher()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'teacher'
  );
$$;

-- PROFILES: usuário lê/edita o próprio perfil; professores veem alunos das suas turmas
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (id = auth.uid() or public.is_teacher());

drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert" on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (id = auth.uid());

-- CLASSES: qualquer autenticado lê (para validar código da turma); só professor gerencia
drop policy if exists "classes_read_all_auth" on public.classes;
create policy "classes_read_all_auth" on public.classes
  for select using (auth.uid() is not null);

drop policy if exists "classes_teacher_manage" on public.classes;
create policy "classes_teacher_manage" on public.classes
  for all using (teacher_id = auth.uid() and public.is_teacher())
  with check (teacher_id = auth.uid() and public.is_teacher());

-- CLASS_MEMBERS: aluno entra na turma; professor gerencia suas turmas
drop policy if exists "class_members_read" on public.class_members;
create policy "class_members_read" on public.class_members
  for select using (student_id = auth.uid() or public.is_teacher());

drop policy if exists "class_members_insert_self" on public.class_members;
create policy "class_members_insert_self" on public.class_members
  for insert with check (student_id = auth.uid() or public.is_teacher());

-- STUDENT_PROGRESS: aluno lê e grava o próprio progresso; professor lê
drop policy if exists "progress_self_rw" on public.student_progress;
create policy "progress_self_rw" on public.student_progress
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "progress_teacher_read" on public.student_progress;
create policy "progress_teacher_read" on public.student_progress
  for select using (public.is_teacher());

-- CUSTOM_TOPICS: todos autenticados leem; professores criam/editam os seus
drop policy if exists "topics_read_all" on public.custom_topics;
create policy "topics_read_all" on public.custom_topics
  for select using (auth.uid() is not null);

drop policy if exists "topics_teacher_write" on public.custom_topics;
create policy "topics_teacher_write" on public.custom_topics
  for all using (teacher_id = auth.uid() and public.is_teacher())
  with check (teacher_id = auth.uid() and public.is_teacher());

-- SUBMISSIONS: aluno envia e lê as suas; professor vê e corrige todas das suas turmas
drop policy if exists "submissions_student_rw" on public.submissions;
create policy "submissions_student_rw" on public.submissions
  for select using (student_id = auth.uid() or public.is_teacher());

drop policy if exists "submissions_student_insert" on public.submissions;
create policy "submissions_student_insert" on public.submissions
  for insert with check (student_id = auth.uid());

drop policy if exists "submissions_teacher_grade" on public.submissions;
create policy "submissions_teacher_grade" on public.submissions
  for update using (public.is_teacher());

-- CERTIFICATES: aluno vê seus certificados; professor emite
drop policy if exists "certificates_read" on public.certificates;
create policy "certificates_read" on public.certificates
  for select using (student_id = auth.uid() or public.is_teacher());

drop policy if exists "certificates_insert" on public.certificates;
create policy "certificates_insert" on public.certificates
  for insert with check (student_id = auth.uid() or public.is_teacher());

-- ============================================================================
-- 4. Storage Bucket para Áudios de Speaking (MP4 / WebM)
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('speaking-audios', 'speaking-audios', false)
on conflict (id) do nothing;

drop policy if exists "speaking_audio_upload_own" on storage.objects;
create policy "speaking_audio_upload_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'speaking-audios'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "speaking_audio_read_own_or_teacher" on storage.objects;
create policy "speaking_audio_read_own_or_teacher" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'speaking-audios'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_teacher()
    )
  );

-- ============================================================================
-- 5. Trigger automático: cria registro em public.profiles ao cadastrar usuário
--    e garante papel de professor/admin para silaswf@gmail.com
-- ============================================================================

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

-- ============================================================================
-- 6. Permissões explícitas para roles anon e authenticated (evita erro 42501)
-- ============================================================================

grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;

-- ============================================================================
-- 7. Migração Idempotente Fase 10 (5 Idiomas EN/ES/FR/IT/DE + Alunos VIP)
-- ============================================================================

alter table public.profiles add column if not exists assigned_teacher_id uuid references public.profiles(id) on delete set null;
alter table public.profiles add column if not exists enrollment_type text not null default 'independent';
alter table public.profiles add column if not exists teacher_invite_code text;
alter table public.profiles add column if not exists unlinked_notice_pending boolean not null default false;
alter table public.profiles add column if not exists unlinked_by_teacher_name text;
alter table public.profiles add column if not exists blocked boolean not null default false;
alter table public.profiles add column if not exists blocked_reason text;
alter table public.submissions add column if not exists teacher_id uuid references public.profiles(id) on delete set null;

create table if not exists public.assignments (
  id text primary key,
  teacher_id uuid references public.profiles(id) on delete set null,
  class_id uuid references public.classes(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  language_code text not null default 'en' check (language_code in ('en','es','fr','it','de')),
  topic_id text,
  title text not null,
  description text not null default '',
  due_date text not null,
  created_at timestamptz not null default now()
);
alter table public.assignments enable row level security;
drop policy if exists "assignments_select_all" on public.assignments;
create policy "assignments_select_all" on public.assignments for select to authenticated using (true);
drop policy if exists "assignments_teacher_manage" on public.assignments;
create policy "assignments_teacher_manage" on public.assignments for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

-- ============================================================================
-- 8. Migração v3.0.0: 8 Idiomas (RU/JA/ZH) & Autolimpeza de Áudios (60 dias)
-- ============================================================================

alter table public.profiles drop constraint if exists profiles_active_language_check;
alter table public.profiles
  add constraint profiles_active_language_check
  check (active_language in ('en','es','fr','it','de','ru','ja','zh'));

alter table public.assignments drop constraint if exists assignments_language_code_check;
alter table public.assignments
  add constraint assignments_language_code_check
  check (language_code in ('en','es','fr','it','de','ru','ja','zh'));

alter table public.submissions add column if not exists audio_archived boolean not null default false;
alter table public.submissions add column if not exists audio_expired_at timestamptz;

create or replace function public.cleanup_expired_speaking_audios(retention_days integer default 60)
returns integer
language plpgsql
security definer set search_path = public, storage
as $$
declare
  removed_count integer := 0;
begin
  -- Remove arquivos de áudio do bucket fb-audio mais antigos que retention_days
  delete from storage.objects
  where bucket_id = 'fb-audio'
    and created_at < (now() - make_interval(days => retention_days));

  get diagnostics removed_count = row_count;

  -- Marca envios Speaking expirados preservando 100% os feedbacks, notas e transcrições escritas
  update public.submissions
  set audio_path = null,
      audio_archived = true,
      audio_expired_at = now()
  where type = 'speaking'
    and coalesce(audio_archived, false) = false
    and audio_path is not null
    and created_at < (now() - make_interval(days => retention_days));

  return removed_count;
end;
$$;

-- Opcional (se pg_cron estiver habilitado no Supabase):
-- select cron.schedule('fb-cleanup-60d-audios', '0 3 * * *', $$select public.cleanup_expired_speaking_audios(60);$$);

-- ============================================================================
-- 9. Migração Definitiva de Segurança v4.0 (RLS Relacional Estrito)
-- ============================================================================

alter table public.student_progress add column if not exists recommended_level_by_language jsonb not null default '{}'::jsonb;
alter table public.student_progress add column if not exists topic_step_progress jsonb not null default '{}'::jsonb;
alter table public.student_progress add column if not exists learned_vocab_ids text[] not null default '{}';
alter table public.student_progress add column if not exists mistake_bank jsonb not null default '[]'::jsonb;

create or replace function public.is_master_admin()
returns boolean
language sql
security definer
stable
as $$
  select lower(coalesce(auth.jwt()->>'email', '')) = 'silaswf@gmail.com';
$$;

-- Helper: verifica se o professor autenticado é responsável pelo aluno (VIP ou Turma)
create or replace function public.teaches_student(target_student_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select public.is_master_admin()
  or exists (
    select 1 from public.profiles p
    where p.id = target_student_id and p.assigned_teacher_id = auth.uid()
  )
  or exists (
    select 1 from public.class_members cm
    join public.classes c on c.id = cm.class_id
    where cm.student_id = target_student_id and c.teacher_id = auth.uid()
  );
$$;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.teaches_student(id) or role = 'teacher');

drop policy if exists "progress_teacher_read" on public.student_progress;
create policy "progress_teacher_read" on public.student_progress
  for select to authenticated
  using (user_id = auth.uid() or public.teaches_student(user_id));

drop policy if exists "submissions_student_rw" on public.submissions;
create policy "submissions_student_rw" on public.submissions
  for select to authenticated
  using (student_id = auth.uid() or public.teaches_student(student_id));

drop policy if exists "submissions_teacher_grade" on public.submissions;
create policy "submissions_teacher_grade" on public.submissions
  for update to authenticated
  using (public.teaches_student(student_id))
  with check (public.teaches_student(student_id));

-- Quando todos os alunos estiverem autenticados via Supabase Auth, ative o bloqueio estrito abaixo:
-- drop policy if exists "Allow anon read write school state" on public.fb_school_state;
-- create policy "Authenticated read write school state" on public.fb_school_state
--   for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

-- ============================================================================
-- 10. Migração v5.0.0: 12 Idiomas (AR/NL/AF/SV), Simulados Oficiais & Comunidade
-- ============================================================================

alter table public.profiles drop constraint if exists profiles_active_language_check;
alter table public.profiles
  add constraint profiles_active_language_check
  check (active_language in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv'));

alter table public.assignments drop constraint if exists assignments_language_code_check;
alter table public.assignments
  add constraint assignments_language_code_check
  check (language_code in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv'));

alter table public.student_progress add column if not exists pronunciation_history jsonb not null default '[]'::jsonb;
alter table public.student_progress add column if not exists exam_attempts jsonb not null default '[]'::jsonb;

create table if not exists public.exam_attempts (
  id text primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  exam_id text not null,
  exam_type_id text not null,
  language_code text not null check (language_code in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv')),
  official_score_label text not null,
  raw_percent integer not null,
  passed boolean not null default false,
  section_scores jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);
alter table public.exam_attempts enable row level security;
drop policy if exists "exam_attempts_read" on public.exam_attempts;
create policy "exam_attempts_read" on public.exam_attempts
  for select to authenticated using (student_id = auth.uid() or public.teaches_student(student_id));
drop policy if exists "exam_attempts_insert" on public.exam_attempts;
create policy "exam_attempts_insert" on public.exam_attempts
  for insert to authenticated with check (student_id = auth.uid());

create table if not exists public.community_posts (
  id text primary key,
  language_code text not null check (language_code in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv')),
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  level text not null check (level in ('A1','A2','B1','B2','C1')),
  category text not null check (category in ('question','correction','culture','milestone')),
  title text not null,
  body text not null,
  target_snippet text,
  likes text[] not null default '{}',
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.community_posts enable row level security;
drop policy if exists "community_posts_select" on public.community_posts;
create policy "community_posts_select" on public.community_posts
  for select to authenticated using (true);
drop policy if exists "community_posts_insert" on public.community_posts;
create policy "community_posts_insert" on public.community_posts
  for insert to authenticated with check (auth.uid() is not null);
drop policy if exists "community_posts_delete" on public.community_posts;
create policy "community_posts_delete" on public.community_posts
  for delete to authenticated using (author_id = auth.uid() or public.is_teacher());

create table if not exists public.community_replies (
  id text primary key,
  post_id text not null references public.community_posts(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  content text not null,
  correction_suggestion text,
  likes text[] not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.community_replies enable row level security;
drop policy if exists "community_replies_select" on public.community_replies;
create policy "community_replies_select" on public.community_replies
  for select to authenticated using (true);
drop policy if exists "community_replies_insert" on public.community_replies;
create policy "community_replies_insert" on public.community_replies
  for insert to authenticated with check (auth.uid() is not null);

-- ============================================================================
-- 10. Migração v7.0.0: Aulas ao Vivo, Vocab SRS Relacional, Telemetria & Realtime
-- ============================================================================

alter table public.profiles add column if not exists learning_goal text;
alter table public.profiles add column if not exists goal_target_date text;

create table if not exists public.live_sessions (
  id text primary key,
  language_code text not null check (language_code in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv')),
  teacher_id uuid references public.profiles(id) on delete set null,
  teacher_name text not null,
  student_id uuid references public.profiles(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  title text not null,
  scheduled_at text not null,
  duration_min integer not null default 50,
  room_slug text not null,
  status text not null default 'scheduled' check (status in ('scheduled','live','completed','cancelled')),
  notes text not null default '',
  generated_assignment_id text,
  created_at timestamptz not null default now()
);
alter table public.live_sessions enable row level security;
drop policy if exists "live_sessions_read" on public.live_sessions;
create policy "live_sessions_read" on public.live_sessions
  for select to authenticated using (
    teacher_id = auth.uid() or student_id = auth.uid() or public.is_teacher()
  );
drop policy if exists "live_sessions_manage" on public.live_sessions;
create policy "live_sessions_manage" on public.live_sessions
  for all to authenticated using (
    teacher_id = auth.uid() or public.is_teacher()
  ) with check (
    teacher_id = auth.uid() or public.is_teacher()
  );

create table if not exists public.vocab_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  card_id text not null,
  language_code text not null check (language_code in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv')),
  strength text not null default 'weak',
  review_count integer not null default 0,
  next_review_at text,
  interval_days integer,
  ease_factor numeric,
  repetitions integer,
  lapses integer,
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);
alter table public.vocab_progress enable row level security;
drop policy if exists "vocab_progress_own" on public.vocab_progress;
create policy "vocab_progress_own" on public.vocab_progress
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table if not exists public.error_telemetry (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  message text not null,
  stack text,
  route text,
  version text,
  platform text,
  created_at timestamptz not null default now()
);
alter table public.error_telemetry enable row level security;
drop policy if exists "error_telemetry_insert" on public.error_telemetry;
create policy "error_telemetry_insert" on public.error_telemetry
  for insert to authenticated with check (true);
drop policy if exists "error_telemetry_teacher_read" on public.error_telemetry;
create policy "error_telemetry_teacher_read" on public.error_telemetry
  for select to authenticated using (public.is_teacher());

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.community_posts;
    exception when duplicate_object then null;
    end;
    begin
      alter publication supabase_realtime add table public.community_replies;
    exception when duplicate_object then null;
    end;
    begin
      alter publication supabase_realtime add table public.live_sessions;
    exception when duplicate_object then null;
    end;
  end if;
end $$;

-- ============================================================================
-- SEÇÃO 10 (v8.2.0): QUOTAS POR USUÁRIO, LGPD SELF-SERVICE & HARDENING RLS
-- ============================================================================
create table if not exists public.user_quotas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tts_requests_month integer not null default 0,
  stt_requests_month integer not null default 0,
  tutor_requests_month integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_quotas enable row level security;
drop policy if exists "user_quotas_owner_read" on public.user_quotas;
create policy "user_quotas_owner_read" on public.user_quotas
  for select to authenticated using (auth.uid() = user_id);

-- RPC de auto-exclusão LGPD (Art. 18 Lei 13.709/2018) respeitando auth.uid()
create or replace function public.delete_my_account_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Authentication required';
  end if;
  delete from public.submissions where student_id = uid;
  delete from public.student_progress where user_id = uid;
  delete from public.certificates where user_id = uid;
  delete from public.user_quotas where user_id = uid;
  delete from public.profiles where id = uid;
end;
$$;
revoke all on function public.delete_my_account_data() from public;
grant execute on function public.delete_my_account_data() to authenticated;

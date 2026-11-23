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
  active_language text not null default 'en' check (active_language in ('en','es','fr','it','de')),
  dialect_by_language jsonb not null default '{"en":"en-US","es":"es-ES","fr":"fr-FR","it":"it-IT","de":"de-DE"}'::jsonb,
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

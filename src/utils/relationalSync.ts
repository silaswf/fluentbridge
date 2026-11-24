import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getEffectiveSupabaseConfig } from '../config/appConfig';
import type {
  CloudConfig,
  CommunityPost,
  CommunityReply,
  LiveSessionRecord,
  PlatformState,
} from '../types/learning';
import { getSupabaseClient } from './cloudSync';

export interface SecurityAuditStatus {
  cloudConfigured: boolean;
  authenticated: boolean;
  userEmail?: string;
  userId?: string;
  relationalReady: boolean;
}

/**
 * Sincroniza progresso completo (profiles, student_progress com mistake_bank/topic_step_progress/learned_vocab_ids,
 * submissions e certificates) quando há sessão JWT ativa no Supabase Auth, sem quebrar o fallback offline/local.
 */
export async function syncRelationalFullState(
  state: PlatformState,
  supabaseUrl?: string,
  supabaseAnonKey?: string,
): Promise<{ ok: boolean; syncedTables: string[] }> {
  const cfg = getEffectiveSupabaseConfig({
    supabaseUrl: supabaseUrl ?? '',
    supabaseAnonKey: supabaseAnonKey ?? '',
    geminiApiKey: '',
  });
  if (!cfg.url || !cfg.anonKey) {
    return { ok: false, syncedTables: [] };
  }

  const syncedTables: string[] = [];
  try {
    const client: SupabaseClient = getSupabaseClient(cfg.url, cfg.anonKey);
    const { data: sessionData } = await client.auth.getSession();
    const authUser = sessionData.session?.user;
    if (!authUser?.id || !authUser.email) {
      return { ok: false, syncedTables: [] };
    }

    const localUser = state.users.find(
      (u) => u.email.toLowerCase() === authUser.email?.toLowerCase(),
    );
    if (!localUser) {
      return { ok: false, syncedTables: [] };
    }

    const { error: profErr } = await client.from('profiles').upsert({
      id: authUser.id,
      full_name: localUser.name,
      email: localUser.email,
      role: localUser.role,
      active_language: localUser.activeLanguage ?? 'en',
      dialect_by_language: localUser.dialectByLanguage ?? {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR',
        it: 'it-IT',
        de: 'de-DE',
        ru: 'ru-RU',
        ja: 'ja-JP',
        zh: 'zh-CN',
        ar: 'ar-SA',
        nl: 'nl-NL',
        af: 'af-ZA',
        sv: 'sv-SE',
      },
      enrollment_type: localUser.enrollmentType ?? 'independent',
      teacher_invite_code: localUser.teacherInviteCode ?? null,
      unlinked_notice_pending: Boolean(localUser.unlinkedNoticePending),
      unlinked_by_teacher_name: localUser.unlinkedByTeacherName ?? null,
      blocked: Boolean(localUser.blocked),
      blocked_reason: localUser.blockedReason ?? null,
    });
    if (!profErr) syncedTables.push('profiles');

    const { error: progErr } = await client.from('student_progress').upsert({
      user_id: authUser.id,
      language_code: localUser.activeLanguage ?? 'en',
      xp: localUser.xp ?? 0,
      streak_days: localUser.streakDays ?? 1,
      daily_goal_minutes: localUser.dailyGoalMinutes ?? 15,
      today_minutes: localUser.todayMinutes ?? 0,
      recommended_level: localUser.recommendedLevel ?? null,
      recommended_level_by_language: localUser.recommendedLevelByLanguage ?? {},
      completed_topic_ids: localUser.completedTopicIds ?? [],
      topic_step_progress: localUser.topicStepProgress ?? {},
      learned_vocab_ids: localUser.learnedVocabIds ?? [],
      mistake_bank: (localUser.mistakeBank ?? []).slice(0, 150),
      skill_scores: localUser.skillScores,
      daily_quests: localUser.dailyQuests,
      updated_at: new Date().toISOString(),
    });
    if (!progErr) syncedTables.push('student_progress');

    const userCerts = localUser.issuedCertificates ?? [];
    if (userCerts.length > 0) {
      const certRows = userCerts.map((c) => ({
        id: c.id,
        student_id: authUser.id,
        language_code: c.languageCode ?? 'en',
        level: c.level,
        verification_code: c.verificationCode,
        issued_by: c.issuedBy,
        avg_score: c.avgScore,
        total_hours: c.totalHours,
        skill_scores: c.skillScores,
      }));
      const { error: certErr } = await client
        .from('certificates')
        .upsert(certRows, { onConflict: 'id' });
      if (!certErr) syncedTables.push('certificates');
    }

    const userSubs = state.submissions.filter(
      (s) => s.studentId === localUser.id,
    );
    if (userSubs.length > 0) {
      const subRows = userSubs.slice(0, 50).map((s) => ({
        id: s.id,
        student_id: authUser.id,
        language_code: s.languageCode ?? 'en',
        type: s.type,
        topic_id: s.topicId,
        topic_title: s.topicTitle,
        prompt_pt: s.promptPt,
        response_text: s.responseText,
        audio_path: s.audioPath ?? null,
        audio_duration_sec: s.audioDurationSec ?? null,
        target_sentence: s.targetSentence ?? null,
        auto_pronunciation_score: s.autoPronunciationScore ?? null,
        status: s.status,
        teacher_feedback: s.teacherFeedback ?? null,
        corrected_text: s.correctedText ?? null,
        teacher_badge: s.teacherBadge ?? null,
        pronunciation_rubric: s.pronunciationRubric ?? null,
        audio_archived: Boolean(s.audioArchived),
        audio_expired_at: s.audioExpiredAt ?? null,
      }));
      const { error: subErr } = await client
        .from('submissions')
        .upsert(subRows, { onConflict: 'id' });
      if (!subErr) syncedTables.push('submissions');
    }

    return { ok: syncedTables.length > 0, syncedTables };
  } catch {
    return { ok: false, syncedTables };
  }
}

export async function getSecurityAuditStatus(
  cloudConfig?: CloudConfig,
): Promise<SecurityAuditStatus> {
  const cfg = getEffectiveSupabaseConfig(cloudConfig);
  if (!cfg.url || !cfg.anonKey) {
    return {
      cloudConfigured: false,
      authenticated: false,
      relationalReady: false,
    };
  }
  try {
    const client = createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: false },
    });
    const { data } = await client.auth.getSession();
    const user = data.session?.user;
    return {
      cloudConfigured: true,
      authenticated: Boolean(user?.id),
      userEmail: user?.email,
      userId: user?.id,
      relationalReady: Boolean(user?.id),
    };
  } catch {
    return {
      cloudConfigured: true,
      authenticated: false,
      relationalReady: false,
    };
  }
}

export async function syncCommunityPostToCloud(post: CommunityPost): Promise<void> {
  const cfg = getEffectiveSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) return;
  try {
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
    const { data } = await client.auth.getSession();
    if (!data.session?.user?.id) return;
    await client.from('community_posts').upsert({
      id: post.id,
      language_code: post.languageCode,
      author_id: data.session.user.id,
      author_name: post.authorName,
      level: post.level,
      category: post.category,
      title: post.title,
      body: post.body,
      target_snippet: post.targetSnippet ?? null,
      likes: post.likes,
      pinned: Boolean(post.pinned),
      created_at: post.createdAt,
    });
  } catch {
    // Best-effort cloud sync
  }
}

export async function syncCommunityReplyToCloud(
  postId: string,
  reply: CommunityReply,
): Promise<void> {
  const cfg = getEffectiveSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) return;
  try {
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
    const { data } = await client.auth.getSession();
    if (!data.session?.user?.id) return;
    await client.from('community_replies').upsert({
      id: reply.id,
      post_id: postId,
      author_id: data.session.user.id,
      author_name: reply.authorName,
      content: reply.content,
      correction_suggestion: reply.correctionSuggestion ?? null,
      likes: reply.likes,
      created_at: reply.createdAt,
    });
  } catch {
    // Best-effort cloud sync
  }
}

export async function syncLiveSessionToCloud(session: LiveSessionRecord): Promise<void> {
  const cfg = getEffectiveSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) return;
  try {
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
    const { data } = await client.auth.getSession();
    if (!data.session?.user?.id) return;
    await client.from('live_sessions').upsert({
      id: session.id,
      language_code: session.languageCode,
      teacher_id: data.session.user.id,
      teacher_name: session.teacherName,
      student_id: null,
      class_id: null,
      title: session.title,
      scheduled_at: session.scheduledAt,
      duration_min: session.durationMin,
      room_slug: session.roomSlug,
      status: session.status,
      notes: session.notes,
      generated_assignment_id: session.generatedAssignmentId ?? null,
      created_at: session.createdAt,
    });
  } catch {
    // Best-effort cloud sync
  }
}

export function subscribeCommunityRealtime(
  onRemoteUpdate: () => void,
  onStatusChange?: (connected: boolean) => void,
): () => void {
  const cfg = getEffectiveSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) {
    onStatusChange?.(false);
    return () => undefined;
  }
  try {
    const client = getSupabaseClient(cfg.url, cfg.anonKey);
    const channel = client
      .channel('fb-community-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_posts' },
        () => onRemoteUpdate(),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_replies' },
        () => onRemoteUpdate(),
      )
      .subscribe((status) => {
        onStatusChange?.(status === 'SUBSCRIBED');
      });

    return () => {
      void client.removeChannel(channel);
    };
  } catch {
    onStatusChange?.(false);
    return () => undefined;
  }
}

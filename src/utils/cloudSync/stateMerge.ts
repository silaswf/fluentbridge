/**
 * @file src/utils/cloudSync/stateMerge.ts
 * @description Mesclagem não-destrutiva (granular) entre estados local e remoto do FluentBridge (usuários, vocabulário SM-2, submissões, turmas, escolas e sessões ao vivo).
 * @exports mergePlatformStates
 */
import type {
  ClassGroup,
  CommunityPost,
  ExamAttemptRecord,
  LiveSessionRecord,
  MistakeEntry,
  PlatformState,
  PronunciationHistoryEntry,
  SchoolTenant,
  StudentSubmission,
  TeacherAssignment,
  Topic,
  UserProfile,
  VocabCard,
} from '../../types/learning';
import { ensureSchoolsList } from '../tenantEngine';

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
    const best = (card.reviewCount ?? 0) >= (other.reviewCount ?? 0) ? card : other;
    map.set(card.id, {
      ...card,
      strength: usePrimaryStrength ? card.strength : other.strength,
      reviewCount: Math.max(card.reviewCount ?? 0, other.reviewCount ?? 0),
      nextReviewAt: best.nextReviewAt ?? card.nextReviewAt ?? other.nextReviewAt,
      intervalDays: best.intervalDays ?? card.intervalDays ?? other.intervalDays,
      easeFactor: best.easeFactor ?? card.easeFactor ?? other.easeFactor,
      repetitions: Math.max(card.repetitions ?? 0, other.repetitions ?? 0) || undefined,
      lapses: Math.max(card.lapses ?? 0, other.lapses ?? 0) || undefined,
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
  const completedCheckpoints = Array.from(
    new Set([
      ...(localUser.completedCheckpoints ?? []),
      ...(remoteUser.completedCheckpoints ?? []),
    ]),
  );

  const certMap = new Map<string, (typeof localUser.issuedCertificates)[number]>();
  for (const cert of [
    ...(secondary.issuedCertificates ?? []),
    ...(primary.issuedCertificates ?? []),
  ]) {
    const key = `${cert.languageCode ?? 'en'}:${cert.level}`;
    if (!certMap.has(key)) certMap.set(key, cert);
  }

  const claimedQuestIds = Array.from(
    new Set([
      ...(localUser.dailyQuests?.claimedQuestIds ?? []),
      ...(remoteUser.dailyQuests?.claimedQuestIds ?? []),
    ]),
  );

  const learnedVocabIds = Array.from(
    new Set([
      ...(localUser.learnedVocabIds ?? []),
      ...(remoteUser.learnedVocabIds ?? []),
    ]),
  );

  const mergedTopicProgress = { ...(secondary.topicStepProgress ?? {}) };
  for (const [topicId, rec] of Object.entries(primary.topicStepProgress ?? {})) {
    const prevRec = mergedTopicProgress[topicId];
    if (
      !prevRec ||
      rec.completedSteps.length > prevRec.completedSteps.length ||
      rec.updatedAt > prevRec.updatedAt
    ) {
      mergedTopicProgress[topicId] = rec;
    }
  }

  return {
    ...secondary,
    ...primary,
    password: primary.password || secondary.password,
    completedTopicIds,
    completedCheckpoints,
    learnedVocabIds,
    topicStepProgress: mergedTopicProgress,
    mistakeBank: (() => {
      const map = new Map<string, MistakeEntry>();
      for (const m of [
        ...(secondary.mistakeBank ?? []),
        ...(primary.mistakeBank ?? []),
      ]) {
        const prev = map.get(m.id);
        if (!prev || m.resolved || m.reviewCount > prev.reviewCount) {
          map.set(m.id, m);
        }
      }
      return Array.from(map.values()).slice(0, 150);
    })(),
    recommendedLevelByLanguage: {
      ...(secondary.recommendedLevelByLanguage ?? {}),
      ...(primary.recommendedLevelByLanguage ?? {}),
    },
    xp: Math.max(localUser.xp ?? 0, remoteUser.xp ?? 0),
    xpByLanguage: {
      ...(secondary.xpByLanguage ?? {}),
      ...(primary.xpByLanguage ?? {}),
    },
    weeklyXpByLanguage: {
      ...(secondary.weeklyXpByLanguage ?? {}),
      ...(primary.weeklyXpByLanguage ?? {}),
    },
    weeklyXpWeekKey: primary.weeklyXpWeekKey ?? secondary.weeklyXpWeekKey,
    pronunciationHistory: (() => {
      const map = new Map<string, PronunciationHistoryEntry>();
      for (const h of [
        ...(secondary.pronunciationHistory ?? []),
        ...(primary.pronunciationHistory ?? []),
      ]) {
        map.set(h.id, h);
      }
      return Array.from(map.values()).slice(-120);
    })(),
    examAttempts: (() => {
      const map = new Map<string, ExamAttemptRecord>();
      for (const a of [
        ...(secondary.examAttempts ?? []),
        ...(primary.examAttempts ?? []),
      ]) {
        map.set(a.id, a);
      }
      return Array.from(map.values()).slice(-100);
    })(),
    streakDays: Math.max(localUser.streakDays ?? 1, remoteUser.streakDays ?? 1),
    streakFreezes: primary.streakFreezes ?? secondary.streakFreezes ?? 1,
    lastStudyDate:
      [localUser.lastStudyDate, remoteUser.lastStudyDate]
        .filter(Boolean)
        .sort()
        .pop() ?? undefined,
    themeMode: primary.themeMode ?? secondary.themeMode,
    reminderEnabled: primary.reminderEnabled ?? secondary.reminderEnabled,
    reminderTime: primary.reminderTime ?? secondary.reminderTime,
    blocked: primary.isMasterAdmin ? false : (primary.blocked ?? secondary.blocked),
    blockedReason: primary.isMasterAdmin
      ? undefined
      : (primary.blockedReason ?? secondary.blockedReason),
    assignedTeacherId: primary.assignedTeacherId,
    enrollmentType: primary.enrollmentType ?? secondary.enrollmentType,
    teacherInviteCode: primary.teacherInviteCode ?? secondary.teacherInviteCode,
    unlinkedNoticePending: primary.unlinkedNoticePending,
    unlinkedByTeacherName: primary.unlinkedByTeacherName,
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
    const winningReview = existingReviewed && !nextReviewed ? existing : sub;

    const isArchived = Boolean(existing.audioArchived || sub.audioArchived);

    map.set(sub.id, {
      ...existing,
      ...sub,
      status: existingReviewed || nextReviewed ? 'reviewed' : 'pending',
      teacherFeedback:
        winningReview.teacherFeedback ??
        existing.teacherFeedback ??
        sub.teacherFeedback,
      correctedText:
        winningReview.correctedText ?? existing.correctedText ?? sub.correctedText,
      teacherBadge:
        winningReview.teacherBadge ?? existing.teacherBadge ?? sub.teacherBadge,
      pronunciationRubric:
        winningReview.pronunciationRubric ??
        existing.pronunciationRubric ??
        sub.pronunciationRubric,
      createdAtIso: sub.createdAtIso ?? existing.createdAtIso,
      audioArchived: isArchived || undefined,
      audioExpiredAt: isArchived
        ? sub.audioExpiredAt ?? existing.audioExpiredAt
        : undefined,
      audioId: isArchived ? undefined : (sub.audioId ?? existing.audioId),
      audioPath: isArchived ? undefined : (sub.audioPath ?? existing.audioPath),
      audioDataUrl: isArchived
        ? undefined
        : (sub.audioDataUrl ?? existing.audioDataUrl),
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
  const deletedAssignmentIds = new Set<string>([
    ...(local.deletedAssignmentIds ?? []),
    ...(Array.isArray(remote.deletedAssignmentIds)
      ? remote.deletedAssignmentIds
      : []),
  ]);
  const deletedCommunityPostIds = new Set<string>([
    ...(local.deletedCommunityPostIds ?? []),
    ...(Array.isArray(remote.deletedCommunityPostIds)
      ? remote.deletedCommunityPostIds
      : []),
  ]);
  const deletedLiveSessionIds = new Set<string>([
    ...(local.deletedLiveSessionIds ?? []),
    ...(Array.isArray(remote.deletedLiveSessionIds)
      ? remote.deletedLiveSessionIds
      : []),
  ]);

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

  const topicMap = new Map<string, Topic>();
  const remoteTopics = Array.isArray(remote.customTopics)
    ? remote.customTopics
    : [];
  const orderedTopics =
    preferSide === 'local'
      ? [...remoteTopics, ...(local.customTopics ?? [])]
      : [...(local.customTopics ?? []), ...remoteTopics];
  for (const t of orderedTopics) {
    if (!t?.id || deletedTopicIds.has(t.id)) continue;
    topicMap.set(t.id, t);
  }

  const remoteSubs = Array.isArray(remote.submissions) ? remote.submissions : [];
  const mergedSubs = mergeSubmissions(
    local.submissions ?? [],
    remoteSubs,
    preferSide,
  );

  const assignmentMap = new Map<string, TeacherAssignment>();
  const remoteAssignments = Array.isArray(remote.assignments)
    ? remote.assignments
    : [];
  const orderedAssignments =
    preferSide === 'local'
      ? [...remoteAssignments, ...(local.assignments ?? [])]
      : [...(local.assignments ?? []), ...remoteAssignments];
  for (const a of orderedAssignments) {
    if (!a?.id || deletedAssignmentIds.has(a.id)) continue;
    assignmentMap.set(a.id, a);
  }

  const postMap = new Map<string, CommunityPost>();
  const remotePosts = Array.isArray(remote.communityPosts)
    ? remote.communityPosts
    : [];
  const orderedPosts =
    preferSide === 'local'
      ? [...remotePosts, ...(local.communityPosts ?? [])]
      : [...(local.communityPosts ?? []), ...remotePosts];
  for (const p of orderedPosts) {
    if (!p?.id || deletedCommunityPostIds.has(p.id)) continue;
    const prev = postMap.get(p.id);
    if (!prev || p.replies.length >= prev.replies.length) {
      postMap.set(p.id, p);
    }
  }

  const liveSessionMap = new Map<string, LiveSessionRecord>();
  const remoteLiveSessions = Array.isArray(remote.liveSessions)
    ? remote.liveSessions
    : [];
  const orderedLiveSessions =
    preferSide === 'local'
      ? [...remoteLiveSessions, ...(local.liveSessions ?? [])]
      : [...(local.liveSessions ?? []), ...remoteLiveSessions];
  for (const s of orderedLiveSessions) {
    if (!s?.id || deletedLiveSessionIds.has(s.id)) continue;
    const prev = liveSessionMap.get(s.id);
    if (!prev || (s.notes?.length ?? 0) >= (prev.notes?.length ?? 0)) {
      liveSessionMap.set(s.id, s);
    }
  }

  const schoolMap = new Map<string, SchoolTenant>();
  const remoteSchools = Array.isArray(remote.schools) ? remote.schools : [];
  const orderedSchools =
    preferSide === 'local'
      ? [...remoteSchools, ...(local.schools ?? [])]
      : [...(local.schools ?? []), ...remoteSchools];
  for (const sc of orderedSchools) {
    if (!sc?.id) continue;
    schoolMap.set(sc.id, sc);
  }
  const mergedSchools = ensureSchoolsList(
    Array.from(schoolMap.values()),
    local.schoolName || remote.schoolName,
  );

  return {
    schoolName:
      preferSide === 'remote' && remote.schoolName
        ? remote.schoolName
        : local.schoolName,
    schools: mergedSchools,
    teacherName:
      preferSide === 'remote' && remote.teacherName
        ? remote.teacherName
        : local.teacherName,
    teacherAccessCode:
      preferSide === 'remote' && remote.teacherAccessCode
        ? remote.teacherAccessCode
        : (local.teacherAccessCode ?? remote.teacherAccessCode),
    currentUserId: local.currentUserId,
    classes: Array.from(classMap.values()),
    users: Array.from(userByEmail.values()),
    customTopics: Array.from(topicMap.values()),
    submissions: mergedSubs,
    assignments: Array.from(assignmentMap.values()),
    communityPosts: Array.from(postMap.values()),
    liveSessions: Array.from(liveSessionMap.values()),
    deletedUserIds: Array.from(deletedUserIds),
    deletedClassIds: Array.from(deletedClassIds),
    deletedTopicIds: Array.from(deletedTopicIds),
    deletedAssignmentIds: Array.from(deletedAssignmentIds),
    deletedCommunityPostIds: Array.from(deletedCommunityPostIds),
    deletedLiveSessionIds: Array.from(deletedLiveSessionIds),
    cloudConfig: {
      ...(remote.cloudConfig ?? {}),
      ...local.cloudConfig,
      supabaseUrl: local.cloudConfig.supabaseUrl,
      supabaseAnonKey: local.cloudConfig.supabaseAnonKey,
      geminiApiKey: local.cloudConfig.geminiApiKey,
    },
  };
}

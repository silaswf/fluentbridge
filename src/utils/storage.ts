import { isMasterAdminEmail } from '../config/appConfig';
import type { PlatformState, UserProfile, VocabCard } from '../types/learning';

export const PLATFORM_STORAGE_KEY = 'fluentbridge_platform_v3';

const LEGACY_DEMO_USER_IDS = new Set([
  'user-teacher-1',
  'user-student-mariana',
  'user-student-lucas',
  'user-student-sofia',
]);

const LEGACY_DEMO_SUB_IDS = new Set([
  'sub-demo-1',
  'sub-demo-speaking-1',
  'sub-demo-2',
]);

function syncUserVocab(
  userVocab: VocabCard[] | undefined,
  masterVocab: VocabCard[],
): VocabCard[] {
  const existingMap = new Map<string, VocabCard>();
  for (const card of userVocab ?? []) {
    existingMap.set(card.id, card);
  }
  return masterVocab.map((masterCard) => {
    const saved = existingMap.get(masterCard.id);
    if (!saved) return { ...masterCard };
    return {
      ...masterCard,
      strength: saved.strength,
      reviewCount: saved.reviewCount,
    };
  });
}

export function normalizePlatformState(
  raw: Partial<PlatformState>,
  defaults: PlatformState,
  masterVocab: VocabCard[],
): PlatformState {
  const cleanedRawUsers = Array.isArray(raw.users)
    ? raw.users.filter(
        (u) =>
          !LEGACY_DEMO_USER_IDS.has(u.id) &&
          u.email.toLowerCase() !== 'gabriel@fluentbridge.com',
      )
    : [];

  const rawMergedUsers: UserProfile[] =
    cleanedRawUsers.length > 0
      ? cleanedRawUsers.map((u) => ({
          ...u,
          name:
            isMasterAdminEmail(u.email) &&
            (u.name === 'Silas (Admin Mestre)' || !u.name.trim())
              ? 'Prof. Silas'
              : u.name,
          isMasterAdmin: u.isMasterAdmin || isMasterAdminEmail(u.email),
          role: isMasterAdminEmail(u.email) ? 'teacher' : u.role,
          activeLanguage: u.activeLanguage ?? 'en',
          dialectByLanguage: {
            en: u.accent ?? 'en-US',
            es: 'es-ES',
            fr: 'fr-FR',
            ...(u.dialectByLanguage ?? {}),
          },
          completedTopicIds: Array.isArray(u.completedTopicIds)
            ? u.completedTopicIds
            : [],
          skillScores: {
            listening: u.skillScores?.listening ?? 50,
            reading: u.skillScores?.reading ?? 50,
            speaking: u.skillScores?.speaking ?? 50,
            writing: u.skillScores?.writing ?? 50,
          },
          vocab: syncUserVocab(u.vocab, masterVocab),
          issuedCertificates: Array.isArray(u.issuedCertificates)
            ? u.issuedCertificates
            : [],
          dailyQuests: {
            lessonsCompletedToday: u.dailyQuests?.lessonsCompletedToday ?? 0,
            vocabReviewedToday: u.dailyQuests?.vocabReviewedToday ?? 0,
            tutorSessionsToday: u.dailyQuests?.tutorSessionsToday ?? 0,
            claimedQuestIds: Array.isArray(u.dailyQuests?.claimedQuestIds)
              ? u.dailyQuests.claimedQuestIds
              : [],
          },
        }))
      : defaults.users.map((u) => ({
          ...u,
          vocab: syncUserVocab(u.vocab, masterVocab),
        }));

  // Ensure Master Admin (silaswf@gmail.com) is always present even on migrated local storage
  const hasMaster = rawMergedUsers.some((u) => isMasterAdminEmail(u.email));
  const masterTemplate = defaults.users.find((u) => isMasterAdminEmail(u.email));
  const mergedUsers =
    !hasMaster && masterTemplate
      ? [
          {
            ...masterTemplate,
            vocab: syncUserVocab(masterTemplate.vocab, masterVocab),
          },
          ...rawMergedUsers,
        ]
      : rawMergedUsers;

  const cleanedSubmissions = Array.isArray(raw.submissions)
    ? raw.submissions.filter((s) => !LEGACY_DEMO_SUB_IDS.has(s.id))
    : defaults.submissions;

  const resolvedTeacherName =
    !raw.teacherName || raw.teacherName.trim() === 'Prof. Gabriel'
      ? defaults.teacherName
      : raw.teacherName;

  return {
    schoolName: raw.schoolName ?? defaults.schoolName,
    teacherName: resolvedTeacherName,
    currentUserId:
      raw.currentUserId !== undefined ? raw.currentUserId : defaults.currentUserId,
    classes:
      Array.isArray(raw.classes) && raw.classes.length > 0
        ? raw.classes
        : defaults.classes,
    users: mergedUsers,
    customTopics: Array.isArray(raw.customTopics)
      ? raw.customTopics
      : defaults.customTopics,
    submissions: cleanedSubmissions,
    cloudConfig: {
      ...defaults.cloudConfig,
      ...(raw.cloudConfig ?? {}),
    },
  };
}

export function loadPlatformState(
  defaults: PlatformState,
  masterVocab: VocabCard[],
): PlatformState {
  if (typeof window === 'undefined') return defaults;
  try {
    const rawText = window.localStorage.getItem(PLATFORM_STORAGE_KEY);
    if (!rawText) return normalizePlatformState(defaults, defaults, masterVocab);
    const parsed = JSON.parse(rawText) as Partial<PlatformState>;
    return normalizePlatformState(parsed, defaults, masterVocab);
  } catch {
    return normalizePlatformState(defaults, defaults, masterVocab);
  }
}

export function savePlatformState(state: PlatformState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PLATFORM_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function clearPlatformState(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(PLATFORM_STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

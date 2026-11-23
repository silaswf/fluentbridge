import { isMasterAdminEmail } from '../config/appConfig';
import type { PlatformState, UserProfile, VocabCard } from '../types/learning';

export const PLATFORM_STORAGE_KEY = 'fluentbridge_platform_v3';

export function hashPassword(raw: string): string {
  const value = (raw ?? '').trim();
  if (!value) return '';
  if (value.startsWith('fbh1:')) return value;

  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  const salted = `fb-salt-2026::${value}`;
  for (let i = 0; i < salted.length; i++) {
    const ch = salted.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch ^ (i * 31);
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `fbh1:${p1}${p2}`;
}

export function verifyPassword(input: string, stored: string): boolean {
  const cleanStored = (stored ?? '').trim();
  if (!cleanStored || !input) return false;
  if (cleanStored.startsWith('fbh1:')) {
    return hashPassword(input) === cleanStored;
  }
  return input === cleanStored;
}

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
      nextReviewAt: saved.nextReviewAt,
      intervalDays: saved.intervalDays,
      easeFactor: saved.easeFactor,
      repetitions: saved.repetitions,
      lapses: saved.lapses,
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
          password: hashPassword(u.password),
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
          password: hashPassword(u.password),
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
            password: hashPassword(masterTemplate.password),
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
    teacherAccessCode: raw.teacherAccessCode ?? defaults.teacherAccessCode,
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
    assignments: Array.isArray(raw.assignments)
      ? raw.assignments
      : defaults.assignments ?? [],
    deletedUserIds: Array.isArray(raw.deletedUserIds)
      ? raw.deletedUserIds
      : defaults.deletedUserIds ?? [],
    deletedClassIds: Array.isArray(raw.deletedClassIds)
      ? raw.deletedClassIds
      : defaults.deletedClassIds ?? [],
    deletedTopicIds: Array.isArray(raw.deletedTopicIds)
      ? raw.deletedTopicIds
      : defaults.deletedTopicIds ?? [],
    deletedAssignmentIds: Array.isArray(raw.deletedAssignmentIds)
      ? raw.deletedAssignmentIds
      : defaults.deletedAssignmentIds ?? [],
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

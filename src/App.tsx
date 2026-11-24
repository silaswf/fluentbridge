import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  getEffectiveGeminiKey,
  getEffectiveSupabaseConfig,
  isMasterAdminEmail,
} from './config/appConfig';
import { getAudioClip } from './utils/audioDb';
import {
  registerNativeOAuthListener,
  signInWithSupabaseEmail,
  signInWithSupabaseGoogle,
  signOutSupabase,
  signUpWithSupabaseEmail,
  subscribeSupabaseAuthChanges,
  uploadSpeakingAudioToCloud,
  type SupabaseAuthUserInfo,
} from './utils/cloudSync';
import { AppDownloadGateway } from './components/AppDownloadGateway';
import { AuthScreen } from './components/AuthScreen';
import { LearningPath } from './components/LearningPath';
import { Sidebar, type NavView } from './components/Sidebar';
import { TeacherLinkModal } from './components/TeacherLinkModal';
import type { TeacherTab } from './components/TeacherStudio';
import { useCloudSyncController } from './hooks/useCloudSyncController';
import { purgeExpiredSpeakingAudios } from './utils/audioRetention';
import { getCurrentWeekKey } from './utils/communityEngine';
import { addMistakeEntry, markMistakeResolved } from './utils/mistakeBank';
import { scheduleDailyStudyReminder } from './utils/notifications';
import { isRtlLanguage, isWebPlatform } from './utils/platform';
import { isCardDue, reviewVocabCardSM2, type SrsRating } from './utils/srsEngine';
import { recordStudyActivity } from './utils/streakEngine';
import { getUnlockedVocabCards } from './utils/vocabUnlock';
import {
  applyThemeMode,
  loadStoredThemeMode,
  nextThemeMode,
  saveThemeMode,
  type ThemeMode,
} from './utils/theme';

const AITutor = lazy(() =>
  import('./components/AITutor').then((m) => ({ default: m.AITutor })),
);
const AdminPanel = lazy(() =>
  import('./components/AdminPanel').then((m) => ({ default: m.AdminPanel })),
);
const CertificatesView = lazy(() =>
  import('./components/CertificatesView').then((m) => ({
    default: m.CertificatesView,
  })),
);
const LessonPlayer = lazy(() =>
  import('./components/LessonPlayer').then((m) => ({ default: m.LessonPlayer })),
);
const PlacementTestModal = lazy(() =>
  import('./components/PlacementTestModal').then((m) => ({
    default: m.PlacementTestModal,
  })),
);
const TeacherStudio = lazy(() =>
  import('./components/TeacherStudio').then((m) => ({
    default: m.TeacherStudio,
  })),
);
const TipsLibrary = lazy(() =>
  import('./components/TipsLibrary').then((m) => ({ default: m.TipsLibrary })),
);
const VocabReview = lazy(() =>
  import('./components/VocabReview').then((m) => ({ default: m.VocabReview })),
);
const MockExamHub = lazy(() =>
  import('./components/MockExamHub').then((m) => ({ default: m.MockExamHub })),
);
const CommunityHub = lazy(() =>
  import('./components/CommunityHub').then((m) => ({ default: m.CommunityHub })),
);
import {
  getActiveDialect,
  getCourseTopics,
  getLanguageCourse,
} from './data/languages';
import {
  ALL_BUILTIN_TOPICS,
  ALL_INITIAL_VOCABULARY,
  DEFAULT_PLATFORM_STATE,
  cloneInitialVocab,
} from './data/lessons';
import type {
  Accent,
  CEFRLevel,
  CertificateRecord,
  CloudConfig,
  CommunityPost,
  ExamAttemptRecord,
  LanguageCode,
  PlatformState,
  PronunciationRubric,
  SkillType,
  StudentEnrollmentType,
  Topic,
  UserProfile,
  UserRole,
} from './types/learning';
import { playSound } from './utils/soundFx';
import {
  clearPlatformState,
  generateTeacherInviteCode,
  hashPassword,
  loadPlatformState,
  normalizePlatformState,
  savePlatformState,
  verifyPassword,
} from './utils/storage';

const AVATAR_COLORS = ['#116DFF', '#0D9488', '#D97706', '#7C3AED', '#E11D48'];

function buildCertificate(
  student: UserProfile,
  level: CEFRLevel,
  issuedBy: string,
  languageCode: LanguageCode = 'en',
): CertificateRecord {
  const avgScore = Math.round(
    (student.skillScores.listening +
      student.skillScores.reading +
      student.skillScores.speaking +
      student.skillScores.writing) /
    4,
  );
  const randCode = Math.floor(1000 + Math.random() * 9000);
  return {
    id: `cert-${student.id}-${level}-${Date.now()}`,
    languageCode,
    level,
    studentId: student.id,
    studentName: student.name,
    issuedAt: new Date().toISOString().slice(0, 10),
    verificationCode: `FB-${level}-${randCode}`,
    issuedBy,
    avgScore,
    totalHours: level === 'A1' ? 14 : level === 'A2' ? 18 : 24,
    skillScores: { ...student.skillScores },
  };
}

export function App() {
  const [state, setState] = useState<PlatformState>(() =>
    loadPlatformState(DEFAULT_PLATFORM_STATE, ALL_INITIAL_VOCABULARY),
  );
  const [activeView, setActiveView] = useState<NavView>('learn');
  const [teacherInitialTab, setTeacherInitialTab] =
    useState<TeacherTab>('corrections');
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [tutorTargetTopic, setTutorTargetTopic] = useState<Topic | null>(null);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [showTeacherLinkModal, setShowTeacherLinkModal] = useState(false);
  const [dismissedWebGateway, setDismissedWebGateway] = useState<boolean>(() => {
    if (!isWebPlatform()) return true;
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('fluentbridge_prefer_web') === '1';
  });
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [pathFilterLevel, setPathFilterLevel] = useState<'ALL' | CEFRLevel>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => loadStoredThemeMode());
  const lastSupabaseAuthEmailRef = useRef<string | null>(null);

  const effectiveSupabase = useMemo(
    () => getEffectiveSupabaseConfig(state.cloudConfig),
    [state.cloudConfig],
  );
  const effectiveGeminiKey = useMemo(
    () => getEffectiveGeminiKey(state.cloudConfig.geminiApiKey),
    [state.cloudConfig.geminiApiKey],
  );
  const isCloudConfigured = Boolean(effectiveSupabase.url && effectiveSupabase.anonKey);

  const { autoSyncStatus, skipNextCloudPushRef } = useCloudSyncController({
    state,
    setState,
    isCloudConfigured,
    supabaseUrl: effectiveSupabase.url,
    supabaseAnonKey: effectiveSupabase.anonKey,
    defaultState: DEFAULT_PLATFORM_STATE,
    masterVocab: ALL_INITIAL_VOCABULARY,
    onSupabaseUserHydrated: (authUser) => applySupabaseAuthUser(authUser, false),
  });

  useEffect(() => {
    savePlatformState(state);
  }, [state]);

  useEffect(() => {
    applyThemeMode(themeMode);
    saveThemeMode(themeMode);
    if (themeMode !== 'system' || typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyThemeMode('system');
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [themeMode]);

  const applySupabaseAuthUser = (
    authUser: SupabaseAuthUserInfo,
    notifyUser: boolean,
  ) => {
    if (!authUser.email) return;
    const normalizedEmail = authUser.email.toLowerCase();
    const master = isMasterAdminEmail(normalizedEmail);
    const knownExisting = state.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail,
    );
    if (knownExisting?.blocked && !master) {
      void signOutSupabase(state.cloudConfig);
      setState((prev) => ({ ...prev, currentUserId: null }));
      showToast(
        knownExisting.blockedReason
          ? `Acesso suspenso: ${knownExisting.blockedReason}`
          : 'Seu acesso foi suspenso pelo administrador.',
      );
      return;
    }

    const computedTargetView: NavView =
      master || authUser.role === 'teacher' ? 'teacher' : 'learn';

    setState((prev) => {
      const existing = prev.users.find(
        (u) => u.email.toLowerCase() === normalizedEmail,
      );
      if (existing) {
        if (existing.blocked && !master) {
          return { ...prev, currentUserId: null };
        }
        return {
          ...prev,
          currentUserId: existing.id,
          users: prev.users.map((u) =>
            u.id === existing.id && master
              ? { ...u, role: 'teacher', isMasterAdmin: true, blocked: false }
              : u,
          ),
        };
      }
      const created: UserProfile = {
        id: `user-${Date.now()}`,
        name: authUser.name,
        email: authUser.email,
        password: '',
        role: master ? 'teacher' : authUser.role ?? 'student',
        isMasterAdmin: master,
        avatarColor: AVATAR_COLORS[prev.users.length % AVATAR_COLORS.length],
        activeLanguage: 'en',
        dialectByLanguage: {
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
        accent: 'en-US',
        dailyGoalMinutes: 15,
        todayMinutes: 0,
        xp: 0,
        streakDays: 1,
        completedTopicIds: [],
        skillScores: { listening: 45, reading: 45, speaking: 40, writing: 45 },
        vocab: cloneInitialVocab(),
        issuedCertificates: [],
        dailyQuests: {
          lessonsCompletedToday: 0,
          vocabReviewedToday: 0,
          tutorSessionsToday: 0,
          claimedQuestIds: [],
        },
        createdAt: new Date().toISOString().slice(0, 10),
      };
      return {
        ...prev,
        users: [...prev.users, created],
        currentUserId: created.id,
      };
    });

    if (lastSupabaseAuthEmailRef.current !== normalizedEmail) {
      lastSupabaseAuthEmailRef.current = normalizedEmail;
      setActiveView(computedTargetView);
      if (notifyUser) {
        showToast(`Conectado via Google como ${authUser.name}!`);
      }
    }
  };

  // Subscribe to Supabase Web/Desktop auth state (captures OAuth #access_token / ?code redirects)
  useEffect(() => {
    if (!isCloudConfigured) return;
    const cfg: CloudConfig = {
      supabaseUrl: effectiveSupabase.url,
      supabaseAnonKey: effectiveSupabase.anonKey,
      geminiApiKey: '',
    };
    return subscribeSupabaseAuthChanges(cfg, (authUser, isSignInEvent) => {
      applySupabaseAuthUser(authUser, isSignInEvent);
    });
  }, [isCloudConfigured, effectiveSupabase.url, effectiveSupabase.anonKey]);

  // Native Android Chrome Custom Tabs OAuth callback listener
  useEffect(() => {
    if (!isCloudConfigured) return;
    const cfg: CloudConfig = {
      supabaseUrl: effectiveSupabase.url,
      supabaseAnonKey: effectiveSupabase.anonKey,
      geminiApiKey: '',
    };
    return registerNativeOAuthListener(cfg, (authUser) => {
      applySupabaseAuthUser(authUser, true);
    });
  }, [isCloudConfigured, effectiveSupabase.url, effectiveSupabase.anonKey]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3600);
  };

  const currentUser = useMemo<UserProfile | null>(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId],
  );

  const activeLanguage: LanguageCode = currentUser?.activeLanguage ?? 'en';
  const activeCourse = useMemo(
    () => getLanguageCourse(activeLanguage),
    [activeLanguage],
  );

  const activeDialect = currentUser
    ? getActiveDialect(
      activeLanguage,
      currentUser.dialectByLanguage,
      currentUser.accent,
    )
    : 'en-US';

  const courseTopics = useMemo(
    () => getCourseTopics(activeLanguage, state.customTopics),
    [activeLanguage, state.customTopics],
  );

  const courseVocab = useMemo(() => {
    if (!currentUser) return [];
    return currentUser.vocab.filter(
      (v) => (v.languageCode ?? 'en') === activeLanguage,
    );
  }, [currentUser, activeLanguage]);

  const unlockedCourseVocab = useMemo(
    () => (currentUser ? getUnlockedVocabCards(courseVocab, currentUser) : []),
    [courseVocab, currentUser],
  );
  const dueVocabCount = unlockedCourseVocab.filter((v) => isCardDue(v)).length;

  const updateCurrentUser = (updater: (u: UserProfile) => UserProfile) => {
    if (!state.currentUserId) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === prev.currentUserId ? updater(u) : u,
      ),
    }));
  };

  const handleLogin = (userId: string) => {
    const target = state.users.find((u) => u.id === userId);
    setState((prev) => ({ ...prev, currentUserId: userId }));
    setPathFilterLevel('ALL');
    setActiveView(target?.role === 'teacher' ? 'teacher' : 'learn');
  };

  const buildFreshUserProfile = (payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    classId?: string;
    assignedTeacherId?: string;
    enrollmentType?: StudentEnrollmentType;
  }): UserProfile => {
    const master = isMasterAdminEmail(payload.email);
    const effectiveRole: UserRole = master ? 'teacher' : payload.role;
    const id = `user-${Date.now()}`;
    return {
      id,
      name: payload.name,
      email: payload.email,
      password: hashPassword(payload.password),
      role: effectiveRole,
      isMasterAdmin: master,
      classId: master ? undefined : payload.classId,
      assignedTeacherId:
        effectiveRole === 'student' ? payload.assignedTeacherId : undefined,
      enrollmentType:
        effectiveRole === 'student'
          ? payload.enrollmentType ??
          (payload.assignedTeacherId
            ? 'vip'
            : payload.classId
              ? 'class'
              : 'independent')
          : undefined,
      teacherInviteCode:
        effectiveRole === 'teacher'
          ? generateTeacherInviteCode(payload.name, id, payload.email)
          : undefined,
      unlinkedNoticePending: false,
      avatarColor: AVATAR_COLORS[state.users.length % AVATAR_COLORS.length],
      activeLanguage: 'en',
      dialectByLanguage: {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR',
        it: 'it-IT',
        de: 'de-DE',
        ru: 'ru-RU',
        ja: 'ja-JP',
        zh: 'zh-CN',
      },
      accent: 'en-US',
      dailyGoalMinutes: 15,
      todayMinutes: 0,
      xp: 0,
      streakDays: 1,
      completedTopicIds: [],
      skillScores: { listening: 45, reading: 45, speaking: 40, writing: 45 },
      vocab: cloneInitialVocab(),
      issuedCertificates: [],
      dailyQuests: {
        lessonsCompletedToday: 0,
        vocabReviewedToday: 0,
        tutorSessionsToday: 0,
        claimedQuestIds: [],
      },
      createdAt: new Date().toISOString().slice(0, 10),
    };
  };

  const handleRegister = async (payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    classId?: string;
    assignedTeacherId?: string;
    enrollmentType?: StudentEnrollmentType;
  }): Promise<{ ok: boolean; error?: string }> => {
    const master = isMasterAdminEmail(payload.email);
    const existing = state.users.find(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase(),
    );

    if (existing && !(master && verifyPassword('admin123', existing.password))) {
      return { ok: false, error: 'Este e-mail já está cadastrado.' };
    }

    let remoteNotice = '';
    if (isCloudConfigured) {
      const supaRes = await signUpWithSupabaseEmail(
        {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: master ? 'teacher' : payload.role,
        },
        state.cloudConfig,
      );
      if (!supaRes.ok && !supaRes.error?.toLowerCase().includes('already registered')) {
        return { ok: false, error: supaRes.error };
      }
      if (supaRes.needsEmailConfirmation) {
        remoteNotice = ' (confirme seu e-mail para autenticação na nuvem)';
      }
    }

    if (existing && master) {
      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === existing.id
            ? {
              ...u,
              name: payload.name,
              password: hashPassword(payload.password),
              role: 'teacher',
              isMasterAdmin: true,
            }
            : u,
        ),
        currentUserId: existing.id,
      }));
      setActiveView('teacher');
      showToast(`Conta Admin Mestre atualizada para ${payload.name}${remoteNotice}!`);
      return { ok: true };
    }

    const newUser = buildFreshUserProfile(payload);
    setState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUserId: newUser.id,
    }));
    setActiveView(newUser.role === 'teacher' ? 'teacher' : 'learn');
    showToast(`Bem-vindo(a), ${newUser.name}${remoteNotice}!`);
    return { ok: true };
  };

  const handleEmailAuthLogin = async (
    email: string,
    password: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!isCloudConfigured) {
      return { ok: false, error: 'Supabase não configurado.' };
    }
    const res = await signInWithSupabaseEmail(email, password, state.cloudConfig);
    if (!res.ok || !res.user) {
      return { ok: false, error: res.error };
    }

    const authUser = res.user;
    const master = isMasterAdminEmail(authUser.email);
    const existing = state.users.find(
      (u) => u.email.toLowerCase() === authUser.email.toLowerCase(),
    );

    if (existing) {
      if (existing.blocked && !master) {
        void signOutSupabase(state.cloudConfig);
        return {
          ok: false,
          error: existing.blockedReason
            ? `Seu acesso foi suspenso pelo administrador (${existing.blockedReason}).`
            : 'Seu acesso foi suspenso pelo administrador.',
        };
      }
      const targetRole = master ? 'teacher' : existing.role;
      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === existing.id
            ? {
              ...u,
              password: hashPassword(password),
              role: targetRole,
              isMasterAdmin: u.isMasterAdmin || master,
            }
            : u,
        ),
        currentUserId: existing.id,
      }));
      setActiveView(targetRole === 'teacher' ? 'teacher' : 'learn');
      return { ok: true };
    }

    const created = buildFreshUserProfile({
      name: authUser.name,
      email: authUser.email,
      password,
      role: authUser.role ?? 'student',
    });
    setState((prev) => ({
      ...prev,
      users: [...prev.users, created],
      currentUserId: created.id,
    }));
    setActiveView(created.role === 'teacher' ? 'teacher' : 'learn');
    showToast(`Bem-vindo(a) de volta, ${created.name}!`);
    return { ok: true };
  };

  const handleGoogleLogin = async (): Promise<{ ok: boolean; error?: string }> => {
    if (!isCloudConfigured) {
      return { ok: false, error: 'Supabase não configurado.' };
    }
    const res = await signInWithSupabaseGoogle(state.cloudConfig);
    if (!res.ok) return { ok: false, error: res.error };
    return { ok: true };
  };

  const handleLogout = () => {
    lastSupabaseAuthEmailRef.current = null;
    setActiveTopic(null);
    setState((prev) => ({ ...prev, currentUserId: null }));
    void signOutSupabase(state.cloudConfig);
    if (
      typeof window !== 'undefined' &&
      (window.location.hash.includes('access_token') ||
        window.location.search.includes('code='))
    ) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleChangeLanguage = (code: LanguageCode) => {
    setPathFilterLevel('ALL');
    updateCurrentUser((u) => ({ ...u, activeLanguage: code }));
    const nextCourse = getLanguageCourse(code);
    showToast(`Idioma alterado para ${nextCourse.flag} ${nextCourse.namePt}`);
  };

  const handleChangeDialect = (dialectCode: string) => {
    updateCurrentUser((u) => ({
      ...u,
      accent:
        dialectCode === 'en-US' || dialectCode === 'en-GB'
          ? (dialectCode as Accent)
          : u.accent,
      dialectByLanguage: {
        ...u.dialectByLanguage,
        [u.activeLanguage]: dialectCode,
      },
    }));
  };

  const handleCompleteLesson = (result: {
    topicId: string;
    xpEarned: number;
    practicedSkills: SkillType[];
    minutesSpent: number;
  }) => {
    if (!currentUser) return;

    let unlockedLevel: CEFRLevel | null = null;
    let streakFreezeUsed = false;
    let streakEarnedFreeze = false;

    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => {
        if (u.id !== prev.currentUserId) return u;

        const streakRes = recordStudyActivity(u);
        if (streakRes.freezeUsed) streakFreezeUsed = true;
        if (streakRes.earnedFreeze) streakEarnedFreeze = true;
        const baseUser = streakRes.user;

        const nextCompleted = baseUser.completedTopicIds.includes(result.topicId)
          ? baseUser.completedTopicIds
          : [...baseUser.completedTopicIds, result.topicId];

        const nextScores = { ...baseUser.skillScores };
        for (const skill of result.practicedSkills) {
          nextScores[skill] = Math.min(100, nextScores[skill] + 7);
        }

        const completedTopicObj = ALL_BUILTIN_TOPICS.find(
          (t) => t.id === result.topicId,
        );
        let nextCerts = baseUser.issuedCertificates;

        if (completedTopicObj) {
          const targetLang = completedTopicObj.languageCode ?? 'en';
          const levelTopics = ALL_BUILTIN_TOPICS.filter(
            (t) =>
              (t.languageCode ?? 'en') === targetLang &&
              t.level === completedTopicObj.level,
          );
          const allLevelDone = levelTopics.every((t) =>
            nextCompleted.includes(t.id),
          );
          const hasCert = nextCerts.some(
            (c) =>
              (c.languageCode ?? 'en') === targetLang &&
              c.level === completedTopicObj.level,
          );
          if (allLevelDone && !hasCert) {
            unlockedLevel = completedTopicObj.level;
            const draftStudent: UserProfile = {
              ...baseUser,
              skillScores: nextScores,
            };
            nextCerts = [
              ...nextCerts,
              buildCertificate(
                draftStudent,
                completedTopicObj.level,
                prev.teacherName,
                targetLang,
              ),
            ];
          }
        }

        const nextStepProgress = { ...(baseUser.topicStepProgress ?? {}) };
        delete nextStepProgress[result.topicId];
        const lessonLang = completedTopicObj?.languageCode ?? baseUser.activeLanguage ?? 'en';
        const wk = getCurrentWeekKey();
        const prevWeekly = baseUser.weeklyXpWeekKey === wk ? baseUser.weeklyXpByLanguage?.[lessonLang] ?? 0 : 0;

        return {
          ...baseUser,
          xp: baseUser.xp + result.xpEarned,
          xpByLanguage: {
            ...(baseUser.xpByLanguage ?? {}),
            [lessonLang]: (baseUser.xpByLanguage?.[lessonLang] ?? 0) + result.xpEarned,
          },
          weeklyXpWeekKey: wk,
          weeklyXpByLanguage: {
            ...(baseUser.weeklyXpWeekKey === wk ? baseUser.weeklyXpByLanguage ?? {} : {}),
            [lessonLang]: prevWeekly + result.xpEarned,
          },
          todayMinutes: baseUser.todayMinutes + result.minutesSpent,
          completedTopicIds: nextCompleted,
          topicStepProgress: nextStepProgress,
          skillScores: nextScores,
          issuedCertificates: nextCerts,
          dailyQuests: {
            ...baseUser.dailyQuests,
            lessonsCompletedToday: baseUser.dailyQuests.lessonsCompletedToday + 1,
          },
        };
      }),
    }));

    if (unlockedLevel) {
      showToast(
        `Parabéns! Você desbloqueou o Certificado CEFR ${unlockedLevel}!`,
      );
    } else if (streakEarnedFreeze) {
      showToast('Incrível! Você ganhou +1 Proteção de Ofensiva (🧊) pela sequência!');
    } else if (streakFreezeUsed) {
      showToast('Sua Proteção de Ofensiva (🧊) manteve sua sequência ativa!');
    }
  };

  const handleSubmitWriting = (payload: {
    topicId: string;
    topicTitle: string;
    promptPt: string;
    responseText: string;
  }) => {
    if (!currentUser) return;
    const linked =
      currentUser.role === 'teacher' ||
      Boolean(currentUser.assignedTeacherId || currentUser.classId);
    if (!linked) {
      showToast('Vincule-se a um professor para enviar redações para correção.');
      setShowTeacherLinkModal(true);
      return;
    }
    const targetTeacherId =
      currentUser.assignedTeacherId ||
      state.classes.find((c) => c.id === currentUser.classId)?.teacherId;
    const timestamp = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    setState((prev) => ({
      ...prev,
      submissions: [
        {
          id: `sub-w-${Date.now()}`,
          languageCode: activeLanguage,
          type: 'writing',
          studentId: currentUser.id,
          studentName: currentUser.name,
          classId: currentUser.classId,
          teacherId: targetTeacherId,
          topicId: payload.topicId,
          topicTitle: payload.topicTitle,
          promptPt: payload.promptPt,
          responseText: payload.responseText,
          createdAt: timestamp,
          createdAtIso: new Date().toISOString(),
          status: 'pending',
        },
        ...prev.submissions,
      ],
    }));
    showToast('Redação enviada para o Modo Professor!');
  };

  const handleSubmitSpeaking = (payload: {
    topicId: string;
    topicTitle: string;
    promptPt: string;
    targetSentence: string;
    responseText: string;
    audioId: string;
    audioBlob?: Blob;
    audioDurationSec: number;
    autoPronunciationScore?: number;
  }) => {
    if (!currentUser) return;
    const linked =
      currentUser.role === 'teacher' ||
      Boolean(currentUser.assignedTeacherId || currentUser.classId);
    if (!linked) {
      showToast('Vincule-se a um professor para enviar áudios para correção.');
      setShowTeacherLinkModal(true);
      return;
    }
    const targetTeacherId =
      currentUser.assignedTeacherId ||
      state.classes.find((c) => c.id === currentUser.classId)?.teacherId;
    const submissionId = `sub-s-${Date.now()}`;
    const cloudConfigSnapshot = state.cloudConfig;
    const timestamp = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    setState((prev) => ({
      ...prev,
      submissions: [
        {
          id: submissionId,
          languageCode: activeLanguage,
          type: 'speaking',
          studentId: currentUser.id,
          studentName: currentUser.name,
          classId: currentUser.classId,
          teacherId: targetTeacherId,
          topicId: payload.topicId,
          topicTitle: payload.topicTitle,
          promptPt: payload.promptPt,
          targetSentence: payload.targetSentence,
          responseText: payload.responseText,
          audioId: payload.audioId,
          audioDurationSec: payload.audioDurationSec,
          autoPronunciationScore: payload.autoPronunciationScore,
          createdAt: timestamp,
          createdAtIso: new Date().toISOString(),
          status: 'pending',
        },
        ...prev.submissions,
      ],
    }));
    showToast('Áudio enviado para o Professor avaliar sua pronúncia!');

    void (async () => {
      const blob = payload.audioBlob ?? (await getAudioClip(payload.audioId));
      if (!blob) return;
      const uploaded = await uploadSpeakingAudioToCloud(
        blob,
        submissionId,
        cloudConfigSnapshot,
      );
      if (!uploaded.audioPath && !uploaded.audioDataUrl) return;

      setState((prev) => ({
        ...prev,
        submissions: prev.submissions.map((sub) =>
          sub.id === submissionId
            ? {
              ...sub,
              audioPath: uploaded.audioPath ?? sub.audioPath,
              audioDataUrl: uploaded.audioDataUrl ?? sub.audioDataUrl,
            }
            : sub,
        ),
      }));
    })();
  };

  const handleRateVocab = (cardId: string, rating: SrsRating) => {
    updateCurrentUser((u) => {
      const base = recordStudyActivity(u).user;
      return {
        ...base,
        xp: base.xp + 5,
        vocab: base.vocab.map((c) =>
          c.id === cardId ? reviewVocabCardSM2(c, rating) : c,
        ),
        dailyQuests: {
          ...base.dailyQuests,
          vocabReviewedToday: base.dailyQuests.vocabReviewedToday + 1,
        },
      };
    });
  };

  const handleTutorSessionComplete = (xpEarned: number) => {
    updateCurrentUser((u) => {
      const base = recordStudyActivity(u).user;
      return {
        ...base,
        xp: base.xp + xpEarned,
        todayMinutes: base.todayMinutes + 5,
        skillScores: {
          ...base.skillScores,
          speaking: Math.min(100, base.skillScores.speaking + 4),
          writing: Math.min(100, base.skillScores.writing + 3),
        },
        dailyQuests: {
          ...base.dailyQuests,
          tutorSessionsToday: base.dailyQuests.tutorSessionsToday + 1,
        },
      };
    });
    showToast(`+${xpEarned} XP no Tutor de Conversação IA!`);
  };

  const handleClaimDailyQuest = (questId: string, bonusXp: number) => {
    if (!currentUser) return;
    if (currentUser.dailyQuests.claimedQuestIds.includes(questId)) return;
    playSound('levelup');
    updateCurrentUser((u) => ({
      ...u,
      xp: u.xp + bonusXp,
      dailyQuests: {
        ...u.dailyQuests,
        claimedQuestIds: [...u.dailyQuests.claimedQuestIds, questId],
      },
    }));
    showToast(`Missão concluída! +${bonusXp} XP resgatados!`);
  };

  const handleCompletePlacement = (recommendedLevel: CEFRLevel) => {
    updateCurrentUser((u) => ({
      ...u,
      recommendedLevel,
      recommendedLevelByLanguage: {
        ...(u.recommendedLevelByLanguage ?? {}),
        [activeLanguage]: recommendedLevel,
      },
      xp: u.xp + 40,
    }));
    setPathFilterLevel(recommendedLevel);
    setShowPlacementModal(false);
    setActiveView('learn');
    showToast(
      `Nível indicado em ${activeCourse.namePt}: ${recommendedLevel} (+40 XP)!`,
    );
  };

  const handleUnlockCertificate = (level: CEFRLevel) => {
    if (!currentUser) return;
    if (
      currentUser.issuedCertificates.some(
        (c) =>
          c.level === level &&
          (c.languageCode ?? 'en') === activeLanguage,
      )
    ) {
      return;
    }
    const cert = buildCertificate(
      currentUser,
      level,
      state.teacherName,
      activeLanguage,
    );
    updateCurrentUser((u) => ({
      ...u,
      issuedCertificates: [...u.issuedCertificates, cert],
    }));
    showToast(`Certificado CEFR ${level} (${activeCourse.namePt}) emitido com sucesso!`);
  };

  const handleGradeSubmission = (
    submissionId: string,
    payload: {
      teacherFeedback: string;
      correctedText: string;
      teacherBadge: string;
      pronunciationRubric?: PronunciationRubric;
    },
  ) => {
    setState((prev) => ({
      ...prev,
      submissions: prev.submissions.map((sub) =>
        sub.id === submissionId
          ? {
            ...sub,
            status: 'reviewed',
            teacherFeedback: payload.teacherFeedback,
            correctedText: payload.correctedText || undefined,
            teacherBadge: payload.teacherBadge,
            pronunciationRubric: payload.pronunciationRubric,
          }
          : sub,
      ),
    }));
    showToast('Correção publicada! O aluno já pode visualizar na Trilha.');
  };

  const handleCreateClass = (payload: {
    name: string;
    level: CEFRLevel;
    schedule: string;
    description: string;
  }) => {
    const slug = payload.name
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 4)
      .toUpperCase();
    const code = `${slug || 'FB'}-${payload.level}-${Math.floor(10 + Math.random() * 89)}`;
    setState((prev) => ({
      ...prev,
      classes: [
        {
          id: `class-${Date.now()}`,
          languageCode: 'en',
          name: payload.name,
          teacherId: currentUser?.id,
          code,
          level: payload.level,
          schedule: payload.schedule,
          description: payload.description,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...prev.classes,
      ],
    }));
    showToast(`Turma "${payload.name}" criada · Código: ${code}`);
  };

  const handleDeleteClass = (classId: string) => {
    setState((prev) => ({
      ...prev,
      classes: prev.classes.filter((c) => c.id !== classId),
      users: prev.users.map((u) =>
        u.classId === classId ? { ...u, classId: undefined } : u,
      ),
      deletedClassIds: Array.from(
        new Set([...(prev.deletedClassIds ?? []), classId]),
      ),
    }));
    showToast('Turma removida.');
  };

  const handleIssueCertificateToStudent = (
    studentId: string,
    level: CEFRLevel,
  ) => {
    const target = state.users.find((u) => u.id === studentId);
    if (!target) return;
    if (target.issuedCertificates.some((c) => c.level === level)) return;
    const cert = buildCertificate(target, level, state.teacherName, 'en');
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === studentId
          ? { ...u, issuedCertificates: [...u.issuedCertificates, cert] }
          : u,
      ),
    }));
    showToast(`Certificado ${level} emitido para ${target.name}!`);
  };

  const handleAddCustomTopic = (topic: Topic) => {
    setState((prev) => ({
      ...prev,
      customTopics: [topic, ...prev.customTopics],
    }));
    showToast(`Tópico "${topic.titlePt}" publicado na Trilha!`);
  };

  const handleDeleteCustomTopic = (topicId: string) => {
    setState((prev) => ({
      ...prev,
      customTopics: prev.customTopics.filter((t) => t.id !== topicId),
      deletedTopicIds: Array.from(
        new Set([...(prev.deletedTopicIds ?? []), topicId]),
      ),
    }));
    showToast('Tópico removido.');
  };

  const handleToggleUserRole = (userId: string) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => {
        if (u.id !== userId) return u;
        if (u.isMasterAdmin || isMasterAdminEmail(u.email)) return u;
        return { ...u, role: u.role === 'teacher' ? 'student' : 'teacher' };
      }),
    }));
    showToast('Perfil de usuário atualizado!');
  };

  const handleMoveUserClass = (userId: string, classId?: string) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, classId } : u)),
    }));
    showToast('Turma do usuário atualizada.');
  };

  const handleDeleteUser = (userId: string) => {
    setState((prev) => {
      const target = prev.users.find((u) => u.id === userId);
      const canDelete =
        target && !target.isMasterAdmin && !isMasterAdminEmail(target.email);
      return {
        ...prev,
        users: prev.users.filter(
          (u) =>
            u.id !== userId ||
            Boolean(u.isMasterAdmin || isMasterAdminEmail(u.email)),
        ),
        deletedUserIds: canDelete
          ? Array.from(new Set([...(prev.deletedUserIds ?? []), userId]))
          : prev.deletedUserIds,
      };
    });
    showToast('Usuário removido.');
  };

  const handleUpdateTeacherAccessCode = (nextCode: string) => {
    const cleaned = nextCode.trim().toUpperCase();
    if (!cleaned) return;
    setState((prev) => ({ ...prev, teacherAccessCode: cleaned }));
    showToast(`Código de cadastro de professor atualizado: ${cleaned}`);
  };

  const handleToggleBlockUser = (userId: string, reason?: string) => {
    let wasBlocked = false;
    let targetName = '';
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => {
        if (u.id !== userId) return u;
        if (u.isMasterAdmin || isMasterAdminEmail(u.email)) return u;
        wasBlocked = Boolean(u.blocked);
        targetName = u.name;
        return {
          ...u,
          blocked: !u.blocked,
          blockedReason: !u.blocked ? reason?.trim() || undefined : undefined,
        };
      }),
    }));
    if (targetName) {
      showToast(
        wasBlocked
          ? `Acesso de ${targetName} liberado!`
          : `Acesso de ${targetName} bloqueado.`,
      );
    }
  };

  const handleResetUserLocalPassword = (userId: string, newPassword: string) => {
    if (!newPassword.trim()) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId ? { ...u, password: hashPassword(newPassword) } : u,
      ),
    }));
    showToast('Senha local do usuário redefinida!');
  };

  const handleCreateAssignment = (payload: {
    title: string;
    description: string;
    classId?: string;
    studentId?: string;
    languageCode: LanguageCode;
    topicId?: string;
    dueDate: string;
  }) => {
    const newAssignment = {
      id: `assign-${Date.now()}`,
      title: payload.title.trim(),
      description: payload.description.trim(),
      classId: payload.classId || undefined,
      studentId: payload.studentId || undefined,
      teacherId: currentUser?.id,
      languageCode: payload.languageCode,
      topicId: payload.topicId || undefined,
      dueDate: payload.dueDate,
      createdAt: new Date().toISOString().slice(0, 10),
      createdBy: currentUser?.name ?? state.teacherName,
    };
    setState((prev) => ({
      ...prev,
      assignments: [newAssignment, ...(prev.assignments ?? [])],
    }));
    showToast(`Tarefa "${newAssignment.title}" enviada!`);
  };

  const handleLinkStudentToTeacher = (studentId: string, teacherId: string) => {
    const teacher = state.users.find(
      (u) => u.id === teacherId && u.role === 'teacher',
    );
    if (!teacher) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === studentId
          ? {
            ...u,
            assignedTeacherId: teacherId,
            enrollmentType: 'vip',
            unlinkedNoticePending: false,
            unlinkedByTeacherName: undefined,
          }
          : u,
      ),
    }));
    setShowTeacherLinkModal(false);
    showToast(`Aluno vinculado ao(à) Prof. ${teacher.name}!`);
  };

  const handleUnlinkStudentFromTeacher = (studentId: string, bySelf = false) => {
    const target = state.users.find((u) => u.id === studentId);
    if (!target) return;
    const unlinkedBy = currentUser?.name ?? state.teacherName;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === studentId
          ? {
            ...u,
            assignedTeacherId: undefined,
            classId: undefined,
            enrollmentType: 'independent',
            unlinkedNoticePending: !bySelf,
            unlinkedByTeacherName: bySelf ? undefined : unlinkedBy,
          }
          : u,
      ),
    }));
    showToast(
      bySelf
        ? 'Você agora está no modo autônomo (sem vínculo docente).'
        : `${target.name} foi desvinculado(a). O aluno será avisado no próximo login.`,
    );
  };

  const handleConfirmIndependentMode = () => {
    if (!currentUser) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === currentUser.id
          ? {
            ...u,
            assignedTeacherId: undefined,
            classId: undefined,
            enrollmentType: 'independent',
            unlinkedNoticePending: false,
            unlinkedByTeacherName: undefined,
          }
          : u,
      ),
    }));
    setShowTeacherLinkModal(false);
    showToast('Modo autônomo confirmado. Você pode se vincular quando quiser.');
  };

  const handleUpdateTeacherInviteCode = (teacherId: string, code: string) => {
    const clean = code
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '');
    if (clean.length < 4) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === teacherId ? { ...u, teacherInviteCode: clean } : u,
      ),
    }));
    showToast(`Código VIP atualizado para ${clean}!`);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setState((prev) => ({
      ...prev,
      assignments: (prev.assignments ?? []).filter((a) => a.id !== assignmentId),
      deletedAssignmentIds: Array.from(
        new Set([...(prev.deletedAssignmentIds ?? []), assignmentId]),
      ),
    }));
    showToast('Tarefa removida.');
  };

  if (!currentUser) {
    if (!dismissedWebGateway && isWebPlatform()) {
      return (
        <AppDownloadGateway
          mode="landing"
          schoolName={state.schoolName}
          onContinueWeb={(remember) => {
            if (remember && typeof window !== 'undefined') {
              window.localStorage.setItem('fluentbridge_prefer_web', '1');
            }
            setDismissedWebGateway(true);
          }}
        />
      );
    }
    return (
      <>
        <AuthScreen
          schoolName={state.schoolName}
          teacherName={state.teacherName}
          teacherAccessCode={state.teacherAccessCode}
          users={state.users}
          classes={state.classes}
          cloudConfigured={isCloudConfigured}
          onOpenDownloadModal={() => setShowDownloadModal(true)}
          onLogin={handleLogin}
          onEmailAuthLogin={handleEmailAuthLogin}
          onGoogleLogin={handleGoogleLogin}
          onRegister={handleRegister}
        />
        {showDownloadModal && (
          <AppDownloadGateway
            mode="modal"
            schoolName={state.schoolName}
            onContinueWeb={() => setShowDownloadModal(false)}
            onClose={() => setShowDownloadModal(false)}
          />
        )}
      </>
    );
  }

  const handleCycleTheme = () => {
    const next = nextThemeMode(themeMode);
    setThemeMode(next);
    updateCurrentUser((u) => ({ ...u, themeMode: next }));
    const label = next === 'dark' ? 'Escuro' : next === 'system' ? 'Automático' : 'Claro';
    showToast(`Tema alterado para ${label}`);
  };

  const handleToggleReminder = async () => {
    if (!currentUser) return;
    const nextEnabled = !currentUser.reminderEnabled;
    const targetTime = currentUser.reminderTime ?? '19:30';
    const res = await scheduleDailyStudyReminder(nextEnabled, targetTime);
    if (res.ok) {
      updateCurrentUser((u) => ({
        ...u,
        reminderEnabled: nextEnabled,
        reminderTime: targetTime,
      }));
    }
    showToast(res.message);
  };

  const handleSaveTopicProgress = (
    topicId: string,
    progress: import('./types/learning').TopicProgressRecord,
  ) => {
    updateCurrentUser((u) => ({
      ...u,
      topicStepProgress: {
        ...(u.topicStepProgress ?? {}),
        [topicId]: progress,
      },
    }));
  };

  const handleUnlockVocab = (vocabIds: string[]) => {
    if (vocabIds.length === 0) return;
    updateCurrentUser((u) => {
      const merged = Array.from(
        new Set([...(u.learnedVocabIds ?? []), ...vocabIds]),
      );
      if (merged.length === (u.learnedVocabIds?.length ?? 0)) return u;
      return { ...u, learnedVocabIds: merged };
    });
  };

  const handleRecordMistake = (payload: {
    topicId: string;
    topicTitle: string;
    skill: SkillType | 'grammar' | 'vocab';
    prompt: string;
    studentAnswer: string;
    expectedAnswer: string;
    explanation: string;
  }) => {
    updateCurrentUser((u) => ({
      ...u,
      mistakeBank: addMistakeEntry(u.mistakeBank, {
        ...payload,
        languageCode: u.activeLanguage,
      }),
    }));
  };

  const handleResolveMistake = (mistakeId: string, resolved: boolean) => {
    updateCurrentUser((u) => ({
      ...u,
      xp: resolved ? u.xp + 10 : u.xp,
      mistakeBank: markMistakeResolved(u.mistakeBank, mistakeId, resolved),
    }));
    if (resolved) {
      showToast('Erro marcado como dominado! +10 XP');
    }
  };

  const handleRecordPronunciation = (payload: {
    languageCode: LanguageCode;
    topicId: string;
    score: number;
    weakWords: string[];
  }) => {
    updateCurrentUser((u) => ({
      ...u,
      pronunciationHistory: [
        ...(u.pronunciationHistory ?? []).slice(-119),
        {
          id: `pron-${Date.now()}`,
          languageCode: payload.languageCode,
          topicId: payload.topicId,
          score: payload.score,
          weakWords: payload.weakWords,
          createdAt: new Date().toISOString().slice(0, 10),
        },
      ],
    }));
  };

  const handleCompleteMockExam = (attempt: ExamAttemptRecord) => {
    const earnedXp = attempt.passed ? 60 : 35;
    const wk = getCurrentWeekKey();
    updateCurrentUser((u) => {
      const prevWeekly = u.weeklyXpWeekKey === wk ? u.weeklyXpByLanguage?.[attempt.languageCode] ?? 0 : 0;
      return {
        ...u,
        xp: u.xp + earnedXp,
        xpByLanguage: {
          ...(u.xpByLanguage ?? {}),
          [attempt.languageCode]: (u.xpByLanguage?.[attempt.languageCode] ?? 0) + earnedXp,
        },
        weeklyXpWeekKey: wk,
        weeklyXpByLanguage: {
          ...(u.weeklyXpWeekKey === wk ? u.weeklyXpByLanguage ?? {} : {}),
          [attempt.languageCode]: prevWeekly + earnedXp,
        },
        examAttempts: [...(u.examAttempts ?? []).slice(-99), attempt],
      };
    });
    showToast(`Simulado concluído (${attempt.officialScoreLabel})! +${earnedXp} XP`);
  };

  const handleCreateCommunityPost = (payload: {
    languageCode: LanguageCode;
    level: CEFRLevel;
    category: CommunityPost['category'];
    title: string;
    body: string;
    targetSnippet?: string;
  }) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      languageCode: payload.languageCode,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatarColor: currentUser.avatarColor,
      authorRole: currentUser.role,
      level: payload.level,
      category: payload.category,
      title: payload.title,
      body: payload.body,
      targetSnippet: payload.targetSnippet,
      likes: [],
      replies: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((prev) => ({
      ...prev,
      communityPosts: [newPost, ...(prev.communityPosts ?? [])],
    }));
    showToast('Publicação enviada para o fórum!');
  };

  const handleReplyCommunityPost = (
    postId: string,
    content: string,
    correctionSuggestion?: string,
  ) => {
    const wk = getCurrentWeekKey();
    setState((prev) => ({
      ...prev,
      communityPosts: (prev.communityPosts ?? []).map((p) =>
        p.id === postId
          ? {
              ...p,
              replies: [
                ...p.replies,
                {
                  id: `rep-${Date.now()}`,
                  authorId: currentUser.id,
                  authorName: currentUser.name,
                  authorAvatarColor: currentUser.avatarColor,
                  authorRole: currentUser.role,
                  content,
                  correctionSuggestion,
                  likes: [],
                  createdAt: new Date().toISOString().slice(0, 10),
                },
              ],
            }
          : p,
      ),
    }));
    updateCurrentUser((u) => {
      const prevWeekly = u.weeklyXpWeekKey === wk ? u.weeklyXpByLanguage?.[activeLanguage] ?? 0 : 0;
      return {
        ...u,
        xp: u.xp + 5,
        xpByLanguage: {
          ...(u.xpByLanguage ?? {}),
          [activeLanguage]: (u.xpByLanguage?.[activeLanguage] ?? 0) + 5,
        },
        weeklyXpWeekKey: wk,
        weeklyXpByLanguage: {
          ...(u.weeklyXpWeekKey === wk ? u.weeklyXpByLanguage ?? {} : {}),
          [activeLanguage]: prevWeekly + 5,
        },
      };
    });
    showToast('Resposta enviada! +5 XP na comunidade');
  };

  const handleToggleLikePost = (postId: string) => {
    setState((prev) => ({
      ...prev,
      communityPosts: (prev.communityPosts ?? []).map((p) => {
        if (p.id !== postId) return p;
        const has = p.likes.includes(currentUser.id);
        return {
          ...p,
          likes: has ? p.likes.filter((id) => id !== currentUser.id) : [...p.likes, currentUser.id],
        };
      }),
    }));
  };

  const handleDeleteCommunityPost = (postId: string) => {
    setState((prev) => ({
      ...prev,
      communityPosts: (prev.communityPosts ?? []).filter((p) => p.id !== postId),
      deletedCommunityPostIds: Array.from(
        new Set([...(prev.deletedCommunityPostIds ?? []), postId]),
      ),
    }));
    showToast('Publicação removida.');
  };

  const handleRunAudioRetentionCleanup = async (): Promise<string> => {
    const res = await purgeExpiredSpeakingAudios(
      state.submissions,
      state.cloudConfig,
    );
    if (res.purgedCount === 0) {
      showToast('Nenhum áudio expirado (> 60 dias) encontrado.');
      return 'Nenhum áudio expirado encontrado.';
    }
    setState((prev) => ({
      ...prev,
      submissions: res.nextSubmissions,
    }));
    const msg = `${res.purgedCount} áudio(s) > 60 dias limpos (feedbacks escritos preservados).`;
    showToast(msg);
    return msg;
  };
  const pendingSubmissionsCount = state.submissions.filter(
    (s) => s.status === 'pending',
  ).length;

  const reviewedForUser = state.submissions.filter(
    (s) =>
      s.status === 'reviewed' &&
      (currentUser.role === 'teacher' || s.studentId === currentUser.id),
  );

  const userClassName = state.classes.find(
    (c) => c.id === currentUser.classId,
  )?.name;

  const teachersList = state.users.filter((u) => u.role === 'teacher');
  const assignedTeacher = currentUser.assignedTeacherId
    ? teachersList.find((t) => t.id === currentUser.assignedTeacherId)
    : undefined;
  const hasLinkedTeacher =
    currentUser.role === 'teacher' ||
    Boolean(currentUser.assignedTeacherId || currentUser.classId);

  const classmates = state.users.filter((u) => u.role === 'student');

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9FC] lg:flex-row">
      <Sidebar
        activeView={activeView}
        onChangeView={setActiveView}
        schoolName={state.schoolName}
        teacherName={state.teacherName}
        user={currentUser}
        activeCourse={activeCourse}
        activeDialect={activeDialect}
        topicsCount={courseTopics.length}
        vocabCount={unlockedCourseVocab.length}
        classNameLabel={userClassName}
        onChangeLanguage={handleChangeLanguage}
        onChangeDialect={handleChangeDialect}
        dueVocabCount={dueVocabCount}
        pendingSubmissionsCount={pendingSubmissionsCount}
        themeMode={themeMode}
        onCycleTheme={handleCycleTheme}
        onOpenDownloadModal={() => setShowDownloadModal(true)}
        onLogout={handleLogout}
      />

      <main
        dir={isRtlLanguage(activeLanguage) ? 'rtl' : 'ltr'}
        className="safe-main-pb flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 lg:pb-10"
      >
        {activeView === 'learn' && (
          <LearningPath
            currentUser={currentUser}
            teacherName={state.teacherName}
            assignedTeacherName={assignedTeacher?.name}
            activeCourse={activeCourse}
            classNameLabel={userClassName}
            topics={courseTopics}
            classmates={classmates}
            initialFilterLevel={pathFilterLevel}
            onOpenPlacementTest={() => setShowPlacementModal(true)}
            onOpenTeacherLink={() => setShowTeacherLinkModal(true)}
            onSelfUnlinkTeacher={() =>
              handleUnlinkStudentFromTeacher(currentUser.id, true)
            }
            onClaimDailyQuest={handleClaimDailyQuest}
            onChangeDailyGoal={(dailyGoalMinutes) =>
              updateCurrentUser((u) => ({ ...u, dailyGoalMinutes }))
            }
            onToggleReminder={() => void handleToggleReminder()}
            onStartTopic={(topic) => setActiveTopic(topic)}
            onPracticeTopicWithAI={(topic) => {
              setTutorTargetTopic(topic);
              setActiveTopic(null);
              setActiveView('tutor');
            }}
            reviewedSubmissions={reviewedForUser}
            assignments={state.assignments}
            onGoToTeacher={
              currentUser.role === 'teacher'
                ? () => {
                  setTeacherInitialTab('corrections');
                  setActiveView('teacher');
                }
                : undefined
            }
          />
        )}

        <Suspense
          fallback={
            <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500">
              Carregando módulo...
            </div>
          }
        >
          {activeView === 'tutor' && (
            <AITutor
              accent={currentUser.accent}
              languageCode={activeLanguage}
              activeDialect={activeDialect}
              geminiApiKey={effectiveGeminiKey}
              topics={courseTopics}
              initialTopic={tutorTargetTopic}
              onClearInitialTopic={() => setTutorTargetTopic(null)}
              onCompleteSession={handleTutorSessionComplete}
            />
          )}

          {activeView === 'review' && (
            <VocabReview
              vocab={unlockedCourseVocab}
              allCourseVocab={courseVocab}
              topics={courseTopics}
              languageCode={activeLanguage}
              mistakes={currentUser.mistakeBank ?? []}
              pronunciationHistory={currentUser.pronunciationHistory ?? []}
              onResolveMistake={handleResolveMistake}
              onRateCard={handleRateVocab}
              onGoToLearn={() => setActiveView('learn')}
            />
          )}

          {activeView === 'exams' && (
            <MockExamHub
              activeCourse={activeCourse}
              pastAttempts={currentUser.examAttempts ?? []}
              onCompleteExam={handleCompleteMockExam}
            />
          )}

          {activeView === 'community' && (
            <CommunityHub
              currentUser={currentUser}
              users={state.users}
              activeCourse={activeCourse}
              posts={state.communityPosts ?? []}
              onCreatePost={handleCreateCommunityPost}
              onReplyPost={handleReplyCommunityPost}
              onToggleLikePost={handleToggleLikePost}
              onDeletePost={handleDeleteCommunityPost}
            />
          )}

          {activeView === 'tips' && (
            <TipsLibrary
              topics={courseTopics}
              languageCode={activeLanguage}
              onPracticeTopic={(topic) => setActiveTopic(topic)}
              onPracticeTopicWithAI={(topic) => {
                setTutorTargetTopic(topic);
                setActiveTopic(null);
                setActiveView('tutor');
              }}
            />
          )}

          {activeView === 'certificates' && (
            <CertificatesView
              user={currentUser}
              topics={courseTopics}
              schoolName={state.schoolName}
              teacherName={state.teacherName}
              className={userClassName}
              onUnlockCertificate={handleUnlockCertificate}
              onGoToTeacherClasses={
                currentUser.role === 'teacher'
                  ? () => {
                    setTeacherInitialTab('classes');
                    setActiveView('teacher');
                  }
                  : undefined
              }
            />
          )}

          {activeView === 'teacher' && currentUser.role === 'teacher' && (
            <TeacherStudio
              state={state}
              currentUser={currentUser}
              autoSyncStatus={autoSyncStatus}
              initialTab={teacherInitialTab}
              onGradeSubmission={handleGradeSubmission}
              onCreateClass={handleCreateClass}
              onDeleteClass={handleDeleteClass}
              onIssueCertificateToStudent={handleIssueCertificateToStudent}
              onAddCustomTopic={handleAddCustomTopic}
              onDeleteCustomTopic={handleDeleteCustomTopic}
              onUpdateSettings={(settings) => {
                setState((prev) => ({ ...prev, ...settings }));
                showToast('Configurações da escola atualizadas!');
              }}
              onUpdateCloudConfig={(cloudConfig: CloudConfig) =>
                setState((prev) => ({ ...prev, cloudConfig }))
              }
              onApplyCloudSnapshot={(snapshot) => {
                skipNextCloudPushRef.current = true;
                const normalized = normalizePlatformState(
                  { ...snapshot, currentUserId: state.currentUserId },
                  DEFAULT_PLATFORM_STATE,
                  ALL_INITIAL_VOCABULARY,
                );
                setState(normalized);
                showToast('Estado da nuvem aplicado!');
              }}
              onImportState={(imported) => {
                setState(
                  normalizePlatformState(
                    imported,
                    DEFAULT_PLATFORM_STATE,
                    ALL_INITIAL_VOCABULARY,
                  ),
                );
                showToast('Backup importado com sucesso!');
              }}
              onResetDemo={() => {
                clearPlatformState();
                setState(
                  normalizePlatformState(
                    {
                      ...DEFAULT_PLATFORM_STATE,
                      currentUserId: state.currentUserId,
                    },
                    DEFAULT_PLATFORM_STATE,
                    ALL_INITIAL_VOCABULARY,
                  ),
                );
                showToast('Dados de demonstração restaurados.');
              }}
              onPlayTopic={(topic) => setActiveTopic(topic)}
              onToggleUserRole={handleToggleUserRole}
              onMoveUserClass={handleMoveUserClass}
              onDeleteUser={handleDeleteUser}
              onLinkStudentToTeacher={handleLinkStudentToTeacher}
              onUnlinkStudentFromTeacher={(studentId) =>
                handleUnlinkStudentFromTeacher(studentId, false)
              }
              onCreateAssignment={handleCreateAssignment}
              onDeleteAssignment={handleDeleteAssignment}
            />
          )}

          {activeView === 'admin' &&
            (currentUser.isMasterAdmin ||
              isMasterAdminEmail(currentUser.email)) && (
              <AdminPanel
                state={state}
                currentUser={currentUser}
                totalBuiltinTopicsCount={ALL_BUILTIN_TOPICS.length}
                autoSyncStatus={autoSyncStatus}
                onUpdateTeacherAccessCode={handleUpdateTeacherAccessCode}
                onUpdateTeacherInviteCode={handleUpdateTeacherInviteCode}
                onToggleBlockUser={handleToggleBlockUser}
                onToggleUserRole={handleToggleUserRole}
                onMoveUserClass={handleMoveUserClass}
                onLinkStudentToTeacher={handleLinkStudentToTeacher}
                onUnlinkStudentFromTeacher={(studentId) =>
                  handleUnlinkStudentFromTeacher(studentId, false)
                }
                onResetUserLocalPassword={handleResetUserLocalPassword}
                onDeleteUser={handleDeleteUser}
                onGoToTeacherStudio={() => setActiveView('teacher')}
                onRunAudioRetentionCleanup={handleRunAudioRetentionCleanup}
              />
            )}
        </Suspense>
      </main>

      <Suspense fallback={null}>
        {showPlacementModal && (
          <PlacementTestModal
            languageCode={activeLanguage}
            onClose={() => setShowPlacementModal(false)}
            onCompletePlacement={(lvl) => handleCompletePlacement(lvl)}
          />
        )}

        {activeTopic && (
          <LessonPlayer
            key={activeTopic.id}
            topic={activeTopic}
            topicVocab={courseVocab.filter((v) => v.topicId === activeTopic.id)}
            initialStepIdx={
              currentUser.completedTopicIds.includes(activeTopic.id)
                ? 0
                : currentUser.topicStepProgress?.[activeTopic.id]?.stepIdx ?? 0
            }
            initialCompletedSteps={
              currentUser.completedTopicIds.includes(activeTopic.id)
                ? []
                : currentUser.topicStepProgress?.[activeTopic.id]?.completedSteps ?? []
            }
            dialectCode={
              activeTopic.languageCode && activeTopic.languageCode !== activeLanguage
                ? getActiveDialect(
                  activeTopic.languageCode,
                  currentUser.dialectByLanguage,
                  currentUser.accent,
                )
                : activeDialect
            }
            dialects={
              getLanguageCourse(activeTopic.languageCode ?? activeLanguage).dialects
            }
            studentName={currentUser.name}
            hasLinkedTeacher={hasLinkedTeacher}
            onRequestTeacherLink={() => {
              setActiveTopic(null);
              setShowTeacherLinkModal(true);
            }}
            onChangeDialect={handleChangeDialect}
            onSaveProgress={handleSaveTopicProgress}
            onUnlockVocab={handleUnlockVocab}
            onRecordMistake={handleRecordMistake}
            onRecordPronunciation={handleRecordPronunciation}
            onSubmitWriting={handleSubmitWriting}
            onSubmitSpeaking={handleSubmitSpeaking}
            onCompleteLesson={handleCompleteLesson}
            onGoToReview={() => setActiveView('review')}
            onPracticeWithAI={(topic) => {
              setTutorTargetTopic(topic);
              setActiveTopic(null);
              setActiveView('tutor');
            }}
            onClose={() => setActiveTopic(null)}
          />
        )}
      </Suspense>

      <TeacherLinkModal
        open={
          currentUser.role === 'student' &&
          (Boolean(currentUser.unlinkedNoticePending) || showTeacherLinkModal)
        }
        student={currentUser}
        teachers={teachersList}
        mandatoryPrompt={Boolean(currentUser.unlinkedNoticePending)}
        onLinkToTeacher={(teacherId) =>
          handleLinkStudentToTeacher(currentUser.id, teacherId)
        }
        onConfirmIndependent={handleConfirmIndependentMode}
        onClose={() => setShowTeacherLinkModal(false)}
      />

      {showDownloadModal && (
        <AppDownloadGateway
          mode="modal"
          schoolName={state.schoolName}
          onContinueWeb={() => setShowDownloadModal(false)}
          onClose={() => setShowDownloadModal(false)}
        />
      )}

      {toastMessage && (
        <div className="animate-fade-up fixed right-5 bottom-20 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl lg:bottom-6">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;

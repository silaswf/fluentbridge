/**
 * @file src/App.tsx
 * @description Orquestrador raiz do FluentBridge: gerencia autenticação, estado global, troca de idioma/curso, tema, i18n, banner PT PLE, sync Supabase e renderização lazy de todas as views.
 * @exports App
 */
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  getEffectiveGeminiKey,
  getEffectiveSupabaseConfig,
  isMasterAdminEmail,
} from './config/appConfig';
import { getAudioClip } from './utils/audioDb';
import {
  deleteMyCloudAccount,
  pushStateToCloud,
  registerNativeOAuthListener,
  signInWithSupabaseEmail,
  signInWithSupabaseGoogle,
  signOutSupabase,
  signUpWithSupabaseEmail,
  subscribeSupabaseAuthChanges,
  syncRelationalTablesBestEffort,
  uploadSpeakingAudioToCloud,
  type SupabaseAuthUserInfo,
} from './utils/cloudSync';
import { AppDownloadGateway } from './components/AppDownloadGateway';
import { AppUpdateModal } from './components/AppUpdateModal';
import { AuthScreen } from './components/AuthScreen';
import { PrivacyLgpdModal } from './components/PrivacyLgpdModal';
import { SettingsModal } from './components/SettingsModal';
import { ViewSkeleton } from './components/ViewSkeleton';
import { checkForAppUpdate, type AppUpdateInfo } from './utils/appUpdater';
import {
  clearOfflineOutbox,
  enqueueOfflineMutation,
  flushProgressOutbox,
  getPendingOutboxCount,
} from './utils/offlineOutbox';
import { reportClientError } from './utils/telemetry';
import { getTeacherDisplayName } from './utils/teacherDisplay';
import { LearningPath } from './components/LearningPath';
import { Sidebar, type NavView } from './components/Sidebar';
import { TeacherLinkModal } from './components/TeacherLinkModal';
import type { TeacherTab } from './components/TeacherStudio';
import { useCloudSyncController } from './hooks/useCloudSyncController';
import { purgeExpiredSpeakingAudios } from './utils/audioRetention';
import { getCurrentWeekKey } from './utils/communityEngine';
import { acceptCorrectionReply, togglePostReaction } from './utils/communityActions';
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
const CourseTranslatorView = lazy(() =>
  import('./components/CourseTranslatorView').then((m) => ({
    default: m.CourseTranslatorView,
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
const LiveClassroomView = lazy(() =>
  import('./components/LiveClassroomView').then((m) => ({ default: m.LiveClassroomView })),
);
import {
  DEFAULT_PLATFORM_STATE,
  getActiveDialectMeta as getActiveDialect,
  getLanguageCourseMeta as getLanguageCourse,
} from './data/platformDefaults';
import {
  getCachedCourseData,
  loadLanguageCourseData,
  type LoadedCourseBundle,
} from './data/courseLoader';
import type {
  Accent,
  CEFRLevel,
  CertificateRecord,
  CloudConfig,
  CommunityPost,
  ExamAttemptRecord,
  LanguageCode,
  LearningGoalType,
  LiveSessionRecord,
  PlatformState,
  PronunciationRubric,
  SkillType,
  StudentEnrollmentType,
  Topic,
  UserProfile,
  UserRole,
} from './types/learning';
import {
  applyFontScale,
  loadStoredFontScale,
  saveFontScale,
  type FontScale,
} from './utils/accessibility';
import {
  loadStoredUiLocale,
  saveUiLocale,
  tUi,
  type UiLocale,
} from './utils/i18n';
import {
  subscribeCommunityRealtime,
  syncCommunityPostToCloud,
  syncCommunityReplyToCloud,
  syncLiveSessionToCloud,
} from './utils/relationalSync';
import { buildPedagogicalMemoryContext } from './utils/tutorMemory';
import { playSound } from './utils/soundFx';
import {
  clearPlatformState,
  generateTeacherInviteCode,
  hashPassword,
  loadPlatformState,
  mergeLoadedLanguageVocab,
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
  const [loadedCourses, setLoadedCourses] = useState<
    Partial<Record<LanguageCode, LoadedCourseBundle>>
  >({});
  const [state, setState] = useState<PlatformState>(() =>
    loadPlatformState(DEFAULT_PLATFORM_STATE, []),
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
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [pendingOutboxCount, setPendingOutboxCount] = useState(0);
  const [appUpdateInfo, setAppUpdateInfo] = useState<AppUpdateInfo | null>(null);
  const [pathFilterLevel, setPathFilterLevel] = useState<'ALL' | CEFRLevel>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => loadStoredThemeMode());
  const [uiLocale, setUiLocale] = useState<UiLocale>(() => loadStoredUiLocale());
  const [ptUiBannerDismissed, setPtUiBannerDismissed] = useState(false);
  const [fontScale, setFontScale] = useState<FontScale>(() => loadStoredFontScale());
  const [realtimeConnected, setRealtimeConnected] = useState(false);
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
    masterVocab: getCachedCourseData(
      (state.users.find((u) => u.id === state.currentUserId)?.activeLanguage ??
        'en') as LanguageCode,
    )?.vocab ?? [],
    onSupabaseUserHydrated: (authUser) => applySupabaseAuthUser(authUser, false),
  });

  useEffect(() => {
    void checkForAppUpdate().then((info) => setAppUpdateInfo(info));
  }, []);

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

  useEffect(() => {
    applyFontScale(fontScale);
    saveFontScale(fontScale);
  }, [fontScale]);

  useEffect(() => {
    saveUiLocale(uiLocale);
  }, [uiLocale]);

  useEffect(() => {
    if (!isCloudConfigured) {
      setRealtimeConnected(false);
      return undefined;
    }
    return subscribeCommunityRealtime(
      () => {
        // Trigger a gentle refresh indicator when remote community changes arrive
      },
      setRealtimeConnected,
    );
  }, [isCloudConfigured]);

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
          tr: 'tr-TR',
          he: 'he-IL',
          nb: 'nb-NO',
          da: 'da-DK',
        },
        accent: 'en-US',
        dailyGoalMinutes: 15,
        todayMinutes: 0,
        xp: 0,
        streakDays: 1,
        completedTopicIds: [],
        skillScores: { listening: 45, reading: 45, speaking: 40, writing: 45 },
        vocab: [...(getCachedCourseData('en')?.vocab ?? [])],
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

  useEffect(() => {
    let cancelled = false;
    void loadLanguageCourseData(activeLanguage).then((bundle) => {
      if (cancelled) return;
      setLoadedCourses((prev) =>
        prev[activeLanguage] ? prev : { ...prev, [activeLanguage]: bundle },
      );
      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) => ({
          ...u,
          vocab: mergeLoadedLanguageVocab(u.vocab, bundle.vocab, activeLanguage),
        })),
      }));
    });
    return () => {
      cancelled = true;
    };
  }, [activeLanguage]);

  const activeDialect = currentUser
    ? getActiveDialect(
      activeLanguage,
      currentUser.dialectByLanguage,
      currentUser.accent,
    )
    : 'en-US';

  const courseTopics = useMemo(() => {
    const builtin = loadedCourses[activeLanguage]?.topics ?? [];
    const custom = state.customTopics.filter(
      (t) => (t.languageCode ?? 'en') === activeLanguage,
    );
    return [...builtin, ...custom];
  }, [loadedCourses, activeLanguage, state.customTopics]);

  const courseVocab = useMemo(() => {
    if (!currentUser) return [];
    const loadedLangVocab = loadedCourses[activeLanguage]?.vocab ?? [];
    if (loadedLangVocab.length > 0) {
      return mergeLoadedLanguageVocab(
        currentUser.vocab,
        loadedLangVocab,
        activeLanguage,
      ).filter((v) => (v.languageCode ?? 'en') === activeLanguage);
    }
    return currentUser.vocab.filter(
      (v) => (v.languageCode ?? 'en') === activeLanguage,
    );
  }, [currentUser, activeLanguage, loadedCourses]);

  const unlockedCourseVocab = useMemo(
    () => (currentUser ? getUnlockedVocabCards(courseVocab, currentUser) : []),
    [courseVocab, currentUser],
  );
  const savedVideoWords = useMemo(
    () => new Set(unlockedCourseVocab.map((v) => v.word.toLowerCase())),
    [unlockedCourseVocab],
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
      vocab: [...(loadedCourses[activeLanguage]?.vocab ?? getCachedCourseData('en')?.vocab ?? [])],
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

        const loadedTopics = loadedCourses[activeLanguage]?.topics ?? [];
        const completedTopicObj = loadedTopics.find(
          (t) => t.id === result.topicId,
        );
        let nextCerts = baseUser.issuedCertificates;

        if (completedTopicObj) {
          const targetLang = completedTopicObj.languageCode ?? 'en';
          const levelTopics = loadedTopics.filter(
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

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      void enqueueOfflineMutation('lesson_complete', {
        topicId: result.topicId,
        xpEarned: result.xpEarned,
        minutesSpent: result.minutesSpent,
      }).then(() => getPendingOutboxCount().then(setPendingOutboxCount));
    }

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

  const handleSaveCustomVocabCard = (payload: {
    word: string;
    translation: string;
    ipa: string;
    exampleEn: string;
    examplePt: string;
    category: string;
  }) => {
    if (!currentUser) return;
    const lowerWord = payload.word.trim().toLowerCase();
    updateCurrentUser((u) => {
      const existing = u.vocab.find(
        (c) =>
          (c.languageCode ?? 'en') === activeLanguage &&
          c.word.trim().toLowerCase() === lowerWord,
      );
      const learned = new Set(u.learnedVocabIds ?? []);
      if (existing) {
        learned.add(existing.id);
        return { ...u, learnedVocabIds: Array.from(learned) };
      }
      const newCardId = `voc-vid-${activeLanguage}-${Date.now()}`;
      learned.add(newCardId);
      return {
        ...u,
        xp: u.xp + 5,
        learnedVocabIds: Array.from(learned),
        vocab: [
          {
            id: newCardId,
            topicId: 'video-immersion',
            languageCode: activeLanguage,
            word: payload.word,
            translation: payload.translation,
            ipa: payload.ipa,
            exampleEn: payload.exampleEn,
            examplePt: payload.examplePt,
            category: payload.category,
            strength: 'weak',
            reviewCount: 0,
            nextReviewAt: new Date().toISOString().slice(0, 10),
          },
          ...u.vocab,
        ],
      };
    });
    showToast(`"${payload.word}" salvo no seu Deck SM-2 (+5 XP)!`);
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
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      void enqueueOfflineMutation('srs_review', { cardId, rating }).then(() =>
        getPendingOutboxCount().then(setPendingOutboxCount),
      );
    }
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
    const teacherDisplay = getTeacherDisplayName(teacher, state.teacherName);
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
    showToast(`Aluno vinculado ao(à) Prof. ${teacherDisplay}!`);
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

  const handleFlushOfflineOutbox = async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      showToast('Sem conexão: itens permanecerão na fila offline.');
      return;
    }
    const res = await flushProgressOutbox({
      onTelemetry: async (item) => {
        await reportClientError(
          String(item.payload.message ?? 'Offline telemetry'),
          String(item.payload.route ?? '/'),
        );
        return true;
      },
      onSyncProgressBatch: async () => {
        if (isCloudConfigured) {
          const pushRes = await pushStateToCloud(state);
          if (!pushRes.ok) return false;
          await syncRelationalTablesBestEffort(
            state,
            effectiveSupabase.url,
            effectiveSupabase.anonKey,
          );
        }
        return true;
      },
    });
    setPendingOutboxCount(res.remaining);
    if (res.flushed > 0) {
      showToast(`${res.flushed} item(ns) da fila offline sincronizado(s)!`);
    }
  };

  useEffect(() => {
    void getPendingOutboxCount().then(setPendingOutboxCount);
    const onOnline = () => {
      void handleFlushOfflineOutbox();
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  if (!currentUser) {
    if (!dismissedWebGateway && isWebPlatform()) {
      return (
        <AppDownloadGateway
          mode="landing"
          schoolName={state.schoolName}
          uiLocale={uiLocale}
          onChangeUiLocale={setUiLocale}
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
          uiLocale={uiLocale}
          onChangeUiLocale={setUiLocale}
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
            uiLocale={uiLocale}
            onChangeUiLocale={setUiLocale}
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
    void syncCommunityPostToCloud(newPost);
    showToast('Publicação enviada para o fórum!');
  };

  const handleReplyCommunityPost = (
    postId: string,
    content: string,
    correctionSuggestion?: string,
  ) => {
    const wk = getCurrentWeekKey();
    const newReply = {
      id: `rep-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatarColor: currentUser.avatarColor,
      authorRole: currentUser.role,
      content,
      correctionSuggestion,
      likes: [] as string[],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((prev) => ({
      ...prev,
      communityPosts: (prev.communityPosts ?? []).map((p) =>
        p.id === postId
          ? {
            ...p,
            replies: [...p.replies, newReply],
          }
          : p,
      ),
    }));
    void syncCommunityReplyToCloud(postId, newReply);
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

  const handleToggleCommunityReaction = (postId: string, emoji: string) => {
    if (!currentUser) return;
    setState((prev) => ({
      ...prev,
      communityPosts: togglePostReaction(
        prev.communityPosts ?? [],
        postId,
        emoji,
        currentUser.id,
      ),
    }));
  };

  const handleAcceptCommunityCorrection = (postId: string, replyId: string) => {
    if (!currentUser) return;
    setState((prev) => {
      const targetPost = (prev.communityPosts ?? []).find((p) => p.id === postId);
      const targetReply = targetPost?.replies.find((r) => r.id === replyId);
      const alreadyAccepted = targetPost?.acceptedReplyId === replyId;
      const nextPosts = acceptCorrectionReply(
        prev.communityPosts ?? [],
        postId,
        replyId,
      );
      const nextUsers =
        !alreadyAccepted && targetReply
          ? prev.users.map((u) =>
              u.id === targetReply.authorId ? { ...u, xp: u.xp + 10 } : u,
            )
          : prev.users;
      return {
        ...prev,
        communityPosts: nextPosts,
        users: nextUsers,
      };
    });
    showToast('Correção aceita! +10 XP concedidos ao colega.');
  };

  const handleClaimMonthlyChallenge = (challengeId: string, xpReward: number) => {
    if (!currentUser) return;
    const claimed = currentUser.claimedChallengeIds ?? [];
    if (claimed.includes(challengeId)) return;
    updateCurrentUser((u) => ({
      ...u,
      xp: u.xp + xpReward,
      claimedChallengeIds: [...(u.claimedChallengeIds ?? []), challengeId],
    }));
    showToast(`Desafio do Mês concluído! +${xpReward} XP!`);
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

  const handleCreateLiveSession = (
    payload: Omit<LiveSessionRecord, 'id' | 'createdAt'>,
  ) => {
    const newSession: LiveSessionRecord = {
      ...payload,
      id: `live-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      liveSessions: [newSession, ...(prev.liveSessions ?? [])],
    }));
    void syncLiveSessionToCloud(newSession);
    showToast('Aula ao vivo agendada!');
  };

  const handleUpdateLiveSessionNotes = (sessionId: string, notes: string) => {
    setState((prev) => ({
      ...prev,
      liveSessions: (prev.liveSessions ?? []).map((s) =>
        s.id === sessionId ? { ...s, notes } : s,
      ),
    }));
    showToast('Notas da aula salvas!');
  };

  const handleGeneratePostClassTask = (session: LiveSessionRecord) => {
    const fallbackTopic = courseTopics[0];
    if (!fallbackTopic) return;
    const dueDate = new Date(Date.now() + 3 * 86400_000).toISOString().slice(0, 10);
    const newAssignment = {
      id: `assign-live-${Date.now()}`,
      title: `Pós-Aula: ${session.title}`,
      description:
        session.notes?.trim() ||
        'Revisar vocabulário e pontos praticados na aula ao vivo.',
      classId: session.classId,
      studentId: session.studentId,
      teacherId: currentUser.id,
      languageCode: session.languageCode,
      topicId: fallbackTopic.id,
      dueDate,
      createdAt: new Date().toISOString().slice(0, 10),
      createdBy: currentUser.name,
    };
    setState((prev) => ({
      ...prev,
      assignments: [newAssignment, ...(prev.assignments ?? [])],
    }));
    showToast('Tarefa pós-aula gerada para o aluno!');
  };

  const classmates = state.users.filter((u) => u.role === 'student');

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9FC] lg:flex-row">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white"
      >
        Pular para o conteúdo principal
      </a>
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
        uiLocale={uiLocale}
        onChangeUiLocale={setUiLocale}
        fontScale={fontScale}
        onChangeFontScale={setFontScale}
        onOpenDownloadModal={() => setShowDownloadModal(true)}
        onOpenUpdateModal={() => setShowUpdateModal(true)}
        onOpenPrivacyLgpd={() => setShowPrivacyModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        pendingOutboxCount={pendingOutboxCount}
        onFlushOutbox={() => void handleFlushOfflineOutbox()}
        hasAppUpdate={Boolean(appUpdateInfo?.hasUpdate)}
        latestAppVersion={appUpdateInfo?.latestVersion}
        onLogout={handleLogout}
      />

      <main
        id="main-content"
        dir={isRtlLanguage(activeLanguage) ? 'rtl' : 'ltr'}
        className="safe-main-pb flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 lg:pb-10"
      >
        {activeCourse.code === 'pt' && uiLocale !== 'en' && !ptUiBannerDismissed && (
          <div
            data-testid="pt-course-en-ui-banner"
            className="mx-auto mb-4 flex max-w-6xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs text-blue-950"
          >
            <span className="font-semibold">
              {tUi(uiLocale, 'ptBanner.title')}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="pt-course-switch-en-btn"
                onClick={() => setUiLocale('en')}
                className="rounded-xl bg-blue-600 px-3 py-1.5 font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                {tUi(uiLocale, 'ptBanner.cta')}
              </button>
              <button
                type="button"
                onClick={() => setPtUiBannerDismissed(true)}
                className="rounded-xl border border-blue-200 bg-white px-3 py-1.5 font-semibold text-blue-800 hover:bg-blue-100 cursor-pointer"
              >
                {tUi(uiLocale, 'ptBanner.dismiss')}
              </button>
            </div>
          </div>
        )}
        {activeView === 'learn' && (
          <LearningPath
            currentUser={currentUser}
            teacherName={state.teacherName}
            assignedTeacherName={
              assignedTeacher
                ? getTeacherDisplayName(assignedTeacher, state.teacherName)
                : undefined
            }
            activeCourse={activeCourse}
            activeDialect={activeDialect}
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
            onSaveLearningGoal={(learningGoal: LearningGoalType, goalTargetDate?: string) => {
              updateCurrentUser((u) => ({ ...u, learningGoal, goalTargetDate }));
              showToast('Objetivo de estudo atualizado!');
            }}
            onCompleteCheckpoint={(checkpointId, scorePercent) => {
              updateCurrentUser((u) => {
                const prev = u.completedCheckpoints ?? [];
                if (prev.includes(checkpointId)) return u;
                return {
                  ...u,
                  xp: u.xp + 60,
                  completedCheckpoints: [...prev, checkpointId],
                };
              });
              if (typeof navigator !== 'undefined' && navigator.onLine === false) {
                void enqueueOfflineMutation('checkpoint', {
                  checkpointId,
                  scorePercent,
                }).then(() => getPendingOutboxCount().then(setPendingOutboxCount));
              }
              showToast(`Ponto de verificação concluído (${scorePercent}%)! +60 XP`);
            }}
            onToggleReminder={() => void handleToggleReminder()}
            onStartTopic={(topic) => setActiveTopic(topic)}
            onGoToReview={() => setActiveView('review')}
            uiLocale={uiLocale}
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

        <Suspense fallback={<ViewSkeleton />}>
          {activeView === 'tutor' && (
            <AITutor
              accent={currentUser.accent}
              languageCode={activeLanguage}
              activeDialect={activeDialect}
              geminiApiKey={effectiveGeminiKey}
              topics={courseTopics}
              initialTopic={tutorTargetTopic}
              pedagogicalMemory={
                buildPedagogicalMemoryContext(
                  activeLanguage,
                  currentUser.vocab,
                  currentUser.mistakeBank,
                ).promptInstruction
              }
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
              activeDialect={activeDialect}
              geminiApiKey={effectiveGeminiKey}
              hasLinkedTeacher={hasLinkedTeacher}
              onRequestTeacherLink={() => setShowTeacherLinkModal(true)}
              onSubmitSpeaking={handleSubmitSpeaking}
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
              realtimeConnected={realtimeConnected}
              onCreatePost={handleCreateCommunityPost}
              onReplyPost={handleReplyCommunityPost}
              onToggleLikePost={handleToggleLikePost}
              onToggleReaction={handleToggleCommunityReaction}
              onAcceptCorrection={handleAcceptCommunityCorrection}
              onClaimChallenge={handleClaimMonthlyChallenge}
              onDeletePost={handleDeleteCommunityPost}
            />
          )}

          {activeView === 'live' && (
            <LiveClassroomView
              currentUser={currentUser}
              activeLanguage={activeLanguage}
              classes={state.classes}
              students={classmates}
              sessions={state.liveSessions ?? []}
              onCreateSession={handleCreateLiveSession}
              onUpdateSessionNotes={handleUpdateLiveSessionNotes}
              onGeneratePostClassTask={handleGeneratePostClassTask}
            />
          )}

          {(activeView === 'tips' || activeView === 'immersion') && (
            <TipsLibrary
              topics={courseTopics}
              languageCode={activeLanguage}
              activeDialect={activeDialect}
              savedWords={savedVideoWords}
              onSaveWordToDeck={handleSaveCustomVocabCard}
              onRecordMistake={handleRecordMistake}
              onEarnXp={(xp) => updateCurrentUser((u) => ({ ...u, xp: u.xp + xp }))}
              onPracticeTopic={(topic) => setActiveTopic(topic)}
              onPracticeTopicWithAI={(topic) => {
                setTutorTargetTopic(topic);
                setActiveTopic(null);
                setActiveView('tutor');
              }}
              initialViewMode={activeView === 'immersion' ? 'podcasts' : 'tips'}
            />
          )}

          {activeView === 'translator' && (
            <CourseTranslatorView
              activeCourse={activeCourse}
              courseVocab={courseVocab}
              onSaveVocabCard={(card) =>
                handleSaveCustomVocabCard({ ...card, category: 'Tradutor' })
              }
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
                setState((prev) => ({
                  ...prev,
                  schoolName: settings.schoolName,
                  teacherName:
                    currentUser.isMasterAdmin || prev.users.filter((u) => u.role === 'teacher').length <= 1
                      ? settings.teacherName
                      : prev.teacherName,
                  users: prev.users.map((u) =>
                    u.id === currentUser.id
                      ? { ...u, teacherDisplayName: settings.teacherName }
                      : u,
                  ),
                }));
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
                  loadedCourses[activeLanguage]?.vocab ?? [],
                );
                setState(normalized);
                showToast('Estado da nuvem aplicado!');
              }}
              onImportState={(imported) => {
                setState(
                  normalizePlatformState(
                    imported,
                    DEFAULT_PLATFORM_STATE,
                    loadedCourses[activeLanguage]?.vocab ?? [],
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
                    loadedCourses[activeLanguage]?.vocab ?? [],
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
                totalBuiltinTopicsCount={1236}
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
            uiLocale={uiLocale}
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
          uiLocale={uiLocale}
          onChangeUiLocale={setUiLocale}
          onContinueWeb={() => setShowDownloadModal(false)}
          onClose={() => setShowDownloadModal(false)}
        />
      )}

      <AppUpdateModal
        open={showUpdateModal}
        initialInfo={appUpdateInfo}
        onUpdateInfo={(info) => setAppUpdateInfo(info)}
        onClose={() => setShowUpdateModal(false)}
      />

      <SettingsModal
        open={showSettingsModal}
        user={currentUser}
        activeCourse={activeCourse}
        activeDialect={activeDialect}
        themeMode={themeMode}
        uiLocale={uiLocale}
        fontScale={fontScale}
        pendingOutboxCount={pendingOutboxCount}
        hasAppUpdate={Boolean(appUpdateInfo?.hasUpdate)}
        latestAppVersion={appUpdateInfo?.latestVersion}
        onClose={() => setShowSettingsModal(false)}
        onChangeDialect={(langCode, dialectCode) => {
          updateCurrentUser((u) => ({
            ...u,
            accent: langCode === 'en' && (dialectCode === 'en-US' || dialectCode === 'en-GB')
              ? dialectCode
              : u.accent,
            dialectByLanguage: {
              ...(u.dialectByLanguage ?? {}),
              [langCode]: dialectCode,
            },
          }));
        }}
        onCycleTheme={handleCycleTheme}
        onChangeUiLocale={setUiLocale}
        onChangeFontScale={setFontScale}
        onFlushOutbox={() => void handleFlushOfflineOutbox()}
        onOpenUpdateModal={() => setShowUpdateModal(true)}
        onOpenPrivacyLgpd={() => setShowPrivacyModal(true)}
        onOpenDownloadModal={() => setShowDownloadModal(true)}
        onLogout={handleLogout}
      />

      <PrivacyLgpdModal
        open={showPrivacyModal}
        user={currentUser}
        onClose={() => setShowPrivacyModal(false)}
        onDeleteAccount={async () => {
          const cloudRes = await deleteMyCloudAccount(state.cloudConfig);
          if (!cloudRes.ok) {
            return { ok: false, error: cloudRes.error };
          }
          await clearOfflineOutbox();
          setPendingOutboxCount(0);
          handleDeleteUser(currentUser.id);
          setShowPrivacyModal(false);
          handleLogout();
          return { ok: true };
        }}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="animate-fade-up fixed right-5 bottom-20 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl lg:bottom-6"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;

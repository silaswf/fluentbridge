import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  getEffectiveGeminiKey,
  getEffectiveSupabaseConfig,
  isMasterAdminEmail,
} from './config/appConfig';
import {
  fetchCurrentSupabaseUser,
  pullStateFromCloud,
  pushStateToCloud,
  signInWithSupabaseEmail,
  signInWithSupabaseGoogle,
  signOutSupabase,
  signUpWithSupabaseEmail,
} from './utils/cloudSync';
import { AITutor } from './components/AITutor';
import { AuthScreen } from './components/AuthScreen';
import { CertificatesView } from './components/CertificatesView';
import { LearningPath } from './components/LearningPath';
import { LessonPlayer } from './components/LessonPlayer';
import { PlacementTestModal } from './components/PlacementTestModal';
import { Sidebar, type NavView } from './components/Sidebar';
import { TeacherStudio, type TeacherTab } from './components/TeacherStudio';
import { TipsLibrary } from './components/TipsLibrary';
import { VocabReview } from './components/VocabReview';
import {
  getActiveDialect,
  getCourseTopics,
  getLanguageCourse,
} from './data/languages';
import {
  ALL_INITIAL_VOCABULARY,
  BUILTIN_TOPICS,
  DEFAULT_PLATFORM_STATE,
  cloneInitialVocab,
} from './data/lessons';
import type {
  Accent,
  CEFRLevel,
  CertificateRecord,
  CloudConfig,
  LanguageCode,
  PlatformState,
  PronunciationRubric,
  SkillType,
  Topic,
  UserProfile,
  UserRole,
  VocabCard,
} from './types/learning';
import { playSound } from './utils/soundFx';
import {
  clearPlatformState,
  loadPlatformState,
  normalizePlatformState,
  savePlatformState,
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
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [pathFilterLevel, setPathFilterLevel] = useState<'ALL' | CEFRLevel>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [autoSyncStatus, setAutoSyncStatus] = useState<{
    state: 'idle' | 'syncing' | 'synced' | 'error';
    message?: string;
    updatedAt?: string;
  }>({ state: 'idle' });
  const hasBootstrappedCloudRef = useRef(false);
  const skipNextCloudPushRef = useRef(false);

  const effectiveSupabase = useMemo(
    () => getEffectiveSupabaseConfig(state.cloudConfig),
    [state.cloudConfig],
  );
  const effectiveGeminiKey = useMemo(
    () => getEffectiveGeminiKey(state.cloudConfig.geminiApiKey),
    [state.cloudConfig.geminiApiKey],
  );
  const isCloudConfigured = Boolean(effectiveSupabase.url && effectiveSupabase.anonKey);

  useEffect(() => {
    savePlatformState(state);
  }, [state]);

  // Bootstrap from Supabase & hydrate Supabase OAuth / Auth user on startup
  useEffect(() => {
    if (!isCloudConfigured || hasBootstrappedCloudRef.current) return;
    hasBootstrappedCloudRef.current = true;

    let cancelled = false;
    void (async () => {
      const pullRes = await pullStateFromCloud(
        effectiveSupabase.url,
        effectiveSupabase.anonKey,
      );
      if (!cancelled && pullRes.ok && pullRes.state) {
        skipNextCloudPushRef.current = true;
        setState((prev) =>
          normalizePlatformState(
            {
              ...pullRes.state,
              currentUserId: prev.currentUserId,
              cloudConfig: {
                ...prev.cloudConfig,
                ...(pullRes.state?.cloudConfig ?? {}),
                supabaseUrl: prev.cloudConfig.supabaseUrl,
                supabaseAnonKey: prev.cloudConfig.supabaseAnonKey,
                geminiApiKey: prev.cloudConfig.geminiApiKey,
              },
            },
            DEFAULT_PLATFORM_STATE,
            ALL_INITIAL_VOCABULARY,
          ),
        );
        setAutoSyncStatus({
          state: 'synced',
          message: 'Dados sincronizados ao iniciar.',
          updatedAt: new Date().toISOString(),
        });
      }

      const authUser = await fetchCurrentSupabaseUser(state.cloudConfig);
      if (!cancelled && authUser?.email) {
        const master = isMasterAdminEmail(authUser.email);
        setState((prev) => {
          const existing = prev.users.find(
            (u) => u.email.toLowerCase() === authUser.email.toLowerCase(),
          );
          if (existing) {
            return {
              ...prev,
              currentUserId: existing.id,
              users: prev.users.map((u) =>
                u.id === existing.id && master
                  ? { ...u, role: 'teacher', isMasterAdmin: true }
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
            dialectByLanguage: { en: 'en-US', es: 'es-ES', fr: 'fr-FR' },
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
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isCloudConfigured,
    effectiveSupabase.url,
    effectiveSupabase.anonKey,
    state.cloudConfig,
  ]);

  // Background debounced sync to Supabase when state changes
  useEffect(() => {
    if (!isCloudConfigured) return;
    if (skipNextCloudPushRef.current) {
      skipNextCloudPushRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      setAutoSyncStatus((prev) => ({ ...prev, state: 'syncing' }));
      void pushStateToCloud(state).then((res) => {
        if (res.ok) {
          setAutoSyncStatus({
            state: 'synced',
            message: 'Sincronizado automaticamente com a nuvem.',
            updatedAt: res.syncedAt ?? new Date().toISOString(),
          });
        } else {
          setAutoSyncStatus({
            state: 'error',
            message: res.message,
          });
        }
      });
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [state, isCloudConfigured]);

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
  }): UserProfile => {
    const master = isMasterAdminEmail(payload.email);
    return {
      id: `user-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: master ? 'teacher' : payload.role,
      isMasterAdmin: master,
      classId: master ? undefined : payload.classId,
      avatarColor: AVATAR_COLORS[state.users.length % AVATAR_COLORS.length],
      activeLanguage: 'en',
      dialectByLanguage: { en: 'en-US', es: 'es-ES', fr: 'fr-FR' },
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
  }): Promise<{ ok: boolean; error?: string }> => {
    const master = isMasterAdminEmail(payload.email);
    const existing = state.users.find(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase(),
    );

    if (existing && !(master && existing.password === 'admin123')) {
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
                password: payload.password,
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
      const targetRole = master ? 'teacher' : existing.role;
      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === existing.id
            ? { ...u, password, role: targetRole, isMasterAdmin: u.isMasterAdmin || master }
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

  const handleGoogleLogin = async (fallbackProfile?: {
    name: string;
    email: string;
  }): Promise<{ ok: boolean; error?: string }> => {
    if (!fallbackProfile && isCloudConfigured) {
      const res = await signInWithSupabaseGoogle(state.cloudConfig);
      if (!res.ok) return { ok: false, error: res.error };
      return { ok: true };
    }

    if (!fallbackProfile?.email) {
      return { ok: false, error: 'Informe um e-mail Google válido.' };
    }

    const master = isMasterAdminEmail(fallbackProfile.email);
    const existing = state.users.find(
      (u) => u.email.toLowerCase() === fallbackProfile.email.trim().toLowerCase(),
    );
    if (existing) {
      const nextRole = master ? 'teacher' : existing.role;
      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === existing.id
            ? { ...u, role: nextRole, isMasterAdmin: u.isMasterAdmin || master }
            : u,
        ),
        currentUserId: existing.id,
      }));
      setActiveView(nextRole === 'teacher' ? 'teacher' : 'learn');
      showToast(`Conectado via Google como ${existing.name}!`);
      return { ok: true };
    }

    const newUser = buildFreshUserProfile({
      name: fallbackProfile.name.trim() || fallbackProfile.email.split('@')[0],
      email: fallbackProfile.email.trim(),
      password: '',
      role: master ? 'teacher' : 'student',
    });
    setState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUserId: newUser.id,
    }));
    setActiveView(newUser.role === 'teacher' ? 'teacher' : 'learn');
    showToast(`Conta Google conectada: ${newUser.name}!`);
    return { ok: true };
  };

  const handleLogout = () => {
    setActiveTopic(null);
    setState((prev) => ({ ...prev, currentUserId: null }));
    void signOutSupabase(state.cloudConfig);
  };

  const handleQuickSwitchToTeacher = () => {
    const teacher = state.users.find((u) => u.role === 'teacher');
    if (!teacher) return;
    setState((prev) => ({ ...prev, currentUserId: teacher.id }));
    setTeacherInitialTab('corrections');
    setActiveView('teacher');
    showToast(`Alternado para ${teacher.name} (Modo Professor)`);
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

    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => {
        if (u.id !== prev.currentUserId) return u;

        const nextCompleted = u.completedTopicIds.includes(result.topicId)
          ? u.completedTopicIds
          : [...u.completedTopicIds, result.topicId];

        const nextScores = { ...u.skillScores };
        for (const skill of result.practicedSkills) {
          nextScores[skill] = Math.min(100, nextScores[skill] + 7);
        }

        const completedTopicObj = BUILTIN_TOPICS.find(
          (t) => t.id === result.topicId,
        );
        let nextCerts = u.issuedCertificates;

        if (completedTopicObj) {
          const levelTopics = BUILTIN_TOPICS.filter(
            (t) => t.level === completedTopicObj.level,
          );
          const allLevelDone = levelTopics.every((t) =>
            nextCompleted.includes(t.id),
          );
          const hasCert = nextCerts.some(
            (c) => c.level === completedTopicObj.level,
          );
          if (allLevelDone && !hasCert) {
            unlockedLevel = completedTopicObj.level;
            const draftStudent: UserProfile = {
              ...u,
              skillScores: nextScores,
            };
            nextCerts = [
              ...nextCerts,
              buildCertificate(
                draftStudent,
                completedTopicObj.level,
                prev.teacherName,
                'en',
              ),
            ];
          }
        }

        return {
          ...u,
          xp: u.xp + result.xpEarned,
          todayMinutes: u.todayMinutes + result.minutesSpent,
          completedTopicIds: nextCompleted,
          skillScores: nextScores,
          issuedCertificates: nextCerts,
          dailyQuests: {
            ...u.dailyQuests,
            lessonsCompletedToday: u.dailyQuests.lessonsCompletedToday + 1,
          },
        };
      }),
    }));

    if (unlockedLevel) {
      showToast(
        `Parabéns! Você desbloqueou o Certificado CEFR ${unlockedLevel}!`,
      );
    }
  };

  const handleSubmitWriting = (payload: {
    topicId: string;
    topicTitle: string;
    promptPt: string;
    responseText: string;
  }) => {
    if (!currentUser) return;
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
          topicId: payload.topicId,
          topicTitle: payload.topicTitle,
          promptPt: payload.promptPt,
          responseText: payload.responseText,
          createdAt: 'Agora mesmo',
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
    audioDurationSec: number;
    autoPronunciationScore?: number;
  }) => {
    if (!currentUser) return;
    setState((prev) => ({
      ...prev,
      submissions: [
        {
          id: `sub-s-${Date.now()}`,
          languageCode: activeLanguage,
          type: 'speaking',
          studentId: currentUser.id,
          studentName: currentUser.name,
          classId: currentUser.classId,
          topicId: payload.topicId,
          topicTitle: payload.topicTitle,
          promptPt: payload.promptPt,
          targetSentence: payload.targetSentence,
          responseText: payload.responseText,
          audioId: payload.audioId,
          audioDurationSec: payload.audioDurationSec,
          autoPronunciationScore: payload.autoPronunciationScore,
          createdAt: 'Agora mesmo',
          status: 'pending',
        },
        ...prev.submissions,
      ],
    }));
    showToast('Áudio enviado para o Professor avaliar sua pronúncia!');
  };

  const handleRateVocab = (cardId: string, nextStrength: VocabCard['strength']) => {
    updateCurrentUser((u) => ({
      ...u,
      xp: u.xp + 5,
      vocab: u.vocab.map((c) =>
        c.id === cardId
          ? { ...c, strength: nextStrength, reviewCount: c.reviewCount + 1 }
          : c,
      ),
      dailyQuests: {
        ...u.dailyQuests,
        vocabReviewedToday: u.dailyQuests.vocabReviewedToday + 1,
      },
    }));
  };

  const handleTutorSessionComplete = (xpEarned: number) => {
    updateCurrentUser((u) => ({
      ...u,
      xp: u.xp + xpEarned,
      todayMinutes: u.todayMinutes + 5,
      skillScores: {
        ...u.skillScores,
        speaking: Math.min(100, u.skillScores.speaking + 4),
        writing: Math.min(100, u.skillScores.writing + 3),
      },
      dailyQuests: {
        ...u.dailyQuests,
        tutorSessionsToday: u.dailyQuests.tutorSessionsToday + 1,
      },
    }));
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
      xp: u.xp + 40,
    }));
    setPathFilterLevel(recommendedLevel);
    setShowPlacementModal(false);
    setActiveView('learn');
    showToast(`Nível indicado: ${recommendedLevel} (+40 XP)! Trilha filtrada para você.`);
  };

  const handleUnlockCertificate = (level: CEFRLevel) => {
    if (!currentUser) return;
    if (currentUser.issuedCertificates.some((c) => c.level === level)) return;
    const cert = buildCertificate(currentUser, level, state.teacherName, 'en');
    updateCurrentUser((u) => ({
      ...u,
      issuedCertificates: [...u.issuedCertificates, cert],
    }));
    showToast(`Certificado CEFR ${level} emitido com sucesso!`);
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
    setState((prev) => ({
      ...prev,
      users: prev.users.filter(
        (u) =>
          u.id !== userId || Boolean(u.isMasterAdmin || isMasterAdminEmail(u.email)),
      ),
    }));
    showToast('Usuário removido.');
  };

  if (!currentUser) {
    return (
      <AuthScreen
        schoolName={state.schoolName}
        teacherName={state.teacherName}
        users={state.users}
        classes={state.classes}
        cloudConfigured={isCloudConfigured}
        onLogin={handleLogin}
        onEmailAuthLogin={handleEmailAuthLogin}
        onGoogleLogin={handleGoogleLogin}
        onRegister={handleRegister}
      />
    );
  }

  const dueVocabCount = courseVocab.filter(
    (v) => v.strength !== 'mastered',
  ).length;
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
        vocabCount={courseVocab.length}
        classNameLabel={userClassName}
        onChangeLanguage={handleChangeLanguage}
        onChangeDialect={handleChangeDialect}
        dueVocabCount={dueVocabCount}
        pendingSubmissionsCount={pendingSubmissionsCount}
        onLogout={handleLogout}
        onQuickSwitchToTeacher={handleQuickSwitchToTeacher}
      />

      <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-10">
        {activeView === 'learn' && (
          <LearningPath
            currentUser={currentUser}
            teacherName={state.teacherName}
            activeCourse={activeCourse}
            classNameLabel={userClassName}
            topics={courseTopics}
            classmates={classmates}
            initialFilterLevel={pathFilterLevel}
            onOpenPlacementTest={() => setShowPlacementModal(true)}
            onClaimDailyQuest={handleClaimDailyQuest}
            onChangeDailyGoal={(dailyGoalMinutes) =>
              updateCurrentUser((u) => ({ ...u, dailyGoalMinutes }))
            }
            onStartTopic={(topic) => setActiveTopic(topic)}
            reviewedSubmissions={reviewedForUser}
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

        {activeView === 'tutor' && (
          <AITutor
            accent={currentUser.accent}
            geminiApiKey={effectiveGeminiKey}
            onCompleteSession={handleTutorSessionComplete}
          />
        )}

        {activeView === 'review' && (
          <VocabReview
            vocab={courseVocab}
            topics={courseTopics}
            onRateCard={handleRateVocab}
          />
        )}

        {activeView === 'tips' && (
          <TipsLibrary
            topics={courseTopics}
            onPracticeTopic={(topic) => setActiveTopic(topic)}
          />
        )}

        {activeView === 'certificates' && (
          <CertificatesView
            user={currentUser}
            topics={BUILTIN_TOPICS}
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
              setState({
                ...DEFAULT_PLATFORM_STATE,
                currentUserId: state.currentUserId,
              });
              showToast('Dados de demonstração restaurados.');
            }}
            onPlayTopic={(topic) => setActiveTopic(topic)}
            onToggleUserRole={handleToggleUserRole}
            onMoveUserClass={handleMoveUserClass}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </main>

      {showPlacementModal && (
        <PlacementTestModal
          onClose={() => setShowPlacementModal(false)}
          onCompletePlacement={(lvl) => handleCompletePlacement(lvl)}
        />
      )}

      {activeTopic && (
        <LessonPlayer
          topic={activeTopic}
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
          onChangeDialect={handleChangeDialect}
          onSubmitWriting={handleSubmitWriting}
          onSubmitSpeaking={handleSubmitSpeaking}
          onCompleteLesson={handleCompleteLesson}
          onGoToReview={() => setActiveView('review')}
          onClose={() => setActiveTopic(null)}
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

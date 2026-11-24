import { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  Bell,
  BellOff,
  BookOpenCheck,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clapperboard,
  Clock,
  CloudSun,
  Coffee,
  Compass,
  Cpu,
  Crown,
  Factory,
  Flag,
  GitBranch,
  Globe,
  Hand,
  Handshake,
  Headphones,
  HeartPulse,
  HelpCircle,
  History,
  Home,
  Laptop,
  Layers,
  Lightbulb,
  MessageSquareHeart,
  MessageSquareQuote,
  Mic,
  Newspaper,
  PanelRightClose,
  PanelRightOpen,
  PenTool,
  Plane,
  Play,
  Presentation,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Snowflake,
  Sparkle,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import type {
  CEFRLevel,
  DailyQuestsProgress,
  LanguageCourse,
  LearningGoalType,
  StudentSubmission,
  TeacherAssignment,
  Topic,
  UserProfile,
} from '../types/learning';
import { ConfirmDialog } from './ConfirmDialog';
import { GoalOnboardingModal } from './GoalOnboardingModal';
import { SkillBadge } from './SkillBadge';
import { SkillRadar } from './SkillRadar';
import {
  TrailCheckpointModal,
  type TrailCheckpointTarget,
} from './TrailCheckpointModal';
import { getImmersionStrings, isImmersionLevel } from '../utils/immersion';
import {
  computeRetentionAlerts,
  requestAndSendBrowserNotification,
} from '../utils/retentionNotifications';
import { ModuleAccordionHeader } from './trail/ModuleAccordionHeader';
import {
  downloadNextUnitsOffline,
  getCachedOfflineUnits,
} from '../utils/offlineUnitPack';
import { generateWeeklyStudyPlan } from '../utils/studyPlanEngine';

interface LearningPathProps {
  currentUser: UserProfile;
  teacherName: string;
  assignedTeacherName?: string;
  activeCourse: LanguageCourse;
  classNameLabel?: string;
  topics: Topic[];
  classmates: UserProfile[];
  initialFilterLevel?: 'ALL' | CEFRLevel;
  onOpenPlacementTest: () => void;
  onClaimDailyQuest: (questId: string, bonusXp: number) => void;
  onChangeDailyGoal: (minutes: number) => void;
  onToggleReminder?: () => void;
  onStartTopic: (topic: Topic) => void;
  onPracticeTopicWithAI?: (topic: Topic) => void;
  reviewedSubmissions: StudentSubmission[];
  assignments?: TeacherAssignment[];
  onGoToTeacher?: () => void;
  onOpenTeacherLink?: () => void;
  onSelfUnlinkTeacher?: () => void;
  onSaveLearningGoal?: (goal: LearningGoalType, targetDate?: string) => void;
  onCompleteCheckpoint?: (checkpointId: string, scorePercent: number) => void;
  activeDialect?: string;
}

const TOPIC_ICONS = {
  Activity,
  AlertCircle,
  Award,
  Bell,
  BellOff,
  BookOpenCheck,
  Briefcase,
  Calendar,
  Clock,
  CloudSun,
  Coffee,
  Compass,
  Cpu,
  Crown,
  Factory,
  GitBranch,
  Globe,
  Hand,
  Handshake,
  HeartPulse,
  HelpCircle,
  History,
  Home,
  Laptop,
  Layers,
  MessageSquareQuote,
  Newspaper,
  Plane,
  Presentation,
  ShieldCheck,
  ShoppingBag,
  Snowflake,
  Sparkle,
  Sparkles,
  Target,
  Timer,
  Users,
} as const;

function getTopicIcon(name: string) {
  return TOPIC_ICONS[name as keyof typeof TOPIC_ICONS] ?? Sparkles;
}

const LEVEL_COLORS: Record<CEFRLevel, string> = {
  A1: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  A2: 'bg-sky-50 text-sky-700 border-sky-200',
  B1: 'bg-amber-50 text-amber-800 border-amber-200',
  B2: 'bg-violet-50 text-violet-700 border-violet-200',
  C1: 'bg-rose-50 text-rose-700 border-rose-200',
};

const ALL_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

function buildDailyQuests(q: DailyQuestsProgress) {
  return [
    {
      id: 'q-lesson',
      title: 'Concluir 1 unidade hoje',
      progress: Math.min(1, q.lessonsCompletedToday),
      target: 1,
      bonusXp: 25,
    },
    {
      id: 'q-vocab',
      title: 'Revisar 5 cards SRS hoje',
      progress: Math.min(5, q.vocabReviewedToday),
      target: 5,
      bonusXp: 25,
    },
    {
      id: 'q-tutor',
      title: '1 sessão no Tutor IA hoje',
      progress: Math.min(1, q.tutorSessionsToday),
      target: 1,
      bonusXp: 25,
    },
  ];
}

export function LearningPath({
  currentUser,
  teacherName,
  assignedTeacherName,
  activeCourse,
  classNameLabel,
  topics,
  classmates,
  initialFilterLevel = 'ALL',
  onOpenPlacementTest,
  onClaimDailyQuest,
  onChangeDailyGoal,
  onToggleReminder,
  onStartTopic,
  onPracticeTopicWithAI,
  reviewedSubmissions,
  assignments = [],
  onGoToTeacher,
  onOpenTeacherLink,
  onSelfUnlinkTeacher,
  onSaveLearningGoal,
  onCompleteCheckpoint,
  activeDialect = 'en-US',
}: LearningPathProps) {
  const [confirmUnlinkOpen, setConfirmUnlinkOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState<TrailCheckpointTarget | null>(
    null,
  );
  const [offlineIds, setOfflineIds] = useState<string[]>(() => getCachedOfflineUnits());
  const [offlineStatus, setOfflineStatus] = useState<string>('');
  const [downloadingOffline, setDownloadingOffline] = useState(false);
  const [selectedLevel, setSelectedLevel] =
    useState<'ALL' | CEFRLevel>(initialFilterLevel);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem('fluentbridge_right_panel_open') !== '0';
  });
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [expandAllModules, setExpandAllModules] = useState(false);
  const [retentionNoticeMsg, setRetentionNoticeMsg] = useState('');

  const toggleRightPanel = () => {
    setIsRightPanelOpen((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('fluentbridge_right_panel_open', next ? '1' : '0');
      }
      return next;
    });
  };

  useEffect(() => {
    setSelectedLevel(initialFilterLevel);
  }, [initialFilterLevel]);

  const completedTopicIds = currentUser.completedTopicIds;
  const nextTopic =
    topics.find((t) => !completedTopicIds.includes(t.id)) ?? topics[0];

  const filteredTopics =
    selectedLevel === 'ALL'
      ? topics
      : topics.filter((t) => t.level === selectedLevel);

  const moduleGroups: Array<{
    key: string;
    level: CEFRLevel;
    title: string;
    topics: Topic[];
  }> = [];
  for (const t of filteredTopics) {
    const title = t.moduleTitlePt ?? `Módulo ${t.level}`;
    const key = `${t.level}::${title}`;
    const last = moduleGroups[moduleGroups.length - 1];
    if (last && last.key === key) {
      last.topics.push(t);
    } else {
      moduleGroups.push({ key, level: t.level, title, topics: [t] });
    }
  }

  const activeModuleKey =
    moduleGroups.find((g) => g.topics.some((t) => t.id === nextTopic?.id))?.key ??
    moduleGroups[0]?.key ??
    '';

  const retentionAlerts = computeRetentionAlerts(
    currentUser,
    reviewedSubmissions.length,
  );

  const goalPct = Math.min(
    100,
    Math.round((currentUser.todayMinutes / currentUser.dailyGoalMinutes) * 100),
  );
  const completedCount = topics.filter((t) =>
    completedTopicIds.includes(t.id),
  ).length;

  const quests = buildDailyQuests(currentUser.dailyQuests);
  const sortedLeaderboard = [...classmates]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-blue-600 to-indigo-700 p-6 text-white shadow-md shadow-blue-600/15 sm:p-7">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-blue-50 backdrop-blur-xs">
                <span>{activeCourse.flag}</span>
                <span>
                  {activeCourse.namePt} · {completedCount}/{topics.length} unidades
                </span>
              </span>
              {classNameLabel && (
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-100">
                  {classNameLabel}
                </span>
              )}
              {currentUser.role === 'student' && assignedTeacherName && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300/25 px-3 py-1 text-xs font-bold text-amber-100">
                  <span>
                    {currentUser.enrollmentType === 'vip' ? '⭐ VIP · ' : 'Prof. '}
                    {assignedTeacherName}
                  </span>
                  {onSelfUnlinkTeacher && (
                    <button
                      type="button"
                      onClick={() => setConfirmUnlinkOpen(true)}
                      className="ml-1 underline opacity-85 hover:opacity-100 cursor-pointer"
                    >
                      Desvincular
                    </button>
                  )}
                </span>
              )}
              {currentUser.role === 'student' && !assignedTeacherName && !currentUser.classId && onOpenTeacherLink && (
                <button
                  type="button"
                  onClick={onOpenTeacherLink}
                  className="rounded-full bg-amber-300 px-3 py-1 text-xs font-extrabold text-amber-950 hover:bg-amber-200 cursor-pointer"
                >
                  Sem professor · Vincular agora
                </button>
              )}
              {(currentUser.recommendedLevelByLanguage?.[activeCourse.code] ??
                (activeCourse.code === 'en'
                  ? currentUser.recommendedLevel
                  : undefined)) && (
                <span className="rounded-full bg-amber-300 px-2.5 py-0.5 font-mono text-[11px] font-extrabold text-amber-950">
                  Nível indicado ({activeCourse.namePt}):{' '}
                  {currentUser.recommendedLevelByLanguage?.[activeCourse.code] ??
                    currentUser.recommendedLevel}
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Olá, {currentUser.name}! Pronto para praticar {activeCourse.namePt}?
            </h1>
            <p className="text-sm leading-relaxed text-blue-100">
              {activeCourse.descriptionPt} ({teacherName})
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {nextTopic && (
                <button
                  type="button"
                  onClick={() => onStartTopic(nextTopic)}
                  className="hero-cta-btn inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50 active:scale-[0.99] cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-blue-700" />
                  <span>
                    {completedTopicIds.includes(nextTopic.id)
                      ? `Revisar: ${nextTopic.titlePt}`
                      : `Continuar (${nextTopic.level}): ${nextTopic.titlePt}`}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenPlacementTest}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/12 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20 cursor-pointer"
              >
                <Compass className="h-4 w-4" />
                <span>Teste de Nivelamento Adaptativo (15 questões)</span>
              </button>

              {onSaveLearningGoal && (
                <button
                  type="button"
                  data-testid="goal-onboarding-btn"
                  onClick={() => setGoalModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/12 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20 cursor-pointer"
                >
                  <Target className="h-4 w-4" />
                  <span>
                    {currentUser.learningGoal ? 'Editar Plano Semanal' : 'Definir Objetivo'}
                  </span>
                </button>
              )}

              <button
                type="button"
                data-testid="download-offline-pack-btn"
                disabled={downloadingOffline}
                onClick={() => {
                  setDownloadingOffline(true);
                  setOfflineStatus('Preparando pacote offline...');
                  void downloadNextUnitsOffline(
                    topics,
                    currentUser.vocab,
                    completedTopicIds,
                    activeDialect,
                    3,
                    (done, total, title) =>
                      setOfflineStatus(`Baixando ${done}/${total}: ${title}`),
                  ).then(({ cachedTopicIds, audioCount }) => {
                    setOfflineIds((prev) =>
                      Array.from(new Set([...prev, ...cachedTopicIds])),
                    );
                    setOfflineStatus(
                      `${cachedTopicIds.length} unidades (${audioCount} áudios) salvas offline!`,
                    );
                    setDownloadingOffline(false);
                  });
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/12 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20 disabled:opacity-60 cursor-pointer"
              >
                <span>
                  {downloadingOffline ? offlineStatus : 'Baixar próximas 3 unidades offline'}
                </span>
              </button>
            </div>
            {offlineStatus && !downloadingOffline && (
              <p className="text-[11px] font-bold text-emerald-200">{offlineStatus}</p>
            )}
          </div>

          {/* Daily Goal Mini Card */}
          <div className="w-full shrink-0 rounded-2xl border border-white/20 bg-white/12 p-4 backdrop-blur-sm md:w-64">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-100">
                <Target className="h-4 w-4" />
                Meta diária de estudo
              </span>
              <span className="font-mono text-xs font-bold text-white">
                {currentUser.todayMinutes}/{currentUser.dailyGoalMinutes} min
              </span>
            </div>

            <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-emerald-300 transition-all duration-500"
                style={{ width: `${goalPct}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-1">
              <span className="text-[11px] text-blue-100">Ajustar ritmo:</span>
              <div className="flex gap-1">
                {[10, 15, 20].map((min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => onChangeDailyGoal(min)}
                    className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold transition cursor-pointer ${currentUser.dailyGoalMinutes === min
                      ? 'bg-white text-blue-700'
                      : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                  >
                    {min}m
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/15 pt-2.5 text-[11px]">
              <span className="inline-flex items-center gap-1 text-blue-100" title="Proteção automática de sequência (Streak Freeze)">
                <Snowflake className="h-3.5 w-3.5 text-sky-200" />
                <span>{currentUser.streakFreezes ?? 1} proteção(ões)</span>
              </span>
              {onToggleReminder && (
                <button
                  type="button"
                  onClick={onToggleReminder}
                  className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 font-semibold text-white hover:bg-white/25 cursor-pointer"
                >
                  {currentUser.reminderEnabled ? (
                    <>
                      <Bell className="h-3 w-3 text-emerald-300" />
                      <span>Lembrete ON</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="h-3 w-3 text-blue-200" />
                      <span>Lembrete</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CEFR Level Progress Chips */}
        {topics.length > 0 && (
          <div className="relative z-10 mt-5 grid grid-cols-5 gap-2 border-t border-white/15 pt-4">
            {ALL_LEVELS.map((lvl) => {
              const lvlTopics = topics.filter((t) => t.level === lvl);
              const done = lvlTopics.filter((t) =>
                completedTopicIds.includes(t.id),
              ).length;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() =>
                    setSelectedLevel((cur) => (cur === lvl ? 'ALL' : lvl))
                  }
                  className={`rounded-xl px-2 py-2 text-center transition cursor-pointer ${selectedLevel === lvl
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                >
                  <p className="font-mono text-xs font-extrabold">{lvl}</p>
                  <p
                    className={`text-[10px] font-semibold ${selectedLevel === lvl ? 'text-blue-600' : 'text-blue-100'
                      }`}
                  >
                    {done}/{lvlTopics.length} unid.
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Unlinked / Independent student restriction banner */}
      {currentUser.role === 'student' &&
        !assignedTeacherName &&
        !currentUser.classId && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-950">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div>
                <p className="font-bold">
                  Modo autônomo ativo — sem professor ou turma vinculada
                </p>
                <p className="mt-0.5 text-[11px] text-amber-900">
                  Você tem acesso livre às unidades, Tutor IA e Revisão SM-2, mas
                  envios de Speaking, Writing e tarefas VIP que exigem validação
                  docente ficam restritos até vincular-se a um professor.
                </p>
              </div>
            </div>
            {onOpenTeacherLink && (
              <button
                type="button"
                onClick={onOpenTeacherLink}
                className="rounded-xl bg-amber-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-800 cursor-pointer"
              >
                Vincular a um professor
              </button>
            )}
          </div>
        )}

      {/* Weekly Study Plan Card (Goal-Based Onboarding) */}
      {currentUser.learningGoal && (() => {
        const plan = generateWeeklyStudyPlan(
          currentUser.learningGoal,
          activeCourse.code,
          topics,
          completedTopicIds,
          currentUser.dailyGoalMinutes,
          currentUser.recommendedLevelByLanguage?.[activeCourse.code] ??
            currentUser.recommendedLevel,
        );
        return (
          <div
            data-testid="weekly-study-plan-card"
            className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 shadow-2xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-800">
                  Plano Semanal · {plan.goalLabelPt} ({plan.weeklyTargetMinutes} min/sem)
                </p>
                <p className="mt-0.5 text-xs text-indigo-900/80">
                  {plan.descriptionPt} · Exame indicado: <strong>{plan.recommendedExamHint}</strong>
                </p>
              </div>
              {onSaveLearningGoal && (
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(true)}
                  className="rounded-xl border border-indigo-300 bg-white px-3 py-1.5 text-xs font-bold text-indigo-800 hover:bg-indigo-100 cursor-pointer"
                >
                  Ajustar meta
                </button>
              )}
            </div>
            {plan.recommendedTopics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {plan.recommendedTopics.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onStartTopic(t)}
                    className="rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:border-indigo-400 cursor-pointer"
                  >
                    {t.level} · {t.titlePt} →
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left: Connected Lesson Path */}
        <div className={`space-y-4 ${isRightPanelOpen ? 'xl:col-span-8' : 'xl:col-span-12'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Jornada {activeCourse.namePt} ({filteredTopics.length} unidades)
              </h2>
              <p className="text-xs text-slate-500">
                Unidades contextuais com vocabulário, gramática e prática nas 4 habilidades
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(['ALL', ...ALL_LEVELS] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${selectedLevel === lvl
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {lvl === 'ALL' ? 'Todos' : lvl}
                </button>
              ))}
              {moduleGroups.length > 1 && (
                <button
                  type="button"
                  data-testid="toggle-all-modules-btn"
                  onClick={() => setExpandAllModules((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
                >
                  {expandAllModules ? 'Só o módulo atual' : 'Expandir todos'}
                </button>
              )}
              <button
                type="button"
                onClick={toggleRightPanel}
                className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                title={isRightPanelOpen ? 'Recolher painel lateral direito' : 'Expandir painel lateral direito'}
              >
                {isRightPanelOpen ? (
                  <>
                    <PanelRightClose className="h-3.5 w-3.5 text-blue-600" />
                    <span>Recolher painel</span>
                  </>
                ) : (
                  <>
                    <PanelRightOpen className="h-3.5 w-3.5 text-blue-600" />
                    <span>Painel & Ranking</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {retentionAlerts.length > 0 && (
            <div
              data-testid="retention-alerts-card"
              className="rounded-2xl border border-indigo-200/80 bg-indigo-50/60 p-3.5 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                  <Bell className="h-4 w-4 text-indigo-600" />
                  <span>{retentionAlerts[0].titlePt}</span>
                  {retentionAlerts.length > 1 && (
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-indigo-700 ring-1 ring-indigo-200">
                      +{retentionAlerts.length - 1} alerta(s)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    void requestAndSendBrowserNotification(retentionAlerts[0]).then((r) =>
                      setRetentionNoticeMsg(r.message),
                    )
                  }
                  className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700 cursor-pointer"
                >
                  Ativar lembrete
                </button>
              </div>
              <p className="mt-1 text-[11px] text-indigo-900">
                {retentionNoticeMsg || retentionAlerts[0].bodyPt}
              </p>
            </div>
          )}

          {filteredTopics.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-display text-base font-bold text-slate-800">
                Ainda não há unidades publicadas para este idioma/filtro.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                O professor pode criar novas lições neste idioma em{' '}
                <strong>Modo Professor → Criar Tópico</strong>!
              </p>
            </div>
          ) : (
            <div className="relative space-y-4">
              {moduleGroups.map((mod) => {
                const moduleDoneCount = mod.topics.filter((ft) =>
                  completedTopicIds.includes(ft.id),
                ).length;
                const modulePct =
                  mod.topics.length > 0
                    ? Math.round((moduleDoneCount / mod.topics.length) * 100)
                    : 0;
                const isCurrentModule = mod.key === activeModuleKey;
                const isExpanded =
                  expandAllModules ||
                  (expandedModules[mod.key] !== undefined
                    ? expandedModules[mod.key]
                    : isCurrentModule);

                const lastTopic = mod.topics[mod.topics.length - 1];
                const checkpointId = `chk-${activeCourse.code}-${lastTopic.moduleIndex ?? mod.topics.length}-${mod.level.toLowerCase()}`;
                const checkpointKind: 'podcast' | 'video' =
                  (lastTopic.moduleIndex ?? 0) % 2 === 0 ? 'video' : 'podcast';
                const checkpointDone = (
                  currentUser.completedCheckpoints ?? []
                ).includes(checkpointId);

                return (
                  <div key={mod.key} className="space-y-3">
                    <ModuleAccordionHeader
                      moduleKey={mod.key}
                      level={mod.level}
                      moduleTitle={mod.title}
                      doneCount={moduleDoneCount}
                      totalCount={mod.topics.length}
                      pct={modulePct}
                      isExpanded={isExpanded}
                      isCurrentModule={isCurrentModule}
                      onToggle={() =>
                        setExpandedModules((prev) => ({
                          ...prev,
                          [mod.key]: !isExpanded,
                        }))
                      }
                    />

                    {isExpanded && (
                      <div className="space-y-4 pl-1 sm:pl-2">
                        {mod.topics.map((topic, idx) => {
                          const Icon = getTopicIcon(topic.icon);
                          const isCompleted = completedTopicIds.includes(topic.id);
                          const isNext = nextTopic?.id === topic.id && !isCompleted;
                          const savedProgress = !isCompleted
                            ? currentUser.topicStepProgress?.[topic.id]
                            : undefined;
                          const hasPartialProgress = Boolean(
                            savedProgress &&
                              (savedProgress.stepIdx > 0 ||
                                savedProgress.completedSteps.length > 0),
                          );
                          const partialPct = savedProgress
                            ? Math.min(
                                95,
                                Math.max(
                                  10,
                                  Math.round(
                                    ((savedProgress.stepIdx + 1) /
                                      Math.max(1, savedProgress.totalSteps)) *
                                      100,
                                  ),
                                ),
                              )
                            : 0;

                          return (
                            <div key={topic.id} className="relative flex gap-4">
                              {idx < mod.topics.length - 1 && (
                                <div
                                  className="absolute top-12 bottom-[-16px] left-6 hidden w-0.5 bg-slate-200 sm:block"
                                  aria-hidden="true"
                                />
                              )}

                    <div className="relative z-10 mt-5 hidden sm:block">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 shadow-xs transition ${isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : isNext
                            ? 'border-blue-600 bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'border-slate-200 bg-white text-slate-700'
                          }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                    </div>

                    <article
                      className={`flex-1 rounded-2xl border bg-white p-5 transition ${isNext
                        ? 'border-blue-300 shadow-sm ring-1 ring-blue-100'
                        : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
                        }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold ${LEVEL_COLORS[topic.level]}`}
                            >
                              {topic.level}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                              <Clock className="h-3.5 w-3.5" />
                              {topic.estimatedMinutes} min
                            </span>
                            {offlineIds.includes(topic.id) && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                Offline
                              </span>
                            )}
                            {isImmersionLevel(topic.level) && (
                              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">
                                🌐 {getImmersionStrings(topic.languageCode ?? activeCourse.code, topic.level).badgeLabel}
                              </span>
                            )}
                            {topic.isCustom && (
                              <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 ring-1 ring-purple-200">
                                Criado pelo Professor
                              </span>
                            )}
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                <CheckCircle2 className="h-3 w-3" />
                                Concluído
                              </span>
                            )}
                          </div>

                          <h3 className="font-display text-lg font-bold text-slate-900">
                            {isImmersionLevel(topic.level) ? topic.titleEn : topic.titlePt}
                          </h3>
                          <p className="text-xs font-medium text-slate-400">
                            {isImmersionLevel(topic.level) ? topic.titlePt : topic.titleEn}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {onPracticeTopicWithAI && (
                            <button
                              type="button"
                              onClick={() => onPracticeTopicWithAI(topic)}
                              className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 cursor-pointer"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>{getImmersionStrings(topic.languageCode ?? activeCourse.code, topic.level).practiceWithAiBtn}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onStartTopic(topic)}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${isCompleted
                              ? 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                              : 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
                              }`}
                          >
                            {isCompleted ? (
                              <>
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>Refazer</span>
                              </>
                            ) : hasPartialProgress && savedProgress ? (
                              <>
                                <Play className="h-3.5 w-3.5 fill-white" />
                                <span>
                                  Continuar ({savedProgress.stepIdx + 1}/
                                  {savedProgress.totalSteps})
                                </span>
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5 fill-white" />
                                <span>Começar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="mt-2 text-sm text-slate-600">{topic.subtitle}</p>

                      {hasPartialProgress && savedProgress && (
                        <div className="mt-3 rounded-xl border border-blue-200/80 bg-blue-50/70 px-3 py-2">
                          <div className="flex items-center justify-between text-[11px] font-bold text-blue-800">
                            <span>
                              Em andamento · Etapa {savedProgress.stepIdx + 1} de{' '}
                              {savedProgress.totalSteps}
                            </span>
                            <span className="font-mono">{partialPct}%</span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                            <div
                              className="h-full rounded-full bg-blue-600 transition-all duration-300"
                              style={{ width: `${partialPct}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {topic.topicTipsSummary.length > 0 && (
                        <div className="topic-tips-box mt-3.5 rounded-xl border p-3">
                          <p className="topic-tips-title flex items-center gap-1.5 text-xs font-bold">
                            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                            <span>
                              {getImmersionStrings(topic.languageCode ?? activeCourse.code, topic.level).tipsInTopicHeading}:
                            </span>
                          </p>
                          <ul className="mt-1.5 space-y-1">
                            {topic.topicTipsSummary.map((tipItem, tipIdx) => (
                              <li
                                key={tipIdx}
                                className="topic-tips-item flex items-start gap-2 text-xs leading-relaxed"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                                <span>{tipItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                        <SkillBadge kind="vocab_intro" compact />
                        <SkillBadge kind="listening" compact />
                        <SkillBadge kind="reading" compact />
                        <SkillBadge kind="speaking" compact />
                        <SkillBadge kind="writing" compact />
                        {topic.recycledLinks && topic.recycledLinks.length > 0 && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-200"
                            title={`Revisão espiral de: ${topic.recycledLinks.map((l) => l.titlePt).join(', ')}`}
                          >
                            <RefreshCw className="h-2.5 w-2.5" />
                            Revisão Espiral ({topic.recycledLinks.length})
                          </span>
                        )}
                      </div>
                    </article>
                            </div>
                          );
                        })}

                        <div
                          data-testid="trail-checkpoint-card"
                          className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 p-4 transition ${
                            checkpointDone
                              ? 'border-emerald-300 bg-emerald-50/70'
                              : 'border-amber-300 bg-amber-50/70'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                                checkpointDone
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-amber-400 text-slate-950'
                              }`}
                            >
                              {checkpointDone ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : checkpointKind === 'podcast' ? (
                                <Headphones className="h-5 w-5" />
                              ) : (
                                <Clapperboard className="h-5 w-5" />
                              )}
                            </span>
                            <div>
                              <p className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                                <Flag className="h-3 w-3" />
                                <span>Ponto de Verificação · {mod.title}</span>
                              </p>
                              <p className="font-display text-sm font-extrabold text-slate-900">
                                {checkpointKind === 'podcast'
                                  ? `Podcast de Checagem (${mod.level}) — Diálogo & Compreensão`
                                  : `Vídeo Interativo de Checagem (${mod.level}) — Legendas & Quiz`}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setActiveCheckpoint({
                                id: checkpointId,
                                kind: checkpointKind,
                                level: mod.level,
                                titlePt: `${mod.title} (${mod.level})`,
                                mediaId:
                                  checkpointKind === 'podcast'
                                    ? `pod-${activeCourse.code}-${mod.level.toLowerCase()}`
                                    : undefined,
                              })
                            }
                            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                              checkpointDone
                                ? 'border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50'
                                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                            }`}
                          >
                            {checkpointDone ? 'Revisar Checagem' : 'Abrir Checagem (+60 XP)'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Daily Quests, Skill Radar, Leaderboard & Teacher Feedback */}
        {isRightPanelOpen && (
          <aside className="space-y-5 xl:col-span-4">
            {assignments.filter(
              (a) =>
                a.languageCode === activeCourse.code &&
                ((!a.classId && !a.studentId) ||
                  (a.classId && a.classId === currentUser.classId) ||
                  (a.studentId && a.studentId === currentUser.id) ||
                  currentUser.role === 'teacher'),
            ).length > 0 && (
                <div className="rounded-2xl border border-blue-200/80 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Tarefas do Professor
                    </h3>
                    <Calendar className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {assignments
                      .filter(
                        (a) =>
                          a.languageCode === activeCourse.code &&
                          ((!a.classId && !a.studentId) ||
                            (a.classId && a.classId === currentUser.classId) ||
                            (a.studentId && a.studentId === currentUser.id) ||
                            currentUser.role === 'teacher'),
                      )
                      .slice(0, 4)
                      .map((task) => {
                        const linkedTopic = task.topicId
                          ? topics.find((t) => t.id === task.topicId)
                          : undefined;
                        const done = linkedTopic
                          ? completedTopicIds.includes(linkedTopic.id)
                          : false;
                        return (
                          <div
                            key={task.id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-bold text-slate-900">{task.title}</p>
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${done
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-800'
                                  }`}
                              >
                                {done ? 'Concluída' : `Prazo ${task.dueDate}`}
                              </span>
                            </div>
                            {task.description && (
                              <p className="mt-1 text-slate-600">{task.description}</p>
                            )}
                            {linkedTopic && (
                              <button
                                type="button"
                                onClick={() => onStartTopic(linkedTopic)}
                                className="mt-2 font-bold text-blue-600 hover:underline cursor-pointer"
                              >
                                Abrir unidade: {linkedTopic.titlePt} →
                              </button>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            {/* Daily Quests (Missões Diárias) */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Missões Diárias
                </h3>
                <Zap className="h-4.5 w-4.5 text-amber-500" />
              </div>
              <div className="mt-3 space-y-3">
                {quests.map((q) => {
                  const done = q.progress >= q.target;
                  const claimed = currentUser.dailyQuests.claimedQuestIds.includes(
                    q.id,
                  );
                  const pct = Math.round((q.progress / q.target) * 100);
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-800">
                        <span>{q.title}</span>
                        <span className="font-mono text-[11px] text-blue-700">
                          {q.progress}/{q.target}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {done && (
                        <div className="mt-2 flex justify-end">
                          {claimed ? (
                            <span className="text-[11px] font-bold text-emerald-700">
                              ✓ +{q.bonusXp} XP resgatados
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onClaimDailyQuest(q.id, q.bonusXp)}
                              className="rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 cursor-pointer"
                            >
                              Resgatar +{q.bonusXp} XP
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <SkillRadar
              scores={currentUser.skillScores}
              onPracticeLowest={
                nextTopic ? () => onStartTopic(nextTopic) : undefined
              }
            />

            {/* Class Leaderboard */}
            {sortedLeaderboard.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Ranking da Escola
                  </h3>
                  <Trophy className="h-4.5 w-4.5 text-amber-500" />
                </div>
                <div className="mt-3 space-y-2">
                  {sortedLeaderboard.map((member, rankIdx) => {
                    const isMe = member.id === currentUser.id;
                    return (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs ${isMe
                          ? 'bg-blue-50 font-bold text-blue-900 ring-1 ring-blue-200'
                          : 'bg-slate-50 text-slate-700'
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-4 font-mono font-extrabold text-slate-400">
                            #{rankIdx + 1}
                          </span>
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                            style={{ backgroundColor: member.avatarColor }}
                          >
                            {member.name.slice(0, 2).toUpperCase()}
                          </span>
                          <span className="truncate">
                            {member.name} {isMe ? '(Você)' : ''}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-blue-700">
                          {member.xp} XP
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Teacher Feedback Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Correções do Professor
                </h3>
                <MessageSquareHeart className="h-4.5 w-4.5 text-amber-500" />
              </div>

              {reviewedSubmissions.length === 0 ? (
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Envie seu áudio de <strong>Speaking</strong> ou texto de{' '}
                  <strong>Writing</strong> nas lições para receber feedback e selos do professor!
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {reviewedSubmissions.slice(0, 3).map((sub) => (
                    <div
                      key={sub.id}
                      className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                          {sub.type === 'speaking' ? (
                            <Mic className="h-3.5 w-3.5 text-rose-500" />
                          ) : (
                            <PenTool className="h-3.5 w-3.5 text-amber-600" />
                          )}
                          {sub.studentName} · {sub.topicTitle}
                        </span>
                        {sub.teacherBadge && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            <Award className="h-3 w-3" />
                            {sub.teacherBadge}
                          </span>
                        )}
                      </div>

                      {sub.pronunciationRubric && (
                        <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[10px] font-bold text-rose-700">
                          <span className="rounded-md bg-rose-50 px-1.5 py-0.5">
                            Clareza {sub.pronunciationRubric.clarity}/5
                          </span>
                          <span className="rounded-md bg-rose-50 px-1.5 py-0.5">
                            Entonação {sub.pronunciationRubric.intonation}/5
                          </span>
                          <span className="rounded-md bg-rose-50 px-1.5 py-0.5">
                            Ritmo {sub.pronunciationRubric.rhythm}/5
                          </span>
                        </div>
                      )}

                      {sub.teacherFeedback && (
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                          “{sub.teacherFeedback}”
                        </p>
                      )}
                      {sub.correctedText && (
                        <p className="mt-2 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-medium text-emerald-900 ring-1 ring-emerald-200/70">
                          Sugestão: {sub.correctedText}
                        </p>
                      )}
                    </div>
                  ))}

                  {onGoToTeacher && (
                    <button
                      type="button"
                      onClick={onGoToTeacher}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      Abrir fila completa no Modo Professor →
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {activeCheckpoint && (
        <TrailCheckpointModal
          checkpoint={activeCheckpoint}
          languageCode={activeCourse.code}
          alreadyCompleted={(currentUser.completedCheckpoints ?? []).includes(
            activeCheckpoint.id,
          )}
          onComplete={(id, score) => onCompleteCheckpoint?.(id, score)}
          onClose={() => setActiveCheckpoint(null)}
        />
      )}

      {onSaveLearningGoal && (
        <GoalOnboardingModal
          open={goalModalOpen}
          currentGoal={currentUser.learningGoal}
          currentTargetDate={currentUser.goalTargetDate}
          onSave={onSaveLearningGoal}
          onClose={() => setGoalModalOpen(false)}
        />
      )}

      <ConfirmDialog
        open={confirmUnlinkOpen}
        title="Desvincular-se do professor atual?"
        description={`Você deixará de estar vinculado(a) a ${assignedTeacherName ?? 'seu professor atual'}.`}
        warningBox="Sem vínculo com um professor ou turma, atividades que exigem validação docente (envio de áudio Speaking para correção, Writing avaliado e tarefas VIP) ficarão bloqueadas até você se vincular novamente."
        confirmLabel="Confirmar desvinculação"
        tone="warning"
        onConfirm={() => {
          setConfirmUnlinkOpen(false);
          onSelfUnlinkTeacher?.();
        }}
        onCancel={() => setConfirmUnlinkOpen(false)}
      />
    </div>
  );
}

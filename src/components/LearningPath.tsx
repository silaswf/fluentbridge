import { useEffect, useState } from 'react';
import {
  Activity,
  Award,
  Bell,
  BellOff,
  BookOpenCheck,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  CloudSun,
  Coffee,
  Compass,
  Cpu,
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
  Lightbulb,
  MessageSquareHeart,
  MessageSquareQuote,
  Mic,
  Newspaper,
  PenTool,
  Plane,
  Play,
  Presentation,
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
  StudentSubmission,
  Topic,
  UserProfile,
} from '../types/learning';
import { SkillBadge } from './SkillBadge';
import { SkillRadar } from './SkillRadar';

interface LearningPathProps {
  currentUser: UserProfile;
  teacherName: string;
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
  reviewedSubmissions: StudentSubmission[];
  onGoToTeacher?: () => void;
}

const TOPIC_ICONS = {
  Activity,
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
  reviewedSubmissions,
  onGoToTeacher,
}: LearningPathProps) {
  const [selectedLevel, setSelectedLevel] =
    useState<'ALL' | CEFRLevel>(initialFilterLevel);

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
              {currentUser.recommendedLevel && activeCourse.code === 'en' && (
                <span className="rounded-full bg-amber-300 px-2.5 py-0.5 font-mono text-[11px] font-extrabold text-amber-950">
                  Nível indicado: {currentUser.recommendedLevel}
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
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50 active:scale-[0.99] cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-blue-700" />
                  <span>
                    {completedTopicIds.includes(nextTopic.id)
                      ? `Revisar: ${nextTopic.titlePt}`
                      : `Continuar (${nextTopic.level}): ${nextTopic.titlePt}`}
                  </span>
                </button>
              )}

              {activeCourse.code === 'en' && (
                <button
                  type="button"
                  onClick={onOpenPlacementTest}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/12 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20 cursor-pointer"
                >
                  <Compass className="h-4 w-4" />
                  <span>Teste de Nivelamento (2 min)</span>
                </button>
              )}
            </div>
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
                    className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold transition cursor-pointer ${
                      currentUser.dailyGoalMinutes === min
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
                  className={`rounded-xl px-2 py-2 text-center transition cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <p className="font-mono text-xs font-extrabold">{lvl}</p>
                  <p
                    className={`text-[10px] font-semibold ${
                      selectedLevel === lvl ? 'text-blue-600' : 'text-blue-100'
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

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left: Connected Lesson Path */}
        <div className="space-y-4 xl:col-span-8">
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
                  className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {lvl === 'ALL' ? 'Todos' : lvl}
                </button>
              ))}
            </div>
          </div>

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
              {filteredTopics.map((topic, idx) => {
                const Icon = getTopicIcon(topic.icon);
                const isCompleted = completedTopicIds.includes(topic.id);
                const isNext = nextTopic?.id === topic.id && !isCompleted;

                return (
                  <div key={topic.id} className="relative flex gap-4">
                    {idx < filteredTopics.length - 1 && (
                      <div
                        className="absolute top-12 bottom-[-16px] left-6 w-0.5 bg-slate-200"
                        aria-hidden="true"
                      />
                    )}

                    <div className="relative z-10 mt-5 hidden sm:block">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 shadow-xs transition ${
                          isCompleted
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
                      className={`flex-1 rounded-2xl border bg-white p-5 transition ${
                        isNext
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
                            {topic.titlePt}
                          </h3>
                          <p className="text-xs font-medium text-slate-400">
                            {topic.titleEn}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onStartTopic(topic)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                            isCompleted
                              ? 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                              : 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>Refazer</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3.5 w-3.5 fill-white" />
                              <span>Começar</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="mt-2 text-sm text-slate-600">{topic.subtitle}</p>

                      {topic.topicTipsSummary.length > 0 && (
                        <div className="mt-3.5 rounded-xl border border-amber-200/70 bg-amber-50/70 p-3">
                          <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                            <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                            Dicas neste tópico:
                          </p>
                          <ul className="mt-1.5 space-y-1">
                            {topic.topicTipsSummary.map((tipItem, tipIdx) => (
                              <li
                                key={tipIdx}
                                className="flex items-start gap-2 text-xs text-amber-950/85"
                              >
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                                <span>{tipItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        <SkillBadge kind="listening" compact />
                        <SkillBadge kind="reading" compact />
                        <SkillBadge kind="speaking" compact />
                        <SkillBadge kind="writing" compact />
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Daily Quests, Skill Radar, Leaderboard & Teacher Feedback */}
        <aside className="space-y-5 xl:col-span-4">
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
                        className={`h-full rounded-full transition-all duration-500 ${
                          done ? 'bg-emerald-500' : 'bg-blue-600'
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
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs ${
                        isMe
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
      </div>
    </div>
  );
}

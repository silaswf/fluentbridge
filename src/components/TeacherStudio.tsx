/**
 * @file src/components/TeacherStudio.tsx
 * @description Estúdio do Professor: orquestra correções, gestão de turmas/boletins PDF, painel VIP, criador de tópicos, tarefas e configurações da escola.
 * @exports TeacherTab, TeacherStudio
 */
import { useEffect, useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Cloud,
  Copy,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  Users,
  Crown,
  ShieldCheck,
} from 'lucide-react';
import type {
  UserProfile,
  CEFRLevel,
  ClassGroup,
  CloudConfig,
  LanguageCode,
  PlatformState,
  PronunciationRubric,
  StudentSubmission,
  TeacherAssignment,
  Topic,
} from '../types/learning';
import { getAudioClip } from '../utils/audioDb';
import { resolveSubmissionAudioUrl } from '../utils/cloudSync';
import { getSelectedVoiceLabels } from '../utils/speech';
import { getTeacherDisplayName } from '../utils/teacherDisplay';
import { ConfirmDialog } from './ConfirmDialog';
import { SchoolSettingsTab } from './teacher/SchoolSettingsTab';
import { SubmissionsGradingTab } from './teacher/SubmissionsGradingTab';
import { TopicCreatorTab } from './teacher/TopicCreatorTab';
import { VipStudentsPanel } from './teacher/VipStudentsPanel';
import { downloadPedagogicalReportPdf } from '../utils/pedagogicalReportPdf';
import { getLanguageCourseMeta, LANGUAGE_COURSES_META } from '../data/platformDefaults';
import {
  DEFAULT_TEACHER_ACCESS_CODE,
  isMasterAdminEmail,
  MASTER_ADMIN_EMAIL,
} from '../config/appConfig';

export type TeacherTab = 'corrections' | 'classes' | 'create' | 'cloud';

interface TeacherStudioProps {
  state: PlatformState;
  initialTab?: TeacherTab;
  currentUser: UserProfile;
  autoSyncStatus?: {
    state: 'idle' | 'syncing' | 'synced' | 'error';
    message?: string;
    updatedAt?: string;
  };
  onGradeSubmission: (
    submissionId: string,
    payload: {
      teacherFeedback: string;
      correctedText: string;
      teacherBadge: string;
      pronunciationRubric?: PronunciationRubric;
    },
  ) => void;
  onCreateClass: (payload: {
    name: string;
    level: CEFRLevel;
    schedule: string;
    description: string;
  }) => void;
  onDeleteClass: (classId: string) => void;
  onIssueCertificateToStudent: (studentId: string, level: CEFRLevel) => void;
  onAddCustomTopic: (topic: Topic) => void;
  onDeleteCustomTopic: (topicId: string) => void;
  onUpdateSettings: (payload: {
    schoolName: string;
    teacherName: string;
  }) => void;
  onUpdateCloudConfig: (cloudConfig: CloudConfig) => void;
  onApplyCloudSnapshot: (snapshot: Partial<PlatformState>) => void;
  onImportState: (imported: PlatformState) => void;
  onResetDemo: () => void;
  onPlayTopic: (topic: Topic) => void;
  onToggleUserRole: (userId: string) => void;
  onMoveUserClass: (userId: string, classId?: string) => void;
  onDeleteUser: (userId: string) => void;
  onLinkStudentToTeacher?: (studentId: string, teacherId: string) => void;
  onUnlinkStudentFromTeacher?: (studentId: string) => void;
  onReassignStudentTeacher?: (studentId: string, newTeacherId: string | undefined) => void;
  onCreateAssignment?: (payload: {
    title: string;
    description: string;
    classId?: string;
    studentId?: string;
    languageCode: LanguageCode;
    topicId?: string;
    dueDate: string;
  }) => void;
  onDeleteAssignment?: (assignmentId: string) => void;
}

const WRITING_BADGES = [
  'Ótima estrutura!',
  'Vocabulário natural!',
  'Excelente progresso!',
  'Gramática precisa!',
];

const SPEAKING_BADGES = [
  'Pronúncia nítida!',
  'Ótima entonação!',
  'Fluência natural!',
  'Ritmo excelente!',
];

export function TeacherStudio({
  state,
  currentUser,
  autoSyncStatus,
  initialTab = 'corrections',
  onGradeSubmission,
  onCreateClass,
  onDeleteClass,
  onIssueCertificateToStudent,
  onAddCustomTopic,
  onDeleteCustomTopic,
  onUpdateSettings,
  onUpdateCloudConfig,
  onApplyCloudSnapshot,
  onImportState,
  onResetDemo,
  onPlayTopic,
  onToggleUserRole,
  onMoveUserClass,
  onDeleteUser,
  onLinkStudentToTeacher,
  onUnlinkStudentFromTeacher,
  onReassignStudentTeacher,
  onCreateAssignment,
  onDeleteAssignment,
}: TeacherStudioProps) {
  const isMaster =
    Boolean(currentUser.isMasterAdmin) || isMasterAdminEmail(currentUser.email);
  const [pendingConfirm, setPendingConfirm] = useState<{
    title: string;
    description: string;
    warningBox?: string;
    confirmLabel: string;
    tone: 'danger' | 'warning' | 'primary';
    action: () => void;
  } | null>(null);
  const [tab, setTab] = useState<TeacherTab>(initialTab);
  const [voiceLabels, setVoiceLabels] = useState(() => getSelectedVoiceLabels());

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const refreshVoices = () => setVoiceLabels(getSelectedVoiceLabels());
    refreshVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
      return () => {
        window.speechSynthesis.removeEventListener?.(
          'voiceschanged',
          refreshVoices,
        );
      };
    }
    return undefined;
  }, []);

  // Corrections filters & selection
  const [filterType, setFilterType] = useState<'all' | 'writing' | 'speaking'>('all');
  const [filterClassId, setFilterClassId] = useState<string>('ALL');
  const [selectedSubId, setSelectedSubId] = useState<string>(
    state.submissions[0]?.id ?? '',
  );

  const filteredSubs = state.submissions.filter((sub) => {
    if (!isMaster) {
      const subStu = state.users.find((u) => u.id === sub.studentId);
      const subCls = state.classes.find((c) => c.id === sub.classId);
      const hasExplicitOwner = Boolean(
        sub.teacherId || subStu?.assignedTeacherId || subCls?.teacherId,
      );
      const belongsToMe =
        sub.teacherId === currentUser.id ||
        subStu?.assignedTeacherId === currentUser.id ||
        subCls?.teacherId === currentUser.id;
      if (hasExplicitOwner && !belongsToMe) return false;
    }
    if (filterType !== 'all' && sub.type !== filterType) return false;
    if (filterClassId !== 'ALL' && sub.classId !== filterClassId) return false;
    return true;
  });

  const selectedSub: StudentSubmission | undefined =
    filteredSubs.find((s) => s.id === selectedSubId) ?? filteredSubs[0];

  const [feedbackDraft, setFeedbackDraft] = useState<string>(
    selectedSub?.teacherFeedback ?? '',
  );
  const [correctedDraft, setCorrectedDraft] = useState<string>(
    selectedSub?.correctedText ?? selectedSub?.responseText ?? '',
  );
  const [badgeDraft, setBadgeDraft] = useState<string>(
    selectedSub?.teacherBadge ??
      (selectedSub?.type === 'speaking' ? SPEAKING_BADGES[0] : WRITING_BADGES[0]),
  );
  const [rubricDraft, setRubricDraft] = useState<PronunciationRubric>(
    selectedSub?.pronunciationRubric ?? { clarity: 4, intonation: 4, rhythm: 4 },
  );
  const [loadedAudioUrl, setLoadedAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;
    setLoadedAudioUrl(null);

    if (selectedSub?.type === 'speaking') {
      const loadAudio = async () => {
        if (selectedSub.audioId) {
          const blob = await getAudioClip(selectedSub.audioId);
          if (!active) return;
          if (blob) {
            createdUrl = URL.createObjectURL(blob);
            setLoadedAudioUrl(createdUrl);
            return;
          }
        }
        const remoteUrl = resolveSubmissionAudioUrl(
          selectedSub,
          state.cloudConfig,
        );
        if (active && remoteUrl) {
          setLoadedAudioUrl(remoteUrl);
        }
      };
      void loadAudio();
    }

    return () => {
      active = false;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [
    selectedSub?.id,
    selectedSub?.audioId,
    selectedSub?.audioPath,
    selectedSub?.audioDataUrl,
    selectedSub?.type,
    state.cloudConfig,
  ]);

  const handleSelectSubmission = (sub: StudentSubmission) => {
    setSelectedSubId(sub.id);
    setFeedbackDraft(sub.teacherFeedback ?? '');
    setCorrectedDraft(sub.correctedText ?? sub.responseText);
    setBadgeDraft(
      sub.teacherBadge ??
        (sub.type === 'speaking' ? SPEAKING_BADGES[0] : WRITING_BADGES[0]),
    );
    setRubricDraft(
      sub.pronunciationRubric ?? { clarity: 4, intonation: 4, rhythm: 4 },
    );
  };

  // Classes tab state
  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState<CEFRLevel>('A2');
  const [newClassSchedule, setNewClassSchedule] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [certTargetLevel, setCertTargetLevel] = useState<Record<string, CEFRLevel>>({});

  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignClassId, setAssignClassId] = useState('');
  const [assignLang, setAssignLang] = useState<LanguageCode>('en');
  const [assignDueDate, setAssignDueDate] = useState(() =>
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const [copiedClassId, setCopiedClassId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');

  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    onCreateClass({
      name: newClassName.trim(),
      level: newClassLevel,
      schedule: newClassSchedule.trim() || 'Horário flexível',
      description:
        newClassDesc.trim() || 'Turma de acompanhamento das 4 habilidades.',
    });
    setNewClassName('');
    setNewClassSchedule('');
    setNewClassDesc('');
  };

  const pendingCount = state.submissions.filter((sub) => {
    if (sub.status !== 'pending') return false;
    if (isMaster) return true;
    const subStu = state.users.find((u) => u.id === sub.studentId);
    const subCls = state.classes.find((c) => c.id === sub.classId);
    const hasExplicitOwner = Boolean(
      sub.teacherId || subStu?.assignedTeacherId || subCls?.teacherId,
    );
    const belongsToMe =
      sub.teacherId === currentUser.id ||
      subStu?.assignedTeacherId === currentUser.id ||
      subCls?.teacherId === currentUser.id;
    return !hasExplicitOwner || belongsToMe;
  }).length;
  const students = state.users.filter((u) => u.role === 'student');

  const getClassName = (classId?: string) =>
    state.classes.find((c) => c.id === classId)?.name ?? 'Sem turma';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 ring-1 ring-purple-200">
            <GraduationCap className="h-3.5 w-3.5" />
            Painel de Gestão, Correção & Nuvem
          </span>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
            Modo Professor
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Corrija textos e áudios de Speaking, gerencie turmas e certificados, crie unidades e sincronize com Supabase/Gemini.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setTab('corrections')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
              tab === 'corrections'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Correções ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('classes')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
              tab === 'classes'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Turmas ({state.classes.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
              tab === 'create'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Criar Tópico</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('cloud')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
              tab === 'cloud'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Cloud className="h-4 w-4" />
            <span>Nuvem, IA & Escola</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CORRECTIONS (WRITING + SPEAKING AUDIO) */}
      {tab === 'corrections' && (
        <SubmissionsGradingTab
          submissions={filteredSubs}
          classes={state.classes}
          selectedSub={selectedSub}
          loadedAudioUrl={loadedAudioUrl}
          feedbackDraft={feedbackDraft}
          correctedDraft={correctedDraft}
          badgeDraft={badgeDraft}
          rubricDraft={rubricDraft}
          filterType={filterType}
          filterClassId={filterClassId}
          onChangeFilterType={setFilterType}
          onChangeFilterClassId={setFilterClassId}
          onSelectSubmission={handleSelectSubmission}
          onChangeFeedback={setFeedbackDraft}
          onChangeCorrected={setCorrectedDraft}
          onChangeBadge={setBadgeDraft}
          onChangeRubric={setRubricDraft}
          onGradeSubmission={onGradeSubmission}
        />
      )}

      {/* TAB 2: CLASSES, STUDENTS & CERTIFICATES */}
      {tab === 'classes' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Create New Class + Assignments + School Analytics */}
          <div className="space-y-4 lg:col-span-4 lg:self-start">
          <form
            onSubmit={handleCreateClassSubmit}
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs"
          >
            <h2 className="font-display text-lg font-bold text-slate-900">
              Nova Turma
            </h2>
            <div>
              <label className="text-xs font-bold text-slate-700">Nome da Turma *</label>
              <input
                required
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Ex: Turma A2 · Terça Noite"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700">Nível</label>
                <select
                  value={newClassLevel}
                  onChange={(e) => setNewClassLevel(e.target.value as CEFRLevel)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Horário</label>
                <input
                  value={newClassSchedule}
                  onChange={(e) => setNewClassSchedule(e.target.value)}
                  placeholder="Ter/Qui 19h"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Descrição</label>
              <textarea
                rows={2}
                value={newClassDesc}
                onChange={(e) => setNewClassDesc(e.target.value)}
                placeholder="Objetivos e foco da turma..."
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Criar turma e gerar código</span>
            </button>
          </form>

          {/* Phase 8: School Skill Analytics */}
          {students.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-display text-sm font-extrabold text-slate-900">
                Analytics Médio da Escola
              </h3>
              {(['listening', 'reading', 'speaking', 'writing'] as const).map((sk) => {
                const avg = Math.round(
                  students.reduce((acc, s) => acc + (s.skillScores[sk] ?? 50), 0) /
                    students.length,
                );
                return (
                  <div key={sk} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span className="capitalize">{sk}</span>
                      <span className="font-mono">{avg}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3 text-center">
                <div>
                  <p className="font-mono text-base font-extrabold text-indigo-800">
                    {students.reduce((acc, s) => acc + (s.completedTopicIds?.length ?? 0), 0)}
                  </p>
                  <p className="text-[10px] font-bold text-indigo-700">Unid. Concluídas</p>
                </div>
                <div>
                  <p className="font-mono text-base font-extrabold text-emerald-700">
                    {students.reduce((acc, s) => acc + (s.examAttempts?.length ?? 0), 0)}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-700">Simulados Feitos</p>
                </div>
                <div>
                  <p className="font-mono text-base font-extrabold text-amber-700">
                    {students.filter((s) => (s.streakDays ?? 0) >= 3).length}/{students.length}
                  </p>
                  <p className="text-[10px] font-bold text-amber-700">Ativos (3d+)</p>
                </div>
              </div>
            </div>
          )}

          {/* Phase 8: Assignments */}
          {onCreateAssignment && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-display text-sm font-extrabold text-slate-900">
                Nova Tarefa de Casa
              </h3>
              <input
                value={assignTitle}
                onChange={(e) => setAssignTitle(e.target.value)}
                placeholder="Título (ex: Completar Unidade A1-2)"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
              <input
                value={assignDesc}
                onChange={(e) => setAssignDesc(e.target.value)}
                placeholder="Instrução rápida para a turma..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={assignLang}
                  onChange={(e) => setAssignLang(e.target.value as LanguageCode)}
                  className="rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
                >
                  {LANGUAGE_COURSES_META.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.namePt}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
                />
              </div>
              <select
                value={assignClassId}
                onChange={(e) => setAssignClassId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
              >
                <option value="">Todas as turmas</option>
                {state.classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!assignTitle.trim()) return;
                  onCreateAssignment({
                    title: assignTitle.trim(),
                    description: assignDesc.trim(),
                    classId: assignClassId || undefined,
                    languageCode: assignLang,
                    dueDate: assignDueDate,
                  });
                  setAssignTitle('');
                  setAssignDesc('');
                }}
                className="w-full rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Publicar tarefa
              </button>

              {(state.assignments ?? []).length > 0 && (
                <div className="space-y-1.5 border-t border-slate-100 pt-2">
                  {(state.assignments ?? []).slice(0, 4).map((a: TeacherAssignment) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px]"
                    >
                      <span className="truncate font-semibold text-slate-800">
                        {a.title} ({a.dueDate})
                      </span>
                      {onDeleteAssignment && (
                        <button
                          type="button"
                          onClick={() =>
                            setPendingConfirm({
                              title: `Remover tarefa "${a.title}"?`,
                              description:
                                'A tarefa deixará de aparecer na trilha dos alunos.',
                              confirmLabel: 'Remover tarefa',
                              tone: 'danger',
                              action: () => onDeleteAssignment(a.id),
                            })
                          }
                          className="text-rose-600 hover:underline cursor-pointer"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          </div>

          {/* Existing Classes & Students */}
          <div className="space-y-4 lg:col-span-8">
            <h2 className="font-display text-sm font-bold tracking-wide text-slate-500 uppercase">
              Turmas Ativas ({state.classes.length}) & Alunos ({students.length})
            </h2>

            {state.classes.map((cls: ClassGroup) => {
              const enrolled = students.filter((s) => s.classId === cls.id);
              return (
                <div
                  key={cls.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-700">
                          {cls.level}
                        </span>
                        <h3 className="font-display text-base font-extrabold text-slate-900">
                          {cls.name}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {cls.schedule} · {cls.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          void navigator.clipboard?.writeText(cls.code);
                          setCopiedClassId(cls.id);
                          window.setTimeout(() => setCopiedClassId(null), 1800);
                        }}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
                        title="Copiar código da turma"
                      >
                        {copiedClassId === cls.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-slate-500" />
                        )}
                        <span>Código: {cls.code}</span>
                      </button>
                      {state.classes.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setPendingConfirm({
                              title: `Excluir turma "${cls.name}"?`,
                              description: `Os alunos matriculados em ${cls.name} ficarão sem turma vinculada.`,
                              warningBox:
                                'Esta ação remove o código da turma. Alunos que não tiverem professor VIP vinculado passarão para o modo autônomo.',
                              confirmLabel: 'Excluir turma',
                              tone: 'danger',
                              action: () => onDeleteClass(cls.id),
                            })
                          }
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          aria-label={`Excluir turma ${cls.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {enrolled.length === 0 ? (
                    <p className="mt-3 text-xs text-slate-400">
                      Nenhum aluno nesta turma ainda. Compartilhe o código{' '}
                      <strong className="font-mono text-slate-600">{cls.code}</strong> no cadastro!
                    </p>
                  ) : (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {enrolled.map((stu) => {
                        const chosenLvl = certTargetLevel[stu.id] ?? cls.level;
                        const alreadyHas = stu.issuedCertificates.some(
                          (c) => c.level === chosenLvl,
                        );
                        return (
                          <div
                            key={stu.id}
                            className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                                  style={{ backgroundColor: stu.avatarColor }}
                                >
                                  {stu.name.slice(0, 2).toUpperCase()}
                                </span>
                                <div>
                                  <p className="text-xs font-bold text-slate-900">
                                    {stu.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {stu.xp} XP · {stu.completedTopicIds.length} unid. concluídas
                                  </p>
                                </div>
                              </div>
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                                {stu.issuedCertificates.length} cert.
                              </span>
                            </div>

                            <div className="mt-2.5 grid grid-cols-4 gap-1 text-center font-mono text-[10px] font-semibold text-slate-600">
                              <span className="rounded bg-white py-1">L:{stu.skillScores.listening}%</span>
                              <span className="rounded bg-white py-1">R:{stu.skillScores.reading}%</span>
                              <span className="rounded bg-white py-1">S:{stu.skillScores.speaking}%</span>
                              <span className="rounded bg-white py-1">W:{stu.skillScores.writing}%</span>
                            </div>

                            <div className="mt-3 flex items-center gap-1.5">
                              <select
                                value={chosenLvl}
                                onChange={(e) =>
                                  setCertTargetLevel((prev) => ({
                                    ...prev,
                                    [stu.id]: e.target.value as CEFRLevel,
                                  }))
                                }
                                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-mono text-xs font-bold"
                              >
                                {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map(
                                  (l) => (
                                    <option key={l} value={l}>
                                      {l}
                                    </option>
                                  ),
                                )}
                              </select>
                              <button
                                type="button"
                                disabled={alreadyHas}
                                onClick={() =>
                                  onIssueCertificateToStudent(stu.id, chosenLvl)
                                }
                                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-500 cursor-pointer"
                              >
                                <Award className="h-3.5 w-3.5" />
                                <span>
                                  {alreadyHas
                                    ? `Certificado ${chosenLvl} emitido`
                                    : `Emitir Cert. ${chosenLvl}`}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  downloadPedagogicalReportPdf({
                                    student: stu,
                                    course: getLanguageCourseMeta(stu.activeLanguage ?? 'en'),
                                    schoolName: state.schoolName,
                                    teacherName: getTeacherDisplayName(currentUser, state.teacherName),
                                  })
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
                                title="Gerar Boletim Mensal em PDF"
                              >
                                <span>Boletim PDF</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {onLinkStudentToTeacher && onUnlinkStudentFromTeacher && (
            <div className="lg:col-span-12">
              <VipStudentsPanel
                currentUser={currentUser}
                schoolName={state.schoolName}
                users={state.users}
                isMaster={isMaster}
                onLinkStudentToTeacher={onLinkStudentToTeacher}
                onUnlinkStudentFromTeacher={onUnlinkStudentFromTeacher}
                onReassignStudentTeacher={onReassignStudentTeacher}
                onCreateVipAssignment={onCreateAssignment}
              />
            </div>
          )}

          {/* Master Admin: Gestão Global de Usuários & Permissões */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-12">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <h2 className="font-display text-lg font-extrabold text-slate-900">
                    Gestão de Usuários & Permissões ({state.users.length})
                  </h2>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Admin Mestre autorizado: <span className="font-mono font-bold text-slate-700">{MASTER_ADMIN_EMAIL}</span>
                  {isMaster && (
                    <>
                      {' '}· Código de convite docente:{' '}
                      <span className="rounded bg-purple-100 px-1.5 py-0.5 font-mono font-bold text-purple-900">
                        {state.teacherAccessCode?.trim() || DEFAULT_TEACHER_ACCESS_CODE}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Buscar usuário..."
                    className="w-40 rounded-xl border border-slate-200 bg-slate-50 py-1 pr-3 pl-8 text-xs"
                  />
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    currentUser.isMasterAdmin || isMasterAdminEmail(currentUser.email)
                      ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {currentUser.isMasterAdmin || isMasterAdminEmail(currentUser.email)
                    ? 'Modo Admin Mestre Desbloqueado'
                    : 'Modo Professor (Somente leitura para cargos)'}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {state.users
                .filter((u) => {
                  if (!userSearch.trim()) return true;
                  const q = userSearch.toLowerCase();
                  return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                })
                .map((u) => {
                const isTargetMaster = Boolean(
                  u.isMasterAdmin || isMasterAdminEmail(u.email),
                );
                const canManage = Boolean(
                  currentUser.isMasterAdmin || isMasterAdminEmail(currentUser.email),
                );
                return (
                  <div
                    key={u.id}
                    className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 ${
                      isTargetMaster
                        ? 'border-amber-200 bg-amber-50/40'
                        : 'border-slate-200 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="truncate font-display text-sm font-bold text-slate-900">
                            {u.name}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                              isTargetMaster
                                ? 'bg-amber-300 text-amber-950'
                                : u.role === 'teacher'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isTargetMaster
                              ? 'Admin Mestre'
                              : u.role === 'teacher'
                                ? 'Professor'
                                : 'Aluno'}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">
                          {u.email}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-600">
                          {u.xp} XP · {u.completedTopicIds.length} unidades · {getClassName(u.classId)}
                        </p>
                      </div>
                      {canManage && !isTargetMaster && u.id !== currentUser.id && (
                        <button
                          type="button"
                          onClick={() =>
                            setPendingConfirm({
                              title: `Excluir conta de ${u.name}?`,
                              description: `Remove ${u.email} da lista local.`,
                              confirmLabel: 'Excluir usuário',
                              tone: 'danger',
                              action: () => onDeleteUser(u.id),
                            })
                          }
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          aria-label={`Remover usuário ${u.name}`}
                          title="Excluir conta"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {!isTargetMaster && (
                      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/70 pt-2.5">
                        {u.role === 'student' && (
                          <select
                            value={u.classId ?? ''}
                            onChange={(e) =>
                              onMoveUserClass(u.id, e.target.value || undefined)
                            }
                            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700"
                          >
                            <option value="">Sem turma</option>
                            {state.classes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        )}
                        {canManage && (
                          <button
                            type="button"
                            onClick={() => onToggleUserRole(u.id)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            {u.role === 'teacher'
                              ? 'Mudar p/ Aluno'
                              : 'Promover a Professor'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CREATE CUSTOM TOPIC */}
      {tab === 'create' && (
        <TopicCreatorTab
          teacherName={getTeacherDisplayName(currentUser, state.teacherName)}
          customTopics={state.customTopics}
          onAddCustomTopic={onAddCustomTopic}
          onDeleteCustomTopic={onDeleteCustomTopic}
          onPlayTopic={onPlayTopic}
        />
      )}

      {/* TAB 4: CLOUD SYNC (SUPABASE), GEMINI AI & SCHOOL SETTINGS */}
      {tab === 'cloud' && (
        <SchoolSettingsTab
          state={state}
          currentUser={currentUser}
          autoSyncStatus={autoSyncStatus}
          voiceLabels={voiceLabels}
          onUpdateSettings={onUpdateSettings}
          onUpdateCloudConfig={onUpdateCloudConfig}
          onApplyCloudSnapshot={onApplyCloudSnapshot}
          onImportState={onImportState}
          onResetDemo={onResetDemo}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingConfirm)}
        title={pendingConfirm?.title ?? ''}
        description={pendingConfirm?.description ?? ''}
        warningBox={pendingConfirm?.warningBox}
        confirmLabel={pendingConfirm?.confirmLabel ?? 'Confirmar'}
        tone={pendingConfirm?.tone ?? 'warning'}
        onConfirm={() => {
          pendingConfirm?.action();
          setPendingConfirm(null);
        }}
        onCancel={() => setPendingConfirm(null)}
      />
    </div>
  );
}

import { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Crown,
  KeyRound,
  Lock,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Unlock,
  Users,
  Volume2,
} from 'lucide-react';
import {
  DEFAULT_BACKEND_API_URL,
  DEFAULT_TEACHER_ACCESS_CODE,
  getEffectiveSupabaseConfig,
  isMasterAdminEmail,
} from '../config/appConfig';
import type { PlatformState, UserProfile } from '../types/learning';
import {
  AUDIO_RETENTION_DAYS,
  getAudioRetentionSummary,
} from '../utils/audioRetention';
import {
  getSecurityAuditStatus,
  type SecurityAuditStatus,
} from '../utils/relationalSync';
import { getAllVoiceDiagnostics, speakText } from '../utils/speech';
import {
  fetchTelemetryLogs,
  runSyntheticHealthChecks,
  type SyntheticHealthResult,
  type TelemetryErrorLog,
} from '../utils/telemetry';
import { getTeacherDisplayName } from '../utils/teacherDisplay';
import { ConfirmDialog } from './ConfirmDialog';

interface AdminPanelProps {
  state: PlatformState;
  currentUser: UserProfile;
  totalBuiltinTopicsCount: number;
  autoSyncStatus?: {
    state: 'idle' | 'syncing' | 'synced' | 'error';
    message?: string;
    updatedAt?: string;
  };
  onUpdateTeacherAccessCode: (nextCode: string) => void;
  onUpdateTeacherInviteCode: (teacherId: string, nextCode: string) => void;
  onLinkStudentToTeacher: (studentId: string, teacherId: string, mode: 'vip' | 'class') => void;
  onUnlinkStudentFromTeacher: (
    studentId: string,
    initiatedBy: 'teacher' | 'admin' | 'student',
  ) => void;
  onToggleBlockUser: (userId: string, reason?: string) => void;
  onToggleUserRole: (userId: string) => void;
  onMoveUserClass: (userId: string, classId?: string) => void;
  onResetUserLocalPassword: (userId: string, newPassword: string) => void;
  onDeleteUser: (userId: string) => void;
  onGoToTeacherStudio: () => void;
  onRunAudioRetentionCleanup?: () => Promise<string>;
}

export function AdminPanel({
  state,
  currentUser,
  totalBuiltinTopicsCount,
  autoSyncStatus,
  onUpdateTeacherAccessCode,
  onUpdateTeacherInviteCode,
  onLinkStudentToTeacher,
  onUnlinkStudentFromTeacher,
  onToggleBlockUser,
  onToggleUserRole,
  onMoveUserClass,
  onResetUserLocalPassword,
  onDeleteUser,
  onGoToTeacherStudio,
  onRunAudioRetentionCleanup,
}: AdminPanelProps) {
  const isMaster =
    Boolean(currentUser.isMasterAdmin) || isMasterAdminEmail(currentUser.email);

  const activeTeacherCode = (
    state.teacherAccessCode?.trim() || DEFAULT_TEACHER_ACCESS_CODE
  ).toUpperCase();

  const [codeDraft, setCodeDraft] = useState(activeTeacherCode);
  const [codeCopied, setCodeCopied] = useState(false);
  const [rlsCopied, setRlsCopied] = useState(false);
  const [secStatus, setSecStatus] = useState<SecurityAuditStatus | null>(null);
  const [healthChecks, setHealthChecks] = useState<SyntheticHealthResult[]>([]);
  const [runningHealthCheck, setRunningHealthCheck] = useState(false);
  const [workerHealth, setWorkerHealth] = useState<{
    version?: string;
    languagesCount?: number;
    hasAi?: boolean;
    hasGemini?: boolean;
    hasR2?: boolean;
  } | null>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryErrorLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    void getSecurityAuditStatus(state.cloudConfig).then(setSecStatus);
  }, [state.cloudConfig]);

  useEffect(() => {
    const base = DEFAULT_BACKEND_API_URL.trim().replace(/\/+$/, '');
    if (!base || typeof fetch === 'undefined') return;
    fetch(`${base}/api/health`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { version?: string; supportedLanguages?: string[]; hasAiBinding?: boolean; hasGeminiSecret?: boolean; hasR2Bucket?: boolean } | null) => {
        if (data) {
          setWorkerHealth({
            version: data.version,
            languagesCount: data.supportedLanguages?.length ?? 16,
            hasAi: Boolean(data.hasAiBinding),
            hasGemini: Boolean(data.hasGeminiSecret),
            hasR2: Boolean(data.hasR2Bucket),
          });
        }
      })
      .catch(() => undefined);
    void fetchTelemetryLogs().then(setTelemetryLogs);
  }, []);
  const [filter, setFilter] = useState<'all' | 'students' | 'teachers' | 'blocked'>(
    'all',
  );
  const [pwDraftByUser, setPwDraftByUser] = useState<Record<string, string>>({});
  const [inviteDraftByTeacher, setInviteDraftByTeacher] = useState<Record<string, string>>({});
  const [pendingConfirm, setPendingConfirm] = useState<{
    title: string;
    description: string;
    warningBox?: string;
    confirmLabel: string;
    tone: 'danger' | 'warning' | 'primary';
    action: () => void;
  } | null>(null);

  if (!isMaster) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xs">
        <ShieldAlert className="mx-auto h-10 w-10 text-rose-600" />
        <h1 className="mt-3 font-display text-xl font-extrabold text-slate-900">
          Acesso restrito ao Administrador Mestre
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Apenas a conta mestre ({currentUser.email} não autorizado) pode acessar controles administrativos globais.
        </p>
      </div>
    );
  }

  const teachersCount = state.users.filter((u) => u.role === 'teacher').length;
  const studentsCount = state.users.filter((u) => u.role === 'student').length;
  const blockedCount = state.users.filter((u) => Boolean(u.blocked)).length;
  const supaCfg = getEffectiveSupabaseConfig(state.cloudConfig);
  const voiceDiagnostics = getAllVoiceDiagnostics();

  const filteredUsers = state.users.filter((u) => {
    if (filter === 'students' && u.role !== 'student') return false;
    if (filter === 'teachers' && u.role !== 'teacher') return false;
    if (filter === 'blocked' && !u.blocked) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeTeacherCode);
      setCodeCopied(true);
      window.setTimeout(() => setCodeCopied(false), 2200);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
            <Crown className="h-3.5 w-3.5 text-amber-600" />
            Administração Mestre · {currentUser.email}
          </span>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
            Painel Administrativo do Sistema
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Controle completo de acessos, bloqueio/liberação de contas, código docente e saúde da plataforma.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToTeacherStudio}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span>Ir para Modo Professor</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-2xl font-extrabold text-slate-900">
            {state.users.length}
          </p>
          <p className="text-xs font-semibold text-slate-500">Usuários totais</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-2xl font-extrabold text-blue-600">
            {studentsCount}
          </p>
          <p className="text-xs font-semibold text-slate-500">Alunos</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-2xl font-extrabold text-indigo-600">
            {teachersCount}
          </p>
          <p className="text-xs font-semibold text-slate-500">Professores</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-2xl font-extrabold text-rose-600">
            {blockedCount}
          </p>
          <p className="text-xs font-semibold text-slate-500">Bloqueados</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-2xl font-extrabold text-emerald-600">
            {totalBuiltinTopicsCount + state.customTopics.length}
          </p>
          <p className="text-xs font-semibold text-slate-500">Unidades totais</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-2xl font-extrabold text-amber-600">
            {state.submissions.length}
          </p>
          <p className="text-xs font-semibold text-slate-500">Submissões</p>
        </div>
      </div>

      {/* Exclusive Teacher Authorization Code + Cloud/Voice Diagnostics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
              <KeyRound className="h-5 w-5 text-amber-600" />
              <span>Código de Cadastro de Professor</span>
            </h2>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
              Visível só p/ Admin
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Passe este código apenas para professores autorizados criarem conta docente na tela de cadastro. Você pode alterá-lo a qualquer momento.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div>
              <p className="text-[11px] font-bold text-amber-900 uppercase">
                Código Atual Ativo
              </p>
              <p className="mt-0.5 font-mono text-xl font-extrabold tracking-wider text-amber-950">
                {activeTeacherCode}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleCopyCode()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-700 cursor-pointer"
            >
              {codeCopied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar código</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={codeDraft}
              onChange={(e) => setCodeDraft(e.target.value.toUpperCase())}
              placeholder="Ex: SILAS-PROF-2026"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs font-bold uppercase"
            />
            <button
              type="button"
              onClick={() => {
                if (codeDraft.trim().length >= 4) {
                  onUpdateTeacherAccessCode(codeDraft.trim().toUpperCase());
                }
              }}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
            >
              Salvar novo código
            </button>
            <button
              type="button"
              onClick={() => {
                setCodeDraft(DEFAULT_TEACHER_ACCESS_CODE);
                onUpdateTeacherAccessCode(DEFAULT_TEACHER_ACCESS_CODE);
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Padrão</span>
            </button>
          </div>
        </section>

        <section
          data-testid="admin-voice-health-panel"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
              <Volume2 className="h-5 w-5 text-blue-600" />
              <span>Saúde dos Serviços & Vozes Neurais</span>
            </h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
              {voiceDiagnostics.length}/16 idiomas ativos
            </span>
          </div>
          <div className="mt-3 space-y-2.5 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <span className="font-semibold text-slate-700">Supabase Cloud</span>
              <span className="font-mono font-bold text-emerald-700">
                {supaCfg.url ? `Conectado (${autoSyncStatus?.state ?? 'pronto'})` : 'Offline'}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <span className="font-semibold text-slate-700">Worker Edge API</span>
              <span className="truncate font-mono text-[11px] font-bold text-blue-700">
                {DEFAULT_BACKEND_API_URL}
                {workerHealth?.version ? ` · v${workerHealth.version}` : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 pt-1">
              {voiceDiagnostics.map((item) => (
                <div
                  key={item.code}
                  data-testid={`voice-health-${item.code}`}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-bold text-slate-800">
                        <span className="mr-1 rounded bg-slate-200 px-1 py-0.5 font-mono text-[10px] text-slate-800">
                          {item.symbol}
                        </span>
                        {item.namePt}
                      </p>
                      <span className="font-mono text-[10px] text-slate-500">
                        {item.dialectsLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] leading-snug text-slate-600">
                      {item.providerLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      speakText(item.sampleText, { langCode: item.primaryDialect })
                    }
                    className="mt-2 inline-flex items-center justify-center gap-1 rounded-lg border border-blue-200 bg-white px-2 py-1 text-[10px] font-bold text-blue-700 hover:bg-blue-50 cursor-pointer"
                  >
                    <Volume2 className="h-3 w-3" />
                    <span>Testar voz</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* User Access & Role Control */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Controle de Usuários, Acessos e Bloqueios</span>
            </h2>
            <p className="text-xs text-slate-500">
              Bloqueie/libere contas instantaneamente, troque turmas, promova professores ou redefina senhas locais.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'all', label: 'Todos' },
                { id: 'students', label: 'Alunos' },
                { id: 'teachers', label: 'Professores' },
                { id: 'blocked', label: 'Bloqueados' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFilter(opt.id)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  filter === opt.id
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuário por nome ou e-mail..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pr-4 pl-10 text-xs"
          />
        </div>

        <div className="mt-4 space-y-3">
          {filteredUsers.map((u) => {
            const isSelfMaster =
              Boolean(u.isMasterAdmin) || isMasterAdminEmail(u.email);
            return (
              <div
                key={u.id}
                className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 lg:flex-row lg:items-center ${
                  u.blocked
                    ? 'border-rose-300 bg-rose-50/50'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                    style={{ backgroundColor: u.avatarColor }}
                  >
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-display text-sm font-bold text-slate-900">
                        {u.name}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          u.role === 'teacher'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isSelfMaster
                          ? 'Admin Mestre'
                          : u.role === 'teacher'
                            ? 'Professor'
                            : 'Aluno'}
                      </span>
                      {u.blocked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                          <Lock className="h-2.5 w-2.5" />
                          Acesso Bloqueado
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-slate-500">
                      {u.email} · {u.xp} XP · {u.completedTopicIds.length} unidades
                    </p>
                  </div>
                </div>

                {!isSelfMaster ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {u.role === 'student' && (
                      <select
                        value={u.assignedTeacherId ?? ''}
                        onChange={(e) => {
                          const nextTeacherId = e.target.value;
                          const nextTeacherObj = state.users.find(
                            (t) => t.id === nextTeacherId,
                          );
                          const nextTeacherName = nextTeacherObj
                            ? getTeacherDisplayName(nextTeacherObj, state.teacherName)
                            : undefined;
                          setPendingConfirm({
                            tone: nextTeacherId ? 'primary' : 'warning',
                            title: nextTeacherId
                              ? `Vincular ${u.name} a ${nextTeacherName ?? 'professor'}?`
                              : `Remover professor de ${u.name}?`,
                            description: nextTeacherId
                              ? `O aluno passará a ser acompanhado por ${nextTeacherName ?? 'este professor'} (modo VIP).`
                              : 'O aluno ficará sem professor vinculado e receberá aviso no próximo login.',
                            warningBox: nextTeacherId
                              ? undefined
                              : 'Sem professor vinculado, atividades com validação docente (Speaking/Writing para professor e tarefas VIP) ficarão restritas até nova vinculação.',
                            confirmLabel: nextTeacherId
                              ? 'Confirmar vinculação'
                              : 'Confirmar desvinculação',
                            action: () => {
                              if (nextTeacherId) {
                                onLinkStudentToTeacher(u.id, nextTeacherId, 'vip');
                              } else {
                                onUnlinkStudentFromTeacher(u.id, 'admin');
                              }
                            },
                          });
                        }}
                        className="rounded-xl border border-indigo-200 bg-indigo-50/70 px-2.5 py-1.5 text-xs font-semibold text-indigo-900"
                        aria-label={`Professor responsável de ${u.name}`}
                      >
                        <option value="">Sem professor (VIP)</option>
                        {state.users
                          .filter((t) => t.role === 'teacher')
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              Prof. {getTeacherDisplayName(t, state.teacherName)}
                            </option>
                          ))}
                      </select>
                    )}

                    {u.role === 'teacher' && (
                      <div className="flex items-center gap-1 rounded-xl border border-purple-200 bg-purple-50/70 px-2 py-1">
                        <span className="text-[10px] font-bold text-purple-800">VIP:</span>
                        <input
                          type="text"
                          value={inviteDraftByTeacher[u.id] ?? u.teacherInviteCode ?? ''}
                          onChange={(e) =>
                            setInviteDraftByTeacher((prev) => ({
                              ...prev,
                              [u.id]: e.target.value.toUpperCase(),
                            }))
                          }
                          className="w-24 rounded-lg border border-purple-200 bg-white px-1.5 py-0.5 font-mono text-[11px] uppercase"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const nextCode = (
                              inviteDraftByTeacher[u.id] ??
                              u.teacherInviteCode ??
                              ''
                            ).trim();
                            if (nextCode) onUpdateTeacherInviteCode(u.id, nextCode);
                          }}
                          className="rounded-lg bg-purple-700 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-purple-800 cursor-pointer"
                        >
                          OK
                        </button>
                      </div>
                    )}

                    <select
                      value={u.classId ?? ''}
                      onChange={(e) =>
                        onMoveUserClass(u.id, e.target.value || undefined)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                      aria-label={`Turma de ${u.name}`}
                    >
                      <option value="">Sem turma</option>
                      {state.classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        setPendingConfirm({
                          tone: 'warning',
                          title: `Alterar papel de ${u.name}?`,
                          description:
                            u.role === 'teacher'
                              ? 'O usuário passará a ter perfil de Aluno.'
                              : 'O usuário passará a ter acesso ao Estúdio do Professor.',
                          confirmLabel: 'Confirmar alteração',
                          action: () => onToggleUserRole(u.id),
                        })
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      {u.role === 'teacher' ? 'Tornar Aluno' : 'Promover Professor'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPendingConfirm({
                          tone: u.blocked ? 'primary' : 'danger',
                          title: u.blocked
                            ? `Liberar acesso de ${u.name}?`
                            : `Bloquear acesso de ${u.name}?`,
                          description: u.blocked
                            ? 'O usuário poderá fazer login normalmente novamente.'
                            : 'O usuário será impedido de entrar na plataforma até ser liberado.',
                          confirmLabel: u.blocked ? 'Sim, liberar' : 'Sim, bloquear',
                          action: () =>
                            onToggleBlockUser(
                              u.id,
                              u.blocked ? undefined : 'Suspenso pelo administrador',
                            ),
                        })
                      }
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
                        u.blocked
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      {u.blocked ? (
                        <>
                          <Unlock className="h-3.5 w-3.5" />
                          <span>Liberar</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" />
                          <span>Bloquear</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <input
                        type="password"
                        value={pwDraftByUser[u.id] ?? ''}
                        onChange={(e) =>
                          setPwDraftByUser((prev) => ({
                            ...prev,
                            [u.id]: e.target.value,
                          }))
                        }
                        placeholder="Nova senha"
                        className="w-24 rounded-xl border border-slate-200 px-2 py-1.5 text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const nextPw = (pwDraftByUser[u.id] ?? '').trim();
                          if (nextPw.length >= 6) {
                            onResetUserLocalPassword(u.id, nextPw);
                            setPwDraftByUser((prev) => ({ ...prev, [u.id]: '' }));
                          }
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        Redefinir
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setPendingConfirm({
                          title: `Excluir conta de ${u.name}?`,
                          description: `Esta ação removerá permanentemente o usuário ${u.email} da lista local.`,
                          warningBox:
                            'A exclusão não pode ser desfeita localmente. Caso o usuário esteja vinculado a uma turma ou professor, o vínculo será removido.',
                          confirmLabel: 'Excluir usuário',
                          tone: 'danger',
                          action: () => onDeleteUser(u.id),
                        })
                      }
                      className="rounded-xl border border-rose-200 bg-white p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Excluir usuário"
                      aria-label={`Excluir ${u.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    Conta protegida (Admin Mestre)
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Retenção Automática de Áudios (60 dias) */}
      {(() => {
        const audioStats = getAudioRetentionSummary(state.submissions);
        return (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
                  <Volume2 className="h-4.5 w-4.5 text-blue-600" />
                  <span>Retenção Automática de Áudios ({AUDIO_RETENTION_DAYS} dias)</span>
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Áudios de Speaking ficam no bucket <code className="font-mono">fb-audio</code> (Supabase Storage) e no{' '}
                  <code className="font-mono">IndexedDB</code> local. Após {AUDIO_RETENTION_DAYS} dias, apenas os arquivos de áudio são removidos automaticamente —{' '}
                  <strong>transcrições, notas, rubricas e feedbacks escritos permanecem 100% preservados</strong>.
                </p>
              </div>
              {onRunAudioRetentionCleanup && (
                <button
                  type="button"
                  onClick={() =>
                    setPendingConfirm({
                      title: `Executar limpeza de áudios (> ${AUDIO_RETENTION_DAYS} dias)?`,
                      description: `Remove ${audioStats.expiredPendingCount} áudio(s) expirado(s) do Supabase Storage e IndexedDB local.`,
                      warningBox:
                        'Feedbacks escritos, transcrições, notas e selos dos professores NÃO serão removidos.',
                      confirmLabel: 'Limpar áudios expirados',
                      tone: 'warning',
                      action: () => {
                        void onRunAudioRetentionCleanup();
                      },
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Executar limpeza agora</span>
                </button>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-mono text-lg font-extrabold text-slate-900">
                  {audioStats.activeAudioCount}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">
                  Áudios ativos
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                <p className="font-mono text-lg font-extrabold text-amber-700">
                  {audioStats.expiringWithin7Days}
                </p>
                <p className="text-[11px] font-semibold text-amber-800">
                  Expiram em ≤ 7 dias
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3">
                <p className="font-mono text-lg font-extrabold text-rose-700">
                  {audioStats.expiredPendingCount}
                </p>
                <p className="text-[11px] font-semibold text-rose-800">
                  Expirados (prontos)
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                <p className="font-mono text-lg font-extrabold text-emerald-700">
                  {audioStats.archivedCount}
                </p>
                <p className="text-[11px] font-semibold text-emerald-800">
                  Arquivados (feedback ok)
                </p>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Segurança & Migração Definitiva RLS (v4.0) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
              <span>Segurança &amp; Migração Definitiva RLS (v4.0)</span>
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Armazenamento esparso de vocabulário ativo (economia ~95% no JSONB/localStorage) + sincronização relacional autenticada com políticas RLS por aluno/professor/admin (<code className="font-mono">supabase_schema.sql</code> Seção 9).
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const sqlSnippet = `-- Cole no SQL Editor do Supabase (Seção 9 do supabase_schema.sql)\nalter table public.student_progress add column if not exists recommended_level_by_language jsonb not null default '{}'::jsonb;\nalter table public.student_progress add column if not exists topic_step_progress jsonb not null default '{}'::jsonb;\nalter table public.student_progress add column if not exists learned_vocab_ids text[] not null default '{}';\nalter table public.student_progress add column if not exists mistake_bank jsonb not null default '[]'::jsonb;`;
              void navigator.clipboard?.writeText(sqlSnippet);
              setRlsCopied(true);
              window.setTimeout(() => setRlsCopied(false), 2500);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 cursor-pointer"
          >
            {rlsCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{rlsCopied ? 'SQL RLS copiado!' : 'Copiar SQL Migração v4.0'}</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <p className="font-bold text-slate-800">Sessão Supabase Auth (JWT)</p>
            <p className="mt-0.5 text-slate-600">
              {secStatus?.authenticated
                ? `Autenticado (${secStatus.userEmail})`
                : 'Modo local/demo (sem JWT ativo)'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <p className="font-bold text-slate-800">Sync Relacional Estrito</p>
            <p className="mt-0.5 text-slate-600">
              {secStatus?.relationalReady
                ? 'Ativo (profiles, student_progress, submissions, certificates)'
                : 'Pronto (aguardando login Supabase Auth)'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <p className="font-bold text-slate-800">Compactação Esparsa</p>
            <p className="mt-0.5 text-emerald-700 font-semibold">
              Ativa (~95% menor no Supabase)
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <p className="font-bold text-slate-800">Cache Persistente Cloudflare R2</p>
            <p className="mt-0.5 font-semibold text-emerald-700">
              {workerHealth?.hasR2 ? 'Ativo (fluentbridge-media)' : 'Verificando...'}
            </p>
          </div>
        </div>
      </section>

      {/* Observabilidade & Erros em Produção */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
              <ShieldAlert className="h-4.5 w-4.5 text-amber-600" />
              <span>Observabilidade &amp; Erros em Produção</span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Últimos eventos capturados automaticamente pelo Worker Edge (<code className="font-mono">/api/telemetry</code>).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="admin-run-healthcheck-btn"
              disabled={runningHealthCheck}
              onClick={() => {
                setRunningHealthCheck(true);
                void runSyntheticHealthChecks()
                  .then(setHealthChecks)
                  .finally(() => setRunningHealthCheck(false));
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-800 hover:bg-indigo-100 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {runningHealthCheck ? 'Testando...' : 'Executar Health Check Ao Vivo'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => void fetchTelemetryLogs().then(setTelemetryLogs)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Atualizar</span>
            </button>
          </div>
        </div>
        {healthChecks.length > 0 && (
          <div
            data-testid="admin-healthcheck-results"
            className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {healthChecks.map((hc) => (
              <div
                key={hc.name}
                className={`rounded-xl border p-3 text-xs ${
                  hc.ok
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                    : 'border-rose-200 bg-rose-50/70 text-rose-950'
                }`}
              >
                <p className="font-bold">{hc.name}</p>
                <p className="mt-0.5 font-mono text-[11px]">
                  HTTP {hc.status} · {hc.latencyMs}ms · {hc.detail}
                </p>
              </div>
            ))}
          </div>
        )}
        {telemetryLogs.length === 0 ? (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-xs font-semibold text-emerald-800">
            Nenhum erro de cliente registrado recentemente.
          </p>
        ) : (
          <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
            {telemetryLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[11px]"
              >
                <div className="flex flex-wrap items-center justify-between gap-1 font-bold text-slate-800">
                  <span>{log.message}</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {log.platform} · v{log.version} · {log.timestamp.slice(0, 16).replace('T', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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

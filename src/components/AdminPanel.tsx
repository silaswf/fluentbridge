/**
 * @file src/components/AdminPanel.tsx
 * @description Painel Admin Mestre: controle de usuários, bloqueios, código docente, diagnóstico de 17 vozes neurais, cotas R2 em tempo real, CSV, retenção de áudio e telemetria.
 * @exports AdminPanel
 */
import { useEffect, useState } from 'react';
import {
  Activity,
  Check,
  Copy,
  CreditCard,
  Crown,
  Download,
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
import type {
  BillingConfig,
  ClassGroup,
  PlatformState,
  SchoolTenant,
  SubscriptionPlanId,
  UserProfile,
} from '../types/learning';
import {
  DEFAULT_SCHOOL_ID,
  getEffectiveSchool,
  getSchoolClasses,
  getSchoolTeachers,
  resolveUserSchoolId,
} from '../utils/tenantEngine';
import {
  DEFAULT_BILLING_CONFIG,
  fetchBillingPlansStatus,
  SUBSCRIPTION_PLANS,
  type BillingPlansApiResponse,
} from '../utils/subscriptionEngine';
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
  fetchAdminQuotas,
  fetchTelemetryLogs,
  runSyntheticHealthChecks,
  type AdminQuotaSnapshot,
  type SyntheticHealthResult,
  type TelemetryErrorLog,
} from '../utils/telemetry';
import { getTeacherDisplayName } from '../utils/teacherDisplay';
import { ConfirmDialog } from './ConfirmDialog';

interface AdminPanelProps {
  state: PlatformState;
  allUsersCount?: number;
  schools?: SchoolTenant[];
  classesAll?: ClassGroup[];
  usersAll?: UserProfile[];
  adminSchoolFilter?: string;
  onChangeAdminSchoolFilter?: (schoolId: string) => void;
  onCreateSchool?: (payload: {
    name: string;
    inviteCode?: string;
    ownerEmail?: string;
    primaryColor?: string;
  }) => void;
  onToggleSchoolStatus?: (schoolId: string) => void;
  onAllocateUserSchool?: (userId: string, targetSchoolId: string) => void;
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
  onUpdateBillingConfig?: (cfg: BillingConfig) => void;
  onUpdateUserSubscription?: (userId: string, planId: SubscriptionPlanId) => void;
}

export function AdminPanel({
  state,
  schools = [],
  classesAll,
  usersAll,
  adminSchoolFilter = 'ALL',
  onChangeAdminSchoolFilter,
  onCreateSchool,
  onToggleSchoolStatus,
  onAllocateUserSchool,
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
  onUpdateBillingConfig,
  onUpdateUserSubscription,
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
    accentCount?: number;
    hasAi?: boolean;
    hasGemini?: boolean;
    hasR2?: boolean;
  } | null>(null);
  const [quotasSnapshot, setQuotasSnapshot] = useState<AdminQuotaSnapshot | null>(null);
  const [loadingQuotas, setLoadingQuotas] = useState(false);
  const [billingStatus, setBillingStatus] = useState<BillingPlansApiResponse | null>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryErrorLog[]>([]);
  const [search, setSearch] = useState('');
  const [pwFeedback, setPwFeedback] = useState<string | null>(null);

  useEffect(() => {
    void getSecurityAuditStatus(state.cloudConfig).then(setSecStatus);
  }, [state.cloudConfig]);

  useEffect(() => {
    const base = DEFAULT_BACKEND_API_URL.trim().replace(/\/+$/, '');
    if (!base || typeof fetch === 'undefined') return;
    fetch(`${base}/api/health`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { version?: string; accentCount?: number; supportedLanguages?: string[]; hasAiBinding?: boolean; hasGeminiSecret?: boolean; hasR2Bucket?: boolean } | null) => {
        if (data) {
          setWorkerHealth({
            version: data.version,
            languagesCount: data.supportedLanguages?.length ?? 17,
            accentCount: data.accentCount ?? 65,
            hasAi: Boolean(data.hasAiBinding),
            hasGemini: Boolean(data.hasGeminiSecret),
            hasR2: Boolean(data.hasR2Bucket),
          });
        }
      })
      .catch(() => undefined);
    void fetchTelemetryLogs().then(setTelemetryLogs);
    void fetchAdminQuotas(7).then(setQuotasSnapshot);
    void fetchBillingPlansStatus().then(setBillingStatus);
  }, []);
  const [filter, setFilter] = useState<'all' | 'students' | 'teachers' | 'unlinked' | 'blocked'>(
    'all',
  );
  const [pwDraftByUser, setPwDraftByUser] = useState<Record<string, string>>({});
  const [inviteDraftByTeacher, setInviteDraftByTeacher] = useState<Record<string, string>>({});
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolOwnerEmail, setNewSchoolOwnerEmail] = useState('');
  const [copiedSchoolId, setCopiedSchoolId] = useState<string | null>(null);
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
  const unlinkedCount = state.users.filter(
    (u) => u.role === 'student' && !u.assignedTeacherId && !u.classId,
  ).length;
  const blockedCount = state.users.filter((u) => Boolean(u.blocked)).length;
  const supaCfg = getEffectiveSupabaseConfig(state.cloudConfig);
  const voiceDiagnostics = getAllVoiceDiagnostics();

  const filteredUsers = state.users.filter((u) => {
    if (filter === 'students' && u.role !== 'student') return false;
    if (filter === 'teachers' && u.role !== 'teacher') return false;
    if (filter === 'unlinked' && !(u.role === 'student' && !u.assignedTeacherId && !u.classId)) {
      return false;
    }
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

      {/* Escolas & Multi-Tenancy (Isolamento por Tenant) */}
      <section
        data-testid="admin-schools-panel"
        className="rounded-3xl border border-blue-200 bg-white p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <span>Escolas &amp; Multi-Tenancy (Isolamento por Tenant)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Cada escola possui dados 100% isolados (usuários, turmas, professores, comunidade e RLS Supabase). Filtre ou aloque alunos e professores em 1 clique.
            </p>
          </div>
          {onChangeAdminSchoolFilter && (
            <select
              value={adminSchoolFilter}
              onChange={(e) => onChangeAdminSchoolFilter(e.target.value)}
              aria-label="Filtrar painel por escola"
              className="rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-2 text-xs font-bold text-blue-950"
            >
              <option value="ALL">Todas as escolas ({schools.length})</option>
              {schools.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name} ({sc.status === 'active' ? 'Ativa' : 'Suspensa'})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((sc) => {
            const allUsers = usersAll ?? state.users;
            const allClasses = classesAll ?? state.classes;
            const scStudents = allUsers.filter(
              (u) => u.role === 'student' && resolveUserSchoolId(u) === sc.id,
            ).length;
            const scTeachers = allUsers.filter(
              (u) => u.role === 'teacher' && resolveUserSchoolId(u) === sc.id,
            ).length;
            const scClasses = allClasses.filter(
              (c) => (c.schoolId || DEFAULT_SCHOOL_ID) === sc.id,
            ).length;
            const isMain = sc.id === DEFAULT_SCHOOL_ID;
            return (
              <div
                key={sc.id}
                className={`rounded-2xl border p-4 text-xs ${
                  sc.status === 'suspended'
                    ? 'border-rose-200 bg-rose-50/60'
                    : 'border-slate-200 bg-slate-50/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-sm font-bold text-slate-900">
                      {sc.name}
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      ?escola={sc.slug} · {sc.inviteCode}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      sc.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {sc.status === 'active' ? 'Ativa' : 'Suspensa'}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[11px] text-slate-600">
                  {scStudents} aluno(s) · {scTeachers} prof(s) · {scClasses} turma(s)
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const portalUrl =
                        typeof window !== 'undefined'
                          ? `${window.location.origin}/?escola=${sc.slug}`
                          : `/?escola=${sc.slug}`;
                      void navigator.clipboard?.writeText(portalUrl);
                      setCopiedSchoolId(sc.id);
                      window.setTimeout(() => setCopiedSchoolId(null), 2000);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    {copiedSchoolId === sc.id ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copiedSchoolId === sc.id ? 'Link copiado' : 'Copiar link'}</span>
                  </button>
                  {!isMain && onToggleSchoolStatus && (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingConfirm({
                          tone: sc.status === 'active' ? 'danger' : 'primary',
                          title:
                            sc.status === 'active'
                              ? `Suspender escola "${sc.name}"?`
                              : `Reativar escola "${sc.name}"?`,
                          description:
                            sc.status === 'active'
                              ? 'Alunos e professores desta escola não conseguirão fazer login até a reativação.'
                              : 'Todos os alunos e professores da escola poderão acessar normalmente.',
                          confirmLabel:
                            sc.status === 'active' ? 'Suspender escola' : 'Reativar escola',
                          action: () => onToggleSchoolStatus(sc.id),
                        })
                      }
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                        sc.status === 'active'
                          ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {sc.status === 'active' ? 'Suspender' : 'Reativar'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {onCreateSchool && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newSchoolName.trim()) return;
              onCreateSchool({
                name: newSchoolName.trim(),
                ownerEmail: newSchoolOwnerEmail.trim() || undefined,
              });
              setNewSchoolName('');
              setNewSchoolOwnerEmail('');
            }}
            className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 sm:flex-row sm:items-center"
          >
            <input
              type="text"
              required
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              placeholder="Nome da nova escola (ex: Idiomas Alpha)..."
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
            />
            <input
              type="email"
              value={newSchoolOwnerEmail}
              onChange={(e) => setNewSchoolOwnerEmail(e.target.value)}
              placeholder="E-mail do coordenador (opcional)"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              + Nova Escola
            </button>
          </form>
        )}
      </section>

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
              {voiceDiagnostics.length}/17 idiomas ativos
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
                {workerHealth?.accentCount ? ` · ${workerHealth.accentCount} sotaques` : ''}
              </span>
            </div>
            {workerHealth && (
              <div className="flex flex-wrap gap-1.5">
                <span className={`rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold ${workerHealth.hasAi ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-700'}`}>
                  Workers AI: {workerHealth.hasAi ? 'OK' : 'OFF'}
                </span>
                <span className={`rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold ${workerHealth.hasGemini ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-700'}`}>
                  Gemini Key: {workerHealth.hasGemini ? 'OK' : 'OFF'}
                </span>
                <span className={`rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold ${workerHealth.hasR2 ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-700'}`}>
                  R2 Bucket: {workerHealth.hasR2 ? 'OK' : 'OFF'}
                </span>
              </div>
            )}
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

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: `Todos (${state.users.length})` },
                { id: 'students', label: `Alunos (${studentsCount})` },
                { id: 'teachers', label: `Professores (${teachersCount})` },
                { id: 'unlinked', label: `Sem Professor (${unlinkedCount})` },
                { id: 'blocked', label: `Bloqueados (${blockedCount})` },
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
            <button
              type="button"
              onClick={() => {
                const header = 'Nome,Email,Papel,XP,Unidades,Turma,Bloqueado';
                const rows = filteredUsers.map((u) => {
                  const clsName = state.classes.find((c) => c.id === u.classId)?.name ?? '';
                  return [u.name, u.email, u.role, u.xp, u.completedTopicIds.length, clsName, u.blocked ? 'Sim' : 'Nao']
                    .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                    .join(',');
                });
                const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `fluentbridge-usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
            >
              <Download className="h-3 w-3" />
              <span>Exportar CSV</span>
            </button>
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
                      {u.email} · {u.xp} XP · {u.completedTopicIds.length} unidades ·{' '}
                      <strong className="text-slate-700">
                        {getEffectiveSchool(schools, resolveUserSchoolId(u), state.schoolName).name}
                      </strong>
                    </p>
                  </div>
                </div>

                {!isSelfMaster ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {onAllocateUserSchool && schools.length > 0 && (
                      <select
                        value={resolveUserSchoolId(u)}
                        onChange={(e) => {
                          const targetSchoolId = e.target.value;
                          if (targetSchoolId === resolveUserSchoolId(u)) return;
                          const targetSchoolName = getEffectiveSchool(
                            schools,
                            targetSchoolId,
                            state.schoolName,
                          ).name;
                          setPendingConfirm({
                            tone: 'warning',
                            title: `Mover ${u.name} para "${targetSchoolName}"?`,
                            description:
                              'O usuário passará a enxergar apenas dados desta escola. Vínculos anteriores com professor ou turma de outra escola serão removidos automaticamente.',
                            confirmLabel: 'Confirmar alocação',
                            action: () => onAllocateUserSchool(u.id, targetSchoolId),
                          });
                        }}
                        className="rounded-xl border border-blue-200 bg-blue-50/70 px-2.5 py-1.5 text-xs font-semibold text-blue-950"
                        aria-label={`Escola de ${u.name}`}
                      >
                        {schools.map((sc) => (
                          <option key={sc.id} value={sc.id}>
                            Escola: {sc.name}
                          </option>
                        ))}
                      </select>
                    )}

                    {u.role === 'student' && (
                      <select
                        value={u.assignedTeacherId ?? ''}
                        onChange={(e) => {
                          const nextTeacherId = e.target.value;
                          const allUsers = usersAll ?? state.users;
                          const nextTeacherObj = allUsers.find(
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
                        {getSchoolTeachers(usersAll ?? state.users, resolveUserSchoolId(u)).map((t) => (
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
                      {getSchoolClasses(classesAll ?? state.classes, resolveUserSchoolId(u)).map((c) => (
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

                    {onUpdateUserSubscription && (
                      <select
                        value={u.subscription?.planId ?? (u.assignedTeacherId || u.classId ? 'school_grant' : 'free')}
                        onChange={(e) =>
                          onUpdateUserSubscription(u.id, e.target.value as SubscriptionPlanId)
                        }
                        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                        aria-label={`Plano de ${u.name}`}
                      >
                        {SUBSCRIPTION_PLANS.map((p) => (
                          <option key={p.id} value={p.id}>
                            Plano: {p.badgePt}
                          </option>
                        ))}
                      </select>
                    )}

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
                          if (nextPw.length < 6) {
                            setPwFeedback(`A nova senha de ${u.name} deve ter no mínimo 6 caracteres.`);
                            return;
                          }
                          onResetUserLocalPassword(u.id, nextPw);
                          setPwDraftByUser((prev) => ({ ...prev, [u.id]: '' }));
                          setPwFeedback(`Senha local de ${u.name} redefinida com sucesso.`);
                          window.setTimeout(() => setPwFeedback(null), 3500);
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
        {pwFeedback && (
          <p className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-900">
            {pwFeedback}
          </p>
        )}
      </section>

      {/* Consumo Diário de Cotas IA (Cloudflare R2) */}
      <section
        data-testid="admin-quotas-panel"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
              <Activity className="h-4.5 w-4.5 text-indigo-600" />
              <span>Consumo Diário de Cotas IA (Cloudflare R2)</span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Monitoramento em tempo real das cotas persistentes no R2 ({quotasSnapshot?.date ?? 'hoje'}) e acumulado de {quotasSnapshot?.days ?? 7} dias.
            </p>
          </div>
          <button
            type="button"
            disabled={loadingQuotas}
            onClick={() => {
              setLoadingQuotas(true);
              void fetchAdminQuotas(7)
                .then(setQuotasSnapshot)
                .finally(() => setLoadingQuotas(false));
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingQuotas ? 'animate-spin' : ''}`} />
            <span>Atualizar cotas</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            quotasSnapshot?.routes ?? [
              { key: 'stt', label: 'Transcrição Whisper STT', endpoint: '/api/stt', usedToday: 0, limitPerActor: 200, activeActorsToday: 0, sevenDayTotal: 0 },
              { key: 'gemini', label: 'Tutor IA & Corretor', endpoint: '/api/gemini-tutor', usedToday: 0, limitPerActor: 250, activeActorsToday: 0, sevenDayTotal: 0 },
              { key: 'translate', label: 'Tradutor Bidirecional', endpoint: '/api/translate', usedToday: 0, limitPerActor: 300, activeActorsToday: 0, sevenDayTotal: 0 },
              { key: 'youtube', label: 'YouTube Study Lab', endpoint: '/api/youtube-study', usedToday: 0, limitPerActor: 100, activeActorsToday: 0, sevenDayTotal: 0 },
            ]
          ).map((r) => {
            const pct = Math.min(100, Math.round((r.usedToday / Math.max(1, r.limitPerActor)) * 100));
            const barColor =
              pct >= 85 ? 'bg-rose-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500';
            return (
              <div
                key={r.key}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900">{r.label}</span>
                  <span className="font-mono text-[10px] text-slate-500">{r.endpoint}</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between font-mono">
                  <span className="text-base font-extrabold text-slate-900">
                    {r.usedToday}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    / {r.limitPerActor} por usuário/dia
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-[10px] text-slate-500">
                  {r.activeActorsToday} ativo(s) hoje · {r.sevenDayTotal} reqs em {quotasSnapshot?.days ?? 7}d
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Motor de Planos & Assinaturas (Pronto para ativação futura) */}
      {(() => {
        const billingCfg = state.billingConfig ?? DEFAULT_BILLING_CONFIG;
        const isBillingOn = Boolean(billingCfg.billingEnabled);
        return (
          <section
            data-testid="admin-billing-panel"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
                    <CreditCard className="h-4.5 w-4.5 text-emerald-600" />
                    <span>Motor de Planos &amp; Assinaturas</span>
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      isBillingOn
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isBillingOn
                      ? 'Cobrança Ativa'
                      : '100% Gratuito (Cobrança Desativada)'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  Estrutura pronta (Stripe / Mercado Pago + tabelas Supabase + rotas <code className="font-mono">/api/billing/*</code>). Enquanto estiver desativada, <strong>nenhum aluno vê paywall</strong> e todos têm acesso irrestrito. Alunos vinculados a professores mantêm <code className="font-mono">school_grant</code> gratuito.
                </p>
              </div>
              {onUpdateBillingConfig && (
                <button
                  type="button"
                  onClick={() =>
                    setPendingConfirm({
                      tone: isBillingOn ? 'primary' : 'warning',
                      title: isBillingOn
                        ? 'Voltar para modo 100% gratuito?'
                        : 'Ativar motor de cobrança?',
                      description: isBillingOn
                        ? 'Todos os usuários voltarão imediatamente para acesso gratuito irrestrito.'
                        : 'Exigirá chaves STRIPE_SECRET_KEY ou MERCADOPAGO_ACCESS_TOKEN no Worker para checkout real. Alunos da escola/VIP continuam gratuitos.',
                      confirmLabel: isBillingOn ? 'Ativar modo gratuito' : 'Confirmar ativação',
                      action: () =>
                        onUpdateBillingConfig({
                          ...billingCfg,
                          billingEnabled: !isBillingOn,
                          updatedAt: new Date().toISOString(),
                        }),
                    })
                  }
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer ${
                    isBillingOn
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isBillingOn ? 'Voltar p/ 100% Gratuito' : 'Ativar cobrança (futuro)'}
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-700">
                Worker Mode: {billingStatus?.mode ?? 'free'}
              </span>
              <span className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold ${billingStatus?.providers.stripe ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                Stripe Secret: {billingStatus?.providers.stripe ? 'Configurado' : 'Pendente'}
              </span>
              <span className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold ${billingStatus?.providers.mercadopago ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                Mercado Pago: {billingStatus?.providers.mercadopago ? 'Configurado' : 'Pendente'}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900">{plan.badgePt}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {plan.referencePricePt}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-slate-600">
                    {plan.summaryPt}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

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
              <span>Segurança &amp; Migração SQL Supabase (v9.2+)</span>
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Armazenamento esparso + sincronização relacional autenticada com políticas RLS para os 17 idiomas, bucket <code className="font-mono">fb-audio</code> e RPC LGPD (<code className="font-mono">supabase_schema.sql</code> Seção 11).
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const sqlSnippet = `-- Cole no SQL Editor do Supabase (Seção 11 do supabase_schema.sql - v9.2+)\nalter table public.profiles drop constraint if exists profiles_active_language_check;\nalter table public.profiles add constraint profiles_active_language_check check (active_language in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv','tr','he','nb','da','pt'));\nalter table public.assignments drop constraint if exists assignments_language_code_check;\nalter table public.assignments add constraint assignments_language_code_check check (language_code in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv','tr','he','nb','da','pt'));\nalter table public.exam_attempts drop constraint if exists exam_attempts_language_code_check;\nalter table public.exam_attempts add constraint exam_attempts_language_code_check check (language_code in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv','tr','he','nb','da','pt'));\nalter table public.community_posts drop constraint if exists community_posts_language_code_check;\nalter table public.community_posts add constraint community_posts_language_code_check check (language_code in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv','tr','he','nb','da','pt'));\nalter table public.live_sessions drop constraint if exists live_sessions_language_code_check;\nalter table public.live_sessions add constraint live_sessions_language_code_check check (language_code in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv','tr','he','nb','da','pt'));\nalter table public.vocab_progress drop constraint if exists vocab_progress_language_code_check;\nalter table public.vocab_progress add constraint vocab_progress_language_code_check check (language_code in ('en','es','fr','it','de','ru','ja','zh','ar','nl','af','sv','tr','he','nb','da','pt'));`;
              void navigator.clipboard?.writeText(sqlSnippet);
              setRlsCopied(true);
              window.setTimeout(() => setRlsCopied(false), 2500);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 cursor-pointer"
          >
            {rlsCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{rlsCopied ? 'SQL v9.2+ copiado!' : 'Copiar SQL Migração v9.2+'}</span>
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

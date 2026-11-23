import { useState } from 'react';
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
import { getAllVoiceProviderLabels } from '../utils/speech';

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
  onToggleBlockUser: (userId: string, reason?: string) => void;
  onToggleUserRole: (userId: string) => void;
  onMoveUserClass: (userId: string, classId?: string) => void;
  onResetUserLocalPassword: (userId: string, newPassword: string) => void;
  onDeleteUser: (userId: string) => void;
  onGoToTeacherStudio: () => void;
}

export function AdminPanel({
  state,
  currentUser,
  totalBuiltinTopicsCount,
  autoSyncStatus,
  onUpdateTeacherAccessCode,
  onToggleBlockUser,
  onToggleUserRole,
  onMoveUserClass,
  onResetUserLocalPassword,
  onDeleteUser,
  onGoToTeacherStudio,
}: AdminPanelProps) {
  const isMaster =
    Boolean(currentUser.isMasterAdmin) || isMasterAdminEmail(currentUser.email);

  const activeTeacherCode = (
    state.teacherAccessCode?.trim() || DEFAULT_TEACHER_ACCESS_CODE
  ).toUpperCase();

  const [codeDraft, setCodeDraft] = useState(activeTeacherCode);
  const [codeCopied, setCodeCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'students' | 'teachers' | 'blocked'>(
    'all',
  );
  const [pwDraftByUser, setPwDraftByUser] = useState<Record<string, string>>({});

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
  const voices = getAllVoiceProviderLabels();

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

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
            <Volume2 className="h-5 w-5 text-blue-600" />
            <span>Saúde dos Serviços & Vozes Neurais</span>
          </h2>
          <div className="mt-3 space-y-2.5 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <span className="font-semibold text-slate-700">Supabase Cloud</span>
              <span className="font-mono font-bold text-emerald-700">
                {supaCfg.url ? `Conectado (${autoSyncStatus?.state ?? 'pronto'})` : 'Offline'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <span className="font-semibold text-slate-700">Worker Edge API</span>
              <span className="truncate font-mono text-[11px] font-bold text-blue-700">
                {DEFAULT_BACKEND_API_URL}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 pt-1">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="font-bold text-slate-800">🇺🇸 / 🇬🇧 Inglês</p>
                <p className="mt-0.5 text-[11px] text-slate-600">{voices.enUs}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="font-bold text-slate-800">🇪🇸 / 🇲🇽 Espanhol</p>
                <p className="mt-0.5 text-[11px] text-slate-600">{voices.esEs}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="font-bold text-slate-800">🇫🇷 / 🇨🇦 Francês</p>
                <p className="mt-0.5 text-[11px] text-slate-600">{voices.frFr}</p>
              </div>
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
                      onClick={() => onToggleUserRole(u.id)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      {u.role === 'teacher' ? 'Tornar Aluno' : 'Promover Professor'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onToggleBlockUser(
                          u.id,
                          u.blocked ? undefined : 'Suspenso pelo administrador',
                        )
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
                      onClick={() => onDeleteUser(u.id)}
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
    </div>
  );
}

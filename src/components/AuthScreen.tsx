import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  GraduationCap,
  LogIn,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  DEFAULT_TEACHER_ACCESS_CODE,
  isMasterAdminEmail,
  MASTER_ADMIN_EMAIL,
} from '../config/appConfig';
import { verifyPassword } from '../utils/storage';
import type {
  ClassGroup,
  StudentEnrollmentType,
  UserProfile,
  UserRole,
} from '../types/learning';

interface AuthScreenProps {
  schoolName: string;
  teacherName: string;
  teacherAccessCode?: string;
  users: UserProfile[];
  classes: ClassGroup[];
  cloudConfigured: boolean;
  onOpenDownloadModal?: () => void;
  onLogin: (userId: string) => void;
  onEmailAuthLogin?: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  onGoogleLogin: () => Promise<{ ok: boolean; error?: string }>;
  onRegister: (payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    classId?: string;
    assignedTeacherId?: string;
    enrollmentType?: StudentEnrollmentType;
  }) => Promise<{ ok: boolean; error?: string }> | { ok: boolean; error?: string };
}

export function AuthScreen({
  schoolName,
  teacherName,
  teacherAccessCode,
  users,
  classes,
  cloudConfigured,
  onOpenDownloadModal,
  onLogin,
  onEmailAuthLogin,
  onGoogleLogin,
  onRegister,
}: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [classCode, setClassCode] = useState(classes[0]?.code ?? '');
  const [studentLinkMode, setStudentLinkMode] = useState<StudentEnrollmentType>('class');
  const [vipTeacherCode, setVipTeacherCode] = useState('');
  const [confirmNoTeacher, setConfirmNoTeacher] = useState(false);
  const [teacherCode, setTeacherCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (onEmailAuthLogin && cloudConfigured) {
      setIsSubmitting(true);
      const remoteRes = await onEmailAuthLogin(email.trim(), password);
      setIsSubmitting(false);
      if (remoteRes.ok) return;
      const localMatch = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          verifyPassword(password, u.password),
      );
      if (localMatch) {
        if (localMatch.blocked) {
          setError(
            localMatch.blockedReason ||
              'Seu acesso está suspenso pelo administrador.',
          );
          return;
        }
        onLogin(localMatch.id);
        return;
      }
      setError(
        remoteRes.error ||
          'E-mail ou senha inválidos. Verifique seus dados ou crie uma conta.',
      );
      return;
    }

    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        verifyPassword(password, u.password),
    );
    if (found) {
      if (found.blocked) {
        setError(
          found.blockedReason ||
            'Seu acesso está suspenso pelo administrador.',
        );
        return;
      }
      onLogin(found.id);
      return;
    }

    setError('E-mail ou senha inválidos. Verifique seus dados ou crie uma conta.');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha nome, e-mail e senha para criar sua conta.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As duas senhas digitadas não coincidem.');
      return;
    }

    const masterEmail = isMasterAdminEmail(email);
    const normalizedRole: UserRole = masterEmail ? 'teacher' : role;

    const expectedTeacherCode = (
      teacherAccessCode?.trim() || DEFAULT_TEACHER_ACCESS_CODE
    ).toUpperCase();

    if (normalizedRole === 'teacher' && !masterEmail) {
      if (teacherCode.trim().toUpperCase() !== expectedTeacherCode) {
        setError(
          'Código de Autorização Docente inválido. Solicite o código ao Prof. Silas ou cadastre-se como Aluno(a).',
        );
        return;
      }
    }

    let matchedClassId: string | undefined;
    let matchedTeacherId: string | undefined;
    let resolvedEnrollmentType: StudentEnrollmentType | undefined;

    if (normalizedRole === 'student') {
      resolvedEnrollmentType = studentLinkMode;
      if (studentLinkMode === 'class') {
        if (!classCode.trim()) {
          setError('Informe o código da turma ou selecione "Aluno VIP" / "Sem vínculo".');
          return;
        }
        const matched = classes.find(
          (c) => c.code.toLowerCase() === classCode.trim().toLowerCase(),
        );
        if (!matched) {
          setError(
            `Código de turma "${classCode}" não encontrado. Use um código válido (ex: ${classes
              .map((c) => c.code)
              .join(', ')}) ou escolha outra opção.`,
          );
          return;
        }
        matchedClassId = matched.id;
        matchedTeacherId = matched.teacherId ?? users.find((u) => u.role === 'teacher')?.id;
      } else if (studentLinkMode === 'vip') {
        const cleanVip = vipTeacherCode.trim().toUpperCase();
        if (!cleanVip) {
          setError('Informe o código de vinculação do professor (ex: PROF-SILAS).');
          return;
        }
        const matchedTeacher = users.find(
          (u) =>
            u.role === 'teacher' &&
            (u.teacherInviteCode ?? '').toUpperCase() === cleanVip,
        );
        if (!matchedTeacher) {
          setError(
            `Código de professor "${cleanVip}" não encontrado. Peça o código ao seu professor ou selecione uma turma.`,
          );
          return;
        }
        matchedTeacherId = matchedTeacher.id;
      } else if (!confirmNoTeacher) {
        setError(
          'Confirme na caixa de seleção que entende as restrições de estudar sem professor vinculado.',
        );
        return;
      }
    }

    setIsSubmitting(true);
    const res = await onRegister({
      name: name.trim(),
      email: email.trim(),
      password,
      role: normalizedRole,
      classId: matchedClassId,
      assignedTeacherId: matchedTeacherId,
      enrollmentType: resolvedEnrollmentType,
    });
    setIsSubmitting(false);
    if (!res.ok && res.error) {
      setError(res.error);
    }
  };

  const handleGoogleButtonClick = async () => {
    setError('');
    if (!cloudConfigured) {
      setError('Login com Google requer conexão com a nuvem configurada.');
      return;
    }
    setIsSubmitting(true);
    const res = await onGoogleLogin();
    setIsSubmitting(false);
    if (!res.ok) {
      setError(
        res.error ??
          'Não foi possível iniciar o login com Google. Verifique os URLs autorizados no Supabase.',
      );
    }
  };

  return (
    <div className="safe-top safe-bottom relative min-h-screen overflow-hidden bg-[#090D16] px-4 py-8 text-slate-100 sm:px-6 lg:flex lg:items-center lg:justify-center">
      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-blue-600/12 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Left Compact Highlights */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/75 p-6 backdrop-blur-md sm:p-8 lg:col-span-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold tracking-wide text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>{schoolName} · CEFR A1–C1</span>
            </div>

            <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              17 idiomas. 1 método completo.
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
              Mentoria de {teacherName} com IA e sincronização em nuvem.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5 text-xs">
              <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3.5">
                <p className="font-mono text-base font-extrabold text-white">17 Idiomas</p>
                <p className="mt-0.5 text-[11px] text-slate-400">2.550 unidades A1–C1</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3.5">
                <p className="font-mono text-base font-extrabold text-white">100 Simulados</p>
                <p className="mt-0.5 text-[11px] text-slate-400">25 formatos oficiais</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3.5">
                <p className="font-mono text-base font-extrabold text-white">65 Sotaques</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Voz neural &amp; Tradutor</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3.5">
                <p className="font-mono text-base font-extrabold text-white">850 Cenários</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Tutor IA + Prof. real</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
            {onOpenDownloadModal && (
              <button
                type="button"
                data-testid="auth-download-app-btn"
                onClick={onOpenDownloadModal}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <Download className="h-4 w-4 text-blue-400" />
                <span>Baixar App (Windows · Android · iOS)</span>
              </button>
            )}
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Progresso sincronizado
              </span>
              <span>Turma · VIP · Autônomo</span>
            </div>
          </div>
        </div>

        {/* Right Auth Form (Dark Sober Card) */}
        <div className="flex flex-col justify-center rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl sm:p-8 lg:col-span-7">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-slate-800 bg-slate-950/90 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="h-4 w-4" />
              <span>Entrar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              <span>Criar conta</span>
            </button>
          </div>

          {/* Google Login Button */}
          <div className="mt-5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void handleGoogleButtonClick()}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-white py-2.5 text-sm font-bold text-slate-900 shadow-xs transition hover:bg-slate-100 disabled:opacity-60 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
              <span>Entrar com Google</span>
            </button>

            <div className="my-4 flex items-center gap-3 text-[11px] font-semibold text-slate-500">
              <div className="h-px flex-1 bg-slate-800" />
              <span>ou com e-mail</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>
          </div>

          {mode === 'login' ? (
            <form onSubmit={(e) => void handleLoginSubmit(e)} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">E-mail</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Senha</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-rose-500/40 bg-rose-950/60 px-3.5 py-2.5 text-xs font-medium text-rose-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-60 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>{isSubmitting ? 'Entrando...' : 'Entrar na plataforma'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => void handleRegisterSubmit(e)} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('student');
                    setError('');
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                    role === 'student'
                      ? 'border-blue-500 bg-blue-500/15 text-blue-300'
                      : 'border-slate-700/80 bg-slate-950/50 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Sou Aluno(a)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('teacher');
                    setError('');
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                    role === 'teacher'
                      ? 'border-purple-500 bg-purple-500/15 text-purple-300'
                      : 'border-slate-700/80 bg-slate-950/50 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Sou Professor(a)</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Nome completo</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Pedro Silva"
                  className="mt-1 w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="mt-1 w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
                {isMasterAdminEmail(email) && (
                  <p className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/50 px-2.5 py-1.5 text-[11px] font-bold text-amber-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                    E-mail mestre ({MASTER_ADMIN_EMAIL}) — privilégio total Admin/Professor.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-300">
                    Senha (mín. 6 caracteres)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie uma senha"
                    className="mt-1 w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="mt-1 w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {role === 'student' && !isMasterAdminEmail(email) && (
                <div className="space-y-2.5 rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5">
                  <label className="text-xs font-bold text-slate-300">
                    Vínculo Docente
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'class', label: 'Turma' },
                        { id: 'vip', label: 'Aluno VIP' },
                        { id: 'independent', label: 'Sem vínculo' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setStudentLinkMode(opt.id);
                          setError('');
                        }}
                        className={`rounded-xl py-2 text-[11px] font-bold transition cursor-pointer ${
                          studentLinkMode === opt.id
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'border border-slate-700/80 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {studentLinkMode === 'class' && (
                    <div>
                      <input
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                        placeholder="Ex: TURMA-A1, TURMA-B1, VIP-2026"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-3.5 py-2 font-mono text-sm uppercase text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {classes.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setClassCode(c.code)}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-300 hover:border-blue-500 hover:text-blue-300 cursor-pointer"
                          >
                            {c.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {studentLinkMode === 'vip' && (
                    <div>
                      <input
                        value={vipTeacherCode}
                        onChange={(e) => setVipTeacherCode(e.target.value.toUpperCase())}
                        placeholder="Código do Professor (ex: PROF-SILAS)"
                        className="w-full rounded-xl border border-indigo-500/40 bg-slate-900 px-3.5 py-2 font-mono text-sm uppercase text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                      />
                    </div>
                  )}

                  {studentLinkMode === 'independent' && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-950/40 p-3 text-[11px] leading-relaxed text-amber-200">
                      <p className="font-bold text-amber-100">
                        Modo autônomo (sem professor vinculado)
                      </p>
                      <p className="mt-0.5 text-amber-200/90">
                        Acesso às 2.400 unidades nos 16 idiomas e Tutor IA liberado; envios de Speaking/Writing para correção docente ficam bloqueados até você se vincular.
                      </p>
                      <label className="mt-2 flex items-start gap-2 font-semibold text-amber-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={confirmNoTeacher}
                          onChange={(e) => setConfirmNoTeacher(e.target.checked)}
                          className="mt-0.5 rounded"
                        />
                        <span>
                          Confirmo continuar sem atribuição a um professor.
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {role === 'teacher' && !isMasterAdminEmail(email) && (
                <div className="rounded-2xl border border-purple-500/30 bg-purple-950/40 p-3.5">
                  <label className="text-xs font-bold text-purple-200">
                    Código de Autorização Docente *
                  </label>
                  <input
                    required
                    value={teacherCode}
                    onChange={(e) => setTeacherCode(e.target.value.toUpperCase())}
                    placeholder="Código de convite docente"
                    className="mt-2 w-full rounded-xl border border-purple-500/40 bg-slate-900 px-3.5 py-2 font-mono text-sm uppercase text-white placeholder:text-slate-500 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              )}

              {error && (
                <p className="rounded-xl border border-rose-500/40 bg-rose-950/60 px-3.5 py-2.5 text-xs font-medium text-rose-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-60 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isSubmitting ? 'Criando conta...' : 'Criar conta e entrar'}</span>
              </button>
            </form>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-emerald-400" />
              Supabase Cloud Sync
            </span>
            <span>CEFR A1–C1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

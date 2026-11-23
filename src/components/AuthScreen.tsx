import { useState } from 'react';
import {
  Award,
  CheckCircle2,
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
import type { ClassGroup, UserProfile, UserRole } from '../types/learning';

interface AuthScreenProps {
  schoolName: string;
  teacherName: string;
  users: UserProfile[];
  classes: ClassGroup[];
  cloudConfigured: boolean;
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
  }) => Promise<{ ok: boolean; error?: string }> | { ok: boolean; error?: string };
}

export function AuthScreen({
  schoolName,
  teacherName,
  users,
  classes,
  cloudConfigured,
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

    if (normalizedRole === 'teacher' && !masterEmail) {
      if (
        teacherCode.trim().toUpperCase() !== DEFAULT_TEACHER_ACCESS_CODE
      ) {
        setError(
          'Código de Autorização Docente inválido. Solicite o código ao Prof. Silas ou cadastre-se como Aluno(a).',
        );
        return;
      }
    }

    let matchedClassId: string | undefined;
    if (normalizedRole === 'student' && classCode.trim()) {
      const matched = classes.find(
        (c) => c.code.toLowerCase() === classCode.trim().toLowerCase(),
      );
      if (!matched) {
        setError(
          `Código de turma "${classCode}" não encontrado. Use um código válido (ex: ${classes
            .map((c) => c.code)
            .join(', ')}) ou deixe em branco.`,
        );
        return;
      }
      matchedClassId = matched.id;
    }

    setIsSubmitting(true);
    const res = await onRegister({
      name: name.trim(),
      email: email.trim(),
      password,
      role: normalizedRole,
      classId: matchedClassId,
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
    <div className="safe-top safe-bottom min-h-screen bg-[#F7F9FC] px-4 py-8 sm:px-6 lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
        {/* Left Value Prop */}
        <div className="flex flex-col justify-between rounded-3xl bg-linear-to-br from-blue-600 via-blue-600 to-indigo-700 p-7 text-white shadow-xl shadow-blue-600/15 lg:col-span-6 lg:p-9">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold backdrop-blur-xs">
              <Sparkles className="h-4 w-4" />
              <span>{schoolName} · Plataforma Completa A1–C1</span>
            </div>

            <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Inglês nas 4 Habilidades com mentoria de {teacherName}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-blue-100">
              34 unidades completas do A1 ao C1, dicas contextuais para brasileiros, envio de áudio e escrita para correção, tutor de conversação IA com vozes US/UK naturais e certificados CEFR.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs">
                <p className="font-mono text-lg font-extrabold">34 Unidades</p>
                <p className="text-blue-100">Listening, Reading, Speaking & Writing</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs">
                <p className="font-mono text-lg font-extrabold">Tutor IA + Voz</p>
                <p className="text-blue-100">Roleplay ao vivo e correção individual</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3 border-t border-white/15 pt-6">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-xs font-extrabold tracking-wide uppercase">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <span>Acesso Autenticado & Sincronizado</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-blue-100">
                Entre com sua conta Google ou crie seu acesso com e-mail e senha. Seu progresso, vocabulário e correções do {teacherName} ficam salvos na nuvem entre computador, celular Android e Web.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-blue-100/90">
              <span>• Alunos: use o código da turma no cadastro</span>
              <span>• Professores: cadastro mediante código docente</span>
            </div>
          </div>
        </div>

        {/* Right Auth Form */}
        <div className="flex flex-col justify-center rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs lg:col-span-6 lg:p-9">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
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
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
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
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
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

            <div className="my-4 flex items-center gap-3 text-[11px] font-semibold text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              <span>ou use e-mail e senha</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
          </div>

          {mode === 'login' ? (
            <form onSubmit={(e) => void handleLoginSubmit(e)} className="space-y-4">
              <div>
                <h2 className="font-display text-xl font-extrabold text-slate-900">
                  Acesse sua conta
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Entre com seu e-mail e senha cadastrados ou acesse diretamente com sua conta Google.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">E-mail</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Senha</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>{isSubmitting ? 'Entrando...' : 'Entrar na plataforma'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => void handleRegisterSubmit(e)} className="space-y-3.5">
              <div>
                <h2 className="font-display text-xl font-extrabold text-slate-900">
                  Criar nova conta
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Crie seu usuário e senha para acessar e sincronizar seu progresso entre computador e celular.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('student');
                    setError('');
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                    role === 'student'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Cadastro de Aluno</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('teacher');
                    setError('');
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                    role === 'teacher'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Cadastro de Professor</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Nome completo</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Pedro Silva"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                {isMasterAdminEmail(email) && (
                  <p className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-bold text-amber-900">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                    E-mail mestre identificado ({MASTER_ADMIN_EMAIL}) — conta terá privilégio total de Admin/Professor.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Senha (mín. 6 caracteres)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie uma senha segura"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {role === 'student' && !isMasterAdminEmail(email) && (
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Código da Turma (opcional)
                  </label>
                  <input
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    placeholder="Ex: TURMA-A1, TURMA-B1, VIP-2026"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm uppercase focus:border-blue-500 focus:outline-none"
                  />
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {classes.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setClassCode(c.code)}
                        className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {role === 'teacher' && !isMasterAdminEmail(email) && (
                <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-3.5">
                  <label className="text-xs font-bold text-purple-950">
                    Código de Autorização Docente *
                  </label>
                  <p className="mt-0.5 text-[11px] text-purple-800">
                    Área restrita à equipe pedagógica. Digite o código fornecido pelo Prof. Silas.
                  </p>
                  <input
                    required
                    value={teacherCode}
                    onChange={(e) => setTeacherCode(e.target.value.toUpperCase())}
                    placeholder="Código de convite docente"
                    className="mt-2 w-full rounded-xl border border-purple-200 bg-white px-3.5 py-2 font-mono text-sm uppercase focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}

              {error && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isSubmitting ? 'Criando conta...' : 'Criar conta e entrar'}</span>
              </button>
            </form>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-emerald-500" />
              Sincronizado com nuvem Supabase
            </span>
            <span>CEFR A1–C1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

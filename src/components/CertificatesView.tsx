import {
  Award,
  CheckCircle2,
  Copy,
  FileDown,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type {
  CEFRLevel,
  CertificateRecord,
  Topic,
  UserProfile,
} from '../types/learning';
import { downloadCertificatePdf } from '../utils/certificatePdf';

interface CertificatesViewProps {
  user: UserProfile;
  topics: Topic[];
  schoolName: string;
  teacherName: string;
  className?: string;
  onUnlockCertificate: (level: CEFRLevel) => void;
  onGoToTeacherClasses?: () => void;
}

const LEVELS_INFO: {
  level: CEFRLevel;
  title: string;
  description: string;
  color: string;
}[] = [
  {
    level: 'A1',
    title: 'Iniciante · Breakthrough',
    description: 'Cumprimentos, cafés, casa, família e compras do cotidiano.',
    color: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
  {
    level: 'A2',
    title: 'Básico · Waystage',
    description: 'Viagens, rotina diária, saúde e planos com amigos.',
    color: 'border-sky-200 bg-sky-50 text-sky-800',
  },
  {
    level: 'B1',
    title: 'Intermediário · Threshold',
    description: 'Entrevistas, trabalho remoto, narrativas e tecnologia.',
    color: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  {
    level: 'B2',
    title: 'Intermediário Avançado · Vantage',
    description: 'Apresentações, negociações, pensamento crítico e moradia fora.',
    color: 'border-violet-200 bg-violet-50 text-violet-800',
  },
  {
    level: 'C1',
    title: 'Avançado · Proficiency',
    description: 'Liderança executiva, escrita acadêmica, idioms e debates globais.',
    color: 'border-rose-200 bg-rose-50 text-rose-800',
  },
];

export function CertificatesView({
  user,
  topics,
  schoolName,
  teacherName,
  className,
  onUnlockCertificate,
  onGoToTeacherClasses,
}: CertificatesViewProps) {
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Ignore clipboard unavailability
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
            <Award className="h-3.5 w-3.5" />
            Certificação por Nível CEFR
          </span>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
            Certificados em PDF ({user.issuedCertificates.length}/5 emitidos)
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Conclua todas as unidades de um nível CEFR para desbloquear automaticamente seu certificado oficial com detalhamento das 4 habilidades.
          </p>
        </div>

        {user.role === 'teacher' && onGoToTeacherClasses && (
          <button
            type="button"
            onClick={onGoToTeacherClasses}
            className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Emitir certificado para alunos em Turmas →</span>
          </button>
        )}
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {LEVELS_INFO.map((info) => {
          const levelTopics = topics.filter((t) => !t.isCustom && t.level === info.level);
          const completedInLevel = levelTopics.filter((t) =>
            user.completedTopicIds.includes(t.id),
          ).length;
          const totalInLevel = Math.max(1, levelTopics.length);
          const pct = Math.round((completedInLevel / totalInLevel) * 100);
          const readyToUnlock = completedInLevel >= totalInLevel;

          const existingCert: CertificateRecord | undefined =
            user.issuedCertificates.find((c) => c.level === info.level);

          return (
            <article
              key={info.level}
              className={`flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-2xs ${
                existingCert
                  ? 'border-emerald-300 ring-1 ring-emerald-100'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${info.color}`}
                  >
                    CEFR {info.level}
                  </span>
                  {existingCert ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Certificado Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                      <Lock className="h-3.5 w-3.5" />
                      {completedInLevel}/{totalInLevel} unidades
                    </span>
                  )}
                </div>

                <h2 className="mt-3 font-display text-lg font-extrabold text-slate-900">
                  {info.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {info.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Progresso do nível</span>
                    <span className="font-mono">{pct}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        existingCert || readyToUnlock ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {existingCert ? (
                <div className="mt-5 space-y-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-950">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Código: <code className="font-mono">{existingCert.verificationCode}</code>
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleCopyCode(existingCert.verificationCode)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      Copiar
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Emitido por {existingCert.issuedBy} · Média das 4 habilidades:{' '}
                    <strong>{existingCert.avgScore}%</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      downloadCertificatePdf(
                        existingCert,
                        schoolName,
                        teacherName,
                        className,
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700 cursor-pointer"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>Visualizar e Baixar / Imprimir PDF</span>
                  </button>
                </div>
              ) : readyToUnlock ? (
                <button
                  type="button"
                  onClick={() => onUnlockCertificate(info.level)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
                >
                  <Award className="h-4 w-4" />
                  <span>Gerar meu certificado {info.level} agora!</span>
                </button>
              ) : (
                <p className="mt-5 rounded-xl bg-slate-50 px-3.5 py-2.5 text-center text-xs font-medium text-slate-500">
                  Complete as {totalInLevel - completedInLevel} unidades restantes de{' '}
                  <strong>{info.level}</strong> na Trilha para liberar.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

/**
 * @file src/components/TeacherLinkModal.tsx
 * @description Modal para o aluno vincular-se a um professor/turma ou confirmar estudo no modo autônomo.
 * @exports TeacherLinkModal
 */
import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Crown,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import type { UserProfile } from '../types/learning';
import { getTeacherDisplayName } from '../utils/teacherDisplay';

interface TeacherLinkModalProps {
  open: boolean;
  student: UserProfile;
  teachers: UserProfile[];
  mandatoryPrompt?: boolean;
  onLinkToTeacher: (teacherId: string) => void;
  onConfirmIndependent: () => void;
  onClose?: () => void;
}

export function TeacherLinkModal({
  open,
  student,
  teachers,
  mandatoryPrompt = false,
  onLinkToTeacher,
  onConfirmIndependent,
  onClose,
}: TeacherLinkModalProps) {
  const [step, setStep] = useState<'choose' | 'confirm_independent'>('choose');
  const [teacherCode, setTeacherCode] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState(
    teachers[0]?.id ?? '',
  );
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleLinkByCodeOrSelect = () => {
    setError(null);
    const trimmed = teacherCode.trim().toUpperCase();
    if (trimmed) {
      const matched = teachers.find(
        (t) => (t.teacherInviteCode ?? '').toUpperCase() === trimmed,
      );
      if (!matched) {
        setError(
          `Código "${trimmed}" não encontrado. Confira com o professor ou selecione na lista abaixo.`,
        );
        return;
      }
      onLinkToTeacher(matched.id);
      return;
    }

    if (!selectedTeacherId) {
      setError('Selecione um professor ou informe o código de vinculação.');
      return;
    }
    onLinkToTeacher(selectedTeacherId);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-link-modal-title"
    >
      <div className="animate-fade-up max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="teacher-link-modal-title"
                className="font-display text-lg font-extrabold text-slate-900"
              >
                {step === 'choose'
                  ? 'Vincular a um Professor (VIP / Individual)'
                  : 'Confirmar Estudo Sem Professor'}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {student.unlinkedNoticePending
                  ? 'Sua vinculação anterior foi removida.'
                  : 'Escolha um professor responsável ou estude de forma independente.'}
              </p>
            </div>
          </div>

          {!mandatoryPrompt && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {student.unlinkedNoticePending && step === 'choose' && (
          <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-950">
            <p className="font-bold">
              {student.unlinkedByTeacherName
                ? `O(a) professor(a) ${student.unlinkedByTeacherName} removeu você da sua lista de alunos vinculados.`
                : 'Sua vinculação docente anterior foi removida.'}
            </p>
            <p className="mt-1">
              Deseja se vincular a um professor agora para manter correções individuais de Speaking, Writing e tarefas VIP?
            </p>
          </div>
        )}

        {step === 'choose' ? (
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Código de Vinculação do Professor (opcional)
              </label>
              <input
                type="text"
                value={teacherCode}
                onChange={(e) => setTeacherCode(e.target.value.toUpperCase())}
                placeholder="Ex: PROF-SILAS"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>

            {teachers.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-700">
                  Ou escolha diretamente um professor da escola:
                </p>
                <div className="mt-2 space-y-2">
                  {teachers.map((t) => {
                    const active = selectedTeacherId === t.id && !teacherCode.trim();
                    const teacherDisplay = getTeacherDisplayName(t);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setTeacherCode('');
                          setSelectedTeacherId(t.id);
                          setError(null);
                        }}
                        className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition cursor-pointer ${
                          active
                            ? 'border-blue-500 bg-blue-50/70 ring-1 ring-blue-200'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                            style={{ backgroundColor: t.avatarColor }}
                          >
                            {teacherDisplay.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                              <span>{teacherDisplay}</span>
                              {t.isMasterAdmin && (
                                <Crown className="h-3.5 w-3.5 text-amber-500" />
                              )}
                            </p>
                            <p className="font-mono text-[11px] text-slate-500">
                              Código: {t.teacherInviteCode ?? 'PROF-SILAS'}
                            </p>
                          </div>
                        </div>
                        {active && (
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep('confirm_independent')}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Seguir sem professor
              </button>
              <button
                type="button"
                onClick={handleLinkByCodeOrSelect}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
              >
                <UserCheck className="h-4 w-4" />
                <span>Confirmar Vinculação VIP</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="tip-warning-box rounded-2xl p-4 text-xs leading-relaxed">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="tip-warning-icon h-4 w-4 shrink-0" />
                <span>Aviso de Restrição de Atividades</span>
              </div>
              <p className="mt-2">
                Sem um professor vinculado, ficarão <strong>restritas</strong> as atividades que exigem validação docente:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>Envio de gravações de <strong>Speaking</strong> para avaliação de pronúncia do professor;</li>
                <li>Envio de redações (<strong>Writing</strong>) para correção e selos individuais;</li>
                <li>Recebimento de tarefas VIP personalizadas e emissão docente de certificados.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950">
              <p className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>O que continua 100% liberado:</span>
              </p>
              <p className="mt-1 text-emerald-900">
                Todas as <strong>2.400 unidades nos 16 idiomas</strong>, Tutor IA com modo Chamada, revisão SM-2, Guia Gramatical e pontuação automática de fala permanecem disponíveis, e você poderá se vincular a um professor a qualquer momento.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep('choose')}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Voltar e vincular</span>
              </button>
              <button
                type="button"
                onClick={onConfirmIndependent}
                className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 cursor-pointer"
              >
                Confirmar e seguir sem atribuição
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

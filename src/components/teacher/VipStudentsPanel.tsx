/**
 * @file src/components/teacher/VipStudentsPanel.tsx
 * @description Painel de gerenciamento de alunos VIP vinculados diretamente ao professor, com tarefas e código de convite.
 * @exports VipStudentsPanel
 */
import { useState } from 'react';
import {
  Check,
  Copy,
  Crown,
  Send,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import type { LanguageCode, UserProfile } from '../../types/learning';
import { ConfirmDialog } from '../ConfirmDialog';

interface VipStudentsPanelProps {
  currentUser: UserProfile;
  users: UserProfile[];
  isMaster: boolean;
  onLinkStudentToTeacher: (studentId: string, teacherId: string, mode: 'vip' | 'class') => void;
  onUnlinkStudentFromTeacher: (
    studentId: string,
    initiatedBy: 'teacher' | 'admin' | 'student',
  ) => void;
  onCreateVipAssignment?: (payload: {
    title: string;
    description: string;
    studentId: string;
    languageCode: LanguageCode;
    dueDate: string;
  }) => void;
}

export function VipStudentsPanel({
  currentUser,
  users,
  isMaster,
  onLinkStudentToTeacher,
  onUnlinkStudentFromTeacher,
  onCreateVipAssignment,
}: VipStudentsPanelProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [filterMode, setFilterMode] = useState<'mine' | 'all' | 'unlinked'>('mine');
  const [vipTaskStudentId, setVipTaskStudentId] = useState('');
  const [vipTaskTitle, setVipTaskTitle] = useState('');
  const [vipTaskDesc, setVipTaskDesc] = useState('');
  const [vipTaskLang, setVipTaskLang] = useState<LanguageCode>('en');
  const [vipTaskDue, setVipTaskDue] = useState('2026-12-10');
  const [pendingAction, setPendingAction] = useState<
    | { type: 'unlink'; student: UserProfile }
    | { type: 'link'; student: UserProfile }
    | null
  >(null);

  const students = users.filter((u) => u.role === 'student');
  const teachers = users.filter((u) => u.role === 'teacher');

  const visibleStudents = students.filter((s) => {
    if (filterMode === 'mine') return s.assignedTeacherId === currentUser.id;
    if (filterMode === 'unlinked') return !s.assignedTeacherId && !s.classId;
    return true;
  });

  const myVipCount = students.filter(
    (s) => s.assignedTeacherId === currentUser.id,
  ).length;
  const unlinkedCount = students.filter(
    (s) => !s.assignedTeacherId && !s.classId,
  ).length;

  const myInviteCode = currentUser.teacherInviteCode ?? 'PROF-SILAS';

  const handleCopyCode = () => {
    void navigator.clipboard?.writeText(myInviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCreateVipTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateVipAssignment || !vipTaskStudentId || !vipTaskTitle.trim()) return;
    onCreateVipAssignment({
      title: vipTaskTitle.trim(),
      description: vipTaskDesc.trim() || 'Atividade individual VIP atribuída pelo professor.',
      studentId: vipTaskStudentId,
      languageCode: vipTaskLang,
      dueDate: vipTaskDue,
    });
    setVipTaskTitle('');
    setVipTaskDesc('');
  };

  return (
    <div className="rounded-3xl border border-indigo-200/80 bg-white p-6 shadow-xs space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-slate-900">
            <Crown className="h-5 w-5 text-amber-500" />
            <span>Alunos VIP / Individuais & Vinculação Docente</span>
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Compartilhe seu código de professor para alunos individuais (VIP) ou gerencie seus alunos vinculados com confirmação segura.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2">
          <div>
            <p className="text-[10px] font-bold text-indigo-700 uppercase">
              Seu Código de Vinculação
            </p>
            <p className="font-mono text-sm font-extrabold text-indigo-950">
              {myInviteCode}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-700 cursor-pointer"
          >
            {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setFilterMode('mine')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            filterMode === 'mine'
              ? 'bg-indigo-600 text-white'
              : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          Meus vinculados ({myVipCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('unlinked')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            filterMode === 'unlinked'
              ? 'bg-amber-600 text-white'
              : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          Sem professor ({unlinkedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            filterMode === 'all'
              ? 'bg-slate-900 text-white'
              : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          Todos da escola ({students.length})
        </button>
      </div>

      {/* Students List */}
      {visibleStudents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-xs text-slate-500">
          <Users className="mx-auto h-6 w-6 text-slate-400" />
          <p className="mt-2 font-semibold text-slate-700">
            Nenhum aluno encontrado neste filtro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {visibleStudents.map((stu) => {
            const assignedTeacher = teachers.find(
              (t) => t.id === stu.assignedTeacherId,
            );
            const isMine = stu.assignedTeacherId === currentUser.id;
            const badgeText =
              stu.enrollmentType === 'vip'
                ? 'VIP Individual'
                : stu.classId
                  ? 'Turma'
                  : 'Sem atribuição';

            return (
              <div
                key={stu.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                      style={{ backgroundColor: stu.avatarColor }}
                    >
                      {stu.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{stu.name}</p>
                      <p className="text-[11px] text-slate-500">{stu.email}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      stu.enrollmentType === 'vip'
                        ? 'bg-amber-100 text-amber-800'
                        : stu.classId
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {badgeText}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-2.5 text-[11px]">
                  <span className="text-slate-600">
                    Prof.:{' '}
                    <strong>{assignedTeacher?.name ?? 'Nenhum vinculado'}</strong>
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    {!isMine && (
                      <button
                        type="button"
                        onClick={() => setPendingAction({ type: 'link', student: stu })}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 cursor-pointer"
                      >
                        <UserPlus className="h-3 w-3" />
                        <span>Vincular a mim (VIP)</span>
                      </button>
                    )}
                    {(isMine || (isMaster && stu.assignedTeacherId)) && (
                      <button
                        type="button"
                        onClick={() => setPendingAction({ type: 'unlink', student: stu })}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                      >
                        <UserMinus className="h-3 w-3" />
                        <span>Desvincular</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Individual VIP Assignment Quick Form */}
      {onCreateVipAssignment && myVipCount > 0 && (
        <form
          onSubmit={handleCreateVipTask}
          className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3"
        >
          <p className="text-xs font-extrabold text-slate-800">
            Enviar Tarefa Individual para Aluno VIP
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <select
              required
              value={vipTaskStudentId}
              onChange={(e) => setVipTaskStudentId(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs"
            >
              <option value="">Selecionar aluno...</option>
              {students
                .filter((s) => isMaster || s.assignedTeacherId === currentUser.id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
            <input
              type="text"
              required
              value={vipTaskTitle}
              onChange={(e) => setVipTaskTitle(e.target.value)}
              placeholder="Título da tarefa VIP..."
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
            <select
              value={vipTaskLang}
              onChange={(e) => setVipTaskLang(e.target.value as LanguageCode)}
              className="rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs"
            >
              <option value="en">🇬🇧 Inglês</option>
              <option value="es">🇪🇸 Espanhol</option>
              <option value="fr">🇫🇷 Francês</option>
              <option value="it">🇮🇹 Italiano</option>
              <option value="de">🇩🇪 Alemão</option>
            </select>
            <input
              type="date"
              value={vipTaskDue}
              onChange={(e) => setVipTaskDue(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs"
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={vipTaskDesc}
              onChange={(e) => setVipTaskDesc(e.target.value)}
              placeholder="Orientação personalizada (opcional)..."
              className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Enviar para VIP</span>
            </button>
          </div>
        </form>
      )}

      <ConfirmDialog
        open={Boolean(pendingAction)}
        tone={pendingAction?.type === 'unlink' ? 'danger' : 'primary'}
        title={
          pendingAction?.type === 'unlink'
            ? `Remover ${pendingAction.student.name} da vinculação?`
            : `Vincular ${pendingAction?.student.name ?? ''} como seu aluno VIP?`
        }
        description={
          pendingAction?.type === 'unlink'
            ? 'O aluno perderá o vínculo com você. No próximo login, ele será perguntado se deseja se vincular a outro professor ou seguir sem atribuição.'
            : 'Este aluno passará a enviar Speaking, Writing e receber tarefas VIP diretamente com você.'
        }
        warningBox={
          pendingAction?.type === 'unlink'
            ? 'Caso o aluno opte por ficar sem professor, atividades que dependem de validação docente (envio de áudio/redação e tarefas VIP) ficarão restritas até uma nova vinculação.'
            : pendingAction?.student.assignedTeacherId
              ? 'Atenção: este aluno já possui outro professor vinculado e será transferido para você.'
              : undefined
        }
        confirmLabel={
          pendingAction?.type === 'unlink'
            ? 'Sim, desvincular aluno'
            : 'Sim, vincular como VIP'
        }
        onCancel={() => setPendingAction(null)}
        onConfirm={() => {
          if (!pendingAction) return;
          if (pendingAction.type === 'unlink') {
            onUnlinkStudentFromTeacher(
              pendingAction.student.id,
              isMaster ? 'admin' : 'teacher',
            );
          } else {
            onLinkStudentToTeacher(
              pendingAction.student.id,
              currentUser.id,
              'vip',
            );
          }
          setPendingAction(null);
        }}
      />
    </div>
  );
}

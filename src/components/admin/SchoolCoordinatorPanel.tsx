/**
 * @file src/components/admin/SchoolCoordinatorPanel.tsx
 * @description Painel dedicado do Coordenador Escolar (isSchoolAdmin) com isolamento estrito à sua própria escola: KPIs, professores, alunos com remanejamento, turmas, importação CSV, QR Code e exportação consolidada.
 * @exports SchoolCoordinatorPanel
 */
import { useState } from 'react';
import {
  Building2,
  Check,
  Copy,
  Download,
  GraduationCap,
  Printer,
  QrCode,
  Upload,
  Users,
  X,
} from 'lucide-react';
import type {
  PlatformState,
  SchoolTenant,
  UserProfile,
} from '../../types/learning';
import {
  generateSchoolQrSvg,
  parseStudentsCsv,
  type ParsedStudentCsvRow,
} from '../../utils/qrCodeSvg';
import {
  getEffectiveSchool,
  getSchoolClasses,
  getSchoolTeachers,
  resolveEntitySchoolId,
  resolveUserSchoolId,
} from '../../utils/tenantEngine';
import { ConfirmDialog } from '../ConfirmDialog';

interface SchoolCoordinatorPanelProps {
  state: PlatformState;
  currentUser: UserProfile;
  schools?: SchoolTenant[];
  onReassignStudentTeacher?: (studentId: string, teacherId?: string) => void;
  onImportSchoolStudents?: (
    schoolId: string,
    rows: ParsedStudentCsvRow[],
  ) => void;
}

export function SchoolCoordinatorPanel({
  state,
  currentUser,
  schools,
  onReassignStudentTeacher,
  onImportSchoolStudents,
}: SchoolCoordinatorPanelProps) {
  const mySchoolId = resolveUserSchoolId(currentUser);
  const mySchool = getEffectiveSchool(
    schools ?? state.schools,
    mySchoolId,
    state.schoolName,
  );

  const schoolUsers = state.users.filter(
    (u) => resolveUserSchoolId(u) === mySchoolId,
  );
  const schoolTeachers = getSchoolTeachers(schoolUsers, mySchoolId);
  const schoolStudents = schoolUsers.filter((u) => u.role === 'student');
  const schoolClasses = getSchoolClasses(state.classes, mySchoolId);
  const schoolSubmissions = state.submissions.filter(
    (s) => resolveEntitySchoolId(s) === mySchoolId,
  );

  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [csvText, setCsvText] = useState(
    'Nome,Email,Turma\nMaria Clara,maria@escola.com,B1-MANHA',
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pendingReassign, setPendingReassign] = useState<{
    student: UserProfile;
    teacherId?: string;
    teacherName: string;
  } | null>(null);

  const portalUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?escola=${mySchool.slug}`
      : `/?escola=${mySchool.slug}`;

  const parsedRows = parseStudentsCsv(csvText);

  const handleExportSchoolCsv = () => {
    const header = 'Nome,Email,Turma,Professor,XP,UnidadesConcluidas';
    const lines = schoolStudents.map((st) => {
      const cls = schoolClasses.find((c) => c.id === st.classId)?.name ?? 'VIP/Livre';
      const teacher =
        schoolTeachers.find((t) => t.id === st.assignedTeacherId)?.name ?? 'Sem professor';
      return [
        `"${st.name.replace(/"/g, '""')}"`,
        `"${st.email}"`,
        `"${cls.replace(/"/g, '""')}"`,
        `"${teacher.replace(/"/g, '""')}"`,
        st.xp,
        st.completedTopicIds.length,
      ].join(',');
    });
    const blob = new Blob([[header, ...lines].join('\n')], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${mySchool.slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="school-coordinator-panel" className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold">
              <Building2 className="h-3.5 w-3.5" />
              <span>Coordenação Escolar · {mySchool.name}</span>
            </span>
            <h1 className="mt-2 font-display text-2xl font-extrabold">
              Painel da Escola ({mySchool.inviteCode})
            </h1>
            <p className="mt-1 text-xs text-blue-100">
              Visão isolada apenas para sua unidade escolar: professores, alunos, turmas e matrículas em lote.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(portalUrl);
                setCopiedLink(true);
                window.setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25 cursor-pointer"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Link copiado' : `?escola=${mySchool.slug}`}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25 cursor-pointer"
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>QR Code</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCsvImport((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Importar CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportSchoolCsv}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exportar CSV Consolidado</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-900">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-2xl font-extrabold text-blue-600">
            {schoolStudents.length}
          </p>
          <p className="text-xs font-semibold text-slate-500">Alunos da escola</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-2xl font-extrabold text-indigo-600">
            {schoolTeachers.length}
          </p>
          <p className="text-xs font-semibold text-slate-500">Professores</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-2xl font-extrabold text-emerald-600">
            {schoolClasses.length}
          </p>
          <p className="text-xs font-semibold text-slate-500">Turmas</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-2xl font-extrabold text-amber-600">
            {schoolSubmissions.length}
          </p>
          <p className="text-xs font-semibold text-slate-500">Submissões</p>
        </div>
      </div>

      {showCsvImport && (
        <section className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-xs">
          <h2 className="font-display text-sm font-bold text-slate-900">
            Importação em Lote de Alunos (CSV: Nome,Email,Turma)
          </h2>
          <textarea
            rows={4}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {parsedRows.length} registro(s) válido(s)
            </span>
            <button
              type="button"
              disabled={parsedRows.length === 0}
              onClick={() => {
                onImportSchoolStudents?.(mySchoolId, parsedRows);
                setFeedback(`${parsedRows.length} aluno(s) importado(s) para ${mySchool.name}.`);
                setShowCsvImport(false);
              }}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              Confirmar Importação
            </button>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-5">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
            <GraduationCap className="h-4.5 w-4.5 text-indigo-600" />
            <span>Professores ({schoolTeachers.length})</span>
          </h2>
          <div className="mt-3 space-y-2">
            {schoolTeachers.length === 0 ? (
              <p className="text-xs text-slate-500">Nenhum professor vinculado a esta escola.</p>
            ) : (
              schoolTeachers.map((t) => {
                const count = schoolStudents.filter((s) => s.assignedTeacherId === t.id).length;
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{t.name}</p>
                      <p className="text-[11px] text-slate-500">{t.email}</p>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-indigo-800">
                      {count} aluno(s)
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <h3 className="mt-5 font-display text-sm font-bold text-slate-900">
            Turmas ({schoolClasses.length})
          </h3>
          <div className="mt-2 space-y-1.5">
            {schoolClasses.length === 0 ? (
              <p className="text-xs text-slate-500">Nenhuma turma cadastrada.</p>
            ) : (
              schoolClasses.map((cl) => (
                <div
                  key={cl.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
                >
                  <span className="font-semibold text-slate-800">{cl.name}</span>
                  <span className="font-mono text-[11px] text-slate-500">{cl.code}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-7">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
            <Users className="h-4.5 w-4.5 text-blue-600" />
            <span>Alunos &amp; Remanejamento de Professor ({schoolStudents.length})</span>
          </h2>
          <div className="mt-3 space-y-2">
            {schoolStudents.length === 0 ? (
              <p className="text-xs text-slate-500">Nenhum aluno matriculado nesta escola.</p>
            ) : (
              schoolStudents.map((st) => (
                <div
                  key={st.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{st.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {st.email} · {st.xp} XP
                    </p>
                  </div>
                  <select
                    aria-label={`Professor de ${st.name}`}
                    value={st.assignedTeacherId ?? ''}
                    onChange={(e) => {
                      const nextId = e.target.value || undefined;
                      if (nextId === st.assignedTeacherId) return;
                      const teacherName =
                        schoolTeachers.find((t) => t.id === nextId)?.name ?? 'Sem professor';
                      setPendingReassign({
                        student: st,
                        teacherId: nextId,
                        teacherName,
                      });
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="">Sem professor</option>
                    {schoolTeachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {showQrModal && (
        <div
          data-testid="school-qr-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-base font-extrabold text-slate-900">
                  QR Code · {mySchool.name}
                </h3>
                <p className="font-mono text-[11px] text-slate-500">{portalUrl}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                aria-label="Fechar QR Code"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div
              className="mt-4 flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4"
              dangerouslySetInnerHTML={{
                __html: generateSchoolQrSvg(portalUrl, mySchool.name),
              }}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Imprimir</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const svg = generateSchoolQrSvg(portalUrl, mySchool.name);
                  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `qrcode-${mySchool.slug}.svg`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Baixar SVG</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingReassign)}
        title="Confirmar remanejamento de professor"
        description={
          pendingReassign
            ? `Deseja vincular "${pendingReassign.student.name}" ao professor "${pendingReassign.teacherName}" nesta escola?`
            : ''
        }
        confirmLabel="Confirmar troca"
        tone="primary"
        onCancel={() => setPendingReassign(null)}
        onConfirm={() => {
          if (pendingReassign) {
            onReassignStudentTeacher?.(
              pendingReassign.student.id,
              pendingReassign.teacherId,
            );
            setFeedback(
              `${pendingReassign.student.name} remanejado(a) para ${pendingReassign.teacherName}.`,
            );
          }
          setPendingReassign(null);
        }}
      />
    </div>
  );
}

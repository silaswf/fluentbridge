/**
 * @file src/components/admin/SchoolsManagementPanel.tsx
 * @description Painel B2B de gestão de escolas multi-tenant: filtro global, QR Code SVG, upload de logo no R2, cor primária, importação CSV de alunos e suspensão/reativação.
 * @exports SchoolsManagementPanel
 */
import { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Palette,
  Printer,
  QrCode,
  ShieldCheck,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { DEFAULT_BACKEND_API_URL } from '../../config/appConfig';
import type {
  ClassGroup,
  SchoolTenant,
  UserProfile,
} from '../../types/learning';
import { getSupabaseAccessToken } from '../../utils/cloudSync';
import {
  generateSchoolQrSvg,
  parseStudentsCsv,
  type ParsedStudentCsvRow,
} from '../../utils/qrCodeSvg';
import { DEFAULT_SCHOOL_ID, resolveUserSchoolId } from '../../utils/tenantEngine';
import { ConfirmDialog } from '../ConfirmDialog';

interface SchoolsManagementPanelProps {
  schools: SchoolTenant[];
  users: UserProfile[];
  classes: ClassGroup[];
  adminSchoolFilter?: string;
  onChangeAdminSchoolFilter?: (schoolId: string) => void;
  onCreateSchool?: (payload: {
    name: string;
    inviteCode?: string;
    ownerEmail?: string;
    primaryColor?: string;
  }) => void;
  onToggleSchoolStatus?: (schoolId: string) => void;
  onUpdateSchoolBranding?: (
    schoolId: string,
    branding: { primaryColor?: string; logoUrl?: string },
  ) => void;
  onImportSchoolStudents?: (
    schoolId: string,
    rows: ParsedStudentCsvRow[],
  ) => void;
}

export function SchoolsManagementPanel({
  schools,
  users,
  classes,
  adminSchoolFilter = 'ALL',
  onChangeAdminSchoolFilter,
  onCreateSchool,
  onToggleSchoolStatus,
  onUpdateSchoolBranding,
  onImportSchoolStudents,
}: SchoolsManagementPanelProps) {
  const [copiedSchoolId, setCopiedSchoolId] = useState<string | null>(null);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolOwnerEmail, setNewSchoolOwnerEmail] = useState('');
  const [qrSchool, setQrSchool] = useState<SchoolTenant | null>(null);
  const [csvSchool, setCsvSchool] = useState<SchoolTenant | null>(null);
  const [csvText, setCsvText] = useState(
    'Nome,Email,Turma\nAna Silva,ana@escola.com,B1-MANHA\nLucas Souza,lucas@escola.com,A2-NOITE',
  );
  const [uploadingSchoolId, setUploadingSchoolId] = useState<string | null>(null);
  const [brandFeedback, setBrandFeedback] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    tone: 'danger' | 'warning' | 'primary';
    action: () => void;
  } | null>(null);

  const getPortalUrl = (slug: string) =>
    typeof window !== 'undefined'
      ? `${window.location.origin}/?escola=${slug}`
      : `/?escola=${slug}`;

  const handleUploadLogo = async (school: SchoolTenant, file: File) => {
    const apiBase = DEFAULT_BACKEND_API_URL.trim().replace(/\/+$/, '');
    if (!apiBase) {
      setBrandFeedback('URL do backend não configurada para upload.');
      return;
    }
    setUploadingSchoolId(school.id);
    setBrandFeedback(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const key = `images/schools/${school.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      form.append('key', key);
      const token = await getSupabaseAccessToken();
      const res = await fetch(
        `${apiBase}/api/media/upload?key=${encodeURIComponent(key)}`,
        {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: form,
        },
      );
      if (!res.ok) {
        setBrandFeedback(`Falha no upload do logo (${res.status}).`);
        return;
      }
      const data = (await res.json()) as { ok?: boolean; url?: string };
      if (data.ok && data.url) {
        onUpdateSchoolBranding?.(school.id, { logoUrl: data.url });
        setBrandFeedback(`Logo de ${school.name} atualizado.`);
      }
    } catch {
      setBrandFeedback('Erro de rede ao enviar logo.');
    } finally {
      setUploadingSchoolId(null);
    }
  };

  const handleDownloadQrSvg = (school: SchoolTenant) => {
    const svg = generateSchoolQrSvg(getPortalUrl(school.slug), school.name);
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${school.slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const parsedCsvRows = parseStudentsCsv(csvText);

  return (
    <section
      data-testid="admin-schools-panel"
      className="space-y-4 rounded-3xl border border-blue-200 bg-white p-6 shadow-xs"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <span>Escolas &amp; Multi-Tenancy (Isolamento por Tenant)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Cada escola possui dados 100% isolados, branding próprio, QR Code de matrícula e importação CSV em lote.
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

      {brandFeedback && (
        <p className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-900">
          {brandFeedback}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {schools.map((sc) => {
          const scStudents = users.filter(
            (u) => u.role === 'student' && resolveUserSchoolId(u) === sc.id,
          ).length;
          const scTeachers = users.filter(
            (u) => u.role === 'teacher' && resolveUserSchoolId(u) === sc.id,
          ).length;
          const scClasses = classes.filter(
            (c) => (c.schoolId || DEFAULT_SCHOOL_ID) === sc.id,
          ).length;
          const isMain = sc.id === DEFAULT_SCHOOL_ID;
          const primaryColor = sc.primaryColor || '#116DFF';

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
                <div className="flex items-center gap-2.5">
                  {sc.logoUrl ? (
                    <img
                      src={sc.logoUrl}
                      alt={sc.name}
                      className="h-9 w-9 rounded-xl border border-slate-200 bg-white object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-xs font-extrabold text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {sc.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="font-display text-sm font-bold text-slate-900">
                      {sc.name}
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      ?escola={sc.slug} · {sc.inviteCode}
                    </p>
                  </div>
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

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(getPortalUrl(sc.slug));
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

                <button
                  type="button"
                  onClick={() => setQrSchool(sc)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <QrCode className="h-3 w-3 text-blue-600" />
                  <span>QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCsvSchool(sc)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <Users className="h-3 w-3 text-indigo-600" />
                  <span>Importar Alunos CSV</span>
                </button>

                <label className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer">
                  <Upload className="h-3 w-3 text-slate-600" />
                  <span>{uploadingSchoolId === sc.id ? 'Enviando...' : 'Logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUploadLogo(sc, file);
                      e.target.value = '';
                    }}
                  />
                </label>

                <label className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 cursor-pointer">
                  <Palette className="h-3 w-3 text-slate-600" />
                  <span>Cor</span>
                  <input
                    type="color"
                    aria-label={`Cor primária de ${sc.name}`}
                    value={primaryColor}
                    onChange={(e) =>
                      onUpdateSchoolBranding?.(sc.id, { primaryColor: e.target.value })
                    }
                    className="h-4 w-5 cursor-pointer border-0 bg-transparent p-0"
                  />
                </label>

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

      {qrSchool && (
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
                  QR Code · {qrSchool.name}
                </h3>
                <p className="font-mono text-[11px] text-slate-500">
                  {getPortalUrl(qrSchool.slug)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQrSchool(null)}
                aria-label="Fechar QR Code"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div
              className="mt-4 flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4"
              dangerouslySetInnerHTML={{
                __html: generateSchoolQrSvg(getPortalUrl(qrSchool.slug), qrSchool.name),
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
                onClick={() => handleDownloadQrSvg(qrSchool)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Baixar SVG</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {csvSchool && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-base font-extrabold text-slate-900">
                  Importar Alunos CSV · {csvSchool.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Formato esperado: <code className="font-mono">Nome,Email,Turma</code>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCsvSchool(null)}
                aria-label="Fechar importação CSV"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <textarea
              rows={5}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 outline-none focus:border-blue-500"
            />
            <p className="mt-2 text-xs font-semibold text-slate-600">
              {parsedCsvRows.length} aluno(s) válido(s) detectado(s).
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCsvSchool(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={parsedCsvRows.length === 0}
                onClick={() => {
                  onImportSchoolStudents?.(csvSchool.id, parsedCsvRows);
                  setBrandFeedback(
                    `${parsedCsvRows.length} aluno(s) importado(s) para ${csvSchool.name}.`,
                  );
                  setCsvSchool(null);
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                Importar {parsedCsvRows.length} aluno(s)
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingConfirm)}
        title={pendingConfirm?.title ?? ''}
        description={pendingConfirm?.description ?? ''}
        confirmLabel={pendingConfirm?.confirmLabel ?? 'Confirmar'}
        tone={pendingConfirm?.tone ?? 'warning'}
        onCancel={() => setPendingConfirm(null)}
        onConfirm={() => {
          pendingConfirm?.action();
          setPendingConfirm(null);
        }}
      />
    </section>
  );
}

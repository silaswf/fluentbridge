/**
 * @file src/components/exams/ExamEvolutionPanel.tsx
 * @description Painel comparativo de evolução em simulados oficiais com KPIs, evolução por habilidade, tabela cronológica e exportação CSV.
 * @exports computeExamEvolutionStats, ExamEvolutionPanel
 */
import { useMemo } from 'react';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Download,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import type { ExamAttemptRecord } from '../../types/learning';

export type ExamSkillKey =
  | 'reading'
  | 'listening'
  | 'language_use'
  | 'writing'
  | 'speaking';

export interface SkillEvolutionItem {
  skill: ExamSkillKey;
  label: string;
  firstScore: number;
  latestScore: number;
  delta: number;
}

export interface ExamEvolutionStats {
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  passRate: number;
  latestScore: number | null;
  previousScore: number | null;
  deltaVsPrevious: number | null;
  chronologicalAttempts: ExamAttemptRecord[];
  skillEvolution: SkillEvolutionItem[];
}

const SKILL_LABELS: Array<{ key: ExamSkillKey; label: string }> = [
  { key: 'reading', label: 'Reading' },
  { key: 'listening', label: 'Listening' },
  { key: 'language_use', label: 'Use of Language' },
  { key: 'writing', label: 'Writing' },
  { key: 'speaking', label: 'Speaking' },
];

/**
 * Computes longitudinal KPIs, delta vs previous attempt, and per-skill evolution.
 */
export function computeExamEvolutionStats(
  attempts: ExamAttemptRecord[],
): ExamEvolutionStats {
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      bestScore: 0,
      averageScore: 0,
      passRate: 0,
      latestScore: null,
      previousScore: null,
      deltaVsPrevious: null,
      chronologicalAttempts: [],
      skillEvolution: SKILL_LABELS.map(({ key, label }) => ({
        skill: key,
        label,
        firstScore: 0,
        latestScore: 0,
        delta: 0,
      })),
    };
  }

  const chronologicalAttempts = [...attempts].sort((a, b) =>
    a.completedAt.localeCompare(b.completedAt),
  );

  const totalAttempts = chronologicalAttempts.length;
  const bestScore = Math.max(...chronologicalAttempts.map((a) => a.rawPercent));
  const averageScore = Math.round(
    chronologicalAttempts.reduce((sum, a) => sum + a.rawPercent, 0) /
      totalAttempts,
  );
  const passedCount = chronologicalAttempts.filter((a) => a.passed).length;
  const passRate = Math.round((passedCount / totalAttempts) * 100);

  const first = chronologicalAttempts[0];
  const latest = chronologicalAttempts[totalAttempts - 1];
  const previous =
    totalAttempts >= 2 ? chronologicalAttempts[totalAttempts - 2] : null;

  const latestScore = latest.rawPercent;
  const previousScore = previous ? previous.rawPercent : null;
  const deltaVsPrevious =
    previous !== null ? latest.rawPercent - previous.rawPercent : null;

  const skillEvolution: SkillEvolutionItem[] = SKILL_LABELS.map(
    ({ key, label }) => {
      const firstScore = first.sectionScores?.[key] ?? 0;
      const latestSkillScore = latest.sectionScores?.[key] ?? 0;
      return {
        skill: key,
        label,
        firstScore,
        latestScore: latestSkillScore,
        delta: latestSkillScore - firstScore,
      };
    },
  );

  return {
    totalAttempts,
    bestScore,
    averageScore,
    passRate,
    latestScore,
    previousScore,
    deltaVsPrevious,
    chronologicalAttempts,
    skillEvolution,
  };
}

interface ExamEvolutionPanelProps {
  attempts: ExamAttemptRecord[];
  languageNamePt?: string;
}

function escapeCsvCell(value: string | number | boolean): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function ExamEvolutionPanel({
  attempts,
  languageNamePt,
}: ExamEvolutionPanelProps) {
  const stats = useMemo(
    () => computeExamEvolutionStats(attempts),
    [attempts],
  );

  const handleExportCsv = () => {
    const header = [
      'Data',
      'Exame',
      'Formato',
      'Categoria',
      'Nota Oficial',
      'Percentual (%)',
      'Aprovado',
      'Reading (%)',
      'Listening (%)',
      'Use of Language (%)',
      'Writing (%)',
      'Speaking (%)',
    ];
    const rows = stats.chronologicalAttempts.map((att) => [
      escapeCsvCell(att.completedAt),
      escapeCsvCell(att.examId),
      escapeCsvCell(att.examTypeId),
      escapeCsvCell(att.practiceCategory ?? 'full'),
      escapeCsvCell(att.officialScoreLabel),
      escapeCsvCell(att.rawPercent),
      escapeCsvCell(att.passed ? 'Sim' : 'Não'),
      escapeCsvCell(att.sectionScores?.reading ?? 0),
      escapeCsvCell(att.sectionScores?.listening ?? 0),
      escapeCsvCell(att.sectionScores?.language_use ?? 0),
      escapeCsvCell(att.sectionScores?.writing ?? 0),
      escapeCsvCell(att.sectionScores?.speaking ?? 0),
    ]);
    const csvContent =
      '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historico-simulados.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (stats.totalAttempts === 0) {
    return (
      <div
        data-testid="exam-evolution-panel"
        className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xs"
      >
        <BarChart3 className="mx-auto h-10 w-10 text-slate-300" />
        <h3 className="mt-3 font-display text-lg font-extrabold text-slate-900">
          Nenhum simulado concluído ainda
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Complete pelo menos um simulado{languageNamePt ? ` de ${languageNamePt}` : ''} para acompanhar sua evolução comparativa por habilidade.
        </p>
      </div>
    );
  }

  return (
    <div data-testid="exam-evolution-panel" className="space-y-6">
      {/* Header + CSV Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-slate-900">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>
              Evolução Comparativa{languageNamePt ? ` — ${languageNamePt}` : ''}
            </span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Comparativo histórico entre sua primeira e última tentativa em cada habilidade oficial.
          </p>
        </div>

        <button
          type="button"
          data-testid="export-exam-csv-btn"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Exportar Histórico CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">
            Tentativas
          </p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-slate-900">
            {stats.totalAttempts}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">
            Melhor Nota
          </p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-700">
            {stats.bestScore}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">
            Média Geral
          </p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-blue-700">
            {stats.averageScore}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">
            Aprovação
          </p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-slate-900">
            {stats.passRate}%
          </p>
        </div>

        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:col-span-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase">
            Delta vs Anterior
          </p>
          <p
            className={`mt-1 flex items-center gap-1 font-mono text-2xl font-extrabold ${
              stats.deltaVsPrevious === null
                ? 'text-slate-400'
                : stats.deltaVsPrevious >= 0
                  ? 'text-emerald-700'
                  : 'text-rose-600'
            }`}
          >
            {stats.deltaVsPrevious !== null ? (
              <>
                {stats.deltaVsPrevious >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {stats.deltaVsPrevious >= 0 ? '+' : ''}
                  {stats.deltaVsPrevious}%
                </span>
              </>
            ) : (
              '—'
            )}
          </p>
        </div>
      </div>

      {/* Per-Skill Evolution (First vs Latest) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-display text-base font-extrabold text-slate-900">
            <Award className="h-4 w-4 text-indigo-600" />
            <span>Evolução por Habilidade (1ª vs Última Tentativa)</span>
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">
            {stats.chronologicalAttempts[0]?.completedAt} →{' '}
            {
              stats.chronologicalAttempts[
                stats.chronologicalAttempts.length - 1
              ]?.completedAt
            }
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.skillEvolution.map((item) => (
            <div
              key={item.skill}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-800">
                  {item.label}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-extrabold ${
                    item.delta > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.delta < 0
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.delta > 0 ? '+' : ''}
                  {item.delta}%
                </span>
              </div>
              <div className="flex items-baseline justify-between font-mono text-xs text-slate-600">
                <span>1ª: {item.firstScore}%</span>
                <span className="font-extrabold text-slate-900">
                  Atual: {item.latestScore}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, item.latestScore))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chronological History Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs">
        <h3 className="font-display text-base font-extrabold text-slate-900">
          Histórico Cronológico ({stats.totalAttempts})
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-3">Data</th>
                <th className="py-2 pr-3">Simulado</th>
                <th className="py-2 pr-3">Categoria</th>
                <th className="py-2 pr-3">Nota Oficial</th>
                <th className="py-2 pr-3">% Geral</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.chronologicalAttempts.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 pr-3 font-mono text-slate-600">
                    {att.completedAt}
                  </td>
                  <td className="py-2.5 pr-3 font-bold text-slate-900">
                    {att.examTypeId.toUpperCase()} · {att.examId}
                  </td>
                  <td className="py-2.5 pr-3 text-slate-600">
                    {att.practiceCategory ?? 'full'}
                  </td>
                  <td className="py-2.5 pr-3 font-mono font-bold text-blue-700">
                    {att.officialScoreLabel}
                  </td>
                  <td className="py-2.5 pr-3 font-mono font-extrabold text-slate-900">
                    {att.rawPercent}%
                  </td>
                  <td className="py-2.5">
                    {att.passed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Aprovado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                        <XCircle className="h-3 w-3" />
                        Abaixo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

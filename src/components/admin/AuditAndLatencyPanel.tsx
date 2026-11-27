/**
 * @file src/components/admin/AuditAndLatencyPanel.tsx
 * @description Painel administrativo de trilha de auditoria (últimas 25 ações) e métricas de latência média/p95 das rotas de IA.
 * @exports AuditAndLatencyPanel
 */
import { Activity, Clock, ShieldCheck } from 'lucide-react';
import type { AdminAuditLogEntry } from '../../types/learning';
import type { AdminQuotaRouteStat, AdminQuotaSnapshot } from '../../utils/telemetry';

type RouteWithLatency = AdminQuotaRouteStat & {
  avgMs?: number;
  p95Ms?: number;
  samples?: number;
};

interface AuditAndLatencyPanelProps {
  auditLogs?: AdminAuditLogEntry[];
  quotasSnapshot?: AdminQuotaSnapshot | null;
}

export function AuditAndLatencyPanel({
  auditLogs = [],
  quotasSnapshot,
}: AuditAndLatencyPanelProps) {
  const recentLogs = [...auditLogs]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 25);

  const routes = (quotasSnapshot?.routes ?? []) as RouteWithLatency[];

  return (
    <section
      data-testid="admin-audit-panel"
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
            <span>Auditoria Administrativa &amp; Latência das Rotas IA</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Últimas {recentLogs.length} de 25 ações críticas registradas e tempos de resposta (avg / p95) do Worker.
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
          <Activity className="h-3.5 w-3.5 text-indigo-600" />
          <span>Latência das Rotas de IA</span>
        </h3>
        {routes.length === 0 ? (
          <p className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
            Aguardando coleta de métricas de latência (`quotasSnapshot`).
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {routes.map((r) => (
              <div
                key={r.key}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs"
              >
                <p className="font-bold text-slate-900">{r.label}</p>
                <p className="font-mono text-[10px] text-slate-500">{r.endpoint}</p>
                <div className="mt-2 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-600">
                    avg: <strong className="text-slate-900">{r.avgMs ?? '—'} ms</strong>
                  </span>
                  <span className="text-slate-600">
                    p95: <strong className="text-indigo-700">{r.p95Ms ?? '—'} ms</strong>
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-slate-500">
                  amostras: {r.samples ?? r.usedToday}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
          <Clock className="h-3.5 w-3.5 text-slate-600" />
          <span>Registro de Auditoria (25 ações mais recentes)</span>
        </h3>
        {recentLogs.length === 0 ? (
          <p className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
            Nenhuma ação administrativa registrada ainda.
          </p>
        ) : (
          <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-100 text-[11px] font-bold text-slate-700">
                <tr>
                  <th className="px-3 py-2">Data/Hora</th>
                  <th className="px-3 py-2">Ator</th>
                  <th className="px-3 py-2">Ação</th>
                  <th className="px-3 py-2">Alvo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-slate-500">
                      {entry.createdAt.replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="px-3 py-2 font-medium text-slate-800">
                      {entry.actorEmail}
                    </td>
                    <td className="px-3 py-2 font-semibold text-indigo-700">
                      {entry.action}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {entry.targetLabel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

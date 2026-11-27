/**
 * @file src/components/admin/QuotasAndBillingPanel.tsx
 * @description Subcomponente do AdminPanel para monitoramento em tempo real de cotas IA (Cloudflare R2 + latência avgMs/p95Ms) e motor de planos/assinaturas.
 * @exports QuotasAndBillingPanel
 */
import { Activity, CreditCard, RefreshCw } from 'lucide-react';
import type { BillingConfig } from '../../types/learning';
import {
  DEFAULT_BILLING_CONFIG,
  SUBSCRIPTION_PLANS,
  type BillingPlansApiResponse,
} from '../../utils/subscriptionEngine';
import type { AdminQuotaRouteStat, AdminQuotaSnapshot } from '../../utils/telemetry';

export type AdminQuotaRouteWithLatency = AdminQuotaRouteStat & {
  avgMs?: number;
  p95Ms?: number;
};

export interface PendingAdminConfirm {
  tone?: 'primary' | 'warning' | 'danger';
  title: string;
  description: string;
  warningBox?: string;
  confirmLabel: string;
  action: () => void;
}

export interface QuotasAndBillingPanelProps {
  quotasSnapshot: AdminQuotaSnapshot | null;
  loadingQuotas: boolean;
  onRefreshQuotas: () => void;
  billingConfig?: BillingConfig;
  billingStatus: BillingPlansApiResponse | null;
  onUpdateBillingConfig?: (cfg: BillingConfig) => void;
  onRequestConfirm: (pending: PendingAdminConfirm) => void;
}

const DEFAULT_QUOTA_ROUTES: AdminQuotaRouteWithLatency[] = [
  {
    key: 'stt',
    label: 'Transcrição Whisper STT',
    endpoint: '/api/stt',
    usedToday: 0,
    limitPerActor: 200,
    activeActorsToday: 0,
    sevenDayTotal: 0,
  },
  {
    key: 'gemini',
    label: 'Tutor IA & Corretor',
    endpoint: '/api/gemini-tutor',
    usedToday: 0,
    limitPerActor: 250,
    activeActorsToday: 0,
    sevenDayTotal: 0,
  },
  {
    key: 'translate',
    label: 'Tradutor Bidirecional',
    endpoint: '/api/translate',
    usedToday: 0,
    limitPerActor: 300,
    activeActorsToday: 0,
    sevenDayTotal: 0,
  },
  {
    key: 'youtube',
    label: 'YouTube Study Lab',
    endpoint: '/api/youtube-study',
    usedToday: 0,
    limitPerActor: 100,
    activeActorsToday: 0,
    sevenDayTotal: 0,
  },
];

export function QuotasAndBillingPanel({
  quotasSnapshot,
  loadingQuotas,
  onRefreshQuotas,
  billingConfig,
  billingStatus,
  onUpdateBillingConfig,
  onRequestConfirm,
}: QuotasAndBillingPanelProps) {
  const routes: AdminQuotaRouteWithLatency[] =
    (quotasSnapshot?.routes as AdminQuotaRouteWithLatency[] | undefined) ??
    DEFAULT_QUOTA_ROUTES;
  const billingCfg = billingConfig ?? DEFAULT_BILLING_CONFIG;
  const isBillingOn = Boolean(billingCfg.billingEnabled);

  return (
    <>
      {/* Consumo Diário de Cotas IA (Cloudflare R2) */}
      <section
        data-testid="admin-quotas-panel"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
              <Activity className="h-4.5 w-4.5 text-indigo-600" />
              <span>Consumo Diário de Cotas IA (Cloudflare R2)</span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Monitoramento em tempo real das cotas persistentes no R2 (
              {quotasSnapshot?.date ?? 'hoje'}) e acumulado de{' '}
              {quotasSnapshot?.days ?? 7} dias.
            </p>
          </div>
          <button
            type="button"
            disabled={loadingQuotas}
            onClick={onRefreshQuotas}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loadingQuotas ? 'animate-spin' : ''}`}
            />
            <span>Atualizar cotas</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((r) => {
            const pct = Math.min(
              100,
              Math.round((r.usedToday / Math.max(1, r.limitPerActor)) * 100),
            );
            const barColor =
              pct >= 85
                ? 'bg-rose-500'
                : pct >= 60
                  ? 'bg-amber-500'
                  : 'bg-emerald-500';
            const hasLatency =
              typeof r.avgMs === 'number' || typeof r.p95Ms === 'number';

            return (
              <div
                key={r.key}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900">{r.label}</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {r.endpoint}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between font-mono">
                  <span className="text-base font-extrabold text-slate-900">
                    {r.usedToday}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    / {r.limitPerActor} por usuário/dia
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-[10px] text-slate-500">
                  {r.activeActorsToday} ativo(s) hoje · {r.sevenDayTotal} reqs em{' '}
                  {quotasSnapshot?.days ?? 7}d
                </p>
                {hasLatency && (
                  <p className="mt-1 font-mono text-[10px] font-semibold text-indigo-700">
                    Latência: avg {r.avgMs ?? '—'}ms / p95 {r.p95Ms ?? '—'}ms
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Motor de Planos & Assinaturas (Pronto para ativação futura) */}
      <section
        data-testid="admin-billing-panel"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
                <CreditCard className="h-4.5 w-4.5 text-emerald-600" />
                <span>Motor de Planos &amp; Assinaturas</span>
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  isBillingOn
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isBillingOn
                  ? 'Cobrança Ativa'
                  : '100% Gratuito (Cobrança Desativada)'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Estrutura pronta (Stripe / Mercado Pago + tabelas Supabase + rotas{' '}
              <code className="font-mono">/api/billing/*</code>). Enquanto estiver
              desativada, <strong>nenhum aluno vê paywall</strong> e todos têm
              acesso irrestrito. Alunos vinculados a professores mantêm{' '}
              <code className="font-mono">school_grant</code> gratuito.
            </p>
          </div>
          {onUpdateBillingConfig && (
            <button
              type="button"
              onClick={() =>
                onRequestConfirm({
                  tone: isBillingOn ? 'primary' : 'warning',
                  title: isBillingOn
                    ? 'Voltar para modo 100% gratuito?'
                    : 'Ativar motor de cobrança?',
                  description: isBillingOn
                    ? 'Todos os usuários voltarão imediatamente para acesso gratuito irrestrito.'
                    : 'Exigirá chaves STRIPE_SECRET_KEY ou MERCADOPAGO_ACCESS_TOKEN no Worker para checkout real. Alunos da escola/VIP continuam gratuitos.',
                  confirmLabel: isBillingOn
                    ? 'Ativar modo gratuito'
                    : 'Confirmar ativação',
                  action: () =>
                    onUpdateBillingConfig({
                      ...billingCfg,
                      billingEnabled: !isBillingOn,
                      updatedAt: new Date().toISOString(),
                    }),
                })
              }
              className={`rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer ${
                isBillingOn
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isBillingOn
                ? 'Voltar p/ 100% Gratuito'
                : 'Ativar cobrança (futuro)'}
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-700">
            Worker Mode: {billingStatus?.mode ?? 'free'}
          </span>
          <span
            className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold ${
              billingStatus?.providers.stripe
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            Stripe Secret:{' '}
            {billingStatus?.providers.stripe ? 'Configurado' : 'Pendente'}
          </span>
          <span
            className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold ${
              billingStatus?.providers.mercadopago
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            Mercado Pago:{' '}
            {billingStatus?.providers.mercadopago ? 'Configurado' : 'Pendente'}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-slate-900">{plan.badgePt}</span>
                <span className="font-mono text-[10px] text-slate-500">
                  {plan.referencePricePt}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-slate-600">
                {plan.summaryPt}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/**
 * @file src/utils/subscriptionEngine.ts
 * @description Motor de Planos, Assinaturas e Entitlements do FluentBridge (pronto para ativação futura via Stripe/Mercado Pago, operando em modo 100% gratuito por padrão).
 * @exports DEFAULT_BILLING_CONFIG, SUBSCRIPTION_PLANS, getPlanMeta, resolveUserEntitlements, fetchBillingPlansStatus, requestBillingCheckout
 */
import { DEFAULT_BACKEND_API_URL, isMasterAdminEmail } from '../config/appConfig';
import type {
  BillingConfig,
  SubscriptionPlanId,
  UserProfile,
} from '../types/learning';

export interface SubscriptionPlanMeta {
  id: SubscriptionPlanId;
  namePt: string;
  badgePt: string;
  referencePricePt: string;
  summaryPt: string;
  featuresPt: string[];
}

export interface UserEntitlements {
  billingActive: boolean;
  isFullAccess: boolean;
  effectivePlanId: SubscriptionPlanId;
  badgeLabel: string;
  canUseAllLanguages: boolean;
  canUseAiTutor: boolean;
  canUseTranslator: boolean;
  canUseYouTubeLab: boolean;
  canUseMockExams: boolean;
}

export interface BillingPlansApiResponse {
  ok: boolean;
  billingEnabled: boolean;
  mode: 'free' | 'active';
  providers: {
    stripe: boolean;
    mercadopago: boolean;
  };
  plans: Array<{
    id: SubscriptionPlanId;
    name: string;
    active: boolean;
  }>;
}

export const DEFAULT_BILLING_CONFIG: BillingConfig = {
  billingEnabled: false,
  provider: 'none',
  freeNoticePt: 'Acesso 100% gratuito por tempo indeterminado — cobrança desativada.',
};

export const SUBSCRIPTION_PLANS: SubscriptionPlanMeta[] = [
  {
    id: 'free',
    namePt: 'Acesso Livre (Gratuito)',
    badgePt: 'Gratuito',
    referencePricePt: 'R$ 0/mês',
    summaryPt: 'Plano padrão ativo enquanto a cobrança estiver desativada.',
    featuresPt: [
      'Acesso completo às 2.550 unidades nos 17 idiomas',
      'Tradutor bidirecional, YouTube Study Lab e Simulados',
    ],
  },
  {
    id: 'school_grant',
    namePt: 'Bolsa Escola / Aluno Vinculado',
    badgePt: 'Bolsa Escola',
    referencePricePt: 'R$ 0 (via Professor)',
    summaryPt: 'Gratuidade garantida para alunos vinculados a turmas ou professores da escola.',
    featuresPt: [
      'Correção humana Writing/Speaking + Boletim PDF',
      'Mantém acesso integral mesmo se cobrança B2C for ativada no futuro',
    ],
  },
  {
    id: 'student_pro',
    namePt: 'Aluno Autônomo Pro',
    badgePt: 'Pro',
    referencePricePt: 'Estrutura pronta',
    summaryPt: 'Plano futuro para alunos autônomos sem vínculo escolar.',
    featuresPt: [
      '17 idiomas A1–C1 + Tutor IA ilimitado + 100 Simulados Oficiais',
      'Tradutor bidirecional + YouTube Study Lab + Modo Hands-Free',
    ],
  },
  {
    id: 'student_vip',
    namePt: 'Mentoria VIP',
    badgePt: 'VIP',
    referencePricePt: 'Estrutura pronta',
    summaryPt: 'Plano futuro para alunos particulares com acompanhamento docente individual.',
    featuresPt: [
      'Tudo do Pro + Aulas ao Vivo + Correções prioritárias do Professor',
    ],
  },
  {
    id: 'school_b2b',
    namePt: 'Escola Parceira (B2B)',
    badgePt: 'B2B',
    referencePricePt: 'Estrutura pronta',
    summaryPt: 'Base futura para licenciamento a outras escolas e turmas multi-tenant.',
    featuresPt: [
      'Múltiplos professores, gestão de turmas, certificados e observabilidade',
    ],
  },
];

export function getPlanMeta(planId?: SubscriptionPlanId): SubscriptionPlanMeta {
  return (
    SUBSCRIPTION_PLANS.find((p) => p.id === planId) ?? SUBSCRIPTION_PLANS[0]
  );
}

/**
 * Resolve as permissões efetivas do usuário.
 * Enquanto `billingConfig?.billingEnabled` for `false` (padrão atual),
 * todos os usuários possuem acesso completo e gratuito sem qualquer restrição.
 */
export function resolveUserEntitlements(
  user: UserProfile,
  billingConfig?: BillingConfig,
): UserEntitlements {
  const billingActive = Boolean(billingConfig?.billingEnabled);
  const currentPlanId: SubscriptionPlanId = user.subscription?.planId ?? 'free';

  if (!billingActive) {
    return {
      billingActive: false,
      isFullAccess: true,
      effectivePlanId: currentPlanId,
      badgeLabel: 'Acesso Livre (Gratuito)',
      canUseAllLanguages: true,
      canUseAiTutor: true,
      canUseTranslator: true,
      canUseYouTubeLab: true,
      canUseMockExams: true,
    };
  }

  const isPrivilegedRole =
    Boolean(user.isMasterAdmin) ||
    isMasterAdminEmail(user.email) ||
    user.role === 'teacher';
  const isSchoolLinked = Boolean(user.assignedTeacherId || user.classId);
  const sub = user.subscription;
  const hasActivePaidSub = Boolean(
    sub &&
      (sub.status === 'active' ||
        sub.status === 'trialing' ||
        sub.status === 'lifetime_free') &&
      sub.planId !== 'free',
  );

  if (isPrivilegedRole || isSchoolLinked || currentPlanId === 'school_grant' || hasActivePaidSub) {
    const resolvedPlan: SubscriptionPlanId =
      currentPlanId !== 'free'
        ? currentPlanId
        : isSchoolLinked
          ? 'school_grant'
          : 'free';
    return {
      billingActive: true,
      isFullAccess: true,
      effectivePlanId: resolvedPlan,
      badgeLabel: getPlanMeta(resolvedPlan).badgePt,
      canUseAllLanguages: true,
      canUseAiTutor: true,
      canUseTranslator: true,
      canUseYouTubeLab: true,
      canUseMockExams: true,
    };
  }

  return {
    billingActive: true,
    isFullAccess: false,
    effectivePlanId: 'free',
    badgeLabel: 'Gratuito (Inicial)',
    canUseAllLanguages: false,
    canUseAiTutor: false,
    canUseTranslator: true,
    canUseYouTubeLab: false,
    canUseMockExams: false,
  };
}

export async function fetchBillingPlansStatus(): Promise<BillingPlansApiResponse> {
  const fallback: BillingPlansApiResponse = {
    ok: true,
    billingEnabled: false,
    mode: 'free',
    providers: { stripe: false, mercadopago: false },
    plans: SUBSCRIPTION_PLANS.map((p) => ({
      id: p.id,
      name: p.namePt,
      active: p.id === 'free' || p.id === 'school_grant',
    })),
  };
  if (typeof fetch === 'undefined') return fallback;
  const apiBase = DEFAULT_BACKEND_API_URL.replace(/\/+$/, '');
  if (!apiBase) return fallback;

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 8000) : null;
  try {
    const res = await fetch(`${apiBase}/api/billing/plans`, {
      signal: controller?.signal,
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as BillingPlansApiResponse;
    return data?.ok ? data : fallback;
  } catch {
    return fallback;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function requestBillingCheckout(params: {
  planId: SubscriptionPlanId;
  userId?: string;
  email?: string;
}): Promise<{ ok: boolean; billingEnabled: boolean; mode: 'free' | 'active'; message: string; checkoutUrl?: string }> {
  const apiBase = DEFAULT_BACKEND_API_URL.replace(/\/+$/, '');
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 10000) : null;
  try {
    const res = await fetch(`${apiBase}/api/billing/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller?.signal,
    });
    if (!res.ok) {
      return {
        ok: false,
        billingEnabled: false,
        mode: 'free',
        message: 'Serviço de cobrança indisponível; o app segue em modo 100% gratuito.',
      };
    }
    return (await res.json()) as {
      ok: boolean;
      billingEnabled: boolean;
      mode: 'free' | 'active';
      message: string;
      checkoutUrl?: string;
    };
  } catch {
    return {
      ok: false,
      billingEnabled: false,
      mode: 'free',
      message: 'Modo offline: acesso gratuito mantido sem restrições.',
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * @file src/utils/retentionNotifications.ts
 * @description Utilitário retentionNotifications da camada de lógica do FluentBridge.
 * @exports RetentionAlert, computeRetentionAlerts, requestAndSendBrowserNotification, scheduleNativeRetentionNotifications
 */
import type { UserProfile } from '../types/learning';

export interface RetentionAlert {
  id: string;
  kind: 'srs_due' | 'streak_risk' | 'teacher_review' | 'live_class';
  titlePt: string;
  bodyPt: string;
  severity: 'info' | 'warning' | 'success';
}

export function computeRetentionAlerts(
  user: UserProfile,
  reviewedSubmissionsCount: number,
  upcomingLiveTitle?: string,
): RetentionAlert[] {
  const alerts: RetentionAlert[] = [];
  const now = Date.now();

  const dueCards = user.vocab.filter((card) => {
    if (card.languageCode && card.languageCode !== user.activeLanguage) return false;
    if (!card.nextReviewAt) return card.strength === 'weak';
    const ts = Date.parse(card.nextReviewAt);
    return Number.isNaN(ts) || ts <= now;
  });

  if (dueCards.length > 0) {
    alerts.push({
      id: 'alert-srs-due',
      kind: 'srs_due',
      titlePt: `${dueCards.length} palavra(s) prontas para revisão SM-2`,
      bodyPt: 'Revisar agora consolida a memória de longo prazo.',
      severity: 'info',
    });
  }

  if (user.streakDays > 0 && user.todayMinutes === 0) {
    alerts.push({
      id: 'alert-streak-risk',
      kind: 'streak_risk',
      titlePt: `Proteja sua ofensiva de ${user.streakDays} dia(s)`,
      bodyPt: 'Complete 1 etapa hoje para manter sua sequência ativa.',
      severity: 'warning',
    });
  }

  if (reviewedSubmissionsCount > 0) {
    alerts.push({
      id: 'alert-teacher-review',
      kind: 'teacher_review',
      titlePt: `${reviewedSubmissionsCount} correção(ões) do professor disponível(is)`,
      bodyPt: 'Veja o feedback detalhado e suas notas de Writing/Speaking.',
      severity: 'success',
    });
  }

  if (upcomingLiveTitle) {
    alerts.push({
      id: 'alert-live-class',
      kind: 'live_class',
      titlePt: 'Aula ao Vivo programada',
      bodyPt: upcomingLiveTitle,
      severity: 'info',
    });
  }

  return alerts;
}

export async function requestAndSendBrowserNotification(
  alert: RetentionAlert,
): Promise<{ ok: boolean; message: string }> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      ok: false,
      message: 'Notificações do navegador não disponíveis neste dispositivo.',
    };
  }

  try {
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    if (permission !== 'granted') {
      return {
        ok: false,
        message: 'Permissão de notificações não concedida.',
      };
    }
    new Notification(`FluentBridge · ${alert.titlePt}`, {
      body: alert.bodyPt,
    });
    return {
      ok: true,
      message: 'Lembrete inteligente ativado com sucesso!',
    };
  } catch {
    return {
      ok: false,
      message: 'Não foi possível disparar notificação do sistema.',
    };
  }
}

export async function scheduleNativeRetentionNotifications(
  alerts: RetentionAlert[],
): Promise<{ ok: boolean; scheduledCount: number; message: string }> {
  if (alerts.length === 0) {
    return { ok: true, scheduledCount: 0, message: 'Nenhum alerta pendente.' };
  }

  try {
    const cap = (
      globalThis as unknown as {
        Capacitor?: {
          isNativePlatform?: () => boolean;
          Plugins?: {
            LocalNotifications?: {
              requestPermissions?: () => Promise<{ display?: string }>;
              schedule?: (opts: {
                notifications: Array<{
                  id: number;
                  title: string;
                  body: string;
                  schedule: { at: Date };
                }>;
              }) => Promise<void>;
            };
          };
        };
      }
    ).Capacitor;

    const localPlugin = cap?.Plugins?.LocalNotifications;
    if (cap?.isNativePlatform?.() && localPlugin?.schedule) {
      await localPlugin.requestPermissions?.();
      const nowMs = Date.now();
      const notifications = alerts.slice(0, 3).map((al, idx) => ({
        id: 8300 + idx,
        title: `FluentBridge · ${al.titlePt}`,
        body: al.bodyPt,
        schedule: { at: new Date(nowMs + (idx + 1) * 60 * 60 * 1000) },
      }));
      await localPlugin.schedule({ notifications });
      return {
        ok: true,
        scheduledCount: notifications.length,
        message: `${notifications.length} lembrete(s) nativo(s) agendado(s) no dispositivo.`,
      };
    }
  } catch {
    // Fallback to browser Notification API below
  }

  const webRes = await requestAndSendBrowserNotification(alerts[0]);
  return {
    ok: webRes.ok,
    scheduledCount: webRes.ok ? 1 : 0,
    message: webRes.message,
  };
}

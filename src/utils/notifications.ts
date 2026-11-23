import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const DAILY_REMINDER_NOTIFICATION_ID = 7001;

export async function scheduleDailyStudyReminder(
  enabled: boolean,
  timeHHmm = '19:30',
): Promise<{ ok: boolean; message: string }> {
  const [hourStr, minuteStr] = timeHHmm.split(':');
  const hour = Math.max(0, Math.min(23, Number(hourStr) || 19));
  const minute = Math.max(0, Math.min(59, Number(minuteStr) || 30));

  if (Capacitor.isNativePlatform()) {
    try {
      if (!enabled) {
        await LocalNotifications.cancel({
          notifications: [{ id: DAILY_REMINDER_NOTIFICATION_ID }],
        });
        return { ok: true, message: 'Lembrete diário desativado.' };
      }

      const perm = await LocalNotifications.requestPermissions();
      if (perm.display !== 'granted') {
        return {
          ok: false,
          message: 'Permita notificações nas configurações do Android para ativar lembretes.',
        };
      }

      await LocalNotifications.cancel({
        notifications: [{ id: DAILY_REMINDER_NOTIFICATION_ID }],
      });

      await LocalNotifications.schedule({
        notifications: [
          {
            id: DAILY_REMINDER_NOTIFICATION_ID,
            title: 'Hora de praticar no FluentBridge! 🎯',
            body: 'Mantenha sua ofensiva ativa hoje: 10 minutinhos fazem a diferença.',
            schedule: {
              on: { hour, minute },
              repeats: true,
              allowWhileIdle: true,
            },
          },
        ],
      });

      return {
        ok: true,
        message: `Lembrete diário agendado para ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}!`,
      };
    } catch {
      return {
        ok: false,
        message: 'Não foi possível agendar a notificação neste aparelho.',
      };
    }
  }

  // Fallback Web / PWA
  if (!enabled) {
    return { ok: true, message: 'Lembrete diário desativado.' };
  }
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const perm = await window.Notification.requestPermission();
      if (perm === 'granted') {
        return {
          ok: true,
          message: `Lembrete ativado (${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}). No celular Android ele toca mesmo com o app fechado.`,
        };
      }
    } catch {
      // Ignore browser notification permission failures
    }
  }
  return {
    ok: true,
    message: `Preferência de lembrete salva (${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}).`,
  };
}

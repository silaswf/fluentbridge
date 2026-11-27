/**
 * @file src/components/path/TrailQuickActionsBar.tsx
 * @description Barra de ações rápidas da Trilha de Aprendizado: Revisão Express 5 min, filtros por foco/tag, mérito de Streak Freeze e teste de lembrete Web.
 * @exports TrailQuickActionsBar, TrailTrackFilter
 */
import { useState } from 'react';
import { BellRing, Shield, Sparkles, Zap } from 'lucide-react';
import type { TrackTag } from '../../types/learning';
import { getWebNotificationStatus, sendTestStreakNotification } from '../../utils/notifications';

export type TrailTrackFilter = 'ALL' | Exclude<TrackTag, 'daily'>;

interface TrailQuickActionsBarProps {
  dueCount: number;
  streakFreezes: number;
  selectedTrack: TrailTrackFilter;
  schoolName?: string;
  onSelectTrack: (track: TrailTrackFilter) => void;
  onOpenExpressReview: () => void;
  onOpenSpecializedTracks?: () => void;
  onTestReminder?: () => void;
}

const TRACK_FILTERS: Array<{ id: TrailTrackFilter; label: string }> = [
  { id: 'ALL', label: 'Todos' },
  { id: 'travel', label: 'Viagem' },
  { id: 'business', label: 'Negócios' },
  { id: 'exam', label: 'Exames' },
  { id: 'career', label: 'Carreira' },
];

export function TrailQuickActionsBar({
  dueCount,
  streakFreezes,
  selectedTrack,
  schoolName,
  onSelectTrack,
  onOpenExpressReview,
  onOpenSpecializedTracks,
  onTestReminder,
}: TrailQuickActionsBarProps) {
  const [reminderFeedback, setReminderFeedback] = useState<string | null>(null);
  const clampedFreezes = Math.min(3, Math.max(0, streakFreezes));

  const handleTestReminder = () => {
    if (onTestReminder) {
      onTestReminder();
      return;
    }
    const status = getWebNotificationStatus();
    if (status === 'granted') {
      const sent = sendTestStreakNotification(schoolName);
      setReminderFeedback(sent ? 'Lembrete enviado!' : 'Não foi possível enviar.');
    } else if (status === 'denied') {
      setReminderFeedback('Notificações bloqueadas no navegador.');
    } else if (status === 'default') {
      setReminderFeedback('Permita notificações nas configurações.');
    } else {
      setReminderFeedback('Notificações Web indisponíveis.');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-2xs">
      {/* Left: Revisão Express + Track Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="express-review-btn"
          onClick={onOpenExpressReview}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-2 text-xs font-extrabold text-white shadow-2xs transition hover:brightness-105 cursor-pointer"
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Revisão Express 5 min</span>
          {dueCount > 0 && (
            <span className="ml-0.5 rounded-full bg-white/25 px-2 py-0.5 font-mono text-[10px] font-extrabold text-white">
              {dueCount}
            </span>
          )}
        </button>

        {onOpenSpecializedTracks && (
          <button
            type="button"
            data-testid="open-specialized-tracks-btn"
            onClick={onOpenSpecializedTracks}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-extrabold text-indigo-800 transition hover:bg-indigo-100 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Trilhas Pro</span>
          </button>
        )}

        <div
          data-testid="track-tag-filter-bar"
          className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1"
        >
          {TRACK_FILTERS.map((tag) => {
            const active = selectedTrack === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onSelectTrack(tag.id)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Streak Freeze Merit Badge + Test Reminder */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          data-testid="streak-freeze-merit-badge"
          title="Conquiste até 3 proteções por mérito (7 dias de ofensiva ou checkpoints)"
          className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800"
        >
          <Shield className="h-3.5 w-3.5 text-sky-600" />
          <span>{clampedFreezes}/3 Proteções</span>
          <Sparkles className="h-3 w-3 text-sky-500" />
        </span>

        <button
          type="button"
          data-testid="test-reminder-btn"
          onClick={handleTestReminder}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <BellRing className="h-3.5 w-3.5 text-indigo-600" />
          <span>{reminderFeedback ?? 'Testar Lembrete'}</span>
        </button>
      </div>
    </div>
  );
}

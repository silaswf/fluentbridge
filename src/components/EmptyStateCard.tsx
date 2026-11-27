/**
 * @file src/components/EmptyStateCard.tsx
 * @description Componente visual padrão para estados vazios com ícone, mensagem orientativa e ação opcional.
 * @exports EmptyStateCard
 */
import type { LucideIcon } from 'lucide-react';

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  testId?: string;
}

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  testId,
}: EmptyStateCardProps) {
  return (
    <div
      data-testid={testId}
      className="fb-card-primary rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xs dark:border-slate-700 dark:bg-slate-900/70"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-3 font-display text-base font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mx-auto mt-1 max-w-md text-xs text-slate-600 dark:text-slate-400">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';

interface EmptyStateCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  testId?: string;
}

export function EmptyStateCard({
  Icon,
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  testId,
}: EmptyStateCardProps) {
  return (
    <div
      data-testid={testId}
      className="fb-card-primary p-8 text-center sm:p-10"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-3 font-display text-lg font-bold text-slate-900">
        {title}
      </h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-slate-600">
        {description}
      </p>
      {(primaryLabel || secondaryLabel) && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {primaryLabel && onPrimary && (
            <button
              type="button"
              onClick={onPrimary}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              {primaryLabel}
            </button>
          )}
          {secondaryLabel && onSecondary && (
            <button
              type="button"
              onClick={onSecondary}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

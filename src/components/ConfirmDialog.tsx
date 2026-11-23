import { useEffect } from 'react';
import { AlertTriangle, HelpCircle, ShieldAlert, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  warningBox?: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  warningBox,
  confirmLabel,
  cancelLabel = 'Cancelar',
  tone = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const iconBg =
    tone === 'danger'
      ? 'bg-rose-100 text-rose-700'
      : tone === 'warning'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-blue-100 text-blue-700';

  const confirmBtn =
    tone === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 text-white'
      : tone === 'warning'
        ? 'bg-amber-600 hover:bg-amber-700 text-white'
        : 'bg-blue-600 hover:bg-blue-700 text-white';

  const Icon =
    tone === 'danger'
      ? ShieldAlert
      : tone === 'warning'
        ? AlertTriangle
        : HelpCircle;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="animate-fade-up w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="confirm-dialog-title"
                className="font-display text-lg font-extrabold text-slate-900"
              >
                {title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            aria-label="Fechar confirmação"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {warningBox && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/90 p-3.5 text-xs leading-relaxed font-medium text-amber-950">
            {warningBox}
          </div>
        )}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition cursor-pointer ${confirmBtn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

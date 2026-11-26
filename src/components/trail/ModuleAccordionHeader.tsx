import { ChevronDown, ChevronRight } from 'lucide-react';
import type { CEFRLevel } from '../../types/learning';

interface ModuleAccordionHeaderProps {
  moduleKey: string;
  level: CEFRLevel;
  moduleTitle: string;
  doneCount: number;
  totalCount: number;
  pct: number;
  isExpanded: boolean;
  isCurrentModule: boolean;
  onToggle: () => void;
}

export function ModuleAccordionHeader({
  moduleKey,
  level,
  moduleTitle,
  doneCount,
  totalCount,
  pct,
  isExpanded,
  isCurrentModule,
  onToggle,
}: ModuleAccordionHeaderProps) {
  return (
    <button
      type="button"
      data-testid="module-header-card"
      data-module-key={moduleKey}
      aria-expanded={isExpanded}
      onClick={onToggle}
      className={`w-full rounded-2xl border px-4 py-3 text-left shadow-2xs transition cursor-pointer ${
        isCurrentModule
          ? 'border-blue-300 bg-blue-50/90 hover:bg-blue-100/70 dark:border-blue-700/80 dark:bg-slate-900 dark:hover:bg-slate-800/90'
          : 'border-slate-200/90 bg-white hover:border-blue-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:hover:bg-slate-800/80'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:ring-blue-800">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-[10px] font-extrabold tracking-wider text-blue-700 dark:text-blue-300 uppercase">
                Nível {level} · Trilha Modular
              </p>
              {isCurrentModule && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-extrabold text-white uppercase">
                  Módulo Atual
                </span>
              )}
            </div>
            <h3 className="truncate font-display text-sm font-extrabold text-slate-900 dark:text-slate-100 sm:text-base">
              {moduleTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-2.5 py-0.5 font-mono text-[11px] font-bold text-blue-800 ring-1 ring-blue-200 dark:bg-slate-800 dark:text-blue-200 dark:ring-slate-700">
            {doneCount}/{totalCount} ({pct}%)
          </span>
        </div>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-200/70 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </button>
  );
}

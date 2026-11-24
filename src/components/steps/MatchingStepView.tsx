import { CheckCircle2 } from 'lucide-react';
import type { LanguageCode, MatchingPair, MatchingStep } from '../../types/learning';
import { DualAudioButtons } from '../DualAudioButtons';

interface MatchingStepViewProps {
  step: MatchingStep;
  languageCode?: LanguageCode;
  matchingColumns: {
    targets: MatchingPair[];
    pts: MatchingPair[];
  };
  matchedIds: string[];
  pickedTargetId: string | null;
  pickedPtId: string | null;
  matchErrorIds: [string, string] | null;
  onPickTarget: (id: string, targetText: string) => void;
  onPickPt: (id: string) => void;
}

export function MatchingStepView({
  step,
  languageCode,
  matchingColumns,
  matchedIds,
  pickedTargetId,
  pickedPtId,
  matchErrorIds,
  onPickTarget,
  onPickPt,
}: MatchingStepViewProps) {
  return (
    <div className="animate-fade-up rounded-3xl border border-sky-200/80 bg-white p-6 shadow-xs sm:p-7">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-slate-900">
          {step.promptPt}
        </h2>
        <span className="rounded-full bg-sky-50 px-2.5 py-0.5 font-mono text-xs font-bold text-sky-700">
          {matchedIds.length}/{step.pairs.length}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Toque em uma expressão à esquerda (com áudio) e depois no equivalente à direita.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2.5">
          {matchingColumns.targets.map((pair) => {
            const isCleared = matchedIds.includes(pair.id);
            const isPicked = pickedTargetId === pair.id;
            const isErr = matchErrorIds?.[0] === pair.id;

            return (
              <div
                key={`t-${pair.id}`}
                onClick={() => {
                  if (isCleared) return;
                  onPickTarget(pair.id, pair.target);
                }}
                role="button"
                tabIndex={isCleared ? -1 : 0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isCleared) {
                    e.preventDefault();
                    onPickTarget(pair.id, pair.target);
                  }
                }}
                data-testid="matching-target-item"
                className={`flex w-full flex-wrap items-center justify-between gap-2 rounded-2xl border p-3.5 text-left text-xs font-bold transition sm:text-sm ${
                  isCleared
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-700 opacity-70'
                    : isErr
                      ? 'animate-shake border-rose-400 bg-rose-50 text-rose-800'
                      : isPicked
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-100'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-blue-300 cursor-pointer'
                }`}
              >
                <span data-testid="matching-target-label">{pair.target}</span>
                <DualAudioButtons
                  text={pair.target}
                  languageCode={languageCode}
                  size="xs"
                />
              </div>
            );
          })}
        </div>

        <div className="space-y-2.5">
          {matchingColumns.pts.map((pair) => {
            const isCleared = matchedIds.includes(pair.id);
            const isPicked = pickedPtId === pair.id;
            const isErr = matchErrorIds?.[1] === pair.id;

            return (
              <button
                key={`p-${pair.id}`}
                type="button"
                data-testid="matching-pt-item"
                disabled={isCleared}
                onClick={() => onPickPt(pair.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-2xl border p-3.5 text-left text-xs font-semibold transition sm:text-sm ${
                  isCleared
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-700 opacity-70'
                    : isErr
                      ? 'animate-shake border-rose-400 bg-rose-50 text-rose-800'
                      : isPicked
                        ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-100'
                        : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-sky-300 cursor-pointer'
                }`}
              >
                <span>{pair.pt}</span>
                {isCleared && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import type { FillBlankStep } from '../../types/learning';

interface FillBlankStepViewProps {
  step: FillBlankStep;
  selectedOption: number | null;
  checkedStatus: 'idle' | 'correct' | 'incorrect';
  onSelectOption: (idx: number) => void;
}

export function FillBlankStepView({
  step,
  selectedOption,
  checkedStatus,
  onSelectOption,
}: FillBlankStepViewProps) {
  return (
    <div className="animate-fade-up space-y-5 rounded-3xl border border-violet-200/80 bg-white p-6 shadow-xs sm:p-7">
      <div>
        <h2 className="font-display text-lg font-bold text-slate-900">
          {step.promptPt}
        </h2>
        {step.verbHint && (
          <p className="mt-1 text-xs font-semibold text-violet-700">
            Foco gramatical: {step.verbHint}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-relaxed font-semibold text-slate-900">
        <span>{step.sentenceBefore}</span>
        <span
          className={`mx-1 inline-block rounded-xl border-2 px-3 py-0.5 font-mono text-sm font-bold ${
            checkedStatus === 'correct'
              ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
              : checkedStatus === 'incorrect'
                ? 'border-rose-400 bg-rose-100 text-rose-900'
                : selectedOption !== null
                  ? 'border-violet-500 bg-violet-100 text-violet-900'
                  : 'border-dashed border-slate-300 bg-white text-slate-400'
          }`}
        >
          {selectedOption !== null ? step.options[selectedOption] : '________'}
        </span>
        <span>{step.sentenceAfter}</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {step.options.map((opt, idx) => {
          const isPicked = selectedOption === idx;
          const isRight = idx === step.correctIndex;
          let style =
            'border-slate-200 bg-white hover:border-violet-400 hover:bg-violet-50/50';
          if (checkedStatus === 'idle' && isPicked) {
            style = 'border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-200';
          } else if (checkedStatus !== 'idle') {
            if (isRight) {
              style = 'border-emerald-500 bg-emerald-50 text-emerald-950';
            } else if (isPicked && !isRight) {
              style = 'border-rose-400 bg-rose-50 text-rose-900 animate-shake';
            }
          }
          return (
            <button
              key={idx}
              type="button"
              disabled={checkedStatus !== 'idle'}
              onClick={() => onSelectOption(idx)}
              className={`rounded-2xl border p-3.5 text-center font-mono text-sm font-bold transition cursor-pointer disabled:cursor-default ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

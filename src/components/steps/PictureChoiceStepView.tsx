/**
 * @file src/components/steps/PictureChoiceStepView.tsx
 * @description Renderiza etapa interativa Picture Choice (grade 2x2 com 4 cards ilustrados, atalhos 1-4 e áudio).
 * @exports PictureChoiceStepView
 */
import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Image as ImageIcon, XCircle } from 'lucide-react';
import type { LanguageCode, PictureChoiceStep } from '../../types/learning';
import { ConceptIllustration } from '../ConceptIllustration';
import { DualAudioButtons } from '../DualAudioButtons';

interface PictureChoiceStepViewProps {
  step: PictureChoiceStep;
  languageCode?: LanguageCode;
  onComplete: (isCorrect: boolean) => void;
}

export function PictureChoiceStepView({
  step,
  languageCode = 'en',
  onComplete,
}: PictureChoiceStepViewProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const options = step.options.slice(0, 4);
  const answered = selectedIndex !== null;
  const isCorrect = answered && selectedIndex === step.correctIndex;

  useEffect(() => {
    setSelectedIndex(null);
  }, [step.id]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (selectedIndex !== null || idx < 0 || idx >= options.length) return;
      setSelectedIndex(idx);
      onComplete(idx === step.correctIndex);
    },
    [selectedIndex, options.length, step.correctIndex, onComplete],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      if (selectedIndex !== null) return;
      if (e.key >= '1' && e.key <= '4') {
        const idx = Number(e.key) - 1;
        if (idx < options.length) {
          e.preventDefault();
          handleSelect(idx);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, options.length, handleSelect]);

  return (
    <div
      data-testid="picture-choice-step"
      className="animate-fade-up rounded-3xl border border-indigo-200/80 bg-white p-6 shadow-xs dark:border-slate-700 dark:bg-slate-900 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-200">
          <ImageIcon className="h-3.5 w-3.5" />
          {step.stageLabelPt || 'Associação Visual · Escolha a Imagem'}
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          Atalho: teclas 1–4
        </span>
      </div>

      <h2 className="mt-3 font-display text-xl font-extrabold text-slate-900 dark:text-slate-100">
        {step.promptPt}
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
        <span className="font-display text-lg font-extrabold text-indigo-700 dark:text-indigo-300">
          {step.targetWord}
        </span>
        <DualAudioButtons
          text={step.audioText}
          languageCode={languageCode}
          showSpeedToggle
          size="md"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3.5">
        {options.map((opt, idx) => {
          const isThisSelected = selectedIndex === idx;
          const isThisCorrect = idx === step.correctIndex;

          let cardClass =
            'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-indigo-500';
          if (answered) {
            if (isThisCorrect) {
              cardClass =
                'border-emerald-400 bg-emerald-50/70 ring-2 ring-emerald-200 dark:border-emerald-500 dark:bg-emerald-950/40 dark:ring-emerald-800';
            } else if (isThisSelected) {
              cardClass =
                'border-rose-400 bg-rose-50/70 ring-2 ring-rose-200 dark:border-rose-500 dark:bg-rose-950/40 dark:ring-rose-800';
            } else {
              cardClass =
                'border-slate-200 bg-slate-50/50 opacity-65 dark:border-slate-800 dark:bg-slate-900/50';
            }
          }

          return (
            <button
              key={`${opt.conceptId}-${idx}`}
              type="button"
              disabled={answered}
              onClick={() => handleSelect(idx)}
              className={`relative flex flex-col items-center gap-2.5 rounded-2xl border p-4 text-center transition cursor-pointer disabled:cursor-default ${cardClass}`}
            >
              <span className="absolute top-2.5 left-2.5 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-extrabold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                {idx + 1}
              </span>

              <ConceptIllustration
                conceptId={opt.conceptId}
                imageUrl={opt.imageUrl}
                alt={opt.label}
                size="lg"
              />

              <span className="font-display text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {opt.label}
              </span>

              {answered && (
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {opt.translationPt}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`mt-4 flex items-start gap-2.5 rounded-2xl border p-4 text-sm ${
            isCorrect
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
              : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          )}
          <div>
            <p className="font-bold">
              {isCorrect ? 'Excelente! Associação correta.' : 'Quase lá! Veja a associação correta destacada.'}
            </p>
            <p className="mt-0.5 text-xs opacity-90">{step.explanationPt}</p>
          </div>
        </div>
      )}
    </div>
  );
}

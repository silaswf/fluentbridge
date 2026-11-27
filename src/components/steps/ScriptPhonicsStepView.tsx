/**
 * @file src/components/steps/ScriptPhonicsStepView.tsx
 * @description Renderiza etapa introdutória de alfabeto/escrita (script_phonics) nas unidades A1 de idiomas não-latinos.
 * @exports ScriptPhonicsStepView
 */
import { useState } from 'react';
import { CheckCircle2, PenTool, Sparkles, Volume2, XCircle } from 'lucide-react';
import type { ScriptCharacterItem } from '../../data/scriptTrainerData';
import type { ScriptPhonicsChar, ScriptPhonicsStep } from '../../types/learning';
import { speakText } from '../../utils/speech';
import { ScriptStrokeTrainer } from '../ScriptStrokeTrainer';

interface ScriptPhonicsStepViewProps {
  step: ScriptPhonicsStep;
  dialectCode: string;
  quizAnswerIdx: number | null;
  checkedStatus: 'idle' | 'correct' | 'incorrect';
  onSelectQuizOption: (idx: number) => void;
  onCheckQuiz: () => void;
}

export function ScriptPhonicsStepView({
  step,
  dialectCode,
  quizAnswerIdx,
  checkedStatus,
  onSelectQuizOption,
  onCheckQuiz,
}: ScriptPhonicsStepViewProps) {
  const [traceChar, setTraceChar] = useState<ScriptPhonicsChar | null>(null);

  return (
    <div
      data-testid="script-phonics-step"
      className="animate-fade-up space-y-5 rounded-3xl border border-violet-200 bg-white p-6 shadow-xs sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-800">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{step.stageLabelPt ?? 'Letras & Sons'}</span>
        </span>
      </div>

      <div>
        <h2 className="font-display text-lg font-extrabold text-slate-900 sm:text-xl">
          {step.categoryTitlePt}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{step.introPt}</p>
      </div>

      <div
        dir={step.languageCode === 'ar' ? 'rtl' : 'ltr'}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {step.items.map((item) => {
          const isTracing = traceChar?.char === item.char;
          const audioSample = item.exampleWord.split('(')[0].trim() || item.char;
          return (
            <div
              key={item.char}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-200 bg-white font-display text-2xl font-extrabold text-slate-900 shadow-2xs">
                    {item.char}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-violet-700">
                        {item.reading}
                      </span>
                      {item.jlptLevel && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-900">
                          {item.jlptLevel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {item.meaningPt}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Ex.: <strong>{item.exampleWord}</strong> — {item.examplePt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      void speakText(audioSample, {
                        langCode: dialectCode,
                        rate: 0.85,
                      })
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-violet-200 bg-white text-violet-700 hover:bg-violet-50 cursor-pointer"
                    title="Ouvir som"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  {item.strokeHints && item.strokeHints.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setTraceChar(isTracing ? null : item)
                      }
                      className={`inline-flex h-8 items-center gap-1 rounded-xl border px-2.5 text-[11px] font-bold cursor-pointer ${
                        isTracing
                          ? 'border-violet-600 bg-violet-600 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <PenTool className="h-3 w-3" />
                      <span>Traçar</span>
                    </button>
                  )}
                </div>
              </div>

              {item.forms && (
                <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-slate-200 bg-white p-2 text-center text-xs">
                  <div>
                    <span className="block text-[9px] font-semibold text-slate-400">
                      Isolada
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {item.forms.isolated}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-semibold text-slate-400">
                      Inicial
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {item.forms.initial}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-semibold text-slate-400">
                      Medial
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {item.forms.medial}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-semibold text-slate-400">
                      Final
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {item.forms.final}
                    </span>
                  </div>
                </div>
              )}

              {item.cursiveNote && (
                <p className="rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900">
                  {item.cursiveNote}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {traceChar && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/40 p-4">
          <ScriptStrokeTrainer
            languageCode={step.languageCode}
            initialChars={[
              {
                ...traceChar,
                strokes: traceChar.strokes ?? 2,
                strokeHints: traceChar.strokeHints ?? ['Siga a direção natural dos traços'],
              } satisfies ScriptCharacterItem,
            ]}
            compact
          />
        </div>
      )}

      {/* Sound Recognition Mini-Drill */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Checagem Rápida · Som &amp; Caractere
          </p>
          <button
            type="button"
            onClick={() =>
              void speakText(step.soundQuiz.audioText, {
                langCode: dialectCode,
                rate: 0.85,
              })
            }
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-violet-700 cursor-pointer"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>Ouvir som-alvo</span>
          </button>
        </div>
        <p className="text-sm font-semibold text-slate-900">
          {step.soundQuiz.promptPt}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {step.soundQuiz.options.map((opt, idx) => {
            const picked = quizAnswerIdx === idx;
            const isCorrect = idx === step.soundQuiz.correctIndex;
            return (
              <button
                key={`${opt.char}-${idx}`}
                type="button"
                disabled={checkedStatus !== 'idle'}
                onClick={() => onSelectQuizOption(idx)}
                className={`flex flex-col items-center justify-center rounded-2xl border p-3 transition cursor-pointer ${
                  checkedStatus !== 'idle'
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : picked
                        ? 'border-rose-400 bg-rose-50 text-rose-900'
                        : 'border-slate-200 bg-white text-slate-500'
                    : picked
                      ? 'border-violet-600 bg-violet-50 text-violet-950 ring-2 ring-violet-200'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-violet-300'
                }`}
              >
                <span className="font-display text-2xl font-extrabold">
                  {opt.char}
                </span>
                <span className="mt-0.5 font-mono text-[10px] text-slate-500">
                  {opt.reading}
                </span>
              </button>
            );
          })}
        </div>

        {checkedStatus === 'idle' ? (
          <button
            type="button"
            disabled={quizAnswerIdx === null}
            onClick={onCheckQuiz}
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
          >
            Verificar som
          </button>
        ) : (
          <div
            className={`flex items-start gap-2 rounded-xl border p-3 text-xs ${
              checkedStatus === 'correct'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                : 'border-rose-200 bg-rose-50 text-rose-950'
            }`}
          >
            {checkedStatus === 'correct' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            )}
            <p className="font-semibold">{step.soundQuiz.explanationPt}</p>
          </div>
        )}
      </div>
    </div>
  );
}

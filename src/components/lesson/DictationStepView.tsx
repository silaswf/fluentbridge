/**
 * @file src/components/lesson/DictationStepView.tsx
 * @description Subcomponente do LessonPlayer para etapa de Ditado (dictation) com seletor de velocidade (0.75x/1.0x/1.15x) e diff visual palavra-por-palavra.
 * @exports DictationStepView
 */
import { useState } from 'react';
import type { CEFRLevel, DictationStep, LanguageCode } from '../../types/learning';
import { getImmersionStrings } from '../../utils/immersion';
import { evaluatePronunciation, speakText } from '../../utils/speech';
import { DualAudioButtons } from '../DualAudioButtons';

export interface DictationStepViewProps {
  step: DictationStep;
  languageCode?: LanguageCode;
  level?: CEFRLevel;
  checkedStatus: 'idle' | 'correct' | 'incorrect';
  dictationText: string;
  onChangeDictationText: (text: string) => void;
}

const SPEED_OPTIONS = [0.75, 1, 1.15] as const;

export function DictationStepView({
  step,
  languageCode = 'en',
  level,
  checkedStatus,
  dictationText,
  onChangeDictationText,
}: DictationStepViewProps) {
  const [playbackSpeed, setPlaybackSpeed] = useState<0.75 | 1 | 1.15>(1);
  const imm = getImmersionStrings(languageCode, level);
  const evalResult =
    checkedStatus !== 'idle'
      ? evaluatePronunciation(step.audioText, dictationText)
      : null;

  return (
    <div className="animate-fade-up space-y-5 rounded-3xl border border-indigo-200/80 bg-white p-6 shadow-xs sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            {step.promptPt}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Ouça na velocidade desejada e digite exatamente o que foi dito.
          </p>
        </div>

        <div
          data-testid="dictation-speed-selector"
          className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50/70 p-1"
        >
          {SPEED_OPTIONS.map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => setPlaybackSpeed(spd)}
              className={`rounded-lg px-2 py-1 font-mono text-[11px] font-bold transition cursor-pointer ${
                playbackSpeed === spd
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              {spd === 1 ? '1.0x' : `${spd}x`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
        <DualAudioButtons
          text={step.audioText}
          languageCode={languageCode}
          rateMultiplier={playbackSpeed}
          showSlow
          showSpeedToggle
          size="md"
        />
        <span className="text-xs font-semibold text-indigo-800">
          Atalho: pressione R para repetir
        </span>
      </div>

      <textarea
        rows={3}
        disabled={checkedStatus !== 'idle'}
        value={dictationText}
        onChange={(e) => onChangeDictationText(e.target.value)}
        placeholder={imm.dictationPlaceholder}
        className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
      />

      {evalResult && (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-800">
              Comparação palavra por palavra ({evalResult.score}% precisão):
            </p>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-indigo-800">
              {evalResult.words.filter((w) => w.matched).length}/{evalResult.words.length} palavras
            </span>
          </div>

          <div
            data-testid="dictation-word-diff"
            className="flex flex-wrap gap-1.5"
          >
            {evalResult.words.map((w, idx) => (
              <button
                key={`${w.word}-${idx}`}
                type="button"
                onClick={() => speakText(w.word, { langCode: languageCode, rate: 0.85 })}
                title={
                  w.matched
                    ? 'Palavra correta (clique para ouvir)'
                    : 'Palavra ausente ou diferente (clique para ouvir)'
                }
                className={`rounded-lg px-2 py-1 text-xs font-bold transition cursor-pointer ${
                  w.matched
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-rose-100 text-rose-800 ring-1 ring-rose-300 underline decoration-rose-400 hover:bg-rose-200'
                }`}
              >
                {w.word}
              </button>
            ))}
          </div>

          <p className="font-display text-sm font-extrabold text-slate-900">
            “{step.audioText}”
          </p>
          <p className="text-slate-600">{step.translationPt}</p>
        </div>
      )}
    </div>
  );
}

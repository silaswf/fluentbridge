import { Eye, EyeOff, Volume2 } from 'lucide-react';
import type {
  DictationStep,
  LanguageCode,
  MinimalPairsStep,
  StoryStep,
} from '../../types/learning';
import { getImmersionStrings } from '../../utils/immersion';
import { evaluatePronunciation } from '../../utils/speech';
import { DualAudioButtons } from '../DualAudioButtons';

interface Phase8StepsViewProps {
  currentStep: DictationStep | MinimalPairsStep | StoryStep;
  languageCode?: LanguageCode;
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  checkedStatus: 'idle' | 'correct' | 'incorrect';
  dictationText: string;
  setDictationText: (text: string) => void;
  selectedOption: number | null;
  setSelectedOption: (idx: number) => void;
  storyShowTranslations: boolean;
  setStoryShowTranslations: (fn: (prev: boolean) => boolean) => void;
  storyActiveLine: number | null;
  playStoryLineAt: (lines: StoryStep['lines'], idx: number, autoAdvance: boolean) => void;
}

export function Phase8StepsView({
  currentStep,
  languageCode,
  level,
  checkedStatus,
  dictationText,
  setDictationText,
  selectedOption,
  setSelectedOption,
  storyShowTranslations,
  setStoryShowTranslations,
  storyActiveLine,
  playStoryLineAt,
}: Phase8StepsViewProps) {
  const imm = getImmersionStrings(languageCode ?? 'en', level);
  if (currentStep.type === 'dictation') {
    return (
      <div className="animate-fade-up space-y-5 rounded-3xl border border-indigo-200/80 bg-white p-6 shadow-xs sm:p-7">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            {currentStep.promptPt}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Ouça em velocidade normal ou 0.75x e digite exatamente o que foi dito.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
          <DualAudioButtons
            text={currentStep.audioText}
            languageCode={languageCode}
            showSlow
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
          onChange={(e) => setDictationText(e.target.value)}
          placeholder={imm.dictationPlaceholder}
          className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
        />

        {checkedStatus !== 'idle' && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
            <p className="font-bold text-slate-800">
              Frase exata ({evaluatePronunciation(currentStep.audioText, dictationText).score}% precisão):
            </p>
            <p className="font-display text-sm font-extrabold text-slate-900">
              “{currentStep.audioText}”
            </p>
            <p className="text-slate-600">{currentStep.translationPt}</p>
          </div>
        )}
      </div>
    );
  }

  if (currentStep.type === 'minimal_pairs') {
    return (
      <div className="animate-fade-up space-y-5 rounded-3xl border border-rose-200/80 bg-white p-6 shadow-xs sm:p-7">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            {currentStep.promptPt}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Ouça a palavra com atenção e identifique qual som foi pronunciado (contraste fonético).
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
          <DualAudioButtons
            text={currentStep.targetWord}
            languageCode={languageCode}
            showSlow
            size="md"
          />
          <span className="font-mono text-xs font-bold text-rose-800">
            {currentStep.targetIpa} vs {currentStep.contrastIpa}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {currentStep.options.map((opt, idx) => {
            const isPicked = selectedOption === idx;
            const isRight = idx === currentStep.correctIndex;
            let style =
              'border-slate-200 bg-white hover:border-rose-400 hover:bg-rose-50/50';
            if (checkedStatus === 'idle' && isPicked) {
              style = 'border-rose-600 bg-rose-50 text-rose-950 ring-2 ring-rose-200';
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
                onClick={() => setSelectedOption(idx)}
                className={`rounded-2xl border p-4 text-left transition cursor-pointer disabled:cursor-default ${style}`}
              >
                <p className="font-display text-base font-extrabold text-slate-900">
                  {opt.word}
                </p>
                <p className="mt-0.5 font-mono text-xs text-slate-500">{opt.ipa}</p>
                <p className="mt-1 text-xs font-semibold text-slate-600">
                  {opt.meaningPt}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-5 rounded-3xl border border-sky-200/80 bg-white p-6 shadow-xs sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-extrabold text-slate-900">
            {currentStep.title}
          </h2>
          <p className="mt-1 text-xs text-slate-600">{currentStep.settingPt}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => playStoryLineAt(currentStep.lines, 0, true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>Ouvir diálogo completo</span>
          </button>
          <button
            type="button"
            onClick={() => setStoryShowTranslations((v) => !v)}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {storyShowTranslations ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            <span>{storyShowTranslations ? 'Ocultar PT' : 'Traduzir PT'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        {currentStep.lines.map((line, lIdx) => {
          const isActive = storyActiveLine === lIdx;
          return (
            <div
              key={lIdx}
              onClick={() => playStoryLineAt(currentStep.lines, lIdx, false)}
              className={`rounded-xl border p-3 transition cursor-pointer ${
                isActive
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold text-blue-700 uppercase">
                  {line.speaker} · {line.voice === 'male' ? 'Voz Masculina' : 'Voz Feminina'}
                </span>
                <Volume2 className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {line.text}
              </p>
              {storyShowTranslations && (
                <p className="mt-1 text-xs text-slate-600">{line.translationPt}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-bold text-slate-900">{currentStep.question}</p>
        <div className="space-y-2">
          {currentStep.options.map((opt, idx) => {
            const isPicked = selectedOption === idx;
            const isRight = idx === currentStep.correctIndex;
            let style =
              'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50';
            if (checkedStatus === 'idle' && isPicked) {
              style = 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200';
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
                onClick={() => setSelectedOption(idx)}
                className={`w-full rounded-2xl border p-3.5 text-left text-xs font-semibold transition sm:text-sm cursor-pointer disabled:cursor-default ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

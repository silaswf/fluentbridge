/**
 * @file src/components/steps/ReadingStepView.tsx
 * @description Renderiza etapa de leitura guiada (reading) com glossário clicável palavra a palavra e compreensão textual.
 * @exports ReadingStepView
 */
import { BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import type { GlossWord, LanguageCode, ReadingStep } from '../../types/learning';
import { DualAudioButtons } from '../DualAudioButtons';

interface ReadingStepViewProps {
  step: ReadingStep;
  languageCode?: LanguageCode;
  displayText: string;
  formatLabel: string;
  selectedGloss: GlossWord | null;
  onSelectGloss: (g: GlossWord) => void;
  renderPassage: (
    text: string,
    glossary: GlossWord[],
    selectedWord: GlossWord | null,
    onSelectWord: (word: GlossWord) => void,
  ) => React.ReactNode;
  selectedOption: number | null;
  setSelectedOption: (idx: number) => void;
  checkedStatus: 'idle' | 'correct' | 'incorrect';
  rateMultiplier?: number;
  unitVocabInUseNode?: React.ReactNode;
}

export function ReadingStepView({
  step,
  languageCode,
  displayText,
  formatLabel,
  selectedGloss,
  onSelectGloss,
  renderPassage,
  selectedOption,
  setSelectedOption,
  checkedStatus,
  rateMultiplier = 1,
  unitVocabInUseNode,
}: ReadingStepViewProps) {
  return (
    <div className="animate-fade-up space-y-5">
      <div className="rounded-3xl border border-teal-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-teal-700 uppercase">
              {formatLabel}
            </span>
            <h2 className="font-display text-lg font-bold text-slate-900">
              {step.title}
            </h2>
          </div>
          <DualAudioButtons
            text={step.text}
            languageCode={languageCode}
            size="xs"
            rateMultiplier={rateMultiplier}
          />
        </div>

        <div
          data-testid="reading-passage-box"
          className="reading-passage-box mt-4 rounded-2xl border p-4 text-sm"
        >
          {renderPassage(displayText, step.glossary, selectedGloss, onSelectGloss)}
        </div>

        <div className="mt-3">
          {selectedGloss ? (
            <div className="animate-fade-up flex items-center justify-between gap-3 rounded-2xl border border-teal-300 bg-teal-50 p-3.5">
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-extrabold text-teal-950">
                    {selectedGloss.word}
                  </span>
                  {selectedGloss.ipa && (
                    <span className="font-mono text-xs text-teal-700">
                      {selectedGloss.ipa}
                    </span>
                  )}
                  <span className="text-xs font-bold text-teal-900">
                    → {selectedGloss.translation}
                  </span>
                </div>
                {selectedGloss.note && (
                  <p className="text-xs text-teal-800">{selectedGloss.note}</p>
                )}
              </div>
              <DualAudioButtons
                text={selectedGloss.word}
                languageCode={languageCode}
                size="xs"
                rateMultiplier={rateMultiplier}
              />
            </div>
          ) : (
            step.glossary.length > 0 && (
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <BookOpen className="h-3.5 w-3.5 text-teal-600" />
                Toque nas palavras sublinhadas acima para ver tradução, IPA e dica do professor.
              </p>
            )
          )}
        </div>

        {unitVocabInUseNode}
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="font-display text-base font-bold text-slate-900">
          {step.question}
        </h3>
        <div className="mt-3.5 space-y-2.5">
          {step.options.map((opt, i) => {
            const isPicked = selectedOption === i;
            const isRight = i === step.correctIndex;
            let cardStyle =
              'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/40';
            if (checkedStatus === 'idle' && isPicked) {
              cardStyle = 'border-teal-600 bg-teal-50 ring-2 ring-teal-200';
            } else if (checkedStatus !== 'idle') {
              if (isRight) {
                cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950';
              } else if (isPicked && !isRight) {
                cardStyle = 'border-rose-400 bg-rose-50 text-rose-950 animate-shake';
              }
            }

            return (
              <button
                key={i}
                type="button"
                disabled={checkedStatus !== 'idle'}
                onClick={() => setSelectedOption(i)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left text-sm font-medium transition cursor-pointer disabled:cursor-default ${cardStyle}`}
              >
                <span>{opt}</span>
                {checkedStatus !== 'idle' && isRight && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                )}
                {checkedStatus !== 'idle' && isPicked && !isRight && (
                  <XCircle className="h-5 w-5 shrink-0 text-rose-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

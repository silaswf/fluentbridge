import { useEffect, useState } from 'react';
import { CheckCircle2, HelpCircle, Send, Sparkles } from 'lucide-react';
import type { LanguageCode, WritingFreeStep } from '../../types/learning';
import {
  analyzeWritingLineByLine,
  type WritingLineFeedback,
} from '../../utils/writingDiffGrader';
import { DualAudioButtons } from '../DualAudioButtons';

interface WritingFreeStepViewProps {
  step: WritingFreeStep;
  languageCode?: LanguageCode;
  freeText: string;
  setFreeText: (val: string) => void;
  freeWordCount: number;
  hasLinkedTeacher: boolean;
  submittedToTeacher: boolean;
  onSendToTeacher: () => void;
  onRequestTeacherLink?: () => void;
  showModelAnswer: boolean;
  onToggleModelAnswer: () => void;
  onSaveMistakesToBank?: (
    items: Array<{
      prompt: string;
      studentAnswer: string;
      expectedAnswer: string;
      explanation: string;
    }>,
  ) => void;
}

export function WritingFreeStepView({
  step,
  languageCode = 'en',
  freeText,
  setFreeText,
  freeWordCount,
  hasLinkedTeacher,
  submittedToTeacher,
  onSendToTeacher,
  onRequestTeacherLink,
  showModelAnswer,
  onToggleModelAnswer,
  onSaveMistakesToBank,
}: WritingFreeStepViewProps) {
  const [diffFeedback, setDiffFeedback] = useState<WritingLineFeedback | null>(null);
  const [savedMistakes, setSavedMistakes] = useState(false);

  useEffect(() => {
    setDiffFeedback(null);
    setSavedMistakes(false);
  }, [step.id]);

  return (
    <div className="animate-fade-up space-y-4 rounded-3xl border border-amber-200/80 bg-white p-6 shadow-xs sm:p-7">
      <div>
        <h2 className="font-display text-lg font-bold text-slate-900">
          {step.promptPt}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{step.scenarioPt}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Checklist automático em tempo real</span>
          <span
            className={`font-mono ${
              freeWordCount >= step.minWords ? 'text-emerald-600' : 'text-slate-500'
            }`}
          >
            {freeWordCount} / {step.minWords} palavras mín.
          </span>
        </div>
        <ul className="mt-2.5 space-y-1.5">
          {step.checklist.map((item, idx) => {
            const lower = freeText.toLowerCase();
            const passed = item.keywords.some((kw) =>
              lower.includes(kw.toLowerCase()),
            );
            return (
              <li
                key={idx}
                className={`flex items-center gap-2 text-xs font-medium transition ${
                  passed ? 'text-emerald-700' : 'text-slate-500'
                }`}
              >
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 ${
                    passed ? 'text-emerald-500' : 'text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <textarea
        rows={4}
        value={freeText}
        onChange={(e) => setFreeText(e.target.value)}
        placeholder="Escreva sua resposta no idioma da lição..."
        className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {hasLinkedTeacher ? (
            <button
              type="button"
              disabled={freeWordCount < 3}
              onClick={onSendToTeacher}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>
                {submittedToTeacher
                  ? 'Enviado para o Professor!'
                  : 'Enviar resposta para o Professor corrigir'}
              </span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-[11px] text-amber-950">
              <span className="font-semibold">
                Correção docente restrita sem professor vinculado.
              </span>
              {onRequestTeacherLink && (
                <button
                  type="button"
                  onClick={onRequestTeacherLink}
                  className="rounded-lg bg-amber-600 px-2.5 py-1 font-bold text-white hover:bg-amber-700 cursor-pointer"
                >
                  Vincular professor
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            data-testid="analyze-writing-diff-btn"
            disabled={freeText.trim().length < 3}
            onClick={() => {
              const feedback = analyzeWritingLineByLine(
                freeText,
                step.modelAnswer,
                step.checklist,
                languageCode,
              );
              setDiffFeedback(feedback);
              setSavedMistakes(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2.5 text-xs font-bold text-indigo-800 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Analisar Gramática &amp; Diff</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleModelAnswer}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>{showModelAnswer ? 'Ocultar exemplo' : 'Ver resposta modelo'}</span>
        </button>
      </div>

      {diffFeedback && (
        <div
          data-testid="writing-diff-panel"
          className="animate-fade-up space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 text-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-indigo-950">
              Análise Linha a Linha (Score estimado: {diffFeedback.score}%)
            </span>
            {onSaveMistakesToBank && diffFeedback.mistakeItems.length > 0 && (
              <button
                type="button"
                disabled={savedMistakes}
                onClick={() => {
                  onSaveMistakesToBank(diffFeedback.mistakeItems);
                  setSavedMistakes(true);
                }}
                className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700 disabled:bg-emerald-600 cursor-pointer"
              >
                {savedMistakes
                  ? 'Salvo no Caderno de Erros!'
                  : `Salvar ${diffFeedback.mistakeItems.length} ajuste(s) no Caderno`}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1 rounded-xl border border-indigo-100 bg-white p-3 leading-relaxed">
            {diffFeedback.diffTokens.map((tok, i) => (
              <span
                key={i}
                className={
                  tok.type === 'keep'
                    ? 'text-slate-800'
                    : tok.type === 'remove'
                      ? 'rounded bg-rose-100 px-1 text-rose-800 line-through'
                      : 'rounded bg-emerald-100 px-1 font-bold text-emerald-800'
                }
              >
                {tok.text}
              </span>
            ))}
          </div>

          <ul className="space-y-1 text-indigo-950">
            {diffFeedback.suggestionsPt.map((sug, i) => (
              <li key={i}>• {sug}</li>
            ))}
          </ul>
        </div>
      )}

      {showModelAnswer && (
        <div className="animate-fade-up flex flex-col justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-bold text-blue-800 uppercase">
              Resposta modelo do professor
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">
              “{step.modelAnswer}”
            </p>
          </div>
          <DualAudioButtons
            text={step.modelAnswer}
            languageCode={languageCode}
            size="xs"
          />
        </div>
      )}
    </div>
  );
}

/**
 * @file src/components/ExpressReviewModal.tsx
 * @description Modal de Revisão Express (5 minutos): combina até 5 flashcards pendentes/fracos, até 2 erros do caderno e 1 recap rápido de pronúncia/leitura.
 * @exports ExpressReviewModal
 */
import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpenCheck,
  CheckCircle2,
  Eye,
  Flame,
  Mic,
  Sparkles,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import type { LanguageCode, MistakeEntry, VocabCard } from '../types/learning';
import { isCardDue, sortCardsForReview, type SrsRating } from '../utils/srsEngine';
import { DualAudioButtons } from './DualAudioButtons';

export interface ExpressReviewModalProps {
  vocab: VocabCard[];
  mistakes?: MistakeEntry[];
  languageCode?: LanguageCode;
  preferredAccent?: string;
  onRateCard: (cardId: string, rating: SrsRating) => void;
  onResolveMistake?: (mistakeId: string, resolved: boolean) => void;
  onCompleteExpressReview: (xpEarned: number) => void;
  onClose: () => void;
}

type ExpressStep =
  | { kind: 'vocab'; card: VocabCard }
  | { kind: 'mistake'; mistake: MistakeEntry }
  | { kind: 'recap'; sentence: string; translationPt: string; tipPt: string };

const RATING_BUTTONS: Array<{
  rating: SrsRating;
  label: string;
  className: string;
}> = [
  { rating: 'again', label: 'Errei', className: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100' },
  { rating: 'hard', label: 'Difícil', className: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100' },
  { rating: 'good', label: 'Bom', className: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' },
  { rating: 'easy', label: 'Fácil', className: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
];

export function ExpressReviewModal({
  vocab,
  mistakes = [],
  languageCode = 'en',
  preferredAccent,
  onRateCard,
  onResolveMistake,
  onCompleteExpressReview,
  onClose,
}: ExpressReviewModalProps) {
  const steps = useMemo<ExpressStep[]>(() => {
    const langVocab = vocab.filter((c) => !c.languageCode || c.languageCode === languageCode);
    const dueOrWeak = sortCardsForReview(
      langVocab.filter((c) => isCardDue(c) || c.strength === 'weak'),
    );
    const pickedVocab = (dueOrWeak.length > 0 ? dueOrWeak : sortCardsForReview(langVocab)).slice(0, 5);

    const unresolvedMistakes = mistakes
      .filter((m) => !m.resolved && m.languageCode === languageCode)
      .slice(0, 2);

    const recapCard = pickedVocab[0];
    const recapStep: ExpressStep = {
      kind: 'recap',
      sentence: recapCard?.exampleEn || 'Practice makes progress every single day.',
      translationPt:
        recapCard?.examplePt || 'A prática gera progresso todos os dias.',
      tipPt: 'Leia em voz alta acompanhando o áudio lento (0.75x) e depois no ritmo natural.',
    };

    return [
      ...pickedVocab.map((card): ExpressStep => ({ kind: 'vocab', card })),
      ...unresolvedMistakes.map((mistake): ExpressStep => ({ kind: 'mistake', mistake })),
      recapStep,
    ];
  }, [vocab, mistakes, languageCode]);

  const [stepIdx, setStepIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [recapChecked, setRecapChecked] = useState(false);
  const [finished, setFinished] = useState(false);

  const totalSteps = Math.max(1, steps.length);
  const currentStep = steps[stepIdx];
  const progressPct = finished
    ? 100
    : Math.round(((stepIdx + (revealed || recapChecked ? 0.5 : 0)) / totalSteps) * 100);

  const advanceOrFinish = () => {
    setRevealed(false);
    setRecapChecked(false);
    if (stepIdx + 1 >= steps.length) {
      setFinished(true);
      onCompleteExpressReview(35);
    } else {
      setStepIdx((i) => i + 1);
    }
  };

  return (
    <div
      data-testid="express-review-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Revisão Express 5 Minutos"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header & Progress Bar */}
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Zap className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-base font-extrabold text-slate-900">
                  Revisão Express · 5 min
                </h2>
                <p className="text-[11px] font-medium text-slate-500">
                  {finished
                    ? 'Micro-sessão concluída!'
                    : `Etapa ${stepIdx + 1} de ${totalSteps}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar Revisão Express"
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-blue-600 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, progressPct))}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {finished ? (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold text-slate-900">
                Revisão Express concluída!
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Você manteve seu ritmo em apenas 5 minutos e garantiu{' '}
                <strong className="text-emerald-700">+35 XP</strong>.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>Ofensiva protegida e memória reforçada!</span>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  Voltar para a Trilha
                </button>
              </div>
            </div>
          ) : currentStep?.kind === 'vocab' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Flashcard SRS · {currentStep.card.category}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Força: {currentStep.card.strength}
                </span>
              </div>

              {/* Concept Illustration + Word */}
              <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-center">
                {currentStep.card.imageUrl ? (
                  <img
                    src={currentStep.card.imageUrl}
                    alt={currentStep.card.word}
                    className="mb-3 h-20 w-20 rounded-2xl object-cover shadow-xs"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 shadow-2xs"
                  >
                    <BookOpenCheck className="h-7 w-7" />
                  </div>
                )}

                <h3 className="font-display text-2xl font-extrabold text-slate-900">
                  {currentStep.card.word}
                </h3>
                {currentStep.card.ipa && (
                  <p className="mt-0.5 font-mono text-xs text-slate-500">
                    {currentStep.card.ipa}
                  </p>
                )}

                <div className="mt-3">
                  <DualAudioButtons
                    text={currentStep.card.word}
                    languageCode={currentStep.card.languageCode ?? languageCode}
                    preferredAccent={preferredAccent}
                    showSlow
                    size="sm"
                  />
                </div>
              </div>

              {!revealed ? (
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  <span>Revelar tradução e exemplo</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <p className="text-sm font-extrabold text-emerald-950">
                      {currentStep.card.translation}
                    </p>
                    <p className="mt-1.5 text-xs font-medium text-slate-700">
                      “{currentStep.card.exampleEn}”
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {currentStep.card.examplePt}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-center text-[11px] font-bold text-slate-500">
                      Como foi sua lembrança?
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {RATING_BUTTONS.map((btn) => (
                        <button
                          key={btn.rating}
                          type="button"
                          onClick={() => {
                            onRateCard(currentStep.card.id, btn.rating);
                            advanceOrFinish();
                          }}
                          className={`rounded-xl border px-2 py-2.5 text-xs font-extrabold transition cursor-pointer ${btn.className}`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : currentStep?.kind === 'mistake' ? (
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-700">
                <AlertCircle className="h-3.5 w-3.5" />
                Caderno de Erros · {currentStep.mistake.topicTitle}
              </span>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
                <p className="text-sm font-bold text-slate-900">
                  {currentStep.mistake.prompt}
                </p>
                <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  <span className="font-bold">Sua resposta: </span>
                  <span className="line-through">{currentStep.mistake.studentAnswer}</span>
                </div>
                <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
                  <span className="font-bold">Forma esperada: </span>
                  <span className="font-semibold">{currentStep.mistake.expectedAnswer}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  {currentStep.mistake.explanation}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {onResolveMistake && (
                  <button
                    type="button"
                    onClick={() => {
                      onResolveMistake(currentStep.mistake.id, true);
                      advanceOrFinish();
                    }}
                    className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    Entendi · Marcar como resolvido
                  </button>
                )}
                <button
                  type="button"
                  onClick={advanceOrFinish}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Continuar
                </button>
              </div>
            </div>
          ) : currentStep?.kind === 'recap' ? (
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700">
                <Mic className="h-3.5 w-3.5" />
                Recap Rápido de Pronúncia &amp; Leitura
              </span>

              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 text-center space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <Volume2 className="h-5 w-5" />
                </div>
                <p className="font-display text-lg font-extrabold text-slate-900">
                  “{currentStep.sentence}”
                </p>
                <p className="text-xs text-slate-600">{currentStep.translationPt}</p>
                <div className="flex justify-center pt-1">
                  <DualAudioButtons
                    text={currentStep.sentence}
                    languageCode={languageCode}
                    preferredAccent={preferredAccent}
                    showSlow
                    size="sm"
                  />
                </div>
                <p className="text-[11px] text-indigo-800">{currentStep.tipPt}</p>
              </div>

              <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recapChecked}
                  onChange={(e) => setRecapChecked(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span>Li em voz alta e conferi a pronúncia</span>
              </label>

              <button
                type="button"
                onClick={advanceOrFinish}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                Concluir Revisão Express (+35 XP)
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

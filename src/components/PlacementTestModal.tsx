import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import {
  getPlacementBankByLanguage,
  getPlacementUiStrings,
} from '../data/placement';
import type { CEFRLevel, LanguageCode } from '../types/learning';
import {
  INITIAL_PLACEMENT_LEVEL,
  TOTAL_PLACEMENT_QUESTIONS,
  computeAdaptivePlacementResult,
  getNextAdaptiveLevel,
  pickNextPlacementQuestion,
  type PlacementAnswerRecord,
  type PlacementQuestion,
} from '../utils/placementEngine';
import { playSound } from '../utils/soundFx';

interface PlacementTestModalProps {
  languageCode?: LanguageCode;
  onClose: () => void;
  onCompletePlacement: (recommendedLevel: CEFRLevel, score: number) => void;
}

export function PlacementTestModal({
  languageCode = 'en',
  onClose,
  onCompletePlacement,
}: PlacementTestModalProps) {
  const bank = useMemo(
    () => getPlacementBankByLanguage(languageCode),
    [languageCode],
  );
  const ui = useMemo(
    () => getPlacementUiStrings(languageCode),
    [languageCode],
  );

  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1000));
  const [records, setRecords] = useState<PlacementAnswerRecord[]>([]);
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>(
    INITIAL_PLACEMENT_LEVEL,
  );
  const [lastTransition, setLastTransition] = useState<'up' | 'down' | null>(
    null,
  );
  const [currentQuestion, setCurrentQuestion] =
    useState<PlacementQuestion | null>(() =>
      pickNextPlacementQuestion(
        bank,
        INITIAL_PLACEMENT_LEVEL,
        new Set(),
        sessionSeed,
      ),
    );
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleConfirm = () => {
    if (picked === null || !currentQuestion) return;
    const isRight = picked === currentQuestion.correctIndex;
    playSound(isRight ? 'correct' : 'wrong');

    const nextRecords: PlacementAnswerRecord[] = [
      ...records,
      {
        question: currentQuestion,
        selectedIndex: picked,
        isCorrect: isRight,
      },
    ];
    setRecords(nextRecords);
    setPicked(null);

    if (nextRecords.length >= TOTAL_PLACEMENT_QUESTIONS) {
      playSound('levelup');
      setFinished(true);
      return;
    }

    const nextLevel = getNextAdaptiveLevel(currentQuestion.level, isRight);
    setLastTransition(isRight ? 'up' : 'down');
    setCurrentLevel(nextLevel);

    const answeredIds = new Set(nextRecords.map((r) => r.question.id));
    const nextQ = pickNextPlacementQuestion(
      bank,
      nextLevel,
      answeredIds,
      sessionSeed + nextRecords.length * 7,
    );

    if (!nextQ) {
      playSound('levelup');
      setFinished(true);
      return;
    }
    setCurrentQuestion(nextQ);
  };

  const summary = useMemo(
    () => computeAdaptivePlacementResult(records),
    [records],
  );

  const stepNumber = records.length + 1;

  return (
    <div className="safe-top safe-bottom fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-xs">
      <div className="animate-fade-up flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-blue-600" />
              <span className="font-display text-base font-extrabold text-slate-900">
                {ui.title}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] font-semibold text-indigo-600">
              {ui.adaptiveBadge} ({bank.length})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            aria-label={ui.closeAria}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {!finished && currentQuestion ? (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>
                    {ui.questionProgress(stepNumber, TOTAL_PLACEMENT_QUESTIONS)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-[11px] text-blue-700">
                    {lastTransition === 'up' && (
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                    )}
                    {lastTransition === 'down' && (
                      <TrendingDown className="h-3 w-3 text-amber-600" />
                    )}
                    <span>{ui.currentLevelProbe(currentQuestion.level || currentLevel)}</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (stepNumber / TOTAL_PLACEMENT_QUESTIONS) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <h2 className="font-display text-lg font-bold text-slate-900">
                {currentQuestion.prompt}
              </h2>

              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, oIdx) => {
                  const active = picked === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => setPicked(oIdx)}
                      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-medium transition cursor-pointer ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-100'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {active && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={picked === null}
                onClick={handleConfirm}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
              >
                <span>
                  {stepNumber === TOTAL_PLACEMENT_QUESTIONS
                    ? ui.finishTestBtn
                    : ui.nextQuestionBtn}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Award className="h-9 w-9" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {ui.completedBadge}
                </span>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
                  {ui.recommendedHeading(summary.recommendedLevel)}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {ui.summarySubtitle(
                    summary.correctCount,
                    summary.totalQuestions,
                    summary.abilityScore,
                  )}
                </p>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
                {summary.breakdownByLevel.map((b) => (
                  <div
                    key={b.level}
                    className={`rounded-xl border p-2 ${
                      b.level === summary.recommendedLevel
                        ? 'border-blue-400 bg-blue-50 text-blue-900 font-extrabold'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <p className="text-[11px] font-bold">{b.level}</p>
                    <p className="mt-0.5 text-xs">
                      {b.correct}/{b.answered}
                    </p>
                  </div>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-3 font-mono text-sm font-extrabold text-blue-700">
                <Zap className="h-4 w-4" />
                <span>{ui.xpEarnedText}</span>
              </div>

              <div className="space-y-2 text-left">
                <p className="text-xs font-bold text-slate-500 uppercase">
                  {ui.breakdownTitle}
                </p>
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  {records.map((rec, qIdx) => (
                    <div
                      key={`${rec.question.id}-${qIdx}`}
                      className="flex items-start gap-2 text-xs"
                    >
                      <span
                        className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                          rec.isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        #{qIdx + 1} · {rec.question.level}{' '}
                        {rec.isCorrect ? '✓' : '✗'}
                      </span>
                      <span className="text-slate-700">
                        {rec.question.topicNote}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onCompletePlacement(
                    summary.recommendedLevel,
                    summary.correctCount,
                  )
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
              >
                <span>{ui.applyResultBtn(summary.recommendedLevel)}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Flame, RotateCcw, Timer, XCircle, Zap } from 'lucide-react';
import type { LanguageCode, SkillType } from '../types/learning';
import { getGrammarDrillsByLanguage } from '../data/grammarDrills';
import { DualAudioButtons } from './DualAudioButtons';

interface GrammarDrillLabProps {
  languageCode: LanguageCode;
  onRecordMistake?: (payload: {
    topicId: string;
    topicTitle: string;
    skill: SkillType | 'grammar' | 'vocab';
    prompt: string;
    studentAnswer: string;
    expectedAnswer: string;
    explanation: string;
  }) => void;
  onEarnXp?: (xp: number) => void;
}

export function GrammarDrillLab({
  languageCode,
  onRecordMistake,
  onEarnXp,
}: GrammarDrillLabProps) {
  const drills = useMemo(
    () => getGrammarDrillsByLanguage(languageCode),
    [languageCode],
  );
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sprintActive, setSprintActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180);

  useEffect(() => {
    setIdx(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setSprintActive(false);
    setSecondsLeft(180);
  }, [languageCode]);

  useEffect(() => {
    if (!sprintActive || secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setSprintActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [sprintActive, secondsLeft]);

  const current = drills[idx % Math.max(1, drills.length)];
  if (!current) return null;

  const fullSentence = `${current.sentenceBefore}${current.options[current.correctIndex]}${current.sentenceAfter}`;

  const handleSelect = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    if (optIdx === current.correctIndex) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      onEarnXp?.(5);
    } else {
      setStreak(0);
      onRecordMistake?.({
        topicId: current.id,
        topicTitle: `Treino Gramatical · ${current.category}`,
        skill: 'grammar',
        prompt: `${current.sentenceBefore}___${current.sentenceAfter}`,
        studentAnswer: current.options[optIdx],
        expectedAnswer: current.options[current.correctIndex],
        explanation: current.explanationPt,
      });
    }
  };

  const handleNext = () => {
    setSelected(null);
    setIdx((prev) => (prev + 1) % drills.length);
  };

  const formatClock = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div data-testid="grammar-drill-lab" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4">
        <div>
          <h3 className="flex items-center gap-1.5 font-display text-base font-extrabold text-indigo-950">
            <Zap className="h-4.5 w-4.5 text-indigo-600" />
            <span>Laboratório de Estruturas, Conjugações &amp; Casos</span>
          </h3>
          <p className="text-xs text-indigo-800">
            Treino rápido de 3 minutos focado nas armadilhas reais deste idioma ({drills.length} desafios A1–C1).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 font-mono text-xs font-bold text-slate-800 ring-1 ring-indigo-200">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            {streak} seq · {score} acertos
          </span>
          <button
            type="button"
            onClick={() => {
              setSecondsLeft(180);
              setSprintActive((prev) => !prev);
            }}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
              sprintActive
                ? 'bg-rose-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Timer className="h-3.5 w-3.5" />
            <span>{sprintActive ? `Sprint ${formatClock(secondsLeft)}` : 'Iniciar Sprint 3 min'}</span>
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
            {current.level} · {current.category} · {(idx % drills.length) + 1}/{drills.length}
          </span>
          <button
            type="button"
            onClick={() => {
              setIdx(0);
              setSelected(null);
              setScore(0);
              setStreak(0);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>

        <p className="mt-3 text-xs font-semibold text-slate-500">{current.promptPt}</p>
        <p className="mt-2 font-display text-lg font-extrabold text-slate-900 sm:text-xl">
          {current.sentenceBefore}
          <span className="mx-1 inline-block rounded-lg border-b-2 border-indigo-400 bg-indigo-50 px-2.5 py-0.5 text-indigo-700">
            {selected !== null ? current.options[current.correctIndex] : '______'}
          </span>
          {current.sentenceAfter}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {current.options.map((opt, optIdx) => {
            const isCorrect = optIdx === current.correctIndex;
            const isPicked = selected === optIdx;
            let cls =
              'border-slate-200 bg-slate-50 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50';
            if (selected !== null) {
              if (isCorrect) {
                cls = 'border-emerald-400 bg-emerald-50 text-emerald-900';
              } else if (isPicked) {
                cls = 'border-rose-400 bg-rose-50 text-rose-900';
              } else {
                cls = 'border-slate-200 bg-slate-50 text-slate-400';
              }
            }
            return (
              <button
                key={opt}
                type="button"
                disabled={selected !== null}
                onClick={() => handleSelect(optIdx)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition cursor-pointer ${cls}`}
              >
                <span>{opt}</span>
                {selected !== null && isCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                )}
                {selected !== null && isPicked && !isCorrect && (
                  <XCircle className="h-4 w-4 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Explicação:</strong> {current.explanationPt}
              </p>
              <DualAudioButtons text={fullSentence} languageCode={languageCode} size="xs" />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Próximo desafio →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

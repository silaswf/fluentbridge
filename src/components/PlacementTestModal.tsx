import { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import type { CEFRLevel } from '../types/learning';
import { playSound } from '../utils/soundFx';

interface PlacementQuestion {
  id: string;
  level: CEFRLevel;
  prompt: string;
  options: string[];
  correctIndex: number;
  topicNote: string;
}

const QUESTIONS: PlacementQuestion[] = [
  {
    id: 'pq-1',
    level: 'A1',
    prompt: 'Qual frase está 100% correta em inglês?',
    options: [
      'I am understanding you right now.',
      'I understand you right now.',
      'I have 25 years old.',
      'In my house have two bedrooms.',
    ],
    correctIndex: 1,
    topicNote: 'Stative Verbs (understand) não usam -ing.',
  },
  {
    id: 'pq-2',
    level: 'A1',
    prompt: 'Como dizer "No próximo ano eu vou conseguir dirigir"?',
    options: [
      'Next year I will can drive.',
      'Next year I can to drive.',
      'Next year I will be able to drive.',
      'Next year I could drive.',
    ],
    correctIndex: 2,
    topicNote: 'Futuro de "Can" = "will be able to".',
  },
  {
    id: 'pq-3',
    level: 'A2',
    prompt: 'Complete: "Yesterday we ____ early because it was Sunday."',
    options: [
      "didn't have to wake up",
      "didn't had to wake up",
      "mustn't wake up",
      "haven't to wake up",
    ],
    correctIndex: 0,
    topicNote: 'Ausência de obrigação no passado = didn\'t have to + base.',
  },
  {
    id: 'pq-4',
    level: 'A2',
    prompt: 'Você vê nuvens muito escuras no céu agora. O que você diz?',
    options: [
      'Look at those clouds! It will raining.',
      'Look at those clouds! It is going to rain.',
      'Look at those clouds! It may to rain.',
      'Look at those clouds! It rained tomorrow.',
    ],
    correctIndex: 1,
    topicNote: 'Previsão com evidência visível agora usa "be going to".',
  },
  {
    id: 'pq-5',
    level: 'B1',
    prompt: 'Complete: "How long ____ English? Since 2023!"',
    options: [
      'do you study',
      'are you studying',
      'have you been studying',
      'did you studied',
    ],
    correctIndex: 2,
    topicNote: 'Duração até o presente ("Since 2023") usa Present Perfect Continuous.',
  },
  {
    id: 'pq-6',
    level: 'B1',
    prompt: 'Complete: "Thank you for ____! Please avoid ____ Portuguese in class."',
    options: [
      'coming / speaking',
      'to come / to speak',
      'coming / to speak',
      'come / speaking',
    ],
    correctIndex: 0,
    topicNote: 'Após preposição ("for") e após "avoid", o verbo usa -ing.',
  },
  {
    id: 'pq-7',
    level: 'B2',
    prompt: 'Escolha a frase correta em Discurso Indireto (Reported Speech):',
    options: [
      'She said me that she will travel soon.',
      'She told me that she would travel soon.',
      'She told that she is traveling tomorrow.',
      'He asked me where did I live.',
    ],
    correctIndex: 1,
    topicNote: '"Tell" pede objeto ("me") e "will" recua para "would".',
  },
  {
    id: 'pq-8',
    level: 'B2',
    prompt: 'Complete com a Question Tag certa: "You haven\'t finished yet, ____?"',
    options: ["haven't you", 'did you', 'have you', "aren't you"],
    correctIndex: 2,
    topicNote: 'Frase negativa com "haven\'t" gera tag positiva "have you?".',
  },
  {
    id: 'pq-9',
    level: 'C1',
    prompt: 'Passe para a Voz Passiva: "They are building a new bridge downtown."',
    options: [
      'A new bridge is been built downtown.',
      'A new bridge is being built downtown.',
      'A new bridge was being build downtown.',
      'A new bridge has building downtown.',
    ],
    correctIndex: 1,
    topicNote: 'Present Continuous Passive = is/are + being + particípio.',
  },
  {
    id: 'pq-10',
    level: 'C1',
    prompt: 'Complete a frase com inversão elegante (C1): "____ such strong alignment."',
    options: [
      'Rarely I have seen',
      'Rarely have I seen',
      'Rarely did I saw',
      'Not only I saw',
    ],
    correctIndex: 1,
    topicNote: 'Expressão negativa no início inverte auxiliar + sujeito ("Rarely have I").',
  },
];

interface PlacementTestModalProps {
  onClose: () => void;
  onCompletePlacement: (recommendedLevel: CEFRLevel, score: number) => void;
}

function computeRecommendedLevel(score: number): CEFRLevel {
  if (score <= 2) return 'A1';
  if (score <= 4) return 'A2';
  if (score <= 6) return 'B1';
  if (score <= 8) return 'B2';
  return 'C1';
}

export function PlacementTestModal({
  onClose,
  onCompletePlacement,
}: PlacementTestModalProps) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[idx];

  const handleConfirm = () => {
    if (picked === null) return;
    const isRight = picked === q.correctIndex;
    playSound(isRight ? 'correct' : 'wrong');
    const nextAnswers = [...answers, picked];
    setAnswers(nextAnswers);
    setPicked(null);

    if (idx < QUESTIONS.length - 1) {
      setIdx((prev) => prev + 1);
    } else {
      playSound('levelup');
      setFinished(true);
    }
  };

  const correctCount = answers.reduce(
    (acc, ans, i) => (ans === QUESTIONS[i]?.correctIndex ? acc + 1 : acc),
    0,
  );
  const recommended = computeRecommendedLevel(correctCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-xs">
      <div className="animate-fade-up flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-blue-600" />
            <span className="font-display text-base font-extrabold text-slate-900">
              Teste de Nivelamento Rápido (CEFR A1–C1)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            aria-label="Fechar teste"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {!finished ? (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Questão {idx + 1} de {QUESTIONS.length}</span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-[11px] text-blue-700">
                    Nível {q.level}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${Math.round(((idx + 1) / QUESTIONS.length) * 100)}%` }}
                  />
                </div>
              </div>

              <h2 className="font-display text-lg font-bold text-slate-900">
                {q.prompt}
              </h2>

              <div className="space-y-2.5">
                {q.options.map((opt, oIdx) => {
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
                      {active && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
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
                <span>{idx === QUESTIONS.length - 1 ? 'Ver meu nível recomendado' : 'Próxima pergunta'}</span>
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
                  Diagnóstico concluído
                </span>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
                  Nível Recomendado: CEFR {recommended}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Você acertou <strong>{correctCount} de {QUESTIONS.length}</strong> questões progressivas.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-3 font-mono text-sm font-extrabold text-blue-700">
                <Zap className="h-4 w-4" />
                <span>+40 XP conquistados pelo nivelamento!</span>
              </div>

              <div className="max-h-48 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-left">
                {QUESTIONS.map((item, qIdx) => {
                  const ok = answers[qIdx] === item.correctIndex;
                  return (
                    <div key={item.id} className="flex items-start gap-2 text-xs">
                      <span
                        className={`mt-0.5 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                          ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.level} {ok ? '✓' : '✗'}
                      </span>
                      <span className="text-slate-700">{item.topicNote}</span>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onCompletePlacement(recommended, correctCount)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
              >
                <span>Ir para minhas unidades de nível {recommended}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * @file src/components/MistakeNotebookView.tsx
 * @description Caderno de Erros automático: agrupa falhas recentes em lições/revisões para prática direcionada e superação.
 * @exports MistakeNotebookView
 */
import { useMemo, useState } from 'react';
import { BookMarked, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import type { LanguageCode, MistakeEntry } from '../types/learning';
import { DualAudioButtons } from './DualAudioButtons';

interface MistakeNotebookViewProps {
  mistakes: MistakeEntry[];
  languageCode: LanguageCode;
  onResolveMistake: (mistakeId: string, resolved: boolean) => void;
}

export function MistakeNotebookView({
  mistakes,
  languageCode,
  onResolveMistake,
}: MistakeNotebookViewProps) {
  const [filterStatus, setFilterStatus] = useState<'active' | 'resolved' | 'all'>('active');
  const [practiceDraft, setPracticeDraft] = useState<Record<string, string>>({});

  const scoped = useMemo(() => {
    return mistakes.filter((m) => {
      if (m.languageCode !== languageCode) return false;
      if (filterStatus === 'active') return !m.resolved;
      if (filterStatus === 'resolved') return Boolean(m.resolved);
      return true;
    });
  }, [mistakes, languageCode, filterStatus]);

  const activeCount = mistakes.filter(
    (m) => m.languageCode === languageCode && !m.resolved,
  ).length;
  const resolvedCount = mistakes.filter(
    (m) => m.languageCode === languageCode && m.resolved,
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
            <BookMarked className="h-4.5 w-4.5 text-amber-600" />
            <span>Caderno Inteligente de Erros</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Erros capturados automaticamente das suas lições, ditados, pronúncia e Tutor IA para revisão focada (+10 XP ao dominar).
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              filterStatus === 'active'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pendentes ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('resolved')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              filterStatus === 'resolved'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Dominados ({resolvedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      {scoped.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-emerald-500" />
          <p className="mt-3 font-display text-lg font-bold text-slate-900">
            {filterStatus === 'active'
              ? 'Nenhum erro pendente neste idioma!'
              : 'Nenhum registro nesta categoria ainda.'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Sempre que você errar uma questão ou receber uma correção do Tutor IA, ela aparecerá aqui para revisão direcionada.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scoped.map((item) => {
            const draft = practiceDraft[item.id] ?? '';
            const matchesExpected =
              draft.trim().toLowerCase() ===
              item.expectedAnswer.trim().toLowerCase();

            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-4 shadow-2xs transition ${
                  item.resolved ? 'border-emerald-200/80 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 uppercase">
                        {item.skill}
                      </span>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                        {item.topicTitle}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      {item.prompt}
                    </p>
                  </div>

                  <DualAudioButtons
                    text={item.expectedAnswer}
                    languageCode={item.languageCode}
                    size="xs"
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-2.5 text-xs">
                    <p className="text-[10px] font-bold text-rose-700 uppercase">
                      Sua resposta anterior
                    </p>
                    <p className="mt-0.5 font-medium text-rose-950">
                      {item.studentAnswer || '—'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase">
                      Forma ideal / esperada
                    </p>
                    <p className="mt-0.5 font-bold text-emerald-950">
                      {item.expectedAnswer}
                    </p>
                  </div>
                </div>

                {item.explanation && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    💡 {item.explanation}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) =>
                      setPracticeDraft((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    placeholder="Digite novamente a forma correta para fixar..."
                    className={`min-w-[220px] flex-1 rounded-xl border px-3 py-1.5 text-xs focus:outline-none ${
                      matchesExpected
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-slate-50 text-slate-900'
                    }`}
                  />

                  {item.resolved ? (
                    <button
                      type="button"
                      onClick={() => onResolveMistake(item.id, false)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reabrir</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onResolveMistake(item.id, true)}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Dominado (+10 XP)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

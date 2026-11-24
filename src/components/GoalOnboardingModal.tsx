import { useState } from 'react';
import { Check, Compass, X } from 'lucide-react';
import type { LearningGoalType } from '../types/learning';
import { LEARNING_GOAL_OPTIONS } from '../utils/studyPlanEngine';

interface GoalOnboardingModalProps {
  open: boolean;
  currentGoal?: LearningGoalType;
  currentTargetDate?: string;
  onSave: (goal: LearningGoalType, targetDate?: string) => void;
  onClose: () => void;
}

export function GoalOnboardingModal({
  open,
  currentGoal = 'career',
  currentTargetDate = '',
  onSave,
  onClose,
}: GoalOnboardingModalProps) {
  const [selected, setSelected] = useState<LearningGoalType>(currentGoal);
  const [targetDate, setTargetDate] = useState(currentTargetDate);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
              <Compass className="h-3.5 w-3.5" />
              <span>Trilha Personalizada</span>
            </span>
            <h2 className="mt-2 font-display text-xl font-extrabold text-slate-900">
              Qual é o seu objetivo principal?
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Montamos seu plano semanal priorizando as unidades e simulados mais úteis para sua meta.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {LEARNING_GOAL_OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelected(opt.id)}
                className={`flex w-full items-start justify-between gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                  active
                    ? 'border-blue-500 bg-blue-50/70'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{opt.labelPt}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{opt.descPt}</p>
                </div>
                {active && <Check className="h-4 w-4 shrink-0 text-blue-600" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700">
            Prazo desejado (opcional)
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Agora não
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(selected, targetDate || undefined);
              onClose();
            }}
            className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
          >
            Salvar Plano Semanal
          </button>
        </div>
      </div>
    </div>
  );
}

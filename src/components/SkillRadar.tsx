/**
 * @file src/components/SkillRadar.tsx
 * @description Componente de interface SkillRadar do FluentBridge.
 * @exports SkillRadar
 */
import { Sparkles, TrendingUp } from 'lucide-react';
import type { SkillType } from '../types/learning';
import { SKILL_META } from './SkillBadge';

interface SkillRadarProps {
  scores: Record<SkillType, number>;
  onPracticeLowest?: () => void;
}

const AXES: { key: SkillType; label: string; angleDeg: number }[] = [
  { key: 'listening', label: 'Listening', angleDeg: -90 },
  { key: 'reading', label: 'Reading', angleDeg: 0 },
  { key: 'speaking', label: 'Speaking', angleDeg: 90 },
  { key: 'writing', label: 'Writing', angleDeg: 180 },
];

const SKILL_TIPS_PT: Record<SkillType, string> = {
  listening: 'Pratique ouvindo os áudios primeiro em velocidade 1.0x e depois 0.75x.',
  reading: 'Explore as palavras destacadas nos textos para expandir seu vocabulário.',
  speaking: 'Use o gravador ou fale em voz alta imitando a entonação nativa.',
  writing: 'Monte frases completas e envie uma redação para o feedback do professor.',
};

export function SkillRadar({ scores, onPracticeLowest }: SkillRadarProps) {
  const cx = 110;
  const cy = 100;
  const maxR = 64;

  const toPoint = (angleDeg: number, ratio: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + Math.cos(rad) * maxR * ratio,
      y: cy + Math.sin(rad) * maxR * ratio,
    };
  };

  const rings = [0.25, 0.5, 0.75, 1];

  const dataPoints = AXES.map((axis) => {
    const val = Math.max(12, Math.min(100, scores[axis.key])) / 100;
    return toPoint(axis.angleDeg, val);
  });

  const polygonPoints = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const lowestSkill = (Object.entries(scores) as [SkillType, number][]).reduce(
    (min, cur) => (cur[1] < min[1] ? cur : min),
    ['listening', scores.listening] as [SkillType, number],
  );

  const avgScore = Math.round(
    (scores.listening + scores.reading + scores.speaking + scores.writing) / 4,
  );

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold text-slate-900">
            Radar das 4 Habilidades
          </h3>
          <p className="text-xs text-slate-500">Equilíbrio do seu inglês</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>{avgScore}% geral</span>
        </div>
      </div>

      {/* Pure SVG 4-axis diamond radar */}
      <div className="my-3 flex justify-center">
        <svg viewBox="0 0 220 200" className="h-44 w-48 overflow-visible" aria-label="Gráfico radar das 4 habilidades">
          {rings.map((r) => {
            const pts = AXES.map((a) => {
              const p = toPoint(a.angleDeg, r);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            }).join(' ');
            return (
              <polygon
                key={r}
                points={pts}
                fill={r === 1 ? '#F8FAFC' : 'none'}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            );
          })}

          {AXES.map((axis) => {
            const end = toPoint(axis.angleDeg, 1);
            return (
              <line
                key={axis.key}
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            );
          })}

          <polygon
            points={polygonPoints}
            fill="rgba(17, 109, 255, 0.18)"
            stroke="#116DFF"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {dataPoints.map((pt, i) => (
            <circle
              key={AXES[i].key}
              cx={pt.x}
              cy={pt.y}
              r="3.8"
              fill="#116DFF"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          ))}

          {/* Axis labels */}
          <text x={cx} y={cy - maxR - 12} textAnchor="middle" className="fill-indigo-700 text-[11px] font-semibold">
            Listening
          </text>
          <text x={cx + maxR + 8} y={cy + 4} textAnchor="start" className="fill-teal-700 text-[11px] font-semibold">
            Reading
          </text>
          <text x={cx} y={cy + maxR + 18} textAnchor="middle" className="fill-rose-700 text-[11px] font-semibold">
            Speaking
          </text>
          <text x={cx - maxR - 8} y={cy + 4} textAnchor="end" className="fill-amber-700 text-[11px] font-semibold">
            Writing
          </text>
        </svg>
      </div>

      {/* Horizontal progress bars */}
      <div className="space-y-2.5">
        {AXES.map(({ key }) => {
          const meta = SKILL_META[key];
          const score = scores[key];
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{meta.label}</span>
                <span className="font-mono font-semibold text-slate-900">{score}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${meta.dot}`}
                  style={{ width: `${Math.min(100, score)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart recommendation */}
      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div className="text-xs leading-relaxed text-slate-700">
            <span className="font-semibold text-blue-900">
              Foco recomendado: {SKILL_META[lowestSkill[0]].shortLabel} ({lowestSkill[1]}%)
            </span>
            <p className="mt-0.5 text-slate-600">{SKILL_TIPS_PT[lowestSkill[0]]}</p>
            {onPracticeLowest && (
              <button
                type="button"
                onClick={onPracticeLowest}
                className="mt-1.5 font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Praticar próxima lição →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

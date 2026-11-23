import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  BookOpen,
  Globe,
  Headphones,
  Layers,
  Lightbulb,
  Mic,
  PenTool,
  Puzzle,
  Sparkles,
  Volume2,
} from 'lucide-react';
import type { SkillType, TipCategory } from '../types/learning';

export type BadgeKind =
  | SkillType
  | 'vocab_intro'
  | 'tip'
  | 'matching'
  | 'fill_blank'
  | 'dictation'
  | 'minimal_pairs'
  | 'story';

interface SkillMeta {
  label: string;
  shortLabel: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  Icon: LucideIcon;
}

export const SKILL_META: Record<BadgeKind, SkillMeta> = {
  listening: {
    label: 'Listening · Ouvir',
    shortLabel: 'Listening',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
    Icon: Headphones,
  },
  reading: {
    label: 'Reading · Ler',
    shortLabel: 'Reading',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    dot: 'bg-teal-500',
    Icon: BookOpen,
  },
  speaking: {
    label: 'Speaking · Falar',
    shortLabel: 'Speaking',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    Icon: Mic,
  },
  writing: {
    label: 'Writing · Escrever',
    shortLabel: 'Writing',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    Icon: PenTool,
  },
  vocab_intro: {
    label: 'Vocabulário · Palavras-chave',
    shortLabel: 'Vocab',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
    Icon: BookOpen,
  },
  tip: {
    label: 'Dica do Professor',
    shortLabel: 'Dica',
    bg: 'bg-amber-100/80',
    text: 'text-amber-900',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
    Icon: Lightbulb,
  },
  matching: {
    label: 'Vocabulário · Pares',
    shortLabel: 'Pares',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
    Icon: Layers,
  },
  fill_blank: {
    label: 'Gramática · Lacuna',
    shortLabel: 'Lacuna',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
    Icon: Puzzle,
  },
  dictation: {
    label: 'Ditado Auditivo',
    shortLabel: 'Ditado',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
    Icon: Headphones,
  },
  minimal_pairs: {
    label: 'Fonética · Pares Mínimos',
    shortLabel: 'Fonética',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    Icon: Volume2,
  },
  story: {
    label: 'História Multi-Vozes',
    shortLabel: 'História',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
    Icon: Sparkles,
  },
};

export const TIP_CATEGORY_META: Record<
  TipCategory,
  { label: string; bg: string; text: string; Icon: LucideIcon }
> = {
  grammar: {
    label: 'Gramática',
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    Icon: Sparkles,
  },
  pronunciation: {
    label: 'Pronúncia',
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-700',
    Icon: Volume2,
  },
  false_friend: {
    label: 'Falso Cognato',
    bg: 'bg-amber-50 border-amber-300',
    text: 'text-amber-800',
    Icon: AlertTriangle,
  },
  culture: {
    label: 'Cultura & Uso Real',
    bg: 'bg-teal-50 border-teal-200',
    text: 'text-teal-700',
    Icon: Globe,
  },
};

interface SkillBadgeProps {
  kind: BadgeKind;
  compact?: boolean;
  className?: string;
}

export function SkillBadge({ kind, compact = false, className = '' }: SkillBadgeProps) {
  const meta = SKILL_META[kind];
  const Icon = meta.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${meta.bg} ${meta.text} ${meta.border} ${
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
    >
      <Icon className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span>{compact ? meta.shortLabel : meta.label}</span>
    </span>
  );
}

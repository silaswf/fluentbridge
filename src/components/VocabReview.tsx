import { useMemo, useState } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  List,
  RotateCw,
  Search,
  Sparkles,
} from 'lucide-react';
import type { CEFRLevel, Topic, VocabCard } from '../types/learning';
import { DualAudioButtons } from './DualAudioButtons';

interface VocabReviewProps {
  vocab: VocabCard[];
  topics: Topic[];
  onRateCard: (cardId: string, nextStrength: VocabCard['strength']) => void;
}

const STRENGTH_META: Record<
  VocabCard['strength'],
  { label: string; badge: string }
> = {
  weak: {
    label: 'Precisa reforçar',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  medium: {
    label: 'Em progresso',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  mastered: {
    label: 'Dominado',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

export function VocabReview({
  vocab,
  topics,
  onRateCard,
}: VocabReviewProps) {
  const [mode, setMode] = useState<'flashcards' | 'list'>('flashcards');
  const [filterStrength, setFilterStrength] = useState<'all' | VocabCard['strength']>('all');
  const [filterLevel, setFilterLevel] = useState<'ALL' | CEFRLevel>('ALL');
  const [search, setSearch] = useState('');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const topicLevelMap = useMemo(() => {
    const map = new Map<string, CEFRLevel>();
    for (const t of topics) {
      map.set(t.id, t.level);
    }
    return map;
  }, [topics]);

  const topicLangMap = useMemo(() => {
    const map = new Map<string, Topic['languageCode']>();
    for (const t of topics) {
      map.set(t.id, t.languageCode ?? 'en');
    }
    return map;
  }, [topics]);

  const counts = useMemo(() => {
    const levelScoped =
      filterLevel === 'ALL'
        ? vocab
        : vocab.filter((v) => topicLevelMap.get(v.topicId) === filterLevel);
    return {
      weak: levelScoped.filter((v) => v.strength === 'weak').length,
      medium: levelScoped.filter((v) => v.strength === 'medium').length,
      mastered: levelScoped.filter((v) => v.strength === 'mastered').length,
    };
  }, [vocab, filterLevel, topicLevelMap]);

  const deck = useMemo(() => {
    const order: Record<VocabCard['strength'], number> = {
      weak: 0,
      medium: 1,
      mastered: 2,
    };
    return [...vocab]
      .filter((v) =>
        filterLevel === 'ALL' ? true : topicLevelMap.get(v.topicId) === filterLevel,
      )
      .filter((v) => (filterStrength === 'all' ? true : v.strength === filterStrength))
      .filter((v) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          v.word.toLowerCase().includes(q) ||
          v.translation.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => order[a.strength] - order[b.strength]);
  }, [vocab, filterLevel, filterStrength, search, topicLevelMap]);

  const safeIdx = deck.length === 0 ? 0 : cardIndex % deck.length;
  const activeCard = deck[safeIdx];

  const handleRate = (nextStrength: VocabCard['strength']) => {
    if (!activeCard) return;
    onRateCard(activeCard.id, nextStrength);
    setFlipped(false);
    setCardIndex((prev) => prev + 1);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            Revisão Inteligente (SRS · {vocab.length} cards)
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Filtre por nível CEFR ou grau de domínio para fixar falsos cognatos, phrasal verbs e expressões.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setMode('flashcards')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
              mode === 'flashcards'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BrainCircuit className="h-4 w-4" />
            <span>Flashcards</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('list')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
              mode === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <List className="h-4 w-4" />
            <span>Lista ({deck.length})</span>
          </button>
        </div>
      </div>

      {/* CEFR Level Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'] as const).map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => {
              setFilterLevel(lvl);
              setCardIndex(0);
              setFlipped(false);
            }}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer ${
              filterLevel === lvl
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {lvl === 'ALL' ? 'Todos os níveis' : lvl}
          </button>
        ))}
      </div>

      {/* Strength Summary Pills */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() =>
            setFilterStrength((f) => (f === 'weak' ? 'all' : 'weak'))
          }
          className={`rounded-2xl border p-4 text-left transition cursor-pointer ${
            filterStrength === 'weak'
              ? 'border-rose-400 bg-rose-50 ring-2 ring-rose-100'
              : 'border-slate-200 bg-white hover:border-rose-200'
          }`}
        >
          <p className="font-mono text-2xl font-extrabold text-rose-600">{counts.weak}</p>
          <p className="text-xs font-semibold text-slate-600">Fracos · Prioridade</p>
        </button>

        <button
          type="button"
          onClick={() =>
            setFilterStrength((f) => (f === 'medium' ? 'all' : 'medium'))
          }
          className={`rounded-2xl border p-4 text-left transition cursor-pointer ${
            filterStrength === 'medium'
              ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-100'
              : 'border-slate-200 bg-white hover:border-amber-200'
          }`}
        >
          <p className="font-mono text-2xl font-extrabold text-amber-600">{counts.medium}</p>
          <p className="text-xs font-semibold text-slate-600">Médio · Revisando</p>
        </button>

        <button
          type="button"
          onClick={() =>
            setFilterStrength((f) => (f === 'mastered' ? 'all' : 'mastered'))
          }
          className={`rounded-2xl border p-4 text-left transition cursor-pointer ${
            filterStrength === 'mastered'
              ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100'
              : 'border-slate-200 bg-white hover:border-emerald-200'
          }`}
        >
          <p className="font-mono text-2xl font-extrabold text-emerald-600">
            {counts.mastered}
          </p>
          <p className="text-xs font-semibold text-slate-600">Dominados</p>
        </button>
      </div>

      {/* FLASHCARD MODE */}
      {mode === 'flashcards' && (
        <div className="mx-auto max-w-xl space-y-4">
          {!activeCard ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              <p className="mt-3 font-display text-lg font-bold text-slate-900">
                Nenhum card neste filtro!
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilterStrength('all');
                  setFilterLevel('ALL');
                }}
                className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Mostrar todos os {vocab.length} cards
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>
                  Card {safeIdx + 1} de {deck.length} ·{' '}
                  {topicLevelMap.get(activeCard.topicId) ?? 'Geral'}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                    STRENGTH_META[activeCard.strength].badge
                  }`}
                >
                  {STRENGTH_META[activeCard.strength].label}
                </span>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                    {activeCard.category}
                  </span>
                  <DualAudioButtons
                    text={activeCard.word}
                    languageCode={
                      activeCard.languageCode ??
                      topicLangMap.get(activeCard.topicId) ??
                      'en'
                    }
                    size="sm"
                  />
                </div>

                <div className="my-6 text-center">
                  <h2 className="font-display text-3xl font-extrabold text-slate-900">
                    {activeCard.word}
                  </h2>
                  <p className="mt-1.5 font-mono text-sm text-slate-400">
                    {activeCard.ipa}
                  </p>
                </div>

                {!flipped ? (
                  <button
                    type="button"
                    onClick={() => setFlipped(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100 cursor-pointer"
                  >
                    <RotateCw className="h-4 w-4" />
                    <span>Mostrar tradução e exemplo</span>
                  </button>
                ) : (
                  <div className="animate-fade-up space-y-4 border-t border-slate-100 pt-5">
                    <div className="text-center">
                      <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Significado
                      </p>
                      <p className="mt-1 font-display text-xl font-bold text-emerald-700">
                        {activeCard.translation}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          “{activeCard.exampleEn}”
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">
                          {activeCard.examplePt}
                        </p>
                      </div>
                      <DualAudioButtons
                        text={activeCard.exampleEn}
                        languageCode={
                          activeCard.languageCode ??
                          topicLangMap.get(activeCard.topicId) ??
                          'en'
                        }
                        size="xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-center text-xs font-semibold text-slate-500">
                        Como você foi nessa palavra? (+5 XP)
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleRate('weak')}
                          className="rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 cursor-pointer"
                        >
                          Preciso rever
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRate('medium')}
                          className="rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100 cursor-pointer"
                        >
                          Lembrei
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRate('mastered')}
                          className="rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 cursor-pointer"
                        >
                          Domino!
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* LIST MODE */}
      {mode === 'list' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar palavra, tradução ou categoria..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {deck.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                        {topicLevelMap.get(item.topicId) ?? 'A1'}
                      </span>
                      <h3 className="font-display text-base font-bold text-slate-900">
                        {item.word}
                      </h3>
                      <span className="font-mono text-xs text-slate-400">
                        {item.ipa}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-blue-700">
                      {item.translation}
                    </p>
                  </div>
                  <DualAudioButtons
                    text={item.word}
                    languageCode={
                      item.languageCode ??
                      topicLangMap.get(item.topicId) ??
                      'en'
                    }
                    size="xs"
                  />
                </div>

                <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs">
                  <p className="font-medium text-slate-800">{item.exampleEn}</p>
                  <p className="text-slate-500">{item.examplePt}</p>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                    <Sparkles className="h-3 w-3 text-slate-400" />
                    {item.category}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-bold ${
                      STRENGTH_META[item.strength].badge
                    }`}
                  >
                    {STRENGTH_META[item.strength].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

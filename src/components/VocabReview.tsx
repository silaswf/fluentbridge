import { useEffect, useMemo, useState } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  Clock,
  Headphones,
  List,
  RotateCw,
  Search,
  Sparkles,
} from 'lucide-react';
import type {
  CEFRLevel,
  LanguageCode,
  MistakeEntry,
  PronunciationHistoryEntry,
  Topic,
  VocabCard,
} from '../types/learning';
import {
  buildClozePrompt,
  isCardDue,
  previewNextIntervalLabel,
  sortCardsForReview,
  type SrsRating,
} from '../utils/srsEngine';
import {
  loadJapaneseScriptMode,
  saveJapaneseScriptMode,
  toJapaneseKana,
  type JapaneseScriptMode,
} from '../utils/japaneseKana';
import {
  loadHebrewScriptMode,
  saveHebrewScriptMode,
  stripHebrewNiqqud,
  type HebrewScriptMode,
} from '../utils/hebrewNiqqud';
import { HandsFreeAudioModal } from './HandsFreeAudioModal';
import { DualAudioButtons } from './DualAudioButtons';
import { MistakeNotebookView } from './MistakeNotebookView';

interface VocabReviewProps {
  vocab: VocabCard[];
  allCourseVocab?: VocabCard[];
  topics: Topic[];
  languageCode?: LanguageCode;
  mistakes?: MistakeEntry[];
  pronunciationHistory?: PronunciationHistoryEntry[];
  onResolveMistake?: (mistakeId: string, resolved: boolean) => void;
  onRateCard: (cardId: string, rating: SrsRating) => void;
  onGoToLearn?: () => void;
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
  allCourseVocab,
  topics,
  languageCode = 'en',
  mistakes = [],
  pronunciationHistory = [],
  onResolveMistake,
  onRateCard,
  onGoToLearn,
}: VocabReviewProps) {
  const [sectionTab, setSectionTab] = useState<'vocab' | 'mistakes' | 'pronunciation'>('vocab');
  const [scope, setScope] = useState<'learned' | 'catalog'>('learned');
  const [mode, setMode] = useState<'flashcards' | 'cloze' | 'list'>('flashcards');
  const [clozeInput, setClozeInput] = useState('');
  const [clozeChecked, setClozeChecked] = useState<boolean | null>(null);
  const [filterStrength, setFilterStrength] = useState<'all' | 'due' | VocabCard['strength']>('all');
  const [filterLevel, setFilterLevel] = useState<'ALL' | CEFRLevel>('ALL');
  const [search, setSearch] = useState('');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [jaScriptMode, setJaScriptMode] = useState<JapaneseScriptMode>(() =>
    loadJapaneseScriptMode(),
  );
  const [heScriptMode, setHeScriptMode] = useState<HebrewScriptMode>(() =>
    loadHebrewScriptMode(),
  );
  const [handsFreeOpen, setHandsFreeOpen] = useState(false);

  const unlockedIdSet = useMemo(() => new Set(vocab.map((c) => c.id)), [vocab]);
  const activeSourceVocab =
    scope === 'catalog' && allCourseVocab && allCourseVocab.length > 0
      ? allCourseVocab
      : vocab;

  const topicTitleMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of topics) {
      map.set(t.id, t.titlePt);
    }
    return map;
  }, [topics]);

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
        ? activeSourceVocab
        : activeSourceVocab.filter((v) => topicLevelMap.get(v.topicId) === filterLevel);
    return {
      due: levelScoped.filter((v) => isCardDue(v)).length,
      weak: levelScoped.filter((v) => v.strength === 'weak').length,
      medium: levelScoped.filter((v) => v.strength === 'medium').length,
      mastered: levelScoped.filter((v) => v.strength === 'mastered').length,
    };
  }, [activeSourceVocab, filterLevel, topicLevelMap]);

  const deck = useMemo(() => {
    const filtered = activeSourceVocab
      .filter((v) =>
        filterLevel === 'ALL' ? true : topicLevelMap.get(v.topicId) === filterLevel,
      )
      .filter((v) => {
        if (filterStrength === 'all') return true;
        if (filterStrength === 'due') return isCardDue(v);
        return v.strength === filterStrength;
      })
      .filter((v) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          v.word.toLowerCase().includes(q) ||
          v.translation.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
        );
      });
    return sortCardsForReview(filtered);
  }, [activeSourceVocab, filterLevel, filterStrength, search, topicLevelMap]);

  const safeIdx = deck.length === 0 ? 0 : cardIndex % deck.length;
  const activeCard = deck[safeIdx];

  const handleRate = (rating: SrsRating) => {
    if (!activeCard) return;
    onRateCard(activeCard.id, rating);
    setFlipped(false);
    setClozeInput('');
    setClozeChecked(null);
    setCardIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (mode !== 'flashcards' || !activeCard) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped) {
        if (e.key === '1') handleRate('again');
        else if (e.key === '2') handleRate('hard');
        else if (e.key === '3') handleRate('good');
        else if (e.key === '4') handleRate('easy');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            Revisão Inteligente (SRS · {activeSourceVocab.length} cards)
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            {scope === 'learned'
              ? 'Palavras desbloqueadas progressivamente nas unidades que você já estudou.'
              : 'Catálogo completo do idioma (inclui palavras de unidades futuras).'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setSectionTab('vocab')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                sectionTab === 'vocab'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Vocabulário SRS
            </button>
            <button
              type="button"
              onClick={() => setSectionTab('mistakes')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                sectionTab === 'mistakes'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Caderno de Erros (
              {mistakes.filter((m) => m.languageCode === languageCode && !m.resolved).length}
              )
            </button>
            <button
              type="button"
              onClick={() => setSectionTab('pronunciation')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                sectionTab === 'pronunciation'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Pronúncia (
              {pronunciationHistory.filter((p) => p.languageCode === languageCode).length}
              )
            </button>
          </div>

          {allCourseVocab && allCourseVocab.length > vocab.length && (
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setScope('learned');
                  setCardIndex(0);
                  setFlipped(false);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  scope === 'learned'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Aprendidas ({vocab.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setScope('catalog');
                  setCardIndex(0);
                  setFlipped(false);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  scope === 'catalog'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Catálogo ({allCourseVocab.length})
              </button>
            </div>
          )}

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
              data-testid="vocab-mode-cloze"
              onClick={() => {
                setMode('cloze');
                setFlipped(false);
                setClozeInput('');
                setClozeChecked(null);
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                mode === 'cloze'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Cloze · Lacuna</span>
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
            <button
              type="button"
              data-testid="open-hands-free-btn"
              onClick={() => setHandsFreeOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 cursor-pointer"
            >
              <Headphones className="h-4 w-4" />
              <span>Hands-Free</span>
            </button>
            {languageCode === 'ja' && (
              <button
                type="button"
                onClick={() => {
                  const next: JapaneseScriptMode =
                    jaScriptMode === 'standard' ? 'kana' : 'standard';
                  setJaScriptMode(next);
                  saveJapaneseScriptMode(next);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800 cursor-pointer"
              >
                {jaScriptMode === 'kana' ? 'あいう Kana' : '漢字 Padrão'}
              </button>
            )}
            {languageCode === 'he' && (
              <button
                type="button"
                onClick={() => {
                  const next: HebrewScriptMode =
                    heScriptMode === 'niqqud' ? 'modern' : 'niqqud';
                  setHeScriptMode(next);
                  saveHebrewScriptMode(next);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 cursor-pointer"
              >
                {heScriptMode === 'modern' ? 'עב Moderno' : 'נִקּוּד Niqqud'}
              </button>
            )}
          </div>
        </div>
      </div>

      {sectionTab === 'mistakes' && onResolveMistake ? (
        <MistakeNotebookView
          mistakes={mistakes}
          languageCode={languageCode}
          onResolveMistake={onResolveMistake}
        />
      ) : sectionTab === 'pronunciation' ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div>
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              Histórico &amp; Evolução de Pronúncia
            </h2>
            <p className="text-xs text-slate-600">
              Acompanhe suas últimas notas de Speaking/Shadowing e palavras que pedem mais treino.
            </p>
          </div>
          {(() => {
            const entries = pronunciationHistory
              .filter((p) => p.languageCode === languageCode)
              .slice()
              .reverse();
            if (entries.length === 0) {
              return (
                <p className="rounded-2xl bg-slate-50 p-6 text-center text-xs font-semibold text-slate-500">
                  Pratique uma atividade de Speaking ou Modo Shadowing nas lições para registrar sua evolução fonética aqui.
                </p>
              );
            }
            const avg = Math.round(
              entries.reduce((acc, e) => acc + e.score, 0) / entries.length,
            );
            return (
              <>
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                    <p className="text-[11px] font-bold text-emerald-700">Média Geral</p>
                    <p className="font-mono text-xl font-extrabold text-emerald-900">{avg}%</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                    <p className="text-[11px] font-bold text-slate-500">Treinos Registrados</p>
                    <p className="font-mono text-xl font-extrabold text-slate-900">{entries.length}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {entries.slice(0, 15).map((e) => (
                    <div
                      key={e.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{e.topicId}</p>
                        <p className="text-[11px] text-slate-500">
                          {e.createdAt}
                          {e.weakWords.length > 0
                            ? ` · Reforçar: ${e.weakWords.slice(0, 4).join(', ')}`
                            : ' · Pronúncia limpa!'}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 font-mono text-xs font-extrabold ${
                          e.score >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : e.score >= 65
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {e.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      ) : (
        <>
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          type="button"
          onClick={() =>
            setFilterStrength((f) => (f === 'due' ? 'all' : 'due'))
          }
          className={`rounded-2xl border p-4 text-left transition cursor-pointer ${
            filterStrength === 'due'
              ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-100'
              : 'border-slate-200 bg-white hover:border-blue-200'
          }`}
        >
          <p className="flex items-center gap-1.5 font-mono text-2xl font-extrabold text-blue-600">
            <Clock className="h-5 w-5" />
            <span>{counts.due}</span>
          </p>
          <p className="text-xs font-semibold text-slate-600">Para hoje (SM-2)</p>
        </button>

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

      {/* FLASHCARD & CLOZE MODE */}
      {(mode === 'flashcards' || mode === 'cloze') && (
        <div className="mx-auto max-w-xl space-y-4">
          {!activeCard ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              {scope === 'learned' && vocab.length === 0 ? (
                <>
                  <p className="mt-3 font-display text-lg font-bold text-slate-900">
                    Seu deck de revisão começa vazio de propósito!
                  </p>
                  <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-slate-600">
                    Assim como no Busuu e Duolingo, as palavras aparecem aqui automaticamente conforme você avança pela etapa de <strong>Vocabulário</strong> ou conclui cada unidade na trilha.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {onGoToLearn && (
                      <button
                        type="button"
                        onClick={onGoToLearn}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
                      >
                        Ir para a Trilha de Aulas
                      </button>
                    )}
                    {allCourseVocab && allCourseVocab.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setScope('catalog')}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        Espiar catálogo ({allCourseVocab.length} palavras)
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
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
                    Mostrar todos os {activeSourceVocab.length} cards
                  </button>
                </>
              )}
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
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                      {activeCard.category}
                    </span>
                    {topicTitleMap.get(activeCard.topicId) && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                        {topicTitleMap.get(activeCard.topicId)}
                      </span>
                    )}
                    {!unlockedIdSet.has(activeCard.id) && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                        Prévia (unidade futura)
                      </span>
                    )}
                  </div>
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

                {mode === 'cloze' ? (
                  (() => {
                    const cloze = buildClozePrompt(activeCard.exampleEn, activeCard.word);
                    return (
                      <div className="my-5 space-y-4">
                        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 text-center">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                            Complete a lacuna ({activeCard.translation})
                          </p>
                          <p className="mt-2 font-display text-xl font-extrabold text-slate-900">
                            “{cloze.maskedSentence}”
                          </p>
                          {activeCard.ipa && (
                            <p className="mt-1 font-mono text-xs text-slate-500">
                              Dica IPA: {activeCard.ipa}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <input
                            type="text"
                            data-testid="cloze-answer-input"
                            value={clozeInput}
                            onChange={(e) => setClozeInput(e.target.value)}
                            placeholder="Digite a palavra ou expressão..."
                            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            data-testid="cloze-check-btn"
                            onClick={() => {
                              const ok =
                                clozeInput.trim().toLowerCase() ===
                                cloze.answer.trim().toLowerCase();
                              setClozeChecked(ok);
                              setFlipped(true);
                            }}
                            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
                          >
                            Verificar
                          </button>
                        </div>
                        {clozeChecked !== null && (
                          <p
                            className={`rounded-xl px-3 py-2 text-xs font-bold ${
                              clozeChecked
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-rose-50 text-rose-800'
                            }`}
                          >
                            {clozeChecked
                              ? `Perfeito! Resposta: "${cloze.answer}"`
                              : `Esperado: "${cloze.answer}" — frase completa: "${activeCard.exampleEn}"`}
                          </p>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <>
                    <div className="my-6 text-center">
                      <h2 className="font-display text-3xl font-extrabold text-slate-900">
                        {languageCode === 'ja' && jaScriptMode === 'kana'
                          ? toJapaneseKana(activeCard.word)
                          : languageCode === 'he' && heScriptMode === 'modern'
                            ? stripHebrewNiqqud(activeCard.word)
                            : activeCard.word}
                      </h2>
                      <p className="mt-1.5 font-mono text-sm text-slate-400">
                        {activeCard.ipa}
                      </p>
                    </div>

                    {/* Contextual Example Sentence Preview (Front & Back) */}
                    <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Frase de exemplo
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-slate-800">
                          “
                          {languageCode === 'ja' && jaScriptMode === 'kana'
                            ? toJapaneseKana(activeCard.exampleEn)
                            : activeCard.exampleEn}
                          ”
                        </p>
                        {flipped && (
                          <p className="mt-0.5 text-xs text-slate-600">
                            {activeCard.examplePt}
                          </p>
                        )}
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
                  </>
                )}

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
                        Como você foi nessa palavra? (+5 XP · SM-2 · Atalhos 1–4)
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <button
                          type="button"
                          onClick={() => handleRate('again')}
                          className="rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 cursor-pointer"
                        >
                          <span>Errei</span>
                          <span className="mt-0.5 block font-mono text-[10px] opacity-80">
                            {previewNextIntervalLabel(activeCard, 'again')}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRate('hard')}
                          className="rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100 cursor-pointer"
                        >
                          <span>Difícil</span>
                          <span className="mt-0.5 block font-mono text-[10px] opacity-80">
                            {previewNextIntervalLabel(activeCard, 'hard')}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRate('good')}
                          className="rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 cursor-pointer"
                        >
                          <span>Bom</span>
                          <span className="mt-0.5 block font-mono text-[10px] opacity-80">
                            {previewNextIntervalLabel(activeCard, 'good')}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRate('easy')}
                          className="rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 cursor-pointer"
                        >
                          <span>Fácil</span>
                          <span className="mt-0.5 block font-mono text-[10px] opacity-80">
                            {previewNextIntervalLabel(activeCard, 'easy')}
                          </span>
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
        </>
      )}
      <HandsFreeAudioModal
        open={handsFreeOpen}
        cards={deck.length > 0 ? deck : activeSourceVocab}
        languageCode={languageCode}
        dialectCode={languageCode}
        onClose={() => setHandsFreeOpen(false)}
      />
    </div>
  );
}

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Headphones,
  Lightbulb,
  PenTool,
  Search,
} from 'lucide-react';
import { PodcastImmersionView } from './PodcastImmersionView';
import { ScriptStrokeTrainer } from './ScriptStrokeTrainer';
import {
  getGrammarGuideByLanguage,
  type GrammarReferenceEntry,
} from '../data/grammarGuide';
import type {
  CEFRLevel,
  LanguageCode,
  TipCategory,
  TipContent,
  Topic,
} from '../types/learning';
import { DualAudioButtons } from './DualAudioButtons';
import { TIP_CATEGORY_META } from './SkillBadge';
import { getImmersionStrings, isImmersionLevel } from '../utils/immersion';

interface TipsLibraryProps {
  topics: Topic[];
  languageCode?: LanguageCode;
  onPracticeTopic: (topic: Topic) => void;
  onPracticeTopicWithAI?: (topic: Topic) => void;
}

interface TipEntry {
  tip: TipContent;
  topic: Topic;
}

const FILTER_OPTIONS: { id: 'all' | TipCategory; label: string }[] = [
  { id: 'all', label: 'Todas as categorias' },
  { id: 'grammar', label: 'Gramática' },
  { id: 'pronunciation', label: 'Pronúncia' },
  { id: 'false_friend', label: 'Falsos Cognatos' },
  { id: 'culture', label: 'Cultura & Uso Real' },
];

export function TipsLibrary({
  topics,
  languageCode = 'en',
  onPracticeTopic,
  onPracticeTopicWithAI,
}: TipsLibraryProps) {
  const [viewMode, setViewMode] = useState<'tips' | 'guide' | 'scripts' | 'podcasts'>('tips');
  const [showB2C1Translation, setShowB2C1Translation] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | TipCategory>('all');
  const [levelFilter, setLevelFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [guideSection, setGuideSection] = useState<
    'ALL' | GrammarReferenceEntry['section']
  >('ALL');

  const grammarGuide = useMemo(
    () => getGrammarGuideByLanguage(languageCode),
    [languageCode],
  );

  const guideSections = useMemo(
    () =>
      [
        'ALL',
        ...Array.from(new Set(grammarGuide.map((entry) => entry.section))),
      ] as ('ALL' | GrammarReferenceEntry['section'])[],
    [grammarGuide],
  );

  const activeGuideSection = guideSections.includes(guideSection)
    ? guideSection
    : 'ALL';

  const allTips = useMemo<TipEntry[]>(() => {
    const list: TipEntry[] = [];
    for (const topic of topics) {
      for (const step of topic.steps) {
        if (step.type === 'tip') {
          list.push({ tip: step.tip, topic });
        }
      }
    }
    return list;
  }, [topics]);

  const filteredTips = useMemo(() => {
    return allTips.filter(({ tip, topic }) => {
      if (category !== 'all' && tip.category !== category) return false;
      if (levelFilter !== 'ALL' && topic.level !== levelFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        tip.title.toLowerCase().includes(q) ||
        tip.summary.toLowerCase().includes(q) ||
        tip.details.toLowerCase().includes(q) ||
        topic.titlePt.toLowerCase().includes(q)
      );
    });
  }, [allTips, category, levelFilter, search]);

  const filteredGuide = useMemo(() => {
    return grammarGuide.filter((entry) => {
      if (activeGuideSection !== 'ALL' && entry.section !== activeGuideSection)
        return false;
      if (levelFilter !== 'ALL' && entry.level !== levelFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.usage.toLowerCase().includes(q) ||
        entry.keywords.toLowerCase().includes(q) ||
        entry.aff.toLowerCase().includes(q)
      );
    });
  }, [grammarGuide, activeGuideSection, levelFilter, search]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
            <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
            Biblioteca & Guia Gramatical · {allTips.length} dicas + {grammarGuide.length} tabelas
          </span>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
            Central de Dicas & Guia Gramatical
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Consulte dicas rápidas das lições ou o Guia Completo de Tempos, Modais, Passiva, Relatos e Question Tags.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start">
          <div className="inline-flex flex-wrap rounded-2xl border border-slate-200 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('tips')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                viewMode === 'tips'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span>Dicas ({allTips.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('guide')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                viewMode === 'guide'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Guia ({grammarGuide.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('scripts')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                viewMode === 'scripts'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <PenTool className="h-3.5 w-3.5" />
              <span>Escrita &amp; Traços</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('podcasts')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                viewMode === 'podcasts'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Headphones className="h-3.5 w-3.5" />
              <span>Podcasts</span>
            </button>
          </div>

          {(viewMode === 'tips' || viewMode === 'guide') && (
            <button
              type="button"
              onClick={() => setShowB2C1Translation((v) => !v)}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
                showB2C1Translation
                  ? 'border-indigo-400 bg-indigo-100 text-indigo-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              🌐 {showB2C1Translation ? 'Ocultar Tradução B2/C1' : 'Mostrar Tradução PT (B2/C1)'}
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters (tips & guide only) */}
      {(viewMode === 'tips' || viewMode === 'guide') && (
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              viewMode === 'tips'
                ? 'Buscar dica (ex: actually, push, present perfect, stative, question tag)...'
                : 'Buscar tópico gramatical (ex: Past Perfect, Stative, Gerund, Will, Question Tags)...'
            }
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {viewMode === 'tips' ? (
            <div className="flex flex-wrap gap-1.5">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCategory(opt.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                    category === opt.id
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {guideSections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setGuideSection(sec)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    activeGuideSection === sec
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {sec === 'ALL' ? 'Todas as seções' : sec}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-bold transition cursor-pointer ${
                  levelFilter === lvl
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {lvl === 'ALL' ? 'Todos' : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* TOPIC TIPS GRID */}
      {viewMode === 'tips' &&
        (filteredTips.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-display text-base font-bold text-slate-800">
              Nenhuma dica encontrada para essa busca.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('all');
                setLevelFilter('ALL');
              }}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredTips.map(({ tip, topic }) => {
              const cat = TIP_CATEGORY_META[tip.category];
              const CatIcon = cat.Icon;

              return (
                <article
                  key={`${topic.id}-${tip.id}`}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:border-slate-300"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${cat.bg} ${cat.text}`}
                      >
                        <CatIcon className="h-3 w-3" />
                        {cat.label}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        {topic.level} · {topic.titlePt}
                      </span>
                    </div>

                    <h2 className="mt-3 font-display text-lg font-bold text-slate-900">
                      {tip.title}
                    </h2>
                    <p className="mt-1.5 rounded-xl bg-amber-50/70 px-3 py-2 text-xs font-semibold text-amber-950">
                      {tip.summary}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {tip.details}
                    </p>

                    {tip.grammarFormula && (
                      <div className="mt-3 space-y-1 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 p-3 font-mono text-[11px] text-emerald-950">
                        <p>{tip.grammarFormula.aff}</p>
                        <p>{tip.grammarFormula.neg}</p>
                        <p>{tip.grammarFormula.int}</p>
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      {tip.examples.map((ex, i) => (
                        <div
                          key={i}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50 p-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900">{ex.en}</p>
                            <p className="text-[11px] text-slate-500">{ex.pt}</p>
                          </div>
                          <DualAudioButtons
                            text={ex.en}
                            languageCode={topic.languageCode ?? 'en'}
                            size="xs"
                          />
                        </div>
                      ))}
                    </div>

                    {tip.warning && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50/80 p-2.5 text-[11px] leading-relaxed text-rose-900">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600" />
                        <span>{tip.warning}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => onPracticeTopic(topic)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      <span>Praticar no tópico: {isImmersionLevel(topic.level) ? topic.titleEn : topic.titlePt}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    {onPracticeTopicWithAI && (
                      <button
                        type="button"
                        onClick={() => onPracticeTopicWithAI(topic)}
                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                      >
                        {getImmersionStrings(languageCode, topic.level).practiceWithAiBtn}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ))}

      {/* SWJ GRAMMAR REFERENCE GUIDE */}
      {viewMode === 'guide' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredGuide.map((entry) => (
            <article
              key={entry.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                    {entry.section}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isImmersionLevel(entry.level) && (
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                        {getImmersionStrings(languageCode, entry.level).badgeLabel}
                      </span>
                    )}
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-600">
                      {entry.level}
                    </span>
                  </div>
                </div>

                <h2 className="mt-2.5 font-display text-lg font-extrabold text-slate-900">
                  {entry.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {entry.usage}
                </p>
                <p className="mt-2 text-[11px] text-slate-500">
                  <strong className="text-slate-700">Expressões comuns:</strong>{' '}
                  {entry.keywords}
                </p>

                <div className="mt-3 space-y-1.5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 p-3.5 font-mono text-[11px] text-emerald-950">
                  <p>
                    <span className="font-bold text-emerald-700">[+]</span> {entry.aff}
                  </p>
                  <p>
                    <span className="font-bold text-rose-700">[-]</span> {entry.neg}
                  </p>
                  <p>
                    <span className="font-bold text-blue-700">[?]</span> {entry.int}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900">{entry.exampleEn}</p>
                    <p className="text-[11px] text-slate-500">{entry.examplePt}</p>
                  </div>
                  <DualAudioButtons
                    text={entry.exampleEn}
                    languageCode={languageCode}
                    size="xs"
                  />
                </div>

                {entry.note && (
                  <p className="mt-2.5 text-[11px] font-medium text-amber-900">
                    💡 {entry.note}
                  </p>
                )}
                {showB2C1Translation && isImmersionLevel(entry.level) && (
                  <p className="mt-2 rounded-xl bg-indigo-50 px-3 py-1.5 text-[11px] font-medium text-indigo-900">
                    🌐 PT: {entry.examplePt}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {viewMode === 'scripts' && (
        <ScriptStrokeTrainer languageCode={languageCode} />
      )}

      {viewMode === 'podcasts' && (
        <PodcastImmersionView languageCode={languageCode} />
      )}
    </div>
  );
}

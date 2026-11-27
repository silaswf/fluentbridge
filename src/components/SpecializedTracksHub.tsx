/**
 * @file src/components/SpecializedTracksHub.tsx
 * @description Hub visual de Trilhas Especializadas Inéditas (Negócios, Tecnologia, Saúde e Viagens) com filtros, progresso, prévia de vocabulário/dicas e início direto da unidade.
 * @exports SpecializedTracksHub, SpecializedTracksHubProps
 */
import { useMemo, useState } from 'react';
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  Cpu,
  HeartPulse,
  Lightbulb,
  Plane,
  Play,
  Sparkles,
} from 'lucide-react';
import type { LanguageCode, Topic, VocabCard } from '../types/learning';
import {
  getSpecializedTrackTopics,
  SPECIALIZED_TRACKS_META,
  type SpecializedTrackId,
  type SpecializedTrackMeta,
} from '../data/specializedTracks';

export interface SpecializedTracksHubProps {
  languageCode: LanguageCode;
  completedTopicIds?: string[];
  onStartTopic: (topic: Topic, topicVocab: VocabCard[]) => void;
}

function TrackIcon({ icon, className }: { icon: SpecializedTrackMeta['icon']; className?: string }) {
  switch (icon) {
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Plane':
      return <Plane className={className} />;
  }
}

export function SpecializedTracksHub({
  languageCode,
  completedTopicIds = [],
  onStartTopic,
}: SpecializedTracksHubProps) {
  const [selectedTrack, setSelectedTrack] = useState<SpecializedTrackId | 'all'>('all');

  const completedSet = useMemo(() => new Set(completedTopicIds), [completedTopicIds]);
  const allTopics = useMemo(() => getSpecializedTrackTopics(languageCode), [languageCode]);

  const trackProgress = useMemo(() => {
    const map = new Map<SpecializedTrackId, { done: number; total: number }>();
    for (const meta of SPECIALIZED_TRACKS_META) {
      const units = allTopics.filter((t) => t.id.startsWith(`spec-${languageCode}-${meta.id}-`));
      const done = units.filter((u) => completedSet.has(u.id)).length;
      map.set(meta.id, { done, total: units.length });
    }
    return map;
  }, [allTopics, completedSet, languageCode]);

  const totalDone = useMemo(
    () => allTopics.filter((t) => completedSet.has(t.id)).length,
    [allTopics, completedSet],
  );

  const visibleTracks = useMemo(
    () =>
      selectedTrack === 'all'
        ? SPECIALIZED_TRACKS_META
        : SPECIALIZED_TRACKS_META.filter((m) => m.id === selectedTrack),
    [selectedTrack],
  );

  return (
    <div data-testid="specialized-tracks-hub" className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50 via-white to-cyan-50/70 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-800">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Trilhas Especializadas Inéditas</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900">
              Domínio Profissional & Mobilidade Global
            </h2>
            <p className="max-w-2xl text-sm text-slate-600">
              12 unidades exclusivas com vocabulário técnico de alta precisão e dicas pragmáticas inéditas — sem repetir conteúdos da trilha principal.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-right shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Progresso Geral
            </p>
            <p className="font-display text-xl font-extrabold text-indigo-700">
              {totalDone} / {allTopics.length} unidades
            </p>
            <div className="mt-1.5 h-2 w-36 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{
                  width: `${allTopics.length > 0 ? Math.round((totalDone / allTopics.length) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Track Filter Tabs */}
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar trilha especializada">
          <button
            type="button"
            role="tab"
            aria-selected={selectedTrack === 'all'}
            onClick={() => setSelectedTrack('all')}
            className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${
              selectedTrack === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Todas ({allTopics.length})
          </button>
          {SPECIALIZED_TRACKS_META.map((meta) => {
            const prog = trackProgress.get(meta.id) ?? { done: 0, total: 3 };
            const active = selectedTrack === meta.id;
            return (
              <button
                key={meta.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedTrack(meta.id)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${
                  active
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <TrackIcon icon={meta.icon} className="h-3.5 w-3.5" />
                <span>{meta.titlePt}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {prog.done}/{prog.total}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tracks & Units */}
      <div className="space-y-6">
        {visibleTracks.map((meta) => {
          const units = allTopics.filter((t) => t.id.startsWith(`spec-${languageCode}-${meta.id}-`));
          const prog = trackProgress.get(meta.id) ?? { done: 0, total: units.length };
          const pct = prog.total > 0 ? Math.round((prog.done / prog.total) * 100) : 0;

          return (
            <section
              key={meta.id}
              data-testid={`specialized-track-${meta.id}`}
              className={`rounded-3xl border p-5 ${meta.borderClass} ${meta.bgClass}`}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-xs"
                    style={{ backgroundColor: meta.accentColor }}
                  >
                    <TrackIcon icon={meta.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-extrabold text-slate-900">
                        {meta.titlePt}
                      </h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.badgeClass}`}>
                        {meta.badgePt}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{meta.subtitlePt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-700">
                    {prog.done}/{prog.total} concluídas ({pct}%)
                  </span>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-white/80">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: meta.accentColor }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {units.map((topic) => {
                  const isDone = completedSet.has(topic.id);
                  const vocabStep = topic.steps.find((s) => s.type === 'vocab_intro');
                  const allVocabCards: VocabCard[] =
                    vocabStep && vocabStep.type === 'vocab_intro' ? vocabStep.cards : [];
                  const vocabPreview: VocabCard[] = allVocabCards.slice(0, 4);
                  const tipStep = topic.steps.find((s) => s.type === 'tip');
                  const tipTitle = tipStep && tipStep.type === 'tip' ? tipStep.tip.title : topic.topicTipsSummary[0];

                  return (
                    <article
                      key={topic.id}
                      className="flex flex-col justify-between rounded-2xl border border-white/90 bg-white p-4 shadow-xs transition hover:shadow-md"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-700">
                            CEFR {topic.level}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                            <Clock className="h-3 w-3" />
                            {topic.estimatedMinutes} min
                          </span>
                        </div>

                        <div>
                          <h4 className="font-display text-base font-extrabold leading-snug text-slate-900">
                            {topic.titlePt}
                          </h4>
                          <p className="mt-1 text-xs text-slate-600">{topic.subtitle}</p>
                        </div>

                        {/* Specialized Vocab Preview */}
                        {vocabPreview.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                              <BookOpen className="h-3 w-3" />
                              Vocabulário-chave
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {vocabPreview.map((v) => (
                                <span
                                  key={v.id}
                                  title={`${v.word} — ${v.translation}`}
                                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-800"
                                >
                                  {v.word}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Specialized Tip Preview */}
                        {tipTitle && (
                          <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-2.5">
                            <p className="flex items-start gap-1.5 text-[11px] font-bold text-amber-900">
                              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                              <span>{tipTitle}</span>
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-2">
                        <button
                          type="button"
                          onClick={() => onStartTopic(topic, allVocabCards)}
                          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                            isDone
                              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              <span>Revisar Unidade</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3.5 w-3.5 fill-current" />
                              <span>Estudar Unidade</span>
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

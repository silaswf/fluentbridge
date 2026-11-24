import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  Play,
  Square,
  Tv,
  XCircle,
} from 'lucide-react';
import {
  PODCAST_EPISODES,
  type PodcastEpisode,
} from '../data/podcastEpisodes';
import type { LanguageCode } from '../types/learning';
import type { ImmersionCheckpoint } from '../utils/immersionExpander';
import {
  loadJapaneseScriptMode,
  saveJapaneseScriptMode,
  toJapaneseKana,
  type JapaneseScriptMode,
} from '../utils/japaneseKana';
import { speakText, stopSpeaking } from '../utils/speech';

interface PodcastImmersionViewProps {
  languageCode: LanguageCode;
  initialEpisodeId?: string;
  onStartShadowingText?: (text: string, dialectCode: string) => void;
  onCompleteEpisode?: (episodeId: string, scorePercent: number) => void;
}

export function PodcastImmersionView({
  languageCode,
  initialEpisodeId,
  onCompleteEpisode,
}: PodcastImmersionViewProps) {
  const episodes = PODCAST_EPISODES.filter(
    (e) => e.languageCode === languageCode,
  );
  const [selectedId, setSelectedId] = useState(
    initialEpisodeId || episodes[0]?.id || '',
  );
  const activeEp: PodcastEpisode | undefined =
    episodes.find((e) => e.id === selectedId) ?? episodes[0];

  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null);
  const [speed, setSpeed] = useState<0.75 | 1 | 1.2>(1);
  const [showTranslations, setShowTranslations] = useState(false);
  const [jaScriptMode, setJaScriptMode] = useState<JapaneseScriptMode>(() =>
    loadJapaneseScriptMode(),
  );
  const [activeCheckpoint, setActiveCheckpoint] = useState<ImmersionCheckpoint | null>(
    null,
  );
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<string, number>>(
    {},
  );
  const [pickedOpt, setPickedOpt] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const cancelRef = useRef(false);

  useEffect(() => {
    setSelectedId(initialEpisodeId || episodes[0]?.id || '');
    setPickedOpt(null);
    setChecked(false);
    setActiveCheckpoint(null);
    setCheckpointAnswers({});
    cancelRef.current = true;
    stopSpeaking();
    setActiveLineIdx(null);
  }, [languageCode, initialEpisodeId]);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
      stopSpeaking();
    };
  }, []);

  const playFrom = (idx: number, sequential: boolean) => {
    if (!activeEp) return;
    const line = activeEp.lines[idx];
    if (!line) {
      setActiveLineIdx(null);
      return;
    }
    cancelRef.current = false;
    speakText(line.text, {
      langCode: line.dialectCode,
      voice: line.voice,
      rate: speed,
      onStart: () => setActiveLineIdx(idx),
      onEnd: () => {
        if (!sequential || cancelRef.current) {
          setActiveLineIdx(null);
          return;
        }
        const cp = activeEp.checkpoints.find((c) => c.afterLineIdx === idx);
        if (cp && checkpointAnswers[cp.id] === undefined) {
          setActiveLineIdx(null);
          setActiveCheckpoint(cp);
          return;
        }
        if (idx + 1 < activeEp.lines.length) {
          playFrom(idx + 1, true);
        } else {
          setActiveLineIdx(null);
        }
      },
    });
  };

  if (!activeEp) return null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
            <Headphones className="h-4.5 w-4.5 text-indigo-600" />
            <span>Podcasts Curtos &amp; Imersão Multi-Voz (A1–C1)</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Episódios curtos de ~2 min com duas vozes neurais sincronizadas, controle de velocidade e compreensão auditiva.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {languageCode === 'ja' && (
            <button
              type="button"
              onClick={() => {
                const next: JapaneseScriptMode =
                  jaScriptMode === 'standard' ? 'kana' : 'standard';
                setJaScriptMode(next);
                saveJapaneseScriptMode(next);
              }}
              className="rounded-lg border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-bold text-violet-800 cursor-pointer"
            >
              {jaScriptMode === 'kana' ? 'あいう Kana' : '漢字 Padrão'}
            </button>
          )}
          {([0.75, 1, 1.2] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSpeed(r)}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition cursor-pointer ${
                speed === r
                  ? 'bg-indigo-600 text-white'
                  : 'border border-indigo-200 bg-white text-indigo-700'
              }`}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>

      {/* Episode Selector */}
      <div className="flex flex-wrap gap-2">
        {episodes.map((ep) => (
          <button
            key={ep.id}
            type="button"
            onClick={() => {
              cancelRef.current = true;
              stopSpeaking();
              setActiveLineIdx(null);
              setSelectedId(ep.id);
              setPickedOpt(null);
              setChecked(false);
            }}
            className={`rounded-xl border px-3 py-2 text-left text-xs transition cursor-pointer ${
              activeEp.id === ep.id
                ? 'border-indigo-500 bg-indigo-600 text-white shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="font-mono text-[10px] font-bold opacity-80">
              {ep.level} · {ep.durationLabel}
            </span>
            <p className="font-bold">{ep.titleTarget}</p>
          </button>
        ))}
      </div>

      {/* Active Episode Player */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-indigo-700">
              {activeEp.level} · {activeEp.titlePt}
            </span>
            <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900">
              {activeEp.titleTarget}
            </h3>
            <p className="text-xs text-slate-500">{activeEp.themePt}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTranslations((v) => !v)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {showTranslations ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Ocultar PT</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>Mostrar PT</span>
                </>
              )}
            </button>

            {activeLineIdx !== null ? (
              <button
                type="button"
                onClick={() => {
                  cancelRef.current = true;
                  stopSpeaking();
                  setActiveLineIdx(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white cursor-pointer"
              >
                <Square className="h-3.5 w-3.5 fill-white" />
                <span>Parar episódio</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => playFrom(0, true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Ouvir episódio completo</span>
              </button>
            )}
          </div>
        </div>

        {/* Synchronized Script */}
        <div className="space-y-2.5">
          {activeEp.lines.map((line, idx) => {
            const isActive = activeLineIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => playFrom(idx, false)}
                className={`w-full rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                  isActive
                    ? 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700">
                  <span>{line.speaker}</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Clique para repetir fala
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {languageCode === 'ja' && jaScriptMode === 'kana'
                    ? toJapaneseKana(line.text)
                    : line.text}
                </p>
                {showTranslations && (
                  <p className="mt-0.5 text-xs text-slate-600">
                    {line.translationPt}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Mid-Episode In-Audio Checkpoint (pauses playback until answered) */}
        {activeCheckpoint && (
          <div
            data-testid="podcast-mid-checkpoint"
            className="animate-fade-up rounded-2xl border-2 border-indigo-400 bg-indigo-50 p-4 space-y-3"
          >
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
              Checagem durante o episódio (Fala #{activeCheckpoint.afterLineIdx + 1})
            </p>
            <p className="text-sm font-bold text-slate-900">{activeCheckpoint.question}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {activeCheckpoint.options.map((opt, oIdx) => {
                const answered = checkpointAnswers[activeCheckpoint.id];
                const isAnswered = answered !== undefined;
                const isCorrect = isAnswered && oIdx === activeCheckpoint.correctIndex;
                const isWrong = isAnswered && answered === oIdx && !isCorrect;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => {
                      const updated = { ...checkpointAnswers, [activeCheckpoint.id]: oIdx };
                      setCheckpointAnswers(updated);
                      if (Object.keys(updated).length >= activeEp.checkpoints.length) {
                        const hits = activeEp.checkpoints.filter(
                          (c) => updated[c.id] === c.correctIndex,
                        ).length;
                        onCompleteEpisode?.(
                          activeEp.id,
                          Math.round((hits / activeEp.checkpoints.length) * 100),
                        );
                      }
                    }}
                    className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold cursor-pointer ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : isWrong
                          ? 'border-rose-400 bg-rose-50 text-rose-900'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {checkpointAnswers[activeCheckpoint.id] !== undefined && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <p className="text-xs font-semibold text-indigo-900">
                  {activeCheckpoint.explanationPt}
                </p>
                {activeCheckpoint.afterLineIdx + 1 < activeEp.lines.length && (
                  <button
                    type="button"
                    onClick={() => {
                      const nextIdx = activeCheckpoint.afterLineIdx + 1;
                      setActiveCheckpoint(null);
                      playFrom(nextIdx, true);
                    }}
                    className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    Continuar episódio →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quick Comprehension Check + Checkpoints Summary */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-900">
              Compreensão do episódio: {activeEp.question}
            </p>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-indigo-800">
              {activeEp.checkpoints.length} checagens no áudio
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {activeEp.options.map((opt, oIdx) => {
              const isSelected = pickedOpt === oIdx;
              const isCorrect = checked && oIdx === activeEp.correctIndex;
              const isWrong = checked && isSelected && oIdx !== activeEp.correctIndex;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => {
                    setPickedOpt(oIdx);
                    setChecked(true);
                  }}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition cursor-pointer ${
                    isCorrect
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                      : isWrong
                        ? 'border-rose-400 bg-rose-50 text-rose-900'
                        : isSelected
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt}</span>
                  {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  {isWrong && <XCircle className="h-4 w-4 text-rose-600" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <Tv className="h-4 w-4 shrink-0 text-indigo-600" />
          <span>
            <strong>Imersão em vídeo recomendada:</strong> {activeEp.videoTipPt}
          </span>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import {
  BookmarkCheck,
  BookmarkPlus,
  Clapperboard,
  Eye,
  EyeOff,
  Pause,
  Play,
  Repeat,
  Volume2,
  X,
} from 'lucide-react';
import {
  getInteractiveVideosByLanguage,
  lookupSubtitleWord,
  type InteractiveSubtitleLine,
  type InteractiveVideoClip,
  type VideoWordToken,
} from '../data/interactiveVideos';
import { DEFAULT_BACKEND_API_URL } from '../config/appConfig';
import type { LanguageCode } from '../types/learning';
import { getSupabaseAccessToken } from '../utils/cloudSync';
import { isRtlLanguage } from '../utils/platform';
import { speakText, stopSpeaking } from '../utils/speech';

interface InteractiveVideoViewProps {
  languageCode: LanguageCode;
  savedWords?: Set<string>;
  onSaveWordToDeck?: (payload: {
    word: string;
    translation: string;
    ipa: string;
    exampleEn: string;
    examplePt: string;
    category: string;
  }) => void;
}

export function InteractiveVideoView({
  languageCode,
  savedWords = new Set<string>(),
  onSaveWordToDeck,
}: InteractiveVideoViewProps) {
  const clips = getInteractiveVideosByLanguage(languageCode);
  const [selectedId, setSelectedId] = useState(clips[0]?.id ?? '');
  const activeClip: InteractiveVideoClip | undefined =
    clips.find((c) => c.id === selectedId) ?? clips[0];

  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopLine, setLoopLine] = useState(false);
  const [showPtSubtitle, setShowPtSubtitle] = useState(true);
  const [speed, setSpeed] = useState<0.75 | 1 | 1.15>(1);
  const [inspected, setInspected] = useState<{
    token: VideoWordToken;
    line: InteractiveSubtitleLine;
  } | null>(null);
  const [recentlySaved, setRecentlySaved] = useState<Set<string>>(new Set());
  const [r2VideoMap, setR2VideoMap] = useState<Record<string, string>>({});
  const [uploadMsg, setUploadMsg] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const cancelRef = useRef(false);
  const loopRef = useRef(loopLine);
  loopRef.current = loopLine;

  useEffect(() => {
    setSelectedId(clips[0]?.id ?? '');
    setCurrentLineIdx(0);
    setIsPlaying(false);
    setInspected(null);
    cancelRef.current = true;
    stopSpeaking();
  }, [languageCode]);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
      stopSpeaking();
    };
  }, []);

  if (!activeClip) return null;

  const activeLine = activeClip.lines[currentLineIdx] ?? activeClip.lines[0];
  const rtl = isRtlLanguage(languageCode);

  const playLineAt = (idx: number, advance: boolean) => {
    const line = activeClip.lines[idx];
    if (!line) {
      setIsPlaying(false);
      return;
    }
    cancelRef.current = false;
    setCurrentLineIdx(idx);
    setIsPlaying(true);

    speakText(line.textTarget, {
      langCode: line.dialectCode,
      voice: line.voice,
      rate: speed,
      onEnd: () => {
        if (cancelRef.current) {
          setIsPlaying(false);
          return;
        }
        if (loopRef.current) {
          playLineAt(idx, advance);
          return;
        }
        if (advance && idx + 1 < activeClip.lines.length) {
          playLineAt(idx + 1, true);
        } else {
          setIsPlaying(false);
        }
      },
    });
  };

  const pausePlayback = () => {
    cancelRef.current = true;
    stopSpeaking();
    setIsPlaying(false);
  };

  const handleClickWord = (line: InteractiveSubtitleLine, rawWord: string) => {
    pausePlayback();
    const token = lookupSubtitleWord(line, rawWord);
    setInspected({ token, line });
    speakText(token.surface, { langCode: line.dialectCode, rate: 0.9 });
  };

  const handleSaveInspected = () => {
    if (!inspected || !onSaveWordToDeck) return;
    const wordKey = inspected.token.lemma.toLowerCase();
    onSaveWordToDeck({
      word: inspected.token.lemma,
      translation: inspected.token.translationPt,
      ipa: inspected.token.ipa,
      exampleEn: inspected.line.textTarget,
      examplePt: inspected.line.textPt,
      category: `Vídeo · ${activeClip.categoryPt}`,
    });
    setRecentlySaved((prev) => new Set(prev).add(wordKey));
  };

  const isInspectedSaved = inspected
    ? savedWords.has(inspected.token.lemma.toLowerCase()) ||
      recentlySaved.has(inspected.token.lemma.toLowerCase())
    : false;

  const activeVideoUrl = r2VideoMap[activeClip.id] || activeClip.videoUrl;

  const handleUploadR2Video = async (file: File) => {
    const apiBase = DEFAULT_BACKEND_API_URL.trim().replace(/\/+$/, '');
    if (!apiBase) return;
    setUploadMsg('Enviando MP4 para o Cloudflare R2...');
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('key', `${activeClip.id}-${file.name}`);
      const token = await getSupabaseAccessToken();
      const res = await fetch(`${apiBase}/api/media/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });
      if (!res.ok) {
        setUploadMsg(`Falha no envio (${res.status}).`);
        return;
      }
      const data = (await res.json()) as { ok?: boolean; url?: string };
      if (data.ok && data.url) {
        setR2VideoMap((prev) => ({ ...prev, [activeClip.id]: data.url! }));
        setUploadMsg('Vídeo hospedado no Cloudflare R2!');
      }
    } catch {
      setUploadMsg('Erro de rede ao enviar vídeo.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
            <Clapperboard className="h-4.5 w-4.5 text-indigo-600" />
            <span>Vídeos Curtos com Legendas Duplas Clicáveis</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Clique em <strong>qualquer palavra da legenda</strong> para ver tradução, IPA, ouvir a pronúncia e salvar direto no seu Deck SM-2.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {([0.75, 1, 1.15] as const).map((r) => (
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

      {/* Clip Selector */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {clips.map((clip) => {
          const active = clip.id === activeClip.id;
          return (
            <button
              key={clip.id}
              type="button"
              onClick={() => {
                pausePlayback();
                setSelectedId(clip.id);
                setCurrentLineIdx(0);
                setInspected(null);
              }}
              className={`rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                active
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold opacity-85">
                <span>
                  {clip.level} · {clip.categoryPt}
                </span>
                <span className="font-mono">{clip.durationLabel}</span>
              </div>
              <p className="mt-1 font-display text-xs font-extrabold">{clip.titleTarget}</p>
              <p className={`text-[11px] ${active ? 'text-indigo-100' : 'text-slate-500'}`}>
                {clip.titlePt}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Video Stage */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-lg">
        <div
          className={`relative flex min-h-[260px] flex-col justify-between bg-gradient-to-br ${activeClip.gradientClass} p-5 text-white sm:p-7`}
        >
          {/* Top Scene Overlay */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[10px] font-bold backdrop-blur-xs">
                {activeClip.level} · {activeClip.sceneSettingPt}
              </span>
              <h3 className="mt-1.5 font-display text-lg font-extrabold">
                {activeClip.titleTarget}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="inline-flex items-center gap-1 rounded-xl bg-white/15 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-white/25 cursor-pointer">
                <span>Subir MP4 (R2)</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleUploadR2Video(f);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => setShowPtSubtitle((v) => !v)}
                className="inline-flex items-center gap-1 rounded-xl bg-white/15 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-white/25 cursor-pointer"
              >
                {showPtSubtitle ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                <span>{showPtSubtitle ? 'Legenda Dupla' : 'Só Idioma'}</span>
              </button>
              <button
                type="button"
                onClick={() => setLoopLine((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[11px] font-bold cursor-pointer ${
                  loopLine ? 'bg-amber-400 text-slate-950' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <Repeat className="h-3.5 w-3.5" />
                <span>Loop</span>
              </button>
            </div>
          </div>

          {/* Optional Real MP4/WebM Video Stream from Cloudflare R2 */}
          {activeVideoUrl && (
            <video
              ref={videoRef}
              src={activeVideoUrl}
              controls
              playsInline
              onTimeUpdate={(e) => {
                const vid = e.currentTarget;
                if (!vid.duration || activeClip.lines.length === 0) return;
                const ratio = vid.currentTime / vid.duration;
                const nextIdx = Math.min(
                  activeClip.lines.length - 1,
                  Math.floor(ratio * activeClip.lines.length),
                );
                if (nextIdx !== currentLineIdx) setCurrentLineIdx(nextIdx);
              }}
              className="mt-3 max-h-60 w-full rounded-2xl border border-white/15 bg-black"
            />
          )}

          {/* Interactive Dual Subtitle Stage */}
          {activeLine && (
            <div className="my-5 rounded-2xl border border-white/15 bg-slate-950/75 p-4 text-center backdrop-blur-md">
              <p className="mb-1.5 text-[11px] font-bold tracking-wider text-sky-300 uppercase">
                {activeLine.speaker} {isPlaying ? '· Falando...' : '· Toque em uma palavra'}
              </p>

              <div
                dir={rtl ? 'rtl' : 'ltr'}
                className="flex flex-wrap items-center justify-center gap-1.5 text-base font-extrabold leading-relaxed sm:text-lg"
              >
                {activeLine.textTarget.split(/\s+/).map((word, wIdx) => (
                  <button
                    key={`${activeLine.id}-${wIdx}`}
                    type="button"
                    data-testid="subtitle-word-btn"
                    onClick={() => handleClickWord(activeLine, word)}
                    className="rounded-lg px-1.5 py-0.5 text-white transition hover:bg-amber-300 hover:text-slate-950 focus:outline-none cursor-pointer"
                  >
                    {word}
                  </button>
                ))}
              </div>

              {showPtSubtitle && (
                <p className="mt-2 text-xs font-medium text-slate-300">
                  {activeLine.textPt}
                </p>
              )}
              {uploadMsg && (
                <p className="mt-2 text-[11px] font-bold text-emerald-300">
                  {uploadMsg}
                </p>
              )}
            </div>
          )}

          {/* Controls & Segment Timeline */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => (isPlaying ? pausePlayback() : playLineAt(currentLineIdx, true))}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 cursor-pointer"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
              <span>{isPlaying ? 'Pausar Cena' : 'Reproduzir Cena'}</span>
            </button>

            <div className="flex flex-1 items-center gap-1.5">
              {activeClip.lines.map((ln, idx) => (
                <button
                  key={ln.id}
                  type="button"
                  onClick={() => playLineAt(idx, true)}
                  title={`Fala ${idx + 1}: ${ln.speaker}`}
                  className={`h-2.5 flex-1 rounded-full transition cursor-pointer ${
                    idx === currentLineIdx
                      ? 'bg-amber-400'
                      : idx < currentLineIdx
                        ? 'bg-blue-400/70'
                        : 'bg-white/20 hover:bg-white/35'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-[11px] font-bold text-slate-300">
              {currentLineIdx + 1}/{activeClip.lines.length}
            </span>
          </div>
        </div>

        {/* Word Inspector Popover */}
        {inspected && (
          <div
            data-testid="video-word-popover"
            className="animate-fade-up border-t border-slate-700 bg-slate-900 p-4 text-white sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg font-extrabold text-amber-300">
                    {inspected.token.lemma}
                  </span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-sky-300">
                    {inspected.token.ipa}
                  </span>
                  <span className="rounded-full bg-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-200">
                    {inspected.token.partOfSpeech}
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-white">
                  {inspected.token.translationPt}
                </p>
                <p className="mt-0.5 text-xs text-slate-300">
                  {inspected.token.notePt}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    speakText(inspected.token.surface, {
                      langCode: inspected.line.dialectCode,
                      rate: 0.85,
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 cursor-pointer"
                >
                  <Volume2 className="h-3.5 w-3.5 text-sky-400" />
                  <span>Ouvir</span>
                </button>

                {onSaveWordToDeck && (
                  <button
                    type="button"
                    data-testid="video-save-sm2-btn"
                    disabled={isInspectedSaved}
                    onClick={handleSaveInspected}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      isInspectedSaved
                        ? 'bg-emerald-600/30 text-emerald-300 ring-1 ring-emerald-500/40 cursor-default'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    {isInspectedSaved ? (
                      <>
                        <BookmarkCheck className="h-3.5 w-3.5" />
                        <span>No seu Deck SM-2</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="h-3.5 w-3.5" />
                        <span>+ Salvar no Deck SM-2</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setInspected(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
                  aria-label="Fechar tradução"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Interactive Script Below */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-2.5">
        <p className="text-xs font-bold text-slate-500 uppercase">
          Roteiro Interativo Completo (clique na fala para ouvir ou em qualquer palavra)
        </p>
        {activeClip.lines.map((ln, idx) => {
          const isCurrent = idx === currentLineIdx;
          return (
            <div
              key={ln.id}
              className={`rounded-2xl border p-3 transition ${
                isCurrent
                  ? 'border-indigo-400 bg-indigo-50/70'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-indigo-700">{ln.speaker}</span>
                <button
                  type="button"
                  onClick={() => playLineAt(idx, false)}
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 cursor-pointer"
                >
                  <Play className="h-3 w-3 text-indigo-600" />
                  <span>Ouvir fala</span>
                </button>
              </div>
              <div
                dir={rtl ? 'rtl' : 'ltr'}
                className="mt-1 flex flex-wrap gap-1 text-sm font-bold text-slate-900"
              >
                {ln.textTarget.split(/\s+/).map((w, wi) => (
                  <button
                    key={wi}
                    type="button"
                    onClick={() => handleClickWord(ln, w)}
                    className="rounded px-0.5 hover:bg-amber-200 hover:text-slate-950 cursor-pointer"
                  >
                    {w}
                  </button>
                ))}
              </div>
              {showPtSubtitle && (
                <p className="mt-0.5 text-xs text-slate-600">{ln.textPt}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

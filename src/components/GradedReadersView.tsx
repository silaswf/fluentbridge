import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Check, Play, Plus, Square, Volume2 } from 'lucide-react';
import type { LanguageCode } from '../types/learning';
import { getGradedReaderByLanguage } from '../data/gradedReaders';
import { speakText, stopSpeaking } from '../utils/speech';

interface GradedReadersViewProps {
  languageCode: LanguageCode;
  dialectCode: string;
  onAddWordToSrs?: (card: { word: string; translation: string; ipa: string; exampleEn: string; examplePt: string }) => void;
}

export function GradedReadersView({
  languageCode,
  dialectCode,
  onAddWordToSrs,
}: GradedReadersViewProps) {
  const book = useMemo(() => getGradedReaderByLanguage(languageCode), [languageCode]);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [showPt, setShowPt] = useState(true);
  const [savedWords, setSavedWords] = useState<string[]>([]);

  useEffect(() => {
    setChapterIdx(0);
    setActiveSentenceIdx(null);
    setIsPlayingAll(false);
    stopSpeaking();
  }, [languageCode]);

  if (!book) return null;
  const chapter = book.chapters[chapterIdx] ?? book.chapters[0];
  if (!chapter) return null;

  const playChapterContinuously = async () => {
    if (isPlayingAll) {
      stopSpeaking();
      setIsPlayingAll(false);
      setActiveSentenceIdx(null);
      return;
    }
    setIsPlayingAll(true);
    for (let i = 0; i < chapter.sentences.length; i++) {
      setActiveSentenceIdx(i);
      await speakText(chapter.sentences[i].target, { langCode: dialectCode, rate: 0.95 });
    }
    setIsPlayingAll(false);
    setActiveSentenceIdx(null);
  };

  return (
    <div data-testid="graded-readers-view" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
        <div>
          <h3 className="flex items-center gap-1.5 font-display text-base font-extrabold text-emerald-950">
            <BookOpen className="h-4.5 w-4.5 text-emerald-700" />
            <span>{book.seriesTitle}</span>
          </h3>
          <p className="text-xs text-emerald-800">{book.subtitlePt}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPt((p) => !p)}
            className="rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 cursor-pointer"
          >
            {showPt ? 'Ocultar PT' : 'Mostrar PT'}
          </button>
          <button
            type="button"
            onClick={() => void playChapterContinuously()}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold text-white cursor-pointer ${
              isPlayingAll ? 'bg-rose-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isPlayingAll ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlayingAll ? 'Parar narração' : 'Ouvir capítulo'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {book.chapters.map((ch, idx) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => {
              stopSpeaking();
              setIsPlayingAll(false);
              setActiveSentenceIdx(null);
              setChapterIdx(idx);
            }}
            className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              chapterIdx === idx
                ? 'border-emerald-500 bg-emerald-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Cap. {ch.chapterNumber} · {ch.level}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">
          Capítulo {chapter.chapterNumber} · {chapter.level}
        </span>
        <h4 className="mt-2 font-display text-xl font-extrabold text-slate-900">
          {chapter.titleTarget}
        </h4>
        <p className="text-xs font-semibold text-slate-500">{chapter.titlePt}</p>

        <div className="mt-4 space-y-2.5">
          {chapter.sentences.map((s, sIdx) => {
            const isActive = activeSentenceIdx === sIdx;
            return (
              <div
                key={sIdx}
                onClick={() => {
                  setActiveSentenceIdx(sIdx);
                  void speakText(s.target, { langCode: dialectCode, rate: 0.95 });
                }}
                className={`rounded-2xl border p-3.5 transition cursor-pointer ${
                  isActive
                    ? 'border-emerald-400 bg-emerald-50/70'
                    : 'border-slate-200/80 bg-slate-50/50 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold leading-relaxed text-slate-900">
                    {s.target}
                  </p>
                  <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                </div>
                {showPt && (
                  <p className="mt-1 text-xs text-slate-600">{s.pt}</p>
                )}
              </div>
            );
          })}
        </div>

        {chapter.glossary.length > 0 && (
          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Vocabulário do Capítulo (clique para enviar ao SM-2)
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {chapter.glossary.map((g) => {
                const saved = savedWords.includes(g.word);
                return (
                  <button
                    key={g.word}
                    type="button"
                    onClick={() => {
                      if (!saved) {
                        setSavedWords((prev) => [...prev, g.word]);
                        const ex =
                          chapter.sentences.find((s) =>
                            s.target.toLowerCase().includes(g.word.toLowerCase()),
                          ) ?? chapter.sentences[0];
                        onAddWordToSrs?.({
                          word: g.word,
                          translation: g.translation,
                          ipa: g.ipa,
                          exampleEn: ex?.target ?? g.word,
                          examplePt: ex?.pt ?? g.translation,
                        });
                      }
                      void speakText(g.word, { langCode: dialectCode, rate: 0.9 });
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      saved
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-emerald-300'
                    }`}
                  >
                    {saved ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Plus className="h-3.5 w-3.5 text-emerald-600" />}
                    <span>{g.word}</span>
                    <span className="font-normal text-slate-500">({g.translation})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

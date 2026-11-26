import { useState } from 'react';
import {
  BookmarkPlus,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  Play,
  Sparkles,
  Volume2,
  Youtube,
} from 'lucide-react';
import type { CEFRLevel, LanguageCode } from '../types/learning';
import {
  fetchYouTubeStudyPack,
  type YouTubeStudyPack,
  type YouTubeSubtitleItem,
} from '../utils/youtubeStudy';
import type { VideoWordToken } from '../data/interactiveVideos';
import { speakText } from '../utils/speech';
import { isRtlLanguage } from '../utils/platform';
import { DualAudioButtons } from './DualAudioButtons';

interface YouTubeStudyLabProps {
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
  onEarnXp?: (xp: number) => void;
}

const SAMPLE_URLS: Partial<Record<LanguageCode, { url: string; label: string; sampleTranscript: string }>> = {
  en: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    label: 'Exemplo EN (B1)',
    sampleTranscript:
      "0:00 Even though the schedule changed at the last minute, we managed to wrap up the presentation.\n0:06 Had we known earlier, we would have adjusted the timeline.",
  },
  es: {
    url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    label: 'Exemplo ES (B1)',
    sampleTranscript:
      '0:00 Aunque todavía queda mucho por hacer, me alegra que hayamos avanzado tanto.\n0:06 En cuanto terminemos la reunión, te envío el resumen.',
  },
  tr: {
    url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    label: 'Exemplo TR (A2)',
    sampleTranscript:
      '0:00 İstanbul’da sabahları vapurla karşıya geçmek çok keyifli.\n0:06 Kahvemi içtikten sonra hemen işe başlıyorum.',
  },
  he: {
    url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    label: 'Exemplo HE (A2)',
    sampleTranscript:
      '0:00 כשאני מגיע לתל אביב, אני תמיד שותה קפה ליד הים.\n0:06 חשוב לי לדבר עברית כל יום עם חברים.',
  },
};

export function YouTubeStudyLab({
  languageCode,
  savedWords = new Set(),
  onSaveWordToDeck,
  onEarnXp,
}: YouTubeStudyLabProps) {
  const [url, setUrl] = useState('');
  const [level, setLevel] = useState<CEFRLevel>('B1');
  const [showTranscriptBox, setShowTranscriptBox] = useState(false);
  const [manualTranscript, setManualTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pack, setPack] = useState<YouTubeStudyPack | null>(null);
  const [seekSec, setSeekSec] = useState(0);
  const [activeTab, setActiveTab] = useState<'subtitles' | 'grammar' | 'quiz'>('subtitles');
  const [selectedToken, setSelectedToken] = useState<{
    token: VideoWordToken;
    line: YouTubeSubtitleItem;
  } | null>(null);
  const [recentlySaved, setRecentlySaved] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const rtl = isRtlLanguage(languageCode);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setError('Cole o link de um vídeo do YouTube acima.');
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedToken(null);
    setQuizAnswers({});
    setSeekSec(0);
    try {
      const result = await fetchYouTubeStudyPack({
        url: url.trim(),
        languageCode,
        level,
        manualTranscript: manualTranscript.trim() || undefined,
      });
      setPack(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível analisar este vídeo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToken = () => {
    if (!selectedToken || !onSaveWordToDeck) return;
    const key = selectedToken.token.lemma.toLowerCase();
    onSaveWordToDeck({
      word: selectedToken.token.lemma,
      translation: selectedToken.token.translationPt,
      ipa: selectedToken.token.ipa,
      exampleEn: selectedToken.line.textTarget,
      examplePt: selectedToken.line.textPt,
      category: `YouTube · ${pack?.title.slice(0, 28) ?? languageCode.toUpperCase()}`,
    });
    setRecentlySaved((prev) => new Set(prev).add(key));
  };

  const samplePreset = SAMPLE_URLS[languageCode] ?? SAMPLE_URLS.en!;

  return (
    <div data-testid="youtube-study-lab" className="space-y-5">
      {/* Input Form */}
      <form
        onSubmit={(e) => void handleAnalyze(e)}
        className="fb-card-primary rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-2 font-display text-base font-extrabold text-slate-900">
              <Youtube className="h-5 w-5 text-rose-600" />
              <span>Estudar com Qualquer Vídeo do YouTube</span>
            </h3>
            <p className="text-xs text-slate-600">
              Cole um link do YouTube para gerar legendas interativas, salvar palavras no SM-2 e ver por que cada estrutura gramatical foi usada.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setUrl(samplePreset.url);
              setManualTranscript(samplePreset.sampleTranscript);
              setShowTranscriptBox(true);
            }}
            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
          >
            Carregar {samplePreset.label}
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            data-testid="yt-url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as CEFRLevel)}
            aria-label="Nível alvo para análise"
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-800"
          >
            {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map((lvl) => (
              <option key={lvl} value={lvl}>
                Nível {lvl}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            data-testid="yt-analyze-btn"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>{loading ? 'Analisando...' : 'Gerar Legenda & Estudo IA'}</span>
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowTranscriptBox((v) => !v)}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            {showTranscriptBox
              ? 'Ocultar transcrição/SRT manual'
              : '+ Colar legenda/SRT ou trecho do vídeo (opcional)'}
          </button>
          {showTranscriptBox && (
            <textarea
              rows={3}
              data-testid="yt-transcript-input"
              value={manualTranscript}
              onChange={(e) => setManualTranscript(e.target.value)}
              placeholder="Cole aqui trechos da legenda (texto simples, .srt ou .vtt com timestamps 0:00) caso o vídeo não tenha legendas automáticas liberadas..."
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 font-mono text-xs text-slate-800"
            />
          )}
        </div>

        {error && (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {error}
          </p>
        )}
      </form>

      {/* Study Workspace */}
      {pack && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-lg">
            <div className="aspect-video w-full bg-black">
              <iframe
                key={`${pack.videoId}-${seekSec}`}
                src={`https://www.youtube-nocookie.com/embed/${pack.videoId}?rel=0&modestbranding=1&start=${seekSec}`}
                title={pack.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-5 py-3 text-white">
              <div>
                <p className="text-sm font-bold">{pack.title}</p>
                <p className="text-[11px] text-slate-400">
                  {pack.author} · Fonte: {pack.source}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'subtitles', label: `Legendas (${pack.subtitles.length})`, Icon: Play },
                    { id: 'grammar', label: `Gramática & Uso (${pack.grammarInsights.length})`, Icon: BookOpen },
                    { id: 'quiz', label: `Quiz (${pack.checkpoints.length})`, Icon: HelpCircle },
                  ] as const
                ).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    data-testid={`yt-tab-${id}`}
                    onClick={() => setActiveTab(id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      activeTab === id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeTab === 'subtitles' && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="space-y-2.5 lg:col-span-8">
                {pack.subtitles.map((line) => (
                  <div
                    key={line.id}
                    className="fb-card-primary rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSeekSec(line.startSec)}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700 hover:bg-blue-100 cursor-pointer"
                      >
                        <Clock className="h-3 w-3" />
                        <span>{line.startSec}s</span>
                      </button>
                      <DualAudioButtons
                        text={line.textTarget}
                        languageCode={pack.languageCode}
                        size="xs"
                      />
                    </div>
                    <div
                      dir={rtl ? 'rtl' : 'ltr'}
                      className="flex flex-wrap gap-1.5 text-sm font-bold text-slate-900"
                    >
                      {line.textTarget.split(/\s+/).map((rawWord, idx) => {
                        const clean = rawWord.replace(/[.,!?;:"“”()[\]]/g, '').toLowerCase();
                        const matched =
                          line.tokens.find(
                            (t) =>
                              t.surface.toLowerCase() === clean ||
                              t.lemma.toLowerCase() === clean,
                          ) ?? {
                            surface: rawWord.replace(/[.,!?;:"“”()[\]]/g, ''),
                            lemma: clean || rawWord,
                            translationPt: 'Toque para revisar em contexto',
                            ipa: `/${clean || rawWord}/`,
                            partOfSpeech: 'palavra',
                            notePt: line.textPt,
                          };
                        return (
                          <button
                            key={`${line.id}-${idx}`}
                            type="button"
                            data-testid="yt-subtitle-word"
                            onClick={() => {
                              setSelectedToken({ token: matched, line });
                              speakText(matched.surface, { langCode: pack.dialectCode, rate: 0.9 });
                            }}
                            className="rounded-lg px-1.5 py-0.5 hover:bg-blue-100 hover:text-blue-800 cursor-pointer"
                          >
                            {rawWord}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600">{line.textPt}</p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-4">
                <div className="fb-card-primary sticky top-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  {selectedToken ? (
                    <div data-testid="yt-word-popover" className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-lg font-extrabold text-slate-900">
                            {selectedToken.token.surface}
                          </p>
                          <p className="font-mono text-xs text-slate-500">
                            {selectedToken.token.ipa} · {selectedToken.token.partOfSpeech}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            speakText(selectedToken.token.surface, { langCode: pack.dialectCode })
                          }
                          className="rounded-lg bg-blue-50 p-2 text-blue-700 hover:bg-blue-100 cursor-pointer"
                          aria-label="Ouvir palavra"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900">
                        Tradução: {selectedToken.token.translationPt}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-600">
                        {selectedToken.token.notePt}
                      </p>
                      {onSaveWordToDeck && (
                        <button
                          type="button"
                          data-testid="yt-save-sm2-btn"
                          onClick={handleSaveToken}
                          disabled={
                            savedWords.has(selectedToken.token.lemma.toLowerCase()) ||
                            recentlySaved.has(selectedToken.token.lemma.toLowerCase())
                          }
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:bg-emerald-600 cursor-pointer"
                        >
                          <BookmarkPlus className="h-4 w-4" />
                          <span>
                            {savedWords.has(selectedToken.token.lemma.toLowerCase()) ||
                            recentlySaved.has(selectedToken.token.lemma.toLowerCase())
                              ? 'Salva no Deck SM-2 ✓'
                              : 'Salvar no Deck SM-2'}
                          </span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Toque em qualquer palavra da legenda ao lado para ouvir a pronúncia, ver a explicação gramatical e salvar no seu baralho SM-2.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'grammar' && (
            <div data-testid="yt-grammar-panel" className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {pack.grammarInsights.map((ins) => (
                <div
                  key={ins.id}
                  className="fb-card-primary space-y-2.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700">
                      {ins.structureType} · {ins.level}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {ins.registerNotePt}
                    </span>
                  </div>
                  <h4 dir={rtl ? 'rtl' : 'ltr'} className="font-display text-base font-extrabold text-slate-900">
                    “{ins.expression}”
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-700">
                    <strong>Por que foi usada:</strong> {ins.whyUsedPt}
                  </p>
                  <p className="rounded-xl bg-amber-50/80 px-3 py-2 text-xs text-amber-950">
                    <strong>💡 Dica de uso:</strong> {ins.usageTipPt}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2">
                    <p dir={rtl ? 'rtl' : 'ltr'} className="text-xs font-semibold text-slate-800">
                      Ex.: {ins.exampleAlternative}
                    </p>
                    <DualAudioButtons
                      text={ins.exampleAlternative}
                      languageCode={pack.languageCode}
                      size="xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-3">
              {pack.checkpoints.map((cp) => {
                const picked = quizAnswers[cp.id];
                return (
                  <div
                    key={cp.id}
                    className="fb-card-primary space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
                  >
                    <p className="text-sm font-bold text-slate-900">{cp.questionPt}</p>
                    <div className="space-y-2">
                      {cp.options.map((opt, idx) => {
                        const chosen = picked === idx;
                        const isRight = idx === cp.correctIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={picked !== undefined}
                            onClick={() => {
                              setQuizAnswers((prev) => ({ ...prev, [cp.id]: idx }));
                              if (isRight && onEarnXp) onEarnXp(25);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition cursor-pointer ${
                              picked === undefined
                                ? 'border-slate-200 bg-slate-50 hover:bg-blue-50'
                                : isRight
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                                  : chosen
                                    ? 'border-rose-300 bg-rose-50 text-rose-900'
                                    : 'border-slate-200 opacity-60'
                            }`}
                          >
                            <span>{opt}</span>
                            {picked !== undefined && isRight && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {picked !== undefined && (
                      <p className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-900">
                        {cp.explanationPt}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

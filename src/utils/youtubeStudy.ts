import { DEFAULT_BACKEND_API_URL } from '../config/appConfig';
import type { CEFRLevel, LanguageCode } from '../types/learning';
import { getLanguageCourseMeta } from '../data/platformDefaults';
import { getRegionalAccents } from '../data/regionalAccents';
import type { VideoWordToken } from '../data/interactiveVideos';

export interface YouTubeSubtitleItem {
  id: string;
  startSec: number;
  textTarget: string;
  textPt: string;
  tokens: VideoWordToken[];
}

export interface YouTubeGrammarInsight {
  id: string;
  expression: string;
  structureType: string;
  level: CEFRLevel;
  whyUsedPt: string;
  usageTipPt: string;
  registerNotePt: string;
  exampleAlternative: string;
}

export interface YouTubeCheckpointItem {
  id: string;
  questionPt: string;
  options: string[];
  correctIndex: number;
  explanationPt: string;
}

export interface YouTubeStudyPack {
  videoId: string;
  title: string;
  author: string;
  languageCode: LanguageCode;
  dialectCode: string;
  source: 'youtube-captions' | 'manual-transcript' | 'ai-topic-synthesis' | 'offline-fallback';
  subtitles: YouTubeSubtitleItem[];
  grammarInsights: YouTubeGrammarInsight[];
  checkpoints: YouTubeCheckpointItem[];
}

export function extractYouTubeVideoId(rawUrl: string): string | null {
  const s = (rawUrl || '').trim();
  if (!s) return null;
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m?.[1]) return m[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  return null;
}

export function parseManualTranscript(raw: string): Array<{ startSec: number; text: string }> {
  const lines = (raw || '').split(/\r?\n/);
  const result: Array<{ startSec: number; text: string }> = [];
  let currentSec = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || /^\d+$/.test(trimmed) || /^WEBVTT/i.test(trimmed)) continue;
    const tsMatch = trimmed.match(
      /^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:[.,]\d+)?(?:\s*-->\s*(?:\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d+)?)?(?=\s|$)/,
    );
    if (tsMatch) {
      const h = tsMatch[1] ? Number(tsMatch[1]) : 0;
      const m = Number(tsMatch[2]);
      const sec = Number(tsMatch[3]);
      currentSec = h * 3600 + m * 60 + sec;
      const rest = trimmed.replace(tsMatch[0], '').trim();
      if (rest && !/-->/.test(rest)) {
        result.push({ startSec: currentSec, text: rest });
      }
      continue;
    }
    if (/-->/.test(trimmed)) continue;
    result.push({ startSec: currentSec || result.length * 6, text: trimmed });
    currentSec += 6;
  }
  return result.slice(0, 16);
}

export function buildOfflineYouTubeStudyPack(
  videoId: string,
  languageCode: LanguageCode,
  level: CEFRLevel,
  manualTranscript?: string,
): YouTubeStudyPack {
  const course = getLanguageCourseMeta(languageCode);
  const dialectCode = getRegionalAccents(languageCode)[0]?.code ?? `${languageCode}-US`;
  const parsed = parseManualTranscript(manualTranscript ?? '');

  const subtitles: YouTubeSubtitleItem[] =
    parsed.length > 0
      ? parsed.map((item, idx) => {
          const words = item.text
            .split(/\s+/)
            .map((w) => w.replace(/[.,!?;:"“”()[\]]/g, '').trim())
            .filter(Boolean)
            .slice(0, 5);
          return {
            id: `yt-sub-${idx + 1}`,
            startSec: item.startSec,
            textTarget: item.text,
            textPt: `Trecho ${idx + 1} em ${course.namePt} (${level}) — toque nas palavras para salvar no seu deck SM-2.`,
            tokens: words.map((w) => ({
              surface: w,
              lemma: w.toLowerCase(),
              translationPt: `Vocabulário do vídeo (${course.namePt})`,
              ipa: `/${w.toLowerCase()}/`,
              partOfSpeech: 'expressão',
              notePt: 'Extraído diretamente da legenda deste trecho para revisão espaçada.',
            })),
          };
        })
      : [
          {
            id: 'yt-sub-1',
            startSec: 0,
            textTarget: `${course.nativeName} — Practice real listening & intonation (${level}).`,
            textPt: `Prática real de escuta e entonação em ${course.namePt} (${level}).`,
            tokens: [
              {
                surface: 'Practice',
                lemma: 'practice',
                translationPt: 'praticar',
                ipa: '/ˈpræk.tɪs/',
                partOfSpeech: 'verbo',
                notePt: 'Cole trechos da legenda ou use o modo online para análise completa por IA.',
              },
            ],
          },
        ];

  return {
    videoId,
    title: `Estudo YouTube · ${course.namePt} (${videoId})`,
    author: 'YouTube Study Lab',
    languageCode,
    dialectCode,
    source: parsed.length > 0 ? 'manual-transcript' : 'offline-fallback',
    subtitles,
    grammarInsights: [
      {
        id: 'yt-g-1',
        expression: subtitles[0]?.textTarget.split(/\s+/).slice(0, 4).join(' ') || course.nativeName,
        structureType: 'Construção Contextual & Ritmo',
        level,
        whyUsedPt:
          'Em vídeos autênticos do YouTube, falantes nativos priorizam conectores curtos e verbos de alta frequência para manter ritmo conversacional.',
        usageTipPt:
          'Ouça cada linha em 0.75x usando o botão de áudio neural e observe como as palavras se ligam na fala corrida.',
        registerNotePt: 'Coloquial / Mídia Digital',
        exampleAlternative: subtitles[0]?.textTarget ?? course.nativeName,
      },
    ],
    checkpoints: [
      {
        id: 'yt-cp-1',
        questionPt: `Qual é a melhor estratégia ao estudar este vídeo em ${course.namePt}?`,
        options: [
          'Identificar expressões reais na legenda, ouvir a pronúncia e salvar palavras no deck SM-2',
          'Traduzir palavra por palavra ignorando o contexto e a entonação',
          'Pular as notas gramaticais sem revisar depois',
        ],
        correctIndex: 0,
        explanationPt:
          'Combinar legenda interativa, porquê gramatical e revisão espaçada SM-2 fixa o vocabulário em contexto real.',
      },
    ],
  };
}

export async function fetchYouTubeStudyPack(params: {
  url: string;
  languageCode: LanguageCode;
  level: CEFRLevel;
  manualTranscript?: string;
}): Promise<YouTubeStudyPack> {
  const videoId = extractYouTubeVideoId(params.url);
  if (!videoId) {
    throw new Error('URL do YouTube inválida. Use um link youtube.com/watch?v=... ou youtu.be/...');
  }
  const dialectCode = getRegionalAccents(params.languageCode)[0]?.code ?? 'en-US';
  const apiBase = DEFAULT_BACKEND_API_URL.replace(/\/+$/, '');

  try {
    const res = await fetch(`${apiBase}/api/youtube-study`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = (await res.json()) as Partial<YouTubeStudyPack> & { ok?: boolean };
      if (data.ok && Array.isArray(data.subtitles) && data.subtitles.length > 0) {
        return {
          videoId,
          title: data.title || `YouTube (${videoId})`,
          author: data.author || 'YouTube',
          languageCode: params.languageCode,
          dialectCode,
          source: data.source || 'youtube-captions',
          subtitles: data.subtitles,
          grammarInsights: Array.isArray(data.grammarInsights) ? data.grammarInsights : [],
          checkpoints: Array.isArray(data.checkpoints) ? data.checkpoints : [],
        };
      }
    }
  } catch {
    // Fallback to offline/manual analyzer
  }

  return buildOfflineYouTubeStudyPack(
    videoId,
    params.languageCode,
    params.level,
    params.manualTranscript,
  );
}

import { useEffect, useRef, useState } from 'react';
import {
  Headphones,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-react';
import type { LanguageCode, VocabCard } from '../types/learning';
import { speakText, stopSpeaking } from '../utils/speech';

interface HandsFreeAudioModalProps {
  open: boolean;
  cards: VocabCard[];
  languageCode: LanguageCode;
  dialectCode: string;
  onClose: () => void;
}

export function HandsFreeAudioModal({
  open,
  cards,
  languageCode,
  dialectCode,
  onClose,
}: HandsFreeAudioModalProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<0.8 | 1>(1);
  const [loopDeck, setLoopDeck] = useState(true);
  const [phase, setPhase] = useState<'target' | 'pt'>('target');
  const timerRef = useRef<number | null>(null);
  const activeRef = useRef(false);

  const safeIndex = cards.length > 0 ? index % cards.length : 0;
  const card = cards[safeIndex];

  useEffect(() => {
    if (!open) {
      activeRef.current = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      stopSpeaking();
      return;
    }
    setIndex(0);
    setPlaying(true);
  }, [open]);

  useEffect(() => {
    if (!open || !playing || !card) {
      activeRef.current = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      stopSpeaking();
      return;
    }

    activeRef.current = true;
    setPhase('target');
    const langForSpeak = dialectCode || languageCode;

    speakText(card.word, {
      langCode: langForSpeak,
      rate: speed,
      onEnd: () => {
        if (!activeRef.current) return;
        timerRef.current = window.setTimeout(() => {
          if (!activeRef.current) return;
          setPhase('pt');
          speakText(card.translation, {
            langCode: 'pt-BR',
            rate: 1,
            onEnd: () => {
              if (!activeRef.current) return;
              timerRef.current = window.setTimeout(() => {
                if (!activeRef.current) return;
                if (safeIndex + 1 < cards.length) {
                  setIndex((prev) => prev + 1);
                } else if (loopDeck && cards.length > 0) {
                  setIndex(0);
                } else {
                  setPlaying(false);
                }
              }, 1400);
            },
          });
        }, 1800);
      },
    });

    return () => {
      activeRef.current = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      stopSpeaking();
    };
  }, [open, playing, safeIndex, speed, loopDeck, cards.length, card?.id, dialectCode, languageCode]);

  if (!open) return null;

  return (
    <div
      data-testid="hands-free-modal"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950 p-6 text-white safe-top safe-bottom"
    >
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-sky-400" />
          <span className="font-display text-sm font-bold">
            Modo Hands-Free · {cards.length > 0 ? `${safeIndex + 1} / ${cards.length}` : '0 cards'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            onClose();
          }}
          data-testid="close-hands-free-btn"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 cursor-pointer"
          aria-label="Fechar Modo Hands-Free"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        {card ? (
          <>
            <span className="rounded-full bg-sky-500/20 px-3 py-1 font-mono text-[11px] font-bold text-sky-300">
              {phase === 'target' ? 'Ouvindo no idioma...' : 'Tradução em Português...'}
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {card.word}
            </h2>
            {card.ipa && (
              <p className="mt-2 font-mono text-sm text-slate-400">{card.ipa}</p>
            )}
            <p className="mt-4 text-lg font-semibold text-emerald-300">
              {card.translation}
            </p>
            {card.exampleEn && (
              <p className="mt-4 max-w-md text-xs text-slate-400 italic">
                “{card.exampleEn}”
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-slate-400">
            Nenhum card disponível no filtro atual para reprodução contínua.
          </p>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={cards.length === 0}
            onClick={() => setIndex((prev) => (prev - 1 + cards.length) % cards.length)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 cursor-pointer disabled:opacity-40"
            aria-label="Card anterior"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            type="button"
            disabled={cards.length === 0}
            onClick={() => setPlaying((p) => !p)}
            data-testid="hands-free-play-toggle"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 cursor-pointer disabled:opacity-40"
            aria-label={playing ? 'Pausar' : 'Reproduzir'}
          >
            {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-0.5" />}
          </button>
          <button
            type="button"
            disabled={cards.length === 0}
            onClick={() => setIndex((prev) => (prev + 1) % cards.length)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 cursor-pointer disabled:opacity-40"
            aria-label="Próximo card"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSpeed((s) => (s === 1 ? 0.8 : 1))}
            className="rounded-xl bg-white/10 px-3 py-1.5 hover:bg-white/20 cursor-pointer"
          >
            Velocidade: {speed}x
          </button>
          <button
            type="button"
            onClick={() => setLoopDeck((l) => !l)}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 cursor-pointer ${
              loopDeck ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white'
            }`}
          >
            <Repeat className="h-3.5 w-3.5" />
            <span>Loop</span>
          </button>
        </div>
      </div>
    </div>
  );
}

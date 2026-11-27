/**
 * @file src/components/DualAudioButtons.tsx
 * @description Botões duplos reutilizáveis de áudio neural (velocidade normal 1.0x e lenta 0.75x) com fallback Web Speech.
 * @exports DualAudioButtons
 */
import { useEffect, useState } from 'react';
import { ChevronDown, Globe2, Loader2, Turtle, Volume2 } from 'lucide-react';
import { getLanguageCourseMeta as getLanguageCourse } from '../data/platformDefaults';
import { getRegionalAccents } from '../data/regionalAccents';
import type { LanguageCode } from '../types/learning';
import { speakText } from '../utils/speech';

interface DualAudioButtonsProps {
  text: string;
  languageCode?: LanguageCode;
  preferredAccent?: string;
  onSelectAccent?: (accentCode: string) => void;
  showSlow?: boolean;
  size?: 'xs' | 'sm' | 'md';
  stopPropagation?: boolean;
  className?: string;
  rateMultiplier?: number;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
}

export function DualAudioButtons({
  text,
  languageCode = 'en',
  preferredAccent,
  onSelectAccent,
  showSlow = false,
  size = 'sm',
  stopPropagation = true,
  className = '',
  rateMultiplier = 1,
  onPlayStart,
  onPlayEnd,
}: DualAudioButtonsProps) {
  const course = getLanguageCourse(languageCode);
  const dialects = course.dialects;
  const regionalAccents = getRegionalAccents(languageCode);
  const extraAccentsCount = Math.max(0, regionalAccents.length - dialects.length);
  const resolvedPreferred =
    preferredAccent && regionalAccents.some((a) => a.code === preferredAccent)
      ? preferredAccent
      : dialects[0]?.code ?? 'en-US';
  const [activeCode, setActiveCode] = useState<string>(resolvedPreferred);
  const [loadingCode, setLoadingCode] = useState<string | null>(null);
  const [playingCode, setPlayingCode] = useState<string | null>(null);
  const [accentsOpen, setAccentsOpen] = useState(false);

  useEffect(() => {
    setActiveCode(resolvedPreferred);
  }, [resolvedPreferred]);

  const preferredCustomObj =
    resolvedPreferred && !dialects.some((d) => d.code === resolvedPreferred)
      ? regionalAccents.find((a) => a.code === resolvedPreferred)
      : undefined;

  const handlePlay = (
    e: React.MouseEvent,
    langCode: string,
    rate: number,
    tag: string,
  ) => {
    if (stopPropagation) e.stopPropagation();
    setActiveCode(langCode);
    speakText(text, {
      langCode,
      rate: Math.max(0.65, Math.min(1.25, rate * rateMultiplier)),
      onLoading: (isLoading) => {
        setLoadingCode((cur) => (isLoading ? tag : cur === tag ? null : cur));
      },
      onStart: () => {
        setLoadingCode((cur) => (cur === tag ? null : cur));
        setPlayingCode(tag);
        onPlayStart?.();
      },
      onEnd: () => {
        setLoadingCode((cur) => (cur === tag ? null : cur));
        setPlayingCode((cur) => (cur === tag ? null : cur));
        onPlayEnd?.();
      },
    });
  };

  const btnSizing =
    size === 'xs'
      ? 'px-2 py-1 text-[10px] rounded-lg gap-1'
      : size === 'md'
        ? 'px-3 py-2 text-xs rounded-xl gap-1.5'
        : 'px-2.5 py-1.5 text-[11px] rounded-xl gap-1';

  return (
    <div className={`relative inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {dialects.map((dial, idx) => {
        const shortTag =
          dial.code === 'en-US'
            ? 'US'
            : dial.code === 'en-GB'
              ? 'UK'
              : dial.code.split('-')[1] ?? dial.label;
            const isPlaying = playingCode === dial.code;
            const isLoading = loadingCode === dial.code;
            const primary = idx === 0 && !preferredCustomObj;

            return (
              <button
                key={dial.code}
                type="button"
                onClick={(e) => handlePlay(e, dial.code, 1, dial.code)}
                title={`Ouvir em ${dial.label} (${dial.code})`}
                aria-label={`Ouvir em ${dial.label}: ${text}`}
                className={`inline-flex items-center font-bold transition cursor-pointer ${btnSizing} ${
                  isPlaying || isLoading
                    ? 'bg-blue-700 text-white ring-2 ring-blue-300'
                    : primary
                      ? 'bg-blue-600 text-white shadow-2xs hover:bg-blue-700'
                      : 'border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                }`}
              >
                {isLoading ? (
                  <Loader2 className={`${size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'} animate-spin`} />
                ) : (
                  <Volume2 className={size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
                )}
                <span>{dial.flag}</span>
                <span>{shortTag}</span>
              </button>
            );
          })}

      {preferredCustomObj && (
        <button
          type="button"
          onClick={(e) => handlePlay(e, preferredCustomObj.code, 1, preferredCustomObj.code)}
          title={`Sotaque preferido: ${preferredCustomObj.regionPt}`}
          className={`inline-flex items-center font-bold transition cursor-pointer ${btnSizing} ${
            playingCode === preferredCustomObj.code || loadingCode === preferredCustomObj.code
              ? 'bg-indigo-700 text-white ring-2 ring-indigo-300'
              : 'bg-indigo-600 text-white shadow-2xs hover:bg-indigo-700'
          }`}
        >
          {loadingCode === preferredCustomObj.code ? (
            <Loader2 className={`${size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'} animate-spin`} />
          ) : (
            <Volume2 className={size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          )}
          <span>{preferredCustomObj.flag}</span>
          <span>{preferredCustomObj.shortLabel}</span>
        </button>
      )}

      {regionalAccents.length > 2 && (
        <button
          type="button"
          data-testid="more-accents-trigger"
          aria-expanded={accentsOpen}
          onClick={(e) => {
            if (stopPropagation) e.stopPropagation();
            setAccentsOpen((v) => !v);
          }}
          title={`Explorar todos os ${regionalAccents.length} sotaques regionais`}
          className={`inline-flex items-center border border-slate-200 bg-white font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer ${btnSizing}`}
        >
          <Globe2 className={`${size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'} text-indigo-600`} />
          {size !== 'xs' && (
            <span>+{extraAccentsCount > 0 ? extraAccentsCount : regionalAccents.length} sotaques</span>
          )}
          <ChevronDown className={`h-3 w-3 transition-transform ${accentsOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {showSlow && (
        <button
          type="button"
          onClick={(e) => handlePlay(e, activeCode, 0.72, 'slow')}
          title="Ouvir mais devagar (0.75x)"
          aria-label="Ouvir devagar"
          className={`inline-flex items-center border font-bold transition cursor-pointer ${btnSizing} ${
            playingCode === 'slow'
              ? 'border-amber-400 bg-amber-100 text-amber-900'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Turtle className={size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          <span>0.75x</span>
        </button>
      )}

      {accentsOpen && (
        <div
          data-testid="more-accents-menu"
          onClick={(e) => {
            if (stopPropagation) e.stopPropagation();
          }}
          className="animate-fade-up absolute top-full right-0 z-40 mt-1.5 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
        >
          <p className="px-2 py-1 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
            Sotaques regionais ({regionalAccents.length})
          </p>
          <div className="max-h-60 space-y-1 overflow-y-auto">
            {regionalAccents.map((acc) => {
              const isPlaying = playingCode === acc.code;
              return (
                <button
                  key={acc.code}
                  type="button"
                  data-testid={`accent-option-${acc.code}`}
                  onClick={(e) => {
                    onSelectAccent?.(acc.code);
                    handlePlay(e, acc.code, 1, acc.code);
                    setAccentsOpen(false);
                  }}
                  className={`flex w-full items-start justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition cursor-pointer ${
                    isPlaying
                      ? 'bg-indigo-100 text-indigo-950'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs font-bold">
                      <span>{acc.flag}</span>
                      <span className="truncate">{acc.regionPt}</span>
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {acc.descriptionPt}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                    {acc.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

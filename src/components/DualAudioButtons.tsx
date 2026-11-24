import { useState } from 'react';
import { Turtle, Volume2 } from 'lucide-react';
import { getLanguageCourseMeta as getLanguageCourse } from '../data/platformDefaults';
import type { LanguageCode } from '../types/learning';
import { speakText } from '../utils/speech';

interface DualAudioButtonsProps {
  text: string;
  languageCode?: LanguageCode;
  showSlow?: boolean;
  size?: 'xs' | 'sm' | 'md';
  stopPropagation?: boolean;
  className?: string;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
}

export function DualAudioButtons({
  text,
  languageCode = 'en',
  showSlow = false,
  size = 'sm',
  stopPropagation = true,
  className = '',
  onPlayStart,
  onPlayEnd,
}: DualAudioButtonsProps) {
  const course = getLanguageCourse(languageCode);
  const dialects = course.dialects;
  const [activeCode, setActiveCode] = useState<string>(
    dialects[0]?.code ?? 'en-US',
  );
  const [playingCode, setPlayingCode] = useState<string | null>(null);

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
      rate,
      onStart: () => {
        setPlayingCode(tag);
        onPlayStart?.();
      },
      onEnd: () => {
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
    <div className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {dialects.map((dial, idx) => {
        const shortTag =
          dial.code === 'en-US'
            ? 'US'
            : dial.code === 'en-GB'
              ? 'UK'
              : dial.code.split('-')[1] ?? dial.label;
        const isPlaying = playingCode === dial.code;
        const primary = idx === 0;

        return (
          <button
            key={dial.code}
            type="button"
            onClick={(e) => handlePlay(e, dial.code, 1, dial.code)}
            title={`Ouvir em ${dial.label} (${dial.code})`}
            aria-label={`Ouvir em ${dial.label}: ${text}`}
            className={`inline-flex items-center font-bold transition cursor-pointer ${btnSizing} ${
              isPlaying
                ? 'bg-blue-700 text-white ring-2 ring-blue-300'
                : primary
                  ? 'bg-blue-600 text-white shadow-2xs hover:bg-blue-700'
                  : 'border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
            }`}
          >
            <Volume2 className={size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            <span>{dial.flag}</span>
            <span>{shortTag}</span>
          </button>
        );
      })}

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
    </div>
  );
}

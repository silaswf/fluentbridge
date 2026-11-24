import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Volume2,
  XCircle,
} from 'lucide-react';
import type { LanguageCode, ListeningStep } from '../../types/learning';
import {
  AMBIENT_NOISE_OPTIONS,
  startAmbientNoise,
  stopAmbientNoise,
  type AmbientNoisePreset,
} from '../../utils/ambientNoiseEngine';
import { DualAudioButtons } from '../DualAudioButtons';

interface ListeningStepViewProps {
  step: ListeningStep;
  languageCode?: LanguageCode;
  isPlayingAudio: boolean;
  setIsPlayingAudio: (val: boolean) => void;
  showTranscript: boolean;
  setShowTranscript: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: number | null;
  setSelectedOption: (idx: number) => void;
  checkedStatus: 'idle' | 'correct' | 'incorrect';
  rateMultiplier?: number;
  unitVocabInUseNode?: React.ReactNode;
}

export function ListeningStepView({
  step,
  languageCode,
  isPlayingAudio,
  setIsPlayingAudio,
  showTranscript,
  setShowTranscript,
  selectedOption,
  setSelectedOption,
  checkedStatus,
  rateMultiplier = 1,
  unitVocabInUseNode,
}: ListeningStepViewProps) {
  const [ambientPreset, setAmbientPreset] = useState<AmbientNoisePreset>('clean');

  useEffect(() => {
    return () => {
      stopAmbientNoise();
    };
  }, [step.id]);

  return (
    <div className="animate-fade-up space-y-5">
      <div className="rounded-3xl border border-indigo-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-indigo-600">{step.speakerLabel}</p>
            <p className="mt-1 text-sm text-slate-600">{step.contextPt}</p>
          </div>
          <div
            data-testid="ambient-noise-selector"
            className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1"
            title="Simular ambiente real de escuta"
          >
            <Volume2 className="ml-1 h-3.5 w-3.5 text-slate-400" />
            {AMBIENT_NOISE_OPTIONS.map((opt) => {
              const active = ambientPreset === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  data-testid={`ambient-preset-${opt.id}`}
                  onClick={() => {
                    setAmbientPreset(opt.id);
                    if (opt.id === 'clean') {
                      stopAmbientNoise();
                    } else {
                      startAmbientNoise(opt.id);
                    }
                  }}
                  title={opt.descriptionPt}
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  {opt.badge}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl bg-indigo-50/80 p-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 items-center gap-1 px-2" aria-hidden="true">
              {[0.4, 0.9, 0.6, 1, 0.5, 0.85, 0.45].map((h, i) => (
                <span
                  key={i}
                  className={`w-1.5 rounded-full bg-indigo-500 transition-all ${
                    isPlayingAudio ? 'animate-wave h-8' : 'h-4 opacity-60'
                  }`}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    transform: isPlayingAudio ? undefined : `scaleY(${h})`,
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-indigo-900">
              {isPlayingAudio ? 'Reproduzindo áudio...' : 'Clique para ouvir'}
            </span>
          </div>

          <DualAudioButtons
            text={step.audioText}
            languageCode={languageCode}
            showSlow
            size="md"
            rateMultiplier={rateMultiplier}
            onPlayStart={() => {
              setIsPlayingAudio(true);
              if (ambientPreset !== 'clean') {
                startAmbientNoise(ambientPreset);
              }
            }}
            onPlayEnd={() => {
              setIsPlayingAudio(false);
              stopAmbientNoise();
            }}
          />
        </div>

        {unitVocabInUseNode}

        {checkedStatus !== 'idle' && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowTranscript((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              {showTranscript ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              <span>
                {showTranscript
                  ? 'Ocultar transcrição'
                  : 'Ver transcrição do áudio'}
              </span>
            </button>
            {showTranscript && (
              <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed font-medium text-slate-700">
                “{step.audioText}”
              </p>
            )}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="font-display text-lg font-bold text-slate-900">
          {step.question}
        </h2>
        <div className="mt-4 space-y-2.5">
          {step.options.map((opt, i) => {
            const isPicked = selectedOption === i;
            const isRight = i === step.correctIndex;
            let cardStyle =
              'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40';
            if (checkedStatus === 'idle' && isPicked) {
              cardStyle = 'border-blue-600 bg-blue-50 ring-2 ring-blue-200';
            } else if (checkedStatus !== 'idle') {
              if (isRight) {
                cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950';
              } else if (isPicked && !isRight) {
                cardStyle = 'border-rose-400 bg-rose-50 text-rose-950 animate-shake';
              }
            }

            return (
              <button
                key={i}
                type="button"
                disabled={checkedStatus !== 'idle'}
                onClick={() => setSelectedOption(i)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left text-sm font-medium transition cursor-pointer disabled:cursor-default ${cardStyle}`}
              >
                <span>{opt}</span>
                {checkedStatus !== 'idle' && isRight && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                )}
                {checkedStatus !== 'idle' && isPicked && !isRight && (
                  <XCircle className="h-5 w-5 shrink-0 text-rose-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

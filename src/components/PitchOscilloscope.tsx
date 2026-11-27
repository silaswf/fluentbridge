/**
 * @file src/components/PitchOscilloscope.tsx
 * @description Osciloscópio visual de contorno tonal para prática de tons em Mandarim e entonação/pitch-accent em Japonês.
 * @exports PitchOscilloscope
 */
import { useEffect, useRef, useState } from 'react';
import { Activity, Mic, Square } from 'lucide-react';
import type { LanguageCode } from '../types/learning';
import {
  detectPitchHz,
  getJapanesePitchContour,
  getMandarinToneContour,
  normalizePitchToContour,
} from '../utils/pitchDetector';

interface PitchOscilloscopeProps {
  languageCode: LanguageCode;
  compact?: boolean;
}

export function PitchOscilloscope({
  languageCode,
  compact = false,
}: PitchOscilloscopeProps) {
  const [listening, setListening] = useState(false);
  const [mandarinTone, setMandarinTone] = useState<1 | 2 | 3 | 4>(1);
  const [jaPattern, setJaPattern] = useState<'heiban' | 'atamadaka' | 'nakadaka' | 'odaka'>('heiban');
  const [liveHz, setLiveHz] = useState<number | null>(null);
  const [samples, setSamples] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const reference =
    languageCode === 'zh'
      ? getMandarinToneContour(mandarinTone)
      : getJapanesePitchContour(jaPattern);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach((ratio) => {
      ctx.beginPath();
      ctx.moveTo(0, h * ratio);
      ctx.lineTo(w, h * ratio);
      ctx.stroke();
    });

    // Reference contour (dashed blue)
    const refPts = reference.points;
    if (refPts.length > 1) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      refPts.forEach((val, idx) => {
        const x = (idx / (refPts.length - 1)) * (w - 20) + 10;
        const y = h - val * (h - 20) - 10;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    // Live contour (solid emerald)
    const norm = normalizePitchToContour(samples);
    if (norm.length > 1) {
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      norm.forEach((val, idx) => {
        const x = (idx / Math.max(1, norm.length - 1)) * (w - 20) + 10;
        const y = h - val * (h - 20) - 10;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [samples, reference]);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  const stopCapture = () => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setListening(false);
  };

  const startCapture = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      setSamples([]);
      setListening(true);

      let rafId = 0;
      let frameCount = 0;
      const tick = () => {
        analyser.getFloatTimeDomainData(buf);
        frameCount += 1;
        if (frameCount % 3 === 0) {
          const hz = detectPitchHz(buf, audioCtx.sampleRate);
          if (hz) {
            setLiveHz(hz);
            setSamples((prev) => [...prev.slice(-39), hz]);
          }
        }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      cleanupRef.current = () => {
        cancelAnimationFrame(rafId);
        stream.getTracks().forEach((t) => t.stop());
        void audioCtx.close().catch(() => undefined);
      };
    } catch {
      setListening(false);
    }
  };

  return (
    <div
      data-testid="pitch-oscilloscope"
      className={`rounded-2xl border border-indigo-200 bg-indigo-50/40 ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
            <Activity className="h-4 w-4 text-indigo-600" />
            <span>
              Osciloscópio F0 · {languageCode === 'zh' ? 'Tons do Mandarim' : 'Pitch Accent'}
            </span>
          </p>
          <p className="text-[11px] text-indigo-700">
            Linha azul = referência nativa ({reference.labelPt}) · Verde = sua voz{' '}
            {liveHz ? `(${liveHz} Hz)` : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={() => (listening ? stopCapture() : void startCapture())}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white cursor-pointer ${
            listening ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {listening ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          <span>{listening ? 'Parar' : 'Capturar F0'}</span>
        </button>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {languageCode === 'zh'
          ? ([1, 2, 3, 4] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMandarinTone(t)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                  mandarinTone === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-indigo-800 border border-indigo-200'
                }`}
              >
                Tom {t}
              </button>
            ))
          : (['heiban', 'atamadaka', 'nakadaka', 'odaka'] as const).map((pat) => (
              <button
                key={pat}
                type="button"
                onClick={() => setJaPattern(pat)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize cursor-pointer ${
                  jaPattern === pat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-indigo-800 border border-indigo-200'
                }`}
              >
                {pat}
              </button>
            ))}
      </div>

      <canvas
        ref={canvasRef}
        width={480}
        height={110}
        className="mt-3 h-24 w-full rounded-xl border border-indigo-200/80 bg-white"
      />
    </div>
  );
}

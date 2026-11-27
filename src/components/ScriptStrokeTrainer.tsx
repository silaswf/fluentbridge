/**
 * @file src/components/ScriptStrokeTrainer.tsx
 * @description Treinador de Alfabetos e Traços (Hiragana, Katakana, Cirílico, Árabe RTL, Hebraico Alefbet RTL, Hanzi e caracteres especiais).
 * @exports ScriptStrokeTrainer
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, PenTool, RotateCcw, Sparkles } from 'lucide-react';
import {
  ARABIC_ALPHABET,
  CHINESE_HANZI,
  JAPANESE_HIRAGANA,
  JAPANESE_KANJI,
  JAPANESE_KATAKANA,
  MANDARIN_TONES,
  RUSSIAN_CYRILLIC,
  type ScriptCharacterItem,
} from '../data/scriptTrainerData';
import type { LanguageCode } from '../types/learning';
import { DualAudioButtons } from './DualAudioButtons';

interface ScriptStrokeTrainerProps {
  languageCode: LanguageCode;
  initialChars?: ScriptCharacterItem[];
  compact?: boolean;
}

export function ScriptStrokeTrainer({
  languageCode,
  initialChars,
  compact = false,
}: ScriptStrokeTrainerProps) {
  const [jaSet, setJaSet] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana');
  const [showWatermark, setShowWatermark] = useState(true);
  const [strokeCountDrawn, setStrokeCountDrawn] = useState(0);

  const activeList = useMemo<ScriptCharacterItem[]>(() => {
    if (initialChars && initialChars.length > 0) return initialChars;
    if (languageCode === 'ja') {
      return jaSet === 'hiragana'
        ? JAPANESE_HIRAGANA
        : jaSet === 'katakana'
          ? JAPANESE_KATAKANA
          : JAPANESE_KANJI;
    }
    if (languageCode === 'zh') return CHINESE_HANZI;
    if (languageCode === 'ru') return RUSSIAN_CYRILLIC;
    if (languageCode === 'ar') return ARABIC_ALPHABET;
    return JAPANESE_HIRAGANA;
  }, [initialChars, languageCode, jaSet]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeItem = activeList[selectedIdx % activeList.length] ?? activeList[0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeCountDrawn(0);
  };

  useEffect(() => {
    clearCanvas();
  }, [activeItem?.char, languageCode, jaSet]);

  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const pos = getPointerPos(e);
    ctx.strokeStyle = '#116DFF';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPointerPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setStrokeCountDrawn((c) => c + 1);
  };

  const effectiveAudioLang: LanguageCode =
    languageCode === 'ja' || languageCode === 'zh' || languageCode === 'ru' || languageCode === 'ar'
      ? languageCode
      : 'ja';

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
              <PenTool className="h-4.5 w-4.5 text-cyan-700" />
              <span>
                Treinador de Escrita &amp; Ordem de Traços (
                {effectiveAudioLang === 'ja'
                  ? `Hiragana (${JAPANESE_HIRAGANA.length}) / Katakana (${JAPANESE_KATAKANA.length}) / Kanji (${JAPANESE_KANJI.length})`
                  : effectiveAudioLang === 'zh'
                    ? `Hanzi (${CHINESE_HANZI.length}) & 4 Tons`
                    : effectiveAudioLang === 'ar'
                      ? `Alfabeto Árabe Completo (${ARABIC_ALPHABET.length} letras · RTL)`
                      : `Alfabeto Cirílico Completo (${RUSSIAN_CYRILLIC.length} letras)`}
                )
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Desenhe sobre a grade guia seguindo a ordem oficial dos traços e ouça a pronúncia nativa.
            </p>
          </div>

          {languageCode === 'ja' && !initialChars && (
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
              {(['hiragana', 'katakana', 'kanji'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setJaSet(tab);
                    setSelectedIdx(0);
                  }}
                  className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition cursor-pointer ${
                    jaSet === tab
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Character Selector Pills */}
      <div className="flex flex-wrap gap-1.5">
        {activeList.map((item, idx) => (
          <button
            key={`${item.char}-${idx}`}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            className={`rounded-xl border px-3 py-1.5 font-display text-sm font-bold transition cursor-pointer ${
              selectedIdx % activeList.length === idx
                ? 'border-blue-500 bg-blue-600 text-white shadow-2xs'
                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            {item.char}{' '}
            <span className="ml-1 font-mono text-[10px] opacity-80">
              {item.reading}
            </span>
          </button>
        ))}
      </div>

      {activeItem && (
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[240px_1fr]">
          {/* Drawing Pad */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-[220px] w-[220px] overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 select-none">
              {/* Grid crosshairs */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-full w-px border-l border-dashed border-slate-300/80" />
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-px w-full border-t border-dashed border-slate-300/80" />
              </div>

              {showWatermark && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[120px] leading-none font-bold text-slate-300/60">
                  {activeItem.char.split(' ')[0]}
                </div>
              )}

              <canvas
                ref={canvasRef}
                width={220}
                height={220}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative z-10 h-full w-full touch-none cursor-crosshair"
              />
            </div>

            <div className="flex w-full items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowWatermark((v) => !v)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {showWatermark ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Sem guia</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>Com guia</span>
                  </>
                )}
              </button>
              <span className="font-mono text-[11px] font-bold text-slate-500">
                Traços: {strokeCountDrawn}/{activeItem.strokes}
              </span>
              <button
                type="button"
                onClick={clearCanvas}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Limpar</span>
              </button>
            </div>
          </div>

          {/* Stroke Order & Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-3xl font-extrabold text-slate-900">
                    {activeItem.char}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-700">
                    {activeItem.reading}
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-semibold text-emerald-700">
                  {activeItem.meaningPt}
                </p>
                {activeItem.direction === 'rtl' && (
                  <span className="mt-1 mr-1 inline-block rounded-lg bg-cyan-100 px-2 py-0.5 text-[11px] font-bold text-cyan-900">
                    ← RTL · Direita para Esquerda
                  </span>
                )}
                {activeItem.cursiveNote && (
                  <p className="mt-1 inline-block rounded-lg bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                    ⚠️ {activeItem.cursiveNote}
                  </p>
                )}
              </div>

              <DualAudioButtons
                text={activeItem.exampleWord.split('(')[0].trim()}
                languageCode={effectiveAudioLang}
                size="xs"
              />
            </div>

            {activeItem.forms && (
              <div className="grid grid-cols-4 gap-2 rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-2.5 text-center" dir="rtl">
                <div>
                  <p className="text-[10px] font-bold text-slate-500">Isolada</p>
                  <p className="mt-0.5 font-display text-2xl font-bold text-slate-900">{activeItem.forms.isolated}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500">Inicial</p>
                  <p className="mt-0.5 font-display text-2xl font-bold text-slate-900">{activeItem.forms.initial}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500">Medial</p>
                  <p className="mt-0.5 font-display text-2xl font-bold text-slate-900">{activeItem.forms.medial}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500">Final</p>
                  <p className="mt-0.5 font-display text-2xl font-bold text-slate-900">{activeItem.forms.final}</p>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                Ordem recomendada dos {activeItem.strokes} traços
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-slate-700">
                {activeItem.strokeHints.map((hint, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-1.5">
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-blue-500" />
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-emerald-200/70 bg-emerald-50/50 px-3 py-2 text-xs">
              <span>
                <strong>Exemplo:</strong> {activeItem.exampleWord} —{' '}
                <em>{activeItem.examplePt}</em>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mandarin 4-Tone Contour Visual Helper */}
      {effectiveAudioLang === 'zh' && !compact && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="font-display text-sm font-bold text-slate-900">
            Guia Visual dos 4 Tons do Mandarim
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {MANDARIN_TONES.map((t) => (
              <div
                key={t.tone}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-700">{t.namePt}</span>
                  <DualAudioButtons
                    text={t.exampleHanzi}
                    languageCode="zh"
                    size="xs"
                  />
                </div>
                <p className="mt-1 font-mono text-lg font-extrabold text-slate-800">
                  {t.contour}{' '}
                  <span className="text-sm font-semibold text-emerald-700">
                    {t.exampleHanzi} ({t.examplePinyin}) = {t.examplePt}
                  </span>
                </p>
                <p className="mt-1 text-[11px] text-slate-600">
                  {t.descriptionPt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

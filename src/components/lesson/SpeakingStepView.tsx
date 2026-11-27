/**
 * @file src/components/lesson/SpeakingStepView.tsx
 * @description Subcomponente do LessonPlayer para prática de Speaking: checagem fonética instantânea, mapa de calor palavra-por-palavra, replay comparativo lado a lado, oscilador tonal, shadowing e gravação para o professor.
 * @exports SpeakingStepView, classifyWordHeatmap, HeatmapTier
 */
import { useRef, useState } from 'react';
import { Check, Mic, MicOff, Play, Radio, Send, Square, Volume2 } from 'lucide-react';
import type { LanguageCode, LessonStep } from '../../types/learning';
import { isAudioRecordingSupported } from '../../utils/audioRecorder';
import { analyzePhoneticFeedback, type PhoneticWordDetail } from '../../utils/phoneticFeedback';
import { isSpeechRecognitionSupported, speakText, stopSpeaking } from '../../utils/speech';
import { DualAudioButtons } from '../DualAudioButtons';
import { PitchOscilloscope } from '../PitchOscilloscope';
import { ShadowingPanel } from '../steps/ShadowingPanel';

export type HeatmapTier = 'exact' | 'close' | 'missed';

/**
 * Classifica uma palavra avaliada no Speaking para o mapa de calor:
 * - `exact` (emerald): acerto exato com alta confiança
 * - `close` (amber): acerto parcial / confiança moderada / dica fonética
 * - `missed` (rose): palavra ausente ou pronúncia fraca
 */
export function classifyWordHeatmap(
  word: Pick<PhoneticWordDetail, 'matched' | 'confidence'>,
): HeatmapTier {
  if (word.matched) {
    if (typeof word.confidence === 'number' && word.confidence < 0.75) {
      return 'close';
    }
    return 'exact';
  }
  if (typeof word.confidence === 'number' && word.confidence >= 0.35) {
    return 'close';
  }
  return 'missed';
}

type SpeakingStep = Extract<LessonStep, { type: 'speaking' }>;

interface SpeakingStepViewProps {
  step: SpeakingStep;
  languageCode: LanguageCode;
  dialectCode: string;
  isRecordingSpeech: boolean;
  speechStatus: string;
  isRecordingClip: boolean;
  clipSeconds: number;
  recordedBlob: Blob | null;
  recordedDuration: number;
  recordedAudioUrl: string | null;
  speechError: string | null;
  clipError: string | null;
  spokenText: string;
  speakingEval: ReturnType<typeof analyzePhoneticFeedback> | null;
  hasLinkedTeacher: boolean;
  sentClipToTeacher: boolean;
  manualSpeakDone: boolean;
  checkedStatus: 'idle' | 'correct' | 'incorrect';
  onToggleMic: () => void;
  onStartOrStopVoiceClip: () => void;
  onSendAudioClipToTeacher: () => void;
  onManualSpeakingComplete: () => void;
  onRequestTeacherLink?: () => void;
}

export function SpeakingStepView({
  step,
  languageCode,
  dialectCode,
  isRecordingSpeech,
  speechStatus,
  isRecordingClip,
  clipSeconds,
  recordedBlob,
  recordedDuration,
  recordedAudioUrl,
  speechError,
  clipError,
  spokenText,
  speakingEval,
  hasLinkedTeacher,
  sentClipToTeacher,
  manualSpeakDone,
  checkedStatus,
  onToggleMic,
  onStartOrStopVoiceClip,
  onSendAudioClipToTeacher,
  onManualSpeakingComplete,
  onRequestTeacherLink,
}: SpeakingStepViewProps) {
  const [shadowSpeed, setShadowSpeed] = useState<0.75 | 1 | 1.15>(1);
  const [isComparingSequence, setIsComparingSequence] = useState(false);
  const studentAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleCompareSequence = () => {
    if (!recordedAudioUrl) return;
    if (isComparingSequence) {
      stopSpeaking();
      studentAudioRef.current?.pause();
      setIsComparingSequence(false);
      return;
    }
    setIsComparingSequence(true);
    speakText(step.targetSentence, {
      langCode: dialectCode,
      rate: shadowSpeed,
      onEnd: () => {
        const audio = studentAudioRef.current;
        if (!audio) {
          setIsComparingSequence(false);
          return;
        }
        audio.currentTime = 0;
        audio.onended = () => setIsComparingSequence(false);
        audio.onerror = () => setIsComparingSequence(false);
        void audio.play().catch(() => setIsComparingSequence(false));
      },
    });
  };

  return (
    <div className="animate-fade-up space-y-4 rounded-3xl border border-rose-200/80 bg-white p-6 shadow-xs sm:p-7">
      <p className="text-sm font-semibold text-slate-700">{step.promptPt}</p>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="font-display text-xl font-extrabold text-slate-900">
          “{step.targetSentence}”
        </p>
        <p className="mt-1.5 text-sm text-slate-600">{step.translationPt}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-lg bg-white px-2.5 py-1 font-mono text-xs text-slate-600 ring-1 ring-slate-200">
            IPA: {step.ipa}
          </span>
          <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-800 ring-1 ring-rose-200">
            Guia BR: {step.brPhoneticHint}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <DualAudioButtons
            text={step.targetSentence}
            languageCode={languageCode}
            rateMultiplier={shadowSpeed}
            showSlow
            showSpeedToggle
            size="md"
          />
          <div
            data-testid="speaking-speed-selector"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1"
          >
            {([0.75, 1, 1.15] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setShadowSpeed(spd)}
                className={`rounded-lg px-2 py-1 font-mono text-[11px] font-bold transition cursor-pointer ${
                  shadowSpeed === spd
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {spd === 1 ? '1.0x' : `${spd}x`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center">
          <p className="text-xs font-bold text-slate-700">
            1. Checagem rápida de pronúncia
          </p>
          <button
            type="button"
            onClick={onToggleMic}
            className={`my-3 flex h-14 w-14 items-center justify-center rounded-full shadow-md transition cursor-pointer ${
              isRecordingSpeech
                ? 'animate-pulse bg-rose-600 text-white ring-4 ring-rose-200'
                : 'bg-rose-500 text-white hover:bg-rose-600'
            }`}
            aria-label={isRecordingSpeech ? 'Parar ditado' : 'Testar pronúncia'}
          >
            {isRecordingSpeech ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>
          <p className="text-[11px] text-slate-500">
            {isRecordingSpeech
              ? speechStatus || 'Ouvindo... toque novamente para finalizar'
              : isSpeechRecognitionSupported()
                ? 'Clique e fale para ver precisão %'
                : 'Reconhecimento automático indisponível'}
          </p>
        </div>

        <div className="flex flex-col items-center justify-between rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 text-center">
          <p className="text-xs font-bold text-blue-900">
            2. Gravar áudio p/ o Professor ouvir
          </p>

          <button
            type="button"
            onClick={onStartOrStopVoiceClip}
            className={`my-3 flex h-14 w-14 items-center justify-center rounded-full shadow-md transition cursor-pointer ${
              isRecordingClip
                ? 'animate-pulse bg-red-600 text-white ring-4 ring-red-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label={isRecordingClip ? 'Parar gravação' : 'Gravar áudio para professor'}
          >
            {isRecordingClip ? <Square className="h-5 w-5 fill-white" /> : <Radio className="h-6 w-6" />}
          </button>

          <p className="font-mono text-[11px] font-semibold text-blue-800">
            {isRecordingClip
              ? `Gravando: 0:${String(clipSeconds).padStart(2, '0')} / 0:30`
              : isAudioRecordingSupported()
                ? recordedBlob
                  ? `Áudio pronto (${recordedDuration}s)`
                  : 'Grave até 30s e envie para correção'
                : 'Gravação indisponível neste navegador'}
          </p>
        </div>
      </div>

      {speechError && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs text-amber-900">
          {speechError}
        </p>
      )}

      {clipError && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs text-amber-900">
          {clipError}
        </p>
      )}

      {speakingEval && (
        <div className="animate-fade-up space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">
              Você disse: “{spokenText}”
            </span>
            <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 font-mono text-xs font-bold text-white">
              {speakingEval.score}% precisão
            </span>
          </div>
          <p className="text-xs font-medium text-emerald-900">{speakingEval.summaryPt}</p>
          <div className="flex flex-wrap gap-1.5" data-testid="phonetic-word-heatmap">
            {speakingEval.words.map((w, idx) => {
              const tier = classifyWordHeatmap(w);
              const chipStyle =
                tier === 'exact'
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : tier === 'close'
                    ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300 hover:bg-amber-200'
                    : 'bg-rose-100 text-rose-800 ring-1 ring-rose-300 hover:bg-rose-200';
              return (
                <button
                  key={idx}
                  type="button"
                  data-testid="heatmap-word-chip"
                  data-heatmap={tier}
                  onClick={() =>
                    speakText(w.word, { langCode: dialectCode, rate: 0.85 })
                  }
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold transition cursor-pointer ${chipStyle}`}
                  title={`Sílabas: ${w.syllables.join(' · ')} — Clique para ouvir "${w.word}"`}
                >
                  <Volume2 className="h-3 w-3 opacity-70" />
                  <span>{w.syllables.join('·')}</span>
                </button>
              );
            })}
          </div>
          {speakingEval.phonemeBreakdown.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Fonemas:</span>
              {speakingEval.phonemeBreakdown.map((ph, phIdx) => (
                <span
                  key={`${ph.word}-${phIdx}`}
                  data-testid="phoneme-chip"
                  title={`${ph.word}: ${ph.hintPt}`}
                  className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ${
                    ph.status === 'ok'
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                  }`}
                >
                  {ph.symbol} · {ph.word}
                </span>
              ))}
            </div>
          )}
          {speakingEval.phoneticTips.length > 0 && (
            <div className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-950">
              {speakingEval.phoneticTips.map((pt, pIdx) => (
                <p key={pIdx}>
                  <strong>🎯 {pt.ruleTitle}:</strong> {pt.tipPt}
                </p>
              ))}
            </div>
          )}
          {speakingEval.targetedDrills.length > 0 && (
            <div className="space-y-2 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3">
              <p className="text-[11px] font-bold text-indigo-900">
                Treino Direcionado de Fonemas:
              </p>
              {speakingEval.targetedDrills.map((dr) => (
                <div
                  key={dr.soundLabel}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-2.5 text-[11px] ring-1 ring-slate-200"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {dr.soundLabel} · {dr.contrastPair}
                    </p>
                    <p className="text-slate-600">“{dr.practiceSentence}”</p>
                  </div>
                  <DualAudioButtons
                    text={dr.practiceSentence}
                    languageCode={languageCode}
                    size="xs"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(languageCode === 'zh' || languageCode === 'ja') && (
        <PitchOscilloscope languageCode={languageCode} compact />
      )}

      <ShadowingPanel
        targetText={step.targetSentence}
        dialectCode={dialectCode}
        languageCode={languageCode}
      />

      {recordedAudioUrl && (
        <div
          data-testid="comparative-replay-panel"
          className="animate-fade-up space-y-3 rounded-2xl border border-blue-200 bg-blue-50/60 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-blue-950">
            <span>Replay Comparativo ({recordedDuration}s)</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCompareSequence}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-[11px] font-bold transition cursor-pointer ${
                  isComparingSequence
                    ? 'bg-rose-600 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Play className="h-3 w-3" />
                <span>
                  {isComparingSequence ? 'Parar Sequência' : 'Comparar em Sequência'}
                </span>
              </button>
              <button
                type="button"
                onClick={onStartOrStopVoiceClip}
                className="text-blue-700 hover:underline cursor-pointer"
              >
                Regravar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col justify-between gap-2 rounded-xl border border-indigo-200 bg-white p-3">
              <p className="text-[11px] font-bold text-indigo-900">
                1. Modelo Nativo ({shadowSpeed === 1 ? '1.0x' : `${shadowSpeed}x`})
              </p>
              <button
                type="button"
                onClick={() =>
                  speakText(step.targetSentence, {
                    langCode: dialectCode,
                    rate: shadowSpeed,
                  })
                }
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-800 hover:bg-indigo-100 cursor-pointer"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Ouvir Modelo Nativo</span>
              </button>
            </div>

            <div className="flex flex-col justify-between gap-2 rounded-xl border border-blue-200 bg-white p-3">
              <p className="text-[11px] font-bold text-blue-900">
                2. Sua Gravação ({recordedDuration}s)
              </p>
              <audio
                ref={studentAudioRef}
                controls
                src={recordedAudioUrl}
                className="h-10 w-full"
              />
            </div>
          </div>

          {hasLinkedTeacher ? (
            <button
              type="button"
              disabled={sentClipToTeacher}
              onClick={onSendAudioClipToTeacher}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:bg-emerald-600 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>
                {sentClipToTeacher
                  ? 'Áudio enviado para o Professor corrigir!'
                  : 'Enviar áudio para o Professor avaliar'}
              </span>
            </button>
          ) : (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
              <p className="font-bold">
                Envio ao professor restrito (sem professor vinculado).
              </p>
              <p className="mt-0.5 text-[11px]">
                Sua gravação e nota automática funcionam normalmente, mas para enviar ao professor é necessário se vincular.
              </p>
              {onRequestTeacherLink && (
                <button
                  type="button"
                  onClick={onRequestTeacherLink}
                  className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-amber-700 cursor-pointer"
                >
                  Vincular a um professor
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {!manualSpeakDone && checkedStatus === 'idle' && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onManualSpeakingComplete}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span>Pratiquei em voz alta (Sem microfone)</span>
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-950">
        <strong className="font-bold">Foco de pronúncia: </strong>
        {step.focusTip}
      </div>
    </div>
  );
}

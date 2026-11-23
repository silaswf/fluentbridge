import { useEffect, useRef, useState } from 'react';
import { Mic, Play, Radio, Square, Volume2 } from 'lucide-react';
import type { LanguageCode } from '../../types/learning';
import {
  type AudioRecorderHandle,
  isAudioRecordingSupported,
  startAudioRecording,
} from '../../utils/audioRecorder';
import {
  analyzePhoneticFeedback,
  type PhoneticFeedbackResult,
} from '../../utils/phoneticFeedback';
import { speakText, stopSpeaking, transcribeAudioBlob } from '../../utils/speech';

interface ShadowingPanelProps {
  targetText: string;
  dialectCode: string;
  languageCode: LanguageCode;
}

export function ShadowingPanel({
  targetText,
  dialectCode,
  languageCode,
}: ShadowingPanelProps) {
  const [speed, setSpeed] = useState<0.75 | 0.9 | 1 | 1.15>(1);
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'recording' | 'analyzing' | 'done'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [studentAudioUrl, setStudentAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [phonetic, setPhonetic] = useState<PhoneticFeedbackResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const recorderRef = useRef<AudioRecorderHandle | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      recorderRef.current?.cancel();
      if (studentAudioUrl) URL.revokeObjectURL(studentAudioUrl);
    };
  }, [studentAudioUrl]);

  const startShadowing = () => {
    if (!isAudioRecordingSupported()) {
      setErrorMsg('Gravação de áudio não suportada neste navegador.');
      return;
    }
    setErrorMsg('');
    setTranscript('');
    setPhonetic(null);
    if (studentAudioUrl) {
      URL.revokeObjectURL(studentAudioUrl);
      setStudentAudioUrl(null);
    }

    setPhase('countdown');
    setCountdown(3);
    let left = 3;

    timerRef.current = window.setInterval(() => {
      left -= 1;
      if (left > 0) {
        setCountdown(left);
        return;
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setPhase('recording');
      speakText(targetText, { langCode: dialectCode, rate: speed });

      void startAudioRecording({
        onComplete: (blob) => {
          const url = URL.createObjectURL(blob);
          setStudentAudioUrl(url);
          setPhase('analyzing');
          void transcribeAudioBlob(blob, dialectCode).then((res) => {
            if (res.ok && res.text) {
              setTranscript(res.text);
              setPhonetic(
                analyzePhoneticFeedback(targetText, res.text, languageCode),
              );
            } else {
              setErrorMsg(
                res.error ??
                  'Ouça sua gravação comparada ao nativo abaixo!',
              );
            }
            setPhase('done');
          });
        },
        onError: (msg) => {
          setErrorMsg(msg);
          setPhase('idle');
        },
      }).then((handle) => {
        if (!handle) {
          setPhase('idle');
          return;
        }
        recorderRef.current = handle;
      });
    }, 650);
  };

  const stopShadowing = () => {
    stopSpeaking();
    recorderRef.current?.stop();
  };

  return (
    <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
            <Radio className="h-3.5 w-3.5 text-indigo-600" />
            <span>Modo Shadowing (Repita junto com a voz nativa)</span>
          </p>
          <p className="mt-0.5 text-[11px] text-indigo-800/80">
            Escolha a velocidade, acompanhe a contagem e fale em seguida para comparar sua onda de voz.
          </p>
        </div>

        <div className="flex items-center gap-1">
          {([0.75, 0.9, 1, 1.15] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`rounded-lg px-2 py-1 font-mono text-[10px] font-bold transition cursor-pointer ${
                speed === s
                  ? 'bg-indigo-600 text-white'
                  : 'border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {phase === 'idle' || phase === 'done' ? (
          <button
            type="button"
            onClick={startShadowing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 cursor-pointer"
          >
            <Mic className="h-3.5 w-3.5" />
            <span>{phase === 'done' ? 'Repetir Shadowing' : 'Iniciar Shadowing (3-2-1)'}</span>
          </button>
        ) : phase === 'countdown' ? (
          <span className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-3.5 py-2 font-mono text-xs font-extrabold text-amber-900">
            Prepare-se... {countdown}
          </span>
        ) : phase === 'recording' ? (
          <button
            type="button"
            onClick={stopShadowing}
            className="inline-flex animate-pulse items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
          >
            <Square className="h-3.5 w-3.5 fill-white" />
            <span>Parar &amp; Comparar</span>
          </button>
        ) : (
          <span className="text-xs font-semibold text-indigo-700">
            Analisando pronúncia e sílabas...
          </span>
        )}

        <button
          type="button"
          onClick={() => speakText(targetText, { langCode: dialectCode, rate: speed })}
          className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 cursor-pointer"
        >
          <Volume2 className="h-3.5 w-3.5" />
          <span>Ouvir nativo ({speed}x)</span>
        </button>
      </div>

      {errorMsg && (
        <p className="mt-2 text-xs font-medium text-amber-800">{errorMsg}</p>
      )}

      {studentAudioUrl && (
        <div className="mt-3 space-y-2 rounded-xl border border-indigo-200 bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
              <Play className="h-3 w-3 text-indigo-600" />
              Sua gravação Shadowing vs. Nativo:
            </span>
            {phonetic && (
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-indigo-800">
                Precisão: {phonetic.score}%
              </span>
            )}
          </div>
          <audio controls src={studentAudioUrl} className="h-9 w-full" />
          {transcript && (
            <p className="text-xs text-slate-600">
              <strong>Transcrição:</strong> “{transcript}”
            </p>
          )}
          {phonetic && (
            <p className="text-xs font-medium text-indigo-800">
              {phonetic.summaryPt}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

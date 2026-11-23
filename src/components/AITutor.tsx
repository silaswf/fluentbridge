import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Languages,
  Lightbulb,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import type { AITutorScenario, Accent, TutorMessage } from '../types/learning';
import {
  AI_TUTOR_SCENARIOS,
  generateTutorReply,
} from '../utils/aiTutorEngine';
import {
  isSpeechRecognitionSupported,
  speakEnglish,
  startSpeechRecognition,
  stopSpeaking,
} from '../utils/speech';
import { DualAudioButtons } from './DualAudioButtons';

interface AITutorProps {
  accent: Accent;
  geminiApiKey?: string;
  onCompleteSession: (xpEarned: number) => void;
}

export function AITutor({
  accent,
  geminiApiKey,
  onCompleteSession,
}: AITutorProps) {
  const [selectedScenario, setSelectedScenario] = useState<AITutorScenario | null>(
    null,
  );
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [usedGeminiSession, setUsedGeminiSession] = useState(false);
  const [sessionAwarded, setSessionAwarded] = useState(false);

  const stopRecRef = useRef<(() => void) | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      stopRecRef.current?.();
    };
  }, []);

  const startScenario = (scenario: AITutorScenario) => {
    stopSpeaking();
    setSelectedScenario(scenario);
    setMessages([
      {
        id: `msg-open-${Date.now()}`,
        sender: 'tutor',
        textEn: scenario.openingEn,
        translationPt: scenario.openingPt,
        timestamp: 'Agora',
      },
    ]);
    setSuggestions(scenario.initialSuggestions);
    setShowTranslations({});
    setInput('');
    setVoiceError('');
    setSessionAwarded(false);
    setUsedGeminiSession(Boolean(geminiApiKey?.trim()));
    if (autoSpeak) {
      speakEnglish(scenario.openingEn, { accent });
    }
  };

  const handleSendText = async (overrideText?: string) => {
    if (!selectedScenario || isSending) return;
    const text = (overrideText ?? input).trim();
    if (!text) return;

    setInput('');
    setVoiceError('');
    setIsSending(true);

    const studentMsgId = `msg-stu-${Date.now()}`;
    const provisionalStudentMsg: TutorMessage = {
      id: studentMsgId,
      sender: 'student',
      textEn: text,
      timestamp: 'Agora',
    };

    const nextHistory = [...messages, provisionalStudentMsg];
    setMessages(nextHistory);

    const result = await generateTutorReply({
      scenario: selectedScenario,
      history: messages,
      userText: text,
      geminiApiKey,
    });

    setUsedGeminiSession(result.usedGemini);

    const tutorMsg: TutorMessage = {
      id: `msg-tut-${Date.now() + 1}`,
      sender: 'tutor',
      textEn: result.replyEn,
      translationPt: result.replyPt,
      timestamp: 'Agora',
    };

    setMessages((prev) => [
      ...prev.map((m) =>
        m.id === studentMsgId
          ? {
              ...m,
              feedbackPt: result.feedbackPt,
              correctedEn: result.correctedEn,
            }
          : m,
      ),
      tutorMsg,
    ]);
    setSuggestions(result.suggestions);
    setIsSending(false);

    if (autoSpeak) {
      speakEnglish(result.replyEn, { accent });
    }

    const totalStudentTurns =
      messages.filter((m) => m.sender === 'student').length + 1;
    if (totalStudentTurns >= 3 && !sessionAwarded) {
      setSessionAwarded(true);
      onCompleteSession(35);
    }
  };

  const handleToggleVoiceInput = () => {
    if (isListeningVoice) {
      stopRecRef.current?.();
      setIsListeningVoice(false);
      return;
    }

    setVoiceError('');
    setVoiceStatus('');
    setIsListeningVoice(true);
    stopRecRef.current = startSpeechRecognition(accent, {
      onResult: (transcript) => {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      },
      onStatus: (msg) => setVoiceStatus(msg),
      onError: (msg) => setVoiceError(msg),
      onEnd: () => {
        setIsListeningVoice(false);
        setVoiceStatus('');
      },
    });
  };

  if (!selectedScenario) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200">
              <Bot className="h-3.5 w-3.5" />
              Roleplay Guiado com Correção Instantânea
            </span>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
              Tutor de Conversação IA
            </h1>
            <p className="mt-0.5 text-sm text-slate-600">
              Pratique diálogos reais por voz ou texto com feedback imediato sobre erros comuns de brasileiros.
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-xs font-bold ${
              geminiApiKey?.trim()
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {geminiApiKey?.trim()
              ? 'Google Gemini Conectado'
              : 'Tutor Inteligente Local Ativo'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {AI_TUTOR_SCENARIOS.map((sc) => (
            <article
              key={sc.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:border-blue-300 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-700">
                    {sc.level}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {sc.personaName}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-lg font-bold text-slate-900">
                  {sc.titlePt}
                </h2>
                <p className="text-xs font-medium text-slate-400">{sc.titleEn}</p>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                  {sc.settingPt}
                </p>

                <ul className="mt-3 space-y-1">
                  {sc.goalsPt.map((goal, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-1.5 text-[11px] text-slate-600"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => startScenario(sc)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-blue-700 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Iniciar diálogo neste cenário</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    );
  }

  const studentTurns = messages.filter((m) => m.sender === 'student').length;

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs lg:h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/70 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setSelectedScenario(null);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Voltar para cenários"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm font-extrabold text-slate-900 sm:text-base">
                {selectedScenario.personaName} · {selectedScenario.titlePt}
              </h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700">
                {selectedScenario.level}
              </span>
            </div>
            <p className="text-xs text-slate-500">{selectedScenario.personaRole}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sessionAwarded ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              <Zap className="h-3.5 w-3.5" />
              +35 XP ganhos!
            </span>
          ) : (
            <span className="rounded-full bg-slate-200/70 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600">
              {studentTurns}/3 falas p/ +35 XP
            </span>
          )}
          <button
            type="button"
            onClick={() => setAutoSpeak((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
              autoSpeak
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-500'
            }`}
            title="Ler respostas em voz alta automaticamente"
          >
            {autoSpeak ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Áudio auto</span>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-[#F7F9FC] p-4 sm:p-6">
        {messages.map((msg) => {
          const isTutor = msg.sender === 'tutor';
          const showPt = Boolean(showTranslations[msg.id]);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isTutor ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-2xs sm:max-w-[78%] ${
                  isTutor
                    ? 'border border-slate-200 bg-white text-slate-900'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="text-sm leading-relaxed font-medium">{msg.textEn}</p>

                {isTutor && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2">
                    <DualAudioButtons
                      text={msg.textEn}
                      languageCode="en"
                      showSlow
                      size="xs"
                    />
                    {msg.translationPt && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowTranslations((prev) => ({
                            ...prev,
                            [msg.id]: !prev[msg.id],
                          }))
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        <Languages className="h-3 w-3" />
                        <span>{showPt ? 'Ocultar PT' : 'Traduzir'}</span>
                      </button>
                    )}
                  </div>
                )}

                {isTutor && showPt && msg.translationPt && (
                  <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    {msg.translationPt}
                  </p>
                )}
              </div>

              {/* Inline Teacher/Tutor Feedback under student turn */}
              {!isTutor && (msg.feedbackPt || msg.correctedEn) && (
                <div className="mt-1.5 max-w-[85%] rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs text-amber-950">
                  <p className="flex items-start gap-1.5">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                    <span>{msg.feedbackPt}</span>
                  </p>
                  {msg.correctedEn && (
                    <p className="mt-1 font-semibold text-emerald-800">
                      Forma mais natural: “{msg.correctedEn}”
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Bot className="h-4 w-4 animate-bounce text-blue-600" />
            <span>
              {selectedScenario.personaName} está preparando a resposta
              {usedGeminiSession ? ' via Gemini...' : '...'}
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions & Composer */}
      <footer className="border-t border-slate-200 bg-white p-3.5 sm:p-4">
        {suggestions.length > 0 && (
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setShowSuggestions((v) => !v)}
              className="mb-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>
                {showSuggestions
                  ? 'Sugestões de resposta (clique para enviar):'
                  : 'Mostrar sugestões de resposta'}
              </span>
            </button>
            {showSuggestions && (
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendText(sug)}
                    className="rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-left text-xs font-medium text-blue-900 transition hover:bg-blue-100 cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {voiceStatus && (
          <p className="mb-2 text-xs font-semibold text-blue-700">{voiceStatus}</p>
        )}

        {voiceError && (
          <p className="mb-2 text-xs font-medium text-amber-800">{voiceError}</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSendText();
          }}
          className="flex items-center gap-2"
        >
          {isSpeechRecognitionSupported() && (
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition cursor-pointer ${
                isListeningVoice
                  ? 'animate-pulse border-rose-500 bg-rose-500 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title={isListeningVoice ? 'Parar ditado por voz' : 'Falar em inglês no microfone'}
              aria-label="Falar em inglês"
            >
              {isListeningVoice ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
          )}

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva ou dite sua resposta em inglês..."
            className="h-11 flex-1 rounded-xl border border-slate-300 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-2xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
      </footer>
    </div>
  );
}

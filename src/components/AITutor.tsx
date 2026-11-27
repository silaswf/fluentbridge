/**
 * @file src/components/AITutor.tsx
 * @description Tutor IA de Conversação (chat e chamada de voz com VAD): cenários contextualizados, correção gramatical, áudio neural, painel de memória pedagógica e modo imersão.
 * @exports AITutor, parsePedagogicalMemory, ParsedPedagogicalMemory
 */
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bot,
  Brain,
  CheckCircle2,
  ChevronDown,
  Dices,
  Languages,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  PhoneCall,
  Search,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import type {
  AITutorScenario,
  Accent,
  CEFRLevel,
  LanguageCode,
  ProsodyAnalysis,
  Topic,
  TutorMessage,
} from '../types/learning';
import {
  AI_TUTOR_SCENARIOS,
  UNIT_ROLEPLAY_ANGLES,
  generateCustomAIScenario,
  generateDynamicOpeningVariation,
  generateDynamicUnitScenario,
  generateTutorReply,
  type UnitRoleplayAngle,
} from '../utils/aiTutorEngine';
import { getImmersionStrings, isImmersionLevel } from '../utils/immersion';
import {
  isSpeechRecognitionSupported,
  speakText,
  startSpeechRecognition,
  stopSpeaking,
  transcribeAudioBlob,
} from '../utils/speech';
import {
  analyzeProsody,
  startContinuousVadSession,
  type VadSessionState,
} from '../utils/voiceVadEngine';
import { DualAudioButtons } from './DualAudioButtons';

export interface ParsedPedagogicalMemory {
  weakWords: string[];
  recentMistakes: string[];
}

/**
 * Extrai palavras fracas do SRS e erros recentes do Caderno de Erros a partir da string de memória pedagógica.
 */
export function parsePedagogicalMemory(memory?: string): ParsedPedagogicalMemory {
  const text = memory?.trim() ?? '';
  if (!text) return { weakWords: [], recentMistakes: [] };

  const weakWords: string[] = [];
  const recentMistakes: string[] = [];

  const vocabMatch = text.match(
    /Vocabulário prioritário do aluno no SRS para reforçar naturalmente na conversa:\s*([^.]+)\.?/i,
  );
  if (vocabMatch?.[1]) {
    for (const item of vocabMatch[1].split(',')) {
      const clean = item.trim();
      if (clean) weakWords.push(clean);
    }
  }

  const mistakesMatch = text.match(
    /Erros recentes do aluno no Caderno de Erros para corrigir com delicadeza se surgirem:\s*([^.]+(?:\.[^.]+)*?)\.?$/i,
  );
  if (mistakesMatch?.[1]) {
    for (const item of mistakesMatch[1].split(';')) {
      const clean = item.trim().replace(/\.$/, '');
      if (clean) recentMistakes.push(clean);
    }
  }

  if (weakWords.length === 0 && recentMistakes.length === 0) {
    for (const item of text.split(/[;\n]/)) {
      const clean = item.trim();
      if (clean) recentMistakes.push(clean);
    }
  }

  return { weakWords, recentMistakes };
}

interface AITutorProps {
  accent: Accent;
  languageCode?: LanguageCode;
  activeDialect?: string;
  geminiApiKey?: string;
  topics?: Topic[];
  initialTopic?: Topic | null;
  pedagogicalMemory?: string;
  onClearInitialTopic?: () => void;
  onCompleteSession: (xpEarned: number) => void;
}

export function AITutor({
  accent,
  languageCode = 'en',
  activeDialect,
  geminiApiKey,
  topics = [],
  initialTopic,
  pedagogicalMemory,
  onClearInitialTopic,
  onCompleteSession,
}: AITutorProps) {
  const effectiveDialect = activeDialect || accent;
  const scopedScenarios = AI_TUTOR_SCENARIOS.filter(
    (s) => (s.languageCode ?? 'en') === languageCode,
  );
  const visibleScenarios =
    scopedScenarios.length > 0 ? scopedScenarios : AI_TUTOR_SCENARIOS;

  const [hubTab, setHubTab] = useState<'scenarios' | 'by_unit' | 'custom'>(
    initialTopic ? 'by_unit' : 'scenarios',
  );
  const [scenarioLevelFilter, setScenarioLevelFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [scenarioSearch, setScenarioSearch] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    initialTopic?.id ?? topics[0]?.id ?? '',
  );
  const [customIdea, setCustomIdea] = useState('');
  const [customLevel, setCustomLevel] = useState<CEFRLevel>('B1');
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);

  const [selectedScenario, setSelectedScenario] = useState<AITutorScenario | null>(
    null,
  );
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [streamingReplyText, setStreamingReplyText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [callMode, setCallMode] = useState(false);
  const [vadState, setVadState] = useState<VadSessionState>('idle');
  const [audioBars, setAudioBars] = useState<number[]>(Array(12).fill(12));
  const [bargeInEnabled, setBargeInEnabled] = useState(true);
  const [vadSilenceMs, setVadSilenceMs] = useState<700 | 950 | 1400>(950);
  const [vadAdvancedOpen, setVadAdvancedOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [usedGeminiSession, setUsedGeminiSession] = useState(false);
  const [sessionAwarded, setSessionAwarded] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);

  const parsedMemory = parsePedagogicalMemory(pedagogicalMemory);
  const hasMemoryItems =
    parsedMemory.weakWords.length > 0 || parsedMemory.recentMistakes.length > 0;
  const memoryCount =
    parsedMemory.weakWords.length + parsedMemory.recentMistakes.length;

  const stopRecRef = useRef<(() => void) | null>(null);
  const vadSessionRef = useRef<{ stop: () => void } | null>(null);
  const isAssistantSpeakingRef = useRef(false);
  const bargeInEnabledRef = useRef(bargeInEnabled);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bargeInEnabledRef.current = bargeInEnabled;
  }, [bargeInEnabled]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      stopRecRef.current?.();
      vadSessionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (initialTopic) {
      setHubTab('by_unit');
      setSelectedUnitId(initialTopic.id);
      setSelectedScenario(null);
      onClearInitialTopic?.();
    } else if (topics.length > 0 && !topics.some((t) => t.id === selectedUnitId)) {
      setSelectedUnitId(topics[0].id);
    }
  }, [initialTopic, topics, selectedUnitId, onClearInitialTopic]);

  const speakTutorLine = (text: string) => {
    speakText(text, {
      langCode: effectiveDialect,
      onStart: () => {
        isAssistantSpeakingRef.current = true;
      },
      onEnd: () => {
        isAssistantSpeakingRef.current = false;
      },
    });
  };

  const startScenario = (scenario: AITutorScenario) => {
    stopSpeaking();
    isAssistantSpeakingRef.current = false;
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
    if (autoSpeak || callMode) {
      speakTutorLine(scenario.openingEn);
    }
  };

  const handleSendText = async (overrideText?: string, prosody?: ProsodyAnalysis) => {
    if (!selectedScenario || isSending) return;
    const text = (overrideText ?? input).trim();
    if (!text) return;

    setInput('');
    setVoiceError('');
    setStreamingReplyText('');
    setIsSending(true);

    const studentMsgId = `msg-stu-${Date.now()}`;
    const provisionalStudentMsg: TutorMessage = {
      id: studentMsgId,
      sender: 'student',
      textEn: text,
      prosody,
      timestamp: 'Agora',
    };

    const nextHistory = [...messages, provisionalStudentMsg];
    setMessages(nextHistory);

    const result = await generateTutorReply({
      scenario: selectedScenario,
      history: messages,
      userText: text,
      geminiApiKey,
      pedagogicalMemory,
      onPartialReply: (partial) => setStreamingReplyText(partial),
    });

    setStreamingReplyText('');
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

    if (autoSpeak || callMode) {
      speakTutorLine(result.replyEn);
    }

    const totalStudentTurns =
      messages.filter((m) => m.sender === 'student').length + 1;
    if (totalStudentTurns >= 3 && !sessionAwarded) {
      setSessionAwarded(true);
      onCompleteSession(35);
    }
  };

  const handleSendRef = useRef(handleSendText);
  handleSendRef.current = handleSendText;

  useEffect(() => {
    if (!callMode || !selectedScenario) {
      vadSessionRef.current?.stop();
      vadSessionRef.current = null;
      setVadState('idle');
      setAudioBars(Array(12).fill(12));
      return undefined;
    }

    let cancelled = false;
    setVoiceError('');
    void startContinuousVadSession({
      silenceMs: vadSilenceMs,
      isAssistantSpeaking: () => isAssistantSpeakingRef.current,
      bargeInEnabled: () => bargeInEnabledRef.current,
      onBargeIn: () => {
        stopSpeaking();
        isAssistantSpeakingRef.current = false;
      },
      onLevel: (_lvl, bars) => {
        if (!cancelled) setAudioBars(bars);
      },
      onStateChange: (nextState) => {
        if (!cancelled) setVadState(nextState);
      },
      onUtterance: async ({ blob, speechDurationMs, pauseMs, rmsSamples }) => {
        if (cancelled) return;
        setVadState('processing');
        const stt = await transcribeAudioBlob(blob, effectiveDialect);
        if (cancelled) return;
        if (stt.ok && stt.text) {
          const prosody = analyzeProsody(
            stt.text,
            speechDurationMs,
            pauseMs,
            rmsSamples,
          );
          await handleSendRef.current(stt.text, prosody);
        } else if (stt.error) {
          setVoiceError(stt.error);
        }
        if (!cancelled) setVadState('listening');
      },
      onError: (msg) => {
        if (!cancelled) {
          setVoiceError(msg);
          setCallMode(false);
        }
      },
    }).then((session) => {
      if (cancelled) {
        session?.stop();
      } else {
        vadSessionRef.current = session;
      }
    });

    return () => {
      cancelled = true;
      vadSessionRef.current?.stop();
      vadSessionRef.current = null;
    };
  }, [callMode, selectedScenario?.id, vadSilenceMs, effectiveDialect]);

  const handleToggleVoiceInput = () => {
    if (isListeningVoice) {
      stopRecRef.current?.();
      setIsListeningVoice(false);
      return;
    }

    setVoiceError('');
    setVoiceStatus('');
    setIsListeningVoice(true);
    stopRecRef.current = startSpeechRecognition(effectiveDialect, {
      onResult: (transcript) => {
        if (callMode) {
          void handleSendText(transcript);
        } else {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      },
      onStatus: (msg) => setVoiceStatus(msg),
      onError: (msg) => setVoiceError(msg),
      onEnd: () => {
        setIsListeningVoice(false);
        setVoiceStatus('');
      },
    });
  };

  const handleStartWithVariation = async (sc: AITutorScenario) => {
    setIsGeneratingScenario(true);
    const varied = await generateDynamicOpeningVariation(sc, geminiApiKey);
    setIsGeneratingScenario(false);
    startScenario(varied);
  };

  const handleStartUnitAngle = async (topic: Topic, angle: UnitRoleplayAngle) => {
    setIsGeneratingScenario(true);
    const { scenario } = await generateDynamicUnitScenario(
      topic,
      angle,
      geminiApiKey,
    );
    setIsGeneratingScenario(false);
    startScenario(scenario);
  };

  const handleStartCustomScenario = async (surprise = false) => {
    setIsGeneratingScenario(true);
    const { scenario } = await generateCustomAIScenario(
      surprise ? '' : customIdea,
      languageCode,
      customLevel,
      geminiApiKey,
    );
    setIsGeneratingScenario(false);
    startScenario(scenario);
  };

  const renderMemoryPanel = () => {
    if (!hasMemoryItems) return null;
    return (
      <div
        data-testid="ai-tutor-memory-panel"
        className="rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-2.5 text-xs"
      >
        <button
          type="button"
          onClick={() => setMemoryOpen((v) => !v)}
          aria-expanded={memoryOpen}
          className="flex w-full items-center justify-between gap-2 text-left font-bold text-violet-950 cursor-pointer"
        >
          <span className="inline-flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-600" />
            <span>Memória Pedagógica da IA</span>
            <span className="rounded-full bg-violet-200/80 px-2 py-0.5 font-mono text-[10px] font-bold text-violet-900">
              {memoryCount} {memoryCount === 1 ? 'alvo' : 'alvos'}
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-violet-700 transition-transform ${
              memoryOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {memoryOpen && (
          <div className="mt-2.5 space-y-2 border-t border-violet-200/80 pt-2.5 text-violet-950">
            {parsedMemory.weakWords.length > 0 && (
              <div>
                <p className="text-[10px] font-extrabold tracking-wider text-violet-700 uppercase">
                  Palavras fracas / SRS em foco
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {parsedMemory.weakWords.map((word) => (
                    <span
                      key={word}
                      className="rounded-lg bg-white px-2 py-0.5 font-semibold text-violet-900 ring-1 ring-violet-200"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {parsedMemory.recentMistakes.length > 0 && (
              <div>
                <p className="text-[10px] font-extrabold tracking-wider text-violet-700 uppercase">
                  Erros recentes monitorados
                </p>
                <ul className="mt-1 space-y-1">
                  {parsedMemory.recentMistakes.map((err, idx) => (
                    <li
                      key={idx}
                      className="rounded-lg bg-white/80 px-2.5 py-1 text-[11px] text-violet-900 ring-1 ring-violet-200/70"
                    >
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!selectedScenario) {
    const filteredScenarios = visibleScenarios.filter((sc) => {
      if (scenarioLevelFilter !== 'ALL' && sc.level !== scenarioLevelFilter) {
        return false;
      }
      if (!scenarioSearch.trim()) return true;
      const q = scenarioSearch.toLowerCase();
      return (
        sc.titlePt.toLowerCase().includes(q) ||
        sc.titleEn.toLowerCase().includes(q) ||
        sc.settingPt.toLowerCase().includes(q) ||
        sc.personaName.toLowerCase().includes(q)
      );
    });

    const activeUnit =
      topics.find((t) => t.id === selectedUnitId) ?? topics[0] ?? null;

    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200">
              <Bot className="h-3.5 w-3.5" />
              Roleplay Dinâmico com IA · {visibleScenarios.length} situações + 10 modos/unidade
            </span>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
              Tutor de Conversação IA
            </h1>
            <p className="mt-0.5 text-sm text-slate-600">
              Diálogos não-roteirizados gerados ao vivo pela IA: escolha 1 das {visibleScenarios.length} situações, pratique qualquer unidade em 10 ângulos ou crie um tema livre.
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

        {renderMemoryPanel()}

        {/* 3 Mode Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setHubTab('scenarios')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              hubTab === 'scenarios'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {visibleScenarios.length} Situações Reais
          </button>
          <button
            type="button"
            onClick={() => setHubTab('by_unit')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              hubTab === 'by_unit'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            10 Modos por Unidade ({topics.length} unid.)
          </button>
          <button
            type="button"
            onClick={() => setHubTab('custom')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              hubTab === 'custom'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Cenário Livre / Surpreenda-me
          </button>
        </div>

        {isGeneratingScenario && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs font-bold text-indigo-800">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Criando cenário vivo e inédito com a IA...</span>
          </div>
        )}

        {hubTab === 'scenarios' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative min-w-[240px] flex-1">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={scenarioSearch}
                  onChange={(e) => setScenarioSearch(e.target.value)}
                  placeholder="Filtrar situações (ex: aeroporto, entrevista, café, B2)..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setScenarioLevelFilter(lvl)}
                    className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold transition cursor-pointer ${
                      scenarioLevelFilter === lvl
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {lvl === 'ALL' ? 'Todos' : lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredScenarios.map((sc) => (
                <article
                  key={sc.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:border-blue-300 hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-700">
                          {sc.level}
                        </span>
                        {isImmersionLevel(sc.level) && (
                          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                            {getImmersionStrings(languageCode, sc.level).badgeLabel}
                          </span>
                        )}
                      </div>
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

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      disabled={isGeneratingScenario}
                      onClick={() => startScenario(sc)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Iniciar</span>
                    </button>
                    <button
                      type="button"
                      disabled={isGeneratingScenario}
                      onClick={() => void handleStartWithVariation(sc)}
                      title="Gerar uma variação inédita com a IA"
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60 cursor-pointer"
                    >
                      <Dices className="h-3.5 w-3.5" />
                      <span>Variação IA</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {hubTab === 'by_unit' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="min-w-[260px] flex-1">
                <label className="text-xs font-bold text-slate-700">
                  Selecione qualquer unidade ({topics.length} disponíveis):
                </label>
                <select
                  value={activeUnit?.id ?? ''}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  {topics.map((t, i) => (
                    <option key={t.id} value={t.id}>
                      {i + 1}. [{t.level}] {isImmersionLevel(t.level) ? t.titleEn : t.titlePt}
                    </option>
                  ))}
                </select>
              </div>
              {activeUnit && (
                <button
                  type="button"
                  disabled={isGeneratingScenario}
                  onClick={() => {
                    const rand =
                      UNIT_ROLEPLAY_ANGLES[
                        Math.floor(Math.random() * UNIT_ROLEPLAY_ANGLES.length)
                      ];
                    void handleStartUnitAngle(activeUnit, rand);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
                >
                  <Dices className="h-4 w-4" />
                  <span>Sortear Modo ao Vivo</span>
                </button>
              )}
            </div>

            {activeUnit && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {UNIT_ROLEPLAY_ANGLES.map((angle, idx) => (
                  <button
                    key={angle.id}
                    type="button"
                    disabled={isGeneratingScenario}
                    onClick={() => void handleStartUnitAngle(activeUnit, angle)}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-400 hover:bg-indigo-50/30 disabled:opacity-60 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-indigo-700">
                          Modo {idx + 1}/10 · {activeUnit.level}
                        </span>
                        <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                      </div>
                      <h3 className="mt-2 font-display text-sm font-bold text-slate-900">
                        {isImmersionLevel(activeUnit.level)
                          ? angle.labelEn
                          : angle.labelPt}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">
                        {angle.descriptionPt}
                      </p>
                    </div>
                    <span className="mt-3 text-[11px] font-bold text-indigo-700">
                      Gerar diálogo ao vivo →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {hubTab === 'custom' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Crie qualquer situação real para conversar com a IA
            </h2>
            <p className="text-xs text-slate-600">
              Nada pré-gravado: descreva a situação que você quer treinar hoje ou clique em <strong>Surpreenda-me</strong> para a IA inventar um desafio na hora.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <input
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                placeholder="Ex: Explicar meu projeto de engenharia para um cliente, negociar diária de hotel..."
                className="sm:col-span-3 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
              />
              <select
                value={customLevel}
                onChange={(e) => setCustomLevel(e.target.value as CEFRLevel)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-800"
              >
                {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map((l) => (
                  <option key={l} value={l}>
                    Nível {l} {isImmersionLevel(l) ? '(Imersão)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                disabled={isGeneratingScenario || !customIdea.trim()}
                onClick={() => void handleStartCustomScenario(false)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Criar Roleplay Personalizado</span>
              </button>
              <button
                type="button"
                disabled={isGeneratingScenario}
                onClick={() => void handleStartCustomScenario(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 cursor-pointer"
              >
                <Dices className="h-4 w-4" />
                <span>Surpreenda-me com IA</span>
              </button>
            </div>
          </div>
        )}
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
              isAssistantSpeakingRef.current = false;
              setCallMode(false);
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
            data-testid="toggle-full-duplex-call"
            onClick={() => {
              const next = !callMode;
              setCallMode(next);
              if (next) setAutoSpeak(true);
            }}
            className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
              callMode
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-600'
            }`}
            title="Chamada Full-Duplex VAD: detecta sua fala e envia automaticamente ao pausar"
          >
            <PhoneCall className={`h-3.5 w-3.5 ${callMode ? 'animate-pulse text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">{callMode ? 'Chamada Ao Vivo ON' : 'Chamada IA'}</span>
          </button>
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

      {hasMemoryItems && (
        <div className="border-b border-slate-200/80 bg-slate-50/40 px-4 py-2 sm:px-6">
          {renderMemoryPanel()}
        </div>
      )}

      {/* Full-Duplex VAD Live Call Bar */}
      {callMode && (
        <div
          data-testid="full-duplex-call-bar"
          className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 bg-emerald-50/70 px-4 py-2.5 sm:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-7 items-end gap-0.5 rounded-lg bg-white/90 px-2 py-1 ring-1 ring-emerald-200">
              {audioBars.map((bar, idx) => (
                <span
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-75 ${
                    vadState === 'speaking' ? 'bg-emerald-600' : 'bg-blue-500/70'
                  }`}
                  style={{ height: `${Math.max(18, bar)}%` }}
                />
              ))}
            </div>
            <div>
              <p className="text-xs font-extrabold text-emerald-900">
                {vadState === 'speaking'
                  ? 'Captando sua voz...'
                  : vadState === 'processing'
                    ? 'Transcrevendo Whisper + Prosódia...'
                    : 'Chamada Full-Duplex ativa — fale naturalmente sem apertar botão'}
              </p>
              <p className="text-[11px] text-emerald-700">
                Pausa automática ({vadSilenceMs}ms) · Barge-in {bargeInEnabled ? 'ativo' : 'pausado'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              data-testid="vad-advanced-toggle"
              onClick={() => setVadAdvancedOpen((v) => !v)}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-bold cursor-pointer ${
                vadAdvancedOpen
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-emerald-800 ring-1 ring-emerald-200'
              }`}
              title="Ajustes avançados de microfone e interrupção"
            >
              ⚙️ Avançado
            </button>
            {vadAdvancedOpen && (
              <>
                {([700, 950, 1400] as const).map((ms) => (
                  <button
                    key={ms}
                    type="button"
                    onClick={() => setVadSilenceMs(ms)}
                    className={`rounded-lg px-2 py-1 font-mono text-[10px] font-bold cursor-pointer ${
                      vadSilenceMs === ms
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white text-emerald-800 ring-1 ring-emerald-200'
                    }`}
                  >
                    {ms === 700 ? 'Rápido' : ms === 950 ? 'Normal' : 'Calmo'}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setBargeInEnabled((v) => !v)}
                  className={`rounded-lg px-2 py-1 text-[10px] font-bold cursor-pointer ${
                    bargeInEnabled
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200'
                  }`}
                  title="Permite interromper a fala da IA ao começar a falar"
                >
                  Interromper IA: {bargeInEnabled ? 'ON' : 'OFF'}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setCallMode(false)}
              className="rounded-lg bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-rose-700 cursor-pointer"
            >
              Encerrar
            </button>
          </div>
        </div>
      )}

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
                      languageCode={selectedScenario?.languageCode ?? languageCode}
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
              {!isTutor && (msg.feedbackPt || msg.correctedEn || msg.prosody) && (
                <div className="mt-1.5 max-w-[85%] space-y-1.5 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs text-amber-950">
                  {msg.prosody && (
                    <div className="rounded-xl border border-emerald-200/80 bg-white/80 px-2.5 py-1.5 text-[11px] text-slate-800">
                      <div className="flex flex-wrap items-center gap-2 font-mono font-bold text-emerald-800">
                        <span>🎙️ {msg.prosody.wpm} WPM ({msg.prosody.paceLabel})</span>
                        <span>· Entonação {msg.prosody.intonationScore}%</span>
                        <span>· Fluência {msg.prosody.fluencyScore}%</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-600">{msg.prosody.tipPt}</p>
                    </div>
                  )}
                  {msg.feedbackPt && (
                    <p className="flex items-start gap-1.5">
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                      <span>{msg.feedbackPt}</span>
                    </p>
                  )}
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

        {isSending && streamingReplyText && (
          <div
            data-testid="ai-tutor-streaming-bubble"
            className="flex flex-col items-start"
          >
            <div className="max-w-[88%] rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-slate-900 shadow-2xs sm:max-w-[78%]">
              <p className="text-sm leading-relaxed font-medium">
                {streamingReplyText}
                <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-blue-600 align-middle" />
              </p>
            </div>
          </div>
        )}

        {isSending && !streamingReplyText && (
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

import { useEffect, useMemo, useRef, useState } from 'react';
import { FillBlankStepView } from './lesson/FillBlankStepView';
import { SpeakingStepView } from './lesson/SpeakingStepView';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Flame,
  Heart,
  Infinity as InfinityIcon,
  Lightbulb,
  RotateCcw,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import type {
  GlossWord,
  LanguageCode,
  LanguageDialect,
  LessonStep,
  MatchingPair,
  ReadingStep,
  SkillType,
  Topic,
  TopicProgressRecord,
  VocabCard,
} from '../types/learning';
import { getStepStageMeta } from '../utils/vocabUnlock';
import { saveAudioClip } from '../utils/audioDb';
import {
  type AudioRecorderHandle,
  startAudioRecording,
} from '../utils/audioRecorder';
import { isSoundMuted, playSound, setSoundMuted } from '../utils/soundFx';
import {
  evaluatePronunciation,
  speakText,
  startSpeechRecognition,
  stopSpeaking,
  transcribeAudioBlob,
} from '../utils/speech';
import { DualAudioButtons } from './DualAudioButtons';
import { SkillBadge, TIP_CATEGORY_META } from './SkillBadge';
import { Phase8StepsView } from './steps/Phase8StepsView';
import { ScriptPhonicsStepView } from './steps/ScriptPhonicsStepView';
import { VocabIntroStep } from './steps/VocabIntroStep';
import { ListeningStepView } from './steps/ListeningStepView';
import { ReadingStepView } from './steps/ReadingStepView';
import { MatchingStepView } from './steps/MatchingStepView';
import { WritingFreeStepView } from './steps/WritingFreeStepView';
import {
  computeAdaptiveProfile,
  loadAdaptiveHistory,
  recordAdaptiveAttempt,
  saveAdaptiveOverride,
  type AdaptiveDifficultyMode,
} from '../utils/adaptiveDifficulty';
import { getRegionalAccents } from '../data/regionalAccents';
import { tUi, type UiLocale } from '../utils/i18n';
import {
  loadJapaneseScriptMode,
  saveJapaneseScriptMode,
  toJapaneseKana,
  type JapaneseScriptMode,
} from '../utils/japaneseKana';
import {
  loadHebrewScriptMode,
  saveHebrewScriptMode,
  stripHebrewNiqqud,
  type HebrewScriptMode,
} from '../utils/hebrewNiqqud';
import { getImmersionStrings, isImmersionLevel } from '../utils/immersion';
import { analyzePhoneticFeedback } from '../utils/phoneticFeedback';

interface LessonPlayerProps {
  topic: Topic;
  topicVocab?: VocabCard[];
  initialStepIdx?: number;
  initialCompletedSteps?: number[];
  dialectCode: string;
  dialects: LanguageDialect[];
  studentName: string;
  uiLocale?: UiLocale;
  hasLinkedTeacher?: boolean;
  onRequestTeacherLink?: () => void;
  onChangeDialect: (dialectCode: string) => void;
  onSaveProgress?: (topicId: string, progress: TopicProgressRecord) => void;
  onUnlockVocab?: (vocabIds: string[]) => void;
  onRecordMistake?: (payload: {
    topicId: string;
    topicTitle: string;
    skill: SkillType | 'grammar' | 'vocab';
    prompt: string;
    studentAnswer: string;
    expectedAnswer: string;
    explanation: string;
  }) => void;
  onRecordPronunciation?: (payload: {
    languageCode: LanguageCode;
    topicId: string;
    score: number;
    weakWords: string[];
  }) => void;
  onSubmitWriting: (payload: {
    topicId: string;
    topicTitle: string;
    promptPt: string;
    responseText: string;
  }) => void;
  onSubmitSpeaking: (payload: {
    topicId: string;
    topicTitle: string;
    promptPt: string;
    targetSentence: string;
    responseText: string;
    audioId: string;
    audioBlob?: Blob;
    audioDurationSec: number;
    autoPronunciationScore?: number;
  }) => void;
  onCompleteLesson: (result: {
    topicId: string;
    xpEarned: number;
    practicedSkills: SkillType[];
    minutesSpent: number;
  }) => void;
  onGoToReview: () => void;
  onPracticeWithAI?: (topic: Topic) => void;
  onClose: () => void;
}

function deterministicShuffle<T>(items: T[], seedStr: string): T[] {
  const arr = [...items];
  let seed = 0;
  for (let i = 0; i < seedStr.length; i += 1) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) % 9973;
  }
  for (let i = arr.length - 1; i > 0; i -= 1) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const j = seed % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  if (arr.length > 1 && arr.every((el, idx) => el === items[idx])) {
    const first = arr.shift()!;
    arr.push(first);
  }
  return arr;
}

function normalizeAnswer(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:¿¡]+$/g, '')
    .replace(/\s+/g, ' ');
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderInteractivePassage(
  text: string,
  glossary: GlossWord[],
  selectedWord: GlossWord | null,
  onSelectWord: (word: GlossWord) => void,
) {
  if (glossary.length === 0) {
    return <span className="whitespace-pre-line">{text}</span>;
  }

  const sortedGlossary = [...glossary].sort((a, b) => b.word.length - a.word.length);
  const pattern = sortedGlossary.map((g) => escapeRegExp(g.word)).join('|');
  const isCjkOrArabic = sortedGlossary.some((g) =>
    /[\u3040-\u30ff\u4e00-\u9fff\u0600-\u06ff]/.test(g.word),
  );
  let regex: RegExp;
  if (isCjkOrArabic) {
    regex = new RegExp(`(${pattern})`, 'giu');
  } else {
    try {
      regex = new RegExp(`(?<![\\p{L}\\p{N}])(${pattern})(?![\\p{L}\\p{N}])`, 'giu');
    } catch {
      regex = new RegExp(`(\\b(?:${pattern})\\b)`, 'gi');
    }
  }

  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, lineIdx) => {
        const parts = line.split(regex);
        return (
          <p key={lineIdx} className="leading-relaxed">
            {parts.map((part, partIdx) => {
              const matched = sortedGlossary.find(
                (g) => g.word.toLowerCase() === part.toLowerCase(),
              );
              if (!matched) {
                return <span key={partIdx}>{part}</span>;
              }
              const isSelected =
                selectedWord?.word.toLowerCase() === matched.word.toLowerCase();
              return (
                <button
                  key={partIdx}
                  type="button"
                  onClick={() => onSelectWord(matched)}
                  data-selected={isSelected ? 'true' : 'false'}
                  className="reading-gloss-chip mx-0.5 inline rounded-md px-1 py-0.5 font-semibold transition cursor-pointer"
                  title={`Ver tradução de "${matched.word}"`}
                >
                  {part}
                </button>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

function renderUnitVocabInUseStrip(
  text: string,
  topicVocab: VocabCard[],
  onPlayWord: (word: string) => void,
) {
  if (!text || topicVocab.length === 0) return null;
  const lowerText = text.toLowerCase();
  const usedCards = topicVocab
    .filter((c) => c.word.trim().length > 0 && lowerText.includes(c.word.toLowerCase()))
    .slice(0, 6);
  if (usedCards.length === 0) return null;

  return (
    <div
      data-testid="unit-vocab-in-use"
      className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3"
    >
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-slate-600 uppercase">
        <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
        Vocabulário da unidade em uso
      </p>
      <div className="flex flex-wrap gap-1.5">
        {usedCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onPlayWord(card.word)}
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 transition hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer"
            title={`${card.word} — ${card.translation}`}
          >
            <Volume2 className="h-3 w-3 text-indigo-600" />
            <span>{card.word}</span>
            <span className="text-[11px] font-normal text-slate-500">
              · {card.translation}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

const FORMAT_LABELS: Record<ReadingStep['format'], string> = {
  chat: 'Mensagem no Grupo',
  menu: 'Cardápio / Aviso',
  email: 'E-mail / Recado',
  boarding_pass: 'Cartão de Embarque',
  article: 'Texto & Contexto',
};

export function LessonPlayer({
  topic,
  topicVocab = [],
  initialStepIdx = 0,
  initialCompletedSteps = [],
  dialectCode,
  dialects,
  studentName,
  uiLocale = 'pt',
  hasLinkedTeacher = true,
  onRequestTeacherLink,
  onChangeDialect,
  onSaveProgress,
  onUnlockVocab,
  onRecordMistake,
  onRecordPronunciation,
  onSubmitWriting,
  onSubmitSpeaking,
  onCompleteLesson,
  onGoToReview,
  onPracticeWithAI,
  onClose,
}: LessonPlayerProps) {
  const steps = useMemo<LessonStep[]>(() => {
    if (
      topicVocab.length > 0 &&
      !topic.steps.some((s) => s.type === 'vocab_intro')
    ) {
      return [
        {
          id: `${topic.id}-vocab-intro`,
          type: 'vocab_intro',
          titlePt: topic.titlePt,
          cards: topicVocab,
        },
        ...topic.steps,
      ];
    }
    return topic.steps;
  }, [topic.id, topic.steps, topic.titlePt, topicVocab]);

  const safeInitialIdx = Math.max(
    0,
    Math.min(initialStepIdx, Math.max(0, steps.length - 1)),
  );
  const [stepIdx, setStepIdx] = useState(safeInitialIdx);
  const [completedStepIndices, setCompletedStepIndices] = useState<number[]>(
    () => initialCompletedSteps,
  );
  const [maxReachedStepIdx, setMaxReachedStepIdx] = useState(safeInitialIdx);
  const [studiedVocabIds, setStudiedVocabIds] = useState<string[]>([]);
  const [expandedTraceCardId, setExpandedTraceCardId] = useState<string | null>(null);
  const [showPtTranslation, setShowPtTranslation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showVocabDrawer, setShowVocabDrawer] = useState(false);
  const [jaScriptMode, setJaScriptMode] = useState<JapaneseScriptMode>(() =>
    loadJapaneseScriptMode(),
  );
  const [heScriptMode, setHeScriptMode] = useState<HebrewScriptMode>(() =>
    loadHebrewScriptMode(),
  );
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);
  const jaText = (s: string) =>
    topic.languageCode === 'ja' && jaScriptMode === 'kana'
      ? toJapaneseKana(s)
      : topic.languageCode === 'he' && heScriptMode === 'modern'
        ? stripHebrewNiqqud(s)
        : s;

  // Gamification: Hearts, Combo, Sound FX, Relaxed Mode
  const [hearts, setHearts] = useState(5);
  const [relaxedMode, setRelaxedMode] = useState(false);
  const [combo, setCombo] = useState(0);
  const langKey = topic.languageCode ?? 'en';
  const [adaptiveSeed] = useState(() => loadAdaptiveHistory(studentName, langKey));
  const [sessionCorrectCount, setSessionCorrectCount] = useState(
    () => adaptiveSeed.recent.filter(Boolean).length,
  );
  const [sessionWrongCount, setSessionWrongCount] = useState(
    () => adaptiveSeed.recent.filter((v) => !v).length,
  );
  const [adaptiveOverride, setAdaptiveOverride] =
    useState<AdaptiveDifficultyMode | null>(() => adaptiveSeed.manualOverride);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [mobileStepsExpanded, setMobileStepsExpanded] = useState(false);
  const [muted, setMuted] = useState(() => isSoundMuted());
  const [showHeartRecovery, setShowHeartRecovery] = useState(false);

  const adaptiveProfile = useMemo(
    () =>
      computeAdaptiveProfile(
        sessionCorrectCount,
        sessionWrongCount,
        combo,
        adaptiveOverride,
      ),
    [sessionCorrectCount, sessionWrongCount, combo, adaptiveOverride],
  );

  // Audio playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Multiple choice state (listening, reading, fill_blank)
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedGloss, setSelectedGloss] = useState<GlossWord | null>(null);

  // Matching pairs state
  const [pickedTargetId, setPickedTargetId] = useState<string | null>(null);
  const [pickedPtId, setPickedPtId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [matchErrorIds, setMatchErrorIds] = useState<[string, string] | null>(null);

  // Speaking speech recognition state
  const [isRecordingSpeech, setIsRecordingSpeech] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('');
  const [spokenText, setSpokenText] = useState('');
  const [speechError, setSpeechError] = useState('');
  const [manualSpeakDone, setManualSpeakDone] = useState(false);
  const stopRecRef = useRef<(() => void) | null>(null);

  // Speaking MediaRecorder (send real voice clip to Teacher)
  const [isRecordingClip, setIsRecordingClip] = useState(false);
  const [clipSeconds, setClipSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [clipError, setClipError] = useState('');
  const [sentClipToTeacher, setSentClipToTeacher] = useState(false);
  const recorderHandleRef = useRef<AudioRecorderHandle | null>(null);

  // Writing builder state
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);

  // Writing free state
  const [freeText, setFreeText] = useState('');
  const [submittedToTeacher, setSubmittedToTeacher] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Phase 8: Dictation & Story state
  const [dictationText, setDictationText] = useState('');
  const [storyActiveLine, setStoryActiveLine] = useState<number | null>(null);
  const [storyShowTranslations, setStoryShowTranslations] = useState(false);
  const storyCancelRef = useRef(false);

  // Step check & feedback state
  const [checkedStatus, setCheckedStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [earnedXp, setEarnedXp] = useState(0);
  const [xpPulse, setXpPulse] = useState<number | null>(null);

  const currentStep: LessonStep | undefined = steps[stepIdx];
  const progressPct = isCompletedScreen
    ? 100
    : Math.round(((stepIdx + 1) / Math.max(1, steps.length)) * 100);

  const builderBank = useMemo(() => {
    if (!currentStep || currentStep.type !== 'writing_builder') return [];
    const combined = [...currentStep.words, ...(currentStep.distractors ?? [])];
    return deterministicShuffle(combined, currentStep.id);
  }, [currentStep]);

  const matchingColumns = useMemo<{
    targets: MatchingPair[];
    pts: MatchingPair[];
  }>(() => {
    if (!currentStep || currentStep.type !== 'matching') {
      return { targets: [], pts: [] };
    }
    return {
      targets: deterministicShuffle(currentStep.pairs, `${currentStep.id}-t`),
      pts: deterministicShuffle(currentStep.pairs, `${currentStep.id}-p`),
    };
  }, [currentStep]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      stopRecRef.current?.();
      recorderHandleRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  const resetStepState = () => {
    stopSpeaking();
    stopRecRef.current?.();
    recorderHandleRef.current?.cancel();
    recorderHandleRef.current = null;
    setIsPlayingAudio(false);
    setShowHint(false);
    setSelectedOption(null);
    setShowTranscript(false);
    setSelectedGloss(null);
    setPickedTargetId(null);
    setPickedPtId(null);
    setMatchedIds([]);
    setMatchErrorIds(null);
    setIsRecordingSpeech(false);
    setSpokenText('');
    setSpeechError('');
    setManualSpeakDone(false);
    setIsRecordingClip(false);
    setClipSeconds(0);
    setRecordedBlob(null);
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioUrl(null);
    setRecordedDuration(0);
    setClipError('');
    setSentClipToTeacher(false);
    setPickedIndices([]);
    setFreeText('');
    setSubmittedToTeacher(false);
    setShowModelAnswer(false);
    storyCancelRef.current = true;
    setDictationText('');
    setStoryActiveLine(null);
    setStoryShowTranslations(false);
    setCheckedStatus('idle');
  };

  const playAudio = (text: string, rate = 1) => {
    speakText(text, {
      langCode: dialectCode,
      rate,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  const playStoryLineAt = (
    lines: Array<{
      voice: 'female' | 'male';
      dialectCode: string;
      text: string;
    }>,
    idx: number,
    sequential: boolean,
  ) => {
    const line = lines[idx];
    if (!line) {
      setStoryActiveLine(null);
      return;
    }
    storyCancelRef.current = false;
    speakText(line.text, {
      langCode: line.dialectCode || dialectCode,
      voice: line.voice,
      onStart: () => setStoryActiveLine(idx),
      onEnd: () => {
        if (sequential && !storyCancelRef.current && idx + 1 < lines.length) {
          playStoryLineAt(lines, idx + 1, true);
        } else {
          setStoryActiveLine(null);
        }
      },
    });
  };

  const registerCorrect = (baseXp = 20) => {
    playSound('correct');
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    setSessionCorrectCount((c) => c + 1);
    recordAdaptiveAttempt(studentName, langKey, true);
    const comboBonus = nextCombo >= 3 ? 5 : 0;
    const delta = baseXp + comboBonus;
    setEarnedXp((prev) => prev + delta);
    setXpPulse(delta);
    window.setTimeout(() => setXpPulse(null), 1200);
  };

  const registerMistake = () => {
    playSound('wrong');
    setCombo(0);
    setSessionWrongCount((c) => c + 1);
    const updatedAdaptive = recordAdaptiveAttempt(studentName, langKey, false);
    const nextProfile = computeAdaptiveProfile(
      updatedAdaptive.recent.filter(Boolean).length,
      updatedAdaptive.recent.filter((v) => !v).length,
      0,
      adaptiveOverride,
    );
    if (nextProfile.autoShowHints) {
      setShowHint(true);
    }
    setEarnedXp((prev) => prev + 6);
    setXpPulse(6);
    window.setTimeout(() => setXpPulse(null), 1200);
    if (!relaxedMode) {
      setHearts((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          setShowHeartRecovery(true);
        }
        return next;
      });
    }
  };

  const handleCheck = () => {
    if (!currentStep) return;

    if (
      currentStep.type === 'listening' ||
      currentStep.type === 'reading' ||
      currentStep.type === 'fill_blank' ||
      currentStep.type === 'minimal_pairs' ||
      currentStep.type === 'story'
    ) {
      if (selectedOption === null) return;
      const ok = selectedOption === currentStep.correctIndex;
      setCheckedStatus(ok ? 'correct' : 'incorrect');
      if (ok) {
        registerCorrect(20);
      } else {
        registerMistake();
        onRecordMistake?.({
          topicId: topic.id,
          topicTitle: topic.titlePt,
          skill:
            currentStep.type === 'reading' || currentStep.type === 'story'
              ? 'reading'
              : currentStep.type === 'fill_blank'
                ? 'grammar'
                : 'listening',
          prompt:
            currentStep.type === 'fill_blank'
              ? `${currentStep.sentenceBefore} ___ ${currentStep.sentenceAfter}`
              : currentStep.type === 'minimal_pairs'
                ? currentStep.promptPt
                : currentStep.question,
          studentAnswer:
            currentStep.type === 'minimal_pairs'
              ? currentStep.options[selectedOption]?.word ?? ''
              : currentStep.options[selectedOption] ?? '',
          expectedAnswer:
            currentStep.type === 'minimal_pairs'
              ? currentStep.options[currentStep.correctIndex]?.word ?? ''
              : currentStep.options[currentStep.correctIndex] ?? '',
          explanation: currentStep.explanation,
        });
      }
      return;
    }

    if (currentStep.type === 'dictation') {
      if (!dictationText.trim()) return;
      const evalRes = evaluatePronunciation(currentStep.audioText, dictationText);
      const ok = evalRes.score >= 75;
      setCheckedStatus(ok ? 'correct' : 'incorrect');
      if (ok) {
        registerCorrect(25);
      } else {
        registerMistake();
        onRecordMistake?.({
          topicId: topic.id,
          topicTitle: topic.titlePt,
          skill: 'listening',
          prompt: currentStep.promptPt,
          studentAnswer: dictationText.trim(),
          expectedAnswer: currentStep.audioText,
          explanation: `Tradução: ${currentStep.translationPt}`,
        });
      }
      return;
    }

    if (currentStep.type === 'writing_builder') {
      const built = pickedIndices.map((idx) => builderBank[idx]).join(' ');
      const ok =
        normalizeAnswer(built) === normalizeAnswer(currentStep.targetSentence);
      setCheckedStatus(ok ? 'correct' : 'incorrect');
      if (ok) {
        registerCorrect(20);
      } else {
        registerMistake();
        onRecordMistake?.({
          topicId: topic.id,
          topicTitle: topic.titlePt,
          skill: 'writing',
          prompt: currentStep.promptPt,
          studentAnswer: built,
          expectedAnswer: currentStep.targetSentence,
          explanation: currentStep.explanation,
        });
      }
    }
  };

  const tryResolveMatch = (nextTargetId: string | null, nextPtId: string | null) => {
    if (!currentStep || currentStep.type !== 'matching') return;
    if (!nextTargetId || !nextPtId) return;

    if (nextTargetId === nextPtId) {
      playSound('match');
      const nextMatched = [...matchedIds, nextTargetId];
      setMatchedIds(nextMatched);
      setPickedTargetId(null);
      setPickedPtId(null);
      if (nextMatched.length === currentStep.pairs.length) {
        setCheckedStatus('correct');
        registerCorrect(22);
      }
    } else {
      registerMistake();
      setMatchErrorIds([nextTargetId, nextPtId]);
      window.setTimeout(() => {
        setMatchErrorIds(null);
        setPickedTargetId(null);
        setPickedPtId(null);
      }, 420);
    }
  };

  const handleNext = () => {
    const nextCompleted = completedStepIndices.includes(stepIdx)
      ? completedStepIndices
      : [...completedStepIndices, stepIdx];
    setCompletedStepIndices(nextCompleted);

    if (currentStep?.type === 'vocab_intro' && currentStep.cards.length > 0) {
      onUnlockVocab?.(currentStep.cards.map((c) => c.id));
    }

    if (stepIdx < steps.length - 1) {
      const nextIdx = stepIdx + 1;
      setMaxReachedStepIdx((prev) => Math.max(prev, nextIdx));
      onSaveProgress?.(topic.id, {
        stepIdx: nextIdx,
        completedSteps: nextCompleted,
        totalSteps: steps.length,
        updatedAt: new Date().toISOString(),
      });
      resetStepState();
      setStepIdx(nextIdx);
      return;
    }

    stopSpeaking();
    playSound('complete');
    if (topicVocab.length > 0) {
      onUnlockVocab?.(topicVocab.map((c) => c.id));
    }
    const practicedSet = new Set<SkillType>();
    for (const s of steps) {
      if (s.type === 'listening' || s.type === 'dictation' || s.type === 'minimal_pairs') {
        practicedSet.add('listening');
      }
      if (s.type === 'reading' || s.type === 'story') practicedSet.add('reading');
      if (s.type === 'speaking') practicedSet.add('speaking');
      if (s.type === 'writing_builder' || s.type === 'writing_free') {
        practicedSet.add('writing');
      }
    }
    const finalXp = Math.max(50, earnedXp + 25);
    setEarnedXp(finalXp);
    setIsCompletedScreen(true);
    onCompleteLesson({
      topicId: topic.id,
      xpEarned: finalXp,
      practicedSkills: Array.from(practicedSet),
      minutesSpent: topic.estimatedMinutes,
    });
  };

  const handleJumpToStep = (targetIdx: number) => {
    if (targetIdx === stepIdx || targetIdx > maxReachedStepIdx) return;
    resetStepState();
    setStepIdx(targetIdx);
    onSaveProgress?.(topic.id, {
      stepIdx: targetIdx,
      completedSteps: completedStepIndices,
      totalSteps: steps.length,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleToggleMic = () => {
    if (!currentStep || currentStep.type !== 'speaking') return;

    if (isRecordingSpeech) {
      stopRecRef.current?.();
      setIsRecordingSpeech(false);
      return;
    }

    setSpeechError('');
    setSpeechStatus('');
    setSpokenText('');
    setIsRecordingSpeech(true);

    stopRecRef.current = startSpeechRecognition(dialectCode, {
      onResult: (transcript) => {
        setSpokenText(transcript);
        if (checkedStatus === 'idle') {
          setCheckedStatus('correct');
          registerCorrect(20);
        }
      },
      onStatus: (msg) => setSpeechStatus(msg),
      onError: (msg) => {
        setSpeechError(msg);
      },
      onEnd: () => {
        setIsRecordingSpeech(false);
        setSpeechStatus('');
      },
    });
  };

  const handleStartOrStopVoiceClip = async () => {
    if (isRecordingClip) {
      recorderHandleRef.current?.stop();
      setIsRecordingClip(false);
      return;
    }

    setClipError('');
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }
    setRecordedBlob(null);
    setSentClipToTeacher(false);
    setClipSeconds(0);
    setIsRecordingClip(true);

    const handle = await startAudioRecording({
      maxSeconds: 30,
      onTick: (sec) => setClipSeconds(sec),
      onComplete: (blob, durationSec) => {
        setIsRecordingClip(false);
        setRecordedBlob(blob);
        setRecordedDuration(durationSec);
        setRecordedAudioUrl(URL.createObjectURL(blob));
      },
      onError: (msg) => {
        setIsRecordingClip(false);
        setClipError(msg);
      },
    });
    if (!handle) {
      setIsRecordingClip(false);
      return;
    }
    recorderHandleRef.current = handle;
  };

  const handleSendAudioClipToTeacher = async () => {
    if (!currentStep || currentStep.type !== 'speaking' || !recordedBlob || sentClipToTeacher) {
      return;
    }
    const audioId = `audio-${Date.now()}`;
    await saveAudioClip(audioId, recordedBlob);

    let effectiveSpoken = spokenText;
    if (!effectiveSpoken) {
      const stt = await transcribeAudioBlob(recordedBlob, dialectCode);
      if (stt.ok && stt.text) {
        effectiveSpoken = stt.text;
        setSpokenText(stt.text);
      }
    }

    const autoScore = effectiveSpoken
      ? evaluatePronunciation(currentStep.targetSentence, effectiveSpoken).score
      : undefined;

    onSubmitSpeaking({
      topicId: topic.id,
      topicTitle: topic.titlePt,
      promptPt: currentStep.promptPt,
      targetSentence: currentStep.targetSentence,
      responseText: effectiveSpoken || currentStep.targetSentence,
      audioId,
      audioBlob: recordedBlob,
      audioDurationSec: recordedDuration,
      autoPronunciationScore: autoScore,
    });

    setSentClipToTeacher(true);
    if (checkedStatus === 'idle') {
      setCheckedStatus('correct');
      registerCorrect(30);
    }
  };

  const handleManualSpeakingComplete = () => {
    setManualSpeakDone(true);
    if (checkedStatus === 'idle') {
      setCheckedStatus('correct');
      registerCorrect(15);
    }
  };

  const handleSendFreeWriting = (sendToTeacher: boolean) => {
    if (!currentStep || currentStep.type !== 'writing_free') return;
    const trimmed = freeText.trim();
    if (!trimmed) return;

    if (sendToTeacher && !submittedToTeacher) {
      onSubmitWriting({
        topicId: topic.id,
        topicTitle: topic.titlePt,
        promptPt: currentStep.promptPt,
        responseText: trimmed,
      });
      setSubmittedToTeacher(true);
    }

    if (checkedStatus === 'idle') {
      registerCorrect(sendToTeacher ? 30 : 20);
    }
    setCheckedStatus('correct');
    setShowModelAnswer(true);
  };

  const handleCycleDialect = () => {
    if (dialects.length < 2) return;
    const idx = dialects.findIndex((d) => d.code === dialectCode);
    const next = dialects[(idx + 1) % dialects.length];
    onChangeDialect(next.code);
  };

  const toggleSound = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
  };

  const getActiveHintText = (): string | null => {
    if (!currentStep) return null;
    if (currentStep.type === 'vocab_intro') {
      return 'Ouça cada palavra e frase de exemplo antes de seguir. Ao concluir esta etapa, os cards entram automaticamente na sua aba de Revisão!';
    }
    if (currentStep.type === 'script_phonics') return currentStep.introPt;
    if (currentStep.type === 'tip') return currentStep.tip.warning ?? currentStep.tip.summary;
    if (currentStep.type === 'speaking') return currentStep.focusTip;
    return currentStep.hintTip;
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isCompletedScreen || !currentStep) return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        if (e.key === 'Escape') target.blur();
        return;
      }

      if (e.key === 'Escape') {
        if (showHeartRecovery) {
          setShowHeartRecovery(false);
        } else if (showHint) {
          setShowHint(false);
        } else {
          stopSpeaking();
          onClose();
        }
        return;
      }

      if (
        (currentStep.type === 'listening' ||
          currentStep.type === 'reading' ||
          currentStep.type === 'fill_blank' ||
          currentStep.type === 'minimal_pairs' ||
          currentStep.type === 'story') &&
        checkedStatus === 'idle' &&
        ['1', '2', '3', '4'].includes(e.key)
      ) {
        const idx = Number(e.key) - 1;
        if (idx < currentStep.options.length) {
          setSelectedOption(idx);
        }
        return;
      }

      if (
        (e.key === 'r' || e.key === 'R') &&
        (currentStep.type === 'listening' ||
          currentStep.type === 'speaking' ||
          currentStep.type === 'dictation' ||
          currentStep.type === 'minimal_pairs')
      ) {
        const text =
          currentStep.type === 'listening' || currentStep.type === 'dictation'
            ? currentStep.audioText
            : currentStep.type === 'minimal_pairs'
              ? currentStep.targetWord
              : currentStep.targetSentence;
        speakText(text, { langCode: dialectCode });
        return;
      }

      if (e.key === 'Enter') {
        if (
          currentStep.type === 'vocab_intro' ||
          currentStep.type === 'tip' ||
          checkedStatus !== 'idle'
        ) {
          e.preventDefault();
          handleNext();
        } else if (
          (currentStep.type === 'listening' ||
            currentStep.type === 'reading' ||
            currentStep.type === 'fill_blank' ||
            currentStep.type === 'minimal_pairs' ||
            currentStep.type === 'story') &&
          selectedOption !== null
        ) {
          e.preventDefault();
          handleCheck();
        } else if (
          currentStep.type === 'dictation' &&
          dictationText.trim().length > 0
        ) {
          e.preventDefault();
          handleCheck();
        } else if (
          currentStep.type === 'writing_builder' &&
          pickedIndices.length > 0
        ) {
          e.preventDefault();
          handleCheck();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const speakingEval =
    !isCompletedScreen && currentStep?.type === 'speaking' && spokenText
      ? analyzePhoneticFeedback(
          currentStep.targetSentence,
          spokenText,
          topic.languageCode ?? 'en',
        )
      : null;

  const lastLoggedPronunciationRef = useRef<string>('');
  useEffect(() => {
    if (
      isCompletedScreen ||
      !speakingEval ||
      !onRecordPronunciation ||
      !currentStep ||
      currentStep.type !== 'speaking'
    ) {
      return;
    }
    const sig = `${topic.id}:${currentStep.id}:${spokenText}`;
    if (lastLoggedPronunciationRef.current === sig) return;
    lastLoggedPronunciationRef.current = sig;
    onRecordPronunciation({
      languageCode: topic.languageCode ?? 'en',
      topicId: topic.id,
      score: speakingEval.score,
      weakWords: speakingEval.words.filter((w) => !w.matched).map((w) => w.word),
    });
  }, [
    isCompletedScreen,
    speakingEval,
    onRecordPronunciation,
    currentStep,
    spokenText,
    topic.id,
    topic.languageCode,
  ]);

  if (isCompletedScreen) {
    return (
      <div className="safe-top safe-bottom fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
        <div className="animate-fade-up w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Award className="h-9 w-9" />
          </div>

          <span className="mt-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Lição concluída · {topic.level}
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
            Parabéns, {studentName}!
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Você completou <strong>{topic.titlePt}</strong> treinando as 4 habilidades e dicas do professor.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
              <p className="flex items-center justify-center gap-1.5 font-mono text-2xl font-extrabold text-blue-700">
                <Zap className="h-5 w-5" />+{earnedXp} XP
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-600">
                Experiência + Bônus Combo
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
              <p className="font-mono text-2xl font-extrabold text-indigo-700">
                {relaxedMode ? '∞ ❤️' : `${hearts}/5 ❤️`}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-600">
                Vidas restantes
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {topicVocab.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-[11px] font-bold text-cyan-700">
                <BookOpen className="h-3 w-3" />+{topicVocab.length} palavras na Revisão
              </span>
            )}
            <SkillBadge kind="listening" compact />
            <SkillBadge kind="reading" compact />
            <SkillBadge kind="speaking" compact />
            <SkillBadge kind="writing" compact />
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToReview();
              }}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
            >
              Revisar vocabulário (SRS)
            </button>
            {onPracticeWithAI && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPracticeWithAI(topic);
                }}
                className="flex-1 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100 cursor-pointer"
              >
                Conversar com IA (10 modos)
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 cursor-pointer"
            >
              Voltar para a Trilha
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStep) return null;

  const imm = getImmersionStrings(
    topic.languageCode ?? 'en',
    showPtTranslation ? 'A1' : topic.level,
  );

  const badgeKind =
    currentStep.type === 'vocab_intro'
      ? 'vocab_intro'
      : currentStep.type === 'tip'
        ? 'tip'
        : currentStep.type === 'writing_builder' || currentStep.type === 'writing_free'
          ? 'writing'
          : currentStep.type;

  const activeHint = getActiveHintText();
  const activeDialectObj = dialects.find((d) => d.code === dialectCode) ?? dialects[0];

  const freeWordCount =
    currentStep.type === 'writing_free'
      ? freeText.trim().split(/\s+/).filter(Boolean).length
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F7F9FC]">
      {/* Heart Recovery Modal */}
      {showHeartRecovery && (
        <div className="safe-top safe-bottom fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="animate-fade-up w-full max-w-md rounded-3xl border border-rose-200 bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <Heart className="h-7 w-7 fill-rose-600" />
            </div>
            <h3 className="mt-3 font-display text-xl font-extrabold text-slate-900">
              Suas vidas acabaram!
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Sem problemas — errar faz parte da aprendizagem! Escolha se quer recuperar +3 vidas revisando com calma ou ativar o modo <strong>Sem Pressão (∞)</strong>.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setHearts(3);
                  setShowHint(true);
                  setShowHeartRecovery(false);
                }}
                className="w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
              >
                Recuperar +3 ❤️ e abrir Dica do Professor
              </button>
              <button
                type="button"
                onClick={() => {
                  setRelaxedMode(true);
                  setShowHeartRecovery(false);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Ativar Modo Sem Pressão (❤️ Infinitas)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="safe-pt-3 border-b border-slate-200/80 bg-white px-4 pb-3 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 cursor-pointer"
            aria-label="Sair da lição"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span className="truncate">{topic.titlePt}</span>
              <span className="font-mono">
                {stepIdx + 1} / {steps.length}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {xpPulse !== null && (
              <span
                data-testid="lesson-xp-pulse"
                className="animate-fade-up inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 font-mono text-[11px] font-extrabold text-amber-800 shadow-xs"
              >
                <Zap className="h-3 w-3 text-amber-600" />+{xpPulse} XP
              </span>
            )}
            {combo >= 2 && (
              <span className="hidden items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 font-mono text-[11px] font-extrabold text-orange-700 sm:inline-flex">
                <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-600" />
                {combo}x
              </span>
            )}

            <button
              type="button"
              onClick={() => setRelaxedMode((v) => !v)}
              className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 font-mono text-xs font-bold transition cursor-pointer ${relaxedMode
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
                }`}
              title={
                relaxedMode
                  ? 'Modo Sem Pressão ativo (clique para usar 5 vidas)'
                  : 'Vidas restantes (clique para Modo Sem Pressão ∞)'
              }
            >
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
              {relaxedMode ? <InfinityIcon className="h-3.5 w-3.5" /> : <span>{hearts}</span>}
            </button>

            <button
              type="button"
              onClick={toggleSound}
              className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 sm:inline-flex cursor-pointer"
              title={muted ? 'Ativar sons' : 'Silenciar efeitos sonoros'}
              aria-label="Alternar sons"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {activeDialectObj && dialects.length > 1 && (
              <button
                type="button"
                onClick={handleCycleDialect}
                className="hidden rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 sm:inline-flex cursor-pointer"
                title="Alternar sotaque"
              >
                {activeDialectObj.flag} {activeDialectObj.code.split('-')[1]}
              </button>
            )}

            <button
              type="button"
              data-testid="adaptive-difficulty-badge"
              onClick={() => {
                setAdaptiveOverride((prev) => {
                  const next =
                    prev === null
                      ? 'guided'
                      : prev === 'guided'
                        ? 'immersive'
                        : prev === 'immersive'
                          ? 'balanced'
                          : null;
                  saveAdaptiveOverride(studentName, langKey, next);
                  if (next === 'guided') setShowHint(true);
                  return next;
                });
              }}
              title={adaptiveProfile.summaryPt}
              className="hidden rounded-xl border border-indigo-200 bg-indigo-50/70 px-2.5 py-1.5 text-[11px] font-bold text-indigo-800 hover:bg-indigo-100 md:inline-flex cursor-pointer"
            >
              ⚡ {adaptiveProfile.labelPt}
            </button>

            <button
              type="button"
              data-testid="lesson-mobile-settings-btn"
              onClick={() => setMobileSettingsOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 md:hidden cursor-pointer"
              aria-label={tUi(uiLocale, 'lesson.settingsTitle')}
              title={tUi(uiLocale, 'lesson.settingsTitle')}
            >
              <Settings className="h-4 w-4" />
            </button>

            {isImmersionLevel(topic.level) && (
              <button
                type="button"
                onClick={() => setShowPtTranslation((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold transition cursor-pointer ${showPtTranslation
                  ? 'border-indigo-400 bg-indigo-100 text-indigo-900'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                title="Alternar auxílio em Português para níveis B2/C1"
              >
                <span>🌐 {showPtTranslation ? 'Imersão' : 'Traduzir PT'}</span>
              </button>
            )}

            {topic.languageCode === 'ja' && (
              <button
                type="button"
                data-testid="ja-kana-toggle"
                onClick={() => {
                  const next: JapaneseScriptMode =
                    jaScriptMode === 'standard' ? 'kana' : 'standard';
                  setJaScriptMode(next);
                  saveJapaneseScriptMode(next);
                }}
                className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                  jaScriptMode === 'kana'
                    ? 'border-violet-400 bg-violet-100 text-violet-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                title="Alternar entre escrita padrão (Kanji + Kana) e 100% Hiragana/Katakana"
              >
                <span>{jaScriptMode === 'kana' ? 'あいう Kana' : '漢字 Padrão'}</span>
              </button>
            )}

            {topic.languageCode === 'he' && (
              <button
                type="button"
                data-testid="he-niqqud-toggle"
                onClick={() => {
                  const next: HebrewScriptMode =
                    heScriptMode === 'niqqud' ? 'modern' : 'niqqud';
                  setHeScriptMode(next);
                  saveHebrewScriptMode(next);
                }}
                className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                  heScriptMode === 'modern'
                    ? 'border-blue-400 bg-blue-100 text-blue-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                title="Alternar entre Hebraico com Niqqud (vogais) e escrita moderna sem vogais"
              >
                <span>{heScriptMode === 'modern' ? 'עב Moderno' : 'נִקּוּד Niqqud'}</span>
              </button>
            )}

            {topicVocab.length > 0 && (
              <button
                type="button"
                data-testid="unit-vocab-drawer-btn"
                onClick={() => setShowVocabDrawer((v) => !v)}
                className={`hidden sm:inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                  showVocabDrawer
                    ? 'border-cyan-400 bg-cyan-100 text-cyan-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                title="Consultar vocabulário desta unidade"
              >
                <span>Vocab ({topicVocab.length})</span>
              </button>
            )}

            {activeHint && (
              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${showHint
                  ? 'border-amber-400 bg-amber-100 text-amber-900'
                  : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dica</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Lesson Settings Drawer */}
        {mobileSettingsOpen && (
          <div
            data-testid="lesson-mobile-settings-panel"
            className="mx-auto mt-2.5 max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-2.5 md:hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={toggleSound}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
              >
                {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                <span>{muted ? 'Som OFF' : 'Som ON'}</span>
              </button>

              <button
                type="button"
                onClick={() => setRelaxedMode((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
                  relaxedMode
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <Heart className="h-3.5 w-3.5 text-rose-500" />
                <span>{relaxedMode ? 'Sem Pressão ∞' : '5 Vidas'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdaptiveOverride((prev) => {
                    const next =
                      prev === null
                        ? 'guided'
                        : prev === 'guided'
                          ? 'immersive'
                          : prev === 'immersive'
                            ? 'balanced'
                            : null;
                    saveAdaptiveOverride(studentName, langKey, next);
                    if (next === 'guided') setShowHint(true);
                    return next;
                  });
                }}
                className="rounded-xl border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-[11px] font-bold text-indigo-800 cursor-pointer"
              >
                ⚡ {adaptiveProfile.labelPt}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-600">Sotaque:</span>
              <select
                value={dialectCode}
                onChange={(e) => onChangeDialect(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                {getRegionalAccents(langKey).map((acc) => (
                  <option key={acc.code} value={acc.code}>
                    {acc.flag} {acc.regionPt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Mobile compact steps toggle + Desktop stage strip */}
        <div className="mx-auto mt-2 flex max-w-4xl items-center justify-between sm:hidden">
          <button
            type="button"
            data-testid="mobile-steps-toggle"
            onClick={() => setMobileStepsExpanded((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-700 cursor-pointer"
          >
            <span>
              Etapa {stepIdx + 1}/{steps.length} · {getStepStageMeta(currentStep).label}{' '}
              {mobileStepsExpanded ? '▴' : '▾'}
            </span>
          </button>
        </div>

        <div
          className={`mx-auto mt-2.5 max-w-4xl items-center gap-1.5 overflow-x-auto pb-0.5 ${
            mobileStepsExpanded ? 'flex' : 'hidden sm:flex'
          }`}
        >
          {steps.map((s, idx) => {
            const stage = getStepStageMeta(s);
            const isCurrent = idx === stepIdx;
            const isDone = completedStepIndices.includes(idx) || idx < stepIdx;
            const isReachable = idx <= maxReachedStepIdx || isDone;
            return (
              <button
                key={s.id}
                type="button"
                disabled={!isReachable}
                onClick={() => handleJumpToStep(idx)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${isCurrent
                  ? 'border-blue-500 bg-blue-600 text-white shadow-2xs'
                  : isDone
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
                    : isReachable
                      ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer'
                      : 'border-slate-200/70 bg-slate-50/50 text-slate-400 cursor-not-allowed'
                  }`}
                title={`Etapa ${idx + 1}: ${stage.label}`}
              >
                {isDone && !isCurrent ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <span className="font-mono text-[10px] opacity-80">{idx + 1}.</span>
                )}
                <span>{stage.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="flex items-center justify-between">
            <SkillBadge kind={badgeKind} />
            <div className="flex items-center gap-2">
              {imm.isImmersion && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 ring-1 ring-indigo-200">
                  {imm.badgeLabel}
                </span>
              )}
              <span className="font-mono text-xs font-semibold text-slate-400">
                {imm.isImmersion ? topic.level : `Nível ${topic.level}`}
              </span>
            </div>
          </div>

          {showHint && activeHint && (
            <div className="animate-fade-up rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
                <div className="text-xs leading-relaxed text-amber-950">
                  <p className="font-bold">Dica rápida do professor:</p>
                  <p className="mt-0.5">{activeHint}</p>
                </div>
              </div>
            </div>
          )}

          {showVocabDrawer && topicVocab.length > 0 && (
            <div className="animate-fade-up rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold uppercase tracking-wider text-cyan-900">
                  Vocabulário da Unidade ({topicVocab.length} expressões)
                </p>
                <button
                  type="button"
                  onClick={() => setShowVocabDrawer(false)}
                  className="text-xs font-bold text-cyan-800 hover:underline cursor-pointer"
                >
                  Fechar
                </button>
              </div>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {topicVocab.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-cyan-200/80 bg-white px-3 py-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{jaText(c.word)}</span>
                      <span className="ml-1.5 text-emerald-700">→ {c.translation}</span>
                    </div>
                    <DualAudioButtons text={c.word} languageCode={topic.languageCode} size="xs" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VOCAB INTRO STAGE (Busuu-style progressive vocabulary unlock) */}
          {currentStep.type === 'vocab_intro' && (
            <VocabIntroStep
              cards={currentStep.cards}
              topicLanguageCode={topic.languageCode}
              jaScriptMode={jaScriptMode}
              studiedVocabIds={studiedVocabIds}
              expandedTraceCardId={expandedTraceCardId}
              onMarkStudied={(cardId) =>
                setStudiedVocabIds((prev) =>
                  prev.includes(cardId) ? prev : [...prev, cardId],
                )
              }
              onMarkAllStudied={() =>
                setStudiedVocabIds(currentStep.cards.map((c) => c.id))
              }
              onToggleTraceCard={(cardId) =>
                setExpandedTraceCardId((prev) => (prev === cardId ? null : cardId))
              }
            />
          )}

          {/* SCRIPT & PHONICS STEP (RU Cyrillic, AR RTL, JA Kana/Kanji, ZH Hanzi) */}
          {currentStep.type === 'script_phonics' && (
            <ScriptPhonicsStepView
              step={currentStep}
              dialectCode={dialectCode}
              quizAnswerIdx={selectedOption}
              checkedStatus={checkedStatus === 'idle' ? 'idle' : checkedStatus}
              onSelectQuizOption={(idx) => setSelectedOption(idx)}
              onCheckQuiz={() => {
                if (selectedOption === null) return;
                if (selectedOption === currentStep.soundQuiz.correctIndex) {
                  setCheckedStatus('correct');
                  registerCorrect(15);
                } else {
                  setCheckedStatus('incorrect');
                  registerMistake();
                }
              }}
            />
          )}

          {/* TIP STEP */}
          {currentStep.type === 'tip' && (
            <div className="animate-fade-up rounded-3xl border border-amber-200/90 bg-white p-6 shadow-xs sm:p-7">
              {(() => {
                const catMeta = TIP_CATEGORY_META[currentStep.tip.category];
                const CatIcon = catMeta.Icon;
                return (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${catMeta.bg} ${catMeta.text}`}
                  >
                    <CatIcon className="h-3.5 w-3.5" />
                    {catMeta.label}
                  </span>
                );
              })()}

              <h2 className="mt-3 font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
                {currentStep.tip.title}
              </h2>
              <p className="mt-2 rounded-xl bg-amber-50/70 px-3.5 py-2.5 text-sm font-semibold text-amber-950">
                {currentStep.tip.summary}
              </p>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {currentStep.tip.details}
              </p>

              {currentStep.tip.grammarFormula && (
                <div className="mt-4 space-y-1.5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/70 p-4 font-mono text-xs text-emerald-950">
                  <p>{currentStep.tip.grammarFormula.aff}</p>
                  <p>{currentStep.tip.grammarFormula.neg}</p>
                  <p>{currentStep.tip.grammarFormula.int}</p>
                  {currentStep.tip.grammarFormula.keywords && (
                    <p className="pt-1 font-sans text-[11px] font-semibold text-emerald-800">
                      🔑 Sinais comuns: {currentStep.tip.grammarFormula.keywords}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 space-y-3">
                <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                  Exemplos na prática (clique para ouvir)
                </p>
                {currentStep.tip.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between gap-2.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-slate-900">{ex.en}</p>
                      <p className="text-xs text-slate-600">{ex.pt}</p>
                    </div>
                    <DualAudioButtons
                      text={ex.en}
                      languageCode={topic.languageCode}
                      size="xs"
                    />
                  </div>
                ))}
              </div>

              {currentStep.tip.warning && (
                <div
                  data-testid="tip-warning-box"
                  className="tip-warning-box mt-5 flex items-start gap-2.5 rounded-2xl p-3.5 text-xs leading-relaxed font-medium"
                >
                  <AlertCircle className="tip-warning-icon mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <span className="font-bold">Atenção brasileiro: </span>
                    {currentStep.tip.warning}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LISTENING STEP */}
          {currentStep.type === 'listening' && (
            <ListeningStepView
              step={currentStep}
              languageCode={topic.languageCode}
              level={topic.level}
              preferredAccent={dialectCode}
              onSelectAccent={onChangeDialect}
              isPlayingAudio={isPlayingAudio}
              setIsPlayingAudio={setIsPlayingAudio}
              showTranscript={showTranscript}
              setShowTranscript={setShowTranscript}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              checkedStatus={checkedStatus}
              rateMultiplier={adaptiveProfile.recommendedRate}
              unitVocabInUseNode={renderUnitVocabInUseStrip(
                currentStep.audioText,
                topicVocab,
                (w) => playAudio(w, 0.9),
              )}
            />
          )}

          {/* READING STEP */}
          {currentStep.type === 'reading' && (
            <ReadingStepView
              step={currentStep}
              languageCode={topic.languageCode}
              displayText={jaText(currentStep.text)}
              formatLabel={FORMAT_LABELS[currentStep.format]}
              selectedGloss={selectedGloss}
              onSelectGloss={(g) => setSelectedGloss(g)}
              renderPassage={renderInteractivePassage}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              checkedStatus={checkedStatus}
              rateMultiplier={adaptiveProfile.recommendedRate}
              unitVocabInUseNode={renderUnitVocabInUseStrip(
                jaText(currentStep.text),
                topicVocab,
                (w) => playAudio(w, 0.9),
              )}
            />
          )}

          {/* NEW STEP: MATCHING PAIRS */}
          {currentStep.type === 'matching' && (
            <MatchingStepView
              step={currentStep}
              languageCode={topic.languageCode}
              matchingColumns={matchingColumns}
              matchedIds={matchedIds}
              pickedTargetId={pickedTargetId}
              pickedPtId={pickedPtId}
              matchErrorIds={matchErrorIds}
              onPickTarget={(id, targetText) => {
                playAudio(targetText, 0.95);
                setPickedTargetId(id);
                tryResolveMatch(id, pickedPtId);
              }}
              onPickPt={(id) => {
                setPickedPtId(id);
                tryResolveMatch(pickedTargetId, id);
              }}
            />
          )}

          {/* NEW STEP: FILL IN THE BLANK */}
          {currentStep.type === 'fill_blank' && (
            <FillBlankStepView
              step={currentStep}
              selectedOption={selectedOption}
              checkedStatus={checkedStatus}
              onSelectOption={setSelectedOption}
            />
          )}

          {/* SPEAKING STEP */}
          {currentStep.type === 'speaking' && (
            <SpeakingStepView
              step={currentStep}
              languageCode={topic.languageCode ?? 'en'}
              dialectCode={dialectCode}
              isRecordingSpeech={isRecordingSpeech}
              speechStatus={speechStatus}
              isRecordingClip={isRecordingClip}
              clipSeconds={clipSeconds}
              recordedBlob={recordedBlob}
              recordedDuration={recordedDuration}
              recordedAudioUrl={recordedAudioUrl}
              speechError={speechError}
              clipError={clipError}
              spokenText={spokenText}
              speakingEval={speakingEval}
              hasLinkedTeacher={hasLinkedTeacher}
              sentClipToTeacher={sentClipToTeacher}
              manualSpeakDone={manualSpeakDone}
              checkedStatus={checkedStatus}
              onToggleMic={handleToggleMic}
              onStartOrStopVoiceClip={() => void handleStartOrStopVoiceClip()}
              onSendAudioClipToTeacher={() => void handleSendAudioClipToTeacher()}
              onManualSpeakingComplete={handleManualSpeakingComplete}
              onRequestTeacherLink={onRequestTeacherLink}
            />
          )}

          {/* WRITING BUILDER */}
          {currentStep.type === 'writing_builder' && (
            <div className="animate-fade-up rounded-3xl border border-amber-200/80 bg-white p-6 shadow-xs sm:p-7">
              <h2 className="font-display text-lg font-bold text-slate-900">
                {currentStep.promptPt}
              </h2>

              <div className="mt-4 min-h-[76px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-3.5">
                {pickedIndices.length === 0 ? (
                  <p className="py-2 text-center text-xs font-medium text-slate-400">
                    Clique nas palavras abaixo na ordem correta para montar a frase
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {pickedIndices.map((bankIdx, orderPos) => (
                      <button
                        key={`${bankIdx}-${orderPos}`}
                        type="button"
                        disabled={checkedStatus !== 'idle'}
                        onClick={() =>
                          setPickedIndices((prev) =>
                            prev.filter((_, idx) => idx !== orderPos),
                          )
                        }
                        className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-700 shadow-2xs transition hover:bg-rose-50 hover:text-rose-700 cursor-pointer disabled:cursor-default"
                      >
                        {builderBank[bankIdx]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {builderBank.map((word, bankIdx) => {
                  const used = pickedIndices.includes(bankIdx);
                  return (
                    <button
                      key={bankIdx}
                      type="button"
                      disabled={used || checkedStatus !== 'idle'}
                      onClick={() => setPickedIndices((prev) => [...prev, bankIdx])}
                      className={`rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${used
                        ? 'border-slate-200 bg-slate-100 text-transparent select-none'
                        : 'border-slate-200 bg-white text-slate-800 shadow-2xs hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                        }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {checkedStatus === 'idle' && pickedIndices.length > 0 && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setPickedIndices([])}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Limpar ordem</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* WRITING FREE */}
          {currentStep.type === 'writing_free' && (
            <WritingFreeStepView
              step={currentStep}
              languageCode={topic.languageCode}
              preferredAccent={dialectCode}
              onSelectAccent={onChangeDialect}
              freeText={freeText}
              setFreeText={setFreeText}
              freeWordCount={freeWordCount}
              hasLinkedTeacher={hasLinkedTeacher}
              submittedToTeacher={submittedToTeacher}
              onSendToTeacher={() => handleSendFreeWriting(true)}
              onRequestTeacherLink={onRequestTeacherLink}
              showModelAnswer={showModelAnswer}
              onToggleModelAnswer={() => setShowModelAnswer((v) => !v)}
              onSaveMistakesToBank={
                onRecordMistake
                  ? (items) => {
                      for (const item of items) {
                        onRecordMistake({
                          topicId: topic.id,
                          topicTitle: topic.titlePt,
                          skill: 'writing',
                          prompt: item.prompt,
                          studentAnswer: item.studentAnswer,
                          expectedAnswer: item.expectedAnswer,
                          explanation: item.explanation,
                        });
                      }
                    }
                  : undefined
              }
            />
          )}

          {/* PHASE 8: DICTATION, MINIMAL PAIRS & MULTI-VOICE STORY */}
          {(currentStep.type === 'dictation' ||
            currentStep.type === 'minimal_pairs' ||
            currentStep.type === 'story') && (
              <>
                <Phase8StepsView
                  currentStep={currentStep}
                  languageCode={topic.languageCode}
                  level={topic.level}
                  checkedStatus={checkedStatus}
                  dictationText={dictationText}
                  setDictationText={setDictationText}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  storyShowTranslations={storyShowTranslations}
                  setStoryShowTranslations={setStoryShowTranslations}
                  storyActiveLine={storyActiveLine}
                  playStoryLineAt={playStoryLineAt}
                />
                {currentStep.type === 'story' &&
                  renderUnitVocabInUseStrip(
                    currentStep.lines.map((l) => l.text).join('\n'),
                    topicVocab,
                    (w) => playAudio(w, 0.9),
                  )}
              </>
            )}
        </div>
      </main>

      {/* Bottom Persistent Feedback / Action Footer */}
      <footer
        className={`safe-pb-4 border-t px-4 pt-4 transition-colors sm:px-6 ${checkedStatus === 'correct'
          ? 'border-emerald-200 bg-emerald-50'
          : checkedStatus === 'incorrect'
            ? 'border-rose-200 bg-rose-50'
            : 'border-slate-200 bg-white'
          }`}
      >
        <div className="mx-auto flex max-w-2xl flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            {currentStep.type === 'tip' && (
              <p className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Leia a dica e avance para praticar em contexto real.</span>
              </p>
            )}

            {checkedStatus === 'correct' && (
              <div className="flex items-start gap-2.5 text-emerald-900">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold">
                    Excelente! {combo >= 3 ? `Combo ${combo}x (+5 XP)!` : 'Resposta registrada.'}
                  </p>
                  {(currentStep.type === 'listening' ||
                    currentStep.type === 'reading' ||
                    currentStep.type === 'fill_blank' ||
                    currentStep.type === 'writing_builder' ||
                    currentStep.type === 'minimal_pairs' ||
                    currentStep.type === 'story') && (
                      <p className="mt-0.5">{currentStep.explanation}</p>
                    )}
                  {currentStep.type === 'dictation' && (
                    <p className="mt-0.5">Excelente escuta! Ditado conferido com sucesso.</p>
                  )}
                  {currentStep.type === 'matching' && (
                    <p className="mt-0.5">Todos os pares conectados corretamente!</p>
                  )}
                  {currentStep.type === 'speaking' && sentClipToTeacher && (
                    <p className="mt-0.5">
                      Seu áudio foi enviado para o Professor corrigir sua pronúncia!
                    </p>
                  )}
                  {currentStep.type === 'writing_free' && submittedToTeacher && (
                    <p className="mt-0.5">
                      Sua produção foi salva na fila de correções do Modo Professor!
                    </p>
                  )}
                </div>
              </div>
            )}

            {checkedStatus === 'incorrect' && (
              <div className="flex items-start gap-2.5 text-rose-950">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold">Quase lá! Veja a explicação do professor:</p>
                  {(currentStep.type === 'listening' ||
                    currentStep.type === 'reading' ||
                    currentStep.type === 'fill_blank' ||
                    currentStep.type === 'writing_builder' ||
                    currentStep.type === 'minimal_pairs' ||
                    currentStep.type === 'story') && (
                      <>
                        {currentStep.type === 'writing_builder' && (
                          <p className="mt-0.5 font-semibold">
                            Ordem ideal: {currentStep.targetSentence}
                          </p>
                        )}
                        {currentStep.type === 'fill_blank' && (
                          <p className="mt-0.5 font-semibold">
                            Forma correta: {currentStep.options[currentStep.correctIndex]}
                          </p>
                        )}
                        <p className="mt-0.5">{currentStep.explanation}</p>
                      </>
                    )}
                  {currentStep.type === 'dictation' && (
                    <p className="mt-0.5 font-semibold">
                      Texto correto: “{currentStep.audioText}”
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 justify-end">
            {currentStep.type === 'vocab_intro' ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-cyan-700 sm:w-auto cursor-pointer"
              >
                <span>Desbloquear palavras &amp; continuar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : currentStep.type === 'tip' || currentStep.type === 'script_phonics' ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 sm:w-auto cursor-pointer"
              >
                <span>{imm.gotItContinue}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : checkedStatus === 'idle' ? (
              currentStep.type === 'listening' ||
                currentStep.type === 'reading' ||
                currentStep.type === 'fill_blank' ||
                currentStep.type === 'writing_builder' ||
                currentStep.type === 'minimal_pairs' ||
                currentStep.type === 'story' ||
                currentStep.type === 'dictation' ? (
                <button
                  type="button"
                  disabled={
                    currentStep.type === 'writing_builder'
                      ? pickedIndices.length === 0
                      : currentStep.type === 'dictation'
                        ? dictationText.trim().length === 0
                        : selectedOption === null
                  }
                  onClick={handleCheck}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:w-auto cursor-pointer"
                >
                  {imm.checkAnswer}
                </button>
              ) : currentStep.type === 'writing_free' ? (
                <button
                  type="button"
                  disabled={freeWordCount < 3}
                  onClick={() => handleSendFreeWriting(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:w-auto cursor-pointer"
                >
                  <span>Concluir prática</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : currentStep.type === 'matching' ? (
                <span className="text-xs font-medium text-slate-400">
                  Combine todos os pares acima para avançar
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400">
                  Grave um áudio, teste no mic ou marque como praticado
                </span>
              )
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-xs transition sm:w-auto cursor-pointer ${checkedStatus === 'correct'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
                  }`}
              >
                <span>
                  {stepIdx === steps.length - 1 ? 'Finalizar lição' : 'Continuar'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

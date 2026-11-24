import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Flame,
  Heart,
  HelpCircle,
  Infinity as InfinityIcon,
  Lightbulb,
  Mic,
  MicOff,
  Radio,
  RotateCcw,
  Send,
  Sparkles,
  Square,
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
  isAudioRecordingSupported,
  startAudioRecording,
} from '../utils/audioRecorder';
import { isSoundMuted, playSound, setSoundMuted } from '../utils/soundFx';
import {
  evaluatePronunciation,
  isSpeechRecognitionSupported,
  speakText,
  startSpeechRecognition,
  stopSpeaking,
  transcribeAudioBlob,
} from '../utils/speech';
import { DualAudioButtons } from './DualAudioButtons';
import { SkillBadge, TIP_CATEGORY_META } from './SkillBadge';
import { Phase8StepsView } from './steps/Phase8StepsView';
import { ScriptPhonicsStepView } from './steps/ScriptPhonicsStepView';
import { ShadowingPanel } from './steps/ShadowingPanel';
import { VocabIntroStep } from './steps/VocabIntroStep';
import { PitchOscilloscope } from './PitchOscilloscope';
import {
  loadJapaneseScriptMode,
  saveJapaneseScriptMode,
  toJapaneseKana,
  type JapaneseScriptMode,
} from '../utils/japaneseKana';
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
  const regex = new RegExp(`(\\b(?:${pattern})\\b)`, 'gi');

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
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);
  const jaText = (s: string) =>
    topic.languageCode === 'ja' && jaScriptMode === 'kana'
      ? toJapaneseKana(s)
      : s;

  // Gamification: Hearts, Combo, Sound FX, Relaxed Mode
  const [hearts, setHearts] = useState(5);
  const [relaxedMode, setRelaxedMode] = useState(false);
  const [combo, setCombo] = useState(0);
  const [muted, setMuted] = useState(() => isSoundMuted());
  const [showHeartRecovery, setShowHeartRecovery] = useState(false);

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
    const comboBonus = nextCombo >= 3 ? 5 : 0;
    setEarnedXp((prev) => prev + baseXp + comboBonus);
  };

  const registerMistake = () => {
    playSound('wrong');
    setCombo(0);
    setEarnedXp((prev) => prev + 6);
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

        {/* Busuu-style Subunit / Stage Navigation Strip */}
        <div className="mx-auto mt-2.5 flex max-w-4xl items-center gap-1.5 overflow-x-auto pb-0.5">
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
            <div className="animate-fade-up space-y-5">
              <div className="rounded-3xl border border-indigo-200/80 bg-white p-6 shadow-xs">
                <p className="text-xs font-bold text-indigo-600">
                  {currentStep.speakerLabel}
                </p>
                <p className="mt-1 text-sm text-slate-600">{currentStep.contextPt}</p>

                <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl bg-indigo-50/80 p-4 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 items-center gap-1 px-2" aria-hidden="true">
                      {[0.4, 0.9, 0.6, 1, 0.5, 0.85, 0.45].map((h, i) => (
                        <span
                          key={i}
                          className={`w-1.5 rounded-full bg-indigo-500 transition-all ${isPlayingAudio ? 'animate-wave h-8' : 'h-4 opacity-60'
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
                    text={currentStep.audioText}
                    languageCode={topic.languageCode}
                    showSlow
                    size="md"
                    onPlayStart={() => setIsPlayingAudio(true)}
                    onPlayEnd={() => setIsPlayingAudio(false)}
                  />
                </div>

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
                        {showTranscript ? 'Ocultar transcrição' : 'Ver transcrição do áudio'}
                      </span>
                    </button>
                    {showTranscript && (
                      <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed font-medium text-slate-700">
                        “{currentStep.audioText}”
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  {currentStep.question}
                </h2>
                <div className="mt-4 space-y-2.5">
                  {currentStep.options.map((opt, i) => {
                    const isPicked = selectedOption === i;
                    const isRight = i === currentStep.correctIndex;
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
          )}

          {/* READING STEP */}
          {currentStep.type === 'reading' && (
            <div className="animate-fade-up space-y-5">
              <div className="rounded-3xl border border-teal-200/80 bg-white p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold tracking-wider text-teal-700 uppercase">
                      {FORMAT_LABELS[currentStep.format]}
                    </span>
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      {currentStep.title}
                    </h2>
                  </div>
                  <DualAudioButtons
                    text={currentStep.text}
                    languageCode={topic.languageCode}
                    size="xs"
                  />
                </div>

                <div
                  data-testid="reading-passage-box"
                  className="reading-passage-box mt-4 rounded-2xl border p-4 text-sm"
                >
                  {renderInteractivePassage(
                    jaText(currentStep.text),
                    currentStep.glossary,
                    selectedGloss,
                    (g) => setSelectedGloss(g),
                  )}
                </div>

                <div className="mt-3">
                  {selectedGloss ? (
                    <div className="animate-fade-up flex items-center justify-between gap-3 rounded-2xl border border-teal-300 bg-teal-50 p-3.5">
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-extrabold text-teal-950">
                            {selectedGloss.word}
                          </span>
                          {selectedGloss.ipa && (
                            <span className="font-mono text-xs text-teal-700">
                              {selectedGloss.ipa}
                            </span>
                          )}
                          <span className="text-xs font-bold text-teal-900">
                            → {selectedGloss.translation}
                          </span>
                        </div>
                        {selectedGloss.note && (
                          <p className="text-xs text-teal-800">{selectedGloss.note}</p>
                        )}
                      </div>
                      <DualAudioButtons
                        text={selectedGloss.word}
                        languageCode={topic.languageCode}
                        size="xs"
                      />
                    </div>
                  ) : (
                    currentStep.glossary.length > 0 && (
                      <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <BookOpen className="h-3.5 w-3.5 text-teal-600" />
                        Toque nas palavras sublinhadas acima para ver tradução, IPA e dica do professor.
                      </p>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <h3 className="font-display text-base font-bold text-slate-900">
                  {currentStep.question}
                </h3>
                <div className="mt-3.5 space-y-2.5">
                  {currentStep.options.map((opt, i) => {
                    const isPicked = selectedOption === i;
                    const isRight = i === currentStep.correctIndex;
                    let cardStyle =
                      'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/40';
                    if (checkedStatus === 'idle' && isPicked) {
                      cardStyle = 'border-teal-600 bg-teal-50 ring-2 ring-teal-200';
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
          )}

          {/* NEW STEP: MATCHING PAIRS */}
          {currentStep.type === 'matching' && (
            <div className="animate-fade-up rounded-3xl border border-sky-200/80 bg-white p-6 shadow-xs sm:p-7">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  {currentStep.promptPt}
                </h2>
                <span className="rounded-full bg-sky-50 px-2.5 py-0.5 font-mono text-xs font-bold text-sky-700">
                  {matchedIds.length}/{currentStep.pairs.length}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Toque em uma expressão à esquerda (com áudio) e depois no equivalente à direita.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2.5">
                  {matchingColumns.targets.map((pair) => {
                    const isCleared = matchedIds.includes(pair.id);
                    const isPicked = pickedTargetId === pair.id;
                    const isErr = matchErrorIds?.[0] === pair.id;

                    return (
                      <div
                        key={`t-${pair.id}`}
                        onClick={() => {
                          if (isCleared) return;
                          playAudio(pair.target, 0.95);
                          setPickedTargetId(pair.id);
                          tryResolveMatch(pair.id, pickedPtId);
                        }}
                        role="button"
                        tabIndex={isCleared ? -1 : 0}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && !isCleared) {
                            e.preventDefault();
                            playAudio(pair.target, 0.95);
                            setPickedTargetId(pair.id);
                            tryResolveMatch(pair.id, pickedPtId);
                          }
                        }}
                        className={`flex w-full flex-wrap items-center justify-between gap-2 rounded-2xl border p-3.5 text-left text-xs font-bold transition sm:text-sm ${isCleared
                          ? 'border-emerald-200 bg-emerald-50/70 text-emerald-700 opacity-70'
                          : isErr
                            ? 'animate-shake border-rose-400 bg-rose-50 text-rose-800'
                            : isPicked
                              ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-100'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-blue-300 cursor-pointer'
                          }`}
                      >
                        <span>{pair.target}</span>
                        <DualAudioButtons
                          text={pair.target}
                          languageCode={topic.languageCode}
                          size="xs"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2.5">
                  {matchingColumns.pts.map((pair) => {
                    const isCleared = matchedIds.includes(pair.id);
                    const isPicked = pickedPtId === pair.id;
                    const isErr = matchErrorIds?.[1] === pair.id;

                    return (
                      <button
                        key={`p-${pair.id}`}
                        type="button"
                        disabled={isCleared}
                        onClick={() => {
                          setPickedPtId(pair.id);
                          tryResolveMatch(pickedTargetId, pair.id);
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-2xl border p-3.5 text-left text-xs font-semibold transition sm:text-sm ${isCleared
                          ? 'border-emerald-200 bg-emerald-50/70 text-emerald-700 opacity-70'
                          : isErr
                            ? 'animate-shake border-rose-400 bg-rose-50 text-rose-800'
                            : isPicked
                              ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-100'
                              : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-sky-300 cursor-pointer'
                          }`}
                      >
                        <span>{pair.pt}</span>
                        {isCleared && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* NEW STEP: FILL IN THE BLANK */}
          {currentStep.type === 'fill_blank' && (
            <div className="animate-fade-up space-y-5 rounded-3xl border border-violet-200/80 bg-white p-6 shadow-xs sm:p-7">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  {currentStep.promptPt}
                </h2>
                {currentStep.verbHint && (
                  <p className="mt-1 text-xs font-semibold text-violet-700">
                    Foco gramatical: {currentStep.verbHint}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-relaxed font-semibold text-slate-900">
                <span>{currentStep.sentenceBefore}</span>
                <span
                  className={`mx-1 inline-block rounded-xl border-2 px-3 py-0.5 font-mono text-sm font-bold ${checkedStatus === 'correct'
                    ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                    : checkedStatus === 'incorrect'
                      ? 'border-rose-400 bg-rose-100 text-rose-900'
                      : selectedOption !== null
                        ? 'border-violet-500 bg-violet-100 text-violet-900'
                        : 'border-dashed border-slate-300 bg-white text-slate-400'
                    }`}
                >
                  {selectedOption !== null
                    ? currentStep.options[selectedOption]
                    : '________'}
                </span>
                <span>{currentStep.sentenceAfter}</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {currentStep.options.map((opt, idx) => {
                  const isPicked = selectedOption === idx;
                  const isRight = idx === currentStep.correctIndex;
                  let style =
                    'border-slate-200 bg-white hover:border-violet-400 hover:bg-violet-50/50';
                  if (checkedStatus === 'idle' && isPicked) {
                    style = 'border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-200';
                  } else if (checkedStatus !== 'idle') {
                    if (isRight) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                    } else if (isPicked && !isRight) {
                      style = 'border-rose-400 bg-rose-50 text-rose-900 animate-shake';
                    }
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={checkedStatus !== 'idle'}
                      onClick={() => setSelectedOption(idx)}
                      className={`rounded-2xl border p-3.5 text-center font-mono text-sm font-bold transition cursor-pointer disabled:cursor-default ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SPEAKING STEP */}
          {currentStep.type === 'speaking' && (
            <div className="animate-fade-up space-y-4 rounded-3xl border border-rose-200/80 bg-white p-6 shadow-xs sm:p-7">
              <p className="text-sm font-semibold text-slate-700">
                {currentStep.promptPt}
              </p>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-display text-xl font-extrabold text-slate-900">
                  “{currentStep.targetSentence}”
                </p>
                <p className="mt-1.5 text-sm text-slate-600">
                  {currentStep.translationPt}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-white px-2.5 py-1 font-mono text-xs text-slate-600 ring-1 ring-slate-200">
                    IPA: {currentStep.ipa}
                  </span>
                  <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-800 ring-1 ring-rose-200">
                    Guia BR: {currentStep.brPhoneticHint}
                  </span>
                </div>

                <div className="mt-4">
                  <DualAudioButtons
                    text={currentStep.targetSentence}
                    languageCode={topic.languageCode}
                    showSlow
                    size="md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center">
                  <p className="text-xs font-bold text-slate-700">
                    1. Checagem rápida de pronúncia
                  </p>
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    className={`my-3 flex h-14 w-14 items-center justify-center rounded-full shadow-md transition cursor-pointer ${isRecordingSpeech
                      ? 'animate-pulse bg-rose-600 text-white ring-4 ring-rose-200'
                      : 'bg-rose-500 text-white hover:bg-rose-600'
                      }`}
                    aria-label={isRecordingSpeech ? 'Parar ditado' : 'Testar pronúncia'}
                  >
                    {isRecordingSpeech ? (
                      <MicOff className="h-6 w-6" />
                    ) : (
                      <Mic className="h-6 w-6" />
                    )}
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
                    onClick={() => void handleStartOrStopVoiceClip()}
                    className={`my-3 flex h-14 w-14 items-center justify-center rounded-full shadow-md transition cursor-pointer ${isRecordingClip
                      ? 'animate-pulse bg-red-600 text-white ring-4 ring-red-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    aria-label={isRecordingClip ? 'Parar gravação' : 'Gravar áudio para professor'}
                  >
                    {isRecordingClip ? (
                      <Square className="h-5 w-5 fill-white" />
                    ) : (
                      <Radio className="h-6 w-6" />
                    )}
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
                  <p className="text-xs font-medium text-emerald-900">
                    {speakingEval.summaryPt}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {speakingEval.words.map((w, idx) => (
                      <span
                        key={idx}
                        className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${w.matched
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800 ring-1 ring-rose-300'
                          }`}
                        title={`Sílabas: ${w.syllables.join(' · ')}`}
                      >
                        {w.syllables.join('·')}
                      </span>
                    ))}
                  </div>
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
                            languageCode={topic.languageCode ?? 'en'}
                            size="xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(topic.languageCode === 'zh' || topic.languageCode === 'ja') && (
                <PitchOscilloscope languageCode={topic.languageCode} compact />
              )}

              <ShadowingPanel
                targetText={currentStep.targetSentence}
                dialectCode={dialectCode}
                languageCode={topic.languageCode ?? 'en'}
              />

              {recordedAudioUrl && (
                <div className="animate-fade-up space-y-3 rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-950">
                    <span>Prévia da sua gravação ({recordedDuration}s)</span>
                    <button
                      type="button"
                      onClick={() => void handleStartOrStopVoiceClip()}
                      className="text-blue-700 hover:underline cursor-pointer"
                    >
                      Regravar
                    </button>
                  </div>
                  <audio controls src={recordedAudioUrl} className="h-10 w-full" />
                  {hasLinkedTeacher ? (
                    <button
                      type="button"
                      disabled={sentClipToTeacher}
                      onClick={() => void handleSendAudioClipToTeacher()}
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
                    onClick={handleManualSpeakingComplete}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Pratiquei em voz alta (Sem microfone)</span>
                  </button>
                </div>
              )}

              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-950">
                <strong className="font-bold">Foco de pronúncia: </strong>
                {currentStep.focusTip}
              </div>
            </div>
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
            <div className="animate-fade-up space-y-4 rounded-3xl border border-amber-200/80 bg-white p-6 shadow-xs sm:p-7">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  {currentStep.promptPt}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{currentStep.scenarioPt}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Checklist automático em tempo real</span>
                  <span
                    className={`font-mono ${freeWordCount >= currentStep.minWords
                      ? 'text-emerald-600'
                      : 'text-slate-500'
                      }`}
                  >
                    {freeWordCount} / {currentStep.minWords} palavras mín.
                  </span>
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {currentStep.checklist.map((item, idx) => {
                    const lower = freeText.toLowerCase();
                    const passed = item.keywords.some((kw) =>
                      lower.includes(kw.toLowerCase()),
                    );
                    return (
                      <li
                        key={idx}
                        className={`flex items-center gap-2 text-xs font-medium transition ${passed ? 'text-emerald-700' : 'text-slate-500'
                          }`}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 ${passed ? 'text-emerald-500' : 'text-slate-300'
                            }`}
                        />
                        <span>{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <textarea
                rows={4}
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Escreva sua resposta no idioma da lição..."
                className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                {hasLinkedTeacher ? (
                  <button
                    type="button"
                    disabled={freeWordCount < 3}
                    onClick={() => handleSendFreeWriting(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>
                      {submittedToTeacher
                        ? 'Enviado para o Professor!'
                        : 'Enviar resposta para o Professor corrigir'}
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-[11px] text-amber-950">
                    <span className="font-semibold">
                      Correção docente restrita sem professor vinculado.
                    </span>
                    {onRequestTeacherLink && (
                      <button
                        type="button"
                        onClick={onRequestTeacherLink}
                        className="rounded-lg bg-amber-600 px-2.5 py-1 font-bold text-white hover:bg-amber-700 cursor-pointer"
                      >
                        Vincular professor
                      </button>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowModelAnswer((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{showModelAnswer ? 'Ocultar exemplo' : 'Ver resposta modelo'}</span>
                </button>
              </div>

              {showModelAnswer && (
                <div className="animate-fade-up flex flex-col justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-[11px] font-bold text-blue-800 uppercase">
                      Resposta modelo do professor
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-slate-800">
                      “{currentStep.modelAnswer}”
                    </p>
                  </div>
                  <DualAudioButtons
                    text={currentStep.modelAnswer}
                    languageCode={topic.languageCode}
                    size="xs"
                  />
                </div>
              )}
            </div>
          )}

          {/* PHASE 8: DICTATION, MINIMAL PAIRS & MULTI-VOICE STORY */}
          {(currentStep.type === 'dictation' ||
            currentStep.type === 'minimal_pairs' ||
            currentStep.type === 'story') && (
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

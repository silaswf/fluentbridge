import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Headphones,
  Loader2,
  Mic,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Square,
  Timer,
  XCircle,
} from 'lucide-react';
import { getExamTypeById, getExamTypesByLanguage } from '../data/exams/examCatalog';
import { getExamsByLanguage } from '../data/exams';
import type {
  AnalyticalWritingRubric,
  ExamPracticeCategory,
  ExamTypeMeta,
  MockExam,
  SpeakingEvaluationResult,
} from '../types/exams';
import type { ExamAttemptRecord, LanguageCourse } from '../types/learning';
import { saveAudioClip } from '../utils/audioDb';
import {
  isAudioRecordingSupported,
  startAudioRecording,
} from '../utils/audioRecorder';
import {
  gradeSpeakingWithRubric,
  gradeWritingWithRubric,
} from '../utils/examAiGrader';
import { gradeMockExam, type GradedExamResult } from '../utils/examScoring';
import { transcribeAudioBlob } from '../utils/speech';
import { DualAudioButtons } from './DualAudioButtons';

interface MockExamHubProps {
  activeCourse: LanguageCourse;
  activeDialect?: string;
  geminiApiKey?: string;
  hasLinkedTeacher?: boolean;
  onRequestTeacherLink?: () => void;
  onSubmitSpeaking?: (payload: {
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
  pastAttempts: ExamAttemptRecord[];
  onCompleteExam: (attempt: ExamAttemptRecord) => void;
}

const CATEGORY_OPTIONS: Array<{
  id: ExamPracticeCategory;
  label: string;
  short: string;
}> = [
  { id: 'full', label: 'Prova Completa (Todas)', short: 'Completa' },
  { id: 'reading', label: 'Reading (Leitura)', short: 'Reading' },
  { id: 'listening', label: 'Listening (Audição)', short: 'Listening' },
  { id: 'language_use', label: 'Use of Language', short: 'Gramática/Uso' },
  { id: 'writing', label: 'Writing (Redação)', short: 'Writing' },
  { id: 'speaking', label: 'Speaking (Entrevista Oral)', short: 'Speaking' },
];

interface SpeakingPartState {
  transcript: string;
  audioId?: string;
  audioBlob?: Blob;
  audioUrl?: string;
  durationSec: number;
}

export function MockExamHub({
  activeCourse,
  activeDialect,
  geminiApiKey,
  hasLinkedTeacher = false,
  onRequestTeacherLink,
  onSubmitSpeaking,
  pastAttempts,
  onCompleteExam,
}: MockExamHubProps) {
  const effectiveDialect = activeDialect || activeCourse.dialects[0]?.code || 'en-US';

  const examTypes = useMemo(
    () => getExamTypesByLanguage(activeCourse.code),
    [activeCourse.code],
  );
  const exams = useMemo(
    () => getExamsByLanguage(activeCourse.code),
    [activeCourse.code],
  );

  const [selectedCategory, setSelectedCategory] =
    useState<ExamPracticeCategory>('full');
  const [activeExam, setActiveExam] = useState<MockExam | null>(null);
  const [activeMeta, setActiveMeta] = useState<ExamTypeMeta | null>(null);
  const [activeSectionTab, setActiveSectionTab] = useState<
    'reading' | 'listening' | 'language_use' | 'writing' | 'speaking'
  >('reading');

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [writingResponse, setWritingResponse] = useState('');
  const [speakingParts, setSpeakingParts] = useState<
    Record<string, SpeakingPartState>
  >({});
  const [recordingPartId, setRecordingPartId] = useState<string | null>(null);
  const [transcribingPartId, setTranscribingPartId] = useState<string | null>(null);
  const [speakingSentParts, setSpeakingSentParts] = useState<Record<string, boolean>>({});
  const activeRecordingRef = useRef<Awaited<ReturnType<typeof startAudioRecording>>>(null);

  const [audioPlays, setAudioPlays] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState<GradedExamResult | null>(null);
  const [writingRubric, setWritingRubric] =
    useState<AnalyticalWritingRubric | null>(null);
  const [speakingEval, setSpeakingEval] =
    useState<SpeakingEvaluationResult | null>(null);
  const [isAiGrading, setIsAiGrading] = useState(false);

  useEffect(() => {
    return () => {
      activeRecordingRef.current?.cancel();
    };
  }, []);

  const includeReading =
    selectedCategory === 'full' || selectedCategory === 'reading';
  const includeListening =
    selectedCategory === 'full' || selectedCategory === 'listening';
  const includeLangUse =
    selectedCategory === 'full' || selectedCategory === 'language_use';
  const includeWriting =
    selectedCategory === 'full' || selectedCategory === 'writing';
  const includeSpeaking =
    selectedCategory === 'full' || selectedCategory === 'speaking';

  const finishExam = (examToGrade: MockExam, metaToGrade: ExamTypeMeta) => {
    const partsList = (examToGrade.speakingTask?.parts ?? []).map((p) => ({
      partLabel: p.partLabel,
      transcript: speakingParts[p.id]?.transcript ?? '',
      durationSec: speakingParts[p.id]?.durationSec ?? 0,
    }));
    const hasSpokenInput = partsList.some((p) => p.transcript.trim().length > 0);
    const provisionalSpeakingPct = hasSpokenInput
      ? Math.min(
          95,
          Math.max(
            45,
            Math.round(
              partsList
                .map((p) => p.transcript.trim().split(/\s+/).filter(Boolean).length)
                .reduce((a, b) => a + b, 0) * 1.6,
            ),
          ),
        )
      : undefined;

    const graded = gradeMockExam(
      examToGrade,
      metaToGrade,
      answers,
      writingResponse,
      includeSpeaking ? provisionalSpeakingPct : undefined,
      selectedCategory,
    );
    setResult(graded);
    onCompleteExam({
      id: `attempt-${examToGrade.id}-${Date.now()}`,
      examId: examToGrade.id,
      examTypeId: metaToGrade.id,
      languageCode: activeCourse.code,
      officialScoreLabel: graded.officialLabel,
      rawPercent: graded.rawPercent,
      passed: graded.passed,
      practiceCategory: selectedCategory,
      sectionScores: {
        reading: graded.sectionBreakdown.reading.percent,
        listening: graded.sectionBreakdown.listening.percent,
        language_use: graded.sectionBreakdown.language_use.percent,
        writing: graded.sectionBreakdown.writing.percent,
        speaking: graded.sectionBreakdown.speaking.percent,
      },
      completedAt: new Date().toISOString().slice(0, 10),
    });

    setIsAiGrading(true);
    void Promise.all([
      includeWriting
        ? gradeWritingWithRubric(
            examToGrade,
            metaToGrade,
            writingResponse,
            geminiApiKey,
          )
        : Promise.resolve(null),
      includeSpeaking && hasSpokenInput
        ? gradeSpeakingWithRubric(
            examToGrade,
            metaToGrade,
            partsList,
            geminiApiKey,
          )
        : Promise.resolve(null),
    ]).then(([wRubric, sEval]) => {
      if (wRubric) setWritingRubric(wRubric);
      if (sEval) setSpeakingEval(sEval);
      setIsAiGrading(false);
    });
  };

  useEffect(() => {
    if (!activeExam || !activeMeta || result) return undefined;
    if (secondsLeft <= 0) {
      finishExam(activeExam, activeMeta);
      return undefined;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeExam, activeMeta, result, secondsLeft]);

  const startSimulation = (exam: MockExam, catOverride?: ExamPracticeCategory) => {
    const cat = catOverride ?? selectedCategory;
    const meta = getExamTypeById(exam.examTypeId) ?? examTypes[0];
    if (!meta) return;
    setSelectedCategory(cat);
    setActiveExam(exam);
    setActiveMeta(meta);
    setAnswers({});
    setWritingResponse('');
    setSpeakingParts({});
    setSpeakingSentParts({});
    setAudioPlays({});
    setResult(null);
    setWritingRubric(null);
    setSpeakingEval(null);
    setActiveSectionTab(cat === 'full' ? 'reading' : cat);
    const scaledMinutes =
      cat === 'full'
        ? exam.durationMinutes
        : cat === 'writing' || cat === 'speaking'
          ? 20
          : 15;
    setSecondsLeft(scaledMinutes * 60);
  };

  const handleToggleSpeakRecord = async (partId: string, maxSec: number) => {
    if (recordingPartId === partId && activeRecordingRef.current) {
      activeRecordingRef.current.stop();
      setRecordingPartId(null);
      return;
    }
    if (!isAudioRecordingSupported()) return;

    setRecordingPartId(partId);
    const startedAt = Date.now();
    const rec = await startAudioRecording({
      maxSeconds: Math.max(20, maxSec),
      onComplete: async (blob) => {
        setRecordingPartId(null);
        const durationSec = Math.max(2, Math.round((Date.now() - startedAt) / 1000));
        const audioId = `exam-sp-${partId}-${Date.now()}`;
        const audioUrl = URL.createObjectURL(blob);
        await saveAudioClip(audioId, blob);

        setSpeakingParts((prev) => ({
          ...prev,
          [partId]: {
            ...(prev[partId] ?? { transcript: '' }),
            audioId,
            audioBlob: blob,
            audioUrl,
            durationSec,
          },
        }));

        setTranscribingPartId(partId);
        const stt = await transcribeAudioBlob(blob, effectiveDialect);
        setTranscribingPartId(null);
        if (stt.ok && stt.text) {
          setSpeakingParts((prev) => ({
            ...prev,
            [partId]: {
              ...(prev[partId] ?? { durationSec }),
              transcript: stt.text ?? prev[partId]?.transcript ?? '',
            },
          }));
        }
      },
      onError: () => {
        setRecordingPartId(null);
      },
    });
    if (rec) {
      activeRecordingRef.current = rec;
    } else {
      setRecordingPartId(null);
    }
  };

  const handleSendSpeakingPartToTeacher = (
    partId: string,
    partLabel: string,
    prompt: string,
  ) => {
    if (!activeExam || !onSubmitSpeaking) return;
    if (!hasLinkedTeacher) {
      onRequestTeacherLink?.();
      return;
    }
    const partState = speakingParts[partId];
    if (!partState?.audioId) return;

    onSubmitSpeaking({
      topicId: activeExam.id,
      topicTitle: `${activeExam.title} — ${partLabel}`,
      promptPt: prompt,
      targetSentence: prompt,
      responseText: partState.transcript || '(Áudio gravado no simulado oficial)',
      audioId: partState.audioId,
      audioBlob: partState.audioBlob,
      audioDurationSec: partState.durationSec || 15,
      autoPronunciationScore: speakingEval?.overallPercent,
    });
    setSpeakingSentParts((prev) => ({ ...prev, [partId]: true }));
  };

  const formatTimer = (secs: number) => {
    const mm = Math.floor(secs / 60);
    const ss = secs % 60;
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };

  if (activeExam && activeMeta) {
    const wordCount = writingResponse.trim()
      ? writingResponse.trim().split(/\s+/).length
      : 0;

    const visibleQuestions = activeExam.questions.filter(
      (q) => q.section === activeSectionTab,
    );

    const availableTabs: Array<{
      id: 'reading' | 'listening' | 'language_use' | 'writing' | 'speaking';
      label: string;
    }> = [
      ...(includeReading
        ? [
            {
              id: 'reading' as const,
              label: `Reading (${activeExam.questions.filter((q) => q.section === 'reading').length})`,
            },
          ]
        : []),
      ...(includeListening
        ? [
            {
              id: 'listening' as const,
              label: `Listening (${activeExam.questions.filter((q) => q.section === 'listening').length})`,
            },
          ]
        : []),
      ...(includeLangUse
        ? [
            {
              id: 'language_use' as const,
              label: `Use of Language (${activeExam.questions.filter((q) => q.section === 'language_use').length})`,
            },
          ]
        : []),
      ...(includeWriting ? [{ id: 'writing' as const, label: 'Writing' }] : []),
      ...(includeSpeaking && activeExam.speakingTask
        ? [{ id: 'speaking' as const, label: `Speaking (${activeExam.speakingTask.parts.length})` }]
        : []),
    ];

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Sticky Exam Timer Bar */}
        <div className="sticky top-14 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur-xs lg:top-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
              {activeMeta.name} · Simulado {activeExam.simulationNumber}/4 ·{' '}
              {CATEGORY_OPTIONS.find((c) => c.id === selectedCategory)?.short}
            </p>
            <h2 className="font-display text-base font-extrabold text-slate-900">
              {activeExam.title}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {!result && (
              <>
                <div
                  data-testid="exam-timer"
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-sm font-extrabold ${
                    secondsLeft <= 120
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <Timer className="h-4 w-4" />
                  <span>{formatTimer(secondsLeft)}</span>
                </div>
                <button
                  type="button"
                  data-testid="finish-exam-btn"
                  onClick={() => finishExam(activeExam, activeMeta)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Finalizar</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setActiveExam(null);
                setResult(null);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Result Screen with Official Scale, AI Writing Rubric, Speaking Eval & Reference Table */}
        {result ? (
          <div className="space-y-6">
            <div
              data-testid="exam-result-card"
              className={`rounded-3xl border p-6 shadow-sm ${
                result.passed
                  ? 'border-emerald-200 bg-emerald-50/70'
                  : 'border-amber-200 bg-amber-50/70'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-2xs">
                    {result.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-amber-600" />
                    )}
                    {result.passed
                      ? 'Desempenho Aprovado / Competente'
                      : 'Abaixo da Nota de Corte'}
                  </span>
                  <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
                    {result.officialLabel}
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    Faixa Equivalente: <strong>{result.matchedBand.label}</strong> (CEFR{' '}
                    <strong>{result.matchedBand.cefr}</strong>) — {result.matchedBand.meaningPt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => startSimulation(activeExam)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Refazer Simulado</span>
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {(
                  ['reading', 'listening', 'language_use', 'writing', 'speaking'] as const
                ).map((sec) => (
                  <div
                    key={sec}
                    className="rounded-2xl bg-white p-3 text-center shadow-2xs"
                  >
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      {sec === 'language_use' ? 'Use of Lang' : sec}
                    </p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-slate-900">
                      {sec === 'speaking' && speakingEval
                        ? `${speakingEval.overallPercent}%`
                        : `${result.sectionBreakdown[sec].percent}%`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {isAiGrading && (
              <div className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-xs font-bold text-indigo-800">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analisando Redação &amp; Speaking nos critérios oficiais via IA...</span>
              </div>
            )}

            {/* Analytical Writing Rubric + C1/C2 Rewrite */}
            {includeWriting && writingRubric && (
              <div
                data-testid="writing-analytical-rubric"
                className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="flex items-center gap-2 font-display text-base font-extrabold text-slate-900">
                      <FileText className="h-4.5 w-4.5 text-amber-600" />
                      <span>Rubrica Analítica de Redação (Writing)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      {writingRubric.usedAi
                        ? 'Avaliação detalhada por examinador IA (/api/gemini-tutor)'
                        : 'Avaliação analítica local por critério oficial'}
                      {' · '}Estimativa: <strong>{writingRubric.estimatedBandLabel}</strong>
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 font-mono text-xs font-extrabold text-amber-900">
                    {writingRubric.overallPercent}%
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {writingRubric.criteria.map((c) => (
                    <div
                      key={c.name}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>{c.name}</span>
                        <span className="font-mono text-blue-700">{c.score}/100</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-600">{c.commentPt}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-emerald-950">
                    <p className="font-bold">Pontos Fortes:</p>
                    <p className="mt-1">{writingRubric.strengthsPt}</p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 text-amber-950">
                    <p className="font-bold">Como Elevar sua Nota:</p>
                    <p className="mt-1">{writingRubric.improvementsPt}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 text-xs text-slate-800">
                  <p className="font-bold text-indigo-900">
                    ✨ Reescrita Banda C1/C2 (IA) / Modelo Oficial:
                  </p>
                  <p className="mt-1.5 whitespace-pre-line leading-relaxed italic">
                    {writingRubric.c1c2Rewrite}
                  </p>
                </div>
              </div>
            )}

            {/* Speaking Rubric Summary */}
            {includeSpeaking && speakingEval && (
              <div
                data-testid="speaking-analytical-rubric"
                className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-base font-extrabold text-slate-900">
                    <Mic className="h-4.5 w-4.5 text-emerald-600" />
                    <span>Avaliação Oral (Speaking · {speakingEval.wpm} WPM)</span>
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-mono text-xs font-extrabold text-emerald-900">
                    {speakingEval.overallPercent}%
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {speakingEval.criteria.map((c) => (
                    <div
                      key={c.name}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
                    >
                      <div className="flex justify-between text-xs font-bold">
                        <span>{c.name}</span>
                        <span className="font-mono text-emerald-700">{c.score}/100</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600">{c.commentPt}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-medium text-slate-700">{speakingEval.feedbackPt}</p>
              </div>
            )}

            {/* Official Reference Table */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
                <span>Tabela Oficial de Referência — {activeMeta.name}</span>
              </h3>
              <p className="mt-1 text-xs text-slate-500">{activeMeta.passingRulePt}</p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 pr-3">Pontuação / Faixa</th>
                      <th className="py-2 pr-3">CEFR</th>
                      <th className="py-2">Significado Oficial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeMeta.referenceTable.map((band) => {
                      const isMine = band.label === result.matchedBand.label;
                      return (
                        <tr
                          key={band.label}
                          className={isMine ? 'bg-blue-50 font-semibold' : ''}
                        >
                          <td className="py-2.5 pr-3 font-mono font-bold text-slate-900">
                            {band.label} {isMine && '← Você'}
                          </td>
                          <td className="py-2.5 pr-3 font-mono font-bold text-blue-700">
                            {band.cefr}
                          </td>
                          <td className="py-2.5 text-slate-700">{band.meaningPt}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Answer Key Review */}
            {(includeReading || includeListening || includeLangUse) && (
              <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Gabarito Comentado
                </h3>
                {activeExam.questions
                  .filter(
                    (q) =>
                      (q.section === 'reading' && includeReading) ||
                      (q.section === 'listening' && includeListening) ||
                      (q.section === 'language_use' && includeLangUse),
                  )
                  .map((q, idx) => {
                    const picked = answers[q.id];
                    const isOk = picked === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className={`rounded-2xl border p-4 text-xs ${
                          isOk
                            ? 'border-emerald-200 bg-emerald-50/40'
                            : 'border-rose-200 bg-rose-50/40'
                        }`}
                      >
                        <p className="font-bold text-slate-900">
                          {idx + 1}. {q.prompt}
                        </p>
                        <p className="mt-1 text-slate-700">
                          Sua resposta:{' '}
                          <strong>
                            {picked !== undefined ? q.options[picked] : 'Em branco'}
                          </strong>{' '}
                          · Correta:{' '}
                          <strong className="text-emerald-800">
                            {q.options[q.correctIndex]}
                          </strong>
                        </p>
                        <p className="mt-1 text-slate-600">{q.explanation}</p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        ) : (
          /* Active Exam Form with Section Navigation Tabs */
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  data-testid={`exam-section-tab-${tab.id}`}
                  onClick={() => setActiveSectionTab(tab.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                    activeSectionTab === tab.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {(activeSectionTab === 'reading' ||
              activeSectionTab === 'listening' ||
              activeSectionTab === 'language_use') &&
              visibleQuestions.map((q, idx) => {
                const playsUsed = audioPlays[q.id] ?? 0;
                const playsLimit = q.audioPlaysLimit ?? 2;
                return (
                  <div
                    key={q.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 uppercase">
                        {q.section === 'reading' && (
                          <BookOpen className="h-3 w-3 text-emerald-600" />
                        )}
                        {q.section === 'listening' && (
                          <Headphones className="h-3 w-3 text-blue-600" />
                        )}
                        {q.section === 'language_use' && (
                          <Sparkles className="h-3 w-3 text-violet-600" />
                        )}
                        {q.section === 'language_use' ? 'Use of Language' : q.section} · Q
                        {idx + 1}
                      </span>
                    </div>

                    {q.passageText && (
                      <div
                        dir={activeCourse.code === 'ar' ? 'rtl' : 'ltr'}
                        className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800"
                      >
                        {q.passageTitle && (
                          <p className="mb-1.5 font-display font-bold text-slate-900">
                            {q.passageTitle}
                          </p>
                        )}
                        <p>{q.passageText}</p>
                      </div>
                    )}

                    {q.audioText && (
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5">
                        <div>
                          <p className="text-xs font-bold text-blue-900">
                            Áudio da Questão (máximo {playsLimit} reproduções como na prova real)
                          </p>
                          <p className="text-[11px] text-blue-700">
                            Reproduções usadas: {playsUsed}/{playsLimit}
                          </p>
                        </div>
                        {playsUsed < playsLimit ? (
                          <DualAudioButtons
                            text={q.audioText}
                            languageCode={activeCourse.code}
                            size="sm"
                            onPlayStart={() =>
                              setAudioPlays((prev) => ({
                                ...prev,
                                [q.id]: (prev[q.id] ?? 0) + 1,
                              }))
                            }
                          />
                        ) : (
                          <span className="rounded-lg bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                            Limite atingido
                          </span>
                        )}
                      </div>
                    )}

                    <p
                      dir={activeCourse.code === 'ar' ? 'rtl' : 'ltr'}
                      className="mt-3 font-display text-sm font-bold text-slate-900"
                    >
                      {q.prompt}
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const selected = answers[q.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() =>
                              setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                            }
                            className={`rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition cursor-pointer ${
                              selected
                                ? 'border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-300'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}) {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            {/* Writing Section */}
            {activeSectionTab === 'writing' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 uppercase">
                  <FileText className="h-3 w-3" />
                  Writing · Produção Escrita
                </span>
                <p
                  dir={activeCourse.code === 'ar' ? 'rtl' : 'ltr'}
                  className="mt-2 font-display text-sm font-bold text-slate-900"
                >
                  {activeExam.writingTask.prompt}
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {activeExam.writingTask.rubricCriteria.map((crit, cIdx) => (
                    <li
                      key={cIdx}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                    >
                      ✓ {crit}
                    </li>
                  ))}
                </ul>
                <textarea
                  rows={6}
                  value={writingResponse}
                  onChange={(e) => setWritingResponse(e.target.value)}
                  dir={activeCourse.code === 'ar' ? 'rtl' : 'ltr'}
                  placeholder={`Escreva pelo menos ${activeExam.writingTask.minWords} palavras em ${activeCourse.namePt}...`}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Palavras: <strong>{wordCount}</strong> / mín.{' '}
                    {activeExam.writingTask.minWords}
                  </span>
                </div>
              </div>
            )}

            {/* Speaking Interview Section (AI + Teacher Grading) */}
            {activeSectionTab === 'speaking' && activeExam.speakingTask && (
              <div
                data-testid="exam-speaking-section"
                className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs"
              >
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900 uppercase">
                    <Mic className="h-3 w-3" />
                    {activeExam.speakingTask.title}
                  </span>
                  <p className="mt-1.5 text-xs text-slate-600">
                    {activeExam.speakingTask.instructionsPt}
                  </p>
                </div>

                {activeExam.speakingTask.parts.map((part) => {
                  const st = speakingParts[part.id];
                  const isRec = recordingPartId === part.id;
                  const isTranscribing = transcribingPartId === part.id;
                  const isSent = Boolean(speakingSentParts[part.id]);

                  return (
                    <div
                      key={part.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                          {part.partLabel}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">
                          Prep: {part.prepSeconds}s · Fala: {part.speakSeconds}s
                        </span>
                      </div>

                      <p
                        dir={activeCourse.code === 'ar' ? 'rtl' : 'ltr'}
                        className="font-display text-sm font-bold text-slate-900"
                      >
                        {part.prompt}
                      </p>

                      <ul className="flex flex-wrap gap-1.5">
                        {part.bulletPoints.map((bp, bi) => (
                          <li
                            key={bi}
                            className="rounded-lg bg-white px-2.5 py-1 text-[11px] text-slate-600 ring-1 ring-slate-200"
                          >
                            • {bp}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            void handleToggleSpeakRecord(part.id, part.speakSeconds)
                          }
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white cursor-pointer ${
                            isRec
                              ? 'animate-pulse bg-rose-600'
                              : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                        >
                          {isRec ? (
                            <>
                              <Square className="h-3.5 w-3.5 fill-white" />
                              <span>Parar Gravação</span>
                            </>
                          ) : (
                            <>
                              <Mic className="h-3.5 w-3.5" />
                              <span>Gravar Resposta (Whisper STT)</span>
                            </>
                          )}
                        </button>

                        {st?.audioId && onSubmitSpeaking && (
                          <button
                            type="button"
                            disabled={isSent}
                            onClick={() =>
                              handleSendSpeakingPartToTeacher(
                                part.id,
                                part.partLabel,
                                part.prompt,
                              )
                            }
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer ${
                              isSent
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                            }`}
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>
                              {isSent ? 'Enviado ao Professor ✓' : 'Enviar ao Professor'}
                            </span>
                          </button>
                        )}
                      </div>

                      {isTranscribing && (
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Transcrevendo sua fala via Whisper...</span>
                        </p>
                      )}

                      {st?.audioUrl && (
                        <audio controls src={st.audioUrl} className="h-8 w-full max-w-sm" />
                      )}

                      <textarea
                        rows={2}
                        value={st?.transcript ?? ''}
                        onChange={(e) =>
                          setSpeakingParts((prev) => ({
                            ...prev,
                            [part.id]: {
                              ...(prev[part.id] ?? { durationSec: 15 }),
                              transcript: e.target.value,
                            },
                          }))
                        }
                        placeholder="Transcrição automática Whisper (ou digite sua resposta oral para testar a rubrica IA)..."
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                data-testid="finish-exam-btn"
                onClick={() => finishExam(activeExam, activeMeta)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
              >
                <Award className="h-4 w-4" />
                <span>Finalizar &amp; Calcular Nota Oficial + Rubrica IA</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
          <Clock className="h-3.5 w-3.5" />
          Simulados Oficiais Completos · Reading, Listening, Use, Writing &amp; Speaking
        </span>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
          Simulados de Proficiência — {activeCourse.flag} {activeCourse.namePt}
        </h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Escolha praticar a <strong>Prova Completa</strong> (todas as habilidades juntas) ou filtre por uma categoria específica para treino focado.
        </p>
      </div>

      {/* Practice Category Filter */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xs">
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat.id}
            type="button"
            data-testid={`exam-category-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {examTypes.map((meta) => {
          const typeExams = exams.filter((e) => e.examTypeId === meta.id);
          return (
            <section
              key={meta.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-extrabold text-slate-900">
                    {meta.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {meta.officialOrg} · Escala: <strong>{meta.scaleLabel}</strong> ·{' '}
                    {meta.durationMinutes} min
                  </p>
                  <p className="mt-1 text-xs text-slate-600">{meta.passingRulePt}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {typeExams.map((sim) => {
                  const best = pastAttempts.find((a) => a.examId === sim.id);
                  return (
                    <div
                      key={sim.id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-blue-800">
                            Simulado {sim.simulationNumber}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-slate-500">
                            {sim.targetCefr}
                          </span>
                        </div>
                        <h3 className="mt-2 text-xs font-bold text-slate-900">{sim.title}</h3>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {sim.questions.length} questões + Writing + Speaking ({sim.speakingTask?.parts.length ?? 3} partes)
                        </p>
                        {best && (
                          <p className="mt-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-800">
                            Última nota: {best.officialScoreLabel}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        data-testid={`start-exam-${sim.id}`}
                        onClick={() => startSimulation(sim)}
                        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-blue-600 cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>
                          Iniciar{' '}
                          {selectedCategory === 'full'
                            ? `(${sim.durationMinutes} min)`
                            : `(${CATEGORY_OPTIONS.find((c) => c.id === selectedCategory)?.short})`}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

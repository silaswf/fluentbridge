import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Headphones,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Timer,
  XCircle,
} from 'lucide-react';
import { getExamTypeById, getExamTypesByLanguage } from '../data/exams/examCatalog';
import { getExamsByLanguage } from '../data/exams';
import type { ExamTypeMeta, MockExam } from '../types/exams';
import type { ExamAttemptRecord, LanguageCourse } from '../types/learning';
import { gradeMockExam, type GradedExamResult } from '../utils/examScoring';
import { DualAudioButtons } from './DualAudioButtons';

interface MockExamHubProps {
  activeCourse: LanguageCourse;
  pastAttempts: ExamAttemptRecord[];
  onCompleteExam: (attempt: ExamAttemptRecord) => void;
}

export function MockExamHub({
  activeCourse,
  pastAttempts,
  onCompleteExam,
}: MockExamHubProps) {
  const examTypes = useMemo(
    () => getExamTypesByLanguage(activeCourse.code),
    [activeCourse.code],
  );
  const exams = useMemo(
    () => getExamsByLanguage(activeCourse.code),
    [activeCourse.code],
  );

  const [activeExam, setActiveExam] = useState<MockExam | null>(null);
  const [activeMeta, setActiveMeta] = useState<ExamTypeMeta | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [writingResponse, setWritingResponse] = useState('');
  const [audioPlays, setAudioPlays] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState<GradedExamResult | null>(null);

  const finishExam = (examToGrade: MockExam, metaToGrade: ExamTypeMeta) => {
    const graded = gradeMockExam(examToGrade, metaToGrade, answers, writingResponse);
    setResult(graded);
    onCompleteExam({
      id: `attempt-${examToGrade.id}-${Date.now()}`,
      examId: examToGrade.id,
      examTypeId: metaToGrade.id,
      languageCode: activeCourse.code,
      officialScoreLabel: graded.officialLabel,
      rawPercent: graded.rawPercent,
      passed: graded.passed,
      sectionScores: {
        reading: graded.sectionBreakdown.reading.percent,
        listening: graded.sectionBreakdown.listening.percent,
        language_use: graded.sectionBreakdown.language_use.percent,
        writing: graded.sectionBreakdown.writing.percent,
      },
      completedAt: new Date().toISOString().slice(0, 10),
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

  const startSimulation = (exam: MockExam) => {
    const meta = getExamTypeById(exam.examTypeId) ?? examTypes[0];
    if (!meta) return;
    setActiveExam(exam);
    setActiveMeta(meta);
    setAnswers({});
    setWritingResponse('');
    setAudioPlays({});
    setResult(null);
    setSecondsLeft(exam.durationMinutes * 60);
  };

  const formatTimer = (secs: number) => {
    const mm = Math.floor(secs / 60);
    const ss = secs % 60;
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };

  if (activeExam && activeMeta) {
    const wordCount = writingResponse.trim() ? writingResponse.trim().split(/\s+/).length : 0;

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Sticky Exam Timer Bar */}
        <div className="sticky top-14 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur-xs lg:top-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
              {activeMeta.name} · Simulado {activeExam.simulationNumber}/4
            </p>
            <h2 className="font-display text-base font-extrabold text-slate-900">
              {activeExam.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!result && (
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

        {/* Result Screen with Official Scale & Reference Table */}
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
                    {result.passed ? 'Desempenho Aprovado / Competente' : 'Abaixo da Nota de Corte'}
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

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(['reading', 'listening', 'language_use', 'writing'] as const).map((sec) => (
                  <div key={sec} className="rounded-2xl bg-white p-3 text-center shadow-2xs">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">
                      {sec === 'language_use' ? 'Use of Language' : sec}
                    </p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-slate-900">
                      {result.sectionBreakdown[sec].percent}%
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-white p-4 text-xs text-slate-700">
                <p className="font-bold text-slate-900">Avaliação da Redação (Writing):</p>
                <p className="mt-1">{result.writingFeedbackPt}</p>
                <p className="mt-2 font-bold text-emerald-800">Modelo de Referência Oficial:</p>
                <p className="mt-0.5 italic text-slate-600">{activeExam.writingTask.modelAnswer}</p>
              </div>
            </div>

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
                        <tr key={band.label} className={isMine ? 'bg-blue-50 font-semibold' : ''}>
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
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5">
              <h3 className="font-display text-base font-bold text-slate-900">
                Gabarito Comentado
              </h3>
              {activeExam.questions.map((q, idx) => {
                const picked = answers[q.id];
                const isOk = picked === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-4 text-xs ${
                      isOk ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'
                    }`}
                  >
                    <p className="font-bold text-slate-900">
                      {idx + 1}. {q.prompt}
                    </p>
                    <p className="mt-1 text-slate-700">
                      Sua resposta: <strong>{picked !== undefined ? q.options[picked] : 'Em branco'}</strong> · Correta:{' '}
                      <strong className="text-emerald-800">{q.options[q.correctIndex]}</strong>
                    </p>
                    <p className="mt-1 text-slate-600">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Exam Form */
          <div className="space-y-5">
            {activeExam.questions.map((q, idx) => {
              const playsUsed = audioPlays[q.id] ?? 0;
              const playsLimit = q.audioPlaysLimit ?? 2;
              return (
                <div
                  key={q.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 uppercase">
                      {q.section === 'reading' && <BookOpen className="h-3 w-3 text-emerald-600" />}
                      {q.section === 'listening' && <Headphones className="h-3 w-3 text-blue-600" />}
                      {q.section === 'language_use' && <Sparkles className="h-3 w-3 text-violet-600" />}
                      {q.section === 'language_use' ? 'Use of Language' : q.section} · Q{idx + 1}
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
                rows={5}
                value={writingResponse}
                onChange={(e) => setWritingResponse(e.target.value)}
                dir={activeCourse.code === 'ar' ? 'rtl' : 'ltr'}
                placeholder={`Escreva pelo menos ${activeExam.writingTask.minWords} palavras em ${activeCourse.namePt}...`}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Palavras: <strong>{wordCount}</strong> / mín. {activeExam.writingTask.minWords}
                </span>
                <button
                  type="button"
                  data-testid="finish-exam-btn"
                  onClick={() => finishExam(activeExam, activeMeta)}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
                >
                  <Award className="h-4 w-4" />
                  <span>Finalizar &amp; Calcular Nota Oficial</span>
                </button>
              </div>
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
          Fase 11 · Simulados Cronometrados Oficiais
        </span>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
          Simulados de Proficiência — {activeCourse.flag} {activeCourse.namePt}
        </h1>
        <p className="mt-0.5 text-sm text-slate-600">
          4 simulados completos por exame oficial com cronômetro real, limite de áudio e pontuação na escala oficial com tabela de equivalência CEFR.
        </p>
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
                    {meta.officialOrg} · Escala: <strong>{meta.scaleLabel}</strong> · {meta.durationMinutes} min
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
                          {sim.questions.length} questões + Writing
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
                        <span>Iniciar ({sim.durationMinutes} min)</span>
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

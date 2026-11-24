import type { ExamBandReference, ExamTypeMeta, MockExam } from '../types/exams';

export interface GradedExamResult {
  officialScore: number;
  officialLabel: string;
  rawPercent: number;
  passed: boolean;
  matchedBand: ExamBandReference;
  sectionBreakdown: Record<'reading' | 'listening' | 'language_use' | 'writing', {
    correct: number;
    total: number;
    percent: number;
  }>;
  writingFeedbackPt: string;
}

function evaluateWritingSection(
  exam: MockExam,
  writingResponse: string,
): { percent: number; feedbackPt: string } {
  const clean = writingResponse.trim();
  if (!clean) {
    return {
      percent: 0,
      feedbackPt: 'Nenhuma resposta dissertativa enviada na seção de Writing (0%).',
    };
  }
  const words = clean.split(/\s+/).filter(Boolean);
  const wordRatio = Math.min(1, words.length / Math.max(10, exam.writingTask.minWords));
  const lower = clean.toLowerCase();
  const keywordHits = exam.writingTask.expectedKeywords.filter((kw) =>
    lower.includes(kw.toLowerCase()),
  ).length;
  const kwRatio =
    exam.writingTask.expectedKeywords.length === 0
      ? 1
      : Math.min(1, keywordHits / Math.max(1, Math.ceil(exam.writingTask.expectedKeywords.length * 0.6)));
  const hasSentencePunctuation = /[.!?؟。]/.test(clean) ? 1 : 0.7;

  const raw = Math.round((wordRatio * 0.55 + kwRatio * 0.35 + hasSentencePunctuation * 0.1) * 100);
  const percent = Math.max(15, Math.min(100, raw));

  const feedbackPt =
    percent >= 80
      ? `Excelente produção escrita (${words.length} palavras, ${keywordHits}/${exam.writingTask.expectedKeywords.length} estruturas-chave atendidas).`
      : percent >= 55
        ? `Boa resposta (${words.length} palavras), mas você pode enriquecer usando mais conectores e termos da rubrica (${exam.writingTask.expectedKeywords.slice(0, 3).join(', ')}).`
        : `Resposta curta ou incompleta (${words.length}/${exam.writingTask.minWords} palavras esperadas). Compare sua resposta com o modelo oficial abaixo.`;

  return { percent, feedbackPt };
}

function matchBand(table: ExamBandReference[], score: number): ExamBandReference {
  const found = table.find((b) => score >= b.minScore && score <= b.maxScore);
  return found ?? table[table.length - 1];
}

export function gradeMockExam(
  exam: MockExam,
  examMeta: ExamTypeMeta,
  answers: Record<string, number>,
  writingResponse: string,
): GradedExamResult {
  const sections: Array<'reading' | 'listening' | 'language_use'> = [
    'reading',
    'listening',
    'language_use',
  ];

  const breakdown = {
    reading: { correct: 0, total: 0, percent: 0 },
    listening: { correct: 0, total: 0, percent: 0 },
    language_use: { correct: 0, total: 0, percent: 0 },
    writing: { correct: 0, total: 100, percent: 0 },
  };

  let totalObjCorrect = 0;
  let totalObjCount = 0;

  for (const sec of sections) {
    const qs = exam.questions.filter((q) => q.section === sec);
    const correct = qs.filter((q) => answers[q.id] === q.correctIndex).length;
    const total = qs.length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 100;
    breakdown[sec] = { correct, total, percent };
    totalObjCorrect += correct;
    totalObjCount += total;
  }

  const writingEval = evaluateWritingSection(exam, writingResponse);
  breakdown.writing = {
    correct: writingEval.percent,
    total: 100,
    percent: writingEval.percent,
  };

  const objPercent = totalObjCount > 0 ? (totalObjCorrect / totalObjCount) * 100 : 0;
  const rawPercent = Math.round(objPercent * 0.75 + writingEval.percent * 0.25);

  let officialScore = rawPercent;
  let officialLabel = `${rawPercent}/100`;
  let passed = rawPercent >= 60;

  switch (examMeta.id) {
    case 'ielts': {
      const rawBand = (rawPercent / 100) * 9;
      officialScore = Math.max(1, Math.min(9, Math.round(rawBand * 2) / 2));
      officialLabel = `Band ${officialScore.toFixed(1)}`;
      passed = officialScore >= 6.0;
      break;
    }
    case 'toefl': {
      officialScore = Math.round((rawPercent / 100) * 120);
      officialLabel = `${officialScore} / 120`;
      passed = officialScore >= 72;
      break;
    }
    case 'cambridge': {
      officialScore = Math.round(120 + (rawPercent / 100) * 90);
      officialLabel = `${officialScore} pts`;
      passed = officialScore >= 160;
      break;
    }
    case 'dele': {
      officialScore = rawPercent;
      const g1 = Math.round((breakdown.reading.percent + breakdown.writing.percent) / 2);
      const g2 = Math.round((breakdown.listening.percent + breakdown.language_use.percent) / 2);
      passed = g1 >= 60 && g2 >= 60;
      officialLabel = `${officialScore}/100 (${passed ? 'APTO' : 'NO APTO'})`;
      break;
    }
    case 'siele': {
      officialScore = Math.round((rawPercent / 100) * 1000);
      officialLabel = `${officialScore} / 1000`;
      passed = officialScore >= 500;
      break;
    }
    case 'delf': {
      officialScore = rawPercent;
      const minSection = Math.min(
        breakdown.reading.percent * 0.25,
        breakdown.listening.percent * 0.25,
        breakdown.writing.percent * 0.25,
      );
      passed = officialScore >= 50 && minSection >= 5;
      officialLabel = `${officialScore}/100 (${passed ? 'ADMIS' : 'AJOURNÉ'})`;
      break;
    }
    case 'tcf': {
      officialScore = Math.round(100 + (rawPercent / 100) * 599);
      officialLabel = `${officialScore} / 699`;
      passed = officialScore >= 400;
      break;
    }
    case 'cils': {
      officialScore = rawPercent;
      officialLabel = `${officialScore} / 100`;
      passed = officialScore >= 55;
      break;
    }
    case 'celi': {
      officialScore = Math.round((rawPercent / 100) * 200);
      const grade =
        officialScore >= 170 ? 'A' : officialScore >= 150 ? 'B' : officialScore >= 120 ? 'C' : 'D/E';
      officialLabel = `${officialScore}/200 (Fascia ${grade})`;
      passed = officialScore >= 120;
      break;
    }
    case 'goethe': {
      officialScore = rawPercent;
      officialLabel = `${officialScore}/100`;
      passed = officialScore >= 60;
      break;
    }
    case 'testdaf': {
      const tdn = rawPercent >= 85 ? 5 : rawPercent >= 70 ? 4 : rawPercent >= 55 ? 3 : 2;
      officialScore = tdn;
      officialLabel = tdn >= 3 ? `TDN ${tdn}` : '< TDN 3';
      passed = tdn >= 4;
      break;
    }
    case 'torfl': {
      officialScore = rawPercent;
      officialLabel = `${officialScore}% (ТРКИ)`;
      passed = officialScore >= 66;
      break;
    }
    case 'jlpt': {
      officialScore = Math.round((rawPercent / 100) * 180);
      officialLabel = `${officialScore} / 180`;
      passed = officialScore >= 95;
      break;
    }
    case 'hsk': {
      officialScore = Math.round((rawPercent / 100) * 300);
      officialLabel = `${officialScore} / 300`;
      passed = officialScore >= 180;
      break;
    }
    case 'alpt': {
      officialScore = rawPercent;
      officialLabel = `${officialScore} / 100`;
      passed = officialScore >= 60;
      break;
    }
    case 'nt2': {
      officialScore = Math.round(500 + (rawPercent / 100) * 300);
      officialLabel = `${officialScore} / 800`;
      passed = officialScore >= 600;
      break;
    }
    case 'taaltoets': {
      officialScore = rawPercent;
      officialLabel = `${officialScore}%`;
      passed = officialScore >= 60;
      break;
    }
    case 'swedex': {
      officialScore = rawPercent;
      const grade = rawPercent >= 80 ? 'Väl godkänd' : rawPercent >= 60 ? 'Godkänd' : 'Underkänd';
      officialLabel = `${officialScore}% (${grade})`;
      passed = rawPercent >= 60;
      break;
    }
    default: {
      officialScore = rawPercent;
      officialLabel = `${officialScore}/100`;
      passed = officialScore >= 60;
    }
  }

  const matchedBand = matchBand(examMeta.referenceTable, officialScore);

  return {
    officialScore,
    officialLabel,
    rawPercent,
    passed,
    matchedBand,
    sectionBreakdown: breakdown,
    writingFeedbackPt: writingEval.feedbackPt,
  };
}

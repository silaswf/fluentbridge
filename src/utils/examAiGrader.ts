import {
  CLOUD_GEMINI_PROXY_TOKEN,
  DEFAULT_BACKEND_API_URL,
} from '../config/appConfig';
import type {
  AnalyticalWritingRubric,
  ExamTypeMeta,
  MockExam,
  SpeakingEvaluationResult,
} from '../types/exams';

async function fetchAiGraderJson<T>(
  prompt: string,
  apiKey?: string,
): Promise<T | null> {
  const cleanKey = (apiKey ?? '').trim();
  const useCloudProxy =
    cleanKey === CLOUD_GEMINI_PROXY_TOKEN || cleanKey.length === 0;
  const proxyEndpoint = `${DEFAULT_BACKEND_API_URL.replace(/\/+$/, '')}/api/gemini-tutor`;

  const bodyPayload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
  };

  const controller =
    typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId =
    controller !== null
      ? globalThis.setTimeout(() => controller.abort(), 9000)
      : undefined;

  try {
    let res: Response | null = null;
    if (useCloudProxy && DEFAULT_BACKEND_API_URL.trim().length > 0) {
      res = await fetch(proxyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
        signal: controller?.signal,
      });
    } else if (cleanKey.length > 10) {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(cleanKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
          signal: controller?.signal,
        },
      );
    }
    if (!res || !res.ok) return null;
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  } finally {
    if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
  }
}

function buildDeterministicWritingRubric(
  exam: MockExam,
  meta: ExamTypeMeta,
  writingResponse: string,
): AnalyticalWritingRubric {
  const clean = writingResponse.trim();
  if (!clean) {
    return {
      overallPercent: 0,
      estimatedBandLabel: 'Sem envio (0%)',
      criteria: [
        { name: 'Task Achievement', score: 0, commentPt: 'Nenhum texto enviado para avaliação.' },
        { name: 'Coherence & Cohesion', score: 0, commentPt: 'Sem parágrafos ou conectores avaliáveis.' },
        { name: 'Lexical Resource', score: 0, commentPt: 'Sem vocabulário produzido.' },
        { name: 'Grammatical Range & Accuracy', score: 0, commentPt: 'Sem estruturas gramaticais produzidas.' },
      ],
      strengthsPt: 'Envie uma resposta dissertativa para receber análise detalhada critério por critério.',
      improvementsPt: `Escreva pelo menos ${exam.writingTask.minWords} palavras atendendo aos pontos da rubrica.`,
      c1c2Rewrite: exam.writingTask.modelAnswer,
      usedAi: false,
    };
  }

  const words = clean.split(/\s+/).filter(Boolean);
  const wordRatio = Math.min(1, words.length / Math.max(15, exam.writingTask.minWords));
  const lower = clean.toLowerCase();
  const kwHits = exam.writingTask.expectedKeywords.filter((kw) =>
    lower.includes(kw.toLowerCase()),
  ).length;
  const kwRatio =
    exam.writingTask.expectedKeywords.length > 0
      ? Math.min(1, kwHits / Math.max(1, Math.ceil(exam.writingTask.expectedKeywords.length * 0.6)))
      : 1;

  const paragraphs = clean.split(/\n+/).filter((p) => p.trim().length > 0).length;
  const connectors = (
    clean.match(
      /\b(however|therefore|moreover|furthermore|although|despite|sin embargo|además|néanmoins|cependant|tuttavia|allerdings|desondanks|trots|однако|поэтому)\b/gi,
    ) ?? []
  ).length;
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^\p{L}]/gu, ''))).size;
  const lexicalDiversity = words.length > 0 ? uniqueWords / words.length : 0.4;
  const sentences = clean.split(/[.!?؟。]+/).filter((s) => s.trim().length > 3).length;

  const taskScore = Math.max(25, Math.min(98, Math.round((wordRatio * 0.6 + kwRatio * 0.4) * 100)));
  const coherenceScore = Math.max(
    25,
    Math.min(98, Math.round(45 + Math.min(3, paragraphs) * 10 + Math.min(4, connectors) * 6)),
  );
  const lexicalScore = Math.max(
    25,
    Math.min(98, Math.round(40 + lexicalDiversity * 52 + kwRatio * 12)),
  );
  const grammarScore = Math.max(
    25,
    Math.min(98, Math.round(48 + Math.min(6, sentences) * 6 + (wordRatio > 0.7 ? 12 : 0))),
  );
  const overallPercent = Math.round(
    (taskScore + coherenceScore + lexicalScore + grammarScore) / 4,
  );

  return {
    overallPercent,
    estimatedBandLabel: `${meta.name.split(' ')[0]} · ~${overallPercent}%`,
    criteria: [
      {
        name: 'Task Achievement',
        score: taskScore,
        commentPt: `Extensão de ${words.length}/${exam.writingTask.minWords} palavras e ${kwHits}/${exam.writingTask.expectedKeywords.length} termos-chave da proposta.`,
      },
      {
        name: 'Coherence & Cohesion',
        score: coherenceScore,
        commentPt: `${paragraphs} parágrafo(s) e ${connectors} conector(es) lógico(s) identificados.`,
      },
      {
        name: 'Lexical Resource',
        score: lexicalScore,
        commentPt: `Variedade lexical de ${Math.round(lexicalDiversity * 100)}% com ${uniqueWords} palavras distintas.`,
      },
      {
        name: 'Grammatical Range & Accuracy',
        score: grammarScore,
        commentPt: `${sentences} frase(s) estruturada(s); busque alternar orações subordinadas e inversões.`,
      },
    ],
    strengthsPt:
      overallPercent >= 70
        ? 'Boa cobertura do tema e organização clara de ideias ao longo da resposta.'
        : 'Você iniciou a argumentação no idioma-alvo mantendo foco no enunciado.',
    improvementsPt:
      overallPercent >= 80
        ? 'Para atingir faixa C2, refine colocações idiomáticas e varie conectores concessivos.'
        : `Amplie o desenvolvimento para >= ${exam.writingTask.minWords} palavras e inclua conectores como: ${exam.writingTask.expectedKeywords.slice(0, 3).join(', ')}.`,
    c1c2Rewrite: exam.writingTask.modelAnswer,
    usedAi: false,
  };
}

export async function gradeWritingWithRubric(
  exam: MockExam,
  meta: ExamTypeMeta,
  writingResponse: string,
  apiKey?: string,
): Promise<AnalyticalWritingRubric> {
  const baseline = buildDeterministicWritingRubric(exam, meta, writingResponse);
  if (writingResponse.trim().length < 25) {
    return baseline;
  }

  const prompt = `You are a certified ${meta.name} (${meta.officialOrg}) examiner.
Evaluate the candidate's response for this prompt:
"${exam.writingTask.prompt}"

Candidate's response (${exam.languageCode}):
"""
${writingResponse.trim().slice(0, 2800)}
"""

Return STRICT JSON ONLY with this exact schema:
{
  "overallPercent": 0-100 integer,
  "estimatedBandLabel": "string (e.g. 'IELTS Band 7.5' or 'DELF 21/25')",
  "criteria": [
    { "name": "Task Achievement", "score": 0-100, "commentPt": "concise Brazilian Portuguese comment" },
    { "name": "Coherence & Cohesion", "score": 0-100, "commentPt": "concise Brazilian Portuguese comment" },
    { "name": "Lexical Resource", "score": 0-100, "commentPt": "concise Brazilian Portuguese comment" },
    { "name": "Grammatical Range & Accuracy", "score": 0-100, "commentPt": "concise Brazilian Portuguese comment" }
  ],
  "strengthsPt": "2 sentences in Brazilian Portuguese",
  "improvementsPt": "2 concrete improvements in Brazilian Portuguese",
  "c1c2Rewrite": "Upgrade and rewrite the candidate's actual argument into Band C1/C2 level in ${exam.languageCode}"
}`;

  const ai = await fetchAiGraderJson<Omit<AnalyticalWritingRubric, 'usedAi'>>(
    prompt,
    apiKey,
  );
  if (!ai || !Array.isArray(ai.criteria) || ai.criteria.length === 0) {
    return baseline;
  }

  return {
    overallPercent: Math.max(0, Math.min(100, Math.round(ai.overallPercent ?? baseline.overallPercent))),
    estimatedBandLabel: ai.estimatedBandLabel || baseline.estimatedBandLabel,
    criteria: ai.criteria.slice(0, 4).map((c, i) => ({
      name: c.name || baseline.criteria[i]?.name || 'Criterion',
      score: Math.max(0, Math.min(100, Math.round(c.score ?? 65))),
      commentPt: c.commentPt || baseline.criteria[i]?.commentPt || '',
    })),
    strengthsPt: ai.strengthsPt || baseline.strengthsPt,
    improvementsPt: ai.improvementsPt || baseline.improvementsPt,
    c1c2Rewrite: ai.c1c2Rewrite || baseline.c1c2Rewrite,
    usedAi: true,
  };
}

export async function gradeSpeakingWithRubric(
  exam: MockExam,
  meta: ExamTypeMeta,
  partsResponses: Array<{ partLabel: string; transcript: string; durationSec: number }>,
  apiKey?: string,
): Promise<SpeakingEvaluationResult> {
  const joined = partsResponses
    .map((p) => p.transcript.trim())
    .filter(Boolean)
    .join(' ');
  const totalSec = Math.max(
    1,
    partsResponses.reduce((acc, p) => acc + Math.max(0, p.durationSec), 0),
  );

  if (!joined) {
    return {
      overallPercent: 0,
      wpm: 0,
      criteria: [
        { name: 'Fluency & Coherence', score: 0, commentPt: 'Nenhuma fala gravada ou transcrita.' },
        { name: 'Lexical Resource', score: 0, commentPt: 'Grave ao menos 1 parte oral.' },
        { name: 'Grammatical Range', score: 0, commentPt: 'Sem amostras faladas.' },
        { name: 'Pronunciation & Prosody', score: 0, commentPt: 'Sem áudio avaliado.' },
      ],
      feedbackPt: 'Você pode gravar suas respostas orais ou enviar ao Professor para avaliação completa.',
      usedAi: false,
    };
  }

  const words = joined.split(/\s+/).filter(Boolean);
  const wpm = Math.max(30, Math.min(220, Math.round((words.length / totalSec) * 60)));
  const uniqueRatio = words.length > 0 ? new Set(words.map((w) => w.toLowerCase())).size / words.length : 0.5;
  const fluency = Math.max(40, Math.min(96, Math.round(52 + Math.min(45, words.length) * 0.7 + (wpm >= 90 && wpm <= 165 ? 10 : 0))));
  const lexical = Math.max(40, Math.min(96, Math.round(45 + uniqueRatio * 50)));
  const grammar = Math.max(40, Math.min(95, Math.round(55 + Math.min(35, words.length) * 0.8)));
  const pronunciation = Math.max(45, Math.min(96, Math.round((fluency + 78) / 2)));
  const baselineOverall = Math.round((fluency + lexical + grammar + pronunciation) / 4);

  const baseline: SpeakingEvaluationResult = {
    overallPercent: baselineOverall,
    wpm,
    criteria: [
      { name: 'Fluency & Coherence', score: fluency, commentPt: `Ritmo estimado de ${wpm} WPM com ${words.length} palavras transcritas.` },
      { name: 'Lexical Resource', score: lexical, commentPt: `Diversidade vocabular de ${Math.round(uniqueRatio * 100)}%.` },
      { name: 'Grammatical Range', score: grammar, commentPt: 'Estruturas funcionais adequadas ao contexto da entrevista.' },
      { name: 'Pronunciation & Prosody', score: pronunciation, commentPt: 'Boa inteligibilidade na transcrição automática.' },
    ],
    feedbackPt: `Entrevista oral avaliada (${words.length} palavras, ${wpm} WPM). Envie também ao Professor para feedback humano de entonação.`,
    usedAi: false,
  };

  const prompt = `You are a certified ${meta.name} speaking examiner.
Grade these transcribed oral responses (${exam.languageCode}, ${wpm} WPM):
${partsResponses.map((p) => `[${p.partLabel}]: "${p.transcript}"`).join('\n')}

Return STRICT JSON ONLY:
{
  "overallPercent": 0-100,
  "criteria": [
    { "name": "Fluency & Coherence", "score": 0-100, "commentPt": "Portuguese comment" },
    { "name": "Lexical Resource", "score": 0-100, "commentPt": "Portuguese comment" },
    { "name": "Grammatical Range", "score": 0-100, "commentPt": "Portuguese comment" },
    { "name": "Pronunciation & Prosody", "score": 0-100, "commentPt": "Portuguese comment" }
  ],
  "feedbackPt": "2 concise sentences in Brazilian Portuguese"
}`;

  const ai = await fetchAiGraderJson<{
    overallPercent?: number;
    criteria?: SpeakingEvaluationResult['criteria'];
    feedbackPt?: string;
  }>(prompt, apiKey);

  if (!ai || !Array.isArray(ai.criteria) || ai.criteria.length === 0) {
    return baseline;
  }

  return {
    overallPercent: Math.max(0, Math.min(100, Math.round(ai.overallPercent ?? baselineOverall))),
    wpm,
    criteria: ai.criteria.slice(0, 4).map((c, idx) => ({
      name: c.name || baseline.criteria[idx]?.name || 'Criterion',
      score: Math.max(0, Math.min(100, Math.round(c.score ?? 70))),
      commentPt: c.commentPt || baseline.criteria[idx]?.commentPt || '',
    })),
    feedbackPt: ai.feedbackPt || baseline.feedbackPt,
    usedAi: true,
  };
}

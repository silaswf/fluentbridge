/**
 * @file src/utils/studyPlanEngine.ts
 * @description Gerador de plano de estudos semanal personalizado conforme meta, nível CEFR e exames por idioma.
 * @exports WeeklyStudyPlan, LEARNING_GOAL_OPTIONS, generateWeeklyStudyPlan
 */
import type { CEFRLevel, LanguageCode, LearningGoalType, Topic } from '../types/learning';

export interface WeeklyStudyPlan {
  goal: LearningGoalType;
  goalLabelPt: string;
  descriptionPt: string;
  weeklyTargetMinutes: number;
  recommendedUnitIds: string[];
  recommendedTopics: Topic[];
  recommendedExamHint: string;
}

export const LEARNING_GOAL_OPTIONS: Array<{
  id: LearningGoalType;
  labelPt: string;
  descPt: string;
  keywords: RegExp;
}> = [
  {
    id: 'travel',
    labelPt: 'Viagens & Sobrevivência',
    descPt: 'Aeroporto, hotel, restaurantes, transporte e emergências.',
    keywords: /travel|airport|hotel|food|restaurant|trip|viagem|aeroporto|restaurante|hotel|compras|transporte|saúde|emergência|direction|booking/i,
  },
  {
    id: 'career',
    labelPt: 'Carreira, Negócios & Tech',
    descPt: 'Entrevistas, reuniões, e-mails, negociações e tecnologia.',
    keywords: /work|business|career|tech|software|interview|meeting|email|negotiation|negócios|carreira|entrevista|reunião|tecnologia|liderança|present/i,
  },
  {
    id: 'exam',
    labelPt: 'Exames Oficiais & Imigração',
    descPt: 'CELPIP, IELTS, TOEFL, DELF, DELE, Goethe, JLPT, HSK.',
    keywords: /academic|argument|essay|debate|exam|ielts|toefl|celpip|cohesion|formal|writing|redação|contrato|privacy|legal/i,
  },
  {
    id: 'abroad',
    labelPt: 'Morar no Exterior',
    descPt: 'Aluguel, banco, médico, vizinhança, documentos e rotina.',
    keywords: /rent|housing|doctor|pharmacy|bank|neighbor|aluguel|médico|banco|morar|contrato|rotina|daily|supermarket/i,
  },
  {
    id: 'culture',
    labelPt: 'Cultura, Séries & Conversação',
    descPt: 'Gírias, expressões idiomáticas, cinema, música e dia a dia.',
    keywords: /idiom|slang|movie|culture|series|social|hobby|gíria|expressão|cultura|música|cinema|cafe|friends/i,
  },
];

const EXAM_HINT_BY_LANG: Record<LanguageCode, string> = {
  en: 'CELPIP General & IELTS Academic/General',
  es: 'DELE & SIELE',
  fr: 'DELF / DALF & TCF Canada',
  it: 'CILS & CELI',
  de: 'Goethe-Zertifikat & TestDaF',
  ru: 'TORFL (ТРКИ)',
  ja: 'JLPT N5–N1',
  zh: 'HSK 1–6',
  ar: 'ALPT & CIMA',
  nl: 'CNaVT & Staatsexamen NT2',
  af: 'Taalbond & Stellenbosch Prof.',
  sv: 'Swedex & TISUS',
  tr: 'TÖMER & YDS',
  he: 'YAEL & Ulpan',
  nb: 'Norskprøve & Bergenstesten',
  da: 'Prøve i Dansk 3 & Studieprøven',
  pt: 'CELPE-Bras (Brasil) & CIPLE/DEPLE (Portugal)',
};

export function generateWeeklyStudyPlan(
  goal: LearningGoalType,
  languageCode: LanguageCode,
  topics: Topic[],
  completedTopicIds: string[],
  dailyGoalMinutes: number,
  recommendedLevel?: CEFRLevel,
): WeeklyStudyPlan {
  const meta =
    LEARNING_GOAL_OPTIONS.find((g) => g.id === goal) ?? LEARNING_GOAL_OPTIONS[0];
  const completedSet = new Set(completedTopicIds);
  const pending = topics.filter((t) => !completedSet.has(t.id));

  const levelBoost = (t: Topic) =>
    recommendedLevel && t.level === recommendedLevel ? 2 : 0;

  const scored = pending
    .map((t) => {
      const text = `${t.titlePt} ${t.titleEn} ${t.subtitle}`;
      const matchScore = meta.keywords.test(text) ? 5 : 0;
      return { topic: t, score: matchScore + levelBoost(t) };
    })
    .sort((a, b) => b.score - a.score);

  const picked = scored.slice(0, 5).map((s) => s.topic);

  return {
    goal,
    goalLabelPt: meta.labelPt,
    descriptionPt: meta.descPt,
    weeklyTargetMinutes: Math.max(30, dailyGoalMinutes * 7),
    recommendedUnitIds: picked.map((t) => t.id),
    recommendedTopics: picked,
    recommendedExamHint: EXAM_HINT_BY_LANG[languageCode] ?? 'Simulados Oficiais',
  };
}

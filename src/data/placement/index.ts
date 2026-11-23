import type { CEFRLevel, LanguageCode } from '../../types/learning';
import type { PlacementQuestion } from '../../utils/placementEngine';
import { PLACEMENT_QUESTIONS_DE } from './placementDe';
import { PLACEMENT_QUESTIONS_EN } from './placementEn';
import { PLACEMENT_QUESTIONS_ES } from './placementEs';
import { PLACEMENT_QUESTIONS_FR } from './placementFr';
import { PLACEMENT_QUESTIONS_IT } from './placementIt';
import { PLACEMENT_QUESTIONS_RU } from './placementRu';
import { PLACEMENT_QUESTIONS_JA } from './placementJa';
import { PLACEMENT_QUESTIONS_ZH } from './placementZh';

export const ALL_PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  ...PLACEMENT_QUESTIONS_EN,
  ...PLACEMENT_QUESTIONS_ES,
  ...PLACEMENT_QUESTIONS_FR,
  ...PLACEMENT_QUESTIONS_IT,
  ...PLACEMENT_QUESTIONS_DE,
  ...PLACEMENT_QUESTIONS_RU,
  ...PLACEMENT_QUESTIONS_JA,
  ...PLACEMENT_QUESTIONS_ZH,
];

export function getPlacementBankByLanguage(
  languageCode: LanguageCode = 'en',
): PlacementQuestion[] {
  const bank = ALL_PLACEMENT_QUESTIONS.filter(
    (q) => q.languageCode === languageCode,
  );
  return bank.length > 0 ? bank : PLACEMENT_QUESTIONS_EN;
}

export interface PlacementUiStrings {
  title: string;
  adaptiveBadge: string;
  questionProgress: (current: number, total: number) => string;
  currentLevelProbe: (level: CEFRLevel) => string;
  nextQuestionBtn: string;
  finishTestBtn: string;
  completedBadge: string;
  recommendedHeading: (level: CEFRLevel) => string;
  summarySubtitle: (correct: number, total: number, score: number) => string;
  xpEarnedText: string;
  breakdownTitle: string;
  applyResultBtn: (level: CEFRLevel) => string;
  closeAria: string;
}

const UI_STRINGS_BY_LANG: Record<LanguageCode, PlacementUiStrings> = {
  en: {
    title: 'Adaptive English Placement Test (CEFR A1–C1)',
    adaptiveBadge: 'Adaptive CAT · 40-Question Bank',
    questionProgress: (c, t) => `Question ${c} of ${t}`,
    currentLevelProbe: (lvl) => `Probing Level ${lvl}`,
    nextQuestionBtn: 'Confirm & Next Question',
    finishTestBtn: 'Calculate My CEFR Level',
    completedBadge: 'Adaptive Diagnosis Complete',
    recommendedHeading: (lvl) => `Recommended Level: CEFR ${lvl}`,
    summarySubtitle: (c, t, s) =>
      `You answered ${c} of ${t} adaptive questions correctly (ability index ${s}/5.0).`,
    xpEarnedText: '+40 XP earned for completing your placement!',
    breakdownTitle: 'Performance by CEFR Level & Key Notes',
    applyResultBtn: (lvl) => `Start my ${lvl} English units`,
    closeAria: 'Close placement test',
  },
  es: {
    title: 'Prueba Adaptativa de Nivel de Español (MCER A1–C1)',
    adaptiveBadge: 'Adaptativo · Banco de 40 Preguntas',
    questionProgress: (c, t) => `Pregunta ${c} de ${t}`,
    currentLevelProbe: (lvl) => `Evaluando Nivel ${lvl}`,
    nextQuestionBtn: 'Confirmar y siguiente pregunta',
    finishTestBtn: 'Calcular mi nivel MCER',
    completedBadge: 'Diagnóstico adaptativo completado',
    recommendedHeading: (lvl) => `Nivel Recomendado: MCER ${lvl}`,
    summarySubtitle: (c, t, s) =>
      `Acertaste ${c} de ${t} preguntas adaptativas (índice de competencia ${s}/5.0).`,
    xpEarnedText: '¡+40 XP ganados por completar tu nivelación!',
    breakdownTitle: 'Desglose por nivel y notas gramaticales',
    applyResultBtn: (lvl) => `Ir a mis unidades de nivel ${lvl}`,
    closeAria: 'Cerrar prueba de nivel',
  },
  fr: {
    title: 'Test de Niveau Adaptatif de Français (CECRL A1–C1)',
    adaptiveBadge: 'Adaptatif · Banque de 40 Questions',
    questionProgress: (c, t) => `Question ${c} sur ${t}`,
    currentLevelProbe: (lvl) => `Évaluation Niveau ${lvl}`,
    nextQuestionBtn: 'Valider et question suivante',
    finishTestBtn: 'Calculer mon niveau CECRL',
    completedBadge: 'Diagnostic adaptatif terminé',
    recommendedHeading: (lvl) => `Niveau Recommandé : CECRL ${lvl}`,
    summarySubtitle: (c, t, s) =>
      `Vous avez réussi ${c} questions adaptatives sur ${t} (indice de maîtrise ${s}/5.0).`,
    xpEarnedText: '+40 XP gagnés pour votre test de positionnement !',
    breakdownTitle: 'Bilan par niveau et rappels clés',
    applyResultBtn: (lvl) => `Accéder à mes unités de niveau ${lvl}`,
    closeAria: 'Fermer le test',
  },
  it: {
    title: 'Test Adattivo di Livello d’Italiano (QCER A1–C1)',
    adaptiveBadge: 'Adattivo · Banca di 40 Domande',
    questionProgress: (c, t) => `Domanda ${c} di ${t}`,
    currentLevelProbe: (lvl) => `Valutazione Livello ${lvl}`,
    nextQuestionBtn: 'Conferma e prossima domanda',
    finishTestBtn: 'Calcola il mio livello QCER',
    completedBadge: 'Diagnosi adattiva completata',
    recommendedHeading: (lvl) => `Livello Consigliato: QCER ${lvl}`,
    summarySubtitle: (c, t, s) =>
      `Hai risposto correttamente a ${c} domande adattive su ${t} (indice di competenza ${s}/5.0).`,
    xpEarnedText: '+40 XP ottenuti con il test di livello!',
    breakdownTitle: 'Riepilogo per livello e note grammaticali',
    applyResultBtn: (lvl) => `Vai alle mie unità di livello ${lvl}`,
    closeAria: 'Chiudi il test',
  },
  de: {
    title: 'Adaptiver Einstufungstest Deutsch (GER A1–C1)',
    adaptiveBadge: 'Adaptiv · 40-Fragen-Datenbank',
    questionProgress: (c, t) => `Frage ${c} von ${t}`,
    currentLevelProbe: (lvl) => `Prüfungsstufe ${lvl}`,
    nextQuestionBtn: 'Bestätigen & nächste Frage',
    finishTestBtn: 'Mein GER-Niveau berechnen',
    completedBadge: 'Adaptive Einstufung abgeschlossen',
    recommendedHeading: (lvl) => `Empfohlenes Niveau: GER ${lvl}`,
    summarySubtitle: (c, t, s) =>
      `Du hast ${c} von ${t} adaptiven Fragen richtig beantwortet (Kompetenzindex ${s}/5.0).`,
    xpEarnedText: '+40 XP für deinen Einstufungstest erhalten!',
    breakdownTitle: 'Auswertung nach GER-Stufe & Grammatikhinweise',
    applyResultBtn: (lvl) => `Zu meinen ${lvl}-Einheiten wechseln`,
    closeAria: 'Test schließen',
  },
  ru: {
    title: 'Адаптивный тест уровня русского языка (ТРКИ / CEFR A1–C1)',
    adaptiveBadge: 'Адаптивный CAT · Банк из 40 вопросов',
    questionProgress: (c, t) => `Вопрос ${c} из ${t}`,
    currentLevelProbe: (lvl) => `Проверка уровня ${lvl}`,
    nextQuestionBtn: 'Подтвердить и далее',
    finishTestBtn: 'Рассчитать мой уровень CEFR',
    completedBadge: 'Адаптивная диагностика завершена',
    recommendedHeading: (lvl) => `Рекомендуемый уровень: CEFR ${lvl}`,
    summarySubtitle: (c, t, s) =>
      `Вы правильно ответили на ${c} из ${t} адаптивных вопросов (индекс владения ${s}/5.0).`,
    xpEarnedText: '+40 XP за прохождение адаптивного теста!',
    breakdownTitle: 'Результаты по уровням и грамматические заметки',
    applyResultBtn: (lvl) => `Перейти к урокам уровня ${lvl}`,
    closeAria: 'Закрыть тест',
  },
  ja: {
    title: '適応型日本語レベル診断テスト (CEFR A1–C1)',
    adaptiveBadge: '適応型 CAT · 40問データベース',
    questionProgress: (c, t) => `第 ${c} 問 / 全 ${t} 問`,
    currentLevelProbe: (lvl) => `レベル ${lvl} を測定中`,
    nextQuestionBtn: '確定して次の問題へ',
    finishTestBtn: 'CEFRレベルを判定する',
    completedBadge: '適応型レベル診断が完了しました',
    recommendedHeading: (lvl) => `推奨レベル：CEFR ${lvl}`,
    summarySubtitle: (c, t, s) =>
      `${t}問中 ${c}問に正解しました（総合能力指数 ${s}/5.0）。`,
    xpEarnedText: 'レベル診断完了で +40 XP を獲得しました！',
    breakdownTitle: 'レベル別スコアと文法ポイント',
    applyResultBtn: (lvl) => `${lvl} レベルのユニットを始める`,
    closeAria: 'テストを閉じる',
  },
  zh: {
    title: '自适应汉语水平测试 (CEFR A1–C1)',
    adaptiveBadge: '自适应 CAT · 40题题库',
    questionProgress: (c, t) => `第 ${c} 题 / 共 ${t} 题`,
    currentLevelProbe: (lvl) => `正在评估 ${lvl} 级别`,
    nextQuestionBtn: '确认并进入下一题',
    finishTestBtn: '计算我的 CEFR 水平',
    completedBadge: '自适应水平评估已完成',
    recommendedHeading: (lvl) => `推荐等级：CEFR ${lvl}`,
    summarySubtitle: (c, t, s) =>
      `你在 ${t} 道自适应题目中答对了 ${c} 题（能力指数 ${s}/5.0）。`,
    xpEarnedText: '完成水平测试，获得 +40 XP！',
    breakdownTitle: '各等级表现与语法要点',
    applyResultBtn: (lvl) => `开始我的 ${lvl} 级别课程`,
    closeAria: '关闭测试',
  },
};

export function getPlacementUiStrings(
  languageCode: LanguageCode = 'en',
): PlacementUiStrings {
  return UI_STRINGS_BY_LANG[languageCode] ?? UI_STRINGS_BY_LANG.en;
}

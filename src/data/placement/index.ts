import type { CEFRLevel, LanguageCode } from '../../types/learning';
import type { PlacementQuestion } from '../../utils/placementEngine';
import { PLACEMENT_QUESTIONS_DE } from './placementDe';
import { PLACEMENT_QUESTIONS_EN } from './placementEn';
import { PLACEMENT_QUESTIONS_ES } from './placementEs';
import { PLACEMENT_QUESTIONS_FR } from './placementFr';
import { PLACEMENT_QUESTIONS_IT } from './placementIt';

export const ALL_PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  ...PLACEMENT_QUESTIONS_EN,
  ...PLACEMENT_QUESTIONS_ES,
  ...PLACEMENT_QUESTIONS_FR,
  ...PLACEMENT_QUESTIONS_IT,
  ...PLACEMENT_QUESTIONS_DE,
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
};

export function getPlacementUiStrings(
  languageCode: LanguageCode = 'en',
): PlacementUiStrings {
  return UI_STRINGS_BY_LANG[languageCode] ?? UI_STRINGS_BY_LANG.en;
}

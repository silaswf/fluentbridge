/**
 * @file src/utils/courseTranslator.ts
 * @description Motor do Tradutor Bidirecional por Curso: resolve par de idiomas (PT<->Alvo ou EN<->PT), chama /api/translate e faz fallback offline.
 * @exports TranslatorRegister, TranslatorPairInfo, TranslatorAlternative, TranslatorVocabToken, TranslationResult, getTranslatorLanguagePair, loadTranslatorHistory, saveTranslatorHistory (+2)
 */
import { DEFAULT_BACKEND_API_URL } from '../config/appConfig';
import { IN_LESSON_LEXICON } from '../data/inLessonLexicon';
import type { LanguageCode, VocabCard } from '../types/learning';

export type TranslatorRegister = 'natural' | 'formal' | 'informal';

export interface TranslatorPairInfo {
  nativeCode: 'pt' | 'en';
  nativeLabel: string;
  targetCode: LanguageCode;
  targetLabel: string;
  explanationLang: 'pt' | 'en';
}

export interface TranslatorAlternative {
  label: string;
  text: string;
}

export interface TranslatorVocabToken {
  word: string;
  translation: string;
  ipa: string;
  note: string;
}

export interface TranslationResult {
  id: string;
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  courseCode: LanguageCode;
  translatedText: string;
  pronunciationIpa: string;
  literalNote: string;
  alternatives: TranslatorAlternative[];
  vocabulary: TranslatorVocabToken[];
  source: 'gemini-cloud' | 'offline-lexicon';
  timestamp: number;
}

const HISTORY_KEY = 'fb_translator_history_v1';

const COURSE_LABELS_PT: Record<LanguageCode, string> = {
  en: 'Inglês',
  es: 'Espanhol',
  fr: 'Francês',
  it: 'Italiano',
  de: 'Alemão',
  ru: 'Russo',
  ja: 'Japonês',
  zh: 'Chinês (Mandarim)',
  ar: 'Árabe',
  nl: 'Holandês',
  af: 'Africâner',
  sv: 'Sueco',
  tr: 'Turco',
  he: 'Hebraico',
  nb: 'Norueguês',
  da: 'Dinamarquês',
  pt: 'Português (BR/PT)',
};

export function getTranslatorLanguagePair(courseCode: LanguageCode): TranslatorPairInfo {
  if (courseCode === 'pt') {
    return {
      nativeCode: 'en',
      nativeLabel: 'English',
      targetCode: 'pt',
      targetLabel: 'Português (BR/PT)',
      explanationLang: 'en',
    };
  }
  return {
    nativeCode: 'pt',
    nativeLabel: 'Português',
    targetCode: courseCode,
    targetLabel: COURSE_LABELS_PT[courseCode] ?? courseCode.toUpperCase(),
    explanationLang: 'pt',
  };
}

export function loadTranslatorHistory(): TranslationResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function saveTranslatorHistory(items: TranslationResult[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 20)));
  } catch {
    // Ignore storage quota errors
  }
}

export function buildOfflineTranslation(params: {
  text: string;
  sourceLang: string;
  targetLang: string;
  courseCode: LanguageCode;
  courseVocab?: VocabCard[];
}): TranslationResult {
  const clean = params.text.trim();
  const lower = clean.toLowerCase();
  const isTargetOut = params.targetLang === params.courseCode;
  const lexicon = IN_LESSON_LEXICON[params.courseCode] ?? [];
  const vocabPool = params.courseVocab ?? [];

  // 1. Exact or partial match in course vocabulary / lexicon
  const matchedCards: TranslatorVocabToken[] = [];
  let directTranslation = '';
  let directIpa = '';

  for (const card of vocabPool) {
    const w = card.word.trim();
    const tr = card.translation.trim();
    if (!w || !tr) continue;
    const hit = isTargetOut
      ? tr.toLowerCase() === lower || lower.includes(tr.toLowerCase())
      : w.toLowerCase() === lower || lower.includes(w.toLowerCase());
    if (hit) {
      if (!directTranslation && (tr.toLowerCase() === lower || w.toLowerCase() === lower)) {
        directTranslation = isTargetOut ? w : tr;
        directIpa = card.ipa;
      }
      if (matchedCards.length < 5 && !matchedCards.some((m) => m.word === w)) {
        matchedCards.push({
          word: w,
          translation: tr,
          ipa: card.ipa,
          note: card.exampleEn,
        });
      }
    }
  }

  for (const lex of lexicon) {
    const hit = isTargetOut
      ? lex.translation.toLowerCase() === lower || lower.includes(lex.translation.toLowerCase())
      : lex.word.toLowerCase() === lower || lower.includes(lex.word.toLowerCase());
    if (hit) {
      if (!directTranslation && (lex.translation.toLowerCase() === lower || lex.word.toLowerCase() === lower)) {
        directTranslation = isTargetOut ? lex.word : lex.translation;
        directIpa = lex.ipa;
      }
      if (matchedCards.length < 5 && !matchedCards.some((m) => m.word === lex.word)) {
        matchedCards.push({
          word: lex.word,
          translation: lex.translation,
          ipa: lex.ipa,
          note: lex.exampleEn,
        });
      }
    }
  }

  const pair = getTranslatorLanguagePair(params.courseCode);
  const translatedText =
    directTranslation ||
    (matchedCards.length > 0
      ? matchedCards.map((c) => (isTargetOut ? c.word : c.translation)).join(' · ')
      : clean);

  const literalNote =
    pair.explanationLang === 'en'
      ? directTranslation
        ? 'Matched directly from the local Portuguese course glossary (offline mode).'
        : 'Offline glossary mode: connect to the internet for full contextual AI translation.'
      : directTranslation
        ? 'Correspondência exata encontrada no glossário local do curso (modo offline).'
        : 'Modo offline: conecte-se à internet para tradução contextual completa via IA.';

  return {
    id: `tr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sourceText: clean,
    sourceLang: params.sourceLang,
    targetLang: params.targetLang,
    courseCode: params.courseCode,
    translatedText,
    pronunciationIpa: directIpa,
    literalNote,
    alternatives:
      matchedCards.length > 0
        ? matchedCards.slice(0, 2).map((c) => ({
            label: isTargetOut ? 'Glossário' : 'Equivalente',
            text: isTargetOut ? `${c.word} — ${c.note}` : c.translation,
          }))
        : [],
    vocabulary: matchedCards,
    source: 'offline-lexicon',
    timestamp: Date.now(),
  };
}

export async function translateCourseText(params: {
  text: string;
  sourceLang: string;
  targetLang: string;
  courseCode: LanguageCode;
  register?: TranslatorRegister;
  courseVocab?: VocabCard[];
}): Promise<TranslationResult> {
  const clean = params.text.trim();
  if (!clean) {
    throw new Error('Digite um texto ou frase para traduzir.');
  }
  const pair = getTranslatorLanguagePair(params.courseCode);
  const apiBase = DEFAULT_BACKEND_API_URL.replace(/\/+$/, '');
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 10000) : null;

  try {
    const res = await fetch(`${apiBase}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: clean,
        sourceLang: params.sourceLang,
        targetLang: params.targetLang,
        courseLang: params.courseCode,
        register: params.register ?? 'natural',
        explanationLang: pair.explanationLang,
      }),
      signal: controller?.signal,
    });
    if (res.ok) {
      const data = (await res.json()) as {
        ok?: boolean;
        translatedText?: string;
        pronunciationIpa?: string;
        literalNote?: string;
        alternatives?: TranslatorAlternative[];
        vocabulary?: TranslatorVocabToken[];
      };
      if (data.ok && data.translatedText) {
        return {
          id: `tr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          sourceText: clean,
          sourceLang: params.sourceLang,
          targetLang: params.targetLang,
          courseCode: params.courseCode,
          translatedText: data.translatedText,
          pronunciationIpa: data.pronunciationIpa ?? '',
          literalNote: data.literalNote ?? '',
          alternatives: Array.isArray(data.alternatives) ? data.alternatives : [],
          vocabulary: Array.isArray(data.vocabulary) ? data.vocabulary : [],
          source: 'gemini-cloud',
          timestamp: Date.now(),
        };
      }
    }
  } catch {
    // Fallback offline
  } finally {
    if (timer) clearTimeout(timer);
  }

  return buildOfflineTranslation(params);
}

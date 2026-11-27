/**
 * @file src/utils/__tests__/v7Features.test.ts
 * @description Suíte de testes unitários Vitest validando v7Features.
 */
import { describe, expect, it } from 'vitest';
import { buildClozePrompt } from '../srsEngine';
import { buildPedagogicalMemoryContext } from '../tutorMemory';
import { generateWeeklyStudyPlan } from '../studyPlanEngine';
import {
  detectPitchHz,
  getJapanesePitchContour,
  getMandarinToneContour,
} from '../pitchDetector';
import { tUi } from '../i18n';
import { mergeLoadedLanguageVocab } from '../storage';
import { getGrammarDrillsByLanguage } from '../../data/grammarDrills';
import { getGradedReaderByLanguage } from '../../data/gradedReaders';
import type { LanguageCode, Topic, VocabCard } from '../../types/learning';

const ALL_LANGUAGES: LanguageCode[] = [
  'en',
  'es',
  'fr',
  'it',
  'de',
  'ru',
  'ja',
  'zh',
  'ar',
  'nl',
  'af',
  'sv',
];

describe('FluentBridge v7.0.0 features', () => {
  it('buildClozePrompt masks the target word cleanly', () => {
    const res = buildClozePrompt(
      'We identified a major bottleneck in the deployment pipeline.',
      'bottleneck',
    );
    expect(res.answer).toBe('bottleneck');
    expect(res.maskedSentence).toContain('_____');
    expect(res.maskedSentence.toLowerCase()).not.toContain('bottleneck');
  });

  it('buildPedagogicalMemoryContext summarizes weak words and mistakes', () => {
    const vocab: VocabCard[] = [
      {
        id: 'v1',
        topicId: 'en-t1',
        languageCode: 'en',
        word: 'negotiate',
        translation: 'negociar',
        ipa: '',
        category: 'Business',
        exampleEn: 'Let us negotiate the terms.',
        examplePt: 'Vamos negociar os termos.',
        strength: 'weak',
        nextReviewAt: '2026-11-24',
        intervalDays: 1,
        easeFactor: 2.5,
        reviewCount: 1,
      },
    ];
    const mem = buildPedagogicalMemoryContext('en', vocab, [
      {
        id: 'm1',
        languageCode: 'en',
        topicId: 'en-t1',
        topicTitle: 'Intro',
        skill: 'grammar',
        prompt: 'I have 25 years',
        studentAnswer: 'I have 25 years',
        expectedAnswer: 'I am 25 years old',
        explanation: 'Use verb to be for age.',
        createdAt: '2026-11-24',
        reviewCount: 1,
        resolved: false,
      },
    ]);
    expect(mem.weakWords).toContain('negotiate');
    expect(mem.recentMistakes.length).toBe(1);
    expect(mem.promptInstruction).toContain('negotiate');
  });

  it('generateWeeklyStudyPlan builds a 7-day plan matching goal and daily minutes', () => {
    const mockTopics: Topic[] = [
      {
        id: 'en-t1',
        languageCode: 'en',
        level: 'A2',
        titlePt: 'Aeroporto e Viagem',
        titleEn: 'Airport and Travel',
        subtitle: 'Check-in, hotel and flights',
        estimatedMinutes: 15,
        icon: '✈️',
        color: '#2563EB',
        topicTipsSummary: [],
        steps: [],
      },
      {
        id: 'en-t2',
        languageCode: 'en',
        level: 'A2',
        titlePt: 'Restaurante',
        titleEn: 'Restaurant',
        subtitle: 'Ordering food',
        estimatedMinutes: 15,
        icon: '🍽️',
        color: '#10B981',
        topicTipsSummary: [],
        steps: [],
      },
    ];
    const plan = generateWeeklyStudyPlan('travel', 'en', mockTopics, [], 20, 'A2');
    expect(plan.goal).toBe('travel');
    expect(plan.weeklyTargetMinutes).toBe(140);
    expect(plan.recommendedTopics.length).toBeGreaterThan(0);
  });

  it('detectPitchHz estimates a 220Hz sine wave accurately and returns tone/pitch contours', () => {
    const sampleRate = 16000;
    const buf = new Float32Array(1024);
    for (let i = 0; i < buf.length; i++) {
      buf[i] = 0.5 * Math.sin((2 * Math.PI * 220 * i) / sampleRate);
    }
    const hz = detectPitchHz(buf, sampleRate);
    expect(hz).not.toBeNull();
    expect(Math.abs((hz ?? 0) - 220)).toBeLessThan(10);

    expect(getMandarinToneContour(3).points.length).toBeGreaterThan(2);
    expect(getJapanesePitchContour('heiban').points.length).toBeGreaterThan(2);
  });

  it('provides 12 grammar drills and 5 graded reader chapters for every language', () => {
    for (const lang of ALL_LANGUAGES) {
      const drills = getGrammarDrillsByLanguage(lang);
      expect(drills.length).toBeGreaterThanOrEqual(12);

      const reader = getGradedReaderByLanguage(lang);
      expect(reader).toBeDefined();
      expect(reader?.chapters.length).toBe(5);
    }
  });

  it('mergeLoadedLanguageVocab preserves SRS progress across languages', () => {
    const existing: VocabCard[] = [
      {
        id: 'en-1',
        topicId: 'en-t1',
        languageCode: 'en',
        word: 'hello',
        translation: 'olá',
        ipa: '',
        category: 'Greetings',
        exampleEn: 'Hello!',
        examplePt: 'Olá!',
        strength: 'mastered',
        nextReviewAt: '2026-12-08',
        intervalDays: 14,
        easeFactor: 2.8,
        reviewCount: 6,
      },
    ];
    const incomingEn: VocabCard[] = [
      {
        ...existing[0],
        strength: 'weak',
        reviewCount: 0,
      },
    ];
    const incomingEs: VocabCard[] = [
      {
        id: 'es-1',
        topicId: 'es-t1',
        languageCode: 'es',
        word: 'hola',
        translation: 'olá',
        ipa: '',
        category: 'Saludos',
        exampleEn: '¡Hola!',
        examplePt: 'Olá!',
        strength: 'weak',
        nextReviewAt: '2026-11-24',
        intervalDays: 1,
        easeFactor: 2.5,
        reviewCount: 0,
      },
    ];
    const afterEn = mergeLoadedLanguageVocab(existing, incomingEn, 'en');
    expect(afterEn.find((c) => c.id === 'en-1')?.strength).toBe('mastered');
    const afterEs = mergeLoadedLanguageVocab(afterEn, incomingEs, 'es');
    expect(afterEs.find((c) => c.id === 'en-1')?.strength).toBe('mastered');
    expect(afterEs.find((c) => c.id === 'es-1')).toBeDefined();
  });

  it('tUi translates keys across pt, en, and es', () => {
    expect(tUi('pt', 'nav.learn')).toBeTruthy();
    expect(tUi('en', 'nav.learn')).toBeTruthy();
    expect(tUi('es', 'nav.learn')).toBeTruthy();
    expect(tUi('en', 'nav.learn')).not.toBe(tUi('pt', 'nav.learn'));
  });
});

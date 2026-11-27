/**
 * @file src/utils/__tests__/visualConcepts.test.ts
 * @description Suíte de testes unitários Vitest validando o catálogo de conceitos visuais, SVG fallback, resolução multilíngue e injeção de picture_choice.
 * @exports visualConceptsTests
 */
import { describe, expect, it } from 'vitest';
import {
  buildConceptFallbackSvgDataUri,
  getConceptImageUrl,
  inferTrackTagsFromTopic,
  resolveVisualConceptId,
  VISUAL_CONCEPTS,
  VISUAL_CONCEPTS_MAP,
} from '../../data/visualConcepts';
import type { Topic, VocabCard } from '../../types/learning';
import { enrichCourseCohesion } from '../courseCohesion';

describe('Visual Concepts & Duolingo-style Unit Images (Eixo A)', () => {
  it('ships >= 360 visual concepts across all 18 categories with unique IDs', () => {
    expect(VISUAL_CONCEPTS.length).toBeGreaterThanOrEqual(360);
    expect(VISUAL_CONCEPTS_MAP.size).toBe(VISUAL_CONCEPTS.length);

    const categories = new Set(VISUAL_CONCEPTS.map((c) => c.category));
    expect(categories.size).toBe(18);
  });

  it('resolves multilingual words (apple, maçã, manzana, pomme) to the same concept', () => {
    expect(resolveVisualConceptId('apple')).toBe('apple');
    expect(resolveVisualConceptId('maçã')).toBe('apple');
    expect(resolveVisualConceptId('manzana')).toBe('apple');
    expect(resolveVisualConceptId('pomme')).toBe('apple');
    expect(resolveVisualConceptId('xyzzy_nonexistent_token_999')).toBeUndefined();
  });

  it('builds valid deterministic SVG fallback data URIs and R2 media URLs', () => {
    const uri = buildConceptFallbackSvgDataUri('apple');
    expect(uri.startsWith('data:image/svg+xml;utf8,')).toBe(true);
    const decoded = decodeURIComponent(uri.replace('data:image/svg+xml;utf8,', ''));
    expect(decoded).toContain('<svg');
    expect(decoded).toContain('</svg>');

    const url = getConceptImageUrl('apple');
    expect(url).toMatch(/\/api\/media\/images\/concepts\/apple\.svg$/);
  });

  it('infers trackTags from topic titles and level', () => {
    expect(inferTrackTagsFromTopic('Check-in no Hotel', 'Hotel Check-in', 'A1')).toContain('travel');
    expect(inferTrackTagsFromTopic('Entrevista de Emprego', 'Job Interview', 'B1')).toContain('career');
  });

  it('enrichCourseCohesion enriches vocab visualConceptId, topic metadata, and injects picture_choice after vocab_intro for A1/A2', () => {
    const topicId = 'test-a1-food';
    const baseVocab: VocabCard[] = [
      {
        id: 'v1',
        topicId,
        languageCode: 'en',
        word: 'apple',
        translation: 'maçã',
        ipa: '/ˈæp.əl/',
        exampleEn: 'I eat an apple every morning.',
        examplePt: 'Eu como uma maçã toda manhã.',
        category: 'food',
        strength: 'weak',
        reviewCount: 0,
      },
      {
        id: 'v2',
        topicId,
        languageCode: 'en',
        word: 'bread',
        translation: 'pão',
        ipa: '/brɛd/',
        exampleEn: 'Fresh bread smells great.',
        examplePt: 'Pão fresco cheira muito bem.',
        category: 'food',
        strength: 'weak',
        reviewCount: 0,
      },
      {
        id: 'v3',
        topicId,
        languageCode: 'en',
        word: 'coffee',
        translation: 'café',
        ipa: '/ˈkɒf.i/',
        exampleEn: 'She drinks coffee at breakfast.',
        examplePt: 'Ela toma café no café da manhã.',
        category: 'food',
        strength: 'weak',
        reviewCount: 0,
      },
      {
        id: 'v4',
        topicId,
        languageCode: 'en',
        word: 'water',
        translation: 'água',
        ipa: '/ˈwɔː.tər/',
        exampleEn: 'Please drink more water today.',
        examplePt: 'Por favor, beba mais água hoje.',
        category: 'food',
        strength: 'weak',
        reviewCount: 0,
      },
    ];

    const baseTopic: Topic = {
      id: topicId,
      languageCode: 'en',
      titlePt: 'Café da Manhã e Alimentos',
      titleEn: 'Breakfast and Food',
      subtitle: 'Vocabulário essencial de comida',
      level: 'A1',
      estimatedMinutes: 8,
      icon: 'Coffee',
      color: '#D97706',
      topicTipsSummary: ['Comidas básicas'],
      steps: [
        {
          id: `${topicId}-vocab`,
          type: 'vocab_intro',
          cards: baseVocab,
        },
        {
          id: `${topicId}-listen`,
          type: 'listening',
          audioText: 'I would like coffee and bread, please.',
          speakerLabel: 'Garçom',
          contextPt: 'Ouça o pedido.',
          question: 'O que foi pedido?',
          options: ['Café e pão', 'Sopa e peixe'],
          correctIndex: 0,
          explanation: 'Coffee and bread.',
          hintTip: 'Ouça com atenção.',
        },
      ],
    };

    const { topics, vocab } = enrichCourseCohesion('en', [baseTopic], baseVocab);
    const enrichedTopic = topics[0];

    expect(enrichedTopic.coverConceptId).toBeTruthy();
    expect(enrichedTopic.trackTags?.length).toBeGreaterThanOrEqual(1);
    const baseIds = new Set(['v1', 'v2', 'v3', 'v4']);
    expect(
      vocab.filter((c) => baseIds.has(c.id)).every((c) => Boolean(c.visualConceptId)),
    ).toBe(true);

    const vocabIntroIdx = enrichedTopic.steps.findIndex((s) => s.type === 'vocab_intro');
    const picIdx = enrichedTopic.steps.findIndex((s) => s.type === 'picture_choice');
    expect(vocabIntroIdx).toBeGreaterThanOrEqual(0);
    expect(picIdx).toBe(vocabIntroIdx + 1);

    const picStep = enrichedTopic.steps[picIdx];
    expect(picStep.type).toBe('picture_choice');
    if (picStep.type === 'picture_choice') {
      expect(picStep.options.length).toBe(4);
    }
  });
});

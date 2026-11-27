/**
 * @file src/utils/__tests__/specializedTracks.test.ts
 * @description Suíte de testes Vitest validando zero colisões de títulos, vocabulário e dicas gramaticais entre as Trilhas Especializadas e o currículo principal em EN, ES, FR, DE, IT e PT, além da integridade nos 17 idiomas.
 * @exports specializedTracksTests
 */
import { describe, expect, it } from 'vitest';
import { loadLanguageCourseData } from '../../data/courseLoader';
import {
  getSpecializedTrackTopics,
  getSpecializedTrackVocab,
  SPECIALIZED_TRACKS_META,
  type SpecializedTrackId,
} from '../../data/specializedTracks';
import type { LanguageCode } from '../../types/learning';

const ALL_17_LANGS: LanguageCode[] = [
  'en', 'es', 'fr', 'de', 'it', 'pt',
  'ru', 'ja', 'zh', 'ar', 'nl', 'af', 'sv', 'tr', 'he', 'nb', 'da',
];
const TRACK_IDS: SpecializedTrackId[] = ['business', 'tech', 'health', 'travel'];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

describe('Specialized Tracks (Negócios, Tecnologia, Saúde, Viagens)', () => {
  it('exposes metadata for all 4 specialized tracks', () => {
    expect(SPECIALIZED_TRACKS_META.map((m) => m.id)).toEqual(TRACK_IDS);
  });

  it('provides 4 tracks x 3 units (12 units) with >= 5 vocab cards and >= 5 steps for all 17 languages', () => {
    for (const lang of ALL_17_LANGS) {
      const allTopics = getSpecializedTrackTopics(lang);
      const allVocab = getSpecializedTrackVocab(lang);
      expect(allTopics.length, `Lang ${lang} total specialized units`).toBe(12);
      expect(allVocab.length, `Lang ${lang} total specialized vocab`).toBeGreaterThanOrEqual(60);

      for (const trackId of TRACK_IDS) {
        const trackTopics = getSpecializedTrackTopics(lang, trackId);
        expect(trackTopics.length, `${lang}/${trackId} unit count`).toBe(3);

        for (const topic of trackTopics) {
          expect(topic.steps.length, `${topic.id} steps count`).toBeGreaterThanOrEqual(5);
          const stepTypes = new Set(topic.steps.map((s) => s.type));
          expect(stepTypes.has('vocab_intro')).toBe(true);
          expect(stepTypes.has('tip')).toBe(true);
          expect(stepTypes.has('listening')).toBe(true);
          expect(stepTypes.has('reading')).toBe(true);
          expect(stepTypes.has('speaking')).toBe(true);
          expect(stepTypes.has('writing_free')).toBe(true);

          const topicVocab = allVocab.filter((v) => v.topicId === topic.id);
          expect(topicVocab.length, `${topic.id} vocab count`).toBeGreaterThanOrEqual(5);
        }
      }
    }
  });

  it.each(ALL_17_LANGS)(
    'has ZERO unit title, vocab word, or grammar tip title collisions with main curriculum for %s',
    async (lang) => {
      const mainCourse = await loadLanguageCourseData(lang);
      const specTopics = getSpecializedTrackTopics(lang);
      const specVocab = getSpecializedTrackVocab(lang);

      const mainTitles = new Set<string>();
      const mainTipTitles = new Set<string>();

      for (const t of mainCourse.topics) {
        mainTitles.add(normalize(t.titlePt));
        mainTitles.add(normalize(t.titleEn));
        for (const step of t.steps) {
          if (step.type === 'tip') {
            mainTipTitles.add(normalize(step.tip.title));
          }
        }
      }

      const mainWords = new Set<string>(mainCourse.vocab.map((v) => normalize(v.word)));

      const titleCollisions: string[] = [];
      const tipCollisions: string[] = [];
      const vocabCollisions: string[] = [];

      for (const t of specTopics) {
        if (mainTitles.has(normalize(t.titlePt))) titleCollisions.push(t.titlePt);
        if (mainTitles.has(normalize(t.titleEn))) titleCollisions.push(t.titleEn);
        for (const step of t.steps) {
          if (step.type === 'tip' && mainTipTitles.has(normalize(step.tip.title))) {
            tipCollisions.push(step.tip.title);
          }
        }
      }

      for (const v of specVocab) {
        if (mainWords.has(normalize(v.word))) {
          vocabCollisions.push(v.word);
        }
      }

      expect(titleCollisions, `Title collisions in ${lang}`).toEqual([]);
      expect(tipCollisions, `Tip title collisions in ${lang}`).toEqual([]);
      expect(vocabCollisions, `Vocab word collisions in ${lang}`).toEqual([]);
    },
    60_000,
  );
});

import type { LanguageCode, Topic, VocabCard } from '../types/learning';
import { enrichCourseCohesion } from '../utils/courseCohesion';
import { mergeCourseVocab } from './curriculum/vocabExpansion';

export interface LoadedCourseBundle {
  topics: Topic[];
  vocab: VocabCard[];
}

const LEVEL_ORDER: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
const courseCache = new Map<LanguageCode, LoadedCourseBundle>();

function sortByLevel(list: Topic[]): Topic[] {
  return [...list].sort(
    (a, b) => (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9),
  );
}

export function getCachedCourseData(lang: LanguageCode): LoadedCourseBundle | null {
  return courseCache.get(lang) ?? null;
}

export async function loadLanguageCourseData(
  lang: LanguageCode,
): Promise<LoadedCourseBundle> {
  const cached = courseCache.get(lang);
  if (cached) return cached;

  const idiomsMod = await import('./curriculum/idiomsSlangExpansion');
  const idiomTopics = idiomsMod.IDIOMS_SLANG_TOPICS_BY_LANG[lang] ?? [];
  const idiomVocab = idiomsMod.IDIOMS_SLANG_VOCAB_BY_LANG[lang] ?? [];

  let bundle: LoadedCourseBundle;

  switch (lang) {
    case 'en': {
      const [
        gA1A2,
        gB1B2,
        gC1,
        lA1,
        lA2,
        lB1,
        lB2,
        lC1,
        sp,
        exp,
        v4,
        v9,
        vExp,
      ] = await Promise.all([
        import('./curriculum/grammarA1A2'),
        import('./curriculum/grammarB1B2'),
        import('./curriculum/grammarC1'),
        import('./curriculum/levelA1'),
        import('./curriculum/levelA2'),
        import('./curriculum/levelB1'),
        import('./curriculum/levelB2'),
        import('./curriculum/levelC1'),
        import('./curriculum/enSpecialTracks'),
        import('./curriculum/enExpansion'),
        import('./curriculum/enExpansionV4'),
        import('./curriculum/expansionV9/expV9_en'),
        import('./curriculum/vocabExpansion/vocabExpEn'),
      ]);
      const topics = sortByLevel([
        ...lA1.TOPICS_A1,
        ...gA1A2.GRAMMAR_TOPICS_A1_A2.filter((t) => t.level === 'A1'),
        ...lA2.TOPICS_A2,
        ...gA1A2.GRAMMAR_TOPICS_A1_A2.filter((t) => t.level === 'A2'),
        ...lB1.TOPICS_B1,
        ...gB1B2.GRAMMAR_TOPICS_B1_B2.filter((t) => t.level === 'B1'),
        ...lB2.TOPICS_B2,
        ...gB1B2.GRAMMAR_TOPICS_B1_B2.filter((t) => t.level === 'B2'),
        ...lC1.TOPICS_C1,
        ...gC1.GRAMMAR_TOPICS_C1,
        ...sp.TOPICS_EN_SPECIAL,
        ...exp.TOPICS_EN_EXPANSION,
        ...v4.EN_V4_TOPICS,
        ...v9.EN_V9_TOPICS,
        ...idiomTopics,
      ]).map((t) => ({ ...t, languageCode: t.languageCode ?? ('en' as LanguageCode) }));

      const baseVocab = [
        ...lA1.VOCAB_A1,
        ...lA2.VOCAB_A2,
        ...lB1.VOCAB_B1,
        ...lB2.VOCAB_B2,
        ...lC1.VOCAB_C1,
        ...gA1A2.GRAMMAR_VOCAB_A1_A2,
        ...gB1B2.GRAMMAR_VOCAB_B1_B2,
        ...gC1.GRAMMAR_VOCAB_C1,
        ...sp.VOCAB_EN_SPECIAL,
        ...exp.VOCAB_EN_EXPANSION,
        ...v4.EN_V4_VOCAB,
        ...v9.EN_V9_VOCAB,
        ...idiomVocab,
      ].map((v) => ({ ...v, languageCode: v.languageCode ?? ('en' as LanguageCode) }));

      bundle = {
        topics,
        vocab: mergeCourseVocab('en', baseVocab, vExp.VOCAB_EXP_EN, vExp.VOCAB_FIXES_EN),
      };
      break;
    }
    case 'es': {
      const [base, v4, v9, vExp] = await Promise.all([
        import('./curriculum/spanishCourse'),
        import('./curriculum/spanishExpansionV4'),
        import('./curriculum/expansionV9/expV9_es'),
        import('./curriculum/vocabExpansion/vocabExpEs'),
      ]);
      bundle = {
        topics: sortByLevel([...base.SPANISH_ALL_TOPICS, ...v4.SPANISH_V4_TOPICS, ...v9.ES_V9_TOPICS, ...idiomTopics]),
        vocab: mergeCourseVocab('es', [...base.SPANISH_ALL_VOCAB, ...v4.SPANISH_V4_VOCAB, ...v9.ES_V9_VOCAB, ...idiomVocab], vExp.VOCAB_EXP_ES, vExp.VOCAB_FIXES_ES),
      };
      break;
    }
    case 'fr': {
      const [base, v4, v9, vExp] = await Promise.all([
        import('./curriculum/frenchCourse'),
        import('./curriculum/frenchExpansionV4'),
        import('./curriculum/expansionV9/expV9_fr'),
        import('./curriculum/vocabExpansion/vocabExpFr'),
      ]);
      bundle = {
        topics: sortByLevel([...base.FRENCH_ALL_TOPICS, ...v4.FRENCH_V4_TOPICS, ...v9.FR_V9_TOPICS, ...idiomTopics]),
        vocab: mergeCourseVocab('fr', [...base.FRENCH_ALL_VOCAB, ...v4.FRENCH_V4_VOCAB, ...v9.FR_V9_VOCAB, ...idiomVocab], vExp.VOCAB_EXP_FR, vExp.VOCAB_FIXES_FR),
      };
      break;
    }
    case 'it': {
      const [base, v4, v9, vExp] = await Promise.all([
        import('./curriculum/italianExtra'),
        import('./curriculum/italianExpansionV4'),
        import('./curriculum/expansionV9/expV9_it'),
        import('./curriculum/vocabExpansion/vocabExpIt'),
      ]);
      bundle = {
        topics: sortByLevel([...base.ITALIAN_ALL_TOPICS, ...v4.ITALIAN_V4_TOPICS, ...v9.IT_V9_TOPICS, ...idiomTopics]),
        vocab: mergeCourseVocab('it', [...base.ITALIAN_ALL_VOCAB, ...v4.ITALIAN_V4_VOCAB, ...v9.IT_V9_VOCAB, ...idiomVocab], vExp.VOCAB_EXP_IT, vExp.VOCAB_FIXES_IT),
      };
      break;
    }
    case 'de': {
      const [base, v4, v9, vExp] = await Promise.all([
        import('./curriculum/germanExtra'),
        import('./curriculum/germanExpansionV4'),
        import('./curriculum/expansionV9/expV9_de'),
        import('./curriculum/vocabExpansion/vocabExpDe'),
      ]);
      bundle = {
        topics: sortByLevel([...base.GERMAN_ALL_TOPICS, ...v4.GERMAN_V4_TOPICS, ...v9.DE_V9_TOPICS, ...idiomTopics]),
        vocab: mergeCourseVocab('de', [...base.GERMAN_ALL_VOCAB, ...v4.GERMAN_V4_VOCAB, ...v9.DE_V9_VOCAB, ...idiomVocab], vExp.VOCAB_EXP_DE, vExp.VOCAB_FIXES_DE),
      };
      break;
    }
    case 'ru': {
      const [base, v4, v9, vExp] = await Promise.all([
        import('./curriculum/russianExtra'),
        import('./curriculum/russianExpansionV4'),
        import('./curriculum/expansionV9/expV9_ru'),
        import('./curriculum/vocabExpansion/vocabExpRu'),
      ]);
      bundle = {
        topics: sortByLevel([...base.RUSSIAN_ALL_TOPICS, ...v4.RUSSIAN_V4_TOPICS, ...v9.RU_V9_TOPICS, ...idiomTopics]),
        vocab: mergeCourseVocab('ru', [...base.RUSSIAN_ALL_VOCAB, ...v4.RUSSIAN_V4_VOCAB, ...v9.RU_V9_VOCAB, ...idiomVocab], vExp.VOCAB_EXP_RU, vExp.VOCAB_FIXES_RU),
      };
      break;
    }
    case 'ja': {
      const [base, v4, v9, vExp] = await Promise.all([
        import('./curriculum/japaneseExtra'),
        import('./curriculum/japaneseExpansionV4'),
        import('./curriculum/expansionV9/expV9_ja'),
        import('./curriculum/vocabExpansion/vocabExpJa'),
      ]);
      bundle = {
        topics: sortByLevel([...base.JAPANESE_ALL_TOPICS, ...v4.JAPANESE_V4_TOPICS, ...v9.JA_V9_TOPICS, ...idiomTopics]),
        vocab: mergeCourseVocab('ja', [...base.JAPANESE_ALL_VOCAB, ...v4.JAPANESE_V4_VOCAB, ...v9.JA_V9_VOCAB, ...idiomVocab], vExp.VOCAB_EXP_JA, vExp.VOCAB_FIXES_JA),
      };
      break;
    }
    case 'zh': {
      const [base, v4, v9, vExp] = await Promise.all([
        import('./curriculum/chineseExtra'),
        import('./curriculum/chineseExpansionV4'),
        import('./curriculum/expansionV9/expV9_zh'),
        import('./curriculum/vocabExpansion/vocabExpZh'),
      ]);
      bundle = {
        topics: sortByLevel([...base.CHINESE_ALL_TOPICS, ...v4.CHINESE_V4_TOPICS, ...v9.ZH_V9_TOPICS, ...idiomTopics]),
        vocab: mergeCourseVocab('zh', [...base.CHINESE_ALL_VOCAB, ...v4.CHINESE_V4_VOCAB, ...v9.ZH_V9_VOCAB, ...idiomVocab], vExp.VOCAB_EXP_ZH, vExp.VOCAB_FIXES_ZH),
      };
      break;
    }
    case 'ar': {
      const [exp, v9, vExp] = await Promise.all([
        import('./curriculum/arabicExpansion'),
        import('./curriculum/expansionV9/expV9_ar'),
        import('./curriculum/vocabExpansion/vocabExpAr'),
      ]);
      bundle = {
        topics: sortByLevel([...exp.ARABIC_100_TOPICS, ...v9.AR_V9_TOPICS, ...idiomTopics]),
        vocab: mergeCourseVocab('ar', [...exp.ARABIC_100_VOCAB, ...v9.AR_V9_VOCAB, ...idiomVocab], vExp.VOCAB_EXP_AR, vExp.VOCAB_FIXES_AR),
      };
      break;
    }
    case 'nl': {
      const [exp, v9, vExp] = await Promise.all([
        import('./curriculum/dutchExpansion'),
        import('./curriculum/expansionV9/expV9_nl'),
        import('./curriculum/vocabExpansion/vocabExpNl'),
      ]);
      bundle = {
        topics: sortByLevel([...exp.DUTCH_100_TOPICS, ...v9.NL_V9_TOPICS, ...idiomTopics]),
        vocab: mergeCourseVocab('nl', [...exp.DUTCH_100_VOCAB, ...v9.NL_V9_VOCAB, ...idiomVocab], vExp.VOCAB_EXP_NL, vExp.VOCAB_FIXES_NL),
      };
      break;
    }
    case 'af': {
      const [exp, v9, vExp] = await Promise.all([
        import('./curriculum/afrikaansExpansion'),
        import('./curriculum/expansionV9/expV9_af'),
        import('./curriculum/vocabExpansion/vocabExpAf'),
      ]);
      bundle = {
        topics: sortByLevel([...exp.AFRIKAANS_100_TOPICS, ...v9.AF_V9_TOPICS, ...idiomTopics]),
        vocab: mergeCourseVocab('af', [...exp.AFRIKAANS_100_VOCAB, ...v9.AF_V9_VOCAB, ...idiomVocab], vExp.VOCAB_EXP_AF, vExp.VOCAB_FIXES_AF),
      };
      break;
    }
    case 'sv': {
      const [exp, v9, vExp] = await Promise.all([
        import('./curriculum/swedishExpansion'),
        import('./curriculum/expansionV9/expV9_sv'),
        import('./curriculum/vocabExpansion/vocabExpSv'),
      ]);
      bundle = {
        topics: sortByLevel([...exp.SWEDISH_100_TOPICS, ...v9.SV_V9_TOPICS, ...idiomTopics]),
        vocab: mergeCourseVocab('sv', [...exp.SWEDISH_100_VOCAB, ...v9.SV_V9_VOCAB, ...idiomVocab], vExp.VOCAB_EXP_SV, vExp.VOCAB_FIXES_SV),
      };
      break;
    }
    case 'tr': {
      const exp = await import('./curriculum/turkishExpansion');
      bundle = {
        topics: sortByLevel([...exp.TURKISH_150_TOPICS, ...idiomTopics]),
        vocab: [...exp.TURKISH_150_VOCAB, ...idiomVocab],
      };
      break;
    }
    case 'he': {
      const exp = await import('./curriculum/hebrewExpansion');
      bundle = {
        topics: sortByLevel([...exp.HEBREW_150_TOPICS, ...idiomTopics]),
        vocab: [...exp.HEBREW_150_VOCAB, ...idiomVocab],
      };
      break;
    }
    case 'nb': {
      const exp = await import('./curriculum/norwegianExpansion');
      bundle = {
        topics: sortByLevel([...exp.NORWEGIAN_150_TOPICS, ...idiomTopics]),
        vocab: [...exp.NORWEGIAN_150_VOCAB, ...idiomVocab],
      };
      break;
    }
    case 'da': {
      const exp = await import('./curriculum/danishExpansion');
      bundle = {
        topics: sortByLevel([...exp.DANISH_150_TOPICS, ...idiomTopics]),
        vocab: [...exp.DANISH_150_VOCAB, ...idiomVocab],
      };
      break;
    }
  }

  bundle = enrichCourseCohesion(lang, bundle.topics, bundle.vocab);
  courseCache.set(lang, bundle);
  return bundle;
}

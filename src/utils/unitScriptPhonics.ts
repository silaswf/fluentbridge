import {
  ARABIC_ALPHABET,
  CHINESE_HANZI,
  HEBREW_ALEFBET,
  JAPANESE_HIRAGANA,
  JAPANESE_KATAKANA,
  RUSSIAN_CYRILLIC,
  type ScriptCharacterItem,
} from '../data/scriptTrainerData';
import type {
  CEFRLevel,
  LanguageCode,
  ScriptPhonicsChar,
  ScriptPhonicsStep,
  Topic,
  VocabCard,
} from '../types/learning';
import { extractKanjiChars, getKanjiScriptChar } from './japaneseKana';

function toPhonicsChar(item: ScriptCharacterItem): ScriptPhonicsChar {
  return {
    char: item.char,
    reading: item.reading,
    meaningPt: item.meaningPt,
    exampleWord: item.exampleWord,
    examplePt: item.examplePt,
    strokes: item.strokes,
    strokeHints: item.strokeHints,
    cursiveNote: item.cursiveNote,
    direction: item.direction,
    forms: item.forms,
  };
}

function collectTopicTargetText(topic: Topic, topicVocab: VocabCard[]): string {
  const parts: string[] = [
    ...topicVocab.map((v) => v.word),
    ...topicVocab.map((v) => v.exampleEn),
  ];
  for (const s of topic.steps) {
    if (s.type === 'listening' || s.type === 'dictation') parts.push(s.audioText);
    if (s.type === 'reading') parts.push(s.text);
    if (s.type === 'story') parts.push(...s.lines.map((l) => l.text));
    if (s.type === 'speaking') parts.push(s.targetSentence);
  }
  return parts.join(' ');
}

function buildSoundQuiz(
  items: ScriptPhonicsChar[],
  unitIdx: number,
  lang: 'ru' | 'ar' | 'ja' | 'zh' | 'he',
): ScriptPhonicsStep['soundQuiz'] {
  const target = items[unitIdx % items.length] ?? items[0];
  const distractors = items.filter((it) => it.char !== target.char).slice(0, 2);
  const pool = [target, ...distractors];
  while (pool.length < 3 && items.length > 0) {
    pool.push(items[pool.length % items.length]);
  }
  const shift = unitIdx % pool.length;
  const rotated = [...pool.slice(shift), ...pool.slice(0, shift)];
  const correctIndex = rotated.findIndex((o) => o.char === target.char);
  const audioSample = target.exampleWord.split('(')[0].trim() || target.char;

  return {
    promptPt:
      lang === 'ja'
        ? `Ouça a pronúncia e identifique o caractere/kana correspondente (${target.reading}):`
        : `Ouça o som e selecione a letra/caractere correspondente (${target.reading}):`,
    audioText: audioSample,
    options: rotated.map((o) => ({ char: o.char, reading: o.reading })),
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    explanationPt: `${target.char} lê-se "${target.reading}" (${target.meaningPt}) — ex.: ${target.exampleWord} (${target.examplePt}).`,
  };
}

const RU_GROUPS: Array<{ title: string; intro: string; slice: [number, number] }> = [
  {
    title: 'Cirílico 1 · Vogais & Falsos Amigos Visuais (А, В, Е, Н, Р, С)',
    intro: 'Atenção aos falsos amigos visuais do russo: В tem som de V, Н tem som de N, Р tem som de R e С tem som de S!',
    slice: [0, 6],
  },
  {
    title: 'Cirílico 2 · Consoantes Essenciais (Ё–Л)',
    intro: 'Domine Б, Г, Д, Ж, З, И, Й, К, Л e suas pronúncias em palavras do dia a dia.',
    slice: [6, 12],
  },
  {
    title: 'Cirílico 3 · Núcleo do Alfabeto (М–Т)',
    intro: 'Pratique М, О (que átono soa como A), П, Т e consolide Н/Р/С.',
    slice: [12, 19],
  },
  {
    title: 'Cirílico 4 · Sons Fortes & Sibilantes (У–Ч)',
    intro: 'Treine У (som de U), Ф, Х (RR gutural), Ц (ts) e Ч (tch).',
    slice: [19, 25],
  },
  {
    title: 'Cirílico 5 · Sibilantes Compostas & Sinais (Ш, Щ, Ъ, Ы, Ь)',
    intro: 'Diferencie Ш de Щ, conheça a vogal gutural Ы e os sinais duro (Ъ) e brando (Ь).',
    slice: [25, 30],
  },
  {
    title: 'Cirílico 6 · Vogais Finais & Fechamento (Э, Ю, Я)',
    intro: 'Complete todas as 33 letras do alfabeto russo com Э, Ю e Я.',
    slice: [30, 33],
  },
];

const AR_GROUPS: Array<{ title: string; intro: string }> = [
  { title: 'Árabe 1 · Primeiras Letras & Formas RTL (ا ب ت ث)', intro: 'Leia da direita para a esquerda (RTL) e veja como cada letra muda na posição inicial, medial e final.' },
  { title: 'Árabe 2 · Família do Jīm & Dāl (ج ح خ د)', intro: 'Diferencie ج, ح (faríngeo sem ponto) e خ pelo posicionamento dos pontos.' },
  { title: 'Árabe 3 · Sibilantes & Letras Não-Conectáveis (ذ ر ز س)', intro: 'Observe como ذ, ر e ز não se ligam à letra seguinte à esquerda.' },
  { title: 'Árabe 4 · Letras Enfáticas (ش ص ض ط)', intro: 'Treine os sons enfáticos (ص, ض, ط) articulados com a base da língua abaixada.' },
  { title: 'Árabe 5 · Sons Guturais & Úvula (ظ ع غ ف)', intro: 'Pratique ع (ʿAyn) e غ (Ghayn), sons característicos da língua árabe.' },
  { title: 'Árabe 6 · Núcleo de Leitura (ق ك ل م)', intro: 'Diferencie ق (profundo) de ك (k leve) e pratique ل e م.' },
  { title: 'Árabe 7 · Fechamento do Alfabeto (ن ه و ي)', intro: 'Complete as 28 letras do alfabeto árabe com ن, ه e as vogais longas و e ي.' },
];

const LEVEL_TO_JLPT: Record<CEFRLevel, 'N5' | 'N4' | 'N3' | 'N2' | 'N1'> = {
  A1: 'N5',
  A2: 'N4',
  B1: 'N3',
  B2: 'N2',
  C1: 'N1',
};

export interface ScriptPhonicsContext {
  seenKanji: Set<string>;
  seenHanzi: Set<string>;
}

export function createScriptPhonicsContext(): ScriptPhonicsContext {
  return {
    seenKanji: new Set<string>(),
    seenHanzi: new Set<string>(),
  };
}

export function buildUnitScriptPhonicsStep(
  languageCode: LanguageCode,
  topic: Topic,
  topicVocab: VocabCard[],
  unitIdx: number,
  ctx: ScriptPhonicsContext,
): ScriptPhonicsStep | null {
  if (languageCode === 'ru') {
    if (unitIdx >= 12) return null;
    const grp = RU_GROUPS[unitIdx % RU_GROUPS.length];
    const items = RUSSIAN_CYRILLIC.slice(grp.slice[0], grp.slice[1]).map(toPhonicsChar);
    if (items.length === 0) return null;
    return {
      id: `${topic.id}-script`,
      type: 'script_phonics',
      stageLabelPt: 'Letras & Sons',
      categoryTitlePt: grp.title,
      introPt: grp.intro,
      languageCode: 'ru',
      items,
      soundQuiz: buildSoundQuiz(items, unitIdx, 'ru'),
    };
  }

  if (languageCode === 'ar') {
    if (unitIdx >= 14) return null;
    const gIdx = unitIdx % AR_GROUPS.length;
    const start = gIdx * 4;
    const items = ARABIC_ALPHABET.slice(start, start + 4).map(toPhonicsChar);
    if (items.length === 0) return null;
    return {
      id: `${topic.id}-script`,
      type: 'script_phonics',
      stageLabelPt: 'Alfabeto RTL',
      categoryTitlePt: AR_GROUPS[gIdx].title,
      introPt: AR_GROUPS[gIdx].intro,
      languageCode: 'ar',
      items,
      soundQuiz: buildSoundQuiz(items, unitIdx, 'ar'),
    };
  }

  if (languageCode === 'he') {
    if (unitIdx >= 14) return null;
    const heGroups = [
      { title: 'Alefbet RTL 1 · Primeiras Letras (א–ד)', intro: 'Leia da direita para a esquerda. Observe א (silenciosa), ב (B/V com ou sem Dagesh), ג e ד.' },
      { title: 'Alefbet RTL 2 · Guturais & Labiais (ה–ח)', intro: 'Pratique ה (H suave), ו (V / vogal O-U), ז (Z) e ח (CH gutural).' },
      { title: 'Alefbet RTL 3 · Consoantes Centrais (ט–ל)', intro: 'Domine ט (T), י (Y/I), כ/ך (K/CH + Sofit final) e ל (L).' },
      { title: 'Alefbet RTL 4 · Nasais & Finais Sofit (מ–ע)', intro: 'Atenção às formas finais Sofit: ם (Mem final), ן (Nun final), ס (S) e ע (Ayin).' },
      { title: 'Alefbet RTL 5 · Duplas & Sibilantes (פ–ש)', intro: 'Diferencie פ/ף (P/F), צ/ץ (TS), ק (K), ר (R) e ש (SH/S).' },
      { title: 'Alefbet RTL 6 · Fechamento & Formas Finais (ת + Sofit)', intro: 'Consolide ת (T) e todas as 5 letras Sofit (ך, ם, ן, ף, ץ) usadas apenas no fim da palavra.' },
      { title: 'Alefbet RTL 7 · Revisão Geral & Niqqud', intro: 'Revise o Alefbet completo com e sem diacríticos (Niqqud) para leitura fluente em Israel.' },
    ];
    const gIdx = unitIdx % heGroups.length;
    const start = (gIdx * 4) % Math.max(1, HEBREW_ALEFBET.length - 3);
    const items = HEBREW_ALEFBET.slice(start, start + 4).map(toPhonicsChar);
    if (items.length === 0) return null;
    return {
      id: `${topic.id}-script`,
      type: 'script_phonics',
      stageLabelPt: 'Alefbet RTL',
      categoryTitlePt: heGroups[gIdx].title,
      introPt: heGroups[gIdx].intro,
      languageCode: 'he',
      items,
      soundQuiz: buildSoundQuiz(items, unitIdx, 'he'),
    };
  }

  if (languageCode === 'zh') {
    const text = collectTopicTargetText(topic, topicVocab);
    const chars = extractKanjiChars(text);
    const newChars = chars.filter((c) => !ctx.seenHanzi.has(c)).slice(0, 4);
    newChars.forEach((c) => ctx.seenHanzi.add(c));

    const items: ScriptPhonicsChar[] = newChars.map((c) => {
      const bank = CHINESE_HANZI.find((h) => h.char === c);
      if (bank) return toPhonicsChar(bank);
      const matchingCard = topicVocab.find((v) => v.word.includes(c));
      return {
        char: c,
        reading: matchingCard?.ipa || 'pinyin da unidade',
        meaningPt: matchingCard?.translation || 'Caractere da unidade',
        exampleWord: matchingCard?.word || c,
        examplePt: matchingCard?.translation || 'ver vocabulário',
      };
    });

    if (items.length === 0 && unitIdx < 6) {
      const fallback = CHINESE_HANZI.slice(unitIdx * 3, unitIdx * 3 + 3).map(toPhonicsChar);
      items.push(...fallback);
    }
    if (items.length === 0) return null;

    return {
      id: `${topic.id}-script`,
      type: 'script_phonics',
      stageLabelPt: 'Hanzi & Tons',
      categoryTitlePt: `Hanzi & Tons da Unidade (${items.map((i) => i.char).join(' · ')})`,
      introPt:
        'Observe a leitura em Pinyin, o tom e pratique o traçado de cada novo ideograma antes dos diálogos.',
      languageCode: 'zh',
      items,
      soundQuiz: buildSoundQuiz(items, unitIdx, 'zh'),
    };
  }

  if (languageCode === 'ja') {
    const text = collectTopicTargetText(topic, topicVocab);
    const unitKanji = extractKanjiChars(text);
    const newKanji = unitKanji.filter((k) => !ctx.seenKanji.has(k));
    newKanji.forEach((k) => ctx.seenKanji.add(k));

    const items: ScriptPhonicsChar[] = [];
    let categoryTitlePt = '';
    let introPt = '';

    // Units 0-4: Hiragana rows + new Kanji; Units 5-9: Katakana rows + new Kanji
    if (unitIdx < 5) {
      const sliceSize = 9;
      const kanaSlice = JAPANESE_HIRAGANA.slice(
        unitIdx * sliceSize,
        (unitIdx + 1) * sliceSize,
      )
        .slice(0, 5)
        .map(toPhonicsChar);
      items.push(...kanaSlice);
      categoryTitlePt = `Hiragana (${kanaSlice.map((k) => k.char).join(' ')})`;
      introPt =
        'Associe cada símbolo Hiragana ao seu som antes de ler as frases da unidade.';
    } else if (unitIdx < 10) {
      const kIdx = unitIdx - 5;
      const sliceSize = 9;
      const kanaSlice = JAPANESE_KATAKANA.slice(
        kIdx * sliceSize,
        (kIdx + 1) * sliceSize,
      )
        .slice(0, 5)
        .map(toPhonicsChar);
      items.push(...kanaSlice);
      categoryTitlePt = `Katakana (${kanaSlice.map((k) => k.char).join(' ')})`;
      introPt =
        'Pratique os caracteres Katakana usados em palavras estrangeiras e nomes.';
    }

    const jlpt = LEVEL_TO_JLPT[topic.level] ?? 'N4';
    const kanjiItems = newKanji.slice(0, 6).map((k) => getKanjiScriptChar(k, jlpt));
    if (kanjiItems.length > 0) {
      items.push(...kanjiItems);
      categoryTitlePt = categoryTitlePt
        ? `${categoryTitlePt} + Novos Kanji (${kanjiItems.map((k) => k.char).join(' ')})`
        : `Novos Kanji ${jlpt} desta Unidade (${kanjiItems.map((k) => k.char).join(' · ')})`;
      introPt =
        'Todo Kanji novo usado nesta unidade é apresentado aqui primeiro com leitura, significado e traçado (você também pode alternar para 100% Kana no topo).';
    }

    if (items.length === 0) return null;

    return {
      id: `${topic.id}-script`,
      type: 'script_phonics',
      stageLabelPt: kanjiItems.length > 0 ? 'Kanji & Kana' : 'Kana & Sons',
      categoryTitlePt,
      introPt,
      languageCode: 'ja',
      items,
      soundQuiz: buildSoundQuiz(items, unitIdx, 'ja'),
    };
  }

  return null;
}

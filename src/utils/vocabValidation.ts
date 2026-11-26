import type { LanguageCode } from '../types/learning';

const LEADING_DICTIONARY_MARKER_RE =
  /^(to|att|å|at|et|a|an|the|el|la|los|las|un|una|unos|unas|le|les|l'|il|lo|i|gli|der|die|das|ein|eine|de|het|een|en|ett|'n|’n|sich|zich|se)\s+/i;

const FUNCTION_STOPWORDS = new Set([
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from',
  'de', 'du', 'des', 'la', 'le', 'les', 'el', 'en', 'y', 'e', 'i', 'o',
  'zu', 'im', 'am', 'mit', 'von', 'van', 'op', 'te', 'om', 'av', 'till', 'pa',
  'в', 'на', 'с', 'к', 'о', 'по', 'и',
]);

const IRREGULAR_FORM_MAP: Record<string, string[]> = {
  run: ['ran', 'running'],
  say: ['said', 'saying'],
  tell: ['told', 'telling'],
  go: ['went', 'gone', 'going'],
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'],
  have: ['has', 'had', 'having'],
  make: ['made', 'making'],
  take: ['took', 'taken', 'taking'],
  give: ['gave', 'given', 'giving'],
  come: ['came', 'coming'],
  see: ['saw', 'seen', 'seeing'],
  get: ['got', 'gotten', 'getting'],
  find: ['found', 'finding'],
  think: ['thought', 'thinking'],
  buy: ['bought', 'buying'],
  bring: ['brought', 'bringing'],
  write: ['wrote', 'written', 'writing'],
  speak: ['spoke', 'spoken', 'speaking'],
  break: ['broke', 'broken', 'breaking'],
  choose: ['chose', 'chosen', 'choosing'],
  drive: ['drove', 'driven', 'driving'],
  fall: ['fell', 'fallen', 'falling'],
  feel: ['felt', 'feeling'],
  keep: ['kept', 'keeping'],
  know: ['knew', 'known', 'knowing'],
  leave: ['left', 'leaving'],
  lose: ['lost', 'losing'],
  meet: ['met', 'meeting'],
  pay: ['paid', 'paying'],
  put: ['put', 'putting'],
  send: ['sent', 'sending'],
  sit: ['sat', 'sitting'],
  sleep: ['slept', 'sleeping'],
  spend: ['spent', 'spending'],
  stand: ['stood', 'standing'],
  understand: ['understood', 'understanding'],
  win: ['won', 'winning'],
  meter: ['meti', 'metio'],
  ir: ['voy', 'vas', 'va', 'vamos', 'van', 'fue', 'fui'],
  ser: ['soy', 'eres', 'es', 'somos', 'son', 'fue', 'era'],
  tener: ['tengo', 'tienes', 'tiene', 'tenemos', 'tienen', 'tuvo', 'tuve'],
  hacer: ['hago', 'haces', 'hace', 'hacemos', 'hacen', 'hizo', 'hecho'],
  poder: ['puedo', 'puedes', 'puede', 'podemos', 'pueden', 'pudo'],
  venir: ['vengo', 'vienes', 'viene', 'venimos', 'vienen', 'vino', 'viens', 'vient', 'venu'],
  avoir: ['ai', 'as', 'a', 'avons', 'avez', 'ont', 'eu', 'avais', 'avait'],
  etre: ['suis', 'es', 'est', 'sommes', 'etes', 'sont', 'ete', 'etais', 'etait'],
  aller: ['vais', 'vas', 'va', 'allons', 'allez', 'vont', 'alle'],
  faire: ['fais', 'fait', 'faisons', 'faites', 'font'],
  pouvoir: ['peux', 'peut', 'pouvons', 'pouvez', 'peuvent', 'pu'],
  prendre: ['prends', 'prend', 'prenons', 'prenez', 'prennent', 'pris'],
  sein: ['bin', 'bist', 'ist', 'sind', 'seid', 'war', 'waren', 'gewesen'],
  haben: ['habe', 'hast', 'hat', 'habt', 'hatte', 'gehabt'],
  werden: ['werde', 'wirst', 'wird', 'wurde', 'geworden'],
  gehen: ['gehe', 'gehst', 'geht', 'ging', 'gegangen'],
  kommen: ['komme', 'kommst', 'kommt', 'kam', 'gekommen'],
  nehmen: ['nehme', 'nimmst', 'nimmt', 'nahm', 'genommen'],
  essen: ['esse', 'isst', 'ass', 'gegessen'],
  sehen: ['sehe', 'siehst', 'sieht', 'sah', 'gesehen'],
  geben: ['gebe', 'gibst', 'gibt', 'gab', 'gegeben'],
  zijn: ['ben', 'bent', 'is', 'was', 'waren', 'geweest'],
  hebben: ['heb', 'hebt', 'heeft', 'had', 'hadden', 'gehad'],
  gaan: ['ga', 'gaat', 'ging', 'gingen', 'gegaan'],
  komen: ['kom', 'komt', 'kwam', 'kwamen', 'gekomen'],
  doen: ['doe', 'doet', 'deed', 'deden', 'gedaan'],
  zien: ['zie', 'ziet', 'zag', 'zagen', 'gezien'],
  vara: ['ar', 'var', 'varit'],
  ha: ['har', 'hade', 'haft'],
  ga: ['gar', 'gick', 'gatt'],
  komma: ['kommer', 'kom', 'kommit'],
  gora: ['gor', 'gjorde', 'gjort'],
  se: ['ser', 'sag', 'sett'],
  vide: ['ved', 'vidste', 'vidst'],
  vaere: ['er', 'var', 'vaeret'],
  fortaelle: ['fortalte', 'fortalt', 'fortaeller'],
  'быть': ['был', 'была', 'были', 'есть', 'будет', 'будут'],
  'идти': ['иду', 'идешь', 'идет', 'идем', 'идут', 'шел', 'шла', 'шли'],
  'ехать': ['еду', 'едешь', 'едет', 'едем', 'едут', 'ехал'],
  'мочь': ['могу', 'можешь', 'может', 'можем', 'могут', 'мог'],
  'хотеть': ['хочу', 'хочешь', 'хочет', 'хотим', 'хотят', 'хотел'],
};

const META_FALLBACK_PATTERNS: RegExp[] = [
  /We often use "/i,
  /Could you repeat "/i,
  /Remember to apply "/i,
  /In this context, "/i,
  /En esta situación usamos/i,
  /¿Puedes usar "/i,
  /Recuerda practicar "/i,
  /La expresión "/i,
  /Dans ce contexte, on emploie/i,
  /Pouvez-vous utiliser/i,
  /N’oubliez pas de réutiliser/i,
  /L’expression «/i,
  /In questo contesto si usa/i,
  /Prova a inserire/i,
  /Ricorda che "/i,
  /Usiamo "/i,
  /Im Alltag verwendet man/i,
  /Kannst du einen klaren Satz/i,
  /Merke dir „/i,
  /Der Ausdruck „/i,
  /В этой ситуации часто/i,
  /Попробуйте составить/i,
  /Запомните слово/i,
  /Выражение «/i,
  /この 場面では/,
  /を 使って 短い/,
  /日常会話で「/,
  /の 発音と 意味/,
  /在这个场景中/,
  /请试着用“/,
  /平时交流时/,
  /记住“/,
  /نستخدم عبارة/,
  /حاول أن تضع/,
  /تذكّر نطق/,
  /كلمة «/,
  /In het dagelijks leven/i,
  /Kun je een duidelijke zin/i,
  /Onthoud „/i,
  /De uitdrukking „/i,
  /In die alledaagse lewe/i,
  /Kan jy ’n duidelike sin/i,
  /Onthou „/i,
  /Die uitdrukking „/i,
  /I vardagen använder man/i,
  /Kan du bilda en tydlig/i,
  /Kom ihåg „/i,
  /Uttrycket „/i,
];

export function isMetaFallbackExample(exampleTarget: string): boolean {
  const text = (exampleTarget ?? '').trim();
  if (!text) return false;
  return META_FALLBACK_PATTERNS.some((re) => re.test(text));
}

function normalizeArabicText(raw: string): string {
  return raw
    .normalize('NFKC')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\u0600-\u06FF0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeGeneralText(raw: string): string {
  return raw
    .normalize('NFKC')
    .replace(/[\u0591-\u05c7]/g, '')
    .replace(/İ/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘`]/g, "'")
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripGlosses(rawWord: string): string {
  return rawWord
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\+\s*-?\s*(done|inf\.?|ing|verb|noun)\b/gi, ' ')
    .replace(/\.{2,}|…/g, ' ')
    .replace(/[¡!¿?.,;:«»"“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesLatinOrCyrillicToken(
  token: string,
  exNorm: string,
  exWords: string[],
): boolean {
  if (!token) return false;

  // Exact word or embedded match for hyphenated/elided/compound tokens
  const wordRegex = new RegExp(`(?:^|\\s|-|')${escapeRegExp(token)}(?:$|\\s|-|')`);
  if (wordRegex.test(exNorm)) return true;

  // Irregular forms
  const irregulars = IRREGULAR_FORM_MAP[token];
  if (irregulars) {
    for (const form of irregulars) {
      const formRegex = new RegExp(`(?:^|\\s|-|')${escapeRegExp(form)}(?:$|\\s|-|')`);
      if (formRegex.test(exNorm)) return true;
    }
  }

  // Inflectional stem match & compound/separable verb match
  if (token.length >= 7) {
    const stem = token.slice(0, token.length - 3);
    if (exWords.some((w) => w.startsWith(stem) && w.length >= stem.length)) {
      return true;
    }
    if (stem.length >= 5 && stem[stem.length - 1] === stem[stem.length - 2]) {
      const singleStem = stem.slice(0, -1);
      if (exWords.some((w) => w.startsWith(singleStem))) {
        return true;
      }
    }
  } else if (token.length >= 6) {
    const stem = token.slice(0, token.length - 2);
    if (exWords.some((w) => w.startsWith(stem) && w.length >= stem.length)) {
      return true;
    }
  } else if (token.length >= 4) {
    const stem = token.slice(0, token.length - 1);
    if (exWords.some((w) => w.startsWith(stem) && w.length >= stem.length)) {
      return true;
    }
  }

  // Compound nouns (e.g., vakantie -> zomervakantie)
  if (token.length >= 6 && exWords.some((w) => w.endsWith(token))) {
    return true;
  }

  // Dutch / Afrikaans / German separable verbs (e.g., terugkomen -> terug te komen, opvang -> op te vang)
  const sepMatch = token.match(/^(aan|af|bij|door|in|mee|na|om|onder|op|over|terug|toe|uit|voor|weg)(.{4,})$/);
  if (sepMatch) {
    const [, prefix, base] = sepMatch;
    const baseStem = base.length >= 5 ? base.slice(0, base.length - 2) : base;
    if (
      exWords.includes(prefix) &&
      exWords.some((w) => w.startsWith(baseStem))
    ) {
      return true;
    }
  }

  // Italian -porre / -urre / -crescere irregular stems
  if (token.endsWith('porre') && exWords.some((w) => w.startsWith(token.slice(0, -5) + 'pon'))) {
    return true;
  }

  return false;
}

function variantMatchesExample(
  variant: string,
  exampleTarget: string,
  languageCode?: LanguageCode,
): boolean {
  const isCjk =
    languageCode === 'ja' ||
    languageCode === 'zh' ||
    /[\u3040-\u30ff\u3400-\u9fff]/.test(variant);
  const isArabic =
    languageCode === 'ar' || /[\u0600-\u06FF]/.test(variant);

  if (isCjk) {
    const exCompact = exampleTarget
      .normalize('NFKC')
      .replace(/[\s\p{P}]/gu, '');
    const cleaned = variant
      .normalize('NFKC')
      .replace(/[\s\p{P}~～・]/gu, '');
    if (!cleaned) return false;
    if (exCompact.includes(cleaned)) return true;
    if (
      languageCode === 'ja' &&
      cleaned.length >= 2 &&
      /[うくぐすつぬぶむるい]$/.test(cleaned) &&
      exCompact.includes(cleaned.slice(0, -1))
    ) {
      return true;
    }
    // Also check kanji/kana/hanzi blocks (>= 2 chars or single >= 1 char if whole word is 1 char)
    const blocks = variant
      .normalize('NFKC')
      .split(/[\s\p{P}~～・]+/u)
      .filter(Boolean);
    return blocks.length > 0 && blocks.every((b) => exCompact.includes(b));
  }

  if (isArabic) {
    const exAr = normalizeArabicText(exampleTarget);
    const exTokens = exAr
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => (t.startsWith('ال') && t.length > 3 ? t.slice(2) : t));
    const varAr = normalizeArabicText(variant);
    if (!varAr) return false;
    if (exAr.includes(varAr)) return true;

    let tokens = varAr
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => (t.startsWith('ال') && t.length > 3 ? t.slice(2) : t));
    if (tokens.length > 1) {
      const filtered = tokens.filter((t) => t.length >= 2);
      if (filtered.length > 0) tokens = filtered;
    }
    return (
      tokens.length > 0 &&
      tokens.every((tok) => {
        if (exAr.includes(tok) || exTokens.some((ew) => ew === tok)) return true;
        if (tok.length >= 3) {
          const stem = tok.slice(0, Math.max(3, tok.length - 1));
          return exTokens.some((ew) => ew.startsWith(stem) || ew.includes(tok));
        }
        return false;
      })
    );
  }

  // Latin / Cyrillic / Hebrew
  const exNorm = normalizeGeneralText(exampleTarget);
  const exWords = exNorm
    .split(/[\s'-]+/)
    .map((w) => w.replace(/^'+|'+$/g, ''))
    .filter(Boolean);
  if (languageCode === 'he') {
    const extra: string[] = [];
    for (const w of exWords) {
      if (w.length > 2 && /^[הבלמוכש]/.test(w)) {
        extra.push(w.slice(1));
      }
    }
    exWords.push(...extra);
  }

  let stripped = normalizeGeneralText(variant);
  // Strip leading dictionary marker repeatedly if stacked (e.g. "to be", "att ta")
  stripped = stripped.replace(LEADING_DICTIONARY_MARKER_RE, '').trim();
  if (!stripped) return false;

  // Handle "x vs. y" or "x vs y": require EVERY side to match
  if (/\bvs\.?\b/i.test(stripped)) {
    const sides = stripped
      .split(/\bvs\.?\b/i)
      .map((s) => s.trim())
      .filter(Boolean);
    return (
      sides.length >= 2 &&
      sides.every((side) => variantMatchesExample(side, exampleTarget, languageCode))
    );
  }

  if (new RegExp(`(?:^|\\s|-|')${escapeRegExp(stripped)}(?:$|\\s|-|')`).test(exNorm)) {
    return true;
  }

  const rawTokens = stripped
    .split(/[\s'-]+/)
    .map((t) => t.replace(/^'+|'+$/g, ''))
    .filter(Boolean);

  const nonStopTokens = rawTokens.filter((t) => !FUNCTION_STOPWORDS.has(t));
  const tokensToMatch = nonStopTokens.length > 0 ? nonStopTokens : rawTokens;

  return (
    tokensToMatch.length > 0 &&
    tokensToMatch.every((tok) => matchesLatinOrCyrillicToken(tok, exNorm, exWords))
  );
}

export function exampleMatchesWord(
  exampleTarget: string,
  rawWord: string,
  languageCode?: LanguageCode,
): boolean {
  if (!exampleTarget || !rawWord) return false;
  const cleaned = stripGlosses(rawWord);
  if (!cleaned) return false;

  const alternatives = cleaned
    .split(/[\/|,;]+/)
    .map((v) => v.trim())
    .filter(Boolean);

  return alternatives.some((alt) =>
    variantMatchesExample(alt, exampleTarget, languageCode),
  );
}

import type { LanguageCode } from '../types/learning';
import { evaluatePronunciation } from './speech';

export interface PhoneticTipItem {
  ruleTitle: string;
  tipPt: string;
  highlight?: string;
}

export interface PhoneticDrillItem {
  soundLabel: string;
  contrastPair: string;
  practiceSentence: string;
}

export interface PhoneticWordDetail {
  word: string;
  syllables: string[];
  matched: boolean;
  confidence?: number;
}

export interface PhoneticFeedbackResult {
  score: number;
  words: PhoneticWordDetail[];
  phoneticTips: PhoneticTipItem[];
  targetedDrills: PhoneticDrillItem[];
  summaryPt: string;
}

/**
 * Divide palavras em blocos silábicos legíveis para destacar pontos de pronúncia.
 */
export function splitSyllables(rawWord: string): string[] {
  const clean = rawWord.replace(/[.,!?;:¿¡"“”()[\]]/g, '').trim();
  if (!clean) return [rawWord];

  // CJK (Japonês / Chinês): retorna caractere por caractere
  if (/[\u3040-\u30ff\u3400-\u9fff]/.test(clean)) {
    return Array.from(clean);
  }

  if (clean.length <= 3) return [clean];

  // Heurística silábica baseada em núcleos vocálicos (latim + cirílico)
  const vowelRegex = /[aeiouyáéíóúàèìòùâêîôûäöüßаеёиоуыэюя]+[^aeiouyáéíóúàèìòùâêîôûäöüßаеёиоуыэюя]*/gi;
  const matches = clean.match(vowelRegex);
  if (!matches || matches.length <= 1) return [clean];
  return matches;
}

interface PhoneticRule {
  languages: LanguageCode[];
  pattern: RegExp;
  ruleTitle: string;
  tipPt: string;
}

const PHONETIC_RULES: PhoneticRule[] = [
  {
    languages: ['en'],
    pattern: /\b(th|the|this|that|they|there|think|three|with|weather|thanks)\w*/i,
    ruleTitle: 'Som do TH (/θ/ ou /ð/)',
    tipPt: 'Encoste suavemente a ponta da língua entre os dentes superiores e inferiores sem fazer som de "S", "T" ou "F".',
  },
  {
    languages: ['en'],
    pattern: /\w+ed\b/i,
    ruleTitle: 'Terminação -ED no passado',
    tipPt: 'Evite pronunciar "-ed" como sílaba extra ("worked" = /wɜːrkt/, 1 sílaba). Só adicione /ɪd/ após T ou D ("wanted", "needed").',
  },
  {
    languages: ['en'],
    pattern: /\b(r\w+|world|work|water|really|right|wrong)\b/i,
    ruleTitle: 'R retroflexo do Inglês',
    tipPt: 'No início de palavras ("really", "right"), enrole a língua para trás sem encostar no céu da boca (evite som de "R" forte do português).',
  },
  {
    languages: ['es'],
    pattern: /(rr|\br[aeiouáéíóú])/i,
    ruleTitle: 'R vibrante múltipla (RR / R inicial)',
    tipPt: 'Vibre a ponta da língua atrás dos dentes superiores ("perro", "rápido"), sem usar o R gutural da garganta.',
  },
  {
    languages: ['es'],
    pattern: /\b\w*[jg][ei]\w*\b|\b\w*j[aouáóú]\w*\b/i,
    ruleTitle: 'Som forte de J / GE / GI (/x/)',
    tipPt: 'Pronuncie como um "R" forte raspado na garganta ("trabajo", "gente"), nunca como o J de "janela".',
  },
  {
    languages: ['fr'],
    pattern: /(an|am|en|em|on|om|in|im|un)\b|(an|en|on)[^aeiou]/i,
    ruleTitle: 'Vogais Nasais do Francês',
    tipPt: 'Não feche os lábios nem encoste a língua no céu da boca no N/M final ("bon", "france", "matin") — deixe o som sair pelo nariz.',
  },
  {
    languages: ['fr'],
    pattern: /\b\w*(u|ou|eu|œu)\w*\b/i,
    ruleTitle: 'Contraste U (/y/) vs. OU (/u/)',
    tipPt: 'Para "U" ("tu", "rue"), faça bico de "u" tentando falar "i". Para "OU" ("vous", "tout"), use o som fechado de "u" normal.',
  },
  {
    languages: ['it'],
    pattern: /(cc|ll|tt|pp|ss|zz|mm|nn)/i,
    ruleTitle: 'Consoantes Duplas (Geminação)',
    tipPt: 'Segure brevemente a consoante dobrada ("caffè", "tutto", "bella") — a pausa muda o significado ("note" vs. "notte").',
  },
  {
    languages: ['it'],
    pattern: /(gn|gl|sci|sce|chi|che)/i,
    ruleTitle: 'Dígrafos Italianos (GN, GL, SC, CH)',
    tipPt: 'GN = "nh" ("gnocchi"), GLI = "lh" ("famiglia"), CHE/CHI = som de "K" ("perché"), SCE/SCI = "xê/xi".',
  },
  {
    languages: ['de'],
    pattern: /(ch|ich|ach|sp|st|sch|ü|ö|ä)/i,
    ruleTitle: 'Sons Típicos do Alemão (CH, SCH, Umlaute)',
    tipPt: '"ich" é suave perto do céu da boca; após a/o/u ("ach", "Buch") é raspado atrás. Em "ü/ö", arredonde os lábios enquanto fala "i/e".',
  },
  {
    languages: ['ru'],
    pattern: /[ьыжшщчц]/i,
    ruleTitle: 'Consoantes Suaves (Ь) e Vogal Ы',
    tipPt: 'O sinal brando (Ь) suaviza a consoante anterior como um leve "i" oculto. Em Ы, puxe a língua para trás mantendo os lábios relaxados.',
  },
  {
    languages: ['ru'],
    pattern: /[оа]/i,
    ruleTitle: 'Redução Vocálica (Аканье)',
    tipPt: 'Em Russo, a letra "О" sem acento tônico soa como um "A" aberto suave (ex.: "хорошо" = kha-ra-SHÔ).',
  },
  {
    languages: ['ja'],
    pattern: /[っーおうえい]/,
    ruleTitle: 'Vogais Longas e Pausa Sokuon (っ)',
    tipPt: 'Respeite a duração dupla em "ー/おう/えい" e faça uma micro-pausa antes de consoantes dobradas com "っ" (ex.: ki-tte).',
  },
  {
    languages: ['zh'],
    pattern: /[\u4e00-\u9fff]/,
    ruleTitle: 'Contorno dos 4 Tons do Mandarim',
    tipPt: 'Mantenha cada tom nítido: 1º alto e plano (55), 2º subindo (35), 3º descendo e subindo (214), 4º caindo firme (51).',
  },
  {
    languages: ['ar'],
    pattern: /[\u062d\u0639\u062e\u063a\u0642\u0635\u0636\u0637\u0638]/,
    ruleTitle: 'Consoantes Faríngeas e Enfáticas do Árabe',
    tipPt: 'Diferencie ح (/ħ/ sopro forte da faringe) de هـ (/h/ leve), e ق (/q/ úvula) de ك (/k/). Em ص/ض/ط/ظ, abaixe a parte posterior da língua.',
  },
  {
    languages: ['nl'],
    pattern: /(ui|ij|ei|eu|sch|g)/i,
    ruleTitle: 'Ditongos UI/IJ/EU e G Gutural (Holandês)',
    tipPt: 'O "ui" mistura lábios arredondados de "o" com "i"; "ij/ei" soam próximos a "êi" aberto; e o "g/ch" vibra suave na garganta (especialmente na Holanda).',
  },
  {
    languages: ['af'],
    pattern: /(g|ui|y|aa|ee|oo|uu)/i,
    ruleTitle: 'Vogais Longas e G Gutural (Africâner)',
    tipPt: 'Vogais duplas ("aa", "ee", "oo", "uu") são alongadas e puras. O "g" inicial ou medial tem som gutural vibrante, e "nie ... nie" fecha o ritmo da negativa.',
  },
  {
    languages: ['sv'],
    pattern: /(sj|sk|stj|tj|kj|å|ä|ö)/i,
    ruleTitle: 'Sons SJ/TJ e Vogais Å/Ä/Ö (Sueco)',
    tipPt: 'O som "sj/sk(+e,i,y,ä,ö)" é um sopro arredondado único do sueco (/ɧ/). "å" soa como "ô" fechado, "ä" como "é" aberto e "ö" como "ê" com lábios arredondados.',
  },
];

export function analyzePhoneticFeedback(
  target: string,
  spoken: string,
  languageCode: LanguageCode = 'en',
  wordConfidences?: Array<{ word: string; probability?: number }>,
): PhoneticFeedbackResult {
  const base = evaluatePronunciation(target, spoken);
  const confMap = new Map<string, number>();
  for (const wc of wordConfidences ?? []) {
    if (typeof wc.probability === 'number') {
      confMap.set(wc.word.trim().toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''), wc.probability);
    }
  }

  const words: PhoneticWordDetail[] = base.words.map((w) => {
    const key = w.word.trim().toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    const conf = confMap.get(key);
    return {
      word: w.word,
      syllables: splitSyllables(w.word),
      matched: w.matched && (conf === undefined || conf >= 0.45),
      confidence: conf,
    };
  });

  const missedWords = words.filter((w) => !w.matched).map((w) => w.word);
  const probeText = missedWords.length > 0 ? missedWords.join(' ') : target;

  const tips: PhoneticTipItem[] = [];
  for (const rule of PHONETIC_RULES) {
    if (!rule.languages.includes(languageCode)) continue;
    const match = probeText.match(rule.pattern) ?? target.match(rule.pattern);
    if (match) {
      tips.push({
        ruleTitle: rule.ruleTitle,
        tipPt: rule.tipPt,
        highlight: match[0],
      });
    }
    if (tips.length >= 2) break;
  }

  const DRILL_BY_LANG: Partial<Record<LanguageCode, PhoneticDrillItem[]>> = {
    en: [
      { soundLabel: '/θ/ vs /t/', contrastPair: 'think vs. tink · three vs. tree', practiceSentence: 'I think these three things work together.' },
      { soundLabel: '/ɪ/ vs /iː/', contrastPair: 'live vs. leave · ship vs. sheep', practiceSentence: 'Please leave the ship before evening.' },
    ],
    es: [
      { soundLabel: 'RR / R', contrastPair: 'pero vs. perro · caro vs. carro', practiceSentence: 'El perro corre rápido por el parque.' },
    ],
    fr: [
      { soundLabel: 'U /y/ vs OU /u/', contrastPair: 'tu vs. tout · rue vs. roue', practiceSentence: 'Tu veux tout voir dans cette rue ?' },
    ],
    de: [
      { soundLabel: 'Ü / Ö / CH', contrastPair: 'müssen vs. messen · ich vs. ach', practiceSentence: 'Ich möchte heute pünktlich zurückkommen.' },
    ],
    ru: [
      { soundLabel: 'Ы vs И / Ь', contrastPair: 'быть vs. бить · мыло vs. мило', practiceSentence: 'Мы были рады видеть вас сегодня.' },
    ],
    zh: [
      { soundLabel: 'Tons 1–4', contrastPair: 'mā (mãe) vs. mǎ (cavalo)', practiceSentence: '妈妈今天买了一个新手机。' },
    ],
    ja: [
      { soundLabel: 'Vogais Longas & っ', contrastPair: 'kite (vir) vs. kitte (selo)', practiceSentence: '郵便局で切手を三枚買いました。' },
    ],
    ar: [
      { soundLabel: 'ح vs هـ / ق vs ك', contrastPair: 'قلب (coração) vs. كلب (cachorro)', practiceSentence: 'الحمد لله، قهوة الصباح جاهزة.' },
    ],
  };

  const targetedDrills = missedWords.length > 0 ? (DRILL_BY_LANG[languageCode] ?? []) : [];

  let summaryPt = '';
  if (base.score >= 90) {
    summaryPt =
      'Excelente clareza fonética! Todas as sílabas-chave foram reconhecidas com precisão.';
  } else if (base.score >= 70) {
    summaryPt = `Boa pronúncia (${base.score}%). Foque nas sílabas destacadas em vermelho e ouça novamente em 0.75x.`;
  } else {
    summaryPt = `Precisa de reforço (${base.score}%). Pratique devagar em 0.75x sílaba por sílaba antes de acelerar.`;
  }

  return {
    score: base.score,
    words,
    phoneticTips: tips,
    targetedDrills,
    summaryPt,
  };
}

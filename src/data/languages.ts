import type { LanguageCode, LanguageCourse, Topic, VocabCard } from '../types/learning';
import { GRAMMAR_TOPICS_A1_A2, GRAMMAR_VOCAB_A1_A2 } from './curriculum/grammarA1A2';
import { GRAMMAR_TOPICS_B1_B2, GRAMMAR_VOCAB_B1_B2 } from './curriculum/grammarB1B2';
import { GRAMMAR_TOPICS_C1, GRAMMAR_VOCAB_C1 } from './curriculum/grammarC1';
import { TOPICS_A1, VOCAB_A1 } from './curriculum/levelA1';
import { TOPICS_A2, VOCAB_A2 } from './curriculum/levelA2';
import { TOPICS_B1, VOCAB_B1 } from './curriculum/levelB1';
import { TOPICS_B2, VOCAB_B2 } from './curriculum/levelB2';
import { TOPICS_C1, VOCAB_C1 } from './curriculum/levelC1';
import { TOPICS_EN_SPECIAL, VOCAB_EN_SPECIAL } from './curriculum/enSpecialTracks';
import { TOPICS_EN_EXPANSION, VOCAB_EN_EXPANSION } from './curriculum/enExpansion';
import { SPANISH_ALL_TOPICS, SPANISH_ALL_VOCAB } from './curriculum/spanishCourse';
import { FRENCH_ALL_TOPICS, FRENCH_ALL_VOCAB } from './curriculum/frenchCourse';
import { ITALIAN_ALL_TOPICS, ITALIAN_ALL_VOCAB } from './curriculum/italianExtra';
import { GERMAN_ALL_TOPICS, GERMAN_ALL_VOCAB } from './curriculum/germanExtra';
import { RUSSIAN_ALL_TOPICS, RUSSIAN_ALL_VOCAB } from './curriculum/russianExtra';
import { JAPANESE_ALL_TOPICS, JAPANESE_ALL_VOCAB } from './curriculum/japaneseExtra';
import { CHINESE_ALL_TOPICS, CHINESE_ALL_VOCAB } from './curriculum/chineseExtra';

export const LANGUAGE_COURSES: LanguageCourse[] = [
  {
    code: 'en',
    namePt: 'Inglês',
    nativeName: 'English',
    flag: '🇬🇧',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 60 unidades (imersão B2/C1 em inglês), 100+ guias gramaticais, ditado, pares mínimos, histórias e Tutor IA.',
    dialects: [
      { code: 'en-US', label: 'Americano', flag: '🇺🇸' },
      { code: 'en-GB', label: 'Britânico', flag: '🇬🇧' },
    ],
  },
  {
    code: 'es',
    namePt: 'Espanhol',
    nativeName: 'Español',
    flag: '🇪🇸',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 50 unidades (imersão B2/C1 em espanhol), 100 guias gramaticais, vozes neurais (ES/MX) e combate ao portunhol.',
    dialects: [
      { code: 'es-ES', label: 'Espanha', flag: '🇪🇸' },
      { code: 'es-MX', label: 'México', flag: '🇲🇽' },
    ],
  },
  {
    code: 'fr',
    namePt: 'Francês',
    nativeName: 'Français',
    flag: '🇫🇷',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 50 unidades (imersão B2/C1 em francês), 100 guias gramaticais, vozes neurais Gemini (FR/CA) e ligações fonéticas.',
    dialects: [
      { code: 'fr-FR', label: 'França', flag: '🇫🇷' },
      { code: 'fr-CA', label: 'Canadá', flag: '🇨🇦' },
    ],
  },
  {
    code: 'it',
    namePt: 'Italiano',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 50 unidades (imersão B2/C1 em italiano), 100 guias gramaticais, vozes neurais Gemini (IT/CH) e falsos amigos BR.',
    dialects: [
      { code: 'it-IT', label: 'Itália', flag: '🇮🇹' },
      { code: 'it-CH', label: 'Suíça (IT)', flag: '🇨🇭' },
    ],
  },
  {
    code: 'de',
    namePt: 'Alemão',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 50 unidades (imersão B2/C1 em alemão), 100 guias gramaticais, vozes neurais Gemini (DE/AT) e casos/TeKaMoLo.',
    dialects: [
      { code: 'de-DE', label: 'Alemanha', flag: '🇩🇪' },
      { code: 'de-AT', label: 'Áustria', flag: '🇦🇹' },
    ],
  },
  {
    code: 'ru',
    namePt: 'Russo',
    nativeName: 'Русский',
    flag: '🇷🇺',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 com 50 unidades (imersão B2/C1 em russo), 100 guias gramaticais, vozes neurais Gemini (Moscou/S. Petersburgo), cirílico e os 6 casos.',
    dialects: [
      { code: 'ru-RU', label: 'Moscou', flag: '🇷🇺' },
      { code: 'ru-SPB', label: 'S. Petersburgo', flag: '🏛️' },
    ],
  },
  {
    code: 'ja',
    namePt: 'Japonês',
    nativeName: '日本語',
    flag: '🇯🇵',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 (JLPT N5–N1) com 50 unidades (imersão B2/C1 em japonês), 100 guias gramaticais, vozes neurais Gemini (Tóquio/Kansai) e Keigo.',
    dialects: [
      { code: 'ja-JP', label: 'Tóquio', flag: '🇯🇵' },
      { code: 'ja-KANSAI', label: 'Kansai', flag: '🏯' },
    ],
  },
  {
    code: 'zh',
    namePt: 'Chinês',
    nativeName: '中文',
    flag: '🇨🇳',
    available: true,
    descriptionPt:
      'Curso completo CEFR A1–C1 (HSK 1–6) com 50 unidades (imersão B2/C1 em mandarim), 100 guias gramaticais, vozes neurais Gemini (Pequim/Taiwan), tons e Pinyin.',
    dialects: [
      { code: 'zh-CN', label: 'Mandarim (CN)', flag: '🇨🇳' },
      { code: 'zh-TW', label: 'Taiwan (TW)', flag: '🇹🇼' },
    ],
  },
];

export const SPANISH_STARTER_TOPICS: Topic[] = [
  {
    id: 'es-greetings-a1',
    languageCode: 'es',
    titlePt: 'Cumprimentos e Falsos Amigos no Espanhol',
    titleEn: 'Saludos e Primeras Impresiones',
    subtitle: 'Apresente-se em espanhol evitando o famoso "portunhol" desde a primeira aula.',
    level: 'A1',
    estimatedMinutes: 8,
    icon: 'Hand',
    color: '#D97706',
    topicTipsSummary: [
      'Diferença de formalidade: Tú (informal) vs. Usted (formal)',
      'Falso amigo clássico: "Embarazada" significa grávida (não envergonhada!)',
    ],
    steps: [
      {
        id: 'es-g-tip-1',
        type: 'tip',
        tip: {
          id: 'tip-es-greetings',
          category: 'false_friend',
          title: 'Portunhol Zero: "Embarazada" e "Encantado/a"',
          summary: 'Nunca diga "estoy embarazada" para "estou com vergonha"! Use "me da vergüenza".',
          details:
            'Por serem idiomas parecidos, brasileiros caem rápido em falsos amigos. Para dizer "prazer em conhecê-lo(a)", diga "Mucho gusto" ou "Encantado / Encantada". E no Presente do verbo Llamarse: "Me llamo..." (pronúncia de "ll" próxima a "i" ou "dj").',
          grammarFormula: {
            aff: '[+] Yo soy / Me llamo...  |  Tú eres / Te llamas...',
            neg: '[-] Yo no soy / No me llamo...',
            int: '[?] ¿Cómo te llamas?  |  ¿De dónde eres?',
          },
          examples: [
            {
              en: '¡Hola! Me llamo Sofía y soy de Brasil. ¡Mucho gusto!',
              pt: 'Olá! Meu nome é Sofia e sou do Brasil. Muito prazer!',
            },
            {
              en: '¿Cómo estás hoy? Muy bien, gracias, ¿y tú?',
              pt: 'Como você está hoje? Muito bem, obrigado, e você?',
            },
          ],
        },
      },
      {
        id: 'es-g-listen-1',
        type: 'listening',
        speakerLabel: 'Diálogo Inicial · Madri',
        contextPt: 'Ouça Mateo se apresentando e identifique sua cidade e profissão.',
        audioText:
          '¡Hola! Buenos días. Me llamo Mateo, soy de Madrid y trabajo como profesor de idiomas. ¡Mucho gusto en conocerte!',
        question: 'De onde é o Mateo e o que ele faz?',
        options: [
          'É de Buenos Aires e trabalha como médico.',
          'É de Madri e trabalha como professor de idiomas.',
          'É de Lisboa e estuda engenharia.',
          'Mora no México e trabalha em um café.',
        ],
        correctIndex: 1,
        explanation: 'Mateo diz: "soy de Madrid y trabajo como profesor de idiomas".',
        hintTip: 'Preste atenção após "soy de..." e "trabajo como...".',
      },
      {
        id: 'es-g-read-1',
        type: 'reading',
        title: 'Boas-vindas no Grupo de Espanhol',
        format: 'chat',
        text: "¡Bienvenidos al grupo! Soy Elena y actualmente vivo en Ciudad de México. No tengan vergüenza de hablar desde hoy—todavía estoy aprendiendo portugués también. ¡Nos vemos pronto!",
        glossary: [
          {
            word: 'actualmente',
            translation: 'atualmente (aqui é amigo verdadeiro em espanhol!)',
            ipa: '/ak.twalˈmen.te/',
            note: 'Diferente do inglês "actually", em espanhol "actualmente" significa mesmo atualmente!',
          },
          {
            word: 'vergüenza',
            translation: 'vergonha',
            ipa: '/beɾˈɣwen.θa/',
            note: 'Nunca confunda com "embarazada" (grávida).',
          },
          {
            word: 'todavía',
            translation: 'ainda (falso cognato!)',
            ipa: '/to.ðaˈβi.a/',
            note: 'NÃO significa "todavia/porém"! Em espanhol "todavía" = ainda.',
          },
        ],
        question: 'Qual recado Elena deixou sobre falar no grupo?',
        options: [
          'Que todos só podem escrever depois de seis meses.',
          'Que não tenham vergonha de falar desde hoje.',
          'Que ela já é completamente fluente em português.',
          'Que mora atualmente em Barcelona.',
        ],
        correctIndex: 1,
        explanation: 'Ela escreveu: "No tengan vergüenza de hablar desde hoy".',
        hintTip: 'Clique em "todavía" no texto — é um falso amigo super famoso!',
      },
      {
        id: 'es-g-match-1',
        type: 'matching',
        promptPt: 'Conecte cada expressão em espanhol ao seu significado real:',
        pairs: [
          { id: 'es1', target: '¡Mucho gusto!', pt: 'Prazer em conhecer!' },
          { id: 'es2', target: 'Todavía', pt: 'Ainda (falso amigo)' },
          { id: 'es3', target: '¿De dónde eres?', pt: 'De onde você é?' },
          { id: 'es4', target: 'Vergüenza', pt: 'Vergonha' },
        ],
        hintTip: 'Lembre-se de que "todavía" em espanhol significa "ainda"!',
      },
      {
        id: 'es-g-fill-1',
        type: 'fill_blank',
        promptPt: 'Complete a apresentação natural em espanhol:',
        sentenceBefore: '¡Hola! ',
        sentenceAfter: ' Lucas y vivo en São Paulo.',
        verbHint: 'chamar-se (yo)',
        options: ['Me llamo', 'Me lamo', 'Soy llamo', 'Te llamas'],
        correctIndex: 0,
        explanation: 'Para dizer seu nome em espanhol, usamos "Me llamo..." (com dois LL).',
        hintTip: 'Primeira pessoa de "llamarse".',
      },
      {
        id: 'es-g-speak-1',
        type: 'speaking',
        promptPt: 'Pratique sua apresentação inicial em espanhol:',
        targetSentence: 'Hola, me llamo Ana y soy de Brasil. ¡Mucho gusto!',
        translationPt: 'Olá, meu nome é Ana e sou do Brasil. Muito prazer!',
        ipa: '/ˈo.la me ˈʝa.mo ˈa.na i ˈsoi ðe βɾaˈsil ˈmu.tʃo ˈɣus.to/',
        brPhoneticHint: 'Ô-la, mê IÁ-mo Á-na i sôi dê bra-SIL. MÚ-tcho GÚS-to!',
        focusTip: 'O "H" de "Hola" é sempre mudo, e o "ll" de "llamo" soa como "i" ou "dj".',
      },
      {
        id: 'es-g-builder-1',
        type: 'writing_builder',
        promptPt: 'Monte a pergunta em espanhol: "Como você se chama e de onde é?"',
        targetSentence: '¿Cómo te llamas y de dónde eres?',
        words: ['¿Cómo', 'te', 'llamas', 'y', 'de', 'dónde', 'eres?'],
        distractors: ['todavía', 'gusto'],
        explanation: 'Usamos "¿Cómo te llamas?" + "y de dónde eres?".',
        hintTip: 'Comece com "¿Cómo te...".',
      },
      {
        id: 'es-g-free-1',
        type: 'writing_free',
        promptPt: 'Escreva sua apresentação curta em espanhol.',
        scenarioPt:
          'Cumprimente ("Hola / Buenos días"), diga seu nome ("Me llamo...") e sua cidade ou país ("Soy de / Vivo en").',
        minWords: 7,
        checklist: [
          { label: 'Saudação em espanhol (Hola / Buenos días / Buenas)', keywords: ['hola', 'buenos', 'buenas'] },
          { label: 'Nome ou origem (Me llamo / Soy / Vivo)', keywords: ['llamo', 'soy', 'vivo', 'mucho gusto'] },
        ],
        modelAnswer:
          '¡Hola a todos! Me llamo Gabriel, soy de Brasil y vivo en Recife. ¡Mucho gusto!',
        hintTip: 'Finalize com "¡Mucho gusto!"!',
      },
    ],
  },
];

export const SPANISH_VOCAB: VocabCard[] = [
  {
    id: 'voc-es-1',
    topicId: 'es-greetings-a1',
    languageCode: 'es',
    word: 'Me llamo...',
    translation: 'Meu nome é / Eu me chamo...',
    ipa: '/me ˈʝa.mo/',
    exampleEn: '¡Hola! Me llamo Carlos.',
    examplePt: 'Olá! Meu nome é Carlos.',
    category: 'Apresentação',
    strength: 'weak',
    reviewCount: 0,
  },
  {
    id: 'voc-es-2',
    topicId: 'es-greetings-a1',
    word: '¡Mucho gusto!',
    languageCode: 'es',
    translation: 'Muito prazer!',
    ipa: '/ˈmu.tʃo ˈɣus.to/',
    exampleEn: 'Encantado de conocerte, ¡mucho gusto!',
    examplePt: 'Encantado em te conhecer, muito prazer!',
    category: 'Cortesia',
    strength: 'medium',
    reviewCount: 1,
  },
  {
    id: 'voc-es-3',
    topicId: 'es-greetings-a1',
    languageCode: 'es',
    word: 'Todavía',
    translation: 'Ainda (falso amigo — não é todavia!)',
    ipa: '/to.ðaˈβi.a/',
    exampleEn: 'Todavía estoy aprendiendo español.',
    examplePt: 'Ainda estou aprendendo espanhol.',
    category: 'Falso Amigo',
    strength: 'weak',
    reviewCount: 0,
  },
  {
    id: 'voc-es-4',
    topicId: 'es-greetings-a1',
    languageCode: 'es',
    word: 'Vergüenza',
    translation: 'Vergonha (não use embarazada)',
    ipa: '/beɾˈɣwen.θa/',
    exampleEn: 'No tengas vergüenza de hablar español.',
    examplePt: 'Não tenha vergonha de falar espanhol.',
    category: 'Falso Amigo',
    strength: 'weak',
    reviewCount: 0,
  },
];

const LEVEL_ORDER: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };

export const ENGLISH_ALL_TOPICS: Topic[] = [
  ...TOPICS_A1,
  ...GRAMMAR_TOPICS_A1_A2.filter((t) => t.level === 'A1'),
  ...TOPICS_A2,
  ...GRAMMAR_TOPICS_A1_A2.filter((t) => t.level === 'A2'),
  ...TOPICS_B1,
  ...GRAMMAR_TOPICS_B1_B2.filter((t) => t.level === 'B1'),
  ...TOPICS_B2,
  ...GRAMMAR_TOPICS_B1_B2.filter((t) => t.level === 'B2'),
  ...TOPICS_C1,
  ...GRAMMAR_TOPICS_C1,
  ...TOPICS_EN_SPECIAL,
  ...TOPICS_EN_EXPANSION,
]
  .map((t) => ({ ...t, languageCode: t.languageCode ?? ('en' as LanguageCode) }))
  .sort((a, b) => (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9));

export const ENGLISH_ALL_VOCAB: VocabCard[] = [
  ...VOCAB_A1,
  ...VOCAB_A2,
  ...VOCAB_B1,
  ...VOCAB_B2,
  ...VOCAB_C1,
  ...GRAMMAR_VOCAB_A1_A2,
  ...GRAMMAR_VOCAB_B1_B2,
  ...GRAMMAR_VOCAB_C1,
  ...VOCAB_EN_SPECIAL,
  ...VOCAB_EN_EXPANSION,
].map((v) => ({ ...v, languageCode: v.languageCode ?? ('en' as LanguageCode) }));

export {
  SPANISH_ALL_TOPICS,
  SPANISH_ALL_VOCAB,
  FRENCH_ALL_TOPICS,
  FRENCH_ALL_VOCAB,
  ITALIAN_ALL_TOPICS,
  ITALIAN_ALL_VOCAB,
  GERMAN_ALL_TOPICS,
  GERMAN_ALL_VOCAB,
  RUSSIAN_ALL_TOPICS,
  RUSSIAN_ALL_VOCAB,
  JAPANESE_ALL_TOPICS,
  JAPANESE_ALL_VOCAB,
  CHINESE_ALL_TOPICS,
  CHINESE_ALL_VOCAB,
};

export function getLanguageCourse(code: LanguageCode): LanguageCourse {
  return (
    LANGUAGE_COURSES.find((c) => c.code === code) ?? LANGUAGE_COURSES[0]
  );
}

export function getCourseTopics(
  languageCode: LanguageCode,
  customTopics: Topic[],
): Topic[] {
  const builtin =
    languageCode === 'en'
      ? ENGLISH_ALL_TOPICS
      : languageCode === 'es'
        ? SPANISH_ALL_TOPICS
        : languageCode === 'fr'
          ? FRENCH_ALL_TOPICS
          : languageCode === 'it'
            ? ITALIAN_ALL_TOPICS
            : languageCode === 'de'
              ? GERMAN_ALL_TOPICS
              : languageCode === 'ru'
                ? RUSSIAN_ALL_TOPICS
                : languageCode === 'ja'
                  ? JAPANESE_ALL_TOPICS
                  : languageCode === 'zh'
                    ? CHINESE_ALL_TOPICS
                    : [];
  const custom = customTopics.filter(
    (t) => (t.languageCode ?? 'en') === languageCode,
  );
  return [...builtin, ...custom];
}

export function getActiveDialect(
  activeLanguage: LanguageCode,
  dialectByLanguage: Record<string, string> | undefined,
  fallbackAccent: string,
): string {
  const saved = dialectByLanguage?.[activeLanguage];
  if (saved) return saved;
  if (activeLanguage === 'en') return fallbackAccent || 'en-US';
  return getLanguageCourse(activeLanguage).dialects[0]?.code ?? 'en-US';
}

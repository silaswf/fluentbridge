import {
  CLOUD_GEMINI_PROXY_TOKEN,
  DEFAULT_BACKEND_API_URL,
} from '../config/appConfig';
import {
  AI_TUTOR_SCENARIOS,
  UNIT_ROLEPLAY_ANGLES,
  type UnitRoleplayAngle,
} from '../data/tutorScenarios';
import type {
  AITutorScenario,
  CEFRLevel,
  LanguageCode,
  Topic,
  TutorMessage,
} from '../types/learning';
import { isImmersionLevel } from './immersion';

export { AI_TUTOR_SCENARIOS, UNIT_ROLEPLAY_ANGLES, type UnitRoleplayAngle };

export interface TutorReplyResult {
  replyEn: string;
  replyPt: string;
  feedbackPt: string;
  correctedEn?: string;
  suggestions: string[];
  usedGemini: boolean;
}

interface MistakeRule {
  pattern: RegExp;
  feedbackPt: string;
  fix: (text: string) => string;
}

const BRAZILIAN_MISTAKE_RULES: MistakeRule[] = [
  {
    pattern: /\bi have \d+ years\b/i,
    feedbackPt:
      'Dica: Em inglês, idade usa o verbo TO BE ("I am ... years old"), nunca "I have ... years".',
    fix: (t) => t.replace(/\bi have (\d+) years(\s+old)?\b/i, "I'm $1 years old"),
  },
  {
    pattern: /\bi want\b/i,
    feedbackPt:
      'Dica de cortesia: em pedidos e atendimentos, troque "I want" por "I\'d like" para soar mais educado.',
    fix: (t) => t.replace(/\bi want\b/i, "I'd like"),
  },
  {
    pattern: /\bluggages\b/i,
    feedbackPt: 'Atenção: "luggage" é incontável em inglês! Nunca coloque "-s".',
    fix: (t) => t.replace(/\bluggages\b/gi, 'luggage'),
  },
  {
    pattern: /\binformations\b/i,
    feedbackPt: 'Atenção: "information" nunca recebe "-s" em inglês.',
    fix: (t) => t.replace(/\binformations\b/gi, 'information'),
  },
  {
    pattern: /\bpretend to\b/i,
    feedbackPt:
      'Falso cognato! "Pretend" significa fingir. Para "pretender", use "intend to".',
    fix: (t) => t.replace(/\bpretend to\b/gi, 'intend to'),
  },
  {
    pattern: /\bdepends of\b/i,
    feedbackPt: 'Preposição: em inglês dizemos "depend ON", não "depend of".',
    fix: (t) => t.replace(/\bdepends of\b/gi, 'depends on'),
  },
  {
    pattern: /\bi'm agree\b|\bi am agree\b/i,
    feedbackPt: '"Agree" é verbo, não adjetivo! Diga apenas "I agree".',
    fix: (t) => t.replace(/\b(i'm|i am) agree\b/gi, 'I agree'),
  },
  {
    pattern: /\bembarazada\b/i,
    feedbackPt:
      'Falso amigo em espanhol! "Embarazada" significa grávida; para vergonha use "me da vergüenza".',
    fix: (t) => t.replace(/\bestoy embarazada\b/gi, 'me da vergüenza'),
  },
  {
    pattern: /\bje veux\b/i,
    feedbackPt:
      'Em francês, "Je veux" soa seco em atendimentos; prefira "Je voudrais..."!',
    fix: (t) => t.replace(/\bje veux\b/gi, 'Je voudrais'),
  },
  {
    pattern: /\bich will\b/i,
    feedbackPt:
      'Em alemão, "Ich will" em pedidos soa abrupto; prefira "Ich möchte..."!',
    fix: (t) => t.replace(/\bich will\b/gi, 'Ich möchte'),
  },
];

const LANG_NAME_EN: Record<LanguageCode, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  it: 'Italian',
  de: 'German',
};

function analyzeStudentInput(
  text: string,
  lang: LanguageCode,
  level: CEFRLevel,
): { feedbackPt: string; correctedEn?: string } {
  const trimmed = text.trim();
  for (const rule of BRAZILIAN_MISTAKE_RULES) {
    if (rule.pattern.test(trimmed)) {
      return {
        feedbackPt: rule.feedbackPt,
        correctedEn: rule.fix(trimmed),
      };
    }
  }

  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  if (isImmersionLevel(level)) {
    const immersionFeedback: Record<LanguageCode, string> = {
      en: wordCount <= 3
        ? 'Good quick reply—try expanding with a concrete reason or follow-up question.'
        : 'Natural flow! Keep using connectors and nuanced phrasing to deepen the exchange.',
      es: wordCount <= 3
        ? 'Buena respuesta breve; intenta ampliarla con un matiz o una pregunta de seguimiento.'
        : '¡Excelente naturalidad! Sigue conectando ideas con precisión.',
      fr: wordCount <= 3
        ? 'Bonne réponse rapide ; essayez de développer avec une justification ou une question.'
        : 'Très naturel ! Continuez à nuancer vos propos avec des connecteurs.',
      it: wordCount <= 3
        ? 'Buona risposta rapida; prova ad aggiungere una motivazione o una domanda.'
        : 'Ottima fluidità! Continua a collegare le idee con naturalezza.',
      de: wordCount <= 3
        ? 'Gute kurze Antwort – baue gern eine Begründung oder Rückfrage ein.'
        : 'Sehr natürlich! Nutze weiterhin klare Nebensätze und Konnektoren.',
    };
    return { feedbackPt: immersionFeedback[lang] };
  }

  if (wordCount <= 3) {
    return {
      feedbackPt:
        'Boa resposta rápida! Tente expandir com um motivo ou uma pergunta de volta para praticar fluência.',
    };
  }
  if (/\?$/.test(trimmed)) {
    return {
      feedbackPt: 'Ótima pergunta natural! Manter o diálogo ativo acelera sua fluência.',
    };
  }
  return {
    feedbackPt: 'Boa construção! Continue mantendo o tom natural e respondendo ao contexto.',
  };
}

function buildMultiLangLocalFallbackTurn(
  scenario: AITutorScenario,
  userText: string,
  turnCount: number,
): Omit<TutorReplyResult, 'feedbackPt' | 'correctedEn' | 'usedGemini'> {
  const lang = scenario.languageCode ?? 'en';
  const askedQuestion = /\?$/.test(userText.trim());
  const isClosing = turnCount >= 3;

  const bank: Record<
    LanguageCode,
    {
      askReply: string;
      askReplyPt: string;
      followReply: string;
      followReplyPt: string;
      closeReply: string;
      closeReplyPt: string;
      suggestions: string[];
    }
  > = {
    en: {
      askReply:
        'Great question! Yes, we can certainly arrange that. Which option works best for your schedule?',
      askReplyPt:
        'Ótima pergunta! Sim, certamente podemos organizar isso. Qual opção funciona melhor para a sua agenda?',
      followReply:
        'That makes total sense. Could you clarify one small detail so we get everything right?',
      followReplyPt:
        'Faz todo sentido. Você poderia esclarecer um pequeno detalhe para deixarmos tudo certo?',
      closeReply:
        'Perfect, everything is confirmed on my end! Thanks for practicing—feel free to add anything else.',
      closeReplyPt:
        'Perfeito, tudo confirmado por aqui! Obrigado por praticar — fique à vontade para acrescentar algo.',
      suggestions: [
        'That works for me! Could we confirm the exact time?',
        'Just to double-check, is there anything else I should prepare?',
        'Thank you very much for your help today!',
      ],
    },
    es: {
      askReply:
        '¡Muy buena pregunta! Por supuesto, podemos organizarlo así. ¿Qué alternativa prefieres?',
      askReplyPt:
        'Ótima pergunta! Com certeza podemos organizar assim. Qual alternativa você prefere?',
      followReply:
        'Entiendo perfectamente. ¿Podrías darme un detalle más para dejarlo todo listo?',
      followReplyPt:
        'Entendo perfeitamente. Poderia me dar mais um detalhe para deixar tudo pronto?',
      closeReply:
        '¡Perfecto, queda todo confirmado! Muchas gracias por tu amabilidad.',
      closeReplyPt:
        'Perfeito, fica tudo confirmado! Muito obrigado pela gentileza.',
      suggestions: [
        '¡Genial! ¿Me confirmas el horario exacto, por favor?',
        'Para estar seguro, ¿necesito llevar algún documento?',
        '¡Muchas gracias por tu ayuda!',
      ],
    },
    fr: {
      askReply:
        'Excellente question ! Bien sûr, c’est tout à fait possible. Quelle option préférez-vous ?',
      askReplyPt:
        'Excelente pergunta! Claro, é totalmente possível. Qual opção você prefere?',
      followReply:
        'Je comprends très bien. Pourriez-vous préciser un petit détail afin que tout soit parfait ?',
      followReplyPt:
        'Entendo muito bem. Poderia precisar um pequeno detalhe para que tudo fique perfeito?',
      closeReply:
        'Parfait, tout est bien noté ! Merci beaucoup et très bonne journée !',
      closeReplyPt:
        'Perfeito, tudo anotado! Muito obrigado e ótimo dia!',
      suggestions: [
        'Très bien ! Pouvez-vous me confirmer l’horaire exact ?',
        'Juste pour vérifier, y a-t-il autre chose à prévoir ?',
        'Merci beaucoup pour votre aide !',
      ],
    },
    it: {
      askReply:
        'Ottima domanda! Certamente possiamo organizzarlo. Quale soluzione preferisce?',
      askReplyPt:
        'Ótima pergunta! Certamente podemos organizar isso. Qual solução prefere?',
      followReply:
        'Capisco perfettamente. Potrebbe chiarire un piccolo dettaglio così confermiamo tutto?',
      followReplyPt:
        'Entendo perfeitamente. Poderia esclarecer um pequeno detalhe para confirmarmos tudo?',
      closeReply:
        'Perfetto, è tutto confermato! Grazie mille e buona giornata!',
      closeReplyPt:
        'Perfeito, está tudo confirmado! Muito obrigado e bom dia!',
      suggestions: [
        'Perfetto! Mi può confermare l’orario preciso?',
        'Giusto per sicurezza, serve qualcos’altro?',
        'Grazie mille per la disponibilità!',
      ],
    },
    de: {
      askReply:
        'Gute Frage! Ja, das lässt sich problemlos einrichten. Welche Option passt Ihnen besser?',
      askReplyPt:
        'Boa pergunta! Sim, isso pode ser ajustado sem problemas. Qual opção funciona melhor?',
      followReply:
        'Das verstehe ich gut. Könnten Sie noch ein kleines Detail präzisieren, damit alles passt?',
      followReplyPt:
        'Entendo bem. Poderia precisar um pequeno detalhe para que tudo dê certo?',
      closeReply:
        'Perfekt, dann ist alles bestätigt! Vielen Dank und einen schönen Tag noch!',
      closeReplyPt:
        'Perfeito, então está tudo confirmado! Muito obrigado e ótimo dia!',
      suggestions: [
        'Das passt mir gut! Könnten wir die genaue Uhrzeit bestätigen?',
        'Nur zur Sicherheit: Brauche ich noch etwas Bestimmtes?',
        'Vielen Dank für Ihre Hilfe!',
      ],
    },
  };

  const entry = bank[lang] ?? bank.en;
  if (isClosing) {
    return {
      replyEn: entry.closeReply,
      replyPt: isImmersionLevel(scenario.level) ? entry.closeReply : entry.closeReplyPt,
      suggestions: entry.suggestions,
    };
  }
  if (askedQuestion) {
    return {
      replyEn: entry.askReply,
      replyPt: isImmersionLevel(scenario.level) ? entry.askReply : entry.askReplyPt,
      suggestions: entry.suggestions,
    };
  }
  return {
    replyEn: entry.followReply,
    replyPt: isImmersionLevel(scenario.level) ? entry.followReply : entry.followReplyPt,
    suggestions: entry.suggestions,
  };
}

async function callGeminiJson<T>(
  prompt: string,
  apiKey?: string,
): Promise<T | null> {
  const models = ['gemini-3.8-flash', 'gemini-2.5-flash'];
  const cleanKey = (apiKey ?? '').trim();
  const useCloudProxy =
    cleanKey === CLOUD_GEMINI_PROXY_TOKEN || cleanKey.length === 0;
  const proxyEndpoint = `${DEFAULT_BACKEND_API_URL.replace(/\/+$/, '')}/api/gemini-tutor`;

  const bodyPayload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.85,
      responseMimeType: 'application/json',
    },
  };

  type GeminiCandidateResp = {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  let data: GeminiCandidateResp | null = null;

  try {
    if (useCloudProxy && DEFAULT_BACKEND_API_URL.trim().length > 0) {
      const res = await fetch(proxyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });
      if (res.ok) {
        data = (await res.json()) as GeminiCandidateResp;
      }
    } else if (cleanKey.length > 10) {
      for (const model of models) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
          cleanKey,
        )}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
        });
        if (res.ok) {
          data = (await res.json()) as GeminiCandidateResp;
          break;
        }
      }
      if (!data && DEFAULT_BACKEND_API_URL.trim().length > 0) {
        const fallbackRes = await fetch(proxyEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
        });
        if (fallbackRes.ok) {
          data = (await fallbackRes.json()) as GeminiCandidateResp;
        }
      }
    }

    const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return null;
    return JSON.parse(rawJson) as T;
  } catch {
    return null;
  }
}

export async function generateDynamicUnitScenario(
  topic: Topic,
  angle: UnitRoleplayAngle,
  apiKey?: string,
): Promise<{ scenario: AITutorScenario; usedGemini: boolean }> {
  const lang = topic.languageCode ?? 'en';
  const targetLangName = LANG_NAME_EN[lang];
  const immersion = isImmersionLevel(topic.level);
  const instructionLang = immersion ? targetLangName : 'Brazilian Portuguese';
  const topicTitle = immersion ? topic.titleEn : topic.titlePt;

  const prompt = `You are designing a fresh, unscripted, engaging ${targetLangName} roleplay scenario for a Brazilian learner at CEFR ${topic.level}.
Unit Topic: "${topicTitle}" (${topic.titleEn}) — ${topic.subtitle}
Key tips in unit: ${topic.topicTipsSummary.join(' | ')}
Roleplay Angle: "${angle.labelEn}" — ${angle.promptDirective}

IMPORTANT RULES:
- Make it vivid, specific, and NEVER generic or repetitive. Include a concrete setting (city/place) and a realistic twist.
- Write titlePt, personaRole, settingPt, and goalsPt in ${instructionLang}.
- Write openingEn and initialSuggestions in natural ${targetLangName} at CEFR ${topic.level}.
- Write openingPt in ${immersion ? targetLangName : 'Brazilian Portuguese'}.

Return ONLY valid JSON:
{
  "titlePt": "Scenario title in ${instructionLang}",
  "titleEn": "Scenario title in ${targetLangName}",
  "personaName": "Realistic local name + role title",
  "personaRole": "Short character bio in ${instructionLang}",
  "settingPt": "2-sentence vivid situation + unexpected twist in ${instructionLang}",
  "goalsPt": ["Goal 1 in ${instructionLang}", "Goal 2", "Goal 3"],
  "openingEn": "Natural opening line in ${targetLangName}",
  "openingPt": "${immersion ? `Same or brief paraphrase in ${targetLangName}` : 'Natural Brazilian Portuguese translation of openingEn'}",
  "initialSuggestions": ["3 natural ${targetLangName} responses the student can say"]
}`;

  const parsed = await callGeminiJson<{
    titlePt?: string;
    titleEn?: string;
    personaName?: string;
    personaRole?: string;
    settingPt?: string;
    goalsPt?: string[];
    openingEn?: string;
    openingPt?: string;
    initialSuggestions?: string[];
  }>(prompt, apiKey);

  if (parsed?.openingEn && parsed?.titlePt) {
    return {
      usedGemini: true,
      scenario: {
        id: `dyn-unit-${topic.id}-${angle.id}-${Date.now()}`,
        languageCode: lang,
        titlePt: parsed.titlePt,
        titleEn: parsed.titleEn || topic.titleEn,
        level: topic.level,
        personaName: parsed.personaName || 'Local Partner',
        personaRole: parsed.personaRole || angle.labelPt,
        settingPt: parsed.settingPt || angle.descriptionPt,
        goalsPt:
          Array.isArray(parsed.goalsPt) && parsed.goalsPt.length > 0
            ? parsed.goalsPt.slice(0, 3)
            : [angle.descriptionPt],
        openingEn: parsed.openingEn,
        openingPt: parsed.openingPt || parsed.openingEn,
        initialSuggestions:
          Array.isArray(parsed.initialSuggestions) &&
          parsed.initialSuggestions.length > 0
            ? parsed.initialSuggestions.slice(0, 3)
            : [topic.titleEn],
      },
    };
  }

  // Smart fallback anchored to the unit
  const speakStep = topic.steps.find((s) => s.type === 'speaking');
  const samplePhrase =
    speakStep?.type === 'speaking' ? speakStep.targetSentence : topic.titleEn;
  const fallbackOpenings: Record<LanguageCode, string> = {
    en: `Hi! Let's jump right into "${topic.titleEn}" (${angle.labelEn}). Ready to handle this situation?`,
    es: `¡Hola! Practiquemos "${topic.titleEn}" (${angle.labelEn}). ¿Cómo responderías en esta situación?`,
    fr: `Bonjour ! Pratiquons « ${topic.titleEn} » (${angle.labelEn}). Comment réagiriez-vous ?`,
    it: `Ciao! Esercitiamoci su "${topic.titleEn}" (${angle.labelEn}). Come risponderesti in questa situazione?`,
    de: `Hallo! Lass uns „${topic.titleEn}“ (${angle.labelEn}) üben. Wie würdest du reagieren?`,
  };
  return {
    usedGemini: false,
    scenario: {
      id: `dyn-unit-${topic.id}-${angle.id}`,
      languageCode: lang,
      titlePt: `${topicTitle} · ${immersion ? angle.labelEn : angle.labelPt}`,
      titleEn: `${topic.titleEn} · ${angle.labelEn}`,
      level: topic.level,
      personaName: 'Tutor IA',
      personaRole: immersion ? angle.labelEn : angle.labelPt,
      settingPt: immersion ? angle.promptDirective : `${topic.subtitle} (${angle.descriptionPt})`,
      goalsPt: [
        immersion ? angle.descriptionPt : `Aplicar vocabulário de "${topicTitle}"`,
        immersion ? 'Respond naturally to the plot twist' : 'Reagir com naturalidade ao imprevisto',
      ],
      openingEn: fallbackOpenings[lang],
      openingPt: fallbackOpenings[lang],
      initialSuggestions: [samplePhrase],
    },
  };
}

export async function generateCustomAIScenario(
  userIdea: string,
  languageCode: LanguageCode,
  level: CEFRLevel,
  apiKey?: string,
): Promise<{ scenario: AITutorScenario; usedGemini: boolean }> {
  const targetLangName = LANG_NAME_EN[languageCode];
  const immersion = isImmersionLevel(level);
  const instructionLang = immersion ? targetLangName : 'Brazilian Portuguese';
  const ideaText =
    userIdea.trim() ||
    'Create a surprising, fun, high-stakes everyday or professional situation for this learner.';

  const prompt = `Create a completely original, engaging ${targetLangName} roleplay scenario at CEFR ${level} for a Brazilian learner.
User's requested theme/idea: "${ideaText}"
Write titlePt, personaRole, settingPt, and goalsPt in ${instructionLang}.
Write openingEn and initialSuggestions in natural ${targetLangName}.
Write openingPt in ${immersion ? targetLangName : 'Brazilian Portuguese'}.

Return ONLY valid JSON:
{
  "titlePt": "...",
  "titleEn": "...",
  "personaName": "...",
  "personaRole": "...",
  "settingPt": "...",
  "goalsPt": ["...", "...", "..."],
  "openingEn": "...",
  "openingPt": "...",
  "initialSuggestions": ["...", "...", "..."]
}`;

  const parsed = await callGeminiJson<{
    titlePt?: string;
    titleEn?: string;
    personaName?: string;
    personaRole?: string;
    settingPt?: string;
    goalsPt?: string[];
    openingEn?: string;
    openingPt?: string;
    initialSuggestions?: string[];
  }>(prompt, apiKey);

  if (parsed?.openingEn && parsed?.titlePt) {
    return {
      usedGemini: true,
      scenario: {
        id: `custom-ai-${languageCode}-${Date.now()}`,
        languageCode,
        titlePt: parsed.titlePt,
        titleEn: parsed.titleEn || parsed.titlePt,
        level,
        personaName: parsed.personaName || 'IA Partner',
        personaRole: parsed.personaRole || 'Roleplay Dinâmico',
        settingPt: parsed.settingPt || ideaText,
        goalsPt:
          Array.isArray(parsed.goalsPt) && parsed.goalsPt.length > 0
            ? parsed.goalsPt.slice(0, 3)
            : ['Manter diálogo natural e fluente'],
        openingEn: parsed.openingEn,
        openingPt: parsed.openingPt || parsed.openingEn,
        initialSuggestions:
          Array.isArray(parsed.initialSuggestions) &&
          parsed.initialSuggestions.length > 0
            ? parsed.initialSuggestions.slice(0, 3)
            : ['Hello!'],
      },
    };
  }

  return generateDynamicUnitScenario(
    {
      id: `custom-${Date.now()}`,
      languageCode,
      titlePt: userIdea.trim() || 'Conversa Livre',
      titleEn: userIdea.trim() || 'Free Conversation',
      subtitle: ideaText,
      level,
      estimatedMinutes: 8,
      icon: 'Sparkles',
      color: '#4F46E5',
      topicTipsSummary: [],
      steps: [],
    },
    UNIT_ROLEPLAY_ANGLES[0],
    apiKey,
  );
}

export async function generateDynamicOpeningVariation(
  scenario: AITutorScenario,
  apiKey?: string,
): Promise<AITutorScenario> {
  const lang = scenario.languageCode ?? 'en';
  const targetLangName = LANG_NAME_EN[lang];
  const immersion = isImmersionLevel(scenario.level);
  const instructionLang = immersion ? targetLangName : 'Brazilian Portuguese';

  const prompt = `Reinvent this ${targetLangName} roleplay scenario (CEFR ${scenario.level}) with a FRESH plot twist, different city/context detail, and brand-new opening line so it feels completely unscripted:
Title: ${scenario.titleEn}
Persona: ${scenario.personaName} (${scenario.personaRole})
Original setting: ${scenario.settingPt}

Return ONLY valid JSON:
{
  "settingPt": "New vivid setting with an unexpected twist in ${instructionLang}",
  "openingEn": "Brand-new opening line in ${targetLangName} (1-2 sentences)",
  "openingPt": "${immersion ? `Brief paraphrase in ${targetLangName}` : 'Brazilian Portuguese translation of openingEn'}",
  "initialSuggestions": ["3 fresh ${targetLangName} replies matching the new twist"]
}`;

  const parsed = await callGeminiJson<{
    settingPt?: string;
    openingEn?: string;
    openingPt?: string;
    initialSuggestions?: string[];
  }>(prompt, apiKey);

  if (!parsed?.openingEn) return scenario;
  return {
    ...scenario,
    settingPt: parsed.settingPt || scenario.settingPt,
    openingEn: parsed.openingEn,
    openingPt: parsed.openingPt || parsed.openingEn,
    initialSuggestions:
      Array.isArray(parsed.initialSuggestions) && parsed.initialSuggestions.length > 0
        ? parsed.initialSuggestions.slice(0, 3)
        : scenario.initialSuggestions,
  };
}

export async function generateTutorReply(params: {
  scenario: AITutorScenario;
  history: TutorMessage[];
  userText: string;
  geminiApiKey?: string;
}): Promise<TutorReplyResult> {
  const { scenario, history, userText, geminiApiKey } = params;
  const lang = scenario.languageCode ?? 'en';
  const targetLangName = LANG_NAME_EN[lang];
  const immersion = isImmersionLevel(scenario.level);

  const canCallGemini =
    geminiApiKey &&
    (geminiApiKey.trim() === CLOUD_GEMINI_PROXY_TOKEN ||
      geminiApiKey.trim().length > 10);

  if (canCallGemini) {
    const recentHistory = history
      .slice(-6)
      .map(
        (m) =>
          `${m.sender === 'tutor' ? scenario.personaName : 'Student'}: ${m.textEn}`,
      )
      .join('\n');

    const feedbackLang = immersion ? targetLangName : 'Brazilian Portuguese';
    const prompt = `You are ${scenario.personaName} (${scenario.personaRole}) in an unscripted, natural ${targetLangName} conversation with a Brazilian learner at CEFR ${scenario.level}.
Scenario: ${scenario.settingPt}

Conversation so far:
${recentHistory}
Student just wrote: "${userText}"

CRITICAL: React directly to what the student said, advance the situation organically (introduce a small realistic question, counter-offer, or detail—never repeat stock lines), and stay 100% in character.
Respond ONLY with valid JSON:
{
  "replyEn": "Natural response in ${targetLangName} (1-3 sentences)",
  "replyPt": "${immersion ? `Brief natural paraphrase or key idiom note in ${targetLangName}` : 'Natural Brazilian Portuguese translation of replyEn'}",
  "feedbackPt": "Encouraging 1-sentence coaching tip in ${feedbackLang} on grammar, register, or natural phrasing",
  "correctedEn": "Optional cleaner/more natural ${targetLangName} rewrite of what the student said, or null if already natural",
  "suggestions": ["3 varied, natural ${targetLangName} reply options the student could say next"]
}`;

    const parsed = await callGeminiJson<{
      replyEn?: string;
      replyPt?: string;
      feedbackPt?: string;
      correctedEn?: string | null;
      suggestions?: string[];
    }>(prompt, geminiApiKey);

    if (parsed?.replyEn && parsed?.replyPt) {
      return {
        replyEn: parsed.replyEn,
        replyPt: parsed.replyPt,
        feedbackPt:
          parsed.feedbackPt ??
          (immersion ? 'Great natural phrasing!' : 'Ótima resposta! Continue praticando.'),
        correctedEn: parsed.correctedEn ?? undefined,
        suggestions:
          Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
            ? parsed.suggestions.slice(0, 3)
            : scenario.initialSuggestions,
        usedGemini: true,
      };
    }
  }

  const analysis = analyzeStudentInput(userText, lang, scenario.level);
  const studentTurnCount =
    history.filter((m) => m.sender === 'student').length + 1;
  const localTurn = buildMultiLangLocalFallbackTurn(
    scenario,
    userText,
    studentTurnCount,
  );

  return {
    ...localTurn,
    feedbackPt: analysis.feedbackPt,
    correctedEn: analysis.correctedEn,
    usedGemini: false,
  };
}

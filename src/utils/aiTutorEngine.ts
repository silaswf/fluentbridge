import type { AITutorScenario, TutorMessage } from '../types/learning';

export const AI_TUTOR_SCENARIOS: AITutorScenario[] = [
  {
    id: 'cafe-nyc',
    titlePt: 'Pedindo em um Café em Nova York',
    titleEn: 'Ordering at a NYC Coffee Shop',
    level: 'A1',
    personaName: 'Barista Mia',
    personaRole: 'Atendente simpática em Manhattan',
    settingPt:
      'Você entrou no Corner Roast Café. Cumprimente, peça uma bebida e um lanche com educação e escolha se é para comer lá ou viagem.',
    goalsPt: [
      'Usar "I\'d like" ou "Could I have" no lugar de "I want"',
      'Especificar tamanho, leite ou temperatura',
      'Responder se é "for here" (no local) ou "to go" (viagem)',
    ],
    openingEn:
      "Good morning! Welcome to Corner Roast. What can I get started for you today?",
    openingPt:
      'Bom dia! Bem-vindo ao Corner Roast. O que posso preparar para você hoje?',
    initialSuggestions: [
      "Good morning! I'd like a large iced coffee and a croissant, please.",
      'Hi! Could I have a medium cappuccino with oat milk?',
      'Hello! What snacks do you recommend for breakfast?',
    ],
  },
  {
    id: 'new-friend',
    titlePt: 'Conhecendo um Colega Internacional',
    titleEn: 'Meeting an International Colleague',
    level: 'A1',
    personaName: 'Alex Carter',
    personaRole: 'Designer de Produto de Toronto',
    settingPt:
      'Vocês acabaram de entrar no mesmo workshop online. Apresente-se, fale de onde você é e o que faz hoje.',
    goalsPt: [
      'Usar "Nice to meet you" corretamente',
      'Evitar "actually" para "atualmente" (prefira "currently")',
      'Fazer pelo menos uma pergunta de volta para manter a conversa',
    ],
    openingEn:
      "Hey there! I'm Alex from Toronto. Nice to meet you! Where are you joining us from?",
    openingPt:
      'Olá! Eu sou o Alex, de Toronto. Prazer em conhecer você! De onde você está falando?',
    initialSuggestions: [
      "Hi Alex! Nice to meet you too. I'm from Brazil and I live in São Paulo.",
      "Hello! Currently I work in marketing and I'm excited to practice English.",
      'Hey Alex! What kind of projects do you work on in Toronto?',
    ],
  },
  {
    id: 'hotel-checkin',
    titlePt: 'Check-in e Dúvidas no Hotel',
    titleEn: 'Hotel Check-in & Requests',
    level: 'A2',
    personaName: 'Liam',
    personaRole: 'Recepcionista do Harbour Hotel',
    settingPt:
      'Você chegou após um voo atrasado. Confirme sua reserva, pergunte sobre café da manhã/Wi-Fi ou peça um quarto silencioso.',
    goalsPt: [
      'Confirmar reserva educadamente ("I have a reservation under...")',
      'Perguntar horários usando preposições corretas (at / from... to)',
      'Usar "Could you tell me..." para perguntas indiretas',
    ],
    openingEn:
      'Good evening and welcome to the Harbour Hotel! How may I help you check in tonight?',
    openingPt:
      'Boa noite e bem-vindo ao Harbour Hotel! Como posso ajudar no seu check-in hoje?',
    initialSuggestions: [
      'Hi! I have a reservation under my name. My flight was delayed by two hours.',
      'Good evening! Could you tell me what time breakfast is served?',
      'Hello! Is there a quiet room available away from the street?',
    ],
  },
  {
    id: 'airport-customs',
    titlePt: 'Aeroporto, Portão e Bagagem',
    titleEn: 'Airport Assistance & Luggage',
    level: 'A2',
    personaName: 'Agent Hannah',
    personaRole: 'Atendente de companhia aérea em Londres',
    settingPt:
      'Seu voo teve mudança de portão e você precisa confirmar onde retirar sua bagagem ou pegar a conexão.',
    goalsPt: [
      'Usar "luggage" e "information" sempre no singular (sem -s)',
      'Formular perguntas indiretas ("where gate 14 is")',
      'Compreender instruções com números e horários',
    ],
    openingEn:
      'Hello! Welcome to the Customer Assistance desk. Do you need help with your boarding pass or luggage today?',
    openingPt:
      'Olá! Bem-vindo ao balcão de assistência. Precisa de ajuda com seu cartão de embarque ou bagagem hoje?',
    initialSuggestions: [
      'Excuse me, could you tell me where gate fourteen is?',
      'Hi! My flight was delayed. Where can I pick up my luggage?',
      'Could you give me some information about my connecting flight?',
    ],
  },
  {
    id: 'tech-interview',
    titlePt: 'Entrevista de Emprego em Inglês',
    titleEn: 'Job Interview Practice',
    level: 'B1',
    personaName: 'Clara Vance',
    personaRole: 'Tech Recruiter na NovaCloud',
    settingPt:
      'Simule os primeiros minutos de uma entrevista internacional contando sua experiência recente e uma conquista concreta.',
    goalsPt: [
      'Combinar Present Perfect (tempo até hoje) + Past Simple (ano fechado)',
      'Usar "intend to" em vez de "pretend to"',
      'Destacar um resultado mensurável (Método STAR)',
    ],
    openingEn:
      "Hi! Thanks for joining today's interview. Could you walk me through your current role and one achievement you're proud of?",
    openingPt:
      'Oi! Obrigado por participar da entrevista hoje. Poderia contar sobre seu cargo atual e uma conquista da qual se orgulha?',
    initialSuggestions: [
      'I have worked in my area for three years, and last year I led a key project.',
      'In 2024 I improved our team workflow, which reduced delays by twenty percent.',
      'I intend to keep growing with international teams and take on new challenges.',
    ],
  },
  {
    id: 'client-negotiation',
    titlePt: 'Negociação de Prazos e Escopo',
    titleEn: 'Client Scope & Deadline Negotiation',
    level: 'B2',
    personaName: 'Marcus Sterling',
    personaRole: 'Diretor de Contas em Nova York',
    settingPt:
      'O cliente pediu uma entrega extra em cima da hora. Negocie um meio-termo com diplomacia preservando a parceria.',
    goalsPt: [
      'Suavizar discordâncias ("Would you be open to...", "slightly tight")',
      'Propor alternativas construtivas ("meet halfway", "fair compromise")',
      'Confirmar próximos passos sem prometer o impossível',
    ],
    openingEn:
      "Thanks for hopping on this quick call. Our leadership asked if we can add three extra dashboards before Friday's launch—can your team make that happen?",
    openingPt:
      'Obrigado por entrar nessa call rápida. Nossa diretoria perguntou se dá para incluir três painéis extras antes do lançamento de sexta — seu time consegue?',
    initialSuggestions: [
      'We value this partnership, yet Friday feels slightly tight for three new dashboards.',
      'Would you be open to launching the core report on Friday and delivering the extras next week?',
      'Let us reach a fair compromise so quality is not compromised.',
    ],
  },
];

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
      'Dica de cortesia: em pedidos e atendimentos, troque "I want" por "I\'d like" para soar muito mais educado.',
    fix: (t) => t.replace(/\bi want\b/i, "I'd like"),
  },
  {
    pattern: /\bluggages\b/i,
    feedbackPt:
      'Atenção: "luggage" é incontável em inglês! Nunca coloque "-s" ("luggages" não existe).',
    fix: (t) => t.replace(/\bluggages\b/gi, 'luggage'),
  },
  {
    pattern: /\binformations\b/i,
    feedbackPt:
      'Atenção: "information" nunca recebe "-s" em inglês. Use "some information" ou "pieces of information".',
    fix: (t) => t.replace(/\binformations\b/gi, 'information'),
  },
  {
    pattern: /\bpretend to\b/i,
    feedbackPt:
      'Falso cognato! "Pretend" significa fingir. Para "pretender / ter intenção", use "intend to" ou "plan to".',
    fix: (t) => t.replace(/\bpretend to\b/gi, 'intend to'),
  },
  {
    pattern: /\bi work here since\b|\bi live here since\b/i,
    feedbackPt:
      'Ação que começou no passado e continua hoje pede Present Perfect: use "I have worked / lived here since...".',
    fix: (t) =>
      t
        .replace(/\bi work here since\b/i, "I've worked here since")
        .replace(/\bi live here since\b/i, "I've lived here since"),
  },
  {
    pattern: /\bdepends of\b/i,
    feedbackPt:
      'Preposição! Em inglês dizemos "depend ON" (e nunca "depend of").',
    fix: (t) => t.replace(/\bdepends of\b/gi, 'depends on'),
  },
  {
    pattern: /\bmake a question\b/i,
    feedbackPt:
      'Colocação natural: em inglês fazemos perguntas com ASK ("ask a question"), não "make a question".',
    fix: (t) => t.replace(/\bmake a question\b/gi, 'ask a question'),
  },
  {
    pattern: /\bi'm agree\b|\bi am agree\b/i,
    feedbackPt:
      '"Agree" é verbo, não adjetivo! Diga apenas "I agree" (sem "am").',
    fix: (t) => t.replace(/\b(i'm|i am) agree\b/gi, 'I agree'),
  },
  {
    pattern: /\bfor stay\b|\bfor eat\b|\bfor travel\b/i,
    feedbackPt:
      'Para finalidade, use "to + verbo" (ou "for here" no café), evitando "for + verbo no infinitivo".',
    fix: (t) =>
      t
        .replace(/\bfor stay\b/gi, 'for here')
        .replace(/\bfor (eat|travel)\b/gi, 'to $1'),
  },
  {
    pattern: /\b(he|she|it) don't\b/i,
    feedbackPt:
      'Concordância: com he / she / it no presente negativo usamos "doesn\'t", não "don\'t".',
    fix: (t) => t.replace(/\b(he|she|it) don't\b/gi, "$1 doesn't"),
  },
  {
    pattern: /\bhave many\b|\bhave a lot of\b|\bhave two\b/i,
    feedbackPt:
      'Existência em um lugar usa "There is / There are", não "have" sem sujeito.',
    fix: (t) =>
      t
        .replace(/\bhave many\b/i, 'there are many')
        .replace(/\bhave a lot of\b/i, 'there are a lot of')
        .replace(/\bhave two\b/i, 'there are two'),
  },
  {
    pattern: /\bconstipated\b/i,
    feedbackPt:
      'Cuidado com o falso cognato! "Constipated" = prisão de ventre; resfriado é "have a cold".',
    fix: (t) => t.replace(/\bconstipated\b/gi, 'having a cold'),
  },
  {
    pattern: /\bhow you can see\b/i,
    feedbackPt:
      'Em apresentações dizemos "AS you can see" (como você pode ver), nunca "how you can see".',
    fix: (t) => t.replace(/\bhow you can see\b/gi, 'as you can see'),
  },
];

function analyzeStudentInput(text: string): {
  feedbackPt: string;
  correctedEn?: string;
} {
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
  if (wordCount <= 3) {
    return {
      feedbackPt:
        'Boa resposta rápida! Tente expandir com mais detalhes (um motivo ou pergunta) para praticar fluência.',
    };
  }
  if (/\?$/.test(trimmed)) {
    return {
      feedbackPt:
        'Ótima pergunta natural! Fazer perguntas de volta mantém a conversa viva em inglês.',
    };
  }
  if (/(could|would|please|thank|i'd like|actually|currently|however|compromise)/i.test(trimmed)) {
    return {
      feedbackPt:
        'Excelente escolha de vocabulário e polidez! Soou muito natural para um nativo.',
    };
  }
  return {
    feedbackPt:
      'Frase clara e bem compreensível! Continue desenvolvendo com expressões de cortesia e conectivos.',
  };
}

function buildLocalDialogueTurn(
  scenario: AITutorScenario,
  userText: string,
  turnCount: number,
): Omit<TutorReplyResult, 'feedbackPt' | 'correctedEn' | 'usedGemini'> {
  const lower = userText.toLowerCase();

  switch (scenario.id) {
    case 'cafe-nyc': {
      if (turnCount <= 1 || /(coffee|latte|cappuccino|tea|croissant|sandwich|snack|recommend)/i.test(lower)) {
        if (!/(for here|to stay|to go|take away)/i.test(lower)) {
          return {
            replyEn:
              'Great choice! Would you like that for here or to go? Also, would you care for a warm pastry with it?',
            replyPt:
              'Ótima escolha! Você gostaria para consumir aqui ou para viagem? E gostaria de algum salgado/doce quentinho junto?',
            suggestions: [
              'For here, please. Could I also have a warm croissant?',
              'To go, please! And could I pay by credit card?',
              'To stay, please. Do you have oat milk?',
            ],
          };
        }
      }
      if (/(here|stay|to go|oat|milk|card|cash|check|bill|how much)/i.test(lower)) {
        return {
          replyEn:
            "Got it! That comes to $8.50 total. You can tap your card right here, and I'll have your order ready at the end of the counter in two minutes.",
          replyPt:
            'Anotado! O total deu $8.50. Pode aproximar seu cartão aqui e deixarei seu pedido pronto na ponta do balcão em dois minutos.',
          suggestions: [
            'Thank you! Could I have a receipt, please?',
            'Sounds great, thanks so much!',
            'Do you happen to have the Wi-Fi password?',
          ],
        };
      }
      return {
        replyEn:
          "You're very welcome! Enjoy your coffee and have a wonderful day in New York!",
        replyPt:
          'De nada! Aproveite seu café e tenha um dia maravilhoso em Nova York!',
        suggestions: [
          'Thank you! Have a great day too!',
          "Thanks! I'll definitely be back tomorrow.",
        ],
      };
    }

    case 'new-friend': {
      if (turnCount <= 1) {
        return {
          replyEn:
            "Awesome! I've always wanted to visit Brazil. What do you currently do for work or study, and what brings you to this English workshop?",
          replyPt:
            'Incrível! Sempre quis visitar o Brasil. O que você faz atualmente no trabalho ou estudos, e o que te trouxe a este workshop de inglês?',
          suggestions: [
            'Currently, I work in tech and I want to feel confident in global meetings.',
            'I study every week because I intend to travel abroad next year.',
            'What about you? How long have you worked as a designer?',
          ],
        };
      }
      return {
        replyEn:
          "That makes total sense! Actually, practicing 15 minutes a day with real conversations makes a huge difference. Do you enjoy movies or podcasts in English too?",
        replyPt:
          'Faz todo sentido! Na verdade, praticar 15 minutos por dia com conversas reais faz muita diferença. Você curte filmes ou podcasts em inglês também?',
        suggestions: [
          'Yes! I usually listen to short podcasts while commuting.',
          'Definitely! Watching series with English subtitles helps me a lot.',
          'Great talking to you, Alex! Hope to see you in the next session.',
        ],
      };
    }

    case 'hotel-checkin': {
      if (turnCount <= 1) {
        return {
          replyEn:
            "I see your reservation right here—no problem at all about the delayed flight! We have a quiet room on the fourth floor. Breakfast is served from 7:00 to 10:30 AM. Would you like our Wi-Fi password?",
          replyPt:
            'Vejo sua reserva bem aqui — sem problemas pelo voo atrasado! Temos um quarto silencioso no quarto andar. O café da manhã é servido das 7h às 10h30. Gostaria da senha do Wi-Fi?',
          suggestions: [
            'Yes, please! Could you also tell me where the elevator is?',
            'Thank you! Is checkout at noon tomorrow?',
            'That sounds wonderful. Can I pay the city tax now?',
          ],
        };
      }
      return {
        replyEn:
          "Everything is set! The elevators are right behind the lounge on your left, and checkout is at 12:00 PM. Let us know if you need anything else during your stay!",
        replyPt:
          'Tudo certo! Os elevadores ficam logo atrás do lounge à sua esquerda, e o checkout é ao meio-dia. Avise se precisar de mais alguma coisa durante sua estadia!',
        suggestions: [
          'Thank you so much for your help! Good night.',
          'Could you recommend a good restaurant nearby for dinner?',
        ],
      };
    }

    case 'airport-customs': {
      if (turnCount <= 1) {
        return {
          replyEn:
            'Of course! Your connecting flight now departs from Gate C14, which is a five-minute walk past security. Since your bags are checked through, you do not need to pick up your luggage here.',
          replyPt:
            'Claro! Seu voo de conexão agora parte do Portão C14, a cinco minutos de caminhada após a segurança. Como suas malas foram despachadas direto, não precisa retirar sua bagagem aqui.',
          suggestions: [
            'That is a relief! What time does boarding start at gate C14?',
            'Thank you! Could you confirm if there is a lounge near that gate?',
            'Excuse me, where is the closest coffee shop on the way?',
          ],
        };
      }
      return {
        replyEn:
          'Boarding starts at 9:15 PM—twenty minutes prior to departure. Just follow the blue signs and pull the glass door at Lounge C. Have a safe flight!',
        replyPt:
          'O embarque começa às 21h15 — vinte minutos antes da partida. Basta seguir as placas azuis e puxar a porta de vidro no Lounge C. Tenha um ótimo voo!',
        suggestions: [
          'Got it, pull the glass door at Lounge C. Thanks for the information!',
          'Thank you very much! Have a great evening.',
        ],
      };
    }

    case 'tech-interview': {
      if (turnCount <= 1) {
        return {
          replyEn:
            "That's a strong example of measurable impact! Thinking ahead, how do you handle tight deadlines when two stakeholders disagree on priorities?",
          replyPt:
            'Esse é um ótimo exemplo de impacto mensurável! Pensando adiante, como você lida com prazos apertados quando dois stakeholders discordam sobre prioridades?',
          suggestions: [
            'I usually bring everyone together to align goals and pinpoint the biggest impact.',
            'Last quarter I handled a similar situation by setting clear weekly milestones.',
            'I intend to keep improving my leadership and communication skills.',
          ],
        };
      }
      return {
        replyEn:
          'Very thoughtful approach—structured alignment makes all the difference. Do you have any questions for me about the team or next steps in our hiring process?',
        replyPt:
          'Abordagem muito madura — alinhamento estruturado faz toda a diferença. Você tem alguma pergunta para mim sobre a equipe ou os próximos passos do processo seletivo?',
        suggestions: [
          'Yes! Could you share what success looks like in the first 90 days?',
          'How does the team typically collaborate across time zones?',
          'Thank you for your time today! I look forward to hearing from you.',
        ],
      };
    }

    case 'client-negotiation':
    default: {
      if (turnCount <= 1) {
        return {
          replyEn:
            "I appreciate your candor. Friday's launch is important to our board, yet we definitely don't want to cut corners on quality. If we prioritize just one core dashboard for Friday, could the remaining two ship next Wednesday?",
          replyPt:
            'Agradeço sua franqueza. O lançamento de sexta é importante para nossa diretoria, mas certamente não queremos comprometer a qualidade. Se priorizarmos apenas um painel principal para sexta, os outros dois poderiam sair na quarta que vem?',
          suggestions: [
            'That sounds like a very fair compromise! We can commit to one core dashboard on Friday.',
            'Before confirming, let me double-check our team bandwidth and circle back within an hour.',
            'Would you be open to reviewing the draft design tomorrow at 2 PM?',
          ],
        };
      }
      return {
        replyEn:
          "Perfect—let's lock that plan in and I'll send a quick recap email so everyone stays on the same page. Thanks for working with us on a realistic timeline!",
        replyPt:
          'Perfeito — vamos fechar esse plano e eu mando um e-mail resumo rápido para todos ficarem alinhados. Obrigado por trabalhar conosco em um prazo realista!',
        suggestions: [
          'Thank you, Marcus! I look forward to tomorrow’s check-in.',
          'Sounds great, let us touch base tomorrow afternoon.',
        ],
      };
    }
  }
}

async function generateGeminiReply(
  apiKey: string,
  scenario: AITutorScenario,
  history: TutorMessage[],
  userText: string,
): Promise<TutorReplyResult | null> {
  const models = ['gemini-3.8-flash', 'gemini-2.5-flash'];
  try {
    const recentHistory = history
      .slice(-6)
      .map((m) => `${m.sender === 'tutor' ? scenario.personaName : 'Student'}: ${m.textEn}`)
      .join('\n');

    const prompt = `You are ${scenario.personaName} (${scenario.personaRole}) in an English learning roleplay for a Brazilian Portuguese-speaking student at CEFR ${scenario.level}.
Scenario: ${scenario.settingPt}

Conversation so far:
${recentHistory}
Student just wrote: "${userText}"

Respond ONLY with valid JSON (no markdown fences) matching this exact schema:
{
  "replyEn": "Natural, concise response in English staying in character (1-3 sentences)",
  "replyPt": "Natural Brazilian Portuguese translation of replyEn",
  "feedbackPt": "Encouraging 1-sentence coaching tip in Portuguese on the student's grammar, politeness, or Brazilian-English pitfalls",
  "correctedEn": "Optional cleaner/more natural English rewrite of what the student said, or null if already natural",
  "suggestions": ["3 short natural English reply options the student could say next"]
}`;

    let data: {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    } | null = null;

    for (const model of models) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        apiKey.trim(),
      )}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }),
      });
      if (response.ok) {
        data = (await response.json()) as {
          candidates?: Array<{
            content?: { parts?: Array<{ text?: string }> };
          }>;
        };
        break;
      }
    }

    if (!data) return null;
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return null;

    const parsed = JSON.parse(rawJson) as {
      replyEn?: string;
      replyPt?: string;
      feedbackPt?: string;
      correctedEn?: string | null;
      suggestions?: string[];
    };

    if (!parsed.replyEn || !parsed.replyPt) return null;
    return {
      replyEn: parsed.replyEn,
      replyPt: parsed.replyPt,
      feedbackPt: parsed.feedbackPt ?? 'Ótima resposta! Continue praticando.',
      correctedEn: parsed.correctedEn ?? undefined,
      suggestions:
        Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
          ? parsed.suggestions.slice(0, 3)
          : scenario.initialSuggestions,
      usedGemini: true,
    };
  } catch {
    return null;
  }
}

export async function generateTutorReply(params: {
  scenario: AITutorScenario;
  history: TutorMessage[];
  userText: string;
  geminiApiKey?: string;
}): Promise<TutorReplyResult> {
  const { scenario, history, userText, geminiApiKey } = params;

  if (geminiApiKey && geminiApiKey.trim().length > 10) {
    const aiResult = await generateGeminiReply(
      geminiApiKey,
      scenario,
      history,
      userText,
    );
    if (aiResult) return aiResult;
  }

  const analysis = analyzeStudentInput(userText);
  const studentTurnCount =
    history.filter((m) => m.sender === 'student').length + 1;
  const localTurn = buildLocalDialogueTurn(scenario, userText, studentTurnCount);

  return {
    ...localTurn,
    feedbackPt: analysis.feedbackPt,
    correctedEn: analysis.correctedEn,
    usedGemini: false,
  };
}

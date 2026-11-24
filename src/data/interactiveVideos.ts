import type { CEFRLevel, LanguageCode } from '../types/learning';

export interface VideoWordToken {
  surface: string;
  lemma: string;
  translationPt: string;
  ipa: string;
  partOfSpeech: string;
  notePt: string;
}

export interface InteractiveSubtitleLine {
  id: string;
  speaker: string;
  voice: 'female' | 'male';
  dialectCode: string;
  textTarget: string;
  textPt: string;
  tokens: VideoWordToken[];
}

export interface InteractiveVideoClip {
  id: string;
  languageCode: LanguageCode;
  level: CEFRLevel;
  categoryPt: string;
  titleTarget: string;
  titlePt: string;
  durationLabel: string;
  gradientClass: string;
  sceneSettingPt: string;
  lines: InteractiveSubtitleLine[];
}

export const INTERACTIVE_VIDEO_CLIPS: InteractiveVideoClip[] = [
  // ENGLISH (3 clips)
  {
    id: 'vid-en-1',
    languageCode: 'en',
    level: 'A2',
    categoryPt: 'Café & Rotina',
    titleTarget: 'Morning Rush at the Corner Café',
    titlePt: 'Correria da Manhã na Cafeteria',
    durationLabel: '0:42',
    gradientClass: 'from-amber-900 via-stone-900 to-slate-950',
    sceneSettingPt: 'Londres · Balcão de cafeteria antes do trabalho',
    lines: [
      {
        id: 'en1-l1',
        speaker: 'Barista',
        voice: 'female',
        dialectCode: 'en-GB',
        textTarget: 'Morning! What can I get started for you today?',
        textPt: 'Bom dia! O que posso preparar para você hoje?',
        tokens: [
          { surface: 'Morning', lemma: 'morning', translationPt: 'Bom dia (informal)', ipa: '/ˈmɔː.nɪŋ/', partOfSpeech: 'Saudação', notePt: 'Muito comum no Reino Unido e EUA no lugar de Good morning.' },
          { surface: 'started', lemma: 'get started', translationPt: 'começar / preparar', ipa: '/ˈstɑː.tɪd/', partOfSpeech: 'Expressão', notePt: 'What can I get started for you? = O que já posso ir preparando?' },
        ],
      },
      {
        id: 'en1-l2',
        speaker: 'Liam',
        voice: 'male',
        dialectCode: 'en-US',
        textTarget: 'Could I grab a flat white with oat milk to go, please?',
        textPt: 'Poderia pegar um flat white com leite de aveia para viagem, por favor?',
        tokens: [
          { surface: 'grab', lemma: 'grab', translationPt: 'pegar / pedir rápido', ipa: '/ɡræb/', partOfSpeech: 'Verbo', notePt: 'Mais natural em cafés do que buy ou take.' },
          { surface: 'oat', lemma: 'oat milk', translationPt: 'leite de aveia', ipa: '/oʊt/', partOfSpeech: 'Substantivo', notePt: 'Oat = aveia; almond = amêndoa.' },
          { surface: 'go', lemma: 'to go', translationPt: 'para viagem', ipa: '/ɡoʊ/', partOfSpeech: 'Expressão', notePt: 'Nos EUA dizem "to go"; no Reino Unido, "takeaway".' },
        ],
      },
      {
        id: 'en1-l3',
        speaker: 'Barista',
        voice: 'female',
        dialectCode: 'en-GB',
        textTarget: 'Sure thing! Would you like any pastry warmed up with that?',
        textPt: 'Com certeza! Gostaria de algum folhado aquecido para acompanhar?',
        tokens: [
          { surface: 'pastry', lemma: 'pastry', translationPt: 'folhado / doce de padaria', ipa: '/ˈpeɪ.stri/', partOfSpeech: 'Substantivo', notePt: 'Croissants, muffins e tortinhas entram em pastry.' },
          { surface: 'warmed', lemma: 'warm up', translationPt: 'aquecido / esquentado', ipa: '/wɔːrmd/', partOfSpeech: 'Phrasal Verb', notePt: 'Warm up = esquentar comida (ou aquecer antes do treino).' },
        ],
      },
      {
        id: 'en1-l4',
        speaker: 'Liam',
        voice: 'male',
        dialectCode: 'en-US',
        textTarget: 'No thanks, I am running a bit behind schedule this morning.',
        textPt: 'Não, obrigado, estou um pouco atrasado hoje de manhã.',
        tokens: [
          { surface: 'behind', lemma: 'behind schedule', translationPt: 'atrasado (em relação ao horário)', ipa: '/bɪˈhaɪnd/', partOfSpeech: 'Expressão', notePt: 'Muito usado no trabalho: ahead of schedule / behind schedule.' },
        ],
      },
    ],
  },
  {
    id: 'vid-en-2',
    languageCode: 'en',
    level: 'B1',
    categoryPt: 'Trabalho Remoto',
    titleTarget: 'Quick Stand-up Sync',
    titlePt: 'Alinhamento Rápido de Projeto',
    durationLabel: '0:48',
    gradientClass: 'from-blue-950 via-indigo-950 to-slate-950',
    sceneSettingPt: 'Chamada de vídeo · Equipe de produto',
    lines: [
      {
        id: 'en2-l1',
        speaker: 'Maya',
        voice: 'female',
        dialectCode: 'en-US',
        textTarget: 'Quick heads-up: the client pushed the deadline back to Friday.',
        textPt: 'Aviso rápido: o cliente adiou o prazo para sexta-feira.',
        tokens: [
          { surface: 'heads-up', lemma: 'heads-up', translationPt: 'aviso prévio / alerta rápido', ipa: '/ˌhedzˈʌp/', partOfSpeech: 'Substantivo', notePt: 'Gíria corporativa super comum para dar um toque antecipado.' },
          { surface: 'deadline', lemma: 'deadline', translationPt: 'prazo final', ipa: '/ˈded.laɪn/', partOfSpeech: 'Substantivo', notePt: 'Meet a deadline = cumprir o prazo; push back = adiar.' },
        ],
      },
      {
        id: 'en2-l2',
        speaker: 'Noah',
        voice: 'male',
        dialectCode: 'en-GB',
        textTarget: 'That actually gives us breathing room to polish the onboarding flow.',
        textPt: 'Isso na verdade nos dá fôlego para polir o fluxo de integração.',
        tokens: [
          { surface: 'actually', lemma: 'actually', translationPt: 'na verdade (falso cognato!)', ipa: '/ˈæk.tʃu.ə.li/', partOfSpeech: 'Advérbio', notePt: 'Nunca significa "atualmente" (que é currently).' },
          { surface: 'breathing', lemma: 'breathing room', translationPt: 'fôlego / margem de tempo', ipa: '/ˈbriː.ðɪŋ/', partOfSpeech: 'Expressão', notePt: 'Ótima expressão idiomática para folga no cronograma.' },
        ],
      },
      {
        id: 'en2-l3',
        speaker: 'Maya',
        voice: 'female',
        dialectCode: 'en-US',
        textTarget: 'Agreed. Let us touch base tomorrow afternoon once QA wraps up.',
        textPt: 'Combinado. Vamos nos falar amanhã à tarde assim que QA concluir.',
        tokens: [
          { surface: 'touch', lemma: 'touch base', translationPt: 'fazer contato / alinhar rapidamente', ipa: '/tʌtʃ/', partOfSpeech: 'Expressão', notePt: 'Expressão clássica de reuniões em inglês.' },
          { surface: 'wraps', lemma: 'wrap up', translationPt: 'finalizar / encerrar', ipa: '/ræps/', partOfSpeech: 'Phrasal Verb', notePt: 'Wrap up a meeting / task = concluir.' },
        ],
      },
    ],
  },
  {
    id: 'vid-en-3',
    languageCode: 'en',
    level: 'B2',
    categoryPt: 'Debate & Cultura',
    titleTarget: 'Four-Day Workweek Debate',
    titlePt: 'Debate sobre Semana de 4 Dias',
    durationLabel: '0:52',
    gradientClass: 'from-emerald-950 via-teal-950 to-slate-950',
    sceneSettingPt: 'Painel de tecnologia · Entrevista ao vivo',
    lines: [
      {
        id: 'en3-l1',
        speaker: 'Host',
        voice: 'female',
        dialectCode: 'en-GB',
        textTarget: 'Did productivity genuinely hold steady during the six-month trial?',
        textPt: 'A produtividade realmente se manteve estável durante o teste de seis meses?',
        tokens: [
          { surface: 'genuinely', lemma: 'genuinely', translationPt: 'genuinamente / de fato', ipa: '/ˈdʒen.ju.ɪn.li/', partOfSpeech: 'Advérbio', notePt: 'Enfatiza autenticidade em debates B2/C1.' },
          { surface: 'steady', lemma: 'hold steady', translationPt: 'manter-se estável', ipa: '/ˈsted.i/', partOfSpeech: 'Expressão', notePt: 'Collocation natural para métricas e economia.' },
        ],
      },
      {
        id: 'en3-l2',
        speaker: 'Dr. Patel',
        voice: 'male',
        dialectCode: 'en-US',
        textTarget: 'Remarkably, yes—eliminating redundant meetings offset the shorter hours.',
        textPt: 'Surpreendentemente, sim — eliminar reuniões redundantes compensou a carga menor.',
        tokens: [
          { surface: 'offset', lemma: 'offset', translationPt: 'compensar / equilibrar', ipa: '/ˌɔːfˈset/', partOfSpeech: 'Verbo', notePt: 'Verbo C1 muito usado em IELTS e relatórios.' },
          { surface: 'redundant', lemma: 'redundant', translationPt: 'redundante / desnecessário', ipa: '/rɪˈdʌn.dənt/', partOfSpeech: 'Adjetivo', notePt: 'Em RH britânico também pode significar demitido por corte.' },
        ],
      },
    ],
  },

  // SPANISH (3 clips)
  {
    id: 'vid-es-1',
    languageCode: 'es',
    level: 'A2',
    categoryPt: 'Restaurante',
    titleTarget: 'Tapas en el Centro de Madrid',
    titlePt: 'Tapas no Centro de Madri',
    durationLabel: '0:40',
    gradientClass: 'from-amber-900 via-orange-950 to-slate-950',
    sceneSettingPt: 'Madri · Terraço movimentado à noite',
    lines: [
      {
        id: 'es1-l1',
        speaker: 'Camarero',
        voice: 'male',
        dialectCode: 'es-ES',
        textTarget: '¡Buenas noches! ¿Os apetece pedir unas raciones para compartir?',
        textPt: 'Boa noite! Dá vontade de pedir umas porções para compartilhar?',
        tokens: [
          { surface: 'apetece', lemma: 'apetecer', translationPt: 'dar vontade / apetecer', ipa: '/a.peˈte.θe/', partOfSpeech: 'Verbo', notePt: 'Na Espanha, "¿Te apetece...?" substitui "Você quer...?" de forma natural.' },
          { surface: 'raciones', lemma: 'ración', translationPt: 'porções (de tapas)', ipa: '/raˈθjo.nes/', partOfSpeech: 'Substantivo', notePt: 'Media ración = meia porção.' },
        ],
      },
      {
        id: 'es1-l2',
        speaker: 'Lucía',
        voice: 'female',
        dialectCode: 'es-MX',
        textTarget: 'Sí, por favor. Todavía estamos decidiendo entre croquetas y tortilla.',
        textPt: 'Sim, por favor. Ainda estamos decidindo entre croquetes e tortilha.',
        tokens: [
          { surface: 'Todavía', lemma: 'todavía', translationPt: 'ainda (falso amigo!)', ipa: '/to.ðaˈβi.a/', partOfSpeech: 'Advérbio', notePt: 'Não confunda com "todavia" do português!' },
        ],
      },
    ],
  },
  {
    id: 'vid-es-2',
    languageCode: 'es',
    level: 'B1',
    categoryPt: 'Viagem',
    titleTarget: 'Cambio de Billete en la Estación',
    titlePt: 'Troca de Passagem na Estação',
    durationLabel: '0:44',
    gradientClass: 'from-rose-950 via-red-950 to-slate-950',
    sceneSettingPt: 'Estação de trem · Atocha',
    lines: [
      {
        id: 'es2-l1',
        speaker: 'Viajero',
        voice: 'male',
        dialectCode: 'es-ES',
        textTarget: 'Disculpa, perdí el tren anterior. ¿Puedo cambiar el billete para el próximo?',
        textPt: 'Com licença, perdi o trem anterior. Posso trocar a passagem para o próximo?',
        tokens: [
          { surface: 'billete', lemma: 'billete', translationPt: 'passagem / bilhete', ipa: '/biˈʎe.te/', partOfSpeech: 'Substantivo', notePt: 'Na América Latina usa-se mais "boleto" ou "pasaje".' },
        ],
      },
      {
        id: 'es2-l2',
        speaker: 'Agente',
        voice: 'female',
        dialectCode: 'es-ES',
        textTarget: 'Sin problema, aunque conlleva un pequeño recargo por cambio de última hora.',
        textPt: 'Sem problema, embora tenha uma pequena taxa por troca de última hora.',
        tokens: [
          { surface: 'aunque', lemma: 'aunque', translationPt: 'embora / mesmo que', ipa: '/ˈaun.ke/', partOfSpeech: 'Conjunção', notePt: 'Conector essencial no DELE B1/B2.' },
          { surface: 'recargo', lemma: 'recargo', translationPt: 'taxa extra / acréscimo', ipa: '/reˈkaɾ.ɣo/', partOfSpeech: 'Substantivo', notePt: 'Muito útil em hotéis, voos e trens.' },
        ],
      },
    ],
  },
  {
    id: 'vid-es-3',
    languageCode: 'es',
    level: 'B2',
    categoryPt: 'Negócios',
    titleTarget: 'Negociación de Plazos',
    titlePt: 'Negociação de Prazos',
    durationLabel: '0:46',
    gradientClass: 'from-indigo-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Sala de reuniões · Cidade do México',
    lines: [
      {
        id: 'es3-l1',
        speaker: 'Directora',
        voice: 'female',
        dialectCode: 'es-MX',
        textTarget: 'Valoramos su propuesta, sin embargo necesitamos mayor flexibilidad en la entrega.',
        textPt: 'Valorizamos sua proposta, entretanto precisamos de mais flexibilidade na entrega.',
        tokens: [
          { surface: 'embargo', lemma: 'sin embargo', translationPt: 'entretanto / no entanto', ipa: '/sin emˈbaɾ.ɣo/', partOfSpeech: 'Conjunção', notePt: 'Equivalente formal de "pero".' },
          { surface: 'entrega', lemma: 'entrega', translationPt: 'entrega / prazo', ipa: '/enˈtɾe.ɣa/', partOfSpeech: 'Substantivo', notePt: 'Fecha de entrega = data de entrega.' },
        ],
      },
    ],
  },

  // FRENCH (3 clips)
  {
    id: 'vid-fr-1',
    languageCode: 'fr',
    level: 'A2',
    categoryPt: 'Padaria',
    titleTarget: 'À la Boulangerie le Matin',
    titlePt: 'Na Padaria pela Manhã',
    durationLabel: '0:38',
    gradientClass: 'from-indigo-950 via-blue-950 to-slate-950',
    sceneSettingPt: 'Paris · Boulangerie de bairro',
    lines: [
      {
        id: 'fr1-l1',
        speaker: 'Boulangère',
        voice: 'female',
        dialectCode: 'fr-FR',
        textTarget: 'Bonjour ! Je vous sers une baguette bien cuite ou plutôt dorée ?',
        textPt: 'Bom dia! Sirvo uma baguete bem assada ou mais dourada?',
        tokens: [
          { surface: 'cuite', lemma: 'bien cuit(e)', translationPt: 'bem assada / crocante', ipa: '/kɥit/', partOfSpeech: 'Adjetivo', notePt: 'Na França você escolhe o ponto da baguete!' },
          { surface: 'plutôt', lemma: 'plutôt', translationPt: 'mais para / de preferência', ipa: '/ply.to/', partOfSpeech: 'Advérbio', notePt: 'Não confunda com "plus tôt" (mais cedo).' },
        ],
      },
      {
        id: 'fr1-l2',
        speaker: 'Marc',
        voice: 'male',
        dialectCode: 'fr-CA',
        textTarget: 'Plutôt dorée, s’il vous plaît, et je voudrais aussi deux croissants au beurre.',
        textPt: 'Mais dourada, por favor, e eu gostaria também de dois croissants na manteiga.',
        tokens: [
          { surface: 'voudrais', lemma: 'vouloir (cond.)', translationPt: 'eu gostaria', ipa: '/vu.dʁɛ/', partOfSpeech: 'Verbo', notePt: 'Muito mais educado que "je veux".' },
        ],
      },
    ],
  },
  {
    id: 'vid-fr-2',
    languageCode: 'fr',
    level: 'B1',
    categoryPt: 'Transporte',
    titleTarget: 'Correspondance à Châtelet',
    titlePt: 'Baldeação em Châtelet',
    durationLabel: '0:42',
    gradientClass: 'from-violet-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Metrô de Paris',
    lines: [
      {
        id: 'fr2-l1',
        speaker: 'Voyageuse',
        voice: 'female',
        dialectCode: 'fr-FR',
        textTarget: 'Pardon, pour aller vers Montmartre, il faut bien changer à la prochaine station ?',
        textPt: 'Com licença, para ir até Montmartre, precisa mesmo baldear na próxima estação?',
        tokens: [
          { surface: 'changer', lemma: 'changer (de ligne)', translationPt: 'trocar de linha / fazer baldeação', ipa: '/ʃɑ̃.ʒe/', partOfSpeech: 'Verbo', notePt: 'Correspondance = baldeação.' },
        ],
      },
    ],
  },
  {
    id: 'vid-fr-3',
    languageCode: 'fr',
    level: 'B2',
    categoryPt: 'Cultura',
    titleTarget: 'Télétravail et Équilibre',
    titlePt: 'Teletrabalho e Equilíbrio',
    durationLabel: '0:48',
    gradientClass: 'from-sky-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Rádio comunitária · Lyon',
    lines: [
      {
        id: 'fr3-l1',
        speaker: 'Journaliste',
        voice: 'male',
        dialectCode: 'fr-FR',
        textTarget: 'D’un côté, on gagne du temps de trajet ; de l’autre, la coupure devient floue.',
        textPt: 'Por um lado, ganha-se tempo de trajeto; por outro, o limite fica difuso.',
        tokens: [
          { surface: 'trajet', lemma: 'trajet', translationPt: 'trajeto / deslocamento', ipa: '/tʁa.ʒɛ/', partOfSpeech: 'Substantivo', notePt: 'Temps de trajet = tempo de comutação.' },
          { surface: 'floue', lemma: 'flou(e)', translationPt: 'difuso / pouco nítido', ipa: '/flu/', partOfSpeech: 'Adjetivo', notePt: 'Muito usado no DELF B2 para ideias abstratas.' },
        ],
      },
    ],
  },

  // ITALIAN (3 clips)
  {
    id: 'vid-it-1',
    languageCode: 'it',
    level: 'A2',
    categoryPt: 'Café',
    titleTarget: 'Un Caffè al Banco',
    titlePt: 'Um Café no Balcão',
    durationLabel: '0:36',
    gradientClass: 'from-emerald-950 via-stone-900 to-slate-950',
    sceneSettingPt: 'Roma · Bar italiano típico',
    lines: [
      {
        id: 'it1-l1',
        speaker: 'Barista',
        voice: 'male',
        dialectCode: 'it-IT',
        textTarget: 'Buongiorno! Lo prende al banco o si accomoda al tavolo?',
        textPt: 'Bom dia! Vai tomar no balcão ou prefere sentar-se à mesa?',
        tokens: [
          { surface: 'banco', lemma: 'al banco', translationPt: 'no balcão', ipa: '/ˈbaŋ.ko/', partOfSpeech: 'Expressão', notePt: 'Na Itália, tomar al banco costuma ser mais barato que al tavolo!' },
          { surface: 'accomoda', lemma: 'accomodarsi', translationPt: 'acomodar-se / sentar-se', ipa: '/akˈkɔ.mo.da/', partOfSpeech: 'Verbo', notePt: 'Si accomodi! = Fique à vontade / Sente-se!' },
        ],
      },
    ],
  },
  {
    id: 'vid-it-2',
    languageCode: 'it',
    level: 'B1',
    categoryPt: 'Cotidiano',
    titleTarget: 'Prenotare una Cena',
    titlePt: 'Reservar um Jantar',
    durationLabel: '0:42',
    gradientClass: 'from-teal-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Florença · Ligação para trattoria',
    lines: [
      {
        id: 'it2-l1',
        speaker: 'Chiara',
        voice: 'female',
        dialectCode: 'it-IT',
        textTarget: 'Vorrei prenotare un tavolo per quattro persone alle venti e trenta, se possibile.',
        textPt: 'Gostaria de reservar uma mesa para quatro pessoas às 20h30, se possível.',
        tokens: [
          { surface: 'prenotare', lemma: 'prenotare', translationPt: 'reservar', ipa: '/pre.noˈta.re/', partOfSpeech: 'Verbo', notePt: 'Prenotazione = reserva.' },
        ],
      },
    ],
  },
  {
    id: 'vid-it-3',
    languageCode: 'it',
    level: 'B2',
    categoryPt: 'Sociedade',
    titleTarget: 'Turismo Sostenibile',
    titlePt: 'Turismo Sustentável',
    durationLabel: '0:46',
    gradientClass: 'from-cyan-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Veneza · Entrevista cultural',
    lines: [
      {
        id: 'it3-l1',
        speaker: 'Assessora',
        voice: 'female',
        dialectCode: 'it-IT',
        textTarget: 'Occorre trovare un equilibrio tra accoglienza e tutela del patrimonio storico.',
        textPt: 'É preciso encontrar um equilíbrio entre acolhimento e proteção do patrimônio histórico.',
        tokens: [
          { surface: 'Occorre', lemma: 'occorrere', translationPt: 'é necessário / precisa-se', ipa: '/okˈkor.re/', partOfSpeech: 'Verbo', notePt: 'Sinônimo elegante de "bisogna" no CILS B2.' },
        ],
      },
    ],
  },

  // GERMAN (3 clips)
  {
    id: 'vid-de-1',
    languageCode: 'de',
    level: 'A2',
    categoryPt: 'Padaria & Mercado',
    titleTarget: 'Beim Bäcker in Berlin',
    titlePt: 'Na Padaria em Berlim',
    durationLabel: '0:38',
    gradientClass: 'from-slate-800 via-amber-950 to-slate-950',
    sceneSettingPt: 'Berlim · Padaria de esquina',
    lines: [
      {
        id: 'de1-l1',
        speaker: 'Verkäuferin',
        voice: 'female',
        dialectCode: 'de-DE',
        textTarget: 'Guten Morgen! Was darf es heute für Sie sein?',
        textPt: 'Bom dia! O que vai ser para você hoje?',
        tokens: [
          { surface: 'darf', lemma: 'Was darf es sein?', translationPt: 'O que deseja? (lit. o que pode ser)', ipa: '/daʁf/', partOfSpeech: 'Expressão', notePt: 'Fórmula clássica de atendimento na Alemanha.' },
        ],
      },
      {
        id: 'de1-l2',
        speaker: 'Jonas',
        voice: 'male',
        dialectCode: 'de-AT',
        textTarget: 'Ich hätte gern zwei Laugenbrezeln und einen Kaffee zum Mitnehmen.',
        textPt: 'Eu gostaria de dois pretzels e um café para viagem.',
        tokens: [
          { surface: 'Mitnehmen', lemma: 'zum Mitnehmen', translationPt: 'para levar / para viagem', ipa: '/ˈmɪtˌneː.mən/', partOfSpeech: 'Expressão', notePt: 'Substituto perfeito do inglês "to go".' },
        ],
      },
    ],
  },
  {
    id: 'vid-de-2',
    languageCode: 'de',
    level: 'B1',
    categoryPt: 'Trabalho',
    titleTarget: 'Termin Verschieben',
    titlePt: 'Remarcar Reunião',
    durationLabel: '0:42',
    gradientClass: 'from-zinc-900 via-slate-900 to-slate-950',
    sceneSettingPt: 'Munique · Escritório',
    lines: [
      {
        id: 'de2-l1',
        speaker: 'Lukas',
        voice: 'male',
        dialectCode: 'de-DE',
        textTarget: 'Könnten wir das Treffen wegen des Zugausfalls auf morgen verlegen?',
        textPt: 'Poderíamos adiar o encontro para amanhã por causa do cancelamento do trem?',
        tokens: [
          { surface: 'verlegen', lemma: 'verlegen', translationPt: 'adiar / transferir de data', ipa: '/fɛɐ̯ˈleː.ɡən/', partOfSpeech: 'Verbo', notePt: 'Genitivo após "wegen" (wegen des Zugausfalls).' },
        ],
      },
    ],
  },
  {
    id: 'vid-de-3',
    languageCode: 'de',
    level: 'B2',
    categoryPt: 'Sustentabilidade',
    titleTarget: 'Verkehrswende in der Stadt',
    titlePt: 'Transição de Mobilidade Urbana',
    durationLabel: '0:46',
    gradientClass: 'from-emerald-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Hamburgo · Fórum urbano',
    lines: [
      {
        id: 'de3-l1',
        speaker: 'Moderatorin',
        voice: 'female',
        dialectCode: 'de-DE',
        textTarget: 'Je besser der Nahverkehr ausgebaut wird, desto eher verzichten Menschen aufs Auto.',
        textPt: 'Quanto melhor o transporte público é ampliado, mais cedo as pessoas abrem mão do carro.',
        tokens: [
          { surface: 'verzichten', lemma: 'verzichten auf', translationPt: 'abrir mão de / prescindir', ipa: '/fɛɐ̯ˈt͡sɪç.tən/', partOfSpeech: 'Verbo', notePt: 'Estrutura "je ... desto" muito cobrada no Goethe B2.' },
        ],
      },
    ],
  },

  // RUSSIAN (3 clips)
  {
    id: 'vid-ru-1',
    languageCode: 'ru',
    level: 'A2',
    categoryPt: 'Cotidiano',
    titleTarget: 'В кофейне в Москве',
    titlePt: 'Na Cafeteria em Moscou',
    durationLabel: '0:40',
    gradientClass: 'from-sky-950 via-blue-950 to-slate-950',
    sceneSettingPt: 'Moscou · Café perto do metrô',
    lines: [
      {
        id: 'ru1-l1',
        speaker: 'Официант',
        voice: 'male',
        dialectCode: 'ru-RU',
        textTarget: 'Здравствуйте! Что будете заказывать? Кофе с собой или здесь?',
        textPt: 'Olá! O que vão pedir? Café para viagem ou aqui?',
        tokens: [
          { surface: 'собой', lemma: 'с собой', translationPt: 'para viagem (lit. consigo)', ipa: '/s‿sɐˈboj/', partOfSpeech: 'Expressão', notePt: 'С собой = para levar.' },
        ],
      },
      {
        id: 'ru1-l2',
        speaker: 'Анна',
        voice: 'female',
        dialectCode: 'ru-SPB',
        textTarget: 'Мне, пожалуйста, капучино без сахара и круассан.',
        textPt: 'Para mim, por favor, um cappuccino sem açúcar e um croissant.',
        tokens: [
          { surface: 'сахара', lemma: 'без сахара', translationPt: 'sem açúcar (Genitivo)', ipa: '/ˈsa.xə.rə/', partOfSpeech: 'Caso Genitivo', notePt: 'Após "без" (sem), usa-se sempre o caso Genitivo.' },
        ],
      },
    ],
  },
  {
    id: 'vid-ru-2',
    languageCode: 'ru',
    level: 'B1',
    categoryPt: 'Viagem',
    titleTarget: 'На вокзале',
    titlePt: 'Na Estação Ferroviária',
    durationLabel: '0:42',
    gradientClass: 'from-indigo-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'São Petersburgo · Bilheteria',
    lines: [
      {
        id: 'ru2-l1',
        speaker: 'Пассажир',
        voice: 'male',
        dialectCode: 'ru-SPB',
        textTarget: 'Подскажите, с какой платформы отправляется поезд до Казани?',
        textPt: 'Por favor, de qual plataforma parte o trem para Kazan?',
        tokens: [
          { surface: 'отправляется', lemma: 'отправляться', translationPt: 'partir / sair (transporte)', ipa: '/ɐt.prɐˈvlʲa.jɪt.sə/', partOfSpeech: 'Verbo', notePt: 'Verbo padrão de avisos em estações e aeroportos.' },
        ],
      },
    ],
  },
  {
    id: 'vid-ru-3',
    languageCode: 'ru',
    level: 'B2',
    categoryPt: 'Cultura',
    titleTarget: 'Привычки чтения',
    titlePt: 'Hábitos de Leitura',
    durationLabel: '0:44',
    gradientClass: 'from-slate-800 via-indigo-950 to-slate-950',
    sceneSettingPt: 'Podcast literário',
    lines: [
      {
        id: 'ru3-l1',
        speaker: 'Ведущая',
        voice: 'female',
        dialectCode: 'ru-RU',
        textTarget: 'Несмотря на развитие аудиокниг, бумажные издания по-прежнему ценятся.',
        textPt: 'Apesar do avanço dos audiolivros, edições impressas continuam sendo valorizadas.',
        tokens: [
          { surface: 'Несмотря', lemma: 'несмотря на', translationPt: 'apesar de', ipa: '/nʲɪ.smɐˈtrʲa/', partOfSpeech: 'Preposição', notePt: 'Estrutura formal essencial no ТРКИ B2.' },
        ],
      },
    ],
  },

  // JAPANESE (3 clips)
  {
    id: 'vid-ja-1',
    languageCode: 'ja',
    level: 'A2',
    categoryPt: 'Restaurante',
    titleTarget: '渋谷のラーメン屋で',
    titlePt: 'Em uma Casa de Lámen em Shibuya',
    durationLabel: '0:38',
    gradientClass: 'from-rose-950 via-red-950 to-slate-950',
    sceneSettingPt: 'Tóquio · Balcão de lámen',
    lines: [
      {
        id: 'ja1-l1',
        speaker: '店員',
        voice: 'male',
        dialectCode: 'ja-JP',
        textTarget: 'いらっしゃいませ！ 食券を お持ち ですか？',
        textPt: 'Bem-vindo! Você já tem o tíquete da máquina?',
        tokens: [
          { surface: '食券', lemma: '食券 (しょっけん)', translationPt: 'tíquete de refeição', ipa: '/ɕok.keɴ/', partOfSpeech: 'Substantivo', notePt: 'Muitos restaurantes no Japão usam máquina de tíquetes na entrada.' },
        ],
      },
      {
        id: 'ja1-l2',
        speaker: 'ユナ',
        voice: 'female',
        dialectCode: 'ja-JP',
        textTarget: 'はい、 味噌ラーメンを 一つ お願いします。',
        textPt: 'Sim, um missô lámen, por favor.',
        tokens: [
          { surface: '一つ', lemma: 'ひとつ', translationPt: 'um (contador geral)', ipa: '/çi.to.t͡sɯ/', partOfSpeech: 'Contador', notePt: 'ひとつ・ふたつ・みっつ salvam qualquer pedido!' },
        ],
      },
    ],
  },
  {
    id: 'vid-ja-2',
    languageCode: 'ja',
    level: 'B1',
    categoryPt: 'Cotidiano',
    titleTarget: '駅での乗り換え',
    titlePt: 'Baldeação na Estação',
    durationLabel: '0:42',
    gradientClass: 'from-pink-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Osaka · Estação Umeda',
    lines: [
      {
        id: 'ja2-l1',
        speaker: 'ケン',
        voice: 'male',
        dialectCode: 'ja-KANSAI',
        textTarget: 'すみません、 京都行きの 電車は 何番線 ですか？',
        textPt: 'Com licença, o trem para Quioto sai de qual plataforma?',
        tokens: [
          { surface: '何番線', lemma: '何番線 (なんばんせん)', translationPt: 'qual plataforma/linha', ipa: '/naɴ.baɴ.seɴ/', partOfSpeech: 'Substantivo', notePt: 'Indispensável para viajar de trem no Japão.' },
        ],
      },
    ],
  },
  {
    id: 'vid-ja-3',
    languageCode: 'ja',
    level: 'B2',
    categoryPt: 'Negócios',
    titleTarget: '会議の日程調整',
    titlePt: 'Ajuste de Agenda Corporativa',
    durationLabel: '0:46',
    gradientClass: 'from-slate-900 via-rose-950 to-slate-950',
    sceneSettingPt: 'Escritório · Keigo profissional',
    lines: [
      {
        id: 'ja3-l1',
        speaker: '佐藤',
        voice: 'female',
        dialectCode: 'ja-JP',
        textTarget: '来週の 打ち合わせですが、 水曜日の 午後は ご都合 いかが でしょうか。',
        textPt: 'Sobre a reunião da semana que vem, quarta-feira à tarde seria conveniente para o(a) senhor(a)?',
        tokens: [
          { surface: 'ご都合', lemma: '都合 (つごう)', translationPt: 'conveniência / disponibilidade', ipa: '/ɡo.t͡sɯ.ɡoː/', partOfSpeech: 'Keigo', notePt: 'Forma polida clássica em e-mails e ligações.' },
        ],
      },
    ],
  },

  // CHINESE (3 clips)
  {
    id: 'vid-zh-1',
    languageCode: 'zh',
    level: 'A2',
    categoryPt: 'Compras',
    titleTarget: '在茶馆点茶',
    titlePt: 'Pedindo Chá na Casa de Chá',
    durationLabel: '0:38',
    gradientClass: 'from-red-950 via-amber-950 to-slate-950',
    sceneSettingPt: 'Pequim · Casa de chá tradicional',
    lines: [
      {
        id: 'zh1-l1',
        speaker: '服务员',
        voice: 'female',
        dialectCode: 'zh-CN',
        textTarget: '您好！ 请问 您 想 喝 绿茶 还是 乌龙茶？',
        textPt: 'Olá! Gostaria de tomar chá verde ou chá oolong?',
        tokens: [
          { surface: '还是', lemma: '还是 (háishi)', translationPt: 'ou (em perguntas)', ipa: '/xai˧˥ ʂɻ̩˥˩/', partOfSpeech: 'Conjunção', notePt: 'Em perguntas usa-se 还是; em afirmações, 或者.' },
        ],
      },
      {
        id: 'zh1-l2',
        speaker: '林涛',
        voice: 'male',
        dialectCode: 'zh-TW',
        textTarget: '我 要 一壶 乌龙茶， 不要 加糖， 谢谢！',
        textPt: 'Quero um bule de chá oolong, sem açúcar, obrigado!',
        tokens: [
          { surface: '一壶', lemma: '壶 (hú)', translationPt: 'um bule (classificador)', ipa: '/i˥˩ xu˧˥/', partOfSpeech: 'Classificador', notePt: '壶 mede líquidos em bule ou jarra.' },
        ],
      },
    ],
  },
  {
    id: 'vid-zh-2',
    languageCode: 'zh',
    level: 'B1',
    categoryPt: 'Viagem',
    titleTarget: '高铁站问路',
    titlePt: 'Pedindo Informação no Trem-Bala',
    durationLabel: '0:42',
    gradientClass: 'from-orange-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Xangai · Estação Hongqiao',
    lines: [
      {
        id: 'zh2-l1',
        speaker: '旅客',
        voice: 'male',
        dialectCode: 'zh-CN',
        textTarget: '请问 检票口 在 二楼 还是 三楼？ 火车 快 开了。',
        textPt: 'Por favor, o portão de embarque fica no 2º ou 3º andar? O trem já vai partir.',
        tokens: [
          { surface: '检票口', lemma: '检票口 (jiǎnpiàokǒu)', translationPt: 'portão de conferência de bilhetes', ipa: '/tɕjɛn˨˩ pʰjɑu˥˩ kʰou˨˩/', partOfSpeech: 'Substantivo', notePt: 'Palavra-chave em estações ferroviárias chinesas.' },
        ],
      },
    ],
  },
  {
    id: 'vid-zh-3',
    languageCode: 'zh',
    level: 'B2',
    categoryPt: 'Tecnologia',
    titleTarget: '移动支付与生活',
    titlePt: 'Pagamentos Móveis no Dia a Dia',
    durationLabel: '0:46',
    gradientClass: 'from-rose-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Entrevista sobre economia digital',
    lines: [
      {
        id: 'zh3-l1',
        speaker: '记者',
        voice: 'female',
        dialectCode: 'zh-CN',
        textTarget: '如今 无论 在 菜市场 还是 商场， 大家 都 习惯 扫码 付款。',
        textPt: 'Hoje em dia, seja na feira ou no shopping, todos estão acostumados a pagar por QR code.',
        tokens: [
          { surface: '扫码', lemma: '扫码 (sǎomǎ)', translationPt: 'escanear QR code', ipa: '/sɑu˨˩ ma˨˩/', partOfSpeech: 'Verbo', notePt: 'Expressão ubíqua na China moderna.' },
        ],
      },
    ],
  },

  // ARABIC (3 clips)
  {
    id: 'vid-ar-1',
    languageCode: 'ar',
    level: 'A2',
    categoryPt: 'Café',
    titleTarget: 'في المقهى الصباحي',
    titlePt: 'Na Cafeteria pela Manhã',
    durationLabel: '0:40',
    gradientClass: 'from-teal-950 via-emerald-950 to-slate-950',
    sceneSettingPt: 'Riade · Café tradicional e moderno',
    lines: [
      {
        id: 'ar1-l1',
        speaker: 'النادل',
        voice: 'male',
        dialectCode: 'ar-SA',
        textTarget: 'أهلاً وسهلاً! ماذا تحب أن تشرب اليوم؟',
        textPt: 'Seja muito bem-vindo! O que você gostaria de beber hoje?',
        tokens: [
          { surface: 'أهلاً', lemma: 'أهلاً وسهلاً', translationPt: 'seja bem-vindo', ipa: '/ʔah.lan wa sah.lan/', partOfSpeech: 'Saudação', notePt: 'Saudação calorosa universal no mundo árabe.' },
        ],
      },
      {
        id: 'ar1-l2',
        speaker: 'سارة',
        voice: 'female',
        dialectCode: 'ar-EG',
        textTarget: 'من فضلك، أريد قهوة عربية بدون سكر.',
        textPt: 'Por favor, quero um café árabe sem açúcar.',
        tokens: [
          { surface: 'بدون', lemma: 'بدون', translationPt: 'sem', ipa: '/bi.duːn/', partOfSpeech: 'Preposição', notePt: 'بدون سكر = sem açúcar.' },
        ],
      },
    ],
  },
  {
    id: 'vid-ar-2',
    languageCode: 'ar',
    level: 'B1',
    categoryPt: 'Viagem',
    titleTarget: 'حجز غرفة في الفندق',
    titlePt: 'Check-in no Hotel',
    durationLabel: '0:42',
    gradientClass: 'from-emerald-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Cairo · Recepção de hotel',
    lines: [
      {
        id: 'ar2-l1',
        speaker: 'الموظف',
        voice: 'male',
        dialectCode: 'ar-EG',
        textTarget: 'هل لديك حجز مسبق باسمك أم تود غرفة جديدة لليلتين؟',
        textPt: 'Você tem reserva prévia em seu nome ou deseja um novo quarto por duas noites?',
        tokens: [
          { surface: 'حجز', lemma: 'حجز', translationPt: 'reserva', ipa: '/ħadʒz/', partOfSpeech: 'Substantivo', notePt: 'حجز مسبق = reserva antecipada.' },
        ],
      },
    ],
  },
  {
    id: 'vid-ar-3',
    languageCode: 'ar',
    level: 'B2',
    categoryPt: 'Cultura',
    titleTarget: 'التعليم الرقمي الحديث',
    titlePt: 'Educação Digital Moderna',
    durationLabel: '0:45',
    gradientClass: 'from-cyan-950 via-teal-950 to-slate-950',
    sceneSettingPt: 'Fórum educacional em MSA',
    lines: [
      {
        id: 'ar3-l1',
        speaker: 'المحاضرة',
        voice: 'female',
        dialectCode: 'ar-SA',
        textTarget: 'تتيح المنصات التفاعلية للطلاب ممارسة اللغة يومياً بمرونة عالية.',
        textPt: 'As plataformas interativas permitem aos alunos praticar o idioma diariamente com alta flexibilidade.',
        tokens: [
          { surface: 'بمرونة', lemma: 'مرونة', translationPt: 'com flexibilidade', ipa: '/bi.muˈruː.na/', partOfSpeech: 'Substantivo', notePt: 'Vocabulário formal de MSA para ALPT B2.' },
        ],
      },
    ],
  },

  // DUTCH (3 clips)
  {
    id: 'vid-nl-1',
    languageCode: 'nl',
    level: 'A2',
    categoryPt: 'Cotidiano',
    titleTarget: 'Fietsen en Koffie in Utrecht',
    titlePt: 'Bicicleta e Café em Utrecht',
    durationLabel: '0:38',
    gradientClass: 'from-orange-950 via-amber-950 to-slate-950',
    sceneSettingPt: 'Utrecht · Café à beira do canal',
    lines: [
      {
        id: 'nl1-l1',
        speaker: 'Ober',
        voice: 'male',
        dialectCode: 'nl-NL',
        textTarget: 'Goedemorgen! Mag ik u alvast iets te drinken brengen?',
        textPt: 'Bom dia! Posso já trazer algo para beber?',
        tokens: [
          { surface: 'alvast', lemma: 'alvast', translationPt: 'já / por enquanto / adiantando', ipa: '/ɑlˈvɑst/', partOfSpeech: 'Advérbio', notePt: 'Palavra tipicamente holandesa muito usada no dia a dia!' },
        ],
      },
    ],
  },
  {
    id: 'vid-nl-2',
    languageCode: 'nl',
    level: 'B1',
    categoryPt: 'Trabalho',
    titleTarget: 'Aansluiten bij de Vergadering',
    titlePt: 'Entrando na Reunião',
    durationLabel: '0:42',
    gradientClass: 'from-amber-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Amsterdã · Escritório',
    lines: [
      {
        id: 'nl2-l1',
        speaker: 'Lotte',
        voice: 'female',
        dialectCode: 'nl-NL',
        textTarget: 'Zullen we eerst de planning doornemen voordat we de begroting bespreken?',
        textPt: 'Vamos primeiro revisar o planejamento antes de discutirmos o orçamento?',
        tokens: [
          { surface: 'doornemen', lemma: 'doornemen', translationPt: 'revisar / passar por cima de', ipa: '/ˈdoːrˌneː.mə(n)/', partOfSpeech: 'Verbo Separável', notePt: 'Muito comum em reuniões (NT2-II).' },
        ],
      },
    ],
  },
  {
    id: 'vid-nl-3',
    languageCode: 'nl',
    level: 'B2',
    categoryPt: 'Sociedade',
    titleTarget: 'Duurzaam Wonen',
    titlePt: 'Moradia Sustentável',
    durationLabel: '0:45',
    gradientClass: 'from-slate-800 via-orange-950 to-slate-950',
    sceneSettingPt: 'Roterdã · Entrevista',
    lines: [
      {
        id: 'nl3-l1',
        speaker: 'Architect',
        voice: 'male',
        dialectCode: 'nl-BE',
        textTarget: 'Er wordt steeds meer geïnvesteerd in energiezuinige woningen in het hele land.',
        textPt: 'Investe-se cada vez mais em moradias eficientes em energia em todo o país.',
        tokens: [
          { surface: 'energiezuinige', lemma: 'energiezuinig', translationPt: 'eficiente em energia', ipa: '/eː.nɛrˈʒi.zœy.nəɣ/', partOfSpeech: 'Adjetivo', notePt: 'Observe a passiva impessoal com "Er wordt...".' },
        ],
      },
    ],
  },

  // AFRIKAANS (3 clips)
  {
    id: 'vid-af-1',
    languageCode: 'af',
    level: 'A2',
    categoryPt: 'Cotidiano',
    titleTarget: 'Koffie en Beskuit in Stellenbosch',
    titlePt: 'Café e Biscoitos em Stellenbosch',
    durationLabel: '0:38',
    gradientClass: 'from-green-950 via-emerald-950 to-slate-950',
    sceneSettingPt: 'Stellenbosch · Café local',
    lines: [
      {
        id: 'af1-l1',
        speaker: 'Kelner',
        voice: 'female',
        dialectCode: 'af-ZA',
        textTarget: 'Goeiemôre! Wat kan ek vandag vir jou bring?',
        textPt: 'Bom dia! O que posso trazer para você hoje?',
        tokens: [
          { surface: 'vandag', lemma: 'vandag', translationPt: 'hoje', ipa: '/fanˈdax/', partOfSpeech: 'Advérbio', notePt: 'Na ordem STOMPI, o tempo (vandag) vem logo após o verbo.' },
        ],
      },
    ],
  },
  {
    id: 'vid-af-2',
    languageCode: 'af',
    level: 'B1',
    categoryPt: 'Viagem',
    titleTarget: 'Padlangs na Kaapstad',
    titlePt: 'Na Estrada para a Cidade do Cabo',
    durationLabel: '0:42',
    gradientClass: 'from-emerald-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Rota N1 · Viagem de carro',
    lines: [
      {
        id: 'af2-l1',
        speaker: 'Pieter',
        voice: 'male',
        dialectCode: 'af-ZA',
        textTarget: 'Ons moet nie vergeet om brandstof in te gooi voordat ons vertrek nie.',
        textPt: 'Não podemos esquecer de abastecer antes de partirmos.',
        tokens: [
          { surface: 'brandstof', lemma: 'brandstof', translationPt: 'combustível', ipa: '/ˈbrant.stɔf/', partOfSpeech: 'Substantivo', notePt: 'Repare na dupla negação obrigatória: nie ... nie.' },
        ],
      },
    ],
  },
  {
    id: 'vid-af-3',
    languageCode: 'af',
    level: 'B2',
    categoryPt: 'Cultura',
    titleTarget: 'Taal en Gemeenskap',
    titlePt: 'Língua e Comunidade',
    durationLabel: '0:44',
    gradientClass: 'from-teal-950 via-green-950 to-slate-950',
    sceneSettingPt: 'Rádio universitária',
    lines: [
      {
        id: 'af3-l1',
        speaker: 'Aanbieder',
        voice: 'female',
        dialectCode: 'af-NA',
        textTarget: 'Veeltaligheid skep nuwe geleenthede vir samewerking oor grense heen.',
        textPt: 'O multilinguismo cria novas oportunidades de cooperação além-fronteiras.',
        tokens: [
          { surface: 'geleenthede', lemma: 'geleentheid', translationPt: 'oportunidades', ipa: '/χəˈleənt.ɦeədə/', partOfSpeech: 'Substantivo', notePt: 'Vocabulário formal do Taaltoets.' },
        ],
      },
    ],
  },

  // SWEDISH (3 clips)
  {
    id: 'vid-sv-1',
    languageCode: 'sv',
    level: 'A2',
    categoryPt: 'Cultura & Fika',
    titleTarget: 'Dags för Fika i Stockholm',
    titlePt: 'Hora do Fika em Estocolmo',
    durationLabel: '0:38',
    gradientClass: 'from-blue-950 via-indigo-950 to-slate-950',
    sceneSettingPt: 'Estocolmo · Konditori aconchegante',
    lines: [
      {
        id: 'sv1-l1',
        speaker: 'Expedit',
        voice: 'female',
        dialectCode: 'sv-SE',
        textTarget: 'Hej! Vill du ha en kanelbulle till kaffet idag?',
        textPt: 'Oi! Você quer um pãozinho de canela para acompanhar o café hoje?',
        tokens: [
          { surface: 'kanelbulle', lemma: 'kanelbulle', translationPt: 'pãozinho de canela sueco', ipa: '/kaˈneːl.bɵlːɛ/', partOfSpeech: 'Substantivo', notePt: 'Ícone cultural da pausa de "fika" na Suécia.' },
        ],
      },
    ],
  },
  {
    id: 'vid-sv-2',
    languageCode: 'sv',
    level: 'B1',
    categoryPt: 'Trabalho',
    titleTarget: 'Möte om Projektet',
    titlePt: 'Reunião sobre o Projeto',
    durationLabel: '0:42',
    gradientClass: 'from-sky-950 via-slate-900 to-slate-950',
    sceneSettingPt: 'Gotemburgo · Escritório',
    lines: [
      {
        id: 'sv2-l1',
        speaker: 'Erik',
        voice: 'male',
        dialectCode: 'sv-SE',
        textTarget: 'Om vi inte hinner klart idag, kan vi fortsätta imorgon bitti.',
        textPt: 'Se não dermos conta de terminar hoje, podemos continuar amanhã cedinho.',
        tokens: [
          { surface: 'hinner', lemma: 'hinna', translationPt: 'dar tempo / conseguir a tempo', ipa: '/ˈhɪnːɛr/', partOfSpeech: 'Verbo', notePt: 'Note a regra BIFF: "inte" vem antes do verbo na subordinada!' },
        ],
      },
    ],
  },
  {
    id: 'vid-sv-3',
    languageCode: 'sv',
    level: 'B2',
    categoryPt: 'Sociedade',
    titleTarget: 'Balans i Arbetslivet',
    titlePt: 'Equilíbrio no Trabalho',
    durationLabel: '0:45',
    gradientClass: 'from-slate-800 via-blue-950 to-slate-950',
    sceneSettingPt: 'Debate sueco sobre trabalho',
    lines: [
      {
        id: 'sv3-l1',
        speaker: 'Forskare',
        voice: 'female',
        dialectCode: 'sv-FI',
        textTarget: 'Tydliga gränser mellan arbete och fritid minskar risken för utbrändhet.',
        textPt: 'Limites claros entre trabalho e tempo livre reduzem o risco de esgotamento.',
        tokens: [
          { surface: 'utbrändhet', lemma: 'utbrändhet', translationPt: 'esgotamento / burnout', ipa: '/ˈʉːt.brɛndˌheːt/', partOfSpeech: 'Substantivo', notePt: 'Tema clássico do exame TISUS / Swedex.' },
        ],
      },
    ],
  },
];

export function getInteractiveVideosByLanguage(
  languageCode: LanguageCode,
): InteractiveVideoClip[] {
  return INTERACTIVE_VIDEO_CLIPS.filter((v) => v.languageCode === languageCode);
}

export function lookupSubtitleWord(
  line: InteractiveSubtitleLine,
  rawWord: string,
): VideoWordToken {
  const clean = rawWord
    .normalize('NFKC')
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
  const lower = clean.toLowerCase();

  const exact = line.tokens.find(
    (t) =>
      t.surface.toLowerCase() === lower ||
      t.lemma.toLowerCase() === lower ||
      t.lemma.toLowerCase().split(/\s+/).includes(lower),
  );
  if (exact) return exact;

  return {
    surface: clean || rawWord,
    lemma: clean || rawWord,
    translationPt: `Termo no contexto: "${line.textPt}"`,
    ipa: 'Clique em Ouvir para pronúncia nativa',
    partOfSpeech: 'Vocabulário em contexto',
    notePt: `Salve esta expressão no seu Deck SM-2 para revisar depois com áudio nativo.`,
  };
}

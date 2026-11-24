import type { CEFRLevel, LanguageCode } from '../types/learning';

export interface PodcastLine {
  speaker: string;
  voice: 'male' | 'female';
  dialectCode: string;
  text: string;
  translationPt: string;
}

export interface PodcastEpisode {
  id: string;
  languageCode: LanguageCode;
  level: CEFRLevel;
  titlePt: string;
  titleTarget: string;
  durationLabel: string;
  themePt: string;
  videoTipPt: string;
  lines: PodcastLine[];
  question: string;
  options: string[];
  correctIndex: number;
}

interface EpSeed {
  lang: LanguageCode;
  d1: string;
  s1: string;
  d2: string;
  s2: string;
  lvl: CEFRLevel;
  titlePt: string;
  titleTarget: string;
  themePt: string;
  videoTipPt: string;
  lines: Array<[1 | 2, string, string]>;
  q: string;
  opts: [string, string, string];
  ans: number;
}

const SEEDS: EpSeed[] = [
  // EN (A1-C1)
  {
    lang: 'en', d1: 'en-US', s1: 'Olivia', d2: 'en-GB', s2: 'Arthur', lvl: 'A1',
    titlePt: 'Café da Manhã em Londres & Nova York', titleTarget: 'Morning Coffee Run',
    themePt: 'Pedidos educados, preços e small talk matinal.',
    videoTipPt: 'Busque no YouTube: "Real English Coffee Shop Ordering A1"',
    lines: [
      [1, "Good morning! Could I get an oat milk latte and a croissant, please?", "Bom dia! Poderia pegar um latte com leite de aveia e um croissant, por favor?"],
      [2, "Certainly! Would you like that to have in or to take away?", "Com certeza! Gostaria para consumir aqui ou para viagem?"],
      [1, "To take away, please. I'm heading to the subway.", "Para viagem, por favor. Estou indo para o metrô."],
      [2, "No problem at all. That comes to six pounds fifty.", "Sem problema algum. Fica seis libras e cinquenta."],
    ],
    q: 'Como Olivia prefere o pedido dela?', opts: ['Para viagem', 'Para comer na mesa', 'Sem café'], ans: 0,
  },
  {
    lang: 'en', d1: 'en-US', s1: 'Olivia', d2: 'en-GB', s2: 'Arthur', lvl: 'A2',
    titlePt: 'Perdendo o Trem & Trocando Bilhete', titleTarget: 'Missed Train at Paddington',
    themePt: 'Sobrevivência em transporte e horários.',
    videoTipPt: 'Busque: "London train station announcements English listening"',
    lines: [
      [1, "Excuse me, I just missed the 9:15 train to Oxford. Is my ticket still valid?", "Com licença, acabei de perder o trem das 9h15 para Oxford. Meu bilhete ainda vale?"],
      [2, "Let me check. It's an off-peak return, so you can catch the 9:45 from platform 4.", "Deixe-me checar. É ida e volta fora de pico, então você pode pegar o das 9h45 na plataforma 4."],
      [1, "Oh, what a relief! Do I need to pay an extra fee?", "Ah, que alívio! Preciso pagar alguma taxa extra?"],
      [2, "Not at all. Just scan the same QR code at the barrier.", "De forma alguma. Basta escanear o mesmo QR code na catraca."],
    ],
    q: 'De qual plataforma sai o próximo trem?', opts: ['Plataforma 2', 'Plataforma 4', 'Plataforma 9'], ans: 1,
  },
  {
    lang: 'en', d1: 'en-US', s1: 'Olivia', d2: 'en-GB', s2: 'Arthur', lvl: 'B1',
    titlePt: 'Consulta Médica & Farmácia', titleTarget: 'At the Walk-in Clinic',
    themePt: 'Sintomas, receitas e recomendações.',
    videoTipPt: 'Busque: "Describing symptoms in English doctor roleplay"',
    lines: [
      [2, "How long have you had this sore throat and mild fever?", "Há quanto tempo você está com essa dor de garganta e febre leve?"],
      [1, "Since Tuesday evening. I also feel exhausted after climbing stairs.", "Desde terça à noite. Também me sinto exausta ao subir escadas."],
      [2, "Your lungs sound clear, so it looks viral. Stay hydrated and rest for three days.", "Seus pulmões estão limpos, então parece viral. Hidrate-se e descanse por três dias."],
    ],
    q: 'Qual foi o diagnóstico inicial do médico?', opts: ['Infecção viral leve', 'Alergia alimentar', 'Fratura'], ans: 0,
  },
  {
    lang: 'en', d1: 'en-US', s1: 'Olivia', d2: 'en-GB', s2: 'Arthur', lvl: 'B2',
    titlePt: 'Remote Work Culture & Burnout', titleTarget: 'Async Teams Without Burnout',
    themePt: 'Produtividade assíncrona e limites saudáveis.',
    videoTipPt: 'Assista palestras TED curtas sobre "Async Remote Work".',
    lines: [
      [1, "Ever since we switched to async updates, our calendar overload dropped by forty percent.", "Desde que mudamos para atualizações assíncronas, nossa sobrecarga de agenda caiu 40%."],
      [2, "Agreed—provided people write concise summaries instead of scheduling vague check-ins.", "Concordo — desde que as pessoas escrevam resumos concisos em vez de marcar reuniões vagas."],
    ],
    q: 'What reduced calendar overload?', opts: ['Longer daily calls', 'Concise async updates', 'Working weekends'], ans: 1,
  },
  {
    lang: 'en', d1: 'en-US', s1: 'Olivia', d2: 'en-GB', s2: 'Arthur', lvl: 'C1',
    titlePt: 'AI Regulation & Ethics Podcast', titleTarget: 'Governing Autonomous Systems',
    themePt: 'Debate executivo e conectores C1.',
    videoTipPt: 'Ouça episódios curtos de "BBC Analysis" ou "The Economist Podcasts".',
    lines: [
      [2, "Albeit promising in diagnostics, opaque algorithms warrant rigorous third-party audits.", "Embora promissores em diagnósticos, algoritmos opacos exigem auditorias rigorosas de terceiros."],
      [1, "Precisely. Innovation thrives not in a vacuum, but within predictable accountability frameworks.", "Exatamente. A inovação prospera não no vácuo, mas dentro de marcos previsíveis de responsabilidade."],
    ],
    q: 'What do opaque algorithms require?', opts: ['Third-party audits', 'Zero oversight', 'Manual spreadsheets'], ans: 0,
  },

  // ES (A1-C1)
  {
    lang: 'es', d1: 'es-ES', s1: 'Diego', d2: 'es-MX', s2: 'Sofía', lvl: 'A1',
    titlePt: 'Pedindo Tapas em Madri', titleTarget: 'De Tapas por el Centro',
    themePt: 'Comida, conta e cortesia.',
    videoTipPt: 'Busque: "Pedir comida en un restaurante español A1"',
    lines: [
      [1, "¡Buenas tardes! ¿Nos trae dos aguas con gas y una tortilla española, por favor?", "Boa tarde! Nos traz duas águas com gás e uma tortilha espanhola, por favor?"],
      [2, "¡Claro que sí! ¿Quieren algo más para compartir?", "Claro que sim! Querem mais alguma coisa para compartilhar?"],
      [1, "De momento eso es todo. ¡Muchas gracias!", "Por enquanto é só isso. Muito obrigado!"],
    ],
    q: 'O que pediram para beber?', opts: ['Duas águas com gás', 'Dois cafés', 'Suco de laranja'], ans: 0,
  },
  {
    lang: 'es', d1: 'es-ES', s1: 'Diego', d2: 'es-MX', s2: 'Sofía', lvl: 'A2',
    titlePt: 'Check-in no Hotel & Wi-Fi', titleTarget: 'Llegada al Hotel',
    themePt: 'Hospedagem e horários.',
    videoTipPt: 'Busque: "Spanish hotel check in conversation"',
    lines: [
      [2, "Bienvenidos. ¿Tienen reserva a nombre de quién?", "Bem-vindos. Têm reserva em nome de quem?"],
      [1, "A nombre de Diego Silva. ¿El desayuno está incluido?", "Em nome de Diego Silva. O café da manhã está incluído?"],
      [2, "Sí, de siete a diez en la primera planta. Aquí tiene la clave del wifi.", "Sim, das sete às dez no primeiro andar. Aqui está a senha do wi-fi."],
    ],
    q: 'Em que horário é servido o café da manhã?', opts: ['Das 7h às 10h', 'Das 6h às 8h', 'Ao meio-dia'], ans: 0,
  },
  {
    lang: 'es', d1: 'es-ES', s1: 'Diego', d2: 'es-MX', s2: 'Sofía', lvl: 'B1',
    titlePt: 'Alugando Apartamento no Exterior', titleTarget: 'Alquiler y Fianza',
    themePt: 'Moradia, contrato e caução.',
    videoTipPt: 'Busque: "Alquilar piso en España vocabulario"',
    lines: [
      [1, "¿Los gastos de comunidad y calefacción entran en la mensualidad?", "As taxas de condomínio e aquecimento entram na mensalidade?"],
      [2, "La comunidad sí, pero la luz y el gas van aparte según consumo.", "O condomínio sim, mas luz e gás são à parte conforme o consumo."],
    ],
    q: 'O que está incluído no aluguel?', opts: ['Condomínio (comunidad)', 'Luz e gás', 'Internet móvel'], ans: 0,
  },
  {
    lang: 'es', d1: 'es-ES', s1: 'Diego', d2: 'es-MX', s2: 'Sofía', lvl: 'B2',
    titlePt: 'Movilidad Urbana Sostenible', titleTarget: 'Ciudades sin Coches',
    themePt: 'Sustentabilidade urbana em espanhol.',
    videoTipPt: 'Ouça trechos de "Radio Ambulante" ou "Hoy Hablamos".',
    lines: [
      [2, "Aunque al principio hubo críticas, peatonalizar el centro disparó las ventas del comercio local.", "Embora no início houvesse críticas, tornar o centro exclusivo para pedestres disparou as vendas locais."],
      [1, "Siempre que exista transporte público fiable, la ciudadanía adopta el cambio rápidamente.", "Desde que haja transporte público confiável, a população adota a mudança rapidamente."],
    ],
    q: '¿Qué pasó tras peatonalizar el centro?', opts: ['Subieron las ventas locales', 'Cerraron las tiendas', 'Aumentó el tráfico'], ans: 0,
  },
  {
    lang: 'es', d1: 'es-ES', s1: 'Diego', d2: 'es-MX', s2: 'Sofía', lvl: 'C1',
    titlePt: 'Economía Circular en Latinoamérica', titleTarget: 'Transición Energética',
    themePt: 'Debate C1 sobre inovação e infraestrutura.',
    videoTipPt: 'Ouça entrevistas de "El País Podcast".',
    lines: [
      [1, "No obstante los avances normativos, urge invertir en redes de distribución inteligentes.", "Não obstante os avanços normativos, urge investir em redes de distribuição inteligentes."],
      [2, "De lo contrario, la generación renovable sufrirá cuellos de botella estructurales.", "Caso contrário, a geração renovável sofrerá gargalos estruturais."],
    ],
    q: '¿Dónde urge invertir?', opts: ['En redes inteligentes', 'En combustibles fósiles', 'En publicidad'], ans: 0,
  },

  // FR (A1-C1)
  {
    lang: 'fr', d1: 'fr-FR', s1: 'Camille', d2: 'fr-CA', s2: 'Lucas', lvl: 'A1',
    titlePt: 'Na Padaria Parisiense', titleTarget: 'À la Boulangerie',
    themePt: 'Pedidos educados em francês ("Je voudrais").',
    videoTipPt: 'Busque: "Commander à la boulangerie français A1"',
    lines: [
      [1, "Bonjour monsieur ! Je voudrais une baguette tradition et deux pains au chocolat, s'il vous plaît.", "Bom dia, senhor! Eu gostaria de uma baguete tradicional e dois pains au chocolat, por favor."],
      [2, "Avec plaisir ! Ce sera tout ?", "Com prazer! Vai ser só isso?"],
      [1, "Oui, merci beaucoup. Bonne journée !", "Sim, muito obrigada. Bom dia!"],
    ],
    q: 'O que Camille pediu na padaria?', opts: ['Uma baguete e dois pains au chocolat', 'Um café e um suco', 'Apenas água'], ans: 0,
  },
  {
    lang: 'fr', d1: 'fr-FR', s1: 'Camille', d2: 'fr-CA', s2: 'Lucas', lvl: 'A2',
    titlePt: 'Pedindo Direções no Metrô', titleTarget: 'Correspondance à Châtelet',
    themePt: 'Transporte público e orientação.',
    videoTipPt: 'Busque: "Demander son chemin en français"',
    lines: [
      [2, "Excusez-moi, quelle ligne faut-il prendre pour aller au Louvre ?", "Com licença, qual linha devo pegar para ir ao Louvre?"],
      [1, "Prenez la ligne 1 direction La Défense et descendez à Palais Royal.", "Pegue a linha 1 direção La Défense e desça em Palais Royal."],
    ],
    q: 'Qual linha leva ao Louvre?', opts: ['Linha 1', 'Linha 14', 'Linha 6'], ans: 0,
  },
  {
    lang: 'fr', d1: 'fr-FR', s1: 'Camille', d2: 'fr-CA', s2: 'Lucas', lvl: 'B1',
    titlePt: 'Entrevista de Trabalho em Lyon', titleTarget: 'Entretien Professionnel',
    themePt: 'Experiência profissional e metas.',
    videoTipPt: 'Busque: "InnerFrench" (episódios intermediários).',
    lines: [
      [1, "J'ai dirigé une équipe de cinq personnes pendant trois ans dans le secteur numérique.", "Liderei uma equipe de cinco pessoas por três anos no setor digital."],
      [2, "Très bien. Qu'est-ce qui vous motive le plus dans ce nouveau poste ?", "Muito bem. O que mais a motiva neste novo cargo?"],
    ],
    q: 'Por quantos anos ela liderou uma equipe?', opts: ['Três anos', 'Seis meses', 'Dez anos'], ans: 0,
  },
  {
    lang: 'fr', d1: 'fr-FR', s1: 'Camille', d2: 'fr-CA', s2: 'Lucas', lvl: 'B2',
    titlePt: 'Semaine de Quatre Jours', titleTarget: 'Réinventer le Temps de Travail',
    themePt: 'Debate B2 em francês.',
    videoTipPt: 'Ouça "France Culture" ou "RFI Savoirs".',
    lines: [
      [2, "Bien que certains redoutent une baisse de productivité, les essais pilotes montrent l'inverse.", "Embora alguns temam queda de produtividade, os testes piloto mostram o contrário."],
      [1, "À condition toutefois de repenser l'organisation des réunions inutiles.", "Contanto que se repense a organização das reuniões inúteis."],
    ],
    q: 'Que montrent les essais pilotes ?', opts: ['Une hausse ou maintien de productivité', 'Une faillite immédiate', 'Aucune donnée'], ans: 0,
  },
  {
    lang: 'fr', d1: 'fr-FR', s1: 'Camille', d2: 'fr-CA', s2: 'Lucas', lvl: 'C1',
    titlePt: 'Souveraineté Numérique Européenne', titleTarget: 'Enjeux Technologiques C1',
    themePt: 'Análise crítica C1.',
    videoTipPt: 'Ouça podcasts de "Le Monde".',
    lines: [
      [1, "Il n'en demeure pas moins que la dépendance aux infrastructures cloud pose un défi stratégique.", "Não deixa de ser verdade que a dependência de nuvem impõe um desafio estratégico."],
    ],
    q: 'Quel est le défi mentionné ?', opts: ['La dépendance aux infrastructures cloud', 'Le prix du papier', 'Le tourisme hivernal'], ans: 0,
  },

  // IT (A1-C1)
  {
    lang: 'it', d1: 'it-IT', s1: 'Lorenzo', d2: 'it-CH', s2: 'Giulia', lvl: 'A1',
    titlePt: 'Un Caffè al Banco em Roma', titleTarget: 'Al Bar Italiano',
    themePt: 'Café, sorvete e cumprimentos.',
    videoTipPt: 'Busque: "Ordinare al bar italiano A1"',
    lines: [
      [1, "Buongiorno! Vorrei un cappuccino e un cornetto alla crema, per favore.", "Bom dia! Gostaria de um cappuccino e um croissant de creme, por favor."],
      [2, "Subito! Lo prende al banco o al tavolo?", "Já vai! Vai tomar no balcão ou na mesa?"],
    ],
    q: 'O que Lorenzo pediu para comer?', opts: ['Um cornetto de creme', 'Uma pizza', 'Um sanduíche'], ans: 0,
  },
  {
    lang: 'it', d1: 'it-IT', s1: 'Lorenzo', d2: 'it-CH', s2: 'Giulia', lvl: 'A2',
    titlePt: 'Comprando Passagem de Trem', titleTarget: 'Alla Stazione Termini',
    themePt: 'Horários, plataformas e bilhetes.',
    videoTipPt: 'Busque: "Comprare biglietto treno italiano"',
    lines: [
      [2, "A che ora parte il prossimo Frecciarossa per Firenze?", "A que horas parte o próximo Frecciarossa para Florença?"],
      [1, "Tra venti minuti, dal binario otto. Si ricordi di convalidare il biglietto!", "Em vinte minutos, da plataforma oito. Lembre-se de validar o bilhete!"],
    ],
    q: 'De qual plataforma sai o trem?', opts: ['Binario 8', 'Binario 2', 'Binario 15'], ans: 0,
  },
  {
    lang: 'it', d1: 'it-IT', s1: 'Lorenzo', d2: 'it-CH', s2: 'Giulia', lvl: 'B1',
    titlePt: 'Na Farmácia Italiana', titleTarget: 'In Farmacia',
    themePt: 'Saúde e recomendações.',
    videoTipPt: 'Busque: "Podcast Italiano B1".',
    lines: [
      [1, "Ho un forte mal di testa da ieri sera. Cosa mi consiglia?", "Estou com uma dor de cabeça forte desde ontem à noite. O que me recomenda?"],
      [2, "Le consiglio queste compresse dopo i pasti e molta acqua.", "Recomendo estes comprimidos após as refeições e muita água."],
    ],
    q: 'Quando tomar os comprimidos?', opts: ['Após as refeições', 'Em jejum', 'Antes de correr'], ans: 0,
  },
  {
    lang: 'it', d1: 'it-IT', s1: 'Lorenzo', d2: 'it-CH', s2: 'Giulia', lvl: 'B2',
    titlePt: 'Turismo Sostenibile a Venezia', titleTarget: 'Gestire i Flussi Turistici',
    themePt: 'Imersão B2 em italiano.',
    videoTipPt: 'Ouça "Podcast Italiano" ou "Rai Radio 3".',
    lines: [
      [2, "Sebbene il turismo sostenga l'economia, occorre tutelare i residenti e il patrimonio storico.", "Embora o turismo sustente a economia, é preciso proteger moradores e patrimônio."],
    ],
    q: 'Cosa occorre tutelare?', opts: ['Residenti e patrimonio storico', 'Solo i centri commerciali', 'Le autostrade'], ans: 0,
  },
  {
    lang: 'it', d1: 'it-IT', s1: 'Lorenzo', d2: 'it-CH', s2: 'Giulia', lvl: 'C1',
    titlePt: 'Design & Artigianato Digitale', titleTarget: 'Innovazione nel Made in Italy',
    themePt: 'Registro C1 executivo.',
    videoTipPt: 'Ouça "Il Sole 24 Ore" podcasts.',
    lines: [
      [1, "Qualora le PMI integrino la manifattura tradizionale con l'analisi dati, il margine cresce.", "Caso as PMEs integrem manufatura tradicional com dados, a margem cresce."],
    ],
    q: 'Cosa fa crescere il margine?', opts: ['Integrare manifattura e dati', 'Ridurre la qualità', 'Chiudere le fabbriche'], ans: 0,
  },

  // DE (A1-C1)
  {
    lang: 'de', d1: 'de-DE', s1: 'Lukas', d2: 'de-AT', s2: 'Hannah', lvl: 'A1',
    titlePt: 'Padaria & Café em Berlim', titleTarget: 'In der Bäckerei',
    themePt: 'Pedidos com "Ich möchte" e preços.',
    videoTipPt: 'Busque: "Easy German A1 Bakery".',
    lines: [
      [1, "Guten Morgen! Ich möchte zwei Brötchen und einen Kaffee zum Mitnehmen, bitte.", "Bom dia! Gostaria de dois pãezinhos e um café para viagem, por favor."],
      [2, "Gerne! Das macht zusammen vier Euro zwanzig.", "Com prazer! Fica quatro euros e vinte no total."],
    ],
    q: 'Quanto custou o pedido?', opts: ['4,20 €', '10,00 €', '2,50 €'], ans: 0,
  },
  {
    lang: 'de', d1: 'de-DE', s1: 'Lukas', d2: 'de-AT', s2: 'Hannah', lvl: 'A2',
    titlePt: 'No Supermercado Alemão (Pfand)', titleTarget: 'Einkaufen und Pfand',
    themePt: 'Compras e reciclagem de garrafas.',
    videoTipPt: 'Busque: "Easy German Supermarkt Pfand".',
    lines: [
      [2, "Entschuldigung, wo kann ich die leeren Flaschen für das Pfand abgeben?", "Com licença, onde posso devolver as garrafas vazias para o depósito (Pfand)?"],
      [1, "Der Automat steht direkt links neben dem Eingang.", "A máquina fica logo à esquerda ao lado da entrada."],
    ],
    q: 'Onde fica a máquina de Pfand?', opts: ['À esquerda da entrada', 'No segundo andar', 'No caixa 5'], ans: 0,
  },
  {
    lang: 'de', d1: 'de-DE', s1: 'Lukas', d2: 'de-AT', s2: 'Hannah', lvl: 'B1',
    titlePt: 'Marcando Consulta no Médico', titleTarget: 'Termin beim Hausarzt',
    themePt: 'Saúde e seguro (Krankenkasse).',
    videoTipPt: 'Busque: "Deutsch beim Arzt B1".',
    lines: [
      [1, "Ich habe seit gestern Fieber und brauche heute noch einen Termin.", "Estou com febre desde ontem e preciso de uma consulta ainda hoje."],
      [2, "Kommen Sie bitte um 14 Uhr mit Ihrer Versichertenkarte vorbei.", "Por favor passe aqui às 14h com seu cartão do plano de saúde."],
    ],
    q: 'O que é preciso levar às 14h?', opts: ['O cartão do seguro (Versichertenkarte)', 'O passaporte apenas', 'Um exame antigo'], ans: 0,
  },
  {
    lang: 'de', d1: 'de-DE', s1: 'Lukas', d2: 'de-AT', s2: 'Hannah', lvl: 'B2',
    titlePt: 'Energiewende & Bahnverkehr', titleTarget: 'Nachhaltige Mobilität',
    themePt: 'Imersão B2 em alemão.',
    videoTipPt: 'Ouça "Tagesschau in 100 Sekunden" ou "Easy German Podcast".',
    lines: [
      [2, "Obwohl das Deutschlandticket viele Pendler entlastet, braucht die Bahn pünktlichere Züge.", "Embora o Deutschlandticket alivie passageiros, a ferrovia precisa de trens mais pontuais."],
    ],
    q: 'Was braucht die Bahn laut Hannah?', opts: ['Pünktlichere Züge', 'Teurere Tickets', 'Weniger Haltestellen'], ans: 0,
  },
  {
    lang: 'de', d1: 'de-DE', s1: 'Lukas', d2: 'de-AT', s2: 'Hannah', lvl: 'C1',
    titlePt: 'Fachkräftemangel & Weiterbildung', titleTarget: 'Arbeitsmarkt im Wandel',
    themePt: 'Debate executivo C1.',
    videoTipPt: 'Ouça "Deutschlandfunk Hintergrund".',
    lines: [
      [1, "In Anbetracht des demografischen Wandels gewinnt betriebliche Qualifizierung enorm an Bedeutung.", "Diante da mudança demográfica, a qualificação interna ganha enorme importância."],
    ],
    q: 'Was gewinnt an Bedeutung?', opts: ['Betriebliche Qualifizierung', 'Papierarchive', 'Kürzere Pausen'], ans: 0,
  },

  // RU (A1-C1)
  {
    lang: 'ru', d1: 'ru-RU', s1: 'Дмитрий', d2: 'ru-SPB', s2: 'Анастасия', lvl: 'A1',
    titlePt: 'No Café em Moscou', titleTarget: 'В кофейне в Москве',
    themePt: 'Pedidos simples em russo.',
    videoTipPt: 'Busque: "Russian Comprehensible Input A1".',
    lines: [
      [1, "Здравствуйте! Можно, пожалуйста, один капучино и блины с мёдом?", "Olá! Posso pedir, por favor, um cappuccino e panquecas com mel?"],
      [2, "Конечно! Садитесь за столик, я принесу через пять минут.", "Claro! Sente-se à mesa, trago em cinco minutos."],
    ],
    q: 'O que Dmitry pediu além do café?', opts: ['Panquecas com mel (блины с мёдом)', 'Sopa borscht', 'Sorvete'], ans: 0,
  },
  {
    lang: 'ru', d1: 'ru-RU', s1: 'Дмитрий', d2: 'ru-SPB', s2: 'Анастасия', lvl: 'A2',
    titlePt: 'No Metrô de São Petersburgo', titleTarget: 'Дорога до Эрмитажа',
    themePt: 'Direções e transporte.',
    videoTipPt: 'Busque: "Russian with Max" (nível A2).',
    lines: [
      [2, "Скажите, пожалуйста, как доехать до Эрмитажа?", "Diga-me, por favor, como chegar ao Hermitage?"],
      [1, "Выходите на станции Адмиралтейская и идите прямо пять минут.", "Saia na estação Admiralteyskaya e siga reto por cinco minutos."],
    ],
    q: 'Em qual estação descer?', opts: ['Адмиралтейская', 'Московская', 'Киевская'], ans: 0,
  },
  {
    lang: 'ru', d1: 'ru-RU', s1: 'Дмитрий', d2: 'ru-SPB', s2: 'Анастасия', lvl: 'B1',
    titlePt: 'Comprando Remédio na Farmácia', titleTarget: 'В аптеке',
    themePt: 'Saúde e sintomas.',
    videoTipPt: 'Ouça "Russian Progress" B1.',
    lines: [
      [1, "У меня болит голова и заложен нос. Что вы посоветуете?", "Estou com dor de cabeça e nariz entupido. O que você recomenda?"],
      [2, "Возьмите эти капли и пейте больше тёплого чая.", "Leve estas gotas e beba bastante chá morno."],
    ],
    q: 'O que a farmacêutica recomendou beber?', opts: ['Chá morno (тёплый чай)', 'Café gelado', 'Refrigerante'], ans: 0,
  },
  {
    lang: 'ru', d1: 'ru-RU', s1: 'Дмитрий', d2: 'ru-SPB', s2: 'Анастасия', lvl: 'B2',
    titlePt: 'Удалённая работа и баланс', titleTarget: 'Гибкий график в IT',
    themePt: 'Imersão B2 em russo.',
    videoTipPt: 'Ouça podcasts de "Arzamas" ou "Russian with Max B2".',
    lines: [
      [2, "Несмотря на свободу удалёнки, важно чётко разделять рабочее время и отдых.", "Apesar da liberdade do remoto, é vital separar trabalho e descanso."],
    ],
    q: 'Что важно разделять на удалёнке?', opts: ['Рабочее время и отдых', 'Только выходные', 'Зарплату и налоги'], ans: 0,
  },
  {
    lang: 'ru', d1: 'ru-RU', s1: 'Дмитрий', d2: 'ru-SPB', s2: 'Анастасия', lvl: 'C1',
    titlePt: 'Культура чтения и нейросети', titleTarget: 'Будущее образования',
    themePt: 'Debate C1 em russo.',
    videoTipPt: 'Ouça palestras em russo sobre tecnologia e cultura.',
    lines: [
      [1, "По мере развития алгоритмов критическое мышление становится главным конкурентным преимуществом.", "À medida que algoritmos evoluem, o pensamento crítico torna-se o principal diferencial."],
    ],
    q: 'Что становится главным преимуществом?', opts: ['Критическое мышление', 'Быстрая печать', 'Заучивание дат'], ans: 0,
  },

  // JA (A1-C1)
  {
    lang: 'ja', d1: 'ja-JP', s1: '健太', d2: 'ja-KANSAI', s2: 'さくら', lvl: 'A1',
    titlePt: 'Na Loja de Conveniência (Konbini)', titleTarget: 'コンビニでお買い物',
    themePt: 'Sobrevivência no Japão.',
    videoTipPt: 'Busque: "Comprehensible Japanese Konbini A1".',
    lines: [
      [2, "いらっしゃいませ！お弁当は温めますか？", "Bem-vindo! Gostaria de aquecer a marmita (bentō)?"],
      [1, "はい、お願いします。袋も一枚ください。", "Sim, por favor. E me dê também uma sacola."],
    ],
    q: 'O que Kenta pediu além de aquecer o bentō?', opts: ['Uma sacola (袋)', 'Um guarda-chuva', 'Café gelado'], ans: 0,
  },
  {
    lang: 'ja', d1: 'ja-JP', s1: '健太', d2: 'ja-KANSAI', s2: 'さくら', lvl: 'A2',
    titlePt: 'Pegando o Shinkansen em Tóquio', titleTarget: '東京駅で新幹線に乗る',
    themePt: 'Estação e reservas.',
    videoTipPt: 'Busque: "Nihongo con Teppei" (iniciante).',
    lines: [
      [1, "すみません、京都行きの新幹線は何番線ですか。", "Com licença, em qual plataforma sai o Shinkansen para Kyoto?"],
      [2, "１６番線です。自由席は１号車から３号車ですよ。", "Plataforma 16. Os assentos livres ficam nos vagões 1 a 3."],
    ],
    q: 'Em qual plataforma sai o Shinkansen?', opts: ['16番線', '3番線', '1番線'], ans: 0,
  },
  {
    lang: 'ja', d1: 'ja-JP', s1: '健太', d2: 'ja-KANSAI', s2: 'さくら', lvl: 'B1',
    titlePt: 'Consultando Horários com Colega', titleTarget: '会議の日程調整',
    themePt: 'Polidez no trabalho japonês.',
    videoTipPt: 'Ouça "YUYUの日本語Podcast" B1.',
    lines: [
      [2, "来週の火曜日、午後三時から打ち合わせはいかがですか。", "Na próxima terça às 15h, que tal fazermos a reunião?"],
      [1, "すみません、その時間は別の予定が入っていて…水曜日はどうでしょうか。", "Desculpe, nesse horário tenho outro compromisso... Que tal quarta-feira?"],
    ],
    q: 'Qual dia Kenta propôs no lugar de terça?', opts: ['Quarta-feira (水曜日)', 'Sexta-feira', 'Domingo'], ans: 0,
  },
  {
    lang: 'ja', d1: 'ja-JP', s1: '健太', d2: 'ja-KANSAI', s2: 'さくら', lvl: 'B2',
    titlePt: '地域の防災と助け合い', titleTarget: '災害への備え',
    themePt: 'Imersão B2 em japonês.',
    videoTipPt: 'Ouça "NHK News Web Easy" e leia em voz alta.',
    lines: [
      [1, "日頃から非常用バッグや避難場所を確認しておくことで、いざという時の不安が減ります。", "Conferir mochila de emergência e abrigos no dia a dia reduz a ansiedade na hora H."],
    ],
    q: '何を確認しておくべきですか。', opts: ['非常用バッグと避難場所', '旅行の割引券', 'レストランの予約'], ans: 0,
  },
  {
    lang: 'ja', d1: 'ja-JP', s1: '健太', d2: 'ja-KANSAI', s2: 'さくら', lvl: 'C1',
    titlePt: '日本の伝統工芸とDX', titleTarget: '職人の技とデジタル融合',
    themePt: 'Análise C1 em japonês.',
    videoTipPt: 'Ouça episódios de "NHKラジオニュース".',
    lines: [
      [2, "伝統技術を継承しつつも、海外市場への発信にはデジタル戦略が不可欠と言えます。", "Mesmo preservando técnicas tradicionais, a estratégia digital é vital para o mercado externo."],
    ],
    q: '海外市場への発信に不可欠なものは何ですか。', opts: ['デジタル戦略', '紙のカタログのみ', '値上げのみ'], ans: 0,
  },

  // ZH (A1-C1)
  {
    lang: 'zh', d1: 'zh-CN', s1: '明', d2: 'zh-TW', s2: '小雨', lvl: 'A1',
    titlePt: 'Pedindo Chá com Leite (Boba)', titleTarget: '在奶茶店点单',
    themePt: 'Pedidos com açúcar e gelo personalizados.',
    videoTipPt: 'Busque: "Ordering bubble tea in Mandarin A1".',
    lines: [
      [1, "你好！我要一杯珍珠奶茶，少冰半糖，谢谢。", "Olá! Quero um chá com pérolas de tapioca, pouco gelo e metade açúcar, obrigado."],
      [2, "好的，一共二十二块。请稍等一下！", "Certo, ao todo 22 yuans. Por favor aguarde um instante!"],
    ],
    q: 'Como Ming pediu o gelo e açúcar?', opts: ['Pouco gelo, metade açúcar', 'Sem gelo, muito açúcar', 'Quente sem chá'], ans: 0,
  },
  {
    lang: 'zh', d1: 'zh-CN', s1: '明', d2: 'zh-TW', s2: '小雨', lvl: 'A2',
    titlePt: 'Pegando Táxi até o Aeroporto', titleTarget: '打车去机场',
    themePt: 'Transporte e tempo de trajeto.',
    videoTipPt: 'Busque: "Mandarin Corner" diálogos A2.',
    lines: [
      [2, "师傅，麻烦去首都机场三号航站楼，大概要多久？", "Motorista, por favor vá ao Terminal 3 do Aeroporto Capital, quanto tempo leva?"],
      [1, "现在不堵车，走高速大概四十分钟就到了。", "Agora não há trânsito, pela via expressa chegamos em cerca de 40 minutos."],
    ],
    q: 'Para qual terminal ela está indo?', opts: ['Terminal 3 (三号航站楼)', 'Terminal 1', 'Estação Sul'], ans: 0,
  },
  {
    lang: 'zh', d1: 'zh-CN', s1: '明', d2: 'zh-TW', s2: '小雨', lvl: 'B1',
    titlePt: 'Comprando Passagem de Trem-Bala', titleTarget: '预订高铁票',
    themePt: 'Viagem e documentos na China.',
    videoTipPt: 'Ouça "TeaTime Chinese" B1.',
    lines: [
      [1, "我想改签明天上午去上海的高铁票，还有二等座吗？", "Quero remarcar a passagem de trem-bala para Xangai amanhã de manhã, ainda há 2ª classe?"],
      [2, "有的，九点半那班还有票，请出示一下您的护照。", "Sim, o trem das 9h30 ainda tem vagas, por favor mostre seu passaporte."],
    ],
    q: 'Qual documento foi pedido para remarcar?', opts: ['Passaporte (护照)', 'Cartão de ônibus', 'Recibo do hotel'], ans: 0,
  },
  {
    lang: 'zh', d1: 'zh-CN', s1: '明', d2: 'zh-TW', s2: '小雨', lvl: 'B2',
    titlePt: '移动支付与无现金社会', titleTarget: '数字化生活观察',
    themePt: 'Imersão B2 em mandarim.',
    videoTipPt: 'Ouça "Slow Chinese" ou "Talk Taiwanese Mandarin".',
    lines: [
      [2, "虽然手机扫码支付非常方便，但保留部分现金通道对老年人和外国游客同样重要。", "Embora pagar por QR code seja prático, manter opção em dinheiro é vital para idosos e turistas."],
    ],
    q: '为什么保留现金通道很重要？', opts: ['方便老年人和外国游客', '因为手机没有屏幕', '为了增加排队'], ans: 0,
  },
  {
    lang: 'zh', d1: 'zh-CN', s1: '明', d2: 'zh-TW', s2: '小雨', lvl: 'C1',
    titlePt: '人工智能与跨文化沟通', titleTarget: '语言学习的新时代',
    themePt: 'Análise C1 em mandarim.',
    videoTipPt: 'Ouça "故事FM" ou podcasts de tecnologia em chinês.',
    lines: [
      [1, "翻译工具固然提高了效率，然而真正建立信任仍离不开对文化语境的深入理解。", "Ferramentas de tradução aumentam eficiência, porém confiança genuína exige entender o contexto cultural."],
    ],
    q: '建立信任离不开什么？', opts: ['对文化语境的深入理解', '只依赖机器翻译', '减少沟通'], ans: 0,
  },
  // AR (A1-C1)
  {
    lang: 'ar', d1: 'ar-SA', s1: 'ليلى', d2: 'ar-EG', s2: 'كريم', lvl: 'A1',
    titlePt: 'Café Árabe & Boas-vindas', titleTarget: 'في المقهى',
    themePt: 'Pedidos educados em árabe.',
    videoTipPt: 'Busque: "Arabic coffee shop conversation for beginners".',
    lines: [
      [1, "صباح الخير! أريد قهوة عربية من فضلك.", "Bom dia! Quero um café árabe, por favor."],
      [2, "أهلاً وسهلاً! تفضلي، هل تريدينها بسكر؟", "Bem-vinda! Aqui está, gostaria com açúcar?"],
    ],
    q: 'ماذا طلبت ليلى في المقهى؟', opts: ['قهوة عربية', 'شاي أخضر', 'عصير برتقال'], ans: 0,
  },
  {
    lang: 'ar', d1: 'ar-SA', s1: 'ليلى', d2: 'ar-EG', s2: 'كريم', lvl: 'A2',
    titlePt: 'Check-in no Hotel no Cairo', titleTarget: 'في الفندق',
    themePt: 'Reservas e horários.',
    videoTipPt: 'Busque: "Hotel check-in Arabic dialogue".',
    lines: [
      [2, "مرحباً، عندي حجز باسم كريم لمدة ثلاث ليالٍ.", "Olá, tenho uma reserva em nome de Karim por três noites."],
      [1, "تم تأكيد الحجز، الفطور يبدأ الساعة السابعة صباحاً.", "Reserva confirmada, o café da manhã começa às sete da manhã."],
    ],
    q: 'كم ليلة سيقيم كريم في الفندق؟', opts: ['ثلاث ليالٍ', 'ليلة واحدة', 'أسبوع كامل'], ans: 0,
  },
  {
    lang: 'ar', d1: 'ar-SA', s1: 'ليلى', d2: 'ar-EG', s2: 'كريم', lvl: 'B1',
    titlePt: 'Na Farmácia & Saúde', titleTarget: 'في الصيدلية',
    themePt: 'Sintomas e recomendações.',
    videoTipPt: 'Busque: "Arabic at the pharmacy phrases".',
    lines: [
      [1, "أشعر بصداع خفيف منذ الصباح، ما الدواء المناسب؟", "Sinto uma leve dor de cabeça desde manhã, qual remédio é adequado?"],
      [2, "تناولي هذه الأقراص بعد الأكل واشربي الكثير من الماء.", "Tome estes comprimidos após comer e beba bastante água."],
    ],
    q: 'متى يجب تناول الأقراص؟', opts: ['بعد الأكل', 'قبل النوم فقط', 'بدون ماء'], ans: 0,
  },
  {
    lang: 'ar', d1: 'ar-SA', s1: 'ليلى', d2: 'ar-EG', s2: 'كريم', lvl: 'B2',
    titlePt: 'العمل عن بُعد والتوازن الرقمي', titleTarget: 'العمل المرن',
    themePt: 'Imersão B2 em árabe padrão.',
    videoTipPt: 'Ouça podcasts curtos da BBC Arabic ou Al Jazeera Podcasts.',
    lines: [
      [2, "ساهمت الاجتماعات المكتوبة غير المتزامنة في تقليل الإرهاق اليومي وزيادة الإنتاجية.", "Reuniões escritas assíncronas ajudaram a reduzir a fadiga diária e aumentar a produtividade."],
    ],
    q: 'ما نتيجة الاجتماعات غير المتزامنة؟', opts: ['تقليل الإرهاق وزيادة الإنتاجية', 'إلغاء الإنترنت', 'زيادة ساعات السفر'], ans: 0,
  },
  {
    lang: 'ar', d1: 'ar-SA', s1: 'ليلى', d2: 'ar-EG', s2: 'كريم', lvl: 'C1',
    titlePt: 'الذكاء الاصطناعي واللغة العربية', titleTarget: 'مستقبل التقنية',
    themePt: 'Análise C1 em árabe.',
    videoTipPt: 'Ouça episódios curtos de "ثمانية" (Thmanyah).',
    lines: [
      [1, "رغم تطور النماذج اللغوية، يظل فهم السياق الثقافي والبلاغي أساساً للتواصل الحقيقي.", "Apesar do avanço dos modelos de linguagem, entender o contexto cultural e retórico segue essencial."],
    ],
    q: 'ما أساس التواصل الحقيقي حسب المتحدثة؟', opts: ['فهم السياق الثقافي والبلاغي', 'الترجمة الحرفية فقط', 'تجاهل القواعد'], ans: 0,
  },
  // NL (A1-C1)
  {
    lang: 'nl', d1: 'nl-NL', s1: 'Sanne', d2: 'nl-BE', s2: 'Bram', lvl: 'A1',
    titlePt: 'Café & Stroopwafel em Amsterdã', titleTarget: 'Op het terras',
    themePt: 'Pedidos educados em holandês.',
    videoTipPt: 'Busque: "Dutch café ordering A1 listening".',
    lines: [
      [1, "Goedemorgen! Mag ik een koffie verkeerd en een stroopwafel, alstublieft?", "Bom dia! Posso pedir um café com leite e um stroopwafel, por favor?"],
      [2, "Natuurlijk! Wilt u er ook een glaasje water bij?", "Claro! Gostaria também de um copinho de água?"],
    ],
    q: 'Wat bestelt Sanne naast de koffie?', opts: ['Een stroopwafel', 'Een broodje kaas', 'Een kopje thee'], ans: 0,
  },
  {
    lang: 'nl', d1: 'nl-NL', s1: 'Sanne', d2: 'nl-BE', s2: 'Bram', lvl: 'A2',
    titlePt: 'De Trem para Utrecht', titleTarget: 'Op het station',
    themePt: 'Transporte ferroviário na Holanda.',
    videoTipPt: 'Busque: "NS train announcements Dutch A2".',
    lines: [
      [2, "Pardon, vanaf welk spoor vertrekt de intercity naar Utrecht Centraal?", "Com licença, de qual plataforma parte o trem intercity para Utrecht?"],
      [1, "Vanaf spoor 5, over vier minuten. Vergeet niet in te checken met uw OV-chipkaart.", "Da plataforma 5, em quatro minutos. Não esqueça de validar seu cartão OV."],
    ],
    q: 'Vanaf welk spoor vertrekt de trein?', opts: ['Spoor 5', 'Spoor 2', 'Spoor 9'], ans: 0,
  },
  {
    lang: 'nl', d1: 'nl-NL', s1: 'Sanne', d2: 'nl-BE', s2: 'Bram', lvl: 'B1',
    titlePt: 'Bicicleta no Dia a Dia', titleTarget: 'Fietsen in de regen',
    themePt: 'Cultura prática nos Países Baixos.',
    videoTipPt: 'Busque: "Easy Dutch cycling in Amsterdam".',
    lines: [
      [1, "In Nederland fietsen we bijna overal naartoe, zolang we een goed regenpak hebben.", "Na Holanda pedalamos para quase todo lugar, desde que tenhamos uma boa capa de chuva."],
    ],
    q: 'Wat is belangrijk bij regenachtig fietsen?', opts: ['Een goed regenpak', 'Een auto huren', 'Thuisblijven'], ans: 0,
  },
  {
    lang: 'nl', d1: 'nl-NL', s1: 'Sanne', d2: 'nl-BE', s2: 'Bram', lvl: 'B2',
    titlePt: 'Werk-privébalans in Nederland', titleTarget: 'Deeltijd en overleg',
    themePt: 'Imersão B2 em holandês.',
    videoTipPt: 'Ouça "NOS Journaal in Makkelijke Taal".',
    lines: [
      [2, "Veel bedrijven stimuleren flexibel werken, mits teams duidelijke afspraken maken over bereikbaarheid.", "Muitas empresas incentivam trabalho flexível, desde que equipes façam acordos claros de disponibilidade."],
    ],
    q: 'Wat is de voorwaarde voor flexibel werken?', opts: ['Duidelijke afspraken over bereikbaarheid', 'Geen communicatie meer', 'Alleen nachtdiensten'], ans: 0,
  },
  {
    lang: 'nl', d1: 'nl-NL', s1: 'Sanne', d2: 'nl-BE', s2: 'Bram', lvl: 'C1',
    titlePt: 'Duurzame Stedenbouw', titleTarget: 'Klimaatbestendige steden',
    themePt: 'Análise C1 em holandês.',
    videoTipPt: 'Ouça podcasts da NPO Radio 1.',
    lines: [
      [1, "Hoewel waterbeheer eeuwenoude kennis vereist, vragen hedendaagse hittegolven om meer stedelijk groen.", "Embora gestão hídrica exija saber secular, ondas de calor atuais pedem mais verde urbano."],
    ],
    q: 'Waarom pleit de spreker voor meer stedelijk groen?', opts: ['Vanwege hedendaagse hittegolven', 'Om wegen te verbreden', 'Voor minder parken'], ans: 0,
  },
  // AF (A1-C1)
  {
    lang: 'af', d1: 'af-ZA', s1: 'Annelize', d2: 'af-NA', s2: 'Pieter', lvl: 'A1',
    titlePt: 'Koffie & Beskuit na Cidade do Cabo', titleTarget: 'By die koffiewinkel',
    themePt: 'Pedidos cotidianos em africâner.',
    videoTipPt: 'Busque: "Afrikaans greetings and café phrases".',
    lines: [
      [1, "Goeiemôre! Ek wil graag ’n rooibostee en ’n stuk beskuit bestel, asseblief.", "Bom dia! Gostaria de pedir um chá rooibos e um pedaço de beskuit, por favor."],
      [2, "Met plesier! Dit kom dadelik.", "Com prazer! Já vem logo."],
    ],
    q: 'Wat bestel Annelize om te drinken?', opts: ['Rooibostee', 'Koffie', 'Lemoensap'], ans: 0,
  },
  {
    lang: 'af', d1: 'af-ZA', s1: 'Annelize', d2: 'af-NA', s2: 'Pieter', lvl: 'A2',
    titlePt: 'Planejando um Braai de Fim de Semana', titleTarget: 'Naweekplanne',
    themePt: 'Cultura sul-africana e dupla negação.',
    videoTipPt: 'Busque: "South African braai culture Afrikaans".',
    lines: [
      [2, "Ons gaan Saterdagmiddag braai, maar dit gaan gelukkig nie reën nie.", "Vamos fazer um churrasco sábado à tarde, mas felizmente não vai chover."],
    ],
    q: 'Wanneer vind die braai plaas?', opts: ['Saterdagmiddag', 'Maandagoggend', 'Vrydagnag'], ans: 0,
  },
  {
    lang: 'af', d1: 'af-ZA', s1: 'Annelize', d2: 'af-NA', s2: 'Pieter', lvl: 'B1',
    titlePt: 'Viajando pela Garden Route', titleTarget: 'Op pad na Knysna',
    themePt: 'Direções e hospedagem.',
    videoTipPt: 'Busque: "Garden Route travel Afrikaans vlog".',
    lines: [
      [1, "As ons vroeg vertrek, sal ons voor sonsondergang by die gastehuis aankom.", "Se partirmos cedo, chegaremos à pousada antes do pôr do sol."],
    ],
    q: 'Wanneer wil hulle by die gastehuis aankom?', opts: ['Voor sonsondergang', 'Middernag', 'Die volgende dag'], ans: 0,
  },
  {
    lang: 'af', d1: 'af-ZA', s1: 'Annelize', d2: 'af-NA', s2: 'Pieter', lvl: 'B2',
    titlePt: 'Afstandswerk & Samewerking', titleTarget: 'Moderne werkplekke',
    themePt: 'Imersão B2 em africâner.',
    videoTipPt: 'Ouça RSG (Radio Sonder Grense) podcasts.',
    lines: [
      [2, "Duidelike skriftelike terugvoer voorkom misverstande wanneer spanne oor verskillende tydsones werk.", "Feedback escrito claro evita mal-entendidos quando equipes atuam em fusos distintos."],
    ],
    q: 'Wat help om misverstande te voorkom?', opts: ['Duidelike skriftelike terugvoer', 'Geen vergaderings ooit', 'Langer pendeltye'], ans: 0,
  },
  {
    lang: 'af', d1: 'af-ZA', s1: 'Annelize', d2: 'af-NA', s2: 'Pieter', lvl: 'C1',
    titlePt: 'Bewaring & Ekotoerisme', titleTarget: 'Volhoubare toerisme',
    themePt: 'Análise C1 em africâner.',
    videoTipPt: 'Ouça documentários curtos da kykNET ou RSG.',
    lines: [
      [1, "Alhoewel ekotoerisme werk skep, vereis langtermyn-bewaring streng wetenskaplike monitering.", "Embora o ecoturismo gere empregos, a preservação de longo prazo exige monitoramento científico rigoroso."],
    ],
    q: 'Wat vereis langtermyn-bewaring volgens die spreker?', opts: ['Streng wetenskaplike monitering', 'Minder navorsing', 'Onbeperkte verkeer'], ans: 0,
  },
  // SV (A1-C1)
  {
    lang: 'sv', d1: 'sv-SE', s1: 'Freja', d2: 'sv-FI', s2: 'Mikkel', lvl: 'A1',
    titlePt: 'Fika em Estocolmo', titleTarget: 'På kaféet',
    themePt: 'Pedidos educados e cultura da fika.',
    videoTipPt: 'Busque: "Swedish fika café ordering A1".',
    lines: [
      [1, "Hej! Jag skulle vilja ha en bryggkaffe och en kanelbulle, tack.", "Oi! Eu gostaria de um café coado e um pãozinho de canela, obrigado."],
      [2, "Varsågod! Det blir sextiofem kronor.", "Aqui está! Ficam sessenta e cinco coroas."],
    ],
    q: 'Vad beställer Freja till sitt kaffe?', opts: ['En kanelbulle', 'En smörgås', 'En glass'], ans: 0,
  },
  {
    lang: 'sv', d1: 'sv-SE', s1: 'Freja', d2: 'sv-FI', s2: 'Mikkel', lvl: 'A2',
    titlePt: 'Pegando o Tunnelbana (Metrô)', titleTarget: 'I tunnelbanan',
    themePt: 'Transporte público em sueco.',
    videoTipPt: 'Busque: "Stockholm metro Swedish listening".',
    lines: [
      [2, "Ursäkta, vilket tåg går mot T-Centralen?", "Com licença, qual trem vai em direção a T-Centralen?"],
      [1, "Ta den röda linjen från spår två, den kommer om tre minuter.", "Pegue a linha vermelha da plataforma dois, chega em três minutos."],
    ],
    q: 'Vilken linje ska Mikkel ta?', opts: ['Den röda linjen', 'Den blå linjen', 'Buss 4'], ans: 0,
  },
  {
    lang: 'sv', d1: 'sv-SE', s1: 'Freja', d2: 'sv-FI', s2: 'Mikkel', lvl: 'B1',
    titlePt: 'Marcando Consulta no Vårdcentral', titleTarget: 'Hos läkaren',
    themePt: 'Saúde e atendimento na Suécia.',
    videoTipPt: 'Busque: "Swedish healthcare vocabulary B1".',
    lines: [
      [1, "Jag har haft ont i halsen i tre dagar och behöver boka en tid.", "Estou com dor de garganta há três dias e preciso marcar um horário."],
    ],
    q: 'Hur länge har Freja haft ont i halsen?', opts: ['I tre dagar', 'I två veckor', 'Sedan i morse'], ans: 0,
  },
  {
    lang: 'sv', d1: 'sv-SE', s1: 'Freja', d2: 'sv-FI', s2: 'Mikkel', lvl: 'B2',
    titlePt: 'Platt organisation och konsensus', titleTarget: 'Svensk arbetskultur',
    themePt: 'Imersão B2 em sueco.',
    videoTipPt: 'Ouça "Radio Sweden på lätt svenska".',
    lines: [
      [2, "På svenska arbetsplatser uppmuntras öppna diskussioner innan ett slutgiltigt beslut fattas.", "Em ambientes de trabalho suecos, incentivam-se discussões abertas antes da decisão final."],
    ],
    q: 'Vad uppmuntras innan ett beslut fattas?', opts: ['Öppna diskussioner', 'Hemliga möten', 'Snabba order utan dialog'], ans: 0,
  },
  {
    lang: 'sv', d1: 'sv-SE', s1: 'Freja', d2: 'sv-FI', s2: 'Mikkel', lvl: 'C1',
    titlePt: 'Grön omställning i Norden', titleTarget: 'Hållbar innovation',
    themePt: 'Análise C1 em sueco.',
    videoTipPt: 'Ouça episódios curtos da Sveriges Radio (Ekot / Vetenskapsradion).',
    lines: [
      [1, "Även om elektrifieringen går snabbt kräver framtidens elnät både smart styrning och långsiktiga investeringar.", "Embora a eletrificação avance rápido, a rede elétrica futura exige gestão inteligente e investimentos de longo prazo."],
    ],
    q: 'Vad kräver framtidens elnät enligt talaren?', opts: ['Smart styrning och långsiktiga investeringar', 'Mindre förnybar energi', 'Stoppad forskning'], ans: 0,
  },
];

export const PODCAST_EPISODES: PodcastEpisode[] = SEEDS.map((s) => ({
  id: `pod-${s.lang}-${s.lvl.toLowerCase()}`,
  languageCode: s.lang,
  level: s.lvl,
  titlePt: s.titlePt,
  titleTarget: s.titleTarget,
  durationLabel: '~2 min',
  themePt: s.themePt,
  videoTipPt: s.videoTipPt,
  lines: s.lines.map(([spk, text, translationPt]) => ({
    speaker: spk === 1 ? s.s1 : s.s2,
    voice: spk === 1 ? 'male' : 'female',
    dialectCode: spk === 1 ? s.d1 : s.d2,
    text,
    translationPt,
  })),
  question: s.q,
  options: s.opts,
  correctIndex: s.ans,
}));

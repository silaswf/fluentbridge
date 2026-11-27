/**
 * @file src/data/tutorScenariosV9/tutorV9_fr.ts
 * @description Expansão v9.0 de +10 cenários de conversação para o Tutor IA em Francês.
 * @exports FR_TUTOR_SCENARIOS_V9
 */
import type { AITutorScenario } from '../../types/learning';

export const FR_TUTOR_SCENARIOS_V9: AITutorScenario[] = [
  // ==================== A1 (2) ====================
  {
    id: 'tut-fr-v9-1',
    languageCode: 'fr',
    titlePt: 'Clima, Estações & Roupas Adequadas',
    titleEn: 'La Météo et les Saisons',
    level: 'A1',
    personaName: 'Chloé',
    personaRole: 'Colega de intercâmbio em Lyon',
    settingPt: 'Converse sobre a previsão do tempo para o fim de semana e decida que roupas levar para um passeio.',
    goalsPt: [
      'Descrever o tempo com "Il fait froid / Il pleut"',
      'Mencionar uma estação do ano ou temperatura',
      'Dizer que roupa vai usar ("Je mets un manteau")',
    ],
    openingEn: 'Salut ! Tu as vu la météo pour samedi ? Il va faire frais et il risque de pleuvoir à Lyon.',
    openingPt: 'Oi! Você viu a previsão do tempo para sábado? Vai fazer frio e pode chover em Lyon.',
    initialSuggestions: [
      'Oui, j’ai vu ! En automne, il fait souvent gris ici.',
      'Je vais mettre un imperméable et des bottes.',
      'S’il pleut trop, on peut aller au musée ?',
    ],
  },
  {
    id: 'tut-fr-v9-2',
    languageCode: 'fr',
    titlePt: 'Casa & Localização de Móveis',
    titleEn: 'Le Logement et les Meubles',
    level: 'A1',
    personaName: 'Lucas',
    personaRole: 'Colega de apartamento em Montréal',
    settingPt: 'Vocês estão organizando a sala; pergunte onde colocar a mesa, a luminária e as chaves.',
    goalsPt: [
      'Usar preposições espaciais ("sur", "sous", "à côté de")',
      'Nomear cômodos ou móveis básicos',
      'Fazer um pedido educado ("Tu peux mettre... ?")',
    ],
    openingEn: 'On range le salon avant l’arrivée des invités ? Où est-ce qu’on met la petite table ?',
    openingPt: 'Vamos arrumar a sala antes dos convidados chegarem? Onde colocamos a mesinha?',
    initialSuggestions: [
      'Tu peux mettre la table à côté du canapé, s’il te plaît ?',
      'La lampe est sur l’étagère, près de la fenêtre.',
      'Mes clés sont sous le journal dans l’entrée !',
    ],
  },

  // ==================== A2 (2) ====================
  {
    id: 'tut-fr-v9-3',
    languageCode: 'fr',
    titlePt: 'Banco: Cartão, Câmbio & Taxas',
    titleEn: 'À la Banque : Carte et Frais',
    level: 'A2',
    personaName: 'Monsieur Moreau',
    personaRole: 'Consultor bancário em Paris',
    settingPt: 'Abra uma conta de estudante ou resolva um bloqueio no cartão, perguntando sobre tarifas mensais e transferências.',
    goalsPt: [
      'Explicar a necessidade bancária com polidez ("Je souhaiterais...")',
      'Perguntar sobre taxas de manutenção e saque no exterior',
      'Confirmar o prazo de entrega do novo cartão',
    ],
    openingEn: 'Bonjour ! Asseyez-vous, je vous en prie. Que puis-je faire pour vous aujourd’hui ?',
    openingPt: 'Olá! Sente-se, por favor. O que posso fazer por você hoje?',
    initialSuggestions: [
      'Bonjour, je souhaiterais ouvrir un compte courant et commander une carte bancaire.',
      'Quels sont les frais mensuels et le tarif pour les virements internationaux ?',
      'Dans combien de jours vais-je recevoir ma carte ?',
    ],
  },
  {
    id: 'tut-fr-v9-4',
    languageCode: 'fr',
    titlePt: 'Receita Culinária Passo a Passo',
    titleEn: 'Cuisiner une Recette Ensemble',
    level: 'A2',
    personaName: 'Manon',
    personaRole: 'Amiga francesa ensinando a fazer quiche',
    settingPt: 'Siga as instruções de quantidade e ordem (d’abord, ensuite, enfin) para preparar uma quiche tradicional.',
    goalsPt: [
      'Perguntar quantidades exatas ("Combien de grammes de... ?")',
      'Usar conectores de sequência ("d’abord", "ensuite")',
      'Confirmar tempo e temperatura do forno',
    ],
    openingEn: 'Super, on prépare une quiche lorraine ! Tu as sorti les œufs, la crème fraîche et les lardons ?',
    openingPt: 'Ótimo, vamos preparar uma quiche lorraine! Você pegou os ovos, o creme de leite fresco e o bacon?',
    initialSuggestions: [
      'Oui ! Combien de grammes de farine faut-il pour la pâte ?',
      'D’abord, je mélange les œufs avec la crème, et ensuite j’ajoute le sel ?',
      'À quelle température doit-on préchauffer le four ?',
    ],
  },

  // ==================== B1 (2) ====================
  {
    id: 'tut-fr-v9-5',
    languageCode: 'fr',
    titlePt: 'Crítica de Cinema & Séries',
    titleEn: 'Critique de Cinéma et Musique',
    level: 'B1',
    personaName: 'Julien',
    personaRole: 'Amigo cinéfilo em Bruxelas',
    settingPt: 'Debata um filme recente: elogie a fotografia e a atuação, mas critique o ritmo do roteiro com argumentos.',
    goalsPt: [
      'Expressar opinião argumentada ("Ce qui m’a marqué, c’est...")',
      'Contrastar pontos fortes e fracos ("En revanche...")',
      'Recomendar ou não o filme justificando',
    ],
    openingEn: 'Alors, tu as enfin vu le dernier film primé à Cannes ? Tu en as pensé quoi ?',
    openingPt: 'E aí, você finalmente viu o último filme premiado em Cannes? O que achou dele?',
    initialSuggestions: [
      'Franchement, la photographie et la bande originale sont magnifiques.',
      'En revanche, j’ai trouvé le scénario un peu lent vers le milieu.',
      'Je le recommande quand même pour le jeu de l’actrice principale.',
    ],
  },
  {
    id: 'tut-fr-v9-6',
    languageCode: 'fr',
    titlePt: 'Saúde Preventiva & Bem-Estar',
    titleEn: 'Sommeil, Nutrition et Équilibre',
    level: 'B1',
    personaName: 'Dr. Claire',
    personaRole: 'Médica generalista em Genebra',
    settingPt: 'Relate cansaço por excesso de telas à noite e peça recomendações práticas de sono, alimentação e exercício.',
    goalsPt: [
      'Descrever hábitos recentes de sono e estresse',
      'Pedir conselhos práticos de rotina preventiva',
      'Comprometer-se com uma mudança realista',
    ],
    openingEn: 'Bonjour. Vous m’avez dit au téléphone que vous vous sentiez fatigué malgré vos nuits de sept heures. Racontez-moi votre routine.',
    openingPt: 'Olá. Você me disse ao telefone que se sentia cansado(a) apesar de dormir sete horas. Conte-me sua rotina.',
    initialSuggestions: [
      'Je travaille souvent sur écran jusqu’à minuit et j’ai du mal à m’endormir.',
      'Quelles habitudes alimentaires me conseillez-vous le soir ?',
      'Je vais essayer de couper les écrans une heure avant de dormir.',
    ],
  },

  // ==================== B2 (2) ====================
  {
    id: 'tut-fr-v9-7',
    languageCode: 'fr',
    titlePt: 'Transição Energética & Cidade',
    titleEn: 'Écologie Urbaine et Mobilité',
    level: 'B2',
    personaName: 'Hélène',
    personaRole: 'Vereadora de mobilidade urbana em Nantes',
    settingPt: 'Debata a criação de uma zona de baixas emissões no centro: equilibre metas climáticas com o impacto nos comerciantes.',
    goalsPt: [
      'Usar concessões formais ("Bien que...", "Malgré...")',
      'Propor medidas compensatórias (transporte público gratuito)',
      'Avaliar viabilidade de longo prazo',
    ],
    openingEn: 'Certains commerçants craignent que la zone à faibles émissions ne réduise leur clientèle. Comment répondre à cette inquiétude ?',
    openingPt: 'Alguns comerciantes temem que a zona de baixas emissões reduza a clientela. Como responder a essa preocupação?',
    initialSuggestions: [
      'Bien que la transition demande une adaptation initiale, les rues piétonnes augmentent souvent le passage.',
      'Il faudrait toutefois renforcer les navettes électriques et prévoir des créneaux de livraison dédiés.',
      'À long terme, la qualité de l’air profite à l’attractivité du quartier.',
    ],
  },
  {
    id: 'tut-fr-v9-8',
    languageCode: 'fr',
    titlePt: 'Vieses Cognitivos & Decisões',
    titleEn: 'Psychologie et Biais Cognitifs',
    level: 'B2',
    personaName: 'Prof. Laurent',
    personaRole: 'Psicólogo organizacional em Toulouse',
    settingPt: 'Analise por que uma equipe manteve um projeto deficitário (viés do custo afundado) e como evitar esse erro.',
    goalsPt: [
      'Nomear e explicar o viés cognitivo em questão',
      'Distinguir decisão emocional de evidência objetiva',
      'Sugerir um protocolo de revisão imparcial',
    ],
    openingEn: 'Pourquoi notre comité continue-t-il à financer ce produit alors que les indicateurs stagnent depuis dix-huit mois ?',
    openingPt: 'Por que nosso comitê continua financiando este produto se os indicadores estão estagnados há dezoito meses?',
    initialSuggestions: [
      'C’est un cas classique de biais des coûts irrécupérables : on confond l’effort passé avec la valeur future.',
      'De plus, le biais de confirmation nous pousse à ne retenir que les retours optimistes.',
      'Pour y remédier, fixons dès le départ des critères d’arrêt objectifs évalués par un tiers.',
    ],
  },

  // ==================== C1 (2) ====================
  {
    id: 'tut-fr-v9-9',
    languageCode: 'fr',
    titlePt: 'Oratória Executiva & Storytelling',
    titleEn: 'Prise de Parole et Rhétorique',
    level: 'C1',
    personaName: 'Sophie Delacroix',
    personaRole: 'Coach de comunicação executiva em Paris',
    settingPt: 'Refine a abertura e o fechamento de um discurso de 3 minutos usando pergunta retórica, ritmo ternário e metáfora.',
    goalsPt: [
      'Construir uma abertura impactante sem clichês',
      'Empregar uma pergunta retórica e um contraste rítmico',
      'Fechar com uma chamada memorável à ação',
    ],
    openingEn: 'Votre discours actuel commence par trop de chiffres bruts. Comment capter l’auditoire dès les quinze premières secondes ?',
    openingPt: 'Seu discurso atual começa com muitos números brutos. Como prender a plateia nos primeiros quinze segundos?',
    initialSuggestions: [
      'Et si la véritable fracture de notre décennie n’était pas technologique, mais attentionnelle ?',
      'Nous avons accéléré nos outils, simplifié nos échanges, mais parfois oublié le sens de nos choix.',
      'Retenez ceci : innover, ce n’est pas faire plus vite ; c’est décider ce qui mérite de durer.',
    ],
  },
  {
    id: 'tut-fr-v9-10',
    languageCode: 'fr',
    titlePt: 'Simulação C1: Filosofia & Dilema Moral',
    titleEn: 'Capstone C1 : Éthique et Choix Collectifs',
    level: 'C1',
    personaName: 'Prof. Moreau-Vidal',
    personaRole: 'Presidente de simpósio de filosofia aplicada na Sorbonne',
    settingPt: 'Debata o conflito entre eficiência utilitarista e direitos individuais em políticas de saúde pública com precisão conceitual.',
    goalsPt: [
      'Articular a tensão entre utilitarismo e deontologia',
      'Usar conectores argumentativos cultos ("Force est de constater", "Toutefois")',
      'Formular uma síntese filosófica coerente',
    ],
    openingEn: 'En situation de pénurie hospitalière, faut-il privilégier l’espérance de vie statistique ou l’égalité stricte d’accès ?',
    openingPt: 'Em situação de escassez hospitalar, deve-se privilegiar a expectativa de vida estatística ou a igualdade estrita de acesso?',
    initialSuggestions: [
      'Force est de constater qu’un utilitarisme pur risque de sacrifier la dignité des plus vulnérables.',
      'Toutefois, ignorer toute efficacité clinique revient à réduire le nombre global de vies sauvées.',
      'La voie la plus juste réside dans des critères transparents, délibérés collectivement et révisables.',
    ],
  },
];

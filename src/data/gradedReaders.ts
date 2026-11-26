import type { CEFRLevel, LanguageCode } from '../types/learning';

export interface ReaderSentence {
  target: string;
  pt: string;
}

export interface ReaderGlossaryWord {
  word: string;
  translation: string;
  ipa: string;
}

export interface GradedChapter {
  id: string;
  chapterNumber: number;
  level: CEFRLevel;
  titleTarget: string;
  titlePt: string;
  sentences: ReaderSentence[];
  glossary: ReaderGlossaryWord[];
}

export interface GradedReaderBook {
  id: string;
  languageCode: LanguageCode;
  seriesTitle: string;
  subtitlePt: string;
  chapters: GradedChapter[];
}

function buildBook(
  lang: LanguageCode,
  seriesTitle: string,
  subtitlePt: string,
  chapters: Array<{
    level: CEFRLevel;
    titleTarget: string;
    titlePt: string;
    sentences: Array<[string, string]>;
    glossary: Array<[string, string, string]>;
  }>,
): GradedReaderBook {
  return {
    id: `reader-${lang}`,
    languageCode: lang,
    seriesTitle,
    subtitlePt,
    chapters: chapters.map((ch, idx) => ({
      id: `reader-${lang}-ch${idx + 1}`,
      chapterNumber: idx + 1,
      level: ch.level,
      titleTarget: ch.titleTarget,
      titlePt: ch.titlePt,
      sentences: ch.sentences.map(([target, pt]) => ({ target, pt })),
      glossary: ch.glossary.map(([word, translation, ipa]) => ({
        word,
        translation,
        ipa,
      })),
    })),
  };
}

export const GRADED_READERS: GradedReaderBook[] = [
  buildBook('en', 'The Remote Architect', 'De Recife a Toronto: 5 capítulos progressivos (A1–C1)', [
    {
      level: 'A1',
      titleTarget: 'Arrival at Pearson Airport',
      titlePt: 'Chegada ao Aeroporto Pearson',
      sentences: [
        ['Lucas lands in Toronto on a crisp autumn morning.', 'Lucas aterrissa em Toronto em uma manhã fresca de outono.'],
        ['He grabs his blue suitcase and checks his boarding pass.', 'Ele pega sua mala azul e confere seu cartão de embarque.'],
        ['At the cafe, he orders a hot coffee and a warm croissant.', 'No café, ele pede um café quente e um croissant morninho.'],
      ],
      glossary: [
        ['crisp', 'fresco / nítido', '/krɪsp/'],
        ['suitcase', 'mala de viagem', '/ˈsuːtkeɪs/'],
        ['boarding pass', 'cartão de embarque', '/ˈbɔːrdɪŋ pæs/'],
      ],
    },
    {
      level: 'A2',
      titleTarget: 'The First Apartment Tour',
      titlePt: 'Visita ao Primeiro Apartamento',
      sentences: [
        ['The landlord shows Lucas a bright studio near the subway.', 'O proprietário mostra a Lucas um estúdio claro perto do metrô.'],
        ['Utilities are included in the monthly rent, which saves money.', 'Contas básicas estão incluídas no aluguel mensal, o que economiza dinheiro.'],
        ['Lucas signs the lease and picks up the keys right away.', 'Lucas assina o contrato e pega as chaves na hora.'],
      ],
      glossary: [
        ['landlord', 'proprietário / senhorio', '/ˈlændlɔːrd/'],
        ['utilities', 'contas de água/luz/gás', '/juːˈtɪlɪtiz/'],
        ['lease', 'contrato de aluguel', '/liːs/'],
      ],
    },
    {
      level: 'B1',
      titleTarget: 'Stand-up Meeting & Bottlenecks',
      titlePt: 'Reunião Diária e Gargalos',
      sentences: [
        ['During the morning stand-up, the team spotted a database bottleneck.', 'Durante a reunião matinal, a equipe identificou um gargalo no banco de dados.'],
        ['Instead of cutting corners, Lucas proposed an automated cache layer.', 'Em vez de pegar atalhos, Lucas propôs uma camada de cache automática.'],
        ['His manager praised the clear takeaway and calm ownership.', 'Seu gestor elogiou a conclusão clara e o protagonismo tranquilo.'],
      ],
      glossary: [
        ['bottleneck', 'gargalo', '/ˈbɒtəlnek/'],
        ['cutting corners', 'economizar na qualidade', '/ˈkʌtɪŋ ˈkɔːrnərz/'],
        ['ownership', 'protagonismo / responsabilidade', '/ˈoʊnərʃɪp/'],
      ],
    },
    {
      level: 'B2',
      titleTarget: 'Cross-Cultural Nuance',
      titlePt: 'Nuances Culturais',
      sentences: [
        ['A British teammate called his draft "not half bad", which meant excellent.', 'Um colega britânico chamou seu rascunho de "nada mal", o que significava excelente.'],
        ['Lucas realized that reading between the lines mattered as much as code.', 'Lucas percebeu que ler nas entrelinhas importava tanto quanto o código.'],
      ],
      glossary: [
        ['draft', 'rascunho', '/dræft/'],
        ['reading between the lines', 'ler nas entrelinhas', '/ˈriːdɪŋ bɪˈtwiːn ðə laɪnz/'],
      ],
    },
    {
      level: 'C1',
      titleTarget: 'Keynote at the Global Summit',
      titlePt: 'Palestra Principal na Cúpula Global',
      sentences: [
        ['Not only did the new architecture scale globally, but it also cut latency by half.', 'Não apenas a nova arquitetura escalou globalmente, como também reduziu a latência pela metade.'],
        ['By no means had the journey been effortless, yet every challenge forged resilience.', 'De modo algum a jornada fora sem esforço, mas cada desafio forjou resiliência.'],
      ],
      glossary: [
        ['latency', 'latência', '/ˈleɪtənsi/'],
        ['by no means', 'de modo algum', '/baɪ noʊ miːnz/'],
        ['resilience', 'resiliência', '/rɪˈzɪljəns/'],
      ],
    },
  ]),
  buildBook('es', 'Crónicas de Madrid', 'Cinco capítulos de A1 a C1 pelo coração da Espanha', [
    {
      level: 'A1',
      titleTarget: 'Un café en Sol',
      titlePt: 'Um café na Puerta del Sol',
      sentences: [
        ['Sofía entra en una cafetería luminosa cerca de la plaza.', 'Sofía entra em uma cafeteria iluminada perto da praça.'],
        ['Pide un café con leche y pregunta cuánto cuesta la tostada.', 'Pede um café com leite e pergunta quanto custa a torrada.'],
      ],
      glossary: [
        ['luminosa', 'iluminada', '/lumiˈnosa/'],
        ['tostada', 'torrada / pão tostado', '/tosˈtaða/'],
      ],
    },
    {
      level: 'A2',
      titleTarget: 'El tren hacia Toledo',
      titlePt: 'O trem rumo a Toledo',
      sentences: [
        ['Ayer por la mañana fuimos a la estación de Atocha muy temprano.', 'Ontem de manhã fomos à estação de Atocha bem cedo.'],
        ['El billete de ida y vuelta resultó más barato de lo esperado.', 'A passagem de ida e volta saiu mais barata do que o esperado.'],
      ],
      glossary: [
        ['ida y vuelta', 'ida e volta', '/ˈiða i ˈbwelta/'],
        ['barato', 'barato', '/baˈɾato/'],
      ],
    },
    {
      level: 'B1',
      titleTarget: 'Sin portunhol en la oficina',
      titlePt: 'Sem portunhol no escritório',
      sentences: [
        ['Al principio, Sofía evitaba los falsos amigos como "todavía" y "embarazada".', 'No início, Sofía evitava os falsos amigos como "todavía" e "embarazada".'],
        ['Actualmente dirige reuniones con clientes de Madrid y Ciudad de México.', 'Atualmente ela conduz reuniões com clientes de Madri e Cidade do México.'],
      ],
      glossary: [
        ['todavía', 'ainda', '/toðaˈβia/'],
        ['actualmente', 'atualmente', '/ak.twalˈmente/'],
      ],
    },
    {
      level: 'B2',
      titleTarget: 'Debate sobre vivienda',
      titlePt: 'Debate sobre moradia',
      sentences: [
        ['Aunque el alquiler haya subido, la calidad de vida en el barrio sigue alta.', 'Embora o aluguel tenha subido, a qualidade de vida no bairro segue alta.'],
        ['Los vecinos propusieron medidas para proteger el comercio local.', 'Os moradores propuseram medidas para proteger o comércio local.'],
      ],
      glossary: [
        ['alquiler', 'aluguel', '/alkiˈleɾ/'],
        ['barrio', 'bairro', '/ˈbarjo/'],
      ],
    },
    {
      level: 'C1',
      titleTarget: 'La conferencia iberoamericana',
      titlePt: 'A conferência ibero-americana',
      sentences: [
        ['Si hubiéramos previsto aquel cambio normativo, habríamos adaptado el contrato antes.', 'Se tivéssemos previsto aquela mudança normativa, teríamos adaptado o contrato antes.'],
        ['Con rigor y empatía, el equipo alcanzó un acuerdo duradero.', 'Com rigor e empatia, a equipe alcançou um acordo duradouro.'],
      ],
      glossary: [
        ['normativo', 'regulatório / normativo', '/noɾmaˈtiβo/'],
        ['duradero', 'duradouro', '/duɾaˈðeɾo/'],
      ],
    },
  ]),
  buildBook('fr', 'Un Matin à Lyon', 'Cinco capítulos de A1 a C1 entre Paris e Lyon', [
    { level: 'A1', titleTarget: 'À la boulangerie', titlePt: 'Na padaria', sentences: [['Bonjour, je voudrais une baguette et un croissant, s’il vous plaît.', 'Bom dia, eu gostaria de uma baguete e um croissant, por favor.'], ['Merci beaucoup et bonne journée !', 'Muito obrigado e bom dia!']], glossary: [['boulangerie', 'padaria', '/bu.lɑ̃ʒ.ʁi/'], ['baguette', 'baguete', '/ba.ɡɛt/']] },
    { level: 'A2', titleTarget: 'Le TGV pour Lyon', titlePt: 'O TGV para Lyon', sentences: [['Hier matin, nous sommes partis de la gare de Lyon à huit heures.', 'Ontem de manhã partimos da estação de Lyon às oito horas.'], ['Le voyage en train était rapide et très confortable.', 'A viagem de trem foi rápida e muito confortável.']], glossary: [['gare', 'estação de trem', '/ɡaʁ/'], ['confortable', 'confortável', '/kɔ̃.fɔʁ.tabl/']] },
    { level: 'B1', titleTarget: 'La réunion d’équipe', titlePt: 'A reunião da equipe', sentences: [['Il faut que nous finissions la présentation avant midi.', 'É preciso que terminemos a apresentação antes do meio-dia.'], ['Chloé a proposé une idée dont tout le monde a parlé.', 'Chloé propôs uma ideia sobre a qual todo mundo falou.']], glossary: [['présentation', 'apresentação', '/pʁe.zɑ̃.ta.sjɔ̃/'], ['dont', 'do qual / sobre o qual', '/dɔ̃/']] },
    { level: 'B2', titleTarget: 'Un malentendu évité', titlePt: 'Um mal-entendido evitado', sentences: [['Bien qu’il fût tard, le directeur a écouté chaque argument avec attention.', 'Embora fosse tarde, o diretor ouviu cada argumento com atenção.'], ['Cette nuance a permis de débloquer la négociation.', 'Essa nuance permitiu destravar a negociação.']], glossary: [['malentendu', 'mal-entendido', '/ma.lɑ̃.tɑ̃.dy/'], ['nuance', 'nuance / sutileza', '/ny.ɑ̃s/']] },
    { level: 'C1', titleTarget: 'L’architecture durable', titlePt: 'Arquitetura sustentável', sentences: [['L’urbanisme contemporain privilégie désormais la sobriété énergétique.', 'O urbanismo contemporâneo prioriza doravante a sobriedade energética.'], ['C’est en collaborant que les villes relèveront les défis climatiques.', 'É colaborando que as cidades enfrentarão os desafios climáticos.']], glossary: [['désormais', 'doravante / a partir de agora', '/de.zɔʁ.mɛ/'], ['sobriété', 'sobriedade / moderação', '/sɔ.bʁi.je.te/']] },
  ]),
  buildBook('it', 'Passi a Roma', 'Cinco capítulos de A1 a C1 pelas ruas italianas', [
    { level: 'A1', titleTarget: 'Un espresso al banco', titlePt: 'Um espresso no balcão', sentences: [['Buongiorno, prendo un caffè macchiato al banco, per favore.', 'Bom dia, vou querer um café macchiato no balcão, por favor.'], ['Questo quartiere è davvero vivace di mattina.', 'Este bairro é realmente animado de manhã.']], glossary: [['banco', 'balcão', '/ˈbaŋko/'], ['quartiere', 'bairro', '/kwarˈtjɛre/']] },
    { level: 'A2', titleTarget: 'Alla stazione Termini', titlePt: 'Na estação Termini', sentences: [['Stamattina Giulia si è svegliata presto per prendere il treno.', 'Hoje de manhã Giulia acordou cedo para pegar o trem.'], ['Il binario sette si trova vicino all’uscita principale.', 'A plataforma sete fica perto da saída principal.']], glossary: [['binario', 'plataforma / trilho', '/biˈnarjo/'], ['uscita', 'saída', '/uʃˈʃita/']] },
    { level: 'B1', titleTarget: 'Una cena tra amici', titlePt: 'Um jantar entre amigos', sentences: [['Ci siamo trovati in una trattoria storica vicino al fiume.', 'Nos encontramos em uma trattoria histórica perto do rio.'], ['Ne abbiamo parlato a lungo sorseggiando acqua frizzante.', 'Conversamos sobre isso longamente tomando água com gás.']], glossary: [['trattoria', 'restaurante tradicional', '/trattoˈria/'], ['frizzante', 'com gás / frisante', '/fritˈtsante/']] },
    { level: 'B2', titleTarget: 'Progetto a Milano', titlePt: 'Projeto em Milão', sentences: [['Penso che Marco abbia trovato una soluzione molto elegante.', 'Acho que Marco encontrou uma solução muito elegante.'], ['Se avessimo più risorse, lanceremmo il prototipo domani.', 'Se tivéssemos mais recursos, lançaríamos o protótipo amanhã.']], glossary: [['soluzione', 'solução', '/solutˈtsjone/'], ['risorse', 'recursos', '/riˈzorse/']] },
    { level: 'C1', titleTarget: 'Il design sostenibile', titlePt: 'Design sustentável', sentences: [['Benché il mercato fosse incerto, l’azienda investì nella ricerca.', 'Embora o mercado estivesse incerto, a empresa investiu em pesquisa.'], ['La qualità artigianale resta il fulcro della tradizione italiana.', 'A qualidade artesanal continua sendo o centro da tradição italiana.']], glossary: [['ricerca', 'pesquisa', '/riˈtʃerka/'], ['fulcro', 'eixo central / fulcro', '/ˈfulkro/']] },
  ]),
  buildBook('de', 'Alltag in Berlin', 'Cinco capítulos de A1 a C1 em Berlim e Viena', [
    { level: 'A1', titleTarget: 'Kaffee am Alexanderplatz', titlePt: 'Café na Alexanderplatz', sentences: [['Heute lerne ich Deutsch in einem kleinen Café in Berlin.', 'Hoje estudo alemão em um pequeno café em Berlim.'], ['Ich bestelle einen Tee und ein frisches Brötchen.', 'Eu peço um chá e um pãozinho fresco.']], glossary: [['Brötchen', 'pãozinho', '/ˈbʁøːtçən/'], ['bestellen', 'pedir', '/bəˈʃtɛlən/']] },
    { level: 'A2', titleTarget: 'Mit der S-Bahn', titlePt: 'De trem urbano (S-Bahn)', sentences: [['Gestern sind wir mit dem Zug nach Potsdam gefahren.', 'Ontem fomos de trem para Potsdam.'], ['Die Fahrkarte gilt den ganzen Tag in der Zone AB.', 'O bilhete vale o dia todo na zona AB.']], glossary: [['Fahrkarte', 'passagem / bilhete', '/ˈfaːɐ̯ˌkaʁtə/'], ['Zug', 'trem', '/t͡suːk/']] },
    { level: 'B1', titleTarget: 'Im Homeoffice', titlePt: 'No trabalho remoto', sentences: [['Ich bleibe heute zu Hause, weil ich den Bericht schreiben muss.', 'Fico em casa hoje porque preciso escrever o relatório.'], ['Das Wörterbuch liegt direkt auf dem Tisch neben dem Laptop.', 'O dicionário está bem em cima da mesa ao lado do notebook.']], glossary: [['Bericht', 'relatório', '/bəˈʁɪçt/'], ['Wörterbuch', 'dicionário', '/ˈvœʁtɐˌbuːx/']] },
    { level: 'B2', titleTarget: 'Das Vorstellungsgespräch', titlePt: 'A entrevista de emprego', sentences: [['Ich hätte gern mehr über die langfristigen Ziele des Teams erfahren.', 'Eu gostaria de saber mais sobre as metas de longo prazo da equipe.'], ['Die neue Plattform wird nächste Woche offiziell freigeschaltet.', 'A nova plataforma será liberada oficialmente na próxima semana.']], glossary: [['langfristig', 'de longo prazo', '/ˈlaŋˌfʁɪstɪç/'], ['freischalten', 'ativar / liberar', '/ˈfʁaɪ̯ˌʃaltən/']] },
    { level: 'C1', titleTarget: 'Digitale Souveränität', titlePt: 'Soberania digital', sentences: [['Aufgrund der strengen Datenschutzgesetze wurde die Architektur überarbeitet.', 'Devido às rígidas leis de proteção de dados, a arquitetura foi revisada.'], ['Die steigenden Anforderungen fördern nachhaltige Innovation.', 'As exigências crescentes impulsionam a inovação sustentável.']], glossary: [['Datenschutz', 'proteção de dados', '/ˈdaːtn̩ˌʃʊt͡s/'], ['nachhaltig', 'sustentável', '/ˈnaːxˌhaltɪç/']] },
  ]),
  buildBook('ru', 'Прогулка по Москве', 'Cinco capítulos de A1 a C1 entre Moscou e São Petersburgo', [
    { level: 'A1', titleTarget: 'Утро в метро', titlePt: 'Manhã no metrô', sentences: [['Моя сестра живёт и работает в Москве.', 'Minha irmã mora e trabalha em Moscou.'], ['Я читаю интересную книгу по дороге на работу.', 'Eu leio um livro interessante a caminho do trabalho.']], glossary: [['метро', 'metrô', '/mʲɪˈtro/'], ['книга', 'livro', '/ˈknʲiɡə/']] },
    { level: 'A2', titleTarget: 'Встреча с другом', titlePt: 'Encontro com um amigo', sentences: [['Вчера Анна рано пришла домой и приготовила ужин.', 'Ontem Anna chegou cedo em casa e preparou o jantar.'], ['К сожалению, у меня сейчас почти нет свободного времени.', 'Infelizmente, agora quase não tenho tempo livre.']], glossary: [['ужин', 'jantar', '/ˈuʐɨn/'], ['время', 'tempo', '/ˈvrʲemʲə/']] },
    { level: 'B1', titleTarget: 'Деловое письмо', titlePt: 'E-mail profissional', sentences: [['Я наконец написал подробное письмо нашему партнёру.', 'Eu finalmente escrevi um e-mail detalhado ao nosso parceiro.'], ['Вечером я позвоню другу, чтобы обсудить детали.', 'À noite vou ligar para um amigo para discutir os detalhes.']], glossary: [['письмо', 'carta / e-mail', '/pʲɪsʲˈmo/'], ['детали', 'detalhes', '/dʲɪˈtalʲɪ/']] },
    { level: 'B2', titleTarget: 'Карьера и поездки', titlePt: 'Carreira e viagens', sentences: [['Мой брат работает инженером и часто ездит в Петербург.', 'Meu irmão trabalha como engenheiro e vai frequentemente a Petersburgo.'], ['Если бы не дождь, мы бы гуляли по набережной.', 'Se não fosse a chuva, passearíamos pela orla.']], glossary: [['инженер', 'engenheiro', '/ɪnʐɨˈnʲer/'], ['набережная', 'orla / cais', '/ˈnabʲɪrʲɪʐnəjə/']] },
    { level: 'C1', titleTarget: 'Итоги проекта', titlePt: 'Resultados do projeto', sentences: [['Закончив сложный отчёт, команда представила итоги совету.', 'Tendo concluído o relatório complexo, a equipe apresentou os resultados ao conselho.'], ['Мы полностью согласны с вашими аналитическими выводами.', 'Concordamos totalmente com suas conclusões analíticas.']], glossary: [['отчёт', 'relatório', '/ɐtˈtɕɵt/'], ['выводы', 'conclusões', '/ˈvɨvədɨ/']] },
  ]),
  buildBook('ja', '東京の一週間', 'Cinco capítulos progressivos (N5–N1) em Tóquio e Osaka', [
    { level: 'A1', titleTarget: '朝のカフェ', titlePt: 'Café da manhã', sentences: [['毎朝、駅の前でコーヒーを飲みます。', 'Todas as manhãs tomo café em frente à estação.'], ['図書館で日本語を勉強しています。', 'Estou estudando japonês na biblioteca.']], glossary: [['駅', 'estação', '/eki/'], ['図書館', 'biblioteca', '/toɕokaɴ/']] },
    { level: 'A2', titleTarget: '京都への旅', titlePt: 'Viagem para Kyoto', sentences: [['すみません、ここに名前を書いてください。', 'Com licença, por favor escreva seu nome aqui.'], ['昨日のテストはあまり難しくなかったです。', 'A prova de ontem não foi muito difícil.']], glossary: [['名前', 'nome', '/namae/'], ['難しい', 'difícil', '/muzukasii/']] },
    { level: 'B1', titleTarget: '新しい経験', titlePt: 'Nova experiência', sentences: [['去年、北海道へ行ったことがあります。', 'Ano passado já fui a Hokkaido.'], ['会議室のドアが開いていますから、どうぞ入ってください。', 'A porta da sala de reunião está aberta, pode entrar.']], glossary: [['会議室', 'sala de reunião', '/kaigisitsu/'], ['経験', 'experiência', '/keikeɴ/']] },
    { level: 'B2', titleTarget: '会社での会話', titlePt: 'Conversa na empresa', sentences: [['社長はもうお帰りになりましたか。', 'O presidente já foi para casa?'], ['駅に着いたら、すぐメッセージを送ってください。', 'Quando chegar na estação, mande uma mensagem logo.']], glossary: [['社長', 'presidente da empresa', '/ɕatɕoː/'], ['到着', 'chegada', '/toːtɕaku/']] },
    { level: 'C1', titleTarget: '未来への提案', titlePt: 'Proposta para o futuro', sentences: [['悪天候にもかかわらず、国際会議は無事に開催された。', 'Apesar do mau tempo, a conferência internacional ocorreu sem imprevistos.'], ['予算の制約により、計画を見直さざるを得ない。', 'Devido a restrições orçamentárias, não temos escolha senão revisar o plano.']], glossary: [['悪天候', 'mau tempo', '/akuteɴkoː/'], ['見直す', 'revisar / reavaliar', '/minaosu/']] },
  ]),
  buildBook('zh', '北京的一天', 'Cinco capítulos progressivos (HSK 1–6) em Pequim e Taipei', [
    { level: 'A1', titleTarget: '书店与咖啡', titlePt: 'Livraria e café', sentences: [['今天我在书店买了两本中文书。', 'Hoje comprei dois livros de chinês na livraria.'], ['我今天没有时间去银行，明天再去。', 'Hoje não tenho tempo de ir ao banco, vou amanhã.']], glossary: [['书店', 'livraria', '/ʂūdiàn/'], ['银行', 'banco', '/yínháng/']] },
    { level: 'A2', titleTarget: '坐地铁去机场', titlePt: 'De metrô ao aeroporto', sentences: [['昨天晚上我看了一部很有意思的电影。', 'Ontem à noite assisti a um filme muito interessante.'], ['坐地铁比坐公共汽车快得多。', 'Ir de metrô é muito mais rápido do que ir de ônibus.']], glossary: [['地铁', 'metrô', '/dìtiě/'], ['电影', 'filme', '/diànyǐng/']] },
    { level: 'B1', titleTarget: '整理行李', titlePt: 'Organizando a bagagem', sentences: [['请把你的护照和登机牌放在桌子上。', 'Por favor coloque seu passaporte e cartão de embarque na mesa.'], ['黑板上的字写得很小，我看不清楚。', 'As letras no quadro estão bem pequenas, não consigo ver com clareza.']], glossary: [['护照', 'passaporte', '/hùzhào/'], ['清楚', 'claro / nítido', '/qīngchu/']] },
    { level: 'B2', titleTarget: '高效的软件', titlePt: 'Software eficiente', sentences: [['这个学习应用不但免费，而且界面非常清晰。', 'Este app de estudos não só é gratuito, como também tem interface bem clara.'], ['我终于想起来那位老师的名字了！', 'Finalmente lembrei o nome daquele professor!']], glossary: [['界面', 'interface', '/jièmiàn/'], ['清晰', 'nítido / claro', '/qīngxī/']] },
    { level: 'C1', titleTarget: '年度战略会议', titlePt: 'Reunião estratégica anual', sentences: [['本次会议将以讨论明年可持续发展预算为主。', 'Esta reunião terá como foco principal o orçamento sustentável do próximo ano.'], ['方案看似完美，然而实际执行需要跨部门协作。', 'O plano parece perfeito; contudo, a execução exige colaboração entre áreas.']], glossary: [['预算', 'orçamento', '/yùsuàn/'], ['协作', 'colaboração', '/xiézuò/']] },
  ]),
  buildBook('ar', 'رحلة إلى القاهرة', 'Cinco capítulos de A1 a C1 em Árabe Padrão (RTL)', [
    { level: 'A1', titleTarget: 'في المطار', titlePt: 'No aeroporto', sentences: [['أنا سعيد جداً بالسفر إلى القاهرة اليوم.', 'Estou muito feliz em viajar para o Cairo hoje.'], ['هذا مكتب الاستعلامات بجانب البوابة الرئيسية.', 'Este é o balcão de informações ao lado do portão principal.']], glossary: [['سعيد', 'feliz', '/saʕiːd/'], ['مكتب', 'escritório / balcão', '/maktab/']] },
    { level: 'A2', titleTarget: 'زيارة المتحف', titlePt: 'Visita ao museu', sentences: [['أمس ذهبنا إلى المتحف الوطني في الصباح الباكر.', 'Ontem fomos ao Museu Nacional bem cedo pela manhã.'], ['غداً لن أستطيع الحضور لأن لدي اجتماعاً مهماً.', 'Amanhã não poderei comparecer porque tenho uma reunião importante.']], glossary: [['المتحف', 'o museu', '/almatħaf/'], ['اجتماع', 'reunião', '/idʒtimaːʕ/']] },
    { level: 'B1', titleTarget: 'الرسالة المهمة', titlePt: 'A mensagem importante', sentences: [['إنّ الكتابَ الذي قرأته مفيد جداً للطلاب.', 'Certamente o livro que li é muito útil para os estudantes.'], ['الرسالة التي وصلت اليوم تشرح خطة العمل الجديدة.', 'A mensagem que chegou hoje explica o novo plano de trabalho.']], glossary: [['الرسالة', 'a mensagem', '/arrisaːla/'], ['خطة', 'plano', '/xuṭṭa/']] },
    { level: 'B2', titleTarget: 'إعداد التقرير', titlePt: 'Preparando o relatório', sentences: [['كُتِبَ التقريرُ النهائي في الصباح بعد مراجعة البيانات.', 'O relatório final foi escrito pela manhã após revisar os dados.'], ['قرأتُ عشرين صفحةً من المرجع الاقتصادي هذا الأسبوع.', 'Li vinte páginas da referência econômica esta semana.']], glossary: [['التقرير', 'o relatório', '/attaqriːr/'], ['البيانات', 'os dados', '/albajaːnaːt/']] },
    { level: 'C1', titleTarget: 'جودة التعليم', titlePt: 'Qualidade da educação', sentences: [['يهدف هذا المشروع إلى تحسينِ جودة التعليم الرقمي.', 'Este projeto visa melhorar a qualidade da educação digital.'], ['عاد الباحثُ إلى وطنه سالماً حاملاً نتائج مشجعة.', 'O pesquisador voltou à sua pátria em segurança trazendo resultados animadores.']], glossary: [['تحسين', 'melhoria', '/taħsiːn/'], ['نتائج', 'resultados', '/nataːʔidʒ/']] },
  ]),
  buildBook('nl', 'Fietsen in Utrecht', 'Cinco capítulos de A1 a C1 nos Países Baixos', [
    { level: 'A1', titleTarget: 'Het nieuwe huis', titlePt: 'A casa nova', sentences: [['Het huis staat op vijf minuten lopen van het station.', 'A casa fica a cinco minutos a pé da estação.'], ['Morgen ga ik met de trein naar Utrecht.', 'Amanhã vou de trem para Utrecht.']], glossary: [['huis', 'casa', '/ɦœys/'], ['trein', 'trem', '/trɛin/']] },
    { level: 'A2', titleTarget: 'Een telefoontje', titlePt: 'Um telefonema', sentences: [['Gisteren zijn wij langs het kanaal naar Amsterdam gefietst.', 'Ontem pedalamos ao longo do canal até Amsterdã.'], ['Ik bel mijn collega vanmiddag even op voor overleg.', 'Vou ligar rapidinho para meu colega hoje à tarde para alinharmos.']], glossary: [['fietsen', 'andar de bicicleta', '/ˈfitsə(n)/'], ['overleg', 'alinhamento / consulta', '/ˌoːvərˈlɛx/']] },
    { level: 'B1', titleTarget: 'Regen onderweg', titlePt: 'Chuva no caminho', sentences: [['Er is genoeg verse koffie in de keuken voor iedereen.', 'Há café fresco suficiente na cozinha para todos.'], ['Ik neem een paraplu mee, omdat het vandaag waarschijnlijk regent.', 'Levo um guarda-chuva porque provavelmente chove hoje.']], glossary: [['paraplu', 'guarda-chuva', '/ˌpaːraːˈply/'], ['waarschijnlijk', 'provavelmente', '/ʋaːrˈsxɛinlək/']] },
    { level: 'B2', titleTarget: 'Het contract', titlePt: 'O contrato', sentences: [['De nieuwe contracten worden vandaag door beide partijen ondertekend.', 'Os novos contratos estão sendo assinados hoje por ambas as partes.'], ['Dit is het rapport dat ik gisteren voor de vergadering schreef.', 'Este é o relatório que escrevi ontem para a reunião.']], glossary: [['ondertekenen', 'assinar', '/ˌɔndərˈteːkənə(n)/'], ['vergadering', 'reunião', '/vərˈɣaːdərɪŋ/']] },
    { level: 'C1', titleTarget: 'Resultaat ondanks druk', titlePt: 'Resultado apesar da pressão', sentences: [['Het budget was krap; desondanks boekte het team sterk resultaat.', 'O orçamento estava apertado; apesar disso, a equipe obteve forte resultado.'], ['Hij vertrok zonder ook maar iets te zeggen.', 'Ele partiu sem dizer absolutamente nada.']], glossary: [['desondanks', 'apesar disso', '/dɛsˈɔndɑŋks/'], ['krap', 'apertado / limitado', '/krɑp/']] },
  ]),
  buildBook('af', 'Kaapstad tot Windhoek', 'Cinco capítulos de A1 a C1 na África do Sul e Namíbia', [
    { level: 'A1', titleTarget: 'Koffie in die kombuis', titlePt: 'Café na cozinha', sentences: [['Sy drink nou vars koffie in die kombuis.', 'Ela está bebendo café fresco na cozinha agora.'], ['Ek praat nie Duits nie, maar ek leer Afrikaans.', 'Eu não falo alemão, mas estou aprendendo africâner.']], glossary: [['kombuis', 'cozinha', '/kɔmˈbœis/'], ['vars', 'fresco', '/fars/']] },
    { level: 'A2', titleTarget: 'Na die see', titlePt: 'Para o mar', sentences: [['Ons het gister vroeg na die see gery.', 'Ontem dirigimos cedo para o mar.'], ['Môre sal ek saam met my vriende gaan stap.', 'Amanhã vou caminhar com meus amigos.']], glossary: [['see', 'mar', '/siə/'], ['vriende', 'amigos', '/ˈfrində/']] },
    { level: 'B1', titleTarget: 'Oggendroetine', titlePt: 'Rotina da manhã', sentences: [['Hy staan elke oggend om ses uur op om te oefen.', 'Ele levanta todo dia às seis horas para se exercitar.'], ['Ons bly tuis omdat dit buite hard reën.', 'Ficamos em casa porque está chovendo forte lá fora.']], glossary: [['oggend', 'manhã', '/ˈɔxənt/'], ['tuis', 'em casa', '/tœis/']] },
    { level: 'B2', titleTarget: 'Die weeklikse verslag', titlePt: 'O relatório semanal', sentences: [['Die verslag word elke week deur die span bygewerk.', 'O relatório é atualizado toda semana pela equipe.'], ['As ek meer tyd gehad het, sou ek langer in die Kaap gebly het.', 'Se eu tivesse tido mais tempo, teria ficado mais na Cidade do Cabo.']], glossary: [['verslag', 'relatório', '/fərˈslax/'], ['bywerk', 'atualizar', '/ˈbəivɛrk/']] },
    { level: 'C1', titleTarget: 'Volhoubare groei', titlePt: 'Crescimento sustentável', sentences: [['Daar word verwag dat die streeksekonomie bestendig sal groei.', 'Espera-se que a economia regional cresça de forma constante.'], ['Die weer was sleg; desnieteenstaande het die span voortgegaan.', 'O tempo estava ruim; não obstante, a equipe prosseguiu.']], glossary: [['bestendig', 'constante / estável', '/bəˈstɛndəx/'], ['voortgaan', 'prosseguir', '/ˈfoːrtxɑːn/']] },
  ]),
  buildBook('sv', 'Fika i Stockholm', 'Cinco capítulos de A1 a C1 na Suécia', [
    { level: 'A1', titleTarget: 'En ljus morgon', titlePt: 'Uma manhã luminosa', sentences: [['I dag studerar jag svenska med en vän på ett kafé.', 'Hoje estudo sueco com um amigo em um café.'], ['Det är ett stort och ljust rum nära vattnet.', 'É uma sala grande e iluminada perto da água.']], glossary: [['kafé', 'café', '/kaˈfeː/'], ['ljust', 'iluminado / claro', '/jʉːst/']] },
    { level: 'A2', titleTarget: 'Bokhandeln i Gamla Stan', titlePt: 'A livraria em Gamla Stan', sentences: [['Jag köpte boken i bokhandeln igår eftermiddag.', 'Comprei o livro na livraria ontem à tarde.'], ['Hon sa att hon inte kan komma till mötet idag.', 'Ela disse que não pode vir à reunião hoje.']], glossary: [['bokhandel', 'livraria', '/ˈbuːkˌhandɛl/'], ['möte', 'reunião', '/ˈmøːtɛ/']] },
    { level: 'B1', titleTarget: 'Mejlet till kunden', titlePt: 'O e-mail ao cliente', sentences: [['Vi har redan skickat det uppdaterade mejlet till kunden.', 'Já enviamos o e-mail atualizado ao cliente.'], ['Erik tog sin egen jacka och promenerade hem.', 'Erik pegou sua própria jaqueta e caminhou para casa.']], glossary: [['kund', 'cliente', '/kɵnd/'], ['jacka', 'jaqueta', '/ˈjaka/']] },
    { level: 'B2', titleTarget: 'Nya dörrar öppnas', titlePt: 'Novas portas se abrem', sentences: [['Dörrarna öppnas klockan nio varje vardagsmorgon.', 'As portas abrem às nove horas toda manhã de dia útil.'], ['Jag tycker verkligen om att bo och arbeta i Stockholm.', 'Eu realmente gosto de morar e trabalhar em Estocolmo.']], glossary: [['vardag', 'dia útil / dia de semana', '/ˈvɑːɖɑːɡ/'], ['tycka om', 'gostar de', '/ˈtʏka ˈɔm/']] },
    { level: 'C1', titleTarget: 'Styrelsens besked', titlePt: 'O comunicado da diretoria', sentences: [['Vi fick ett glädjande besked från styrelsen i morse.', 'Recebemos uma notícia animadora da diretoria hoje de manhã.'], ['Avtalet undertecknades av båda parter i fredags.', 'O acordo foi assinado por ambas as partes na sexta-feira passada.']], glossary: [['besked', 'notícia / comunicado', '/bɛˈɧeːd/'], ['avtal', 'acordo / contrato', '/ˈɑːvˌtɑːl/']] },
  ]),
  buildBook('tr', 'Boğaz’da Bir Gün', 'Cinco capítulos de A1 a C1 em Istambul e Ancara', [
    { level: 'A1', titleTarget: 'Kadıköy’de çay', titlePt: 'Chá em Kadıköy', sentences: [['Bugün İstanbul’da küçük bir çay bahçesinde oturuyorum.', 'Hoje estou sentado em um pequeno jardim de chá em Istambul.'], ['Bir bardak sıcak çay ve taze simit istiyorum.', 'Quero um copo de chá quente e simit fresco.']], glossary: [['çay', 'chá', '/tʃaj/'], ['simit', 'rosca turca com gergelim', '/siˈmit/']] },
    { level: 'A2', titleTarget: 'Marmaray yolculuğu', titlePt: 'Viagem no Marmaray', sentences: [['Dün sabah vapurla ve trenle Avrupa yakasına geçtik.', 'Ontem de manhã atravessamos para o lado europeu de balsa e trem.'], ['Yarın arkadaşımla kitapçıda buluşacağız.', 'Amanhã vou me encontrar com meu amigo na livraria.']], glossary: [['vapur', 'balsa / ferry', '/vaˈpuɾ/'], ['kitapçı', 'livraria', '/kitapˈtʃɯ/']] },
    { level: 'B1', titleTarget: 'Proje toplantısı', titlePt: 'Reunião de projeto', sentences: [['Dün akşam izlediğimiz belgesel ekip için çok ilham vericiydi.', 'O documentário que assistimos ontem à noite foi muito inspirador para a equipe.'], ['Yağmura rağmen toplantıya zamanında ulaştık.', 'Apesar da chuva, chegamos à reunião a tempo.']], glossary: [['belgesel', 'documentário', '/belɟeˈsel/'], ['rağmen', 'apesar de', '/ɾaːˈmen/']] },
    { level: 'B2', titleTarget: 'Yeni ulaşım ağı', titlePt: 'Nova rede de transporte', sentences: [['Yeni metro hattı gelecek ay resmen açılacak.', 'A nova linha de metrô será inaugurada oficialmente no próximo mês.'], ['Toplu taşıma geliştikçe şehir trafiği rahatlıyor.', 'À medida que o transporte público melhora, o trânsito da cidade alivia.']], glossary: [['ulaşım', 'transporte', '/ulaˈʃɯm/'], ['rahatlamak', 'aliviar / relaxar', '/ɾahatlaˈmak/']] },
    { level: 'C1', titleTarget: 'Sürdürülebilir gelecek', titlePt: 'Futuro sustentável', sentences: [['Enerji depolama teknolojileri geliştikçe şebeke istikrarı güçlenmektedir.', 'À medida que as tecnologias de armazenamento de energia avançam, a estabilidade da rede se fortalece.'], ['Yönetim, yeni çevre düzenlemesinin gelecek yıl yürürlüğe gireceğini açıkladı.', 'A diretoria anunciou que o novo regulamento ambiental entrará em vigor no próximo ano.']], glossary: [['istikrar', 'estabilidade', '/isticˈɾaɾ/'], ['yürürlük', 'vigência', '/jyɾyɾˈlyc/']] },
  ]),
  buildBook('he', 'יום בתל אביב', 'Cinco capítulos de A1 a C1 em Hebraico Moderno (RTL)', [
    { level: 'A1', titleTarget: 'בוקר בבית הקפה', titlePt: 'Manhã no café', sentences: [['אני שותה קפה הפוך גדול בבית קפה בתל אביב.', 'Estou tomando um café com leite grande em uma cafeteria em Tel Aviv.'], ['הספר החדש נמצא על השולחן ליד החלון.', 'O livro novo está sobre a mesa perto da janela.']], glossary: [['קפה', 'café', '/kaˈfe/'], ['ספר', 'livro', '/ˈsefeʁ/']] },
    { level: 'A2', titleTarget: 'ברכבת לירושלים', titlePt: 'No trem para Jerusalém', sentences: [['אתמול נסענו ברכבת המהירה לירושלים.', 'Ontem viajamos no trem rápido para Jerusalém.'], ['מחר אנחנו נבקר במוזיאון ישראל בבוקר.', 'Amanhã visitaremos o Museu de Israel pela manhã.']], glossary: [['רכבת', 'trem', '/ʁaˈkevet/'], ['מוזיאון', 'museu', '/muzeˈon/']] },
    { level: 'B1', titleTarget: 'תחנת הרכבת החדשה', titlePt: 'A nova estação de trem', sentences: [['תחנת הרכבת של העיר קרובה מאוד למרכז.', 'A estação de trem da cidade fica muito perto do centro.'], ['למרות שמזג האוויר היה חם, טיילנו בפארק.', 'Embora o clima estivesse quente, passeamos pelo parque.']], glossary: [['תחנה', 'estação', '/taχaˈna/'], ['מרכז', 'centro', '/meʁˈkaz/']] },
    { level: 'B2', titleTarget: 'תרבות ההייטק', titlePt: 'Cultura de startups', sentences: [['הגרסה החדשה של האפליקציה תושק בשבוע הבא.', 'A nova versão do aplicativo será lançada na semana que vem.'], ['תקשורת ישירה בצוות חוסכת זמן יקר.', 'Comunicação direta na equipe economiza tempo precioso.']], glossary: [['גרסה', 'versão', '/ɡiʁˈsa/'], ['צוות', 'equipe', '/ˈtsevet/']] },
    { level: 'C1', titleTarget: 'חדשנות אקלימית', titlePt: 'Inovação climática', sentences: [['התקציב היה מצומצם; אף על פי כן, המחקר הניב תוצאות מרשימות.', 'O orçamento era limitado; ainda assim, a pesquisa rendeu resultados impressionantes.'], ['הרפורמה הירוקה תיכנס לתוקף בתחילת השנה הקרובה.', 'A reforma verde entrará em vigor no início do próximo ano.']], glossary: [['תקציב', 'orçamento', '/takˈtsiv/'], ['תוקף', 'vigor / validade', '/ˈtokef/']] },
  ]),
  buildBook('nb', 'Hverdag i Oslo', 'Cinco capítulos de A1 a C1 na Noruega (Bokmål)', [
    { level: 'A1', titleTarget: 'En rolig morgen', titlePt: 'Uma manhã tranquila', sentences: [['I dag studerer jeg norsk på en koselig kafé i Oslo.', 'Hoje estudo norueguês em um café aconchegante em Oslo.'], ['Det er et stort og lyst rom med utsikt mot fjorden.', 'É uma sala grande e iluminada com vista para o fiorde.']], glossary: [['kafé', 'café', '/kaˈfeː/'], ['fjord', 'fiorde', '/fjuːr/']] },
    { level: 'A2', titleTarget: 'Bokhandelen i sentrum', titlePt: 'A livraria no centro', sentences: [['Jeg kjøpte boken i bokhandelen på Karl Johan i går.', 'Comprei o livro na livraria na Karl Johan ontem.'], ['Hun sa at hun ikke kan komme på møtet i dag.', 'Ela disse que não pode vir à reunião hoje.']], glossary: [['bokhandel', 'livraria', '/ˈbuːkˌhandəl/'], ['møte', 'reunião', '/ˈmøːtə/']] },
    { level: 'B1', titleTarget: 'På vei til jobb', titlePt: 'A caminho do trabalho', sentences: [['Vi har allerede sendt den oppdaterte rapporten til kunden.', 'Já enviamos o relatório atualizado ao cliente.'], ['Henrik tok sin egen sykkel og syklet hjem i solen.', 'Henrik pegou sua própria bicicleta e pedalou para casa ao sol.']], glossary: [['rapport', 'relatório', '/raˈpɔʈ/'], ['sykkel', 'bicicleta', '/ˈsʏkːəl/']] },
    { level: 'B2', titleTarget: 'Nye muligheter', titlePt: 'Novas oportunidades', sentences: [['Dørene åpnes klokken ni hver eneste hverdag.', 'As portas abrem às nove horas todos os dias úteis.'], ['Til tross for regnet gikk vi en lang tur i marka.', 'Apesar da chuva, fizemos uma longa caminhada na floresta.']], glossary: [['hverdag', 'dia útil / cotidiano', '/ˈvæːɖɑːɡ/'], ['mulighet', 'oportunidade', '/ˈmʉːlɪheːt/']] },
    { level: 'C1', titleTarget: 'Grønn omstilling', titlePt: 'Transição verde', sentences: [['Budsjettet var stramt; likevel klarte teamet å levere før fristen.', 'O orçamento estava apertado; ainda assim, a equipe conseguiu entregar antes do prazo.'], ['Det nye regelverket trer i kraft første januar.', 'A nova regulamentação entra em vigor em primeiro de janeiro.']], glossary: [['frist', 'prazo', '/frɪst/'], ['regelverk', 'regulamentação', '/ˈreːɡəlˌværk/']] },
  ]),
  buildBook('da', 'Hygge i København', 'Cinco capítulos de A1 a C1 na Dinamarca', [
    { level: 'A1', titleTarget: 'Morgen hos bageren', titlePt: 'Manhã na padaria', sentences: [['I dag læser jeg dansk med en ven på en lille café.', 'Hoje estudo dinamarquês com um amigo em um pequeno café.'], ['Det er et stort og lyst værelse tæt på havnen.', 'É um quarto grande e iluminado perto do porto.']], glossary: [['bager', 'padeiro / padaria', '/ˈbæːjɐ/'], ['havn', 'porto', '/ˈhɑʊ̯ˀn/']] },
    { level: 'A2', titleTarget: 'Boghandlen i Aarhus', titlePt: 'A livraria em Aarhus', sentences: [['Jeg købte bogen i boghandlen i går eftermiddags.', 'Comprei o livro na livraria ontem à tarde.'], ['Hun sagde, at hun ikke kan nå mødet i dag.', 'Ela disse que não consegue chegar à reunião hoje.']], glossary: [['boghandel', 'livraria', '/ˈbɒwˌhanˀl̩/'], ['møde', 'reunião', '/ˈmøːðə/']] },
    { level: 'B1', titleTarget: 'På cykel langs kanalen', titlePt: 'De bicicleta pelo canal', sentences: [['Vi har allerede sendt den nye aftale til kunden.', 'Já enviamos o novo acordo ao cliente.'], ['Kasper tog sin egen cykel og kørte hjem i god tid.', 'Kasper pegou sua própria bicicleta e voltou para casa com folga.']], glossary: [['aftale', 'acordo', '/ˈɑʊ̯ˌtˢæːlə/'], ['cykel', 'bicicleta', '/ˈsyɡl̩/']] },
    { level: 'B2', titleTarget: 'Tillid på arbejdet', titlePt: 'Confiança no trabalho', sentences: [['Dørene åbnes klokken ni hver morgen i kulturhuset.', 'As portas abrem às nove horas toda manhã no centro cultural.'], ['På trods af vinden cyklede vi langs hele kysten.', 'Apesar do vento, pedalamos ao longo de toda a costa.']], glossary: [['kyst', 'costa / litoral', '/ˈkʰøsd/'], ['trivsel', 'bem-estar', '/ˈtˢʁiʊ̯ˀsl̩/']] },
    { level: 'C1', titleTarget: 'Fremtidens energi', titlePt: 'Energia do futuro', sentences: [['Budgettet var begrænset; ikke desto mindre nåede holdet alle mål.', 'O orçamento era limitado; não obstante, a equipe atingiu todas as metas.'], ['Den nye lovgivning træder i kraft ved årsskiftet.', 'A nova legislação entra em vigor na virada do ano.']], glossary: [['lovgivning', 'legislação', '/ˈlɒʊ̯ˌɡiʊ̯ˀneŋ/'], ['årsskifte', 'virada do ano', '/ˈɒːsˌsɡifdə/']] },
  ]),
  buildBook('pt', 'Um Dia entre Rio e Lisboa', 'Five graded chapters from A1 to C1 in Brazilian & European Portuguese', [
    { level: 'A1', titleTarget: 'Manhã na padaria', titlePt: 'Morning at the bakery', sentences: [['Hoje eu tomo um café com leite e como pão de queijo.', 'Today I have a coffee with milk and eat cheese bread.'], ['A padaria fica perto da minha casa.', 'The bakery is near my house.']], glossary: [['padaria', 'bakery', '/padaˈɾi.ɐ/'], ['perto', 'near / close', '/ˈpɛɾtu/']] },
    { level: 'A2', titleTarget: 'Passeio no parque', titlePt: 'Walk in the park', sentences: [['Ontem caminhei pelo parque e encontrei meus amigos.', 'Yesterday I walked through the park and met my friends.'], ['Amanhã vamos viajar de trem até a praia.', 'Tomorrow we are going to travel by train to the beach.']], glossary: [['caminhar', 'to walk', '/kamiˈɲaɾ/'], ['praia', 'beach', '/ˈpɾaj.ɐ/']] },
    { level: 'B1', titleTarget: 'Reunião de equipe', titlePt: 'Team meeting', sentences: [['Quando você chegar ao escritório, me mande uma mensagem.', 'When you arrive at the office, send me a message.'], ['Espero que a apresentação corra muito bem hoje.', 'I hope the presentation goes very well today.']], glossary: [['escritório', 'office', '/iskɾiˈtɔɾju/'], ['apresentação', 'presentation', '/apɾezẽtaˈsɐ̃w̃/']] },
    { level: 'B2', titleTarget: 'Parceria atlântica', titlePt: 'Parceria atlântica', sentences: [['Embora haja diferenças regionais, o entendimento entre brasileiros e portugueses é imediato.', 'Embora existam variações, a compreensão mútua é imediata.'], ['A nova plataforma digital será lançada no próximo trimestre.', 'O lançamento ocorrerá no trimestre seguinte.']], glossary: [['embora', 'ainda que / embora', '/ẽˈbɔɾɐ/'], ['trimestre', 'período de 3 meses', '/tɾiˈmɛstɾi/']] },
    { level: 'C1', titleTarget: 'Sustentabilidade e inovação', titlePt: 'Sustentabilidade e inovação', sentences: [['Não obstante os entraves iniciais, o acordo multilateral entrou em vigor ontem.', 'Apesar dos obstáculos iniciais, o acordo passou a valer ontem.'], ['Cumpre destacar a relevância da transição energética para o desenvolvimento regional.', 'É essencial ressaltar a importância da transição energética.']], glossary: [['entrave', 'obstáculo / barreira', '/ẽˈtɾavi/'], ['vigor', 'validade legal', '/viˈɡoɾ/']] },
  ]),
];

export function getGradedReaderByLanguage(lang: LanguageCode): GradedReaderBook | undefined {
  return GRADED_READERS.find((b) => b.languageCode === lang);
}

import type { CEFRLevel, LanguageCode } from '../types/learning';

export interface ImmersionCheckpoint {
  id: string;
  afterLineIdx: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanationPt: string;
}

interface LangDialogSnippets {
  intro1: (s1: string, s2: string, topic: string) => [string, string];
  intro2: (s2: string) => [string, string];
  reaction1: [string, string];
  clarify2: [string, string];
  detail1: [string, string];
  wrap2: [string, string];
  close1: [string, string];
  chk1Q: string;
  chk1Opts: [string, string, string];
  chk1Exp: string;
  chk2Q: string;
  chk2Opts: [string, string, string];
  chk2Exp: string;
}

const SNIPPETS: Record<LanguageCode, LangDialogSnippets> = {
  en: {
    intro1: (s1, s2, t) => [
      `Welcome back to FluentBridge Audio! I'm ${s1}, and today ${s2} and I are diving into "${t}".`,
      `Bem-vindos de volta ao FluentBridge Audio! Eu sou ${s1}, e hoje ${s2} e eu vamos explorar "${t}".`,
    ],
    intro2: (s2) => [
      `Thanks, ${s2 ? 'everyone' : ''}! Let's jump right into a realistic conversation you can use immediately.`,
      'Valeu! Vamos direto para uma conversa realista que você pode usar imediatamente.',
    ],
    reaction1: [
      'That makes total sense. Could you repeat the key detail so we do not miss anything?',
      'Faz todo sentido. Você pode repetir o detalhe principal para não perdermos nada?',
    ],
    clarify2: [
      'Of course! Listen closely to the phrasing and intonation—natives use this exact rhythm every day.',
      'Claro! Ouça com atenção a escolha de palavras e a entonação — nativos usam exatamente esse ritmo todo dia.',
    ],
    detail1: [
      'Before we wrap up, remember to notice how both speakers connect ideas smoothly without rushing.',
      'Antes de encerrarmos, repare em como os dois falantes conectam as ideias com naturalidade e sem pressa.',
    ],
    wrap2: [
      'Exactly. Practicing this dialogue out loud twice will lock the expressions into long-term memory.',
      'Exatamente. Praticar esse diálogo em voz alta duas vezes fixa as expressões na memória de longo prazo.',
    ],
    close1: [
      'Thanks for listening! Answer the final checkpoint below and save your favorite phrases to review.',
      'Obrigado por ouvir! Responda à checagem final abaixo e salve suas frases favoritas para revisar.',
    ],
    chk1Q: 'Por que os apresentadores pedem para prestar atenção ao ritmo e entonação?',
    chk1Opts: [
      'Porque nativos usam exatamente esse ritmo no dia a dia',
      'Para falar o mais rápido possível',
      'Para evitar usar qualquer conector',
    ],
    chk1Exp: 'Eles destacam que nativos usam exatamente essa entonação e ritmo no cotidiano.',
    chk2Q: 'Qual estratégia eles recomendam antes do encerramento para fixar o conteúdo?',
    chk2Opts: [
      'Decorar apenas palavras soltas',
      'Praticar o diálogo em voz alta duas vezes',
      'Pular a revisão',
    ],
    chk2Exp: 'Praticar o diálogo em voz alta duas vezes ajuda a consolidar as expressões na memória.',
  },
  es: {
    intro1: (s1, s2, t) => [
      `¡Bienvenidos a FluentBridge Podcast! Soy ${s1} y hoy converso con ${s2} sobre "${t}".`,
      `Bem-vindos ao FluentBridge Podcast! Sou ${s1} e hoje converso com ${s2} sobre "${t}".`,
    ],
    intro2: () => [
      '¡Hola a todos! Escuchen con atención este diálogo real de principio a fin.',
      'Olá a todos! Ouçam com atenção este diálogo real do começo ao fim.',
    ],
    reaction1: [
      'Qué buen punto. ¿Podemos confirmar ese detalle una vez más para que quede clarísimo?',
      'Que ótimo ponto. Podemos confirmar esse detalhe mais uma vez para ficar bem claro?',
    ],
    clarify2: [
      'Por supuesto. Fíjate en la entonación natural y en las expresiones de cortesía.',
      'Com certeza. Repare na entonação natural e nas expressões de cortesia.',
    ],
    detail1: [
      'Además, esta estructura aparece muchísimo en conversaciones cotidianas y viajes.',
      'Além disso, essa estrutura aparece muito em conversas do dia a dia e viagens.',
    ],
    wrap2: [
      'Totalmente de acuerdo. Repetir las frases en voz alta marca la diferencia.',
      'Concordo totalmente. Repetir as frases em voz alta faz toda a diferença.',
    ],
    close1: [
      '¡Gracias por escucharnos! Responde la pregunta final para completar tu episodio.',
      'Obrigado por nos ouvir! Responda à pergunta final para concluir seu episódio.',
    ],
    chk1Q: 'O que os falantes destacam observar durante o diálogo?',
    chk1Opts: [
      'A entonação natural e as expressões de cortesia',
      'Apenas verbos no futuro',
      'Falar sem pausas',
    ],
    chk1Exp: 'Eles reforçam a importância da entonação natural e das expressões de cortesia.',
    chk2Q: 'Como eles recomendam consolidar as frases do episódio?',
    chk2Opts: [
      'Repetindo as frases em voz alta',
      'Traduzindo palavra por palavra',
      'Ignorando o áudio',
    ],
    chk2Exp: 'Repetir as frases em voz alta consolida ritmo e pronúncia.',
  },
  fr: {
    intro1: (s1, s2, t) => [
      `Bienvenue dans FluentBridge Audio ! Ici ${s1}, avec ${s2}, autour du thème « ${t} ».`,
      `Bem-vindos ao FluentBridge Audio! Aqui é ${s1}, com ${s2}, sobre o tema "${t}".`,
    ],
    intro2: () => [
      'Bonjour à tous ! Écoutons ensemble une situation authentique du quotidien.',
      'Olá a todos! Vamos ouvir juntos uma situação autêntica do cotidiano.',
    ],
    reaction1: [
      'Très bien ! Tu peux préciser ce détail pour nos auditeurs ?',
      'Muito bom! Você pode detalhar esse ponto para os nossos ouvintes?',
    ],
    clarify2: [
      'Bien sûr ! Faites attention aux liaisons et au rythme naturel de la phrase.',
      'Claro! Prestem atenção às liaisons e ao ritmo natural da frase.',
    ],
    detail1: [
      'C’est exactement ce qu’on entend dans les rues de Paris ou de Montréal.',
      'É exatamente isso que se ouve nas ruas de Paris ou de Montreal.',
    ],
    wrap2: [
      'Exactement. N’hésitez pas à réécouter ce passage à vitesse lente.',
      'Exatamente. Não hesitem em reouvir este trecho em velocidade reduzida.',
    ],
    close1: [
      'Merci de votre écoute ! Répondez au dernier quiz pour valider l’épisode.',
      'Obrigado pela audiência! Respondam ao último quiz para validar o episódio.',
    ],
    chk1Q: 'O que o episódio pede para observar na pronúncia francesa?',
    chk1Opts: ['As liaisons e o ritmo natural', 'Apenas ortografia', 'Somente gírias antigas'],
    chk1Exp: 'O foco está nas liaisons e no ritmo natural da fala francesa.',
    chk2Q: 'Qual dica é dada ao final da conversa?',
    chk2Opts: ['Reouvir o trecho em velocidade lenta', 'Não repetir em voz alta', 'Pular o vocabulário'],
    chk2Exp: 'Reouvir em velocidade lenta ajuda a perceber ligações fonéticas.',
  },
  it: {
    intro1: (s1, s2, t) => [
      `Benvenuti su FluentBridge Podcast! Sono ${s1} e oggi con ${s2} parliamo di "${t}".`,
      `Bem-vindos ao FluentBridge Podcast! Sou ${s1} e hoje com ${s2} falamos sobre "${t}".`,
    ],
    intro2: () => [
      'Ciao a tutti! Ascoltiamo questo dialogo reale passo dopo passo.',
      'Olá a todos! Vamos ouvir este diálogo real passo a passo.',
    ],
    reaction1: [
      'Perfetto! Puoi ripetere questo passaggio chiave con chiarezza?',
      'Perfeito! Pode repetir esse trecho-chave com clareza?',
    ],
    clarify2: [
      'Certo! Notate come le espressioni si collegano con naturalezza.',
      'Claro! Notem como as expressões se conectam com naturalidade.',
    ],
    detail1: [
      'Queste frasi sono utilissime nella vita quotidiana in Italia.',
      'Essas frases são muito úteis na vida cotidiana na Itália.',
    ],
    wrap2: [
      'Verissimo! Ripetere ad alta voce aiuta tantissimo la fluidità.',
      'Verdade! Repetir em voz alta ajuda muito na fluência.',
    ],
    close1: [
      'Grazie per l’ascolto! Completate la verifica finale qui sotto.',
      'Obrigado por ouvir! Completem a checagem final abaixo.',
    ],
    chk1Q: 'Qual é o conselho principal dado durante o diálogo em italiano?',
    chk1Opts: ['Observar a conexão natural das expressões', 'Evitar perguntas', 'Usar apenas frases soltas'],
    chk1Exp: 'Os falantes destacam a conexão natural das expressões no italiano falado.',
    chk2Q: 'O que ajuda na fluência segundo o encerramento?',
    chk2Opts: ['Repetir em voz alta', 'Ler apenas em silêncio', 'Pular os áudios'],
    chk2Exp: 'Repetir em voz alta fortalece ritmo e entonação italiana.',
  },
  de: {
    intro1: (s1, s2, t) => [
      `Willkommen bei FluentBridge Audio! Ich bin ${s1}, und mit ${s2} geht es heute um „${t}“.`,
      `Bem-vindos ao FluentBridge Audio! Sou ${s1}, e com ${s2} falamos hoje sobre "${t}".`,
    ],
    intro2: () => [
      'Hallo zusammen! Hört genau auf die Satzstellung und die Betonung.',
      'Olá pessoal! Prestem bastante atenção à ordem das palavras e à entonação.',
    ],
    reaction1: [
      'Sehr gut! Kannst du diesen Punkt noch einmal kurz zusammenfassen?',
      'Muito bom! Você pode resumir esse ponto mais uma vez rapidamente?',
    ],
    clarify2: [
      'Klar! Im Alltag klingt diese Wendung besonders freundlich und direkt.',
      'Claro! No dia a dia essa expressão soa especialmente cordial e direta.',
    ],
    detail1: [
      'Achtet darauf, wie das Verb im Nebensatz ganz am Ende steht.',
      'Reparem em como o verbo na oração subordinada vai para o final.',
    ],
    wrap2: [
      'Genau! Lautes Nachsprechen festigt die Struktur sofort.',
      'Exato! Repetir em voz alta fixa a estrutura imediatamente.',
    ],
    close1: [
      'Danke fürs Zuhören! Beantwortet jetzt die letzte Verständnisfrage.',
      'Obrigado por ouvir! Respondam agora à pergunta final de compreensão.',
    ],
    chk1Q: 'Qual ponto gramatical é lembrado durante o episódio em alemão?',
    chk1Opts: ['A posição do verbo e a entonação', 'Apenas plural', 'Somente cores'],
    chk1Exp: 'Eles chamam atenção para a posição do verbo e a entonação natural.',
    chk2Q: 'Como fixar a estrutura segundo o diálogo?',
    chk2Opts: ['Repetindo em voz alta', 'Ignorando exemplos', 'Sem ouvir áudio'],
    chk2Exp: 'O Nachsprechen (repetir em voz alta) consolida a ordem verbal.',
  },
  ru: {
    intro1: (s1, s2, t) => [
      `Добро пожаловать в FluentBridge! Я ${s1}, и сегодня мы с ${s2} обсуждаем тему «${t}».`,
      `Bem-vindos ao FluentBridge! Sou ${s1} e hoje com ${s2} discutimos "${t}".`,
    ],
    intro2: () => [
      'Привет всем! Слушайте внимательно естественную русскую речь.',
      'Olá a todos! Ouçam com atenção a fala natural em russo.',
    ],
    reaction1: [
      'Отлично! Можешь повторить эту ключевую фразу ещё раз?',
      'Ótimo! Pode repetir essa frase-chave mais uma vez?',
    ],
    clarify2: [
      'Конечно! Обратите внимание на ударение и мягкое произношение.',
      'Claro! Prestem atenção à sílaba tônica e à pronúncia.',
    ],
    detail1: [
      'Такие выражения вы услышите каждый день в реальном общении.',
      'Você ouvirá essas expressões todos os dias na comunicação real.',
    ],
    wrap2: [
      'Верно! Повторение вслух помогает сразу запомнить интонацию.',
      'Verdade! Repetir em voz alta ajuda a memorizar a entonação na hora.',
    ],
    close1: [
      'Спасибо за внимание! Ответьте на финальный вопрос внизу.',
      'Obrigado pela atenção! Respondam à pergunta final abaixo.',
    ],
    chk1Q: 'O que o apresentador pede para observar no russo falado?',
    chk1Opts: ['A sílaba tônica e a entonação', 'Apenas letras maiúsculas', 'Nada de áudio'],
    chk1Exp: 'Em russo, a sílaba tônica muda a pronúncia das vogais átonas.',
    chk2Q: 'Qual prática final é recomendada?',
    chk2Opts: ['Repetir em voz alta', 'Pular o diálogo', 'Decorar sem contexto'],
    chk2Exp: 'Repetir em voz alta fixa a entonação natural.',
  },
  ja: {
    intro1: (s1, s2, t) => [
      `FluentBridgeポッドキャストへようこそ！${s1}と${s2}で「${t}」について話します。`,
      `Bem-vindos ao podcast FluentBridge! ${s1} e ${s2} conversam sobre "${t}".`,
    ],
    intro2: () => [
      'こんにちは！実際の会話のリズムを一緒に聞きましょう。',
      'Olá! Vamos ouvir juntos o ritmo de uma conversa real.',
    ],
    reaction1: [
      'なるほど！大切なポイントをもう一度確認できますか。',
      'Entendi! Podemos confirmar o ponto principal mais uma vez?',
    ],
    clarify2: [
      'もちろんです！丁寧な表現と自然なイントネーションに注目してください。',
      'Claro! Observem as expressões educadas e a entonação natural.',
    ],
    detail1: [
      '毎日の会話でもよく使われる表現なので、覚えておくと便利です。',
      'Como é uma expressão muito usada no dia a dia, vale muito memorizar.',
    ],
    wrap2: [
      'その通りですね。声に出して練習すると身につきます。',
      'Exatamente. Praticar em voz alta ajuda a fixar de verdade.',
    ],
    close1: [
      '聞いてくれてありがとうございました！最後の質問に答えてみましょう。',
      'Obrigado por ouvir! Vamos responder à pergunta final.',
    ],
    chk1Q: 'O que é destacado para observar na conversa em japonês?',
    chk1Opts: ['Expressões educadas e entonação natural', 'Apenas Kanji raros', 'Falar sem partículas'],
    chk1Exp: 'O foco está na polidez e na entonação natural.',
    chk2Q: 'Como o diálogo sugere fixar o conteúdo?',
    chk2Opts: ['Praticar em voz alta', 'Não ouvir novamente', 'Ler só em português'],
    chk2Exp: 'Praticar em voz alta consolida ritmo e pitch accent.',
  },
  zh: {
    intro1: (s1, s2, t) => [
      `欢迎收听 FluentBridge 播客！我是${s1}，今天和${s2}聊聊“${t}”。`,
      `Bem-vindos ao podcast FluentBridge! Sou ${s1}, hoje conversando com ${s2} sobre "${t}".`,
    ],
    intro2: () => [
      '大家好！请仔细听下面的真实对话和声调变化。',
      'Olá a todos! Ouçam com atenção o diálogo real e os tons abaixo.',
    ],
    reaction1: [
      '很有道理！可以再重复一下关键的细节吗？',
      'Faz muito sentido! Pode repetir o detalhe principal mais uma vez?',
    ],
    clarify2: [
      '当然可以！请注意每个汉字的声调和自然的语速。',
      'Claro! Prestem atenção aos tons e ao ritmo natural da fala.',
    ],
    detail1: [
      '这些表达在日常交流中非常实用，建议多听几遍。',
      'Essas expressões são muito úteis no dia a dia; vale ouvir várias vezes.',
    ],
    wrap2: [
      '没错，大声跟读能够很快提升语感。',
      'Isso mesmo, repetir em voz alta melhora rápido a naturalidade.',
    ],
    close1: [
      '感谢收听！请完成下面的最后一道理解题。',
      'Obrigado por ouvir! Completem a última questão de compreensão abaixo.',
    ],
    chk1Q: 'O que os falantes pedem para observar no mandarim?',
    chk1Opts: ['Os tons e o ritmo natural', 'Apenas tradução literal', 'Ignorar os tons'],
    chk1Exp: 'Os tons definem o significado das palavras em mandarim.',
    chk2Q: 'O que melhora a fluência segundo o final do áudio?',
    chk2Opts: ['Repetir em voz alta (跟读)', 'Ficar em silêncio', 'Pular o áudio'],
    chk2Exp: 'A prática em voz alta (shadowing) consolida os 4 tons.',
  },
  ar: {
    intro1: (s1, s2, t) => [
      `مرحباً بكم في بودكاست FluentBridge! أنا ${s1} واليوم مع ${s2} نتحدث عن "${t}".`,
      `Bem-vindos ao podcast FluentBridge! Sou ${s1} e hoje com ${s2} falamos sobre "${t}".`,
    ],
    intro2: () => [
      'أهلاً بالجميع! استمعوا جيداً إلى هذا الحوار الواقعي.',
      'Olá a todos! Ouçam com atenção este diálogo realista.',
    ],
    reaction1: [
      'نقطة ممتازة! هل يمكنك توضيح هذا التفصيل مرة أخرى؟',
      'Excelente ponto! Você pode esclarecer esse detalhe mais uma vez?',
    ],
    clarify2: [
      'بالتأكيد! انتبهوا إلى مخارج الحروف ونبرة الصوت الطبيعية.',
      'Com certeza! Prestem atenção à articulação das letras e à entonação natural.',
    ],
    detail1: [
      'هذه العبارات شائعة جداً في المحادثات اليومية.',
      'Essas expressões são muito comuns nas conversas diárias.',
    ],
    wrap2: [
      'صحيح تماماً، والتكرار بصوت عالٍ يثبت الجمل في الذاكرة.',
      'Totalmente correto; repetir em voz alta fixa as frases na memória.',
    ],
    close1: [
      'شكراً لاستماعكم! أجيبوا عن السؤال الأخير في الأسفل.',
      'Obrigado por ouvirem! Respondam à última pergunta abaixo.',
    ],
    chk1Q: 'O que o áudio destaca observar na pronúncia árabe?',
    chk1Opts: ['Articulação das letras e entonação', 'Apenas escrita latina', 'Sem áudio'],
    chk1Exp: 'A articulação clara dos sons árabes é essencial na conversa.',
    chk2Q: 'Como fixar as frases segundo o episódio?',
    chk2Opts: ['Repetindo em voz alta', 'Pulando a revisão', 'Sem praticar'],
    chk2Exp: 'Repetir em voz alta fortalece a memória auditiva.',
  },
  nl: {
    intro1: (s1, s2, t) => [
      `Welkom bij FluentBridge Audio! Ik ben ${s1} en vandaag praat ik met ${s2} over "${t}".`,
      `Bem-vindos ao FluentBridge Audio! Sou ${s1} e hoje converso com ${s2} sobre "${t}".`,
    ],
    intro2: () => [
      'Hallo allemaal! Luister goed naar dit alledaagse gesprek.',
      'Olá a todos! Ouçam com atenção esta conversa do dia a dia.',
    ],
    reaction1: [
      'Goed punt! Kun je dat belangrijke detail nog één keer herhalen?',
      'Ótimo ponto! Pode repetir esse detalhe importante mais uma vez?',
    ],
    clarify2: [
      'Natuurlijk! Let op de klemtoon en de vriendelijke toon.',
      'Claro! Prestem atenção à sílaba tônica e ao tom cordial.',
    ],
    detail1: [
      'Deze zinnen hoor je elke dag in Nederland en Vlaanderen.',
      'Você ouve essas frases todos os dias na Holanda e em Flandres.',
    ],
    wrap2: [
      'Precies! Hardop meespreken helpt enorm voor je uitspraak.',
      'Exato! Falar junto em voz alta ajuda muito na pronúncia.',
    ],
    close1: [
      'Bedankt voor het luisteren! Beantwoord de laatste vraag hieronder.',
      'Obrigado por ouvir! Responda à última pergunta abaixo.',
    ],
    chk1Q: 'O que observar durante a conversa em holandês?',
    chk1Opts: ['A sílaba tônica e o tom cordial', 'Apenas siglas', 'Sem prestar atenção'],
    chk1Exp: 'Eles destacam a sílaba tônica e o tom natural.',
    chk2Q: 'Qual prática ajuda na pronúncia?',
    chk2Opts: ['Falar junto em voz alta', 'Pular o áudio', 'Ler em silêncio'],
    chk2Exp: 'Falar junto em voz alta treina os ditongos do holandês.',
  },
  af: {
    intro1: (s1, s2, t) => [
      `Welkom by FluentBridge Audio! Ek is ${s1} en vandag gesels ek met ${s2} oor "${t}".`,
      `Bem-vindos ao FluentBridge Audio! Sou ${s1} e hoje converso com ${s2} sobre "${t}".`,
    ],
    intro2: () => [
      'Hallo almal! Luister mooi na hierdie egte gesprek.',
      'Olá pessoal! Ouçam bem esta conversa autêntica.',
    ],
    reaction1: [
      'Goeie punt! Kan jy daardie belangrike detail weer bevestig?',
      'Bom ponto! Você pode confirmar esse detalhe importante de novo?',
    ],
    clarify2: [
      'Natuurlik! Let op die dubbele ontkenning en die vriendelike ritme.',
      'Claro! Observem a dupla negação e o ritmo amigável.',
    ],
    detail1: [
      'Hierdie uitdrukkings is baie algemeen in alledaagse Afrikaans.',
      'Essas expressões são muito comuns no africâner cotidiano.',
    ],
    wrap2: [
      'Presies! Om hardop te oefen maak jou vlotter.',
      'Exatamente! Praticar em voz alta deixa você mais fluente.',
    ],
    close1: [
      'Dankie vir die luister! Beantwoord die laaste vraag hieronder.',
      'Obrigado por ouvir! Responda à última pergunta abaixo.',
    ],
    chk1Q: 'Qual traço do africâner é destacado no diálogo?',
    chk1Opts: ['A dupla negação e o ritmo amigável', 'Apenas verbos em inglês', 'Sem ritmo'],
    chk1Exp: 'O africâner usa a dupla negação (nie ... nie) e ritmo claro.',
    chk2Q: 'Como ganhar fluência segundo o final do áudio?',
    chk2Opts: ['Praticar em voz alta', 'Evitar falar', 'Pular a unidade'],
    chk2Exp: 'Praticar em voz alta consolida a fluência.',
  },
  sv: {
    intro1: (s1, s2, t) => [
      `Välkommen till FluentBridge Podcast! Jag heter ${s1} och idag pratar jag med ${s2} om "${t}".`,
      `Bem-vindos ao FluentBridge Podcast! Sou ${s1} e hoje falo com ${s2} sobre "${t}".`,
    ],
    intro2: () => [
      'Hej allihopa! Lyssna noga på det här vardagliga samtalet.',
      'Olá a todos! Ouçam com atenção esta conversa cotidiana.',
    ],
    reaction1: [
      'Bra poäng! Kan du upprepa den viktigaste detaljen en gång till?',
      'Bom ponto! Pode repetir o detalhe mais importante mais uma vez?',
    ],
    clarify2: [
      'Självklart! Lägg märke till melodin och de mjuka vokalerna i svenskan.',
      'Claro! Reparem na melodia e nas vogais do sueco.',
    ],
    detail1: [
      'De här fraserna används hela tiden i verkliga samtal.',
      'Essas frases são usadas o tempo todo em conversas reais.',
    ],
    wrap2: [
      'Precis! Att upprepa högt gör stor skillnad för uttalet.',
      'Exato! Repetir em voz alta faz grande diferença na pronúncia.',
    ],
    close1: [
      'Tack för att ni lyssnade! Svara på den sista frågan nedan.',
      'Obrigado por ouvir! Respondam à última pergunta abaixo.',
    ],
    chk1Q: 'O que observar no sueco falado neste episódio?',
    chk1Opts: ['A melodia da frase e as vogais', 'Apenas números', 'Nenhuma pausa'],
    chk1Exp: 'A entonação melódica e as vogais são marcas do sueco.',
    chk2Q: 'O que faz diferença na pronúncia segundo o final?',
    chk2Opts: ['Repetir em voz alta', 'Ler sem som', 'Pular revisão'],
    chk2Exp: 'Repetir em voz alta treina a melodia sueca.',
  },
  tr: {
    intro1: (s1, s2, t) => [
      `FluentBridge Podcast'e hoş geldiniz! Ben ${s1}, bugün ${s2} ile "${t}" hakkında konuşuyoruz.`,
      `Bem-vindos ao FluentBridge Podcast! Sou ${s1} e hoje falo com ${s2} sobre "${t}".`,
    ],
    intro2: () => [
      'Herkese merhaba! Bu günlük konuşmayı dikkatle dinleyin.',
      'Olá a todos! Ouçam com atenção esta conversa cotidiana.',
    ],
    reaction1: [
      'Çok güzel bir nokta! En önemli ayrıntıyı tekrar eder misin?',
      'Ótimo ponto! Pode repetir o detalhe mais importante mais uma vez?',
    ],
    clarify2: [
      'Elbette! Türkçe ünlü uyumuna ve eklerin akışına dikkat edin.',
      'Claro! Reparem na harmonia vocálica e no fluxo dos sufixos em turco.',
    ],
    detail1: [
      'Bu ifadeler gerçek konuşmalarda her zaman kullanılır.',
      'Essas expressões são usadas o tempo todo em conversas reais.',
    ],
    wrap2: [
      'Kesinlikle! Yüksek sesle tekrar etmek telaffuzu çok geliştirir.',
      'Com certeza! Repetir em voz alta melhora muito a pronúncia.',
    ],
    close1: [
      'Dinlediğiniz için teşekkürler! Aşağıdaki son soruyu yanıtlayın.',
      'Obrigado por ouvir! Respondam à última pergunta abaixo.',
    ],
    chk1Q: 'O que observar no turco falado neste episódio?',
    chk1Opts: ['A harmonia vocálica e os sufixos', 'Apenas números', 'Nenhuma pausa'],
    chk1Exp: 'A harmonia vocálica e a aglutinação são marcas centrais do turco.',
    chk2Q: 'O que mais ajuda na pronúncia segundo o final?',
    chk2Opts: ['Repetir em voz alta', 'Ler em silêncio', 'Pular revisão'],
    chk2Exp: 'Repetir em voz alta consolida a entonação e a harmonia vocálica.',
  },
  he: {
    intro1: (s1, s2, t) => [
      `ברוכים הבאים לפודקאסט של FluentBridge! אני ${s1}, והיום אני משוחח עם ${s2} על "${t}".`,
      `Bem-vindos ao FluentBridge Podcast! Sou ${s1} e hoje falo com ${s2} sobre "${t}".`,
    ],
    intro2: () => [
      'שלום לכולם! האזינו היטב לשיחה היומיומית הזו.',
      'Olá a todos! Ouçam com atenção esta conversa cotidiana.',
    ],
    reaction1: [
      'נקודה מעולה! אפשר לחזור שוב על הפרט החשוב ביותר?',
      'Ótimo ponto! Pode repetir o detalhe mais importante novamente?',
    ],
    clarify2: [
      'בוודאי! שימו לב להטעמה ולזרימה הטבעית של המשפט בעברית.',
      'Claro! Reparem na sílaba tônica e no fluxo natural do hebraico.',
    ],
    detail1: [
      'הביטויים האלה חוזרים כל הזמן בשיחות אמיתיות.',
      'Essas expressões aparecem o tempo todo em conversas reais.',
    ],
    wrap2: [
      'לגמרי! חזרה בקול רם משפרת משמעותית את ההגייה.',
      'Com certeza! Repetir em voz alta melhora muito a pronúncia.',
    ],
    close1: [
      'תודה שהאזנתם! ענו על השאלה האחרונה למטה.',
      'Obrigado por ouvir! Respondam à última pergunta abaixo.',
    ],
    chk1Q: 'O que observar no hebraico falado neste episódio?',
    chk1Opts: ['A sílaba tônica e o ritmo natural', 'Apenas datas', 'Sem pausas'],
    chk1Exp: 'A posição da tônica e o ritmo fluente dão naturalidade ao hebraico.',
    chk2Q: 'Como consolidar a pronúncia segundo o diálogo?',
    chk2Opts: ['Repetir em voz alta', 'Evitar falar', 'Pular lição'],
    chk2Exp: 'Repetir em voz alta fixa a pronúncia moderna.',
  },
  nb: {
    intro1: (s1, s2, t) => [
      `Velkommen til FluentBridge Podcast! Jeg heter ${s1}, og i dag snakker jeg med ${s2} om "${t}".`,
      `Bem-vindos ao FluentBridge Podcast! Sou ${s1} e hoje falo com ${s2} sobre "${t}".`,
    ],
    intro2: () => [
      'Hei alle sammen! Lytt nøye til denne hverdagssamtalen.',
      'Olá a todos! Ouçam com atenção esta conversa cotidiana.',
    ],
    reaction1: [
      'Godt poeng! Kan du gjenta den viktigste detaljen en gang til?',
      'Bom ponto! Pode repetir o detalhe mais importante mais uma vez?',
    ],
    clarify2: [
      'Selvfølgelig! Legg merke til melodien og V2-ordstillingen på norsk.',
      'Claro! Reparem na melodia e na ordem V2 do norueguês.',
    ],
    detail1: [
      'Disse uttrykkene brukes hele tiden i ekte samtaler.',
      'Essas expressões são usadas o tempo todo em conversas reais.',
    ],
    wrap2: [
      'Nettopp! Å gjenta høyt gjør stor forskjell for uttalen.',
      'Exato! Repetir em voz alta faz grande diferença na pronúncia.',
    ],
    close1: [
      'Takk for at dere lyttet! Svar på det siste spørsmålet nedenfor.',
      'Obrigado por ouvir! Respondam à última pergunta abaixo.',
    ],
    chk1Q: 'O que observar no norueguês falado neste episódio?',
    chk1Opts: ['A melodia da frase e a ordem V2', 'Apenas números', 'Sem entonação'],
    chk1Exp: 'A entonação melódica e o verbo em 2ª posição (V2) estruturam o norueguês.',
    chk2Q: 'O que faz diferença na pronúncia segundo o final?',
    chk2Opts: ['Repetir em voz alta', 'Ler sem som', 'Pular revisão'],
    chk2Exp: 'Repetir em voz alta treina o ritmo e os tons do norueguês.',
  },
  da: {
    intro1: (s1, s2, t) => [
      `Velkommen til FluentBridge Podcast! Jeg hedder ${s1}, og i dag taler jeg med ${s2} om "${t}".`,
      `Bem-vindos ao FluentBridge Podcast! Sou ${s1} e hoje falo com ${s2} sobre "${t}".`,
    ],
    intro2: () => [
      'Hej alle sammen! Lyt godt efter denne hverdagssamtale.',
      'Olá a todos! Ouçam com atenção esta conversa cotidiana.',
    ],
    reaction1: [
      'God pointe! Kan du gentage den vigtigste detalje én gang til?',
      'Bom ponto! Pode repetir o detalhe mais importante mais uma vez?',
    ],
    clarify2: [
      'Selvfølgelig! Læg mærke til rytmen, stød og det bløde d på dansk.',
      'Claro! Reparem no ritmo, no stød e no d suave do dinamarquês.',
    ],
    detail1: [
      'De her udtryk bliver brugt hele tiden i virkelige samtaler.',
      'Essas expressões são usadas o tempo todo em conversas reais.',
    ],
    wrap2: [
      'Præcis! At gentage højt gør en stor forskel for udtalen.',
      'Exato! Repetir em voz alta faz grande diferença na pronúncia.',
    ],
    close1: [
      'Tak fordi I lyttede med! Besvar det sidste spørgsmål nedenfor.',
      'Obrigado por ouvir! Respondam à última pergunta abaixo.',
    ],
    chk1Q: 'O que observar no dinamarquês falado neste episódio?',
    chk1Opts: ['O ritmo, o stød e o d suave', 'Apenas datas', 'Nenhuma pausa'],
    chk1Exp: 'O stød e o d suave (blødt d) são marcas essenciais da fala dinamarquesa.',
    chk2Q: 'O que melhora a pronúncia segundo o diálogo?',
    chk2Opts: ['Repetir em voz alta', 'Evitar ouvir áudio', 'Pular revisão'],
    chk2Exp: 'Repetir em voz alta fixa as reduções vocálicas do dinamarquês.',
  },
  pt: {
    intro1: (s1, s2, t) => [
      `Bem-vindos ao FluentBridge Podcast! Eu sou ${s1} e hoje converso com ${s2} sobre "${t}".`,
      `Welcome to the FluentBridge Podcast! I'm ${s1}, talking with ${s2} about "${t}".`,
    ],
    intro2: () => [
      'Olá pessoal! Ouçam com atenção o ritmo natural do português brasileiro e europeu.',
      'Hi everyone! Listen closely to the natural rhythm of Brazilian and European Portuguese.',
    ],
    reaction1: [
      'Ótimo ponto! Você pode repetir esse detalhe principal mais uma vez?',
      'Great point! Could you repeat that main detail one more time?',
    ],
    clarify2: [
      'Claro! Prestem atenção nas vogais nasais (ão, ãe) e na diferença entre ser e estar.',
      'Sure! Pay attention to nasal vowels (ão, ãe) and the difference between ser and estar.',
    ],
    detail1: [
      'Essas expressões aparecem o tempo todo em conversas reais no Brasil e em Portugal.',
      'These expressions come up all the time in real conversations in Brazil and Portugal.',
    ],
    wrap2: [
      'Com certeza! Repetir em voz alta acelera muito a fluência.',
      'Definitely! Repeating aloud speeds up fluency significantly.',
    ],
    close1: [
      'Obrigado por ouvir! Respondam à última pergunta abaixo.',
      'Thanks for listening! Answer the final question below.',
    ],
    chk1Q: 'What pronunciation feature is highlighted in this Portuguese episode?',
    chk1Opts: ['Nasal vowels (ão/ãe) & ser vs. estar', 'Only numbers', 'Silent verbs'],
    chk1Exp: 'Nasal vowels and ser vs. estar are core pillars of natural Portuguese.',
    chk2Q: 'What speeds up fluency according to the speakers?',
    chk2Opts: ['Repeating aloud', 'Skipping audio', 'Avoiding speaking'],
    chk2Exp: 'Repeating aloud builds muscle memory for Portuguese rhythm.',
  },
};

export interface ExpandableLine {
  speaker: string;
  voice: 'male' | 'female';
  dialectCode: string;
  text: string;
  translationPt: string;
}

export function expandPodcastLinesAndCheckpoints(params: {
  id: string;
  lang: LanguageCode;
  level: CEFRLevel;
  titleTarget: string;
  s1: string;
  d1: string;
  s2: string;
  d2: string;
  baseLines: ExpandableLine[];
  finalQuestion: string;
  finalOptions: string[];
  finalCorrectIndex: number;
}): {
  lines: ExpandableLine[];
  checkpoints: ImmersionCheckpoint[];
  durationLabel: string;
} {
  const sn = SNIPPETS[params.lang] ?? SNIPPETS.en;
  const [i1t, i1p] = sn.intro1(params.s1, params.s2, params.titleTarget);
  const [i2t, i2p] = sn.intro2(params.s2);
  const [r1t, r1p] = sn.reaction1;
  const [c2t, c2p] = sn.clarify2;
  const [d1t, d1p] = sn.detail1;
  const [w2t, w2p] = sn.wrap2;
  const [clt, clp] = sn.close1;

  const spk1 = (text: string, translationPt: string): ExpandableLine => ({
    speaker: params.s1,
    voice: 'male',
    dialectCode: params.d1,
    text,
    translationPt,
  });
  const spk2 = (text: string, translationPt: string): ExpandableLine => ({
    speaker: params.s2,
    voice: 'female',
    dialectCode: params.d2,
    text,
    translationPt,
  });

  const expanded: ExpandableLine[] = [
    spk1(i1t, i1p),
    spk2(i2t, i2p),
    ...params.baseLines,
    spk1(r1t, r1p),
    spk2(c2t, c2p),
    spk1(d1t, d1p),
    spk2(w2t, w2p),
    spk1(clt, clp),
  ];

  // Ensure >= 10 turns
  while (expanded.length < 10 && params.baseLines.length > 0) {
    const sample = params.baseLines[expanded.length % params.baseLines.length];
    expanded.splice(expanded.length - 2, 0, { ...sample });
  }

  const mid1 = Math.min(3, expanded.length - 3);
  const mid2 = Math.min(7, expanded.length - 2);
  const lastIdx = expanded.length - 1;

  const checkpoints: ImmersionCheckpoint[] = [
    {
      id: `${params.id}-chk-1`,
      afterLineIdx: mid1,
      question: sn.chk1Q,
      options: sn.chk1Opts,
      correctIndex: 0,
      explanationPt: sn.chk1Exp,
    },
    {
      id: `${params.id}-chk-2`,
      afterLineIdx: mid2,
      question: sn.chk2Q,
      options: sn.chk2Opts,
      correctIndex: 0,
      explanationPt: sn.chk2Exp,
    },
    {
      id: `${params.id}-chk-3`,
      afterLineIdx: lastIdx,
      question: params.finalQuestion,
      options: params.finalOptions,
      correctIndex: params.finalCorrectIndex,
      explanationPt: 'Compreensão principal confirmada no diálogo!',
    },
  ];

  const durationLabel =
    params.level === 'A1'
      ? '2:20'
      : params.level === 'A2'
        ? '2:45'
        : params.level === 'B1'
          ? '3:05'
          : params.level === 'B2'
            ? '3:25'
            : '3:45';

  return { lines: expanded, checkpoints, durationLabel };
}

export function buildVideoCheckpoints(
  id: string,
  lang: LanguageCode,
  totalLines: number,
  titlePt: string,
): ImmersionCheckpoint[] {
  const sn = SNIPPETS[lang] ?? SNIPPETS.en;
  const firstBreak = Math.min(3, Math.max(1, totalLines - 2));
  const finalBreak = Math.max(firstBreak + 1, totalLines - 1);
  return [
    {
      id: `${id}-vchk-1`,
      afterLineIdx: firstBreak,
      question: `No trecho inicial de "${titlePt}", o que os falantes estão destacando?`,
      options: sn.chk1Opts,
      correctIndex: 0,
      explanationPt: sn.chk1Exp,
    },
    {
      id: `${id}-vchk-2`,
      afterLineIdx: finalBreak,
      question: `Ao concluir "${titlePt}", qual estratégia ajuda a fixar esse diálogo real?`,
      options: sn.chk2Opts,
      correctIndex: 0,
      explanationPt: sn.chk2Exp,
    },
  ];
}

/**
 * @file src/data/grammarDrills.ts
 * @description Banco de exercícios intensivos (drills) gramaticais para os 17 idiomas.
 * @exports GrammarDrillItem, GRAMMAR_DRILLS, getGrammarDrillsByLanguage
 */
import type { CEFRLevel, LanguageCode } from '../types/learning';

export interface GrammarDrillItem {
  id: string;
  languageCode: LanguageCode;
  level: CEFRLevel;
  category: string;
  promptPt: string;
  sentenceBefore: string;
  sentenceAfter: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanationPt: string;
}

type CompactDrill = [
  level: CEFRLevel,
  category: string,
  promptPt: string,
  before: string,
  after: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanationPt: string,
];

function expandDrills(lang: LanguageCode, list: CompactDrill[]): GrammarDrillItem[] {
  return list.map((d, idx) => ({
    id: `drill-${lang}-${idx + 1}`,
    languageCode: lang,
    level: d[0],
    category: d[1],
    promptPt: d[2],
    sentenceBefore: d[3],
    sentenceAfter: d[4],
    options: d[5],
    correctIndex: d[6],
    explanationPt: d[7],
  }));
}

const EN_DRILLS: CompactDrill[] = [
  ['A1', 'Verb To Be', 'Idade em inglês usa verbo TO BE:', 'I ', ' twenty-eight years old.', ['have', 'am', 'has', 'are'], 1, 'Nunca use "have" para idade em inglês; o correto é "I am ... years old".'],
  ['A1', 'Present Simple', 'Terceira pessoa do singular (he/she/it):', 'She ', ' to the office by train every day.', ['go', 'goes', 'going', 'is go'], 1, 'No Present Simple afirmativo, verbos terminados em -o recebem -es para he/she/it.'],
  ['A2', 'Past Simple', 'Negativa no passado simples:', 'We ', ' the flight because of the storm.', ["didn't catch", "didn't caught", 'not caught', "wasn't catch"], 0, 'Após "didn\'t", o verbo principal volta sempre para a forma base (catch).'],
  ['A2', 'Prepositions', 'Dias da semana usam "on":', 'The meeting is scheduled ', ' Monday morning.', ['in', 'at', 'on', 'for'], 2, 'Dias específicos ("Monday", "Friday") exigem a preposição "on".'],
  ['B1', 'Present Perfect', 'Experiência de vida sem tempo definido:', 'I ', ' to Lisbon twice since 2022.', ['went', 'have been', 'was', 'am going'], 1, 'Com "since" e número de vezes até hoje, usa-se Present Perfect ("have been").'],
  ['B1', 'Gerund vs Infinitive', 'Verbos como "enjoy" pedem -ing:', 'They really enjoy ', ' podcasts during breakfast.', ['to listen', 'listening', 'listen', 'listened'], 1, '"Enjoy", "avoid" e "finish" são sempre seguidos de gerúndio (-ing).'],
  ['B1', 'Conditionals', 'Second Conditional (situação hipotética):', 'If I ', ' more time, I would learn Japanese.', ['have', 'had', 'would have', 'having'], 1, 'Na cláusula do "if" da 2ª condicional usamos Past Simple ("had").'],
  ['B2', 'Passive Voice', 'Voz passiva no passado:', 'The bridge ', ' in 1998 by local engineers.', ['was built', 'built', 'has build', 'were built'], 0, 'Singular no passado passivo: "was + particípio passado" (built).'],
  ['B2', 'Modals of Deduction', 'Dedução lógica sobre o passado:', 'She ', ' the early train—her bag is gone.', ['must have taken', 'must take', 'should took', 'can have taken'], 0, 'Certeza sobre o passado usa "must have + past participle".'],
  ['B2', 'Reported Speech', 'Backshift de "can" no discurso indireto:', 'He told me that he ', ' join the call at three.', ['can', 'could', 'will', 'may'], 1, 'Após verbo no passado ("told"), "can" recua para "could".'],
  ['C1', 'Negative Inversion', 'Inversão formal após "Not only":', 'Not only ', ' the deadline, but she also cut costs.', ['she met', 'did she meet', 'met she', 'has she'], 1, 'Expressões negativas no início ("Not only") invertem auxiliar + sujeito ("did she meet").'],
  ['C1', 'Subjunctive', 'Subjuntivo formal após "insist that":', 'The board insisted that the report ', ' published today.', ['is', 'be', 'was', 'being'], 1, 'Após "insist/recommend/suggest that", o subjuntivo formal usa o verbo base ("be").'],
];

const ES_DRILLS: CompactDrill[] = [
  ['A1', 'Ser vs Estar', 'Localização geográfica sempre usa ESTAR:', 'El museo ', ' cerca de la estación central.', ['es', 'está', 'son', 'sea'], 1, 'Para localização física (mesmo permanente), espanhol usa sempre "estar".'],
  ['A1', 'Verbo Gustar', 'Concordância com sujeito plural:', 'Me ', ' mucho las películas españolas.', ['gusta', 'gustan', 'gusto', 'gustas'], 1, 'Quem determina o verbo é "las películas" (plural → "gustan").'],
  ['A2', 'Pretérito Indefinido', 'Forma irregular de "ir/ser" no passado:', 'Ayer nosotros ', ' al mercado de San Miguel.', ['fuimos', 'vamos', 'íbamos', 'hemos ido'], 0, '"Ayer" pede pretérito indefinido: "fuimos" (nós fomos).'],
  ['A2', 'Por vs Para', 'Destinatário ou prazo usa PARA:', 'Este informe es ', ' la directora antes del viernes.', ['por', 'para', 'de', 'con'], 1, 'Destinatário e prazo final usam "para".'],
  ['B1', 'Subjuntivo Presente', 'Desejo com "esperar que":', 'Espero que tú ', ' un excelente viaje.', ['tienes', 'tengas', 'tuviste', 'tendrás'], 1, '"Espero que" exige presente do subjuntivo ("tengas").'],
  ['B1', 'Falsos Amigos', 'Evite o portunhol ("todavía" = ainda):', 'Todavía ', ' esperando la confirmación del hotel.', ['estoy', 'soy', 'tengo', 'hago'], 0, 'Ação em andamento usa "estar + gerúndio".'],
  ['B1', 'Imperfeito vs Indefinido', 'Hábito contínuo no passado:', 'Cuando era niño, siempre ', ' en bicicleta.', ['monté', 'montaba', 'monto', 'he montado'], 1, 'Hábito repetido no passado usa pretérito imperfeito ("montaba").'],
  ['B2', 'Subjuntivo Imperfeito', 'Condicional hipotética ("Si + subjuntivo"):', 'Si ', ' en Madrid, visitaría el Prado cada semana.', ['vivo', 'viviera', 'viviré', 'he vivido'], 1, '"Si + imperfeito do subjuntivo (viviera), condicional (visitaría)".'],
  ['B2', 'Conectores', 'Concessão seguida de subjuntivo:', 'Aunque ', ' difícil, terminaremos el proyecto hoy.', ['sea', 'es', 'fue', 'será'], 0, 'Fato ainda incerto/hipotético após "aunque" pede subjuntivo ("sea").'],
  ['B2', 'Pronombres Clíticos', 'Substituição de "le + lo" para "se lo":', 'Ya ', ' expliqué a Carlos ayer por la tarde.', ['le lo', 'se lo', 'lo le', 'les lo'], 1, 'Em espanhol, "le + lo/la" transforma-se obrigatoriamente em "se lo/la".'],
  ['C1', 'Pluscuamperfecto Subj.', 'Condicional irreal no passado:', 'Si me lo ', ' dicho antes, habría venido.', ['hubieras', 'has', 'habías', 'tuvieras'], 0, '"Si + hubieras + particípio" expressa hipótese não realizada no passado.'],
  ['C1', 'Perífrasis Verbales', 'Mudança após longo esforço ("llegar a"):', 'Con práctica diaria ', ' hablar con total soltura.', ['llegarás a', 'volverás a', 'dejarás de', 'acabarás por'], 0, '"Llegar a + infinitivo" indica alcançar um resultado progressivo.'],
];

const FR_DRILLS: CompactDrill[] = [
  ['A1', 'Articles Partitifs', 'Partitivo antes de substantivo masculino:', 'Je prends ', ' café avec du lait le matin.', ['du', 'de la', 'des', 'le'], 0, '"Café" é masculino e quantidade indeterminada usa partitivo "du".'],
  ['A1', 'Négation', 'Partitivo na negativa vira "de":', 'Il n’y a pas ', ' sucre dans cette tasse.', ['du', 'de', 'des', 'le'], 1, 'Após "ne ... pas", os artigos "du/de la/des" tornam-se "de".'],
  ['A2', 'Passé Composé', 'Verbo de movimento usa auxiliar ÊTRE:', 'Marie ', ' partie très tôt pour Lyon.', ['a', 'est', 'ai', 'avait'], 1, '"Partir" pertence à casa do ÊTRE e concorda no feminino ("partie").'],
  ['A2', 'Pronom Y', 'Substituindo lugar com "à":', 'Tu vas à Paris ? Oui, j’', ' vais demain.', ['en', 'y', 'le', 'lui'], 1, 'Lugar introduzido por "à/en/dans" é substituído por "y".'],
  ['B1', 'Pronom EN', 'Substituindo quantidade ou "de":', 'Tu veux du pain ? Oui, j’', ' veux bien.', ['y', 'en', 'le', 'lui'], 1, 'Partitivo ("du pain") substitui-se pelo pronome "en".'],
  ['B1', 'Subjonctif Présent', 'Obrigatoriedade com "il faut que":', 'Il faut que nous ', ' ce dossier ce soir.', ['finissons', 'finissions', 'finirons', 'finirions'], 1, '"Il faut que" exige o subjuntivo ("finissions").'],
  ['B2', 'Imparfait vs Passé Composé', 'Cenário no passado interrompido por ação:', 'Il ', ' quand je suis sorti de l’hôtel.', ['pleuvait', 'a plu', 'pleut', 'pleuvra'], 0, 'Descrição de fundo no passado usa imparfait ("pleuvait").'],
  ['B2', 'Pronoms Relatifs', 'Substituindo complemento com "de" (dont):', 'Voici le livre ', ' je t’ai parlé hier.', ['que', 'qui', 'dont', 'où'], 2, '"Parler de quelque chose" usa o pronome relativo "dont".'],
  ['B2', 'Conditionnel Passé', 'Arrependimento ou hipótese passada:', 'J’', ' dû vérifier l’horaire du TGV.', ['aurais', 'avais', 'ai', 'aurai'], 0, 'Critica/arrependimento no passado: "aurais dû".'],
  ['C1', 'Connecteurs Logiques', 'Concessão formal seguida de subjuntivo:', 'Bien qu’elle ', ' fatiguée, elle a brillamment répondu.', ['soit', 'est', 'était', 'sera'], 0, '"Bien que" rege obrigatoriamente o subjuntivo ("soit").'],
  ['C1', 'Voix Passive / On', 'Impessoal elegante:', 'On ', ' souvent cette règle à l’oral.', ['oublie', 'oublient', 'est oublié', 'oublions'], 0, 'O pronome "on" conjuga sempre na 3ª pessoa do singular ("oublie").'],
  ['C1', 'Subjonctif Passé', 'Anterioridade após "avant que":', 'Appelle-moi avant qu’il ne ', ' parti.', ['soit', 'est', 'a', 'sera'], 0, '"Avant que" exige subjuntivo (frequentemente com "ne" expletivo).'],
];

const IT_DRILLS: CompactDrill[] = [
  ['A1', 'Articoli Determinativi', 'Antes de "s + consoante" (stazione, studente):', 'Prendo il treno davanti ', ' studente.', ['al', 'allo', 'all’', 'ai'], 1, 'Masculino singular com s+consoante/z usa "lo" (a + lo = "allo").'],
  ['A1', 'Verbo Piacere', 'Concordância com substantivo plural:', 'Mi ', ' molto questi ristoranti romani.', ['piace', 'piacciono', 'piaci', 'piacere'], 1, '"Questi ristoranti" está no plural, portanto "piacciono".'],
  ['A2', 'Passato Prossimo', 'Verbos reflexivos usam ESSERE:', 'Stamattina Giulia ', ' svegliata alle sette.', ['ha', 'è', 'si è', 'si ha'], 2, 'Verbo reflexivo "svegliarsi" usa sempre "essere" + concordância ("svegliata").'],
  ['A2', 'Preposizioni Articolate', 'Combinação "in + la":', 'Lavoro ', ' biblioteca centrale ogni venerdì.', ['nella', 'in la', 'alla', 'dalla'], 0, '"in + la" contrai-se obrigatoriamente em "nella".'],
  ['B1', 'Particella CI', 'Substituindo lugar já citado:', 'Sei mai stato a Venezia? Sì, ', ' sono stato due volte.', ['ne', 'ci', 'lo', 'li'], 1, 'Para substituir um lugar ("a Venezia"), usa-se "ci".'],
  ['B1', 'Particella NE', 'Substituindo quantidade ("di"):', 'Quanti caffè bevi? ', ' bevo due al giorno.', ['Ci', 'Ne', 'Li', 'Lo'], 1, 'Quantidade explícita ("due") exige o pronome partitivo "ne".'],
  ['B2', 'Congiuntivo Presente', 'Opinião com "penso che":', 'Penso che Marco ', ' ragione su questo punto.', ['ha', 'abbia', 'aveva', 'avrà'], 1, '"Penso che" / "credo che" pedem congiuntivo ("abbia").'],
  ['B2', 'Periodo Ipotetico', '2º tipo (possibilità):', 'Se ', ' più tempo, studierei anche il violino.', ['avessi', 'ho', 'avrei', 'ebbi'], 0, '"Se + congiuntivo imperfetto (avessi), condizionale (studierei)".'],
  ['B2', 'Pronomi Combinati', '"mi + lo" vira "me lo":', 'Hai il biglietto? Sì, ', ' puoi dare subito.', ['mi lo', 'me lo', 'te lo', 'glie lo'], 1, 'Antes de lo/la/li/le/ne, "mi" transforma-se em "me".'],
  ['C1', 'Congiuntivo Trapassato', '3º tipo (hipótese passada irreal):', 'Se me lo ', ' detto prima, sarei venuto.', ['avessi', 'avevi', 'avresti', 'hai'], 0, '"Se + congiuntivo trapassato (avessi detto)".'],
  ['C1', 'Forma Passiva con Venire', 'Passivo dinâmico no presente:', 'Le domande ', ' valutate dalla commissione ogni lunedì.', ['vengono', 'sono state', 'hanno', 'fanno'], 0, '"Venire + participio" enfatiza a ação contínua na voz passiva.'],
  ['C1', 'Connettivi Formali', '"Benché" rege congiuntivo:', 'Benché ', ' tardi, abbiamo completato l’analisi.', ['fosse', 'era', 'è', 'sarà'], 0, '"Benché" / "sebbene" pedem sempre o congiuntivo.'],
];

const DE_DRILLS: CompactDrill[] = [
  ['A1', 'Wortstellung V2', 'Verbo conjugado sempre na 2ª posição:', 'Heute ', ' ich Deutsch mit meinem Lehrer.', ['lerne', 'lernen', 'lernst', 'ich lerne'], 0, 'Quando a frase começa com advérbio ("Heute"), o verbo fica em 2º lugar e o sujeito vai depois.'],
  ['A1', 'Akkusativ', 'Artigo masculino no acusativo (objeto direto):', 'Ich trinke jeden Morgen ', ' schwarzen Kaffee.', ['der', 'den', 'dem', 'ein'], 1, 'Objeto direto masculino ("Kaffee") pede acusativo: "den".'],
  ['A2', 'Dativ', 'Preposição "mit" rege sempre Dativo:', 'Ich fahre morgen mit ', ' Zug nach München.', ['der', 'den', 'dem', 'die'], 2, '"mit" pede Dativo; "der Zug" torna-se "dem Zug".'],
  ['A2', 'Perfekt (Haben/Sein)', 'Verbo de deslocamento usa SEIN:', 'Gestern ', ' wir früh nach Berlin gefahren.', ['haben', 'sind', 'waren', 'werden'], 1, '"fahren" indica movimento A→B, usando o auxiliar "sind".'],
  ['B1', 'Nebensatz (weil)', 'Conjunção "weil" joga o verbo para o final:', 'Ich bleibe zu Hause, weil ich heute arbeiten ', '.', ['muss', 'müsse', 'musste ich', 'müssen'], 0, 'Em orações subordinadas com "weil/dass", o verbo conjugado vai para o fim.'],
  ['B1', 'Wechselpräpositionen', 'Posição estática ("wo?") = Dativo:', 'Das Buch liegt auf ', ' Tisch im Wohnzimmer.', ['der', 'den', 'dem', 'des'], 2, 'Repouso ("liegt") pede Dativo: "auf dem Tisch".'],
  ['B2', 'Konjunktiv II', 'Pedido polido / hipótese:', 'Ich ', ' gern ein ruhiges Zimmer mit Balkon.', ['hätte', 'habe', 'hatte', 'werde'], 0, '"Ich hätte gern..." é a forma educada padrão no Konjunktiv II.'],
  ['B2', 'Relativsätze', 'Pronome relativo masculino no Dativo:', 'Das ist der Kollege, mit ', ' ich zusammengearbeitet habe.', ['der', 'den', 'dem', 'dessen'], 2, '"mit" pede Dativo; referente masculino = "dem".'],
  ['B2', 'Passiv (Vorgangspassiv)', 'Voz passiva com "werden":', 'Die neue App ', ' nächste Woche veröffentlicht.', ['wird', 'hat', 'ist worden', 'wurden'], 0, 'Passiva no presente/futuro usa "wird + Partizip II".'],
  ['C1', 'Genitivpräpositionen', '"Aufgrund / Während" pedem Genitivo:', 'Aufgrund ', ' starken Regens fiel das Konzert aus.', ['des', 'dem', 'den', 'der'], 0, '"Regen" é masculino no Genitivo → "des starken Regens".'],
  ['C1', 'Nominalisierung', 'Transformando oração em sintagma nominal:', 'Nach ', ' des Vertrags begannen wir sofort.', ['Unterzeichnung', 'unterzeichnen', 'unterzeichnet', 'Unterzeichnens'], 0, 'Após preposição ("Nach"), usa-se o substantivo ("Unterzeichnung").'],
  ['C1', 'Partizipialattribut', 'Particípio I funcionando como adjetivo:', 'Die ', ' Zahlen zeigen einen klaren Trend.', ['steigenden', 'gestiegen', 'steigen', 'steigt'], 0, 'Ação em curso como adjetivo usa Partizip I ("steigenden").'],
];

const RU_DRILLS: CompactDrill[] = [
  ['A1', 'Падеж 6 (Предложный)', 'Localização estática com "в":', 'Моя сестра сейчас работает в ', '.', ['Москва', 'Москву', 'Москве', 'Москвой'], 2, 'Após "в" (onde?), substantivos em -а vão para o Prepositivo (-е): "в Москве".'],
  ['A1', 'Падеж 4 (Винительный)', 'Objeto direto feminino (-а → -у):', 'Я читаю очень интересную ', '.', ['книга', 'книгу', 'книге', 'книги'], 1, 'No Acusativo, "книга" transforma-se em "книгу".'],
  ['A2', 'Падеж 2 (Родительный)', 'Ausência com "у меня нет":', 'К сожалению, у меня сейчас нет ', '.', ['время', 'времени', 'временем', 'времена'], 1, '"нет" exige sempre Genitivo; "время" → "времени".'],
  ['A2', 'Прошедшее время', 'Concordância de gênero no passado:', 'Вчера Анна поздно ', ' домой.', ['пришёл', 'пришла', 'пришло', 'пришли'], 1, 'O passado em russo concorda com o gênero do sujeito (Анна → пришла).'],
  ['B1', 'Вид глагола (НСВ/СВ)', 'Ação concluída única (Perfectivo):', 'Вчера я наконец ', ' это длинное письмо.', ['писал', 'написал', 'пишу', 'буду писать'], 1, 'Ação concluída com resultado usa o aspecto perfectivo ("написал").'],
  ['B1', 'Падеж 3 (Дательный)', 'Destinatário após "помогать/сказать":', 'Я хочу позвонить ', ' сегодня вечером.', ['друг', 'другу', 'друга', 'другом'], 1, 'Destinatário indireto pede Dativo: "друг" → "другу".'],
  ['B2', 'Падеж 5 (Творительный)', 'Profissão após "работать / стать":', 'Мой брат работает ', ' в крупной компании.', ['инженер', 'инженеру', 'инженером', 'инженера'], 2, 'Após "работать / стать / быть (no passado)", usa-se Instrumental (-ом/-ем).'],
  ['B2', 'Глаголы движения', 'Deslocamento com veículo ("ехать/поехать"):', 'Летом мы часто ', ' на поезде к морю.', ['ходим', 'ездим', 'идём', 'едем'], 1, 'Viagens repetidas de veículo usam "ездить" ("мы ездим").'],
  ['B2', 'Сослагательное (бы)', 'Hipótese com "если бы":', 'Если бы у меня было время, я ', ' с вами.', ['пошёл', 'пошёл бы', 'пойду', 'иду'], 1, 'A oração principal na condicional hipotética leva a partícula "бы".'],
  ['C1', 'Причастия (Particípios)', 'Particípio ativo presente:', 'Люди, ', ' этот проект, работают круглосуточно.', ['создающие', 'создавшие', 'созданы', 'создавать'], 0, 'Sujeito plural praticando ação presente usa "-ющие" ("создающие").'],
  ['C1', 'Деепричастия', 'Gerúndio adverbial ("ao terminar"):', '', ' отчёт, она отправила его руководителю.', ['Закончив', 'Закончить', 'Закончила', 'Законченный'], 0, 'Ação anterior do mesmo sujeito usa gerúndio perfectivo ("Закончив").'],
  ['C1', 'Управление глаголов', 'Preposição + Instrumental com "согласен":', 'Мы полностью согласны с ', ' выводами.', ['ваши', 'ваших', 'вашими', 'вашим'], 2, '"согласен с" pede Instrumental (plural: "вашими выводами").'],
];

const JA_DRILLS: CompactDrill[] = [
  ['A1', '助詞 は / を', 'Marcador de objeto direto (を):', '毎朝、コーヒー', '飲みます。', ['は', 'が', 'を', 'に'], 2, '"を" (o) marca o objeto direto da ação ("beber café").'],
  ['A1', '助詞 に / で', 'Local onde ocorre uma ação (で):', '図書館', '日本語を勉強しています。', ['に', 'で', 'へ', 'を'], 1, 'Quando há ação ativa num lugar ("estudar na biblioteca"), usa-se "で".'],
  ['A2', 'て形 (Te-form)', 'Pedido educado (~てください):', 'すみません、ここに名前を', 'ください。', ['書いて', '書きます', '書いた', '書かない'], 0, 'Para pedir algo educadamente, usa-se forma て + ください ("書いてください").'],
  ['A2', 'い形容詞の過去', 'Passado negativo de adjetivo -i:', '昨日のテストは難し', 'です。', ['くなかった', 'じゃなかった', 'くない', 'かった'], 0, 'Adjetivos -i trocam い por くなかった no passado negativo.'],
  ['B1', '受け身・経験 (~たことがある)', 'Experiência passada:', '北海道へ行った', 'がありますか。', ['こと', 'もの', 'とき', 'ところ'], 0, '"Verbo na forma た + ことがある" expressa "já ter feito algo".'],
  ['B1', '自動詞 vs 他動詞', 'Verbo intransitivo com が:', 'ドアが', 'います。', ['開けて', '開いて', '開く', '開け'], 1, '"ドアが開いている" usa intransitivo 開く para descrever estado resultante.'],
  ['B2', '敬語 (尊敬語)', 'Forma honorífica de "ir/vir/estar":', '社長はもうお帰り', 'なりましたか。', ['に', 'を', 'が', 'へ'], 0, 'Estrutura honorífica padrão: "お + raiz do verbo + になる".'],
  ['B2', '条件形 (ば / たら)', 'Condicional natural com たら:', '駅に着い', '、電話してください。', ['たら', 'なら', 'ば', 'と'], 0, 'Sequência temporal "quando chegar na estação" usa forma た + ら.'],
  ['B2', '推量 (~はずだ)', 'Expectativa lógica:', '彼はもうすぐ到着する', 'です。', ['はず', 'わけ', 'もの', 'こと'], 0, '"はずだ" indica expectativa baseada em evidência lógica.'],
  ['C1', '逆接 (~にもかかわらず)', 'Concessão formal:', '悪天候', '、イベントは予定通り開催された。', ['にもかかわらず', 'によって', 'にとって', 'について'], 0, '"にもかかわらず" significa "apesar de" em registro formal/jornalístico.'],
  ['C1', '使役受け身', 'Ser obrigado a fazer algo:', '新人の頃、毎日残業', '。', ['させられた', 'させた', 'された', 'できた'], 0, 'Causativo-passivo ("させられる") expressa obrigação imposta por terceiros.'],
  ['C1', '文末表現 (~ざるを得ない)', 'Não ter outra escolha senão:', '予算不足のため、計画を変更せ', '。', ['ざるを得ない', 'わけにはいかない', 'かねない', 'に違いない'], 0, '"〜ざるを得ない" significa "não há alternativa senão...".'],
];

const ZH_DRILLS: CompactDrill[] = [
  ['A1', '量词 (Classificadores)', 'Classificador geral 个 vs 本 (livros):', '我买了两', '中文书。', ['个', '本', '张', '杯'], 1, 'Livros e cadernos usam obrigatoriamente o classificador "本 (běn)".'],
  ['A1', '否定 (不 vs 没)', 'Negação de posse com 有:', '我今天', '有时间去银行。', ['不', '没', '别', '非'], 1, 'O verbo 有 (ter/haver) é SEMPRE negado com "没", nunca com "不".'],
  ['A2', '了 (Completivo)', 'Ação concluída no passado:', '昨天晚上我看', '一部电影。', ['了', '着', '过', '的'], 0, '"了" logo após o verbo indica conclusão do evento.'],
  ['A2', '比 (Comparativo)', 'Estrutura de comparação com 比:', '坐地铁', '坐公共汽车快得多。', ['比', '跟', '和', '像'], 0, '"A 比 B + adjetivo" compara A e B diretamente.'],
  ['B1', '把字句 (Estrutura 把)', 'Deslocando o objeto antes do verbo:', '请', '你的护照放在桌子上。', ['把', '被', '让', '给'], 0, '"把 + objeto + verbo + resultado" enfatiza o manuseio do objeto.'],
  ['B1', '结果补语', 'Complemento de resultado ("ver claramente"):', '黑板上的字我看不', '。', ['清楚', '好', '完', '到'], 0, '"看不清楚" = não consigo enxergar com clareza.'],
  ['B2', '被字句 (Passiva)', 'Voz passiva indicando impacto:', '我的自行车', '人借走了。', ['被', '把', '向', '对'], 0, '"被 + agente + verbo" forma a voz passiva em mandarim.'],
  ['B2', '关联词 (不但…而且…)', 'Estrutura correlativa aditiva:', '这个软件不但免费，', '操作非常简单。', ['而且', '但是', '所以', '虽然'], 0, '"不但..., 而且..." equivale a "não só..., mas também...".'],
  ['B2', '趋势补语', 'Complemento direcional metafórico ("lembrar-se"):', '我想', '他的名字了！', ['起来', '下去', '出来', '过来'], 0, '"想起来" significa recuperar uma memória repentinamente.'],
  ['C1', '书面语 (以…为主)', 'Registro formal / empresarial:', '本次会议将', '讨论明年预算为主。', ['以', '用', '拿', '按'], 0, '"以 X 为主" significa "ter X como foco principal".'],
  ['C1', '成语 (Idiomática)', 'Expressão de 4 caracteres ("de uma vez só"):', '这个问题必须', '地解决，不能拖延。', ['一针见血', '画蛇添足', '马马虎虎', '半途而废'], 0, '"一针见血" (ir direto ao ponto/raiz do problema).'],
  ['C1', '正式转折 (然而)', 'Contraste elegante em textos C1:', '方案看似完美，', '实际执行难度很大。', ['然而', '于是', '因此', '况且'], 0, '"然而" é o conector adversativo formal equivalente a "contudo".'],
];

const AR_DRILLS: CompactDrill[] = [
  ['A1', 'الجملة الاسمية', 'Pronome + adjetivo masculino:', 'أنا ', ' بالسفر إلى القاهرة.', ['سعيد', 'سعيدة', 'سعداء', 'سعيدون'], 0, 'Adjetivo predicativo masculino singular permanece indefinido: "سعيد".'],
  ['A1', 'الإضافة (Possessivo)', 'Estrutura de posse sem "ال" no primeiro termo:', 'هذا ', ' المدير الجديد.', ['مكتب', 'المكتب', 'مكتباً', 'المكتبُ'], 0, 'O primeiro substantivo da Idāfa ("مكتب المدير") nunca leva artigo "ال".'],
  ['A2', 'الفعل الماضي', 'Conjugação na 1ª pessoa do plural (نحن):', 'أمس ', ' إلى المتحف الوطني.', ['ذهبنا', 'ذهبتُ', 'يذهبون', 'تذهب'], 0, 'O sufixo "-نا" indica 1ª pessoa do plural no passado ("ذهبنا").'],
  ['A2', 'النفي (لم / لن)', 'Negação do futuro com "لن":', 'غداً ', ' أستطيع الحضور مبكراً.', ['لن', 'لم', 'ما', 'ليس'], 0, 'Para negar ações futuras em árabe padrão usa-se "لن" + subjuntivo.'],
  ['B1', 'إنّ وأخواتها', '"إنّ" coloca o sujeito no acusativo:', 'إنّ ', ' مفيد جداً للطلاب.', ['الكتابَ', 'الكتابُ', 'الكتابِ', 'كتابٍ'], 0, '"إنّ" transforma o caso do sujeito em Mansūb (-َ): "الكتابَ".'],
  ['B1', 'الاسم الموصول', 'Pronome relativo feminino singular:', 'الرسالة ', ' وصلت اليوم مهمة.', ['التي', 'الذي', 'الذين', 'اللواتي'], 0, 'Feminino singular ("الرسالة") exige "التي".'],
  ['B2', 'المبني للمجهول', 'Voz passiva no passado (فُعِلَ):', '', ' التقريرُ النهائي في الصباح.', ['كُتِبَ', 'كَتَبَ', 'يكتب', 'كاتب'], 0, 'Voz passiva no passado vocaliza em "u-i": "كُتِبَ التقريرُ".'],
  ['B2', 'أدوات الشرط', 'Condicional formal ("إذا"): ', 'إذا ', ' الوقتُ، سنزور المكتبة.', ['سمحَ', 'يسمحُ', 'اسمحْ', 'سماح'], 0, 'Após "إذا" usa-se geralmente o verbo no passado com sentido futuro.'],
  ['B2', 'التمييز والمعدود', 'Contagem de 11 a 99 exige singular acusativo:', 'قرأتُ عشرين ', ' هذا العام.', ['صفحةً', 'صفحاتٍ', 'صفحةُ', 'صفحتان'], 0, 'Após dezenas (20 = عشرين), o substantivo vem no singular acusativo ("صفحةً").'],
  ['C1', 'الاستثناء (إلا)', 'Exceção afirmativa completa:', 'حضر الضيوفُ كلهم إلا ', '.', ['ضضيفاً', 'ضيفٍ', 'ضيفاً', 'ضيفُ'], 2, 'Em exceção positiva, o termo após "إلا" fica em acusativo ("ضيفاً").'],
  ['C1', 'المصدر الصريح', 'Substantivo verbal (Maṣdar):', 'يهدف المشروع إلى ', ' جودة التعليم.', ['تحسينِ', 'يحسّن', 'حسّنَ', 'محسّن'], 0, 'Após preposição "إلى", usa-se o maṣdar no genitivo ("تحسينِ").'],
  ['C1', 'الحال (Estado)', 'Advérbio circunstancial no acusativo:', 'عاد المسافرُ إلى وطنه ', '.', ['سالماً', 'سالمٌ', 'سالمٍ', 'سلام'], 0, 'O Ḥāl ("como voltou?") é sempre indefinido e acusativo ("سالماً").'],
];

const NL_DRILLS: CompactDrill[] = [
  ['A1', 'De vs Het', 'Artigo definido neutro ("huis"): ', '', ' huis staat naast het station.', ['Het', 'De', 'Een', 'Deze'], 0, '"Huis" é substantivo neutro em holandês, portanto usa "Het".'],
  ['A1', 'V2-woordvolgorde', 'Inversão após expressão de tempo:', 'Morgen ', ' ik met de trein naar Utrecht.', ['ga', 'ik ga', 'gaat', 'gaan'], 0, 'Com "Morgen" no início, o verbo fica na 2ª posição ("ga ik").'],
  ['A2', 'Perfectum', 'Verbo de movimento usa ZIJN:', 'Gisteren ', ' wij naar Amsterdam gefietst.', ['zijn', 'hebben', 'werden', 'doen'], 0, '"Fietsen" com destino definido usa auxiliar "zijn".'],
  ['A2', 'Scheidbare Werkwoorden', 'Verbo separável "opbellen":', 'Ik ', ' mijn collega vanmiddag even op.', ['bel', 'opbel', 'bellen', 'belde op'], 0, 'No presente, o prefixo "op" vai para o final da frase.'],
  ['B1', 'Er-constructies', 'Existencial ("Há muito café"): ', '', ' is genoeg koffie in de keuken.', ['Er', 'Het', 'Daar', 'Hier'], 0, 'Frases existenciais sem sujeito definido começam com "Er".'],
  ['B1', 'Bijzin (omdat)', '"Omdat" envia o verbo ao final:', 'Ik neem een paraplu mee, omdat het vandaag ', '.', ['regent', 'regen', 'regende ik', 'gaat'], 0, 'Em subordinadas com "omdat", o verbo conjugado vai para o fim.'],
  ['B2', 'Lijdende Vorm', 'Voz passiva presente ("worden"): ', 'De contracten ', ' vandaag ondertekend.', ['worden', 'zijn', 'hebben', 'gaan'], 0, 'Passiva de processo no presente usa "worden + voltooid deelwoord".'],
  ['B2', 'Zou / Zouden', 'Pedido educado ou hipótese:', '', ' u dat nog een keer kunnen herhalen?', ['Zou', 'Zal', 'Heeft', 'Wordt'], 0, 'Para pedidos polidos usa-se "Zou u ... kunnen ...?".'],
  ['B2', 'Betrekkelijk Voornaamwoord', '"Het-woord" usa "dat":', 'Dit is het rapport ', ' ik gisteren schreef.', ['dat', 'die', 'wat', 'wie'], 0, 'Referente neutro ("het rapport") usa pronome relativo "dat".'],
  ['C1', 'Er + Prepositie', 'Substituindo "aan + iets" ("eraan"): ', 'Ik heb daar eerlijk gezegd nooit ', ' gedacht.', ['aan', 'op', 'in', 'over'], 0, '"Daar ... aan" separa o pronome da preposição "aan".'],
  ['C1', 'Te + Infinitief', '"Zonder te" + infinitivo:', 'Hij vertrok zonder iets ', ' zeggen.', ['te', 'om', 'aan', 'voor'], 0, '"Zonder + (object) + te + infinitivo" não usa "om".'],
  ['C1', 'Formele Connectoren', '"Desondanks" com inversão V2:', 'Het budget was krap; desondanks ', ' het team resultaat.', ['boekte', 'het team boekte', 'boeken', 'geboekt'], 0, '"Desondanks" no início da oração provoca inversão V2.'],
];

const AF_DRILLS: CompactDrill[] = [
  ['A1', 'Dubbele Ontkenning', 'Negativa dupla obrigatória (nie ... nie):', 'Ek praat nie Duits ', '.', ['nie', 'geen', 'nooit', 'niks'], 0, 'A negativa em africâner exige o segundo "nie" no final da oração.'],
  ['A1', 'STOMPI-reël', 'Ordem Tempo-Objeto-Maneira-Lugar:', 'Sy drink ', ' in die kombuis koffie.', ['nou', 'koffie', 'drink', 'nie'], 0, 'Na regra STOMPI, o tempo ("nou") vem logo após o verbo 1.'],
  ['A2', 'Verlede Tyd (het + ge-)', 'Passado regular com "het ... ge-":', 'Ons ', ' gister na die see gery.', ['het', 'is', 'was', 'sal'], 0, 'Quase todos os verbos em africâner usam auxiliar "het" + "ge-".'],
  ['A2', 'Toekomende Tyd', 'Futuro com "sal":', 'Môre ', ' ek vroeg begin werk.', ['sal', 'het', 'was', 'kan'], 0, 'O futuro simples forma-se com "sal" + infinitivo no fim.'],
  ['B1', 'Skeibare Werkwoorde', 'Verbo separável "opstaan":', 'Hy ', ' elke oggend om ses uur op.', ['staan', 'opstaan', 'gestaan', 'sal'], 0, 'No presente, o prefixo "op" vai para o final da oração.'],
  ['B1', 'Voegwoorde (omdat)', 'Subordinada com "omdat" envia o verbo ao fim:', 'Ons bly tuis omdat dit hard ', '.', ['reën', 'gereën', 'sal', 'is'], 0, 'Após "omdat", o verbo vai para o final da frase.'],
  ['B2', 'Lydende Vorm', 'Voz passiva presente ("word"): ', 'Die verslag ', ' elke week bygewerk.', ['word', 'is', 'het', 'was'], 0, 'Passiva presente usa "word + ge-"; passado usa "is + ge-".'],
  ['B2', 'Voorwaardelik (as ... sou)', 'Condicional hipotética:', 'As ek meer tyd gehad het, ', ' ek langer gebly het.', ['sou', 'sal', 'het', 'kan'], 0, 'A oração principal hipotética usa "sou ... het".'],
  ['B2', 'Betreklike Voornaamwoord', 'Pronome relativo "wat":', 'Die boek ', ' jy lees, is baie gewild.', ['wat', 'wie', 'dat', 'waar'], 0, 'Em africâner, "wat" serve para pessoas e coisas como relativo.'],
  ['C1', 'Dubbele Infinitief', 'Expressão com "om te":', 'Dit is belangrik om elke dag ', ' oefen.', ['te', 'ge-', 'vir', 'aan'], 0, '"om ... te + infinitivo" equivale a "para + infinitivo".'],
  ['C1', 'Onpersoonlike "daar"', 'Impessoal formal:', '', ' word verwag dat die ekonomie sal groei.', ['Daar', 'Dit', 'Hier', 'Wat'], 0, '"Daar word verwag..." equivale a "Espera-se que...".'],
  ['C1', 'Formele Styl', 'Uso de "desnieteenstaande" (apesar disso):', 'Die weer was sleg; desnieteenstaande ', ' die span voortgegaan.', ['het', 'is', 'was', 'sal'], 0, '"Desnieteenstaande" é seguido diretamente pelo verbo auxiliar ("het").'],
];

const SV_DRILLS: CompactDrill[] = [
  ['A1', 'V2-regeln', 'Verbo sempre na 2ª posição:', 'I dag ', ' jag svenska med en vän.', ['studerar', 'studera', 'jag studerar', 'studerade'], 0, 'Com advérbio no início ("I dag"), o verbo fica em 2º ("studerar jag").'],
  ['A1', 'En vs Ett', 'Substantivo neutro ("ett hus"): ', 'Det är ', ' stort och ljust rum.', ['en', 'ett', 'den', 'det'], 1, '"Rum" é ett-ord neutro; logo o artigo indefinido é "ett".'],
  ['A2', 'Bestämd Form', 'Artigo definido como sufixo (-en/-et):', 'Jag köpte ', ' i bokhandeln igår.', ['boken', 'en bok', 'boket', 'boker'], 0, '"En bok" definida vira "boken" (sufixo -en).'],
  ['A2', 'BIFF-regeln', 'Em subordinadas ("att/om/eftersom"), "inte" vem ANTES do verbo:', 'Hon sa att hon ', ' kan komma idag.', ['inte', 'kan inte', 'aldrig inte', 'ej kan'], 0, 'Regra BIFF: I bisats kommer "inte" före första verbet!'],
  ['B1', 'Perfekt (har + supinum)', 'Uso do supino após "har":', 'Vi ', ' redan skickat mejlet till kunden.', ['har', 'är', 'hade', 'ska'], 0, 'O tempo perfeito em sueco usa sempre "har" + supino (-at/-t/-it).'],
  ['B1', 'Sin / Sitt / Sina', 'Possessivo reflexivo referente ao sujeito:', 'Erik tog ', ' egen jacka och gick hem.', ['sin', 'hans', 'sitt', 'sina'], 0, 'Quando o possuidor é o próprio sujeito da oração (Erik), usa-se "sin/sitt/sina".'],
  ['B2', 'Passiv form (-s)', 'Voz passiva sintética com -s:', 'Dörrarna ', ' klockan nio varje morgon.', ['öppnas', 'öppnar', 'öppnade', 'är öppna'], 0, 'Passiva geral ou habitual em sueco adiciona -s ao verbo ("öppnas").'],
  ['B2', 'Konjunktiv / Skulle', 'Hipótese condicional:', 'Om jag ', ' mer tid, skulle jag resa oftare.', ['hade', 'har', 'skulle ha', 'haft'], 0, '"Om + preteritum (hade), skulle + infinitiv".'],
  ['B2', 'Partikelverb', 'Verbo com partícula tônica ("tycka om"): ', 'Jag tycker verkligen ', ' att bo i Stockholm.', ['om', 'på', 'av', 'till'], 0, '"Tycka om" significa "gostar de".'],
  ['C1', 'Presens Particip', 'Advérbio/adjetivo em -ande/-ende:', 'Vi fick ett ', ' besked från styrelsen.', ['glädjande', 'glädjas', 'glatt', 'glädje'], 0, 'Verbos terminados em -a formam particípio presente com "-ande".'],
  ['C1', 'Formell Bisats', '"Trots att" segue a regra BIFF:', 'Trots att han ', ' hade förberett sig, gick det bra.', ['inte', 'hade inte', 'ej', 'aldrig'], 0, 'Em subordinada iniciada por "Trots att", "inte" precede o auxiliar "hade".'],
  ['C1', 'S-passiv i Preteritum', 'Passiva no passado:', 'Avtalet ', ' av båda parter i fredags.', ['undertecknades', 'undertecknade', 'undertecknas', 'har undertecknat'], 0, 'Passado passivo sintético termina em "-ades/-des/-tes".'],
];

const TR_DRILLS: CompactDrill[] = [
  ['A1', 'Ünlü Uyumu (Harmonia Vocálica)', 'Locativo correto após "İstanbul":', 'Ben İstanbul’', ' yaşıyorum.', ['da', 'de', 'ta', 'te'], 0, 'A última vogal de "İstanbul" é "u" (posterior), logo o sufixo locativo é "-da".'],
  ['A1', 'Şimdiki Zaman (-iyor)', 'Presente contínuo na 1ª pessoa do singular:', 'Şimdi Türkçe kitap oku', '.', ['yorum', 'yorsun', 'yor', 'yoruz'], 0, 'Raiz "oku-" + "-yor" + sufixo pessoal "-um" = "okuyorum".'],
  ['A2', 'Belirtme Durumu (Acusativo)', 'Objeto direto definido ("o livro"):', 'Dün bu kitab', ' bitirdim.', ['ı', 'i', 'u', 'ü'], 0, 'Em "kitab-" (k->b por abrandamento, última vogal "a"), o acusativo é "-ı" ("kitabı").'],
  ['A2', 'Gelecek Zaman (-ecek/-acak)', 'Futuro na 1ª pessoa do plural:', 'Yarın İzmir’e gid', '.', ['eceğiz', 'iyoruz', 'dik', 'eriz'], 0, '"git-" abranda para "gid-" antes de vogal; com "e" anterior, usa-se "-eceğiz".'],
  ['B1', 'Sıfat-Fiil (-dik)', 'Particípio relativo ("o filme que assistimos"):', 'Dün akşam ', ' film çok güzeldi.', ['izlediğimiz', 'izlemek', 'izleyeceğiz', 'izler'], 0, 'Para orações relativas no passado/presente usa-se "-dik + possessivo" ("izlediğimiz").'],
  ['B1', 'Edatlar (-a rağmen)', 'Concessão ("apesar da chuva"):', 'Yağmura ', ' yürüyüşe çıktık.', ['rağmen', 'göre', 'kadar', 'doğru'], 0, 'Dativo + "rağmen" equivale a "apesar de".'],
  ['B2', 'Edilgen Çatı (Passiva)', 'Voz passiva no futuro:', 'Yeni proje gelecek ay ', '.', ['başlatılacak', 'başlatacak', 'başlamış', 'başlıyor'], 0, 'Passiva de "başlatmak" adiciona "-ıl-" antes do tempo: "başlatılacak".'],
  ['C1', 'Dolaylı Anlatım (-eceğini)', 'Discurso indireto futuro:', 'Müdür, toplantının yarın yapıl', ' söyledi.', ['acağını', 'dığı', 'makla', 'dıkça'], 0, 'Em discurso indireto com referência futura usa-se "-acağını/-eceğini".'],
];

const HE_DRILLS: CompactDrill[] = [
  ['A1', 'ה׳ הידיעה (Artigo Definido)', 'Artigo definido "o livro grande":', 'אני קורא את ', ' הגדול.', ['הספר', 'ספר', 'לספר', 'בספר'], 0, 'Em hebraico, tanto o substantivo quanto o adjetivo recebem "ה" quando definidos ("הספר הגדול").'],
  ['A1', 'זמן הווה (Presente)', 'Concordância feminino singular:', 'שרה ', ' עברית כל יום.', ['לומדת', 'לומד', 'לומדים', 'לומדות'], 0, 'Sujeito feminino singular (שרה) exige particípio feminino ("לומדת").'],
  ['A2', 'מילת היחס "את"', 'Marcador de objeto direto definido:', 'ראיתי ', ' הסרט החדש אתמול.', ['את', 'אל', 'על', 'של'], 0, 'Objeto direto definido ("הסרט החדש") exige obrigatoriamente a partícula "את".'],
  ['A2', 'זמן עתיד (Futuro)', 'Futuro na 1ª pessoa do plural (אנחנו):', 'מחר אנחנו ', ' לירושלים.', ['ניסע', 'נסענו', 'נוסעים', 'נוסע'], 0, '1ª pessoa do plural no futuro começa com prefixo נ ("ניסע").'],
  ['B1', 'סמיכות (Estado Construto)', 'Construção "estação de trem":', '', ' בתל אביב חדשה מאוד.', ['תחנת הרכבת', 'התחנה רכבת', 'תחנה הרכבת', 'התחנת רכבת'], 0, 'No Smikhut, o primeiro substantivo perde o artigo ה e muda ת final ("תחנת הרכבת").'],
  ['B1', 'מילות קישור (למרות ש)', 'Concessão ("apesar de que"):', 'יצאנו לטיול ', ' היה קר.', ['למרות ש', 'כדי ש', 'מפני ש', 'לפיכך'], 0, '"למרות ש..." introduz uma oração concessiva ("apesar de que").'],
  ['B2', 'בניין סביל (Voz Passiva)', 'Passiva no futuro feminino:', 'ההחלטה הסופית ', ' בשבוע הבא.', ['תתקבל', 'תקבל', 'קיבלה', 'מקבלת'], 0, 'Hitpa‘el / Nif‘al com sentido passivo futuro para feminino ("ההחלטה"): "תתקבל".'],
  ['C1', 'משלב גבוה (קישור)', 'Conector formal de contraste:', 'התקציב היה מוגבל; ', ', הפרויקט הצליח.', ['אף על פי כן', 'לפיכך', 'משום כך', 'יתר על כן'], 0, '"אף על פי כן" é o conector formal C1 equivalente a "não obstante / ainda assim".'],
];

const NB_DRILLS: CompactDrill[] = [
  ['A1', 'V2-regelen', 'Verbo sempre na 2ª posição:', 'I dag ', ' jeg norsk på kafeen.', ['studerer', 'studere', 'jeg studerer', 'studerte'], 0, 'Com advérbio no início ("I dag"), o verbo conjugado vem na 2ª posição ("studerer jeg").'],
  ['A1', 'En / Ei / Et', 'Substantivo neutro ("ett hus"): ', 'Det er ', ' stort og fint hus.', ['et', 'en', 'ei', 'den'], 0, '"Hus" é neutro em Bokmål; o artigo indefinido é "et".'],
  ['A2', 'Bestemt Form', 'Substantivo definido com sufixo:', 'Jeg kjøpte ', ' i bokhandelen i går.', ['boken', 'en bok', 'boket', 'bøker'], 0, '"En bok" definida recebe sufixo "-en" ("boken" ou "boka").'],
  ['A2', 'Leddsetning (ikke før verb)', 'Em subordinadas, "ikke" vem ANTES do verbo:', 'Hun sa at hun ', ' komme i dag.', ['ikke kan', 'kan ikke', 'aldrig ikke', 'ei kan'], 0, 'Em subordinadas norueguesas ("at/fordi/hvis"), "ikke" precede o verbo ("ikke kan").'],
  ['B1', 'Sin / Sitt / Sine', 'Possessivo reflexivo referente ao sujeito:', 'Henrik tok ', ' egen jakke og gikk.', ['sin', 'hans', 'sitt', 'sine'], 0, 'Quando o possuidor é o sujeito (Henrik) e "jakke" é masculino/feminino singular, usa-se "sin".'],
  ['B1', 'Presens Perfektum', 'Auxiliar "har" + particípio:', 'Vi ', ' allerede sendt e-posten.', ['har', 'er', 'hadde', 'skal'], 0, 'O perfeito de ação usa "har" + particípio passado ("har sendt").'],
  ['B2', 'S-passiv', 'Voz passiva habitual com -s:', 'Dørene ', ' klokken ni hver morgen.', ['åpnes', 'åpner', 'åpnet', 'er åpne'], 0, 'Passiva geral/habitual adiciona "-s" ao verbo ("åpnes").'],
  ['C1', 'Formell Stil (Bergenstesten)', 'Conector formal de contraste:', 'Budsjettet var stramt; ', ' klarte teamet å levere.', ['likevel', 'derfor', 'nemlig', 'følgelig'], 0, '"likevel" indica concessão formal ("ainda assim").'],
];

const DA_DRILLS: CompactDrill[] = [
  ['A1', 'V2-reglen', 'Verbo sempre na 2ª posição:', 'I dag ', ' jeg dansk med en ven.', ['studerer', 'studere', 'jeg studerer', 'studerede'], 0, 'Com "I dag" na 1ª posição, o verbo fica em 2º ("studerer jeg").'],
  ['A1', 'En vs Et', 'Substantivo neutro ("et hus"): ', 'Det er ', ' stort og lyst værelse.', ['et', 'en', 'den', 'det'], 0, '"Værelse" (quarto) é neutro (et-ord), portanto usa "et".'],
  ['A2', 'Bestemt Form', 'Artigo definido como sufixo (-en/-et):', 'Jeg købte ', ' i boghandlen i går.', ['bogen', 'en bog', 'boget', 'bøger'], 0, '"En bog" definida recebe o sufixo "-en" ("bogen").'],
  ['A2', 'Ledsætning (ikke før verb)', 'Em subordinadas, "ikke" vem ANTES do verbo:', 'Hun sagde, at hun ', ' komme i dag.', ['ikke kan', 'kan ikke', 'aldrig ikke', 'ej kan'], 0, 'Em orações subordinadas dinamarquesas, "ikke" precede o verbo ("ikke kan").'],
  ['B1', 'Sin / Sit / Sine', 'Possessivo reflexivo referente ao sujeito:', 'Kasper tog ', ' egen jakke og gik hjem.', ['sin', 'hans', 'sit', 'sine'], 0, 'Quando o possuidor é o sujeito (Kasper) e "jakke" é fælleskøn singular, usa-se "sin".'],
  ['B1', 'Førnutid (har + participium)', 'Perfeito com auxiliar "har":', 'Vi ', ' allerede sendt mailen til kunden.', ['har', 'er', 'havde', 'skal'], 0, 'Verbos transitivos usam "har" + particípio ("har sendt").'],
  ['B2', 'S-passiv', 'Voz passiva habitual com -s:', 'Dørene ', ' klokken ni hver morgen.', ['åbnes', 'åbner', 'åbnede', 'er åbne'], 0, 'Passiva habitual em dinamarquês adiciona "-s" ("åbnes").'],
  ['C1', 'Formelt Bindeord (Studieprøven)', 'Conector formal de contraste:', 'Budgettet var begrænset; ', ' nåede holdet målet.', ['ikke desto mindre', 'derfor', 'nemlig', 'følgelig'], 0, '"ikke desto mindre" significa "não obstante / ainda assim" em registro C1.'],
];

const PT_DRILLS: CompactDrill[] = [
  ['A1', 'Ser vs. Estar', 'Permanent identity vs. temporary state/location:', 'Hoje eu ', ' muito cansado depois do trabalho.', ['estou', 'sou', 'é', 'fui'], 0, 'Temporary physical/emotional states always use "estar" ("estou cansado").'],
  ['A1', 'Por vs. Para', 'Destination / recipient uses "para":', 'Este presente é ', ' a minha mãe.', ['para', 'por', 'pela', 'em'], 0, 'Recipients and destinations take "para".'],
  ['A2', 'Preterite vs. Imperfect', 'Habitual past action uses Imperfeito:', 'Quando eu era criança, ', ' futebol todo dia.', ['jogava', 'joguei', 'jogo', 'jogarei'], 0, 'Repeated past habits use the Imperfeito ("jogava").'],
  ['A2', 'Ir + Infinitive', 'Near future plans:', 'Amanhã nós ', ' viajar para o Rio de Janeiro.', ['vamos', 'fomos', 'íamos', 'temos'], 0, '"Ir" (present) + infinitive expresses near future plans.'],
  ['B1', 'Future Subjunctive (Quando/Se)', 'Future condition requires Futuro do Subjuntivo:', 'Quando você ', ' ao Brasil, me avise!', ['vier', 'vem', 'veio', 'virá'], 0, 'After "quando" for future events, Portuguese requires Future Subjunctive ("vier").'],
  ['B1', 'Present Subjunctive', 'Wishes & hopes trigger Presente do Subjuntivo:', 'Espero que tudo ', ' bem na sua apresentação.', ['corra', 'corre', 'correu', 'correrá'], 0, '"Espero que" triggers Present Subjunctive ("corra").'],
  ['B2', 'Concessão com Subjuntivo', 'Embora exige subjuntivo:', 'Embora o prazo ', ' curto, entregamos o projeto.', ['fosse', 'era', 'foi', 'será'], 0, '"Embora" exige modo subjuntivo ("fosse" / "seja").'],
  ['C1', 'Crase & Regência Culta', 'Contração de preposição a + artigo a:', 'A equipe dedicou-se ', ' análise dos dados.', ['à', 'a', 'ao', 'na'], 0, 'Quem se dedica, dedica-se "a" + "a análise" = "à análise".'],
];

export const GRAMMAR_DRILLS: GrammarDrillItem[] = [
  ...expandDrills('en', EN_DRILLS),
  ...expandDrills('es', ES_DRILLS),
  ...expandDrills('fr', FR_DRILLS),
  ...expandDrills('it', IT_DRILLS),
  ...expandDrills('de', DE_DRILLS),
  ...expandDrills('ru', RU_DRILLS),
  ...expandDrills('ja', JA_DRILLS),
  ...expandDrills('zh', ZH_DRILLS),
  ...expandDrills('ar', AR_DRILLS),
  ...expandDrills('nl', NL_DRILLS),
  ...expandDrills('af', AF_DRILLS),
  ...expandDrills('sv', SV_DRILLS),
  ...expandDrills('tr', TR_DRILLS),
  ...expandDrills('he', HE_DRILLS),
  ...expandDrills('nb', NB_DRILLS),
  ...expandDrills('da', DA_DRILLS),
  ...expandDrills('pt', PT_DRILLS),
];

export function getGrammarDrillsByLanguage(lang: LanguageCode): GrammarDrillItem[] {
  return GRAMMAR_DRILLS.filter((d) => d.languageCode === lang);
}

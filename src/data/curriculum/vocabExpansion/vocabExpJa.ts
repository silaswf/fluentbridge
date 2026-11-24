import type { VocabExampleFixMap, VocabExpansionTuple } from './types';

export const VOCAB_EXP_JA: VocabExpansionTuple[] = [
  // A1: ja-a1-1
  ['ja-a1-1', 'こんにちは', 'konnichiwa', 'Olá / Boa tarde', 'Cumprimentos', 'こんにちは、お元気ですか。', 'Olá, como você está?'],
  ['ja-a1-1', '名前', 'namae', 'Nome', 'Substantivo', 'お名前は何ですか。', 'Qual é o seu nome?'],
  ['ja-a1-1', '私', 'watashi', 'Eu', 'Pronome', '私は学生です。', 'Eu sou estudante.'],

  // A1: ja-a1-2
  ['ja-a1-2', '出身', 'shusshin', 'Origem / Cidade natal', 'Substantivo', 'ご出身はどちらですか。', 'De onde você é?'],
  ['ja-a1-2', '番号', 'bangou', 'Número', 'Substantivo', '電話番号を教えてください。', 'Por favor, me diga o seu número de telefone.'],
  ['ja-a1-2', 'パン', 'pan', 'Pão', 'Substantivo', '朝ごはんにパンを食べます。', 'Eu como pão no café da manhã.'],

  // A1: ja-a1-3
  ['ja-a1-3', 'メニュー', 'menyuu', 'Cardápio', 'Substantivo', 'すみません、メニューをお願いします。', 'Com licença, o cardápio, por favor.'],
  ['ja-a1-3', '二つ', 'futatsu', 'Dois (unidades)', 'Contador', 'りんごを二つ買いました。', 'Comprei duas maçãs.'],
  ['ja-a1-3', 'お茶', 'ocha', 'Chá', 'Substantivo', '温かいお茶を飲みますか。', 'Você quer beber chá quente?'],

  // A1: ja-a1-4
  ['ja-a1-4', '安い', 'yasui', 'Barato', 'Adjetivo', 'この店の野菜はとても安いです。', 'Os legumes desta loja são muito baratos.'],
  ['ja-a1-4', 'これ', 'kore', 'Isto (perto de quem fala)', 'Pronome', 'これを一つください。', 'Me dê um deste, por favor.'],
  ['ja-a1-4', 'お会計', 'okaikei', 'Conta / Pagamento', 'Substantivo', 'すみません、お会計をお願いします。', 'Com licença, a conta, por favor.'],

  // A1: ja-a1-5
  ['ja-a1-5', '寝ます', 'nemasu', 'Dormir', 'Verbo', '毎晩十一時に寝ます。', 'Todas as noites eu durmo às onze horas.'],
  ['ja-a1-5', '飲みます', 'nomimasu', 'Beber', 'Verbo', '朝、水をたくさん飲みます。', 'De manhã, eu bebo muita água.'],
  ['ja-a1-5', '今', 'ima', 'Agora', 'Advérbio', '今、何時ですか。', 'Que horas são agora?'],

  // A1: ja-a1-6
  ['ja-a1-6', '中', 'naka', 'Dentro', 'Substantivo', 'かばんの中に鍵があります。', 'A chave está dentro da bolsa.'],
  ['ja-a1-6', '上', 'ue', 'Em cima', 'Substantivo', '机の上に本があります。', 'Há um livro em cima da mesa.'],
  ['ja-a1-6', '部屋', 'heya', 'Quarto / Cômodo', 'Substantivo', '私の部屋は二階にあります。', 'Meu quarto fica no segundo andar.'],

  // A1: ja-a1-7
  ['ja-a1-7', 'バス', 'basu', 'Ônibus', 'Substantivo', '毎日バスで学校へ行きます。', 'Todos os dias vou à escola de ônibus.'],
  ['ja-a1-7', '歩きます', 'arukimasu', 'Caminhar / Andar', 'Verbo', '家から駅まで歩きます。', 'Eu caminho de casa até a estação.'],
  ['ja-a1-7', '右', 'migi', 'Direita', 'Substantivo', '次の角を右に曲がってください。', 'Por favor, vire à direita na próxima esquina.'],

  // A1: ja-a1-8
  ['ja-a1-8', '嫌い', 'kirai', 'Não gostar / Detestar', 'Adjetivo', '私は辛い食べ物が嫌いです。', 'Eu não gosto de comida apimentada.'],
  ['ja-a1-8', '静か', 'shizuka', 'Silencioso / Calmo', 'Adjetivo', 'この公園はとても静かです。', 'Este parque é muito silencioso.'],
  ['ja-a1-8', '大きい', 'ookii', 'Grande', 'Adjetivo', '東京はとても大きい街です。', 'Tóquio é uma cidade muito grande.'],

  // A1: ja-a1-9
  ['ja-a1-9', '先週', 'senshuu', 'Semana passada', 'Substantivo', '先週、友達と京都へ行きました。', 'Na semana passada, fui a Quioto com um amigo.'],
  ['ja-a1-9', '行きました', 'ikimashita', 'Foi / Fui', 'Verbo', '日曜日に映画館へ行きました。', 'No domingo fui ao cinema.'],
  ['ja-a1-9', '忙しかった', 'isogashikatta', 'Estava ocupado', 'Adjetivo', '昨日は仕事がとても忙しかった。', 'Ontem o trabalho estava muito corrido.'],

  // A1: ja-a1-10
  ['ja-a1-10', '母', 'haha', 'Minha mãe', 'Substantivo', '私の母は料理が上手です。', 'Minha mãe cozinha muito bem.'],
  ['ja-a1-10', '父', 'chichi', 'Meu pai', 'Substantivo', '父は毎日新聞を読みます。', 'Meu pai lê o jornal todos os dias.'],
  ['ja-a1-10', '友達', 'tomodachi', 'Amigo', 'Substantivo', '週末に友達とランチを食べます。', 'No fim de semana almoço com um amigo.'],

  // A1: ja-v4-a1-1
  ['ja-v4-a1-1', '野菜', 'yasai', 'Legumes / Verduras', 'Substantivo', '新鮮な野菜を買いたいです。', 'Quero comprar legumes frescos.'],
  ['ja-v4-a1-1', '卵', 'tamago', 'Ovo', 'Substantivo', '冷蔵庫に卵が六個あります。', 'Há seis ovos na geladeira.'],
  ['ja-v4-a1-1', '現金', 'genkin', 'Dinheiro em espécie', 'Substantivo', '現金でお支払いします。', 'Vou pagar em dinheiro.'],

  // A1: ja-v4-a1-2
  ['ja-v4-a1-2', '頭痛', 'zutsuu', 'Dor de cabeça', 'Substantivo', '朝からひどい頭痛がします。', 'Estou com uma dor de cabeça forte desde de manhã.'],
  ['ja-v4-a1-2', '咳', 'seki', 'Tosse', 'Substantivo', '夜になると咳が出ます。', 'Quando chega a noite, eu tusso.'],
  ['ja-v4-a1-2', 'マスク', 'masuku', 'Máscara', 'Substantivo', '風邪のときはマスクをします。', 'Quando estou resfriado, uso máscara.'],

  // A1: ja-v4-a1-3
  ['ja-v4-a1-3', '改札', 'kaisatsu', 'Catraca da estação', 'Substantivo', '改札の前で待ちましょう。', 'Vamos esperar em frente à catraca.'],
  ['ja-v4-a1-3', 'チャージ', 'chaaji', 'Recarga (cartão)', 'Substantivo', '駅でSuicaにチャージしました。', 'Recarreguei o Suica na estação.'],
  ['ja-v4-a1-3', '出口', 'deguchi', 'Saída', 'Substantivo', '駅の南口が出口です。', 'A saída sul é a saída da estação.'],

  // A1: ja-v4-a1-4
  ['ja-v4-a1-4', '鍵', 'kagi', 'Chave', 'Substantivo', '部屋の鍵をフロントに預けます。', 'Vou deixar a chave do quarto na recepção.'],
  ['ja-v4-a1-4', 'チェックイン', 'chekkuin', 'Check-in', 'Substantivo', 'チェックインは何時からですか。', 'A partir de que horas é o check-in?'],
  ['ja-v4-a1-4', 'タオル', 'taoru', 'Toalha', 'Substantivo', '新しいタオルをもう一枚いただけますか。', 'Posso pegar mais uma toalha limpa?'],

  // A1: ja-v4-a1-5
  ['ja-v4-a1-5', 'パスポート', 'pasupooto', 'Passaporte', 'Substantivo', 'パスポートをお見せください。', 'Por favor, mostre seu passaporte.'],
  ['ja-v4-a1-5', '出発', 'shuppatsu', 'Partida / Embarque', 'Substantivo', '飛行機は十時に出発します。', 'O avião parte às dez horas.'],
  ['ja-v4-a1-5', '到着', 'touchaku', 'Chegada', 'Substantivo', '東京への到着は夕方です。', 'A chegada em Tóquio é no fim da tarde.'],

  // A1: ja-v4-a1-6
  ['ja-v4-a1-6', 'サイズ', 'saizu', 'Tamanho', 'Substantivo', 'もう少し大きいサイズはありますか。', 'Você tem um tamanho um pouco maior?'],
  ['ja-v4-a1-6', '色', 'iro', 'Cor', 'Substantivo', '別の色のシャツを見せてください。', 'Por favor, me mostre a camisa de outra cor.'],
  ['ja-v4-a1-6', '試着室', 'shichakushitsu', 'Provador', 'Substantivo', '試着室はどちらですか。', 'Onde fica o provador?'],

  // A1: ja-v4-a1-7
  ['ja-v4-a1-7', '警察', 'keisatsu', 'Polícia', 'Substantivo', 'すぐに警察に連絡してください。', 'Por favor, ligue para a polícia imediatamente.'],
  ['ja-v4-a1-7', '火事', 'kaji', 'Incêndio', 'Substantivo', '近くのビルで火事が起きました。', 'Ocorreu um incêndio no prédio próximo.'],
  ['ja-v4-a1-7', '怪我', 'kega', 'Ferimento / Machucado', 'Substantivo', '転んで足に怪我をしました。', 'Caí e machuquei a perna.'],

  // A1: ja-v4-a1-8
  ['ja-v4-a1-8', '口座', 'kouza', 'Conta bancária', 'Substantivo', '銀行で新しい口座を作りました。', 'Abri uma nova conta no banco.'],
  ['ja-v4-a1-8', '手数料', 'tesuuryou', 'Taxa / Tarifa', 'Substantivo', '夜間はATMの手数料がかかります。', 'À noite há cobrança de tarifa no caixa eletrônico.'],
  ['ja-v4-a1-8', '通帳', 'tsuuchou', 'Caderneta bancária', 'Substantivo', '通帳とキャッシュカードをお持ちください。', 'Por favor, traga sua caderneta e o cartão do banco.'],

  // A1: ja-v4-a1-9
  ['ja-v4-a1-9', 'カット', 'katto', 'Corte de cabelo', 'Substantivo', '今日はカットだけお願いします。', 'Hoje quero apenas o corte, por favor.'],
  ['ja-v4-a1-9', '前髪', 'maegami', 'Franja', 'Substantivo', '前髪は少し短くしてください。', 'Por favor, deixe a franja um pouco mais curta.'],
  ['ja-v4-a1-9', 'シャンプー', 'shanpuu', 'Xampu / Lavagem', 'Substantivo', 'シャンプーも一緒にお願いします。', 'Gostaria de lavar também, por favor.'],

  // A1: ja-v4-a1-10
  ['ja-v4-a1-10', '場所', 'basho', 'Lugar / Local', 'Substantivo', '待ち合わせの場所を決めましょう。', 'Vamos decidir o local do encontro.'],
  ['ja-v4-a1-10', '西口', 'nishiguchi', 'Saída Oeste', 'Substantivo', '渋谷駅の西口で会いましょう。', 'Vamos nos encontrar na saída oeste da estação de Shibuya.'],
  ['ja-v4-a1-10', 'ちょうど', 'choudo', 'Exatamente / Na hora', 'Advérbio', '約束の時間にちょうど着きました。', 'Cheguei exatamente na hora marcada.'],

  // A2: ja-a2-1
  ['ja-a2-1', '待ってください', 'matte kudasai', 'Espere, por favor', 'Expressão', 'ここで少し待ってください。', 'Por favor, espere um pouco aqui.'],
  ['ja-a2-1', '見せてください', 'misete kudasai', 'Mostre-me, por favor', 'Expressão', 'その写真を見せてください。', 'Por favor, me mostre essa foto.'],
  ['ja-a2-1', '手伝って', 'tetsudatte', 'Ajude (forma te)', 'Verbo', '重い荷物を運ぶのを手伝ってください。', 'Por favor, me ajude a carregar a mala pesada.'],

  // A2: ja-a2-2
  ['ja-a2-2', '結婚しています', 'kekkon shite imasu', 'Ser casado(a)', 'Expressão', '姉はもう結婚しています。', 'Minha irmã mais velha já é casada.'],
  ['ja-a2-2', '持っています', 'motte imasu', 'Ter / Possuir', 'Verbo', '私は自分の自転車を持っています。', 'Eu tenho minha própria bicicleta.'],
  ['ja-a2-2', '勉強しています', 'benkyou shite imasu', 'Estar estudando', 'Verbo', '今、日本語を勉強しています。', 'Agora estou estudando japonês.'],

  // A2: ja-a2-3
  ['ja-a2-3', '禁煙', 'kinen', 'Proibido fumar', 'Substantivo', 'このレストランは全席禁煙です。', 'Este restaurante é totalmente proibido para fumantes.'],
  ['ja-a2-3', '撮影', 'satsuei', 'Fotografia / Filmagem', 'Substantivo', '館内での撮影はご遠慮ください。', 'Por favor, evite fotografar dentro do prédio.'],
  ['ja-a2-3', '静かに', 'shizuka ni', 'Em silêncio', 'Advérbio', '図書館では静かにしてください。', 'Por favor, faça silêncio na biblioteca.'],

  // A2: ja-a2-4
  ['ja-a2-4', '留学', 'ryuugaku', 'Intercâmbio / Estudar fora', 'Substantivo', '来年、日本へ留学したいです。', 'No ano que vem, quero fazer intercâmbio no Japão.'],
  ['ja-a2-4', '予定', 'yotei', 'Plano / Agenda', 'Substantivo', '週末の予定はもう決まりましたか。', 'Seus planos para o fim de semana já estão definidos?'],
  ['ja-a2-4', '将来', 'shourai', 'Futuro', 'Substantivo', '将来は通訳になりたいです。', 'No futuro quero me tornar intérprete.'],

  // A2: ja-a2-5
  ['ja-a2-5', 'ルール', 'ruuru', 'Regra', 'Substantivo', '会社のルールを守らなければなりません。', 'É preciso seguir as regras da empresa.'],
  ['ja-a2-5', '期限', 'kigen', 'Prazo', 'Substantivo', 'レポートの期限は今週の金曜日です。', 'O prazo do relatório é nesta sexta-feira.'],
  ['ja-a2-5', '忘れないで', 'wasurenaide', 'Não se esqueça', 'Expressão', '傘を忘れないでくださいね。', 'Não se esqueça do guarda-chuva, por favor.'],

  // A2: ja-a2-6
  ['ja-a2-6', '経験', 'keiken', 'Experiência', 'Substantivo', '海外で働いた経験があります。', 'Tenho experiência trabalhando no exterior.'],
  ['ja-a2-6', 'アドバイス', 'adobaisu', 'Conselho', 'Substantivo', '先輩のアドバイスを聞いたほうがいいです。', 'É melhor ouvir o conselho do colega mais experiente.'],
  ['ja-a2-6', '富士山', 'fujisan', 'Monte Fuji', 'Substantivo', '一度、富士山に登ってみたいです。', 'Quero tentar subir o Monte Fuji uma vez.'],

  // A2: ja-a2-7
  ['ja-a2-7', 'の方が', 'no hou ga', 'Mais (comparativo)', 'Gramática', '電車の方がバスより速いです。', 'O trem é mais rápido do que o ônibus.'],
  ['ja-a2-7', '同じ', 'onaji', 'Igual / Mesmo', 'Substantivo', '私の意見もあなたと同じです。', 'Minha opinião também é igual à sua.'],
  ['ja-a2-7', '季節', 'kisetsu', 'Estação do ano', 'Substantivo', '日本の季節の中で春が一番好きです。', 'Entre as estações do Japão, gosto mais da primavera.'],

  // A2: ja-a2-8
  ['ja-a2-8', '渋滞', 'juutai', 'Engarrafamento', 'Substantivo', '渋滞のせいでバスが遅れました。', 'Por causa do engarrafamento, o ônibus atrasou.'],
  ['ja-a2-8', '休む', 'yasumu', 'Descansar / Faltar', 'Verbo', '日曜日は家でゆっくり休むつもりです。', 'No domingo pretendo descansar bem em casa.'],
  ['ja-a2-8', '理由', 'riyuu', 'Motivo / Razão', 'Substantivo', '遅刻した理由を説明してください。', 'Por favor, explique o motivo do atraso.'],

  // A2: ja-a2-9
  ['ja-a2-9', '診察', 'shinsatsu', 'Consulta médica', 'Substantivo', '午後に病院で診察を受けます。', 'À tarde vou passar por consulta no hospital.'],
  ['ja-a2-9', '保険証', 'hokenshou', 'Carteirinha do seguro saúde', 'Substantivo', '受付で保険証を出してください。', 'Por favor, apresente a carteirinha do seguro na recepção.'],
  ['ja-a2-9', '吐き気', 'hakike', 'Náusea / Enjoo', 'Substantivo', '昨日から少し吐き気があります。', 'Estou com um pouco de enjoo desde ontem.'],

  // A2: ja-a2-10
  ['ja-a2-10', '運転する', 'unten suru', 'Dirigir', 'Verbo', '私は車を運転することができます。', 'Eu sei dirigir carro.'],
  ['ja-a2-10', '弾く', 'hiku', 'Tocar (instrumento de cordas/teclas)', 'Verbo', '趣味はピアノを弾くことです。', 'Meu hobby é tocar piano.'],
  ['ja-a2-10', '泳ぐ', 'oyogu', 'Nadar', 'Verbo', '海で泳ぐのが大好きです。', 'Adoro nadar no mar.'],

  // A2: ja-v4-a2-1
  ['ja-v4-a2-1', '敷金', 'shikikin', 'Depósito caução', 'Substantivo', 'この物件は敷金が一か月分です。', 'Este imóvel exige um mês de depósito caução.'],
  ['ja-v4-a2-1', '内見', 'naiken', 'Visita ao imóvel', 'Substantivo', '土曜日に部屋の内見に行きます。', 'No sábado vou visitar o apartamento.'],
  ['ja-v4-a2-1', '水漏れ', 'mizumore', 'Vazamento de água', 'Substantivo', 'キッチンの水漏れを直してほしいです。', 'Gostaria que consertassem o vazamento na cozinha.'],

  // A2: ja-v4-a2-2
  ['ja-v4-a2-2', 'レギュラー', 'regyuraa', 'Gasolina comum', 'Substantivo', 'レギュラーを満タンでお願いします。', 'Gasolina comum, completar o tanque, por favor.'],
  ['ja-v4-a2-2', '保険', 'hoken', 'Seguro', 'Substantivo', 'レンタカーの保険に入りましたか。', 'Você contratou o seguro do carro alugado?'],
  ['ja-v4-a2-2', 'ナビ', 'nabi', 'GPS / Navegador', 'Substantivo', '車のナビに目的地を入れました。', 'Coloquei o destino no GPS do carro.'],

  // A2: ja-v4-a2-3
  ['ja-v4-a2-3', 'ピーナッツ', 'piinattsu', 'Amendoim', 'Substantivo', 'ピーナッツにアレルギーがあります。', 'Tenho alergia a amendoim.'],
  ['ja-v4-a2-3', '成分', 'seibun', 'Ingrediente / Componente', 'Substantivo', '料理の成分を確認してもらえますか。', 'Você pode verificar os ingredientes do prato?'],
  ['ja-v4-a2-3', '別皿', 'betsuzara', 'Prato separado', 'Substantivo', 'ソースは別皿にしていただけますか。', 'Poderia servir o molho em um prato separado?'],

  // A2: ja-v4-a2-4
  ['ja-v4-a2-4', 'スーツケース', 'suutsukeesu', 'Mala de viagem', 'Substantivo', '黒いスーツケースが見つかりません。', 'Minha mala preta não está aparecendo.'],
  ['ja-v4-a2-4', '窓口', 'madoguchi', 'Guichê / Balcão de atendimento', 'Substantivo', '荷物の窓口で手続きをしました。', 'Fiz o procedimento no guichê de bagagens.'],
  ['ja-v4-a2-4', '連絡先', 'renrakusaki', 'Contato (telefone/endereço)', 'Substantivo', '書類に連絡先を書いてください。', 'Por favor, escreva seu contato no formulário.'],

  // A2: ja-v4-a2-5
  ['ja-v4-a2-5', '不在票', 'fuzaihyou', 'Aviso de ausência (entrega)', 'Substantivo', 'ポストに不在票が入っていました。', 'Havia um aviso de ausência na caixa de correio.'],
  ['ja-v4-a2-5', '追跡番号', 'tsuisekibangou', 'Código de rastreamento', 'Substantivo', '追跡番号で荷物の場所を調べます。', 'Vou verificar onde está o pacote pelo código de rastreamento.'],
  ['ja-v4-a2-5', '日時指定', 'nichijishitei', 'Agendamento de data e hora', 'Substantivo', '明日の午前中で日時指定をしました。', 'Agendei a entrega para amanhã de manhã.'],

  // A2: ja-v4-a2-6
  ['ja-v4-a2-6', '月額', 'getsugaku', 'Mensalidade', 'Substantivo', 'このジムの月額は八千円です。', 'A mensalidade desta academia é de oito mil ienes.'],
  ['ja-v4-a2-6', 'マシン', 'mashin', 'Aparelho de ginástica', 'Substantivo', 'マシンの使い方を教えてください。', 'Por favor, me ensine como usar o aparelho.'],
  ['ja-v4-a2-6', '水分補給', 'suibunhokyuu', 'Hidratação', 'Substantivo', '運動中はこまめに水分補給をしましょう。', 'Vamos nos hidratar com frequência durante o treino.'],

  // A2: ja-v4-a2-7
  ['ja-v4-a2-7', '資源ゴミ', 'shigengomi', 'Lixo reciclável', 'Substantivo', '木曜日は資源ゴミの日です。', 'Quinta-feira é dia de lixo reciclável.'],
  ['ja-v4-a2-7', '騒音', 'souon', 'Barulho / Ruído', 'Substantivo', '夜の騒音には気をつけましょう。', 'Vamos tomar cuidado com o barulho à noite.'],
  ['ja-v4-a2-7', '挨拶', 'aisatsu', 'Cumprimento / Saudação', 'Substantivo', '引っ越しの挨拶に行きました。', 'Fui cumprimentar os vizinhos pela mudança.'],

  // A2: ja-v4-a2-8
  ['ja-v4-a2-8', '解約', 'kaiyaku', 'Cancelamento de contrato', 'Substantivo', 'インターネットの解約をしたいです。', 'Quero cancelar o contrato de internet.'],
  ['ja-v4-a2-8', '担当者', 'tantousha', 'Responsável / Atendente', 'Substantivo', '担当者におつなぎいたします。', 'Vou transferir para o responsável.'],
  ['ja-v4-a2-8', '確認番号', 'kakuninbangou', 'Número de confirmação', 'Substantivo', '確認番号をメモしておきました。', 'Anotei o número de confirmação.'],

  // A2: ja-v4-a2-9
  ['ja-v4-a2-9', '旬', 'shun', 'Da estação / No auge', 'Substantivo', '秋はさんまが旬でおいしいです。', 'No outono, o peixe sanma está na estação e é delicioso.'],
  ['ja-v4-a2-9', 'おまけ', 'omake', 'Brinde / Extra', 'Substantivo', '店主がみかんをおまけしてくれました。', 'O dono da loja me deu uma mexerica de brinde.'],
  ['ja-v4-a2-9', '包装', 'housou', 'Embalagem', 'Substantivo', 'プレゼント用の包装をお願いします。', 'Por favor, faça embalagem para presente.'],

  // A2: ja-v4-a2-10
  ['ja-v4-a2-10', '小さじ', 'kosaji', 'Colher de chá', 'Substantivo', '塩を小さじ半分入れます。', 'Adicione meia colher de chá de sal.'],
  ['ja-v4-a2-10', '煮込む', 'nikomu', 'Cozinhar em fogo brando', 'Verbo', '弱火で二十分ほど煮込むとおいしくなります。', 'Fica delicioso ao cozinhar em fogo brando por cerca de vinte minutos.'],
  ['ja-v4-a2-10', 'みじん切り', 'mijingiri', 'Corte bem picado', 'Substantivo', '玉ねぎをみじん切りにします。', 'Pique a cebola bem miúda.'],

  // B1: ja-b1-1
  ['ja-b1-1', 'あげる', 'ageru', 'Dar (para outra pessoa)', 'Verbo', '誕生日に妹へ花束をあげるつもりです。', 'Pretendo dar um buquê de flores para minha irmã mais nova no aniversário.'],
  ['ja-b1-1', '後輩', 'kouhai', 'Colega mais novo / Júnior', 'Substantivo', '職場の後輩に仕事のコツを教えました。', 'Ensinei dicas de trabalho para o colega mais novo da empresa.'],
  ['ja-b1-1', 'お礼', 'orei', 'Agradecimento / Retribuição', 'Substantivo', '手伝ってもらったお礼にコーヒーをごちそうしました。', 'Em agradecimento pela ajuda, paguei um café para ele.'],

  // B1: ja-b1-2
  ['ja-b1-2', '読める', 'yomeru', 'Conseguir ler', 'Verbo', '漢字が少しずつ読めるようになってきました。', 'Aos poucos estou passando a conseguir ler os kanjis.'],
  ['ja-b1-2', '行ける', 'ikeru', 'Poder ir / Dar para ir', 'Verbo', '来週のパーティーには行けると思います。', 'Acho que consigo ir à festa da semana que vem.'],
  ['ja-b1-2', '食べられる', 'taberareru', 'Poder comer / Ser comestível', 'Verbo', '辛い料理でも問題なく食べられるようになりました。', 'Passei a conseguir comer até pratos apimentados sem problemas.'],

  // B1: ja-b1-3
  ['ja-b1-3', '〜ば', '~ba', 'Se (condicional)', 'Gramática', '早く出発すれば、始発に間に合います。', 'Se sairmos cedo, pegamos o primeiro trem.'],
  ['ja-b1-3', '〜と', '~to', 'Sempre que / Ao (consequência natural)', 'Gramática', 'このボタンを押すと、お湯が出ます。', 'Ao apertar este botão, sai água quente.'],
  ['ja-b1-3', '故障', 'koshou', 'Defeito / Pane', 'Substantivo', 'パソコンが故障したら、すぐサポートに連絡してください。', 'Se o computador der defeito, contate o suporte imediatamente.'],

  // B1: ja-b1-4
  ['ja-b1-4', '〜らしいです', '~rashii desu', 'Parece que / Dizem que', 'Gramática', 'ニュースによると、明日は雪が降るらしいです。', 'Segundo o noticiário, parece que vai nevar amanhã.'],
  ['ja-b1-4', '〜かもしれません', '~kamoshiremasen', 'Talvez / Pode ser que', 'Gramática', '午後は雨が降るかもしれません。', 'Talvez chova à tarde.'],
  ['ja-b1-4', '予想', 'yosou', 'Previsão / Expectativa', 'Substantivo', '今年の夏は予想以上に暑くなりそうです。', 'Este verão parece que vai ficar mais quente do que o previsto.'],

  // B1: ja-b1-5
  ['ja-b1-5', '会議', 'kaigi', 'Reunião', 'Substantivo', '午後の会議はオンラインで行います。', 'A reunião da tarde será realizada online.'],
  ['ja-b1-5', '修正', 'shuusei', 'Correção / Revisão', 'Substantivo', '資料の数字を修正したいんです。', 'É que eu gostaria de corrigir os números do material.'],
  ['ja-b1-5', '進捗', 'shinchoku', 'Progresso / Andamento', 'Substantivo', 'プロジェクトの進捗を報告します。', 'Vou relatar o andamento do projeto.'],

  // B1: ja-b1-6
  ['ja-b1-6', '叱られる', 'shikarareru', 'Levar bronca / Ser repreendido', 'Verbo', '約束を守らないと、上司に叱られることがあります。', 'Se não cumprir o combinado, pode acabar levando bronca do chefe.'],
  ['ja-b1-6', '盗まれる', 'nusumareru', 'Ser roubado / Ter algo furtado', 'Verbo', '人混みでは財布を盗まれる危険があるので注意してください。', 'Em multidões há risco de ter a carteira furtada, então tome cuidado.'],
  ['ja-b1-6', '頼まれる', 'tanomareru', 'Ser solicitado / Receber um pedido', 'Verbo', '急な仕事を頼まれると、予定が狂ってしまいます。', 'Quando me pedem um trabalho de última hora, minha agenda acaba bagunçando.'],

  // B1: ja-b1-7
  ['ja-b1-7', '待たせる', 'mataseru', 'Fazer esperar', 'Verbo', 'お客様を長く待たせるわけにはいきません。', 'Não podemos fazer o cliente esperar por muito tempo.'],
  ['ja-b1-7', '残業させる', 'zangyou saseru', 'Fazer fazer hora extra', 'Verbo', '部下に無理に残業させるのはよくありません。', 'Não é bom obrigar subordinados a fazer hora extra sem necessidade.'],
  ['ja-b1-7', '参加させられる', 'sanka saserareru', 'Ser obrigado a participar', 'Verbo', '興味のない会議に参加させられるのはつらいです。', 'É difícil ser obrigado a participar de uma reunião sem interesse.'],

  // B1: ja-b1-8
  ['ja-b1-8', '予習', 'yoshuu', 'Estudo prévio', 'Substantivo', '授業の前にテキストを予習しておきます。', 'Vou estudar o texto antecipadamente antes da aula.'],
  ['ja-b1-8', '確認', 'kakunin', 'Confirmação / Verificação', 'Substantivo', 'メールを送信する前に内容を確認しておくべきです。', 'Deve-se verificar o conteúdo do e-mail antes de enviá-lo.'],
  ['ja-b1-8', '片付ける', 'katazukeru', 'Arrumar / Organizar', 'Verbo', '来客の前に、まず部屋を片付ける必要があります。', 'Antes da visita chegar, primeiro é preciso arrumar o quarto.'],

  // B1: ja-b1-9
  ['ja-b1-9', '〜ていく', '~te iku', 'Continuar mudando daqui para frente', 'Gramática', 'これから人口がさらに減っていくでしょう。', 'Daqui para frente, a população provavelmente continuará diminuindo.'],
  ['ja-b1-9', '目標', 'mokuhyou', 'Objetivo / Meta', 'Substantivo', '目標を達成するために毎日努力しています。', 'Esforço-me todos os dias para alcançar minha meta.'],
  ['ja-b1-9', '習慣', 'shuukan', 'Hábito / Costume', 'Substantivo', '健康のために早起きする習慣をつけています。', 'Estou criando o hábito de acordar cedo pela minha saúde.'],

  // B1: ja-b1-10
  ['ja-b1-10', '思い出', 'omoide', 'Lembrança / Memória', 'Substantivo', '家族と過ごした夏休みは大切な思い出です。', 'As férias de verão que passei com a família são uma lembrança preciosa.'],
  ['ja-b1-10', '特徴', 'tokuchou', 'Característica', 'Substantivo', 'このアプリの特徴は操作が簡単なところです。', 'A característica deste aplicativo é ser fácil de operar.'],
  ['ja-b1-10', '紹介する', 'shoukai suru', 'Apresentar / Recomendar', 'Verbo', 'これから、最近読んで面白かった本を紹介する予定です。', 'Agora pretendo apresentar um livro interessante que li recentemente.'],

  // B1: ja-v4-b1-1
  ['ja-v4-b1-1', '問診票', 'monshinhyou', 'Ficha de anamnese', 'Substantivo', 'まずこちらの問診票にご記入ください。', 'Primeiro, por favor preencha esta ficha médica.'],
  ['ja-v4-b1-1', '紹介状', 'shoukaijou', 'Carta de encaminhamento', 'Substantivo', '大きな病院へ行くには紹介状が必要です。', 'Para ir a um hospital grande, é necessária uma carta de encaminhamento.'],
  ['ja-v4-b1-1', '服用する', 'fukuyou suru', 'Tomar (medicamento)', 'Verbo', 'この薬は必ず食後に服用するようにしてください。', 'Certifique-se de tomar este remédio após as refeições.'],

  // B1: ja-v4-b1-2
  ['ja-v4-b1-2', '実績', 'jisseki', 'Resultados / Histórico de conquistas', 'Substantivo', '前職での営業実績をアピールしました。', 'Destaquei meus resultados de vendas no emprego anterior.'],
  ['ja-v4-b1-2', '福利厚生', 'fukurikousei', 'Benefícios trabalhistas', 'Substantivo', '給与だけでなく福利厚生も重視しています。', 'Valorizo não só o salário, mas também os benefícios.'],
  ['ja-v4-b1-2', '希望額', 'kibougaku', 'Valor pretendido', 'Substantivo', '希望額について率直にお話ししました。', 'Conversei francamente sobre a pretensão salarial.'],

  // B1: ja-v4-b1-3
  ['ja-v4-b1-3', '明細', 'meisai', 'Extrato / Fatura detalhada', 'Substantivo', 'カードの利用明細を毎月確認しています。', 'Verifico a fatura do cartão todos os meses.'],
  ['ja-v4-b1-3', '補償対象', 'hoshoutaishou', 'Coberto pela garantia/seguro', 'Substantivo', '不正利用された金額は補償対象になります。', 'O valor usado de forma fraudulenta é coberto pelo seguro.'],
  ['ja-v4-b1-3', '本人確認', 'honnin kakunin', 'Verificação de identidade', 'Substantivo', '電話で本人確認の手続きを行いました。', 'Realizei a verificação de identidade por telefone.'],

  // B1: ja-v4-b1-4
  ['ja-v4-b1-4', '保険証券', 'hokenshouken', 'Apólice de seguro', 'Substantivo', '旅行中は保険証券を携帯しています。', 'Durante a viagem, carrego a apólice de seguro comigo.'],
  ['ja-v4-b1-4', '免責金額', 'menseki kingaku', 'Franquia do seguro', 'Substantivo', 'このプランには免責金額が設定されています。', 'Este plano possui um valor de franquia definido.'],
  ['ja-v4-b1-4', '請求する', 'seikyuu suru', 'Solicitar reembolso / Cobrar', 'Verbo', '帰国後に医療費を保険会社へ請求する予定です。', 'Pretendo solicitar o reembolso das despesas médicas à seguradora após voltar ao país.'],

  // B1: ja-v4-b1-5
  ['ja-v4-b1-5', '国民健康保険', 'kokumin kenkou hoken', 'Seguro Nacional de Saúde', 'Substantivo', '市役所で国民健康保険に加入しました。', 'Fiz a inscrição no Seguro Nacional de Saúde na prefeitura.'],
  ['ja-v4-b1-5', '印鑑', 'inkan', 'Carimbo pessoal (hanko)', 'Substantivo', '手続きには印鑑と身分証明書が必要です。', 'Para o procedimento são necessários o carimbo pessoal e um documento de identidade.'],
  ['ja-v4-b1-5', 'マイナンバー', 'mainanbaa', 'My Number (CPF japonês)', 'Substantivo', '転入届と一緒にマイナンバーの住所も変更します。', 'Junto com o registro de mudança, também atualizo o endereço do My Number.'],

  // B1: ja-v4-b1-6
  ['ja-v4-b1-6', '接続', 'setsuzoku', 'Conexão', 'Substantivo', 'VPNへの接続が不安定になっています。', 'A conexão com a VPN está instável.'],
  ['ja-v4-b1-6', 'エラー画面', 'eraa gamen', 'Tela de erro', 'Substantivo', 'エラー画面のスクリーンショットを送ってください。', 'Por favor, envie uma captura de tela do erro.'],
  ['ja-v4-b1-6', '復旧する', 'fukkyuu suru', 'Restabelecer / Voltar ao normal', 'Verbo', 'システムは午後三時ごろに復旧する見込みです。', 'A previsão é que o sistema seja restabelecido por volta das 15h.'],

  // B1: ja-v4-b1-7
  ['ja-v4-b1-7', '募集', 'boshuu', 'Recrutamento / Inscrição', 'Substantivo', '地域の清掃ボランティアを募集しています。', 'Estão recrutando voluntários para a limpeza do bairro.'],
  ['ja-v4-b1-7', 'シフト', 'shifuto', 'Turno / Escala', 'Substantivo', '土曜日の午前のシフトに入れますか。', 'Você consegue entrar no turno de sábado de manhã?'],
  ['ja-v4-b1-7', '協力する', 'kyouryoku suru', 'Colaborar / Cooperar', 'Verbo', '地域のイベントを成功させるために、みんなで協力することが大切です。', 'Para o evento local ser um sucesso, é importante que todos colaborem.'],

  // B1: ja-v4-b1-8
  ['ja-v4-b1-8', '保証会社', 'hoshougaisha', 'Empresa fiadora', 'Substantivo', '賃貸契約では保証会社の審査があります。', 'No contrato de aluguel há análise da empresa fiadora.'],
  ['ja-v4-b1-8', '原状回復', 'genjou kaifuku', 'Restauração ao estado original', 'Substantivo', '退去時には原状回復の費用を確認します。', 'Na saída do imóvel, verifica-se o custo de restauração ao estado original.'],
  ['ja-v4-b1-8', '通知', 'tsuuchi', 'Notificação / Aviso', 'Substantivo', '更新の通知が郵便で届きました。', 'A notificação de renovação chegou pelo correio.'],

  // B1: ja-v4-b1-9
  ['ja-v4-b1-9', '段ボール', 'danbooru', 'Caixa de papelão', 'Substantivo', '業者から段ボールを三十箱もらいました。', 'Recebi trinta caixas de papelão da empresa de mudança.'],
  ['ja-v4-b1-9', '立ち会い', 'tachiai', 'Vistoria presencial / Acompanhamento', 'Substantivo', '退去の立ち会いは午前十時に予約しました。', 'Agendei a vistoria de saída para as dez da manhã.'],
  ['ja-v4-b1-9', '家電', 'kaden', 'Eletrodomésticos', 'Substantivo', '大型家電の運搬は別料金になりますか。', 'O transporte de eletrodomésticos grandes tem taxa à parte?'],

  // B1: ja-v4-b1-10
  ['ja-v4-b1-10', 'あらすじ', 'arasuji', 'Sinopse / Enredo resumido', 'Substantivo', '本の裏表紙であらすじを読みました。', 'Li a sinopse na contracapa do livro.'],
  ['ja-v4-b1-10', '演技', 'engi', 'Atuação', 'Substantivo', '主演俳優の演技がとても自然でした。', 'A atuação do ator principal foi muito natural.'],
  ['ja-v4-b1-10', '結末', 'ketsumatsu', 'Desfecho / Final', 'Substantivo', '予想外の結末に驚きました。', 'Fiquei surpreso com o desfecho inesperado.'],

  // B1: ja-idioms-b1
  ['ja-idioms-b1', '頭が痛い', 'atama ga itai', 'Dar dor de cabeça (preocupação)', 'Expressão', '予算不足の問題には本当に頭が痛い。', 'O problema da falta de orçamento realmente me dá dor de cabeça.'],
  ['ja-idioms-b1', '気が合う', 'ki ga au', 'Dar-se bem / Ter sintonia', 'Expressão', '彼女とは趣味が同じなので、いつもとても気が合うんです。', 'Como temos os mesmos hobbies, sempre nos damos muito bem.'],

  // B1: ja-slang-b1
  ['ja-slang-b1', 'ウケる', 'ukeru', 'Muito engraçado / Hilário', 'Gíria', 'その話、めちゃくちゃウケるね！', 'Essa história é muito engraçada!'],
  ['ja-slang-b1', 'ビミョー', 'bimyou', 'Mais ou menos / Duvidoso', 'Gíria', '味はちょっとビミョーだったかな。', 'O sabor estava meio duvidoso, eu diria.'],

  // B2: ja-b2-1
  ['ja-b2-1', 'おっしゃる', 'ossharu', 'Dizer / Falar (Sonkeigo)', 'Keigo', '部長がおっしゃる通りに進めます。', 'Seguiremos exatamente como o gerente disse.'],
  ['ja-b2-1', 'いたす', 'itasu', 'Fazer (Kenjougo)', 'Keigo', 'そのご提案は謹んでお受けいたす次第です。', 'Aceito respeitosamente essa sua proposta.'],
  ['ja-b2-1', 'お越しになる', 'okoshi ni naru', 'Vir / Comparecer (Sonkeigo)', 'Keigo', '来週、社長が東京本社へお越しになる予定です。', 'Na semana que vem, o presidente virá à matriz em Tóquio.'],

  // B2: ja-b2-2
  ['ja-b2-2', '〜のに', '~noni', 'Apesar de / Embora', 'Gramática', '何度も注意したのに、同じミスを繰り返した。', 'Embora eu tenha avisado várias vezes, ele repetiu o mesmo erro.'],
  ['ja-b2-2', '反面', 'hanmen', 'Por outro lado / Em contrapartida', 'Substantivo', '便利な反面、プライバシーの懸念もある。', 'Por um lado é conveniente, mas por outro há preocupações com privacidade.'],
  ['ja-b2-2', '予想外', 'yosougai', 'Inesperado', 'Substantivo', '予想外の展開に会場が静まり返った。', 'O auditório ficou em silêncio diante do desdobramento inesperado.'],

  // B2: ja-b2-3
  ['ja-b2-3', '〜ため', '~tame', 'Por causa de / Devido a', 'Gramática', 'システム点検のため、深夜は利用できません。', 'Devido à manutenção do sistema, não está disponível de madrugada.'],
  ['ja-b2-3', '影響', 'eikyou', 'Influência / Impacto', 'Substantivo', '台風の影響でイベントが延期された。', 'O evento foi adiado por influência do tufão.'],
  ['ja-b2-3', '結果', 'kekka', 'Resultado', 'Substantivo', '努力した結果、第一志望に合格できた。', 'Como resultado do esforço, consegui passar na primeira opção.'],

  // B2: ja-b2-4
  ['ja-b2-4', '根拠', 'konkyo', 'Fundamento / Base', 'Substantivo', '根拠のない噂を信じてはいけません。', 'Não se deve acreditar em rumores sem fundamento.'],
  ['ja-b2-4', '推測', 'suisoku', 'Suposição / Inferência', 'Substantivo', 'データから原因を推測することができます。', 'É possível inferir a causa a partir dos dados.'],
  ['ja-b2-4', '確実', 'kakujitsu', 'Certo / Garantido', 'Adjetivo', 'このまま進めば、目標達成は確実だ。', 'Se continuarmos assim, o cumprimento da meta é garantido.'],

  // B2: ja-b2-5
  ['ja-b2-5', '〜にしたがって', '~ni shitagatte', 'Conforme / À medida que', 'Gramática', '年を重ねるにしたがって、好みが変わってきた。', 'À medida que os anos passam, meus gostos têm mudado.'],
  ['ja-b2-5', '徐々に', 'jojo ni', 'Gradualmente', 'Advérbio', '新しい制度が徐々に浸透しつつある。', 'O novo sistema está se consolidando gradualmente.'],
  ['ja-b2-5', '急速に', 'kyuusoku ni', 'Rapidamente / Aceleradamente', 'Advérbio', 'AI技術はここ数年で急速に発展した。', 'A tecnologia de IA desenvolveu-se rapidamente nos últimos anos.'],

  // B2: ja-b2-6
  ['ja-b2-6', '規則', 'kisoku', 'Regulamento / Norma', 'Substantivo', '職場の規則に従って行動する必要がある。', 'É necessário agir de acordo com as normas do local de trabalho.'],
  ['ja-b2-6', '方針', 'houshin', 'Diretriz / Política', 'Substantivo', '来年度の基本方針が正式に決定した。', 'A diretriz básica do próximo ano fiscal foi decidida oficialmente.'],
  ['ja-b2-6', '徹底する', 'tettei suru', 'Cumprir rigorosamente / Padronizar', 'Verbo', '情報管理を徹底することにしています。', 'Faço questão de cumprir rigorosamente a gestão da informação.'],

  // B2: ja-b2-7
  ['ja-b2-7', '責任', 'sekinin', 'Responsabilidade', 'Substantivo', '最後まで責任を持ってやり遂げるしかない。', 'Não há outra escolha senão concluir com responsabilidade até o fim.'],
  ['ja-b2-7', '諦める', 'akirameru', 'Desistir', 'Verbo', 'ここまで来た以上、途中で諦めるわけにはいかない。', 'Tendo chegado até aqui, não posso desistir no meio do caminho.'],
  ['ja-b2-7', '判断', 'handan', 'Julgamento / Decisão', 'Substantivo', '冷静に判断するしかない場面だった。', 'Era uma situação em que só restava julgar com calma.'],

  // B2: ja-b2-8
  ['ja-b2-8', '〜一方', '~ippou', 'Por um lado / Enquanto isso', 'Gramática', '都市部が増える一方、地方の人口は減っている。', 'Enquanto as áreas urbanas crescem, a população do interior diminui.'],
  ['ja-b2-8', 'メリット', 'meritto', 'Vantagem / Benefício', 'Substantivo', 'この手法にはコスト削減というメリットがある。', 'Este método tem a vantagem da redução de custos.'],
  ['ja-b2-8', '課題', 'kadai', 'Desafio / Questão', 'Substantivo', '実用化に向けて解決すべき課題が多い。', 'Há muitos desafios a resolver rumo à aplicação prática.'],

  // B2: ja-b2-9
  ['ja-b2-9', '〜ようだ', '~you da', 'Parece que (impressão direta)', 'Gramática', '外は雨が降り始めたようだ。', 'Parece que começou a chover lá fora.'],
  ['ja-b2-9', '雰囲気', 'funiki', 'Atmosfera / Clima', 'Substantivo', 'このカフェは落ち着いた雰囲気が魅力だ。', 'O charme deste café é a atmosfera tranquila.'],
  ['ja-b2-9', '印象', 'inshou', 'Impressão', 'Substantivo', '第一印象は思っていたより優しそうだった。', 'A primeira impressão foi de alguém mais gentil do que eu imaginava.'],

  // B2: ja-b2-10
  ['ja-b2-10', '直後', 'chokugo', 'Logo após / Imediatamente depois', 'Substantivo', '地震の直後に停電が発生した。', 'Ocorreu uma queda de energia logo após o terremoto.'],
  ['ja-b2-10', 'タイミング', 'taimingu', 'Momento / Timing', 'Substantivo', 'ちょうどいいタイミングで電話がかかってきた。', 'A ligação veio exatamente no momento certo.'],
  ['ja-b2-10', '完了', 'kanryou', 'Conclusão / Término', 'Substantivo', 'データの移行が完了したばかりです。', 'A migração dos dados acabou de ser concluída.'],

  // B2: ja-v4-b2-1
  ['ja-v4-b2-1', '譲歩', 'jouho', 'Concessão', 'Substantivo', '双方の譲歩によって合意に達した。', 'Chegou-se a um acordo por meio de concessões de ambos os lados.'],
  ['ja-v4-b2-1', '論点', 'ronten', 'Ponto de discussão', 'Substantivo', '会議の前に主な論点を整理しておこう。', 'Vamos organizar os principais pontos de discussão antes da reunião.'],
  ['ja-v4-b2-1', '調整する', 'chousei suru', 'Ajustar / Conciliar', 'Verbo', '各部署のスケジュールを調整する必要があります。', 'É necessário conciliar a agenda de cada departamento.'],

  // B2: ja-v4-b2-2
  ['ja-v4-b2-2', '偏向', 'henkou', 'Viés / Parcialidade', 'Substantivo', '報道の偏向を見抜く力が求められている。', 'Exige-se capacidade de identificar o viés na cobertura jornalística.'],
  ['ja-v4-b2-2', '拡散', 'kakusan', 'Disseminação / Viralização', 'Substantivo', '誤った情報がSNSで急速に拡散した。', 'Informações falsas se espalharam rapidamente pelas redes sociais.'],
  ['ja-v4-b2-2', '検証する', 'kenshou suru', 'Verificar / Checar', 'Verbo', 'データの正確性を複数の情報源で検証する。', 'Verificar a precisão dos dados em múltiplas fontes.'],

  // B2: ja-v4-b2-3
  ['ja-v4-b2-3', '人手不足', 'hitodebusoku', 'Escassez de mão de obra', 'Substantivo', '物流業界では深刻な人手不足が続いている。', 'No setor de logística, continua uma grave escassez de mão de obra.'],
  ['ja-v4-b2-3', '置き配', 'okihai', 'Entrega deixada na porta', 'Substantivo', '再配達を減らすために置き配を選んだ。', 'Escolhi a entrega na porta para reduzir reentregas.'],
  ['ja-v4-b2-3', '排出量', 'haishutsuryou', 'Volume de emissões', 'Substantivo', '輸送時の二酸化炭素排出量を削減する。', 'Reduzir o volume de emissões de CO₂ durante o transporte.'],

  // B2: ja-v4-b2-4
  ['ja-v4-b2-4', '利用規約', 'riyou kiyaku', 'Termos de uso', 'Substantivo', '申し込む前に利用規約を必ず確認しよう。', 'Vamos verificar os termos de uso antes de contratar.'],
  ['ja-v4-b2-4', '解約条件', 'kaiyaku jouken', 'Condições de cancelamento', 'Substantivo', '解約条件が分かりにくく表示されていた。', 'As condições de cancelamento estavam exibidas de forma confusa.'],
  ['ja-v4-b2-4', '返金', 'henkin', 'Reembolso', 'Substantivo', '不当な請求に対して返金を求めた。', 'Solicitei reembolso diante da cobrança indevida.'],

  // B2: ja-v4-b2-5
  ['ja-v4-b2-5', '孤立感', 'koritsukan', 'Sensação de isolamento', 'Substantivo', '在宅勤務が長引くと孤立感を覚えやすい。', 'Quando o trabalho remoto se prolonga, é fácil sentir isolamento.'],
  ['ja-v4-b2-5', '業務効率', 'gyoumu kouritsu', 'Eficiência operacional', 'Substantivo', 'ツールの導入で業務効率が大幅に上がった。', 'A eficiência operacional subiu bastante com a adoção da ferramenta.'],
  ['ja-v4-b2-5', '雑談', 'zatsudan', 'Conversa informal / Bate-papo', 'Substantivo', 'オンラインでも雑談の時間を設けることが大切だ。', 'Mesmo online, é importante reservar tempo para conversas informais.'],

  // B2: ja-v4-b2-6
  ['ja-v4-b2-6', '過疎化', 'kasoka', 'Despovoamento (rural)', 'Substantivo', '地方の過疎化に伴い空き家が増えている。', 'Com o despovoamento do interior, aumentam os imóveis vazios.'],
  ['ja-v4-b2-6', '家賃高騰', 'yachin koutou', 'Alta dos aluguéis', 'Substantivo', '都心の家賃高騰により郊外へ移る人が増えた。', 'Devido à alta dos aluguéis no centro, aumentou quem se muda para o subúrbio.'],
  ['ja-v4-b2-6', '再生', 'saisei', 'Revitalização / Reabilitação', 'Substantivo', '古い古民家をカフェとして再生する取り組みが進む。', 'Avançam iniciativas para revitalizar casas antigas como cafés.'],

  // B2: ja-v4-b2-7
  ['ja-v4-b2-7', '積立', 'tsumitate', 'Acumulação / Aporte periódico', 'Substantivo', '毎月少額から積立投資を始められます。', 'É possível começar investimentos recorrentes com valores baixos todo mês.'],
  ['ja-v4-b2-7', '複利', 'fukuri', 'Juros compostos', 'Substantivo', '長期投資では複利の効果が大きく働く。', 'Nos investimentos de longo prazo, o efeito dos juros compostos é grande.'],
  ['ja-v4-b2-7', '流動性', 'ryuudousei', 'Liquidez', 'Substantivo', '緊急時に備えて流動性の高い資産も持つべきだ。', 'Convém manter também ativos de alta liquidez para emergências.'],

  // B2: ja-v4-b2-8
  ['ja-v4-b2-8', '再生可能エネルギー', 'saisei kanou enerugii', 'Energia renovável', 'Substantivo', '再生可能エネルギーの導入比率を高める計画だ。', 'O plano é elevar a proporção de energia renovável.'],
  ['ja-v4-b2-8', '送電網', 'soudenmou', 'Rede de transmissão elétrica', 'Substantivo', '地域間の送電網を強化することが急務だ。', 'Reforçar a rede de transmissão entre regiões é urgente.'],
  ['ja-v4-b2-8', '出力制御', 'shutsuryoku seigyo', 'Controle de geração/potência', 'Substantivo', '電力が余る時間帯には出力制御が行われる。', 'Nos horários de excesso de energia, realiza-se controle de geração.'],

  // B2: ja-v4-b2-9
  ['ja-v4-b2-9', '方言', 'hougen', 'Dialeto regional', 'Substantivo', '地域ごとの方言には豊かな表現が残っている。', 'Nos dialetos de cada região permanecem expressões ricas.'],
  ['ja-v4-b2-9', '伝統行事', 'dentou gyouji', 'Festividade / Evento tradicional', 'Substantivo', '地元の伝統行事を次の世代へ引き継ぐ。', 'Transmitir as festividades tradicionais locais à próxima geração.'],
  ['ja-v4-b2-9', '保存', 'hozon', 'Preservação', 'Substantivo', '歴史的な資料をデジタルで保存する活動が始まった。', 'Começou uma iniciativa para preservar documentos históricos digitalmente.'],

  // B2: ja-v4-b2-10
  ['ja-v4-b2-10', '支援型', 'shiengata', 'Estilo de apoio / Servidor', 'Substantivo', '近年は支援型のリーダーシップが注目されている。', 'Nos últimos anos, a liderança de apoio vem ganhando destaque.'],
  ['ja-v4-b2-10', '自律性', 'jiritsusei', 'Autonomia', 'Substantivo', 'メンバーの自律性を尊重することで成長を促す。', 'Estimula-se o crescimento respeitando a autonomia dos membros.'],
  ['ja-v4-b2-10', '対話', 'taiwa', 'Diálogo', 'Substantivo', '定期的な一対一の対話が信頼関係を築く。', 'O diálogo individual regular constrói uma relação de confiança.'],

  // B2: ja-taboo-register-b2
  ['ja-taboo-register-b2', 'むかつく', 'mukatsuku', 'Dar raiva / Irritar', 'Registro Informal', '約束を急にドタキャンされて本当にむかつく。', 'Fico muito irritado quando cancelam um compromisso em cima da hora.'],
  ['ja-taboo-register-b2', '失礼ですが', 'shitsurei desu ga', 'Com licença, mas... (polido)', 'Expressão Formal', '失礼ですが、もう一度お名前をお伺いできますか。', 'Com licença, mas poderia perguntar seu nome novamente?'],

  // C1: ja-c1-1
  ['ja-c1-1', '〜に際して', '~ni saishite', 'Por ocasião de / Ao realizar', 'Gramática', '新サービスの開始に際して、説明会を開催いたします。', 'Por ocasião do lançamento do novo serviço, realizaremos uma sessão explicativa.'],
  ['ja-c1-1', '概要', 'gaiyou', 'Visão geral / Resumo executivo', 'Substantivo', '提案書を踏まえて事業の概要をご説明します。', 'Com base na proposta, explicarei a visão geral do projeto.'],
  ['ja-c1-1', '見解', 'kenkai', 'Parecer / Posição oficial', 'Substantivo', '委員会の公式な見解が示された。', 'Foi apresentado o parecer oficial do comitê.'],

  // C1: ja-c1-2
  ['ja-c1-2', '覚悟', 'kakugo', 'Determinação / Prontidão', 'Substantivo', '引き受けたからには、やり遂げる覚悟がある。', 'Uma vez que assumi, tenho a determinação de concluir até o fim.'],
  ['ja-c1-2', '苦渋の決断', 'kujuu no ketsudan', 'Decisão difícil / amarga', 'Expressão', '業績悪化を受け、苦渋の決断を下さざるを得なかった。', 'Diante da piora dos resultados, não houve alternativa senão tomar uma decisão difícil.'],
  ['ja-c1-2', '見直す', 'minaosu', 'Rever / Reavaliar', 'Verbo', '価格設定を根本から見直す必要がある。', 'É preciso rever a precificação pela raiz.'],

  // C1: ja-c1-3
  ['ja-c1-3', '懸念', 'kenen', 'Preocupação / Apreensão', 'Substantivo', 'このまま放置すれば深刻な事態を招きかねないという懸念がある。', 'Há o receio de que, se deixarmos assim, possa levar a uma situação grave.'],
  ['ja-c1-3', '同情', 'doujou', 'Compaixão / Simpatia', 'Substantivo', '彼の境遇を聞くと同情せずにはいられない。', 'Ao ouvir sobre a situação dele, não consigo deixar de sentir compaixão.'],
  ['ja-c1-3', '慎重', 'shinchou', 'Cauteloso / Prudente', 'Adjetivo', '結論を出すには慎重な検討が求められる。', 'Exige-se análise cautelosa para chegar a uma conclusão.'],

  // C1: ja-c1-4
  ['ja-c1-4', '〜に至って', '~ni itatte', 'Ao chegar ao ponto de', 'Gramática', '事態がここに至って、ようやく対策が講じられた。', 'Chegando a esse ponto, finalmente medidas foram tomadas.'],
  ['ja-c1-4', '経緯', 'keii', 'Circunstâncias / Histórico dos fatos', 'Substantivo', '交渉が決裂した経緯を詳細に報告する。', 'Relatar em detalhes o histórico que levou ao rompimento da negociação.'],
  ['ja-c1-4', '収束', 'shuusoku', 'Convergência / Controle (de crise)', 'Substantivo', '長引く協議の末に、ようやく事態が収束に向かった。', 'Após longas tratativas, a situação finalmente caminhou para o controle.'],

  // C1: ja-c1-5
  ['ja-c1-5', '〜であれ', '~de are', 'Seja qual/quem for', 'Gramática', 'いかなる理由であれ、不正行為は許されない。', 'Seja qual for o motivo, atos ilícitos não são tolerados.'],
  ['ja-c1-5', '例外', 'reigai', 'Exceção', 'Substantivo', 'ベテランといえども例外なく研修を受ける。', 'Mesmo os veteranos participam do treinamento sem exceção.'],
  ['ja-c1-5', '左右する', 'sayuu suru', 'Determinar / Influenciar decisivamente', 'Verbo', '初動の対応いかんが、その後の結果を大きく左右する。', 'A forma da resposta inicial determina fortemente o resultado seguinte.'],

  // C1: ja-c1-6
  ['ja-c1-6', '本質', 'honshitsu', 'Essência / Natureza fundamental', 'Substantivo', '問題の本質は構造的な欠陥にほかならない。', 'A essência do problema não é outra coisa senão uma falha estrutural.'],
  ['ja-c1-6', '裏付け', 'urazuke', 'Comprovação / Respaldo', 'Substantivo', '主張には客観的な裏付けが不可欠だ。', 'Um respaldo objetivo é indispensável para a argumentação.'],
  ['ja-c1-6', '余地', 'yochi', 'Margem / Espaço para', 'Substantivo', '改善の余地がまったくないことはない。', 'Não é que não haja nenhuma margem para melhoria.'],

  // C1: ja-c1-7
  ['ja-c1-7', '無関心', 'mukanshin', 'Indiferença / Apatia', 'Substantivo', '周囲の批判をよそに、彼は無関心を装った。', 'Alheio às críticas ao redor, ele fingiu indiferença.'],
  ['ja-c1-7', '先入観', 'sennyuukan', 'Preconceito / Ideia pré-concebida', 'Substantivo', '経験が浅いからといって先入観で判断すべきではない。', 'Não é porque alguém tem pouca experiência que se deve julgar com preconceito.'],
  ['ja-c1-7', '悔やむ', 'kuyamu', 'Lamentar / Arrepender-se', 'Verbo', '一言余計なことを言ったばかりに、今も深く悔やむ日々だ。', 'Só por ter dito uma palavra a mais, até hoje passo os dias me arrependendo profundamente.'],

  // C1: ja-c1-8
  ['ja-c1-8', '〜極まる', '~kiwamaru', 'Extremamente (formal)', 'Gramática', '準備不足のまま本番に臨むとは無謀極まる行為だ。', 'Enfrentar a apresentação sem preparo é um ato extremamente imprudente.'],
  ['ja-c1-8', '偏重', 'henchou', 'Ênfase excessiva / Desequilíbrio', 'Substantivo', '短期的な利益を偏重するきらいがある。', 'Há uma tendência a enfatizar excessivamente o lucro de curto prazo.'],
  ['ja-c1-8', '痛感', 'tsuukan', 'Sentir profundamente', 'Substantivo', '自らの力不足を痛感した至極の経験だった。', 'Foi uma experiência marcante em que senti profundamente minha própria limitação.'],

  // C1: ja-c1-9
  ['ja-c1-9', '実態', 'jittai', 'Realidade concreta / Estado real', 'Substantivo', '現場の実態に即してルールを改定する。', 'Revisar as regras em conformidade com a realidade do local.'],
  ['ja-c1-9', '波及', 'hakyuu', 'Repercussão / Propagação', 'Substantivo', 'その影響は国内にとどまらず世界へ波及した。', 'Esse impacto não se limitou ao país, propagando-se pelo mundo.'],
  ['ja-c1-9', '論議', 'rongi', 'Debate / Discussão formal', 'Substantivo', '新法案をめぐって国会で激しい論議が交わされた。', 'Houve um intenso debate no Parlamento em torno do novo projeto de lei.'],

  // C1: ja-c1-10
  ['ja-c1-10', '存じ上げる', 'zonjiageru', 'Conhecer / Saber (Kenjougo)', 'Keigo', '先方のご担当者のお名前はかねてより存じ上げる次第です。', 'Já conheço há algum tempo o nome do responsável da outra parte.'],
  ['ja-c1-10', 'ご尽力', 'gojinryoku', 'Seu empenho / esforços (honorífico)', 'Keigo', '関係各位のご尽力に心より感謝申し上げます。', 'Agradeço sinceramente pelo empenho de todos os envolvidos.'],
  ['ja-c1-10', '恐縮', 'kyoushuku', 'Constrangido / Grato (modéstia formal)', 'Keigo', 'お忙しいところ誠に恐縮ですが、ご確認いただけますでしょうか。', 'Peço desculpas pelo incômodo em meio à sua agenda cheia, mas poderia verificar?'],

  // C1: ja-v4-c1-1
  ['ja-v4-c1-1', '謝罪会見', 'shazai kaiken', 'Coletiva de desculpas', 'Substantivo', '経営陣は速やかに謝罪会見を開いた。', 'A diretoria realizou rapidamente uma coletiva de pedido de desculpas.'],
  ['ja-v4-c1-1', '再発防止策', 'saihatsu boushishaku', 'Medidas preventivas de reincidência', 'Substantivo', '実効性のある再発防止策を公表した。', 'Foram divulgadas medidas eficazes para evitar a reincidência.'],
  ['ja-v4-c1-1', '初動対応', 'shodou taiou', 'Resposta inicial', 'Substantivo', '危機管理においては初動対応の速さが命運を分ける。', 'Na gestão de crises, a rapidez da resposta inicial define o desfecho.'],

  // C1: ja-v4-c1-2
  ['ja-v4-c1-2', '金融緩和', 'kinyuu kanwa', 'Afrouxamento monetário', 'Substantivo', '長期にわたる金融緩和政策の転換点が議論されている。', 'Discute-se o ponto de inflexão da prolongada política de afrouxamento monetário.'],
  ['ja-v4-c1-2', '為替介入', 'kawase kainyuu', 'Intervenção cambial', 'Substantivo', '急激な円安を受け、為替介入への警戒感が高まった。', 'Diante da rápida desvalorização do iene, aumentou o alerta para intervenção cambial.'],
  ['ja-v4-c1-2', '物価高騰', 'bukka koutou', 'Disparada dos preços', 'Substantivo', '物価高騰が家計の購買力を圧迫している。', 'A disparada dos preços está pressionando o poder de compra das famílias.'],

  // C1: ja-v4-c1-3
  ['ja-v4-c1-3', '損害賠償', 'songai baishou', 'Indenização por danos', 'Substantivo', '契約違反に対する損害賠償の上限を定めた。', 'Foi definido o limite de indenização por violação contratual.'],
  ['ja-v4-c1-3', '守秘義務', 'shuhi gimu', 'Obrigação de confidencialidade', 'Substantivo', '契約終了後も守秘義務は一定期間存続する。', 'Mesmo após o término do contrato, o sigilo permanece vigente por certo período.'],
  ['ja-v4-c1-3', '準拠法', 'junkyohou', 'Lei aplicável (jurisdição)', 'Substantivo', '国際取引では準拠法を日本法とする条項を設けた。', 'Em transações internacionais, estabeleceu-se cláusula definindo a lei japonesa como aplicável.'],

  // C1: ja-v4-c1-4
  ['ja-v4-c1-4', '先行研究', 'senkou kenkyuu', 'Estudos anteriores / Literatura prévia', 'Substantivo', '本論文は先行研究の課題を的確に整理している。', 'Este artigo organiza com precisão as lacunas dos estudos anteriores.'],
  ['ja-v4-c1-4', '再現性', 'saigensei', 'Reprodutibilidade', 'Substantivo', '実験結果の再現性を担保する記述が不足している。', 'Falta detalhamento que garanta a reprodutibilidade dos resultados experimentais.'],
  ['ja-v4-c1-4', '独自性', 'dokujisei', 'Originalidade', 'Substantivo', '本研究の独自性は新たな分析枠組みにある。', 'A originalidade desta pesquisa reside no novo arcabouço analítico.'],

  // C1: ja-v4-c1-5
  ['ja-v4-c1-5', '少子高齢化', 'shoushi koureika', 'Baixa natalidade e envelhecimento', 'Substantivo', '少子高齢化により医療費の増大が避けられない。', 'Com o envelhecimento populacional, o aumento dos gastos médicos é inevitável.'],
  ['ja-v4-c1-5', '財源', 'zaigen', 'Fonte de receita / Recursos públicos', 'Substantivo', '社会保障の拡充には安定的な財源の確保が前提となる。', 'A ampliação da seguridade social pressupõe garantir fontes estáveis de recursos.'],
  ['ja-v4-c1-5', '世代間格差', 'sedaikan kakusa', 'Desigualdade intergeracional', 'Substantivo', '制度設計では世代間格差の是正が重視されている。', 'Na formulação do sistema, prioriza-se corrigir a desigualdade entre gerações.'],

  // C1: ja-v4-c1-6
  ['ja-v4-c1-6', '標的型攻撃', 'hyoutekigata kougeki', 'Ataque direcionado', 'Substantivo', '官公庁を狙った標的型攻撃の手口が巧妙化している。', 'As táticas de ataques direcionados contra órgãos públicos estão mais sofisticadas.'],
  ['ja-v4-c1-6', '情報漏洩', 'jouhou roueii', 'Vazamento de informações', 'Substantivo', '情報漏洩を防ぐため二段階認証を必須とした。', 'Tornou-se obrigatória a autenticação em duas etapas para evitar vazamento de dados.'],
  ['ja-v4-c1-6', 'インシデント', 'inshidento', 'Incidente de segurança', 'Substantivo', 'セキュリティインシデント発生時の連絡体制を整える。', 'Estruturar o fluxo de comunicação para casos de incidente de segurança.'],

  // C1: ja-v4-c1-7
  ['ja-v4-c1-7', '拝啓', 'haikei', 'Prezado(a) (abertura epistolar formal)', 'Retórica Formal', '拝啓 時下ますますご清栄のこととお慶び申し上げます。', 'Prezado(a), congratulo-me por sua contínua prosperidade neste momento.'],
  ['ja-v4-c1-7', 'ご厚情', 'gokoujou', 'Sua generosidade / gentileza', 'Keigo', '平素は格別のご厚情を賜り、厚く御礼申し上げます。', 'Agradeço profundamente por sua costumeira e especial gentileza.'],
  ['ja-v4-c1-7', '敬具', 'keigu', 'Atenciosamente (fechamento formal)', 'Retórica Formal', '略儀ながら書中をもちまして御礼申し上げます。敬具', 'Embora de forma sucinta, apresento meus agradecimentos por carta. Atenciosamente.'],

  // C1: ja-v4-c1-8
  ['ja-v4-c1-8', '多国間', 'takokukan', 'Multilateral', 'Substantivo', '気候変動対策には多国間の枠組みが欠かせない。', 'Para enfrentar as mudanças climáticas, um arcabouço multilateral é indispensável.'],
  ['ja-v4-c1-8', '国益', 'kokueki', 'Interesse nacional', 'Substantivo', '外交交渉では国益と国際協調の両立が図られる。', 'Nas negociações diplomáticas busca-se conciliar o interesse nacional e a cooperação internacional.'],
  ['ja-v4-c1-8', '経済安全保障', 'keizai anzen hoshou', 'Segurança econômica', 'Substantivo', 'サプライチェーンの確保は経済安全保障の要である。', 'Garantir as cadeias de suprimentos é pilar da segurança econômica.'],

  // C1: ja-v4-c1-9
  ['ja-v4-c1-9', '著作権', 'chosakuken', 'Direitos autorais', 'Substantivo', '学習データの利用と著作権保護の調和が問われている。', 'Questiona-se a harmonia entre o uso de dados de treinamento e a proteção autoral.'],
  ['ja-v4-c1-9', 'バイアス', 'baiasu', 'Viés algorítmico', 'Substantivo', '過去のデータに潜むバイアスが差別を助長しかねない。', 'O viés oculto em dados históricos pode acabar acentuando discriminações.'],
  ['ja-v4-c1-9', '法規制', 'houkisei', 'Regulamentação legal', 'Substantivo', '技術革新を阻害しない適切な法規制が求められている。', 'Busca-se uma regulamentação legal adequada que não freie a inovação tecnológica.'],

  // C1: ja-v4-c1-10
  ['ja-v4-c1-10', '疎外感', 'sogaikan', 'Sentimento de alienação', 'Substantivo', '近代化の中で個人が抱く疎外感が描かれている。', 'Retrata-se o sentimento de alienação vivido pelo indivíduo na modernização.'],
  ['ja-v4-c1-10', '比喩', 'hiyu', 'Metáfora / Figura de linguagem', 'Substantivo', '作品全体の比喩を読み解くことで主題が浮かび上がる。', 'Ao decifrar as metáforas da obra inteira, o tema central emerge.'],
  ['ja-v4-c1-10', '文体', 'buntai', 'Estilo literário', 'Substantivo', '簡潔でありながら余韻を残す独自の文体が特徴だ。', 'Caracteriza-se por um estilo literário próprio, conciso e repleto de ressonância.'],
];

export const VOCAB_FIXES_JA: VocabExampleFixMap = {
  'voc-ja-a1-4-3': {
    exampleEn: 'このかばんは少し高いですね。',
    examplePt: 'Esta bolsa é um pouco cara, não é?',
  },
  'voc-ja-a1-6-3': {
    exampleEn: '銀行は郵便局の隣にあります。',
    examplePt: 'O banco fica ao lado do correio.',
  },
  'voc-ja-v4-a1-2-1': {
    exampleEn: '駅の近くに大きな薬局があります。',
    examplePt: 'Há uma farmácia grande perto da estação.',
  },
  'voc-ja-v4-a1-2-2': {
    exampleEn: '昨日の夜から少し熱があるんです。',
    examplePt: 'Estou com um pouco de febre desde ontem à noite.',
  },
  'voc-ja-v4-a1-6-1': {
    exampleEn: 'このコートを試着することはできますか。',
    examplePt: 'Posso experimentar este casaco?',
  },
  'voc-ja-v4-a1-9-1': {
    exampleEn: '来週、駅前の美容院へ行く予定です。',
    examplePt: 'Pretendo ir ao salão de beleza em frente à estação na semana que vem.',
  },
  'voc-ja-v4-a1-9-3': {
    exampleEn: '土曜日の午後にカットを予約することはできますか。',
    examplePt: 'Posso agendar um corte para sábado à tarde?',
  },
  'voc-ja-v4-a1-10-2': {
    exampleEn: '電車が止まって、少し遅れるかもしれません。',
    examplePt: 'O trem parou, então talvez eu me atrase um pouco.',
  },
  'voc-ja-a2-8-3': {
    exampleEn: '雪が降っているので、到着が遅れると思います。',
    examplePt: 'Como está nevando, acho que a chegada vai atrasar.',
  },
  'voc-ja-v4-a2-3-1': {
    exampleEn: 'すみません、私は卵の食物アレルギーがあります。',
    examplePt: 'Com licença, eu tenho alergia alimentar a ovo.',
  },
  'voc-ja-v4-a2-3-2': {
    exampleEn: 'この料理にはエビが含まれるので気をつけてください。',
    examplePt: 'Este prato contém camarão, então tome cuidado.',
  },
  'voc-ja-v4-a2-3-3': {
    exampleEn: 'すみませんが、ネギを抜くことはできますか。',
    examplePt: 'Com licença, seria possível retirar a cebolinha?',
  },
  'voc-ja-v4-a2-4-1': {
    exampleEn: '空港で荷物の紛失届を出しました。',
    examplePt: 'Fiz o registro de extravio de bagagem no aeroporto.',
  },
  'voc-ja-v4-a2-5-1': {
    exampleEn: '実家から宅配便でみかんが届きました。',
    examplePt: 'Chegaram mexericas por entrega expressa da casa dos meus pais.',
  },
  'voc-ja-v4-a2-6-1': {
    exampleEn: '今日ジムに入会したいのですが、何が必要ですか。',
    examplePt: 'Quero me matricular na academia hoje; o que é necessário?',
  },
  'voc-ja-v4-a2-6-3': {
    exampleEn: '季節の変わり目は体調管理に気をつけています。',
    examplePt: 'Na mudança de estação, tomo cuidado com o controle da saúde.',
  },
  'voc-ja-v4-a2-7-3': {
    exampleEn: '昨日、お隣の田中さんにご挨拶しました。',
    examplePt: 'Ontem cumprimentei o Sr. Tanaka, meu vizinho do lado.',
  },
  'voc-ja-v4-a2-8-3': {
    exampleEn: '予約の日時を変更することは可能でしょうか。',
    examplePt: 'Seria possível alterar a data e hora do agendamento?',
  },
  'voc-ja-v4-a2-10-2': {
    exampleEn: '強火で野菜をさっと炒めるのがおいしさのコツです。',
    examplePt: 'Saltear os legumes rapidamente em fogo alto é o segredo do sabor.',
  },
  'voc-ja-b1-1-1': {
    exampleEn: '田中さんがいつも親切に教えてくれるので助かります。',
    examplePt: 'O Tanaka sempre me ensina com gentileza, o que ajuda muito.',
  },
  'voc-ja-b1-1-2': {
    exampleEn: '同僚にプレゼンの資料をチェックしてもらう予定です。',
    examplePt: 'Pretendo pedir para um colega revisar o material da apresentação.',
  },
  'voc-ja-b1-2-2': {
    exampleEn: '毎日練習すれば、日本語が自然に話せるようになるはずです。',
    examplePt: 'Se praticar todos os dias, você certamente passará a falar japonês naturalmente.',
  },
  'voc-ja-b1-5-3': {
    exampleEn: '会議の議事録をチーム全員と共有する必要があります。',
    examplePt: 'É necessário compartilhar a ata da reunião com toda a equipe.',
  },
  'voc-ja-b1-6-1': {
    exampleEn: '上司に仕事を褒められると、もっと頑張ろうと思えます。',
    examplePt: 'Quando sou elogiado pelo chefe no trabalho, sinto vontade de me esforçar ainda mais.',
  },
  'voc-ja-b1-6-2': {
    exampleEn: '傘を持っていない日に雨に降られると本当に困ります。',
    examplePt: 'Pegar chuva num dia em que não estou com guarda-chuva é muito complicado.',
  },
  'voc-ja-b1-6-3': {
    exampleEn: '日本代表に選ばれるなんて、本当に光栄なことです。',
    examplePt: 'Ser escolhido para a seleção do Japão é realmente uma grande honra.',
  },
  'voc-ja-b1-7-1': {
    exampleEn: 'この小説は家族の絆について深く考えさせる作品です。',
    examplePt: 'Este romance é uma obra que faz pensar profundamente sobre os laços familiares.',
  },
  'voc-ja-b1-7-3': {
    exampleEn: '毎週長い報告書を書かされるので、残業が増えました。',
    examplePt: 'Como sou obrigado a escrever relatórios longos toda semana, minhas horas extras aumentaram.',
  },
  'voc-ja-b1-8-1': {
    exampleEn: '人気のお店なので、事前に席を予約しておくほうがいいです。',
    examplePt: 'Como é um restaurante popular, é melhor reservar a mesa de antemão.',
  },
  'voc-ja-b1-8-2': {
    exampleEn: '難しそうですが、まずは自分でやってみるつもりです。',
    examplePt: 'Parece difícil, mas primeiro pretendo tentar fazer por conta própria.',
  },
  'voc-ja-b1-9-3': {
    exampleEn: '朝晩がだんだん涼しくなってくる季節ですね。',
    examplePt: 'É a estação em que as manhãs e noites vão ficando mais frescas, né?',
  },
  'voc-ja-b1-10-1': {
    exampleEn: 'あそこで電話をかけている人は新しい部長です。',
    examplePt: 'A pessoa que está falando ao telefone ali é o novo gerente.',
  },
  'voc-ja-b1-10-2': {
    exampleEn: '京都で見た紅葉の景色は、今でも強く印象に残る思い出です。',
    examplePt: 'A paisagem das folhas de outono que vi em Quioto é uma lembrança que continua viva na memória.',
  },
  'voc-ja-v4-b1-1-3': {
    exampleEn: '症状が続く場合は、早めに専門医を受診するべきです。',
    examplePt: 'Se os sintomas continuarem, deve-se consultar um especialista o quanto antes.',
  },
  'voc-ja-v4-b1-3-1': {
    exampleEn: 'カードをなくしたので、すぐに利用停止の手続きをしました。',
    examplePt: 'Como perdi o cartão, fiz imediatamente o procedimento de bloqueio.',
  },
  'voc-ja-v4-b1-4-2': {
    exampleEn: '保険金の請求には医師の診断書が必要です。',
    examplePt: 'Para solicitar o reembolso do seguro, é necessário um laudo médico.',
  },
  'voc-ja-v4-b1-7-3': {
    exampleEn: 'ボランティアでの経験は地域社会にきっと役に立つと思います。',
    examplePt: 'Acho que a experiência no voluntariado certamente será útil para a comunidade.',
  },
  'voc-ja-v4-b1-10-1': {
    exampleEn: '何度見てもこのラストシーンには感動する人が多いです。',
    examplePt: 'Muitas pessoas se emocionam com essa cena final, não importa quantas vezes vejam.',
  },
  'voc-ja-idioms-b1-3': {
    exampleEn: 'このくらいの計算なら、彼にとっては朝飯前だよ。',
    examplePt: 'Um cálculo desses é moleza para ele.',
  },
  'voc-ja-idioms-b1-4': {
    exampleEn: '彼女は口が堅いから、秘密を話しても安心だ。',
    examplePt: 'Ela sabe guardar segredo, então dá para contar tranquilamente.',
  },
  'voc-ja-slang-b1-3': {
    exampleEn: '駅前にできた新しいラーメン屋、めっちゃおいしいよ！',
    examplePt: 'A nova casa de lámen em frente à estação é muito gostosa!',
  },
  'voc-ja-b2-1-1': {
    exampleEn: '社長、こちらの新しい企画書をもうご覧になるお時間はありますか。',
    examplePt: 'Presidente, o senhor já tem tempo para dar uma olhada nesta nova proposta?',
  },
  'voc-ja-b2-1-2': {
    exampleEn: 'お送りいただいた資料は、後ほど必ず拝見する予定です。',
    examplePt: 'Pretendo ler sem falta mais tarde o material que nos enviou.',
  },
  'voc-ja-b2-1-3': {
    exampleEn: '来週の火曜日に御社へ伺う予定でございます。',
    examplePt: 'Está previsto que eu visite a sua empresa na próxima terça-feira.',
  },
  'voc-ja-b2-2-3': {
    exampleEn: '悪天候にもかかわらず、多くの参加者が会場に集まった。',
    examplePt: 'Apesar do mau tempo, muitos participantes se reuniram no local.',
  },
  'voc-ja-v4-b2-1-1': {
    exampleEn: 'チーム内の合意形成には、丁寧な対話が欠かせません。',
    examplePt: 'Para construir consenso na equipe, um diálogo cuidadoso é indispensável.',
  },
  'voc-ja-v4-b2-2-2': {
    exampleEn: 'SNSで流れてくる情報をそのまま鵜呑みにするのは危険です。',
    examplePt: 'É perigoso engolir sem questionar as informações que circulam nas redes sociais.',
  },
  'voc-ja-v4-b2-2-3': {
    exampleEn: 'その記事の信憑性を一次情報で確かめる必要があります。',
    examplePt: 'É necessário verificar a credibilidade desse artigo com fontes primárias.',
  },
  'voc-ja-v4-b2-5-2': {
    exampleEn: 'リモートワークの普及に伴い、成果主義を導入する企業が増えた。',
    examplePt: 'Com a difusão do trabalho remoto, aumentaram as empresas que adotam a avaliação por resultados.',
  },
  'voc-ja-v4-b2-7-1': {
    exampleEn: 'リスクを抑えるために、複数の資産へ分散投資をしています。',
    examplePt: 'Para conter os riscos, faço investimentos diversificados em vários ativos.',
  },
  'voc-ja-v4-b2-7-2': {
    exampleEn: '投資信託には元本割れのリスクがあることを理解しておくべきだ。',
    examplePt: 'Deve-se entender que fundos de investimento têm o risco de perda abaixo do capital inicial.',
  },
  'voc-ja-v4-b2-9-2': {
    exampleEn: '地方の伝統工芸では、若い担い手の不足が深刻です。',
    examplePt: 'No artesanato tradicional do interior, a falta de jovens continuadores é grave.',
  },
  'voc-ja-v4-b2-9-3': {
    exampleEn: '新しい文化が地域にしっかりと根付くには時間がかかります。',
    examplePt: 'Leva tempo para que uma nova cultura se enraíze firmemente na região.',
  },
  'voc-ja-v4-b2-10-1': {
    exampleEn: '部下の悩みに耳を傾ける傾聴の姿勢が信頼を生みます。',
    examplePt: 'Uma postura de escuta ativa diante das preocupações da equipe gera confiança.',
  },
  'voc-ja-v4-b2-10-2': {
    exampleEn: '適切な権限委譲を行うことで、組織の意思決定が速くなります。',
    examplePt: 'Ao delegar autoridade adequadamente, a tomada de decisão da organização fica mais rápida.',
  },
  'voc-ja-taboo-register-b2-1': {
    exampleEn: 'くそっ、あと一歩だったのに逃してしまった！',
    examplePt: 'Droga, faltava só um passo e deixei escapar!',
  },
  'voc-ja-taboo-register-b2-3': {
    exampleEn: 'そんなバカな話、誰が信じるんだよ。',
    examplePt: 'Quem é que vai acreditar numa história absurda dessas?',
  },
  'voc-ja-c1-3-2': {
    exampleEn: '規定により、個別の条件変更には応じかねる状況でございます。',
    examplePt: 'De acordo com o regulamento, não podemos atender a alterações individuais de condições.',
  },
  'voc-ja-c1-4-2': {
    exampleEn: '採算の悪化により、一部店舗からの撤退を余儀なくされる見通しだ。',
    examplePt: 'Devido à queda na rentabilidade, prevê-se que a empresa seja forçada a se retirar de algumas unidades.',
  },
  'voc-ja-c1-10-3': {
    exampleEn: '今後とも変わらぬご指導を賜るよう、心よりお願い申し上げます。',
    examplePt: 'Solicito sinceramente que continuemos a receber sua orientação.',
  },
  'voc-ja-v4-c1-1-1': {
    exampleEn: '不祥事の発生を受け、企業としての説明責任が厳しく問われている。',
    examplePt: 'Diante do escândalo, a responsabilidade de prestar contas da empresa está sendo cobrada com rigor.',
  },
  'voc-ja-v4-c1-4-1': {
    exampleEn: '国際誌への投稿論文は、厳格な査読を経て掲載可否が決まる。',
    examplePt: 'Artigos submetidos a periódicos internacionais têm sua publicação decidida após rigorosa revisão por pares.',
  },
  'voc-ja-v4-c1-4-2': {
    exampleEn: '研究手法の妥当性を客観的なデータで裏付ける必要がある。',
    examplePt: 'É necessário respaldar a validade da metodologia de pesquisa com dados objetivos.',
  },
  'voc-ja-v4-c1-4-3': {
    exampleEn: 'この調査結果は、新たな消費傾向を示唆する重要な資料だ。',
    examplePt: 'Este resultado de pesquisa é um material importante que sugere uma nova tendência de consumo.',
  },
  'voc-ja-v4-c1-6-3': {
    exampleEn: '流出した認証情報を悪用した二次被害の拡大が懸念されている。',
    examplePt: 'Teme-se a ampliação de danos secundários pelo uso indevido das credenciais vazadas.',
  },
  'voc-ja-v4-c1-9-2': {
    exampleEn: '医療や金融分野のAIには、判断根拠の説明可能性が不可欠だ。',
    examplePt: 'Para a IA nas áreas médica e financeira, a explicabilidade dos critérios de decisão é indispensável.',
  },
  'voc-ja-v4-c1-9-3': {
    exampleEn: '生成AIの急速な普及は、利便性の裏で深刻なリスクを孕む。',
    examplePt: 'A rápida difusão da IA generativa carrega riscos sérios por trás da conveniência.',
  },
};

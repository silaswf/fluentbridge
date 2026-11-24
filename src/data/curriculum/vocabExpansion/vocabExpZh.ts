import type { VocabExampleFixMap, VocabExpansionTuple } from './types';

export const VOCAB_EXP_ZH: VocabExpansionTuple[] = [
  // ==================== A1 ====================
  // zh-a1-1: Os 4 Tons, Pinyin & Cumprimentos Essenciais (existing: 你好, 谢谢, 认识)
  ['zh-a1-1', '再见', 'zàijiàn', 'Tchau / até logo', 'Expressão', '时间不早了，我们明天再见吧。', 'Já está tarde, até amanhã!'],
  ['zh-a1-1', '请问', 'qǐngwèn', 'Com licença / por favor', 'Expressão', '请问，去地铁站怎么走？', 'Com licença, como chego à estação de metrô?'],
  ['zh-a1-1', '不客气', 'bú kèqi', 'De nada', 'Expressão', '不用谢，不客气，这是我应该做的。', 'Não há de quê, de nada, é o mínimo que eu podia fazer.'],

  // zh-a1-2: Números, Datas, Idade & Dinheiro (existing: 今天, 星期, 生日)
  ['zh-a1-2', '明天', 'míngtiān', 'Amanhã', 'Substantivo', '明天上午九点我有一节中文课。', 'Amanhã às nove da manhã tenho uma aula de chinês.'],
  ['zh-a1-2', '现在', 'xiànzài', 'Agora', 'Substantivo', '现在几点了？我怕迟到了。', 'Que horas são agora? Tenho medo de me atrasar.'],
  ['zh-a1-2', '岁', 'suì', 'Anos de idade', 'Classificador', '我妹妹今年十八岁，刚上大学。', 'Minha irmã mais nova tem dezoito anos e acabou de entrar na faculdade.'],

  // zh-a1-3: Classificadores (量词) & Café da Manhã (existing: 咖啡, 米饭, 多少钱)
  ['zh-a1-3', '杯', 'bēi', 'Copo / xícara (classificador)', 'Classificador', '早上我通常喝一杯热茶。', 'De manhã costumo tomar uma xícara de chá quente.'],
  ['zh-a1-3', '包子', 'bāozi', 'Pãozinho cozido no vapor recheado', 'Substantivo', '这家早点铺的肉包子特别香。', 'Os pãezinhos de carne desta lanchonete de café da manhã são muito cheirosos.'],
  ['zh-a1-3', '服务员', 'fúwùyuán', 'Garçom / atendente', 'Substantivo', '服务员，麻烦给我们加一点热水。', 'Garçom, por favor, nos traga um pouco mais de água quente.'],

  // zh-a1-4: Família, Posse com 的 (de) & Verbo 有 (yǒu) (existing: 家人, 没有, 哥哥)
  ['zh-a1-4', '爸爸', 'bàba', 'Pai / papai', 'Substantivo', '我爸爸每天早上都去公园散步。', 'Meu pai vai caminhar no parque todas as manhãs.'],
  ['zh-a1-4', '妈妈', 'māma', 'Mãe / mamãe', 'Substantivo', '妈妈做的红烧肉是我的最爱。', 'A carne refogada que minha mãe faz é a minha favorita.'],
  ['zh-a1-4', '妹妹', 'mèimei', 'Irmã mais nova', 'Substantivo', '我有一个妹妹，她很喜欢画画。', 'Eu tenho uma irmã mais nova, ela gosta muito de desenhar.'],

  // zh-a1-5: Rotina Diária & Ordem Tempo-Lugar-Ação (existing: 起床, 工作, 现在)
  ['zh-a1-5', '睡觉', 'shuìjiào', 'Dormir', 'Verbo', '我晚上十一点左右准备睡觉。', 'Eu me preparo para dormir por volta das onze da noite.'],
  ['zh-a1-5', '吃饭', 'chīfàn', 'Comer / fazer refeição', 'Verbo', '中午十二点我们在公司食堂吃饭。', 'Ao meio-dia almoçamos no refeitório da empresa.'],
  ['zh-a1-5', '学习', 'xuéxí', 'Estudar', 'Verbo', '我每天晚上在家学习一个小时汉语。', 'Todas as noites estudo chinês em casa por uma hora.'],

  // zh-a1-6: Localização com 在 (zài) & Direções Básicas (existing: 哪里, 旁边, 地铁站)
  ['zh-a1-6', '前面', 'qiánmiàn', 'Na frente', 'Substantivo', '银行就在前面那个路口，走两分钟就到。', 'O banco fica logo naquele cruzamento à frente, são dois minutos a pé.'],
  ['zh-a1-6', '左边', 'zuǒbiān', 'À esquerda', 'Substantivo', '洗手间在电梯左边，很容易找到。', 'O banheiro fica à esquerda do elevador, é bem fácil de achar.'],
  ['zh-a1-6', '附近', 'fùjìn', 'Nas proximidades / perto', 'Substantivo', '学校附近有一家很安静的书店。', 'Perto da escola há uma livraria bem tranquila.'],

  // zh-a1-7: Compras, Tamanhos, Cores & Pagamento QR (existing: 便宜, 衣服, 喜欢)
  ['zh-a1-7', '颜色', 'yánsè', 'Cor', 'Substantivo', '这件外套有黑色和蓝色两种颜色。', 'Este casaco tem duas cores: preto e azul.'],
  ['zh-a1-7', '扫码', 'sǎomǎ', 'Escanear QR code', 'Verbo', '您可以在收银台直接扫码付款。', 'Você pode escanear o código QR direto no caixa para pagar.'],
  ['zh-a1-7', '打折', 'dǎzhé', 'Dar desconto / entrar em promoção', 'Verbo', '周末这家店里的运动鞋都在打折。', 'No fim de semana todos os tênis desta loja estão em promoção.'],

  // zh-a1-8: Clima, Estações do Ano & Planos Simples (existing: 天气, 下雨, 公园)
  ['zh-a1-8', '暖和', 'nuǎnhuo', 'Agradável / quentinho', 'Adjetivo', '春天来了，天气变得越来越暖和。', 'A primavera chegou e o clima está ficando cada vez mais agradável.'],
  ['zh-a1-8', '冷', 'lěng', 'Frio', 'Adjetivo', '今天刮大风，外面比昨天冷多了。', 'Hoje está ventando forte, lá fora está bem mais frio que ontem.'],
  ['zh-a1-8', '夏天', 'xiàtiān', 'Verão', 'Substantivo', '夏天我最喜欢和朋友去海边游泳。', 'No verão o que eu mais gosto é ir nadar na praia com amigos.'],

  // zh-a1-9: Hobbies, Esportes & Frequência (existing: 爱好, 电影, 运动)
  ['zh-a1-9', '常常', 'chángcháng', 'Frequentemente', 'Advérbio', '周末我常常去图书馆看书。', 'Nos fins de semana eu frequentemente vou à biblioteca ler.'],
  ['zh-a1-9', '游泳', 'yóuyǒng', 'Nadar', 'Verbo', '她每周二和周四晚上都去游泳。', 'Toda terça e quinta à noite ela vai nadar.'],
  ['zh-a1-9', '听音乐', 'tīng yīnyuè', 'Ouvir música', 'Expressão', '坐地铁上班的时候，我习惯戴耳机听音乐。', 'Quando vou de metrô para o trabalho, costumo usar fones para ouvir música.'],

  // zh-a1-10: Casa, Moradia & Perguntas com 吗 / 呢 / 吧 (existing: 方便, 房间, 附近)
  ['zh-a1-10', '客厅', 'kètīng', 'Sala de estar', 'Substantivo', '这个公寓的客厅很大，阳光也很好。', 'A sala de estar deste apartamento é bem grande e pega bastante sol.'],
  ['zh-a1-10', '厨房', 'chúfáng', 'Cozinha', 'Substantivo', '我每天下班后都在厨房自己做晚饭。', 'Todos os dias depois do trabalho eu mesmo faço o jantar na cozinha.'],
  ['zh-a1-10', '安静', 'ānjìng', 'Tranquilo / silencioso', 'Adjetivo', '我家小区晚上很安静，非常适合休息。', 'Meu condomínio é muito tranquilo à noite, ótimo para descansar.'],

  // ==================== V4 A1 ====================
  // zh-v4-a1-1: Compras no Supermercado e Peso em 斤 (existing: 斤, 超市, 袋子)
  ['zh-v4-a1-1', '水果', 'shuǐguǒ', 'Frutas', 'Substantivo', '这家店里的水果都很新鲜，也很甜。', 'As frutas desta loja estão todas bem frescas e doces.'],
  ['zh-v4-a1-1', '收银台', 'shōuyíntái', 'Caixa (de pagamento)', 'Substantivo', '选好东西以后，我们去收银台结账吧。', 'Depois de escolher tudo, vamos ao caixa pagar.'],
  ['zh-v4-a1-1', '零钱', 'língqián', 'Troco / dinheiro trocado', 'Substantivo', '不好意思，我身上没有零钱，可以手机支付吗？', 'Desculpe, não tenho trocado comigo, posso pagar pelo celular?'],

  // zh-v4-a1-2: Na Farmácia & Desconfortos Comuns (existing: 药店, 头疼, 咳嗽)
  ['zh-v4-a1-2', '感冒药', 'gǎnmàoyào', 'Remédio para resfriado', 'Substantivo', '请问这种感冒药一天吃几次？', 'Com licença, quantas vezes por dia se toma este remédio para resfriado?'],
  ['zh-v4-a1-2', '体温计', 'tǐwēnjì', 'Termômetro', 'Substantivo', '我好像有点发烧，家里有体温计吗？', 'Parece que estou com um pouco de febre, tem termômetro em casa?'],
  ['zh-v4-a1-2', '多喝水', 'duō hē shuǐ', 'Beber bastante água', 'Expressão', '医生说吃药期间要多喝水、多休息。', 'O médico disse para beber bastante água e descansar durante a medicação.'],

  // zh-v4-a1-3: Metrô, Ônibus & Compra de Bilhetes (existing: 地铁, 换乘, 车票)
  ['zh-v4-a1-3', '公交车', 'gōngjiāochē', 'Ônibus', 'Substantivo', '坐这路公交车可以直接到市中心。', 'Pegando esta linha de ônibus dá para ir direto ao centro da cidade.'],
  ['zh-v4-a1-3', '出口', 'chūkǒu', 'Saída', 'Substantivo', '从B出口出去，右转就能看到那栋楼。', 'Saindo pela saída B e virando à direita, você já vê aquele prédio.'],
  ['zh-v4-a1-3', '交通卡', 'jiāotōngkǎ', 'Cartão de transporte', 'Substantivo', '我刚充了五十块钱到交通卡里。', 'Acabei de recarregar cinquenta yuans no cartão de transporte.'],

  // zh-v4-a1-4: Check-in no Hotel & Senha do Wi-Fi (existing: 入住, 密码, 房卡)
  ['zh-v4-a1-4', '退房', 'tuìfáng', 'Fazer check-out', 'Verbo', '请问明天最晚几点以前需要退房？', 'Com licença, qual é o horário máximo para fazer check-out amanhã?'],
  ['zh-v4-a1-4', '前台', 'qiántái', 'Recepção', 'Substantivo', '如果您需要多一条毛巾，可以给前台打电话。', 'Se precisar de mais uma toalha, pode ligar para a recepção.'],
  ['zh-v4-a1-4', '早餐', 'zǎocān', 'Café da manhã', 'Substantivo', '您的房费里已经包含了双人早餐。', 'A sua diária já inclui café da manhã para duas pessoas.'],

  // zh-v4-a1-5: Segurança no Aeroporto & Embarque (existing: 安检, 登机口, 充电宝)
  ['zh-v4-a1-5', '登机牌', 'dēngjīpái', 'Cartão de embarque', 'Substantivo', '办好托运后，请拿好您的护照和登机牌。', 'Depois de despachar a mala, guarde bem seu passaporte e cartão de embarque.'],
  ['zh-v4-a1-5', '托运', 'tuōyùn', 'Despachar (bagagem)', 'Verbo', '我的行李箱太大了，必须在柜台托运。', 'Minha mala é grande demais, preciso despachá-la no balcão.'],
  ['zh-v4-a1-5', '准点', 'zhǔndiǎn', 'No horário / pontual (voo)', 'Adjetivo', '今天的航班很准点，十点半准时起飞。', 'O voo de hoje está bem pontual, decola às dez e meia em ponto.'],

  // zh-v4-a1-6: Comprando Roupas & Tamanhos (existing: 尺码, 试穿, 合身)
  ['zh-v4-a1-6', '试衣间', 'shìyījiān', 'Provador', 'Substantivo', '您好，试衣间在店里的最里面左边。', 'Olá, o provador fica lá no fundo da loja, à esquerda.'],
  ['zh-v4-a1-6', '大一号', 'dà yī hào', 'Um tamanho maior', 'Expressão', '这件有点紧，请问有没有大一号的？', 'Esta peça ficou um pouco apertada, tem um tamanho maior?'],
  ['zh-v4-a1-6', '退换', 'tuìhuàn', 'Trocar ou devolver', 'Verbo', '保留好小票，七天之内可以免费退换。', 'Guarde o comprovante; dentro de sete dias dá para trocar ou devolver sem custo.'],

  // zh-v4-a1-7: Pedidos de Emergência (110 / 120) (existing: 救护车, 派出所, 报案)
  ['zh-v4-a1-7', '警察', 'jǐngchá', 'Policial', 'Substantivo', '前面路口有一位警察，我们过去问问吧。', 'Tem um policial no cruzamento ali na frente, vamos lá perguntar.'],
  ['zh-v4-a1-7', '帮忙', 'bāngmáng', 'Ajudar', 'Verbo', '对不起，我的钱包丢了，能请您帮忙吗？', 'Desculpe, perdi minha carteira, o senhor pode me ajudar?'],
  ['zh-v4-a1-7', '紧急', 'jǐnjí', 'Urgente / de emergência', 'Adjetivo', '遇到紧急情况时，请马上拨打110或120。', 'Em caso de situação urgente, ligue imediatamente para 110 ou 120.'],

  // zh-v4-a1-8: Banco & Caixa Eletrônico (ATM) (existing: 银行卡, 取钱, 汇率)
  ['zh-v4-a1-8', '取号', 'qǔhào', 'Pegar senha de atendimento', 'Verbo', '进银行大厅后，请先在机器上取号排队。', 'Ao entrar no saguão do banco, pegue primeiro uma senha na máquina para a fila.'],
  ['zh-v4-a1-8', '开户', 'kāihù', 'Abrir conta bancária', 'Verbo', '外国人去银行开户需要带上护照和住址证明。', 'Estrangeiros precisam levar passaporte e comprovante de endereço para abrir conta no banco.'],
  ['zh-v4-a1-8', '手续费', 'shǒuxùfèi', 'Taxa de serviço', 'Substantivo', '用这张卡在境外取款会有手续费吗？', 'Há taxa de serviço ao sacar dinheiro no exterior com este cartão?'],

  // zh-v4-a1-9: Cabeleireiro & Serviços do Dia a Dia (existing: 理发, 剪短, 洗衣店)
  ['zh-v4-a1-9', '洗头', 'xǐtóu', 'Lavar o cabelo', 'Verbo', '今天只想洗头和吹干，暂时不剪头发。', 'Hoje só quero lavar e secar o cabelo, não vou cortar por enquanto.'],
  ['zh-v4-a1-9', '干洗', 'gānxǐ', 'Lavagem a seco', 'Verbo', '这件羊毛大衣不能水洗，只能送去干洗。', 'Este sobretudo de lã não pode ser lavado na água, só pode ir para lavagem a seco.'],
  ['zh-v4-a1-9', '修一修', 'xiū yì xiū', 'Dar uma aparada', 'Expressão', '刘海有点长了，麻烦帮我稍微修一修。', 'Minha franja está um pouco comprida, por favor dê só uma aparada.'],

  // zh-v4-a1-10: Agendamentos, Horários & Pontualidade (existing: 预约, 改期, 准时)
  ['zh-v4-a1-10', '提前', 'tíqián', 'Com antecedência / adiantar', 'Verbo', '去这家热门餐厅吃饭最好提前一天订位。', 'Para comer neste restaurante concorrido é melhor reservar com um dia de antecedência.'],
  ['zh-v4-a1-10', '迟到', 'chídào', 'Chegar atrasado', 'Verbo', '路上堵车了，我可能会迟到十分钟。', 'O trânsito travou na avenida, talvez eu chegue dez minutos atrasado.'],
  ['zh-v4-a1-10', '确认', 'quèrèn', 'Confirmar', 'Verbo', '出门前请再确认一下预约的时间和地址。', 'Antes de sair, confirme novamente o horário e o endereço do agendamento.'],

  // ==================== A2 ====================
  // zh-a2-1: Passado Concluído com 了 (le) vs. Experiência 过 (guo) (existing: 去年, 参观, 风景)
  ['zh-a2-1', '去过', 'qùguo', 'Já ter ido a (experiência)', 'Verbo', '我去过两次北京，每次都去长城看看。', 'Já fui a Pequim duas vezes e em todas elas visitei a Grande Muralha.'],
  ['zh-a2-1', '吃过', 'chīguo', 'Já ter comido / experimentado', 'Verbo', '你吃过正宗的四川火锅吗？', 'Você já experimentou o verdadeiro hot pot de Sichuan?'],
  ['zh-a2-1', '照片', 'zhàopiàn', 'Foto / fotografia', 'Substantivo', '我在旅行中拍了很多漂亮的照片。', 'Tirei muitas fotos bonitas durante a viagem.'],

  // zh-a2-2: Ações em Progresso: 正在 (zhèngzài) & 着 (zhe) (existing: 正在, 准备, 会议)
  ['zh-a2-2', '穿着', 'chuānzhe', 'Estar vestindo', 'Verbo', '门口那个穿着红色外套的人就是新同事。', 'Aquela pessoa na porta vestindo casaco vermelho é o novo colega.'],
  ['zh-a2-2', '拿着', 'názhe', 'Estar segurando', 'Verbo', '他手里拿着一杯咖啡，正在看手机消息。', 'Ele está segurando um café na mão e lendo mensagens no celular.'],
  ['zh-a2-2', '讨论', 'tǎolùn', 'Discutir / debater', 'Verbo', '大家正在会议室里讨论下个月的工作计划。', 'Todos estão na sala de reunião discutindo o plano de trabalho do próximo mês.'],

  // zh-a2-3: Comparações com 比 (bǐ), 一样 & 没有 (existing: 高铁, 准时, 一样)
  ['zh-a2-3', '更', 'gèng', 'Ainda mais', 'Advérbio', '坐高铁去上海比坐飞机更方便。', 'Ir de trem-bala para Xangai é ainda mais prático do que ir de avião.'],
  ['zh-a2-3', '差不多', 'chàbuduō', 'Mais ou menos igual / quase', 'Adjetivo', '这两家酒店的价格和位置都差不多。', 'O preço e a localização desses dois hotéis são praticamente iguais.'],
  ['zh-a2-3', '快', 'kuài', 'Rápido', 'Adjetivo', '地铁的速度比公交车快多了。', 'A velocidade do metrô é bem mais rápida do que a do ônibus.'],

  // zh-a2-4: Modais Essenciais: 会, 能, 可以 & 应该 (existing: 筷子, 应该, 允许)
  ['zh-a2-4', '需要', 'xūyào', 'Precisar', 'Verbo', '去中国出差之前，你需要准备好签证。', 'Antes de viajar a trabalho para a China, você precisa preparar o visto.'],
  ['zh-a2-4', '习惯', 'xíguàn', 'Acostumar-se / hábito', 'Verbo', '刚开始用筷子可能不习惯，多练几次就好了。', 'No começo pode ser estranho usar hashi, mas praticando algumas vezes fica fácil.'],
  ['zh-a2-4', '禁止', 'jìnzhǐ', 'Proibir', 'Verbo', '公共场所室内通常禁止吸烟。', 'Normalmente é proibido fumar em ambientes internos públicos.'],

  // zh-a2-5: Complemento de Grau com 得 (de) (existing: 流利, 清楚, 标准)
  ['zh-a2-5', '认真', 'rènzhēn', 'Sério / dedicado', 'Adjetivo', '他做笔记做得很认真，字也写得不错。', 'Ele faz anotações com muita dedicação e a letra também é bonita.'],
  ['zh-a2-5', '努力', 'nǔlì', 'Esforçado / esforçar-se', 'Adjetivo', '她学中文学得非常努力，进步很快。', 'Ela estuda chinês com muito esforço e evolui rápido.'],
  ['zh-a2-5', '发音', 'fāyīn', 'Pronúncia', 'Substantivo', '你的声调发音发得很准，几乎听不出是外国人。', 'A pronúncia dos seus tons está muito precisa, quase não dá para notar sotaque estrangeiro.'],

  // zh-a2-6: Complementos Resultativos (听懂, 看完, 找到) (existing: 听懂, 找到, 写完)
  ['zh-a2-6', '看完', 'kànwán', 'Terminar de ler / assistir', 'Verbo', '这本小说太好看了，我两天就看完了。', 'Este romance é tão bom que eu terminei de ler em dois dias.'],
  ['zh-a2-6', '记住', 'jìzhù', 'Memorizar / gravar', 'Verbo', '生词太多的话，可以用例句来记住。', 'Se houver muitas palavras novas, dá para usar frases de exemplo para memorizar.'],
  ['zh-a2-6', '买到', 'mǎidào', 'Conseguir comprar', 'Verbo', '幸好我抢得早，终于买到了去成都的车票。', 'Ainda bem que comprei cedo, finalmente consegui comprar a passagem para Chengdu.'],

  // zh-a2-7: Viagens, Aeroporto, Hotel & Trem-Bala (existing: 护照, 预订, 行李)
  ['zh-a2-7', '检票', 'jiǎnpiào', 'Conferir / validar bilhete', 'Verbo', '高铁开车前十五分钟开始检票进站。', 'A conferência dos bilhetes começa quinze minutos antes da partida do trem-bala.'],
  ['zh-a2-7', '座位', 'zuòwèi', 'Assento', 'Substantivo', '我订了一个靠窗的座位，可以看沿途风景。', 'Reservei um assento na janela para poder ver a paisagem no caminho.'],
  ['zh-a2-7', '出发', 'chūfā', 'Partir / sair em viagem', 'Verbo', '明天早上六点我们准时从家里出发。', 'Amanhã às seis da manhã sairemos de casa pontualmente.'],

  // zh-a2-8: Saúde, Sintomas & Farmácia (existing: 发烧, 感冒, 休息)
  ['zh-a2-8', '挂号', 'guàhào', 'Fazer ficha / agendar consulta', 'Verbo', '去医院看病前，可以在手机上提前挂号。', 'Antes de ir ao hospital, dá para marcar a consulta pelo celular com antecedência.'],
  ['zh-a2-8', '肚子疼', 'dùzi téng', 'Dor de barriga', 'Expressão', '可能是昨晚吃了凉东西，我今天有点肚子疼。', 'Talvez por ter comido algo frio ontem à noite, hoje estou com um pouco de dor de barriga.'],
  ['zh-a2-8', '好转', 'hǎozhuǎn', 'Melhorar (saúde / situação)', 'Verbo', '吃了药休息两天后，他的病情明显好转了。', 'Depois de tomar o remédio e descansar dois dias, o quadro dele melhorou visivelmente.'],

  // zh-a2-9: Conectivos Essenciais: 因为…所以 & 虽然…但是 (existing: 虽然, 但是, 因为)
  ['zh-a2-9', '所以', 'suǒyǐ', 'Portanto / por isso', 'Conjunção', '今天下雨，所以我决定在家办公。', 'Hoje está chovendo, por isso decidi trabalhar de casa.'],
  ['zh-a2-9', '不过', 'búguò', 'Porém / mas', 'Conjunção', '这家餐厅菜不错，不过晚上人太多要排队。', 'A comida deste restaurante é boa, porém à noite enche e tem fila.'],
  ['zh-a2-9', '而且', 'érqiě', 'E além disso', 'Conjunção', '这台电脑不但轻便，而且电池特别耐用。', 'Este notebook não só é leve, como também a bateria dura muito.'],

  // zh-a2-10: Culinária Chinesa, Pedidos & Preferências (existing: 菜单, 买单, 打包)
  ['zh-a2-10', '微辣', 'wēilà', 'Pouco apimentado', 'Adjetivo', '我不太能吃辣，这个菜做成微辣就可以了。', 'Não aguento muita pimenta, pode fazer este prato pouco apimentado.'],
  ['zh-a2-10', '忌口', 'jìkǒu', 'Restrição alimentar', 'Verbo', '点菜之前，服务员问我们有没有什么忌口。', 'Antes de anotar o pedido, o garçom perguntou se tínhamos alguma restrição alimentar.'],
  ['zh-a2-10', '招牌菜', 'zhāopáicài', 'Prato da casa / especialidade', 'Substantivo', '第一次来这里，一定要尝尝他们的招牌菜。', 'Na primeira vez aqui, vale muito a pena provar o prato da casa.'],

  // ==================== V4 A2 ====================
  // zh-v4-a2-1: Aluguel de Imóvel & Pedido de Reparo (existing: 房租, 漏水, 维修)
  ['zh-v4-a2-1', '房东', 'fángdōng', 'Proprietário / senhorio', 'Substantivo', '空调坏了以后，我第一时间联系了房东。', 'Assim que o ar-condicionado quebrou, entrei em contato com o proprietário.'],
  ['zh-v4-a2-1', '水电费', 'shuǐdiànfèi', 'Contas de água e luz', 'Substantivo', '签合同前要问清楚房租包不包括水电费。', 'Antes de assinar o contrato, pergunte se o aluguel inclui água e luz.'],
  ['zh-v4-a2-1', '押金', 'yājīn', 'Caução / depósito de garantia', 'Substantivo', '租房通常需要交一个月的房租作为押金。', 'Para alugar um imóvel, normalmente paga-se um mês de aluguel como caução.'],

  // zh-v4-a2-2: Aluguel de Carro & Posto de Gasolina (existing: 加油站, 驾驶证, 划痕)
  ['zh-v4-a2-2', '加满', 'jiāmǎn', 'Encher o tanque', 'Verbo', '师傅，请帮我把92号汽油加满，谢谢。', 'Frentista, por favor encha o tanque com gasolina 92, obrigado.'],
  ['zh-v4-a2-2', '保险', 'bǎoxiǎn', 'Seguro', 'Substantivo', '自驾游租车时，建议买一份全额保险。', 'Ao alugar carro para viajar, é recomendável contratar um seguro completo.'],
  ['zh-v4-a2-2', '导航', 'dǎoháng', 'GPS / navegação', 'Substantivo', '去陌生的城市开车，打开手机导航就放心多了。', 'Ao dirigir em uma cidade desconhecida, abrir o GPS no celular dá muito mais segurança.'],

  // zh-v4-a2-3: Restrições Alimentares & Alergias no Restaurante (existing: 过敏, 忌口, 不含)
  ['zh-v4-a2-3', '花生', 'huāshēng', 'Amendoim', 'Substantivo', '我对花生严重过敏，做菜时千万别放。', 'Tenho alergia grave a amendoim, por favor não coloque no prato.'],
  ['zh-v4-a2-3', '香菜', 'xiāngcài', 'Coentro', 'Substantivo', '老板，这碗牛肉面里请不要放香菜。', 'Chefe, por favor não coloque coentro nesta tigela de macarrão com carne.'],
  ['zh-v4-a2-3', '素食', 'sùshí', 'Comida vegetariana', 'Substantivo', '我的朋友是素食者，请问有哪些素菜推荐？', 'Meu amigo é vegetariano, quais pratos sem carne vocês recomendam?'],

  // zh-v4-a2-4: Bagagem Extraviada no Aeroporto (existing: 拉杆箱, 传送带, 登记表)
  ['zh-v4-a2-4', '行李牌', 'xínglipái', 'Etiqueta de bagagem', 'Substantivo', '办托运时贴的行李牌一定不要弄丢了。', 'Não perca a etiqueta de bagagem colada na hora do despacho.'],
  ['zh-v4-a2-4', '赔偿', 'péicháng', 'Indenizar / indenização', 'Verbo', '如果行李损坏严重，航空公司会按规定赔偿。', 'Se a bagagem sofrer danos graves, a companhia aérea indeniza conforme as regras.'],
  ['zh-v4-a2-4', '联系地址', 'liánxì dìzhǐ', 'Endereço de contato', 'Substantivo', '请在这张表上留下您的电话和酒店联系地址。', 'Por favor, deixe seu telefone e o endereço do hotel neste formulário.'],

  // zh-v4-a2-5: Encomendas (快递) & Correios (existing: 快递, 取件码, 运费)
  ['zh-v4-a2-5', '快递柜', 'kuàidìguì', 'Armário inteligente de encomendas', 'Substantivo', '快递员把包裹放进楼下的快递柜里了。', 'O entregador colocou o pacote no armário de encomendas lá embaixo.'],
  ['zh-v4-a2-5', '签收', 'qiānshōu', 'Assinar o recebimento', 'Verbo', '检查完商品没有破损后，我才确认签收。', 'Só confirmei o recebimento depois de checar que o produto não estava danificado.'],
  ['zh-v4-a2-5', '寄件', 'jìjiàn', 'Enviar encomenda', 'Verbo', '我想往巴西寄件，大概需要几天能到？', 'Quero enviar um pacote para o Brasil, quantos dias leva mais ou menos?'],

  // zh-v4-a2-6: Na Academia & Rotina de Treino (existing: 健身房, 热身, 拉伸)
  ['zh-v4-a2-6', '跑步机', 'pǎobùjī', 'Esteira', 'Substantivo', '下班后我喜欢在跑步机上跑三十分钟。', 'Depois do expediente gosto de correr trinta minutos na esteira.'],
  ['zh-v4-a2-6', '教练', 'jiàoliàn', 'Instrutor / personal trainer', 'Substantivo', '刚开始练力量时，找个教练指导动作更安全。', 'Quando se começa na musculação, ter um instrutor corrigindo os movimentos é mais seguro.'],
  ['zh-v4-a2-6', '会员卡', 'huìyuánkǎ', 'Cartão de sócio / plano da academia', 'Substantivo', '我办了一张年度会员卡，这样每天来锻炼很划算。', 'Fiz um plano anual da academia; assim compensa bastante treinar todo dia.'],

  // zh-v4-a2-7: Convivência com Vizinhos (existing: 邻居, 打扰, 物业)
  ['zh-v4-a2-7', '噪音', 'zàoyīn', 'Barulho / ruído', 'Substantivo', '晚上十点以后请尽量减小噪音，别影响休息。', 'Depois das dez da noite, procure reduzir o barulho para não atrapalhar o descanso.'],
  ['zh-v4-a2-7', '电梯', 'diàntī', 'Elevador', 'Substantivo', '今天一号电梯在维修，大家请走旁边那部。', 'Hoje o elevador 1 está em manutenção, usem o outro ao lado.'],
  ['zh-v4-a2-7', '谅解', 'liàngjiě', 'Compreender / desculpar', 'Verbo', '家里周末装修有点吵，请各位邻居多多谅解。', 'A reforma aqui em casa no fim de semana vai fazer um pouco de barulho, pedimos a compreensão dos vizinhos.'],

  // zh-v4-a2-8: Atendimento ao Cliente por Telefone (SAC) (existing: 客服, 订单号, 退款)
  ['zh-v4-a2-8', '人工服务', 'réngōng fúwù', 'Atendimento humano', 'Substantivo', '语音菜单太复杂了，按0可以直接转人工服务。', 'O menu de voz é confuso demais, apertando 0 vai direto para o atendimento humano.'],
  ['zh-v4-a2-8', '核对', 'héduì', 'Conferir / verificar', 'Verbo', '客服人员先和我核对了姓名和订单金额。', 'O atendente primeiro conferiu comigo o nome e o valor do pedido.'],
  ['zh-v4-a2-8', '售后', 'shòuhòu', 'Pós-venda', 'Substantivo', '这家品牌的售后服务做得很好，解决问题很快。', 'O pós-venda desta marca é muito bom, eles resolvem os problemas rápido.'],

  // zh-v4-a2-9: Pechinchando na Feira Livre (existing: 菜市场, 砍价, 抹零)
  ['zh-v4-a2-9', '新鲜', 'xīnxiān', 'Fresco', 'Adjetivo', '早上七点去菜市场，买到的青菜最新鲜。', 'Indo à feira às sete da manhã, as verduras que você compra são as mais frescas.'],
  ['zh-v4-a2-9', '便宜点', 'piányi diǎn', 'Fazer mais barato', 'Expressão', '老板，我买这么多，能不能便宜点儿啊？', 'Chefe, estou levando tudo isso, dá para fazer um pouco mais barato?'],
  ['zh-v4-a2-9', '称重', 'chēngzhòng', 'Pesar (na balança)', 'Verbo', '挑好西红柿以后，拿到摊位前面称重算钱。', 'Depois de escolher os tomates, leve à frente da banca para pesar e calcular o valor.'],

  // zh-v4-a2-10: Receitas de Pratos Caseiros (existing: 家常菜, 翻炒, 调味)
  ['zh-v4-a2-10', '食材', 'shícái', 'Ingredientes', 'Substantivo', '做这道汤不需要复杂的食材，土豆和牛肉就行。', 'Esta sopa não precisa de ingredientes complicados, só batata e carne bovina.'],
  ['zh-v4-a2-10', '酱油', 'jiàngyóu', 'Molho de soja (shoyu)', 'Substantivo', '出锅前加一勺酱油，菜的颜色和味道会更好。', 'Antes de tirar da panela, ponha uma colher de shoyu para melhorar a cor e o sabor.'],
  ['zh-v4-a2-10', '小火', 'xiǎohuǒ', 'Fogo baixo', 'Substantivo', '炖肉的时候要调成小火，慢慢煮才入味。', 'Na hora de cozinhar a carne, abaixe para fogo baixo para pegar bem o tempero.'],

  // ==================== B1 ====================
  // zh-b1-1: A Construção 把 (bǎ): Movendo Objetos com Precisão (existing: 整理, 关掉, 邮件)
  ['zh-b1-1', '放进', 'fàngjìn', 'Colocar dentro de', 'Verbo', '请把重要的文件放进那个蓝色的文件夹里。', 'Por favor, coloque os documentos importantes dentro daquela pasta azul.'],
  ['zh-b1-1', '拿走', 'názǒu', 'Levar embora / retirar', 'Verbo', '桌上的空杯子可以麻烦您拿走吗？', 'Poderia fazer o favor de retirar os copos vazios da mesa?'],
  ['zh-b1-1', '发给', 'fāgěi', 'Enviar para', 'Verbo', '我待会儿把修改后的方案发给您确认。', 'Daqui a pouco envio o plano revisado para você confirmar.'],

  // zh-b1-2: Voz Passiva com 被 (bèi), 让 & 叫 (existing: 取消, 采纳, 幸好)
  ['zh-b1-2', '撞倒', 'zhuàngdǎo', 'Derrubar ao bater / atropelar', 'Verbo', '街角的自行车刚才被大风吹倒或者撞倒了。', 'A bicicleta na esquina acabou de ser derrubada pelo vento forte ou por um esbarrão.'],
  ['zh-b1-2', '误会', 'wùhuì', 'Entender mal / mal-entendido', 'Verbo', '我原本是一番好意，没想到却被他误会了。', 'Minha intenção era boa, mas não esperava que ele entendesse tudo errado.'],
  ['zh-b1-2', '表扬', 'biǎoyáng', 'Elogiar', 'Verbo', '因为这次项目完成得很好，团队被经理表扬了。', 'Como o projeto foi muito bem executado, a equipe foi elogiada pelo gerente.'],

  // zh-b1-3: Complementos Direcionais (上来, 下去, 进来, 出去) (existing: 坚持, 想起来, 记下来)
  ['zh-b1-3', '带回来', 'dài huílai', 'Trazer de volta', 'Verbo', '我从杭州带回来了一些正宗的龙井茶。', 'Trouxe de volta de Hangzhou um pouco de chá Longjing autêntico.'],
  ['zh-b1-3', '走出去', 'zǒu chūqù', 'Sair caminhando', 'Verbo', '天气这么好，别总待在屋里，走出去透透气吧。', 'Com o tempo tão bom, não fique só dentro de casa, saia para tomar um ar.'],
  ['zh-b1-3', '搬进去', 'bān jìnqù', 'Mudar-se para dentro / carregar para dentro', 'Verbo', '新房子装修好了，我们下周就能搬进去住。', 'O apartamento novo ficou pronto, semana que vem já podemos nos mudar para lá.'],

  // zh-b1-4: Trabalho, Entrevista & Expressando Opinião (existing: 经验, 团队, 效率)
  ['zh-b1-4', '沟通', 'gōutōng', 'Comunicar-se / comunicação', 'Verbo', '跨部门合作最重要的就是保持及时沟通。', 'O mais importante na colaboração entre áreas é manter uma comunicação ágil.'],
  ['zh-b1-4', '负责', 'fùzé', 'Ser responsável por', 'Verbo', '我在这个项目中主要负责客户对接和数据分析。', 'Neste projeto sou responsável principalmente pelo contato com clientes e análise de dados.'],
  ['zh-b1-4', '建议', 'jiànyì', 'Sugerir / sugestão', 'Substantivo', '对于这个新方案，我有一点小建议想补充。', 'Sobre esta nova proposta, tenho uma pequena sugestão para acrescentar.'],

  // zh-b1-5: Tendências com 越来越, 一…就… & Complemento de Possibilidade (existing: 普及, 高效, 随时随地)
  ['zh-b1-5', '买不起', 'mǎibuqǐ', 'Não ter condições de comprar', 'Verbo', '市中心的房价太高了，普通上班族根本买不起。', 'Os imóveis no centro estão caros demais, trabalhadores comuns não conseguem comprar.'],
  ['zh-b1-5', '看得懂', 'kàndedǒng', 'Conseguir entender (lendo)', 'Verbo', '虽然有一些生词，但这篇文章我基本看得懂。', 'Embora haja algumas palavras novas, consigo entender este artigo no geral.'],
  ['zh-b1-5', '方便多了', 'fāngbiàn duō le', 'Muito mais prático', 'Expressão', '有了移动支付以后，出门不带现金方便多了。', 'Depois do pagamento móvel, sair sem dinheiro em espécie ficou muito mais prático.'],

  // zh-b1-6: Tecnologia, Aplicativos Chineses & Vida Digital (existing: 共享, 附件, 密码)
  ['zh-b1-6', '下载', 'xiàzài', 'Baixar / fazer download', 'Verbo', '请先在应用商店下载这个软件，再注册账号。', 'Primeiro baixe este aplicativo na loja de apps e depois crie sua conta.'],
  ['zh-b1-6', '线上会议', 'xiànshàng huìyì', 'Reunião online', 'Substantivo', '今天下午两点有一个线上会议，请提前测试麦克风。', 'Hoje às duas da tarde temos uma reunião online, testem o microfone antes.'],
  ['zh-b1-6', '隐私设置', 'yǐnsī shèzhì', 'Configurações de privacidade', 'Substantivo', '安装新应用时，记得检查一下隐私设置。', 'Ao instalar um aplicativo novo, lembre-se de checar as configurações de privacidade.'],

  // zh-b1-7: Contando Histórias & Sequência Temporal (existing: 然后, 突然, 继续)
  ['zh-b1-7', '首先', 'shǒuxiān', 'Primeiramente / em primeiro lugar', 'Advérbio', '做报告时，首先要把核心结论说清楚。', 'Ao apresentar um relatório, primeiro é preciso deixar a conclusão principal clara.'],
  ['zh-b1-7', '接着', 'jiēzhe', 'Em seguida / logo depois', 'Advérbio', '他先做了自我介绍，接着开始展示项目成果。', 'Ele primeiro se apresentou e, em seguida, começou a mostrar os resultados do projeto.'],
  ['zh-b1-7', '最终', 'zuìzhōng', 'Por fim / finalmente', 'Advérbio', '经过多次尝试，我们最终找到了解决办法。', 'Após várias tentativas, finalmente encontramos uma solução.'],

  // zh-b1-8: Reclamações, Trocas & Atendimento ao Cliente (existing: 退款, 包裹, 抱歉)
  ['zh-b1-8', '破损', 'pòsǔn', 'Danificado / avariado', 'Verbo', '我收到快递时发现外包装已经严重破损了。', 'Quando recebi a entrega, notei que a embalagem externa estava bem danificada.'],
  ['zh-b1-8', '换货', 'huànhuò', 'Trocar mercadoria', 'Verbo', '这双鞋码数不合适，我想申请免费换货。', 'O tamanho deste tênis não serviu, quero solicitar troca gratuita.'],
  ['zh-b1-8', '投诉', 'tóusù', 'Reclamar formalmente / fazer queixa', 'Verbo', '如果客服一直不处理，我只能向平台投诉了。', 'Se o atendimento continuar sem resolver, terei de abrir uma reclamação na plataforma.'],

  // zh-b1-9: Cultura, Costumes Chineses & Etiqueta Social (existing: 礼貌, 尊重, 习惯)
  ['zh-b1-9', '面子', 'miànzi', 'Prestígio / imagem social (mianzi)', 'Substantivo', '在公开场合批评别人会让人很没面子。', 'Criticar alguém em público faz a pessoa perder a face.'],
  ['zh-b1-9', '敬酒', 'jìngjiǔ', 'Brindar / oferecer um brinde', 'Verbo', '在中国的饭局上，晚辈通常主动给长辈敬酒。', 'Nos jantares na China, os mais jovens costumam tomar a iniciativa de brindar aos mais velhos.'],
  ['zh-b1-9', '客套', 'kètào', 'Cortesia formal / cerimônia', 'Adjetivo', '大家都是熟人了，说话不用这么客套。', 'Já somos todos conhecidos, não precisa falar com tanta cerimônia.'],

  // zh-b1-10: Condicionais B1: 只要…就… vs. 只有…才… & 不管 (existing: 只要, 只有, 无论)
  ['zh-b1-10', '才', 'cái', 'Só então (com 只有)', 'Advérbio', '只有每天坚持开口练习，口语才能真正提高。', 'Só praticando a fala todos os dias é que a fluência oral realmente melhora.'],
  ['zh-b1-10', '尽管', 'jǐnguǎn', 'Embora / apesar de', 'Conjunção', '尽管任务很重，大家还是按时完成了工作。', 'Embora a tarefa fosse pesada, todos concluíram o trabalho no prazo.'],
  ['zh-b1-10', '哪怕', 'nǎpà', 'Mesmo que / ainda que', 'Conjunção', '哪怕遇到再大的困难，我们也不能轻言放弃。', 'Mesmo diante de grandes dificuldades, não podemos desistir facilmente.'],

  // ==================== V4 B1 ====================
  // zh-v4-b1-1: Agendamento de Especialista & Receita Médica (existing: 挂号, 处方, 化验)
  ['zh-v4-b1-1', '专家号', 'zhuānjiāhào', 'Consulta com especialista', 'Substantivo', '这位老中医的专家号很难抢，一般要提前一周预约。', 'A consulta com este médico especialista é difícil de conseguir, geralmente exige agendamento com uma semana de antecedência.'],
  ['zh-v4-b1-1', '分诊台', 'fēnzhěntái', 'Balcão de triagem', 'Substantivo', '如果不知道该看哪个科，可以先去分诊台咨询。', 'Se não souber qual especialidade procurar, pergunte antes no balcão de triagem.'],
  ['zh-v4-b1-1', '取药', 'qǔyào', 'Retirar medicamentos', 'Verbo', '交完费以后，请拿着单子去一楼药房取药。', 'Depois de pagar a taxa, leve a guia até a farmácia do térreo para retirar o remédio.'],

  // zh-v4-b1-2: Entrevista de Emprego & Negociação Salarial (existing: 面试, 薪资, 试用期)
  ['zh-v4-b1-2', '简历', 'jiǎnlì', 'Currículo', 'Substantivo', '投递简历之前，最好根据岗位要求修改一下重点。', 'Antes de enviar o currículo, vale ajustar os destaques conforme a vaga.'],
  ['zh-v4-b1-2', '优势', 'yōushì', 'Ponto forte / vantagem', 'Substantivo', '请用三句话介绍一下您在这个岗位上的核心优势。', 'Por favor, apresente em três frases seus principais pontos fortes para esta vaga.'],
  ['zh-v4-b1-2', '福利待遇', 'fúlì dàiyù', 'Benefícios e remuneração', 'Substantivo', '除了基本工资，我也很看重公司的福利待遇和培训机会。', 'Além do salário-base, também valorizo os benefícios e oportunidades de treinamento da empresa.'],

  // zh-v4-b1-3: Cartão Bancário Bloqueado: Como Resolver (existing: 冻结, 解冻, 盗刷)
  ['zh-v4-b1-3', '异常交易', 'yìcháng jiāoyì', 'Transação suspeita / atípica', 'Substantivo', '银行系统检测到一笔异常交易，所以暂时锁卡了。', 'O sistema do banco detectou uma transação atípica e bloqueou o cartão temporariamente.'],
  ['zh-v4-b1-3', '身份验证', 'shēnfèn yànzhèng', 'Verificação de identidade', 'Substantivo', '电话里需要完成身份验证，才能继续办理业务。', 'É preciso concluir a verificação de identidade por telefone para prosseguir com o atendimento.'],
  ['zh-v4-b1-3', '挂失', 'guàshī', 'Comunicar perda / bloquear cartão perdido', 'Verbo', '发现银行卡不见了，应当立刻打客服电话挂失。', 'Ao notar que o cartão sumiu, ligue imediatamente para o banco para bloquear por perda.'],

  // zh-v4-b1-4: Reembolso de Seguro Viagem (existing: 理赔, 延误, 发票)
  ['zh-v4-b1-4', '保单', 'bǎodān', 'Apólice de seguro', 'Substantivo', '申请理赔时，请把电子保单号一起提交上去。', 'Ao solicitar o reembolso do seguro, envie junto o número da apólice digital.'],
  ['zh-v4-b1-4', '证明材料', 'zhèngmíng cáiliào', 'Documentação comprobatória', 'Substantivo', '航空公司开的延误证明是理赔必备的证明材料。', 'A declaração de atraso emitida pela companhia aérea é um documento obrigatório para o reembolso.'],
  ['zh-v4-b1-4', '报销', 'bàoxiāo', 'Reembolsar (despesa)', 'Verbo', '这次看病的费用都在保险报销范围之内。', 'As despesas médicas desta consulta estão dentro da cobertura de reembolso do seguro.'],

  // zh-v4-b1-5: Visto & Registro de Residência (existing: 签证, 居留许可, 原件)
  ['zh-v4-b1-5', '住宿登记', 'zhùsù dēngjì', 'Registro de hospedagem / residência', 'Substantivo', '入境中国后二十四小时内，必须去派出所办理住宿登记。', 'Dentro de 24 horas após entrar na China, é obrigatório fazer o registro de residência na delegacia.'],
  ['zh-v4-b1-5', '延期', 'yánqī', 'Prorrogar / estender prazo', 'Verbo', '我的签证下个月到期，得提前去出入境大厅办理延期。', 'Meu visto vence no mês que vem; preciso ir antes ao órgão de imigração para prorrogar.'],
  ['zh-v4-b1-5', '复印件', 'fùyìnjiàn', 'Cópia / xerox', 'Substantivo', '除了护照原件，还要多准备两份首页的复印件。', 'Além do passaporte original, prepare também duas cópias da página principal.'],

  // zh-v4-b1-6: Suporte de TI & Chamado Técnico (existing: 工单, 重启, 远程协助)
  ['zh-v4-b1-6', '断网', 'duànwǎng', 'Cair a internet / ficar sem rede', 'Verbo', '办公室刚才突然断网了，大家先保存好本地文件。', 'A internet do escritório caiu de repente agora pouco; salvem seus arquivos locais.'],
  ['zh-v4-b1-6', '报错', 'bàocuò', 'Dar mensagem de erro', 'Verbo', '我登录系统时一直报错，能帮我看看日志吗？', 'Sempre dá erro quando tento entrar no sistema; pode ver os logs para mim?'],
  ['zh-v4-b1-6', '权限', 'quánxiàn', 'Permissão de acesso', 'Substantivo', '新入职的同事还没有这个共享文件夹的访问权限。', 'O colega recém-contratado ainda não tem permissão de acesso a esta pasta compartilhada.'],

  // zh-v4-b1-7: Voluntariado Comunitário (existing: 志愿者, 报名, 垃圾分类)
  ['zh-v4-b1-7', '公益活动', 'gōngyì huódòng', 'Atividade beneficente / comunitária', 'Substantivo', '周末我参加了社区组织的环保公益活动。', 'No fim de semana participei de uma ação ambiental comunitária organizada pelo bairro.'],
  ['zh-v4-b1-7', '居委会', 'jūwěihuì', 'Comitê de moradores / associação do bairro', 'Substantivo', '有需要帮助的老人，可以随时联系社区居委会。', 'Idosos que precisarem de ajuda podem contatar o comitê de moradores a qualquer momento.'],
  ['zh-v4-b1-7', '热情', 'rèqíng', 'Entusiasmado / caloroso', 'Adjetivo', '这里的志愿者都非常热情，耐心解答大家的问题。', 'Os voluntários daqui são muito atenciosos e respondem às dúvidas com paciência.'],

  // zh-v4-b1-8: Renovação de Contrato de Aluguel (existing: 续签, 押金, 提前)
  ['zh-v4-b1-8', '涨租', 'zhǎngzū', 'Aumentar o aluguel', 'Verbo', '如果今年不涨租的话，我打算继续再续签一年。', 'Se não houver aumento de aluguel este ano, pretendo renovar por mais um ano.'],
  ['zh-v4-b1-8', '违约金', 'wéiyuējīn', 'Multa contratual', 'Substantivo', '如果没住满一年就提前退租，可能需要付违约金。', 'Se sair antes de completar um ano, pode ser preciso pagar multa contratual.'],
  ['zh-v4-b1-8', '中介', 'zhōngjiè', 'Corretor / imobiliária', 'Substantivo', '这次续签直接跟房东谈，不用再交中介费了。', 'Desta vez vamos negociar a renovação direto com o proprietário, sem pagar taxa de corretagem.'],

  // zh-v4-b1-9: Mudança de Casa & Transportadora (existing: 搬家, 打包, 货车)
  ['zh-v4-b1-9', '纸箱', 'zhǐxiāng', 'Caixa de papelão', 'Substantivo', '为了方便搬运，我买了十几个结实的大纸箱。', 'Para facilitar o transporte, comprei mais de dez caixas de papelão resistentes.'],
  ['zh-v4-b1-9', '易碎品', 'yìsuìpǐn', 'Item frágil', 'Substantivo', '装有碗和杯子的箱子上一定要写明“易碎品”。', 'Nas caixas com tigelas e copos é importante escrever “item frágil”.'],
  ['zh-v4-b1-9', '搬运工', 'bānyùngōng', 'Carregador / ajudante de mudança', 'Substantivo', '大件家具太沉了，多叫两位搬运工省力很多。', 'Os móveis grandes são pesados demais; chamar mais dois carregadores poupa muito esforço.'],

  // zh-v4-b1-10: Resenha & Discussão de Filmes e Livros (existing: 情节, 改编, 反转)
  ['zh-v4-b1-10', '演技', 'yǎnjì', 'Atuação / interpretação', 'Substantivo', '这部悬疑剧的主角演技非常自然，很有感染力。', 'A atuação do protagonista desta série de suspense é muito natural e envolvente.'],
  ['zh-v4-b1-10', '豆瓣评分', 'Dòubàn píngfēn', 'Nota no Douban (site chinês de resenhas)', 'Substantivo', '这部国产电影的豆瓣评分高达8.9分，口碑很好。', 'A nota deste filme chinês no Douban chegou a 8,9, com ótima repercussão.'],
  ['zh-v4-b1-10', '共鸣', 'gòngmíng', 'Identificação / ressonância emocional', 'Substantivo', '书里描写普通人生活的部分引发了很多读者的共鸣。', 'As passagens do livro sobre a vida cotidiana despertaram forte identificação nos leitores.'],

  // zh-idioms-b1: Expressões Idiomáticas (Chengyu) (existing: 一举两得, 入乡随俗, 半途而废, 马马虎虎)
  ['zh-idioms-b1', '画蛇添足', 'huà shé tiān zú', 'Fazer algo desnecessário que estraga o resultado', 'Expressão Idiomática', '文章已经写得很清楚了，再加这些废话反而画蛇添足。', 'O texto já está bem claro; acrescentar essas palavras só estraga o resultado.'],
  ['zh-idioms-b1', '雪中送炭', 'xuě zhōng sòng tàn', 'Oferecer ajuda oportuna na hora difícil', 'Expressão Idiomática', '在我最缺资金的时候他伸出援手，真是雪中送炭。', 'Quando eu mais precisava de recursos ele estendeu a mão; foi uma ajuda na hora exata.'],

  // zh-slang-b1: Gírias Chinesas da Internet & Rua (existing: 牛, 靠谱, 打卡, 躺平)
  ['zh-slang-b1', '内卷', 'nèijuǎn', 'Competição exaustiva / corrida dos ratos', 'Gíria', '现在职场竞争太激烈了，大家经常感叹太内卷。', 'A competição no mercado está intensa demais, todos vivem reclamando dessa corrida exaustiva.'],
  ['zh-slang-b1', '种草', 'zhòngcǎo', 'Despertar desejo de compra / recomendar muito', 'Gíria', '看了她的测评视频，我立刻被那款咖啡机种草了。', 'Depois de ver o vídeo de avaliação dela, fiquei logo com vontade de comprar aquela cafeteira.'],

  // ==================== B2 ====================
  // zh-b2-1: 商务谈判与合作共赢 (existing: 双赢, 账期, 条款)
  ['zh-b2-1', '让步', 'ràngbù', 'Fazer concessão / ceder', 'Verbo', '双方在价格上各自做出一点让步，才顺利签下了合同。', 'Ambas as partes fizeram pequenas concessões no preço para conseguir fechar o contrato.'],
  ['zh-b2-1', '底线', 'dǐxiàn', 'Limite mínimo / linha vermelha', 'Substantivo', '在谈判开始前，团队必须先明确我们的利润底线。', 'Antes de iniciar a negociação, a equipe precisa definir nossa margem mínima de lucro.'],
  ['zh-b2-1', '诚意', 'chéngyì', 'Sinceridade / boa-fé', 'Substantivo', '对方主动调整了付款方式，表现出了合作的诚意。', 'O parceiro ajustou a forma de pagamento por iniciativa própria, mostrando boa-fé para cooperar.'],

  // zh-b2-2: 新闻阅读与趋势分析 (existing: 日益, 转型, 因素)
  ['zh-b2-2', '普遍', 'pǔbiàn', 'Generalizado / comum', 'Adjetivo', '远程办公在科技行业已经成为一种普遍现象。', 'O trabalho remoto já se tornou um fenômeno comum no setor de tecnologia.'],
  ['zh-b2-2', '驱动', 'qūdòng', 'Impulsionar / ser o motor de', 'Verbo', '技术创新正在驱动传统制造业加快升级步伐。', 'A inovação tecnológica está impulsionando a manufatura tradicional a acelerar sua modernização.'],
  ['zh-b2-2', '趋势', 'qūshì', 'Tendência', 'Substantivo', '从最近几年的消费数据来看，绿色低碳是大趋势。', 'Pelos dados de consumo dos últimos anos, a economia verde e de baixo carbono é uma grande tendência.'],

  // zh-b2-3: 强调句式：“连……都”与“是……的” (existing: 资深, 疲惫, 定制)
  ['zh-b2-3', '居然', 'jūrán', 'Inesperadamente / até mesmo', 'Advérbio', '连平时最严谨的王老师，今天居然也迟到了。', 'Até mesmo o professor Wang, sempre tão rigoroso, inesperadamente se atrasou hoje.'],
  ['zh-b2-3', '亲自', 'qīnzì', 'Pessoalmente', 'Advérbio', '这份重要的方案是总监亲自修改定稿的。', 'Esta proposta importante foi revisada e finalizada pessoalmente pelo diretor.'],
  ['zh-b2-3', '竟然', 'jìngrán', 'Para surpresa de todos / até', 'Advérbio', '这么复杂的故障，实习生半小时竟然就修好了。', 'Uma falha tão complexa e o estagiário conseguiu consertar em apenas meia hora.'],

  // zh-b2-4: 科技伦理与可持续发展 (existing: 隐私, 可持续, 代价)
  ['zh-b2-4', '监管', 'jiānguǎn', 'Regulamentar / fiscalizar', 'Verbo', '人工智能的快速发展离不开合理的法律监管。', 'O rápido avanço da inteligência artificial não dispensa regulamentação legal adequada.'],
  ['zh-b2-4', '权衡', 'quánhéng', 'Ponderar / equilibrar prós e contras', 'Verbo', '企业在追求效率的同时，必须权衡数据安全的风险。', 'Ao buscar eficiência, as empresas precisam ponderar os riscos à segurança dos dados.'],
  ['zh-b2-4', '低碳', 'dītàn', 'De baixo carbono', 'Adjetivo', '越来越多年轻人开始选择低碳环保的出行方式。', 'Cada vez mais jovens optam por meios de transporte de baixo carbono e sustentáveis.'],

  // zh-b2-5: 高频四字成语与职场表达 (existing: 事半功倍, 循序渐进, 半途而废)
  ['zh-b2-5', '有条不紊', 'yǒu tiáo bù wěn', 'Metódico e organizado', 'Expressão Idiomática', '面对突发状况，她依然有条不紊地安排好了各项工作。', 'Diante do imprevisto, ela organizou todas as tarefas de forma metódica e tranquila.'],
  ['zh-b2-5', '精益求精', 'jīng yì qiú jīng', 'Buscar sempre a perfeição', 'Expressão Idiomática', '研发团队对产品质量精益求精，绝不放过任何细节。', 'A equipe de P&D busca excelência contínua na qualidade e não deixa passar nenhum detalhe.'],
  ['zh-b2-5', '当机立断', 'dāng jī lì duàn', 'Decidir com rapidez e firmeza', 'Expressão Idiomática', '在关键时刻，领导当机立断暂停了风险过高的项目。', 'No momento decisivo, a liderança agiu com firmeza e suspendeu o projeto de alto risco.'],

  // zh-b2-6: 数据分析与工作汇报 (existing: 同比, 得益于, 瓶颈)
  ['zh-b2-6', '环比', 'huánbǐ', 'Em comparação com o período imediatamente anterior', 'Substantivo', '本季度海外市场的销售额环比增长了百分之十五。', 'Neste trimestre, as vendas no mercado externo cresceram 15% em relação ao trimestre anterior.'],
  ['zh-b2-6', '比重', 'bǐzhòng', 'Proporção / participação percentual', 'Substantivo', '线上渠道在总营收中所占的比重正在逐年上升。', 'A participação dos canais online na receita total vem crescendo ano a ano.'],
  ['zh-b2-6', '波动', 'bōdòng', 'Flutuação / oscilar', 'Verbo', '受季节影响，近期原材料价格出现了一定幅度的波动。', 'Por fatores sazonais, os preços das matérias-primas apresentaram certa oscilação recente.'],

  // zh-b2-7: 反问句与语气微调 (existing: 难道, 何必, 究竟)
  ['zh-b2-7', '何尝', 'hécháng', 'Por acaso não...? (retórico)', 'Advérbio', '我何尝不想早点休息，只是手头的工作实在太多。', 'Por acaso eu também não queria descansar mais cedo? O problema é o excesso de trabalho.'],
  ['zh-b2-7', '未免', 'wèimiǎn', 'Um tanto exagerado / talvez demais', 'Advérbio', '因为这点小事就发这么大火，未免太小题大做了。', 'Ficar tão bravo por uma coisa tão pequena é um tanto exagerado.'],
  ['zh-b2-7', '岂不是', 'qǐ bú shì', 'Não seria então...?', 'Expressão', '如果连基础数据都错了，后面的分析岂不是白做了？', 'Se até os dados básicos estiverem errados, toda a análise seguinte não terá sido em vão?'],

  // zh-b2-8: 转述他人观点与客观报道 (existing: 透露, 澄清, 否认)
  ['zh-b2-8', '强调', 'qiángdiào', 'Enfatizar / ressaltar', 'Verbo', '发言人在记者会上多次强调，新政策不会影响普通用户。', 'O porta-voz enfatizou diversas vezes na coletiva que a nova política não afetará usuários comuns.'],
  ['zh-b2-8', '呼吁', 'hūyù', 'Apelar / exortar', 'Verbo', '专家呼吁公众不要轻信未经证实的网络传言。', 'Especialistas apelam ao público que não acredite em boatos online sem comprovação.'],
  ['zh-b2-8', '证实', 'zhèngshí', 'Confirmar / comprovar', 'Verbo', '目前官方尚未证实这项人事变动的真实性。', 'Até o momento, fontes oficiais ainda não confirmaram a veracidade dessa mudança de cargo.'],

  // zh-b2-9: 让步与无条件逻辑 (existing: 哪怕, 即使, 信用)
  ['zh-b2-9', '固然', 'gùrán', 'É verdade que / sem dúvida (concessivo)', 'Conjunção', '低价策略固然能吸引流量，但长期来看还是得靠品质。', 'Preços baixos sem dúvida atraem tráfego, mas no longo prazo é preciso depender da qualidade.'],
  ['zh-b2-9', '退一步讲', 'tuì yī bù jiǎng', 'Mesmo cedendo um pouco / na pior das hipóteses', 'Expressão', '退一步讲，就算这次没谈成，我们也积累了宝贵的经验。', 'Mesmo na pior das hipóteses, se não fecharmos agora, acumulamos experiência valiosa.'],
  ['zh-b2-9', '原则', 'yuánzé', 'Princípio', 'Substantivo', '无论合作条件多么诱人，诚信经营都是不可动摇的原则。', 'Por mais atraentes que sejam as condições, operar com integridade é um princípio inegociável.'],

  // zh-b2-10: 冲突化解与建设性沟通 (existing: 当务之急, 推诿, 复盘)
  ['zh-b2-10', '换位思考', 'huànwèi sīkǎo', 'Colocar-se no lugar do outro', 'Expressão', '双方如果能多一点换位思考，很多误会其实都能避免。', 'Se ambos os lados se colocarem mais no lugar do outro, muitos mal-entendidos serão evitados.'],
  ['zh-b2-10', '对事不对人', 'duì shì bú duì rén', 'Focar no problema, não na pessoa', 'Expressão', '讨论问题时要坚持对事不对人，这样团队才敢说真话。', 'Ao debater problemas, foque nos fatos e não nas pessoas, para que a equipe tenha segurança para opinar.'],
  ['zh-b2-10', '妥协', 'tuǒxié', 'Chegar a um compromisso / ceder', 'Verbo', '在核心利益之外的细节上适当妥协，有助于推动合作落地。', 'Ceder em detalhes fora dos interesses centrais ajuda a viabilizar a parceria.'],

  // ==================== V4 B2 ====================
  // zh-v4-b2-1: 团队冲突协调 (existing: 分歧, 折中, 内耗)
  ['zh-v4-b2-1', '疏导', 'shūdǎo', 'Canalizar / aliviar (emoções ou tensões)', 'Verbo', '项目经理及时疏导了成员的情绪，恢复了团队士气。', 'O gerente de projeto aliviou a tensão dos membros a tempo e recuperou o moral da equipe.'],
  ['zh-v4-b2-1', '达成共识', 'dáchéng gòngshí', 'Chegar a um consenso', 'Expressão', '经过两个小时的坦诚交流，大家终于就优先级达成共识。', 'Após duas horas de conversa franca, todos finalmente chegaram a um consenso sobre as prioridades.'],
  ['zh-v4-b2-1', '协调', 'xiétiáo', 'Coordenar / mediar', 'Verbo', '她非常擅长协调不同部门之间的资源与进度冲突。', 'Ela é muito habilidosa em coordenar conflitos de recursos e prazos entre áreas diferentes.'],

  // zh-v4-b2-2: 信息甄别与媒体素养 (existing: 甄别, 信源, 信息茧房)
  ['zh-v4-b2-2', '标题党', 'biāotídǎng', 'Caça-cliques (clickbait)', 'Substantivo', '不少自媒体为了赚取流量，经常使用夸张的标题党。', 'Muitas mídias independentes usam manchetes sensacionalistas de caça-cliques para ganhar audiência.'],
  ['zh-v4-b2-2', '客观', 'kèguān', 'Objetivo / imparcial', 'Adjetivo', '阅读社会新闻时，我们应当尽量寻找客观中立的报道。', 'Ao ler notícias sociais, devemos buscar reportagens objetivas e imparciais.'],
  ['zh-v4-b2-2', '断章取义', 'duàn zhāng qǔ yì', 'Tirar de contexto', 'Expressão Idiomática', '这段视频明显被断章取义了，完整的发言并不是这个意思。', 'Esse vídeo foi claramente tirado de contexto; a fala completa não significava isso.'],

  // zh-v4-b2-3: 绿色供应链 (existing: 供应链, 碳排放, 合规)
  ['zh-v4-b2-3', '循环利用', 'xúnhuán lìyòng', 'Reutilizar / reciclar em ciclo', 'Verbo', '这家物流企业开始全面推广可循环利用的环保快递箱。', 'Esta empresa de logística passou a adotar caixas ecológicas reutilizáveis em larga escala.'],
  ['zh-v4-b2-3', '溯源', 'sùyuán', 'Rastrear a origem', 'Verbo', '通过区块链技术，消费者可以扫码溯源产品的生产全过程。', 'Com blockchain, o consumidor pode escanear o código para rastrear toda a origem do produto.'],
  ['zh-v4-b2-3', '倒逼', 'dàobī', 'Pressionar de volta / forçar mudança', 'Verbo', '严格的环保标准正在倒逼上游供应商淘汰高能耗设备。', 'Normas ambientais rígidas estão forçando os fornecedores a substituir equipamentos de alto consumo.'],

  // zh-v4-b2-4: 消费者权益保护 (existing: 维权, 霸王条款, 凭证)
  ['zh-v4-b2-4', '虚假宣传', 'xūjiǎ xuānchuán', 'Propaganda enganosa', 'Substantivo', '商家因夸大产品功效涉嫌虚假宣传，被处以高额罚款。', 'A loja foi multada por propaganda enganosa ao exagerar os efeitos do produto.'],
  ['zh-v4-b2-4', '自动续费', 'zìdòng xùfèi', 'Renovação automática', 'Substantivo', '开通会员前要注意看清提示，避免忘记取消自动续费。', 'Antes de assinar um serviço, leia os avisos para não esquecer de cancelar a renovação automática.'],
  ['zh-v4-b2-4', '举证', 'jǔzhèng', 'Apresentar provas', 'Verbo', '保存好聊天记录和付款截图，关键时刻方便消费者举证。', 'Guarde o histórico de conversas e comprovantes de pagamento para apresentar provas se precisar.'],

  // zh-v4-b2-5: 远程办公效率 (existing: 异步, 交付, 边界)
  ['zh-v4-b2-5', '自律', 'zìlǜ', 'Autodisciplina', 'Adjetivo', '居家办公看似自由，实际上对个人的自律能力要求很高。', 'Trabalhar de casa parece livre, mas na prática exige muita autodisciplina.'],
  ['zh-v4-b2-5', '倦怠', 'juàndài', 'Esgotamento / burnout', 'Adjetivo', '长期缺乏线下社交，容易让人产生职业倦怠感。', 'A falta prolongada de contato presencial pode gerar sensação de esgotamento profissional.'],
  ['zh-v4-b2-5', '同步', 'tóngbù', 'Sincronizar / alinhar', 'Verbo', '每天早上十五分钟的站会，用来同步各自的任务进展。', 'A reunião rápida de 15 minutos todas as manhãs serve para alinhar o andamento das tarefas.'],

  // zh-v4-b2-6: 城市住房政策 (existing: 职住平衡, 供给, 配套)
  ['zh-v4-b2-6', '保障房', 'bǎozhàngfáng', 'Moradia popular / subsidiada', 'Substantivo', '政府加大了保障房建设力度，以缓解年轻人的租房压力。', 'O governo ampliou a construção de moradias subsidiadas para aliviar o custo do aluguel para jovens.'],
  ['zh-v4-b2-6', '老旧小区', 'lǎojiù xiǎoqū', 'Condomínio antigo', 'Substantivo', '很多老旧小区加装了电梯，极大方便了老年人出行。', 'Muitos prédios antigos instalaram elevadores, facilitando muito a locomoção dos idosos.'],
  ['zh-v4-b2-6', '通勤', 'tōngqín', 'Deslocamento casa-trabalho', 'Verbo', '住在地铁沿线虽然房租贵一点，但每天通勤能省一小时。', 'Morar perto do metrô custa um pouco mais, mas economiza uma hora de deslocamento por dia.'],

  // zh-v4-b2-7: 个人理财规划 (existing: 流动性, 分散风险, 通货膨胀)
  ['zh-v4-b2-7', '资产配置', 'zīchǎn pèizhì', 'Alocação de ativos', 'Substantivo', '合理的资产配置应当兼顾稳健收益与应急资金需求。', 'Uma alocação de ativos equilibrada deve combinar retorno estável e reserva de emergência.'],
  ['zh-v4-b2-7', '收益率', 'shōuyìlǜ', 'Taxa de retorno / rentabilidade', 'Substantivo', '理财产品承诺的预期收益率越高，往往伴随的风险也越大。', 'Quanto maior a rentabilidade prometida por um investimento, maior costuma ser o risco envolvido.'],
  ['zh-v4-b2-7', '稳健', 'wěnjiàn', 'Conservador / sólido', 'Adjetivo', '对于家庭备用金，最好选择风险较低的稳健型产品。', 'Para a reserva familiar, é melhor escolher aplicações sólidas de baixo risco.'],

  // zh-v4-b2-8: 新能源转型 (existing: 储能, 续航, 迭代)
  ['zh-v4-b2-8', '光伏', 'guāngfú', 'Energia solar fotovoltaica', 'Substantivo', '西部地区光照充足，非常适合建设大型光伏发电站。', 'A região oeste tem bastante insolação, ideal para construir grandes usinas solares fotovoltaicas.'],
  ['zh-v4-b2-8', '充电桩', 'chōngdiànzhuāng', 'Estação / ponto de recarga', 'Substantivo', '随着小区充电桩越来越普及，买电动车的人明显增多了。', 'Com os pontos de recarga cada vez mais comuns nos condomínios, cresceu o número de compradores de carros elétricos.'],
  ['zh-v4-b2-8', '替代', 'tìdài', 'Substituir', 'Verbo', '清洁能源正在逐步替代传统化石燃料，减少环境污染。', 'As energias limpas estão substituindo gradualmente os combustíveis fósseis e reduzindo a poluição.'],

  // zh-v4-b2-9: 南北文化差异 (existing: 入乡随俗, 供暖, 交融)
  ['zh-v4-b2-9', '分界线', 'fēnjièxiàn', 'Linha divisória', 'Substantivo', '秦岭和淮河通常被视为中国南北方重要的地理分界线。', 'As montanhas Qinling e o rio Huai são vistas como a principal linha divisória entre o norte e o sul da China.'],
  ['zh-v4-b2-9', '口味', 'kǒuwèi', 'Paladar / preferência de sabor', 'Substantivo', '南方菜偏清淡鲜甜，而北方很多地方口味相对偏重。', 'A culinária do sul tende a ser mais leve e adocicada, enquanto em muitas áreas do norte o sabor é mais forte.'],
  ['zh-v4-b2-9', '豪爽', 'háoshuǎng', 'Franco, expansivo e generoso', 'Adjetivo', '东北人性格大多非常豪爽，对待朋友十分热情。', 'O pessoal do nordeste da China costuma ser muito franco e caloroso com os amigos.'],

  // zh-v4-b2-10: 跨文化领导力 (existing: 共情, 共识, 归属感)
  ['zh-v4-b2-10', '包容性', 'bāoróngxìng', 'Inclusividade', 'Substantivo', '具有包容性的团队氛围，能让不同背景的员工畅所欲言。', 'Um ambiente de equipe inclusivo permite que profissionais de diferentes origens se expressem livremente.'],
  ['zh-v4-b2-10', '高语境', 'gāo yǔjìng', 'Alto contexto (comunicação implícita)', 'Substantivo', '东亚职场属于典型的高语境文化，很多意思需要体会言外之意。', 'O ambiente corporativo do Leste Asiático é de alto contexto, exigindo atenção ao que fica implícito.'],
  ['zh-v4-b2-10', '心理安全感', 'xīnlǐ ānquángǎn', 'Segurança psicológica', 'Substantivo', '建立心理安全感后，团队成员才不怕在创新中犯错。', 'Quando há segurança psicológica, os membros da equipe não têm medo de errar ao inovar.'],

  // zh-taboo-register-b2: ⚠️ 口语警示：常见粗话与礼貌替代语 (existing: 我靠, 笨蛋, 天哪, 糟糕)
  ['zh-taboo-register-b2', '见鬼', 'jiànguǐ', 'Droga! / Que coisa! (coloquial)', 'Expressão', '见鬼，刚出门钥匙又忘在屋里了。', 'Que droga, acabei de sair e esqueci a chave lá dentro de novo.'],
  ['zh-taboo-register-b2', '失礼', 'shīlǐ', 'Faltar com a educação / ser indelicado', 'Verbo', '在正式商务场合说粗话是非常失礼的行为。', 'Falar palavrão em um ambiente de negócios formal é uma grande falta de educação.'],

  // ==================== C1 ====================
  // zh-c1-1: 高阶书面连接词与逻辑架构 (existing: 固然, 鉴于, 倘若)
  ['zh-c1-1', '以至于', 'yǐzhìyú', 'A ponto de', 'Conjunção', '他工作投入到废寝忘食的地步，以至于忘了今天的聚会。', 'Ele se dedicou tanto ao trabalho que acabou esquecendo o encontro de hoje.'],
  ['zh-c1-1', '诚然', 'chéngrán', 'É verdade que / sem dúvida', 'Advérbio', '诚然，这项改革短期内会带来阵痛，但长远看利大于弊。', 'É verdade que essa reforma trará dificuldades no curto prazo, mas no longo prazo os benefícios superam os custos.'],
  ['zh-c1-1', '反之', 'fǎnzhī', 'Caso contrário / inversamente', 'Conjunção', '制度设计合理就能激发活力，反之则会挫伤积极性。', 'Um sistema bem desenhado estimula a vitalidade; caso contrário, desmotiva os envolvidos.'],

  // zh-c1-2: 宏观经济与资本市场评论 (existing: 韧性, 对冲, 提振)
  ['zh-c1-2', '供需失衡', 'gōngxū shīhéng', 'Desequilíbrio entre oferta e demanda', 'Substantivo', '供应链中断导致部分核心零部件出现严重的供需失衡。', 'A interrupção da cadeia de suprimentos gerou grave desequilíbrio entre oferta e demanda em peças-chave.'],
  ['zh-c1-2', '滞胀', 'zhìzhàng', 'Estagflação', 'Substantivo', '经济增长放缓与高通胀并存，使决策者面临滞胀风险。', 'A desaceleração econômica somada à inflação alta expõe os formuladores de política ao risco de estagflação.'],
  ['zh-c1-2', '宽松政策', 'kuānsōng zhèngcè', 'Política monetária expansionista', 'Substantivo', '央行暗示若就业数据继续走弱，或将重启货币宽松政策。', 'O banco central sinalizou que, se o emprego continuar enfraquecendo, poderá retomar a política expansionista.'],

  // zh-c1-3: 语体色彩：书面语与口语的精准切换 (existing: 颇为, 妥善, 莅临)
  ['zh-c1-3', '缘于', 'yuányú', 'Originar-se de / dever-se a', 'Verbo', '此次项目延期主要缘于前期需求调研不够充分。', 'O atraso do projeto deveu-se principalmente a um levantamento inicial insuficiente de requisitos.'],
  ['zh-c1-3', '亟待', 'jídài', 'Urgir / precisar com urgência', 'Advérbio', '农村医疗资源不足的问题亟待通过制度创新加以解决。', 'A escassez de recursos médicos rurais precisa com urgência ser resolvida por meio de inovação institucional.'],
  ['zh-c1-3', '悉数', 'xīshù', 'Integralmente / todos sem exceção', 'Advérbio', '所有受灾群众已在天黑前悉数转移至安全地带。', 'Todos os moradores afetados foram integralmente transferidos para áreas seguras antes do anoitecer.'],

  // zh-c1-4: 外交辞令与委婉拒绝的艺术 (existing: 商榷, 囿于, 潜台词)
  ['zh-c1-4', '留白', 'liúbái', 'Deixar margem / espaço implícito', 'Substantivo', '高明的谈判者懂得在表态时适当留白，为后续转圜留下空间。', 'Negociadores habilidosos sabem deixar margem nas declarações para permitir ajustes futuros.'],
  ['zh-c1-4', '缓兵之计', 'huǎn bīng zhī jì', 'Estratégia dilatória / ganhar tempo', 'Expressão Idiomática', '对方提出成立联合工作组，很大程度上只是一种缓兵之计。', 'A proposta do outro lado de criar um grupo conjunto é, em grande parte, uma tática para ganhar tempo.'],
  ['zh-c1-4', '体面', 'tǐmiàn', 'Digno / honroso / elegante', 'Adjetivo', '如何在拒绝合作的同时让双方都体面下台，是一门沟通艺术。', 'Saber recusar uma parceria preservando a dignidade de ambos os lados é uma arte da comunicação.'],

  // zh-c1-5: 俗语谚语与文化意蕴 (existing: 求同存异, 未雨绸缪, 水到渠成)
  ['zh-c1-5', '塞翁失马', 'sài wēng shī mǎ', 'Há males que vêm para bem', 'Expressão Idiomática', '没拿到那个offer别灰心，塞翁失马，也许更好的机会在后面。', 'Não desanime por não ter conseguido aquela vaga; há males que vêm para bem, e algo melhor pode surgir.'],
  ['zh-c1-5', '物极必反', 'wù jí bì fǎn', 'Tudo em excesso gera o efeito oposto', 'Expressão Idiomática', '过度营销反而会引发消费者反感，正所谓物极必反。', 'Marketing excessivo acaba afastando o consumidor, pois tudo em demasia gera o efeito oposto.'],
  ['zh-c1-5', '兼听则明', 'jiān tīng zé míng', 'Ouvir todos os lados traz clareza', 'Expressão Idiomática', '管理者做决策前要多听不同声音，古人常说兼听则明。', 'Antes de decidir, o gestor deve ouvir diferentes opiniões; ouvir todos os lados traz clareza.'],

  // zh-c1-6: 法律条文与商业合规 (existing: 履行, 违约, 约束力)
  ['zh-c1-6', '保密协议', 'bǎomì xiéyì', 'Acordo de confidencialidade (NDA)', 'Substantivo', '在接触核心技术文档前，所有外部顾问都必须签署保密协议。', 'Antes de acessar os documentos técnicos centrais, todos os consultores externos devem assinar um NDA.'],
  ['zh-c1-6', '知识产权', 'zhīshí chǎnquán', 'Propriedade intelectual', 'Substantivo', '跨境合作协议中必须清晰界定双方共同研发成果的知识产权归属。', 'Contratos internacionais devem definir com clareza a titularidade da propriedade intelectual conjunta.'],
  ['zh-c1-6', '仲裁', 'zhòngcái', 'Arbitragem', 'Substantivo', '若协商不成，双方同意将争议提交新加坡国际仲裁中心裁决。', 'Caso não haja acordo amigável, as partes concordam em submeter a disputa à arbitragem internacional em Singapura.'],

  // zh-c1-7: 学术思辨与批判性论证 (existing: 归根结底, 毋庸置疑, 范式)
  ['zh-c1-7', '不可否认', 'bùkě fǒurèn', 'É inegável que', 'Expressão', '不可否认，量化模型提高了效率，但它无法替代人类的价值判断。', 'É inegável que modelos quantitativos elevam a eficiência, mas não substituem o juízo de valor humano.'],
  ['zh-c1-7', '无非', 'wúfēi', 'Não passa de / apenas', 'Advérbio', '这两种看似对立的观点，其本质无非是观察视角不同罢了。', 'Essas duas visões aparentemente opostas não passam, no fundo, de perspectivas distintas de observação.'],
  ['zh-c1-7', '立论', 'lìlùn', 'Construir a tese / argumentação', 'Verbo', '一篇优秀的学术论文应当立论严谨、论据充分且逻辑自洽。', 'Um bom artigo acadêmico deve apresentar tese rigorosa, evidências sólidas e coerência lógica.'],

  // zh-c1-8: 领导力与组织文化塑造 (existing: 赋能, 凝聚力, 敏捷)
  ['zh-c1-8', '容错机制', 'róngcuò jīzhì', 'Mecanismo de tolerância a erros', 'Substantivo', '缺乏容错机制的组织，往往难以激发一线员工的试错热情。', 'Organizações sem tolerância a erros raramente conseguem estimular a experimentação na linha de frente.'],
  ['zh-c1-8', '自上而下', 'zì shàng ér xià', 'De cima para baixo (top-down)', 'Expressão', '仅靠自上而下的行政命令推行变革，往往会在执行层遇阻。', 'Impulsionar mudanças apenas com ordens de cima para baixo costuma encontrar resistência na execução.'],
  ['zh-c1-8', '愿景', 'yuànjǐng', 'Visão (organizacional)', 'Substantivo', '清晰且鼓舞人心的企业愿景，能够在危机时刻稳住团队军心。', 'Uma visão corporativa clara e inspiradora ajuda a manter a equipe unida em momentos de crise.'],

  // zh-c1-9: 媒体专访与公众表达 (existing: 深入浅出, 不卑不亢, 催化剂)
  ['zh-c1-9', '张弛有度', 'zhāng chí yǒu dù', 'Com ritmo equilibrado entre firmeza e leveza', 'Expressão Idiomática', '整场演讲节奏张弛有度，既有严谨的数据支撑，也不乏幽默感。', 'Toda a palestra teve ritmo equilibrado, unindo dados rigorosos e bom humor na medida certa.'],
  ['zh-c1-9', '逻辑自洽', 'luójí zìqià', 'Logicamente consistente', 'Expressão', '面对记者连环追问，她的回应始终逻辑自洽，毫无破绽。', 'Diante das perguntas incisivas dos jornalistas, sua resposta manteve total consistência lógica.'],
  ['zh-c1-9', '言简意赅', 'yán jiǎn yì gāi', 'Conciso e direto ao ponto', 'Expressão Idiomática', '在电视直播中时间有限，嘉宾的发言更需要做到言简意赅。', 'Com o tempo limitado em transmissões ao vivo, as falas dos convidados precisam ser concisas e claras.'],

  // zh-c1-10: 融会贯通：中巴跨文化桥梁与战略视野 (existing: 行稳致远, 深谙, 牵线搭桥)
  ['zh-c1-10', '经贸合作', 'jīngmào hézuò', 'Cooperação econômica e comercial', 'Substantivo', '近年来，中巴两国在农业与新能源领域的经贸合作不断深化。', 'Nos últimos anos, a cooperação econômica e comercial entre China e Brasil em agricultura e energia limpa vem se aprofundando.'],
  ['zh-c1-10', '互利共赢', 'hùlì gòngyíng', 'Benefício mútuo e ganho compartilhado', 'Expressão Idiomática', '跨国项目唯有坚持互利共赢，才能赢得当地社会的长期信任。', 'Projetos internacionais só conquistam confiança duradoura local quando pautados pelo benefício mútuo.'],
  ['zh-c1-10', '互通有无', 'hù tōng yǒu wú', 'Suprir-se mutuamente / trocar recursos e saberes', 'Expressão Idiomática', '双方在技术与市场资源上高度互补，完全可以互通有无。', 'Os dois lados são altamente complementares em tecnologia e mercado, podendo trocar recursos com vantagem mútua.'],

  // ==================== V4 C1 ====================
  // zh-v4-c1-1: 危机公关应对 (existing: 公信力, 避重就轻, 推诿塞责)
  ['zh-v4-c1-1', '窗口期', 'chuāngkǒuqī', 'Janela de oportunidade / prazo crítico', 'Substantivo', '品牌危机爆发后的二十四小时是回应舆情的黄金窗口期。', 'As primeiras 24 horas após o estouro de uma crise de marca são a janela crítica para responder ao público.'],
  ['zh-v4-c1-1', '致歉声明', 'zhìqiàn shēngmíng', 'Nota de pedido de desculpas', 'Substantivo', '一份诚恳的致歉声明应当直面问题本质，并给出明确整改时间表。', 'Uma nota de desculpas sincera deve encarar a raiz do problema e apresentar prazos claros de correção.'],
  ['zh-v4-c1-1', '舆论', 'yúlùn', 'Opinião pública', 'Substantivo', '如果不能及时公布调查进展，负面舆论很可能会进一步发酵。', 'Se o andamento da apuração não for divulgado a tempo, a opinião pública negativa tende a se agravar.'],

  // zh-v4-c1-2: 宏观经济简报 (existing: 宏观经济, 流动性, 未雨绸缪)
  ['zh-v4-c1-2', '由此可见', 'yóucǐ kějiàn', 'Disso se conclui que / portanto', 'Expressão', '出口订单连续三个月回升，由此可见外需正在逐步回暖。', 'Os pedidos de exportação subiram por três meses seguidos; disso se conclui que a demanda externa está se recuperando.'],
  ['zh-v4-c1-2', '货币政策', 'huòbì zhèngcè', 'Política monetária', 'Substantivo', '稳健的货币政策有助于在控制通胀的同时维持市场信心。', 'Uma política monetária prudente ajuda a controlar a inflação mantendo a confiança do mercado.'],
  ['zh-v4-c1-2', '总而言之', 'zǒng ér yán zhī', 'Em suma / em resumo', 'Expressão', '总而言之，下半年经济走势将高度依赖内需消费的恢复程度。', 'Em suma, o desempenho econômico do segundo semestre dependerá fortemente da retomada do consumo interno.'],

  // zh-v4-c1-3: 商业合同条款 (existing: 不可抗力, 履约, 无异于)
  ['zh-v4-c1-3', '管辖权', 'guǎnxiáquán', 'Jurisdição', 'Substantivo', '涉外合同中必须明确约定发生诉讼时的法院管辖权归属。', 'Em contratos internacionais, é indispensável definir qual tribunal terá jurisdição em caso de litígio.'],
  ['zh-v4-c1-3', '予以', 'yǔyǐ', 'Conceder / aplicar / dar (formal)', 'Verbo', '对于严重违反保密义务的行为，甲方有权依法予以追究。', 'Em caso de violação grave de sigilo, a parte contratante tem o direito de responsabilizar legalmente.'],
  ['zh-v4-c1-3', '终止', 'zhōngzhǐ', 'Rescindir / encerrar', 'Verbo', '若一方连续六十天未能履约，另一方有权书面通知终止协议。', 'Se uma das partes descumprir o contrato por sessenta dias seguidos, a outra poderá rescindi-lo por escrito.'],

  // zh-v4-c1-4: 学术论文同行评审 (existing: 佐证, 有待商榷, 稳健性)
  ['zh-v4-c1-4', '同行评审', 'tóngháng píngshěn', 'Revisão por pares', 'Substantivo', '这篇稿件经过三轮严格的同行评审后，终于被核心期刊录用。', 'Após três rodadas rigorosas de revisão por pares, o manuscrito foi aceito pelo periódico.'],
  ['zh-v4-c1-4', '样本量', 'yàngběnliàng', 'Tamanho da amostra', 'Substantivo', '作者在结论部分应当补充说明实验样本量偏小可能带来的局限性。', 'Na conclusão, os autores devem comentar as limitações decorrentes do tamanho reduzido da amostra.'],
  ['zh-v4-c1-4', '驳斥', 'bóchì', 'Refutar', 'Verbo', '论文第二节引用了最新田野数据，有力地驳斥了既有假说。', 'A segunda seção do artigo cita dados de campo recentes e refuta de forma convincente a hipótese anterior.'],

  // zh-v4-c1-5: 公共政策辩论 (existing: 治标不治本, 初衷, 流于形式)
  ['zh-v4-c1-5', '长效机制', 'chángxiào jīzhì', 'Mecanismo de longo prazo', 'Substantivo', '治理交通拥堵不能仅靠限号，更需要建立完善的公共交通长效机制。', 'Combater o congestionamento exige mais do que rodízio de placas; requer um mecanismo duradouro de transporte público.'],
  ['zh-v4-c1-5', '岂非', 'qǐfēi', 'Não seria isso...? (retórico formal)', 'Advérbio', '若只顾短期政绩而透支生态资源，岂非饮鸩止渴？', 'Se buscarmos apenas resultados imediatos esgotando recursos naturais, não seria isso sacrificar o futuro?'],
  ['zh-v4-c1-5', '兼顾', 'jiāngù', 'Conciliar / atender simultaneamente', 'Verbo', '制定税收政策时，如何在促进效率与保障公平之间兼顾平衡至关重要。', 'Ao formular políticas tributárias, é crucial conciliar eficiência econômica e justiça social.'],

  // zh-v4-c1-6: 网络安全治理 (existing: 防微杜渐, 脱敏, 形同虚设)
  ['zh-v4-c1-6', '零信任', 'líng xìnrèn', 'Confiança zero (Zero Trust)', 'Substantivo', '部署零信任安全架构后，每一次内网访问都需要进行动态身份校验。', 'Após adotar a arquitetura Zero Trust, todo acesso interno exige verificação dinâmica de identidade.'],
  ['zh-v4-c1-6', '数据主权', 'shùjù zhǔquán', 'Soberania de dados', 'Substantivo', '跨境云服务商在拓展海外业务时，必须严格遵守当地的数据主权法规。', 'Provedores de nuvem globais devem cumprir rigorosamente as leis locais de soberania de dados.'],
  ['zh-v4-c1-6', '漏洞', 'lòudòng', 'Vulnerabilidade / brecha', 'Substantivo', '安全团队在例行渗透测试中发现了一个高危漏洞，并连夜完成了修复。', 'A equipe de segurança detectou uma vulnerabilidade crítica no teste de invasão e a corrigiu durante a noite.'],

  // zh-v4-c1-7: 修辞与成语精准运用 (existing: 画龙点睛, 望文生义, 集思广益)
  ['zh-v4-c1-7', '排比', 'páibǐ', 'Paralelismo retórico', 'Substantivo', '演讲结尾连续使用了三个排比句，极大增强了语言的感染力。', 'O uso de três frases em paralelismo retórico no final do discurso ampliou muito seu impacto.'],
  ['zh-v4-c1-7', '褒贬色彩', 'bāobiǎn sècǎi', 'Conotação elogiosa ou pejorativa', 'Substantivo', '使用成语时切忌混淆褒贬色彩，比如“处心积虑”通常含有贬义。', 'Ao usar chengyu, evite confundir a conotação; expressões como “处心积虑” têm sentido pejorativo.'],
  ['zh-v4-c1-7', '恰如其分', 'qià rú qí fèn', 'Na medida exata / apropriado', 'Expressão Idiomática', '他在致辞中引用那句古诗恰如其分，既点明了主题又不显卖弄。', 'A citação poética em seu discurso foi na medida exata, iluminando o tema sem soar pedante.'],

  // zh-v4-c1-8: 外交谈判技巧 (existing: 不卑不亢, 相向而行, 回旋余地)
  ['zh-v4-c1-8', '磋商', 'cuōshāng', 'Consultar / negociar diplomaticamente', 'Verbo', '双方代表团就关税减免细则进行了为期三天的闭门磋商。', 'As delegações realizaram três dias de consultas a portas fechadas sobre os detalhes da redução tarifária.'],
  ['zh-v4-c1-8', '立场', 'lìchǎng', 'Posição / posicionamento', 'Substantivo', '尽管各方在细节上仍有分歧，但推动对话的共同立场并未改变。', 'Embora haja divergências nos detalhes, a posição comum em favor do diálogo permanece inalterada.'],
  ['zh-v4-c1-8', '搁置争议', 'gēzhì zhēngyì', 'Deixar divergências de lado temporariamente', 'Expressão', '本着先易后难的原则，双方同意暂时搁置争议，优先推进务实合作。', 'Seguindo o princípio de começar pelo mais fácil, ambos concordaram em deixar divergências de lado e avançar na cooperação prática.'],

  // zh-v4-c1-9: 人工智能伦理 (existing: 因噎废食, 可追溯, 行稳致远)
  ['zh-v4-c1-9', '算法偏见', 'suànfǎ piānjiàn', 'Viés algorítmico', 'Substantivo', '若训练数据本身存在结构性失衡，模型输出就极易放大算法偏见。', 'Se os dados de treino tiverem desequilíbrios estruturais, o modelo tenderá a amplificar o viés algorítmico.'],
  ['zh-v4-c1-9', '技术向善', 'jìshù xiàngshàn', 'Tecnologia para o bem (Tech for Good)', 'Expressão', '科技企业应当秉持技术向善的理念，防止工具被用于操纵舆论。', 'Empresas de tecnologia devem adotar o princípio da tecnologia para o bem, evitando manipulação pública.'],
  ['zh-v4-c1-9', '版权归属', 'bǎnquán guīshǔ', 'Titularidade de direitos autorais', 'Substantivo', '生成式人工智能创作内容的版权归属问题，目前在各国仍存在法律争议。', 'A titularidade de direitos autorais de conteúdos gerados por IA ainda gera debates jurídicos em vários países.'],

  // zh-v4-c1-10: 当代文学赏析 (existing: 意象, 留白, 见微知著)
  ['zh-v4-c1-10', '叙事张力', 'xùshì zhānglì', 'Tensão narrativa', 'Substantivo', '作者通过克制的对话与环境描写，营造出极强的叙事张力。', 'Por meio de diálogos contidos e descrições ambientais, o autor cria uma forte tensão narrativa.'],
  ['zh-v4-c1-10', '隐喻', 'yǐnyù', 'Metáfora', 'Substantivo', '小说中反复出现的旧车站，其实是对时代变迁的深刻隐喻。', 'A antiga estação que reaparece no romance é, na verdade, uma metáfora profunda da passagem do tempo.'],
  ['zh-v4-c1-10', '悲悯', 'bēimǐn', 'Compaixão / olhar compassivo', 'Substantivo', '优秀文学作品的动人之处，往往在于字里行间流露出的对普通人的悲悯。', 'O que torna uma grande obra comovente é a compaixão pelos seres humanos comuns revelada nas entrelinhas.'],
];

export const VOCAB_FIXES_ZH: VocabExampleFixMap = {
  'voc-zh-a1-1-2': {
    exampleEn: '谢谢你的帮助，今天真的太麻烦你了！',
    examplePt: 'Obrigado pela sua ajuda, hoje realmente dei muito trabalho para você!',
  },
  'voc-zh-a1-5-3': {
    exampleEn: '我现在正准备出门去地铁站。',
    examplePt: 'Agora mesmo estou me preparando para sair rumo à estação de metrô.',
  },
  'voc-zh-a1-9-3': {
    exampleEn: '我每天下班后都会去公园做半小时运动。',
    examplePt: 'Todos os dias depois do trabalho vou ao parque fazer meia hora de exercício.',
  },
  'voc-zh-v4-a1-1-2': {
    exampleEn: '下班后我打算去附近的超市买些水果和牛奶。',
    examplePt: 'Depois do trabalho pretendo ir ao supermercado perto de casa comprar frutas e leite.',
  },
  'voc-zh-v4-a1-3-3': {
    exampleEn: '我已经用手机买好去上海的高铁车票了。',
    examplePt: 'Já comprei pelo celular a passagem de trem-bala para Xangai.',
  },
  'voc-zh-v4-a1-8-2': {
    exampleEn: '前面那台自动取款机可以用外国银行卡取钱。',
    examplePt: 'Aquele caixa eletrônico ali na frente aceita cartão estrangeiro para sacar dinheiro.',
  },
  'voc-zh-v4-a1-9-1': {
    exampleEn: '我头发长了，周末想去小区门口理发。',
    examplePt: 'Meu cabelo cresceu e quero ir cortar no salão da entrada do condomínio no fim de semana.',
  },
  'voc-zh-v4-a1-9-3': {
    exampleEn: '街角新开了一家洗衣店，洗大衣很方便。',
    examplePt: 'Abriu uma lavanderia nova na esquina, é bem prático para lavar casacos.',
  },
  'voc-zh-v4-a1-10-3': {
    exampleEn: '明天上午九点开会，请大家准时到场。',
    examplePt: 'Amanhã a reunião é às nove da manhã, por favor cheguem no horário.',
  },
  'voc-zh-a2-2-3': {
    exampleEn: '经理正在主持一个重要会议，请稍等片刻。',
    examplePt: 'O gerente está conduzindo uma reunião importante agora, aguarde um instante.',
  },
  'voc-zh-a2-4-3': {
    exampleEn: '博物馆展厅内不允许使用闪光灯拍照。',
    examplePt: 'Não é permitido usar flash para tirar fotos dentro das galerias do museu.',
  },
  'voc-zh-a2-10-1': {
    exampleEn: '服务员，请把菜单拿过来给我们看一下好吗？',
    examplePt: 'Garçom, pode trazer o cardápio para darmos uma olhada, por favor?',
  },
  'voc-zh-v4-a2-9-1': {
    exampleEn: '周末早上我喜欢去附近的菜市场买新鲜蔬菜。',
    examplePt: 'Nas manhãs de fim de semana gosto de ir à feira perto de casa comprar verduras frescas.',
  },
  'voc-zh-v4-a2-9-2': {
    exampleEn: '在这个市场买东西可以礼貌地和摊主砍价。',
    examplePt: 'Neste mercado dá para pechinchar com educação com os vendedores.',
  },
  'voc-zh-v4-a2-9-3': {
    exampleEn: '一共四十二块，老板很爽快地给我抹零算四十块。',
    examplePt: 'Deu quarenta e dois yuans no total, e o dono arredondou simpaticamente para quarenta.',
  },
  'voc-zh-v4-a2-10-1': {
    exampleEn: '比起高档餐厅，我更喜欢吃妈妈做的家常菜。',
    examplePt: 'Em vez de restaurantes caros, prefiro comer a comida caseira feita pela minha mãe.',
  },
  'voc-zh-v4-a2-10-3': {
    exampleEn: '这道菜只需要加一点盐和生抽简单调味就够了。',
    examplePt: 'Este prato só precisa de um pouco de sal e shoyu claro para temperar bem.',
  },
  'voc-zh-b1-1-2': {
    exampleEn: '离开办公室之前，别忘了把电脑和空调都关掉。',
    examplePt: 'Antes de sair do escritório, não se esqueça de desligar o computador e o ar-condicionado.',
  },
  'voc-zh-b1-5-3': {
    exampleEn: '有了无线网络，我们现在可以随时随地查资料。',
    examplePt: 'Com a rede sem fio, agora podemos consultar informações a qualquer hora e lugar.',
  },
  'voc-zh-b1-9-3': {
    exampleEn: '在别人家做客前，最好先了解一下当地的饮食习惯。',
    examplePt: 'Antes de visitar a casa de alguém, vale conhecer os hábitos alimentares locais.',
  },
  'voc-zh-v4-b1-2-1': {
    exampleEn: '我下周二有一场线上面试，这两天正在认真准备。',
    examplePt: 'Tenho uma entrevista online na próxima terça e estou me preparando bem nestes dias.',
  },
  'voc-zh-idioms-b1-4': {
    exampleEn: '我的法语水平还马马虎虎，只能进行简单的日常对话。',
    examplePt: 'Meu francês ainda é mais ou menos, só consigo manter conversas simples do dia a dia.',
  },
  'voc-zh-slang-b1-4': {
    exampleEn: '忙完这个大项目后，我只想周末在家躺平好好休息。',
    examplePt: 'Depois de terminar este grande projeto, só quero desacelerar e descansar em casa no fim de semana.',
  },
  'voc-zh-b2-6-3': {
    exampleEn: '目前物流配送速度已经成为制约业务增长的最大瓶颈。',
    examplePt: 'Atualmente a velocidade de entrega logística tornou-se o maior gargalo para o crescimento do negócio.',
  },
  'voc-zh-v4-b2-3-2': {
    exampleEn: '企业通过改用清洁能源，在三年内将碳排放降低了三成。',
    examplePt: 'Ao migrar para energia limpa, a empresa reduziu suas emissões de carbono em 30% em três anos.',
  },
  'voc-zh-v4-b2-4-1': {
    exampleEn: '面对商家的不合理收费，消费者应当留存证据依法维权。',
    examplePt: 'Diante de cobranças abusivas, o consumidor deve guardar provas e defender seus direitos na forma da lei.',
  },
  'voc-zh-v4-b2-4-2': {
    exampleEn: '合同中“概不退换”的规定属于典型的霸王条款，依法无效。',
    examplePt: 'A regra de “sem trocas nem devoluções” no contrato é uma cláusula abusiva típica e juridicamente nula.',
  },
  'voc-zh-taboo-register-b2-2': {
    exampleEn: '别听他瞎说，你根本不是什么笨蛋，只是需要多一点练习。',
    examplePt: 'Não ligue para o que ele diz; você não é nenhum bobão, só precisa de um pouco mais de prática.',
  },
  'voc-zh-c1-3-2': {
    exampleEn: '这起客户投诉已经由法务与客服团队妥善处理完毕。',
    examplePt: 'Esta reclamação de cliente já foi devidamente resolvida pelas equipes jurídica e de atendimento.',
  },
  'voc-zh-c1-4-3': {
    exampleEn: '听懂对方话语背后的潜台词，往往比字面意思更重要。',
    examplePt: 'Captar o subtexto por trás das palavras do interlocutor costuma ser mais importante que o sentido literal.',
  },
  'voc-zh-c1-7-3': {
    exampleEn: '生成式人工智能的普及正在重塑信息检索的研究范式。',
    examplePt: 'A difusão da IA generativa está remodelando o paradigma de pesquisa em recuperação da informação.',
  },
  'voc-zh-v4-c1-1-2': {
    exampleEn: '公关声明如果只是避重就轻，反而会进一步激怒公众。',
    examplePt: 'Se uma nota de crise apenas desviar do essencial para o trivial, acabará irritando ainda mais o público.',
  },
  'voc-zh-v4-c1-2-1': {
    exampleEn: '制定年度预算时，企业必须充分评估当前宏观经济的不确定性。',
    examplePt: 'Ao elaborar o orçamento anual, a empresa precisa avaliar bem as incertezas macroeconômicas atuais.',
  },
  'voc-zh-v4-c1-2-2': {
    exampleEn: '央行通过公开市场操作向金融体系注入了充足的流动性。',
    examplePt: 'O banco central injetou liquidez suficiente no sistema financeiro por meio de operações de mercado aberto.',
  },
  'voc-zh-v4-c1-5-3': {
    exampleEn: '若缺乏有效监督与考核，再好的改革方案也会流于形式。',
    examplePt: 'Sem fiscalização e avaliação eficazes, até o melhor plano de reforma acaba virando mera formalidade.',
  },
  'voc-zh-v4-c1-8-3': {
    exampleEn: '先保留一部分可调整条件，能为下一轮磋商留出充足的回旋余地。',
    examplePt: 'Manter algumas condições ajustáveis garante ampla margem de manobra para a próxima rodada de negociação.',
  },
  'voc-zh-v4-c1-9-3': {
    exampleEn: '只有在技术创新的同时守住伦理底线，人工智能产业才能行稳致远。',
    examplePt: 'Somente mantendo limites éticos junto à inovação o setor de IA poderá avançar com estabilidade rumo ao longe.',
  },
};

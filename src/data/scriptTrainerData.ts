export interface ScriptCharacterItem {
  char: string;
  reading: string;
  meaningPt: string;
  strokes: number;
  strokeHints: string[];
  exampleWord: string;
  examplePt: string;
  cursiveNote?: string;
}

export interface MandarinToneGuide {
  tone: 1 | 2 | 3 | 4;
  namePt: string;
  contour: string;
  descriptionPt: string;
  exampleHanzi: string;
  examplePinyin: string;
  examplePt: string;
}

export const JAPANESE_HIRAGANA: ScriptCharacterItem[] = [
  { char: 'あ', reading: 'a', meaningPt: 'Vogal A', strokes: 3, strokeHints: ['1. Traço horizontal curto no topo', '2. Traço vertical curvado descendo pelo centro', '3. Laço amplo da direita para baixo e esquerda'], exampleWord: 'あさ (asa)', examplePt: 'manhã' },
  { char: 'い', reading: 'i', meaningPt: 'Vogal I', strokes: 2, strokeHints: ['1. Curva descendente à esquerda com gancho (hane)', '2. Traço menor à direita inclinado'], exampleWord: 'いえ (ie)', examplePt: 'casa' },
  { char: 'う', reading: 'u', meaningPt: 'Vogal U', strokes: 2, strokeHints: ['1. Pequeno traço diagonal no topo', '2. Grande curva semicircular para baixo'], exampleWord: 'うみ (umi)', examplePt: 'mar' },
  { char: 'え', reading: 'e', meaningPt: 'Vogal E', strokes: 2, strokeHints: ['1. Pequeno traço superior inclinado', '2. Zigue-zague fluido terminando para a direita'], exampleWord: 'えき (eki)', examplePt: 'estação de trem' },
  { char: 'お', reading: 'o', meaningPt: 'Vogal O', strokes: 3, strokeHints: ['1. Horizontal curto', '2. Vertical descendo e fazendo laço amplo', '3. Ponto pequeno no canto superior direito'], exampleWord: 'おちゃ (ocha)', examplePt: 'chá' },
  { char: 'か', reading: 'ka', meaningPt: 'Sílaba KA', strokes: 3, strokeHints: ['1. Horizontal dobrando para baixo com gancho', '2. Diagonal cruzando de cima para baixo', '3. Pequeno traço à direita'], exampleWord: 'かさ (kasa)', examplePt: 'guarda-chuva' },
  { char: 'き', reading: 'ki', meaningPt: 'Sílaba KI', strokes: 4, strokeHints: ['1. Horizontal superior', '2. Segundo horizontal paralelo', '3. Diagonal descendo pelo meio', '4. Base curvada à esquerda'], exampleWord: 'きっぷ (kippu)', examplePt: 'bilhete / passagem' },
  { char: 'く', reading: 'ku', meaningPt: 'Sílaba KU', strokes: 1, strokeHints: ['1. Traço único em formato de bico (<) de cima para baixo'], exampleWord: 'くつ (kutsu)', examplePt: 'sapato' },
  { char: 'け', reading: 'ke', meaningPt: 'Sílaba KE', strokes: 3, strokeHints: ['1. Vertical esquerdo com leve gancho', '2. Horizontal curto à direita', '3. Vertical curvando para a esquerda'], exampleWord: 'けさ (kesa)', examplePt: 'esta manhã' },
  { char: 'こ', reading: 'ko', meaningPt: 'Sílaba KO', strokes: 2, strokeHints: ['1. Traço superior horizontal com leve curva', '2. Curva inferior aberta para cima'], exampleWord: 'ここ (koko)', examplePt: 'aqui' },
  { char: 'さ', reading: 'sa', meaningPt: 'Sílaba SA', strokes: 3, strokeHints: ['1. Horizontal curto', '2. Diagonal cruzando', '3. Base curvada'], exampleWord: 'さくら (sakura)', examplePt: 'flor de cerejeira' },
  { char: 'し', reading: 'shi', meaningPt: 'Sílaba SHI', strokes: 1, strokeHints: ['1. Traço único descendo reto e curvando suave para a direita'], exampleWord: 'しごと (shigoto)', examplePt: 'trabalho' },
  { char: 'す', reading: 'su', meaningPt: 'Sílaba SU', strokes: 2, strokeHints: ['1. Horizontal longo', '2. Vertical cruzando com laço no meio descendo à esquerda'], exampleWord: 'すし (sushi)', examplePt: 'sushi' },
  { char: 'た', reading: 'ta', meaningPt: 'Sílaba TA', strokes: 4, strokeHints: ['1. Horizontal', '2. Diagonal à esquerda', '3-4. Dois traços horizontais curtos à direita'], exampleWord: 'たべる (taberu)', examplePt: 'comer' },
  { char: 'ち', reading: 'chi', meaningPt: 'Sílaba CHI', strokes: 2, strokeHints: ['1. Horizontal superior', '2. Vertical curvando em grande barriga para baixo'], exampleWord: 'ちず (chizu)', examplePt: 'mapa' },
  { char: 'つ', reading: 'tsu', meaningPt: 'Sílaba TSU', strokes: 1, strokeHints: ['1. Arco único da esquerda para a direita descendo suavemente'], exampleWord: 'つくえ (tsukue)', examplePt: 'mesa' },
  { char: 'て', reading: 'te', meaningPt: 'Sílaba TE', strokes: 1, strokeHints: ['1. Horizontal curto que dobra em curva ampla para baixo'], exampleWord: 'てがみ (tegami)', examplePt: 'carta' },
  { char: 'と', reading: 'to', meaningPt: 'Sílaba TO', strokes: 2, strokeHints: ['1. Pequeno traço inclinado descendo', '2. Curva em C abrindo para a direita'], exampleWord: 'とけい (tokei)', examplePt: 'relógio' },
  { char: 'な', reading: 'na', meaningPt: 'Sílaba NA', strokes: 4, strokeHints: ['1. Horizontal', '2. Diagonal', '3. Ponto à direita', '4. Vertical com laço'], exampleWord: 'なまえ (namae)', examplePt: 'nome' },
  { char: 'に', reading: 'ni', meaningPt: 'Sílaba NI', strokes: 3, strokeHints: ['1. Vertical esquerdo', '2. Horizontal superior direito', '3. Horizontal inferior direito'], exampleWord: 'にほん (nihon)', examplePt: 'Japão' },
  { char: 'の', reading: 'no', meaningPt: 'Partícula NO', strokes: 1, strokeHints: ['1. Espiral contínua começando do topo, descendo à esquerda e fechando por cima'], exampleWord: 'のみもの (nomimono)', examplePt: 'bebida' },
  { char: 'は', reading: 'ha/wa', meaningPt: 'Sílaba HA (partícula WA)', strokes: 3, strokeHints: ['1. Vertical esquerdo', '2. Horizontal direito', '3. Vertical direito com laço'], exampleWord: 'はな (hana)', examplePt: 'flor' },
  { char: 'ま', reading: 'ma', meaningPt: 'Sílaba MA', strokes: 3, strokeHints: ['1. Horizontal superior', '2. Horizontal do meio', '3. Vertical com laço na base'], exampleWord: 'まち (machi)', examplePt: 'cidade' },
  { char: 'み', reading: 'mi', meaningPt: 'Sílaba MI', strokes: 2, strokeHints: ['1. Horizontal dobrando em diagonal e laço', '2. Traço diagonal cortando à direita'], exampleWord: 'みず (mizu)', examplePt: 'água' },
  { char: 'ん', reading: 'n', meaningPt: 'Consoante nasal N', strokes: 1, strokeHints: ['1. Traço único descendo em diagonal, subindo pelo meio e saindo à direita'], exampleWord: 'ほん (hon)', examplePt: 'livro' },
];

export const JAPANESE_KATAKANA: ScriptCharacterItem[] = [
  { char: 'ア', reading: 'a', meaningPt: 'Katakana A', strokes: 2, strokeHints: ['1. Horizontal dobrando em diagonal curta', '2. Curva descendo à esquerda'], exampleWord: 'アプリ (apuri)', examplePt: 'aplicativo' },
  { char: 'イ', reading: 'i', meaningPt: 'Katakana I', strokes: 2, strokeHints: ['1. Diagonal longa para a esquerda', '2. Vertical reto descendo do meio'], exampleWord: 'インターネット', examplePt: 'internet' },
  { char: 'ウ', reading: 'u', meaningPt: 'Katakana U', strokes: 3, strokeHints: ['1. Vertical curto no topo', '2. Vertical curto à esquerda', '3. Horizontal que dobra para baixo'], exampleWord: 'ウイルス', examplePt: 'vírus' },
  { char: 'エ', reading: 'e', meaningPt: 'Katakana E', strokes: 3, strokeHints: ['1. Horizontal superior', '2. Vertical central', '3. Horizontal inferior maior'], exampleWord: '駅 / エレベーター', examplePt: 'elevador' },
  { char: 'オ', reading: 'o', meaningPt: 'Katakana O', strokes: 3, strokeHints: ['1. Horizontal', '2. Vertical com gancho', '3. Diagonal curta à esquerda'], exampleWord: 'オフィス', examplePt: 'escritório' },
  { char: 'カ', reading: 'ka', meaningPt: 'Katakana KA', strokes: 2, strokeHints: ['1. Horizontal dobrando para baixo com gancho', '2. Diagonal cruzando'], exampleWord: 'カフェ (kafe)', examplePt: 'café' },
  { char: 'キ', reading: 'ki', meaningPt: 'Katakana KI', strokes: 3, strokeHints: ['1. Horizontal curto', '2. Horizontal mais longo', '3. Diagonal cruzando os dois'], exampleWord: 'チケット', examplePt: 'ingresso / ticket' },
  { char: 'サ', reading: 'sa', meaningPt: 'Katakana SA', strokes: 3, strokeHints: ['1. Horizontal', '2. Vertical curto esquerdo', '3. Vertical direito curvado à esquerda'], exampleWord: 'サラダ (sarada)', examplePt: 'salada' },
  { char: 'シ', reading: 'shi', meaningPt: 'Katakana SHI', strokes: 3, strokeHints: ['1-2. Dois pontos horizontais à esquerda', '3. Traço longo subindo de baixo para cima à direita'], exampleWord: 'タクシー (takushī)', examplePt: 'táxi' },
  { char: 'ス', reading: 'su', meaningPt: 'Katakana SU', strokes: 2, strokeHints: ['1. Horizontal dobrando em diagonal à esquerda', '2. Traço curto saindo para a direita'], exampleWord: 'スマホ (sumaho)', examplePt: 'smartphone' },
  { char: 'タ', reading: 'ta', meaningPt: 'Katakana TA', strokes: 3, strokeHints: ['1. Diagonal esquerda', '2. Horizontal dobrando em curva', '3. Traço curto interno'], exampleWord: 'ホテル (hoteru)', examplePt: 'hotel' },
  { char: 'ツ', reading: 'tsu', meaningPt: 'Katakana TSU', strokes: 3, strokeHints: ['1-2. Dois pontos verticais no topo', '3. Traço descendo da direita para baixo-esquerda'], exampleWord: 'シャツ (shatsu)', examplePt: 'camisa' },
  { char: 'ト', reading: 'to', meaningPt: 'Katakana TO', strokes: 2, strokeHints: ['1. Vertical reto', '2. Traço curto saindo para baixo-direita'], exampleWord: 'トイレ (toire)', examplePt: 'banheiro' },
  { char: 'パ', reading: 'pa', meaningPt: 'Katakana PA', strokes: 3, strokeHints: ['1. Diagonal esquerda', '2. Diagonal direita', '3. Círculo pequeno (handakuten) no canto'], exampleWord: 'パン (pan)', examplePt: 'pão' },
  { char: 'メ', reading: 'me', meaningPt: 'Katakana ME', strokes: 2, strokeHints: ['1. Curva longa para a esquerda', '2. Traço curto cruzando no meio'], exampleWord: 'メニュー (menyū)', examplePt: 'cardápio' },
];

export const JAPANESE_KANJI: ScriptCharacterItem[] = [
  { char: '日', reading: 'nichi / hi', meaningPt: 'Sol / Dia', strokes: 4, strokeHints: ['1. Vertical esquerdo', '2. Topo + lado direito', '3. Barra central', '4. Fecha base'], exampleWord: '日本 (Nihon)', examplePt: 'Japão' },
  { char: '本', reading: 'hon / moto', meaningPt: 'Livro / Origem', strokes: 5, strokeHints: ['1. Horizontal', '2. Vertical central', '3. Diagonal esquerda', '4. Diagonal direita', '5. Barra curta na base'], exampleWord: '本 (hon)', examplePt: 'livro' },
  { char: '人', reading: 'hito / jin', meaningPt: 'Pessoa', strokes: 2, strokeHints: ['1. Diagonal longa para a esquerda', '2. Diagonal partindo do meio para a direita'], exampleWord: '日本人', examplePt: 'pessoa japonesa' },
  { char: '水', reading: 'mizu / sui', meaningPt: 'Água', strokes: 4, strokeHints: ['1. Vertical central com gancho', '2. Asa esquerda', '3. Diagonal superior direita', '4. Perna direita'], exampleWord: '水 (mizu)', examplePt: 'água' },
  { char: '火', reading: 'hi / ka', meaningPt: 'Fogo', strokes: 4, strokeHints: ['1. Ponto esquerdo', '2. Ponto direito', '3. Curva central à esquerda', '4. Perna à direita'], exampleWord: '火曜日 (kayōbi)', examplePt: 'terça-feira' },
  { char: '山', reading: 'yama / san', meaningPt: 'Montanha', strokes: 3, strokeHints: ['1. Pico central vertical', '2. Lado esquerdo + base', '3. Lado direito'], exampleWord: '富士山 (Fujisan)', examplePt: 'Monte Fuji' },
  { char: '川', reading: 'kawa / sen', meaningPt: 'Rio', strokes: 3, strokeHints: ['1. Curva esquerda', '2. Linha central curta', '3. Linha direita longa'], exampleWord: '川 (kawa)', examplePt: 'rio' },
  { char: '大', reading: 'ōkii / dai', meaningPt: 'Grande', strokes: 3, strokeHints: ['1. Horizontal', '2. Curva vertical à esquerda', '3. Diagonal para a direita'], exampleWord: '大学 (daigaku)', examplePt: 'universidade' },
  { char: '小', reading: 'chiisai / shō', meaningPt: 'Pequeno', strokes: 3, strokeHints: ['1. Vertical central com gancho', '2. Ponto esquerdo', '3. Ponto direito'], exampleWord: '小さい (chiisai)', examplePt: 'pequeno' },
  { char: '食', reading: 'taberu / shoku', meaningPt: 'Comer / Alimento', strokes: 9, strokeHints: ['1-2. Telhado superior', '3. Traço curto', '4-7. Caixa central', '8-9. Pernas da base'], exampleWord: '食べる (taberu)', examplePt: 'comer' },
  { char: '飲', reading: 'nomu / in', meaningPt: 'Beber', strokes: 12, strokeHints: ['Esquerda: radical de comida (食)', 'Direita: radical de bocejo/beber (欠)'], exampleWord: '飲む (nomu)', examplePt: 'beber' },
  { char: '駅', reading: 'eki', meaningPt: 'Estação de trem', strokes: 14, strokeHints: ['Esquerda: cavalo (馬)', 'Direita: escala/medida (尺)'], exampleWord: '東京駅', examplePt: 'Estação de Tóquio' },
];

export const CHINESE_HANZI: ScriptCharacterItem[] = [
  { char: '人', reading: 'rén', meaningPt: 'Pessoa', strokes: 2, strokeHints: ['1. Pie (diagonal esquerda)', '2. Na (diagonal direita)'], exampleWord: '人们 (rénmen)', examplePt: 'pessoas' },
  { char: '大', reading: 'dà', meaningPt: 'Grande', strokes: 3, strokeHints: ['1. Horizontal (héng)', '2. Pie descendo pelo centro', '3. Na abrindo à direita'], exampleWord: '大家 (dàjiā)', examplePt: 'todos / pessoal' },
  { char: '水', reading: 'shuǐ', meaningPt: 'Água', strokes: 4, strokeHints: ['1. Gancho vertical central', '2. Asa esquerda', '3. Curva curta direita', '4. Perna direita'], exampleWord: '喝水 (hē shuǐ)', examplePt: 'beber água' },
  { char: '火', reading: 'huǒ', meaningPt: 'Fogo', strokes: 4, strokeHints: ['1. Ponto esquerdo', '2. Ponto direito', '3. Pie central', '4. Na direito'], exampleWord: '火车 (huǒchē)', examplePt: 'trem' },
  { char: '山', reading: 'shān', meaningPt: 'Montanha', strokes: 3, strokeHints: ['1. Vertical central', '2. Vertical esquerdo + base', '3. Vertical direito'], exampleWord: '爬山 (pá shān)', examplePt: 'subir montanha' },
  { char: '口', reading: 'kǒu', meaningPt: 'Boca / Entrada', strokes: 3, strokeHints: ['1. Vertical esquerdo', '2. Topo + vertical direito', '3. Fecha base da esquerda para direita'], exampleWord: '出口 (chūkǒu)', examplePt: 'saída' },
  { char: '中', reading: 'zhōng', meaningPt: 'Centro / China', strokes: 4, strokeHints: ['1-3. Desenhe a caixa 口 primeiro', '4. Corte com o vertical central por último'], exampleWord: '中文 (Zhōngwén)', examplePt: 'idioma chinês' },
  { char: '国', reading: 'guó', meaningPt: 'País / Nação', strokes: 8, strokeHints: ['1-2. Moldura externa (sem fechar)', '3-7. Conteúdo interno 玉 (jade)', '8. Fecha a base externa por último'], exampleWord: '中国 (Zhōngguó)', examplePt: 'China' },
  { char: '好', reading: 'hǎo', meaningPt: 'Bom / Bem', strokes: 6, strokeHints: ['Esquerda (3 traços): mulher 女', 'Direita (3 traços): criança 子'], exampleWord: '你好 (nǐ hǎo)', examplePt: 'olá' },
  { char: '谢', reading: 'xiè', meaningPt: 'Agradecer', strokes: 12, strokeHints: ['Esquerda: palavra 讠', 'Meio: corpo 身', 'Direita: medida 寸'], exampleWord: '谢谢 (xièxie)', examplePt: 'obrigado(a)' },
  { char: '吃', reading: 'chī', meaningPt: 'Comer', strokes: 6, strokeHints: ['Esquerda: boca 口', 'Direita: pedir 乞'], exampleWord: '吃饭 (chīfàn)', examplePt: 'fazer refeição' },
  { char: '茶', reading: 'chá', meaningPt: 'Chá', strokes: 9, strokeHints: ['Topo: radical de erva 艹', 'Meio: teto 人', 'Base: madeira 木'], exampleWord: '绿茶 (lǜchá)', examplePt: 'chá verde' },
];

export const MANDARIN_TONES: MandarinToneGuide[] = [
  { tone: 1, namePt: '1º Tom · Alto e Plano (55)', contour: '───', descriptionPt: 'Mantenha a voz aguda e estável, sem subir nem cair.', exampleHanzi: '妈', examplePinyin: 'mā', examplePt: 'mãe' },
  { tone: 2, namePt: '2º Tom · Ascendente (35)', contour: '╱', descriptionPt: 'Suba o tom como se estivesse fazendo uma pergunta surpresa ("Quê?").', exampleHanzi: '麻', examplePinyin: 'má', examplePt: 'linho / dormência' },
  { tone: 3, namePt: '3º Tom · Descendente-Ascendente (214)', contour: '╲╱', descriptionPt: 'Desça bem grave no fundo da garganta e suba suavemente no final.', exampleHanzi: '马', examplePinyin: 'mǎ', examplePt: 'cavalo' },
  { tone: 4, namePt: '4º Tom · Descendente Firme (51)', contour: '╲', descriptionPt: 'Corte seco de cima para baixo, como uma ordem firme ("Não!").', exampleHanzi: '骂', examplePinyin: 'mà', examplePt: 'repreender' },
];

export const RUSSIAN_CYRILLIC: ScriptCharacterItem[] = [
  { char: 'А а', reading: 'a', meaningPt: 'Vogal A (como "a" em casa)', strokes: 3, strokeHints: ['Imprensa: A igual ao latim', 'Cursivo: semelhante ao "a" manuscrito'], exampleWord: 'автобус', examplePt: 'ônibus' },
  { char: 'Б б', reading: 'b', meaningPt: 'Consoante B', strokes: 3, strokeHints: ['Teto horizontal + barriga arredondada', 'NÃO confunda com В (som de V)!'], exampleWord: 'банк', examplePt: 'banco' },
  { char: 'В в', reading: 'v', meaningPt: 'Falso amigo visual! Som de V (não B!)', strokes: 3, strokeHints: ['Parece B do português, mas soa sempre como V'], exampleWord: 'вода (vodá)', examplePt: 'água', cursiveNote: 'Falso amigo visual: В = V' },
  { char: 'Г г', reading: 'g', meaningPt: 'Som de G duro (gato)', strokes: 2, strokeHints: ['Ângulo reto superior + perna vertical'], exampleWord: 'город', examplePt: 'cidade' },
  { char: 'Д д', reading: 'd', meaningPt: 'Som de D', strokes: 4, strokeHints: ['Telhado com duas perninhas saindo na base'], exampleWord: 'дом', examplePt: 'casa' },
  { char: 'Ж ж', reading: 'zh (j)', meaningPt: 'Som de J em "janela"', strokes: 3, strokeHints: ['Vertical central + dois K espelhados nas laterais'], exampleWord: 'жизнь', examplePt: 'vida' },
  { char: 'З з', reading: 'z', meaningPt: 'Som de Z (zebra)', strokes: 1, strokeHints: ['Parece o número 3; cursivo desce com laço'], exampleWord: 'завтрак', examplePt: 'café da manhã' },
  { char: 'И и', reading: 'i', meaningPt: 'Vogal I', strokes: 3, strokeHints: ['Vertical esquerdo + diagonal subindo para direita + vertical direito'], exampleWord: 'имя', examplePt: 'nome' },
  { char: 'Н н', reading: 'n', meaningPt: 'Falso amigo visual! Som de N (não H!)', strokes: 3, strokeHints: ['Igual ao H maiúsculo latino, mas tem som de N'], exampleWord: 'нет (nyet)', examplePt: 'não', cursiveNote: 'Falso amigo visual: Н = N' },
  { char: 'П п', reading: 'p', meaningPt: 'Som de P (pai)', strokes: 3, strokeHints: ['Formato de portal / arco quadrado'], exampleWord: 'привет', examplePt: 'oi / olá' },
  { char: 'Р р', reading: 'r', meaningPt: 'Falso amigo visual! Som de R vibrante (não P!)', strokes: 2, strokeHints: ['Parece P latino, mas soa como R vibrante'], exampleWord: 'работа', examplePt: 'trabalho', cursiveNote: 'Falso amigo visual: Р = R' },
  { char: 'С с', reading: 's', meaningPt: 'Falso amigo visual! Som de S (não K!)', strokes: 1, strokeHints: ['Sempre som de S ("sopa"), nunca som de K'], exampleWord: 'спасибо', examplePt: 'obrigado', cursiveNote: 'Falso amigo visual: С = S' },
  { char: 'У у', reading: 'u', meaningPt: 'Falso amigo visual! Som de U (não Y!)', strokes: 2, strokeHints: ['Parece Y latino, mas soa sempre como U'], exampleWord: 'утро', examplePt: 'manhã', cursiveNote: 'Falso amigo visual: У = U' },
  { char: 'Ф ф', reading: 'f', meaningPt: 'Som de F', strokes: 2, strokeHints: ['Círculo atravessado por linha vertical'], exampleWord: 'фото', examplePt: 'foto' },
  { char: 'Х х', reading: 'kh', meaningPt: 'Falso amigo visual! Som de RR forte (não X!)', strokes: 2, strokeHints: ['Som raspado na garganta como "carro" ou J espanhol'], exampleWord: 'хорошо', examplePt: 'bom / tudo bem', cursiveNote: 'Falso amigo visual: Х = RR/KH' },
  { char: 'Ч ч', reading: 'tch', meaningPt: 'Som de TCH ("tchau")', strokes: 2, strokeHints: ['Curva em U superior + haste vertical direita'], exampleWord: 'чай', examplePt: 'chá' },
  { char: 'Ш ш', reading: 'sh', meaningPt: 'Som de X ("xícara") duro', strokes: 4, strokeHints: ['Três hastes verticais ligadas na base'], exampleWord: 'школа', examplePt: 'escola' },
  { char: 'Ы ы', reading: 'y gutural', meaningPt: 'Vogal posterior Ы', strokes: 3, strokeHints: ['Sinal brando Ь + haste I'], exampleWord: 'сыр', examplePt: 'queijo' },
  { char: 'Я я', reading: 'ya', meaningPt: 'Som de IA ("iá")', strokes: 3, strokeHints: ['R espelhado — significa também "Eu"!'], exampleWord: 'яблоко', examplePt: 'maçã' },
];

export function extractScriptCharsFromWord(
  word: string,
  languageCode: 'ja' | 'zh' | 'ru',
): ScriptCharacterItem[] {
  const bank =
    languageCode === 'ja'
      ? [...JAPANESE_HIRAGANA, ...JAPANESE_KATAKANA, ...JAPANESE_KANJI]
      : languageCode === 'zh'
        ? CHINESE_HANZI
        : RUSSIAN_CYRILLIC;

  const found: ScriptCharacterItem[] = [];
  for (const ch of Array.from(word)) {
    const item = bank.find(
      (b) => b.char === ch || b.char.startsWith(ch) || b.char.includes(ch.toUpperCase()),
    );
    if (item && !found.some((f) => f.char === item.char)) {
      found.push(item);
    }
    if (found.length >= 4) break;
  }
  return found;
}

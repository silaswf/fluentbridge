export interface ScriptCharacterItem {
  char: string;
  reading: string;
  meaningPt: string;
  strokes: number;
  strokeHints: string[];
  exampleWord: string;
  examplePt: string;
  cursiveNote?: string;
  direction?: 'ltr' | 'rtl';
  forms?: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
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
  // Vowels (5)
  { char: 'あ', reading: 'a', meaningPt: 'Vogal A', strokes: 3, strokeHints: ['1. Horizontal curto no topo', '2. Vertical curvado descendo pelo centro', '3. Laço amplo para baixo e esquerda'], exampleWord: 'あさ (asa)', examplePt: 'manhã' },
  { char: 'い', reading: 'i', meaningPt: 'Vogal I', strokes: 2, strokeHints: ['1. Curva descendente esquerda com gancho', '2. Traço menor à direita'], exampleWord: 'いえ (ie)', examplePt: 'casa' },
  { char: 'う', reading: 'u', meaningPt: 'Vogal U', strokes: 2, strokeHints: ['1. Pequeno traço no topo', '2. Grande curva semicircular para baixo'], exampleWord: 'うみ (umi)', examplePt: 'mar' },
  { char: 'え', reading: 'e', meaningPt: 'Vogal E', strokes: 2, strokeHints: ['1. Traço superior inclinado', '2. Zigue-zague fluido para a direita'], exampleWord: 'えき (eki)', examplePt: 'estação' },
  { char: 'お', reading: 'o', meaningPt: 'Vogal O', strokes: 3, strokeHints: ['1. Horizontal curto', '2. Vertical com laço amplo', '3. Ponto no canto superior direito'], exampleWord: 'おちゃ (ocha)', examplePt: 'chá' },
  // K-row (5)
  { char: 'か', reading: 'ka', meaningPt: 'Sílaba KA', strokes: 3, strokeHints: ['1. Horizontal dobrando com gancho', '2. Diagonal cruzando', '3. Ponto à direita'], exampleWord: 'かさ (kasa)', examplePt: 'guarda-chuva' },
  { char: 'き', reading: 'ki', meaningPt: 'Sílaba KI', strokes: 4, strokeHints: ['1-2. Dois horizontais', '3. Diagonal central', '4. Base curvada'], exampleWord: 'きっぷ (kippu)', examplePt: 'bilhete' },
  { char: 'く', reading: 'ku', meaningPt: 'Sílaba KU', strokes: 1, strokeHints: ['1. Traço único em formato de bico (<)'], exampleWord: 'くつ (kutsu)', examplePt: 'sapato' },
  { char: 'け', reading: 'ke', meaningPt: 'Sílaba KE', strokes: 3, strokeHints: ['1. Vertical esquerdo com gancho', '2. Horizontal curto', '3. Vertical curvando à esquerda'], exampleWord: 'けさ (kesa)', examplePt: 'esta manhã' },
  { char: 'こ', reading: 'ko', meaningPt: 'Sílaba KO', strokes: 2, strokeHints: ['1. Curva superior horizontal', '2. Curva inferior aberta'], exampleWord: 'ここ (koko)', examplePt: 'aqui' },
  // S-row (5)
  { char: 'さ', reading: 'sa', meaningPt: 'Sílaba SA', strokes: 3, strokeHints: ['1. Horizontal curto', '2. Diagonal cruzando', '3. Base curvada'], exampleWord: 'さくら (sakura)', examplePt: 'cerejeira' },
  { char: 'し', reading: 'shi', meaningPt: 'Sílaba SHI', strokes: 1, strokeHints: ['1. Traço único descendo reto e curvando suave'], exampleWord: 'しごと (shigoto)', examplePt: 'trabalho' },
  { char: 'す', reading: 'su', meaningPt: 'Sílaba SU', strokes: 2, strokeHints: ['1. Horizontal longo', '2. Vertical com laço no meio'], exampleWord: 'すし (sushi)', examplePt: 'sushi' },
  { char: 'せ', reading: 'se', meaningPt: 'Sílaba SE', strokes: 3, strokeHints: ['1. Horizontal longo', '2. Vertical direito com gancho', '3. Vertical esquerdo dobrando em L'], exampleWord: 'せかい (sekai)', examplePt: 'mundo' },
  { char: 'そ', reading: 'so', meaningPt: 'Sílaba SO', strokes: 1, strokeHints: ['1. Traço contínuo em Z superior seguido de curva C'], exampleWord: 'そら (sora)', examplePt: 'céu' },
  // T-row (5)
  { char: 'た', reading: 'ta', meaningPt: 'Sílaba TA', strokes: 4, strokeHints: ['1. Horizontal', '2. Diagonal esquerda', '3-4. Duas curvas à direita'], exampleWord: 'たべる (taberu)', examplePt: 'comer' },
  { char: 'ち', reading: 'chi', meaningPt: 'Sílaba CHI', strokes: 2, strokeHints: ['1. Horizontal superior', '2. Vertical curvando em barriga ampla'], exampleWord: 'ちず (chizu)', examplePt: 'mapa' },
  { char: 'つ', reading: 'tsu', meaningPt: 'Sílaba TSU', strokes: 1, strokeHints: ['1. Arco único da esquerda para a direita'], exampleWord: 'つくえ (tsukue)', examplePt: 'mesa' },
  { char: 'て', reading: 'te', meaningPt: 'Sílaba TE', strokes: 1, strokeHints: ['1. Horizontal curto que dobra em C amplo'], exampleWord: 'てがみ (tegami)', examplePt: 'carta' },
  { char: 'と', reading: 'to', meaningPt: 'Sílaba TO', strokes: 2, strokeHints: ['1. Pequeno traço inclinado', '2. Curva em C para a direita'], exampleWord: 'とけい (tokei)', examplePt: 'relógio' },
  // N-row (5)
  { char: 'な', reading: 'na', meaningPt: 'Sílaba NA', strokes: 4, strokeHints: ['1. Horizontal', '2. Diagonal', '3. Ponto à direita', '4. Vertical com laço'], exampleWord: 'なまえ (namae)', examplePt: 'nome' },
  { char: 'に', reading: 'ni', meaningPt: 'Sílaba NI', strokes: 3, strokeHints: ['1. Vertical esquerdo', '2. Horizontal superior', '3. Horizontal inferior'], exampleWord: 'にほん (nihon)', examplePt: 'Japão' },
  { char: 'ぬ', reading: 'nu', meaningPt: 'Sílaba NU', strokes: 2, strokeHints: ['1. Curva inclinada descendo', '2. Grande laço cruzado terminando em loop'], exampleWord: 'いぬ (inu)', examplePt: 'cachorro' },
  { char: 'ね', reading: 'ne', meaningPt: 'Sílaba NE', strokes: 2, strokeHints: ['1. Vertical esquerdo', '2. Zigue-zague que sobe e termina em laço'], exampleWord: 'ねこ (neko)', examplePt: 'gato' },
  { char: 'の', reading: 'no', meaningPt: 'Partícula NO', strokes: 1, strokeHints: ['1. Espiral contínua fechando por cima'], exampleWord: 'のみもの', examplePt: 'bebida' },
  // H-row (5)
  { char: 'は', reading: 'ha/wa', meaningPt: 'Sílaba HA (partícula WA)', strokes: 3, strokeHints: ['1. Vertical esquerdo', '2. Horizontal direito', '3. Vertical com laço'], exampleWord: 'はな (hana)', examplePt: 'flor' },
  { char: 'ひ', reading: 'hi', meaningPt: 'Sílaba HI', strokes: 1, strokeHints: ['1. Arco em U amplo que sobe e desce à direita'], exampleWord: 'ひと (hito)', examplePt: 'pessoa' },
  { char: 'ふ', reading: 'fu', meaningPt: 'Sílaba FU', strokes: 4, strokeHints: ['1. Ponto no topo', '2. Curva central', '3-4. Dois traços laterais'], exampleWord: 'ふゆ (fuyu)', examplePt: 'inverno' },
  { char: 'へ', reading: 'he/e', meaningPt: 'Sílaba HE', strokes: 1, strokeHints: ['1. Traço único em formato de montanha suave (^)'], exampleWord: 'へや (heya)', examplePt: 'quarto' },
  { char: 'ほ', reading: 'ho', meaningPt: 'Sílaba HO', strokes: 4, strokeHints: ['1. Vertical esquerdo', '2-3. Dois horizontais', '4. Vertical direito com laço'], exampleWord: 'ほし (hoshi)', examplePt: 'estrela' },
  // M-row (5)
  { char: 'ま', reading: 'ma', meaningPt: 'Sílaba MA', strokes: 3, strokeHints: ['1-2. Dois horizontais', '3. Vertical com laço na base'], exampleWord: 'まち (machi)', examplePt: 'cidade' },
  { char: 'み', reading: 'mi', meaningPt: 'Sílaba MI', strokes: 2, strokeHints: ['1. Horizontal com diagonal e laço', '2. Diagonal cortando à direita'], exampleWord: 'みず (mizu)', examplePt: 'água' },
  { char: 'む', reading: 'mu', meaningPt: 'Sílaba MU', strokes: 3, strokeHints: ['1. Horizontal', '2. Vertical com laço e saída larga', '3. Ponto à direita'], exampleWord: 'むし (mushi)', examplePt: 'inseto' },
  { char: 'め', reading: 'me', meaningPt: 'Sílaba ME', strokes: 2, strokeHints: ['1. Curva inclinada', '2. Grande laço cruzado sem loop extra'], exampleWord: 'めがね (megane)', examplePt: 'óculos' },
  { char: 'も', reading: 'mo', meaningPt: 'Sílaba MO', strokes: 3, strokeHints: ['1. Gancho vertical em J', '2-3. Dois horizontais cruzando'], exampleWord: 'もり (mori)', examplePt: 'floresta' },
  // Y-row (3)
  { char: 'や', reading: 'ya', meaningPt: 'Sílaba YA', strokes: 3, strokeHints: ['1. Arco amplo para direita', '2. Ponto no topo', '3. Diagonal longa'], exampleWord: 'やま (yama)', examplePt: 'montanha' },
  { char: 'ゆ', reading: 'yu', meaningPt: 'Sílaba YU', strokes: 2, strokeHints: ['1. Vertical dobrando em laço redondo', '2. Vertical cortando pelo centro'], exampleWord: 'ゆき (yuki)', examplePt: 'neve' },
  { char: 'よ', reading: 'yo', meaningPt: 'Sílaba YO', strokes: 2, strokeHints: ['1. Horizontal curto à direita', '2. Vertical descendo com laço na base'], exampleWord: 'よる (yoru)', examplePt: 'noite' },
  // R-row (5)
  { char: 'ら', reading: 'ra', meaningPt: 'Sílaba RA', strokes: 2, strokeHints: ['1. Ponto superior', '2. Curva descendo e abrindo em barriga'], exampleWord: 'らいねん', examplePt: 'ano que vem' },
  { char: 'り', reading: 'ri', meaningPt: 'Sílaba RI', strokes: 2, strokeHints: ['1. Vertical esquerdo com gancho', '2. Vertical direito mais longo'], exampleWord: 'りんご (ringo)', examplePt: 'maçã' },
  { char: 'る', reading: 'ru', meaningPt: 'Sílaba RU', strokes: 1, strokeHints: ['1. Zigue-zague que termina com pequeno loop fechado'], exampleWord: 'くるま (kuruma)', examplePt: 'carro' },
  { char: 'れ', reading: 're', meaningPt: 'Sílaba RE', strokes: 2, strokeHints: ['1. Vertical esquerdo', '2. Zigue-zague subindo e descendo à direita'], exampleWord: 'れきし', examplePt: 'história' },
  { char: 'ろ', reading: 'ro', meaningPt: 'Sílaba RO', strokes: 1, strokeHints: ['1. Igual ao る, porém termina aberto sem loop'], exampleWord: 'しろ (shiro)', examplePt: 'branco' },
  // W-row + N (3)
  { char: 'わ', reading: 'wa', meaningPt: 'Sílaba WA', strokes: 2, strokeHints: ['1. Vertical esquerdo', '2. Zigue-zague com barriga ampla à direita'], exampleWord: 'わたし (watashi)', examplePt: 'eu' },
  { char: 'を', reading: 'o/wo', meaningPt: 'Partícula de Objeto を', strokes: 3, strokeHints: ['1. Horizontal curto', '2. Curva em h', '3. Arco em C cruzando abaixo'], exampleWord: '水を飲む', examplePt: 'beber água' },
  { char: 'ん', reading: 'n', meaningPt: 'Consoante nasal N', strokes: 1, strokeHints: ['1. Traço único descendo, subindo pelo meio e saindo à direita'], exampleWord: 'ほん (hon)', examplePt: 'livro' },
];

export const JAPANESE_KATAKANA: ScriptCharacterItem[] = [
  // Vowels (5)
  { char: 'ア', reading: 'a', meaningPt: 'Katakana A', strokes: 2, strokeHints: ['1. Horizontal dobrando em diagonal', '2. Curva descendo à esquerda'], exampleWord: 'アプリ', examplePt: 'aplicativo' },
  { char: 'イ', reading: 'i', meaningPt: 'Katakana I', strokes: 2, strokeHints: ['1. Diagonal longa à esquerda', '2. Vertical reto do meio'], exampleWord: 'イタリア', examplePt: 'Itália' },
  { char: 'ウ', reading: 'u', meaningPt: 'Katakana U', strokes: 3, strokeHints: ['1. Vertical topo', '2. Vertical esquerdo', '3. Horizontal dobrando em curva'], exampleWord: 'ウェブサイト', examplePt: 'website' },
  { char: 'エ', reading: 'e', meaningPt: 'Katakana E', strokes: 3, strokeHints: ['1. Horizontal superior', '2. Vertical central', '3. Horizontal inferior maior'], exampleWord: 'エレベーター', examplePt: 'elevador' },
  { char: 'オ', reading: 'o', meaningPt: 'Katakana O', strokes: 3, strokeHints: ['1. Horizontal', '2. Vertical com gancho', '3. Diagonal curta à esquerda'], exampleWord: 'オフィス', examplePt: 'escritório' },
  // K-row (5)
  { char: 'カ', reading: 'ka', meaningPt: 'Katakana KA', strokes: 2, strokeHints: ['1. Horizontal dobrando com gancho', '2. Diagonal cruzando'], exampleWord: 'カフェ', examplePt: 'café' },
  { char: 'キ', reading: 'ki', meaningPt: 'Katakana KI', strokes: 3, strokeHints: ['1. Horizontal curto', '2. Horizontal longo', '3. Diagonal cruzando'], exampleWord: 'キッチン', examplePt: 'cozinha' },
  { char: 'ク', reading: 'ku', meaningPt: 'Katakana KU', strokes: 2, strokeHints: ['1. Diagonal curta', '2. Horizontal dobrando em arco longo'], exampleWord: 'クラス', examplePt: 'aula/turma' },
  { char: 'ケ', reading: 'ke', meaningPt: 'Katakana KE', strokes: 3, strokeHints: ['1. Diagonal esquerda', '2. Horizontal longo', '3. Curva descendo do meio'], exampleWord: 'ケーキ', examplePt: 'bolo' },
  { char: 'コ', reading: 'ko', meaningPt: 'Katakana KO', strokes: 2, strokeHints: ['1. Horizontal dobrando para baixo', '2. Horizontal fechando a base'], exampleWord: 'コーヒー', examplePt: 'café' },
  // S-row (5)
  { char: 'サ', reading: 'sa', meaningPt: 'Katakana SA', strokes: 3, strokeHints: ['1. Horizontal', '2. Vertical esquerdo', '3. Vertical direito curvado'], exampleWord: 'サラダ', examplePt: 'salada' },
  { char: 'シ', reading: 'shi', meaningPt: 'Katakana SHI', strokes: 3, strokeHints: ['1-2. Dois pontos horizontais', '3. Traço subindo de baixo para cima'], exampleWord: 'タクシー', examplePt: 'táxi' },
  { char: 'ス', reading: 'su', meaningPt: 'Katakana SU', strokes: 2, strokeHints: ['1. Horizontal dobrando à esquerda', '2. Traço curto à direita'], exampleWord: 'スマホ', examplePt: 'smartphone' },
  { char: 'セ', reading: 'se', meaningPt: 'Katakana SE', strokes: 2, strokeHints: ['1. Horizontal dobrando para baixo-esquerda', '2. Vertical dobrando em L'], exampleWord: 'セーター', examplePt: 'suéter' },
  { char: 'ソ', reading: 'so', meaningPt: 'Katakana SO', strokes: 2, strokeHints: ['1. Ponto vertical inclinado', '2. Traço descendo da direita para baixo-esquerda'], exampleWord: 'ソファ', examplePt: 'sofá' },
  // T-row (5)
  { char: 'タ', reading: 'ta', meaningPt: 'Katakana TA', strokes: 3, strokeHints: ['1. Diagonal esquerda', '2. Horizontal dobrando em curva', '3. Traço curto interno'], exampleWord: 'タオル', examplePt: 'toalha' },
  { char: 'チ', reading: 'chi', meaningPt: 'Katakana CHI', strokes: 3, strokeHints: ['1. Pequena curva topo', '2. Horizontal', '3. Vertical curvando à esquerda'], exampleWord: 'チケット', examplePt: 'ingresso' },
  { char: 'ツ', reading: 'tsu', meaningPt: 'Katakana TSU', strokes: 3, strokeHints: ['1-2. Dois pontos verticais no topo', '3. Traço descendo da direita'], exampleWord: 'シャツ', examplePt: 'camisa' },
  { char: 'テ', reading: 'te', meaningPt: 'Katakana TE', strokes: 3, strokeHints: ['1. Horizontal curto', '2. Horizontal longo', '3. Curva vertical do meio'], exampleWord: 'テスト', examplePt: 'teste' },
  { char: 'ト', reading: 'to', meaningPt: 'Katakana TO', strokes: 2, strokeHints: ['1. Vertical reto', '2. Traço curto para baixo-direita'], exampleWord: 'トイレ', examplePt: 'banheiro' },
  // N-row (5)
  { char: 'ナ', reading: 'na', meaningPt: 'Katakana NA', strokes: 2, strokeHints: ['1. Horizontal', '2. Curva vertical cruzando para a esquerda'], exampleWord: 'ナイフ', examplePt: 'faca' },
  { char: 'ニ', reading: 'ni', meaningPt: 'Katakana NI', strokes: 2, strokeHints: ['1. Horizontal superior curto', '2. Horizontal inferior longo'], exampleWord: 'ニュース', examplePt: 'notícias' },
  { char: 'ヌ', reading: 'nu', meaningPt: 'Katakana NU', strokes: 2, strokeHints: ['1. Horizontal dobrando em curva esquerda', '2. Traço curto cruzando'], exampleWord: 'カヌー', examplePt: 'canoa' },
  { char: 'ネ', reading: 'ne', meaningPt: 'Katakana NE', strokes: 4, strokeHints: ['1. Ponto topo', '2. Horizontal dobrando esquerda', '3. Vertical', '4. Traço direito'], exampleWord: 'ネクタイ', examplePt: 'gravata' },
  { char: 'ノ', reading: 'no', meaningPt: 'Katakana NO', strokes: 1, strokeHints: ['1. Diagonal única curvada para a esquerda'], exampleWord: 'ノート', examplePt: 'caderno' },
  // H-row (5)
  { char: 'ハ', reading: 'ha', meaningPt: 'Katakana HA', strokes: 2, strokeHints: ['1. Diagonal esquerda', '2. Diagonal direita'], exampleWord: 'ハンバーガー', examplePt: 'hambúrguer' },
  { char: 'ヒ', reading: 'hi', meaningPt: 'Katakana HI', strokes: 2, strokeHints: ['1. Horizontal curto', '2. Vertical dobrando em L'], exampleWord: 'ヒント', examplePt: 'dica' },
  { char: 'フ', reading: 'fu', meaningPt: 'Katakana FU', strokes: 1, strokeHints: ['1. Horizontal dobrando em curva para baixo-esquerda'], exampleWord: 'フォーク', examplePt: 'garfo' },
  { char: 'ヘ', reading: 'he', meaningPt: 'Katakana HE', strokes: 1, strokeHints: ['1. Traço único em ângulo (^)'], exampleWord: 'ヘルメット', examplePt: 'capacete' },
  { char: 'ホ', reading: 'ho', meaningPt: 'Katakana HO', strokes: 4, strokeHints: ['1. Horizontal', '2. Vertical com gancho', '3. Ponto esquerdo', '4. Ponto direito'], exampleWord: 'ホテル', examplePt: 'hotel' },
  // M-row (5)
  { char: 'マ', reading: 'ma', meaningPt: 'Katakana MA', strokes: 2, strokeHints: ['1. Horizontal dobrando em diagonal esquerda', '2. Ponto curto na base'], exampleWord: 'マップ', examplePt: 'mapa' },
  { char: 'ミ', reading: 'mi', meaningPt: 'Katakana MI', strokes: 3, strokeHints: ['1-3. Três traços paralelos inclinados para baixo-direita'], exampleWord: 'ミルク', examplePt: 'leite' },
  { char: 'ム', reading: 'mu', meaningPt: 'Katakana MU', strokes: 2, strokeHints: ['1. Diagonal dobrando em horizontal', '2. Traço curto fechando à direita'], exampleWord: 'チーム', examplePt: 'equipe' },
  { char: 'メ', reading: 'me', meaningPt: 'Katakana ME', strokes: 2, strokeHints: ['1. Curva longa para a esquerda', '2. Traço curto cruzando'], exampleWord: 'メニュー', examplePt: 'cardápio' },
  { char: 'モ', reading: 'mo', meaningPt: 'Katakana MO', strokes: 3, strokeHints: ['1. Horizontal superior', '2. Horizontal inferior', '3. Vertical dobrando em L'], exampleWord: 'メモ', examplePt: 'anotação' },
  // Y-row (3)
  { char: 'ヤ', reading: 'ya', meaningPt: 'Katakana YA', strokes: 2, strokeHints: ['1. Horizontal dobrando à esquerda', '2. Vertical longo cruzando'], exampleWord: 'タイヤ', examplePt: 'pneu' },
  { char: 'ユ', reading: 'yu', meaningPt: 'Katakana YU', strokes: 2, strokeHints: ['1. Horizontal dobrando para baixo', '2. Horizontal longo na base'], exampleWord: 'ユニフォーム', examplePt: 'uniforme' },
  { char: 'ヨ', reading: 'yo', meaningPt: 'Katakana YO', strokes: 3, strokeHints: ['1. Topo + lado direito', '2. Barra do meio', '3. Barra inferior'], exampleWord: 'ヨーロッパ', examplePt: 'Europa' },
  // R-row (5)
  { char: 'ラ', reading: 'ra', meaningPt: 'Katakana RA', strokes: 2, strokeHints: ['1. Horizontal curto superior', '2. Horizontal dobrando em curva'], exampleWord: 'ラジオ', examplePt: 'rádio' },
  { char: 'リ', reading: 'ri', meaningPt: 'Katakana RI', strokes: 2, strokeHints: ['1. Vertical esquerdo', '2. Vertical direito curvado'], exampleWord: 'レストラン', examplePt: 'restaurante' },
  { char: 'ル', reading: 'ru', meaningPt: 'Katakana RU', strokes: 2, strokeHints: ['1. Curva esquerda', '2. Vertical dobrando para cima-direita'], exampleWord: 'ルール', examplePt: 'regra' },
  { char: 'レ', reading: 're', meaningPt: 'Katakana RE', strokes: 1, strokeHints: ['1. Vertical descendo e subindo em V fechado'], exampleWord: 'レモン', examplePt: 'limão' },
  { char: 'ロ', reading: 'ro', meaningPt: 'Katakana RO', strokes: 3, strokeHints: ['1. Vertical esquerdo', '2. Topo + lado direito', '3. Base fechando'], exampleWord: 'ロボット', examplePt: 'robô' },
  // W-row + N (3)
  { char: 'ワ', reading: 'wa', meaningPt: 'Katakana WA', strokes: 2, strokeHints: ['1. Vertical curto esquerdo', '2. Horizontal dobrando em curva'], exampleWord: 'ワイン', examplePt: 'vinho' },
  { char: 'ヲ', reading: 'o/wo', meaningPt: 'Katakana WO', strokes: 3, strokeHints: ['1. Horizontal superior', '2. Horizontal do meio', '3. Curva esquerda descendo'], exampleWord: 'ヲ', examplePt: 'partícula clássica' },
  { char: 'ン', reading: 'n', meaningPt: 'Katakana N', strokes: 2, strokeHints: ['1. Ponto horizontal superior', '2. Traço subindo de baixo para cima-direita'], exampleWord: 'パン', examplePt: 'pão' },
];

export const JAPANESE_KANJI: ScriptCharacterItem[] = [
  { char: '一', reading: 'ichi / hitotsu', meaningPt: 'Um (1)', strokes: 1, strokeHints: ['1. Horizontal único da esquerda para a direita'], exampleWord: '一つ (hitotsu)', examplePt: 'um item' },
  { char: '二', reading: 'ni / futatsu', meaningPt: 'Dois (2)', strokes: 2, strokeHints: ['1. Horizontal superior curto', '2. Horizontal inferior longo'], exampleWord: '二月 (nigatsu)', examplePt: 'fevereiro' },
  { char: '三', reading: 'san / mittsu', meaningPt: 'Três (3)', strokes: 3, strokeHints: ['1. Horizontal topo', '2. Horizontal meio curto', '3. Horizontal base longo'], exampleWord: '三日 (mikka)', examplePt: 'dia 3' },
  { char: '四', reading: 'shi / yon', meaningPt: 'Quatro (4)', strokes: 5, strokeHints: ['1-2. Moldura externa', '3-4. Pernas internas', '5. Fecha base'], exampleWord: '四月 (shigatsu)', examplePt: 'abril' },
  { char: '五', reading: 'go / itsutsu', meaningPt: 'Cinco (5)', strokes: 4, strokeHints: ['1. Horizontal topo', '2. Vertical inclinado', '3. Dobradiça', '4. Base longa'], exampleWord: '五分 (gofun)', examplePt: '5 minutos' },
  { char: '十', reading: 'jū / tō', meaningPt: 'Dez (10)', strokes: 2, strokeHints: ['1. Horizontal', '2. Vertical cruzando'], exampleWord: '十円 (jū-en)', examplePt: '10 ienes' },
  { char: '百', reading: 'hyaku', meaningPt: 'Cem (100)', strokes: 6, strokeHints: ['1. Horizontal topo', '2. Traço curto', '3-6. Caixa 白'], exampleWord: '百円 (hyaku-en)', examplePt: '100 ienes' },
  { char: '円', reading: 'en / marui', meaningPt: 'Iene / Círculo', strokes: 4, strokeHints: ['1. Vertical esquerdo', '2. Topo+direito', '3. Vertical interno', '4. Barra central'], exampleWord: '千円 (sen-en)', examplePt: '1.000 ienes' },
  { char: '日', reading: 'nichi / hi', meaningPt: 'Sol / Dia', strokes: 4, strokeHints: ['1. Vertical esquerdo', '2. Topo + direito', '3. Barra central', '4. Base'], exampleWord: '日本 (Nihon)', examplePt: 'Japão' },
  { char: '月', reading: 'getsu / tsuki', meaningPt: 'Lua / Mês', strokes: 4, strokeHints: ['1. Curva esquerda', '2. Topo+gancho', '3-4. Duas barras internas'], exampleWord: '今月 (kongetsu)', examplePt: 'este mês' },
  { char: '本', reading: 'hon / moto', meaningPt: 'Livro / Origem', strokes: 5, strokeHints: ['1. Horizontal', '2. Vertical central', '3-4. Diagonais', '5. Barra na base'], exampleWord: '本 (hon)', examplePt: 'livro' },
  { char: '人', reading: 'hito / jin', meaningPt: 'Pessoa', strokes: 2, strokeHints: ['1. Diagonal esquerda', '2. Diagonal direita'], exampleWord: '日本人', examplePt: 'japonês(a)' },
  { char: '男', reading: 'otoko / dan', meaningPt: 'Homem', strokes: 7, strokeHints: ['1-5. Campo 田 no topo', '6-7. Força 力 na base'], exampleWord: '男の人', examplePt: 'homem' },
  { char: '女', reading: 'onna / jo', meaningPt: 'Mulher', strokes: 3, strokeHints: ['1. Curva dobrada', '2. Curva cruzando', '3. Horizontal longo'], exampleWord: '女の人', examplePt: 'mulher' },
  { char: '子', reading: 'ko / shi', meaningPt: 'Criança', strokes: 3, strokeHints: ['1. Topo dobrando esquerda', '2. Vertical com gancho', '3. Horizontal'], exampleWord: '子ども (kodomo)', examplePt: 'criança' },
  { char: '水', reading: 'mizu / sui', meaningPt: 'Água', strokes: 4, strokeHints: ['1. Vertical com gancho', '2. Asa esquerda', '3-4. Direita'], exampleWord: '水 (mizu)', examplePt: 'água' },
  { char: '火', reading: 'hi / ka', meaningPt: 'Fogo', strokes: 4, strokeHints: ['1-2. Pontos laterais', '3. Curva esquerda', '4. Perna direita'], exampleWord: '火曜日', examplePt: 'terça-feira' },
  { char: '木', reading: 'ki / moku', meaningPt: 'Árvore / Madeira', strokes: 4, strokeHints: ['1. Horizontal', '2. Vertical', '3. Diagonal esquerda', '4. Diagonal direita'], exampleWord: '木曜日', examplePt: 'quinta-feira' },
  { char: '金', reading: 'kane / kin', meaningPt: 'Ouro / Dinheiro', strokes: 8, strokeHints: ['1-2. Telhado', '3-5. Cruz central', '6-7. Pontos', '8. Base'], exampleWord: 'お金 (okane)', examplePt: 'dinheiro' },
  { char: '山', reading: 'yama / san', meaningPt: 'Montanha', strokes: 3, strokeHints: ['1. Pico central', '2. Esquerda+base', '3. Direita'], exampleWord: '富士山', examplePt: 'Monte Fuji' },
  { char: '川', reading: 'kawa / sen', meaningPt: 'Rio', strokes: 3, strokeHints: ['1. Curva esquerda', '2. Centro curto', '3. Direita longa'], exampleWord: '川 (kawa)', examplePt: 'rio' },
  { char: '大', reading: 'ōkii / dai', meaningPt: 'Grande', strokes: 3, strokeHints: ['1. Horizontal', '2. Curva esquerda', '3. Diagonal direita'], exampleWord: '大学 (daigaku)', examplePt: 'universidade' },
  { char: '小', reading: 'chiisai / shō', meaningPt: 'Pequeno', strokes: 3, strokeHints: ['1. Vertical com gancho', '2. Ponto esquerdo', '3. Ponto direito'], exampleWord: '小さい', examplePt: 'pequeno' },
  { char: '中', reading: 'naka / chū', meaningPt: 'Dentro / Centro', strokes: 4, strokeHints: ['1-3. Caixa 口', '4. Vertical central'], exampleWord: '中国', examplePt: 'China' },
  { char: '口', reading: 'kuchi / kō', meaningPt: 'Boca / Entrada', strokes: 3, strokeHints: ['1. Esquerda', '2. Topo+direito', '3. Base'], exampleWord: '出口 (deguchi)', examplePt: 'saída' },
  { char: '目', reading: 'me / moku', meaningPt: 'Olho', strokes: 5, strokeHints: ['1. Esquerda', '2. Topo+direito', '3-4. Duas barras internas', '5. Base'], exampleWord: '目 (me)', examplePt: 'olho' },
  { char: '手', reading: 'te / shu', meaningPt: 'Mão', strokes: 4, strokeHints: ['1. Curva topo', '2-3. Dois horizontais', '4. Gancho central'], exampleWord: '手紙 (tegami)', examplePt: 'carta' },
  { char: '食', reading: 'taberu / shoku', meaningPt: 'Comer / Alimento', strokes: 9, strokeHints: ['1-2. Telhado', '3-7. Caixa', '8-9. Pernas base'], exampleWord: '食べる (taberu)', examplePt: 'comer' },
  { char: '飲', reading: 'nomu / in', meaningPt: 'Beber', strokes: 12, strokeHints: ['Esquerda: radical 食', 'Direita: radical 欠'], exampleWord: '飲む (nomu)', examplePt: 'beber' },
  { char: '駅', reading: 'eki', meaningPt: 'Estação de trem', strokes: 14, strokeHints: ['Esquerda: cavalo 馬', 'Direita: medida 尺'], exampleWord: '東京駅', examplePt: 'Estação de Tóquio' },
];

export const CHINESE_HANZI: ScriptCharacterItem[] = [
  { char: '一', reading: 'yī', meaningPt: 'Um (1)', strokes: 1, strokeHints: ['1. Traço horizontal único (héng)'], exampleWord: '一个 (yí gè)', examplePt: 'um(a)' },
  { char: '二', reading: 'èr', meaningPt: 'Dois (2)', strokes: 2, strokeHints: ['1. Horizontal curto', '2. Horizontal longo'], exampleWord: '二月 (èr yuè)', examplePt: 'fevereiro' },
  { char: '三', reading: 'sān', meaningPt: 'Três (3)', strokes: 3, strokeHints: ['1. Topo', '2. Meio curto', '3. Base longa'], exampleWord: '三天 (sān tiān)', examplePt: '3 dias' },
  { char: '十', reading: 'shí', meaningPt: 'Dez (10)', strokes: 2, strokeHints: ['1. Horizontal', '2. Vertical cruzando'], exampleWord: '十块 (shí kuài)', examplePt: '10 yuan' },
  { char: '人', reading: 'rén', meaningPt: 'Pessoa', strokes: 2, strokeHints: ['1. Pie (diagonal esquerda)', '2. Na (diagonal direita)'], exampleWord: '人们 (rénmen)', examplePt: 'pessoas' },
  { char: '大', reading: 'dà', meaningPt: 'Grande', strokes: 3, strokeHints: ['1. Horizontal', '2. Pie pelo centro', '3. Na à direita'], exampleWord: '大家 (dàjiā)', examplePt: 'pessoal / todos' },
  { char: '小', reading: 'xiǎo', meaningPt: 'Pequeno', strokes: 3, strokeHints: ['1. Gancho central', '2. Ponto esquerdo', '3. Ponto direito'], exampleWord: '小姐 (xiǎojiě)', examplePt: 'senhorita' },
  { char: '山', reading: 'shān', meaningPt: 'Montanha', strokes: 3, strokeHints: ['1. Vertical central', '2. Esquerda+base', '3. Direita'], exampleWord: '爬山 (pá shān)', examplePt: 'escalar' },
  { char: '水', reading: 'shuǐ', meaningPt: 'Água', strokes: 4, strokeHints: ['1. Gancho central', '2. Asa esquerda', '3-4. Direita'], exampleWord: '喝水 (hē shuǐ)', examplePt: 'beber água' },
  { char: '火', reading: 'huǒ', meaningPt: 'Fogo', strokes: 4, strokeHints: ['1-2. Pontos', '3. Pie central', '4. Na direito'], exampleWord: '火车 (huǒchē)', examplePt: 'trem' },
  { char: '木', reading: 'mù', meaningPt: 'Árvore / Madeira', strokes: 4, strokeHints: ['1. Horizontal', '2. Vertical', '3-4. Diagonais'], exampleWord: '树木 (shùmù)', examplePt: 'árvores' },
  { char: '日', reading: 'rì', meaningPt: 'Sol / Dia', strokes: 4, strokeHints: ['1. Esquerda', '2. Topo+direita', '3. Barra meio', '4. Base'], exampleWord: '生日 (shēngrì)', examplePt: 'aniversário' },
  { char: '月', reading: 'yuè', meaningPt: 'Lua / Mês', strokes: 4, strokeHints: ['1. Esquerda', '2. Topo+gancho', '3-4. Barras internas'], exampleWord: '一月 (yīyuè)', examplePt: 'janeiro' },
  { char: '口', reading: 'kǒu', meaningPt: 'Boca / Entrada', strokes: 3, strokeHints: ['1. Esquerda', '2. Topo+direito', '3. Base'], exampleWord: '出口 (chūkǒu)', examplePt: 'saída' },
  { char: '中', reading: 'zhōng', meaningPt: 'Centro / China', strokes: 4, strokeHints: ['1-3. Caixa 口', '4. Vertical central por último'], exampleWord: '中文 (Zhōngwén)', examplePt: 'idioma chinês' },
  { char: '国', reading: 'guó', meaningPt: 'País / Nação', strokes: 8, strokeHints: ['1-2. Moldura', '3-7. 玉 interno', '8. Fecha base'], exampleWord: '中国 (Zhōngguó)', examplePt: 'China' },
  { char: '天', reading: 'tiān', meaningPt: 'Céu / Dia', strokes: 4, strokeHints: ['1-2. Dois horizontais', '3. Pie', '4. Na'], exampleWord: '今天 (jīntiān)', examplePt: 'hoje' },
  { char: '上', reading: 'shàng', meaningPt: 'Cima / Subir', strokes: 3, strokeHints: ['1. Vertical', '2. Barra curta direita', '3. Base longa'], exampleWord: '上班 (shàngbān)', examplePt: 'ir trabalhar' },
  { char: '下', reading: 'xià', meaningPt: 'Baixo / Descer', strokes: 3, strokeHints: ['1. Horizontal topo', '2. Vertical', '3. Ponto direito'], exampleWord: '下雨 (xià yǔ)', examplePt: 'chover' },
  { char: '手', reading: 'shǒu', meaningPt: 'Mão', strokes: 4, strokeHints: ['1. Curva topo', '2-3. Horizontais', '4. Gancho central'], exampleWord: '手机 (shǒujī)', examplePt: 'celular' },
  { char: '心', reading: 'xīn', meaningPt: 'Coração / Mente', strokes: 4, strokeHints: ['1. Ponto esquerdo', '2. Curva central', '3-4. Pontos topo/direito'], exampleWord: '开心 (kāixīn)', examplePt: 'feliz' },
  { char: '门', reading: 'mén', meaningPt: 'Porta', strokes: 3, strokeHints: ['1. Ponto esquerdo', '2. Vertical', '3. Topo+gancho direito'], exampleWord: '开门 (kāimén)', examplePt: 'abrir a porta' },
  { char: '女', reading: 'nǚ', meaningPt: 'Mulher', strokes: 3, strokeHints: ['1. Curva dobrada', '2. Curva cruzando', '3. Horizontal'], exampleWord: '女儿 (nǚ’ér)', examplePt: 'filha' },
  { char: '子', reading: 'zǐ', meaningPt: 'Filho / Criança', strokes: 3, strokeHints: ['1. Topo dobrando', '2. Gancho vertical', '3. Horizontal'], exampleWord: '儿子 (érzi)', examplePt: 'filho' },
  { char: '好', reading: 'hǎo', meaningPt: 'Bom / Bem', strokes: 6, strokeHints: ['Esquerda: 女 (3)', 'Direita: 子 (3)'], exampleWord: '你好 (nǐ hǎo)', examplePt: 'olá' },
  { char: '我', reading: 'wǒ', meaningPt: 'Eu', strokes: 7, strokeHints: ['1-4. Lado esquerdo', '5. Gancho longo', '6-7. Cruz+ponto'], exampleWord: '我们 (wǒmen)', examplePt: 'nós' },
  { char: '你', reading: 'nǐ', meaningPt: 'Você', strokes: 7, strokeHints: ['Esquerda: 亻 (2)', 'Direita: 尔 (5)'], exampleWord: '你好 (nǐ hǎo)', examplePt: 'olá' },
  { char: '他', reading: 'tā', meaningPt: 'Ele', strokes: 5, strokeHints: ['Esquerda: 亻 (2)', 'Direita: 也 (3)'], exampleWord: '他们 (tāmen)', examplePt: 'eles' },
  { char: '是', reading: 'shì', meaningPt: 'Ser / É', strokes: 9, strokeHints: ['Topo: 日 (4)', 'Base: 疋 (5)'], exampleWord: '我是 (wǒ shì)', examplePt: 'eu sou' },
  { char: '不', reading: 'bù', meaningPt: 'Não', strokes: 4, strokeHints: ['1. Horizontal', '2. Pie', '3. Vertical', '4. Ponto'], exampleWord: '不好 (bù hǎo)', examplePt: 'não bom' },
  { char: '有', reading: 'yǒu', meaningPt: 'Ter / Haver', strokes: 6, strokeHints: ['1. Horizontal', '2. Pie', '3-6. 月'], exampleWord: '没有 (méiyǒu)', examplePt: 'não ter' },
  { char: '去', reading: 'qù', meaningPt: 'Ir', strokes: 5, strokeHints: ['Topo: 土 (3)', 'Base: 厶 (2)'], exampleWord: '去哪儿 (qù nǎr)', examplePt: 'ir aonde?' },
  { char: '来', reading: 'lái', meaningPt: 'Vir', strokes: 7, strokeHints: ['1. Topo', '2-3. Pontos', '4. Horizontal', '5-7. 木'], exampleWord: '回来 (huílái)', examplePt: 'voltar' },
  { char: '吃', reading: 'chī', meaningPt: 'Comer', strokes: 6, strokeHints: ['Esquerda: 口 (3)', 'Direita: 乞 (3)'], exampleWord: '吃饭 (chīfàn)', examplePt: 'comer refeição' },
  { char: '喝', reading: 'hē', meaningPt: 'Beber', strokes: 12, strokeHints: ['Esquerda: 口 (3)', 'Direita: 曷 (9)'], exampleWord: '喝茶 (hē chá)', examplePt: 'beber chá' },
  { char: '茶', reading: 'chá', meaningPt: 'Chá', strokes: 9, strokeHints: ['Topo: 艹', 'Meio: 人', 'Base: 木'], exampleWord: '绿茶 (lǜchá)', examplePt: 'chá verde' },
  { char: '车', reading: 'chē', meaningPt: 'Veículo / Carro', strokes: 4, strokeHints: ['1. Horizontal', '2. Dobradiça', '3. Horizontal', '4. Vertical'], exampleWord: '汽车 (qìchē)', examplePt: 'automóvel' },
  { char: '钱', reading: 'qián', meaningPt: 'Dinheiro', strokes: 10, strokeHints: ['Esquerda: metal 钅', 'Direita: 戋'], exampleWord: '多少钱', examplePt: 'quanto custa?' },
  { char: '买', reading: 'mǎi', meaningPt: 'Comprar', strokes: 6, strokeHints: ['1. Dobradiça topo', '2-3. Pontos', '4-6. 头'], exampleWord: '买东西', examplePt: 'fazer compras' },
  { char: '谢', reading: 'xiè', meaningPt: 'Agradecer', strokes: 12, strokeHints: ['Esquerda: 讠', 'Meio: 身', 'Direita: 寸'], exampleWord: '谢谢 (xièxie)', examplePt: 'obrigado(a)' },
];

export const MANDARIN_TONES: MandarinToneGuide[] = [
  { tone: 1, namePt: '1º Tom · Alto e Plano (55)', contour: '───', descriptionPt: 'Mantenha a voz aguda e estável, sem subir nem cair.', exampleHanzi: '妈', examplePinyin: 'mā', examplePt: 'mãe' },
  { tone: 2, namePt: '2º Tom · Ascendente (35)', contour: '╱', descriptionPt: 'Suba o tom como se estivesse fazendo uma pergunta surpresa ("Quê?").', exampleHanzi: '麻', examplePinyin: 'má', examplePt: 'linho / dormência' },
  { tone: 3, namePt: '3º Tom · Descendente-Ascendente (214)', contour: '╲╱', descriptionPt: 'Desça bem grave no fundo da garganta e suba suavemente no final.', exampleHanzi: '马', examplePinyin: 'mǎ', examplePt: 'cavalo' },
  { tone: 4, namePt: '4º Tom · Descendente Firme (51)', contour: '╲', descriptionPt: 'Corte seco de cima para baixo, como uma ordem firme ("Não!").', exampleHanzi: '骂', examplePinyin: 'mà', examplePt: 'repreender' },
];

// Completo: todas as 33 letras do Alfabeto Cirílico Russo (А–Я)
export const RUSSIAN_CYRILLIC: ScriptCharacterItem[] = [
  { char: 'А а', reading: 'a', meaningPt: 'Vogal A (como "a" em casa)', strokes: 3, strokeHints: ['1. Diagonal esquerda', '2. Diagonal direita', '3. Barra central'], exampleWord: 'автобус', examplePt: 'ônibus' },
  { char: 'Б б', reading: 'b', meaningPt: 'Consoante B', strokes: 3, strokeHints: ['1. Vertical', '2. Teto horizontal', '3. Barriga arredondada'], exampleWord: 'банк', examplePt: 'banco' },
  { char: 'В в', reading: 'v', meaningPt: 'Falso amigo visual! Som de V (não B!)', strokes: 3, strokeHints: ['1. Vertical esquerdo', '2-3. Duas alças à direita'], exampleWord: 'вода (vodá)', examplePt: 'água', cursiveNote: 'Falso amigo visual: В = V' },
  { char: 'Г г', reading: 'g', meaningPt: 'Som de G duro (gato)', strokes: 2, strokeHints: ['1. Vertical esquerdo', '2. Teto horizontal'], exampleWord: 'город', examplePt: 'cidade' },
  { char: 'Д д', reading: 'd', meaningPt: 'Som de D', strokes: 4, strokeHints: ['1-2. Corpo em trapézio', '3. Base larga', '4. Perninhas abaixo'], exampleWord: 'дом', examplePt: 'casa' },
  { char: 'Е е', reading: 'ye / iê', meaningPt: 'Vogal palatizada YE ("iê")', strokes: 4, strokeHints: ['1. Vertical', '2-4. Três barras horizontais'], exampleWord: 'если', examplePt: 'se' },
  { char: 'Ё ё', reading: 'yo / iô', meaningPt: 'Vogal sempre tônica YO ("iô")', strokes: 6, strokeHints: ['1-4. Como Е', '5-6. Dois pontos no topo'], exampleWord: 'ёлка', examplePt: 'árvore de Natal' },
  { char: 'Ж ж', reading: 'zh (j)', meaningPt: 'Som de J em "janela"', strokes: 3, strokeHints: ['1. Vertical central', '2-3. Dois K espelhados'], exampleWord: 'жизнь', examplePt: 'vida' },
  { char: 'З з', reading: 'z', meaningPt: 'Som de Z (zebra)', strokes: 1, strokeHints: ['1. Curva dupla como o número 3'], exampleWord: 'завтрак', examplePt: 'café da manhã' },
  { char: 'И и', reading: 'i', meaningPt: 'Vogal I', strokes: 3, strokeHints: ['1. Vertical esquerdo', '2. Diagonal subindo', '3. Vertical direito'], exampleWord: 'имя', examplePt: 'nome' },
  { char: 'Й й', reading: 'y (semivogal)', meaningPt: 'I curto ("i" de "pai")', strokes: 4, strokeHints: ['1-3. Como И', '4. Arco breve no topo'], exampleWord: 'йогурт', examplePt: 'iogurte' },
  { char: 'К к', reading: 'k', meaningPt: 'Som de K (casa)', strokes: 3, strokeHints: ['1. Vertical esquerdo', '2-3. Diagonais em V'], exampleWord: 'книга', examplePt: 'livro' },
  { char: 'Л л', reading: 'l', meaningPt: 'Som de L', strokes: 2, strokeHints: ['1. Curva esquerda descendo', '2. Perna direita'], exampleWord: 'любовь', examplePt: 'amor' },
  { char: 'М м', reading: 'm', meaningPt: 'Som de M', strokes: 4, strokeHints: ['1. Esquerda', '2-3. V central', '4. Direita'], exampleWord: 'метро', examplePt: 'metrô' },
  { char: 'Н н', reading: 'n', meaningPt: 'Falso amigo visual! Som de N (não H!)', strokes: 3, strokeHints: ['1. Esquerda', '2. Direita', '3. Barra central'], exampleWord: 'нет (nyet)', examplePt: 'não', cursiveNote: 'Falso amigo visual: Н = N' },
  { char: 'О о', reading: 'o / a', meaningPt: 'Vogal O (átona soa como A)', strokes: 1, strokeHints: ['1. Oval fechado contínuo'], exampleWord: 'окно', examplePt: 'janela' },
  { char: 'П п', reading: 'p', meaningPt: 'Som de P (pai)', strokes: 3, strokeHints: ['1. Vertical esquerdo', '2. Teto horizontal', '3. Vertical direito'], exampleWord: 'привет', examplePt: 'oi / olá' },
  { char: 'Р р', reading: 'r', meaningPt: 'Falso amigo visual! Som de R vibrante (não P!)', strokes: 2, strokeHints: ['1. Vertical', '2. Meia-lua superior'], exampleWord: 'работа', examplePt: 'trabalho', cursiveNote: 'Falso amigo visual: Р = R' },
  { char: 'С с', reading: 's', meaningPt: 'Falso amigo visual! Som de S (não K!)', strokes: 1, strokeHints: ['1. Arco aberto para a direita'], exampleWord: 'спасибо', examplePt: 'obrigado', cursiveNote: 'Falso amigo visual: С = S' },
  { char: 'Т т', reading: 't', meaningPt: 'Som de T (tatu)', strokes: 2, strokeHints: ['1. Horizontal topo', '2. Vertical central'], exampleWord: 'такси', examplePt: 'táxi' },
  { char: 'У у', reading: 'u', meaningPt: 'Falso amigo visual! Som de U (não Y!)', strokes: 2, strokeHints: ['1. Diagonal esquerda', '2. Diagonal longa cruzando'], exampleWord: 'утро', examplePt: 'manhã', cursiveNote: 'Falso amigo visual: У = U' },
  { char: 'Ф ф', reading: 'f', meaningPt: 'Som de F', strokes: 2, strokeHints: ['1. Círculo central', '2. Vertical atravessando'], exampleWord: 'фото', examplePt: 'foto' },
  { char: 'Х х', reading: 'kh', meaningPt: 'Falso amigo visual! Som de RR forte (não X!)', strokes: 2, strokeHints: ['1. Diagonal esquerda-direita', '2. Diagonal cruzando'], exampleWord: 'хорошо', examplePt: 'tudo bem', cursiveNote: 'Falso amigo visual: Х = RR/KH' },
  { char: 'Ц ц', reading: 'ts', meaningPt: 'Som de TS ("pizza")', strokes: 4, strokeHints: ['1. Esquerda', '2. Direita', '3. Base', '4. Rabicho direito'], exampleWord: 'центр', examplePt: 'centro' },
  { char: 'Ч ч', reading: 'tch', meaningPt: 'Som de TCH ("tchau")', strokes: 2, strokeHints: ['1. Curva em U superior', '2. Vertical direito'], exampleWord: 'чай', examplePt: 'chá' },
  { char: 'Ш ш', reading: 'sh', meaningPt: 'Som de X ("xícara") duro', strokes: 4, strokeHints: ['1-3. Três hastes verticais', '4. Base ligando'], exampleWord: 'школа', examplePt: 'escola' },
  { char: 'Щ щ', reading: 'shch', meaningPt: 'Som de X suave e longo ("xixi")', strokes: 5, strokeHints: ['1-4. Como Ш', '5. Rabicho direito'], exampleWord: 'борщ', examplePt: 'borscht' },
  { char: 'Ъ ъ', reading: 'sinal duro', meaningPt: 'Sinal duro (separa consoante de vogal)', strokes: 2, strokeHints: ['1. Gancho topo esquerdo', '2. Vertical com barriga'], exampleWord: 'объект', examplePt: 'objeto' },
  { char: 'Ы ы', reading: 'y gutural', meaningPt: 'Vogal posterior Ы', strokes: 3, strokeHints: ['1. Vertical com barriga Ь', '2. Vertical I à direita'], exampleWord: 'сыр', examplePt: 'queijo' },
  { char: 'Ь ь', reading: 'sinal brando', meaningPt: 'Sinal brando (palatiza a consoante)', strokes: 2, strokeHints: ['1. Vertical', '2. Barriga inferior direita'], exampleWord: 'день', examplePt: 'dia' },
  { char: 'Э э', reading: 'e aberto', meaningPt: 'Vogal E aberto (sem som de I)', strokes: 2, strokeHints: ['1. Arco C invertido', '2. Barra central'], exampleWord: 'это', examplePt: 'isto' },
  { char: 'Ю ю', reading: 'yu / iú', meaningPt: 'Som de IU ("iú")', strokes: 3, strokeHints: ['1. Vertical esquerdo', '2. Barra ligação', '3. Oval direito'], exampleWord: 'юг', examplePt: 'sul' },
  { char: 'Я я', reading: 'ya / iá', meaningPt: 'Som de IA ("iá") — significa "Eu"', strokes: 3, strokeHints: ['1. Vertical direito', '2. Laço superior esquerdo', '3. Perna esquerda'], exampleWord: 'яблоко', examplePt: 'maçã' },
];

// Completo: todas as 28 letras do Alfabeto Árabe (أبجدية عربية — escrita RTL)
export const ARABIC_ALPHABET: ScriptCharacterItem[] = [
  { char: 'ا', reading: 'ā (Alif)', meaningPt: 'Vogal longa A / Suporte de Hamza', strokes: 1, direction: 'rtl', forms: { isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا' }, strokeHints: ['1. Traço vertical único de cima para baixo (não liga à esquerda)'], exampleWord: 'أنا (anā)', examplePt: 'eu' },
  { char: 'ب', reading: 'b (Bāʾ)', meaningPt: 'Consoante B', strokes: 2, direction: 'rtl', forms: { isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب' }, strokeHints: ['1. Barquinho da direita para esquerda', '2. 1 ponto abaixo'], exampleWord: 'بيت (bayt)', examplePt: 'casa' },
  { char: 'ت', reading: 't (Tāʾ)', meaningPt: 'Consoante T', strokes: 3, direction: 'rtl', forms: { isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت' }, strokeHints: ['1. Barquinho RTL', '2. 2 pontos acima'], exampleWord: 'تفاح (tuffāḥ)', examplePt: 'maçã' },
  { char: 'ث', reading: 'th (Thāʾ)', meaningPt: 'Som de TH inglês ("think")', strokes: 4, direction: 'rtl', forms: { isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث' }, strokeHints: ['1. Barquinho RTL', '2. 3 pontos em triângulo acima'], exampleWord: 'ثلاثة (thalātha)', examplePt: 'três' },
  { char: 'ج', reading: 'j / dj (Jīm)', meaningPt: 'Som de DJ ("dia" / "jazz")', strokes: 2, direction: 'rtl', forms: { isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج' }, strokeHints: ['1. Sobrancelha RTL + barriga C abaixo da linha', '2. 1 ponto dentro'], exampleWord: 'جميل (jamīl)', examplePt: 'bonito' },
  { char: 'ح', reading: 'ḥ (Ḥāʾ)', meaningPt: 'H faríngeo forte (sem ponto)', strokes: 1, direction: 'rtl', forms: { isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح' }, strokeHints: ['1. Mesmo formato de ج, porém SEM ponto'], exampleWord: 'حب (ḥubb)', examplePt: 'amor' },
  { char: 'خ', reading: 'kh (Khāʾ)', meaningPt: 'Som de RR forte ("carro")', strokes: 2, direction: 'rtl', forms: { isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ' }, strokeHints: ['1. Formato de ح', '2. 1 ponto acima'], exampleWord: 'خبز (khubz)', examplePt: 'pão' },
  { char: 'د', reading: 'd (Dāl)', meaningPt: 'Consoante D (não liga à esquerda)', strokes: 1, direction: 'rtl', forms: { isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد' }, strokeHints: ['1. Ângulo suave sentado sobre a linha'], exampleWord: 'درس (dars)', examplePt: 'lição' },
  { char: 'ذ', reading: 'dh (Dhāl)', meaningPt: 'Som de TH sonoro ("this")', strokes: 2, direction: 'rtl', forms: { isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ' }, strokeHints: ['1. Igual ao د', '2. 1 ponto acima'], exampleWord: 'ذهب (dhahab)', examplePt: 'ouro' },
  { char: 'ر', reading: 'r (Rāʾ)', meaningPt: 'R vibrante (não liga à esquerda)', strokes: 1, direction: 'rtl', forms: { isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر' }, strokeHints: ['1. Curva descendo abaixo da linha para a esquerda'], exampleWord: 'رجل (rajul)', examplePt: 'homem' },
  { char: 'ز', reading: 'z (Zāy)', meaningPt: 'Consoante Z (não liga à esquerda)', strokes: 2, direction: 'rtl', forms: { isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز' }, strokeHints: ['1. Igual ao ر', '2. 1 ponto acima'], exampleWord: 'زهرة (zahra)', examplePt: 'flor' },
  { char: 'س', reading: 's (Sīn)', meaningPt: 'Consoante S ("sapo")', strokes: 1, direction: 'rtl', forms: { isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس' }, strokeHints: ['1. Três dentinhos RTL + grande tigela final'], exampleWord: 'سلام (salām)', examplePt: 'paz' },
  { char: 'ش', reading: 'sh (Shīn)', meaningPt: 'Som de X ("xícara")', strokes: 4, direction: 'rtl', forms: { isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش' }, strokeHints: ['1. Igual ao س', '2. 3 pontos acima'], exampleWord: 'شمس (shams)', examplePt: 'sol' },
  { char: 'ص', reading: 'ṣ (Ṣād)', meaningPt: 'S enfático (língua abaixada)', strokes: 1, direction: 'rtl', forms: { isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص' }, strokeHints: ['1. Laço fechado para a direita + dentinho + tigela'], exampleWord: 'صباح (ṣabāḥ)', examplePt: 'manhã' },
  { char: 'ض', reading: 'ḍ (Ḍād)', meaningPt: 'D enfático (letra única do árabe)', strokes: 2, direction: 'rtl', forms: { isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض' }, strokeHints: ['1. Igual ao ص', '2. 1 ponto acima'], exampleWord: 'ضوء (ḍawʾ)', examplePt: 'luz' },
  { char: 'ط', reading: 'ṭ (Ṭāʾ)', meaningPt: 'T enfático', strokes: 2, direction: 'rtl', forms: { isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط' }, strokeHints: ['1. Laço na base', '2. Haste vertical descendo sobre o laço'], exampleWord: 'طعام (ṭaʿām)', examplePt: 'comida' },
  { char: 'ظ', reading: 'ẓ (Ẓāʾ)', meaningPt: 'TH sonoro enfático', strokes: 3, direction: 'rtl', forms: { isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' }, strokeHints: ['1-2. Igual ao ط', '3. 1 ponto à direita da haste'], exampleWord: 'ظهر (ẓuhr)', examplePt: 'meio-dia' },
  { char: 'ع', reading: 'ʿ (ʿAyn)', meaningPt: 'Som gutural sonoro da faringe', strokes: 1, direction: 'rtl', forms: { isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع' }, strokeHints: ['1. Pequeno C superior + grande C abaixo da linha'], exampleWord: 'عربي (ʿarabī)', examplePt: 'árabe' },
  { char: 'غ', reading: 'gh (Ghayn)', meaningPt: 'R francês / gargarejo suave', strokes: 2, direction: 'rtl', forms: { isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ' }, strokeHints: ['1. Igual ao ع', '2. 1 ponto acima'], exampleWord: 'غرفة (ghurfa)', examplePt: 'quarto' },
  { char: 'ف', reading: 'f (Fāʾ)', meaningPt: 'Consoante F', strokes: 2, direction: 'rtl', forms: { isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف' }, strokeHints: ['1. Cabeça redonda + corpo plano na linha', '2. 1 ponto acima'], exampleWord: 'فندق (funduq)', examplePt: 'hotel' },
  { char: 'ق', reading: 'q (Qāf)', meaningPt: 'K profundo na úvula', strokes: 3, direction: 'rtl', forms: { isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق' }, strokeHints: ['1. Cabeça + tigela funda abaixo da linha', '2. 2 pontos acima'], exampleWord: 'قهوة (qahwa)', examplePt: 'café' },
  { char: 'ك', reading: 'k (Kāf)', meaningPt: 'Consoante K', strokes: 2, direction: 'rtl', forms: { isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك' }, strokeHints: ['1. Vertical descendo em L largo', '2. Mini hamza dentro'], exampleWord: 'كتاب (kitāb)', examplePt: 'livro' },
  { char: 'ل', reading: 'l (Lām)', meaningPt: 'Consoante L', strokes: 1, direction: 'rtl', forms: { isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل' }, strokeHints: ['1. Vertical alto descendo em gancho fundo'], exampleWord: 'ليل (layl)', examplePt: 'noite' },
  { char: 'م', reading: 'm (Mīm)', meaningPt: 'Consoante M', strokes: 1, direction: 'rtl', forms: { isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم' }, strokeHints: ['1. Pequeno círculo + cauda descendo na vertical'], exampleWord: 'ماء (māʾ)', examplePt: 'água' },
  { char: 'ن', reading: 'n (Nūn)', meaningPt: 'Consoante N', strokes: 2, direction: 'rtl', forms: { isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن' }, strokeHints: ['1. Tigela funda abaixo da linha', '2. 1 ponto dentro'], exampleWord: 'نعم (naʿam)', examplePt: 'sim' },
  { char: 'ه', reading: 'h (Hāʾ)', meaningPt: 'H aspirado leve (como inglês "house")', strokes: 1, direction: 'rtl', forms: { isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه' }, strokeHints: ['1. Círculo fechado em gota'], exampleWord: 'هنا (hunā)', examplePt: 'aqui' },
  { char: 'و', reading: 'w / ū (Wāw)', meaningPt: 'Som de W / U longo (não liga à esquerda)', strokes: 1, direction: 'rtl', forms: { isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو' }, strokeHints: ['1. Laço pequeno + cauda em vírgula abaixo da linha'], exampleWord: 'وقت (waqt)', examplePt: 'tempo' },
  { char: 'ي', reading: 'y / ī (Yāʾ)', meaningPt: 'Som de Y / I longo', strokes: 3, direction: 'rtl', forms: { isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي' }, strokeHints: ['1. S invertido com tigela final', '2. 2 pontos abaixo'], exampleWord: 'يوم (yawm)', examplePt: 'dia' },
];

export function extractScriptCharsFromWord(
  word: string,
  languageCode: 'ja' | 'zh' | 'ru' | 'ar',
): ScriptCharacterItem[] {
  const bank =
    languageCode === 'ja'
      ? [...JAPANESE_HIRAGANA, ...JAPANESE_KATAKANA, ...JAPANESE_KANJI]
      : languageCode === 'zh'
        ? CHINESE_HANZI
        : languageCode === 'ar'
          ? ARABIC_ALPHABET
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

/**
 * @file src/data/visualConcepts.ts
 * @description Catálogo multilíngue de >= 360 conceitos visuais (18 categorias), resolução por palavra/tradução, URLs de mídia R2, SVG fallback determinístico e inferência de trilhas.
 * @exports VisualConceptCategory, VisualConcept, VISUAL_CONCEPTS, VISUAL_CONCEPTS_MAP, resolveVisualConceptId, getConceptImageUrl, buildConceptFallbackSvgDataUri, inferTrackTagsFromTopic
 */
import { DEFAULT_BACKEND_API_URL } from '../config/appConfig';
import type { CEFRLevel, TrackTag } from '../types/learning';

export type VisualConceptCategory =
  | 'food'
  | 'travel'
  | 'home'
  | 'work'
  | 'health'
  | 'city'
  | 'nature'
  | 'tech'
  | 'people'
  | 'emotions'
  | 'finance'
  | 'law'
  | 'science'
  | 'culture'
  | 'clothes'
  | 'transport'
  | 'education'
  | 'sports';

export interface VisualConcept {
  id: string;
  category: VisualConceptCategory;
  labelPt: string;
  emoji: string;
  bgHex: string;
  accentHex: string;
  keywords: string[];
}

type RawConcept = [id: string, labelPt: string, emoji: string, keywords: string[]];

const CATEGORY_PALETTE: Record<VisualConceptCategory, { bgHex: string; accentHex: string }> = {
  food: { bgHex: '#FEF3C7', accentHex: '#D97706' },
  travel: { bgHex: '#DBEAFE', accentHex: '#2563EB' },
  home: { bgHex: '#FFEDD5', accentHex: '#EA580C' },
  work: { bgHex: '#E0E7FF', accentHex: '#4F46E5' },
  health: { bgHex: '#FCE7F3', accentHex: '#DB2777' },
  city: { bgHex: '#E2E8F0', accentHex: '#475569' },
  nature: { bgHex: '#DCFCE7', accentHex: '#16A34A' },
  tech: { bgHex: '#CFFAFE', accentHex: '#0891B2' },
  people: { bgHex: '#F3E8FF', accentHex: '#9333EA' },
  emotions: { bgHex: '#FEF9C3', accentHex: '#CA8A04' },
  finance: { bgHex: '#D1FAE5', accentHex: '#059669' },
  law: { bgHex: '#F1F5F9', accentHex: '#334155' },
  science: { bgHex: '#EDE9FE', accentHex: '#7C3AED' },
  culture: { bgHex: '#FFE4E6', accentHex: '#E11D48' },
  clothes: { bgHex: '#FAE8FF', accentHex: '#C026D3' },
  transport: { bgHex: '#E0F2FE', accentHex: '#0284C7' },
  education: { bgHex: '#FEF08A', accentHex: '#B45309' },
  sports: { bgHex: '#ECFCCB', accentHex: '#65A30D' },
};

const RAW_CONCEPTS: Record<VisualConceptCategory, RawConcept[]> = {
  food: [
    ['apple', 'Maçã', '🍎', ['apple', 'maçã', 'maca', 'manzana', 'pomme', 'mela', 'apfel', 'яблоко', 'りんご', '苹果', 'تفاحة']],
    ['bread', 'Pão', '🍞', ['bread', 'pão', 'pao', 'pan', 'pain', 'pane', 'brot', 'хлеб', 'パン', '面包']],
    ['coffee', 'Café', '☕', ['coffee', 'café', 'cafe', 'kaffee', 'caffè', 'кофе', 'コーヒー', '咖啡', 'قهوة']],
    ['water', 'Água', '💧', ['water', 'água', 'agua', 'eau', 'acqua', 'wasser', 'вода', '水', 'ماء']],
    ['milk', 'Leite', '🥛', ['milk', 'leite', 'leche', 'lait', 'latte', 'milch', 'молоко', '牛乳', '牛奶']],
    ['cheese', 'Queijo', '🧀', ['cheese', 'queijo', 'queso', 'fromage', 'formaggio', 'käse', 'сыр', 'チーズ']],
    ['egg', 'Ovo', '🥚', ['egg', 'ovo', 'huevo', 'oeuf', 'uovo', 'ei', 'яйцо', '卵']],
    ['meat', 'Carne', '🥩', ['meat', 'steak', 'carne', 'viande', 'fleisch', 'мясо', '肉']],
    ['fish', 'Peixe', '🐟', ['fish', 'peixe', 'pescado', 'poisson', 'pesce', 'fisch', 'рыба', '魚']],
    ['chicken', 'Frango', '🍗', ['chicken', 'frango', 'pollo', 'poulet', 'hähnchen', 'курица']],
    ['rice', 'Arroz', '🍚', ['rice', 'arroz', 'riz', 'riso', 'reis', 'рис', 'ご飯', '米饭']],
    ['pasta', 'Massa', '🍝', ['pasta', 'massa', 'macarrão', 'pâtes', 'nudeln', 'паста']],
    ['salad', 'Salada', '🥗', ['salad', 'salada', 'ensalada', 'salade', 'insalata', 'salat', 'салат']],
    ['soup', 'Sopa', '🍲', ['soup', 'sopa', 'soupe', 'zuppa', 'suppe', 'суп', 'スープ']],
    ['pizza', 'Pizza', '🍕', ['pizza', 'пицца', 'ピザ']],
    ['burger', 'Hambúrguer', '🍔', ['burger', 'hamburger', 'hambúrguer', 'hamburguesa']],
    ['cake', 'Bolo', '🍰', ['cake', 'bolo', 'pastel', 'tarta', 'gâteau', 'torta', 'kuchen', 'торт']],
    ['fruit', 'Fruta', '🍓', ['fruit', 'fruta', 'frutas', 'obst', 'frutta', 'фрукты']],
    ['banana', 'Banana', '🍌', ['banana', 'plátano', 'banane', 'банан']],
    ['orange', 'Laranja', '🍊', ['orange', 'laranja', 'naranja', 'arancia', 'апельсин']],
    ['tea', 'Chá', '🍵', ['tea', 'chá', 'cha', 'té', 'thé', 'tè', 'tee', 'чай', 'お茶', '茶']],
    ['wine', 'Vinho', '🍷', ['wine', 'vinho', 'vino', 'vin', 'wein', 'вино']],
    ['beer', 'Cerveja', '🍺', ['beer', 'cerveja', 'cerveza', 'bière', 'birra', 'bier', 'пиво']],
    ['restaurant', 'Restaurante', '🍽️', ['restaurant', 'restaurante', 'menu', 'cardápio', 'garçom', 'waiter', 'dinner', 'lunch', 'breakfast', 'jantar', 'almoço', 'café da manhã']],
  ],
  travel: [
    ['passport', 'Passaporte', '🛂', ['passport', 'passaporte', 'pasaporte', 'passeport', 'passaporto', 'reisepass', 'паспорт']],
    ['luggage', 'Bagagem', '🧳', ['luggage', 'suitcase', 'bagagem', 'mala', 'equipaje', 'maleta', 'valise', 'valigia', 'koffer', 'багаж']],
    ['hotel', 'Hotel', '🏨', ['hotel', 'pousada', 'hostel', 'albergo', 'check-in', 'checkin', 'reservation', 'reserva']],
    ['ticket', 'Passagem', '🎫', ['ticket', 'passagem', 'bilhete', 'ingresso', 'boleto', 'billet', 'biglietto', 'fahrkarte', 'билет']],
    ['map', 'Mapa', '🗺️', ['map', 'mapa', 'carte', 'mappa', 'karte', 'карта', '地図']],
    ['compass', 'Bússola', '🧭', ['compass', 'bússola', 'direction', 'direção', 'norte', 'sul', 'north', 'south']],
    ['beach', 'Praia', '🏖️', ['beach', 'praia', 'playa', 'plage', 'spiaggia', 'strand', 'пляж']],
    ['island', 'Ilha', '🏝️', ['island', 'ilha', 'isla', 'île', 'isola', 'insel', 'остров']],
    ['camera', 'Câmera', '📷', ['camera', 'câmera', 'photo', 'foto', 'fotografia', 'appareil']],
    ['boarding-pass', 'Cartão de Embarque', '🪪', ['boarding', 'embarque', 'flight', 'voo', 'vuelo', 'vol', 'volo', 'flug']],
    ['customs', 'Alfândega', '🛃', ['customs', 'alfândega', 'aduana', 'douane', 'dogana', 'zoll']],
    ['tourist', 'Turista', '🎒', ['tourist', 'turista', 'backpack', 'mochila', 'traveler', 'viajante', 'trip', 'viagem', 'viaje', 'voyage']],
    ['visa', 'Visto', '📑', ['visa', 'visto', 'embassy', 'embaixada']],
    ['currency-exchange', 'Câmbio', '💱', ['exchange', 'câmbio', 'cambio', 'forex']],
    ['camping', 'Acampamento', '⛺', ['camping', 'tent', 'barraca', 'acampamento', 'acampar']],
    ['cruise', 'Cruzeiro', '🛳️', ['cruise', 'cruzeiro', 'ferry', 'balsa', 'ship', 'navio']],
    ['postcard', 'Cartão-postal', '🏞️', ['postcard', 'postal', 'souvenir', 'lembrança']],
    ['resort', 'Resort', '🌴', ['resort', 'vacation', 'férias', 'ferias', 'vacaciones', 'vacances', 'holiday']],
    ['guide', 'Guia Turístico', '🚩', ['guide', 'guia', 'tour', 'passeio', 'excursion']],
    ['window-seat', 'Assento na Janela', '💺', ['seat', 'assento', 'asiento', 'siège', 'posto', 'sitz']],
  ],
  home: [
    ['house', 'Casa', '🏠', ['house', 'home', 'casa', 'lar', 'hogar', 'maison', 'haus', 'дом', '家']],
    ['apartment', 'Apartamento', '🏢', ['apartment', 'flat', 'apartamento', 'piso', 'appartement', 'wohnung', 'квартира']],
    ['bed', 'Cama', '🛏️', ['bed', 'cama', 'lit', 'letto', 'bett', 'кровать', 'bedroom', 'quarto', 'dormir', 'sleep']],
    ['sofa', 'Sofá', '🛋️', ['sofa', 'couch', 'sofá', 'canapé', 'divano', 'living room', 'sala']],
    ['chair', 'Cadeira', '🪑', ['chair', 'cadeira', 'silla', 'chaise', 'sedia', 'stuhl', 'стул']],
    ['table', 'Mesa', '🪵', ['table', 'mesa', 'tavolo', 'tisch', 'стол']],
    ['kitchen', 'Cozinha', '🍳', ['kitchen', 'cozinha', 'cocina', 'cuisine', 'cucina', 'küche', 'кухня', 'cook', 'cozinhar']],
    ['bathroom', 'Banheiro', '🚿', ['bathroom', 'shower', 'banheiro', 'chuveiro', 'baño', 'douche', 'bagno', 'bad']],
    ['key', 'Chave', '🔑', ['key', 'chave', 'llave', 'clé', 'chiave', 'schlüssel', 'ключ']],
    ['door', 'Porta', '🚪', ['door', 'porta', 'puerta', 'porte', 'tür', 'дверь']],
    ['window', 'Janela', '🪟', ['window', 'janela', 'ventana', 'fenêtre', 'finestra', 'fenster', 'окно']],
    ['lamp', 'Lâmpada', '💡', ['lamp', 'light', 'lâmpada', 'luz', 'lámpara', 'lumière', 'luce', 'licht']],
    ['clock', 'Relógio', '🕰️', ['clock', 'time', 'relógio', 'hora', 'reloj', 'horloge', 'orologio', 'uhr', 'время']],
    ['mirror', 'Espelho', '🪞', ['mirror', 'espelho', 'espejo', 'miroir', 'specchio', 'spiegel']],
    ['broom', 'Vassoura', '🧹', ['clean', 'limpar', 'limpeza', 'broom', 'vassoura', 'limpiar', 'nettoyer']],
    ['laundry', 'Lavanderia', '🧺', ['laundry', 'wash', 'lavar', 'lavanderia', 'ropa', 'lessive']],
    ['garden', 'Jardim', '🪴', ['garden', 'plant', 'jardim', 'planta', 'jardín', 'jardin', 'giardino', 'garten']],
    ['fridge', 'Geladeira', '🧊', ['fridge', 'refrigerator', 'geladeira', 'nevera', 'frigo', 'kühlschrank']],
    ['tv', 'Televisão', '📺', ['tv', 'television', 'televisão', 'televisor', 'télévision', 'fernseher']],
    ['trash', 'Lixo', '🗑️', ['trash', 'garbage', 'lixo', 'basura', 'poubelle', 'rifiuti', 'müll']],
  ],
  work: [
    ['office', 'Escritório', '💼', ['office', 'work', 'job', 'escritório', 'trabalho', 'emprego', 'oficina', 'trabajo', 'bureau', 'travail', 'lavoro', 'arbeit', 'работа']],
    ['meeting', 'Reunião', '🤝', ['meeting', 'reunião', 'reunión', 'réunion', 'riunione', 'besprechung', 'встреча', 'handshake']],
    ['calendar', 'Agenda', '📅', ['calendar', 'schedule', 'agenda', 'calendário', 'horario', 'calendrier', 'termin']],
    ['email', 'E-mail', '📧', ['email', 'e-mail', 'mail', 'message', 'mensagem', 'correo', 'courriel']],
    ['presentation', 'Apresentação', '📊', ['presentation', 'apresentação', 'slide', 'pitch', 'presentación', 'présentation']],
    ['interview', 'Entrevista', '🎙️', ['interview', 'entrevista', 'entretien', 'colloquio', 'vorstellungsgespräch']],
    ['resume', 'Currículo', '📄', ['resume', 'cv', 'currículo', 'document', 'documento', 'file', 'arquivo']],
    ['deadline', 'Prazo', '⏳', ['deadline', 'prazo', 'plazo', 'délai', 'scadenza', 'frist']],
    ['team', 'Equipe', '👥', ['team', 'equipe', 'time', 'equipo', 'équipe', 'squadra', 'colleague', 'colega']],
    ['boss', 'Gerente', '👔', ['boss', 'manager', 'leader', 'chefe', 'gerente', 'líder', 'jefe', 'patron', 'diretor']],
    ['factory', 'Fábrica', '🏭', ['factory', 'industry', 'fábrica', 'indústria', 'fábrica', 'usine']],
    ['tools', 'Ferramentas', '🛠️', ['tool', 'tools', 'repair', 'ferramenta', 'conserto', 'herramienta', 'outil']],
    ['delivery', 'Entrega', '📦', ['delivery', 'package', 'box', 'entrega', 'pacote', 'caixa', 'paquete', 'colis']],
    ['phone-call', 'Ligação', '📞', ['call', 'phone', 'ligação', 'telefonema', 'chamada', 'llamada', 'appel']],
    ['notebook-work', 'Caderno de Notas', '🗒️', ['note', 'notes', 'anotação', 'memo', 'nota']],
    ['badge', 'Crachá', '🪪', ['badge', 'id', 'crachá', 'identificação', 'employee', 'funcionário']],
    ['goal', 'Meta', '🎯', ['goal', 'target', 'meta', 'objetivo', 'aim', 'but', 'ziel']],
    ['promotion', 'Promoção', '🚀', ['promotion', 'career', 'promoção', 'carreira', 'ascenso', 'crescimento']],
    ['printer', 'Impressora', '🖨️', ['printer', 'print', 'impressora', 'imprimir', 'impresora', 'imprimer']],
    ['folder', 'Pasta', '📁', ['folder', 'pasta', 'carpeta', 'dossier', 'cartella', 'ordner']],
  ],
  health: [
    ['doctor', 'Médico', '🩺', ['doctor', 'physician', 'médico', 'doutor', 'médica', 'médecin', 'dottore', 'arzt', 'врач']],
    ['hospital', 'Hospital', '🏥', ['hospital', 'clinic', 'clínica', 'clínica', 'hôpital', 'ospedale', 'krankenhaus']],
    ['medicine', 'Remédio', '💊', ['medicine', 'pill', 'drug', 'remédio', 'medicamento', 'medicina', 'médicament', 'medikament']],
    ['ambulance', 'Ambulância', '🚑', ['ambulance', 'emergency', 'ambulância', 'emergência', 'urgência', 'emergencia']],
    ['heart', 'Coração', '❤️', ['heart', 'coração', 'corazón', 'coeur', 'cuore', 'herz', 'сердце']],
    ['tooth', 'Dente', '🦷', ['tooth', 'dentist', 'dente', 'dentista', 'diente', 'dent', 'zahn']],
    ['thermometer', 'Febre', '🤒', ['fever', 'sick', 'ill', 'febre', 'doente', 'enfermo', 'malade', 'krank']],
    ['bandage', 'Curativo', '🩹', ['bandage', 'injury', 'pain', 'curativo', 'dor', 'dolor', 'douleur', 'schmerz']],
    ['vaccine', 'Vacina', '💉', ['vaccine', 'injection', 'vacina', 'injeção', 'vacuna', 'vaccin', 'impfung']],
    ['eye', 'Olho', '👁️', ['eye', 'vision', 'olho', 'visão', 'ojo', 'oeil', 'occhio', 'auge']],
    ['ear', 'Ouvido', '👂', ['ear', 'hear', 'listen', 'ouvido', 'orelha', 'ouvir', 'oído', 'oreille']],
    ['brain', 'Cérebro', '🧠', ['brain', 'mind', 'mental', 'cérebro', 'mente', 'cerebro', 'cerveau', 'gehirn']],
    ['bone', 'Osso', '🦴', ['bone', 'osso', 'hueso', 'os', 'knochen']],
    ['mask', 'Máscara', '😷', ['mask', 'flu', 'cold', 'máscara', 'gripe', 'resfriado']],
    ['pharmacy', 'Farmácia', '⚕️', ['pharmacy', 'farmácia', 'farmacia', 'pharmacie', 'apotheke']],
    ['sleep-health', 'Descanso', '😴', ['rest', 'tired', 'sleep', 'descanso', 'cansado', 'cansada', 'fatigue']],
    ['apple-health', 'Nutrição', '🥦', ['nutrition', 'diet', 'healthy', 'nutrição', 'dieta', 'saudável', 'saúde', 'health', 'salud', 'santé']],
    ['yoga', 'Bem-estar', '🧘', ['wellness', 'meditation', 'calm', 'bem-estar', 'meditação', 'relaxar']],
    ['wheelchair', 'Acessibilidade', '♿', ['accessibility', 'wheelchair', 'acessibilidade', 'cadeira de rodas']],
    ['blood', 'Exame de Sangue', '🩸', ['blood', 'test', 'sangue', 'exame', 'sangre', 'sang', 'blut']],
  ],
  city: [
    ['city', 'Cidade', '🏙️', ['city', 'town', 'cidade', 'ciudad', 'ville', 'città', 'stadt', 'город']],
    ['street', 'Rua', '🛣️', ['street', 'road', 'avenue', 'rua', 'avenida', 'estrada', 'calle', 'rue', 'strada', 'straße']],
    ['bridge', 'Ponte', '🌉', ['bridge', 'ponte', 'puente', 'pont', 'brücke', 'мост']],
    ['park', 'Parque', '🏞️', ['park', 'square', 'parque', 'praça', 'plaza', 'parc', 'parco']],
    ['bank-building', 'Banco', '🏦', ['bank', 'banco', 'banque', 'banca']],
    ['supermarket', 'Supermercado', '🛒', ['supermarket', 'market', 'shop', 'store', 'supermercado', 'mercado', 'loja', 'tienda', 'magasin', 'negozio', 'geschäft']],
    ['bakery', 'Padaria', '🥐', ['bakery', 'padaria', 'panadería', 'boulangerie', 'panetteria', 'bäckerei']],
    ['cafe-place', 'Cafeteria', '🏪', ['cafe', 'coffee shop', 'cafeteria', 'lanchonete', 'bistro']],
    ['library', 'Biblioteca', '🏛️', ['library', 'museum', 'biblioteca', 'museu', 'museo', 'musée']],
    ['post-office', 'Correios', '📮', ['post', 'mail', 'correio', 'correios', 'letter', 'carta', 'brief']],
    ['police-station', 'Delegacia', '🚓', ['police', 'polícia', 'policía', 'polizei', 'полиция']],
    ['fire-station', 'Bombeiros', '🚒', ['firefighter', 'fire', 'bombeiro', 'bombeiros', 'fogo', 'incêndio']],
    ['church', 'Igreja', '⛪', ['church', 'cathedral', 'igreja', 'catedral', 'iglesia', 'église', 'chiesa', 'kirche']],
    ['stadium', 'Estádio', '🏟️', ['stadium', 'estádio', 'estadio', 'stade', 'stadio']],
    ['traffic-light', 'Semáforo', '🚦', ['traffic', 'signal', 'trânsito', 'semáforo', 'tráfico', 'circulation']],
    ['crosswalk', 'Faixa de Pedestres', '🚸', ['pedestrian', 'crosswalk', 'pedestre', 'atravessar', 'cross']],
    ['neighborhood', 'Bairro', '🏘️', ['neighborhood', 'bairro', 'barrio', 'quartier', 'quartiere']],
    ['skyscraper', 'Arranha-céu', '🌆', ['downtown', 'center', 'centro', 'edificio', 'prédio', 'building']],
    ['fountain', 'Fonte', '⛲', ['fountain', 'fonte', 'fuente', 'fontaine', 'fontana']],
    ['cinema-place', 'Cinema', '🎬', ['cinema', 'movie', 'theater', 'teatro', 'filme', 'película', 'film']],
  ],
  nature: [
    ['sun', 'Sol', '☀️', ['sun', 'sunny', 'sol', 'ensolarado', 'soleil', 'sole', 'sonne', 'солнце']],
    ['rain', 'Chuva', '🌧️', ['rain', 'rainy', 'chuva', 'lluvia', 'pluie', 'pioggia', 'regen', 'дождь']],
    ['cloud', 'Nuvem', '☁️', ['cloud', 'cloudy', 'nuvem', 'nublado', 'nube', 'nuage', 'nuvola', 'wolke']],
    ['snow', 'Neve', '❄️', ['snow', 'cold', 'winter', 'neve', 'frio', 'inverno', 'nieve', 'neige', 'neve', 'schnee', 'снег']],
    ['wind', 'Vento', '💨', ['wind', 'windy', 'vento', 'viento', 'vent', 'vento', 'windig']],
    ['storm', 'Tempestade', '⛈️', ['storm', 'thunder', 'lightning', 'tempestade', 'trovão', 'tormenta', 'orage']],
    ['tree', 'Árvore', '🌳', ['tree', 'forest', 'árvore', 'floresta', 'árbol', 'bosque', 'arbre', 'forêt', 'albero', 'baum', 'дерево']],
    ['flower', 'Flor', '🌸', ['flower', 'flor', 'fleur', 'fiore', 'blume', 'цветок']],
    ['mountain', 'Montanha', '⛰️', ['mountain', 'hill', 'montanha', 'serra', 'montaña', 'montagne', 'montagna', 'berg', 'гора']],
    ['ocean', 'Mar', '🌊', ['ocean', 'sea', 'wave', 'oceano', 'mar', 'onda', 'océano', 'mer', 'mare', 'meer', 'море']],
    ['river', 'Rio', '🏞️', ['river', 'lake', 'rio', 'lago', 'río', 'fleuve', 'fiume', 'fluss', 'река']],
    ['moon', 'Lua', '🌙', ['moon', 'night', 'lua', 'noite', 'luna', 'noche', 'lune', 'nuit', 'mond', 'nacht']],
    ['star', 'Estrela', '⭐', ['star', 'sky', 'estrela', 'céu', 'estrella', 'cielo', 'étoile', 'ciel', 'stern']],
    ['earth', 'Planeta Terra', '🌍', ['earth', 'world', 'planet', 'terra', 'mundo', 'planeta', 'tierra', 'terre', 'welt', 'мир']],
    ['fire', 'Fogo', '🔥', ['fire', 'hot', 'heat', 'fogo', 'calor', 'quente', 'fuego', 'feu', 'fuoco', 'feuer']],
    ['dog', 'Cachorro', '🐶', ['dog', 'puppy', 'cachorro', 'cão', 'perro', 'chien', 'cane', 'hund', 'собака', '犬']],
    ['cat', 'Gato', '🐱', ['cat', 'kitten', 'gato', 'chat', 'gatto', 'katze', 'кошка', '猫']],
    ['bird', 'Pássaro', '🐦', ['bird', 'pássaro', 'ave', 'pájaro', 'oiseau', 'uccello', 'vogel', 'птица']],
    ['horse', 'Cavalo', '🐴', ['horse', 'cavalo', 'caballo', 'cheval', 'cavallo', 'pferd', 'лошадь']],
    ['leaf', 'Folha', '🍃', ['leaf', 'autumn', 'fall', 'folha', 'outono', 'hoja', 'feuille', 'foglia', 'blatt']],
  ],
  tech: [
    ['laptop', 'Notebook', '💻', ['laptop', 'computer', 'computador', 'notebook', 'ordenador', 'ordinateur', 'компьютер']],
    ['smartphone', 'Celular', '📱', ['phone', 'smartphone', 'mobile', 'celular', 'móvil', 'téléphone', 'handy', 'телефон']],
    ['wifi', 'Wi-Fi', '📶', ['wifi', 'internet', 'network', 'rede', 'conexão', 'conexión', 'réseau']],
    ['robot', 'Inteligência Artificial', '🤖', ['ai', 'robot', 'robô', 'inteligência artificial', 'automation', 'automação']],
    ['code', 'Programação', '🧑‍💻', ['code', 'software', 'program', 'developer', 'código', 'programação', 'desenvolvedor']],
    ['database', 'Dados', '🗄️', ['data', 'database', 'dados', 'banco de dados', 'server', 'servidor']],
    ['cloud-tech', 'Nuvem', '☁️', ['cloud', 'upload', 'download', 'nuvem', 'baixar', 'enviar']],
    ['lock-tech', 'Segurança', '🔒', ['security', 'password', 'lock', 'segurança', 'senha', 'contraseña', 'mot de passe']],
    ['battery', 'Bateria', '🔋', ['battery', 'charge', 'bateria', 'carregar', 'batería', 'batterie']],
    ['headphones', 'Fone de Ouvido', '🎧', ['headphones', 'audio', 'podcast', 'fone', 'áudio', 'auriculares', 'écouteurs']],
    ['microphone', 'Microfone', '🎤', ['microphone', 'voice', 'speak', 'microfone', 'voz', 'micrófono', 'micro']],
    ['keyboard', 'Teclado', '⌨️', ['keyboard', 'type', 'teclado', 'digitar', 'teclear', 'clavier']],
    ['mouse', 'Mouse', '🖱️', ['mouse', 'click', 'clicar', 'rato', 'ratón', 'souris']],
    ['search', 'Busca', '🔍', ['search', 'find', 'buscar', 'pesquisar', 'procurar', 'buscar', 'chercher']],
    ['settings', 'Configurações', '⚙️', ['settings', 'config', 'gear', 'configurações', 'ajustes', 'paramètres']],
    ['bug', 'Erro / Bug', '🐛', ['bug', 'error', 'erro', 'falha', 'issue', 'problema']],
    ['chip', 'Processador', '💾', ['chip', 'hardware', 'memory', 'memória', 'disk', 'disco']],
    ['satellite', 'Satélite', '📡', ['satellite', 'gps', 'signal', 'satélite', 'sinal']],
    ['vr', 'Realidade Virtual', '🥽', ['vr', 'virtual', 'simulation', 'simulação']],
    ['bell-notif', 'Notificação', '🔔', ['notification', 'alert', 'bell', 'notificação', 'alerta', 'aviso']],
  ],
  people: [
    ['family', 'Família', '👨‍👩‍👧‍👦', ['family', 'família', 'familia', 'famille', 'famiglia', 'familie', 'семья']],
    ['friend', 'Amigo', '🧑‍🤝‍🧑', ['friend', 'friends', 'amigo', 'amiga', 'amigos', 'ami', 'amico', 'freund', 'друг']],
    ['baby', 'Bebê', '👶', ['baby', 'child', 'kid', 'bebê', 'criança', 'bebé', 'niño', 'enfant', 'bambino', 'kind']],
    ['parents', 'Pais', '👪', ['mother', 'father', 'mom', 'dad', 'mãe', 'pai', 'pais', 'madre', 'padre', 'mère', 'père']],
    ['grandparents', 'Avós', '👴', ['grandmother', 'grandfather', 'avó', 'avô', 'avós', 'abuelo', 'abuela']],
    ['couple', 'Casal', '💑', ['couple', 'partner', 'husband', 'wife', 'casal', 'marido', 'esposa', 'namorado']],
    ['neighbor', 'Vizinho', '🙋', ['neighbor', 'vizinho', 'vecino', 'voisin', 'vicino', 'nachbar']],
    ['teacher', 'Professor', '🧑‍🏫', ['teacher', 'professor', 'professora', 'profesor', 'enseignant', 'insegnante', 'lehrer']],
    ['student', 'Estudante', '🧑‍🎓', ['student', 'learner', 'aluno', 'estudante', 'estudiante', 'étudiant', 'studente']],
    ['chef', 'Chef', '🧑‍🍳', ['chef', 'cook', 'cozinheiro', 'cozinheira', 'cocinero', 'cuisinier']],
    ['artist', 'Artista', '🧑‍🎨', ['artist', 'painter', 'artista', 'pintor', 'peintre']],
    ['pilot', 'Piloto', '🧑‍✈️', ['pilot', 'captain', 'piloto', 'capitão', 'pilote']],
    ['scientist', 'Cientista', '🧑‍🔬', ['scientist', 'researcher', 'cientista', 'pesquisador', 'científico']],
    ['farmer', 'Agricultor', '🧑‍🌾', ['farmer', 'agricultor', 'fazendeiro', 'granjero', 'fermier']],
    ['singer', 'Cantor', '🧑‍🎤', ['singer', 'musician', 'cantor', 'músico', 'cantante', 'chanteur']],
    ['astronaut', 'Astronauta', '🧑‍🚀', ['astronaut', 'space', 'astronauta', 'espaço']],
    ['greeting', 'Saudação', '👋', ['hello', 'hi', 'goodbye', 'bye', 'olá', 'oi', 'tchau', 'hola', 'bonjour', 'ciao', 'hallo', 'привет']],
    ['crowd', 'Pessoas', '🗣️', ['people', 'person', 'pessoa', 'pessoas', 'gente', 'persona', 'personne', 'leute', 'люди']],
    ['woman', 'Mulher', '👩', ['woman', 'girl', 'lady', 'mulher', 'menina', 'mujer', 'femme', 'donna', 'frau']],
    ['man', 'Homem', '👨', ['man', 'boy', 'gentleman', 'homem', 'menino', 'hombre', 'homme', 'uomo', 'mann']],
  ],
  emotions: [
    ['happy', 'Feliz', '😊', ['happy', 'joy', 'glad', 'feliz', 'alegre', 'contente', 'feliz', 'heureux', 'felice', 'glücklich', 'счастливый']],
    ['sad', 'Triste', '😢', ['sad', 'cry', 'triste', 'chorar', 'triste', 'tristesse', 'traurig', 'грустный']],
    ['angry', 'Bravo', '😠', ['angry', 'mad', 'bravo', 'raiva', 'enojado', 'fâché', 'arrabbiato', 'wütend']],
    ['love', 'Amor', '😍', ['love', 'like', 'amor', 'amar', 'gostar', 'amar', 'amour', 'amore', 'liebe', 'любовь']],
    ['surprised', 'Surpreso', '😮', ['surprised', 'wow', 'shock', 'surpreso', 'surpresa', 'sorpresa', 'surpris']],
    ['laugh', 'Riso', '😂', ['laugh', 'funny', 'smile', 'rir', 'sorrir', 'engraçado', 'reír', 'rire', 'lachen']],
    ['worried', 'Preocupado', '😟', ['worried', 'anxious', 'nervous', 'preocupado', 'ansioso', 'nervoso', 'preocupado', 'inquiet']],
    ['scared', 'Assustado', '😨', ['scared', 'afraid', 'fear', 'medo', 'assustado', 'miedo', 'peur', 'paura', 'angst']],
    ['calm', 'Calmo', '😌', ['calm', 'peace', 'relaxed', 'calmo', 'paz', 'tranquilo', 'calme', 'ruhig']],
    ['confused', 'Confuso', '😕', ['confused', 'doubt', 'confuso', 'dúvida', 'duda', 'confus', 'verwirrt']],
    ['proud', 'Orgulhoso', '🥳', ['proud', 'celebrate', 'party', 'orgulhoso', 'festa', 'celebrar', 'fiesta', 'fête']],
    ['bored', 'Entediado', '😑', ['bored', 'boring', 'entediado', 'chato', 'aburrido', 'ennuyé', 'langweilig']],
    ['excited', 'Animado', '🤩', ['excited', 'amazing', 'animado', 'empolgado', 'incrível', 'emocionado']],
    ['grateful', 'Grato', '🙏', ['thank', 'thanks', 'grateful', 'obrigado', 'obrigada', 'agradecido', 'gracias', 'merci', 'grazie', 'danke', 'спасибо']],
    ['thinking', 'Pensativo', '🤔', ['think', 'idea', 'pensar', 'ideia', 'pensamiento', 'penser', 'denken']],
    ['sorry', 'Desculpa', '😔', ['sorry', 'apologize', 'desculpa', 'perdão', 'perdón', 'pardon', 'scusa', 'entschuldigung']],
    ['confident', 'Confiante', '😎', ['confident', 'cool', 'confiante', 'seguro', 'confiant']],
    ['curious', 'Curioso', '🧐', ['curious', 'wonder', 'curioso', 'curiosidade']],
    ['hope', 'Esperança', '🌟', ['hope', 'wish', 'dream', 'esperança', 'sonho', 'desejo', 'esperanza', 'espoir']],
    ['hug', 'Abraço', '🫂', ['hug', 'care', 'abraço', 'carinho', 'abrazo', 'câlin']],
  ],
  finance: [
    ['money', 'Dinheiro', '💵', ['money', 'cash', 'dinheiro', 'dinero', 'argent', 'soldi', 'geld', 'деньги']],
    ['credit-card', 'Cartão', '💳', ['card', 'credit', 'debit', 'cartão', 'crédito', 'tarjeta', 'carte', 'carta']],
    ['coin', 'Moeda', '🪙', ['coin', 'price', 'cost', 'moeda', 'preço', 'custo', 'moneda', 'precio', 'pièce']],
    ['wallet', 'Carteira', '👛', ['wallet', 'purse', 'carteira', 'billetera', 'portefeuille', 'portafoglio']],
    ['savings', 'Poupança', '🐷', ['save', 'savings', 'economizar', 'poupança', 'ahorrar', 'épargner', 'sparen']],
    ['chart-up', 'Lucro', '📈', ['profit', 'growth', 'invest', 'lucro', 'crescimento', 'investir', 'ganancia', 'rendimento']],
    ['chart-down', 'Prejuízo', '📉', ['loss', 'drop', 'crisis', 'prejuízo', 'queda', 'crise', 'pérdida']],
    ['receipt', 'Recibo', '🧾', ['receipt', 'bill', 'invoice', 'recibo', 'conta', 'fatura', 'factura', 'reçu', 'rechnung']],
    ['tax', 'Imposto', '🏛️', ['tax', 'taxes', 'imposto', 'taxa', 'impuesto', 'impôt', 'steuer']],
    ['budget', 'Orçamento', '🧮', ['budget', 'accounting', 'orçamento', 'contabilidade', 'presupuesto', 'comptabilité']],
    ['shopping-bag', 'Compras', '🛍️', ['buy', 'sell', 'shop', 'comprar', 'vender', 'compras', 'comprar', 'acheter', 'kaufen']],
    ['discount', 'Desconto', '🏷️', ['discount', 'sale', 'cheap', 'expensive', 'desconto', 'promoção', 'barato', 'caro']],
    ['salary', 'Salário', '💰', ['salary', 'wage', 'income', 'pay', 'salário', 'pagamento', 'pagar', 'sueldo', 'salaire']],
    ['loan', 'Empréstimo', '🤝', ['loan', 'debt', 'mortgage', 'empréstimo', 'dívida', 'préstamo', 'prêt']],
    ['vault', 'Cofre', '🔐', ['safe', 'vault', 'cofre', 'seguro', 'reserva']],
    ['diamond', 'Valor', '💎', ['value', 'wealth', 'luxury', 'valor', 'riqueza', 'luxo']],
    ['stock-market', 'Bolsa de Valores', '💹', ['stock', 'market', 'trade', 'ações', 'mercado', 'bolsa', 'comércio']],
    ['contract-fin', 'Acordo Financeiro', '✍️', ['deal', 'agreement', 'acordo', 'negócio', 'negocio', 'accord']],
    ['calculator', 'Calculadora', '🔢', ['number', 'count', 'calculate', 'número', 'contar', 'calcular', 'math']],
    ['gift', 'Presente', '🎁', ['gift', 'present', 'presente', 'regalo', 'cadeau', 'geschenk']],
  ],
  law: [
    ['scales', 'Justiça', '⚖️', ['justice', 'law', 'legal', 'justiça', 'lei', 'direito', 'justicia', 'ley', 'loi', 'giustizia', 'recht']],
    ['judge', 'Juiz', '👨‍⚖️', ['judge', 'court', 'trial', 'juiz', 'tribunal', 'julgamento', 'juez', 'juge', 'richter']],
    ['gavel', 'Sentença', '🔨', ['verdict', 'sentence', 'rule', 'sentença', 'regra', 'norma', 'veredicto']],
    ['contract', 'Contrato', '📜', ['contract', 'terms', 'policy', 'contrato', 'termos', 'política', 'cláusula']],
    ['signature', 'Assinatura', '🖋️', ['sign', 'signature', 'assinar', 'assinatura', 'firmar', 'firma', 'signer']],
    ['shield-law', 'Proteção', '🛡️', ['protect', 'rights', 'safety', 'proteger', 'direitos', 'segurança', 'derechos']],
    ['handcuffs', 'Crime', '🚨', ['crime', 'arrest', 'illegal', 'crime', 'prisão', 'ilegal', 'delito']],
    ['vote', 'Voto', '🗳️', ['vote', 'election', 'democracy', 'votar', 'voto', 'eleição', 'democracia', 'elección']],
    ['flag-gov', 'Governo', '🏛️', ['government', 'state', 'nation', 'governo', 'estado', 'nação', 'gobierno', 'gouvernement']],
    ['permit', 'Licença', '🪪', ['license', 'permit', 'licença', 'autorização', 'permiso']],
    ['witness', 'Testemunha', '🗣️', ['witness', 'testimony', 'testemunha', 'depoimento', 'testigo']],
    ['lawyer', 'Advogado', '💼', ['lawyer', 'attorney', 'advogado', 'advogada', 'abogado', 'avocat', 'anwalt']],
    ['constitution', 'Constituição', '📘', ['constitution', 'statute', 'constituição', 'estatuto']],
    ['border', 'Fronteira', '🚧', ['border', 'limit', 'fronteira', 'limite', 'frontera', 'frontière']],
    ['tax-law', 'Regulamento', '📋', ['regulation', 'compliance', 'regulamento', 'conformidade', 'normativa']],
    ['copyright', 'Propriedade Intelectual', '©️', ['copyright', 'patent', 'patente', 'autor']],
    ['ban', 'Proibição', '🚫', ['ban', 'forbid', 'proibido', 'proibir', 'prohibido', 'interdit', 'verboten']],
    ['check-law', 'Aprovado', '✅', ['approve', 'valid', 'allowed', 'aprovado', 'válido', 'permitido']],
    ['warning-law', 'Aviso Legal', '⚠️', ['warning', 'danger', 'risk', 'aviso', 'perigo', 'risco', 'peligro']],
    ['archive-law', 'Arquivo Público', '🗄️', ['record', 'registry', 'registro', 'cartório', 'archivo']],
  ],
  science: [
    ['atom', 'Átomo', '⚛️', ['atom', 'physics', 'energy', 'átomo', 'física', 'energia', 'física', 'physique']],
    ['microscope', 'Microscópio', '🔬', ['microscope', 'biology', 'cell', 'microscópio', 'biologia', 'célula', 'lab']],
    ['test-tube', 'Química', '🧪', ['chemistry', 'experiment', 'química', 'experimento', 'laboratório', 'chimie']],
    ['dna', 'Genética', '🧬', ['dna', 'gene', 'genetics', 'genética', 'evolução', 'evolution']],
    ['telescope', 'Astronomia', '🔭', ['telescope', 'astronomy', 'universe', 'telescópio', 'astronomia', 'universo']],
    ['rocket', 'Espaço', '🚀', ['rocket', 'space', 'launch', 'foguete', 'espaço', 'lançamento', 'cohete']],
    ['magnet', 'Magnetismo', '🧲', ['magnet', 'force', 'gravity', 'ímã', 'força', 'gravidade']],
    ['solar-panel', 'Energia Solar', '🔆', ['solar', 'renewable', 'sustainability', 'sustentável', 'renovável']],
    ['recycle', 'Reciclagem', '♻️', ['recycle', 'ecology', 'environment', 'reciclar', 'ecologia', 'meio ambiente']],
    ['volcano', 'Geologia', '🌋', ['volcano', 'geology', 'climate', 'vulcão', 'geologia', 'clima', 'weather']],
    ['gear-sci', 'Engenharia', '⚙️', ['engineering', 'machine', 'engenharia', 'máquina', 'ingeniería']],
    ['compass-sci', 'Geometria', '📐', ['math', 'geometry', 'formula', 'matemática', 'geometria', 'fórmula']],
    ['battery-sci', 'Eletricidade', '⚡', ['electricity', 'electric', 'power', 'eletricidade', 'elétrico', 'potência']],
    ['thermometer-sci', 'Temperatura', '🌡️', ['temperature', 'degree', 'temperatura', 'grau', 'grados']],
    ['drop-sci', 'Substância', '💧', ['liquid', 'solid', 'gas', 'líquido', 'sólido', 'gás']],
    ['fossil', 'História Natural', '🦕', ['fossil', 'history', 'dinosaur', 'fóssil', 'pré-história']],
    ['satellite-sci', 'Órbita', '🛰️', ['orbit', 'radar', 'órbita', 'espacial']],
    ['bulb-sci', 'Descoberta', '💡', ['discovery', 'invention', 'theory', 'descoberta', 'invenção', 'teoria']],
    ['petri', 'Pesquisa', '🧫', ['research', 'study', 'pesquisa', 'estudo', 'investigación']],
    ['barometer', 'Meteorologia', '🌦️', ['forecast', 'climate change', 'previsão', 'mudança climática']],
  ],
  culture: [
    ['music', 'Música', '🎵', ['music', 'song', 'melody', 'música', 'canção', 'música', 'musique', 'musica', 'musik', 'музыка']],
    ['guitar', 'Violão', '🎸', ['guitar', 'instrument', 'band', 'violão', 'guitarra', 'banda']],
    ['piano', 'Piano', '🎹', ['piano', 'concert', 'concerto', 'show']],
    ['art', 'Arte', '🎨', ['art', 'paint', 'draw', 'arte', 'pintura', 'desenho', 'pintar', 'dibujar', 'peindre']],
    ['theater', 'Teatro', '🎭', ['theater', 'drama', 'actor', 'teatro', 'ator', 'atriz', 'drama']],
    ['book-culture', 'Literatura', '📚', ['literature', 'novel', 'story', 'literatura', 'romance', 'história', 'cuento']],
    ['dance', 'Dança', '💃', ['dance', 'party', 'dança', 'dançar', 'baile', 'bailar', 'danser', 'tanzen']],
    ['festival', 'Festival', '🎉', ['festival', 'carnival', 'tradition', 'festival', 'carnaval', 'tradição', 'cultura', 'culture']],
    ['temple', 'Patrimônio', '🏯', ['temple', 'monument', 'castle', 'templo', 'monumento', 'castelo', 'palácio']],
    ['statue', 'Escultura', '🗽', ['statue', 'sculpture', 'estátua', 'escultura']],
    ['film', 'Filme', '🎞️', ['movie', 'cinema', 'series', 'filme', 'série', 'película']],
    ['radio', 'Rádio', '📻', ['radio', 'news', 'broadcast', 'rádio', 'notícias', 'noticias']],
    ['newspaper', 'Jornal', '📰', ['newspaper', 'magazine', 'article', 'jornal', 'revista', 'artigo', 'periódico']],
    ['food-culture', 'Gastronomia', '🥘', ['cuisine', 'recipe', 'culinária', 'receita', 'gastronomia']],
    ['language', 'Idioma', '🗣️', ['language', 'accent', 'idioma', 'língua', 'sotaque', 'idioma', 'langue', 'sprache']],
    ['religion', 'Espiritualidade', '🕊️', ['peace', 'tradition', 'belief', 'religião', 'crença', 'espiritualidade']],
    ['trophy-art', 'Prêmio', '🏆', ['award', 'prize', 'prêmio', 'premio', 'prix']],
    ['ticket-show', 'Espetáculo', '🎟️', ['show', 'concert', 'exhibition', 'exposição', 'espetáculo']],
    ['lantern', 'Celebração', '🏮', ['lantern', 'new year', 'ano novo', 'lanterna']],
    ['camera-art', 'Fotografia', '📸', ['photography', 'portrait', 'retrato', 'fotografia']],
  ],
  clothes: [
    ['shirt', 'Camisa', '👕', ['shirt', 't-shirt', 'camisa', 'camiseta', 'camisa', 'chemise', 'camicia', 'hemd']],
    ['pants', 'Calça', '👖', ['pants', 'jeans', 'trousers', 'calça', 'pantalón', 'pantalon', 'hose']],
    ['dress', 'Vestido', '👗', ['dress', 'skirt', 'vestido', 'saia', 'falda', 'robe', 'kleid']],
    ['shoes', 'Sapatos', '👟', ['shoe', 'shoes', 'sneakers', 'sapato', 'sapatos', 'tênis', 'zapato', 'chaussure', 'schuh']],
    ['coat', 'Casaco', '🧥', ['coat', 'jacket', 'casaco', 'jaqueta', 'abrigo', 'manteau', 'mantel']],
    ['hat', 'Chapéu', '👒', ['hat', 'cap', 'chapéu', 'boné', 'sombrero', 'chapeau', 'hut']],
    ['glasses', 'Óculos', '👓', ['glasses', 'sunglasses', 'óculos', 'gafas', 'lunettes', 'occhiali', 'brille']],
    ['watch', 'Relógio de Pulso', '⌚', ['watch', 'relógio', 'reloj', 'montre', 'orologio']],
    ['bag', 'Bolsa', '👜', ['bag', 'handbag', 'bolsa', 'sac', 'borsa', 'tasche']],
    ['socks', 'Meias', '🧦', ['socks', 'meia', 'meias', 'calcetines', 'chaussettes', 'socken']],
    ['gloves', 'Luvas', '🧤', ['gloves', 'luva', 'luvas', 'guantes', 'gants', 'handschuhe']],
    ['scarf', 'Cachecol', '🧣', ['scarf', 'cachecol', 'bufanda', 'écharpe', 'schal']],
    ['boots', 'Botas', '🥾', ['boots', 'bota', 'botas', 'botas', 'bottes', 'stiefel']],
    ['tie', 'Gravata', '👔', ['tie', 'suit', 'gravata', 'terno', 'corbata', 'cravate', 'anzug']],
    ['ring', 'Anel', '💍', ['ring', 'jewelry', 'anel', 'joia', 'anillo', 'bague']],
    ['umbrella', 'Guarda-chuva', '☂️', ['umbrella', 'guarda-chuva', 'paraguas', 'parapluie', 'regenschirm']],
    ['swimsuit', 'Roupa de Banho', '🩱', ['swimsuit', 'bikini', 'maiô', 'sunga', 'biquíni']],
    ['shorts', 'Bermuda', '🩳', ['shorts', 'bermuda', 'pantalones cortos']],
    ['crown', 'Acessório', '👑', ['crown', 'fashion', 'style', 'moda', 'estilo']],
    ['hanger', 'Guarda-roupa', '👚', ['clothes', 'wear', 'roupa', 'vestir', 'ropa', 'vêtements', 'kleidung']],
  ],
  transport: [
    ['car', 'Carro', '🚗', ['car', 'drive', 'carro', 'automóvel', 'dirigir', 'coche', 'auto', 'voiture', 'macchina', 'машина']],
    ['bus', 'Ônibus', '🚌', ['bus', 'ônibus', 'autobús', 'autobus', 'автобус', 'バス']],
    ['train', 'Trem', '🚆', ['train', 'trem', 'tren', 'treno', 'zug', 'поезд', '電車']],
    ['subway', 'Metrô', '🚇', ['subway', 'metro', 'underground', 'metrô', 'metro', 'métro', 'u-bahn']],
    ['airplane', 'Avião', '✈️', ['airplane', 'plane', 'airport', 'avião', 'aeroporto', 'avión', 'avion', 'aereo', 'flugzeug', 'самолёт']],
    ['bicycle', 'Bicicleta', '🚲', ['bicycle', 'bike', 'bicicleta', 'bici', 'vélo', 'fahrrad']],
    ['motorcycle', 'Moto', '🏍️', ['motorcycle', 'motorbike', 'moto', 'motocicleta']],
    ['taxi', 'Táxi', '🚕', ['taxi', 'cab', 'uber', 'táxi']],
    ['boat', 'Barco', '⛵', ['boat', 'ship', 'sail', 'barco', 'navio', 'bateau', 'barca', 'boot']],
    ['truck', 'Caminhão', '🚚', ['truck', 'caminhão', 'camión', 'camion', 'lkw']],
    ['helicopter', 'Helicóptero', '🚁', ['helicopter', 'helicóptero', 'helicóptero']],
    ['tram', 'Bonde', '🚊', ['tram', 'streetcar', 'bonde', 'tranvía', 'tramway']],
    ['scooter', 'Patinete', '🛴', ['scooter', 'patinete', 'trottinette']],
    ['fuel', 'Combustível', '⛽', ['gas', 'fuel', 'gasolina', 'combustível', 'posto', 'petrol']],
    ['station', 'Estação', '🚉', ['station', 'platform', 'estação', 'plataforma', 'estación', 'gare', 'bahnhof']],
    ['parking', 'Estacionamento', '🅿️', ['parking', 'park', 'estacionamento', 'estacionar', 'aparcamiento']],
    ['highway', 'Rodovia', '🛣️', ['highway', 'freeway', 'rodovia', 'estrada', 'autopista', 'autoroute']],
    ['anchor', 'Porto', '⚓', ['port', 'harbor', 'anchor', 'porto', 'âncora', 'puerto']],
    ['wheel', 'Roda', '🛞', ['wheel', 'tire', 'roda', 'pneu', 'rueda', 'roue']],
    ['walk', 'A pé', '🚶', ['walk', 'foot', 'andar', 'caminhar', 'a pé', 'caminar', 'marcher', 'gehen']],
  ],
  education: [
    ['book', 'Livro', '📖', ['book', 'read', 'livro', 'ler', 'libro', 'leer', 'livre', 'lire', 'libro', 'buch', 'книга', '本']],
    ['school', 'Escola', '🏫', ['school', 'college', 'escola', 'colégio', 'escuela', 'école', 'scuola', 'schule', 'школа']],
    ['university', 'Universidade', '🎓', ['university', 'degree', 'graduation', 'universidade', 'faculdade', 'formatura', 'universidad', 'université']],
    ['pencil', 'Lápis', '✏️', ['pencil', 'write', 'lápis', 'escrever', 'lápiz', 'escribir', 'crayon', 'stifte']],
    ['pen', 'Caneta', '🖊️', ['pen', 'caneta', 'bolígrafo', 'stylo', 'penna', 'kugelschreiber']],
    ['notebook-edu', 'Caderno', '📓', ['notebook', 'diary', 'caderno', 'diário', 'cuaderno', 'cahier']],
    ['exam', 'Prova', '📝', ['exam', 'test', 'quiz', 'prova', 'exame', 'teste', 'examen', 'prüfung']],
    ['backpack-edu', 'Mochila Escolar', '🎒', ['backpack', 'homework', 'lição de casa', 'tarefa', 'deberes']],
    ['ruler', 'Régua', '📏', ['ruler', 'measure', 'régua', 'medir', 'regla']],
    ['globe', 'Geografia', '🌐', ['geography', 'world', 'geografia', 'país', 'country', 'país', 'pays']],
    ['dictionary', 'Dicionário', '📕', ['dictionary', 'vocabulary', 'word', 'dicionário', 'vocabulário', 'palavra', 'diccionario', 'palabra']],
    ['blackboard', 'Lousa', '🧑‍🏫', ['class', 'lesson', 'classroom', 'aula', 'lição', 'sala de aula', 'clase', 'cours']],
    ['medal-edu', 'Certificado', '🏅', ['certificate', 'diploma', 'certificado', 'diploma', 'aprender', 'learn', 'study', 'estudar']],
    ['bookmark', 'Marcador', '🔖', ['chapter', 'page', 'capítulo', 'página', 'página']],
    ['scissors', 'Tesoura', '✂️', ['scissors', 'cut', 'tesoura', 'cortar', 'tijeras']],
    ['paperclip', 'Clipe', '📎', ['attach', 'paper', 'papel', 'anexo', 'feuille']],
    ['abacus', 'Cálculo', '🧮', ['math', 'number', 'matemática', 'número', 'número']],
    ['megaphone-edu', 'Debate', '📢', ['debate', 'speech', 'discurso', 'falar', 'speak', 'talk']],
    ['question', 'Pergunta', '❓', ['question', 'ask', 'answer', 'pergunta', 'perguntar', 'responder', 'pregunta']],
    ['lightbulb-edu', 'Aprendizado', '💡', ['understand', 'know', 'entender', 'saber', 'conhecer', 'comprender', 'savoir']],
  ],
  sports: [
    ['soccer', 'Futebol', '⚽', ['soccer', 'football', 'futebol', 'fútbol', 'calcio', 'fußball', 'футбол']],
    ['basketball', 'Basquete', '🏀', ['basketball', 'basquete', 'baloncesto', 'basket']],
    ['tennis', 'Tênis', '🎾', ['tennis', 'tênis', 'tenis']],
    ['swimming', 'Natação', '🏊', ['swim', 'swimming', 'pool', 'nadar', 'natação', 'piscina', 'nadar', 'nager', 'schwimmen']],
    ['running', 'Corrida', '🏃', ['run', 'running', 'marathon', 'correr', 'corrida', 'correr', 'courir', 'laufen']],
    ['cycling', 'Ciclismo', '🚴', ['cycling', 'bike', 'ciclismo', 'pedalar']],
    ['gym', 'Academia', '🏋️', ['gym', 'workout', 'exercise', 'academia', 'treino', 'exercício', 'gimnasio', 'sport']],
    ['trophy', 'Troféu', '🏆', ['win', 'champion', 'trophy', 'vencer', 'ganhar', 'campeão', 'troféu', 'ganar', 'gagner']],
    ['medal', 'Medalha', '🥇', ['medal', 'first', 'gold', 'medalha', 'ouro', 'medalla']],
    ['volleyball', 'Vôlei', '🏐', ['volleyball', 'vôlei', 'voleibol']],
    ['baseball', 'Beisebol', '⚾', ['baseball', 'beisebol', 'béisbol']],
    ['golf', 'Golfe', '⛳', ['golf', 'golfe']],
    ['skiing', 'Esqui', '⛷️', ['ski', 'skiing', 'esqui', 'esquiar']],
    ['surfing', 'Surfe', '🏄', ['surf', 'surfing', 'surfe', 'surfar']],
    ['boxing', 'Boxe', '🥊', ['box', 'boxing', 'fight', 'boxe', 'luta']],
    ['climbing', 'Escalada', '🧗', ['climb', 'climbing', 'escalada', 'escalar']],
    ['chess', 'Xadrez', '♟️', ['chess', 'game', 'play', 'xadrez', 'jogo', 'jogar', 'jugar', 'jouer', 'spielen']],
    ['whistle', 'Árbitro', '📣', ['coach', 'referee', 'treinador', 'árbitro', 'juiz']],
    ['hiking', 'Trilha', '🥾', ['hike', 'hiking', 'trail', 'trilha', 'caminhada']],
    ['pingpong', 'Tênis de Mesa', '🏓', ['ping pong', 'table tennis', 'tênis de mesa']],
  ],
};

export const VISUAL_CONCEPTS: VisualConcept[] = (
  Object.entries(RAW_CONCEPTS) as Array<[VisualConceptCategory, RawConcept[]]>
).flatMap(([category, items]) => {
  const palette = CATEGORY_PALETTE[category];
  return items.map(([id, labelPt, emoji, keywords]) => ({
    id,
    category,
    labelPt,
    emoji,
    bgHex: palette.bgHex,
    accentHex: palette.accentHex,
    keywords,
  }));
});

export const VISUAL_CONCEPTS_MAP: Map<string, VisualConcept> = new Map(
  VISUAL_CONCEPTS.map((c) => [c.id, c]),
);

function normalizeTerm(input?: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface KeywordIndexEntry {
  conceptId: string;
  category: VisualConceptCategory;
  normKw: string;
}

const KEYWORD_INDEX: KeywordIndexEntry[] = [];
const EXACT_KEYWORD_MAP = new Map<string, KeywordIndexEntry[]>();

for (const concept of VISUAL_CONCEPTS) {
  const allTerms = [concept.id.replace(/-/g, ' '), concept.labelPt, ...concept.keywords];
  const seenForConcept = new Set<string>();
  for (const term of allTerms) {
    const normKw = normalizeTerm(term);
    if (!normKw || seenForConcept.has(normKw)) continue;
    seenForConcept.add(normKw);
    const entry: KeywordIndexEntry = {
      conceptId: concept.id,
      category: concept.category,
      normKw,
    };
    KEYWORD_INDEX.push(entry);
    const bucket = EXACT_KEYWORD_MAP.get(normKw) ?? [];
    bucket.push(entry);
    EXACT_KEYWORD_MAP.set(normKw, bucket);
  }
}

const CATEGORY_HINT_MAP: Array<[RegExp, VisualConceptCategory]> = [
  [/food|drink|comida|bebida|restaurant|kitchen|culinar|meal|refei/i, 'food'],
  [/travel|viag|hotel|airport|aeroporto|turism|vacat|férias/i, 'travel'],
  [/home|house|casa|lar|room|quarto|cozinha|morad/i, 'home'],
  [/work|job|office|business|trabalh|negóc|carreira|career|escrit/i, 'work'],
  [/health|med|saúde|saude|hospital|doctor|corpo|body/i, 'health'],
  [/city|cidade|urban|street|rua|place|lugar|shop|compr/i, 'city'],
  [/natur|weather|clima|tempo|animal|plant|environ/i, 'nature'],
  [/tech|tecnolog|comput|digital|internet|app|software|ai/i, 'tech'],
  [/people|famil|pessoa|friend|amig|social|greet|sauda/i, 'people'],
  [/emot|feel|sentim|mood|humor/i, 'emotions'],
  [/financ|money|dinheir|bank|banco|econom/i, 'finance'],
  [/law|legal|direit|justiç|polít|gov/i, 'law'],
  [/scien|ciênc|math|matem|energ|space/i, 'science'],
  [/cultur|art|músic|music|histór|mídia|media/i, 'culture'],
  [/cloth|roupa|vest|fashion|moda/i, 'clothes'],
  [/transport|veíc|car|bus|train|avião|trânsit/i, 'transport'],
  [/educat|escola|school|study|estud|univers/i, 'education'],
  [/sport|esport|fit|game|jogo|exerc/i, 'sports'],
];

function inferCategoryHint(category?: string): VisualConceptCategory | undefined {
  if (!category) return undefined;
  for (const [re, cat] of CATEGORY_HINT_MAP) {
    if (re.test(category)) return cat;
  }
  return undefined;
}

/**
 * Resolve o ID de um conceito visual a partir da palavra-alvo, tradução e categoria opcional.
 */
export function resolveVisualConceptId(
  word: string,
  translation?: string,
  category?: string,
): string | undefined {
  const catHint = inferCategoryHint(category);

  const candidatePhrases = [
    normalizeTerm(word),
    ...(translation ? translation.split(/[/,;()]+/).map((s) => normalizeTerm(s)) : []),
  ].filter(Boolean);

  // 1. Exact phrase match
  for (const phrase of candidatePhrases) {
    const matches = EXACT_KEYWORD_MAP.get(phrase);
    if (matches && matches.length > 0) {
      if (catHint) {
        const preferred = matches.find((m) => m.category === catHint);
        if (preferred) return preferred.conceptId;
      }
      return matches[0].conceptId;
    }
  }

  // 2. Token-level exact match (ignoring very short stop-words)
  for (const phrase of candidatePhrases) {
    const tokens = phrase.split(' ').filter((t) => t.length >= 3);
    for (const token of tokens) {
      const matches = EXACT_KEYWORD_MAP.get(token);
      if (matches && matches.length > 0) {
        if (catHint) {
          const preferred = matches.find((m) => m.category === catHint);
          if (preferred) return preferred.conceptId;
        }
        return matches[0].conceptId;
      }
    }
  }

  // 3. Substring/prefix match for longer keywords (>= 5 chars) against tokens
  for (const phrase of candidatePhrases) {
    if (phrase.length < 5) continue;
    const tokens = phrase.split(' ').filter((t) => t.length >= 4);
    for (const entry of KEYWORD_INDEX) {
      if (entry.normKw.length < 5) continue;
      if (
        tokens.some(
          (t) =>
            t.startsWith(entry.normKw) ||
            entry.normKw.startsWith(t),
        )
      ) {
        return entry.conceptId;
      }
    }
  }

  return undefined;
}

export function getConceptImageUrl(conceptId: string): string {
  const base = DEFAULT_BACKEND_API_URL.replace(/\/+$/, '');
  return `${base}/api/media/images/concepts/${encodeURIComponent(conceptId)}.svg`;
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Gera um SVG flat-vector determinístico em data URI para uso offline/fallback sem imagem quebrada.
 */
export function buildConceptFallbackSvgDataUri(conceptId: string): string {
  const concept = VISUAL_CONCEPTS_MAP.get(conceptId);
  const bgHex = concept?.bgHex ?? '#E0F2FE';
  const accentHex = concept?.accentHex ?? '#0284C7';
  const glyph = concept?.emoji ?? '✨';
  const seed = hashString(conceptId || 'default');
  const cx1 = 28 + (seed % 24);
  const cy1 = 26 + ((seed >> 4) % 20);
  const cx2 = 122 + ((seed >> 8) % 18);
  const cy2 = 124 + ((seed >> 12) % 16);

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160" role="img" aria-label="${concept?.labelPt ?? conceptId}">`,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bgHex}"/><stop offset="100%" stop-color="#FFFFFF"/></linearGradient></defs>`,
    `<rect x="4" y="4" width="152" height="152" rx="34" fill="url(#g)" stroke="${accentHex}" stroke-opacity="0.28" stroke-width="3"/>`,
    `<circle cx="${cx1}" cy="${cy1}" r="18" fill="${accentHex}" fill-opacity="0.12"/>`,
    `<circle cx="${cx2}" cy="${cy2}" r="22" fill="${accentHex}" fill-opacity="0.10"/>`,
    `<circle cx="80" cy="80" r="46" fill="#FFFFFF" fill-opacity="0.72" stroke="${accentHex}" stroke-opacity="0.22" stroke-width="2"/>`,
    `<text x="80" y="96" text-anchor="middle" font-size="56" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">${glyph}</text>`,
    `</svg>`,
  ].join('');

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Infere tags de trilha (travel, business, exam, career, daily) a partir do título e nível CEFR da unidade.
 */
export function inferTrackTagsFromTopic(
  titlePt: string,
  titleEn: string,
  level: CEFRLevel,
): TrackTag[] {
  const text = `${titlePt} ${titleEn}`.toLowerCase();
  const tags = new Set<TrackTag>();

  if (/viag|travel|hotel|aeroport|airport|voo|flight|turis|passaport|restaur|check-in|embarq/.test(text)) {
    tags.add('travel');
  }
  if (/negóc|business|empresa|company|reuni|meeting|client|vend|sales|financ|mercado|market|pitch/.test(text)) {
    tags.add('business');
  }
  if (/carreira|career|entrevista|interview|currícul|resume|trabalh|work|emprego|job|lideran|leadership/.test(text)) {
    tags.add('career');
  }
  if (/exam|exame|ielts|toefl|det|cambridge|dele|delf|test|prova|ensaio|essay|acadêm|academic/.test(text)) {
    tags.add('exam');
  }
  if (tags.size === 0 || /rotina|daily|casa|home|famíl|family|compra|shop|saúde|health|tempo|weather|sauda|greet/.test(text)) {
    tags.add('daily');
  }
  if ((level === 'B2' || level === 'C1') && !tags.has('exam') && tags.size < 2) {
    tags.add('career');
  }

  return Array.from(tags);
}

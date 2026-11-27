/**
 * @file src/data/tutorScenariosV9/tutorV9_es.ts
 * @description Expansão v9.0 de +10 cenários de conversação para o Tutor IA em Espanhol.
 * @exports ES_TUTOR_SCENARIOS_V9
 */
import type { AITutorScenario } from '../../types/learning';

export const ES_TUTOR_SCENARIOS_V9: AITutorScenario[] = [
  // ==================== A1 (2) ====================
  {
    id: 'tut-es-v9-1',
    languageCode: 'es',
    titlePt: 'Estação de Trem: Bilhete & Atraso',
    titleEn: 'Estación de Tren: Billetes y Andén',
    level: 'A1',
    personaName: 'Carlos',
    personaRole: 'Atendente da estação Atocha em Madri',
    settingPt: 'Compre uma passagem de ida e volta para Toledo, confirme a plataforma e pergunte se há atraso.',
    goalsPt: [
      'Pedir um bilhete de ida e volta ("ida y vuelta")',
      'Perguntar o número da plataforma ("¿De qué andén sale?")',
      'Confirmar o horário de saída e se há atraso',
    ],
    openingEn: '¡Buenos días! Bienvenido a la estación de Atocha. ¿En qué puedo ayudarle hoy?',
    openingPt: 'Bom dia! Bem-vindo à estação de Atocha. Em que posso ajudá-lo(a) hoje?',
    initialSuggestions: [
      'Buenos días, quiero un billete de ida y vuelta a Toledo, por favor.',
      '¿De qué andén sale el próximo tren?',
      '¿El tren de las diez y media tiene retraso?',
    ],
  },
  {
    id: 'tut-es-v9-2',
    languageCode: 'es',
    titlePt: 'Farmácia: Sintomas Simples & Receita',
    titleEn: 'Farmacia: Síntomas y Dosis',
    level: 'A1',
    personaName: 'Lucía',
    personaRole: 'Farmacêutica em Bogotá',
    settingPt: 'Explique que está com dor de garganta e febre leve, informe se tem alergias e pergunte como tomar o remédio.',
    goalsPt: [
      'Descrever um sintoma simples ("Me duele la garganta")',
      'Perguntar se precisa de receita médica',
      'Confirmar quantas vezes ao dia tomar',
    ],
    openingEn: '¡Hola! Buenas tardes. ¿Qué síntomas tiene y desde cuándo se siente mal?',
    openingPt: 'Olá! Boa tarde. Quais sintomas você tem e desde quando se sente mal?',
    initialSuggestions: [
      'Hola, me duele mucho la garganta desde ayer por la noche.',
      '¿Necesito receta médica para este jarabe?',
      '¿Cuántas pastillas debo tomar al día?',
    ],
  },

  // ==================== A2 (2) ====================
  {
    id: 'tut-es-v9-3',
    languageCode: 'es',
    titlePt: 'Hotel: Reclamação Educada & Troca',
    titleEn: 'Hotel: Cambio de Habitación',
    level: 'A2',
    personaName: 'Sofía',
    personaRole: 'Recepcionista de hotel no centro de Buenos Aires',
    settingPt: 'O chuveiro está frio e a janela dá para uma avenida barulhenta; peça educadamente para trocar de quarto.',
    goalsPt: [
      'Explicar o problema com educação ("Disculpe, hay un problema...")',
      'Solicitar um quarto mais silencioso em andar alto',
      'Confirmar a senha do Wi-Fi e o horário do check-out',
    ],
    openingEn: 'Buenas noches, ¿cómo está? ¿Puedo ayudarle con algo de su habitación?',
    openingPt: 'Boa noite, como está? Posso ajudar com algo do seu quarto?',
    initialSuggestions: [
      'Disculpe, no sale agua caliente en la ducha y se escucha mucho ruido de la calle.',
      '¿Sería posible cambiarme a una habitación más tranquila en un piso alto?',
      'Muchas gracias. ¿A qué hora es el check-out mañana?',
    ],
  },
  {
    id: 'tut-es-v9-4',
    languageCode: 'es',
    titlePt: 'Correios: Encomenda & Prazo',
    titleEn: 'Correos: Envío de Paquete',
    level: 'A2',
    personaName: 'Javier',
    personaRole: 'Atendente dos Correios em Valência',
    settingPt: 'Envie uma caixa para o Brasil, escolha entre envio padrão ou expresso e peça o código de rastreamento.',
    goalsPt: [
      'Informar o destino e perguntar o preço pelo peso',
      'Comparar prazo do envio expresso vs. econômico',
      'Pedir o código de rastreio ("número de seguimiento")',
    ],
    openingEn: '¡Hola! ¿Qué desea enviar hoy? ¿Es un sobre o un paquete internacional?',
    openingPt: 'Olá! O que deseja enviar hoje? É um envelope ou um pacote internacional?',
    initialSuggestions: [
      'Quiero enviar este paquete a Brasil. ¿Cuánto cuesta el envío estándar?',
      '¿Cuántos días tarda en llegar por correo urgente?',
      '¿Me da el número de seguimiento, por favor?',
    ],
  },

  // ==================== B1 (2) ====================
  {
    id: 'tut-es-v9-5',
    languageCode: 'es',
    titlePt: 'Reunião: Concordar & Resumir Decisões',
    titleEn: 'Reunión de Trabajo: Acuerdos',
    level: 'B1',
    personaName: 'Andrés',
    personaRole: 'Coordenador de produto na Cidade do México',
    settingPt: 'Discuta o prazo de entrega de uma campanha, discorde com polidez de uma etapa e proponha um resumo final.',
    goalsPt: [
      'Concordar parcialmente antes de discordar ("Entiendo tu punto, pero...")',
      'Propor uma alternativa realista de cronograma',
      'Resumir os próximos passos da reunião',
    ],
    openingEn: 'El equipo propone lanzar toda la campaña el viernes. ¿Crees que llegamos a tiempo o ves algún riesgo?',
    openingPt: 'A equipe propõe lançar toda a campanha na sexta-feira. Você acha que conseguimos a tempo ou vê algum risco?',
    initialSuggestions: [
      'Entiendo la urgencia, pero me parece arriesgado lanzar sin revisar las pruebas finales.',
      '¿Qué tal si publicamos la primera fase el viernes y dejamos el resto para el martes?',
      'En resumen, yo me encargo del diseño y tú confirmas la fecha con el cliente.',
    ],
  },
  {
    id: 'tut-es-v9-6',
    languageCode: 'es',
    titlePt: 'Aluguel: Contrato & Manutenção',
    titleEn: 'Vivienda: Contrato de Alquiler',
    level: 'B1',
    personaName: 'Marta',
    personaRole: 'Proprietária de apartamento em Sevilha',
    settingPt: 'Antes de assinar o contrato, pergunte sobre caução, despesas incluídas e quem paga por reparos de encanamento.',
    goalsPt: [
      'Confirmar o valor do depósito caução ("fianza")',
      'Perguntar se condomínio e água estão incluídos',
      'Esclarecer responsabilidade por reparos estruturais',
    ],
    openingEn: 'Aquí tienes el borrador del contrato de alquiler por un año. ¿Tienes alguna duda antes de firmarlo?',
    openingPt: 'Aqui está o rascunho do contrato de aluguel de um ano. Tem alguma dúvida antes de assiná-lo?',
    initialSuggestions: [
      'Sí, ¿de cuántos meses es la fianza y cuándo se devuelve?',
      '¿Los gastos de comunidad y agua están incluidos en la mensualidad?',
      'Si falla la caldera o una tubería, ¿quién cubre la reparación?',
    ],
  },

  // ==================== B2 (2) ====================
  {
    id: 'tut-es-v9-7',
    languageCode: 'es',
    titlePt: 'Privacidade Digital & IA no Trabalho',
    titleEn: 'Ciberseguridad y Ética de Datos',
    level: 'B2',
    personaName: 'Claudia',
    personaRole: 'Oficial de proteção de dados (DPO) em Barcelona',
    settingPt: 'Defenda uma política equilibrada para uso de IA generativa na empresa sem vazar dados confidenciais de clientes.',
    goalsPt: [
      'Apontar riscos de vazamento de dados sem proibir a ferramenta',
      'Usar concessões ("A pesar de las ventajas...")',
      'Propor diretrizes práticas de anonimização',
    ],
    openingEn: 'Varios departamentos están subiendo informes internos a herramientas de IA gratuitas. ¿Deberíamos bloquearlas por completo?',
    openingPt: 'Vários departamentos estão enviando relatórios internos para ferramentas de IA gratuitas. Deveríamos bloqueá-las por completo?',
    initialSuggestions: [
      'A pesar de los riesgos de privacidad, prohibirlas por completo solo fomentará el uso oculto.',
      'Lo más sensato es contratar una licencia empresarial y prohibir datos personales en los prompts.',
      'Además, deberíamos capacitar al personal con ejemplos concretos de anonimización.',
    ],
  },
  {
    id: 'tut-es-v9-8',
    languageCode: 'es',
    titlePt: 'Economia Pessoal & Inflação',
    titleEn: 'Finanzas Personales e Inversión',
    level: 'B2',
    personaName: 'Mateo',
    personaRole: 'Consultor financeiro em Santiago',
    settingPt: 'Avalie como proteger sua reserva de emergência da inflação e comparar renda fixa com fundos diversificados.',
    goalsPt: [
      'Explicar seu horizonte de investimento e tolerância ao risco',
      'Comparar liquidez e rentabilidade real acima da inflação',
      'Definir uma estratégia gradual de aportes mensais',
    ],
    openingEn: 'Con la inflación actual, dejar todo en cuenta corriente pierde poder adquisitivo. ¿Cuál es tu objetivo a cinco años?',
    openingPt: 'Com a inflação atual, deixar tudo na conta corrente perde poder de compra. Qual é o seu objetivo em cinco anos?',
    initialSuggestions: [
      'Primero quiero mantener un fondo de emergencia líquido equivalente a seis meses de gastos.',
      'Para el resto, busco una cartera equilibrada que supere la inflación sin asumir volatilidad extrema.',
      '¿Conviene automatizar aportes mensuales a un fondo indexado diversificado?',
    ],
  },

  // ==================== C1 (2) ====================
  {
    id: 'tut-es-v9-9',
    languageCode: 'es',
    titlePt: 'Diplomacia & Negociação Intercultural',
    titleEn: 'Diplomacia y Lenguaje Indirecto',
    level: 'C1',
    personaName: 'Embajadora Ríos',
    personaRole: 'Chefe de delegação em cúpula ibero-americana',
    settingPt: 'Redija ou negocie um parágrafo consensual sobre metas ambientais usando atenuação diplomática (hedging) sem impor sanções.',
    goalsPt: [
      'Usar fórmulas diplomáticas atenuadas ("Cabría considerar...")',
      'Evitar confronto direto mantendo firmeza na meta',
      'Propor redação de compromisso aceitável para ambos os blocos',
    ],
    openingEn: 'Nuestra delegación considera que el borrador actual impone plazos poco realistas para economías en transición.',
    openingPt: 'Nossa delegação considera que o rascunho atual impõe prazos pouco realistas para economias em transição.',
    initialSuggestions: [
      'Apreciamos esa observación; cabría plantear metas escalonadas vinculadas al acceso a financiamiento verde.',
      'Lejos de imponer sanciones punitivas, el texto busca establecer incentivos verificables.',
      '¿Les resultaría aceptable sustituir "obligatorio" por "compromiso progresivo sujeto a revisión"?',
    ],
  },
  {
    id: 'tut-es-v9-10',
    languageCode: 'es',
    titlePt: 'Análise Crítica de Mídia & Falácias',
    titleEn: 'Capstone C1: Desinformación y Falacias',
    level: 'C1',
    personaName: 'Prof. Velasco',
    personaRole: 'Catedrático de jornalismo investigativo em Madri',
    settingPt: 'Desconstrua um editorial sensacionalista identificando falácias (espantalho, falsa dicotomia) com rigor analítico.',
    goalsPt: [
      'Identificar pelo menos duas falácias argumentativas pelo nome',
      'Distinguir correlação de causalidade nos dados citados',
      'Apresentar uma síntese editorial baseada em evidências',
    ],
    openingEn: 'Este artículo sostiene que o aprobamos la medida hoy o el sector colapsará mañana. ¿Qué falla argumentativa detectas?',
    openingPt: 'Este artigo sustenta que ou aprovamos a medida hoje ou o setor entrará em colapso amanhã. Que falha argumentativa você detecta?',
    initialSuggestions: [
      'Incurre claramente en una falsa dicotomía, ignorando soluciones intermedias graduales.',
      'Además, confunde correlación con causalidad al atribuir la caída de ventas a una sola norma.',
      'Para sostener esa tesis con rigor, haría falta contrastar series históricas y fuentes independientes.',
    ],
  },
];

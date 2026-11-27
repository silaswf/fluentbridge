/**
 * @file src/data/tutorScenariosV9/tutorV9_ar.ts
 * @description Expansão v9.0 de +10 cenários de conversação para o Tutor IA em Árabe (RTL).
 * @exports AR_TUTOR_SCENARIOS_V9
 */
import type { AITutorScenario } from '../../types/learning';

export const AR_TUTOR_SCENARIOS_V9: AITutorScenario[] = [
  // ==================== A1 (2) ====================
  {
    id: 'tut-ar-v9-1',
    languageCode: 'ar',
    titlePt: 'Comprando Roupas e Tamanhos no Shopping',
    titleEn: 'شراء الملابس واختيار المقاس في المتجر',
    level: 'A1',
    personaName: 'سارة (Sara)',
    personaRole: 'Vendedora de loja de roupas em Riad',
    settingPt: 'Você quer experimentar uma camisa, perguntar se há outro tamanho e escolher outra cor.',
    goalsPt: [
      'Pedir para experimentar usando «هل يمكنني قياس هذا؟»',
      'Perguntar pelo tamanho e pela cor (مقاس وسط / أزرق)',
      'Dizer se ficou bom ou apertado',
    ],
    openingEn: 'أهلاً بك في متجرنا! كيف أساعدك اليوم؟ هل تبحث عن مقاس أو لون معين؟',
    openingPt: 'Bem-vindo(a) à nossa loja! Como posso ajudar hoje? Procura algum tamanho ou cor específicos?',
    initialSuggestions: [
      'أريد قميصاً أزرق مقاس وسط، من فضلك.',
      'هل يمكنني قياس هذا القميص في غرفة القياس؟',
      'هذا المقاس صغير قليلاً، هل عندكم مقاس أكبر؟',
    ],
  },
  {
    id: 'tut-ar-v9-2',
    languageCode: 'ar',
    titlePt: 'Na Farmácia: Sintomas Simples',
    titleEn: 'في الصيدلية: وصف الأعراض البسيطة',
    level: 'A1',
    personaName: 'د. طارق (Dr. Tariq)',
    personaRole: 'Farmacêutico no Cairo',
    settingPt: 'Você está com dor de garganta e dor de cabeça leve. Peça um remédio simples e pergunte a dosagem.',
    goalsPt: [
      'Dizer o que está sentindo (أشعر بصداع / ألم في الحلق)',
      'Perguntar quantas vezes por dia tomar o remédio',
      'Agradecer e perguntar o preço',
    ],
    openingEn: 'مساء الخير، أهلاً بك في الصيدلية. ممَّ تشكو اليوم؟',
    openingPt: 'Boa noite, bem-vindo(a) à farmácia. Do que você está se queixando hoje?',
    initialSuggestions: [
      'أشعر بصداع خفيف وألم في الحلق منذ الصباح.',
      'هل عندكم دواء مناسب؟ كم مرة في اليوم آخذه؟',
      'شكراً دكتور، بكم هذا الدواء من فضلك؟',
    ],
  },

  // ==================== A2 (2) ====================
  {
    id: 'tut-ar-v9-3',
    languageCode: 'ar',
    titlePt: 'Check-in no Hotel e Troca de Quarto',
    titleEn: 'تسجيل الدخول في الفندق وتغيير الغرفة',
    level: 'A2',
    personaName: 'فيصل (Faisal)',
    personaRole: 'Recepcionista de hotel em Dubai',
    settingPt: 'O quarto recebido é barulhento e fica longe do elevador. Peça educadamente uma troca para um quarto tranquilo.',
    goalsPt: [
      'Confirmar a reserva e o número de noites',
      'Explicar o motivo da insatisfação com educação',
      'Solicitar um quarto silencioso em andar alto',
    ],
    openingEn: 'مرحباً بك في فندقنا! هل لديك حجز مسبق؟ من فضلك أعطني جواز السفر.',
    openingPt: 'Bem-vindo(a) ao nosso hotel! Você tem reserva prévia? Por favor, dê-me seu passaporte.',
    initialSuggestions: [
      'نعم، لديَّ حجز باسم لوكاس لمدة ثلاث ليالٍ.',
      'عفواً، الغرفة قريبة من الشارع وصوت السيارات مرتفع جداً.',
      'هل يمكن تغييرها إلى غرفة هادئة في طابق مرتفع؟',
    ],
  },
  {
    id: 'tut-ar-v9-4',
    languageCode: 'ar',
    titlePt: 'No Banco: Câmbio e Taxas',
    titleEn: 'في البنك: صرف العملات والرسوم',
    level: 'A2',
    personaName: 'منى (Mona)',
    personaRole: 'Atendente bancária em Amã',
    settingPt: 'Você quer trocar moeda estrangeira e perguntar sobre a taxa de câmbio e comissão bancária.',
    goalsPt: [
      'Informar o valor e a moeda que deseja trocar',
      'Perguntar a cotação do dia e se há taxa de serviço',
      'Confirmar se aceita o valor líquido',
    ],
    openingEn: 'أهلاً بك في البنك. ما الخدمة المصرفية التي تحتاج إليها اليوم؟',
    openingPt: 'Bem-vindo(a) ao banco. De qual serviço bancário você precisa hoje?',
    initialSuggestions: [
      'أريد صرف مئتي دولار إلى العملة المحلية، كم سعر الصرف اليوم؟',
      'هل توجد رسوم إضافية على عملية الصرف؟',
      'ممتاز، موافق. من فضلك أريد الإيصال أيضاً.',
    ],
  },

  // ==================== B1 (2) ====================
  {
    id: 'tut-ar-v9-5',
    languageCode: 'ar',
    titlePt: 'Entrevista de Emprego: Experiência e Pontos Fortes',
    titleEn: 'مقابلة عمل: الخبرة ونقاط القوة',
    level: 'B1',
    personaName: 'الأستاذ خالد (Sr. Khalid)',
    personaRole: 'Gerente de Recursos Humanos em Riad',
    settingPt: 'Você está em uma entrevista para uma vaga de analista. Fale sobre sua experiência anterior, pontos fortes e um projeto relevante.',
    goalsPt: [
      'Apresentar sua trajetória de forma organizada',
      'Destacar dois pontos fortes com exemplos práticos',
      'Fazer uma pergunta inteligente sobre a equipe',
    ],
    openingEn: 'أهلاً بك في شركتنا. في البداية، حدثنا باختصار عن خبرتك السابقة وأبرز نقاط قوتك.',
    openingPt: 'Bem-vindo(a) à nossa empresa. Para começar, fale-nos brevemente sobre sua experiência anterior e seus principais pontos fortes.',
    initialSuggestions: [
      'عملتُ ثلاث سنوات في تحليل البيانات وإدارة المشاريع التقنية.',
      'من أبرز نقاط قوتي القدرة على حل المشكلات والعمل ضمن فريق.',
      'ما أهم التحديات التي يواجهها الفريق في الأشهر القادمة؟',
    ],
  },
  {
    id: 'tut-ar-v9-6',
    languageCode: 'ar',
    titlePt: 'Contrato de Aluguel e Manutenção Residencial',
    titleEn: 'عقد الإيجار وصيانة الشقة',
    level: 'B1',
    personaName: 'أبو عمر (Abu Omar)',
    personaRole: 'Proprietário de apartamento no Cairo',
    settingPt: 'Você negocia o contrato de aluguel de um apartamento e quer esclarecer responsabilidades de manutenção e prazo de aviso prévio.',
    goalsPt: [
      'Confirmar o valor mensal e o que está incluído',
      'Perguntar quem paga por consertos estruturais e ar-condicionado',
      'Combinar o prazo de aviso caso precise rescindir antes',
    ],
    openingEn: 'الشقة جاهزة للسكن وفي حيٍّ هادئ. هل لديك أي استفسار حول بنود عقد الإيجار؟',
    openingPt: 'O apartamento está pronto para morar e fica em um bairro tranquilo. Tem alguma dúvida sobre as cláusulas do contrato de aluguel?',
    initialSuggestions: [
      'هل يشمل الإيجار الشهري رسوم الصيانة والماء؟',
      'إذا حدث عطل في التكييف، من يتحمل تكلفة الإصلاح؟',
      'كم مدة الإشعار المطلوبة إذا اضطررتُ لإنهاء العقد مبكراً؟',
    ],
  },

  // ==================== B2 (2) ====================
  {
    id: 'tut-ar-v9-7',
    languageCode: 'ar',
    titlePt: 'Privacidade Digital e IA no Trabalho',
    titleEn: 'الخصوصية الرقمية وأخلاقيات الذكاء الاصطناعي',
    level: 'B2',
    personaName: 'م. ريم (Eng. Reem)',
    personaRole: 'Diretora de Segurança Cibernética',
    settingPt: 'Debata como equilibrar o uso de inteligência artificial na empresa com a proteção de dados confidenciais dos clientes.',
    goalsPt: [
      'Usar conectores concessivos (على الرغم من / إلا أن)',
      'Diferenciar inovação produtiva de risco cibernético',
      'Propor diretrizes práticas de governança de dados',
    ],
    openingEn: 'الموظفون يستخدمون أدوات الذكاء الاصطناعي يومياً، لكننا نخشى تسرب بيانات العملاء. ما السياسة التي تقترحها؟',
    openingPt: 'Os funcionários usam ferramentas de IA diariamente, mas tememos vazamento de dados de clientes. Qual política você propõe?',
    initialSuggestions: [
      'على الرغم من الفوائد الإنتاجية الكبيرة، يجب حظر إدخال البيانات الحساسة في منصات عامة.',
      'أقترح وضع سياسة واضحة لتصنيف البيانات وتدريب الموظفين على الأمن السيبراني.',
      'الحل العملي هو توفير بيئة داخلية آمنة ومشفرة لاستخدام نماذج الذكاء الاصطناعي.',
    ],
  },
  {
    id: 'tut-ar-v9-8',
    languageCode: 'ar',
    titlePt: 'Gestão de Crise e Pedido de Desculpas Corporativo',
    titleEn: 'إدارة الأزمات والاعتذار المؤسسي الرسمي',
    level: 'B2',
    personaName: 'الأستاذة نادية (Sra. Nadia)',
    personaRole: 'Representante de cliente corporativo estratégico',
    settingPt: 'Uma interrupção no serviço causou atraso para o cliente. Conduza a reunião com registro formal, transparência e plano de ação.',
    goalsPt: [
      'Apresentar pedido formal de desculpas sem desculpas vazias',
      'Explicar a causa técnica de forma clara e objetiva',
      'Apresentar medidas preventivas com prazos definidos',
    ],
    openingEn: 'تسبب انقطاع الخدمة بالأمس في تأخير شحناتنا. نحتاج إلى توضيح رسمي وضمانات لعدم تكرار ذلك.',
    openingPt: 'A interrupção do serviço ontem causou atraso em nossos envios. Precisamos de um esclarecimento formal e garantias de que não se repetirá.',
    initialSuggestions: [
      'نتقدم إليكم بخالص الاعتذار عن هذا الانقطاع غير المتوقع، ونتحمل المسؤولية الكاملة.',
      'تمثّل السبب في خللٍ مؤقتٍ بأحد الخوادم، وقد تمت معالجته بالكامل خلال ساعتين.',
      'لضمان عدم التكرار، سنفعل نظام مراقبة احتياطياً ونوافيكم بتقرير مفصل غداً.',
    ],
  },

  // ==================== C1 (2) ====================
  {
    id: 'tut-ar-v9-9',
    languageCode: 'ar',
    titlePt: 'Negociação Jurídica e Cláusulas Contratuais',
    titleEn: 'التفاوض القانوني وصياغة بنود العقود',
    level: 'C1',
    personaName: 'المستشار عادل (Consultor Adel)',
    personaRole: 'Assessor jurídico sênior',
    settingPt: 'Você revisa um contrato internacional e precisa limitar a responsabilidade por força maior e ajustar a cláusula de arbitragem.',
    goalsPt: [
      'Empregar vocabulário jurídico clássico e preciso (القوة القاهرة / التحكيم / الحد الأقصى للمسؤولية)',
      'Usar atenuação diplomática (hedging) ao discordar',
      'Sugerir redação alternativa equilibrada',
    ],
    openingEn: 'اطلعنا على ملاحظاتكم حول مسودة العقد. ما تحفظاتكم تحديداً بشأن بند المسؤولية وحل النزاعات؟',
    openingPt: 'Analisamos suas observações sobre a minuta do contrato. Quais são exatamente suas ressalvas quanto à cláusula de responsabilidade e resolução de disputas?',
    initialSuggestions: [
      'نرى أن يقتصر الحد الأقصى للمسؤولية على قيمة العقد السنوية باستثناء حالات الإهمال الجسيم.',
      'مع تقديرنا لصياغتكم، نفضّل إدراج بند واضح يعفي الطرفين عند تحقق القوة القاهرة.',
      'وبخصوص فض النزاعات، نقترح اللجوء إلى التحكيم التجاري الدولي قبل التقاضي.',
    ],
  },
  {
    id: 'tut-ar-v9-10',
    languageCode: 'ar',
    titlePt: 'Simulação Capstone C1: Conferência sobre Bioética e Futuro',
    titleEn: 'ندوة القمة C1: الأخلاقيات الحيوية وتنظيم التكنولوجيا',
    level: 'C1',
    personaName: 'د. سلمى (Dra. Salma)',
    personaRole: 'Moderadora de conferência internacional',
    settingPt: 'Você é convidado de honra em um painel multidisciplinar sobre regulação de IA médica, bioética e desigualdade no acesso à saúde.',
    goalsPt: [
      'Articular argumentos abstratos em árabe padrão elevado (فصحى رفيعة)',
      'Usar perguntas retóricas e contrastes estilísticos para persuadir',
      'Sintetizar aspectos éticos, jurídicos e humanos na conclusão',
    ],
    openingEn: 'بين تسارع الابتكار الطبي ومحدودية الأطر التشريعية، كيف يمكننا صياغة حوكمةٍ تحمي كرامة الإنسان دون كبح البحث العلمي؟',
    openingPt: 'Entre a aceleração da inovação médica e a limitação dos marcos legislativos, como formular uma governança que proteja a dignidade humana sem frear a pesquisa científica?',
    initialSuggestions: [
      'إن التقدم العلمي بلا بوصلةٍ أخلاقيةٍ قد يتحول من أداةٍ للشفاء إلى مصدرٍ لتعميق الفجوة الاجتماعية.',
      'أليس من الأجدر أن يواكب التشريعُ المرنُ تطورَ التكنولوجيا بدلاً من أن يلاحقها بعد فوات الأوان؟',
      'ختاماً، تبقى العدالة في إتاحة العلاج والشفافية الخوارزمية ركيزتين لا غنى عنهما لمستقبل الطب.',
    ],
  },
];

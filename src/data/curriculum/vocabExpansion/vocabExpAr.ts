import type { VocabExampleFixMap, VocabExpansionTuple } from './types';

export const VOCAB_EXP_AR: VocabExpansionTuple[] = [
  // ==================== A1 (ar-a1-1 .. ar-a1-10) ====================
  ['ar-a1-1', 'أهلاً وسهلاً (Ahlan wa sahlan)', '/ˈah.lan wa ˈsah.lan/', 'Seja bem-vindo(a)', 'Saudações', 'أهلاً وسهلاً بكم في مدينتنا الجميلة.', 'Sejam muito bem-vindos à nossa bela cidade.'],
  ['ar-a1-1', 'صباح الخير (Ṣabāḥ al-khayr)', '/sˤaˈbaːħ al.xajr/', 'Bom dia', 'Saudações', 'صباح الخير يا أستاذ، كيف حالك اليوم؟', 'Bom dia, professor, como o senhor está hoje?'],
  ['ar-a1-1', 'من أين أنت؟ (Min ayna anta?)', '/min ˈaj.na ˈan.ta/', 'De onde você é?', 'Apresentação', 'من أين أنت يا صديقي الجديد؟', 'De onde você é, meu novo amigo?'],

  ['ar-a1-2', 'من فضلك (Min faḍlik)', '/min ˈfadˤ.lik/', 'Por favor', 'Cortesia', 'أريد كوب ماء بارد من فضلك.', 'Quero um copo de água fria, por favor.'],
  ['ar-a1-2', 'بدون سكر (Bidūn sukkar)', '/biˈduːn ˈsuk.kar/', 'Sem açúcar', 'Bebidas', 'أشرب القهوة العربية بدون سكر كل صباح.', 'Bebo café árabe sem açúcar todas as manhãs.'],
  ['ar-a1-2', 'عصير طازج (ʿAṣīr ṭāzaj)', '/ʕaˈsˤiːr ˈtˤaː.zadʒ/', 'Suco fresco', 'Bebidas', 'نطلب عصير طازج بعد الغداء في المقهى.', 'Pedimos suco fresco depois do almoço no café.'],

  ['ar-a1-3', 'كم السعر؟ (Kam as-siʿr?)', '/kam asˈsiʕr/', 'Qual é o preço?', 'Compras', 'كم السعر النهائي لهذه الحقيبة؟', 'Qual é o preço final desta bolsa?'],
  ['ar-a1-3', 'خصم (Khaṣm)', '/xasˤm/', 'Desconto', 'Compras', 'هل يوجد خصم للطلاب في هذا المتجر؟', 'Há desconto para estudantes nesta loja?'],
  ['ar-a1-3', 'إيصال (Īṣāl)', '/iːˈsˤaːl/', 'Recibo / Comprovante', 'Compras', 'أحتاج إلى إيصال الدفع بعد الشراء.', 'Preciso do recibo de pagamento após a compra.'],

  ['ar-a1-4', 'جدّ / جدّة (Jadd / Jadda)', '/dʒadd / ˈdʒad.da/', 'Avô / Avó', 'Família', 'أزور جدّي وجدّتي في نهاية الأسبوع.', 'Visito meu avô e minha avó no fim de semana.'],
  ['ar-a1-4', 'ابن / ابنة (Ibn / Ibna)', '/ibn / ˈib.na/', 'Filho / Filha', 'Família', 'يدرس ابني في المدرسة القريبة من بيتنا.', 'Meu filho estuda na escola perto da nossa casa.'],
  ['ar-a1-4', 'صديق (Ṣadīq)', '/sˤaˈdiːq/', 'Amigo', 'Relações', 'هذا صديقي الذي تعرفتُ عليه في الجامعة.', 'Este é meu amigo que conheci na universidade.'],

  ['ar-a1-5', 'أستيقظ (Astayqiẓ)', '/asˈtaj.qidˤ/', 'Eu acordo', 'Rotina', 'أستيقظ مبكراً في الساعة السادسة كل يوم.', 'Eu acordo cedo às seis horas todos os dias.'],
  ['ar-a1-5', 'الجمعة (Al-jumʿa)', '/alˈdʒum.ʕa/', 'Sexta-feira', 'Dias da Semana', 'نجتمع مع العائلة يوم الجمعة للغداء.', 'Reunimo-nos com a família na sexta-feira para o almoço.'],
  ['ar-a1-5', 'نصف ساعة (Niṣf sāʿa)', '/nisˤf ˈsaː.ʕa/', 'Meia hora', 'Tempo', 'أقرأ الكتاب لمدة نصف ساعة قبل النوم.', 'Leio o livro por meia hora antes de dormir.'],

  ['ar-a1-6', 'على طول (ʿAlā ṭūl)', '/ˈʕa.laː tˤuːl/', 'Em frente / Direto', 'Direções', 'امشِ على طول حتى تصل إلى الإشارة.', 'Siga em frente até chegar ao semáforo.'],
  ['ar-a1-6', 'حافلة (Ḥāfila)', '/ˈħaː.fi.la/', 'Ônibus', 'Transporte', 'أركب الحافلة للذهاب إلى وسط المدينة.', 'Pego o ônibus para ir ao centro da cidade.'],
  ['ar-a1-6', 'تقاطع (Taqāṭuʿ)', '/taˈqaː.tˤuʕ/', 'Cruzamento', 'Direções', 'يقع المتحف بعد التقاطع الثاني مباشرة.', 'O museu fica logo após o segundo cruzamento.'],

  ['ar-a1-7', 'أرزّ (Aruzz)', '/aˈruzz/', 'Arroz', 'Comida', 'يقدّم المطعم الأرزّ مع اللحم المشوي.', 'O restaurante serve arroz com carne grelhada.'],
  ['ar-a1-7', 'سلطة (Salaṭa)', '/ˈsa.la.tˤa/', 'Salada', 'Comida', 'أفضّل تناول سلطة خضراء قبل الطبق الرئيسي.', 'Prefiro comer uma salada verde antes do prato principal.'],
  ['ar-a1-7', 'نباتيّ (Nabātī)', '/naˈbaː.tiː/', 'Vegetariano', 'Preferências', 'هل لديكم خيار نباتيّ في قائمة اليوم؟', 'Vocês têm uma opção vegetariana no cardápio de hoje?'],

  ['ar-a1-8', 'سرير (Sarīr)', '/saˈriːr/', 'Cama', 'Móveis', 'يوجد سرير مريح بجانب النافذة في غرفتي.', 'Há uma cama confortável ao lado da janela no meu quarto.'],
  ['ar-a1-8', 'نافذة (Nāfidha)', '/ˈnaː.fi.ða/', 'Janela', 'Casa', 'أفتح نافذة الغرفة كل صباح لدخول الهواء.', 'Abro a janela do quarto todas as manhãs para entrar ar.'],
  ['ar-a1-8', 'خزانة (Khizāna)', '/xiˈzaː.na/', 'Armário / Guarda-roupa', 'Móveis', 'أضع ملابسي الشتوية في خزانة خشبية كبيرة.', 'Guardo minhas roupas de inverno em um armário grande de madeira.'],

  ['ar-a1-9', 'استقبال (Istiqbāl)', '/is.tiqˈbaːl/', 'Recepção', 'Hotel', 'تحدّثتُ مع موظف الاستقبال عن موعد المغادرة.', 'Conversei com o funcionário da recepção sobre o horário de saída.'],
  ['ar-a1-9', 'فطور (Fuṭūr)', '/fuˈtˤuːr/', 'Café da manhã', 'Hotel', 'هل الفطور مشمول في سعر الغرفة؟', 'O café da manhã está incluído no preço do quarto?'],
  ['ar-a1-9', 'مصعد (Miṣʿad)', '/ˈmisˤ.ʕad/', 'Elevador', 'Hotel', 'المصعد موجود على يمين البوابة الرئيسية.', 'O elevador fica à direita da entrada principal.'],

  ['ar-a1-10', 'مطر (Maṭar)', '/ˈma.tˤar/', 'Chuva', 'Clima', 'ينزل المطر بغزارة في فصل الشتاء هنا.', 'Chove bastante no inverno aqui.'],
  ['ar-a1-10', 'معطف (Miʿṭaf)', '/ˈmiʕ.tˤaf/', 'Casaco', 'Roupas', 'ألبس معطفاً ثقيلاً عندما يكون الجو بارداً.', 'Visto um casaco pesado quando o tempo está frio.'],
  ['ar-a1-10', 'قميص (Qamīṣ)', '/qaˈmiːsˤ/', 'Camisa', 'Roupas', 'اشتريتُ قميصاً أبيض خفيفاً للصيف.', 'Comprei uma camisa branca leve para o verão.'],

  // ==================== V5-A1 (ar-v5-a1-1 .. ar-v5-a1-10) ====================
  ['ar-v5-a1-1', 'ماء (Māʾ)', '/maːʔ/', 'Água', 'Sobrevivência', 'أحتاج إلى زجاجة ماء بعد المشي الطويل.', 'Preciso de uma garrafa de água depois da longa caminhada.'],
  ['ar-v5-a1-1', 'إسعاف (Isʿāf)', '/isˈʕaːf/', 'Ambulância / Primeiros socorros', 'Emergência', 'اتصلنا بسيارة الإسعاف فوراً عند الحادث.', 'Ligamos para a ambulância imediatamente no momento do acidente.'],
  ['ar-v5-a1-1', 'خطر (Khaṭar)', '/ˈxa.tˤar/', 'Perigo', 'Emergência', 'هذه المنطقة فيها خطر، انتبه أثناء السير.', 'Esta área tem perigo, tenha cuidado ao caminhar.'],

  ['ar-v5-a1-2', 'فواكه (Fawākih)', '/faˈwaː.kih/', 'Frutas', 'Supermercado', 'أشتري فواكه طازجة من السوق كل أسبوع.', 'Compro frutas frescas no mercado toda semana.'],
  ['ar-v5-a1-2', 'خضروات (Khuḍrawāt)', '/xudˤ.raˈwaːt/', 'Legumes e verduras', 'Supermercado', 'توضع الخضروات في القسم الأول من السوبرماركت.', 'Os legumes e verduras ficam na primeira seção do supermercado.'],
  ['ar-v5-a1-2', 'عربة تسوق (ʿArabat tasawwuq)', '/ˈʕa.ra.bat taˈsaw.wuq/', 'Carrinho de compras', 'Supermercado', 'أخذتُ عربة تسوق صغيرة عند دخول المتجر.', 'Peguei um carrinho de compras pequeno ao entrar na loja.'],

  ['ar-v5-a1-3', 'سائق (Sāʾiq)', '/ˈsaː.ʔiq/', 'Motorista', 'Transporte', 'طلبتُ من السائق التوقف أمام باب الفندق.', 'Pedi ao motorista para parar em frente à porta do hotel.'],
  ['ar-v5-a1-3', 'وجهة (Wijha)', '/ˈwidʒ.ha/', 'Destino', 'Transporte', 'أدخلتُ الوجهة الصحيحة في تطبيق الرحلات.', 'Inseri o destino correto no aplicativo de corridas.'],
  ['ar-v5-a1-3', 'عدّاد (ʿAddād)', '/ʕadˈdaːd/', 'Taxímetro', 'Transporte', 'تأكدتُ من تشغيل العدّاد قبل انطلاق السيارة.', 'Certifiquei-me de que o taxímetro estava ligado antes de o carro partir.'],

  ['ar-v5-a1-4', 'تغطية (Taghṭiya)', '/taɣˈtˤi.ja/', 'Cobertura / Sinal', 'Tecnologia', 'التغطية ممتازة في وسط المدينة، لكنها ضعيفة في الجبال.', 'O sinal é excelente no centro da cidade, mas fraco nas montanhas.'],
  ['ar-v5-a1-4', 'كلمة المرور (Kalimat al-murūr)', '/ˈka.li.mat al.muˈruːr/', 'Senha', 'Tecnologia', 'أعطاني الموظف كلمة المرور الخاصة بشبكة الواي فاي.', 'O funcionário me deu a senha da rede Wi-Fi.'],
  ['ar-v5-a1-4', 'اتصال (Ittiṣāl)', '/it.tiˈsˤaːl/', 'Ligação / Conexão', 'Tecnologia', 'أجريتُ اتصالاً سريعاً بأسرتي بعد الوصول.', 'Fiz uma ligação rápida para minha família após chegar.'],

  ['ar-v5-a1-5', 'معجون أسنان (Maʿjūn asnān)', '/maʕˈdʒuːn asˈnaːn/', 'Pasta de dente', 'Higiene', 'أحتاج إلى شراء فرشاة ومعجون أسنان للسفر.', 'Preciso comprar uma escova e pasta de dente para a viagem.'],
  ['ar-v5-a1-5', 'صابون (Ṣābūn)', '/sˤaːˈbuːn/', 'Sabonete', 'Higiene', 'هذا الصابون الطبيعي لطيف على البشرة الحساسة.', 'Este sabonete natural é suave para a pele sensível.'],
  ['ar-v5-a1-5', 'مطهر (Muṭahhir)', '/muˈtˤah.hir/', 'Antisséptico / Desinfetante', 'Farmácia', 'وضعتُ مطهراً على الجرح الصغير قبل الضمادة.', 'Passei um antisséptico no pequeno corte antes do curativo.'],

  ['ar-v5-a1-6', 'رسالة (Risāla)', '/riˈsaː.la/', 'Carta / Mensagem', 'Correios', 'أرسلتُ رسالة مسجّلة إلى مكتب الجامعة.', 'Enviei uma carta registrada para a secretaria da universidade.'],
  ['ar-v5-a1-6', 'صندوق بريد (Ṣundūq barīd)', '/sˤunˈduːq baˈriːd/', 'Caixa postal / Caixa de correio', 'Correios', 'وجدتُ البطاقة داخل صندوق البريد صباح اليوم.', 'Encontrei o cartão dentro da caixa de correio hoje de manhã.'],
  ['ar-v5-a1-6', 'رمز بريدي (Ramz barīdī)', '/ramz baˈriː.diː/', 'CEP / Código postal', 'Correios', 'اكتب الرمز البريدي بدقة ليصل الطرد في موعده.', 'Escreva o código postal com precisão para que a encomenda chegue no prazo.'],

  ['ar-v5-a1-7', 'كعك (Kaʿk)', '/kaʕk/', 'Bolo / Biscoito árabe', 'Padaria', 'يقدّم هذا المخبز كعكاً بالسمسم لذيذاً كل صباح.', 'Esta padaria serve deliciosos biscoitos com gergelim todas as manhãs.'],
  ['ar-v5-a1-7', 'بقلاوة (Baqlāwa)', '/baqˈlaː.wa/', 'Baklava (doce árabe)', 'Doces', 'اشترينا علبة بقلاوة بالفستق هديةً للعائلة.', 'Compramos uma caixa de baklava de pistache de presente para a família.'],
  ['ar-v5-a1-7', 'فرن (Furn)', '/furn/', 'Forno', 'Padaria', 'خرج الخبز الساخن من الفرن للتوّ.', 'O pão quente acabou de sair do forno.'],

  ['ar-v5-a1-8', 'معرض (Maʿriḍ)', '/ˈmaʕ.ridˤ/', 'Exposição / Galeria', 'Cultura', 'يستضيف المتحف معرضاً للخط العربي هذا الشهر.', 'O museu recebe uma exposição de caligrafia árabe este mês.'],
  ['ar-v5-a1-8', 'تصوير (Taṣwīr)', '/tasˤˈwiːr/', 'Fotografia', 'Turismo', 'التصوير بدون فلاش مسموح في القاعة الأولى.', 'Fotografar sem flash é permitido na primeira sala.'],
  ['ar-v5-a1-8', 'مواعيد العمل (Mawāʿīd al-ʿamal)', '/ma.waːˈʕiːd alˈʕa.mal/', 'Horário de funcionamento', 'Turismo', 'تحقّقتُ من مواعيد العمل قبل زيارة القلعة.', 'Verifiquei o horário de funcionamento antes de visitar a cidadela.'],

  ['ar-v5-a1-9', 'تمرين (Tamrīn)', '/tamˈriːn/', 'Exercício / Treino', 'Esportes', 'أقوم بتمرين خفيف لمدة عشرين دقيقة يومياً.', 'Faço um treino leve por vinte minutos diariamente.'],
  ['ar-v5-a1-9', 'مدرّب (Mudarrib)', '/muˈdar.rib/', 'Treinador / Instrutor', 'Esportes', 'يساعدني المدرّب على تحسين لياقتي البدنية.', 'O treinador me ajuda a melhorar meu condicionamento físico.'],
  ['ar-v5-a1-9', 'مشي (Mashy)', '/maʃj/', 'Caminhada', 'Esportes', 'أحبّ المشي في الحديقة عند غروب الشمس.', 'Gosto da caminhada no parque ao pôr do sol.'],

  ['ar-v5-a1-10', 'مع السلامة (Maʿa as-salāma)', '/ˈma.ʕa as.saˈlaː.ma/', 'Tchau / Vá em paz', 'Despedidas', 'مع السلامة، أراك في الأسبوع القادم إن شاء الله.', 'Vá em paz, vejo você na próxima semana, se Deus quiser.'],
  ['ar-v5-a1-10', 'شكراً جزيلاً (Shukran jazīlan)', '/ˈʃuk.ran dʒaˈziː.lan/', 'Muito obrigado', 'Cortesia', 'شكراً جزيلاً على حسن استقبالكم وكرمكم.', 'Muito obrigado pela acolhida e generosidade de vocês.'],
  ['ar-v5-a1-10', 'تواصل (Tawāṣul)', '/taˈwaː.sˤul/', 'Contato / Comunicação', 'Despedidas', 'سنبقى على تواصل دائم عبر الهاتف والرسائل.', 'Manteremos contato constante por telefone e mensagens.'],

  // ==================== A2 (ar-a2-1 .. ar-a2-10) ====================
  ['ar-a2-1', 'التقطتُ (Iltaqaṭtu)', '/il.taˈqatˤ.tu/', 'Eu tirei (foto)', 'Passado', 'التقطتُ صوراً رائعة للأهرامات أثناء الرحلة.', 'Tirei fotos incríveis das pirâmides durante a viagem.'],
  ['ar-a2-1', 'أقمتُ (Aqamtu)', '/aˈqam.tu/', 'Eu me hospedei / fiquei', 'Viagem', 'أقمتُ في فندق هادئ وسط المدينة القديمة.', 'Hospedei-me em um hotel tranquilo no centro da cidade antiga.'],
  ['ar-a2-1', 'ذكريات (Dhikrayāt)', '/ðik.raˈjaːt/', 'Memórias / Lembranças', 'Viagem', 'بقيت لديّ ذكريات جميلة من زيارتي الأولى.', 'Ficaram em mim belas lembranças da minha primeira visita.'],

  ['ar-a2-2', 'سأبدأ (Sa-abdaʾ)', '/saˈab.daʔ/', 'Eu começarei', 'Futuro', 'سأبدأ دورة جديدة في اللغة العربية الشهر القادم.', 'Começarei um novo curso de língua árabe no próximo mês.'],
  ['ar-a2-2', 'خطة (Khuṭṭa)', '/ˈxutˤ.tˤa/', 'Plano', 'Planejamento', 'وضعنا خطة واضحة لرحلتنا الصيفية.', 'Fizemos um plano claro para a nossa viagem de verão.'],
  ['ar-a2-2', 'قريباً (Qarīban)', '/qaˈriː.ban/', 'Em breve', 'Tempo', 'سوف نزوركم في بيتكم الجديد قريباً.', 'Nós os visitaremos em sua nova casa em breve.'],

  ['ar-a2-3', 'حمّى (Ḥummā)', '/ˈħum.maː/', 'Febre', 'Saúde', 'أصبتُ بحمّى خفيفة ليلة أمس وراجعتُ الطبيب.', 'Tive uma febre leve ontem à noite e consultei o médico.'],
  ['ar-a2-3', 'سعال (Suʿāl)', '/suˈʕaːl/', 'Tosse', 'Saúde', 'وصف لي الصيدلي شراباً لتخفيف السعال.', 'O farmacêutico me receitou um xarope para aliviar a tosse.'],
  ['ar-a2-3', 'فحص طبي (Faḥṣ ṭibbī)', '/faħsˤ ˈtˤib.biː/', 'Exame médico', 'Saúde', 'أجريتُ فحصاً طبياً شاملاً للاطمئنان على صحتي.', 'Fiz um exame médico completo para checar minha saúde.'],

  ['ar-a2-4', 'أسرع (Asraʿ)', '/ˈas.raʕ/', 'Mais rápido', 'Comparativos', 'القطار السريع أسرع من الحافلة بكثير.', 'O trem rápido é muito mais rápido do que o ônibus.'],
  ['ar-a2-4', 'أرخص (Arkhaṣ)', '/ˈar.xasˤ/', 'Mais barato', 'Comparativos', 'التسوق في السوق الشعبي أرخص من المجمع التجاري.', 'Fazer compras no mercado popular é mais barato do que no shopping.'],
  ['ar-a2-4', 'الأجمل (Al-ajmal)', '/alˈadʒ.mal/', 'O mais bonito', 'Superlativos', 'هذه المدينة هي الأجمل من حيث العمارة التاريخية.', 'Esta cidade é a mais bonita em termos de arquitetura histórica.'],

  ['ar-a2-5', 'غرفة القياس (Ghurfat al-qiyās)', '/ˈɣur.fat al.qiˈjaːs/', 'Provador', 'Compras', 'أين تقع غرفة القياس لتجربة هذا البنطال؟', 'Onde fica o provador para experimentar esta calça?'],
  ['ar-a2-5', 'لون (Lawn)', '/lawn/', 'Cor', 'Roupas', 'هل يتوفر هذا القميص بلون أزرق غامق؟', 'Esta camisa está disponível na cor azul-escura?'],
  ['ar-a2-5', 'قطن (Quṭn)', '/qutˤn/', 'Algodão', 'Materiais', 'أفضّل الملابس المصنوعة من القطن في فصل الصيف.', 'Prefiro roupas feitas de algodão no verão.'],

  ['ar-a2-6', 'عملة (ʿUmla)', '/ˈʕum.la/', 'Moeda', 'Banco', 'أريد تبديل العملة الأجنبية إلى العملة المحلية.', 'Quero trocar moeda estrangeira pela moeda local.'],
  ['ar-a2-6', 'حساب بنكي (Ḥisāb bankī)', '/ħiˈsaːb ˈban.kiː/', 'Conta bancária', 'Banco', 'فتحتُ حساباً بنكياً جديداً لتسهيل التحويلات.', 'Abri uma nova conta bancária para facilitar as transferências.'],
  ['ar-a2-6', 'عمولة (ʿUmūla)', '/ʕuˈmuː.la/', 'Taxa / Comissão', 'Banco', 'كم تبلغ العمولة على السحب الدولي؟', 'Qual é a taxa para saque internacional?'],

  ['ar-a2-7', 'غرفة نوم (Ghurfat nawm)', '/ˈɣur.fat nawm/', 'Quarto de dormir', 'Moradia', 'تحتوي الشقة على غرفتي نوم وشرفة واسعة.', 'O apartamento tem dois quartos de dormir e uma varanda ampla.'],
  ['ar-a2-7', 'فواتير (Fawātīr)', '/fa.waːˈtiːr/', 'Contas (água, luz)', 'Moradia', 'هل فواتير الكهرباء والماء مشمولة في الإيجار؟', 'As contas de luz e água estão incluídas no aluguel?'],
  ['ar-a2-7', 'شرفة (Shurfa)', '/ˈʃur.fa/', 'Varanda / Sacada', 'Moradia', 'نجلس في الشرفة مساءً لنستمتع بالنسيم.', 'Sentamos na varanda à noite para aproveitar a brisa.'],

  ['ar-a2-8', 'جواز السفر (Jawāz as-safar)', '/dʒaˈwaːz asˈsa.far/', 'Passaporte', 'Viagem', 'قدّمتُ جواز السفر عند مكتب الجوازات.', 'Apresentei o passaporte no balcão de imigração.'],
  ['ar-a2-8', 'تأخير (Taʾkhīr)', '/taʔˈxiːr/', 'Atraso', 'Transporte', 'أعلن المطار عن تأخير الرحلة لمدة ساعة.', 'O aeroporto anunciou um atraso do voo de uma hora.'],
  ['ar-a2-8', 'بطاقة صعود (Biṭāqat ṣuʿūd)', '/biˈtˤaː.qat sˤuˈʕuːd/', 'Cartão de embarque', 'Viagem', 'حصلتُ على بطاقة صعود الطائرة عبر التطبيق.', 'Obtive o cartão de embarque pelo aplicativo.'],

  ['ar-a2-9', 'موظف (Muwaẓẓaf)', '/muˈwadˤ.dˤaf/', 'Funcionário', 'Trabalho', 'يعمل الموظف الجديد في قسم المبيعات.', 'O novo funcionário trabalha no departamento de vendas.'],
  ['ar-a2-9', 'راتب (Rātib)', '/ˈraː.tib/', 'Salário', 'Trabalho', 'يناقش المتقدمون الراتب وساعات العمل في المقابلة.', 'Os candidatos discutem o salário e o horário de trabalho na entrevista.'],
  ['ar-a2-9', 'جدول زمني (Jadwal zamanī)', '/ˈdʒad.wal ˈza.ma.niː/', 'Cronograma', 'Trabalho', 'أرسلتُ الجدول الزمني للمشروع عبر البريد الإلكتروني.', 'Enviei o cronograma do projeto por e-mail.'],

  ['ar-a2-10', 'رسم (Rasm)', '/rasm/', 'Desenho / Pintura', 'Hobbies', 'الرسم بالألوان المائية هوايتي المفضلة في العطلة.', 'Pintar com aquarela é meu hobby favorito nas férias.'],
  ['ar-a2-10', 'قراءة (Qirāʾa)', '/qiˈraː.ʔa/', 'Leitura', 'Hobbies', 'تساعدني القراءة المسائية على الاسترخاء.', 'A leitura noturna me ajuda a relaxar.'],
  ['ar-a2-10', 'أعتذر (Aʿtadhir)', '/aʕˈta.ðir/', 'Peço desculpas / Lamento', 'Cortesia', 'أعتذر عن عدم الحضور اليوم بسبب ارتباط عائلي.', 'Peço desculpas por não comparecer hoje devido a um compromisso familiar.'],

  // ==================== V5-A2 (ar-v5-a2-1 .. ar-v5-a2-10) ====================
  ['ar-v5-a2-1', 'ازدحام مروري (Izdiḥām murūrī)', '/iz.diˈħaːm muˈruː.riː/', 'Engarrafamento / Trânsito intenso', 'Trânsito', 'تأخرنا بسبب ازدحام مروري شديد على الجسر.', 'Atrasamo-nos por causa de um engarrafamento intenso na ponte.'],
  ['ar-v5-a2-1', 'إشارة مرور (Ishārat murūr)', '/iˈʃaː.rat muˈruːr/', 'Semáforo', 'Trânsito', 'توقّفْ عند إشارة المرور الحمراء دائماً.', 'Pare sempre no semáforo vermelho.'],
  ['ar-v5-a2-1', 'موقف سيارات (Mawqif sayyārāt)', '/ˈmaw.qif saj.jaːˈraːt/', 'Estacionamento', 'Trânsito', 'بحثنا عن موقف سيارات قريب من المركز التجاري.', 'Procuramos um estacionamento perto do shopping.'],

  ['ar-v5-a2-2', 'كمون (Kammūn)', '/kamˈmuːn/', 'Cominho', 'Culinária', 'نضيف الكمون والكزبرة إلى حساء العدس.', 'Adicionamos cominho e coentro à sopa de lentilhas.'],
  ['ar-v5-a2-2', 'زيت زيتون (Zayt zaytūn)', '/zajt zajˈtuːn/', 'Azeite de oliva', 'Culinária', 'يُستخدم زيت الزيتون البكر في تحضير الحمص.', 'O azeite de oliva extravirgem é usado no preparo do homus.'],
  ['ar-v5-a2-2', 'نغلي (Naghlī)', '/ˈnaɣ.liː/', 'Nós fervemos', 'Culinária', 'نغلي الماء أولاً ثم نضيف أوراق النعناع.', 'Fervemos a água primeiro e depois adicionamos folhas de hortelã.'],

  ['ar-v5-a2-3', 'هوية (Huwiyya)', '/huˈwij.ja/', 'Documento de identidade', 'Documentos', 'أبرزتُ بطاقة الهوية عند شباك الخدمات.', 'Apresentei o documento de identidade no guichê de atendimento.'],
  ['ar-v5-a2-3', 'موعد مسبق (Mawʿid musbaq)', '/ˈmaw.ʕid ˈmus.baq/', 'Agendamento prévio', 'Serviços', 'تتطلب هذه الدائرة موعداً مسبقاً عبر الموقع.', 'Este órgão exige agendamento prévio pelo site.'],
  ['ar-v5-a2-3', 'تصديق (Taṣdīq)', '/tasˤˈdiːq/', 'Autenticação / Reconhecimento', 'Documentos', 'أحتاج إلى تصديق الشهادة من وزارة الخارجية.', 'Preciso da autenticação do certificado pelo Ministério das Relações Exteriores.'],

  ['ar-v5-a2-4', 'مكيّف (Mukayyif)', '/muˈkaj.jif/', 'Ar-condicionado', 'Manutenção', 'توقّف المكيّف عن التبريد في عزّ الصيف.', 'O ar-condicionado parou de gelar no auge do verão.'],
  ['ar-v5-a2-4', 'انقطاع الكهرباء (Inqiṭāʿ al-kahrabāʾ)', '/in.qiˈtˤaːʕ al.kah.raˈbaːʔ/', 'Queda de energia', 'Manutenção', 'حدث انقطاع الكهرباء في الحي لمدة ساعتين.', 'Houve uma queda de energia no bairro por duas horas.'],
  ['ar-v5-a2-4', 'زيارة فنية (Ziyāra fanniyya)', '/ziˈjaː.ra fanˈnij.ja/', 'Visita técnica', 'Manutenção', 'حجزنا زيارة فنية لفحص الأنابيب غداً صباحاً.', 'Agendamos uma visita técnica para inspecionar os canos amanhã de manhã.'],

  ['ar-v5-a2-5', 'متابعة (Mutābaʿa)', '/muˈtaː.ba.ʕa/', 'Seguir / Acompanhamento', 'Redes Sociais', 'أقوم بمتابعة صفحات الأخبار العلمية الموثوقة.', 'Eu sigo páginas confiáveis de notícias científicas.'],
  ['ar-v5-a2-5', 'خبر عاجل (Khabar ʿājil)', '/ˈxa.bar ˈʕaː.dʒil/', 'Notícia de última hora', 'Notícias', 'ظهر خبر عاجل عن افتتاح الخط الجديد للقطار.', 'Apareceu uma notícia de última hora sobre a inauguração da nova linha de trem.'],
  ['ar-v5-a2-5', 'رابط (Rābiṭ)', '/ˈraː.bitˤ/', 'Link', 'Tecnologia', 'أرسلتُ لك رابط المقال في رسالة قصيرة.', 'Enviei-lhe o link do artigo em uma mensagem curta.'],

  ['ar-v5-a2-6', 'طاقة شمسية (Ṭāqa shamsiyya)', '/ˈtˤaː.qa ʃamˈsij.ja/', 'Energia solar', 'Meio Ambiente', 'تعتمد بعض المباني الحديثة على الطاقة الشمسية.', 'Alguns edifícios modernos dependem de energia solar.'],
  ['ar-v5-a2-6', 'بلاستيك (Blāstīk)', '/blaːsˈtiːk/', 'Plástico', 'Meio Ambiente', 'نقلّل استخدام أكياس البلاستيك عند التسوق.', 'Reduzimos o uso de sacolas de plástico ao fazer compras.'],
  ['ar-v5-a2-6', 'تشجير (Tashjīr)', '/taʃˈdʒiːr/', 'Arborização / Plantio de árvores', 'Meio Ambiente', 'شاركت المدارس في حملة تشجير الحديقة العامة.', 'As escolas participaram da campanha de arborização do parque público.'],

  ['ar-v5-a2-7', 'هدية (Hadiyya)', '/haˈdij.ja/', 'Presente', 'Festas', 'أحضرتُ هدية رمزية لصديقي في عيد ميلاده.', 'Trouxe um presente simbólico para meu amigo no aniversário dele.'],
  ['ar-v5-a2-7', 'حفل زفاف (Ḥafl zifāf)', '/ħafl ziˈfaːf/', 'Festa de casamento', 'Festas', 'دُعينا إلى حفل زفاف تقليدي مليء بالموسيقى.', 'Fomos convidados para uma festa de casamento tradicional cheia de música.'],
  ['ar-v5-a2-7', 'ضيوف (Ḍuyūf)', '/dˤuˈjuːf/', 'Convidados', 'Festas', 'استقبلت الأسرة الضيوف بالقهوة والتمر.', 'A família recebeu os convidados com café e tâmaras.'],

  ['ar-v5-a2-8', 'واجب منزلي (Wājib manzilī)', '/ˈwaː.dʒib man.ziˈliː/', 'Lição de casa', 'Educação', 'أنهيتُ الواجب المنزلي قبل حضور الدرس المباشر.', 'Terminei a lição de casa antes de assistir à aula ao vivo.'],
  ['ar-v5-a2-8', 'منصة تعليمية (Minaṣṣa taʿlīmiyya)', '/miˈnasˤ.sˤa taʕ.liːˈmij.ja/', 'Plataforma educacional', 'Educação', 'سجّلتُ في منصة تعليمية لتعلّم البرمجة.', 'Inscrevi-me em uma plataforma educacional para aprender programação.'],
  ['ar-v5-a2-8', 'محاضرة (Muḥāḍara)', '/muˈħaː.dˤa.ra/', 'Palestra / Aula expositiva', 'Educação', 'كانت محاضرة اليوم عن تاريخ الأدب الأندلسي.', 'A palestra de hoje foi sobre a história da literatura andaluza.'],

  ['ar-v5-a2-9', 'دفع إلكتروني (Dafʿ iliktrūnī)', '/dafʕ i.lik.truːˈniː/', 'Pagamento eletrônico', 'Banco Digital', 'أفضّل الدفع الإلكتروني لسرعته وسهولته.', 'Prefiro o pagamento eletrônico pela sua rapidez e facilidade.'],
  ['ar-v5-a2-9', 'احتيال (Iḥtiyāl)', '/iħ.tiˈjaːl/', 'Fraude / Golpe', 'Segurança', 'لا تشارك بياناتك البنكية لتجنّب أي احتيال.', 'Não compartilhe seus dados bancários para evitar qualquer fraude.'],
  ['ar-v5-a2-9', 'تنبيه فوري (Tanbīh fawrī)', '/tanˈbiːh ˈfaw.riː/', 'Alerta imediato', 'Segurança', 'يصلني تنبيه فوري عند كل عملية شراء بالبطاقة.', 'Recebo um alerta imediato a cada compra com o cartão.'],

  ['ar-v5-a2-10', 'مخرج (Mukhrij)', '/ˈmux.ridʒ/', 'Diretor (de cinema)', 'Cinema', 'حاز المخرج على جائزة دولية عن فيلمه الأخير.', 'O diretor ganhou um prêmio internacional pelo seu último filme.'],
  ['ar-v5-a2-10', 'عرض أول (ʿArḍ awwal)', '/ʕardˤ ˈaw.wal/', 'Estreia', 'Cinema', 'حجزنا تذاكر العرض الأول في قاعة السينما.', 'Reservamos ingressos para a estreia na sala de cinema.'],
  ['ar-v5-a2-10', 'عزف (ʿAzf)', '/ʕazf/', 'Execução musical / Tocar instrumento', 'Música', 'استمتع الجمهور بعزف العود في المسرح.', 'O público apreciou a execução de alaúde no teatro.'],

  // ==================== B1 (ar-b1-1 .. ar-b1-10) ====================
  ['ar-b1-1', 'تواصلَ (Tawāṣala)', '/taˈwaː.sˤa.la/', 'Comunicar-se', 'Verbos Derivados', 'تواصلَ الفريق مع العميل لحل المشكلة سريعاً.', 'A equipe comunicou-se com o cliente para resolver o problema rapidamente.'],
  ['ar-b1-1', 'استخرجَ (Istakhraja)', '/isˈtax.ra.dʒa/', 'Extrair / Emitir', 'Verbos Derivados', 'استخرجَ الطالب شهادة القيد من الجامعة.', 'O estudante emitiu o atestado de matrícula na universidade.'],
  ['ar-b1-1', 'مصدر (Maṣdar)', '/ˈmasˤ.dar/', 'Substantivo verbal / Fonte', 'Gramática', 'تعلّمنا كيفية صياغة المصدر من الأفعال المزيدة.', 'Aprendemos como formar o substantivo verbal a partir dos verbos derivados.'],

  ['ar-b1-2', 'ظلَّ (Ẓalla)', '/ˈdˤal.la/', 'Permanecer / Continuar', 'Gramática', 'ظلَّ الجو معتدلاً طوال فصل الربيع.', 'O tempo permaneceu ameno durante toda a primavera.'],
  ['ar-b1-2', 'ليتَ (Layta)', '/ˈlaj.ta/', 'Quem me dera / Tomara', 'Gramática', 'ليتَ الوقت يتسع لقراءة كل هذه الكتب.', 'Quem me dera o tempo fosse suficiente para ler todos esses livros.'],
  ['ar-b1-2', 'لكنَّ (Lākinna)', '/laːˈkin.na/', 'Mas / Porém', 'Conectivos', 'المشروع صعب، لكنَّ النتائج تستحق الجهد.', 'O projeto é difícil, mas os resultados valem o esforço.'],

  ['ar-b1-3', 'تجنّبَ (Tajannaba)', '/taˈdʒan.na.ba/', 'Evitar', 'Ações', 'إذا غادرنا مبكراً فسوف نتجنّب الازدحام.', 'Se sairmos cedo, evitaremos o trânsito.'],
  ['ar-b1-3', 'خيار بديل (Khiyār badīl)', '/xiˈjaːr baˈdiːl/', 'Opção alternativa', 'Planejamento', 'إذا أُلغيت الرحلة، فسنبحث عن خيار بديل.', 'Se o voo for cancelado, buscaremos uma opção alternativa.'],
  ['ar-b1-3', 'شرط (Sharṭ)', '/ʃartˤ/', 'Condição', 'Gramática', 'أوافق على السفر بشرط أن نعود يوم الأحد.', 'Concordo em viajar com a condição de voltarmos no domingo.'],

  ['ar-b1-4', 'نُشرَ (Nushira)', '/ˈnu.ʃi.ra/', 'Foi publicado', 'Voz Passiva', 'نُشرَ التقرير السنوي في الجريدة الرسمية اليوم.', 'O relatório anual foi publicado no diário oficial hoje.'],
  ['ar-b1-4', 'بيان رسمي (Bayān rasmī)', '/baˈjaːn ˈras.miː/', 'Comunicado oficial', 'Imprensa', 'تمَّ إصدار بيان رسمي لتوضيح تفاصيل القرار.', 'Foi emitido um comunicado oficial para esclarecer os detalhes da decisão.'],
  ['ar-b1-4', 'اعتماد (Iʿtimād)', '/iʕ.tiˈmaːd/', 'Aprovação / Adoção', 'Gestão', 'تمَّ اعتماد الميزانية الجديدة في الاجتماع الأخير.', 'O novo orçamento foi aprovado na última reunião.'],

  ['ar-b1-5', 'اللواتي (Allawātī)', '/al.laˈwaː.tiː/', 'As quais (fem. pl.)', 'Gramática', 'الطبيبات اللواتي شاركن في المؤتمر قدّمن أبحاثاً قيمة.', 'As médicas que participaram da conferência apresentaram pesquisas valiosas.'],
  ['ar-b1-5', 'حيثُ (Ḥaythu)', '/ˈħaj.θu/', 'Onde / Visto que', 'Conectivos', 'زرتُ الحي الذي نشأتُ فيه حيثُ ما زال بيتنا قائماً.', 'Visitei o bairro onde cresci, onde nossa casa ainda está de pé.'],
  ['ar-b1-5', 'تفصيل (Tafṣīl)', '/tafˈsˤiːl/', 'Detalhe', 'Discurso', 'الشرح الذي قدّمه المحاضر يوضح كل تفصيل مهم.', 'A explicação que o palestrante apresentou esclarece cada detalhe importante.'],

  ['ar-b1-6', 'علاوة على ذلك (ʿIlāwatan ʿalā dhālik)', '/ʕiˈlaː.wa.tan ˈʕa.laː ˈðaː.lik/', 'Além disso', 'Conectivos', 'المكان هادئ، وعلاوة على ذلك فخدمته ممتازة.', 'O lugar é tranquilo e, além disso, o atendimento é excelente.'],
  ['ar-b1-6', 'بسبب (Bi-sabab)', '/biˈsa.bab/', 'Por causa de / Devido a', 'Causa', 'تأخر المشروع بسبب نقص المواد الأولية.', 'O projeto atrasou por causa da falta de matérias-primas.'],
  ['ar-b1-6', 'من جهة أخرى (Min jihatin ukhrā)', '/min ˈdʒi.ha.tin ˈux.raː/', 'Por outro lado', 'Contraste', 'العمل عن بُعد مرن، ومن جهة أخرى يتطلب انضباطاً.', 'O trabalho remoto é flexível; por outro lado, exige disciplina.'],

  ['ar-b1-7', 'سيرة ذاتية (Sīra dhātiyya)', '/ˈsiː.ra ðaːˈtij.ja/', 'Currículo', 'Carreira', 'أرسلتُ سيرتي الذاتية المحدّثة إلى قسم الموارد البشرية.', 'Enviei meu currículo atualizado ao departamento de recursos humanos.'],
  ['ar-b1-7', 'مؤهلات (Muʾahhilāt)', '/mu.ʔah.hiˈlaːt/', 'Qualificações', 'Carreira', 'تتطابق مؤهلاتي الأكاديمية مع متطلبات الوظيفة.', 'Minhas qualificações acadêmicas correspondem aos requisitos da vaga.'],
  ['ar-b1-7', 'نقاط القوة (Niqāṭ al-quwwa)', '/niˈqaːtˤ alˈquw.wa/', 'Pontos fortes', 'Entrevista', 'من أبرز نقاط القوة لديّ العمل المنظم تحت الضغط.', 'Entre os meus principais pontos fortes está o trabalho organizado sob pressão.'],

  ['ar-b1-8', 'تعويض (Taʿwīḍ)', '/taʕˈwiːdˤ/', 'Indenização / Compensação', 'Atendimento', 'طلب العميل تعويضاً مناسباً عن تأخر الشحنة.', 'O cliente pediu uma compensação adequada pelo atraso da remessa.'],
  ['ar-b1-8', 'خدمة العملاء (Khidmat al-ʿumalāʾ)', '/ˈxid.mat al.ʕu.maˈlaːʔ/', 'Atendimento ao cliente', 'Suporte', 'تواصلتُ مع خدمة العملاء لإلغاء الطلب الخاطئ.', 'Entrei em contato com o atendimento ao cliente para cancelar o pedido errado.'],
  ['ar-b1-8', 'عيب تصنيع (ʿAyb taṣnīʿ)', '/ʕajb tasˤˈniːʕ/', 'Defeito de fabricação', 'Suporte', 'اكتشفنا عيب تصنيع في الجهاز منذ اليوم الأول.', 'Descobrimos um defeito de fabricação no aparelho desde o primeiro dia.'],

  ['ar-b1-9', 'يتعيّن على (Yataʿayyanu ʿalā)', '/ja.taˈʕaj.ja.nu ˈʕa.laː/', 'É necessário / Deve-se', 'Obrigação', 'يتعيّن على المسافرين الوصول قبل الرحلة بساعتين.', 'É necessário que os passageiros cheguem duas horas antes do voo.'],
  ['ar-b1-9', 'من المحتمل (Min al-muḥtamal)', '/min al.muħˈta.mal/', 'É provável', 'Probabilidade', 'من المحتمل أن يتغير الطقس في ساعات المساء.', 'É provável que o tempo mude nas horas da noite.'],
  ['ar-b1-9', 'يُنصح بـ (Yunṣaḥu bi)', '/ˈjun.sˤa.ħu bi/', 'Recomenda-se', 'Conselho', 'يُنصح بحفظ نسخة من الوثائق المهمة دائماً.', 'Recomenda-se guardar sempre uma cópia dos documentos importantes.'],

  ['ar-b1-10', 'موروث ثقافي (Mawrūth thaqāfī)', '/mawˈruːθ θaˈqaː.fiː/', 'Patrimônio cultural', 'Cultura', 'تحافظ المدن القديمة على موروث ثقافي غني.', 'As cidades antigas preservam um rico patrimônio cultural.'],
  ['ar-b1-10', 'لهجة محلية (Lahja maḥalliyya)', '/ˈlah.dʒa ma.ħalˈlij.ja/', 'Dialeto local', 'Língua', 'تختلف اللهجة المحلية قليلاً من بلد عربي إلى آخر.', 'O dialeto local varia um pouco de um país árabe para outro.'],
  ['ar-b1-10', 'ترحيب (Tarḥīb)', '/tarˈħiːb/', 'Acolhimento / Boas-vindas', 'Cultura', 'لقينا ترحيباً حاراً من أهل الحي منذ اليوم الأول.', 'Recebemos um acolhimento caloroso dos moradores do bairro desde o primeiro dia.'],

  // ==================== V5-B1 (ar-v5-b1-1 .. ar-v5-b1-10) ====================
  ['ar-v5-b1-1', 'تنسيق (Tansīq)', '/tanˈsiːq/', 'Coordenação / Alinhamento', 'Trabalho', 'نجح المشروع بفضل التنسيق المستمر بين الأقسام.', 'O projeto teve sucesso graças à coordenação contínua entre os departamentos.'],
  ['ar-v5-b1-1', 'متابعة التقدم (Mutābaʿat at-taqaddum)', '/muˈtaː.ba.ʕat at.taˈqad.dum/', 'Acompanhamento do progresso', 'Trabalho', 'نعقد اجتماعاً أسبوعياً لمتابعة التقدم في المهام.', 'Realizamos uma reunião semanal para acompanhar o progresso das tarefas.'],
  ['ar-v5-b1-1', 'أولوية قصوى (Awlawiyya quṣwā)', '/aw.laˈwij.ja ˈqusˤ.waː/', 'Prioridade máxima', 'Gestão', 'منحنا إصلاح الخلل التقني أولوية قصوى اليوم.', 'Demos prioridade máxima hoje à correção da falha técnica.'],

  ['ar-v5-b1-2', 'نشاط بدني (Nashāṭ badanī)', '/naˈʃaːtˤ ˈba.da.niː/', 'Atividade física', 'Saúde', 'يساعد النشاط البدني المنتظم على تحسين جودة النوم.', 'A atividade física regular ajuda a melhorar a qualidade do sono.'],
  ['ar-v5-b1-2', 'ضغط نفسي (Ḍaghṭ nafsī)', '/dˤaɣtˤ ˈnaf.siː/', 'Estresse psicológico', 'Bem-estar', 'تؤدي ساعات العمل الطويلة أحياناً إلى ضغط نفسي.', 'Longas jornadas de trabalho às vezes levam ao estresse psicológico.'],
  ['ar-v5-b1-2', 'تغذية سليمة (Taghdhiya salīma)', '/taɣˈði.ja saˈliː.ma/', 'Alimentação saudável', 'Saúde', 'تبدأ الوقاية من الأمراض باتباع تغذية سليمة.', 'A prevenção de doenças começa seguindo uma alimentação saudável.'],

  ['ar-v5-b1-3', 'مدخرات (Muddakharāt)', '/mud.da.xaˈraːt/', 'Economias / Reservas', 'Finanças', 'خصصتُ جزءاً من مدخراتي لحالات الطوارئ.', 'Reservei parte das minhas economias para situações de emergência.'],
  ['ar-v5-b1-3', 'فائض مالي (Fāʾiḍ mālī)', '/ˈfaː.ʔidˤ ˈmaː.liː/', 'Superávit / Saldo positivo', 'Finanças', 'ساهم خفض النفقات في تحقيق فائض مالي شهري.', 'A redução de despesas contribuiu para alcançar um saldo positivo mensal.'],
  ['ar-v5-b1-3', 'استثمار (Istithmār)', '/is.tiθˈmaːr/', 'Investimento', 'Finanças', 'التعليم المستمر هو أفضل استثمار للمستقبل.', 'A educação contínua é o melhor investimento para o futuro.'],

  ['ar-v5-b1-4', 'بند تعاقدي (Band taʿāqudī)', '/band ta.ʕaː.quˈdiː/', 'Cláusula contratual', 'Moradia', 'راجعتُ كل بند تعاقدي قبل توقيع عقد الشقة.', 'Revisei cada cláusula contratual antes de assinar o contrato do apartamento.'],
  ['ar-v5-b1-4', 'اتحاد الملاك (Ittiḥād al-mullāk)', '/it.tiˈħaːd al.mulˈlaːk/', 'Condomínio / Associação de moradores', 'Moradia', 'يتولى اتحاد الملاك صيانة المصعد والمدخل.', 'O condomínio encarrega-se da manutenção do elevador e da entrada.'],
  ['ar-v5-b1-4', 'تسليم المفاتيح (Taslīm al-mafātīḥ)', '/tasˈliːm al.ma.faːˈtiːħ/', 'Entrega das chaves', 'Moradia', 'تمَّ تسليم المفاتيح بعد توثيق العقد رسمياً.', 'A entrega das chaves ocorreu após o registro oficial do contrato.'],

  ['ar-v5-b1-5', 'قاعة مؤتمرات (Qāʿat muʾtamarāt)', '/ˈqaː.ʕat muʔ.ta.maˈraːt/', 'Sala de conferências', 'Eventos', 'حجزت الشركة قاعة مؤتمرات مجهزة للعرض.', 'A empresa reservou uma sala de conferências equipada para a apresentação.'],
  ['ar-v5-b1-5', 'شبكة علاقات (Shabakat ʿalāqāt)', '/ˈʃa.ba.kat ʕa.laːˈqaːt/', 'Rede de contatos (networking)', 'Negócios', 'تساعد المؤتمرات على بناء شبكة علاقات مهنية واسعة.', 'As conferências ajudam a construir uma ampla rede de contatos profissionais.'],
  ['ar-v5-b1-5', 'بطاقة تعريف (Biṭāqat taʿrīf)', '/biˈtˤaː.qat taʕˈriːf/', 'Crachá / Cartão de identificação', 'Eventos', 'استلمتُ بطاقة التعريف عند مدخل المعرض.', 'Recebi o crachá de identificação na entrada da feira.'],

  ['ar-v5-b1-6', 'تقرير إخباري (Taqrīr ikhbārī)', '/taqˈriːr ixˈbaː.riː/', 'Reportagem', 'Imprensa', 'تناول التقرير الإخباري التحولات في سوق العمل.', 'A reportagem abordou as transformações no mercado de trabalho.'],
  ['ar-v5-b1-6', 'حلقة صوتية (Ḥalqa ṣawtiyya)', '/ˈħal.qa sˤawˈtij.ja/', 'Episódio (de podcast)', 'Mídia', 'استمعتُ إلى حلقة صوتية ممتعة أثناء السفر.', 'Ouvi um episódio de podcast interessante durante a viagem.'],
  ['ar-v5-b1-6', 'وجهة نظر (Wijhat naẓar)', '/ˈwidʒ.hat ˈna.dˤar/', 'Ponto de vista', 'Opinião', 'عبّر الضيف عن وجهة نظره بوضوح وهدوء.', 'O convidado expressou seu ponto de vista com clareza e calma.'],

  ['ar-v5-b1-7', 'تحديث النظام (Taḥdīth an-niẓām)', '/taħˈdiːθ an.niˈdˤaːm/', 'Atualização do sistema', 'Tecnologia', 'يُصلح تحديث النظام الأخير مشكلات الأمان.', 'A última atualização do sistema corrige problemas de segurança.'],
  ['ar-v5-b1-7', 'خصوصية البيانات (Khuṣūṣiyyat al-bayānāt)', '/xu.sˤuːˈsˤij.jat al.ba.jaːˈnaːt/', 'Privacidade de dados', 'Tecnologia', 'تحمي الإعدادات الجديدة خصوصية البيانات الشخصية.', 'As novas configurações protegem a privacidade dos dados pessoais.'],
  ['ar-v5-b1-7', 'مصادقة ثنائية (Muṣādaqa thunāʾiyya)', '/muˈsˤaː.da.qa θu.naːˈʔij.ja/', 'Autenticação em dois fatores', 'Segurança', 'فعّلتُ المصادقة الثنائية لحماية حسابي البريدي.', 'Ativei a autenticação em dois fatores para proteger minha conta de e-mail.'],

  ['ar-v5-b1-8', 'معلم تاريخي (Maʿlam tārīkhī)', '/ˈmaʕ.lam taːˈriː.xiː/', 'Monumento histórico', 'Arquitetura', 'يُعدّ هذا المسجد الأثري أبرز معلم تاريخي في المدينة.', 'Esta mesquita histórica é o monumento mais marcante da cidade.'],
  ['ar-v5-b1-8', 'تخطيط عمراني (Takhṭīṭ ʿumrānī)', '/taxˈtˤiːtˤ ʕumˈraː.niː/', 'Planejamento urbano', 'Urbanismo', 'يجمع التخطيط العمراني الحديث بين الحدائق والمباني.', 'O planejamento urbano moderno combina parques e edifícios.'],
  ['ar-v5-b1-8', 'أصالة ومعاصرة (Aṣāla wa muʿāṣara)', '/aˈsˤaː.la wa muˈʕaː.sˤa.ra/', 'Tradição e contemporaneidade', 'Cultura', 'تجمع هذه العمارة بين أصالة ومعاصرة في التصميم.', 'Esta arquitetura combina tradição e contemporaneidade no design.'],

  ['ar-v5-b1-9', 'مبادرة مجتمعية (Mubādara mujtamaʿiyya)', '/muˈbaː.da.ra mudʒ.ta.maˈʕij.ja/', 'Iniciativa comunitária', 'Comunidade', 'أطلق الشباب مبادرة مجتمعية لتنظيف الشاطئ.', 'Os jovens lançaram uma iniciativa comunitária para limpar a praia.'],
  ['ar-v5-b1-9', 'تبرّع (Tabarruʿ)', '/taˈbar.ruʕ/', 'Doação', 'Solidariedade', 'ساهم كل تبرّع في توفير الكتب للمكتبة المحلية.', 'Cada doação contribuiu para fornecer livros à biblioteca local.'],
  ['ar-v5-b1-9', 'أثر إيجابي (Athar ījābī)', '/ˈa.θar iːˈdʒaː.biː/', 'Impacto positivo', 'Sociedade', 'ترك المشروع التطوعي أثراً إيجابياً في حياة السكان.', 'O projeto voluntário deixou um impacto positivo na vida dos moradores.'],

  ['ar-v5-b1-10', 'تطوير الذات (Taṭwīr adh-dhāt)', '/tatˤˈwiːr aðˈðaːt/', 'Desenvolvimento pessoal', 'Carreira', 'أخصّص وقتاً أسبوعياً لتطوير الذات واكتساب مهارات.', 'Dedico um tempo semanal ao desenvolvimento pessoal e aquisição de habilidades.'],
  ['ar-v5-b1-10', 'تدريب مهني (Tadrīb mihanī)', '/tadˈriːb ˈmi.ha.niː/', 'Capacitação profissional', 'Carreira', 'التحقتُ ببرنامج تدريب مهني في إدارة المشاريع.', 'Ingressei em um programa de capacitação profissional em gestão de projetos.'],
  ['ar-v5-b1-10', 'مسار وظيفي (Masār waẓīfī)', '/maˈsaːr waˈdˤiː.fiː/', 'Trajetória profissional', 'Carreira', 'خطّطتُ لمسار وظيفي واضح للسنوات الخمس القادمة.', 'Planejei uma trajetória profissional clara para os próximos cinco anos.'],

  // ==================== IDIOMS & SLANG B1 ====================
  ['ar-idioms-b1', 'في لمح البصر (Fī lamḥ al-baṣar)', '/fiː lamħ alˈba.sˤar/', 'Num piscar de olhos', 'Expressões', 'انتهت الإجازة الصيفية في لمح البصر.', 'As férias de verão terminaram num piscar de olhos.'],
  ['ar-idioms-b1', 'عصفورين بحجر واحد (ʿUṣfūrayn bi-ḥajar wāḥid)', '/ʕusˤ.fuːˈrajn biˈħa.dʒar ˈwaː.ħid/', 'Dois coelhos com uma cajadada só', 'Expressões', 'بهذا الحل ضربنا عصفورين بحجر واحد.', 'Com esta solução, matamos dois coelhos com uma cajadada só.'],

  ['ar-slang-b1', 'يعطيك العافية (Yaʿṭīk al-ʿāfiya)', '/jaʕˈtˤiːk alˈʕaː.fi.ja/', 'Bom trabalho / Deus te dê saúde', 'Gírias', 'يعطيك العافية على هذا المجهود الكبير اليوم!', 'Bom trabalho por esse grande esforço hoje!'],
  ['ar-slang-b1', 'ما في مشكلة (Mā fī mushkila)', '/maː fiː ˈmuʃ.ki.la/', 'Sem problemas / Tudo bem', 'Gírias', 'ما في مشكلة، نؤجّل اللقاء إلى الغد.', 'Sem problemas, adiamos o encontro para amanhã.'],

  // ==================== B2 (ar-b2-1 .. ar-b2-10) ====================
  ['ar-b2-1', 'تداركَ (Tadāraka)', '/taˈdaː.ra.ka/', 'Remediar / Corrigir a tempo', 'Verbos', 'لو تداركنا الخطأ مبكراً لما خسرنا الوقت.', 'Se tivéssemos remediado o erro cedo, não teríamos perdido tempo.'],
  ['ar-b2-1', 'مآل (Maʾāl)', '/maˈʔaːl/', 'Desfecho / Consequência', 'Argumentação', 'لولا التخطيط الحكيم لتغيّر مآل المشروع كله.', 'Não fosse o planejamento sábio, o desfecho de todo o projeto teria mudado.'],
  ['ar-b2-1', 'فرصة ضائعة (Furṣa ḍāʾiʿa)', '/ˈfur.sˤa ˈdˤaː.ʔi.ʕa/', 'Oportunidade perdida', 'Expressões', 'لو وافقنا على العرض حينها لما كانت فرصة ضائعة.', 'Se tivéssemos aceitado a proposta naquela época, não teria sido uma oportunidade perdida.'],

  ['ar-b2-2', 'سعياً إلى (Saʿyan ilā)', '/ˈsaʕ.jan ˈi.laː/', 'Em busca de / Visando a', 'Estilo Formal', 'أطلقنا المبادرة سعياً إلى رفع جودة التعليم.', 'Lançamos a iniciativa visando elevar a qualidade do ensino.'],
  ['ar-b2-2', 'ازدادَ وضوحاً (Izdāda wuḍūḥan)', '/izˈdaː.da wuˈdˤuː.ħan/', 'Tornou-se mais claro', 'Gramática', 'ازدادت الفكرة وضوحاً بعد عرض البيانات الإحصائية.', 'A ideia tornou-se mais clara após a apresentação dos dados estatísticos.'],
  ['ar-b2-2', 'متأنّياً (Mutaʾanniyan)', '/mu.taˈʔan.ni.jan/', 'De modo cauteloso / ponderado', 'Estilo Formal', 'تحدّث القاضي متأنّياً قبل إعلان الحكم النهائي.', 'O juiz falou de modo ponderado antes de anunciar a sentença final.'],

  ['ar-b2-3', 'بيئة عمل مرنة (Bīʾat ʿamal marina)', '/ˈbiː.ʔat ˈʕa.mal ˈma.ri.na/', 'Ambiente de trabalho flexível', 'Mercado de Trabalho', 'تفضّل الأجيال الشابة بيئة عمل مرنة ومبتكرة.', 'As gerações jovens preferem um ambiente de trabalho flexível e inovador.'],
  ['ar-b2-3', 'توازن مهني (Tawāzun mihanī)', '/taˈwaː.zun ˈmi.ha.niː/', 'Equilíbrio profissional', 'Mercado de Trabalho', 'يسهم العمل الهجين في تعزيز التوازن المهني والشخصي.', 'O trabalho híbrido contribui para fortalecer o equilíbrio profissional e pessoal.'],
  ['ar-b2-3', 'مقارنةً بـ (Muqāranatan bi)', '/muˈqaː.ra.na.tan bi/', 'Em comparação com', 'Debate', 'ارتفعت الإنتاجية مقارنةً بالربع الأول من العام.', 'A produtividade subiu em comparação com o primeiro trimestre do ano.'],

  ['ar-b2-4', 'تحقّق من الحقائق (Taḥaqquq min al-ḥaqāʾiq)', '/taˈħaq.quq min al.ħaˈqaː.ʔiq/', 'Checagem de fatos', 'Jornalismo', 'يعتمد الصحفيون على التحقّق من الحقائق قبل النشر.', 'Os jornalistas baseiam-se na checagem de fatos antes de publicar.'],
  ['ar-b2-4', 'مصدر موثوق (Maṣdar mawthūq)', '/ˈmasˤ.dar mawˈθuːq/', 'Fonte confiável', 'Mídia', 'لا تنقل أي خبر إلا عن مصدر موثوق ومحايد.', 'Não repasse nenhuma notícia a não ser de uma fonte confiável e imparcial.'],
  ['ar-b2-4', 'انحياز إعلامي (Inḥiyāz iʿlāmī)', '/in.ħiˈjaːz iʕˈlaː.miː/', 'Viés midiático', 'Mídia', 'يكشف القارئ الواعي أي انحياز إعلامي في التغطية.', 'O leitor consciente detecta qualquer viés midiático na cobertura.'],

  ['ar-b2-5', 'بصمة كربونية (Baṣma karbūniyya)', '/ˈbasˤ.ma kar.buːˈnij.ja/', 'Pegada de carbono', 'Sustentabilidade', 'تسعى المدن الذكية إلى تقليص البصمة الكربونية.', 'As cidades inteligentes buscam reduzir a pegada de carbono.'],
  ['ar-b2-5', 'نقل عام مستدام (Naql ʿāmm mustadām)', '/naql ʕaːmm mus.taˈdaːm/', 'Transporte público sustentável', 'Urbanismo', 'يقلّل النقل العام المستدام من الازدحام والتلوث.', 'O transporte público sustentável reduz o congestionamento e a poluição.'],
  ['ar-b2-5', 'كفاءة الطاقة (Kafāʾat aṭ-ṭāqa)', '/kaˈfaː.ʔat atˤˈtˤaː.qa/', 'Eficiência energética', 'Sustentabilidade', 'ترفع المباني الخضراء كفاءة الطاقة بشكل ملحوظ.', 'Os edifícios verdes elevam a eficiência energética de forma notável.'],

  ['ar-b2-6', 'أخلاقيات البيانات (Akhlāqiyyāt al-bayānāt)', '/ax.laː.qijˈjaːt al.ba.jaːˈnaːt/', 'Ética de dados', 'Tecnologia', 'تفرض المؤسسات معايير صارمة لحماية أخلاقيات البيانات.', 'As instituições impõem padrões rigorosos para proteger a ética de dados.'],
  ['ar-b2-6', 'ابتكار مسؤول (Ibtikār masʾūl)', '/ib.tiˈkaːr masˈʔuːl/', 'Inovação responsável', 'Tecnologia', 'يتطلب تطوير الذكاء الاصطناعي التزاماً بالابتكار المسؤول.', 'O desenvolvimento da inteligência artificial exige compromisso com a inovação responsável.'],
  ['ar-b2-6', 'تحوّل رقمي (Taḥawwul raqmī)', '/taˈħaw.wul ˈraq.miː/', 'Transformação digital', 'Tecnologia', 'ساهم التحوّل الرقمي في تسريع الخدمات الحكومية.', 'A transformação digital contribuiu para acelerar os serviços governamentais.'],

  ['ar-b2-7', 'تنازل متبادل (Tanāzul mutabādal)', '/taˈnaː.zul mu.taˈbaː.dal/', 'Concessão mútua', 'Negociação', 'وصل الطرفان إلى اتفاق بعد تنازل متبادل مدروس.', 'As duas partes chegaram a um acordo após uma concessão mútua bem pensada.'],
  ['ar-b2-7', 'صلاحية العقد (Ṣalāḥiyyat al-ʿaqd)', '/sˤa.laːˈħij.jat alˈʕaqd/', 'Vigência do contrato', 'Contratos', 'تمتد صلاحية العقد لمدة ثلاث سنوات قابلة للتجديد.', 'A vigência do contrato estende-se por três anos renováveis.'],
  ['ar-b2-7', 'تسوية مالية (Taswiya māliyya)', '/ˈtas.wi.ja maːˈlij.ja/', 'Acerto / Liquidação financeira', 'Finanças', 'أُنجزت التسوية المالية وفق الجدول المتفق عليه.', 'A liquidação financeira foi concluída conforme o cronograma acordado.'],

  ['ar-b2-8', 'احتواء الأزمة (Iḥtiwāʾ al-azma)', '/iħ.tiˈwaːʔ alˈaz.ma/', 'Contenção da crise', 'Gestão de Crises', 'تعاونت الفرق الميدانية لاحتواء الأزمة في الساعات الأولى.', 'As equipes de campo cooperaram para conter a crise nas primeiras horas.'],
  ['ar-b2-8', 'شفافية مطلقة (Shafāfiyya muṭlaqa)', '/ʃa.faːˈfij.ja ˈmutˤ.la.qa/', 'Transparência absoluta', 'Comunicação', 'تحدّثت الإدارة بشفافية مطلقة أمام وسائل الإعلام.', 'A diretoria falou com transparência absoluta perante a imprensa.'],
  ['ar-b2-8', 'خطة طوارئ (Khuṭṭat ṭawāriʾ)', '/ˈxutˤ.tˤat tˤaˈwaː.riʔ/', 'Plano de contingência', 'Gestão de Crises', 'فعّلت الشركة خطة طوارئ لضمان استمرار العمل.', 'A empresa ativou um plano de contingência para garantir a continuidade do trabalho.'],

  ['ar-b2-9', 'صون الآثار (Ṣawn al-āthār)', '/sˤawn al.aːˈθaːr/', 'Preservação de monumentos', 'Patrimônio', 'يتطلب صون الآثار تعاون الخبراء والمجتمع المحلي.', 'A preservação de monumentos exige a cooperação de especialistas e da comunidade local.'],
  ['ar-b2-9', 'سياحة بيئية (Siyāḥa bīʾiyya)', '/siˈjaː.ħa biːˈʔij.ja/', 'Ecoturismo', 'Turismo', 'تُشجّع المحميات الطبيعية على تنمية السياحة البيئية.', 'As reservas naturais incentivam o desenvolvimento do ecoturismo.'],
  ['ar-b2-9', 'حرف يدوية (Ḥiraf yadawiyya)', '/ˈħi.raf ja.daˈwij.ja/', 'Artesanato', 'Cultura', 'تشتهر الأسواق التقليدية بعرض حرف يدوية متقنة.', 'Os mercados tradicionais são famosos por exibir artesanato refinado.'],

  ['ar-b2-10', 'دلالة إحصائية (Dalāla iḥṣāʾiyya)', '/daˈlaː.la iħ.sˤaːˈʔij.ja/', 'Significância estatística', 'Pesquisa', 'أظهرت النتائج دلالة إحصائية واضحة بين المتغيرين.', 'Os resultados mostraram uma clara significância estatística entre as duas variáveis.'],
  ['ar-b2-10', 'فرضية البحث (Faraḍiyyat al-baḥth)', '/fa.raˈdˤij.jat alˈbaħθ/', 'Hipótese da pesquisa', 'Academia', 'أكّدت التجارب الميدانية صحة فرضية البحث.', 'Os experimentos de campo confirmaram a validade da hipótese da pesquisa.'],
  ['ar-b2-10', 'توصية عملية (Tawṣiya ʿamaliyya)', '/ˈtaw.sˤi.ja ʕa.maˈlij.ja/', 'Recomendação prática', 'Relatórios', 'اختُتمت الدراسة بتقديم توصية عملية لصناع القرار.', 'O estudo foi concluído com a apresentação de uma recomendação prática aos tomadores de decisão.'],

  // ==================== V5-B2 (ar-v5-b2-1 .. ar-v5-b2-10) ====================
  ['ar-v5-b2-1', 'موافقة المريض (Muwāfaqat al-marīḍ)', '/muˈwaː.fa.qat al.maˈriːdˤ/', 'Consentimento do paciente', 'Medicina', 'لا يُجرى أي تدخل جراحي دون موافقة المريض المستنيرة.', 'Nenhuma intervenção cirúrgica é realizada sem o consentimento informado do paciente.'],
  ['ar-v5-b2-1', 'بديل علاجي (Badīl ʿilājī)', '/baˈdiːl ʕiˈlaː.dʒiː/', 'Alternativa terapêutica', 'Medicina', 'ناقش الطبيب كل بديل علاجي متاح مع الأسرة.', 'O médico discutiu cada alternativa terapêutica disponível com a família.'],
  ['ar-v5-b2-1', 'نشرة دوائية (Nashra dawāʾiyya)', '/ˈnaʃ.ra da.waːˈʔij.ja/', 'Bula de remédio', 'Farmácia', 'توضح النشرة الدوائية الجرعة الموصى بها بدقة.', 'A bula do remédio explica com precisão a dose recomendada.'],

  ['ar-v5-b2-2', 'رهن عقاري (Rahn ʿiqārī)', '/rahn ʕiˈqaː.riː/', 'Hipoteca / Financiamento imobiliário', 'Finanças', 'قارنت الأسرة شروط الرهن العقاري بين عدة بنوك.', 'A família comparou as condições de financiamento imobiliário entre vários bancos.'],
  ['ar-v5-b2-2', 'سعر الفائدة (Siʿr al-fāʾida)', '/siʕr alˈfaː.ʔi.da/', 'Taxa de juros', 'Finanças', 'يؤثر ارتفاع سعر الفائدة على تكلفة القروض الجديدة.', 'A alta da taxa de juros afeta o custo dos novos empréstimos.'],
  ['ar-v5-b2-2', 'تقييم المخاطر (Taqyīm al-makhāṭir)', '/taqˈjiːm al.maˈxaː.tˤir/', 'Avaliação de riscos', 'Finanças', 'يسبق أي استثمار كبير تقييم المخاطر المحتملة.', 'Qualquer grande investimento é precedido pela avaliação dos riscos potenciais.'],

  ['ar-v5-b2-3', 'تتبع الشحنات (Tatabbuʿ ash-shuḥnāt)', '/taˈtab.buʕ aʃ.ʃuħˈnaːt/', 'Rastreamento de remessas', 'Logística', 'يتيح المتجر الإلكتروني تتبع الشحنات لحظة بلحظة.', 'A loja virtual permite o rastreamento de remessas em tempo real.'],
  ['ar-v5-b2-3', 'تجربة المستخدم (Tajribat al-mustakhdim)', '/ˈtadʒ.ri.bat al.musˈtax.dim/', 'Experiência do usuário', 'E-commerce', 'يعزّز التصميم السلس تجربة المستخدم ويزيد المبيعات.', 'O design fluido melhora a experiência do usuário e aumenta as vendas.'],
  ['ar-v5-b2-3', 'تخليص جمركي (Takhlīṣ jumrukī)', '/taxˈliːsˤ dʒumˈru.kiː/', 'Desembaraço aduaneiro', 'Comércio Exterior', 'استغرق التخليص الجمركي للبضائع يومي عمل.', 'O desembaraço aduaneiro das mercadorias levou dois dias úteis.'],

  ['ar-v5-b2-4', 'محتوى مفتوح المصدر (Muḥtawā maftūḥ al-maṣdar)', '/muħˈta.waː mafˈtuːħ alˈmasˤ.dar/', 'Conteúdo de código/acesso aberto', 'Educação Digital', 'تساهم المنصات العربية في نشر محتوى مفتوح المصدر للجميع.', 'As plataformas árabes contribuem para difundir conteúdo de acesso aberto para todos.'],
  ['ar-v5-b2-4', 'تعريب المصطلحات (Taʿrīb al-muṣṭalaḥāt)', '/taʕˈriːb al.musˤ.tˤa.laˈħaːt/', 'Arabização de termos', 'Língua', 'تعمل المجامع اللغوية على تعريب المصطلحات العلمية الحديثة.', 'As academias linguísticas trabalham na arabização de termos científicos modernos.'],
  ['ar-v5-b2-4', 'تعلّم ذاتي (Taʿallum dhātī)', '/taˈʕal.lum ðaːˈtiː/', 'Autoaprendizagem', 'Educação', 'أصبح التعلّم الذاتي مهارة أساسية في العصر الرقمي.', 'A autoaprendizagem tornou-se uma habilidade essencial na era digital.'],

  ['ar-v5-b2-5', 'تعلم مدى الحياة (Taʿallum madā al-ḥayāh)', '/taˈʕal.lum ˈma.daː al.ħaˈjaːh/', 'Aprendizagem ao longo da vida', 'Carreira', 'تفرض التطورات التقنية تبنّي مبدأ التعلم مدى الحياة.', 'Os avanços tecnológicos impõem a adoção do princípio da aprendizagem ao longo da vida.'],
  ['ar-v5-b2-5', 'مهارات بشرية (Mahārāt bashariyya)', '/ma.haːˈraːt ba.ʃaˈrij.ja/', 'Habilidades humanas (soft skills)', 'Trabalho', 'تزداد أهمية المهارات البشرية كالتعاطف والقيادة.', 'Cresce a importância das habilidades humanas, como empatia e liderança.'],
  ['ar-v5-b2-5', 'تكيّف مهني (Takayyuf mihanī)', '/taˈkaj.juf ˈmi.ha.niː/', 'Adaptação profissional', 'Carreira', 'يساعد التدريب المستمر على سرعة التكيّف المهني.', 'A capacitação contínua ajuda na rapidez da adaptação profissional.'],

  ['ar-v5-b2-6', 'ريّ بالتنقيط (Rayy bit-tanqīṭ)', '/rajj bit.tanˈqiːtˤ/', 'Irrigação por gotejamento', 'Agricultura', 'يوفّر الريّ بالتنقيط كميات كبيرة من المياه الزراعية.', 'A irrigação por gotejamento economiza grandes quantidades de água agrícola.'],
  ['ar-v5-b2-6', 'جفاف (Jafāf)', '/dʒaˈfaːf/', 'Seca / Estiagem', 'Clima', 'تواجه بعض المناطق موجات جفاف متكررة بسبب تغيّر المناخ.', 'Algumas regiões enfrentam ondas de seca recorrentes devido às mudanças climáticas.'],
  ['ar-v5-b2-6', 'أمن غذائي (Amn ghidhāʾī)', '/amn ɣiˈðaː.ʔiː/', 'Segurança alimentar', 'Sustentabilidade', 'يرتبط الأمن المائي ارتباطاً وثيقاً بتحقيق الأمن الغذائي.', 'A segurança hídrica está intimamente ligada à conquista da segurança alimentar.'],

  ['ar-v5-b2-7', 'تصوير سينمائي (Taṣwīr sīnimāʾī)', '/tasˤˈwiːr siː.ni.maːˈʔiː/', 'Cinematografia / Fotografia de filme', 'Cinema', 'تميّز الفيلم بتصوير سينمائي بديع وإضاءة معبّرة.', 'O filme destacou-se pela bela cinematografia e iluminação expressiva.'],
  ['ar-v5-b2-7', 'أسلوب سردي (Uslūb sardī)', '/usˈluːb ˈsar.diː/', 'Estilo narrativo', 'Literatura', 'يجذب الأسلوب السردي الرشيق القارئ منذ الصفحة الأولى.', 'O estilo narrativo ágil atrai o leitor desde a primeira página.'],
  ['ar-v5-b2-7', 'مهرجان سينمائي (Mahrajān sīnimāʾī)', '/mah.raˈdʒaːn siː.ni.maːˈʔiː/', 'Festival de cinema', 'Cultura', 'عُرض الفيلم الوثائقي في مهرجان سينمائي عربي مرموق.', 'O documentário foi exibido em um prestigiado festival de cinema árabe.'],

  ['ar-v5-b2-8', 'قيمة مضافة حقيقية (Qīma muḍāfa ḥaqīqiyya)', '/ˈqiː.ma muˈdˤaː.fa ħa.qiːˈqij.ja/', 'Valor agregado real', 'Empreendedorismo', 'يبحث المستثمرون عن مشروع يقدّم قيمة مضافة حقيقية.', 'Os investidores buscam um projeto que ofereça valor agregado real.'],
  ['ar-v5-b2-8', 'تمويل تأسيسي (Tamwīl taʾsīsī)', '/tamˈwiːl taʔˈsiː.siː/', 'Capital semente (seed funding)', 'Startups', 'حصلت الشركة الناشئة على تمويل تأسيسي لتطوير المنتج.', 'A startup recebeu capital semente para desenvolver o produto.'],
  ['ar-v5-b2-8', 'جدوى اقتصادية (Jadwā iqtiṣādiyya)', '/ˈdʒad.waː iq.ti.sˤaːˈdij.ja/', 'Viabilidade econômica', 'Negócios', 'أثبتت الدراسة الجدوى الاقتصادية للمبادرة قبل إطلاقها.', 'O estudo comprovou a viabilidade econômica da iniciativa antes do lançamento.'],

  ['ar-v5-b2-9', 'توجيه مهني (Tawjīh mihanī)', '/tawˈdʒiːh ˈmi.ha.niː/', 'Mentoria / Orientação profissional', 'Liderança', 'يساعد التوجيه المهني الموظفين الجدد على الاندماج.', 'A mentoria profissional ajuda os novos funcionários a se integrarem.'],
  ['ar-v5-b2-9', 'ثقافة التقدير (Thaqāfat at-taqdīr)', '/θaˈqaː.fat at.taqˈdiːr/', 'Cultura de reconhecimento', 'Gestão', 'تعزّز ثقافة التقدير ولاء الفريق وإبداعه.', 'A cultura de reconhecimento fortalece a lealdade e a criatividade da equipe.'],
  ['ar-v5-b2-9', 'قيادة تشاركية (Qiyāda tashārukiyya)', '/qiˈjaː.da ta.ʃaː.ruˈkij.ja/', 'Liderança participativa', 'Liderança', 'تعتمد القيادة التشاركية على إشراك الجميع في القرار.', 'A liderança participativa baseia-se no envolvimento de todos na decisão.'],

  ['ar-v5-b2-10', 'تبادل أكاديمي (Tabādul akādīmī)', '/taˈbaː.dul a.kaːˈdiː.miː/', 'Intercâmbio acadêmico', 'Cooperação', 'وقّعت الجامعتان برنامج تبادل أكاديمي للباحثين.', 'As duas universidades assinaram um programa de intercâmbio acadêmico para pesquisadores.'],
  ['ar-v5-b2-10', 'شراكة استراتيجية (Sharāka istirātījiyya)', '/ʃaˈraː.ka is.ti.raː.tiːˈdʒij.ja/', 'Parceria estratégica', 'Relações Internacionais', 'أبرمت المؤسستان شراكة استراتيجية طويلة الأمد.', 'As duas instituições firmaram uma parceria estratégica de longo prazo.'],
  ['ar-v5-b2-10', 'عمل متعدد الأطراف (ʿAmal mutaʿaddid al-aṭrāf)', '/ˈʕa.mal mu.taˈʕad.did al.atˤˈraːf/', 'Ação multilateral', 'Diplomacia', 'يتطلب تغيّر المناخ عملاً متعدد الأطراف وتنسيقاً دولياً.', 'As mudanças climáticas exigem ação multilateral e coordenação internacional.'],

  // ==================== TABOO REGISTER B2 ====================
  ['ar-taboo-register-b2', 'لا حول ولا قوة إلا بالله (Lā ḥawla wa lā quwwata illā billāh)', '/laː ˈħaw.la wa laː ˈquw.wa.ta ˈil.laː bilˈlaːh/', 'Não há força nem poder senão em Deus (expressão de espanto/paciência)', 'Expressões', 'عند سماع الخبر الصعب قال بهدوء: لا حول ولا قوة إلا بالله.', 'Ao ouvir a notícia difícil, disse com calma: não há força nem poder senão em Deus.'],
  ['ar-taboo-register-b2', 'أمر مؤسف (Amr muʾsif)', '/amr ˈmuʔ.sif/', 'Algo lamentável (alternativa educada)', 'Registro', 'هذا تصرّف غير لائق وأمر مؤسف حقاً.', 'Essa é uma atitude inadequada e algo realmente lamentável.'],

  // ==================== C1 (ar-c1-1 .. ar-c1-10) ====================
  ['ar-c1-1', 'أسلوب الاختصاص (Uslūb al-ikhtiṣāṣ)', '/usˈluːb al.ix.tiˈsˤaːsˤ/', 'Estrutura de especificação retórica', 'Gramática Avançada', 'نحنُ — الباحثين — نلتزم بأسلوب الاختصاص لتحديد الفئة بدقة.', 'Nós — os pesquisadores — empregamos a estrutura de especificação para definir o grupo com precisão.'],
  ['ar-c1-1', 'ويحَ (Wayḥa)', '/ˈwaj.ħa/', 'Ai de / Pobre de (exclamação clássica)', 'Retórica', 'ويحَ من يضيّع وقته في الجدال العقيم.', 'Ai daquele que desperdiça seu tempo em discussões estéreis.'],
  ['ar-c1-1', 'بُعد نظر (Buʿd naẓar)', '/buʕd ˈna.dˤar/', 'Visão de futuro / Perspicácia', 'Estilo Elevado', 'أظهر الكاتب بُعد نظر واضحاً في تحليله السياسي.', 'O autor demonstrou clara perspicácia em sua análise política.'],

  ['ar-c1-2', 'لَعَمري (La-ʿamrī)', '/laˈʕam.riː/', 'Por minha vida (juramento enfático)', 'Retórica', 'لَعَمري إنَّ الصدقَ منجاةٌ في كلّ الأحوال.', 'Por minha vida, a sinceridade é salvação em todas as circunstâncias.'],
  ['ar-c1-2', 'التحذير والإغراء (At-taḥdhīr wal-ighrāʾ)', '/at.taħˈðiːr wal.iɣˈraːʔ/', 'Estilo de advertência e exortação', 'Gramática Avançada', 'يُعدّ التحذير والإغراء من أساليب البلاغة المؤثرة في الخطابة.', 'A advertência e a exortação são estilos retóricos impactantes na oratória.'],
  ['ar-c1-2', 'حصافة (Ḥaṣāfa)', '/ħaˈsˤaː.fa/', 'Sensatez / Discernimento', 'Estilo Elevado', 'اتّسم ردّه بالحصافة والاتزان أمام النقد.', 'Sua resposta caracterizou-se pela sensatez e equilíbrio diante da crítica.'],

  ['ar-c1-3', 'ترجمة إبداعية (Tarjama ibdāʿiyya)', '/ˈtar.dʒa.ma ib.daːˈʕij.ja/', 'Tradução literária / criativa (transcriação)', 'Tradução', 'تتطلب القصائد ترجمة إبداعية تحافظ على الإيقاع.', 'Os poemas exigem uma tradução criativa que preserve o ritmo.'],
  ['ar-c1-3', 'جسر حضاري (Jisr ḥaḍārī)', '/dʒisr ħaˈdˤaː.riː/', 'Ponte civilizacional', 'Cultura', 'تُشكّل الترجمة جسراً حضارياً بين الشرق والغرب.', 'A tradução constitui uma ponte civilizacional entre o Oriente e o Ocidente.'],
  ['ar-c1-3', 'سياق دلالي (Siyāq dalālī)', '/siˈjaːq daˈlaː.liː/', 'Contexto semântico', 'Linguística', 'لا ينبغي فصل الاستعارة عن سياقها الدلالي الأصيل.', 'Não se deve separar a metáfora de seu contexto semântico original.'],

  ['ar-c1-4', 'تنويع اقتصادي (Tanwīʿ iqtiṣādī)', '/tanˈwiːʕ iq.tiˈsˤaː.diː/', 'Diversificação econômica', 'Economia', 'تستثمر الدولة في الصناعة والسياحة لتحقيق تنويع اقتصادي مستدام.', 'O Estado investe na indústria e no turismo para alcançar uma diversificação econômica sustentável.'],
  ['ar-c1-4', 'سياسة مالية (Siyāsa māliyya)', '/siˈjaː.sa maːˈlij.ja/', 'Política fiscal', 'Economia', 'تسعى السياسة المالية الرشيدة إلى ضبط الإنفاق العام.', 'A política fiscal prudente busca controlar o gasto público.'],
  ['ar-c1-4', 'استثمار أخضر (Istithmār akhḍar)', '/is.tiθˈmaːr ˈax.dˤar/', 'Investimento verde', 'Economia', 'تتجه الصناديق السيادية نحو تعزيز الاستثمار الأخضر.', 'Os fundos soberanos orientam-se para fortalecer o investimento verde.'],

  ['ar-c1-5', 'سيادة البيانات (Siyādat al-bayānāt)', '/siˈjaː.dat al.ba.jaːˈnaːt/', 'Soberania de dados', 'Direito Digital', 'تنص التشريعات الجديدة على حماية سيادة البيانات الوطنية.', 'As novas legislações determinam a proteção da soberania nacional de dados.'],
  ['ar-c1-5', 'ملكية فكرية (Milkiyya fikriyya)', '/milˈkij.ja fikˈrij.ja/', 'Propriedade intelectual', 'Direito', 'يكفل القانون الدولي صون حقوق الملكية الفكرية للمبدعين.', 'O direito internacional garante a proteção da propriedade intelectual dos criadores.'],
  ['ar-c1-5', 'مساءلة قانونية (Musāʾala qānūniyya)', '/muˈsaː.ʔa.la qaː.nuːˈnij.ja/', 'Responsabilização jurídica', 'Direito', 'يخضع أي خرق للخصوصية لمساءلة قانونية صارمة.', 'Qualquer violação de privacidade está sujeita a rigorosa responsabilização jurídica.'],

  ['ar-c1-6', 'قابلية التفنيد (Qābiliyyat at-tafnīd)', '/qaː.biˈlij.jat at.tafˈniːd/', 'Falseabilidade / Refutabilidade', 'Filosofia da Ciência', 'تُعدّ قابلية التفنيد معياراً جوهرياً للنظرية العلمية.', 'A falseabilidade é um critério fundamental da teoria científica.'],
  ['ar-c1-6', 'منهج استقرائي (Manhaj istiqrāʾī)', '/ˈman.hadʒ is.tiqˈraː.ʔiː/', 'Método indutivo', 'Ciência', 'اعتمد الباحثون على منهج استقرائي لتحليل الظاهرة.', 'Os pesquisadores basearam-se em um método indutivo para analisar o fenômeno.'],
  ['ar-c1-6', 'تحوّل نموذجي (Taḥawwul namūdhajī)', '/taˈħaw.wul na.muːˈða.dʒiː/', 'Mudança de paradigma', 'Filosofia da Ciência', 'أحدثت الفيزياء الحديثة تحوّلاً نموذجياً في فهم الكون.', 'A física moderna provocou uma mudança de paradigma na compreensão do universo.'],

  ['ar-c1-7', 'تقريب وجهات النظر (Taqrīb wijhāt an-naẓar)', '/taqˈriːb widʒˈhaːt anˈna.dˤar/', 'Aproximação de pontos de vista', 'Mediação', 'نجح الوسيط في تقريب وجهات النظر بين الطرفين.', 'O mediador conseguiu aproximar os pontos de vista entre as duas partes.'],
  ['ar-c1-7', 'خارطة طريق (Khāriṭat ṭarīq)', '/ˈxaː.ri.tˤat tˤaˈriːq/', 'Roteiro / Plano de ação', 'Negociação', 'اتفق المتفاوضون على خارطة طريق واضحة للتنفيذ.', 'Os negociadores concordaram com um roteiro claro para a implementação.'],
  ['ar-c1-7', 'إعادة صياغة (Iʿādat ṣiyāgha)', '/iˈʕaː.dat sˤiˈjaː.ɣa/', 'Reformulação', 'Comunicação', 'ساهمت إعادة صياغة البنود الخلافية في إنهاء الأزمة.', 'A reformulação das cláusulas controversas contribuiu para encerrar a crise.'],

  ['ar-c1-8', 'مشربية (Mashrabiyya)', '/maʃ.raˈbij.ja/', 'Muxarabi / Treliça arquitetônica árabe', 'Arquitetura', 'توفر المشربية الخشبية الظل والخصوصية مع التهوية الطبيعية.', 'O muxarabi de madeira oferece sombra e privacidade com ventilação natural.'],
  ['ar-c1-8', 'هوية معمارية (Huwiyya miʿmāriyya)', '/huˈwij.ja miʕ.maːˈrij.ja/', 'Identidade arquitetônica', 'Arquitetura', 'تحافظ المباني الحديثة على هوية معمارية مستلهمة من البيئة.', 'Os edifícios modernos preservam uma identidade arquitetônica inspirada no ambiente.'],
  ['ar-c1-8', 'استدامة مناخية (Istidāma munākhiyya)', '/is.tiˈdaː.ma mu.naːˈxij.ja/', 'Sustentabilidade climática', 'Urbanismo', 'تراعي العمارة الصحراوية التقليدية شروط الاستدامة المناخية.', 'A arquitetura tradicional do deserto respeita as condições de sustentabilidade climática.'],

  ['ar-c1-9', 'محفل دولي (Maḥfil dawlī)', '/ˈmaħ.fil ˈdaw.liː/', 'Fórum internacional', 'Diplomacia', 'ألقى السفير كلمته أمام محفل دولي رفيع المستوى.', 'O embaixador proferiu seu discurso perante um fórum internacional de alto nível.'],
  ['ar-c1-9', 'إشادة (Ishāda)', '/iˈʃaː.da/', 'Elogio / Reconhecimento público', 'Oratória', 'حظيت المبادرة بإشادة واسعة من الوفود المشاركة.', 'A iniciativa recebeu amplo reconhecimento das delegações participantes.'],
  ['ar-c1-9', 'دعوة إلى العمل (Daʿwa ilā al-ʿamal)', '/ˈdaʕ.wa ˈi.laː alˈʕa.mal/', 'Chamado à ação', 'Oratória', 'اختتمت الخطيبة كلمتها بدعوة صريحة إلى العمل المشترك.', 'A oradora encerrou seu discurso com um chamado claro à ação conjunta.'],

  ['ar-c1-10', 'تمكين رقمي (Tamkīn raqmī)', '/tamˈkiːn ˈraq.miː/', 'Empoderamento digital', 'Tecnologia', 'يهدف المشروع إلى تحقيق تمكين رقمي شامل للشباب.', 'O projeto visa alcançar um empoderamento digital abrangente para os jovens.'],
  ['ar-c1-10', 'بلاغة معاصرة (Balāgha muʿāṣira)', '/baˈlaː.ɣa muˈʕaː.sˤi.ra/', 'Retórica contemporânea', 'Literatura', 'تجمع المقالات الجيدة بين دقة المعلومة وبلاغة معاصرة.', 'Bons artigos combinam precisão da informação com retórica contemporânea.'],
  ['ar-c1-10', 'نهضة معرفية (Nahḍa maʿrifiyya)', '/ˈnah.dˤa maʕ.riˈfij.ja/', 'Renascimento cognitivo / científico', 'Cultura', 'يتطلب بناء نهضة معرفية دعماً مستمراً للبحث والنشر.', 'Construir um renascimento científico exige apoio contínuo à pesquisa e à publicação.'],

  // ==================== V5-C1 (ar-v5-c1-1 .. ar-v5-c1-10) ====================
  ['ar-v5-c1-1', 'حجة مضادة (Ḥujja muḍādda)', '/ˈħudʒ.dʒa muˈdˤaːd.da/', 'Contra-argumento', 'Debate', 'فنّد المتحدث كل حجة مضادة بأدلة إحصائية رصينة.', 'O orador refutou cada contra-argumento com evidências estatísticas sólidas.'],
  ['ar-v5-c1-1', 'مغالطة منطقية (Mughālaṭa manṭiqiyya)', '/muˈɣaː.la.tˤa man.tˤiˈqij.ja/', 'Falácia lógica', 'Lógica', 'كشف المحاور عن مغالطة منطقية واضحة في استنتاج خصمه.', 'O debatedor expôs uma falácia lógica clara na conclusão de seu oponente.'],
  ['ar-v5-c1-1', 'استدلال (Istidlāl)', '/is.tidˈlaːl/', 'Raciocínio / Argumentação dedutiva', 'Lógica', 'يقوم الاستدلال السليم على ربط المقدمات بالنتائج بوضوح.', 'O raciocínio sólido baseia-se em ligar premissas e conclusões com clareza.'],

  ['ar-v5-c1-2', 'حوكمة الذكاء الاصطناعي (Ḥawkamat adh-dhakāʾ al-iṣṭināʿī)', '/ˈħaw.ka.mat að.ðaˈkaːʔ al.isˤ.tˤi.naːˈʕiː/', 'Governança da inteligência artificial', 'Ética', 'تضع المنظمات الدولية مبادئ لحوكمة الذكاء الاصطناعي.', 'Organizações internacionais estabelecem princípios para a governança da inteligência artificial.'],
  ['ar-v5-c1-2', 'وعي آلي (Waʿy ālī)', '/waʕj ˈaː.liː/', 'Consciência artificial / de máquina', 'Filosofia', 'يثير مفهوم الوعي الآلي جدلاً فلسفياً عميقاً بين العلماء.', 'O conceito de consciência artificial suscita profundo debate filosófico entre os cientistas.'],
  ['ar-v5-c1-2', 'استقلالية القرار (Istiqlāliyyat al-qarār)', '/is.tiq.laːˈlij.jat al.qaˈraːr/', 'Autonomia decisória', 'Ética', 'يجب الحفاظ على استقلالية القرار البشري في الأنظمة الحساسة.', 'Deve-se preservar a autonomia decisória humana em sistemas sensíveis.'],

  ['ar-v5-c1-3', 'بيت الحكمة (Bayt al-ḥikma)', '/bajt alˈħik.ma/', 'Casa da Sabedoria', 'História', 'ازدهرت حركة الترجمة العلمية في بيت الحكمة ببغداد.', 'O movimento de tradução científica floresceu na Casa da Sabedoria em Bagdá.'],
  ['ar-v5-c1-3', 'تراكم معرفي (Tarākum maʿrifī)', '/taˈraː.kum maʕ.riˈfiː/', 'Acúmulo de conhecimento', 'Ciência', 'تُبنى الاكتشافات الحديثة على تراكم معرفي عبر القرون.', 'As descobertas modernas são construídas sobre um acúmulo de conhecimento ao longo dos séculos.'],
  ['ar-v5-c1-3', 'تدوين علمي (Tadwīn ʿilmī)', '/tadˈwiːn ˈʕil.miː/', 'Registro científico', 'História', 'أسهم التدوين العلمي الدقيق في حفظ مؤلفات الأقدمين.', 'O registro científico rigoroso contribuiu para preservar as obras dos antigos.'],

  ['ar-v5-c1-4', 'تعويض مناخي (Taʿwīḍ munākhī)', '/taʕˈwiːdˤ mu.naːˈxiː/', 'Compensação climática', 'Direito Ambiental', 'تطالب الدول النامية بآليات عادلة للتمويل والتعويض المناخي.', 'Os países em desenvolvimento reivindicam mecanismos justos de financiamento e compensação climática.'],
  ['ar-v5-c1-4', 'مسؤولية متباينة (Masʾūliyya mutabāyina)', '/mas.ʔuːˈlij.ja mu.taˈbaː.ji.na/', 'Responsabilidade diferenciada', 'Direito Ambiental', 'تقرّ الاتفاقيات الدولية بمبدأ المسؤولية المشتركة والمتباينة.', 'Os acordos internacionais reconhecem o princípio da responsabilidade comum, porém diferenciada.'],
  ['ar-v5-c1-4', 'تقاضٍ بيئي (Taqāḍin bīʾī)', '/taˈqaː.dˤin biːˈʔiː/', 'Litigância ambiental / climática', 'Direito', 'شهدت المحاكم الأوروبية تصاعداً في قضايا التقاضي البيئي.', 'Os tribunais europeus registraram um aumento nos casos de litigância ambiental.'],

  ['ar-v5-c1-5', 'تحقيق استقصائي (Taḥqīq istiqṣāʾī)', '/taħˈqiːq is.tiqˈsˤaː.ʔiː/', 'Investigação jornalística', 'Jornalismo', 'استغرق التحقيق الاستقصائي ستة أشهر من جمع الوثائق.', 'A investigação jornalística levou seis meses de coleta de documentos.'],
  ['ar-v5-c1-5', 'تحيّز ضمني (Taḥayyuz ḍimnī)', '/taˈħaj.juz ˈdˤim.niː/', 'Viés implícito', 'Mídia', 'يساعد تحليل الخطاب على كشف أي تحيّز ضمني في التغطية.', 'A análise do discurso ajuda a revelar qualquer viés implícito na cobertura.'],
  ['ar-v5-c1-5', 'توثيق ميداني (Tawthīq maydānī)', '/tawˈθiːq majˈdaː.niː/', 'Documentação de campo', 'Jornalismo', 'اعتمد التقرير على توثيق ميداني وشهادات شهود العيان.', 'A reportagem baseou-se em documentação de campo e relatos de testemunhas oculares.'],

  ['ar-v5-c1-6', 'سياسة نقدية (Siyāsa naqdiyya)', '/siˈjaː.sa naqˈdij.ja/', 'Política monetária', 'Economia', 'تهدف السياسة النقدية المتشددة إلى استقرار الأسعار.', 'A política monetária restritiva visa à estabilidade de preços.'],
  ['ar-v5-c1-6', 'استقرار مالي (Istiqrār mālī)', '/is.tiqˈraːr ˈmaː.liː/', 'Estabilidade financeira', 'Economia', 'تحرص البنوك المركزية على تحقيق استقرار مالي طويل الأمد.', 'Os bancos centrais zelam por alcançar estabilidade financeira de longo prazo.'],
  ['ar-v5-c1-6', 'قوة شرائية (Quwwa shirāʾiyya)', '/ˈquw.wa ʃi.raːˈʔij.ja/', 'Poder de compra', 'Economia', 'يُضعف التضخم المرتفع القوة الشرائية للأسر.', 'A inflação elevada enfraquece o poder de compra das famílias.'],

  ['ar-v5-c1-7', 'مقاومة التغيير (Muqāwamat at-taghyīr)', '/muˈqaː.wa.mat at.taɣˈjiːr/', 'Resistência à mudança', 'Gestão', 'تتطلب معالجة مقاومة التغيير تواصلاً شفافاً مع الموظفين.', 'Lidar com a resistência à mudança exige comunicação transparente com os funcionários.'],
  ['ar-v5-c1-7', 'إصلاح هيكلي (Iṣlāḥ haykalī)', '/isˤˈlaːħ ˈhaj.ka.liː/', 'Reforma estrutural', 'Governança', 'نفّذت المؤسسة إصلاحاً هيكلياً لرفع كفاءة الإدارة.', 'A instituição implementou uma reforma estrutural para elevar a eficiência da gestão.'],
  ['ar-v5-c1-7', 'شفافية مؤسسية (Shafāfiyya muʾassasiyya)', '/ʃa.faːˈfij.ja mu.ʔas.saˈsij.ja/', 'Transparência institucional', 'Governança', 'تعزّز الشفافية المؤسسية ثقة الجمهور والمستثمرين.', 'A transparência institucional fortalece a confiança do público e dos investidores.'],

  ['ar-v5-c1-8', 'بنية زمنية (Binya zamaniyya)', '/ˈbin.ja za.maˈnij.ja/', 'Estrutura temporal', 'Literatura', 'تعتمد الرواية على بنية زمنية متقطعة تزيد التشويق.', 'O romance baseia-se em uma estrutura temporal fragmentada que aumenta o suspense.'],
  ['ar-v5-c1-8', 'رمزية أدبية (Ramziyya adabiyya)', '/ramˈzij.ja a.daˈbij.ja/', 'Simbolismo literário', 'Literatura', 'تحمل الشخصيات الثانوية رمزية أدبية عميقة في النص.', 'As personagens secundárias carregam um profundo simbolismo literário no texto.'],
  ['ar-v5-c1-8', 'تيار الوعي (Tayyār al-waʿy)', '/tajˈjaːr alˈwaʕj/', 'Fluxo de consciência', 'Literatura', 'يُوظّف الكاتب تقنية تيار الوعي لكشف الصراع الداخلي.', 'O autor emprega a técnica do fluxo de consciência para revelar o conflito interior.'],

  ['ar-v5-c1-9', 'بحث تطبيقي (Baḥth taṭbīqī)', '/baħθ tatˤˈbiː.qiː/', 'Pesquisa aplicada', 'Ciência & Inovação', 'يركّز المختبر على بحث تطبيقي يخدم القطاع الصناعي.', 'O laboratório concentra-se em pesquisa aplicada que atende ao setor industrial.'],
  ['ar-v5-c1-9', 'نقل التقنية (Naql at-tiqniyya)', '/naql at.tiqˈnij.ja/', 'Transferência de tecnologia', 'Inovação', 'تسرّع الشراكات الجامعية من وتيرة نقل التقنية إلى السوق.', 'As parcerias universitárias aceleram o ritmo da transferência de tecnologia para o mercado.'],
  ['ar-v5-c1-9', 'تمويل بحثي (Tamwīl baḥthī)', '/tamˈwiːl ˈbaħ.θiː/', 'Financiamento à pesquisa', 'Academia', 'خصّصت الجامعة تمويلاً بحثياً لمشاريع الطاقة النظيفة.', 'A universidade destinou financiamento à pesquisa para projetos de energia limpa.'],

  ['ar-v5-c1-10', 'تماسك نصي (Tamāsuk naṣṣī)', '/taˈmaː.suk nasˤˈsˤiː/', 'Coesão textual', 'Escrita Avançada', 'يضمن التماسك النصي انسياب الأفكار بسلاسة في المقال.', 'A coesão textual garante a fluidez das ideias com naturalidade no artigo.'],
  ['ar-v5-c1-10', 'دقة معجمية (Diqqa muʿjamiyya)', '/ˈdiq.qa muʕ.dʒaˈmij.ja/', 'Precisão lexical', 'Estilo Elevado', 'تعكس الدقة المعجمية تمكّن الكاتب من الفروق الدلالية.', 'A precisão lexical reflete o domínio do autor sobre as nuances semânticas.'],
  ['ar-v5-c1-10', 'إيجاز بليغ (Ījāz balīgh)', '/iːˈdʒaːz baˈliːɣ/', 'Concisão eloquente', 'Retórica', 'يُعرف الأسلوب الرصين بقدرته على الإيجاز البليغ دون إخلال بالمعنى.', 'O estilo sóbrio é conhecido por sua capacidade de concisão eloquente sem prejuízo do sentido.'],
];

export const VOCAB_FIXES_AR: VocabExampleFixMap = {
  'voc-ar-a1-3-3': {
    exampleEn: 'هل تدفع بالبطاقة أم بنقود ورقية؟',
    examplePt: 'Você paga com cartão ou com dinheiro em espécie?',
  },
  'voc-ar-v5-a1-6-3': {
    exampleEn: 'يطلب مندوب التوصيل توقيع المستلم عند تسليم الطرد.',
    examplePt: 'O entregador pede a assinatura do destinatário ao entregar a encomenda.',
  },
  'voc-ar-v5-a1-8-3': {
    exampleEn: 'شرح لنا المرشد السياحي تاريخ القصر بأسلوب ممتع.',
    examplePt: 'O guia turístico nos explicou a história do palácio de maneira envolvente.',
  },
  'voc-ar-v5-a2-4-3': {
    exampleEn: 'اتصلنا بسباك محترف لإصلاح تسرّب المياه في المطبخ.',
    examplePt: 'Ligamos para um encanador profissional para consertar o vazamento de água na cozinha.',
  },
  'voc-ar-v5-a2-6-3': {
    exampleEn: 'يساعد إطفاء الأنوار غير المستخدمة على توفير الكهرباء.',
    examplePt: 'Apagar as luzes não utilizadas ajuda a economizar eletricidade.',
  },
  'voc-ar-v5-a2-10-3': {
    exampleEn: 'حضرنا أمسية موسيقية رائعة في دار الأوبرا مساء الجمعة.',
    examplePt: 'Assistimos a um sarau musical maravilhoso na casa de ópera na sexta-feira à noite.',
  },
  'voc-ar-b1-3-3': {
    exampleEn: 'إذا توافرت الشروط المناسبة، فلن يتردد الفريق في قبول العرض.',
    examplePt: 'Se as condições adequadas estiverem presentes, a equipe não hesitará em aceitar a proposta.',
  },
  'voc-ar-b1-5-3': {
    exampleEn: 'الزميل الذي طرحَ فكرةً جديدةً نال إعجاب المدير.',
    examplePt: 'O colega que apresentou uma nova ideia conquistou a admiração do diretor.',
  },
  'voc-ar-v5-b1-1-1': {
    exampleEn: 'حدّد الفريق موعداً نهائياً لتسليم التقرير يوم الخميس.',
    examplePt: 'A equipe definiu um prazo final para entregar o relatório na quinta-feira.',
  },
  'voc-ar-v5-b1-1-3': {
    exampleEn: 'احتفل الجميع بهذا الإنجاز بعد أشهر من العمل المتواصل.',
    examplePt: 'Todos celebraram essa realização após meses de trabalho contínuo.',
  },
  'voc-ar-v5-b1-2-3': {
    exampleEn: 'يساعد النظام الغذائي المتوازن على تعزيز النشاط اليومي.',
    examplePt: 'Uma dieta equilibrada ajuda a fortalecer a disposição diária.',
  },
  'voc-ar-v5-b1-9-3': {
    exampleEn: 'أثمرَ عن هذا التعاون إطلاق مكتبة مجتمعية مجانية.',
    examplePt: 'Essa cooperação resultou no lançamento de uma biblioteca comunitária gratuita.',
  },
  'voc-ar-idioms-b1-4': {
    exampleEn: 'بعد نقاش طويل وصلنا أخيراً إلى بيت القصيد.',
    examplePt: 'Depois de uma longa discussão, finalmente chegamos ao ponto central da questão.',
  },
  'voc-ar-b2-5-1': {
    exampleEn: 'تحرص المشاريع العمرانية الحديثة على تحقيق الاستدامة البيئية.',
    examplePt: 'Os projetos urbanos modernos zelam por alcançar a sustentabilidade ambiental.',
  },
  'voc-ar-b2-10-3': {
    exampleEn: 'يُستنتجُ من الأرقام الأخيرة تحسّن ملحوظ في الأداء.',
    examplePt: 'Conclui-se dos últimos números uma melhora notável no desempenho.',
  },
  'voc-ar-v5-b2-3-1': {
    exampleEn: 'تعتمد المتاجر الكبرى على سلاسل الإمداد الرقمية لتسريع التوصيل.',
    examplePt: 'As grandes lojas dependem das cadeias de suprimentos digitais para acelerar a entrega.',
  },
  'voc-ar-v5-b2-6-3': {
    exampleEn: 'تتطلب ندرة الأمطار ترشيد استهلاك المياه في الزراعة.',
    examplePt: 'A escassez de chuvas exige a racionalização do consumo de água na agricultura.',
  },
  'voc-ar-v5-b2-7-3': {
    exampleEn: 'تنجح الأعمال الدرامية الجيدة عندما تتجنب تكرار صور نمطية مستهلكة.',
    examplePt: 'Boas obras dramáticas têm sucesso quando evitam repetir estereótipos desgastados.',
  },
  'voc-ar-v5-b2-8-3': {
    exampleEn: 'عرض المؤسس نموذج الإيرادات بوضوح أمام لجنة المستثمرين.',
    examplePt: 'O fundador apresentou o modelo de receita com clareza diante do comitê de investidores.',
  },
  'voc-ar-taboo-register-b2-1': {
    exampleEn: 'قال البطل في المشهد الدرامي: تباً لهذا التأخير غير المبرر!',
    examplePt: 'O protagonista disse na cena dramática: droga para esse atraso injustificado!',
  },
  'voc-ar-taboo-register-b2-2': {
    exampleEn: 'في الأفلام قد تسمع شتيمة مثل غبي، لكن يُفضّل تجنبها في الواقع.',
    examplePt: 'Nos filmes você pode ouvir um xingamento como bobo, mas é preferível evitá-lo na vida real.',
  },
  'voc-ar-c1-4-2': {
    exampleEn: 'تُنتج الصناعات التحويلية قيمة مضافة مرتفعة للاقتصاد الوطني.',
    examplePt: 'As indústrias de transformação geram alto valor agregado para a economia nacional.',
  },
  'voc-ar-c1-7-3': {
    exampleEn: 'اتفق المتنازعون على الاحتكام إلى لجنة وساطة مستقلة.',
    examplePt: 'Os litigantes concordaram em recorrer a um comitê de mediação independente.',
  },
  'voc-ar-c1-10-3': {
    exampleEn: 'يحتاج القارئ العربي إلى محتوى رصين يجمع بين العمق والوضوح.',
    examplePt: 'O leitor árabe precisa de conteúdo sólido que una profundidade e clareza.',
  },
  'voc-ar-v5-c1-2-2': {
    exampleEn: 'حذّر الخبراء من أي تحيز خوارزمي قد يظهر في أنظمة التوظيف الآلية.',
    examplePt: 'Os especialistas alertaram contra qualquer viés algorítmico que possa surgir em sistemas automatizados de contratação.',
  },
  'voc-ar-v5-c1-3-3': {
    exampleEn: 'أثبت ابن الهيثم نظريته في البصريات بالاعتماد على برهان تجريبي دقيق.',
    examplePt: 'Ibn al-Haytham comprovou sua teoria em óptica baseando-se em uma prova experimental rigorosa.',
  },
  'voc-ar-v5-c1-4-3': {
    exampleEn: 'وقّعت الدول المشاركة على اتفاق ملزم قانوناً لخفض الانبعاثات.',
    examplePt: 'Os países participantes assinaram um acordo juridicamente vinculante para reduzir as emissões.',
  },
  'voc-ar-v5-c1-10-1': {
    exampleEn: 'يمتلك الكاتب ناصية اللغة فيصوغ أفكاره بسلاسة وإحكام.',
    examplePt: 'O escritor possui pleno domínio da língua, formulando suas ideias com fluidez e rigor.',
  },
};


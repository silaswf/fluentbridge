/**
 * @file src/data/exams/examsNordicSemitic.ts
 * @description Banco de simulados oficiais cronometrados (NordicSemitic).
 * @exports EXAMS_NORDIC_SEMITIC
 */
import type { MockExam } from '../../types/exams';

export const EXAMS_NORDIC_SEMITIC: MockExam[] = [
  // =========================================================================
  // TÖMER / YDS (tr) — 4 Simulations
  // =========================================================================
  {
    id: 'tomer-sim-1',
    examTypeId: 'tomer',
    languageCode: 'tr',
    simulationNumber: 1,
    title: 'TÖMER B1 — Simulado 1: Günlük Yaşam & İş',
    targetCefr: 'B1',
    durationMinutes: 45,
    questions: [
      {
        id: 'tomer-1-q1',
        section: 'reading',
        passageTitle: 'İstanbul’da Uzaktan Çalışma Kültürü',
        passageText:
          'Son yıllarda İstanbul’daki pek çok teknoloji şirketi hibrit çalışma modeline geçti. Çalışanlar haftanın üç günü evden çalışarak trafikte harcadıkları zamandan tasarruf ediyor. Ancak uzmanlar, iş ve özel yaşam arasındaki sınırın korunması için düzenli çalışma saatleri belirlenmesini öneriyor.',
        prompt: 'Metne göre hibrit çalışma modelinin en belirgin avantajı nedir?',
        options: [
          'Trafikte geçirilen sürenin azalması',
          'Ofislerin tamamen kapatılması',
          'Maaşların iki katına çıkması',
          'Çalışma saatlerinin tamamen kaldırılması',
        ],
        correctIndex: 0,
        explanation:
          'O texto diz que "trafikte harcadıkları zamandan tasarruf ediyor" (economizam tempo gasto no trânsito).',
      },
      {
        id: 'tomer-1-q2',
        section: 'reading',
        passageTitle: 'İstanbul’da Uzaktan Çalışma Kültürü',
        passageText:
          'Son yıllarda İstanbul’daki pek çok teknoloji şirketi hibrit çalışma modeline geçti. Çalışanlar haftanın üç günü evden çalışarak trafikte harcadıkları zamandan tasarruf ediyor. Ancak uzmanlar, iş ve özel yaşam arasındaki sınırın korunması için düzenli çalışma saatleri belirlenmesini öneriyor.',
        prompt: 'Uzmanlar evden çalışanlara ne tavsiye ediyor?',
        options: [
          'Gece geç saatlere kadar çalışmalarını',
          'Düzenli çalışma saatleri belirlemelerini',
          'Sadece hafta sonları toplantı yapmalarını',
          'İş arkadaşlarıyla iletişim kurmamalarını',
        ],
        correctIndex: 1,
        explanation:
          'Especialistas recomendam "düzenli çalışma saatleri belirlenmesini" (definir horários regulares de trabalho).',
      },
      {
        id: 'tomer-1-q3',
        section: 'listening',
        audioText:
          'Sayın yolcularımız, Ankara yönüne hareket edecek olan saat 14:30 hızlı treni, teknik bir kontrol nedeniyle on beş dakika gecikmeli olarak 3. perondan kalkacaktır. Anlayışınız için teşekkür ederiz.',
        audioPlaysLimit: 2,
        prompt: 'Anonsa göre Ankara hızlı treni hakkında hangisi doğrudur?',
        options: [
          'Tren iptal edilmiştir.',
          'Tren 15 dakika gecikmeyle 3. perondan kalkacaktır.',
          'Tren zamanında 1. perondan hareket edecektir.',
          'Yolcuların otobüse binmesi gerekmektedir.',
        ],
        correctIndex: 1,
        explanation:
          'O anúncio informa "on beş dakika gecikmeli olarak 3. perondan kalkacaktır" (partirá da plataforma 3 com 15 minutos de atraso).',
      },
      {
        id: 'tomer-1-q4',
        section: 'listening',
        audioText:
          'Selin: Merhaba Emre, yarın akşamki konsere geliyor musun? Emre: Çok isterdim ama yarın sabah İzmir’e iş seyahatine çıkıyorum. Hafta sonu döndüğümde mutlaka kahve içelim.',
        audioPlaysLimit: 2,
        prompt: 'Emre neden yarın akşamki konsere gidemiyor?',
        options: [
          'Müziği sevmediği için',
          'İzmir’e iş seyahatine çıkacağı için',
          'Hasta olduğu için',
          'Bilet bulamadığı için',
        ],
        correctIndex: 1,
        explanation:
          'Emre diz: "yarın sabah İzmir’e iş seyahatine çıkıyorum" (amanhã de manhã viajo a trabalho para İzmir).',
      },
      {
        id: 'tomer-1-q5',
        section: 'language_use',
        prompt: 'Boşluğu doğru ekle doldurun: "Yarın sabah erken kalk___ için bu akşam erken yatacağım."',
        options: ['mak', 'dığım', 'acağımı', 'arak'],
        correctIndex: 0,
        explanation:
          '"kalkmak için" (para levantar) usa o infinitivo -mak antes de "için".',
      },
      {
        id: 'tomer-1-q6',
        section: 'language_use',
        prompt: 'Hangi cümlede ünlü uyumu ve hal eki doğrudur? "İstanbul___ yaşam çok hızlı."',
        options: ['da', 'de', 'ta', 'te'],
        correctIndex: 0,
        explanation:
          'A última vogal de "İstanbul" é "u" (posterior arredondada), então o locativo correto é "-da" (İstanbul’da).',
      },
    ],
    writingTask: {
      prompt:
        'İş arkadaşınız Zeynep’e kısa bir e-posta yazın (yaklaşık 80 kelime). Yarın sabahki proje toplantısına doktor randevunuz nedeniyle katılamayacağınızı bildirin, özür dileyin ve toplantı notlarını ne zaman okuyabileceğinizi belirtin.',
      minWords: 60,
      rubricCriteria: [
        'Saudação e despedida adequadas em turco (Merhaba Zeynep / İyi çalışmalar)',
        'Justificativa clara com posposição (-dığı için / nedeniyle)',
        'Harmonia vocálica e sufixos de caso corretos',
        'Proposta objetiva para revisar as atas da reunião',
      ],
      expectedKeywords: ['toplantı', 'doktor', 'özür', 'notlar', 'yarın'],
      modelAnswer:
        'Merhaba Zeynep, yarın sabahki proje toplantısına katılamayacağım için çok üzgünüm. Saat dokuzda önemli bir doktor randevum var. Öğleden sonra ofise döndüğümde toplantı notlarını hemen okuyup kendi görevlerimle ilgili geri bildirimimi paylaşacağım. Anlayışın için teşekkür ederim. İyi çalışmalar, Deniz.',
    },
    speakingTask: {
      title: 'TÖMER Sözlü Sınavı — Günlük Yaşam & İş',
      instructionsPt: 'Apresente-se em turco com naturalidade e responda sobre sua rotina e opinião.',
      parts: [
        {
          id: 'tomer-1-sp1',
          partLabel: 'Bölüm 1 — Tanışma',
          prepSeconds: 20,
          speakSeconds: 60,
          prompt: 'Kendinizi kısaca tanıtın ve neden Türkçe öğrendiğinizi anlatın.',
          bulletPoints: ['Mesleğiniz veya eğitiminiz', 'Günlük rutininiz', 'Türkçe öğrenme amacınız'],
          evaluationCriteria: ['Harmonia vocálica', 'Ordem SOV natural', 'Vocabulário cotidiano'],
        },
      ],
    },
  },
  {
    id: 'tomer-sim-2',
    examTypeId: 'tomer',
    languageCode: 'tr',
    simulationNumber: 2,
    title: 'TÖMER B2 — Simulado 2: Şehir & Çevre',
    targetCefr: 'B2',
    durationMinutes: 45,
    questions: [
      {
        id: 'tomer-2-q1',
        section: 'reading',
        passageTitle: 'Büyük Şehirlerde Bisiklet Yolları',
        passageText:
          'Belediyeler, şehir merkezlerindeki hava kirliliğini azaltmak amacıyla bisiklet yollarını genişletiyor. Araştırmalar, güvenli bisiklet şeritlerinin bulunduğu semtlerde kısa mesafeli araç kullanımının yüzde yirmi oranında düştüğünü gösteriyor.',
        prompt: 'Araştırmalara göre güvenli bisiklet şeritleri neyi sağlamıştır?',
        options: [
          'Kısa mesafeli araç kullanımının yüzde yirmi azalmasını',
          'Toplu taşıma fiyatlarının artmasını',
          'Trafik kazalarının iki katına çıkmasını',
          'Şehir merkezindeki parkların küçülmesini',
        ],
        correctIndex: 0,
        explanation:
          'O texto indica que o uso de carros em curtas distâncias caiu 20% ("yüzde yirmi oranında düştüğünü").',
      },
      {
        id: 'tomer-2-q2',
        section: 'listening',
        audioText:
          'Hava durumu bültenine hoş geldiniz. Hafta sonu Marmara bölgesinde sıcaklıklar mevsim normallerinin biraz üzerinde seyredecek; ancak pazar akşamı hafif sağanak yağış bekleniyor.',
        audioPlaysLimit: 2,
        prompt: 'Pazar akşamı Marmara bölgesinde nasıl bir hava bekleniyor?',
        options: ['Yoğun kar yağışı', 'Hafif sağanak yağış', 'Aşırı fırtına', 'Sıfırın altında soğuk'],
        correctIndex: 1,
        explanation: 'O boletim prevê "hafif sağanak yağış" (chuva leve/pancadas leves) no domingo à noite.',
      },
      {
        id: 'tomer-2-q3',
        section: 'language_use',
        prompt: 'Doğru sıfat-fiili seçin: "Dün akşam ___ film gerçekten çok etkileyiciydi."',
        options: ['izlediğimiz', 'izleyeceğimiz', 'izlemek', 'izlerken'],
        correctIndex: 0,
        explanation:
          'Particípio relativo passado/presente com possuidor "nós" (1pl): "izlediğimiz film" (o filme que assistimos).',
      },
      {
        id: 'tomer-2-q4',
        section: 'language_use',
        prompt: 'Cümleyi tamamlayın: "Yağmur yağmasına ___, yürüyüşe çıktık."',
        options: ['rağmen', 'göre', 'dolayı', 'kadar'],
        correctIndex: 0,
        explanation:
          '"-masına rağmen" significa "apesar de" (apesar de chover, saímos para caminhar).',
      },
    ],
    writingTask: {
      prompt:
        'Büyük şehirlerde toplu taşımanın ücretsiz olması gerekip gerekmediği hakkında 100 kelimelik bir görüş yazısı yazın. Avantajları ve olası maliyetleri değerlendirin.',
      minWords: 80,
      rubricCriteria: [
        'Tese clara e conectores argumentativos (ancak, buna karşın, sonuç olarak)',
        'Uso correto de particípios (-dığı, -acak) e posposições',
        'Vocabulário urbano e ambiental adequado ao nível B2',
      ],
      expectedKeywords: ['toplu taşıma', 'trafik', 'çevre', 'maliyet', 'ancak'],
      modelAnswer:
        'Büyük şehirlerde toplu taşımanın ücretsiz olması trafik yoğunluğunu ve hava kirliliğini önemli ölçüde azaltabilir. İnsanlar özel araç yerine metro ve otobüsü tercih ettiğinde şehir yaşamı daha sakin hale gelir. Buna karşın, belediyelerin bu hizmeti sürdürebilmesi için yüksek bir bütçeye ihtiyacı vardır. Sonuç olarak, tamamen ücretsiz ulaşım yerine öğrenciler ve düşük gelirli vatandaşlar için indirimli tarifeler uygulamak daha sürdürülebilir bir çözüm olabilir.',
    },
  },
  {
    id: 'tomer-sim-3',
    examTypeId: 'tomer',
    languageCode: 'tr',
    simulationNumber: 3,
    title: 'TÖMER B2 — Simulado 3: Teknoloji & Eğitim',
    targetCefr: 'B2',
    durationMinutes: 45,
    questions: [
      {
        id: 'tomer-3-q1',
        section: 'reading',
        passageTitle: 'Dijital Öğrenme Platformları',
        passageText:
          'Çevrim içi eğitim platformları, farklı şehirlerde yaşayan öğrencilere eşit fırsatlar sunmaktadır. Ancak eğitimciler, dijital araçların yüz yüze etkileşimin yerini tamamen alamayacağını ve sosyal becerilerin sınıf ortamında daha hızlı geliştiğini vurgulamaktadır.',
        prompt: 'Eğitimcilere göre dijital araçların sınırı nedir?',
        options: [
          'Yüz yüze etkileşimin yerini tamamen alamamaları',
          'Çok pahalı olmaları',
          'Sadece büyük şehirlerde çalışmaları',
          'Öğrencilerin notlarını düşürmeleri',
        ],
        correctIndex: 0,
        explanation:
          'Educadores enfatizam que ferramentas digitais "yüz yüze etkileşimin yerini tamamen alamayacağını" (não substituem totalmente a interação presencial).',
      },
      {
        id: 'tomer-3-q2',
        section: 'listening',
        audioText:
          'Kütüphane duyurusu: Sınav haftası boyunca ana okuma salonumuz gece saat 23:00’e kadar açık kalacaktır. Grup çalışmaları için lütfen ikinci kattaki sesli odaları kullanınız.',
        audioPlaysLimit: 2,
        prompt: 'Grup çalışması yapmak isteyen öğrenciler nereye gitmelidir?',
        options: [
          'İkinci kattaki sesli odalara',
          'Zemin kattaki kafeteryaya',
          'Ana okuma salonunun dışına',
          'Üçüncü kattaki arşive',
        ],
        correctIndex: 0,
        explanation:
          'Para trabalho em grupo, o aviso pede que usem as salas do segundo andar ("ikinci kattaki sesli odaları").',
      },
      {
        id: 'tomer-3-q3',
        section: 'language_use',
        prompt: 'Doğru edilgen yapıyı seçin: "Yeni eğitim programı gelecek ay ___."',
        options: ['uygulanacak', 'uygulayacak', 'uygulamış', 'uyguluyor'],
        correctIndex: 0,
        explanation:
          '"uygulanmak" é a forma passiva de "uygulamak" (será implementado = uygulanacak).',
      },
      {
        id: 'tomer-3-q4',
        section: 'language_use',
        prompt: 'Hangisi "eğer" anlamında koşul cümlesidir? "Zamanım ___, bu kitabı mutlaka okurdum."',
        options: ['olsaydı', 'oldu', 'olacak', 'olmuş'],
        correctIndex: 0,
        explanation:
          'Condicional irreal no passado/presente usa "-sa/-se + -dı": "olsaydı" (se eu tivesse).',
      },
    ],
    writingTask: {
      prompt:
        'Üniversite eğitiminde çevrim içi derslerin mi yoksa yüz yüze derslerin mi daha verimli olduğunu tartışan 110 kelimelik bir kompozisyon yazın.',
      minWords: 85,
      rubricCriteria: [
        'Estrutura introdução–desenvolvimento–conclusão',
        'Uso de voz passiva e orações condicionais',
        'Registro acadêmico claro',
      ],
      expectedKeywords: ['eğitim', 'çevrim içi', 'yüz yüze', 'verimli', 'sonuç'],
      modelAnswer:
        'Günümüzde yükseköğretimde çevrim içi ve yüz yüze derslerin verimliliği sıkça tartışılmaktadır. Çevrim içi dersler zaman ve mekan esnekliği sağlayarak çalışan öğrencilere büyük kolaylık sunar. Öte yandan, yüz yüze eğitimde öğrenciler öğretim üyeleriyle doğrudan iletişim kurabilir ve tartışmalara aktif biçimde katılabilir. Eğer her iki yöntemin güçlü yönleri birleştirilirse, hibrit eğitim modeli öğrenciler için en verimli öğrenme deneyimini sunacaktır.',
    },
  },
  {
    id: 'tomer-sim-4',
    examTypeId: 'tomer',
    languageCode: 'tr',
    simulationNumber: 4,
    title: 'YDS / TÖMER C1 — Simulado 4: Ekonomi & Bilim',
    targetCefr: 'C1',
    durationMinutes: 50,
    questions: [
      {
        id: 'tomer-4-q1',
        section: 'reading',
        passageTitle: 'Yenilenebilir Enerji Yatırımları',
        passageText:
          'Küresel enerji dönüşümü kapsamında güneş ve rüzgar santrallerine yapılan yatırımlar son beş yılda rekor düzeye ulaştı. Bununla birlikte, enerji depolama teknolojilerindeki darboğazlar aşılmadığı sürece şebeke istikrarının tam anlamıyla sağlanması güç görünmektedir.',
        prompt: 'Metne göre şebeke istikrarının sağlanması hangi koşula bağlıdır?',
        options: [
          'Enerji depolama teknolojilerindeki sorunların çözülmesine',
          'Fosil yakıtların tamamen yasaklanmasına',
          'Yatırımların beş yıl durdurulmasına',
          'Rüzgar santrallerinin sayısının azaltılmasına',
        ],
        correctIndex: 0,
        explanation:
          'O texto afirma que sem superar os gargalos em armazenamento de energia ("enerji depolama teknolojilerindeki darboğazlar aşılmadığı sürece"), a estabilidade da rede é difícil.',
      },
      {
        id: 'tomer-4-q2',
        section: 'listening',
        audioText:
          'Ekonomi sempozyumunun kapanış oturumunda konuşan Prof. Kaya, sürdürülebilir büyümenin yalnızca kısa vadeli teşviklerle değil, Ar-Ge harcamalarının istikrarlı biçimde artırılmasıyla mümkün olacağını belirtti.',
        audioPlaysLimit: 2,
        prompt: 'Prof. Kaya’ya göre sürdürülebilir büyüme nasıl sağlanabilir?',
        options: [
          'Ar-Ge harcamalarını istikrarlı biçimde artırarak',
          'Sadece kısa vadeli teşvikler vererek',
          'Araştırma bütçelerini kısarak',
          'İhracatı tamamen durdurarak',
        ],
        correctIndex: 0,
        explanation:
          'Prof. Kaya destaca o aumento constante dos gastos em P&D ("Ar-Ge harcamalarının istikrarlı biçimde artırılmasıyla").',
      },
      {
        id: 'tomer-4-q3',
        section: 'language_use',
        prompt: 'C1 bağlaç seçimi: "Proje bütçesi kısıtlıydı; ___, ekip hedeflenen tarihten önce teslimatı tamamladı."',
        options: ['buna karşın', 'dolayısıyla', 'nitekim', 'ayrıca'],
        correctIndex: 0,
        explanation:
          '"buna karşın" (apesar disso / em contrapartida) estabelece o contraste concessivo adequado.',
      },
      {
        id: 'tomer-4-q4',
        section: 'language_use',
        prompt: 'Doğru dolaylı anlatım eki: "Başkan, yeni düzenlemenin önümüzdeki yıl yürürlüğe gir___ açıkladı."',
        options: ['eceğini', 'diğinde', 'mekle', 'dikçe'],
        correctIndex: 0,
        explanation:
          'Discurso indireto com referência futura exige "-eceğini" ("yürürlüğe gireceğini açıkladı").',
      },
    ],
    writingTask: {
      prompt:
        'Yapay zekânın iş gücü piyasası üzerindeki uzun vadeli etkilerini değerlendiren 140 kelimelik akademik bir değerlendirme metni yazın.',
      minWords: 110,
      rubricCriteria: [
        'Registro acadêmico C1 e nominalizações (-ması, -eceği)',
        'Coesão com conectores formais (buna karşın, öte yandan, sonuç itibarıyla)',
        'Argumentação equilibrada entre riscos e oportunidades',
      ],
      expectedKeywords: ['yapay zekâ', 'istihdam', 'dönüşüm', 'eğitim', 'buna karşın'],
      modelAnswer:
        'Yapay zekâ teknolojilerinin hızla gelişmesi, küresel iş gücü piyasasında köklü bir dönüşümü beraberinde getirmektedir. Tekrarlayan idari ve teknik görevlerin otomatikleşmesi bazı meslek gruplarında istihdam kaybına yol açma potansiyeli taşımaktadır. Buna karşın, veri analitiği, sistem güvenliği ve yaratıcı problem çözme gibi alanlarda yeni iş kolları doğmaktadır. Bu geçiş sürecinin sağlıklı yönetilebilmesi, çalışanların yaşam boyu öğrenme programlarıyla yeniden nitelik kazanmasına bağlıdır. Sonuç itibarıyla, yapay zekânın toplumsal fayda sağlaması kamu politikaları ve eğitim yatırımlarının uyumuna dayanmaktadır.',
    },
  },

  // =========================================================================
  // YAEL / ULPAN (he) — 4 Simulations
  // =========================================================================
  {
    id: 'yael-sim-1',
    examTypeId: 'yael',
    languageCode: 'he',
    simulationNumber: 1,
    title: 'YAEL / Ulpan B1 — Simulado 1: חיי היומיום (Cotidiano)',
    targetCefr: 'B1',
    durationMinutes: 45,
    questions: [
      {
        id: 'yael-1-q1',
        section: 'reading',
        passageTitle: 'עבודה היברידית בתל אביב',
        passageText:
          'בשנים האחרונות חברות הייטק רבות בישראל מאפשרות לעובדים לעבוד מהבית פעמיים בשבוע. העובדים נהנים מחיסכון בזמן הנסיעה, אך מומחים ממליצים לשמור על שעות עבודה קבועות כדי להפריד בין הבית לעבודה.',
        prompt: 'מה ממליצים המומחים לעובדים מהבית?',
        options: [
          'לשמור על שעות עבודה קבועות',
          'לעבוד רק בלילה',
          'לוותר על הפסקות',
          'לנסוע למשרד כל יום',
        ],
        correctIndex: 0,
        explanation:
          'O texto recomenda manter horários fixos de trabalho ("לשמור על שעות עבודה קבועות").',
      },
      {
        id: 'yael-1-q2',
        section: 'reading',
        passageTitle: 'עבודה היברידית בתל אביב',
        passageText:
          'בשנים האחרונות חברות הייטק רבות בישראל מאפשרות לעובדים לעבוד מהבית פעמיים בשבוע. העובדים נהנים מחיסכון בזמן הנסיעה, אך מומחים ממליצים לשמור על שעות עבודה קבועות כדי להפריד בין הבית לעבודה.',
        prompt: 'ממה נהנים העובדים במודל ההיברידי?',
        options: [
          'מחיסכון בזמן הנסיעה',
          'מחופשה של חודש',
          'ממשרד גדול יותר',
          'מארוחות חינם בבית',
        ],
        correctIndex: 0,
        explanation:
          'Eles aproveitam a economia no tempo de deslocamento ("מחיסכון בזמן הנסיעה").',
      },
      {
        id: 'yael-1-q3',
        section: 'listening',
        audioText:
          'נוסעים יקרים, הרכבת לירושלים תצא בעוד עשר דקות מרציף מספר 4 ולא מרציף מספר 2. נא לשים לב לשינוי.',
        audioPlaysLimit: 2,
        prompt: 'מאיזה רציף תצא הרכבת לירושלים?',
        options: ['מרציף 4', 'מרציף 2', 'מרציף 1', 'הרכבת בוטלה'],
        correctIndex: 0,
        explanation: 'O aviso informa que o trem partirá da plataforma 4 ("מרציף מספר 4").',
      },
      {
        id: 'yael-1-q4',
        section: 'listening',
        audioText:
          'דנה: היי יואב, אתה בא לסרט הערב? יואב: מצטער דנה, יש לי מבחן חשוב מחר בבוקר ואני צריך ללמוד. אולי ניפגש לקפה ביום שישי?',
        audioPlaysLimit: 2,
        prompt: 'למה יואב לא יכול לבוא לסרט הערב?',
        options: [
          'כי יש לו מבחן חשוב מחר בבוקר',
          'כי הוא כבר ראה את הסרט',
          'כי הוא נוסע לחוץ לארץ',
          'כי הוא חולה',
        ],
        correctIndex: 0,
        explanation: 'Yoav tem uma prova importante amanhã de manhã ("מבחן חשוב מחר בבוקר").',
      },
      {
        id: 'yael-1-q5',
        section: 'language_use',
        prompt: 'בחרו את מילת היחס הנכונה: "קראתי ___ הספר החדש של הסופר."',
        options: ['את', 'אל', 'על ידי', 'בשביל'],
        correctIndex: 0,
        explanation:
          'Objeto direto definido ("הספר החדש") exige a partícula "את" em hebraico.',
      },
      {
        id: 'yael-1-q6',
        section: 'language_use',
        prompt: 'השלימו בזמן עתיד: "מחר אנחנו ___ למרכז העיר ברכבת."',
        options: ['ניסע', 'נסענו', 'נוסעים', 'לנסוע'],
        correctIndex: 0,
        explanation: '1ª pessoa do plural no futuro de לנסוע é "ניסע".',
      },
    ],
    writingTask: {
      prompt:
        'כתבו הודעה קצרה לעמית לעבודה (כ-60 מילים): הסבירו שמחר לא תוכלו להגיע לפגישה בבוקר בגלל תור לרופא, התנצלו והציעו לקרוא את הסיכום אחר הצהריים.',
      minWords: 45,
      rubricCriteria: [
        'Saudação e encerramento naturais em hebraico',
        'Uso correto de tempos verbais (עבר/עתיד) e partícula את',
        'Clareza na justificativa e proposta de acompanhamento',
      ],
      expectedKeywords: ['פגישה', 'רופא', 'מצטער', 'סיכום', 'מחר'],
      modelAnswer:
        'היי נועה, לצערי לא אוכל להגיע לפגישת הצוות מחר בבוקר כי יש לי תור חשוב לרופא. אני מתנצל על ההודעה המאוחרת. כשאחזור למשרד אחר הצהריים, אקרא את כל הסיכום ואשלח לך את ההערות שלי. תודה רבה על ההבנה, דניאל.',
    },
    speakingTask: {
      title: 'YAEL / Ulpan — שיחה והצגה עצמית',
      instructionsPt: 'Apresente-se em hebraico e explique sua motivação e rotina.',
      parts: [
        {
          id: 'yael-1-sp1',
          partLabel: 'חלק 1 — הצגה אישית',
          prepSeconds: 20,
          speakSeconds: 60,
          prompt: 'ספרו על עצמכם, על העבודה או הלימודים שלכם, ומדוע אתם לומדים עברית.',
          bulletPoints: ['שם ומקצוע', 'תחביבים ושגרה', 'מטרת לימוד העברית'],
          evaluationCriteria: ['Concordância de gênero', 'Uso de ב/ל/מ e את', 'Fluência'],
        },
      ],
    },
  },
  {
    id: 'yael-sim-2',
    examTypeId: 'yael',
    languageCode: 'he',
    simulationNumber: 2,
    title: 'YAEL B2 — Simulado 2: תחבורה וסביבה (Transporte & Ambiente)',
    targetCefr: 'B2',
    durationMinutes: 45,
    questions: [
      {
        id: 'yael-2-q1',
        section: 'reading',
        passageTitle: 'שבילי אופניים בערים גדולות',
        passageText:
          'עיריות רבות משקיעות בהרחבת שבילי האופניים במרכזי הערים. מחקרים מראים שכאשר יש מסלולים בטוחים ומופרדים ממכוניות, יותר תושבים בוחרים לרכוב לעבודה במקום לעמוד בפקקים.',
        prompt: 'מה גורם ליותר תושבים לרכוב לעבודה?',
        options: [
          'מסלולים בטוחים ומופרדים ממכוניות',
          'מחירי אופניים גבוהים יותר',
          'סגירת כל תחנות האוטובוס',
          'הגדלת הפקקים במרכז',
        ],
        correctIndex: 0,
        explanation:
          'Quando há ciclovias seguras e separadas dos carros ("מסלולים בטוחים ומופרדים ממכוניות"), mais moradores pedalam.',
      },
      {
        id: 'yael-2-q2',
        section: 'listening',
        audioText:
          'תחזית מזג האוויר: מחר יהיה נעים ובהיר ברוב חלקי הארץ, אך בשעות הערב ייתכן גשם קל בצפון.',
        audioPlaysLimit: 2,
        prompt: 'מתי ייתכן גשם קל בצפון?',
        options: ['בשעות הערב', 'בבוקר המוקדם', 'בצהריים', 'לא יירד גשם כלל'],
        correctIndex: 0,
        explanation: 'A previsão indica chuva leve à noite no norte ("בשעות הערב").',
      },
      {
        id: 'yael-2-q3',
        section: 'language_use',
        prompt: 'בחרו את צורת הסמיכות הנכונה: "___ העיר החדשה מודרנית מאוד."',
        options: ['תחנת הרכבת של', 'התחנה רכבת', 'תחנה הרכבת', 'התחנת רכבת'],
        correctIndex: 0,
        explanation:
          'Na construção de Smikhut (estado construto), o primeiro termo não leva artigo ה: "תחנת הרכבת".',
      },
      {
        id: 'yael-2-q4',
        section: 'language_use',
        prompt: 'השלימו את המשפט: "למרות ___ מזג האוויר היה קר, יצאנו לטיול."',
        options: ['ש-', 'כי', 'אם', 'כאשר'],
        correctIndex: 0,
        explanation: '"למרות ש..." significa "apesar de que...".',
      },
    ],
    writingTask: {
      prompt:
        'כתבו חיבור קצר (כ-80 מילים) על היתרונות והחסרונות של תחבורה ציבורית חינמית בערים גדולות.',
      minWords: 65,
      rubricCriteria: [
        'Uso de conectores (מצד אחד, מצד שני, לסיכום)',
        'Smikhut correto e concordância nominal',
        'Argumentação clara e objetiva',
      ],
      expectedKeywords: ['תחבורה ציבורית', 'פקקים', 'זיהום', 'תקציב', 'לסיכום'],
      modelAnswer:
        'תחבורה ציבורית חינמית יכולה להפחית משמעותית את הפקקים ואת זיהום האוויר בערים גדולות. מצד אחד, יותר תושבים יעדיפו רכבות ואוטובוסים במקום רכב פרטי. מצד שני, העיריות יצטרכו תקציב גדול כדי לשמור על איכות השירות ותדירות הנסיעות. לסיכום, שילוב של הנחות משמעותיות ותשתית יעילה הוא פתרון מאוזן ובר-קיימא.',
    },
  },
  {
    id: 'yael-sim-3',
    examTypeId: 'yael',
    languageCode: 'he',
    simulationNumber: 3,
    title: 'YAEL B2 — Simulado 3: חינוך וטכנולוגיה',
    targetCefr: 'B2',
    durationMinutes: 45,
    questions: [
      {
        id: 'yael-3-q1',
        section: 'reading',
        passageTitle: 'למידה מקוונת באוניברסיטאות',
        passageText:
          'הקורסים המקוונים מאפשרים לסטודנטים מאזורים מרוחקים ללמוד במוסדות מובילים. יחד עם זאת, חוקרים מדגישים כי דיונים פנים אל פנים בכיתה תורמים לפיתוח חשיבה ביקורתית ושיתוף פעולה.',
        prompt: 'לפי החוקרים, במה תורמים דיונים פנים אל פנים?',
        options: [
          'בפיתוח חשיבה ביקורתית ושיתוף פעולה',
          'בהארכת שעות הנסיעה',
          'בהקטנת מספר הקורסים',
          'בהחלפת כל המרצים',
        ],
        correctIndex: 0,
        explanation:
          'Pesquisadores destacam o desenvolvimento do pensamento crítico e colaboração ("חשיבה ביקורתית ושיתוף פעולה").',
      },
      {
        id: 'yael-3-q2',
        section: 'listening',
        audioText:
          'הודעה בספרייה: בתקופת המבחנים אולם הקריאה המרכזי פתוח עד השעה אחת עשרה בלילה. לעבודה בקבוצות, אנא עברו לחדרי הלימוד בקומה השנייה.',
        audioPlaysLimit: 2,
        prompt: 'איפה מתקיימת עבודה בקבוצות?',
        options: ['בקומה השנייה', 'באולם הכניסה', 'מחוץ לבניין', 'בקומה הרביעית'],
        correctIndex: 0,
        explanation: 'Para trabalho em grupo, deve-se ir às salas no segundo andar ("בקומה השנייה").',
      },
      {
        id: 'yael-3-q3',
        section: 'language_use',
        prompt: 'בחרו את הבניין הסביל הנכון: "התוכנית החדשה ___ בחודש הבא."',
        options: ['תיושם', 'תיישם', 'יישמה', 'מיישמת'],
        correctIndex: 0,
        explanation: 'Voz passiva (Pu‘al) no futuro feminino para "התוכנית" é "תיושם".',
      },
      {
        id: 'yael-3-q4',
        section: 'language_use',
        prompt: 'משפט תנאי בעבר: "אילו ___ לי יותר זמן, הייתי קורא את כל המאמר."',
        options: ['היה', 'יהיה', 'יש', 'הייתה'],
        correctIndex: 0,
        explanation: 'Condicional contrafactual com "אילו" usa "היה לי".',
      },
    ],
    writingTask: {
      prompt:
        'השוו בין למידה מקוונת לבין למידה פרונטלית באקדמיה (כ-90 מילים) והציעו מודל משולב.',
      minWords: 70,
      rubricCriteria: [
        'Comparação estruturada',
        'Uso correto de בניינים e conectores formais (יחד עם זאת, לעומת זאת)',
        'Vocabulário acadêmico',
      ],
      expectedKeywords: ['למידה', 'מקוונת', 'פרונטלית', 'סטודנטים', 'שילוב'],
      modelAnswer:
        'למידה מקוונת מעניקה גמישות רבה ומאפשרת לסטודנטים לשלב עבודה ולימודים. לעומת זאת, למידה פרונטלית מעודדת שיח חי בכיתה ומחזקת את הקשר בין המרצים לסטודנטים. יחד עם זאת, נראה כי מודל היברידי המשלב הרצאות מוקלטות עם סדנאות מעשיות בקמפוס מספק את האיזון המיטבי.',
    },
  },
  {
    id: 'yael-sim-4',
    examTypeId: 'yael',
    languageCode: 'he',
    simulationNumber: 4,
    title: 'YAEL C1 — Simulado 4: כלכלה ומדע (Economia & Ciência)',
    targetCefr: 'C1',
    durationMinutes: 50,
    questions: [
      {
        id: 'yael-4-q1',
        section: 'reading',
        passageTitle: 'מעבר לאנרגיה מתחדשת',
        passageText:
          'ההשקעה באנרגיה סולארית גדלה בקצב חסר תקדים בעשור האחרון. עם זאת, ללא התקדמות משמעותית בטכנולוגיות אגירת אנרגיה, יתקשו רשתות החשמל לשמור על יציבות בשעות שיא.',
        prompt: 'מהו האתגר המרכזי המוזכר בקטע?',
        options: [
          'הצורך בהתקדמות בטכנולוגיות אגירת אנרגיה',
          'מחסור באור שמש בקיץ',
          'היעדר עניין בהשקעות',
          'עודף תחנות כוח פחמיות',
        ],
        correctIndex: 0,
        explanation:
          'O texto aponta a necessidade de avanço em tecnologias de armazenamento ("טכנולוגיות אגירת אנרגיה").',
      },
      {
        id: 'yael-4-q2',
        section: 'listening',
        audioText:
          'בכנס הכלכלי בירושלים ציינו החוקרים כי צמיחה בת-קיימא תלויה בהשקעה עקבית במחקר ופיתוח ולא רק בצעדים קצרי טווח.',
        audioPlaysLimit: 2,
        prompt: 'במה תלויה צמיחה בת-קיימא לפי החוקרים?',
        options: [
          'בהשקעה עקבית במחקר ופיתוח',
          'בצעדים קצרי טווח בלבד',
          'בהפחתת שיתוף הפעולה הבינלאומי',
          'בביטול תקציבי המדע',
        ],
        correctIndex: 0,
        explanation: 'Depende de investimento consistente em P&D ("השקעה עקבית במחקר ופיתוח").',
      },
      {
        id: 'yael-4-q3',
        section: 'language_use',
        prompt: 'בחרו את מילת הקישור המתאימה: "התקציב היה מצומצם; ___, הצוות עמד ביעדים."',
        options: ['אף על פי כן', 'לפיכך', 'משום כך', 'יתר על כן'],
        correctIndex: 0,
        explanation: '"אף על פי כן" significa "ainda assim / apesar disso".',
      },
      {
        id: 'yael-4-q4',
        section: 'language_use',
        prompt: 'משלב גבוה: "המנכ"ל הודיע כי הרפורמה ___ בחודש ינואר."',
        options: ['תיכנס לתוקף', 'נכנסת לתוקף אתמול', 'תכניס לתוקף', 'נכנסו לתוקף'],
        correctIndex: 0,
        explanation: 'Expressão idiomática formal: "תיכנס לתוקף" (entrará em vigor).',
      },
    ],
    writingTask: {
      prompt:
        'נתחו את השפעת הבינה המלאכותית על שוק העבודה העתידי (כ-110 מילים) והציעו מדיניות הכשרה מתאימה.',
      minWords: 90,
      rubricCriteria: [
        'Registro formal C1 (משלב עיוני/אקדמי)',
        'Coesão com conectores avançados (עם זאת, אף על פי כן, לפיכך)',
        'Argumentação clara sobre requalificação profissional',
      ],
      expectedKeywords: ['בינה מלאכותית', 'שוק העבודה', 'הכשרה', 'מדיניות', 'לפיכך'],
      modelAnswer:
        'התפתחות הבינה המלאכותית מחוללת שינוי עמוק בשוק העבודה המודרני. מחד גיסא, אוטומציה של משימות שגרתיות עלולה לצמצם משרות מסורתיות. מאידך גיסא, נוצרים תפקידים חדשים בתחומי הנתונים, האבטחה והפיתוח. לפיכך, על הממשלות והאקדמיה להשקיע בתוכניות הכשרה מתמשכות כדי לאפשר לעובדים להסתגל לכלכלה המשתנה.',
    },
  },

  // =========================================================================
  // NORSKPRØVE / BERGENSTESTEN (nb) — 4 Simulations
  // =========================================================================
  {
    id: 'norskprove-sim-1',
    examTypeId: 'norskprove',
    languageCode: 'nb',
    simulationNumber: 1,
    title: 'Norskprøve B1 — Simulado 1: Hverdag & Arbeidsliv',
    targetCefr: 'B1',
    durationMinutes: 45,
    questions: [
      {
        id: 'norskprove-1-q1',
        section: 'reading',
        passageTitle: 'Fleksibel arbeidstid i Norge',
        passageText:
          'Mange norske bedrifter tilbyr fleksibel arbeidstid og mulighet for hjemmekontor to dager i uken. Ansatte setter pris på kortere reisevei, men eksperter anbefaler faste rutiner slik at fritiden ikke glir inn i arbeidstiden.',
        prompt: 'Hva anbefaler ekspertene for å skille arbeid og fritid?',
        options: [
          'Faste rutiner',
          'Å jobbe om natten',
          'Å slutte med pauser',
          'Å reise mer med bil',
        ],
        correctIndex: 0,
        explanation:
          'O texto recomenda "faste rutiner" (rotinas fixas) para evitar que o tempo livre se misture ao trabalho.',
      },
      {
        id: 'norskprove-1-q2',
        section: 'reading',
        passageTitle: 'Fleksibel arbeidstid i Norge',
        passageText:
          'Mange norske bedrifter tilbyr fleksibel arbeidstid og mulighet for hjemmekontor to dager i uken. Ansatte setter pris på kortere reisevei, men eksperter anbefaler faste rutiner slik at fritiden ikke glir inn i arbeidstiden.',
        prompt: 'Hvorfor liker mange ansatte hjemmekontor?',
        options: [
          'De får kortere reisevei',
          'De slipper å bruke datamaskin',
          'De får lengre sommerferie',
          'De trenger ikke å snakke med kolleger',
        ],
        correctIndex: 0,
        explanation: '"Ansatte setter pris på kortere reisevei" (valorizam o trajeto mais curto).',
      },
      {
        id: 'norskprove-1-q3',
        section: 'listening',
        audioText:
          'Melding på Oslo S: Regiontoget til Bergen klokken 14:25 er dessverre ti minutter forsinket på grunn av signalfeil, og går i dag fra spor 6 i stedet for spor 3.',
        audioPlaysLimit: 2,
        prompt: 'Hva får passasjerene vite i meldingen?',
        options: [
          'Toget er 10 minutter forsinket og går fra spor 6.',
          'Toget går presis fra spor 3.',
          'Toget til Bergen er innstilt.',
          'Passasjerene må ta buss fra spor 1.',
        ],
        correctIndex: 0,
        explanation:
          'O anúncio informa 10 minutos de atraso ("ti minutter forsinket") e saída da plataforma 6 ("spor 6").',
      },
      {
        id: 'norskprove-1-q4',
        section: 'listening',
        audioText:
          'Ingrid: Hei Henrik, blir du med på kino i kveld? Henrik: Beklager, Ingrid, jeg må forberede en presentasjon til møtet i morgen tidlig. Kan vi ta en kaffe på lørdag?',
        audioPlaysLimit: 2,
        prompt: 'Hvorfor kan ikke Henrik bli med på kino i kveld?',
        options: [
          'Han må forberede en presentasjon til i morgen.',
          'Han liker ikke filmen.',
          'Han er på ferie i Bergen.',
          'Han skal på konsert.',
        ],
        correctIndex: 0,
        explanation: 'Henrik precisa preparar uma apresentação para amanhã cedo.',
      },
      {
        id: 'norskprove-1-q5',
        section: 'language_use',
        prompt: 'Velg riktig ordstilling (V2): "I morgen ___ vi et nytt prosjekt på kontoret."',
        options: ['starter', 'vi starter', 'starte', 'har starte'],
        correctIndex: 0,
        explanation:
          'Regra V2: quando a frase começa com advérbio de tempo ("I morgen"), o verbo conjugado vem na 2ª posição ("starter vi").',
      },
      {
        id: 'norskprove-1-q6',
        section: 'language_use',
        prompt: 'Leddsetning med "fordi": "Han ble hjemme fordi han ___ syk."',
        options: ['ikke var', 'var ikke', 'ikke er vært', 'var aldri ikke'],
        correctIndex: 0,
        explanation:
          'Em orações subordinadas em Bokmål, "ikke" vem antes do verbo conjugado ("ikke var").',
      },
    ],
    writingTask: {
      prompt:
        'Skriv en kort e-post til kollegaen din Marte (ca. 80 ord). Forklar at du ikke kan delta på møtet i morgen fordi du har legetime, be om unnskyldning, og si når du vil lese referatet.',
      minWords: 60,
      rubricCriteria: [
        'Saudação e despedida adequadas (Hei Marte / Vennlig hilsen)',
        'Ordem V2 correta e negação em subordinadas',
        'Justificativa clara e proposta objetiva',
      ],
      expectedKeywords: ['møtet', 'legetime', 'beklager', 'referatet', 'i morgen'],
      modelAnswer:
        'Hei Marte, jeg beklager, men jeg kan dessverre ikke delta på teammøtet i morgen fordi jeg har en viktig legetime klokken ni. Når jeg kommer tilbake på kontoret på ettermiddagen, skal jeg lese hele referatet og sende deg mine kommentarer med en gang. Takk for forståelsen! Vennlig hilsen, Emil.',
    },
    speakingTask: {
      title: 'Norskprøve Muntlig — Hverdag & Arbeid',
      instructionsPt: 'Apresente-se em norueguês Bokmål e responda sobre sua rotina.',
      parts: [
        {
          id: 'norskprove-1-sp1',
          partLabel: 'Del 1 — Presentasjon',
          prepSeconds: 20,
          speakSeconds: 60,
          prompt: 'Fortell kort om deg selv, hverdagen din og hvorfor du lærer norsk.',
          bulletPoints: ['Yrke eller studier', 'Fritidsinteresser', 'Mål med norsken'],
          evaluationCriteria: ['Regra V2', 'Sufixos definidos (-en/-et/-a)', 'Fluência'],
        },
      ],
    },
  },
  {
    id: 'norskprove-sim-2',
    examTypeId: 'norskprove',
    languageCode: 'nb',
    simulationNumber: 2,
    title: 'Norskprøve B2 — Simulado 2: Miljø & Byutvikling',
    targetCefr: 'B2',
    durationMinutes: 45,
    questions: [
      {
        id: 'norskprove-2-q1',
        section: 'reading',
        passageTitle: 'Bilfri bykjerne i Oslo',
        passageText:
          'Oslo har gradvis fjernet parkeringsplasser i sentrum for å gi mer plass til fotgjengere, syklister og kollektivtrafikk. Til tross for tidlig skepsis viser undersøkelser at flere besøker sentrum til fots enn før.',
        prompt: 'Hva viser undersøkelsene etter at parkeringsplasser ble fjernet?',
        options: [
          'Flere besøker sentrum til fots enn tidligere.',
          'Ingen handler i sentrum lenger.',
          'Antall biler i sentrum har økt.',
          'Kollektivtrafikken ble lagt ned.',
        ],
        correctIndex: 0,
        explanation:
          'Pesquisas mostram que mais pessoas visitam o centro a pé do que antes ("flere besøker sentrum til fots enn før").',
      },
      {
        id: 'norskprove-2-q2',
        section: 'listening',
        audioText:
          'Værmeldingen for Vestlandet: I morgen blir det oppholdsvær og litt sol på formiddagen, men utover kvelden trekker det inn regnbyger fra vest.',
        audioPlaysLimit: 2,
        prompt: 'Hvordan blir været i Vestlandet utover kvelden?',
        options: ['Regnbyger fra vest', 'Sterk snøstorm', 'Helt skyfritt', 'Kuldegrader'],
        correctIndex: 0,
        explanation: 'À noite chegam pancadas de chuva do oeste ("regnbyger fra vest").',
      },
      {
        id: 'norskprove-2-q3',
        section: 'language_use',
        prompt: 'Velg riktig refleksivt possessiv: "Astrid tok ___ egen sykkel til jobben."',
        options: ['sin', 'hennes', 'sitt', 'sine'],
        correctIndex: 0,
        explanation:
          'Quando o possuidor é o sujeito da oração (Astrid) e o substantivo é masculino singular ("sykkel"), usa-se "sin".',
      },
      {
        id: 'norskprove-2-q4',
        section: 'language_use',
        prompt: 'Fullfør setningen: "Til tross ___ det dårlige været, gikk vi en lang tur."',
        options: ['for', 'av', 'med', 'om'],
        correctIndex: 0,
        explanation: 'A preposição fixa é "til tross for" (apesar de).',
      },
    ],
    writingTask: {
      prompt:
        'Bør kollektivtrafikken være gratis i norske byer? Skriv en argumenterende tekst på ca. 100 ord der du drøfter fordeler og ulemper.',
      minWords: 80,
      rubricCriteria: [
        'Argumentação equilibrada (på den ene siden / på den andre siden)',
        'Uso correto de inversão V2 e possessivos reflexivos',
        'Vocabulário urbano e ambiental B2',
      ],
      expectedKeywords: ['kollektivtrafikk', 'miljø', 'kostnader', 'biler', 'konklusjon'],
      modelAnswer:
        'Gratis kollektivtrafikk i norske byer kan bidra til å redusere biltrafikken og forbedre luftkvaliteten. På den ene siden blir det mer attraktivt for pendlere å la bilen stå hjemme. På den andre siden krever et slikt tiltak store offentlige midler for å opprettholde høy kvalitet og hyppige avganger. Konklusjonen er at rimelige månedskort kombinert med bedre rutetilbud ofte er en mer bærekraftig løsning.',
    },
  },
  {
    id: 'norskprove-sim-3',
    examTypeId: 'norskprove',
    languageCode: 'nb',
    simulationNumber: 3,
    title: 'Norskprøve B2 — Simulado 3: Utdanning & Teknologi',
    targetCefr: 'B2',
    durationMinutes: 45,
    questions: [
      {
        id: 'norskprove-3-q1',
        section: 'reading',
        passageTitle: 'Digitalisering i skolen',
        passageText:
          'Nettbrett og digitale læremidler gir elever rask tilgang til oppdatert informasjon. Likevel peker flere lærere på at håndskrift og fysiske bøker styrker konsentrasjonen og dybdelesingen hos barn og unge.',
        prompt: 'Hva peker flere lærere på som fordelen med fysiske bøker?',
        options: [
          'De styrker konsentrasjonen og dybdelesingen.',
          'De er lettere å miste.',
          'De erstatter internett helt.',
          'De gjør skoledagen kortere.',
        ],
        correctIndex: 0,
        explanation: 'Livros físicos fortalecem concentração e leitura profunda ("konsentrasjonen og dybdelesingen").',
      },
      {
        id: 'norskprove-3-q2',
        section: 'listening',
        audioText:
          'Informasjon fra biblioteket: I eksamensperioden holder hovedlesesalen åpent til klokken 23:00. Gruppearbeid skal foregå i stillerommet i andre etasje.',
        audioPlaysLimit: 2,
        prompt: 'Hvor skal gruppearbeid foregå?',
        options: ['I andre etasje', 'I hovedlesesalen', 'I kjelleren', 'Utenfor bygningen'],
        correctIndex: 0,
        explanation: 'Trabalhos em grupo devem ocorrer no segundo andar ("i andre etasje").',
      },
      {
        id: 'norskprove-3-q3',
        section: 'language_use',
        prompt: 'Velg riktig s-passiv: "Dørene ___ klokken ni hver morgen."',
        options: ['åpnes', 'åpner', 'åpnet', 'har åpnet'],
        correctIndex: 0,
        explanation: 'Voz passiva habitual com -s: "Dørene åpnes" (as portas são abertas).',
      },
      {
        id: 'norskprove-3-q4',
        section: 'language_use',
        prompt: 'Hypotetisk betingelse: "Hvis jeg ___ mer tid, ville jeg lært et nytt språk."',
        options: ['hadde', 'har', 'vil ha', 'får'],
        correctIndex: 0,
        explanation: 'Condicional hipotética usa preteritum "hadde" + "ville" + infinitivo.',
      },
    ],
    writingTask: {
      prompt:
        'Sammenlign digital undervisning og fysisk klasseromsundervisning (ca. 110 ord). Hva fungerer best for voksne studenter?',
      minWords: 85,
      rubricCriteria: [
        'Coesão com conectores (likevel, dessuten, derimot)',
        'Ordem de palavras em orações principais e subordinadas',
        'Conclusão clara',
      ],
      expectedKeywords: ['undervisning', 'digital', 'klasserom', 'fleksibilitet', 'derimot'],
      modelAnswer:
        'Digital undervisning gir stor fleksibilitet for voksne studenter som kombinerer jobb og studier. Dessuten sparer man mye tid på reise. I klasserommet får man derimot direkte kontakt med lærere og medstudenter, noe som gjør muntlig trening mye enklere. Derfor gir en kombinasjon av digitale ressurser og fysiske samlinger ofte det beste læringsutbyttet.',
    },
  },
  {
    id: 'norskprove-sim-4',
    examTypeId: 'norskprove',
    languageCode: 'nb',
    simulationNumber: 4,
    title: 'Bergenstesten C1 — Simulado 4: Samfunn & Økonomi',
    targetCefr: 'C1',
    durationMinutes: 50,
    questions: [
      {
        id: 'norskprove-4-q1',
        section: 'reading',
        passageTitle: 'Grønn omstilling i industrien',
        passageText:
          'Overgangen til fornybar energi i norsk industri krever ikke bare teknologisk innovasjon, men også forutsigbare rammevilkår. Uten langsiktige avtaler om krafttilgang risikerer nye prosjekter å bli utsatt.',
        prompt: 'Hva risikerer nye industriprosjekter uten langsiktige kraftavtaler?',
        options: [
          'Å bli utsatt',
          'Å få lavere skatt',
          'Å bruke mer kull',
          'Å bli flyttet til utlandet umiddelbart',
        ],
        correctIndex: 0,
        explanation: 'O texto afirma que novos projetos arriscam ser adiados ("risikerer ... å bli utsatt").',
      },
      {
        id: 'norskprove-4-q2',
        section: 'listening',
        audioText:
          'Under økonomikonferansen i Bergen understreket forskerne at bærekraftig vekst forutsetter jevnlige investeringer i utdanning og kompetanseheving, ikke bare kortsiktige støtteordninger.',
        audioPlaysLimit: 2,
        prompt: 'Hva forutsetter bærekraftig vekst ifølge forskerne?',
        options: [
          'Jevnlige investeringer i utdanning og kompetanseheving',
          'Kun kortsiktige støtteordninger',
          'Kutt i forskningsbudsjettet',
          'Stans i all industri',
        ],
        correctIndex: 0,
        explanation: 'Pesquisadores destacam investimentos contínuos em educação e qualificação.',
      },
      {
        id: 'norskprove-4-q3',
        section: 'language_use',
        prompt: 'Formelt bindeord: "Budsjettet var stramt; ___ klarte teamet å levere i tide."',
        options: ['likevel', 'derfor', 'nemlig', 'følgelig'],
        correctIndex: 0,
        explanation: '"likevel" (ainda assim / contudo) expressa concessão formal.',
      },
      {
        id: 'norskprove-4-q4',
        section: 'language_use',
        prompt: 'Uttrykk på C1-nivå: "Det nye regelverket ___ i kraft fra nyttår."',
        options: ['trer', 'går', 'blir', 'setter'],
        correctIndex: 0,
        explanation: 'Colocação fixa formal: "tre i kraft" (entrar em vigor).',
      },
    ],
    writingTask: {
      prompt:
        'Skriv en drøftende tekst (ca. 140 ord) om hvordan kunstig intelligens påvirker arbeidsmarkedet og hvilke tiltak myndighetene bør iverksette.',
      minWords: 110,
      rubricCriteria: [
        'Registro acadêmico C1 (Bergenstesten)',
        'Conectores formais (imidlertid, følgelig, til tross for dette)',
        'Vocabulário preciso sobre mercado de trabalho e requalificação',
      ],
      expectedKeywords: ['kunstig intelligens', 'arbeidsmarkedet', 'kompetanse', 'omstilling', 'følgelig'],
      modelAnswer:
        'Utviklingen innen kunstig intelligens medfører omfattende endringer i det moderne arbeidsmarkedet. Rutinepregede oppgaver automatiseres i økende grad, hvilket skaper usikkerhet for enkelte yrkesgrupper. Imidlertid vokser det samtidig frem nye stillinger som krever teknologisk forståelse, kritisk tenkning og tverrfaglig samarbeid. Følgelig bør myndighetene og arbeidslivet satse målrettet på etter- og videreutdanning slik at arbeidstakere kan tilegne seg ny kompetanse gjennom hele yrkeskarrieren.',
    },
  },

  // =========================================================================
  // PRØVE I DANSK 3 / STUDIEPRØVEN (da) — 4 Simulations
  // =========================================================================
  {
    id: 'pd3-sim-1',
    examTypeId: 'pd3',
    languageCode: 'da',
    simulationNumber: 1,
    title: 'Prøve i Dansk 3 (B1) — Simulado 1: Hverdag & Arbejde',
    targetCefr: 'B1',
    durationMinutes: 45,
    questions: [
      {
        id: 'pd3-1-q1',
        section: 'reading',
        passageTitle: 'Hjemmearbejde i Danmark',
        passageText:
          'Flere danske virksomheder giver nu medarbejderne mulighed for at arbejde hjemmefra to dage om ugen. Mange glæder sig over mindre transporttid, men eksperter råder til faste arbejdstider, så arbejde og fritid ikke flyder sammen.',
        prompt: 'Hvad råder eksperterne medarbejderne til?',
        options: [
          'At have faste arbejdstider',
          'At arbejde hele weekenden',
          'At undgå pauser',
          'At møde på kontoret hver dag',
        ],
        correctIndex: 0,
        explanation:
          'Especialistas aconselham ter horários fixos de trabalho ("faste arbejdstider").',
      },
      {
        id: 'pd3-1-q2',
        section: 'reading',
        passageTitle: 'Hjemmearbejde i Danmark',
        passageText:
          'Flere danske virksomheder giver nu medarbejderne mulighed for at arbejde hjemmefra to dage om ugen. Mange glæder sig over mindre transporttid, men eksperter råder til faste arbejdstider, så arbejde og fritid ikke flyder sammen.',
        prompt: 'Hvad sætter mange medarbejdere pris på?',
        options: [
          'Mindre transporttid',
          'Flere møder online',
          'Højere husleje',
          'Ingen kontakt med kolleger',
        ],
        correctIndex: 0,
        explanation: '"Mange glæder sig over mindre transporttid" (menos tempo de deslocamento).',
      },
      {
        id: 'pd3-1-q3',
        section: 'listening',
        audioText:
          'Meddelelse på Københavns Hovedbanegård: InterCity-toget mod Aarhus klokken 14:15 er desværre ti minutter forsinket og afgår i dag fra spor 8 i stedet for spor 5.',
        audioPlaysLimit: 2,
        prompt: 'Hvad oplyser meddelelsen om toget til Aarhus?',
        options: [
          'Det er 10 minutter forsinket og kører fra spor 8.',
          'Det kører til tiden fra spor 5.',
          'Det er aflyst på grund af sne.',
          'Passagererne skal tage metroen.',
        ],
        correctIndex: 0,
        explanation: 'O trem está 10 minutos atrasado e parte da plataforma 8 ("spor 8").',
      },
      {
        id: 'pd3-1-q4',
        section: 'listening',
        audioText:
          'Sofie: Hej Kasper, skal vi i biografen i aften? Kasper: Desværre Sofie, jeg skal forberede en præsentation til i morgen tidlig. Skal vi drikke en kop kaffe på lørdag?',
        audioPlaysLimit: 2,
        prompt: 'Hvorfor kan Kasper ikke komme i biografen i aften?',
        options: [
          'Han skal forberede en præsentation til i morgen.',
          'Han er træt af biografen.',
          'Han skal rejse til Odense.',
          'Han er syg.',
        ],
        correctIndex: 0,
        explanation: 'Kasper precisa preparar uma apresentação para amanhã cedo.',
      },
      {
        id: 'pd3-1-q5',
        section: 'language_use',
        prompt: 'Vælg rigtig ordstilling (V2): "I morgen ___ vi det nye projekt på kontoret."',
        options: ['starter', 'vi starter', 'starte', 'startede vi'],
        correctIndex: 0,
        explanation: 'Após advérbio inicial ("I morgen"), o verbo ocupa a 2ª posição ("starter vi").',
      },
      {
        id: 'pd3-1-q6',
        section: 'language_use',
        prompt: 'Ledsætning med "fordi": "Hun blev hjemme, fordi hun ___ komme."',
        options: ['ikke kunne', 'kunne ikke', 'ikke kan kunne', 'kunne aldrig ikke'],
        correctIndex: 0,
        explanation: 'Em subordinadas dinamarquesas, "ikke" precede o verbo ("ikke kunne").',
      },
    ],
    writingTask: {
      prompt:
        'Skriv en kort e-mail til din kollega Freja (ca. 80 ord). Forklar, at du ikke kan deltage i mødet i morgen på grund af en lægetid, undskyld, og fortæl hvornår du læser referatet.',
      minWords: 60,
      rubricCriteria: [
        'Saudação e despedida adequadas (Kære Freja / Venlig hilsen)',
        'Ordem V2 e negação em subordinadas',
        'Justificativa clara e proposta objetiva',
      ],
      expectedKeywords: ['mødet', 'lægetid', 'beklager', 'referatet', 'i morgen'],
      modelAnswer:
        'Kære Freja, jeg beklager meget, men jeg kan desværre ikke deltage i teammødet i morgen formiddag, fordi jeg har en vigtig lægetid klokken ni. Når jeg kommer tilbage til kontoret om eftermiddagen, læser jeg straks referatet og sender dig mine kommentarer. Tak for forståelsen! Venlig hilsen, Mikkel.',
    },
    speakingTask: {
      title: 'Prøve i Dansk 3 — Mundtlig Prøve',
      instructionsPt: 'Apresente-se em dinamarquês e fale sobre sua rotina e objetivos.',
      parts: [
        {
          id: 'pd3-1-sp1',
          partLabel: 'Del 1 — Præsentation',
          prepSeconds: 20,
          speakSeconds: 60,
          prompt: 'Fortæl kort om dig selv, din hverdag og hvorfor du lærer dansk.',
          bulletPoints: ['Arbejde eller studie', 'Fritid', 'Mål med dansk'],
          evaluationCriteria: ['Regra V2', 'Artigos definidos (-en/-et)', 'Clareza'],
        },
      ],
    },
  },
  {
    id: 'pd3-sim-2',
    examTypeId: 'pd3',
    languageCode: 'da',
    simulationNumber: 2,
    title: 'Prøve i Dansk 3 (B2) — Simulado 2: Cykelkultur & By',
    targetCefr: 'B2',
    durationMinutes: 45,
    questions: [
      {
        id: 'pd3-2-q1',
        section: 'reading',
        passageTitle: 'Cykelstier i København',
        passageText:
          'København investerer løbende i brede cykelstier og grønne bølger i lyskrydsene for cyklister. Resultatet er, at over halvdelen af byens borgere pendler på cykel til arbejde eller uddannelse hver dag.',
        prompt: 'Hvad er resultatet af investeringerne i cykelstier?',
        options: [
          'Over halvdelen af borgerne pendler på cykel.',
          'Ingen bruger metroen længere.',
          'Cykelstierne er blevet lukket.',
          'Biltrafikken i centrum er fordoblet.',
        ],
        correctIndex: 0,
        explanation: 'Mais da metade dos moradores vai trabalhar ou estudar de bicicleta.',
      },
      {
        id: 'pd3-2-q2',
        section: 'listening',
        audioText:
          'Vejrudsigten for Sjælland: Formiddagen starter med sol og let vind, men sidst på eftermiddagen kommer der spredte regnbyger vestfra.',
        audioPlaysLimit: 2,
        prompt: 'Hvornår kommer der regnbyger på Sjælland?',
        options: ['Sidst på eftermiddagen', 'Tidligt om morgenen', 'Hele natten', 'Slet ikke'],
        correctIndex: 0,
        explanation: 'As pancadas de chuva chegam no fim da tarde ("sidst på eftermiddagen").',
      },
      {
        id: 'pd3-2-q3',
        section: 'language_use',
        prompt: 'Vælg rigtigt refleksivt ejefald: "Mads tog ___ egen cykel til stationen."',
        options: ['sin', 'hans', 'sit', 'sine'],
        correctIndex: 0,
        explanation: '"sin" refere-se ao sujeito Mads com substantivo comum singular ("cykel").',
      },
      {
        id: 'pd3-2-q4',
        section: 'language_use',
        prompt: 'Fuldend sætningen: "På trods ___ det blæsende vejr cyklede vi hele vejen."',
        options: ['af', 'for', 'med', 'om'],
        correctIndex: 0,
        explanation: 'A locução prepositiva fixa em dinamarquês é "på trods af" (apesar de).',
      },
    ],
    writingTask: {
      prompt:
        'Skal offentlig transport være gratis i danske storbyer? Skriv en debattekst på ca. 100 ord om fordele og ulemper.',
      minWords: 80,
      rubricCriteria: [
        'Conectores argumentativos (på den ene side / på den anden side)',
        'Ordem V2 e possessivos reflexivos',
        'Vocabulário urbano B2',
      ],
      expectedKeywords: ['offentlig transport', 'miljø', 'udgifter', 'cykel', 'konklusion'],
      modelAnswer:
        'Gratis offentlig transport i større danske byer kan mindske biltrafikken og reducere CO2-udledningen. På den ene side bliver det lettere for alle borgere at vælge tog og bus i hverdagen. På den anden side kræver det betydelige skatteindtægter at opretholde høj kvalitet og punktlighed. Derfor kan billigere pendlerkort kombineret med bedre cykelstier være en mere bæredygtig løsning.',
    },
  },
  {
    id: 'pd3-sim-3',
    examTypeId: 'pd3',
    languageCode: 'da',
    simulationNumber: 3,
    title: 'Prøve i Dansk 3 (B2) — Simulado 3: Uddannelse & Digitalisering',
    targetCefr: 'B2',
    durationMinutes: 45,
    questions: [
      {
        id: 'pd3-3-q1',
        section: 'reading',
        passageTitle: 'Digitale læremidler i folkeskolen',
        passageText:
          'Digitale platforme giver elever adgang til interaktive øvelser og opdateret viden. Samtidig understreger flere undervisere, at trykte bøger og samtaler i klassen fortsat er afgørende for fordybelse.',
        prompt: 'Hvad er ifølge underviserne fortsat afgørende for fordybelse?',
        options: [
          'Trykte bøger og samtaler i klassen',
          'Flere skærme i frikvarteret',
          'Kortere skoletimer',
          'Afskaffelse af gruppearbejde',
        ],
        correctIndex: 0,
        explanation: 'Livros impressos e conversas em sala continuam essenciais para o aprofundamento ("fordybelse").',
      },
      {
        id: 'pd3-3-q2',
        section: 'listening',
        audioText:
          'Biblioteket meddeler: I eksamensperioden er hovedlæsesalen åben til klokken 23:00. Gruppearbejde bedes foregå i studierummene på anden sal.',
        audioPlaysLimit: 2,
        prompt: 'Hvor skal gruppearbejde foregå?',
        options: ['På anden sal', 'I kælderen', 'Ved hovedindgangen', 'Udendørs'],
        correctIndex: 0,
        explanation: 'O aviso pede que trabalhos em grupo ocorram no segundo andar ("på anden sal").',
      },
      {
        id: 'pd3-3-q3',
        section: 'language_use',
        prompt: 'Vælg s-passiv i nutid: "Dørene ___ klokken ni hver morgen."',
        options: ['åbnes', 'åbner', 'åbnede', 'har åbnet'],
        correctIndex: 0,
        explanation: 'Passiva habitual em -s: "Dørene åpnes" -> em dinamarquês "Dørene åbnes".',
      },
      {
        id: 'pd3-3-q4',
        section: 'language_use',
        prompt: 'Hypotetisk sætning: "Hvis jeg ___ mere tid, ville jeg læse flere bøger."',
        options: ['havde', 'har', 'vil have', 'får'],
        correctIndex: 0,
        explanation: 'Condicional irreal usa datid "havde" + "ville" + infinitiv.',
      },
    ],
    writingTask: {
      prompt:
        'Sammenlign onlineundervisning med fysisk undervisning for voksne kursister (ca. 110 ord).',
      minWords: 85,
      rubricCriteria: [
        'Coesão com conectores (desuden, derimod, derfor)',
        'Ordem de palavras em orações subordinadas',
        'Conclusão clara',
      ],
      expectedKeywords: ['onlineundervisning', 'fleksibilitet', 'fællesskab', 'derimod', 'kombination'],
      modelAnswer:
        'Onlineundervisning giver stor fleksibilitet for voksne, der skal passe arbejde og familie ved siden af studierne. Desuden sparer man tid på transport. Ved fysisk fremmøde får man derimod et stærkere socialt fællesskab og nemmere ved at øve mundtlig kommunikation. Derfor fungerer en kombination af digitale værktøjer og fysiske møder ofte bedst.',
    },
  },
  {
    id: 'pd3-sim-4',
    examTypeId: 'pd3',
    languageCode: 'da',
    simulationNumber: 4,
    title: 'Studieprøven C1 — Simulado 4: Samfund & Forskning',
    targetCefr: 'C1',
    durationMinutes: 50,
    questions: [
      {
        id: 'pd3-4-q1',
        section: 'reading',
        passageTitle: 'Den grønne omstilling i energisektoren',
        passageText:
          'Udbygningen af havvindmøller i Danmark har skabt markante resultater. Ikke desto mindre kræver et fuldt stabilt elnet også avanceret energilagring, så overskudsstrøm kan udnyttes, når vinden stilner af.',
        prompt: 'Hvad er nødvendigt for et fuldt stabilt elnet ud over havvindmøller?',
        options: [
          'Avanceret energilagring til vindstille perioder',
          'Flere kulkraftværker i byerne',
          'Mindre internationalt samarbejde',
          'Stop for al vindenergi',
        ],
        correctIndex: 0,
        explanation: 'É necessário armazenamento avançado de energia ("avanceret energilagring").',
      },
      {
        id: 'pd3-4-q2',
        section: 'listening',
        audioText:
          'På erhvervskonferencen i Aarhus fremhævede økonomerne, at langsigtet vækst forudsætter vedvarende investeringer i forskning og efteruddannelse frem for kortsigtede tilskud.',
        audioPlaysLimit: 2,
        prompt: 'Hvad forudsætter langsigtet vækst ifølge økonomerne?',
        options: [
          'Vedvarende investeringer i forskning og efteruddannelse',
          'Kun kortsigtede tilskud',
          'Besparelser på uddannelse',
          'Lukning af universiteter',
        ],
        correctIndex: 0,
        explanation: 'Economistas destacam investimentos contínuos em pesquisa e formação continuada.',
      },
      {
        id: 'pd3-4-q3',
        section: 'language_use',
        prompt: 'Formelt bindeord: "Budgettet var begrænset; ___ lykkedes det holdet at nå målet."',
        options: ['ikke desto mindre', 'derfor', 'nemlig', 'følgelig'],
        correctIndex: 0,
        explanation: '"ikke desto mindre" (não obstante / ainda assim) marca contraste formal C1.',
      },
      {
        id: 'pd3-4-q4',
        section: 'language_use',
        prompt: 'Fast akademisk udtryk: "Den nye lovgivning ___ i kraft den 1. januar."',
        options: ['træder', 'går', 'bliver', 'sætter'],
        correctIndex: 0,
        explanation: 'Colocação formal: "træde i kraft" (entrar em vigor).',
      },
    ],
    writingTask: {
      prompt:
        'Skriv en akademisk vurdering (ca. 140 ord) af, hvordan kunstig intelligens påvirker arbejdsmarkedet, og hvilken rolle efteruddannelse spiller.',
      minWords: 110,
      rubricCriteria: [
        'Registro acadêmico C1 (Studieprøven)',
        'Conectores formais (imidlertid, ikke desto mindre, følgelig)',
        'Argumentação estruturada e precisa',
      ],
      expectedKeywords: ['kunstig intelligens', 'arbejdsmarkedet', 'efteruddannelse', 'omstilling', 'følgelig'],
      modelAnswer:
        'Kunstig intelligens ændrer hastigt opgaver og kompetencekrav på det moderne arbejdsmarked. Mens rutineprægede funktioner i stigende grad automatiseres, opstår der nye roller inden for dataanalyse, kvalitetssikring og tværfaglig problemløsning. Ikke desto mindre stiller denne udvikling store krav til arbejdstagernes omstillingsparathed. Følgelig bør både virksomheder og uddannelsesinstitutioner prioritere målrettet efteruddannelse, så samfundet kan høste gevinsterne ved ny teknologi uden at skabe større ulighed.',
    },
  },
];

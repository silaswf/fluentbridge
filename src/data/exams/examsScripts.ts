/**
 * @file src/data/exams/examsScripts.ts
 * @description Banco de simulados oficiais cronometrados (Scripts).
 * @exports SCRIPTS_MOCK_EXAMS
 */
import type { MockExam } from '../../types/exams';

export const SCRIPTS_MOCK_EXAMS: MockExam[] = [
  // =========================================================================
  // TORFL / ТРКИ (ru) — 4 Simulations
  // =========================================================================
  {
    id: 'torfl-sim-1',
    examTypeId: 'torfl',
    languageCode: 'ru',
    simulationNumber: 1,
    title: 'ТРКИ / TORFL — Simulado 1: Город и транспорт',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'torfl-1-q1',
        section: 'reading',
        passageTitle: 'Московское метро как музей',
        passageText:
          'Московский метрополитен — это не только быстрый способ передвижения по огромному городу, но и настоящая архитектурная достопримечательность. Многие центральные станции украшены мрамором, мозаиками и бронзовыми скульптурами. Ежедневно метро перевозит миллионы пассажиров, поэтому в часы пик на пересадках бывает очень многолюдно.',
        prompt: 'Чем известны многие центральные станции московского метро?',
        options: [
          'Они работают только ночью.',
          'Они украшены мрамором, мозаиками и скульптурами.',
          'Там запрещено делать пересадки.',
          'Ими пользуются только туристы.',
        ],
        correctIndex: 1,
        explanation:
          'O texto afirma: "украшены мрамором, мозаиками и бронзовыми скульптурами" (decoradas com mármore, mosaicos e esculturas de bronze).',
      },
      {
        id: 'torfl-1-q2',
        section: 'reading',
        passageTitle: 'Московское метро как музей',
        passageText:
          'Московский метрополитен — это не только быстрый способ передвижения по огромному городу, но и настоящая архитектурная достопримечательность. Многие центральные станции украшены мрамором, мозаиками и бронзовыми скульптурами. Ежедневно метро перевозит миллионы пассажиров, поэтому в часы пик на пересадках бывает очень многолюдно.',
        prompt: 'Когда на пересадках особенно много людей?',
        options: [
          'В выходные утром',
          'Поздно вечером',
          'В часы пик',
          'Только зимой',
        ],
        correctIndex: 2,
        explanation:
          '"В часы пик на пересадках бывает очень многолюдно" (nos horários de pico há muita gente nas baldeações).',
      },
      {
        id: 'torfl-1-q3',
        section: 'listening',
        audioText:
          'Объявление на вокзале: Уважаемые пассажиры! Скорый поезд номер сорок два сообщением Москва — Санкт-Петербург отправляется с третьего пути через десять минут. Просим занять свои места.',
        audioPlaysLimit: 2,
        prompt: 'С какого пути отправляется поезд в Санкт-Петербург?',
        options: ['С первого пути', 'Со второго пути', 'С третьего пути', 'С десятого пути'],
        correctIndex: 2,
        explanation:
          'O anúncio diz: "отправляется с третьего пути" (parte da terceira plataforma).',
      },
      {
        id: 'torfl-1-q4',
        section: 'listening',
        audioText:
          'Анна: Максим, как ты добираешься на работу? Максим: Обычно я езжу на метро, это занимает двадцать минут. Но если погода хорошая, я предпочитаю идти пешком через парк.',
        audioPlaysLimit: 2,
        prompt: 'Когда Максим ходит на работу пешком?',
        options: [
          'Каждый день без исключения',
          'Когда на улице хорошая погода',
          'Только когда метро закрыто',
          'По пятницам вечером',
        ],
        correctIndex: 1,
        explanation:
          'Maxim diz: "если погода хорошая, я предпочитаю идти пешком" (se o tempo estiver bom, prefiro ir a pé).',
      },
      {
        id: 'torfl-1-q5',
        section: 'language_use',
        prompt: 'Выберите правильный падеж: "Вчера я долго гулял по ___."',
        options: ['центр города', 'центру города', 'центре города', 'центром города'],
        correctIndex: 1,
        explanation:
          'A preposição "по" indicando movimento por uma superfície/local exige dativo: "по центру".',
      },
      {
        id: 'torfl-1-q6',
        section: 'language_use',
        prompt: 'Какой глагол движения подходит? "Завтра мы ___ в Казань на поезде."',
        options: ['идём', 'едем', 'ходим', 'носим'],
        correctIndex: 1,
        explanation:
          'Para viagem unidirecional em transporte (de trem), usa-se "едем".',
      },
    ],
    writingTask: {
      prompt:
        'Напишите короткое письмо другу (около 70 слов). Расскажите, как вы обычно проводите выходные в вашем городе и какое место вы советуете ему посетить.',
      minWords: 55,
      rubricCriteria: [
        'Saudação e encerramento adequados em russo',
        'Uso correto de casos (prepositivo para localização, acusativo para direção)',
        'Recomendação clara de um local na cidade',
      ],
      expectedKeywords: ['выходные', 'город', 'парк', 'советую', 'вместе'],
      modelAnswer:
        'Привет, Сергей! Как у тебя дела? В прошлые выходные я много гулял по центру нашего города. Обычно в субботу утром я хожу в уютное кафе рядом с парком, а потом встречаюсь с друзьями. Если ты приедешь ко мне в гости, я очень советую посетить наш исторический музей и набережную. Там очень красиво вечером! Пиши, когда у тебя будет отпуск. Пока, Алексей',
    },
  },
  {
    id: 'torfl-sim-2',
    examTypeId: 'torfl',
    languageCode: 'ru',
    simulationNumber: 2,
    title: 'ТРКИ / TORFL — Simulado 2: Учёба и работа',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'torfl-2-q1',
        section: 'reading',
        passageTitle: 'Курсы иностранных языков онлайн',
        passageText:
          'Всё больше студентов выбирают дистанционное обучение иностранным языкам. Главный плюс такого формата — экономия времени на дорогу и возможность заниматься с преподавателем из любой точки мира. Однако для успешного результата важна регулярная практика и самодисциплина.',
        prompt: 'Что автор текста считает главным преимуществом онлайн-курсов?',
        options: [
          'Отсутствие домашних заданий',
          'Экономию времени на дорогу и гибкость места занятий',
          'Бесплатные учебники для всех',
          'Меньшее количество экзаменов',
        ],
        correctIndex: 1,
        explanation:
          'O texto cita "экономия времени на дорогу и возможность заниматься ... из любой точки мира".',
      },
      {
        id: 'torfl-2-q2',
        section: 'reading',
        passageTitle: 'Курсы иностранных языков онлайн',
        passageText:
          'Всё больше студентов выбирают дистанционное обучение иностранным языкам. Главный плюс такого формата — экономия времени на дорогу и возможность заниматься с преподавателем из любой точки мира. Однако для успешного результата важна регулярная практика и самодисциплина.',
        prompt: 'Что необходимо для хорошего результата при онлайн-обучении?',
        options: [
          'Покупать новый компьютер каждый год',
          'Регулярная практика и самодисциплина',
          'Заниматься только раз в месяц',
          'Изучать три языка одновременно',
        ],
        correctIndex: 1,
        explanation:
          '"Важна регулярная практика и самодисциплина" (prática regular e autodisciplina).',
      },
      {
        id: 'torfl-2-q3',
        section: 'listening',
        audioText:
          'Преподаватель: Ребята, в пятницу контрольная работа по грамматике переносится с десяти утра на час дня, так как наша аудитория будет занята конференцией.',
        audioPlaysLimit: 2,
        prompt: 'Во сколько начнётся контрольная работа в пятницу?',
        options: ['В 10:00', 'В 11:00', 'В 13:00', 'В 15:00'],
        correctIndex: 2,
        explanation:
          'A prova foi transferida das 10h para a 1 da tarde ("на час дня" = 13:00).',
      },
      {
        id: 'torfl-2-q4',
        section: 'listening',
        audioText:
          'Коллега: Оля, ты не знаешь, где лежит папка с договорами? Оля: Она была у директора, но десять минут назад он отнёс её в бухгалтерию.',
        audioPlaysLimit: 2,
        prompt: 'Где сейчас находится папка с договорами?',
        options: [
          'У Оли на столе',
          'В кабинете директора',
          'В бухгалтерии',
          'В архиве',
        ],
        correctIndex: 2,
        explanation:
          'O diretor levou a pasta para a contabilidade ("отнёс её в бухгалтерию").',
      },
      {
        id: 'torfl-2-q5',
        section: 'language_use',
        prompt: 'Выберите совершенный вид глагола (НСВ/СВ): "Наконец-то он ___ этот трудный текст до конца."',
        options: ['читал', 'прочитал', 'читает', 'будет читать'],
        correctIndex: 1,
        explanation:
          '"Наконец-то" e "до конца" indicam ação concluída, exigindo o aspecto perfectivo: "прочитал".',
      },
      {
        id: 'torfl-2-q6',
        section: 'language_use',
        prompt: 'Какой союз нужен в предложении? "Я учу русский язык, ___ читать литературу в оригинале."',
        options: ['потому что', 'чтобы', 'хотя', 'если'],
        correctIndex: 1,
        explanation:
          '"Чтобы" + infinitivo expressa finalidade ("para ler literatura no original").',
      },
    ],
    writingTask: {
      prompt:
        'Напишите небольшое сообщение (около 75 слов) о вашей профессии или учёбе. Объясните, почему вы выбрали это направление и какие планы у вас на будущее.',
      minWords: 60,
      rubricCriteria: [
        'Explicação clara da escolha profissional ou acadêmica',
        'Uso correto de aspectos verbais e conectores causais',
        'Planos futuros expressos com clareza',
      ],
      expectedKeywords: ['профессия', 'изучать', 'опыт', 'планы', 'будущее'],
      modelAnswer:
        'Меня зовут Мария, и я работаю программистом уже три года. Я выбрала эту профессию, потому что мне всегда нравилось решать сложные логические задачи и создавать полезные приложения. Сейчас я также изучаю русский язык, чтобы общаться с международными коллегами. В будущем я хочу руководить собственной командой разработчиков и участвовать в крупных образовательных проектах.',
    },
  },
  {
    id: 'torfl-sim-3',
    examTypeId: 'torfl',
    languageCode: 'ru',
    simulationNumber: 3,
    title: 'ТРКИ / TORFL — Simulado 3: Культура и чтение',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'torfl-3-q1',
        section: 'reading',
        passageTitle: 'Современные библиотеки',
        passageText:
          'Сегодня городские библиотеки превращаются в открытые культурные пространства. Помимо выдачи книг, там проводят лекции, кинопоказы и языковые клубы. Благодаря бесплатному доступу к интернету и тихим зонам для работы многие фрилансеры приходят туда с ноутбуками.',
        prompt: 'Кто часто использует современные библиотеки как рабочее место?',
        options: [
          'Только школьники младших классов',
          'Фрилансеры с ноутбуками',
          'Учителя физкультуры',
          'Водители автобусов',
        ],
        correctIndex: 1,
        explanation:
          '"Многие фрилансеры приходят туда с ноутбуками" (muitos freelancers vão lá com notebooks).',
      },
      {
        id: 'torfl-3-q2',
        section: 'reading',
        passageTitle: 'Современные библиотеки',
        passageText:
          'Сегодня городские библиотеки превращаются в открытые культурные пространства. Помимо выдачи книг, там проводят лекции, кинопоказы и языковые клубы. Благодаря бесплатному доступу к интернету и тихим зонам для работы многие фрилансеры приходят туда с ноутбуками.',
        prompt: 'Какие мероприятия проходят в библиотеках помимо выдачи книг?',
        options: [
          'Спортивные соревнования',
          'Лекции, кинопоказы и языковые клубы',
          'Ярмарки автомобилей',
          'Уроки кулинарии',
        ],
        correctIndex: 1,
        explanation:
          'O texto menciona palestras, exibições de filmes e clubes de idiomas.',
      },
      {
        id: 'torfl-3-q3',
        section: 'listening',
        audioText:
          'Кассир в театре: На сегодняшний спектакль все билеты в партер уже проданы, но остались два места на балконе по тысяче рублей. Начало ровно в семь вечера.',
        audioPlaysLimit: 2,
        prompt: 'Какие билеты ещё можно купить на сегодняшний спектакль?',
        options: [
          'В партер',
          'Два места на балконе',
          'Стоячие места',
          'Билеты на завтра',
        ],
        correctIndex: 1,
        explanation:
          'Restam apenas dois lugares no balcão ("остались два места на балконе").',
      },
      {
        id: 'torfl-3-q4',
        section: 'listening',
        audioText:
          'Ведущий подкаста: Сегодня мы говорим о том, как сохранить привычку читать в эпоху коротких видео. Наш гость советует оставлять телефон в другой комнате за час до сна и брать в руки бумажную книгу.',
        audioPlaysLimit: 2,
        prompt: 'Что советует гость подкаста?',
        options: [
          'Читать новости в телефоне перед сном',
          'Оставлять телефон в другой комнате за час до сна и читать бумажную книгу',
          'Смотреть только длинные фильмы',
          'Покупать аудиокниги для утренней пробежки',
        ],
        correctIndex: 1,
        explanation:
          'O convidado recomenda deixar o celular em outro cômodo uma hora antes de dormir e ler um livro físico.',
      },
      {
        id: 'torfl-3-q5',
        section: 'language_use',
        prompt: 'Выберите правильное слово: "Несмотря ___ плохую погоду, мы поехали на экскурсию."',
        options: ['на', 'за', 'о', 'к'],
        correctIndex: 0,
        explanation:
          'A preposição composta é sempre "несмотря на" + acusativo.',
      },
      {
        id: 'torfl-3-q6',
        section: 'language_use',
        prompt: 'Выберите правильную форму: "Это тот самый фильм, о ___ мы вчера спорили."',
        options: ['который', 'котором', 'которого', 'которому'],
        correctIndex: 1,
        explanation:
          'Após "о" (sobre), o pronome relativo masculino singular vai para o prepositivo: "о котором".',
      },
    ],
    writingTask: {
      prompt:
        'Напишите отзыв на книгу или фильм, который вам понравился (около 80 слов). Опишите сюжет кратко и объясните, кому стоит его посмотреть или прочитать.',
      minWords: 65,
      rubricCriteria: [
        'Resumo conciso sem revelar tudo',
        'Vocabulário avaliativo variado',
        'Concordância nominal e verbal correta',
      ],
      expectedKeywords: ['сюжет', 'главный герой', 'впечатление', 'рекомендую', 'интересный'],
      modelAnswer:
        'Недавно я посмотрел замечательный фильм о жизни молодых музыкантов в большом городе. Сюжет рассказывает о том, как главный герой преодолевает трудности и не сдаётся на пути к своей мечте. Мне особенно понравились прекрасная музыка и искренняя игра актёров. Этот фильм оставляет очень тёплое впечатление и заставляет задуматься о ценности дружбы. Я рекомендую посмотреть его всем, кто любит вдохновляющие истории.',
    },
  },
  {
    id: 'torfl-sim-4',
    examTypeId: 'torfl',
    languageCode: 'ru',
    simulationNumber: 4,
    title: 'ТРКИ / TORFL — Simulado 4: Экология и общество',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'torfl-4-q1',
        section: 'reading',
        passageTitle: 'Зелёные зоны в мегаполисах',
        passageText:
          'Исследования показывают, что городские парки и скверы не только снижают температуру воздуха летом, но и положительно влияют на психическое здоровье жителей. Даже двадцатиминутная прогулка среди деревьев помогает уменьшить уровень стресса после рабочего дня.',
        prompt: 'Как городские парки влияют на жителей согласно исследованиям?',
        options: [
          'Увеличивают шум в центре',
          'Снижают температуру летом и уменьшают стресс',
          'Заменяют спортивные залы',
          'Работают только по выходным',
        ],
        correctIndex: 1,
        explanation:
          'Eles reduzem a temperatura no verão ("снижают температуру воздуха летом") e diminuem o nível de estresse.',
      },
      {
        id: 'torfl-4-q2',
        section: 'reading',
        passageTitle: 'Зелёные зоны в мегаполисах',
        passageText:
          'Исследования показывают, что городские парки и скверы не только снижают температуру воздуха летом, но и положительно влияют на психическое здоровье жителей. Даже двадцатиминутная прогулка среди деревьев помогает уменьшить уровень стресса после рабочего дня.',
        prompt: 'Сколько времени, по тексту, достаточно для прогулки, чтобы снизить стресс?',
        options: ['Два часа', 'Двадцать минут', 'Пять минут', 'Целый день'],
        correctIndex: 1,
        explanation:
          '"Двадцатиминутная прогулка" (uma caminhada de vinte minutos).',
      },
      {
        id: 'torfl-4-q3',
        section: 'listening',
        audioText:
          'Волонтёр: В эту субботу в девять утра мы собираемся у главного входа в ботанический сад, чтобы посадить новые деревья. Перчатки и лопаты мы выдадим на месте, возьмите только удобную обувь.',
        audioPlaysLimit: 2,
        prompt: 'Что нужно принести участникам акции?',
        options: [
          'Лопату и саженцы',
          'Перчатки',
          'Удобную обувь',
          'Собственные инструменты',
        ],
        correctIndex: 2,
        explanation:
          'Luvas e pás serão fornecidas; os participantes devem apenas usar calçados confortáveis ("удобную обувь").',
      },
      {
        id: 'torfl-4-q4',
        section: 'listening',
        audioText:
          'Прогноз погоды: Завтра в регионе ожидается переменная облачность, без существенных осадков. Днём температура поднимется до плюс восемнадцати градусов, ветер умеренный.',
        audioPlaysLimit: 2,
        prompt: 'Какая погода ожидается завтра?',
        options: [
          'Сильный дождь и мороз',
          'Переменная облачность, без существенных осадков, около +18',
          'Гроза и сильный ветер',
          'Снегопад',
        ],
        correctIndex: 1,
        explanation:
          'Nuvens variáveis, sem precipitação significativa e +18 graus durante o dia.',
      },
      {
        id: 'torfl-4-q5',
        section: 'language_use',
        prompt: 'Выберите правильный вариант: "Если бы у меня ___ больше свободного времени, я бы занимался волонтёрством."',
        options: ['есть', 'было', 'будет', 'бывает'],
        correctIndex: 1,
        explanation:
          'A oração condicional irreal usa "если бы" + verbo no passado: "было".',
      },
      {
        id: 'torfl-4-q6',
        section: 'language_use',
        prompt: 'Какой предлог нужен? "Мы должны заботиться ___ окружающей среде."',
        options: ['об', 'на', 'от', 'для'],
        correctIndex: 0,
        explanation:
          '"Заботиться о / об" + prepositivo significa "cuidar de".',
      },
    ],
    writingTask: {
      prompt:
        'Выскажите своё мнение (около 80 слов): что каждый человек может делать в повседневной жизни для защиты природы? Приведите три простых примера.',
      minWords: 65,
      rubricCriteria: [
        'Três ações práticas bem articuladas',
        'Uso de verbos modais/imperativos ou infinitivos apropriados',
        'Coesão clara (во-первых, во-вторых, наконец)',
      ],
      expectedKeywords: ['природа', 'мусор', 'вода', 'энергия', 'привычки'],
      modelAnswer:
        'Каждый человек может внести свой вклад в защиту окружающей среды с помощью простых ежедневных привычек. Во-первых, стоит сортировать мусор и использовать многоразовую сумку вместо пластиковых пакетов. Во-вторых, важно экономить воду и выключать свет, когда выходите из комнаты. Наконец, на короткие расстояния лучше ходить пешком или ездить на велосипеде вместо машины. Если так поступит каждый, наши города станут намного чище.',
    },
  },

  // =========================================================================
  // JLPT (ja) — 4 Simulations
  // =========================================================================
  {
    id: 'jlpt-sim-1',
    examTypeId: 'jlpt',
    languageCode: 'ja',
    simulationNumber: 1,
    title: 'JLPT N4/N3 — Simulado 1: 日常生活と交通',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'jlpt-1-q1',
        section: 'reading',
        passageTitle: '図書館の利用案内',
        passageText:
          '市立図書館は火曜日から日曜日まで、午前九時から午後八時まで開いています。月曜日は休みです。本は一人十冊まで、二週間借りることができます。返却期限を過ぎないように気をつけてください。',
        prompt: 'この図書館はいつ休みですか。',
        options: ['日曜日', '月曜日', '火曜日', '土曜日'],
        correctIndex: 1,
        explanation:
          'O texto diz claramente: 「月曜日は休みです。」 (Fecha às segundas-feiras).',
      },
      {
        id: 'jlpt-1-q2',
        section: 'reading',
        passageTitle: '図書館の利用案内',
        passageText:
          '市立図書館は火曜日から日曜日まで、午前九時から午後八時まで開いています。月曜日は休みです。本は一人十冊まで、二週間借りることができます。返却期限を過ぎないように気をつけてください。',
        prompt: '本は何冊まで借りられますか。',
        options: ['二冊まで', '五冊まで', '十冊まで', '制限はありません'],
        correctIndex: 2,
        explanation:
          '「本は一人十冊まで、二週間借りることができます。」 (Até 10 livros por pessoa, por duas semanas).',
      },
      {
        id: 'jlpt-1-q3',
        section: 'listening',
        audioText:
          '駅員のアナウンス：まもなく二番線に東京行きの急行電車がまいります。この電車は途中の駅には止まりませんのでご注意ください。',
        audioPlaysLimit: 2,
        prompt: '二番線に来る電車について正しいのはどれですか。',
        options: [
          '各駅に止まります。',
          '東京行きで、途中の駅には止まりません。',
          '一番線から出発します。',
          '今日は運休です。',
        ],
        correctIndex: 1,
        explanation:
          'É um trem expresso para Tóquio na plataforma 2 e não para nas estações intermediárias (「途中の駅には止まりません」).',
      },
      {
        id: 'jlpt-1-q4',
        section: 'listening',
        audioText:
          '女の人：すみません、この近くに郵便局はありますか。男の人：はい、この道をまっすぐ行って、二つ目の信号を右に曲がると、左側にありますよ。',
        audioPlaysLimit: 2,
        prompt: '郵便局はどこにありますか。',
        options: [
          '一つ目の信号を左に曲がったところ',
          '二つ目の信号を右に曲がった左側',
          '駅の反対側',
          '信号のすぐ手前',
        ],
        correctIndex: 1,
        explanation:
          'Siga reto, vire à direita no segundo semáforo (二つ目の信号を右) e estará do lado esquerdo (左側).',
      },
      {
        id: 'jlpt-1-q5',
        section: 'language_use',
        prompt: '（　）に入る正しい言葉を選びなさい。「雨が降って（　）、試合は中止になりました。」',
        options: ['いるので', 'いるのに', 'いるからといって', 'いるうちに'],
        correctIndex: 0,
        explanation:
          '「〜ので」 expressa causa objetiva ("Como está chovendo, o jogo foi cancelado").',
      },
      {
        id: 'jlpt-1-q6',
        section: 'language_use',
        prompt: '正しい敬語を選びなさい。「先生はもうお帰り（　）。」',
        options: ['しました', 'になりました', 'いただきました', 'あげました'],
        correctIndex: 1,
        explanation:
          'A forma honorífica (sonkeigo) para a ação do professor voltar é 「お＋V(masu-stem)＋になる」 → お帰りになりました.',
      },
    ],
    writingTask: {
      prompt:
        '日本の友達にメールを書きましょう（120〜180字程度）。今週末、一緒に映画を見に行きたいです。見たい映画と、会う時間・場所を提案してください。',
      minWords: 30,
      rubricCriteria: [
        'Convite polido e claro em japonês (〜ませんか / 〜ましょう)',
        'Definição de horário e local de encontro',
        'Uso adequado de partículas (に, で, を)',
      ],
      expectedKeywords: ['週末', '映画', '時間', '駅', 'ませんか'],
      modelAnswer:
        '健太さん、こんにちは。今週末、時間がありますか。新しい日本のアニメ映画が話題になっているので、土曜日か日曜日に一緒に見に行きませんか。もしよければ、土曜日の午後二時に新宿駅の東口で会いませんか。映画の後でカフェでお茶もしましょう。返事を待っています。',
    },
  },
  {
    id: 'jlpt-sim-2',
    examTypeId: 'jlpt',
    languageCode: 'ja',
    simulationNumber: 2,
    title: 'JLPT N3 — Simulado 2: 仕事とマナー',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'jlpt-2-q1',
        section: 'reading',
        passageTitle: 'メールの返信マナー',
        passageText:
          '日本のビジネスでは、取引先や上司からメールを受け取ったら、できるだけ二十四時間以内に返信するのがマナーとされています。すぐに詳しい答えが書けない場合でも、「確認して後ほどご連絡いたします」と一度伝えることが大切です。',
        prompt: 'すぐに詳しい返事ができないとき、どうするのがよいですか。',
        options: [
          '答えがわかるまで数日待つ',
          '「確認して後ほど連絡する」と一度返信する',
          '電話だけで済ませる',
          '他の人に転送して任せる',
        ],
        correctIndex: 1,
        explanation:
          'É importante responder informando que irá verificar e entrar em contato depois (「確認して後ほどご連絡いたします」).',
      },
      {
        id: 'jlpt-2-q2',
        section: 'reading',
        passageTitle: 'メールの返信マナー',
        passageText:
          '日本のビジネスでは、取引先や上司からメールを受け取ったら、できるだけ二十四時間以内に返信するのがマナーとされています。すぐに詳しい答えが書けない場合でも、「確認して後ほどご連絡いたします」と一度伝えることが大切です。',
        prompt: 'メールは原則としてどのくらい以内に返信すべきですか。',
        options: ['一時間以内', '二十四時間以内', '三日以内', '一週間以内'],
        correctIndex: 1,
        explanation:
          '「二十四時間以内に返信する」 (responder dentro de 24 horas).',
      },
      {
        id: 'jlpt-2-q3',
        section: 'listening',
        audioText:
          '部下：部長、来週の会議の資料ですが、データの修正が終わりましたので机の上に置いておきました。部長：ありがとう。午後に目を通しておくよ。',
        audioPlaysLimit: 2,
        prompt: '部下は資料をどこに置きましたか。',
        options: [
          '会議室の中',
          '部長の机の上',
          'コピー機の横',
          'メールで送った',
        ],
        correctIndex: 1,
        explanation:
          'O subordinado colocou os materiais sobre a mesa do chefe (「机の上に置いておきました」).',
      },
      {
        id: 'jlpt-2-q4',
        section: 'listening',
        audioText:
          '店員：いらっしゃいませ。お弁当を温めますか。客：はい、お願いします。あと、お箸を一膳ください。',
        audioPlaysLimit: 2,
        prompt: 'お客さんは店員に何をお願いしましたか。',
        options: [
          'お弁当を温めて、お箸をもらうこと',
          '冷たい飲み物を追加すること',
          '袋を二枚もらうこと',
          'お釣りを細かくすること',
        ],
        correctIndex: 0,
        explanation:
          'O cliente pediu para aquecer o bentô e pediu um par de hashi.',
      },
      {
        id: 'jlpt-2-q5',
        section: 'language_use',
        prompt: '（　）に入る最もよいものを選びなさい。「会議の前に資料をコピーして（　）。」',
        options: ['おきます', 'みます', 'しまいます', 'きます'],
        correctIndex: 0,
        explanation:
          '「〜ておく」 indica preparação antecipada para algo futuro (fazer cópias antes da reunião).',
      },
      {
        id: 'jlpt-2-q6',
        section: 'language_use',
        prompt: '正しい受け身（受身形）を選びなさい。「電車の中で知らない人に足を（　）。」',
        options: ['踏みました', '踏まれました', '踏ませました', '踏んでいました'],
        correctIndex: 1,
        explanation:
          'Voz passiva de adversidade ("ter o pé pisado por alguém"): 「踏まれました」.',
      },
    ],
    writingTask: {
      prompt:
        'アルバイト先（または会社）の店長に遅刻の連絡メールを書きましょう（120〜180字程度）。電車が遅れている理由と、到着予定時刻を伝えてください。',
      minWords: 30,
      rubricCriteria: [
        'Pedido de desculpas educado (申し訳ございません)',
        'Motivo claro do atraso e horário estimado de chegada',
        'Estilo polido (です・ます)',
      ],
      expectedKeywords: ['遅刻', '電車', '申し訳', '到着', '予定'],
      modelAnswer:
        '佐藤店長、お疲れ様です。アルバイトの田中です。申し訳ございませんが、今朝乗っている電車が信号トラブルで止まっており、十五分ほど遅刻しそうです。現在、次の駅に向かっていますので、十時十五分ごろにはお店に到着できる予定です。ご迷惑をおかけして大変申し訳ありません。よろしくお願いいたします。',
    },
  },
  {
    id: 'jlpt-sim-3',
    examTypeId: 'jlpt',
    languageCode: 'ja',
    simulationNumber: 3,
    title: 'JLPT N3/N2 — Simulado 3: 環境と暮らし',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'jlpt-3-q1',
        section: 'reading',
        passageTitle: 'マイバッグの普及',
        passageText:
          'レジ袋が有料化されてから、買い物にマイバッグを持参する人が大幅に増えた。最初は忘れる人も多かったが、今では小さく折りたためるバッグをいつもかばんに入れている人が少なくない。プラスチックごみを減らすための小さな習慣が社会に定着しつつある。',
        prompt: '「少なくない」とはどのような意味ですか。',
        options: ['ほとんどいない', 'かなり多い', '全くいない', '減っている'],
        correctIndex: 1,
        explanation:
          '「少なくない」 é uma dupla negação que significa "não são poucos", ou seja, há bastante gente.',
      },
      {
        id: 'jlpt-3-q2',
        section: 'reading',
        passageTitle: 'マイバッグの普及',
        passageText:
          'レジ袋が有料化されてから、買い物にマイバッグを持参する人が大幅に増えた。最初は忘れる人も多かったが、今では小さく折りたためるバッグをいつもかばんに入れている人が少なくない。プラスチックごみを減らすための小さな習慣が社会に定着しつつある。',
        prompt: 'マイバッグを持つ人が増えたきっかけは何ですか。',
        options: [
          'スーパーがバッグを無料で配ったから',
          'レジ袋が有料化されたから',
          'プラスチックが禁止されたから',
          'かばんが大きくなったから',
        ],
        correctIndex: 1,
        explanation:
          '「レジ袋が有料化されてから」 (desde que as sacolas plásticas passaram a ser cobradas).',
      },
      {
        id: 'jlpt-3-q3',
        section: 'listening',
        audioText:
          '天気予報：明日の朝は冷え込みますが、昼間はよく晴れて気温が二十度まで上がる見込みです。朝晩と昼間の気温差が大きいので、服装に気をつけてお出かけください。',
        audioPlaysLimit: 2,
        prompt: '天気予報の人は何に気をつけるよう言っていますか。',
        options: [
          '傘を忘れないこと',
          '気温差が大きいので服装に気をつけること',
          '強い風に注意すること',
          '夜まで外出しないこと',
        ],
        correctIndex: 1,
        explanation:
          'Como a amplitude térmica entre manhã/noite e dia é grande, recomenda atenção às roupas (「服装に気をつけて」).',
      },
      {
        id: 'jlpt-3-q4',
        section: 'listening',
        audioText:
          'アナウンス：本日、市役所の一階ロビーにて、外国人のための無料生活相談会を行っています。ビザや税金について質問がある方は、午後四時までにお越しください。',
        audioPlaysLimit: 2,
        prompt: '相談会は何時まで行われていますか。',
        options: ['午後二時まで', '午後三時まで', '午後四時まで', '午後五時まで'],
        correctIndex: 2,
        explanation:
          '「午後四時までにお越しください」 (Compareça até as 16:00).',
      },
      {
        id: 'jlpt-3-q5',
        section: 'language_use',
        prompt: '（　）に入る言葉を選びなさい。「日本語が上手に（　）、毎日ニュースを聞いています。」',
        options: ['なるために', 'なるように', 'なるところで', 'なるばかりで'],
        correctIndex: 1,
        explanation:
          'Com verbos de estado/potencial sem controle direto (なる), usa-se 「〜ように」 para finalidade ("para que eu fique bom em japonês").',
      },
      {
        id: 'jlpt-3-q6',
        section: 'language_use',
        prompt: '正しい接続詞を選びなさい。「このレストランは料理がおいしい。（　）、値段も手頃だ。」',
        options: ['しかし', 'しかも', 'ところが', 'すると'],
        correctIndex: 1,
        explanation:
          '「しかも」 significa "além disso / e ainda por cima", somando outra qualidade positiva.',
      },
    ],
    writingTask: {
      prompt:
        '「ごみを減らすためにできること」というテーマで短い意見文を書いてください（150字程度）。具体的な行動を二つ挙げて説明しましょう。',
      minWords: 40,
      rubricCriteria: [
        'Apresentação de duas ações concretas para reduzir lixo',
        'Uso de conectores (まず、また、そのため)',
        'Estilo escrito consistente (だ・である ou です・ます)',
      ],
      expectedKeywords: ['ごみ', 'マイバッグ', 'リサイクル', '環境', '大切'],
      modelAnswer:
        'ごみを減らすために、私たちが毎日できることはたくさんあります。まず、買い物をするときはマイバッグや水筒を持ち歩き、プラスチック製品をできるだけ使わないことが大切です。また、まだ使える服や本を捨てずに、リサイクルショップに売ったり友達にあげたりする方法もあります。一人一人の小さな工夫が、きれいな環境を守ることにつながります。',
    },
  },
  {
    id: 'jlpt-sim-4',
    examTypeId: 'jlpt',
    languageCode: 'ja',
    simulationNumber: 4,
    title: 'JLPT N2 — Simulado 4: 社会とテクノロジー',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'jlpt-4-q1',
        section: 'reading',
        passageTitle: 'キャッシュレス決済の広がり',
        passageText:
          '近年、現金を使わずにスマートフォンやカードで支払うキャッシュレス決済が急速に広がっている。会計が速く済むという利点がある一方、使いすぎに気づきにくいという声もある。また、災害による停電時には現金が必要になるため、両方を持っておくのが安心だと言われている。',
        prompt: 'なぜ現金も持っておいたほうがよいと述べられていますか。',
        options: [
          'カードのほうが手数料が高いから',
          '停電などの災害時に使えなくなることがあるから',
          'スマートフォンは重いから',
          'ポイントが貯まらないから',
        ],
        correctIndex: 1,
        explanation:
          'Em caso de queda de energia por desastre natural (「災害による停電時」), o dinheiro em espécie é necessário.',
      },
      {
        id: 'jlpt-4-q2',
        section: 'reading',
        passageTitle: 'キャッシュレス決済の広がり',
        passageText:
          '近年、現金を使わずにスマートフォンやカードで支払うキャッシュレス決済が急速に広がっている。会計が速く済むという利点がある一方、使いすぎに気づきにくいという声もある。また、災害による停電時には現金が必要になるため、両方を持っておくのが安心だと言われている。',
        prompt: 'キャッシュレス決済の欠点として挙げられているのはどれですか。',
        options: [
          '支払いに時間がかかること',
          'お金を使いすぎていることに気づきにくいこと',
          '使える店が全くないこと',
          '子どもしか使えないこと',
        ],
        correctIndex: 1,
        explanation:
          '「使いすぎに気づきにくい」 (é difícil perceber quando se gasta demais).',
      },
      {
        id: 'jlpt-4-q3',
        section: 'listening',
        audioText:
          '司会者：田中さん、最近翻訳アプリがとても正確になりましたが、外国語を学ぶ意味はまだあると思いますか。田中さん：もちろんです。相手の文化や気持ちの微妙なニュアンスを理解するには、やはり自分の言葉で話すことが一番ですから。',
        audioPlaysLimit: 2,
        prompt: '田中さんはなぜ外国語を学ぶ意味があると言っていますか。',
        options: [
          '翻訳アプリは有料だから',
          '文化や気持ちの微妙なニュアンスを理解できるから',
          'アプリは発音ができないから',
          '試験に合格するためだけだから',
        ],
        correctIndex: 1,
        explanation:
          'Para compreender nuances sutis da cultura e dos sentimentos da outra pessoa (「文化や気持ちの微妙なニュアンス」).',
      },
      {
        id: 'jlpt-4-q4',
        section: 'listening',
        audioText:
          '係員：美術館の写真撮影についてご案内します。ロビーでの撮影は自由ですが、展示室の中ではフラッシュを使っても使わなくても撮影は禁止となっております。',
        audioPlaysLimit: 2,
        prompt: '展示室の中で写真を撮ることはできますか。',
        options: [
          'フラッシュを使わなければできる',
          '一切できない',
          '自分の絵の前だけできる',
          '午前中だけできる',
        ],
        correctIndex: 1,
        explanation:
          'Dentro da sala de exposições é proibido fotografar com ou sem flash (「フラッシュを使っても使わなくても撮影は禁止」).',
      },
      {
        id: 'jlpt-4-q5',
        section: 'language_use',
        prompt: '（　）に入る文型を選びなさい。「この小説は何度（　）、新しい発見がある。」',
        options: ['読んでも', '読むなら', '読んだら', '読むと'],
        correctIndex: 0,
        explanation:
          '「何度〜ても」 significa "não importa quantas vezes faça, sempre...".',
      },
      {
        id: 'jlpt-4-q6',
        section: 'language_use',
        prompt: '意味が近いものを選びなさい。「彼の説明は分かりやすかった。」',
        options: [
          '理解しやすかった',
          '難しそうだった',
          '短すぎた',
          '退屈だった',
        ],
        correctIndex: 0,
        explanation:
          '「分かりやすい」 (fácil de entender) equivale a 「理解しやすい」.',
      },
    ],
    writingTask: {
      prompt:
        'AIや翻訳アプリが発達した時代における外国語学習の価値について、あなたの考えを160字程度で述べてください。',
      minWords: 45,
      rubricCriteria: [
        'Posicionamento claro sobre o valor de aprender idiomas hoje',
        'Argumento cultural ou comunicativo bem construído',
        'Uso natural de conectores de nível B2',
      ],
      expectedKeywords: ['翻訳', '外国語', 'コミュニケーション', '文化', '大切'],
      modelAnswer:
        '翻訳アプリがどれだけ便利になっても、外国語を学ぶ価値は変わらないと思います。言葉は単なる情報の道具ではなく、その国の文化や考え方を映す鏡だからです。相手と同じ言葉で直接会話ができれば、より深い信頼関係を築くことができます。これからも自分の力で言葉を学び続けたいです。',
    },
  },

  // =========================================================================
  // HSK (zh) — 4 Simulations
  // =========================================================================
  {
    id: 'hsk-sim-1',
    examTypeId: 'hsk',
    languageCode: 'zh',
    simulationNumber: 1,
    title: 'HSK 4 — Simulado 1: 日常生活与旅行',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'hsk-1-q1',
        section: 'reading',
        passageTitle: '坐高铁去旅游',
        passageText:
          '现在坐高铁去别的城市旅游非常方便。不仅速度快，而且车站里的指示牌很清楚，买票和进站都可以用手机完成。很多人喜欢周末坐两个小时的高铁，去附近的城市吃美食、看风景。',
        prompt: '现在人们怎么买高铁票和进站？',
        options: [
          '必须提前三天去窗口排队',
          '可以用手机完成',
          '只能用现金购买',
          '需要打电话预订',
        ],
        correctIndex: 1,
        explanation:
          'O texto diz: "买票和进站都可以用手机完成" (comprar passagem e entrar na estação podem ser feitos pelo celular).',
      },
      {
        id: 'hsk-1-q2',
        section: 'reading',
        passageTitle: '坐高铁去旅游',
        passageText:
          '现在坐高铁去别的城市旅游非常方便。不仅速度快，而且车站里的指示牌很清楚，买票和进站都可以用手机完成。很多人喜欢周末坐两个小时的高铁，去附近的城市吃美食、看风景。',
        prompt: '很多人周末坐高铁去附近城市做什么？',
        options: [
          '开会和学习',
          '吃美食、看风景',
          '买新电脑',
          '看朋友生病',
        ],
        correctIndex: 1,
        explanation:
          '"去附近的城市吃美食、看风景" (provar comida gostosa e ver paisagens).',
      },
      {
        id: 'hsk-1-q3',
        section: 'listening',
        audioText:
          '女：请问，去火车站是坐这路公共汽车吗？男：不是，这趟车去动物园。你要到马路对面坐十二路车，大概二十分钟就到了。',
        audioPlaysLimit: 2,
        prompt: '女的应该怎么去火车站？',
        options: [
          '坐现在这辆车',
          '到马路对面坐十二路公共汽车',
          '走路二十分钟',
          '打出租车去动物园',
        ],
        correctIndex: 1,
        explanation:
          'Ela precisa atravessar a rua e pegar o ônibus linha 12 ("到马路对面坐十二路车").',
      },
      {
        id: 'hsk-1-q4',
        section: 'listening',
        audioText:
          '男：小王，明天的会议改在三楼会议室了，时间还是上午九点半，别忘了带笔记本。女：好的，谢谢提醒，我这就记下来。',
        audioPlaysLimit: 2,
        prompt: '明天的会议有什么变化？',
        options: [
          '时间改到下午了',
          '地点改在三楼会议室了',
          '会议取消了',
          '不需要带笔记本了',
        ],
        correctIndex: 1,
        explanation:
          'O horário continua 9:30, mas o local mudou para a sala de reuniões do 3º andar ("改在三楼会议室了").',
      },
      {
        id: 'hsk-1-q5',
        section: 'language_use',
        prompt: '选择正确的词语填空：“虽然今天下着大雨，（　）他还是按时来上课了。”',
        options: ['所以', '但是', '因为', '而且'],
        correctIndex: 1,
        explanation:
          'A estrutura concessiva padrão é "虽然……但是……" (Embora..., mas...).',
      },
      {
        id: 'hsk-1-q6',
        section: 'language_use',
        prompt: '哪个句子语法正确？',
        options: [
          '我把作业做完了。',
          '我把作业做了在桌子上。',
          '我做完把作业了。',
          '把作业我做完了。',
        ],
        correctIndex: 0,
        explanation:
          'Na construção com 把, o objeto vem após 把 e o verbo deve ter complemento de resultado: "我把作业做完了".',
      },
    ],
    writingTask: {
      prompt:
        '请用中文写一封简短的电子邮件给你的朋友（80字左右），介绍你最近一次愉快的旅行，说说你去了哪里、吃了什么以及感受如何。',
      minWords: 25,
      rubricCriteria: [
        'Saudação e encerramento adequados em chinês',
        'Descrição clara de destino, comida e sentimento',
        'Uso correto de 了 e conectores (不仅……而且……)',
      ],
      expectedKeywords: ['旅游', '美食', '风景', '高兴', '朋友'],
      modelAnswer:
        '大卫，你好！上个周末我和家人坐高铁去杭州旅游了。那里的风景不仅非常漂亮，而且西湖边有很多安静的小路可以散步。中午我们吃了有名的西湖醋鱼和龙井虾仁，味道好极了。虽然周末人有点儿多，但我们玩得非常开心。希望下次有机会我们一起去！祝好，小李',
    },
  },
  {
    id: 'hsk-sim-2',
    examTypeId: 'hsk',
    languageCode: 'zh',
    simulationNumber: 2,
    title: 'HSK 4 — Simulado 2: 健康与运动',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'hsk-2-q1',
        section: 'reading',
        passageTitle: '每天散步半小时',
        passageText:
          '很多上班族每天坐在电脑前工作，很少有时间去健身房。其实，下班后散步半个小时也是一种很好的锻炼方式。坚持散步不仅可以放松眼睛和肩膀，还能帮助晚上睡得更香。',
        prompt: '根据这段话，下班后散步有什么好处？',
        options: [
          '可以让你工作得更快',
          '可以放松身体并帮助睡眠',
          '可以代替吃晚饭',
          '需要花很多钱买装备',
        ],
        correctIndex: 1,
        explanation:
          'Ajuda a relaxar olhos e ombros e dormir melhor à noite ("放松眼睛和肩膀，还能帮助晚上睡得更香").',
      },
      {
        id: 'hsk-2-q2',
        section: 'reading',
        passageTitle: '每天散步半小时',
        passageText:
          '很多上班族每天坐在电脑前工作，很少有时间去健身房。其实，下班后散步半个小时也是一种很好的锻炼方式。坚持散步不仅可以放松眼睛和肩膀，还能帮助晚上睡得更香。',
        prompt: '为什么很多上班族不去健身房？',
        options: [
          '健身房离家太近',
          '他们每天工作忙，很少有时间',
          '医生不让他们运动',
          '健身房晚上不开门',
        ],
        correctIndex: 1,
        explanation:
          '"很少有时间去健身房" (têm pouco tempo para ir à academia).',
      },
      {
        id: 'hsk-2-q3',
        section: 'listening',
        audioText:
          '医生：你的嗓子有点儿发炎，这几天少吃辣的东西，多喝温水。按时吃药，过三四天就会好的。',
        audioPlaysLimit: 2,
        prompt: '医生建议病人这几天怎么做？',
        options: [
          '多吃辣的菜',
          '少吃辣的，多喝温水并按时吃药',
          '每天跑步一小时',
          '不要喝水',
        ],
        correctIndex: 1,
        explanation:
          'O médico recomenda evitar comida apimentada, beber água morna e tomar o remédio no horário.',
      },
      {
        id: 'hsk-2-q4',
        section: 'listening',
        audioText:
          '女：周末我们去爬山吧，听说香山风景不错。男：好啊，不过天气预报说周六可能降温，我们多穿一件外套吧。',
        audioPlaysLimit: 2,
        prompt: '男的为什么提醒多穿一件外套？',
        options: [
          '因为周六可能会下雨',
          '因为周六可能会降温',
          '因为山顶风很大不能去',
          '因为外套很便宜',
        ],
        correctIndex: 1,
        explanation:
          'A previsão diz que no sábado pode esfriar ("周六可能降温").',
      },
      {
        id: 'hsk-2-q5',
        section: 'language_use',
        prompt: '选择正确的量词：“他每天早上喝一（　）热茶。”',
        options: ['杯', '张', '条', '本'],
        correctIndex: 0,
        explanation:
          'O classificador para xícara/copo de chá é "杯" (bēi).',
      },
      {
        id: 'hsk-2-q6',
        section: 'language_use',
        prompt: '填空：“你应该养成早睡早起的（　）。”',
        options: ['习惯', '意思', '消息', '方法'],
        correctIndex: 0,
        explanation:
          '"养成……的习惯" é a colocação fixa para "adquirir o hábito de...".',
      },
    ],
    writingTask: {
      prompt:
        '请写一段短文（80字左右），谈谈你平时是怎么保持健康的，或者你最喜欢什么运动。',
      minWords: 25,
      rubricCriteria: [
        'Clareza na descrição de hábitos saudáveis',
        'Uso correto de expressões de frequência (每天, 经常)',
        'Estrutura frasal natural em mandarim',
      ],
      expectedKeywords: ['健康', '运动', '习惯', '水果', '睡觉'],
      modelAnswer:
        '为了保持身体健康，我每天都有固定的生活习惯。早上我喜欢喝一杯温水，然后吃一顿营养丰富的早餐，里面常有鸡蛋和新鲜水果。下班以后，我每周都会去公园跑步三次，每次大约四十分钟。另外，我尽量在晚上十一点以前睡觉，这样第二天精力更充沛。',
    },
  },
  {
    id: 'hsk-sim-3',
    examTypeId: 'hsk',
    languageCode: 'zh',
    simulationNumber: 3,
    title: 'HSK 5 — Simulado 3: 工作与沟通',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'hsk-3-q1',
        section: 'reading',
        passageTitle: '有效沟通的重要性',
        passageText:
          '在团队合作中，每个人看问题的角度往往不同。如果遇到分歧时只顾着表达自己的意见，而不愿意倾听同事的想法，矛盾就很容易产生。真正的有效沟通，是先理解对方的顾虑，再共同寻找双方都能接受的解决办法。',
        prompt: '作者认为真正的有效沟通应该怎么做？',
        options: [
          '坚持自己的看法，不听别人说',
          '先理解对方的顾虑，再共同寻找解决办法',
          '把所有问题都交给经理决定',
          '尽量少和同事交流',
        ],
        correctIndex: 1,
        explanation:
          'O texto afirma: "先理解对方的顾虑，再共同寻找双方都能接受的解决办法".',
      },
      {
        id: 'hsk-3-q2',
        section: 'reading',
        passageTitle: '有效沟通的重要性',
        passageText:
          '在团队合作中，每个人看问题的角度往往不同。如果遇到分歧时只顾着表达自己的意见，而不愿意倾听同事的想法，矛盾就很容易产生。真正的有效沟通，是先理解对方的顾虑，再共同寻找双方都能接受的解决办法。',
        prompt: '文中“分歧”的意思最接近于：',
        options: ['意见不一致', '关系很好', '工作顺利', '时间充足'],
        correctIndex: 0,
        explanation:
          '"分歧" (fēnqí) significa divergência de opiniões.',
      },
      {
        id: 'hsk-3-q3',
        section: 'listening',
        audioText:
          '经理：小张，这份市场调查报告写得很详细，不过结尾的建议部分还可以再具体一点。你明天上午十点前修改好发给我。',
        audioPlaysLimit: 2,
        prompt: '经理认为报告哪一部分需要改进？',
        options: [
          '开头的数据',
          '结尾的建议部分',
          '封面设计',
          '整篇都需要重写',
        ],
        correctIndex: 1,
        explanation:
          'O gerente pede para tornar mais específica a parte das sugestões no final ("结尾的建议部分").',
      },
      {
        id: 'hsk-3-q4',
        section: 'listening',
        audioText:
          '女：你觉得这份新工作怎么样？男：同事们都很热情，就是每天加班有点多，周末得好好休息一下。',
        audioPlaysLimit: 2,
        prompt: '男的对新工作有什么看法？',
        options: [
          '工资太低',
          '同事热情，但加班较多',
          '离家太远',
          '工作内容太无聊',
        ],
        correctIndex: 1,
        explanation:
          'Ele gosta dos colegas, mas acha que há bastante hora extra ("加班有点多").',
      },
      {
        id: 'hsk-3-q5',
        section: 'language_use',
        prompt: '选择正确的关联词：“（　）遇到什么困难，我们都要保持冷静。”',
        options: ['无论', '既然', '除非', '宁可'],
        correctIndex: 0,
        explanation:
          '"无论……都……" significa "não importa o que..., sempre...".',
      },
      {
        id: 'hsk-3-q6',
        section: 'language_use',
        prompt: '填入最合适的词语：“这次活动能成功，多亏了大家的共同（　）。”',
        options: ['努力', '结果', '情况', '条件'],
        correctIndex: 0,
        explanation:
          '"共同努力" (esforço conjunto) é a colocação natural após "多亏了" (graças a).',
      },
    ],
    writingTask: {
      prompt:
        '请结合“沟通”、“团队”和“理解”这三个词，写一段90字左右的短文，谈谈在工作或学习中如何与人合作。',
      minWords: 30,
      rubricCriteria: [
        'Inclusão natural das três palavras-chave solicitadas',
        'Argumentação coerente sobre trabalho em equipe',
        'Uso de conectores de nível HSK 4/5',
      ],
      expectedKeywords: ['沟通', '团队', '理解', '合作', '意见'],
      modelAnswer:
        '在一个优秀的团队里，每个人的能力都很重要，但更重要的是学会有效沟通。当大家对同一个项目有不同意见时，我们应该耐心倾听，学会站在对方的角度去理解问题，而不是互相指责。只有彼此信任、及时沟通，团队才能发挥最大的力量，顺利完成共同的目标。',
    },
  },
  {
    id: 'hsk-sim-4',
    examTypeId: 'hsk',
    languageCode: 'zh',
    simulationNumber: 4,
    title: 'HSK 5 — Simulado 4: 科技与生活',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'hsk-4-q1',
        section: 'reading',
        passageTitle: '电子书与纸质书',
        passageText:
          '随着科技的发展，越来越多的人习惯用手机或电子阅读器看书，因为携带方便，随时随地都能阅读。不过，还是有不少读者偏爱纸质书，他们认为翻动书页的感觉和纸张的味道是电子屏幕无法替代的。',
        prompt: '为什么有人仍然偏爱纸质书？',
        options: [
          '纸质书比手机轻',
          '翻书的感觉和纸张味道无法被替代',
          '电子书没有新出版的小说',
          '纸质书不用花钱',
        ],
        correctIndex: 1,
        explanation:
          '"翻动书页的感觉和纸张的味道是电子屏幕无法替代的" (a sensação de virar as páginas e o cheiro do papel não podem ser substituídos).',
      },
      {
        id: 'hsk-4-q2',
        section: 'reading',
        passageTitle: '电子书与纸质书',
        passageText:
          '随着科技的发展，越来越多的人习惯用手机或电子阅读器看书，因为携带方便，随时随地都能阅读。不过，还是有不少读者偏爱纸质书，他们认为翻动书页的感觉和纸张的味道是电子屏幕无法替代的。',
        prompt: '电子书的主要优点是什么？',
        options: [
          '保护视力',
          '携带方便，随时随地可阅读',
          '字体不能调整',
          '不需要充电',
        ],
        correctIndex: 1,
        explanation:
          'O texto destaca: "携带方便，随时随地都能阅读" (fácil de carregar, leitura a qualquer hora e lugar).',
      },
      {
        id: 'hsk-4-q3',
        section: 'listening',
        audioText:
          '客服：您好，您订购的图书已经发出，预计后天下午送到。如果您不在家，快递员会把包裹放在小区的快递柜里，并给您发取件码。',
        audioPlaysLimit: 2,
        prompt: '如果收件人不在家，快递会放在哪里？',
        options: [
          '退回书店',
          '放在小区的快递柜里',
          '放在门口地上',
          '交给邻居保管',
        ],
        correctIndex: 1,
        explanation:
          'O entregador colocará no armário de encomendas do condomínio ("放在小区的快递柜里").',
      },
      {
        id: 'hsk-4-q4',
        section: 'listening',
        audioText:
          '老师：大家写作文的时候，不要直接抄网上的句子，要用自己的话把想法表达清楚，这样才能真正提高写作水平。',
        audioPlaysLimit: 2,
        prompt: '老师希望学生写作文时怎么做？',
        options: [
          '多背网上的长句子',
          '用自己的话清楚表达想法',
          '只写很短的句子',
          '全部用手机打字',
        ],
        correctIndex: 1,
        explanation:
          'O professor orienta expressar as ideias claramente com as próprias palavras ("用自己的话把想法表达清楚").',
      },
      {
        id: 'hsk-4-q5',
        section: 'language_use',
        prompt: '选择正确的词语：“科技给我们的生活带来了（　）的变化。”',
        options: ['巨大', '高大', '长久', '安静'],
        correctIndex: 0,
        explanation:
          '"巨大的变化" (enormes mudanças) é a colocação padrão em chinês.',
      },
      {
        id: 'hsk-4-q6',
        section: 'language_use',
        prompt: '填入合适的词语：“（　）方便快捷，网购也存在一定的风险。”',
        options: ['尽管', '因为', '只要', '既然'],
        correctIndex: 0,
        explanation:
          '"尽管" (apesar de / embora) introduz a concessão antes de apontar os riscos das compras online.',
      },
    ],
    writingTask: {
      prompt:
        '请写一段90字左右的短文，说说你更喜欢看电子书还是纸质书，并说明两个理由。',
      minWords: 30,
      rubricCriteria: [
        'Escolha clara entre livro digital e impresso',
        'Apresentação de dois motivos bem explicados',
        'Coesão com conectores (首先, 其次, 因此)',
      ],
      expectedKeywords: ['电子书', '纸质书', '方便', '阅读', '保护'],
      modelAnswer:
        '在电子书和纸质书之间，我更喜欢看纸质书。首先，看纸质书对眼睛更好，不会因为长时间盯着屏幕而感到疲劳。其次，我喜欢在书页上做笔记、画重点，这样以后复习起来更加清楚。虽然电子书出门带着很方便，但在家里安静地翻开一本纸质书，总能让我心情更加放松。',
    },
  },

  // =========================================================================
  // ALPT (ar) — 4 Simulations
  // =========================================================================
  {
    id: 'alpt-sim-1',
    examTypeId: 'alpt',
    languageCode: 'ar',
    simulationNumber: 1,
    title: 'ALPT — Simulado 1: الحياة اليومية والسفر',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'alpt-1-q1',
        section: 'reading',
        passageTitle: 'السوق القديم في المدينة',
        passageText:
          'يُعدّ السوق القديم من أشهر المعالم السياحية في المدينة. يفتح أبوابه كل صباح في الساعة الثامنة، ويقصده الزوار لشراء التوابل الطازجة والهدايا التذكارية المصنوعة يدوياً. كما توجد في وسط السوق مقاهٍ تقليدية تقدم الشاي بالنعناع والقهوة العربية.',
        prompt: 'في أي ساعة يفتح السوق القديم أبوابه؟',
        options: [
          'السابعة صباحاً',
          'الثامنة صباحاً',
          'العاشرة صباحاً',
          'الثانية بعد الظهر',
        ],
        correctIndex: 1,
        explanation:
          'O texto diz: "يفتح أبوابه كل صباح في الساعة الثامنة" (abre às oito da manhã).',
      },
      {
        id: 'alpt-1-q2',
        section: 'reading',
        passageTitle: 'السوق القديم في المدينة',
        passageText:
          'يُعدّ السوق القديم من أشهر المعالم السياحية في المدينة. يفتح أبوابه كل صباح في الساعة الثامنة، ويقصده الزوار لشراء التوابل الطازجة والهدايا التذكارية المصنوعة يدوياً. كما توجد في وسط السوق مقاهٍ تقليدية تقدم الشاي بالنعناع والقهوة العربية.',
        prompt: 'ماذا يشتري الزوار من السوق القديم حسب النص؟',
        options: [
          'الملابس الرياضية',
          'التوابل الطازجة والهدايا اليدوية',
          'الأجهزة الإلكترونية',
          'الكتب المدرسية',
        ],
        correctIndex: 1,
        explanation:
          '"لشراء التوابل الطازجة والهدايا التذكارية المصنوعة يدوياً" (temperos frescos e lembranças artesanais).',
      },
      {
        id: 'alpt-1-q3',
        section: 'listening',
        audioText:
          'إعلان في المطار: نرجو من المسافرين على الرحلة رقم مئتين وأربعين المتجهة إلى عمّان التوجه فوراً إلى البوابة رقم تسعة للصعود إلى الطائرة.',
        audioPlaysLimit: 2,
        prompt: 'إلى أي بوابة يجب أن يتجه المسافرون إلى عمّان؟',
        options: ['البوابة 4', 'البوابة 7', 'البوابة 9', 'البوابة 12'],
        correctIndex: 2,
        explanation:
          'O anúncio orienta ir ao portão número nove ("البوابة رقم تسعة").',
      },
      {
        id: 'alpt-1-q4',
        section: 'listening',
        audioText:
          'الموظف: أهلاً بك في الفندق، كيف يمكنني مساعدتك؟ الضيف: مرحباً، حجزت غرفة لليلتين باسم كريم المنصور، وأفضل أن تكون في طابق هادئ بعيداً عن الشارع.',
        audioPlaysLimit: 2,
        prompt: 'ماذا يطلب الضيف من موظف الفندق؟',
        options: [
          'غرفة مطلة على الشارع الرئيسي',
          'غرفة في طابق هادئ بعيداً عن الشارع',
          'تمديد الإقامة لأسبوع',
          'إلغاء الحجز',
        ],
        correctIndex: 1,
        explanation:
          'O hóspede prefere um quarto em um andar silencioso, longe da rua ("في طابق هادئ بعيداً عن الشارع").',
      },
      {
        id: 'alpt-1-q5',
        section: 'language_use',
        prompt: 'اختر الكلمة الصحيحة لإكمال الجملة: "سافرتُ مع عائلتي ___ القطار."',
        options: ['في', 'بـ', 'على', 'إلى'],
        correctIndex: 1,
        explanation:
          'Com meios de transporte em árabe padrão, usa-se a preposição inseparável "بـ" ("بالقطار" = de trem).',
      },
      {
        id: 'alpt-1-q6',
        section: 'language_use',
        prompt: 'اختر جمع كلمة "كتاب": "قرأتُ ثلاثة ___ في العطلة."',
        options: ['كتابات', 'كتب', 'مكاتب', 'كاتبون'],
        correctIndex: 1,
        explanation:
          'O plural quebrado (جمع تكسير) de "كتاب" é "كتب" (livros).',
      },
    ],
    writingTask: {
      prompt:
        'اكتب رسالة قصيرة لصديقك (حوالي 60 كلمة) تصف فيها مدينة زرتها مؤخراً، واذكر أهم ما أعجبك فيها.',
      minWords: 45,
      rubricCriteria: [
        'Saudação e despedida adequadas em árabe padrão (الفصحى)',
        'Uso correto de tempos verbais no passado',
        'Descrição clara de pontos de interesse e impressões pessoais',
      ],
      expectedKeywords: ['مدينة', 'زرت', 'جميلة', 'الطعام', 'أتمنى'],
      modelAnswer:
        'صديقي العزيز طارق، تحية طيبة وبعد. أردتُ أن أخبرك عن رحلتي الأخيرة إلى مدينة فاس الأسبوع الماضي. لقد أعجبتني أزقتها التاريخية وأسواقها التقليدية كثيراً، كما تناولتُ الطعام المغربي اللذيذ مع السكان المحليين الذين كانوا في غاية اللطف. كانت تجربة رائعة ومفيدة جداً. أتمنى أن نزورها معاً في المستقبل القريب. مع خالص التحية، سامي',
    },
  },
  {
    id: 'alpt-sim-2',
    examTypeId: 'alpt',
    languageCode: 'ar',
    simulationNumber: 2,
    title: 'ALPT — Simulado 2: التعليم والعمل',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'alpt-2-q1',
        section: 'reading',
        passageTitle: 'التعلّم عن بُعد',
        passageText:
          'أتاحت الدورات التدريبية عبر الإنترنت للطلاب والموظفين فرصة تطوير مهاراتهم من المنزل دون الحاجة إلى السفر. ومع ذلك، يرى الخبراء أن نجاح هذه الدورات يعتمد على تنظيم الوقت والمشاركة الفعّالة أثناء المحاضرات المباشرة.',
        prompt: 'ما الذي يضمن نجاح الدورات عبر الإنترنت حسب رأي الخبراء؟',
        options: [
          'السفر إلى جامعة أخرى',
          'تنظيم الوقت والمشاركة الفعّالة',
          'شراء كتب ورقية كثيرة',
          'مشاهدة المحاضرات دون أسئلة',
        ],
        correctIndex: 1,
        explanation:
          '"يعتمد على تنظيم الوقت والمشاركة الفعّالة" (depende da organização do tempo e participação ativa).',
      },
      {
        id: 'alpt-2-q2',
        section: 'reading',
        passageTitle: 'التعلّم عن بُعد',
        passageText:
          'أتاحت الدورات التدريبية عبر الإنترنت للطلاب والموظفين فرصة تطوير مهاراتهم من المنزل دون الحاجة إلى السفر. ومع ذلك، يرى الخبراء أن نجاح هذه الدورات يعتمد على تنظيم الوقت والمشاركة الفعّالة أثناء المحاضرات المباشرة.',
        prompt: 'ما الفائدة الرئيسية التي يذكرها النص للدورات عبر الإنترنت؟',
        options: [
          'الحصول على راتب شهري',
          'تطوير المهارات من المنزل دون الحاجة للسفر',
          'إلغاء الامتحانات النهائية',
          'العمل ساعات أطول',
        ],
        correctIndex: 1,
        explanation:
          'Permite desenvolver habilidades de casa sem precisar viajar ("تطوير مهاراتهم من المنزل دون الحاجة إلى السفر").',
      },
      {
        id: 'alpt-2-q3',
        section: 'listening',
        audioText:
          'المديرة: صباح الخير جميعاً، سيبدأ الاجتماع الأسبوعي في العاشرة والنصف بدلاً من العاشرة لأنني في مكالمة مع العميل الجديد.',
        audioPlaysLimit: 2,
        prompt: 'لماذا تأخر موعد الاجتماع الأسبوعي؟',
        options: [
          'لأن القاعة مشغولة',
          'لأن المديرة في مكالمة مع عميل جديد',
          'لأن التقرير غير جاهز',
          'لأن الكهرباء مقطوعة',
        ],
        correctIndex: 1,
        explanation:
          'A diretora está em uma ligação com o novo cliente ("في مكالمة مع العميل الجديد").',
      },
      {
        id: 'alpt-2-q4',
        section: 'listening',
        audioText:
          'الطالبة: لو سمحت، متى آخر موعد لتقديم طلب المنحة الدراسية؟ الموظفة: ينتهي التقديم يوم الخميس القادم الساعة الرابعة عصراً، ولا تنسي إرفاق شهادة التخرج.',
        audioPlaysLimit: 2,
        prompt: 'ما المستند الذي يجب إرفاقه مع طلب المنحة؟',
        options: [
          'جواز السفر',
          'شهادة التخرج',
          'عقد الإيجار',
          'صورة شخصية فقط',
        ],
        correctIndex: 1,
        explanation:
          'A funcionária lembra de anexar o certificado de graduação ("شهادة التخرج").',
      },
      {
        id: 'alpt-2-q5',
        section: 'language_use',
        prompt: 'أكمل الجملة بالفعل المناسب: "الطالبات ___ دروسهنّ بجدٍّ كل يوم."',
        options: ['يدرسون', 'يدرسنَ', 'تدرسون', 'يدرس'],
        correctIndex: 1,
        explanation:
          'Para plural feminino ("الطالبات"), o verbo no presente recebe نون النسوة: "يدرسنَ".',
      },
      {
        id: 'alpt-2-q6',
        section: 'language_use',
        prompt: 'اختر أداة الربط المناسبة: "أتعلم اللغة العربية ___ أعمل في مجال الترجمة."',
        options: ['لكي', 'لأنني', 'لكن', 'أو'],
        correctIndex: 0,
        explanation:
          '"لكي" (para que / a fim de) introduz o objetivo com verbo no subjuntivo ("أعملَ").',
      },
    ],
    writingTask: {
      prompt:
        'اكتب فقرة قصيرة (حوالي 65 كلمة) تتحدث فيها عن أهمية تعلم لغة أجنبية في سوق العمل اليوم.',
      minWords: 50,
      rubricCriteria: [
        'Argumentos claros ligados ao mercado de trabalho',
        'Uso correto de conectores (أولاً، بالإضافة إلى ذلك)',
        'Concordância gramatical em árabe padrão',
      ],
      expectedKeywords: ['اللغة', 'العمل', 'فرص', 'التواصل', 'ثقافة'],
      modelAnswer:
        'أصبح تعلم اللغات الأجنبية ضرورة أساسية في سوق العمل الحديث. أولاً، يفتح إتقان لغة ثانية فرصاً وظيفية أوسع في الشركات الدولية ويساعد على التطور المهني. بالإضافة إلى ذلك، يمكّننا من التواصل المباشر مع زملاء وعملاء من ثقافات مختلفة، مما يعزز التفاهم والثقة في العمل. لذلك، أنصح كل شاب بالاستثمار في تعلم لغة جديدة.',
    },
  },
  {
    id: 'alpt-sim-3',
    examTypeId: 'alpt',
    languageCode: 'ar',
    simulationNumber: 3,
    title: 'ALPT — Simulado 3: البيئة والصحة',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'alpt-3-q1',
        section: 'reading',
        passageTitle: 'أهمية المساحات الخضراء',
        passageText:
          'تعمل البلديات في كثير من المدن على زيادة عدد الحدائق العامة وزراعة الأشجار على جوانب الطرق. فالأشجار لا تجمّل المنظر العام فحسب، بل تساعد أيضاً على تنقية الهواء وتخفيف حرارة الصيف، كما تشجع السكان على ممارسة رياضة المشي.',
        prompt: 'أي فائدة لم تُذكر للأشجار والحدائق في النص؟',
        options: [
          'تنقية الهواء',
          'تخفيف حرارة الصيف',
          'تشجيع رياضة المشي',
          'توفير مياه الشرب',
        ],
        correctIndex: 3,
        explanation:
          'O texto menciona purificar o ar, amenizar o calor e incentivar caminhadas; não menciona fornecer água potável.',
      },
      {
        id: 'alpt-3-q2',
        section: 'reading',
        passageTitle: 'أهمية المساحات الخضراء',
        passageText:
          'تعمل البلديات في كثير من المدن على زيادة عدد الحدائق العامة وزراعة الأشجار على جوانب الطرق. فالأشجار لا تجمّل المنظر العام فحسب، بل تساعد أيضاً على تنقية الهواء وتخفيف حرارة الصيف، كما تشجع السكان على ممارسة رياضة المشي.',
        prompt: 'ما الجهة التي تعمل على زيادة الحدائق العامة حسب النص؟',
        options: ['المدارس', 'البلديات', 'المستشفيات', 'المطاعم'],
        correctIndex: 1,
        explanation:
          '"تعمل البلديات في كثير من المدن" (as prefeituras/municípios em muitas cidades).',
      },
      {
        id: 'alpt-3-q3',
        section: 'listening',
        audioText:
          'خبير التغذية: يُنصح بشرب كمية كافية من الماء يومياً وتقليل السكريات في المشروبات، خاصة في فصل الصيف عندما يفقد الجسم سوائل أكثر.',
        audioPlaysLimit: 2,
        prompt: 'ماذا ينصح خبير التغذية بتقليله في المشروبات؟',
        options: ['الماء', 'السكريات', 'العصائر الطبيعية', 'الحليب'],
        correctIndex: 1,
        explanation:
          'Ele recomenda reduzir os açúcares nas bebidas ("تقليل السكريات في المشروبات").',
      },
      {
        id: 'alpt-3-q4',
        section: 'listening',
        audioText:
          'الطبيب: الفحوصات سليمة والحمد لله، لكنك بحاجة إلى أخذ قسط من الراحة وتجنب السهر المتأخر أمام شاشة الهاتف.',
        audioPlaysLimit: 2,
        prompt: 'ما سبب نصيحة الطبيب بتجنب الهاتف ليلاً؟',
        options: [
          'للحصول على راحة ونوم أفضل',
          'لأن البطارية تنفد بسرعة',
          'لأن الفحوصات غير واضحة',
          'لتوفير الكهرباء',
        ],
        correctIndex: 0,
        explanation:
          'O médico recomenda descansar e evitar ficar acordado até tarde olhando para a tela do celular.',
      },
      {
        id: 'alpt-3-q5',
        section: 'language_use',
        prompt: 'اختر الجملة الصحيحة نحوياً:',
        options: [
          'إنّ الرياضةَ مفيدةٌ للجسم.',
          'إنّ الرياضةُ مفيدةً للجسم.',
          'إنّ الرياضةِ مفيدةٌ للجسم.',
          'إنّ الرياضةَ مفيدةَ للجسم.',
        ],
        correctIndex: 0,
        explanation:
          'A partícula "إنّ" deixa seu sujeito no acusativo (منصوب: الرياضةَ) e seu predicado no nominativo (مرفوع: مفيدةٌ).',
      },
      {
        id: 'alpt-3-q6',
        section: 'language_use',
        prompt: 'ما ضد كلمة "سريع"؟',
        options: ['طويل', 'بطيء', 'قديم', 'صغير'],
        correctIndex: 1,
        explanation:
          '"سريع" (rápido) tem como antônimo "بطيء" (lento).',
      },
    ],
    writingTask: {
      prompt:
        'اكتب مقالاً قصيراً (حوالي 70 كلمة) تقدم فيه ثلاث نصائح بسيطة للحفاظ على البيئة في حياتنا اليومية.',
      minWords: 50,
      rubricCriteria: [
        'Três recomendações práticas e distintas',
        'Estilo claro e formal em árabe padrão',
        'Uso adequado de conectores sequenciais',
      ],
      expectedKeywords: ['البيئة', 'إعادة التدوير', 'الماء', 'الكهرباء', 'الأشجار'],
      modelAnswer:
        'تبدأ حماية البيئة من سلوكنا اليومي البسيط. أولاً، يمكننا تقليل استخدام الأكياس البلاستيكية واستبدالها بأكياس قماشية قابلة لإعادة الاستخدام. ثانياً، يجب علينا ترشيد استهلاك الماء والكهرباء في المنزل وإغلاق الأجهزة غير المستخدمة. وأخيراً، من المفيد فرز النفايات لتسهيل إعادة التدوير. بهذه الخطوات الصغيرة نساهم جميعاً في مستقبل أنظف وأكثر استدامة.',
    },
  },
  {
    id: 'alpt-sim-4',
    examTypeId: 'alpt',
    languageCode: 'ar',
    simulationNumber: 4,
    title: 'ALPT — Simulado 4: الثقافة والتكنولوجيا',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'alpt-4-q1',
        section: 'reading',
        passageTitle: 'المكتبات الرقمية والبحث العلمي',
        passageText:
          'سهّلت المكتبات الرقمية وصول الباحثين والطلاب إلى آلاف الكتب والمقالات العلمية بضغطة زر واحدة. ومع أن القراءة الرقمية توفر الوقت والمكان، فإن التحقق من موثوقية المصادر على الإنترنت يظل مهارة ضرورية لا غنى عنها.',
        prompt: 'ما المهارة التي يشدد النص على أهميتها عند استخدام الإنترنت؟',
        options: [
          'سرعة الطباعة',
          'التحقق من موثوقية المصادر',
          'تصميم المواقع',
          'حفظ كل المقالات',
        ],
        correctIndex: 1,
        explanation:
          '"التحقق من موثوقية المصادر على الإنترنت يظل مهارة ضرورية" (verificar a confiabilidade das fontes continua sendo uma habilidade indispensável).',
      },
      {
        id: 'alpt-4-q2',
        section: 'reading',
        passageTitle: 'المكتبات الرقمية والبحث العلمي',
        passageText:
          'سهّلت المكتبات الرقمية وصول الباحثين والطلاب إلى آلاف الكتب والمقالات العلمية بضغطة زر واحدة. ومع أن القراءة الرقمية توفر الوقت والمكان، فإن التحقق من موثوقية المصادر على الإنترنت يظل مهارة ضرورية لا غنى عنها.',
        prompt: 'بماذا تتميز المكتبات الرقمية حسب النص؟',
        options: [
          'تغلق في عطلة نهاية الأسبوع',
          'توفر الوقت والمكان وتسهل الوصول إلى الكتب',
          'تقتصر على الروايات فقط',
          'تتطلب السفر إلى المكتبة الوطنية',
        ],
        correctIndex: 1,
        explanation:
          'Ela facilita o acesso com um clique e economiza tempo e espaço ("توفر الوقت والمكان").',
      },
      {
        id: 'alpt-4-q3',
        section: 'listening',
        audioText:
          'مذيعة الثقافة: ينطلق غداً معرض الكتاب السنوي بمشاركة أكثر من مئة دار نشر عربية وعالمية، وسيشمل البرنامج ندوات يومية للكتّاب الشباب.',
        audioPlaysLimit: 2,
        prompt: 'ماذا يشمل برنامج معرض الكتاب؟',
        options: [
          'حفلات موسيقية فقط',
          'ندوات يومية للكتّاب الشباب',
          'مسابقات رياضية',
          'عروض أزياء',
        ],
        correctIndex: 1,
        explanation:
          'O programa inclui seminários/painéis diários para jovens escritores ("ندوات يومية للكتّاب الشباب").',
      },
      {
        id: 'alpt-4-q4',
        section: 'listening',
        audioText:
          'أمين المكتبة: يرجى العلم بأن قاعة المطالعة في الطابق الثاني مخصصة للدراسة الصامتة، أما العمل الجماعي فيمكنكم القيام به في القاعة الأرضية.',
        audioPlaysLimit: 2,
        prompt: 'أين يُسمح للطلاب بالعمل الجماعي؟',
        options: [
          'في الطابق الثاني',
          'في القاعة الأرضية',
          'عند المدخل فقط',
          'لا يُسمح بالعمل الجماعي',
        ],
        correctIndex: 1,
        explanation:
          'O trabalho em grupo pode ser feito no salão do térreo ("في القاعة الأرضية").',
      },
      {
        id: 'alpt-4-q5',
        section: 'language_use',
        prompt: 'اختر الاسم الموصول المناسب: "هذا هو الباحث ___ نشر المقالة الجديدة."',
        options: ['التي', 'الذي', 'الذين', 'اللواتي'],
        correctIndex: 1,
        explanation:
          'Para masculino singular ("الباحث"), o pronome relativo correto é "الذي".',
      },
      {
        id: 'alpt-4-q6',
        section: 'language_use',
        prompt: 'اختر التعبير الصحيح: "على ___ من صعوبة الامتحان، نجح معظم الطلاب."',
        options: ['الرغم', 'السبب', 'الوقت', 'النحو'],
        correctIndex: 0,
        explanation:
          '"على الرغم من" é a locução concessiva padrão ("Apesar de").',
      },
    ],
    writingTask: {
      prompt:
        'اكتب فقرة رأي (حوالي 70 كلمة) حول تأثير التكنولوجيا على القراءة: هل ساعدت أم أضعفت عادة القراءة لدى الشباب؟',
      minWords: 50,
      rubricCriteria: [
        'Apresentação de dois pontos de vista sobre tecnologia e leitura',
        'Conclusão pessoal clara',
        'Vocabulário de nível B2 em árabe padrão',
      ],
      expectedKeywords: ['التكنولوجيا', 'القراءة', 'الشباب', 'الكتب', 'التركيز'],
      modelAnswer:
        'أثّرت التكنولوجيا بشكل مزدوج على عادة القراءة لدى الشباب. فمن ناحية، أتاحت الهواتف الذكية والكتب الصوتية قراءة المقالات والروايات في أي وقت بسهولة كبيرة. ومن ناحية أخرى، أدت كثرة الإشعارات ومقاطع الفيديو القصيرة إلى تشتيت الانتباه وتقليل الصبر لقراءة الكتب الطويلة. أعتقد أن الحل يكمن في تنظيم استخدام التكنولوجيا وتخصيص وقت ثابت يومياً للقراءة الهادئة.',
    },
  },
];

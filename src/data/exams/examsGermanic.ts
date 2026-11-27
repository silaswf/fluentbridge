/**
 * @file src/data/exams/examsGermanic.ts
 * @description Banco de simulados oficiais cronometrados (Germanic).
 * @exports GERMANIC_MOCK_EXAMS
 */
import type { MockExam } from '../../types/exams';

export const GERMANIC_MOCK_EXAMS: MockExam[] = [
  // =========================================================================
  // GOETHE-ZERTIFIKAT (de) — 4 Simulations
  // =========================================================================
  {
    id: 'goethe-sim-1',
    examTypeId: 'goethe',
    languageCode: 'de',
    simulationNumber: 1,
    title: 'Goethe-Zertifikat B1 — Simulado 1: Alltag & Arbeit',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'goethe-1-q1',
        section: 'reading',
        passageTitle: 'Homeoffice und Work-Life-Balance',
        passageText:
          'Immer mehr Unternehmen in Deutschland bieten ihren Mitarbeitenden die Möglichkeit, zwei bis drei Tage pro Woche von zu Hause aus zu arbeiten. Viele Beschäftigte schätzen die gesparte Pendelzeit, berichten aber auch, dass die Grenze zwischen Beruf und Freizeit verschwimmt. Experten empfehlen daher feste Arbeitszeiten und einen klar abgegrenzten Arbeitsplatz in der Wohnung.',
        prompt: 'Welches Problem wird im Text im Zusammenhang mit Homeoffice genannt?',
        options: [
          'Die Mitarbeitenden müssen länger pendeln.',
          'Beruf und Freizeit lassen sich schwerer trennen.',
          'Die Unternehmen verbieten feste Arbeitszeiten.',
          'Es gibt zu wenig Platz in den Büros.',
        ],
        correctIndex: 1,
        explanation:
          'O texto afirma que "die Grenze zwischen Beruf und Freizeit verschwimmt" (a fronteira entre trabalho e tempo livre fica difusa).',
      },
      {
        id: 'goethe-1-q2',
        section: 'reading',
        passageTitle: 'Homeoffice und Work-Life-Balance',
        passageText:
          'Immer mehr Unternehmen in Deutschland bieten ihren Mitarbeitenden die Möglichkeit, zwei bis drei Tage pro Woche von zu Hause aus zu arbeiten. Viele Beschäftigte schätzen die gesparte Pendelzeit, berichten aber auch, dass die Grenze zwischen Beruf und Freizeit verschwimmt. Experten empfehlen daher feste Arbeitszeiten und einen klar abgegrenzten Arbeitsplatz in der Wohnung.',
        prompt: 'Was raten Fachleute den Beschäftigten im Homeoffice?',
        options: [
          'Nur einmal im Monat ins Büro zu fahren',
          'Die Arbeitszeit flexibel bis spät abends zu legen',
          'Feste Zeiten und einen eigenen Arbeitsbereich einzuhalten',
          'Auf Pausen komplett zu verzichten',
        ],
        correctIndex: 2,
        explanation:
          'Especialistas recomendam "feste Arbeitszeiten und einen klar abgegrenzten Arbeitsplatz" (horários fixos e um local de trabalho claramente delimitado).',
      },
      {
        id: 'goethe-1-q3',
        section: 'listening',
        audioText:
          'Durchsage am Bahnhof: Achtung, Reisende nach München! Der ICE 593, planmäßige Abfahrt 14:22 Uhr, hat heute wegen einer Signalstörung etwa zwanzig Minuten Verspätung. Bitte beachten Sie auch, dass der Zug heute abweichend von Gleis 7 abfährt, nicht von Gleis 4.',
        audioPlaysLimit: 2,
        prompt: 'Was erfahren die Fahrgäste in der Durchsage?',
        options: [
          'Der Zug nach München fällt heute komplett aus.',
          'Der Zug fährt zwanzig Minuten später von Gleis 7 ab.',
          'Der Zug fährt pünktlich um 14:22 Uhr von Gleis 4 ab.',
          'Die Fahrgäste müssen in einen Bus umsteigen.',
        ],
        correctIndex: 1,
        explanation:
          'O anúncio informa um atraso de cerca de 20 minutos ("etwa zwanzig Minuten Verspätung") e mudança de plataforma para a via 7 ("abweichend von Gleis 7").',
      },
      {
        id: 'goethe-1-q4',
        section: 'listening',
        audioText:
          'Anna: Hallo Lukas, kommst du heute Abend mit ins Kino? Wir wollten den neuen Film um acht sehen. Lukas: Tut mir leid, Anna, ich muss noch für meine Präsentation morgen früh üben. Vielleicht können wir am Samstag zusammen essen gehen?',
        audioPlaysLimit: 2,
        prompt: 'Warum kann Lukas heute Abend nicht ins Kino gehen?',
        options: [
          'Er hat keine Lust auf den Film.',
          'Er muss sich auf eine Präsentation vorbereiten.',
          'Er geht heute Abend schon mit Freunden essen.',
          'Er ist am Samstag verreist.',
        ],
        correctIndex: 1,
        explanation:
          'Lukas diz: "ich muss noch für meine Präsentation morgen früh üben" (preciso ensaiar para a minha apresentação amanhã cedo).',
      },
      {
        id: 'goethe-1-q5',
        section: 'language_use',
        prompt: 'Ergänzen Sie den Satz: "Obwohl es stark regnete, ___ wir einen langen Spaziergang gemacht."',
        options: ['haben', 'sind', 'wurden', 'hatten'],
        correctIndex: 0,
        explanation:
          'O verbo "machen" forma o Perfekt com o auxiliar "haben": "haben ... gemacht".',
      },
      {
        id: 'goethe-1-q6',
        section: 'language_use',
        prompt: 'Welche Präposition passt? "Ich interessiere mich sehr ___ moderne Architektur."',
        options: ['über', 'auf', 'für', 'mit'],
        correctIndex: 2,
        explanation:
          'O verbo reflexivo "sich interessieren" rege a preposição "für" + acusativo.',
      },
    ],
    writingTask: {
      prompt:
        'Schreiben Sie eine E-Mail an Ihre Kollegin Julia (ca. 80 Wörter). Sie können morgen leider nicht an der Teambesprechung teilnehmen, weil Sie einen Arzttermin haben. Entschuldigen Sie sich, erklären Sie den Grund und schlagen Sie vor, wann Sie die Unterlagen nachlesen können.',
      minWords: 65,
      rubricCriteria: [
        'Tratamento e despedida adequados para colega de trabalho',
        'Justificativa clara da ausência (consulta médica)',
        'Proposta concreta para acompanhar os documentos/pauta depois',
        'Uso correto de conectores causais (weil/da) e ordem verbal',
      ],
      expectedKeywords: ['Besprechung', 'Arzttermin', 'Entschuldigung', 'Unterlagen', 'morgen'],
      modelAnswer:
        'Liebe Julia, leider kann ich morgen nicht an unserer Teambesprechung teilnehmen, weil ich einen wichtigen Arzttermin habe. Es tut mir sehr leid, dass ich so kurzfristig absagen muss. Könntest du mir bitte nach dem Meeting das Protokoll schicken? Ich werde alle Unterlagen noch am Nachmittag sorgfältig lesen und dir meine Rückmeldung geben. Viele Grüße, Alex',
    },
  },
  {
    id: 'goethe-sim-2',
    examTypeId: 'goethe',
    languageCode: 'de',
    simulationNumber: 2,
    title: 'Goethe-Zertifikat B1 — Simulado 2: Umwelt & Stadtleben',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'goethe-2-q1',
        section: 'reading',
        passageTitle: 'Mehr Fahrradwege in der Innenstadt',
        passageText:
          'Die Stadtverwaltung hat beschlossen, im Zentrum drei Hauptstraßen für den Autoverkehr zu sperren und breite Fahrradspuren einzurichten. Während Umweltverbände und Radfahrer das Projekt loben, befürchten einige Geschäftsinhaber, dass weniger Kunden aus dem Umland kommen könnten.',
        prompt: 'Wer äußert Bedenken gegen die neuen Fahrradspuren?',
        options: [
          'Die Umweltverbände',
          'Die Radfahrer',
          'Einige Geschäftsinhaber',
          'Die Stadtverwaltung',
        ],
        correctIndex: 2,
        explanation:
          'O texto diz que "einige Geschäftsinhaber" (alguns comerciantes) temem receber menos clientes da região ao redor.',
      },
      {
        id: 'goethe-2-q2',
        section: 'reading',
        passageTitle: 'Mehr Fahrradwege in der Innenstadt',
        passageText:
          'Die Stadtverwaltung hat beschlossen, im Zentrum drei Hauptstraßen für den Autoverkehr zu sperren und breite Fahrradspuren einzurichten. Während Umweltverbände und Radfahrer das Projekt loben, befürchten einige Geschäftsinhaber, dass weniger Kunden aus dem Umland kommen könnten.',
        prompt: 'Was soll laut Beschluss in drei Hauptstraßen passieren?',
        options: [
          'Es werden kostenlose Parkplätze gebaut.',
          'Autos dürfen dort nicht mehr fahren.',
          'Die Geschäfte müssen früher schließen.',
          'Es fahren nur noch Straßenbahnen.',
        ],
        correctIndex: 1,
        explanation:
          '"Für den Autoverkehr zu sperren" significa fechar as vias para o tráfego de automóveis.',
      },
      {
        id: 'goethe-2-q3',
        section: 'listening',
        audioText:
          'Wetterbericht: Am Wochenende bleibt es im Norden wechselhaft mit vereinzelten Schauern bei Temperaturen um 16 Grad. Im Süden dagegen scheint am Samstag den ganzen Tag die Sonne, und das Thermometer steigt auf angenehme 24 Grad.',
        audioPlaysLimit: 2,
        prompt: 'Wie wird das Wetter am Samstag im Süden?',
        options: [
          'Kühl und regnerisch',
          'Sonnig und warm mit 24 Grad',
          'Wechselhaft mit Gewittern',
          'Neblig bei 16 Grad',
        ],
        correctIndex: 1,
        explanation:
          'No sul ("Im Süden"), faz sol o dia todo no sábado e chega a 24 graus.',
      },
      {
        id: 'goethe-2-q4',
        section: 'listening',
        audioText:
          'Kundin: Entschuldigung, ich habe gestern diese Jacke gekauft, aber zu Hause habe ich bemerkt, dass der Reißverschluss klemmt. Verkäufer: Haben Sie den Kassenbon noch dabei? Dann können wir die Jacke problemlos umtauschen oder Ihnen das Geld zurückgeben.',
        audioPlaysLimit: 2,
        prompt: 'Was braucht die Kundin für den Umtausch?',
        options: [
          'Ihren Personalausweis',
          'Die Originalverpackung',
          'Den Kassenbon',
          'Eine schriftliche Garantie',
        ],
        correctIndex: 2,
        explanation:
          'O vendedor pergunta pelo "Kassenbon" (recibo/cupom fiscal) para fazer a troca ou devolução.',
      },
      {
        id: 'goethe-2-q5',
        section: 'language_use',
        prompt: 'Wählen Sie das richtige Relativpronomen: "Das ist die Kollegin, ___ ich gestern geholfen habe."',
        options: ['die', 'der', 'den', 'deren'],
        correctIndex: 1,
        explanation:
          '"Helfen" rege dativo; para feminino singular ("die Kollegin"), o pronome relativo no dativo é "der".',
      },
      {
        id: 'goethe-2-q6',
        section: 'language_use',
        prompt: 'Ergänzen Sie den Satz: "Ich nehme den Regenschirm mit, ___ ich nicht nass werde."',
        options: ['um', 'damit', 'obwohl', 'während'],
        correctIndex: 1,
        explanation:
          '"Damit" introduz oração subordinada final com sujeito diferente ou verbo conjugado no fim ("ich ... werde").',
      },
    ],
    writingTask: {
      prompt:
        'In einem Online-Forum diskutieren Nutzer über autofreie Innenstädte. Schreiben Sie Ihren Beitrag (ca. 80 Wörter): Nennen Sie einen Vorteil, einen möglichen Nachteil und Ihre persönliche Meinung.',
      minWords: 65,
      rubricCriteria: [
        'Apresentação clara de uma vantagem e uma desvantagem',
        'Posicionamento pessoal bem fundamentado',
        'Coesão textual com conectores (einerseits, andererseits, meiner Meinung nach)',
      ],
      expectedKeywords: ['Innenstadt', 'Verkehr', 'Umwelt', 'Vorteil', 'Meinung'],
      modelAnswer:
        'Meiner Meinung nach sind autofreie Innenstädte eine sehr gute Idee. Einerseits wird die Luft sauberer und es gibt weniger Lärm, sodass man angenehmer einkaufen oder spazieren gehen kann. Andererseits kann es für ältere Menschen oder Lieferanten schwieriger sein, bestimmte Geschäfte zu erreichen. Trotzdem überwiegen für mich die Vorteile für die Umwelt, wenn der öffentliche Nahverkehr gleichzeitig ausgebaut wird.',
    },
  },
  {
    id: 'goethe-sim-3',
    examTypeId: 'goethe',
    languageCode: 'de',
    simulationNumber: 3,
    title: 'Goethe-Zertifikat B2 — Simulado 3: Medien & Bildung',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'goethe-3-q1',
        section: 'reading',
        passageTitle: 'Digitale Lernplattformen an Schulen',
        passageText:
          'Eine aktuelle Studie zeigt, dass digitale Lernplattformen Schülerinnen und Schüler besonders dann motivieren, wenn sie individuelles Feedback erhalten. Reine PDF-Arbeitsblätter auf einem Tablet führen hingegen kaum zu besseren Ergebnissen. Entscheidend bleibt jedoch die pädagogische Begleitung durch die Lehrkräfte.',
        prompt: 'Was ist laut der Studie entscheidend für den Lernerfolg mit digitalen Medien?',
        options: [
          'Möglichst viele PDF-Arbeitsblätter bereitzustellen',
          'Die pädagogische Begleitung durch Lehrkräfte und individuelles Feedback',
          'Den Unterricht komplett ins Internet zu verlagern',
          'Jede Woche neue Tablets zu kaufen',
        ],
        correctIndex: 1,
        explanation:
          'O texto destaca o "individuelles Feedback" e a "pädagogische Begleitung durch die Lehrkräfte".',
      },
      {
        id: 'goethe-3-q2',
        section: 'reading',
        passageTitle: 'Digitale Lernplattformen an Schulen',
        passageText:
          'Eine aktuelle Studie zeigt, dass digitale Lernplattformen Schülerinnen und Schüler besonders dann motivieren, wenn sie individuelles Feedback erhalten. Reine PDF-Arbeitsblätter auf einem Tablet führen hingegen kaum zu besseren Ergebnissen. Entscheidend bleibt jedoch die pädagogische Begleitung durch die Lehrkräfte.',
        prompt: 'Welche Aussage stimmt mit dem Text überein?',
        options: [
          'PDF-Dateien auf Tablets verbessern die Noten deutlich.',
          'Digitale Tools ersetzen die Lehrkräfte vollständig.',
          'Ohne Rückmeldung motivieren digitale Aufgaben weniger.',
          'Schüler lehnen Tablets grundsätzlich ab.',
        ],
        correctIndex: 2,
        explanation:
          'As plataformas motivam especialmente quando há feedback individual; PDFs puros mal melhoram os resultados.',
      },
      {
        id: 'goethe-3-q3',
        section: 'listening',
        audioText:
          'Moderatorin: Herr Dr. Weber, lesen junge Menschen heute wirklich weniger als früher? Dr. Weber: Nein, sie lesen sogar ziemlich viel, aber anders: kürzere Nachrichten, Artikel auf dem Smartphone und Fachbeiträge online. Was abgenommen hat, ist das geduldige Lesen langer Romane.',
        audioPlaysLimit: 2,
        prompt: 'Wie beurteilt Dr. Weber das Leseverhalten junger Menschen?',
        options: [
          'Sie lesen überhaupt keine Texte mehr.',
          'Sie lesen viel digital und kürzere Texte, aber seltener lange Romane.',
          'Sie kaufen mehr gedruckte Romane als früher.',
          'Sie lesen ausschließlich für die Schule.',
        ],
        correctIndex: 1,
        explanation:
          'Dr. Weber explica que os jovens leem bastante em formatos digitais curtos, mas diminuiu a leitura de romances longos.',
      },
      {
        id: 'goethe-3-q4',
        section: 'listening',
        audioText:
          'Bibliothekarin: Guten Tag, bitte beachten Sie, dass unser Lesesaal wegen Renovierungsarbeiten ab Montag zwei Wochen lang geschlossen bleibt. Ausgeliehene Bücher können Sie aber wie gewohnt am Automaten im Eingangsbereich zurückgeben.',
        audioPlaysLimit: 2,
        prompt: 'Was ist während der Renovierung weiterhin möglich?',
        options: [
          'Im Lesesaal zu arbeiten',
          'Bücher am Automaten im Eingang zurückzugeben',
          'Neue Lesesaalplätze zu reservieren',
          'Am Wochenende Führungen zu buchen',
        ],
        correctIndex: 1,
        explanation:
          'Apesar do fechamento da sala de leitura por duas semanas, os livros podem ser devolvidos normalmente no terminal automático ("am Automaten").',
      },
      {
        id: 'goethe-3-q5',
        section: 'language_use',
        prompt: 'Ergänzen Sie den Konjunktiv II: "Wenn ich mehr Zeit ___, würde ich eine dritte Fremdsprache lernen."',
        options: ['habe', 'hätte', 'hatte', 'werde'],
        correctIndex: 1,
        explanation:
          'A condicional irreal no presente usa Konjunktiv II de "haben": "hätte".',
      },
      {
        id: 'goethe-3-q6',
        section: 'language_use',
        prompt: 'Welcher Ausdruck passt? "___ des schlechten Wetters fand das Konzert im Freien statt."',
        options: ['Wegen', 'Trotz', 'Während', 'Aufgrund'],
        correctIndex: 1,
        explanation:
          '"Trotz" + genitivo significa "apesar de", expressando concessão lógica para o concerto ao ar livre com mau tempo.',
      },
    ],
    writingTask: {
      prompt:
        'Schreiben Sie eine formelle Stellungnahme für Ihre Universitätszeitung (ca. 100 Wörter) zum Thema: "Sollten Vorlesungen grundsätzlich aufgezeichnet und online angeboten werden?"',
      minWords: 80,
      rubricCriteria: [
        'Registro formal e vocabulário acadêmico adequado',
        'Argumentos pró e contra bem desenvolvidos',
        'Conclusão clara com recomendação',
      ],
      expectedKeywords: ['Vorlesungen', 'online', 'Flexibilität', 'Austausch', 'Hochschule'],
      modelAnswer:
        'Die Frage, ob Vorlesungen grundsätzlich aufgezeichnet werden sollten, wird an unserer Hochschule intensiv diskutiert. Ein wesentlicher Vorteil besteht darin, dass Studierende mit Nebenjob oder Familie flexibel lernen und schwierige Inhalte wiederholen können. Auf der anderen Seite besteht die Gefahr, dass weniger Studierende in den Hörsaal kommen und der direkte Austausch mit den Dozierenden leidet. Aus diesem Grund plädiere ich dafür, Aufzeichnungen als Ergänzung anzubieten, Präsenzseminare jedoch weiterhin aktiv zu fördern.',
    },
  },
  {
    id: 'goethe-sim-4',
    examTypeId: 'goethe',
    languageCode: 'de',
    simulationNumber: 4,
    title: 'Goethe-Zertifikat B2 — Simulado 4: Gesundheit & Freizeit',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'goethe-4-q1',
        section: 'reading',
        passageTitle: 'Schlafmangel im Alltag',
        passageText:
          'Viele Berufstätige schlafen unter der Woche weniger als sechs Stunden und versuchen, das Defizit am Wochenende auszugleichen. Schlafforscher warnen jedoch, dass ein stark schwankender Schlafrhythmus den Körper zusätzlich belastet. Besser sei es, jeden Tag zu einer ähnlichen Zeit ins Bett zu gehen.',
        prompt: 'Was kritisieren Schlafforscher am Ausschlafen am Wochenende?',
        options: [
          'Es führt zu mehr Appetit.',
          'Der unregelmäßige Rhythmus belastet den Körper zusätzlich.',
          'Man schläft dadurch unter der Woche noch tiefer.',
          'Es ist nur für Jugendliche schädlich.',
        ],
        correctIndex: 1,
        explanation:
          '"Ein stark schwankender Schlafrhythmus den Körper zusätzlich belastet" — a oscilação forte do ritmo de sono sobrecarrega o corpo.',
      },
      {
        id: 'goethe-4-q2',
        section: 'reading',
        passageTitle: 'Schlafmangel im Alltag',
        passageText:
          'Viele Berufstätige schlafen unter der Woche weniger als sechs Stunden und versuchen, das Defizit am Wochenende auszugleichen. Schlafforscher warnen jedoch, dass ein stark schwankender Schlafrhythmus den Körper zusätzlich belastet. Besser sei es, jeden Tag zu einer ähnlichen Zeit ins Bett zu gehen.',
        prompt: 'Was empfehlen die Forscher stattdessen?',
        options: [
          'Am Wochenende gar nicht zu schlafen',
          'Täglich etwa zur gleichen Uhrzeit schlafen zu gehen',
          'Nachmittags drei Stunden zu ruhen',
          'Weniger als sechs Stunden zu schlafen',
        ],
        correctIndex: 1,
        explanation:
          'Eles recomendam ir para a cama todos os dias em um horário semelhante ("jeden Tag zu einer ähnlichen Zeit").',
      },
      {
        id: 'goethe-4-q3',
        section: 'listening',
        audioText:
          'Arzthelferin: Praxis Dr. Klein, guten Tag. Patient: Guten Tag, hier ist Markus Berg. Ich habe am Donnerstag um 10 Uhr einen Termin zur Vorsorge, muss ihn aber leider verschieben. Hätten Sie nächste Woche Dienstagvormittag noch etwas frei? Arzthelferin: Ja, um 9:30 Uhr wäre noch ein Termin frei.',
        audioPlaysLimit: 2,
        prompt: 'Wann findet der neue Termin für Herrn Berg statt?',
        options: [
          'Am Donnerstag um 10:00 Uhr',
          'Am Dienstag um 9:30 Uhr',
          'Am Dienstag um 10:00 Uhr',
          'Am Mittwoch um 9:30 Uhr',
        ],
        correctIndex: 1,
        explanation:
          'A atendente confirma disponibilidade na terça-feira pela manhã às 9:30 ("um 9:30 Uhr wäre noch ein Termin frei").',
      },
      {
        id: 'goethe-4-q4',
        section: 'listening',
        audioText:
          'Trainerin: Bevor wir mit dem Lauftraining beginnen, denkt bitte daran, euch mindestens zehn Minuten aufzuwärmen. Wer direkt schnell losläuft, riskiert Muskelverletzungen. Nach dem Training machen wir gemeinsam Dehnübungen.',
        audioPlaysLimit: 2,
        prompt: 'Was sollen die Teilnehmenden vor dem Laufen tun?',
        options: [
          'Sofort schnell sprinten',
          'Mindestens zehn Minuten aufwärmen',
          'Zuerst Dehnübungen machen',
          'Zwei Liter Wasser trinken',
        ],
        correctIndex: 1,
        explanation:
          'A treinadora orienta aquecer por pelo menos dez minutos ("mindestens zehn Minuten aufzuwärmen") antes da corrida.',
      },
      {
        id: 'goethe-4-q5',
        section: 'language_use',
        prompt: 'Wählen Sie die passende Passivform: "Das neue Sportzentrum ___ im nächsten Monat eröffnet."',
        options: ['wird', 'hat', 'ist', 'wurde'],
        correctIndex: 0,
        explanation:
          '"Im nächsten Monat" indica futuro; o Vorgangspassiv no futuro/presente com valor de futuro usa "wird ... eröffnet".',
      },
      {
        id: 'goethe-4-q6',
        section: 'language_use',
        prompt: 'Welches Verb passt? "Er hat sich fest ___, jeden Morgen dreißig Minuten joggen zu gehen."',
        options: ['vorgestellt', 'vorgenommen', 'vorgeschlagen', 'vorbereitet'],
        correctIndex: 1,
        explanation:
          '"Sich etwas vornehmen" significa fazer o propósito / decidir firmemente fazer algo.',
      },
    ],
    writingTask: {
      prompt:
        'Schreiben Sie einen Beschwerdebrief an ein Fitnessstudio (ca. 90 Wörter). Seit zwei Wochen sind mehrere Duschen defekt und abends gibt es zu wenige freie Geräte. Fordern Sie eine schnelle Lösung.',
      minWords: 75,
      rubricCriteria: [
        'Saudação e encerramento formais de carta/e-mail de reclamação',
        'Descrição objetiva dos dois problemas (chuveiros e aparelhos)',
        'Solicitação educada, porém firme, de providências',
      ],
      expectedKeywords: ['Mitglied', 'defekt', 'Geräte', 'Lösung', 'Mitgliedsbeitrag'],
      modelAnswer:
        'Sehr geehrte Damen und Herren, seit über einem Jahr bin ich zufriedenes Mitglied in Ihrem Fitnessstudio. Leider muss ich Sie heute auf zwei Probleme aufmerksam machen: Seit zwei Wochen sind drei Duschen in der Herrenumkleide defekt. Außerdem sind die Ausdauergeräte abends oft so stark belegt, dass man lange warten muss. Ich bitte Sie herzlich, die Reparatur zeitnah durchführen zu lassen und eine Lösung für die Stoßzeiten zu finden. Mit freundlichen Grüßen, Thomas Weber',
    },
  },

  // =========================================================================
  // TESTDAF (de) — 4 Simulations
  // =========================================================================
  {
    id: 'testdaf-sim-1',
    examTypeId: 'testdaf',
    languageCode: 'de',
    simulationNumber: 1,
    title: 'TestDaF — Simulado 1: Hochschulforschung & KI',
    targetCefr: 'C1',
    durationMinutes: 30,
    questions: [
      {
        id: 'testdaf-1-q1',
        section: 'reading',
        passageTitle: 'Künstliche Intelligenz in der akademischen Lehre',
        passageText:
          'Sprachmodelle verändern derzeit die Art und Weise, wie Hausarbeiten an Hochschulen entstehen. Statt KI-Werkzeuge pauschal zu verbieten, plädieren viele Didaktiker dafür, kritische Quellenprüfung stärker zu gewichten. Studierende müssten lernen, generierte Aussagen fachlich zu überprüfen und methodische Grenzen transparent zu dokumentieren.',
        prompt: 'Welche Haltung vertreten viele Didaktiker laut dem Text?',
        options: [
          'KI-Werkzeuge sollten an Universitäten vollständig verboten werden.',
          'Studierende sollen lernen, KI-Ergebnisse kritisch zu prüfen und zu dokumentieren.',
          'Hausarbeiten sollten komplett abgeschafft werden.',
          'Nur Informatikstudierende dürfen Sprachmodelle nutzen.',
        ],
        correctIndex: 1,
        explanation:
          'Em vez de proibir genericamente, os pedagogos defendem reforçar a checagem crítica de fontes e a documentação transparente dos limites metodológicos.',
      },
      {
        id: 'testdaf-1-q2',
        section: 'reading',
        passageTitle: 'Künstliche Intelligenz in der akademischen Lehre',
        passageText:
          'Sprachmodelle verändern derzeit die Art und Weise, wie Hausarbeiten an Hochschulen entstehen. Statt KI-Werkzeuge pauschal zu verbieten, plädieren viele Didaktiker dafür, kritische Quellenprüfung stärker zu gewichten. Studierende müssten lernen, generierte Aussagen fachlich zu überprüfen und methodische Grenzen transparent zu dokumentieren.',
        prompt: 'Was bedeutet "pauschal verbieten" im Kontext des Textes?',
        options: [
          'Nur für Erstsemester verbieten',
          'Ausnahmslos und ohne Differenzierung verbieten',
          'Gegen eine Gebühr erlauben',
          'Erst nach der Prüfung untersagen',
        ],
        correctIndex: 1,
        explanation:
          '"Pauschal" significa de forma generalizada/indiscriminada, sem diferenciação.',
      },
      {
        id: 'testdaf-1-q3',
        section: 'listening',
        audioText:
          'Professorin Lindner: In unserem Seminar zur empirischen Sozialforschung legen wir großen Wert auf replizierbare Daten. Deshalb laden alle Arbeitsgruppen ihre Codebücher und anonymisierten Datensätze in das Repositorium der Fakultät hoch, bevor sie ihre Ergebnisse vorstellen.',
        audioPlaysLimit: 2,
        prompt: 'Was müssen die Arbeitsgruppen vor der Präsentation tun?',
        options: [
          'Ihre Umfragen persönlich auf Papier abgeben',
          'Codebücher und anonymisierte Datensätze im Repositorium bereitstellen',
          'Eine mündliche Prüfung bei Professorin Lindner ablegen',
          'Die Daten von einer externen Firma auswerten lassen',
        ],
        correctIndex: 1,
        explanation:
          'Os grupos devem fazer upload dos livros de códigos e conjuntos de dados anonimizados no repositório antes da apresentação.',
      },
      {
        id: 'testdaf-1-q4',
        section: 'listening',
        audioText:
          'Student: Entschuldigen Sie, gilt die Anmeldefrist am Freitag auch für das Tutorium in Statistik? Mitarbeiterin im Prüfungsamt: Nein, für Tutorien können Sie sich noch bis nächsten Mittwoch einschreiben. Nur die Modulprüfungen schließen bereits diesen Freitag um Mitternacht.',
        audioPlaysLimit: 2,
        prompt: 'Bis wann kann sich der Student für das Tutorium anmelden?',
        options: [
          'Bis diesen Freitag um Mitternacht',
          'Bis nächsten Mittwoch',
          'Bis Ende des Monats',
          'Eine Anmeldung ist nicht nötig',
        ],
        correctIndex: 1,
        explanation:
          'Para os "Tutorien", a inscrição vai até a próxima quarta-feira ("bis nächsten Mittwoch").',
      },
      {
        id: 'testdaf-1-q5',
        section: 'language_use',
        prompt: 'Ergänzen Sie die Nominalisierung: "___ einer neuen Messmethode konnten präzisere Daten erhoben werden."',
        options: ['Mithilfe', 'Entlang', 'Gegenüber', 'Zufolge'],
        correctIndex: 0,
        explanation:
          '"Mithilfe" + genitivo ("einer neuen Messmethode") significa "com o auxílio de".',
      },
      {
        id: 'testdaf-1-q6',
        section: 'language_use',
        prompt: 'Welche Konjunktion drückt eine Einschränkung aus? "Die Studie liefert wertvolle Hinweise, ___ die Stichprobe relativ klein war."',
        options: ['weshalb', 'obgleich', 'sofern', 'indem'],
        correctIndex: 1,
        explanation:
          '"Obgleich" é sinônimo formal de "obwohl" (embora/apesar de), adequado ao registro acadêmico do TestDaF.',
      },
    ],
    writingTask: {
      prompt:
        'Verfassen Sie eine strukturierte Argumentation (ca. 120 Wörter) für das TestDaF-Training: Diskutieren Sie, ob Studiengebühren für ein Zweitstudium sinnvoll sind. Nennen Sie Argumente für beide Seiten und beziehen Sie begründet Stellung.',
      minWords: 90,
      rubricCriteria: [
        'Introdução contextualizando o tema acadêmico',
        'Comparação equilibrada de argumentos pró e contra',
        'Posicionamento conclusivo claro em registro C1',
      ],
      expectedKeywords: ['Zweitstudium', 'Studiengebühren', 'Finanzierung', 'Chancengleichheit', 'Position'],
      modelAnswer:
        'In der hochschulpolitischen Debatte wird häufig diskutiert, ob für ein Zweitstudium Gebühren erhoben werden sollten. Befürworter argumentieren, dass öffentliche Mittel begrenzt sind und zunächst die Erstausbildung möglichst vieler junger Menschen finanzieren sollten. Kritiker wenden jedoch ein, dass lebenslanges Lernen und berufliche Neuorientierung in einer sich wandelnden Arbeitswelt nicht durch finanzielle Hürden erschwert werden dürfen. Meines Erachtens sollten Gebühren nur dann erhoben werden, wenn bereits ein hohes Einkommen vorliegt, um Chancengleichheit zu wahren.',
    },
  },
  {
    id: 'testdaf-sim-2',
    examTypeId: 'testdaf',
    languageCode: 'de',
    simulationNumber: 2,
    title: 'TestDaF — Simulado 2: Energiewende & Mobilität',
    targetCefr: 'C1',
    durationMinutes: 30,
    questions: [
      {
        id: 'testdaf-2-q1',
        section: 'reading',
        passageTitle: 'Ausbau der Stromnetze für erneuerbare Energien',
        passageText:
          'Obwohl der Anteil von Wind- und Solarenergie an der deutschen Stromerzeugung stetig steigt, hinkt der Ausbau der Übertragungsnetze hinterher. Besonders zwischen dem windreichen Norden und den Industrieregionen im Süden entstehen Engpässe, weshalb Windräder bei starkem Wind zeitweise abgeschaltet werden müssen.',
        prompt: 'Warum müssen Windräder im Norden zeitweise abgeschaltet werden?',
        options: [
          'Weil es im Norden zu wenig Nachfrage nach Industrieprodukten gibt',
          'Weil die Stromnetze für den Transport in den Süden noch nicht ausreichen',
          'Weil Solarenergie im Norden günstiger ist',
          'Weil die Anlagen im Winter einfrieren',
        ],
        correctIndex: 1,
        explanation:
          'Há gargalos na rede de transmissão ("hinkt der Ausbau der Übertragungsnetze hinterher ... entstehen Engpässe") entre o norte e o sul.',
      },
      {
        id: 'testdaf-2-q2',
        section: 'reading',
        passageTitle: 'Ausbau der Stromnetze für erneuerbare Energien',
        passageText:
          'Obwohl der Anteil von Wind- und Solarenergie an der deutschen Stromerzeugung stetig steigt, hinkt der Ausbau der Übertragungsnetze hinterher. Besonders zwischen dem windreichen Norden und den Industrieregionen im Süden entstehen Engpässe, weshalb Windräder bei starkem Wind zeitweise abgeschaltet werden müssen.',
        prompt: 'Was bedeutet "hinkt ... hinterher" in diesem Zusammenhang?',
        options: [
          'Es entwickelt sich deutlich langsamer als nötig.',
          'Es wird vollständig gestoppt.',
          'Es übertrifft alle Erwartungen.',
          'Es ist bereits abgeschlossen.',
        ],
        correctIndex: 0,
        explanation:
          '"Hinterherhinken" significa ficar para trás / avançar mais lentamente que o necessário.',
      },
      {
        id: 'testdaf-2-q3',
        section: 'listening',
        audioText:
          'Experte im Interview: Wasserstoff wird in der Klimadebatte oft als Allheilmittel dargestellt. Für die Stahlindustrie und den Schwerlastverkehr ist grüner Wasserstoff tatsächlich unverzichtbar. Bei Pkw hingegen ist der direkte Einsatz von Batterien energetisch deutlich effizienter.',
        audioPlaysLimit: 2,
        prompt: 'Wofür hält der Experte grünen Wasserstoff für besonders wichtig?',
        options: [
          'Für alle privaten Pkw',
          'Für die Stahlindustrie und den Schwerlastverkehr',
          'Für die Beleuchtung von Wohnungen',
          'Für den Ersatz aller Batterien',
        ],
        correctIndex: 1,
        explanation:
          'Ele afirma que para a indústria siderúrgica ("Stahlindustrie") e transporte pesado ("Schwerlastverkehr") o hidrogênio verde é indispensável.',
      },
      {
        id: 'testdaf-2-q4',
        section: 'listening',
        audioText:
          'Studienberater: Wenn Sie sich für das Stipendium der Umweltstiftung bewerben möchten, achten Sie bitte darauf, dass das Motivationsschreiben maximal zwei Seiten umfasst und Sie ein Gutachten einer Hochschullehrkraft beifügen.',
        audioPlaysLimit: 2,
        prompt: 'Welche Unterlage wird zusätzlich zum Motivationsschreiben verlangt?',
        options: [
          'Ein Praktikumsvertrag',
          'Ein Gutachten einer Hochschullehrkraft',
          'Ein Nachweis über ehrenamtliche Arbeit im Ausland',
          'Ein Sprachzertifikat auf Niveau A2',
        ],
        correctIndex: 1,
        explanation:
          'É exigido um parecer/carta de recomendação de um docente universitário ("ein Gutachten einer Hochschullehrkraft").',
      },
      {
        id: 'testdaf-2-q5',
        section: 'language_use',
        prompt: 'Ergänzen Sie die Partizipialkonstruktion: "Die ___ Maßnahmen zeigen bereits erste Wirkung."',
        options: ['ergriffenen', 'ergreifend', 'ergriffen', 'ergreifenden'],
        correctIndex: 0,
        explanation:
          'Particípio II com valor passivo concluído ("as medidas tomadas"): "die ergriffenen Maßnahmen".',
      },
      {
        id: 'testdaf-2-q6',
        section: 'language_use',
        prompt: 'Welches Wort passt in den wissenschaftlichen Kontext? "Die Daten lassen den ___ zu, dass der Verbrauch gesunken ist."',
        options: ['Schluss', 'Anfang', 'Zweifel', 'Wunsch'],
        correctIndex: 0,
        explanation:
          '"Den Schluss zulassen, dass..." é uma colocação acadêmica padrão ("permitir concluir que...").',
      },
    ],
    writingTask: {
      prompt:
        'Beschreiben Sie kurz (ca. 110 Wörter) mögliche Ursachen und Folgen des steigenden Energiebedarfs von Rechenzentren und schlagen Sie eine nachhaltige Lösung vor.',
      minWords: 85,
      rubricCriteria: [
        'Clareza na relação causa-efeito',
        'Uso de vocabulário técnico-científico preciso',
        'Proposta viável de mitigação sustentável',
      ],
      expectedKeywords: ['Rechenzentren', 'Energiebedarf', 'Abwärme', 'erneuerbare', 'Effizienz'],
      modelAnswer:
        'Durch die zunehmende Nutzung von Cloud-Diensten und künstlicher Intelligenz steigt der Stromverbrauch großer Rechenzentren weltweit rasant an. Eine zentrale Folge ist die stärkere Belastung lokaler Stromnetze sowie ein erhöhter Wasserbedarf für die Kühlung der Server. Um diese Entwicklung nachhaltig zu gestalten, sollten Rechenzentren konsequent mit erneuerbaren Energien betrieben werden. Zudem bietet es sich an, die entstehende Abwärme in städtische Fernwärmenetze einzuspeisen, sodass Energie doppelt genutzt wird.',
    },
  },
  {
    id: 'testdaf-sim-3',
    examTypeId: 'testdaf',
    languageCode: 'de',
    simulationNumber: 3,
    title: 'TestDaF — Simulado 3: Demografie & Arbeitsmarkt',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'testdaf-3-q1',
        section: 'reading',
        passageTitle: 'Fachkräftemangel im Gesundheitswesen',
        passageText:
          'Krankenhäuser und Pflegeeinrichtungen suchen händeringend nach qualifiziertem Personal. Neben besseren Gehältern fordern Berufsverbände vor allem verlässlichere Dienstpläne und weniger bürokratische Dokumentationspflichten, damit Pflegekräfte wieder mehr Zeit für die Patientinnen und Patienten haben.',
        prompt: 'Was fordern Berufsverbände neben höheren Gehältern?',
        options: [
          'Längere Nachtschichten',
          'Verlässlichere Dienstpläne und weniger Bürokratie',
          'Den Verzicht auf digitale Patientenakten',
          'Kürzere Ausbildungszeiten ohne Praxis',
        ],
        correctIndex: 1,
        explanation:
          'As associações pedem escalas mais confiáveis ("verlässlichere Dienstpläne") e menos obrigações burocráticas.',
      },
      {
        id: 'testdaf-3-q2',
        section: 'reading',
        passageTitle: 'Fachkräftemangel im Gesundheitswesen',
        passageText:
          'Krankenhäuser und Pflegeeinrichtungen suchen händeringend nach qualifiziertem Personal. Neben besseren Gehältern fordern Berufsverbände vor allem verlässlichere Dienstpläne und weniger bürokratische Dokumentationspflichten, damit Pflegekräfte wieder mehr Zeit für die Patientinnen und Patienten haben.',
        prompt: 'Welches Ziel verfolgen diese Forderungen laut dem letzten Nebensatz?',
        options: [
          'Dass Pflegekräfte mehr Zeit für die Betreuung der Patienten haben',
          'Dass Krankenhäuser schneller privatisiert werden',
          'Dass Patienten kürzer im Krankenhaus bleiben müssen',
          'Dass weniger Ärzte eingestellt werden',
        ],
        correctIndex: 0,
        explanation:
          '"Damit Pflegekräfte wieder mehr Zeit für die Patientinnen und Patienten haben."',
      },
      {
        id: 'testdaf-3-q3',
        section: 'listening',
        audioText:
          'Dozent: Bei der Auswertung von Arbeitsmarktstatistiken müssen Sie zwischen der absoluten Beschäftigtenzahl und den geleisteten Arbeitsstunden unterscheiden. Oft steigt die Zahl der Erwerbstätigen, während die durchschnittliche Wochenarbeitszeit durch mehr Teilzeitstellen sinkt.',
        audioPlaysLimit: 2,
        prompt: 'Worauf weist der Dozent bei Arbeitsmarktstatistiken hin?',
        options: [
          'Teilzeitstellen werden in Statistiken nicht gezählt.',
          'Man muss zwischen Personenanzahl und geleisteten Arbeitsstunden unterscheiden.',
          'Die Wochenarbeitszeit steigt immer gemeinsam mit der Beschäftigtenzahl.',
          'Arbeitsmarktstatistiken sind grundsätzlich unzuverlässig.',
        ],
        correctIndex: 1,
        explanation:
          'Ele alerta para a diferença entre o número absoluto de empregados e as horas trabalhadas.',
      },
      {
        id: 'testdaf-3-q4',
        section: 'listening',
        audioText:
          'Karriereberatung: Für internationale Absolventinnen und Absolventen bieten wir nächsten Donnerstag einen Workshop zum Thema Bewerbungsgespräch in Deutschland an. Bringen Sie bitte Ihren aktuellen Lebenslauf auf Deutsch mit, damit wir ihn gemeinsam durchgehen können.',
        audioPlaysLimit: 2,
        prompt: 'Was sollen die Teilnehmenden zum Workshop mitbringen?',
        options: [
          'Ihr Abschlusszeugnis im Original',
          'Ihren aktuellen Lebenslauf auf Deutsch',
          'Ein Empfehlungsschreiben des Arbeitgebers',
          'Einen Laptop mit Präsentation',
        ],
        correctIndex: 1,
        explanation:
          'O orientador pede para levarem o currículo atual em alemão ("aktuellen Lebenslauf auf Deutsch").',
      },
      {
        id: 'testdaf-3-q5',
        section: 'language_use',
        prompt: 'Ergänzen Sie: "Je besser die Arbeitsbedingungen sind, ___ leichter lassen sich Fachkräfte gewinnen."',
        options: ['desto', 'als', 'wie', 'sondern'],
        correctIndex: 0,
        explanation:
          'A estrutura comparativa proporcional é "je ... desto" (quanto mais..., mais...).',
      },
      {
        id: 'testdaf-3-q6',
        section: 'language_use',
        prompt: 'Welcher Ausdruck passt? "Der demografische Wandel ___ Unternehmen vor neue Herausforderungen."',
        options: ['stellt', 'legt', 'bringt', 'macht'],
        correctIndex: 0,
        explanation:
          'A colocação fixa é "jemanden vor Herausforderungen stellen" (colocar alguém diante de desafios).',
      },
    ],
    writingTask: {
      prompt:
        'Nehmen Sie Stellung (ca. 110 Wörter) zur Frage, wie Unternehmen ältere Mitarbeitende länger im Berufsleben halten können.',
      minWords: 85,
      rubricCriteria: [
        'Apresentação de ao menos duas medidas concretas',
        'Conexão lógica entre medidas e benefícios para a empresa',
        'Estilo formal e vocabulário preciso',
      ],
      expectedKeywords: ['Erfahrung', 'Weiterbildung', 'Arbeitszeit', 'Generationen', 'Gesundheit'],
      modelAnswer:
        'Angesichts des demografischen Wandels wird es für Unternehmen immer wichtiger, ältere Beschäftigte im Betrieb zu halten. Eine zentrale Maßnahme sind flexible Arbeitszeitmodelle, etwa ein gleitender Übergang in den Ruhestand, der Belastungen reduziert. Darüber hinaus sollten regelmäßige Weiterbildungen nicht nur jüngeren Teams vorbehalten bleiben, sondern alle Altersgruppen einbeziehen. Auf diese Weise profitieren Betriebe weiterhin vom wertvollen Erfahrungswissen langjähriger Mitarbeitender und fördern den Wissensaustausch zwischen den Generationen.',
    },
  },
  {
    id: 'testdaf-sim-4',
    examTypeId: 'testdaf',
    languageCode: 'de',
    simulationNumber: 4,
    title: 'TestDaF — Simulado 4: Wissenschaftskommunikation',
    targetCefr: 'C1',
    durationMinutes: 30,
    questions: [
      {
        id: 'testdaf-4-q1',
        section: 'reading',
        passageTitle: 'Verständliche Wissenschaft in den Medien',
        passageText:
          'Wissenschaftliche Ergebnisse sind oft komplex und enthalten statistische Unsicherheiten. Wenn Medien Studien verkürzt als endgültige Wahrheit darstellen, entsteht in der Öffentlichkeit leicht Verwirrung, sobald spätere Untersuchungen zu abweichenden Ergebnissen kommen. Eine gute Berichterstattung erklärt deshalb auch die Methode.',
        prompt: 'Warum entsteht laut Text manchmal Verwirrung in der Öffentlichkeit?',
        options: [
          'Weil Wissenschaftler keine Interviews geben möchten',
          'Weil Medien vorläufige Studien oft verkürzt als endgültige Wahrheit präsentieren',
          'Weil statistische Methoden immer fehlerhaft sind',
          'Weil die Bevölkerung kein Interesse an Forschung hat',
        ],
        correctIndex: 1,
        explanation:
          'A confusão surge quando a mídia apresenta estudos de forma simplificada como verdade definitiva, ignorando incertezas.',
      },
      {
        id: 'testdaf-4-q2',
        section: 'reading',
        passageTitle: 'Verständliche Wissenschaft in den Medien',
        passageText:
          'Wissenschaftliche Ergebnisse sind oft komplex und enthalten statistische Unsicherheiten. Wenn Medien Studien verkürzt als endgültige Wahrheit darstellen, entsteht in der Öffentlichkeit leicht Verwirrung, sobald spätere Untersuchungen zu abweichenden Ergebnissen kommen. Eine gute Berichterstattung erklärt deshalb auch die Methode.',
        prompt: 'Was zeichnet laut Text eine gute Wissenschaftsberichterstattung aus?',
        options: [
          'Sie verzichtet auf Fachbegriffe und Zahlen.',
          'Sie erklärt auch die verwendete Methode.',
          'Sie berichtet nur über medizinische Themen.',
          'Sie veröffentlicht ausschließlich positive Ergebnisse.',
        ],
        correctIndex: 1,
        explanation:
          'A última frase afirma: "Eine gute Berichterstattung erklärt deshalb auch die Methode."',
      },
      {
        id: 'testdaf-4-q3',
        section: 'listening',
        audioText:
          'Redakteurin: Herr Professor Hartmann, wie können junge Forschende lernen, ihre Arbeit einem breiten Publikum zu erklären? Prof. Hartmann: Formate wie Science Slams sind dafür ideal. Wer ein komplexes Thema in zehn Minuten verständlich und humorvoll präsentiert, merkt sofort, wo Fachjargon im Weg steht.',
        audioPlaysLimit: 2,
        prompt: 'Welchen Vorteil sieht Prof. Hartmann in Science Slams?',
        options: [
          'Man erhält dort direkt Forschungsgelder.',
          'Man erkennt schnell, wo unnötiger Fachjargon das Verständnis erschwert.',
          'Man darf dort nur auf Englisch vortragen.',
          'Man ersetzt damit wissenschaftliche Publikationen.',
        ],
        correctIndex: 1,
        explanation:
          'Apresentar em dez minutos ajuda a perceber onde o jargão técnico ("Fachjargon") atrapalha a compreensão.',
      },
      {
        id: 'testdaf-4-q4',
        section: 'listening',
        audioText:
          'Veranstaltungshinweis: Die Ringvorlesung "Klima und Gesellschaft" findet heute wegen einer technischen Störung im Hörsaal 2 nicht vor Ort statt, sondern wird live über das Lernportal gestreamt. Der Link ist ab 17:45 Uhr freigeschaltet.',
        audioPlaysLimit: 2,
        prompt: 'Wie können Studierende heute an der Ringvorlesung teilnehmen?',
        options: [
          'Im Hörsaal 2 ab 17:45 Uhr',
          'Per Livestream über das Lernportal',
          'Gar nicht, die Vorlesung fällt aus',
          'Durch eine Aufzeichnung nächste Woche',
        ],
        correctIndex: 1,
        explanation:
          'Por falha técnica na sala, a palestra será transmitida ao vivo ("live über das Lernportal gestreamt").',
      },
      {
        id: 'testdaf-4-q5',
        section: 'language_use',
        prompt: 'Ergänzen Sie die indirekte Rede im Konjunktiv I: "Die Autorin betont, die Studie ___ erst ein erster Schritt."',
        options: ['sei', 'ist', 'war', 'wäre'],
        correctIndex: 0,
        explanation:
          'No discurso indireto formal em textos acadêmicos, usa-se o Konjunktiv I: "sei".',
      },
      {
        id: 'testdaf-4-q6',
        section: 'language_use',
        prompt: 'Welcher Konnektor passt? "Die Hypothese ließ sich bestätigen; ___, bedarf es weiterer Langzeitstudien."',
        options: ['allerdings', 'deshalb', 'folglich', 'denn'],
        correctIndex: 0,
        explanation:
          '"Allerdings" (no entanto/contudo) introduz a ressalva necessária após confirmar a hipótese.',
      },
    ],
    writingTask: {
      prompt:
        'Erörtern Sie (ca. 115 Wörter), warum Hochschulen den offenen Zugang zu Forschungsergebnissen (Open Access) fördern sollten und welche Hürden dabei bestehen.',
      minWords: 85,
      rubricCriteria: [
        'Explicação clara do conceito e benefícios do Open Access',
        'Identificação realista de obstáculos (custos, editoras)',
        'Coesão argumentativa de nível C1',
      ],
      expectedKeywords: ['Open Access', 'Forschung', 'Veröffentlichung', 'Kosten', 'Öffentlichkeit'],
      modelAnswer:
        'Der freie Zugang zu wissenschaftlichen Publikationen gewinnt zunehmend an Bedeutung. Da Grundlagenforschung größtenteils aus öffentlichen Mitteln finanziert wird, ist es folgerichtig, dass Ergebnisse sowohl Fachleuten als auch der interessierten Öffentlichkeit kostenfrei zur Verfügung stehen. Dies beschleunigt zudem den internationalen Wissensaustausch. Eine wesentliche Hürde stellen jedoch die hohen Publikationsgebühren dar, die von manchen Verlagen verlangt werden und kleinere Institute belasten. Hochschulen sollten daher eigene Publikationsfonds ausbauen, um Open Access nachhaltig zu unterstützen.',
    },
  },

  // =========================================================================
  // STAATSEXAMEN NT2 (nl) — 4 Simulations
  // =========================================================================
  {
    id: 'nt2-sim-1',
    examTypeId: 'nt2',
    languageCode: 'nl',
    simulationNumber: 1,
    title: 'Staatsexamen NT2 — Simulado 1: Wonen & Buurt',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'nt2-1-q1',
        section: 'reading',
        passageTitle: 'Samen de binnentuin onderhouden',
        passageText:
          'De bewoners van het appartementencomplex aan de Lindenlaan hebben besloten om samen de gemeenschappelijke binnentuin op te knappen. Elke eerste zaterdag van de maand drinken ze eerst koffie en verdelen ze de taken, zoals onkruid wieden en nieuwe bloemen planten. De woningcorporatie betaalt het gereedschap.',
        prompt: 'Wie betaalt het tuingereedschap voor de binnentuin?',
        options: [
          'De bewoners zelf',
          'De gemeente',
          'De woningcorporatie',
          'Een lokale bloemenwinkel',
        ],
        correctIndex: 2,
        explanation:
          'A última frase indica: "De woningcorporatie betaalt het gereedschap" (a associação de habitação paga as ferramentas).',
      },
      {
        id: 'nt2-1-q2',
        section: 'reading',
        passageTitle: 'Samen de binnentuin onderhouden',
        passageText:
          'De bewoners van het appartementencomplex aan de Lindenlaan hebben besloten om samen de gemeenschappelijke binnentuin op te knappen. Elke eerste zaterdag van de maand drinken ze eerst koffie en verdelen ze de taken, zoals onkruid wieden en nieuwe bloemen planten. De woningcorporatie betaalt het gereedschap.',
        prompt: 'Wanneer werken de bewoners samen in de tuin?',
        options: [
          'Elke zondagmiddag',
          'Op de eerste zaterdag van de maand',
          'Twee keer per week na het werk',
          'Alleen in de lente',
        ],
        correctIndex: 1,
        explanation:
          '"Elke eerste zaterdag van de maand" significa todo primeiro sábado do mês.',
      },
      {
        id: 'nt2-1-q3',
        section: 'listening',
        audioText:
          'Huisartsassistent: Goedemorgen, praktijk De Vries. Patiënt: Dag, met Sara Bakker. Ik heb last van mijn knie en wil graag een afspraak maken. Assistent: Ik heb morgenochtend om kwart over tien nog een plek vrij, of vrijdagmiddag om twee uur. Wat komt u beter uit?',
        audioPlaysLimit: 2,
        prompt: 'Wanneer kan Sara Bakker volgens de assistent langskomen?',
        options: [
          'Vandaag om twee uur',
          'Morgenochtend om 10:15 of vrijdagmiddag om 14:00',
          'Alleen volgende week maandag',
          'Morgenmiddag om kwart voor tien',
        ],
        correctIndex: 1,
        explanation:
          '"Morgenochtend om kwart over tien" (10:15) ou "vrijdagmiddag om twee uur" (14:00).',
      },
      {
        id: 'nt2-1-q4',
        section: 'listening',
        audioText:
          'Omroepbericht in de trein: Beste reizigers, over enkele minuten komen wij aan op station Utrecht Centraal. Reizigers richting Arnhem kunnen overstappen op spoor 11. Vergeet bij het uitstappen niet uw spullen mee te nemen.',
        audioPlaysLimit: 2,
        prompt: 'Vanaf welk spoor vertrekt de aansluitende trein naar Arnhem?',
        options: ['Spoor 4', 'Spoor 7', 'Spoor 11', 'Spoor 14'],
        correctIndex: 2,
        explanation:
          'O anúncio informa baldeação para Arnhem na plataforma 11 ("op spoor 11").',
      },
      {
        id: 'nt2-1-q5',
        section: 'language_use',
        prompt: 'Kies de juiste woordvolgorde: "Ik blijf thuis, omdat ___."',
        options: [
          'ik ben vandaag ziek',
          'ik vandaag ziek ben',
          'ben ik vandaag ziek',
          'vandaag ziek ik ben',
        ],
        correctIndex: 1,
        explanation:
          'Após a conjunção subordinativa "omdat", o verbo conjugado vai para o final da oração ("ik vandaag ziek ben").',
      },
      {
        id: 'nt2-1-q6',
        section: 'language_use',
        prompt: 'Welk lidwoord hoort bij "huis"? "We hebben ___ nieuw huis gekocht."',
        options: ['de', 'het', 'een', 'die'],
        correctIndex: 2,
        explanation:
          'Antes de substantivo indefinido singular ("novo casa" / uma casa nova), usa-se o artigo indefinido "een".',
      },
    ],
    writingTask: {
      prompt:
        'Schrijf een e-mail aan uw buurman (ca. 75 woorden). U geeft volgende week zaterdag een verjaardagsfeestje van 19:00 tot 23:00 uur. Waarschuw hem vriendelijk voor eventueel geluid en nodig hem uit om ook langs te komen.',
      minWords: 60,
      rubricCriteria: [
        'Saudação educada para vizinho',
        'Informação clara sobre data e horário da festa',
        'Convite amigável e contato em caso de incômodo',
      ],
      expectedKeywords: ['verjaardag', 'zaterdag', 'muziek', 'geluid', 'welkom'],
      modelAnswer:
        'Beste buurman, volgende week zaterdag vier ik mijn verjaardag bij mij thuis. Tussen 19:00 en 23:00 uur komen er wat vrienden langs en staat er waarschijnlijk muziek aan. Ik probeer het geluid natuurlijk zo beperkt mogelijk te houden. Mocht u er toch last van hebben, stuur mij dan gerust een berichtje. U bent trouwens ook van harte welkom om een drankje te komen doen! Groeten, Sam',
    },
  },
  {
    id: 'nt2-sim-2',
    examTypeId: 'nt2',
    languageCode: 'nl',
    simulationNumber: 2,
    title: 'Staatsexamen NT2 — Simulado 2: Werk & Sollicitatie',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'nt2-2-q1',
        section: 'reading',
        passageTitle: 'Vrijwilligerswerk als opstap naar een baan',
        passageText:
          'Voor nieuwkomers kan vrijwilligerswerk een waardevolle manier zijn om de Nederlandse taal sneller te leren en een professioneel netwerk op te bouwen. Werkgevers waarderen de inzet vaak, omdat het laat zien dat iemand actief wil meedoen in de samenleving en praktijkervaring opdoet.',
        prompt: 'Welk voordeel van vrijwilligerswerk wordt in de tekst genoemd?',
        options: [
          'Het levert direct een hoog salaris op.',
          'Je leert de taal sneller en bouwt een netwerk op.',
          'Je hoeft daarna geen sollicitatiebrief meer te schrijven.',
          'Het vervangt alle diploma’s.',
        ],
        correctIndex: 1,
        explanation:
          'O texto cita aprender o idioma mais rápido e construir uma rede profissional ("een professioneel netwerk op te bouwen").',
      },
      {
        id: 'nt2-2-q2',
        section: 'reading',
        passageTitle: 'Vrijwilligerswerk als opstap naar een baan',
        passageText:
          'Voor nieuwkomers kan vrijwilligerswerk een waardevolle manier zijn om de Nederlandse taal sneller te leren en een professioneel netwerk op te bouwen. Werkgevers waarderen de inzet vaak, omdat het laat zien dat iemand actief wil meedoen in de samenleving en praktijkervaring opdoet.',
        prompt: 'Waarom waarderen werkgevers vrijwilligerswerk volgens de tekst?',
        options: [
          'Omdat vrijwilligers minder vakantiedagen vragen',
          'Omdat het actieve deelname en praktijkervaring toont',
          'Omdat de overheid het verplicht stelt',
          'Omdat vrijwilligers alleen in het weekend werken',
        ],
        correctIndex: 1,
        explanation:
          '"Omdat het laat zien dat iemand actief wil meedoen in de samenleving en praktijkervaring opdoet."',
      },
      {
        id: 'nt2-2-q3',
        section: 'listening',
        audioText:
          'HR-medewerker: Bedankt voor uw sollicitatie naar de functie van administratief medewerker. We vonden uw ervaring erg interessant en willen u graag uitnodigen voor een kennismakingsgesprek aanstaande dinsdag om 11:00 uur op ons kantoor in Rotterdam.',
        audioPlaysLimit: 2,
        prompt: 'Wat is het doel van dit bericht?',
        options: [
          'De sollicitant afwijzen',
          'Een afspraak maken voor een kennismakingsgesprek',
          'Vragen om een kopie van het paspoort',
          'Het salaris onderhandelen',
        ],
        correctIndex: 1,
        explanation:
          'O RH convida o candidato para uma entrevista inicial ("uitnodigen voor een kennismakingsgesprek").',
      },
      {
        id: 'nt2-2-q4',
        section: 'listening',
        audioText:
          'Collega: Hé Daan, heb je de notulen van de vergadering al verstuurd? Daan: Nog niet, ik wacht nog op de cijfers van de financiële afdeling. Zodra ik die binnen heb, stuur ik het hele document rond.',
        audioPlaysLimit: 2,
        prompt: 'Waarom heeft Daan de notulen nog niet verstuurd?',
        options: [
          'Hij was ziek.',
          'Hij wacht nog op cijfers van de financiële afdeling.',
          'De vergadering gaat niet door.',
          'Zijn computer werkt niet.',
        ],
        correctIndex: 1,
        explanation:
          'Daan diz: "ik wacht nog op de cijfers van de financiële afdeling" (ainda aguardo os números do departamento financeiro).',
      },
      {
        id: 'nt2-2-q5',
        section: 'language_use',
        prompt: 'Vul het juiste voegwoord in: "___ het hard regent, fiets ik toch naar mijn werk."',
        options: ['Hoewel', 'Omdat', 'Want', 'Zodat'],
        correctIndex: 0,
        explanation:
          '"Hoewel" (embora) expressa concessão, combinando com "toch" na oração principal.',
      },
      {
        id: 'nt2-2-q6',
        section: 'language_use',
        prompt: 'Kies de juiste verleden tijd (voltooid deelwoord): "Gisteren heb ik een belangrijke e-mail ___."',
        options: ['gestuurd', 'sturen', 'stuurde', 'gesturen'],
        correctIndex: 0,
        explanation:
          'O particípio passado de "sturen" é "gestuurd".',
      },
    ],
    writingTask: {
      prompt:
        'Schrijf een korte sollicitatiemail (ca. 85 woorden) voor de functie van klantenservice-medewerker. Vermeld uw ervaring, uw sterke punten en uw beschikbaarheid.',
      minWords: 70,
      rubricCriteria: [
        'Saudação e encerramento formais ("Geachte...", "Met vriendelijke groet")',
        'Menção clara da vaga e motivação',
        'Experiência e disponibilidade objetivas',
      ],
      expectedKeywords: ['sollicitatie', 'ervaring', 'klanten', 'beschikbaar', 'gesprek'],
      modelAnswer:
        'Geachte heer/mevrouw, met veel belangstelling reageer ik op de vacature voor klantenservice-medewerker. De afgelopen twee jaar heb ik gewerkt in een winkel waar ik dagelijks klanten adviseerde en problemen snel oploste. Ik ben geduldig, communicatief sterk en spreek goed Nederlands en Engels. Vanaf volgende maand ben ik voor 32 uur per week beschikbaar. Graag licht ik mijn motivatie toe in een persoonlijk gesprek. Met vriendelijke groet, Kim de Jong',
    },
  },
  {
    id: 'nt2-sim-3',
    examTypeId: 'nt2',
    languageCode: 'nl',
    simulationNumber: 3,
    title: 'Staatsexamen NT2 — Simulado 3: Onderwijs & Taal',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'nt2-3-q1',
        section: 'reading',
        passageTitle: 'Tweetalig onderwijs op de basisschool',
        passageText:
          'Steeds meer basisscholen bieden lessen in twee talen aan. Kinderen krijgen bijvoorbeeld gymnastiek of tekenen in het Engels. Onderzoek laat zien dat dit de ontwikkeling van het Nederlands niet belemmert, zolang leerlingen thuis en op school voldoende Nederlandse boeken blijven lezen.',
        prompt: 'Wat blijkt uit onderzoek over tweetalig onderwijs op de basisschool?',
        options: [
          'Kinderen vergeten daardoor het Nederlands.',
          'Het belemmert het Nederlands niet, mits er genoeg Nederlands wordt gelezen.',
          'Alleen oudere leerlingen kunnen twee talen leren.',
          'Gymnastiek moet altijd in het Nederlands gegeven worden.',
        ],
        correctIndex: 1,
        explanation:
          'A pesquisa mostra que não prejudica o holandês ("belemmert ... niet"), desde que haja leitura suficiente em holandês.',
      },
      {
        id: 'nt2-3-q2',
        section: 'reading',
        passageTitle: 'Tweetalig onderwijs op de basisschool',
        passageText:
          'Steeds meer basisscholen bieden lessen in twee talen aan. Kinderen krijgen bijvoorbeeld gymnastiek of tekenen in het Engels. Onderzoek laat zien dat dit de ontwikkeling van het Nederlands niet belemmert, zolang leerlingen thuis en op school voldoende Nederlandse boeken blijven lezen.',
        prompt: 'Welke vakken worden in de tekst als voorbeeld genoemd voor Engelse les?',
        options: [
          'Rekenen en geschiedenis',
          'Gymnastiek en tekenen',
          'Aardrijkskunde en muziek',
          'Biologie en schrijven',
        ],
        correctIndex: 1,
        explanation:
          'O texto cita "gymnastiek of tekenen in het Engels" (educação física ou desenho).',
      },
      {
        id: 'nt2-3-q3',
        section: 'listening',
        audioText:
          'Docent: Beste cursisten, volgende week vrijdag is er geen les vanwege een studiedag van de docenten. De inleverdatum voor het schrijfverslag blijft echter wel vrijdag, dus stuur uw tekst voor vijf uur per e-mail op.',
        audioPlaysLimit: 2,
        prompt: 'Wat moeten de cursisten volgende week vrijdag doen?',
        options: [
          'Naar school komen voor de normale les',
          'Het schrijfverslag voor 17:00 uur mailen',
          'De studiedag van de docenten bijwonen',
          'Het verslag een week later inleveren',
        ],
        correctIndex: 1,
        explanation:
          'Não há aula presencial, mas o prazo de entrega do relatório ("schrijfverslag") continua sendo sexta-feira antes das 17h por e-mail.',
      },
      {
        id: 'nt2-3-q4',
        section: 'listening',
        audioText:
          'Bibliotheekmedewerker: Met een gratis jeugdabonnement mogen kinderen tot achttien jaar twintig boeken tegelijk lenen voor een periode van vier weken. Als ze een boek te laat inleveren, betalen ze sinds dit jaar geen boete meer.',
        audioPlaysLimit: 2,
        prompt: 'Wat is er veranderd voor kinderen die een boek te laat inleveren?',
        options: [
          'Ze mogen minder boeken lenen.',
          'Ze betalen geen boete meer.',
          'Het abonnement is niet meer gratis.',
          'De leenperiode is verkort naar één week.',
        ],
        correctIndex: 1,
        explanation:
          '"Betalen ze sinds dit jaar geen boete meer" — não pagam mais multa desde este ano.',
      },
      {
        id: 'nt2-3-q5',
        section: 'language_use',
        prompt: 'Vul "er" of "daar" correct in: "Ik heb veel over dat boek gehoord, maar ik heb ___ nog niets van gelezen."',
        options: ['er', 'het', 'dat', 'wat'],
        correctIndex: 0,
        explanation:
          'A combinação "er ... van" substitui "van dat boek".',
      },
      {
        id: 'nt2-3-q6',
        section: 'language_use',
        prompt: 'Welke zin is grammaticaal juist?',
        options: [
          'Hij probeert om elke dag tien nieuwe woorden te leren.',
          'Hij probeert elke dag tien nieuwe woorden leren.',
          'Hij probeert te elke dag tien nieuwe woorden leren.',
          'Hij probeert voor elke dag tien nieuwe woorden te leren.',
        ],
        correctIndex: 0,
        explanation:
          'Com "proberen", a construção infinitiva correta usa "(om) ... te + infinitief".',
      },
    ],
    writingTask: {
      prompt:
        'Schrijf een korte reactie (ca. 85 woorden) voor een schoolnieuwsbrief over het nut van een schoolbibliotheek. Geef twee redenen waarom lezen op school belangrijk is.',
      minWords: 70,
      rubricCriteria: [
        'Apresentação clara de duas razões distintas',
        'Tom positivo e adequado a um boletim escolar',
        'Uso correto de conectores (ten eerste, bovendien)',
      ],
      expectedKeywords: ['lezen', 'bibliotheek', 'woordenschat', 'plezier', 'leerlingen'],
      modelAnswer:
        'Een goede schoolbibliotheek is onmisbaar voor alle leerlingen. Ten eerste vergroot regelmatig lezen de woordenschat, wat helpt bij elk schoolvak, van rekenen tot geschiedenis. Ten tweede ontdekken kinderen door zelf boeken te kiezen dat lezen ook ontspannend en leuk kan zijn. Als de school elke dag vijftien minuten vrij lezen inplant, krijgen alle leerlingen de kans om een vaste leesgewoonte op te bouwen.',
    },
  },
  {
    id: 'nt2-sim-4',
    examTypeId: 'nt2',
    languageCode: 'nl',
    simulationNumber: 4,
    title: 'Staatsexamen NT2 — Simulado 4: Gezondheid & Duurzaamheid',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'nt2-4-q1',
        section: 'reading',
        passageTitle: 'Minder voedsel verspillen in de supermarkt',
        passageText:
          'Supermarkten verkopen steeds vaker producten die bijna over de datum zijn met een flinke korting. Daarnaast geven sommige winkels onverkocht brood en groente aan lokale voedselbanken. Consumenten kunnen zelf ook bijdragen door vooraf een boodschappenlijstje te maken en niet met een lege maag boodschappen te doen.',
        prompt: 'Hoe kunnen consumenten volgens de tekst zelf voedselverspilling beperken?',
        options: [
          'Door alleen online te bestellen',
          'Door een boodschappenlijstje te maken en niet hongerig te winkelen',
          'Door producten zonder korting te kopen',
          'Door minder groente te eten',
        ],
        correctIndex: 1,
        explanation:
          'O texto sugere fazer lista de compras antes e não ir às compras de estômago vazio ("niet met een lege maag").',
      },
      {
        id: 'nt2-4-q2',
        section: 'reading',
        passageTitle: 'Minder voedsel verspillen in de supermarkt',
        passageText:
          'Supermarkten verkopen steeds vaker producten die bijna over de datum zijn met een flinke korting. Daarnaast geven sommige winkels onverkocht brood en groente aan lokale voedselbanken. Consumenten kunnen zelf ook bijdragen door vooraf een boodschappenlijstje te maken en niet met een lege maag boodschappen te doen.',
        prompt: 'Wat gebeurt er in sommige winkels met onverkocht brood?',
        options: [
          'Het wordt weggegooid.',
          'Het gaat naar lokale voedselbanken.',
          'Het wordt gebruikt als dierenvoer.',
          'Het wordt ingevroren voor volgend jaar.',
        ],
        correctIndex: 1,
        explanation:
          'Algumas lojas doam pão e vegetais não vendidos aos bancos de alimentos locais ("lokale voedselbanken").',
      },
      {
        id: 'nt2-4-q3',
        section: 'listening',
        audioText:
          'Fysiotherapeut: Als u de hele dag achter een computer werkt, is het verstandig om elk uur even op te staan en vijf minuten te bewegen. Zo voorkomt u rug- en nekklachten. Ook helpt het om het beeldscherm op ooghoogte te zetten.',
        audioPlaysLimit: 2,
        prompt: 'Welk advies geeft de fysiotherapeut voor het beeldscherm?',
        options: [
          'Het scherm iets lager zetten',
          'Het scherm op ooghoogte plaatsen',
          'Het scherm na elk uur uitschakelen',
          'Een kleiner scherm gebruiken',
        ],
        correctIndex: 1,
        explanation:
          'Ele recomenda colocar o monitor na altura dos olhos ("op ooghoogte te zetten").',
      },
      {
        id: 'nt2-4-q4',
        section: 'listening',
        audioText:
          'Gemeentevoorlichter: Vanaf maandag worden de ondergrondse containers voor glas en papier in de Kerkstraat vervangen. Tijdens de werkzaamheden, die drie dagen duren, kunt u terecht bij de containers op het Marktplein.',
        audioPlaysLimit: 2,
        prompt: 'Waar moeten bewoners drie dagen lang hun glas en papier weggooien?',
        options: [
          'In de gewone kliko thuis',
          'Op het Marktplein',
          'In de Kerkstraat bij de supermarkt',
          'Ze moeten het een week bewaren',
        ],
        correctIndex: 1,
        explanation:
          'Durante os três dias de obras, os moradores devem usar os contêineres na Marktplein.',
      },
      {
        id: 'nt2-4-q5',
        section: 'language_use',
        prompt: 'Kies de juiste vorm: "Het is belangrijk dat we zuinig met energie ___."',
        options: ['omgaan', 'omgingen', 'omgegaan', 'gaan om'],
        correctIndex: 0,
        explanation:
          'Na oração subordinada com "dat", o verbo separável "omgaan" permanece unido no final: "omgaan".',
      },
      {
        id: 'nt2-4-q6',
        section: 'language_use',
        prompt: 'Welk voorzetsel past? "Hij heeft veel ervaring ___ het organiseren van evenementen."',
        options: ['met', 'op', 'aan', 'voor'],
        correctIndex: 0,
        explanation:
          'A expressão padrão é "ervaring hebben met iets" (ter experiência com algo).',
      },
    ],
    writingTask: {
      prompt:
        'Schrijf een adviesbericht (ca. 85 woorden) aan een vriend die gezonder wil leven. Geef drie praktische tips over voeding, beweging en slaap.',
      minWords: 70,
      rubricCriteria: [
        'Tom amigável e encorajador',
        'Cobertura dos três eixos (alimentação, movimento, sono)',
        'Estrutura clara e vocabulário natural em holandês',
      ],
      expectedKeywords: ['gezond', 'bewegen', 'groente', 'slapen', 'water'],
      modelAnswer:
        'Hoi Tom, wat goed dat je gezonder wilt gaan leven! Mijn eerste tip is om elke dag minstens dertig minuten te wandelen of te fietsen, bijvoorbeeld in de lunchpauze. Probeer daarnaast vaker water te drinken in plaats van frisdrank en bij elke maaltijd wat groente te eten. Tot slot is een vast slaapritme heel belangrijk: leg je telefoon een uur voor het slapengaan weg. Succes, je kunt het! Groetjes, Lisa',
    },
  },

  // =========================================================================
  // TAALTOETS (af) — 4 Simulations
  // =========================================================================
  {
    id: 'taaltoets-sim-1',
    examTypeId: 'taaltoets',
    languageCode: 'af',
    simulationNumber: 1,
    title: 'Taaltoets Afrikaans — Simulado 1: Gemeenskap & Werk',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'taaltoets-1-q1',
        section: 'reading',
        passageTitle: 'Buurtmark op Saterdagoggende',
        passageText:
          'Elke Saterdagoggend word die parkeerterrein agter die stadsaal in ’n lewendige buurtmark omskep. Plaaslike boere verkoop vars groente, vrugte en tuisgebakte brood, terwyl jong kunstenaars handgemaakte juwele uitstal. Die toegang is gratis en gesinne kom graag saam ontbyt eet.',
        prompt: 'Waar word die buurtmark gehou?',
        options: [
          'Binne-in die stadsaal',
          'Op die parkeerterrein agter die stadsaal',
          'By die plaaslike skool',
          'Langs die treinstasie',
        ],
        correctIndex: 1,
        explanation:
          'O texto diz: "die parkeerterrein agter die stadsaal" (o estacionamento atrás da prefeitura).',
      },
      {
        id: 'taaltoets-1-q2',
        section: 'reading',
        passageTitle: 'Buurtmark op Saterdagoggende',
        passageText:
          'Elke Saterdagoggend word die parkeerterrein agter die stadsaal in ’n lewendige buurtmark omskep. Plaaslike boere verkoop vars groente, vrugte en tuisgebakte brood, terwyl jong kunstenaars handgemaakte juwele uitstal. Die toegang is gratis en gesinne kom graag saam ontbyt eet.',
        prompt: 'Wat verkoop die jong kunstenaars by die mark?',
        options: [
          'Tuisgebakte brood',
          'Vars groente',
          'Handgemaakte juwele',
          'Warm koffie',
        ],
        correctIndex: 2,
        explanation:
          '"Jong kunstenaars handgemaakte juwele uitstal" (jovens artistas expõem joias artesanais).',
      },
      {
        id: 'taaltoets-1-q3',
        section: 'listening',
        audioText:
          'Kantooraankondiging: Goeiemôre almal. Onthou asseblief dat die watertoevoer in die gebou vanmiddag tussen een-uur en drie-uur afgeskakel sal wees weens herstelwerk aan die pype. Maak seker julle vul vooraf ’n bottel water.',
        audioPlaysLimit: 2,
        prompt: 'Hoe lank sal die water vanmiddag afgeskakel wees?',
        options: ['Een uur', 'Twee uur', 'Drie uur', 'Die hele dag'],
        correctIndex: 1,
        explanation:
          'Entre 13:00 e 15:00 ("tussen een-uur en drie-uur"), ou seja, por duas horas.',
      },
      {
        id: 'taaltoets-1-q4',
        section: 'listening',
        audioText:
          'Pieter: Hallo Annelize, kan jy my help om hierdie verslag na te lees voor ek dit aan die bestuurder stuur? Annelize: Sekerlik, Pieter. Los dit op my lessenaar, dan kyk ek na middagete daarna.',
        audioPlaysLimit: 2,
        prompt: 'Wanneer gaan Annelize die verslag lees?',
        options: [
          'Dadelik voor tee',
          'Na middagete',
          'Môreoggend',
          'Na die vergadering met die bestuurder',
        ],
        correctIndex: 1,
        explanation:
          'Annelize diz: "dan kyk ek na middagete daarna" (então eu dou uma olhada depois do almoço).',
      },
      {
        id: 'taaltoets-1-q5',
        section: 'language_use',
        prompt: 'Kies die korrekte ontkenning in Afrikaans: "Ek het ___ tyd om vandag te kom ___."',
        options: ['nie ... nie', 'geen ... nie', 'nooit ... geen', 'niks ... nie'],
        correctIndex: 1,
        explanation:
          'Diante de substantivo sem artigo ("tyd"), usa-se "geen ... nie" na dupla negação do africâner.',
      },
      {
        id: 'taaltoets-1-q6',
        section: 'language_use',
        prompt: 'Voltooi die verlede tyd: "Gister ___ ons ’n interessante boek in die biblioteek gelees."',
        options: ['het', 'is', 'was', 'sal'],
        correctIndex: 0,
        explanation:
          'Em africâner, o pretérito perfeito ativo forma-se com "het + ge-...".',
      },
    ],
    writingTask: {
      prompt:
        'Skryf ’n kort e-pos aan ’n vriend (ongeveer 75 woorde) oor jou nuwe werk of kursus. Vertel wat jy elke dag doen en wat jy die meeste daarvan geniet.',
      minWords: 60,
      rubricCriteria: [
        'Saudação e tom informal adequado',
        'Descrição clara das atividades diárias',
        'Uso correto da ordem verbal e dupla negação quando aplicável',
      ],
      expectedKeywords: ['werk', 'kollegas', 'elke dag', 'geniet', 'groete'],
      modelAnswer:
        'Beste Johan, hoe gaan dit met jou? Ek wil jou graag vertel van my nuwe werk by die ontwerpateljee. Elke oggend begin ons met ’n kort vergadering om die projekte te beplan. Daarna werk ek saam met my span aan webwerwe vir plaaslike besighede. Wat ek die meeste geniet, is die vriendelike kollegas en dat ek elke dag iets nuuts leer. Kom kuier gerus een aand! Groete, Marike',
    },
  },
  {
    id: 'taaltoets-sim-2',
    examTypeId: 'taaltoets',
    languageCode: 'af',
    simulationNumber: 2,
    title: 'Taaltoets Afrikaans — Simulado 2: Natuur & Toerisme',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'taaltoets-2-q1',
        section: 'reading',
        passageTitle: 'Stap in die berge',
        passageText:
          'Die nuwe staproete in die natuurreservaat is twaalf kilometer lank en geskik vir stappers met gemiddelde fiksheid. Besoekers word versoek om op die gemerkte paadjies te bly ten einde die skaars fynbos te beskerm. Daar is geen winkels langs die roete nie, so neem genoeg water saam.',
        prompt: 'Hoekom moet stappers op die gemerkte paadjies bly?',
        options: [
          'Omdat daar wilde diere op die ander paadjies is',
          'Om die skaars fynbos te beskerm',
          'Omdat die ander paadjies modderig is',
          'Om vinniger by die winkels uit te kom',
        ],
        correctIndex: 1,
        explanation:
          '"Ten einde die skaars fynbos te beskerm" (a fim de proteger a vegetação fynbos rara).',
      },
      {
        id: 'taaltoets-2-q2',
        section: 'reading',
        passageTitle: 'Stap in die berge',
        passageText:
          'Die nuwe staproete in die natuurreservaat is twaalf kilometer lank en geskik vir stappers met gemiddelde fiksheid. Besoekers word versoek om op die gemerkte paadjies te bly ten einde die skaars fynbos te beskerm. Daar is geen winkels langs die roete nie, so neem genoeg water saam.',
        prompt: 'Wat word besoekers aangeraai om saam te neem?',
        options: [
          '’n Kombers',
          'Genoeg water',
          'Kontant vir die winkels',
          '’n Bergfiets',
        ],
        correctIndex: 1,
        explanation:
          'Não há lojas na trilha, portanto "neem genoeg water saam" (leve água suficiente).',
      },
      {
        id: 'taaltoets-2-q3',
        section: 'listening',
        audioText:
          'Toergids: Welkom by die botaniese tuin. Ons begeleide toer duur vyf-en-veertig minute en eindig by die teekamer. As dit begin reën, skuif ons na die binnenshuise kweekhuis waar u tropiese plante kan sien.',
        audioPlaysLimit: 2,
        prompt: 'Wat gebeur as dit begin reën tydens die toer?',
        options: [
          'Die toer word gekanselleer.',
          'Die groep gaan na die binnenshuise kweekhuis.',
          'Almal kry gratis sambrele.',
          'Die toer eindig dadelik by die uitgang.',
        ],
        correctIndex: 1,
        explanation:
          'Se chover, o grupo vai para a estufa coberta ("binnenshuise kweekhuis").',
      },
      {
        id: 'taaltoets-2-q4',
        section: 'listening',
        audioText:
          'Ontvangsdame: Goeiemiddag, u het ’n kamer vir drie nagte bespreek. Ontbyt word tussen halfsewe en halfnege bedien, en die swembad is tot nege-uur saans oop.',
        audioPlaysLimit: 2,
        prompt: 'Tot hoe laat kan gaste ontbyt eet?',
        options: ['06:30', '07:30', '08:30', '09:00'],
        correctIndex: 2,
        explanation:
          'Em africâner, "halfnege" equivale a 8:30 (meia hora antes das 9).',
      },
      {
        id: 'taaltoets-2-q5',
        section: 'language_use',
        prompt: 'Kies die meervoud van "stad": "Baie ___ in Suid-Afrika het pragtige parke."',
        options: ['stads', 'stede', 'stadte', 'stade'],
        correctIndex: 1,
        explanation:
          'O plural irregular de "stad" é "stede".',
      },
      {
        id: 'taaltoets-2-q6',
        section: 'language_use',
        prompt: 'Vul die korrekte voorsetsel in: "Sy stel baie belang ___ fotografie."',
        options: ['in', 'op', 'vir', 'met'],
        correctIndex: 0,
        explanation:
          'A expressão em africâner é "belang stel in iets" (interessar-se por algo).',
      },
    ],
    writingTask: {
      prompt:
        'Skryf ’n kort resensie (ongeveer 75 woorde) oor ’n plek of natuurreservaat wat jy besoek het. Noem wat jy daar gesien het en hoekom jy dit aanbeveel.',
      minWords: 60,
      rubricCriteria: [
        'Descrição vívida do local visitado',
        'Recomendação clara para outros leitores',
        'Uso adequado do tempo passado ("het ... gesien")',
      ],
      expectedKeywords: ['besoek', 'natuur', 'uitsig', 'aanbeveel', 'rustig'],
      modelAnswer:
        'Verlede naweek het ek die Kogelberg-natuurreservaat besoek en dit was ’n onvergeetlike ervaring. Die berge was bedek met kleurvolle veldblomme en ons het selfs ’n paar klein bokke langs die rivier gesien. Die paadjies is baie skoon en goed gemerk. Ek beveel hierdie plek sterk aan vir almal wat van rustige staproetes en vars berglug hou.',
    },
  },
  {
    id: 'taaltoets-sim-3',
    examTypeId: 'taaltoets',
    languageCode: 'af',
    simulationNumber: 3,
    title: 'Taaltoets Afrikaans — Simulado 3: Onderwys & Tegnologie',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'taaltoets-3-q1',
        section: 'reading',
        passageTitle: 'Rekenaarkode in die skoolkurrikulum',
        passageText:
          'Verskeie hoërskole stel nou programmering as ’n keusevak bekend. Onderwysers merk op dat leerlinge nie net tegniese vaardighede aanleer nie, maar ook leer hoe om komplekse probleme stap vir stap op te los. Tog bly die beskikbaarheid van vinnige internet in landelike gebiede ’n uitdaging.',
        prompt: 'Watter ekstra voordeel van programmering noem die onderwysers?',
        options: [
          'Leerlinge kry vinniger internet by die huis.',
          'Hulle leer om komplekse probleme stapsgewys op te los.',
          'Hulle hoef nie meer wiskunde te neem nie.',
          'Alle skole kry nuwe skootrekenaars.',
        ],
        correctIndex: 1,
        explanation:
          'Os professores observam que os alunos aprendem a resolver problemas complexos passo a passo ("stap vir stap op te los").',
      },
      {
        id: 'taaltoets-3-q2',
        section: 'reading',
        passageTitle: 'Rekenaarkode in die skoolkurrikulum',
        passageText:
          'Verskeie hoërskole stel nou programmering as ’n keusevak bekend. Onderwysers merk op dat leerlinge nie net tegniese vaardighede aanleer nie, maar ook leer hoe om komplekse probleme stap vir stap op te los. Tog bly die beskikbaarheid van vinnige internet in landelike gebiede ’n uitdaging.',
        prompt: 'Watter probleem word in landelike gebiede ervaar?',
        options: [
          'Daar is ’n tekort aan leerlinge.',
          'Vinnige internet is nie oral beskikbaar nie.',
          'Onderwysers wil nie die vak gee nie.',
          'Die vak is te maklik.',
        ],
        correctIndex: 1,
        explanation:
          '"Die beskikbaarheid van vinnige internet in landelike gebiede ’n uitdaging" — a disponibilidade de internet rápida em áreas rurais continua um desafio.',
      },
      {
        id: 'taaltoets-3-q3',
        section: 'listening',
        audioText:
          'Dosent: Onthou asseblief om julle opstelle teen Donderdag om vyfuur elektronies in te dien. Laat indienings sonder ’n geldige mediese sertifikaat sal vyf persent per dag verloor.',
        audioPlaysLimit: 2,
        prompt: 'Wat gebeur as ’n student die opstel laat indien sonder ’n mediese sertifikaat?',
        options: [
          'Die opstel word glad nie aanvaar nie.',
          'Vyf persent word per dag afgetrek.',
          'Die student moet die kursus herhaal.',
          'Niks gebeur nie.',
        ],
        correctIndex: 1,
        explanation:
          'Entregas atrasadas sem atestado médico perdem 5% ao dia ("sal vyf persent per dag verloor").',
      },
      {
        id: 'taaltoets-3-q4',
        section: 'listening',
        audioText:
          'Tegniese ondersteuning: As die skerm vries, hou die aan-knoppie vir tien sekondes in om die rekenaar te herbegin. Moenie die kragkabel uit die muur trek nie, want dit kan data beskadig.',
        audioPlaysLimit: 2,
        prompt: 'Wat moet die gebruiker NIE doen nie?',
        options: [
          'Die aan-knoppie inhou',
          'Die rekenaar herbegin',
          'Die kragkabel uit die muur trek',
          'Tien sekondes wag',
        ],
        correctIndex: 2,
        explanation:
          '"Moenie die kragkabel uit die muur trek nie" — não puxe o cabo de força da tomada.',
      },
      {
        id: 'taaltoets-3-q5',
        section: 'language_use',
        prompt: 'Kies die korrekte lydende vorm (passief): "Die nuwe biblioteek ___ volgende jaar geopen."',
        options: ['sal ... word', 'het ... geword', 'is ... word', 'was ... geword'],
        correctIndex: 0,
        explanation:
          'O futuro da voz passiva em africâner usa "sal ... word" + particípio ("sal volgende jaar geopen word").',
      },
      {
        id: 'taaltoets-3-q6',
        section: 'language_use',
        prompt: 'Welke voegwoord pas? "___ dit gereën het, het die sportdag voortgegaan."',
        options: ['Alhoewel', 'Omdat', 'Sodat', 'Terwyl'],
        correctIndex: 0,
        explanation:
          '"Alhoewel" (embora) expressa concessão.',
      },
    ],
    writingTask: {
      prompt:
        'Skryf ’n kort meningstuk (ongeveer 85 woorde) oor die gebruik van slimfone in die klaskamer. Noem een voordeel en een nadeel, en gee jou aanbeveling.',
      minWords: 70,
      rubricCriteria: [
        'Argumentos equilibrados (pró e contra)',
        'Recomendação prática para escolas',
        'Ortografia correta (incluindo apóstrofo ’n e dupla negação)',
      ],
      expectedKeywords: ['slimfone', 'klaskamer', 'aandag', 'navorsing', 'reëls'],
      modelAnswer:
        'Die gebruik van slimfone in die klaskamer het voor- en nadele. Aan die een kant kan leerlinge vinnig woorde opsoek of aanlyn vasvrae doen, wat die les interaktief maak. Aan die ander kant kan sosiale media maklik aandag aftrek en konsentrasie verminder. Ek beveel dus aan dat skole duidelike reëls instel: slimfone bly in die skooltas, behalwe wanneer die onderwyser toestemming gee vir ’n spesifieke opdrag.',
    },
  },
  {
    id: 'taaltoets-sim-4',
    examTypeId: 'taaltoets',
    languageCode: 'af',
    simulationNumber: 4,
    title: 'Taaltoets Afrikaans — Simulado 4: Kultuur & Media',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'taaltoets-4-q1',
        section: 'reading',
        passageTitle: 'Die opkoms van Afrikaanse podsendings',
        passageText:
          'Podsendings (podcasts) het die afgelope paar jaar geweldig gewild geword onder Afrikaanssprekendes. Luisteraars waardeer die verskeidenheid temas, van geskiedenis en misdaad tot boerdery en alledaagse humor. Omdat mense dit tydens hul oggendrit kan luister, bereik inhoudskeppers ’n nuwe gehoor.',
        prompt: 'Hoekom bereik podsendings ’n nuwe gehoor volgens die teks?',
        options: [
          'Omdat dit gratis op televisie uitgesaai word',
          'Omdat mense dit tydens hul oggendrit kan luister',
          'Omdat daar net oor humor gepraat word',
          'Omdat dit korter as een minuut is',
        ],
        correctIndex: 1,
        explanation:
          '"Omdat mense dit tydens hul oggendrit kan luister" (porque as pessoas podem ouvir durante o trajeto matinal).',
      },
      {
        id: 'taaltoets-4-q2',
        section: 'reading',
        passageTitle: 'Die opkoms van Afrikaanse podsendings',
        passageText:
          'Podsendings (podcasts) het die afgelope paar jaar geweldig gewild geword onder Afrikaanssprekendes. Luisteraars waardeer die verskeidenheid temas, van geskiedenis en misdaad tot boerdery en alledaagse humor. Omdat mense dit tydens hul oggendrit kan luister, bereik inhoudskeppers ’n nuwe gehoor.',
        prompt: 'Wat waardeer luisteraars veral aan hierdie podsendings?',
        options: [
          'Die verskeidenheid temas',
          'Die hoë intekengeld',
          'Die gebrek aan advertensies',
          'Dat dit net in Kaapstad opgeneem word',
        ],
        correctIndex: 0,
        explanation:
          '"Luisteraars waardeer die verskeidenheid temas" (os ouvintes apreciam a variedade de temas).',
      },
      {
        id: 'taaltoets-4-q3',
        section: 'listening',
        audioText:
          'Radio-aanbieder: Ons volgende gas is die skrywer Karin Jacobs, wie se nuwe roman verlede week verskyn het. Die boek handel oor ’n familie wat ná twintig jaar terugkeer na ’n klein kusdorpie.',
        audioPlaysLimit: 2,
        prompt: 'Waaroor gaan Karin Jacobs se nuwe roman?',
        options: [
          'Oor ’n skeepsramp op see',
          'Oor ’n familie wat na ’n klein kusdorpie terugkeer',
          'Oor ’n joernalis in Johannesburg',
          'Oor die geskiedenis van radio',
        ],
        correctIndex: 1,
        explanation:
          'O livro trata de uma família que retorna após vinte anos a uma pequena cidade costeira ("klein kusdorpie").',
      },
      {
        id: 'taaltoets-4-q4',
        section: 'listening',
        audioText:
          'Teaterbestuurder: Dames en here, die opvoering begin oor vyf minute. Skakel asseblief u selfone heeltemal af. Fotografie met of sonder flits word nie toegelaat nie.',
        audioPlaysLimit: 2,
        prompt: 'Wat is verbode tydens die opvoering?',
        options: [
          'Om laat te arriveer',
          'Om foto’s te neem',
          'Om water te drink',
          'Om die program te lees',
        ],
        correctIndex: 1,
        explanation:
          '"Fotografie met of sonder flits word nie toegelaat nie" — fotografar com ou sem flash não é permitido.',
      },
      {
        id: 'taaltoets-4-q5',
        section: 'language_use',
        prompt: 'Kies die korrekte betreklike voornaamwoord: "Die skrywer ___ boek ek gelees het, woon in Stellenbosch."',
        options: ['wat se', 'wie se', 'wie', 'wat'],
        correctIndex: 1,
        explanation:
          'Para posse referindo-se a pessoa ("cujo livro"), usa-se "wie se" em africâner.',
      },
      {
        id: 'taaltoets-4-q6',
        section: 'language_use',
        prompt: 'Watter woord pas die beste? "Die artikel gee ’n goeie ___ van die huidige situasie."',
        options: ['oorsig', 'uitsig', 'insig', 'gesig'],
        correctIndex: 0,
        explanation:
          '"’n Oorsig van" significa "uma visão geral / panorama de".',
      },
    ],
    writingTask: {
      prompt:
        'Skryf ’n brief aan ’n plaaslike koerant (ongeveer 85 woorde) waarin jy voorstel dat die munisipaliteit meer kulturele geleenthede vir jongmense organiseer.',
      minWords: 70,
      rubricCriteria: [
        'Formato formal de carta ao editor',
        'Justificativa clara da importância cultural para jovens',
        'Sugestões concretas (música, teatro, oficinas)',
      ],
      expectedKeywords: ['munisipaliteit', 'jongmense', 'kultuur', 'geleenthede', 'gemeenskap'],
      modelAnswer:
        'Geagte Redakteur, ek skryf hierdie brief omdat daar tans te min kulturele geleenthede vir jongmense in ons dorp is. Baie tieners het belangstelling in musiek, teater en kuns, maar het nie toegang tot werkswinkels of bekostigbare konserte nie. Ek stel voor dat die munisipaliteit een aand per maand ’n gratis kultuurprogram by die gemeenskapsentrum aanbied. Dit sal jong talent aanmoedig en ons hele gemeenskap versterk. Die uwe, Thabo Mokoena',
    },
  },

  // =========================================================================
  // SWEDEX (sv) — 4 Simulations
  // =========================================================================
  {
    id: 'swedex-sim-1',
    examTypeId: 'swedex',
    languageCode: 'sv',
    simulationNumber: 1,
    title: 'Swedex — Simulado 1: Vardag & Fika',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'swedex-1-q1',
        section: 'reading',
        passageTitle: 'Fikapausen på jobbet',
        passageText:
          'I Sverige är fikapausen en viktig del av arbetsdagen. Klockan tio på förmiddagen och klockan tre på eftermiddagen samlas kollegor i personalrummet för att dricka kaffe och äta en kanelbulle. Det handlar inte bara om att vila, utan också om att prata informellt och stärka sammanhållningen i gruppen.',
        prompt: 'Varför är fikapausen viktig på svenska arbetsplatser enligt texten?',
        options: [
          'För att chefen ska ge nya order',
          'För att vila och stärka sammanhållningen mellan kollegor',
          'För att alla måste äta lunch samtidigt',
          'För att spara el på kontoret',
        ],
        correctIndex: 1,
        explanation:
          'O texto diz que se trata não só de descansar, mas também de conversar informalmente e fortalecer a união do grupo ("stärka sammanhållningen").',
      },
      {
        id: 'swedex-1-q2',
        section: 'reading',
        passageTitle: 'Fikapausen på jobbet',
        passageText:
          'I Sverige är fikapausen en viktig del av arbetsdagen. Klockan tio på förmiddagen och klockan tre på eftermiddagen samlas kollegor i personalrummet för att dricka kaffe och äta en kanelbulle. Det handlar inte bara om att vila, utan också om att prata informellt och stärka sammanhållningen i gruppen.',
        prompt: 'När brukar kollegorna fika enligt texten?',
        options: [
          'Klockan åtta och klockan tolv',
          'Klockan tio och klockan tre',
          'Bara på fredagar',
          'Efter arbetsdagens slut',
        ],
        correctIndex: 1,
        explanation:
          '"Klockan tio på förmiddagen och klockan tre på eftermiddagen" (às 10h e às 15h).',
      },
      {
        id: 'swedex-1-q3',
        section: 'listening',
        audioText:
          'Apotekare: Hej! Hur kan jag hjälpa dig? Kund: Hej, jag har haft ont i halsen sedan i går och lite feber. Apotekare: Då rekommenderar jag halstabletter och att du dricker mycket varmt te. Om febern inte går ner efter tre dagar bör du kontakta vårdcentralen.',
        audioPlaysLimit: 2,
        prompt: 'När bör kunden kontakta vårdcentralen?',
        options: [
          'Omedelbart i dag',
          'Om febern inte går ner efter tre dagar',
          'Efter en vecka',
          'Bara om hostan försvinner',
        ],
        correctIndex: 1,
        explanation:
          'O farmacêutico orienta procurar o posto de saúde ("vårdcentralen") se a febre não baixar após três dias.',
      },
      {
        id: 'swedex-1-q4',
        section: 'listening',
        audioText:
          'Meddelande på bussen: Nästa hållplats är Centralstationen. Där kan du byta till pendeltåg mot Uppsala samt flygbussarna mot Arlanda.',
        audioPlaysLimit: 2,
        prompt: 'Vad kan passagerarna byta till vid Centralstationen?',
        options: [
          'Tunnelbana och båt',
          'Pendeltåg mot Uppsala och flygbussar mot Arlanda',
          'Spårvagn mot Malmö',
          'Enbart lokala bussar',
        ],
        correctIndex: 1,
        explanation:
          'É possível fazer baldeação para o trem suburbano para Uppsala e ônibus para o aeroporto de Arlanda.',
      },
      {
        id: 'swedex-1-q5',
        section: 'language_use',
        prompt: 'Välj rätt ordföljd (V2-regeln): "I går ___ jag en ny cykel."',
        options: ['köpte', 'jag köpte', 'har köpt', 'köpa'],
        correctIndex: 0,
        explanation:
          'Pela regra V2 em sueco, quando a frase começa com advérbio de tempo ("I går"), o verbo conjugado vem em segundo lugar ("köpte jag").',
      },
      {
        id: 'swedex-1-q6',
        section: 'language_use',
        prompt: 'Vilket ord passar? "Kan du hjälpa mig ___ att bära de här lådorna?"',
        options: ['med', 'på', 'om', 'från'],
        correctIndex: 0,
        explanation:
          'A regência padrão é "hjälpa någon med att + infinitiv".',
      },
    ],
    writingTask: {
      prompt:
        'Skriv ett mejl till din svenska vän Erik (ca 75 ord). Berätta att du ska resa till Göteborg nästa helg och fråga om ni kan träffas för en fika på lördag.',
      minWords: 60,
      rubricCriteria: [
        'Saudação e despedida naturais em sueco',
        'Informação clara sobre a viagem e proposta de horário/local',
        'Uso correto da regra V2 e tempos verbais',
      ],
      expectedKeywords: ['Göteborg', 'helgen', 'fika', 'lördag', 'träffas'],
      modelAnswer:
        'Hej Erik! Hur mår du? Jag skriver för att berätta att jag ska åka till Göteborg nästa helg för att besöka min syster. På lördag eftermiddag har jag några timmar ledigt, så jag undrar om du vill träffas för en fika i centrum? Klockan två passar bra för mig, men jag är flexibel. Hör av dig om du har tid! Hälsningar, Sofia',
    },
  },
  {
    id: 'swedex-sim-2',
    examTypeId: 'swedex',
    languageCode: 'sv',
    simulationNumber: 2,
    title: 'Swedex — Simulado 2: Bostad & Miljö',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'swedex-2-q1',
        section: 'reading',
        passageTitle: 'Sopsortering i bostadsrättsföreningen',
        passageText:
          'Från och med nästa månad får vår gård ett nytt miljörum med separata kärl för matavfall, plast, papper och glas. Styrelsen påminner om att stora möbler och elektronik inte får lämnas i miljörummet, utan måste köras till kommunens återvinningscentral.',
        prompt: 'Var ska man lämna gamla möbler och elektronik?',
        options: [
          'I det nya miljörummet på gården',
          'Utanför porten på måndagar',
          'På kommunens återvinningscentral',
          'I kärlet för plast och papper',
        ],
        correctIndex: 2,
        explanation:
          'Móveis grandes e eletrônicos devem ser levados ao centro de reciclagem municipal ("kommunens återvinningscentral").',
      },
      {
        id: 'swedex-2-q2',
        section: 'reading',
        passageTitle: 'Sopsortering i bostadsrättsföreningen',
        passageText:
          'Från och med nästa månad får vår gård ett nytt miljörum med separata kärl för matavfall, plast, papper och glas. Styrelsen påminner om att stora möbler och elektronik inte får lämnas i miljörummet, utan måste köras till kommunens återvinningscentral.',
        prompt: 'Vad finns i det nya miljörummet?',
        options: [
          'Cykelparkering och tvättstuga',
          'Separata kärl för matavfall, plast, papper och glas',
          'Ett gemensamt förråd för möbler',
          'En container för elektronik',
        ],
        correctIndex: 1,
        explanation:
          'O texto lista recipientes separados para resíduos orgânicos, plástico, papel e vidro.',
      },
      {
        id: 'swedex-2-q3',
        section: 'listening',
        audioText:
          'Hyresvärd: Hej, det gäller din felanmälan om elementet i vardagsrummet. Vår reparatör kan komma på torsdag mellan klockan nio och tolv. Om du inte är hemma går det bra att lämna extranyckeln i brevlådan på kontoret.',
        audioPlaysLimit: 2,
        prompt: 'Vad kan hyresgästen göra om hen inte är hemma på torsdag?',
        options: [
          'Avboka besöket helt',
          'Lämna extranyckeln i kontorets brevlåda',
          'Be grannen laga elementet',
          'Vänta till nästa månad',
        ],
        correctIndex: 1,
        explanation:
          'Pode deixar a chave reserva na caixa de correio do escritório ("lämna extranyckeln i brevlådan på kontoret").',
      },
      {
        id: 'swedex-2-q4',
        section: 'listening',
        audioText:
          'Kundtjänst: Välkommen till elbolaget. Vårt billigaste elavtal har rörligt pris, vilket passar dig som kan tvätta och ladda bilen på natten när elen är billigare.',
        audioPlaysLimit: 2,
        prompt: 'När är elen billigare enligt kundtjänsten?',
        options: ['På morgonen', 'Mitt på dagen', 'På natten', 'Under eftermiddagen'],
        correctIndex: 2,
        explanation:
          '"På natten när elen är billigare" (à noite, quando a eletricidade é mais barata).',
      },
      {
        id: 'swedex-2-q5',
        section: 'language_use',
        prompt: 'Välj rätt form av adjektivet: "Vi letar efter en ___ lägenhet nära parken."',
        options: ['stora', 'stort', 'stor', 'störst'],
        correctIndex: 2,
        explanation:
          '"Lägenhet" é palavra "en" (utrum) no singular indefinido, portanto o adjetivo fica na forma básica: "stor".',
      },
      {
        id: 'swedex-2-q6',
        section: 'language_use',
        prompt: 'Vilken bisatsinledare passar? "Jag tar med mig paraply ___ det skulle börja regna."',
        options: ['om', 'att', 'trots att', 'därför'],
        correctIndex: 0,
        explanation:
          '"Om" (se / caso) introduz a oração condicional.',
      },
    ],
    writingTask: {
      prompt:
        'Skriv en kort annons eller ett meddelande till grannarna (ca 75 ord) om att du söker en begagnad cykel i gott skick. Ange vad du behöver cykeln till och hur de kan kontakta dig.',
      minWords: 60,
      rubricCriteria: [
        'Clareza no pedido e nas características desejadas',
        'Tom educado de quadro de avisos comunitário',
        'Uso correto de concordância en/ett',
      ],
      expectedKeywords: ['cykel', 'begagnad', 'skick', 'pendla', 'telefonnummer'],
      modelAnswer:
        'Hej grannar! Jag har precis börjat ett nytt jobb i centrum och letar efter en begagnad dam- eller herrcykel i gott skick som jag kan pendla med varje dag. Den får gärna ha fungerande lampor och lås. Har du en cykel som står oanvänd i förrådet och vill sälja den till ett rimligt pris? Skicka gärna ett sms till 070-123 45 67. Tack på förhand! Hälsningar, Anna i lägenhet 14',
    },
  },
  {
    id: 'swedex-sim-3',
    examTypeId: 'swedex',
    languageCode: 'sv',
    simulationNumber: 3,
    title: 'Swedex — Simulado 3: Arbetsliv & Studier',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'swedex-3-q1',
        section: 'reading',
        passageTitle: 'Livslångt lärande på arbetsmarknaden',
        passageText:
          'Tekniken utvecklas snabbt, vilket innebär att många yrkesverksamma behöver vidareutbilda sig flera gånger under sitt arbetsliv. Flera universitet erbjuder numera korta onlinekurser på kvällstid som går att kombinera med ett heltidsjobb. Arbetsgivare som uppmuntrar detta behåller ofta sin personal längre.',
        prompt: 'Varför erbjuder universiteten korta onlinekurser på kvällstid?',
        options: [
          'För att ersätta alla vanliga kandidatprogram',
          'Så att man kan studera samtidigt som man jobbar heltid',
          'För att minska antalet lärare',
          'För att studenterna inte vill läsa böcker',
        ],
        correctIndex: 1,
        explanation:
          '"Som går att kombinera med ett heltidsjobb" — para que possam ser combinados com um emprego em tempo integral.',
      },
      {
        id: 'swedex-3-q2',
        section: 'reading',
        passageTitle: 'Livslångt lärande på arbetsmarknaden',
        passageText:
          'Tekniken utvecklas snabbt, vilket innebär att många yrkesverksamma behöver vidareutbilda sig flera gånger under sitt arbetsliv. Flera universitet erbjuder numera korta onlinekurser på kvällstid som går att kombinera med ett heltidsjobb. Arbetsgivare som uppmuntrar detta behåller ofta sin personal längre.',
        prompt: 'Vad vinner arbetsgivare som uppmuntrar vidareutbildning?',
        options: [
          'Lägre skatter',
          'De behåller ofta sin personal längre',
          'De behöver inte ge semester',
          'De får gratis programvara',
        ],
        correctIndex: 1,
        explanation:
          'A última frase afirma: "behåller ofta sin personal längre" (retêm sua equipe por mais tempo).',
      },
      {
        id: 'swedex-3-q3',
        section: 'listening',
        audioText:
          'Chef: På måndagsmötet vill jag att vi går igenom tidsplanen för höstens projekt. Se till att alla i teamet har uppdaterat sina uppgifter i systemet senast fredag klockan fyra.',
        audioPlaysLimit: 2,
        prompt: 'När ska uppgifterna senast vara uppdaterade i systemet?',
        options: [
          'Måndag morgon',
          'Fredag klockan 16:00',
          'Söndag kväll',
          'Efter måndagsmötet',
        ],
        correctIndex: 1,
        explanation:
          '"Senast fredag klockan fyra" (no máximo sexta-feira às 16h).',
      },
      {
        id: 'swedex-3-q4',
        section: 'listening',
        audioText:
          'Studievägledare: Om du vill söka till högskolan till hösten måste din ansökan vara inskickad före den femtonde april. Glöm inte att ladda upp dina översatta betyg i pdf-format.',
        audioPlaysLimit: 2,
        prompt: 'Vad måste bifogas ansökan?',
        options: [
          'Ett rekommendationsbrev på papper',
          'Översatta betyg i pdf-format',
          'Ett arbetsintyg från förra året',
          'En videointervju',
        ],
        correctIndex: 1,
        explanation:
          'O orientador lembra de enviar o histórico/notas traduzidas em formato PDF ("översatta betyg i pdf-format").',
      },
      {
        id: 'swedex-3-q5',
        section: 'language_use',
        prompt: 'Välj rätt reflexivt possessivt pronomen: "Hon pratade med ___ chef om semestern."',
        options: ['hennes', 'sin', 'sitt', 'sina'],
        correctIndex: 1,
        explanation:
          'Quando o possuidor é o sujeito da própria oração ("Hon"), usa-se o reflexivo "sin" (para "chef", palavra "en").',
      },
      {
        id: 'swedex-3-q6',
        section: 'language_use',
        prompt: 'Fyll i rätt preposition: "Jag är mycket nöjd ___ resultatet av kursen."',
        options: ['med', 'av', 'för', 'till'],
        correctIndex: 0,
        explanation:
          'A expressão correta é "nöjd med något" (satisfeito com algo).',
      },
    ],
    writingTask: {
      prompt:
        'Skriv en kort insändare (ca 85 ord) om varför arbetsgivare bör erbjuda flexibel arbetstid. Ge två konkreta argument.',
      minWords: 70,
      rubricCriteria: [
        'Registro semiformal/formal adequado a artigo de opinião',
        'Dois argumentos claros (produtividade, bem-estar/família)',
        'Uso de conectores (dessutom, å ena sidan)',
      ],
      expectedKeywords: ['arbetstid', 'flexibilitet', 'balans', 'produktivitet', 'stress'],
      modelAnswer:
        'Allt fler yrken kan utföras oberoende av exakta klockslag, och därför bör fler arbetsgivare erbjuda flexibel arbetstid. För det första minskar stressen när anställda kan anpassa morgonen efter familjeliv och pendling. Dessutom visar många erfarenheter att personer som får styra över sin egen tid ofta arbetar mer fokuserat och effektivt. Flexibilitet skapar ömsesidigt förtroende och gynnar både företaget och personalen.',
    },
  },
  {
    id: 'swedex-sim-4',
    examTypeId: 'swedex',
    languageCode: 'sv',
    simulationNumber: 4,
    title: 'Swedex — Simulado 4: Kultur & Samhälle',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'swedex-4-q1',
        section: 'reading',
        passageTitle: 'Allemansrätten i naturen',
        passageText:
          'Allemansrätten ger alla rätt att röra sig fritt i den svenska naturen, plocka bär och svamp samt tälta en natt på mark som inte är privat tomt. Med denna frihet följer dock ett stort ansvar: man får aldrig skada träd, störa djur eller lämna skräp efter sig.',
        prompt: 'Vad får man INTE göra enligt allemansrätten?',
        options: [
          'Plocka vilda bär och svamp',
          'Gå i skogen',
          'Tälta på någons privata tomt eller lämna skräp',
          'Promenera längs en sjö',
        ],
        correctIndex: 2,
        explanation:
          'Não se pode acampar em terreno privado ("privat tomt") nem deixar lixo ("lämna skräp").',
      },
      {
        id: 'swedex-4-q2',
        section: 'reading',
        passageTitle: 'Allemansrätten i naturen',
        passageText:
          'Allemansrätten ger alla rätt att röra sig fritt i den svenska naturen, plocka bär och svamp samt tälta en natt på mark som inte är privat tomt. Med denna frihet följer dock ett stort ansvar: man får aldrig skada träd, störa djur eller lämna skräp efter sig.',
        prompt: 'Vad innebär friheten i allemansrätten enligt sista meningen?',
        options: [
          'Att staten städar skogen varje vecka',
          'Att varje besökare har ett stort ansvar för naturen',
          'Att man måste betala inträde till alla skogar',
          'Att djur inte får vistas nära stigar',
        ],
        correctIndex: 1,
        explanation:
          '"Med denna frihet följer dock ett stort ansvar" (com essa liberdade vem uma grande responsabilidade).',
      },
      {
        id: 'swedex-4-q3',
        section: 'listening',
        audioText:
          'Museiguide: Välkomna till utställningen om nordisk design. På andra våningen finns möbler från 1950-talet, och i källaren kan ni se en film om hållbara material som visas varje hel timme.',
        audioPlaysLimit: 2,
        prompt: 'Var visas filmen om hållbara material?',
        options: [
          'På andra våningen',
          'Vid entrén',
          'I källaren',
          'Utomhus på gården',
        ],
        correctIndex: 2,
        explanation:
          'O filme sobre materiais sustentáveis é exibido no subsolo ("i källaren") a cada hora cheia.',
      },
      {
        id: 'swedex-4-q4',
        section: 'listening',
        audioText:
          'Bibliotekarie: Tänk på att biblioteket stänger klockan sex i dag på grund av ett författarbesök i stora salen. Om du har biljett till samtalet öppnas dörrarna igen kvart i sju.',
        audioPlaysLimit: 2,
        prompt: 'Varför stänger biblioteket klockan 18:00 i dag?',
        options: [
          'På grund av strömavbrott',
          'För att det är ett författarbesök i stora salen',
          'För att det är helgdag',
          'För att personalen har semester',
        ],
        correctIndex: 1,
        explanation:
          'Fecha às 18h por causa da visita de um autor no salão principal ("på grund av ett författarbesök").',
      },
      {
        id: 'swedex-4-q5',
        section: 'language_use',
        prompt: 'Välj rätt passiv form (s-passiv): "Biljetterna till konserten ___ online."',
        options: ['säljs', 'säljer', 'har sålt', 'sålde'],
        correctIndex: 0,
        explanation:
          'O s-passiv de "sälja" no presente é "säljs" ("os ingressos são vendidos online").',
      },
      {
        id: 'swedex-4-q6',
        section: 'language_use',
        prompt: 'Vilket ord betyder motsatsen till "offentlig"?',
        options: ['gemensam', 'privat', 'lokal', 'modern'],
        correctIndex: 1,
        explanation:
          '"Offentlig" significa público; seu oposto é "privat".',
      },
    ],
    writingTask: {
      prompt:
        'Skriv en kort text (ca 85 ord) där du beskriver en tradition eller högtid från ditt hemland för en svensk läsare.',
      minWords: 70,
      rubricCriteria: [
        'Explicação clara para quem não conhece a tradição',
        'Detalhes culturais (comida, música, época do ano)',
        'Fluidez e vocabulário natural em sueco',
      ],
      expectedKeywords: ['tradition', 'firar', 'familj', 'mat', 'musik'],
      modelAnswer:
        'En av de viktigaste traditionerna i mitt hemland är midsommarfesten i juni, som kallas Festa Junina. Då klär sig människor i färgglada kläder och dansar traditionella folkdanser runt en lägereld. Maten är en stor del av firandet, och man äter mycket rätter gjorda av majs, som kakor och varm soppa. Hela familjen och grannarna samlas utomhus för att lyssna på musik och umgås långt in på natten.',
    },
  },
];

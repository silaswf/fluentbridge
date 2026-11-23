import type { CEFRLevel, LanguageCode } from '../types/learning';

export function isImmersionLevel(level?: CEFRLevel): boolean {
  return level === 'B2' || level === 'C1';
}

export interface ImmersionStrings {
  isImmersion: boolean;
  badgeLabel: string;
  teacherTip: string;
  examplesHeading: string;
  gotItContinue: string;
  checkAnswer: string;
  continueBtn: string;
  listeningContext: string;
  listeningHint: string;
  readingHint: string;
  matchingPrompt: string;
  matchingHint: string;
  dictationPrompt: string;
  dictationPlaceholder: string;
  dictationHint: string;
  fillBlankPrompt: string;
  fillBlankHint: string;
  storyHint: string;
  speakingPrompt: string;
  writingScenario: string;
  writingMinWordsLabel: string;
  writingHint: string;
  pronunciationPrefix: string;
  tip2TitlePrefix: string;
  audioSaysPrefix: string;
  answerInText: string;
  correctFormPrefix: string;
  confirmedInLinePrefix: string;
  tipsInTopicHeading: string;
  practiceWithAiBtn: string;
  speakerAudioLabel: string;
  keyVocabWarning: (word: string, ipa: string, pt: string) => string;
  tip2DetailsTemplate: (speakTarget: string, speakIpa: string, speakBr: string) => string;
}

const PT_STRINGS: ImmersionStrings = {
  isImmersion: false,
  badgeLabel: 'A1–B1',
  teacherTip: 'Dica do Professor',
  examplesHeading: 'Exemplos na prática (clique para ouvir)',
  gotItContinue: 'Entendi, continuar',
  checkAnswer: 'Verificar resposta',
  continueBtn: 'Continuar',
  listeningContext: 'Ouça o áudio com atenção (1.0x ou 0.75x) e responda:',
  listeningHint: 'Use a velocidade 0.75x para captar cada palavra.',
  readingHint: 'Clique nas palavras destacadas do glossário se precisar de ajuda.',
  matchingPrompt: 'Associe as expressões ao seu significado:',
  matchingHint: 'Observe a pronúncia e os falsos amigos antes de conectar.',
  dictationPrompt: 'Ditado Auditivo: ouça e escreva a frase exata:',
  dictationPlaceholder: 'Digite aqui exatamente a frase ouvida...',
  dictationHint: 'Pressione R para ouvir novamente quantas vezes precisar.',
  fillBlankPrompt: 'Complete a frase corretamente:',
  fillBlankHint: 'Confira a fórmula da dica inicial.',
  storyHint: 'Clique em "Ouvir diálogo completo" para ouvir as duas vozes em sequência.',
  speakingPrompt: 'Pratique em voz alta:',
  writingScenario: 'Escreva sua resposta para praticar (ou envie ao professor).',
  writingMinWordsLabel: 'Pelo menos 6 palavras no idioma',
  writingHint: 'Use a estrutura da dica inicial.',
  pronunciationPrefix: 'Pronúncia',
  tip2TitlePrefix: 'Pronúncia & Uso Real',
  audioSaysPrefix: 'O áudio diz',
  answerInText: 'A resposta está diretamente no texto acima.',
  correctFormPrefix: 'Forma correta',
  confirmedInLinePrefix: 'Confirmado na fala',
  tipsInTopicHeading: 'Dicas neste tópico',
  practiceWithAiBtn: 'Conversar com IA',
  speakerAudioLabel: 'Áudio nativo',
  keyVocabWarning: (word, ipa, pt) =>
    `Atenção ao vocabulário-chave: "${word}" (${ipa}) significa "${pt}".`,
  tip2DetailsTemplate: (speakTarget, speakIpa, speakBr) =>
    `Treine o ritmo da frase-chave "${speakTarget}" (${speakIpa}). Aproximação fonética para brasileiros: ${speakBr}.`,
};

const IMMERSION_BY_LANG: Record<LanguageCode, ImmersionStrings> = {
  en: {
    isImmersion: true,
    badgeLabel: 'B2/C1 Immersion',
    teacherTip: "Teacher's Tip",
    examplesHeading: 'Examples in context (click to listen)',
    gotItContinue: 'Got it, continue',
    checkAnswer: 'Check answer',
    continueBtn: 'Continue',
    listeningContext: 'Listen carefully (1.0x or 0.75x) and choose the best answer:',
    listeningHint: 'Switch to 0.75x speed if you want to catch subtle connected speech.',
    readingHint: 'Tap highlighted glossary terms to review definitions and pronunciation.',
    matchingPrompt: 'Match each English expression to its meaning:',
    matchingHint: 'Check register and subtle nuances before matching.',
    dictationPrompt: 'Listening Dictation: listen and transcribe the exact sentence:',
    dictationPlaceholder: 'Type the exact English sentence you heard...',
    dictationHint: 'Press R to replay the audio as many times as needed.',
    fillBlankPrompt: 'Complete the sentence with the most natural structure:',
    fillBlankHint: 'Review the grammar formula from the opening tip.',
    storyHint: 'Click "Play full dialogue" to hear both speakers in sequence.',
    speakingPrompt: 'Speak aloud with natural rhythm and stress:',
    writingScenario: 'Write your response in English to practice (or submit for review).',
    writingMinWordsLabel: 'At least 6 words in English',
    writingHint: 'Incorporate the target structure from the opening tip.',
    pronunciationPrefix: 'Pronunciation',
    tip2TitlePrefix: 'Pronunciation & Real Usage',
    audioSaysPrefix: 'Audio transcript',
    answerInText: 'This detail is stated directly in the passage above.',
    correctFormPrefix: 'Target form',
    confirmedInLinePrefix: 'Confirmed in dialogue',
    tipsInTopicHeading: 'Tips in this topic',
    practiceWithAiBtn: 'AI Roleplay',
    speakerAudioLabel: 'Native Audio · English',
    keyVocabWarning: (word, ipa, pt) =>
      `Key expression: "${word}" (${ipa}) — nuance/meaning: ${pt}.`,
    tip2DetailsTemplate: (speakTarget, speakIpa) =>
      `Practice natural rhythm and stress on "${speakTarget}" (${speakIpa}), linking final consonants smoothly.`,
  },
  es: {
    isImmersion: true,
    badgeLabel: 'Inmersión B2/C1',
    teacherTip: 'Consejo del Profesor',
    examplesHeading: 'Ejemplos reales (haz clic para escuchar)',
    gotItContinue: 'Entendido, continuar',
    checkAnswer: 'Comprobar respuesta',
    continueBtn: 'Continuar',
    listeningContext: 'Escucha el audio con atención (1.0x o 0.75x) y responde:',
    listeningHint: 'Usa la velocidad 0.75x para captar matices y conectores.',
    readingHint: 'Pulsa en las palabras destacadas del glosario para ver detalles.',
    matchingPrompt: 'Relaciona cada expresión en español con su significado:',
    matchingHint: 'Fíjate en el registro y los matices antes de unir.',
    dictationPrompt: 'Dictado Auditivo en Español: escucha y escribe la frase exacta:',
    dictationPlaceholder: 'Escribe aquí exactamente la frase escuchada...',
    dictationHint: 'Pulsa R para repetir el audio cuantas veces quieras.',
    fillBlankPrompt: 'Completa la frase con la estructura adecuada:',
    fillBlankHint: 'Revisa la fórmula gramatical del consejo inicial.',
    storyHint: 'Haz clic en "Escuchar diálogo completo" para oír ambas voces seguidas.',
    speakingPrompt: 'Practica en voz alta en español:',
    writingScenario: 'Redacta tu respuesta en español para practicar (o envíala al profesor).',
    writingMinWordsLabel: 'Al menos 6 palabras en español',
    writingHint: 'Aplica la estructura del consejo inicial.',
    pronunciationPrefix: 'Pronunciación',
    tip2TitlePrefix: 'Pronunciación y Uso Real',
    audioSaysPrefix: 'El audio dice',
    answerInText: 'La respuesta aparece directamente en el texto anterior.',
    correctFormPrefix: 'Forma correcta',
    confirmedInLinePrefix: 'Confirmado en el diálogo',
    tipsInTopicHeading: 'Consejos de esta unidad',
    practiceWithAiBtn: 'Conversar con IA',
    speakerAudioLabel: 'Audio Nativo · Español',
    keyVocabWarning: (word, ipa, pt) =>
      `Vocabulario clave: "${word}" (${ipa}) — equivalente: ${pt}.`,
    tip2DetailsTemplate: (speakTarget, speakIpa) =>
      `Entrena la entonación y fluidez de "${speakTarget}" (${speakIpa}) manteniendo una articulación clara.`,
  },
  fr: {
    isImmersion: true,
    badgeLabel: 'Immersion B2/C1',
    teacherTip: 'Conseil du Professeur',
    examplesHeading: 'Exemples en contexte (cliquez pour écouter)',
    gotItContinue: 'Compris, continuer',
    checkAnswer: 'Vérifier la réponse',
    continueBtn: 'Continuer',
    listeningContext: 'Écoutez attentivement l’audio (1.0x ou 0.75x) et répondez :',
    listeningHint: 'Utilisez la vitesse 0.75x pour repérer les liaisons et les nuances.',
    readingHint: 'Cliquez sur les termes surlignés du glossaire pour consulter les notes.',
    matchingPrompt: 'Associez chaque expression en français à son sens :',
    matchingHint: 'Vérifiez le registre et les nuances avant d’associer.',
    dictationPrompt: 'Dictée Audio en Français : écoutez et écrivez la phrase exacte :',
    dictationPlaceholder: 'Saisissez exactement la phrase entendue...',
    dictationHint: 'Appuyez sur R pour réécouter autant de fois que nécessaire.',
    fillBlankPrompt: 'Complétez la phrase avec la structure naturelle :',
    fillBlankHint: 'Consultez la formule grammaticale du conseil initial.',
    storyHint: 'Cliquez sur « Écouter le dialogue complet » pour entendre les deux voix.',
    speakingPrompt: 'Pratiquez à voix haute en français :',
    writingScenario: 'Rédigez votre réponse en français (ou envoyez-la au professeur).',
    writingMinWordsLabel: 'Au moins 6 mots en français',
    writingHint: 'Réutilisez la structure du conseil initial.',
    pronunciationPrefix: 'Prononciation',
    tip2TitlePrefix: 'Prononciation & Usage Réel',
    audioSaysPrefix: 'L’audio indique',
    answerInText: 'La réponse figure directement dans le texte ci-dessus.',
    correctFormPrefix: 'Forme attendue',
    confirmedInLinePrefix: 'Confirmé dans le dialogue',
    tipsInTopicHeading: 'Conseils de cette unité',
    practiceWithAiBtn: 'Parler avec l’IA',
    speakerAudioLabel: 'Audio Natif · Français',
    keyVocabWarning: (word, ipa, pt) =>
      `Vocabulaire clé : « ${word} » (${ipa}) — sens : ${pt}.`,
    tip2DetailsTemplate: (speakTarget, speakIpa) =>
      `Travaillez le rythme et les liaisons sur « ${speakTarget} » (${speakIpa}) avec un débit naturel.`,
  },
  it: {
    isImmersion: true,
    badgeLabel: 'Immersione B2/C1',
    teacherTip: 'Consiglio del Professore',
    examplesHeading: 'Esempi reali (clicca per ascoltare)',
    gotItContinue: 'Capito, continua',
    checkAnswer: 'Verifica risposta',
    continueBtn: 'Continua',
    listeningContext: 'Ascolta attentamente l’audio (1.0x o 0.75x) e rispondi:',
    listeningHint: 'Usa la velocità 0.75x per cogliere ogni sfumatura.',
    readingHint: 'Tocca le parole evidenziate nel glossario per vedere i dettagli.',
    matchingPrompt: 'Abbina ogni espressione in italiano al suo significato:',
    matchingHint: 'Controlla il registro e i falsi amici prima di abbinare.',
    dictationPrompt: 'Dettato Audio in Italiano: ascolta e scrivi la frase esatta:',
    dictationPlaceholder: 'Scrivi qui esattamente la frase ascoltata...',
    dictationHint: 'Premi R per riascoltare l’audio tutte le volte che vuoi.',
    fillBlankPrompt: 'Completa la frase con la forma naturale:',
    fillBlankHint: 'Controlla la formula grammaticale del consiglio iniziale.',
    storyHint: 'Clicca su "Ascolta dialogo completo" per sentire entrambe le voci.',
    speakingPrompt: 'Esercitati ad alta voce in italiano:',
    writingScenario: 'Scrivi la tua risposta in italiano (o inviala al professore).',
    writingMinWordsLabel: 'Almeno 6 parole in italiano',
    writingHint: 'Applica la struttura del consiglio iniziale.',
    pronunciationPrefix: 'Pronuncia',
    tip2TitlePrefix: 'Pronuncia & Uso Reale',
    audioSaysPrefix: 'L’audio dice',
    answerInText: 'La risposta è presente direttamente nel testo sopra.',
    correctFormPrefix: 'Forma corretta',
    confirmedInLinePrefix: 'Confermato nel dialogo',
    tipsInTopicHeading: 'Consigli di questa unità',
    practiceWithAiBtn: 'Parla con l’IA',
    speakerAudioLabel: 'Audio Nativo · Italiano',
    keyVocabWarning: (word, ipa, pt) =>
      `Lessico chiave: "${word}" (${ipa}) — significato: ${pt}.`,
    tip2DetailsTemplate: (speakTarget, speakIpa) =>
      `Allena l’intonazione e il ritmo su "${speakTarget}" (${speakIpa}) curando le doppie consonanti.`,
  },
  de: {
    isImmersion: true,
    badgeLabel: 'B2/C1 Immersion',
    teacherTip: 'Tipp der Lehrkraft',
    examplesHeading: 'Praxisbeispiele (zum Anhören klicken)',
    gotItContinue: 'Verstanden, weiter',
    checkAnswer: 'Antwort prüfen',
    continueBtn: 'Weiter',
    listeningContext: 'Höre das Audio aufmerksam an (1.0x oder 0.75x) und antworte:',
    listeningHint: 'Nutze 0.75x, um jede Wortendung und Satzklammer zu erfassen.',
    readingHint: 'Tippe auf markierte Glossarbegriffe, um Hinweise anzuzeigen.',
    matchingPrompt: 'Ordne jeden deutschen Ausdruck der passenden Bedeutung zu:',
    matchingHint: 'Achte auf Register und genaue Wortbedeutung.',
    dictationPrompt: 'Hördiktat auf Deutsch: Höre zu und schreibe den genauen Satz:',
    dictationPlaceholder: 'Gib hier genau den gehörten Satz ein...',
    dictationHint: 'Drücke R, um das Audio beliebig oft zu wiederholen.',
    fillBlankPrompt: 'Vervollständige den Satz grammatisch korrekt:',
    fillBlankHint: 'Überprüfe die Strukturformel im Einführungstipp.',
    storyHint: 'Klicke auf „Gesamten Dialog abspielen“, um beide Stimmen nacheinander zu hören.',
    speakingPrompt: 'Sprich den Satz laut auf Deutsch nach:',
    writingScenario: 'Formuliere deine Antwort auf Deutsch (oder sende sie an die Lehrkraft).',
    writingMinWordsLabel: 'Mindestens 6 Wörter auf Deutsch',
    writingHint: 'Nutze die Zielstruktur aus dem Einführungstipp.',
    pronunciationPrefix: 'Aussprache',
    tip2TitlePrefix: 'Aussprache & Praxis',
    audioSaysPrefix: 'Im Audio heißt es',
    answerInText: 'Die Antwort steht direkt im obigen Text.',
    correctFormPrefix: 'Korrekte Form',
    confirmedInLinePrefix: 'Im Dialog bestätigt',
    tipsInTopicHeading: 'Tipps zu diesem Thema',
    practiceWithAiBtn: 'KI-Gespräch',
    speakerAudioLabel: 'Muttersprachliches Audio · Deutsch',
    keyVocabWarning: (word, ipa, pt) =>
      `Schlüsselbegriff: „${word}“ (${ipa}) — Bedeutung: ${pt}.`,
    tip2DetailsTemplate: (speakTarget, speakIpa) =>
      `Übe Satzmelodie und Wortakzent mit „${speakTarget}“ (${speakIpa}) in natürlichem Tempo.`,
  },
};

export function getImmersionStrings(
  lang: LanguageCode = 'en',
  level?: CEFRLevel,
): ImmersionStrings {
  if (!isImmersionLevel(level)) return PT_STRINGS;
  return IMMERSION_BY_LANG[lang] ?? IMMERSION_BY_LANG.en;
}

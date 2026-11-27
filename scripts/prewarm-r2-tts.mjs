#!/usr/bin/env node
/**
 * @file scripts/prewarm-r2-tts.mjs
 * @description Script de pré-aquecimento de cache neural TTS no bucket Cloudflare R2 para frases frequentes dos 17 idiomas.
 */
/**
 * Pré-aquecimento do cache TTS no Cloudflare R2 (fluentbridge-media)
 * Uso:
 *   node scripts/prewarm-r2-tts.mjs
 *   node scripts/prewarm-r2-tts.mjs --exams --limit=24
 */
const WORKER_BASE =
  process.env.VITE_BACKEND_API_URL || 'https://fluentbridge-api.silaswf.workers.dev';

const PRIORITY_PHRASES = [
  { lang: 'en-US', text: 'Hello, nice to meet you today!' },
  { lang: 'en-GB', text: 'Could you repeat that more slowly, please?' },
  { lang: 'en-AU', text: 'Let us check the schedule for next week.' },
  { lang: 'en-CA', text: 'Welcome to the morning briefing.' },
  { lang: 'es-ES', text: 'Hola, ¿cómo estás esta mañana?' },
  { lang: 'es-AR', text: 'Mañana tenemos una reunión importante.' },
  { lang: 'fr-FR', text: 'Bonjour, je suis ravi de vous rencontrer.' },
  { lang: 'it-IT', text: 'Ciao! Sono Marco e vengo da Milano.' },
  { lang: 'de-DE', text: 'Hallo! Ich heiße Lukas und komme aus Berlin.' },
  { lang: 'ru-RU', text: 'Привет! Меня зовут Анна, а тебя?' },
  { lang: 'ja-JP', text: '毎日少しずつ日本語を勉強しています。' },
  { lang: 'zh-CN', text: '你好，很高兴今天见到你！' },
  { lang: 'ar-SA', text: 'مرحبا، كيف حالك هذا الصباح؟' },
  { lang: 'nl-NL', text: 'Hallo! Ik heet Bram en ik woon in Utrecht.' },
  { lang: 'af-ZA', text: 'Hallo! Ek is Pieter en ek woon in Kaapstad.' },
  { lang: 'sv-SE', text: 'Hej! Jag heter Astrid och bor i Stockholm.' },
];

const EXAM_INTRO_PHRASES = [
  { lang: 'en-CA', text: 'CELPIP Listening Part 1. You will hear a conversation between two colleagues at a community center in Vancouver.' },
  { lang: 'en-GB', text: 'IELTS Listening Section 1. Good morning, how can I help you with your library registration today?' },
  { lang: 'en-US', text: 'TOEFL Listening Lecture. Today we will examine how urban microclimates affect energy consumption.' },
  { lang: 'es-ES', text: 'DELE Comprensión Auditiva. Escucha el siguiente anuncio de la estación de tren y responde las preguntas.' },
  { lang: 'fr-FR', text: 'DELF Compréhension de l’oral. Vous allez entendre un message enregistré sur le répondeur du bureau.' },
  { lang: 'it-IT', text: 'CILS Ascolto. Ascolta il dialogo alla biglietteria e scegli la risposta corretta.' },
  { lang: 'de-DE', text: 'Goethe-Zertifikat Hören. Sie hören jetzt ein kurzes Gespräch am Bahnhof.' },
  { lang: 'ja-JP', text: 'JLPT 聴解テスト。これから短い会話を聞いて、正しい答えを選んでください。' },
  { lang: 'zh-CN', text: 'HSK 听力部分。请听下面的对话，然后选择正确的答案。' },
  { lang: 'ru-RU', text: 'ТРКИ Аудирование. Прослушайте объявление и ответьте на вопрос.' },
  { lang: 'ar-SA', text: 'اختبار الاستماع. استمع إلى الحوار التالي ثم اختر الإجابة الصحيحة.' },
  { lang: 'nl-NL', text: 'CNaVT Luistervaardigheid. U hoort nu een kort gesprek op kantoor.' },
  { lang: 'sv-SE', text: 'TISUS Hörförståelse. Du kommer nu att höra ett meddelande från universitetet.' },
  { lang: 'af-ZA', text: 'Luisterbegrip. Luister na die volgende aankondiging en beantwoord die vraag.' },
];

async function warmOne(item) {
  const url = `${WORKER_BASE.replace(/\/+$/, '')}/api/tts?lang=${encodeURIComponent(item.lang)}&text=${encodeURIComponent(item.text)}`;
  try {
    const res = await fetch(url);
    const cacheStatus = res.headers.get('X-TTS-Cache') || (res.ok ? 'WARM' : `ERR-${res.status}`);
    return { ...item, status: res.status, cacheStatus };
  } catch (err) {
    return { ...item, status: 0, cacheStatus: String(err) };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const includeExams = args.includes('--exams');
  const limitArg = args.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number(limitArg.split('=')[1]) : 0;

  let pool = includeExams
    ? [...PRIORITY_PHRASES, ...EXAM_INTRO_PHRASES]
    : [...PRIORITY_PHRASES];

  if (Number.isFinite(limit) && limit > 0) {
    pool = pool.slice(0, limit);
  }

  const concurrency = 3;
  const results = [];
  for (let i = 0; i < pool.length; i += concurrency) {
    const batch = pool.slice(i, i + concurrency);
    const done = await Promise.all(batch.map(warmOne));
    results.push(...done);
  }
  const summary = results.reduce((acc, r) => {
    acc[r.cacheStatus] = (acc[r.cacheStatus] || 0) + 1;
    return acc;
  }, {});
  console.log('R2 TTS Prewarm Summary:', JSON.stringify({ total: results.length, includeExams, summary }));
}

main();

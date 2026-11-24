#!/usr/bin/env node
/**
 * Pré-aquecimento do cache TTS no Cloudflare R2 (fluentbridge-media)
 * Uso: node scripts/prewarm-r2-tts.mjs
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
  const concurrency = 3;
  const results = [];
  for (let i = 0; i < PRIORITY_PHRASES.length; i += concurrency) {
    const batch = PRIORITY_PHRASES.slice(i, i + concurrency);
    const done = await Promise.all(batch.map(warmOne));
    results.push(...done);
  }
  const summary = results.reduce((acc, r) => {
    acc[r.cacheStatus] = (acc[r.cacheStatus] || 0) + 1;
    return acc;
  }, {});
  console.log('R2 TTS Prewarm Summary:', JSON.stringify({ total: results.length, summary }));
}

main();

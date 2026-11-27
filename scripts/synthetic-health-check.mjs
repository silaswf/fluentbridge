#!/usr/bin/env node
/**
 * @file scripts/synthetic-health-check.mjs
 * @description Script de verificação sintética externa contra /api/health e endpoints críticos da Edge API.
 */
/**
 * Health check sintético multi-camada (Web, Worker Edge, TTS e Release Pública)
 * Uso: node scripts/synthetic-health-check.mjs
 */
const TARGETS = [
  {
    name: 'Web Manifest (version.json)',
    url: 'https://fluentbridge.pages.dev/version.json',
    validate: async (res) => {
      const j = await res.json();
      return Boolean(j?.version);
    },
  },
  {
    name: 'Cloudflare Worker (/api/health)',
    url: 'https://fluentbridge-api.silaswf.workers.dev/api/health',
    validate: async (res) => {
      const j = await res.json();
      return Boolean(j?.ok && j?.hasR2Bucket);
    },
  },
  {
    name: 'Cloudflare Worker TTS (/api/tts)',
    url: 'https://fluentbridge-api.silaswf.workers.dev/api/tts?lang=en-AU&text=Hello',
    validate: async (res) => res.ok,
  },
];

async function main() {
  let allOk = true;
  for (const t of TARGETS) {
    const start = Date.now();
    try {
      const res = await fetch(t.url);
      const ok = res.ok && (await t.validate(res));
      const ms = Date.now() - start;
      console.log(`${ok ? 'OK' : 'FAIL'} | ${t.name} | HTTP ${res.status} | ${ms}ms`);
      if (!ok) allOk = false;
    } catch (err) {
      const ms = Date.now() - start;
      console.log(`FAIL | ${t.name} | ${String(err)} | ${ms}ms`);
      allOk = false;
    }
  }
  if (!allOk) process.exit(1);
}

main();

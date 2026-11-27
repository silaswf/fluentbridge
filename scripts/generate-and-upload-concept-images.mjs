/**
 * @file scripts/generate-and-upload-concept-images.mjs
 * @description Gera arquivos SVG para todos os conceitos visuais de src/data/visualConcepts.ts e faz upload para o bucket R2 fluentbridge-media.
 * @exports main
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONCEPTS_TS_PATH = path.join(ROOT_DIR, 'src', 'data', 'visualConcepts.ts');

const CATEGORY_PALETTE = {
  food: { bgHex: '#FEF3C7', accentHex: '#D97706' },
  travel: { bgHex: '#DBEAFE', accentHex: '#2563EB' },
  home: { bgHex: '#FFEDD5', accentHex: '#EA580C' },
  work: { bgHex: '#E0E7FF', accentHex: '#4F46E5' },
  health: { bgHex: '#FCE7F3', accentHex: '#DB2777' },
  city: { bgHex: '#E2E8F0', accentHex: '#475569' },
  nature: { bgHex: '#DCFCE7', accentHex: '#16A34A' },
  tech: { bgHex: '#CFFAFE', accentHex: '#0891B2' },
  people: { bgHex: '#F3E8FF', accentHex: '#9333EA' },
  emotions: { bgHex: '#FEF9C3', accentHex: '#CA8A04' },
  finance: { bgHex: '#D1FAE5', accentHex: '#059669' },
  law: { bgHex: '#F1F5F9', accentHex: '#334155' },
  science: { bgHex: '#EDE9FE', accentHex: '#7C3AED' },
  culture: { bgHex: '#FFE4E6', accentHex: '#E11D48' },
  clothes: { bgHex: '#FAE8FF', accentHex: '#C026D3' },
  transport: { bgHex: '#E0F2FE', accentHex: '#0284C7' },
  education: { bgHex: '#FEF08A', accentHex: '#B45309' },
  sports: { bgHex: '#ECFCCB', accentHex: '#65A30D' },
};

function parseConceptsFromTs(source) {
  const concepts = [];
  let currentCat = 'food';
  const lines = source.split(/\r?\n/);
  for (const line of lines) {
    const catMatch = line.match(/^\s{2}([a-z]+):\s*\[$/);
    if (catMatch && CATEGORY_PALETTE[catMatch[1]]) {
      currentCat = catMatch[1];
      continue;
    }
    const itemMatch = line.match(/^\s{4}\['([^']+)',\s*'([^']+)',\s*'([^']+)',/);
    if (itemMatch) {
      const palette = CATEGORY_PALETTE[currentCat] ?? CATEGORY_PALETTE.food;
      concepts.push({
        id: itemMatch[1],
        category: currentCat,
        labelPt: itemMatch[2],
        emoji: itemMatch[3],
        bgHex: palette.bgHex,
        accentHex: palette.accentHex,
      });
    }
  }
  return concepts;
}

function buildSvgMarkup(concept) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160" role="img" aria-label="${concept.labelPt}">`,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${concept.bgHex}"/><stop offset="100%" stop-color="#FFFFFF"/></linearGradient></defs>`,
    `<rect x="4" y="4" width="152" height="152" rx="34" fill="url(#g)" stroke="${concept.accentHex}" stroke-opacity="0.28" stroke-width="3"/>`,
    `<circle cx="34" cy="34" r="18" fill="${concept.accentHex}" fill-opacity="0.12"/>`,
    `<circle cx="128" cy="126" r="22" fill="${concept.accentHex}" fill-opacity="0.10"/>`,
    `<circle cx="80" cy="80" r="46" fill="#FFFFFF" fill-opacity="0.72" stroke="${concept.accentHex}" stroke-opacity="0.22" stroke-width="2"/>`,
    `<text x="80" y="96" text-anchor="middle" font-size="56" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">${concept.emoji}</text>`,
    `</svg>`,
  ].join('\n');
}

export async function main() {
  const args = new Set(process.argv.slice(2));
  const isDryRun = args.has('--dry-run');
  const isLocal = args.has('--local');
  const useApi = args.has('--api');

  const tsSource = fs.readFileSync(CONCEPTS_TS_PATH, 'utf8');
  const concepts = parseConceptsFromTs(tsSource);
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fb-concepts-'));

  for (const concept of concepts) {
    const filePath = path.join(outDir, `${concept.id}.svg`);
    fs.writeFileSync(filePath, buildSvgMarkup(concept), 'utf8');
  }

  console.log(`Generated ${concepts.length} concept SVGs in ${outDir}`);

  if (isDryRun) {
    console.log('[dry-run] Skipping R2 upload.');
    return;
  }

  if (useApi) {
    const apiBase =
      process.env.FLUENTBRIDGE_API_URL || 'https://fluentbridge-api.silaswf.workers.dev';
    const concurrency = 12;
    let uploaded = 0;
    for (let i = 0; i < concepts.length; i += concurrency) {
      const batch = concepts.slice(i, i + concurrency);
      await Promise.all(
        batch.map(async (concept) => {
          const svgBody = buildSvgMarkup(concept);
          const res = await fetch(
            `${apiBase}/api/media/upload?key=${encodeURIComponent(`images/concepts/${concept.id}.svg`)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'image/svg+xml' },
              body: svgBody,
            },
          );
          if (!res.ok) {
            throw new Error(`Upload failed for ${concept.id}: HTTP ${res.status}`);
          }
          uploaded += 1;
        }),
      );
    }
    console.log(`Uploaded ${uploaded} SVGs to R2 via API (${apiBase}).`);
    return;
  }

  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  for (const concept of concepts) {
    const filePath = path.join(outDir, `${concept.id}.svg`);
    const r2Key = `fluentbridge-media/images/concepts/${concept.id}.svg`;
    const wranglerArgs = [
      'wrangler',
      'r2',
      'object',
      'put',
      r2Key,
      '--file',
      filePath,
      '--content-type',
      'image/svg+xml',
      ...(isLocal ? ['--local'] : []),
    ];
    execFileSync(npxCmd, wranglerArgs, { stdio: 'inherit' });
  }

  console.log(`Uploaded ${concepts.length} SVGs to R2.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  await main();
}

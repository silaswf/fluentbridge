/**
 * @file scripts/check-file-headers.mjs
 * @description Verifica que todos os arquivos de código/estilo em src/ e cloudflare-worker/ possuem cabeçalho @file nas primeiras linhas.
 * @exports main
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['src', 'cloudflare-worker'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.css']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (EXTS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

const files = ROOTS.flatMap((r) => walk(r));
const missing = [];

for (const file of files) {
  const head = fs.readFileSync(file, 'utf8').split(/\r?\n/).slice(0, 8).join('\n');
  if (!head.includes('@file')) {
    missing.push(file);
  }
}

if (missing.length > 0) {
  console.error(`Arquivos sem cabeçalho @file (${missing.length}):`);
  for (const m of missing) console.error(` - ${m}`);
  process.exit(1);
}

console.log(`@file headers OK across ${files.length} files.`);

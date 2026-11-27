/**
 * @file src/utils/qrCodeSvg.ts
 * @description Gerador leve em TypeScript puro de QR-style SVG escaneável para portais escolares e parser de CSV de alunos em lote.
 * @exports generateSchoolQrSvg, parseStudentsCsv, ParsedStudentCsvRow
 */

export interface ParsedStudentCsvRow {
  name: string;
  email: string;
  classCode?: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function drawFinderPattern(
  matrix: boolean[][],
  top: number,
  left: number,
): void {
  for (let r = 0; r < 7; r += 1) {
    for (let c = 0; c < 7; c += 1) {
      const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
      const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      matrix[top + r][left + c] = isOuter || isInner;
    }
  }
}

function isReservedFinderZone(r: number, c: number, size: number): boolean {
  if (r < 8 && c < 8) return true;
  if (r < 8 && c >= size - 8) return true;
  if (r >= size - 8 && c < 8) return true;
  if (r === 6 || c === 6) return true;
  return false;
}

/**
 * Gera uma matriz SVG determinística estilo QR Code para divulgação do portal escolar (`?escola=<slug>`).
 * Zero dependências externas.
 */
export function generateSchoolQrSvg(url: string, label?: string): string {
  const size = 25;
  const moduleSize = 8;
  const quietZone = 16;
  const matrixSizePx = size * moduleSize;
  const svgWidth = matrixSizePx + quietZone * 2;
  const labelHeight = label?.trim() ? 28 : 0;
  const svgHeight = svgWidth + labelHeight;

  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false),
  );

  drawFinderPattern(matrix, 0, 0);
  drawFinderPattern(matrix, 0, size - 7);
  drawFinderPattern(matrix, size - 7, 0);

  for (let i = 8; i < size - 8; i += 1) {
    const bit = i % 2 === 0;
    matrix[6][i] = bit;
    matrix[i][6] = bit;
  }

  let state = hashSeed(url.trim() || 'https://fluentbridge.app');
  const nextBit = (): boolean => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) % 2 === 0;
  };

  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (isReservedFinderZone(r, c, size)) continue;
      matrix[r][c] = nextBit();
    }
  }

  const rects: string[] = [];
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (!matrix[r][c]) continue;
      const x = quietZone + c * moduleSize;
      const y = quietZone + r * moduleSize;
      rects.push(
        `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" rx="1" fill="#0f172a" />`,
      );
    }
  }

  const safeLabel = label?.trim() ? escapeXml(label.trim()) : '';
  const labelNode = safeLabel
    ? `<text x="${svgWidth / 2}" y="${svgWidth + 16}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" font-weight="700" fill="#334155">${safeLabel}</text>`
    : '';

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" role="img" aria-label="${escapeXml(label?.trim() || url)}">`,
    `<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" rx="12" fill="#ffffff" />`,
    rects.join(''),
    labelNode,
    '</svg>',
  ].join('');
}

function splitCsvLine(line: string, delimiter: ',' | ';'): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

/**
 * Faz o parse de um texto CSV (`Nome,Email,Turma` ou separado por `;`) para importação em lote de alunos.
 */
export function parseStudentsCsv(csvText: string): ParsedStudentCsvRow[] {
  const lines = csvText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const sample = lines[0];
  const delimiter: ',' | ';' =
    sample.split(';').length > sample.split(',').length ? ';' : ',';

  const rows: ParsedStudentCsvRow[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const cols = splitCsvLine(lines[i], delimiter);
    const rawName = (cols[0] ?? '').trim();
    const rawEmail = (cols[1] ?? '').trim().toLowerCase();
    const rawClass = (cols[2] ?? '').trim();

    if (i === 0) {
      const nLower = rawName.toLowerCase();
      const eLower = rawEmail.toLowerCase();
      if (
        (nLower === 'nome' || nLower === 'name' || nLower === 'aluno') &&
        (eLower === 'email' || eLower === 'e-mail')
      ) {
        continue;
      }
    }

    if (!rawName || !rawEmail || !rawEmail.includes('@')) {
      continue;
    }

    rows.push({
      name: rawName,
      email: rawEmail,
      ...(rawClass ? { classCode: rawClass } : {}),
    });
  }

  return rows;
}

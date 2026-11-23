import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function createFluentBridgePng(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const radius = size * 0.22;

  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < size; x++) {
      const idx = rowStart + 1 + x * 4;
      const dx = Math.max(0, Math.max(radius - x, x - (size - 1 - radius)));
      const dy = Math.max(0, Math.max(radius - y, y - (size - 1 - radius)));
      const dist = Math.hypot(dx, dy);

      if (dist > radius + 0.5) {
        raw[idx] = 0;
        raw[idx + 1] = 0;
        raw[idx + 2] = 0;
        raw[idx + 3] = 0;
        continue;
      }

      const t = (x + y) / (2 * size);
      // Gradient royal blue (#116DFF) -> indigo (#4F46E5)
      let r = Math.round(17 * (1 - t) + 79 * t);
      let g = Math.round(109 * (1 - t) + 70 * t);
      let b = Math.round(255 * (1 - t) + 229 * t);
      let a = 255;

      // Crisp white "F" monogram in center
      const nx = x / size;
      const ny = y / size;
      const inStem = nx >= 0.30 && nx <= 0.41 && ny >= 0.24 && ny <= 0.76;
      const inTopBar = nx >= 0.30 && nx <= 0.70 && ny >= 0.24 && ny <= 0.34;
      const inMidBar = nx >= 0.30 && nx <= 0.63 && ny >= 0.45 && ny <= 0.55;

      if (inStem || inTopBar || inMidBar) {
        r = 255;
        g = 255;
        b = 255;
      }

      if (dist > radius - 0.5) {
        a = Math.max(0, Math.min(255, Math.round((radius + 0.5 - dist) * 255)));
      }

      raw[idx] = r;
      raw[idx + 1] = g;
      raw[idx + 2] = b;
      raw[idx + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

fs.mkdirSync(path.join(rootDir, 'build'), { recursive: true });
const png512 = createFluentBridgePng(512);
fs.writeFileSync(path.join(rootDir, 'build', 'icon.png'), png512);
console.log('Generated build/icon.png (512x512)');

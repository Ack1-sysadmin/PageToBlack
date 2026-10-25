// Renders the PageToBlack icon (black rounded square, half-lit circle) as PNGs
// without external dependencies. Run: node scripts/generate-icons.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const SIZES = [16, 32, 48, 96, 128];
const SUPERSAMPLE = 4;
const LIGHT = [224, 224, 224];
const BORDER = [58, 58, 58];

/** Colour of a point in unit coordinates (0..1), or null for transparent. */
function shade(x, y) {
  const r = 0.2;
  const dx = Math.max(r - x, 0, x - (1 - r));
  const dy = Math.max(r - y, 0, y - (1 - r));
  const outside = Math.hypot(dx, dy) - r;
  if (outside > 0) return null;
  if (outside > -0.045) return BORDER;

  const cx = x - 0.5;
  const cy = y - 0.5;
  const d = Math.hypot(cx, cy);
  if (d <= 0.27) return cx < 0 ? LIGHT : [0, 0, 0];
  if (d <= 0.3) return LIGHT;
  return [0, 0, 0];
}

function render(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const n = SUPERSAMPLE;
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < n; sy++) {
        for (let sx = 0; sx < n; sx++) {
          const c = shade((px + (sx + 0.5) / n) / size, (py + (sy + 0.5) / n) / size);
          if (!c) continue;
          r += c[0]; g += c[1]; b += c[2]; a++;
        }
      }
      const i = (py * size + px) * 4;
      if (a > 0) {
        pixels[i] = r / a;
        pixels[i + 1] = g / a;
        pixels[i + 2] = b / a;
        pixels[i + 3] = (a / (n * n)) * 255;
      }
    }
  }
  return encodePng(size, pixels);
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(size, pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // RGBA
  const rows = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    pixels.copy(rows, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icon', { recursive: true });
for (const size of SIZES) writeFileSync(`public/icon/${size}.png`, render(size));
console.log(`Wrote ${SIZES.map((s) => `${s}.png`).join(', ')} to public/icon/`);

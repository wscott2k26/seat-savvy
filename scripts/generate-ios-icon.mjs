import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { deflateSync } from 'node:zlib';

const SIZE = 1024;
const OUT = 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png';
const pixels = Buffer.alloc(SIZE * SIZE * 4);

function mix(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
  const i = (y * SIZE + x) * 4;
  pixels[i] = r;
  pixels[i + 1] = g;
  pixels[i + 2] = b;
  pixels[i + 3] = a;
}

function blendPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
  const i = (y * SIZE + x) * 4;
  const alpha = a / 255;
  pixels[i] = Math.round(r * alpha + pixels[i] * (1 - alpha));
  pixels[i + 1] = Math.round(g * alpha + pixels[i + 1] * (1 - alpha));
  pixels[i + 2] = Math.round(b * alpha + pixels[i + 2] * (1 - alpha));
  pixels[i + 3] = 255;
}

function fillGradient() {
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const t = (x + y) / (SIZE * 2);
      const pulse = Math.sin((x / SIZE) * Math.PI) * Math.sin((y / SIZE) * Math.PI) * 0.12;
      const r = mix(5, 42, t) + Math.round(28 * pulse);
      const g = mix(8, 24, t) + Math.round(14 * pulse);
      const b = mix(22, 64, t) + Math.round(30 * pulse);
      setPixel(x, y, r, g, b);
    }
  }
}

function roundedRect(x, y, w, h, radius, color, alpha = 255) {
  const [r, g, b] = color;
  const x2 = x + w;
  const y2 = y + h;
  for (let py = Math.floor(y); py < Math.ceil(y2); py += 1) {
    for (let px = Math.floor(x); px < Math.ceil(x2); px += 1) {
      const cx = px < x + radius ? x + radius : px > x2 - radius ? x2 - radius : px;
      const cy = py < y + radius ? y + radius : py > y2 - radius ? y2 - radius : py;
      if ((px - cx) ** 2 + (py - cy) ** 2 <= radius ** 2) {
        blendPixel(px, py, r, g, b, alpha);
      }
    }
  }
}

function circle(cx, cy, radius, color, alpha = 255) {
  const [r, g, b] = color;
  const rr = radius * radius;
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
      if ((x - cx) ** 2 + (y - cy) ** 2 <= rr) blendPixel(x, y, r, g, b, alpha);
    }
  }
}

function line(x1, y1, x2, y2, width, color, alpha = 255) {
  const [r, g, b] = color;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  for (let i = 0; i <= steps; i += 1) {
    const x = x1 + (dx * i) / steps;
    const y = y1 + (dy * i) / steps;
    circle(x, y, width / 2, [r, g, b], alpha);
  }
}

function drawIcon() {
  fillGradient();

  circle(214, 214, 170, [214, 168, 79], 38);
  circle(820, 790, 210, [168, 106, 120], 42);
  circle(790, 196, 110, [159, 182, 217], 30);

  roundedRect(156, 150, 712, 724, 112, [255, 245, 216], 34);
  roundedRect(204, 192, 616, 638, 86, [11, 16, 36], 210);

  // main cozy chair / seat mark
  roundedRect(286, 298, 452, 116, 52, [246, 217, 141], 255);
  roundedRect(254, 420, 516, 196, 70, [214, 168, 79], 255);
  roundedRect(308, 508, 408, 104, 42, [255, 245, 216], 82);
  roundedRect(278, 618, 94, 178, 36, [246, 217, 141], 255);
  roundedRect(652, 618, 94, 178, 36, [246, 217, 141], 255);

  // puzzle grid spark lines
  line(230, 252, 794, 816, 16, [255, 245, 216], 62);
  line(794, 252, 230, 816, 16, [255, 245, 216], 42);

  // check mark
  line(380, 542, 470, 632, 42, [47, 111, 83], 255);
  line(470, 632, 654, 430, 42, [47, 111, 83], 255);
  line(380, 542, 470, 632, 18, [255, 245, 216], 95);
  line(470, 632, 654, 430, 18, [255, 245, 216], 95);

  // tiny seat legs shadow
  roundedRect(332, 800, 360, 34, 17, [0, 0, 0], 70);
}

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) {
    c ^= byte;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function pngBuffer() {
  const raw = Buffer.alloc((SIZE * 4 + 1) * SIZE);
  for (let y = 0; y < SIZE; y += 1) {
    const rowStart = y * (SIZE * 4 + 1);
    raw[rowStart] = 0;
    pixels.copy(raw, rowStart + 1, y * SIZE * 4, (y + 1) * SIZE * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(SIZE, 0);
  ihdr.writeUInt32BE(SIZE, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

drawIcon();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, pngBuffer());
console.log(`Generated SeatSavvy iOS icon at ${OUT}`);

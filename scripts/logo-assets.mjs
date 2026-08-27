/**
 * Prepara los assets de marca: quita el fondo blanco (y su sombra gris) del logo
 * y del favicon, y extrae el apretón en blanco para los botones con degradado.
 *
 * Uso: node scripts/logo-assets.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { deflateSync, inflateSync } from "node:zlib";

const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

/** Blanco puro del lienzo. */
const BG_MIN = 200;
/** Sombra gris: poco saturada y clara. */
const SHADOW_MIN = 150;
const SHADOW_SATURATION = 25;

function readChunks(buffer) {
  if (!buffer.subarray(0, 8).equals(SIGNATURE)) throw new Error("No es un PNG");
  const chunks = [];
  let offset = 8;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    chunks.push({ type, data });
    offset += 12 + length;
    if (type === "IEND") break;
  }
  return chunks;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

function unfilter(raw, width, height, channels) {
  const stride = width * channels;
  const out = Buffer.alloc(stride * height);
  let pos = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    const line = raw.subarray(pos, pos + stride);
    pos += stride;
    const row = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;

    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? row[x - channels] : 0;
      const up = prev ? prev[x] : 0;
      const upLeft = prev && x >= channels ? prev[x - channels] : 0;
      const value = line[x];
      switch (filter) {
        case 0:
          row[x] = value;
          break;
        case 1:
          row[x] = (value + left) & 0xff;
          break;
        case 2:
          row[x] = (value + up) & 0xff;
          break;
        case 3:
          row[x] = (value + ((left + up) >> 1)) & 0xff;
          break;
        case 4:
          row[x] = (value + paeth(left, up, upLeft)) & 0xff;
          break;
        default:
          throw new Error(`Filtro PNG desconocido: ${filter}`);
      }
    }
  }
  return out;
}

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "ascii");
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, tail]);
}

function encodeRgba(pixels, width, height) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function isBackground(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  if (min >= BG_MIN) return true;
  return max - min <= SHADOW_SATURATION && min >= SHADOW_MIN;
}

/** Solo se borra lo que toca el borde: el apretón blanco de dentro se conserva. */
function clearOutside(pixels, width, height) {
  const seen = new Uint8Array(width * height);
  const stack = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (seen[index]) return;
    const at = index * 4;
    if (!isBackground(pixels[at], pixels[at + 1], pixels[at + 2])) return;
    seen[index] = 1;
    stack.push(index);
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  let cleared = 0;
  while (stack.length) {
    const index = stack.pop();
    pixels[index * 4 + 3] = 0;
    cleared++;
    const x = index % width;
    const y = (index - x) / width;
    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }
  return cleared;
}

function decode(path) {
  const chunks = readChunks(readFileSync(path));
  const ihdr = chunks.find((c) => c.type === "IHDR");
  const width = ihdr.data.readUInt32BE(0);
  const height = ihdr.data.readUInt32BE(4);
  const depth = ihdr.data[8];
  const colorType = ihdr.data[9];
  const interlace = ihdr.data[12];

  if (depth !== 8 || interlace !== 0 || (colorType !== 2 && colorType !== 6)) {
    throw new Error(`${path}: solo RGB/RGBA de 8 bits sin entrelazar`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const idat = Buffer.concat(chunks.filter((c) => c.type === "IDAT").map((c) => c.data));
  const flat = unfilter(inflateSync(idat), width, height, channels);

  const pixels = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    pixels[i * 4] = flat[i * channels];
    pixels[i * 4 + 1] = flat[i * channels + 1];
    pixels[i * 4 + 2] = flat[i * channels + 2];
    pixels[i * 4 + 3] = channels === 4 ? flat[i * channels + 3] : 255;
  }
  return { pixels, width, height };
}

function stripFile(path) {
  const { pixels, width, height } = decode(path);
  const cleared = clearOutside(pixels, width, height);
  writeFileSync(path, encodeRgba(pixels, width, height));
  const percent = ((cleared / (width * height)) * 100).toFixed(1);
  console.log(`${path}: ${width}x${height}, ${percent}% transparente`);
}

/**
 * Extrae solo el apretón de manos en blanco (sin hexágono) recortado a su caja,
 * para usarlo dentro de botones con degradado, donde el hexágono se pierde.
 */
function buildGlyph(source, dest) {
  const { pixels, width, height } = decode(source);
  const alpha = new Uint8Array(width * height);
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  for (let i = 0; i < width * height; i++) {
    const at = i * 4;
    if (pixels[at + 3] < 200) continue;
    const min = Math.min(pixels[at], pixels[at + 1], pixels[at + 2]);
    const max = Math.max(pixels[at], pixels[at + 1], pixels[at + 2]);
    if (max - min > 45 || min < 160) continue;
    const value = Math.round(Math.min(1, (min - 160) / 70) * 255);
    if (value <= 0) continue;
    alpha[i] = value;
    const x = i % width;
    const y = (i - x) / width;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.06);
  const side = Math.max(maxX - minX, maxY - minY) + 1 + pad * 2;
  const offsetX = minX - Math.round((side - (maxX - minX + 1)) / 2);
  const offsetY = minY - Math.round((side - (maxY - minY + 1)) / 2);
  const out = Buffer.alloc(side * side * 4);

  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side; x++) {
      const sx = offsetX + x;
      const sy = offsetY + y;
      if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;
      const at = (y * side + x) * 4;
      out[at] = 255;
      out[at + 1] = 255;
      out[at + 2] = 255;
      out[at + 3] = alpha[sy * width + sx];
    }
  }

  writeFileSync(dest, encodeRgba(out, side, side));
  console.log(`${dest}: ${side}x${side} glifo blanco`);
}

stripFile("public/logo.png");
stripFile("src/app/icon.png");
buildGlyph("public/logo.png", "public/mark-handshake.png");

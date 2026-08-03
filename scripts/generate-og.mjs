/**
 * Generates a 1200×630 placeholder Open Graph image (public/og-image.png).
 * Pure Node (zlib) — no image libraries. Marked placeholder: swap for a real
 * social card whenever you have one. Run: `node scripts/generate-og.mjs`.
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const W = 1200
const H = 630

// Palette (matches the site theme).
const base = [22, 22, 22]
const accent = [223, 37, 49]

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

// Build raw RGBA scanlines with a soft radial accent glow from the upper-left.
const raw = Buffer.alloc((W * 3 + 1) * H)
const cx = W * 0.32
const cy = H * 0.28
const maxD = Math.hypot(W, H) * 0.7

let p = 0
for (let y = 0; y < H; y++) {
  raw[p++] = 0 // filter byte (none) per scanline
  for (let x = 0; x < W; x++) {
    const d = Math.hypot(x - cx, y - cy) / maxD
    const glow = Math.max(0, 1 - d) ** 2 * 0.35
    const [r, g, b] = mix(base, accent, glow)
    raw[p++] = r
    raw[p++] = g
    raw[p++] = b
  }
}

// PNG encoding helpers.
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = crc32(Buffer.concat([typeBuf, data]))
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc >>> 0, 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0)
ihdr.writeUInt32BE(H, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 2 // color type: RGB
ihdr[10] = 0
ihdr[11] = 0
ihdr[12] = 0

const png = Buffer.concat([
  sig,
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
writeFileSync(join(outDir, 'og-image.png'), png)
console.log('Wrote public/og-image.png (%d bytes)', png.length)

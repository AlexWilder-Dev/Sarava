// One-off: build public/og.jpg (1200×630 link preview) and the favicons from
// the room photo and the Sarava sign. Run with `npm run og`.
// Text is pre-outlined (scripts/og-text.json, src/brand/paths.ts) so the
// output does not depend on fonts installed on the machine.
import sharp from 'sharp'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const pub = (f) => path.join(root, 'public', f)

const brand = await readFile(path.join(root, 'src/brand/paths.ts'), 'utf8')
const grab = (key) => brand.match(new RegExp(`${key}: '([^']+)'`))[1]
const num = (key) => Number(brand.match(new RegExp(`\\b${key}: ([\\d.]+)`))[1])
const word = { d: grab('d'), w: num('width') }
const sun = { rays: grab('rays'), ripples: grab('ripples'), cx: num('cx'), cy: num('cy'), r: num('r'), stroke: num('stroke') }
const text = JSON.parse(await readFile(path.join(root, 'scripts/og-text.json'), 'utf8'))

const TEAL = '#2e9c95'
const TEAL_DEEP = '#146b66'
const RED = '#e5544b'
const GOLD = '#d9b865'
const GLASS = '#1c1a17'

function sunMark(color, x, y, size) {
  const s = size / 92
  const { cx, cy, r, stroke } = sun
  return `<g transform="translate(${x} ${y}) scale(${s}) translate(-4 -6)">
    <g fill="none" stroke="${color}" stroke-width="${stroke}">
      <path d="${sun.rays}"/><circle cx="${cx}" cy="${cy}" r="${r}"/><path d="${sun.ripples}"/>
    </g>
    <path d="M${cx - r} ${cy}A${r} ${r} 0 0 0 ${cx + r} ${cy}Z" fill="${color}"/>
  </g>`
}

// ---------- og.jpg ----------
const W = 1200
const H = 630
const fasciaH = 196
const wordW = 470
const wordScale = wordW / word.w
const wordH = 72 * wordScale
const markSize = 132
const gap = 36
const signW = wordW + gap + markSize
const signX = (W - signW) / 2

const plaqueW = 760
const plaqueH = 118
const plaqueX = (W - plaqueW) / 2
const plaqueY = H - plaqueH - 34

const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <rect x="0" y="${fasciaH}" width="${W}" height="${H - fasciaH}" fill="url(#shade)"/>
  <rect x="0" y="0" width="${W}" height="6" fill="#2a5fa0"/>
  <rect x="0" y="6" width="${W}" height="${fasciaH - 6}" fill="${TEAL}"/>
  <rect x="0" y="16" width="${W}" height="3" fill="#fff" opacity="0.1"/>
  <rect x="0" y="${fasciaH - 22}" width="${W}" height="3" fill="#000" opacity="0.1"/>
  <rect x="0" y="${fasciaH - 8}" width="${W}" height="8" fill="${TEAL_DEEP}"/>
  <g transform="translate(${signX} ${(fasciaH + wordH) / 2 + 2}) scale(${wordScale})">
    <path d="${word.d}" fill="${RED}"/>
  </g>
  ${sunMark(RED, signX + wordW + gap, (fasciaH - markSize) / 2 + 1, markSize)}
  <rect x="${plaqueX}" y="${plaqueY}" width="${plaqueW}" height="${plaqueH}" fill="${TEAL}"/>
  <rect x="${plaqueX + 9}" y="${plaqueY + 9}" width="${plaqueW - 18}" height="${plaqueH - 18}" fill="${GLASS}"/>
  <g transform="translate(${(W - text.tag.w) / 2 + 2.5} ${plaqueY + 58 + 2.5})"><path d="${text.tag.d}" fill="${TEAL_DEEP}"/></g>
  <g transform="translate(${(W - text.tag.w) / 2} ${plaqueY + 58})"><path d="${text.tag.d}" fill="${GOLD}"/></g>
  <g transform="translate(${(W - text.sub.w) / 2} ${plaqueY + 92})"><path d="${text.sub.d}" fill="#f3eee6" opacity="0.92"/></g>
</svg>`

const photo = await sharp(path.join(root, 'research/photos/Sarava1.jpg'))
  .resize({ width: W })
  .extract({ left: 0, top: 40, width: W, height: H - fasciaH + 40 })
  .toBuffer()

await sharp({ create: { width: W, height: H, channels: 3, background: GLASS } })
  .composite([
    { input: photo, top: fasciaH - 40, left: 0 },
    { input: Buffer.from(overlay), top: 0, left: 0 },
  ])
  .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(pub('og.jpg'))

const meta = await sharp(pub('og.jpg')).metadata()
const size = (await stat(pub('og.jpg'))).size
console.log(`og.jpg ${meta.width}×${meta.height} ${meta.format} ${(size / 1024).toFixed(1)} KB`)
if (meta.width !== 1200 || meta.height !== 630 || size > 300 * 1024) throw new Error('og.jpg out of spec')

// ---------- icons ----------
const icon = (px, radius) => `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${radius}" fill="${TEAL}"/>
  ${sunMark(RED, 10, 9, 80)}
</svg>`

await sharp(Buffer.from(icon(180, 0))).png().toFile(pub('apple-touch-icon.png'))
await sharp(Buffer.from(icon(32, 18))).png().toFile(pub('favicon-32.png'))
const svgIcon = icon(64, 18).replace(/ width="64" height="64"/, '')
await import('node:fs/promises').then((fs) => fs.writeFile(pub('favicon.svg'), svgIcon))
console.log('icons: favicon.svg, favicon-32.png, apple-touch-icon.png')

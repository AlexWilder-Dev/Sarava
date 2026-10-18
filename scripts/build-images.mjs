// One-off: resize the source photos in research/photos into web sizes.
// Run with `npm run images`. Output goes to public/photos.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const src = path.join(root, 'research/photos')
const out = path.join(root, 'public/photos')

const photos = {
  shopfront: 'zideli-shopfront.jpg',
  room: 'Sarava1.jpg',
  'hot-sauce': 'Sarava2.jpg',
  galette: 'BrixtonVillage-SaravaCreperie-1.jpg',
  sweet: 'Sarava-1.jpg',
  kitchen: 'BrixtonVillage-SaravaCreperie-2.jpg',
  salmon: 'deliveroo-tile.jpg',
}

const widths = [640, 1080, 1600]

await mkdir(out, { recursive: true })

for (const [name, file] of Object.entries(photos)) {
  for (const w of widths) {
    await sharp(path.join(src, file))
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 74 })
      .toFile(path.join(out, `${name}-${w}.webp`))
  }
  console.log('photo', name)
}

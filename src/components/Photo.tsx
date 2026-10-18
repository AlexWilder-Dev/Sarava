import type { CSSProperties } from 'react'
import type { Photo as PhotoData } from '../data/sarava'

const widths = [640, 1080, 1600]
const url = (name: string, w: number) => `${import.meta.env.BASE_URL}photos/${name}-${w}.webp`

interface Props {
  photo: PhotoData
  sizes?: string
  className?: string
  style?: CSSProperties
  eager?: boolean
}

export function Photo({ photo, sizes = '(min-width: 900px) 50vw, 100vw', className, style, eager }: Props) {
  return (
    <img
      src={url(photo.src, 1080)}
      srcSet={widths.map((w) => `${url(photo.src, w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      style={style}
    />
  )
}

type FrameKind = 'gilt' | 'wood' | 'red' | 'black'

interface FrameProps extends Props {
  kind?: FrameKind
  mat?: boolean
  tilt?: number
  ratio?: string
  caption?: string
  frameClass?: string
}

/** A photo hung like the pictures on Sarava's turquoise wall. */
export function Framed({ kind = 'wood', mat, tilt = 0, ratio, caption, frameClass, ...photo }: FrameProps) {
  const inner = <Photo {...photo} style={{ aspectRatio: ratio, ...photo.style }} />
  return (
    <figure
      className={`frame frame--${kind}${mat ? ' frame--mat' : ''}${frameClass ? ` ${frameClass}` : ''}`}
      style={{ '--tilt': `${tilt}deg` } as CSSProperties}
    >
      {mat ? <div className="frame__mat">{inner}</div> : inner}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

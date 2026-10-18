import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SUN, WORDMARK } from './paths'

const ease = [0.65, 0, 0.35, 1] as const

interface SunMarkProps {
  /** Day shows the full sun; night sinks it below the horizon into the ripples. */
  night?: boolean
  className?: string
  title?: string
}

export function SunMark({ night = false, className, title }: SunMarkProps) {
  const clip = useId()
  const reduce = useReducedMotion()
  const t = (delay = 0) => ({ duration: reduce ? 0 : 1.1, ease, delay: reduce ? 0 : delay })
  const { cx, cy, r, stroke } = SUN
  const upperArc = `M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}`

  return (
    <svg
      viewBox="4 6 92 92"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="0" width="100" height={cy} />
        </clipPath>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth={stroke}>
        <motion.path
          d={SUN.rays}
          style={{ originX: 0.5, originY: 1 }}
          initial={false}
          animate={{ scale: night ? 0.45 : 1, opacity: night ? 0 : 1 }}
          transition={t(night ? 0 : 0.35)}
        />
        <g clipPath={`url(#${clip})`}>
          <motion.path
            d={upperArc}
            initial={false}
            animate={{ y: night ? r + stroke : 0 }}
            transition={t(night ? 0.2 : 0)}
          />
        </g>
        <path d={`M${cx - r} ${cy}A${r} ${r} 0 0 0 ${cx + r} ${cy}`} />
        <path d={SUN.ripples} />
      </g>
      <path d={`M${cx - r} ${cy}A${r} ${r} 0 0 0 ${cx + r} ${cy}Z`} fill="currentColor" />
    </svg>
  )
}

export function Wordmark({ className, title = 'Sarava' }: { className?: string; title?: string }) {
  return (
    <svg viewBox={`-1 -73 ${WORDMARK.width + 2} 76`} className={className} role="img" aria-label={title}>
      <path d={WORDMARK.d} fill="currentColor" />
    </svg>
  )
}

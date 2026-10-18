import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

export type Base = 'crepe' | 'galette'

export const baseCopy: Record<Base, { name: string; flour: string; line: string }> = {
  crepe: {
    name: 'Crêpe',
    flour: 'White flour',
    line: 'Light and golden. The house pick for sweet. Made with wheat flour, egg and milk.',
  },
  galette: {
    name: 'Galette',
    flour: 'Buckwheat',
    line: 'Nutty, darker and crisp at the edge. The house pick for savoury. Vegan and gluten-free.',
  },
}

// Seeded scatter so the lace pattern is the same on every render.
function scatter(seed: number, n: number) {
  let s = seed
  const rnd = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
  return Array.from({ length: n }, () => {
    const a = rnd() * Math.PI * 2
    const d = Math.sqrt(rnd()) * 40
    return { x: 50 + Math.cos(a) * d, y: 50 + Math.sin(a) * d, r: 0.6 + rnd() * 2.6, o: 0.25 + rnd() * 0.5 }
  })
}

function Pancake({ base }: { base: Base }) {
  const spots = useMemo(() => scatter(base === 'crepe' ? 7 : 19, base === 'crepe' ? 70 : 140), [base])
  const crepe = base === 'crepe'
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id={`pg-${base}`} cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor={crepe ? '#f4cf91' : '#9a6747'} />
          <stop offset="0.75" stopColor={crepe ? '#e7b06b' : '#80513a'} />
          <stop offset="1" stopColor={crepe ? '#c98a45' : '#5e3a26'} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#pg-${base})`} />
      {spots.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={crepe ? p.r : p.r * 0.45}
          fill={crepe ? '#b8742f' : i % 3 ? '#3f2618' : '#b78a64'}
          opacity={p.o}
        />
      ))}
      <circle cx="50" cy="50" r="45.5" fill="none" stroke={crepe ? '#b8742f' : '#3f2618'} strokeWidth="1.4" opacity="0.7" />
    </svg>
  )
}

interface Props {
  base: Base
  onChange: (b: Base) => void
  size?: 'large' | 'small'
}

export function BaseSwitch({ base, onChange, size = 'small' }: Props) {
  const reduce = useReducedMotion()
  return (
    <div className={`base-switch base-switch--${size}`}>
      <button
        type="button"
        className="base-switch__pan"
        onClick={() => onChange(base === 'crepe' ? 'galette' : 'crepe')}
        aria-label={`Flip to ${base === 'crepe' ? 'buckwheat galette' : 'flour crêpe'}`}
      >
        <motion.span
          className="base-switch__flip"
          initial={false}
          animate={{ rotateY: base === 'galette' ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 16 }}
        >
          <span className="base-switch__face">
            <Pancake base="crepe" />
          </span>
          <span className="base-switch__face base-switch__face--back">
            <Pancake base="galette" />
          </span>
        </motion.span>
      </button>
      <div className="base-switch__options" role="radiogroup" aria-label="Choose your base">
        {(['crepe', 'galette'] as Base[]).map((b) => (
          <button
            key={b}
            type="button"
            role="radio"
            aria-checked={base === b}
            className={`base-switch__opt${base === b ? ' is-on' : ''}`}
            onClick={() => onChange(b)}
          >
            <span className="base-switch__name">{baseCopy[b].name}</span>
            <span className="base-switch__flour">{baseCopy[b].flour}</span>
            {b === 'galette' && <span className="tag tag--gf">Vegan · GF</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

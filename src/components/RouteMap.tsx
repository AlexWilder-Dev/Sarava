import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { SUN } from '../brand/paths'

// Schematic of the Coldharbour Lane end of Granville Arcade, after the
// official Brixton Village map: in through the Courtyard, right-hand avenue
// (Second Avenue), Sarava at 41–42 on the right, opposite 77–78.

const route: [number, number][] = [
  [214, 512],
  [214, 404],
  [214, 186],
  [242, 186],
]

const segs = route.slice(1).map((p, i) => Math.hypot(p[0] - route[i][0], p[1] - route[i][1]))
const total = segs.reduce((a, b) => a + b, 0)

function pointAt(t: number): [number, number] {
  let d = t * total
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const k = Math.min(1, d / segs[i])
      const [x1, y1] = route[i]
      const [x2, y2] = route[i + 1]
      return [x1 + (x2 - x1) * k, y1 + (y2 - y1) * k]
    }
    d -= segs[i]
  }
  return route[route.length - 1]
}

export const steps = [
  { at: 0.12, title: 'Coldharbour Lane', text: 'Head into Brixton Village by the Courtyard on Coldharbour Lane.' },
  { at: 0.34, title: 'Take the right-hand avenue', text: 'Two avenues lead in from the Courtyard. Take the one on the right: Second Avenue.' },
  { at: 0.62, title: 'Walk up a short way', text: 'Pass units 47, 46, 45 and 43–44 on your right.' },
  { at: 1, title: 'Teal front, red sign', text: 'Sarava is on your right at 41–42, opposite 77–78. Tables are out front.' },
]

const rightUnits = [
  { y: 330, h: 62, label: '1 · 48 · 49' },
  { y: 300, h: 28, label: '47' },
  { y: 272, h: 26, label: '46' },
  { y: 244, h: 26, label: '45' },
  { y: 210, h: 32, label: '43–44' },
  { y: 112, h: 34, label: '40' },
  { y: 80, h: 30, label: '39' },
  { y: 40, h: 38, label: '38' },
]

const lanterns = [
  { x: 196, y: 150, c: '#8fb3d9' },
  { x: 232, y: 128, c: '#e88f86' },
  { x: 200, y: 232, c: '#cfd96a' },
  { x: 230, y: 268, c: '#8a7f3e' },
  { x: 198, y: 318, c: '#f4f1ea' },
  { x: 228, y: 356, c: '#3d7fb3' },
]

export function RouteMap({ big = false }: { big?: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const progress = useMotionValue(reduce ? 1 : 0)
  const [p, setP] = useState(reduce ? 1 : 0)
  const dash = useTransform(progress, (v) => v)

  const run = (to = 1, from?: number) => {
    if (from !== undefined) progress.set(from)
    const dist = Math.abs(to - progress.get())
    return animate(progress, to, { duration: reduce ? 0 : 1 + dist * 3.2, ease: [0.45, 0, 0.25, 1] })
  }

  useEffect(() => progress.on('change', setP), [progress])
  useEffect(() => {
    if (inView) {
      const c = run(1, 0)
      return () => c.stop()
    }
  }, [inView])

  const [wx, wy] = pointAt(p)
  const active = steps.reduce((acc, s, i) => (p >= s.at - 0.02 ? i : acc), -1)
  const d = `M${route.map((q) => q.join(' ')).join('L')}`

  return (
    <div className={`route${big ? ' route--big' : ''}`}>
      <svg ref={ref} viewBox="0 0 360 540" className="route__map" role="img" aria-labelledby="route-title route-desc">
        <title id="route-title">Map: Sarava in Brixton Village</title>
        <desc id="route-desc">
          From Coldharbour Lane, go through Brixton Village Courtyard and take the right-hand avenue, Second Avenue.
          Sarava is on the right at units 41 to 42, opposite 77 to 78.
        </desc>

        {/* street */}
        <rect x="0" y="470" width="360" height="70" className="route__street" />
        <text x="106" y="511" textAnchor="middle" className="route__street-label">
          COLDHARBOUR LANE
        </text>

        {/* courtyard */}
        <path d="M70 470 L300 470 L268 400 L124 400 Z" className="route__floor" />
        <path d="M86 448 Q118 458 150 448 T214 448 T278 446" className="route__lights" />
        {[96, 118, 140, 162, 184, 206, 228, 250, 272].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 ? 452 : 449} r="2.2" className="route__bulb" />
        ))}
        <text x="204" y="432" textAnchor="end" className="route__small">
          Brixton Village Courtyard
        </text>

        {/* left avenue, heading off into the rest of the Village */}
        <path d="M124 400 L150 400 L92 300 L64 312 Z" className="route__floor" />
        <text x="76" y="372" className="route__small route__muted" transform="rotate(-60 76 372)">
          into the Village
        </text>

        {/* Second Avenue */}
        <rect x="190" y="20" width="50" height="384" className="route__floor" />
        <text x="215" y="60" textAnchor="middle" className="route__avenue" transform="rotate(-90 215 60)">
          SECOND AVENUE
        </text>

        {/* units, right side */}
        {rightUnits.map((u) => (
          <g key={u.label}>
            <rect x="244" y={u.y} width="96" height={u.h} className="route__unit" />
            <text x="292" y={u.y + u.h / 2 + 4} textAnchor="middle" className="route__small route__muted">
              {u.label}
            </text>
          </g>
        ))}

        {/* Sarava */}
        <g className="route__sarava">
          <rect x="244" y="150" width="96" height="58" />
          <g transform="translate(311 162) scale(0.3)">
            <g fill="none" stroke="var(--red)" strokeWidth={SUN.stroke * 1.4}>
              <path d={SUN.rays} />
              <circle cx={SUN.cx} cy={SUN.cy} r={SUN.r} />
              <path d={SUN.ripples} />
            </g>
          </g>
          <text x="256" y="176" className="route__sarava-name">
            SARAVA
          </text>
          <text x="256" y="195" className="route__small route__sarava-unit">
            41–42
          </text>
        </g>

        {/* left side of Second Avenue, with Fifth and Sixth Avenue */}
        <rect x="120" y="150" width="66" height="58" className="route__unit" />
        <text x="153" y="183" textAnchor="middle" className="route__small route__muted">
          77–78
        </text>
        <rect x="120" y="40" width="66" height="96" className="route__unit" />
        <path d="M120 212 L186 212 L186 236 L120 236 Z" className="route__floor" />
        <text x="126" y="228" className="route__tiny route__muted">
          Fifth Ave
        </text>
        <rect x="120" y="240" width="66" height="60" className="route__unit" />
        <path d="M120 304 L186 304 L186 328 L120 328 Z" className="route__floor" />
        <text x="126" y="320" className="route__tiny route__muted">
          Sixth Ave
        </text>
        <rect x="150" y="332" width="36" height="64" className="route__unit" />

        {/* paper lanterns strung over the avenue */}
        {lanterns.map((l) => (
          <circle key={`${l.x}-${l.y}`} cx={l.x} cy={l.y} r="7" fill={l.c} className="route__lantern" />
        ))}

        {/* the walk */}
        <path d={d} className="route__path-bg" />
        <motion.path d={d} className="route__path" style={{ pathLength: dash }} />
        <g transform={`translate(${wx} ${wy})`}>
          <circle r="12" className="route__you-halo" />
          <circle r="6.5" className="route__you" />
        </g>
      </svg>

      <ol className="route__steps">
        {steps.map((s, i) => (
          <li key={s.title} className={i <= active ? 'is-done' : ''}>
            <button type="button" onClick={() => run(s.at)} aria-label={`Show step ${i + 1}: ${s.title}`}>
              <span className="route__num sign sign--plain">{i + 1}</span>
              <span>
                <strong>{s.title}</strong>
                <span className="route__text">{s.text}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn--ghost route__replay" onClick={() => run(1, 0)}>
        Walk it again
      </button>
    </div>
  )
}

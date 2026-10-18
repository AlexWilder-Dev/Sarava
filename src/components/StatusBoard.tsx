import { motion, AnimatePresence } from 'framer-motion'
import { happyHour } from '../data/sarava'
import { useMode } from '../lib/mode'
import { fmt, status, statusLine } from '../lib/time'

/** Live open/closed and happy-hour lettering, painted like their window board. */
export function StatusBoard({ compact = false }: { compact?: boolean }) {
  const { now } = useMode()
  const s = status(now)
  const line = statusLine(s)
  const open = s.kind === 'open'
  const hhLater = open && !s.happyHour && now.minutes < happyHour.start && s.closes > happyHour.start

  return (
    <div className={`status glass${compact ? ' status--compact' : ''}`} role="status" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={line}
          className="status__line sign"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          <span className={`status__dot${open ? ' is-open' : ''}`} aria-hidden="true" />
          {line}
        </motion.p>
      </AnimatePresence>
      {!compact && (
        <div className="status__board">
          <p className="status__hh sign">
            {happyHour.line} <span className="status__times">{fmt(happyHour.start)}–{fmt(happyHour.end)}</span>
          </p>
          <p className="status__list sign sign--plain">
            {happyHour.cocktails.join(' · ')} & more
          </p>
          {hhLater && <p className="status__note">Happy hour starts at {fmt(happyHour.start)} today.</p>}
        </div>
      )}
    </div>
  )
}

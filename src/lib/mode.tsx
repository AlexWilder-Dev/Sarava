import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isBarTime, londonNow, type LondonNow } from './time'

export type Mode = 'cafe' | 'bar'

interface ModeState {
  now: LondonNow
  mode: Mode
  auto: boolean
  setMode: (m: Mode) => void
  toggle: () => void
}

const ModeContext = createContext<ModeState | null>(null)

export function ModeProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState(() => londonNow())
  const [override, setOverride] = useState<Mode | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => setNow(londonNow()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const autoMode: Mode = isBarTime(now) ? 'bar' : 'cafe'
  const mode = override ?? autoMode

  useEffect(() => {
    document.documentElement.dataset.mode = mode
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', mode === 'bar' ? '#1c1a17' : '#2e9c95')
  }, [mode])

  const value = useMemo<ModeState>(
    () => ({
      now,
      mode,
      auto: override === null,
      setMode: (m) => setOverride(m === autoMode ? null : m),
      toggle: () => setOverride((cur) => {
        const next = (cur ?? autoMode) === 'bar' ? 'cafe' : 'bar'
        return next === autoMode ? null : next
      }),
    }),
    [now, mode, override, autoMode],
  )

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode outside ModeProvider')
  return ctx
}

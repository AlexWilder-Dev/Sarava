import { dayNames, dayOrder, happyHour, hours, type DayKey } from '../data/sarava'

const keys: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export interface LondonNow {
  day: DayKey
  minutes: number
  /** YYYY-MM-DD in London. */
  date: string
}

export function londonNow(at: Date = new Date()): LondonNow {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(at)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const day = get('weekday').slice(0, 3).toLowerCase() as DayKey
  return {
    day,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    date: `${get('year')}-${get('month')}-${get('day')}`,
  }
}

export function fmt(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function dayKeyForDate(date: string): DayKey {
  const [y, m, d] = date.split('-').map(Number)
  return keys[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
}

export type Status =
  | { kind: 'open'; closes: number; closingSoon: boolean; happyHour: boolean; happyHourEnds: number }
  | { kind: 'closed'; opensDay: DayKey; opens: number; today: boolean; tomorrow: boolean }

export function status(now: LondonNow): Status {
  const today = hours[now.day]
  if (now.minutes >= today.open && now.minutes < today.close) {
    const hhEnd = Math.min(happyHour.end, today.close)
    return {
      kind: 'open',
      closes: today.close,
      closingSoon: today.close - now.minutes <= 30,
      happyHour: now.minutes >= happyHour.start && now.minutes < hhEnd,
      happyHourEnds: hhEnd,
    }
  }
  if (now.minutes < today.open) {
    return { kind: 'closed', opensDay: now.day, opens: today.open, today: true, tomorrow: false }
  }
  const idx = dayOrder.indexOf(now.day)
  const next = dayOrder[(idx + 1) % 7]
  return { kind: 'closed', opensDay: next, opens: hours[next].open, today: false, tomorrow: true }
}

export function statusLine(s: Status): string {
  if (s.kind === 'open') {
    if (s.happyHour) return `Happy hour now · cocktails ${happyHour.price} till ${fmt(s.happyHourEnds)}`
    return s.closingSoon ? `Closing soon · ${fmt(s.closes)}` : `Open now · till ${fmt(s.closes)}`
  }
  if (s.today) return `Closed · opens ${fmt(s.opens)} today`
  return `Closed · opens ${dayNames[s.opensDay]} ${fmt(s.opens)}`
}

/** Bar mode from the start of happy hour until the small hours. */
export function isBarTime(now: LondonNow): boolean {
  return now.minutes >= happyHour.start || now.minutes < 4 * 60
}

/** Half-hour booking slots from opening to an hour before closing. */
export function slotsFor(date: string): number[] {
  const h = hours[dayKeyForDate(date)]
  const out: number[] = []
  for (let t = h.open; t <= h.close - 60; t += 30) out.push(t)
  return out
}

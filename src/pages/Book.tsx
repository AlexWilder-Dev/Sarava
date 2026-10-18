import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SunMark } from '../brand/Logo'
import { Framed } from '../components/Photo'
import { booking, business, dayNames, hours, photos } from '../data/sarava'
import { useMode } from '../lib/mode'
import { dayKeyForDate, fmt, slotsFor } from '../lib/time'

type Sent = { kind: 'table' | 'party'; summary: string[]; name: string } | null

const partyTypes = [...booking.types.filter((t) => t !== 'Dinner' && t !== 'Drinks'), 'Something else']

function longDate(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  )
}

function TableForm({ onSent, toParty }: { onSent: (s: Sent) => void; toParty: () => void }) {
  const { now } = useMode()
  const [date, setDate] = useState(now.date)
  const [size, setSize] = useState('2')
  const [type, setType] = useState(booking.types[0])
  const [time, setTime] = useState<number | null>(null)
  const [error, setError] = useState('')

  const slots = useMemo(() => {
    const all = slotsFor(date)
    return date === now.date ? all.filter((t) => t > now.minutes + 15) : all
  }, [date, now])

  const day = dayKeyForDate(date)

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (time === null) {
      setError('Pick a time for your table.')
      document.getElementById('slot-group')?.focus()
      return
    }
    setError('')
    const first = String(f.get('first') || '')
    onSent({
      kind: 'table',
      name: first,
      summary: [
        `${longDate(date)} at ${fmt(time)}`,
        `${size} ${size === '1' ? 'person' : 'people'} · ${type}`,
        `Confirmation to ${f.get('email')}`,
      ],
    })
  }

  return (
    <form className="form" onSubmit={submit} noValidate={false}>
      <p className="policy">
        <strong>Booking policy:</strong> tables are held for {booking.holdMinutes} minutes.
      </p>
      <div className="form__row">
        <label>
          <span>Date</span>
          <input
            type="date"
            name="date"
            required
            min={now.date}
            value={date}
            onChange={(e) => {
              setDate(e.target.value || now.date)
              setTime(null)
            }}
          />
        </label>
        <label>
          <span>
            Party size <em>max {booking.maxParty}</em>
          </span>
          <select
            name="size"
            value={size}
            onChange={(e) => (e.target.value === 'more' ? toParty() : setSize(e.target.value))}
          >
            {Array.from({ length: booking.maxParty }, (_, i) => String(i + 1)).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
            <option value="more">More than {booking.maxParty}…</option>
          </select>
        </label>
      </div>
      <label>
        <span>Booking type</span>
        <select name="type" value={type} onChange={(e) => setType(e.target.value)}>
          {booking.types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <fieldset className="slots" id="slot-group" tabIndex={-1} aria-describedby="slot-help">
        <legend>
          Time <span className="muted" id="slot-help">· {dayNames[day]} {fmt(hours[day].open)}–{fmt(hours[day].close)}</span>
        </legend>
        {slots.length ? (
          <div className="slots__grid">
            {slots.map((t) => (
              <button
                type="button"
                key={t}
                className={`slot${time === t ? ' is-on' : ''}`}
                aria-pressed={time === t}
                onClick={() => setTime(t)}
              >
                {fmt(t)}
              </button>
            ))}
          </div>
        ) : (
          <p className="muted">No more tables today. Try another date.</p>
        )}
        {error && <p className="form__error" role="alert">{error}</p>}
      </fieldset>

      <div className="form__row">
        <label>
          <span>First name</span>
          <input name="first" required autoComplete="given-name" />
        </label>
        <label>
          <span>Last name</span>
          <input name="last" required autoComplete="family-name" />
        </label>
      </div>
      <div className="form__row">
        <label>
          <span>Email</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          <span>
            Phone <em>optional</em>
          </span>
          <input type="tel" name="phone" autoComplete="tel" placeholder="+44 …" />
        </label>
      </div>
      <label>
        <span>
          Special requests <em>optional</em>
        </span>
        <textarea name="requests" rows={3} placeholder="Allergies, celebrations, seating preferences…" />
      </label>
      <label className="check">
        <input type="checkbox" name="optin" />
        <span>{booking.optIn}</span>
      </label>
      <button type="submit" className="btn btn--red form__submit">
        Confirm reservation
      </button>
    </form>
  )
}

function PartyForm({ onSent }: { onSent: (s: Sent) => void }) {
  const { now } = useMode()
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const date = String(f.get('date') || '')
    onSent({
      kind: 'party',
      name: String(f.get('name') || '').split(' ')[0],
      summary: [
        `${f.get('occasion')} for about ${f.get('guests')}`,
        date ? longDate(date) : 'Date to be agreed',
        `Reply to ${f.get('email')}`,
      ],
    })
  }
  return (
    <form className="form" onSubmit={submit}>
      <p className="policy">
        For more than {booking.maxParty}, private hire or a party. Tell Sarava what you have in mind and they will come
        back to you.
      </p>
      <div className="form__row">
        <label>
          <span>Occasion</span>
          <select name="occasion" defaultValue={partyTypes[0]}>
            {partyTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Roughly how many?</span>
          <input type="number" name="guests" min={booking.maxParty + 1} max={200} defaultValue={10} required inputMode="numeric" />
        </label>
      </div>
      <label>
        <span>
          Date <em>if you have one</em>
        </span>
        <input type="date" name="date" min={now.date} />
      </label>
      <div className="form__row">
        <label>
          <span>Your name</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
      </div>
      <label>
        <span>
          Phone <em>optional</em>
        </span>
        <input type="tel" name="phone" autoComplete="tel" />
      </label>
      <label>
        <span>What are you planning?</span>
        <textarea name="message" rows={4} placeholder="Time, food, drinks, anything we should know…" />
      </label>
      <button type="submit" className="btn btn--red form__submit">
        Send enquiry
      </button>
    </form>
  )
}

export default function Book() {
  const [params, setParams] = useSearchParams()
  const party = params.get('party') === '1'
  const [sent, setSent] = useState<Sent>(null)
  const top = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sent) top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [sent])

  const setParty = (p: boolean) => {
    setSent(null)
    setParams(p ? { party: '1' } : {}, { replace: true })
  }

  return (
    <div className="book-page">
      <header className="page-head wrap">
        <p className="caps kicker">Book</p>
        <h1>{party ? 'Parties & private hire' : 'Book a table'}</h1>
        <p className="lede">
          Up to {booking.maxParty} online, bigger groups by enquiry. Prefer to talk?{' '}
          <a href={business.phone.href}>{business.phone.display}</a>
        </p>
      </header>

      <div className="wrap book-grid">
        <div ref={top} className="book-main">
          <div className="tabs" role="tablist" aria-label="Booking type">
            <button type="button" role="tab" aria-selected={!party} className={!party ? 'is-on' : ''} onClick={() => setParty(false)}>
              Table for 1–{booking.maxParty}
            </button>
            <button type="button" role="tab" aria-selected={party} className={party ? 'is-on' : ''} onClick={() => setParty(true)}>
              {booking.maxParty + 1}+ or private hire
            </button>
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                className="sent glass"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                role="status"
              >
                <SunMark className="sent__mark" />
                <p className="sign sent__title">
                  {sent.kind === 'table' ? `Booked${sent.name ? `, ${sent.name}` : ''}!` : `Thanks${sent.name ? `, ${sent.name}` : ''}!`}
                </p>
                <ul>
                  {sent.summary.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                <p className="sent__see">
                  {sent.kind === 'table'
                    ? 'See you on Second Avenue. Look for the teal front and the red sign.'
                    : 'Sarava will be in touch to sort the details.'}
                </p>
                <p className="sent__demo">Demo only: nothing has been sent.</p>
                <button type="button" className="btn btn--gold" onClick={() => setSent(null)}>
                  Make another
                </button>
              </motion.div>
            ) : (
              <motion.div key={party ? 'party' : 'table'} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {party ? <PartyForm onSent={setSent} /> : <TableForm onSent={setSent} toParty={() => setParty(true)} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="book-aside">
          <div className="glass book-aside__board">
            <p className="sign">Weekend brunch fills up</p>
            <p>
              Doors open at {fmt(hours.sat.open)} on Saturdays and Sundays. Book ahead, especially for bottomless.
            </p>
          </div>
          <Framed
            photo={photos.shopfront}
            kind="black"
            ratio="4 / 3"
            sizes="(min-width: 900px) 380px, 92vw"
            caption="Look for the teal front on Second Avenue"
          />
        </aside>
      </div>
    </div>
  )
}

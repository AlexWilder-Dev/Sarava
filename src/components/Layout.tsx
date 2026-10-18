import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { SunMark, Wordmark } from '../brand/Logo'
import { useMode } from '../lib/mode'
import { business, links, photos } from '../data/sarava'
import { IconPhone, IconPin, IconTable } from './Icons'

export function Fascia() {
  const { mode, toggle } = useMode()
  const night = mode === 'bar'
  const onHome = useLocation().pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 150)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fascia${onHome && !scrolled ? ' fascia--bare' : ''}`}>
      <div className="wrap fascia__inner">
        <Link to="/" className="fascia__home" aria-label="Sarava, home">
          <Wordmark className="fascia__word" title="Sarava" />
        </Link>
        <button
          type="button"
          className="sun-toggle"
          onClick={toggle}
          aria-pressed={night}
          aria-label={night ? 'Bar mode on. Switch to café mode' : 'Café mode on. Switch to bar mode'}
          title={night ? 'Bring the sun back up' : 'Set the sun: bar mode'}
        >
          <SunMark night={night} />
        </button>
        <nav className="fascia__nav" aria-label="Main">
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/book">Book</NavLink>
          <NavLink to="/find-us">Find us</NavLink>
          <a className="only-wide" href={business.instagram.url} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
      </div>
    </header>
  )
}

export function ActionBar() {
  return (
    <nav className="action-bar" aria-label="Quick actions">
      <Link to="/book">
        <IconTable /> Book
      </Link>
      <a href={business.phone.href}>
        <IconPhone /> Call
      </a>
      <a href={links.directions} target="_blank" rel="noreferrer">
        <IconPin /> Directions
      </a>
    </nav>
  )
}

export function Footer() {
  const a = business.address
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div className="footer__logo">
            <SunMark />
            <Wordmark />
            <span className="footer__since">BRIXTON VILLAGE SINCE {business.since}</span>
          </div>
          <div>
            <h2>Find us</h2>
            <address style={{ fontStyle: 'normal' }}>
              {a.unit}
              <br />
              {a.avenue}, {a.market}
              <br />
              {a.street}, {a.city} {a.postcode}
            </address>
            <p style={{ marginTop: 10 }}>
              <Link to="/find-us">Directions & hours</Link>
            </p>
          </div>
          <div>
            <h2>Talk to us</h2>
            <ul>
              <li>
                <a href={business.phone.href}>{business.phone.display}</a>
              </li>
              <li>
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </li>
              <li>
                <a href={business.instagram.url} target="_blank" rel="noreferrer">
                  Instagram {business.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Eat at home</h2>
            <ul>
              <li>
                <a href={links.deliveroo} target="_blank" rel="noreferrer">
                  Deliveroo
                </a>
              </li>
              <li>
                <a href={links.uberEats} target="_blank" rel="noreferrer">
                  Uber Eats
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__base">
          <span>
            Photos: {photos.room.credit}; shopfront and salmon galette from Sarava.
          </span>
          <span>Site by AlexWilder-Dev</span>
        </div>
      </div>
    </footer>
  )
}

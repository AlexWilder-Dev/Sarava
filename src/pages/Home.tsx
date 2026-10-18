import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SunMark, Wordmark } from '../brand/Logo'
import { BaseSwitch, baseCopy, type Base } from '../components/BaseSwitch'
import { IconArrow, IconExternal, IconPhone, IconPin, IconTable } from '../components/Icons'
import { Framed } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { RouteMap } from '../components/RouteMap'
import { StatusBoard } from '../components/StatusBoard'
import { booking, business, happyHour, hours, links, menu, photos, press } from '../data/sarava'
import { useMode } from '../lib/mode'
import { fmt } from '../lib/time'

const picks = ['Spaniard', 'Juarito', 'Complete', 'Nutella Rocks']
const allItems = menu.flatMap((s) => s.items.map((i) => ({ ...i, section: s.id })))
const pickItems = picks.map((n) => allItems.find((i) => i.name === n)!).filter(Boolean)

function Hero() {
  const { mode, toggle } = useMode()
  return (
    <section className="hero">
      <div className="hero__fascia">
        <div className="wrap hero__sign">
          <Wordmark className="hero__word" title="Sarava" />
          <button
            type="button"
            className="hero__mark"
            onClick={toggle}
            aria-pressed={mode === 'bar'}
            aria-label={mode === 'bar' ? 'Bar mode on. Switch to café mode' : 'Café mode on. Switch to bar mode'}
          >
            <SunMark night={mode === 'bar'} />
          </button>
        </div>
      </div>
      <div className="wrap hero__body">
        <div className="hero__text">
          <p className="caps kicker">Crêpes · galettes · tapas · cocktails</p>
          <h1>French crêpes with Brazilian flair.</h1>
          <p className="lede">
            {business.bio} In Brixton Village since {business.since}: coffee and crêpes by day, cocktails from{' '}
            {fmt(happyHour.start)}.
          </p>
          <div className="hero__actions">
            <Link to="/book" className="btn btn--red">
              <IconTable /> Book a table
            </Link>
            <a href={business.phone.href} className="btn btn--ghost">
              <IconPhone /> {business.phone.display}
            </a>
            <a href={links.directions} className="btn btn--ghost" target="_blank" rel="noreferrer">
              <IconPin /> Directions
            </a>
          </div>
        </div>
        <div className="hero__window">
          <StatusBoard />
          <p className="hero__where">
            {business.address.unit}, {business.address.avenue} · {business.address.postcode}
          </p>
        </div>
      </div>
    </section>
  )
}

function FlourOrBuckwheat() {
  const [base, setBase] = useState<Base>('galette')
  return (
    <section className="section bases" aria-labelledby="bases-title">
      <div className="wrap bases__grid">
        <Reveal className="bases__switch">
          <BaseSwitch base={base} onChange={setBase} size="large" />
        </Reveal>
        <Reveal className="bases__text" delay={0.1}>
          <p className="caps kicker">Every dish, two ways</p>
          <h2 id="bases-title">Flour or buckwheat?</h2>
          <p className="lede bases__line" aria-live="polite">
            <strong>{baseCopy[base].name}.</strong> {baseCopy[base].line}
          </p>
          <p className="muted">
            Any filling on the menu goes on either. In their words: “{business.galetteLine}”
          </p>
          <ul className="picks">
            {pickItems.map((item) => (
              <li key={item.name}>
                <span className="picks__name">
                  {item.name}
                  {item.diet && <span className={`tag tag--${item.diet}`}>{item.diet}</span>}
                </span>
                <span className="picks__note">
                  {item.note ?? (item.popular ? 'Popular' : '')}
                </span>
                <span className="picks__price sign sign--plain">£{item.price}</span>
              </li>
            ))}
          </ul>
          <Link to="/menu" className="link-arrow">
            The whole menu, with vegan and veggie filters <IconArrow />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function HotSauce() {
  return (
    <section className="section sauce" aria-labelledby="sauce-title">
      <div className="wrap sauce__grid">
        <Reveal className="sauce__photo">
          <Framed photo={photos.hotSauce} kind="red" tilt={-1.5} ratio="3 / 2" sizes="(min-width: 900px) 560px, 92vw" />
        </Reveal>
        <Reveal className="sauce__text" delay={0.1}>
          <p className="sign sauce__sign" id="sauce-title">
            Signature chilli sauce
          </p>
          <p className="lede">
            Homemade at Sarava, and the bottle reviewers keep coming back to. Try it the way the kitchen pours it: over
            a galette with a fried egg.
          </p>
          <p className="muted">Ordering in? Add a pot for £1.60.</p>
        </Reveal>
      </div>
    </section>
  )
}

function DayAndNight() {
  const { mode, setMode } = useMode()
  const sun = hours.sun
  return (
    <section className="section daynight" aria-labelledby="daynight-title">
      <div className="wrap">
        <Reveal>
          <p className="caps kicker">Café by day, bar by night</p>
          <h2 id="daynight-title">When the sun goes down on Second Avenue</h2>
        </Reveal>
        <div className="daynight__grid">
          <article className={`daynight__panel daynight__day${mode === 'cafe' ? ' is-now' : ''}`}>
            <button type="button" className="daynight__sun" onClick={() => setMode('cafe')} aria-pressed={mode === 'cafe'}>
              <SunMark />
              <span className="visually-hidden">Show café mode</span>
            </button>
            <h3>By day</h3>
            <p>
              Coffee, chai and a crêpe at a table in the Village. Doors open at {fmt(hours.mon.open)} Monday to Thursday,{' '}
              {fmt(sun.open)} Friday to Sunday.
            </p>
            <p>
              Lunch is the easy time to get a table fast. Weekend brunch is the busy one, so book ahead, especially for
              bottomless.
            </p>
            <Framed photo={photos.kitchen} kind="wood" ratio="3 / 2" tilt={1} sizes="(min-width: 900px) 520px, 90vw" />
          </article>
          <article className={`daynight__panel daynight__night glass${mode === 'bar' ? ' is-now' : ''}`}>
            <button type="button" className="daynight__sun" onClick={() => setMode('bar')} aria-pressed={mode === 'bar'}>
              <SunMark night />
              <span className="visually-hidden">Show bar mode</span>
            </button>
            <h3 className="sign daynight__hh">
              {happyHour.line}
              <span>
                {fmt(happyHour.start)}–{fmt(happyHour.end)}
              </span>
            </h3>
            <ul className="daynight__cocktails sign sign--plain">
              {happyHour.cocktails.map((c) => (
                <li key={c}>{c}</li>
              ))}
              <li>& more</li>
            </ul>
            <p>Open till {fmt(hours.fri.close)} on Fridays and Saturdays, {fmt(hours.tue.close)} Tuesday to Thursday.</p>
            <blockquote className="quote quote--night">
              <p>“{press.village.quote}”</p>
              <cite>
                <a href={press.village.url} target="_blank" rel="noreferrer">
                  {press.village.source}
                </a>
                , {press.village.detail}
              </cite>
            </blockquote>
          </article>
        </div>
      </div>
    </section>
  )
}

function TheWalls() {
  return (
    <section className="section walls" aria-labelledby="walls-title">
      <div className="wrap walls__grid">
        <Reveal className="walls__text">
          <p className="caps kicker">The walls</p>
          <h2 id="walls-title">Turquoise, white-wash and frames to the ceiling</h2>
          <p className="lede">
            Sarava began as a café and crêperie alongside The Brick Box, a Brixton arts and community organisation.
            The walls are still full of it: one painted turquoise and hung edge to edge, the other rough white-washed
            brick, with red chairs and flowers in bottles on the tables.
          </p>
          <blockquote className="quote">
            <p>“{press.timeout.quote}”</p>
            <cite>
              <a href={press.timeout.url} target="_blank" rel="noreferrer">
                {press.timeout.source}
              </a>
              , {press.timeout.detail}
            </cite>
          </blockquote>
        </Reveal>
        <div className="salon" aria-label="Photos from Sarava">
          <Framed photo={photos.room} kind="gilt" mat tilt={-0.6} ratio="3 / 2" frameClass="salon__a" sizes="(min-width: 900px) 520px, 90vw" />
          <Framed photo={photos.galette} kind="red" tilt={1.2} ratio="2 / 3" frameClass="salon__b" sizes="(min-width: 900px) 220px, 45vw" />
          <Framed photo={photos.sweet} kind="black" mat tilt={-1.4} ratio="2 / 3" frameClass="salon__c" sizes="(min-width: 900px) 220px, 45vw" />
          <Framed photo={photos.salmon} kind="wood" tilt={0.8} ratio="16 / 10" frameClass="salon__d" sizes="(min-width: 900px) 320px, 60vw" />
        </div>
      </div>
    </section>
  )
}

function Parties() {
  const partyTypes = booking.types.filter((t) => t !== 'Dinner' && t !== 'Drinks')
  return (
    <section className="section parties" aria-labelledby="parties-title">
      <div className="wrap parties__grid">
        <Reveal>
          <p className="caps kicker">Brunch, birthdays and the whole place</p>
          <h2 id="parties-title">Book it without the phone call</h2>
          <p className="lede">
            Tables for up to {booking.maxParty} go straight in online. For more than {booking.maxParty}, or for the
            whole place, send a party enquiry and Sarava will come back to you.
          </p>
          <div className="parties__actions">
            <Link to="/book" className="btn btn--red">
              <IconTable /> Book a table
            </Link>
            <Link to="/book?party=1" className="btn btn--ghost">
              Party enquiry
            </Link>
          </div>
        </Reveal>
        <Reveal className="parties__board glass" delay={0.1}>
          <p className="sign parties__board-title">We do</p>
          <ul className="sign sign--plain">
            {partyTypes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="parties__fine">Tables are held for {booking.holdMinutes} minutes.</p>
        </Reveal>
      </div>
    </section>
  )
}

function FindUs() {
  return (
    <section className="section findus" aria-labelledby="findus-title">
      <div className="wrap">
        <Reveal>
          <p className="caps kicker">Find us in the Village</p>
          <h2 id="findus-title">Right-hand avenue, then look right</h2>
        </Reveal>
        <RouteMap />
        <p style={{ marginTop: 24 }}>
          <Link to="/find-us" className="link-arrow">
            Opening hours, access and the shopfront photo <IconArrow />
          </Link>
        </p>
      </div>
    </section>
  )
}

function AtHome() {
  return (
    <section className="section section--tight athome" aria-labelledby="athome-title">
      <div className="wrap athome__inner">
        <p className="athome__welcome" id="athome-title">
          “{business.welcome}”
        </p>
        <div className="athome__links">
          <a className="btn btn--ghost" href={links.deliveroo} target="_blank" rel="noreferrer">
            Deliveroo <IconExternal />
          </a>
          <a className="btn btn--ghost" href={links.uberEats} target="_blank" rel="noreferrer">
            Uber Eats <IconExternal />
          </a>
          <a className="btn btn--ghost" href={business.instagram.url} target="_blank" rel="noreferrer">
            {business.instagram.handle} <IconExternal />
          </a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <FlourOrBuckwheat />
      <HotSauce />
      <DayAndNight />
      <TheWalls />
      <Parties />
      <FindUs />
      <AtHome />
    </>
  )
}

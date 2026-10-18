import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { BaseSwitch, type Base } from '../components/BaseSwitch'
import { business, happyHour, menu, menuSource, type Diet, type MenuItem } from '../data/sarava'
import { fmt } from '../lib/time'

type Filter = 'all' | Diet

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'v', label: 'Vegetarian (v)' },
  { id: 'vg', label: 'Vegan (vg)' },
]

const dietLabel: Record<Diet, string> = { v: 'Vegetarian', vg: 'Vegan' }

function matches(item: MenuItem, f: Filter) {
  if (f === 'all') return true
  if (f === 'v') return item.diet === 'v' || item.diet === 'vg'
  return item.diet === 'vg'
}

function BaseTag({ base, item }: { base: Base; item: MenuItem }) {
  if (item.diet !== 'vg') return null
  return base === 'galette' ? (
    <span className="item__base item__base--galette">Fully vegan &amp; gluten-free on buckwheat</span>
  ) : (
    <span className="item__base">Vegan when it’s on a buckwheat galette</span>
  )
}

export default function Menu() {
  const [base, setBase] = useState<Base>('galette')
  const [filter, setFilter] = useState<Filter>('all')

  const sections = useMemo(
    () => menu.map((s) => ({ ...s, shown: s.items.filter((i) => matches(i, filter)) })).filter((s) => s.shown.length),
    [filter],
  )

  return (
    <div className="menu-page">
      <header className="page-head wrap">
        <p className="caps kicker">Menu</p>
        <h1>Crêpes, galettes, starters &amp; drinks</h1>
        <p className="lede">“{business.welcome}”</p>
      </header>

      <div className="menu-controls">
        <div className="wrap menu-controls__inner">
          <BaseSwitch base={base} onChange={setBase} />
          <div className="chips" role="group" aria-label="Filter by diet">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`chip${filter === f.id ? ' is-on' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <nav className="wrap menu-jump" aria-label="Menu sections">
          {sections.map((s) => (
            <a key={s.id} href={`#/menu`} onClick={(e) => {
              e.preventDefault()
              document.getElementById(`sec-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}>
              {s.title.replace(' Crêpes & Galettes', '')}
            </a>
          ))}
          <a href="#/menu" onClick={(e) => {
            e.preventDefault()
            document.getElementById('sec-cocktails')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}>
            Cocktails
          </a>
        </nav>
      </div>

      <AnimatePresence>
        {filter === 'vg' && base === 'crepe' && (
          <motion.div
            className="wrap"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="nudge">
              Vegan means buckwheat: the flour crêpe has egg and milk in it.{' '}
              <button type="button" className="link-arrow" onClick={() => setBase('galette')}>
                Switch to galette
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="wrap menu-body">
        {sections.map((s) => (
          <section key={s.id} id={`sec-${s.id}`} className={`menu-sec${s.hasBase ? ' menu-sec--base' : ''}`}>
            <h2 className="menu-sec__title">
              {s.title}
              {s.hasBase && (
                <span className={`menu-sec__base menu-sec__base--${base}`}>
                  {base === 'galette' ? 'Buckwheat galette · vegan & gluten-free base' : 'White-flour crêpe'}
                </span>
              )}
            </h2>
            {s.intro && <p className="muted menu-sec__intro">{s.intro}</p>}
            {s.id === 'sweet' && base === 'galette' && (
              <p className="muted menu-sec__intro">House tip: sweet ones usually go on the flour crêpe, but buckwheat works too.</p>
            )}
            {s.id === 'savoury' && base === 'crepe' && (
              <p className="muted menu-sec__intro">House tip: savoury ones usually go on buckwheat.</p>
            )}
            <ul className="items">
              <AnimatePresence initial={false}>
                {s.shown.map((item) => (
                  <motion.li
                    key={item.name}
                    className="item"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="item__head">
                      <h3 className="item__name">
                        {item.name}
                        {item.diet && (
                          <abbr className={`tag tag--${item.diet}`} title={dietLabel[item.diet]}>
                            {item.diet}
                          </abbr>
                        )}
                        {item.popular && <span className="tag tag--pop">Popular</span>}
                      </h3>
                      <span className="item__dots" aria-hidden="true" />
                      <span className="item__price sign sign--plain">£{item.price}</span>
                    </div>
                    {item.description && <p className="item__desc">{item.description}</p>}
                    {item.note && <p className="item__note">{item.note}</p>}
                    {s.hasBase && <BaseTag base={base} item={item} />}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </section>
        ))}

        <section id="sec-cocktails" className="menu-sec menu-cocktails glass">
          <h2 className="sign menu-cocktails__title">
            {happyHour.line}
            <span>
              {fmt(happyHour.start)}–{fmt(happyHour.end)}
            </span>
          </h2>
          <ul className="sign sign--plain menu-cocktails__list">
            {happyHour.cocktails.map((c) => (
              <li key={c}>{c}</li>
            ))}
            <li>& more</li>
          </ul>
          <p className="menu-cocktails__fine">From the board in the window. Ask at the bar for the full list.</p>
        </section>

        <footer className="menu-foot">
          <p>
            <abbr title="Vegetarian">v</abbr> vegetarian · <abbr title="Vegan">vg</abbr> vegan, as marked by Sarava. Any
            filling can go on a buckwheat galette, which is vegan and gluten-free. Tell the team about allergies when you
            order.
          </p>
          <p className="muted">{menuSource}</p>
        </footer>
      </div>
    </div>
  )
}

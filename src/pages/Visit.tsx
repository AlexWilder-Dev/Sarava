import { Framed } from '../components/Photo'
import { IconPhone, IconPin } from '../components/Icons'
import { RouteMap } from '../components/RouteMap'
import { StatusBoard } from '../components/StatusBoard'
import { business, dayNames, dayOrder, facilities, happyHour, hours, links, photos } from '../data/sarava'
import { useMode } from '../lib/mode'
import { fmt } from '../lib/time'

export default function Visit() {
  const { now } = useMode()
  const a = business.address
  return (
    <div className="visit-page">
      <header className="page-head wrap">
        <p className="caps kicker">Find us</p>
        <h1>Unit 41–42, Second Avenue, Brixton Village</h1>
        <p className="lede">
          {a.unit}, {a.market}, {a.street}, {a.city} {a.postcode}.
        </p>
        <div className="visit__actions">
          <a className="btn btn--red" href={links.directions} target="_blank" rel="noreferrer">
            <IconPin /> Directions
          </a>
          <a className="btn btn--ghost" href={business.phone.href}>
            <IconPhone /> {business.phone.display}
          </a>
        </div>
      </header>

      <section className="section section--tight">
        <div className="wrap">
          <RouteMap big />
        </div>
      </section>

      <section className="section">
        <div className="wrap visit-grid">
          <div>
            <h2 className="visit__h">Opening hours</h2>
            <StatusBoard compact />
            <table className="hours">
              <caption className="visually-hidden">Opening hours, Monday to Sunday</caption>
              <tbody>
                {dayOrder.map((d) => (
                  <tr key={d} className={d === now.day ? 'is-today' : ''} aria-current={d === now.day ? 'date' : undefined}>
                    <th scope="row">
                      {dayNames[d]}
                      {d === now.day && <span className="hours__today">today</span>}
                    </th>
                    <td>
                      {fmt(hours[d].open)}–{fmt(hours[d].close)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted">
              Happy hour {fmt(happyHour.start)}–{fmt(happyHour.end)}: {happyHour.line.toLowerCase()}.
            </p>
          </div>
          <div>
            <h2 className="visit__h">What it looks like</h2>
            <Framed
              photo={photos.shopfront}
              kind="black"
              ratio="4 / 3"
              tilt={-0.5}
              sizes="(min-width: 900px) 540px, 92vw"
              caption="Teal front, red sign, tables out in the avenue"
            />
            <h2 className="visit__h" style={{ marginTop: 56 }}>
              Good to know
            </h2>
            <ul className="facts">
              {facilities.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

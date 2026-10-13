import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useUserData } from '../state/UserData'

const NAV = [
  { to: '/recepti', label: 'Recepti' },
  { to: '/kategorije', label: 'Kategorije' },
  { to: '/priljubljeni', label: 'Priljubljeni' },
  { to: '/nakupovalni-seznam', label: 'Nakupovalni seznam' },
]

const today = new Intl.DateTimeFormat('sl-SI', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date())

export default function Layout() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { favoriteIds, shoppingCount } = useUserData()
  const counts: Record<string, number> = {
    '/priljubljeni': favoriteIds.size,
    '/nakupovalni-seznam': shoppingCount,
  }

  // Ob menjavi strani zapri mobilni meni in skoči na vrh.
  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#vsebina">
        Preskoči na vsebino
      </a>

      <div className="edition-bar">
        <div className="container">
          <span>{today.charAt(0).toUpperCase() + today.slice(1)}</span>
          <span>Domači recepti, preizkušeni v kuhinji</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container">
          <Link to="/" className="wordmark" aria-label="RecipeHub – domov">
            Recipe<em>Hub</em>
          </Link>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="glavna-navigacija"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? 'Zapri' : 'Meni'}
          </button>

          <nav id="glavna-navigacija" className="main-nav" aria-label="Glavna navigacija" data-open={menuOpen}>
            <ul>
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to}>
                    {item.label}
                    {counts[item.to] > 0 && (
                      <span className="nav-count">
                        <span className="visually-hidden">(</span>
                        {counts[item.to]}
                        <span className="visually-hidden">)</span>
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to="/dodaj-recept" className="nav-cta">
                  + Dodaj recept
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="vsebina" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <div>
            <Link to="/" className="wordmark">
              Recipe<em>Hub</em>
            </Link>
            <p>Zbirka domačih receptov za vsak dan. Poišči jed, shrani priljubljene in si pripravi nakupovalni seznam.</p>
          </div>
          <nav aria-label="Noga">
            <h2>Raziskuj</h2>
            <ul>
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/dodaj-recept">Dodaj recept</Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2>O projektu</h2>
            <p style={{ marginTop: 0 }}>
              Študijski projekt pri predmetu Vrednotenje uporabniških vmesnikov, FERI UM.
            </p>
            <p>
              <Link to="/viri-fotografij">Viri fotografij</Link> (Openverse, CC BY)
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

// Začasna stran za funkcionalnosti, ki pridejo v naslednjih korakih.
export default function PlaceholderPage({ title, intro }: { title: string; intro: string }) {
  usePageTitle(title)
  return (
    <div className="container">
      <header className="page-head">
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      <div className="notice">
        <p>Ta del aplikacije je v pripravi.</p>
        <Link to="/" className="btn btn-ghost">
          Nazaj na domačo stran
        </Link>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import SearchForm from '../components/SearchForm'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFoundPage() {
  usePageTitle('Stran ne obstaja')
  return (
    <div className="container not-found">
      <span className="big" aria-hidden="true">
        404
      </span>
      <h1>Te strani ni v naši kuharici</h1>
      <p>Povezava je morda napačna ali pa je bil recept odstranjen. Poskusi z iskanjem:</p>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <SearchForm />
      </div>
      <Link to="/" className="btn btn-ghost">
        Na domačo stran
      </Link>
    </div>
  )
}

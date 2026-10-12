import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchForm({ initial = '' }: { initial?: string }) {
  const [query, setQuery] = useState(initial)
  const navigate = useNavigate()

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/recepti?q=${encodeURIComponent(q)}` : '/recepti')
  }

  return (
    <form className="search-form" role="search" onSubmit={onSubmit}>
      <label htmlFor="iskanje">Išči po imenu jedi ali sestavini</label>
      <div className="search-row">
        <input
          id="iskanje"
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="npr. golaž, buča, čokolada"
          autoComplete="off"
        />
        <button type="submit" className="btn">
          Išči
        </button>
      </div>
    </form>
  )
}

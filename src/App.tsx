import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { ensureVisitor, supabase } from './lib/supabase'

type Check = { label: string; ok: boolean | null; detail: string }

// Začasna stran za 2. korak: preveri povezavo s Supabase, podatke in anonimno sejo.
function ConnectionCheck() {
  const [checks, setChecks] = useState<Check[]>([])

  useEffect(() => {
    async function run() {
      const results: Check[] = []

      const cats = await supabase.from('categories').select('name').order('sort_order')
      results.push({
        label: 'Kategorije',
        ok: !cats.error && (cats.data?.length ?? 0) > 0,
        detail: cats.error ? cats.error.message : (cats.data ?? []).map((c) => c.name).join(', '),
      })

      const recs = await supabase
        .from('recipes_with_rating')
        .select('title, rating_avg', { count: 'exact' })
        .order('rating_avg', { ascending: false })
        .limit(3)
      results.push({
        label: 'Recepti',
        ok: !recs.error && (recs.count ?? 0) > 0,
        detail: recs.error
          ? recs.error.message
          : `${recs.count} receptov; najbolje ocenjeni: ${(recs.data ?? []).map((r) => `${r.title} (${r.rating_avg})`).join(', ')}`,
      })

      const search = await supabase.from('recipes').select('title').ilike('search_text', '%cesen%')
      results.push({
        label: 'Iskanje »cesen« (brez šumnikov)',
        ok: !search.error && (search.data?.length ?? 0) > 0,
        detail: search.error ? search.error.message : `${search.data?.length} zadetkov`,
      })

      try {
        const id = await ensureVisitor()
        results.push({ label: 'Anonimni obiskovalec', ok: true, detail: id })
      } catch (e) {
        results.push({ label: 'Anonimni obiskovalec', ok: false, detail: (e as Error).message })
      }

      setChecks(results)
    }
    run()
  }, [])

  if (checks.length === 0) return <p>Preverjam povezavo …</p>
  return (
    <ul>
      {checks.map((c) => (
        <li key={c.label}>
          {c.ok ? '✔' : '✘'} <strong>{c.label}:</strong> {c.detail}
        </li>
      ))}
    </ul>
  )
}

export default function App() {
  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: 720, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>RecipeHub</h1>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">Domov</Link>
        <Link to="/recepti">Recepti</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ConnectionCheck />} />
        <Route path="/recepti" element={<p>Podstran /recepti deluje tudi ob osvežitvi strani. ✔</p>} />
        <Route path="*" element={<p>Stran ne obstaja (404).</p>} />
      </Routes>
    </main>
  )
}

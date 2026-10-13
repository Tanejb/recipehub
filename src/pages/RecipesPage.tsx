import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { CardGridSkeleton, ErrorNotice } from '../components/States'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { getCategoriesWithCounts, searchRecipes, type RecipeFilters, type SortKey } from '../lib/api'
import { difficultyLabel, plural } from '../lib/format'
import type { Difficulty } from '../lib/types'

// Vsi filtri živijo v URL-ju (?q=…&kategorija=…&cas=…&zahtevnost=…&razvrsti=…),
// zato delujejo gumb Nazaj, deljenje povezave in vnaprej pripravljeni začetni URL-ji za testiranje.

const TIME_OPTIONS = [
  { value: '', label: 'Poljubno' },
  { value: '15', label: 'Do 15 min' },
  { value: '30', label: 'Do 30 min' },
  { value: '60', label: 'Do 1 ure' },
]

const DIFFICULTIES: Difficulty[] = ['lahka', 'srednja', 'zahtevna']

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'ocena', label: 'Najbolje ocenjeni' },
  { value: 'cas', label: 'Najhitrejši' },
  { value: 'abeceda', label: 'Po abecedi' },
  { value: 'novi', label: 'Najnovejši' },
]

function readFilters(params: URLSearchParams): RecipeFilters {
  const sort = params.get('razvrsti') as SortKey | null
  const time = Number(params.get('cas'))
  return {
    q: params.get('q') ?? '',
    categories: params.getAll('kategorija'),
    maxMinutes: time > 0 ? time : null,
    difficulties: params.getAll('zahtevnost').filter((d): d is Difficulty => DIFFICULTIES.includes(d as Difficulty)),
    sort: sort && SORT_OPTIONS.some((o) => o.value === sort) ? sort : 'ocena',
  }
}

export default function RecipesPage() {
  usePageTitle('Recepti')
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => readFilters(params), [params])
  const [draft, setDraft] = useState(filters.q)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const categories = useAsync(getCategoriesWithCounts, [])
  const results = useAsync(() => searchRecipes(filters), [params.toString()])

  // Iskanje med tipkanjem (z zamikom), da ni treba pritisniti »Išči«.
  useEffect(() => {
    if (draft.trim() === filters.q) return
    const t = setTimeout(() => update((p) => setOrDelete(p, 'q', draft.trim()), true), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  // Če se q spremeni od zunaj (npr. povezava »Pogosto iščejo«), posodobi polje.
  useEffect(() => {
    if (filters.q !== draft.trim()) setDraft(filters.q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q])

  function update(mutate: (p: URLSearchParams) => void, replace = false) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        mutate(next)
        return next
      },
      { replace },
    )
  }

  function toggleMulti(key: string, value: string) {
    update((p) => {
      const values = p.getAll(key)
      p.delete(key)
      const nextValues = values.includes(value) ? values.filter((v) => v !== value) : [...values, value]
      nextValues.forEach((v) => p.append(key, v))
    })
  }

  const activeChips = [
    ...(filters.q ? [{ key: 'q', value: filters.q, label: `»${filters.q}«` }] : []),
    ...filters.categories.map((slug) => ({
      key: 'kategorija',
      value: slug,
      label: categories.data?.find((c) => c.slug === slug)?.name ?? slug,
    })),
    ...(filters.maxMinutes
      ? [{ key: 'cas', value: String(filters.maxMinutes), label: TIME_OPTIONS.find((o) => o.value === String(filters.maxMinutes))?.label ?? `Do ${filters.maxMinutes} min` }]
      : []),
    ...filters.difficulties.map((d) => ({ key: 'zahtevnost', value: d, label: difficultyLabel[d] })),
  ]
  const filterCount = activeChips.filter((c) => c.key !== 'q').length

  function removeChip(key: string, value: string) {
    if (key === 'q') setDraft('')
    update((p) => {
      const rest = p.getAll(key).filter((v) => v !== value)
      p.delete(key)
      rest.forEach((v) => p.append(key, v))
    })
  }

  function clearAll() {
    setDraft('')
    setParams(filters.sort === 'ocena' ? {} : { razvrsti: filters.sort })
  }

  const count = results.data?.length ?? 0

  return (
    <div className="container">
      <header className="page-head catalog-head">
        <div>
          <h1>Recepti</h1>
          <p>Išči po imenu jedi ali po sestavini, ki jo imaš doma, in zoži izbor s filtri.</p>
        </div>
        <form
          className="search-form"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            update((p) => setOrDelete(p, 'q', draft.trim()))
          }}
        >
          <label htmlFor="iskanje-recepti">Išči po imenu jedi ali sestavini</label>
          <div className="search-row">
            <input
              id="iskanje-recepti"
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="npr. golaž, buča, čokolada"
              autoComplete="off"
            />
            <button type="submit" className="btn">
              Išči
            </button>
          </div>
        </form>
      </header>

      <div className="catalog">
        <button
          type="button"
          className="btn btn-ghost filters-toggle"
          aria-expanded={filtersOpen}
          aria-controls="filtri"
          onClick={() => setFiltersOpen((o) => !o)}
        >
          {filtersOpen ? 'Skrij filtre' : 'Filtri'}
          {filterCount > 0 && <span className="badge">{filterCount}</span>}
        </button>

        <aside id="filtri" className="filters" data-open={filtersOpen} aria-label="Filtri">
          <fieldset>
            <legend>Kategorija</legend>
            {categories.status === 'success' &&
              categories.data.map((c) => (
                <label key={c.slug} className="check">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(c.slug)}
                    onChange={() => toggleMulti('kategorija', c.slug)}
                  />
                  <span>{c.name}</span>
                  <span className="check-count">{c.recipe_count}</span>
                </label>
              ))}
            {categories.status === 'loading' && <div className="skeleton" style={{ height: 180 }} aria-hidden="true" />}
          </fieldset>

          <fieldset>
            <legend>Čas priprave</legend>
            {TIME_OPTIONS.map((o) => (
              <label key={o.value} className="check">
                <input
                  type="radio"
                  name="cas"
                  checked={String(filters.maxMinutes ?? '') === o.value}
                  onChange={() => update((p) => setOrDelete(p, 'cas', o.value))}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Zahtevnost</legend>
            {DIFFICULTIES.map((d) => (
              <label key={d} className="check">
                <input
                  type="checkbox"
                  checked={filters.difficulties.includes(d)}
                  onChange={() => toggleMulti('zahtevnost', d)}
                />
                <span>{difficultyLabel[d]}</span>
              </label>
            ))}
          </fieldset>

          {activeChips.length > 0 && (
            <button type="button" className="link-button" onClick={clearAll}>
              Počisti vse filtre
            </button>
          )}
        </aside>

        <section className="results" aria-labelledby="rezultati">
          <div className="results-bar">
            <h2 id="rezultati" className="results-count" aria-live="polite">
              {results.status === 'success'
                ? `${count} ${plural(count, ['recept', 'recepta', 'recepti', 'receptov'])}`
                : 'Iščem …'}
            </h2>
            <label className="sort">
              <span>Razvrsti:</span>
              <select
                value={filters.sort}
                onChange={(e) => update((p) => setOrDelete(p, 'razvrsti', e.target.value === 'ocena' ? '' : e.target.value))}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {activeChips.length > 0 && (
            <ul className="chips" aria-label="Aktivni filtri">
              {activeChips.map((chip) => (
                <li key={`${chip.key}-${chip.value}`}>
                  <button type="button" className="chip" onClick={() => removeChip(chip.key, chip.value)}>
                    {chip.label}
                    <span aria-hidden="true">×</span>
                    <span className="visually-hidden">(odstrani filter)</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {results.status === 'error' && <ErrorNotice onRetry={results.reload} />}
          {results.status === 'loading' && <CardGridSkeleton count={6} />}
          {results.status === 'success' && count === 0 && (
            <div className="notice empty">
              <h3>Ni receptov, ki bi ustrezali iskanju</h3>
              <p>
                Poskusi z drugo besedo (npr. samo eno sestavino), odstrani kakšen filter ali si oglej{' '}
                <Link to="/kategorije">vse kategorije</Link>.
              </p>
              <button type="button" className="btn btn-ghost" onClick={clearAll}>
                Počisti iskanje in filtre
              </button>
            </div>
          )}
          {results.status === 'success' && count > 0 && (
            <ul className="recipe-grid catalog-grid">
              {results.data.map((r, i) => (
                <li key={r.id}>
                  <RecipeCard recipe={r} headingLevel="h3" eagerImage={i < 3} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function setOrDelete(p: URLSearchParams, key: string, value: string) {
  if (value) p.set(key, value)
  else p.delete(key)
}

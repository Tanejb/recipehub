import { useSearchParams, useParams, Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { CardGridSkeleton, ErrorNotice } from '../components/States'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { getCategoryBySlug, searchRecipes, type SortKey } from '../lib/api'
import { recipesWord } from '../lib/format'
import NotFoundPage from './NotFoundPage'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'ocena', label: 'Najbolje ocenjeni' },
  { value: 'cas', label: 'Najhitrejši' },
  { value: 'abeceda', label: 'Po abecedi' },
]

export default function CategoryPage() {
  const { slug = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const sort = (SORT_OPTIONS.find((o) => o.value === params.get('razvrsti'))?.value ?? 'ocena') as SortKey

  const category = useAsync(() => getCategoryBySlug(slug), [slug])
  const recipes = useAsync(
    () => searchRecipes({ q: '', categories: [slug], maxMinutes: null, difficulties: [], sort }),
    [slug, sort],
  )
  usePageTitle(category.data?.name ?? 'Kategorija')

  if (category.status === 'success' && !category.data) return <NotFoundPage />

  return (
    <div className="container">
      <nav aria-label="Drobtinice" className="breadcrumbs">
        <ol>
          <li>
            <Link to="/kategorije">Kategorije</Link>
          </li>
          <li aria-current="page">{category.data?.name ?? '…'}</li>
        </ol>
      </nav>

      <header className="page-head">
        <h1>{category.data?.name ?? <span className="skeleton" style={{ display: 'inline-block', width: 280, height: '1em' }} />}</h1>
        {category.data && <p>{category.data.description}</p>}
      </header>

      {category.status === 'error' && <ErrorNotice onRetry={category.reload} />}

      <div className="results-bar">
        <h2 className="results-count" aria-live="polite">
          {recipes.status === 'success' ? recipesWord(recipes.data.length) : 'Nalagam …'}
        </h2>
        <div className="results-tools">
          <Link to={`/recepti?kategorija=${slug}`} className="section-link">
            Filtriraj po času in zahtevnosti
          </Link>
          <label className="sort">
            <span>Razvrsti:</span>
            <select
              value={sort}
              onChange={(e) => setParams(e.target.value === 'ocena' ? {} : { razvrsti: e.target.value }, { replace: true })}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {recipes.status === 'error' && <ErrorNotice onRetry={recipes.reload} />}
      {recipes.status === 'loading' && <CardGridSkeleton count={8} />}
      {recipes.status === 'success' && (
        <ul className="recipe-grid">
          {recipes.data.map((r, i) => (
            <li key={r.id}>
              <RecipeCard recipe={r} eagerImage={i < 4} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

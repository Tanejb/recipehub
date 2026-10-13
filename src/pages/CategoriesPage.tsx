import { Link } from 'react-router-dom'
import RecipeImage from '../components/RecipeImage'
import { ErrorNotice } from '../components/States'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { getCategoriesWithCounts, getCategoryCovers } from '../lib/api'
import { recipesWord } from '../lib/format'

export default function CategoriesPage() {
  usePageTitle('Kategorije')
  const data = useAsync(() => Promise.all([getCategoriesWithCounts(), getCategoryCovers()]), [])
  const [categories, covers] = data.data ?? [[], {}]

  return (
    <div className="container">
      <header className="page-head">
        <h1>Kategorije</h1>
        <p>Brskaj po receptih glede na vrsto jedi – od zajtrka do sladice.</p>
      </header>

      {data.status === 'error' && <ErrorNotice onRetry={data.reload} />}
      {data.status === 'loading' && !data.data && (
        <div className="category-tiles" aria-busy="true" aria-label="Nalaganje kategorij">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: '4 / 3' }} />
          ))}
        </div>
      )}
      {data.data && (
        <ul className="category-tiles">
          {categories.map((c, i) => (
            <li key={c.id}>
              <Link to={`/kategorije/${c.slug}`} className="category-tile">
                <RecipeImage src={(covers as Record<string, string>)[c.slug] ?? null} alt="" title={c.name} categorySlug={c.slug} eager={i < 3} />
                <span className="tile-no" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="tile-name">{c.name}</span>
                <span className="tile-desc">{c.description}</span>
                <span className="tile-count">{recipesWord(c.recipe_count)} →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

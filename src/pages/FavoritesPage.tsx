import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { CardGridSkeleton, ErrorNotice } from '../components/States'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { getFavoriteRecipes } from '../lib/api'
import { recipesWord } from '../lib/format'
import { useUserData } from '../state/UserData'

export default function FavoritesPage() {
  usePageTitle('Priljubljeni')
  const { favoriteIds } = useUserData()
  // Recepte naložimo enkrat; ob odstranitvi jih le skrijemo, da »Razveljavi« takoj vrne kartico.
  const recipes = useAsync(getFavoriteRecipes, [])
  const visible = recipes.data?.filter((r) => favoriteIds.has(r.id)) ?? []

  return (
    <div className="container">
      <header className="page-head">
        <h1>Priljubljeni</h1>
        <p>Recepti, ki si jih shranil s klikom na srček. Shranjeni so v tem brskalniku.</p>
      </header>

      {recipes.status === 'error' && <ErrorNotice onRetry={recipes.reload} />}
      {recipes.status === 'loading' && !recipes.data && <CardGridSkeleton count={4} />}

      {recipes.data && visible.length > 0 && (
        <>
          <div className="results-bar">
            <h2 className="results-count" aria-live="polite">
              {recipesWord(visible.length)}
            </h2>
            <Link to="/recepti" className="section-link">
              Poišči še več receptov →
            </Link>
          </div>
          <ul className="recipe-grid">
            {visible.map((r) => (
              <li key={r.id}>
                <RecipeCard recipe={r} />
              </li>
            ))}
          </ul>
        </>
      )}

      {recipes.data && visible.length === 0 && (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">
            ♡
          </span>
          <h2>Še nimaš priljubljenih receptov</h2>
          <p>
            Ko ti je recept všeč, klikni srček na kartici ali gumb »Shrani med priljubljene« na strani recepta. Tukaj
            ga boš našel tudi naslednjič.
          </p>
          <div className="empty-actions">
            <Link to="/recepti" className="btn">
              Brskaj po receptih
            </Link>
            <Link to="/kategorije" className="btn btn-ghost">
              Oglej si kategorije
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import RecipeImage from '../components/RecipeImage'
import RecipeMeta from '../components/RecipeMeta'
import SearchForm from '../components/SearchForm'
import { CardGridSkeleton, ErrorNotice } from '../components/States'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { getCategoriesWithCounts, getQuickRecipes, getTopRatedRecipes } from '../lib/api'
import { recipesWord } from '../lib/format'

const POPULAR_SEARCHES = ['česen', 'buča', 'čokolada', 'piščanec', 'skuta']

// »Recept dneva« se zamenja vsak dan, a je za vse obiskovalce isti.
function dayIndex(length: number) {
  const start = new Date(new Date().getFullYear(), 0, 0).getTime()
  const day = Math.floor((Date.now() - start) / 86_400_000)
  return day % length
}

export default function HomePage() {
  usePageTitle()
  const top = useAsync(() => getTopRatedRecipes(12), [])
  const categories = useAsync(getCategoriesWithCounts, [])
  const quick = useAsync(() => getQuickRecipes(30, 4), [])

  const featured = top.data?.length ? top.data[dayIndex(top.data.length)] : undefined
  const topRest = top.data?.filter((r) => r.id !== featured?.id).slice(0, 5) ?? []

  return (
    <>
      <section className="container hero" aria-labelledby="naslov">
        <div>
          <h1 id="naslov">
            Kaj bomo kuhali <em>danes?</em>
          </h1>
          <p className="hero-lead">
            Domači recepti od hitrih zajtrkov do nedeljskih sladic. Poišči jed ali začni s sestavino, ki jo že imaš.
          </p>
          <SearchForm />
          <p className="popular-searches">
            <span>Pogosto iščejo:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link key={term} to={`/recepti?q=${encodeURIComponent(term)}`}>
                {term}
              </Link>
            ))}
          </p>
        </div>

        {featured ? (
          <Link to={`/recepti/${featured.slug}`} className="feature" aria-label={`Recept dneva: ${featured.title}`}>
            <figure style={{ margin: 0 }}>
              <RecipeImage
                src={featured.image_url}
                alt=""
                title={featured.title}
                categorySlug={featured.category_slug}
                eager
              />
              <figcaption>
                <span className="feature-no" aria-hidden="true">
                  Nº{String(featured.id).padStart(2, '0')}
                </span>
                <span className="kicker">Recept dneva · {featured.category_name}</span>
                <span className="feature-title">{featured.title}</span>
                <span />
                <RecipeMeta recipe={featured} />
              </figcaption>
            </figure>
          </Link>
        ) : top.status === 'error' ? null : (
          <div className="skeleton" style={{ aspectRatio: '4 / 3' }} aria-hidden="true" />
        )}
      </section>

      <section className="container section" aria-labelledby="kategorije">
        <div className="section-head">
          <h2 id="kategorije">
            <span className="section-no">01</span>Kategorije
          </h2>
          <Link to="/kategorije" className="section-link">
            Vse kategorije →
          </Link>
        </div>
        {categories.status === 'error' && <ErrorNotice onRetry={categories.reload} />}
        {categories.status === 'loading' && <div className="skeleton" style={{ height: 260 }} aria-hidden="true" />}
        {categories.status === 'success' && (
          <ul className="category-index">
            {categories.data.map((c, i) => (
              <li key={c.id}>
                <Link to={`/kategorije/${c.slug}`}>
                  <span className="cat-no" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="cat-name">{c.name}</span>
                  <span className="cat-desc">{c.description}</span>
                  <span className="cat-count">{recipesWord(c.recipe_count)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="container section" aria-labelledby="najbolje-ocenjeni">
        <div className="section-head">
          <h2 id="najbolje-ocenjeni">
            <span className="section-no">02</span>Najbolje ocenjeni
          </h2>
          <Link to="/recepti?razvrsti=ocena" className="section-link">
            Vsi recepti →
          </Link>
        </div>
        {top.status === 'error' && <ErrorNotice onRetry={top.reload} />}
        {top.status === 'loading' && <CardGridSkeleton count={4} />}
        {top.status === 'success' && (
          <ul className="recipe-grid lead-first">
            {topRest.map((r, i) => (
              <li key={r.id}>
                <RecipeCard recipe={r} showDescription={i === 0} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="container section" aria-labelledby="hitri">
        <div className="section-head">
          <h2 id="hitri">
            <span className="section-no">03</span>Na mizi v 30 minutah
          </h2>
          <Link to="/recepti?cas=30" className="section-link">
            Vsi hitri recepti →
          </Link>
        </div>
        {quick.status === 'error' && <ErrorNotice onRetry={quick.reload} />}
        {quick.status === 'loading' && <CardGridSkeleton count={4} />}
        {quick.status === 'success' && (
          <ul className="recipe-grid">
            {quick.data.map((r) => (
              <li key={r.id}>
                <RecipeCard recipe={r} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

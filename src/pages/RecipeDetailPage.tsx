import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import credits from '../data/image-credits.json'
import FavoriteButton from '../components/FavoriteButton'
import RatingInput from '../components/RatingInput'
import RecipeCard from '../components/RecipeCard'
import RecipeImage from '../components/RecipeImage'
import { ErrorNotice } from '../components/States'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  addIngredientsToShoppingList,
  deleteRecipe,
  getMyRating,
  getRecipeBySlug,
  getRelatedRecipes,
  rateRecipe,
  removeMyRating,
} from '../lib/api'
import { difficultyLabel, formatMinutes, formatRating, plural } from '../lib/format'
import { ensureVisitor } from '../lib/supabase'
import type { Recipe } from '../lib/types'
import { formatQuantity } from '../lib/units'
import { useToast } from '../state/Toast'
import { useUserData } from '../state/UserData'
import NotFoundPage from './NotFoundPage'

type Credit = { creator: string | null; creator_url: string | null; license: string; license_url: string; source_url: string }

export default function RecipeDetailPage() {
  const { slug = '' } = useParams()
  const recipe = useAsync(() => getRecipeBySlug(slug), [slug])

  // Ob ponovnem nalaganju (npr. po oceni) pokažemo obstoječi recept, dokler ne pridejo novi podatki.
  const current = recipe.data?.slug === slug ? recipe.data : undefined
  if (recipe.status === 'loading' && !current) return <DetailSkeleton />
  if (recipe.status === 'error')
    return (
      <div className="container" style={{ paddingBlock: '3rem' }}>
        <ErrorNotice onRetry={recipe.reload} />
      </div>
    )
  if (!current) return <NotFoundPage />
  return <RecipeArticle key={current.id} recipe={current} onRatingChanged={recipe.reload} />
}

function RecipeArticle({ recipe, onRatingChanged }: { recipe: Recipe; onRatingChanged: () => void }) {
  usePageTitle(recipe.title)
  const toast = useToast()
  const { refreshShoppingCount } = useUserData()

  const [servings, setServings] = useState(recipe.servings)
  const [selected, setSelected] = useState<boolean[]>(() => recipe.ingredients.map(() => true))
  const [adding, setAdding] = useState(false)
  const scale = servings / recipe.servings

  const myRating = useAsync(() => getMyRating(recipe.id), [recipe.id])
  const [savingRating, setSavingRating] = useState(false)
  const related = useAsync(() => getRelatedRecipes(recipe.category_slug, recipe.id, 3), [recipe.id])
  const credit = (credits as Record<string, Credit>)[recipe.slug]
  const visitor = useAsync(ensureVisitor, [])
  const isMine = !recipe.is_seed && recipe.author_id != null && recipe.author_id === visitor.data
  const navigate = useNavigate()
  const deleteDialog = useRef<HTMLDialogElement>(null)
  const [deleting, setDeleting] = useState(false)

  async function onDelete() {
    setDeleting(true)
    try {
      await deleteRecipe(recipe)
      toast(`Recept »${recipe.title}« je izbrisan.`)
      navigate('/recepti', { replace: true })
    } catch {
      toast('Recepta ni bilo mogoče izbrisati. Poskusi znova.', { tone: 'error' })
      setDeleting(false)
    }
  }

  const selectedCount = selected.filter(Boolean).length

  async function addToShoppingList() {
    setAdding(true)
    try {
      const items = recipe.ingredients
        .filter((_, i) => selected[i])
        .map((ing) => ({ ...ing, amount: ing.amount == null ? null : Math.round(ing.amount * scale * 100) / 100 }))
      const { added, updated } = await addIngredientsToShoppingList(recipe.id, items)
      await refreshShoppingCount()
      const ingredientsWord = (n: number) => `${n} ${plural(n, ['sestavina', 'sestavini', 'sestavine', 'sestavin'])}`
      const parts = [
        added > 0 && `${plural(added, ['dodana je', 'dodani sta', 'dodane so', 'dodanih je'])} ${ingredientsWord(added)}`,
        updated > 0 &&
          `pri ${updated} ${plural(updated, ['sestavini', 'sestavinah', 'sestavinah', 'sestavinah'])}, ki ${plural(updated, ['je', 'sta', 'so', 'so'])} že na seznamu, je povečana količina`,
      ].filter(Boolean)
      const message = parts.length
        ? `Nakupovalni seznam: ${parts.join(', ')}.`
        : 'Vse izbrane sestavine so že na nakupovalnem seznamu.'
      toast(message, { link: { to: '/nakupovalni-seznam', label: 'Odpri seznam' } })
    } catch {
      toast('Sestavin ni bilo mogoče dodati. Poskusi znova.', { tone: 'error' })
    } finally {
      setAdding(false)
    }
  }

  async function saveRating(stars: number) {
    setSavingRating(true)
    try {
      await rateRecipe(recipe.id, stars)
      myRating.reload()
      onRatingChanged()
      toast(`Hvala! Recept si ocenil z oceno ${stars} od 5.`)
    } catch {
      toast('Ocene ni bilo mogoče shraniti. Poskusi znova.', { tone: 'error' })
    } finally {
      setSavingRating(false)
    }
  }

  async function clearRating() {
    setSavingRating(true)
    try {
      await removeMyRating(recipe.id)
      myRating.reload()
      onRatingChanged()
      toast('Tvoja ocena je odstranjena.')
    } catch {
      toast('Ocene ni bilo mogoče odstraniti.', { tone: 'error' })
    } finally {
      setSavingRating(false)
    }
  }

  return (
    <article className="recipe-article">
      <div className="container">
        <nav aria-label="Drobtinice" className="breadcrumbs">
          <ol>
            <li>
              <Link to="/recepti">Recepti</Link>
            </li>
            <li>
              <Link to={`/kategorije/${recipe.category_slug}`}>{recipe.category_name}</Link>
            </li>
            <li aria-current="page">{recipe.title}</li>
          </ol>
        </nav>

        <header className="article-head">
          <span className="kicker">
            {recipe.category_name}
            {isMine && <span className="mine-badge">Tvoj recept</span>}
          </span>
          <h1>{recipe.title}</h1>
          <p className="article-lead">{recipe.description}</p>

          <dl className="facts">
            <div>
              <dt>Ocena</dt>
              <dd>
                <span aria-hidden="true" className="facts-star">
                  ★{' '}
                </span>
                {formatRating(recipe.rating_avg)}{' '}
                <span className="facts-sub">
                  ({recipe.rating_count} {plural(recipe.rating_count, ['ocena', 'oceni', 'ocene', 'ocen'])})
                </span>
              </dd>
            </div>
            <div>
              <dt>Čas priprave</dt>
              <dd>{formatMinutes(recipe.prep_minutes)}</dd>
            </div>
            <div>
              <dt>Zahtevnost</dt>
              <dd>{difficultyLabel[recipe.difficulty]}</dd>
            </div>
            <div>
              <dt>Porcije</dt>
              <dd>{recipe.servings}</dd>
            </div>
          </dl>

          <div className="article-actions">
            <FavoriteButton recipeId={recipe.id} recipeTitle={recipe.title} />
            <a href="#sestavine" className="btn btn-ghost">
              Na sestavine ↓
            </a>
            {isMine && (
              <button type="button" className="link-button danger" onClick={() => deleteDialog.current?.showModal()}>
                Izbriši recept
              </button>
            )}
          </div>
          <dialog ref={deleteDialog} className="confirm-dialog" aria-labelledby="brisanje-naslov">
            <form method="dialog">
              <h2 id="brisanje-naslov">Izbrišem recept »{recipe.title}«?</h2>
              <p>Recept bo odstranjen za vse obiskovalce, skupaj z ocenami in fotografijo. Tega ni mogoče razveljaviti.</p>
              <div className="dialog-actions">
                <button value="cancel" className="btn btn-ghost" autoFocus>
                  Prekliči
                </button>
                <button value="confirm" className="btn btn-danger" onClick={onDelete} disabled={deleting}>
                  Izbriši recept
                </button>
              </div>
            </form>
          </dialog>
        </header>

        <figure className="article-figure">
          <RecipeImage
            src={recipe.image_url}
            alt={recipe.title}
            title={recipe.title}
            categorySlug={recipe.category_slug}
            eager
          />
          {credit && (
            <figcaption>
              Foto:{' '}
              <a href={credit.source_url} rel="noopener">
                {credit.creator ?? 'neznan avtor'}
              </a>
              ,{' '}
              <a href={credit.license_url} rel="noopener license">
                {credit.license}
              </a>
            </figcaption>
          )}
        </figure>

        <div className="article-body">
          <section className="ingredients" id="sestavine" aria-labelledby="sestavine-naslov">
            <h2 id="sestavine-naslov">Sestavine</h2>

            <div className="servings">
              <span id="porcije-oznaka">Porcije</span>
              <div className="stepper" role="group" aria-labelledby="porcije-oznaka">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  disabled={servings <= 1}
                  aria-label="Manj porcij"
                >
                  −
                </button>
                <output aria-live="polite" aria-label={`${servings} porcij`}>
                  {servings}
                </output>
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.min(50, s + 1))}
                  disabled={servings >= 50}
                  aria-label="Več porcij"
                >
                  +
                </button>
              </div>
            </div>

            <p className="ingredients-hint">Odkljukaj sestavine, ki jih že imaš doma.</p>
            <ul className="ingredient-list">
              {recipe.ingredients.map((ing, i) => (
                <li key={`${ing.name}-${i}`}>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={!selected[i]}
                      onChange={() => setSelected((s) => s.map((v, j) => (j === i ? !v : v)))}
                    />
                    <span className={selected[i] ? '' : 'have'}>
                      {ing.amount == null ? (
                        <>
                          {ing.name} <span className="qty-note">({ing.unit})</span>
                        </>
                      ) : (
                        <>
                          <strong>{formatQuantity(ing.amount * scale, ing.unit)}</strong> {ing.name}
                        </>
                      )}
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn add-to-list"
              onClick={addToShoppingList}
              disabled={adding || selectedCount === 0}
            >
              {adding
                ? 'Dodajam …'
                : selectedCount === recipe.ingredients.length
                  ? 'Dodaj sestavine na nakupovalni seznam'
                  : `Dodaj ${selectedCount} ${plural(selectedCount, ['sestavino', 'sestavini', 'sestavine', 'sestavin'])} na nakupovalni seznam`}
            </button>
          </section>

          <section className="steps" aria-labelledby="postopek">
            <h2 id="postopek">Postopek</h2>
            <ol>
              {recipe.steps.map((step, i) => (
                <li key={i}>
                  <span className="step-no" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>

            <section className="rate-box" aria-labelledby="oceni">
              <h2 id="oceni">Si skuhal? Oceni recept</h2>
              {myRating.status === 'loading' ? (
                <div className="skeleton" style={{ height: 48, width: 260 }} aria-hidden="true" />
              ) : (
                <>
                  <RatingInput value={myRating.data ?? null} onChange={saveRating} disabled={savingRating} />
                  {myRating.data != null && (
                    <p className="rate-note">
                      Tvoja ocena: {myRating.data} od 5.{' '}
                      <button type="button" className="link-button" onClick={clearRating} disabled={savingRating}>
                        Odstrani oceno
                      </button>
                    </p>
                  )}
                </>
              )}
            </section>
          </section>
        </div>

        {related.status === 'success' && related.data.length > 0 && (
          <section className="section" aria-labelledby="podobni">
            <div className="section-head">
              <h2 id="podobni">Še iz kategorije {recipe.category_name}</h2>
              <Link to={`/kategorije/${recipe.category_slug}`} className="section-link">
                Vsa kategorija →
              </Link>
            </div>
            <ul className="recipe-grid catalog-grid">
              {related.data.map((r) => (
                <li key={r.id}>
                  <RecipeCard recipe={r} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}

function DetailSkeleton() {
  return (
    <div className="container" aria-busy="true" aria-label="Nalaganje recepta" style={{ paddingBlock: '3rem' }}>
      <div className="skeleton" style={{ height: '1rem', width: 200, marginBottom: '2rem' }} />
      <div className="skeleton" style={{ height: '3.5rem', width: '60%', marginBottom: '1rem' }} />
      <div className="skeleton" style={{ height: '1.2rem', width: '45%', marginBottom: '2rem' }} />
      <div className="skeleton" style={{ aspectRatio: '16 / 7' }} />
    </div>
  )
}

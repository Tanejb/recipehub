import { Link } from 'react-router-dom'
import type { RecipeSummary } from '../lib/types'
import FavoriteButton from './FavoriteButton'
import RecipeImage from './RecipeImage'
import RecipeMeta from './RecipeMeta'

type Props = {
  recipe: RecipeSummary
  showDescription?: boolean
  headingLevel?: 'h2' | 'h3'
  eagerImage?: boolean
}

export default function RecipeCard({ recipe, showDescription = false, headingLevel = 'h3', eagerImage = false }: Props) {
  const Heading = headingLevel
  return (
    <article className="recipe-card">
      <RecipeImage
        src={recipe.image_url}
        alt=""
        title={recipe.title}
        categorySlug={recipe.category_slug}
        eager={eagerImage}
      />
      <span className="kicker">{recipe.category_name}</span>
      <Heading className="card-title">
        <Link to={`/recepti/${recipe.slug}`}>{recipe.title}</Link>
      </Heading>
      {showDescription && <p className="card-desc">{recipe.description}</p>}
      <RecipeMeta recipe={recipe} />
      {/* V DOM-u za naslovom, da bralnik zaslona najprej prebere recept; vizualno je na sliki. */}
      <FavoriteButton recipeId={recipe.id} recipeTitle={recipe.title} variant="icon" />
    </article>
  )
}

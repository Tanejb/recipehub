import { difficultyLabel, formatMinutes, formatRating } from '../lib/format'
import type { RecipeSummary } from '../lib/types'

export default function RecipeMeta({ recipe }: { recipe: RecipeSummary }) {
  return (
    <ul className="meta">
      {recipe.rating_count === 0 ? (
        <li>Še ni ocen</li>
      ) : (
      <li className="rating">
        <span aria-hidden="true">★ </span>
        <span className="visually-hidden">Ocena </span>
        {formatRating(recipe.rating_avg)}
        <span className="visually-hidden"> od 5,</span> ({recipe.rating_count}
        <span className="visually-hidden"> ocen</span>)
      </li>
      )}
      <li>
        <span className="visually-hidden">Čas priprave: </span>
        {formatMinutes(recipe.prep_minutes)}
      </li>
      <li>
        <span className="visually-hidden">Zahtevnost: </span>
        {difficultyLabel[recipe.difficulty]}
      </li>
    </ul>
  )
}

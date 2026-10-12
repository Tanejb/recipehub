export type Difficulty = 'lahka' | 'srednja' | 'zahtevna'

export type Ingredient = {
  name: string
  amount: number | null
  unit: string
}

export type Category = {
  id: number
  slug: string
  name: string
  description: string
  sort_order: number
}

export type CategoryWithCount = Category & { recipe_count: number }

/** Vrstica iz pogleda recipes_with_rating – dovolj za kartico recepta. */
export type RecipeSummary = {
  id: number
  slug: string
  title: string
  description: string
  category_id: number
  category_slug: string
  category_name: string
  prep_minutes: number
  difficulty: Difficulty
  servings: number
  image_url: string | null
  rating_avg: number | null
  rating_count: number
}

export type Recipe = RecipeSummary & {
  ingredients: Ingredient[]
  steps: string[]
  is_seed: boolean
  author_id: string | null
  created_at: string
}

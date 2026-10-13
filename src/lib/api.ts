import { supabase } from './supabase'
import type { CategoryWithCount, Difficulty, RecipeSummary } from './types'

// Vsi klici v bazo so zbrani tukaj, da komponente ne poznajo podrobnosti Supabase.

export const SUMMARY_COLUMNS =
  'id, slug, title, description, category_id, category_slug, category_name, prep_minutes, difficulty, servings, image_url, rating_avg, rating_count'

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name, description, sort_order, recipes(count)')
    .order('sort_order')
  if (error) throw error
  return data.map(({ recipes, ...category }) => ({
    ...category,
    recipe_count: (recipes as { count: number }[])[0]?.count ?? 0,
  }))
}

type ListOptions = { withImage?: boolean }

export async function getTopRatedRecipes(limit: number, { withImage = false }: ListOptions = {}): Promise<RecipeSummary[]> {
  let query = supabase.from('recipes_with_rating').select(SUMMARY_COLUMNS)
  if (withImage) query = query.not('image_url', 'is', null)
  const { data, error } = await query
    .order('rating_avg', { ascending: false, nullsFirst: false })
    .order('rating_count', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as RecipeSummary[]
}

export async function getQuickRecipes(
  maxMinutes: number,
  limit: number,
  { withImage = false }: ListOptions = {},
): Promise<RecipeSummary[]> {
  let query = supabase.from('recipes_with_rating').select(SUMMARY_COLUMNS)
  if (withImage) query = query.not('image_url', 'is', null)
  const { data, error } = await query
    .lte('prep_minutes', maxMinutes)
    .order('rating_count', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as RecipeSummary[]
}

export type SortKey = 'ocena' | 'cas' | 'abeceda' | 'novi'

export type RecipeFilters = {
  q: string
  categories: string[]
  maxMinutes: number | null
  difficulties: Difficulty[]
  sort: SortKey
}

/** Enako kot stolpec search_text v bazi: male črke, brez šumnikov. */
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[čć]/g, 'c')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/đ/g, 'd')
}

/**
 * Zelo preprosto krnjenje za slovenske sklone: odreže končnico, da »gobe« najde »gobami«,
 * »piščanec« najde »piščanca« in »česen« najde »česnom«. Zelo kratkih besed ne spreminja.
 */
export function stem(word: string): string {
  if (word.length <= 3) return word
  // Pri štirih črkah odrežemo le množinske končnice (gobe → gob), »buča« pa ostane »buča« (ne »bučka«).
  if (word.length === 4) return /[eio]$/.test(word) ? word.slice(0, 3) : word
  const cut = word.length >= 7 ? 3 : 2
  return word.slice(0, Math.max(3, word.length - cut))
}

export async function searchRecipes(filters: RecipeFilters): Promise<RecipeSummary[]> {
  let query = supabase.from('recipes_with_rating').select(SUMMARY_COLUMNS)

  // Vsaka beseda mora biti v imenu ali med sestavinami (npr. »piščanec gobe«).
  const words = normalizeSearch(filters.q)
    .replace(/[%_*,()\\]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  for (const word of words) query = query.ilike('search_text', `%${stem(word)}%`)

  if (filters.categories.length) query = query.in('category_slug', filters.categories)
  if (filters.maxMinutes) query = query.lte('prep_minutes', filters.maxMinutes)
  if (filters.difficulties.length) query = query.in('difficulty', filters.difficulties)

  switch (filters.sort) {
    case 'cas':
      query = query.order('prep_minutes').order('title')
      break
    case 'abeceda':
      query = query.order('title')
      break
    case 'novi':
      query = query.order('created_at', { ascending: false }).order('id', { ascending: false })
      break
    default:
      query = query.order('rating_avg', { ascending: false, nullsFirst: false }).order('rating_count', { ascending: false })
  }

  const { data, error } = await query
  if (error) throw error
  return data as RecipeSummary[]
}

import { supabase } from './supabase'
import type { CategoryWithCount, RecipeSummary } from './types'

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

export async function getTopRatedRecipes(limit: number): Promise<RecipeSummary[]> {
  const { data, error } = await supabase
    .from('recipes_with_rating')
    .select(SUMMARY_COLUMNS)
    .order('rating_avg', { ascending: false, nullsFirst: false })
    .order('rating_count', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as RecipeSummary[]
}

export async function getQuickRecipes(maxMinutes: number, limit: number): Promise<RecipeSummary[]> {
  const { data, error } = await supabase
    .from('recipes_with_rating')
    .select(SUMMARY_COLUMNS)
    .lte('prep_minutes', maxMinutes)
    .order('rating_count', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as RecipeSummary[]
}

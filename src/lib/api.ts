import { ensureVisitor, supabase } from './supabase'
import type { CategoryWithCount, Difficulty, Recipe, RecipeSummary } from './types'
import { unitLemma } from './units'

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

// --- Posamezen recept ------------------------------------------------------

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const { data, error } = await supabase.from('recipes_with_rating').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  return data as Recipe | null
}

export async function getRelatedRecipes(categorySlug: string, excludeId: number, limit: number): Promise<RecipeSummary[]> {
  const { data, error } = await supabase
    .from('recipes_with_rating')
    .select(SUMMARY_COLUMNS)
    .eq('category_slug', categorySlug)
    .neq('id', excludeId)
    .not('image_url', 'is', null)
    .order('rating_avg', { ascending: false, nullsFirst: false })
    .limit(limit)
  if (error) throw error
  return data as RecipeSummary[]
}

// --- Ocene ------------------------------------------------------------------

export async function getMyRating(recipeId: number): Promise<number | null> {
  const userId = await ensureVisitor()
  const { data, error } = await supabase
    .from('ratings')
    .select('stars')
    .eq('recipe_id', recipeId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data?.stars ?? null
}

export async function rateRecipe(recipeId: number, stars: number): Promise<void> {
  const userId = await ensureVisitor()
  const { error } = await supabase
    .from('ratings')
    .upsert({ recipe_id: recipeId, user_id: userId, stars }, { onConflict: 'recipe_id,user_id' })
  if (error) throw error
}

export async function removeMyRating(recipeId: number): Promise<void> {
  const userId = await ensureVisitor()
  const { error } = await supabase.from('ratings').delete().eq('recipe_id', recipeId).eq('user_id', userId)
  if (error) throw error
}

// --- Priljubljeni -------------------------------------------------------------

export async function getFavoriteIds(): Promise<number[]> {
  await ensureVisitor()
  const { data, error } = await supabase.from('favorites').select('recipe_id')
  if (error) throw error
  return data.map((f) => f.recipe_id as number)
}

export async function setFavorite(recipeId: number, favorite: boolean): Promise<void> {
  const userId = await ensureVisitor()
  const { error } = favorite
    ? await supabase.from('favorites').upsert({ user_id: userId, recipe_id: recipeId }, { onConflict: 'user_id,recipe_id' })
    : await supabase.from('favorites').delete().eq('user_id', userId).eq('recipe_id', recipeId)
  if (error) throw error
}

// --- Nakupovalni seznam ---------------------------------------------------------

export type ShoppingItem = {
  id: number
  recipe_id: number | null
  name: string
  amount: number | null
  unit: string
  checked: boolean
  created_at: string
}

export async function getShoppingItems(): Promise<ShoppingItem[]> {
  await ensureVisitor()
  const { data, error } = await supabase
    .from('shopping_items')
    .select('id, recipe_id, name, amount, unit, checked, created_at')
    .order('created_at')
    .order('id')
  if (error) throw error
  return data as ShoppingItem[]
}

/**
 * Doda sestavine recepta na seznam. Če je ista sestavina istega recepta z isto enoto že na
 * seznamu (in še ni odkljukana), se količini seštejeta, namesto da bi nastala podvojena vrstica.
 * Sestavine različnih receptov ostanejo ločene, ker je seznam razdeljen po receptih.
 * Vrne število novih in posodobljenih vrstic.
 */
export async function addIngredientsToShoppingList(
  recipeId: number,
  ingredients: { name: string; amount: number | null; unit: string }[],
): Promise<{ added: number; updated: number }> {
  const userId = await ensureVisitor()
  const existing = await getShoppingItems()
  const key = (name: string, unit: string) => `${name.trim().toLowerCase()}|${unitLemma(unit)}`
  const open = new Map(
    existing.filter((i) => !i.checked && i.recipe_id === recipeId).map((i) => [key(i.name, i.unit), i]),
  )

  const inserts: Omit<ShoppingItem, 'id' | 'checked' | 'created_at'>[] = []
  const updates: { id: number; amount: number }[] = []

  for (const ing of ingredients) {
    const unit = unitLemma(ing.unit)
    const match = open.get(key(ing.name, unit))
    if (!match) {
      inserts.push({ recipe_id: recipeId, name: ing.name, amount: ing.amount, unit })
    } else if (ing.amount != null && match.amount != null) {
      updates.push({ id: match.id, amount: Math.round((match.amount + ing.amount) * 100) / 100 })
    }
    // »sol po okusu«, ki je že na seznamu, ne podvajamo.
  }

  if (inserts.length) {
    const { error } = await supabase.from('shopping_items').insert(inserts.map((i) => ({ ...i, user_id: userId })))
    if (error) throw error
  }
  for (const u of updates) {
    const { error } = await supabase.from('shopping_items').update({ amount: u.amount }).eq('id', u.id)
    if (error) throw error
  }
  return { added: inserts.length, updated: updates.length }
}

export async function countOpenShoppingItems(): Promise<number> {
  await ensureVisitor()
  const { count, error } = await supabase
    .from('shopping_items')
    .select('id', { count: 'exact', head: true })
    .eq('checked', false)
  if (error) throw error
  return count ?? 0
}

// --- Kategorije in priljubljeni (seznami) ---------------------------------------

/** Naslovna fotografija vsake kategorije: najbolje ocenjen recept s fotografijo. */
export async function getCategoryCovers(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('recipes_with_rating')
    .select('category_slug, image_url')
    .not('image_url', 'is', null)
    .order('rating_avg', { ascending: false, nullsFirst: false })
  if (error) throw error
  const covers: Record<string, string> = {}
  for (const r of data) covers[r.category_slug as string] ??= r.image_url as string
  return covers
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
  const categories = await getCategoriesWithCounts()
  return categories.find((c) => c.slug === slug) ?? null
}

/** Priljubljeni recepti, nazadnje dodani na začetku. */
export async function getFavoriteRecipes(): Promise<RecipeSummary[]> {
  await ensureVisitor()
  const { data: favs, error } = await supabase
    .from('favorites')
    .select('recipe_id, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  if (!favs.length) return []
  const ids = favs.map((f) => f.recipe_id as number)
  const { data, error: e2 } = await supabase.from('recipes_with_rating').select(SUMMARY_COLUMNS).in('id', ids)
  if (e2) throw e2
  const byId = new Map((data as RecipeSummary[]).map((r) => [r.id, r]))
  return ids.map((id) => byId.get(id)).filter((r): r is RecipeSummary => Boolean(r))
}

export type ShoppingList = { items: ShoppingItem[]; recipes: Record<number, { slug: string; title: string }> }

/** Postavke skupaj z imeni receptov, iz katerih izhajajo (za združevanje po receptu). */
export async function getShoppingList(): Promise<ShoppingList> {
  const items = await getShoppingItems()
  const ids = [...new Set(items.map((i) => i.recipe_id).filter((id): id is number => id != null))]
  const recipes: ShoppingList['recipes'] = {}
  if (ids.length) {
    const { data, error } = await supabase.from('recipes').select('id, slug, title').in('id', ids)
    if (error) throw error
    for (const r of data) recipes[r.id as number] = { slug: r.slug as string, title: r.title as string }
  }
  return { items, recipes }
}

export async function addManualShoppingItem(item: { name: string; amount: number | null; unit: string }): Promise<ShoppingItem> {
  const userId = await ensureVisitor()
  const { data, error } = await supabase
    .from('shopping_items')
    .insert({ user_id: userId, recipe_id: null, name: item.name, amount: item.amount, unit: unitLemma(item.unit) })
    .select('id, recipe_id, name, amount, unit, checked, created_at')
    .single()
  if (error) throw error
  return data as ShoppingItem
}

export async function updateShoppingItem(id: number, patch: Partial<Pick<ShoppingItem, 'checked' | 'amount'>>): Promise<void> {
  const { error } = await supabase.from('shopping_items').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteShoppingItems(ids: number[]): Promise<void> {
  if (!ids.length) return
  const { error } = await supabase.from('shopping_items').delete().in('id', ids)
  if (error) throw error
}

/** Ponovno vstavi izbrisane postavke (za »Razveljavi«). */
export async function restoreShoppingItems(items: ShoppingItem[]): Promise<void> {
  const userId = await ensureVisitor()
  const { error } = await supabase.from('shopping_items').insert(
    items.map(({ recipe_id, name, amount, unit, checked, created_at }) => ({
      user_id: userId,
      recipe_id,
      name,
      amount,
      unit,
      checked,
      created_at,
    })),
  )
  if (error) throw error
}

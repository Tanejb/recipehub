// Iz scripts/seed-data.mjs generira supabase/02_seed.sql.
import { existsSync, writeFileSync } from 'node:fs'
import { categories, recipes } from './seed-data.mjs'

const q = (s) => `'${String(s).replaceAll("'", "''")}'`

const lines = [
  '-- RecipeHub – začetni podatki (generirano z `npm run seed:build`, ne urejaj ročno).',
  '-- Zaženi po 01_schema.sql. Ponoven zagon pobriše in znova vstavi vse podatke.',
  '',
  'truncate public.shopping_items, public.favorites, public.ratings, public.recipes, public.categories restart identity cascade;',
  '',
  'insert into public.categories (slug, name, description, sort_order) values',
  categories.map((c, i) => `  (${q(c.slug)}, ${q(c.name)}, ${q(c.description)}, ${i + 1})`).join(',\n') + ';',
  '',
]

for (const r of recipes) {
  const [count, avg] = r.rating
  const ingredients = JSON.stringify(r.ingredients.map(([name, amount, unit]) => ({ name, amount, unit })))
  lines.push(
    'insert into public.recipes (slug, title, description, category_id, prep_minutes, difficulty, servings, image_url, ingredients, steps, base_rating_count, base_rating_sum, is_seed, author_id)',
    `select ${q(r.slug)}, ${q(r.title)}, ${q(r.description)}, id, ${r.prep}, ${q(r.difficulty)}, ${r.servings}, ${existsSync(new URL(`../public/images/recipes/${r.slug}.webp`, import.meta.url)) ? q(`/images/recipes/${r.slug}.webp`) : 'null'},`,
    `  ${q(ingredients)}::jsonb,`,
    `  array[${r.steps.map(q).join(', ')}],`,
    `  ${count}, ${Math.round(count * avg)}, true, null`,
    `from public.categories where slug = ${q(r.category)};`,
    '',
  )
}

writeFileSync(new URL('../supabase/02_seed.sql', import.meta.url), lines.join('\n'))
console.log(`02_seed.sql: ${categories.length} kategorij, ${recipes.length} receptov`)

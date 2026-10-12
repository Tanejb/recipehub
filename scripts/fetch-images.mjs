// Za vsak recept poišče fotografijo na Openverse (odprte licence CC0 / CC BY, večinoma Flickr),
// jo pretvori v WebP (800×600) in shrani v public/images/recipes/<slug>.webp.
// Avtorje in licence zapiše v src/data/image-credits.json (prikazani so v aplikaciji).
//
// Uporaba:  npm run images            (prenese samo manjkajoče)
//           npm run images -- --force (prenese vse znova)
//           npm run images -- golaz   (izbrani recept zamenja z naslednjim zadetkom)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { recipes } from './seed-data.mjs'

// Angleški iskalni nizi dajo bistveno boljše zadetke.
const QUERIES = {
  'palacinke-z-marelicno-marmelado': 'crepes with jam',
  'ovseni-kosmici-z-jabolki-in-cimetom': 'oatmeal with apple cinnamon',
  'umesana-jajca-z-drobnjakom': 'scrambled eggs toast',
  'domaca-granola-z-orescki': 'granola bowl',
  'goveja-juha-z-rezanci': 'beef broth soup',
  'bucna-kremna-juha': 'pumpkin soup bowl',
  jota: 'sauerkraut soup',
  'paradiznikova-juha-z-baziliko': 'tomato soup basil',
  'piscanec-v-smetanovi-omaki-z-gobami': 'chicken mushroom cream sauce',
  golaz: 'beef goulash',
  'pecen-losos-z-limono-in-krompirjem': 'baked salmon fillet',
  'polnjene-paprike': 'stuffed peppers tomato sauce',
  'rizota-z-jurcki': 'mushroom risotto',
  'spageti-aglio-olio': 'spaghetti aglio olio',
  'zelenjavni-curry-s-cicariko': 'chickpea curry',
  'kuhani-skutni-struklji': 'cottage cheese dumplings',
  'krompirjeva-solata': 'potato salad',
  'grska-solata': 'greek salad feta',
  'pecena-zelenjava-z-zelisci': 'roasted vegetables',
  'kuskus-solata-s-papriko': 'couscous salad bowl',
  'orehova-potica': 'potica',
  'jabolcni-zavitek': 'apple strudel slice',
  'cokoladni-mousse': 'chocolate mousse glass',
  'prekmurska-gibanica': 'layered pastry cake',
  'francoski-toast-z-jagodami': 'french toast strawberries',
  saksuka: 'shakshuka',
  'smoothie-skleda-z-banano': 'smoothie bowl',
  'omleta-s-sirom-in-sunko': 'omelette cheese ham',
  'domaci-kruh-s-semeni': 'seeded bread loaf',
  ricet: 'barley soup',
  'piscancja-juha-z-zelenjavo': 'chicken vegetable soup',
  'gobova-kremna-juha': 'cream of mushroom soup',
  minestrone: 'minestrone soup',
  'dunajski-zrezek': 'wiener schnitzel',
  'mesne-kroglice-v-paradiznikovi-omaki': 'meatballs tomato sauce',
  'piscancja-bedra-z-medom-in-gorcico': 'honey mustard chicken thighs',
  'spageti-bolognese': 'spaghetti bolognese',
  'tortilje-s-piscancem-in-papriko': 'chicken fajitas',
  'zelenjavna-lazanja': 'vegetable lasagna',
  'falafel-z-jogurtovo-omako': 'falafel yogurt sauce',
  'pica-margerita': 'pizza margherita',
  'ocvrti-sir-s-tatarsko-omako': 'breaded fried cheese',
  'ajdova-kasa-z-gobami': 'kasha mushrooms',
  'krompirjev-pire': 'mashed potatoes bowl',
  'fizolova-solata-z-bucnim-oljem': 'bean salad red onion',
  'zeljna-solata-z-jogurtovim-prelivom': 'cabbage salad',
  'rizi-bizi': 'rice with peas',
  tiramisu: 'tiramisu',
  'cokoladni-piskoti': 'chocolate chip cookies',
  'panna-cotta-z-jagodno-omako': 'panna cotta dessert',
  'bananin-kruh': 'banana bread',
  'kremna-rezina': 'cremeschnitte',
}

const args = process.argv.slice(2)
const force = args.includes('--force')
const only = args.filter((a) => !a.startsWith('--'))

const outDir = new URL('../public/images/recipes/', import.meta.url)
mkdirSync(outDir, { recursive: true })
const creditsFile = new URL('../src/data/image-credits.json', import.meta.url)
mkdirSync(new URL('.', creditsFile), { recursive: true })
const credits = existsSync(creditsFile) ? JSON.parse(readFileSync(creditsFile, 'utf8')) : {}

const missingQuery = recipes.filter((r) => !QUERIES[r.slug]).map((r) => r.slug)
if (missingQuery.length) console.warn('Brez iskalnega niza:', missingQuery.join(', '))

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

for (const r of recipes) {
  if (only.length && !only.includes(r.slug)) continue
  const file = new URL(`${r.slug}.webp`, outDir)
  if (existsSync(file) && !force && !only.length) continue

  const query = QUERIES[r.slug] ?? r.title
  const res = await fetch(
    `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license=cc0,pdm,by&aspect_ratio=wide&size=medium,large&mature=false&page_size=20`,
    { headers: { 'User-Agent': 'RecipeHub student project (FERI UM)' } },
  )
  if (!res.ok) {
    console.error(`${r.slug}: Openverse napaka ${res.status}`)
    await sleep(2000)
    continue
  }
  const { results } = await res.json()
  // Pri ponovnem prenosu posameznega recepta preskočimo že uporabljene zadetke.
  const tried = new Set(only.length ? (credits[r.slug]?.rejected ?? []).concat(credits[r.slug]?.id ?? []) : [])
  const candidates = (results ?? []).filter((x) => x.width >= 640 && !tried.has(x.id))

  let saved = false
  for (const photo of candidates) {
    try {
      const img = await fetch(photo.url, { headers: { 'User-Agent': 'RecipeHub student project (FERI UM)' } })
      if (!img.ok) continue
      const buffer = Buffer.from(await img.arrayBuffer())
      await sharp(buffer).resize(800, 600, { fit: 'cover' }).webp({ quality: 74 }).toFile(fileURLToPath(file))
      credits[r.slug] = {
        id: photo.id,
        rejected: [...tried],
        title: photo.title,
        creator: photo.creator,
        creator_url: photo.creator_url,
        license: `${photo.license === 'pdm' ? 'Public Domain Mark' : photo.license.toUpperCase()} ${photo.license_version ?? ''}`.trim(),
        license_url: photo.license_url,
        source_url: photo.foreign_landing_url,
      }
      console.log(`✔ ${r.slug} ← ${photo.creator ?? 'neznan avtor'} (${photo.license})`)
      writeFileSync(creditsFile, JSON.stringify(credits, null, 2) + '\n')
      saved = true
      break
    } catch {
      // poškodovana ali nedosegljiva slika – poskusi naslednjo
    }
  }
  if (!saved) console.warn(`✘ ${r.slug}: ni ustrezne slike za "${query}"`)
  await sleep(1100)
}

writeFileSync(creditsFile, JSON.stringify(credits, null, 2) + '\n')
console.log('Končano.')

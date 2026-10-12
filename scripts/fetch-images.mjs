// Za vsak recept poišče fotografijo na Pexels, jo pretvori v WebP (800×600) in shrani v
// public/images/recipes/<slug>.webp. Avtorje zapiše v scripts/image-credits.json.
//
// Uporaba:  npm run images            (prenese samo manjkajoče)
//           npm run images -- --force (prenese vse znova)
//           npm run images -- golaz   (samo izbrani recept; uporabno, če je slika neustrezna)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { recipes } from './seed-data.mjs'

// Angleški iskalni nizi dajo na Pexels bistveno boljše zadetke.
const QUERIES = {
  'palacinke-z-marelicno-marmelado': 'crepes with jam',
  'ovseni-kosmici-z-jabolki-in-cimetom': 'oatmeal with apple cinnamon',
  'umesana-jajca-z-drobnjakom': 'scrambled eggs chives',
  'domaca-granola-z-orescki': 'homemade granola nuts',
  'goveja-juha-z-rezanci': 'beef noodle soup broth',
  'bucna-kremna-juha': 'pumpkin cream soup',
  jota: 'bean sauerkraut stew',
  'paradiznikova-juha-z-baziliko': 'tomato soup basil',
  'piscanec-v-smetanovi-omaki-z-gobami': 'creamy chicken mushroom',
  golaz: 'beef goulash',
  'pecen-losos-z-limono-in-krompirjem': 'baked salmon lemon potatoes',
  'polnjene-paprike': 'stuffed peppers tomato sauce',
  'rizota-z-jurcki': 'mushroom risotto',
  'spageti-aglio-olio': 'spaghetti aglio olio',
  'zelenjavni-curry-s-cicariko': 'chickpea curry',
  'kuhani-skutni-struklji': 'cheese dumplings rolled',
  'krompirjeva-solata': 'potato salad onion',
  'grska-solata': 'greek salad feta',
  'pecena-zelenjava-z-zelisci': 'roasted vegetables herbs',
  'kuskus-solata-s-papriko': 'couscous salad',
  'orehova-potica': 'walnut roll cake',
  'jabolcni-zavitek': 'apple strudel',
  'cokoladni-mousse': 'chocolate mousse',
  'prekmurska-gibanica': 'layered cake poppy seed',
  'francoski-toast-z-jagodami': 'french toast strawberries',
  saksuka: 'shakshuka',
  'smoothie-skleda-z-banano': 'smoothie bowl blueberries',
  'omleta-s-sirom-in-sunko': 'omelette cheese ham',
  'domaci-kruh-s-semeni': 'seeded bread loaf',
  ricet: 'barley bean stew',
  'piscancja-juha-z-zelenjavo': 'chicken vegetable soup',
  'gobova-kremna-juha': 'mushroom cream soup',
  minestrone: 'minestrone soup',
  'dunajski-zrezek': 'wiener schnitzel',
  'mesne-kroglice-v-paradiznikovi-omaki': 'meatballs tomato sauce',
  'piscancja-bedra-z-medom-in-gorcico': 'honey mustard chicken thighs',
  'spageti-bolognese': 'spaghetti bolognese',
  'tortilje-s-piscancem-in-papriko': 'chicken fajitas',
  'zelenjavna-lazanja': 'vegetable lasagna',
  'falafel-z-jogurtovo-omako': 'falafel yogurt sauce',
  'pica-margerita': 'pizza margherita',
  'ocvrti-sir-s-tatarsko-omako': 'fried cheese breaded',
  'ajdova-kasa-z-gobami': 'buckwheat mushrooms',
  'krompirjev-pire': 'mashed potatoes',
  'fizolova-solata-z-bucnim-oljem': 'bean salad red onion',
  'zeljna-solata-z-jogurtovim-prelivom': 'coleslaw',
  'rizi-bizi': 'rice with peas',
  tiramisu: 'tiramisu',
  'cokoladni-piskoti': 'chocolate chip cookies',
  'panna-cotta-z-jagodno-omako': 'panna cotta strawberry',
  'bananin-kruh': 'banana bread',
  'kremna-rezina': 'cream slice custard cake',
}

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
)
const KEY = env.PEXELS_API_KEY
if (!KEY) {
  console.error('Manjka PEXELS_API_KEY v .env')
  process.exit(1)
}

const args = process.argv.slice(2)
const force = args.includes('--force')
const only = args.filter((a) => !a.startsWith('--'))

const outDir = new URL('../public/images/recipes/', import.meta.url)
mkdirSync(outDir, { recursive: true })
const creditsFile = new URL('./image-credits.json', import.meta.url)
const credits = existsSync(creditsFile) ? JSON.parse(readFileSync(creditsFile, 'utf8')) : {}

const missingQuery = recipes.filter((r) => !QUERIES[r.slug]).map((r) => r.slug)
if (missingQuery.length) console.warn('Brez iskalnega niza:', missingQuery.join(', '))

for (const r of recipes) {
  if (only.length && !only.includes(r.slug)) continue
  const file = new URL(`${r.slug}.webp`, outDir)
  if (existsSync(file) && !force && !only.length) continue

  const query = QUERIES[r.slug] ?? r.title
  // Pri ponovnem prenosu posameznega recepta vzamemo naslednji zadetek, da dobimo drugo sliko.
  const skip = only.length && credits[r.slug] ? (credits[r.slug].pick ?? 0) + 1 : 0
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=10`,
    { headers: { Authorization: KEY } },
  )
  if (!res.ok) {
    console.error(`${r.slug}: Pexels napaka ${res.status}`)
    continue
  }
  const { photos } = await res.json()
  const photo = photos?.[skip % Math.max(photos.length, 1)]
  if (!photo) {
    console.warn(`${r.slug}: ni zadetkov za "${query}"`)
    continue
  }

  const img = await fetch(photo.src.large2x)
  const buffer = Buffer.from(await img.arrayBuffer())
  await sharp(buffer).resize(800, 600, { fit: 'cover' }).webp({ quality: 74 }).toFile(fileURLToPath(file))

  credits[r.slug] = {
    pick: skip,
    query,
    photographer: photo.photographer,
    photographer_url: photo.photographer_url,
    pexels_url: photo.url,
    alt: photo.alt,
  }
  console.log(`✔ ${r.slug} ← ${photo.photographer}`)
  await new Promise((resolve) => setTimeout(resolve, 250))
}

writeFileSync(creditsFile, JSON.stringify(credits, null, 2) + '\n')
console.log('Končano.')

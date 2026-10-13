// Enote v slovenščini se sklanjajo glede na število (1 žlica, 2 žlici, 3 žlice, 5 žlic, 1,5 žlice).
// Vsako enoto prevedemo na osnovno obliko (lemo) in jo ob izpisu postavimo v pravi sklon.

type Forms = [one: string, two: string, few: string, many: string, fraction: string]

const UNIT_FORMS: Record<string, Forms> = {
  žlica: ['žlica', 'žlici', 'žlice', 'žlic', 'žlice'],
  žlička: ['žlička', 'žlički', 'žličke', 'žličk', 'žličke'],
  strok: ['strok', 'stroka', 'stroki', 'strokov', 'stroka'],
  šopek: ['šopek', 'šopka', 'šopki', 'šopkov', 'šopka'],
  rezina: ['rezina', 'rezini', 'rezine', 'rezin', 'rezine'],
  vejica: ['vejica', 'vejici', 'vejice', 'vejic', 'vejice'],
  zavitek: ['zavitek', 'zavitka', 'zavitki', 'zavitkov', 'zavitka'],
  vrečka: ['vrečka', 'vrečki', 'vrečke', 'vrečk', 'vrečke'],
  steblo: ['steblo', 'stebli', 'stebla', 'stebel', 'stebla'],
  ščep: ['ščep', 'ščepa', 'ščepi', 'ščepov', 'ščepa'],
}

const LEMMA_BY_FORM = new Map<string, string>()
for (const [lemma, forms] of Object.entries(UNIT_FORMS)) {
  for (const form of forms) LEMMA_BY_FORM.set(form, lemma)
}

/** »žlici« → »žlica«; neznane enote (g, ml, kos …) ostanejo enake. */
export function unitLemma(unit: string): string {
  return LEMMA_BY_FORM.get(unit.trim().toLowerCase()) ?? unit.trim()
}

const FRACTIONS: [number, string][] = [
  [0.25, '¼'],
  [0.33, '⅓'],
  [0.5, '½'],
  [0.67, '⅔'],
  [0.75, '¾'],
]

export function formatAmount(amount: number): string {
  // Velike količine v g/ml zaokrožimo, da ne dobimo »437,5 g«.
  if (amount >= 50) return String(Math.round(amount / 5) * 5)
  const whole = Math.floor(amount)
  const rest = amount - whole
  if (rest < 0.05) return String(whole)
  const fraction = FRACTIONS.find(([value]) => Math.abs(rest - value) < 0.05)
  if (fraction) return whole === 0 ? fraction[1] : `${whole} ${fraction[1]}`
  return amount.toFixed(1).replace('.', ',')
}

function unitForm(unit: string, amount: number): string {
  const forms = UNIT_FORMS[unitLemma(unit)]
  if (!forms) return unit
  if (!Number.isInteger(Math.round(amount * 100) / 100)) return forms[4]
  const mod = Math.round(amount) % 100
  if (mod === 1) return forms[0]
  if (mod === 2) return forms[1]
  if (mod === 3 || mod === 4) return forms[2]
  return forms[3]
}

// Šteti kosi: »2 ⅔ kos lovorjev list« nima smisla, zato nad 2 zaokrožimo na celo število.
const COUNTED = new Set(['kos', 'strok', 'zavitek', 'vrečka', 'steblo', 'rezina', 'vejica', 'šopek'])

/** Količina z enoto, npr. »2 žlici«, »1 ½ žlice«, »po okusu«. */
export function formatQuantity(amount: number | null, unit: string): string {
  if (amount == null) return unit
  if (COUNTED.has(unitLemma(unit)) && amount >= 2) amount = Math.round(amount)
  const shown = formatAmount(amount)
  // Za enoto uporabimo zaokroženo vrednost, ki jo uporabnik vidi.
  const numeric = amount >= 50 ? Math.round(amount / 5) * 5 : amount
  return `${shown} ${unitForm(unit, numeric)}`.trim()
}

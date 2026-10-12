import type { Difficulty } from './types'

export function formatMinutes(total: number): string {
  if (total < 60) return `${total} min`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

export const difficultyLabel: Record<Difficulty, string> = {
  lahka: 'Lahka',
  srednja: 'Srednja',
  zahtevna: 'Zahtevna',
}

/** Slovenska dvojina in množina: 1 recept, 2 recepta, 3 recepti, 5 receptov. */
export function plural(n: number, forms: [one: string, two: string, few: string, many: string]): string {
  const mod = Math.abs(n) % 100
  if (mod === 1) return forms[0]
  if (mod === 2) return forms[1]
  if (mod === 3 || mod === 4) return forms[2]
  return forms[3]
}

export const recipesWord = (n: number) => `${n} ${plural(n, ['recept', 'recepta', 'recepti', 'receptov'])}`

export function formatRating(avg: number | null): string {
  return avg == null ? '–' : avg.toFixed(1).replace('.', ',')
}

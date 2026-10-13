import { useState } from 'react'

const LABELS = ['Slabo', 'Povprečno', 'Dobro', 'Zelo dobro', 'Odlično']

type Props = {
  value: number | null
  onChange: (stars: number) => void
  disabled?: boolean
}

// Ocena kot skupina izbirnih gumbov: dostopna s tipkovnico (puščice) in bralnikom zaslona.
export default function RatingInput({ value, onChange, disabled = false }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value ?? 0

  return (
    <fieldset className="rating-input" disabled={disabled} onMouseLeave={() => setHover(null)}>
      <legend className="visually-hidden">Tvoja ocena recepta</legend>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className={n <= shown ? 'on' : ''} onMouseEnter={() => setHover(n)}>
            <input
              type="radio"
              name="ocena"
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="visually-hidden"
            />
            <span aria-hidden="true">★</span>
            <span className="visually-hidden">
              {n} od 5 – {LABELS[n - 1]}
            </span>
          </label>
        ))}
      </div>
      <span className="rating-hint" aria-hidden="true">
        {shown ? LABELS[shown - 1] : 'Izberi oceno'}
      </span>
    </fieldset>
  )
}

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { createRecipe, getCategoriesWithCounts } from '../lib/api'
import { difficultyLabel } from '../lib/format'
import { MAX_UPLOAD_MB, prepareImage } from '../lib/image'
import type { Difficulty } from '../lib/types'
import { useToast } from '../state/Toast'

// --- Stanje obrazca -----------------------------------------------------------------

type IngredientRow = { key: string; amount: string; unit: string; name: string }
type StepRow = { key: string; text: string }
type Draft = {
  title: string
  description: string
  categoryId: string
  prepMinutes: string
  difficulty: '' | Difficulty
  servings: string
  ingredients: IngredientRow[]
  steps: StepRow[]
}
type Photo = { blob: Blob; url: string; name: string }
type FieldError = { id: string; message: string }

const DRAFT_KEY = 'recipehub-osnutek-recepta'
const DESCRIPTION_MAX = 600
const UNIT_SUGGESTIONS = ['g', 'kg', 'ml', 'l', 'kos', 'žlica', 'žlička', 'ščep', 'strok', 'šopek', 'zavitek', 'vrečka', 'po okusu']
const DIFFICULTIES: Difficulty[] = ['lahka', 'srednja', 'zahtevna']

let keyCounter = 0
const newKey = () => `r${Date.now().toString(36)}${(keyCounter++).toString(36)}`
const emptyIngredient = (): IngredientRow => ({ key: newKey(), amount: '', unit: '', name: '' })
const emptyStep = (): StepRow => ({ key: newKey(), text: '' })

function emptyDraft(): Draft {
  return {
    title: '',
    description: '',
    categoryId: '',
    prepMinutes: '',
    difficulty: '',
    servings: '4',
    ingredients: [emptyIngredient(), emptyIngredient(), emptyIngredient()],
    steps: [emptyStep(), emptyStep()],
  }
}

function isDraftEmpty(d: Draft) {
  return (
    !d.title.trim() &&
    !d.description.trim() &&
    !d.categoryId &&
    !d.prepMinutes &&
    !d.difficulty &&
    d.ingredients.every((i) => !i.name.trim() && !i.amount.trim()) &&
    d.steps.every((s) => !s.text.trim())
  )
}

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as Draft) : null
  } catch {
    return null
  }
}

const parseNumber = (text: string) => Number(text.trim().replace(',', '.'))

// --- Preverjanje -----------------------------------------------------------------------

function validate(d: Draft): FieldError[] {
  const errors: FieldError[] = []
  const title = d.title.trim()
  if (!title) errors.push({ id: 'naslov', message: 'Vpiši naslov recepta.' })
  else if (title.length < 3) errors.push({ id: 'naslov', message: 'Naslov mora imeti vsaj 3 znake.' })
  else if (title.length > 120) errors.push({ id: 'naslov', message: 'Naslov je lahko dolg največ 120 znakov.' })

  if (d.description.length > DESCRIPTION_MAX)
    errors.push({ id: 'opis', message: `Opis je lahko dolg največ ${DESCRIPTION_MAX} znakov.` })

  if (!d.categoryId) errors.push({ id: 'kategorija', message: 'Izberi kategorijo.' })

  const minutes = parseNumber(d.prepMinutes)
  if (!d.prepMinutes.trim()) errors.push({ id: 'cas', message: 'Vpiši čas priprave v minutah.' })
  else if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440)
    errors.push({ id: 'cas', message: 'Čas priprave mora biti celo število minut med 1 in 1440.' })

  if (!d.difficulty) errors.push({ id: 'zahtevnost-lahka', message: 'Izberi zahtevnost.' })

  const servings = parseNumber(d.servings)
  if (!Number.isInteger(servings) || servings < 1 || servings > 50)
    errors.push({ id: 'porcije', message: 'Število porcij mora biti celo število med 1 in 50.' })

  const filledIngredients = d.ingredients.filter((i) => i.name.trim() || i.amount.trim() || i.unit.trim())
  if (filledIngredients.length === 0)
    errors.push({ id: `sestavina-${d.ingredients[0]?.key}-ime`, message: 'Dodaj vsaj eno sestavino.' })
  filledIngredients.forEach((i) => {
    const n = d.ingredients.indexOf(i) + 1
    if (!i.name.trim()) errors.push({ id: `sestavina-${i.key}-ime`, message: `Sestavina ${n}: vpiši ime sestavine.` })
    if (i.amount.trim() && !(parseNumber(i.amount) > 0))
      errors.push({ id: `sestavina-${i.key}-kolicina`, message: `Sestavina ${n}: količina mora biti pozitivno število (npr. 200 ali 0,5).` })
  })

  if (d.steps.every((s) => !s.text.trim()))
    errors.push({ id: `korak-${d.steps[0]?.key}`, message: 'Opiši vsaj en korak priprave.' })

  return errors
}

// --- Stran -----------------------------------------------------------------------------

export default function AddRecipePage() {
  usePageTitle('Dodaj recept')
  const navigate = useNavigate()
  const toast = useToast()
  const categories = useAsync(getCategoriesWithCounts, [])

  const [draft, setDraft] = useState<Draft>(() => loadDraft() ?? emptyDraft())
  const [restored] = useState(() => {
    const d = loadDraft()
    return Boolean(d && !isDraftEmpty(d))
  })
  const [showRestored, setShowRestored] = useState(restored)
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [photoError, setPhotoError] = useState('')
  const [processingPhoto, setProcessingPhoto] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const [focusId, setFocusId] = useState<string | null>(null)

  const errors = attempted ? validate(draft) : []
  const errorFor = (id: string) => errors.find((e) => e.id === id)?.message

  // Osnutek se sproti shranjuje v brskalnik (brez fotografije).
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (isDraftEmpty(draft)) localStorage.removeItem(DRAFT_KEY)
        else {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
          setSavedAt(new Date())
        }
      } catch {
        // zasebno brskanje ali poln pomnilnik – osnutek se pač ne shrani
      }
    }, 600)
    return () => clearTimeout(t)
  }, [draft])

  // Po dodajanju vrstice premaknemo fokus v novo polje.
  useEffect(() => {
    if (!focusId) return
    document.getElementById(focusId)?.focus()
    setFocusId(null)
  }, [focusId])

  useEffect(() => () => (photo ? URL.revokeObjectURL(photo.url) : undefined), [photo])

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }))

  function updateIngredient(key: string, field: keyof Omit<IngredientRow, 'key'>, value: string) {
    setDraft((d) => ({ ...d, ingredients: d.ingredients.map((i) => (i.key === key ? { ...i, [field]: value } : i)) }))
  }

  function addIngredient() {
    const row = emptyIngredient()
    setDraft((d) => ({ ...d, ingredients: [...d.ingredients, row] }))
    setFocusId(`sestavina-${row.key}-kolicina`)
  }

  function removeIngredient(key: string) {
    setDraft((d) => {
      const rest = d.ingredients.filter((i) => i.key !== key)
      return { ...d, ingredients: rest.length ? rest : [emptyIngredient()] }
    })
    setFocusId('dodaj-sestavino')
  }

  function updateStep(key: string, text: string) {
    setDraft((d) => ({ ...d, steps: d.steps.map((s) => (s.key === key ? { ...s, text } : s)) }))
  }

  function addStep() {
    const row = emptyStep()
    setDraft((d) => ({ ...d, steps: [...d.steps, row] }))
    setFocusId(`korak-${row.key}`)
  }

  function removeStep(key: string) {
    setDraft((d) => {
      const rest = d.steps.filter((s) => s.key !== key)
      return { ...d, steps: rest.length ? rest : [emptyStep()] }
    })
    setFocusId('dodaj-korak')
  }

  function moveStep(index: number, direction: -1 | 1) {
    setDraft((d) => {
      const steps = [...d.steps]
      const target = index + direction
      if (target < 0 || target >= steps.length) return d
      ;[steps[index], steps[target]] = [steps[target], steps[index]]
      return { ...d, steps }
    })
    // Fokus ostane na istem gumbu premaknjenega koraka.
    const key = draft.steps[index].key
    setFocusId(`korak-${key}-${direction === -1 ? 'gor' : 'dol'}`)
  }

  async function acceptFile(file: File | undefined) {
    setPhotoError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoError('Izbrana datoteka ni slika. Izberi fotografijo v obliki JPG, PNG ali WebP.')
      return
    }
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setPhotoError(`Fotografija je prevelika (${(file.size / 1024 / 1024).toFixed(1).replace('.', ',')} MB). Največja dovoljena velikost je ${MAX_UPLOAD_MB} MB.`)
      return
    }
    setProcessingPhoto(true)
    try {
      const blob = await prepareImage(file)
      setPhoto({ blob, url: URL.createObjectURL(blob), name: file.name })
    } catch {
      setPhotoError('Fotografije ni bilo mogoče prebrati. Poskusi z drugo sliko.')
    } finally {
      setProcessingPhoto(false)
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    acceptFile(e.target.files?.[0])
    e.target.value = ''
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragOver(false)
    acceptFile(e.dataTransfer.files?.[0])
  }

  function resetForm() {
    if (!window.confirm('Počistim celoten obrazec? Vneseni podatki bodo izgubljeni.')) return
    setDraft(emptyDraft())
    setPhoto(null)
    setPhotoError('')
    setAttempted(false)
    setShowRestored(false)
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // ni pomembno
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setAttempted(true)
    const found = validate(draft)
    if (found.length) {
      // Povzetek napak dobi fokus, da ga bralnik zaslona takoj prebere.
      setTimeout(() => summaryRef.current?.focus(), 0)
      return
    }
    setSubmitting(true)
    try {
      const slug = await createRecipe({
        title: draft.title.trim(),
        description: draft.description.trim(),
        categoryId: Number(draft.categoryId),
        prepMinutes: parseNumber(draft.prepMinutes),
        difficulty: draft.difficulty as Difficulty,
        servings: parseNumber(draft.servings),
        ingredients: draft.ingredients
          .filter((i) => i.name.trim())
          .map((i) => ({ name: i.name.trim(), amount: i.amount.trim() ? parseNumber(i.amount) : null, unit: i.unit.trim() })),
        steps: draft.steps.map((s) => s.text.trim()).filter(Boolean),
        image: photo?.blob ?? null,
      })
      try {
        localStorage.removeItem(DRAFT_KEY)
      } catch {
        // ni pomembno
      }
      toast(`Recept »${draft.title.trim()}« je objavljen.`)
      navigate(`/recepti/${slug}`)
    } catch (err) {
      toast(err instanceof Error && err.message.startsWith('Fotografije') ? err.message : 'Recepta ni bilo mogoče objaviti. Poskusi znova.', {
        tone: 'error',
      })
      setSubmitting(false)
    }
  }

  const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(' ') || undefined
  const fieldProps = (id: string, hintId?: string) => ({
    id,
    'aria-invalid': Boolean(errorFor(id)) || undefined,
    'aria-describedby': describedBy(hintId, errorFor(id) && `${id}-napaka`),
  })
  const ErrorText = ({ id }: { id: string }) =>
    errorFor(id) ? (
      <p id={`${id}-napaka`} className="field-error">
        {errorFor(id)}
      </p>
    ) : null

  return (
    <div className="container add-recipe">
      <header className="page-head">
        <h1>Dodaj recept</h1>
        <p>
          Deli svoj recept z drugimi. Polja, označena z <span aria-hidden="true">*</span>
          <span className="visually-hidden">zvezdico</span>, so obvezna. Osnutek se sproti shranjuje v tem brskalniku.
        </p>
      </header>

      {showRestored && (
        <div className="notice draft-notice" role="status">
          <p>Obnovili smo osnutek, ki si ga začel prejšnjič.</p>
          <button type="button" className="link-button" onClick={resetForm}>
            Začni znova
          </button>
        </div>
      )}

      {errors.length > 0 && (
        <div className="error-summary" ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="napake-naslov">
          <h2 id="napake-naslov">
            Recepta še ni mogoče objaviti – {errors.length === 1 ? 'popravi 1 napako' : `popravi napake (${errors.length})`}:
          </h2>
          <ul>
            {errors.map((e) => (
              <li key={e.id + e.message}>
                <a
                  href={`#${e.id}`}
                  onClick={(ev) => {
                    ev.preventDefault()
                    document.getElementById(e.id)?.focus()
                  }}
                >
                  {e.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form className="recipe-form" onSubmit={onSubmit} noValidate>
        {/* 1. Osnovni podatki */}
        <fieldset className="form-section">
          <legend>
            <span className="section-no">01</span>Osnovni podatki
          </legend>

          <div className="field">
            <label htmlFor="naslov">
              Naslov recepta <span aria-hidden="true">*</span>
            </label>
            <input
              {...fieldProps('naslov', 'naslov-namig')}
              value={draft.title}
              onChange={(e) => set('title', e.target.value)}
              required
              maxLength={140}
              autoComplete="off"
            />
            <p id="naslov-namig" className="field-hint">
              Npr. »Babičina jabolčna pita«.
            </p>
            <ErrorText id="naslov" />
          </div>

          <div className="field">
            <label htmlFor="opis">
              Kratek opis <span className="optional">(neobvezno)</span>
            </label>
            <textarea
              {...fieldProps('opis', 'opis-stevec')}
              rows={3}
              value={draft.description}
              onChange={(e) => set('description', e.target.value)}
            />
            <p id="opis-stevec" className={`field-hint ${draft.description.length > DESCRIPTION_MAX ? 'over' : ''}`}>
              {draft.description.length} / {DESCRIPTION_MAX} znakov
            </p>
            <ErrorText id="opis" />
          </div>

          <div className="field-grid">
            <div className="field">
              <label htmlFor="kategorija">
                Kategorija <span aria-hidden="true">*</span>
              </label>
              <select
                {...fieldProps('kategorija')}
                value={draft.categoryId}
                onChange={(e) => set('categoryId', e.target.value)}
                required
              >
                <option value="">Izberi …</option>
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ErrorText id="kategorija" />
            </div>

            <div className="field">
              <label htmlFor="cas">
                Čas priprave (minute) <span aria-hidden="true">*</span>
              </label>
              <input
                {...fieldProps('cas')}
                inputMode="numeric"
                value={draft.prepMinutes}
                onChange={(e) => set('prepMinutes', e.target.value)}
                required
                placeholder="npr. 45"
              />
              <ErrorText id="cas" />
            </div>

            <div className="field">
              <label htmlFor="porcije">
                Število porcij <span aria-hidden="true">*</span>
              </label>
              <input
                {...fieldProps('porcije')}
                inputMode="numeric"
                value={draft.servings}
                onChange={(e) => set('servings', e.target.value)}
                required
              />
              <ErrorText id="porcije" />
            </div>
          </div>

          <fieldset
            className="radio-group"
            aria-invalid={Boolean(errorFor('zahtevnost-lahka')) || undefined}
            aria-describedby={errorFor('zahtevnost-lahka') ? 'zahtevnost-lahka-napaka' : undefined}
          >
            <legend>
              Zahtevnost <span aria-hidden="true">*</span>
            </legend>
            <div className="radio-row">
              {DIFFICULTIES.map((d) => (
                <label key={d} className="radio-pill">
                  <input
                    type="radio"
                    id={`zahtevnost-${d}`}
                    name="zahtevnost"
                    value={d}
                    checked={draft.difficulty === d}
                    onChange={() => set('difficulty', d)}
                  />
                  <span>{difficultyLabel[d]}</span>
                </label>
              ))}
            </div>
            <ErrorText id="zahtevnost-lahka" />
          </fieldset>
        </fieldset>

        {/* 2. Fotografija */}
        <fieldset className="form-section">
          <legend>
            <span className="section-no">02</span>Fotografija <span className="optional">(neobvezno)</span>
          </legend>

          {photo ? (
            <div className="photo-preview">
              <img src={photo.url} alt="Predogled izbrane fotografije" />
              <div>
                <p className="photo-name">{photo.name}</p>
                <p className="field-hint">
                  Obrezana na razmerje 4 : 3 in pomanjšana ({Math.round(photo.blob.size / 1024)} KB).
                </p>
                <div className="photo-actions">
                  <label htmlFor="fotografija" className="btn btn-ghost">
                    Zamenjaj fotografijo
                  </label>
                  <button type="button" className="link-button danger" onClick={() => setPhoto(null)}>
                    Odstrani
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="fotografija"
              className={`dropzone ${dragOver ? 'is-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <span className="dropzone-title">{processingPhoto ? 'Pripravljam fotografijo …' : 'Izberi fotografijo'}</span>
              <span className="dropzone-hint">
                ali jo povleci sem · JPG, PNG ali WebP, največ {MAX_UPLOAD_MB} MB
              </span>
            </label>
          )}
          <input
            id="fotografija"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="visually-hidden file-input"
            onChange={onFileChange}
            aria-describedby={photoError ? 'fotografija-napaka' : undefined}
          />
          {photoError && (
            <p id="fotografija-napaka" className="field-error" role="alert">
              {photoError}
            </p>
          )}
        </fieldset>

        {/* 3. Sestavine */}
        <fieldset className="form-section">
          <legend>
            <span className="section-no">03</span>Sestavine <span aria-hidden="true">*</span>
          </legend>
          <p className="field-hint">
            Količina in enota sta neobvezni (npr. »sol« brez količine pomeni »po okusu«). Prazne vrstice se ne shranijo.
          </p>

          <ol className="dynamic-list ingredients-form">
            {draft.ingredients.map((row, i) => (
              <li key={row.key} className="ingredient-row">
                <div className="field field-amount">
                  <label htmlFor={`sestavina-${row.key}-kolicina`}>
                    Količina<span className="visually-hidden"> za sestavino {i + 1}</span>
                  </label>
                  <input
                    {...fieldProps(`sestavina-${row.key}-kolicina`)}
                    inputMode="decimal"
                    value={row.amount}
                    onChange={(e) => updateIngredient(row.key, 'amount', e.target.value)}
                    placeholder={i === 0 ? '200' : undefined}
                  />
                </div>
                <div className="field field-unit">
                  <label htmlFor={`sestavina-${row.key}-enota`}>
                    Enota<span className="visually-hidden"> za sestavino {i + 1}</span>
                  </label>
                  <input
                    id={`sestavina-${row.key}-enota`}
                    list="enote-recept"
                    value={row.unit}
                    onChange={(e) => updateIngredient(row.key, 'unit', e.target.value)}
                    placeholder={i === 0 ? 'g' : undefined}
                  />
                </div>
                <div className="field field-name">
                  <label htmlFor={`sestavina-${row.key}-ime`}>
                    Sestavina {i + 1}
                  </label>
                  <input
                    {...fieldProps(`sestavina-${row.key}-ime`)}
                    value={row.name}
                    onChange={(e) => updateIngredient(row.key, 'name', e.target.value)}
                    placeholder={i === 0 ? 'moka' : undefined}
                  />
                </div>
                <button
                  type="button"
                  className="icon-button row-remove"
                  onClick={() => removeIngredient(row.key)}
                  aria-label={`Odstrani sestavino ${i + 1}${row.name ? ` (${row.name})` : ''}`}
                >
                  ×
                </button>
                <div className="row-errors">
                  <ErrorText id={`sestavina-${row.key}-kolicina`} />
                  <ErrorText id={`sestavina-${row.key}-ime`} />
                </div>
              </li>
            ))}
          </ol>
          <datalist id="enote-recept">
            {UNIT_SUGGESTIONS.map((u) => (
              <option key={u} value={u} />
            ))}
          </datalist>
          <button type="button" id="dodaj-sestavino" className="btn btn-ghost" onClick={addIngredient}>
            + Dodaj sestavino
          </button>
        </fieldset>

        {/* 4. Postopek */}
        <fieldset className="form-section">
          <legend>
            <span className="section-no">04</span>Postopek <span aria-hidden="true">*</span>
          </legend>

          <ol className="dynamic-list steps-form">
            {draft.steps.map((row, i) => (
              <li key={row.key} className="step-row">
                <span className="step-no" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="field">
                  <label htmlFor={`korak-${row.key}`}>Korak {i + 1}</label>
                  <textarea
                    {...fieldProps(`korak-${row.key}`)}
                    rows={2}
                    value={row.text}
                    onChange={(e) => updateStep(row.key, e.target.value)}
                    placeholder={i === 0 ? 'npr. Pečico segrej na 180 °C.' : undefined}
                  />
                  <ErrorText id={`korak-${row.key}`} />
                </div>
                <div className="step-tools">
                  <button
                    type="button"
                    id={`korak-${row.key}-gor`}
                    className="icon-button"
                    onClick={() => moveStep(i, -1)}
                    disabled={i === 0}
                    aria-label={`Premakni korak ${i + 1} navzgor`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    id={`korak-${row.key}-dol`}
                    className="icon-button"
                    onClick={() => moveStep(i, 1)}
                    disabled={i === draft.steps.length - 1}
                    aria-label={`Premakni korak ${i + 1} navzdol`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => removeStep(row.key)}
                    aria-label={`Odstrani korak ${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <button type="button" id="dodaj-korak" className="btn btn-ghost" onClick={addStep}>
            + Dodaj korak
          </button>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn btn-large" disabled={submitting || processingPhoto}>
            {submitting ? 'Objavljam …' : 'Objavi recept'}
          </button>
          <button type="button" className="link-button" onClick={resetForm}>
            Počisti obrazec
          </button>
          <span className="draft-status" aria-live="polite">
            {savedAt && !isDraftEmpty(draft)
              ? `Osnutek shranjen ob ${savedAt.toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' })}`
              : ''}
          </span>
        </div>
        <p className="field-hint">
          Z objavo bo recept viden vsem obiskovalcem. Izbrišeš ga lahko kadarkoli na strani recepta.{' '}
          <Link to="/recepti">Prekliči in se vrni na recepte</Link>
        </p>
      </form>
    </div>
  )
}

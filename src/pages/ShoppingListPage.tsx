import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ErrorNotice } from '../components/States'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  addManualShoppingItem,
  deleteShoppingItems,
  getShoppingList,
  restoreShoppingItems,
  updateShoppingItem,
  type ShoppingItem,
  type ShoppingList,
} from '../lib/api'
import { plural } from '../lib/format'
import { formatQuantity } from '../lib/units'
import { useToast } from '../state/Toast'
import { useUserData } from '../state/UserData'

const MANUAL = 'rocno'
const UNIT_SUGGESTIONS = ['g', 'kg', 'ml', 'l', 'kos', 'žlica', 'žlička', 'strok', 'šopek', 'zavitek', 'vrečka']

type Group = { key: string; title: string; slug?: string; items: ShoppingItem[] }

/** Postavke, združene po receptu (v vrstnem redu dodajanja); ročno dodane so na koncu. */
function groupItems(list: ShoppingList): Group[] {
  const groups = new Map<string, Group>()
  for (const item of list.items) {
    const key = item.recipe_id == null ? MANUAL : String(item.recipe_id)
    if (!groups.has(key)) {
      const recipe = item.recipe_id == null ? undefined : list.recipes[item.recipe_id]
      groups.set(key, {
        key,
        title: item.recipe_id == null ? 'Dodano ročno' : (recipe?.title ?? 'Odstranjen recept'),
        slug: recipe?.slug,
        items: [],
      })
    }
    groups.get(key)!.items.push(item)
  }
  const result = [...groups.values()].sort((a, b) => Number(a.key === MANUAL) - Number(b.key === MANUAL))
  // Kupljene postavke potonejo na dno skupine.
  for (const g of result) g.items.sort((a, b) => Number(a.checked) - Number(b.checked))
  return result
}

export default function ShoppingListPage() {
  usePageTitle('Nakupovalni seznam')
  const toast = useToast()
  const { refreshShoppingCount } = useUserData()
  const [list, setList] = useState<ShoppingList | null>(null)
  const [error, setError] = useState(false)
  const confirmRef = useRef<HTMLDialogElement>(null)

  async function load() {
    setError(false)
    try {
      setList(await getShoppingList())
    } catch {
      setError(true)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Lokalno posodobi seznam in število v glavi; ob napaki ponovno naloži s strežnika.
  async function mutate(
    local: (items: ShoppingItem[]) => ShoppingItem[],
    remote: () => Promise<void>,
    failMsg: string,
  ): Promise<boolean> {
    setList((l) => (l ? { ...l, items: local(l.items) } : l))
    try {
      await remote()
      return true
    } catch {
      toast(failMsg, { tone: 'error' })
      await load()
      return false
    } finally {
      refreshShoppingCount().catch(() => {})
    }
  }

  function toggle(item: ShoppingItem) {
    mutate(
      (items) => items.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)),
      () => updateShoppingItem(item.id, { checked: !item.checked }),
      'Spremembe ni bilo mogoče shraniti.',
    )
  }

  function changeAmount(item: ShoppingItem, amount: number) {
    mutate(
      (items) => items.map((i) => (i.id === item.id ? { ...i, amount } : i)),
      () => updateShoppingItem(item.id, { amount }),
      'Količine ni bilo mogoče shraniti.',
    )
  }

  function remove(items: ShoppingItem[], message: string) {
    const ids = new Set(items.map((i) => i.id))
    mutate(
      (all) => all.filter((i) => !ids.has(i.id)),
      () => deleteShoppingItems([...ids]),
      'Brisanje ni uspelo.',
    ).then((ok) =>
      ok &&
      toast(message, {
        action: {
          label: 'Razveljavi',
          onClick: async () => {
            try {
              await restoreShoppingItems(items)
              await load()
              await refreshShoppingCount()
            } catch {
              toast('Postavk ni bilo mogoče vrniti.', { tone: 'error' })
            }
          },
        },
      }),
    )
  }

  async function addManual(item: { name: string; amount: number | null; unit: string }) {
    try {
      const created = await addManualShoppingItem(item)
      setList((l) => (l ? { ...l, items: [...l.items, created] } : l))
      refreshShoppingCount().catch(() => {})
      return true
    } catch {
      toast('Postavke ni bilo mogoče dodati.', { tone: 'error' })
      return false
    }
  }

  async function copyList() {
    if (!list) return
    const lines = ['Nakupovalni seznam (RecipeHub)']
    for (const g of groupItems(list)) {
      const open = g.items.filter((i) => !i.checked)
      if (!open.length) continue
      lines.push('', g.title)
      for (const i of open)
        lines.push(`- ${i.amount == null ? `${i.name}${i.unit ? ` (${i.unit})` : ''}` : `${formatQuantity(i.amount, i.unit)} ${i.name}`}`)
    }
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      toast('Seznam je kopiran v odložišče. Prilepiš ga lahko v sporočilo ali beležko.')
    } catch {
      toast('Kopiranje ni uspelo. Seznam lahko natisneš.', { tone: 'error' })
    }
  }

  function clearAll() {
    if (!list) return
    const all = list.items
    mutate(() => [], () => deleteShoppingItems(all.map((i) => i.id)), 'Seznama ni bilo mogoče izprazniti.').then(
      (ok) => ok && toast('Nakupovalni seznam je prazen.'),
    )
  }

  const groups = list ? groupItems(list) : []
  const total = list?.items.length ?? 0
  const checked = list?.items.filter((i) => i.checked) ?? []
  const open = total - checked.length

  return (
    <div className="container shopping">
      <header className="page-head shopping-head">
        <div>
          <h1>Nakupovalni seznam</h1>
          <p>
            Sestavine iz receptov, ki si jih dodal, združene po receptih. Kupljeno odkljukaj, da potone na dno.
          </p>
        </div>
        {total > 0 && (
          <p className="shopping-progress" aria-live="polite">
            <strong>{open}</strong> {plural(open, ['postavka', 'postavki', 'postavke', 'postavk'])} za nakup
            {checked.length > 0 && <span> · {checked.length} kupljeno</span>}
          </p>
        )}
      </header>

      {error && <ErrorNotice onRetry={load} />}
      {!list && !error && <div className="skeleton" style={{ height: 320 }} aria-busy="true" aria-label="Nalaganje seznama" />}

      {list && (
        <div className="shopping-layout">
          <div className="shopping-main">
            {total > 0 && (
              <div className="shopping-toolbar no-print">
                <button type="button" className="btn btn-ghost" onClick={copyList}>
                  Kopiraj seznam
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
                  Natisni
                </button>
                <span className="toolbar-spacer" />
                {checked.length > 0 && (
                  <button
                    type="button"
                    className="link-button"
                    onClick={() =>
                      remove(
                        checked,
                        `${plural(checked.length, ['Odstranjena je', 'Odstranjeni sta', 'Odstranjene so', 'Odstranjenih je'])} ${checked.length} ${plural(checked.length, ['kupljena postavka', 'kupljeni postavki', 'kupljene postavke', 'kupljenih postavk'])}.`,
                      )
                    }
                  >
                    Počisti kupljeno ({checked.length})
                  </button>
                )}
                <button type="button" className="link-button danger" onClick={() => confirmRef.current?.showModal()}>
                  Izprazni seznam
                </button>
              </div>
            )}

            {total === 0 && (
              <div className="empty-state">
                <span className="empty-mark" aria-hidden="true">
                  ✓
                </span>
                <h2>Seznam je prazen</h2>
                <p>
                  Odpri recept in klikni »Dodaj sestavine na nakupovalni seznam«, ali pa postavko dodaj ročno z obrazcem.
                </p>
                <div className="empty-actions">
                  <Link to="/recepti" className="btn">
                    Poišči recept
                  </Link>
                  <Link to="/priljubljeni" className="btn btn-ghost">
                    Moji priljubljeni
                  </Link>
                </div>
              </div>
            )}

            {groups.map((g) => {
              const done = g.items.filter((i) => i.checked).length
              const headingId = `skupina-${g.key}`
              return (
                <section key={g.key} className="shopping-group" aria-labelledby={headingId}>
                  <div className="group-head">
                    <h2 id={headingId}>{g.slug ? <Link to={`/recepti/${g.slug}`}>{g.title}</Link> : g.title}</h2>
                    <span className="group-progress">
                      {done} od {g.items.length} kupljeno
                    </span>
                    <button
                      type="button"
                      className="link-button no-print"
                      onClick={() => remove(g.items, `»${g.title}« je odstranjen s seznama.`)}
                    >
                      Odstrani <span className="visually-hidden">skupino »{g.title}«</span>
                    </button>
                  </div>
                  <ul className="shopping-items">
                    {g.items.map((item) => (
                      <ShoppingRow
                        key={item.id}
                        item={item}
                        onToggle={() => toggle(item)}
                        onAmount={(a) => changeAmount(item, a)}
                        onDelete={() => remove([item], `»${item.name}« je odstranjen s seznama.`)}
                      />
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>

          <aside className="shopping-side no-print">
            <ManualAddForm onAdd={addManual} />
          </aside>
        </div>
      )}

      <dialog ref={confirmRef} className="confirm-dialog" aria-labelledby="potrdi-naslov">
        <form method="dialog">
          <h2 id="potrdi-naslov">Izpraznim celoten seznam?</h2>
          <p>S seznama bodo odstranjene vse postavke ({total}), tudi že kupljene. Tega ni mogoče razveljaviti.</p>
          <div className="dialog-actions">
            <button value="cancel" className="btn btn-ghost" autoFocus>
              Prekliči
            </button>
            <button value="confirm" className="btn btn-danger" onClick={clearAll}>
              Izprazni seznam
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

function ShoppingRow({
  item,
  onToggle,
  onAmount,
  onDelete,
}: {
  item: ShoppingItem
  onToggle: () => void
  onAmount: (amount: number) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const inputId = `kolicina-${item.id}`

  function startEdit() {
    setValue(String(item.amount ?? '').replace('.', ','))
    setEditing(true)
  }

  function save(e: FormEvent) {
    e.preventDefault()
    const n = Number(value.replace(',', '.'))
    if (n > 0) onAmount(Math.round(n * 100) / 100)
    setEditing(false)
  }

  return (
    <li className={item.checked ? 'is-checked' : ''}>
      <label className="check shopping-check">
        <input type="checkbox" checked={item.checked} onChange={onToggle} />
        {item.amount != null ? (
          <span>
            <strong>{formatQuantity(item.amount, item.unit)}</strong> {item.name}
          </span>
        ) : (
          <span>
            {item.name} {item.unit && <span className="qty-note">({item.unit})</span>}
          </span>
        )}
      </label>
      {editing ? (
        <form className="amount-edit" onSubmit={save}>
          <label htmlFor={inputId} className="visually-hidden">
            Nova količina za {item.name}
          </label>
          <input
            id={inputId}
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
          />
          <span className="amount-unit">{item.unit}</span>
          <button type="submit" className="link-button">
            Shrani
          </button>
          <button type="button" className="link-button" onClick={() => setEditing(false)}>
            Prekliči
          </button>
        </form>
      ) : (
        <div className="row-actions no-print">
          {item.amount != null && (
            <button type="button" className="link-button" onClick={startEdit}>
              Uredi <span className="visually-hidden">količino za {item.name}</span>
            </button>
          )}
          <button type="button" className="icon-button" onClick={onDelete} aria-label={`Odstrani »${item.name}«`}>
            ×
          </button>
        </div>
      )}
    </li>
  )
}

function ManualAddForm({ onAdd }: { onAdd: (item: { name: string; amount: number | null; unit: string }) => Promise<boolean> }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    const n = amount.trim() ? Number(amount.replace(',', '.')) : null
    if (!trimmed) {
      setError('Vpiši, kaj potrebuješ (npr. kruh).')
      nameRef.current?.focus()
      return
    }
    if (n != null && !(n > 0)) {
      setError('Količina mora biti pozitivno število (npr. 1 ali 0,5).')
      return
    }
    setError('')
    setBusy(true)
    const ok = await onAdd({ name: trimmed, amount: n, unit: unit.trim() })
    setBusy(false)
    if (ok) {
      setName('')
      setAmount('')
      setUnit('')
      nameRef.current?.focus()
    }
  }

  return (
    <form className="manual-add" onSubmit={submit} noValidate>
      <h2>Dodaj ročno</h2>
      <p className="manual-hint">Za stvari, ki niso iz recepta – npr. kruh ali mleko.</p>
      <div className="field">
        <label htmlFor="rocno-ime">Kaj potrebuješ?</label>
        <input
          id="rocno-ime"
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(error) && !name.trim()}
          aria-describedby={error ? 'rocno-napaka' : undefined}
          placeholder="npr. kruh"
          autoComplete="off"
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="rocno-kolicina">
            Količina <span className="optional">(neobvezno)</span>
          </label>
          <input id="rocno-kolicina" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="rocno-enota">
            Enota <span className="optional">(neobvezno)</span>
          </label>
          <input id="rocno-enota" list="enote" value={unit} onChange={(e) => setUnit(e.target.value)} />
          <datalist id="enote">
            {UNIT_SUGGESTIONS.map((u) => (
              <option key={u} value={u} />
            ))}
          </datalist>
        </div>
      </div>
      {error && (
        <p id="rocno-napaka" className="field-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn" disabled={busy}>
        {busy ? 'Dodajam …' : 'Dodaj na seznam'}
      </button>
    </form>
  )
}

import { useState } from 'react'
import { useToast } from '../state/Toast'
import { useUserData } from '../state/UserData'

type Props = { recipeId: number; recipeTitle: string; variant?: 'full' | 'icon' }

export default function FavoriteButton({ recipeId, recipeTitle, variant = 'full' }: Props) {
  const { isFavorite, toggleFavorite, setFavoriteTo } = useUserData()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const active = isFavorite(recipeId)

  async function onClick() {
    setBusy(true)
    try {
      const added = await toggleFavorite(recipeId)
      if (added) {
        toast(`»${recipeTitle}« je med priljubljenimi.`, { link: { to: '/priljubljeni', label: 'Odpri priljubljene' } })
      } else {
        toast(`»${recipeTitle}« ni več med priljubljenimi.`, {
          action: { label: 'Razveljavi', onClick: () => void setFavoriteTo(recipeId, true) },
        })
      }
    } catch {
      toast('Spremembe ni bilo mogoče shraniti. Poskusi znova.', { tone: 'error' })
    } finally {
      setBusy(false)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        className="fav-icon"
        aria-pressed={active}
        aria-label={active ? `Odstrani »${recipeTitle}« iz priljubljenih` : `Shrani »${recipeTitle}« med priljubljene`}
        onClick={onClick}
        disabled={busy}
      >
        <span aria-hidden="true">{active ? '♥' : '♡'}</span>
      </button>
    )
  }

  return (
    <button type="button" className="btn btn-ghost fav-full" aria-pressed={active} onClick={onClick} disabled={busy}>
      <span aria-hidden="true" className="fav-heart">
        {active ? '♥' : '♡'}
      </span>
      {active ? 'Shranjeno med priljubljenimi' : 'Shrani med priljubljene'}
    </button>
  )
}

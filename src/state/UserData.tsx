import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { countOpenShoppingItems, getFavoriteIds, setFavorite } from '../lib/api'

// Podatki trenutnega (anonimnega) obiskovalca, ki jih potrebuje več strani hkrati:
// priljubljeni recepti in število odprtih postavk na nakupovalnem seznamu (značka v glavi).

type UserData = {
  favoriteIds: Set<number>
  isFavorite: (recipeId: number) => boolean
  toggleFavorite: (recipeId: number) => Promise<boolean>
  setFavoriteTo: (recipeId: number, favorite: boolean) => Promise<void>
  shoppingCount: number
  refreshShoppingCount: () => Promise<void>
}

const UserDataContext = createContext<UserData | null>(null)

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())
  const [shoppingCount, setShoppingCount] = useState(0)

  useEffect(() => {
    getFavoriteIds()
      .then((ids) => setFavoriteIds(new Set(ids)))
      .catch((e) => console.warn('Priljubljenih ni bilo mogoče naložiti', e))
    countOpenShoppingItems()
      .then(setShoppingCount)
      .catch((e) => console.warn('Nakupovalnega seznama ni bilo mogoče naložiti', e))
  }, [])

  // Ref z zadnjim stanjem, da npr. »Razveljavi« iz starega obvestila ne bere zastarelih podatkov.
  const latest = useRef(favoriteIds)
  latest.current = favoriteIds

  const isFavorite = useCallback((id: number) => favoriteIds.has(id), [favoriteIds])

  const setFavoriteTo = useCallback(async (recipeId: number, favorite: boolean) => {
    const apply = (on: boolean) =>
      setFavoriteIds((prev) => {
        const s = new Set(prev)
        if (on) s.add(recipeId)
        else s.delete(recipeId)
        return s
      })
    // Optimistično posodobimo vmesnik; ob napaki stanje vrnemo.
    apply(favorite)
    try {
      await setFavorite(recipeId, favorite)
    } catch (e) {
      apply(!favorite)
      throw e
    }
  }, [])

  const toggleFavorite = useCallback(
    async (recipeId: number) => {
      const next = !latest.current.has(recipeId)
      await setFavoriteTo(recipeId, next)
      return next
    },
    [setFavoriteTo],
  )

  const refreshShoppingCount = useCallback(async () => {
    setShoppingCount(await countOpenShoppingItems())
  }, [])

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite, setFavoriteTo, shoppingCount, refreshShoppingCount }),
    [favoriteIds, isFavorite, toggleFavorite, setFavoriteTo, shoppingCount, refreshShoppingCount],
  )
  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
}

export function useUserData(): UserData {
  const ctx = useContext(UserDataContext)
  if (!ctx) throw new Error('useUserData mora biti znotraj UserDataProvider')
  return ctx
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { countOpenShoppingItems, getFavoriteIds, setFavorite } from '../lib/api'

// Podatki trenutnega (anonimnega) obiskovalca, ki jih potrebuje več strani hkrati:
// priljubljeni recepti in število odprtih postavk na nakupovalnem seznamu (značka v glavi).

type UserData = {
  favoriteIds: Set<number>
  isFavorite: (recipeId: number) => boolean
  toggleFavorite: (recipeId: number) => Promise<boolean>
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

  const isFavorite = useCallback((id: number) => favoriteIds.has(id), [favoriteIds])

  const toggleFavorite = useCallback(
    async (recipeId: number) => {
      const next = !favoriteIds.has(recipeId)
      // Optimistično posodobimo vmesnik; ob napaki stanje vrnemo.
      setFavoriteIds((prev) => {
        const s = new Set(prev)
        if (next) s.add(recipeId)
        else s.delete(recipeId)
        return s
      })
      try {
        await setFavorite(recipeId, next)
      } catch (e) {
        setFavoriteIds((prev) => {
          const s = new Set(prev)
          if (next) s.delete(recipeId)
          else s.add(recipeId)
          return s
        })
        throw e
      }
      return next
    },
    [favoriteIds],
  )

  const refreshShoppingCount = useCallback(async () => {
    setShoppingCount(await countOpenShoppingItems())
  }, [])

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite, shoppingCount, refreshShoppingCount }),
    [favoriteIds, isFavorite, toggleFavorite, shoppingCount, refreshShoppingCount],
  )
  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
}

export function useUserData(): UserData {
  const ctx = useContext(UserDataContext)
  if (!ctx) throw new Error('useUserData mora biti znotraj UserDataProvider')
  return ctx
}

import { useCallback, useEffect, useState } from 'react'

type AsyncState<T> =
  | { status: 'loading'; data?: T; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'error'; data?: undefined; error: Error }

/**
 * Naloži podatke ob prvem izrisu in ob spremembi `deps`; `reload` ponovi klic.
 * Med ponovnim nalaganjem ostanejo prejšnji podatki v `data` (stran ne »utripne«).
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setState((prev) => ({ status: 'loading', data: prev.data }))
    fn()
      .then((data) => active && setState({ status: 'success', data }))
      .catch((error: Error) => active && setState({ status: 'error', error }))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const reload = useCallback(() => setAttempt((a) => a + 1), [])
  return { ...state, reload }
}

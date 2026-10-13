import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

// Kratko obvestilo na dnu zaslona (npr. »Dodano na nakupovalni seznam«) z opcijsko povezavo.

type Toast = { id: number; message: string; tone: 'success' | 'error'; link?: { to: string; label: string } }
type ShowToast = (message: string, options?: { tone?: Toast['tone']; link?: Toast['link'] }) => void

const ToastContext = createContext<ShowToast | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const show = useCallback<ShowToast>((message, options = {}) => {
    clearTimeout(timer.current)
    setToast({ id: Date.now(), message, tone: options.tone ?? 'success', link: options.link })
    timer.current = setTimeout(() => setToast(null), 6000)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div key={toast.id} className={`toast toast-${toast.tone}`}>
            <span>{toast.message}</span>
            {toast.link && (
              <Link to={toast.link.to} onClick={() => setToast(null)}>
                {toast.link.label}
              </Link>
            )}
            <button type="button" className="toast-close" onClick={() => setToast(null)} aria-label="Zapri obvestilo">
              ×
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ShowToast {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast mora biti znotraj ToastProvider')
  return ctx
}

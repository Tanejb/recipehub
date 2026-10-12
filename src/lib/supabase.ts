import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

if (!url || !key) {
  throw new Error('Manjkata VITE_SUPABASE_URL in/ali VITE_SUPABASE_PUBLISHABLE_KEY (.env ali Vercel → Environment Variables).')
}

export const supabase = createClient(url, key)

// Vsak obiskovalec je anonimen Supabase uporabnik – brez registracije, a z lastnimi
// priljubljenimi in nakupovalnim seznamom. Seja se hrani v brskalniku.
let sessionPromise: Promise<string> | null = null

export function ensureVisitor(): Promise<string> {
  sessionPromise ??= (async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) return data.session.user.id
    const { data: signIn, error } = await supabase.auth.signInAnonymously()
    if (error || !signIn.user) {
      sessionPromise = null
      throw error ?? new Error('Anonimna prijava ni uspela.')
    }
    return signIn.user.id
  })()
  return sessionPromise
}

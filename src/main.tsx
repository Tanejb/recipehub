import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/inter'
import './styles/global.css'
import App from './App'
import { ensureVisitor } from './lib/supabase'
import { ToastProvider } from './state/Toast'
import { UserDataProvider } from './state/UserData'

// Anonimnega obiskovalca ustvarimo takoj v ozadju, da so priljubljeni in seznam takoj na voljo.
ensureVisitor().catch((e) => console.warn('Anonimna seja ni uspela:', e))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserDataProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </UserDataProvider>
    </BrowserRouter>
  </StrictMode>,
)

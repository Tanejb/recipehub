import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="recepti"
          element={<PlaceholderPage title="Recepti" intro="Iskanje in filtriranje vseh receptov." />}
        />
        <Route
          path="recepti/:slug"
          element={<PlaceholderPage title="Recept" intro="Podrobnosti recepta, ocenjevanje in priljubljeni." />}
        />
        <Route
          path="kategorije"
          element={<PlaceholderPage title="Kategorije" intro="Pregled receptov po kategorijah." />}
        />
        <Route
          path="kategorije/:slug"
          element={<PlaceholderPage title="Kategorija" intro="Recepti izbrane kategorije." />}
        />
        <Route
          path="priljubljeni"
          element={<PlaceholderPage title="Priljubljeni" intro="Recepti, ki si jih shranil." />}
        />
        <Route
          path="nakupovalni-seznam"
          element={<PlaceholderPage title="Nakupovalni seznam" intro="Sestavine, ki jih moraš kupiti." />}
        />
        <Route
          path="dodaj-recept"
          element={<PlaceholderPage title="Dodaj recept" intro="Deli svoj recept z drugimi." />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

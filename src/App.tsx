import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PhotoCreditsPage from './pages/PhotoCreditsPage'
import PlaceholderPage from './pages/PlaceholderPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import RecipesPage from './pages/RecipesPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="recepti" element={<RecipesPage />} />
        <Route path="recepti/:slug" element={<RecipeDetailPage />} />
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
        <Route path="viri-fotografij" element={<PhotoCreditsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

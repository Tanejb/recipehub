import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AddRecipePage from './pages/AddRecipePage'
import CategoriesPage from './pages/CategoriesPage'
import CategoryPage from './pages/CategoryPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PhotoCreditsPage from './pages/PhotoCreditsPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import RecipesPage from './pages/RecipesPage'
import ShoppingListPage from './pages/ShoppingListPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="recepti" element={<RecipesPage />} />
        <Route path="recepti/:slug" element={<RecipeDetailPage />} />
        <Route path="kategorije" element={<CategoriesPage />} />
        <Route path="kategorije/:slug" element={<CategoryPage />} />
        <Route path="priljubljeni" element={<FavoritesPage />} />
        <Route path="nakupovalni-seznam" element={<ShoppingListPage />} />
        <Route path="dodaj-recept" element={<AddRecipePage />} />
        <Route path="viri-fotografij" element={<PhotoCreditsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

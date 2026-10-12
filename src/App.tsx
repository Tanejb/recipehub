import { Link, Route, Routes } from 'react-router-dom'

// Začasna stran za 1. korak: preverimo build, objavo in delovanje neposrednih URL-jev.
export default function App() {
  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: 640, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>RecipeHub</h1>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">Domov</Link>
        <Link to="/recepti">Recepti</Link>
      </nav>
      <Routes>
        <Route path="/" element={<p>Postavitev deluje. ✔</p>} />
        <Route path="/recepti" element={<p>Podstran /recepti deluje tudi ob osvežitvi strani. ✔</p>} />
        <Route path="*" element={<p>Stran ne obstaja (404).</p>} />
      </Routes>
    </main>
  )
}

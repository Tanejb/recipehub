import { Link } from 'react-router-dom'
import credits from '../data/image-credits.json'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAsync } from '../hooks/useAsync'
import { supabase } from '../lib/supabase'

type Credit = {
  title: string | null
  creator: string | null
  creator_url: string | null
  license: string
  license_url: string
  source_url: string
}

const entries = Object.entries(credits as Record<string, Credit>)

// Licenca CC BY zahteva navedbo avtorja, naslova, vira in licence.
export default function PhotoCreditsPage() {
  usePageTitle('Viri fotografij')
  const titles = useAsync(async () => {
    const { data, error } = await supabase.from('recipes').select('slug, title').eq('is_seed', true)
    if (error) throw error
    return Object.fromEntries(data.map((r) => [r.slug as string, r.title as string]))
  }, [])

  return (
    <div className="container">
      <header className="page-head">
        <h1>Viri fotografij</h1>
        <p>
          Fotografije receptov so pridobljene prek iskalnika{' '}
          <a href="https://openverse.org" rel="noopener">
            Openverse
          </a>{' '}
          in so objavljene pod odprtimi licencami. Slike so obrezane in pomanjšane.
        </p>
      </header>
      <table className="credits-table">
        <caption className="visually-hidden">Avtorji in licence fotografij</caption>
        <thead>
          <tr>
            <th scope="col">Recept</th>
            <th scope="col">Fotografija</th>
            <th scope="col">Avtor</th>
            <th scope="col">Licenca</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([slug, c]) => (
            <tr key={slug}>
              <td>
                <Link to={`/recepti/${slug}`}>{titles.data?.[slug] ?? slug}</Link>
              </td>
              <td>
                <a href={c.source_url} rel="noopener">
                  {c.title || 'Brez naslova'}
                </a>
              </td>
              <td>
                {c.creator_url ? (
                  <a href={c.creator_url} rel="noopener">
                    {c.creator ?? 'Neznan avtor'}
                  </a>
                ) : (
                  (c.creator ?? 'Neznan avtor')
                )}
              </td>
              <td>
                <a href={c.license_url} rel="noopener license">
                  {c.license}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

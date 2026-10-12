// Fotografija recepta ali tipografska nadomestna slika (začetnica na barvni podlagi kategorije).
const CATEGORY_COLORS: Record<string, string> = {
  zajtrk: '#b07a2a',
  'juhe-in-enolocnice': '#8c4a2f',
  'glavne-jedi': '#5b3a29',
  vegetarijansko: '#5d6237',
  'solate-in-priloge': '#6f7a45',
  sladice: '#9a5560',
}

type Props = {
  src: string | null
  alt: string
  title: string
  categorySlug: string
  eager?: boolean
}

export default function RecipeImage({ src, alt, title, categorySlug, eager = false }: Props) {
  if (!src) {
    return (
      <div
        className="recipe-image placeholder"
        style={{ background: CATEGORY_COLORS[categorySlug] ?? '#5e5146' }}
        aria-hidden="true"
      >
        <span>{title.charAt(0)}</span>
      </div>
    )
  }
  return (
    <div className="recipe-image">
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" width={800} height={600} />
    </div>
  )
}

export function ErrorNotice({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="notice" role="alert">
      <h2>Podatkov ni bilo mogoče naložiti</h2>
      <p>Preveri internetno povezavo in poskusi znova.</p>
      {onRetry && (
        <button type="button" className="btn btn-ghost" onClick={onRetry}>
          Poskusi znova
        </button>
      )}
    </div>
  )
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="recipe-grid" aria-busy="true" aria-label="Nalaganje receptov">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ display: 'grid', gap: '0.6rem' }}>
          <div className="skeleton" style={{ aspectRatio: '4 / 3' }} />
          <div className="skeleton" style={{ height: '1.4rem', width: '80%' }} />
          <div className="skeleton" style={{ height: '0.9rem', width: '50%' }} />
        </div>
      ))}
    </div>
  )
}

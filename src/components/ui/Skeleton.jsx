export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, flexShrink: 0, ...style }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden',
    }}>
      <Skeleton height={220} borderRadius={0} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton width="40%" height={11} />
        <Skeleton width="75%" height={14} />
        <Skeleton width="90%" height={11} />
        <Skeleton width="60%" height={11} />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.25rem',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonText({ lines = 3 }) {
  const widths = ['100%', '92%', '78%', '85%', '60%']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={widths[i % widths.length]} height={13} />
      ))}
    </div>
  )
}

// Default export for convenience
export default Skeleton

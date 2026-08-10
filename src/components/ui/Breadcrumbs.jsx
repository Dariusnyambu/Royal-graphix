import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

// items: [{ name, path }] — last item renders as plain text (current page)
export default function Breadcrumbs({ items, dark = false }) {
  const linkColor = dark ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)'
  const currentColor = dark ? 'rgba(255,255,255,0.9)' : 'var(--text)'

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
      <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem' }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.path} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <ChevronRight size={12} color={linkColor} />}
              {isLast ? (
                <span style={{ color: currentColor, fontWeight: 600 }} aria-current="page">{item.name}</span>
              ) : (
                <Link to={item.path} style={{ color: linkColor, textDecoration: 'none' }}>{item.name}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

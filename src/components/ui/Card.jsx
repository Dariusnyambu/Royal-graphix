export default function Card({ children, className, hover = false, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        cursor: hover ? 'pointer' : 'default',
        ...style,
      }}
      className={className}
      onMouseEnter={e => {
        if (!hover) return
        e.currentTarget.style.borderColor = 'var(--red)'
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(200,16,46,0.15)'
      }}
      onMouseLeave={e => {
        if (!hover) return
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {children}
    </div>
  )
}

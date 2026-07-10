import { forwardRef } from 'react'

const variants = {
  primary: {
    background: 'var(--red)', color: 'white', border: 'none',
  },
  outline: {
    background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)',
  },
  ghost: {
    background: 'transparent', color: 'var(--text-muted)', border: 'none',
  },
  danger: {
    background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)',
  },
}

const sizes = {
  sm: { padding: '0.45rem 1rem', fontSize: '0.8rem', borderRadius: 8 },
  md: { padding: '0.6rem 1.25rem', fontSize: '0.875rem', borderRadius: 8 },
  lg: { padding: '0.8rem 2rem', fontSize: '1rem', borderRadius: 10 },
}

const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', disabled, loading, className, style, onClick, type = 'button', ...props },
  ref
) {
  const v = variants[variant] || variants.primary
  const s = sizes[size] || sizes.md

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        ...v, ...s,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 6,
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        ...style,
      }}
      className={className}
      onMouseEnter={e => {
        if (disabled || loading) return
        if (variant === 'primary') { e.currentTarget.style.background = 'var(--red-dark)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(200,16,46,0.35)' }
        if (variant === 'outline') { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }
      }}
      onMouseLeave={e => {
        if (disabled || loading) return
        if (variant === 'primary') { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }
        if (variant === 'outline') { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }
      }}
      {...props}
    >
      {loading ? '⏳' : children}
    </button>
  )
})

export default Button

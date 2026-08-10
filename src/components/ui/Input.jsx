import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, type = 'text', placeholder, value, onChange, required, style, ...props },
  ref
) {
  const baseStyle = {
    width: '100%',
    background: 'var(--bg)',
    border: `1px solid ${error ? '#ef4444' : 'var(--border)'}`,
    borderRadius: 10,
    padding: '0.7rem 1rem',
    fontSize: '0.9rem',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ marginBottom: '1.25rem', ...style }}>
      {label && (
        <label style={{
          display: 'block', fontSize: '0.85rem', fontWeight: 600,
          color: 'var(--text)', marginBottom: 6,
        }}>
          {label}{required && <span style={{ color: 'var(--red)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={{ ...baseStyle, resize: 'vertical', minHeight: 110 }}
          onFocus={e => (e.target.style.borderColor = 'var(--red)')}
          onBlur={e => (e.target.style.borderColor = error ? '#ef4444' : 'var(--border)')}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          required={required}
          style={baseStyle}
          onFocus={e => (e.target.style.borderColor = 'var(--red)')}
          onBlur={e => (e.target.style.borderColor = error ? '#ef4444' : 'var(--border)')}
          {...props}
        />
      ) : (
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={baseStyle}
          onFocus={e => (e.target.style.borderColor = 'var(--red)')}
          onBlur={e => (e.target.style.borderColor = error ? '#ef4444' : 'var(--border)')}
          {...props}
        />
      )}
      {error && (
        <p style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: 4 }}>{error}</p>
      )}
    </div>
  )
})

export default Input

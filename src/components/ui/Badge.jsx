const colors = {
  red:   { bg: 'rgba(200,16,46,0.1)',   color: '#C8102E' },
  blue:  { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
  green: { bg: 'rgba(34,197,94,0.1)',   color: '#16a34a' },
  amber: { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
  gray:  { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
}

export default function Badge({ children, color = 'red', style }) {
  const c = colors[color] || colors.red
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 100,
      fontSize: '0.72rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      background: c.bg,
      color: c.color,
      ...style,
    }}>
      {children}
    </span>
  )
}

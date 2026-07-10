export default function SectionHeader({ tag, title, subtitle, center = false }) {
  return (
    <div className="reveal" style={{
      marginBottom: '3rem',
      textAlign: center ? 'center' : 'left',
    }}>
      {tag && (
        <span style={{
          fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.12em', color: 'var(--red)',
          display: 'block', marginBottom: '0.75rem',
        }}>
          {tag}
        </span>
      )}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: 'var(--text)',
        lineHeight: 1.1,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontSize: '1rem', color: 'var(--text-muted)',
          marginTop: '0.75rem',
          maxWidth: center ? 560 : 540,
          lineHeight: 1.7,
          margin: center ? '0.75rem auto 0' : '0.75rem 0 0',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

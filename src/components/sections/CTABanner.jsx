import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const BG_IMAGE = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&fit=crop'

export default function CTABanner() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(5rem,9vw,8rem) clamp(1.25rem,5vw,4.5rem)' }}>
      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img src={BG_IMAGE} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(200,16,46,0.95) 0%, rgba(120,5,20,0.9) 100%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', textAlign: 'center' }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 100, padding: '6px 16px', marginBottom: '1.5rem',
        }}>
          <span className="pulse-dot" style={{ background: 'white' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.9)' }}>
            Limited Spots Available This Month
          </span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.2rem)',
          fontWeight: 900, color: 'white', letterSpacing: '-0.03em',
          lineHeight: 1.1, marginBottom: '1.25rem',
        }}>
          Ready to Elevate Your Brand?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: '2.5rem', fontSize: '1.05rem' }}>
          Let\'s build something extraordinary together. Get a free strategy call and custom proposal within 24 hours.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'white', color: 'var(--red)',
                border: 'none', padding: '0.875rem 2.25rem',
                borderRadius: 'var(--radius-md)', fontSize: '1rem',
                fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              }}
            >
              Get a Free Quote →
            </motion.button>
          </Link>
          <Link to="/portfolio" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'rgba(255,255,255,0.1)', color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.875rem 2.25rem', borderRadius: 'var(--radius-md)',
                fontSize: '1rem', fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-body)', backdropFilter: 'blur(10px)',
              }}
            >
              View Our Work
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

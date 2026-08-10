import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import SEO from '@/components/seo/SEO'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you are looking for could not be found." noindex path="/404" />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '2rem', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative bg */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200,16,46,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <motion.div animate={{ rotate: [0, -5, 5, -3, 3, 0] }} transition={{ duration: 0.6, delay: 0.4 }} style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: 1 }}>🧭</motion.div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(5rem, 15vw, 10rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '1rem', background: 'linear-gradient(135deg, var(--border-med), var(--border))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>404</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Page Not Found</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 400, lineHeight: 1.75, marginBottom: '2.5rem', margin: '0 auto 2.5rem' }}>
            The page you\'re looking for doesn\'t exist or has been moved. Let\'s get you back on track.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 16px var(--red-glow)', display:'flex', alignItems:'center', gap:8 }}><ArrowLeft size={16} strokeWidth={2}/>
                Back to Home
              </motion.button>
            </Link>
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border-med)', padding: '0.8rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Contact Us
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}

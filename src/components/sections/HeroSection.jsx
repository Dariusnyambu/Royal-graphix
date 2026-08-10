import { motion } from 'framer-motion'
import { Trophy, Star, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { staggerContainer, staggerItem } from '@/lib/motion'

// Curated Unsplash images (stable direct URLs)
const HERO_BG = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1800&q=80&fit=crop'
const HERO_FLOAT_1 = 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80&fit=crop'
const HERO_FLOAT_2 = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80&fit=crop'

const STATS = [
  { num: '150+', label: 'Projects' },
  { num: '98%',  label: 'Satisfaction' },
  { num: '5+',   label: 'Years' },
  { num: '40+',  label: 'Clients' },
]

export default function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center',
    }}>
      {/* Background image with overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src={HERO_BG}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(5,5,15,0.96) 0%, rgba(10,5,20,0.88) 55%, rgba(8,0,12,0.75) 100%)',
        }} />
        {/* Red accent glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 70% at 70% 50%, rgba(200,16,46,0.12) 0%, transparent 65%)',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.12,
          backgroundImage: 'linear-gradient(rgba(200,16,46,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200,16,46,0.3) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 80%)',
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1, width: '100%',
        maxWidth: 1240, margin: '0 auto',
        padding: 'calc(var(--nav-h) + 4rem) clamp(1.25rem,5vw,4.5rem) 6rem',
        display: 'grid', gridTemplateColumns: '1fr auto',
        alignItems: 'center', gap: '4rem',
      }}>
        {/* Left: Text */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {/* Live badge */}
          <motion.div variants={staggerItem} style={{ marginBottom: '1.75rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)',
              borderRadius: '100px', padding: '7px 16px',
            }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.85)' }}>
                Nairobi's Premier Creative Agency
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={staggerItem} style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
            lineHeight: 1.05, letterSpacing: '-0.03em',
            color: '#ffffff', marginBottom: '1.5rem',
          }}>
            We{' '}
            <span style={{
              background: 'linear-gradient(135deg, #C8102E 0%, #FF4060 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Design.</span>
            <br />
            We{' '}
            <span style={{
              background: 'linear-gradient(135deg, #C8102E 0%, #FF4060 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Build.</span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>We Grow Brands.</span>
          </motion.h1>

          <motion.p variants={staggerItem} style={{
            fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
            color: 'rgba(255,255,255,0.6)', maxWidth: 520,
            lineHeight: 1.75, marginBottom: '2.5rem',
          }}>
            From pixel-perfect interfaces to high-ranking SEO campaigns — we craft digital experiences that captivate audiences and convert visitors into loyal customers.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={staggerItem} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'var(--red)', color: 'white', border: 'none',
                  padding: '0.875rem 2.25rem', borderRadius: 'var(--radius-md)',
                  fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  boxShadow: '0 8px 32px rgba(200,16,46,0.45)',
                }}
              >
                Start Your Project ↗
              </motion.button>
            </Link>
            <Link to="/portfolio" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'rgba(255,255,255,0.07)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.18)',
                  padding: '0.875rem 2.25rem', borderRadius: 'var(--radius-md)',
                  fontSize: '1rem', fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'var(--font-body)', backdropFilter: 'blur(10px)',
                }}
              >
                View Portfolio
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={staggerItem} style={{
            display: 'flex', gap: '2.5rem', flexWrap: 'wrap',
            paddingTop: '2.5rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontSize: '2rem',
                  fontWeight: 800, letterSpacing: '-0.04em', color: 'white', lineHeight: 1,
                }}>
                  {s.num}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: 5, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Floating image cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="hide-mobile"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 280 }}
        >
          {/* Card 1 */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
              height: 180,
            }}
          >
            <img src={HERO_FLOAT_1} alt="Design work" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          {/* Stat card */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{
              background: 'rgba(200,16,46,0.9)', backdropFilter: 'blur(20px)',
              borderRadius: 'var(--radius-md)', padding: '1.25rem 1.5rem',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 16px 40px rgba(200,16,46,0.35)',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}
          >
            <Trophy size={28} color='white' strokeWidth={1.8} />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>Top-Rated Agency</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }} style={{display:'flex',alignItems:'center',gap:3}}>{[...Array(5)].map((_,i)=><Star key={i} size={10} fill='#f59e0b' color='#f59e0b' strokeWidth={0}/>)} across all platforms</div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
              height: 140,
            }}
          >
            <img src={HERO_FLOAT_2} alt="Creative work" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to bottom, transparent, var(--bg))',
        zIndex: 2, pointerEvents: 'none',
      }} />
    </section>
  )
}

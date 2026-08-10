import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDES = [
  {
    id: 1,
    tag: 'Web Design & Development',
    headline: 'We Build Websites\nThat Win Clients',
    body: 'Responsive, blazing-fast websites and web apps that turn visitors into customers. Delivered in 7 days.',
    cta: 'Start a Project',
    ctaLink: '/contact',
    secondary: 'View Portfolio',
    secondaryLink: '/portfolio',
    price: 'From KES 30,000',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1800&q=80&fit=crop',
  },
  {
    id: 2,
    tag: 'Graphic Design & Branding',
    headline: 'Brands That People\nRemember',
    body: 'Logo design, brand identity, social media kits, and marketing materials that make your business unforgettable.',
    cta: 'Build My Brand',
    ctaLink: '/contact',
    secondary: 'Our Services',
    secondaryLink: '/services',
    price: 'From KES 500',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1800&q=80&fit=crop',
  },
  {
    id: 3,
    tag: 'SEO & Digital Marketing',
    headline: 'Rank Higher.\nGrow Faster.',
    body: "Data-driven SEO strategies that put your business in front of the right audience. We've grown client traffic by 340% in 90 days.",
    cta: 'Boost My Rankings',
    ctaLink: '/contact',
    secondary: 'See Results',
    secondaryLink: '/portfolio',
    price: 'Custom Quote',
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1800&q=80&fit=crop',
  },
  {
    id: 4,
    tag: 'UI/UX Design',
    headline: 'Interfaces Users\nActually Love',
    body: 'User research, wireframes, Figma prototypes, and design systems built for conversion — not just aesthetics.',
    cta: 'Start Design Project',
    ctaLink: '/contact',
    secondary: 'View Portfolio',
    secondaryLink: '/portfolio',
    price: 'Custom Quote',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1800&q=80&fit=crop',
  },
  {
    id: 5,
    tag: 'Full-Service Creative Agency',
    headline: 'Your Vision.\nOur Expertise.',
    body: 'From brand strategy to launch — we handle every touchpoint of your digital presence so you can focus on running your business.',
    cta: 'Get a Free Quote',
    ctaLink: '/contact',
    secondary: 'About Us',
    secondaryLink: '/services',
    price: 'Custom Packages',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=80&fit=crop',
  },
  {
    id: 6,
    tag: 'Refer & Earn Programme',
    headline: 'Refer a Client.\nEarn 20%.',
    body: 'Know someone who needs a website, logo, or design? Refer them to Royal Graphix and earn 20% commission on every completed project — no limits.',
    cta: 'Start Referring',
    ctaLink: '/refer',
    secondary: 'Learn More',
    secondaryLink: '/refer',
    price: 'Earn KES 6,000+',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1800&q=80&fit=crop',
    accent: true,
  },
]

export default function HomeSlider() {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const [dir,     setDir]     = useState(1)

  const next = useCallback(() => {
    setDir(1)
    setCurrent(p => (p + 1) % SLIDES.length)
  }, [])

  const goTo = useCallback((i) => {
    setDir(i > current ? 1 : -1)
    setCurrent(i)
  }, [current])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [paused, next])

  const slide = SLIDES[current]

  const imgVariants = {
    enter:  (d) => ({ opacity: 0, scale: 1.08, x: d * 60 }),
    center: { opacity: 1, scale: 1, x: 0, transition: { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit:   (d) => ({ opacity: 0, scale: 0.96, x: -d * 40, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }),
  }

  const textVariants = {
    enter:  { opacity: 0, y: 36 },
    center: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.08 } },
    exit:   { opacity: 0, y: -20, transition: { duration: 0.4 } },
  }

  const itemVariants = {
    enter:  { opacity: 0, y: 24 },
    center: { opacity: 1, y: 0 },
  }

  const accentColor = slide.accent ? '#f59e0b' : '#C8102E'
  const accentGlow  = slide.accent ? 'rgba(245,158,11,0.45)' : 'rgba(200,16,46,0.45)'

  return (
    <section
      style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image */}
      <AnimatePresence custom={dir} mode="sync">
        <motion.div
          key={slide.id + '-bg'}
          custom={dir}
          variants={imgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <img
            src={slide.image}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: slide.accent
              ? 'linear-gradient(105deg, rgba(5,5,10,0.96) 0%, rgba(5,5,10,0.85) 45%, rgba(5,5,10,0.4) 100%)'
              : 'linear-gradient(105deg, rgba(5,5,10,0.94) 0%, rgba(5,5,10,0.80) 45%, rgba(5,5,10,0.35) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 70% 60% at 10% 100%, ${slide.accent ? 'rgba(245,158,11,0.10)' : 'rgba(200,16,46,0.12)'} 0%, transparent 65%)`,
            pointerEvents: 'none',
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2, width: '100%',
        maxWidth: 1240, margin: '0 auto',
        padding: 'calc(var(--nav-h) + 5rem) clamp(1.25rem,5vw,4.5rem) 7rem',
      }}>
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={slide.id}
            custom={dir}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ maxWidth: 620 }}
          >
            {/* Tag pill */}
            <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: slide.accent ? 'rgba(245,158,11,0.15)' : 'rgba(200,16,46,0.15)',
                border: `1px solid ${slide.accent ? 'rgba(245,158,11,0.35)' : 'rgba(200,16,46,0.35)'}`,
                borderRadius: '100px', padding: '6px 16px',
                fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: slide.accent ? '#fbbf24' : '#FF5070',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, display: 'inline-block' }} />
                {slide.tag}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              style={{
                fontFamily: 'var(--font-heading)', fontWeight: 900,
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                lineHeight: 1.06, letterSpacing: '-0.035em',
                color: '#ffffff', marginBottom: '1.25rem',
                whiteSpace: 'pre-line',
              }}
            >
              {slide.headline}
            </motion.h1>

            {/* Accent rule */}
            <motion.div variants={itemVariants}
              style={{ width: 52, height: 3, background: accentColor, borderRadius: 2, marginBottom: '1.25rem', boxShadow: `0 0 16px ${accentGlow}` }}
            />

            {/* Body */}
            <motion.p variants={itemVariants}
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.95rem,1.6vw,1.1rem)', lineHeight: 1.8, marginBottom: '0.75rem', maxWidth: 520 }}>
              {slide.body}
            </motion.p>

            {/* Price */}
            <motion.div variants={itemVariants} style={{ marginBottom: '2.5rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 700, color: accentColor, letterSpacing: '-0.02em' }}>
                {slide.price}
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to={slide.ctaLink} style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  style={{ background: accentColor, color: 'white', border: 'none', padding: '0.875rem 2.25rem', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: `0 8px 32px ${accentGlow}`, letterSpacing: '0.01em' }}>
                  {slide.cta} →
                </motion.button>
              </Link>
              <Link to={slide.secondaryLink} style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.88)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.875rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', backdropFilter: 'blur(12px)' }}>
                  {slide.secondary}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots only — no arrows */}
      <div style={{ position: 'absolute', bottom: 'clamp(2rem,4vw,3rem)', left: 'clamp(1.25rem,5vw,4.5rem)', zIndex: 10, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {SLIDES.map((_, i) => (
          <button
            key={i} onClick={() => goTo(i)}
            style={{
              border: 'none', cursor: 'pointer', padding: 0,
              borderRadius: '100px', transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
              background: i === current
                ? (SLIDES[i].accent ? '#f59e0b' : '#C8102E')
                : 'rgba(255,255,255,0.3)',
              width: i === current ? 28 : 8, height: 8,
              boxShadow: i === current
                ? `0 0 12px ${SLIDES[i].accent ? 'rgba(245,158,11,0.7)' : 'rgba(200,16,46,0.7)'}`
                : 'none',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.06)', zIndex: 10 }}>
        <motion.div
          key={current + '-bar'}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 6, ease: 'linear' }}
          style={{ height: '100%', background: accentColor, transformOrigin: 'left', boxShadow: `0 0 8px ${accentGlow}` }}
        />
      </div>

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to bottom, transparent, var(--bg))', zIndex: 3, pointerEvents: 'none' }} />
    </section>
  )
}

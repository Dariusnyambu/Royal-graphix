import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// 5 clean professional slides with real background images
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
    body: 'Data-driven SEO strategies that put your business in front of the right audience. We\'ve grown client traffic by 340% in 90 days.',
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
]

export default function HomeSlider() {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const [dir,     setDir]     = useState(1)

  const next = useCallback(() => {
    setDir(1)
    setCurrent(p => (p + 1) % SLIDES.length)
  }, [])

  const prev = useCallback(() => {
    setDir(-1)
    setCurrent(p => (p - 1 + SLIDES.length) % SLIDES.length)
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
    enter: (d) => ({ opacity: 0, scale: 1.08, x: d * 60 }),
    center: { opacity: 1, scale: 1, x: 0, transition: { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: (d) => ({ opacity: 0, scale: 0.96, x: -d * 40, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }),
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

  return (
    <section
      style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background image (crossfades) ── */}
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
          {/* Dark gradient overlay — left heavier for text readability */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, rgba(5,5,10,0.94) 0%, rgba(5,5,10,0.80) 45%, rgba(5,5,10,0.35) 100%)',
          }} />
          {/* Subtle red vignette bottom-left */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 60% at 10% 100%, rgba(200,16,46,0.12) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
        </motion.div>
      </AnimatePresence>

      {/* ── Content ── */}
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
            {/* Service tag pill */}
            <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(200,16,46,0.15)',
                border: '1px solid rgba(200,16,46,0.35)',
                borderRadius: '100px', padding: '6px 16px',
                fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#FF5070',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8102E', display: 'inline-block' }} />
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

            {/* Red accent rule */}
            <motion.div variants={itemVariants}
              style={{ width: 52, height: 3, background: '#C8102E', borderRadius: 2, marginBottom: '1.25rem', boxShadow: '0 0 16px rgba(200,16,46,0.6)' }}
            />

            {/* Body */}
            <motion.p
              variants={itemVariants}
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: 'clamp(0.95rem,1.6vw,1.1rem)',
                lineHeight: 1.8, marginBottom: '0.75rem',
                maxWidth: 520,
              }}
            >
              {slide.body}
            </motion.p>

            {/* Price */}
            <motion.div variants={itemVariants} style={{ marginBottom: '2.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                fontWeight: 700, color: '#C8102E',
                letterSpacing: '-0.02em',
              }}>
                {slide.price}
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to={slide.ctaLink} style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: '#C8102E', color: 'white',
                    border: 'none', padding: '0.875rem 2.25rem',
                    borderRadius: 'var(--radius-md)', fontSize: '1rem',
                    fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    boxShadow: '0 8px 32px rgba(200,16,46,0.45)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {slide.cta} →
                </motion.button>
              </Link>
              <Link to={slide.secondaryLink} style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.88)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '0.875rem 2rem',
                    borderRadius: 'var(--radius-md)', fontSize: '0.95rem',
                    fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {slide.secondary}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Nav arrows ── */}
      <div style={{ position: 'absolute', bottom: 'clamp(2rem,4vw,3rem)', left: 'clamp(1.25rem,5vw,4.5rem)', zIndex: 10, display: 'flex', gap: '0.6rem' }}>
        {[{ fn: prev, Icon: ChevronLeft }, { fn: next, Icon: ChevronRight }].map(({ fn, Icon }, i) => (
          <motion.button
            key={i} onClick={fn}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Icon size={18} strokeWidth={2} />
          </motion.button>
        ))}

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginLeft: '0.5rem' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i} onClick={() => goTo(i)}
              style={{
                border: 'none', cursor: 'pointer', padding: 0,
                borderRadius: '100px', transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                background: i === current ? '#C8102E' : 'rgba(255,255,255,0.3)',
                width: i === current ? 28 : 8, height: 8,
                boxShadow: i === current ? '0 0 12px rgba(200,16,46,0.7)' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.06)', zIndex: 10 }}>
        <motion.div
          key={current + '-bar'}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 6, ease: 'linear' }}
          style={{ height: '100%', background: '#C8102E', transformOrigin: 'left', boxShadow: '0 0 8px rgba(200,16,46,0.7)' }}
        />
      </div>

      {/* ── Bottom fade to content ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to bottom, transparent, var(--bg))', zIndex: 3, pointerEvents: 'none' }} />
    </section>
  )
}

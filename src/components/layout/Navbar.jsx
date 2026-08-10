import { useState, useEffect } from 'react'
import { X, Sun, Moon } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/constants'

// Inline SVG social icons for mobile panel
const SocialIcon = ({ href, label, color, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
    style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid var(--border-med)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.2s', flex: 1 }}
    onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}15` }}
    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.background = 'var(--bg)' }}
  >{children}</a>
)
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { NAV_LINKS } from '@/lib/constants'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* ── Main Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        height: 'var(--nav-h)',
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(28px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 40px rgba(0,0,0,0.12)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(1.25rem, 5vw, 3.5rem)',
        gap: '2rem',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', overflow: 'hidden',
            border: '2px solid rgba(200,16,46,0.3)',
            boxShadow: '0 0 12px rgba(200,16,46,0.2)',
          }}>
            <img src="/logo.png" alt="Royal Graphix" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => {
                e.target.style.display = 'none'
                e.target.parentElement.style.background = 'var(--red)'
                e.target.parentElement.style.display = 'flex'
                e.target.parentElement.style.alignItems = 'center'
                e.target.parentElement.style.justifyContent = 'center'
                e.target.parentElement.innerHTML = '<span style="font-family:var(--font-heading);font-weight:800;color:white;font-size:0.85rem">RG</span>'
              }}
            />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.1 }}>
              Royal<span style={{ color: 'var(--red)' }}>Graphix</span>
            </span>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-faint)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
              Creative Agency
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hide-mobile" style={{ display: 'flex', gap: '0.15rem', alignItems: 'center', flex: 1 }}>
          {NAV_LINKS.map(link => (
            <NavLink key={link.path} to={link.path} end={link.path === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid var(--border-med)',
              background: 'var(--surface)',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '0.95rem',
              transition: 'all 0.25s',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--red)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-med)'}
          >
            {theme === 'dark' ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
          </button>

          {/* Admin accessible at /admin - not shown in public nav */}

          {/* CTA */}
          <Link to="/contact" className="hide-mobile" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'var(--red)', color: 'white', border: 'none',
              padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-body)', transition: 'all 0.25s',
              boxShadow: '0 4px 14px var(--red-glow)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-dark)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow-red)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px var(--red-glow)' }}
            >
              Get a Quote ↗
            </button>
          </Link>

          {/* Hamburger */}
          <button
            className="hide-desktop"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              width: 38, height: 38, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 5,
              background: 'var(--surface)', border: '1px solid var(--border-med)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer', padding: 0,
              transition: 'all 0.2s',
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 18, height: 1.5,
                background: mobileOpen ? 'var(--red)' : 'var(--text)',
                borderRadius: 2, transition: 'all 0.35s var(--ease)',
                transformOrigin: 'center',
                transform: mobileOpen
                  ? i === 0 ? 'rotate(45deg) translateY(6.5px)'
                  : i === 2 ? 'rotate(-45deg) translateY(-6.5px)'
                  : 'scaleX(0)'
                  : 'none',
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 840,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(320px, 90vw)', zIndex: 850,
                background: 'var(--surface)',
                borderLeft: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column',
                boxShadow: '-20px 0 60px rgba(0,0,0,0.25)',
              }}
            >
              {/* Panel Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
                  Royal<span style={{ color: 'var(--red)' }}>Graphix</span>
                </span>
                <button onClick={() => setMobileOpen(false)} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: '1px solid var(--border)', background: 'var(--bg2)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', color: 'var(--text-muted)',
                }}><X size={14} strokeWidth={2.5} /></button>
              </div>

              {/* Nav Links */}
              <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <NavLink
                      to={link.path}
                      end={link.path === '/'}
                      style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none', transition: 'all 0.2s',
                        fontWeight: 500, fontSize: '0.95rem',
                        color: isActive ? 'var(--red)' : 'var(--text-muted)',
                        background: isActive ? 'rgba(200,16,46,0.08)' : 'transparent',
                        borderLeft: isActive ? '2px solid var(--red)' : '2px solid transparent',
                      })}
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* Panel Footer */}
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/contact" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%', background: 'var(--red)', color: 'white', border: 'none',
                    padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--red-glow)',
                  }}>
                    Get a Free Quote →
                  </button>
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {/* Social links */}
                  <SocialIcon href={SOCIAL_LINKS.tiktok} label="TikTok" color="#010101">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.77 0 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-7.13 6.3A6.34 6.34 0 009.49 21.7a6.34 6.34 0 006.33-6.34V9.05a8.17 8.17 0 004.79 1.54V7.12a4.85 4.85 0 01-1.02-.43z"/></svg>
                  </SocialIcon>
                  <SocialIcon href={SOCIAL_LINKS.youtube} label="YouTube" color="#FF0000">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z"/></svg>
                  </SocialIcon>
                  <SocialIcon href={SOCIAL_LINKS.instagram} label="Instagram" color="#E1306C">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </SocialIcon>
                  <SocialIcon href={SOCIAL_LINKS.facebook} label="Facebook" color="#1877F2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
                  </SocialIcon>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={toggleTheme} style={{
                    flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-med)', background: 'var(--bg2)',
                    cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
                  }}>
                    <span style={{display:'flex',alignItems:'center',gap:6}}>{theme === 'dark' ? <><Sun size={14} strokeWidth={1.8}/>Light</> : <><Moon size={14} strokeWidth={1.8}/>Dark</>}</span>
                  </button>

                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

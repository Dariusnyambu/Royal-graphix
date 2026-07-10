import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { APP_EMAIL, APP_PHONE, APP_LOCATION, SOCIAL_LINKS } from '@/lib/constants'

// ── Inline SVG icons for platforms not in lucide-react ─────────
const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.17 8.17 0 004.79 1.54V7.12a4.85 4.85 0 01-1.02-.43z"/>
  </svg>
)

const YouTubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z"/>
  </svg>
)

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
  </svg>
)

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const SOCIAL_ITEMS = [
  { Icon: TikTokIcon,   href: SOCIAL_LINKS.tiktok,    label: 'TikTok',    color: '#010101' },
  { Icon: YouTubeIcon,  href: SOCIAL_LINKS.youtube,   label: 'YouTube',   color: '#FF0000' },
  { Icon: InstagramIcon,href: SOCIAL_LINKS.instagram,  label: 'Instagram', color: '#E1306C' },
  { Icon: FacebookIcon, href: SOCIAL_LINKS.facebook,   label: 'Facebook',  color: '#1877F2' },
]

const SERVICES_LINKS = [
  { label: 'Web Design & Development', to: '/services' },
  { label: 'Graphic Design',           to: '/services' },
  { label: 'SEO Marketing',            to: '/services' },
  { label: 'UI/UX Design',             to: '/services' },
  { label: 'Brand Identity',           to: '/services' },
]

const COMPANY_LINKS = [
  { label: 'Portfolio',        to: '/portfolio' },
  { label: 'Blog',             to: '/blog' },
  { label: 'Pricing',          to: '/pricing' },
  { label: 'Track My Project', to: '/track' },
  { label: 'Contact Us',       to: '/contact' },
]

const CONTACT_ITEMS = [
  { Icon: Mail,    value: APP_EMAIL,    href: `mailto:${APP_EMAIL}` },
  { Icon: Phone,   value: APP_PHONE,    href: `tel:${APP_PHONE.replace(/\s/g,'')}` },
  { Icon: MapPin,  value: APP_LOCATION, href: null },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#050505', borderTop: '1px solid #111', color: 'rgba(255,255,255,0.5)' }}>
      {/* Main grid */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(3.5rem,7vw,5.5rem) clamp(1.25rem,5vw,4.5rem) 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '2.5rem', marginBottom: '3rem' }}>

          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
                Royal<span style={{ color: '#C8102E' }}>Graphix</span>
              </div>
            </Link>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: 230 }}>
              Nairobi's premier creative digital agency — web design, branding, graphic design, and digital marketing.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {SOCIAL_ITEMS.map(({ Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, color }}
                  style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.55)', textDecoration: 'none',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}22`; e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.color = color }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.82rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {SERVICES_LINKS.map(l => (
                <li key={l.label}>
                  <Link to={l.to} style={{ textDecoration: 'none', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#C8102E'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.82rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {COMPANY_LINKS.map(l => (
                <li key={l.label}>
                  <Link to={l.to} style={{ textDecoration: 'none', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#C8102E'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.82rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Contact</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {CONTACT_ITEMS.map(({ Icon, value, href }) => (
                <li key={value} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <Icon size={14} style={{ color: '#C8102E', flexShrink: 0, marginTop: 1 }} />
                  {href
                    ? <a href={href} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = '#C8102E'}
                        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
                        {value}
                      </a>
                    : <span style={{ fontSize: '0.82rem' }}>{value}</span>
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #111', padding: '1.25rem clamp(1.25rem,5vw,4.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', maxWidth: 1240, margin: '0 auto' }}>
        <p style={{ fontSize: '0.78rem' }}>
          © {year} <span style={{ color: '#555' }}>Royal Graphix.</span> All rights reserved. Built with ❤️ in Nairobi.
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {['Privacy Policy', 'Terms of Service'].map(l => (
            <Link key={l} to="/contact" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#C8102E'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>
              {l}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

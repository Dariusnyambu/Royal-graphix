import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Download, Smartphone } from 'lucide-react'
import { GOOGLE_REVIEW_URL, SOCIAL_LINKS } from '@/lib/constants'

// ─────────────────────────────────────────────────────────────
// SmartPopups — Three non-intrusive popups
//
// 1. APP DOWNLOAD BANNER  (bottom, after 8s, once per 7 days)
//    Slides up from bottom. Dismissable. Only on mobile.
//
// 2. GOOGLE REVIEW POPUP  (center, after 45s, once per 30 days)
//    Shows after the visitor has spent real time on the site.
//    Asks them to rate Royal Graphix on Google.
//
// 3. SOCIAL FOLLOW NUDGE  (bottom-left corner, after 25s, once per 3 days)
//    Small pill that invites following on social media.
//
// Storage keys (localStorage):
//   rg_app_popup_last    — timestamp last shown
//   rg_review_popup_last — timestamp last shown
//   rg_social_popup_last — timestamp last shown
//   rg_review_done       — set when user clicked "Leave a Review"
// ─────────────────────────────────────────────────────────────

const DAYS_MS = (d) => d * 24 * 60 * 60 * 1000

function shouldShow(key, cooldownDays) {
  try {
    const last = localStorage.getItem(key)
    if (!last) return true
    return Date.now() - parseInt(last) > DAYS_MS(cooldownDays)
  } catch { return false }
}

function markShown(key) {
  try { localStorage.setItem(key, String(Date.now())) } catch {}
}

// ── Inline SVGs for social platforms ─────────────────────────
const TikTokSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.17 8.17 0 004.79 1.54V7.12a4.85 4.85 0 01-1.02-.43z"/>
  </svg>
)

const YoutubeSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z"/>
  </svg>
)

const InstaSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const FbSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
  </svg>
)

const APK_URL = 'https://github.com/Dariusnyambu/Royal-graphix/releases/download/v1.0.0/app-debug.apk'

function AppDownloadBanner({ onClose }) {
  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 910,
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0a0e 100%)',
        borderTop: '1px solid rgba(200,16,46,0.3)',
        padding: '1rem clamp(1rem,4vw,2rem)',
        display: 'flex', alignItems: 'center', gap: '1rem',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
      }}
    >
      {/* App icon */}
      <div style={{
        width: 52, height: 52, borderRadius: 14, background: '#C8102E',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, boxShadow: '0 4px 16px rgba(200,16,46,0.5)',
      }}>
        <Smartphone size={24} color="white" strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.92rem', color: 'white', marginBottom: '0.15rem' }}>
          Get the Royal Graphix App
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>
          Request quotes, track projects and reach us — straight from your phone.
        </div>
      </div>

      {/* Direct APK download link — <a download> triggers save dialog */}
      <a
        href={APK_URL}
        download="RoyalGraphix.apk"
        onClick={onClose}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0.6rem 1.25rem', borderRadius: 10,
          background: '#C8102E', color: 'white',
          textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700,
          flexShrink: 0,
          fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(200,16,46,0.45)',
        }}
      >
        <Download size={14} strokeWidth={2} />
        Download APK
      </a>

      {/* Dismiss */}
      <button onClick={onClose}
        style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'rgba(255,255,255,0.5)' }}>
        <X size={14} strokeWidth={2.5} />
      </button>
    </motion.div>
  )
}

// ── 2. GOOGLE REVIEW POPUP ────────────────────────────────────
function GoogleReviewPopup({ onClose }) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(5)

  const handleReview = () => {
    try { localStorage.setItem('rg_review_done', '1') } catch {}
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 920, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 24 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 24, padding: 'clamp(1.75rem,4vw,2.5rem)',
          maxWidth: 420, width: '100%', textAlign: 'center',
          boxShadow: '0 24px 72px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        <button onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <X size={13} strokeWidth={2.5} />
        </button>

        {/* Google G logo coloured circles */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #4285F4, #EA4335, #FBBC05, #34A853)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(66,133,244,0.35)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem', color: 'white', letterSpacing: '-0.05em' }}>G</span>
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Enjoying Royal Graphix?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
          If we've helped your business, please take 30 seconds to leave us a 5-star review on Google. It means everything to a growing Nairobi agency.
        </p>

        {/* Star selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(n)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.15s' }}
            >
              <Star
                size={34}
                strokeWidth={1.5}
                color="#FBBC05"
                fill={n <= (hovered || selected) ? '#FBBC05' : 'none'}
                style={{ display: 'block', transform: n <= (hovered || selected) ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.15s' }}
              />
            </button>
          ))}
        </div>

        {/* CTA */}
        <button onClick={handleReview}
          style={{ width: '100%', padding: '0.85rem', borderRadius: 12, background: '#C8102E', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 6px 20px rgba(200,16,46,0.4)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Star size={16} fill="white" color="white" strokeWidth={0} />
          Leave a {selected}-Star Review
        </button>

        <button onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Maybe later
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── 3. SOCIAL FOLLOW NUDGE ────────────────────────────────────
function SocialNudge({ onClose }) {
  const platforms = [
    { Svg: TikTokSVG,   href: SOCIAL_LINKS.tiktok,    label: 'TikTok',    color: '#010101', bg: '#f0f0f0' },
    { Svg: YoutubeSVG,  href: SOCIAL_LINKS.youtube,   label: 'YouTube',   color: '#FF0000', bg: '#fff0f0' },
    { Svg: InstaSVG,    href: SOCIAL_LINKS.instagram,  label: 'Instagram', color: '#E1306C', bg: '#fff0f5' },
    { Svg: FbSVG,       href: SOCIAL_LINKS.facebook,   label: 'Facebook',  color: '#1877F2', bg: '#f0f5ff' },
  ]

  return (
    <motion.div
      initial={{ x: -120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.1 }}
      style={{
        position: 'fixed', bottom: '5rem', left: '1.25rem', zIndex: 905,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '1rem 1.125rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        minWidth: 200,
      }}
    >
      <button onClick={onClose}
        style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'var(--bg2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <X size={11} strokeWidth={2.5} />
      </button>

      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
        Follow Royal Graphix
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.875rem', lineHeight: 1.4 }}>
        Design tips, portfolio updates, and behind-the-scenes content.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {platforms.map(({ Svg, href, label, color, bg }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0.45rem 0.75rem', borderRadius: 9, textDecoration: 'none',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600,
              fontFamily: 'var(--font-body)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}15`; e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.color = color }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
          >
            <span style={{ color }}><Svg /></span>
            {label}
          </a>
        ))}
      </div>
    </motion.div>
  )
}

// ── Master orchestrator ───────────────────────────────────────
export default function SmartPopups() {
  const [showApp,    setShowApp]    = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [showSocial, setShowSocial] = useState(false)

  useEffect(() => {
    // Don't show in admin section
    if (window.location.pathname.startsWith('/admin')) return

    // 1. APP DOWNLOAD — 8 seconds, mobile only, every 7 days
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile && shouldShow('rg_app_popup_last', 7)) {
      const t1 = setTimeout(() => {
        setShowApp(true)
        markShown('rg_app_popup_last')
      }, 8000)
      return () => clearTimeout(t1)
    }

    // 2. GOOGLE REVIEW — 45 seconds, every 30 days, skip if already done
    const reviewDone = (() => { try { return !!localStorage.getItem('rg_review_done') } catch { return false } })()
    if (!reviewDone && shouldShow('rg_review_popup_last', 30)) {
      const t2 = setTimeout(() => {
        setShowReview(true)
        markShown('rg_review_popup_last')
      }, 45000)
      return () => clearTimeout(t2)
    }

    // 3. SOCIAL NUDGE — 25 seconds, every 3 days
    if (shouldShow('rg_social_popup_last', 3)) {
      const t3 = setTimeout(() => {
        setShowSocial(true)
        markShown('rg_social_popup_last')
      }, 25000)
      return () => clearTimeout(t3)
    }
  }, [])

  return (
    <AnimatePresence>
      {showApp    && <AppDownloadBanner key="app"    onClose={() => setShowApp(false)} />}
      {showReview && <GoogleReviewPopup key="review" onClose={() => setShowReview(false)} />}
      {showSocial && <SocialNudge       key="social" onClose={() => setShowSocial(false)} />}
    </AnimatePresence>
  )
}

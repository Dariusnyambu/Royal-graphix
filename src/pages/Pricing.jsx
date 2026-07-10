import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, MessageCircle, Palette, Church, PartyPopper, Globe, Wrench, Smartphone, Tag, TrendingUp, Rocket } from 'lucide-react'
import SEO from '@/components/seo/SEO'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '@/components/ui/PageWrapper'
import CTABanner from '@/components/sections/CTABanner'
import {
  GRAPHIC_DESIGN_PRICES,
  CHURCH_PACKAGES,
  EVENT_PACKAGES,
  WEBSITE_PACKAGES,
  MAINTENANCE_PACKAGES,
  MOBILE_APP_PACKAGES,
  DIGITAL_MARKETING_PACKAGES,
  BUSINESS_GROWTH_PACKAGES,
  BUSINESS_PARTNER_PACKAGE,
  PRICING_CATEGORIES,
} from '@/lib/constants'
import { staggerContainer, staggerItem } from '@/lib/motion'

const HERO_IMG = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80&fit=crop'

const ICON_MAP = { Palette, Church, PartyPopper, Globe, Wrench, Smartphone, TrendingUp, Rocket }

const DATA_MAP = {
  graphic:     { type: 'list',  items: GRAPHIC_DESIGN_PRICES, intro: 'À la carte graphic design — pay only for what you need.' },
  church:      { type: 'cards', items: CHURCH_PACKAGES,       intro: 'Monthly content packages built for churches and ministries.' },
  event:       { type: 'cards', items: EVENT_PACKAGES,        intro: 'Complete branding for conferences, crusades, concerts, and launches.' },
  website:     { type: 'cards', items: WEBSITE_PACKAGES,      intro: 'From a simple business website to fully custom web applications.' },
  maintenance: { type: 'cards', items: MAINTENANCE_PACKAGES,  intro: 'Keep your website fast, secure, and up to date — every month.' },
  mobile:      { type: 'cards', items: MOBILE_APP_PACKAGES,   intro: 'Native and cross-platform mobile apps for Android and iOS.' },
  marketing:   { type: 'cards', items: DIGITAL_MARKETING_PACKAGES, intro: 'Social media management, content creation, and paid advertising — all done for you.' },
  growth:      { type: 'growth', items: [...BUSINESS_GROWTH_PACKAGES, ...BUSINESS_PARTNER_PACKAGE], intro: 'Complete business growth partnerships — design, marketing, website, and leads in one monthly retainer.' },
}

const FAQ = [
  { q: 'Do you offer payment plans?', a: 'Yes — larger projects are typically split into 50% upfront and 50% on delivery. Monthly packages (church media, maintenance) are billed at the start of each cycle.' },
  { q: "What's your typical timeline?", a: 'Graphic design items: 1–3 days. Event packages: 3–5 days. Websites: 2–6 weeks depending on package. Mobile apps: 4–10 weeks. Monthly packages run on a continuous cycle.' },
  { q: 'Do you work with churches and NGOs?', a: 'Yes — our Church Media Packages were built specifically for churches and ministries who need consistent weekly content without hiring an in-house designer.' },
  { q: "What if I'm not happy with the result?", a: 'Every package includes revision rounds. Premium and Professional tiers include additional or unlimited minor revisions until you are fully satisfied.' },
  { q: 'Can I upgrade my package later?', a: 'Yes. Many clients start with a Starter or Basic package and upgrade as their needs grow — we credit your previous investment toward the upgrade where applicable.' },
  { q: 'Do prices include hosting and domain?', a: 'Website packages cover design and development. Domain registration and hosting are billed separately at cost, or we can recommend and set this up for you.' },
]

export default function Pricing() {
  const [active, setActive] = useState('graphic')
  const data = DATA_MAP[active]

  return (
    <PageWrapper>
      <SEO
        title="Pricing — Transparent Web & Design Costs in Kenya"
        description="Full Royal Graphix price list for Kenya — graphic design, church media packages, event branding, websites, maintenance, and mobile apps. All prices in KES."
        keywords="web design cost Kenya, logo design price Kenya, church media package Kenya, website pricing Nairobi, graphic design rates Kenya, mobile app development cost Kenya"
        path="/pricing"
      />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '46vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={HERO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.85) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 70% at 75% 50%, rgba(200,16,46,0.1) 0%, transparent 70%)' }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', padding: 'calc(var(--nav-h) + 3rem) clamp(1.25rem,5vw,4.5rem) 4rem' }}>
          <span className="section-tag">Pricing</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem,5.5vw,4rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '1.1rem' }}>
            Simple,<br />
            <span style={{ background: 'linear-gradient(135deg,#C8102E,#FF4060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Transparent Pricing
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.75, maxWidth: 520 }}>
            No hidden fees. No surprise invoices. Six service categories, all priced clearly in Kenyan Shillings.
          </p>
        </motion.div>
      </section>

      {/* Category Tabs */}
      <section style={{ background: 'var(--bg2)', paddingTop: 'clamp(3rem,6vw,4.5rem)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,4.5rem)' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '0.5rem' }}>
            {PRICING_CATEGORIES.map(cat => {
              const Icon = ICON_MAP[cat.icon] || Tag
              const isActive = active === cat.key
              return (
                <button
                  key={cat.key}
                  onClick={() => setActive(cat.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '0.7rem 1.25rem', borderRadius: '100px',
                    border: `1.5px solid ${isActive ? 'var(--red)' : 'var(--border-med)'}`,
                    background: isActive ? 'var(--red)' : 'var(--surface)',
                    color: isActive ? 'white' : 'var(--text)',
                    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'var(--font-body)', transition: 'all 0.25s',
                    boxShadow: isActive ? '0 4px 16px var(--red-glow)' : 'none',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--red)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-med)' }}
                >
                  <Icon size={15} strokeWidth={2} />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Active Category Content */}
      <section style={{ padding: '2.5rem clamp(1.25rem,5vw,4.5rem) clamp(5rem,9vw,8rem)', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
                {data.intro}
              </p>

              {data.type === 'list' ? (
                <PriceListTable items={data.items} />
              ) : data.type === 'growth' ? (
                <GrowthSection items={data.items} />
              ) : (
                <motion.div variants={staggerContainer} initial="initial" animate="animate"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {data.items.map(plan => (
                    <PricingCard key={plan.name} plan={plan} />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Custom quote */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ background: 'var(--surface)', border: '1px solid var(--border-med)', borderRadius: 'var(--radius-xl)', padding: 'clamp(2rem,4vw,3rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginTop: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageCircle size={26} color="var(--red)" strokeWidth={1.6} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.3rem' }}>Need something custom?</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 440 }}>
                  Every project is unique. Tell us about yours and we'll craft a tailored proposal within 24 hours — no obligation.
                </p>
              </div>
            </div>
            <Link to="/contact" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <button style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 16px var(--red-glow)', transition: 'all 0.25s', whiteSpace: 'nowrap' }}>
                Request Custom Quote →
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--bg)', padding: 'clamp(5rem,9vw,8rem) clamp(1.25rem,5vw,4.5rem)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-tag" style={{ textAlign: 'center' }}>FAQ</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>Common Questions</h2>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQ.map((faq, i) => (
              <FAQItem key={i} faq={faq} i={i} />
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </PageWrapper>
  )
}

// ── À la carte price list table (Graphic Design) ────────────────────────────
function PriceListTable({ items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        maxWidth: 760, margin: '0 auto',
      }}
    >
      {items.map((item, i) => (
        <div key={item.name}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.1rem 1.5rem',
            borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Check size={15} color="var(--red)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text)' }}>{item.name}</span>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--red)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
            {item.price}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

// ── Package card (Church, Event, Website, Maintenance, Mobile, Marketing) ───
function PricingCard({ plan }) {
  const badgeLabel = plan.badge || (plan.featured ? 'Popular' : null)
  return (
    <motion.div variants={staggerItem} whileHover={{ y: -8 }}>
      <div style={{
        background: 'var(--surface)',
        border: `2px solid ${plan.featured ? 'var(--red)' : 'var(--border-med)'}`,
        borderRadius: 'var(--radius-xl)', padding: '2rem',
        position: 'relative', overflow: 'hidden', height: '100%',
        display: 'flex', flexDirection: 'column',
        boxShadow: plan.featured ? '0 12px 48px var(--red-glow)' : '0 4px 24px rgba(0,0,0,0.08)',
        transition: 'all 0.3s',
      }}>
        {badgeLabel && (
          <div style={{ position: 'absolute', top: 22, right: -32, background: 'var(--red)', color: 'white', fontSize: '0.62rem', fontWeight: 700, padding: '5px 48px', transform: 'rotate(45deg)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {badgeLabel}
          </div>
        )}
        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: 'var(--red)', marginBottom: '1rem' }}>
          {plan.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: '0.2rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {plan.price}
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: plan.tagline ? '0.6rem' : '1.5rem', paddingBottom: plan.tagline ? 0 : '1.5rem', borderBottom: plan.tagline ? 'none' : '1px solid var(--border)' }}>
          {plan.period}
        </div>
        {plan.tagline && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)', lineHeight: 1.5 }}>
            {plan.tagline}
          </div>
        )}
        <ul style={{ listStyle: 'none', marginBottom: plan.note ? '1rem' : '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {plan.features.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: '0.85rem', color: f.endsWith(',') ? 'var(--text)' : 'var(--text-muted)', fontWeight: f.endsWith(',') ? 600 : 400, lineHeight: 1.5 }}>
              {!f.endsWith(',') && <Check size={13} color="var(--red)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />}
              {f}
            </li>
          ))}
        </ul>
        {plan.note && (
          <div style={{ background: 'rgba(200,16,46,0.05)', border: '1px solid rgba(200,16,46,0.15)', borderRadius: 8, padding: '0.6rem 0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {plan.note}
          </div>
        )}
        <Link to="/contact" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            background: plan.featured ? 'var(--red)' : 'transparent',
            color: plan.featured ? 'white' : 'var(--text)',
            border: `1px solid ${plan.featured ? 'var(--red)' : 'var(--border-med)'}`,
            padding: '0.75rem', borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-body)', transition: 'all 0.25s',
            boxShadow: plan.featured ? '0 4px 16px var(--red-glow)' : 'none',
          }}>
            Get Started →
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

// ── Growth Section: Business Growth + Business Partner ──────────────────────
function GrowthSection({ items }) {
  // Split: first 3 are Business Growth Packages, last 1 is Business Partner
  const growthPlans  = items.slice(0, 3)
  const partnerPlan  = items[3]

  return (
    <div>
      {/* Business Growth Packages sub-heading */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ display: 'inline-block', padding: '3px 14px', borderRadius: 100, background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.2)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--red)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Business Growth Packages
        </span>
      </div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {growthPlans.map(plan => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </motion.div>

      {/* Royal Graphix Business Partner */}
      {partnerPlan && (
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ display: 'inline-block', padding: '3px 14px', borderRadius: 100, background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.2)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--red)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Royal Graphix Business Partner
            </span>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, var(--surface) 0%, rgba(200,16,46,0.04) 100%)',
            border: '2px solid var(--red)',
            borderRadius: 'var(--radius-xl)', padding: 'clamp(2rem,4vw,3rem)',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 16px 64px var(--red-glow)',
          }}>
            {/* Decorative bg circle */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(200,16,46,0.06)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', position: 'relative', zIndex: 1 }}>
              {/* Left: info */}
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                  <span style={{ padding: '4px 14px', borderRadius: 100, background: 'var(--red)', color: 'white', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {partnerPlan.badge}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                  {partnerPlan.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 420 }}>
                  {partnerPlan.tagline}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--red)' }}>
                    {partnerPlan.price}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{partnerPlan.period}</div>
              </div>

              {/* Right: features grid */}
              <div style={{ flex: 1, minWidth: 240 }}>
                <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '0.55rem' }}>
                  {partnerPlan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      <Check size={13} color="var(--red)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.9rem 2.5rem', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 6px 24px var(--red-glow)', transition: 'all 0.25s' }}>
                  Become a Business Partner →
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Growth CTA */}
      <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ marginTop: '4rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border-med)', borderRadius: 'var(--radius-xl)', padding: 'clamp(3rem,5vw,5rem) clamp(1.5rem,4vw,3rem)' }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
          Ready to Grow<br />
          <span style={{ background: 'linear-gradient(135deg,#C8102E,#FF4060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Your Business?
          </span>
        </motion.h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 580, margin: '0 auto 2.5rem', letterSpacing: '0.01em' }}>
          Let Royal Graphix handle your branding, marketing, website, content creation, and lead generation while you focus on running your business.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.9rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 6px 24px var(--red-glow)', transition: 'all 0.25s' }}>
              Get Free Consultation →
            </button>
          </Link>
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'transparent', color: 'var(--text)', border: '1.5px solid var(--border-med)', padding: '0.9rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text)' }}>
              Request a Quote
            </button>
          </Link>
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'transparent', color: 'var(--text-muted)', border: '1.5px solid var(--border)', padding: '0.9rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
              Contact Us
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

function FAQItem({ faq, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem 1.75rem', transition: 'border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-med)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.975rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ color: 'var(--red)', fontSize: '0.9rem', flexShrink: 0, marginTop: 1 }}>▸</span>
        {faq.q}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.75, paddingLeft: 22 }}>{faq.a}</p>
    </motion.div>
  )
}

import SEO from '@/components/seo/SEO'
import { Grid } from 'lucide-react'
import { motion } from 'framer-motion'
import PageWrapper from '@/components/ui/PageWrapper'
import PortfolioSection from '@/components/sections/PortfolioSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTABanner from '@/components/sections/CTABanner'
import { usePortfolio } from '@/hooks/usePortfolio'

const HERO_IMG = 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1600&q=80&fit=crop'

export default function Portfolio() {
  const { items, loading } = usePortfolio()

  return (
    <PageWrapper>
      <SEO
        title="Our Portfolio — 10+ Live Projects"
        description="See 10+ real websites and digital projects built by Royal Graphix for businesses across Kenya — including churches, NGOs, research firms, travel, finance, and real estate."
        keywords="Royal Graphix portfolio, website examples Kenya, web design case studies, Kenyan business websites"
        path="/portfolio"
      />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '52vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={HERO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.8) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 80% at 80% 50%, rgba(200,16,46,0.1) 0%, transparent 65%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', padding: 'calc(var(--nav-h) + 4rem) clamp(1.25rem,5vw,4.5rem) 5rem' }}
        >
          <span className="section-tag">Our Work</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.8rem,6vw,4.5rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '1.25rem' }}>
            Work That<br />
            <span style={{ background: 'linear-gradient(135deg,#C8102E,#FF4060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Speaks for Itself
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 520 }}>
            150+ projects across web design, branding, graphics, and SEO. Filter by category to explore our work.
          </p>
          {/* Stats row */}
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {[['150+','Projects'],['8','Categories'],['40+','Clients'],['98%','Satisfaction']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Portfolio Grid */}
      <section style={{ background: 'var(--bg)' }}>
        <PortfolioSection items={items} loading={loading} preview={false} />
      </section>

      <TestimonialsSection />
      <CTABanner />
    </PageWrapper>
  )
}

import SEO from '@/components/seo/SEO'
import { Check, ArrowRight, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageWrapper from '@/components/ui/PageWrapper'
import ServicesSection from '@/components/sections/ServicesSection'
import ProcessSection from '@/components/sections/ProcessSection'
import CTABanner from '@/components/sections/CTABanner'
import { PRICING_PLANS } from '@/lib/constants'
import { staggerContainer, staggerItem } from '@/lib/motion'

const HERO_IMG = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&q=80&fit=crop'

export default function Services() {
  return (
    <PageWrapper>
      <SEO
        title="Web Design, Graphic Design & Branding Services"
        description="Explore Royal Graphix's full range of services: web design, graphic design, branding, UI/UX design, and SEO. Get a custom quote for your project today."
        keywords="web design services Kenya, graphic design services, branding services Nairobi, UI UX design, SEO services Kenya"
        path="/services"
      />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '52vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={HERO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.82) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(200,16,46,0.1) 0%, transparent 65%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', padding: 'calc(var(--nav-h) + 4rem) clamp(1.25rem,5vw,4.5rem) 5rem' }}
        >
          <span className="section-tag">Services</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.8rem,6vw,4.5rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '1.25rem', maxWidth: 700 }}>
            Full-Service<br />
            <span style={{ background: 'linear-gradient(135deg,#C8102E,#FF4060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Creative Agency
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 520, marginBottom: '2rem' }}>
            From brand strategy to web development and SEO — every touchpoint of your digital presence, handled with precision.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 8px 28px var(--red-glow)' }}>
                Get a Free Quote →
              </motion.button>
            </Link>
            <Link to="/portfolio" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                style={{ background: 'rgba(255,255,255,0.07)', color: 'white', border: '1px solid rgba(255,255,255,0.18)', padding: '0.8rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', backdropFilter: 'blur(10px)' }}>
                View Portfolio
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Services grid */}
      <ServicesSection preview={false} />

      {/* Process */}
      <ProcessSection />

      {/* Pricing */}
      <section style={{ padding: 'clamp(5rem,9vw,8rem) 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,4.5rem)' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-tag" style={{ textAlign: 'center' }}>Pricing</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Website Packages
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0.75rem auto 0', lineHeight: 1.7 }}>
              We also offer graphic design, church media, event branding, maintenance, and mobile app pricing on our full <Link to="/pricing" style={{ color: 'var(--red)', fontWeight: 600 }}>Pricing page</Link>.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {PRICING_PLANS.map(plan => (
              <motion.div key={plan.name} variants={staggerItem} whileHover={{ y: -6 }}>
                <div style={{
                  background: 'var(--surface)', border: `1px solid ${plan.featured ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-xl)', padding: '2.25rem', position: 'relative', overflow: 'hidden',
                  height: '100%', display: 'flex', flexDirection: 'column',
                  boxShadow: plan.featured ? '0 8px 40px var(--red-glow)' : 'none',
                  transition: 'box-shadow 0.3s',
                }}>
                  {plan.featured && (
                    <div style={{ position: 'absolute', top: 20, right: -30, background: 'var(--red)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '5px 46px', transform: 'rotate(45deg)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Popular
                    </div>
                  )}
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--red)', marginBottom: '1rem' }}>{plan.name}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.3rem' }}>{plan.price}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>{plan.period}</div>
                  <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', padding: '0.45rem 0', color: 'var(--text-muted)', lineHeight: 1.5, borderBottom: '1px solid var(--border)' }}>
                        <Check size={14} color='var(--red)' strokeWidth={2.5} style={{flexShrink:0,marginTop:1}} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" style={{ textDecoration: 'none' }}>
                    <button style={{ width: '100%', background: plan.featured ? 'var(--red)' : 'transparent', color: plan.featured ? 'white' : 'var(--text)', border: `1px solid ${plan.featured ? 'var(--red)' : 'var(--border-med)'}`, padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.25s', boxShadow: plan.featured ? '0 4px 16px var(--red-glow)' : 'none' }}>
                      Get Started →
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTABanner />
    </PageWrapper>
  )
}

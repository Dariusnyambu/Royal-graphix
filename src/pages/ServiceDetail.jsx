import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Monitor, Code2, LayoutGrid, Palette, Megaphone, Search, PenTool, Layout,
  CheckCircle2, XCircle, ArrowRight, Star, ChevronDown,
} from 'lucide-react'
import SEO from '@/components/seo/SEO'
import PageWrapper from '@/components/ui/PageWrapper'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import CTABanner from '@/components/sections/CTABanner'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useReviews } from '@/hooks/useReviews'
import { SERVICE_PAGES } from '@/lib/serviceContent'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { serviceSchema, breadcrumbSchema, faqSchema } from '@/lib/schema'
import { useState } from 'react'

const ICONS = { Monitor, Code2, LayoutGrid, Palette, Megaphone, Search, PenTool, Layout }
const HERO_IMG = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80&fit=crop'

export default function ServiceDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const service = SERVICE_PAGES[slug]
  const { items: portfolioItems } = usePortfolio()
  const { reviews } = useReviews()

  if (!service) {
    return (
      <PageWrapper>
        <SEO title="Service Not Found" description="This service page could not be found." noindex />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>Service Not Found</h1>
          <button onClick={() => navigate('/services')} style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            View All Services
          </button>
        </div>
      </PageWrapper>
    )
  }

  const Icon = ICONS[service.icon] || Monitor
  const relatedPortfolio = portfolioItems.filter(p => p.category === service.portfolioCategory).slice(0, 3)
  const relatedServices = (service.relatedSlugs || []).map(s => SERVICE_PAGES[s]).filter(Boolean)
  const topReviews = reviews.slice(0, 2)

  const jsonLd = [
    serviceSchema({ name: service.h1, description: service.metaDescription, path: `/services/${service.slug}`, category: service.portfolioCategory }),
    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: service.h1, path: `/services/${service.slug}` }]),
  ]
  const faqLd = faqSchema(service.faqs)
  if (faqLd) jsonLd.push(faqLd)

  return (
    <PageWrapper>
      <SEO
        title={service.metaTitle}
        description={service.metaDescription}
        path={`/services/${service.slug}`}
        keywords={`${service.h1}, Royal Graphix, ${service.portfolioCategory}, Kenya`}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '46vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={HERO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.85) 100%)' }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', padding: 'calc(var(--nav-h) + 3rem) clamp(1.25rem,5vw,4.5rem) 4rem' }}>
          <Breadcrumbs dark items={[{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: service.h1 }]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.25rem' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(200,16,46,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={24} color="var(--red)" strokeWidth={1.8} />
            </div>
            <span className="section-tag">Services</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem', maxWidth: 720 }}>
            {service.h1}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 620, lineHeight: 1.8, fontSize: '1.02rem', marginBottom: '1.75rem' }}>{service.intro}</p>
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.85rem 1.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--red-glow)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Start Your Project <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Problems / Benefits */}
      <section style={{ padding: 'clamp(4rem,7vw,5.5rem) clamp(1.25rem,5vw,4.5rem)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>{service.challengesHeading || 'Common Challenges'}</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, listStyle: 'none', padding: 0, margin: 0 }}>
              {service.problems.map((p, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <XCircle size={17} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>What You Get</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, listStyle: 'none', padding: 0, margin: 0 }}>
              {service.benefits.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <CheckCircle2 size={17} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section style={{ padding: 'clamp(3rem,6vw,4.5rem) clamp(1.25rem,5vw,4.5rem)', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.75rem' }}>What&rsquo;s Included</h2>
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {service.included.map((item, i) => (
              <motion.div key={i} variants={staggerItem} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.1rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: 'clamp(4rem,7vw,5.5rem) clamp(1.25rem,5vw,4.5rem)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>How We Work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {service.process.map((step, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'rgba(200,16,46,0.25)', marginBottom: '0.5rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Portfolio */}
      {relatedPortfolio.length > 0 && (
        <section style={{ padding: 'clamp(4rem,7vw,5.5rem) clamp(1.25rem,5vw,4.5rem)', background: 'var(--bg2)' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Related Work</h2>
              <Link to="/portfolio" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--red)', textDecoration: 'none' }}>View Full Portfolio →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {relatedPortfolio.map(p => (
                <Link key={p.id} to={p.slug ? `/portfolio/${p.slug}` : '/portfolio'} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'transform 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                    <div style={{ height: 170, overflow: 'hidden', background: 'var(--bg2)' }}>
                      {p.image_url
                        ? <img src={p.image_url} alt={p.image_alt || `${p.title} — ${service.h1} project by Royal Graphix`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{p.emoji}</div>
                      }
                    </div>
                    <div style={{ padding: '1.1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text)' }}>{p.title}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{p.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {topReviews.length > 0 && (
        <section style={{ padding: 'clamp(3rem,6vw,4.5rem) clamp(1.25rem,5vw,4.5rem)', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.75rem' }}>What Clients Say</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {topReviews.map(r => (
                <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: '0.75rem' }}>
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} strokeWidth={0} fill={i < r.rating ? '#f59e0b' : 'var(--border-med)'} />)}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '0.9rem' }}>&ldquo;{r.message}&rdquo;</p>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{r.name}{r.role ? ` — ${r.role}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section style={{ padding: 'clamp(4rem,7vw,5.5rem) clamp(1.25rem,5vw,4.5rem)', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.75rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {service.faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section style={{ padding: '0 clamp(1.25rem,5vw,4.5rem) clamp(4rem,7vw,5.5rem)', background: 'var(--bg2)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Related Services</h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {relatedServices.map(rs => (
                <Link key={rs.slug} to={`/services/${rs.slug}`} style={{ textDecoration: 'none' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.6rem 1.1rem', borderRadius: 100, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                    {rs.h1.split(' ').slice(0, 3).join(' ')} <ArrowRight size={13} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </PageWrapper>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)' }}>
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)' }}>{q}</span>
        <ChevronDown size={16} color="var(--text-muted)" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && <p style={{ padding: '0 1.25rem 1.1rem', fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{a}</p>}
    </div>
  )
}

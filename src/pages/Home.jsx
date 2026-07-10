import { Link } from 'react-router-dom'
import SEO from '@/components/seo/SEO'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import PageWrapper from '@/components/ui/PageWrapper'
import HomeSlider from '@/components/sections/HomeSlider'
import ServicesSection from '@/components/sections/ServicesSection'
import PortfolioSection from '@/components/sections/PortfolioSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTABanner from '@/components/sections/CTABanner'
import { usePortfolio } from '@/hooks/usePortfolio'
import { BLOG_POSTS } from '@/lib/constants'
import { staggerContainer, staggerItem } from '@/lib/motion'

const BG_MAP = {
  'Web Design':'#0d1a2e','SEO':'#0a0a1a','Branding':'#1a0a0e',
  'UI/UX':'#1a1a0a','Development':'#0a0f1a','Graphics':'#1a0a14',
}

export default function Home() {
  const { items, loading } = usePortfolio()

  return (
    <PageWrapper>
      <SEO
        title="Creative Digital Agency in Nairobi, Kenya"
        description="Royal Graphix is Nairobi's premier creative digital agency. We design websites, build brands, and grow businesses through web design, graphic design, branding, UI/UX, and SEO."
        keywords="web design Nairobi, graphic design Kenya, branding agency, logo design Nairobi, website development Kenya, digital agency Kenya"
        path="/"
      />

      {/* ── Hero Slider ── */}
      <HomeSlider />

      {/* ── Services ── */}
      <ServicesSection preview />

      {/* ── Portfolio ── */}
      <section style={{ background: 'var(--bg)', padding: 'clamp(5rem,9vw,8rem) 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 clamp(1.25rem,5vw,4.5rem)', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="section-tag">Our Work</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Portfolio <span style={{ color: 'var(--red)' }}>Highlights</span>
              </h2>
              <div className="divider" style={{ marginTop: '1.25rem' }} />
            </motion.div>
            <Link to="/portfolio" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ gap: '10px' }}
                style={{ background: 'transparent', border: '1px solid var(--border-med)', borderRadius: 'var(--radius-sm)', padding: '0.55rem 1.25rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                All Projects <ArrowRight size={14} strokeWidth={2} />
              </motion.button>
            </Link>
          </div>
          <PortfolioSection items={items} loading={loading} preview />
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── Blog Preview ── */}
      <section style={{ background: 'var(--bg2)', padding: 'clamp(5rem,9vw,8rem) 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,4.5rem)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="section-tag">From Our Blog</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
                Latest <span style={{ color: 'var(--red)' }}>Insights</span>
              </h2>
            </motion.div>
            <Link to="/blog" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'transparent', border: '1px solid var(--border-med)', borderRadius: 'var(--radius-sm)', padding: '0.55rem 1.25rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >All Articles →</button>
            </Link>
          </div>

          <motion.div
            variants={staggerContainer} initial="initial" whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}
          >
            {BLOG_POSTS.slice(0, 3).map(post => (
              <motion.div key={post.id} variants={staggerItem}>
                <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <article
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '100%', transition: 'all 0.3s var(--ease)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    {/* Thumbnail */}
                    <div style={{ height: 190, overflow: 'hidden', position: 'relative', background: BG_MAP[post.category] || '#111' }}>
                      {post.image
                        ? <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>{post.emoji}</div>
                      }
                      <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
                        <span style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(200,16,46,0.85)', backdropFilter: 'blur(8px)', fontSize: '0.68rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>{post.readTime} · {post.date}</div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, lineHeight: 1.35, color: 'var(--text)', marginBottom: '0.5rem' }}>{post.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{post.excerpt}</p>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTABanner />
    </PageWrapper>
  )
}

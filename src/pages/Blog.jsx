import { useState } from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '@/components/seo/SEO'
import { motion } from 'framer-motion'
import PageWrapper from '@/components/ui/PageWrapper'
import { BLOG_POSTS } from '@/lib/constants'
import { staggerContainer, staggerItem } from '@/lib/motion'

const HERO_IMG  = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80&fit=crop'
const CATS = ['All', ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))]
const BG_MAP = { 'Web Design':'#0d1a2e','SEO':'#0a0a1a','Branding':'#1a0a0e','UI/UX':'#1a1a0a','Development':'#0a0f1a','Graphics':'#1a0a14' }
// Fallback colours if image fails to load
const CAT_CLR = { 'Web Design':'#3b82f6','SEO':'#10b981','Branding':'#C8102E','UI/UX':'#8b5cf6','Development':'#f59e0b','Graphics':'#ec4899' }

export default function Blog() {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.category === cat)

  return (
    <PageWrapper>
      <SEO
        title="Blog — Design, Web & Marketing Insights"
        description="Tips and insights on web design trends, SEO strategy, branding, and UI/UX design from the Royal Graphix team."
        keywords="web design blog, SEO tips Kenya, branding guide, digital marketing blog Kenya"
        path="/blog"
      />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '48vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={HERO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.82) 100%)' }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', padding: 'calc(var(--nav-h) + 4rem) clamp(1.25rem,5vw,4.5rem) 5rem' }}>
          <span className="section-tag">Blog & Insights</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.8rem,6vw,4.5rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '1.25rem' }}>
            Insights for<br />
            <span style={{ background: 'linear-gradient(135deg,#C8102E,#FF4060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Creative Minds
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 500 }}>
            Design tips, SEO playbooks, branding guides, and industry insights — crafted by the Royal Graphix team.
          </p>
        </motion.div>
      </section>

      {/* Posts */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4.5rem)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {CATS.map(c => (
              <motion.button key={c} onClick={() => setCat(c)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ padding: '0.45rem 1.1rem', borderRadius: '100px', fontSize: '0.83rem', fontWeight: 600, border: '1px solid', fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all 0.2s', borderColor: cat === c ? 'var(--red)' : 'var(--border-med)', background: cat === c ? 'var(--red)' : 'transparent', color: cat === c ? 'white' : 'var(--text-muted)', boxShadow: cat === c ? '0 4px 14px var(--red-glow)' : 'none' }}>
                {c}
              </motion.button>
            ))}
          </div>

          {/* Featured post (first item) */}
          {filtered.length > 0 && cat === 'All' && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: '2.5rem' }}>
              <Link to={`/blog/${filtered[0].slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>
                  <div style={{ height: 320, position: 'relative', overflow: 'hidden', background: BG_MAP[filtered[0].category] || '#111' }}>
                    {filtered[0].image
                      ? <img src={filtered[0].image} alt={filtered[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>{filtered[0].emoji}</div>
                    }
                    <div style={{ position: 'absolute', top: 16, left: 16, padding: '4px 12px', borderRadius: 100, background: 'rgba(200,16,46,0.85)', backdropFilter: 'blur(8px)', fontSize: '0.68rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Featured
                    </div>
                  </div>
                  <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: CAT_CLR[filtered[0].category] || 'var(--red)', marginBottom: '0.75rem', display: 'block' }}>{filtered[0].category} · {filtered[0].readTime}</span>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1rem', color: 'var(--text)' }}>{filtered[0].title}</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.95rem' }}>{filtered[0].excerpt}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', fontWeight: 700, color: 'var(--red)' }}>Read Article →</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid */}
          <motion.div key={cat} variants={staggerContainer} initial="initial" animate="animate"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
            {(cat === 'All' ? filtered.slice(1) : filtered).map(post => (
              <motion.div key={post.id} variants={staggerItem}>
                <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <article style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '100%', transition: 'all 0.3s var(--ease)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ height: 200, position: 'relative', overflow: 'hidden', background: BG_MAP[post.category] || '#111' }}>
                      {post.image
                        ? <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>{post.emoji}</div>
                      }
                      <div style={{ position: 'absolute', top: 12, left: 14, padding: '3px 10px', borderRadius: 100, background: `${CAT_CLR[post.category] || 'var(--red)'}22`, border: `1px solid ${CAT_CLR[post.category] || 'var(--red)'}44`, fontSize: '0.68rem', fontWeight: 700, color: CAT_CLR[post.category] || 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {post.category}
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>{post.readTime} · {post.date}</div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text)', marginBottom: '0.6rem' }}>{post.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.25rem' }}>{post.excerpt}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(200,16,46,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: 'var(--red)' }}>RG</div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{post.author}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}

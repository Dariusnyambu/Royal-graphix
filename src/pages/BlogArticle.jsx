import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import DOMPurify from 'dompurify'
import SEO from '@/components/seo/SEO'
import { motion } from 'framer-motion'
import PageWrapper from '@/components/ui/PageWrapper'
import { useBlogPost, useBlog } from '@/hooks/useBlog'

const BG_MAP = { 'Web Design': '#1a0a0e', 'SEO': '#0a0a1a', 'Branding': '#0a1a0a', 'UI/UX': '#1a1a0a', 'Development': '#0a0f1a', 'Graphics': '#1a0a14' }

function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function BlogArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { post, loading, notFound } = useBlogPost(slug)
  const { posts: allPosts } = useBlog()

  if (loading) {
    return (
      <PageWrapper>
        <div style={{ minHeight: '60vh' }} />
      </PageWrapper>
    )
  }

  if (notFound || !post) {
    return (
      <PageWrapper>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>Article Not Found</h1>
          <button onClick={() => navigate('/blog')} style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--red-glow)' }}>Back to Blog</button>
        </div>
      </PageWrapper>
    )
  }

  const rawContent = post.content || ''
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(rawContent)
  const paragraphs = isHtml ? [] : rawContent.split(/\n\s*\n/).filter(Boolean)
  const related = allPosts.filter(p => p.id !== post.id).slice(0, 3)

  return (
    <PageWrapper>
      <SEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.cover_image || undefined}
        type="article"
        keywords={`${post.category}, Royal Graphix blog, ${post.title}`}
      />

      {/* Article Hero */}
      <section style={{ background: 'var(--bg2)', padding: 'clamp(5rem,8vw,7rem) clamp(1rem,5vw,4rem) clamp(3rem,5vw,4rem)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link to="/blog" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 8,
              padding: '6px 14px', fontSize: '0.82rem', color: 'var(--text-muted)',
              cursor: 'pointer', marginBottom: '2rem', fontFamily: 'var(--font-body)',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              ← Back to Blog
            </button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red)', display: 'block', marginBottom: '0.75rem' }}>
              {post.category} · {post.read_time}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(200,16,46,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--red)' }}>
                RG
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {post.author} · {fmtDate(post.published_at || post.created_at)}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Banner */}
      <div style={{ height: 400, position: 'relative', overflow: 'hidden' }}>
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: BG_MAP[post.category] || '#0a0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>
            {post.emoji}
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 60%, var(--bg) 100%)' }} />
      </div>

      {/* Article Body */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ maxWidth: 760, margin: '0 auto', padding: '3rem clamp(1rem,5vw,4rem)' }}
      >
        {/* Lead */}
        {post.excerpt && (
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem', fontStyle: 'italic', borderLeft: '3px solid var(--red)', paddingLeft: '1.25rem' }}>
            {post.excerpt}
          </p>
        )}

        {/* Body — rich HTML for posts written in the new editor, plain-paragraph fallback for legacy posts */}
        {isHtml ? (
          <div className="rich-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rawContent, { ADD_TAGS: ['iframe'], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target', 'rel'] }) }} />
        ) : (
          paragraphs.map((para, i) => (
            <p key={i} style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1.25rem', fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {para}
            </p>
          ))
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ padding: '3px 10px', borderRadius: 100, background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Found this helpful? Share it with your network.
          </p>
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--red-glow)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>Work With Us <ArrowRight size={14} strokeWidth={2} /></button>
          </Link>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              More Articles
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {related.map(r => (
                <Link key={r.id} to={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '1.25rem', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
                  >
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{r.emoji}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--red)', marginBottom: '0.4rem' }}>
                      {r.category}
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text)' }}>
                      {r.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.article>
    </PageWrapper>
  )
}

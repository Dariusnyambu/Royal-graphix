import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import SEO from '@/components/seo/SEO'
import { motion } from 'framer-motion'
import PageWrapper from '@/components/ui/PageWrapper'
import { BLOG_POSTS } from '@/lib/constants'

const ARTICLE_CONTENT = {
  'b1': {
    sections: [
      { heading: '1. Bento Grid Layouts', body: 'Inspired by Japanese bento boxes, asymmetric grid layouts are replacing the traditional card grid. They create strong visual hierarchy while breathing life into static pages — each cell a deliberate design choice, not a template default.' },
      { heading: '2. Variable Fonts & Kinetic Typography', body: 'Variable fonts allow a single font file to behave like an entire family. Combined with scroll-triggered animations, text itself becomes a primary design element — shifting weight, width, and slant as users engage.' },
      { callout: '"Typography is the voice of your brand. In 2025, that voice moves."' },
      { heading: '3. Dark Mode as Default', body: 'Over 82% of users prefer dark mode across apps and websites. Agencies are now designing dark-first, treating light mode as the variant — not the other way around. The aesthetic shift is real and here to stay.' },
      { heading: '4. AI-Assisted Design Workflows', body: 'Tools like Figma AI and Adobe Firefly are being integrated into real agency workflows — not to replace designers, but to accelerate iteration by 60%. Concept to polished comp in hours, not days.' },
      { list: ['Scroll-triggered reveals on hero sections', 'Single animated CTA per page', 'Smooth page transitions over micro-animations', 'Intentional whitespace over element density'] },
      { heading: '5. Glassmorphism 2.0', body: 'The original glassmorphism trend peaked and crashed. In 2025, it\'s back — refined, purposeful, and paired with dark backgrounds and deep blur values. When done right, it elevates without overwhelming.' },
    ]
  },
  'b2': {
    sections: [
      { heading: 'The 90-Day SEO Framework', body: 'We\'ve used this exact framework across 12 clients in the past year, consistently achieving 5–10x organic traffic growth. The secret? Treating SEO as a compound investment, not a one-time fix.' },
      { heading: 'Month 1: Technical Foundation', body: 'Before creating a single piece of content, we audit the technical infrastructure. A site with crawl errors, slow Core Web Vitals, or duplicate content cannot rank regardless of content quality. Fix the foundation first.' },
      { list: ['Full technical SEO audit (Core Web Vitals, sitemap, robots.txt)', 'Keyword gap analysis vs. top 3 competitors', 'On-page optimization of existing top-20 ranking pages', 'Schema markup implementation'] },
      { callout: '"60% of SEO wins come from fixing what\'s broken, not from creating new content."' },
      { heading: 'Month 2: Content Velocity', body: 'With a clean foundation, we publish 8–12 well-researched, long-form articles targeting transactional and informational keywords at different funnel stages. Quality always beats quantity — every article must deserve to be the best result for its keyword.' },
      { heading: 'Month 3: Authority Building', body: 'By month three, content is indexed and starting to rank. Now we amplify with strategic link building: guest posts, HARO responses, and digital PR campaigns that earn genuine, high-DA backlinks.' },
    ]
  },
  'b3': {
    sections: [
      { heading: 'What Makes a Brand Identity Complete?', body: 'Most businesses think a logo is a brand. It isn\'t. A brand is the entire emotional and visual language a company uses to communicate who it is. The logo is just one piece of a much larger system.' },
      { heading: 'Core Visual Elements', body: 'Every strong brand identity starts with a clearly defined visual system that works across all touchpoints — digital, print, and physical.' },
      { list: ['Logo suite — primary, secondary, icon mark, wordmark', 'Color palette — primary (1–2 colors), secondary (2–3), neutrals', 'Typography system — display, body, and UI fonts', 'Iconography style — outline, filled, or custom illustration', 'Photography / image style — mood board and usage rules'] },
      { callout: '"A brand without guidelines is a brand without consistency. Consistency is trust."' },
      { heading: 'Brand Voice & Messaging', body: 'Visual identity gets attention. Voice keeps it. Define your brand personality across four dimensions: formal vs. casual, playful vs. serious, enthusiastic vs. matter-of-fact, and traditional vs. modern.' },
      { heading: 'Application Templates', body: 'A brand identity is only complete when proven across real assets — business cards, email signatures, social media templates, pitch deck master, and marketing collateral. These prove the brand works in the real world, not just in Figma.' },
    ]
  },
  'b4': {
    sections: [
      { heading: 'The Business Case for UX Investment', body: 'Every dollar invested in UX returns $100 on average according to Forrester Research. That\'s a 9,900% ROI. Yet most businesses still treat design as decoration rather than a revenue driver.' },
      { heading: 'Case Study 1: E-commerce Checkout Redesign', body: 'A Nairobi-based fashion retailer was losing 78% of users at checkout. After a UX audit, we identified 6 friction points — a 5-step form, hidden shipping costs, and no guest checkout. After redesigning to a 2-step flow with transparent pricing, cart abandonment dropped 52% and monthly revenue increased by $14,000.' },
      { callout: '"The best UX is invisible. Users shouldn\'t notice the design — they should just accomplish their goal effortlessly."' },
      { heading: 'Case Study 2: SaaS Onboarding', body: 'A B2B SaaS product had 30% day-7 retention. We redesigned the onboarding flow with contextual tooltips, a progress indicator, and deferred feature introduction. Day-7 retention jumped to 61% within 6 weeks of launch.' },
      { heading: 'Where to Start', body: 'Run a UX audit on your highest-traffic, lowest-converting page. That single page likely holds the biggest ROI opportunity in your entire business. Fix that first, measure, then expand.' },
    ]
  },
  'b5': {
    sections: [
      { heading: 'The Stack Question Every Developer Faces', body: 'You need a backend. You don\'t want to manage servers. You\'ve heard of both Supabase and Firebase — but which one is right for your 2025 project? After building with both extensively, here\'s our honest take.' },
      { heading: 'Supabase: Postgres-Powered & Open Source', body: 'Supabase is built on PostgreSQL — the world\'s most advanced open-source relational database. It\'s self-hostable, fully open source, and uses standard SQL. Your data is never locked in.' },
      { list: ['PostgreSQL with Row Level Security (RLS)', 'Real-time subscriptions via WebSockets', 'Auto-generated REST and GraphQL APIs', 'Built-in Auth, Storage, and Edge Functions', 'Generous free tier — 500MB database, 1GB storage'] },
      { callout: '"If you know SQL, you already know Supabase. That\'s the entire point."' },
      { heading: 'Firebase: Google\'s Battle-Tested Platform', body: 'Firebase has powered some of the world\'s largest apps since 2011. Its NoSQL Firestore excels at real-time sync scenarios, and its ecosystem (FCM, Analytics, Remote Config, App Check) is unmatched for mobile-first applications.' },
      { heading: 'Our Verdict for 2025', body: 'For most new projects — especially those with relational data — we recommend Supabase. The DX is excellent, pricing is transparent, and you avoid vendor lock-in. Choose Firebase if you need deep Google ecosystem integration or are building a heavily real-time mobile app.' },
    ]
  },
  'b6': {
    sections: [
      { heading: 'Why Most Social Media Graphics Fail', body: 'They\'re designed to look good in isolation — not to perform in a feed. The feed is noisy, fast-moving, and unforgiving. Your graphic has roughly 1.7 seconds to earn a stop. Most graphics don\'t come close.' },
      { heading: 'The 3-Second Rule', body: 'Can a stranger identify your brand, understand the value proposition, and feel an emotion — all within 3 seconds? If not, the design fails. Test every single graphic against this rule before publishing. No exceptions.' },
      { callout: '"Design for the scroll, not the gallery. Nobody frames Instagram posts."' },
      { heading: 'Contrast, Not Just Color', body: 'High contrast is the single most effective conversion lever in social design. Dark text on light backgrounds (or vice versa) outperforms low-contrast "aesthetic" designs by 3:1 on click-through rate across our client data spanning 2 years.' },
      { heading: 'Visual Hierarchy in 3 Levels', body: 'Structure every graphic with exactly three information levels — no more, no less.' },
      { list: ['Level 1 (0–1s): The hook — one bold statement or striking image', 'Level 2 (1–2s): The value — what you\'re offering or communicating', 'Level 3 (2–3s): The action — follow, click, save, or share'] },
    ]
  },
}

export default function BlogArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = BLOG_POSTS.find(p => p.slug === slug)

  if (!post) {
    return (
      <PageWrapper>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>Article Not Found</h1>
          <button onClick={() => navigate('/blog')} style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--red-glow)' }}></button>
        </div>
      </PageWrapper>
    )
  }

  const content = ARTICLE_CONTENT[post.id]
  const BG_MAP = { 'Web Design': '#1a0a0e', 'SEO': '#0a0a1a', 'Branding': '#0a1a0a', 'UI/UX': '#1a1a0a', 'Development': '#0a0f1a', 'Graphics': '#1a0a14' }

  return (
    <PageWrapper>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.image || undefined}
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
              
            </button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red)', display: 'block', marginBottom: '0.75rem' }}>
              {post.category} · {post.readTime}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(200,16,46,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--red)' }}>
                RG
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {post.author} · {post.date}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Banner */}
      <div style={{ height: 400, position: 'relative', overflow: 'hidden' }}>
        {post.image ? (
          <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem', fontStyle: 'italic', borderLeft: '3px solid var(--red)', paddingLeft: '1.25rem' }}>
          {post.excerpt}
        </p>

        {/* Sections */}
        {content?.sections.map((section, i) => {
          if (section.heading) return (
            <div key={i}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, margin: '2rem 0 0.75rem', color: 'var(--text)' }}>
                {section.heading}
              </h2>
              {section.body && (
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1.25rem', fontSize: '1rem' }}>
                  {section.body}
                </p>
              )}
            </div>
          )
          if (section.callout) return (
            <blockquote key={i} style={{
              background: 'rgba(200,16,46,0.06)', borderLeft: '3px solid var(--red)',
              padding: '1.25rem 1.5rem', borderRadius: '0 12px 12px 0',
              margin: '1.5rem 0', fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.7,
            }}>
              {section.callout}
            </blockquote>
          )
          if (section.list) return (
            <ul key={i} style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              {section.list.map((item, j) => (
                <li key={j} style={{ marginBottom: '0.4rem' }}>{item}</li>
              ))}
            </ul>
          )
          if (section.body && !section.heading) return (
            <p key={i} style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1.25rem', fontSize: '1rem' }}>
              {section.body}
            </p>
          )
          return null
        })}

        {/* Footer */}
        <div style={{
          marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Found this helpful? Share it with your network.
          </p>
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--red-glow)' }}>Work With Us <ArrowRight size={14} strokeWidth={2}/></button>
          </Link>
        </div>

        {/* Related Posts */}
        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            More Articles
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3).map(related => (
              <Link key={related.id} to={`/blog/${related.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '1.25rem', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{related.emoji}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--red)', marginBottom: '0.4rem' }}>
                    {related.category}
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text)' }}>
                    {related.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.article>
    </PageWrapper>
  )
}

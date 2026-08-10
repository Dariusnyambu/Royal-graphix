import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, CheckCircle2, ArrowRight, Quote } from 'lucide-react'
import SEO from '@/components/seo/SEO'
import PageWrapper from '@/components/ui/PageWrapper'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import CTABanner from '@/components/sections/CTABanner'
import { usePortfolioItem, usePortfolio } from '@/hooks/usePortfolio'
import { SERVICE_PAGES } from '@/lib/serviceContent'
import { creativeWorkSchema, breadcrumbSchema } from '@/lib/schema'

// Map a portfolio category to a service page slug for internal linking.
const CATEGORY_TO_SERVICE_SLUG = {
  'Web Design': 'web-design',
  'Graphic Design': 'graphic-design',
  'Branding': 'branding',
}

export default function PortfolioDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { item, loading, notFound } = usePortfolioItem(slug)
  const { items: allItems } = usePortfolio()

  if (loading) {
    return <PageWrapper><div style={{ minHeight: '60vh' }} /></PageWrapper>
  }

  if (notFound || !item) {
    return (
      <PageWrapper>
        <SEO title="Project Not Found" description="This case study could not be found." noindex />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>Project Not Found</h1>
          <button onClick={() => navigate('/portfolio')} style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            View Full Portfolio
          </button>
        </div>
      </PageWrapper>
    )
  }

  const relatedProjects = allItems.filter(p => p.id !== item.id && p.category === item.category).slice(0, 3)
  const relatedServiceSlug = CATEGORY_TO_SERVICE_SLUG[item.category]
  const relatedService = relatedServiceSlug ? SERVICE_PAGES[relatedServiceSlug] : null
  const imgAlt = item.image_alt || `${item.title} — ${item.category} project by Royal Graphix`

  const jsonLd = [
    creativeWorkSchema({
      title: item.title, description: item.seo_description || item.description, image: item.og_image || item.image_url,
      path: `/portfolio/${item.slug}`, dateCreated: item.project_year, category: item.category,
    }),
    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Portfolio', path: '/portfolio' }, { name: item.title, path: `/portfolio/${item.slug}` }]),
  ]

  return (
    <PageWrapper>
      <SEO
        title={item.seo_title || item.title}
        description={item.seo_description || item.description}
        path={`/portfolio/${item.slug}`}
        image={item.og_image || item.image_url}
        type="article"
        keywords={item.focus_keyword || `${item.title}, ${item.category}, Royal Graphix portfolio`}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section style={{ background: 'var(--bg2)', padding: 'clamp(5rem,8vw,7rem) clamp(1.25rem,5vw,4.5rem) clamp(3rem,5vw,4rem)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Portfolio', path: '/portfolio' }, { name: item.title }]} />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red)', display: 'block', marginBottom: '0.75rem' }}>
              {item.category}{item.client_industry ? ` · ${item.client_industry}` : ''}{item.project_year ? ` · ${item.project_year}` : ''}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
              {item.title}
            </h1>
            <p style={{ fontSize: '1.02rem', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 640, marginBottom: '1.5rem' }}>{item.description}</p>
            {item.live_url && item.live_url !== '#' && (
              <a href={item.live_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Visit Live Site <ExternalLink size={14} />
                </button>
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      <div style={{ height: 420, position: 'relative', overflow: 'hidden' }}>
        {item.image_url ? (
          <img src={item.image_url} alt={imgAlt} loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>{item.emoji || '🖼️'}</div>
        )}
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(3rem,6vw,4rem) clamp(1.25rem,5vw,4rem)' }}>

        {item.overview && (
          <Section title="Project Overview"><p className="rich-content" style={{ margin: 0 }}>{item.overview}</p></Section>
        )}

        {item.client_name && (
          <Section title="Client">
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>{item.client_name}{item.client_industry ? ` — ${item.client_industry}` : ''}</p>
          </Section>
        )}

        {item.client_problem && (
          <Section title="The Challenge"><p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{item.client_problem}</p></Section>
        )}

        {item.objectives && (
          <Section title="Project Objectives"><p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{item.objectives}</p></Section>
        )}

        {item.solution && (
          <Section title="Our Solution"><p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{item.solution}</p></Section>
        )}

        {item.process_text && (
          <Section title="Our Process"><p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{item.process_text}</p></Section>
        )}

        {item.services_provided?.length > 0 && (
          <Section title="Services Provided">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {item.services_provided.map(s => (
                <span key={s} style={{ padding: '5px 12px', borderRadius: 100, background: 'rgba(200,16,46,0.08)', border: '1px solid rgba(200,16,46,0.2)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)' }}>{s}</span>
              ))}
            </div>
          </Section>
        )}

        {item.tech_stack?.length > 0 && (
          <Section title="Tools & Technologies">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {item.tech_stack.map(t => (
                <span key={t} style={{ padding: '5px 12px', borderRadius: 100, background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t}</span>
              ))}
            </div>
          </Section>
        )}

        {item.gallery_images?.length > 0 && (
          <Section title="Project Gallery">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.9rem' }}>
              {item.gallery_images.map((src, i) => (
                <img key={i} src={src} alt={`${item.title} — additional project view ${i + 1}`} loading="lazy" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
              ))}
            </div>
          </Section>
        )}

        {item.results?.length > 0 && (
          <Section title="Results">
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
              {item.results.map((r, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.94rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <CheckCircle2 size={17} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} /> {r}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {item.testimonial_text && (
          <Section title="Client Testimonial">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', position: 'relative' }}>
              <Quote size={28} color="rgba(200,16,46,0.25)" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.8, marginBottom: '1rem' }}>&ldquo;{item.testimonial_text}&rdquo;</p>
              {(item.testimonial_name || item.testimonial_role) && (
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  {item.testimonial_name}{item.testimonial_role ? <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}> — {item.testimonial_role}</span> : null}
                </div>
              )}
            </div>
          </Section>
        )}

        {relatedService && (
          <Section title="Related Service">
            <Link to={`/services/${relatedService.slug}`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.92rem', fontWeight: 700, color: 'var(--red)' }}>
              Learn more about our {relatedService.h1} <ArrowRight size={15} />
            </Link>
          </Section>
        )}
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section style={{ padding: '0 clamp(1.25rem,5vw,4.5rem) clamp(4rem,7vw,5.5rem)', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>More {item.category} Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {relatedProjects.map(p => (
                <Link key={p.id} to={p.slug ? `/portfolio/${p.slug}` : '/portfolio'} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ height: 150, overflow: 'hidden', background: 'var(--bg2)' }}>
                      {p.image_url
                        ? <img src={p.image_url} alt={p.image_alt || p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem' }}>{p.emoji}</div>
                      }
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{p.title}</h3>
                    </div>
                  </div>
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

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.9rem' }}>{title}</h2>
      {children}
    </div>
  )
}

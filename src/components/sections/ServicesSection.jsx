import { motion } from 'framer-motion'
import { Monitor, Palette, Layout, Search, Pen, BarChart2, Megaphone, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SERVICES } from '@/lib/constants'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { useServiceImages } from '@/hooks/useServiceImages'

// Map service slug → lucide icon component
const SERVICE_ICONS = {
  'web-design':    Monitor,
  'graphic-design':Palette,
  'ui-ux':         Layout,
  'seo':           Search,
  'branding':      Pen,
  'analytics':     BarChart2,
  'social-media-management': Megaphone,
}

export default function ServicesSection({ preview = false }) {
  const items = preview ? SERVICES.slice(0, 3) : SERVICES
  const { images } = useServiceImages()

  return (
    <section style={{ background: 'var(--bg2)', padding: 'clamp(5rem,9vw,8rem) 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,4.5rem)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '4rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="section-tag">What We Do</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Services Built<br /><span style={{ color: 'var(--red)' }}>for Growth</span>
            </h2>
            <div className="divider" style={{ marginTop: '1.25rem' }} />
          </motion.div>
          {preview && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Link to="/services" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'transparent', border: '1px solid var(--border-med)', borderRadius: 'var(--radius-sm)', padding: '0.55rem 1.25rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                  All Services →
                </button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'grid', gridTemplateColumns: preview ? 'repeat(auto-fit, minmax(320px, 1fr))' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}
        >
          {items.map(service => (
            <ServiceCard key={service.slug} service={service} imgSrc={images[service.slug]} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ServiceCard({ service, imgSrc }) {
  const Icon = SERVICE_ICONS[service.slug] || Monitor

  return (
    <motion.div variants={staggerItem} whileHover={{ y: -6 }}>
      <Link to={`/services/${service.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }} aria-label={`Learn more about ${service.title}`}>
        <div
          style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', transition: 'border-color 0.3s, box-shadow 0.3s', height: '100%' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(200,16,46,0.12)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          {/* Image with lucide icon overlay */}
          <div className="img-zoom" style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
            <img src={imgSrc} alt={`${service.title} — Royal Graphix`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
            {/* Lucide icon badge - replaces the circled emoji */}
            <div style={{
              position: 'absolute', bottom: 14, left: 16,
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(200,16,46,0.5)',
            }}>
              <Icon size={20} color="white" strokeWidth={1.8} />
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text)' }}>
              {service.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              {service.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {(service.tags || []).slice(0, 3).map(tag => (
                <span key={tag} style={{ padding: '3px 10px', borderRadius: 100, background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--red)' }}>
              Learn More <ArrowRight size={14} strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

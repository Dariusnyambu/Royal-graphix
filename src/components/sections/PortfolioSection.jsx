import { useState } from 'react'
import { Eye, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PORTFOLIO_CATEGORIES } from '@/lib/constants'
import Modal from '@/components/ui/Modal'

// Stable Unsplash images for portfolio items
const PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=75&fit=crop',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=700&q=75&fit=crop',
  'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=700&q=75&fit=crop',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=700&q=75&fit=crop',
  'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=700&q=75&fit=crop',
  'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&q=75&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=75&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&q=75&fit=crop',
]

const CATEGORY_COLORS = {
  'Web Design':            '#3b82f6',
  'Branding':              '#C8102E',
  'Graphics':              '#8b5cf6',
  'SEO Projects':          '#10b981',
  'Church & Ministry':     '#f59e0b',
  'Travel & Tourism':      '#06b6d4',
  'NGO & Community':       '#22c55e',
  'Research & Consulting': '#6366f1',
  'Real Estate':           '#f97316',
}

export default function PortfolioSection({ items = [], loading = false, preview = false }) {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = preview
    ? items.slice(0, 6)
    : filter === 'All' ? items : items.filter(p => p.category === filter)

  // Assign stable images to items by index
  const itemsWithImages = items.map((item, i) => ({
    ...item,
    _img: item.image_url || PORTFOLIO_IMAGES[i % PORTFOLIO_IMAGES.length],
  }))
  const displayItems = preview
    ? itemsWithImages.slice(0, 6)
    : filter === 'All' ? itemsWithImages : itemsWithImages.filter(p => p.category === filter)

  return (
    <div style={{ padding: 'clamp(4rem,7vw,6rem) clamp(1.25rem,5vw,4.5rem)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* Filter bar */}
        {!preview && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {PORTFOLIO_CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '0.45rem 1.1rem', borderRadius: '100px',
                  fontSize: '0.83rem', fontWeight: 600,
                  border: '1px solid',
                  fontFamily: 'var(--font-body)', cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: filter === cat ? 'var(--red)' : 'var(--border-med)',
                  background: filter === cat ? 'var(--red)' : 'transparent',
                  color: filter === cat ? 'white' : 'var(--text-muted)',
                  boxShadow: filter === cat ? '0 4px 14px var(--red-glow)' : 'none',
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ height: 240 }} />
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="skeleton" style={{ height: 11, width: '35%' }} />
                  <div className="skeleton" style={{ height: 14, width: '70%' }} />
                  <div className="skeleton" style={{ height: 11, width: '55%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <AnimatePresence>
              {displayItems.map((project, i) => (
                <PortfolioCard
                  key={project.id}
                  project={project}
                  index={i}
                  onClick={() => setSelected(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {displayItems.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            No projects in this category yet.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div>
            <div style={{ height: 260, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <img src={selected._img} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: 100,
              background: 'rgba(200,16,46,0.1)', color: 'var(--red)',
              fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', marginBottom: '1rem',
              border: '1px solid rgba(200,16,46,0.2)',
            }}>
              {selected.category}
            </span>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.925rem' }}>
              {selected.description}
            </p>
            {selected.live_url && (
              <a href={selected.live_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'var(--red)', color: 'white', border: 'none',
                  padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--red-glow)',
                }}>
                  View Live Project ↗
                </button>
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function PortfolioCard({ project, index, onClick }) {
  const catColor = CATEGORY_COLORS[project.category] || '#777'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      style={{
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        background: 'var(--surface)', border: '1px solid var(--border)',
        cursor: 'pointer', transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border-med)'
        el.style.boxShadow = 'var(--shadow-lg)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Image */}
      <div className="img-zoom" style={{ position: 'relative', height: 230, overflow: 'hidden' }}>
        <img
          src={project._img}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
          opacity: 0, transition: 'opacity 0.3s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        />
        {/* Category tag on image */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          padding: '4px 12px', borderRadius: 100,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'white',
          border: `1px solid ${catColor}40`,
        }}>
          <span style={{ color: catColor, marginRight: 4 }}>●</span>
          {project.category}
        </div>
        {/* View overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, transition: 'opacity 0.3s',
          background: 'rgba(200,16,46,0.85)',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0'}
        >
          <div style={{
            width: 52, height: 52, borderRadius: '50%', background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            transform: 'scale(0.8)', transition: 'transform 0.3s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(0.8)'}
          ><Eye size={18} strokeWidth={1.8} /></div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>
          {project.title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          {project.description}
        </p>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)' }}>
          View details →
        </span>
      </div>
    </motion.article>
  )
}

import { motion } from 'framer-motion'
import { Star, Users, CheckCircle, Globe } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/constants'
import { staggerContainer, staggerItem } from '@/lib/motion'

// Avatar images
const AVATAR_BG = ['#C8102E','#3b82f6','#8b5cf6','#10b981','#f59e0b']

export default function TestimonialsSection() {
  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(5rem,9vw,8rem) 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '60vw', height: '60vw', maxWidth: 700, maxHeight: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,16,46,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,4.5rem)', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-tag" style={{ display: 'block', textAlign: 'center' }}>Testimonials</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Trusted by Ambitious Brands
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0.75rem auto 0', lineHeight: 1.7 }}>
            Don\'t take our word for it — here\'s what our clients say.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              whileHover={{ y: -5 }}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)', padding: '2rem',
                position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {/* Large quote mark */}
              <div style={{
                position: 'absolute', top: -10, right: 20,
                fontFamily: 'Georgia, serif', fontSize: '7rem',
                color: 'var(--red)', opacity: 0.08, lineHeight: 1,
                pointerEvents: 'none', userSelect: 'none',
              }}>"</div>

              {/* Stars */}
              <div style={{ color: '#f59e0b', fontSize: '0.9rem', letterSpacing: 2, marginBottom: '1rem' }}>
                {Array.from({length:t.stars}).map((_,si)=><Star key={si} size={13} color='#f59e0b' fill='#f59e0b' strokeWidth={0} style={{display:'inline-block'}}/>)}
              </div>

              {/* Text */}
              <p style={{
                color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.8,
                marginBottom: '1.5rem', fontStyle: 'italic', fontFamily: 'var(--font-display)',
              }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%',
                  background: AVATAR_BG[i % AVATAR_BG.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-heading)', fontWeight: 800,
                  color: 'white', fontSize: '0.9rem', flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '4rem', flexWrap: 'wrap' }}
        >
          {[
              {Icon: Star,        text:'5.0 Average Rating', fill:'#f59e0b', color:'#f59e0b'},
              {Icon: Users,       text:'40+ Happy Clients',  fill:null,      color:'var(--text-muted)'},
              {Icon: CheckCircle, text:'150+ Projects Done', fill:null,      color:'var(--text-muted)'},
              {Icon: Globe,       text:'Global Reach',       fill:null,      color:'var(--text-muted)'},
            ].map(({ Icon, text, fill, color }) => (
              <div key={text} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, display:'flex', alignItems:'center', gap:6 }}>
                <Icon size={14} color={color} fill={fill || 'none'} strokeWidth={1.8} />
                {text}
              </div>
            ))}
        </motion.div>
      </div>
    </section>
  )
}

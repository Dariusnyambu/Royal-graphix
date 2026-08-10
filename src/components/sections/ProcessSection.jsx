import { motion } from 'framer-motion'
import { Search, Lightbulb, Paintbrush, Rocket } from 'lucide-react'
import { PROCESS_STEPS } from '@/lib/constants'

const STEP_ICONS = [Search, Lightbulb, Paintbrush, Rocket]
const STEP_COLORS = ['#C8102E', '#3b82f6', '#8b5cf6', '#C8102E']

export default function ProcessSection() {
  return (
    <section style={{ padding: 'clamp(5rem,9vw,8rem) 0', background: 'var(--bg2)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,4.5rem)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-tag" style={{ textAlign: 'center' }}>How We Work</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Our Proven 4-Step Process
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0.75rem auto 0', lineHeight: 1.7 }}>
            A battle-tested methodology that delivers exceptional results, every single time.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', position: 'relative' }}>
          {/* Connecting line */}
          <div style={{ position: 'absolute', top: 32, left: '12.5%', right: '12.5%', height: 1, background: 'linear-gradient(90deg, var(--red), var(--border-med), var(--red))', opacity: 0.2, pointerEvents: 'none' }} />

          {PROCESS_STEPS.map((step, i) => {
            const Icon = STEP_ICONS[i]
            const isAccent = i === 0 || i === PROCESS_STEPS.length - 1
            return (
              <motion.div key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                style={{ textAlign: 'center', position: 'relative' }}
              >
                <motion.div whileHover={{ scale: 1.1, rotate: 3 }}
                  style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: isAccent ? 'var(--red)' : 'var(--surface)',
                    border: `2px solid ${isAccent ? 'var(--red)' : 'var(--border-med)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: isAccent ? '0 8px 28px var(--red-glow)' : 'var(--shadow-sm)',
                    cursor: 'default', transition: 'all 0.3s',
                  }}
                >
                  <Icon size={24} color={isAccent ? 'white' : STEP_COLORS[i]} strokeWidth={1.8} />
                </motion.div>

                <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 100, background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.2)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--red)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Step {step.n}
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.6rem', color: 'var(--text)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

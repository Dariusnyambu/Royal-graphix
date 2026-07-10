import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '@/components/seo/SEO'
import PageWrapper from '@/components/ui/PageWrapper'
import { useProjects, PROJECT_STATUSES, getStatusConfig, PRIORITY_CONFIG } from '@/hooks/useProjects'

const HERO_IMG = 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1600&q=80&fit=crop'

export default function TrackProject() {
  const [code, setCode]       = useState('')
  const [result, setResult]   = useState(null)  // null | 'loading' | project | 'not_found'
  const { lookupByCode }      = useProjects()

  const handleLookup = async (e) => {
    e?.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) return
    setResult('loading')
    const { data, error } = await lookupByCode(trimmed)
    if (error || !data) { setResult('not_found'); return }
    setResult(data)
  }

  const project = result && result !== 'loading' && result !== 'not_found' ? result : null
  const activeIdx = project ? PROJECT_STATUSES.findIndex(s => s.key === project.status) : -1

  return (
    <PageWrapper>
      <SEO
        title="Track Your Project"
        description="Enter your Royal Graphix tracking code to see the real-time status of your project — from received to delivered."
        path="/track"
      />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={HERO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.85) 60%, rgba(5,5,15,0.6) 100%)' }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', padding: 'calc(var(--nav-h) + 4rem) clamp(1.25rem,5vw,4.5rem) 5rem' }}>
          <span className="section-tag">Project Tracker</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem,5.5vw,3.8rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '1.25rem' }}>
            Track Your<br />
            <span style={{ background: 'linear-gradient(135deg,#C8102E,#FF4060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Project Status
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 480, marginBottom: '2.5rem' }}>
            Enter the tracking code we sent you to see exactly where your project stands — in real time.
          </p>

          {/* Search bar */}
          <form onSubmit={handleLookup}
            style={{ display: 'flex', gap: '0.75rem', maxWidth: 520, flexWrap: 'wrap' }}>
            <input
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setResult(null) }}
              placeholder="Enter tracking code e.g. RG-ABC123"
              style={{
                flex: 1, minWidth: 220,
                background: 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem',
                fontSize: '1rem', color: 'white', fontFamily: 'var(--font-body)',
                outline: 'none', letterSpacing: '0.04em', backdropFilter: 'blur(12px)',
              }}
              onFocus={e => e.target.style.borderColor = '#C8102E'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.25)'}
            />
            <button type="submit" disabled={result === 'loading'}
              style={{ padding: '0.85rem 2rem', borderRadius: 'var(--radius-md)', background: '#C8102E', color: 'white', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 8px 24px rgba(200,16,46,0.5)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <Search size={16} strokeWidth={2} />
              {result === 'loading' ? 'Searching…' : 'Track Project'}
            </button>
          </form>
        </motion.div>
      </section>

      {/* Result section */}
      <section style={{ background: 'var(--bg2)', padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4.5rem)', minHeight: '40vh' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <AnimatePresence mode="wait">

            {/* Not found */}
            {result === 'not_found' && (
              <motion.div key="notfound"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: 'var(--surface)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-xl)', padding: '3rem 2rem', textAlign: 'center' }}>
                <AlertCircle size={48} color="#ef4444" strokeWidth={1.4} style={{ margin: '0 auto 1.25rem' }} />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem' }}>Project Not Found</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 380, margin: '0 auto 1.75rem', fontSize: '0.9rem' }}>
                  We couldn't find a project with that tracking code. Please double-check the code we sent you, or contact us directly.
                </p>
                <Link to="/contact" style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '0.7rem 1.75rem', borderRadius: 'var(--radius-md)', background: 'var(--red)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    Contact Us
                  </button>
                </Link>
              </motion.div>
            )}

            {/* Project found */}
            {project && (
              <motion.div key="found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Header card */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.5rem,3vw,2.5rem)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      {(() => {
                        const sc = getStatusConfig(project.status)
                        return <span style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700, color: sc.color, background: sc.bg, border: `1.5px solid ${sc.color}55`, marginBottom: '0.75rem' }}>{sc.label}</span>
                      })()}
                      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.3rem,3vw,1.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>{project.title}</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{project.project_type} · {project.client_name}</p>
                    </div>
                    <code style={{ background: 'rgba(200,16,46,0.08)', border: '1.5px solid rgba(200,16,46,0.2)', borderRadius: 8, padding: '8px 16px', fontSize: '1rem', fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--red)', fontWeight: 700 }}>
                      {project.tracking_code}
                    </code>
                  </div>

                  {/* Meta row */}
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                      project.deadline && { label: 'Deadline', value: new Date(project.deadline).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) },
                      project.amount   && { label: 'Amount', value: `KES ${Number(project.amount).toLocaleString()}` },
                      project.priority && { label: 'Priority', value: PRIORITY_CONFIG[project.priority]?.label },
                    ].filter(Boolean).map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-faint)', marginBottom: 3 }}>{label}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress timeline */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.5rem,3vw,2.5rem)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '2rem', letterSpacing: '-0.02em' }}>Progress Timeline</h3>

                  <div style={{ position: 'relative' }}>
                    {/* Vertical connector line */}
                    <div style={{ position: 'absolute', left: 20, top: 24, bottom: 24, width: 2, background: 'var(--border)', zIndex: 0 }} />

                    {PROJECT_STATUSES.filter(s => s.key !== 'cancelled').map((s, idx) => {
                      const isDone    = idx <= activeIdx && project.status !== 'cancelled'
                      const isCurrent = s.key === project.status
                      const isFuture  = idx > activeIdx
                      return (
                        <motion.div key={s.key}
                          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: idx < PROJECT_STATUSES.length - 2 ? '1.5rem' : 0, position: 'relative', zIndex: 1 }}>
                          {/* Step circle */}
                          <div style={{
                            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                            background: isDone ? s.color : 'var(--bg2)',
                            border: `2px solid ${isCurrent ? s.color : isDone ? s.color : 'var(--border)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: isCurrent ? `0 0 0 4px ${s.color}33` : 'none',
                            transition: 'all 0.3s',
                          }}>
                            {isDone
                              ? <CheckCircle size={18} color="white" strokeWidth={2.5} />
                              : <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isFuture ? 'var(--text-muted)' : s.color }}>{idx + 1}</span>
                            }
                          </div>
                          {/* Label */}
                          <div style={{ paddingTop: 8 }}>
                            <div style={{ fontWeight: isCurrent ? 700 : 500, fontSize: '0.9rem', color: isCurrent ? s.color : isFuture ? 'var(--text-muted)' : 'var(--text)' }}>
                              {s.label}
                              {isCurrent && <span style={{ marginLeft: 8, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: s.bg, color: s.color, padding: '2px 8px', borderRadius: 100, border: `1px solid ${s.color}44` }}>Current</span>}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}

                    {/* Cancelled state */}
                    {project.status === 'cancelled' && (
                      <div style={{ marginTop: '1.5rem', background: 'rgba(107,114,128,0.08)', border: '1px solid rgba(107,114,128,0.25)', borderRadius: 10, padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AlertCircle size={16} color="#6b7280" />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>This project has been cancelled. Please contact us for more information.</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {project.description && (
                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-faint)', marginBottom: '0.5rem' }}>Project Description</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{project.description}</p>
                    </div>
                  )}

                  {/* CTA */}
                  <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to="/contact" style={{ textDecoration: 'none' }}>
                      <button style={{ padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--red)', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px var(--red-glow)' }}>
                        Contact Us <ArrowRight size={14} strokeWidth={2} />
                      </button>
                    </Link>
                    <button onClick={() => { setCode(''); setResult(null) }}
                      style={{ padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-med)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      Track Another Project
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Default state — instructions */}
            {!result && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>How It Works</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Once we start working on your project, we'll send you a unique tracking code via WhatsApp or email.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '1.25rem' }}>
                  {[
                    { icon: '01', title: 'Receive Your Code', desc: 'We send you a unique tracking code when your project is confirmed.' },
                    { icon: '02', title: 'Enter the Code', desc: 'Type or paste your tracking code in the search box above.' },
                    { icon: '03', title: 'See Your Progress', desc: 'View real-time project status — from received all the way to delivered.' },
                  ].map(step => (
                    <div key={step.icon} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2rem', color: 'var(--red)', opacity: 0.25, marginBottom: '0.75rem', letterSpacing: '-0.05em' }}>{step.icon}</div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>{step.desc}</p>
                    </div>
                  ))}
                </div>
                {/* Demo tracking codes */}
                <div style={{ marginTop: '2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Try our demo tracking codes:</div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['RG-DEMO01', 'RG-DEMO02', 'RG-DEMO03'].map(c => (
                      <button key={c} onClick={() => { setCode(c); setTimeout(handleLookup, 100) }}
                        style={{ padding: '4px 14px', borderRadius: 100, border: '1px solid rgba(200,16,46,0.3)', background: 'rgba(200,16,46,0.08)', color: 'var(--red)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>
    </PageWrapper>
  )
}

import { useState } from 'react'
import SEO from '@/components/seo/SEO'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { MapPin, Briefcase, CheckCircle, X, User, Mail, Phone, Link as LinkIcon, MessageSquare } from 'lucide-react'
import PageWrapper from '@/components/ui/PageWrapper'
import Modal from '@/components/ui/Modal'
import Skeleton from '@/components/ui/Skeleton'
import { useJobApplications } from '@/hooks/useJobApplications'
import { useCareers } from '@/hooks/useCareers'
import { getJobIcon } from '@/lib/jobIcons'
import { staggerContainer, staggerItem } from '@/lib/motion'

const HERO_IMG = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80&fit=crop'

const inputStyle = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border-med)',
  borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem 0.75rem 2.75rem',
  fontSize: '0.9rem', color: 'var(--text)', fontFamily: 'var(--font-body)',
  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
}

const INITIAL = { name: '', email: '', phone: '', portfolio_url: '', message: '' }

export default function Careers() {
  const { submitApplication } = useJobApplications()
  const { jobs, loading } = useCareers()
  const [applyRole, setApplyRole] = useState(null)
  const [form, setForm] = useState(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const onFocus  = e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.1)' }
  const onBlur   = e => { e.target.style.borderColor = 'var(--border-med)'; e.target.style.boxShadow = 'none' }

  const openApply = (job) => { setApplyRole(job); setForm(INITIAL); setSubmitted(false) }
  const closeApply = () => setApplyRole(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Please add your name and email'); return
    }
    setSubmitting(true)
    const { error } = await submitApplication({ ...form, role: applyRole.title })
    setSubmitting(false)
    if (error) { toast.error('Something went wrong. Please try again.'); return }
    setSubmitted(true)
    toast.success('Application submitted!')
  }

  return (
    <PageWrapper>
      <SEO
        title="Careers — Join Royal Graphix"
        description="We're hiring a Graphic Designer and a Senior Developer to join our Nairobi-based design and development team."
        keywords="Royal Graphix careers, graphic designer job Nairobi, senior developer job Kenya, web design agency jobs"
        path="/careers"
      />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '44vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={HERO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.85) 100%)' }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', padding: 'calc(var(--nav-h) + 3rem) clamp(1.25rem,5vw,4.5rem) 4rem' }}>
          <span className="section-tag">We're Hiring</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Build Your Career<br />
            <span style={{ background: 'linear-gradient(135deg,#C8102E,#FF4060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              With Royal Graphix
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.75, fontSize: '1rem' }}>
            We're a small, fast-moving design and development team in Nairobi — and we're looking for two talented people to join us.
          </p>
        </motion.div>
      </section>

      {/* Openings */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,4.5rem)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {loading && Array(2).fill(0).map((_, i) => <Skeleton key={i} height={280} />)}

            {!loading && jobs.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                No open positions right now — check back soon!
              </div>
            )}

            {!loading && jobs.map(job => {
              const Icon = getJobIcon(job.icon)
              return (
              <motion.div key={job.id} variants={staggerItem} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.75rem,3vw,2.5rem)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(200,16,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={24} color="var(--red)" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.01em' }}>{job.title}</h2>
                      <div style={{ display: 'flex', gap: '0.9rem', marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--text-muted)' }}><Briefcase size={13} /> {job.type}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--text-muted)' }}><MapPin size={13} /> {job.location}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => openApply(job)} style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--red-glow)', whiteSpace: 'nowrap' }}>
                    Apply Now
                  </button>
                </div>

                <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.92rem', marginBottom: '1.5rem' }}>{job.summary}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--red)', marginBottom: '0.75rem' }}>Responsibilities</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
                      {(job.responsibilities || []).map((r, i) => (
                        <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          <CheckCircle size={14} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--red)', marginBottom: '0.75rem' }}>Requirements</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
                      {(job.requirements || []).map((r, i) => (
                        <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          <CheckCircle size={14} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Apply Modal */}
      <Modal open={!!applyRole} onClose={closeApply} title={applyRole ? `Apply — ${applyRole.title}` : ''} maxWidth={480}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle size={40} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.5rem' }}>Application Sent!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>We'll review it and get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="name" value={form.name} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder="Full name *" style={inputStyle} />
            </div>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="email" type="email" value={form.email} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder="Email address *" style={inputStyle} />
            </div>
            <div style={{ position: 'relative' }}>
              <Phone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="phone" value={form.phone} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder="Phone number" style={inputStyle} />
            </div>
            <div style={{ position: 'relative' }}>
              <LinkIcon size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="portfolio_url" value={form.portfolio_url} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder="Portfolio / CV link" style={inputStyle} />
            </div>
            <div style={{ position: 'relative' }}>
              <MessageSquare size={15} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-muted)' }} />
              <textarea name="message" value={form.message} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder="Why you're a great fit (optional)" rows={4} style={{ ...inputStyle, resize: 'vertical', paddingTop: '0.75rem' }} />
            </div>
            <button type="submit" disabled={submitting} style={{
              background: 'var(--red)', color: 'white', border: 'none', padding: '0.85rem',
              borderRadius: 'var(--radius-md)', fontSize: '0.92rem', fontWeight: 700,
              cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1,
              fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--red-glow)',
            }}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </Modal>
    </PageWrapper>
  )
}

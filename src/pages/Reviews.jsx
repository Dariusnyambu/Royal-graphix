import { useState } from 'react'
import SEO from '@/components/seo/SEO'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Star, User, Briefcase, MessageSquare, CheckCircle } from 'lucide-react'
import PageWrapper from '@/components/ui/PageWrapper'
import { useReviews } from '@/hooks/useReviews'
import { staggerContainer, staggerItem } from '@/lib/motion'

const HERO_IMG = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80&fit=crop'

const inputStyle = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border-med)',
  borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem 0.75rem 2.75rem',
  fontSize: '0.9rem', color: 'var(--text)', fontFamily: 'var(--font-body)',
  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
}

const INITIAL = { name: '', email: '', role: '', rating: 5, message: '' }

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1
        const filled = n <= (hover || value)
        return (
          <button key={n} type="button" onClick={() => onChange(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
            <Star size={26} strokeWidth={1.5} fill={filled ? '#f59e0b' : 'transparent'} color={filled ? '#f59e0b' : 'var(--border-med)'} />
          </button>
        )
      })}
    </div>
  )
}

function ReviewStars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} strokeWidth={0} fill={i < rating ? '#f59e0b' : 'var(--border-med)'} />
      ))}
    </div>
  )
}

export default function Reviews() {
  const { reviews, loading, submitReview } = useReviews()
  const [form, setForm] = useState(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const onFocus  = e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.1)' }
  const onBlur   = e => { e.target.style.borderColor = 'var(--border-med)'; e.target.style.boxShadow = 'none' }

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      toast.error('Please add your name and a short review'); return
    }
    setSubmitting(true)
    const { error } = await submitReview(form)
    setSubmitting(false)
    if (error) { toast.error('Something went wrong. Please try again.'); return }
    setSubmitted(true)
    setForm(INITIAL)
    toast.success('Thanks for your review!')
  }

  return (
    <PageWrapper>
      <SEO
        title="Client Reviews — Royal Graphix"
        description="Read what our clients say about working with Royal Graphix, and share your own experience with our web design and branding team."
        keywords="Royal Graphix reviews, client testimonials, web design agency reviews Kenya"
        path="/reviews"
      />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '42vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={HERO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.85) 100%)' }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', padding: 'calc(var(--nav-h) + 3rem) clamp(1.25rem,5vw,4.5rem) 4rem' }}>
          <span className="section-tag">Client Reviews</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
            What Our Clients<br />
            <span style={{ background: 'linear-gradient(135deg,#C8102E,#FF4060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Say About Us
            </span>
          </h1>
          {avgRating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ReviewStars rating={Math.round(avgRating)} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{avgRating} average from {reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
            </div>
          )}
        </motion.div>
      </section>

      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,4.5rem)', background: 'var(--bg)' }}>
        <div className="reviews-layout" style={{ maxWidth: 1240, margin: '0 auto' }}>

          {/* Reviews list */}
          <div>
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />)}
              </div>
            )}
            {!loading && reviews.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                No reviews yet — be the first to share your experience!
              </div>
            )}
            <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {reviews.map(r => (
                <motion.div key={r.id} variants={staggerItem} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(200,16,46,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--red)', fontSize: '0.85rem' }}>
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{r.name}</div>
                        {r.role && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.role}</div>}
                      </div>
                    </div>
                    <ReviewStars rating={r.rating} />
                  </div>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.92rem' }}>{r.message}</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.75rem' }}>{fmtDate(r.created_at)}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Submit form */}
          <div className="reviews-form-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={40} color="#10b981" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.5rem' }}>Thank You!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>Your review has been posted.</p>
                <button onClick={() => setSubmitted(false)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1.25rem', fontSize: '0.85rem', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Leave Another Review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '1.5rem' }}>Share Your Experience</h3>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 8 }}>Your Rating</label>
                  <StarPicker value={form.rating} onChange={n => setForm(p => ({ ...p, rating: n }))} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input name="name" value={form.name} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder="Your name *" style={inputStyle} />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input name="role" value={form.role} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder="Role / Company (optional)" style={inputStyle} />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <MessageSquare size={15} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-muted)' }} />
                    <textarea name="message" value={form.message} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder="Tell us about your experience *" rows={4} style={{ ...inputStyle, resize: 'vertical', paddingTop: '0.75rem' }} />
                  </div>
                </div>

                <button type="submit" disabled={submitting} style={{
                  width: '100%', marginTop: '1.5rem', background: 'var(--red)', color: 'white', border: 'none',
                  padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.92rem', fontWeight: 700,
                  cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1,
                  fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--red-glow)',
                }}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

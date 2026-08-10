import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Gift, Copy, CheckCircle, Share2, Phone, Mail, User, Briefcase, ArrowRight } from 'lucide-react'
import SEO from '@/components/seo/SEO'
import PageWrapper from '@/components/ui/PageWrapper'
import { useReferrals, generateReferralCode, calcCommission } from '@/hooks/useReferrals'
import toast from 'react-hot-toast'

const HERO_IMG = 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1800&q=80&fit=crop'

const HOW_IT_WORKS = [
  { n: '01', title: 'Fill the Form', desc: 'Enter your details and your friend or contact\'s information.' },
  { n: '02', title: 'Get Your Code', desc: 'We generate a unique referral code linked to you instantly.' },
  { n: '03', title: 'Share It',      desc: 'Share your code with anyone who needs design or web services.' },
  { n: '04', title: 'Earn 20%',      desc: 'Once the referred project is completed, you earn 20% commission.' },
]

const EARNINGS = [
  { service: 'Website Design',     min: 30000, max: 80000 },
  { service: 'E-commerce Store',   min: 80000, max: 150000 },
  { service: 'Branding Package',   min: 35000, max: 80000 },
  { service: 'Mobile App',         min: 80000, max: 300000 },
  { service: 'Logo Design',        min: 5000,  max: 15000 },
  { service: 'Church Media/Month', min: 3000,  max: 12000 },
]

const INITIAL_FORM = {
  referrer_name: '', referrer_email: '', referrer_phone: '',
  referred_name: '', referred_email: '', referred_phone: '', referred_service: '',
}

const inp = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border-med)',
  borderRadius: 10, padding: '0.7rem 1rem 0.7rem 2.75rem',
  fontSize: '0.9rem', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none',
  transition: 'border-color 0.2s',
}

export default function Refer() {
  const { submitReferral } = useReferrals()
  const [form, setForm]     = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null) // { code, commission }
  const [copied, setCopied]   = useState(false)

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const onFocus  = e => e.target.style.borderColor = 'var(--red)'
  const onBlur   = e => e.target.style.borderColor = 'var(--border-med)'

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.referrer_name || !form.referrer_email || !form.referrer_phone || !form.referred_name) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    const { data, error } = await submitReferral(form)
    setLoading(false)
    if (error) { toast.error('Something went wrong. Please try again.'); return }
    setResult({ code: data.referral_code, name: form.referred_name })
    setForm(INITIAL_FORM)
    toast.success('Referral submitted! Your unique code is ready.')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(result.code).then(() => {
      setCopied(true)
      toast.success('Code copied!')
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const shareCode = () => {
    const msg = `I just referred you to Royal Graphix — Nairobi's top creative agency!\n\nUse my referral code *${result.code}* when you contact them.\n\nGet in touch: https://royalgraphix.co.ke/contact`
    if (navigator.share) {
      navigator.share({ title: 'Royal Graphix Referral', text: msg, url: 'https://royalgraphix.co.ke' })
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
    }
  }

  return (
    <PageWrapper>
      <SEO
        title="Refer & Earn — Earn 20% Commission"
        description="Refer a friend to Royal Graphix and earn 20% commission on every completed project. No limits. Get your unique referral code today."
        path="/refer"
        keywords="refer and earn Kenya, Royal Graphix referral, earn commission Nairobi, refer a friend"
      />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '52vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={HERO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.88) 60%, rgba(5,5,15,0.6) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 80% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', padding: 'calc(var(--nav-h) + 4rem) clamp(1.25rem,5vw,4.5rem) 5rem' }}>
          <span className="section-tag">Refer & Earn</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem,5.5vw,4rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '1.1rem' }}>
            Refer a Client.<br />
            <span style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Earn 20% Commission.
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 520, marginBottom: '2rem' }}>
            Know someone who needs a website, logo, or design? Refer them to Royal Graphix and earn 20% of every completed project. No limits. No caps.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#refer-form" style={{ textDecoration: 'none' }}>
              <button style={{ background: '#f59e0b', color: '#000', border: 'none', padding: '0.875rem 2.25rem', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 8px 32px rgba(245,158,11,0.45)' }}>
                Get My Referral Code →
              </button>
            </a>
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '0.875rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', backdropFilter: 'blur(12px)' }}>
                Contact Us
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section style={{ background: 'var(--bg)', padding: 'clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,4.5rem)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-tag" style={{ textAlign: 'center' }}>How It Works</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Simple. Transparent. Rewarding.
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '1.5rem' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={step.n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', opacity: 0.25, letterSpacing: '-0.05em', marginBottom: '1rem' }}>{step.n}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings table */}
      <section style={{ background: 'var(--bg2)', padding: 'clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,4.5rem)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-tag" style={{ textAlign: 'center' }}>What You Can Earn</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              20% of Every Project
            </h2>
          </motion.div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--bg2)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              {['Service', 'Project Value', 'Your Commission (20%)'].map(h => (
                <div key={h} style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{h}</div>
              ))}
            </div>
            {EARNINGS.map((row, i) => (
              <motion.div key={row.service} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: i < EARNINGS.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{row.service}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  KES {row.min.toLocaleString()} – {row.max.toLocaleString()}
                </div>
                <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.875rem' }}>
                  KES {calcCommission(row.min).toLocaleString()} – {calcCommission(row.max).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            Commission is paid via M-Pesa within 7 days of project completion and full payment.
          </p>
        </div>
      </section>

      {/* Referral Form */}
      <section id="refer-form" style={{ background: 'var(--bg)', padding: 'clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,4.5rem)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-tag" style={{ textAlign: 'center' }}>Submit a Referral</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Get Your Unique Code
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Fill in your details and your contact's details. We'll generate a unique tracking code instantly.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {result ? (
              /* Success state */
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ background: 'var(--surface)', border: '2px solid #f59e0b', borderRadius: 'var(--radius-xl)', padding: 'clamp(2rem,4vw,3.5rem)', textAlign: 'center', boxShadow: '0 12px 48px rgba(245,158,11,0.15)' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Gift size={32} color="#f59e0b" strokeWidth={1.6} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Referral Submitted!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.65 }}>
                  Your referral for <strong>{result.name}</strong> has been received. Here is your unique tracking code:
                </p>

                {/* Code display */}
                <div style={{ background: 'var(--bg)', border: '2px dashed rgba(245,158,11,0.4)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your Referral Code</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.1em' }}>
                    {result.code}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <button onClick={copyCode}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.5rem', borderRadius: 10, background: copied ? '#22c55e' : '#f59e0b', color: '#000', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
                    {copied ? <CheckCircle size={16} strokeWidth={2} /> : <Copy size={16} strokeWidth={2} />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                  <button onClick={shareCode}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.5rem', borderRadius: 10, background: '#25D366', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    <Share2 size={16} strokeWidth={2} />
                    Share via WhatsApp
                  </button>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Save this code. Our team will contact your referral within 24 hours. Once their project is completed, your 20% commission will be sent via M-Pesa.
                </p>

                <button onClick={() => setResult(null)}
                  style={{ background: 'transparent', border: '1px solid var(--border-med)', borderRadius: 10, padding: '0.6rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                  Refer Another Person
                </button>
              </motion.div>
            ) : (
              /* Form */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.75rem,3vw,2.5rem)', boxShadow: 'var(--shadow-md)' }}>
                <form onSubmit={handleSubmit}>
                  {/* Your details */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red)', marginBottom: '1rem' }}>Your Details (Referrer)</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '0.875rem' }}>
                      <Field icon={<User size={15} color="var(--text-muted)" strokeWidth={2} />}>
                        <input name="referrer_name" value={form.referrer_name} onChange={onChange} placeholder="Your Full Name *" style={inp} onFocus={onFocus} onBlur={onBlur} />
                      </Field>
                      <Field icon={<Mail size={15} color="var(--text-muted)" strokeWidth={2} />}>
                        <input type="email" name="referrer_email" value={form.referrer_email} onChange={onChange} placeholder="Your Email *" style={inp} onFocus={onFocus} onBlur={onBlur} />
                      </Field>
                      <Field icon={<Phone size={15} color="var(--text-muted)" strokeWidth={2} />}>
                        <input name="referrer_phone" value={form.referrer_phone} onChange={onChange} placeholder="Your Phone / WhatsApp *" style={inp} onFocus={onFocus} onBlur={onBlur} />
                      </Field>
                    </div>
                  </div>

                  {/* Their details */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f59e0b', marginBottom: '1rem' }}>Their Details (Referred Person)</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '0.875rem' }}>
                      <Field icon={<User size={15} color="var(--text-muted)" strokeWidth={2} />}>
                        <input name="referred_name" value={form.referred_name} onChange={onChange} placeholder="Their Full Name *" style={inp} onFocus={onFocus} onBlur={onBlur} />
                      </Field>
                      <Field icon={<Mail size={15} color="var(--text-muted)" strokeWidth={2} />}>
                        <input type="email" name="referred_email" value={form.referred_email} onChange={onChange} placeholder="Their Email" style={inp} onFocus={onFocus} onBlur={onBlur} />
                      </Field>
                      <Field icon={<Phone size={15} color="var(--text-muted)" strokeWidth={2} />}>
                        <input name="referred_phone" value={form.referred_phone} onChange={onChange} placeholder="Their Phone / WhatsApp" style={inp} onFocus={onFocus} onBlur={onBlur} />
                      </Field>
                      <Field icon={<Briefcase size={15} color="var(--text-muted)" strokeWidth={2} />}>
                        <select name="referred_service" value={form.referred_service} onChange={onChange} style={{ ...inp, appearance: 'none', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}>
                          <option value="">Service They Need</option>
                          {['Web Design', 'Logo Design', 'Branding', 'Graphic Design', 'E-commerce', 'Church Media', 'Event Branding', 'Mobile App', 'SEO', 'UI/UX Design', 'Other'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </Field>
                    </div>
                  </div>

                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ width: '100%', background: '#f59e0b', color: '#000', border: 'none', padding: '0.95rem', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 6px 20px rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Gift size={18} strokeWidth={2} />
                    {loading ? 'Generating Code...' : 'Submit Referral & Get My Code'}
                  </motion.button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
                    Free to join. No limits. Commission paid via M-Pesa after project completion.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageWrapper>
  )
}

function Field({ icon, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', zIndex: 1 }}>{icon}</span>
      {children}
    </div>
  )
}

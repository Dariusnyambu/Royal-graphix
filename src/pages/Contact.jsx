import { useState } from 'react'
import SEO from '@/components/seo/SEO'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, User, MessageSquare, Briefcase, DollarSign, ChevronDown } from 'lucide-react'
import PageWrapper from '@/components/ui/PageWrapper'
import { useContacts } from '@/hooks/useContacts'
import { PROJECT_TYPES, APP_EMAIL, APP_PHONE, APP_LOCATION } from '@/lib/constants'

const WORKSPACE_IMG = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&fit=crop'

const CONTACT_DETAILS = [
  { icon: Mail,   label: 'Email Us',   value: APP_EMAIL,    sub: 'For general inquiries' },
  { icon: Phone,  label: 'Call / WhatsApp', value: APP_PHONE, sub: 'Mon–Sat, 9am–6pm EAT' },
  { icon: MapPin, label: 'Location',   value: APP_LOCATION, sub: 'Available for remote projects worldwide' },
  { icon: Clock,  label: 'Response',   value: '< 24 Hours', sub: 'Average reply time' },
]

const BUDGETS = ['Under KES 5,000','KES 5,000–15,000','KES 15,000–50,000','KES 50,000–150,000','KES 150,000+','Let\'s discuss']

const INITIAL = { name: '', email: '', phone: '', project_type: '', budget: '', message: '' }

const inputStyle = {
  width: '100%',
  background: 'var(--bg)',
  border: '1px solid var(--border-med)',
  borderRadius: 'var(--radius-md)',
  padding: '0.75rem 1rem 0.75rem 2.75rem',
  fontSize: '0.9rem',
  color: 'var(--text)',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

export default function Contact() {
  const [form, setForm]         = useState(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)
  const { submitContact }       = useContacts()

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const onFocus  = e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.1)' }
  const onBlur   = e => { e.target.style.borderColor = 'var(--border-med)'; e.target.style.boxShadow = 'none' }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.project_type || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    const contactResult = await submitContact(form)
    setLoading(false)
    if (contactResult.error) {
      toast.error('Something went wrong. Please try again.')
      return
    }
    setSubmitted(true)
    setForm(INITIAL)
    toast.success('Message sent! We\'ll reply within 24 hours.')
  }

  return (
    <PageWrapper>
      <SEO
        title="Contact Us — Get a Free Quote"
        description="Get in touch with Royal Graphix for web design, branding, graphic design, or SEO. Free consultation. Reply within 24 hours. Call +254 708 039 015."
        keywords="contact Royal Graphix, web design quote Kenya, get a quote, digital agency contact Nairobi"
        path="/contact"
      />

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '46vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={WORKSPACE_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.88) 60%, rgba(5,5,15,0.7) 100%)' }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', width: '100%', padding: 'calc(var(--nav-h) + 3rem) clamp(1.25rem,5vw,4.5rem) 4rem' }}>
          <span className="section-tag">Get in Touch</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Let\'s Build Something<br />
            <span style={{ background: 'linear-gradient(135deg, #C8102E, #FF4060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Amazing Together
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.75, fontSize: '1rem' }}>
            Fill out the form and we\'ll get back to you within 24 hours with a tailored proposal.
          </p>
        </motion.div>
      </section>

      {/* ── Body ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4.5rem)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>

          {/* Left: Info */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Why Work With Us?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              We\'ve built 10+ live sites for Kenyan brands. We reply fast, deliver on time, and our prices are transparent.
            </p>

            {CONTACT_DETAILS.map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} style={{ display: 'flex', gap: 14, marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="var(--red)" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.value}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                  </div>
                </div>
              )
            })}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              {[['10+','Live Websites Built'],['24h','Average Reply Time'],['98%','Client Satisfaction'],['5+','Years Experience']].map(([n,l]) => (
                <div key={l} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--red)', letterSpacing: '-0.03em' }}>{n}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.75rem,3vw,2.5rem)', boxShadow: 'var(--shadow-md)' }}>
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <CheckCircle size={52} color="var(--red)" strokeWidth={1.5} style={{ margin: '0 auto 1.25rem' }} />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>Message Received!</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 320, margin: '0 auto 1.75rem' }}>
                    Thanks for reaching out. We\'ll reply within 24 hours with a custom proposal.
                  </p>
                  <button onClick={() => setSubmitted(false)} style={{ background: 'transparent', border: '1px solid var(--border-med)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Send a Message</h3>

                  {/* Row 1: Name + Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <FieldWrap icon={<User size={15} color="var(--text-muted)" strokeWidth={2} />}>
                      <input type="text" name="name" value={form.name} onChange={onChange}
                        placeholder="Full Name *" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    </FieldWrap>
                    <FieldWrap icon={<Mail size={15} color="var(--text-muted)" strokeWidth={2} />}>
                      <input type="email" name="email" value={form.email} onChange={onChange}
                        placeholder="Email Address *" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    </FieldWrap>
                  </div>

                  {/* Row 2: Phone + Project Type */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <FieldWrap icon={<Phone size={15} color="var(--text-muted)" strokeWidth={2} />}>
                      <input type="tel" name="phone" value={form.phone} onChange={onChange}
                        placeholder="Phone / WhatsApp *" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    </FieldWrap>
                    <FieldWrap icon={<Briefcase size={15} color="var(--text-muted)" strokeWidth={2} />} trailingIcon={<ChevronDown size={14} color="var(--text-muted)" strokeWidth={2} />}>
                      <select name="project_type" value={form.project_type} onChange={onChange}
                        style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}>
                        <option value="">Service Type *</option>
                        {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </FieldWrap>
                  </div>

                  {/* Budget */}
                  <div style={{ marginBottom: '1rem' }}>
                    <FieldWrap icon={<DollarSign size={15} color="var(--text-muted)" strokeWidth={2} />} trailingIcon={<ChevronDown size={14} color="var(--text-muted)" strokeWidth={2} />}>
                      <select name="budget" value={form.budget} onChange={onChange}
                        style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}>
                        <option value="">Budget Range (optional)</option>
                        {BUDGETS.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </FieldWrap>
                  </div>

                  {/* Message */}
                  <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <MessageSquare size={15} color="var(--text-muted)" strokeWidth={2}
                      style={{ position: 'absolute', left: 11, top: 14, pointerEvents: 'none' }} />
                    <textarea name="message" value={form.message} onChange={onChange}
                      placeholder="Tell us about your project, goals, and timeline… *" rows={4}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 110, paddingTop: '0.75rem' }}
                      onFocus={onFocus} onBlur={onBlur} />
                  </div>

                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ width: '100%', background: loading ? 'var(--red-dark)' : 'var(--red)', color: 'white', border: 'none', padding: '0.9rem', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 16px var(--red-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Send size={16} strokeWidth={2} />
                    {loading ? 'Sending…' : 'Send Message'}
                  </motion.button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textAlign: 'center', marginTop: '0.75rem' }}>
                    We typically reply within 24 hours · No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </section>
    </PageWrapper>
  )
}

// ── Helper: input wrapper with leading + optional trailing icon ──────────────
function FieldWrap({ icon, trailingIcon, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1, display: 'flex' }}>
        {icon}
      </span>
      {children}
      {trailingIcon && (
        <span style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1, display: 'flex' }}>
          {trailingIcon}
        </span>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import SEO from '@/components/seo/SEO'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

const BG_IMG = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80&fit=crop'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) { toast.error(error.message || 'Invalid credentials'); return }
    toast.success('Welcome back!')
    navigate('/admin')
  }

  return (
    <>
      <SEO title="Admin Login" description="Royal Graphix admin portal." noindex path="/admin/login" />
      <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

        {/* Left: Image panel */}
        <div className="hide-mobile" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={BG_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,15,0.92) 0%, rgba(200,16,46,0.3) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'white', fontSize: '0.85rem' }}>RG</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'white', fontSize: '1rem' }}>Royal<span style={{ color: '#FF4060' }}>Graphix</span></span>
            </Link>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                Manage your<br />creative empire.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 360 }}>
                Your admin portal — portfolio, leads, analytics, blog, and settings — all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div style={{ background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ maxWidth: 420, width: '100%' }}>

            {/* Mobile logo */}
            <div className="hide-desktop" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'white', fontSize: '1rem', margin: '0 auto 0.75rem' }}>RG</div>
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>Admin Portal</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>Sign in to manage Royal Graphix</p>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>Email Address</label>
                <input type="email" value={form.email} placeholder="admin@royalgraphix.com"
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="input-base"
                  style={{ fontSize: '0.9rem' }} />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} value={form.password} placeholder="••••••••"
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="input-base"
                    style={{ paddingRight: '3rem', fontSize: '0.9rem' }} />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem', padding: '4px', display: 'flex', alignItems: 'center' }}>
                    {showPass ? <EyeOff size={16} strokeWidth={1.8}/> : <Eye size={16} strokeWidth={1.8}/>}
                  </button>
                </div>
              </div>

              <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{ width: '100%', background: loading ? 'var(--red-dark)' : 'var(--red)', color: 'white', border: 'none', padding: '0.875rem', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 16px var(--red-glow)', transition: 'background 0.2s' }}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </motion.button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--red)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                ← Back to Website
              </Link>
            </div>

            {/* Demo hint */}
            <div style={{ marginTop: '1.75rem', padding: '0.875rem 1.1rem', background: 'rgba(200,16,46,0.05)', border: '1px solid rgba(200,16,46,0.15)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text)' }}>Demo credentials:</strong><br />
              admin@royalgraphix.com / admin123
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

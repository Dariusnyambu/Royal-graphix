import { Helmet } from 'react-helmet-async'
import { Image, MessageSquare, FileText, Star, TrendingUp, Plus, ArrowRight, Briefcase, FileInput } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useContacts } from '@/hooks/useContacts'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { BLOG_POSTS } from '@/lib/constants'

const TYPE_COLORS = {
  'Web Design':    '#3b82f6', 'Branding': '#C8102E',
  'SEO':           '#10b981', 'Graphic Design': '#d97706',
  'UI/UX Design':  '#8b5cf6', 'Other': '#6b7280',
}

export default function Dashboard() {
  const { user }                   = useAuth()
  const { items: portfolio }       = usePortfolio()
  const { contacts }               = useContacts()

  const stats = [
    { icon: Image,        label: 'Portfolio Items',  value: portfolio.length, color: '#C8102E', link: '/admin/portfolio' },
    { icon: FileInput,    label: 'Form Submissions', value: contacts.length,  color: '#3b82f6', link: '/admin/submissions' },
    { icon: FileText,     label: 'Blog Posts',       value: BLOG_POSTS.length, color: '#10b981', link: '/admin/blog' },
    { icon: Star,         label: 'Avg. Rating',      value: '5.0',           color: '#f59e0b', link: null },
  ]

  const recentLeads = contacts.slice(0, 5)

  return (
    <>
      <Helmet><title>Dashboard — Royal Graphix Admin</title></Helmet>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            Welcome back, <strong style={{ color: 'var(--text)' }}>{user?.email?.split('@')[0]}</strong>
          </p>
        </div>
        <Link to="/admin/portfolio" style={{ textDecoration: 'none' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--red)', color: 'white', border: 'none', padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px var(--red-glow)' }}>
            <Plus size={14} strokeWidth={2.5} /> Add Project
          </button>
        </Link>
      </div>

      {/* Stat Cards */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <motion.div key={s.label} variants={staggerItem}>
            {s.link ? (
              <Link to={s.link} style={{ textDecoration: 'none' }}>
                <StatCard stat={s} />
              </Link>
            ) : <StatCard stat={s} />}
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Submissions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

        {/* Recent leads table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
              <MessageSquare size={16} color="var(--red)" strokeWidth={1.8} /> Recent Leads
            </h2>
            <Link to="/admin/submissions" style={{ fontSize: '0.78rem', color: 'var(--red)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {recentLeads.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No submissions yet.</div>
            ) : recentLeads.map((c, i) => {
              const clr = TYPE_COLORS[c.project_type] || '#6b7280'
              return (
                <div key={c.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem 1rem', borderBottom: i < recentLeads.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${clr}1a`, border: `1px solid ${clr}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Briefcase size={14} color={clr} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.project_type}</div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', flexShrink: 0 }}>{c.created_at?.split('T')[0] || '—'}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent portfolio */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Image size={16} color="var(--red)" strokeWidth={1.8} /> Recent Projects
            </h2>
            <Link to="/admin/portfolio" style={{ fontSize: '0.78rem', color: 'var(--red)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              Manage <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {portfolio.slice(0, 5).map(p => (
              <div key={p.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: 12, transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-med)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--bg2)' }}>
                  {p.image_url
                    ? <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{p.emoji}</div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--red)', fontWeight: 600, marginTop: 2 }}>{p.category}</div>
                </div>
                {p.live_url && (
                  <a href={p.live_url} target="_blank" rel="noopener noreferrer" title="Visit site"
                    style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <ArrowRight size={14} strokeWidth={2} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 7 }}>
          <TrendingUp size={16} color="var(--red)" strokeWidth={1.8} /> Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'View All Submissions', to: '/admin/submissions', icon: FileInput },
            { label: 'Add Portfolio Project', to: '/admin/portfolio',   icon: Image },
            { label: 'Write Blog Post',       to: '/admin/blog',        icon: FileText },
            { label: 'View Analytics',        to: '/admin/analytics',   icon: TrendingUp },
          ].map(({ label, to, icon: Icon }) => (
            <Link key={label} to={to} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px var(--red-glow)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <Icon size={16} color="var(--red)" strokeWidth={1.8} />
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)' }}>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

function StatCard({ stat }) {
  const Icon = stat.icon
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = stat.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}22` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <Icon size={18} color={stat.color} strokeWidth={1.8} style={{ marginBottom: '0.6rem' }} />
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1 }}>{stat.value}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 5, fontWeight: 500 }}>{stat.label}</div>
    </div>
  )
}

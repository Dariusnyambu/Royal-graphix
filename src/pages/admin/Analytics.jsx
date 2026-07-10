import React from 'react'
import { Eye, TrendingUp, MessageSquare, BarChart2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const MONTHLY = [
  { label: 'Dec', visits: 1200, leads: 18 },
  { label: 'Jan', visits: 1850, leads: 24 },
  { label: 'Feb', visits: 2100, leads: 31 },
  { label: 'Mar', visits: 1780, leads: 27 },
  { label: 'Apr', visits: 2600, leads: 42 },
  { label: 'May', visits: 3100, leads: 58 },
]

const SOURCES = [
  { label: 'Organic Search', pct: 42, color: '#C8102E' },
  { label: 'Direct', pct: 28, color: '#E8604A' },
  { label: 'Referral', pct: 18, color: '#555' },
  { label: 'Social Media', pct: 12, color: '#888' },
]

const TOP_PAGES = [
  { path: '/', title: 'Home', views: 3240, bounce: '38%' },
  { path: '/portfolio', title: 'Portfolio', views: 2180, bounce: '42%' },
  { path: '/services', title: 'Services', views: 1760, bounce: '35%' },
  { path: '/contact', title: 'Contact', views: 980, bounce: '22%' },
  { path: '/blog', title: 'Blog', views: 870, bounce: '55%' },
]

export default function Analytics() {
  const maxVisits = Math.max(...MONTHLY.map(d => d.visits))
  const totalVisits = MONTHLY.reduce((a, d) => a + d.visits, 0)
  const totalLeads = MONTHLY.reduce((a, d) => a + d.leads, 0)
  const convRate = ((totalLeads / totalVisits) * 100).toFixed(1)
  const growth = Math.round(((MONTHLY.at(-1).visits - MONTHLY[0].visits) / MONTHLY[0].visits) * 100)

  const STATS = [
    { icon: Eye,         label: 'Total Visits', value: totalVisits.toLocaleString(), sub: 'Last 6 months', color: '#C8102E' },
    { icon: MessageSquare, label: 'Total Leads', value: totalLeads, sub: 'Form submissions', color: '#3b82f6' },
    { icon: BarChart2,   label: 'Conv. Rate', value: `${convRate}%`, sub: 'Visits to leads', color: '#10b981' },
    { icon: TrendingUp,  label: 'Growth', value: `+${growth}%`, sub: 'Dec → May', color: '#f59e0b' },
  ]

  return (
    <>
      <Helmet><title>Analytics — Royal Graphix Admin</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Last 6 months overview</p>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.4rem 0.875rem', borderRadius: 8 }}>
          Dec 2024 – May 2025
        </span>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ marginBottom:'0.5rem' }}>{React.createElement(s.icon, {size:18, color:s.color, strokeWidth:1.8})}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Bar Chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Monthly Visitors
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, paddingBottom: '1.5rem' }}>
            {MONTHLY.map((d, i) => (
              <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {(d.visits / 1000).toFixed(1)}k
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: Math.round((d.visits / maxVisits) * 110) }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  style={{ width: '100%', background: 'var(--red)', borderRadius: '4px 4px 0 0', opacity: 0.85, minHeight: 4, cursor: 'default' }}
                  title={`${d.visits.toLocaleString()} visits`}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0.85}
                />
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Traffic Sources
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {SOURCES.map((s, i) => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>{s.pct}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    style={{ height: '100%', background: s.color, borderRadius: 3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
          Monthly Breakdown
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Month', 'Visits', 'Leads', 'Conv. Rate', 'Trend'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MONTHLY.map((d, i) => {
              const prev = MONTHLY[i - 1]
              const up = prev ? d.visits >= prev.visits : null
              const cr = ((d.leads / d.visits) * 100).toFixed(1)
              return (
                <tr key={d.label} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.875rem 1.25rem', fontWeight: 500, borderBottom: i < MONTHLY.length - 1 ? '1px solid var(--border)' : 'none' }}>{d.label} 2025</td>
                  <td style={{ padding: '0.875rem 1.25rem', borderBottom: i < MONTHLY.length - 1 ? '1px solid var(--border)' : 'none' }}>{d.visits.toLocaleString()}</td>
                  <td style={{ padding: '0.875rem 1.25rem', borderBottom: i < MONTHLY.length - 1 ? '1px solid var(--border)' : 'none' }}>{d.leads}</td>
                  <td style={{ padding: '0.875rem 1.25rem', borderBottom: i < MONTHLY.length - 1 ? '1px solid var(--border)' : 'none' }}>{cr}%</td>
                  <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, color: up === null ? 'var(--text-muted)' : up ? '#22c55e' : '#ef4444', borderBottom: i < MONTHLY.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    {up === null ? '—' : up ? '↑' : '↓'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Top Pages */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
          Top Pages
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Page', 'URL', 'Page Views', 'Bounce Rate'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOP_PAGES.map((p, i) => (
              <tr key={p.path} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '0.875rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', borderBottom: i < TOP_PAGES.length - 1 ? '1px solid var(--border)' : 'none' }}>{p.title}</td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'monospace', borderBottom: i < TOP_PAGES.length - 1 ? '1px solid var(--border)' : 'none' }}>{p.path}</td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', borderBottom: i < TOP_PAGES.length - 1 ? '1px solid var(--border)' : 'none' }}>{p.views.toLocaleString()}</td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: parseInt(p.bounce) < 30 ? '#22c55e' : parseInt(p.bounce) < 45 ? '#f59e0b' : '#ef4444', fontWeight: 600, borderBottom: i < TOP_PAGES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  {p.bounce}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

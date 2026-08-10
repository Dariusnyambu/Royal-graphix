import React, { useState } from 'react'
import { Eye, TrendingUp, MessageSquare, BarChart2, Radio, FileText } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useContacts } from '@/hooks/useContacts'
import { useAdminBlog } from '@/hooks/useBlog'

const PAGE_LABELS = {
  '/': 'Home', '/services': 'Services', '/portfolio': 'Portfolio', '/blog': 'Blog',
  '/pricing': 'Pricing', '/reviews': 'Reviews', '/careers': 'Careers', '/contact': 'Contact',
  '/track': 'Track Project', '/refer': 'Refer & Earn',
}
const pageTitle = (path) => PAGE_LABELS[path] || (path.startsWith('/blog/') ? 'Blog Article' : path)

export default function Analytics() {
  const [range, setRange] = useState(30)
  const { totalViews, uniqueSessions, liveNow, topPages, dailySeries, loading } = useAnalytics(range)
  const { contacts } = useContacts()
  const { posts } = useAdminBlog()

  const totalLeads = contacts.length
  const convRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : '0.0'
  const maxDaily = Math.max(1, ...dailySeries.map(d => d.count))
  const half = Math.ceil(dailySeries.length / 2)
  const firstHalf = dailySeries.slice(0, half).reduce((s, d) => s + d.count, 0)
  const secondHalf = dailySeries.slice(half).reduce((s, d) => s + d.count, 0)
  const growth = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : (secondHalf > 0 ? 100 : 0)

  const STATS = [
    { icon: Eye,           label: 'Page Views',  value: totalViews.toLocaleString(),    sub: `Last ${range} days`,        color: '#C8102E' },
    { icon: Radio,         label: 'Live Now',    value: liveNow,                        sub: 'Active in last 5 min',      color: '#22c55e' },
    { icon: MessageSquare, label: 'Total Leads', value: totalLeads,                     sub: 'Form submissions',          color: '#3b82f6' },
    { icon: BarChart2,     label: 'Conv. Rate',  value: `${convRate}%`,                 sub: 'Views to leads',            color: '#10b981' },
    { icon: TrendingUp,    label: 'Trend',       value: `${growth >= 0 ? '+' : ''}${growth}%`, sub: 'vs. previous period', color: '#f59e0b' },
  ]

  const topPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)

  // Show at most ~14 bars for readability even over a 90-day range.
  const displaySeries = dailySeries.length > 14
    ? dailySeries.filter((_, i) => i % Math.ceil(dailySeries.length / 14) === 0)
    : dailySeries

  return (
    <>
      <Helmet><title>Analytics — Royal Graphix Admin</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }} />
            Live — updates automatically as visitors browse the site
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setRange(d)} style={{
              padding: '0.4rem 0.9rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600,
              border: '1px solid', borderColor: range === d ? 'var(--red)' : 'var(--border)',
              background: range === d ? 'var(--red)' : 'var(--surface)',
              color: range === d ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>{d}d</button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>{React.createElement(s.icon, { size: 18, color: s.color, strokeWidth: 1.8 })}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Top Pages */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Page Views Over Time
          </div>
          {!loading && totalViews === 0 ? (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No traffic recorded yet — data will appear as visitors browse the site.
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140, paddingBottom: '1.5rem' }}>
              {displaySeries.map((d, i) => (
                <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.count}</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: Math.max(3, Math.round((d.count / maxDaily) * 110)) }}
                    transition={{ delay: i * 0.03, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    style={{ width: '100%', background: 'var(--red)', borderRadius: '4px 4px 0 0', opacity: 0.85, minHeight: 3, cursor: 'default' }}
                    title={`${d.count} views on ${d.date}`}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.85}
                  />
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            Top Pages
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topPages.length === 0 && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No page views yet.</div>}
            {topPages.map(p => {
              const pct = totalViews > 0 ? Math.round((p.count / totalViews) * 100) : 0
              return (
                <div key={p.path}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: 600 }}>{pageTitle(p.path)}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{p.count}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
                      style={{ height: '100%', background: 'var(--red)', borderRadius: 3 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Blog Performance */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={16} /> Blog Post Performance
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Post', 'Category', 'Status', 'Reads'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topPosts.map((p, i) => (
              <tr key={p.id} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '0.875rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', borderBottom: i < topPosts.length - 1 ? '1px solid var(--border)' : 'none' }}>{p.title}</td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)', borderBottom: i < topPosts.length - 1 ? '1px solid var(--border)' : 'none' }}>{p.category}</td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.82rem', borderBottom: i < topPosts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 100, background: p.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.12)', color: p.status === 'published' ? '#10b981' : '#6b7280', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{p.status}</span>
                </td>
                <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, borderBottom: i < topPosts.length - 1 ? '1px solid var(--border)' : 'none' }}>{(p.views || 0).toLocaleString()}</td>
              </tr>
            ))}
            {topPosts.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No blog posts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

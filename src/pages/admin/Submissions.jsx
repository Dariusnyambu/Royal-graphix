import { useState } from 'react'
import { Search, Mail, Trash2, Eye, Download, Filter, CheckCircle, Clock, AlertCircle, FileSpreadsheet, MessageSquare } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useContacts } from '@/hooks/useContacts'
import Modal from '@/components/ui/Modal'
import Skeleton from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'

const TYPE_CONFIG = {
  'Web Design':         { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
  'Web App Development':{ bg: 'rgba(99,102,241,0.1)',  color: '#818cf8' },
  'Branding':           { bg: 'rgba(200,16,46,0.1)',   color: '#C8102E' },
  'Graphic Design':     { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
  'SEO Optimization':   { bg: 'rgba(16,185,129,0.1)',  color: '#10b981' },
  'UI/UX Design':       { bg: 'rgba(139,92,246,0.1)',  color: '#8b5cf6' },
  'Other':              { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
}

function getBadge(type) {
  return TYPE_CONFIG[type] || { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' }
}

export default function Submissions() {
  const { contacts, loading, error, refetch, deleteContact } = useContacts()
  const [search, setSearch]       = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [selected, setSelected]   = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const types = ['All', ...Array.from(new Set(contacts.map(c => c.project_type).filter(Boolean)))]

  const filtered = contacts.filter(c => {
    const matchSearch = !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.message?.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || c.project_type === typeFilter
    return matchSearch && matchType
  })

  const handleDelete = async id => {
    const { error } = await deleteContact(id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Submission deleted')
    setDeleteConfirm(null)
    setSelected(null)
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Project Type', 'Budget', 'Message', 'Date']
    const rows = filtered.map(c => [
      c.name, c.email, c.phone || '—', c.project_type, c.budget || '—', c.message, c.created_at?.split('T')[0] || '—'
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `royal-graphix-submissions-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported!')
  }

  // Summary stats
  const total   = contacts.length
  const thisWeek = contacts.filter(c => {
    const d = new Date(c.created_at)
    return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000
  }).length
  const topType = contacts.length
    ? Object.entries(contacts.reduce((acc, c) => { acc[c.project_type] = (acc[c.project_type]||0)+1; return acc }, {})).sort((a,b)=>b[1]-a[1])[0]?.[0]
    : '—'

  return (
    <>
      <Helmet><title>Form Submissions — Royal Graphix Admin</title></Helmet>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Form Submissions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>All contact form entries — view, filter, export, and manage.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button onClick={exportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-med)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <Download size={14} strokeWidth={2} /> Export CSV
          </button>
          <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-med)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <FileSpreadsheet size={14} strokeWidth={2} /> Google Sheet
          </a>
        </div>
      </div>

      {/* Diagnostic banner — only shows if something is actually wrong */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <AlertCircle size={18} color="#ef4444" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ef4444', marginBottom: 4 }}>
              Could not load submissions from Supabase
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 8 }}>
              {error}
              {error.toLowerCase().includes('row') || error.toLowerCase().includes('policy') || error.toLowerCase().includes('permission') ? (
                <> — this usually means Row Level Security is blocking reads. Run the migration in <code style={{ background: 'var(--bg2)', padding: '1px 5px', borderRadius: 4 }}>supabase/migrations/002_fix_contacts_rls.sql</code> inside your Supabase SQL Editor.</>
              ) : null}
            </div>
            <button onClick={refetch}
              style={{ fontSize: '0.78rem', fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && contacts.length === 0 && (
        <div style={{
          background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.25)',
          borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <AlertCircle size={18} color="#3b82f6" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#3b82f6', marginBottom: 4 }}>
              Connected to Supabase, but the contacts table is empty
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              The dashboard connected successfully and found zero rows. If people have submitted the contact form and you don't see them here, check that the form's Supabase insert is succeeding (open browser console on the Contact page after submitting — look for "[Contact Form]" logs).
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: CheckCircle, label: 'Total Submissions', value: total,    color: '#C8102E' },
          { icon: Clock,       label: 'This Week',         value: thisWeek, color: '#3b82f6' },
          { icon: AlertCircle, label: 'Top Request',       value: topType || '—', color: '#f59e0b', small: true },
          { icon: Filter,      label: 'Filtered Results',  value: filtered.length, color: '#10b981' },
        ].map(({ icon: Icon, label, value, color, small }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.1rem' }}>
            <Icon size={16} color={color} strokeWidth={1.8} style={{ marginBottom: 8 }} />
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: small ? '0.95rem' : '1.7rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} color="var(--text-muted)" strokeWidth={2} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, message…"
            style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border-med)', borderRadius: 'var(--radius-sm)', padding: '0.55rem 1rem 0.55rem 2.2rem', fontSize: '0.875rem', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'var(--red)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-med)'}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{ padding: '0.42rem 0.9rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 500, border: '1px solid', fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all 0.2s', borderColor: typeFilter === t ? 'var(--red)' : 'var(--border-med)', background: typeFilter === t ? 'var(--red)' : 'transparent', color: typeFilter === t ? 'white' : 'var(--text-muted)' }}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array(5).fill(0).map((_, i) => <Skeleton key={i} height={52} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <MessageSquare size={32} strokeWidth={1.2} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            No submissions found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Phone', 'Project Type', 'Budget', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const badge = getBadge(c.project_type)
                  return (
                    <motion.tr key={c.id || i}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => setSelected(c)}
                    >
                      <td style={{ padding: '0.875rem 1rem', borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>{c.name}</div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {c.email}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none', fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {c.phone || '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 100, background: badge.bg, color: badge.color, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                          {c.project_type || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none', fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {c.budget || '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none', fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {c.created_at?.split('T')[0] || '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none' }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button onClick={() => setSelected(c)} title="View"
                            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                          ><Eye size={13} strokeWidth={2} /></button>
                          <a href={`mailto:${c.email}`} title="Reply by email"
                            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s', textDecoration: 'none' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#3b82f6' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                          ><Mail size={13} strokeWidth={2} /></a>
                          <button onClick={() => setDeleteConfirm(c)} title="Delete"
                            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                          ><Trash2 size={13} strokeWidth={2} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.75rem', textAlign: 'right' }}>
        Showing {filtered.length} of {total} submissions
      </p>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Submission Details">
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              {[['Name', selected.name], ['Email', selected.email], ['Phone', selected.phone||'—'], ['Project Type', selected.project_type], ['Budget', selected.budget||'—'], ['Date', selected.created_at?.split('T')[0]||'—']].map(([k,v]) => (
                <div key={k}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 8 }}>Message</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.75, background: 'var(--bg2)', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--red)' }}>
                {selected.message}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href={`mailto:${selected.email}?subject=Re: Your Royal Graphix Inquiry`}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'var(--red)', color: 'white', border: 'none', padding: '0.7rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', textDecoration: 'none', boxShadow: '0 4px 14px var(--red-glow)' }}>
                <Mail size={14} strokeWidth={2} /> Reply by Email
              </a>
              <button onClick={() => { setDeleteConfirm(selected); setSelected(null) }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.7rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#ef4444', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                <Trash2 size={14} strokeWidth={2} /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Submission">
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Delete submission from <strong style={{ color: 'var(--text)' }}>{deleteConfirm?.name}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => handleDelete(deleteConfirm.id)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#ef4444', color: 'white', border: 'none', padding: '0.7rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            <Trash2 size={14} strokeWidth={2} /> Yes, Delete
          </button>
          <button onClick={() => setDeleteConfirm(null)}
            style={{ padding: '0.7rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-med)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Cancel
          </button>
        </div>
      </Modal>
    </>
  )
}

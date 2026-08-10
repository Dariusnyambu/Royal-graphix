import { useState } from 'react'
import { Edit2, Trash2, Eye, Plus, Search, Download, X, Check, FileText, Image, BarChart2, Users, Mail } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { useContacts } from '@/hooks/useContacts'
import Modal from '@/components/ui/Modal'
import Skeleton from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'

export default function AdminContacts() {
  const { contacts, loading, deleteContact } = useContacts()
  const [selected, setSelected] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.project_type?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    const { error } = await deleteContact(id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Lead deleted')
    setDeleteConfirm(null)
    setSelected(null)
  }

  const TYPE_COLORS = {
    'Web Design': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
    'Branding': { bg: 'rgba(200,16,46,0.1)', color: '#C8102E' },
    'SEO': { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
    'Graphic Design': { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
    'UI/UX Design': { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
  }

  return (
    <>
      <Helmet><title>Contact Leads — Royal Graphix Admin</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Contact Leads</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            {contacts.length} total lead{contacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        {/* Search */}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search leads..."
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
            padding: '0.55rem 1rem', fontSize: '0.875rem', color: 'var(--text)',
            fontFamily: 'var(--font-body)', outline: 'none', width: 220,
          }}
          onFocus={e => e.target.style.borderColor = 'var(--red)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array(5).fill(0).map((_, i) => <Skeleton key={i} height={52} />)}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Name', 'Email', 'Project Type', 'Message', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const tc = TYPE_COLORS[c.project_type] || { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' }
                return (
                  <tr key={c.id || i} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} style={{ cursor: 'pointer' }}>
                    <td onClick={() => setSelected(c)} style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: 600, borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>{c.name}</td>
                    <td onClick={() => setSelected(c)} style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>{c.email}</td>
                    <td onClick={() => setSelected(c)} style={{ padding: '0.875rem 1rem', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 100, background: tc.bg, color: tc.color, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        {c.project_type}
                      </span>
                    </td>
                    <td onClick={() => setSelected(c)} style={{ padding: '0.875rem 1rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--text-muted)', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      {c.message}
                    </td>
                    <td onClick={() => setSelected(c)} style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      {c.created_at?.split('T')[0] || '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <button onClick={() => setDeleteConfirm(c)} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.05)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                      ><Trash2 size={13} strokeWidth={2} /></button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No leads found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Lead Details">
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              {[['Name', selected.name], ['Email', selected.email], ['Project Type', selected.project_type], ['Date', selected.created_at?.split('T')[0] || '—']].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>Message</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, background: 'var(--bg2)', padding: '1rem', borderRadius: 8 }}>
                {selected.message}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <a href={`mailto:${selected.email}`} style={{ textDecoration: 'none', flex: 1 }}>
                <Button style={{ width: '100%', justifyContent: 'center' }}>Reply by Email ↗</Button>
              </a>
              <Button variant="outline" onClick={() => { setDeleteConfirm(selected); setSelected(null) }}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Lead">
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Delete the lead from <strong style={{ color: 'var(--text)' }}>{deleteConfirm?.name}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button onClick={() => handleDelete(deleteConfirm.id)} style={{ background: '#ef4444', flex: 1, justifyContent: 'center' }}>Delete</Button>
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
        </div>
      </Modal>
    </>
  )
}

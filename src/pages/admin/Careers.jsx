import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trash2, ExternalLink, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAdminJobApplications } from '@/hooks/useJobApplications'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'

const STATUS_COLORS = {
  new:         { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
  reviewed:    { bg: 'rgba(245,158,11,0.1)',   color: '#d97706' },
  shortlisted: { bg: 'rgba(16,185,129,0.1)',   color: '#10b981' },
  rejected:    { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
}

export default function AdminCareers() {
  const { applications, loading, updateStatus, deleteApplication } = useAdminJobApplications()
  const [viewApp, setViewApp] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [roleFilter, setRoleFilter] = useState('All')

  const roles = ['All', ...Array.from(new Set(applications.map(a => a.role)))]
  const filtered = roleFilter === 'All' ? applications : applications.filter(a => a.role === roleFilter)

  const handleStatus = async (id, status) => {
    const { error } = await updateStatus(id, status)
    if (error) { toast.error('Could not update status'); return }
    toast.success('Status updated')
  }

  const handleDelete = async (id) => {
    const { error } = await deleteApplication(id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Application deleted')
    setDeleteConfirm(null)
    setViewApp(null)
  }

  return (
    <>
      <Helmet><title>Applications — Royal Graphix Admin</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Job Applications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>{applications.length} total applications</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {roles.map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{
              padding: '0.4rem 0.9rem', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600,
              border: '1px solid', borderColor: roleFilter === r ? 'var(--red)' : 'var(--border)',
              background: roleFilter === r ? 'var(--red)' : 'transparent',
              color: roleFilter === r ? 'white' : 'var(--text-muted)', cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}>{r}</button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} height={52} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Applicant', 'Role', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const isLast = i === filtered.length - 1
                const sc = STATUS_COLORS[a.status] || STATUS_COLORS.new
                return (
                  <tr key={a.id} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)', cursor: 'pointer' }} onClick={() => setViewApp(a)}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{a.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.email}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>{a.role}</td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <select value={a.status} onChange={e => handleStatus(a.id, e.target.value)} style={{
                        padding: '4px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.05em', background: sc.bg, color: sc.color, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                      }}>
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <IconBtn onClick={() => setDeleteConfirm(a)} danger title="Delete"><Trash2 size={13} strokeWidth={2} /></IconBtn>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No applications yet.</td></tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal open={!!viewApp} onClose={() => setViewApp(null)} title={viewApp?.name} maxWidth={480}>
        {viewApp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <Row label="Role" value={viewApp.role} />
            <Row label="Email" value={<a href={`mailto:${viewApp.email}`} style={{ color: 'var(--red)', display: 'inline-flex', gap: 5, alignItems: 'center' }}><Mail size={13} /> {viewApp.email}</a>} />
            {viewApp.phone && <Row label="Phone" value={<a href={`tel:${viewApp.phone}`} style={{ color: 'var(--red)', display: 'inline-flex', gap: 5, alignItems: 'center' }}><Phone size={13} /> {viewApp.phone}</a>} />}
            {viewApp.portfolio_url && <Row label="Portfolio" value={<a href={viewApp.portfolio_url} target="_blank" rel="noreferrer" style={{ color: 'var(--red)', display: 'inline-flex', gap: 5, alignItems: 'center' }}><ExternalLink size={13} /> View link</a>} />}
            {viewApp.message && (
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Message</div>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: 'var(--text)' }}>{viewApp.message}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Application">
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Delete the application from <strong style={{ color: 'var(--text)' }}>{deleteConfirm?.name}</strong>?
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button onClick={() => handleDelete(deleteConfirm.id)} style={{ background: '#ef4444', flex: 1, justifyContent: 'center' }}>Delete</Button>
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
        </div>
      </Modal>
    </>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  )
}

function IconBtn({ onClick, danger, title, children }) {
  return (
    <button onClick={onClick} title={title} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = danger ? '#ef4444' : 'var(--red)'; e.currentTarget.style.color = danger ? '#ef4444' : 'var(--red)'; e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.05)' : 'rgba(200,16,46,0.05)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}>
      {children}
    </button>
  )
}

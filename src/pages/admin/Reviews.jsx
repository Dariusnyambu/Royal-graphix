import { useState } from 'react'
import { Star, Trash2, EyeOff, Eye, Search } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { useAdminReviews } from '@/hooks/useReviews'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} strokeWidth={0} fill={i < rating ? '#f59e0b' : 'var(--border-med)'} />
      ))}
    </div>
  )
}

export default function AdminReviews() {
  const { reviews, loading, toggleHidden, deleteReview } = useAdminReviews()
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const visible = reviews.filter(r => !r.hidden)
  const avgRating = visible.length ? (visible.reduce((s, r) => s + r.rating, 0) / visible.length).toFixed(1) : '—'

  const filtered = reviews.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.message?.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggle = async (r) => {
    const { error } = await toggleHidden(r)
    if (error) { toast.error('Could not update review'); return }
    toast.success(r.hidden ? 'Review is now visible on the site' : 'Review hidden from the site')
  }

  const handleDelete = async (id) => {
    const { error } = await deleteReview(id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Review deleted')
    setDeleteConfirm(null)
  }

  return (
    <>
      <Helmet><title>Reviews — Royal Graphix Admin</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Reviews</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            {visible.length} live on site · {reviews.length - visible.length} hidden · {avgRating} avg rating
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..."
            style={{ padding: '0.55rem 1rem 0.55rem 2.1rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: '0.85rem', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none', width: 220 }} />
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} height={64} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Reviewer', 'Rating', 'Review', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const isLast = i === filtered.length - 1
                return (
                  <tr key={r.id} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.name}</div>
                      {r.role && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{r.role}</div>}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <Stars rating={r.rating} />
                    </td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)', maxWidth: 340 }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{r.message}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: r.hidden ? 'rgba(107,114,128,0.12)' : 'rgba(16,185,129,0.1)', color: r.hidden ? '#6b7280' : '#10b981' }}>
                        {r.hidden ? 'Hidden' : 'Live'}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <IconBtn onClick={() => handleToggle(r)} title={r.hidden ? 'Show on site' : 'Hide from site'}>
                          {r.hidden ? <Eye size={13} strokeWidth={2} /> : <EyeOff size={13} strokeWidth={2} />}
                        </IconBtn>
                        <IconBtn onClick={() => setDeleteConfirm(r)} danger title="Delete"><Trash2 size={13} strokeWidth={2} /></IconBtn>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet.</td></tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Review">
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Delete the review from <strong style={{ color: 'var(--text)' }}>{deleteConfirm?.name}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button onClick={() => handleDelete(deleteConfirm.id)} style={{ background: '#ef4444', flex: 1, justifyContent: 'center' }}>Delete</Button>
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
        </div>
      </Modal>
    </>
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

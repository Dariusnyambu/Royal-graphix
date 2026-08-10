import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Search, Edit2, Trash2, Eye, X, Check, DollarSign, AlertCircle, Gift } from 'lucide-react'
import { useReferrals, REFERRAL_STATUSES, getReferralStatus, calcCommission } from '@/hooks/useReferrals'

const inp = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border-med)',
  borderRadius: 10, padding: '0.6rem 0.875rem', fontSize: '0.875rem',
  color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none',
}

export default function AdminReferrals() {
  const { referrals, loading, error, stats, updateReferral, deleteReferral, fetchReferrals } = useReferrals()

  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState('all')
  const [editRef, setEditRef]     = useState(null)
  const [viewRef, setViewRef]     = useState(null)
  const [deleting, setDeleting]   = useState(null)
  const [saving, setSaving]       = useState(false)
  const [editForm, setEditForm]   = useState({})

  const filtered = referrals.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    const q = search.toLowerCase()
    const matchSearch = !q ||
      r.referrer_name?.toLowerCase().includes(q) ||
      r.referred_name?.toLowerCase().includes(q) ||
      r.referral_code?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const openEdit = (r) => {
    setEditForm({
      status:           r.status,
      project_amount:   r.project_amount || '',
      commission_amount: r.commission_amount || '',
      notes:            r.notes || '',
    })
    setEditRef(r)
  }

  const handleSave = async () => {
    setSaving(true)
    const updates = {
      ...editForm,
      project_amount:   editForm.project_amount   ? parseFloat(editForm.project_amount)   : 0,
      commission_amount: editForm.commission_amount ? parseFloat(editForm.commission_amount) : 0,
    }
    const { error: err } = await updateReferral(editRef.id, updates)
    setSaving(false)
    if (err) { toast.error('Update failed'); return }
    toast.success('Referral updated!')
    setEditRef(null)
  }

  const autoCalcCommission = () => {
    const amt = parseFloat(editForm.project_amount) || 0
    setEditForm(p => ({ ...p, commission_amount: calcCommission(amt) }))
  }

  const handleDelete = async (id) => {
    if (deleting !== id) { setDeleting(id); return }
    await deleteReferral(id)
    setDeleting(null)
    toast.success('Referral deleted')
  }

  return (
    <div style={{ padding: 'clamp(1.5rem,3vw,2.5rem)', maxWidth: 1300, margin: '0 auto' }}>
      <Helmet><title>Referrals — Admin | Royal Graphix</title></Helmet>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.2rem' }}>Refer & Earn</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track referrals, update project amounts, and manage commission payouts.</p>
        </div>
        <button onClick={fetchReferrals}
          style={{ padding: '0.65rem 1.25rem', borderRadius: 10, border: '1px solid var(--border-med)', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '0.875rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total Referrals',   value: stats.total,                              color: '#6366f1' },
          { label: 'Pending',           value: stats.pending,                             color: '#f59e0b' },
          { label: 'Completed',         value: stats.completed,                           color: '#22c55e' },
          { label: 'Commission Paid',   value: stats.paid,                                color: '#10b981' },
          { label: 'Total Commission',  value: `KES ${stats.totalCommission.toLocaleString()}`, color: '#C8102E' },
          { label: 'Pending Payout',    value: `KES ${stats.pendingPayout.toLocaleString()}`,   color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or referral code…"
            style={{ ...inp, paddingLeft: 34 }}
            onFocus={e => e.target.style.borderColor = 'var(--red)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-med)'}
          />
        </div>
        <select value={filterStatus} onChange={e => setFilter(e.target.value)}
          style={{ ...inp, width: 'auto', minWidth: 160, cursor: 'pointer', appearance: 'none', paddingRight: '2rem' }}>
          <option value="all">All Statuses</option>
          {REFERRAL_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '0.875rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: 10 }}>
          <AlertCircle size={16} color="#f59e0b" />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing sample data — run migration 004 in Supabase SQL Editor to create the referrals table.
          </span>
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading referrals…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No referrals found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                  {['Referrer', 'Referred Person', 'Code', 'Service', 'Project Amt', 'Commission', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const sc = getReferralStatus(r.status)
                  return (
                    <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.referrer_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.referrer_phone || '—'}</div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{r.referred_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.referred_phone || '—'}</div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <code style={{ fontSize: '0.75rem', fontFamily: 'monospace', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', padding: '3px 8px', borderRadius: 6, color: '#f59e0b', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                          {r.referral_code}
                        </code>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{r.referred_service || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {r.project_amount ? `KES ${Number(r.project_amount).toLocaleString()}` : '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#f59e0b' }}>
                          {r.commission_amount ? `KES ${Number(r.commission_amount).toLocaleString()}` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, color: sc.color, background: sc.bg, border: `1px solid ${sc.color}44`, whiteSpace: 'nowrap' }}>
                          {sc.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setViewRef(r)} title="View"
                            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <Eye size={13} strokeWidth={2} />
                          </button>
                          <button onClick={() => openEdit(r)} title="Edit"
                            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <Edit2 size={13} strokeWidth={2} />
                          </button>
                          <button onClick={() => handleDelete(r.id)} title={deleting === r.id ? 'Click again to confirm' : 'Delete'}
                            style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${deleting === r.id ? '#ef4444' : 'var(--border)'}`, background: deleting === r.id ? 'rgba(239,68,68,0.1)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: deleting === r.id ? '#ef4444' : 'var(--text-muted)' }}>
                            <Trash2 size={13} strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editRef && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
              style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: 500, boxShadow: '0 24px 72px rgba(0,0,0,0.4)', position: 'relative' }}>
              <button onClick={() => setEditRef(null)}
                style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <X size={13} strokeWidth={2.5} />
              </button>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.25rem' }}>Edit Referral</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Code: <strong style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{editRef.referral_code}</strong>
                {' · '}{editRef.referrer_name} → {editRef.referred_name}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Status */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</label>
                  <select value={editForm.status || ''} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                    style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border-med)'}>
                    {REFERRAL_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>

                {/* Project amount */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project Amount (KES)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="number" value={editForm.project_amount || ''} onChange={e => setEditForm(p => ({ ...p, project_amount: e.target.value }))}
                      placeholder="e.g. 30000" style={{ ...inp, flex: 1 }}
                      onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border-med)'} />
                    <button type="button" onClick={autoCalcCommission} title="Auto-calculate 20% commission"
                      style={{ padding: '0 14px', borderRadius: 10, border: '1px solid #f59e0b', background: 'rgba(245,158,11,0.1)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                      <DollarSign size={13} strokeWidth={2} style={{ display: 'inline', marginRight: 3 }} />
                      Auto 20%
                    </button>
                  </div>
                </div>

                {/* Commission */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Commission Amount (KES)</label>
                  <input type="number" value={editForm.commission_amount || ''} onChange={e => setEditForm(p => ({ ...p, commission_amount: e.target.value }))}
                    placeholder="e.g. 6000" style={inp}
                    onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border-med)'} />
                </div>

                {/* Notes */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notes</label>
                  <textarea value={editForm.notes || ''} onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))}
                    rows={3} placeholder="Internal notes about this referral…" style={{ ...inp, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border-med)'} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setEditRef(null)}
                  style={{ padding: '0.7rem 1.5rem', borderRadius: 10, border: '1px solid var(--border-med)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  style={{ padding: '0.7rem 2rem', borderRadius: 10, border: 'none', background: 'var(--red)', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.875rem', boxShadow: '0 4px 16px var(--red-glow)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {saving ? 'Saving…' : <><Check size={14} strokeWidth={2.5} /> Save Changes</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View modal */}
      <AnimatePresence>
        {viewRef && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setViewRef(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: 480, boxShadow: '0 24px 72px rgba(0,0,0,0.4)', position: 'relative' }}>
              <button onClick={() => setViewRef(null)}
                style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <X size={13} strokeWidth={2.5} />
              </button>
              {(() => { const sc = getReferralStatus(viewRef.status); return (
                <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, color: sc.color, background: sc.bg, border: `1px solid ${sc.color}44`, marginBottom: '1rem' }}>{sc.label}</span>
              )})()}
              <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>{viewRef.referral_code}</div>
              {[
                ['Referrer', viewRef.referrer_name],
                ['Referrer Phone', viewRef.referrer_phone || '—'],
                ['Referrer Email', viewRef.referrer_email],
                ['Referred Person', viewRef.referred_name],
                ['Referred Phone', viewRef.referred_phone || '—'],
                ['Service Requested', viewRef.referred_service || '—'],
                ['Project Amount', viewRef.project_amount ? `KES ${Number(viewRef.project_amount).toLocaleString()}` : '—'],
                ['Commission (20%)', viewRef.commission_amount ? `KES ${Number(viewRef.commission_amount).toLocaleString()}` : '—'],
                ['Date', new Date(viewRef.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
              {viewRef.notes && (
                <div style={{ marginTop: '1rem', background: 'var(--bg2)', borderRadius: 8, padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Notes</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{viewRef.notes}</p>
                </div>
              )}
              <button onClick={() => { setViewRef(null); openEdit(viewRef) }}
                style={{ width: '100%', marginTop: '1.25rem', padding: '0.7rem', borderRadius: 10, border: 'none', background: 'var(--red)', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem', boxShadow: '0 4px 12px var(--red-glow)' }}>
                Edit This Referral
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

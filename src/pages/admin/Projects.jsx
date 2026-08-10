import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Plus, Search, Filter, Edit2, Trash2, Eye, X, Check,
  ChevronDown, AlertCircle, Clock, ArrowRight,
} from 'lucide-react'
import { useProjects, PROJECT_STATUSES, PRIORITY_CONFIG, getStatusConfig, generateTrackingCode } from '@/hooks/useProjects'

const PROJECT_TYPES = [
  'Web Design', 'Logo Design', 'Branding', 'Graphic Design',
  'Church Media', 'Event Branding', 'Social Media', 'SEO',
  'Mobile App', 'UI/UX Design', 'Poster Design', 'Other',
]

const EMPTY_FORM = {
  client_name: '', client_email: '', client_phone: '',
  project_type: '', title: '', description: '',
  status: 'received', priority: 'normal',
  amount: '', deadline: '', notes: '', tracking_code: '',
}

const inp = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border-med)',
  borderRadius: 10, padding: '0.6rem 0.875rem', fontSize: '0.875rem',
  color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none',
}

export default function AdminProjects() {
  const { projects, loading, error, fetchProjects, createProject, updateProject, deleteProject } = useProjects()

  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState('all')
  const [showForm, setShowForm]   = useState(false)
  const [editProject, setEdit]    = useState(null)  // project being edited
  const [viewProject, setView]    = useState(null)  // project being viewed
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState(null)

  // ── Filter / search ───────────────────────────────────────
  const filtered = projects.filter(p => {
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    const q = search.toLowerCase()
    const matchSearch = !q ||
      p.client_name?.toLowerCase().includes(q) ||
      p.title?.toLowerCase().includes(q) ||
      p.tracking_code?.toLowerCase().includes(q) ||
      p.project_type?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  // ── Status counts for the top row ─────────────────────────
  const counts = PROJECT_STATUSES.reduce((acc, s) => {
    acc[s.key] = projects.filter(p => p.status === s.key).length
    return acc
  }, {})

  // ── Form helpers ──────────────────────────────────────────
  const openNew = () => {
    setForm({ ...EMPTY_FORM, tracking_code: generateTrackingCode() })
    setEdit(null); setShowForm(true)
  }
  const openEdit = (p) => {
    setForm({ ...p, amount: p.amount || '', deadline: p.deadline || '', notes: p.notes || '' })
    setEdit(p); setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEdit(null); setForm(EMPTY_FORM) }

  const handleSave = async () => {
    if (!form.client_name || !form.title || !form.project_type) {
      toast.error('Please fill in client name, project title, and type')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      amount: form.amount ? parseFloat(form.amount) : null,
      deadline: form.deadline || null,
    }
    let result
    if (editProject) {
      result = await updateProject(editProject.id, payload)
    } else {
      result = await createProject(payload)
    }
    setSaving(false)
    if (result.error) { toast.error('Save failed: ' + result.error.message); return }
    toast.success(editProject ? 'Project updated!' : 'Project created!')
    closeForm()
  }

  // Quick status change (inline, from the table row)
  const handleStatusChange = async (project, newStatus) => {
    const result = await updateProject(project.id, { status: newStatus })
    if (result.error) toast.error('Status update failed')
    else toast.success(`Status → ${getStatusConfig(newStatus).label}`)
  }

  const handleDelete = async (id) => {
    if (deleting !== id) { setDeleting(id); return }
    const result = await deleteProject(id)
    setDeleting(null)
    if (result.error) toast.error('Delete failed')
    else toast.success('Project deleted')
  }

  const fld = (k) => ({ value: form[k] || '', onChange: e => setForm(p => ({ ...p, [k]: e.target.value })) })
  const sel = (k) => ({ value: form[k] || '', onChange: e => setForm(p => ({ ...p, [k]: e.target.value })) })

  return (
    <div style={{ padding: 'clamp(1.5rem,3vw,2.5rem)', maxWidth: 1300, margin: '0 auto' }}>
      <Helmet><title>Projects — Admin | Royal Graphix</title></Helmet>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.2rem' }}>
            Project Tracker
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage client projects and update progress in real time.
          </p>
        </div>
        <button onClick={openNew}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--red)', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 16px var(--red-glow)' }}>
          <Plus size={16} strokeWidth={2.5} /> New Project
        </button>
      </div>

      {/* Status overview cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px,1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <button onClick={() => setFilter('all')}
          style={{ textAlign: 'left', padding: '0.875rem 1rem', borderRadius: 10, background: 'var(--surface)', border: `1.5px solid ${filterStatus === 'all' ? 'var(--red)' : 'var(--border)'}`, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)', letterSpacing: '-0.04em' }}>{projects.length}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>All Projects</div>
        </button>
        {PROJECT_STATUSES.slice(0, 6).map(s => (
          <button key={s.key} onClick={() => setFilter(f => f === s.key ? 'all' : s.key)}
            style={{ textAlign: 'left', padding: '0.875rem 1rem', borderRadius: 10, background: 'var(--surface)', border: `1.5px solid ${filterStatus === s.key ? s.color : 'var(--border)'}`, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: s.color, letterSpacing: '-0.04em' }}>{counts[s.key] || 0}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.3 }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Search + filter bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by client, title, or tracking code…"
            style={{ ...inp, paddingLeft: 34, width: '100%' }}
            onFocus={e => e.target.style.borderColor = 'var(--red)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-med)'}
          />
        </div>
        <select value={filterStatus} onChange={e => setFilter(e.target.value)}
          style={{ ...inp, width: 'auto', minWidth: 160, cursor: 'pointer', appearance: 'none', paddingRight: '2rem' }}>
          <option value="all">All Statuses</option>
          {PROJECT_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <button onClick={fetchProjects} style={{ ...inp, width: 'auto', padding: '0.6rem 1rem', cursor: 'pointer', border: '1px solid var(--border-med)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Filter size={13} strokeWidth={2} /> Refresh
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '0.875rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <AlertCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Supabase read issue — showing sample data. Run migration 003 in your Supabase SQL Editor to create the projects table.
            <br />{error}
          </div>
        </div>
      )}

      {/* Projects table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading projects…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No projects found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                  {['Client', 'Project', 'Type', 'Status', 'Priority', 'Tracking Code', 'Deadline', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const sc = getStatusConfig(p.status)
                  const pc = PRIORITY_CONFIG[p.priority] || PRIORITY_CONFIG.normal
                  return (
                    <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.client_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.client_email || '—'}</div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', maxWidth: 200 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.project_type}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        {/* Inline status dropdown */}
                        <div style={{ position: 'relative' }}>
                          <select value={p.status} onChange={e => handleStatusChange(p, e.target.value)}
                            style={{ padding: '4px 26px 4px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', border: `1px solid ${sc.color}`, color: sc.color, background: sc.bg, appearance: 'none', outline: 'none', fontFamily: 'var(--font-body)' }}>
                            {PROJECT_STATUSES.map(s => (
                              <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700, color: pc.color, background: `${pc.color}18`, border: `1px solid ${pc.color}44` }}>
                          {pc.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <code style={{ fontSize: '0.78rem', fontFamily: 'monospace', background: 'var(--bg2)', padding: '3px 8px', borderRadius: 6, letterSpacing: '0.05em', color: 'var(--red)', fontWeight: 700 }}>
                          {p.tracking_code || '—'}
                        </code>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {p.deadline ? new Date(p.deadline).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setView(p)} title="View"
                            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <Eye size={13} strokeWidth={2} />
                          </button>
                          <button onClick={() => openEdit(p)} title="Edit"
                            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <Edit2 size={13} strokeWidth={2} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} title={deleting === p.id ? 'Click again to confirm' : 'Delete'}
                            style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${deleting === p.id ? '#ef4444' : 'var(--border)'}`, background: deleting === p.id ? 'rgba(239,68,68,0.1)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: deleting === p.id ? '#ef4444' : 'var(--text-muted)' }}>
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

      {/* Create / Edit Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 900, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}>
            <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
              style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'clamp(1.5rem,3vw,2.5rem)', width: '100%', maxWidth: 680, boxShadow: '0 24px 72px rgba(0,0,0,0.4)', position: 'relative' }}>
              <button onClick={closeForm}
                style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <X size={14} strokeWidth={2.5} />
              </button>

              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.35rem', marginBottom: '0.25rem', letterSpacing: '-0.03em' }}>
                {editProject ? 'Edit Project' : 'New Project'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.75rem' }}>
                {editProject ? 'Update project details and status.' : 'Create a new project and share the tracking code with your client.'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FieldWrap label="Client Name *">
                  <input {...fld('client_name')} placeholder="e.g. James Mwangi" style={inp} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'} />
                </FieldWrap>
                <FieldWrap label="Client Email">
                  <input type="email" {...fld('client_email')} placeholder="email@example.com" style={inp} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'} />
                </FieldWrap>
                <FieldWrap label="Client Phone">
                  <input {...fld('client_phone')} placeholder="+254 700 000 000" style={inp} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'} />
                </FieldWrap>
                <FieldWrap label="Project Type *">
                  <select {...sel('project_type')} style={{ ...inp, appearance: 'none', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'}>
                    <option value="">Select type…</option>
                    {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </FieldWrap>
                <FieldWrap label="Project Title *" style={{ gridColumn: '1 / -1' }}>
                  <input {...fld('title')} placeholder="e.g. Company Website" style={inp} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'} />
                </FieldWrap>
                <FieldWrap label="Description" style={{ gridColumn: '1 / -1' }}>
                  <textarea {...fld('description')} rows={3} placeholder="Brief project description…" style={{ ...inp, resize: 'vertical' }} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'} />
                </FieldWrap>
                <FieldWrap label="Status">
                  <select {...sel('status')} style={{ ...inp, appearance: 'none', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'}>
                    {PROJECT_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </FieldWrap>
                <FieldWrap label="Priority">
                  <select {...sel('priority')} style={{ ...inp, appearance: 'none', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'}>
                    {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </FieldWrap>
                <FieldWrap label="Amount (KES)">
                  <input type="number" {...fld('amount')} placeholder="30000" style={inp} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'} />
                </FieldWrap>
                <FieldWrap label="Deadline">
                  <input type="date" {...fld('deadline')} style={inp} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'} />
                </FieldWrap>
                <FieldWrap label="Tracking Code">
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input {...fld('tracking_code')} placeholder="RG-XXXXXX" style={{ ...inp, flex: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'} />
                    <button type="button" onClick={() => setForm(p => ({ ...p, tracking_code: generateTrackingCode() }))}
                      title="Generate new code"
                      style={{ padding: '0 12px', borderRadius: 10, border: '1px solid var(--border-med)', background: 'var(--bg)', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                      Auto
                    </button>
                  </div>
                </FieldWrap>
                <FieldWrap label="Internal Notes" style={{ gridColumn: '1 / -1' }}>
                  <textarea {...fld('notes')} rows={2} placeholder="Internal notes (not visible to client)…" style={{ ...inp, resize: 'vertical' }} onFocus={e => e.target.style.borderColor='var(--red)'} onBlur={e => e.target.style.borderColor='var(--border-med)'} />
                </FieldWrap>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', justifyContent: 'flex-end' }}>
                <button onClick={closeForm}
                  style={{ padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-med)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  style={{ padding: '0.7rem 2rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--red)', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.875rem', boxShadow: '0 4px 16px var(--red-glow)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {saving ? 'Saving…' : (editProject ? 'Save Changes' : 'Create Project')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View details modal */}
      <AnimatePresence>
        {viewProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setView(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: 540, boxShadow: '0 24px 72px rgba(0,0,0,0.4)', position: 'relative' }}>
              <button onClick={() => setView(null)}
                style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <X size={13} strokeWidth={2.5} />
              </button>

              {/* Status badge */}
              {(() => {
                const sc = getStatusConfig(viewProject.status)
                return <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, color: sc.color, background: sc.bg, border: `1px solid ${sc.color}44`, marginBottom: '1rem' }}>{sc.label}</span>
              })()}

              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.25rem', letterSpacing: '-0.03em' }}>{viewProject.title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>{viewProject.project_type}</p>

              {[
                ['Client', viewProject.client_name],
                ['Email', viewProject.client_email || '—'],
                ['Phone', viewProject.client_phone || '—'],
                ['Amount', viewProject.amount ? `KES ${Number(viewProject.amount).toLocaleString()}` : '—'],
                ['Deadline', viewProject.deadline ? new Date(viewProject.deadline).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
                ['Priority', PRIORITY_CONFIG[viewProject.priority]?.label || '—'],
                ['Tracking Code', viewProject.tracking_code || '—'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                </div>
              ))}

              {viewProject.description && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Description</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{viewProject.description}</p>
                </div>
              )}
              {viewProject.notes && (
                <div style={{ marginTop: '1rem', background: 'var(--bg2)', borderRadius: 8, padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Internal Notes</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{viewProject.notes}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={() => { setView(null); openEdit(viewProject) }}
                  style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: 'none', background: 'var(--red)', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.875rem', boxShadow: '0 4px 12px var(--red-glow)' }}>
                  Edit Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FieldWrap({ label, children, style }) {
  return (
    <div style={style}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

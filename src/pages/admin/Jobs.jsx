import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Edit2, Trash2, Globe, EyeOff, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAdminCareers } from '@/hooks/useCareers'
import { JOB_ICON_OPTIONS, getJobIcon } from '@/lib/jobIcons'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'

const EMPTY_FORM = { title: '', icon: 'Briefcase', type: 'Full-time', location: 'Nairobi, Kenya (Hybrid)', summary: '', responsibilities: '', requirements: '', status: 'draft' }

function toLines(text) { return text.split('\n').map(l => l.trim()).filter(Boolean) }
function toText(arr) { return (arr || []).join('\n') }

export default function AdminJobs() {
  const { jobs, loading, addJob, updateJob, toggleStatus, deleteJob } = useAdminCareers()
  const [modalOpen, setModalOpen] = useState(false)
  const [editJob, setEditJob] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const openAdd = () => { setForm(EMPTY_FORM); setEditJob(null); setModalOpen(true) }
  const openEdit = (job) => {
    setForm({
      title: job.title, icon: job.icon || 'Briefcase', type: job.type || 'Full-time',
      location: job.location || '', summary: job.summary || '',
      responsibilities: toText(job.responsibilities), requirements: toText(job.requirements),
      status: job.status,
    })
    setEditJob(job); setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditJob(null); setForm(EMPTY_FORM) }

  const buildPayload = () => ({
    title: form.title.trim(),
    icon: form.icon,
    type: form.type.trim() || 'Full-time',
    location: form.location.trim(),
    summary: form.summary.trim(),
    responsibilities: toLines(form.responsibilities),
    requirements: toLines(form.requirements),
    status: form.status,
  })

  const handleSave = async (publishNow) => {
    if (!form.title.trim() || !form.summary.trim()) { toast.error('Title and summary are required'); return }
    setSaving(true)
    const payload = buildPayload()
    if (publishNow) payload.status = 'published'

    if (editJob) {
      const { error } = await updateJob(editJob.id, payload)
      if (error) { toast.error('Update failed'); setSaving(false); return }
      toast.success(publishNow ? 'Job published!' : 'Job updated!')
    } else {
      const { error } = await addJob(payload)
      if (error) { toast.error('Failed to create job'); setSaving(false); return }
      toast.success(publishNow ? 'Job published!' : 'Draft saved!')
    }
    setSaving(false)
    closeModal()
  }

  const handleToggle = async (job) => {
    const { error } = await toggleStatus(job)
    if (error) { toast.error('Could not update status'); return }
    toast.success(job.status === 'published' ? 'Moved to draft' : 'Job published!')
  }

  const handleDelete = async (id) => {
    const { error } = await deleteJob(id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Job deleted')
    setDeleteConfirm(null)
  }

  return (
    <>
      <Helmet><title>Job Postings — Royal Graphix Admin</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Job Postings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>{jobs.filter(j => j.status === 'published').length} published on the Careers page</p>
        </div>
        <Button onClick={openAdd}><Plus size={15} strokeWidth={2.5} style={{ marginRight: 4 }} /> New Job</Button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Array(2).fill(0).map((_, i) => <Skeleton key={i} height={90} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map(job => {
            const Icon = getJobIcon(job.icon)
            return (
              <div key={job.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(200,16,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color="var(--red)" strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{job.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{job.type} · {job.location}</div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: job.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.12)', color: job.status === 'published' ? '#10b981' : '#6b7280' }}>
                  {job.status === 'published' ? <Globe size={11} /> : <EyeOff size={11} />} {job.status}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <IconBtn onClick={() => handleToggle(job)} title={job.status === 'published' ? 'Unpublish' : 'Publish'}>
                    {job.status === 'published' ? <EyeOff size={13} /> : <Globe size={13} />}
                  </IconBtn>
                  <IconBtn onClick={() => openEdit(job)} title="Edit"><Edit2 size={13} /></IconBtn>
                  <IconBtn onClick={() => setDeleteConfirm(job)} danger title="Delete"><Trash2 size={13} /></IconBtn>
                </div>
              </div>
            )
          })}
          {jobs.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', border: '1px dashed var(--border)', borderRadius: 12 }}>No job postings yet.</div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={closeModal} title={editJob ? 'Edit Job' : 'New Job Posting'} maxWidth={640}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <Field label="Job Title *">
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Senior Developer" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <Field label="Icon">
              <select value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} style={inputStyle}>
                {JOB_ICON_OPTIONS.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </Field>
            <Field label="Type">
              <input value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} placeholder="Full-time" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </Field>
            <Field label="Location">
              <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Nairobi, Kenya" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </Field>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Icon preview:</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(200,16,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {(() => { const I = getJobIcon(form.icon); return <I size={16} color="var(--red)" strokeWidth={1.8} /> })()}
            </div>
          </div>

          <Field label="Summary *">
            <textarea value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} placeholder="Short overview of the role..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>

          <Field label="Responsibilities (one per line)">
            <textarea value={form.responsibilities} onChange={e => setForm(p => ({ ...p, responsibilities: e.target.value }))} placeholder={'Design logos and brand identities\nCreate social media graphics'} rows={5} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>

          <Field label="Requirements (one per line)">
            <textarea value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} placeholder={'2+ years of experience\nStrong portfolio'} rows={5} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button onClick={() => handleSave(true)} loading={saving} style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}>
              {form.status === 'published' ? 'Save Changes' : 'Publish Job'}
            </Button>
            {form.status !== 'published' && (
              <Button variant="outline" onClick={() => handleSave(false)} loading={saving}>Save as Draft</Button>
            )}
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Job">
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Delete <strong style={{ color: 'var(--text)' }}>{deleteConfirm?.title}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button onClick={() => handleDelete(deleteConfirm.id)} style={{ background: '#ef4444', flex: 1, justifyContent: 'center' }}>Delete</Button>
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
        </div>
      </Modal>
    </>
  )
}

const inputStyle = { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.7rem 1rem', fontSize: '0.9rem', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }

function Field({ label, children }) {
  return <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>{label}</label>{children}</div>
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

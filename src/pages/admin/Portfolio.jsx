import { useState } from 'react'
import { Edit2, Trash2, Eye, Plus, Search, Download, X, Check, FileText, Image, BarChart2, Users, FolderOpen, ExternalLink } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useImageUpload } from '@/hooks/useImageUpload'
import { PORTFOLIO_CATEGORIES } from '@/lib/constants'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'

const EMPTY_FORM = { title: '', description: '', category: '', live_url: '', emoji: '🖼️' }

export default function AdminPortfolio() {
  const { items, loading, addItem, updateItem, deleteItem } = usePortfolio()
  const { uploading, preview, handleFileChange, upload, reset: resetUpload } = useImageUpload()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedFile, setSelectedFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); resetUpload(); setModalOpen(true) }
  const openEdit = (item) => { setForm({ title: item.title, description: item.description, category: item.category, live_url: item.live_url || '', emoji: item.emoji || '🖼️' }); setEditingId(item.id); resetUpload(); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM); setSelectedFile(null); resetUpload() }

  const handleFile = (e) => { const f = handleFileChange(e); setSelectedFile(f) }

  const handleSave = async () => {
    if (!form.title || !form.description || !form.category) { toast.error('Title, description, and category are required'); return }
    setSaving(true)
    let image_url = undefined

    if (selectedFile) {
      const { url, error } = await upload(selectedFile, 'portfolio')
      if (error) { toast.error('Image upload failed'); setSaving(false); return }
      image_url = url
    }

    const payload = { ...form, ...(image_url ? { image_url } : {}) }

    if (editingId) {
      const { error } = await updateItem(editingId, payload)
      if (error) { toast.error('Update failed'); setSaving(false); return }
      toast.success('Project updated!')
    } else {
      const { error } = await addItem(payload)
      if (error) { toast.error('Failed to add project'); setSaving(false); return }
      toast.success('Project added!')
    }
    setSaving(false)
    closeModal()
  }

  const handleDelete = async (id) => {
    const { error } = await deleteItem(id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Project deleted')
    setDeleteConfirm(null)
  }

  return (
    <>
      <Helmet><title>Portfolio — Royal Graphix Admin</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Portfolio</h1>
        <Button onClick={openAdd}>+ Add Project</Button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} height={52} />)}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Project', 'Category', 'Live URL', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.875rem 1rem', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, overflow: 'hidden' }}>
                        {item.image_url ? <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (item.emoji || '🖼️')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    {item.live_url && item.live_url !== '#' ? (
                      <a href={item.live_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: 'var(--red)', textDecoration: 'none' }}>
                        Visit ↗
                      </a>
                    ) : <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <IconBtn onClick={() => openEdit(item)} title="Edit"><Edit2 size={13} strokeWidth={2} /></IconBtn>
                      <IconBtn onClick={() => setDeleteConfirm(item)} danger><Trash2 size={13} strokeWidth={2} /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No portfolio items yet. Add your first project!</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit Project' : 'Add New Project'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Field label="Project Title *">
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. TechFlow Rebrand" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>

          <Field label="Description *">
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief project description..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Category *">
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}>
                <option value="">Select...</option>
                {PORTFOLIO_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Emoji Icon">
              <input value={form.emoji} onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))} placeholder="🖼️" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </Field>
          </div>

          <Field label="Live URL">
            <input value={form.live_url} onChange={e => setForm(p => ({ ...p, live_url: e.target.value }))} placeholder="https://..." style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>

          <Field label="Project Image">
            <div style={{ border: '2px dashed var(--border)', borderRadius: 10, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--red)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              onClick={() => document.getElementById('img-upload').click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" style={{ maxHeight: 120, borderRadius: 8, objectFit: 'cover' }} />
              ) : (
                <div>
                  <div style={{ marginBottom:'0.5rem', display:'flex', justifyContent:'center' }}><FolderOpen size={28} color='var(--text-muted)' strokeWidth={1.5} /></div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to upload image</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>PNG, JPG, WebP up to 5MB</div>
                </div>
              )}
              <input id="img-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            </div>
          </Field>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button onClick={handleSave} loading={saving || uploading} style={{ flex: 1, justifyContent: 'center' }}>
              {editingId ? 'Save Changes' : 'Add Project'}
            </Button>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Project">
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text)' }}>{deleteConfirm?.title}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button onClick={() => handleDelete(deleteConfirm.id)} style={{ background: '#ef4444', flex: 1, justifyContent: 'center' }}>
            Yes, Delete
          </Button>
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
        </div>
      </Modal>
    </>
  )
}

const inputStyle = { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.7rem 1rem', fontSize: '0.9rem', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function IconBtn({ onClick, title, danger, children }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)',
      background: 'transparent', cursor: 'pointer', display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
      color: 'var(--text-muted)', transition: 'all 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = danger ? '#ef4444' : 'var(--red)'; e.currentTarget.style.color = danger ? '#ef4444' : 'var(--red)'; e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.05)' : 'rgba(200,16,46,0.05)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

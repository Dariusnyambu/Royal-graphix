import { useState } from 'react'
import { Edit2, Trash2, Plus, X, FolderOpen, Globe, EyeOff, Star, ExternalLink } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { useAdminPortfolio } from '@/hooks/usePortfolio'
import { useImageUpload } from '@/hooks/useImageUpload'
import { PORTFOLIO_CATEGORIES, SERVICES } from '@/lib/constants'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'

const EMPTY_FORM = {
  // Details
  title: '', slug: '', client_name: '', client_industry: '', category: '', live_url: '', description: '',
  // Case study
  overview: '', client_problem: '', objectives: '', solution: '', process_text: '',
  // Services & tech
  services_provided: [], tech_stack: '',
  // Results
  results: '',
  // Testimonial
  testimonial_text: '', testimonial_name: '', testimonial_role: '',
  // Media
  emoji: '🖼️', image_alt: '', gallery_images: [],
  // SEO
  seo_title: '', seo_description: '', focus_keyword: '', canonical_url: '', og_image: '',
  // Publish
  featured: false, status: 'published', project_year: String(new Date().getFullYear()),
}

const TABS = ['Details', 'Case Study', 'Media', 'Services & Tech', 'Results', 'Testimonial', 'SEO', 'Publish']

function toText(arr) { return (arr || []).join('\n') }
function toLines(text) { return text.split('\n').map(l => l.trim()).filter(Boolean) }

export default function AdminPortfolio() {
  const { items, loading, addItem, updateItem, deleteItem } = useAdminPortfolio()
  const { uploading, preview, handleFileChange, upload, reset: resetUpload } = useImageUpload()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Details')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedFile, setSelectedFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); resetUpload(); setGalleryFiles([]); setSelectedFile(null); setActiveTab('Details'); setModalOpen(true) }
  const openEdit = (item) => {
    setForm({
      title: item.title || '', slug: item.slug || '', client_name: item.client_name || '', client_industry: item.client_industry || '',
      category: item.category || '', live_url: item.live_url || '', description: item.description || '',
      overview: item.overview || '', client_problem: item.client_problem || '', objectives: item.objectives || '',
      solution: item.solution || '', process_text: item.process_text || '',
      services_provided: item.services_provided || [], tech_stack: (item.tech_stack || []).join(', '),
      results: toText(item.results),
      testimonial_text: item.testimonial_text || '', testimonial_name: item.testimonial_name || '', testimonial_role: item.testimonial_role || '',
      emoji: item.emoji || '🖼️', image_alt: item.image_alt || '', gallery_images: item.gallery_images || [],
      seo_title: item.seo_title || '', seo_description: item.seo_description || '', focus_keyword: item.focus_keyword || '',
      canonical_url: item.canonical_url || '', og_image: item.og_image || '',
      featured: !!item.featured, status: item.status || 'published', project_year: item.project_year || String(new Date().getFullYear()),
    })
    setEditingId(item.id); resetUpload(); setGalleryFiles([]); setSelectedFile(null); setActiveTab('Details'); setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM); setSelectedFile(null); setGalleryFiles([]); resetUpload() }

  const handleFile = (e) => { const f = handleFileChange(e); setSelectedFile(f) }
  const handleGalleryFiles = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setGalleryFiles(prev => [...prev, ...files.map(file => ({ file, previewUrl: URL.createObjectURL(file) }))])
    e.target.value = ''
  }
  const removeExistingGalleryImage = (url) => setForm(p => ({ ...p, gallery_images: p.gallery_images.filter(u => u !== url) }))
  const removeNewGalleryFile = (idx) => setGalleryFiles(prev => prev.filter((_, i) => i !== idx))
  const toggleService = (title) => setForm(p => ({ ...p, services_provided: p.services_provided.includes(title) ? p.services_provided.filter(s => s !== title) : [...p.services_provided, title] }))

  const handleSave = async () => {
    if (!form.title || !form.description || !form.category) {
      toast.error('Title, short description, and category are required — check the Details tab')
      setActiveTab('Details')
      return
    }
    setSaving(true)
    let image_url = undefined
    if (selectedFile) {
      const { url, error } = await upload(selectedFile, 'portfolio')
      if (error) { toast.error('Image upload failed'); setSaving(false); return }
      image_url = url
    }
    let galleryUrls = [...form.gallery_images]
    for (const { file } of galleryFiles) {
      const { url, error } = await upload(file, 'portfolio-gallery')
      if (error) { toast.error('One or more gallery images failed to upload'); setSaving(false); return }
      galleryUrls.push(url)
    }

    const payload = {
      title: form.title, slug: form.slug, client_name: form.client_name || null, client_industry: form.client_industry || null,
      category: form.category, live_url: form.live_url || null, description: form.description,
      overview: form.overview || null, client_problem: form.client_problem || null, objectives: form.objectives || null,
      solution: form.solution || null, process_text: form.process_text || null,
      services_provided: form.services_provided, tech_stack: form.tech_stack.split(',').map(t => t.trim()).filter(Boolean),
      results: toLines(form.results),
      testimonial_text: form.testimonial_text || null, testimonial_name: form.testimonial_name || null, testimonial_role: form.testimonial_role || null,
      emoji: form.emoji, image_alt: form.image_alt || null, gallery_images: galleryUrls,
      seo_title: form.seo_title || null, seo_description: form.seo_description || null, focus_keyword: form.focus_keyword || null,
      canonical_url: form.canonical_url || null, og_image: form.og_image || null,
      featured: form.featured, status: form.status, project_year: form.project_year || null,
      ...(image_url ? { image_url } : {}),
    }

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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Portfolio</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            {items.filter(i => i.status === 'published').length} published case studies
          </p>
        </div>
        <Button onClick={openAdd}>+ Add Project</Button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} height={52} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Project', 'Category', 'Status', 'Live URL', 'Actions'].map(h => (
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
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {item.title}
                          {item.featured && <Star size={12} strokeWidth={0} fill="#f59e0b" title="Featured" />}
                        </div>
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: item.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.12)', color: item.status === 'published' ? '#10b981' : '#6b7280' }}>
                      {item.status === 'published' ? <Globe size={11} /> : <EyeOff size={11} />} {item.status || 'published'}
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
                      {item.slug && (
                        <a href={`/portfolio/${item.slug}`} target="_blank" rel="noopener noreferrer" title="View case study">
                          <IconBtn as="span"><ExternalLink size={13} strokeWidth={2} /></IconBtn>
                        </a>
                      )}
                      <IconBtn onClick={() => openEdit(item)} title="Edit"><Edit2 size={13} strokeWidth={2} /></IconBtn>
                      <IconBtn onClick={() => setDeleteConfirm(item)} danger title="Delete"><Trash2 size={13} strokeWidth={2} /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No portfolio items yet. Add your first project!</td></tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal — tabbed case-study editor */}
      <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit Project' : 'Add New Project'} maxWidth={720}>
        <div>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', paddingBottom: 2 }}>
            {TABS.map(tab => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
                padding: '0.5rem 0.85rem', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'none',
                cursor: 'pointer', color: activeTab === tab ? 'var(--red)' : 'var(--text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--red)' : '2px solid transparent',
                fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
              }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', minHeight: 320 }}>

            {activeTab === 'Details' && (<>
              <Field label="Project Title *">
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. TechFlow Rebrand" style={inputStyle} onFocus={f} onBlur={b} />
              </Field>
              <Field label="URL Slug (optional — auto-generated from title if left blank)">
                <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="techflow-rebrand" style={inputStyle} onFocus={f} onBlur={b} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Client Name"><input value={form.client_name} onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))} placeholder="e.g. TechFlow Ltd" style={inputStyle} onFocus={f} onBlur={b} /></Field>
                <Field label="Client Industry"><input value={form.client_industry} onChange={e => setForm(p => ({ ...p, client_industry: e.target.value }))} placeholder="e.g. Fintech" style={inputStyle} onFocus={f} onBlur={b} /></Field>
              </div>
              <Field label="Category * (pick one or type a new one)">
                <input list="portfolio-cats" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Web Design" style={inputStyle} onFocus={f} onBlur={b} />
                <datalist id="portfolio-cats">
                  {Array.from(new Set([...PORTFOLIO_CATEGORIES.filter(c => c !== 'All'), ...items.map(i => i.category)])).map(c => <option key={c} value={c} />)}
                </datalist>
              </Field>
              <Field label="Short Description * (shown on the portfolio grid)">
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="One or two sentences summarizing the project..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} onFocus={f} onBlur={b} />
              </Field>
              <Field label="Live Project URL"><input value={form.live_url} onChange={e => setForm(p => ({ ...p, live_url: e.target.value }))} placeholder="https://..." style={inputStyle} onFocus={f} onBlur={b} /></Field>
            </>)}

            {activeTab === 'Case Study' && (<>
              <Field label="Project Overview"><textarea value={form.overview} onChange={e => setForm(p => ({ ...p, overview: e.target.value }))} placeholder="A clear explanation of what the project was." rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={f} onBlur={b} /></Field>
              <Field label="The Challenge"><textarea value={form.client_problem} onChange={e => setForm(p => ({ ...p, client_problem: e.target.value }))} placeholder="What problem or need did the client have before working with you?" rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={f} onBlur={b} /></Field>
              <Field label="Project Objectives"><textarea value={form.objectives} onChange={e => setForm(p => ({ ...p, objectives: e.target.value }))} placeholder="What was the project intended to achieve?" rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={f} onBlur={b} /></Field>
              <Field label="Our Solution"><textarea value={form.solution} onChange={e => setForm(p => ({ ...p, solution: e.target.value }))} placeholder="How did Royal Graphix solve the problem?" rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={f} onBlur={b} /></Field>
              <Field label="Our Process"><textarea value={form.process_text} onChange={e => setForm(p => ({ ...p, process_text: e.target.value }))} placeholder="Main stages used to complete the project." rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={f} onBlur={b} /></Field>
            </>)}

            {activeTab === 'Media' && (<>
              <Field label="Emoji Fallback (shown if no image is uploaded)"><input value={form.emoji} onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))} placeholder="🖼️" style={inputStyle} onFocus={f} onBlur={b} /></Field>
              <Field label="Main / Hero Image">
                <div style={{ border: '2px dashed var(--border)', borderRadius: 10, padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => document.getElementById('img-upload').click()}>
                  {preview ? <img src={preview} alt="Preview" style={{ maxHeight: 120, borderRadius: 8, objectFit: 'cover' }} /> : (
                    <div>
                      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}><FolderOpen size={28} color="var(--text-muted)" strokeWidth={1.5} /></div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to upload image</div>
                    </div>
                  )}
                  <input id="img-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
                </div>
              </Field>
              <Field label="Image Alt Text (describe the image for accessibility & SEO)">
                <input value={form.image_alt} onChange={e => setForm(p => ({ ...p, image_alt: e.target.value }))} placeholder="e.g. Homepage of the TechFlow web app showing the dashboard" style={inputStyle} onFocus={f} onBlur={b} />
              </Field>
              <Field label="Project Gallery (additional images)">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: form.gallery_images.length || galleryFiles.length ? 10 : 0 }}>
                  {form.gallery_images.map(url => (
                    <div key={url} style={{ position: 'relative', width: 72, height: 72 }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                      <button type="button" onClick={() => removeExistingGalleryImage(url)} style={removeBtnStyle}><X size={11} strokeWidth={3} /></button>
                    </div>
                  ))}
                  {galleryFiles.map((g, i) => (
                    <div key={g.previewUrl} style={{ position: 'relative', width: 72, height: 72 }}>
                      <img src={g.previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid var(--red)' }} />
                      <button type="button" onClick={() => removeNewGalleryFile(i)} style={removeBtnStyle}><X size={11} strokeWidth={3} /></button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => document.getElementById('gallery-upload').click()} style={addImgBtnStyle}>
                  <Plus size={13} /> Add More Images
                </button>
                <input id="gallery-upload" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGalleryFiles} />
              </Field>
            </>)}

            {activeTab === 'Services & Tech' && (<>
              <Field label="Royal Graphix Services Involved">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SERVICES.map(s => (
                    <button key={s.slug} type="button" onClick={() => toggleService(s.title)} style={{
                      padding: '0.45rem 0.9rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600,
                      border: '1px solid', borderColor: form.services_provided.includes(s.title) ? 'var(--red)' : 'var(--border)',
                      background: form.services_provided.includes(s.title) ? 'var(--red)' : 'transparent',
                      color: form.services_provided.includes(s.title) ? 'white' : 'var(--text-muted)',
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                    }}>{s.title}</button>
                  ))}
                </div>
              </Field>
              <Field label="Tools / Technologies Used (comma-separated)">
                <input value={form.tech_stack} onChange={e => setForm(p => ({ ...p, tech_stack: e.target.value }))} placeholder="React, Supabase, Figma" style={inputStyle} onFocus={f} onBlur={b} />
              </Field>
            </>)}

            {activeTab === 'Results' && (
              <Field label="Results / Outcome (one per line — enter only what genuinely happened)">
                <textarea value={form.results} onChange={e => setForm(p => ({ ...p, results: e.target.value }))} placeholder={'Faster page load times\nCleaner booking flow\nImproved brand consistency across platforms'} rows={6} style={{ ...inputStyle, resize: 'vertical' }} onFocus={f} onBlur={b} />
              </Field>
            )}

            {activeTab === 'Testimonial' && (<>
              <Field label="Testimonial Text (optional)">
                <textarea value={form.testimonial_text} onChange={e => setForm(p => ({ ...p, testimonial_text: e.target.value }))} placeholder="What the client said about working with you..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={f} onBlur={b} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Client Name"><input value={form.testimonial_name} onChange={e => setForm(p => ({ ...p, testimonial_name: e.target.value }))} placeholder="Jane Doe" style={inputStyle} onFocus={f} onBlur={b} /></Field>
                <Field label="Client Position / Company"><input value={form.testimonial_role} onChange={e => setForm(p => ({ ...p, testimonial_role: e.target.value }))} placeholder="CEO, TechFlow" style={inputStyle} onFocus={f} onBlur={b} /></Field>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>Leave blank if no testimonial exists yet — the section won&rsquo;t show on the case study page.</p>
            </>)}

            {activeTab === 'SEO' && (<>
              <Field label="SEO Title"><input value={form.seo_title} onChange={e => setForm(p => ({ ...p, seo_title: e.target.value }))} placeholder="Defaults to project title" style={inputStyle} onFocus={f} onBlur={b} /></Field>
              <Field label="Meta Description"><textarea value={form.seo_description} onChange={e => setForm(p => ({ ...p, seo_description: e.target.value }))} placeholder="Defaults to short description" rows={2} style={{ ...inputStyle, resize: 'vertical' }} onFocus={f} onBlur={b} /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Focus Keyword"><input value={form.focus_keyword} onChange={e => setForm(p => ({ ...p, focus_keyword: e.target.value }))} placeholder="e.g. fintech web design Kenya" style={inputStyle} onFocus={f} onBlur={b} /></Field>
                <Field label="Canonical URL (optional)"><input value={form.canonical_url} onChange={e => setForm(p => ({ ...p, canonical_url: e.target.value }))} placeholder="Leave blank unless needed" style={inputStyle} onFocus={f} onBlur={b} /></Field>
              </div>
              <Field label="Open Graph Image URL (optional — defaults to main image)"><input value={form.og_image} onChange={e => setForm(p => ({ ...p, og_image: e.target.value }))} placeholder="https://..." style={inputStyle} onFocus={f} onBlur={b} /></Field>
            </>)}

            {activeTab === 'Publish' && (<>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Status">
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </Field>
                <Field label="Project Year"><input value={form.project_year} onChange={e => setForm(p => ({ ...p, project_year: e.target.value }))} placeholder="2025" style={inputStyle} onFocus={f} onBlur={b} /></Field>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width: 16, height: 16 }} />
                Feature this project (highlighted across the site)
              </label>
            </>)}

          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
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
const removeBtnStyle = { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#ef4444', color: 'white', border: '2px solid var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }
const addImgBtnStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px dashed var(--border)', borderRadius: 8, padding: '0.5rem 0.9rem', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }
const f = e => e.target.style.borderColor = 'var(--red)'
const b = e => e.target.style.borderColor = 'var(--border)'

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

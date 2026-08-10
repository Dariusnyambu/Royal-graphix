import { useState } from 'react'
import { Edit2, Trash2, Eye, FolderOpen, Globe, EyeOff } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import DOMPurify from 'dompurify'
import { useAdminBlog } from '@/hooks/useBlog'
import { useImageUpload } from '@/hooks/useImageUpload'
import { BLOG_CATEGORIES } from '@/lib/constants'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import RichTextEditor from '@/components/ui/RichTextEditor'

const CAT_COLORS = {
  'Web Design': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  'SEO':        { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  'Branding':   { bg: 'rgba(200,16,46,0.1)',  color: '#C8102E' },
  'UI/UX':      { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
  'Development':{ bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
  'Graphics':   { bg: 'rgba(236,72,153,0.1)', color: '#ec4899' },
}
const catColor = (c) => CAT_COLORS[c] || { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' }

const EMPTY_FORM = { title: '', slug: '', category: '', excerpt: '', content: '', author: 'Royal Graphix', readTime: '5 min read', emoji: '📝', tags: '', status: 'draft', seoTitle: '', seoDescription: '' }

function estimateReadTime(html) {
  const text = (html || '').replace(/<[^>]*>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

export default function AdminBlog() {
  const { posts, loading, addPost, updatePost, togglePublish, deletePost } = useAdminBlog()
  const { uploading, preview, handleFileChange, upload, reset: resetUpload } = useImageUpload()
  const [modalOpen, setModalOpen] = useState(false)
  const [editPost, setEditPost] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedFile, setSelectedFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [preview_, setPreviewOpen] = useState(null)

  const published = posts.filter(p => p.status === 'published').length
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)

  const openAdd = () => { setForm(EMPTY_FORM); setEditPost(null); resetUpload(); setSelectedFile(null); setModalOpen(true) }
  const openEdit = (post) => {
    setForm({
      title: post.title, slug: post.slug, category: post.category, excerpt: post.excerpt || '',
      content: post.content || '', author: post.author || 'Royal Graphix', readTime: post.read_time || '5 min read',
      emoji: post.emoji || '📝', tags: (post.tags || []).join(', '), status: post.status,
      seoTitle: post.seo_title || '', seoDescription: post.seo_description || '',
    })
    setEditPost(post); resetUpload(); setSelectedFile(null); setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditPost(null); setForm(EMPTY_FORM); setSelectedFile(null); resetUpload() }

  const handleFile = (e) => { const f = handleFileChange(e); setSelectedFile(f) }

  const buildPayload = () => ({
    title: form.title.trim(),
    slug: form.slug.trim(),
    category: form.category.trim(),
    excerpt: form.excerpt.trim(),
    content: form.content.trim(),
    author: form.author.trim() || 'Royal Graphix',
    read_time: form.readTime.trim() || estimateReadTime(form.content),
    emoji: form.emoji.trim() || '📝',
    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    status: form.status,
    seo_title: form.seoTitle.trim() || null,
    seo_description: form.seoDescription.trim() || null,
  })

  const handleSave = async (publishNow) => {
    if (!form.title.trim() || !form.category.trim() || !form.content.replace(/<[^>]*>/g, '').trim()) {
      toast.error('Title, category, and content are required'); return
    }
    setSaving(true)
    let cover_image = undefined
    if (selectedFile) {
      const { url, error } = await upload(selectedFile, 'blog', 'blog-images')
      if (error) { toast.error('Cover image upload failed'); setSaving(false); return }
      cover_image = url
    }

    const payload = { ...buildPayload(), ...(cover_image ? { cover_image } : {}) }
    if (publishNow) payload.status = 'published'

    if (editPost) {
      const { error } = await updatePost(editPost.id, payload)
      if (error) { toast.error('Update failed'); setSaving(false); return }
      toast.success(publishNow ? 'Post published!' : 'Post updated!')
    } else {
      const { error } = await addPost(payload)
      if (error) { toast.error(error.message?.includes('duplicate') ? 'That slug is already in use' : 'Failed to create post'); setSaving(false); return }
      toast.success(publishNow ? 'Post published!' : 'Draft saved!')
    }
    setSaving(false)
    closeModal()
  }

  const handleTogglePublish = async (post) => {
    const { error } = await togglePublish(post)
    if (error) { toast.error('Could not update status'); return }
    toast.success(post.status === 'published' ? 'Moved to draft' : 'Post published!')
  }

  const handleDelete = async (id) => {
    const { error } = await deletePost(id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Post deleted')
    setDeleteConfirm(null)
  }

  return (
    <>
      <Helmet><title>Blog Posts — Royal Graphix Admin</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Blog Posts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>{published} published · {posts.length - published} drafts · {totalViews.toLocaleString()} total reads</p>
        </div>
        <Button onClick={openAdd}>+ New Post</Button>
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
                {['Post', 'Category', 'Status', 'Reads', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => {
                const cc = catColor(post.category)
                const isLast = i === posts.length - 1
                return (
                  <tr key={post.id} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setPreviewOpen(post)}>
                        <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0, overflow: 'hidden' }}>
                          {post.cover_image ? <img src={post.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : post.emoji}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 100, background: cc.bg, color: cc.color, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        {post.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: post.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.12)', color: post.status === 'published' ? '#10b981' : '#6b7280' }}>
                        {post.status === 'published' ? <Globe size={11} /> : <EyeOff size={11} />}
                        {post.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Eye size={13} strokeWidth={1.8} /> {(post.views || 0).toLocaleString()}</span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <IconBtn onClick={() => handleTogglePublish(post)} title={post.status === 'published' ? 'Unpublish' : 'Publish'}>
                          {post.status === 'published' ? <EyeOff size={13} strokeWidth={2} /> : <Globe size={13} strokeWidth={2} />}
                        </IconBtn>
                        <IconBtn onClick={() => openEdit(post)} title="Edit"><Edit2 size={13} strokeWidth={2} /></IconBtn>
                        <IconBtn onClick={() => setDeleteConfirm(post)} danger title="Delete"><Trash2 size={13} strokeWidth={2} /></IconBtn>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {posts.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No blog posts yet. Write your first one!</td></tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={closeModal} title={editPost ? 'Edit Post' : 'New Blog Post'} maxWidth={680}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Field label="Post Title *">
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: editPost ? p.slug : p.slug }))} placeholder="e.g. 10 Web Design Trends in 2025" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>

          <Field label="URL Slug (optional — auto-generated from title if left blank)">
            <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="10-web-design-trends-2025" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <Field label="Category *">
              <input list="blog-cats" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="Web Design" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              <datalist id="blog-cats">{BLOG_CATEGORIES.map(c => <option key={c} value={c} />)}</datalist>
            </Field>
            <Field label="Emoji">
              <input value={form.emoji} onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))} placeholder="📝" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </Field>
            <Field label="Read Time">
              <input value={form.readTime} onChange={e => setForm(p => ({ ...p, readTime: e.target.value }))} placeholder={estimateReadTime(form.content)} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </Field>
          </div>

          <Field label="Excerpt (short summary shown on the blog list)">
            <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} placeholder="Brief post summary..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>

          <Field label="Content *">
            <RichTextEditor
              value={form.content}
              onChange={html => setForm(p => ({ ...p, content: html }))}
              placeholder="Write the full article here — use the toolbar for headings, lists, links, images, and video."
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Author">
              <input value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </Field>
            <Field label="Tags (comma-separated)">
              <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="design, trends, 2025" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </Field>
          </div>

          <Field label="Cover Image">
            <div style={{ border: '2px dashed var(--border)', borderRadius: 10, padding: '1.25rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--red)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              onClick={() => document.getElementById('blog-img-upload').click()}
            >
              {preview || editPost?.cover_image ? (
                <img src={preview || editPost.cover_image} alt="Preview" style={{ maxHeight: 110, borderRadius: 8, objectFit: 'cover' }} />
              ) : (
                <div>
                  <div style={{ marginBottom: '0.4rem', display: 'flex', justifyContent: 'center' }}><FolderOpen size={26} color="var(--text-muted)" strokeWidth={1.5} /></div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to upload a cover image</div>
                </div>
              )}
              <input id="blog-img-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            </div>
          </Field>

          <details>
            <summary style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>SEO settings (optional)</summary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <Field label="SEO Title">
                <input value={form.seoTitle} onChange={e => setForm(p => ({ ...p, seoTitle: e.target.value }))} placeholder="Defaults to post title" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </Field>
              <Field label="SEO Description">
                <textarea value={form.seoDescription} onChange={e => setForm(p => ({ ...p, seoDescription: e.target.value }))} placeholder="Defaults to excerpt" rows={2} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </Field>
            </div>
          </details>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button onClick={() => handleSave(true)} loading={saving || uploading} style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}>
              {form.status === 'published' ? 'Save Changes' : 'Publish Post'}
            </Button>
            {form.status !== 'published' && (
              <Button variant="outline" onClick={() => handleSave(false)} loading={saving || uploading}>Save as Draft</Button>
            )}
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={!!preview_} onClose={() => setPreviewOpen(null)} title={preview_?.title} maxWidth={640}>
        {preview_ && (
          <div>
            {preview_.cover_image && (
              <div style={{ height: 220, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <img src={preview_.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {preview_.category} · {preview_.read_time} · {(preview_.views || 0).toLocaleString()} reads
            </div>
            <div className="rich-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(preview_.content || '') }} />
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Post">
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

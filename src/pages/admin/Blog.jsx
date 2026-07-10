import { useState } from 'react'
import { Edit2, Trash2, Plus, FileText } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { BLOG_POSTS } from '@/lib/constants'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

const CAT_COLORS = {
  'Web Design': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  'SEO': { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  'Branding': { bg: 'rgba(200,16,46,0.1)', color: '#C8102E' },
  'UI/UX': { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
  'Development': { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
  'Graphics': { bg: 'rgba(236,72,153,0.1)', color: '#ec4899' },
}

export default function AdminBlog() {
  const [posts, setPosts] = useState(BLOG_POSTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editPost, setEditPost] = useState(null)
  const [form, setForm] = useState({ title: '', category: '', excerpt: '', emoji: '📝', readTime: '5 min read' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const openAdd = () => { setForm({ title: '', category: '', excerpt: '', emoji: '📝', readTime: '5 min read' }); setEditPost(null); setModalOpen(true) }
  const openEdit = (post) => { setForm({ title: post.title, category: post.category, excerpt: post.excerpt, emoji: post.emoji, readTime: post.readTime }); setEditPost(post); setModalOpen(true) }

  const handleSave = () => {
    if (!form.title || !form.category) { toast.error('Title and category are required'); return }
    if (editPost) {
      setPosts(prev => prev.map(p => p.id === editPost.id ? { ...p, ...form } : p))
      toast.success('Post updated!')
    } else {
      const newPost = { id: `b${Date.now()}`, slug: form.title.toLowerCase().replace(/\s+/g, '-'), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), author: 'Royal Graphix', ...form }
      setPosts(prev => [newPost, ...prev])
      toast.success('Post created!')
    }
    setModalOpen(false)
  }

  const handleDelete = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id))
    toast.success('Post deleted')
    setDeleteConfirm(null)
  }

  return (
    <>
      <Helmet><title>Blog Posts — Royal Graphix Admin</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Blog Posts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>{posts.length} articles published</p>
        </div>
        <Button onClick={openAdd}>+ New Post</Button>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Post', 'Category', 'Read Time', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => {
              const cc = CAT_COLORS[post.category] || { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' }
              return (
                <tr key={post.id} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.875rem 1rem', borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                        {post.emoji}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.excerpt}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 100, background: cc.bg, color: cc.color, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      {post.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    {post.readTime}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    {post.date}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <IconBtn onClick={() => openEdit(post)}><Edit2 size={13} strokeWidth={2} /></IconBtn>
                      <IconBtn onClick={() => setDeleteConfirm(post)} danger><Trash2 size={13} strokeWidth={2} /></IconBtn>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editPost ? 'Edit Post' : 'New Blog Post'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Field label="Post Title *">
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. 10 Web Design Trends in 2025" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <Field label="Category *">
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}>
                <option value="">Select...</option>
                {['Web Design', 'SEO', 'Branding', 'UI/UX', 'Development', 'Graphics'].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Emoji">
              <input value={form.emoji} onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))} placeholder="📝" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </Field>
            <Field label="Read Time">
              <input value={form.readTime} onChange={e => setForm(p => ({ ...p, readTime: e.target.value }))} placeholder="5 min read" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </Field>
          </div>
          <Field label="Excerpt">
            <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} placeholder="Brief post summary..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </Field>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button onClick={handleSave} style={{ flex: 1, justifyContent: 'center' }}>
              {editPost ? 'Save Changes' : 'Publish Post'}
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
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

function IconBtn({ onClick, danger, children }) {
  return (
    <button onClick={onClick} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = danger ? '#ef4444' : 'var(--red)'; e.currentTarget.style.color = danger ? '#ef4444' : 'var(--red)'; e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.05)' : 'rgba(200,16,46,0.05)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}>
      {children}
    </button>
  )
}

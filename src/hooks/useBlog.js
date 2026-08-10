import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// ─────────────────────────────────────────────────────────────
// FALLBACK POSTS — shown if Supabase has no rows yet, so the
// public blog is never blank on a fresh install.
// ─────────────────────────────────────────────────────────────
const FALLBACK_POSTS = [
  {
    id: 'f1', title: '10 Web Design Trends Dominating 2025', slug: '10-web-design-trends-2025',
    category: 'Web Design', status: 'published', views: 0,
    excerpt: 'From glassmorphism to variable fonts — discover the design patterns top agencies are using to win clients in 2025.',
    content: 'From glassmorphism to variable fonts, this year\'s design language rewards bold, intentional choices over template defaults.\n\nAdd your own full article from Admin → Blog Posts.',
    cover_image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=75&fit=crop',
    emoji: '🖥️', author: 'Royal Graphix', read_time: '5 min read', tags: ['design'],
    published_at: '2025-05-12T00:00:00Z', created_at: '2025-05-12T00:00:00Z',
  },
]

// This is for admins — includes drafts.
export function useAdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) { setError(err.message); setPosts([]) }
      else setPosts(data || [])
    } catch (e) { setError(e.message); setPosts([]) }
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  const slugify = (title) => title.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  const addPost = async (post) => {
    const slug = post.slug?.trim() ? slugify(post.slug) : slugify(post.title || 'untitled')
    const payload = {
      ...post,
      slug,
      views: 0,
      published_at: post.status === 'published' ? new Date().toISOString() : null,
    }
    try {
      const { data, error: err } = await supabase.from('blog_posts').insert(payload).select().single()
      if (!err && data) setPosts(prev => [data, ...prev])
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  const updatePost = async (id, updates) => {
    const payload = { ...updates, updated_at: new Date().toISOString() }
    if (updates.slug) payload.slug = slugify(updates.slug)
    try {
      const { data, error: err } = await supabase.from('blog_posts').update(payload).eq('id', id).select().single()
      if (!err && data) setPosts(prev => prev.map(p => p.id === id ? data : p))
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  const togglePublish = async (post) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published'
    const updates = { status: nextStatus }
    if (nextStatus === 'published' && !post.published_at) updates.published_at = new Date().toISOString()
    return updatePost(post.id, updates)
  }

  const deletePost = async (id) => {
    try {
      const { error: err } = await supabase.from('blog_posts').delete().eq('id', id)
      if (!err) setPosts(prev => prev.filter(p => p.id !== id))
      return { error: err }
    } catch (e) { return { error: { message: e.message } } }
  }

  return { posts, loading, error, refetch: fetchPosts, addPost, updatePost, togglePublish, deletePost }
}

// This is for the public site — published posts only.
export function useBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      if (err || !data || data.length === 0) setPosts(FALLBACK_POSTS)
      else setPosts(data)
    } catch { setPosts(FALLBACK_POSTS) }
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  return { posts, loading, refetch: fetchPosts }
}

export function useBlogPost(slug) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      setNotFound(false)
      try {
        const { data, error: err } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single()
        if (cancelled) return
        if (err || !data) {
          const fb = FALLBACK_POSTS.find(p => p.slug === slug)
          if (fb) setPost(fb)
          else setNotFound(true)
        } else {
          setPost(data)
          // Count a read — once per browser session per post.
          try {
            const key = `rg_read_${data.id}`
            if (!sessionStorage.getItem(key)) {
              sessionStorage.setItem(key, '1')
              supabase.from('blog_posts').update({ views: (data.views || 0) + 1 }).eq('id', data.id).then(() => {})
            }
          } catch { /* storage unavailable — skip silently */ }
        }
      } catch {
        const fb = FALLBACK_POSTS.find(p => p.slug === slug)
        if (fb) setPost(fb)
        else setNotFound(true)
      }
      if (!cancelled) setLoading(false)
    }
    run()
    return () => { cancelled = true }
  }, [slug])

  return { post, loading, notFound }
}

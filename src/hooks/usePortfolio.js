import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// ─────────────────────────────────────────────────────────────
// FALLBACK PORTFOLIO — shown when Supabase has no rows yet.
// These are real live projects built by Royal Graphix.
// Once you add projects via Admin → Portfolio, Supabase data
// takes over and this list is ignored.
// ─────────────────────────────────────────────────────────────
const FALLBACK_PORTFOLIO = [
  {
    id: 'f1', category: 'Web Design', slug: 'africa-for-all', status: 'published',
    live_url: 'https://africa-for-all.vercel.app/',
    title: 'Africa For All',
    description: 'Pan-African community platform connecting people across the continent.',
    image_url: 'https://images.unsplash.com/photo-1493707553966-283afac8c358?w=700&q=75&fit=crop',
    created_at: '2025-06-01T00:00:00Z',
  },
  {
    id: 'f2', category: 'Research & Consulting', slug: 'ark-expert-research', status: 'published',
    live_url: 'https://www.arkexpertresearch.com',
    title: 'ARK Expert Research',
    description: 'Professional research and consulting firm with global reach.',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=75&fit=crop',
    created_at: '2025-06-05T00:00:00Z',
  },
  {
    id: 'f3', category: 'Travel & Tourism', slug: 'mzedu-tours', status: 'published',
    live_url: 'https://mzedu-tours.vercel.app/',
    title: 'Mzedu Tours',
    description: 'Premium travel & safari experiences across East Africa.',
    image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&q=75&fit=crop',
    created_at: '2025-05-15T00:00:00Z',
  },
  {
    id: 'f4', category: 'Church & Ministry', slug: 'divine-encounter-church', status: 'published',
    live_url: 'https://divine-encounter-church.vercel.app/',
    title: 'Divine Encounter Church',
    description: 'Modern church website with sermon archive, events and online giving.',
    image_url: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=700&q=75&fit=crop',
    created_at: '2025-06-08T00:00:00Z',
  },
  {
    id: 'f5', category: 'Church & Ministry', slug: 'voice-of-valour', status: 'published',
    live_url: 'https://www.voiceofvalour.co.ke/',
    title: 'Voice of Valour',
    description: 'FGCK Christ Centre Church — faith, community and ministry online.',
    image_url: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b2?w=700&q=75&fit=crop',
    created_at: '2025-06-10T00:00:00Z',
  },
  {
    id: 'f6', category: 'Web Design', slug: 'jewels-kitchen', status: 'published',
    live_url: 'https://jewels-kitchen.vercel.app/',
    title: 'Jewels Kitchen',
    description: "Nairobi's premier catering & food delivery platform.",
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=75&fit=crop',
    created_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'f7', category: 'Web Design', slug: 'bluestocks-fx-academy', status: 'published',
    live_url: 'https://bluestocks-fx-academy.vercel.app/',
    title: 'Bluestocks FX Academy',
    description: 'Professional Forex education platform for Kenyan traders.',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=700&q=75&fit=crop',
    created_at: '2025-02-01T00:00:00Z',
  },
  {
    id: 'f8', category: 'Web Design', slug: 'pokea-sports', status: 'published',
    live_url: 'https://pokea-sports.vercel.app/',
    title: 'PokeaSports',
    description: "Africa's #1 football news and sports media platform.",
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=75&fit=crop',
    created_at: '2025-02-15T00:00:00Z',
  },
  {
    id: 'f9', category: 'Real Estate', slug: 'karibu-homes', status: 'published',
    live_url: 'https://dariusnyambu.github.io/karibuhomes/',
    title: 'Karibu Homes',
    description: 'Modern property listings & real estate platform for Nairobi.',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=75&fit=crop',
    created_at: '2025-05-01T00:00:00Z',
  },
  {
    id: 'f10', category: 'Web Design', slug: 'ascend-finance', status: 'published',
    live_url: 'https://ascend-alpha-one.vercel.app/',
    title: 'Ascend Finance',
    description: "Kenya's trusted microfinance and investment partner.",
    image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=75&fit=crop',
    created_at: '2025-03-15T00:00:00Z',
  },
]

export function slugifyTitle(title) {
  return (title || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Public — published projects only (case-study pages use usePortfolioItem below).
export function usePortfolio() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) {
        console.warn('[Portfolio] Supabase error — using fallback data:', err.message)
        setItems(FALLBACK_PORTFOLIO)
        setError(err.message)
      } else if (!data || data.length === 0) {
        console.info('[Portfolio] Supabase table is empty — showing fallback portfolio')
        setItems(FALLBACK_PORTFOLIO)
      } else {
        // Treat missing/null status as published, for rows created before the status column existed.
        setItems(data.filter(i => !i.status || i.status === 'published'))
      }
    } catch (e) {
      console.warn('[Portfolio] Exception — using fallback data:', e.message)
      setItems(FALLBACK_PORTFOLIO)
      setError(e.message)
    }
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  return { items, loading, error, refetch: fetchItems }
}

// Public — single case-study page lookup by slug.
export function usePortfolioItem(slug) {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      setNotFound(false)
      try {
        const { data, error: err } = await supabase.from('portfolio').select('*').eq('slug', slug).single()
        if (cancelled) return
        if (err || !data) {
          const fb = FALLBACK_PORTFOLIO.find(p => p.slug === slug)
          if (fb) setItem(fb)
          else setNotFound(true)
        } else {
          setItem(data)
        }
      } catch {
        const fb = FALLBACK_PORTFOLIO.find(p => p.slug === slug)
        if (fb) setItem(fb)
        else setNotFound(true)
      }
      if (!cancelled) setLoading(false)
    }
    run()
    return () => { cancelled = true }
  }, [slug])

  return { item, loading, notFound }
}

// Admin — sees every project regardless of status, full CRUD, auto slug generation.
export function useAdminPortfolio() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) { setError(err.message); setItems([]) }
      else setItems(data || [])
    } catch (e) { setError(e.message); setItems([]) }
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const addItem = async (item) => {
    const slug = item.slug?.trim() ? slugifyTitle(item.slug) : slugifyTitle(item.title || 'project')
    const payload = { ...item, slug }
    try {
      const { data, error: err } = await supabase.from('portfolio').insert(payload).select().single()
      if (!err && data) setItems(prev => [data, ...prev])
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  const updateItem = async (id, updates) => {
    const payload = { ...updates }
    if (updates.slug) payload.slug = slugifyTitle(updates.slug)
    try {
      const { data, error: err } = await supabase.from('portfolio').update(payload).eq('id', id).select().single()
      if (!err && data) setItems(prev => prev.map(i => i.id === id ? data : i))
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  const deleteItem = async (id) => {
    try {
      const { error: err } = await supabase.from('portfolio').delete().eq('id', id)
      if (!err) setItems(prev => prev.filter(i => i.id !== id))
      return { error: err }
    } catch (e) { return { error: { message: e.message } } }
  }

  return { items, loading, error, refetch: fetchItems, addItem, updateItem, deleteItem }
}

import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

function getSessionId() {
  try {
    let id = sessionStorage.getItem('rg_session_id')
    if (!id) {
      id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
      sessionStorage.setItem('rg_session_id', id)
    }
    return id
  } catch {
    return `s_${Date.now()}`
  }
}

// Logs one page_view row per route change. Mount once, high in the public layout.
export function usePageTracking() {
  const location = useLocation()
  const lastPath = useRef(null)

  useEffect(() => {
    if (lastPath.current === location.pathname) return
    lastPath.current = location.pathname
    const payload = {
      path: location.pathname,
      session_id: getSessionId(),
      referrer: document.referrer || null,
    }
    supabase.from('page_views').insert(payload).then(() => {}).catch(() => {})
  }, [location.pathname])
}

const LIVE_WINDOW_MS = 5 * 60 * 1000 // "live now" = active in the last 5 minutes

// Admin — aggregated, near-real-time site analytics.
export function useAnalytics(days = 30) {
  const [views, setViews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchViews = async () => {
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      const { data, error: err } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false })
      if (!err && data) {
        setViews(data.filter(v => v.created_at >= since))
      }
    } catch { /* keep last known data on failure */ }
    setLoading(false)
  }

  useEffect(() => {
    fetchViews()

    // Live updates when connected to real Supabase (falls back to polling otherwise).
    let channel = null
    try {
      channel = supabase
        .channel('page_views_admin')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'page_views' }, (payload) => {
          setViews(prev => [payload.new, ...prev])
        })
        .subscribe()
    } catch { /* realtime unavailable — polling below covers it */ }

    const poll = setInterval(fetchViews, 15000)
    return () => {
      clearInterval(poll)
      if (channel) supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days])

  const now = Date.now()
  const totalViews = views.length
  const uniqueSessions = new Set(views.map(v => v.session_id)).size
  const liveNow = new Set(
    views.filter(v => now - new Date(v.created_at).getTime() < LIVE_WINDOW_MS).map(v => v.session_id)
  ).size

  const pathCounts = {}
  views.forEach(v => { pathCounts[v.path] = (pathCounts[v.path] || 0) + 1 })
  const topPages = Object.entries(pathCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // Daily series for the last `days` days (oldest → newest).
  const dayBuckets = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    dayBuckets[key] = 0
  }
  views.forEach(v => {
    const key = v.created_at.slice(0, 10)
    if (key in dayBuckets) dayBuckets[key] += 1
  })
  const dailySeries = Object.entries(dayBuckets).map(([date, count]) => ({ date, count }))

  return { views, loading, totalViews, uniqueSessions, liveNow, topPages, dailySeries, refetch: fetchViews }
}

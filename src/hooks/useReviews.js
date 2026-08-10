import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Public — visible reviews only.
export function useReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('reviews')
        .select('*')
        .eq('hidden', false)
        .order('created_at', { ascending: false })
      if (!err) setReviews(data || [])
    } catch { /* leave list empty on failure */ }
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [])

  const submitReview = async (form) => {
    const payload = {
      name: (form.name || '').trim(),
      rating: Number(form.rating) || 5,
      message: (form.message || '').trim(),
    }
    if (form.email?.trim()) payload.email = form.email.trim()
    if (form.role?.trim()) payload.role = form.role.trim()
    try {
      const { data, error: err } = await supabase.from('reviews').insert(payload).select().single()
      if (!err && data) setReviews(prev => [data, ...prev])
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  return { reviews, loading, refetch: fetchReviews, submitReview }
}

// Admin — sees everything, can hide/unhide/delete.
export function useAdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) { setError(err.message); setReviews([]) }
      else setReviews(data || [])
    } catch (e) { setError(e.message); setReviews([]) }
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [])

  const toggleHidden = async (review) => {
    try {
      const { data, error: err } = await supabase
        .from('reviews').update({ hidden: !review.hidden }).eq('id', review.id).select().single()
      if (!err && data) setReviews(prev => prev.map(r => r.id === review.id ? data : r))
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  const deleteReview = async (id) => {
    try {
      const { error: err } = await supabase.from('reviews').delete().eq('id', id)
      if (!err) setReviews(prev => prev.filter(r => r.id !== id))
      return { error: err }
    } catch (e) { return { error: { message: e.message } } }
  }

  return { reviews, loading, error, refetch: fetchReviews, toggleHidden, deleteReview }
}

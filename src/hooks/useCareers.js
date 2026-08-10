import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const FALLBACK_JOBS = [
  {
    id: 'f1', title: 'Graphic Designer', icon: 'Palette', type: 'Full-time', location: 'Nairobi, Kenya (Hybrid)', status: 'published',
    summary: 'Own the visual identity of client brands — from logos and social content to full brand systems.',
    responsibilities: ['Design logos, brand identities, and marketing collateral for clients', 'Create social media graphics, posters, and campaign assets'],
    requirements: ['1+ years of professional graphic design experience', 'Strong portfolio across branding, print, and digital design'],
  },
]

// Public — published jobs only.
export function useCareers() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      if (err || !data || data.length === 0) setJobs(FALLBACK_JOBS)
      else setJobs(data)
    } catch { setJobs(FALLBACK_JOBS) }
    setLoading(false)
  }

  useEffect(() => { fetchJobs() }, [])

  return { jobs, loading, refetch: fetchJobs }
}

// Admin — sees all jobs (draft + published), full CRUD.
export function useAdminCareers() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) { setError(err.message); setJobs([]) }
      else setJobs(data || [])
    } catch (e) { setError(e.message); setJobs([]) }
    setLoading(false)
  }

  useEffect(() => { fetchJobs() }, [])

  const addJob = async (job) => {
    const payload = { ...job }
    try {
      const { data, error: err } = await supabase.from('jobs').insert(payload).select().single()
      if (!err && data) setJobs(prev => [data, ...prev])
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  const updateJob = async (id, updates) => {
    const payload = { ...updates, updated_at: new Date().toISOString() }
    try {
      const { data, error: err } = await supabase.from('jobs').update(payload).eq('id', id).select().single()
      if (!err && data) setJobs(prev => prev.map(j => j.id === id ? data : j))
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  const toggleStatus = async (job) => {
    return updateJob(job.id, { status: job.status === 'published' ? 'draft' : 'published' })
  }

  const deleteJob = async (id) => {
    try {
      const { error: err } = await supabase.from('jobs').delete().eq('id', id)
      if (!err) setJobs(prev => prev.filter(j => j.id !== id))
      return { error: err }
    } catch (e) { return { error: { message: e.message } } }
  }

  return { jobs, loading, error, refetch: fetchJobs, addJob, updateJob, toggleStatus, deleteJob }
}

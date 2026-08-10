import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useJobApplications() {
  const submitApplication = async (form) => {
    const payload = {
      role: (form.role || '').trim(),
      name: (form.name || '').trim(),
      email: (form.email || '').trim(),
    }
    if (form.phone?.trim()) payload.phone = form.phone.trim()
    if (form.portfolio_url?.trim()) payload.portfolio_url = form.portfolio_url.trim()
    if (form.message?.trim()) payload.message = form.message.trim()
    try {
      const { data, error: err } = await supabase.from('job_applications').insert(payload).select().single()
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  return { submitApplication }
}

// Admin — list, update status, delete.
export function useAdminJobApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) { setError(err.message); setApplications([]) }
      else setApplications(data || [])
    } catch (e) { setError(e.message); setApplications([]) }
    setLoading(false)
  }

  useEffect(() => { fetchApplications() }, [])

  const updateStatus = async (id, status) => {
    try {
      const { data, error: err } = await supabase.from('job_applications').update({ status }).eq('id', id).select().single()
      if (!err && data) setApplications(prev => prev.map(a => a.id === id ? data : a))
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  const deleteApplication = async (id) => {
    try {
      const { error: err } = await supabase.from('job_applications').delete().eq('id', id)
      if (!err) setApplications(prev => prev.filter(a => a.id !== id))
      return { error: err }
    } catch (e) { return { error: { message: e.message } } }
  }

  return { applications, loading, error, refetch: fetchApplications, updateStatus, deleteApplication }
}

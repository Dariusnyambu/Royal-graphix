import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// ─────────────────────────────────────────────────────────────
// Project status config — single source of truth for labels,
// colours and ordering used by both admin and public tracker.
// ─────────────────────────────────────────────────────────────
export const PROJECT_STATUSES = [
  { key: 'received',         label: 'Project Received',    color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  order: 1 },
  { key: 'awaiting_payment', label: 'Awaiting Payment',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  order: 2 },
  { key: 'paid',             label: 'Payment Confirmed',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   order: 3 },
  { key: 'in_progress',      label: 'In Progress',         color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  order: 4 },
  { key: 'review',           label: 'Under Review',        color: '#C8102E', bg: 'rgba(200,16,46,0.12)',   order: 5 },
  { key: 'delivered',        label: 'Delivered',           color: '#10b981', bg: 'rgba(16,185,129,0.12)',  order: 6 },
  { key: 'cancelled',        label: 'Cancelled',           color: '#6b7280', bg: 'rgba(107,114,128,0.12)', order: 7 },
]

export const PRIORITY_CONFIG = {
  low:    { label: 'Low',    color: '#6b7280' },
  normal: { label: 'Normal', color: '#3b82f6' },
  high:   { label: 'High',   color: '#f59e0b' },
  urgent: { label: 'Urgent', color: '#C8102E' },
}

export function getStatusConfig(key) {
  return PROJECT_STATUSES.find(s => s.key === key) || PROJECT_STATUSES[0]
}

// Generate a random 8-character tracking code
export function generateTrackingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'RG-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// ─────────────────────────────────────────────────────────────
// Mock in-memory store (used when Supabase is unavailable)
// ─────────────────────────────────────────────────────────────
const _mockProjects = [
  {
    id: 'mock-1', client_name: 'James Mwangi', client_email: 'james@example.co.ke',
    client_phone: '+254700000001', project_type: 'Web Design', title: 'Company Website',
    description: 'A 5-page business website with contact form and portfolio.',
    status: 'in_progress', priority: 'high', amount: 30000, deadline: '2025-08-15',
    notes: 'Client prefers dark theme.', tracking_code: 'RG-DEMO01',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-2', client_name: 'Sarah Kamau', client_email: 'sarah@church.org',
    client_phone: '+254700000002', project_type: 'Church Media', title: 'Monthly Design Package',
    description: 'Starter Church Media Package — 8 posters per month.',
    status: 'paid', priority: 'normal', amount: 3000, deadline: null,
    notes: '', tracking_code: 'RG-DEMO02',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-3', client_name: 'Peter Odhiambo', client_email: 'peter@shop.co.ke',
    client_phone: '+254700000003', project_type: 'Logo Design', title: 'Business Logo',
    description: 'Custom logo for a retail shop.',
    status: 'review', priority: 'normal', amount: 8000, deadline: '2025-07-30',
    notes: 'First draft sent, awaiting feedback.', tracking_code: 'RG-DEMO03',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchProjects = async () => {
    setLoading(true); setError(null)
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) {
        console.error('[Projects] Fetch error:', err.message)
        // Fall back to mock data so the UI still shows something useful
        setProjects(_mockProjects)
        setError(err.message)
      } else {
        setProjects(data?.length ? data : _mockProjects)
      }
    } catch (e) {
      console.error('[Projects] Exception:', e)
      setProjects(_mockProjects)
      setError(e.message)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  // ── Create a new project ───────────────────────────────────
  const createProject = async (form) => {
    const payload = {
      ...form,
      tracking_code: form.tracking_code || generateTrackingCode(),
      status: form.status || 'received',
      priority: form.priority || 'normal',
      updated_at: new Date().toISOString(),
    }
    try {
      const { data, error: err } = await supabase
        .from('projects').insert([payload]).select()
      if (err) {
        // Optimistic mock fallback
        const mock = { ...payload, id: `mock-${Date.now()}`, created_at: new Date().toISOString() }
        setProjects(p => [mock, ...p])
        return { data: mock, error: null }
      }
      const created = Array.isArray(data) ? data[0] : data
      setProjects(p => [created, ...p])
      return { data: created, error: null }
    } catch (e) {
      return { data: null, error: { message: e.message } }
    }
  }

  // ── Update status or any field ─────────────────────────────
  const updateProject = async (id, updates) => {
    const payload = { ...updates, updated_at: new Date().toISOString() }
    // Optimistic update first (fast UI)
    setProjects(p => p.map(proj => proj.id === id ? { ...proj, ...payload } : proj))
    try {
      const { data, error: err } = await supabase
        .from('projects').update(payload).eq('id', id).select()
      if (err) console.error('[Projects] Update error:', err.message)
      return { data, error: err }
    } catch (e) {
      return { data: null, error: { message: e.message } }
    }
  }

  // ── Delete ─────────────────────────────────────────────────
  const deleteProject = async (id) => {
    setProjects(p => p.filter(proj => proj.id !== id))
    try {
      const { error: err } = await supabase.from('projects').delete().eq('id', id)
      if (err) console.error('[Projects] Delete error:', err.message)
      return { error: err }
    } catch (e) {
      return { error: { message: e.message } }
    }
  }

  // ── Public tracker: look up by tracking code ───────────────
  const lookupByCode = async (code) => {
    const clean = code.trim().toUpperCase()
    try {
      const { data, error: err } = await supabase
        .from('projects').select('*').eq('tracking_code', clean).single()
      if (err || !data) {
        // Try mock fallback
        const mock = _mockProjects.find(p => p.tracking_code === clean)
        return { data: mock || null, error: mock ? null : { message: 'Project not found' } }
      }
      return { data, error: null }
    } catch (e) {
      return { data: null, error: { message: e.message } }
    }
  }

  return { projects, loading, error, fetchProjects, createProject, updateProject, deleteProject, lookupByCode }
}

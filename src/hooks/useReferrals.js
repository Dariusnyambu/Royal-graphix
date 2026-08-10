import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// ─────────────────────────────────────────────────────────────
// Referral status config
// ─────────────────────────────────────────────────────────────
export const REFERRAL_STATUSES = [
  { key: 'pending',    label: 'Pending',             color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  { key: 'contacted',  label: 'Client Contacted',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { key: 'in_progress',label: 'Project In Progress', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  { key: 'completed',  label: 'Project Completed',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  { key: 'paid',       label: 'Commission Paid',     color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { key: 'rejected',   label: 'Not Qualified',       color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
]

export function getReferralStatus(key) {
  return REFERRAL_STATUSES.find(s => s.key === key) || REFERRAL_STATUSES[0]
}

// Generate unique referral code: RG-REF-XXXXXX
export function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `RG-REF-${rand}`
}

// Calculate 20% commission
export function calcCommission(amount) {
  return amount ? Math.round(amount * 0.2) : 0
}

// ── Mock fallback data ─────────────────────────────────────────
const MOCK_REFERRALS = [
  {
    id: 'r1', referrer_name: 'John Kamau', referrer_email: 'john@example.com',
    referrer_phone: '+254711000001', referral_code: 'RG-REF-DEMO01',
    referred_name: 'Sarah Wanjiku', referred_email: 'sarah@business.co.ke',
    referred_phone: '+254711000002', referred_service: 'Web Design',
    project_amount: 30000, commission_amount: 6000,
    status: 'completed', notes: 'Website delivered and client happy.',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'r2', referrer_name: 'Grace Achieng', referrer_email: 'grace@example.com',
    referrer_phone: '+254711000003', referral_code: 'RG-REF-DEMO02',
    referred_name: 'Peter Oduya', referred_email: 'peter@shop.co.ke',
    referred_phone: '+254711000004', referred_service: 'Logo Design',
    project_amount: 8000, commission_amount: 1600,
    status: 'in_progress', notes: 'Project started.',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

export function useReferrals() {
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const fetchReferrals = async () => {
    setLoading(true); setError(null)
    try {
      const { data, error: err } = await supabase
        .from('referrals').select('*').order('created_at', { ascending: false })
      if (err) { setReferrals(MOCK_REFERRALS); setError(err.message) }
      else setReferrals(data?.length ? data : MOCK_REFERRALS)
    } catch (e) { setReferrals(MOCK_REFERRALS); setError(e.message) }
    setLoading(false)
  }

  useEffect(() => { fetchReferrals() }, [])

  const submitReferral = async (form) => {
    const payload = {
      ...form,
      referral_code: generateReferralCode(),
      commission_amount: 0,
      status: 'pending',
      updated_at: new Date().toISOString(),
    }
    try {
      const { data, error: err } = await supabase
        .from('referrals').insert([payload]).select()
      if (err) {
        const mock = { ...payload, id: `r-${Date.now()}`, created_at: new Date().toISOString() }
        setReferrals(p => [mock, ...p])
        return { data: mock, error: null }
      }
      const created = Array.isArray(data) ? data[0] : data
      setReferrals(p => [created, ...p])
      return { data: created, error: null }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  const updateReferral = async (id, updates) => {
    const payload = { ...updates, updated_at: new Date().toISOString() }
    setReferrals(p => p.map(r => r.id === id ? { ...r, ...payload } : r))
    try {
      const { data, error: err } = await supabase
        .from('referrals').update(payload).eq('id', id).select()
      return { data, error: err }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  const deleteReferral = async (id) => {
    setReferrals(p => p.filter(r => r.id !== id))
    try {
      const { error: err } = await supabase.from('referrals').delete().eq('id', id)
      return { error: err }
    } catch (e) { return { error: { message: e.message } } }
  }

  // Lookup by referral code (for admin search)
  const lookupByCode = async (code) => {
    try {
      const { data, error: err } = await supabase
        .from('referrals').select('*').eq('referral_code', code.trim().toUpperCase()).single()
      if (err || !data) {
        const mock = MOCK_REFERRALS.find(r => r.referral_code === code.trim().toUpperCase())
        return { data: mock || null, error: mock ? null : { message: 'Referral not found' } }
      }
      return { data, error: null }
    } catch (e) { return { data: null, error: { message: e.message } } }
  }

  // Stats
  const stats = {
    total:           referrals.length,
    pending:         referrals.filter(r => r.status === 'pending').length,
    completed:       referrals.filter(r => r.status === 'completed').length,
    paid:            referrals.filter(r => r.status === 'paid').length,
    totalCommission: referrals.reduce((s, r) => s + (r.commission_amount || 0), 0),
    pendingPayout:   referrals.filter(r => r.status === 'completed').reduce((s, r) => s + (r.commission_amount || 0), 0),
  }

  return { referrals, loading, error, stats, fetchReferrals, submitReferral, updateReferral, deleteReferral, lookupByCode }
}

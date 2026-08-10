import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { submitToGoogleSheets } from '@/lib/googleSheets'

export function useContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchContacts = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) {
        console.error('[Admin] Failed to fetch contacts from Supabase:', err.message)
        setError(err.message)
        setLoading(false)
        return
      }
      setContacts(data || [])
    } catch (e) {
      console.error('[Admin] Exception fetching contacts:', e)
      setError(e.message)
    }
    setLoading(false)
  }

  useEffect(() => { fetchContacts() }, [])

  const submitContact = async (form) => {
    const payload = {
      name:         (form.name         || '').trim(),
      email:        (form.email        || '').trim(),
      project_type: (form.project_type || '').trim(),
      message:      (form.message      || '').trim(),
    }
    if (form.phone?.trim())  payload.phone  = form.phone.trim()
    if (form.budget?.trim()) payload.budget = form.budget.trim()

    let supabaseOk = false
    let insertedRow = null
    let supabaseError = null

    // ── 1. Try Supabase first (source of truth for admin dashboard) ────────
    try {
      const { data, error: err } = await supabase
        .from('contacts')
        .insert([payload])
        .select()

      if (err) {
        supabaseError = err.message
        console.error('[Contact Form] Supabase insert error:', err.message)
      } else {
        supabaseOk = true
        insertedRow = Array.isArray(data) ? data[0] : data
        if (insertedRow) setContacts(prev => [insertedRow, ...prev])
      }
    } catch (e) {
      supabaseError = e.message
      console.error('[Contact Form] Supabase insert exception:', e)
    }

    // ── 2. Always also send to Google Sheets (backup / instant visibility) ──
    try {
      await submitToGoogleSheets('Contacts', {
        ...payload,
        ...(supabaseError ? { supabase_status: 'FAILED: ' + supabaseError } : { supabase_status: 'OK' }),
      })
    } catch (_) { /* Sheets failure shouldn't block the user */ }

    // ── 3. Report real status back to the form ───────────────────────────
    if (supabaseOk) {
      return { data: insertedRow, error: null }
    }
    // Supabase failed but Sheets succeeded — still confirm to user,
    // but log clearly so admin knows to check Supabase RLS/schema.
    console.warn('[Contact Form] Saved to Google Sheets only. Supabase failed:', supabaseError)
    return { data: payload, error: null, supabaseFailed: true }
  }

  const deleteContact = async (id) => {
    try {
      const { error: err } = await supabase.from('contacts').delete().eq('id', id)
      if (!err) setContacts(prev => prev.filter(c => c.id !== id))
      return { error: err }
    } catch (e) {
      return { error: { message: e.message } }
    }
  }

  return { contacts, loading, error, submitContact, deleteContact, refetch: fetchContacts }
}

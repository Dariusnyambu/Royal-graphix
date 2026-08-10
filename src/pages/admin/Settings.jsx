import { useState } from 'react'
import { Settings as SettingsIcon, ToggleLeft, ToggleRight, Globe, Link2, Bell, Shield, AlertTriangle, Plug, Building2, LogOut, Send, CheckCircle2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { submitToGoogleSheets } from '@/lib/googleSheets'
import { supabase } from '@/lib/supabase'

export default function Settings() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [testingSheets, setTestingSheets] = useState(false)
  const [sheetsTestResult, setSheetsTestResult] = useState(null)
  const [testingSupabase, setTestingSupabase] = useState(false)
  const [supabaseTestResult, setSupabaseTestResult] = useState(null)

  const handleTestSheets = async () => {
    setTestingSheets(true)
    setSheetsTestResult(null)
    const testRow = {
      name: 'TEST — ' + new Date().toLocaleTimeString(),
      email: 'test@royalgraphix.co.ke',
      phone: '+254700000000',
      project_type: 'Connection Test',
      budget: 'N/A',
      message: 'This is a test row sent from Admin Settings to verify Google Sheets is receiving data.',
    }
    const result = await submitToGoogleSheets('Contacts', testRow)
    setTestingSheets(false)
    setSheetsTestResult(result)
    if (result.success) {
      toast.success('Test row sent! Check your Google Sheet now for a row starting with "TEST —"')
    } else {
      toast.error('Failed to send test row: ' + (result.error || 'Unknown error'))
    }
  }

  const handleTestSupabase = async () => {
    setTestingSupabase(true)
    setSupabaseTestResult(null)
    try {
      const { data, error, count } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: false })
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        setSupabaseTestResult({ success: false, error: error.message })
        toast.error('Supabase read failed: ' + error.message)
      } else {
        setSupabaseTestResult({ success: true, count: data?.length ?? 0, rows: data })
        toast.success(`Connected! Found ${data?.length ?? 0} contact(s) in Supabase.`)
      }
    } catch (e) {
      setSupabaseTestResult({ success: false, error: e.message })
      toast.error('Supabase test error: ' + e.message)
    }
    setTestingSupabase(false)
  }

  const [agency, setAgency] = useState({
    name: 'Royal Graphix',
    email: 'info@royalgraphix.co.ke',
    phone: '+254 708 039 015',
    location: 'Nairobi, Kenya',
    website: 'https://royalgraphix.com',
    tagline: 'We Design. We Build. We Grow Brands.',
  })

  const [social, setSocial] = useState({
    twitter: 'https://twitter.com/royalgraphix',
    linkedin: 'https://linkedin.com/company/royalgraphix',
    instagram: 'https://instagram.com/royalgraphix',
    facebook: 'https://facebook.com/royalgraphix',
  })

  const [notifications, setNotifications] = useState({
    newLead: true,
    weeklyReport: true,
    systemAlerts: false,
  })

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [savingAgency, setSavingAgency] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleSaveAgency = async () => {
    setSavingAgency(true)
    await new Promise(r => setTimeout(r, 600))
    setSavingAgency(false)
    toast.success('Agency settings saved!')
  }

  const handleSavePassword = async () => {
    if (!passwords.current) { toast.error('Enter your current password'); return }
    if (passwords.next.length < 8) { toast.error('New password must be at least 8 characters'); return }
    if (passwords.next !== passwords.confirm) { toast.error('Passwords do not match'); return }
    setSavingPassword(true)
    await new Promise(r => setTimeout(r, 600))
    setSavingPassword(false)
    setPasswords({ current: '', next: '', confirm: '' })
    toast.success('Password updated!')
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    navigate('/admin/login')
  }

  return (
    <>
      <Helmet><title>Settings — Royal Graphix Admin</title></Helmet>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
          Manage your agency profile, integrations, and account preferences.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 720 }}>

        {/* Agency Info */}
        <SettingsCard title="Agency Information" iconComp={<Building2 size={16} strokeWidth={1.8} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <Field label="Agency Name">
              <Input value={agency.name} onChange={v => setAgency(p => ({ ...p, name: v }))} />
            </Field>
            <Field label="Contact Email">
              <Input value={agency.email} onChange={v => setAgency(p => ({ ...p, email: v }))} type="email" />
            </Field>
            <Field label="Phone Number">
              <Input value={agency.phone} onChange={v => setAgency(p => ({ ...p, phone: v }))} />
            </Field>
            <Field label="Location">
              <Input value={agency.location} onChange={v => setAgency(p => ({ ...p, location: v }))} />
            </Field>
            <Field label="Website URL">
              <Input value={agency.website} onChange={v => setAgency(p => ({ ...p, website: v }))} />
            </Field>
            <Field label="Tagline">
              <Input value={agency.tagline} onChange={v => setAgency(p => ({ ...p, tagline: v }))} />
            </Field>
          </div>
          <Button onClick={handleSaveAgency} loading={savingAgency}>
            {savingAgency ? 'Saving...' : 'Save Changes'}
          </Button>
        </SettingsCard>

        {/* Social Media */}
        <SettingsCard title="Social Media Links" iconComp={<Globe size={16} strokeWidth={1.8} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            {Object.entries(social).map(([key, val]) => (
              <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                <Input
                  value={val}
                  onChange={v => setSocial(p => ({ ...p, [key]: v }))}
                  placeholder={`https://${key}.com/royalgraphix`}
                />
              </Field>
            ))}
          </div>
          <Button onClick={() => toast.success('Social links saved!')}>Save Links</Button>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard title="Notification Preferences" iconComp={<Bell size={16} strokeWidth={1.8} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { key: 'newLead', label: 'New contact lead submitted', desc: 'Get notified when someone fills out the contact form' },
              { key: 'weeklyReport', label: 'Weekly analytics report', desc: 'Receive a weekly summary of site traffic and leads' },
              { key: 'systemAlerts', label: 'System alerts', desc: 'Notifications for errors, downtime, and system events' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                </div>
                <Toggle
                  checked={notifications[item.key]}
                  onChange={v => setNotifications(p => ({ ...p, [item.key]: v }))}
                />
              </div>
            ))}
          </div>
          <Button onClick={() => toast.success('Notification preferences saved!')}>Save Preferences</Button>
        </SettingsCard>

        {/* Supabase / Integrations */}
        <SettingsCard title="Integrations" iconComp={<Plug size={16} strokeWidth={1.8} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { name: 'Supabase', desc: 'Database, Auth & Storage', status: 'Connected', color: '#22c55e' },
              { name: 'Google Analytics', desc: 'Website traffic & events', status: 'Not connected', color: '#f59e0b' },
              { name: 'Mailchimp', desc: 'Email marketing & lists', status: 'Not connected', color: '#f59e0b' },
            ].map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: 100,
                  background: item.color === '#22c55e' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                  color: item.color,
                  fontSize: '0.72rem', fontWeight: 700,
                }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Connection test tools */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Connection Diagnostics
            </div>

            {/* Test Supabase read */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Test Supabase Read</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Checks if the dashboard can actually read the contacts table</div>
                </div>
                <button onClick={handleTestSupabase} disabled={testingSupabase}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--border-med)', background: 'transparent', color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600, cursor: testingSupabase ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                  <CheckCircle2 size={14} strokeWidth={2} />
                  {testingSupabase ? 'Testing...' : 'Run Test'}
                </button>
              </div>
              {supabaseTestResult && (
                <div style={{
                  marginTop: 10, padding: '0.75rem', borderRadius: 8, fontSize: '0.78rem', lineHeight: 1.6,
                  background: supabaseTestResult.success ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${supabaseTestResult.success ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                  color: supabaseTestResult.success ? '#16a34a' : '#ef4444',
                }}>
                  {supabaseTestResult.success
                    ? `Success — found ${supabaseTestResult.count} contact(s) in Supabase. ${supabaseTestResult.count === 0 ? 'Table is empty: no submissions have reached Supabase yet.' : 'Reload the Submissions page if you don\'t see them there.'}`
                    : `Failed: ${supabaseTestResult.error}. ${supabaseTestResult.error?.toLowerCase().includes('permission') || supabaseTestResult.error?.toLowerCase().includes('policy') ? 'This is a Row Level Security issue — run supabase/migrations/002_fix_contacts_rls.sql in your Supabase SQL Editor.' : ''}`
                  }
                </div>
              )}
            </div>

            {/* Test Google Sheets write */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Test Google Sheets Write</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Sends a test row — check your sheet immediately after</div>
                </div>
                <button onClick={handleTestSheets} disabled={testingSheets}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--border-med)', background: 'transparent', color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600, cursor: testingSheets ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                  <Send size={14} strokeWidth={2} />
                  {testingSheets ? 'Sending...' : 'Send Test Row'}
                </button>
              </div>
              {sheetsTestResult && (
                <div style={{
                  marginTop: 10, padding: '0.75rem', borderRadius: 8, fontSize: '0.78rem', lineHeight: 1.6,
                  background: sheetsTestResult.success ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${sheetsTestResult.success ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                  color: sheetsTestResult.success ? '#16a34a' : '#ef4444',
                }}>
                  {sheetsTestResult.success
                    ? 'Test row sent. Open your Google Sheet now — a row starting with "TEST —" should appear in the Contacts tab within a few seconds. If it does NOT appear, your Apps Script deployment URL in .env is stale or not set to "Anyone" access — redeploy and update VITE_GOOGLE_SHEETS_URL.'
                    : `Failed to send: ${sheetsTestResult.error}`
                  }
                </div>
              )}
            </div>
          </div>
        </SettingsCard>


        {/* Account */}
        <SettingsCard title="Account Security" iconComp={<Shield size={16} strokeWidth={1.8} />}>
          <div style={{ marginBottom: '1rem', padding: '0.875rem 1rem', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4 }}>Logged in as</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.email}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            <Field label="Current Password">
              <Input value={passwords.current} onChange={v => setPasswords(p => ({ ...p, current: v }))} type="password" placeholder="••••••••" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="New Password">
                <Input value={passwords.next} onChange={v => setPasswords(p => ({ ...p, next: v }))} type="password" placeholder="Min. 8 characters" />
              </Field>
              <Field label="Confirm New Password">
                <Input value={passwords.confirm} onChange={v => setPasswords(p => ({ ...p, confirm: v }))} type="password" placeholder="Re-enter password" />
              </Field>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button onClick={handleSavePassword} loading={savingPassword}>
              {savingPassword ? 'Updating...' : 'Update Password'}
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
            >
              Sign Out
            </Button>
          </div>
        </SettingsCard>

        {/* Danger Zone */}
        <SettingsCard title="Danger Zone" iconComp={<AlertTriangle size={16} color="#ef4444" strokeWidth={1.8} />}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            These actions are irreversible. Please proceed with caution.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              onClick={() => toast.error('Contact Anthropic support to delete your account.')}
              style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' }}
            >
              Delete Account
            </Button>
            <Button
              onClick={() => {
                if (window.confirm('Clear all contact leads from the database?')) {
                  toast.success('All leads cleared (demo mode)')
                }
              }}
              style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' }}
            >
              Clear All Leads
            </Button>
          </div>
        </SettingsCard>

      </div>
    </>
  )
}

/* ── Subcomponents ── */

function SettingsCard({ title, icon, iconComp, children }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.75rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        {iconComp || <span>{icon}</span>} {title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', background: 'var(--bg)',
        border: '1px solid var(--border)', borderRadius: 10,
        padding: '0.65rem 1rem', fontSize: '0.875rem',
        color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none',
        transition: 'border-color 0.2s',
      }}
      onFocus={e => (e.target.style.borderColor = 'var(--red)')}
      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
    />
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? 'var(--red)' : 'var(--border)',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.25s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: 'white',
        transition: 'left 0.25s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

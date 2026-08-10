import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Image, MessageSquare, BarChart2, FileText, Settings, LogOut, Zap, FileInput, KanbanSquare, Gift, Star, Briefcase, Wrench, UserSquare2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const SIDEBAR_LINKS = [
  { path: '/admin',              label: 'Dashboard',       icon: LayoutDashboard, end: true },
  { path: '/admin/portfolio',    label: 'Portfolio',       icon: Image },
  { path: '/admin/services',     label: 'Services',        icon: Wrench },
  { path: '/admin/projects',     label: 'Project Tracker', icon: KanbanSquare },
  { path: '/admin/referrals',    label: 'Refer & Earn',    icon: Gift },
  { path: '/admin/submissions',  label: 'Form Submissions',icon: FileInput },
  { path: '/admin/contacts',     label: 'Contact Leads',   icon: MessageSquare },
  { path: '/admin/analytics',    label: 'Analytics',       icon: BarChart2 },
  { path: '/admin/blog',         label: 'Blog Posts',      icon: FileText },
  { path: '/admin/reviews',      label: 'Reviews',         icon: Star },
  { path: '/admin/jobs',         label: 'Job Postings',    icon: UserSquare2 },
  { path: '/admin/careers',      label: 'Applications',    icon: Briefcase },
  { path: '/admin/settings',     label: 'Settings',        icon: Settings },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/admin/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '0',
        position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo area */}
        <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
                RG Admin
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-faint)', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
            Menu
          </div>
          {SIDEBAR_LINKS.map(({ path, label, icon: Icon, end }) => (
            <NavLink key={path} to={path} end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem', fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--red)' : 'var(--text-muted)',
                background: isActive ? 'rgba(200,16,46,0.08)' : 'transparent',
                textDecoration: 'none', transition: 'all 0.18s',
                borderLeft: `2px solid ${isActive ? 'var(--red)' : 'transparent'}`,
              })}
              onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--text)' } }}
              onMouseLeave={e => { if (!e.currentTarget.classList.contains('active')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' } }}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Sign out */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={handleSignOut}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <LogOut size={16} strokeWidth={1.8} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'var(--bg)', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}

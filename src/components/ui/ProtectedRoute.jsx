import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: '1rem',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--red)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Checking authentication…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

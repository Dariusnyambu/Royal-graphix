import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ open, onClose, title, children, maxWidth = 560 }) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '2rem',
              maxWidth, width: '100%', maxHeight: '90vh', overflowY: 'auto',
            }}
          >
            {title && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800 }}>{title}</h3>
                <button
                  onClick={onClose}
                  style={{
                    width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)',
                    background: 'transparent', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

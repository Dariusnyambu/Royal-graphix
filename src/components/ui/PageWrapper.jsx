import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { pageVariants, pageTransition } from '@/lib/motion'

export default function PageWrapper({ children, title }) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Re-run scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const timer = setTimeout(() => els.forEach(el => observer.observe(el)), 50)
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [])

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ paddingTop: 'var(--nav-h)' }}
    >
      {children}
    </motion.div>
  )
}

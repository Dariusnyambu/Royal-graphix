import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/layout/Chatbot'
import { usePageTracking } from '@/hooks/useAnalytics'

export default function MainLayout() {
  usePageTracking()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

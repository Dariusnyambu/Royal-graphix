import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from '@/components/ui/ProtectedRoute'
import SmartPopups from '@/components/ui/SmartPopups'

// Pages
import Home from '@/pages/Home'
import Services from '@/pages/Services'
import Portfolio from '@/pages/Portfolio'
import Blog from '@/pages/Blog'
import BlogArticle from '@/pages/BlogArticle'
import Pricing from '@/pages/Pricing'
import Contact from '@/pages/Contact'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminPortfolio from '@/pages/admin/Portfolio'
import AdminSubmissions from '@/pages/admin/Submissions'
import AdminContacts from '@/pages/admin/Contacts'
import AdminAnalytics from '@/pages/admin/Analytics'
import AdminBlog from '@/pages/admin/Blog'
import AdminSettings from '@/pages/admin/Settings'
import AdminProjects from '@/pages/admin/Projects'
import AdminLogin from '@/pages/admin/Login'
import TrackProject from '@/pages/TrackProject'
import NotFound from '@/pages/NotFound'

export default function App() {
  const location = useLocation()

  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Smart popups — app download, Google review, social follow */}
        <SmartPopups />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public site */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/track" element={<TrackProject />} />
            </Route>

            {/* Admin login (standalone) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </ThemeProvider>
  )
}

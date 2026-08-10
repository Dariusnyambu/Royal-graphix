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
import ServiceDetail from '@/pages/ServiceDetail'
import Portfolio from '@/pages/Portfolio'
import PortfolioDetail from '@/pages/PortfolioDetail'
import Blog from '@/pages/Blog'
import BlogArticle from '@/pages/BlogArticle'
import Pricing from '@/pages/Pricing'
import Contact from '@/pages/Contact'
import Reviews from '@/pages/Reviews'
import Careers from '@/pages/Careers'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminPortfolio from '@/pages/admin/Portfolio'
import AdminSubmissions from '@/pages/admin/Submissions'
import AdminContacts from '@/pages/admin/Contacts'
import AdminAnalytics from '@/pages/admin/Analytics'
import AdminBlog from '@/pages/admin/Blog'
import AdminReviews from '@/pages/admin/Reviews'
import AdminCareers from '@/pages/admin/Careers'
import AdminJobs from '@/pages/admin/Jobs'
import AdminServices from '@/pages/admin/Services'
import AdminSettings from '@/pages/admin/Settings'
import AdminProjects from '@/pages/admin/Projects'
import AdminLogin from '@/pages/admin/Login'
import TrackProject from '@/pages/TrackProject'
import Refer from '@/pages/Refer'
import AdminReferrals from '@/pages/admin/Referrals'
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
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/track" element={<TrackProject />} />
              <Route path="/refer" element={<Refer />} />
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
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="careers" element={<AdminCareers />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="referrals" element={<AdminReferrals />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </ThemeProvider>
  )
}

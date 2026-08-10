import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

// ── Router selection ─────────────────────────────────────────────────────────
// BrowserRouter uses the HTML5 History API, which requires a server that can
// serve index.html for any path (handled by vercel.json rewrites on web).
// Inside Android WebView there is no server — navigating to '/contact' loads
// a file path that doesn't exist and returns a blank screen.
// HashRouter uses the URL hash (#/contact) so all routes resolve to the same
// file (index.html) and routing works correctly inside the APK.
//
// We detect Capacitor via the window.Capacitor global that Capacitor injects.
// On web: window.Capacitor is undefined → BrowserRouter.
// On Android/iOS: window.Capacitor.isNativePlatform() → true → HashRouter.
// ─────────────────────────────────────────────────────────────────────────────
const isNative = typeof window !== 'undefined' &&
  window.Capacitor?.isNativePlatform?.() === true

const Router = isNative ? HashRouter : BrowserRouter

const ROUTER_PROPS = isNative
  ? {}   // HashRouter needs no extra props
  : { future: { v7_startTransition: true, v7_relativeSplatPath: true } }

const TOAST_STYLE = {
  background: 'var(--surface)',
  color: 'var(--text)',
  border: '1px solid var(--border-med)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.875rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Router {...ROUTER_PROPS}>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: TOAST_STYLE,
            success: { iconTheme: { primary: '#C8102E', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </Router>
    </HelmetProvider>
  </React.StrictMode>
)

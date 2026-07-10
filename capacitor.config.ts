import { CapacitorConfig } from '@capacitor/cli'

// ─────────────────────────────────────────────────────────────
// Capacitor Config — Royal Graphix
//
// appId:   Unique reverse-domain identifier for Google Play.
//          Must match the applicationId in android/app/build.gradle.
// appName: Display name shown under the app icon on the device.
// webDir:  Must exactly match build.outDir in vite.config.js ('dist').
//
// androidScheme: 'https' is required for Supabase.
// Supabase uses cookies and the Fetch API — both require a
// secure context (HTTPS). Setting androidScheme to 'https'
// makes Capacitor treat the local WebView origin as HTTPS
// (https://royalgraphix.app) even though files are loaded from
// the APK filesystem, satisfying browser security requirements.
// ─────────────────────────────────────────────────────────────

const config: CapacitorConfig = {

  // ── App identity ─────────────────────────────────────────────
  appId:   'co.ke.royalgraphix.app',
  appName: 'Royal Graphix',

  // ── Web output directory ──────────────────────────────────────
  webDir: 'dist',

  // ── Server / WebView settings ─────────────────────────────────
  server: {
    // For live-reload during development, uncomment and set your
    // local machine's IP (NOT localhost — the device can't reach it).
    // url: 'http://192.168.X.X:5173',

    androidScheme: 'https',       // Required for Supabase (secure context)
    cleartext:     false,         // Block all plain HTTP traffic
    hostname:      'royalgraphix.app', // Virtual host inside Android WebView
  },

  // ── Android platform settings ─────────────────────────────────
  android: {
    allowMixedContent: false,     // No HTTP within HTTPS context
    captureInput:      true,      // Hardware back button → browser history
    backgroundColor:  '#050505', // WebView bg while JS loads (matches --bg)
  },

  // ── Plugin configuration ──────────────────────────────────────
  plugins: {

    SplashScreen: {
      // Capacitor 6 uses Android 12 SplashScreen API natively.
      // No separate splash PNG is required; the backgroundColor
      // fills the screen while the WebView initialises.
      launchShowDuration:       2000,    // ms to hold splash
      launchAutoHide:           true,    // auto-hide when web content ready
      backgroundColor:          '#050505',
      androidSplashResourceName:'splash',
      androidScaleType:         'CENTER_CROP',
      showSpinner:              false,
      splashFullScreen:         true,
      splashImmersive:          true,
      fadeInDuration:           200,
      fadeOutDuration:          200,
    },

    StatusBar: {
      style:           'DARK',       // White icons (dark bg status bar)
      backgroundColor: '#050505',    // Matches brand dark background
      overlaysWebView: false,        // Status bar has its own space
    },

    App: {
      // Prevent app from staying active when backgrounded for > 30 min
      backgroundTask: false,
    },
  },
}

export default config

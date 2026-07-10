/**
 * Environment variable helpers
 *
 * Vite replaces import.meta.env.VITE_* at BUILD TIME.
 * This means .env values ARE bundled into the APK/AAB —
 * this is expected and correct for a mobile app.
 *
 * For security: never put secret keys in VITE_ variables.
 * The Supabase anon key is safe to bundle (it's public).
 * The Supabase service_role key must NEVER be used client-side.
 */
export const ENV = {
  SUPABASE_URL:    import.meta.env.VITE_SUPABASE_URL     || '',
  SUPABASE_KEY:    import.meta.env.VITE_SUPABASE_ANON_KEY|| '',
  SHEETS_URL:      import.meta.env.VITE_GOOGLE_SHEETS_URL || '',
  APP_NAME:        import.meta.env.VITE_APP_NAME          || 'Royal Graphix',
  APP_URL:         import.meta.env.VITE_APP_URL           || 'https://royalgraphix.co.ke',
  IS_NATIVE:       typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.() === true,
  PLATFORM:        typeof window !== 'undefined' ? (window.Capacitor?.getPlatform?.() || 'web') : 'web',
}

export const isAndroid  = ENV.PLATFORM === 'android'
export const isIOS      = ENV.PLATFORM === 'ios'
export const isNative   = ENV.IS_NATIVE
export const isWeb      = !ENV.IS_NATIVE

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ─────────────────────────────────────────────────────────────
// Vite Config — Royal Graphix
//
// TWO BUILD MODES:
//
// 1. WEB BUILD (Vercel):
//    npm run build
//    → base: '/'   → absolute asset paths
//    → index.html gets: <script src="/assets/index-ABC.js">
//    → Browser cache busting works correctly via filename hashes
//    → Vercel serves index.html with no-cache headers (see vercel.json)
//    → Assets cached for 1 year (immutable, hash in filename)
//
// 2. ANDROID BUILD (Capacitor):
//    npm run build:android
//    → base: './'  → relative asset paths
//    → index.html gets: <script src="./assets/index-ABC.js">
//    → Required because Android WebView loads from filesystem
//    → There is no web server, so absolute paths like /assets/ fail
//
// NEVER use base './' for the Vercel build.
// NEVER use base '/'  for the Android build.
// ─────────────────────────────────────────────────────────────

export default defineConfig(({ mode }) => {
  // CAPACITOR_BUILD env var is set only by build:android script
  const isAndroid = process.env.CAPACITOR_BUILD === 'true'

  return {
    plugins: [react()],

    // base '/' for web, './' for Android
    base: isAndroid ? './' : '/',

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',

      rollupOptions: {
        output: {
          // Content-hashed filenames ensure browser fetches new file when code changes
          entryFileNames:  'assets/[name]-[hash].js',
          chunkFileNames:  'assets/[name]-[hash].js',
          assetFileNames:  'assets/[name]-[hash][extname]',

          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
          },
        },
      },
    },
  }
})

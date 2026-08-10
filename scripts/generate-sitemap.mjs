// Generates public/sitemap.xml before each build.
// Combines fixed site routes with dynamic, published portfolio + blog
// entries pulled live from Supabase. If Supabase isn't reachable at
// build time (no env vars, offline, etc.) it falls back to the static
// routes only — this script never fails the build.

import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'https://royalgraphix.co.ke'

const STATIC_ROUTES = [
  { path: '/',          changefreq: 'weekly',  priority: '1.0' },
  { path: '/services',  changefreq: 'monthly', priority: '0.9' },
  { path: '/portfolio', changefreq: 'weekly',  priority: '0.9' },
  { path: '/pricing',   changefreq: 'monthly', priority: '0.8' },
  { path: '/blog',      changefreq: 'weekly',  priority: '0.8' },
  { path: '/reviews',   changefreq: 'weekly',  priority: '0.7' },
  { path: '/careers',   changefreq: 'monthly', priority: '0.6' },
  { path: '/track',     changefreq: 'monthly', priority: '0.6' },
  { path: '/refer',     changefreq: 'monthly', priority: '0.7' },
  { path: '/contact',   changefreq: 'monthly', priority: '0.9' },
]

const SERVICE_SLUGS = [
  'web-design', 'web-development', 'web-applications', 'graphic-design',
  'social-media-management', 'seo', 'branding', 'ui-ux',
]

async function fetchDynamicUrls() {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  const urls = []

  if (!url || !key || url.includes('YOUR_') || key.includes('YOUR_')) {
    console.log('[sitemap] No live Supabase credentials at build time — using static routes only.')
    return urls
  }

  try {
    const headers = { apikey: key, Authorization: `Bearer ${key}` }
    const withTimeout = (url, opts = {}, ms = 8000) => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), ms)
      return fetch(url, { ...opts, signal: controller.signal }).finally(() => clearTimeout(timer))
    }

    const portfolioRes = await withTimeout(`${url}/rest/v1/portfolio?select=slug,created_at&status=eq.published`, { headers })
    if (portfolioRes.ok) {
      const rows = await portfolioRes.json()
      rows.forEach(r => { if (r.slug) urls.push({ path: `/portfolio/${r.slug}`, changefreq: 'monthly', priority: '0.7' }) })
    }

    const blogRes = await withTimeout(`${url}/rest/v1/blog_posts?select=slug,created_at&status=eq.published`, { headers })
    if (blogRes.ok) {
      const rows = await blogRes.json()
      rows.forEach(r => { if (r.slug) urls.push({ path: `/blog/${r.slug}`, changefreq: 'monthly', priority: '0.6' }) })
    }
  } catch (e) {
    console.warn('[sitemap] Could not fetch dynamic routes — using static routes only:', e.message)
  }

  return urls
}

async function main() {
  const dynamicUrls = await fetchDynamicUrls()
  const serviceUrls = SERVICE_SLUGS.map(slug => ({ path: `/services/${slug}`, changefreq: 'monthly', priority: '0.8' }))
  const allUrls = [...STATIC_ROUTES, ...serviceUrls, ...dynamicUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.map(u => `  <url>\n    <loc>${SITE_URL}${u.path}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`

  const outPath = join(__dirname, '..', 'public', 'sitemap.xml')
  writeFileSync(outPath, xml, 'utf-8')
  console.log(`[sitemap] Wrote ${allUrls.length} URLs to public/sitemap.xml`)
}

main()

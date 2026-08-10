/**
 * Royal Graphix — Service Worker Kill Switch
 *
 * This file exists solely to unregister any old service worker
 * that was previously installed in users' browsers.
 *
 * A previous deployment accidentally installed a service worker.
 * That SW intercepts all network requests and serves stale cached
 * content, causing users to see old versions of the site after
 * deployments.
 *
 * This kill switch works as follows:
 * 1. Old SW is running in user's browser.
 * 2. Browser fetches /sw.js to check for updates (it does this
 *    automatically every 24 hours or on page load).
 * 3. It finds this new file. It is byte-different from the old SW.
 * 4. Browser installs this new SW, which calls self.skipWaiting()
 *    to activate immediately without waiting.
 * 5. On activation, this SW calls clients.claim() to take control,
 *    then unregisters itself entirely.
 * 6. All caches created by the old SW are deleted.
 * 7. The page is reloaded to fetch fresh content from Vercel.
 * 8. No SW is running anymore. Future visits go straight to Vercel.
 *
 * DO NOT REMOVE THIS FILE.
 * If you remove it, browsers that still have the kill switch SW
 * installed will get a 404, which the browser interprets as
 * "SW unchanged" and keeps the kill switch running forever.
 * The file must stay. It is tiny (< 1KB) and costs nothing.
 */

self.addEventListener('install', () => {
  // Skip waiting — activate immediately without waiting for old tabs to close
  self.skipWaiting()
})

self.addEventListener('activate', async () => {
  // 1. Take control of all open tabs immediately
  await clients.claim()

  // 2. Delete ALL caches created by the old service worker
  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map(name => caches.delete(name)))
  console.log('[SW Kill Switch] Deleted', cacheNames.length, 'cache(s):', cacheNames)

  // 3. Unregister this service worker entirely
  const registration = await self.registration
  await registration.unregister()
  console.log('[SW Kill Switch] Service worker unregistered successfully.')

  // 4. Reload all controlled clients so they fetch fresh content from Vercel
  const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true })
  allClients.forEach(client => {
    client.navigate(client.url)
  })
})

// Intercept NO fetch requests — pass everything through to the network
// This SW does nothing except unregister itself on activation
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request))
})

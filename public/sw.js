/* Service worker do Reguamove: a app e os horários abrem sem rede.
 * - Páginas: rede primeiro; sem rede, usa a cópia guardada (ou a página inicial, que arranca a app).
 * - /assets (ficheiros com hash): cache primeiro.
 * - Restante conteúdo do próprio site: devolve a cópia guardada e atualiza em segundo plano.
 * - Pedidos a outros sítios (autocarros em direto, mapas, analytics) nunca passam por aqui.
 * __BUILD_ID__ é substituído em cada build (scripts/prerender.mjs), o que renova a cache. */
const CACHE = 'tupr-__BUILD_ID__'
const SCOPE = self.registration.scope // termina em "/"

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll([SCOPE, SCOPE + 'manifest.webmanifest', SCOPE + 'favicon.svg'])).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('tupr-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return // só o próprio site
  if (url.pathname.startsWith('/_vercel/')) return // analytics da Vercel: nunca em cache

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          event.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)))
          return res
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(SCOPE))),
    )
    return
  }

  if (url.pathname.startsWith(new URL(SCOPE).pathname + 'assets/')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone() // clonar logo: depois de a página ler a resposta já não é possível
              event.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)))
            }
            return res
          }),
      ),
    )
    return
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            event.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)))
          }
          return res
        })
        .catch(() => hit)
      return hit || net
    }),
  )
})

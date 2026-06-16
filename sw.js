/* Folio — service worker
   Estrategia:
   - Shell de la app (HTML, manifest, iconos): se precachea en la instalación.
   - Navegaciones: red primero (para recibir actualizaciones), caché si no hay conexión.
   - Estáticos de terceros (fuentes, JSZip): caché primero, se guardan al vuelo.
   - API de libros y descargas: solo red, nunca se cachean (los libros viven en IndexedDB). */

const CACHE = 'folio-v13';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './catalog-es.json?v=13', './popular.json?v=13'];
const NEVER_CACHE = ['gutendex.com', 'corsproxy.io', 'allorigins.win', 'gutenberg.org', 'openlibrary.org', 'archive.org'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // API y descargas de libros: directo a red, sin tocar caché
  if (NEVER_CACHE.some(h => url.hostname.includes(h))) return;

  // Navegaciones: red primero, caché como respaldo offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy));
          return r;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Resto (iconos, fuentes, JSZip): caché primero, red y guardado si no está
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return r;
    }))
  );
});

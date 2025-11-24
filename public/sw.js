const CACHE_NAME = 'crud-offline-v1';
const OFFLINE_FILES = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/assets/index-*.js' /* Vite cambia hashes — el service worker en prod debe generarse o ajustarse */,
  '/styles.css'
];

// Install - cache básico
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(['/','/index.html','/styles.css']))
  );
  self.skipWaiting();
});

// Activate - limpiar viejos caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null))
    ))
  );
  self.clients.claim();
});

// Fetch - estrategia cache-first para archivos estáticos, fallback a network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Solo manejar GET
  if (event.request.method !== 'GET') return;

  // Intentamos cache primero
  event.respondWith(
    caches.match(event.request).then(matched => {
      if (matched) return matched;
      return fetch(event.request).then(resp => {
        // Clonar y guardar en cache los requests navegables (opcional)
        if (event.request.destination === '' || event.request.destination === 'document') {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return resp;
      }).catch(() => {
        // fallback básico si falló
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});
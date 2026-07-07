const CACHE_NAME = 'medplan-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event
self.addEventListener('install', e => {
  console.log('[SW] Installing...');
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', e => {
  console.log('[SW] Activating...');
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - cache first, fallback to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        console.log('[SW] Serving from cache:', e.request.url);
        return response;
      }
      return fetch(e.request).then(response => {
        // Cache successful responses
        if (response && response.status === 200 && response.type !== 'error') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        console.log('[SW] Fetch failed, serving from cache');
        return caches.match('/index.html');
      });
    })
  );
});

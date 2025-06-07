const CACHE_NAME = 'text-talk-v0.1';
const urlsToCache = [
  './',
  './index.html',
  './pkg/text_talk.js',
  './pkg/text_talk_bg.wasm',
  './icon-192x192.png',
  './icon-512x512.png',
  'https://huggingface.co/dennis-isaksen/ocrs-finetuned-additional-lang/resolve/main/ocrs-detection-en-da-2025-05-13.rten?download=true',
  'https://huggingface.co/dennis-isaksen/ocrs-finetuned-additional-lang/resolve/main/ocrs-recognition-en-da-2025-05-24.rten?download=true'
];

self.addEventListener('activate', event => {
  event.waitUntil(
    // Activate the service worker and clean up old caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('install', event => {
  event.waitUntil(
    // Open the cache and add all the URLs to it
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Check if the request is for a cached resource
  if (event.request.method === 'GET' && urlsToCache.includes(new URL(event.request.url).pathname)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response; // Return cached response if available
          }
          // If not in cache, fetch from network
          const fetchRequest = event.request.clone();
          return fetch(fetchRequest).then(
            (response) => {
              // Check if we received a valid response
              if (!response || response.status !== 200 || response.status !== 0 ) {
                return response;
              }

              // Clone the response so we can cache it
              const responseToCache = response.clone();

              // Open the cache and put the cloned response in it
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );
        })
    );
  }
});
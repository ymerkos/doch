/**
 * B"H
 * eved (service worker
 * for offline working)
 */

// Service worker file (sw.js)

const CACHE_NAME = 'dynamic-cache';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll([]);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(async response => {
        // If the request was successful, clone it to the cache and return the response
        if (response.status === 200) {
          const responseToCache = response.clone();
          try {
            var op = await caches.open(CACHE_NAME)
            console.log("Caching",responseToCache, op);

                try {
                    if(
                        !responseToCache.url.startsWith("chrome-extension:") &&
                        !event.request.method.toLowerCase() == "post"
                    )
                        op.put(event.request, responseToCache);
                } catch(e) {

                }
            } catch(e) {
                console.log("Problem caching,",responseToCache,e)
            }
          return response;
        } else {
            try {
                var m = await caches.match(event.request)
                return m || fetchOfflinePage();
          // If the request failed, try to fetch from cache
            } catch(e) {

            }
            
        }
      })
      .catch((e) => {
        console.log("Problem!",e)
        // If both network and cache fail, show a fallback offline page
        return fetchOfflinePage();
      })
  );
});

function fetchOfflinePage() {
  return caches.match('/offline.html')
    .then(cachedResponse => {
      return cachedResponse || new Response('<h1>Offline</h1>', {
        headers: {'Content-Type': 'text/html'}
      });
    });
}
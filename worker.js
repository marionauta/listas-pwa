const cacheName = "listas-v1";
const appShellFiles = [
  "/icon.png",
  "/index.html",
  "/style.css",
  "/bundle.js",
];

self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(appShellFiles);
    })
  )
});

self.addEventListener("fetch", event => {
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      const networkResponse = await fetch(event.request);
      const cache = await caches.open(cacheName);
      cache.put(event.request, networkResponse.clone());
      return cachedResponse ?? networkResponse;
    })()
  );
});

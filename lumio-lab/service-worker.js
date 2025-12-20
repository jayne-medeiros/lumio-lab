const CACHE_NAME = "assis-iagro-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/main.js",
  "/manifest.json",
  // "/img/icone.png" // descomente se incluir ícone
];

// Instalação e cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Rede -> cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

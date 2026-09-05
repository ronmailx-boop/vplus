const CACHE_NAME = "vplus-v19";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./js/app.js",
  "./js/core/store.js",
  "./js/core/constants.js",
  "./js/core/utils.js",
  "./js/core/supabase-config.js",
  "./js/ui/render.js",
  "./js/ui/modals.js",
  "./js/features/item-crud.js",
  "./js/features/list-crud.js",
  "./js/features/history.js",
  "./js/features/stats.js",
  "./js/features/autocomplete.js",
  "./js/features/import.js",
  "./js/features/voice.js",
  "./js/features/organize.js",
  "./js/features/text-scale.js",
  "./js/features/share.js",
  "./js/features/collab.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

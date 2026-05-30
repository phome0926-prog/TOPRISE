// TOPRISE Sales Material PWA — Service Worker
// 資料を更新したら CACHE_VERSION を v2, v3 ... と上げてください。
// バージョンを上げると、次回オンライン起動時に古いキャッシュが破棄され、新しいファイルがキャッシュされます。

const CACHE_VERSION = "toprise-v1";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./toprise_company.html",
  "./toprise_sheet_p40.html",
  "./toprise_sheet_navvis.html",
  "./toprise_sheet_uav.html",
  "./toprise_sheet_proscan.html",
  "./toprise_field_cards.html"
];

// install: 全ファイルをプリキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// activate: 古いバージョンのキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// fetch:
// - 自分のオリジン内: cache first, network fallback, さらにフォールバックで index へ
// - 外部リソース (Google Fonts 等): stale-while-revalidate
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  if (url.origin === location.origin) {
    // local assets
    event.respondWith(
      caches.match(req).then((cached) => {
        return (
          cached ||
          fetch(req)
            .then((res) => {
              const copy = res.clone();
              caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
              return res;
            })
            .catch(() => caches.match("./index.html"))
        );
      })
    );
  } else {
    // external (fonts.googleapis, fonts.gstatic): stale-while-revalidate
    event.respondWith(
      caches.open(CACHE_VERSION).then((cache) =>
        cache.match(req).then((cached) => {
          const fetched = fetch(req)
            .then((res) => {
              if (res && res.status === 200) cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || fetched;
        })
      )
    );
  }
});

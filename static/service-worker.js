const CACHE_NAME = "flask-pwa-demo-v1";

// App shell 是最先要保住的核心資源。
// 這些檔案快取成功後，PWA 至少還能顯示基本畫面與離線頁。
const APP_SHELL = [
  "/",
  "/offline",
  "/static/css/app.css",
  "/static/js/app.js",
  "/static/manifest.json",
  "/static/icons/icon-192.svg",
  "/static/icons/icon-512.svg"
];

self.addEventListener("install", (event) => {
  // 安裝階段先把必要靜態資源放進快取。
  // 這樣後續即使離線，也還有機會回應首頁與基本 UI。
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );

  // 讓新的 service worker 安裝完成後立即進入 waiting -> active 流程。
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // 啟用階段清掉舊版快取，避免使用到過期資源。
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  // 讓目前已開啟的頁面也能立即受這個 service worker 控制。
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // 只處理 GET，避免攔截表單送出或其他非讀取型請求。
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 網路成功時，回傳最新內容，並順手更新快取。
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(async () => {
        // 網路失敗時，優先找同一個請求的快取版本。
        const cached = await caches.match(event.request);

        // 若沒有對應快取，最後退回離線頁。
        return cached || caches.match("/offline");
      })
  );
});

const CACHE_NAME = "flask-pwa-demo-v2";

// 這個快取名稱用來區分目前的 service worker 版本。
// 內容有變動時，通常會一起升版，讓舊快取能在 activate 階段被清掉。

// App shell 指的是這個 PWA 最基本一定要能顯示的檔案。
// 這些資源先被快取後，即使網路中斷，至少還能顯示首頁骨架與離線頁。
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
  // install 階段先把最重要的靜態資源放進快取。
  // 這一步成功後，後續離線時才有東西可以回傳。
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );

  // 新版安裝完成後，直接進入 waiting -> active 流程。
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // activate 階段負責清理舊版本快取，避免讀到過期資源。
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  // 讓目前已開啟的頁面也立即受這個 service worker 控制。
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // 只處理 GET 請求，避免干擾表單送出或其他寫入型操作。
  if (event.request.method !== "GET") {
    return;
  }

  // 導航型請求代表使用者正在打開或重新整理某個頁面。
  // 如果這時沒有網路，就回退到 /offline，讓使用者至少看到備援頁。
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        // 若這個頁面本身有快取，就優先回傳該頁面的快取版本。
        const cachedPage = await caches.match(event.request);
        return cachedPage || caches.match("/offline");
      })
    );
    return;
  }

  // 靜態資源採用 cache-first。
  // 先找快取，沒有再走網路；成功抓到後順手寫回快取。
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          // response 只能讀一次，所以先 clone 一份給快取。
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        // 這裡如果連靜態資源都抓不到，就最後退回離線頁。
        .catch(() => caches.match("/offline"));
    })
  );
});

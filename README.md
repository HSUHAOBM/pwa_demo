# Flask PWA Demo

最小 Flask PWA 範例。

目的在於驗證既有 Web 專案能否在不重寫後端的前提下，具備可安裝、可離線、可互動的 App 型態。

## PWA 定義

PWA 全名為 Progressive Web App。

本質仍為網站，但透過瀏覽器提供的能力，使網站具備部分接近 App 的使用體驗，例如：

- 可加入桌面或主畫面
- 可使用獨立視窗啟動
- 可透過 Service Worker 進行快取
- 可提供基本離線體驗

對 Flask 專案而言，PWA 的重點通常不在後端改寫，而在於補齊前端安裝與快取能力。

## 與一般 App 的差異

| 項目 | PWA | 一般 App |
| --- | --- | --- |
| 技術基礎 | 建立於 Web 技術之上 | 通常為 Android 或 iOS 原生應用 |
| 發布方式 | 多半不需經過 App Store 或 Play Store 審核 | 通常需要上架流程 |
| 開發方式 | 可直接沿用現有網站與後端 | 往往需要另做行動端前端 |
| 維護成本 | 通常較低 | 通常較高 |
| 裝置能力 | 可使用部分瀏覽器提供能力 | 可取得較完整的原生能力 |

## PWA 核心檔案

- `manifest.json`：定義 PWA 的安裝資訊
- `service-worker.js`：負責快取、離線 fallback、資源攔截

### `manifest.json` 參數說明

| 參數 | 用途 |
| --- | --- |
| `name` | App 完整名稱，安裝畫面或系統介面可能會顯示 |
| `short_name` | 短名稱，空間不足時使用，例如桌面圖示下方名稱 |
| `description` | App 描述文字 |
| `start_url` | 使用者從主畫面啟動時，預設進入的網址 |
| `scope` | 這個 PWA 可控制的網址範圍，超出範圍的頁面通常不算在同一個 PWA 內 |
| `display` | 啟動顯示模式，例如 `standalone` 會看起來比較像 App |
| `background_color` | 啟動畫面或載入過程可能使用的背景色 |
| `theme_color` | 瀏覽器 UI 或系統介面可能使用的主題色 |
| `orientation` | 偏好的畫面方向，例如直向 |
| `icons` | 安裝時使用的圖示清單 |
| `icons[].src` | 圖示檔案路徑 |
| `icons[].sizes` | 圖示尺寸 |
| `icons[].type` | 圖示檔案格式 |
| `icons[].purpose` | 圖示用途，例如一般顯示或遮罩用途 |

### `service-worker.js` 說明

- `install`：安裝 service worker 時預先快取必要資源
- `activate`：啟用新版本並清理舊快取
- `fetch`：攔截請求，決定要走網路、快取或離線 fallback

### 註解方式補充

- `service-worker.js` 可直接加 JavaScript 註解
- `manifest.json` 是 JSON，不能直接加入註解，否則會變成無效格式

## 專案驗證內容

目前包含：

- Flask 頁面
- 一個最小 API：`/api/ping`
- `manifest.json`
- `service-worker.js`
- 離線備援頁：`/offline`

## 目前已驗證能力

- 網站可安裝至桌面，並以近似 App 的方式啟動
- 前端可呼叫 Flask API
- Service Worker 可處理靜態資源快取
- 離線時可提供 fallback 頁面

## 專案重點檔案

- `app.py`: Flask 路由與 API
- `templates/index.html`: 首頁與互動測試頁
- `templates/offline.html`: 離線頁
- `static/manifest.json`: PWA 安裝設定
- `static/service-worker.js`: 快取與離線處理

## 專案定位

專案屬於概念驗證樣板。

用途為確認 Flask 專案在維持既有 Web 架構的情況下，是否能先具備 PWA 的基本能力，作為後續產品化或部署評估的基礎。

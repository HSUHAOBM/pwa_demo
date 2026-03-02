let deferredPrompt = null;
const installBtn = document.getElementById("installBtn");
const pingBtn = document.getElementById("pingBtn");
const pingResult = document.getElementById("pingResult");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.hidden = false;
});

installBtn?.addEventListener("click", async () => {
  if (!deferredPrompt) {
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

pingBtn?.addEventListener("click", async () => {
  pingResult.textContent = "載入中...";

  try {
    const response = await fetch("/api/ping");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    pingResult.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    pingResult.textContent = `呼叫失敗: ${error.message}`;
  }
});

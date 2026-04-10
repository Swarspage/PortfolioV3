import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const SW_CLEANUP_KEY = "portfolio-v3-sw-cleanup";

async function cleanupStaleServiceWorkers() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  const cacheKeys = "caches" in window ? await caches.keys() : [];

  await Promise.all(registrations.map((registration) => registration.unregister()));
  await Promise.all(cacheKeys.map((key) => caches.delete(key)));

  if (
    (registrations.length > 0 || cacheKeys.length > 0) &&
    !sessionStorage.getItem(SW_CLEANUP_KEY)
  ) {
    sessionStorage.setItem(SW_CLEANUP_KEY, "done");
    window.location.reload();
    throw new Error("Reloading after clearing stale service workers.");
  }
}

async function bootstrap() {
  await cleanupStaleServiceWorkers();

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap().catch((error) => {
  if (error.message !== "Reloading after clearing stale service workers.") {
    console.error(error);
  }
});

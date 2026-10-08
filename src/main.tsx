import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

try {
    const root = document.getElementById("root");
    if (!root) throw new Error("Root element not found");
    createRoot(root).render(<App />);
} catch (e) {
    console.error("[DEBUG] Mount failed:", e);
    document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Mount Failed</h1><pre>${e}</pre></div>`;
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        if (window.location.pathname.startsWith("/navaratri")) {
            navigator.serviceWorker.register("/navaratri-sw.js", { scope: "/navaratri" }).catch((error) => {
                console.warn("[Navaratri PWA] Service worker registration failed:", error);
            });
        }
    });
}

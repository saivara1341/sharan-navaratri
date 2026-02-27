import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

console.log("[DEBUG] Mounting React application...");
try {
    const root = document.getElementById("root");
    if (!root) throw new Error("Root element not found");
    createRoot(root).render(<App />);
    console.log("[DEBUG] Mount successful.");
} catch (e) {
    console.error("[DEBUG] Mount failed:", e);
    document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Mount Failed</h1><pre>${e}</pre></div>`;
}

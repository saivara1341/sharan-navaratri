import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy Supabase API calls via Node.js to bypass ISP-level DNS/TLS interception.
      // The browser calls /supabase-api/* which Vite rewrites and forwards server-side.
      "/supabase-api": {
        // Use the real Supabase IP directly to bypass ISP DNS poisoning.
        // IP found via Google DNS: 172.64.149.246
        target: "https://172.64.149.246",
        changeOrigin: true,
        secure: false, // Required when using IP directly or encountering ISP interception
        headers: {
          host: "xgrdubcpomwzbuaqtjad.supabase.co",
        },
        rewrite: (path) => path.replace(/^\/supabase-api/, ""),
      },
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

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
        target: "https://172.64.149.246",
        changeOrigin: true,
        secure: false, // Required when using IP directly to bypass DNS blocks
        headers: {
          host: "xgrdubcpomwzbuaqtjad.supabase.co",
          origin: "https://xgrdubcpomwzbuaqtjad.supabase.co",
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

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  server: {
    host: true, // Listen on all interfaces
    port: 5173,
    strictPort: true,
    proxy: {
      // The browser calls /supabase-api/* which Vite rewrites and forwards server-side.
      "/supabase-api": {
        target: "https://172.64.149.246",
        changeOrigin: true,
        secure: false, // Required for IP-based targets
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

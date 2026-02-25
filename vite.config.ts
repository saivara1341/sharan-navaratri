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
        target: "https://xgrdubcpomwzbuaqtjad.supabase.co",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/supabase-api/, ""),
        headers: {
          "x-forwarded-host": "xgrdubcpomwzbuaqtjad.supabase.co",
        }
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

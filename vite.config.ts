import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: true, // Listen on all interfaces
    port: 5173,
    strictPort: true,
    proxy: {
      // The browser calls /supabase-api/* which Vite rewrites and forwards server-side.
      '/supabase-api': {
        target: 'https://172.64.149.246', // Direct Cloudflare IP for Supabase ISP Bypass
        changeOrigin: true,
        secure: false, // Bypass cert mismatch for direct IP
        rewrite: (path) => path.replace(/^\/supabase-api/, ''),
        followRedirects: true, // Crucial for Supabase Auth flows
        headers: {
          'Host': 'xgrdubcpomwzbuaqtjad.supabase.co',
          'Origin': 'https://xgrdubcpomwzbuaqtjad.supabase.co',
          'Referer': 'https://xgrdubcpomwzbuaqtjad.supabase.co/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      },
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
      }
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

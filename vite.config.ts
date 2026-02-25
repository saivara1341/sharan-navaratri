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
        secure: false,
        headers: {
          host: "xgrdubcpomwzbuaqtjad.supabase.co",
        },
        rewrite: (path) => path.replace(/^\/supabase-api/, ""),
        // Log errors to the Vite terminal for troubleshooting
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('SUPABASE PROXY ERROR:', err);
          });
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

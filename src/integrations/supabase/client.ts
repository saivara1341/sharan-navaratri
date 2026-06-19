import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Core credentials with production-safe fallbacks
const FALLBACK_URL = "https://xgrdubcpomwzbuaqtjad.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncmR1YmNwb213emJ1YXF0amFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NjY3MzksImV4cCI6MjA4NTQ0MjczOX0.O52EhG_2iOjl4Ba2yknPcnqswAk8GIVrAQceEe0ImzI".trim();

const isDev = import.meta.env.DEV;

// ISP Bypass logic: Use local proxy only in dev mode.
// The "Failed to fetch" error usually means the backend proxy (port 9090) isn't running.
const EFFECTIVE_URL = isDev
    ? (typeof window !== 'undefined' ? window.location.origin + "/supabase-api" : "http://localhost:5173/supabase-api")
    : FALLBACK_URL;

const FINAL_KEY = isDev ? (import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY) : FALLBACK_KEY;

if (isDev) {
    console.log(`[Supabase] Active Mode: ${import.meta.env.MODE}`);
    console.log(`[Supabase] Native ISP Bypass: Active (Vite Direct-IP Proxy)`);
    console.log(`[Supabase] Target: https://172.64.149.246`);
}

export const supabase = createClient<Database>(EFFECTIVE_URL, FINAL_KEY, {
  auth: {
    lock: {
      acquire: async () => ({
        release: async () => {},
      }),
    },
  },
});
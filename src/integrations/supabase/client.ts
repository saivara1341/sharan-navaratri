import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Core credentials with production-safe fallbacks
const FALLBACK_URL = "https://xgrdubcpomwzbuaqtjad.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncmR1YmNwb213emJ1YXF0amFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NjY3MzksImV4cCI6MjA4NTQ0MjczOX0.O52EhG_2iOjl4Ba2yknPcnqswAk8GIVrAQceEe0ImzI";

// Helper to get valid env var or fallback
const getValidEnv = (name: string, fallback: string) => {
    const val = import.meta.env[name];
    if (!val || val === "undefined" || val === "null" || val.trim() === "") return fallback;
    return val.trim();
};

const SUPABASE_URL = getValidEnv("VITE_SUPABASE_URL", FALLBACK_URL);
const SUPABASE_ANON_KEY = getValidEnv("VITE_SUPABASE_ANON_KEY", FALLBACK_KEY);

// ISP Bypass logic: Use local proxy only in dev mode.
// In production, we call Supabase directly since a local proxy isn't reachable.
const EFFECTIVE_URL = import.meta.env.DEV
    ? (typeof window !== 'undefined' ? window.location.origin + "/supabase-api" : "http://localhost:5173/supabase-api")
    : SUPABASE_URL;

console.log(`[Supabase] Mode: ${import.meta.env.MODE} | Target: ${EFFECTIVE_URL.substring(0, 30)}...`);
if (SUPABASE_ANON_KEY === FALLBACK_KEY) {
    console.warn("[Supabase] Using hardcoded fallback key. Check GitHub secrets if this is production.");
}

export const supabase = createClient<Database>(EFFECTIVE_URL, SUPABASE_ANON_KEY);
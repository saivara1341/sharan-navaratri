import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Pull credentials from .env
// Pull credentials from .env with hardcoded fallbacks for safe deployment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xgrdubcpomwzbuaqtjad.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncmR1YmNwb213emJ1YXF0amFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NjY3MzksImV4cCI6MjA4NTQ0MjczOX0.O52EhG_2iOjl4Ba2yknPcnqswAk8GIVrAQceEe0ImzI";

// ISP Bypass: In development, route through the local Vite proxy.
const EFFECTIVE_URL = import.meta.env.DEV
    ? (typeof window !== 'undefined' ? window.location.origin + "/supabase-api" : "http://localhost:5173/supabase-api")
    : SUPABASE_URL;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[CRITICAL] Missing Supabase credentials in environment variables.");
} else {
    console.log("[DEBUG] Supabase initialized with URL:", SUPABASE_URL);
    console.log("[DEBUG] Supabase Key Preview:", SUPABASE_ANON_KEY.substring(0, 10) + "...");
    console.log("[DEBUG] Effective API URL:", EFFECTIVE_URL);
}

export const supabase = createClient<Database>(EFFECTIVE_URL, SUPABASE_ANON_KEY);
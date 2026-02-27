import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Core credentials with production-safe fallbacks
const FALLBACK_URL = "https://xgrdubcpomwzbuaqtjad.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncmR1YmNwb213emJ1YXF0amFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NjY3MzksImV4cCI6MjA4NTQ0MjczOX0.O52EhG_2iOjl4Ba2yknPcnqswAk8GIVrAQceEe0ImzI";

// Use literal access for Vite static replacement to work reliably
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SUPABASE_URL = (envUrl && envUrl !== "undefined" && envUrl !== "null" && envUrl.trim() !== "")
    ? envUrl.trim()
    : FALLBACK_URL;

const SUPABASE_ANON_KEY = (envKey && envKey !== "undefined" && envKey !== "null" && envKey.trim() !== "")
    ? envKey.trim()
    : FALLBACK_KEY;

// ISP Bypass logic: Use local proxy only in dev mode.
const EFFECTIVE_URL = import.meta.env.DEV
    ? (typeof window !== 'undefined' ? window.location.origin + "/supabase-api" : "http://localhost:5173/supabase-api")
    : SUPABASE_URL;

console.log(`[Supabase] Env: ${import.meta.env.MODE} | Target: ${EFFECTIVE_URL.substring(0, 30)}...`);

export const supabase = createClient<Database>(EFFECTIVE_URL, SUPABASE_ANON_KEY);
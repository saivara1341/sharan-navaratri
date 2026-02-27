import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Pull credentials from .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ISP Bypass: In development, route through the local Vite proxy.
const EFFECTIVE_URL = import.meta.env.DEV
    ? (typeof window !== 'undefined' ? window.location.origin + "/supabase-api" : "http://localhost:5173/supabase-api")
    : SUPABASE_URL;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[CRITICAL] Missing Supabase credentials in environment variables.");
}

export const supabase = createClient<Database>(EFFECTIVE_URL, SUPABASE_ANON_KEY);
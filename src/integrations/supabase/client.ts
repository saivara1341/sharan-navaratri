import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Core credentials with production-safe fallbacks
const FALLBACK_URL = "https://xoqpxckowwubeqdtazks.supabase.co";
const FALLBACK_KEY = "sb_publishable_Db5k1uOh50NIY-GPvMm0HQ_OMnOz8D7".trim();

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
    lock: async (name, acquireTimeout, fn) => await fn(),
  },
});
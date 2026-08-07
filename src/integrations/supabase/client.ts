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
    : (import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL);

const FINAL_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_KEY).trim();

if (isDev) {
    console.log(`[Supabase] Active Mode: ${import.meta.env.MODE}`);
    console.log(`[Supabase] Native ISP Bypass: Active (Vite Direct-IP Proxy)`);
    console.log(`[Supabase] Target: https://172.64.149.246`);
}

// Clean up legacy tokens from old Supabase project if present in browser storage
if (typeof window !== 'undefined') {
    try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.includes('xgrdubcpomwzbuaqtjad')) {
                localStorage.removeItem(key);
            }
        }
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const key = sessionStorage.key(i);
            if (key && key.includes('xgrdubcpomwzbuaqtjad')) {
                sessionStorage.removeItem(key);
            }
        }
    } catch (e) {
        // Ignore storage access errors
    }
}

export const supabase = createClient<Database>(EFFECTIVE_URL, FINAL_KEY, {
  auth: {
    storageKey: 'sb-xoqpxckowwubeqdtazks-auth-token',
    lock: async (name, acquireTimeout, fn) => await fn(),
  },
});
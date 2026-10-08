// Supabase Client Initialization
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Read from Vite environment variables (Vercel requires the VITE_ prefix for client-side access)
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_PUBLIC_SUPABASE_URL ||
  "https://oiazysnimrdkwcubzzxd.supabase.co";

const FALLBACK_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_YoHYip3yxPVl1pCEEhf4sQ_weeTu0J4";

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  FALLBACK_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_PUBLISHABLE_KEY && typeof window !== "undefined") {
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_ANON_KEY. Please configure VITE_SUPABASE_ANON_KEY in Vercel (Project Settings > Environment Variables) with your anon public key from Supabase Dashboard > Project Settings > API."
  );
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Read Vite environment variables (Vite injects import.meta.env at build/time)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase env variables not set. Check .env (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)."
  );
}

// Small dev-only info (avoid logging full keys in case of accident)
if (import.meta.env.DEV) {
  // Only log presence/prefix in dev
  // eslint-disable-next-line no-console
  console.log("VITE_SUPABASE_URL set:", !!supabaseUrl);
  // eslint-disable-next-line no-console
  console.log(
    "VITE_SUPABASE_ANON_KEY present (prefix):",
    supabaseAnonKey ? supabaseAnonKey.slice(0, 10) : "no key"
  );
  // attach short debug object in dev only
  // eslint-disable-next-line no-undef
  window.__SUPABASE_DEV = {
    url: supabaseUrl ?? null,
    anonPrefix: supabaseAnonKey ? supabaseAnonKey.slice(0, 10) : null,
  };
}

// export client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase variables not set. Check .env");
}

// DEBUG: expose small portion for quick dev inspection (safe-ish: only first 10 chars)
console.log("VITE_SUPABASE_URL:", !!supabaseUrl);
console.log(
  "VITE_SUPABASE_ANON_KEY (prefix):",
  supabaseAnonKey ? supabaseAnonKey.slice(0, 10) : "no key"
);

// Optional: make accessible from DevTools for temporary debugging
window.__SUPABASE_DEV = {
  url: supabaseUrl ?? null,
  anonPrefix: supabaseAnonKey ? supabaseAnonKey.slice(0, 10) : null,
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

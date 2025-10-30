// src/supabaseClient.js (amélioré pour debug)
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // fail fast in dev so you ne pas envoyer des requêtes vides
  console.error(
    "Supabase env variables not set. Check .env (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)."
  );
}

// DEBUG: expose small portion for quick dev inspection
console.log("VITE_SUPABASE_URL set:", !!supabaseUrl);
console.log(
  "VITE_SUPABASE_ANON_KEY present (prefix):",
  supabaseAnonKey ? supabaseAnonKey.slice(0, 10) : "no key"
);

window.__SUPABASE_DEV = {
  url: supabaseUrl ?? null,
  anonPrefix: supabaseAnonKey ? supabaseAnonKey.slice(0, 10) : null,
};

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

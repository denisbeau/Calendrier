// src/components/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn("Auth initialization timeout - proceeding without auth");
      setInitializing(false);
    }, 3000); // 3 second timeout

    // get initial session (if any)
    const session = supabase.auth.getSession();
    // supabase.getSession returns a promise in v2, handle it:
    session
      .then(({ data, error }) => {
        if (error) {
          console.error("Auth session error:", error);
        }
        setUser(data?.session?.user ?? null);
        setInitializing(false);
        clearTimeout(timeout);
      })
      .catch((err) => {
        console.error("Auth initialization error:", err);
        setInitializing(false);
        clearTimeout(timeout);
      });

    // subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => {
      clearTimeout(timeout);
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, initializing, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

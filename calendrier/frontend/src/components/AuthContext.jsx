// src/components/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null); // <-- used to show a big red error screen

  useEffect(() => {
    try {
      const session = supabase.auth.getSession();

      // supabase.getSession returns a promise in v2, handle it:
      session.then(({ data }) => {
        setUser(data?.session?.user ?? null);
        setInitializing(false);
      });

      // subscribe to auth changes
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => setUser(session?.user ?? null)
      );

      return () => {
        // best-effort unsubscribe (safe optional chaining)
        listener?.subscription?.unsubscribe?.();
      };
    } catch (err) {
      // capture the error and show a very visible red error page
      console.error("AuthContext init error:", err);
      setError(err.message || String(err));
      setInitializing(false);
    }
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // If there is an initialization/runtime error, render a very visible red error screen
  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        // Force full-viewport coverage with inline styles so it's reliable even without Tailwind compiled
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2147483647,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#660000',
          color: 'white',
        }}
      >
        <div style={{ maxWidth: 960, width: '100%', textAlign: 'center' }}>
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 9999,
              margin: '0 auto',
              background: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 84,
              fontWeight: 900,
              color: '#ffdddd',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
            }}
            aria-hidden
          >
            ✕
          </div>

          <h1 style={{ marginTop: 24, fontSize: 28, fontWeight: 800 }}>Authentication initialization failed</h1>
          <p style={{ marginTop: 8, fontSize: 14, opacity: 0.95 }}>A critical error occurred while initializing authentication.</p>

          <div style={{ marginTop: 20, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
            <strong style={{ display: 'block', textAlign: 'left', marginBottom: 8 }}>Error message (visible to help debugging):</strong>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                textAlign: 'left',
                background: 'rgba(0,0,0,0.25)',
                padding: '12px',
                borderRadius: 6,
                fontSize: 13,
                overflowX: 'auto'
              }}
            >
              {error}
            </pre>
          </div>

          <p style={{ marginTop: 12, fontSize: 12, opacity: 0.85 }}>Hint: check for typos in <code>src/components/AuthContext.jsx</code> — a common mistake is a misspelled <code>getSession</code> or <code>setInitializing</code>.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, initializing, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
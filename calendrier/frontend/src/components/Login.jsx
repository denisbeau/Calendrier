/* global process */
// src/components/Login.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

// safe helper (if not already imported from a shared helper)
function getViteEnv(name, defaultValue = undefined) {
  try {
    // try reading import.meta if available (vite)
    // eslint: using eval here is intentional to avoid static bundler transform
    // and access import.meta safely in different environments.
    const meta = eval(
      'typeof import !== "undefined" ? import.meta : undefined'
    );
    const val = meta?.env?.[name];

    // fallback to process.env only when process exists
    const procEnv =
      typeof process !== "undefined" && process && process.env
        ? process.env[name]
        : undefined;

    return val ?? procEnv ?? defaultValue;
  } catch {
    const procEnv =
      typeof process !== "undefined" && process && process.env
        ? process.env[name]
        : undefined;
    return procEnv ?? defaultValue;
  }
}

const devDefault =
  typeof process !== "undefined" &&
  process &&
  process.env?.NODE_ENV === "development"
    ? "true"
    : "false";

const DEV =
  getViteEnv("DEV", devDefault) === true ||
  getViteEnv("DEV", devDefault) === "true";

const DEV_TEST_EMAIL = DEV
  ? getViteEnv("VITE_TEST_EMAIL", "test@example.com")
  : "";
const DEV_TEST_PASSWORD = DEV
  ? getViteEnv("VITE_TEST_PASSWORD", "password123")
  : "";

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState(() => DEV_TEST_EMAIL);
  const [password, setPassword] = useState(() => DEV_TEST_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true);

    try {
      if (password) {
        await supabase.auth
          .signInWithPassword({ email, password })
          .then(({ error: signInError }) => {
            if (signInError) {
              // Friendly message for common 400 credential errors
              if (signInError?.status === 400) {
                setError("Invalid email or password.");
              } else {
                setError(signInError?.message ?? "Failed to sign in.");
              }
              // only log full details in dev
              if (import.meta.env?.DEV) {
                console.debug("signInWithPassword error:", signInError);
              }
              return;
            }

            // success path
            setInfo("Logged in.");
            // onLoggedIn may expect data from supabase; fetch current session instead
            onLoggedIn?.();
          })
          .catch((err) => {
            // network or unexpected error — show generic message
            setError("An unexpected error occurred. Please try again.");
            if (import.meta.env?.DEV) {
              console.debug("signInWithPassword unexpected error:", err);
            }
          });
      } else {
        // magic link flow
        await supabase.auth
          .signInWithOtp({ email })
          .then(({ error: linkError }) => {
            if (linkError) {
              setError(linkError?.message ?? "Failed to send magic link.");
              if (import.meta.env?.DEV) {
                console.debug("signInWithOtp error:", linkError);
              }
              return;
            }
            setInfo("Magic link sent to your email.");
          })
          .catch((err) => {
            setError("An unexpected error occurred. Please try again.");
            if (import.meta.env?.DEV) {
              console.debug("signInWithOtp unexpected error:", err);
            }
          });
      }
    } finally {
      setLoading(false);
    }
  }

  function fillTestCreds() {
    // Only allow this in development mode (safety)
    if (!import.meta.env?.DEV) return;
    setEmail(DEV_TEST_EMAIL);
    setPassword(DEV_TEST_PASSWORD);
    setError(null);
    setInfo("Filled test credentials.");
  }

  return (
    <div>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '24px',
        color: 'var(--text-primary)'
      }}>
        Log in
      </h2>

      {/* Error message */}
      {error && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--error)',
            borderRadius: '8px',
            color: 'var(--error)',
            fontSize: '14px',
            fontWeight: '500'
          }}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {info && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid var(--success)',
          borderRadius: '8px',
          color: 'var(--success)',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {info}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} noValidate>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            marginBottom: '8px'
          }}>
            Email
          </label>
          <input
            type="email"
            className="simple-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            marginBottom: '8px'
          }}>
            Password
          </label>
          <input
            type="password"
            className="simple-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="Leave blank for magic link"
          />
          <p style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            marginTop: '6px'
          }}>
            Leave blank to receive a magic link via email
          </p>
        </div>

        <div>
          <button type="submit" className="simple-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}

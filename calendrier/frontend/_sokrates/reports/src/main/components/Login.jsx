// src/components/Login.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

// Prefill test credentials only in development.
// You can set VITE_TEST_EMAIL and VITE_TEST_PASSWORD in .env for your own values.
const DEV_TEST_EMAIL = import.meta.env.DEV
  ? import.meta.env.VITE_TEST_EMAIL ?? "test@example.com"
  : "";
const DEV_TEST_PASSWORD = import.meta.env.DEV
  ? import.meta.env.VITE_TEST_PASSWORD ?? "password123"
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

    // Use then/catch and never re-throw to avoid unhandled rejections
    try {
      if (password) {
        await supabase.auth
          .signInWithPassword({ email, password })
          .then(({ data, error: signInError }) => {
            if (signInError) {
              // Friendly message for common 400 credential errors
              if (signInError?.status === 400) {
                setError("Invalid email or password.");
              } else {
                setError(signInError?.message ?? "Failed to sign in.");
              }
              // only log full details in dev
              if (import.meta.env.DEV) {
                // eslint-disable-next-line no-console
                console.debug("signInWithPassword error:", signInError);
              }
              return;
            }

            // success path
            setInfo("Logged in.");
            onLoggedIn?.(data);
          })
          .catch((err) => {
            // network or unexpected error — show generic message
            setError("An unexpected error occurred. Please try again.");
            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
              console.debug("signInWithPassword unexpected error:", err);
            }
            // do not re-throw
          });
      } else {
        // magic link flow
        await supabase.auth
          .signInWithOtp({ email })
          .then(({ data, error: linkError }) => {
            if (linkError) {
              setError(linkError?.message ?? "Failed to send magic link.");
              if (import.meta.env.DEV) {
                // eslint-disable-next-line no-console
                console.debug("signInWithOtp error:", linkError);
              }
              return;
            }
            setInfo("Magic link sent to your email.");
          })
          .catch((err) => {
            setError("An unexpected error occurred. Please try again.");
            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
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
    if (!import.meta.env.DEV) return;
    setEmail(DEV_TEST_EMAIL);
    setPassword(DEV_TEST_PASSWORD);
    setError(null);
    setInfo("Filled test credentials.");
  }

  return (
    <div className="simple-card max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Log in</h2>

      {/* bigger red error text, accessible */}
      {error && (
        <div
          className="mb-3 text-red-500 text-lg font-semibold"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {info && <div className="mb-3 text-green-300">{info}</div>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
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
          <label className="block text-sm text-gray-300 mb-1">
            Password (leave blank to send magic link)
          </label>
          <input
            type="password"
            className="simple-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="simple-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Visible only in dev to avoid leaking test helpers in production */}
          {import.meta.env.DEV && (
            <button
              type="button"
              className="simple-button"
              onClick={fillTestCreds}
              disabled={loading}
            >
              Use test credentials
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

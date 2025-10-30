// src/components/SignUp.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVISIBLE_REGEX = /[\u200B\u200C\u200D\uFEFF\u00A0]/g;

function sanitizeEmail(raw) {
  if (!raw) return "";
  let s = String(raw).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  // enlever caractères invisibles unicode
  s = s.replace(INVISIBLE_REGEX, "");
  // supprimer **tous** les blancs (espaces, newlines, tab)
  s = s.replace(/\s+/g, "");
  return s;
}

// Prefill test values only in development. You can override via .env:
// VITE_TEST_FULLNAME, VITE_TEST_EMAIL, VITE_TEST_PASSWORD
const DEV_TEST_FULLNAME = import.meta.env.DEV
  ? import.meta.env.VITE_TEST_FULLNAME ?? "Test User"
  : "";
const DEV_TEST_EMAIL = import.meta.env.DEV
  ? import.meta.env.VITE_TEST_EMAIL ?? "test@example.com"
  : "";
const DEV_TEST_PASSWORD = import.meta.env.DEV
  ? import.meta.env.VITE_TEST_PASSWORD ?? "password123"
  : "";

export default function SignUp({ onSignedUp }) {
  const [fullName, setFullName] = useState(() => DEV_TEST_FULLNAME);
  const [email, setEmail] = useState(() => DEV_TEST_EMAIL);
  const [password, setPassword] = useState(() => DEV_TEST_PASSWORD);
  const [confirm, setConfirm] = useState(() => DEV_TEST_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validate full name
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    const normalizedEmail = sanitizeEmail(email);
    console.log("raw email (json):", JSON.stringify(email));
    console.log("normalized email (json):", JSON.stringify(normalizedEmail));
    if (!normalizedEmail) {
      setError("Please provide an email.");
      return;
    }
    if (!EMAIL_RE.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      console.log("signUp result:", { data, signError });

      setMessage(
        "Sign-up succeeded. Check your email for a confirmation link (if required)."
      );
      onSignedUp?.(data);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("SignUp unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }

  function fillTestValues() {
    if (!import.meta.env.DEV) return;
    setFullName(DEV_TEST_FULLNAME);
    setEmail(DEV_TEST_EMAIL);
    setPassword(DEV_TEST_PASSWORD);
    setConfirm(DEV_TEST_PASSWORD);
    setError(null);
    setMessage("Filled test signup values.");
  }

  return (
    <div className="simple-card max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Sign up</h2>

      {error && (
        <div className="mb-3 text-red-500 text-lg font-semibold" role="alert">
          {error}
        </div>
      )}
      {message && <div className="mb-3 text-green-300">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            className="simple-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            placeholder="Your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Email *</label>
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
          <label className="block text-sm text-gray-300 mb-1">Password *</label>
          <input
            type="password"
            className="simple-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="At least 6 characters"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Confirm Password *
          </label>
          <input
            type="password"
            className="simple-input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="simple-button" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>

          {import.meta.env.DEV && (
            <button
              type="button"
              className="simple-button"
              onClick={fillTestValues}
              disabled={loading}
            >
              Fill test values
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

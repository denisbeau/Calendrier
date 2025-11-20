// src/components/SignUp.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // adjust path if needed

export default function SignUp({ onSignedUp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      // Supabase signUp sends confirmation email if configured
      const { data, error } = await supabase.auth.signUp(
        {
          email: email.trim(),
          password,
        },
        {
          data: { full_name: name.trim() || null },
        }
      );

      if (error) {
        // show friendly message
        setErrorMsg(error.message || "Signup failed. Try again.");
      } else {
        // show a clear message for tests to match
        setSuccessMsg(
          "Sign-up succeeded — check your email for a confirmation link."
        );
        // don't call onSignedUp here; allow user to confirm email first.
        // Optionally offer a "Back to login" button that calls onSignedUp()
      }
    } catch (err) {
      console.error("signup error:", err);
      setErrorMsg("Unexpected error. See console.");
    } finally {
      setLoading(false);
      // keep fields (or clear if you prefer)
    }
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="text-sm text-red-300 bg-red-900/10 p-2 rounded">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="text-sm text-green-300 bg-green-900/10 p-2 rounded">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="simple-input"
        />
        <input
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="simple-input"
        />
        <input
          placeholder="At least 6 characters"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="simple-input"
        />

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="simple-button">
            {loading ? "Signing up..." : "Sign up"}
          </button>

          {/* allow user to go back to login view */}
          <button
            type="button"
            onClick={() => typeof onSignedUp === "function" && onSignedUp()}
            className="simple-button bg-gray-600 hover:bg-gray-700"
          >
            Back to login
          </button>
        </div>
      </form>
    </div>
  );
}

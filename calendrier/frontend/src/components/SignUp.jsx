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
    <div>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '24px',
        color: 'var(--text-primary)'
      }}>
        Create Account
      </h2>

      {errorMsg && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--error)',
          borderRadius: '8px',
          color: 'var(--error)',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
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
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            marginBottom: '8px'
          }}>
            Full Name
          </label>
          <input
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="simple-input"
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
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="simple-input"
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
            placeholder="At least 6 characters"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="simple-input"
            required
          />
          <p style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            marginTop: '6px'
          }}>
            Must be at least 6 characters long
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <button type="submit" disabled={loading} className="simple-button">
            {loading ? "Creating account..." : "Sign up"}
          </button>

          {/* allow user to go back to login view */}
          <button
            type="button"
            onClick={() => typeof onSignedUp === "function" && onSignedUp()}
            className="simple-button simple-button-secondary"
          >
            ← Back to login
          </button>
        </div>
      </form>
    </div>
  );
}

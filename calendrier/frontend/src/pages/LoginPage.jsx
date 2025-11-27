// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Login from "../features/auth/Login";
import SignUp from "../features/auth/SignUp";

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex gap-2 mb-4">
          <button
            className={`view-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`view-btn ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        {mode === "login" ? (
          <Login onLoggedIn={() => navigate("/calendar")} />
        ) : (
          <SignUp onSignedUp={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}


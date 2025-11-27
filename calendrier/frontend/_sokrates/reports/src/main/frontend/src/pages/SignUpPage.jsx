// src/pages/SignUpPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import SignUp from "../features/auth/SignUp";

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto p-6">
        <SignUp onSignedUp={() => navigate("/login")} />
      </div>
    </div>
  );
}


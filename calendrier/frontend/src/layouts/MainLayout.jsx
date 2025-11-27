// src/layouts/MainLayout.jsx
import React from "react";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

export default function MainLayout({ children }) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar user={user} onSignOut={signOut} />
      <main>{children}</main>
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};


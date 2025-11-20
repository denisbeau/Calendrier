// src/App.jsx
import React, { useState } from "react";
import MyBigCalendar from "./Calendar.jsx";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Groups from "./components/Groups";

/* AuthArea (utilise useAuth depuis AuthContext) */
function AuthArea() {
  const { user, initializing, signOut } = useAuth();
  const [view, setView] = useState("calendar"); // "calendar" | "groups" | "groupCalendar"
  const [mode, setMode] = useState("login"); // login / signup
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  if (initializing) return <div className="p-6">Loading auth...</div>;

  if (user) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-300">
              Signed in as <strong>{user.email}</strong>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="simple-button"
              onClick={() => setView("calendar")}
            >
              Calendar
            </button>
            <button className="simple-button" onClick={() => setView("groups")}>
              Groups
            </button>
            <button className="simple-button" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        </div>

        {view === "calendar" && <MyBigCalendar />}
        {view === "groups" && (
          <Groups
            onShowGroupCalendar={(gid) => {
              setSelectedGroupId(gid);
              setView("groupCalendar");
            }}
          />
        )}
        {view === "groupCalendar" && (
          <div>
            <div className="mb-4 flex gap-2">
              <button
                className="simple-button"
                onClick={() => setView("calendar")}
              >
                Retour au calendrier perso
              </button>
              <button
                className="simple-button"
                onClick={() => setView("groups")}
              >
                Retour aux groupes
              </button>
            </div>
            <MyBigCalendar groupId={selectedGroupId} />
          </div>
        )}
      </div>
    );
  }

  return (
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
        <Login onLoggedIn={() => {}} />
      ) : (
        <SignUp onSignedUp={() => setMode("login")} />
      )}
    </div>
  );
}

/* App wrapper exported par défaut — c'est celui que main.jsx importe */
export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-white">
        <AuthArea />
      </div>
    </AuthProvider>
  );
}

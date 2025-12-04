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

  if (initializing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{
          padding: '24px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-primary)'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px'
      }}>
        <div className="simple-card" style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '4px'
              }}>
                Signed in as
              </div>
              <div style={{
                fontWeight: '600',
                color: 'var(--text-primary)',
                fontSize: '16px'
              }}>
                {user.email}
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <button
                className={view === "calendar" ? "simple-button" : "simple-button simple-button-secondary"}
                onClick={() => setView("calendar")}
                style={{ width: 'auto', minWidth: '120px' }}
              >
                📅 Calendar
              </button>
              <button
                className={view === "groups" ? "simple-button" : "simple-button simple-button-secondary"}
                onClick={() => setView("groups")}
                style={{ width: 'auto', minWidth: '120px' }}
              >
                👥 Groups
              </button>
              <button
                className="simple-button simple-button-secondary"
                onClick={() => signOut()}
                style={{ width: 'auto', minWidth: '120px' }}
              >
                🚪 Sign out
              </button>
            </div>
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
            <div style={{
              marginBottom: '16px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <button
                className="simple-button simple-button-secondary"
                onClick={() => setView("calendar")}
                style={{ width: 'auto' }}
              >
                ← Personal Calendar
              </button>
              <button
                className="simple-button simple-button-secondary"
                onClick={() => setView("groups")}
                style={{ width: 'auto' }}
              >
                ← Groups
              </button>
            </div>
            <MyBigCalendar groupId={selectedGroupId} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '40px 24px'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          Welcome to WeSchedule
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary)'
        }}>
          Sign in to manage your calendar and collaborate with teams
        </p>
      </div>

      <div className="simple-card">
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          backgroundColor: 'var(--bg-tertiary)',
          padding: '4px',
          borderRadius: '8px'
        }}>
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: mode === "login" ? 'var(--bg-primary)' : 'transparent',
              color: mode === "login" ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: mode === "login" ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: mode === "signup" ? 'var(--bg-primary)' : 'transparent',
              color: mode === "signup" ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: mode === "signup" ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
            }}
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
    </div>
  );
}

/* App wrapper exported par défaut — c'est celui que main.jsx importe */
export default function App() {
  return (
    <AuthProvider>
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      }}>
        <AuthArea />
      </div>
    </AuthProvider>
  );
}

// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./theme/ThemeProvider";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CalendarPage from "./pages/CalendarPage";
import GroupsPage from "./pages/GroupsPage";

// Component to log route changes and detect 404s
function RouteLogger() {
  const location = useLocation();

  useEffect(() => {
    // Log route changes for debugging
    console.log("📍 Route changed:", {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      fullUrl: window.location.href,
      timestamp: new Date().toISOString(),
    });

    // Check if we're on a known route
    const knownRoutes = ["/", "/login", "/signup", "/calendar", "/groups"];
    const isKnownRoute = knownRoutes.includes(location.pathname);

    if (!isKnownRoute) {
      console.warn("⚠️ Unknown route detected:", location.pathname);
      console.warn("💡 This might indicate a routing configuration issue.");
      console.warn("💡 Check vercel.json, netlify.toml, or server configuration.");
    }
  }, [location]);

  return null;
}

export default function App() {
  // Log app initialization
  useEffect(() => {
    console.log("🚀 App initialized", {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    // Check if we're in a SPA context
    if (window.history && window.history.pushState) {
      console.log("✅ Browser supports SPA routing");
    } else {
      console.warn("⚠️ Browser may not fully support SPA routing");
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <RouteLogger />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route
                        path="/calendar"
                        element={
                          <ProtectedRoute>
                            <CalendarPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/groups"
                        element={
                          <ProtectedRoute>
                            <GroupsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </MainLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

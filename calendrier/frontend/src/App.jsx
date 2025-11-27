// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./theme/ThemeProvider";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CalendarPage from "./pages/CalendarPage";
import GroupsPage from "./pages/GroupsPage";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
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
  );
}

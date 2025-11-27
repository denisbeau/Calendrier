// src/components/NavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider.jsx';
import PropTypes from 'prop-types';

export default function NavBar({ user, onSignOut }) {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`border-b ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center select-none">
            <Link to="/" className={`font-semibold text-lg tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>
              WeSchedule
            </Link>
          </div>

          {/* Navigation Links */}
          {user && (
            <div className="flex space-x-12 ml-12">
              <Link 
                to="/"
                className={`px-4 py-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'text-blue-400' 
                    : isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-900 hover:text-gray-600'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/calendar"
                className={`px-4 py-2 text-sm font-medium ${
                  isActive('/calendar') 
                    ? 'text-blue-400' 
                    : isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-900 hover:text-gray-600'
                }`}
              >
                Personal Calendar
              </Link>
              <Link 
                to="/groups"
                className={`px-4 py-2 text-sm font-medium ${
                  isActive('/groups') 
                    ? 'text-blue-400' 
                    : isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-900 hover:text-gray-600'
                }`}
              >
                Groups
              </Link>
            </div>
          )}

          {/* Right-side actions (theme toggle and sign out) */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {user && (
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {user.email}
                </span>
                <button
                  onClick={onSignOut}
                  className={`px-4 py-2 text-sm font-medium ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-900 hover:text-gray-600'}`}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

NavBar.propTypes = {
  user: PropTypes.object,
  onSignOut: PropTypes.func.isRequired,
};


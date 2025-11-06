import React from 'react';
import { useTheme } from './theme/ThemeProvider.jsx'

export default function NavBar({ currentPage, setCurrentPage }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={`border-b ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center select-none">
            <span className={`font-semibold text-lg tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>WeSchedule</span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-12 ml-12">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 text-sm font-medium ${
                currentPage === 'home' 
                  ? 'text-blue-400' 
                  : 'text-gray-900 hover:text-gray-600'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('calendar')}
              className={`px-4 py-2 text-sm font-medium ${
                currentPage === 'calendar' 
                  ? 'text-blue-400' 
                  : 'text-gray-900 hover:text-gray-600'
              }`}
            >
              Personal Calendar
            </button>
            <button 
              onClick={() => setCurrentPage('teams')}
              className={`px-4 py-2 text-sm font-medium ${
                currentPage === 'teams' 
                  ? 'text-blue-400' 
                  : 'text-gray-900 hover:text-gray-600'
              }`}
            >
              Teams
            </button>
          </div>

          {/* Right-side actions (theme toggle) */}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg mr-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

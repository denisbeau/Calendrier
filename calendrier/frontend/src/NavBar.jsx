import React from 'react';
import { useTheme } from './theme/ThemeProvider.jsx'

export default function NavBar({ currentPage, setCurrentPage }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav style={{
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-primary)',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center select-none">
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px'
            }}>
              📅 WeSchedule
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-1 ml-12">
            <button 
              onClick={() => setCurrentPage('home')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: currentPage === 'home' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: currentPage === 'home' ? 'var(--accent-light)' : 'transparent',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (currentPage !== 'home') {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 'home') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('calendar')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: currentPage === 'calendar' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: currentPage === 'calendar' ? 'var(--accent-light)' : 'transparent',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (currentPage !== 'calendar') {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 'calendar') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Personal Calendar
            </button>
            <button 
              onClick={() => setCurrentPage('teams')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: currentPage === 'teams' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: currentPage === 'teams' ? 'var(--accent-light)' : 'transparent',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (currentPage !== 'teams') {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 'teams') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Teams
            </button>
          </div>

          {/* Right-side actions (theme toggle) */}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
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

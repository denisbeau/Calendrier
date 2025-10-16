import React from 'react';

export default function NavBar({ currentPage, setCurrentPage }) {
  
  return (
    <nav className="border-b bg-white border-gray-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Navigation Links */}
          <div className="flex space-x-12">
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
          

          
        </div>
      </div>
    </nav>
  );
}

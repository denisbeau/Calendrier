import React from 'react';
import { useTheme } from './ThemeContext.jsx';

export default function Home({ setCurrentPage }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Calendar App</h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            A simple and powerful calendar application to manage your events and schedule efficiently.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          {/* Feature 1 */}
          <div className="simple-card text-center">
            <div className="mb-4">
              <div className={`w-12 h-12 rounded-lg mx-auto flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Event Management</h3>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Create, edit, and delete events easily. Click on any time slot or event to manage your schedule.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="simple-card text-center">
            <div className="mb-4">
              <div className={`w-12 h-12 rounded-lg mx-auto flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span className="text-2xl">👁️</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Multiple Views</h3>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Switch between month, week, day, and agenda views to see your schedule in different formats.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="simple-card text-center">
            <div className="mb-4">
              <div className={`w-12 h-12 rounded-lg mx-auto flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <span className="text-2xl">✏️</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Quick Editing</h3>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Edit events inline with our unified form. Update, delete, or cancel changes with simple buttons.
            </p>
          </div>

        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Instructions */}
            <div>
              <div className="space-y-6">
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Create Events</h4>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Use the form at the top or click and drag on the calendar to select a time range.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Edit Events</h4>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Click on any existing event to edit it. The form will populate with the event details.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Manage Views</h4>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Switch between different calendar views to see your schedule the way you prefer.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Visual Representation */}
            <div className="simple-card">
              <h4 className="font-semibold mb-4 text-center">Calendar Features</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Personal Calendar Management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Team Collaboration (Coming Soon)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm">Multiple View Options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm">Quick Event Creation</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Navigate to your Personal Calendar to start managing your events and schedule.
          </p>
          <button 
            onClick={() => setCurrentPage && setCurrentPage('calendar')}
            className="simple-button max-w-xs mx-auto"
          >
            Go to Personal Calendar
          </button>
        </div>

      </div>
    </div>
  );
}

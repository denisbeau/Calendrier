import React from 'react';
import { useTheme } from './theme/ThemeProvider.jsx';

export default function Home({ setCurrentPage }) {
  const { isDark } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)'
    }}>
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 style={{
            fontSize: '56px',
            fontWeight: '800',
            marginBottom: '24px',
            background: isDark 
              ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            WeSchedule
          </h1>
          <p style={{
            fontSize: '20px',
            maxWidth: '700px',
            margin: '0 auto',
            color: 'var(--text-secondary)',
            lineHeight: '1.8'
          }}>
            A simple and powerful calendar application to manage your events and schedule efficiently with your team.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          {/* Feature 1 */}
          <div className="simple-card text-center">
            <div className="mb-4">
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark
                  ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
                  : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                fontSize: '32px'
              }}>
                📅
              </div>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '12px',
              color: 'var(--text-primary)'
            }}>
              Event Management
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}>
              Create, edit, and delete events easily. Click on any time slot or event to manage your schedule.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="simple-card text-center">
            <div className="mb-4">
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark
                  ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
                  : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                fontSize: '32px'
              }}>
                👁️
              </div>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '12px',
              color: 'var(--text-primary)'
            }}>
              Multiple Views
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}>
              Switch between month, week, day, and agenda views to see your schedule in different formats.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="simple-card text-center">
            <div className="mb-4">
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark
                  ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
                  : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                fontSize: '32px'
              }}>
                👥
              </div>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '12px',
              color: 'var(--text-primary)'
            }}>
              Team Collaboration
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}>
              Create groups, invite team members, and collaborate on shared calendars seamlessly.
            </p>
          </div>

        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '48px',
            color: 'var(--text-primary)'
          }}>
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Instructions */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '4px',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '18px'
                  }}>
                    1
                  </div>
                  <div>
                    <h4 style={{
                      fontWeight: '600',
                      marginBottom: '8px',
                      fontSize: '18px',
                      color: 'var(--text-primary)'
                    }}>
                      Create Events
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      Use the form at the top or click and drag on the calendar to select a time range.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '4px',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '18px'
                  }}>
                    2
                  </div>
                  <div>
                    <h4 style={{
                      fontWeight: '600',
                      marginBottom: '8px',
                      fontSize: '18px',
                      color: 'var(--text-primary)'
                    }}>
                      Edit Events
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      Click on any existing event to edit it. The form will populate with the event details.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '4px',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '18px'
                  }}>
                    3
                  </div>
                  <div>
                    <h4 style={{
                      fontWeight: '600',
                      marginBottom: '8px',
                      fontSize: '18px',
                      color: 'var(--text-primary)'
                    }}>
                      Collaborate
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      Create groups, share invite codes, and manage team calendars together.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Visual Representation */}
            <div className="simple-card">
              <h4 style={{
                fontWeight: '600',
                marginBottom: '16px',
                textAlign: 'center',
                fontSize: '18px',
                color: 'var(--text-primary)'
              }}>
                Calendar Features
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#10b981',
                    borderRadius: '4px'
                  }}></div>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Personal Calendar Management
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '4px'
                  }}></div>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Team Group Calendars
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#a855f7',
                    borderRadius: '4px'
                  }}></div>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Multiple View Options
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#f59e0b',
                    borderRadius: '4px'
                  }}></div>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Quick Event Creation
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            marginBottom: '32px',
            color: 'var(--text-secondary)',
            fontSize: '16px'
          }}>
            Navigate to your Personal Calendar to start managing your events and schedule.
          </p>
          <button 
            onClick={() => setCurrentPage && setCurrentPage('calendar')}
            className="simple-button"
            style={{
              maxWidth: '300px',
              margin: '0 auto',
              fontSize: '16px',
              padding: '14px 28px'
            }}
          >
            Go to Personal Calendar →
          </button>
        </div>

      </div>
    </div>
  );
}
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Calendar App</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-600">
            A simple and powerful calendar application to manage your events and schedule efficiently.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          {/* Feature 1 */}
          <div className="simple-card text-center">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center bg-gray-200">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Event Management</h3>
            <p className="text-gray-600">
              Create, edit, and delete events easily. Click on any time slot or event to manage your schedule.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="simple-card text-center">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center bg-gray-200">
                <span className="text-2xl">👁️</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Multiple Views</h3>
            <p className="text-gray-600">
              Switch between month, week, day, and agenda views to see your schedule in different formats.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="simple-card text-center">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center bg-gray-200">
                <span className="text-2xl">✏️</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Quick Editing</h3>
            <p className="text-gray-600">
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
                    <p className="text-gray-600">Use the form at the top or click and drag on the calendar to select a time range.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Edit Events</h4>
                    <p className="text-gray-600">Click on any existing event to edit it. The form will populate with the event details.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Manage Views</h4>
                    <p className="text-gray-600">Switch between different calendar views to see your schedule the way you prefer.</p>
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
          <p className="mb-8 text-gray-600">
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

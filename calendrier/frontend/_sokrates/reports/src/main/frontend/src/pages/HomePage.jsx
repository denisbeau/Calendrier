// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";

const FEATURE_CARDS = [
  {
    icon: "📅",
    title: "Event Management",
    description:
      "Create, edit, and delete events easily. Click on any time slot or event to manage your schedule.",
  },
  {
    icon: "👁️",
    title: "Multiple Views",
    description:
      "Switch between month, week, day, and agenda views to see your schedule in different formats.",
  },
  {
    icon: "👥",
    title: "Team Collaboration",
    description:
      "Create groups, invite team members, and collaborate on shared calendars seamlessly.",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Create Events",
    description:
      "Use the form at the top or click and drag on the calendar to select a time range.",
  },
  {
    number: 2,
    title: "Edit Events",
    description:
      "Click on any existing event to edit it. The form will populate with the event details.",
  },
  {
    number: 3,
    title: "Collaborate",
    description:
      "Create groups, share invite codes, and manage team calendars together.",
  },
];

function FeatureCard({ icon, title, description, isDark }) {
  return (
    <div className="simple-card text-center">
      <div className="mb-4">
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "12px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isDark
              ? "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)"
              : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            fontSize: "32px",
          }}
        >
          {icon}
        </div>
      </div>
      <h3
        style={{
          fontSize: "20px",
          fontWeight: "700",
          marginBottom: "12px",
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--text-secondary)",
          lineHeight: "1.6",
        }}
      >
        {description}
      </p>
    </div>
  );
}

function HowItWorksStep({ number, title, description }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: "var(--accent-primary)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: "4px",
          color: "white",
          fontWeight: "700",
          fontSize: "18px",
        }}
      >
        {number}
      </div>
      <div>
        <h4
          style={{
            fontWeight: "600",
            marginBottom: "8px",
            fontSize: "18px",
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h4>
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "800",
              marginBottom: "24px",
              background: isDark
                ? "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)"
                : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            WeSchedule
          </h1>
          <p
            style={{
              fontSize: "20px",
              maxWidth: "700px",
              margin: "0 auto",
              color: "var(--text-secondary)",
              lineHeight: "1.8",
            }}
          >
            A simple and powerful calendar application to manage your events and
            schedule efficiently with your team.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {FEATURE_CARDS.map((feature) => (
            <FeatureCard key={feature.title} isDark={isDark} {...feature} />
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "48px",
              color: "var(--text-primary)",
            }}
          >
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Instructions */}
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {HOW_IT_WORKS_STEPS.map((step) => (
                  <HowItWorksStep key={step.number} {...step} />
                ))}
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
            onClick={() => navigate('/calendar')}
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


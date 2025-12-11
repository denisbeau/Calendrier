// src/components/ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <div style={{ maxWidth: "800px", width: "100%" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
              ⚠️ Something went wrong
            </h1>
            <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
              An error occurred while loading the application.
            </p>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                padding: "1.5rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                fontFamily: "monospace",
                fontSize: "0.875rem",
                overflow: "auto",
                maxHeight: "400px",
              }}
            >
              <strong>Error Details:</strong>
              <pre style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
                {this.state.error?.toString()}
              </pre>
              {this.state.errorInfo && (
                <details style={{ marginTop: "1rem" }}>
                  <summary style={{ cursor: "pointer", marginBottom: "0.5rem" }}>
                    Stack Trace
                  </summary>
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.75rem" }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "0.75rem 2rem",
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "2px solid white",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                Reload Page
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  padding: "0.75rem 2rem",
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "2px solid white",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


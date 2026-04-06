"use client";

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
          style={{ background: 'var(--bg)', color: 'var(--text)' }}
        >
          <div className="relative max-w-xl space-y-8 py-12">
            <h1
              className="text-5xl font-extrabold tracking-tighter"
              style={{ letterSpacing: '-0.03em' }}
            >
              Oeps! Iets is misgegaan.
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-2)' }}>
              We hebben een fout vastgesteld. Probeer het opnieuw of ga naar de
              homepage.
            </p>
            <div className="flex justify-center pt-4 gap-4">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="bg-[#5B6EF5] hover:bg-[#4B5EE5] text-white font-semibold py-3 px-8 rounded-xl transition-colors"
              >
                Probeer het opnieuw
              </button>
              <a
                href="/"
                className="font-semibold py-3 px-8 rounded-xl transition-colors"
                style={{
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-2)',
                }}
              >
                Naar Homepage
              </a>
            </div>
            {this.state.error && (
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                Foutdetails: {this.state.error.message}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RootErrorBoundary;
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Mutalib Leather Factory ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF8F5] text-[#1E1511] text-center">
          <div className="w-16 h-16 rounded-full bg-[#8C5D38]/10 flex items-center justify-center text-[#8C5D38] mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Mutalib's Leather Factory</h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mb-6 leading-relaxed">
            The store encountered a brief display hiccup. You can reload the page or reset your session below to continue shopping.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
            >
              Reload Page
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                } catch (e) {}
                window.location.href = '/';
              }}
              className="px-6 py-2.5 border border-[#8C5D38] text-[#8C5D38] hover:bg-[#8C5D38] hover:text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
            >
              Reset Session & Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

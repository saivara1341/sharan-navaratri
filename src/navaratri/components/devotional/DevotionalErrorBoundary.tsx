import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw, Home, AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class DevotionalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[DevotionalErrorBoundary caught error]:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    window.location.href = `${base}/navaratri`;
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full rounded-3xl border-2 border-amber-300 bg-white p-8 shadow-xl text-center space-y-5">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-3xl">
              🪔
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-serif font-bold text-amber-900 tracking-wide">
                ॥ ॐ శ్రీ మాత్రే నమః ॥
              </span>
              <h2 className="font-serif font-black text-2xl text-[#8B1E1E]">
                Devotional View Temporarily Unavailable
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                We encountered an unexpected issue while preparing this mandapam view. You can refresh or return to the main sacred directory.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-left overflow-auto max-h-24 text-[11px] font-mono text-stone-700">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-4 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5 text-[#8B1E1E]" />
                <span>Go to Mandapams</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

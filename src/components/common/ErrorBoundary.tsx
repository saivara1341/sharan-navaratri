import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
          <div className="max-w-md w-full rounded-2xl border border-border/60 bg-card p-8 shadow-2xl text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
              <p className="text-sm text-muted-foreground">
                An unexpected interface issue occurred. You can reload this view or return to the main dashboard.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-muted/40 rounded-lg border border-border text-left overflow-auto max-h-28 text-xs font-mono text-muted-foreground">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={this.handleReload}
                className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="flex-1 gap-2 border-border/80 hover:bg-muted/50"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

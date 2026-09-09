import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        params: {
          sitekey: string;
          action?: string;
          cData?: string;
          callback?: (token: string) => void;
          'error-callback'?: (error: any) => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
          [key: string]: any;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
    };
    onloadTurnstileCallback?: () => void;
  }
}

// Default to Cloudflare's official testing sitekey (always passes) if no environment variable is provided
const DEFAULT_TEST_SITEKEY = '1x00000000000000000000AA';

interface CloudflareTurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: any) => void;
  action?: string;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
}

export const CloudflareTurnstile: React.FC<CloudflareTurnstileProps> = ({
  onVerify,
  onExpire,
  onError,
  action = 'submit',
  className = '',
  theme = 'auto',
  size = 'normal',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'verified' | 'error' | 'expired'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const siteKey =
    import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    import.meta.env.VITE_TURNSTILE_SITE_KEY ||
    DEFAULT_TEST_SITEKEY;

  useEffect(() => {
    let isMounted = true;

    // Load Turnstile script if not already present
    const SCRIPT_ID = 'cf-turnstile-script';
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      // Clean up existing widget if any
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup errors
        }
        widgetIdRef.current = null;
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme,
          size,
          callback: (token: string) => {
            if (!isMounted) return;
            setStatus('verified');
            setErrorMessage(null);
            onVerify(token);
          },
          'expired-callback': () => {
            if (!isMounted) return;
            setStatus('expired');
            onExpire?.();
          },
          'error-callback': (err: any) => {
            if (!isMounted) return;
            console.warn('[Cloudflare Turnstile] Verification challenge error:', err);
            setStatus('error');
            setErrorMessage('Security challenge could not complete. Please retry.');
            onError?.(err);
          },
        });

        widgetIdRef.current = id;
        setStatus('ready');
      } catch (err: any) {
        console.error('[Cloudflare Turnstile] Render error:', err);
        setStatus('error');
        setErrorMessage(err?.message || 'Failed to render security verification.');
      }
    };

    if (!window.turnstile) {
      if (!script) {
        script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.turnstile) {
            renderWidget();
          }
        };
        script.onerror = () => {
          if (isMounted) {
            setStatus('error');
            setErrorMessage('Unable to load Cloudflare security script. Please check your network or ad-blocker.');
          }
        };
        document.head.appendChild(script);
      } else {
        // Script is already added but maybe still loading
        const interval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(interval);
            renderWidget();
          }
        }, 100);
        setTimeout(() => clearInterval(interval), 10000);
      }
    } else {
      renderWidget();
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [siteKey, action, theme, size]);

  const handleRetry = () => {
    setStatus('loading');
    setErrorMessage(null);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  return (
    <div className={`cloudflare-turnstile-wrapper rounded-xl border border-border/80 bg-muted/20 p-3 sm:p-4 text-xs ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          {status === 'verified' ? (
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : status === 'error' || status === 'expired' ? (
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
          )}
          <span>Bot Protection & Verification</span>
        </div>

        <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
          Powered by <strong className="text-foreground">Cloudflare Turnstile</strong>
        </span>
      </div>

      {/* Cloudflare Turnstile container */}
      <div className="flex justify-center min-h-[65px] items-center my-1">
        <div ref={containerRef} className="w-full flex justify-center" />
      </div>

      {/* Status banner */}
      {status === 'verified' && (
        <div className="mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Human verification verified successfully
        </div>
      )}

      {status === 'expired' && (
        <div className="mt-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between">
          <span>Security token expired.</span>
          <button
            type="button"
            onClick={handleRetry}
            className="text-primary hover:underline font-bold cursor-pointer"
          >
            Refresh challenge
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-2 text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center justify-between">
          <span>{errorMessage || 'Verification error.'}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="text-primary hover:underline font-bold cursor-pointer ml-2"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

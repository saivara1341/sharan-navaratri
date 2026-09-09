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
    <div className={`cloudflare-turnstile-wrapper flex flex-col items-center justify-center my-1 ${className}`}>
      {/* Cloudflare Turnstile native container */}
      <div className="flex justify-center min-h-[65px] items-center">
        <div ref={containerRef} className="w-full flex justify-center" />
      </div>

      {status === 'expired' && (
        <div className="mt-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <span>Security token expired.</span>
          <button
            type="button"
            onClick={handleRetry}
            className="text-primary hover:underline font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <span>{errorMessage || 'Verification error.'}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="text-primary hover:underline font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

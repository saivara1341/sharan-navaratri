import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface TurnstileContextValue {
  isVerified: boolean;
  token: string | null;
  status: 'verifying' | 'verified' | 'failed' | 'idle';
  refreshChallenge: () => void;
  siteKey: string;
}

const TurnstileContext = createContext<TurnstileContextValue>({
  isVerified: false,
  token: null,
  status: 'idle',
  refreshChallenge: () => {},
  siteKey: '',
});

export const useTurnstileSecurity = () => useContext(TurnstileContext);

const DEFAULT_TEST_SITEKEY = '1x00000000000000000000AA';
const SESSION_STORAGE_KEY = 'sd_cf_turnstile_verified';
const SESSION_TIMESTAMP_KEY = 'sd_cf_turnstile_timestamp';
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export const SiteWideTurnstileProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const [isVerified, setIsVerified] = useState<boolean>(() => {
    try {
      const savedToken = sessionStorage.getItem(SESSION_STORAGE_KEY);
      const savedTime = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);
      if (savedToken && savedTime) {
        const age = Date.now() - parseInt(savedTime, 10);
        if (age < TWO_HOURS_MS) return true;
      }
    } catch {
      // ignore storage errors
    }
    return false;
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(SESSION_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [status, setStatus] = useState<'verifying' | 'verified' | 'failed' | 'idle'>('idle');

  const siteKey =
    import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    import.meta.env.VITE_TURNSTILE_SITE_KEY ||
    DEFAULT_TEST_SITEKEY;

  const renderBackgroundTurnstile = () => {
    if (!containerRef.current || !window.turnstile) return;

    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // ignore cleanup error
      }
      widgetIdRef.current = null;
    }

    try {
      setStatus('verifying');
      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: 'site_wide_gate',
        theme: 'auto',
        size: 'flexible',
        callback: (newToken: string) => {
          setToken(newToken);
          setIsVerified(true);
          setStatus('verified');
          try {
            sessionStorage.setItem(SESSION_STORAGE_KEY, newToken);
            sessionStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
          } catch {
            // ignore
          }
        },
        'expired-callback': () => {
          setStatus('idle');
          setIsVerified(false);
          setToken(null);
          try {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
          } catch {
            // ignore
          }
        },
        'error-callback': (err: any) => {
          console.warn('[SiteWide Turnstile] Background challenge note:', err);
          setStatus('failed');
        },
      });
      widgetIdRef.current = id;
    } catch (err) {
      console.warn('[SiteWide Turnstile] Render error:', err);
      setStatus('failed');
    }
  };

  useEffect(() => {
    // If already verified for this session, mark verified
    if (isVerified) {
      setStatus('verified');
      return;
    }

    // Otherwise initiate background verification
    const SCRIPT_ID = 'cf-turnstile-script';
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!window.turnstile) {
      if (!script) {
        script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.turnstile) {
            renderBackgroundTurnstile();
          }
        };
        document.head.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(interval);
            renderBackgroundTurnstile();
          }
        }, 150);
        setTimeout(() => clearInterval(interval), 10000);
      }
    } else {
      renderBackgroundTurnstile();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, [siteKey]);

  const refreshChallenge = () => {
    setStatus('verifying');
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    } else {
      renderBackgroundTurnstile();
    }
  };

  return (
    <TurnstileContext.Provider
      value={{
        isVerified,
        token,
        status,
        refreshChallenge,
        siteKey,
      }}
    >
      {children}

      {/* Invisible background Turnstile challenge container */}
      <div
        aria-hidden="true"
        className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none"
      >
        <div ref={containerRef} />
      </div>
    </TurnstileContext.Provider>
  );
};

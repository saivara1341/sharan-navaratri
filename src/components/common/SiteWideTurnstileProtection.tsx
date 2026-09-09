import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader2, X, ChevronUp, Lock } from 'lucide-react';

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
  const [badgeExpanded, setBadgeExpanded] = useState<boolean>(false);
  const [badgeDismissed, setBadgeDismissed] = useState<boolean>(false);

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

      {/* Offscreen background Turnstile challenge container */}
      <div
        aria-hidden="true"
        className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none"
      >
        <div ref={containerRef} />
      </div>

      {/* Floating Cloudflare Security Badge (Bottom-Left) */}
      {!badgeDismissed && (
        <aside
          aria-label="Cloudflare Turnstile Bot Protection"
          className="fixed bottom-4 left-4 z-40 select-none print:hidden"
        >
          {badgeExpanded ? (
            <div className="rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl p-3.5 max-w-[280px] sm:max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
                <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Cloudflare Security</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setBadgeExpanded(false)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Minimize badge"
                    aria-label="Minimize badge"
                  >
                    <ChevronUp className="w-3.5 h-3.5 rotate-180" />
                  </button>
                  <button
                    onClick={() => setBadgeDismissed(true)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Dismiss badge"
                    aria-label="Dismiss badge"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-muted-foreground space-y-2">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  {status === 'verified' || isVerified ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span>Verified Human Session (Bot Guard Active)</span>
                    </>
                  ) : status === 'verifying' ? (
                    <>
                      <Loader2 className="w-3 h-3 text-primary animate-spin shrink-0" />
                      <span>Verifying browser authenticity...</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Securing connection with Cloudflare</span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed">
                  This entire website is protected by <strong className="text-foreground">Cloudflare Turnstile</strong> to prevent automated scrapers, bot attacks, and spam without intrusive puzzles.
                </p>
                <div className="text-[10px] text-muted-foreground pt-1 flex items-center justify-between border-t border-border/50">
                  <span>Privacy-first protection</span>
                  <span className="text-primary font-semibold">Turnstile Active</span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setBadgeExpanded(true)}
              className="group flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-border/70 bg-background/90 hover:bg-background/95 backdrop-blur-md shadow-lg text-[10px] font-bold text-foreground/85 hover:text-foreground transition-all cursor-pointer hover:border-primary/50"
              title="Protected by Cloudflare Turnstile (Click to view)"
              aria-label="Protected by Cloudflare Turnstile"
            >
              <div className="relative flex items-center justify-center">
                <Lock className="w-3 h-3 text-primary" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="hidden sm:inline">Protected by Cloudflare</span>
              <span className="sm:hidden">Protected</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                Human
              </span>
            </button>
          )}
        </aside>
      )}
    </TurnstileContext.Provider>
  );
};

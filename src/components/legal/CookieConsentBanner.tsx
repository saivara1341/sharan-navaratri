import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { CONSENT_NOTICE_VERSION, readConsent, saveConsent } from "@/lib/consent";

/**
 * DPDP-compliant consent notice. Optional categories default to OFF
 * (no pre-ticked boxes), and "Reject optional" is as prominent as "Accept all".
 * Rendered as a warm paper corner card, anchored bottom-left.
 */
export const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (!readConsent()) {
      const timer = window.setTimeout(() => setVisible(true), 1200);
      return () => window.clearTimeout(timer);
    }
    const onChange = () => setVisible(!readConsent());
    window.addEventListener("sd-consent-changed", onChange);
    return () => window.removeEventListener("sd-consent-changed", onChange);
  }, []);

  const decide = (choice: { preferences: boolean; analytics: boolean }) => {
    saveConsent(choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Privacy and cookie consent notice"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed bottom-4 left-4 right-4 z-[120] max-w-[400px] rounded-sm border border-border bg-card p-6 shadow-2xl sm:right-auto"
        >
          {/* Header */}
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-card-foreground">
                Your privacy choices
              </h2>
              <div className="mt-2 h-[2px] w-12 bg-primary" />
            </div>
          </div>

          {/* Content */}
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Siddhi Dynamics LLP (Data Fiduciary) uses strictly necessary storage to run this site. With your consent
            we also use preference and analytics storage, as required by India's Digital Personal Data Protection Act,
            2023. Review our{" "}
            <Link to="/privacy" className="font-medium text-card-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary">
              privacy notice
            </Link>{" "}
            or exercise your{" "}
            <Link to="/data-rights" className="font-medium text-card-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary">
              Data Rights
            </Link>
            .
          </p>

          {showPrefs && (
            <div className="mb-5 space-y-2 rounded-sm border border-border bg-secondary/60 p-3">
              <label className="flex items-start gap-3 text-xs text-muted-foreground">
                <input type="checkbox" checked disabled className="mt-0.5 accent-primary" />
                <span><strong className="text-card-foreground">Strictly necessary</strong> — security, sign-in and core site functions. Always on.</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={preferences}
                  onChange={(e) => setPreferences(e.target.checked)}
                  className="mt-0.5 accent-primary"
                />
                <span><strong className="text-card-foreground">Preferences</strong> — remembers language and interface settings.</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-0.5 accent-primary"
                />
                <span><strong className="text-card-foreground">Analytics</strong> — aggregated usage insights to improve the site.</span>
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => decide({ preferences: true, analytics: true })}
                className="flex-1 rounded-sm bg-primary px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={() => decide({ preferences: false, analytics: false })}
                className="flex-1 rounded-sm border border-card-foreground/20 px-4 py-3 text-xs font-bold uppercase tracking-widest text-card-foreground transition-colors hover:border-card-foreground"
              >
                Reject optional
              </button>
            </div>
            {showPrefs ? (
              <button
                type="button"
                onClick={() => decide({ preferences, analytics })}
                className="pt-1 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-primary transition-colors hover:text-card-foreground"
              >
                Save my choices
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowPrefs(true)}
                className="pt-1 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-card-foreground/60 transition-colors hover:text-card-foreground"
              >
                Manage preferences
              </button>
            )}
          </div>

          {/* Version tag */}
          <div className="mt-6 flex justify-end border-t border-border pt-3">
            <span className="text-[9px] uppercase tracking-widest text-card-foreground/40">
              {CONSENT_NOTICE_VERSION}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;

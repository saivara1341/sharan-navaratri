import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, SlidersHorizontal } from "lucide-react";
import { CONSENT_NOTICE_VERSION, readConsent, saveConsent } from "@/lib/consent";

/**
 * DPDP-compliant consent notice. Optional categories default to OFF
 * (no pre-ticked boxes), and "Reject optional" is as prominent as "Accept all".
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed inset-x-3 bottom-3 z-[120] mx-auto max-w-3xl rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl p-5 shadow-2xl md:inset-x-6"
        >
          <div className="flex items-start gap-3">
            <div className="hidden sm:flex p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-sm font-bold text-foreground">Your privacy choices</h2>
                <p className="text-xs leading-relaxed text-muted-foreground mt-1">
                  Siddhi Dynamics LLP (Data Fiduciary) uses strictly necessary storage to run this site. With your
                  consent we also use preference and analytics storage. We process personal data only for the purposes
                  described in our{" "}
                  <Link to="/privacy" className="text-primary hover:underline">privacy notice</Link>, as required by
                  India's Digital Personal Data Protection Act, 2023. You can withdraw consent at any time from the{" "}
                  <Link to="/data-rights" className="text-primary hover:underline">Data Rights</Link> page.
                </p>
              </div>

              {showPrefs && (
                <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <label className="flex items-start gap-3 text-xs text-muted-foreground">
                    <input type="checkbox" checked disabled className="mt-0.5 accent-primary" />
                    <span><strong className="text-foreground">Strictly necessary</strong> — security, sign-in and core site functions. Always on.</span>
                  </label>
                  <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences}
                      onChange={(e) => setPreferences(e.target.checked)}
                      className="mt-0.5 accent-primary"
                    />
                    <span><strong className="text-foreground">Preferences</strong> — remembers language and interface settings.</span>
                  </label>
                  <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="mt-0.5 accent-primary"
                    />
                    <span><strong className="text-foreground">Analytics</strong> — aggregated usage insights to improve the site.</span>
                  </label>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => decide({ preferences: true, analytics: true })}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={() => decide({ preferences: false, analytics: false })}
                  className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-foreground hover:border-primary/40 transition-colors"
                >
                  Reject optional
                </button>
                {showPrefs ? (
                  <button
                    type="button"
                    onClick={() => decide({ preferences, analytics })}
                    className="rounded-xl border border-primary/40 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                  >
                    Save my choices
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPrefs(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors sm:ml-1"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Manage preferences
                  </button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground/70">Notice version {CONSENT_NOTICE_VERSION}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;

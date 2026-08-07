import { useState, useEffect } from 'react';
import { Star, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GOOGLE_REVIEW_URL = 'https://g.page/r/CQ8YjZSqkk-5EBM/review';

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export function GoogleReviewNotificationBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('g_review_banner_dismissed');
    if (!dismissed) {
      // Show notification banner after short delay
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('g_review_banner_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-22 right-4 md:right-8 md:bottom-24 z-[110] max-w-sm w-[calc(100vw-2.5rem)] rounded-2xl border border-amber-400/40 bg-zinc-950/95 p-4 shadow-[0_10px_35px_rgba(245,158,11,0.25)] backdrop-blur-xl text-white font-sans"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                Google Review
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close review notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2.5 space-y-2">
            <p className="text-xs font-semibold text-slate-200 leading-snug">
              Built something great with Siddhi? Tell others about your experience on Google!
            </p>

            <div className="pt-1 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400">Siddhi Dynamics LLP</span>
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleDismiss()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-extrabold shadow-md shadow-amber-400/20 hover:bg-amber-300 transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <GoogleLogo />
                Review Us
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

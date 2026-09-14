import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import siddhiLogo from '@/assets/siddhi-logo-transparent.png';

const INTRO_STORAGE_KEY = 'siddhi-intro-seen';
const INTRO_DURATION = 1500;
const INTRO_EXIT_DURATION = 350;

export const SiteIntro = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const forcePreview = new URLSearchParams(location.search).get('intro') === 'preview';
  const [visible, setVisible] = useState(() => {
    if (location.pathname !== '/') return false;
    if (forcePreview) return true;
    return sessionStorage.getItem(INTRO_STORAGE_KEY) !== 'true';
  });

  useEffect(() => {
    if (!visible) return;

    sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(
      () => setVisible(false),
      reduceMotion ? 600 : INTRO_DURATION - INTRO_EXIT_DURATION
    );

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [reduceMotion, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="site-intro cursor-pointer"
          onClick={() => setVisible(false)}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
          transition={{ duration: INTRO_EXIT_DURATION / 1000, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-label="Welcome to Siddhi Dynamics"
        >
          <div className="site-intro-glow site-intro-glow-saffron" />
          <div className="site-intro-glow site-intro-glow-green" />
          <motion.div
            className="site-intro-content"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
          >
            <motion.p
              className="site-intro-welcome"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
            >
              Welcome to
            </motion.p>
            <motion.div
              className="site-intro-brand-lockup"
              initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <img className="site-intro-logo" src={siddhiLogo} alt="" />
              <h1 className="site-intro-brand" aria-label="SiddhiDynamics LLP">
                <span className="site-intro-brand-siddhi">Siddhi</span>
                <span className="site-intro-brand-dynamics">Dynamics</span>
                <span className="site-intro-brand-llp">LLP</span>
              </h1>
            </motion.div>
            <motion.p
              className="site-intro-tagline"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25, duration: 0.7 }}
            >
              Building Ideas · Creating Impact
            </motion.p>
            <div className="site-intro-line">
              <span />
              <i />
              <span />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

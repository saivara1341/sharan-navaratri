import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MorphingText } from '@/components/ui/morphing-text';

const INTRO_STORAGE_KEY = 'siddhi-intro-seen';
const INTRO_DURATION = 7000;

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
      reduceMotion ? 900 : INTRO_DURATION
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
          className="site-intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.025, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
            <p>Intelligence · Innovation · India</p>
            <MorphingText
              className="site-intro-morph"
              texts={['Welcome', 'to', 'Siddhi', 'Dynamics']}
            />
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

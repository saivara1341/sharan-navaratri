import { motion, useReducedMotion } from 'framer-motion';
import FadeThrough from '@/components/smoothui/fade-through';
import { CinematicIndianFlag } from '@/components/three/CinematicIndianFlag';

export const IndependenceDayHero = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="independence-hero" aria-labelledby="independence-title">
      <div className="independence-ambient" aria-hidden="true" />
      <motion.div
        className="independence-kicker"
        initial={reduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span /> 15th August <span />
      </motion.div>

      <motion.div
        className="independence-flag-stage"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="independence-flag-shadow" aria-hidden="true" />
        <div className={`independence-flag independence-flag-3d ${reduceMotion ? 'reduce-motion' : ''}`}>
          <CinematicIndianFlag />

          <div className="independence-copy">
            <motion.p
              className="independence-eyebrow"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Siddhi Dynamics · India
            </motion.p>
            <h1 id="independence-title">
              Happy Independence Day
              <span>to every Indian</span>
            </h1>
            <div className="independence-rotating-copy" aria-label="Our promise to India">
              <span>We build to</span>
              <FadeThrough
                interval={3000}
                phrases={['empower India.', 'innovate for India.', 'build a stronger India.']}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="independence-footer"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.8 }}
      >
        <span>Freedom to imagine.</span>
        <i />
        <span>Freedom to build.</span>
        <i />
        <span>Freedom to lead.</span>
      </motion.div>
    </section>
  );
};

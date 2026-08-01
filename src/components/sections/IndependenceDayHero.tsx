import { motion, useReducedMotion } from 'framer-motion';
import FadeThrough from '@/components/smoothui/fade-through';

const AshokaChakra = () => (
  <svg aria-hidden="true" className="independence-chakra" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="50" cy="50" r="5" fill="currentColor" />
    {Array.from({ length: 24 }, (_, index) => (
      <line
        key={index}
        x1="50"
        y1="50"
        x2="50"
        y2="16"
        stroke="currentColor"
        strokeWidth="1.5"
        transform={`rotate(${index * 15} 50 50)`}
      />
    ))}
  </svg>
);

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
        <span /> 15 August <span />
      </motion.div>

      <motion.div
        className="independence-flag-stage"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="independence-flag-shadow" aria-hidden="true" />
        <div className={`independence-flag ${reduceMotion ? 'reduce-motion' : ''}`}>
          <div className="flag-folds" aria-hidden="true" />
          <div className="flag-band flag-saffron" />
          <div className="flag-band flag-white">
            <AshokaChakra />
          </div>
          <div className="flag-band flag-green" />

          <div className="independence-copy">
            <motion.p
              className="independence-eyebrow"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Siddhi Dynamics celebrates
            </motion.p>
            <h1 id="independence-title">
              Happy Independence Day
              <span>to every Indian.</span>
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

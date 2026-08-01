import { motion, useScroll, useTransform } from 'framer-motion';
import { lazy, Suspense, useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import hiveLogo from '@/assets/hive-logo.jpg';
import FadeThrough from '@/components/smoothui/fade-through';
const Scene3D = lazy(() => import('../three/Scene3D').then(module => ({ default: module.Scene3D })));

const floatingAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.5, 0.8, 0.5],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: i * 0.15,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
};


export const HeroSection = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [showScene, setShowScene] = useState(false);
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.95]);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const isConstrainedDevice =
      connection?.saveData ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth < 900;
    if (isConstrainedDevice) return;

    const enableScene = () => setShowScene(true);
    const interactionEvents = ['pointerdown', 'keydown', 'scroll'] as const;
    const handleFirstInteraction = () => {
      window.setTimeout(enableScene, 1200);
      interactionEvents.forEach(event => window.removeEventListener(event, handleFirstInteraction));
    };
    interactionEvents.forEach(event =>
      window.addEventListener(event, handleFirstInteraction, { passive: true, once: true })
    );

    return () => {
      interactionEvents.forEach(event => window.removeEventListener(event, handleFirstInteraction));
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden particle-ring pt-32 pb-32 md:pt-24 md:pb-16"
      style={{
        '--ring-x': mousePosition.x,
        '--ring-y': mousePosition.y,
      } as React.CSSProperties}
    >
      {showScene && <Suspense fallback={null}><Scene3D /></Suspense>}

      {/* Multi-layered gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30 pointer-events-none" />

      {/* Animated rings with enhanced motion */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="interactive-ring w-[400px] h-[400px]"
          style={{ animationDelay: '0s' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="interactive-ring w-[600px] h-[600px]"
          style={{ animationDelay: '1s' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="interactive-ring w-[800px] h-[800px]"
          style={{ animationDelay: '2s' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/10 blur-xl"
        animate={floatingAnimation}
      />
      <motion.div
        className="absolute top-1/3 right-16 w-16 h-16 rounded-full bg-accent/15 blur-lg"
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-12 h-12 rounded-full bg-primary/20 blur-lg"
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-3xl"
        animate={pulseAnimation}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-tr from-accent/5 to-primary/5 blur-3xl"
        animate={{ ...pulseAnimation, transition: { ...pulseAnimation.transition, delay: 1.5 } }}
      />

      {/* Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="container mx-auto px-6 relative z-10 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center mb-10 mt-20 md:mb-6 md:mt-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card electric-border"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-sm text-muted-foreground font-medium">{t('hero.badge')}</span>
            </motion.div>
          </motion.div>

          {/* Main heading with staggered text reveal */}
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl font-bold mb-8 md:mb-5 leading-[1.1] tracking-tight">
            <motion.span
              className="block text-foreground"
              custom={0}
              initial="hidden"
              animate="visible"
              variants={textRevealVariants}
            >
              We help Indian businesses
            </motion.span>
            <motion.span
              className="block text-foreground"
              custom={1}
              initial="hidden"
              animate="visible"
              variants={textRevealVariants}
            >
              with AI systems that
            </motion.span>
            <motion.span
              className="block min-h-[1.1em] gradient-hero glow-text"
              custom={2}
              initial="hidden"
              animate="visible"
              variants={textRevealVariants}
            >
              <FadeThrough
                interval={3000}
                phrases={[
                  'automate manual work.',
                  'ship production AI.',
                  'scale with confidence.',
                ]}
              />
            </motion.span>
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-base sm:text-lg md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 md:mb-7 leading-relaxed hero-description"
          >
            From invoice processing to custom SaaS — we build and deploy intelligent systems, not demos.
            {' '}<span className="text-primary font-medium">Incubated at HIVE, Anurag University.</span>
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 md:mb-7"
          >
            <motion.a
              href="#submit"
              className="group relative w-full max-w-[21rem] overflow-hidden rounded-2xl px-5 py-4 text-sm font-semibold shadow-2xl shadow-primary/20 sm:w-auto sm:max-w-none sm:px-10 sm:py-5 sm:text-lg md:px-8 md:py-4 md:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <span className="relative flex items-center justify-center gap-2 whitespace-nowrap text-primary-foreground font-bold tracking-wide sm:gap-3">
                Book a Free AI Discovery Call
                <svg className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.a>
            <motion.a
              href="/about"
              className="group px-8 py-5 rounded-2xl font-semibold text-lg border border-border/60 hover:border-primary/40 transition-all text-muted-foreground hover:text-foreground md:py-4 md:text-base"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="flex items-center gap-2">
                How we work
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.a>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-32 text-xs text-muted-foreground md:mb-12"
          >
            <span className="flex items-center gap-2">
              <img src={hiveLogo} alt="HIVE" width="96" height="24" loading="lazy" decoding="async" className="h-6 w-auto rounded-sm" />
              Incubated at HIVE · Anurag University
            </span>
            <span className="text-border/60">|</span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-primary" />
              </span>
              Production-ready AI · Not demos
            </span>
            <span className="text-border/60">|</span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-accent" />
              </span>
              Built for Indian businesses
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 md:bottom-5"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground tracking-widest uppercase">{t('hero.scroll')}</span>
            <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 10, 0], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-3 rounded-full bg-primary"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

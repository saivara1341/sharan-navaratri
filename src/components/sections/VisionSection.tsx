import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Network, Lightbulb, Waypoints, Zap } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const statCounterVariants = {
  hidden: { opacity: 0, scale: 0.5, rotateY: 90 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.6,
      delay: 0.8 + i * 0.15,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
};

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const palettes = [
    {
      glow: 'hsl(25 85% 55% / 0.18)',
      icon: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 dark:bg-orange-500/15',
      rail: 'bg-orange-500',
      wash: 'linear-gradient(135deg, hsl(35 90% 92% / 0.72), hsl(42 20% 92% / 0.88))',
      darkWash: 'linear-gradient(135deg, hsl(24 44% 13% / 0.94), hsl(20 18% 7% / 0.96))',
    },
    {
      glow: 'hsl(205 85% 55% / 0.18)',
      icon: 'bg-sky-500/15 text-sky-800 dark:text-sky-300 dark:bg-sky-500/15',
      rail: 'bg-sky-500',
      wash: 'linear-gradient(135deg, hsl(205 85% 92% / 0.72), hsl(42 20% 92% / 0.88))',
      darkWash: 'linear-gradient(135deg, hsl(210 52% 14% / 0.94), hsl(215 22% 8% / 0.96))',
    },
    {
      glow: 'hsl(275 70% 55% / 0.18)',
      icon: 'bg-violet-500/15 text-violet-800 dark:text-violet-300 dark:bg-violet-500/15',
      rail: 'bg-violet-500',
      wash: 'linear-gradient(135deg, hsl(275 70% 93% / 0.72), hsl(42 20% 92% / 0.88))',
      darkWash: 'linear-gradient(135deg, hsl(270 44% 15% / 0.94), hsl(260 22% 8% / 0.96))',
    },
    {
      glow: 'hsl(155 65% 42% / 0.18)',
      icon: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 dark:bg-emerald-500/15',
      rail: 'bg-emerald-500',
      wash: 'linear-gradient(135deg, hsl(155 65% 92% / 0.72), hsl(42 20% 92% / 0.88))',
      darkWash: 'linear-gradient(135deg, hsl(156 46% 12% / 0.94), hsl(160 20% 7% / 0.96))',
    },
  ];
  const palette = palettes[index % palettes.length];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="relative group cursor-pointer perspective-1000 h-full"
    >
      <div
        className={`glass-card bg-[image:var(--feature-wash)] p-6 sm:p-10 h-full min-h-[330px] sm:min-h-[460px] transition-all duration-500 dark:bg-[image:var(--feature-wash-dark)] ${isHovered ? 'electric-border' : ''}`}
        style={{
          '--feature-wash': palette.wash,
          '--feature-wash-dark': palette.darkWash,
        } as React.CSSProperties}
      >
        {/* Glow effect */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${palette.glow} 0%, transparent 62%)`,
          }}
        />

        {/* Icon */}
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0
          }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${palette.icon} group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.14)]`}
        >
          {feature.icon}
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-3 text-foreground">
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>

        {/* Hover indicator */}
        <motion.div
          animate={{
            width: isHovered ? '100%' : '0%',
            opacity: isHovered ? 1 : 0
          }}
          className={`absolute bottom-0 left-0 h-0.5 ${palette.rail}`}
        />
      </div>
    </motion.div>
  );
};

const PinnedFeatureCard = ({
  feature,
  index,
  activeIndex,
}: {
  feature: any;
  index: number;
  activeIndex: number;
}) => {
  const isActive = index === activeIndex;
  const isStacked = index < activeIndex;
  const stackDepth = activeIndex - index;
  const isVisible = isActive || isStacked;

  return (
    <motion.div
      className="absolute inset-0 flex items-start justify-center"
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isStacked ? stackDepth * 18 : isActive ? 0 : 120,
        scale: isStacked ? 1 - stackDepth * 0.035 : isActive ? 1 : 0.94,
      }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        zIndex: isVisible ? index + 1 : 0,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      aria-hidden={!isVisible}
    >
      <div
        className="w-full max-w-4xl bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          boxShadow: `0 ${24 + index * 8}px ${60 + index * 8}px hsl(240 10% 5% / ${0.14 + index * 0.03})`,
        }}
      >
        <FeatureCard feature={feature} index={index} />
      </div>
    </motion.div>
  );
};



export const VisionSection = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const features = [
    {
      icon: <Network className="w-8 h-8" />,
      title: t('vision.features.ai.title'),
      description: t('vision.features.ai.description'),
      color: 'primary',
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: t('vision.features.genAi.title'),
      description: t('vision.features.genAi.description'),
      color: 'accent',
    },
    {
      icon: <Waypoints className="w-8 h-8" />,
      title: t('vision.features.agenticAi.title'),
      description: t('vision.features.agenticAi.description'),
      color: 'primary',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('vision.features.automation.title'),
      description: t('vision.features.automation.description'),
      color: 'accent',
    },
  ];

  const stats = [
    { value: 'AI', label: t('vision.mission.stats.powered') },
    { value: '100%', label: t('vision.mission.stats.productionReady') },
    { value: '∞', label: t('vision.mission.stats.scalable') },
    { value: '24/7', label: t('vision.mission.stats.autonomous') },
  ];

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const releaseBuffer = 0.08;
    const cardProgress = Math.min(1, latest / (1 - releaseBuffer));
    const nextIndex = Math.min(features.length - 1, Math.max(0, Math.floor(cardProgress * features.length)));
    setActiveFeatureIndex(nextIndex);
  });



  return (
    <section id="vision" className="bg-background py-32 relative overflow-visible" ref={ref}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 rounded-full blur-[150px]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[150px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-20"
        >
          <motion.span
            className="inline-block text-primary font-medium text-sm tracking-[0.3em] uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('vision.title')}
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-foreground">
            {t('vision.beyondPrototypes')}{' '}
            <span className="gradient-text glow-text">{t('vision.intoProduction')}</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            <Trans
              i18nKey="vision.visionDescription"
              components={[
                <span className="text-primary font-medium" />
              ]}
            />
          </p>
        </motion.div>

        {/* Mobile-only sticky scroll stack for AI capability cards */}
        <motion.div
          ref={containerRef} 
          className="relative mt-8 h-[300svh] md:hidden"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="sticky top-36 h-[calc(100svh-10rem)]">
            {features.map((feature, index) => (
              <PinnedFeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                activeIndex={activeFeatureIndex}
              />
            ))}
          </div>
        </motion.div>

        {/* Desktop/tablet cards scroll normally */}
        <motion.div
          className="mt-20 hidden grid-cols-2 gap-8 md:grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={cardVariants} className="h-full">
              <div className="h-full rounded-2xl border border-border/50 bg-card shadow-xl">
                <FeatureCard feature={feature} index={index} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-24 relative"
        >
          <div className="glass-card electric-border p-10 md:p-14 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/15 to-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-br from-accent/10 to-primary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <span className="text-accent font-medium text-sm tracking-[0.3em] uppercase mb-4 block">
                  {t('vision.mission.subtitle')}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-foreground">
                  <Trans
                    i18nKey="vision.mission.title"
                    components={[
                      <span className="text-primary font-bold" />
                    ]}
                  />
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {t('vision.mission.description')}
                </p>
              </div>

              <div className="flex-shrink-0 grid grid-cols-2 gap-8 perspective-1000">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center group relative"
                    custom={index}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={statCounterVariants}
                    whileHover={{
                      scale: 1.15,
                      rotateY: 10,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Glow backdrop on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <motion.div
                      className="text-4xl font-bold gradient-text mb-2 relative z-10"
                      animate={{
                        textShadow: [
                          "0 0 0px transparent",
                          "0 0 0px transparent",
                          "0 0 0px transparent"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-muted-foreground relative z-10">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
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

export const LotusEmblem = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <g transform="translate(50, 50)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <path
          key={i}
          d="M 0 -38 C 10 -24, 16 -12, 0 0 C -16 -12, -10 -24, 0 -38 Z"
          fill={color}
          fillOpacity="0.25"
          stroke={color}
          strokeWidth="1.2"
          transform={`rotate(${angle})`}
        />
      ))}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
        <path
          key={`inner-${i}`}
          d="M 0 -26 C 6 -16, 10 -8, 0 0 C -10 -8, -6 -16, 0 -26 Z"
          fill={color}
          fillOpacity="0.5"
          stroke={color}
          strokeWidth="1"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r="6" fill={color} fillOpacity="0.9" />
      <circle r="2.5" fill="#ffffff" />
    </g>
  </svg>
);

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
    x.set((e.clientX - centerX) * 0.08);
    y.set((e.clientY - centerY) * 0.08);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const palettes = [
    {
      glow: 'hsl(25 95% 55% / 0.28)',
      border: 'rgba(249, 115, 22, 0.45)',
      borderHover: 'rgba(249, 115, 22, 0.9)',
      accentColor: '#f97316',
      iconBg: 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_25px_rgba(249,115,22,0.35)]',
      bgGradient: 'linear-gradient(145deg, rgba(28, 16, 10, 0.92) 0%, rgba(16, 10, 22, 0.95) 100%)',
      lotusColor: '#f97316',
    },
    {
      glow: 'hsl(205 95% 55% / 0.28)',
      border: 'rgba(14, 165, 233, 0.45)',
      borderHover: 'rgba(14, 165, 233, 0.9)',
      accentColor: '#0ea5e9',
      iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-[0_0_25px_rgba(14,165,233,0.35)]',
      bgGradient: 'linear-gradient(145deg, rgba(8, 22, 36, 0.92) 0%, rgba(6, 12, 24, 0.95) 100%)',
      lotusColor: '#0ea5e9',
    },
    {
      glow: 'hsl(275 85% 62% / 0.28)',
      border: 'rgba(168, 85, 247, 0.45)',
      borderHover: 'rgba(168, 85, 247, 0.9)',
      accentColor: '#a855f7',
      iconBg: 'bg-violet-500/20 text-violet-400 border border-violet-500/40 shadow-[0_0_25px_rgba(168,85,247,0.35)]',
      bgGradient: 'linear-gradient(145deg, rgba(24, 10, 36, 0.92) 0%, rgba(12, 8, 22, 0.95) 100%)',
      lotusColor: '#a855f7',
    },
    {
      glow: 'hsl(155 80% 48% / 0.28)',
      border: 'rgba(16, 185, 129, 0.45)',
      borderHover: 'rgba(16, 185, 129, 0.9)',
      accentColor: '#10b981',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.35)]',
      bgGradient: 'linear-gradient(145deg, rgba(8, 26, 18, 0.92) 0%, rgba(6, 14, 12, 0.95) 100%)',
      lotusColor: '#10b981',
    },
  ];
  const palette = palettes[index % palettes.length];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="relative group cursor-pointer w-full max-w-[540px] mx-auto filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
    >
      {/* Sleek Modern Card Body */}
      <div
        className="relative w-full min-h-[380px] sm:min-h-[420px] px-6 sm:px-12 py-8 sm:py-12 flex flex-col items-center justify-center text-center transition-all duration-500 rounded-3xl overflow-hidden border backdrop-blur-2xl"
        style={{
          background: palette.bgGradient,
          borderColor: isHovered ? palette.borderHover : palette.border,
          boxShadow: isHovered
            ? `0 0 35px ${palette.glow}, inset 0 0 20px ${palette.glow}`
            : `0 0 15px ${palette.glow}`,
        }}
      >
        {/* Subtle Decorative Indian Geometric Corner Accents */}
        <div className="absolute top-3 left-3 flex items-center gap-1 opacity-60 pointer-events-none">
          <span className="w-1.5 h-1.5 rotate-45 border" style={{ borderColor: palette.accentColor, backgroundColor: isHovered ? palette.accentColor : 'transparent' }} />
          <span className="w-4 h-[1px]" style={{ backgroundColor: palette.accentColor }} />
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-60 pointer-events-none">
          <span className="w-4 h-[1px]" style={{ backgroundColor: palette.accentColor }} />
          <span className="w-1.5 h-1.5 rotate-45 border" style={{ borderColor: palette.accentColor, backgroundColor: isHovered ? palette.accentColor : 'transparent' }} />
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 opacity-60 pointer-events-none">
          <span className="w-1.5 h-1.5 rotate-45 border" style={{ borderColor: palette.accentColor, backgroundColor: isHovered ? palette.accentColor : 'transparent' }} />
          <span className="w-4 h-[1px]" style={{ backgroundColor: palette.accentColor }} />
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-60 pointer-events-none">
          <span className="w-4 h-[1px]" style={{ backgroundColor: palette.accentColor }} />
          <span className="w-1.5 h-1.5 rotate-45 border" style={{ borderColor: palette.accentColor, backgroundColor: isHovered ? palette.accentColor : 'transparent' }} />
        </div>

        {/* Inner Radial Glow */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0.6 }}
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${palette.glow} 0%, transparent 70%)`,
          }}
        />

        {/* Lotus Emblem Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <LotusEmblem className="w-56 h-56 sm:w-64 sm:h-64" color={palette.lotusColor} />
        </div>

        {/* Feature Eyebrow Tag with Lotus Accent */}
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <span className="text-[9px] rotate-45" style={{ color: palette.accentColor }}>◆</span>
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.24em]" style={{ color: palette.accentColor }}>
            Pillar 0{index + 1}
          </span>
          <span className="text-[9px] rotate-45" style={{ color: palette.accentColor }}>◆</span>
        </div>

        {/* Icon with Glowing Frame */}
        <div className="relative mb-3.5 sm:mb-4 z-10">
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${palette.iconBg}`}
          >
            {feature.icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-2xl font-black mb-2 text-white tracking-tight max-w-sm drop-shadow-md relative z-10">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs sm:max-w-sm mx-auto mb-4 font-normal relative z-10">
          {feature.description}
        </p>

        {/* Bottom Status / Feature Pill with Diamond */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-[10px] sm:text-[11px] font-semibold backdrop-blur-md shadow-inner relative z-10">
          <span className="w-1.5 h-1.5 rotate-45" style={{ background: palette.accentColor }} />
          <span>Production-Ready Deep-Tech</span>
        </div>
      </div>
    </motion.div>
  );
};

// Smooth continuous scroll stack card wrapper
const ScrollStackedCard = ({
  feature,
  index,
  total,
  scrollYProgress,
}: {
  feature: any;
  index: number;
  total: number;
  scrollYProgress: any;
}) => {
  // Compute progress slice for this card
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  // Scale down as later cards enter
  const scale = useTransform(
    scrollYProgress,
    [start, end, Math.min(1, end + step)],
    [1, 1, 1 - (total - 1 - index) * 0.04]
  );

  // Stacked offset
  const translateY = useTransform(
    scrollYProgress,
    [Math.max(0, start - step * 0.5), start, 1],
    [index === 0 ? 0 : 80, 0, (total - 1 - index) * -8]
  );

  // Opacity for stacked effect
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - step * 0.8), start],
    [index === 0 ? 1 : 0.2, 1]
  );

  return (
    <motion.div
      style={{
        scale,
        y: translateY,
        opacity,
        zIndex: index + 1,
      }}
      className="sticky top-28 md:top-36 w-full flex items-center justify-center mb-12"
    >
      <FeatureCard feature={feature} index={index} />
    </motion.div>
  );
};

export const VisionSection = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const scrollStackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollStackRef,
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

  return (
    <section id="vision" className="bg-background py-16 sm:py-28 relative overflow-visible" ref={ref}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 rounded-full blur-[150px]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[150px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Vision Header Text with Lotus Motif */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <motion.div
            className="inline-flex items-center gap-2 text-primary font-bold text-xs md:text-sm tracking-[0.3em] uppercase mb-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LotusEmblem className="w-4 h-4" color="currentColor" />
            <span>{t('vision.title')}</span>
            <LotusEmblem className="w-4 h-4" color="currentColor" />
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight text-foreground">
            {t('vision.beyondPrototypes')}{' '}
            <span className="gradient-text glow-text">{t('vision.intoProduction')}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            <Trans
              i18nKey="vision.visionDescription"
              components={[
                <span className="text-primary font-semibold" key="desc-highlight" />
              ]}
            />
          </p>
        </motion.div>

        {/* Continuous Sticky Stack Scroll Deck for Capability Cards */}
        <div ref={scrollStackRef} className="relative w-full max-w-2xl mx-auto min-h-[220vh] pb-24">
          {features.map((feature, index) => (
            <ScrollStackedCard
              key={feature.title}
              feature={feature}
              index={index}
              total={features.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

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

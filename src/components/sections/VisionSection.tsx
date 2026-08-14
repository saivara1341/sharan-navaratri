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

const INDIAN_CARTOUCHE_100 = "M 50 2 C 48 4, 46 7, 43 7.5 C 34 8.5, 26 12.5, 20 17.5 C 17 20, 14 24, 11 28 C 8 33, 7.5 39, 7.5 43 C 7 46, 4 48, 2 50 C 4 52, 7 54, 7.5 57 C 7.5 61, 8 67, 11 72 C 14 76, 17 80, 20 82.5 C 26 87.5, 34 91.5, 43 92.5 C 46 93, 48 96, 50 98 C 52 96, 54 93, 57 92.5 C 66 91.5, 74 87.5, 80 82.5 C 83 80, 86 76, 89 72 C 92 67, 92.5 61, 92.5 57 C 93 54, 96 52, 98 50 C 96 48, 93 46, 92.5 43 C 92.5 39, 92 33, 89 28 C 86 24, 83 20, 80 17.5 C 74 12.5, 66 8.5, 57 7.5 C 54 7, 52 4, 50 2 Z";
const INDIAN_CARTOUCHE_CLIP = "M 0.50 0.02 C 0.48 0.04, 0.46 0.07, 0.43 0.075 C 0.34 0.085, 0.26 0.125, 0.20 0.175 C 0.17 0.20, 0.14 0.24, 0.11 0.28 C 0.08 0.33, 0.075 0.39, 0.075 0.43 C 0.07 0.46, 0.04 0.48, 0.02 0.50 C 0.04 0.52, 0.07 0.54, 0.075 0.57 C 0.075 0.61, 0.08 0.67, 0.11 0.72 C 0.14 0.76, 0.17 0.80, 0.20 0.825 C 0.26 0.875, 0.34 0.915, 0.43 0.925 C 0.46 0.93, 0.48 0.96, 0.50 0.98 C 0.52 0.96, 0.54 0.93, 0.57 0.925 C 0.66 0.915, 0.74 0.875, 0.80 0.825 C 0.83 0.80, 0.86 0.76, 0.89 0.72 C 0.92 0.67, 0.925 0.61, 0.925 0.57 C 0.93 0.54, 0.96 0.52, 0.98 0.50 C 0.96 0.48, 0.93 0.46, 0.925 0.43 C 0.925 0.39, 0.92 0.33, 0.89 0.28 C 0.86 0.24, 0.83 0.20, 0.80 0.175 C 0.74 0.125, 0.66 0.085, 0.57 0.075 C 0.54 0.07, 0.52 0.04, 0.50 0.02 Z";
const INNER_DASHED_CARTOUCHE_100 = "M 50 6 C 48 8, 46 11, 42 11.5 C 34 12.5, 28 16, 22 20.5 C 19.5 22.5, 17 26, 14.5 30 C 12 34, 11.5 39, 11.5 42 C 11 45, 8 48, 6 50 C 8 52, 11 55, 11.5 58 C 11.5 61, 12 66, 14.5 70 C 17 74, 19.5 77.5, 22 79.5 C 28 84, 34 87.5, 42 88.5 C 46 89, 48 92, 50 94 C 52 92, 54 89, 58 88.5 C 66 87.5, 72 84, 78 79.5 C 80.5 77.5, 83 74, 85.5 70 C 88 66, 88.5 61, 88.5 58 C 89 55, 92 52, 94 50 C 92 48, 89 45, 88.5 42 C 88.5 39, 88 34, 85.5 30 C 83 26, 80.5 22.5, 78 20.5 C 72 16, 66 12.5, 58 11.5 C 54 11, 52 8, 50 6 Z";

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
      glow: 'hsl(25 95% 55% / 0.32)',
      border: '#f97316',
      borderInner: '#fdba74',
      accentColor: '#f97316',
      iconBg: 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_25px_rgba(249,115,22,0.4)]',
      bgGradient: 'linear-gradient(145deg, rgba(30, 18, 10, 0.98) 0%, rgba(15, 10, 18, 0.98) 100%)',
      lotusColor: '#f97316',
    },
    {
      glow: 'hsl(205 95% 55% / 0.32)',
      border: '#0ea5e9',
      borderInner: '#7dd3fc',
      accentColor: '#0ea5e9',
      iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-[0_0_25px_rgba(14,165,233,0.4)]',
      bgGradient: 'linear-gradient(145deg, rgba(8, 24, 38, 0.98) 0%, rgba(6, 12, 22, 0.98) 100%)',
      lotusColor: '#0ea5e9',
    },
    {
      glow: 'hsl(275 85% 62% / 0.32)',
      border: '#a855f7',
      borderInner: '#d8b4fe',
      accentColor: '#a855f7',
      iconBg: 'bg-violet-500/20 text-violet-400 border border-violet-500/40 shadow-[0_0_25px_rgba(168,85,247,0.4)]',
      bgGradient: 'linear-gradient(145deg, rgba(26, 12, 38, 0.98) 0%, rgba(12, 8, 20, 0.98) 100%)',
      lotusColor: '#a855f7',
    },
    {
      glow: 'hsl(155 80% 48% / 0.32)',
      border: '#10b981',
      borderInner: '#6ee7b7',
      accentColor: '#10b981',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.4)]',
      bgGradient: 'linear-gradient(145deg, rgba(8, 28, 20, 0.98) 0%, rgba(6, 14, 12, 0.98) 100%)',
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
      className="relative group cursor-pointer w-full max-w-[560px] mx-auto filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.65)]"
    >
      {/* Outer SVG Arch Border with Royal Indian Architectural Outline */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-30 transition-all duration-500"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Outer Primary Architectural Border */}
        <path
          d={INDIAN_CARTOUCHE_100}
          fill="none"
          stroke={palette.border}
          strokeWidth={isHovered ? "2.4" : "1.8"}
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-500"
        />
        {/* Inner Dashed Concentric Arch Inset from Indian Wedding Cartouche */}
        <path
          d={INNER_DASHED_CARTOUCHE_100}
          fill="none"
          stroke={palette.borderInner}
          strokeWidth="1"
          strokeDasharray="3 2"
          vectorEffect="non-scaling-stroke"
          className="opacity-80 transition-all duration-500"
        />
      </svg>

      {/* 4 Cardinal Diamond Rhombus / Finial Pins (Top, Bottom, Left, Right) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
        <span
          className="block w-3.5 h-3.5 rotate-45 border border-white/70 shadow-lg transition-transform duration-500 group-hover:scale-125"
          style={{ background: palette.accentColor, boxShadow: `0 0 14px ${palette.accentColor}` }}
        />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-40">
        <span
          className="block w-3.5 h-3.5 rotate-45 border border-white/70 shadow-lg transition-transform duration-500 group-hover:scale-125"
          style={{ background: palette.accentColor, boxShadow: `0 0 14px ${palette.accentColor}` }}
        />
      </div>
      <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
        <span
          className="block w-3 h-3 rotate-45 border border-white/70 shadow-lg transition-transform duration-500 group-hover:scale-125"
          style={{ background: palette.accentColor, boxShadow: `0 0 10px ${palette.accentColor}` }}
        />
      </div>
      <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-40">
        <span
          className="block w-3 h-3 rotate-45 border border-white/70 shadow-lg transition-transform duration-500 group-hover:scale-125"
          style={{ background: palette.accentColor, boxShadow: `0 0 10px ${palette.accentColor}` }}
        />
      </div>

      {/* Clipped Card Body */}
      <div
        className="relative w-full h-[440px] sm:h-[470px] px-8 sm:px-14 py-12 sm:py-14 flex flex-col items-center justify-center text-center transition-all duration-500 backdrop-blur-2xl"
        style={{
          clipPath: 'url(#vision-cartouche-shape)',
          WebkitClipPath: 'url(#vision-cartouche-shape)',
          background: palette.bgGradient,
        }}
      >
        {/* Inner Radial Glow */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0.65 }}
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${palette.glow} 0%, transparent 68%)`,
          }}
        />

        {/* Lotus Emblem Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <LotusEmblem className="w-64 h-64" color={palette.lotusColor} />
        </div>

        {/* Feature Eyebrow Tag with Lotus Accent */}
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <span className="text-[9px] rotate-45" style={{ color: palette.accentColor }}>◆</span>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em]" style={{ color: palette.accentColor }}>
            Pillar 0{index + 1}
          </span>
          <span className="text-[9px] rotate-45" style={{ color: palette.accentColor }}>◆</span>
        </div>

        {/* Icon with Lotus Frame */}
        <div className="relative mb-4 sm:mb-5 z-10">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${palette.iconBg}`}
          >
            {feature.icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black mb-2.5 text-white tracking-tight max-w-sm drop-shadow-md relative z-10">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs sm:max-w-sm mx-auto mb-4 font-normal relative z-10">
          {feature.description}
        </p>

        {/* Bottom Status / Feature Pill with Diamond */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-[11px] font-semibold backdrop-blur-md shadow-inner relative z-10">
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
    <section id="vision" className="bg-background py-28 relative overflow-visible" ref={ref}>
      {/* Hidden SVG Definitions for Royal Indian Cartouche ClipPath */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="vision-cartouche-shape" clipPathUnits="objectBoundingBox">
            <path d={INDIAN_CARTOUCHE_CLIP} />
          </clipPath>
        </defs>
      </svg>

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

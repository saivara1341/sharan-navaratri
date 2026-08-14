import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Network, Lightbulb, Waypoints, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

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

const FeatureCard = ({ feature, index, isMobileCard = false }: { feature: any; index: number; isMobileCard?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobileCard) return;
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
      glow: 'hsl(25 95% 55% / 0.22)',
      accent: '#f97316',
      accentSoft: 'rgba(249,115,22,0.15)',
      iconBg: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
      bgGradient: 'linear-gradient(135deg, rgba(24,14,6,0.97) 0%, rgba(12,8,18,0.97) 100%)',
      stripGrad: 'linear-gradient(90deg, #f97316, #fb923c)',
    },
    {
      glow: 'hsl(205 95% 55% / 0.22)',
      accent: '#0ea5e9',
      accentSoft: 'rgba(14,165,233,0.15)',
      iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/40',
      bgGradient: 'linear-gradient(135deg, rgba(6,18,30,0.97) 0%, rgba(5,10,20,0.97) 100%)',
      stripGrad: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
    },
    {
      glow: 'hsl(275 85% 62% / 0.22)',
      accent: '#a855f7',
      accentSoft: 'rgba(168,85,247,0.15)',
      iconBg: 'bg-violet-500/20 text-violet-400 border border-violet-500/40',
      bgGradient: 'linear-gradient(135deg, rgba(20,8,32,0.97) 0%, rgba(10,6,18,0.97) 100%)',
      stripGrad: 'linear-gradient(90deg, #a855f7, #c084fc)',
    },
    {
      glow: 'hsl(155 80% 48% / 0.22)',
      accent: '#10b981',
      accentSoft: 'rgba(16,185,129,0.15)',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
      bgGradient: 'linear-gradient(135deg, rgba(5,22,14,0.97) 0%, rgba(4,12,10,0.97) 100%)',
      stripGrad: 'linear-gradient(90deg, #10b981, #34d399)',
    },
  ];
  const palette = palettes[index % palettes.length];

  if (isMobileCard) {
    // Clean modern card for mobile — no clip-path, no cartouche
    return (
      <div
        className="relative w-full overflow-hidden rounded-3xl select-none"
        style={{
          background: palette.bgGradient,
          boxShadow: `0 0 0 1.5px ${palette.accent}40, 0 8px 32px rgba(0,0,0,0.5), 0 0 60px ${palette.accent}18`,
        }}
      >
        {/* Top accent colour strip */}
        <div className="h-1 w-full rounded-t-3xl" style={{ background: palette.stripGrad }} />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${palette.glow} 0%, transparent 70%)` }}
        />

        {/* Lotus watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
          <LotusEmblem className="w-52 h-52" color={palette.accent} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-6 pb-7">
          {/* Pillar eyebrow */}
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-[7px] rotate-45" style={{ color: palette.accent }}>◆</span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.22em]" style={{ color: palette.accent }}>
              Pillar 0{index + 1}
            </span>
            <span className="text-[7px] rotate-45" style={{ color: palette.accent }}>◆</span>
          </div>

          {/* Icon */}
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${palette.iconBg}`}>
            {feature.icon}
          </div>

          {/* Title */}
          <h3 className="text-lg font-black text-white tracking-tight leading-snug mb-3">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-xs leading-relaxed mb-5 max-w-[260px] mx-auto">
            {feature.description}
          </p>

          {/* Bottom pill */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold"
            style={{
              background: palette.accentSoft,
              border: `1px solid ${palette.accent}40`,
              color: palette.accent,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: palette.accent }} />
            Production-Ready Deep-Tech
          </div>
        </div>

        {/* Bottom accent strip */}
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}60, transparent)` }} />
      </div>
    );
  }

  // Desktop card keeps the original cartouche design
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="relative group cursor-pointer w-full max-w-[340px] sm:max-w-[480px] mx-auto filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)] select-none"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 transition-all duration-500" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={INDIAN_CARTOUCHE_100} fill="none" stroke={palettes[index % palettes.length].accent} strokeWidth={isHovered ? "2.2" : "1.6"} vectorEffect="non-scaling-stroke" className="transition-all duration-500 opacity-90" />
        <path d={INNER_DASHED_CARTOUCHE_100} fill="none" stroke={palettes[index % palettes.length].accentSoft.replace('0.15)', '0.6)')} strokeWidth="1" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" className="opacity-75 transition-all duration-500" />
      </svg>
      {[{pos:'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',s:'w-3 h-3'},{pos:'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',s:'w-3 h-3'},{pos:'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2',s:'w-2.5 h-2.5'},{pos:'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',s:'w-2.5 h-2.5'}].map(({pos,s},i)=>(
        <div key={i} className={`absolute ${pos} z-40`}>
          <span className={`block ${s} rotate-45 border border-white/70 shadow-sm transition-transform duration-500 group-hover:scale-110`} style={{ background: palette.accent }} />
        </div>
      ))}
      <div
        className="relative w-full h-[360px] sm:h-[430px] px-6 sm:px-12 py-6 sm:py-10 flex flex-col items-center justify-center text-center transition-all duration-500 backdrop-blur-2xl overflow-hidden"
        style={{ clipPath: 'url(#vision-cartouche-shape)', WebkitClipPath: 'url(#vision-cartouche-shape)', background: palette.bgGradient }}
      >
        <motion.div animate={{ opacity: isHovered ? 0.6 : 0.3 }} className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 30%, ${palette.glow} 0%, transparent 68%)` }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <LotusEmblem className="w-48 h-48 sm:w-64 sm:h-64" color={palette.accent} />
        </div>
        <div className="relative z-10 w-full max-w-[220px] sm:max-w-[320px] mx-auto flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[8px] rotate-45" style={{ color: palette.accent }}>◆</span>
            <span className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: palette.accent }}>Pillar 0{index + 1}</span>
            <span className="text-[8px] rotate-45" style={{ color: palette.accent }}>◆</span>
          </div>
          <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 ${palette.iconBg}`}>{feature.icon}</div>
          <h3 className="text-base sm:text-xl md:text-2xl font-black mb-1 sm:mb-2 text-white tracking-tight leading-tight">{feature.title}</h3>
          <p className="text-slate-300 text-[11px] sm:text-xs leading-snug sm:leading-relaxed max-w-[210px] sm:max-w-[290px] mx-auto mb-2.5 sm:mb-3.5 line-clamp-3 sm:line-clamp-none">{feature.description}</p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-[9px] sm:text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: palette.accent }} />
            Production-Ready Deep-Tech
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Smooth continuous scroll stack card wrapper inside pinned viewport
const StackedDeckCard = ({
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
  // Stagger entrance based on scroll progress (0 to 0.88, leaving 0.88-1.0 for final view before scrolling onward)
  const interval = 0.88 / total;
  const start = index * interval;
  const end = (index + 1) * interval;

  // Translation Y: enters from bottom (index > 0) and settles into stack
  const y = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 1]
      : [Math.max(0, start - 0.05), start + 0.04, 1],
    index === 0
      ? [0, (total - 1) * -8]
      : [280, (total - 1 - index) * -8, (total - 1 - index) * -8]
  );

  // Scale down earlier cards slightly as new ones arrive
  const scale = useTransform(
    scrollYProgress,
    [start, Math.min(0.92, end + 0.1)],
    [1, 1 - (total - 1 - index) * 0.035]
  );

  // Opacity: smoothly fades in as card reaches its slot
  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 0.5, 0.9]
      : [Math.max(0, start - 0.06), start, Math.min(1, start + 0.06)],
    index === 0
      ? [1, 0.85, 0.5]
      : [0, 0.5, 1]
  );

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity: index === total - 1 ? 1 : opacity,
        zIndex: index + 10,
      }}
      className="absolute inset-0 flex items-center justify-center pointer-events-auto"
    >
      <FeatureCard feature={feature} index={index} />
    </motion.div>
  );
};

const DeckDot = ({
  idx,
  total,
  scrollYProgress,
}: {
  idx: number;
  total: number;
  scrollYProgress: any;
}) => {
  const interval = 0.88 / total;
  const start = idx * interval;
  const end = (idx + 1) * interval;

  const width = useTransform(
    scrollYProgress,
    idx === 0
      ? [0, end, end + 0.05]
      : [Math.max(0, start - 0.04), start, end, Math.min(1, end + 0.04)],
    idx === 0
      ? ['28px', '28px', '14px']
      : ['14px', '28px', '28px', '14px']
  );

  const opacity = useTransform(
    scrollYProgress,
    idx === 0
      ? [0, end, end + 0.05]
      : [Math.max(0, start - 0.04), start, end, Math.min(1, end + 0.04)],
    idx === 0
      ? [1, 1, 0.35]
      : [0.35, 1, 1, 0.35]
  );

  return (
    <motion.div
      style={{
        width,
        opacity,
      }}
      className="h-1.5 rounded-full bg-primary"
    />
  );
};

import { ChevronLeft, ChevronRight, Network, Lightbulb, Waypoints, Zap } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Mobile Touch & Swipe Interactive Deck
const MobileVisionDeck = ({ features }: { features: any[] }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance every 4 seconds unless paused by user interaction
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIdx((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [paused, features.length]);

  // Pause auto-advance for 8s after user interaction, then resume
  const handleUserInteraction = () => {
    setPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setPaused(false), 8000);
  };

  const paginate = (newDirection: number) => {
    handleUserInteraction();
    setDirection(newDirection);
    setActiveIdx((prev) => {
      const next = prev + newDirection;
      if (next < 0) return features.length - 1;
      if (next >= features.length) return 0;
      return next;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 160 : -160,
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 160 : -160,
      opacity: 0,
      scale: 0.92,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="w-full flex flex-col items-center py-2 md:hidden">
      {/* Pillar Tabs */}
      <div className="flex items-center justify-center gap-1.5 mb-4 overflow-x-auto max-w-full px-2 py-1">
        {features.map((f, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={f.title}
              onClick={() => {
                setDirection(i > activeIdx ? 1 : -1);
                setActiveIdx(i);
                handleUserInteraction();
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap border ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(245,158,11,0.35)] scale-105'
                  : 'bg-card/80 text-muted-foreground border-border/70'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Pillar 0{i + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Swipeable Card Container */}
      <div className="relative w-full max-w-[320px] flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIdx}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragStart={handleUserInteraction}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -50 || offset.x < -45) paginate(1);
              else if (swipe > 50 || offset.x > 45) paginate(-1);
            }}
            className="w-full touch-pan-y"
          >
            <FeatureCard feature={features[activeIdx]} index={activeIdx} isMobileCard={true} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation row: prev • dots • next */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => paginate(-1)}
          aria-label="Previous"
          className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > activeIdx ? 1 : -1);
                setActiveIdx(i);
                handleUserInteraction();
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? 'w-6 bg-primary shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  : 'w-2 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          aria-label="Next"
          className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground active:scale-90 transition-transform"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Auto-play indicator */}
      {!paused && (
        <div className="mt-2 flex items-center gap-1 text-muted-foreground/50 text-[10px]">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 rounded-full bg-primary"
          />
          <span>Auto-advancing</span>
        </div>
      )}
    </div>
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
      icon: <Network className="w-5 h-5 sm:w-7 sm:h-7" />,
      title: t('vision.features.ai.title'),
      description: t('vision.features.ai.description'),
      color: 'primary',
    },
    {
      icon: <Lightbulb className="w-5 h-5 sm:w-7 sm:h-7" />,
      title: t('vision.features.genAi.title'),
      description: t('vision.features.genAi.description'),
      color: 'accent',
    },
    {
      icon: <Waypoints className="w-5 h-5 sm:w-7 sm:h-7" />,
      title: t('vision.features.agenticAi.title'),
      description: t('vision.features.agenticAi.description'),
      color: 'primary',
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-7 sm:h-7" />,
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
    <section id="vision" className="bg-background relative overflow-visible py-12 md:py-0" ref={ref}>
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

      {/* MOBILE EXPERIENCE: Interactive Fluid Swipe & Tab Deck */}
      <div className="block md:hidden container mx-auto px-4 relative z-10">
        {/* Vision Header */}
        <div className="text-center max-w-xl mx-auto pt-2 mb-4">
          <div className="inline-flex items-center gap-1.5 text-primary font-bold text-[10px] tracking-[0.25em] uppercase mb-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <LotusEmblem className="w-3 h-3" color="currentColor" />
            <span>{t('vision.title')}</span>
            <LotusEmblem className="w-3 h-3" color="currentColor" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black mb-1.5 leading-tight text-foreground">
            {t('vision.beyondPrototypes')}{' '}
            <span className="gradient-text glow-text">{t('vision.intoProduction')}</span>
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto">
            <Trans
              i18nKey="vision.visionDescription"
              components={[
                <span className="text-primary font-semibold" key="desc-highlight" />
              ]}
            />
          </p>
        </div>

        {/* Mobile Deck */}
        <MobileVisionDeck features={features} />
      </div>

      {/* DESKTOP EXPERIENCE: Pinned Scroll Deck Track */}
      <div ref={scrollStackRef} className="hidden md:block relative w-full min-h-[300vh] sm:min-h-[320vh]">
        <div className="sticky top-14 sm:top-16 md:top-20 h-[calc(100vh-5rem)] flex flex-col justify-between items-center py-2 sm:py-4 px-4 overflow-hidden z-20">
          {/* Pinned Vision Header */}
          <div className="text-center max-w-3xl mx-auto shrink-0 pt-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-primary font-bold text-xs md:text-sm tracking-[0.25em] uppercase mb-1 sm:mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <LotusEmblem className="w-3.5 h-3.5" color="currentColor" />
              <span>{t('vision.title')}</span>
              <LotusEmblem className="w-3.5 h-3.5" color="currentColor" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black mb-1 sm:mb-2 leading-tight text-foreground">
              {t('vision.beyondPrototypes')}{' '}
              <span className="gradient-text glow-text">{t('vision.intoProduction')}</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              <Trans
                i18nKey="vision.visionDescription"
                components={[
                  <span className="text-primary font-semibold" key="desc-highlight" />
                ]}
              />
            </p>
          </div>

          {/* Stacked Cards Deck Area */}
          <div className="relative w-full max-w-lg mx-auto flex-1 min-h-[440px] flex items-center justify-center my-auto">
            {features.map((feature, index) => (
              <StackedDeckCard
                key={feature.title}
                feature={feature}
                index={index}
                total={features.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>

          {/* Bottom Pillar Dots Indicator */}
          <div className="flex items-center justify-center gap-2 shrink-0 pb-1 z-30">
            {features.map((_, idx) => (
              <DeckDot
                key={idx}
                idx={idx}
                total={features.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-28">
        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-8 relative"
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

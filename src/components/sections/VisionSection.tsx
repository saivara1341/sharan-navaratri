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

// Exact Royal Indian Cusped Arch Silhouette (Matching reference photo from Wedding Project India)
const INDIAN_JHAROKHA_PATH = "M 50 3 C 47 4.5, 42 7.5, 36 9.5 C 30 11.5, 23 15.5, 20 21 C 16 26, 12 32, 9 38 C 5 44, 5 56, 9 62 C 12 68, 16 74, 20 79 C 23 84.5, 30 88.5, 36 90.5 C 42 92.5, 47 95.5, 50 97 C 53 95.5, 58 92.5, 64 90.5 C 70 88.5, 77 84.5, 80 79 C 84 74, 88 68, 91 62 C 95 56, 95 44, 91 38 C 88 32, 84 26, 80 21 C 77 15.5, 70 11.5, 64 9.5 C 58 7.5, 53 4.5, 50 3 Z";
const INDIAN_JHAROKHA_INNER = "M 50 6.5 C 47.5 8, 43 10.5, 38 12.5 C 32 14.5, 26 18.5, 23 23.5 C 19 28.5, 15 34.5, 12 40 C 9 46, 9 54, 12 60 C 15 65.5, 19 71.5, 23 76.5 C 26 81.5, 32 85.5, 38 87.5 C 43 89.5, 47.5 92, 50 93.5 C 52.5 92, 57 89.5, 62 87.5 C 68 85.5, 74 81.5, 77 76.5 C 81 71.5, 85 65.5, 88 60 C 91 54, 91 46, 88 40 C 85 34.5, 81 28.5, 77 23.5 C 74 18.5, 68 14.5, 62 12.5 C 57 10.5, 52.5 8, 50 6.5 Z";
const INDIAN_JHAROKHA_CLIP = "M 0.50 0.03 C 0.47 0.045, 0.42 0.075, 0.36 0.095 C 0.30 0.115, 0.23 0.155, 0.20 0.21 C 0.16 0.26, 0.12 0.32, 0.09 0.38 C 0.05 0.44, 0.05 0.56, 0.09 0.62 C 0.12 0.68, 0.16 0.74, 0.20 0.79 C 0.23 0.845, 0.30 0.885, 0.36 0.905 C 0.42 0.925, 0.47 0.955, 0.50 0.97 C 0.53 0.955, 0.58 0.925, 0.64 0.905 C 0.70 0.885, 0.77 0.845, 0.80 0.79 C 0.84 0.74, 0.88 0.68, 0.91 0.62 C 0.95 0.56, 0.95 0.44, 0.91 0.38 C 0.88 0.32, 0.84 0.26, 0.80 0.21 C 0.77 0.155, 0.70 0.115, 0.64 0.095 C 0.58 0.075, 0.53 0.045, 0.50 0.03 Z";

// Vintage Filigree Accent Bar
const VintageFiligreeDivider = ({ color = 'currentColor', className = '' }: { color?: string; className?: string }) => (
  <div className={`flex items-center justify-center gap-2 my-2 sm:my-2.5 ${className}`} style={{ color }}>
    <span className="h-px w-8 sm:w-14 bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
    <span className="text-[8px] rotate-45">◆</span>
    <span className="text-[5px]">●</span>
    <span className="text-[8px] rotate-45">◆</span>
    <span className="h-px w-8 sm:w-14 bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
  </div>
);

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
      glow: 'hsl(32 95% 50% / 0.28)',
      accent: '#f59e0b',
      accentLight: '#fde68a',
      accentMuted: 'rgba(245, 158, 11, 0.16)',
      border: '#f59e0b',
      borderInner: '#fde68a',
      iconBg: 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      bgGradient: 'radial-gradient(ellipse at 50% 15%, rgba(48, 26, 8, 0.98) 0%, rgba(20, 11, 5, 0.99) 70%, rgba(10, 6, 3, 1) 100%)',
    },
    {
      glow: 'hsl(205 95% 55% / 0.28)',
      accent: '#38bdf8',
      accentLight: '#bae6fd',
      accentMuted: 'rgba(56, 189, 248, 0.16)',
      border: '#38bdf8',
      borderInner: '#bae6fd',
      iconBg: 'bg-sky-500/20 text-sky-300 border border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.25)]',
      bgGradient: 'radial-gradient(ellipse at 50% 15%, rgba(10, 32, 54, 0.98) 0%, rgba(6, 18, 34, 0.99) 70%, rgba(4, 10, 20, 1) 100%)',
    },
    {
      glow: 'hsl(275 85% 65% / 0.28)',
      accent: '#c084fc',
      accentLight: '#f3e8ff',
      accentMuted: 'rgba(192, 132, 252, 0.16)',
      border: '#c084fc',
      borderInner: '#f3e8ff',
      iconBg: 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-[0_0_20px_rgba(192,132,252,0.25)]',
      bgGradient: 'radial-gradient(ellipse at 50% 15%, rgba(38, 14, 56, 0.98) 0%, rgba(22, 8, 34, 0.99) 70%, rgba(12, 4, 20, 1) 100%)',
    },
    {
      glow: 'hsl(155 80% 50% / 0.28)',
      accent: '#34d399',
      accentLight: '#d1fae5',
      accentMuted: 'rgba(52, 211, 153, 0.16)',
      border: '#34d399',
      borderInner: '#d1fae5',
      iconBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.25)]',
      bgGradient: 'radial-gradient(ellipse at 50% 15%, rgba(8, 40, 24, 0.98) 0%, rgba(5, 24, 15, 0.99) 70%, rgba(3, 14, 9, 1) 100%)',
    },
  ];
  const palette = palettes[index % palettes.length];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={isMobileCard ? undefined : { x: springX, y: springY }}
      className={`relative group cursor-pointer w-full mx-auto select-none filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)] ${
        isMobileCard ? 'max-w-[330px]' : 'max-w-[340px] sm:max-w-[460px]'
      }`}
    >
      {/* Outer SVG Cusped Architectural Arch Border with Metallic Highlight */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-30 transition-all duration-500"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Outer Primary Architectural Border */}
        <path
          d={INDIAN_JHAROKHA_PATH}
          fill="none"
          stroke={palette.border}
          strokeWidth={isHovered ? "2.2" : "1.7"}
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-500 opacity-95"
        />
        {/* Inner Dashed Concentric Arch Inset from Indian Wedding Cartouche */}
        <path
          d={INDIAN_JHAROKHA_INNER}
          fill="none"
          stroke={palette.borderInner}
          strokeWidth="1"
          strokeDasharray="3 2"
          vectorEffect="non-scaling-stroke"
          className="opacity-80 transition-all duration-500"
        />
      </svg>

      {/* 4 Cardinal Diamond Rhombus / Finial Pins (Top, Bottom, Left, Right) */}
      <div className="absolute top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
        <span
          className="block w-3 sm:w-3.5 h-3 sm:h-3.5 rotate-45 border border-white/80 shadow-md transition-transform duration-500 group-hover:scale-125"
          style={{ background: palette.accent }}
        />
      </div>
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 translate-y-1/2 z-40">
        <span
          className="block w-3 sm:w-3.5 h-3 sm:h-3.5 rotate-45 border border-white/80 shadow-md transition-transform duration-500 group-hover:scale-125"
          style={{ background: palette.accent }}
        />
      </div>
      <div className="absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
        <span
          className="block w-2.5 sm:w-3 h-2.5 sm:h-3 rotate-45 border border-white/80 shadow-md transition-transform duration-500 group-hover:scale-125"
          style={{ background: palette.accent }}
        />
      </div>
      <div className="absolute right-1 top-1/2 translate-x-1/2 -translate-y-1/2 z-40">
        <span
          className="block w-2.5 sm:w-3 h-2.5 sm:h-3 rotate-45 border border-white/80 shadow-md transition-transform duration-500 group-hover:scale-125"
          style={{ background: palette.accent }}
        />
      </div>

      {/* Main Clipped Cusped Body */}
      <div
        className="relative w-full h-[375px] sm:h-[435px] px-6 sm:px-12 py-7 sm:py-9 flex flex-col items-center justify-between text-center transition-all duration-500 backdrop-blur-2xl overflow-hidden"
        style={{
          clipPath: 'url(#vision-jharokha-clip)',
          WebkitClipPath: 'url(#vision-jharokha-clip)',
          background: palette.bgGradient,
        }}
      >
        {/* Inner Radial Ambient Glow */}
        <motion.div
          animate={{ opacity: isHovered ? 0.65 : 0.35 }}
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 50% 25%, ${palette.glow} 0%, transparent 68%)`,
          }}
        />

        {/* Vintage Canvas Weave Micro-Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '12px 12px',
          }}
        />

        {/* Lotus Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <LotusEmblem className="w-48 h-48 sm:w-64 sm:h-64" color={palette.accent} />
        </div>

        {/* Content Container — bounded safely inside the cusped jharokha printable zone */}
        <div className="relative z-10 w-full max-w-[215px] sm:max-w-[310px] mx-auto flex flex-col items-center justify-between h-full py-1">
          {/* Top Eyebrow: Vintage Royal Header */}
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
              <span className="text-[7px] rotate-45" style={{ color: palette.accent }}>◆</span>
              <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase font-serif" style={{ color: palette.accentLight }}>
                PILLAR 0{index + 1}
              </span>
              <span className="text-[7px] rotate-45" style={{ color: palette.accent }}>◆</span>
            </div>
          </div>

          {/* Icon with Vintage Ornate Medallion Frame */}
          <div className="relative my-1">
            <div className="relative p-1.5 rounded-2xl flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-2xl border-2 pointer-events-none transition-transform duration-500 group-hover:rotate-45"
                style={{ borderColor: palette.border }}
              />
              <div className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${palette.iconBg}`}>
                {feature.icon}
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="w-full flex flex-col items-center">
            <h3 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug font-serif drop-shadow-md mb-1">
              {feature.title}
            </h3>

            {/* Vintage Filigree Divider */}
            <VintageFiligreeDivider color={palette.accent} />

            <p className="text-slate-300 text-[11px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed max-w-[205px] sm:max-w-[285px] font-normal line-clamp-3 sm:line-clamp-none">
              {feature.description}
            </p>
          </div>

          {/* Bottom Royal Status Badge */}
          <div className="mt-1">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full backdrop-blur-md shadow-sm font-serif"
              style={{
                background: palette.accentMuted,
                border: `1px solid ${palette.border}`,
                color: palette.accentLight,
              }}
            >
              <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: palette.accent }} />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase">
                Production-Ready Deep-Tech
              </span>
              <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: palette.accent }} />
            </div>
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
      {/* Hidden SVG Definitions for Royal Indian Jharokha Arch ClipPath */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="vision-jharokha-clip" clipPathUnits="objectBoundingBox">
            <path d={INDIAN_JHAROKHA_CLIP} />
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

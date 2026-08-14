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

// Vintage Ornamental Corner Filigree Bracket
const VintageCorner = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 60 60" className={`w-9 h-9 sm:w-11 sm:h-11 pointer-events-none absolute ${className}`} style={style} fill="none">
    {/* Outer corner L-bracket */}
    <path d="M 4 56 L 4 16 C 4 9.4 9.4 4 16 4 L 56 4" stroke="currentColor" strokeWidth="1.6" />
    {/* Inner dashed hairline */}
    <path d="M 9 48 L 9 18 C 9 13 13 9 18 9 L 48 9" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 2" opacity="0.75" />
    {/* Baroque acanthus scroll flourish inside corner */}
    <path d="M 15 15 C 22 8 30 11 27 19 C 24 25 16 22 19 16 C 21 12 26 14 24 18" stroke="currentColor" strokeWidth="1.2" />
    <path d="M 12 32 C 14 24 22 22 25 28 C 27 32 23 35 20 32" stroke="currentColor" strokeWidth="0.9" opacity="0.8" />
    <path d="M 32 12 C 24 14 22 22 28 25 C 32 27 35 23 32 20" stroke="currentColor" strokeWidth="0.9" opacity="0.8" />
    {/* Corner finial rosettes */}
    <circle cx="5" cy="5" r="2.5" fill="currentColor" />
    <circle cx="5" cy="5" r="1" fill="#ffffff" />
    <circle cx="15" cy="15" r="1.8" fill="currentColor" />
    <circle cx="4" cy="56" r="1.5" fill="currentColor" />
    <circle cx="56" cy="4" r="1.5" fill="currentColor" />
  </svg>
);

// Vintage Ornate Header & Divider Flourish
const VintageCrest = ({ color = 'currentColor', className = '' }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 200 24" className={`w-40 sm:w-52 h-4 pointer-events-none ${className}`} fill="none" style={{ color }}>
    <path d="M 100 3 C 92 3 86 9 78 9 C 66 9 56 2 42 2 C 28 2 16 14 0 14" stroke="currentColor" strokeWidth="1.2" />
    <path d="M 100 3 C 108 3 114 9 122 9 C 134 9 144 2 158 2 C 172 2 184 14 200 14" stroke="currentColor" strokeWidth="1.2" />
    <path d="M 92 13 C 86 18 78 18 70 15 C 64 12 60 14 56 18" stroke="currentColor" strokeWidth="0.8" opacity="0.75" />
    <path d="M 108 13 C 114 18 122 18 130 15 C 136 12 140 14 144 18" stroke="currentColor" strokeWidth="0.8" opacity="0.75" />
    {/* Center Royal Diamond Seal */}
    <polygon points="100,0 106,8 100,16 94,8" fill="currentColor" />
    <circle cx="100" cy="8" r="2" fill="#ffffff" />
    <circle cx="78" cy="9" r="1.5" fill="currentColor" />
    <circle cx="122" cy="9" r="1.5" fill="currentColor" />
  </svg>
);

// Vintage Filigree Accent Bar
const VintageFiligreeDivider = ({ color = 'currentColor', className = '' }: { color?: string; className?: string }) => (
  <div className={`flex items-center justify-center gap-2 my-2.5 sm:my-3 ${className}`} style={{ color }}>
    <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
    <span className="text-[9px] rotate-45">❖</span>
    <span className="text-[6px]">●</span>
    <span className="text-[9px] rotate-45">❖</span>
    <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
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
      border: 'rgba(245, 158, 11, 0.45)',
      borderInner: 'rgba(253, 230, 138, 0.3)',
      iconBg: 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(48, 26, 8, 0.98) 0%, rgba(18, 10, 5, 0.99) 70%, rgba(10, 6, 3, 1) 100%)',
    },
    {
      glow: 'hsl(205 95% 55% / 0.28)',
      accent: '#38bdf8',
      accentLight: '#bae6fd',
      accentMuted: 'rgba(56, 189, 248, 0.16)',
      border: 'rgba(56, 189, 248, 0.45)',
      borderInner: 'rgba(186, 230, 253, 0.3)',
      iconBg: 'bg-sky-500/20 text-sky-300 border border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.25)]',
      bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(10, 32, 54, 0.98) 0%, rgba(6, 18, 34, 0.99) 70%, rgba(4, 10, 20, 1) 100%)',
    },
    {
      glow: 'hsl(275 85% 65% / 0.28)',
      accent: '#c084fc',
      accentLight: '#f3e8ff',
      accentMuted: 'rgba(192, 132, 252, 0.16)',
      border: 'rgba(192, 132, 252, 0.45)',
      borderInner: 'rgba(243, 232, 255, 0.3)',
      iconBg: 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-[0_0_20px_rgba(192,132,252,0.25)]',
      bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(38, 14, 56, 0.98) 0%, rgba(22, 8, 34, 0.99) 70%, rgba(12, 4, 20, 1) 100%)',
    },
    {
      glow: 'hsl(155 80% 50% / 0.28)',
      accent: '#34d399',
      accentLight: '#d1fae5',
      accentMuted: 'rgba(52, 211, 153, 0.16)',
      border: 'rgba(52, 211, 153, 0.45)',
      borderInner: 'rgba(209, 250, 229, 0.3)',
      iconBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.25)]',
      bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(8, 40, 24, 0.98) 0%, rgba(5, 24, 15, 0.99) 70%, rgba(3, 14, 9, 1) 100%)',
    },
  ];
  const palette = palettes[index % palettes.length];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={isMobileCard ? undefined : { x: springX, y: springY }}
      className={`relative group cursor-pointer w-full mx-auto select-none ${
        isMobileCard ? 'max-w-[325px]' : 'max-w-[340px] sm:max-w-[460px]'
      }`}
    >
      {/* Outer Glow Halo */}
      <div
        className="absolute -inset-2 rounded-[28px] pointer-events-none transition-opacity duration-500 blur-xl opacity-40 group-hover:opacity-75"
        style={{ background: palette.glow }}
      />

      {/* Main Vintage Ornamental Card Frame */}
      <div
        className="relative w-full rounded-[24px] overflow-hidden p-5 sm:p-8 flex flex-col items-center justify-between text-center transition-all duration-500 backdrop-blur-xl border border-white/10"
        style={{
          background: palette.bgGradient,
          boxShadow: `
            inset 0 0 0 1px ${palette.border},
            inset 0 0 30px rgba(0, 0, 0, 0.6),
            0 12px 35px -6px rgba(0, 0, 0, 0.6)
          `,
        }}
      >
        {/* Inner Dashed Guilloche / Filigree Inset Frame */}
        <div
          className="absolute inset-2 sm:inset-3 rounded-[18px] pointer-events-none transition-all duration-500"
          style={{
            border: `1px dashed ${palette.borderInner}`,
          }}
        />

        {/* 4 Vintage Filigree Corner Ornaments */}
        <VintageCorner className="top-1 left-1" style={{ color: palette.accent }} />
        <VintageCorner className="top-1 right-1 -scale-x-100" style={{ color: palette.accent }} />
        <VintageCorner className="bottom-1 left-1 -scale-y-100" style={{ color: palette.accent }} />
        <VintageCorner className="bottom-1 right-1 -scale-x-100 -scale-y-100" style={{ color: palette.accent }} />

        {/* Lotus Emblem Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
          <LotusEmblem className="w-56 h-56 sm:w-72 sm:h-72" color={palette.accent} />
        </div>

        {/* Vintage Top Header Crown */}
        <div className="relative z-10 flex flex-col items-center pt-1 mb-2 sm:mb-3">
          <VintageCrest color={palette.accent} className="mb-1" />
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <span className="text-[7px] rotate-45" style={{ color: palette.accent }}>◆</span>
            <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase font-serif" style={{ color: palette.accentLight }}>
              PILLAR 0{index + 1}
            </span>
            <span className="text-[7px] rotate-45" style={{ color: palette.accent }}>◆</span>
          </div>
        </div>

        {/* Center Vintage Scalloped Medallion for Icon */}
        <div className="relative z-10 my-1 sm:my-2">
          {/* Double-Ring Ornate Halo */}
          <div className="relative p-2 rounded-2xl flex items-center justify-center">
            {/* Medallion decorative outer ring */}
            <div
              className="absolute inset-0 rounded-2xl border-2 pointer-events-none transition-transform duration-500 group-hover:rotate-45"
              style={{ borderColor: palette.border }}
            />
            <div
              className="absolute inset-1 rounded-xl border border-dashed pointer-events-none"
              style={{ borderColor: palette.accentLight, opacity: 0.5 }}
            />
            {/* Core Icon Box */}
            <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${palette.iconBg}`}>
              {feature.icon}
            </div>
          </div>
        </div>

        {/* Card Content (Title, Divider, Description) */}
        <div className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] flex flex-col items-center my-1 sm:my-2">
          <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug font-serif drop-shadow-md">
            {feature.title}
          </h3>

          {/* Vintage Filigree Divider */}
          <VintageFiligreeDivider color={palette.accent} />

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-[260px] sm:max-w-[310px] font-normal">
            {feature.description}
          </p>
        </div>

        {/* Bottom Vintage Royal Seal / Status Pill */}
        <div className="relative z-10 mt-2 sm:mt-3">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full backdrop-blur-md shadow-sm font-serif"
            style={{
              background: palette.accentMuted,
              border: `1px solid ${palette.border}`,
              color: palette.accentLight,
            }}
          >
            <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: palette.accent }} />
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
              Production-Ready Deep-Tech
            </span>
            <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: palette.accent }} />
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

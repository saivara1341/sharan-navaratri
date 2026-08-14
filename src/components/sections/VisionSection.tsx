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

// Exact Wedding Project India Royal Cusped Arch Silhouette (Matching reference photo)
const WEDDING_ARCH_PATH = "M 50 2 C 54 4, 60 7, 65 11 C 70 14, 76 16, 82 22 C 90 30, 96 40, 96 50 C 96 60, 90 70, 82 78 C 76 84, 70 86, 65 89 C 60 93, 54 96, 50 98 C 46 96, 40 93, 35 89 C 30 86, 24 84, 18 78 C 10 70, 4 60, 4 50 C 4 40, 10 30, 18 22 C 24 16, 30 14, 35 11 C 40 7, 46 4, 50 2 Z";
const WEDDING_ARCH_INNER = "M 50 6 C 53.5 7.5, 58.5 10, 63 13.5 C 67.5 16, 73 18, 78 23.5 C 85 30.5, 90.5 39.5, 90.5 50 C 90.5 60.5, 85 69.5, 78 76.5 C 73 82, 67.5 84, 63 86.5 C 58.5 90, 53.5 92.5, 50 94 C 46.5 92.5, 41.5 90, 37 86.5 C 32.5 84, 27 82, 22 76.5 C 15 69.5, 9.5 60.5, 9.5 50 C 9.5 39.5, 15 30.5, 22 23.5 C 27 18, 32.5 16, 37 13.5 C 41.5 10, 46.5 7.5, 50 6 Z";
const WEDDING_ARCH_CLIP = "M 0.50 0.02 C 0.54 0.04, 0.60 0.07, 0.65 0.11 C 0.70 0.14, 0.76 0.16, 0.82 0.22 C 0.90 0.30, 0.96 0.40, 0.96 0.50 C 0.96 0.60, 0.90 0.70, 0.82 0.78 C 0.76 0.84, 0.70 0.86, 0.65 0.89 C 0.60 0.93, 0.54 0.96, 0.50 0.98 C 0.46 0.96, 0.40 0.93, 0.35 0.89 C 0.30 0.86, 0.24 0.84, 0.18 0.78 C 0.10 0.70, 0.04 0.60, 0.04 0.50 C 0.04 0.40, 0.10 0.30, 0.18 0.22 C 0.24 0.16, 0.30 0.14, 0.35 0.11 C 0.40 0.07, 0.46 0.04, 0.50 0.02 Z";

// Vintage Filigree Accent Bar
const VintageFiligreeDivider = ({ color = 'currentColor', className = '' }: { color?: string; className?: string }) => (
  <div className={`flex items-center justify-center gap-2 my-1.5 sm:my-2 ${className}`} style={{ color }}>
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
      bgGradient: 'radial-gradient(ellipse at 50% 20%, rgba(48, 26, 8, 0.98) 0%, rgba(20, 11, 5, 0.99) 70%, rgba(10, 6, 3, 1) 100%)',
    },
    {
      glow: 'hsl(205 95% 55% / 0.28)',
      accent: '#38bdf8',
      accentLight: '#bae6fd',
      accentMuted: 'rgba(56, 189, 248, 0.16)',
      border: '#38bdf8',
      borderInner: '#bae6fd',
      iconBg: 'bg-sky-500/20 text-sky-300 border border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.25)]',
      bgGradient: 'radial-gradient(ellipse at 50% 20%, rgba(10, 32, 54, 0.98) 0%, rgba(6, 18, 34, 0.99) 70%, rgba(4, 10, 20, 1) 100%)',
    },
    {
      glow: 'hsl(275 85% 65% / 0.28)',
      accent: '#c084fc',
      accentLight: '#f3e8ff',
      accentMuted: 'rgba(192, 132, 252, 0.16)',
      border: '#c084fc',
      borderInner: '#f3e8ff',
      iconBg: 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-[0_0_20px_rgba(192,132,252,0.25)]',
      bgGradient: 'radial-gradient(ellipse at 50% 20%, rgba(38, 14, 56, 0.98) 0%, rgba(22, 8, 34, 0.99) 70%, rgba(12, 4, 20, 1) 100%)',
    },
    {
      glow: 'hsl(155 80% 50% / 0.28)',
      accent: '#34d399',
      accentLight: '#d1fae5',
      accentMuted: 'rgba(52, 211, 153, 0.16)',
      border: '#34d399',
      borderInner: '#d1fae5',
      iconBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.25)]',
      bgGradient: 'radial-gradient(ellipse at 50% 20%, rgba(8, 40, 24, 0.98) 0%, rgba(5, 24, 15, 0.99) 70%, rgba(3, 14, 9, 1) 100%)',
    },
  ];
  const palette = palettes[index % palettes.length];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={isMobileCard ? undefined : { x: springX, y: springY }}
      className={`relative group cursor-pointer w-full mx-auto select-none filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)] ${
        isMobileCard ? 'max-w-[340px]' : 'max-w-[350px] sm:max-w-[460px]'
      }`}
    >
      {/* Outer SVG Arch Border matching exact photo frame outline */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-30 transition-all duration-500"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Outer Primary Architectural Border */}
        <path
          d={WEDDING_ARCH_PATH}
          fill="none"
          stroke={palette.border}
          strokeWidth={isHovered ? "2.2" : "1.7"}
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-500 opacity-95"
        />
        {/* Inner Dashed Concentric Arch Inset */}
        <path
          d={WEDDING_ARCH_INNER}
          fill="none"
          stroke={palette.borderInner}
          strokeWidth="1"
          strokeDasharray="3 2"
          vectorEffect="non-scaling-stroke"
          className="opacity-80 transition-all duration-500"
        />
      </svg>

      {/* 4 Cardinal Diamond Finial Gems on the Arch Points */}
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

      {/* Main Clipped Cusped Arch Frame Body */}
      <div
        className="relative w-full h-[380px] sm:h-[440px] px-6 sm:px-12 py-7 sm:py-9 flex flex-col items-center justify-between text-center transition-all duration-500 backdrop-blur-2xl overflow-hidden"
        style={{
          clipPath: 'url(#wedding-arch-clip)',
          WebkitClipPath: 'url(#wedding-arch-clip)',
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

        {/* Vintage Canvas Linen Weave Texture from Photo */}
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

        {/* Lotus Emblem Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
          <LotusEmblem className="w-48 h-48 sm:w-64 sm:h-64" color={palette.accent} />
        </div>

        {/* Content Container — bounded safely inside the arch printable zone */}
        <div className="relative z-10 w-full max-w-[220px] sm:max-w-[310px] mx-auto flex flex-col items-center justify-between h-full py-1">
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

            <p className="text-slate-300 text-[11px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed max-w-[210px] sm:max-w-[290px] font-normal line-clamp-3 sm:line-clamp-none">
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

// Mobile Touch & Swipe Interactive Deck with 4s Auto-Advance
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
      x: direction > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.92,
      rotateY: direction > 0 ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        rotateY: { duration: 0.3 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 120 : -120,
      opacity: 0,
      scale: 0.92,
      rotateY: direction < 0 ? 15 : -15,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
        rotateY: { duration: 0.25 },
      },
    }),
  };

  return (
    <div className="w-full flex flex-col items-center py-2">
      {/* 4 Interactive Mobile Pillar Tabs */}
      <div className="flex items-center justify-center gap-1.5 mb-5 overflow-x-auto max-w-full px-2 py-1 scrollbar-none">
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
                  : 'bg-card/80 text-muted-foreground border-border/70 hover:border-primary/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Pillar 0{i + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Swipeable Card Container */}
      <div className="relative w-full max-w-[340px] min-h-[390px] flex items-center justify-center">
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
            dragElastic={0.3}
            onDragStart={handleUserInteraction}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -50 || offset.x < -45) {
                paginate(1);
              } else if (swipe > 50 || offset.x > 45) {
                paginate(-1);
              }
            }}
            className="w-full flex items-center justify-center touch-pan-y"
          >
            <FeatureCard feature={features[activeIdx]} index={activeIdx} isMobileCard={true} />
          </motion.div>
        </AnimatePresence>

        {/* Floating Chevrons for Mobile */}
        <button
          onClick={() => paginate(-1)}
          aria-label="Previous Vision Pillar"
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/90 border border-border/80 text-foreground flex items-center justify-center shadow-md backdrop-blur-md z-30 transition-transform active:scale-90 hover:scale-105"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => paginate(1)}
          aria-label="Next Vision Pillar"
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/90 border border-border/80 text-foreground flex items-center justify-center shadow-md backdrop-blur-md z-30 transition-transform active:scale-90 hover:scale-105"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center gap-2 mt-4">
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
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>

      {/* Auto-advance Pulse Indicator */}
      {!paused && (
        <div className="mt-2 flex items-center gap-1 text-muted-foreground/50 text-[10px]">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 rounded-full bg-primary"
          />
          <span>Auto-advancing (4s)</span>
        </div>
      )}
    </div>
  );
};

// Smooth continuous scroll stack card wrapper inside desktop pinned viewport
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
  // Stagger entrance based on scroll progress (0 to 0.88)
  const interval = 0.88 / total;
  const start = index * interval;
  const end = (index + 1) * interval;

  // Translation Y: enters from bottom with smooth spring settle
  const y = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 1]
      : [Math.max(0, start - 0.06), start + 0.03, 1],
    index === 0
      ? [0, (total - 1) * -8]
      : [320, (total - 1 - index) * -8, (total - 1 - index) * -8]
  );

  // Scale down earlier cards gently as new ones arrive
  const scale = useTransform(
    scrollYProgress,
    [start, Math.min(0.92, end + 0.1)],
    [1, 1 - (total - 1 - index) * 0.03]
  );

  // Opacity: smoothly fades in as card reaches its slot
  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 0.6, 0.95]
      : [Math.max(0, start - 0.08), start, Math.min(1, start + 0.06)],
    index === 0
      ? [1, 0.9, 0.6]
      : [0, 0.6, 1]
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
    <section id="vision" className="bg-background relative overflow-visible py-8 md:py-0" ref={ref}>
      {/* Hidden SVG Definitions for Royal Wedding Arch ClipPath */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="wedding-arch-clip" clipPathUnits="objectBoundingBox">
            <path d={WEDDING_ARCH_CLIP} />
          </clipPath>
        </defs>
      </svg>

      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 rounded-full blur-[150px]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[150px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* MOBILE EXPERIENCE: Fluid Touch Swipe & Tab Deck (Zero scroll locking) */}
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

        {/* Mobile Swipe Deck */}
        <MobileVisionDeck features={features} />
      </div>

      {/* DESKTOP EXPERIENCE: Pinned Scroll Deck Track */}
      <div ref={scrollStackRef} className="hidden md:block relative w-full min-h-[300vh] sm:min-h-[320vh]">
        <div className="sticky top-14 sm:top-16 md:top-20 h-[calc(100dvh-4rem)] md:h-[calc(100vh-5rem)] flex flex-col justify-between items-center py-2 sm:py-4 px-4 overflow-hidden z-20">
          {/* Pinned Vision Header */}
          <div className="text-center max-w-3xl mx-auto shrink-0 pt-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-primary font-bold text-[10px] sm:text-xs md:text-sm tracking-[0.25em] uppercase mb-1 sm:mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <LotusEmblem className="w-3.5 h-3.5" color="currentColor" />
              <span>{t('vision.title')}</span>
              <LotusEmblem className="w-3.5 h-3.5" color="currentColor" />
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-1 sm:mb-2 leading-tight text-foreground">
              {t('vision.beyondPrototypes')}{' '}
              <span className="gradient-text glow-text">{t('vision.intoProduction')}</span>
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              <Trans
                i18nKey="vision.visionDescription"
                components={[
                  <span className="text-primary font-semibold" key="desc-highlight" />
                ]}
              />
            </p>
          </div>

          {/* Stacked Cards Deck Area */}
          <div className="relative w-full max-w-lg mx-auto flex-1 min-h-[370px] sm:min-h-[440px] flex items-center justify-center my-auto">
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

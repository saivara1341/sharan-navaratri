import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
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


// ─── Sacred Geometry Mandala SVG Frame ───────────────────────────────────────
// Generates a full mandala frame ring: outer sun-wheel, lotus petals, geometric triangles
const MandalaFrame = ({ color, accentColor, size = 320 }: { color: string; accentColor: string; size?: number }) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2;

  // Helper: point on circle
  const pt = (r: number, angleDeg: number) => {
    const a = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  // Outer sun-wheel triangular spikes (16 spikes)
  const spikeCount = 16;
  const spikePaths = Array.from({ length: spikeCount }, (_, i) => {
    const angle = (360 / spikeCount) * i;
    const tip = pt(R - 2, angle);
    const lBase = pt(R - 18, angle - 8);
    const rBase = pt(R - 18, angle + 8);
    return `M ${tip.x} ${tip.y} L ${lBase.x} ${lBase.y} L ${rBase.x} ${rBase.y} Z`;
  });

  // Lotus petals (12 petals, pointed at outer, rounded at inner)
  const petalCount = 12;
  const petalPaths = Array.from({ length: petalCount }, (_, i) => {
    const angle = (360 / petalCount) * i;
    const tipPt = pt(R - 28, angle);
    const lPt = pt(R - 56, angle - 12);
    const rPt = pt(R - 56, angle + 12);
    const base = pt(R - 64, angle);
    return `M ${base.x} ${base.y} Q ${lPt.x} ${lPt.y} ${tipPt.x} ${tipPt.y} Q ${rPt.x} ${rPt.y} ${base.x} ${base.y} Z`;
  });

  // Inner small petals (8 petals)
  const innerPetalCount = 8;
  const innerPetalPaths = Array.from({ length: innerPetalCount }, (_, i) => {
    const angle = (360 / innerPetalCount) * i + 22.5;
    const tipPt = pt(R - 76, angle);
    const lPt = pt(R - 94, angle - 14);
    const rPt = pt(R - 94, angle + 14);
    const base = pt(R - 102, angle);
    return `M ${base.x} ${base.y} Q ${lPt.x} ${lPt.y} ${tipPt.x} ${tipPt.y} Q ${rPt.x} ${rPt.y} ${base.x} ${base.y} Z`;
  });

  // Diamond finials at cardinal points (N/S/E/W)
  const cardinalDiamonds = [0, 90, 180, 270].map((angle) => {
    const c = pt(R - 15, angle);
    return `M ${c.x} ${c.y - 7} L ${c.x + 5} ${c.y} L ${c.x} ${c.y + 7} L ${c.x - 5} ${c.y} Z`;
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <filter id={`mandala-glow-${color.replace('#','')}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer sun-wheel spikes */}
      {spikePaths.map((d, i) => (
        <path key={`spike-${i}`} d={d} fill={color} fillOpacity="0.7" />
      ))}

      {/* Outer ring circle */}
      <circle cx={cx} cy={cy} r={R - 19} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.9" />
      <circle cx={cx} cy={cy} r={R - 22} fill="none" stroke={accentColor} strokeWidth="0.5" strokeOpacity="0.6" strokeDasharray="4 3" />

      {/* Lotus petals (outer) */}
      {petalPaths.map((d, i) => (
        <path key={`petal-${i}`} d={d} fill={color} fillOpacity="0.15" stroke={color} strokeWidth="0.8" strokeOpacity="0.7" />
      ))}

      {/* Mid ring circle */}
      <circle cx={cx} cy={cy} r={R - 58} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.7" />

      {/* Inner lotus petals */}
      {innerPetalPaths.map((d, i) => (
        <path key={`ipetal-${i}`} d={d} fill={accentColor} fillOpacity="0.12" stroke={accentColor} strokeWidth="0.7" strokeOpacity="0.65" />
      ))}

      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={R - 98} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.8" />
      <circle cx={cx} cy={cy} r={R - 104} fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.5" strokeDasharray="3 2.5" />

      {/* Star of David / Sri Yantra triangles (rotated squares) */}
      {[0, 45].map((rot, i) => (
        <rect
          key={`sq-${i}`}
          x={cx - (R - 112)}
          y={cy - (R - 112)}
          width={(R - 112) * 2}
          height={(R - 112) * 2}
          fill="none"
          stroke={color}
          strokeWidth="0.7"
          strokeOpacity="0.4"
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
      ))}

      {/* Cardinal diamond finials */}
      {cardinalDiamonds.map((d, i) => (
        <path key={`diamond-${i}`} d={d} fill={color} fillOpacity="0.9" />
      ))}

      {/* Center lotus dot */}
      <circle cx={cx} cy={cy} r={8} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      <circle cx={cx} cy={cy} r={4} fill={color} fillOpacity="0.4" />
      <circle cx={cx} cy={cy} r={2} fill={accentColor} fillOpacity="0.8" />
    </svg>
  );
};

// ─── Feature Card with Mandala Frame ─────────────────────────────────────────
const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 18 });
  const springY = useSpring(y, { stiffness: 120, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.06);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.06);
  };

  const palettes = [
    {
      primary:   '#f59e0b',  // Amber gold
      accent:    '#fcd34d',  // Light gold
      bg:        'radial-gradient(ellipse at 40% 30%, rgba(120,60,0,0.55) 0%, rgba(10,5,0,0.97) 100%)',
      ring:      'rgba(245,158,11,0.25)',
      iconClass: 'bg-amber-500/20 text-amber-300 border border-amber-400/40',
      pillText:  '#fbbf24',
      name:      'amber',
    },
    {
      primary:   '#818cf8',  // Indigo
      accent:    '#a5b4fc',
      bg:        'radial-gradient(ellipse at 40% 30%, rgba(30,20,80,0.65) 0%, rgba(4,4,20,0.97) 100%)',
      ring:      'rgba(129,140,248,0.22)',
      iconClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40',
      pillText:  '#a5b4fc',
      name:      'indigo',
    },
    {
      primary:   '#34d399',  // Emerald
      accent:    '#6ee7b7',
      bg:        'radial-gradient(ellipse at 40% 30%, rgba(5,50,30,0.65) 0%, rgba(2,12,8,0.97) 100%)',
      ring:      'rgba(52,211,153,0.22)',
      iconClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40',
      pillText:  '#6ee7b7',
      name:      'emerald',
    },
    {
      primary:   '#f472b6',  // Rose
      accent:    '#fbcfe8',
      bg:        'radial-gradient(ellipse at 40% 30%, rgba(80,10,40,0.65) 0%, rgba(15,3,10,0.97) 100%)',
      ring:      'rgba(244,114,182,0.22)',
      iconClass: 'bg-rose-500/20 text-rose-300 border border-rose-400/40',
      pillText:  '#fbcfe8',
      name:      'rose',
    },
  ];
  const p = palettes[index % palettes.length];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      style={{ x: springX, y: springY }}
      className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] mx-auto select-none cursor-pointer flex-shrink-0"
    >
      {/* Outer ambient glow */}
      <motion.div
        animate={{ opacity: isHovered ? 0.5 : 0.18, scale: isHovered ? 1.08 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-[-12%] rounded-full blur-[40px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${p.primary} 0%, transparent 70%)` }}
      />

      {/* Slowly spinning outer mandala ring */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      >
        <MandalaFrame color={p.primary} accentColor={p.accent} size={300} />
      </motion.div>

      {/* Counter-rotating inner ring overlay (sm size) */}
      <motion.div
        className="absolute inset-0 hidden sm:block"
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 380 380" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {/* 8 tiny diamond markers around inner area */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (360 / 8) * i - 90;
            const r = 380 / 2 - 55;
            const cx2 = 190 + r * Math.cos(angle * Math.PI / 180);
            const cy2 = 190 + r * Math.sin(angle * Math.PI / 180);
            return (
              <polygon key={i} points={`${cx2},${cy2-5} ${cx2+4},${cy2} ${cx2},${cy2+5} ${cx2-4},${cy2}`}
                fill={p.accent} fillOpacity="0.55" />
            );
          })}
        </svg>
      </motion.div>

      {/* Card body — circular */}
      <div
        className="absolute inset-[13%] sm:inset-[12%] rounded-full flex flex-col items-center justify-center overflow-hidden"
        style={{ background: p.bg, boxShadow: `0 0 0 1.5px ${p.primary}55, inset 0 0 40px ${p.ring}` }}
      >
        {/* Subtle inner mandala watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
          <LotusEmblem className="w-full h-full" color={p.primary} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-5 gap-1.5 sm:gap-2.5">
          {/* Pillar label */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[7px] sm:text-[9px]" style={{ color: p.primary }}>◆</span>
            <span
              className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-[0.22em]"
              style={{ color: p.primary }}
            >
              Pillar 0{index + 1}
            </span>
            <span className="text-[7px] sm:text-[9px]" style={{ color: p.primary }}>◆</span>
          </div>

          {/* Icon */}
          <motion.div
            animate={isHovered ? { scale: 1.12 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-10 h-10 sm:w-13 sm:h-13 rounded-full flex items-center justify-center ${p.iconClass} shadow-md`}
          >
            {feature.icon}
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-1.5 w-full max-w-[140px] sm:max-w-[180px]">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${p.primary}80)` }} />
            <span className="text-[8px]" style={{ color: p.primary }}>✦</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${p.primary}80)` }} />
          </div>

          {/* Title */}
          <h3
            className="text-sm sm:text-[1.05rem] font-black text-white tracking-tight leading-tight drop-shadow-sm max-w-[160px] sm:max-w-[210px]"
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-white/65 text-[10px] sm:text-[11px] leading-snug max-w-[150px] sm:max-w-[195px] line-clamp-3">
            {feature.description}
          </p>

          {/* Bottom badge */}
          <div
            className="mt-0.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase"
            style={{ background: `${p.primary}15`, border: `1px solid ${p.primary}40`, color: p.pillText }}
          >
            <span className="w-1 h-1 rounded-full" style={{ background: p.primary }} />
            Production-Ready
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
    <section id="vision" className="bg-background relative overflow-visible" ref={ref}>
      {/* Mandala cards use circular shape — no clipPath needed */}

      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 rounded-full blur-[150px]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[150px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Pinned Scroll Deck Track: Locks viewport on "Beyond Prototypes, Into Production" while cards stack */}
      <div ref={scrollStackRef} className="relative w-full min-h-[300vh] sm:min-h-[320vh]">
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
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto hidden sm:block">
              <Trans
                i18nKey="vision.visionDescription"
                components={[
                  <span className="text-primary font-semibold" key="desc-highlight" />
                ]}
              />
            </p>
          </div>

          {/* Stacked Cards Deck Area */}
          <div className="relative w-full max-w-[400px] sm:max-w-[440px] mx-auto flex-1 min-h-[310px] sm:min-h-[400px] flex items-center justify-center my-auto">
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

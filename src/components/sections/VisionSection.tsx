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


// ─── Jharokha Arch Paths (5-cusp Mughal cusped arch, 270×370 viewBox) ─────────
// Outer frame path
const ARCH_OUTER = "M 18 362 Q 18 370 26 370 L 244 370 Q 252 370 252 362 L 252 172 Q 226 145 214 128 Q 202 105 190 88 Q 180 66 162 48 Q 150 32 138 48 Q 120 66 110 88 Q 98 105 86 128 Q 74 145 18 172 Z";
// Inner concentric frame (inset ~8px)
const ARCH_INNER = "M 26 356 Q 26 362 33 362 L 237 362 Q 244 362 244 356 L 244 175 Q 220 151 208 135 Q 196 113 184 96 Q 174 75 158 58 Q 150 44 142 58 Q 126 75 116 96 Q 104 113 92 135 Q 80 151 26 175 Z";
// Clip path (normalized 0–1 for objectBoundingBox on 270×370 card)
const ARCH_CLIP = "M 0.067 0.978 Q 0.067 1 0.096 1 L 0.904 1 Q 0.933 1 0.933 0.978 L 0.933 0.465 Q 0.837 0.392 0.793 0.346 Q 0.748 0.284 0.704 0.238 Q 0.667 0.178 0.6 0.130 Q 0.556 0.086 0.5 0.054 Q 0.444 0.086 0.4 0.130 Q 0.333 0.178 0.296 0.238 Q 0.252 0.284 0.207 0.346 Q 0.163 0.392 0.067 0.465 Z";

// ─── Feature Card — Jharokha Arch Frame ──────────────────────────────────────
const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 18 });
  const springY = useSpring(y, { stiffness: 120, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.04);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.04);
  };

  const palettes = [
    {
      primary:  '#c8922a',   // antique gold
      accent:   '#f5d07a',
      cardBg:   'linear-gradient(160deg, #1a0e00 0%, #0d0700 55%, #050300 100%)',
      glow:     'rgba(200,146,42,0.20)',
      iconClass:'bg-amber-900/50 text-amber-300 border border-amber-600/50',
      pillText: '#f5d07a',
      topAccent:'#c8922a',
    },
    {
      primary:  '#6366f1',   // royal indigo
      accent:   '#a5b4fc',
      cardBg:   'linear-gradient(160deg, #080824 0%, #04040e 55%, #020208 100%)',
      glow:     'rgba(99,102,241,0.18)',
      iconClass:'bg-indigo-900/50 text-indigo-300 border border-indigo-500/50',
      pillText: '#a5b4fc',
      topAccent:'#6366f1',
    },
    {
      primary:  '#059669',   // deep emerald
      accent:   '#6ee7b7',
      cardBg:   'linear-gradient(160deg, #001a0e 0%, #010c07 55%, #000804 100%)',
      glow:     'rgba(5,150,105,0.18)',
      iconClass:'bg-emerald-900/50 text-emerald-300 border border-emerald-500/50',
      pillText: '#6ee7b7',
      topAccent:'#059669',
    },
    {
      primary:  '#be185d',   // deep rose/ruby
      accent:   '#fbcfe8',
      cardBg:   'linear-gradient(160deg, #1a0010 0%, #0d0008 55%, #060004 100%)',
      glow:     'rgba(190,24,93,0.18)',
      iconClass:'bg-rose-900/50 text-rose-300 border border-rose-500/50',
      pillText: '#fbcfe8',
      topAccent:'#be185d',
    },
  ];
  const p = palettes[index % palettes.length];

  // Shared SVG viewBox: 270 × 370
  const VW = 270, VH = 370;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      style={{ x: springX, y: springY }}
      className="relative mx-auto select-none cursor-pointer flex-shrink-0"
      // Fixed size matching the 270×370 viewBox aspect ratio
      // Mobile: 230×315, Desktop: 270×370
      css-note="aspect-ratio handled by explicit w/h"
    >
      {/* Outer ambient glow behind the arch */}
      <motion.div
        animate={{ opacity: isHovered ? 0.5 : 0.2, scale: isHovered ? 1.06 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute -inset-3 blur-[35px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 60%, ${p.primary}99 0%, transparent 70%)` }}
      />

      {/* The arch card itself — sized to 270:370 aspect */}
      <div className="relative w-[230px] h-[315px] sm:w-[270px] sm:h-[370px]">

        {/* ① Card body — clipped to arch shape, fully opaque */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `path('${ARCH_CLIP.replace(/(\d+\.?\d*)/g, (m) => `${parseFloat(m) * VW}`).replace(/[MmLlQqZz]/g, '')}')`,
            // Use objectBoundingBox compatible approach via SVG clipPath
          }}
        >
          {/* We use a different approach — fill the arch via SVG rect + clip */}
        </div>

        {/* ② SVG layer — draws filled arch bg + all borders */}
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <clipPath id={`arch-clip-${index}`}>
              <path d={ARCH_OUTER} />
            </clipPath>
            {/* Subtle radial glow gradient */}
            <radialGradient id={`card-glow-${index}`} cx="50%" cy="55%" r="55%">
              <stop offset="0%" stopColor={p.topAccent} stopOpacity="0.25" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Filled arch background (opaque) */}
          <path d={ARCH_OUTER} fill="#050505" />

          {/* Jewel-tone gradient overlay inside arch */}
          <path d={ARCH_OUTER} fill={`url(#card-glow-${index})`} />

          {/* Rich colored bg via a rect clipped to arch */}
          <rect
            x="0" y="0" width={VW} height={VH}
            clipPath={`url(#arch-clip-${index})`}
            fill="none"
          />

          {/* Outer arch border — primary color, solid */}
          <path
            d={ARCH_OUTER}
            fill="none"
            stroke={p.primary}
            strokeWidth={isHovered ? "2.2" : "1.6"}
            strokeOpacity="0.95"
          />

          {/* Inner concentric arch border — lighter, dashed */}
          <path
            d={ARCH_INNER}
            fill="none"
            stroke={p.accent}
            strokeWidth="0.8"
            strokeOpacity="0.55"
            strokeDasharray="5 3"
          />

          {/* Top arch highlight line (thin gold line along arch contour) */}
          <path
            d={ARCH_OUTER}
            fill="none"
            stroke={p.accent}
            strokeWidth="0.4"
            strokeOpacity="0.3"
          />

          {/* Cardinal diamond finials — top, bottom, left, right */}
          {/* Top center */}
          <polygon points={`135,30 139,38 135,46 131,38`} fill={p.primary} fillOpacity="0.95" />
          {/* Bottom center */}
          <polygon points={`135,355 139,362 135,369 131,362`} fill={p.primary} fillOpacity="0.85" />
          {/* Bottom left */}
          <polygon points={`18,368 23,364 28,368 23,372`} fill={p.primary} fillOpacity="0.8" />
          {/* Bottom right */}
          <polygon points={`242,368 247,364 252,368 247,372`} fill={p.primary} fillOpacity="0.8" />

          {/* Decorative horizontal rule inside arch body */}
          <line x1="35" y1="182" x2="235" y2="182" stroke={p.primary} strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="3 4" />
          <line x1="35" y1="350" x2="235" y2="350" stroke={p.primary} strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="3 4" />

          {/* Tiny corner ornament dots at arch body corners */}
          <circle cx="30" cy="188" r="2" fill={p.primary} fillOpacity="0.6" />
          <circle cx="240" cy="188" r="2" fill={p.primary} fillOpacity="0.6" />
          <circle cx="30" cy="344" r="2" fill={p.primary} fillOpacity="0.6" />
          <circle cx="240" cy="344" r="2" fill={p.primary} fillOpacity="0.6" />
        </svg>

        {/* ③ Content — positioned inside the arch body (below the arch head) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-[47%] pb-[7%] px-[10%]">
          <div className="flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 w-full h-full">

            {/* Pillar eyebrow */}
            <div className="flex items-center gap-1.5">
              <span className="text-[8px]" style={{ color: p.primary }}>◆</span>
              <span
                className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ color: p.primary }}
              >
                Pillar 0{index + 1}
              </span>
              <span className="text-[8px]" style={{ color: p.primary }}>◆</span>
            </div>

            {/* Icon */}
            <motion.div
              animate={isHovered ? { scale: 1.12, y: -2 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${p.iconClass} shadow-lg`}
            >
              {feature.icon}
            </motion.div>

            {/* Gold divider */}
            <div className="flex items-center gap-1.5 w-full max-w-[140px] sm:max-w-[170px]">
              <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${p.primary}99)` }} />
              <span className="text-[9px]" style={{ color: p.accent }}>✦</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${p.primary}99)` }} />
            </div>

            {/* Title */}
            <h3
              className="text-[11px] sm:text-[13px] font-black text-white tracking-tight leading-snug max-w-[160px] sm:max-w-[190px]"
            >
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-white/60 text-[9px] sm:text-[10px] leading-snug max-w-[150px] sm:max-w-[180px] line-clamp-3">
              {feature.description}
            </p>

            {/* Production badge */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase"
              style={{
                background: `${p.primary}15`,
                border: `1px solid ${p.primary}50`,
                color: p.pillText,
              }}
            >
              <span className="w-1.5 h-1.5 rotate-45" style={{ background: p.primary }} />
              Production-Ready
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


// Smooth continuous scroll stack card wrapper inside pinned viewport
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
  // Each card below the top peeks up by 16px — clearly visible as a premium stacked deck
  const y = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 1]
      : [Math.max(0, start - 0.05), start + 0.04, 1],
    index === 0
      ? [0, (total - 1) * -16]
      : [300, (total - 1 - index) * -16, (total - 1 - index) * -16]
  );

  // Scale down earlier cards slightly as new ones arrive on top
  const scale = useTransform(
    scrollYProgress,
    [start, Math.min(0.92, end + 0.1)],
    [1, 1 - (total - 1 - index) * 0.042]
  );

  // Opacity: bottom cards stay at 0.75 so deck is clearly visible beneath top card
  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 0.5, 0.9]
      : [Math.max(0, start - 0.06), start, Math.min(1, start + 0.06)],
    index === 0
      ? [1, 0.82, 0.75]
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

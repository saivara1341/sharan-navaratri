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


// ─── Arched Central Panel Paths (Royal Indian Cusped Jharokha, 280×380 viewBox) ─
const ARCH_PANEL_OUTER = "M 140 16 C 152 26, 164 34, 172 44 C 184 40, 198 48, 208 62 C 222 60, 238 72, 246 90 C 256 112, 258 138, 248 162 C 242 176, 242 204, 248 218 C 258 242, 256 268, 246 290 C 238 308, 222 320, 208 318 C 198 332, 184 340, 172 336 C 164 346, 152 354, 140 364 C 128 354, 116 346, 108 336 C 96 340, 82 332, 72 318 C 58 320, 42 308, 34 290 C 24 268, 22 242, 32 218 C 38 204, 38 176, 32 162 C 22 138, 24 112, 34 90 C 42 72, 58 60, 72 62 C 82 48, 96 40, 108 44 C 116 34, 128 26, 140 16 Z";

const ARCH_PANEL_INNER = "M 140 26 C 150 34, 160 41, 168 50 C 178 47, 190 54, 199 66 C 211 65, 225 76, 233 92 C 241 112, 243 135, 235 158 C 230 173, 230 207, 235 222 C 243 245, 241 268, 233 288 C 225 304, 211 315, 199 314 C 190 326, 178 333, 168 330 C 160 339, 150 346, 140 354 C 130 346, 120 339, 112 330 C 102 333, 90 326, 81 314 C 69 315, 55 304, 47 288 C 39 268, 37 245, 45 222 C 50 207, 50 173, 45 158 C 37 135, 39 112, 47 92 C 55 76, 69 65, 81 66 C 90 54, 102 47, 112 50 C 120 41, 130 34, 140 26 Z";

// ─── Feature Card — Arched Central Panel ────────────────────────────────────
const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 18 });
  const springY = useSpring(y, { stiffness: 120, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.05);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.05);
  };

  const palettes = [
    {
      primary:   '#f59e0b',  // warm saffron gold
      accent:    '#fde68a',  // light gold
      border:    '#d97706',
      borderDash:'#fbbf24',
      solidBg:   '#0d0600',
      radialGlow:'rgba(245, 158, 11, 0.28)',
      iconBg:    'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm',
      pillBg:    'bg-amber-500/15 border-amber-500/40 text-amber-300',
      pillDot:   '#f59e0b',
    },
    {
      primary:   '#38bdf8',  // sky cyan / deep indigo
      accent:    '#bae6fd',
      border:    '#0284c7',
      borderDash:'#38bdf8',
      solidBg:   '#020b14',
      radialGlow:'rgba(56, 189, 248, 0.28)',
      iconBg:    'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm',
      pillBg:    'bg-sky-500/15 border-sky-500/40 text-sky-300',
      pillDot:   '#38bdf8',
    },
    {
      primary:   '#34d399',  // emerald
      accent:    '#a7f3d0',
      border:    '#059669',
      borderDash:'#34d399',
      solidBg:   '#011108',
      radialGlow:'rgba(52, 211, 153, 0.28)',
      iconBg:    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm',
      pillBg:    'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
      pillDot:   '#34d399',
    },
    {
      primary:   '#f472b6',  // ruby rose
      accent:    '#fbcfe8',
      border:    '#db2777',
      borderDash:'#f472b6',
      solidBg:   '#12020a',
      radialGlow:'rgba(244, 114, 182, 0.28)',
      iconBg:    'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm',
      pillBg:    'bg-rose-500/15 border-rose-500/40 text-rose-300',
      pillDot:   '#f472b6',
    },
  ];
  const p = palettes[index % palettes.length];

  const VW = 280, VH = 380;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      style={{ x: springX, y: springY }}
      className="relative mx-auto select-none cursor-pointer flex-shrink-0"
    >
      {/* Outer ambient glow */}
      <motion.div
        animate={{ opacity: isHovered ? 0.6 : 0.25, scale: isHovered ? 1.08 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute -inset-4 rounded-3xl blur-[40px] pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${p.primary}90 0%, transparent 70%)` }}
      />

      {/* Main card container */}
      <div className="relative w-[280px] h-[370px] sm:w-[310px] sm:h-[410px] flex items-center justify-center">

        {/* SVG Arched Central Panel */}
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.7)]"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Inner radial gradient */}
            <radialGradient id={`arch-radial-${index}`} cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor={p.primary} stopOpacity="0.22" />
              <stop offset="70%" stopColor={p.solidBg} stopOpacity="0.95" />
              <stop offset="100%" stopColor={p.solidBg} stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Solid opaque background panel (blocks all card bleed-through) */}
          <path d={ARCH_PANEL_OUTER} fill={p.solidBg} />

          {/* Radial glow layer inside arch */}
          <path d={ARCH_PANEL_OUTER} fill={`url(#arch-radial-${index})`} />

          {/* Outer primary architectural border */}
          <path
            d={ARCH_PANEL_OUTER}
            fill="none"
            stroke={p.border}
            strokeWidth={isHovered ? "2.4" : "1.8"}
            strokeOpacity="0.95"
            className="transition-all duration-300"
          />

          {/* Inner dashed concentric arch border */}
          <path
            d={ARCH_PANEL_INNER}
            fill="none"
            stroke={p.borderDash}
            strokeWidth="1"
            strokeDasharray="4 3"
            strokeOpacity="0.65"
          />

          {/* Cardinal diamond finials */}
          {/* Top Apex */}
          <polygon points="140,6 145,16 140,26 135,16" fill={p.primary} />
          {/* Bottom Apex */}
          <polygon points="140,354 145,364 140,374 135,364" fill={p.primary} />
          {/* Left Waist */}
          <polygon points="22,190 32,185 42,190 32,195" fill={p.primary} />
          {/* Right Waist */}
          <polygon points="238,190 248,185 258,190 248,195" fill={p.primary} />
        </svg>

        {/* Card Content (Centered perfectly inside the arched central panel) */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-8 sm:px-10 py-8 gap-2 sm:gap-2.5">
          
          {/* Pillar Eyebrow */}
          <div className="flex items-center gap-1.5 pt-2">
            <span className="text-[8px] rotate-45" style={{ color: p.primary }}>◆</span>
            <span
              className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em]"
              style={{ color: p.accent }}
            >
              Pillar 0{index + 1}
            </span>
            <span className="text-[8px] rotate-45" style={{ color: p.primary }}>◆</span>
          </div>

          {/* Icon Badge */}
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 4 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center ${p.iconBg}`}
          >
            {feature.icon}
          </motion.div>

          {/* Decorative Divider */}
          <div className="flex items-center gap-1.5 w-full max-w-[140px] sm:max-w-[170px] my-0.5">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${p.primary}90)` }} />
            <span className="text-[8px]" style={{ color: p.accent }}>✦</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${p.primary}90)` }} />
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight drop-shadow-sm max-w-[200px]">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed max-w-[190px] sm:max-w-[220px] font-normal line-clamp-3">
            {feature.description}
          </p>

          {/* Bottom Badge */}
          <div
            className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold backdrop-blur-md shadow-sm border ${p.pillBg}`}
          >
            <span className="w-1.5 h-1.5 rotate-45" style={{ background: p.pillDot }} />
            <span className="truncate">Production-Ready Deep-Tech</span>
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
              <span className="block">{t('vision.beyondPrototypes')}</span>
              <span className="block gradient-text glow-text">{t('vision.intoProduction')}</span>
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
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] mx-auto flex-1 min-h-[370px] sm:min-h-[415px] flex items-center justify-center my-auto">
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

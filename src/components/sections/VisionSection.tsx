import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';


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


// ─── Arched Central Panel Paths (Royal Indian Cusped Jharokha, 340×380 viewBox) ─
const ARCH_PANEL_OUTER = "M 170 16 C 184 26, 198 34, 208 44 C 222 40, 238 48, 252 62 C 270 60, 290 72, 302 90 C 316 112, 318 138, 306 162 C 298 176, 298 204, 306 218 C 318 242, 316 268, 302 290 C 290 308, 270 320, 252 318 C 238 332, 222 340, 208 336 C 198 346, 184 354, 170 364 C 156 354, 142 346, 132 336 C 118 340, 102 332, 88 318 C 70 320, 50 308, 38 290 C 24 268, 22 242, 34 218 C 42 204, 42 176, 34 162 C 22 138, 24 112, 38 90 C 50 72, 70 60, 88 62 C 102 48, 118 40, 132 44 C 142 34, 156 26, 170 16 Z";

const ARCH_PANEL_INNER = "M 170 26 C 182 34, 194 41, 204 50 C 216 47, 230 54, 242 66 C 258 65, 276 76, 286 92 C 298 112, 300 135, 290 158 C 282 173, 282 207, 290 222 C 300 245, 298 268, 286 288 C 276 304, 258 315, 242 314 C 230 326, 216 333, 204 330 C 194 339, 182 346, 170 354 C 158 346, 146 339, 136 330 C 124 333, 110 326, 98 314 C 82 315, 64 304, 54 288 C 42 268, 40 245, 50 222 C 58 207, 58 173, 50 158 C 40 135, 42 112, 54 92 C 64 76, 82 65, 98 66 C 110 54, 124 47, 136 50 C 146 41, 158 34, 170 26 Z";

// ─── Feature Card — Arched Central Panel ────────────────────────────────────
const FeatureCard = ({ feature, index, isDesktopGrid = false }: { feature: any; index: number; isDesktopGrid?: boolean }) => {
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
      radialGlow:'rgba(245, 158, 11, 0.15)',
      iconBg:    'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm',
      pillBg:    'bg-amber-500/15 border-amber-500/30 text-amber-300',
      pillDot:   '#f59e0b',
    },
    {
      primary:   '#38bdf8',  // sky cyan / deep indigo
      accent:    '#bae6fd',
      border:    '#0284c7',
      borderDash:'#38bdf8',
      solidBg:   '#020b14',
      radialGlow:'rgba(56, 189, 248, 0.15)',
      iconBg:    'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm',
      pillBg:    'bg-sky-500/15 border-sky-500/30 text-sky-300',
      pillDot:   '#38bdf8',
    },
    {
      primary:   '#34d399',  // emerald
      accent:    '#a7f3d0',
      border:    '#059669',
      borderDash:'#34d399',
      solidBg:   '#011108',
      radialGlow:'rgba(52, 211, 153, 0.15)',
      iconBg:    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm',
      pillBg:    'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
      pillDot:   '#34d399',
    },
    {
      primary:   '#f472b6',  // ruby rose
      accent:    '#fbcfe8',
      border:    '#db2777',
      borderDash:'#f472b6',
      solidBg:   '#12020a',
      radialGlow:'rgba(244, 114, 182, 0.15)',
      iconBg:    'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm',
      pillBg:    'bg-rose-500/15 border-rose-500/30 text-rose-300',
      pillDot:   '#f472b6',
    },
  ];
  const p = palettes[index % palettes.length];

  const VW = 340, VH = 380;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      style={{ x: springX, y: springY }}
      className="relative mx-auto select-none cursor-pointer flex-shrink-0 w-full flex justify-center"
    >
      {/* Reduced subtle ambient glow */}
      <motion.div
        animate={{ opacity: isHovered ? 0.35 : 0.1, scale: isHovered ? 1.04 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute -inset-2 rounded-3xl blur-[20px] pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${p.primary}60 0%, transparent 70%)` }}
      />

      {/* Main card container */}
      <div className={`relative flex items-center justify-center ${
        isDesktopGrid
          ? 'w-full max-w-[420px] xl:max-w-[460px] h-[420px] xl:h-[450px]'
          : 'w-[88vw] max-w-[340px] h-[400px] sm:h-[420px]'
      }`}>

        {/* SVG Arched Central Panel with clean subtle drop shadow */}
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* Inner radial gradient */}
            <radialGradient id={`arch-radial-${index}-${isDesktopGrid ? 'grid' : 'stack'}`} cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor={p.primary} stopOpacity="0.18" />
              <stop offset="70%" stopColor={p.solidBg} stopOpacity="0.95" />
              <stop offset="100%" stopColor={p.solidBg} stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Solid opaque background panel (blocks all card bleed-through) */}
          <path d={ARCH_PANEL_OUTER} fill={p.solidBg} />

          {/* Radial glow layer inside arch */}
          <path d={ARCH_PANEL_OUTER} fill={`url(#arch-radial-${index}-${isDesktopGrid ? 'grid' : 'stack'})`} />

          {/* Outer primary architectural border */}
          <path
            d={ARCH_PANEL_OUTER}
            fill="none"
            stroke={p.border}
            strokeWidth={isHovered ? "2.2" : "1.6"}
            strokeOpacity="0.9"
            className="transition-all duration-300"
          />

          {/* Inner dashed concentric arch border */}
          <path
            d={ARCH_PANEL_INNER}
            fill="none"
            stroke={p.borderDash}
            strokeWidth="0.9"
            strokeDasharray="4 3"
            strokeOpacity="0.55"
          />

          {/* Vertical cardinal diamond finials only */}
          {/* Top Apex */}
          <polygon points="170,6 175,16 170,26 165,16" fill={p.primary} />
          {/* Bottom Apex */}
          <polygon points="170,354 175,364 170,374 165,364" fill={p.primary} />
        </svg>

        {/* Card Content — No text overflow on mobile */}
        <div className={`relative z-10 w-full h-full flex flex-col items-center justify-center text-center ${
          isDesktopGrid
            ? 'px-4 xl:px-6 py-6 gap-2 xl:gap-2.5'
            : 'px-7 sm:px-10 py-6 sm:py-8 gap-2 sm:gap-2.5'
        }`}>
          
          {/* Pillar Eyebrow — hidden on desktop */}
          <div className={`flex items-center gap-1.5 ${isDesktopGrid ? 'hidden' : ''}`}>
            <span className="text-[7px] rotate-45" style={{ color: p.primary }}>◆</span>
            <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: p.accent }}>
              Pillar 0{index + 1}
            </span>
            <span className="text-[7px] rotate-45" style={{ color: p.primary }}>◆</span>
          </div>

          {/* Title — above the divider */}
          <h3 className={`font-black text-white tracking-tight leading-tight drop-shadow-sm ${
            isDesktopGrid ? 'text-xl xl:text-2xl max-w-[340px]' : 'text-sm sm:text-base max-w-[240px]'
          }`}>
            {feature.title}
          </h3>

          {/* Decorative Divider with ✦ */}
          <div className="flex items-center gap-1.5 w-full max-w-[120px] sm:max-w-[150px]">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${p.primary}80)` }} />
            <span className="text-[8px]" style={{ color: p.accent }}>✦</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${p.primary}80)` }} />
          </div>

          {/* Description */}
          <p className={`text-slate-300 font-normal leading-snug ${
            isDesktopGrid
              ? 'text-sm xl:text-[15px] max-w-[330px] xl:max-w-[370px] leading-relaxed'
              : 'text-[11px] sm:text-xs max-w-[230px] sm:max-w-[260px] leading-snug'
          }`}>
            {feature.description}
          </p>

          {/* Bottom Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-semibold backdrop-blur-md shadow-sm border ${p.pillBg}`}>
            <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: p.pillDot }} />
            <span className="truncate">Production-Ready Deep-Tech</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Clean single-card scroll transition for mobile
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
  const step = 0.88 / total;
  const start = index * step;
  const end = (index + 1) * step;

  // Single card opacity: ONLY the active card is visible
  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [0, start + step * 0.7, end]
      : index === total - 1
      ? [start - step * 0.3, start, 1]
      : [start - step * 0.3, start, start + step * 0.7, end],
    index === 0
      ? [1, 1, 0]
      : index === total - 1
      ? [0, 1, 1]
      : [0, 1, 1, 0]
  );

  // Smooth slide-in from bottom and exit upwards
  const y = useTransform(
    scrollYProgress,
    index === 0
      ? [0, start + step * 0.7, end]
      : index === total - 1
      ? [start - step * 0.3, start, 1]
      : [start - step * 0.3, start, start + step * 0.7, end],
    index === 0
      ? [0, 0, -25]
      : index === total - 1
      ? [35, 0, 0]
      : [35, 0, 0, -25]
  );

  // Subtle scale transition
  const scale = useTransform(
    scrollYProgress,
    index === 0
      ? [0, start + step * 0.7, end]
      : index === total - 1
      ? [start - step * 0.3, start, 1]
      : [start - step * 0.3, start, start + step * 0.7, end],
    index === 0
      ? [1, 1, 0.96]
      : index === total - 1
      ? [0.96, 1, 1]
      : [0.96, 1, 1, 0.96]
  );

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        zIndex: index + 10,
      }}
      className="absolute inset-0 flex items-center justify-center pointer-events-auto"
    >
      <FeatureCard feature={feature} index={index} isDesktopGrid={false} />
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
  const step = 0.88 / total;
  const start = idx * step;
  const end = (idx + 1) * step;

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
      title: t('vision.features.ai.title'),
      description: t('vision.features.ai.description'),
      color: 'primary',
    },
    {
      title: t('vision.features.genAi.title'),
      description: t('vision.features.genAi.description'),
      color: 'accent',
    },
    {
      title: t('vision.features.agenticAi.title'),
      description: t('vision.features.agenticAi.description'),
      color: 'primary',
    },
    {
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
    <section id="vision" className="bg-background relative overflow-visible py-6 sm:py-12 md:py-16" ref={ref}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 rounded-full blur-[150px]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[150px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* ─── DESKTOP VIEW: 4 Cards in 1 Line Side-by-Side ─────────────────── */}
      <div className="hidden lg:block container mx-auto px-4 relative z-10 mb-16">
        {/* Desktop Header */}
        <div className="text-center max-w-3xl mx-auto pt-4 mb-12">
          <div className="inline-flex items-center gap-2 text-primary font-bold text-xs md:text-sm tracking-[0.25em] uppercase mb-3 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20">
            <LotusEmblem className="w-3.5 h-3.5" color="currentColor" />
            <span>{t('vision.title')}</span>
            <LotusEmblem className="w-3.5 h-3.5" color="currentColor" />
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-3 leading-tight text-foreground">
            <span className="block">{t('vision.beyondPrototypes')}</span>
            <span className="block gradient-text glow-text">{t('vision.intoProduction')}</span>
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

        {/* 4 Cards in 1 Line */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-4 gap-6 xl:gap-8 max-w-[1500px] mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <FeatureCard feature={feature} index={index} isDesktopGrid={true} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ─── MOBILE VIEW: Pinned Scroll Deck with Larger Cards ─────────────── */}
      <div ref={scrollStackRef} className="lg:hidden relative w-full min-h-[280vh]">
        <div className="sticky top-12 sm:top-14 h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)] flex flex-col justify-start items-center pt-5 sm:pt-6 pb-2 px-3 gap-2 sm:gap-3 overflow-hidden z-20">
          
          {/* Mobile Header */}
          <div className="text-center max-w-3xl mx-auto shrink-0">
            <div className="inline-flex items-center gap-1.5 text-primary font-bold text-[9px] sm:text-xs tracking-[0.25em] uppercase mb-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              <LotusEmblem className="w-3 h-3" color="currentColor" />
              <span>{t('vision.title')}</span>
              <LotusEmblem className="w-3 h-3" color="currentColor" />
            </div>

            <h2 className="text-xl sm:text-3xl font-black mb-0 leading-tight text-foreground">
              <span className="block">{t('vision.beyondPrototypes')}</span>
              <span className="block gradient-text glow-text">{t('vision.intoProduction')}</span>
            </h2>
          </div>

          {/* Cards Deck Area */}
          <div className="relative w-full max-w-[370px] mx-auto flex-1 min-h-[380px] flex items-center justify-center">
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
          <div className="flex items-center justify-center gap-2 shrink-0 pb-2 z-30">
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

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
// Fixed 300×300 viewBox — always scales responsively via w-full h-full
const MandalaFrame = ({ color, accentColor, solidBg }: { color: string; accentColor: string; solidBg: string }) => {
  const S = 300; // coordinate space size
  const cx = 150, cy = 150, R = 150;

  const pt = (r: number, deg: number) => {
    const a = (deg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  // 16 outer sun-wheel spikes
  const spikes = Array.from({ length: 16 }, (_, i) => {
    const ang = (360 / 16) * i;
    const tip = pt(R - 1, ang);
    const l = pt(R - 17, ang - 7);
    const r2 = pt(R - 17, ang + 7);
    return `M ${tip.x} ${tip.y} L ${l.x} ${l.y} L ${r2.x} ${r2.y} Z`;
  });

  // 12 outer lotus petals
  const outerPetals = Array.from({ length: 12 }, (_, i) => {
    const ang = (360 / 12) * i;
    const tip = pt(R - 24, ang);
    const l = pt(R - 52, ang - 11);
    const r2 = pt(R - 52, ang + 11);
    const base = pt(R - 60, ang);
    return `M ${base.x} ${base.y} Q ${l.x} ${l.y} ${tip.x} ${tip.y} Q ${r2.x} ${r2.y} ${base.x} ${base.y} Z`;
  });

  // 8 inner lotus petals (offset 22.5°)
  const innerPetals = Array.from({ length: 8 }, (_, i) => {
    const ang = (360 / 8) * i + 22.5;
    const tip = pt(R - 72, ang);
    const l = pt(R - 90, ang - 13);
    const r2 = pt(R - 90, ang + 13);
    const base = pt(R - 98, ang);
    return `M ${base.x} ${base.y} Q ${l.x} ${l.y} ${tip.x} ${tip.y} Q ${r2.x} ${r2.y} ${base.x} ${base.y} Z`;
  });

  // Cardinal diamonds at N/S/E/W
  const diamonds = [0, 90, 180, 270].map((ang) => {
    const c = pt(R - 10, ang);
    return `M ${c.x} ${c.y - 7} L ${c.x + 5} ${c.y} L ${c.x} ${c.y + 7} L ${c.x - 5} ${c.y} Z`;
  });

  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* ① Solid opaque background circle — blocks ALL card bleed-through */}
      <circle cx={cx} cy={cy} r={R - 18} fill={solidBg} />

      {/* ② Sun-wheel spikes (outside the solid bg circle, so visible) */}
      {spikes.map((d, i) => (
        <path key={`sp-${i}`} d={d} fill={color} fillOpacity="0.8" />
      ))}

      {/* ③ Outer border rings */}
      <circle cx={cx} cy={cy} r={R - 18} fill="none" stroke={color} strokeWidth="1.8" strokeOpacity="0.95" />
      <circle cx={cx} cy={cy} r={R - 22} fill="none" stroke={accentColor} strokeWidth="0.6" strokeOpacity="0.55" strokeDasharray="4 3" />

      {/* ④ Outer lotus petals */}
      {outerPetals.map((d, i) => (
        <path key={`op-${i}`} d={d} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.9" strokeOpacity="0.75" />
      ))}

      {/* ⑤ Mid ring */}
      <circle cx={cx} cy={cy} r={R - 56} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.65" />

      {/* ⑥ Inner lotus petals */}
      {innerPetals.map((d, i) => (
        <path key={`ip-${i}`} d={d} fill={accentColor} fillOpacity="0.14" stroke={accentColor} strokeWidth="0.8" strokeOpacity="0.6" />
      ))}

      {/* ⑦ Inner rings */}
      <circle cx={cx} cy={cy} r={R - 94} fill="none" stroke={color} strokeWidth="1.1" strokeOpacity="0.8" />
      <circle cx={cx} cy={cy} r={R - 99} fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.45" strokeDasharray="3 2.5" />

      {/* ⑧ Sri Yantra — two rotated squares (8-pointed star geometry) */}
      {[0, 45].map((rot, i) => (
        <rect
          key={`sq-${i}`}
          x={cx - (R - 108)} y={cy - (R - 108)}
          width={(R - 108) * 2} height={(R - 108) * 2}
          fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.35"
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
      ))}

      {/* ⑨ Cardinal diamond finials */}
      {diamonds.map((d, i) => (
        <path key={`dm-${i}`} d={d} fill={color} fillOpacity="1" />
      ))}

      {/* ⑩ Centre jewel */}
      <circle cx={cx} cy={cy} r={10} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      <circle cx={cx} cy={cy} r={5} fill={color} fillOpacity="0.35" />
      <circle cx={cx} cy={cy} r={2.5} fill={accentColor} fillOpacity="0.9" />
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
    x.set((e.clientX - rect.left - rect.width / 2) * 0.05);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.05);
  };

  const palettes = [
    {
      primary:  '#f59e0b',
      accent:   '#fcd34d',
      solidBg:  '#0d0600',   // fully opaque dark amber bg for mandala fill circle
      cardBg:   'radial-gradient(ellipse at 45% 35%, #3b1c00 0%, #0d0600 65%, #060300 100%)',
      iconClass:'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      pillText: '#fbbf24',
    },
    {
      primary:  '#818cf8',
      accent:   '#a5b4fc',
      solidBg:  '#04040e',
      cardBg:   'radial-gradient(ellipse at 45% 35%, #1a1040 0%, #04040e 65%, #020210 100%)',
      iconClass:'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
      pillText: '#a5b4fc',
    },
    {
      primary:  '#34d399',
      accent:   '#6ee7b7',
      solidBg:  '#020c07',
      cardBg:   'radial-gradient(ellipse at 45% 35%, #062818 0%, #020c07 65%, #010804 100%)',
      iconClass:'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
      pillText: '#6ee7b7',
    },
    {
      primary:  '#f472b6',
      accent:   '#fbcfe8',
      solidBg:  '#0d0208',
      cardBg:   'radial-gradient(ellipse at 45% 35%, #3d0a20 0%, #0d0208 65%, #080105 100%)',
      iconClass:'bg-rose-500/20 text-rose-300 border border-rose-500/40',
      pillText: '#fbcfe8',
    },
  ];
  const p = palettes[index % palettes.length];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      style={{ x: springX, y: springY }}
      // Card outer container — same size as mandala. bg-[#050505] fills corners so NO bleed-through.
      className="relative w-[290px] h-[290px] sm:w-[370px] sm:h-[370px] mx-auto select-none cursor-pointer flex-shrink-0 bg-[#050505]"
    >
      {/* Ambient outer glow */}
      <motion.div
        animate={{ opacity: isHovered ? 0.45 : 0.15, scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-[-10%] rounded-full blur-[50px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${p.primary}cc 0%, transparent 70%)` }}
      />

      {/* Spinning outer mandala (fills entire card square via w-full h-full SVG) */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        <MandalaFrame color={p.primary} accentColor={p.accent} solidBg={p.solidBg} />
      </motion.div>

      {/* Counter-rotating 8-diamond ring */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full pointer-events-none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          {Array.from({ length: 8 }, (_, i) => {
            const ang = (360 / 8) * i - 90;
            const r = 150 - 52;
            const dx = 150 + r * Math.cos(ang * Math.PI / 180);
            const dy = 150 + r * Math.sin(ang * Math.PI / 180);
            return <polygon key={i} points={`${dx},${dy - 5} ${dx + 4},${dy} ${dx},${dy + 5} ${dx - 4},${dy}`} fill={p.accent} fillOpacity="0.6" />;
          })}
        </svg>
      </motion.div>

      {/* Card content circle — fully opaque, inset inside the mandala rings */}
      <div
        className="absolute inset-[17%] rounded-full flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: p.cardBg,
          boxShadow: `0 0 0 1px ${p.primary}60, 0 0 0 2px ${p.solidBg}, inset 0 0 30px ${p.primary}18`,
        }}
      >
        {/* Faint lotus watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
          <LotusEmblem className="w-full h-full scale-75" color={p.primary} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 gap-1 sm:gap-1.5">
          {/* Pillar label */}
          <div className="flex items-center gap-1.5">
            <span className="text-[7px]" style={{ color: p.primary }}>◆</span>
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: p.primary }}>
              Pillar 0{index + 1}
            </span>
            <span className="text-[7px]" style={{ color: p.primary }}>◆</span>
          </div>

          {/* Icon */}
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center ${p.iconClass} shadow-lg`}
          >
            {feature.icon}
          </motion.div>

          {/* Gold divider */}
          <div className="flex items-center gap-1 w-full max-w-[120px] sm:max-w-[150px]">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${p.primary}90)` }} />
            <span className="text-[8px]" style={{ color: p.primary }}>✦</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${p.primary}90)` }} />
          </div>

          {/* Title */}
          <h3 className="text-[11px] sm:text-sm font-black text-white tracking-tight leading-tight max-w-[120px] sm:max-w-[155px]">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-white/60 text-[9px] sm:text-[10px] leading-snug max-w-[115px] sm:max-w-[148px] line-clamp-3">
            {feature.description}
          </p>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] font-semibold tracking-wider uppercase"
            style={{ background: `${p.primary}18`, border: `1px solid ${p.primary}45`, color: p.pillText }}
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

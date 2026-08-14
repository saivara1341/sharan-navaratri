import { motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  Boxes,
  BrainCircuit,
  Brush,
  Code2,
  HeartHandshake,
  Megaphone,
  Search,
  ShoppingBag,
  Store,
  type LucideIcon,
} from "lucide-react";
import { LotusEmblem } from "./VisionSection";

type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

const SERVICES: Service[] = [
  { title: "Websites", description: "6 tiers, landing page to full SaaS.", icon: Code2, accent: "#7c3aed" },
  { title: "E-Commerce", description: "Stores that sell while you sleep.", icon: ShoppingBag, accent: "#db2777" },
  { title: "SEO · AEO · GEO", description: "Found on Google and AI search.", icon: Search, accent: "#0284c7" },
  { title: "SaaS Products", description: "PG/Hostel, ArchPlan, Nexus, Nilayam.", icon: Boxes, accent: "#4f46e5" },
  { title: "Industry Sites", description: "Built for how your industry sells.", icon: Store, accent: "#059669" },
  { title: "Automation", description: "Chatbots, WhatsApp, Instagram.", icon: Bot, accent: "#0891b2" },
  { title: "Ongoing Care", description: "We stay after launch day.", icon: HeartHandshake, accent: "#dc2626" },
  { title: "Google & Meta Ads", description: "Paid campaigns that actually convert.", icon: Megaphone, accent: "#2563eb" },
  { title: "Branding & Design", description: "Logos, visiting cards, brochures & more.", icon: Brush, accent: "#9333ea" },
  { title: "Content & Social", description: "Reels, posts & blogs that keep you visible.", icon: BrainCircuit, accent: "#c026d3" },
  { title: "Analytics & Reporting", description: "What's working, in plain numbers.", icon: BarChart3, accent: "#16a34a" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const rotateX = useSpring(0, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 22 });
  const glow = useMotionTemplate`radial-gradient(320px circle at ${mouseX}% ${mouseY}%, ${service.accent}25, transparent 68%)`;
  const Icon = service.icon;

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    mouseX.set((x / bounds.width) * 100);
    mouseY.set((y / bounds.height) * 100);
    rotateX.set(((y / bounds.height) - 0.5) * -5);
    rotateY.set(((x / bounds.width) - 0.5) * 5);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.article
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="pixel-service-card group relative min-h-[225px] overflow-hidden rounded-xl border border-border/70 bg-card p-6 shadow-[0_20px_70px_rgba(15,23,42,0.12)] transition-[border-color,box-shadow,transform] duration-300 hover:border-foreground/20 hover:shadow-[0_28px_90px_rgba(15,23,42,0.18)] sm:min-h-[250px] sm:p-8"
    >
      <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: glow }} />
      
      {/* Top Accent Strip */}
      <div
        className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
        style={{ backgroundColor: service.accent }}
      />

      {/* Indian Ornamental Inner Border with Diamond Rhombus Corner Accents */}
      <div className="pointer-events-none absolute inset-3 rounded-lg border border-foreground/10 opacity-70 transition-colors group-hover:border-foreground/20">
        <span className="absolute -top-1 -left-1 w-2 h-2 rotate-45 border border-foreground/30 bg-background" style={{ borderColor: service.accent }} />
        <span className="absolute -top-1 -right-1 w-2 h-2 rotate-45 border border-foreground/30 bg-background" style={{ borderColor: service.accent }} />
        <span className="absolute -bottom-1 -left-1 w-2 h-2 rotate-45 border border-foreground/30 bg-background" style={{ borderColor: service.accent }} />
        <span className="absolute -bottom-1 -right-1 w-2 h-2 rotate-45 border border-foreground/30 bg-background" style={{ borderColor: service.accent }} />
      </div>

      {/* Indian Lotus Background Watermark - Directly Visible */}
      <div className="pointer-events-none absolute right-1 bottom-1 opacity-25 transition-all duration-500 group-hover:opacity-45 group-hover:scale-105">
        <LotusEmblem className="w-28 h-28" color={service.accent} />
      </div>

      <div className="relative flex h-full flex-col">
        <div className="mb-7 flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/70 bg-background/90 shadow-[0_12px_35px_rgba(15,23,42,0.10)] relative"
            style={{ color: service.accent }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rotate-45" style={{ background: service.accent }} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[8px] rotate-45 opacity-50" style={{ color: service.accent }}>◆</span>
            <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground/65 font-bold">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        <h3 className="mb-2.5 max-w-[15rem] text-xl font-bold leading-tight tracking-tight text-foreground sm:text-[1.35rem]">
          {service.title}
        </h3>
        <p className="max-w-[17rem] text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <ArrowUpRight className="absolute bottom-0 right-0 h-5 w-5 translate-x-1 translate-y-1 text-muted-foreground/40 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
      </div>
    </motion.article>
  );
}

function PinnedServiceCard({
  service,
  index,
  total,
  scrollYProgress,
}: {
  service: Service;
  index: number;
  total: number;
  scrollYProgress: any;
}) {
  const step = 0.90 / total;
  const start = index * step;
  const end = (index + 1) * step;

  // Translation Y: enters from bottom (220px) smoothly and exits upward (-60px)
  const y = useTransform(
    scrollYProgress,
    index === 0
      ? [0, end - step * 0.25, end]
      : [
          Math.max(0, start - step * 0.7),
          start,
          end - step * 0.25,
          index === total - 1 ? 1 : end,
        ],
    index === 0
      ? [0, 0, -60]
      : [
          220, // smoothly enters from bottom
          0,   // settles at center
          0,   // stays locked at center
          index === total - 1 ? 0 : -60, // exits smoothly upward
        ],
    { clamp: true }
  );

  // Scale: subtle growth on entrance, slight shrink on exit
  const scale = useTransform(
    scrollYProgress,
    index === 0
      ? [0, end - step * 0.25, end]
      : [
          Math.max(0, start - step * 0.7),
          start,
          end - step * 0.25,
          index === total - 1 ? 1 : end,
        ],
    index === 0
      ? [1, 1, 0.95]
      : [
          0.91,
          1,
          1,
          index === total - 1 ? 1 : 0.95,
        ],
    { clamp: true }
  );

  // Opacity: fades in from bottom, remains 1, fades out on exit
  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [0, end - step * 0.25, end]
      : [
          Math.max(0, start - step * 0.7),
          start,
          end - step * 0.25,
          index === total - 1 ? 1 : end,
        ],
    index === 0
      ? [1, 1, 0]
      : [
          0,
          1,
          1,
          index === total - 1 ? 1 : 0,
        ],
    { clamp: true }
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-start justify-center pointer-events-auto"
      style={{
        y,
        scale,
        opacity,
        zIndex: index + 10,
      }}
    >
      <div
        className="w-full rounded-[1.75rem]"
        style={{ boxShadow: `0 ${20 + index * 3}px ${55 + index * 4}px hsl(240 10% 5% / 0.14)` }}
      >
        <ServiceCard service={service} index={index} />
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const stackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = 0.90 / SERVICES.length;
    const current = Math.min(SERVICES.length - 1, Math.max(0, Math.floor(latest / step)));
    setActiveIndex(current);
  });

  return (
    <section id="services" className="relative overflow-visible border-t border-border/30 bg-background py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div ref={stackRef} className="relative h-[calc(100svh+4800px)] md:h-[calc(100vh+6200px)]">
          <div className="sticky top-28 z-20 flex flex-col items-center pt-2 md:top-32">
            <div className="mb-7 grid w-full gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-16 md:mb-9">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
              >
                <div className="mb-6 flex items-center justify-between md:mb-8">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-primary" />
                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Our services</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {String(activeIndex + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="max-w-3xl text-3xl font-black leading-[0.98] tracking-[-0.045em] text-foreground sm:text-4xl md:text-6xl">
                  Everything we build,
                  <span className="block text-muted-foreground/55">in one glance.</span>
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.12 }}
                className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg"
              >
                No confusion, no fine print — here's the entire menu. The chapters ahead go deeper on each one.
              </motion.p>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative h-[250px] w-full max-w-5xl sm:h-[280px]"
            >
              {SERVICES.map((service, index) => (
                <PinnedServiceCard
                  key={service.title}
                  service={service}
                  index={index}
                  total={SERVICES.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </motion.div>
          </div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          onClick={() => document.getElementById("submit")?.scrollIntoView({ behavior: "smooth" })}
          className="group mx-auto mt-12 flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/40 hover:shadow-md md:mt-16"
        >
          Tell us what you need
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </motion.button>
      </div>
    </section>
  );
}

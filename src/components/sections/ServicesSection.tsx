import { motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
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
      <div
        className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
        style={{ backgroundColor: service.accent }}
      />
      <div className="pointer-events-none absolute inset-3 rounded-lg border border-white/50 opacity-70 dark:border-white/10" />
      <div className="pointer-events-none absolute bottom-4 right-4 grid grid-cols-4 gap-1 opacity-45 transition-opacity duration-300 group-hover:opacity-80">
        {Array.from({ length: 16 }).map((_, pixelIndex) => (
          <span
            key={pixelIndex}
            className="h-1.5 w-1.5"
            style={{
              backgroundColor: pixelIndex % 3 === 0 ? service.accent : "hsl(var(--foreground) / 0.16)",
            }}
          />
        ))}
      </div>

      <div className="relative flex h-full flex-col">
        <div className="mb-7 flex items-start justify-between">
          <motion.div
            whileHover={{ rotate: -7, scale: 1.08 }}
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-border/70 bg-background/90 shadow-[0_12px_35px_rgba(15,23,42,0.10)]"
            style={{ color: service.accent }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </motion.div>
          <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground/55">
            {String(index + 1).padStart(2, "0")}
          </span>
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
  activeIndex,
}: {
  service: Service;
  index: number;
  activeIndex: number;
}) {
  const isActive = index === activeIndex;

  return (
    <motion.div
      className="absolute inset-0 flex items-start justify-center"
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : index < activeIndex ? -35 : 100,
        scale: isActive ? 1 : 0.96,
      }}
      transition={{ duration: 0.48, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        zIndex: isActive ? SERVICES.length + 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
      }}
      aria-hidden={!isActive}
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
    const releaseBuffer = 0.06;
    const progress = Math.min(1, latest / (1 - releaseBuffer));
    setActiveIndex(Math.min(SERVICES.length - 1, Math.max(0, Math.floor(progress * SERVICES.length))));
  });

  return (
    <section id="services" className="relative overflow-visible border-t border-border/30 bg-background py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div ref={stackRef} className="relative h-[calc(100svh+1400px)] md:h-[calc(100vh+1650px)]">
          <div className="sticky top-28 z-20 flex flex-col items-center pt-2 md:top-32">
            <div className="mb-7 grid w-full gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-16 md:mb-9">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
              >
                <div className="mb-6 flex items-center gap-3 md:mb-8">
                  <span className="h-px w-8 bg-primary" />
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Our services</span>
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
                  activeIndex={activeIndex}
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

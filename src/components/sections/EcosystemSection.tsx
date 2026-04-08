import { motion } from "framer-motion";
import { 
  Rocket, 
  Cpu, 
  GraduationCap, 
  Star, 
  Handshake, 
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Database,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";

const roles = [
  {
    title: "Visionary Founders",
    icon: Rocket,
    color: "orange",
    desc: "Startup Sahayak toolkit, DPIIT compliance, and YC scaling frameworks.",
    tag: "Incubation"
  },
  {
    title: "Tech Architects",
    icon: Cpu,
    color: "blue",
    desc: "System design patterns, ByteByteGo, and cloud framework indices.",
    tag: "Engineering"
  },
  {
    title: "Venture Investors",
    icon: Star,
    color: "yellow",
    desc: "Deal flow management, market data, and portfolio intelligence.",
    tag: "Capital"
  },
  {
    title: "Student Researchers",
    icon: GraduationCap,
    color: "emerald",
    desc: "AI Resume building, academic paper discovery, and career roadmaps.",
    tag: "Education"
  },
  {
    title: "Strategic Partners",
    icon: Handshake,
    color: "purple",
    desc: "HubSpot Academy, ecosystem networking, and collaborative hubs.",
    tag: "Growth"
  }
];

export const EcosystemSection = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden" id="ecosystem">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 font-bold text-xs uppercase tracking-widest"
          >
            <Globe className="w-4 h-4" /> Nexus Ecosystem
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text glow-text mb-6"
          >
            A Professional Core for <br /> Every Identity
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            We've integrated world-class portals into a single Neural Hub. 
            Select your profile and access specialized toolkits designed for your growth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, idx) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group glass-card p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-primary/40 transition-all hover:bg-white/[0.08]"
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl bg-${role.color}-500/10 text-${role.color}-500 group-hover:scale-110 transition-transform`}>
                  <role.icon className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-white/5 rounded-lg text-muted-foreground border border-white/10 group-hover:text-foreground transition-colors">
                  {role.tag}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{role.title}</h3>
              <p className="text-muted-foreground text-sm mb-10 leading-relaxed min-h-[60px]">
                {role.desc}
              </p>

              <Link 
                to="/auth" 
                className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary/20 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Access Hub</span>
                </div>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
          
          {/* Static Hub Stats Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-[32px] bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-20 h-20 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">Neural Hub</h3>
            <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-6">Unified Core Online</p>
            <div className="flex gap-4 mb-8">
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">50+</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Tools</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">5</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Profiles</span>
                </div>
            </div>
            <Link to="/auth" className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-primary/30 transition-all">
                Join Research Hub
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

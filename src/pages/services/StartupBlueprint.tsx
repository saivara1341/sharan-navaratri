import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";
import { 
  Rocket, 
  Map, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  Cpu, 
  ShieldCheck, 
  Zap,
  Layout,
  Briefcase
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const StartupBlueprint = () => {
    const steps = [
        { title: "Idea Validation", icon: Zap, status: "Active", desc: "Neural assessment of market need and technical feasibility." },
        { title: "Legal & Structure", icon: ShieldCheck, status: "Pending", desc: "DPIIT recognition and entity incorporation roadmap." },
        { title: "MVP Architecture", icon: Code2, status: "Planned", desc: "Technical stack and prototype development plan." },
        { title: "Scaling Protocol", icon: Rocket, status: "Future", desc: "Growth strategy and fundraise readiness analysis." }
    ];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-32">
            <Navbar />
            <Helmet>
                <title>Startup Blueprint | Siddhi Dynamics</title>
                <meta name="description" content="Generate a technical and business roadmap for your startup idea through our Neural Hub." />
            </Helmet>

            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10 mx-auto px-6 mb-20">
                <div className="max-w-4xl mx-auto mb-16 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Link to="/" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                            Home /
                        </Link>
                    </div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold gradient-text mb-6"
                    >
                        Startup Blueprint AI
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
                    >
                        Our Agentic Intelligence evaluates your concept to generate a detailed technical roadmap and business execution strategy.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-20 relative">
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -translate-y-1/2 -z-10" />
                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            className="glass-card p-8 rounded-3xl bg-white/5 border border-white/10 relative z-10 hover:border-primary/40 transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${step.status === 'Active' ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'bg-white/10'} flex items-center justify-center mb-6`}>
                                <step.icon className={`w-6 h-6 ${step.status === 'Active' ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ${step.status === 'Active' ? 'text-primary' : 'text-muted-foreground'}`}>Phase {idx + 1}: {step.status}</span>
                            <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{step.desc}</p>
                            <div className="pt-4 border-t border-white/5">
                                <button className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${step.status === 'Active' ? 'text-primary hover:gap-4 transition-all' : 'opacity-30 pointer-events-none'}`}>
                                    <span>Access Module</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8">
                        <Rocket className="w-12 h-12 text-primary opacity-20 animate-pulse" />
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-8">Ready to Blueprint?</h2>
                    
                    <div className="max-w-2xl mx-auto space-y-6 text-left mb-12">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-4">Venture Synopsis</label>
                            <textarea 
                                placeholder="Describe your vision, target audience, and primary technical challenge..."
                                rows={4}
                                className="w-full bg-transparent border-0 outline-none text-lg resize-none placeholder:opacity-30"
                            />
                        </div>
                    </div>

                    <button className="px-12 py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-4 mx-auto group">
                        <Cpu className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                        <span>Generate Neural Blueprint</span>
                    </button>
                    
                    <p className="mt-8 text-xs text-muted-foreground uppercase tracking-[0.3em] font-bold">
                        Processing Time: ~45 Seconds using Nexus Core
                    </p>
                </motion.div>
            </div>
            <FooterSection />
        </div>
    );
};

export default StartupBlueprint;

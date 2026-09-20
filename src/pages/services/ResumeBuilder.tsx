import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";
import { 
  FileText, 
  Bot, 
  Target, 
  CheckCircle2, 
  Download, 
  Layout, 
  Cpu,
  ArrowRight,
  User,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const ResumeBuilder = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-32">
      <Navbar />
      <Helmet>
        <title>AI Resume Builder | Nexus Careers | Siddhi Dynamics</title>
        <meta name="description" content="Build high-impact, ATS-friendly resumes using our Neural Hub's AI Resume Builder." />
      </Helmet>

      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 mb-20 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-4xl mx-auto mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link to="/" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              Home /
            </Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">AI Resume Builder</h1>
          <p className="text-xl text-muted-foreground">
            Nexus Intelligence evaluates your profile to craft high-impact, ATS-optimized resumes that stand out to recruiters and autonomous hiring agents.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { title: "ATS Optimization", desc: "Our engine scans for keywords used by modern recruitment systems.", icon: Target, color: "emerald" },
              { title: "Neural Copywriting", desc: "AI-generated profile summaries and experience bullets.", icon: Bot, color: "blue" },
              { title: "Multi-Format Export", desc: "Export to PDF, LaTeX, or interactive digital profiles.", icon: FileText, color: "purple" }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card p-8 rounded-3xl bg-white/5 border border-white/10"
              >
                <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mx-auto mb-6`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-500`} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
        </div>

        <div className="max-w-5xl mx-auto glass-card p-1 pb-0 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="p-8 md:p-12 text-center relative z-10 border-b border-white/5 bg-white/5 mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 font-bold text-xs uppercase tracking-widest">
                    <Cpu className="w-4 h-4" /> Nexus Core Online
                </div>
                <h2 className="text-3xl font-bold mb-6">Start Your Neural Resume</h2>
                <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
                    Nexus requires your LinkedIn profile or a current draft to begin the architectural analysis.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <button className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all">
                        <User className="w-5 h-5" />
                        <span>Build from Profile</span>
                    </button>
                    <button className="w-full md:w-auto px-8 py-4 bg-white/5 text-foreground border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                        <Download className="w-5 h-5" />
                        <span>Import Current CV</span>
                    </button>
                </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-4 opacity-50 select-none grayscale">
                <div className="h-48 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center">Template A</div>
                <div className="h-48 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center">Template B</div>
                <div className="h-48 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center">Template C</div>
                <div className="h-48 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center">Template D</div>
            </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default ResumeBuilder;

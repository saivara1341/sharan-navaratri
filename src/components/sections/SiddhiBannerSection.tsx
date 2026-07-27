import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Brain, Globe, Code, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SiddhiBannerSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-600/5 to-indigo-600/10 rounded-3xl blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 p-8 sm:p-12 rounded-3xl bg-slate-950/90 border border-slate-800 backdrop-blur-2xl shadow-2xl overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>SIDDHI AI 4.0 WORKSPACE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 leading-tight">
              High-Performance AI Intelligence for Strategy, Code & Research
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-light">
              Experience modern conversational AI combining multi-modal search synthesis, step-by-step deep reasoning, and production code generation—backed by instant cloud history persistence.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-cyan-400 font-bold text-sm block flex items-center gap-1.5">
                  <Brain className="w-4 h-4" /> Deep Reasoning
                </span>
                <span className="text-xs text-slate-400">Step-by-step logic expansion</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-cyan-400 font-bold text-sm block flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> Web Search
                </span>
                <span className="text-xs text-slate-400">Sources, citations & benchmarks</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-cyan-400 font-bold text-sm block flex items-center gap-1.5">
                  <Code className="w-4 h-4" /> Code Architect
                </span>
                <span className="text-xs text-slate-400">TypeScript & API blueprints</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/siddhi')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <span>Launch Siddhi AI Workspace</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Interface Preview Card */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl space-y-4 relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="font-bold text-sm text-slate-200">Siddhi 4.0 Omni</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">Real-Time</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                  🧠 Thinking Process (4 Steps)
                </span>
                <p className="text-xs text-slate-300 font-mono">
                  › Analyzing strategic input variables...
                  <br />
                  › Synthesizing real-time web citations...
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">Synthesis</span>
                <p className="text-xs text-slate-300">
                  Executable plan created. Persistent cloud history saved to your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

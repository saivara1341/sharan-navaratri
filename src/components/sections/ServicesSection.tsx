import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const SERVICES = [
    {
        emoji: "⚡",
        title: "Business Automation",
        desc: "Automate bookkeeping, workflows, tax calculations & invoice processing end-to-end.",
        tag: "Most Popular",
        color: "#7c3aed",
    },
    {
        emoji: "📊",
        title: "Financial Reports",
        desc: "Real-time dashboards, GST filing, profit & loss — always audit-ready.",
        tag: "",
        color: "#0ea5e9",
    },
    {
        emoji: "🌐",
        title: "Digital Marketing & Websites",
        desc: "Business profile websites, SEO campaigns, and social media growth strategies.",
        tag: "",
        color: "#10b981",
    },
    {
        emoji: "💳",
        title: "NFC / RFID Digital Cards",
        desc: "Replace visiting cards with smart, tap-to-connect digital NFC & RFID cards.",
        tag: "New",
        color: "#f59e0b",
    },
    {
        emoji: "⚙️",
        title: "Digital Workflow Solutions",
        desc: "Transform large manual processes into seamless, trackable digital workflows.",
        tag: "",
        color: "#ec4899",
    },
    {
        emoji: "🧾",
        title: "Invoice & Tax Processing",
        desc: "Smart invoice generation, automated tax calculations and e-filing support.",
        tag: "",
        color: "#6366f1",
    },
];

export function ServicesSection() {
    return (
        <section
            id="services"
            className="py-24 md:py-32 relative bg-[#050309] border-t border-white/5"
        >
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    
                    {/* Left Column: Sticky Header */}
                    <div className="lg:col-span-5 relative">
                        <div className="lg:sticky lg:top-32 flex flex-col items-start">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 mb-8"
                            >
                                <span className="text-xs font-bold text-violet-300 tracking-widest uppercase">
                                    Our Capabilities
                                </span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 tracking-tight text-white leading-[1.1]"
                            >
                                Automate. Grow. Dominate. 🚀
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-lg text-slate-400 leading-relaxed mb-10 max-w-md"
                            >
                                We help businesses replace manual work with intelligent digital systems — including Website Development, SaaS, ERP, E-Commerce, and more — so you focus on what matters.
                            </motion.p>

                            <motion.button
                                onClick={() => document.getElementById('submit')?.scrollIntoView({ behavior: 'smooth' })}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-slate-200 transition-colors"
                            >
                                Explore Capabilities
                            </motion.button>
                        </div>
                    </div>

                    {/* Right Column: Sticky Stack Cards */}
                    <div className="lg:col-span-7 flex flex-col pt-12 lg:pt-0 pb-32">
                        {SERVICES.map((s, i) => (
                            <motion.div
                                onClick={() => document.getElementById('submit')?.scrollIntoView({ behavior: 'smooth' })}
                                key={s.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="sticky w-full rounded-3xl p-8 sm:p-10 mb-6 sm:mb-8 cursor-pointer transition-all duration-300 group shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/5"
                                style={{ 
                                    top: `calc(10rem + ${i * 1.5}rem)`, 
                                    zIndex: i + 1,
                                    backgroundColor: '#0A0A0E', // Dark card background for contrast
                                }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                    {/* Content Wrap */}
                                    <div className="flex flex-col pr-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 text-3xl shadow-inner border border-white/10">
                                                {s.emoji}
                                            </div>
                                            {s.tag && (
                                                <span 
                                                    className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full text-white shadow-lg"
                                                    style={{ backgroundColor: s.color }}
                                                >
                                                    {s.tag}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300" style={{ backgroundImage: `linear-gradient(to right, white, ${s.color})` }}>
                                            {s.title}
                                        </h3>
                                        <p className="text-lg text-slate-400 leading-relaxed">
                                            {s.desc}
                                        </p>
                                    </div>

                                    {/* Arrow Icon */}
                                    <div className="mt-4 sm:mt-0 shrink-0">
                                        <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-slate-400 group-hover:border-white group-hover:text-white group-hover:bg-white/5 transition-all duration-300 overflow-hidden relative">
                                            <ArrowUpRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

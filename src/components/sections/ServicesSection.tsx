import { useState } from "react";
import { motion } from "framer-motion";

const SERVICES = [
    {
        emoji: "🤖",
        title: "Business Automation",
        desc: "Automate bookkeeping, workflows, tax calculations & invoice processing end-to-end.",
        tag: "Most Popular",
        color: "#7c3aed",
        glow: "rgba(124,58,237,0.35)",
    },
    {
        emoji: "📊",
        title: "Financial Reports",
        desc: "Real-time dashboards, GST filing, profit & loss — always audit-ready.",
        tag: "",
        color: "#0ea5e9",
        glow: "rgba(14,165,233,0.3)",
    },
    {
        emoji: "🌐",
        title: "Digital Marketing & Websites",
        desc: "Business profile websites, SEO campaigns, and social media growth strategies.",
        tag: "",
        color: "#10b981",
        glow: "rgba(16,185,129,0.3)",
    },
    {
        emoji: "💳",
        title: "NFC / RFID Digital Cards",
        desc: "Replace visiting cards with smart, tap-to-connect digital NFC & RFID cards.",
        tag: "New",
        color: "#f59e0b",
        glow: "rgba(245,158,11,0.3)",
    },
    {
        emoji: "⚙️",
        title: "Digital Workflow Solutions",
        desc: "Transform large manual processes into seamless, trackable digital workflows.",
        tag: "",
        color: "#ec4899",
        glow: "rgba(236,72,153,0.3)",
    },
    {
        emoji: "🧾",
        title: "Invoice & Tax Processing",
        desc: "Smart invoice generation, automated tax calculations and e-filing support.",
        tag: "",
        color: "#6366f1",
        glow: "rgba(99,102,241,0.3)",
    },
];

export function ServicesSection() {
    const [hovered, setHovered] = useState<number | null>(null);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.08,
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 35 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 15
            }
        }
    };

    return (
        <section
            id="services"
            className="py-24 relative overflow-hidden bg-gradient-to-b from-[#050309] via-[#08041a] to-[#050309]"
        >
            {/* Decorative Blobs */}
            <div className="absolute top-[10%] left-[-8%] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.12)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-[5%] right-[-6%] w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Section Heading */}
                <div className="text-center mb-16">
                    {/* Live Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/35 mb-6"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
                        </span>
                        <span className="text-xs font-bold text-violet-300 tracking-wider uppercase">Our Services</span>
                    </motion.div>

                    {/* Animated Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight bg-gradient-to-r from-white via-violet-300 to-sky-300 bg-clip-text text-transparent bg-[size:200%_auto] animate-shimmer"
                        style={{
                            backgroundImage: "linear-gradient(90deg, #fff 0%, #c4b5fd 40%, #93c5fd 70%, #fff 100%)",
                        }}
                    >
                        Automate. Grow. Dominate. 🚀
                    </motion.h2>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-400/90 max-w-xl mx-auto leading-relaxed"
                    >
                        We help businesses replace manual work with intelligent digital systems — so you focus on what matters.
                    </motion.p>
                </div>

                {/* Service Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
                >
                    {SERVICES.map((s, i) => (
                        <motion.div
                            key={s.title}
                            variants={cardVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                            className="relative bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md border rounded-2xl p-7 cursor-default transition-all duration-300 group overflow-hidden"
                            style={{
                                borderColor: hovered === i ? `${s.color}80` : "rgba(255,255,255,0.08)",
                                boxShadow: hovered === i ? `0 0 32px ${s.glow}` : "none",
                            }}
                        >
                            {/* Tag */}
                            {s.tag && (
                                <span
                                    style={{ backgroundColor: s.color }}
                                    className="absolute top-4 right-4 text-[10px] font-extrabold tracking-widest uppercase text-white px-2.5 py-0.5 rounded-full z-10"
                                >
                                    {s.tag}
                                </span>
                            )}

                            {/* Emoji Icon Container */}
                            <div
                                style={{
                                    background: `linear-gradient(135deg, ${s.color}33, ${s.color}15)`,
                                    borderColor: `${s.color}40`,
                                }}
                                className="w-12 h-12 rounded-xl border flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300"
                            >
                                {s.emoji}
                            </div>

                            <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-white transition-colors duration-200">
                                {s.title}
                            </h3>
                            
                            <p className="text-sm text-slate-400/90 leading-relaxed">
                                {s.desc}
                            </p>

                            {/* Bottom Ambient Glow line */}
                            <div
                                style={{
                                    background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
                                }}
                                className="absolute bottom-0 left-[10%] w-0 group-hover:w-[80%] h-[2px] rounded-full transition-all duration-500"
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative bg-gradient-to-r from-violet-950/40 to-sky-950/30 border border-violet-500/20 rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden"
                >
                    {/* Inner subtle glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.08)_0%,transparent_100%)] pointer-events-none" />

                    <div className="flex-1 text-left relative z-10">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                            Ready to transform your business? 💡
                        </h3>
                        <p className="text-sm sm:text-base text-slate-300/80 max-w-lg leading-relaxed">
                            Get in touch today — we'll understand your workflow and automate it for you.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center relative z-10">
                        {/* Phone CTA */}
                        <motion.a
                            href="tel:+916303602743"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(124,58,237,0.4)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.6)] transition-all"
                        >
                            📞 +91 6303602743
                        </motion.a>

                        {/* Email CTA */}
                        <motion.a
                            href="mailto:ssaivaraprasad51@gmail.com"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(124,58,237,0.15)" }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] border border-violet-500/40 text-violet-300 font-bold text-sm tracking-wide transition-all"
                        >
                            ✉️ Email Us
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

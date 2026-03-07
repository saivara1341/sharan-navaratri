import { useEffect, useRef, useState } from "react";

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

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);
    return { ref, inView };
}

export function ServicesSection() {
    const { ref: sectionRef, inView } = useInView();
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <section
            id="services"
            ref={sectionRef}
            style={{
                padding: "96px 0 80px",
                background: "linear-gradient(180deg, #050309 0%, #08041a 50%, #050309 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* ── decorative blobs ── */}
            <div style={{ position: "absolute", top: "10%", left: "-8%", width: 420, height: 420, background: "radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "5%", right: "-6%", width: 380, height: 380, background: "radial-gradient(circle,rgba(14,165,233,0.1) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

            <style>{`
        @keyframes sdFadeUp {
          from { opacity:0; transform:translateY(40px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes sdPing {
          0%   { transform:scale(1); opacity:1; }
          75%  { transform:scale(2); opacity:0; }
          100% { transform:scale(2); opacity:0; }
        }
        @keyframes sdGlow {
          0%,100% { box-shadow: 0 0 20px rgba(124,58,237,0.3); }
          50%      { box-shadow: 0 0 40px rgba(124,58,237,0.6); }
        }
        @keyframes sdShimmer {
          0%   { background-position:200% center; }
          100% { background-position:-200% center; }
        }
      `}</style>

            <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>

                {/* ── Section heading ── */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: 56,
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateY(0)" : "translateY(30px)",
                        transition: "opacity 0.7s ease, transform 0.7s ease",
                    }}
                >
                    {/* live badge */}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.35)", borderRadius: 50, padding: "6px 16px", marginBottom: 20 }}>
                        <span style={{ position: "relative", display: "inline-block", width: 8, height: 8 }}>
                            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#7c3aed", animation: "sdPing 1.5s ease-out infinite" }} />
                            <span style={{ position: "relative", display: "block", width: 8, height: 8, borderRadius: "50%", background: "#a78bfa" }} />
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", letterSpacing: 2, textTransform: "uppercase" }}>
                            Our Services
                        </span>
                    </div>

                    <h2
                        style={{
                            margin: "0 0 16px",
                            fontSize: "clamp(28px,5vw,48px)",
                            fontWeight: 900,
                            lineHeight: 1.15,
                            background: "linear-gradient(90deg,#fff 0%,#c4b5fd 40%,#93c5fd 70%,#fff 100%)",
                            backgroundSize: "200% auto",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            animation: "sdShimmer 4s linear infinite",
                        }}
                    >
                        Automate. Grow. Dominate. 🚀
                    </h2>
                    <p style={{ margin: 0, fontSize: "clamp(15px,2vw,18px)", color: "rgba(200,200,230,0.65)", maxWidth: 600, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
                        We help businesses replace manual work with intelligent digital systems — so you focus on what matters.
                    </p>
                </div>

                {/* ── Service cards grid ── */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                        gap: 20,
                        marginBottom: 56,
                    }}
                >
                    {SERVICES.map((s, i) => (
                        <div
                            key={s.title}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                position: "relative",
                                background: hovered === i
                                    ? `linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))`
                                    : "rgba(255,255,255,0.03)",
                                border: `1px solid ${hovered === i ? s.color + "80" : "rgba(255,255,255,0.08)"}`,
                                borderRadius: 18,
                                padding: "28px 24px",
                                cursor: "default",
                                boxShadow: hovered === i ? `0 0 32px ${s.glow}` : "none",
                                transform: hovered === i ? "translateY(-6px)" : "translateY(0)",
                                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                                opacity: inView ? 1 : 0,
                                animation: inView
                                    ? `sdFadeUp 0.6s ${0.1 + i * 0.08}s cubic-bezier(0.16,1,0.3,1) both`
                                    : "none",
                            }}
                        >
                            {/* tag */}
                            {s.tag && (
                                <span style={{
                                    position: "absolute",
                                    top: 16,
                                    right: 16,
                                    background: s.color,
                                    color: "#fff",
                                    fontSize: 10,
                                    fontWeight: 800,
                                    letterSpacing: 1,
                                    textTransform: "uppercase",
                                    padding: "3px 10px",
                                    borderRadius: 50,
                                }}>
                                    {s.tag}
                                </span>
                            )}

                            {/* icon */}
                            <div style={{
                                width: 52,
                                height: 52,
                                borderRadius: 14,
                                background: `linear-gradient(135deg,${s.color}33,${s.color}15)`,
                                border: `1px solid ${s.color}40`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 26,
                                marginBottom: 18,
                            }}>
                                {s.emoji}
                            </div>

                            <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: "#e2e8f0" }}>{s.title}</h3>
                            <p style={{ margin: 0, fontSize: 13.5, color: "rgba(200,200,220,0.65)", lineHeight: 1.6 }}>{s.desc}</p>

                            {/* bottom accent line */}
                            <div style={{
                                position: "absolute",
                                bottom: 0,
                                left: "10%",
                                width: hovered === i ? "80%" : "0%",
                                height: 2,
                                background: `linear-gradient(90deg,transparent,${s.color},transparent)`,
                                borderRadius: 2,
                                transition: "width 0.4s ease",
                            }} />
                        </div>
                    ))}
                </div>

                {/* ── CTA Banner ── */}
                <div
                    style={{
                        background: "linear-gradient(135deg,rgba(124,58,237,0.15) 0%,rgba(14,165,233,0.12) 100%)",
                        border: "1px solid rgba(124,58,237,0.3)",
                        borderRadius: 24,
                        padding: "40px 36px",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24,
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateY(0)" : "translateY(30px)",
                        transition: "opacity 0.8s 0.5s ease, transform 0.8s 0.5s ease",
                    }}
                >
                    <div style={{ flex: "1 1 300px" }}>
                        <h3 style={{ margin: "0 0 8px", fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, color: "#fff" }}>
                            Ready to transform your business? 💡
                        </h3>
                        <p style={{ margin: 0, fontSize: 14.5, color: "rgba(200,200,230,0.7)", lineHeight: 1.6 }}>
                            Get in touch today — we'll understand your workflow and automate it for you.
                        </p>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, flex: "0 0 auto" }}>
                        {/* Phone CTA */}
                        <a
                            href="tel:+916303602743"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 9,
                                padding: "13px 26px",
                                borderRadius: 50,
                                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 15,
                                textDecoration: "none",
                                boxShadow: "0 4px 24px rgba(124,58,237,0.5)",
                                whiteSpace: "nowrap",
                                animation: "sdGlow 2.5s ease-in-out infinite",
                                transition: "transform 0.2s",
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)")}
                        >
                            📞 &nbsp;+91 6303602743
                        </a>

                        {/* Email CTA */}
                        <a
                            href="mailto:ssaivaraprasad51@gmail.com"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 9,
                                padding: "13px 26px",
                                borderRadius: 50,
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(124,58,237,0.4)",
                                color: "#c4b5fd",
                                fontWeight: 700,
                                fontSize: 15,
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                                transition: "background 0.2s, transform 0.2s",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(124,58,237,0.2)"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
                        >
                            ✉️ &nbsp;Email Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

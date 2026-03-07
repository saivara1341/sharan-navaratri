import { useEffect, useState } from "react";
import { X, Mail, Phone, Sparkles, Bot, FileText, BarChart3, Megaphone, CreditCard, Workflow } from "lucide-react";

const SERVICES = [
    {
        icon: <Bot className="w-5 h-5" />,
        title: "Business Automation",
        desc: "Automate your daily operations — bookkeeping, invoices & more.",
        color: "from-violet-500 to-purple-600",
    },
    {
        icon: <FileText className="w-5 h-5" />,
        title: "Tax & Invoice Processing",
        desc: "Smart tax calculations & automated invoice processing.",
        color: "from-blue-500 to-cyan-500",
    },
    {
        icon: <BarChart3 className="w-5 h-5" />,
        title: "Financial Reports",
        desc: "Real-time financial insights & detailed reporting dashboards.",
        color: "from-emerald-500 to-teal-500",
    },
    {
        icon: <Megaphone className="w-5 h-5" />,
        title: "Digital Marketing",
        desc: "Business profile websites & growth-focused marketing campaigns.",
        color: "from-orange-500 to-amber-500",
    },
    {
        icon: <CreditCard className="w-5 h-5" />,
        title: "Digital NFC / RFID Cards",
        desc: "Replace physical visiting cards with smart NFC & RFID digital cards.",
        color: "from-pink-500 to-rose-500",
    },
    {
        icon: <Workflow className="w-5 h-5" />,
        title: "Digital Workflow Solutions",
        desc: "Transform large manual workflows into seamless digital processes.",
        color: "from-indigo-500 to-blue-600",
    },
];

const SESSION_KEY = "siddhidynamics_promo_closed";

export default function PromoPopup() {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        // Show only once per session
        if (!sessionStorage.getItem(SESSION_KEY)) {
            const timer = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setAnimateOut(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        setTimeout(() => setVisible(false), 350);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(8,7,20,0.75)", backdropFilter: "blur(6px)" }}
            onClick={handleClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    animation: animateOut
                        ? "promoFadeOut 0.35s cubic-bezier(0.4,0,0.2,1) forwards"
                        : "promoFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
                    maxWidth: 680,
                    width: "100%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b3e 100%)",
                    border: "1px solid rgba(139,92,246,0.35)",
                    borderRadius: 20,
                    boxShadow: "0 0 80px rgba(139,92,246,0.25), 0 25px 60px rgba(0,0,0,0.6)",
                    position: "relative",
                    padding: "0 0 28px 0",
                }}
            >
                {/* ── Close Button ── */}
                <button
                    onClick={handleClose}
                    aria-label="Close"
                    style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        zIndex: 10,
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#e2e8f0",
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.35)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)")}
                >
                    <X className="w-4 h-4" />
                </button>

                {/* ── Header Banner ── */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%)",
                        borderRadius: "20px 20px 0 0",
                        padding: "28px 32px 22px",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* glow orbs */}
                    <div style={{ position: "absolute", top: -40, left: -40, width: 160, height: 160, background: "rgba(255,255,255,0.06)", borderRadius: "50%", filter: "blur(30px)" }} />
                    <div style={{ position: "absolute", bottom: -50, right: -30, width: 200, height: 200, background: "rgba(14,165,233,0.12)", borderRadius: "50%", filter: "blur(40px)" }} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8, position: "relative" }}>
                        <Sparkles className="w-6 h-6 text-yellow-300" style={{ filter: "drop-shadow(0 0 8px rgba(253,224,71,0.8))" }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
                            Siddhi Dynamics
                        </span>
                        <Sparkles className="w-6 h-6 text-yellow-300" style={{ filter: "drop-shadow(0 0 8px rgba(253,224,71,0.8))" }} />
                    </div>
                    <h2 style={{ margin: 0, fontSize: "clamp(18px,4vw,26px)", fontWeight: 800, color: "#fff", lineHeight: 1.25, position: "relative" }}>
                        🚀 Automate &amp; Grow Your Business
                    </h2>
                    <p style={{ margin: "10px 0 0", fontSize: 14, color: "rgba(255,255,255,0.8)", position: "relative" }}>
                        End-to-end digital solutions — from smart automation to marketing &amp; beyond.
                    </p>
                </div>

                {/* ── Services Grid ── */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(185px,1fr))",
                        gap: 12,
                        padding: "20px 24px 0",
                    }}
                >
                    {SERVICES.map((s) => (
                        <div
                            key={s.title}
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 12,
                                padding: "14px 14px 12px",
                                transition: "transform 0.2s, border-color 0.2s",
                                cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(139,92,246,0.5)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                            }}
                        >
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 9,
                                    background: `linear-gradient(135deg, var(--g1), var(--g2))`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 10,
                                    color: "#fff",
                                    backgroundImage: `linear-gradient(135deg, ${s.color.replace("from-", "").replace(" to-", " , ")})`,
                                    // Use inline gradient class workaround:
                                }}
                                className={`bg-gradient-to-br ${s.color}`}
                            >
                                {s.icon}
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0", marginBottom: 4 }}>{s.title}</div>
                            <div style={{ fontSize: 11.5, color: "rgba(200,200,220,0.7)", lineHeight: 1.5 }}>{s.desc}</div>
                        </div>
                    ))}
                </div>

                {/* ── CTA / Contact ── */}
                <div style={{ padding: "20px 24px 0", display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                    <a
                        href="tel:+916303602743"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "11px 22px",
                            borderRadius: 50,
                            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 14,
                            textDecoration: "none",
                            boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
                            transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.04)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 28px rgba(124,58,237,0.7)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(124,58,237,0.5)"; }}
                    >
                        <Phone className="w-4 h-4" />
                        +91 6303602743
                    </a>

                    <a
                        href="mailto:ssaivaraprasad51@gmail.com"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "11px 22px",
                            borderRadius: 50,
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(139,92,246,0.4)",
                            color: "#c4b5fd",
                            fontWeight: 700,
                            fontSize: 14,
                            textDecoration: "none",
                            transition: "transform 0.2s, background 0.2s",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(139,92,246,0.2)"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.04)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
                    >
                        <Mail className="w-4 h-4" />
                        Email Us
                    </a>
                </div>



                {/* ── Keyframe styles ── */}
                <style>{`
          @keyframes promoFadeIn {
            from { opacity:0; transform:scale(0.88) translateY(24px); }
            to   { opacity:1; transform:scale(1) translateY(0); }
          }
          @keyframes promoFadeOut {
            from { opacity:1; transform:scale(1) translateY(0); }
            to   { opacity:0; transform:scale(0.88) translateY(24px); }
          }
        `}</style>
            </div>
        </div>
    );
}

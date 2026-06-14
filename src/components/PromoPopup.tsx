import { useEffect, useState } from "react";
import { X, Mail, Phone, Settings, Globe } from "lucide-react";

const SERVICES = [
    {
        icon: <Settings className="w-5 h-5" />,
        title: "Business Automation",
        desc: "Automate your daily operations — bookkeeping, invoices & more.",
        color: "from-violet-500 to-purple-600",
    },
    {
        icon: <Globe className="w-5 h-5" />,
        title: "Website Development & SaaS",
        desc: "Custom web applications, SaaS platforms, and enterprise solutions.",
        color: "from-blue-500 to-cyan-500",
    },
];

const SESSION_KEY = "siddhidynamics_promo_closed";

export default function PromoPopup({ allowed = true }: { allowed?: boolean }) {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        // Show only once per session, and only if allowed
        if (allowed && !sessionStorage.getItem(SESSION_KEY)) {
            const timer = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, [allowed]);

    const handleClose = () => {
        setAnimateOut(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        setTimeout(() => setVisible(false), 350);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none"
        >
            {/* Backdrop: Full screen on desktop, hidden on mobile */}
            <div 
                className="absolute inset-0 hidden sm:block pointer-events-auto"
                style={{ background: "rgba(8,7,20,0.75)", backdropFilter: "blur(6px)" }}
                onClick={handleClose}
            />

            <div
                className="pointer-events-auto w-full sm:w-auto promo-container flex flex-col"
                onClick={(e) => e.stopPropagation()}
                style={{
                    animation: animateOut
                        ? "promoFadeOut 0.35s cubic-bezier(0.4,0,0.2,1) forwards"
                        : "promoFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
                    maxWidth: 680,
                    background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b3e 100%)",
                    borderTop: "1px solid rgba(139,92,246,0.35)",
                    borderLeft: "1px solid rgba(139,92,246,0.35)",
                    borderRight: "1px solid rgba(139,92,246,0.35)",
                    borderBottom: "none",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    boxShadow: "0 -10px 40px rgba(0,0,0,0.5), 0 0 80px rgba(139,92,246,0.15)",
                    position: "relative",
                    padding: "0 0 20px 0",
                }}
            >
                {/* Responsive styling for 50vh height on mobile */}
                <style>{`
                    .promo-container {
                        height: 50vh;
                        max-height: 50vh;
                    }
                    @media (min-width: 640px) {
                        .promo-container {
                            height: auto;
                            max-height: 85vh;
                            border-bottom: 1px solid rgba(139,92,246,0.35) !important;
                            border-radius: 20px !important;
                        }
                    }
                `}</style>
                {/* ── Close Button ── */}
                <button
                    onClick={handleClose}
                    aria-label="Close"
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 10,
                        background: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "50%",
                        width: 30,
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#fff",
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.45)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)")}
                >
                    <X className="w-4 h-4" />
                </button>

                {/* ── Header Banner ── */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%)",
                        borderRadius: "20px 20px 0 0",
                        padding: "20px 24px 16px",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0,
                    }}
                >
                    {/* glow orbs */}
                    <div style={{ position: "absolute", top: -40, left: -40, width: 160, height: 160, background: "rgba(255,255,255,0.06)", borderRadius: "50%", filter: "blur(30px)" }} />
                    <div style={{ position: "absolute", bottom: -50, right: -30, width: 200, height: 200, background: "rgba(14,165,233,0.12)", borderRadius: "50%", filter: "blur(40px)" }} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 4, position: "relative" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
                            Siddhi Dynamics
                        </span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 800, color: "#fff", lineHeight: 1.25, position: "relative" }}>
                        🚀 Automate &amp; Grow Your Business
                    </h2>
                    <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.9)", position: "relative" }}>
                        End-to-end digital solutions — from smart automation to marketing &amp; beyond.
                    </p>
                </div>

                {/* ── Services Vertical List ── */}
                <div
                    className="flex flex-col overflow-y-auto custom-scrollbar"
                    style={{
                        gap: 12,
                        padding: "16px 20px 0",
                        flexGrow: 1,
                    }}
                >
                    <style>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 4px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: rgba(255,255,255,0.02);
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: rgba(139,92,246,0.3);
                            border-radius: 4px;
                        }
                    `}</style>
                    {SERVICES.map((s) => (
                        <div
                            key={s.title}
                            className="flex items-start gap-4"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 12,
                                padding: "12px",
                                transition: "transform 0.2s, border-color 0.2s",
                                cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
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
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    color: "#fff",
                                    backgroundImage: `linear-gradient(135deg, ${s.color.replace("from-", "").replace(" to-", " , ")})`,
                                }}
                                className={`bg-gradient-to-br ${s.color}`}
                            >
                                {s.icon}
                            </div>
                            <div className="flex flex-col">
                                <div style={{ fontWeight: 700, fontSize: 14, color: "#e2e8f0", marginBottom: 2 }}>{s.title}</div>
                                <div style={{ fontSize: 12, color: "rgba(200,200,220,0.7)", lineHeight: 1.4 }}>{s.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── CTA / Contact ── */}
                <div style={{ padding: "16px 20px 0", display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", flexShrink: 0 }}>
                    <a
                        href="tel:+916303602743"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 18px",
                            borderRadius: 50,
                            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 13,
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
                            gap: 6,
                            padding: "8px 18px",
                            borderRadius: 50,
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(139,92,246,0.4)",
                            color: "#c4b5fd",
                            fontWeight: 700,
                            fontSize: 13,
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
            from { opacity:0; transform: translateY(100%); }
            to   { opacity:1; transform: translateY(0); }
          }
          @keyframes promoFadeOut {
            from { opacity:1; transform: translateY(0); }
            to   { opacity:0; transform: translateY(100%); }
          }
          @media (min-width: 640px) {
            @keyframes promoFadeIn {
              from { opacity:0; transform:scale(0.88) translateY(24px); }
              to   { opacity:1; transform:scale(1) translateY(0); }
            }
            @keyframes promoFadeOut {
              from { opacity:1; transform:scale(1) translateY(0); }
              to   { opacity:0; transform:scale(0.88) translateY(24px); }
            }
          }
        `}</style>
            </div>
        </div>
    );
}


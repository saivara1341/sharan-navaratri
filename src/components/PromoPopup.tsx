import { useEffect, useState } from "react";
import { X, Printer, Zap, ArrowRight } from "lucide-react";

const FEATURES = [
    {
        icon: <Printer className="w-5 h-5" />,
        title: "Print Everything",
        desc: "High-quality visiting cards, posters, banners, and custom corporate materials.",
        color: "from-[#FF6B00] to-[#FF8b3d]",
    },
    {
        icon: <Zap className="w-5 h-5" />,
        title: "Delivered Fast",
        desc: "Direct shipping from local printing hubs in Hyderabad & Nizamabad.",
        color: "from-amber-500 to-orange-600",
    },
];

const SESSION_KEY = "siddhidynamics_printflow_promo_closed";

export default function PromoPopup({ allowed = true }: { allowed?: boolean }) {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        if (allowed && !sessionStorage.getItem(SESSION_KEY)) {
            const timer = setTimeout(() => setVisible(true), 1200);
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
                    maxWidth: 580,
                    background: "linear-gradient(135deg, #09090b 0%, #1c1917 50%, #0c0a09 100%)",
                    borderTop: "1px solid rgba(255,107,0,0.35)",
                    borderLeft: "1px solid rgba(255,107,0,0.35)",
                    borderRight: "1px solid rgba(255,107,0,0.35)",
                    borderBottom: "none",
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    boxShadow: "0 -10px 40px rgba(0,0,0,0.6), 0 0 80px rgba(255,107,0,0.15)",
                    position: "relative",
                    padding: "0 0 calc(24px + env(safe-area-inset-bottom, 0px)) 0",
                    fontFamily: "'Inter', sans-serif"
                }}
            >
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&display=swap');
                    
                    .promo-container {
                        max-height: calc(82vh - env(safe-area-inset-bottom, 0px));
                    }
                    .font-display {
                        font-family: 'Space Grotesk', sans-serif;
                    }
                    @media (min-width: 640px) {
                        .promo-container {
                            height: auto;
                            max-height: 85vh;
                            border-bottom: 1px solid rgba(255,107,0,0.35) !important;
                            border-radius: 24px !important;
                        }
                    }
                `}</style>
                
                <button
                    onClick={handleClose}
                    aria-label="Close"
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 10,
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#fff",
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.45)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)")}
                >
                    <X className="w-4.5 h-4.5" />
                </button>

                <div
                    style={{
                        background: "linear-gradient(135deg, #FF6B00 0%, #FF801A 50%, #d45900 100%)",
                        borderRadius: "24px 24px 0 0",
                        padding: "26px 24px 20px",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0,
                    }}
                >
                    <div style={{ position: "absolute", top: -40, left: -40, width: 160, height: 160, background: "rgba(255,255,255,0.08)", borderRadius: "50%", filter: "blur(30px)" }} />
                    <div style={{ position: "absolute", bottom: -50, right: -30, width: 200, height: 200, background: "rgba(255,255,255,0.05)", borderRadius: "50%", filter: "blur(40px)" }} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8, position: "relative" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>
                            INDIA'S SMART PRINTING PLATFORM
                        </span>
                    </div>
                    <h2 className="font-display" style={{ margin: 0, fontSize: "clamp(20px, 5.5vw, 26px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, position: "relative" }}>
                        Print Flow Webpage is Live! 🚀
                    </h2>
                    <p className="font-display" style={{ margin: "8px 0 0", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.95)", position: "relative" }}>
                        Print everything. <span style={{ color: "#000", fontWeight: 700 }}>Delivered fast.</span>
                    </p>
                </div>

                <div
                    className="flex flex-col overflow-y-auto custom-scrollbar"
                    style={{
                        gap: 12,
                        padding: "18px 24px 0",
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
                            background: rgba(255,107,0,0.3);
                            border-radius: 4px;
                        }
                    `}</style>
                    {FEATURES.map((f) => (
                        <div
                            key={f.title}
                            className="flex items-start gap-4"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: 16,
                                padding: "14px 16px",
                                transition: "transform 0.2s, border-color 0.2s",
                                cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,107,0,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                            }}
                        >
                            <div
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    color: "#fff",
                                    backgroundImage: `linear-gradient(135deg, ${f.color.replace("from-", "").replace(" to-", " , ")})`,
                                }}
                                className={`bg-gradient-to-br ${f.color}`}
                            >
                                {f.icon}
                            </div>
                            <div className="flex flex-col">
                                <div className="font-display" style={{ fontWeight: 700, fontSize: 14.5, color: "#f8fafc", marginBottom: 2 }}>{f.title}</div>
                                <div style={{ fontSize: 12.5, color: "rgba(226,232,240,0.85)", lineHeight: 1.4 }}>{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "center", flexShrink: 0 }}>
                    <a
                        href="https://printflows.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "12px 36px",
                            borderRadius: 50,
                            background: "linear-gradient(135deg, #FF6B00, #ff8c33)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 14.5,
                            textDecoration: "none",
                            boxShadow: "0 4px 20px rgba(255,107,0,0.45)",
                            transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => { 
                            (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.03)"; 
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 28px rgba(255,107,0,0.65)"; 
                        }}
                        onMouseLeave={(e) => { 
                            (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; 
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(255,107,0,0.45)"; 
                        }}
                    >
                        Join Waitlist on Website
                        <ArrowRight className="w-4.5 h-4.5" />
                    </a>
                </div>

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

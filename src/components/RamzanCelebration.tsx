import { useEffect, useRef, useState } from "react";

// ── Helper: generate randomised floating festive particles ──────────────────────
const EMOJIS = ["🌙", "⭐", "🕌", "🏮", "📿", "✨", "🌙", "🌟", "🤝", "💫", "🍬", "❤️"];

function randomBetween(a: number, b: number) {
    return a + Math.random() * (b - a);
}

interface Particle {
    id: number;
    emoji: string;
    left: number;   // vw
    size: number;   // px
    delay: number;  // s
    duration: number; // s
}

function makeParticles(n: number): Particle[] {
    return Array.from({ length: n }, (_, i) => ({
        id: i,
        emoji: EMOJIS[i % EMOJIS.length],
        left: randomBetween(2, 96),
        size: randomBetween(20, 38),
        delay: randomBetween(0, 4),
        duration: randomBetween(5, 10),
    }));
}

// ── Instagram‑style Heart / Blessing button ──────────────────────────────────
function BlessingButton({ onBless }: { onBless: () => void }) {
    const [blessed, setBlessed] = useState(false);
    const [count, setCount] = useState(1852);
    const [burst, setBurst] = useState(false);

    const handleClick = () => {
        if (blessed) return;
        setBlessed(true);
        setBurst(true);
        setCount((c) => c + 1);
        onBless();
        setTimeout(() => setBurst(false), 700);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <button
                onClick={handleClick}
                aria-label="Eid Mubarak"
                style={{
                    background: "none",
                    border: "none",
                    cursor: blessed ? "default" : "pointer",
                    position: "relative",
                    padding: 0,
                    lineHeight: 1,
                }}
            >
                {/* burst ring */}
                {burst && (
                    <span
                        style={{
                            position: "absolute",
                            inset: -12,
                            borderRadius: "50%",
                            border: "3px solid #fbbf24",
                            animation: "rBurst 0.6s ease-out forwards",
                            pointerEvents: "none",
                        }}
                    />
                )}
                <span
                    style={{
                        fontSize: 44,
                        display: "block",
                        transition: "transform 0.15s",
                        transform: burst ? "scale(1.4)" : blessed ? "scale(1.15)" : "scale(1)",
                        filter: blessed
                            ? "drop-shadow(0 0 10px rgba(251,191,36,0.8))"
                            : "none",
                    }}
                >
                    {blessed ? "🌙" : "🤍"}
                </span>
            </button>
            <span
                style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: blessed ? "#fbbf24" : "rgba(255,255,255,0.55)",
                    letterSpacing: 0.5,
                    transition: "color 0.3s",
                }}
            >
                {count.toLocaleString()} {blessed ? "🌙 Eid Mubarak!" : "Send Eid Blessings"}
            </span>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
const SESSION_KEY = "sd_ramzan_2026_closed";

export default function RamzanCelebration({ onClose }: { onClose?: () => void }) {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [blessed, setBlessed] = useState(false);
    const [particles] = useState<Particle[]>(() => makeParticles(25));
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Active for Eid period (Mid-March 2026)
        const now = new Date();
        // Eid al-Fitr 2026 is predicted around March 20-21
        // Today is March 20, User says tomorrow is festival, so March 21. 
        // We'll activate it for March 20, 21, and 22.
        const isEidTime = now.getMonth() === 2 && (now.getDate() >= 20 && now.getDate() <= 22);
        
        if (!isEidTime || sessionStorage.getItem(SESSION_KEY)) {
            if (onClose) onClose();
            return;
        }

        timerRef.current = setTimeout(() => setVisible(true), 1500);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [onClose]);

    const handleClose = () => {
        setClosing(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, 500);
    };

    const handleBless = () => {
        setBlessed(true);
        // auto-close after a warm moment
        setTimeout(handleClose, 3500);
    };

    if (!visible) return null;

    return (
        <>
            {/* ── Keyframes ─────────────────────────────────────────────────────── */}
            <style>{`
        @keyframes rFadeIn {
          from { opacity:0; transform:scale(0.85) translateY(40px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes rFadeOut {
          from { opacity:1; transform:scale(1) translateY(0); }
          to   { opacity:0; transform:scale(0.85) translateY(40px); }
        }
        @keyframes rFloat {
          0%   { transform:translateY(100vh) rotate(0deg); opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { transform:translateY(-120px) rotate(360deg); opacity:0; }
        }
        @keyframes rPulse {
          0%,100% { transform:scale(1); }
          50%      { transform:scale(1.05); }
        }
        @keyframes rShimmer {
          0%   { background-position:200% center; }
          100% { background-position:-200% center; }
        }
        @keyframes rBurst {
          from { transform:scale(1); opacity:1; }
          to   { transform:scale(2.5); opacity:0; }
        }
        @keyframes rSwing {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes rGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(251,191,36,0.2); }
          50% { box-shadow: 0 0 40px rgba(251,191,36,0.5); }
        }
      `}</style>

            {/* ── Backdrop ─────────────────────────────────────────────────────── */}
            <div
                onClick={handleClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 10000,
                    background: "rgba(6,18,10,0.85)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                }}
            />

            {/* ── Floating Emoji Particles ──────────────────────────────────────── */}
            <div style={{ position: "fixed", inset: 0, zIndex: 10001, pointerEvents: "none", overflow: "hidden" }}>
                {particles.map((p) => (
                    <span
                        key={p.id}
                        style={{
                            position: "absolute",
                            bottom: -60,
                            left: `${p.left}vw`,
                            fontSize: p.size,
                            animation: `rFloat ${p.duration}s ${p.delay}s linear infinite`,
                            userSelect: "none",
                            display: "block",
                        }}
                    >
                        {p.emoji}
                    </span>
                ))}
            </div>

            {/* ── Modal Card ────────────────────────────────────────────────────── */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 10002,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    pointerEvents: "none",
                }}
            >
                <div
                    className="ramzan-modal-card"
                    style={{
                        pointerEvents: "all",
                        width: "100%",
                        maxWidth: 540,
                        maxHeight: "90vh",
                        overflowY: "auto",
                        borderRadius: 32,
                        boxShadow: "0 0 100px rgba(5,150,105,0.3), 0 30px 80px rgba(0,0,0,0.8)",
                        border: "1px solid rgba(251,191,36,0.3)",
                        animation: closing
                            ? "rFadeOut 0.5s cubic-bezier(0.4,0,0.2,1) forwards"
                            : "rFadeIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    <style>{`
                        .ramzan-modal-card::-webkit-scrollbar { display: none; }
                        @media (max-width: 640px) {
                            .ramzan-header { padding: 40px 24px 24px !important; }
                            .ramzan-body { padding: 24px 20px 32px !important; }
                            .ramzan-grid { gap: 8px !important; margin-bottom: 24px !important; grid-template-columns: repeat(2, 1fr) !important; }
                            .ramzan-grid-item { padding: 12px 8px !important; }
                            .ramzan-close-btn { top: 12px !important; right: 12px !important; width: 32px !important; height: 32px !important; }
                            .ramzan-headline { font-size: 28px !important; }
                            .ramzan-icon { font-size: 48px !important; margin-bottom: 12px !important; }
                        }
                    `}</style>
                    {/* ── Header ── */}
                    <div
                        className="ramzan-header"
                        style={{
                            background: "linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 60%, #059669 100%)",
                            padding: "48px 32px 32px",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* decorative graphics */}
                        <div style={{ position: "absolute", top: -40, left: -40, width: 220, height: 220, background: "rgba(251,191,36,0.08)", borderRadius: "50%", filter: "blur(50px)" }} />
                        <div style={{ position: "absolute", bottom: -60, right: -40, width: 260, height: 260, background: "rgba(5,150,105,0.1)", borderRadius: "50%", filter: "blur(60px)" }} />

                        {/* Hanging Lanterns */}
                        <div style={{ position: "absolute", top: 10, left: 20, fontSize: 24, animation: "rSwing 3s ease-in-out infinite" }}>🏮</div>
                        <div style={{ position: "absolute", top: 10, right: 20, fontSize: 24, animation: "rSwing 3.5s ease-in-out infinite" }}>🏮</div>

                        {/* main iconography */}
                        <div className="ramzan-icon" style={{ fontSize: 64, marginBottom: 16, display: "inline-block", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>🕌</div>

                        {/* Eid Headline */}
                        <h1
                            className="ramzan-headline"
                            style={{
                                margin: 0,
                                fontSize: "clamp(26px, 6vw, 42px)",
                                fontWeight: 900,
                                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                background: "linear-gradient(90deg, #fef3c7 0%, #fde68a 25%, #fcd34d 50%, #fde68a 75%, #fef3c7 100%)",
                                backgroundSize: "200% auto",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                animation: "rShimmer 4s linear infinite",
                                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                            }}
                        >
                            ਈਦ ਮੁਬਾਰਕ 🌙
                        </h1>

                        <h2 style={{ margin: "5px 0 0", fontSize: 20, fontWeight: 600, color: "#fcd34d", opacity: 0.9 }}>
                            Eid Mubarak!
                        </h2>

                        {/* close ✕ */}
                        <button
                            onClick={handleClose}
                            className="ramzan-close-btn"
                            aria-label="Close"
                            style={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                background: "rgba(255,255,255,0.12)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "50%",
                                width: 36,
                                height: 36,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#fff",
                                fontSize: 18,
                                transition: "all 0.2s",
                                zIndex: 10,
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.25)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)")}
                        >
                            ✕
                        </button>
                    </div>

                    {/* ── Body ── */}
                    <div
                        className="ramzan-body"
                        style={{
                            background: "linear-gradient(180deg, #052e16 0%, #020617 100%)",
                            padding: "32px 36px 40px",
                            textAlign: "center",
                        }}
                    >
                        <p style={{ margin: "0 0 24px", fontSize: 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, fontWeight: 400 }}>
                            May the divine blessings of Allah bring you <strong>hope, faith, and joy</strong> on Eid al-Fitr and forever.
                            Wishing you and your family a blessed and peaceful Eid filled with love and prosperity.
                        </p>

                        {/* Eid Values Indicator */}
                        <div className="ramzan-grid" style={{ 
                            display: "grid", 
                            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", 
                            gap: 12, 
                            marginBottom: 32 
                        }}>
                            {[
                                { e: "🤝", t: "Unity", d: "Togetherness", c: "#fbbf24" },
                                { e: "🕊️", t: "Peace", d: "Spirituality", c: "#60a5fa" },
                                { e: "🌙", t: "Faith", d: "Devotion", c: "#fcd34d" },
                                { e: "🤲", t: "Gratitude", d: "Blessings", c: "#34d399" },
                                { e: "🍬", t: "Joy", d: "Celebration", c: "#f87171" },
                                { e: "✨", t: "Hope", d: "Future", c: "#a78bfa" },
                            ].map((item) => (
                                <div
                                    key={item.t}
                                    className="ramzan-grid-item"
                                    style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: `1px solid rgba(255,255,255,0.1)`,
                                        borderRadius: 16,
                                        padding: "16px 10px",
                                        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                    }}
                                    onMouseEnter={(e) => { 
                                        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05) translateY(-5px)"; 
                                        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)";
                                        (e.currentTarget as HTMLDivElement).style.borderColor = item.c;
                                    }}
                                    onMouseLeave={(e) => { 
                                        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; 
                                        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)";
                                    }}
                                >
                                    <div style={{ fontSize: 26, marginBottom: 8 }}>{item.e}</div>
                                    <div style={{ fontWeight: 700, fontSize: 13, color: item.c, marginBottom: 3 }}>{item.t}</div>
                                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>{item.d}</div>
                                </div>
                            ))}
                        </div>

                        {/* Signature */}
                        <div style={{ marginBottom: 28 }}>
                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0 }}>Warm regards,</p>
                            <p style={{ fontSize: 16, fontWeight: 700, color: "#fcd34d", margin: "4px 0 0" }}>Team Siddhi Dynamics ✨</p>
                        </div>

                        {/* Interaction Area */}
                        {!blessed ? (
                            <BlessingButton onBless={handleBless} />
                        ) : (
                            <div
                                style={{
                                    background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(5,150,105,0.1))",
                                    border: "1px solid rgba(251,191,36,0.4)",
                                    borderRadius: 20,
                                    padding: "16px 32px",
                                    color: "#fcd34d",
                                    fontWeight: 700,
                                    fontSize: 16,
                                    animation: "rPulse 1.5s ease-in-out infinite",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 10
                                }}
                            >
                                🌙 Eid al-Fitr Mubarak! 🌟
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

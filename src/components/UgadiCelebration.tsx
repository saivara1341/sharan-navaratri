import { useEffect, useRef, useState } from "react";

// ── Helper: generate randomised floating emoji particles ──────────────────────
const EMOJIS = ["🥭", "🌼", "🍃", "✨", "🥭", "🌸", "🏺", "💫", "🌿", "❤️", "🥭", "⭐"];

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

// ── Instagram‑style Heart / Thank‑you button ──────────────────────────────────
function HeartButton({ onThank }: { onThank: () => void }) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(1284);
    const [burst, setBurst] = useState(false);

    const handleClick = () => {
        if (liked) return;
        setLiked(true);
        setBurst(true);
        setCount((c) => c + 1);
        onThank();
        setTimeout(() => setBurst(false), 700);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <button
                onClick={handleClick}
                aria-label="Happy Ugadi"
                style={{
                    background: "none",
                    border: "none",
                    cursor: liked ? "default" : "pointer",
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
                            border: "3px solid #f59e0b",
                            animation: "uBurst 0.6s ease-out forwards",
                            pointerEvents: "none",
                        }}
                    />
                )}
                <span
                    style={{
                        fontSize: 44,
                        display: "block",
                        transition: "transform 0.15s",
                        transform: burst ? "scale(1.4)" : liked ? "scale(1.15)" : "scale(1)",
                        filter: liked
                            ? "drop-shadow(0 0 10px rgba(245,158,11,0.8))"
                            : "none",
                    }}
                >
                    {liked ? "❤️" : "🤍"}
                </span>
            </button>
            <span
                style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: liked ? "#f59e0b" : "rgba(255,255,255,0.55)",
                    letterSpacing: 0.5,
                    transition: "color 0.3s",
                }}
            >
                {count.toLocaleString()} {liked ? "❤️ Shubhakankshalu!" : "Wish Happy Ugadi"}
            </span>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
const SESSION_KEY = "sd_ugadi_2026_closed";

export default function UgadiCelebration({ onClose }: { onClose?: () => void }) {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [thanked, setThanked] = useState(false);
    const [particles] = useState<Particle[]>(() => makeParticles(25));
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Active for Ugadi period (Late March 2026)
        const now = new Date();
        // Ugadi 2026 is on March 19
        const isUgadiTime = now.getMonth() === 2 && (now.getDate() >= 18 && now.getDate() <= 20);
        
        if (!isUgadiTime || sessionStorage.getItem(SESSION_KEY)) {
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

    const handleThank = () => {
        setThanked(true);
        // auto-close after a warm moment
        setTimeout(handleClose, 3500);
    };

    if (!visible) return null;

    return (
        <>
            {/* ── Keyframes ─────────────────────────────────────────────────────── */}
            <style>{`
        @keyframes uFadeIn {
          from { opacity:0; transform:scale(0.85) translateY(40px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes uFadeOut {
          from { opacity:1; transform:scale(1) translateY(0); }
          to   { opacity:0; transform:scale(0.85) translateY(40px); }
        }
        @keyframes uFloat {
          0%   { transform:translateY(100vh) rotate(0deg); opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { transform:translateY(-120px) rotate(360deg); opacity:0; }
        }
        @keyframes uPulse {
          0%,100% { transform:scale(1); }
          50%      { transform:scale(1.05); }
        }
        @keyframes uShimmer {
          0%   { background-position:200% center; }
          100% { background-position:-200% center; }
        }
        @keyframes uBurst {
          from { transform:scale(1); opacity:1; }
          to   { transform:scale(2.5); opacity:0; }
        }
        @keyframes uSwing {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes uGoldGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.2); }
          50% { box-shadow: 0 0 40px rgba(212,175,55,0.5); }
        }
      `}</style>

            {/* ── Backdrop ─────────────────────────────────────────────────────── */}
            <div
                onClick={handleClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 10000,
                    background: "rgba(12,18,10,0.85)",
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
                            animation: `uFloat ${p.duration}s ${p.delay}s linear infinite`,
                            userSelect: "none",
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
                    style={{
                        pointerEvents: "all",
                        width: "100%",
                        maxWidth: 540,
                        borderRadius: 32,
                        overflow: "hidden",
                        boxShadow: "0 0 100px rgba(101,163,13,0.3), 0 30px 80px rgba(0,0,0,0.8)",
                        border: "1px solid rgba(212,175,55,0.3)",
                        animation: closing
                            ? "uFadeOut 0.5s cubic-bezier(0.4,0,0.2,1) forwards"
                            : "uFadeIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
                    }}
                >
                    {/* ── Header ── */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 60%, #059669 100%)",
                            padding: "48px 32px 32px",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* decorative graphics */}
                        <div style={{ position: "absolute", top: -40, left: -40, width: 220, height: 220, background: "rgba(250,204,21,0.08)", borderRadius: "50%", filter: "blur(50px)" }} />
                        <div style={{ position: "absolute", bottom: -60, right: -40, width: 260, height: 260, background: "rgba(101,163,13,0.1)", borderRadius: "50%", filter: "blur(60px)" }} />

                        {/* Mango Leaves (Thoranam) */}
                        <div style={{ position: "absolute", top: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10, fontSize: 24, opacity: 0.8, animation: "uSwing 3s ease-in-out infinite" }}>
                            🍃 🍃 🍃 🍃 🍃
                        </div>

                        {/* main iconography */}
                        <div style={{ fontSize: 64, marginBottom: 16, display: "inline-block", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>🏺</div>

                        {/* Telugu Headline */}
                        <h1
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
                                animation: "uShimmer 4s linear infinite",
                                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                            }}
                        >
                            ఉగాది శుభాకాంక్షలు
                        </h1>

                        <h2 style={{ margin: "5px 0 0", fontSize: 20, fontWeight: 600, color: "#fcd34d", opacity: 0.9 }}>
                            Happy Ugadi!
                        </h2>

                        {/* close ✕ */}
                        <button
                            onClick={handleClose}
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
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.25)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)")}
                        >
                            ✕
                        </button>
                    </div>

                    {/* ── Body ── */}
                    <div
                        style={{
                            background: "linear-gradient(180deg, #022c22 0%, #020617 100%)",
                            padding: "32px 36px 40px",
                            textAlign: "center",
                        }}
                    >
                        <p style={{ margin: "0 0 24px", fontSize: 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, fontWeight: 400 }}>
                            May this <strong>Ugadi</strong> bring the six flavors of life into perfect balance for you.
                            Wishing you a year filled with prosperity, good health, and boundless joy.
                        </p>

                        {/* Shadruchulu (Six Flavors) Indicators */}
                        <div style={{ 
                            display: "grid", 
                            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", 
                            gap: 12, 
                            marginBottom: 32 
                        }}>
                            {[
                                { e: "🍯", t: "Jaggery", d: "Sweetness", c: "#fbbf24" },
                                { e: "🧂", t: "Salt", d: "Fear", c: "#e2e8f0" },
                                { e: "🍋", t: "Neem", d: "Bitterness", c: "#a3e635" },
                                { e: "🌶️", t: "Chilli", d: "Anger", c: "#ef4444" },
                                { e: "🥭", t: "Mango", d: "Tanginess", c: "#facc15" },
                                { e: "🏺", t: "Tamarind", d: "Sourness", c: "#b45309" },
                            ].map((item) => (
                                <div
                                    key={item.t}
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
                        {!thanked ? (
                            <HeartButton onThank={handleThank} />
                        ) : (
                            <div
                                style={{
                                    background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(101,163,13,0.1))",
                                    border: "1px solid rgba(251,191,36,0.4)",
                                    borderRadius: 20,
                                    padding: "16px 32px",
                                    color: "#fcd34d",
                                    fontWeight: 700,
                                    fontSize: 16,
                                    animation: "uPulse 1.5s ease-in-out infinite",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 10
                                }}
                            >
                                🏺 Happy Telugu New Year! 🌟
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

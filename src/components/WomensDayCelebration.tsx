import { useEffect, useRef, useState } from "react";

// ── Helper: generate randomised floating emoji particles ──────────────────────
const EMOJIS = ["🌸", "💜", "🌺", "✨", "💐", "🦋", "🌷", "💫", "🎀", "❤️", "🌹", "⭐"];

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
    const [count, setCount] = useState(248);
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
                aria-label="Thank you"
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
                            border: "3px solid #f472b6",
                            animation: "wdBurst 0.6s ease-out forwards",
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
                            ? "drop-shadow(0 0 10px rgba(244,114,182,0.8))"
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
                    color: liked ? "#f472b6" : "rgba(255,255,255,0.55)",
                    letterSpacing: 0.5,
                    transition: "color 0.3s",
                }}
            >
                {count.toLocaleString()} {liked ? "❤️ Thank You!" : "Thank You"}
            </span>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
const SESSION_KEY = "sd_womensday_2026_closed";

export default function WomensDayCelebration() {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [thanked, setThanked] = useState(false);
    const [particles] = useState<Particle[]>(() => makeParticles(22));
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Show on March 8 (month index 2) — also active on March 7 for preview/launch
        const now = new Date();
        const isWomensDay = now.getMonth() === 2 && (now.getDate() === 7 || now.getDate() === 8);
        if (!isWomensDay) return;
        if (sessionStorage.getItem(SESSION_KEY)) return;

        timerRef.current = setTimeout(() => setVisible(true), 1200);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    const handleClose = () => {
        setClosing(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        setTimeout(() => setVisible(false), 500);
    };

    const handleThank = () => {
        setThanked(true);
        // auto-close after a warm moment
        setTimeout(handleClose, 2800);
    };

    if (!visible) return null;

    return (
        <>
            {/* ── Keyframes ─────────────────────────────────────────────────────── */}
            <style>{`
        @keyframes wdFadeIn {
          from { opacity:0; transform:scale(0.82) translateY(30px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes wdFadeOut {
          from { opacity:1; transform:scale(1) translateY(0); }
          to   { opacity:0; transform:scale(0.82) translateY(30px); }
        }
        @keyframes wdFloat {
          0%   { transform:translateY(100vh) rotate(0deg); opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { transform:translateY(-120px) rotate(360deg); opacity:0; }
        }
        @keyframes wdPulse {
          0%,100% { transform:scale(1); }
          50%      { transform:scale(1.06); }
        }
        @keyframes wdShimmer {
          0%   { background-position:200% center; }
          100% { background-position:-200% center; }
        }
        @keyframes wdBurst {
          from { transform:scale(1); opacity:1; }
          to   { transform:scale(2.5); opacity:0; }
        }
        @keyframes wdSpin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes wdBounce {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-8px); }
        }
      `}</style>

            {/* ── Backdrop ─────────────────────────────────────────────────────── */}
            <div
                onClick={handleClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 10000,
                    background: "rgba(10,4,25,0.80)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
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
                            animation: `wdFloat ${p.duration}s ${p.delay}s linear infinite`,
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
                    padding: "16px",
                    pointerEvents: "none",
                }}
            >
                <div
                    style={{
                        pointerEvents: "all",
                        width: "100%",
                        maxWidth: 520,
                        borderRadius: 28,
                        overflow: "hidden",
                        boxShadow: "0 0 120px rgba(244,114,182,0.35), 0 30px 80px rgba(0,0,0,0.7)",
                        border: "1px solid rgba(244,114,182,0.3)",
                        animation: closing
                            ? "wdFadeOut 0.5s cubic-bezier(0.4,0,0.2,1) forwards"
                            : "wdFadeIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
                    }}
                >
                    {/* ── Top gradient band ── */}
                    <div
                        style={{
                            background: "linear-gradient(135deg,#831843 0%,#9d174d 25%,#be185d 50%,#db2777 75%,#ec4899 100%)",
                            padding: "36px 32px 28px",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* decorative glow orbs */}
                        <div style={{ position: "absolute", top: -60, left: -60, width: 200, height: 200, background: "rgba(251,207,232,0.15)", borderRadius: "50%", filter: "blur(40px)" }} />
                        <div style={{ position: "absolute", bottom: -80, right: -50, width: 250, height: 250, background: "rgba(167,139,250,0.12)", borderRadius: "50%", filter: "blur(50px)" }} />

                        {/* spinning ribbon emoji */}
                        <div style={{ fontSize: 52, marginBottom: 12, display: "inline-block", animation: "wdBounce 2s ease-in-out infinite" }}>🎀</div>

                        {/* shimmer headline */}
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "clamp(22px,5vw,34px)",
                                fontWeight: 900,
                                letterSpacing: "-0.5px",
                                lineHeight: 1.2,
                                background: "linear-gradient(90deg,#fff 0%,#fce7f3 30%,#fbcfe8 50%,#fce7f3 70%,#fff 100%)",
                                backgroundSize: "200% auto",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                animation: "wdShimmer 3s linear infinite",
                            }}
                        >
                            Happy Women's Day! 🌸
                        </h1>

                        <p style={{ margin: "14px 0 0", fontSize: 15, color: "rgba(255,255,255,0.88)", lineHeight: 1.6, position: "relative" }}>
                            To every woman who dares to dream, lead, and inspire — <strong>you are extraordinary.</strong> 💜
                        </p>

                        {/* close ✕ */}
                        <button
                            onClick={handleClose}
                            aria-label="Close"
                            style={{
                                position: "absolute",
                                top: 14,
                                right: 14,
                                background: "rgba(255,255,255,0.15)",
                                border: "1px solid rgba(255,255,255,0.25)",
                                borderRadius: "50%",
                                width: 34,
                                height: 34,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#fff",
                                fontSize: 18,
                                lineHeight: 1,
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.3)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)")}
                        >
                            ✕
                        </button>
                    </div>

                    {/* ── Body ── */}
                    <div
                        style={{
                            background: "linear-gradient(180deg,#1a0a1e 0%,#120819 100%)",
                            padding: "28px 32px 32px",
                            textAlign: "center",
                        }}
                    >
                        {/* emoji row */}
                        <div style={{ fontSize: 32, letterSpacing: 6, marginBottom: 20, animation: "wdPulse 2s ease-in-out infinite" }}>
                            🌺 💐 🦋 🌷 ✨ 🌸
                        </div>

                        {/* message cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                            {[
                                { e: "💪", t: "Strength", d: "Unstoppable force in every challenge" },
                                { e: "🧠", t: "Wisdom", d: "Brilliance that lights up the world" },
                                { e: "💜", t: "Compassion", d: "Hearts that hold the universe together" },
                                { e: "🚀", t: "Ambition", d: "Dreams that redefine what's possible" },
                            ].map((c) => (
                                <div
                                    key={c.t}
                                    style={{
                                        background: "rgba(244,114,182,0.08)",
                                        border: "1px solid rgba(244,114,182,0.2)",
                                        borderRadius: 14,
                                        padding: "14px 12px",
                                        transition: "transform 0.2s, border-color 0.2s",
                                    }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(244,114,182,0.5)"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(244,114,182,0.2)"; }}
                                >
                                    <div style={{ fontSize: 24, marginBottom: 6 }}>{c.e}</div>
                                    <div style={{ fontWeight: 700, fontSize: 13, color: "#f9a8d4", marginBottom: 3 }}>{c.t}</div>
                                    <div style={{ fontSize: 11, color: "rgba(200,180,210,0.7)", lineHeight: 1.4 }}>{c.d}</div>
                                </div>
                            ))}
                        </div>

                        {/* from Siddhi Dynamics */}
                        <p style={{ fontSize: 14, color: "rgba(200,180,210,0.65)", marginBottom: 22, lineHeight: 1.6 }}>
                            With love &amp; respect,<br />
                            <span style={{ color: "#f9a8d4", fontWeight: 700 }}>Team Siddhi Dynamics 🌟</span>
                        </p>

                        {/* ── Instagram-style Thank-you button ── */}
                        {!thanked ? (
                            <HeartButton onThank={handleThank} />
                        ) : (
                            <div
                                style={{
                                    background: "linear-gradient(135deg,rgba(244,114,182,0.15),rgba(167,139,250,0.15))",
                                    border: "1px solid rgba(244,114,182,0.35)",
                                    borderRadius: 16,
                                    padding: "14px 24px",
                                    color: "#f9a8d4",
                                    fontWeight: 700,
                                    fontSize: 15,
                                    animation: "wdPulse 1.5s ease-in-out infinite",
                                }}
                            >
                                💜 Thank you for celebrating with us!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

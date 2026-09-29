import React from "react";
import { motion } from "framer-motion";

// Floating sacred golden sparkles and petals
export const FloatingAuspiciousParticles: React.FC = () => {
  const particles = [
    { id: 1, x: "10%", size: 6, duration: 8, delay: 0 },
    { id: 2, x: "25%", size: 4, duration: 10, delay: 2 },
    { id: 3, x: "45%", size: 5, duration: 9, delay: 1 },
    { id: 4, x: "65%", size: 7, duration: 11, delay: 3 },
    { id: 5, x: "80%", size: 4, duration: 7, delay: 0.5 },
    { id: 6, x: "92%", size: 6, duration: 12, delay: 2.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-[0_0_8px_#F59E0B]"
          style={{
            left: p.x,
            width: p.size,
            height: p.size,
            bottom: "-10px",
          }}
          animate={{
            y: ["0vh", "-110vh"],
            x: ["0px", "20px", "-20px", "0px"],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.6, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated Sacred Diya with flickering aura
export const FlickeringDiya: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = "" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Golden divine aura glow */}
      <motion.div
        className="absolute -top-1 w-8 h-8 rounded-full bg-amber-400/40 blur-md pointer-events-none"
        animate={{
          scale: [0.9, 1.3, 1, 1.25, 0.95],
          opacity: [0.5, 0.85, 0.6, 0.9, 0.5],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span className="relative z-10 text-2xl select-none filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
        🪔
      </span>
    </div>
  );
};

// Traditional Scalloped Sanctum Arch (Jharokha shape from user attached image 1)
export const JharokhaArchWrapper: React.FC<{
  children: React.ReactNode;
  imageUrl?: string;
  className?: string;
}> = ({ children, imageUrl, className = "" }) => {
  return (
    <div className={`relative p-2.5 rounded-[2rem] bg-gradient-to-b from-[#D97706]/40 via-[#8B1E1E]/30 to-[#B45309]/50 shadow-2xl ${className}`}>
      {/* Authentic Scalloped Jharokha Arch Outline */}
      <div className="relative rounded-[1.8rem] overflow-hidden bg-[#FBF8F1] border-2 border-[#D97706]/70 shadow-inner">
        {/* Top Jharokha Crown Ornament */}
        <div className="absolute top-0 inset-x-0 h-10 flex items-center justify-center z-10 pointer-events-none">
          <svg viewBox="0 0 200 40" className="w-48 h-8 text-[#8B1E1E] fill-current drop-shadow-sm">
            <path d="M100 0 C94 14 75 16 60 20 C45 24 25 18 0 28 L0 32 C30 26 50 30 100 8 C150 30 170 26 200 32 L200 28 C175 18 155 24 140 20 C125 16 106 14 100 0 Z" />
            <circle cx="100" cy="4" r="3" fill="#F59E0B" />
          </svg>
        </div>

        {children}
      </div>
    </div>
  );
};

// Authentic Divine Trishool (Trishula) Icon
export const TrishoolIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${className}`}
    >
      <defs>
        <linearGradient id="trishoolGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      {/* Central Sharp Spear / Blade */}
      <path
        d="M12 1.5L13.6 6C13.8 8 13.4 9.8 12 11C10.6 9.8 10.2 8 10.4 6L12 1.5Z"
        fill="url(#trishoolGoldGradient)"
        stroke="#78350F"
        strokeWidth="0.6"
      />
      {/* Left Curved Flame Prong */}
      <path
        d="M4.5 4.5C5.8 7.5 7.8 11.2 11.4 11.8C10.4 10.4 9.2 8.6 8.5 6.2L8.2 4.8L6.8 5.2L4.5 4.5Z"
        fill="url(#trishoolGoldGradient)"
        stroke="#78350F"
        strokeWidth="0.6"
      />
      {/* Right Curved Flame Prong */}
      <path
        d="M19.5 4.5C18.2 7.5 16.2 11.2 12.6 11.8C13.6 10.4 14.8 8.6 15.5 6.2L15.8 4.8L17.2 5.2L19.5 4.5Z"
        fill="url(#trishoolGoldGradient)"
        stroke="#78350F"
        strokeWidth="0.6"
      />
      {/* Central Lotus Socket / Ring */}
      <ellipse cx="12" cy="12.5" rx="2.2" ry="1.2" fill="url(#trishoolGoldGradient)" stroke="#78350F" strokeWidth="0.5" />
      {/* Shaft */}
      <rect x="11.1" y="13.2" width="1.8" height="8.8" rx="0.9" fill="url(#trishoolGoldGradient)" stroke="#78350F" strokeWidth="0.4" />
      {/* Base Spear Point */}
      <path d="M10.8 22L12 23.8L13.2 22H10.8Z" fill="url(#trishoolGoldGradient)" stroke="#78350F" strokeWidth="0.3" />
    </svg>
  );
};

// Consecrated Divine Lotus (Padma) Icon with rose-pink petals & gold outline
export const LotusIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] ${className}`}
    >
      <defs>
        <linearGradient id="lotusPinkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="60%" stopColor="#DB2777" />
          <stop offset="100%" stopColor="#9D174D" />
        </linearGradient>
        <linearGradient id="lotusGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      {/* Central Petal */}
      <path
        d="M12 3C11 6.5 9.5 11 12 16.5C14.5 11 13 6.5 12 3Z"
        fill="url(#lotusPinkGrad)"
        stroke="url(#lotusGoldGrad)"
        strokeWidth="0.75"
      />
      {/* Left Inner Petal */}
      <path
        d="M12 7.5C9.5 9 7.2 12.2 9.5 16.5C10.8 13.8 11.8 10.5 12 7.5Z"
        fill="url(#lotusPinkGrad)"
        stroke="url(#lotusGoldGrad)"
        strokeWidth="0.75"
      />
      {/* Right Inner Petal */}
      <path
        d="M12 7.5C14.5 9 16.8 12.2 14.5 16.5C13.2 13.8 12.2 10.5 12 7.5Z"
        fill="url(#lotusPinkGrad)"
        stroke="url(#lotusGoldGrad)"
        strokeWidth="0.75"
      />
      {/* Left Outer Broad Petal */}
      <path
        d="M9.5 12C6.5 12.8 4 14.8 6.5 18.5C9 18 10.5 15.5 11 14L9.5 12Z"
        fill="url(#lotusPinkGrad)"
        stroke="url(#lotusGoldGrad)"
        strokeWidth="0.75"
      />
      {/* Right Outer Broad Petal */}
      <path
        d="M14.5 12C17.5 12.8 20 14.8 17.5 18.5C15 18 13.5 15.5 13 14L14.5 12Z"
        fill="url(#lotusPinkGrad)"
        stroke="url(#lotusGoldGrad)"
        strokeWidth="0.75"
      />
      {/* Bottom Lotus Calyx base */}
      <path
        d="M7.5 18.5C10.5 20.2 13.5 20.2 16.5 18.5C15 20.5 13.8 21.5 12 21.5C10.2 21.5 9 20.5 7.5 18.5Z"
        fill="url(#lotusGoldGrad)"
        stroke="#92400E"
        strokeWidth="0.5"
      />
    </svg>
  );
};


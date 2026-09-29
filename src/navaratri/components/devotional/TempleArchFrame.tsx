import { navaratriAsset } from "../../utils/navaratriAssets";
import React from "react";

interface TempleArchFrameProps {
  children: React.ReactNode;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  badge?: string;
}

export const TempleArchFrame: React.FC<TempleArchFrameProps> = ({
  children,
  imageUrl,
  title,
  subtitle,
  className = "",
  badge
}) => {
  return (
    <div
      className={`relative flex flex-col items-center bg-[#FBF8F1] border-2 border-[#D97706]/40 rounded-3xl p-4 shadow-xl overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(rgba(251,248,241,.92), rgba(251,248,241,.96)), url("${navaratriAsset("/navaratri/assets/green-ornamental-label.jpg")}")`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Decorative Jharokha / Temple Pinnacle SVG motif */}
      <div className="flex items-center justify-center w-full mb-3 text-[#B45309]">
        <svg viewBox="0 0 160 36" className="h-7 w-auto fill-current opacity-80" aria-hidden="true">
          <path d="M80 0 C76 12 60 14 50 18 C40 22 25 18 0 24 L0 28 C25 24 45 28 80 10 C115 28 135 24 160 28 L160 24 C135 18 120 22 110 18 C100 14 84 12 80 0 Z" />
          <circle cx="80" cy="4" r="3" />
        </svg>
      </div>

      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9A241C] text-[#FFFBEB] text-xs font-semibold tracking-wide uppercase shadow-sm mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
          {badge}
        </div>
      )}

      {/* Sanctum Arch Wrapper */}
      <div className="relative w-full max-w-sm aspect-[4/5] rounded-[2.5rem] p-2 bg-gradient-to-b from-[#D97706]/20 via-[#B45309]/10 to-transparent border-2 border-[#D97706]/60 shadow-inner flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || "Maa Darshan"}
            className="w-full h-full object-cover rounded-[2.2rem] shadow-md transition-transform hover:scale-105 duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#FEF3C7]/40 rounded-[2.2rem] p-4 text-center">
            <span className="text-4xl mb-2">🪔</span>
            <p className="text-sm font-medium text-[#78350F]">Sacred Sanctum Darshan</p>
          </div>
        )}

        {/* Bottom sacred lotus glow */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#1F1914]/80 via-[#1F1914]/30 to-transparent flex flex-col justify-end p-4 text-white text-center">
          {title && <h3 className="text-lg font-bold drop-shadow-sm font-serif">{title}</h3>}
          {subtitle && <p className="text-xs text-amber-200 font-medium drop-shadow-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="w-full mt-4">
        {children}
      </div>

      {/* Kolam baseline ornament */}
      <div className="mt-3 flex items-center justify-center gap-1 text-[#B45309]/60">
        <span className="w-1 h-1 rounded-full bg-current" />
        <span className="w-6 h-[1px] bg-current" />
        <span className="w-2 h-2 rotate-45 border border-current" />
        <span className="w-6 h-[1px] bg-current" />
        <span className="w-1 h-1 rounded-full bg-current" />
      </div>
    </div>
  );
};

import React from "react";

interface MandapamIconProps {
  className?: string;
  size?: number;
}

export const MandapamIcon: React.FC<MandapamIconProps> = ({ className = "w-5 h-5", size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      {/* Sacred Kalash & Flag on top of Gopuram */}
      <path d="M12 2v2.5" className="stroke-amber-600" strokeWidth="2" />
      <circle cx="12" cy="4.5" r="1" className="fill-amber-500 stroke-none" />
      <path d="M12 2.5l2 1.5-2 1" className="fill-amber-500 stroke-amber-600" strokeWidth="1" />

      {/* Mandapam Gopuram Arch / Shikhara Roof */}
      <path
        d="M6 9.5c1.5-2 3.5-3.5 6-3.5s4.5 1.5 6 3.5"
        className="stroke-[#8B1E1E]"
        strokeWidth="1.75"
      />
      <path
        d="M4.5 10.5h15l-1.5-2.5h-12z"
        className="fill-amber-100/60 stroke-amber-700"
        strokeWidth="1.5"
      />

      {/* Decorative Thoranam Garland under Roof */}
      <path
        d="M5 11c1 .75 2 .75 3 0 1 .75 2 .75 3 0 1 .75 2 .75 3 0 1 .75 2 .75 3 0"
        className="stroke-amber-600"
        strokeWidth="1.25"
      />

      {/* Mandapam Ceremonial Pillars (Left, Center-Left, Center-Right, Right) */}
      <line x1="6" y1="12" x2="6" y2="20" className="stroke-[#8B1E1E]" strokeWidth="2" />
      <line x1="18" y1="12" x2="18" y2="20" className="stroke-[#8B1E1E]" strokeWidth="2" />
      <line x1="10" y1="13.5" x2="10" y2="20" className="stroke-amber-800" strokeWidth="1.5" />
      <line x1="14" y1="13.5" x2="14" y2="20" className="stroke-amber-800" strokeWidth="1.5" />

      {/* Inner Sacred Peetham / Sanctum Arch */}
      <path
        d="M9 16c0-1.66 1.34-3 3-3s3 1.34 3 3"
        className="stroke-amber-600"
        strokeWidth="1.25"
      />
      {/* Sacred Deepam Flame in Sanctum */}
      <ellipse cx="12" cy="18" rx="1" ry="1.5" className="fill-amber-500 stroke-none" />

      {/* Mandapam Plinth / Stepped Base (Jagati) */}
      <line x1="4" y1="20" x2="20" y2="20" className="stroke-stone-800" strokeWidth="2" />
      <line x1="2.5" y1="22" x2="21.5" y2="22" className="stroke-stone-900" strokeWidth="2" />
    </svg>
  );
};

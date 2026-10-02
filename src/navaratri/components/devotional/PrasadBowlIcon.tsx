import React from "react";

interface PrasadBowlIconProps {
  className?: string;
  size?: number;
}

export const PrasadBowlIcon: React.FC<PrasadBowlIconProps> = ({ className = "w-4 h-4", size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      {/* Sacred Naivedhyam Steam / Fragrance curls */}
      <path d="M8 3c0 1.5-1 2-1 3.5" className="stroke-amber-500" strokeWidth="1.75" />
      <path d="M12 2c0 1.5-1 2-1 3.5" className="stroke-amber-600" strokeWidth="1.75" />
      <path d="M16 3c0 1.5-1 2-1 3.5" className="stroke-amber-500" strokeWidth="1.75" />

      {/* Traditional Prasad Offering Mound / Modak / Sweet Dome */}
      <path
        d="M6 10c0-3.3 2.7-6 6-6s6 2.7 6 6"
        className="fill-amber-300/30 stroke-amber-600"
        strokeWidth="1.5"
      />

      {/* Sacred Traditional Brass Bowl */}
      <path
        d="M2 10h20c0 5.52-4.48 10-10 10S2 15.52 2 10z"
        className="fill-amber-400/20 stroke-current"
      />

      {/* Bowl Base / Pedestal */}
      <path d="M8 20h8v1.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5V20z" className="fill-current" />
      
      {/* Auspicious Kumkum / Chintamani mark in center */}
      <circle cx="12" cy="14" r="1.5" className="fill-[#8B1E1E] stroke-none" />
    </svg>
  );
};

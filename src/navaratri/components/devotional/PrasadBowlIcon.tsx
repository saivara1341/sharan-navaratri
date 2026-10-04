import React from "react";

interface PrasadBowlIconProps {
  className?: string;
  size?: number;
}

export const PrasadBowlIcon: React.FC<PrasadBowlIconProps> = ({ className = "w-4 h-4", size }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      {/* Divine Sacred Steam / Fragrance curls */}
      <path
        d="M11 5c-0.6 1.4 0.6 2.4 0 3.8"
        stroke="#F59E0B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 3.5c-0.6 1.6 0.6 2.6 0 4.2"
        stroke="#D97706"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M21 5c-0.6 1.4 0.6 2.4 0 3.8"
        stroke="#F59E0B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Sacred Tulasi (Holy Basil) Leaf atop the Prasad */}
      <path
        d="M16 8.5C15 9.5 14.5 11 16 12C17.5 11 17 9.5 16 8.5Z"
        fill="#16A34A"
        stroke="#15803D"
        strokeWidth="0.75"
      />
      <path d="M16 9.5V11.5" stroke="#BBF7D0" strokeWidth="0.5" strokeLinecap="round" />

      {/* Sacred Sweet Offerings / Modak / Laddu / Payasam Mound */}
      <ellipse cx="11.5" cy="15.5" rx="4.5" ry="3.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
      <ellipse cx="20.5" cy="15.5" rx="4.5" ry="3.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
      <path
        d="M16 9.5C13.8 11.5 13 14 13 16C13 17 14.3 17.5 16 17.5C17.7 17.5 19 17 19 16C19 14 18.2 11.5 16 9.5Z"
        fill="#FDE68A"
        stroke="#B45309"
        strokeWidth="1"
      />

      {/* Sacred Kumkum / Sindoor Bindi on central Prasad */}
      <circle cx="16" cy="14" r="1" fill="#DC2626" />

      {/* Traditional Golden Brass Pooja Thali / Bowl Rim */}
      <ellipse
        cx="16"
        cy="18.5"
        rx="13.5"
        ry="4.5"
        fill="#F59E0B"
        stroke="#92400E"
        strokeWidth="1.25"
      />
      {/* Inner Thali Rim */}
      <ellipse
        cx="16"
        cy="18"
        rx="11.5"
        ry="3.5"
        fill="#FEF3C7"
        stroke="#D97706"
        strokeWidth="0.75"
      />

      {/* Brass Bowl Body / Deep Curved Vessel */}
      <path
        d="M2.5 18.5C3.2 24.5 8.5 28 16 28C23.5 28 28.8 24.5 29.5 18.5H2.5Z"
        fill="#D97706"
        stroke="#78350F"
        strokeWidth="1.25"
      />

      {/* Radial Metallic Highlight on Bowl */}
      <path
        d="M6 20C8 24.5 11.5 26.5 16 26.5C20.5 26.5 24 24.5 26 20C22.5 23 18.5 24 16 24C13.5 24 9.5 23 6 20Z"
        fill="#FDE68A"
        fillOpacity="0.45"
      />

      {/* Auspicious Lotus Pedestal / Base Stand */}
      <path
        d="M10 27.5H22C21.5 29.5 19 30.5 16 30.5C13 30.5 10.5 29.5 10 27.5Z"
        fill="#92400E"
        stroke="#78350F"
        strokeWidth="1"
      />

      {/* Auspicious Chintamani Gem in Center of Vessel */}
      <circle cx="16" cy="22.5" r="1.5" fill="#DC2626" stroke="#FEF2F2" strokeWidth="0.5" />
    </svg>
  );
};

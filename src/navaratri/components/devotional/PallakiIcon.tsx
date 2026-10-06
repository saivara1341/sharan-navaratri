import React from "react";

interface PallakiIconProps { className?: string; size?: number; }

/** Original temple palanquin icon used consistently for Pallaki Seva. */
export const PallakiIcon: React.FC<PallakiIconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} style={size ? { width: size, height: size } : undefined} aria-hidden="true">
    <path d="M2 22h28M4 19.5h24M5 22v3M27 22v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 19V13h16v6M6 13h20l-2-3H8l-2 3Z" fill="currentColor" fillOpacity=".14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9.5 10c1.3-3.2 3.5-5 6.5-5s5.2 1.8 6.5 5M13 5.3V3.5h6v1.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10.5 19v-3.8M16 19v-4.8M21.5 19v-3.8M2 16h5M25 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="16" cy="11.4" r="1.2" fill="#F59E0B" />
  </svg>
);

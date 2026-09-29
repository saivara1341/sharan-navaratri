import React from "react";

export type AuspiciousRibbonVariant =
  | "maroon-gold"
  | "pearl-floral"
  | "royal-mandir"
  | "emerald-vine"
  | "kolam-lace";

interface AuspiciousRibbonBorderProps {
  variant?: AuspiciousRibbonVariant;
  className?: string;
  heightClass?: string;
  flipVertical?: boolean;
  fullBleed?: boolean;
}

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

const RIBBON_URLS: Record<AuspiciousRibbonVariant, string> = {
  "maroon-gold": `${base}/navaratri/assets/festive-gold-maroon-ribbon.png`,
  "pearl-floral": `${base}/navaratri/assets/festive-pearl-floral-ribbon.png`,
  "royal-mandir": `${base}/navaratri/assets/festive-royal-mandir-ribbon.png`,
  "emerald-vine": `${base}/navaratri/assets/festive-emerald-vine-ribbon.png`,
  "kolam-lace": `${base}/navaratri/assets/festive-kolam-lace-ribbon.png`
};

export const AuspiciousRibbonBorder: React.FC<AuspiciousRibbonBorderProps> = ({
  variant = "maroon-gold",
  className = "",
  heightClass = "h-5 sm:h-6",
  flipVertical = false,
  fullBleed = true
}) => {
  const ribbonUrl = RIBBON_URLS[variant] || RIBBON_URLS["maroon-gold"];

  return (
    <div
      aria-hidden="true"
      className={`relative pointer-events-none select-none overflow-hidden rounded-none ${heightClass} ${
        fullBleed ? "w-screen left-1/2 -translate-x-1/2" : "w-full"
      } ${flipVertical ? "rotate-180" : ""} ${className}`}
      style={{
        backgroundImage: `url('${ribbonUrl}')`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
        backgroundPosition: "center"
      }}
    />
  );
};

interface FestiveFramedSectionProps {
  children: React.ReactNode;
  variant?: AuspiciousRibbonVariant;
  className?: string;
  topRibbon?: boolean;
  bottomRibbon?: boolean;
}

export const FestiveFramedSection: React.FC<FestiveFramedSectionProps> = ({
  children,
  variant = "maroon-gold",
  className = "",
  topRibbon = true,
  bottomRibbon = true
}) => {
  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      {topRibbon && <AuspiciousRibbonBorder variant={variant} heightClass="h-4 sm:h-5" />}
      <div className="relative z-10">{children}</div>
      {bottomRibbon && (
        <AuspiciousRibbonBorder variant={variant} heightClass="h-4 sm:h-5" flipVertical />
      )}
    </div>
  );
};

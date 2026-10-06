import React from "react";
import { navaratriAsset } from "../../utils/navaratriAssets";

type Placement = "top" | "bottom" | "inline" | "side-left" | "side-right";

const creatives: Record<Placement, { src: string; alt: string; position: string }> = {
  top: {
    src: "/navaratri/assets/ads/printflow-logo-banner.jpeg",
    alt: "PrintFlow — Print everything. Delivered fast.",
    position: "object-center"
  },
  bottom: {
    src: "/navaratri/assets/ads/printflow-marketplace.jpeg",
    alt: "PrintFlow print-on-demand marketplace",
    position: "object-[45%_48%]"
  },
  inline: {
    src: "/navaratri/assets/ads/siddhi-race-poster.jpeg",
    alt: "Siddhi Dynamics — Automate, build, rank, grow.",
    position: "object-[50%_43%]"
  },
  "side-left": {
    src: "/navaratri/assets/ads/siddhi-race-poster.jpeg",
    alt: "Siddhi Dynamics — We do not just compete.",
    position: "object-[50%_42%]"
  },
  "side-right": {
    src: "/navaratri/assets/ads/siddhi-growth-poster.jpeg",
    alt: "Siddhi Dynamics — We build systems. You lead the market.",
    position: "object-[50%_48%]"
  }
};

interface NavaratriPlatformAdProps {
  placement: Placement;
  className?: string;
}

/** A supplied platform-partner creative shown only while a paid ad frame is empty. */
export const NavaratriPlatformAd: React.FC<NavaratriPlatformAdProps> = ({ placement, className = "" }) => {
  const creative = creatives[placement];

  return (
    <div className={`relative h-full w-full overflow-hidden bg-stone-950 ${className}`}>
      <img
        src={navaratriAsset(creative.src)}
        alt={creative.alt}
        className={`h-full w-full object-cover ${creative.position}`}
      />
      <span className="absolute left-2 top-2 rounded-full border border-white/35 bg-black/65 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/95 shadow-sm backdrop-blur-sm">
        Featured partner
      </span>
    </div>
  );
};

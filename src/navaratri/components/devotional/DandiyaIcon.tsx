import React from "react";
import { navaratriAsset } from "../../utils/navaratriAssets";

export const DandiyaIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <span
    role="img"
    aria-label="Dandiya & Activities"
    className={`inline-block shrink-0 bg-current transition-colors ${className}`}
    style={{
      maskImage: `url('${navaratriAsset("/navaratri/assets/dandiya-dance-silhouette.png")}')`,
      WebkitMaskImage: `url('${navaratriAsset("/navaratri/assets/dandiya-dance-silhouette.png")}')`,
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskPosition: "center",
      WebkitMaskPosition: "center",
    }}
  />
);

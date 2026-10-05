import React from "react";
import { navaratriAsset } from "../../utils/navaratriAssets";

interface HomaKundaIconProps {
  className?: string;
  size?: number | string;
  alt?: string;
  inline?: boolean;
}

/**
 * Checks whether an event, pooja, activity, or title represents a Homam / Homa / Yagnam / Havan ritual.
 */
export function isHomamEvent(item?: {
  title?: string;
  name?: string;
  category?: string;
  type?: string;
  description?: string;
} | string | null): boolean {
  if (!item) return false;

  let combined = "";
  if (typeof item === "string") {
    combined = item;
  } else {
    combined = `${item.title || ""} ${item.name || ""} ${item.category || ""} ${item.type || ""} ${item.description || ""}`;
  }

  // Check for English and Indian language representations of Homam / Yagam / Havan
  const homamRegex = /(homam|homa|yagam|yagnam|yagna|havan|chandi\s*homam|rudra\s*homam|ganapathi\s*homam|maha\s*yagam|purnahuthi|purnahuti|kunda|హోమం|హోమ|యాగం|యజ్ఞం|పూర్ణాహుతి|हवन|होम|यज्ञ)/i;

  return homamRegex.test(combined);
}

/**
 * HomaKundaIcon
 * Renders the sacred Vedic Homa / Yagna Kunda with divine sacrificial flames.
 * Created directly from the user's authentic devotional icon asset.
 */
export const HomaKundaIcon: React.FC<HomaKundaIconProps> = ({
  className = "w-5 h-5",
  size,
  alt = "Sacred Homa / Yagna Kunda",
  inline = false,
}) => {
  const imageSrc = navaratriAsset("/navaratri/assets/homam-icon.png");

  const style: React.CSSProperties = {
    objectFit: "contain",
    display: inline ? "inline-block" : "block",
  };

  if (size) {
    style.width = typeof size === "number" ? `${size}px` : size;
    style.height = typeof size === "number" ? `${size}px` : size;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`shrink-0 drop-shadow-xs select-none ${className}`}
      style={style}
    />
  );
};

export default HomaKundaIcon;

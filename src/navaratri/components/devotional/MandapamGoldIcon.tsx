import React from "react";
import { navaratriAsset } from "../../utils/navaratriAssets";

interface MandapamGoldIconProps {
  className?: string;
  size?: number | string;
  alt?: string;
  inline?: boolean;
}

/**
 * MandapamGoldIcon
 * Renders the ornate golden temple sanctum altar / mandapam with pillars, dome, and steps.
 * Created directly from the user's authentic devotional icon asset.
 */
export const MandapamGoldIcon: React.FC<MandapamGoldIconProps> = ({
  className = "w-6 h-6",
  size,
  alt = "Golden Temple Mandapam",
  inline = false,
}) => {
  const imageSrc = navaratriAsset("/navaratri/assets/mandapam-gold-sanctum.png");

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
      className={`shrink-0 drop-shadow-sm select-none ${className}`}
      style={style}
    />
  );
};

export default MandapamGoldIcon;

import { navaratriAsset } from "../../utils/navaratriAssets";
import React from "react";

interface KolamBorderProps {
  children: React.ReactNode;
  variant?: "terracotta" | "ivory" | "gold" | "green";
  className?: string;
}

export const KolamBorder: React.FC<KolamBorderProps> = ({
  children,
  variant = "terracotta",
  className = ""
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "terracotta":
        return "bg-[#9A241C] text-white border-4 border-[#C97A42]/60 shadow-xl";
      case "ivory":
        return "bg-[#FDFBF7] text-[#221A14] border-2 border-[#D97706]/40 shadow-md";
      case "gold":
        return "bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] text-[#78350F] border-2 border-[#D97706] shadow-lg";
      case "green":
        return "bg-[#1E3A2F] text-[#F3F4F6] border-2 border-[#10B981]/40 shadow-lg";
      default:
        return "bg-[#FDFBF7] text-[#221A14]";
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden p-1 transition-all ${getVariantStyles()} ${className}`}
      style={variant === "ivory" ? {
        backgroundImage: `linear-gradient(rgba(253,251,247,.9), rgba(253,251,247,.94)), url("${navaratriAsset("/navaratri/assets/scalloped-outline.jpg")}")`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      } : undefined}
    >
      {/* Kolam Ornamental Corner Dots */}
      <div className="absolute top-2 left-2 flex items-center gap-1 opacity-70 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-70 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      </div>
      <div className="absolute bottom-2 left-2 flex items-center gap-1 opacity-70 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      </div>
      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-70 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      </div>

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

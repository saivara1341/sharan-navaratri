import React, { useEffect } from "react";
import { Advertisement } from "../../types";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { Store, Phone, ExternalLink, MapPin } from "lucide-react";

interface SponsoredCardProps {
  ad: Advertisement;
  className?: string;
}

export const SponsoredCard: React.FC<SponsoredCardProps> = ({ ad, className = "" }) => {
  const { recordAdImpression, recordAdClick } = useNavaratriData();
  const { t } = useNavaratriLanguage();

  useEffect(() => {
    recordAdImpression(ad.id);
  }, [ad.id]);

  const handleClick = () => {
    recordAdClick(ad.id);
  };

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF6ED] to-[#FEF3C7] border border-amber-300 shadow-sm relative overflow-hidden space-y-2.5 ${className}`}>
      {/* Sponsored Pill Badge */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 flex items-center gap-1">
          <Store className="w-3 h-3 text-amber-800" />
          <span>{t.sponsored}</span>
        </span>
        <span className="text-[11px] text-stone-500 font-medium">
          {ad.targetCity} • {ad.category}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-sm text-[#8B1E1E]">
            {ad.businessName}
          </h4>
          <p className="text-xs text-stone-800 font-medium">
            {ad.title}
          </p>
          <p className="text-[11px] text-stone-600 line-clamp-2">
            {ad.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center gap-2">
          {ad.ctaUrl ? (
            <a
              href={ad.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="px-3.5 py-1.5 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{ad.ctaText || "Contact Store"}</span>
            </a>
          ) : (
            <a
              href={`tel:${ad.phone}`}
              onClick={handleClick}
              className="px-3.5 py-1.5 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call ({ad.phone})</span>
            </a>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-stone-500">
        <span className="flex items-center gap-1 truncate max-w-xs">
          <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
          {ad.address}
        </span>
        <span className="italic text-amber-800 shrink-0">
          Festival Verified Store
        </span>
      </div>
    </div>
  );
};

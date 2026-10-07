import React, { useEffect } from "react";
import { Advertisement } from "../../types";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { Store, Phone, ExternalLink, MapPin, Utensils, ShoppingBag } from "lucide-react";
import { navaratriAsset } from "../../utils/navaratriAssets";
import { getAdCtaDetails } from "../../utils/adButtonHelpers";
import { isSiddhiDynamicsAd } from "../../utils/adFrameHelpers";

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

  const ctaInfo = getAdCtaDetails(ad);
  const isSiddhiAd = isSiddhiDynamicsAd(ad);

  const renderIcon = () => {
    if (ctaInfo.iconName === "utensils") return <Utensils className="w-3.5 h-3.5" />;
    if (ctaInfo.iconName === "shopping-bag") return <ShoppingBag className="w-3.5 h-3.5" />;
    if (ctaInfo.type === "call") return <Phone className="w-3.5 h-3.5" />;
    return <ExternalLink className="w-3.5 h-3.5" />;
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

      {/* Optional Framed Image Preview if uploaded */}
      {ad.imageUrl && (
        <div className={`relative w-full rounded-xl overflow-hidden border border-amber-300/80 flex items-center justify-center my-1 ${isSiddhiAd ? "aspect-[16/9] bg-[#f8f4ec]" : "h-32 sm:h-40 bg-[#1e130e]"}`}>
          {!isSiddhiAd && (
            <div
              className="absolute inset-0 bg-cover bg-center blur-md opacity-30 scale-110 pointer-events-none"
              style={{ backgroundImage: `url("${navaratriAsset(ad.imageUrl)}")` }}
            />
          )}
          <img
            src={navaratriAsset(ad.imageUrl)}
            alt={ad.businessName}
            className={`relative z-10 mx-auto h-full w-full ${isSiddhiAd ? "object-cover" : "object-contain"}`}
          />
        </div>
      )}

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

        {/* Dynamic Action Button */}
        <div className="shrink-0 flex items-center gap-2">
          {ad.ctaUrl ? (
            <a
              href={ad.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] hover:from-[#F59E0B] hover:to-[#B45309] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
            >
              {renderIcon()}
              <span>{ctaInfo.label}</span>
            </a>
          ) : (
            <a
              href={`tel:${ad.phone}`}
              onClick={handleClick}
              className="px-3.5 py-1.5 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              {renderIcon()}
              <span>{ctaInfo.label || `Call (${ad.phone})`}</span>
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

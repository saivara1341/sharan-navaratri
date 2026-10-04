import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { ImagePlus, ExternalLink, Sparkles } from "lucide-react";
import { CreateAdModal } from "./CreateAdModal";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { AD_PLACEHOLDER_TRANSLATIONS } from "../../utils/navaratriTranslations";
import { navaratriAsset } from "../../utils/navaratriAssets";
import { getAdCtaDetails } from "../../utils/adButtonHelpers";

interface NavaratriAdsSpaceProps {
  currentCity?: string;
}

export const NavaratriAdsSpace: React.FC<NavaratriAdsSpaceProps> = ({
  currentCity = "Nizamabad"
}) => {
  const { language } = useNavaratriLanguage();
  const { advertisements, recordAdClick, recordAdImpression } = useNavaratriData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter real active ads with images (no mock text ads)
  const activeAdsWithImages = advertisements.filter(
    a => (a.status === "ACTIVE" || a.status === "APPROVED") && Boolean(a.imageUrl) && !a.id?.startsWith("ad-")
  );

  const currentAd = activeAdsWithImages[activeIndex];
  const ctaInfo = getAdCtaDetails(currentAd);

  // Track impression if active ad exists
  useEffect(() => {
    if (currentAd?.id) {
      recordAdImpression(currentAd.id);
    }
  }, [currentAd, recordAdImpression]);

  // Auto rotate ads if multiple ads exist
  useEffect(() => {
    if (activeAdsWithImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % activeAdsWithImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeAdsWithImages.length]);

  const handleContainerClick = () => {
    if (currentAd?.imageUrl) {
      recordAdClick(currentAd.id);
      const target = currentAd.ctaUrl || (currentAd.phone ? `tel:${currentAd.phone}` : undefined);
      if (target) {
        if (target.startsWith("http")) {
          window.open(target, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = target;
        }
        return;
      }
    }
    setIsModalOpen(true);
  };

  return (
    <section className="pt-2 font-sans">
      {currentAd?.imageUrl ? (
        /* Framed Active Image Banner: perfectly centered, not too below or out of frame */
        <div
          onClick={handleContainerClick}
          className="relative w-full h-40 sm:h-56 md:h-64 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-md hover:shadow-xl transition-all cursor-pointer bg-[#1e130e] flex items-center justify-center group"
          title={`Click to visit ${currentAd.businessName || "sponsor"}`}
        >
          {/* Ambient Backdrop matching image colors */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-lg opacity-30 scale-110 pointer-events-none"
            style={{ backgroundImage: `url("${navaratriAsset(currentAd.imageUrl)}")` }}
          />

          {/* User Image in Frame: object-contain preserves all content in frame */}
          <img
            src={navaratriAsset(currentAd.imageUrl)}
            alt={currentAd.businessName || "Advertisement"}
            className="w-full h-full object-contain relative z-10 mx-auto"
          />

          {/* Top Info Bar */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-amber-400/40 text-[10px] font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Sponsored
            </span>
            {currentAd.businessName && (
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[10px] font-semibold text-white/90">
                {currentAd.businessName}
              </span>
            )}
          </div>

          {/* Bottom-Right Clickable Dynamic Button */}
          <div className="absolute bottom-3 right-3 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleContainerClick();
              }}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] hover:from-[#F59E0B] hover:to-[#B45309] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-2xl transition-all transform active:scale-95 flex items-center gap-1.5 border border-amber-300/60 cursor-pointer"
            >
              <span>{ctaInfo.label}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Clean Empty Ad Container Slot */
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative w-full h-28 sm:h-36 rounded-3xl border-2 border-dashed border-amber-300/80 bg-amber-50/20 hover:bg-amber-100/40 hover:border-amber-400 transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group shadow-xs"
          title="Click to add image & run ad"
        >
          <div className="flex items-center gap-2 text-stone-400 group-hover:text-amber-800 transition-colors">
            <ImagePlus className="w-5 h-5 text-amber-500/70 group-hover:text-amber-600 transition-colors" />
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              {AD_PLACEHOLDER_TRANSLATIONS[language] || "Ad Space Available (Tap to add image & run ad)"}
            </span>
          </div>
        </div>
      )}

      {/* Run Your Ads link below the ad frame */}
      <div className="flex items-center justify-center pt-2.5 pb-1">
        <Link
          to="/navaratri/advertise"
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-xs sm:text-sm font-bold text-amber-900 shadow-2xs hover:shadow-xs transition-all group"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
          <span>Run Your Ads</span>
          <span className="text-amber-700 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
      {/* Modal to upload image, enter URL/phone, and make payment */}
      <CreateAdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setActiveIndex(0)}
      />
    </section>
  );
};

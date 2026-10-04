import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { ImagePlus, ExternalLink } from "lucide-react";
import { CreateAdModal } from "./CreateAdModal";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { AD_PLACEHOLDER_TRANSLATIONS } from "../../utils/navaratriTranslations";
import { navaratriAsset } from "../../utils/navaratriAssets";
import { getAdCtaDetails } from "../../utils/adButtonHelpers";

export const NavaratriTopAdBanner: React.FC = () => {
  const { language } = useNavaratriLanguage();
  const location = useLocation();
  const isHomePage =
    location.pathname === "/" ||
    location.pathname === "/navaratri" ||
    location.pathname === "/navaratri/";
  const { advertisements, recordAdClick, recordAdImpression } = useNavaratriData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only real active ads that have an image and are paid/approved (no mock text ads)
  const activeAdsWithImages = advertisements.filter(
    a => (a.status === "ACTIVE" || a.status === "APPROVED") && Boolean(a.imageUrl) && !a.id?.startsWith("ad-")
  );

  const currentAd = activeAdsWithImages[activeIndex];
  const ctaInfo = getAdCtaDetails(currentAd);

  // Track impressions if an ad is displayed
  useEffect(() => {
    if (currentAd?.id) {
      recordAdImpression(currentAd.id);
    }
  }, [currentAd, recordAdImpression]);

  // Auto rotate ads if multiple ads exist
  useEffect(() => {
    if (activeAdsWithImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % activeAdsWithImages.length);
    }, 7000);
    return () => clearInterval(timer);
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
    // If empty container clicked, open modal to upload image & make payment
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={`w-full max-w-7xl mx-auto px-3 sm:px-6 pt-2 sm:pt-3 pb-1 ${isHomePage ? "lg:hidden" : ""}`}>
        {currentAd?.imageUrl ? (
          /* Framed Ad Banner: 100% of user banner fits cleanly inside frame with dynamic CTA button */
          <div className="flex flex-col">
            <div
              onClick={handleContainerClick}
              className="relative w-full h-28 sm:h-36 md:h-40 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-md hover:shadow-lg transition-all cursor-pointer bg-[#1e130e] flex items-center justify-center group"
              title={`Advertisement: ${currentAd.businessName || "Special Festive Offer"}`}
            >
              {/* Ambient Blurred Backdrop */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-lg opacity-30 scale-110 pointer-events-none"
                style={{ backgroundImage: `url("${navaratriAsset(currentAd.imageUrl)}")` }}
              />

              {/* User Uploaded Image - object-contain ensures 0% cropping, stays centered in frame */}
              <img
                src={navaratriAsset(currentAd.imageUrl)}
                alt={currentAd.businessName || "Advertisement"}
                className="w-full h-full object-contain relative z-10 mx-auto"
              />

              {/* Top-Left Sponsor Pill (desktop only so it doesn't cover the image on mobile) */}
              <div className="hidden sm:flex absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 text-[9px] font-bold text-amber-200 uppercase tracking-wider items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Sponsored</span>
              </div>

              {/* Dynamic Clickable Action Button (desktop only so it doesn't cover the image on mobile) */}
              <div className="hidden sm:block absolute bottom-2 right-2 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContainerClick();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] hover:from-[#F59E0B] hover:to-[#B45309] text-white text-[11px] sm:text-xs font-bold shadow-md hover:shadow-xl transition-all transform active:scale-95 flex items-center gap-1.5 border border-amber-300/60 cursor-pointer"
                >
                  <span>{ctaInfo.label}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Mobile View: Sponsored badge and redirect button placed cleanly BELOW the ad frame (NEVER on the image) */}
            <div className="flex sm:hidden items-center justify-between gap-2.5 pt-2 px-1 text-xs flex-wrap">
              <div className="flex items-center gap-1.5 font-medium text-amber-900/90 flex-wrap min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span className="font-bold text-[11px] uppercase tracking-wider text-amber-800 shrink-0">
                  Sponsored
                </span>
                {currentAd.businessName && (
                  <span className="text-stone-800 font-bold text-xs whitespace-normal">
                    • {currentAd.businessName}
                  </span>
                )}
              </div>

              {/* Button to redirect to advertiser page */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleContainerClick();
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 active:scale-95 border border-amber-300/60 cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span>{ctaInfo.label}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty container slot: clean, ready for user / advertiser to add image */
          <div
            onClick={() => setIsModalOpen(true)}
            className="w-full h-20 sm:h-24 md:h-28 rounded-2xl border-2 border-dashed border-amber-300/80 bg-amber-50/30 hover:bg-amber-100/40 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-center p-3 shadow-xs group"
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
      </div>

      {/* Modal to upload image, enter URL/phone, and make payment */}
      <CreateAdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setActiveIndex(0)}
      />
    </>
  );
};

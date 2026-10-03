import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { ImagePlus } from "lucide-react";
import { CreateAdModal } from "./CreateAdModal";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { AD_PLACEHOLDER_TRANSLATIONS } from "../../utils/navaratriTranslations";

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
          /* When ad image is uploaded/paid: purely display image with NO text overlay */
          <div
            onClick={handleContainerClick}
            className="w-full h-24 sm:h-32 md:h-36 rounded-2xl overflow-hidden border border-amber-400/80 shadow-sm hover:shadow-md transition-all cursor-pointer bg-stone-900"
            title="Advertisement"
          >
            <img
              src={currentAd.imageUrl}
              alt="Advertisement"
              className="w-full h-full object-cover"
            />
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

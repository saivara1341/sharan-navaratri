import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  const navigate = useNavigate();
  const isHomePage =
    location.pathname === "/" ||
    location.pathname === "/navaratri" ||
    location.pathname === "/navaratri/";
  const { advertisements, recordAdClick, recordAdImpression } = useNavaratriData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const recordedAdIdRef = useRef<string | null>(null);

  // Only real active ads that have an image and are assigned to TOP frame (or BOTH, or unspecified)
  const activeAdsWithImages = advertisements.filter(
    a =>
      (a.status === "ACTIVE" || a.status === "APPROVED") &&
      Boolean(a.imageUrl) &&
      (!a.preferredFrame || a.preferredFrame === "TOP" || a.preferredFrame === "BOTH")
  );

  const currentAd = activeAdsWithImages[activeIndex];
  const ctaInfo = getAdCtaDetails(currentAd);
  const currentAdId = currentAd?.id;

  // Track impressions only once when ad changes
  useEffect(() => {
    if (currentAdId && recordedAdIdRef.current !== currentAdId) {
      recordedAdIdRef.current = currentAdId;
      recordAdImpression(currentAdId);
    }
  }, [currentAdId, recordAdImpression]);

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
    // If empty container clicked, navigate to advertise page with plans & contact button
    navigate("/navaratri/advertise");
  };

  return (
    <>
      {/* Top Ad Frame (Below Header): Displayed across both Mobile and Desktop views with In-Animation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-2 sm:pt-3 pb-1"
      >
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

              {/* CTA button — desktop only inside frame */}
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

            {/* Mobile action is below the image so no sponsor text covers the creative. */}
            <div className="flex sm:hidden items-center justify-end gap-2 pt-1.5 px-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleContainerClick();
                }}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 active:scale-95 border border-amber-300/60 cursor-pointer whitespace-nowrap"
              >
                <span>{ctaInfo.label}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty container slot: clean, ready for user / advertiser to add image in top frame */
          <div
            onClick={() => navigate("/navaratri/advertise")}
            className="w-full h-20 sm:h-24 md:h-28 rounded-2xl border-2 border-dashed border-amber-300/80 bg-amber-50/30 hover:bg-amber-100/40 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-center p-3 shadow-xs group"
            title="Click to view advertising plans and contact us"
          >
            <div className="flex items-center gap-2 text-stone-400 group-hover:text-amber-800 transition-colors">
              <ImagePlus className="w-5 h-5 text-amber-500/70 group-hover:text-amber-600 transition-colors" />
              <span className="text-xs sm:text-sm font-medium tracking-wide">
                {AD_PLACEHOLDER_TRANSLATIONS[language] || "Top Ad Frame Available (Tap to place ad below header)"}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal to upload image, enter URL/phone, and make payment */}
      <CreateAdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setActiveIndex(0)}
        defaultFrame="TOP"
      />
    </>
  );
};

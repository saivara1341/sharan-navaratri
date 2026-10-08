import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { ImagePlus, ExternalLink, Phone, MessageCircle } from "lucide-react";
import { CreateAdModal } from "./CreateAdModal";
import { PrintFlowWaitlistModal } from "./PrintFlowWaitlistModal";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { AD_PLACEHOLDER_TRANSLATIONS } from "../../utils/navaratriTranslations";
import { navaratriAsset } from "../../utils/navaratriAssets";
import { getAdCtaDetails } from "../../utils/adButtonHelpers";
import { isSiddhiDynamicsAd } from "../../utils/adFrameHelpers";

export const NavaratriBottomAdBanner: React.FC = () => {
  const { language } = useNavaratriLanguage();
  const navigate = useNavigate();
  const { advertisements, recordAdClick, recordAdImpression } = useNavaratriData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintFlowWaitlistOpen, setIsPrintFlowWaitlistOpen] = useState(false);

  // Real active ads that target the BOTTOM frame (or BOTH, or unspecified default)
  const activeAdsWithImages = advertisements.filter(
    a =>
      (a.status === "ACTIVE" || a.status === "APPROVED") &&
      Boolean(a.imageUrl) &&
      (!a.preferredFrame || a.preferredFrame === "BOTTOM" || a.preferredFrame === "BOTH")
  );

  const currentAd = activeAdsWithImages[activeIndex];
  const ctaInfo = getAdCtaDetails(currentAd);
  const isBusinessCard = currentAd?.format === "BUSINESS_CARD";
  const isSiddhiAd = isSiddhiDynamicsAd(currentAd);
  const cardPhone = (currentAd?.phone || "").replace(/\D/g, "");
  const cardWhatsapp = (currentAd?.whatsapp || currentAd?.phone || "").replace(/\D/g, "");

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentAd || !cardPhone) return;
    recordAdClick(currentAd.id);
    window.location.href = `tel:${cardPhone}`;
  };

  const handleWhatsapp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentAd || !cardWhatsapp) return;
    recordAdClick(currentAd.id);
    const num = cardWhatsapp.length === 10 ? `91${cardWhatsapp}` : cardWhatsapp;
    window.open(`https://wa.me/${num}`, "_blank", "noopener,noreferrer");
  };

  const currentAdId = currentAd?.id;
  const recordedAdIdRef = useRef<string | null>(null);

  // Track impressions only once per ad display
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

  const isPrintFlowAd = currentAd?.businessName?.toLowerCase().includes("printflow") || currentAd?.id?.includes("printflow");

  const handleContainerClick = () => {
    if (currentAd?.imageUrl) {
      recordAdClick(currentAd.id);
      if (isPrintFlowAd) {
        setIsPrintFlowWaitlistOpen(true);
        return;
      }
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
      {/* Bottom Ad Frame (Above Footer): Displayed across both Mobile and Desktop views with In-Animation */}
      <motion.section
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-2 pb-4 font-sans"
      >
        {currentAd?.imageUrl ? (
          <div className="flex flex-col">
            <div
              onClick={handleContainerClick}
              className={`relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-center group ${isSiddhiAd ? "mx-auto aspect-[16/9] h-auto w-full max-w-3xl bg-[#f8f4ec]" : "w-full h-32 sm:h-44 md:h-48 bg-[#1e130e]"}`}
              title={`Advertisement: ${currentAd.businessName || "Special Festive Offer"}`}
            >
              {/* Ambient Blurred Backdrop */}
              {!isSiddhiAd && (
                <div
                  className="absolute inset-0 bg-cover bg-center blur-lg opacity-30 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url("${navaratriAsset(currentAd.imageUrl)}")` }}
                />
              )}

              {/* User Uploaded Image - object-contain ensures 0% cropping, stays centered in frame */}
              <img
                src={navaratriAsset(currentAd.imageUrl)}
                alt={currentAd.businessName || "Advertisement"}
                className={`relative z-10 mx-auto h-full w-full ${isSiddhiAd ? "object-cover" : "object-contain"}`}
              />

              {/* Bottom-Right Dynamic Action Buttons (desktop view inside frame) */}
              <div className="hidden sm:flex absolute bottom-2.5 right-2.5 z-20 items-center gap-2">
                {isBusinessCard && cardPhone && (
                  <button
                    type="button"
                    onClick={handleCall}
                    className="px-3.5 py-1.5 rounded-xl bg-white/95 text-[#7A1F14] text-xs font-bold shadow-md flex items-center gap-1.5 border border-amber-300 active:scale-95 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </button>
                )}
                {isBusinessCard && cardWhatsapp && (
                  <button
                    type="button"
                    onClick={handleWhatsapp}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1FAF5A] text-white text-xs font-bold shadow-md flex items-center gap-1.5 border border-emerald-300 active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </button>
                )}
                {!isBusinessCard && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContainerClick();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] hover:from-[#F59E0B] hover:to-[#B45309] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-2xl transition-all transform active:scale-95 flex items-center gap-1.5 border border-amber-300/60 cursor-pointer"
                  >
                    <span>{ctaInfo.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile action sits below the creative; no sponsor label or business caption is shown. */}
            <div className="flex sm:hidden items-center justify-end gap-2 pt-2 px-1 text-xs flex-wrap">
              {isBusinessCard ? (
                <div className="flex items-center gap-1.5">
                  {cardPhone && (
                    <button
                      type="button"
                      onClick={handleCall}
                      className="px-3 py-1.5 rounded-xl bg-white text-[#7A1F14] text-xs font-bold border border-amber-300 flex items-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </button>
                  )}
                  {cardWhatsapp && (
                    <button
                      type="button"
                      onClick={handleWhatsapp}
                      className="px-3 py-1.5 rounded-xl bg-[#1FAF5A] text-white text-xs font-bold flex items-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleContainerClick}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <span>{ctaInfo.label}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Empty container slot: clean, ready for user / advertiser to add image in bottom frame */
          <div
            onClick={() => navigate("/navaratri/advertise")}
            className="w-full h-24 sm:h-32 md:h-36 rounded-2xl sm:rounded-3xl border-2 border-dashed border-amber-300/80 bg-amber-50/20 hover:bg-amber-100/40 hover:border-amber-400 transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group shadow-xs"
            title="Click to view advertising plans and contact us"
          >
            <div className="flex items-center gap-2 text-stone-400 group-hover:text-amber-800 transition-colors">
              <ImagePlus className="w-5 h-5 text-amber-500/70 group-hover:text-amber-600 transition-colors" />
              <span className="text-xs sm:text-sm font-medium tracking-wide">
                {AD_PLACEHOLDER_TRANSLATIONS[language] || "Bottom Ad Frame Available (Tap to place ad above footer)"}
              </span>
            </div>
          </div>
        )}

        {/* Run Your Ads leaf button below bottom ad frame */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <Link
            to="/navaratri/advertise"
            className="relative inline-flex items-center justify-center px-8 py-2.5 sm:px-10 sm:py-3 font-sans font-bold text-xs sm:text-sm tracking-wide text-white transition-all transform hover:scale-105 active:scale-95 group drop-shadow-md hover:drop-shadow-lg"
            title="Run Your Ads on Sharan Navaratri"
          >
            <svg
              viewBox="0 0 160 40"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full text-[#C12535] group-hover:text-[#A81B2B] transition-colors"
            >
              <path
                d="M 18 0 L 142 0 C 151 0, 157 12, 160 20 C 157 28, 151 40, 142 40 L 18 40 C 9 40, 3 28, 0 20 C 3 12, 9 0, 18 0 Z"
                fill="currentColor"
              />
            </svg>
            <span className="relative z-10 font-bold text-white select-none">
              Run Your Ads
            </span>
          </Link>
        </div>
      </motion.section>

      {/* Modal to upload image, enter URL/phone, and make payment */}
      <CreateAdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setActiveIndex(0)}
        defaultFrame="BOTTOM"
      />
      <PrintFlowWaitlistModal
        isOpen={isPrintFlowWaitlistOpen}
        onClose={() => setIsPrintFlowWaitlistOpen(false)}
      />
    </>
  );
};

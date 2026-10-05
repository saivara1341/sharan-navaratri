import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { ImagePlus, ExternalLink, Phone, MessageCircle } from "lucide-react";
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

  // Filter real active ads with images for BOTTOM frame (or BOTH, or unspecified)
  const activeAdsWithImages = advertisements.filter(
    a =>
      (a.status === "ACTIVE" || a.status === "APPROVED") &&
      Boolean(a.imageUrl) &&
      (!a.preferredFrame || a.preferredFrame === "BOTTOM" || a.preferredFrame === "BOTH")
  );

  const currentAd = activeAdsWithImages[activeIndex];
  const ctaInfo = getAdCtaDetails(currentAd);
  const isBusinessCard = currentAd?.format === "BUSINESS_CARD";
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

  // Track impression if active ad exists
  useEffect(() => {
    if (currentAdId && recordedAdIdRef.current !== currentAdId) {
      recordedAdIdRef.current = currentAdId;
      recordAdImpression(currentAdId);
    }
  }, [currentAdId, recordAdImpression]);

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
        <>
        {/* Framed Active Image Banner: perfectly centered, not too below or out of frame */}
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

          {/* Top Info Bar (desktop only so it NEVER covers the image on mobile) */}
          <div className="hidden sm:flex absolute top-3 left-3 z-20 items-center gap-2">
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

          {/* Bottom-Right Clickable Dynamic Button (desktop only so it NEVER covers the image on mobile) */}
          <div className="hidden sm:flex absolute bottom-3 right-3 z-20 items-center gap-2">
            {isBusinessCard && cardPhone && (
              <button
                type="button"
                onClick={handleCall}
                className="px-3.5 py-2 rounded-xl bg-white/95 text-[#7A1F14] text-sm font-bold shadow-lg flex items-center gap-1.5 border border-amber-300 active:scale-95 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </button>
            )}
            {isBusinessCard && cardWhatsapp && (
              <button
                type="button"
                onClick={handleWhatsapp}
                className="px-3.5 py-2 rounded-xl bg-[#1FAF5A] text-white text-sm font-bold shadow-lg flex items-center gap-1.5 border border-emerald-300 active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </button>
            )}
            {!isBusinessCard && <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleContainerClick();
              }}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] hover:from-[#F59E0B] hover:to-[#B45309] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-2xl transition-all transform active:scale-95 flex items-center gap-1.5 border border-amber-300/60 cursor-pointer"
            >
              <span>{ctaInfo.label}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>}
          </div>
        </div>

        {/* Mobile: Clean Sponsor & Action Bar below the image (NEVER covers the image) */}
        <div className="flex sm:hidden items-center justify-between gap-2.5 pt-2 px-1 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 font-medium text-amber-900/80 flex-wrap min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="font-bold text-[11px] uppercase tracking-wider text-amber-800 shrink-0">Sponsored</span>
            {currentAd.businessName && (
              <span className="text-stone-800 font-bold text-xs whitespace-normal">• {currentAd.businessName}</span>
            )}
          </div>
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
        </>
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

      {/* Run Your Ads button below the ad frame */}
      <div className="flex items-center justify-center pt-3 pb-1 mt-2 sm:mt-0">
        <Link
          to="/navaratri/advertise"
          className="relative inline-flex items-center justify-center px-8 py-2.5 sm:px-10 sm:py-3 font-sans font-bold text-xs sm:text-sm tracking-wide text-white transition-all transform hover:scale-105 active:scale-95 group drop-shadow-md hover:drop-shadow-lg"
          title="Run Your Ads on Sharan Navaratri"
        >
          {/* Pointed pill / leaf shape background matching reference design */}
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
      {/* Modal to upload image, enter URL/phone, and make payment */}
      <CreateAdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setActiveIndex(0)}
        defaultFrame="BOTTOM"
      />
    </section>
  );
};

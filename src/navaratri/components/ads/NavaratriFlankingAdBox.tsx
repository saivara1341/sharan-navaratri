import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { ImagePlus, Megaphone, ExternalLink, Store } from "lucide-react";
import { CreateAdModal } from "./CreateAdModal";
import { navaratriAsset } from "../../utils/navaratriAssets";
import { getAdCtaDetails } from "../../utils/adButtonHelpers";

interface NavaratriFlankingAdBoxProps {
  position: "left" | "right";
  className?: string;
}

export const NavaratriFlankingAdBox: React.FC<NavaratriFlankingAdBoxProps> = ({
  position,
  className = ""
}) => {
  const { advertisements, recordAdClick, recordAdImpression } = useNavaratriData();
  const [activeIndex, setActiveIndex] = useState(position === "right" ? 1 : 0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter approved/active sponsor ads with images
  const activeAdsWithImages = advertisements.filter(
    (a) => (a.status === "ACTIVE" || a.status === "APPROVED") && Boolean(a.imageUrl) && !a.id?.startsWith("ad-")
  );

  // Determine current ad for this slot
  const effectiveIndex = activeAdsWithImages.length > 0 ? activeIndex % activeAdsWithImages.length : 0;
  const currentAd = activeAdsWithImages[effectiveIndex];
  const ctaInfo = getAdCtaDetails(currentAd);

  // Track impressions
  useEffect(() => {
    if (currentAd?.id) {
      recordAdImpression(currentAd.id);
    }
  }, [currentAd, recordAdImpression]);

  // Auto-rotate ads if multiple exist
  useEffect(() => {
    if (activeAdsWithImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeAdsWithImages.length);
    }, 7000);
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
    <>
      <div className={`w-full h-full flex flex-col ${className}`}>
        {currentAd?.imageUrl ? (
          /* ACTIVE SPONSOR AD DISPLAY */
          <div
            onClick={handleContainerClick}
            className="w-full h-full min-h-[240px] rounded-3xl overflow-hidden border-2 border-amber-400 shadow-md hover:shadow-xl transition-all cursor-pointer bg-[#1e130e] flex flex-col items-center justify-between p-3 relative group"
            title={`Sponsor Advertisement: ${currentAd.businessName || ""}`}
          >
            {/* Ambient Blurred Backdrop */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-lg opacity-30 scale-110 pointer-events-none"
              style={{ backgroundImage: `url("${navaratriAsset(currentAd.imageUrl)}")` }}
            />

            {/* Top Badge */}
            <div className="relative z-10 w-full flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-amber-300/40 text-[10px] font-bold tracking-wider text-amber-200 uppercase flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Sponsored</span>
              </span>
              {currentAd.businessName && (
                <span className="text-[11px] font-semibold text-amber-100/90 truncate max-w-[120px] px-2 py-0.5 bg-black/40 rounded-full">
                  {currentAd.businessName}
                </span>
              )}
            </div>

            {/* Framed Image */}
            <div className="relative z-10 w-full flex-1 flex items-center justify-center my-2 overflow-hidden">
              <img
                src={navaratriAsset(currentAd.imageUrl)}
                alt={currentAd.businessName || "Sponsor Advertisement"}
                className="max-h-[140px] w-auto max-w-full object-contain mx-auto rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Bottom Dynamic CTA Button */}
            <div className="relative z-10 w-full pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleContainerClick();
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] hover:from-[#F59E0B] hover:to-[#B45309] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-1.5 border border-amber-300/60 cursor-pointer"
              >
                <span>{ctaInfo.label}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          /* EMPTY AD SPACE BOX (ELEGANT CALLOUT TO ADVERTISE) */
          <div
            onClick={() => setIsModalOpen(true)}
            className="w-full h-full min-h-[240px] rounded-3xl border-2 border-dashed border-amber-400/90 bg-gradient-to-b from-[#FFFDF8] via-[#FAF4EA] to-[#F5EEDB] p-3.5 xl:p-4 flex flex-col justify-between items-center text-center shadow-xs hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group relative overflow-hidden"
            title="Click to place your ad here"
          >
            {/* Subtle glow circles */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#8B1E1E]/5 rounded-full blur-xl pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10 w-full flex items-center justify-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-[#8B1E1E] text-[10px] font-black tracking-wider uppercase shadow-2xs">
                {position === "left" ? (
                  <>
                    <Megaphone className="w-3 h-3 text-[#8B1E1E]" />
                    <span>Festival Ad Space</span>
                  </>
                ) : (
                  <>
                    <Store className="w-3 h-3 text-[#8B1E1E]" />
                    <span>Sponsor Ad Space</span>
                  </>
                )}
              </span>
            </div>

            {/* Center Content */}
            <div className="relative z-10 my-auto py-2 flex flex-col items-center space-y-1.5">
              <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-2xl bg-amber-100/90 border-2 border-amber-300 flex items-center justify-center text-[#8B1E1E] shadow-inner group-hover:scale-110 group-hover:bg-amber-200 transition-all">
                <ImagePlus className="w-5 h-5 xl:w-6 xl:h-6 text-[#8B1E1E]" />
              </div>

              <div className="space-y-0.5 px-1">
                <h3 className="font-serif text-xs xl:text-sm font-black text-[#8B1E1E] leading-tight">
                  Ad Space Available
                </h3>
                <p className="text-[10px] xl:text-[11px] font-medium text-stone-600 leading-snug">
                  Promote your Mandapam, Business or Shop
                </p>
              </div>
            </div>

            {/* Bottom Button (Pointed leaf-pill design without arrow) */}
            <div className="relative z-10 w-full flex flex-col items-center gap-1 pt-1">
              <div
                className="relative inline-flex items-center justify-center px-5 py-2 font-sans font-bold text-xs tracking-wide text-white transition-all transform group-hover:scale-105 active:scale-95 drop-shadow-xs"
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
                <span className="relative z-10 font-bold text-white select-none text-[11px]">
                  Run Ads
                </span>
              </div>
              <Link
                to="/navaratri/advertise"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] text-amber-900/80 hover:text-amber-950 font-semibold underline decoration-amber-300 underline-offset-2 hover:decoration-amber-500"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}
      </div>

      <CreateAdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setActiveIndex(0)}
      />
    </>
  );
};

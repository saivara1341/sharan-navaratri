import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { ExternalLink } from "lucide-react";
import { CreateAdModal } from "./CreateAdModal";
import { navaratriAsset } from "../../utils/navaratriAssets";
import { getAdCtaDetails } from "../../utils/adButtonHelpers";
import { NavaratriPlatformAd } from "./NavaratriPlatformAd";

interface NavaratriFlankingAdBoxProps {
  position: "left" | "right";
  className?: string;
}

export const NavaratriFlankingAdBox: React.FC<NavaratriFlankingAdBoxProps> = ({
  position,
  className = ""
}) => {
  const navigate = useNavigate();
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
  const currentAdId = currentAd?.id;
  const recordedAdIdRef = useRef<string | null>(null);

  // Track impressions
  useEffect(() => {
    if (currentAdId && recordedAdIdRef.current !== currentAdId) {
      recordedAdIdRef.current = currentAdId;
      recordAdImpression(currentAdId);
    }
  }, [currentAdId, recordAdImpression]);

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
    navigate("/navaratri/advertise");
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
          <div className="h-full min-h-[240px] w-full overflow-hidden rounded-3xl border-2 border-amber-400 shadow-md">
            <NavaratriPlatformAd placement={position === "left" ? "side-left" : "side-right"} />
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

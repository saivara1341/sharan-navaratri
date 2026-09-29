import React, { useState, useEffect } from "react";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { ImagePlus, Sparkles, Megaphone, ArrowUpRight } from "lucide-react";
import { CreateAdModal } from "./CreateAdModal";

export const NavaratriHeroSideAd: React.FC = () => {
  const { advertisements, recordAdClick, recordAdImpression } = useNavaratriData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only real active ads that have an image and are paid/approved
  const activeAdsWithImages = advertisements.filter(
    (a) => (a.status === "ACTIVE" || a.status === "APPROVED") && Boolean(a.imageUrl) && !a.id?.startsWith("ad-")
  );

  const currentAd = activeAdsWithImages[activeIndex];

  // Track impressions if an ad is displayed
  useEffect(() => {
    if (currentAd?.id) {
      recordAdImpression(currentAd.id);
    }
  }, [currentAd, recordAdImpression]);

  // Auto rotate ads if multiple exist
  useEffect(() => {
    if (activeAdsWithImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeAdsWithImages.length);
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
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col">
        {currentAd?.imageUrl ? (
          /* Active Ad Display */
          <div
            onClick={handleContainerClick}
            className="w-full h-full min-h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400 shadow-lg hover:shadow-2xl transition-all cursor-pointer bg-stone-950 flex flex-col relative group"
            title="Sponsor Advertisement"
          >
            <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-amber-300/40 text-[10px] font-bold tracking-wider text-amber-200 uppercase">
              Sponsored
            </div>
            <img
              src={currentAd.imageUrl}
              alt="Sponsor Advertisement"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        ) : (
          /* Empty Sponsor Slot matching hero height on desktop */
          <div
            onClick={() => setIsModalOpen(true)}
            className="w-full h-full min-h-[360px] sm:min-h-[400px] lg:min-h-full rounded-2xl sm:rounded-3xl border-2 border-dashed border-amber-400/90 bg-gradient-to-b from-[#FFFDF8] via-[#FAF4EA] to-[#F5EEDB] p-5 sm:p-6 flex flex-col justify-between items-center text-center shadow-md hover:shadow-xl hover:border-amber-500 transition-all cursor-pointer group relative overflow-hidden"
            title="Click to add image & run ad"
          >
            {/* Subtle background glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#8B1E1E]/5 rounded-full blur-2xl pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10 w-full flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300/80 text-[#8B1E1E] text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-xs">
                <Megaphone className="w-3 h-3 text-[#8B1E1E]" />
                Festival Ad Space
              </span>
            </div>

            {/* Center Callout */}
            <div className="relative z-10 my-auto py-4 flex flex-col items-center space-y-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100/90 border-2 border-amber-300 flex items-center justify-center text-[#8B1E1E] shadow-inner group-hover:scale-110 group-hover:bg-amber-200 transition-all">
                <ImagePlus className="w-7 h-7 sm:w-8 sm:h-8 text-[#8B1E1E]" />
              </div>

              <div className="space-y-1 px-2">
                <h3 className="font-['Cinzel',serif] text-base sm:text-lg font-black text-[#8B1E1E] leading-tight">
                  Ad Space Available
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-amber-900/90">
                  (Tap to add image & run ad)
                </p>
                <p className="text-[11px] sm:text-xs text-stone-600 font-medium leading-relaxed pt-1 max-w-[240px]">
                  Promote your Mandapam, Business, or Navaratri Pooja to thousands of devotees.
                </p>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="relative z-10 w-full pt-2">
              <div className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8B1E1E] via-[#A82828] to-[#B45309] text-white text-xs sm:text-sm font-bold shadow-md group-hover:shadow-lg flex items-center justify-center gap-1.5 transition-all">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Run Festival Ad</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 shrink-0" />
              </div>
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

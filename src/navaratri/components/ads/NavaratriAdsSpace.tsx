import React, { useState, useEffect } from "react";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { ImagePlus } from "lucide-react";
import { CreateAdModal } from "./CreateAdModal";

interface NavaratriAdsSpaceProps {
  currentCity?: string;
}

export const NavaratriAdsSpace: React.FC<NavaratriAdsSpaceProps> = ({
  currentCity = "Nizamabad"
}) => {
  const { advertisements, recordAdClick, recordAdImpression } = useNavaratriData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter real active ads with images (no mock text ads)
  const activeAdsWithImages = advertisements.filter(
    a => (a.status === "ACTIVE" || a.status === "APPROVED") && Boolean(a.imageUrl) && !a.id?.startsWith("ad-")
  );

  const currentAd = activeAdsWithImages[activeIndex];

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
        /* Active Image Banner with NO text overlay */
        <div
          onClick={handleContainerClick}
          className="relative w-full h-36 sm:h-52 md:h-64 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-md hover:shadow-xl transition-all cursor-pointer bg-stone-900"
          title="Click to visit sponsor"
        >
          <img
            src={currentAd.imageUrl}
            alt="Advertisement"
            className="w-full h-full object-cover"
          />
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
              Ad Space Available (Tap to add image & run ad)
            </span>
          </div>
        </div>
      )}

      {/* Modal to upload image, enter URL/phone, and make payment */}
      <CreateAdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setActiveIndex(0)}
      />
    </section>
  );
};

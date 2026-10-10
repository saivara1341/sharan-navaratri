import { navaratriAsset } from "../../utils/navaratriAssets";
import { getMandapamMapsUrl, getMandapamFormattedAddress } from "../../utils/mandapamMaps";
import { toast } from "sonner";
import React from "react";
import { Link } from "react-router-dom";
import { Mandapam, Alankarana } from "../../types";
import { TempleArchFrame } from "../devotional/TempleArchFrame";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { FlickeringDiya } from "../devotional/SacredMotionGraphics";
import { MapPin, Clock, Share2, Utensils, Calendar, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface TodayDarshanHeroProps {
  mandapam: Mandapam;
  alankarana?: Alankarana;
  dayNumber?: number;
  poojaTiming?: string;
  annadanamTiming?: string;
}

export const TodayDarshanHero: React.FC<TodayDarshanHeroProps> = ({
  mandapam,
  alankarana,
  dayNumber = 1,
  poojaTiming = "Morning 07:30 AM | Evening 06:30 PM (Maha Harathi)",
  annadanamTiming = "12:30 PM - 03:30 PM (Kalyana Hall)"
}) => {
  const { t } = useNavaratriLanguage();

  const handleShare = () => {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    const url = `${window.location.origin}${base}/navaratri/m/${mandapam.slug}`;
    if (navigator.share) {
      navigator.share({
        title: `${alankarana?.deviName || mandapam.deviName} Darshan - ${mandapam.name}`,
        text: `Today's sacred Maa Darshan at ${mandapam.name}. Pooja: ${poojaTiming}. Check daily details and book free pass:`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Mandapam link copied to clipboard!");
    }
  };

  return (
    <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDC] border-2 border-amber-300 shadow-2xl p-6 sm:p-10 overflow-hidden">

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Column: Authentic Jharokha Arch Frame for Daily Physical Alankarana */}
        <div className="md:col-span-5 flex justify-center">
          <TempleArchFrame
            imageUrl={alankarana?.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg")}
            title={alankarana?.deviName || mandapam.deviName}
            subtitle={alankarana?.title || `Day ${dayNumber} Divya Alankarana`}
            badge={`Today's Darshan • Day ${dayNumber}`}
            className="w-full max-w-sm transform hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex items-center justify-between text-xs px-2 pt-1 text-stone-700">
              <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                Sanctum Darshan Active
              </span>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1 font-bold text-[#8B1E1E] hover:text-[#9A241C]"
              >
                <Share2 className="w-3.5 h-3.5" />
                {t.share}
              </button>
            </div>
          </TempleArchFrame>
        </div>

        {/* Right Column: Mandapam Schedule & Sanctum Information */}
        <div className="md:col-span-7 space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#8B1E1E] border border-amber-300 text-xs font-bold shadow-sm">
              <FlickeringDiya size={16} />
              <span>{mandapam.area}, {mandapam.city}</span>
              <span className="text-amber-800">• {t.verifiedMandapam}</span>
            </div>

            <h1 className="font-['Cinzel',serif] font-black text-2xl sm:text-3xl md:text-4xl text-[#8B1E1E] tracking-tight leading-tight">
              {mandapam.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
              {alankarana?.description || mandapam.description}
            </p>
          </div>

          {/* Today's Sacred Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-2xl bg-white/90 border border-amber-200 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#8B1E1E] flex items-center justify-center font-bold text-base shrink-0 shadow-inner">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900 font-sans">
                  {t.poojaTimings}
                </p>
                <p className="text-xs font-bold text-stone-900 mt-0.5 truncate">
                  {poojaTiming}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 border border-amber-200 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#B45309] flex items-center justify-center font-bold text-base shrink-0 shadow-inner">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900 font-sans">
                  {t.annadanamToday}
                </p>
                <p className="text-xs font-bold text-stone-900 mt-0.5 truncate">
                  {annadanamTiming}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={`/navaratri/m/${mandapam.slug}`}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center gap-2"
            >
              <span>View Today & Tomorrow Schedule</span>
              <span>→</span>
            </Link>

            {(() => {
              const gmapsUrl = getMandapamMapsUrl(mandapam);
              const formattedAddress = getMandapamFormattedAddress(mandapam);

              if (gmapsUrl) {
                return (
                  <a
                    href={gmapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-full bg-white hover:bg-amber-50 text-stone-800 border-2 border-amber-300 text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-[#8B1E1E]" />
                    <span>{t.directions}</span>
                  </a>
                );
              }

              if (formattedAddress) {
                return (
                  <button
                    type="button"
                    onClick={() => toast.info(`📍 ${mandapam?.name || "Mandapam"} Address:\n${formattedAddress}`)}
                    title={`Address: ${formattedAddress}`}
                    className="px-5 py-3 rounded-full bg-white hover:bg-amber-50 text-stone-800 border-2 border-amber-300 text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-[#8B1E1E]" />
                    <span>Address Info</span>
                  </button>
                );
              }

              return (
                <button
                  type="button"
                  disabled
                  title="Location not added"
                  className="px-5 py-3 rounded-full bg-stone-100 text-stone-400 border-2 border-stone-200 text-xs sm:text-sm font-bold opacity-40 cursor-not-allowed flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-stone-400" />
                  <span>Location Not Added</span>
                </button>
              );
            })()}

            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors shadow-sm"
              title="Share Darshan"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

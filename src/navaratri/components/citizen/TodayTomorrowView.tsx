import React, { useState } from "react";
import { Mandapam, MandapamDaySetting, Alankarana, Service } from "../../types";
import { STANDARD_NAVARATRI_DAYS } from "../../data/standardNavaratriDays";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { PrasadBowlIcon } from "../devotional/PrasadBowlIcon";
import { navaratriAsset } from "../../utils/navaratriAssets";
import {
  Calendar,
  Clock,
  Flame,
  Utensils,
  ShoppingBag,
  Bell,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface TodayTomorrowViewProps {
  mandapam: Mandapam;
  todaySetting?: MandapamDaySetting;
  tomorrowSetting?: MandapamDaySetting;
  todayAlankarana?: Alankarana;
  onBookServiceClick?: (serviceId?: string) => void;
}

export const TodayTomorrowView: React.FC<TodayTomorrowViewProps> = ({
  mandapam,
  todaySetting,
  tomorrowSetting,
  todayAlankarana,
  onBookServiceClick
}) => {
  const { t, language } = useNavaratriLanguage();
  const [activeTab, setActiveTab] = useState<"today" | "tomorrow">("today");

  const todayStd = STANDARD_NAVARATRI_DAYS[0]; // Day 1
  const tomorrowStd = STANDARD_NAVARATRI_DAYS[1]; // Day 2

  const renderHighlightedTiming = (text: string) => {
    const parts = text.split(/(\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\b)/);
    const isTime = (str: string) => /^\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)$/i.test(str.trim());

    return (
      <>
        {parts.map((part, idx) => {
          if (isTime(part)) {
            return (
              <span key={idx} className="text-red-600 font-black">
                {part}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </>
    );
  };

  // Derive today's values (respecting field-level customization)
  const todayDevi = todaySetting?.useStandardDevi === false && todaySetting.customDeviName
    ? todaySetting.customDeviName
    : language === "te" ? todayStd.teluguDeviName : language === "hi" ? todayStd.hindiDeviName : todayStd.deviName;

  const todayPooja = todaySetting?.useStandardPooja === false && todaySetting.customPoojaTimings
    ? todaySetting.customPoojaTimings
    : "Morning: 07:30 AM (Kalash & Ganapathi Sthapana) | Evening: 06:30 PM (Maha Harathi)";

  const todayNaivedhyam = todaySetting?.useStandardNaivedhyam === false && todaySetting.customNaivedhyam
    ? todaySetting.customNaivedhyam
    : todayStd.suggestedOfferings;

  const todayPrasadam = todaySetting?.useStandardPrasadam === false && todaySetting.customPrasadam
    ? todaySetting.customPrasadam
    : "Chakkara Pongali & Panchamrutham distributed to all visiting devotees";

  const todayItems = todaySetting?.useStandardItems === false && todaySetting.customItemsToBring
    ? todaySetting.customItemsToBring
    : todayStd.suggestedItems;

  // Derive tomorrow's values
  const tomorrowDevi = tomorrowSetting?.useStandardDevi === false && tomorrowSetting.customDeviName
    ? tomorrowSetting.customDeviName
    : language === "te" ? tomorrowStd.teluguDeviName : language === "hi" ? tomorrowStd.hindiDeviName : tomorrowStd.deviName;

  const tomorrowPooja = tomorrowSetting?.useStandardPooja === false && tomorrowSetting.customPoojaTimings
    ? tomorrowSetting.customPoojaTimings
    : "Morning: 08:00 AM (Gayatri Mantra Japa & Sahasranama) | Evening: 06:45 PM (Maha Deeparadhana)";

  const tomorrowNaivedhyam = tomorrowSetting?.useStandardNaivedhyam === false && tomorrowSetting.customNaivedhyam
    ? tomorrowSetting.customNaivedhyam
    : tomorrowStd.suggestedOfferings;

  const tomorrowPrasadam = tomorrowSetting?.useStandardPrasadam === false && tomorrowSetting.customPrasadam
    ? tomorrowSetting.customPrasadam
    : "Pulihora (Tamarind Rice) & Sugar Prasad distributed to all visiting devotees";

  const tomorrowItems = tomorrowSetting?.useStandardItems === false && tomorrowSetting.customItemsToBring
    ? tomorrowSetting.customItemsToBring
    : tomorrowStd.suggestedItems;

  return (
    <div className="space-y-4">
      {/* Switcher Header */}
      <div className="flex items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
        <div>
          <h2 className="font-serif font-black text-xl md:text-2xl text-[#8B1E1E]">
            {t.today} & {t.tomorrow}
          </h2>
          <p className="text-xs text-stone-600">
            Real-time daily schedule and advance preparation for tomorrow
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-2xl bg-amber-100/70 border border-amber-300/80">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "today"
                ? "bg-[#8B1E1E] text-white shadow-sm"
                : "text-stone-700 hover:text-[#8B1E1E]"
            }`}
          >
            {t.today} (Day 1)
          </button>
          <button
            onClick={() => setActiveTab("tomorrow")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "tomorrow"
                ? "bg-[#8B1E1E] text-white shadow-sm"
                : "text-stone-700 hover:text-[#8B1E1E]"
            }`}
          >
            {t.tomorrow} (Day 2)
          </button>
        </div>
      </div>

      {/* TODAY CONTENT */}
      {activeTab === "today" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#8B1E1E]/5 to-transparent border border-amber-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <span>🪔</span> {t.todayDarshan} • Day 1 ({todayStd.date})
              </span>
              <h3 className="font-serif font-black text-xl text-[#8B1E1E] mt-0.5">
                {todayDevi}
              </h3>
              <p className="text-xs text-stone-700 mt-1 max-w-xl">
                {todayStd.significance}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                style={{ backgroundColor: todayStd.colorHex }}
                title={`Auspicious Color: ${todayStd.colorName}`}
              />
              <span className="text-xs font-semibold text-stone-800">
                {todayStd.colorName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pooja Timings Card */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#8B1E1E]" />
                  {t.poojaTimings}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  Today's Schedule
                </span>
              </div>
              <p className="text-xs text-stone-800 leading-relaxed font-medium">
                {renderHighlightedTiming(todayPooja)}
              </p>
            </div>



            {/* Naivedhyam & Prasadam */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/80 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <PrasadBowlIcon className="w-4 h-4 text-amber-600" />
                {t.naivedhyam} (Bhog) & {t.prasadam}
              </span>
              <div className="text-xs text-stone-800 space-y-1">
                <p><strong className="text-amber-950">{t.naivedhyam} (Bhog):</strong> {todayNaivedhyam}</p>
                <p><strong className="text-amber-950">{t.prasadam}:</strong> {todayPrasadam}</p>
              </div>
            </div>

            {/* Items to Bring */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#8B1E1E]" />
                  {t.itemsToBring}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                  For Devotees
                </span>
              </div>
              <p className="text-xs text-stone-800 leading-relaxed">
                {todayItems}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOMORROW CONTENT (ADVANCE PREPARATION) */}
      {activeTab === "tomorrow" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent border-2 border-emerald-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                <span>🗓️</span> {t.tomorrowPrep} • Day 2 ({tomorrowStd.date})
              </span>
              <h3 className="font-serif font-black text-xl text-emerald-900 mt-0.5">
                {tomorrowDevi}
              </h3>
              <p className="text-xs text-stone-700 mt-1 max-w-xl">
                Prepare items and offerings in advance for tomorrow's sacred seva.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                style={{ backgroundColor: tomorrowStd.colorHex }}
                title={`Auspicious Color: ${tomorrowStd.colorName}`}
              />
              <span className="text-xs font-semibold text-stone-800">
                {tomorrowStd.colorName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tomorrow Items to Bring (Crucial advance knowledge) */}
            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  Items Devotees Should Bring Tomorrow
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">
                  Advance Prep
                </span>
              </div>
              <p className="text-xs text-stone-800 leading-relaxed font-medium">
                {tomorrowItems}
              </p>
              <p className="text-[11px] text-emerald-800 italic pt-1">
                Tip: Green bangles, bilva patra, and tulasi garlands are especially auspicious tomorrow.
              </p>
            </div>

            {/* Tomorrow Pooja Timings */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/80 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#8B1E1E]" />
                Tomorrow's Pooja Schedule
              </span>
              <p className="text-xs text-stone-800 leading-relaxed font-medium">
                {renderHighlightedTiming(tomorrowPooja)}
              </p>
            </div>

            {/* Tomorrow Naivedhyam & Prasadam */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/80 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <PrasadBowlIcon className="w-4 h-4 text-amber-600" />
                Tomorrow's Suggested Naivedhyam (Bhog)
              </span>
              <div className="text-xs text-stone-800 space-y-1">
                <p><strong className="text-amber-950">Offer at Home / Mandapam:</strong> {tomorrowNaivedhyam}</p>
                <p><strong className="text-amber-950">Mandapam Prasadam:</strong> {tomorrowPrasadam}</p>
              </div>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

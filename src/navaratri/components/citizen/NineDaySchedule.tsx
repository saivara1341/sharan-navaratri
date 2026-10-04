import React, { useState } from "react";
import { STANDARD_NAVARATRI_DAYS } from "../../data/standardNavaratriDays";
import { StandardFestivalDay, Mandapam, MandapamDaySetting } from "../../types";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { PrasadBowlIcon } from "../devotional/PrasadBowlIcon";
import {
  Calendar,
  ShoppingBag,
  X,
  Eye,
  Flame,
  CheckCircle2,
  Volume2,
  Sun,
  Moon,
  Clock,
  ChevronDown,
} from "lucide-react";

interface NineDayScheduleProps {
  mandapam?: Mandapam;
  mandapamDaySettings?: MandapamDaySetting[];
}

export const NineDaySchedule: React.FC<NineDayScheduleProps> = ({
  mandapam,
  mandapamDaySettings = [],
}) => {
  const { language } = useNavaratriLanguage();
  const [selectedDay, setSelectedDay] = useState<StandardFestivalDay | null>(null);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const todayIso = new Date().toLocaleDateString("en-CA");

  const toggleCardExpand = (dayNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDays((prev) => ({
      ...prev,
      [dayNumber]: !prev[dayNumber],
    }));
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="border-b-2 sm:border-b-4 border-amber-300 pb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h2 className="font-serif font-black text-2xl md:text-3xl text-[#8B1E1E] leading-tight flex items-baseline gap-2 flex-wrap">
            <span>{mandapam ? `${mandapam.name} • 10 Sacred Alankaranas` : "Sharad Navaratri"}</span>
            <span className="font-['Cinzel_Decorative',serif] text-2xl md:text-3xl font-black text-[#A02222] tracking-wider drop-shadow-xs">
              2026
            </span>
          </h2>
          <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
            10 Divine Days
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
          {mandapam
            ? `Official daily Maa Alankaranas, Pooja timings, Naivedhyam (Bhog), and Annadanam schedule organized at ${mandapam.name}.`
            : language === "te"
            ? "శ్రీ అన్నపూర్ణా దేవి, శ్రీ సరస్వతీ దేవి, శ్రీ లక్ష్మీ దేవి, శ్రీ కాళికా దేవి సహా 10 దివ్య అలంకారాలు • నైవేద్యం, మంత్రాలు & ఆధ్యాత్మిక విశిష్టత (11–20 అక్టోబర్ 2026)"
            : "10 Sacred Devi Alankaranas including Sri Annapurna Devi, Sri Maha Saraswathi Devi, Sri Maha Lakshmi Devi, Sri Kalika Devi • Sacred Chants, Bhog & Devotee Guide (11–20 October 2026)"}
        </p>
      </div>

      {/* ── Card Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 pb-10">
        {STANDARD_NAVARATRI_DAYS.map((day, index) => {
          const isToday = day.date === todayIso;
          const customSetting = mandapamDaySettings.find(
            (s) => s.dayNumber === day.dayNumber
          );

          const isDual = customSetting?.isDualAlankarana ?? !!day.dualSessionNote;
          const morningDevi =
            customSetting?.morningDeviName || day.dualSessionNote?.morningAlankarana;
          const eveningDevi =
            customSetting?.eveningDeviName || day.dualSessionNote?.eveningAlankarana;

          const deviDisplayName = customSetting?.customDeviName
            ? customSetting.customDeviName
            : language === "te"
            ? day.teluguDeviName
            : language === "hi"
            ? day.hindiDeviName
            : day.deviName;

          const dayNaivedhyam =
            customSetting?.useStandardNaivedhyam === false && customSetting.customNaivedhyam
              ? customSetting.customNaivedhyam
              : day.suggestedOfferings;

          const dayPooja =
            customSetting?.useStandardPooja === false && customSetting.customPoojaTimings
              ? customSetting.customPoojaTimings
              : null;

          // Determine text color on colored badge based on lightness
          const lightDays = [2, 6]; // orange and green - use dark text
          const badgeTextColor = lightDays.includes(day.dayNumber) ? "#1C1917" : "#FFFFFF";

          return (
            <div
              key={day.dayNumber}
              onClick={() => setSelectedDay(day)}
              className={[
                "group rounded-3xl overflow-hidden cursor-pointer text-left relative",
                "transition-all duration-300",
                "border-2",
                isToday
                  ? "bg-gradient-to-b from-[#FFFBEB] via-[#FFFDF9] to-[#FEF3C7] border-amber-400 ring-2 ring-amber-400/50 shadow-2xl shadow-amber-300/30"
                  : "bg-gradient-to-b from-[#FFFDF9] via-white to-[#FFF9F0] border-amber-200 hover:border-amber-400 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-xl sm:hover:-translate-y-1.5",
              ].join(" ")}
            >
              {/* ── IMAGE FRAME — object-contain, full deity visible ── */}
              <div
                className="relative w-full overflow-hidden"
                style={{
                  height: "260px",
                  background: `radial-gradient(ellipse at center, ${day.colorHex}55 0%, ${day.colorHex}22 55%, #18080088 100%)`,
                }}
              >
                {/* Blurred ambient backdrop */}
                <img
                  src={day.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-35 pointer-events-none select-none"
                />

                {/* Main image — full deity, no crop */}
                <img
                  src={day.imageUrl}
                  alt={deviDisplayName}
                  className="relative z-10 w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105 drop-shadow-2xl"
                  loading="lazy"
                />

                {/* Top-left: Day number badge */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-serif font-black shadow-lg border border-white/40 flex items-center gap-1"
                    style={{ backgroundColor: day.colorHex, color: badgeTextColor }}
                  >
                    <span>Day {day.dayNumber}</span>
                  </div>
                  {isToday && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950 border border-amber-500 shadow-sm animate-pulse">
                      Today
                    </span>
                  )}
                </div>

                {/* Top-right: Date */}
                <div className="absolute top-3 right-3 z-20">
                  <div className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-amber-200 border border-white/20 text-[11px] font-medium flex items-center gap-1 shadow-md">
                    <Calendar className="w-3 h-3 text-amber-300" />
                    <span>{day.date}</span>
                  </div>
                </div>

                {/* Bottom gradient scrim */}
                <div className="absolute bottom-0 inset-x-0 h-28 z-10 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                {/* Devi name overlay */}
                <div className="absolute bottom-3 inset-x-3 z-20">
                  <h3 className="font-serif font-black text-sm sm:text-base text-white drop-shadow-lg leading-tight line-clamp-2">
                    {deviDisplayName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-200/90 font-semibold mt-0.5">
                    <span className="truncate max-w-[45%]">{day.teluguDeviName}</span>
                    <span className="shrink-0">•</span>
                    <span className="truncate max-w-[45%]">{day.hindiDeviName}</span>
                  </div>
                </div>
              </div>

              {/* ── CARD BODY ── */}
              <div className="p-4 flex flex-col gap-3">

                {/* Sacred Color pill */}
                <div
                  className="flex items-center gap-2.5 px-3 py-2 rounded-2xl border"
                  style={{
                    backgroundColor: `${day.colorHex}18`,
                    borderColor: `${day.colorHex}55`,
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full border-2 border-white/70 shadow shrink-0"
                    style={{ backgroundColor: day.colorHex }}
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500 block">
                      Sacred Color • రంగు • रंग
                    </span>
                    <span className="text-xs font-bold text-stone-900 truncate block">{day.colorName}</span>
                  </div>
                </div>

                {/* Action Row: Pointed Leaf "Know More" Button (Run Ads Design) + Dropdown Toggle */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDay(day);
                    }}
                    className="relative flex-1 inline-flex items-center justify-center px-4 py-2.5 font-sans font-bold text-xs tracking-wide text-white transition-all transform hover:scale-105 active:scale-95 group/btn drop-shadow-md hover:drop-shadow-lg cursor-pointer"
                    title="Know More / వివరాలు"
                  >
                    {/* Pointed pill / leaf shape background matching Run Ads design */}
                    <svg
                      viewBox="0 0 160 40"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full text-[#C12535] group-hover/btn:text-[#A81B2B] transition-colors"
                    >
                      <path
                        d="M 18 0 L 142 0 C 151 0, 157 12, 160 20 C 157 28, 151 40, 142 40 L 18 40 C 9 40, 3 28, 0 20 C 3 12, 9 0, 18 0 Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="relative z-10 font-bold text-white select-none text-xs">
                      Know More
                    </span>
                  </button>

                  {/* Dropdown toggle to expand/collapse remaining data */}
                  <button
                    type="button"
                    onClick={(e) => toggleCardExpand(day.dayNumber, e)}
                    className="h-9 px-2.5 rounded-xl border border-amber-300/80 bg-amber-50 hover:bg-amber-100 text-[#8B1E1E] text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer shrink-0"
                    title={expandedDays[day.dayNumber] ? "Hide Details" : "Show Details"}
                    aria-expanded={expandedDays[day.dayNumber]}
                  >
                    <span className="text-[11px] font-bold hidden min-[360px]:inline">
                      {expandedDays[day.dayNumber] ? "Less" : "Details"}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        expandedDays[day.dayNumber] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Remaining data inside dropdown (collapsible) */}
                {expandedDays[day.dayNumber] && (
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-amber-200/60 animate-fadeIn">
                    {/* Dual session badge */}
                    {isDual && morningDevi && eveningDevi && (
                      <div className="text-[11px] font-semibold text-amber-950 bg-gradient-to-r from-amber-50 to-orange-50/70 p-2.5 rounded-2xl border border-amber-300/80 space-y-1.5">
                        <span className="block font-black text-[10px] uppercase tracking-wide text-amber-900">
                          🌅 Morning & 🌇 Evening Alankaranas
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className="bg-white/90 p-1.5 rounded-xl border border-amber-200/90 space-y-0.5">
                            <span className="font-bold text-amber-800 block text-[9px] uppercase tracking-wider">Morning</span>
                            <span className="font-bold text-stone-900 line-clamp-1">{morningDevi}</span>
                            {day.dualSessionNote?.morningDetails?.colorName && (
                              <span className="text-[9px] text-stone-600 block line-clamp-1 font-medium">
                                🎨 {day.dualSessionNote.morningDetails.colorName}
                              </span>
                            )}
                          </div>
                          <div className="bg-white/90 p-1.5 rounded-xl border border-indigo-200/90 space-y-0.5">
                            <span className="font-bold text-indigo-900 block text-[9px] uppercase tracking-wider">Evening</span>
                            <span className="font-bold text-stone-900 line-clamp-1">{eveningDevi}</span>
                            {day.dualSessionNote?.eveningDetails?.colorName && (
                              <span className="text-[9px] text-stone-600 block line-clamp-1 font-medium">
                                🎨 {day.dualSessionNote.eveningDetails.colorName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Naivedhyam preview */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 px-3 py-2.5 rounded-2xl border border-amber-200/80">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-[#8B1E1E] uppercase tracking-wide mb-1">
                        <PrasadBowlIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Naivedhyam (Bhog)</span>
                      </div>
                      <p className="text-[11px] text-stone-700 line-clamp-2 font-medium leading-relaxed">
                        {dayNaivedhyam}
                      </p>
                    </div>

                    {/* Pooja timing */}
                    {dayPooja && (
                      <div className="text-[11px] text-stone-600 bg-white px-3 py-2 rounded-2xl border border-amber-200/60 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#8B1E1E] shrink-0" />
                        <span className="truncate font-semibold">{dayPooja}</span>
                      </div>
                    )}

                    {/* Avathara Visishtatha (Why We Celebrate) preview */}
                    <div className="bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200/80 space-y-1">
                      <div className="text-[10px] font-black text-[#8B1E1E] uppercase tracking-wide">
                        అవతార విశిష్టత • Why We Celebrate
                      </div>
                      <p className="text-[11px] text-stone-700 leading-relaxed font-normal line-clamp-3">
                        {day.whyWeCelebrate}
                      </p>
                    </div>

                    {/* Short description */}
                    <p className="text-[11px] text-stone-600 leading-relaxed px-0.5">
                      {day.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Detail Modal ── */}
      {selectedDay && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="bg-[#FFFDF9] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-amber-400/80 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#8B1E1E] via-[#9B2222] to-[#B45309] text-white flex items-center justify-between gap-3 shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold shadow-md shrink-0 border-2 border-white/40"
                  style={{
                    backgroundColor: selectedDay.colorHex,
                    color: [2, 6].includes(selectedDay.dayNumber) ? "#1C1917" : "#FFFFFF",
                  }}
                >
                  <span className="text-[10px] uppercase font-black tracking-tight opacity-90">Day</span>
                  <span className="text-lg leading-none font-black">{selectedDay.dayNumber}</span>
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl sm:text-2xl text-amber-200 leading-tight">
                    {selectedDay.deviName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-amber-100/90 mt-0.5 font-medium">
                    <span>{selectedDay.teluguDeviName}</span>
                    <span>•</span>
                    <span>{selectedDay.hindiDeviName}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close details"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-stone-800">
              {/* Holy Image & Quick Info */}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                {/* Framed image — full devi visible in modal too */}
                <div
                  className="w-36 h-52 sm:w-44 sm:h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400 shrink-0 relative flex items-center justify-center"
                  style={{
                    background: `radial-gradient(ellipse at center, ${selectedDay.colorHex}44 0%, #1a0a00 100%)`,
                  }}
                >
                  <img
                    src={selectedDay.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-30 pointer-events-none"
                  />
                  <img
                    src={selectedDay.imageUrl}
                    alt={selectedDay.deviName}
                    className="relative z-10 w-full h-full object-contain object-center drop-shadow-2xl"
                  />
                </div>

                <div className="space-y-3 text-xs sm:text-sm flex-1">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                      Auspicious Date & Day
                    </span>
                    <p className="font-serif font-black text-base text-stone-900">
                      {selectedDay.date} (Day {selectedDay.dayNumber} of Navaratri)
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-amber-200/80 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-stone-500 block">
                      Devotional Color of the Day
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                        style={{ backgroundColor: selectedDay.colorHex }}
                      />
                      <span className="font-bold text-stone-900">{selectedDay.colorName}</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-amber-200/80 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-stone-500 block">
                      Divine Significance & Blessings
                    </span>
                    <p className="font-medium text-amber-900 mt-0.5 leading-snug">
                      {selectedDay.significance}
                    </p>
                  </div>
                </div>
              </div>

              {/* Why We Celebrate */}
              <div className="bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFFDF9] p-4 sm:p-5 rounded-2xl border-2 border-amber-300 shadow-sm space-y-2">
                <h4 className="font-serif font-black text-sm sm:text-base text-[#8B1E1E] flex items-center gap-2 tracking-wide">
                  <span>Why We Celebrate This Avatharam • అవతార విశిష్టత</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal whitespace-pre-line">
                  {selectedDay.whyWeCelebrate}
                </p>
              </div>

              {/* Sacred Chanting */}
              <div className="bg-stone-950 text-amber-100 p-4 sm:p-5 rounded-2xl border-2 border-amber-500/60 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif font-black text-sm sm:text-base text-amber-200 tracking-wide">
                      Sacred Chanting & Slokas • ఉత్తమ జప మంత్రాలు
                    </h4>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Devotee Sadhana
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 block">
                    Moola Mantra • మూల మంత్రం
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-400/40 text-xs sm:text-sm font-serif font-bold text-amber-200">
                    {selectedDay.sacredChanting.moolaMantra}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 block">
                    Sacred Sloka • పూజా శ్లోకం
                  </span>
                  <p className="text-xs sm:text-sm font-serif text-amber-100/95 italic bg-black/40 p-2.5 rounded-xl border border-white/10">
                    {selectedDay.sacredChanting.sloka}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20">
                    <span className="text-[10px] font-bold text-amber-300 uppercase block mb-1">
                      📖 Recommended Stotram
                    </span>
                    <p className="text-amber-100 font-medium">
                      {selectedDay.sacredChanting.recommendedStotram}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20">
                    <span className="text-[10px] font-bold text-amber-300 uppercase block mb-1">
                      🕊️ Best Chanting Practice
                    </span>
                    <p className="text-amber-100 font-medium leading-relaxed">
                      {selectedDay.sacredChanting.bestChantingGuide}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dual Session Guide with Colors, Sarees & Ornaments */}
              {selectedDay.dualSessionNote && (
                <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-amber-50/90 p-4 sm:p-5 rounded-2xl border-2 border-amber-400/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-amber-300/60 pb-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8B1E1E]">
                      <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-serif font-black">🌅 Morning & 🌇 Evening Dual Alankaranas Guide</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-200/70 text-[#8B1E1E] border border-amber-300/80">
                      విశిష్ట అలంకార దర్శనం
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {selectedDay.dualSessionNote.sessionGuide}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Morning Session Card */}
                    <div className="p-3.5 rounded-xl bg-white/95 border-2 border-amber-300 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                            <Sun className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider block">
                              Morning Session • ప్రాతఃకాలం
                            </span>
                            <span className="font-serif font-bold text-sm text-stone-900 block">
                              {selectedDay.dualSessionNote.morningDetails?.deviName || selectedDay.dualSessionNote.morningAlankarana}
                            </span>
                          </div>
                        </div>
                        {selectedDay.dualSessionNote.morningDetails?.colorHex && (
                          <span
                            className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs shrink-0"
                            style={{ backgroundColor: selectedDay.dualSessionNote.morningDetails.colorHex }}
                            title={selectedDay.dualSessionNote.morningDetails.colorName}
                          />
                        )}
                      </div>

                      {/* Morning Color */}
                      {selectedDay.dualSessionNote.morningDetails?.colorName && (
                        <div className="flex items-start gap-1.5 text-xs text-stone-700">
                          <span className="text-[10px] font-bold uppercase text-amber-800 shrink-0 min-w-[70px]">
                            🎨 Color / రంగు:
                          </span>
                          <span className="font-semibold text-stone-900 leading-tight">
                            {selectedDay.dualSessionNote.morningDetails.colorName}
                          </span>
                        </div>
                      )}

                      {/* Morning Saree & Vastram */}
                      {selectedDay.dualSessionNote.morningDetails?.saree && (
                        <div className="flex items-start gap-1.5 text-xs text-stone-700">
                          <span className="text-[10px] font-bold uppercase text-amber-800 shrink-0 min-w-[70px]">
                            🥻 Saree / వస్త్రం:
                          </span>
                          <span className="leading-snug text-stone-800">
                            {selectedDay.dualSessionNote.morningDetails.saree}
                          </span>
                        </div>
                      )}

                      {/* Morning Ornaments & Ayudhas */}
                      {selectedDay.dualSessionNote.morningDetails?.ornaments && (
                        <div className="flex items-start gap-1.5 text-xs text-stone-700">
                          <span className="text-[10px] font-bold uppercase text-amber-800 shrink-0 min-w-[70px]">
                            👑 Ornaments:
                          </span>
                          <span className="leading-snug text-stone-800">
                            {selectedDay.dualSessionNote.morningDetails.ornaments}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Evening Session Card */}
                    <div className="p-3.5 rounded-xl bg-white/95 border-2 border-indigo-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
                            <Moon className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <span className="text-[10px] uppercase font-black text-indigo-900 tracking-wider block">
                              Evening Session • సాయంకాలం
                            </span>
                            <span className="font-serif font-bold text-sm text-stone-900 block">
                              {selectedDay.dualSessionNote.eveningDetails?.deviName || selectedDay.dualSessionNote.eveningAlankarana}
                            </span>
                          </div>
                        </div>
                        {selectedDay.dualSessionNote.eveningDetails?.colorHex && (
                          <span
                            className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs shrink-0"
                            style={{ backgroundColor: selectedDay.dualSessionNote.eveningDetails.colorHex }}
                            title={selectedDay.dualSessionNote.eveningDetails.colorName}
                          />
                        )}
                      </div>

                      {/* Evening Color */}
                      {selectedDay.dualSessionNote.eveningDetails?.colorName && (
                        <div className="flex items-start gap-1.5 text-xs text-stone-700">
                          <span className="text-[10px] font-bold uppercase text-indigo-900 shrink-0 min-w-[70px]">
                            🎨 Color / రంగు:
                          </span>
                          <span className="font-semibold text-stone-900 leading-tight">
                            {selectedDay.dualSessionNote.eveningDetails.colorName}
                          </span>
                        </div>
                      )}

                      {/* Evening Saree & Vastram */}
                      {selectedDay.dualSessionNote.eveningDetails?.saree && (
                        <div className="flex items-start gap-1.5 text-xs text-stone-700">
                          <span className="text-[10px] font-bold uppercase text-indigo-900 shrink-0 min-w-[70px]">
                            🥻 Saree / వస్త్రం:
                          </span>
                          <span className="leading-snug text-stone-800">
                            {selectedDay.dualSessionNote.eveningDetails.saree}
                          </span>
                        </div>
                      )}

                      {/* Evening Ornaments & Ayudhas */}
                      {selectedDay.dualSessionNote.eveningDetails?.ornaments && (
                        <div className="flex items-start gap-1.5 text-xs text-stone-700">
                          <span className="text-[10px] font-bold uppercase text-indigo-900 shrink-0 min-w-[70px]">
                            👑 Ornaments:
                          </span>
                          <span className="leading-snug text-stone-800">
                            {selectedDay.dualSessionNote.eveningDetails.ornaments}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sacred Offerings (Naivedhyam) & Pooja Samagri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ── ELEVATED NAIVEDHYAM (BHOG) SECTION ── */}
                <div className="bg-gradient-to-br from-[#FFFDF7] via-[#FEF3C7]/50 to-[#FDF0CD]/70 p-4 sm:p-5 rounded-2xl border-2 border-amber-400 shadow-md space-y-3 relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

                  {/* Header with authentic temple Naivedhyam medallion */}
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#92400E] p-1 shadow-md border border-amber-300/80 flex items-center justify-center shrink-0">
                        <PrasadBowlIcon className="w-6 h-6 text-white drop-shadow-xs" />
                      </div>
                      <div>
                        <h4 className="font-serif font-black text-xs sm:text-sm text-[#8B1E1E] uppercase tracking-wide">
                          Suggested Naivedhyam (Bhog)
                        </h4>
                        <span className="text-[10px] font-bold text-amber-900/80 block">
                          పవిత్ర నైవేద్య సమర్పణ
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 border border-amber-300/90 shadow-2xs shrink-0">
                      Maha Prasad
                    </span>
                  </div>

                  {/* Offerings list presentation */}
                  <div className="relative z-10 bg-white/95 rounded-xl border border-amber-300/80 p-3 shadow-2xs">
                    <p className="text-xs sm:text-sm text-stone-900 leading-relaxed font-bold font-serif">
                      {selectedDay.suggestedOfferings}
                    </p>
                  </div>

                  {/* Devotional note (No sparkles) */}
                  <div className="relative z-10 flex items-start gap-1.5 text-[11px] text-amber-950/90 font-medium bg-amber-100/60 p-2 rounded-lg border border-amber-200/70">
                    <span className="text-xs shrink-0 select-none">🪔</span>
                    <p className="leading-snug">
                      Preparing Naivedhyam with pure devotion and offering fresh warm prasad brings manifold divine blessings.
                    </p>
                  </div>
                </div>

                {/* Devotee Pooja Samagri */}
                <div className="bg-gradient-to-br from-[#FFFDF7] via-[#FFF8EB] to-[#FEF3C7]/40 p-4 sm:p-5 rounded-2xl border-2 border-amber-300/90 space-y-3 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-md border border-amber-300/80 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4.5 h-4.5 text-white drop-shadow-xs" />
                      </div>
                      <div>
                        <h4 className="font-serif font-black text-xs sm:text-sm text-[#8B1E1E] uppercase tracking-wide">
                          Devotee Pooja Samagri
                        </h4>
                        <span className="text-[10px] font-bold text-amber-900/80 block">
                          పూజా ద్రవ్యాలు & పుష్పాలు
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-300/80 shadow-2xs shrink-0">
                      Samagri
                    </span>
                  </div>

                  <div className="relative z-10 bg-white/95 rounded-xl border border-amber-200/80 p-3 shadow-2xs">
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-semibold">
                      {selectedDay.suggestedItems}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-start gap-1.5 text-[11px] text-stone-700 font-medium bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                    <span className="text-xs shrink-0 select-none">🌿</span>
                    <p className="leading-snug">
                      Devotees may bring fresh flowers of the sacred day's color to offer during community archana.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mandapam Observances */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Standard Mandapam Observances & Rituals</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">{selectedDay.standardActivities}</p>
                <div className="pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] text-amber-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>
                    Note: Individual Mandapam committee schedules, priest sankalpam, and local traditions take precedence.
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-100 border-t border-amber-200 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-stone-500 hidden sm:inline">
                Sharan Navaratri 2026 Devotional Guide • భక్తుల పూజా మార్గదర్శి
              </span>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Close Details / మూసివేయండి
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


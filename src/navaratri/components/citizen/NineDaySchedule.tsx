import React, { useState } from "react";
import { STANDARD_NAVARATRI_DAYS } from "../../data/standardNavaratriDays";
import { StandardFestivalDay } from "../../types";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { 
  Calendar, 
  Utensils, 
  ShoppingBag, 
  Sparkles, 
  X, 
  Eye, 
  Flame, 
  Info,
  CheckCircle2
} from "lucide-react";

export const NineDaySchedule: React.FC = () => {
  const { language } = useNavaratriLanguage();
  const [selectedDay, setSelectedDay] = useState<StandardFestivalDay | null>(null);
  const todayIso = new Date().toLocaleDateString("en-CA");

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="border-b-2 sm:border-b-4 border-amber-300 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-serif font-black text-2xl md:text-3xl text-[#8B1E1E] flex items-center gap-2">
              <span>Sharad Navaratri 2026 Schedule</span>
              <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                10 Divine Days
              </span>
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              {language === "te"
                ? "శ్రీ అన్నపూర్ణా దేవి, శ్రీ సరస్వతీ దేవి, శ్రీ లక్ష్మీ దేవి, శ్రీ కాళికా దేవి సహా 10 దివ్య అలంకారాలు (11–20 అక్టోబర్ 2026)"
                : "10 Sacred Devi Alankaranas including Sri Annapurna Devi, Sri Maha Saraswathi Devi, Sri Maha Lakshmi Devi, Sri Kalika Devi, culminating on Vijaya Dashami (11–20 October 2026)"}
            </p>
          </div>
        </div>
      </div>

      {/* Responsive 3-in-a-row Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {STANDARD_NAVARATRI_DAYS.map((day) => {
          const isToday = day.date === todayIso;
          const deviDisplayName =
            language === "te"
              ? day.teluguDeviName
              : language === "hi"
              ? day.hindiDeviName
              : day.deviName;

          return (
            <div
              key={day.dayNumber}
              onClick={() => setSelectedDay(day)}
              className={`group rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 text-left ${
                isToday
                  ? "bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-amber-400 ring-2 ring-amber-400/40"
                  : "bg-gradient-to-b from-[#FFFDF9] via-[#FFFFFF] to-[#FFF9F0] border-amber-200/90 hover:border-amber-400"
              }`}
            >
              {/* Image Container with Day and Date badges */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                <img
                  src={day.imageUrl}
                  alt={day.deviName}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient vignette for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Day Badge (Top Left) */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-serif font-black shadow-md border flex items-center gap-1.5"
                    style={{
                      backgroundColor: day.colorHex,
                      borderColor: "rgba(255, 255, 255, 0.4)",
                      color: day.dayNumber === 2 ? "#1C1917" : "#FFFFFF"
                    }}
                  >
                    <span>Day {day.dayNumber}</span>
                  </div>
                  {isToday && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950 border border-amber-500 shadow-sm animate-pulse">
                      Today
                    </span>
                  )}
                </div>

                {/* Date Badge (Top Right) */}
                <div className="absolute top-3 right-3">
                  <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-200 border border-white/20 text-xs font-medium flex items-center gap-1 shadow-md">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>{day.date}</span>
                  </div>
                </div>

                {/* Bottom title overlay on image */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-serif font-black text-lg sm:text-xl drop-shadow-md text-amber-100 group-hover:text-amber-300 transition-colors">
                    {deviDisplayName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-200 drop-shadow">
                    <span>{day.teluguDeviName}</span>
                    <span>•</span>
                    <span>{day.hindiDeviName}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                {/* Sacred Color strip */}
                <div className="flex items-center gap-2 bg-amber-50/70 p-2 rounded-xl border border-amber-200/50">
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-sm"
                    style={{ backgroundColor: day.colorHex }}
                  />
                  <div className="text-xs font-medium text-stone-800 truncate">
                    <span className="text-stone-500 text-[10px] uppercase block font-semibold">
                      Sacred Color • రంగు • रंग
                    </span>
                    <span className="font-semibold text-stone-900">{day.colorName}</span>
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {day.description}
                </p>

                {/* Action button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDay(day);
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-[#8B1E1E] text-white hover:from-amber-700 hover:to-[#6B1414] text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all group-hover:shadow"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details / పూజా విధానం</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Respective Details Modal / Popup */}
      {selectedDay && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="bg-[#FFFDF9] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-amber-400/80 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#8B1E1E] via-[#9B2222] to-[#B45309] text-white flex items-center justify-between gap-3 shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold shadow-md shrink-0 border-2 border-white/40"
                  style={{
                    backgroundColor: selectedDay.colorHex,
                    color: selectedDay.dayNumber === 2 ? "#1C1917" : "#FFFFFF"
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

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-stone-800">
              {/* Holy Image & Quick Info Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-xl overflow-hidden shadow-lg border-2 border-amber-400 shrink-0 bg-stone-900">
                  <img
                    src={selectedDay.imageUrl}
                    alt={selectedDay.deviName}
                    className="w-full h-full object-cover object-top"
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
                      Divine Significance
                    </span>
                    <p className="font-medium text-amber-900 mt-0.5 leading-snug">
                      {selectedDay.significance}
                    </p>
                  </div>
                </div>
              </div>

              {/* Devotional Description */}
              <div className="space-y-1.5">
                <h4 className="font-serif font-black text-sm text-[#8B1E1E] flex items-center gap-1.5 uppercase tracking-wide">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>Devi Alankarana & Form Significance</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-3.5 rounded-2xl border border-amber-200/70 shadow-xs">
                  {selectedDay.description}
                </p>
              </div>

              {/* Offerings and devotee items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Naivedhyam */}
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B1E1E] uppercase">
                    <Utensils className="w-4 h-4 text-amber-700" />
                    <span>Suggested Naivedhyam (Bhog)</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {selectedDay.suggestedOfferings}
                  </p>
                </div>

                {/* Items to bring */}
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B1E1E] uppercase">
                    <ShoppingBag className="w-4 h-4 text-amber-700" />
                    <span>Devotee Pooja Samagri</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {selectedDay.suggestedItems}
                  </p>
                </div>
              </div>

              {/* Common observances */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Standard Mandapam Observances & Rituals</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {selectedDay.standardActivities}
                </p>
                <div className="pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] text-amber-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>Note: Local Mandapam committee schedules and priest traditions take precedence.</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-100 border-t border-amber-200 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-stone-500 hidden sm:inline">
                Sharan Navaratri 2026 Devotional Guide
              </span>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="w-full sm:w-auto px-6 py-2 rounded-xl bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-900 hover:to-black text-white text-xs font-bold shadow-sm transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

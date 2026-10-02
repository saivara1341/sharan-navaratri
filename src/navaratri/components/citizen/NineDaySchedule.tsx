import React, { useState } from "react";
import { STANDARD_NAVARATRI_DAYS } from "../../data/standardNavaratriDays";
import { StandardFestivalDay, Mandapam, MandapamDaySetting } from "../../types";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { PrasadBowlIcon } from "../devotional/PrasadBowlIcon";
import { 
  Calendar, 
  ShoppingBag, 
  Sparkles, 
  X, 
  Eye, 
  Flame, 
  Info,
  CheckCircle2,
  BookOpen,
  Volume2,
  Sun,
  Moon,
  HeartHandshake,
  Utensils,
  Clock
} from "lucide-react";

interface NineDayScheduleProps {
  mandapam?: Mandapam;
  mandapamDaySettings?: MandapamDaySetting[];
}

export const NineDaySchedule: React.FC<NineDayScheduleProps> = ({
  mandapam,
  mandapamDaySettings = []
}) => {
  const { language } = useNavaratriLanguage();
  const [selectedDay, setSelectedDay] = useState<StandardFestivalDay | null>(null);
  const todayIso = new Date().toLocaleDateString("en-CA");

  return (
    <div className="space-y-6">
      {/* Header section - Single Unified Heading */}
      <div className="border-b-2 sm:border-b-4 border-amber-300 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="font-serif font-black text-2xl md:text-3xl text-[#8B1E1E] leading-tight">
              {mandapam ? `${mandapam.name} • 10-Day Festival Schedule` : "Sharad Navaratri 2026 Schedule"}
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
      </div>

      {/* Responsive Cards: Sticky Stack Scroll Animation on Mobile, Multi-col Grid on Desktop */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 pb-6">
        {STANDARD_NAVARATRI_DAYS.map((day, index) => {
          const isToday = day.date === todayIso;
          const customSetting = mandapamDaySettings.find((s) => s.dayNumber === day.dayNumber);

          const isDual = customSetting?.isDualAlankarana ?? !!day.dualSessionNote;
          const morningDevi = customSetting?.morningDeviName || day.dualSessionNote?.morningAlankarana;
          const eveningDevi = customSetting?.eveningDeviName || day.dualSessionNote?.eveningAlankarana;

          // Single Canonical Devi Alankarana Heading
          const deviDisplayName = customSetting?.customDeviName
            ? customSetting.customDeviName
            : language === "te"
            ? day.teluguDeviName
            : language === "hi"
            ? day.hindiDeviName
            : day.deviName;

          const dayNaivedhyam = customSetting?.useStandardNaivedhyam === false && customSetting.customNaivedhyam
            ? customSetting.customNaivedhyam
            : day.suggestedOfferings;

          const dayPooja = customSetting?.useStandardPooja === false && customSetting.customPoojaTimings
            ? customSetting.customPoojaTimings
            : null;

          // Mobile sticky stack top offset: 70px + index * 8px
          const stickyTop = 70 + index * 8;

          return (
            <div
              key={day.dayNumber}
              onClick={() => setSelectedDay(day)}
              style={{
                top: `${stickyTop}px`,
                zIndex: index + 1
              }}
              className={`group rounded-3xl border-2 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer text-left sticky sm:static sm:top-auto sm:z-auto mb-6 sm:mb-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.12)] sm:shadow-sm sm:hover:shadow-xl sm:hover:-translate-y-1 ${
                isToday
                  ? "bg-gradient-to-b from-[#FFFBEB] via-[#FFFDF9] to-[#FEF3C7] border-amber-400 ring-2 ring-amber-400/40"
                  : "bg-gradient-to-b from-[#FFFDF9] via-[#FFFFFF] to-[#FFF9F0] border-amber-300/90 hover:border-amber-400"
              }`}
            >
              {/* Image Container with Day and Date badges */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-stone-900">
                <img
                  src={day.imageUrl}
                  alt={deviDisplayName}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient vignette for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

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

                {/* Single Heading on Image */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-serif font-black text-base sm:text-lg lg:text-xl drop-shadow-md text-amber-100 group-hover:text-amber-300 transition-colors leading-tight">
                    {deviDisplayName}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-stone-200 drop-shadow mt-0.5">
                    <span>{day.teluguDeviName}</span>
                    <span>•</span>
                    <span>{day.hindiDeviName}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                {/* Special Dual Session Badge if applicable */}
                {isDual && morningDevi && eveningDevi && (
                  <div className="text-[11px] font-semibold text-amber-900 bg-amber-100/80 p-2 rounded-xl border border-amber-300/80 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B1E1E] shrink-0" />
                    <span className="truncate">Special: {morningDevi} & {eveningDevi}</span>
                  </div>
                )}

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

                {/* Suggested Naivedhyam / Bhog Quick Preview with Bowl Icon */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50/70 p-2.5 rounded-xl border border-amber-200/70 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#8B1E1E] uppercase">
                    <span className="flex items-center gap-1.5">
                      <PrasadBowlIcon className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Suggested Naivedhyam (Bhog)</span>
                    </span>
                    {customSetting?.annadanamEnabled && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                        Annadanam
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-700 line-clamp-1 font-medium">
                    {dayNaivedhyam}
                  </p>
                </div>

                {dayPooja && (
                  <div className="text-[11px] text-stone-600 bg-white p-2 rounded-xl border border-amber-200/60 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8B1E1E] shrink-0" />
                    <span className="truncate font-semibold">{dayPooja}</span>
                  </div>
                )}

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
                  className="w-full mt-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-[#8B1E1E] text-white hover:from-amber-700 hover:to-[#6B1414] text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all group-hover:shadow"
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
                      Divine Significance & Blessings
                    </span>
                    <p className="font-medium text-amber-900 mt-0.5 leading-snug">
                      {selectedDay.significance}
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. WHY DEVOTEES CELEBRATE THIS AVATHARAM */}
              <div className="bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFFDF9] p-4 sm:p-5 rounded-2xl border-2 border-amber-300 shadow-sm space-y-2">
                <h4 className="font-serif font-black text-sm sm:text-base text-[#8B1E1E] flex items-center gap-2 tracking-wide">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Why We Celebrate This Avatharam • అవతార విశిష్టత</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal">
                  {selectedDay.whyWeCelebrate}
                </p>
              </div>

              {/* 2. SACRED CHANTING & MANTRAS (WHAT KIND OF CHANTING IS BEST) */}
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

                {/* Moola Mantra */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 block">
                    Moola Mantra • మూల మంత్రం
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-400/40 text-xs sm:text-sm font-serif font-bold text-amber-200">
                    {selectedDay.sacredChanting.moolaMantra}
                  </div>
                </div>

                {/* Sacred Sloka */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 block">
                    Sacred Sloka • పూజా శ్లోకం
                  </span>
                  <p className="text-xs sm:text-sm font-serif text-amber-100/95 italic bg-black/40 p-2.5 rounded-xl border border-white/10">
                    {selectedDay.sacredChanting.sloka}
                  </p>
                </div>

                {/* Recommended Stotram & Chanting Guide */}
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

              {/* 3. DUAL ALANKARANA EXPLAINER (MORNING & EVENING SESSIONS) */}
              {selectedDay.dualSessionNote && (
                <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 p-4 rounded-2xl border border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8B1E1E]">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span className="font-serif font-black">🌅 Morning & 🌇 Evening Dual Alankaranas Guide</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {selectedDay.dualSessionNote.sessionGuide}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2 rounded-xl bg-white/90 border border-amber-200 flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-800 block">Morning Session</span>
                        <span className="font-semibold text-stone-900">{selectedDay.dualSessionNote.morningAlankarana}</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/90 border border-amber-200 flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-900 block">Evening Session</span>
                        <span className="font-semibold text-stone-900">{selectedDay.dualSessionNote.eveningAlankarana}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. OFFERINGS & DEVOTEE POOJA SAMAGRI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Suggested Naivedhyam (Bhog) with PrasadBowlIcon */}
                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-300 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B1E1E] uppercase">
                    <PrasadBowlIcon className="w-4.5 h-4.5 text-amber-700 shrink-0" />
                    <span>Suggested Naivedhyam (Bhog)</span>
                  </div>
                  <p className="text-xs text-stone-800 leading-relaxed font-semibold">
                    {selectedDay.suggestedOfferings}
                  </p>
                  <p className="text-[11px] text-amber-900/80 italic pt-1">
                    ✨ Preparing Naivedhyam with pure devotion and offering fresh warm prasad brings manifold blessings.
                  </p>
                </div>

                {/* Items to bring (Pooja Samagri) */}
                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-300 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B1E1E] uppercase">
                    <ShoppingBag className="w-4.5 h-4.5 text-amber-700 shrink-0" />
                    <span>Devotee Pooja Samagri</span>
                  </div>
                  <p className="text-xs text-stone-800 leading-relaxed font-semibold">
                    {selectedDay.suggestedItems}
                  </p>
                  <p className="text-[11px] text-amber-900/80 italic pt-1">
                    🌿 Devotees may bring fresh flowers of the sacred day's color to offer during community archana.
                  </p>
                </div>
              </div>

              {/* 5. STANDARD MANDAPAM OBSERVANCES & RITUALS */}
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
                  <span>Note: Individual Mandapam committee schedules, priest sankalpam, and local traditions take precedence.</span>
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

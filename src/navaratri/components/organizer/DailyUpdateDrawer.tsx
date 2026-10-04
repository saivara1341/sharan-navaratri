import { navaratriAsset } from "../../utils/navaratriAssets";
import React, { useState, useEffect } from "react";
import { Mandapam, MandapamDaySetting } from "../../types";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { STANDARD_NAVARATRI_DAYS } from "../../data/standardNavaratriDays";
import { PrasadBowlIcon } from "../devotional/PrasadBowlIcon";
import { 
  X, 
  Upload, 
  Save, 
  CheckCircle, 
  Clock, 
  Utensils, 
  ShoppingBag,
  Sun,
  Moon,
  Calendar,
  Flame
} from "lucide-react";
import { toast } from "sonner";

interface DailyUpdateDrawerProps {
  mandapam: Mandapam;
  isOpen: boolean;
  onClose: () => void;
  dayNumber?: number;
}

export const DailyUpdateDrawer: React.FC<DailyUpdateDrawerProps> = ({
  mandapam,
  isOpen,
  onClose,
  dayNumber: initialDayNumber = 1
}) => {
  const { getDaySetting, updateDaySetting, uploadAlankarana } = useNavaratriData();
  const { t } = useNavaratriLanguage();

  const [selectedDayNum, setSelectedDayNum] = useState(initialDayNumber);

  useEffect(() => {
    setSelectedDayNum(initialDayNumber);
  }, [initialDayNumber]);

  const stdDay = STANDARD_NAVARATRI_DAYS.find(d => d.dayNumber === selectedDayNum) || STANDARD_NAVARATRI_DAYS[0];
  const currentSetting = getDaySetting(mandapam.id, selectedDayNum);

  // Field-level state
  const [useStdDevi, setUseStdDevi] = useState(currentSetting?.useStandardDevi ?? true);
  const [customDevi, setCustomDevi] = useState(currentSetting?.customDeviName || "");

  // Dual Alankarana state
  const [isDual, setIsDual] = useState(currentSetting?.isDualAlankarana ?? (stdDay.dualSessionNote?.isCommonlyDual || false));
  const [morningDevi, setMorningDevi] = useState(currentSetting?.morningDeviName || stdDay.dualSessionNote?.morningAlankarana || stdDay.deviName);
  const [eveningDevi, setEveningDevi] = useState(currentSetting?.eveningDeviName || stdDay.dualSessionNote?.eveningAlankarana || stdDay.deviName);

  const [useStdPooja, setUseStdPooja] = useState(currentSetting?.useStandardPooja ?? false);
  const [customPooja, setCustomPooja] = useState(
    currentSetting?.customPoojaTimings || "Morning: 07:30 AM (Abhishekam) | Evening: 06:30 PM (Maha Harathi)"
  );

  const [useStdNaivedhyam, setUseStdNaivedhyam] = useState(currentSetting?.useStandardNaivedhyam ?? true);
  const [customNaivedhyam, setCustomNaivedhyam] = useState(currentSetting?.customNaivedhyam || "");

  const [useStdPrasadam, setUseStdPrasadam] = useState(currentSetting?.useStandardPrasadam ?? true);
  const [customPrasadam, setCustomPrasadam] = useState(currentSetting?.customPrasadam || "");

  const [useStdItems, setUseStdItems] = useState(currentSetting?.useStandardItems ?? true);
  const [customItems, setCustomItems] = useState(currentSetting?.customItemsToBring || "");

  const [annadanamEnabled, setAnnadanamEnabled] = useState(currentSetting?.annadanamEnabled ?? true);
  const [annadanamStart, setAnnadanamStart] = useState(currentSetting?.annadanamStartTime || "12:30 PM");
  const [annadanamEnd, setAnnadanamEnd] = useState(currentSetting?.annadanamEndTime || "03:30 PM");
  const [annadanamLocation, setAnnadanamLocation] = useState(currentSetting?.annadanamLocation || "Mandapam Kalyana Hall");
  const [annadanamCount, setAnnadanamCount] = useState(currentSetting?.annadanamExpectedCount || 1200);

  // Alankarana upload
  const [alankaranaImage, setAlankaranaImage] = useState(stdDay.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"));
  const [alankaranaTitle, setAlankaranaTitle] = useState(`${stdDay.deviName} Alankarana`);
  const [alankaranaDesc, setAlankaranaDesc] = useState("Adorned in royal silk with fragrant floral garlands and traditional ornaments.");

  // When selectedDayNum changes, load that day's data
  useEffect(() => {
    const s = getDaySetting(mandapam.id, selectedDayNum);
    const d = STANDARD_NAVARATRI_DAYS.find(item => item.dayNumber === selectedDayNum) || STANDARD_NAVARATRI_DAYS[0];
    
    setUseStdDevi(s?.useStandardDevi ?? true);
    setCustomDevi(s?.customDeviName || "");
    setIsDual(s?.isDualAlankarana ?? (d.dualSessionNote?.isCommonlyDual || false));
    setMorningDevi(s?.morningDeviName || d.dualSessionNote?.morningAlankarana || d.deviName);
    setEveningDevi(s?.eveningDeviName || d.dualSessionNote?.eveningAlankarana || d.deviName);
    setUseStdPooja(s?.useStandardPooja ?? false);
    setCustomPooja(s?.customPoojaTimings || "Morning: 07:30 AM (Abhishekam) | Evening: 06:30 PM (Maha Harathi)");
    setUseStdNaivedhyam(s?.useStandardNaivedhyam ?? true);
    setCustomNaivedhyam(s?.customNaivedhyam || "");
    setUseStdPrasadam(s?.useStandardPrasadam ?? true);
    setCustomPrasadam(s?.customPrasadam || "");
    setUseStdItems(s?.useStandardItems ?? true);
    setCustomItems(s?.customItemsToBring || "");
    setAnnadanamEnabled(s?.annadanamEnabled ?? true);
    setAnnadanamStart(s?.annadanamStartTime || "12:30 PM");
    setAnnadanamEnd(s?.annadanamEndTime || "03:30 PM");
    setAnnadanamLocation(s?.annadanamLocation || "Mandapam Kalyana Hall");
    setAnnadanamCount(s?.annadanamExpectedCount || 1200);
    setAlankaranaImage(d.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"));
    setAlankaranaTitle(`${d.deviName} Alankarana`);
  }, [selectedDayNum, mandapam.id]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Save Day Customization settings
    updateDaySetting({
      mandapamId: mandapam.id,
      dayNumber: selectedDayNum,
      date: stdDay.date,
      useStandardDevi: useStdDevi,
      customDeviName: customDevi,
      isDualAlankarana: isDual,
      morningDeviName: morningDevi,
      eveningDeviName: eveningDevi,
      useStandardPooja: useStdPooja,
      customPoojaTimings: customPooja,
      useStandardNaivedhyam: useStdNaivedhyam,
      customNaivedhyam: customNaivedhyam,
      useStandardPrasadam: useStdPrasadam,
      customPrasadam: customPrasadam,
      useStandardItems: useStdItems,
      customItemsToBring: customItems,
      annadanamEnabled,
      annadanamStartTime: annadanamStart,
      annadanamEndTime: annadanamEnd,
      annadanamLocation,
      annadanamExpectedCount: annadanamCount
    });

    // 2. Upload/Save physical Alankarana photo
    uploadAlankarana({
      mandapamId: mandapam.id,
      seasonId: "season-2026",
      date: stdDay.date,
      title: alankaranaTitle,
      deviName: isDual 
        ? `${morningDevi} (Morning) / ${eveningDevi} (Evening)`
        : (useStdDevi ? stdDay.deviName : customDevi || stdDay.deviName),
      description: alankaranaDesc,
      imageUrl: alankaranaImage,
      published: true
    });

    toast.success(`Day ${selectedDayNum} (${stdDay.deviName}) details updated successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="bg-[#FDFBF7] text-[#221A14] w-full max-w-2xl h-full overflow-y-auto p-5 sm:p-7 shadow-2xl border-l-2 border-[#D97706] relative font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors cursor-pointer"
          aria-label="Close Drawer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#8B1E1E] text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Mandapam Day-to-Day Manager</span>
          </div>
          <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#8B1E1E]">
            Edit Day-to-Day Festival Data
          </h3>
          <p className="text-xs text-stone-600">
            Select any day to configure custom Alankaranas, Pooja timings, Naivedhyam (Bhog), and Annadanam.
          </p>

          {/* 10-DAY QUICK SWITCHER */}
          <div className="pt-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1.5">
              Select Festival Day to Edit (Day 1 – Day 10)
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {STANDARD_NAVARATRI_DAYS.map((d) => {
                const isActive = d.dayNumber === selectedDayNum;
                return (
                  <button
                    key={d.dayNumber}
                    type="button"
                    onClick={() => setSelectedDayNum(d.dayNumber)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isActive
                        ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-md scale-105"
                        : "bg-white text-stone-700 border-amber-300 hover:bg-amber-50"
                    }`}
                  >
                    <span>Day {d.dayNumber}</span>
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-semibold text-amber-950 bg-amber-100/70 p-2.5 rounded-xl border border-amber-300/80 flex items-center justify-between">
              <span>🗓️ Day {selectedDayNum}: <strong>{stdDay.deviName}</strong></span>
              <span className="text-[11px] text-amber-800 font-mono">{stdDay.date}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 pb-12">
          {/* SECTION 1: PHYSICAL ALANKARANA UPLOAD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-amber-700" />
              <span>1. Day {selectedDayNum} Idol Darshan & Alankarana Photo</span>
            </h4>
            <p className="text-xs text-stone-600">
              Upload the real photograph of the mandapam idol for Day {selectedDayNum} so citizens see today's live darshan.
            </p>

            <div className="flex items-center gap-4">
              <img
                src={alankaranaImage}
                alt="Alankarana Preview"
                className="w-20 h-20 rounded-xl object-cover border-2 border-amber-400 shadow-sm shrink-0 bg-stone-900"
              />
              <div className="space-y-1.5 flex-1">
                <input
                  type="text"
                  value={alankaranaImage}
                  onChange={(e) => setAlankaranaImage(e.target.value)}
                  placeholder="Paste image URL or /navaratri/assets/..."
                  className="w-full px-3 py-1.5 rounded-xl text-xs border border-amber-300 bg-white"
                />
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAlankaranaImage(stdDay.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"))}
                    className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-semibold cursor-pointer"
                  >
                    Default Deity Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlankaranaImage(navaratriAsset("/navaratri/assets/golden-lotus-bg.jpg"))}
                    className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-semibold cursor-pointer"
                  >
                    Golden Mandir
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-stone-700">
                Alankarana Title & Highlights
              </label>
              <input
                type="text"
                value={alankaranaTitle}
                onChange={(e) => setAlankaranaTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl text-xs border border-amber-300 bg-white"
              />
              <textarea
                rows={2}
                value={alankaranaDesc}
                onChange={(e) => setAlankaranaDesc(e.target.value)}
                placeholder="Describe special decorations, flower garlands, ornaments, or sacred vastrams..."
                className="w-full px-3 py-1.5 rounded-xl text-xs border border-amber-300 bg-white mt-1"
              />
            </div>
          </div>

          {/* SECTION 2: ALANKARANA FORM & DUAL SESSION CONFIGURATION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E]">
                2. Devi Alankarana & Dual Sessions
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Day {selectedDayNum}
              </span>
            </div>

            {/* Dual Session Checkbox */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-300 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#8B1E1E]">
                <input
                  type="checkbox"
                  checked={isDual}
                  onChange={(e) => setIsDual(e.target.checked)}
                  className="rounded border-amber-400 text-[#8B1E1E] focus:ring-amber-500 w-4 h-4"
                />
                <span>Celebrate 2 Avatharams in a Single Day (Morning & Evening Sessions)</span>
              </label>
              <p className="text-[11px] text-stone-600 leading-snug">
                Enable this if your Mandapam conducts morning alankarana (e.g. Bala Tripura Sundari) and changes to an evening alankarana (e.g. Gayatri Devi).
              </p>

              {isDual ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-amber-950 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      <span>Morning Avatharam (ఉదయం) *</span>
                    </label>
                    <input
                      type="text"
                      required={isDual}
                      value={morningDevi}
                      onChange={(e) => setMorningDevi(e.target.value)}
                      placeholder="e.g. Sri Bala Tripura Sundari Devi"
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-indigo-950 flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Evening Avatharam (సాయంత్రం) *</span>
                    </label>
                    <input
                      type="text"
                      required={isDual}
                      value={eveningDevi}
                      onChange={(e) => setEveningDevi(e.target.value)}
                      placeholder="e.g. Sri Gayatri Devi"
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white"
                    />
                  </div>
                </div>
              ) : (
                /* Single Devi Form */
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">Single Alankarana Name</span>
                    <div className="flex gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setUseStdDevi(true)}
                        className={`px-2 py-0.5 rounded-md ${useStdDevi ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border border-stone-300"}`}
                      >
                        Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseStdDevi(false)}
                        className={`px-2 py-0.5 rounded-md ${!useStdDevi ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border border-stone-300"}`}
                      >
                        Custom
                      </button>
                    </div>
                  </div>
                  {useStdDevi ? (
                    <p className="text-xs text-stone-700 font-semibold bg-white p-2 rounded-lg border border-amber-200">
                      Standard: {stdDay.deviName}
                    </p>
                  ) : (
                    <input
                      type="text"
                      value={customDevi}
                      onChange={(e) => setCustomDevi(e.target.value)}
                      placeholder="Enter custom Devi alankarana name..."
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Pooja Timings */}
            <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8B1E1E]" />
                  <span>Pooja & Harathi Timings</span>
                </span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUseStdPooja(true)}
                    className={`px-2 py-0.5 rounded-md ${useStdPooja ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border border-stone-300"}`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseStdPooja(false)}
                    className={`px-2 py-0.5 rounded-md ${!useStdPooja ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border border-stone-300"}`}
                  >
                    Custom
                  </button>
                </div>
              </div>
              {useStdPooja ? (
                <p className="text-xs text-stone-600 italic">Standard: Morning 07:30 AM & Evening 06:30 PM (Maha Harathi)</p>
              ) : (
                <input
                  type="text"
                  value={customPooja}
                  onChange={(e) => setCustomPooja(e.target.value)}
                  placeholder="e.g. Morning: 07:00 AM (Abhishekam) | Evening: 07:00 PM (Maha Harathi)"
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white"
                />
              )}
            </div>

            {/* Suggested Naivedhyam (Bhog) with PrasadBowlIcon */}
            <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <PrasadBowlIcon className="w-4 h-4 text-amber-700" />
                  <span>Suggested Naivedhyam (Bhog)</span>
                </span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUseStdNaivedhyam(true)}
                    className={`px-2 py-0.5 rounded-md ${useStdNaivedhyam ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border border-stone-300"}`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseStdNaivedhyam(false)}
                    className={`px-2 py-0.5 rounded-md ${!useStdNaivedhyam ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border border-stone-300"}`}
                  >
                    Custom
                  </button>
                </div>
              </div>
              {useStdNaivedhyam ? (
                <p className="text-xs text-stone-700 font-semibold bg-white p-2 rounded-lg border border-amber-200">
                  Standard: {stdDay.suggestedOfferings}
                </p>
              ) : (
                <input
                  type="text"
                  value={customNaivedhyam}
                  onChange={(e) => setCustomNaivedhyam(e.target.value)}
                  placeholder="e.g. Katte Pongali, Ghee Naivedhyam, Payasam"
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white"
                />
              )}
            </div>

            {/* Items for Devotees to Bring */}
            <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
                  <span>Devotee Items to Bring (Pooja Samagri)</span>
                </span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUseStdItems(true)}
                    className={`px-2 py-0.5 rounded-md ${useStdItems ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border border-stone-300"}`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseStdItems(false)}
                    className={`px-2 py-0.5 rounded-md ${!useStdItems ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border border-stone-300"}`}
                  >
                    Custom
                  </button>
                </div>
              </div>
              {useStdItems ? (
                <p className="text-xs text-stone-700 font-semibold bg-white p-2 rounded-lg border border-amber-200">
                  Standard: {stdDay.suggestedItems}
                </p>
              ) : (
                <input
                  type="text"
                  value={customItems}
                  onChange={(e) => setCustomItems(e.target.value)}
                  placeholder="e.g. Red lotus, coconuts, turmeric roots, ghee"
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white"
                />
              )}
            </div>
          </div>

          {/* SECTION 3: ANNADANAM */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-700" />
                <span>3. Day {selectedDayNum} Annadanam Setup</span>
              </h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={annadanamEnabled}
                  onChange={(e) => setAnnadanamEnabled(e.target.checked)}
                  className="rounded border-amber-400 text-[#8B1E1E] focus:ring-amber-500"
                />
                <span>Annadanam Active Today</span>
              </label>
            </div>

            {annadanamEnabled && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="text"
                      value={annadanamStart}
                      onChange={(e) => setAnnadanamStart(e.target.value)}
                      placeholder="12:30 PM"
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      value={annadanamEnd}
                      onChange={(e) => setAnnadanamEnd(e.target.value)}
                      placeholder="03:30 PM"
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Location / Hall
                    </label>
                    <input
                      type="text"
                      value={annadanamLocation}
                      onChange={(e) => setAnnadanamLocation(e.target.value)}
                      placeholder="Mandapam Dining Hall"
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Expected Devotees Count
                    </label>
                    <input
                      type="number"
                      value={annadanamCount}
                      onChange={(e) => setAnnadanamCount(Number(e.target.value))}
                      placeholder="1200"
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-2 sticky bottom-0 bg-[#FDFBF7] py-3 border-t border-amber-300">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Day {selectedDayNum} Updates & Publish Live</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

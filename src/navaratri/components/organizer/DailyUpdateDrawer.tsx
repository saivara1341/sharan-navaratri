import { navaratriAsset } from "../../utils/navaratriAssets";
import React, { useState } from "react";
import { Mandapam, MandapamDaySetting } from "../../types";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { STANDARD_NAVARATRI_DAYS } from "../../data/standardNavaratriDays";
import { X, Upload, Save, CheckCircle, Clock, Utensils, ShoppingBag } from "lucide-react";
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
  dayNumber = 1
}) => {
  const { getDaySetting, updateDaySetting, uploadAlankarana } = useNavaratriData();
  const { t } = useNavaratriLanguage();

  const stdDay = STANDARD_NAVARATRI_DAYS.find(d => d.dayNumber === dayNumber) || STANDARD_NAVARATRI_DAYS[0];
  const currentSetting = getDaySetting(mandapam.id, dayNumber);

  // Field-level state
  const [useStdDevi, setUseStdDevi] = useState(currentSetting?.useStandardDevi ?? true);
  const [customDevi, setCustomDevi] = useState(currentSetting?.customDeviName || "");

  const [useStdPooja, setUseStdPooja] = useState(currentSetting?.useStandardPooja ?? false);
  const [customPooja, setCustomPooja] = useState(
    currentSetting?.customPoojaTimings || "Morning: 07:30 AM | Evening: 06:30 PM (Maha Harathi)"
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
  const [annadanamLocation, setAnnadanamLocation] = useState(currentSetting?.annadanamLocation || "Dining Hall");
  const [annadanamCount, setAnnadanamCount] = useState(currentSetting?.annadanamExpectedCount || 1200);

  // Alankarana upload
  const [alankaranaImage, setAlankaranaImage] = useState(navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"));
  const [alankaranaTitle, setAlankaranaTitle] = useState(`${stdDay.deviName} Alankarana`);
  const [alankaranaDesc, setAlankaranaDesc] = useState("Adorned in royal silk with fragrant floral garlands and traditional ornaments.");

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Save Day Customization settings
    updateDaySetting({
      mandapamId: mandapam.id,
      dayNumber,
      date: stdDay.date,
      useStandardDevi: useStdDevi,
      customDeviName: customDevi,
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
      deviName: useStdDevi ? stdDay.deviName : customDevi || stdDay.deviName,
      description: alankaranaDesc,
      imageUrl: alankaranaImage,
      published: true
    });

    toast.success("Daily festival details & Alankarana updated successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="bg-[#FDFBF7] text-[#221A14] w-full max-w-xl h-full overflow-y-auto p-6 shadow-2xl border-l-2 border-[#D97706] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#8B1E1E] text-xs font-bold mb-1">
            <span>⚡ Quick 2-Minute Update</span>
          </div>
          <h3 className="font-serif font-black text-2xl text-[#8B1E1E]">
            Daily Mandapam Operations
          </h3>
          <p className="text-xs text-stone-600">
            Day {dayNumber}: {stdDay.deviName} ({stdDay.date})
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 pb-8">
          {/* SECTION 1: PHYSICAL ALANKARANA UPLOAD */}
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              <span>1. Today's Physical Alankarana Photo</span>
            </h4>
            <p className="text-xs text-stone-600">
              Upload the actual photo of the consecrated Mandapam idol so citizens see real daily darshan.
            </p>

            <div className="flex items-center gap-4">
              <img
                src={alankaranaImage}
                alt="Alankarana Preview"
                className="w-20 h-20 rounded-xl object-cover border-2 border-amber-400 shadow-sm"
              />
              <div className="space-y-1.5 flex-1">
                <input
                  type="text"
                  value={alankaranaImage}
                  onChange={(e) => setAlankaranaImage(e.target.value)}
                  placeholder="Paste image URL or /navaratri/assets/..."
                  className="w-full px-3 py-1.5 rounded-xl text-xs border border-amber-300 bg-white"
                />
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAlankaranaImage(navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"))}
                    className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 border"
                  >
                    Ivory Lotus
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlankaranaImage(navaratriAsset("/navaratri/assets/golden-lotus-bg.jpg"))}
                    className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 border"
                  >
                    Golden Lotus
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlankaranaImage(navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg"))}
                    className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 border"
                  >
                    Terracotta Red
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-stone-700">
                Alankarana Title & Description
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
                className="w-full px-3 py-1.5 rounded-xl text-xs border border-amber-300 bg-white mt-1"
              />
            </div>
          </div>

          {/* SECTION 2: FIELD-LEVEL CUSTOMIZATION (STANDARD VS CUSTOM) */}
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm space-y-4">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E]">
                2. Field-Level Information (Standard vs Custom)
              </h4>
              <p className="text-[11px] text-stone-500">
                Choose whether each field uses platform suggestions or your Mandapam's custom customs.
              </p>
            </div>

            {/* Devi Form Toggle */}
            <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">Devi / Maa Form</span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUseStdDevi(true)}
                    className={`px-2 py-0.5 rounded-md ${useStdDevi ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border"}`}
                  >
                    Use Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseStdDevi(false)}
                    className={`px-2 py-0.5 rounded-md ${!useStdDevi ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border"}`}
                  >
                    Customize
                  </button>
                </div>
              </div>
              {useStdDevi ? (
                <p className="text-xs text-stone-600 italic">Platform Standard: {stdDay.deviName}</p>
              ) : (
                <input
                  type="text"
                  value={customDevi}
                  onChange={(e) => setCustomDevi(e.target.value)}
                  placeholder="Enter custom Devi alankaram name..."
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white mt-1"
                />
              )}
            </div>

            {/* Pooja Timings Toggle */}
            <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">Pooja Timings</span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUseStdPooja(true)}
                    className={`px-2 py-0.5 rounded-md ${useStdPooja ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border"}`}
                  >
                    Use Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseStdPooja(false)}
                    className={`px-2 py-0.5 rounded-md ${!useStdPooja ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border"}`}
                  >
                    Customize
                  </button>
                </div>
              </div>
              {useStdPooja ? (
                <p className="text-xs text-stone-600 italic">Standard: Morning 08:00 AM & Evening 06:30 PM</p>
              ) : (
                <input
                  type="text"
                  value={customPooja}
                  onChange={(e) => setCustomPooja(e.target.value)}
                  placeholder="Morning: 07:30 AM | Evening: 06:30 PM"
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white mt-1"
                />
              )}
            </div>

            {/* Naivedhyam Toggle */}
            <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">Naivedhyam (Offerings)</span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUseStdNaivedhyam(true)}
                    className={`px-2 py-0.5 rounded-md ${useStdNaivedhyam ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border"}`}
                  >
                    Use Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseStdNaivedhyam(false)}
                    className={`px-2 py-0.5 rounded-md ${!useStdNaivedhyam ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border"}`}
                  >
                    Customize
                  </button>
                </div>
              </div>
              {useStdNaivedhyam ? (
                <p className="text-xs text-stone-600 italic">Standard: {stdDay.suggestedOfferings}</p>
              ) : (
                <input
                  type="text"
                  value={customNaivedhyam}
                  onChange={(e) => setCustomNaivedhyam(e.target.value)}
                  placeholder="e.g. Chakkara Pongali, Appalu, Panchamrutham"
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white mt-1"
                />
              )}
            </div>

            {/* Items to Bring Toggle */}
            <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">Devotee Items to Bring</span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUseStdItems(true)}
                    className={`px-2 py-0.5 rounded-md ${useStdItems ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border"}`}
                  >
                    Use Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseStdItems(false)}
                    className={`px-2 py-0.5 rounded-md ${!useStdItems ? "bg-[#8B1E1E] text-white font-bold" : "bg-white text-stone-700 border"}`}
                  >
                    Customize
                  </button>
                </div>
              </div>
              {useStdItems ? (
                <p className="text-xs text-stone-600 italic">Standard: {stdDay.suggestedItems}</p>
              ) : (
                <input
                  type="text"
                  value={customItems}
                  onChange={(e) => setCustomItems(e.target.value)}
                  placeholder="e.g. 2 coconuts, yellow flowers, betel leaves"
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-amber-300 bg-white mt-1"
                />
              )}
            </div>
          </div>

          {/* SECTION 3: ANNADANAM */}
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] flex items-center gap-1.5">
                <Utensils className="w-4 h-4" />
                <span>3. Daily Annadanam Setup</span>
              </h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={annadanamEnabled}
                  onChange={(e) => setAnnadanamEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#8B1E1E] rounded focus:ring-amber-500"
                />
                <span>Active Today</span>
              </label>
            </div>

            {annadanamEnabled && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={annadanamStart}
                    onChange={(e) => setAnnadanamStart(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    value={annadanamEnd}
                    onChange={(e) => setAnnadanamEnd(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Venue & Expected Attendance</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={annadanamLocation}
                      onChange={(e) => setAnnadanamLocation(e.target.value)}
                      placeholder="e.g. Kalyana Mandapam Ground Floor"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                    />
                    <input
                      type="number"
                      value={annadanamCount}
                      onChange={(e) => setAnnadanamCount(parseInt(e.target.value) || 0)}
                      placeholder="1200"
                      className="w-24 px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Publish Daily Updates to Live Devotee Feed</span>
          </button>
        </form>
      </div>
    </div>
  );
};

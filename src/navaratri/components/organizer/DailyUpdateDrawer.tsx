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
  Flame,
  Camera,
  ArrowLeft,
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
  const { getDaySetting, updateDaySetting, uploadAlankarana, alankaranas } = useNavaratriData();
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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // When selectedDayNum changes, load that day's data
  useEffect(() => {
    const s = getDaySetting(mandapam.id, selectedDayNum);
    const d = STANDARD_NAVARATRI_DAYS.find(item => item.dayNumber === selectedDayNum) || STANDARD_NAVARATRI_DAYS[0];
    const existingAlankarana = alankaranas?.find(a => a.mandapamId === mandapam.id && a.date === d.date);
    
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

    const initialImg = existingAlankarana?.imageUrl || d.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg");
    setAlankaranaImage(initialImg);
    setAlankaranaTitle(existingAlankarana?.title || `${d.deviName} Alankarana`);
    if (existingAlankarana?.description) {
      setAlankaranaDesc(existingAlankarana.description);
    }
  }, [selectedDayNum, mandapam.id, alankaranas]);

  const handleAlankaranaPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.85);
            setAlankaranaImage(compressed);
            toast.success("Mandapam idol photo loaded! Save day to publish.");
          } else {
            setAlankaranaImage(event.target?.result as string);
          }
          setIsUploadingPhoto(false);
        };
        img.onerror = () => {
          setIsUploadingPhoto(false);
          toast.error("Failed to parse image file.");
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingPhoto(false);
      toast.error("Failed to read image file.");
    }
  };

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

    toast.success(`Day ${String(selectedDayNum).padStart(2, "0")} (${stdDay.deviName}) details updated successfully!`);
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
          <div className="flex items-center justify-between pr-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#8B1E1E] text-xs font-bold">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Day {String(selectedDayNum).padStart(2, "0")} Configuration</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Days</span>
            </button>
          </div>
          <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#8B1E1E]">
            Day {String(selectedDayNum).padStart(2, "0")} • {stdDay.deviName}
          </h3>
          <div className="text-xs font-semibold text-amber-950 bg-amber-100/70 p-2.5 rounded-xl border border-amber-300/80 flex items-center justify-between">
            <span>🗓️ Festival Date: <strong>{stdDay.date}</strong></span>
            <span className="text-[11px] text-amber-800 font-mono">Day {String(selectedDayNum).padStart(2, "0")} of 10</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 pb-12">
          {/* SECTION 1: PHYSICAL ALANKARANA UPLOAD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm space-y-4">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-amber-700" />
                <span>1. Day {String(selectedDayNum).padStart(2, "0")} Idol Darshan & Alankarana Photo</span>
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Upload the real photograph of the mandapam idol for Day {String(selectedDayNum).padStart(2, "0")} so citizens see today's live darshan.
              </p>
            </div>

            {/* Photo Preview & Direct Upload Action */}
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200">
              <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md bg-stone-900 shrink-0">
                <img
                  src={alankaranaImage || (stdDay.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"))}
                  alt="Alankarana Preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                  <Camera className="w-5 h-5 mb-0.5 text-amber-300" />
                  <span className="text-[10px] font-bold">Change Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAlankaranaPhotoUpload}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                </label>
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-2 text-center sm:text-left">
                <div>
                  <div className="text-xs font-serif font-black text-[#8B1E1E]">
                    {stdDay.deviName} Darshan
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    {alankaranaImage && alankaranaImage !== (stdDay.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"))
                      ? "Custom mandapam idol photograph active for devotees."
                      : "Currently showing default auspicious deity photo. Tap upload to show your mandapam's real idol darshan."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingPhoto ? "Uploading..." : (alankaranaImage && alankaranaImage !== (stdDay.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg")) ? "Change Idol Photo" : "Upload Idol Photo")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAlankaranaPhotoUpload}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                  </label>

                  {alankaranaImage && alankaranaImage !== (stdDay.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg")) && (
                    <button
                      type="button"
                      onClick={() => setAlankaranaImage(stdDay.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"))}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Reset to Default
                    </button>
                  )}
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
                Day {String(selectedDayNum).padStart(2, "0")}
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

          {/* SAVE BUTTON & CLOSE ACTION */}
          <div className="pt-2 sticky bottom-0 bg-[#FDFBF7] py-3 border-t border-amber-300 flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Day {String(selectedDayNum).padStart(2, "0")} Updates & Publish Live</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold transition-all border border-stone-300 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              <span>Close & Go to Another Day</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { navaratriAsset } from "../utils/navaratriAssets";
import React, { useState } from "react";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../context/NavaratriLanguageContext";
import {
  Store,
  CheckCircle2,
  TrendingUp,
  Phone,
  Eye,
  Copy,
  MessageCircle,
  Tag,
  Check,
  Clock,
  Layers,
  Zap,
  ShieldCheck,
  Flame,
  ArrowRight,
  ArrowDown
} from "lucide-react";
import { toast } from "sonner";

export const NavaratriAdvertise: React.FC = () => {
  const { adPackages, advertisements } = useNavaratriData();
  const { t } = useNavaratriLanguage();

  // Ad Space Ownership State: Combinational (Shared 6s Rotation) vs Exclusive 24/7 Solo (No other ads in frame)
  const [adSpaceType, setAdSpaceType] = useState<"ROTATING" | "EXCLUSIVE">("ROTATING");

  // Ad Placement Frame State (For Permanent / Exclusive ads): Top Below Header, Bottom Above Footer, or Both
  const [preferredFrame, setPreferredFrame] = useState<"TOP" | "BOTTOM" | "BOTH">("TOP");

  // Package State
  const [selectedPkgId, setSelectedPkgId] = useState(adPackages[0]?.id || "pkg-starter");

  const handleSelectSpaceType = (newType: "ROTATING" | "EXCLUSIVE") => {
    setAdSpaceType(newType);
    const currentPkg = adPackages.find((p) => p.id === selectedPkgId);
    const currentDays = currentPkg?.durationDays || 1;
    // Map to equivalent duration in the chosen space type
    const matching = adPackages.find(
      (p) => (p.spaceType || "ROTATING") === newType && p.durationDays === currentDays
    );
    if (matching) {
      setSelectedPkgId(matching.id);
    } else {
      const fallback = adPackages.find((p) => (p.spaceType || "ROTATING") === newType);
      if (fallback) setSelectedPkgId(fallback.id);
    }
  };

  const selectedPkg =
    adPackages.find((p) => p.id === selectedPkgId) ||
    adPackages[0] || {
      id: "pkg-starter",
      name: "1 Day Daily Booster",
      spaceType: "ROTATING" as const,
      durationDays: 1,
      priceInr: 49,
      estimatedImpressions: 1500,
      features: ["Rotates every 6s", "Targeted zone", "100% in-frame"]
    };

  const isExclusive = adSpaceType === "EXCLUSIVE";
  const effectivePrice =
    isExclusive && preferredFrame === "BOTH"
      ? Math.round(selectedPkg.priceInr * 1.6)
      : selectedPkg.priceInr;

  const currentDurationPackages = adPackages.filter(
    (p) => (p.spaceType || "ROTATING") === adSpaceType
  );

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-6 sm:space-y-8 pb-24 font-sans">
      {/* Hero Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#7A1515] text-white p-5 sm:p-8 md:p-10 shadow-2xl border-2 sm:border-4 border-amber-400/60">
        {/* Full-bleed complete container background image */}
        <img
          src={navaratriAsset("/navaratri/assets/advertise-hero-banner-bg.jpg")}
          alt="Navaratri Festive Background"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right sm:object-center pointer-events-none select-none"
        />
        {/* Subtle dark gradient overlay to ensure perfect text contrast across all screen sizes */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/20 pointer-events-none" />

        <div className="relative z-10 space-y-2 sm:space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/25 text-amber-200 text-[10px] sm:text-xs font-bold border border-amber-300/50 backdrop-blur-md shadow-xs">
            <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">Hyper-Local Advertising • 15,000+ Devotees</span>
          </div>
          <h1 className="font-['Cinzel',serif] font-black text-xl sm:text-3xl md:text-4xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
            Promote Your Business from ₹49/day
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-amber-100/95 font-medium leading-relaxed drop-shadow-sm">
            Reach thousands of local devotees actively discovering Mandapams in your zone — sweet stalls, flowers, pooja samagri, silks, jewellery, restaurants &amp; more.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* STEP 1: SELECT AD SPACE & DURATION */}
        <div className="space-y-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1E1E]">
              <Tag className="w-3.5 h-3.5" />
              <span>STEP 1: SELECT AD SPACE &amp; DURATION</span>
            </div>
            <h2 className="font-['Cinzel',serif] font-bold text-lg sm:text-xl text-stone-900">
              Choose Your Ad Space Visibility &amp; Duration
            </h2>
            <p className="text-xs text-stone-600">
              Select between budget-friendly combinational ads (shared frame rotating every 6s) or dedicated 24/7 exclusive solo banner space (your ad only, zero competing ads).
            </p>
          </div>

          {/* AD SPACE OWNERSHIP CHOICE (Combinational vs Exclusive 24/7 Solo) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
              Select Visibility Model *
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3.5">
              {/* Option 1: Combinational / Shared Ads */}
              <div
                onClick={() => handleSelectSpaceType("ROTATING")}
                className={`cursor-pointer rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border-2 transition-all relative flex flex-col justify-between ${
                  adSpaceType === "ROTATING"
                    ? "bg-amber-50/90 border-[#8B1E1E] shadow-md ring-2 ring-[#8B1E1E]/20"
                    : "bg-white border-amber-200/90 hover:border-amber-300 hover:bg-stone-50/60 shadow-xs"
                }`}
              >
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      🔄 <span className="hidden xs:inline">Shared</span> Rotation
                    </span>
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full shrink-0 flex items-center justify-center transition-all ${
                        adSpaceType === "ROTATING"
                          ? "bg-[#8B1E1E] text-white"
                          : "border-2 border-stone-300"
                      }`}
                    >
                      {adSpaceType === "ROTATING" && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-black text-xs sm:text-base text-stone-900 leading-tight">
                      Combinational Ad Space
                    </h3>
                    <p className="text-[10px] sm:text-xs text-stone-600 mt-1 leading-snug line-clamp-3 sm:line-clamp-none">
                      Rotates every 6 seconds with other local sponsors. High-frequency reach at lowest cost.
                    </p>
                  </div>

                  <div className="pt-1.5 sm:pt-2 border-t border-amber-100 space-y-1 text-[10px] sm:text-xs">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-stone-700">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                      <span>Starts from <strong className="text-[#8B1E1E]">₹49/day</strong></span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-stone-700">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                      <span>Mobile &amp; desktop frames</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-stone-700">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                      <span>Direct 1-tap call &amp; WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 2: Exclusive 24/7 Solo Ad Space */}
              <div
                onClick={() => handleSelectSpaceType("EXCLUSIVE")}
                className={`cursor-pointer rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border-2 transition-all relative flex flex-col justify-between ${
                  adSpaceType === "EXCLUSIVE"
                    ? "bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/40 border-[#8B1E1E] shadow-md ring-2 ring-[#8B1E1E]/20"
                    : "bg-white border-amber-200/90 hover:border-amber-300 hover:bg-stone-50/60 shadow-xs"
                }`}
              >
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-[#8B1E1E] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                      👑 <span className="hidden xs:inline">100%</span> Solo
                    </span>
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full shrink-0 flex items-center justify-center transition-all ${
                        adSpaceType === "EXCLUSIVE"
                          ? "bg-[#8B1E1E] text-white"
                          : "border-2 border-stone-300"
                      }`}
                    >
                      {adSpaceType === "EXCLUSIVE" && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-black text-xs sm:text-base text-stone-900 leading-tight">
                      Permanent 24/7 Solo Ad
                    </h3>
                    <p className="text-[10px] sm:text-xs text-stone-600 mt-1 leading-snug line-clamp-3 sm:line-clamp-none">
                      100% permanent solo ownership of the frame. ZERO rotation. Zero competitor banners.
                    </p>
                  </div>

                  <div className="pt-1.5 sm:pt-2 border-t border-amber-100 space-y-1 text-[10px] sm:text-xs">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-stone-700">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                      <span>Starts from <strong className="text-[#8B1E1E]">₹149/day</strong></span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-stone-700">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                      <span>Top, Bottom, or Both frames</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-stone-700">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                      <span>Fixed 24/7 presence all day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DURATION SELECTION (1 Day, 3 Days, 9 Days) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
                Choose Campaign Duration ({adSpaceType === "EXCLUSIVE" ? "Permanent 24/7 Solo" : "Combinational 6s Rotation"}) *
              </label>
              <span className="text-[11px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                {currentDurationPackages.length} options available
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
              {currentDurationPackages.map((pkg) => {
                const isSelected = selectedPkgId === pkg.id;
                const isFestival = pkg.durationDays === 9 || pkg.durationDays === 10;
                const isBooster = pkg.durationDays === 3;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`cursor-pointer rounded-xl sm:rounded-2xl p-2 sm:p-4 border-2 transition-all relative flex flex-col justify-between group ${
                      isSelected
                        ? "bg-amber-50/90 border-[#8B1E1E] shadow-md ring-2 ring-[#8B1E1E]/20"
                        : "bg-white border-amber-200/90 hover:border-amber-300 hover:bg-stone-50/50 shadow-xs"
                    }`}
                  >
                    <div>
                      {/* Badges */}
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        {isFestival ? (
                          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-[#8B1E1E] text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-0.5">
                            <Flame className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" /> All 9 Days
                          </span>
                        ) : isBooster ? (
                          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">
                            Popular
                          </span>
                        ) : (
                          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider">
                            Starter
                          </span>
                        )}
                      </div>

                      {/* Plan title & radio */}
                      <div className="flex items-start gap-1 sm:gap-2">
                        <div
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-[#8B1E1E] text-white"
                              : "border border-stone-300 group-hover:border-amber-400"
                          }`}
                        >
                          {isSelected && <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif font-black text-[11px] sm:text-sm text-stone-900 leading-tight line-clamp-2 sm:line-clamp-none sm:truncate">
                            {pkg.name}
                          </h4>
                          <span className="text-[9px] sm:text-[10px] text-stone-500 block">
                            {pkg.durationDays} {pkg.durationDays === 1 ? "Day" : "Days"} Active
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-1.5 sm:mt-2.5 sm:pl-6">
                        <div className="flex items-baseline gap-0.5 sm:gap-1 flex-wrap">
                          <span className="font-serif font-black text-sm sm:text-xl text-[#8B1E1E]">
                            ₹{pkg.priceInr}
                          </span>
                          <span className="text-[8px] sm:text-[10px] text-stone-500">
                            /{pkg.durationDays}d
                          </span>
                        </div>
                      </div>

                      {/* Benefit points */}
                      <div className="mt-1.5 sm:mt-2 sm:pl-6 space-y-0.5 sm:space-y-1 text-[9px] sm:text-[11px] text-stone-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-700 shrink-0" />
                          <span className="truncate">~{(pkg.estimatedImpressions ?? pkg.impressionLimit ?? 1500).toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {pkg.spaceType === "EXCLUSIVE" ? "Permanent solo" : "Rotates 6s"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Button footer */}
                    <div className="mt-2 sm:mt-3 sm:pl-6">
                      <div
                        className={`w-full py-1 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-bold text-center transition-all ${
                          isSelected
                            ? "bg-[#8B1E1E] text-white shadow-xs"
                            : "bg-amber-100/80 text-stone-700 group-hover:bg-amber-200"
                        }`}
                      >
                        {isSelected ? "Selected ✓" : (
                          <>
                            <span className="sm:hidden">Choose</span>
                            <span className="hidden sm:inline">Tap to Choose</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FRAME SELECTION FOR PERMANENT / EXCLUSIVE AD RUN */}
          {adSpaceType === "EXCLUSIVE" && (
            <div className="pt-3 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-700" />
                    Choose Frame for Permanent 24/7 Run
                  </span>
                  <p className="text-[11px] text-stone-600">
                    Mobile &amp; Desktop have 2 frames: Top below header and Bottom above footer. Choose your permanent frame:
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  2 Dedicated Frames
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Top Frame */}
                <div
                  onClick={() => setPreferredFrame("TOP")}
                  className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative flex flex-col justify-between ${
                    preferredFrame === "TOP"
                      ? "bg-gradient-to-br from-amber-50 to-orange-50/50 border-[#8B1E1E] shadow-md ring-2 ring-[#8B1E1E]/20"
                      : "bg-white border-amber-200/90 hover:border-amber-300 shadow-xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                        Top Frame
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          preferredFrame === "TOP" ? "bg-[#8B1E1E] text-white" : "border border-stone-300"
                        }`}
                      >
                        {preferredFrame === "TOP" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <h4 className="font-serif font-black text-sm text-stone-900">
                      Top Frame (Below Header)
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-snug">
                      Immediate first impression! Sits right below the header on both mobile and desktop views.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#8B1E1E]">₹{selectedPkg.priceInr}</span>
                    <span className="text-[10px] font-bold text-stone-500">
                      {preferredFrame === "TOP" ? "Selected ✓" : "Choose Top"}
                    </span>
                  </div>
                </div>

                {/* Bottom Frame */}
                <div
                  onClick={() => setPreferredFrame("BOTTOM")}
                  className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative flex flex-col justify-between ${
                    preferredFrame === "BOTTOM"
                      ? "bg-gradient-to-br from-amber-50 to-orange-50/50 border-[#8B1E1E] shadow-md ring-2 ring-[#8B1E1E]/20"
                      : "bg-white border-amber-200/90 hover:border-amber-300 shadow-xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                        Bottom Frame
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          preferredFrame === "BOTTOM" ? "bg-[#8B1E1E] text-white" : "border border-stone-300"
                        }`}
                      >
                        {preferredFrame === "BOTTOM" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <h4 className="font-serif font-black text-sm text-stone-900">
                      Bottom Frame (Above Footer)
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-snug">
                      High action conversion! Sits right above the footer on both mobile and desktop views.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#8B1E1E]">₹{selectedPkg.priceInr}</span>
                    <span className="text-[10px] font-bold text-stone-500">
                      {preferredFrame === "BOTTOM" ? "Selected ✓" : "Choose Bottom"}
                    </span>
                  </div>
                </div>

                {/* Both Frames */}
                <div
                  onClick={() => setPreferredFrame("BOTH")}
                  className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative flex flex-col justify-between ${
                    preferredFrame === "BOTH"
                      ? "bg-gradient-to-br from-amber-100/90 via-orange-50 to-amber-50 border-[#8B1E1E] shadow-md ring-2 ring-[#8B1E1E]/20"
                      : "bg-white border-amber-200/90 hover:border-amber-300 shadow-xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-[#8B1E1E] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                        👑 Both Frames
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          preferredFrame === "BOTH" ? "bg-[#8B1E1E] text-white" : "border border-stone-300"
                        }`}
                      >
                        {preferredFrame === "BOTH" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <h4 className="font-serif font-black text-sm text-stone-900">
                      Both Frames (Top &amp; Bottom)
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-snug">
                      Maximum reach! Permanent 24/7 solo presence in BOTH Top &amp; Bottom frames.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#8B1E1E]">
                        ₹{Math.round(selectedPkg.priceInr * 1.6)}
                      </span>
                      <span className="text-[9px] text-emerald-700 font-bold ml-1">Combo Save 20%</span>
                    </div>
                    <span className="text-[10px] font-bold text-stone-500">
                      {preferredFrame === "BOTH" ? "Selected ✓" : "Choose Both"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CONTACT US TO RUN ADS (REPLACES COMPLEX STEP 2 & STEP 3 FORMS) */}
        <div className="p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-amber-50/70 to-orange-50/60 border-2 border-amber-400/90 shadow-xl space-y-6 text-center relative overflow-hidden">
          {/* Subtle golden corner backdrop glow */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-orange-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Selected Plan Summary Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300/90 shadow-xs">
            <span className="text-xs sm:text-sm font-bold text-stone-900">
              Selected Plan: <strong className="text-[#8B1E1E]">{selectedPkg.name}</strong> •{" "}
              <span className="font-mono text-emerald-800 font-black">₹{effectivePrice}</span>
              {adSpaceType === "EXCLUSIVE" && (
                <span className="text-[11px] text-amber-900 font-semibold ml-1">
                  ({preferredFrame === "BOTH" ? "Both Frames" : preferredFrame === "TOP" ? "Top Frame" : "Bottom Frame"})
                </span>
              )}
            </span>
          </div>

          <div className="max-w-xl mx-auto space-y-2 relative z-10">
            <h3 className="font-['Cinzel',serif] font-black text-2xl sm:text-3xl text-[#8B1E1E]">
              Contact Us to Run Ads
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
              No complex forms or design skills needed! Simply tap below to call or WhatsApp our team. We will design your festive ad poster for <strong>FREE</strong> and activate your ad across all Mandapams in under <strong>15 minutes</strong>.
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto pt-2 relative z-10">
            {/* Call Button */}
            <a
              href="tel:6303602743"
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8B1E1E] via-[#9A241C] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-amber-200 font-medium">Direct Phone Call</p>
                <p className="font-black font-mono tracking-wide leading-tight text-white">Call: 6303602743</p>
              </div>
            </a>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/916303602743?text=${encodeURIComponent(
                `Hello! I want to run an advertisement on Sharan Navaratri 2026 for my business.\n\n📌 Selected Plan: ${selectedPkg.name} (₹${effectivePrice})\n🎯 Space Type: ${
                  adSpaceType === "EXCLUSIVE"
                    ? `Permanent 24/7 Solo (${preferredFrame === "BOTH" ? "Both Frames" : preferredFrame === "TOP" ? "Top Frame" : "Bottom Frame"})`
                    : "6s Rotation"
                }\n\nPlease help me with my business banner design and campaign activation.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-emerald-200 font-medium">Instant Chat &amp; Setup</p>
                <p className="font-black font-mono tracking-wide leading-tight text-white">WhatsApp Us</p>
              </div>
            </a>
          </div>

          {/* Quick Copy Number & Trust Highlights */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-stone-600 relative z-10">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText("6303602743");
                toast.success("Phone number 6303602743 copied to clipboard!");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-stone-800 font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#8B1E1E]" />
              <span>Copy 6303602743</span>
            </button>

            <span className="hidden sm:inline text-amber-400">•</span>

            <span className="inline-flex items-center gap-1.5 font-medium text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free Festive Banner Design</span>
            </span>

            <span className="hidden sm:inline text-amber-400">•</span>

            <span className="inline-flex items-center gap-1.5 font-medium text-stone-700">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Fast Activation (~1 Hour)</span>
            </span>
          </div>

          {/* 3 Step Simple Process Cards with Linking Connectors */}
          <div className="pt-5 border-t border-amber-200/90 text-left relative z-10">
            {/* Step Pipeline Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900/80 flex items-center gap-1.5">
                <span>3-Step Quick Process</span>
              </span>
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/70">
                <span>1. Contact</span>
                <ArrowRight className="w-3 h-3 text-amber-600" />
                <span>2. Design</span>
                <ArrowRight className="w-3 h-3 text-amber-600" />
                <span>3. Live Ads</span>
              </div>
            </div>

            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1 */}
              <div className="relative p-4 rounded-2xl bg-white/95 border-2 border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-[#8B1E1E] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      1
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#8B1E1E] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Step 1
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-stone-900 group-hover:text-[#8B1E1E] transition-colors">
                    Call or WhatsApp Us
                  </h5>
                  <p className="mt-1 text-[11px] text-stone-600 leading-snug">
                    Contact on <strong className="text-stone-900">6303602743</strong>. Share your business name, colony, and products/offers.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:6303602743"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B1E1E] hover:underline"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                    <span className="text-stone-300">•</span>
                    <a
                      href={`https://wa.me/916303602743?text=${encodeURIComponent(
                        `Hello! I want to run an advertisement on Sharan Navaratri 2026 for my business.\n\n📌 Selected Plan: ${selectedPkg.name} (₹${effectivePrice})\n🎯 Space Type: ${
                          adSpaceType === "EXCLUSIVE" ? "Exclusive 24/7 Solo" : "Shared 6s Rotation"
                        }`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      <MessageCircle className="w-3 h-3" /> Chat Now →
                    </a>
                  </div>
                </div>

                {/* Desktop Connector Link to Card 2 */}
                <div className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-[#8B1E1E] text-white items-center justify-center shadow-md ring-4 ring-white">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              {/* Mobile Connector Arrow 1 -> 2 */}
              <div className="flex sm:hidden justify-center items-center -my-1 z-20">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative p-4 rounded-2xl bg-white/95 border-2 border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-[#8B1E1E] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      2
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Step 2
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-stone-900 group-hover:text-[#8B1E1E] transition-colors">
                    Send Photo / Visiting Card
                  </h5>
                  <p className="mt-1 text-[11px] text-stone-600 leading-snug">
                    Send your shop photo, visiting card, or logo. Our designers create an attractive festive banner for you.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between">
                  <a
                    href={`https://wa.me/916303602743?text=${encodeURIComponent(
                      "Hello! Here is my shop visiting card/photo for the Navaratri festive banner design."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    <MessageCircle className="w-3 h-3" /> Send on WhatsApp →
                  </a>
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                    Free Design
                  </span>
                </div>

                {/* Desktop Connector Link to Card 3 */}
                <div className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-[#8B1E1E] text-white items-center justify-center shadow-md ring-4 ring-white">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              {/* Mobile Connector Arrow 2 -> 3 */}
              <div className="flex sm:hidden justify-center items-center -my-1 z-20">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative p-4 rounded-2xl bg-white/95 border-2 border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-[#8B1E1E] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      3
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Step 3
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-stone-900 group-hover:text-[#8B1E1E] transition-colors">
                    Ad Goes Live Across Mandapams
                  </h5>
                  <p className="mt-1 text-[11px] text-stone-600 leading-snug">
                    Devotees see your ad banner right on mandapam notice boards with direct 1-tap call &amp; WhatsApp buttons.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between">
                  <a
                    href="#live-campaigns"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B1E1E] hover:underline"
                  >
                    <Eye className="w-3 h-3" /> View Live Mandapams ↓
                  </a>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                    ~15 Min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE CAMPAIGNS DASHBOARD */}
        <div id="live-campaigns" className="space-y-4 pt-6 border-t-2 border-amber-300/80">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Cinzel',serif] font-bold text-xl text-[#8B1E1E]">
                Current Active Local Business Campaigns
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                Live ads running across Mandapam discovery and devotee notice boards
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-[#8B1E1E] font-bold text-xs border border-amber-300">
              {advertisements.length} Campaigns
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {advertisements.map((ad) => (
              <div
                key={ad.id}
                className="p-4 rounded-2xl bg-white border border-amber-300 shadow-sm space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8B1E1E] font-serif truncate">{ad.businessName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {ad.status}
                  </span>
                </div>
                <p className="text-stone-800 font-semibold truncate">{ad.title}</p>
                <p className="text-[11px] text-stone-500">
                  📍 Zone: {ad.targetZone || ad.targetArea || ad.city}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-stone-800">
                    <Eye className="w-3.5 h-3.5 text-amber-700" />
                    {ad.impressions} Views
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-stone-800">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                    {ad.clicks} Clicks
                  </span>
                  <span className="text-emerald-700 font-bold">
                    {ad.paymentStatus || "PAID"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

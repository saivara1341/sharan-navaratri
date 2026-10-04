import { navaratriAsset } from "../../utils/navaratriAssets";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavaratriLanguage, LanguageCode } from "../../context/NavaratriLanguageContext";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import {
  Globe,
  BookOpen,
  Heart,
  Building,
  Menu,
  X,
  Store,
  MapPin,
  QrCode,
  KeyRound
} from "lucide-react";
import { INVOCATION_TRANSLATIONS } from "../../utils/navaratriTranslations";

export const NavaratriHeader: React.FC = () => {
  const { language, setLanguage, t } = useNavaratriLanguage();
  const { followedIds } = useNavaratriData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleOpenScanner = () => {
    setMobileMenuOpen(false);
    window.dispatchEvent(new Event("navaratri:open-scanner"));
  };

  const navLinks = [
    { label: t.home, path: "/navaratri", icon: Building },
    { label: t.know, path: "/navaratri/know", icon: BookOpen },
    { label: t.nearMe, path: "/navaratri/near-me", icon: MapPin },
    { label: t.following, path: "/navaratri/following", icon: Heart, badge: followedIds.length || undefined }
  ];

  const languages: Array<{ code: LanguageCode; label: string }> = [
    { code: "en", label: "English" },
    { code: "te", label: "తెలుగు" },
    { code: "hi", label: "हिन्दी" },
    { code: "ta", label: "தமிழ்" },
    { code: "ml", label: "മലയാളം" },
    { code: "kn", label: "ಕನ್ನಡ" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b-2 border-[#D97706]/30 shadow-md">
      {/* Top Sacred Saffron & Maroon Invocation Ribbon */}
      <div className="bg-gradient-to-r from-[#8B1E1E] via-[#9A241C] to-[#8B1E1E] text-white text-xs px-2 sm:px-4 lg:px-6 py-1.5 flex items-center justify-between shadow-inner">
        {/* Left Corner: ॥ Om Sri Matre Namaha ॥ */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-serif tracking-wider text-amber-200 font-bold text-xs sm:text-sm drop-shadow whitespace-nowrap">
            {language === "en" ? "॥ Om Sri Matre Namaha ॥" : (INVOCATION_TRANSLATIONS[language] || "॥ Om Sri Matre Namaha ॥")}
          </span>
        </div>

        {/* Right Corner: Language Switcher */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">

          {/* Multilingual Switcher */}
          <div className="flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 border border-amber-400/40 text-[11px] font-bold shrink-0">
            <Globe className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as LanguageCode)}
              aria-label="Choose language"
              className="max-w-[7.5rem] bg-transparent py-1 text-amber-100 outline-none cursor-pointer"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code} className="bg-[#5C1010] text-white">
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Devotional Header Branding Row */}
      <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
        <Link to="/navaratri" className="min-w-0 flex items-center gap-2.5 sm:gap-3.5 group">
          <div className="relative flex items-center justify-center">
            {/* Divine golden aura glow behind Trishula head */}
            <div className="absolute inset-0 bg-amber-400/30 blur-md rounded-full pointer-events-none" />
            <img
              src={navaratriAsset("/navaratri/assets/trishula-head.png")}
              alt="Sacred Trishula"
              className="relative h-8 sm:h-10 w-auto object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(217,119,6,0.5)] transition-transform group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <span className="whitespace-nowrap font-['Cinzel',serif] font-black text-base sm:text-xl text-[#8B1E1E] tracking-tight leading-none drop-shadow-xs">
              Sharan Navaratri
            </span>
          </div>
        </Link>

        {/* Unified 1-Button: [Login as Mandapam (Organizers)] [+Register Mandapam] [Run Ads] in Run Ads Pointed-Leaf Design */}
        <div className="hidden lg:relative lg:inline-flex items-center py-1 px-6 sm:px-7 drop-shadow-md hover:drop-shadow-lg transition-all group/leaf">
          {/* Pointed pill / leaf shape background matching Run Ads design */}
          <svg
            viewBox="0 0 520 44"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full text-[#C12535] group-hover/leaf:text-[#A81B2B] transition-colors"
          >
            <path
              d="M 22 1 L 498 1 C 509 1, 516 14, 519 22 C 516 30, 509 43, 498 43 L 22 43 C 11 43, 4 30, 1 22 C 4 14, 11 1, 22 1 Z"
              fill="currentColor"
              stroke="#F59E0B"
              strokeWidth="1.5"
            />
          </svg>

          {/* 1. Login as Mandapam (Organizers) */}
          <Link
            to="/navaratri/login"
            className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white hover:text-amber-200 hover:bg-black/15 text-xs font-bold transition-all"
            title="Organizer Login for Registered Mandapams"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Login as Mandapam (Organizers)</span>
          </Link>

          <div className="relative z-10 h-4 w-[1px] bg-white/30 mx-0.5" />

          {/* 2. +Register Mandapam (White highlighted pill) */}
          <Link
            to="/navaratri/register"
            className="relative z-10 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-[#8B1E1E] text-xs font-black shadow-sm transition-all active:scale-95"
            title="Register New Mandapam"
          >
            <span className="text-sm font-black leading-none">+</span>
            <span>{t.registerMandapam}</span>
          </Link>

          <div className="relative z-10 h-4 w-[1px] bg-white/30 mx-0.5" />

          {/* 3. Run Ads */}
          <Link
            to="/navaratri/advertise"
            className="relative z-10 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-white hover:text-amber-200 hover:bg-black/15 text-xs font-bold transition-all"
            title={t.advertiseWithUs || "Run Ads"}
          >
            <span>Run Ads</span>
          </Link>
        </div>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-stone-800 hover:bg-amber-100/80 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-b-2 border-amber-300 px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    isActive
                      ? "bg-[#8B1E1E] text-white"
                      : "bg-amber-50 text-stone-800 border border-amber-200"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#8B1E1E]" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-amber-200 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleOpenScanner}
              className="py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 text-xs font-bold text-center shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-amber-300"
            >
              <QrCode className="w-4 h-4 text-stone-950" />
              <span>Scan Mandapam QR (Camera)</span>
            </button>

            {/* Unified 1-Button for Mobile: [Login as Mandapam (Organizers) | + Register Mandapam | Run Ads] */}
            <div className="p-1 rounded-2xl bg-white border-2 border-amber-300 shadow-xs flex items-center justify-between gap-1">
              <Link
                to="/navaratri/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 px-1.5 rounded-xl text-stone-800 hover:text-[#8B1E1E] hover:bg-amber-50 text-xs font-bold text-center flex items-center justify-center gap-1 transition-all"
                title="Login as Mandapam (Organizers)"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#8B1E1E] shrink-0" />
                <span className="truncate">Login as Mandapam</span>
              </Link>

              <div className="h-5 w-[1px] bg-amber-200" />

              <Link
                to="/navaratri/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 px-1.5 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-xs font-bold text-center flex items-center justify-center gap-1 transition-all shadow-xs"
                title="Register Mandapam"
              >
                <span className="truncate">+ Register</span>
              </Link>

              <div className="h-5 w-[1px] bg-amber-200" />

              <Link
                to="/navaratri/advertise"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 px-1.5 rounded-xl hover:bg-amber-100 text-amber-900 text-xs font-bold text-center flex items-center justify-center gap-1 transition-all"
                title={t.advertiseWithUs || "Run Ads"}
              >
                <span className="truncate">Run Ads</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

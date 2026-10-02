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
import { TrishoolIcon } from "../devotional/SacredMotionGraphics";

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
      <div className="bg-gradient-to-r from-[#8B1E1E] via-[#9A241C] to-[#8B1E1E] text-white text-xs px-4 py-1.5 flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2">
          <span className="font-serif tracking-wider text-amber-200 font-bold text-xs sm:text-sm drop-shadow">
            ॥ ॐ శ్రీ మాత్రే నమః ॥
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Multilingual Switcher */}
          <div className="flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 border border-amber-400/40 text-[11px] font-bold">
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
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-800/90 mt-0.5">
              Nizamabad & Telangana
            </span>
          </div>
        </Link>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-stone-800 hover:bg-amber-100/80 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Dedicated Main Menu for Desktop View (Hidden on mobile view, contains all 8 items) */}
      <div className="hidden lg:block border-t border-amber-200/80 bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE] to-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          {/* Main Navigation Links */}
          <nav className="flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 transition-all ${
                    isActive
                      ? "bg-[#8B1E1E] text-white shadow-sm"
                      : "text-stone-800 hover:text-[#8B1E1E] hover:bg-amber-100/70"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-[#8B1E1E]"}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 font-bold text-[9px] flex items-center justify-center ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Scan QR in Main Menu */}
            <button
              type="button"
              onClick={handleOpenScanner}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 text-xs font-bold transition-all shadow-xs hover:shadow active:scale-95 cursor-pointer border border-amber-300"
              title="Scan Mandapam QR with Camera"
            >
              <QrCode className="w-3.5 h-3.5 text-stone-950" />
              <span>Scan QR</span>
            </button>
          </nav>

          {/* Action CTAs in Main Menu */}
          <div className="flex items-center gap-2">
            {/* Advertise With Us */}
            <Link
              to="/navaratri/advertise"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/90 hover:bg-amber-200 text-amber-950 text-xs font-bold border border-amber-300/80 transition-colors shadow-xs"
            >
              <Store className="w-3.5 h-3.5 text-[#8B1E1E]" />
              <span>{t.advertiseWithUs}</span>
            </Link>

            {/* Login as Mandapam */}
            <Link
              to="/navaratri/organizer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-[#8B1E1E] text-xs font-bold border border-amber-300 transition-all shadow-xs hover:shadow active:scale-95"
              title="Organizer Login for Registered Mandapams"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#8B1E1E]" />
              <span>{t.mandapamLogin}</span>
            </Link>

            {/* + Register Mandapam */}
            <Link
              to="/navaratri/register"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-xs font-bold shadow-xs hover:shadow transition-all active:scale-95"
            >
              <span>+</span>
              <span>{t.registerMandapam}</span>
            </Link>
          </div>
        </div>
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

            {/* Login as Mandapam for Mobile */}
            <Link
              to="/navaratri/organizer"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#8B1E1E] text-xs font-bold text-center border border-amber-300 flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <KeyRound className="w-4 h-4 text-[#8B1E1E]" />
              <span>{t.mandapamLogin} (Organizers)</span>
            </Link>

            {/* + Register Mandapam for Mobile */}
            <Link
              to="/navaratri/register"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <span>+</span>
              <span>{t.registerMandapam}</span>
            </Link>

            <Link
              to="/navaratri/advertise"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 rounded-xl bg-amber-100 text-amber-950 text-xs font-bold text-center border border-amber-300 flex items-center justify-center gap-1.5"
            >
              <span>🏪</span>
              <span>{t.advertiseWithUs} (₹49/day)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

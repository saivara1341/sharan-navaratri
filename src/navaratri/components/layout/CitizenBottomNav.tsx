import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { Home, BookOpen, MapPin, Heart, QrCode } from "lucide-react";

export const CitizenBottomNav: React.FC = () => {
  const { t } = useNavaratriLanguage();
  const { followedIds } = useNavaratriData();
  const location = useLocation();

  const handleOpenScanner = () => {
    window.dispatchEvent(new Event("navaratri:open-scanner"));
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#FBF8F1]/95 backdrop-blur-md border-t border-[#D97706]/30 shadow-2xl py-1.5 px-3 flex items-center justify-around sm:hidden">
      {/* Home */}
      <Link
        to="/navaratri"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
          location.pathname === "/navaratri" ? "text-[#9A241C] font-bold" : "text-stone-600 hover:text-[#9A241C]"
        }`}
      >
        <Home className={`w-5 h-5 ${location.pathname === "/navaratri" ? "stroke-[2.5]" : ""}`} />
        <span>{t.home}</span>
      </Link>

      {/* Know Navaratri */}
      <Link
        to="/navaratri/know"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
          location.pathname.startsWith("/navaratri/know") ? "text-[#9A241C] font-bold" : "text-stone-600 hover:text-[#9A241C]"
        }`}
      >
        <BookOpen className={`w-5 h-5 ${location.pathname.startsWith("/navaratri/know") ? "stroke-[2.5]" : ""}`} />
        <span>{t.know}</span>
      </Link>

      {/* Center Floating Scan QR Button */}
      <div className="relative -top-3.5 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={handleOpenScanner}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#9A241C] via-[#B45309] to-[#D97706] text-white flex items-center justify-center shadow-lg hover:shadow-xl transform active:scale-95 transition-all border-2 border-white ring-2 ring-[#D97706]/40 cursor-pointer"
          aria-label="Scan Mandapam QR with Camera"
        >
          <QrCode className="w-6 h-6" />
        </button>
        <span className="mt-1 text-center text-[9px] font-bold text-[#8B1E1E] leading-tight whitespace-nowrap block drop-shadow-xs">
          {t.scanQr}
        </span>
      </div>

      {/* Near Me */}
      <Link
        to="/navaratri/near-me"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
          location.pathname.startsWith("/navaratri/near-me") ? "text-[#9A241C] font-bold" : "text-stone-600 hover:text-[#9A241C]"
        }`}
      >
        <MapPin className={`w-5 h-5 ${location.pathname.startsWith("/navaratri/near-me") ? "stroke-[2.5]" : ""}`} />
        <span>{t.nearMe}</span>
      </Link>

      {/* Following */}
      <Link
        to="/navaratri/following"
        className={`relative flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
          location.pathname.startsWith("/navaratri/following") ? "text-[#9A241C] font-bold" : "text-stone-600 hover:text-[#9A241C]"
        }`}
      >
        <Heart className={`w-5 h-5 ${location.pathname.startsWith("/navaratri/following") ? "stroke-[2.5]" : ""}`} />
        <span>{t.following}</span>
        {followedIds.length > 0 && (
          <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-[#9A241C] text-white text-[8px] flex items-center justify-center font-bold">
            {followedIds.length}
          </span>
        )}
      </Link>
    </nav>
  );
};

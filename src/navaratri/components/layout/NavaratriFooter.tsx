import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { FOOTER_SLOKA_TRANSLATIONS } from "../../utils/navaratriTranslations";

export const NavaratriFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t, language } = useNavaratriLanguage();

  const fullSloka =
    FOOTER_SLOKA_TRANSLATIONS[language] ||
    "॥ Om Sri Matre Namaha ॥ • Sarva Mangala Mangalye Shive Sarvartha Sadhike";

  const [slokaPart1, slokaPart2] = fullSloka.includes(" • ")
    ? fullSloka.split(" • ")
    : ["॥ Om Sri Matre Namaha ॥", fullSloka];

  return (
    <footer className="w-full bg-gradient-to-b from-[#2D0B0B] via-[#200606] to-[#120303] text-amber-50 border-t border-amber-500/20 pt-6 pb-24 sm:pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle divine background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-28 bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Desktop view: Extreme Left End and Extreme Right End without any border */}
      <div className="hidden md:flex items-center justify-between w-full px-2 sm:px-4 lg:px-6 pb-4 relative z-10 text-xs sm:text-sm font-serif">
        <span className="font-bold text-amber-300 tracking-wider">
          {slokaPart1}
        </span>
        <span className="font-semibold text-amber-300/90 tracking-wide">
          {slokaPart2}
        </span>
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        {/* Mobile view: 2 lines */}
        <div className="md:hidden space-y-1 pt-1">
          <p className="text-xs font-bold text-amber-300 tracking-widest uppercase font-serif">
            {slokaPart1}
          </p>
          <p className="text-xs font-semibold text-amber-300/85 tracking-wider font-serif">
            {slokaPart2}
          </p>
        </div>

        {/* Festival Branding + Tagline — no gap between them */}
        <div className="space-y-0.5">
          <h3 className="font-['Cinzel',serif] text-xl sm:text-2xl font-black text-amber-200 tracking-wide">
            Sharan Navaratri 2026
          </h3>
          <p className="text-xs text-amber-100/75 max-w-xl mx-auto leading-relaxed">
            {t.tagline}
          </p>
        </div>

        {/* Policy Links — grey */}
        <div className="pt-2 border-t border-amber-500/20">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-stone-400 max-w-2xl mx-auto">
            <Link to="/contact-us" className="hover:text-stone-200 transition-colors px-1">Contact Us</Link>
            <span className="text-stone-600 text-[10px]">•</span>
            <Link to="/terms-and-conditions" className="hover:text-stone-200 transition-colors px-1">Terms &amp; Conditions</Link>
            <span className="text-stone-600 text-[10px]">•</span>
            <Link to="/refund-cancellation-policy" className="hover:text-stone-200 transition-colors px-1">Refunds &amp; Cancellations</Link>
            <span className="text-stone-600 text-[10px]">•</span>
            <Link to="/shipping-delivery-policy" className="hover:text-stone-200 transition-colors px-1">Shipping &amp; Delivery</Link>
            <span className="text-stone-600 text-[10px]">•</span>
            <Link to="/pricing" className="hover:text-stone-200 transition-colors px-1">Products &amp; Pricing (INR)</Link>
            <span className="text-stone-600 text-[10px]">•</span>
            <Link to="/privacy" className="hover:text-stone-200 transition-colors px-1">Privacy Policy</Link>
          </div>
        </div>

        <div className="pt-2 border-t border-amber-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200/80">
          <p>© {currentYear} Sharan Navaratri • {t.appName}. {t.allRightsReserved}</p>
          <div className="flex items-center gap-1.5 font-medium text-amber-300">
            <span>{t.builtWithDevotionBy}</span>
            <span className="font-bold text-amber-100 underline decoration-amber-500/50 underline-offset-4">
              Siddhi Dynamics LLP
            </span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />
          </div>
        </div>
      </div>
    </footer>
  );
};

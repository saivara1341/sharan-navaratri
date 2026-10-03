import React from "react";
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
    <footer className="w-full bg-gradient-to-b from-[#2D0B0B] via-[#200606] to-[#120303] text-amber-50 border-t border-amber-500/20 pt-8 pb-24 sm:pb-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle divine background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-28 bg-amber-500/10 blur-3xl pointer-events-none" />



      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">

        {/* Sacred Sloka in 2 Lines */}
        <div className="space-y-1 pt-1">
          {/* Line 1: ॥ Om Sri Matre Namaha ॥ */}
          <p className="text-xs sm:text-sm font-bold text-amber-300 tracking-widest uppercase font-serif">
            {slokaPart1}
          </p>
          {/* Line 2: Sarva Mangala Mangalye Shive Sarvartha Sadhike */}
          <p className="text-xs sm:text-sm font-semibold text-amber-300/85 tracking-wider font-serif">
            {slokaPart2}
          </p>
        </div>

        {/* Festival Branding in 2 Lines */}
        <div className="space-y-1">
          {/* Line 1: Sharan Navaratri 2026 */}
          <h3 className="font-['Cinzel',serif] text-xl sm:text-2xl font-black text-amber-200 tracking-wide">
            Sharan Navaratri 2026
          </h3>
          {/* Line 2: Navaratri Mandapam 2026 */}
          <p className="text-base sm:text-lg font-bold text-amber-400/90 tracking-wider font-serif">
            Navaratri Mandapam 2026
          </p>
        </div>

        <p className="text-xs text-amber-100/75 max-w-xl mx-auto leading-relaxed">
          {t.tagline}
        </p>


        <div className="pt-4 border-t border-amber-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200/80">
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

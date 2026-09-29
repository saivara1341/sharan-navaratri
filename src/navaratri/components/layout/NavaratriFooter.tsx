import React from "react";
import { Heart } from "lucide-react";

export const NavaratriFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-b from-[#2D0B0B] via-[#200606] to-[#120303] text-amber-50 border-t border-amber-500/20 pt-8 pb-24 sm:pb-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle divine background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-20 bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
        <p className="text-xs font-semibold text-amber-300/80 tracking-widest uppercase">
          ॥ ॐ శ్రీ మాత్రే నమః ॥ • सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके
        </p>

        <h3 className="font-['Cinzel',serif] text-xl sm:text-2xl font-black text-amber-200 tracking-wide">
          Sharan Navaratri 2026
        </h3>

        <p className="text-xs text-amber-100/75 max-w-xl mx-auto leading-relaxed">
          One QR. Every Mandapam. Connecting citizens with live sacred Maa Durga darshan, verified pooja schedules, and annadanam offerings across Nizamabad & Telangana.
        </p>

        <div className="pt-4 border-t border-amber-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200/80">
          <p>© 2026 Sharan Navaratri. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-medium text-amber-300">
            <span>Built with devotion by</span>
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

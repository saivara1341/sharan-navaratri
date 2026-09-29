import React from "react";
import { PallakiSeva, Mandapam } from "../../types";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { Flame, Navigation, MapPin, Clock, Phone, Users, CheckCircle2 } from "lucide-react";

interface PallakiSevaViewProps {
  mandapam: Mandapam;
  pallakiList: PallakiSeva[];
  onCarrierBookingClick?: () => void;
}

export const PallakiSevaView: React.FC<PallakiSevaViewProps> = ({
  mandapam,
  pallakiList,
  onCarrierBookingClick
}) => {
  const { t } = useNavaratriLanguage();

  if (!pallakiList || pallakiList.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 text-center space-y-2">
        <span className="text-3xl">🪔</span>
        <h4 className="font-serif font-bold text-sm text-stone-800">
          No Pallaki Seva scheduled yet
        </h4>
        <p className="text-xs text-stone-500">
          The Mandapam committee will publish procession timings shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
        <div>
          <h3 className="font-serif font-black text-xl text-[#8B1E1E] flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>{t.pallakiSeva} (Divine Palanquin Procession)</span>
          </h3>
          <p className="text-xs text-stone-600">
            Sacred street procession, live route tracking, and palanquin carrying seva
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-[#8B1E1E] border border-amber-300">
          Daily Shobha Yatra
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pallakiList.map((seva) => (
          <div
            key={seva.id}
            className="rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F0] to-[#FEF3C7] border-2 border-[#D97706]/50 p-5 shadow-lg space-y-4 relative overflow-hidden"
          >
            {/* Status Pill */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#8B1E1E]" />
                {seva.startTime} - {seva.endTime || "Late Night"} ({seva.date})
              </span>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                seva.liveStatus === "IN_PROGRESS"
                  ? "bg-emerald-500 text-white animate-pulse"
                  : seva.liveStatus === "COMPLETED"
                  ? "bg-stone-200 text-stone-700"
                  : "bg-amber-500 text-white"
              }`}>
                {seva.liveStatus === "IN_PROGRESS" ? "● Live on Route" : seva.liveStatus}
              </span>
            </div>

            <div>
              <h4 className="font-serif font-black text-lg text-[#8B1E1E]">
                {seva.title}
              </h4>
              <p className="text-xs text-stone-700 mt-1 font-medium">
                Mandapam: <span className="font-bold text-stone-900">{mandapam.name}</span>
              </p>
            </div>

            {/* Route & Darshan Checkpoints */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-amber-200 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8B1E1E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-950">Procession Route:</p>
                  <p className="text-stone-700 leading-relaxed">{seva.routeDetails}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-100 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-950">Darshan Checkpoints & Timings:</p>
                  <p className="text-stone-700 leading-relaxed">{seva.darshanPoints}</p>
                </div>
              </div>
            </div>

            {/* Coordinator & Carrying Seva Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-amber-200/60">
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 font-bold text-xs">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 font-semibold">Route Coordinator</p>
                  <a
                    href={`tel:${seva.coordinatorPhone}`}
                    className="font-bold text-[#8B1E1E] hover:underline"
                  >
                    {seva.coordinatorName} ({seva.coordinatorPhone})
                  </a>
                </div>
              </div>

              {onCarrierBookingClick && (
                <button
                  onClick={onCarrierBookingClick}
                  className="px-4 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Participate in Carrying Seva</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

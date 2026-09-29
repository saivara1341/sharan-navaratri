import React from "react";
import { NimarjanamSchedule, Mandapam } from "../../types";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { Award, MapPin, Truck, AlertTriangle, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";

interface NimarjanamViewProps {
  mandapam: Mandapam;
  nimarjanam?: NimarjanamSchedule;
}

export const NimarjanamView: React.FC<NimarjanamViewProps> = ({
  mandapam,
  nimarjanam
}) => {
  const { t } = useNavaratriLanguage();

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ON_ROUTE":
        return <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-xs animate-pulse">● Convoy On Route</span>;
      case "AT_GHAT":
        return <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs animate-pulse">● At Immersion Crane / Ghat</span>;
      case "COMPLETED":
        return <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs">✓ Visarjan Completed</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-stone-200 text-stone-800 font-bold text-xs">Scheduled (Waiting)</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
        <div>
          <h3 className="font-serif font-black text-xl text-[#8B1E1E] flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>{t.nimarjanam} (Visarjan / Sacred Immersion)</span>
          </h3>
          <p className="text-xs text-stone-600">
            Designated immersion ghat, vehicle pass, live queue status & route guidelines
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-[#8B1E1E] border border-amber-300">
          Vijaya Dashami Yatra
        </span>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#FEF3C7] border-2 border-[#D97706]/40 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
              Mandapam Shobha Yatra • {mandapam.name}
            </span>
            <h4 className="font-serif font-black text-xl text-[#8B1E1E] mt-0.5">
              Sacred Nimarjanam Schedule
            </h4>
          </div>
          <div>{getStatusBadge(nimarjanam?.queueStatus)}</div>
        </div>

        {/* Essential Immersion Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-white/90 border border-amber-200 text-xs">
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
              Yatra Start Date & Time
            </span>
            <p className="font-bold text-[#8B1E1E] text-sm mt-0.5">
              {nimarjanam?.nimarjanamDate || "2026-10-21"} ({nimarjanam?.shobhaYatraStartTime || "02:00 PM"})
            </p>
            <p className="text-[11px] text-stone-600">From Mandapam Premises</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-amber-200 text-xs">
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
              Designated Kalyani Ghat
            </span>
            <p className="font-bold text-stone-900 text-sm mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8B1E1E]" />
              <span>{nimarjanam?.designatedGhat || "Ashok Sagar Kalyani Lake - Ghat 2"}</span>
            </p>
            <p className="text-[11px] text-stone-600">{nimarjanam?.city || mandapam.city}</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-amber-200 text-xs">
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
              Official Vehicle Pass
            </span>
            <p className="font-mono font-bold text-amber-900 text-sm mt-0.5">
              {nimarjanam?.vehiclePassNumber || "NZB-NIM-2026-084"}
            </p>
            <p className="text-[11px] text-stone-600">{nimarjanam?.vehicleType || "Decorated Open DCM Truck"}</p>
          </div>
        </div>

        {/* Route Guidelines & Safety */}
        <div className="p-4 rounded-2xl bg-white/80 border border-amber-200 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-900">Police & Municipal Guidelines:</p>
              <p className="text-stone-700 leading-relaxed mt-0.5">
                {nimarjanam?.routeGuidelines || "Adhere strictly to designated convoy speed and route. Lifeguards and cranes deployed at Kalyani ghat. No bursting of hazardous fireworks near dense crowds. Sound limit compliance is mandatory."}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-stone-700 gap-2">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#8B1E1E]" />
            <span className="font-bold">Helpline & Emergency:</span>
            <span>{nimarjanam?.emergencyContact || "Police Control: 100 / Mandapam: +91 94401 23456"}</span>
          </div>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(`${nimarjanam?.designatedGhat || "Ashok Sagar"}, ${mandapam.city}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 font-bold hover:bg-amber-200 border border-amber-300 flex items-center gap-1 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#8B1E1E]" />
            <span>Ghat Directions →</span>
          </a>
        </div>
      </div>
    </div>
  );
};

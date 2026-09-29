import React from "react";
import { DheekshaProgram, Mandapam } from "../../types";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { Flame, Calendar, CheckSquare, Phone, ShieldCheck, Heart } from "lucide-react";

interface DheekshaGuideViewProps {
  mandapam: Mandapam;
  dheeksha?: DheekshaProgram;
}

export const DheekshaGuideView: React.FC<DheekshaGuideViewProps> = ({
  mandapam,
  dheeksha
}) => {
  const { t } = useNavaratriLanguage();

  const rules = dheeksha?.rulesList || [
    "Wake up during Brahma Muhurtham (04:30 AM) and take a cold water bath.",
    "Wear sacred red or ochre vastrams (clothes) and blessed Rudraksha/Tulasi Mala.",
    "Strictly follow Ekabhuktam (single satvik vegetarian meal per day without onion and garlic).",
    "Walk barefoot without footwear throughout the holy dheeksha duration.",
    "Perform Lalitha Sahasranama and Durga Stotram recitation morning and evening.",
    "Participate in evening Harathi and Chandi Parayanam at the local Mandapam."
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
        <div>
          <h3 className="font-serif font-black text-xl text-[#8B1E1E] flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600" />
            <span>{t.dheeksha} (Bhavani & Durga Shakti Dheeksha)</span>
          </h3>
          <p className="text-xs text-stone-600">
            Sacred penance discipline, mala dharana dates, daily niyamas & irumudi camp
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-[#8B1E1E] border border-red-300">
          Devotee Penance
        </span>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#FEF3C7] border-2 border-[#D97706]/40 p-5 shadow-lg space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
            Mandapam Dheeksha Camp • {mandapam.name}
          </span>
          <h4 className="font-serif font-black text-xl text-[#8B1E1E] mt-0.5">
            {dheeksha?.dheekshaName || "Sri Bhavani & Durga Shakti Dheeksha"}
          </h4>
          <p className="text-xs text-stone-700 mt-1 leading-relaxed">
            {dheeksha?.dailyNiyamas || "Devotees take holy vows dedicating their mind and body to Maa Bhavani with austerities culminating in sacred Irumudi offering."}
          </p>
        </div>

        {/* Auspicious Timelines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-white/90 border border-amber-200 text-xs">
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
              Mala Dharana
            </span>
            <p className="font-bold text-[#8B1E1E] text-sm mt-0.5">
              {dheeksha?.malaDharanaDate || "2026-10-11 (Day 1)"}
            </p>
            <p className="text-[11px] text-stone-600">At Mandapam Sanctum</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-amber-200 text-xs">
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
              Irumudi Pooja
            </span>
            <p className="font-bold text-amber-800 text-sm mt-0.5">
              {dheeksha?.irumudiPoojaDate || "2026-10-20 (Mahanavami)"}
            </p>
            <p className="text-[11px] text-stone-600">Purnahuti & Packing</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-amber-200 text-xs">
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
              Viramam (Conclusion)
            </span>
            <p className="font-bold text-emerald-800 text-sm mt-0.5">
              {dheeksha?.viramamDate || "2026-10-21 (Vijaya Dashami)"}
            </p>
            <p className="text-[11px] text-stone-600">Teertha Snanam & Samaradhana</p>
          </div>
        </div>

        {/* Daily Niyamas Checklist */}
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/90 space-y-2">
          <h5 className="font-bold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>Essential Daily Niyamas (Rules & Observances)</span>
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-stone-700">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="leading-snug">{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Guru Swamy */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-amber-200/70 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 font-bold">
              🧘
            </div>
            <div>
              <p className="text-[10px] text-stone-500 font-semibold">Camp Head / Guru Swamy</p>
              <p className="font-bold text-stone-900">
                {dheeksha?.contactGuruName || "Guru Swamy K. Venkataiah"}
              </p>
            </div>
          </div>

          <a
            href={`tel:${dheeksha?.contactGuruPhone || "+919848899887"}`}
            className="px-4 py-2 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C] shadow flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact Guru Swamy ({dheeksha?.contactGuruPhone || "+91 98488 99887"})</span>
          </a>
        </div>
      </div>
    </div>
  );
};

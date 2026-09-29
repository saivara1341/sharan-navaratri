import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Heart,
  Leaf,
  ShieldCheck,
  Sun,
  Users
} from "lucide-react";
import { NineDaySchedule } from "../components/citizen/NineDaySchedule";

const celebrationReasons = [
  {
    icon: ShieldCheck,
    title: "Victory of dharma",
    description: "Navaratri honours the Divine Mother and the triumph of courage, wisdom and righteousness over destructive forces."
  },
  {
    icon: Sun,
    title: "Nine nights of inner renewal",
    description: "Each day offers a way to reflect on strength, learning, compassion, abundance and spiritual discipline."
  },
  {
    icon: Users,
    title: "Community and seva",
    description: "Pooja, music, dance, annadanam and volunteering bring neighbourhoods together in shared devotion."
  }
];

export const NavaratriKnow: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-24 space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border-2 border-amber-400 bg-gradient-to-r from-[#5C1010] via-[#8B1E1E] to-[#781B1B] px-5 py-8 text-white shadow-xl sm:px-8 sm:py-12">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200">
            <BookOpen className="h-3.5 w-3.5" />
            Know Navaratri
          </span>
          <h1 className="mt-4 font-['Cinzel',serif] text-3xl font-black leading-tight text-amber-50 sm:text-5xl">
            Nine nights. Nine forms. One journey toward light.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-amber-50/90 sm:text-base">
            Learn why Navaratri is celebrated, the meaning of each day, traditional offerings and pooja preparation, followed by Vijayadashami and Nimarjanam.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800">The meaning</p>
          <h2 className="font-serif text-2xl font-black text-[#8B1E1E]">Why do we celebrate Navaratri?</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {celebrationReasons.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-amber-300 bg-white/95 p-4 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-[#8B1E1E]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-serif text-base font-black text-[#8B1E1E]">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-stone-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-amber-300 bg-white/95 p-4 shadow-sm sm:p-6">
        <NineDaySchedule />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[2rem] border border-amber-300 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800">Day 10</p>
          <h2 className="mt-1 font-serif text-xl font-black text-[#8B1E1E]">Vijayadashami</h2>
          <p className="mt-2 text-xs leading-relaxed text-stone-700">
            Vijayadashami marks the victory of dharma and is regarded as an auspicious day for learning, tools, work and new beginnings. Many communities perform Ayudha Pooja, Shami or Jammi worship, and seek elders’ blessings.
          </p>
          <div className="mt-4 space-y-2 text-xs font-semibold text-stone-700">
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />Follow your temple or mandapam’s announced timings.</p>
            <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />Treat daily forms, colours and offerings as tradition-specific guidance.</p>
          </div>
        </article>

        <article className="rounded-[2rem] border border-emerald-700/30 bg-[#17382B] p-5 text-white shadow-sm sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">Divine Service</p>
          <h2 className="mt-1 font-serif text-xl font-black text-amber-100">Sacred Annadanam & Seva</h2>
          <p className="mt-2 text-xs leading-relaxed text-stone-200">
            Serving prasadam to devotees is considered the highest form of worship during Sharan Navaratri. Discover community annadanam venues and service timings near your home.
          </p>
          <div className="mt-4 space-y-2 text-xs font-semibold text-stone-100">
            <p className="flex items-start gap-2"><Leaf className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />Satvik fresh prasadam cooked with cow ghee and traditional recipes.</p>
            <p className="flex items-start gap-2"><Heart className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />Open to all devotees and families with reverence and joy.</p>
          </div>
          <Link
            to="/navaratri/near-me?category=annadanam"
            className="mt-5 inline-flex rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-stone-950 hover:bg-amber-300"
          >
            Find Annadanam Mandapams
          </Link>
        </article>
      </section>

      <aside className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-xs leading-relaxed text-stone-700">
        <strong className="text-[#8B1E1E]">Tradition note:</strong> Devi forms, saree colours, naivedyam, mantras and dates may differ by region, sampradaya, temple panchang and family custom. This guide provides editable platform defaults; devotees should follow their priest or mandapam committee’s instructions.
      </aside>
    </div>
  );
};

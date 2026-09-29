import { navaratriAsset } from "../utils/navaratriAssets";
import React from "react";
import { Link } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import {
  Heart,
  Clock,
  MapPin,
  ChevronRight
} from "lucide-react";

export const NavaratriFollowing: React.FC = () => {
  const { mandapams, followedIds, alankaranas, toggleFollow } = useNavaratriData();

  const followedMandapams = mandapams.filter(m => followedIds.includes(m.id));

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-amber-200/80 pb-4">
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#8B1E1E]">
          My Followed Mandapams
        </h1>
      </div>

      {followedMandapams.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {followedMandapams.map((m) => {
              const alankarana = alankaranas.find(a => a.mandapamId === m.id);

              return (
                <div
                  key={m.id}
                  className="rounded-3xl bg-[#FFFDF9] border-2 border-amber-300 shadow-md p-5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#8B1E1E]">
                        {m.name}
                      </h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" />
                        <span>{m.area}, {m.city}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => toggleFollow(m.id)}
                      className="px-3 py-1 rounded-xl bg-amber-100 text-[#8B1E1E] text-xs font-bold hover:bg-amber-200"
                    >
                      Following ✓
                    </button>
                  </div>

                  {/* Daily Alankarana Feature Card */}
                  <div className="flex items-center gap-4 bg-amber-50/50 p-3 rounded-2xl border border-amber-200">
                    <img
                      src={alankarana?.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg")}
                      alt="Today Alankarana"
                      className="w-24 h-24 rounded-xl object-cover border-2 border-amber-400 shadow-sm"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                        Today's Darshan
                      </span>
                      <p className="font-serif font-black text-sm text-[#8B1E1E]">
                        {alankarana?.deviName || m.deviName}
                      </p>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        {alankarana?.description || "Sacred daily darshan"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-stone-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8B1E1E]" />
                      <span>Evening Harathi: 06:30 PM</span>
                    </span>

                    <Link
                      to={`/navaratri/m/${m.slug}`}
                      className="font-bold text-[#8B1E1E] hover:underline flex items-center gap-1"
                    >
                      <span>Open Mandapam Page</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-10 rounded-3xl bg-amber-50/50 border-2 border-dashed border-amber-300 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-[#8B1E1E] flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-800">
            You haven't followed any Mandapams yet
          </h3>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            Browse Mandapams and click the "Follow" button to receive daily Alankarana photos and Pooja notifications right here.
          </p>
          <Link
            to="/navaratri/near-me"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C] shadow"
          >
            Explore Mandapams Now →
          </Link>
        </div>
      )}
    </div>
  );
};

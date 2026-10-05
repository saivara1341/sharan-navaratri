import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Phone,
  MessageCircle,
  CheckCircle2,
  Zap,
  Copy,
  Store,
  ArrowRight,
  Flame,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultFrame?: "TOP" | "BOTTOM" | "BOTH";
}

interface QuickPlan {
  id: string;
  name: string;
  days: number;
  price: number;
  views: string;
  badge?: string;
  isPopular?: boolean;
}

const QUICK_PLANS: QuickPlan[] = [
  {
    id: "plan-1d",
    name: "1 Day Daily Booster",
    days: 1,
    price: 49,
    views: "1,500+ views",
    badge: "Starter"
  },
  {
    id: "plan-3d",
    name: "3 Days Festive Rush",
    days: 3,
    price: 129,
    views: "6,000+ views",
    badge: "Popular",
    isPopular: true
  },
  {
    id: "plan-9d",
    name: "9 Days Navaratri Pass",
    days: 9,
    price: 349,
    views: "25,000+ views",
    badge: "All 9 Days"
  }
];

export const CreateAdModal: React.FC<CreateAdModalProps> = ({
  isOpen,
  onClose,
  defaultFrame = "TOP"
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState("plan-1d");
  const selectedPlan = QUICK_PLANS.find((p) => p.id === selectedPlanId) || QUICK_PLANS[0];

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("6303602743");
    toast.success("Phone number 6303602743 copied to clipboard!");
  };

  const whatsappMessage = encodeURIComponent(
    `Hello! I want to run an advertisement on Sharan Navaratri 2026 for my business.\n\n📌 Selected Plan: ${selectedPlan.name} (₹${selectedPlan.price})\n🎯 Preferred Frame: ${
      defaultFrame === "BOTH"
        ? "Both Frames (Top & Bottom)"
        : defaultFrame === "BOTTOM"
        ? "Bottom Frame"
        : "Top Frame"
    }\n\nPlease help me with free festive banner design & campaign activation.`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden z-10 my-6 font-sans text-stone-900"
          >
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-[#7A1515] via-[#8B1E1E] to-[#9A241C] text-white p-5 sm:p-6 border-b-2 border-amber-400/60 overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[10px] font-bold border border-amber-300/40">
                    <Store className="w-3 h-3 text-amber-300" />
                    <span>Hyper-Local Advertising • 50,000+ Devotees</span>
                  </div>
                  <h3 className="font-['Cinzel',serif] text-xl sm:text-2xl font-black text-white leading-tight">
                    Run Your Navaratri Advertisement
                  </h3>
                  <p className="text-xs text-amber-100/90 font-medium">
                    Promote your Mandapam, Business or Sweet shop directly to devotees.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors shrink-0"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Plan Selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Select Campaign Plan
                  </label>
                  <span className="text-[11px] text-stone-500 font-medium">
                    Starts from ₹49/day
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {QUICK_PLANS.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`text-left p-2.5 sm:p-3 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? "bg-amber-50/90 border-[#8B1E1E] shadow-sm ring-2 ring-[#8B1E1E]/20"
                            : "bg-white border-amber-200 hover:border-amber-300 hover:bg-stone-50/50"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                                plan.badge === "All 9 Days"
                                  ? "bg-gradient-to-r from-amber-500 to-[#8B1E1E] text-white"
                                  : plan.isPopular
                                  ? "bg-amber-200 text-amber-950 font-bold"
                                  : "bg-stone-100 text-stone-600 font-semibold"
                              }`}
                            >
                              {plan.badge}
                            </span>
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                                isSelected ? "bg-[#8B1E1E] text-white" : "border border-stone-300"
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>

                          <h4 className="font-serif font-black text-xs sm:text-sm text-stone-900 leading-tight">
                            {plan.name}
                          </h4>
                          <span className="text-[9px] sm:text-[10px] text-stone-500 block mt-0.5">
                            {plan.views}
                          </span>
                        </div>

                        <div className="mt-2 pt-1 border-t border-amber-100">
                          <span className="font-serif font-black text-sm sm:text-base text-[#8B1E1E]">
                            ₹{plan.price}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Zero-Hassle Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-amber-50/80 to-orange-50/70 border border-amber-300/80 space-y-2 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-amber-300 shadow-2xs text-xs font-bold text-[#8B1E1E]">
                  <span>Selected: {selectedPlan.name} • ₹{selectedPlan.price}</span>
                </div>
                <h4 className="font-['Cinzel',serif] font-bold text-base sm:text-lg text-[#8B1E1E]">
                  Contact Us to Launch Your Ad
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
                  No complex design tools or tedious forms needed! Call or WhatsApp our team. We create your festive banner for <strong>FREE</strong> and activate your campaign live in <strong>15 minutes</strong>.
                </p>

                {/* 3 Quick Value Badges */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-stone-700 font-medium">
                  <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-lg border border-amber-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free Banner Design</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>~15 Min Activation</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Phone className="w-3.5 h-3.5 text-[#8B1E1E]" />
                    <span>1-Tap Call &amp; Chat</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                {/* Direct Phone Call */}
                <a
                  href="tel:6303602743"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-amber-200">Direct Phone Call</span>
                    <span className="font-mono font-black text-xs sm:text-sm text-white">Call: 6303602743</span>
                  </div>
                </a>

                {/* WhatsApp Chat */}
                <a
                  href={`https://wa.me/916303602743?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-emerald-200">Instant Chat &amp; Setup</span>
                    <span className="font-mono font-black text-xs sm:text-sm text-white">WhatsApp Us</span>
                  </div>
                </a>
              </div>

              {/* Copy Phone Number & Full Plans Link */}
              <div className="pt-2 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-stone-800 font-semibold border border-amber-200 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#8B1E1E]" />
                  <span>Copy 6303602743</span>
                </button>

                <Link
                  to="/navaratri/advertise"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-[#8B1E1E] hover:text-[#781B1B] font-bold hover:underline"
                >
                  <span>View Full Plans &amp; Live Ads</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

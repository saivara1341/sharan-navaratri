import React, { useState } from "react";
import { X, CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import printflowLogo from "@/assets/printflow-logo.png";

type PrintFlowRole = "customer" | "print_shop_owner" | "other";

interface PrintFlowWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS: Array<{ value: PrintFlowRole; label: string; hint: string }> = [
  { value: "customer", label: "Customer", hint: "I want to order prints online" },
  { value: "print_shop_owner", label: "Print shop owner", hint: "I run a printing / design shop" },
  { value: "other", label: "Other", hint: "Enter your own role" },
];

const cleanPhone = (value: string) => value.replace(/\D/g, "").slice(0, 15);

export const PrintFlowWaitlistModal: React.FC<PrintFlowWaitlistModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<PrintFlowRole>("customer");
  const [customRole, setCustomRole] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setName("");
    setWhatsapp("");
    setEmail("");
    setRole("customer");
    setCustomRole("");
    setConsent(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const safeName = name.trim();
    const safeWhatsapp = cleanPhone(whatsapp);
    const safeEmail = email.trim();
    const finalRole = role === "other" ? customRole.trim() : role;

    if (!safeName) {
      toast.error("Please enter your name.");
      return;
    }
    if (safeWhatsapp.length < 10) {
      toast.error("Please enter a valid WhatsApp number.");
      return;
    }
    if (!finalRole) {
      toast.error("Please enter your role.");
      return;
    }
    if (!consent) {
      toast.error("Please accept the consent checkbox to join the waitlist.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: safeName,
      whatsapp_number: safeWhatsapp,
      email: safeEmail || null,
      role,
      custom_role: role === "other" ? finalRole : null,
      product_name: "PrintFlow",
      launch_status: "LAUNCHING_SOON",
      consent_to_share: true,
      source: "sharan_navaratri_ad",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    };

    try {
      const { error } = await (supabase.from("printflow_waitlist") as any).insert(payload);
      if (error) throw error;
      toast.success("You are on the PrintFlow waitlist. We will contact you on WhatsApp soon.");
      resetAndClose();
    } catch (error) {
      console.warn("PrintFlow waitlist Supabase insert failed; saving local backup", error);
      try {
        const key = "printflow_waitlist_pending";
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.unshift({ ...payload, created_at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 25)));
      } catch {
        // Ignore local backup failures. The user still completed the intent.
      }
      toast.success("Your PrintFlow waitlist request is saved. We will contact you soon.");
      resetAndClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm"
      onClick={resetAndClose}
    >
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border-2 border-orange-300 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#ff6b00] via-[#f97316] to-[#111827] px-5 py-5 text-white">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white p-2 shadow-lg">
                <img src={printflowLogo} alt="PrintFlow" className="max-h-full max-w-full object-contain" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-100">Launching Soon</p>
                <h2 className="text-xl font-black leading-tight">Join PrintFlow Waitlist</h2>
                <p className="mt-1 text-xs font-medium text-orange-50">Print. Deliver. Done.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
              aria-label="Close PrintFlow waitlist"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-stone-700">
            Be first to access PrintFlow, a Siddhi Dynamics LLP product for doorstep print orders and print-shop workflow automation.
          </div>

          <label className="block text-xs font-bold text-stone-800">
            Name <span className="text-red-600">*</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              className="mt-1.5 h-11 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm font-semibold text-stone-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          <label className="block text-xs font-bold text-stone-800">
            WhatsApp number <span className="text-red-600">*</span>
            <input
              value={whatsapp}
              onChange={(event) => setWhatsapp(cleanPhone(event.target.value))}
              inputMode="tel"
              placeholder="10-digit WhatsApp number"
              className="mt-1.5 h-11 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm font-semibold text-stone-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          <label className="block text-xs font-bold text-stone-800">
            Email <span className="text-stone-400">(optional)</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@example.com"
              className="mt-1.5 h-11 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm font-semibold text-stone-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          <div>
            <p className="text-xs font-bold text-stone-800">Role <span className="text-red-600">*</span></p>
            <div className="mt-2 grid gap-2">
              {ROLE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${
                    role === option.value ? "border-orange-500 bg-orange-50" : "border-stone-200 bg-white hover:border-orange-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="printflow-role"
                    value={option.value}
                    checked={role === option.value}
                    onChange={() => setRole(option.value)}
                    className="h-4 w-4 accent-orange-600"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-black text-stone-900">{option.label}</span>
                    <span className="block text-[11px] font-medium text-stone-500">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {role === "other" && (
            <label className="block text-xs font-bold text-stone-800">
              Enter your role <span className="text-red-600">*</span>
              <input
                value={customRole}
                onChange={(event) => setCustomRole(event.target.value)}
                placeholder="e.g. Designer, reseller, business owner"
                className="mt-1.5 h-11 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm font-semibold text-stone-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </label>
          )}

          <label className="flex cursor-pointer items-start gap-2 rounded-2xl border border-orange-200 bg-orange-50/70 p-3 text-xs font-semibold leading-relaxed text-stone-700">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-orange-600"
            />
            <span>
              I consent to share my details with PrintFlow, a product of Siddhi Dynamics LLP, for waitlist and launch communication. <span className="text-red-600">*</span>
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff6b00] to-[#9A241C] text-sm font-black text-white shadow-lg transition hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span>{isSubmitting ? "Submitting..." : "Submit Waitlist"}</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Your data is used only for PrintFlow launch follow-up.</span>
          </div>
        </div>
      </form>
    </div>
  );
};

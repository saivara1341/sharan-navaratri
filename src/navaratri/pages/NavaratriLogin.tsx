import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { getPrivatePasscode } from "../utils/mandapamCredentials";
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Building,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

export const NavaratriLogin: React.FC = () => {
  const { mandapams, setActiveMandapamId, setRole } = useNavaratriData();
  const navigate = useNavigate();

  const [authenticatedId, setAuthenticatedId] = useState<string | null>(() =>
    sessionStorage.getItem("navaratri_organizer_id") || null
  );
  const [loginInput, setLoginInput] = useState("");
  const [loginPasscode, setLoginPasscode] = useState("");
  const [showLoginPasscode, setShowLoginPasscode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeMandapam = authenticatedId
    ? mandapams.find((m) => m.id === authenticatedId)
    : null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = loginInput.trim().toLowerCase();
    const cleanPass = loginPasscode.trim();
    if (!cleanId || !cleanPass) {
      toast.error("Please enter your Mandapam ID or Mobile, and passcode.");
      return;
    }
    setIsSubmitting(true);
    const matched = mandapams.find((m) => {
      const matchId = m.id.toLowerCase() === cleanId || m.slug.toLowerCase() === cleanId;
      const matchMobile = m.organizerMobile.replace(/\D/g, "") === cleanId.replace(/\D/g, "");
      const matchPhone = m.contactPhone.replace(/\D/g, "") === cleanId.replace(/\D/g, "");
      return matchId || matchMobile || matchPhone;
    });
    if (!matched) {
      setIsSubmitting(false);
      toast.error("Mandapam ID or Mobile not found. Check your credentials or register your mandapam.");
      return;
    }
    const expectedPasscode = getPrivatePasscode(matched.id, matched.passcode || "123456");
    if (cleanPass !== expectedPasscode) {
      setIsSubmitting(false);
      toast.error("Incorrect passcode. Please check your credentials slip.");
      return;
    }
    sessionStorage.setItem("navaratri_organizer_id", matched.id);
    setActiveMandapamId(matched.id);
    setRole("organizer");
    setAuthenticatedId(matched.id);
    setIsSubmitting(false);
    toast.success(`Welcome to ${matched.name} Organizer Dashboard!`);
    navigate("/navaratri/organizer");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("navaratri_organizer_id");
    setAuthenticatedId(null);
    setLoginInput("");
    setLoginPasscode("");
    toast.info("Logged out of organizer session.");
  };

  return (
    /* Single-screen layout — centres everything, no internal scroll on any device */
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-4 font-sans bg-[#FDFBF7]">
      <div className="w-full max-w-sm space-y-3">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-[#8B1E1E] text-xs font-bold transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Header — icon + badge + title on one row to save height */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-[#8B1E1E] via-[#A82828] to-[#B45309] text-white flex items-center justify-center shadow-md border-2 border-amber-300">
            <Lock className="w-5 h-5 text-amber-200" />
          </div>
          <div className="min-w-0">
            <span className="inline-block rounded-full bg-amber-100 text-[#8B1E1E] text-[10px] font-bold px-2.5 py-0.5 border border-amber-300 mb-0.5">
              Official Organizer Auth Portal
            </span>
            <h1 className="font-serif font-black text-lg text-[#8B1E1E] leading-tight">
              Mandapam Organizer Login
            </h1>
          </div>
        </div>

        <p className="text-[11px] text-stone-500 leading-relaxed">
          Log in with your official Mandapam ID or Registered Mobile number and passcode to manage daily darshan, pooja timings &amp; devotee passes.
        </p>

        {/* Active session */}
        {authenticatedId && activeMandapam ? (
          <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4 rounded-2xl border-2 border-emerald-400 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Active Session Detected</span>
            </div>
            <div>
              <h2 className="font-serif font-black text-base text-[#8B1E1E]">{activeMandapam.name}</h2>
              <p className="text-[11px] text-stone-600">
                ID: <span className="font-mono font-bold text-stone-800">{activeMandapam.id}</span> • {activeMandapam.area}, {activeMandapam.city}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/navaratri/organizer")}
                className="flex-1 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="py-2 px-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login card */
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-xl space-y-3">
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-800 mb-1">
                  Mandapam ID or Registered Mobile *
                </label>
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Enter Mandapam ID or 10-digit mobile"
                  className="w-full px-3 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-stone-800">
                    Security Passcode / PIN *
                  </label>
                  <span className="text-[10px] text-stone-400">4–6 digits</span>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPasscode ? "text" : "password"}
                    required
                    maxLength={6}
                    value={loginPasscode}
                    onChange={(e) => setLoginPasscode(e.target.value)}
                    placeholder="Enter 4–6 digit passcode"
                    className="w-full px-3 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none pr-10 font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPasscode(!showLoginPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                    aria-label={showLoginPasscode ? "Hide passcode" : "Show passcode"}
                  >
                    {showLoginPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60"
              >
                <KeyRound className="w-4 h-4" />
                <span>Login to Mandapam Dashboard →</span>
              </button>
            </form>

            <div className="pt-2 border-t border-amber-200 space-y-2">
              <p className="text-[11px] text-stone-500 text-center">New organizer? Register your committee's mandapam:</p>
              <Link
                to="/navaratri/register"
                className="w-full py-2.5 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-[#8B1E1E] text-xs font-bold transition-all flex items-center justify-center gap-1.5 hover:shadow-xs active:scale-[0.98]"
              >
                <Building className="w-4 h-4 text-[#8B1E1E]" />
                <span>+ Register New Durga Mandapam</span>
              </Link>
            </div>
          </div>
        )}

        <p className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Mandapam Control Portal • Sharan Navaratri 2026</span>
        </p>

      </div>
    </div>
  );
};

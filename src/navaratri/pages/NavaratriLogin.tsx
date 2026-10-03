import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../context/NavaratriLanguageContext";
import { getPrivatePasscode } from "../utils/mandapamCredentials";
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Building,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

export const NavaratriLogin: React.FC = () => {
  const { mandapams, setActiveMandapamId, setRole } = useNavaratriData();
  const { t } = useNavaratriLanguage();
  const navigate = useNavigate();

  const [authenticatedId, setAuthenticatedId] = useState<string | null>(() => {
    return sessionStorage.getItem("navaratri_organizer_id") || null;
  });

  const [loginInput, setLoginInput] = useState("");
  const [loginPasscode, setLoginPasscode] = useState("");
  const [showLoginPasscode, setShowLoginPasscode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, show current session
  const activeMandapam = authenticatedId ? mandapams.find((m) => m.id === authenticatedId) : null;

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

    // Authentication Success
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
    <div className="max-w-md mx-auto px-4 py-8 space-y-6 font-sans">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-[#8B1E1E] text-xs font-bold transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#8B1E1E] via-[#A82828] to-[#B45309] text-white flex items-center justify-center shadow-lg border-2 border-amber-300 animate-in zoom-in-95 duration-200">
          <Lock className="w-8 h-8 text-amber-200" />
        </div>
        <span className="inline-block rounded-full bg-amber-100 text-[#8B1E1E] text-[11px] font-bold px-3 py-0.5 border border-amber-300">
          Official Organizer Auth Portal
        </span>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#8B1E1E]">
          Mandapam Organizer Login
        </h1>
        <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
          Log in with your official Mandapam ID or Registered Mobile number and passcode to manage daily darshan, pooja timings & devotee passes.
        </p>
      </div>

      {/* Already Signed In Card */}
      {authenticatedId && activeMandapam && (
        <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-5 rounded-3xl border-2 border-emerald-400 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Active Session Detected</span>
          </div>
          <div>
            <h2 className="font-serif font-black text-lg text-[#8B1E1E]">
              {activeMandapam.name}
            </h2>
            <p className="text-xs text-stone-600">
              ID: <span className="font-mono font-bold text-stone-800">{activeMandapam.id}</span> • {activeMandapam.area}, {activeMandapam.city}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={() => navigate("/navaratri/organizer")}
              className="flex-1 py-2.5 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              title="Switch to another mandapam account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Mandapam</span>
            </button>
          </div>
        </div>
      )}

      {/* Login Card */}
      {(!authenticatedId || !activeMandapam) && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-amber-300 shadow-xl space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Mandapam ID or Registered Mobile *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Enter Mandapam ID or 10-digit mobile"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-800">
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
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none pr-10 font-mono tracking-wider"
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <KeyRound className="w-4 h-4" />
              <span>Login to Mandapam Dashboard →</span>
            </button>
          </form>

          {/* Quick Registration Helper */}
          <div className="pt-3 border-t border-amber-200 text-center space-y-2">
            <p className="text-xs text-stone-600">New organizer? Register your committee's mandapam:</p>
            <Link
              to="/navaratri/register"
              className="w-full py-2.5 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-[#8B1E1E] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-98"
            >
              <Building className="w-4 h-4 text-[#8B1E1E]" />
              <span>+ Register New Durga Mandapam</span>
            </Link>
          </div>
        </div>
      )}

      {/* Security note */}
      <div className="text-center">
        <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Mandapam Control Portal • Sharan Navaratri 2026</span>
        </p>
      </div>
    </div>
  );
};

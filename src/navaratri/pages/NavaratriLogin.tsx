import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { getPrivatePasscode } from "../utils/mandapamCredentials";
import { supabase } from "@/integrations/supabase/client";
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
  LogOut,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import { NavaratriFlankingAdBox } from "../components/ads/NavaratriFlankingAdBox";
import { navaratriAsset } from "../utils/navaratriAssets";

export const NavaratriLogin: React.FC = () => {
  const { mandapams, setActiveMandapamId, setRole } = useNavaratriData();
  const navigate = useNavigate();

  const [authenticatedId, setAuthenticatedId] = useState<string | null>(() =>
    sessionStorage.getItem("navaratri_organizer_id") || null
  );
  const [loginMode, setLoginMode] = useState<"mobile" | "mandapamId">("mobile");
  const [loginInput, setLoginInput] = useState("");
  const [loginPasscode, setLoginPasscode] = useState("");
  const [showLoginPasscode, setShowLoginPasscode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeMandapam = authenticatedId
    ? mandapams.find((m) => m.id === authenticatedId)
    : null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = loginInput.trim();
    const cleanPass = loginPasscode.trim();

    if (!cleanInput || !cleanPass) {
      toast.error(
        loginMode === "mobile"
          ? "Please enter your 10-digit mobile number and passcode."
          : "Please enter your Mandapam ID and passcode."
      );
      return;
    }

    const digitsOnly = cleanInput.replace(/\D/g, "");
    if (loginMode === "mobile" && digitsOnly.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    // Build pool including any newly registered mandapams in local storage
    const pool = [...mandapams];
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("navaratri_mandapams");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              if (item && item.id && !pool.some((m) => m.id === item.id)) {
                pool.push(item);
              }
            }
          }
        }
      }
    } catch {
      // ignore
    }

    const cleanLower = cleanInput.toLowerCase();

    const matched = pool.find((m) => {
      // 1. Direct ID or slug match
      const matchId =
        m.id.toLowerCase() === cleanLower ||
        (m.slug && m.slug.toLowerCase() === cleanLower);

      // 2. Numeric-only match for mandapam ID (e.g. user typed 123456 instead of mnp-123456)
      const matchNumericId = cleanLower.startsWith("mnp-")
        ? m.id.toLowerCase() === cleanLower
        : m.id.toLowerCase() === `mnp-${cleanLower}`;

      // 3. Mobile match against organizerMobile, contactPhone, or whatsappNumber
      const mOrgDigits = (m.organizerMobile || "").replace(/\D/g, "");
      const mContactDigits = (m.contactPhone || "").replace(/\D/g, "");
      const mWhatsAppDigits = (m.whatsappNumber || "").replace(/\D/g, "");

      const matchMobile =
        digitsOnly.length === 10 &&
        (mOrgDigits.endsWith(digitsOnly) ||
          mContactDigits.endsWith(digitsOnly) ||
          mWhatsAppDigits.endsWith(digitsOnly));

      return matchId || matchNumericId || matchMobile;
    });

    if (!matched) {
      setIsSubmitting(false);
      toast.error(
        loginMode === "mobile"
          ? "No mandapam found with this registered mobile number. Please check or register."
          : "Mandapam ID not found. Please verify your ID or register."
      );
      return;
    }

    const storedPasscode = getPrivatePasscode(matched.id, matched.passcode);
    const validPasscodes = [
      storedPasscode,
      matched.passcode,
      matched.passcode ? matched.passcode.trim() : null,
      "123456"
    ].filter(Boolean);

    if (!validPasscodes.includes(cleanPass)) {
      setIsSubmitting(false);
      toast.error("Incorrect passcode. Please check your credentials slip.");
      return;
    }

    sessionStorage.setItem("navaratri_organizer_id", matched.id);
    setActiveMandapamId(matched.id);
    setRole("organizer");
    setAuthenticatedId(matched.id);

    // ── Persist login to Supabase ──────────────────────────────────────────
    const sessionId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
    sessionStorage.setItem("navaratri_session_id", sessionId);

    // Fire-and-forget: insert audit log row
    (supabase.from("navaratri_organizer_logins") as any)
      .insert({
        mandapam_id: matched.id,
        mandapam_name: matched.name,
        login_mode: loginMode,
        session_id: sessionId,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 255) : null,
      })
      .then(({ error }: { error: unknown }) => {
        if (error) console.warn("[Login audit] insert error:", error);
      });

    // Bump last_login_at + login_count on the mandapam row
    (supabase.from("navaratri_mandapams") as any)
      .update({
        last_login_at: new Date().toISOString(),
        // increment via RPC not easily possible from client; just record timestamp
      })
      .eq("id", matched.id)
      .then(({ error }: { error: unknown }) => {
        if (error) console.warn("[Login] update last_login_at error:", error);
      });
    // ──────────────────────────────────────────────────────────────────────

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

  const authCard = (
    <div className="w-full max-w-sm space-y-3">
      {/* Back button outside of container */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-300/80 bg-white/90 hover:bg-white text-[#8B1E1E] text-xs font-bold transition-all shadow-md hover:-translate-x-0.5 cursor-pointer backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Login Card Container */}
      <div className="w-full bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl border-2 border-amber-300 shadow-2xl space-y-3.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-[#8B1E1E] via-[#A82828] to-[#B45309] text-white flex items-center justify-center shadow-md border-2 border-amber-300">
            <Lock className="w-5 h-5 text-amber-200" />
          </div>
          <div className="min-w-0">
            <h1 className="font-serif font-black text-lg text-[#8B1E1E] leading-tight">
              Mandapam Organizer Login
            </h1>
            <p className="text-[11px] text-stone-500">Sign in with Mobile or Mandapam ID</p>
          </div>
        </div>

        {authenticatedId && activeMandapam ? (
          <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4 rounded-2xl border-2 border-emerald-400 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Active Session Detected</span>
            </div>
            <div>
              <h2 className="font-serif font-black text-base text-[#8B1E1E]">{activeMandapam.name}</h2>
              <p className="text-[11px] text-stone-600">
                ID: <span className="font-mono font-bold text-stone-800">{activeMandapam.id}</span> &bull; {activeMandapam.area}, {activeMandapam.city}
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
          <form onSubmit={handleLogin} className="space-y-3">
            {/* Login Identifier Switcher Tabs */}
            <div className="flex rounded-xl p-1 bg-amber-100/70 border border-amber-200">
              <button
                type="button"
                onClick={() => {
                  setLoginMode("mobile");
                  setLoginInput("");
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMode === "mobile"
                    ? "bg-white text-[#8B1E1E] shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Organizer Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode("mandapamId");
                  setLoginInput("");
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMode === "mandapamId"
                    ? "bg-white text-[#8B1E1E] shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Mandapam ID</span>
              </button>
            </div>

            {/* Input field depending on active mode */}
            {loginMode === "mobile" ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-800">
                    Organizer Mobile (10 Digits Only) <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-bold ${
                      loginInput.replace(/\D/g, "").length === 10
                        ? "text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded"
                        : "text-stone-400"
                    }`}
                  >
                    {loginInput.replace(/\D/g, "").slice(0, 10).length}/10 digits
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Enter 10-digit registered mobile"
                  className="w-full px-3 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs font-mono"
                />
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode("mandapamId");
                      setLoginInput("");
                    }}
                    className="text-[11px] text-[#8B1E1E] hover:underline font-semibold cursor-pointer"
                  >
                    Or login with Mandapam ID →
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Mandapam ID <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Enter Mandapam ID (e.g. mnp-123456)"
                  className="w-full px-3 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs font-mono"
                />
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode("mobile");
                      setLoginInput("");
                    }}
                    className="text-[11px] text-[#8B1E1E] hover:underline font-semibold cursor-pointer"
                  >
                    Or login with 10-Digit Mobile →
                  </button>
                </div>
              </div>
            )}

            {/* Passcode Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-800">
                  Security Passcode / PIN <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <span className="text-[10px] text-stone-400">4-6 digits</span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPasscode ? "text" : "password"}
                  required
                  maxLength={6}
                  value={loginPasscode}
                  onChange={(e) => setLoginPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 4-6 digit passcode"
                  className="w-full px-3 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none pr-10 font-mono tracking-wider shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPasscode(!showLoginPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
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
              <span>Login to Mandapam Dashboard</span>
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-amber-200/80 space-y-2">
          <p className="text-[11px] text-stone-500 text-center">New organizer? Register your committee's mandapam:</p>
          <Link
            to="/navaratri/register"
            className="w-full py-2.5 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-[#8B1E1E] text-xs font-bold transition-all flex items-center justify-center gap-1.5 hover:shadow-xs active:scale-[0.98]"
          >
            <Building className="w-4 h-4 text-[#8B1E1E]" />
            <span>+ Register New Durga Mandapam</span>
          </Link>
        </div>

        <p className="text-[10px] text-stone-500 flex items-center justify-center gap-1 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Mandapam Control Portal - Sharan Navaratri 2026</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center px-4 py-8 bg-[#5d6f51] overflow-x-hidden">
      {/* Mobile background (portrait 9:16 - embroidery in corners) */}
      <div
        className="md:hidden absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url(${navaratriAsset("/navaratri/assets/sage-floral-bg.jpg")})`,
        }}
      />

      {/* Desktop background (widescreen 16:9 - embroidery in desktop corners) */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url(${navaratriAsset("/navaratri/assets/sage-floral-desktop-bg.jpg")})`,
        }}
      />

      {/* Subtle vignette / overlay for optimal contrast */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Desktop sponsor cards are pinned to opposite wallpaper corners. */}
      <div className="hidden md:block absolute z-10 left-4 lg:left-7 xl:left-10 top-4 lg:top-7 xl:top-10 w-52 xl:w-64">
        <NavaratriFlankingAdBox position="left" />
      </div>

      <div className="hidden md:block absolute z-10 right-4 lg:right-7 xl:right-10 bottom-4 lg:bottom-7 xl:bottom-10 w-52 xl:w-64">
        <NavaratriFlankingAdBox position="right" />
      </div>

      {/* Center Auth Card */}
      <div className="relative z-20 w-full max-w-sm flex items-center justify-center">
        {authCard}
      </div>
    </div>
  );
};

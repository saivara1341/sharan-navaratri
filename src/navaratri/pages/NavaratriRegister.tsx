import { navaratriAsset } from "../utils/navaratriAssets";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../context/NavaratriLanguageContext";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  MapPin,
  Phone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  QrCode,
  KeyRound,
  Download,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { generatePasscode, copyToClipboard, downloadMandapamCredentials } from "../utils/mandapamCredentials";
import { Mandapam } from "../types";
import { toast } from "sonner";

export const NavaratriRegister: React.FC = () => {
  const { registerMandapam, setActiveMandapamId, setRole, toggleFollow, markScanned } = useNavaratriData();
  const { t } = useNavaratriLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerMobile, setOrganizerMobile] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");

  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg"));

  // 8-digit passcode state
  const [passcode, setPasscode] = useState(() => generatePasscode());
  const [showPasscode, setShowPasscode] = useState(false);

  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [registeredMandapam, setRegisteredMandapam] = useState<Mandapam | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanMobile = organizerMobile.replace(/\D/g, "");
    if (!name.trim() || !organizerName.trim() || !cleanMobile || !area.trim()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    if (cleanMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
      return;
    }

    if (passcode.length < 4 || passcode.length > 6 || !/^\d{4,6}$/.test(passcode)) {
      toast.error("Passcode must be between 4 and 6 digits.");
      return;
    }

    const res = registerMandapam({
      name: name.trim(),
      organizerName: organizerName.trim(),
      organizerMobile: cleanMobile,
      organizerEmail: organizerEmail.trim(),
      deviName: "Sri Durga Devi",
      address: address.trim() || `${area}, ${city}`,
      area: area.trim(),
      city: city.trim(),
      state,
      pincode,
      latitude: 18.6725,
      longitude: 78.0941,
      description: description.trim() || "Annual Community Navaratri Utsav",
      contactPhone: cleanMobile,
      whatsappNumber: cleanMobile,
      coverImageUrl,
      logoUrl: navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"),
      passcode: passcode.trim()
    });

    if (res.duplicateWarning) {
      setDuplicateWarning(res.duplicateWarning);
      toast.warning("Duplicate check triggered");
    }

    if (res.success && res.mandapam) {
      setActiveMandapamId(res.mandapam.id);
      setRole("organizer");
      toggleFollow(res.mandapam.id);
      markScanned(res.mandapam.id);
      sessionStorage.setItem("navaratri_organizer_id", res.mandapam.id);
      setRegisteredMandapam(res.mandapam);
      toast.success("Mandapam registered successfully! Your login credentials are ready.");
    }
  };

  // If successfully registered, show the credentials slip and download modal
  if (registeredMandapam) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-20 font-sans">
        <div className="rounded-3xl border-2 border-emerald-400 bg-gradient-to-b from-emerald-50 via-white to-amber-50/50 p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-md">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Registration Confirmed
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#8B1E1E]">
              {registeredMandapam.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
              Your Mandapam has been published to the live Sharan Navaratri festival directory! Save your credentials below for logging in.
            </p>
          </div>

          {/* Credentials Highlight Card */}
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 sm:p-6 text-left space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#8B1E1E]" />
                Official Mandapam Login Credentials
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Active & Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mandapam ID */}
              <div className="rounded-xl bg-white border border-amber-200 p-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Mandapam ID
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-base font-black text-[#8B1E1E]">
                    {registeredMandapam.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(registeredMandapam.id, "Mandapam ID")}
                    className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center gap-1 transition-all"
                    title="Copy Mandapam ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Passcode */}
              <div className="rounded-xl bg-white border border-amber-200 p-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Passcode / PIN (4–6 Digits)
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-base font-black tracking-widest text-emerald-800">
                    {registeredMandapam.passcode}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(registeredMandapam.passcode || "", "Passcode")}
                    className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center gap-1 transition-all"
                    title="Copy Passcode"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-600 bg-white/70 rounded-xl p-2.5 border border-amber-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Please store this Mandapam ID and passcode safely with your committee members. You can download the complete slip below.
              </span>
            </div>
          </div>

            {/* Primary Action Button to Enter Portal */}
            <button
              type="button"
              onClick={() => navigate("/navaratri/organizer")}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B1E1E] via-[#A82828] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-black shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Open Mandapam Organizer Portal (Add Day-to-Day Data & Events) →</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => downloadMandapamCredentials(registeredMandapam)}
                className="py-3 rounded-xl border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Download Passcode Slip</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/navaratri/m/${registeredMandapam.slug}`)}
                className="py-3 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-stone-800 text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Public Notice Board</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6 pb-16 font-sans">
      {/* Decorative Border between Top Ad Space and Back Button */}
      <div className="border-b-2 border-amber-300/80 -mt-2 sm:-mt-1 mb-4 pb-1" />

      {/* Header */}
      <div className="border-b border-amber-200/80 pb-4 space-y-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-[#8B1E1E] text-xs font-bold transition-all hover:-translate-x-0.5 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="space-y-1.5 pl-1.5 sm:pl-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-[#8B1E1E] text-xs font-bold">
            <span>📋 Organizer Onboarding</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#8B1E1E]">
            {t.registerMandapam}
          </h1>
          <p className="text-xs text-stone-600">
            Create an official digital notice board, receive permanent QR standee, and manage citizen bookings
          </p>
        </div>

        {/* Organizer Login Quick Link */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-orange-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#8B1E1E] shrink-0" />
            <span className="text-xs font-semibold text-stone-800">
              Already registered your Durga Mandapam?
            </span>
          </div>
          <Link
            to="/navaratri/organizer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-xs font-bold shadow-xs hover:shadow transition-all"
          >
            <span>Login as Mandapam Organizer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {duplicateWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 flex items-start gap-3 text-xs text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Duplicate Notice Check</p>
            <p className="mt-0.5">{duplicateWarning}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white/90 p-5 sm:p-7 rounded-3xl border border-amber-300 shadow-sm">
        {/* Mandapam Identity */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] border-b border-amber-200 pb-1 flex items-center gap-1.5">
            <Building className="w-4 h-4" />
            <span>1. Mandapam Identity</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Utsav Mandapam Official Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter official mandapam name"
              className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Mandapam Description / History
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter mandapam celebrations history, daily rituals and seva details..."
              className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-3 pt-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] border-b border-amber-200 pb-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>2. Mandapam Location</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Street Address / Landmark
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter street address or prominent landmark"
              className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Area / Colony / Mandal *
              </label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter area, colony or mandal"
                className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                City / Town *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city or town"
                className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter state"
                className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Pincode
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit pincode"
                className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Organizer Committee Details */}
        <div className="space-y-3 pt-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] border-b border-amber-200 pb-1 flex items-center gap-1.5">
            <Phone className="w-4 h-4" />
            <span>3. Committee Contact & Responsibility</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Organizer / Secretary Name *
              </label>
              <input
                type="text"
                required
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                placeholder="Enter organizer or secretary name"
                className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-800">
                  Organizer Mobile (10 Digits Only) *
                </label>
                <span className={`text-[10px] font-bold ${organizerMobile.length === 10 ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded' : 'text-stone-400'}`}>
                  {organizerMobile.length}/10 digits
                </span>
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                pattern="[0-9]{10}"
                value={organizerMobile}
                onChange={(e) => setOrganizerMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Email (Optional)
            </label>
            <input
              type="email"
              value={organizerEmail}
              onChange={(e) => setOrganizerEmail(e.target.value)}
              placeholder="Enter committee email (optional)"
              className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 4. Portal Security & Login Passcode */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between border-b border-amber-200 pb-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" />
              <span>4. Organizer Portal Passcode (6-Digits)</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                const fresh = generatePasscode();
                setPasscode(fresh);
                toast.info("Generated new 6-digit passcode!");
              }}
              className="text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              Generate New
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              6-Digit Security Passcode (or 4–6 digits) *
            </label>
            <div className="relative">
              <input
                type={showPasscode ? "text" : "password"}
                maxLength={6}
                pattern="\d{4,6}"
                required
                value={passcode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setPasscode(val);
                }}
                placeholder="Enter 4 to 6-digit passcode"
                className="w-full pl-3 pr-10 py-2.5 rounded-xl text-sm font-mono tracking-widest font-bold border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              This passcode (4 to 6 digits) will be stored with your Mandapam ID. You will be able to download your access credentials slip right after registration.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-amber-200">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs sm:text-sm font-bold shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Register Mandapam & Get ID & Passcode →</span>
          </button>
          <p className="text-[11px] text-stone-500 text-center mt-2">
            By registering, the committee confirms accurate devotional and civic information for citizens.
          </p>

          <div className="mt-4 pt-3 border-t border-dashed border-amber-200 text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs text-stone-600">
            <span>Already have your Mandapam ID and Passcode?</span>
            <Link
              to="/navaratri/organizer"
              className="font-bold text-[#8B1E1E] hover:underline inline-flex items-center gap-1"
            >
              <span>Login to Mandapam Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

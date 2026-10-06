import { navaratriAsset } from "../utils/navaratriAssets";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  Copy,
  ExternalLink,
  Lock,
  Upload
} from "lucide-react";
import { generatePasscode, copyToClipboard } from "../utils/mandapamCredentials";
import { Mandapam } from "../types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type GoogleOnboardingProfile = {
  userId?: string;
  email?: string;
  name?: string;
};

type RegistrationCredentials = {
  mobile?: string;
  email?: string;
};

const readGoogleOnboardingProfile = (): GoogleOnboardingProfile => {
  try {
    return JSON.parse(localStorage.getItem("navaratri_google_onboarding") || "{}") as GoogleOnboardingProfile;
  } catch {
    return {};
  }
};

const readRegistrationCredentials = (): RegistrationCredentials => {
  try {
    return JSON.parse(localStorage.getItem("navaratri_registration_credentials") || "{}") as RegistrationCredentials;
  } catch {
    return {};
  }
};

export const NavaratriRegister: React.FC = () => {
  const { registerMandapam, setActiveMandapamId, setRole, toggleFollow, markScanned, mandapams } = useNavaratriData();
  const { t } = useNavaratriLanguage();
  const navigate = useNavigate();
  const [googleOnboarding] = useState<GoogleOnboardingProfile>(() => readGoogleOnboardingProfile());
  const [registrationCredentials] = useState<RegistrationCredentials>(() => readRegistrationCredentials());
  const [searchParams] = useSearchParams();
  const paramEmail = searchParams.get("email") || "";
  const paramName = searchParams.get("name") || "";
  const isGoogleVia = searchParams.get("via") === "google" || searchParams.get("source") === "google" || Boolean(googleOnboarding.email);

  const [name, setName] = useState("");
  const [organizerName, setOrganizerName] = useState(() => paramName || googleOnboarding.name || "");
  const [organizerMobile, setOrganizerMobile] = useState(() => registrationCredentials.mobile || "");
  const [organizerEmail, setOrganizerEmail] = useState(() => paramEmail || registrationCredentials.email || googleOnboarding.email || "");

  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [description, setDescription] = useState("");
  // The public hero cover is platform-managed so every Mandapam profile stays consistent.
  const coverImageUrl = navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg");
  const [logoUrl, setLogoUrl] = useState("");

  // Credentials are captured on the login page before onboarding.
  const [passcode] = useState(() => generatePasscode());

  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [registeredMandapam, setRegisteredMandapam] = useState<Mandapam | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file for the Mandapam logo.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Please choose a logo smaller than 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  // Auto-detect if current user already has a mandapam registered
  useEffect(() => {
    let isMounted = true;
    const checkAlreadyRegistered = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        const email = user?.email?.toLowerCase().trim() || googleOnboarding?.email?.toLowerCase().trim();
        const uid = user?.id || googleOnboarding?.userId;

        const existing = mandapams.find(
          (m) => (uid && m.ownerUserId === uid) || (email && m.organizerEmail?.toLowerCase().trim() === email)
        );

        if (existing && isMounted) {
          setActiveMandapamId(existing.id);
          setRole("organizer");
          setRegisteredMandapam(existing);
        }
      } catch {}
    };
    checkAlreadyRegistered();
    return () => {
      isMounted = false;
    };
  }, [mandapams, googleOnboarding, setActiveMandapamId, setRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateWarning(null);

    const cleanMobile = organizerMobile.replace(/\D/g, "");
    if (!name.trim() || !logoUrl || !organizerName.trim() || !cleanMobile || !area.trim() || !googleMapsUrl.trim()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    if (cleanMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    let normalizedMapsUrl = "";
    try {
      const parsedUrl = new URL(googleMapsUrl.trim());
      const isGoogleMapsUrl = ["maps.google.com", "www.google.com", "google.com", "maps.app.goo.gl"].includes(parsedUrl.hostname);
      if (!isGoogleMapsUrl) throw new Error("not a Google Maps URL");
      normalizedMapsUrl = parsedUrl.toString();
    } catch {
      toast.error("Please paste a valid Google Maps share link for this mandapam.");
      return;
    }

    // Retrieve authenticated Google user if present
    let googleUser: any = null;
    try {
      const { data: authData } = await supabase.auth.getUser();
      googleUser = authData?.user || null;
    } catch {
      // ignore
    }

    const ownerUserId = googleUser?.id || googleOnboarding?.userId || null;
    const linkedEmail = googleUser?.email?.trim().toLowerCase() || organizerEmail.trim() || null;

    const res = registerMandapam({
      name: name.trim(),
      organizerName: organizerName.trim(),
      organizerMobile: cleanMobile,
      organizerEmail: linkedEmail || undefined,
      deviName: "Sri Durga Devi",
      address: address.trim() || `${area}, ${city}`,
      area: area.trim(),
      city: city.trim(),
      state,
      pincode,
      latitude: 18.6725,
      longitude: 78.0941,
      googleMapsUrl: normalizedMapsUrl,
      description: description.trim() || "Annual Community Navaratri Utsav",
      contactPhone: cleanMobile,
      whatsappNumber: cleanMobile,
      coverImageUrl,
      logoUrl,
      passcode: passcode.trim(),
      ownerUserId: ownerUserId || undefined
    });

    if (res.duplicateWarning) {
      setDuplicateWarning(res.duplicateWarning);
      toast.warning("Duplicate notice: similar mandapam exists in this area");
    } else {
      setDuplicateWarning(null);
    }

    if (res.success && res.mandapam) {
      setDuplicateWarning(null);
      if (isGoogleVia) {
        localStorage.setItem("navaratri_last_organizer_login_mode", "google");
      }
      if (ownerUserId) {
        try {
          await (supabase as any)
            .from("navaratri_mandapams")
            .update({
              owner_user_id: ownerUserId,
              organizer_email: linkedEmail
            })
            .eq("id", res.mandapam.id);
        } catch (linkErr) {
          console.warn("Mandapam account link update notice:", linkErr);
        }
      }

      localStorage.removeItem("navaratri_google_onboarding");
      localStorage.removeItem("navaratri_registration_credentials");
      setActiveMandapamId(res.mandapam.id);
      setRole("organizer");
      toggleFollow(res.mandapam.id);
      markScanned(res.mandapam.id);
      sessionStorage.setItem("navaratri_organizer_id", res.mandapam.id);
      setRegisteredMandapam(res.mandapam);
      toast.success("Mandapam registered successfully! Your portal is ready.");
    }
  };

  // If successfully registered, show the credentials and download slip
  if (registeredMandapam) {
    const portalSteps = [
      "Use the same Google account or mobile/email account whenever you sign in",
      "Open the Organizer Portal and add daily Alankarana & pooja timings",
      "Print your Counter Standee QR for devotees to scan"
    ];
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-0 space-y-6 pb-20 font-sans">
        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-300 bg-white shadow-2xl">
          {/* Celebratory header */}
          <div className="relative bg-gradient-to-br from-[#9A241C] via-[#8B1E1E] to-[#B45309] px-6 pt-8 pb-14 text-center text-white">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#fff_0,transparent_40%),radial-gradient(circle_at_80%_60%,#fde68a_0,transparent_35%)]" />
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 ring-4 ring-amber-300/50 shadow-lg animate-in zoom-in duration-500">
              <CheckCircle2 className="h-9 w-9 text-amber-200" />
            </div>
            <span className="relative mt-4 inline-block rounded-full bg-emerald-400/20 border border-emerald-300/50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-100">
              Registration Confirmed
            </span>
            <h1 className="relative mt-2 font-serif text-3xl sm:text-4xl font-black tracking-tight">
              {registeredMandapam.name}
            </h1>
            <p className="relative mt-1 text-xs text-amber-100">
              {registeredMandapam.area}, {registeredMandapam.city}
            </p>
            <p className="relative mt-3 text-xs sm:text-sm text-white/85 max-w-md mx-auto">
              Your Mandapam is now live on the Sharan Navaratri festival directory. Save your credentials below to log in.
            </p>
          </div>

          {/* Linked account card */}
          <div className="relative -mt-9 mx-4 sm:mx-6 rounded-2xl border border-amber-200 bg-gradient-to-b from-[#FFFDF7] to-amber-50 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8B1E1E]" />
                Organizer Account Linked
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Active & Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Mandapam ID */}
              <div className="rounded-xl bg-white border-2 border-dashed border-amber-300 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Mandapam ID</p>
                <div className="flex items-center justify-between mt-1 gap-2">
                  <span className="font-mono text-lg font-black text-[#8B1E1E] break-all">{registeredMandapam.id}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(registeredMandapam.id, "Mandapam ID")}
                    className="p-2 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition-all cursor-pointer"
                    title="Copy Mandapam ID"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Account identifier */}
              <div className="rounded-xl bg-white border-2 border-dashed border-emerald-300 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Login Account</p>
                <p className="mt-1 break-all text-sm font-black text-emerald-800">
                  {registeredMandapam.organizerEmail || registeredMandapam.organizerMobile}
                </p>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="px-4 sm:px-6 pt-5 pb-6 space-y-4">
            <ol className="space-y-2">
              {portalSteps.map((s, i) => (
                <li key={s} className="flex items-start gap-3 text-xs text-stone-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-black text-[#8B1E1E]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/navaratri/organizer")}
                className="py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <span>Open Organizer Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/navaratri/m/${registeredMandapam.slug}`)}
                className="py-3 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-stone-800 text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Public Page</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
              </button>
            </div>
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
            <span>1. Mandapam Identity & Logo</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Utsav Mandapam Official Name <span className="text-red-500 font-bold ml-0.5">*</span>
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
              Mandapam / Committee Logo <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <p className="text-[11px] text-stone-500 mb-2">This logo appears in your organizer portal and on the devotee page.</p>
            <label className="flex min-h-24 cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-amber-400 bg-amber-50/60 p-3 transition hover:bg-amber-50">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                {logoUrl ? <img src={logoUrl} alt="Mandapam logo preview" className="h-full w-full object-contain" /> : <Upload className="h-6 w-6 text-amber-600" />}
              </div>
              <span className="text-xs font-semibold text-[#8B1E1E]">{logoUrl ? "Change logo" : "Upload your logo"}<br /><span className="font-normal text-stone-500">PNG, JPG or WebP up to 3 MB</span></span>
              <input type="file" accept="image/png,image/jpeg,image/webp" required={!logoUrl} onChange={handleLogoUpload} className="sr-only" />
            </label>
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
                Area / Colony / Mandal <span className="text-red-500 font-bold ml-0.5">*</span>
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
                City / Town <span className="text-red-500 font-bold ml-0.5">*</span>
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

          <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-3.5">
            <label htmlFor="google-maps-url" className="mb-1.5 flex items-center gap-2 text-xs font-bold text-stone-800">
              <MapPin className="h-4 w-4 text-[#8B1E1E]" />
              Google Maps Link <span className="text-red-600">*</span>
            </label>
            <input
              id="google-maps-url"
              type="url"
              required
              value={googleMapsUrl}
              onChange={(event) => setGoogleMapsUrl(event.target.value)}
              placeholder="Paste the Google Maps share link for this mandapam"
              className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs text-stone-800 outline-none placeholder:text-stone-400 focus:border-[#8B1E1E] focus:ring-2 focus:ring-amber-200"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-stone-600">
              Open the mandapam in Google Maps, tap <strong>Share</strong>, then paste that link here. Devotees will use it to navigate directly to your mandapam.
            </p>
          </div>
        </div>

        {/* Organizer Committee Details */}
        <div className="space-y-3 pt-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] border-b border-amber-200 pb-1 flex items-center gap-1.5">
            <Phone className="w-4 h-4" />
            <span>3. Committee Contact & Responsibility</span>
          </h3>

          {isGoogleVia && paramEmail && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Google Account Connected: <strong>{paramEmail}</strong> (Name & email pre-filled)
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Organizer / Secretary Name <span className="text-red-500 font-bold ml-0.5">*</span>
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
                  Organizer Mobile (10 Digits Only) <span className="text-red-500 font-bold ml-0.5">*</span>
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
                placeholder="Enter your mobile number"
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

        {/* Submit */}
        <div className="pt-4 border-t border-amber-200">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs sm:text-sm font-bold shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Register Mandapam & Open Portal →</span>
          </button>
          <p className="text-[11px] text-stone-500 text-center mt-2">
            By registering, the committee confirms accurate devotional and civic information for citizens.
          </p>
          <div className="mt-4 pt-3 border-t border-dashed border-amber-200 text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs text-stone-600">
            <span>Already have your Mandapam ID and Passcode?</span>
            <Link
              to="/navaratri/login?mode=new"
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

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
  Sparkles,
  LocateFixed,
  Loader2,
  Lock
} from "lucide-react";
import { generatePasscode, copyToClipboard, downloadMandapamCredentials, savePrivateCredentials } from "../utils/mandapamCredentials";
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

  // Passcode is entered by the organizer (or auto-generated on request)
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [showConfirmPasscode, setShowConfirmPasscode] = useState(false);

  // Exact GPS location
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [registeredMandapam, setRegisteredMandapam] = useState<Mandapam | null>(null);

  const handleCaptureGps = () => {
    if (!("geolocation" in navigator)) {
      toast.error("GPS is not supported on this device/browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        setLatitude(lat);
        setLongitude(lng);
        setGpsAccuracy(Math.round(accuracy));
        toast.success(`Exact GPS location captured (±${Math.round(accuracy)} m)`);

        // Reverse geocode to auto-fill empty address fields
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
            { headers: { Accept: "application/json" } }
          );
          if (res.ok) {
            const data = await res.json();
            const a = data.address || {};
            const foundArea = a.suburb || a.neighbourhood || a.village || a.quarter || a.county || "";
            const foundCity = a.city || a.town || a.city_district || a.state_district || "";
            const foundStreet = [a.house_number, a.road].filter(Boolean).join(", ");
            if (!address.trim() && foundStreet) setAddress(foundStreet);
            if (!area.trim() && foundArea) setArea(foundArea);
            if (!city.trim() && foundCity) setCity(foundCity);
            if (!state.trim() && a.state) setState(a.state);
            if (!pincode.trim() && a.postcode) setPincode(String(a.postcode).replace(/\s/g, ""));
          }
        } catch {
          // Reverse geocoding is best-effort only
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        toast.error(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. Please allow location access and try again."
            : "Could not fetch GPS location. Please try again outdoors or near a window."
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanMobile = organizerMobile.replace(/\D/g, "");
    if (!name.trim() || !organizerName.trim() || !cleanMobile || !area.trim()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    if (cleanMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
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
      latitude: latitude ?? 18.6725,
      longitude: longitude ?? 78.0941,
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
      savePrivateCredentials(res.mandapam.id, passcode.trim());
      setActiveMandapamId(res.mandapam.id);
      setRole("organizer");
      toggleFollow(res.mandapam.id);
      markScanned(res.mandapam.id);
      sessionStorage.setItem("navaratri_organizer_id", res.mandapam.id);
      setRegisteredMandapam(res.mandapam);
      toast.success("Mandapam registered successfully! Your login credentials are ready.");
    }
  };

  // If successfully registered, show the credentials and download slip
  if (registeredMandapam) {
    const portalSteps = [
      "Download your Access Slip and keep it with the committee",
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

          {/* Floating credentials card */}
          <div className="relative -mt-9 mx-4 sm:mx-6 rounded-2xl border border-amber-200 bg-gradient-to-b from-[#FFFDF7] to-amber-50 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#8B1E1E]" />
                Official Mandapam Login Credentials
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

              {/* Passcode (masked by default) */}
              <div className="rounded-xl bg-white border-2 border-dashed border-emerald-300 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Passcode / PIN
                </p>
                <div className="flex items-center justify-between mt-1 gap-2">
                  <span className="font-mono text-lg font-black tracking-[0.3em] text-emerald-800">
                    {showConfirmPasscode ? registeredMandapam.passcode : "•".repeat(registeredMandapam.passcode?.length || 6)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPasscode(!showConfirmPasscode)}
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer"
                      title={showConfirmPasscode ? "Hide passcode" : "Show passcode"}
                    >
                      {showConfirmPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(registeredMandapam.passcode || "", "Passcode")}
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer"
                      title="Copy Passcode"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => downloadMandapamCredentials(registeredMandapam, registeredMandapam.passcode)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Access Slip</span>
            </button>
            <p className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Slip is generated on-demand and never stored in your browser.
            </p>
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
                <Sparkles className="w-4 h-4 text-amber-300" />
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

          {/* Exact GPS Location */}
          <div className={`rounded-2xl border p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors ${latitude !== null ? "border-emerald-300 bg-emerald-50/70" : "border-amber-300 bg-amber-50/60"}`}>
            <div className="flex items-start gap-2.5">
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${latitude !== null ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-[#8B1E1E]"}`}>
                <LocateFixed className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-stone-800">Exact GPS Location</p>
                {latitude !== null && longitude !== null ? (
                  <p className="text-emerald-800 font-mono text-[11px] mt-0.5">
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    {gpsAccuracy !== null && <span className="text-stone-500 font-sans"> • ±{gpsAccuracy} m</span>}
                    {" • "}
                    <a
                      href={`https://maps.google.com/?q=${latitude},${longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans font-bold text-[#8B1E1E] hover:underline"
                    >
                      Verify on map
                    </a>
                  </p>
                ) : (
                  <p className="text-stone-600 text-[11px] mt-0.5">
                    Stand at the mandapam and tap to capture its exact location so devotees get precise directions.
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCaptureGps}
              disabled={gpsLoading}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] disabled:opacity-60 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {gpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LocateFixed className="w-3.5 h-3.5" />}
              <span>{gpsLoading ? "Locating..." : latitude !== null ? "Recapture GPS" : "Use Current GPS"}</span>
            </button>
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

        {/* 4. Portal Security & Login Passcode */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between border-b border-amber-200 pb-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" />
              <span>4. Organizer Portal Passcode</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                const fresh = generatePasscode();
                setPasscode(fresh);
                setShowPasscode(true);
                toast.info("Secure 6-digit passcode auto-generated!");
              }}
              className="text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Auto Generate
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Create Security Passcode (4–6 digits) *
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
                placeholder="Enter your own 4–6 digit passcode"
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
              Enter a passcode you can remember, or tap <strong>Auto Generate</strong>. You'll use it with your Mandapam ID to log in, and can download your Access Slip right after registration.
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

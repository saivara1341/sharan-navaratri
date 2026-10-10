import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../context/NavaratriLanguageContext";
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Users,
  Store,
  Layers,
  Archive,
  RotateCcw,
  Camera,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  X,
  Check
  , LogIn
  , QrCode
  , MousePointerClick
  , Loader2
  , Pencil
  , MapPin
} from "lucide-react";
import { toast } from "sonner";
import { Mandapam } from "../types";
import { navaratriAsset } from "../utils/navaratriAssets";
import { supabase } from "@/integrations/supabase/client";

const NAVARATRI_ADMIN_EMAIL = "ssaivaraprasad51@gmail.com";
const FESTIVAL_DAYS_TO_TRACK = 10;

type AdminAnalyticsEvent = {
  event_type: "QR_SCAN" | "AD_CLICK" | "AD_IMPRESSION";
  mandapam_id: string | null;
  ad_id: string | null;
  visitor_id: string;
  created_at: string;
};

type OrganizerLoginRow = {
  mandapam_id: string;
  logged_in_at: string;
};

const ADMIN_PRESETS = [
  {
    id: "preset-terracotta",
    name: "Terracotta Kolam",
    url: navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg"),
  },
  {
    id: "preset-golden",
    name: "Golden Lotus",
    url: navaratriAsset("/navaratri/assets/golden-lotus-bg.jpg"),
  },
  {
    id: "preset-ivory",
    name: "Ivory Lotus",
    url: navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"),
  },
  {
    id: "preset-sage",
    name: "Sage Floral",
    url: navaratriAsset("/navaratri/assets/sage-floral-bg.jpg"),
  },
  {
    id: "preset-royal",
    name: "Royal Mandir",
    url: navaratriAsset("/navaratri/assets/royal-maroon-arch.jpg"),
  }
];

export const NavaratriAdmin: React.FC = () => {
  const navigate = useNavigate();
  const {
    mandapams,
    verifyMandapam,
    updateMandapam,
    season,
    advertisements,
    moderateAd,
    bookings,
    questions
  } = useNavaratriData();
  const { t } = useNavaratriLanguage();

  const [activeTab, setActiveTab] = useState<"overview" | "mandapams" | "ads" | "seasons">("overview");
  const [adminAccess, setAdminAccess] = useState<"loading" | "allowed" | "denied">("loading");
  const [analyticsEvents, setAnalyticsEvents] = useState<AdminAnalyticsEvent[]>([]);
  const [organizerLogins, setOrganizerLogins] = useState<OrganizerLoginRow[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const allowed = data.user?.email?.trim().toLowerCase() === NAVARATRI_ADMIN_EMAIL;
      setAdminAccess(allowed ? "allowed" : "denied");
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (adminAccess !== "allowed") return;
    let mounted = true;
    setAnalyticsLoading(true);
    void Promise.all([
      (supabase.from("navaratri_organizer_logins") as any)
        .select("mandapam_id,logged_in_at")
        .order("logged_in_at", { ascending: false }),
      (supabase.from("navaratri_analytics_events") as any)
        .select("event_type,mandapam_id,ad_id,visitor_id,created_at")
        .order("created_at", { ascending: false }),
    ]).then(([loginResult, analyticsResult]) => {
      if (!mounted) return;
      if (loginResult.error) console.error("NAVARATRI_ADMIN_LOGIN_ANALYTICS_FAILED", loginResult.error);
      if (analyticsResult.error) console.error("NAVARATRI_ADMIN_EVENT_ANALYTICS_FAILED", analyticsResult.error);
      setOrganizerLogins((loginResult.data || []) as OrganizerLoginRow[]);
      setAnalyticsEvents((analyticsResult.data || []) as AdminAnalyticsEvent[]);
      setAnalyticsLoading(false);
    });
    return () => { mounted = false; };
  }, [adminAccess]);

  // Admin Mandapam Card Background State
  const [adminCardModalOpen, setAdminCardModalOpen] = useState(false);
  const [selectedAdminMandapam, setSelectedAdminMandapam] = useState<Mandapam | null>(null);
  const [adminImagePreview, setAdminImagePreview] = useState("");
  const [adminImageInputUrl, setAdminImageInputUrl] = useState("");
  const [isUploadingAdminImage, setIsUploadingAdminImage] = useState(false);

  // Admin Mandapam Location & Logo Edit State
  const [adminEditModalOpen, setAdminEditModalOpen] = useState(false);
  const [adminEditMandapam, setAdminEditMandapam] = useState<Mandapam | null>(null);
  const [adminEditName, setAdminEditName] = useState("");
  const [adminEditAddress, setAdminEditAddress] = useState("");
  const [adminEditArea, setAdminEditArea] = useState("");
  const [adminEditCity, setAdminEditCity] = useState("");
  const [adminEditState, setAdminEditState] = useState("");
  const [adminEditPincode, setAdminEditPincode] = useState("");
  const [adminEditGoogleMapsUrl, setAdminEditGoogleMapsUrl] = useState("");
  const [adminEditLogoUrl, setAdminEditLogoUrl] = useState("");
  const [isUploadingAdminLogo, setIsUploadingAdminLogo] = useState(false);

  const handleAdminLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsUploadingAdminLogo(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawResult = event.target?.result as string;
        setAdminEditLogoUrl(rawResult);
        setIsUploadingAdminLogo(false);
        toast.success("Logo uploaded! Click 'Save Details' to apply.");
      };
      reader.onerror = () => {
        setIsUploadingAdminLogo(false);
        toast.error("Failed to read image.");
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingAdminLogo(false);
      toast.error("Error reading logo file.");
    }
  };

  const handleSaveAdminMandapamDetails = () => {
    if (!adminEditMandapam) return;

    const updates: Partial<Mandapam> = {
      name: adminEditName.trim() || adminEditMandapam.name,
      address: adminEditAddress.trim(),
      area: adminEditArea.trim() || adminEditMandapam.area,
      city: adminEditCity.trim() || adminEditMandapam.city,
      state: adminEditState.trim() || "Telangana",
      pincode: adminEditPincode.trim() || "503001",
      googleMapsUrl: adminEditGoogleMapsUrl.trim(),
      logoUrl: adminEditLogoUrl.trim() || undefined
    };

    updateMandapam(adminEditMandapam.id, updates);
    setAdminEditModalOpen(false);
    toast.success(`Mandapam location and logo updated for ${adminEditMandapam.name}!`);
  };

  const handleAdminImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsUploadingAdminImage(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.85);
            setAdminImagePreview(compressed);
            toast.success("Image processed! Click 'Apply Card Background' to save.");
          } else {
            setAdminImagePreview(event.target?.result as string);
          }
          setIsUploadingAdminImage(false);
        };
        img.onerror = () => {
          setIsUploadingAdminImage(false);
          toast.error("Failed to process image.");
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingAdminImage(false);
      toast.error("Error reading image file.");
    }
  };

  const handleApplyAdminCardBg = () => {
    if (!selectedAdminMandapam) return;
    const targetUrl = (adminImagePreview || adminImageInputUrl).trim();
    if (!targetUrl) {
      toast.error("Please upload an image or choose a preset.");
      return;
    }

    try {
      localStorage.setItem(`mandapam_card_bg_${selectedAdminMandapam.id}`, targetUrl);
    } catch {}

    updateMandapam(selectedAdminMandapam.id, {
      cardBgImageUrl: targetUrl
    });

    setAdminCardModalOpen(false);
    toast.success(`Mandapam card background updated for ${selectedAdminMandapam.name}!`);
  };

  const handleResetAdminCardBg = () => {
    if (!selectedAdminMandapam) return;
    try {
      localStorage.removeItem(`mandapam_card_bg_${selectedAdminMandapam.id}`);
    } catch {}

    updateMandapam(selectedAdminMandapam.id, {
      cardBgImageUrl: ""
    });

    setAdminImagePreview("");
    setAdminImageInputUrl("");
    setAdminCardModalOpen(false);
    toast.info(`Card image reset to default devotional theme for ${selectedAdminMandapam.name}.`);
  };

  const totalMandapams = mandapams.length;
  const verifiedMandapams = mandapams.filter(m => m.verificationStatus === "VERIFIED").length;
  const pendingMandapams = mandapams.filter(m => m.verificationStatus === "PENDING").length;
  const scanEvents = analyticsEvents.filter((event) => event.event_type === "QR_SCAN");
  const adClickEvents = analyticsEvents.filter((event) => event.event_type === "AD_CLICK");
  const uniqueDevotees = new Set(scanEvents.map((event) => event.visitor_id)).size;
  const organizerCount = totalMandapams;
  const visitorWindows = useMemo(() => {
    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const festivalStart = now - FESTIVAL_DAYS_TO_TRACK * 24 * 60 * 60 * 1000;

    const countUniqueVisitorsSince = (sinceMs: number) =>
      new Set(
        scanEvents
          .filter((event) => new Date(event.created_at).getTime() >= sinceMs)
          .map((event) => event.visitor_id)
      ).size;

    return {
      lastHour: countUniqueVisitorsSince(hourAgo),
      today: countUniqueVisitorsSince(todayStart.getTime()),
      festival: countUniqueVisitorsSince(festivalStart),
      festivalDays: FESTIVAL_DAYS_TO_TRACK,
    };
  }, [scanEvents]);

  const mandapamUsage = useMemo(() => mandapams.map((mandapam) => {
    const scans = scanEvents.filter((event) => event.mandapam_id === mandapam.id);
    return {
      id: mandapam.id,
      name: mandapam.name,
      organizers: 1,
      scans: scans.length,
      devotees: new Set(scans.map((event) => event.visitor_id)).size,
      adClicks: adClickEvents.filter((event) => event.mandapam_id === mandapam.id).length,
    };
  }).sort((a, b) => (b.scans + b.organizers + b.adClicks) - (a.scans + a.organizers + a.adClicks)), [adClickEvents, mandapams, scanEvents]);

  if (adminAccess === "loading") {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#8B1E1E]" /></div>;
  }

  if (adminAccess === "denied") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border-2 border-amber-300 bg-white p-7 text-center shadow-xl space-y-4">
          <ShieldCheck className="mx-auto h-10 w-10 text-[#8B1E1E]" />
          <h1 className="font-serif text-2xl font-black text-[#8B1E1E]">Admin sign-in required</h1>
          <p className="text-sm text-stone-600">Continue with the authorized Google account to open platform analytics.</p>
          <button type="button" onClick={() => navigate("/navaratri/login")} className="rounded-xl bg-[#8B1E1E] px-5 py-2.5 text-sm font-bold text-white">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-1">
            <span>⚙️ Platform Governance</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-white">
            Navaratri Mandapam • Admin HQ
          </h1>
          <p className="text-xs text-stone-300">
            Multi-tenant supervision, Mandapam verifications, festival standards, and ad moderation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-400 text-stone-900 font-bold">
            Season: {season.name} ({season.status})
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-amber-200/80 pb-2 text-xs">
        {[
          { id: "overview", label: "Overview & Analytics" },
          { id: "mandapams", label: `Mandapams (${totalMandapams})` },
          { id: "ads", label: `Local Ads (${advertisements.length})` },
          { id: "seasons", label: "Season Lifecycle & Archival" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === tab.id
                ? "bg-[#8B1E1E] text-white shadow-sm"
                : "bg-white text-stone-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="text-[10px] text-stone-500 uppercase font-bold">Total Mandapams</span>
              <p className="text-3xl font-black text-[#8B1E1E]">{totalMandapams}</p>
              <p className="text-[11px] text-emerald-700 font-semibold">{verifiedMandapams} Verified Active</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="text-[10px] text-stone-500 uppercase font-bold flex items-center gap-1"><LogIn className="h-3 w-3" /> Organizers</span>
              <p className="text-3xl font-black text-amber-800">{organizerCount}</p>
              <p className="text-[11px] text-stone-600">1 organizer per Mandapam</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="text-[10px] text-stone-500 uppercase font-bold flex items-center gap-1"><QrCode className="h-3 w-3" /> Devotees Scanned</span>
              <p className="text-3xl font-black text-blue-800">{analyticsLoading ? "—" : uniqueDevotees}</p>
              <p className="text-[11px] text-stone-600">{scanEvents.length} total QR scans</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="text-[10px] text-stone-500 uppercase font-bold flex items-center gap-1"><MousePointerClick className="h-3 w-3" /> Advertisement Clicks</span>
              <p className="text-3xl font-black text-purple-800">{analyticsLoading ? "—" : adClickEvents.length}</p>
              <p className="text-[11px] text-stone-600">{advertisements.length} campaigns listed</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50/70 px-5 py-3">
              <h3 className="font-serif font-bold text-[#8B1E1E]">Mandapam Usage at a Glance</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Live Supabase data</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-xs">
                <thead className="bg-[#FAF6ED] text-[10px] uppercase text-stone-600">
                  <tr><th className="p-3">Mandapam</th><th className="p-3 text-center">Organizers</th><th className="p-3 text-center">Unique Devotees</th><th className="p-3 text-center">QR Scans</th><th className="p-3 text-center">Ad Clicks</th></tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {mandapamUsage.map((row) => (
                    <tr key={row.id} className="hover:bg-amber-50/50">
                      <td className="p-3 font-bold text-[#8B1E1E]">{row.name}</td>
                      <td className="p-3 text-center font-semibold">{row.organizers}</td>
                      <td className="p-3 text-center font-semibold">{row.devotees}</td>
                      <td className="p-3 text-center font-semibold">{row.scans}</td>
                      <td className="p-3 text-center font-semibold">{row.adClicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-amber-200 space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#8B1E1E]">
                  Visitor Insights
                </h3>
                <p className="text-xs text-stone-600">Unique devotee visitors from QR scans across all Mandapams.</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Live analytics windows</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-amber-200 bg-white p-4">
                <p className="text-[10px] font-bold uppercase text-stone-500">Last 1 Hour</p>
                <p className="mt-1 text-2xl font-black text-[#8B1E1E]">{analyticsLoading ? "—" : visitorWindows.lastHour}</p>
                <p className="text-[11px] text-stone-600">Visitors in the current hour window</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white p-4">
                <p className="text-[10px] font-bold uppercase text-stone-500">Today</p>
                <p className="mt-1 text-2xl font-black text-blue-800">{analyticsLoading ? "—" : visitorWindows.today}</p>
                <p className="text-[11px] text-stone-600">Visitors since today 12:00 AM</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white p-4">
                <p className="text-[10px] font-bold uppercase text-stone-500">Full {visitorWindows.festivalDays}-Day Festival</p>
                <p className="mt-1 text-2xl font-black text-emerald-800">{analyticsLoading ? "—" : visitorWindows.festival}</p>
                <p className="text-[11px] text-stone-600">Visitors across the complete festival period</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANDAPAMS VERIFICATION */}
      {activeTab === "mandapams" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6ED] text-stone-700 font-bold border-b border-amber-200 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Mandapam Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Organizer</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {mandapams.map((m) => (
                  <tr key={m.id} className="hover:bg-amber-50/50">
                    <td className="p-3">
                      <p className="font-bold text-[#8B1E1E]">{m.name}</p>
                      <p className="text-[10px] text-stone-500 font-mono">/m/{m.slug}</p>
                    </td>
                    <td className="p-3 text-stone-700">{m.area}, {m.city}</td>
                    <td className="p-3">
                      <p className="font-semibold text-stone-900">{m.organizerName}</p>
                      <p className="text-[10px] text-stone-500">{m.organizerMobile}</p>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        m.verificationStatus === "VERIFIED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {m.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* Edit Location & Logo */}
                        <button
                          type="button"
                          onClick={() => {
                            setAdminEditMandapam(m);
                            setAdminEditName(m.name || "");
                            setAdminEditAddress(m.address || "");
                            setAdminEditArea(m.area || "");
                            setAdminEditCity(m.city || "");
                            setAdminEditState(m.state || "Telangana");
                            setAdminEditPincode(m.pincode || "503001");
                            setAdminEditGoogleMapsUrl(m.googleMapsUrl || "");
                            setAdminEditLogoUrl(m.logoUrl || "");
                            setAdminEditModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-bold border border-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Edit Location & Logo"
                        >
                          <Pencil className="w-3.5 h-3.5 text-blue-800" />
                          <span>Edit Details</span>
                        </button>

                        {/* Set Card Background Image */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAdminMandapam(m);
                            const effective = m.cardBgImageUrl || (typeof window !== "undefined" ? localStorage.getItem(`mandapam_card_bg_${m.id}`) : null) || "";
                            setAdminImagePreview(effective);
                            setAdminImageInputUrl("");
                            setAdminCardModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#8B1E1E] text-xs font-bold border border-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Set or Change Mandapam Card Background Image"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#8B1E1E]" />
                          <span>Card Image</span>
                        </button>

                        <a
                          href={`/navaratri/m/${m.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-300 flex items-center gap-1 transition-colors"
                          title="Open Public Mandapam Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Public Page</span>
                        </a>

                        {m.verificationStatus !== "VERIFIED" ? (
                          <button
                            type="button"
                            onClick={() => {
                              verifyMandapam(m.id, "VERIFIED");
                              toast.success(`${m.name} verified!`);
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                          >
                            Approve ✓
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              verifyMandapam(m.id, "SUSPENDED");
                              toast.error(`${m.name} suspended`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-700 text-xs hover:bg-stone-300 cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LOCAL AD MODERATION */}
      {activeTab === "ads" && (
        <div className="space-y-6">

          {/* PENDING PAYMENT VERIFICATION QUEUE */}
          {advertisements.filter(a => a.status === 'PENDING_REVIEW').length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-orange-700 uppercase tracking-wider">⚠️ Pending Payment Verification ({advertisements.filter(a => a.status === 'PENDING_REVIEW').length})</span>
                <span className="text-[10px] text-stone-500">— Confirm UTR to activate ad</span>
              </div>
              {advertisements.filter(a => a.status === 'PENDING_REVIEW').map((ad) => (
                <div key={ad.id} className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-300 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-stone-900 text-sm">{ad.businessName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold border border-orange-200">
                          {ad.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                          PENDING VERIFICATION
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#8B1E1E]">{ad.title}</p>
                      <div className="flex flex-wrap gap-3 text-[11px] text-stone-600">
                        <span>📍 {ad.targetZone || ad.targetCity}</span>
                        <span>📞 {ad.phone}</span>
                        {ad.pricePaid && <span className="font-bold text-emerald-700">₹{ad.pricePaid} claimed paid</span>}
                      </div>
                      {/* UTR Number */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold text-stone-700">UTR Ref:</span>
                        <span className="font-mono text-sm text-stone-900 bg-white px-2 py-0.5 rounded-lg border border-orange-200 font-bold tracking-wider">
                          {ad.utrNumber || <span className="text-red-500 italic">Not provided</span>}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500">Submitted: {ad.createdAt ? new Date(ad.createdAt).toLocaleString('en-IN') : 'Recently'}</p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <button
                        onClick={() => {
                          moderateAd(ad.id, 'APPROVED');
                          toast.success(`✅ Payment confirmed! "${ad.businessName}" ad is now LIVE.`);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Payment & Activate
                      </button>
                      <button
                        onClick={() => {
                          moderateAd(ad.id, 'REJECTED', 'Payment not found or UTR mismatch');
                          toast.error(`Ad rejected — payment not verified.`);
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject (UTR Mismatch)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-700 font-semibold">
              ✅ No pending payment verifications — all ads are reviewed.
            </div>
          )}

          {/* ALL ADS TABLE */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">All Advertisements</h4>
            <div className="rounded-2xl border border-amber-200 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6ED] text-stone-700 font-bold border-b border-amber-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Business</th>
                    <th className="p-3">Ad Creative</th>
                    <th className="p-3">Target City</th>
                    <th className="p-3">UTR / Payment</th>
                    <th className="p-3 text-center">Metrics</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {advertisements.map((ad) => (
                    <tr key={ad.id} className={`hover:bg-amber-50/50 ${
                      ad.status === 'PENDING_REVIEW' ? 'bg-orange-50/40' : ''
                    }`}>
                      <td className="p-3">
                        <p className="font-bold text-stone-900">{ad.businessName}</p>
                        <p className="text-[10px] text-stone-500">{ad.category} • {ad.phone}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-[#8B1E1E]">{ad.title}</p>
                        <p className="text-[10px] text-stone-600 line-clamp-1">{ad.description}</p>
                      </td>
                      <td className="p-3 text-stone-700">{ad.targetCity}</td>
                      <td className="p-3">
                        {ad.utrNumber ? (
                          <span className="font-mono text-stone-900 font-bold">{ad.utrNumber}</span>
                        ) : (
                          <span className="text-stone-400 italic">—</span>
                        )}
                        {ad.pricePaid && <p className="text-[10px] text-emerald-700 font-semibold">₹{ad.pricePaid}</p>}
                      </td>
                      <td className="p-3 text-center">
                        <p className="font-bold text-stone-900">{ad.impressions} Views</p>
                        <p className="text-[10px] text-stone-500">{ad.clicks} Clicks</p>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ad.status === 'ACTIVE' || ad.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ad.status === 'PENDING_REVIEW'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {ad.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {ad.status === 'PENDING_REVIEW' ? (
                          <button
                            onClick={() => {
                              moderateAd(ad.id, 'APPROVED');
                              toast.success('Ad approved & live!');
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                          >
                            Activate ✓
                          </button>
                        ) : ad.status !== 'APPROVED' && ad.status !== 'ACTIVE' ? (
                          <button
                            onClick={() => {
                              moderateAd(ad.id, 'APPROVED');
                              toast.success('Ad approved for publication');
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              moderateAd(ad.id, 'PAUSED', 'Temporarily paused by Admin');
                              toast.info('Ad paused');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold"
                          >
                            Pause
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEASON LIFECYCLE & ARCHIVAL */}
      {activeTab === "seasons" && (
        <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-amber-200 shadow-sm space-y-4">
          <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
            Season Management & Annual Reactivation
          </h3>
          <p className="text-xs text-stone-700 leading-relaxed max-w-2xl">
            <strong>Rule:</strong> Mandapams are NEVER deleted after Navaratri. When the festival concludes, the season moves to "ARCHIVED". For the following year (e.g. 2027), organizers can reactivate their existing Mandapam with 1 click preserving historical Alankaranas, QR codes, and devotee followers.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-stone-900">Current Season: {season.name}</p>
              <p className="text-[11px] text-stone-600">Status: {season.status} • {season.startDate} to {season.endDate}</p>
            </div>
            <button
              onClick={() => toast.info("Season archival is scheduled after Vijaya Dashami (Oct 21).")}
              className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900"
            >
              Archive Season
            </button>
          </div>
        </div>
      )}

      {/* ADMIN MANDAPAM CARD IMAGE MODAL */}
      {adminCardModalOpen && selectedAdminMandapam && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setAdminCardModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#FFFDF9] rounded-3xl border-2 border-amber-400 shadow-2xl p-5 sm:p-6 space-y-4 my-8 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-[#8B1E1E]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-[#8B1E1E]">
                    Set Mandapam Card Background
                  </h3>
                  <p className="text-[11px] text-stone-600 font-medium">
                    {selectedAdminMandapam.name} • Card background only
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminCardModalOpen(false)}
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Preview */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Admin / Card Background Preview:
                </label>
                <div className="relative h-36 rounded-2xl overflow-hidden border-2 border-amber-300 bg-stone-900 shadow-inner flex items-center justify-center">
                  {adminImagePreview ? (
                    <>
                      <img
                        src={adminImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-50/90 via-amber-50/80 to-transparent p-4 flex flex-col justify-end">
                        <p className="font-serif font-black text-base text-[#8B1E1E]">{selectedAdminMandapam.name}</p>
                        <p className="text-[11px] text-stone-700 font-semibold">{selectedAdminMandapam.address}, {selectedAdminMandapam.city}</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-stone-400 p-4">
                      <Camera className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <p className="text-xs">No image selected. Default devotional style will be used.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Public Cover */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Public View Cover Image:
                </label>
                <div className="relative h-28 rounded-2xl overflow-hidden border border-amber-200 bg-stone-100 shadow-inner flex items-center justify-center">
                  {selectedAdminMandapam.coverImageUrl ? (
                    <img
                      src={selectedAdminMandapam.coverImageUrl}
                      alt={`${selectedAdminMandapam.name} public cover`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-stone-400 p-4">
                      <ImageIcon className="w-7 h-7 mx-auto mb-1 opacity-50" />
                      <p className="text-xs">No public cover image set by organizer.</p>
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-[#8B1E1E] shadow-sm">Public profile cover</span>
                </div>
                <p className="text-[10px] text-stone-500">This image is controlled by the organizer/public profile flow and is not changed by this card background tool.</p>
              </div>

              {/* Upload from Device */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#8B1E1E]" />
                    <span>Upload Mandapam Image from Computer</span>
                  </span>
                  {isUploadingAdminImage && (
                    <span className="text-[10px] font-bold text-amber-700 animate-pulse">Compressing...</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAdminImageUpload}
                  className="w-full text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#8B1E1E] file:text-white hover:file:bg-[#9A241C] file:cursor-pointer"
                />
                <p className="text-[10px] text-stone-500">Supports JPG, PNG, WebP (auto-optimized).</p>
              </div>

              {/* Or Paste URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Or Paste Photo URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={adminImageInputUrl}
                    onChange={(e) => {
                      setAdminImageInputUrl(e.target.value);
                      if (e.target.value.trim().startsWith("http") || e.target.value.trim().startsWith("/")) {
                        setAdminImagePreview(e.target.value.trim());
                      }
                    }}
                    placeholder="https://example.com/mandapam-photo.jpg"
                    className="flex-1 px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (adminImageInputUrl.trim()) {
                        setAdminImagePreview(adminImageInputUrl.trim());
                        toast.success("Image URL loaded!");
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-[#8B1E1E] text-xs font-bold transition-colors cursor-pointer"
                  >
                    Load
                  </button>
                </div>
              </div>

              {/* Devotional Presets */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Or Select Devotional Sanctum Theme:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ADMIN_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAdminImagePreview(preset.url)}
                      className={`p-1 rounded-xl border text-center transition-all cursor-pointer ${
                        adminImagePreview === preset.url
                          ? "border-[#8B1E1E] ring-2 ring-[#8B1E1E] bg-amber-100"
                          : "border-stone-200 hover:border-amber-300 bg-white"
                      }`}
                      title={preset.name}
                    >
                      <div className="w-full h-12 rounded-lg overflow-hidden bg-stone-100 relative">
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[9px] font-bold text-stone-700 mt-1 truncate">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-amber-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleResetAdminCardBg}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset to Default
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminCardModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyAdminCardBg}
                    className="px-5 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply Card Background</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN MANDAPAM LOCATION & LOGO EDIT MODAL */}
      {adminEditModalOpen && adminEditMandapam && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setAdminEditModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#FFFDF9] rounded-3xl border-2 border-blue-400 shadow-2xl p-5 sm:p-6 space-y-4 my-8 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-900">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-[#8B1E1E]">
                    Edit Mandapam Details & Logo
                  </h3>
                  <p className="text-[11px] text-stone-600 font-medium">
                    {adminEditMandapam.name} • Location & Branding Control
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminEditModalOpen(false)}
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium text-stone-800">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mandapam Name
                </label>
                <input
                  type="text"
                  value={adminEditName}
                  onChange={(e) => setAdminEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Logo section */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <span className="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#8B1E1E]" />
                  <span>Mandapam Logo / Emblem</span>
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border-2 border-amber-300 bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    {adminEditLogoUrl ? (
                      <img src={adminEditLogoUrl} alt="Logo preview" className="w-full h-full object-contain p-0.5" />
                    ) : (
                      <span className="text-xl">卐</span>
                    )}
                  </div>
                  <div className="space-y-2 flex-1 min-w-0">
                    <input
                      type="url"
                      value={adminEditLogoUrl}
                      onChange={(e) => setAdminEditLogoUrl(e.target.value)}
                      placeholder="Paste logo image URL..."
                      className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white font-bold text-xs shadow-xs cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingAdminLogo ? "Uploading..." : "Upload Logo Image"}</span>
                      <input type="file" accept="image/*" onChange={handleAdminLogoUpload} className="hidden" disabled={isUploadingAdminLogo} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Location section */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-200 pb-1">
                  <MapPin className="w-4 h-4 text-[#8B1E1E]" />
                  <span>Respected Location & Google Maps Link</span>
                </span>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Street Address / Landmark
                  </label>
                  <input
                    type="text"
                    value={adminEditAddress}
                    onChange={(e) => setAdminEditAddress(e.target.value)}
                    placeholder="e.g. 3-5-260/2, Shivaji Nagar Rd"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Area / Locality *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminEditArea}
                      onChange={(e) => setAdminEditArea(e.target.value)}
                      placeholder="e.g. Subhash Nagar"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminEditCity}
                      onChange={(e) => setAdminEditCity(e.target.value)}
                      placeholder="e.g. Nizamabad"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={adminEditState}
                      onChange={(e) => setAdminEditState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={adminEditPincode}
                      onChange={(e) => setAdminEditPincode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Google Maps Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={adminEditGoogleMapsUrl}
                    onChange={(e) => setAdminEditGoogleMapsUrl(e.target.value)}
                    placeholder="Paste Google Maps share link..."
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    If empty, directions link will automatically open a search for the area location ({adminEditArea || "Area"}, {adminEditCity || "City"}).
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-amber-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdminEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAdminMandapamDetails}
                  className="px-5 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

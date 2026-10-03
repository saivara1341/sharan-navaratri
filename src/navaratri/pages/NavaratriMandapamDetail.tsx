import { navaratriAsset } from "../utils/navaratriAssets";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../context/NavaratriLanguageContext";
import { STANDARD_NAVARATRI_DAYS } from "../data/standardNavaratriDays";
import { StandardFestivalDay, Activity } from "../types";
import { ServiceBookingModal } from "../components/citizen/ServiceBookingModal";
import { ShareQrModal } from "../components/citizen/ShareQrModal";
import { TempleArchFrame } from "../components/devotional/TempleArchFrame";
import { InstagramVerifiedBadge } from "../components/devotional/InstagramVerifiedBadge";
import { PrasadBowlIcon } from "../components/devotional/PrasadBowlIcon";
import { MandapamIcon } from "../components/devotional/MandapamIcon";
import {
  MapPin,
  Share2,
  Heart,
  QrCode,
  Phone,
  Clock,
  Utensils,
  Calendar,
  Flame,
  CheckCircle2,
  X,
  Sparkles,
  Users,
  Info,
  CalendarDays,
  ExternalLink,
  MessageCircle,
  ShoppingBag,
  Flower2,
  Gift,
  Camera,
  Upload,
  Trash2,
  Check,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

interface ActivityRegistrationRecord {
  id: string;
  activityId: string;
  activityTitle: string;
  mandapamId: string;
  name: string;
  mobile: string;
  category: string;
  count: number;
  notes?: string;
  registeredAt: string;
}

const PRESET_MANDAPAM_BACKGROUNDS = [
  {
    id: "preset-terracotta",
    name: "Terracotta Kolam Utsav",
    url: navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg"),
  },
  {
    id: "preset-golden",
    name: "Golden Lotus Sanctum",
    url: navaratriAsset("/navaratri/assets/golden-lotus-bg.jpg"),
  },
  {
    id: "preset-ivory",
    name: "Ivory Lotus Sanctum",
    url: navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"),
  },
  {
    id: "preset-sage",
    name: "Sage Floral Utsav",
    url: navaratriAsset("/navaratri/assets/sage-floral-bg.jpg"),
  },
  {
    id: "preset-royal",
    name: "Royal Mandir Sanctum",
    url: navaratriAsset("/navaratri/assets/royal-maroon-arch.jpg"),
  }
];

export const NavaratriMandapamDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    mandapams,
    alankaranas,
    daySettings,
    services,
    activities,
    announcements,
    toggleFollow,
    isFollowing,
    markScanned,
    updateMandapam
  } = useNavaratriData();
  const { t, language } = useNavaratriLanguage();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Mandapam Background Customization State
  const [bgModalOpen, setBgModalOpen] = useState(false);
  const [customCardBg, setCustomCardBg] = useState<string>("");
  const [bgInputUrl, setBgInputUrl] = useState("");
  const [bgPreviewUrl, setBgPreviewUrl] = useState("");
  const [alsoApplyToCover, setAlsoApplyToCover] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 10-Day Pop-up State
  const [selectedDay, setSelectedDay] = useState<StandardFestivalDay | null>(null);

  // Activity Registration State
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [regActivity, setRegActivity] = useState<Activity | null>(null);
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regCategory, setRegCategory] = useState("Open / All Ages");
  const [regCount, setRegCount] = useState(1);
  const [regNotes, setRegNotes] = useState("");
  const [regSuccessTicket, setRegSuccessTicket] = useState<ActivityRegistrationRecord | null>(null);

  // Normalize and decode search slug
  const normalizedSlug = decodeURIComponent(slug || "").trim().toLowerCase();

  // Find mandapam by exact slug, id, or partial match, falling back to first mandapam
  const mandapam =
    mandapams.find(
      m => (m.slug && m.slug.toLowerCase() === normalizedSlug) ||
           (m.id && m.id.toLowerCase() === normalizedSlug)
    ) ||
    (normalizedSlug
      ? mandapams.find(
          m => (m.slug && m.slug.toLowerCase().includes(normalizedSlug)) ||
               (m.name && m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(normalizedSlug))
        )
      : undefined) ||
    mandapams[0];

  const following = mandapam ? isFollowing(mandapam.id) : false;

  // Automatically mark as visited/scanned so it appears on user's home landing page
  useEffect(() => {
    if (mandapam?.id) {
      markScanned(mandapam.id);
    }
  }, [mandapam?.id, markScanned]);

  if (!mandapam) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl">
          🪔
        </div>
        <h2 className="font-serif font-black text-2xl text-[#8B1E1E]">
          {t.mandapamNotFound}
        </h2>
        <p className="text-sm text-stone-600 max-w-md">
          {t.mandapamNotFoundMsg}
        </p>
        <Link
          to="/navaratri"
          className="px-6 py-2.5 rounded-xl bg-[#8B1E1E] text-white text-sm font-bold shadow-md hover:bg-[#9A241C]"
        >
          {t.exploreAllMandapams}
        </Link>
      </div>
    );
  }

  // Filter ONLY this mandapam's data
  const mandapamDaySettings = daySettings.filter(s => s.mandapamId === mandapam.id);
  const mandapamServices = services.filter(s => s.mandapamId === mandapam.id && s.enabled);
  const mandapamActivities = activities.filter(a => a.mandapamId === mandapam.id && a.published);
  const mandapamAnnouncements = announcements.filter(a => a.mandapamId === mandapam.id && a.published);
  const todayAlankarana = alankaranas.find(a => a.mandapamId === mandapam.id);
  const todaySetting = daySettings.find(s => s.mandapamId === mandapam.id && s.dayNumber === 1);

  const todayIso = new Date().toLocaleDateString("en-CA");

  const handleFollowToggle = () => {
    toggleFollow(mandapam.id);
    if (!following) {
      toast.success(`You are now following ${mandapam.name}! Saved on your Home page.`);
    } else {
      toast.info(`Unfollowed ${mandapam.name}`);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${mandapam.name} - Navaratri Mandapam`,
        text: `Check out 10-Day Alankaranas, Pooja Timings, Annadanam & Activities for ${mandapam.name}:`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Mandapam link copied to clipboard!");
    }
  };

  // Synchronize custom card background from localStorage or mandapam record
  useEffect(() => {
    if (mandapam?.id) {
      const stored = localStorage.getItem(`mandapam_card_bg_${mandapam.id}`) || mandapam.cardBgImageUrl || "";
      setCustomCardBg(stored);
      setBgPreviewUrl(stored);
    }
  }, [mandapam?.id, mandapam?.cardBgImageUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsUploading(true);
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
            setBgPreviewUrl(compressed);
            toast.success("Image loaded! Click 'Apply Background' to save.");
          } else {
            setBgPreviewUrl(event.target?.result as string);
          }
          setIsUploading(false);
        };
        img.onerror = () => {
          setIsUploading(false);
          toast.error("Failed to process image.");
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to read image file.");
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
      toast.error("Error reading image file.");
    }
  };

  const handleApplyBg = (imageToApply?: string) => {
    const targetUrl = (imageToApply !== undefined ? imageToApply : (bgPreviewUrl || bgInputUrl)).trim();
    if (!targetUrl) {
      toast.error("Please select an image or enter a photo URL.");
      return;
    }

    try {
      localStorage.setItem(`mandapam_card_bg_${mandapam.id}`, targetUrl);
    } catch (err) {
      console.warn("Storage quota warning", err);
    }

    setCustomCardBg(targetUrl);

    // Update mandapam in context & persistence
    const updates: Partial<typeof mandapam> = { cardBgImageUrl: targetUrl };
    if (alsoApplyToCover) {
      updates.coverImageUrl = targetUrl;
      try {
        localStorage.setItem(`mandapam_cover_${mandapam.id}`, targetUrl);
      } catch {}
    }
    updateMandapam(mandapam.id, updates);

    setBgModalOpen(false);
    toast.success(`Mandapam background updated for ${mandapam.name}! 🪔`);
  };

  const handleResetBg = () => {
    try {
      localStorage.removeItem(`mandapam_card_bg_${mandapam.id}`);
    } catch {}
    setCustomCardBg("");
    setBgPreviewUrl("");
    setBgInputUrl("");
    updateMandapam(mandapam.id, { cardBgImageUrl: "" });
    setBgModalOpen(false);
    toast.success("Card background reset to default devotional theme.");
  };

  // Helper for short dates (e.g., "11 Oct")
  const formatDateShort = (isoDate: string) => {
    try {
      const d = new Date(isoDate + "T00:00:00");
      return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    } catch {
      return isoDate;
    }
  };

  // Helper for short avatar preview in 2-row buttons
  const getShortAvatar = (fullName: string) => {
    const clean = fullName
      .replace(/^(?:Sri|Maa|శ్రీ|माँ)\s+/i, "")
      .replace(/\s+(?:Devi|దేవి|देवी)$/i, "")
      .replace(/\s+Alankarana.*$/i, "");
    return clean.length > 13 ? clean.substring(0, 12) + "…" : clean;
  };

  // Helper to highlight only the time in red color (e.g. "Morning 08:00 AM (Sahasranama Archana)")
  const renderHighlightedTiming = (text: string) => {
    const parts = text.split(/(\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\b)/);
    const isTime = (str: string) => /^\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)$/i.test(str.trim());

    return (
      <>
        {parts.map((part, idx) => {
          if (isTime(part)) {
            return (
              <span key={idx} className="text-red-600 font-black">
                {part}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </>
    );
  };

  // Activity Registration Handler
  const handleOpenActivityReg = (act: Activity) => {
    setRegActivity(act);
    setRegName("");
    setRegMobile("");
    setRegCount(1);
    setRegNotes("");
    setRegSuccessTicket(null);
    setRegModalOpen(true);
  };

  const handleSubmitActivityReg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regActivity) return;

    const cleanMobile = regMobile.replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    const regRecord: ActivityRegistrationRecord = {
      id: `REG-${Math.floor(10000 + Math.random() * 90000)}`,
      activityId: regActivity.id,
      activityTitle: regActivity.title,
      mandapamId: mandapam.id,
      name: regName.trim(),
      mobile: cleanMobile,
      category: regCategory,
      count: regCount,
      notes: regNotes.trim(),
      registeredAt: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem("navaratri_activity_registrations");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(regRecord);
      localStorage.setItem("navaratri_activity_registrations", JSON.stringify(list));
    } catch {
      // ignore
    }

    setRegSuccessTicket(regRecord);
    toast.success(`Registration Confirmed for ${regActivity.title}!`);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* 1. MANDAPAM HERO & PROFILE */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-300 shadow-xl bg-white">
        {/* Cover Photo */}
        <div className="h-44 sm:h-60 w-full relative bg-[#8B1E1E]">
          <img
            src={mandapam.coverImageUrl || customCardBg || navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg")}
            alt={mandapam.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Quick Actions (Top Right) */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={() => setQrModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-stone-900 text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors backdrop-blur-sm"
              title="View & Print Mandapam QR Standee"
            >
              <QrCode className="w-3.5 h-3.5 text-[#8B1E1E]" />
              <span className="hidden xs:inline">Mandapam QR</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/95 hover:bg-white text-stone-900 shadow-md transition-colors backdrop-blur-sm"
              title="Share Mandapam"
            >
              <Share2 className="w-4 h-4 text-stone-800" />
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="relative -mt-10 mx-3 sm:mx-5 rounded-2xl border-2 border-amber-300/90 shadow-lg mb-3 overflow-hidden p-4 sm:p-6 transition-all bg-[#FDFBF7]">
          {/* Card Background Image (Custom Mandapam Photo or Default) */}
          {customCardBg ? (
            <div className="absolute inset-0 pointer-events-none z-0">
              <img
                src={customCardBg}
                alt={`${mandapam.name} Background`}
                className="w-full h-full object-cover"
              />
              {/* Devotional Warm Glassmorphism Overlay guaranteeing 100% crisp readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-50/96 via-amber-50/92 to-amber-50/88 backdrop-blur-[1px]" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-amber-100/40" />
            </div>
          ) : (
            <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-[#FFFDF9] via-[#FDFBF7] to-amber-50/60" />
          )}

          <div className="relative z-10">
            {/* Top row with "Add/Change Mandapam Image" trigger */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-amber-200/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  Mandapam Profile
                </span>
              </div>

              {/* Add/Change Mandapam Image in background */}
              <button
                type="button"
                onClick={() => {
                  setBgPreviewUrl(customCardBg);
                  setBgModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-white text-stone-800 hover:text-[#8B1E1E] border border-amber-300/90 text-xs font-bold shadow-xs hover:shadow transition-all backdrop-blur-xs active:scale-95 cursor-pointer"
                title="Add or change mandapam photo in background of this card"
              >
                <Camera className="w-3.5 h-3.5 text-[#8B1E1E]" />
                <span>{customCardBg ? "Change Card Background" : "Add Mandapam Image"}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 border-2 border-amber-400 p-0.5 shadow-md shrink-0 overflow-hidden relative group">
                  <img
                    src={mandapam.logoUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg")}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h1 className="font-serif font-black text-xl sm:text-2xl text-[#8B1E1E] flex items-center gap-1.5 leading-snug drop-shadow-xs">
                      <span>{mandapam.name}</span>
                      <InstagramVerifiedBadge className="w-5 h-5 shrink-0 drop-shadow-xs" title="Official Verified Mandapam" />
                    </h1>
                  </div>

                  <p className="text-xs text-stone-700 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{mandapam.address}, {mandapam.area}, {mandapam.city}</span>
                  </p>

                  <p className="text-xs text-stone-800 font-medium pt-0.5 line-clamp-2 leading-relaxed">
                    {mandapam.description === "Annual Community Navaratri Utsav" ? t.annualCommunityUtsav : (mandapam.description || t.annualCommunityUtsav)}
                  </p>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-1 sm:pt-0">
                <button
                  onClick={handleFollowToggle}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                    following
                      ? "bg-amber-100 text-[#8B1E1E] border border-amber-400"
                      : "bg-[#8B1E1E] text-white hover:bg-[#9A241C]"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${following ? "fill-current text-[#8B1E1E]" : ""}`} />
                  <span>{following ? t.followingBtn : t.follow}</span>
                </button>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${mandapam.name}, ${mandapam.address}, ${mandapam.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-stone-800 border border-amber-300 text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#8B1E1E]" />
                  <span>{t.directions}</span>
                </a>

                {/* Quick Add/Change Background Photo button beside Directions */}
                <button
                  type="button"
                  onClick={() => {
                    setBgPreviewUrl(customCardBg);
                    setBgModalOpen(true);
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-amber-100/90 hover:bg-amber-200 text-[#8B1E1E] border border-amber-300 text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Add or Change Mandapam Image in background"
                >
                  <Camera className="w-3.5 h-3.5 text-[#8B1E1E]" />
                  <span>{customCardBg ? "Change Photo" : "Add Photo"}</span>
                </button>

                {mandapam.contactPhone && (
                  <a
                    href={`tel:${mandapam.contactPhone}`}
                    className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-colors flex items-center justify-center"
                    title="Call Mandapam Organizer"
                  >
                    <Phone className="w-4 h-4 text-[#8B1E1E]" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 10-DAY FESTIVAL BUTTONS (2 ROWS ON MOBILE, NO SCROLL) */}
      <section className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#FEF3C7] border-2 border-amber-400 rounded-3xl p-4 sm:p-5 shadow-xl shadow-amber-200/60 ring-2 ring-amber-200/40 space-y-3.5" style={{boxShadow: '0 0 0 2px #fbbf24, 0 8px 32px -4px rgba(180,83,9,0.18)'}}>
        <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪔</span>
            <div>
              <h2 className="font-serif font-black text-lg sm:text-xl text-[#8B1E1E]">
                {t.tenDivineSchedule}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-600">
                {t.tapDayInstruction}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-950 border border-amber-300">
            {t.tenDays}
          </span>
        </div>

        {/* Exactly 2 Rows on Mobile (grid-cols-5): Day 1-5 in Row 1, Day 6-10 in Row 2 */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
          {STANDARD_NAVARATRI_DAYS.map((day) => {
            const isToday = day.date === todayIso;
            const customSetting = mandapamDaySettings.find((s) => s.dayNumber === day.dayNumber);
            const deviDisplayName = customSetting?.customDeviName || (
              language === "te" ? day.teluguDeviName : language === "hi" ? day.hindiDeviName : day.deviName
            );
            const customAlankarana = alankaranas.find(
              (a) => a.mandapamId === mandapam?.id && a.date === day.date
            );
            const avatarImg =
              customAlankarana?.imageUrl && !customAlankarana.imageUrl.includes("-bg.jpg")
                ? customAlankarana.imageUrl
                : day.imageUrl || navaratriAsset("/navaratri/assets/maa-durga-icon.png");

            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`pb-1.5 pt-1.5 px-0.5 sm:pb-2 sm:pt-2 sm:px-1 rounded-xl sm:rounded-2xl border transition-all flex flex-col items-center gap-0.5 text-center relative group active:scale-95 cursor-pointer overflow-hidden min-h-[100px] sm:min-h-[120px] ${
                  isToday
                    ? "bg-gradient-to-b from-[#8B1E1E] to-[#9A241C] text-white border-amber-400 shadow-lg ring-2 ring-amber-400/60"
                    : "bg-white hover:bg-amber-50 text-stone-900 border-amber-300/80 shadow-sm hover:border-amber-400 hover:shadow-amber-200/50"
                }`}
              >
                {isToday && (
                  <>
                    <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
                    <span className="absolute top-1 right-0.5 px-1 rounded-full bg-amber-400 text-amber-950 text-[6px] font-black uppercase tracking-wider leading-tight">{t.today}</span>
                  </>
                )}

                {/* Sacred Color Indicator Bar at bottom */}
                <span
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl"
                  style={{ backgroundColor: day.colorHex, opacity: isToday ? 0.7 : 0.5 }}
                />

                {/* Day Number */}
                <span className={`text-[10px] sm:text-[11px] font-black font-serif leading-none ${isToday ? "text-amber-200" : "text-[#8B1E1E]"}`}>
                  {t.dayLabel} {day.dayNumber}
                </span>

                {/* Devi Idol Image — properly contained, face-focused */}
                <div className="relative mt-0.5 w-10 h-10 sm:w-13 sm:h-13 rounded-full border-2 border-amber-400 overflow-hidden shrink-0 group-hover:scale-105 transition-transform shadow-sm" style={{ minWidth: 40, minHeight: 40 }}>
                  <img
                    src={avatarImg}
                    alt={deviDisplayName}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = navaratriAsset("/navaratri/assets/maa-durga-icon.png");
                    }}
                  />
                  {/* golden glow ring overlay */}
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-amber-300/60 pointer-events-none" />
                </div>

                {/* Date */}
                <span className={`text-[8.5px] sm:text-[10px] font-bold leading-none ${isToday ? "text-white" : "text-stone-700"}`}>
                  {formatDateShort(day.date)}
                </span>

                {/* Short Devi Name */}
                <span className={`text-[7px] sm:text-[8.5px] truncate max-w-full font-medium leading-tight px-0.5 ${isToday ? "text-amber-100" : "text-stone-500"}`}>
                  {getShortAvatar(deviDisplayName)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sacred 10-Day Tithi, Alankaram & Transition Schedule Table */}
        <div className="mt-4 pt-3.5 border-t border-amber-300/80 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base">📜</span>
              <h4 className="font-serif font-black text-sm sm:text-base text-[#8B1E1E]">
                Daily Tithi, Alankaram & Transition Schedule
              </h4>
            </div>
            <span className="text-[10px] text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 font-semibold self-start sm:self-center">
              11 Oct – 20 Oct 2026
            </span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border-2 border-amber-300 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-amber-200/90 via-amber-100 to-orange-100 text-amber-950 font-bold border-b border-amber-300">
                  <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                  <th className="py-2.5 px-3">Tithi</th>
                  <th className="py-2.5 px-3">Morning Alankaram & Pooja</th>
                  <th className="py-2.5 px-3">Evening Alankaram & Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-stone-800">
                {STANDARD_NAVARATRI_DAYS.map((day) => {
                  const isToday = day.date === todayIso;
                  const customSetting = mandapamDaySettings.find((s) => s.dayNumber === day.dayNumber);
                  const deviDisplayName = customSetting?.customDeviName || (
                    language === "te" ? day.teluguDeviName : language === "hi" ? day.hindiDeviName : day.deviName
                  );

                  return (
                    <tr
                      key={day.dayNumber}
                      onClick={() => setSelectedDay(day)}
                      className={`hover:bg-amber-50 cursor-pointer transition-colors ${
                        isToday ? "bg-amber-100/70 font-semibold" : ""
                      }`}
                      title="Tap to view Devi Darshan & Pooja timings"
                    >
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-bold text-[#8B1E1E]">{formatDateShort(day.date)}</span>
                        {isToday && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[8px] bg-amber-400 text-amber-950 font-black uppercase">
                            {t.today}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-stone-700 font-semibold">
                        {day.tithi}
                      </td>
                      <td className="py-2.5 px-3 text-[#8B1E1E] font-bold">
                        {day.morningAlankaram || deviDisplayName}
                      </td>
                      <td className="py-2.5 px-3 text-amber-900 font-medium">
                        {day.eveningTransition}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="sm:hidden space-y-2">
            {STANDARD_NAVARATRI_DAYS.map((day) => {
              const isToday = day.date === todayIso;
              const customSetting = mandapamDaySettings.find((s) => s.dayNumber === day.dayNumber);
              const deviDisplayName = customSetting?.customDeviName || (
                language === "te" ? day.teluguDeviName : language === "hi" ? day.hindiDeviName : day.deviName
              );

              return (
                <div
                  key={day.dayNumber}
                  onClick={() => setSelectedDay(day)}
                  className={`p-2.5 rounded-xl border transition-all text-xs cursor-pointer active:scale-[0.99] ${
                    isToday
                      ? "bg-amber-100/90 border-amber-400 shadow-sm ring-1 ring-amber-400/50"
                      : "bg-white border-amber-300/80 shadow-xs hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-amber-100 pb-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-black text-[#8B1E1E] text-xs">
                        {t.dayLabel} {day.dayNumber} • {formatDateShort(day.date)}
                      </span>
                      {isToday && (
                        <span className="px-1.5 py-0.2 rounded text-[7.5px] bg-amber-400 text-amber-950 font-black uppercase">
                          {t.today}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                      {day.tithi}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[10px] font-bold text-stone-500 uppercase shrink-0 mt-0.5">
                        Morning:
                      </span>
                      <span className="font-bold text-[#8B1E1E] leading-snug">
                        {day.morningAlankaram || deviDisplayName}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <span className="text-[10px] font-bold text-amber-800 uppercase shrink-0 mt-0.5">
                        Evening:
                      </span>
                      <span className="text-stone-700 leading-snug">
                        {day.eveningTransition}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAHA ANNADANAM CARD (Directly below 10-day buttons) */}
      <section className="rounded-3xl border-2 border-amber-400 bg-gradient-to-br from-[#FFFBEB] via-[#FFFDF9] to-[#FEF3C7] p-5 sm:p-6 shadow-lg relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-300/80 pb-3">
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-amber-400 bg-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center p-0.5">
              <img
                src={navaratriAsset("/navaratri/assets/maha-annadanam-logo.png")}
                alt="Maha Annadanam Official Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#8B1E1E]">
                  {t.mahaAnnadanam}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>{t.freeForAll}</span>
                </span>
              </div>
              <p className="text-xs text-amber-950 font-serif font-semibold mt-0.5">
                నిత్యాన్నదాన సేవ • Sacred Prasadam Bhojanam
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-amber-100/80 border border-amber-300 text-xs font-bold text-amber-900 self-start sm:self-center">
            {todaySetting?.annadanamExpectedCount || 500}{t.devoteesServedDaily}
          </div>
        </div>

        {/* Date & Time Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Starting Date to End Date */}
          <div className="p-3.5 rounded-2xl bg-white/95 border border-amber-200 shadow-xs flex items-start gap-3">
            <CalendarDays className="w-5 h-5 text-[#8B1E1E] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                {t.annadanamDatesLabel}
              </span>
              <p className="text-sm font-bold text-stone-900 leading-snug">
                {t.annadanamDatesValue}
              </p>
              <p className="text-[11px] text-amber-800 font-medium">
                {t.annadanamDatesNote}
              </p>
            </div>
          </div>

          {/* Time & Location */}
          <div className="p-3.5 rounded-2xl bg-white/95 border border-amber-200 shadow-xs flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                {t.dailyAnnadanamTimings}
              </span>
              <p className="text-sm font-bold text-stone-900 leading-snug">
                {todaySetting?.annadanamStartTime || "12:30 PM"} – {todaySetting?.annadanamEndTime || "03:30 PM"} Daily
              </p>
              <p className="text-[11px] text-stone-600">
                {t.annadanamLocationPrefix} {todaySetting?.annadanamLocation || "Mandapam Annadanam Dining Hall / Pandal"}
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* 4. MANDAPAM ACTIVITIES & COMPETITIONS (With Registration Action) */}
      <section className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <MandapamIcon className="w-6 h-6 text-[#8B1E1E]" />
              <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
                {t.activitiesTitle}
              </h3>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              {mandapam.name} • {t.activitiesSubtitle}
            </p>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 self-start sm:self-center">
            {mandapamActivities.length} {t.eventsLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mandapamActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                    {act.category}
                  </span>
                  <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#8B1E1E]" />
                    {act.date}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#8B1E1E] leading-snug">
                  {act.title}
                </h4>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {act.description}
                </p>

                <div className="space-y-1 pt-1 text-[11px] text-stone-600">
                  <div className="flex items-center gap-1.5 font-medium text-stone-800">
                    <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{t.timeLabel} {act.startTime} {act.endTime ? `– ${act.endTime}` : ""}</span>
                  </div>
                  {act.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{t.locationLabel} {act.location}</span>
                    </div>
                  )}
                  {act.instructions && (
                    <div className="flex items-start gap-1.5 text-amber-900 bg-amber-50/80 p-2 rounded-xl border border-amber-200/60 mt-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{act.instructions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Action Button */}
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {t.freeEntry}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenActivityReg(act)}
                  className="px-4 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>{t.registerToParticipate}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MANDAPAM AVAILABLE POOJAS & SEVAS (If enabled) */}
      {mandapamServices.length > 0 && (
        <section className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#8B1E1E]" />
                <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
                  {t.poojasTitle}
                </h3>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                {t.slotBookingNotice}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mandapamServices.map((srv) => (
              <div
                key={srv.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-[#8B1E1E] uppercase">
                      {srv.type}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {srv.durationMinutes} {t.minsLabel}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#8B1E1E]">
                    {srv.name}
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {srv.description}
                  </p>
                  {srv.itemsRequired && (
                    <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200/60">
                      <strong>{t.itemsToBringLabel}</strong> {srv.itemsRequired}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">
                    {t.slotsAvailable}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedServiceId(srv.id);
                      setBookingModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C] shadow-sm transition-colors"
                  >
                    {t.bookSlot}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. MANDAPAM ANNOUNCEMENTS */}
      {mandapamAnnouncements.length > 0 && (
        <section className="bg-white border-2 border-amber-300 rounded-3xl p-5 shadow-md space-y-3">
          <h3 className="font-serif font-bold text-lg text-[#8B1E1E] flex items-center gap-2">
            <span>📢</span>
            <span>{t.noticeBoard}</span>
          </h3>
          <div className="space-y-2">
            {mandapamAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs"
              >
                <h4 className="font-bold text-[#8B1E1E] text-sm">{ann.title}</h4>
                <p className="text-stone-700 mt-1 leading-relaxed">{ann.message}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* DAY POP-UP CARD MODAL (Opened upon tapping any of the 10 buttons) */}
      {/* ============================================================ */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#FDFBF7] text-[#221A14] w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-amber-400 relative my-6 max-h-[90vh] overflow-y-auto space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#8B1E1E] text-white font-serif font-black text-xs">
                  {t.dayLabel} {selectedDay.dayNumber}
                </span>
                <span className="text-xs font-semibold text-stone-600">
                  {selectedDay.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Color Tag */}
                <div
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                  style={{
                    backgroundColor: selectedDay.colorHex,
                    color: selectedDay.dayNumber === 2 ? "#1C1917" : "#FFFFFF"
                  }}
                >
                  {selectedDay.colorName.split("/")[0]}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="p-1.5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Devi Avatharam & Consecrated Darshan */}
            {(() => {
              const selectedDayDeviName = mandapamDaySettings.find(s => s.dayNumber === selectedDay.dayNumber)?.customDeviName || (
                language === "te" ? selectedDay.teluguDeviName : language === "hi" ? selectedDay.hindiDeviName : selectedDay.deviName
              );

              return (
                <div className="text-center space-y-2">
                  <div className="max-w-[260px] sm:max-w-xs mx-auto">
                    <TempleArchFrame
                      imageUrl={
                        (selectedDay.dayNumber === 1 && todayAlankarana?.imageUrl)
                          ? todayAlankarana.imageUrl
                          : selectedDay.imageUrl
                      }
                      title={selectedDayDeviName}
                      subtitle={
                        (selectedDay.dayNumber === 1 && todayAlankarana?.title)
                          ? todayAlankarana.title
                          : `${t.dayLabel} ${selectedDay.dayNumber} ${t.daySacredDarshan}`
                      }
                      badge="Devi Alankarana"
                    />
                  </div>

                  <div>
                    <h3 className="font-serif font-black text-xl sm:text-2xl text-[#8B1E1E] leading-snug">
                      {selectedDayDeviName}
                    </h3>
                    <p className="text-sm font-serif font-semibold text-amber-900 mt-0.5">
                      {language === "te" ? selectedDay.deviName : selectedDay.teluguDeviName}
                    </p>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {selectedDay.description}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Dual Session Note if Enabled */}
            {(() => {
              const customSetting = mandapamDaySettings.find(s => s.dayNumber === selectedDay.dayNumber);
              const isDual = customSetting?.isDualAlankarana ?? !!selectedDay.dualSessionNote;
              if (!isDual) return null;
              const morning = customSetting?.morningDeviName || selectedDay.dualSessionNote?.morningAlankarana;
              const evening = customSetting?.eveningDeviName || selectedDay.dualSessionNote?.eveningAlankarana;

              return (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300/80 text-xs space-y-1">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span>✨</span> {t.dualAlankaranaSessions}
                  </span>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-xl bg-white border border-amber-200">
                      <span className="text-[10px] font-bold text-stone-500 uppercase">{t.morningLabel}</span>
                      <p className="font-bold text-stone-800 text-xs">{morning}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200">
                      <span className="text-[10px] font-bold text-stone-500 uppercase">{t.eveningLabel}</span>
                      <p className="font-bold text-[#8B1E1E] text-xs">{evening}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Pooja Timings & Offerings from Organizer Portal */}
            {(() => {
              const customSetting = mandapamDaySettings.find(s => s.dayNumber === selectedDay.dayNumber);
              const poojaTimings = customSetting?.useStandardPooja === false && customSetting.customPoojaTimings
                ? customSetting.customPoojaTimings
                : selectedDay.dayNumber === 1
                ? "Morning 07:30 AM (Kalash & Ganapathi Sthapana) | Evening 06:30 PM (Maha Harathi)"
                : "Morning 08:00 AM (Sahasranama Archana) | Evening 06:30 PM (Maha Deeparadhana)";

              const naivedhyam = customSetting?.useStandardNaivedhyam === false && customSetting.customNaivedhyam
                ? customSetting.customNaivedhyam
                : selectedDay.suggestedOfferings;

              const prasadam = customSetting?.useStandardPrasadam === false && customSetting.customPrasadam
                ? customSetting.customPrasadam
                : "Sacred Pongali & Theertha Prasadam distributed to all visiting devotees";

              const itemsToBring = customSetting?.useStandardItems === false && customSetting.customItemsToBring
                ? customSetting.customItemsToBring
                : selectedDay.suggestedItems;

              return (
                <div className="space-y-2.5 text-xs">
                  {/* Pooja Timings */}
                  <div className="p-3 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-[#8B1E1E]" />
                      {t.poojaTimingsAt} {mandapam.name}
                    </span>
                    <p className="text-stone-800 font-semibold leading-relaxed">
                      {renderHighlightedTiming(poojaTimings)}
                    </p>
                  </div>

                  {/* Naivedhyam (Bhog) & Prasadam */}
                  <div className="p-3.5 rounded-2xl bg-white border border-amber-200/90 shadow-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5 uppercase text-[10.5px] tracking-wider font-sans">
                        <PrasadBowlIcon className="w-4 h-4 text-[#D97706] shrink-0" />
                        {t.suggestedNaivedhyam}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        భోగ్ నైవేద్యం
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2 text-stone-800">
                        <Utensils className="w-3.5 h-3.5 text-[#B45309] shrink-0 mt-0.5" />
                        <p className="font-medium leading-relaxed">
                          {naivedhyam}
                        </p>
                      </div>

                      <div className="flex items-start gap-2 text-[11px] text-stone-700 bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
                        <Gift className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          <strong className="text-amber-950">{t.prasadamDistribution}</strong> {prasadam}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items to Bring for Devotees */}
                  <div className="p-3.5 rounded-2xl bg-white border border-amber-200/90 shadow-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5 uppercase text-[10.5px] tracking-wider font-sans">
                        <ShoppingBag className="w-4 h-4 text-[#8B1E1E] shrink-0" />
                        {t.suggestedPoojaItems}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#8B1E1E] border border-rose-200">
                        భక్తులు తేవలసినవి
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-stone-700 leading-relaxed">
                      <Flower2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <p className="font-medium text-stone-800">
                        {itemsToBring}
                      </p>
                    </div>
                  </div>

                  {/* Sacred Sloka */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-1.5 text-center">
                    <span className="text-[10px] font-serif font-bold text-amber-900 uppercase tracking-wider block">
                      {t.sacredSloka}
                    </span>
                    <p className="font-serif font-bold text-[#8B1E1E] text-xs leading-relaxed">
                      {selectedDay.sacredChanting.sloka}
                    </p>
                    <p className="text-[11px] font-mono text-stone-700 pt-1">
                      {selectedDay.sacredChanting.moolaMantra}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Pooja Slot Guidance Notice */}
            <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-300/80 text-[11px] text-amber-950 flex items-start gap-2.5">
              <span className="text-base shrink-0">🪔</span>
              <div className="space-y-0.5 leading-relaxed">
                <p className="font-bold text-[#8B1E1E]">
                  {t.poojaSlotNoticeTitle}
                </p>
                <p className="text-stone-700">
                  {t.poojaSlotNoticeBody}
                </p>
              </div>
            </div>

            {/* Pop-up Action Buttons */}
            <div className="flex gap-2 pt-1">
              {mandapamServices.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay(null);
                    setSelectedServiceId(undefined);
                    setBookingModalOpen(true);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{t.bookPoojaSlotBtn}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="flex-1 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-colors"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ACTIVITY REGISTRATION MODAL */}
      {/* ============================================================ */}
      {regModalOpen && regActivity && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#FDFBF7] text-[#221A14] w-full max-w-md rounded-3xl p-6 shadow-2xl border-2 border-amber-400 relative my-6 space-y-4">
            <button
              onClick={() => setRegModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {regSuccessTicket ? (
              /* Success Confirmation Card */
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-serif font-bold text-amber-900">
                    ॥ శ్రీ మాత్రే నమః ॥
                  </span>
                  <h3 className="font-serif font-black text-2xl text-[#8B1E1E]">
                    {t.registrationConfirmed}
                  </h3>
                  <p className="text-xs text-stone-600">
                    {t.registrationConfirmedMsg} {regActivity.title} at {mandapam.name}.
                  </p>
                </div>

                {/* Ticket Details */}
                <div className="p-4 rounded-2xl bg-white border border-amber-300 text-left text-xs space-y-2 shadow-xs">
                  <div className="flex justify-between border-b border-amber-100 pb-2">
                    <span className="text-stone-500 font-medium">{t.registrationIdLabel}</span>
                    <span className="font-mono font-bold text-[#8B1E1E]">{regSuccessTicket.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">{t.participantNameLabel}</span>
                    <span className="font-bold text-stone-900">{regSuccessTicket.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">{t.eventDateTimeLabel}</span>
                    <span className="font-bold text-stone-900">{regActivity.date} • {regActivity.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">{t.totalParticipantsLabel}</span>
                    <span className="font-bold text-stone-900">{regSuccessTicket.count}</span>
                  </div>
                  {regActivity.location && (
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">{t.locationLabel}</span>
                      <span className="font-bold text-stone-900">{regActivity.location}</span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  {t.arriveEarlyNotice}
                </p>

                <button
                  type="button"
                  onClick={() => setRegModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C] shadow-md transition-colors"
                >
                  {t.doneBackBtn}
                </button>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmitActivityReg} className="space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B1E1E]" />
                    <span>{t.freeEventRegistration}</span>
                  </div>
                  <h3 className="font-serif font-black text-xl text-[#8B1E1E] mt-0.5">
                    {regActivity.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    {regActivity.date} • {regActivity.startTime} at {mandapam.name}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      {t.participantFullName}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar / Sai Krishna"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      {t.whatsappMobile}
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9848012345"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        {t.categoryAge}
                      </label>
                      <select
                        value={regCategory}
                        onChange={(e) => setRegCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 text-xs"
                      >
                        <option value="Children (<14 yrs)">Children (&lt;14 yrs)</option>
                        <option value="Youth (15-25 yrs)">Youth (15-25 yrs)</option>
                        <option value="Women / Mahila">Women / Mahila</option>
                        <option value="Family / Group">Family / Group</option>
                        <option value="Open / All Ages">Open / All Ages</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        {t.noOfParticipants}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={regCount}
                        onChange={(e) => setRegCount(parseInt(e.target.value) || 1)}
                        className="w-full p-2.5 rounded-xl bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      {t.specialNotes}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any additional info or competition queries..."
                      value={regNotes}
                      onChange={(e) => setRegNotes(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-md transition-colors"
                  >
                    {t.confirmRegistration}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegModalOpen(false)}
                    className="py-3 px-4 rounded-xl bg-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-300 transition-colors"
                  >
                    {t.cancelBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SERVICE BOOKING MODAL */}
      <ServiceBookingModal
        mandapam={mandapam}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedServiceId={selectedServiceId}
      />

      {/* MANDAPAM QR STANDEE MODAL */}
      <ShareQrModal
        mandapam={mandapam}
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />

      {/* MANDAPAM BACKGROUND CUSTOMIZATION MODAL */}
      {bgModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FFFDF9] rounded-3xl border-2 border-amber-400 shadow-2xl p-5 sm:p-6 space-y-4 my-8 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-[#8B1E1E]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-[#8B1E1E]">
                    Mandapam Card Background
                  </h3>
                  <p className="text-[11px] text-stone-600 font-medium">
                    Add your mandapam photo or select a sacred backdrop
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBgModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Interactive Preview */}
            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1.5 flex items-center justify-between">
                <span>Card Live Preview</span>
                {bgPreviewUrl && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Preview Active
                  </span>
                )}
              </label>
              <div className="relative rounded-2xl border-2 border-amber-300 overflow-hidden shadow-inner p-4 bg-[#FDFBF7] min-h-[110px] flex flex-col justify-center">
                {bgPreviewUrl ? (
                  <div className="absolute inset-0 pointer-events-none">
                    <img
                      src={bgPreviewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-50/96 via-amber-50/90 to-amber-50/85 backdrop-blur-[1px]" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/90 to-amber-100/40" />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 border-2 border-amber-400 p-0.5 shrink-0 overflow-hidden shadow-sm">
                    <img
                      src={mandapam.logoUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg")}
                      alt="Logo"
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-black text-base text-[#8B1E1E] truncate">
                      {mandapam.name}
                    </h4>
                    <p className="text-[11px] text-stone-600 truncate">
                      {mandapam.address}, {mandapam.city}
                    </p>
                    <span className="inline-block text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md mt-0.5">
                      Annual Community Navaratri Utsav
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 1: Upload from Phone / Computer */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-amber-950 flex items-center justify-between">
                <span>1. Upload from Device or Camera</span>
                <span className="text-[10px] text-amber-700 font-normal">JPG, PNG, WebP</span>
              </label>

              <label className="cursor-pointer border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-100/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-amber-200/80 group-hover:scale-110 flex items-center justify-center text-[#8B1E1E] mb-1.5 transition-transform shadow-xs">
                  {isUploading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-bold text-amber-950 group-hover:text-[#8B1E1E]">
                  {isUploading ? "Optimizing image..." : "Tap to Choose Mandapam Photo or Camera"}
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  Takes photos directly from your phone camera or gallery
                </span>
              </label>
            </div>

            {/* Option 2: Image URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-amber-950">
                2. Or Enter Image Web Link (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/mandapam-photo.jpg"
                  value={bgInputUrl}
                  onChange={(e) => {
                    setBgInputUrl(e.target.value);
                    if (e.target.value.trim()) {
                      setBgPreviewUrl(e.target.value.trim());
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (bgInputUrl.trim()) {
                      setBgPreviewUrl(bgInputUrl.trim());
                      toast.info("Preview loaded!");
                    } else {
                      toast.error("Please enter a valid image URL");
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Preview
                </button>
              </div>
            </div>

            {/* Option 3: Curated Sacred Presets */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-amber-950">
                3. Or Choose a Sacred Devotional Backdrop
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_MANDAPAM_BACKGROUNDS.map((preset) => {
                  const isSelected = bgPreviewUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setBgPreviewUrl(preset.url)}
                      className={`relative rounded-xl overflow-hidden border-2 p-1 text-left transition-all group cursor-pointer ${
                        isSelected
                          ? "border-[#8B1E1E] ring-2 ring-amber-400 bg-amber-100"
                          : "border-amber-200 hover:border-amber-400 bg-white"
                      }`}
                    >
                      <div className="h-12 w-full rounded-lg overflow-hidden bg-stone-100 relative">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center text-[9px] shadow">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-stone-800 truncate mt-1">
                        {preset.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Also apply to cover banner checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-stone-700 font-medium select-none">
              <input
                type="checkbox"
                checked={alsoApplyToCover}
                onChange={(e) => setAlsoApplyToCover(e.target.checked)}
                className="rounded border-amber-300 text-[#8B1E1E] focus:ring-amber-500 w-4 h-4"
              />
              <span>Also apply to the Hero Banner on top</span>
            </label>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-amber-200">
              {customCardBg ? (
                <button
                  type="button"
                  onClick={handleResetBg}
                  className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBgModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyBg()}
                  disabled={!bgPreviewUrl && !bgInputUrl}
                  className="px-5 py-2.5 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Background</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

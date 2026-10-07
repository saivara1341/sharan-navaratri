import { navaratriAsset } from "../utils/navaratriAssets";
import { getMandapamDirectionsUrl } from "../utils/mandapamMaps";
import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
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
import { DandiyaIcon } from "../components/devotional/DandiyaIcon";
import { HomaKundaIcon, isHomamEvent } from "../components/devotional/HomaKundaIcon";
import {
  getTranslatedMandapamName,
  getTranslatedAddress,
  getTranslatedOrganizerLabels,
  getTranslatedActivity,
  getTranslatedService,
  getTranslatedSlotUI,
  formatLocalizedDateShort,
  DEVI_DAYS_LOCALIZED,
  TITHI_LOCALIZED,
  INVOCATION_TRANSLATIONS
} from "../utils/navaratriTranslations";
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
  Image as ImageIcon,
  Lock
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
  const [searchParams] = useSearchParams();
  const {
    mandapams,
    alankaranas,
    daySettings,
    services,
    slots,
    activities,
    announcements,
    toggleFollow,
    isFollowing,
    markScanned,
    updateMandapam,
    createBooking
  } = useNavaratriData();
  const { t, language } = useNavaratriLanguage();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Committee logo is organizer-managed. The public hero uses one shared
  // festival cover so an idol/branding upload never becomes a page background.
  const [customLogo, setCustomLogo] = useState<string>("");

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

  // Public QR/share links must resolve only to their exact Mandapam.
  const mandapam =
    mandapams.find(
      m => (m.slug && m.slug.toLowerCase() === normalizedSlug) ||
           (m.id && m.id.toLowerCase() === normalizedSlug)
    );

  const following = mandapam ? isFollowing(mandapam.id) : false;

  // A card or shared URL visit must not appear as a QR scan. QR posters and the
  // in-app scanner explicitly add source=qr.
  useEffect(() => {
    if (mandapam?.id && searchParams.get("source") === "qr") {
      markScanned(mandapam.id);
    }
    document.title = "Sharan Navaratri";
  }, [mandapam?.id, markScanned, searchParams]);

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

  // 4 Standard Poojas as requested by devotees & committee if not customized yet
  const DEFAULT_MANDAPAM_SERVICES: Service[] = [
    {
      id: `srv-${mandapam.id}-sahasranama`,
      mandapamId: mandapam.id,
      name: "Sri Durga Devi Sahasranama Archana",
      type: "POOJA",
      durationMinutes: 45,
      description: "Sacred 1008 divine names archana with fresh red kumkum, bilva, and fragrant flowers for family well-being.",
      itemsRequired: "Coconuts, Betel leaves, Fresh flower garland, Bananas",
      enabled: true,
      bookingEnabled: true,
      capacityPerSlot: 150,
      targetAudience: "COUPLES",
      targetAudienceLabel: "Couples / Pairs (దంపతులు)"
    },
    {
      id: `srv-${mandapam.id}-kumkumarchana`,
      mandapamId: mandapam.id,
      name: "Sri Lalitha Sahasranama Kumkumarchana",
      type: "KUMKUMARCHANA",
      durationMinutes: 30,
      description: "Special women's sacred Kumkuma puja invoking Maa Durga's divine protection and prosperity.",
      itemsRequired: "Pure Sindoor/Kumkum, Fresh jasmine flowers, Turmeric",
      enabled: true,
      bookingEnabled: true,
      capacityPerSlot: 150,
      targetAudience: "FEMALES_ONLY",
      targetAudienceLabel: "Only Females / Suhasinis (స్త్రీలు / సువాసినులు)"
    },
    {
      id: `srv-${mandapam.id}-harathi`,
      mandapamId: mandapam.id,
      name: "Maha Deeparadhana & Harathi Darshan Pass",
      type: "HARATHI",
      durationMinutes: 20,
      description: "Priority sanctum darshan during the divine evening Maha Mangala Harathi and sacred prasad distribution.",
      itemsRequired: "Devotion and sacred offerings",
      enabled: true,
      bookingEnabled: true,
      capacityPerSlot: 150,
      targetAudience: "ALL",
      targetAudienceLabel: "All Devotees & Families"
    },
    {
      id: `srv-${mandapam.id}-homa`,
      mandapamId: mandapam.id,
      name: "Chandi Parayanam & Homa Sankalpam",
      type: "HOMA",
      durationMinutes: 60,
      description: "Special sankalpam during the holy Navaratri Chandi Homam conducted by Vedic priests.",
      itemsRequired: "Gotram, Family names, Homa samagri",
      enabled: true,
      bookingEnabled: true,
      capacityPerSlot: 150,
      targetAudience: "COUPLES",
      targetAudienceLabel: "Couples / Parties (దంపతులు)"
    }
  ];

  // Do not recreate sample Poojas after an organizer removes their last one.
  // An empty list is an accurate public state.
  const effectiveServices = mandapamServices;

  const effectiveActivities = mandapamActivities.filter(
    (act) =>
      !act.title?.toLowerCase().includes("dandiya utsav & bhajans") &&
      !act.id?.includes("dandiya") &&
      !act.id?.includes("chandi-homam")
  );

  const DEFAULT_MANDAPAM_ANNOUNCEMENTS = [
    {
      id: `ann-${mandapam.id}-default`,
      mandapamId: mandapam.id,
      title: "Divine Navaratri 2026 Celebrations",
      message: `Welcome all devotees to ${mandapam.name}! Join us daily for sacred Maa Darshan, Annadanam, and Evening Maha Harathi. Free Pooja booking passes are available online.`,
      priority: "HIGH" as const,
      published: true,
      createdAt: new Date().toISOString()
    }
  ];

  const effectiveAnnouncements = mandapamAnnouncements.length > 0 ? mandapamAnnouncements : DEFAULT_MANDAPAM_ANNOUNCEMENTS;

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
        text: `Check out 10-Day Alankaranas, Pooja Timings & Activities for ${mandapam.name}:`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Mandapam link copied to clipboard!");
    }
  };

  // Synchronize only the committee logo from localStorage or the Mandapam record.
  useEffect(() => {
    if (mandapam?.id) {
      const storedLogo = localStorage.getItem(`mandapam_logo_${mandapam.id}`) || mandapam.logoUrl || "";
      setCustomLogo(storedLogo);
    }
  }, [mandapam?.id, mandapam?.logoUrl]);

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

    createBooking({
      mandapamId: mandapam.id,
      name: regName.trim(),
      mobile: cleanMobile,
      quantity: regCount,
      notes: `[Activity: ${regActivity.title}] ${regCategory ? `Category: ${regCategory}. ` : ""}${regNotes.trim()}`.trim()
    });

    setRegSuccessTicket(regRecord);
    toast.success(`Registration Confirmed for ${regActivity.title}!`);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* 1. MANDAPAM HERO & PROFILE */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-300 shadow-xl bg-white">
        {/* Cover Photo */}
        <div className="h-48 sm:h-64 w-full relative bg-[#8B1E1E]">
          <img
            src={navaratriAsset("/navaratri/assets/royal-temple-gold-sanctum.jpg")}
            alt="Sharan Navaratri royal temple festival cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Quick Actions (Top Right) */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={() => setQrModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-stone-900 text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors backdrop-blur-sm cursor-pointer"
              title="View & Print Mandapam QR Standee"
            >
              <QrCode className="w-3.5 h-3.5 text-[#8B1E1E]" />
              <span className="hidden xs:inline">Mandapam QR</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/95 hover:bg-white text-stone-900 shadow-md transition-colors backdrop-blur-sm cursor-pointer"
              title="Share Mandapam"
            >
              <Share2 className="w-4 h-4 text-stone-800" />
            </button>
          </div>
        </div>

        {/* Profile Card with clean warm devotional color background */}
        <div className="relative -mt-10 mx-3 sm:mx-5 rounded-2xl border-2 border-amber-300/90 shadow-xl mb-3 overflow-hidden p-4 sm:p-6 transition-all bg-gradient-to-br from-[#FFFDF9] via-[#FCF8EE] to-[#FFF5EB]">
          <div className="relative z-10">
            {/* Top row */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-amber-200/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  Mandapam Profile
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                🏛️ Official Mandapam
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden relative group">
                  <img
                    src={customLogo || mandapam.logoUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg")}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h1 className="font-serif font-black text-xl sm:text-2xl text-[#8B1E1E] flex items-center gap-1.5 leading-snug drop-shadow-xs">
                      <span>{getTranslatedMandapamName(mandapam.name, language)}</span>
                      <InstagramVerifiedBadge className="w-5 h-5 shrink-0 drop-shadow-xs" title="Official Verified Mandapam" />
                    </h1>
                  </div>

                  <p className="text-xs text-stone-700 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{getTranslatedAddress(mandapam.address, language)}, {mandapam.area}, {mandapam.city}</span>
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
                  href={getMandapamDirectionsUrl(mandapam)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-stone-800 border border-amber-300 text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#8B1E1E]" />
                  <span>{t.directions}</span>
                </a>

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

            {/* Organizer / Committee Details (If shared for public view) */}
            {(mandapam.showOrganizerPublicly !== false) && (mandapam.organizerName || mandapam.organizerMobile || mandapam.contactPhone) && (() => {
              const orgLabels = getTranslatedOrganizerLabels(language);
              const transName = getTranslatedMandapamName(mandapam.name, language);
              return (
                <div className="mt-4 pt-3.5 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/85 p-3.5 rounded-2xl border border-amber-200 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#B45309] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                      <Users className="w-4 h-4 text-amber-200" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                          {orgLabels.committee}
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                          {orgLabels.contactBadge}
                        </span>
                      </div>
                      <p className="font-serif font-bold text-xs sm:text-sm text-[#8B1E1E]">
                        {mandapam.organizerName || orgLabels.leadRole}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    {(mandapam.organizerMobile || mandapam.contactPhone) && (
                      <a
                        href={`tel:${mandapam.organizerMobile || mandapam.contactPhone}`}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-emerald-900 border border-emerald-300 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                        title={orgLabels.callBtn}
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{mandapam.organizerMobile || mandapam.contactPhone}</span>
                      </a>
                    )}

                    {(mandapam.whatsappNumber || mandapam.organizerMobile) && (
                      <a
                        href={`https://wa.me/91${(mandapam.whatsappNumber || mandapam.organizerMobile).replace(/\D/g, "")}?text=${encodeURIComponent(`${orgLabels.greeting} (${transName})`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                        title={orgLabels.whatsappBtn}
                      >
                        <span>{orgLabels.whatsappBtn}</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* 2. LIVE MANDAPAM NOTICE BOARD */}
      {effectiveAnnouncements.length > 0 && (
        <section className="relative overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-white via-[#FFFDF7] to-amber-50 p-4 shadow-lg sm:p-5">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#8B1E1E] via-amber-500 to-[#8B1E1E]" />
          <div className="mb-3 flex items-center gap-2 border-b border-amber-200 pb-3 pt-1">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#8B1E1E] text-lg shadow-sm">📢</span>
            <div>
              <h3 className="font-serif text-lg font-black text-[#8B1E1E]">{t.noticeBoard}</h3>
              <p className="text-[11px] font-semibold text-emerald-800">● Live updates from the Mandapam committee</p>
            </div>
          </div>
          <div className="space-y-2">
            {effectiveAnnouncements.map((ann) => (
              <article key={ann.id} className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs shadow-sm">
                <h4 className="text-sm font-black text-[#8B1E1E]">{ann.title}</h4>
                <p className="mt-1 leading-relaxed text-stone-700">{ann.message}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 3. 10-DAY FESTIVAL BUTTONS (2 ROWS ON MOBILE, NO SCROLL) */}
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
            const deviInfo = DEVI_DAYS_LOCALIZED[day.dayNumber]?.[language];
            const deviDisplayName = customSetting?.customDeviName || (
              deviInfo?.fullName || (language === "te" ? day.teluguDeviName : language === "hi" ? day.hindiDeviName : day.deviName)
            );
            const shortDeviName = customSetting?.customDeviName
              ? getShortAvatar(customSetting.customDeviName)
              : (deviInfo?.shortName || getShortAvatar(deviDisplayName));
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
                  {formatLocalizedDateShort(day.date, language)}
                </span>

                {/* Short Devi Name */}
                <span className={`text-[7px] sm:text-[8.5px] truncate max-w-full font-medium leading-tight px-0.5 ${isToday ? "text-amber-100" : "text-stone-500"}`}>
                  {shortDeviName}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. MANDAPAM ACTIVITIES & COMPETITIONS (With Registration Action) */}
      <section className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <DandiyaIcon className="w-6 h-6 text-[#8B1E1E]" />
              <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
                {t.activitiesTitle}
              </h3>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              {getTranslatedMandapamName(mandapam.name, language)} • {t.activitiesSubtitle}
            </p>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 self-start sm:self-center">
            {effectiveActivities.length} {t.eventsLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {effectiveActivities.map((act) => {
            const transAct = getTranslatedActivity(act, language);
            const isHomam = isHomamEvent(act);
            return (
              <div
                key={act.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 uppercase flex items-center gap-1.5">
                      {isHomam && <HomaKundaIcon className="w-4 h-4 inline-block" />}
                      <span>{transAct.category}</span>
                    </span>
                    <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#8B1E1E]" />
                      {transAct.date}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-[#8B1E1E] leading-snug flex items-center gap-2">
                    {isHomam && <HomaKundaIcon className="w-6 h-6 shrink-0" />}
                    <span>{transAct.title}</span>
                  </h4>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {transAct.description}
                  </p>

                  <div className="space-y-1 pt-1 text-[11px] text-stone-600">
                    <div className="flex items-center gap-1.5 font-medium text-stone-800">
                      <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{t.timeLabel} {transAct.startTime} {transAct.endTime ? `– ${transAct.endTime}` : ""}</span>
                    </div>
                    {transAct.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{t.locationLabel} {transAct.location}</span>
                      </div>
                    )}
                    {transAct.instructions && (
                      <div className="flex items-start gap-1.5 text-amber-900 bg-amber-50/80 p-2 rounded-xl border border-amber-200/60 mt-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>{transAct.instructions}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Registration Action Button */}
                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {act.fee && act.fee.trim() && act.fee.toLowerCase() !== "free" && act.fee !== "0"
                      ? (act.fee.startsWith("₹") ? `Entry Fee: ${act.fee}` : `Entry Fee: ₹${act.fee}`)
                      : t.freeEntry}
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
            );
          })}
        </div>
      </section>

      {/* 5. MANDAPAM AVAILABLE POOJAS & SEVAS (If enabled) */}
      {effectiveServices.length > 0 && (
        <section className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <HomaKundaIcon className="w-6 h-6 shrink-0" />
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
            {effectiveServices.map((srv) => {
              const transSrv = getTranslatedService(srv, language);
              const isHomam = isHomamEvent(srv);
              return (
                <div
                  key={srv.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-[#8B1E1E] uppercase flex items-center gap-1">
                          {isHomam && <HomaKundaIcon className="w-3.5 h-3.5" />}
                          <span>{transSrv.type}</span>
                        </span>
                        {srv.targetAudience && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {srv.targetAudience === "COUPLES"
                              ? "👫 For Couples (దంపతులు)"
                              : srv.targetAudience === "FEMALES_ONLY"
                              ? "🌸 Only Females (స్త్రీలు)"
                              : "🙏 All Devotees"}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-500 font-medium">
                        {srv.durationMinutes} {t.minsLabel}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#8B1E1E] flex items-center gap-2">
                      {isHomam && <HomaKundaIcon className="w-5 h-5 shrink-0" />}
                      <span>{transSrv.name}</span>
                    </h4>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {transSrv.description}
                    </p>
                    {transSrv.itemsRequired && (
                      <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200/60">
                        <strong>{t.itemsToBringLabel}</strong> {transSrv.itemsRequired}
                      </p>
                    )}
                  </div>

                  {(() => {
                    const srvSlots = slots.filter((s) => s.serviceId === srv.id && s.mandapamId === mandapam.id);
                    const totalCap = srvSlots.length > 0
                      ? srvSlots.reduce((acc, s) => acc + s.capacity, 0)
                      : srv.capacityPerSlot || 150;
                    const totalBooked = srvSlots.reduce((acc, s) => acc + s.bookedCount + s.walkinCount, 0);
                    const isFull = totalCap > 0 && totalBooked >= totalCap;
                    const remainingSlots = Math.max(0, totalCap - totalBooked);
                    const slotUI = getTranslatedSlotUI(language, remainingSlots, totalBooked, totalCap);

                    return (
                      <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2">
                        {isFull ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-[11px] font-black uppercase tracking-wide">
                            <Lock className="w-3.5 h-3.5 text-red-700" />
                            <span>{slotUI.badge}</span>
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{slotUI.leftText}</span>
                          </span>
                        )}

                        {isFull ? (
                          <button
                            type="button"
                            disabled
                            className="px-4 py-2 rounded-xl bg-stone-200 text-stone-500 text-xs font-bold cursor-not-allowed border border-stone-300 shadow-none flex items-center gap-1.5"
                          >
                            <Lock className="w-3.5 h-3.5 text-stone-400" />
                            <span>{slotUI.buttonFull}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedServiceId(srv.id);
                              setBookingModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C] shadow-sm transition-colors cursor-pointer"
                          >
                            {slotUI.bookBtn}
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* DAY POP-UP CARD MODAL (Opened upon tapping any of the 10 buttons) */}
      {/* ============================================================ */}
      {selectedDay && (
        <div className="fixed inset-x-0 bottom-0 top-[106px] z-40 flex items-start justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm animate-in fade-in sm:top-[112px] sm:p-4">
          <div className="relative my-auto w-full max-w-lg max-h-[calc(100dvh-7.5rem)] overflow-y-auto rounded-3xl border-2 border-amber-400 bg-[#FDFBF7] p-5 text-[#221A14] shadow-2xl space-y-4 sm:max-h-[calc(100dvh-8rem)] sm:p-6">
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
              const deviInfo = DEVI_DAYS_LOCALIZED[selectedDay.dayNumber]?.[language];
              const selectedDayDeviName = mandapamDaySettings.find(s => s.dayNumber === selectedDay.dayNumber)?.customDeviName || (
                deviInfo?.fullName || (language === "te" ? selectedDay.teluguDeviName : language === "hi" ? selectedDay.hindiDeviName : selectedDay.deviName)
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
                      {language === "en" ? selectedDay.teluguDeviName : selectedDay.deviName}
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
              const deviInfo = DEVI_DAYS_LOCALIZED[selectedDay.dayNumber]?.[language];
              const morning = customSetting?.morningDeviName || deviInfo?.morning || selectedDay.dualSessionNote?.morningAlankarana;
              const evening = customSetting?.eveningDeviName || deviInfo?.evening || selectedDay.dualSessionNote?.eveningAlankarana;

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
                ? (language === "kn" ? "ಬೆಳಗ್ಗೆ 07:30 AM (ಕಲಶ ಮತ್ತು ಗಣಪತಿ ಸ್ಥಾಪನೆ) | ಸಂಜೆ 06:30 PM (ಮಹಾ ಹಾರತಿ)" :
                   language === "te" ? "ఉదయం 07:30 AM (కలశ & గణపతి స్థాపన) | సాయంత్రం 06:30 PM (మహా హారతి)" :
                   language === "hi" ? "प्रातः 07:30 AM (कलश व गणपति स्थापना) | सायं 06:30 PM (महा आरती)" :
                   language === "ta" ? "காலை 07:30 AM (கலச & கணபதி ஸ்தாபனம்) | மாலை 06:30 PM (மஹா ஆரத்தி)" :
                   language === "ml" ? "രാവിലെ 07:30 AM (കലശ & ഗണപതി സ്ഥാപനം) | വൈകുന്നേരം 06:30 PM (മഹാ ആരതി)" :
                   "Morning 07:30 AM (Kalash & Ganapathi Sthapana) | Evening 06:30 PM (Maha Harathi)")
                : (language === "kn" ? "ಬೆಳಗ್ಗೆ 08:00 AM (ಸಹಸ್ರನಾಮ ಅರ್ಚನೆ) | ಸಂಜೆ 06:30 PM (ಮಹಾ ದೀಪಾರಾಧನೆ)" :
                   language === "te" ? "ఉదయం 08:00 AM (సహస్రనామ అర్చన) | సాయంత్రం 06:30 PM (మహా దీపారాధన)" :
                   language === "hi" ? "प्रातः 08:00 AM (सहस्रनाम अर्चना) | सायं 06:30 PM (महा दीपाराधना)" :
                   language === "ta" ? "காலை 08:00 AM (சஹஸ்ரநாம அர்ச்சனை) | மாலை 06:30 PM (மகா தீபாராதனை)" :
                   language === "ml" ? "രാവിലെ 08:00 AM (സഹസ്രനാമ അർച്ചന) | വൈകുന്നേരം 06:30 PM (മഹാ ദീപാരാധന)" :
                   "Morning 08:00 AM (Sahasranama Archana) | Evening 06:30 PM (Maha Deeparadhana)");

              const naivedhyam = customSetting?.useStandardNaivedhyam === false && customSetting.customNaivedhyam
                ? customSetting.customNaivedhyam
                : selectedDay.suggestedOfferings;

              const prasadam = customSetting?.useStandardPrasadam === false && customSetting.customPrasadam
                ? customSetting.customPrasadam
                : (language === "kn" ? "ಮಂಟಪಕ್ಕೆ ಭೇಟಿ ನೀಡುವ ಎಲ್ಲಾ ಭಕ್ತರಿಗೂ ಪಾವನ ಪೊಂಗಲ್ ಮತ್ತು ತೀರ್ಥ ಪ್ರಸಾದ ವಿತರಿಸಲಾಗುತ್ತದೆ" :
                   language === "te" ? "దర్శనానికి విచ్చేసిన భక్తులందరికీ పవిత్ర పొంగలి మరియు తీర్థ ప్రసాద వితరణ" :
                   language === "hi" ? "दर्शन हेतु पधारने वाले सभी भक्तों को पवित्र पोंगल व तीर्थ प्रसाद वितरण" :
                   language === "ta" ? "தரிசனத்திற்கு வரும் அனைத்து பக்தர்களுக்கும் புனித பொங்கல் மற்றும் தீர்த்த பிரசாதம் வழங்கப்படும்" :
                   language === "ml" ? "ദർശനത്തിനെത്തുന്ന എല്ലാ ഭക്തർക്കും പവിത്ര പൊങ്കലും തീർത്ഥ പ്രസാദവും വിതരണം ചെയ്യുന്നു" :
                   "Sacred Pongali & Theertha Prasadam distributed to all visiting devotees");

              const itemsToBring = customSetting?.useStandardItems === false && customSetting.customItemsToBring
                ? customSetting.customItemsToBring
                : selectedDay.suggestedItems;

              const naivedhyamTag = language === "te" ? "భోగ్ నైవేద్యం" : language === "hi" ? "भोग नैवेद्यम्" : language === "kn" ? "ಭೋಗ ನೈವೇದ್ಯ" : language === "ta" ? "போக் நைவேத்யம்" : language === "ml" ? "ഭോഗ് നൈവേദ്യം" : "Bhog Naivedhyam";
              const itemsTag = language === "te" ? "భక్తులు తేవలసినవి" : language === "hi" ? "भक्तों द्वारा सामग्री" : language === "kn" ? "ಭಕ್ತರು ತರಬೇಕಾದವು" : language === "ta" ? "பக்தர்கள் கொண்டுவர வேண்டியவை" : language === "ml" ? "ഭക്തർ കൊണ്ടുവരേണ്ടവ" : "Items to Bring";

              return (
                <div className="space-y-2.5 text-xs">
                  {/* Pooja Timings */}
                  <div className="p-3 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-[#8B1E1E]" />
                      {t.poojaTimingsAt} {getTranslatedMandapamName(mandapam.name, language)}
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
                        {naivedhyamTag}
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
                        {itemsTag}
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
                  className="flex-1 py-3 rounded-2xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-[10px] sm:text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1 min-w-0"
                >
                  <Flame className="w-3 h-3 shrink-0" />
                  <span className="whitespace-nowrap">{t.bookPoojaSlotBtn}</span>
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
                    {INVOCATION_TRANSLATIONS[language]}
                  </span>
                  <h3 className="font-serif font-black text-2xl text-[#8B1E1E]">
                    {t.registrationConfirmed}
                  </h3>
                  <p className="text-xs text-stone-600">
                    {t.registrationConfirmedMsg} {getTranslatedActivity(regActivity, language).title} at {getTranslatedMandapamName(mandapam.name, language)}.
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
                      <span className="font-bold text-stone-900">{getTranslatedActivity(regActivity, language).location || regActivity.location}</span>
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
                    <DandiyaIcon className="w-3.5 h-3.5 text-[#8B1E1E]" />
                    <span>{t.freeEventRegistration}</span>
                  </div>
                  <h3 className="font-serif font-black text-xl text-[#8B1E1E] mt-0.5">
                    {getTranslatedActivity(regActivity, language).title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    {regActivity.date} • {regActivity.startTime} at {getTranslatedMandapamName(mandapam.name, language)}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      {t.participantFullName.replace(/\s*\*$/, "")}{" "}
                      <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Your Name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      {t.whatsappMobile.replace(/\s*\*$/, "")}{" "}
                      <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. Your Number (10 digits)"
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

    </div>
  );
};

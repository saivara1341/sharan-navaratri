import { navaratriAsset } from "../utils/navaratriAssets";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../context/NavaratriLanguageContext";
import { DailyUpdateDrawer } from "../components/organizer/DailyUpdateDrawer";
import { WalkInRegisterModal } from "../components/organizer/WalkInRegisterModal";
import { ShareQrModal } from "../components/citizen/ShareQrModal";
import { STANDARD_NAVARATRI_DAYS } from "../data/standardNavaratriDays";
import { downloadMandapamCredentials, copyToClipboard, getPrivatePasscode } from "../utils/mandapamCredentials";
import { PrasadBowlIcon } from "../components/devotional/PrasadBowlIcon";
import { InstagramVerifiedBadge } from "../components/devotional/InstagramVerifiedBadge";
import { DandiyaIcon } from "../components/devotional/DandiyaIcon";
import { HomaKundaIcon, isHomamEvent } from "../components/devotional/HomaKundaIcon";
import { MandapamGoldIcon } from "../components/devotional/MandapamGoldIcon";
import { Activity } from "../types";
import {
  ShieldCheck,
  Upload,
  Calendar,
  Clock,
  Users,
  Utensils,
  MapPin,
  Bell,
  QrCode,
  CheckSquare,
  AlertTriangle,
  ExternalLink,
  Plus,
  Printer,
  KeyRound,
  Download,
  Copy,
  Eye,
  EyeOff,
  LogOut,
  Lock,
  ArrowRight,
  Trash2,
  AlertOctagon,
  X,
  Music2,
  Flame,
  ShoppingBag,
  Sun,
  Moon,
  CheckCircle2,
  CalendarDays,
  PartyPopper,
  Camera,
  RefreshCw,
  Check,
  Search,
  Ticket,
  Filter,
  Settings,
  Sparkles,
  Phone,
  MessageCircle,
  Image as ImageIcon,
  Crop,
  Maximize2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

export const NavaratriOrganizer: React.FC = () => {
  const navigate = useNavigate();
  const {
    mandapams,
    activeMandapamId,
    setActiveMandapamId,
    alankaranas,
    daySettings,
    bookings,
    slots,
    activities,
    createActivity,
    deleteActivity,
    announcements,
    publishAnnouncement,
    deleteMandapam,
    deleteUserAccount,
    updateMandapam,
    services,
    createService,
    deleteService,
    createSlot,
    deleteSlot,
    updateBookingStatus
  } = useNavaratriData();
  const { t } = useNavaratriLanguage();

  // Authentication State
  const [authenticatedMandapamId, setAuthenticatedMandapamId] = useState<string | null>(() => {
    return sessionStorage.getItem("navaratri_organizer_id") || null;
  });

  // Login Form State
  const [loginInput, setLoginInput] = useState("");
  const [loginPasscode, setLoginPasscode] = useState("");
  const [sessionPasscode, setSessionPasscode] = useState("");
  const [showLoginPasscode, setShowLoginPasscode] = useState(false);
  const [showDashboardPasscode, setShowDashboardPasscode] = useState(false);

  // Active Organizer Tab
  const [activeTab, setActiveTab] = useState<"days" | "events" | "announcements" | "bookings">("days");

  // Modals & Drawers
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [drawerDayNumber, setDrawerDayNumber] = useState(1);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Event Creator Modal State
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState<string>("Special Program");
  const [customCategory, setCustomCategory] = useState("");
  const [eventDate, setEventDate] = useState("2026-10-15");
  const [eventStartTime, setEventStartTime] = useState("06:30 PM");
  const [eventEndTime, setEventEndTime] = useState("09:30 PM");
  const [eventLocation, setEventLocation] = useState("Mandapam Main Stage");
  const [eventDescription, setEventDescription] = useState("");
  const [eventFee, setEventFee] = useState("");
  const [eventBookingEnabled, setEventBookingEnabled] = useState(false);

  // Two-Step Delete Account Modal State
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  // New announcement input
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [annPriority, setAnnPriority] = useState<"NORMAL" | "HIGH">("NORMAL");

  // Mandapam Settings Dropdown State
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Mandapam Branding, Media & Location State
  const [brandingModalOpen, setBrandingModalOpen] = useState(false);
  const [brandingTab, setBrandingTab] = useState<"logo" | "cover" | "location" | "organizer">("logo");
  const [logoPreview, setLogoPreview] = useState("");
  const [logoInputUrl, setLogoInputUrl] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoInputUrl, setPhotoInputUrl] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editArea, setEditArea] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editOrganizerName, setEditOrganizerName] = useState("");
  const [editOrganizerMobile, setEditOrganizerMobile] = useState("");
  const [editWhatsappNumber, setEditWhatsappNumber] = useState("");
  const [showOrganizerPublicly, setShowOrganizerPublicly] = useState(true);
  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const [logoFitMode, setLogoFitMode] = useState<"contain" | "cover">("contain");

  // Booking Slot & Quota State
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [slotTitle, setSlotTitle] = useState("");
  const [slotCategory, setSlotCategory] = useState<"Pooja" | "Lottery / Lucky Draw" | "Dandiya / Garba" | "Daily Pooja" | "Other">("Pooja");
  const [customSlotCategory, setCustomSlotCategory] = useState("");
  const [slotDate, setSlotDate] = useState("2026-10-15");
  const [slotStartTime, setSlotStartTime] = useState("06:00 PM");
  const [slotEndTime, setSlotEndTime] = useState("08:00 PM");
  const [slotCapacity, setSlotCapacity] = useState<number>(4);
  const [slotPrice, setSlotPrice] = useState("0");
  const [slotDescription, setSlotDescription] = useState("");
  const [slotItemsRequired, setSlotItemsRequired] = useState("");

  // Devotee Bookings Search & Filter State
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");
  const [bookingFilterType, setBookingFilterType] = useState<"ALL" | "ONLINE" | "WALK_IN">("ALL");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = loginInput.trim().toLowerCase();
    const cleanPass = loginPasscode.trim();

    if (!cleanId || !cleanPass) {
      toast.error("Please enter your Mandapam ID or Mobile, and passcode.");
      return;
    }

    const matched = mandapams.find((m) => {
      const matchId = m.id.toLowerCase() === cleanId || m.slug.toLowerCase() === cleanId;
      const matchMobile = m.organizerMobile.replace(/\D/g, "") === cleanId.replace(/\D/g, "");
      const matchPhone = m.contactPhone.replace(/\D/g, "") === cleanId.replace(/\D/g, "");
      return matchId || matchMobile || matchPhone;
    });

    if (!matched) {
      toast.error("Mandapam ID or Mobile not found. Check your credentials or register your mandapam.");
      return;
    }

    const expectedPasscode = getPrivatePasscode(matched.id, matched.passcode || "123456");
    if (cleanPass !== expectedPasscode) {
      toast.error("Incorrect passcode. Please check your credentials slip.");
      return;
    }

    setAuthenticatedMandapamId(matched.id);
    setActiveMandapamId(matched.id);
    setSessionPasscode(cleanPass);
    sessionStorage.setItem("navaratri_organizer_id", matched.id);
    toast.success(`Welcome to ${matched.name} Organizer Dashboard!`);
  };

  const handleLogout = () => {
    setAuthenticatedMandapamId(null);
    setSessionPasscode("");
    sessionStorage.removeItem("navaratri_organizer_id");
    setLoginInput("");
    setLoginPasscode("");
    toast.info("Logged out of Mandapam Organizer Portal.");
  };

  // If not authenticated, show Organizer Login Form
  if (!authenticatedMandapamId) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 space-y-6 font-sans">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#8B1E1E] to-[#B45309] text-white flex items-center justify-center shadow-lg border-2 border-amber-300 p-2 overflow-hidden">
            <MandapamGoldIcon className="w-12 h-12 object-contain" />
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#8B1E1E]">
            Mandapam Organizer Portal
          </h1>
          <p className="text-xs text-stone-600">
            Log in with your official Mandapam ID or Registered Mobile number and passcode.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-amber-300 shadow-xl space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Mandapam ID or Registered Mobile *
              </label>
              <input
                type="text"
                required
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="e.g. Mandapam ID or 10-digit Mobile number"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Passcode / PIN *
              </label>
              <div className="relative">
                <input
                  type={showLoginPasscode ? "text" : "password"}
                  required
                  value={loginPasscode}
                  onChange={(e) => setLoginPasscode(e.target.value)}
                  placeholder="Enter 4-6 digit passcode"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none pr-10 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPasscode(!showLoginPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showLoginPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <KeyRound className="w-4 h-4" />
              <span>Login to Mandapam Dashboard →</span>
            </button>
          </form>

          <div className="pt-3 border-t border-amber-200 text-center space-y-2">
            <p className="text-xs text-stone-600">New organizer? Register your committee's mandapam:</p>
            <Link
              to="/navaratri/register"
              className="w-full py-2.5 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-[#8B1E1E] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-98"
            >
              <span>+ Register New Durga Mandapam</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Selected mandapam for authenticated organizer
  const currentMandapam =
    mandapams.find((m) => m.id === authenticatedMandapamId) ||
    mandapams.find((m) => m.id === activeMandapamId) ||
    mandapams[0];

  const mandapamActivities = currentMandapam ? activities.filter((a) => a.mandapamId === currentMandapam.id) : [];
  const mandapamBookings = currentMandapam ? bookings.filter((b) => b.mandapamId === currentMandapam.id) : [];
  const onlineBookingsCount = mandapamBookings.filter((b) => b.bookingType === "ONLINE").length;
  const walkinBookingsCount = mandapamBookings.filter((b) => b.bookingType === "WALK_IN").length;

  const mandapamServices = currentMandapam ? services.filter((s) => s.mandapamId === currentMandapam.id) : [];
  const mandapamSlots = currentMandapam ? slots.filter((s) => s.mandapamId === currentMandapam.id) : [];

  const filteredMandapamBookings = mandapamBookings.filter((b) => {
    const matchesFilter =
      bookingFilterType === "ALL" ||
      (bookingFilterType === "ONLINE" && b.bookingType === "ONLINE") ||
      (bookingFilterType === "WALK_IN" && b.bookingType === "WALK_IN");
    if (!matchesFilter) return false;
    if (!bookingSearchQuery.trim()) return true;

    const q = bookingSearchQuery.toLowerCase().trim();
    const devoteeName = (b.name || "").toLowerCase();
    const devoteeMobile = (b.mobile || "").toLowerCase();
    const bookingCode = (b.bookingCode || "").toLowerCase();
    const srvName = (services.find((s) => s.id === b.serviceId)?.name || "").toLowerCase();
    return devoteeName.includes(q) || devoteeMobile.includes(q) || bookingCode.includes(q) || srvName.includes(q);
  });

  const handleCreateBookingSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTitle.trim()) {
      toast.error("Please enter a title for the booking opening.");
      return;
    }
    const cap = Math.max(1, slotCapacity || 4);
    const finalCategory = slotCategory === "Other" ? (customSlotCategory.trim() || "Special Program") : slotCategory;

    const newSrv = createService({
      mandapamId: currentMandapam.id,
      name: slotTitle.trim(),
      type: finalCategory,
      description: slotDescription.trim() || `${finalCategory} opening with limited quota of ${cap} devotee token(s).`,
      durationMinutes: 60,
      itemsRequired: slotItemsRequired.trim() || undefined,
      enabled: true,
      bookingEnabled: true,
      price: parseInt(slotPrice) || 0,
      date: slotDate,
      timeSlot: `${slotStartTime} - ${slotEndTime}`
    });

    createSlot({
      serviceId: newSrv.id,
      mandapamId: currentMandapam.id,
      date: slotDate,
      startTime: slotStartTime,
      endTime: slotEndTime,
      capacity: cap
    });

    setSlotModalOpen(false);
    setSlotTitle("");
    setCustomSlotCategory("");
    setSlotDescription("");
    setSlotItemsRequired("");
    setSlotCapacity(4);
    toast.success(`Booking slot "${slotTitle}" opened with quota of ${cap} tokens!`);
  };

  const handleDeleteServiceOpening = (srvId: string) => {
    if (window.confirm("Are you sure you want to close and remove this booking opening?")) {
      deleteService(srvId);
      toast.info("Booking opening removed.");
    }
  };

  const handlePrintBookingSlip = (b: (typeof mandapamBookings)[0]) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }
    const srv = services.find((s) => s.id === b.serviceId);
    const srvName = srv ? srv.name : b.bookingType === "WALK_IN" ? "Counter Walk-In Token" : "Navaratri Devotee Pass";
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Token Slip - ${b.bookingCode}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; max-width: 360px; margin: 0 auto; color: #1c1917; }
            .card { border: 2px dashed #b45309; padding: 20px; border-radius: 16px; text-align: center; background: #fffdfa; }
            .title { font-size: 18px; font-weight: 900; color: #8B1E1E; margin-bottom: 4px; }
            .subtitle { font-size: 12px; color: #78350f; font-weight: 700; margin-bottom: 12px; }
            .token-box { background: #fef3c7; border: 2px solid #d97706; padding: 12px; border-radius: 12px; margin: 12px 0; }
            .token-num { font-size: 28px; font-weight: 900; color: #8B1E1E; letter-spacing: 2px; }
            .details { text-align: left; font-size: 12px; line-height: 1.6; margin-top: 12px; border-top: 1px solid #fed7aa; padding-top: 10px; }
            .footer { font-size: 10px; color: #78716c; margin-top: 14px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="title">${currentMandapam.name}</div>
            <div class="subtitle">🪔 NAVARATRI UTSAV 2026 🪔</div>
            <div class="token-box">
              <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #92400e;">Devotee Token Code</div>
              <div class="token-num">${b.bookingCode}</div>
              <div style="font-size: 11px; font-weight: bold; color: #047857;">${b.bookingType === "WALK_IN" ? "Counter Walk-In Token" : "Online Devotee Pass"}</div>
            </div>
            <div class="details">
              <div><strong>Program/Seva:</strong> ${srvName}</div>
              <div><strong>Devotee:</strong> ${b.name} (${b.mobile})</div>
              <div><strong>Persons:</strong> ${b.quantity} Devotee(s)</div>
              <div><strong>Status:</strong> ${b.status}</div>
              <div><strong>Issued:</strong> ${b.createdAt ? new Date(b.createdAt).toLocaleString() : new Date().toLocaleString()}</div>
              ${b.notes ? `<div><strong>Notes:</strong> ${b.notes}</div>` : ""}
            </div>
            <div class="footer">
              Please present this token at the mandapam seva counter.<br/>
              🙏 Sarve Janah Sukhino Bhavantu 🙏
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleOpenDrawerForDay = (dayNum: number) => {
    setDrawerDayNumber(dayNum);
    setUpdateDrawerOpen(true);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate.trim() || !eventStartTime.trim()) {
      toast.error("Please fill in event title, date, and timings.");
      return;
    }

    const finalCategory = (eventCategory === "Other" ? (customCategory.trim() || "Special Program") : eventCategory) as Activity["category"];

    createActivity({
      mandapamId: currentMandapam.id,
      title: eventTitle.trim(),
      category: finalCategory,
      date: eventDate.trim(),
      startTime: eventStartTime.trim(),
      endTime: eventEndTime.trim(),
      location: eventLocation.trim() || "Mandapam Main Stage",
      description: eventDescription.trim(),
      fee: eventFee.trim() || undefined,
      bookingEnabled: eventBookingEnabled,
      published: true
    });

    setEventTitle("");
    setEventDescription("");
    setEventFee("");
    setCustomCategory("");
    setEventModalOpen(false);
    toast.success("Festival event added and published successfully!");
  };

  const handleDeleteAccount = async () => {
    if (!currentMandapam) return;

    const mandapamName = currentMandapam.name;
    const targetId = currentMandapam.id;
    setDeleteStep(0);
    setDeleteConfirmInput("");

    try {
      const success = await deleteUserAccount(targetId);
      if (success) {
        sessionStorage.removeItem("navaratri_organizer_id");
        localStorage.removeItem("navaratri_organizer_id");
        setAuthenticatedMandapamId(null);
        toast.success(`${mandapamName} and all associated data have been permanently deleted.`);
        navigate("/navaratri");
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } catch {
      toast.error("Failed to delete account. Please try again.");
    }
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;

    publishAnnouncement({
      mandapamId: currentMandapam.id,
      title: annTitle.trim(),
      message: annMessage.trim(),
      priority: annPriority,
      published: true
    });

    setAnnTitle("");
    setAnnMessage("");
    toast.success("Mandapam announcement published to all devotee pages!");
  };

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsUploadingPhoto(true);
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
            setPhotoPreview(compressed);
            toast.success("Mandapam photo loaded! Click 'Save Mandapam Photo' below.");
          } else {
            setPhotoPreview(event.target?.result as string);
          }
          setIsUploadingPhoto(false);
        };
        img.onerror = () => {
          setIsUploadingPhoto(false);
          toast.error("Failed to parse image file.");
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingPhoto(false);
      toast.error("Failed to read selected image.");
    }
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsUploadingLogo(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 400;
          let width = img.width;
          let height = img.height;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.9);
            setLogoPreview(compressed);
            toast.success("Mandapam logo loaded! Click 'Save Branding & Media' to apply.");
          } else {
            setLogoPreview(event.target?.result as string);
          }
          setIsUploadingLogo(false);
        };
        img.onerror = () => {
          setIsUploadingLogo(false);
          toast.error("Failed to parse logo file.");
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingLogo(false);
      toast.error("Failed to read logo image.");
    }
  };

  const handleSaveMandapamBranding = async () => {
    if (!currentMandapam) return;
    setIsSavingBranding(true);

    try {
      const finalLogo = logoPreview.trim() || logoInputUrl.trim() || undefined;
      const finalPhoto = photoPreview.trim() || photoInputUrl.trim() || undefined;

      const updates: Partial<Mandapam> = {};

      if (finalLogo) {
        updates.logoUrl = finalLogo;
        localStorage.setItem(`mandapam_logo_${currentMandapam.id}`, finalLogo);
      } else if (!logoPreview && !logoInputUrl && currentMandapam.logoUrl) {
        updates.logoUrl = undefined;
        localStorage.removeItem(`mandapam_logo_${currentMandapam.id}`);
      }

      if (finalPhoto) {
        updates.coverImageUrl = finalPhoto;
        updates.cardBgImageUrl = finalPhoto;
        localStorage.setItem(`mandapam_cover_${currentMandapam.id}`, finalPhoto);
        localStorage.setItem(`mandapam_card_bg_${currentMandapam.id}`, finalPhoto);
      } else if (!photoPreview && !photoInputUrl && currentMandapam.coverImageUrl) {
        updates.coverImageUrl = undefined;
        updates.cardBgImageUrl = undefined;
        localStorage.removeItem(`mandapam_cover_${currentMandapam.id}`);
        localStorage.removeItem(`mandapam_card_bg_${currentMandapam.id}`);
      }

      if (editAddress.trim()) updates.address = editAddress.trim();
      if (editArea.trim()) updates.area = editArea.trim();
      if (editCity.trim()) updates.city = editCity.trim();
      if (editOrganizerName.trim()) updates.organizerName = editOrganizerName.trim();
      if (editOrganizerMobile.trim()) {
        updates.organizerMobile = editOrganizerMobile.trim();
        updates.contactPhone = editOrganizerMobile.trim();
      }
      if (editWhatsappNumber.trim()) updates.whatsappNumber = editWhatsappNumber.trim();
      updates.showOrganizerPublicly = showOrganizerPublicly;

      // 1. Update React state and local storage immediately
      updateMandapam(currentMandapam.id, updates);

      // 2. Persist to Supabase database
      try {
        const payload: any = {
          id: currentMandapam.id,
          name: currentMandapam.name,
          slug: currentMandapam.slug,
          address: updates.address !== undefined ? updates.address : currentMandapam.address,
          area: updates.area !== undefined ? updates.area : currentMandapam.area,
          city: updates.city !== undefined ? updates.city : currentMandapam.city,
          state: currentMandapam.state || "Telangana",
          pincode: currentMandapam.pincode || "503001",
          latitude: currentMandapam.latitude,
          longitude: currentMandapam.longitude,
          organizer_name: updates.organizerName !== undefined ? updates.organizerName : currentMandapam.organizerName,
          organizer_mobile: updates.organizerMobile !== undefined ? updates.organizerMobile : currentMandapam.organizerMobile,
          contact_phone: updates.contactPhone !== undefined ? updates.contactPhone : currentMandapam.contactPhone,
          whatsapp_number: updates.whatsappNumber !== undefined ? updates.whatsappNumber : currentMandapam.whatsappNumber,
          logo_url: updates.logoUrl !== undefined ? updates.logoUrl : (currentMandapam.logoUrl || null),
          cover_image_url: updates.coverImageUrl !== undefined ? updates.coverImageUrl : (currentMandapam.coverImageUrl || null),
          updated_at: new Date().toISOString()
        };

        const { error } = await (supabase.from("navaratri_mandapams") as any).upsert(payload, { onConflict: "id" });
        if (error) {
          console.warn("Supabase branding upsert warning (offline fallback active):", error.message);
        }
      } catch (dbErr) {
        console.warn("Supabase network error:", dbErr);
      }

      setBrandingModalOpen(false);
      toast.success("Mandapam branding, logo, cover & location saved successfully!");
    } catch (err: any) {
      console.error("Save branding error:", err);
      toast.error("An error occurred while saving branding details.");
    } finally {
      setIsSavingBranding(false);
    }
  };

  const handleResetMandapamBranding = async () => {
    if (!currentMandapam) return;
    updateMandapam(currentMandapam.id, {
      logoUrl: undefined,
      coverImageUrl: undefined,
      cardBgImageUrl: undefined
    });
    localStorage.removeItem(`mandapam_logo_${currentMandapam.id}`);
    localStorage.removeItem(`mandapam_cover_${currentMandapam.id}`);
    localStorage.removeItem(`mandapam_card_bg_${currentMandapam.id}`);
    setLogoPreview("");
    setLogoInputUrl("");
    setPhotoPreview("");
    setPhotoInputUrl("");

    try {
      await (supabase.from("navaratri_mandapams") as any).update({
        logo_url: null,
        cover_image_url: null,
        updated_at: new Date().toISOString()
      }).eq("id", currentMandapam.id);
    } catch {}

    setBrandingModalOpen(false);
    toast.info("Mandapam logo and photos reset to default theme.");
  };

  if (!currentMandapam) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-md">
          🚩
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#8B1E1E]">
            No Mandapam Registered Yet
          </h1>
          <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Register your Durga Mandapam now to obtain your private Mandapam ID and Passcode, enable daily Darshan uploads, manage pooja slots, and generate devotee posters.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/navaratri/register"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#8B1E1E] to-[#B45309] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all inline-block"
          >
            Register Your Mandapam
          </Link>
          <Link
            to="/navaratri/login"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-amber-300 text-[#8B1E1E] text-sm font-bold shadow-xs hover:bg-amber-50 transition-all inline-block"
          >
            Login as Mandapam
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Banner with Mandapam ID, Passcode, Download Slip, Photo & Logout */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-r from-[#9A241C] via-[#8B1E1E] to-[#781B1B] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {(currentMandapam.coverImageUrl || currentMandapam.cardBgImageUrl) && (
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden rounded-3xl">
            <img
              src={currentMandapam.coverImageUrl || currentMandapam.cardBgImageUrl}
              alt={currentMandapam.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B1E1E] via-[#8B1E1E]/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 space-y-2.5 w-full">
          <div className="flex flex-wrap items-center gap-2 pr-24 sm:pr-28">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mandapam Control Center</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 bg-sky-950/70 px-2.5 py-0.5 rounded-full border border-sky-400/50 shadow-sm">
              <InstagramVerifiedBadge className="w-3.5 h-3.5" />
              <span>Verified Organizer</span>
            </span>
          </div>

          <div className="flex items-center gap-3 min-w-0 pt-0.5">
            {(currentMandapam.logoUrl || (typeof window !== "undefined" && localStorage.getItem(`mandapam_logo_${currentMandapam.id}`))) && (
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md bg-white p-1 shrink-0">
                <img
                  src={currentMandapam.logoUrl || localStorage.getItem(`mandapam_logo_${currentMandapam.id}`) || ""}
                  alt="Mandapam Logo"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-white leading-tight">
                <span className="line-clamp-2 break-words">
                  {currentMandapam.name}
                  <InstagramVerifiedBadge className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 inline-block ml-1.5 align-middle shrink-0 drop-shadow" title="Official Verified Mandapam" />
                </span>
              </h1>
              <div className="text-xs text-amber-100 flex flex-col sm:flex-row sm:items-center sm:gap-1.5 leading-snug pt-0.5">
                <span>{currentMandapam.area}, {currentMandapam.city}</span>
                <span className="hidden sm:inline opacity-70">•</span>
                <span className="text-amber-200/95 sm:text-amber-100 font-medium sm:font-normal">
                  Organizer: {currentMandapam.organizerName} ({currentMandapam.organizerMobile})
                </span>
              </div>
            </div>
          </div>

          {/* Credentials Display Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {/* Mandapam ID Badge */}
            <div className="flex items-center gap-1 bg-black/30 border border-white/20 px-2.5 py-1 rounded-xl">
              <span className="text-amber-300 font-bold">ID:</span>
              <span className="font-mono font-bold">{currentMandapam.id}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(currentMandapam.id, "Mandapam ID")}
                className="text-white/70 hover:text-white ml-1 p-0.5 cursor-pointer"
                title="Copy Mandapam ID"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>

            {/* QR Code Button */}
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="flex items-center gap-1.5 bg-black/30 hover:bg-black/50 border border-white/20 hover:border-amber-300/60 px-3 py-1 rounded-xl text-amber-200 hover:text-white font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              title="View & Download Mandapam QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-300" />
              <span>QR Code</span>
            </button>
          </div>
        </div>

        {/* Top-Right Settings Menu */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-20">
          <button
            type="button"
            onClick={() => setSettingsOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-black/40 hover:bg-black/60 text-amber-200 hover:text-white border border-white/25 shadow-lg backdrop-blur-xs transition-all active:scale-95 cursor-pointer"
            title="Mandapam Settings & Options"
          >
            <Settings className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold">Settings</span>
          </button>

          {settingsOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-2xs"
                onClick={() => setSettingsOpen(false)}
              />

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white text-stone-900 rounded-2xl shadow-2xl border border-amber-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#8B1E1E] uppercase tracking-wider">
                    <Settings className="w-3.5 h-3.5 text-amber-600" />
                    <span>Mandapam Settings</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="py-1 space-y-0.5">
                  {/* 1. Download Access Slip */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);
                      downloadMandapamCredentials(currentMandapam, sessionPasscode);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-stone-800 hover:bg-amber-50 hover:text-[#8B1E1E] rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Download Access Slip</span>
                  </button>

                  {/* 2. Logo & Cover Image */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);
                      setLogoPreview(currentMandapam.logoUrl || (typeof window !== "undefined" ? localStorage.getItem(`mandapam_logo_${currentMandapam.id}`) : null) || "");
                      setLogoInputUrl("");
                      setPhotoPreview(currentMandapam.coverImageUrl || currentMandapam.cardBgImageUrl || (typeof window !== "undefined" ? localStorage.getItem(`mandapam_cover_${currentMandapam.id}`) : null) || "");
                      setPhotoInputUrl("");
                      setEditAddress(currentMandapam.address || "");
                      setEditArea(currentMandapam.area || "");
                      setEditCity(currentMandapam.city || "");
                      setEditOrganizerName(currentMandapam.organizerName || "");
                      setEditOrganizerMobile(currentMandapam.organizerMobile || currentMandapam.contactPhone || "");
                      setEditWhatsappNumber(currentMandapam.whatsappNumber || "");
                      setShowOrganizerPublicly(currentMandapam.showOrganizerPublicly !== false);
                      setBrandingTab("logo");
                      setBrandingModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-stone-800 hover:bg-amber-50 hover:text-[#8B1E1E] rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Edit Logo & Cover Image</span>
                  </button>

                  {/* 3. Counter Standee */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);
                      setQrModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-stone-800 hover:bg-amber-50 hover:text-[#8B1E1E] rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-[#8B1E1E] shrink-0" />
                    <span>Counter Standee</span>
                  </button>

                  {/* 4. View Public Page */}
                  <Link
                    to={`/navaratri/m/${currentMandapam.slug}`}
                    onClick={() => setSettingsOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-stone-800 hover:bg-amber-50 hover:text-[#8B1E1E] rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>View Public Page</span>
                  </Link>

                  <div className="my-1 border-t border-stone-200" />

                  {/* 5. Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-stone-500 shrink-0" />
                    <span>Logout</span>
                  </button>

                  {/* 6. Delete Account */}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);
                      setDeleteStep(1);
                      setDeleteConfirmInput("");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATION - 2 in a row on mobile view */}
      <div className="grid grid-cols-2 lg:flex lg:items-center gap-2.5 border-b-2 border-amber-300 pb-3">
        <button
          onClick={() => setActiveTab("days")}
          className={`w-full lg:w-auto px-3 sm:px-4 py-3 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-center ${
            activeTab === "days"
              ? "bg-[#8B1E1E] text-white shadow-md ring-2 ring-amber-400/50"
              : "bg-white text-stone-700 hover:bg-amber-50 border border-amber-300"
          }`}
        >
          <CalendarDays className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="leading-tight">10-Day Festival Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab("events")}
          className={`w-full lg:w-auto px-3 sm:px-4 py-3 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-center ${
            activeTab === "events"
              ? "bg-[#8B1E1E] text-white shadow-md ring-2 ring-amber-400/50"
              : "bg-white text-stone-700 hover:bg-amber-50 border border-amber-300"
          }`}
        >
          <DandiyaIcon className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="leading-tight">Mandapam Events & Programs ({mandapamActivities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("announcements")}
          className={`w-full lg:w-auto px-3 sm:px-4 py-3 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-center ${
            activeTab === "announcements"
              ? "bg-[#8B1E1E] text-white shadow-md ring-2 ring-amber-400/50"
              : "bg-white text-stone-700 hover:bg-amber-50 border border-amber-300"
          }`}
        >
          <Bell className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="leading-tight">Flash Notices & Updates</span>
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`w-full lg:w-auto px-3 sm:px-4 py-3 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-center ${
            activeTab === "bookings"
              ? "bg-[#8B1E1E] text-white shadow-md ring-2 ring-amber-400/50"
              : "bg-white text-stone-700 hover:bg-amber-50 border border-amber-300"
          }`}
        >
          <Users className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="leading-tight">Devotee Bookings & Tokens ({mandapamBookings.length})</span>
        </button>
      </div>

      {/* TAB 1: 10-DAY FESTIVAL SCHEDULE & QUICK EVENT CREATOR */}
      {activeTab === "days" && (
        <div className="space-y-6">
          {/* Action Card: Add Events (Dandiya, Pooja, Archanas, etc.) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 border-2 border-amber-300 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DandiyaIcon className="w-5 h-5 text-[#8B1E1E]" />
                <h2 className="font-serif font-black text-lg sm:text-xl text-[#8B1E1E]">
                  Add Mandapam Events (Dandiya, Pooja, Archana)
                </h2>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed max-w-2xl">
                Quickly add special events like Dandiya nights, Homams, Archanas, or cultural programs with title, date, time, and entry fee so devotees visiting your page see them on their respective dates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEventModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Event (Dandiya, Pooja, Archana)</span>
            </button>
          </div>

          {/* Clean Day 1 to Day 10 Buttons */}
          <div className="p-5 rounded-3xl bg-white border-2 border-amber-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="text-xs font-black text-[#8B1E1E] uppercase tracking-wider">
                Select Festival Day to Edit Details & Alankarana:
              </span>
              <span className="text-[11px] font-bold text-stone-500">
                Day 1 to Day 10
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
              {STANDARD_NAVARATRI_DAYS.map((day) => {
                const setting = daySettings.find((s) => s.mandapamId === currentMandapam.id && s.dayNumber === day.dayNumber);
                const mathaImage = setting?.coverImageUrl || setting?.alankaranaPhotoUrl || day.imageUrl;

                return (
                  <button
                    key={day.dayNumber}
                    type="button"
                    onClick={() => handleOpenDrawerForDay(day.dayNumber)}
                    className="relative p-2.5 sm:p-3 rounded-2xl bg-white hover:bg-amber-50/80 border-2 border-amber-200 hover:border-[#8B1E1E] shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center group cursor-pointer active:scale-95"
                    title={`Day ${day.dayNumber} • ${day.deviName} (${day.date})`}
                  >
                    {/* Matha Image Icon with Day Badge */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-sm group-hover:scale-105 transition-transform bg-[#FDFBF7] shrink-0">
                      <img
                        src={navaratriAsset(mathaImage)}
                        alt={day.deviName}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          if (e.currentTarget.src !== navaratriAsset(day.imageUrl)) {
                            e.currentTarget.src = navaratriAsset(day.imageUrl);
                          }
                        }}
                      />
                      {/* Day Number Badge */}
                      <span className="absolute bottom-0 right-0 bg-[#8B1E1E]/95 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-tl-lg shadow-xs leading-none">
                        D{day.dayNumber}
                      </span>
                    </div>

                    <span className="font-serif font-black text-xs text-stone-900 group-hover:text-[#8B1E1E] mt-1.5">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[10px] text-stone-500 font-semibold">
                      {day.date.slice(5)}
                    </span>
                    <span className="text-[9px] text-[#8B1E1E] font-medium truncate w-full px-0.5">
                      {day.deviName.replace(/^Sri\s+/, "").replace(/\s+Devi$/, "")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANDAPAM EVENTS & SPECIAL ACTIVITIES */}
      {activeTab === "events" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-amber-50/80 p-4 rounded-2xl border border-amber-300">
            <div>
              <h2 className="font-serif font-black text-xl text-[#8B1E1E]">
                Mandapam Events & Cultural Programs
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Add special events like Maha Chandi Yagam, Dandiya Nights, Sangeetha Seva, Ayudha Pooja, and Shobhayatra.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEventModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <DandiyaIcon className="w-4 h-4 text-amber-300" />
              <span>Add Mandapam Event & Activity</span>
            </button>
          </div>

          {mandapamActivities.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-amber-300 p-6 space-y-3">
              <DandiyaIcon className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-stone-900">No Events Added Yet</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Organize special homams, Dandiya nights, or children competitions and publish them so devotees across town can participate!
              </p>
              <button
                type="button"
                onClick={() => setEventModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <DandiyaIcon className="w-4 h-4 text-amber-300" />
                <span>+ Add First Mandapam Event</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mandapamActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-5 rounded-3xl bg-white border border-amber-300 shadow-sm space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 inline-flex items-center gap-1.5">
                        {isHomamEvent(act) && <HomaKundaIcon className="w-3.5 h-3.5" />}
                        <span>{act.category}</span>
                      </span>
                      <h3 className="font-serif font-black text-lg text-[#8B1E1E] mt-1 flex items-center gap-2">
                        {isHomamEvent(act) && <HomaKundaIcon className="w-5 h-5 shrink-0" />}
                        <span>{act.title}</span>
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete event "${act.title}"?`)) {
                          deleteActivity(act.id);
                          toast.success("Event removed.");
                        }
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 pt-2 border-t border-amber-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>{act.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{act.startTime} {act.endTime ? `- ${act.endTime}` : ""}</span>
                    </div>
                  </div>

                  {act.location && (
                    <p className="text-[11px] text-stone-500 font-medium">
                      📍 Venue: {act.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS & LIVE FLASH NOTICES */}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          {/* Post Live Mandapam Announcement */}
          <div className="rounded-3xl border border-amber-300 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <h2 className="font-serif text-base sm:text-lg font-black text-[#8B1E1E] flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-700" />
                <span>Publish Flash Announcement to Devotees</span>
              </h2>
              <span className="text-[10px] text-stone-500 font-semibold">
                Appears on Citizen Mandapam Page instantly
              </span>
            </div>

            <form onSubmit={handlePostAnnouncement} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Announcement headline (e.g. Maha Kumkumarchana starting at 6:30 PM)..."
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <textarea
                  rows={2}
                  required
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  placeholder="Details: timing updates, parking advice, or special sevas..."
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-600 font-semibold">Priority:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      checked={annPriority === "NORMAL"}
                      onChange={() => setAnnPriority("NORMAL")}
                    />
                    <span>Normal</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer text-red-700 font-bold">
                    <input
                      type="radio"
                      name="priority"
                      checked={annPriority === "HIGH"}
                      onChange={() => setAnnPriority("HIGH")}
                    />
                    <span>Urgent Notice</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-xs font-bold shadow transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          </div>

          {/* Announcements Feed */}
          <div className="space-y-3">
            <h3 className="font-serif font-black text-base text-stone-900">
              Published Notices for {currentMandapam.name}
            </h3>
            {announcements.filter(a => a.mandapamId === currentMandapam.id).length === 0 ? (
              <p className="text-xs text-stone-500 italic">No announcements published yet.</p>
            ) : (
              announcements.filter(a => a.mandapamId === currentMandapam.id).map((ann) => (
                <div key={ann.id} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#8B1E1E]">{ann.title}</span>
                    <span className="text-[10px] text-stone-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-stone-700">{ann.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: DEVOTEE BOOKINGS & TOKEN COUNTER */}
      {activeTab === "bookings" && (
        <div className="space-y-6">
          {/* Action Bar & Stats Header */}
          <div className="rounded-3xl border border-amber-300 bg-white p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-200 pb-3">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-black text-[#8B1E1E] flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-700" />
                  <span>Citizen Bookings & Walk-In Crowds</span>
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Manage limited devotee quotas for Poojas, Lottery, Dandiya, or Lucky Draws, and issue counter walk-in tokens.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSlotModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Open Booking Opening / Quota</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>+ Issue Walk-In Token</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Total Devotees</p>
                <p className="text-2xl font-black text-[#8B1E1E] mt-1">{mandapamBookings.length}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Online Passes</p>
                <p className="text-2xl font-black text-blue-900 mt-1">{onlineBookingsCount}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Counter Tokens</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">{walkinBookingsCount}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Active Openings</p>
                <p className="text-2xl font-black text-purple-900 mt-1">{mandapamServices.length}</p>
              </div>
            </div>
          </div>

          {/* Section: Active Booking Openings & Quota Limits */}
          <div className="rounded-3xl border border-amber-300 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-black text-[#8B1E1E] flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-amber-700" />
                  <span>Mandapam Booking Openings & Quota Limits</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Slots automatically close as "FILLED SLOTS" when all token quotas are booked.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSlotModalOpen(true)}
                className="text-xs font-bold text-[#8B1E1E] hover:text-[#B45309] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Opening</span>
              </button>
            </div>

            {mandapamServices.length === 0 ? (
              <div className="text-center py-6 px-4 rounded-2xl bg-amber-50/60 border border-dashed border-amber-300 space-y-2">
                <p className="text-xs font-semibold text-amber-900">
                  No active booking openings created yet.
                </p>
                <p className="text-[11px] text-stone-600 max-w-md mx-auto">
                  Organizers can create limited quotas for Poojas, Lottery, Dandiya, or Lucky Draws (e.g. limit to 4 devotees).
                </p>
                <button
                  type="button"
                  onClick={() => setSlotModalOpen(true)}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C] transition-colors cursor-pointer"
                >
                  + Open Booking Slot (e.g. 4 Slots)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {mandapamServices.map((srv) => {
                  const srvSlots = slots.filter((s) => s.serviceId === srv.id && s.mandapamId === currentMandapam.id);
                  const totalCap = srvSlots.reduce((acc, s) => acc + s.capacity, 0);
                  const totalBooked = srvSlots.reduce((acc, s) => acc + s.bookedCount + s.walkinCount, 0);
                  const isFull = totalCap > 0 && totalBooked >= totalCap;
                  const remaining = Math.max(0, totalCap - totalBooked);
                  const percentFilled = totalCap > 0 ? Math.min(100, Math.round((totalBooked / totalCap) * 100)) : 0;

                  return (
                    <div
                      key={srv.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isFull
                          ? "bg-red-50/40 border-red-300 shadow-sm"
                          : "bg-[#FFFDF9] border-amber-300 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-[#8B1E1E] uppercase">
                              {srv.type}
                            </span>
                            {srv.price && srv.price > 0 ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                                ₹{srv.price}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Free
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#8B1E1E]">
                            {srv.name}
                          </h4>
                          <p className="text-[11px] text-stone-600 line-clamp-2">
                            {srv.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteServiceOpening(srv.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Opening"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Timings */}
                      <div className="flex items-center gap-3 text-[11px] text-stone-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#8B1E1E]" />
                          <span>{srv.date || srvSlots[0]?.date || "Festival Days"}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8B1E1E]" />
                          <span>{srv.timeSlot || (srvSlots[0] ? `${srvSlots[0].startTime} - ${srvSlots[0].endTime}` : "60 mins")}</span>
                        </span>
                      </div>

                      {/* Quota Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-700">
                            Quota: {totalBooked} / {totalCap || "∞"} Booked
                          </span>
                          {isFull ? (
                            <span className="font-black text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-red-700" />
                              <span>FILLED SLOTS</span>
                            </span>
                          ) : (
                            <span className="font-bold text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {remaining} Slots Left
                            </span>
                          )}
                        </div>
                        {totalCap > 0 && (
                          <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isFull ? "bg-red-600" : percentFilled > 75 ? "bg-amber-500" : "bg-emerald-600"
                              }`}
                              style={{ width: `${percentFilled}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                        <span className="text-[10px] text-stone-500 font-medium">
                          {isFull ? "Slot locked for citizens" : "Open for Devotees"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setRegisterModalOpen(true)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Ticket className="w-3 h-3" />
                          <span>+ Walk-In Token</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Devotee Bookings & Tokens Register */}
          <div className="rounded-3xl border border-amber-300 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-200 pb-3">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-black text-[#8B1E1E] flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Devotee Bookings & Tokens ({filteredMandapamBookings.length})</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Full list of citizen registrations, online passes, and walk-in counter slips.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl shrink-0 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setBookingFilterType("ALL")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    bookingFilterType === "ALL" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  All ({mandapamBookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBookingFilterType("ONLINE")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    bookingFilterType === "ONLINE" ? "bg-white text-blue-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Online ({onlineBookingsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setBookingFilterType("WALK_IN")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    bookingFilterType === "WALK_IN" ? "bg-white text-emerald-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Walk-In ({walkinBookingsCount})
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bookingSearchQuery}
                onChange={(e) => setBookingSearchQuery(e.target.value)}
                placeholder="Search by devotee name, mobile number, or token code (e.g. TK-1234)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              {bookingSearchQuery && (
                <button
                  type="button"
                  onClick={() => setBookingSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Bookings List Cards */}
            <div className="space-y-2.5">
              {filteredMandapamBookings.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <p className="text-xs text-stone-600 font-semibold">
                    {bookingSearchQuery ? "No bookings match your search query." : "No citizen bookings recorded yet."}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Bookings made by citizens or issued at counter will be listed here in real-time.
                  </p>
                </div>
              ) : (
                filteredMandapamBookings.map((b) => {
                  const srv = services.find((s) => s.id === b.serviceId);
                  const srvName = srv ? srv.name : b.bookingType === "WALK_IN" ? "Counter Walk-In Token" : "Devotee Pooja Pass";

                  return (
                    <div
                      key={b.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-stone-50/80 border border-stone-200 hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-xs px-2 py-0.5 rounded-lg bg-amber-100 text-[#8B1E1E] border border-amber-300">
                            {b.bookingCode}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.bookingType === "WALK_IN"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {b.bookingType === "WALK_IN" ? "🎫 Counter Token" : "📱 Online Pass"}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.status === "CHECKED_IN"
                                ? "bg-purple-100 text-purple-800"
                                : b.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-stone-200 text-stone-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="pt-0.5">
                          <p className="font-black text-sm text-stone-900">
                            {b.name}{" "}
                            <span className="text-stone-500 font-normal">
                              ({b.mobile})
                            </span>
                          </p>
                          <p className="text-[11px] text-stone-600 font-medium">
                            <strong className="text-[#8B1E1E]">{srvName}</strong> • {b.quantity} Devotee(s)
                          </p>
                          {b.notes && (
                            <p className="text-[10px] text-stone-500 italic mt-0.5">
                              {b.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = b.status === "CHECKED_IN" ? "CONFIRMED" : "CHECKED_IN";
                            updateBookingStatus(b.id, newStatus);
                            toast.success(`Booking ${b.bookingCode} marked as ${newStatus}`);
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                            b.status === "CHECKED_IN"
                              ? "bg-purple-100 hover:bg-purple-200 text-purple-900"
                              : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{b.status === "CHECKED_IN" ? "Present ✓" : "Check In"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePrintBookingSlip(b)}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Print Token Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print</span>
                        </button>

                        {b.status !== "CANCELLED" && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Cancel booking ${b.bookingCode}?`)) {
                                updateBookingStatus(b.id, "CANCELLED");
                                toast.info(`Booking ${b.bookingCode} cancelled.`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Cancel Booking"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* DRAWERS & MODALS */}
      {updateDrawerOpen && (
        <DailyUpdateDrawer
          mandapam={currentMandapam}
          dayNumber={drawerDayNumber}
          isOpen={updateDrawerOpen}
          onClose={() => setUpdateDrawerOpen(false)}
        />
      )}

      {registerModalOpen && (
        <WalkInRegisterModal
          mandapam={currentMandapam}
          isOpen={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
        />
      )}

      {/* OPEN BOOKING OPENING / QUOTA MODAL */}
      {slotModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSlotModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#FFFDF9] rounded-3xl border-2 border-amber-400 shadow-2xl p-5 sm:p-6 space-y-4 my-8 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-[#8B1E1E]">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-[#8B1E1E]">
                    Open Booking / Quota Limit
                  </h3>
                  <p className="text-[11px] text-stone-600 font-medium">
                    Pooja, Lottery, Dandiya, or Lucky Draw with exact token capacity
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSlotModalOpen(false)}
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBookingSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Booking Opening Title *
                </label>
                <input
                  type="text"
                  required
                  value={slotTitle}
                  onChange={(e) => setSlotTitle(e.target.value)}
                  placeholder="e.g. Special Chandi Homam, Maha Dandiya Night, Navaratri Lucky Draw, Daily Evening Pooja"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Category *
                  </label>
                  <select
                    value={slotCategory}
                    onChange={(e) => setSlotCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-stone-800"
                  >
                    <option value="Pooja">🪔 Special Pooja / Seva</option>
                    <option value="Lottery / Lucky Draw">🎟️ Lottery / Lucky Draw</option>
                    <option value="Dandiya / Garba">💃 Dandiya / Garba</option>
                    <option value="Daily Pooja">☀️ Daily Pooja</option>
                    <option value="Other">🎯 Other (Custom)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Token Quota Limit (Max Bookings) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={slotCapacity}
                    onChange={(e) => setSlotCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                    placeholder="e.g. 4"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-[#8B1E1E]"
                  />
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    e.g. Set to 4 to strictly allow 4 bookings. When reached, shows FILLED SLOTS.
                  </p>
                </div>
              </div>

              {slotCategory === "Other" && (
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Enter Custom Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customSlotCategory}
                    onChange={(e) => setCustomSlotCategory(e.target.value)}
                    placeholder="e.g. Youth Quiz, Annadanam Seva, Cultural Contest"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Festival Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                    placeholder="e.g. 2026-10-15 or Day 5"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={slotStartTime}
                    onChange={(e) => setSlotStartTime(e.target.value)}
                    placeholder="e.g. 06:00 PM"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    End Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={slotEndTime}
                    onChange={(e) => setSlotEndTime(e.target.value)}
                    placeholder="e.g. 08:00 PM"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Dakshina / Ticket Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={slotPrice}
                    onChange={(e) => setSlotPrice(e.target.value)}
                    placeholder="0 for Free community entry"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-stone-500 mt-0.5">Leave 0 for free seva / token.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Items Devotees Should Bring (Optional)
                  </label>
                  <input
                    type="text"
                    value={slotItemsRequired}
                    onChange={(e) => setSlotItemsRequired(e.target.value)}
                    placeholder="e.g. Coconuts, Flowers, Dandiya sticks"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Description / Instructions for Devotees
                </label>
                <textarea
                  rows={2}
                  value={slotDescription}
                  onChange={(e) => setSlotDescription(e.target.value)}
                  placeholder="Details about ritual, reporting timing, dress code, or lucky draw rules..."
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => setSlotModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Open Quota & Publish Slot</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {qrModalOpen && (
        <ShareQrModal
          mandapam={currentMandapam}
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
        />
      )}

      {/* EVENT CREATOR MODAL */}
      {eventModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setEventModalOpen(false)}
        >
          <div
            className="bg-[#FFFDF9] rounded-3xl max-w-lg w-full shadow-2xl border-2 border-amber-400 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-[#8B1E1E] to-[#B45309] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DandiyaIcon className="w-5 h-5 text-amber-300" />
                <h3 className="font-serif font-black text-lg text-white">
                  Add Mandapam Event & Activity
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEventModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 sm:p-6 space-y-4 text-xs font-medium text-stone-800">
              {/* Quick Preset Templates */}
              <div className="space-y-1 bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
                <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider block">
                  Quick Event Suggestions (Tap to Auto-Fill):
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: "Dandiya Raas", cat: "Game", title: "Dandiya Raas & Garba Utsav" },
                    { label: "Chandi Homam", cat: "Pooja", title: "Maha Chandi Yagam & Purnahuthi", isHomam: true },
                    { label: "Kumkumarchana", cat: "Pooja", title: "Sri Lalitha Kumkumarchana Seva" },
                    { label: "Bhajan Sandhya", cat: "Bhajan", title: "Devotional Bhajan Sandhya" },
                    { label: "Bathukamma", cat: "Cultural Program", title: "Maha Bathukamma Celebrations" }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setEventTitle(preset.title);
                        setEventCategory(preset.cat as Activity["category"]);
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-[#8B1E1E] border border-amber-300 font-semibold transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
                    >
                      {preset.isHomam && <HomaKundaIcon className="w-3.5 h-3.5 shrink-0" />}
                      <span>+ {preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Dandiya Raas Night / Maha Chandi Homam"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Event Category *
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as Activity["category"])}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                  >
                    <option value="Pooja">Pooja / Homam / Archana</option>
                    <option value="Game">Dandiya / Garba</option>
                    <option value="Cultural Program">Cultural Program</option>
                    <option value="Bhajan">Bhajan Sandhya</option>
                    <option value="Pallaki Seva">Pallaki Seva / Shobhayatra</option>
                    <option value="Annadanam">Special Annadanam</option>
                    <option value="Competition">Competition / Drawing</option>
                    <option value="Special Program">Special Program</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                  />
                </div>

                {eventCategory === "Other" && (
                  <div className="col-span-2 space-y-1 bg-amber-50 p-2.5 rounded-xl border border-amber-300">
                    <label className="block text-stone-800 font-bold text-xs">
                      Enter Custom Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Maha Kumkumarchana / Bathukamma Samburalu"
                      className="w-full px-3 py-2 rounded-xl border border-amber-400 bg-white text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    placeholder="06:30 PM"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    placeholder="09:30 PM"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Location / Venue *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Mandapam Main Stage"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                  />
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {[
                      "Mandapam Main Stage",
                      "Garbhalayam Sanctum",
                      "Festival Ground",
                      "Dining Pandal"
                    ].map((locPreset) => (
                      <button
                        key={locPreset}
                        type="button"
                        onClick={() => setEventLocation(locPreset)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                          eventLocation === locPreset
                            ? "bg-amber-500 text-white border-amber-600 font-bold"
                            : "bg-stone-100 hover:bg-amber-100 text-stone-700 border-stone-200"
                        }`}
                      >
                        {locPreset}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Entry Fee / Ticket Charge (Optional)
                  </label>
                  <input
                    type="text"
                    value={eventFee}
                    onChange={(e) => setEventFee(e.target.value)}
                    placeholder="Free or amount (e.g. ₹50)"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                  />
                  <p className="text-[10px] text-stone-500 pt-1">
                    Leave blank or type Free for free devotee entry.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Description & Devotee Guidelines
                </label>
                <textarea
                  rows={2}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Details for devotees, dress code, dandiya sticks provided, or entry rules..."
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                />
              </div>

              <div className="pt-2 border-t border-amber-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] text-white font-bold shadow-sm cursor-pointer"
                >
                  Save & Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TWO-STEP DELETE CONFIRMATION MODALS */}
      {deleteStep === 1 && currentMandapam && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setDeleteStep(0)}
        >
          <div
            className="bg-[#FFFDF9] rounded-3xl max-w-md w-full shadow-2xl border-2 border-red-400 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-red-800 to-red-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-amber-300 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-200 block">
                    Confirmation 1 of 2
                  </span>
                  <h3 className="font-serif font-black text-lg text-white">
                    Delete Mandapam Account?
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteStep(0)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Cancel deletion"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-stone-700">
              <p className="font-semibold text-stone-900">
                Are you sure you want to delete <span className="text-red-700 font-bold underline">{currentMandapam.name}</span>?
              </p>

              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 space-y-2 text-xs text-red-900">
                <p className="font-bold">Permanent consequences of deleting this account:</p>
                <ul className="list-disc pl-4 space-y-1 text-stone-700">
                  <li>Your public devotee page will be taken offline immediately.</li>
                  <li>All daily Alankarana photos, darshan updates, and announcements will be erased.</li>
                  <li>Devotees scanning your counter QR code will no longer see your mandapam.</li>
                  <li>Your unique Mandapam ID credentials and profile will be permanently deleted.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteStep(0)}
                className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel & Keep Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteStep(2);
                  setDeleteConfirmInput("");
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Step 2 →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 OF 2: FINAL IRREVERSIBLE CONFIRMATION */}
      {deleteStep === 2 && currentMandapam && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setDeleteStep(0)}
        >
          <div
            className="bg-[#FFFDF9] rounded-3xl max-w-md w-full shadow-2xl border-2 border-red-600 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-red-900 via-[#8B1E1E] to-black text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-6 h-6 text-red-400 shrink-0 animate-pulse" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 block">
                    Final Confirmation 2 of 2
                  </span>
                  <h3 className="font-serif font-black text-lg text-white">
                    Permanently Delete Account
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteStep(0)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Cancel deletion"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-stone-800">
              <div className="p-3 bg-red-100/90 border border-red-300 rounded-xl text-red-950 font-medium text-xs leading-relaxed">
                🚨 <strong>FINAL WARNING: THIS ACTION IS IRREVERSIBLE.</strong>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  To confirm permanent deletion, type <span className="font-mono bg-stone-200 px-1.5 py-0.5 rounded text-red-800 font-bold">DELETE</span>:
                </label>
                <input
                  type="text"
                  value={deleteConfirmInput}
                  onChange={(e) => setDeleteConfirmInput(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-red-300 focus:border-red-600 focus:outline-none text-sm font-semibold bg-white"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteStep(1)}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                ← Back to Step 1
              </button>
              <button
                type="button"
                disabled={
                  deleteConfirmInput.trim().toUpperCase() !== "DELETE" &&
                  deleteConfirmInput.trim() !== currentMandapam.id
                }
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Permanently Delete Mandapam</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDAPAM BRANDING, MEDIA & LOCATION MODAL */}
      {brandingModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in"
          onClick={() => {
            setBrandingModalOpen(false);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border-2 border-amber-300 animate-in zoom-in-95 duration-150 my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#8B1E1E] to-[#B45309] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-200">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-white">
                    Mandapam Branding & Location
                  </h3>
                  <p className="text-[11px] text-amber-100">
                    Add committee logo & location for visitors who scan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBrandingModalOpen(false);
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation inside Modal */}
            <div className="grid grid-cols-4 border-b border-amber-200 bg-amber-50/70 p-1.5 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBrandingTab("logo")}
                className={`py-2 px-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                  brandingTab === "logo"
                    ? "bg-[#8B1E1E] text-white shadow-xs"
                    : "text-stone-700 hover:bg-white/80"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">1. Logo</span>
              </button>

              <button
                type="button"
                onClick={() => setBrandingTab("cover")}
                className={`py-2 px-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                  brandingTab === "cover"
                    ? "bg-[#8B1E1E] text-white shadow-xs"
                    : "text-stone-700 hover:bg-white/80"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">2. Cover</span>
              </button>

              <button
                type="button"
                onClick={() => setBrandingTab("location")}
                className={`py-2 px-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                  brandingTab === "location"
                    ? "bg-[#8B1E1E] text-white shadow-xs"
                    : "text-stone-700 hover:bg-white/80"
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">3. Location</span>
              </button>

              <button
                type="button"
                onClick={() => setBrandingTab("organizer")}
                className={`py-2 px-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                  brandingTab === "organizer"
                    ? "bg-[#8B1E1E] text-white shadow-xs"
                    : "text-stone-700 hover:bg-white/80"
                }`}
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">4. Organizer</span>
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* TAB 1: COMMITTEE LOGO */}
              {brandingTab === "logo" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-stone-700 flex items-start gap-2">
                    <span className="text-base shrink-0">💡</span>
                    <div>
                      <strong>Visitor Visibility:</strong> Devotees who scan your standee QR code will see this official emblem prominently on your mandapam hero banner and devotee pass slip!
                    </div>
                  </div>

                  {/* Emblem Showcase with Perfect Fit & Crop Controls */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-stone-50 border-2 border-amber-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      {/* Circular Ornate Emblem Badge */}
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-400 bg-white shadow-lg p-1.5 flex items-center justify-center overflow-hidden relative group">
                          {logoPreview || logoInputUrl ? (
                            <img
                              src={logoPreview || logoInputUrl}
                              alt="Mandapam Logo Preview"
                              className={`w-full h-full transition-transform duration-200 group-hover:scale-105 ${
                                logoFitMode === "cover"
                                  ? "object-cover rounded-full"
                                  : "object-contain p-0.5 rounded-full"
                              }`}
                              onError={() => toast.error("Could not load logo preview.")}
                            />
                          ) : (
                            <div className="text-center p-2 text-[10px] text-stone-500 font-bold leading-tight flex flex-col items-center justify-center">
                              <span className="text-2xl mb-0.5">卐</span>
                              <span>No Logo</span>
                            </div>
                          )}
                        </div>
                        {/* Status chip */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 text-[9px] font-bold tracking-wider uppercase border border-amber-400 shadow-xs whitespace-nowrap">
                          {logoPreview || logoInputUrl ? "Custom Emblem" : "Default Kolam"}
                        </div>
                      </div>

                      {/* Controls beside badge */}
                      <div className="space-y-3 min-w-0 flex-1 text-center sm:text-left">
                        <div>
                          <div className="font-serif font-black text-base text-[#8B1E1E] line-clamp-1">
                            {currentMandapam.name}
                          </div>
                          <p className="text-[11px] text-stone-500 leading-snug">
                            {logoPreview || logoInputUrl
                              ? "Custom committee emblem active"
                              : "Using default auspicious kolam icon"}
                          </p>
                        </div>

                        {/* Fit Mode Toggle */}
                        {(logoPreview || logoInputUrl) && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
                              Badge Crop / Fit Mode:
                            </span>
                            <div className="inline-flex rounded-xl p-0.5 bg-stone-200/80 border border-stone-300">
                              <button
                                type="button"
                                onClick={() => setLogoFitMode("contain")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  logoFitMode === "contain"
                                    ? "bg-white text-stone-900 shadow-xs"
                                    : "text-stone-600 hover:text-stone-900"
                                }`}
                              >
                                <Maximize2 className="w-3 h-3" />
                                <span>Fit Full Logo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setLogoFitMode("cover")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  logoFitMode === "cover"
                                    ? "bg-white text-stone-900 shadow-xs"
                                    : "text-stone-600 hover:text-stone-900"
                                }`}
                              >
                                <Crop className="w-3 h-3" />
                                <span>Fill & Crop Circle</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Upload & Remove buttons */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                          <label className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all active:scale-95">
                            <Upload className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {isUploadingLogo
                                ? "Uploading..."
                                : logoPreview || logoInputUrl
                                ? "Change Logo"
                                : "Upload Logo"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoFileUpload}
                              className="hidden"
                              disabled={isUploadingLogo}
                            />
                          </label>

                          {(logoPreview || logoInputUrl) && (
                            <button
                              type="button"
                              onClick={() => {
                                setLogoPreview("");
                                setLogoInputUrl("");
                              }}
                              className="px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
                            >
                              Remove Logo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Live Devotee Pass Mockup */}
                    <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-300 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                          <span>🪔 Devotee Pass Slip Preview</span>
                        </span>
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                          Live On Booking Pass
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-amber-200 shadow-inner flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-amber-50 p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
                          {logoPreview || logoInputUrl ? (
                            <img
                              src={logoPreview || logoInputUrl}
                              alt="Logo"
                              className={`w-full h-full ${logoFitMode === 'cover' ? 'object-cover' : 'object-contain'}`}
                            />
                          ) : (
                            <span className="text-base">卐</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif font-black text-xs text-[#8B1E1E] truncate">
                            {currentMandapam.name}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">
                            Pass #DEV-8291 • Slot: Daily Sahasranama Archana
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MANDAPAM COVER PHOTO */}
              {brandingTab === "cover" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-stone-700 flex items-start gap-2">
                    <span className="text-base shrink-0">🌄</span>
                    <div>
                      <strong>Devotee Hero Banner:</strong> Devotees visiting your Mandapam page will see this cover photo prominently at the very top of your profile!
                    </div>
                  </div>

                  {/* Perfect Aspect-Ratio Hero Banner Preview */}
                  <div className="space-y-2.5 p-3 sm:p-4 rounded-2xl bg-stone-50 border-2 border-amber-200 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                        <span>Devotee Hero Banner Live Preview</span>
                      </span>
                      {(photoPreview || photoInputUrl) && (
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview("");
                            setPhotoInputUrl("");
                          }}
                          className="text-[11px] font-bold text-red-600 hover:text-red-700 underline cursor-pointer"
                        >
                          Reset to Default
                        </button>
                      )}
                    </div>

                    {/* Banner Aspect Ratio Container (16:7 format) with Devotee View Mockup */}
                    <div className="w-full aspect-[16/7] sm:aspect-[16/6] rounded-2xl overflow-hidden border-2 border-amber-400 bg-stone-900 relative shadow-md group">
                      <img
                        src={
                          photoPreview ||
                          photoInputUrl ||
                          currentMandapam.coverImageUrl ||
                          navaratriAsset("/navaratri/assets/maa-durga-temple-darshan.jpg")
                        }
                        alt="Mandapam Cover Banner"
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-102"
                      />
                      {/* Devotee View Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15 pointer-events-none" />

                      {/* Mockup Top Action Pills */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full bg-white/90 text-stone-900 text-[9px] font-bold shadow-xs">
                          Mandapam QR
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/90 text-stone-900 text-[9px] font-bold shadow-xs">
                          Share
                        </span>
                      </div>

                      {/* Mockup Bottom Profile Floating Card */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center gap-2 pointer-events-none">
                        <div className="w-8 h-8 rounded-full border-2 border-amber-300 bg-white p-0.5 shrink-0 overflow-hidden shadow-xs">
                          {logoPreview || logoInputUrl ? (
                            <img
                              src={logoPreview || logoInputUrl}
                              alt="Logo"
                              className={`w-full h-full ${logoFitMode === 'cover' ? 'object-cover' : 'object-contain'}`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">卐</div>
                          )}
                        </div>
                        <div className="min-w-0 drop-shadow-md">
                          <p className="font-serif font-black text-white text-xs sm:text-sm truncate leading-tight">
                            {currentMandapam.name}
                          </p>
                          <p className="text-[10px] text-amber-200 truncate flex items-center gap-1">
                            <span>📍 {editArea || currentMandapam.area}, {editCity || currentMandapam.city}</span>
                            <span>•</span>
                            <span className="text-emerald-300">Verified</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Upload button & file input */}
                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                      <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all active:scale-95">
                        <Upload className="w-4 h-4 shrink-0" />
                        <span>{isUploadingPhoto ? "Uploading..." : "Upload New Cover Photo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileUpload}
                          className="hidden"
                          disabled={isUploadingPhoto}
                        />
                      </label>
                      <span className="text-[10px] text-stone-500">
                        Recommended: 1200 × 600px (16:9 ratio)
                      </span>
                    </div>
                  </div>

                  {/* Preset Themes / Sanctuaries */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-800 block">
                      Or Choose from Consecrated Festive Themes:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        {
                          title: "Temple Sanctum",
                          desc: "Traditional Sanctum with brass lamps & flowers",
                          url: navaratriAsset("/navaratri/assets/maa-durga-temple-darshan.jpg")
                        },
                        {
                          title: "Royal Gold Sanctum",
                          desc: "Opulent Golden Arch & Deep Warm Illumination",
                          url: navaratriAsset("/navaratri/assets/royal-temple-gold-sanctum.jpg")
                        },
                        {
                          title: "Divine Maroon Arch",
                          desc: "Traditional South Indian Brass & Maroon Arch",
                          url: navaratriAsset("/navaratri/assets/royal-maroon-arch.jpg")
                        },
                        {
                          title: "Golden Lotus Sanctum",
                          desc: "Sacred Golden Lotus Devotional Ambiance",
                          url: navaratriAsset("/navaratri/assets/golden-lotus-bg.jpg")
                        }
                      ].map((preset) => {
                        const isSelected =
                          photoPreview === preset.url ||
                          (!photoPreview && currentMandapam.coverImageUrl === preset.url);
                        return (
                          <button
                            key={preset.title}
                            type="button"
                            onClick={() => {
                              setPhotoPreview(preset.url);
                              setPhotoInputUrl(preset.url);
                              toast.success(`Selected ${preset.title}! Click 'Save Branding & Details' below.`);
                            }}
                            className={`p-2 rounded-2xl border-2 text-left transition-all overflow-hidden cursor-pointer flex items-center gap-3 ${
                              isSelected
                                ? "border-[#8B1E1E] bg-amber-50/80 ring-2 ring-[#8B1E1E]/20 shadow-xs"
                                : "border-stone-200 hover:border-amber-400 bg-white"
                            }`}
                          >
                            <div className="w-16 h-12 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-200">
                              <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-stone-900 truncate block">
                                  {preset.title}
                                </span>
                                {isSelected && (
                                  <span className="shrink-0 w-4 h-4 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center text-[10px]">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-stone-500 line-clamp-1 leading-tight">
                                {preset.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LOCATION & ADDRESS */}
              {brandingTab === "location" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-stone-700 flex items-start gap-2">
                    <span className="text-base shrink-0">📍</span>
                    <div>
                      <strong>Directions & Maps:</strong> Keep your street address accurate so visiting devotees can easily find your mandapam with one tap on Google Maps!
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Street Address / Landmark *
                      </label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="e.g. 3-5-260/2, Shivaji Nagar Rd, Kotagally"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">
                          Area / Locality *
                        </label>
                        <input
                          type="text"
                          value={editArea}
                          onChange={(e) => setEditArea(e.target.value)}
                          placeholder="e.g. Kotagally"
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          placeholder="e.g. Nizamabad"
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* GPS coordinates from onboarding */}
                    {currentMandapam.latitude && currentMandapam.longitude ? (
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                            📡 GPS Coordinates Captured
                          </span>
                          <p className="text-xs font-mono text-stone-700">
                            {currentMandapam.latitude.toFixed(6)}, {currentMandapam.longitude.toFixed(6)}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            Used by visiting devotees for live distance & "Near Me" searches.
                          </p>
                        </div>
                        <a
                          href={`https://www.google.com/maps?q=${currentMandapam.latitude},${currentMandapam.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors"
                        >
                          Open Maps
                        </a>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                        ⚠️ No GPS pin recorded yet.
                      </div>
                    )}

                    {/* Preview of Directions Card */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Devotee Directions Preview
                      </span>
                      <p className="font-semibold text-stone-800">
                        📍 {editAddress ? `${editAddress}, ` : ""}{editArea || currentMandapam.area}, {editCity || currentMandapam.city}
                      </p>
                      {currentMandapam.latitude && currentMandapam.longitude && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${currentMandapam.latitude},${currentMandapam.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 transition-colors"
                        >
                          🗺️ Get Directions on Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ORGANIZER CONTACT & PUBLIC VIEW */}
              {brandingTab === "organizer" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-stone-700 flex items-start gap-2">
                    <span className="text-base shrink-0">👤</span>
                    <div>
                      <strong>Public Committee Details:</strong> Control how your mandapam organizer or youth committee contact details appear on your public visitor card.
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Toggle: Show on Public View */}
                    <div className="p-3.5 rounded-2xl bg-white border border-amber-300 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-stone-900">
                          Display Organizer Details on Public Card
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Devotees visiting your mandapam can see committee contact and tap to call or WhatsApp.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={showOrganizerPublicly}
                          onChange={(e) => setShowOrganizerPublicly(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B1E1E]"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Organizer / Committee Name *
                      </label>
                      <input
                        type="text"
                        value={editOrganizerName}
                        onChange={(e) => setEditOrganizerName(e.target.value)}
                        placeholder="e.g. Committee Name / Your Name"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">
                          Organizer Mobile / Phone *
                        </label>
                        <input
                          type="tel"
                          value={editOrganizerMobile}
                          onChange={(e) => setEditOrganizerMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="e.g. 9876543210"
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">
                          WhatsApp Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={editWhatsappNumber}
                          onChange={(e) => setEditWhatsappNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="e.g. 9876543210"
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Devotee Contact Card Live Preview */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Devotee Contact Preview
                      </span>
                      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-stone-200">
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 text-xs truncate">
                            {editOrganizerName || currentMandapam.organizerName || "Mandapam Committee"}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">
                            Phone: {editOrganizerMobile || currentMandapam.organizerMobile || "Not specified"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                            <Phone className="w-3 h-3" /> Call
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                            <MessageCircle className="w-3 h-3" /> WhatsApp
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-stone-50 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2.5">
              {(currentMandapam.logoUrl || currentMandapam.coverImageUrl || currentMandapam.cardBgImageUrl || logoPreview || photoPreview) && (
                <button
                  type="button"
                  onClick={handleResetMandapamBranding}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 text-xs font-bold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setBrandingModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingBranding}
                  onClick={handleSaveMandapamBranding}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  {isSavingBranding ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Branding & Details</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

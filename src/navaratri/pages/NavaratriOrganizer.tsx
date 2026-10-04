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
  Filter
} from "lucide-react";
import { toast } from "sonner";

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
  const [eventBookingEnabled, setEventBookingEnabled] = useState(false);

  // Two-Step Delete Account Modal State
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  // New announcement input
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [annPriority, setAnnPriority] = useState<"NORMAL" | "HIGH">("NORMAL");

  // Mandapam Branding, Media & Location State
  const [brandingModalOpen, setBrandingModalOpen] = useState(false);
  const [brandingTab, setBrandingTab] = useState<"logo" | "photos" | "location" | "organizer">("logo");
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
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#8B1E1E] to-[#B45309] text-white flex items-center justify-center shadow-lg border-2 border-amber-300">
            <Lock className="w-8 h-8 text-amber-200" />
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

  const mandapamActivities = activities.filter((a) => a.mandapamId === currentMandapam.id);
  const mandapamBookings = bookings.filter((b) => b.mandapamId === currentMandapam.id);
  const onlineBookingsCount = mandapamBookings.filter((b) => b.bookingType === "ONLINE").length;
  const walkinBookingsCount = mandapamBookings.filter((b) => b.bookingType === "WALK_IN").length;

  const mandapamServices = services.filter((s) => s.mandapamId === currentMandapam.id);
  const mandapamSlots = slots.filter((s) => s.mandapamId === currentMandapam.id);

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
              <div><strong>Issued:</strong> ${new Date(b.createdAt).toLocaleString()}</div>
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
      bookingEnabled: eventBookingEnabled,
      published: true
    });

    setEventTitle("");
    setEventDescription("");
    setCustomCategory("");
    setEventModalOpen(false);
    toast.success("Festival event added and published successfully!");
  };

  const handleDeleteAccount = () => {
    if (!currentMandapam) return;

    const mandapamName = currentMandapam.name;
    const success = deleteMandapam(currentMandapam.id);
    if (success) {
      sessionStorage.removeItem("navaratri_organizer_id");
      setAuthenticatedMandapamId(null);
      setDeleteStep(0);
      setDeleteConfirmInput("");
      toast.success(`${mandapamName} account has been permanently deleted.`);
      navigate("/navaratri");
    } else {
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

  const handleSaveMandapamBranding = () => {
    if (!currentMandapam) return;
    const finalLogo = logoPreview.trim() || logoInputUrl.trim() || undefined;
    const finalPhoto = photoPreview.trim() || photoInputUrl.trim() || undefined;

    const updates: Partial<typeof currentMandapam> = {};
    if (finalLogo) {
      updates.logoUrl = finalLogo;
      localStorage.setItem(`mandapam_logo_${currentMandapam.id}`, finalLogo);
    }
    if (finalPhoto) {
      updates.coverImageUrl = finalPhoto;
      updates.cardBgImageUrl = finalPhoto;
      localStorage.setItem(`mandapam_cover_${currentMandapam.id}`, finalPhoto);
      localStorage.setItem(`mandapam_card_bg_${currentMandapam.id}`, finalPhoto);
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

    updateMandapam(currentMandapam.id, updates);
    setBrandingModalOpen(false);
    toast.success("Mandapam logo, photo, location, and organizer details saved! Devotees scanning your QR code will see your updated branding.");
  };

  const handleResetMandapamBranding = () => {
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
    setBrandingModalOpen(false);
    toast.info("Mandapam logo and photos reset to default theme.");
  };

  return (
    <div className="space-y-8 pb-16 font-sans max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Banner with Mandapam ID, Passcode, Download Slip, Photo & Logout */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-[#9A241C] via-[#8B1E1E] to-[#781B1B] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {(currentMandapam.coverImageUrl || currentMandapam.cardBgImageUrl) && (
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
            <img
              src={currentMandapam.coverImageUrl || currentMandapam.cardBgImageUrl}
              alt={currentMandapam.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B1E1E] via-[#8B1E1E]/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mandapam Control Center</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 bg-sky-950/70 px-2.5 py-0.5 rounded-full border border-sky-400/50 shadow-sm">
              <InstagramVerifiedBadge className="w-3.5 h-3.5" />
              <span>Verified Organizer</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {(currentMandapam.logoUrl || (typeof window !== "undefined" && localStorage.getItem(`mandapam_logo_${currentMandapam.id}`))) && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md bg-white p-1 shrink-0">
                <img
                  src={currentMandapam.logoUrl || localStorage.getItem(`mandapam_logo_${currentMandapam.id}`) || ""}
                  alt="Mandapam Logo"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            )}
            <div>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-white flex items-center gap-2">
                <span>{currentMandapam.name}</span>
                <InstagramVerifiedBadge className="w-6 h-6 shrink-0 drop-shadow" title="Official Verified Mandapam" />
              </h1>
              <p className="text-xs text-amber-100">
                {currentMandapam.area}, {currentMandapam.city} • Organizer: {currentMandapam.organizerName} ({currentMandapam.organizerMobile})
              </p>
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

            {/* Protected Passcode Indicator */}
            <div className="flex items-center gap-1.5 bg-black/30 border border-emerald-400/40 px-2.5 py-1 rounded-xl text-emerald-200">
              <Lock className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-semibold text-[11px]">Passcode: Protected in Slip</span>
            </div>
          </div>
        </div>

        {/* Control Center Actions */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:justify-end items-stretch gap-2 md:max-w-[480px]">
          {/* Download Access Slip */}
          <button
            type="button"
            onClick={() => downloadMandapamCredentials(currentMandapam, sessionPasscode)}
            className="px-3.5 py-2 rounded-xl bg-emerald-400 text-stone-900 text-xs font-bold hover:bg-emerald-300 shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Download Official Mandapam Access Slip"
          >
            <Download className="w-4 h-4 text-emerald-900" />
            <span>Download Access Slip</span>
          </button>

          {/* Mandapam Logo, Photos & Location Button */}
          <button
            type="button"
            onClick={() => {
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
            className="px-3.5 py-2 rounded-xl bg-amber-400 text-stone-900 text-xs font-bold hover:bg-amber-300 shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Upload Logo, Mandapam Photos, Location & Committee Details"
          >
            <Camera className="w-4 h-4 text-[#8B1E1E]" />
            <span>Branding, Photos & Info</span>
          </button>

          <button
            onClick={() => setQrModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold hover:bg-amber-50 shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#8B1E1E]" />
            <span>Counter Standee</span>
          </button>

          <Link
            to={`/navaratri/m/${currentMandapam.slug}`}
            className="px-3.5 py-2 rounded-xl bg-white/90 text-stone-900 text-xs font-bold hover:bg-amber-50 shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#8B1E1E]" />
            <span>View Public Page</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold border border-white/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Log out from organizer dashboard"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDeleteStep(1);
              setDeleteConfirmInput("");
            }}
            className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-700 text-red-100 hover:text-white text-xs font-bold border border-red-300/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Permanently delete this mandapam profile, photos and schedules"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
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
          <span className="leading-tight">10-Day Festival Schedule Manager</span>
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

      {/* TAB 1: 10-DAY FESTIVAL SCHEDULE MANAGER */}
      {activeTab === "days" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-amber-50/80 p-4 rounded-2xl border border-amber-300">
            <div>
              <h2 className="font-serif font-black text-xl text-[#8B1E1E]">
                Day-to-Day Festival Data (All 10 Divine Days)
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Click "Edit Day Data" on any day to customize Alankaranas, dual morning/evening sessions, pooja timings, Bhog (Naivedhyam), and Annadanam.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenDrawerForDay(1)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Quick Update Today (Day 1)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STANDARD_NAVARATRI_DAYS.map((day) => {
              const setting = daySettings.find((s) => s.mandapamId === currentMandapam.id && s.dayNumber === day.dayNumber);
              const customAlankarana = alankaranas.find((a) => a.mandapamId === currentMandapam.id && a.date === day.date);

              const deviTitle = setting?.isDualAlankarana 
                ? `${setting.morningDeviName || day.deviName} (Morning) / ${setting.eveningDeviName || day.deviName} (Evening)`
                : (setting?.useStandardDevi === false && setting?.customDeviName ? setting.customDeviName : day.deviName);

              const poojaTimings = setting?.useStandardPooja === false && setting?.customPoojaTimings
                ? setting.customPoojaTimings
                : "Morning: 07:30 AM | Evening: 06:30 PM (Maha Harathi)";

              const naivedhyam = setting?.useStandardNaivedhyam === false && setting?.customNaivedhyam
                ? setting.customNaivedhyam
                : day.suggestedOfferings;

              const isAnnadanam = setting?.annadanamEnabled ?? true;

              return (
                <div
                  key={day.dayNumber}
                  className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-amber-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs text-white"
                        style={{ backgroundColor: day.colorHex }}
                      >
                        D{day.dayNumber}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-amber-900 uppercase">Day {day.dayNumber} • {day.date}</span>
                        <h3 className="font-serif font-black text-base text-stone-900 leading-tight">
                          {deviTitle}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenDrawerForDay(day.dayNumber)}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#8B1E1E] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Edit Day {day.dayNumber}
                    </button>
                  </div>

                  {/* Dual Session Badge if applicable */}
                  {setting?.isDualAlankarana && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-300 text-[11px] font-semibold text-[#8B1E1E]">
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      <span>Morning: {setting.morningDeviName}</span>
                      <span className="text-stone-400">|</span>
                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Evening: {setting.eveningDeviName}</span>
                    </div>
                  )}

                  {/* Timings, Bhog, and Annadanam */}
                  <div className="space-y-1.5 text-xs text-stone-700 pt-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate">{poojaTimings}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PrasadBowlIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate"><strong className="text-amber-950">Bhog:</strong> {naivedhyam}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Utensils className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>
                        <strong className="text-amber-950">Annadanam:</strong>{" "}
                        {isAnnadanam ? (
                          <span className="text-emerald-800 font-bold">Active (12:30 PM - 03:30 PM)</span>
                        ) : (
                          <span className="text-stone-500">Not active today</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {act.category}
                      </span>
                      <h3 className="font-serif font-black text-lg text-[#8B1E1E] mt-1">
                        {act.title}
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
                    <option value="Pooja">Pooja / Homam</option>
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
                  >
                  </input>
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

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Location / Venue *
                </label>
                <input
                  type="text"
                  required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Mandapam Main Stage / Community Ground"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                />
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  <span className="text-[10px] text-stone-500 font-semibold self-center">Choose Location:</span>
                  {[
                    "Mandapam Main Stage",
                    "Mandapam Sanctum (Garbhalayam)",
                    "Community Festival Ground",
                    "Annadanam Dining Pandal",
                    "Temple Street Main Arch",
                    "Cultural Stage"
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
                    Mandapam Branding, Media & Location
                  </h3>
                  <p className="text-[11px] text-amber-100">
                    Add committee logo, mandapam photo & location for visitors who scan
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
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-amber-200 bg-amber-50/60 p-1.5 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBrandingTab("logo")}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  brandingTab === "logo"
                    ? "bg-[#8B1E1E] text-white shadow-xs"
                    : "text-stone-700 hover:bg-white/60"
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${logoPreview ? "text-amber-300" : "opacity-0"}`} />
                <span>1. Logo</span>
              </button>

              <button
                type="button"
                onClick={() => setBrandingTab("photos")}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  brandingTab === "photos"
                    ? "bg-[#8B1E1E] text-white shadow-xs"
                    : "text-stone-700 hover:bg-white/60"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>2. Photos</span>
              </button>

              <button
                type="button"
                onClick={() => setBrandingTab("location")}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  brandingTab === "location"
                    ? "bg-[#8B1E1E] text-white shadow-xs"
                    : "text-stone-700 hover:bg-white/60"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>3. Location</span>
              </button>

              <button
                type="button"
                onClick={() => setBrandingTab("organizer")}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  brandingTab === "organizer"
                    ? "bg-[#8B1E1E] text-white shadow-xs"
                    : "text-stone-700 hover:bg-white/60"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>4. Organizer</span>
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* TAB 1: COMMITTEE LOGO */}
              {brandingTab === "logo" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-stone-700">
                    💡 <strong>Visitor Visibility:</strong> Devotees who scan your standee QR code will see this official emblem / logo proudly on your mandapam hero banner and devotee pass slip!
                  </div>

                  {/* Logo Preview */}
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-stone-50 border border-amber-200">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 bg-white shadow-md flex items-center justify-center p-1 shrink-0">
                      {logoPreview || logoInputUrl ? (
                        <img
                          src={logoPreview || logoInputUrl}
                          alt="Mandapam Logo Preview"
                          className="w-full h-full object-contain rounded-xl"
                          onError={() => toast.error("Could not load logo preview.")}
                        />
                      ) : (
                        <div className="text-center p-2 text-[10px] text-stone-600 font-bold">
                          No Logo Set
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="font-serif font-black text-sm text-[#8B1E1E]">
                        {currentMandapam.name}
                      </div>
                      <p className="text-[11px] text-stone-500">
                        {logoPreview || logoInputUrl ? "Custom committee emblem active" : "Using default auspicious kolam icon"}
                      </p>
                      {(logoPreview || logoInputUrl) && (
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPreview("");
                            setLogoInputUrl("");
                          }}
                          className="text-[11px] font-bold text-red-600 hover:text-red-700 underline cursor-pointer"
                        >
                          Remove Logo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Upload Logo Option 1: File from Phone / Device */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Upload Logo from Device
                    </label>
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-colors group">
                      <Upload className="w-6 h-6 text-[#8B1E1E] group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-xs font-bold text-stone-800">
                        {isUploadingLogo ? "Optimizing logo..." : "Tap to Select Committee Logo"}
                      </span>
                      <span className="text-[10px] text-stone-600 font-medium">
                        Supports PNG, JPG, WebP (auto-scaled square)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="hidden"
                        disabled={isUploadingLogo}
                      />
                    </label>
                  </div>

                  {/* Upload Logo Option 2: Online URL */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Or Paste Logo Web URL
                    </label>
                    <input
                      type="url"
                      value={logoInputUrl}
                      onChange={(e) => {
                        setLogoInputUrl(e.target.value);
                        setLogoPreview(e.target.value);
                      }}
                      placeholder="https://example.com/youth-logo.png"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: MANDAPAM PHOTOS & BANNER */}
              {brandingTab === "photos" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Photo Preview */}
                  {(photoPreview || photoInputUrl) && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-stone-700">Cover Photo Preview</label>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview("");
                            setPhotoInputUrl("");
                          }}
                          className="text-[11px] font-bold text-red-600 hover:text-red-700 underline cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      </div>
                      <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md">
                        <img
                          src={photoPreview || photoInputUrl}
                          alt="Mandapam Preview"
                          className="w-full h-full object-cover"
                          onError={() => {
                            toast.error("Image failed to load. Please check the URL or try another photo.");
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                          <span className="text-[11px] font-bold text-white drop-shadow">
                            Displayed on {currentMandapam.name} visitor cards
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Option 1: File from Phone / Device */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Option 1: Upload from Phone / Device
                    </label>
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-colors group">
                      <Upload className="w-6 h-6 text-[#8B1E1E] group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-xs font-bold text-stone-800">
                        {isUploadingPhoto ? "Processing photo..." : "Tap to Select Mandapam Photo"}
                      </span>
                      <span className="text-[10px] text-stone-600 font-medium">
                        Supports JPG, PNG, WebP (auto-compressed for best speed)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoFileUpload}
                        className="hidden"
                        disabled={isUploadingPhoto}
                      />
                    </label>
                  </div>

                  {/* Upload Option 2: Image URL */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-800">
                      Option 2: Or Paste Online Image URL
                    </label>
                    <input
                      type="url"
                      value={photoInputUrl}
                      onChange={(e) => {
                        setPhotoInputUrl(e.target.value);
                        setPhotoPreview(e.target.value);
                      }}
                      placeholder="https://example.com/our-mandapam.jpg"
                      className="w-full px-3.5 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Option 3: Presets */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-stone-800">
                      Option 3: Or Choose Devotional Theme
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PRESET_MANDAPAM_BACKGROUNDS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setPhotoPreview(preset.url);
                            setPhotoInputUrl(preset.url);
                          }}
                          className={`relative rounded-xl overflow-hidden border-2 text-left p-1 transition-all cursor-pointer ${
                            photoPreview === preset.url
                              ? "border-amber-500 ring-2 ring-amber-400"
                              : "border-stone-200 hover:border-amber-300"
                          }`}
                        >
                          <div className="h-14 w-full rounded-lg overflow-hidden relative">
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-full object-cover"
                            />
                            {photoPreview === preset.url && (
                              <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                                  <Check className="w-3 h-3" />
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-[10px] font-bold text-stone-800 mt-1 truncate px-0.5">
                            {preset.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LOCATION & ADDRESS */}
              {brandingTab === "location" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-stone-700">
                    📍 <strong>Directions & Maps:</strong> Keep your street address accurate so visiting devotees can easily find your mandapam with one tap on Google Maps!
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
                        className="w-full px-3.5 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                          placeholder="e.g. Nizamabad"
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Preview of Directions Card */}
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Devotee Directions Preview
                      </span>
                      <p className="font-semibold text-stone-800">
                        📍 {editAddress ? `${editAddress}, ` : ""}{editArea}, {editCity}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ORGANIZER CONTACT & PUBLIC VIEW */}
              {brandingTab === "organizer" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-stone-700">
                    👤 <strong>Public Committee Details:</strong> Control how your mandapam organizer or youth committee contact details appear on your public visitor card.
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
                        placeholder="e.g. Hrudhaya Ragu Ram Youth Committee / RAGHU"
                        className="w-full px-3.5 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                          placeholder="e.g. 6303602743"
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                          placeholder="e.g. 6303602743"
                          className="w-full px-3.5 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-stone-50 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2.5">
              {(currentMandapam.logoUrl || currentMandapam.coverImageUrl || currentMandapam.cardBgImageUrl) && (
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
                  className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMandapamBranding}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Branding & Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

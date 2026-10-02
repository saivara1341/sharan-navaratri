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
import { Activity } from "../types";
import {
  ShieldCheck,
  Upload,
  Calendar,
  Clock,
  Users,
  Utensils,
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
  Sparkles,
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
  PartyPopper
} from "lucide-react";
import { toast } from "sonner";

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
    deleteMandapam
  } = useNavaratriData();
  const { t } = useNavaratriLanguage();

  // Authentication State
  const [authenticatedMandapamId, setAuthenticatedMandapamId] = useState<string | null>(() => {
    return sessionStorage.getItem("navaratri_organizer_id") || null;
  });

  // Login Form State
  const [loginInput, setLoginInput] = useState("");
  const [loginPasscode, setLoginPasscode] = useState("");
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
  const [eventCategory, setEventCategory] = useState<Activity["category"]>("Special Program");
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
    sessionStorage.setItem("navaratri_organizer_id", matched.id);
    toast.success(`Welcome to ${matched.name} Organizer Dashboard!`);
  };

  const handleLogout = () => {
    setAuthenticatedMandapamId(null);
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
                list="mandapam-suggestions"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="e.g. Mandapam ID or 10-digit Mobile number"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <datalist id="mandapam-suggestions">
                {mandapams.map((m) => (
                  <option key={m.id} value={m.organizerMobile || m.id}>
                    {m.name} ({m.area})
                  </option>
                ))}
              </datalist>
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

    createActivity({
      mandapamId: currentMandapam.id,
      title: eventTitle.trim(),
      category: eventCategory,
      date: eventDate.trim(),
      startTime: eventStartTime.trim(),
      endTime: eventEndTime.trim(),
      location: eventLocation.trim(),
      description: eventDescription.trim(),
      bookingEnabled: eventBookingEnabled,
      published: true
    });

    setEventTitle("");
    setEventDescription("");
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

  return (
    <div className="space-y-8 pb-16 font-sans max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Banner with Mandapam ID, Passcode, Download Slip & Logout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#9A241C] via-[#8B1E1E] to-[#781B1B] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
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

          <h1 className="font-serif font-black text-2xl sm:text-3xl text-white flex items-center gap-2">
            <span>{currentMandapam.name}</span>
            <InstagramVerifiedBadge className="w-6 h-6 shrink-0 drop-shadow" title="Official Verified Mandapam" />
          </h1>

          <p className="text-xs text-amber-100">
            {currentMandapam.area}, {currentMandapam.city} • Organizer: {currentMandapam.organizerName} ({currentMandapam.organizerMobile})
          </p>

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

            {/* Confidential Protected Passcode Indicator */}
            <div className="flex items-center gap-1.5 bg-black/30 border border-emerald-400/30 px-2.5 py-1 rounded-xl text-emerald-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-[11px]">Passcode: Protected in Slip</span>
            </div>

            {/* Download Credentials Slip */}
            <button
              type="button"
              onClick={() => downloadMandapamCredentials(currentMandapam)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 text-stone-900 font-bold hover:bg-amber-300 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Access Slip</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setQrModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold hover:bg-amber-50 shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#8B1E1E]" />
            <span>Counter Standee</span>
          </button>

          <Link
            to={`/navaratri/m/${currentMandapam.slug}`}
            className="px-3.5 py-2 rounded-xl bg-amber-400/90 text-stone-900 text-xs font-bold hover:bg-amber-300 shadow-md flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Page</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Log out from organizer dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
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
          <PartyPopper className="w-4 h-4 text-amber-500 shrink-0" />
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
              <Plus className="w-4 h-4" />
              <span>Add New Festival Event</span>
            </button>
          </div>

          {mandapamActivities.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-amber-300 p-6 space-y-3">
              <PartyPopper className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-stone-900">No Events Added Yet</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Organize special homams, Dandiya nights, or children competitions and publish them so devotees across town can participate!
              </p>
              <button
                type="button"
                onClick={() => setEventModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold shadow-sm"
              >
                + Add First Event
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
          <div className="rounded-3xl border border-amber-300 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <h2 className="font-serif text-base sm:text-lg font-black text-[#8B1E1E] flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Citizen Bookings & Walk-In Crowds</span>
              </h2>
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-xl transition-colors cursor-pointer"
              >
                + Issue Walk-In Token
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-[10px] font-bold uppercase text-stone-500">Total Devotees</p>
                <p className="text-xl font-black text-stone-900 mt-1">{mandapamBookings.length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
                <p className="text-[10px] font-bold uppercase text-stone-500">Online Passes</p>
                <p className="text-xl font-black text-blue-900 mt-1">{onlineBookingsCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-[10px] font-bold uppercase text-stone-500">Counter Tokens</p>
                <p className="text-xl font-black text-emerald-900 mt-1">{walkinBookingsCount}</p>
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-2 pt-2">
              {mandapamBookings.length === 0 ? (
                <p className="text-xs text-stone-500 italic text-center py-4">No citizen bookings recorded yet.</p>
              ) : (
                mandapamBookings.map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-900">{b.name} ({b.mobile})</p>
                      <p className="text-[11px] text-stone-500">{b.bookingCode} • {b.quantity} Devotee(s) • {b.bookingType}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {b.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* DANGER ZONE: ACCOUNT DELETION */}
      <div className="rounded-3xl border border-red-300 bg-gradient-to-r from-red-50/95 via-red-50/60 to-amber-50/30 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-800">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Danger Zone • Mandapam Account Management</span>
          </div>
          <h3 className="font-serif text-base sm:text-lg font-black text-red-950">
            Delete Mandapam Account
          </h3>
          <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
            If your committee no longer requires this portal or festivities have ended, you can permanently delete your mandapam profile, photos, and pooja schedules.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDeleteStep(1);
            setDeleteConfirmInput("");
          }}
          className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Mandapam Account</span>
        </button>
      </div>

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
          onClose={() => setRegisterModalOpen(false)}
        />
      )}

      {qrModalOpen && (
        <ShareQrModal
          mandapam={currentMandapam}
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
                <PartyPopper className="w-5 h-5 text-amber-300" />
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
                  Location / Stage
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Mandapam Main Stage / Community Ground"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                />
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
                  className="px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] text-white font-bold shadow-sm"
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
                  <li>Your unique Mandapam ID and passcode credentials will be revoked.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteStep(0)}
                className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors"
              >
                Cancel & Keep Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteStep(2);
                  setDeleteConfirmInput("");
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
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
                  To confirm permanent deletion, type <span className="font-mono bg-stone-200 px-1.5 py-0.5 rounded text-red-800 font-bold">DELETE</span> or enter your passcode:
                </label>
                <input
                  type="text"
                  value={deleteConfirmInput}
                  onChange={(e) => setDeleteConfirmInput(e.target.value)}
                  placeholder="Type DELETE or enter passcode"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-red-300 focus:border-red-600 focus:outline-none text-sm font-semibold bg-white"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteStep(1)}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors"
              >
                ← Back to Step 1
              </button>
              <button
                type="button"
                disabled={
                  deleteConfirmInput.trim().toUpperCase() !== "DELETE" &&
                  deleteConfirmInput.trim() !== (currentMandapam.passcode || "123456") &&
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
    </div>
  );
};

import { navaratriAsset } from "../utils/navaratriAssets";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../context/NavaratriLanguageContext";
import { DailyUpdateDrawer } from "../components/organizer/DailyUpdateDrawer";
import { WalkInRegisterModal } from "../components/organizer/WalkInRegisterModal";
import { ShareQrModal } from "../components/citizen/ShareQrModal";
import { STANDARD_NAVARATRI_DAYS } from "../data/standardNavaratriDays";
import { downloadMandapamCredentials, copyToClipboard } from "../utils/mandapamCredentials";
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
  X
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

  // Modals & Drawers
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

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

    const expectedPasscode = matched.passcode || "123456";
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

  // Tomorrow preparation checklist
  const [checklist, setChecklist] = useState({
    devi: true,
    alankarana: false,
    pooja: true,
    naivedhyam: true,
    prasadam: true,
    items: true,
    services: true,
    bookings: true,
    annadanam: true,
    announcement: true
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // If NOT authenticated, show the Login Screen
  if (!authenticatedMandapamId) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-20 font-sans">
        {/* Login Card */}
        <div className="rounded-3xl border border-amber-300 bg-white/95 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B1E1E] to-[#B45309] text-white shadow-md">
              <Lock className="h-7 w-7" />
            </div>
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-900">
              Mandapam Committee Access
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#8B1E1E]">
              Mandapam Organizer Portal
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Enter your official Mandapam ID (or registered mobile) and passcode to manage your notice board and citizen bookings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Mandapam ID or Registered Mobile *
              </label>
              <input
                type="text"
                required
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Enter Mandapam ID or Registered Mobile"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-800">
                  Passcode / PIN *
                </label>
                <span className="text-[10px] text-stone-500">4–6 digits</span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPasscode ? "text" : "password"}
                  maxLength={6}
                  required
                  value={loginPasscode}
                  onChange={(e) => setLoginPasscode(e.target.value)}
                  placeholder="Enter passcode (4–6 digits)"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-amber-300 bg-white text-xs font-mono font-bold tracking-widest text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPasscode(!showLoginPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                  aria-label={showLoginPasscode ? "Hide passcode" : "Show passcode"}
                >
                  {showLoginPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Login to Mandapam Dashboard →</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Selected mandapam for authenticated organizer
  const currentMandapam =
    mandapams.find((m) => m.id === authenticatedMandapamId) ||
    mandapams.find((m) => m.id === activeMandapamId) ||
    mandapams[0];

  const todayAlankarana = alankaranas.find((a) => a.mandapamId === currentMandapam.id);
  const todaySetting = daySettings.find(
    (s) => s.mandapamId === currentMandapam.id && s.dayNumber === 1
  );
  const tomorrowSetting = daySettings.find(
    (s) => s.mandapamId === currentMandapam.id && s.dayNumber === 2
  );

  const mandapamBookings = bookings.filter((b) => b.mandapamId === currentMandapam.id);
  const onlineBookingsCount = mandapamBookings.filter((b) => b.bookingType === "ONLINE").length;
  const walkinBookingsCount = mandapamBookings.filter((b) => b.bookingType === "WALK_IN").length;

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
    <div className="space-y-8 pb-16 font-sans">
      {/* Top Banner with Mandapam ID, Passcode, Download Slip & Logout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#9A241C] via-[#8B1E1E] to-[#781B1B] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Operational Control Center</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
              ● Live & Verified
            </span>
          </div>

          <h1 className="font-serif font-black text-2xl sm:text-3xl text-white">
            {currentMandapam.name}
          </h1>

          <p className="text-xs text-amber-100">
            {currentMandapam.area}, {currentMandapam.city} • Organizer: {currentMandapam.organizerName}
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
                className="text-white/70 hover:text-white ml-1 p-0.5"
                title="Copy Mandapam ID"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>

            {/* Passcode Badge */}
            <div className="flex items-center gap-1 bg-black/30 border border-white/20 px-2.5 py-1 rounded-xl">
              <span className="text-amber-300 font-bold">Passcode:</span>
              <span className="font-mono font-bold tracking-widest">
                {showDashboardPasscode ? currentMandapam.passcode || "12345678" : "••••••••"}
              </span>
              <button
                type="button"
                onClick={() => setShowDashboardPasscode(!showDashboardPasscode)}
                className="text-white/70 hover:text-white ml-0.5 p-0.5"
                title={showDashboardPasscode ? "Hide Passcode" : "Show Passcode"}
              >
                {showDashboardPasscode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(currentMandapam.passcode || "12345678", "Passcode")}
                className="text-white/70 hover:text-white p-0.5"
                title="Copy Passcode"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>

            {/* Download Credentials Slip */}
            <button
              type="button"
              onClick={() => downloadMandapamCredentials(currentMandapam)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-400 text-stone-900 font-bold hover:bg-amber-300 shadow-sm transition-all"
            >
              <Download className="w-3 h-3" />
              <span>Download Access Slip</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setQrModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold hover:bg-amber-50 shadow-md flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-4 h-4 text-[#8B1E1E]" />
            <span>Counter Standee</span>
          </button>

          <Link
            to={`/navaratri/m/${currentMandapam.slug}`}
            className="px-3.5 py-2 rounded-xl bg-amber-400/90 text-stone-900 text-xs font-bold hover:bg-amber-300 shadow-md flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Public Page</span>
          </Link>

          <button
            onClick={() => {
              setDeleteStep(1);
              setDeleteConfirmInput("");
            }}
            className="px-3 py-2 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-200 hover:text-white text-xs font-bold border border-red-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Delete this mandapam account"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Delete Account</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-colors"
            title="Log out from organizer dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* QUICK OPERATIONAL TOOLBAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setUpdateDrawerOpen(true)}
          className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-300 hover:border-[#8B1E1E] shadow-sm hover:shadow text-left space-y-1 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 group-hover:bg-[#8B1E1E] text-[#8B1E1E] group-hover:text-white flex items-center justify-center transition-colors">
            <Upload className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-stone-900">Upload Alankarana</p>
          <p className="text-[11px] text-stone-500">Daily Maa Darshan photo & updates</p>
        </button>

        <button
          onClick={() => setRegisterModalOpen(true)}
          className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-300 hover:border-[#8B1E1E] shadow-sm hover:shadow text-left space-y-1 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white flex items-center justify-center transition-colors">
            <Users className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-stone-900">Walk-In Register</p>
          <p className="text-[11px] text-stone-500">{mandapamBookings.length} total devotees</p>
        </button>

        <button
          onClick={() => setUpdateDrawerOpen(true)}
          className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-300 hover:border-[#8B1E1E] shadow-sm hover:shadow text-left space-y-1 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-100 group-hover:bg-blue-600 text-blue-800 group-hover:text-white flex items-center justify-center transition-colors">
            <Utensils className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-stone-900">Annadanam Setup</p>
          <p className="text-[11px] text-stone-500">12:30 PM (1200 expected)</p>
        </button>

        <button
          onClick={() => setQrModalOpen(true)}
          className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-300 hover:border-[#8B1E1E] shadow-sm hover:shadow text-left space-y-1 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-100 group-hover:bg-purple-600 text-purple-800 group-hover:text-white flex items-center justify-center transition-colors">
            <Printer className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-stone-900">Print QR Standee</p>
          <p className="text-[11px] text-stone-500">A4 Festival Display</p>
        </button>
      </div>

      {/* DASHBOARD GRID: 2 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): Today's Operations & Live Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Alankarana & Schedule Card */}
          <div className="rounded-3xl border border-amber-300 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  Day 1 • 2026-10-11
                </span>
                <h2 className="font-serif text-lg font-black text-[#8B1E1E]">
                  Today's Divine Alankarana & Schedule
                </h2>
              </div>
              <button
                onClick={() => setUpdateDrawerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#8B1E1E] text-xs font-bold transition-colors"
              >
                Edit Today's Schedule
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs text-stone-500 font-semibold">Devi Alankarana</p>
                <div className="flex items-center gap-3">
                  <img
                    src={todayAlankarana?.imageUrl || navaratriAsset("/navaratri/assets/royal-maroon-arch.jpg")}
                    alt="Devi"
                    className="w-16 h-16 rounded-2xl object-cover border border-amber-300 shadow"
                  />
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-900">
                      {todayAlankarana?.deviName || "Sri Bala Tripura Sundari Devi"}
                    </h3>
                    <p className="text-xs text-amber-800 font-medium">
                      Color of the Day: Golden Yellow
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-stone-500 font-semibold">Key Timings</p>
                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Pooja: 07:30 AM & 06:30 PM (Maha Harathi)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils className="w-3.5 h-3.5 text-amber-700" />
                    <span>Annadanam: 12:30 PM – 03:30 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-amber-700" />
                    <span>Pallaki Seva: 08:30 PM (Ward Colony Route)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Post Live Mandapam Announcement */}
          <div className="rounded-3xl border border-amber-300 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <h2 className="font-serif text-base sm:text-lg font-black text-[#8B1E1E] flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-700" />
                <span>Publish Announcement to Devotees</span>
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
                  className="px-4 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-xs font-bold shadow transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bookings & Devotee Flow Tracker */}
          <div className="rounded-3xl border border-amber-300 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <h2 className="font-serif text-base sm:text-lg font-black text-[#8B1E1E] flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Citizen Bookings & Walk-In Crowds</span>
              </h2>
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-xl transition-colors"
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
          </div>
        </div>

        {/* Right Column: Tomorrow Preparation Checklist & QR Standee */}
        <div className="space-y-6">
          {/* Tomorrow Preparation Checklist */}
          <div className="rounded-3xl border border-amber-300 bg-[#FFFDF9] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="border-b border-amber-200 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                Day 2 Preparation
              </span>
              <h2 className="font-serif text-base sm:text-lg font-black text-[#8B1E1E]">
                Tomorrow Readiness Checklist
              </h2>
              <p className="text-[11px] text-stone-500">
                Ensure everything is verified before midnight
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: "devi", label: "Devi Alankarana confirmed (Gayatri Devi)" },
                { key: "alankarana", label: "Special silk saree & flowers arranged" },
                { key: "pooja", label: "Morning & evening pooja timings verified" },
                { key: "naivedhyam", label: "Naivedhyam (Katta Pongali / Chitrannam)" },
                { key: "prasadam", label: "Prasadam distribution tokens ready" },
                { key: "annadanam", label: "Maha Annadanam provisions stocked" },
                { key: "announcement", label: "Tomorrow's schedule posted on portal" }
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-100/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checklist[key as keyof typeof checklist] || false}
                    onChange={() => toggleCheck(key as keyof typeof checklist)}
                    className="rounded border-amber-300 text-[#8B1E1E] focus:ring-[#8B1E1E]"
                  />
                  <span
                    className={`font-semibold ${
                      checklist[key as keyof typeof checklist]
                        ? "text-stone-800 line-through opacity-75"
                        : "text-stone-900"
                    }`}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Standee Preview & Quick Actions */}
          <div className="rounded-3xl border border-amber-300 bg-white p-5 sm:p-6 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-[#8B1E1E] flex items-center justify-center shadow">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              Mandapam QR Standee
            </h3>
            <p className="text-xs text-stone-600">
              Print this official A4 QR standee and place it near your Mandapam stage or darshan line for devotees to scan.
            </p>
            <button
              onClick={() => setQrModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Preview & Print Standee</span>
            </button>
          </div>
        </div>
      </div>

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

      {/* TWO-STEP DELETE CONFIRMATION MODALS */}
      {/* STEP 1 OF 2: FIRST WARNING & ACKNOWLEDGEMENT */}
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
                  <li>Your public devotee page (<span className="font-mono text-[11px] text-stone-900">/navaratri/m/{currentMandapam.slug}</span>) will be taken offline immediately.</li>
                  <li>All daily Alankarana photos, darshan updates, and announcements will be erased.</li>
                  <li>Devotees scanning your counter QR code will no longer see your mandapam.</li>
                  <li>Your unique Mandapam ID (<span className="font-mono font-bold text-stone-900">{currentMandapam.id}</span>) and passcode credentials will be revoked.</li>
                </ul>
              </div>

              <p className="text-xs text-stone-500 italic bg-amber-50 p-2.5 rounded-lg border border-amber-200/60">
                ℹ️ For your security, the platform requires a second final confirmation step before permanent removal.
              </p>
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
                🚨 <strong>FINAL WARNING: THIS ACTION IS IRREVERSIBLE.</strong> Once confirmed, this mandapam account will be permanently purged and cannot be recovered.
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

              <div className="p-2.5 rounded-xl bg-stone-100 text-[11px] text-stone-600 flex items-center justify-between">
                <span>Target: <strong>{currentMandapam.name}</strong></span>
                <span className="font-mono font-bold text-stone-800">ID: {currentMandapam.id}</span>
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
                  deleteConfirmInput.trim() !== (currentMandapam.passcode || "12345678") &&
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

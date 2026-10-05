import { navaratriAsset } from "../utils/navaratriAssets";
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Heart,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
  Utensils,
  Music2,
  ChevronRight,
  Building,
  QrCode,
  KeyRound,
  ArrowRight
} from "lucide-react";
import { DandiyaIcon } from "../components/devotional/DandiyaIcon";
import { MandapamGoldIcon } from "../components/devotional/MandapamGoldIcon";
import { FloatingAuspiciousParticles } from "../components/devotional/SacredMotionGraphics";
import { useNavaratriData, isDemoOrMockMandapam } from "../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../context/NavaratriLanguageContext";
import { NineDaySchedule } from "../components/citizen/NineDaySchedule";
import { AuspiciousRibbonBorder } from "../components/devotional/AuspiciousRibbonBorder";
import { InstagramVerifiedBadge } from "../components/devotional/InstagramVerifiedBadge";
import { NavaratriFlankingAdBox } from "../components/ads/NavaratriFlankingAdBox";

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export const NavaratriHome: React.FC = () => {
  const { mandapams, alankaranas, followedIds, scannedIds, userLocation, activeMandapam, isOrganizerLoggedIn, isAdmin } = useNavaratriData();
  const { t } = useNavaratriLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenScanner = () => {
    window.dispatchEvent(new Event("navaratri:open-scanner"));
  };

  const primaryConnectedMandapam = useMemo(() => {
    if (scannedIds.length > 0) {
      const found = mandapams.find(m => m.id === scannedIds[0] && !isDemoOrMockMandapam(m));
      if (found) {
        return {
          ...found,
          sourceType: "SCANNED" as const,
          todayAlankarana: alankaranas.find((item) => item.mandapamId === found.id)
        };
      }
    }
    if (followedIds.length > 0) {
      const found = mandapams.find(m => m.id === followedIds[0] && !isDemoOrMockMandapam(m));
      if (found) {
        return {
          ...found,
          sourceType: "FOLLOWED" as const,
          todayAlankarana: alankaranas.find((item) => item.mandapamId === found.id)
        };
      }
    }
    return null;
  }, [scannedIds, followedIds, mandapams, alankaranas]);

  const savedMandapams = useMemo(() => {
    const ids = new Set([...followedIds, ...scannedIds]);
    return mandapams
      .filter((mandapam) => ids.has(mandapam.id) && !isDemoOrMockMandapam(mandapam))
      .map((mandapam) => ({
        ...mandapam,
        source: followedIds.includes(mandapam.id) ? "Following" : "Scanned",
        todayAlankarana: alankaranas.find((item) => item.mandapamId === mandapam.id)
      }));
  }, [alankaranas, followedIds, mandapams, scannedIds]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/navaratri/near-me?q=${encodeURIComponent(query)}` : "/navaratri/near-me");
  };

  return (
    <div className="max-w-7xl xl:max-w-[1380px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 space-y-4 sm:space-y-5 lg:space-y-6 pb-8 sm:pb-12 pt-2 sm:pt-4 font-sans">
      {/* 0. CONNECTED / SCANNED MANDAPAM BANNER (SHOWN UPON SCANNING & OPENING LANDING PAGE) */}
      {primaryConnectedMandapam && (
        <div
          onClick={() => navigate(`/navaratri/m/${primaryConnectedMandapam.slug}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate(`/navaratri/m/${primaryConnectedMandapam.slug}`);
            }
          }}
          className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-amber-400 bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] p-4 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {/* Subtle decorative temple corner filigree */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-amber-400/20 to-transparent pointer-events-none rounded-bl-full" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 sm:gap-4.5 min-w-0">
              {/* Mandapam Logo with glowing golden frame */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-amber-400/40 blur-md group-hover:scale-110 transition-transform" />
                <img
                  src={
                    primaryConnectedMandapam.logoUrl ||
                    primaryConnectedMandapam.todayAlankarana?.imageUrl ||
                    primaryConnectedMandapam.coverImageUrl ||
                    navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg")
                  }
                  alt={primaryConnectedMandapam.name}
                  className="relative h-14 w-14 sm:h-18 sm:w-18 rounded-2xl border-2 border-amber-400 object-cover shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 rounded-full bg-[#8B1E1E] text-[10px] text-amber-200 px-1.5 py-0.2 border border-amber-300 font-bold shadow-xs">
                  卐
                </span>
              </div>

              {/* Mandapam Details */}
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#8B1E1E] px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-xs tracking-wide">
                    {primaryConnectedMandapam.sourceType === "SCANNED" ? (
                      <>
                        <QrCode className="h-3 w-3 text-amber-300" />
                        <span>YOUR SCANNED MANDAPAM</span>
                      </>
                    ) : (
                      <>
                        <Heart className="h-3 w-3 fill-current text-amber-300" />
                        <span>YOUR CONNECTED SHRINE</span>
                      </>
                    )}
                  </span>
                  {primaryConnectedMandapam.verificationStatus === "VERIFIED" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-800 border border-sky-300 px-2 py-0.5 text-[9px] font-bold shadow-xs">
                      <InstagramVerifiedBadge className="h-3 w-3" /> Verified Mandapam
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live Notice Board
                  </span>
                </div>

                <h2 className="font-serif text-base sm:text-xl font-black text-[#8B1E1E] truncate group-hover:text-[#6B1111] transition-colors flex items-center gap-1.5">
                  <span>{primaryConnectedMandapam.name}</span>
                  <InstagramVerifiedBadge className="w-4 h-4 shrink-0 drop-shadow-xs" />
                </h2>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-700 font-medium">
                  <span className="flex items-center gap-1 font-semibold text-amber-900">
                    <MapPin className="h-3.5 w-3.5 text-[#8B1E1E] shrink-0" />
                    {primaryConnectedMandapam.area}, {primaryConnectedMandapam.city}
                  </span>
                  <span className="hidden sm:inline text-amber-300">•</span>
                  <span className="text-[11px] sm:text-xs text-stone-600">
                    Today's Pooja: <strong className="text-[#8B1E1E]">{primaryConnectedMandapam.todayAlankarana?.deviName || primaryConnectedMandapam.deviName}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Tap to Open Button */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto">
              <div className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] group-hover:from-[#781B1B] group-hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-1.5 transition-all">
                <span>Open Mandapam Page</span>
                <ChevronRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. TOP SECTION: SACRED HERO CONTAINER */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-amber-500/30 bg-gradient-to-r from-[#5C1010] via-[#8B1E1E] to-[#781B1B] flex flex-col justify-between max-w-7xl xl:max-w-[1380px] 2xl:max-w-[1440px] mx-auto">
        {/* Top Ornamental Temple Filigree Border from User Design */}
        <div
          aria-hidden="true"
          className="w-full h-4 sm:h-5 md:h-6 pointer-events-none select-none relative z-10"
          style={{
            backgroundImage: `url('${navaratriAsset("/navaratri/assets/royal-maroon-gold-filigree-border.png")}')`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
            backgroundPosition: "center"
          }}
        />

        <FloatingAuspiciousParticles />

        <div className="relative z-10 p-5 sm:p-6 md:p-6 lg:p-7 xl:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 lg:gap-6 text-white flex-1">
          <div className="max-w-2xl space-y-3 sm:space-y-3.5 lg:space-y-5 xl:space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/40 text-xs font-bold tracking-wide backdrop-blur-sm shadow-sm">
              <img
                src={navaratriAsset("/navaratri/assets/sacred-lotus-flower.png")}
                alt="Sacred Lotus"
                className="h-6 sm:h-7 w-auto shrink-0 object-contain drop-shadow-[0_2px_6px_rgba(245,158,11,0.6)]"
              />
              <span className="tracking-wide">
                SHARAN NAVARATRI <span className="font-['Cinzel',serif] font-black text-xs sm:text-sm text-amber-300 tracking-wider drop-shadow-sm">2026</span> • 9 DAYS OF DIVINE BLISS
              </span>
            </div>

            <div className="space-y-2 lg:space-y-3">
              <h1 className="font-['Cinzel',serif] font-black text-2xl sm:text-3xl md:text-3.5xl lg:text-4xl xl:text-[2.6rem] text-[#FFFBEB] leading-snug tracking-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]">
                Celebrate{" "}
                <span className="inline-flex items-center gap-1.5 sm:gap-2 align-middle">
                  <span>Sharan</span>
                  <img
                    src={navaratriAsset("/navaratri/assets/maa-durga-simhavahana-icon.png")}
                    alt="Maa Durga Matha"
                    className="inline-block md:hidden h-11 sm:h-12 w-auto object-contain align-middle -translate-y-1 drop-shadow-[0_2px_14px_rgba(251,191,36,0.95)]"
                  />
                </span>{" "}
                Navaratri <span className="text-amber-300">2026</span> with Maa Durga's Divine Blessings
              </h1>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs sm:text-sm md:text-base text-amber-100/90 leading-relaxed max-w-2xl font-medium">
                One QR. Every Mandapam. Everything a devotee needs. Discover today’s sacred Maa Darshan, live poojas, and annadanam offerings across all mandapams.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-1 lg:pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 bg-[#FAF7F0] p-2 sm:p-2.5 rounded-xl sm:rounded-full shadow-xl border-2 border-amber-400">
                <div className="flex items-center gap-2.5 flex-1 px-3 w-full text-stone-900">
                  <Search className="w-4 h-4 text-[#8B1E1E] shrink-0" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t.searchPlaceholder || "Search Mandapam by name, colony or area..."}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-stone-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 sm:px-7 sm:py-3 rounded-lg sm:rounded-full bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-md transition-all whitespace-nowrap tracking-wide cursor-pointer"
                >
                  Find My Mandapam
                </button>
              </div>
            </form>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-3 pt-1 lg:pt-2 text-xs font-semibold">
              <Link to="/navaratri/near-me?category=annadanam" className="min-h-10 sm:min-h-11 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-center transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
                <span className="flex items-center justify-center gap-1.5 text-amber-100 text-xs">
                  <Utensils className="w-3.5 h-3.5 shrink-0 text-amber-200" />
                  <span className="truncate">Annadanam Near Me</span>
                </span>
              </Link>
              <Link to="/navaratri/near-me?category=bhajans_pallaki" className="min-h-10 sm:min-h-11 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-center transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
                <span className="flex items-center justify-center gap-1.5 text-amber-100 text-xs">
                  <Music2 className="w-3.5 h-3.5 shrink-0 text-amber-200" />
                  <span className="truncate">Pallaki Seva & Bhajans</span>
                </span>
              </Link>
              <Link to="/navaratri/near-me?category=activities" className="min-h-10 sm:min-h-11 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-center transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
                <span className="flex items-center justify-center gap-1.5 text-amber-100 text-xs">
                  <DandiyaIcon className="w-4 h-4 shrink-0 text-amber-200" />
                  <span className="truncate">Dandiya & Activities</span>
                </span>
              </Link>
              <Link to="/navaratri/know" className="min-h-10 sm:min-h-11 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-center transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
                <span className="flex items-center justify-center gap-1.5 text-amber-100 text-xs">
                  <BookOpen className="w-3.5 h-3.5 shrink-0 text-amber-200" />
                  <span className="truncate">Sacred Devi Guide</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Right side Maa Durga image in desktop view */}
          <div className="hidden md:flex flex-col items-center justify-end shrink-0 relative self-end">
            <div className="relative">
              {/* Layered divine golden halo glow */}
              <div className="absolute inset-x-0 bottom-0 h-4/5 bg-amber-400/20 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute inset-0 bg-amber-300/10 blur-2xl rounded-full scale-105 pointer-events-none" />
              <img
                src={navaratriAsset("/navaratri/assets/maa-durga-hero-canvas.png")}
                alt="Maa Durga Simhavahana Darshan"
                className="relative z-10 w-64 md:w-72 lg:w-80 xl:w-96 h-auto object-contain drop-shadow-[0_8px_30px_rgba(251,191,36,0.4)] hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Ornamental Temple Filigree Border from User Design (Inverted) */}
        <div
          aria-hidden="true"
          className="w-full h-4 sm:h-5 md:h-6 pointer-events-none select-none relative z-10 rotate-180"
          style={{
            backgroundImage: `url('${navaratriAsset("/navaratri/assets/royal-maroon-gold-filigree-border.png")}')`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
            backgroundPosition: "center"
          }}
        />
      </section>

      {/* QUICK ACTIONS ROW: FLANKED BY AD SPACE BOXES IN DESKTOP VIEW */}
      <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 -mt-2 sm:-mt-4 md:-mt-6 lg:-mt-8 xl:-mt-10 pt-0 pb-1 relative z-20">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-3 lg:gap-4 xl:gap-6">
          {/* Left Ad Space Box (Before this design - Desktop View Only) */}
          <div className="hidden lg:flex w-48 xl:w-56 2xl:w-60 shrink-0 self-stretch min-h-[190px] max-h-[240px]">
            <NavaratriFlankingAdBox position="left" />
          </div>

          {/* Center Design: Scan QR + Swastika + Register Durga Mandapam + Mandapam Login */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full">
            <div className="flex flex-row flex-nowrap items-center justify-center gap-1.5 min-[360px]:gap-2.5 sm:gap-8 pt-0.5 sm:pt-1 pb-0 sm:pb-1 w-full px-2">
              <button
                type="button"
                onClick={handleOpenScanner}
                className="group relative w-36 min-[360px]:w-[152px] min-[400px]:w-44 sm:w-52 lg:w-60 xl:w-64 h-36 min-[360px]:h-[152px] min-[400px]:h-44 sm:h-52 lg:h-60 xl:h-64 p-2 sm:p-4 flex flex-col items-center justify-center text-[#1E3A8A] font-bold transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:ring-offset-2 cursor-pointer shrink"
              >
                <img
                  src={navaratriAsset("/navaratri/assets/blue-scalloped-cta-frame.png")}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-contain drop-shadow-md transition-all group-hover:drop-shadow-xl pointer-events-none"
                />
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-1.5 max-w-[108px] min-[360px]:max-w-[120px] sm:max-w-none space-y-0.5 sm:space-y-1">
                  <div className="w-5 h-5 min-[360px]:w-6 min-[360px]:h-6 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-blue-100/90 border border-blue-300 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <QrCode className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#1E3A8A]" />
                  </div>
                  <span className="font-serif text-[10px] min-[360px]:text-[11px] sm:text-sm lg:text-base font-black leading-tight text-[#1E3A8A] tracking-tight">
                    Scan Mandapam<br />QR (Camera)
                  </span>
                </div>
              </button>

              {/* Sacred Swastika Divider between Scan QR and Register Mandapam */}
              <div className="flex items-center justify-center gap-0.5 min-[360px]:gap-1 sm:gap-2.5 px-0.5 sm:px-1 select-none pointer-events-none self-center shrink-0" aria-hidden="true">
                <span className="w-1.5 min-[360px]:w-2.5 sm:w-6 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-amber-500 rounded-full" />
                <div className="relative w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border-2 border-amber-400/90 shadow-md flex items-center justify-center">
                  <span className="text-xs min-[360px]:text-sm sm:text-base font-black text-[#8B1E1E] leading-none drop-shadow-[0_1px_2px_rgba(245,158,11,0.5)]">
                    卐
                  </span>
                </div>
                <span className="w-1.5 min-[360px]:w-2.5 sm:w-6 h-0.5 bg-gradient-to-l from-transparent via-amber-400 to-amber-500 rounded-full" />
              </div>

              <Link
                to={isOrganizerLoggedIn ? "/navaratri/organizer" : "/navaratri/login?mode=new"}
                className="group relative w-36 min-[360px]:w-[152px] min-[400px]:w-44 sm:w-52 lg:w-60 xl:w-64 h-36 min-[360px]:h-[152px] min-[400px]:h-44 sm:h-52 lg:h-60 xl:h-64 p-2 sm:p-4 flex flex-col items-center justify-center text-[#8B1E1E] font-bold transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1E1E] focus-visible:ring-offset-2 shrink"
              >
                <img
                  src={navaratriAsset("/navaratri/assets/ivory-scalloped-cta-frame.png")}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-contain drop-shadow-md transition-all group-hover:drop-shadow-xl pointer-events-none"
                />
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-1.5 max-w-[108px] min-[360px]:max-w-[120px] sm:max-w-none space-y-0.5 sm:space-y-1">
                  <div className="w-5 h-5 min-[360px]:w-6 min-[360px]:h-6 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-amber-100/90 border border-amber-300 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform p-1">
                    {isOrganizerLoggedIn ? (
                      <MandapamGoldIcon className="w-4 h-4 sm:w-7 sm:h-7" />
                    ) : (
                      <Building className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#8B1E1E]" />
                    )}
                  </div>
                  <span className="font-serif text-[10px] min-[360px]:text-[11px] sm:text-sm lg:text-base font-black leading-tight text-[#8B1E1E] tracking-tight">
                    {isOrganizerLoggedIn ? (
                      <>Mandapam<br />Dashboard</>
                    ) : (
                      <>Register Your<br />Durga Mandapam</>
                    )}
                  </span>
                </div>
              </Link>
            </div>

            {/* Organizer Quick Access: Dynamic based on logged in state */}
            <div className="w-full flex items-center justify-center px-2 sm:px-4 mt-2 sm:mt-3 mb-0 sm:mb-1">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-orange-50 border border-amber-300 shadow-xs text-xs text-stone-700">
                {isOrganizerLoggedIn ? (
                  <>
                    <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                      <MandapamGoldIcon className="w-4 h-4 shrink-0" />
                      <span>Active Mandapam: <strong>{activeMandapam?.name || "Organizer Portal"}</strong></span>
                    </span>
                    <Link
                      to="/navaratri/organizer"
                      className="font-bold text-[#8B1E1E] hover:text-[#781B1B] inline-flex items-center gap-1 bg-amber-100/80 hover:bg-amber-200/90 px-2.5 py-1 rounded-xl transition-all border border-amber-300/80 shadow-2xs hover:shadow-xs active:scale-95"
                    >
                      <span>Open Mandapam Portal</span>
                      <ArrowRight className="w-3 h-3 text-[#8B1E1E]" />
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                      <span>🚩</span>
                      <span>Already registered your Durga Mandapam?</span>
                    </span>
                    <Link
                      to="/navaratri/login?mode=new"
                      className="font-bold text-[#8B1E1E] hover:text-[#781B1B] inline-flex items-center gap-1 bg-amber-100/80 hover:bg-amber-200/90 px-2.5 py-1 rounded-xl transition-all border border-amber-300/80 shadow-2xs hover:shadow-xs active:scale-95"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#8B1E1E]" />
                      <span>Login as Mandapam</span>
                      <ArrowRight className="w-3 h-3 text-[#8B1E1E]" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Ad Space Box (After this design - Desktop View Only) */}
          <div className="hidden lg:flex w-48 xl:w-56 2xl:w-60 shrink-0 self-stretch min-h-[190px] max-h-[240px]">
            <NavaratriFlankingAdBox position="right" />
          </div>
        </div>
      </section>

      {/* Sacred Emerald Vine Ribbon Divider below 2 CTA Designs */}
      <AuspiciousRibbonBorder
        variant="emerald-vine"
        heightClass="h-8 sm:h-11 md:h-13 lg:h-15"
        className="rounded-none my-4 sm:my-6"
      />

      {/* 2. YOUR FOLLOWED MANDAPAMS (IF ANY) */}
      {savedMandapams.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800">Personal Shrines</p>
              <h2 className="font-['Cinzel',serif] text-2xl font-black text-[#8B1E1E]">Your Saved & Followed Mandapams</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#8B1E1E] text-xs font-bold">
              {savedMandapams.length} {savedMandapams.length === 1 ? "Mandapam" : "Mandapams"}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {savedMandapams.map((mandapam) => {
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mandapam.latitude},${mandapam.longitude}`;
              return (
                <article
                  key={mandapam.id}
                  className="overflow-hidden rounded-[1.75rem] border-2 border-amber-300 bg-white p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={mandapam.todayAlankarana?.imageUrl || mandapam.coverImageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg")}
                      alt={mandapam.name}
                      className="h-20 w-20 shrink-0 rounded-2xl border border-amber-300 object-cover shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        {mandapam.source === "Following" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#8B1E1E] px-2.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                            <Heart className="h-3 w-3 fill-current text-amber-300" />
                            Following
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-2.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                            <QrCode className="h-3 w-3" />
                            Scanned QR
                          </span>
                        )}
                        {mandapam.verificationStatus === "VERIFIED" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 border border-sky-300 px-2 py-0.5 text-[9px] font-bold text-sky-800">
                            <InstagramVerifiedBadge className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-base sm:text-lg font-black leading-tight text-[#8B1E1E] flex items-center gap-1.5">
                        <span>{mandapam.name}</span>
                        <InstagramVerifiedBadge className="w-4 h-4 shrink-0 drop-shadow-xs" />
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-stone-600">
                        <MapPin className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                        <span>{mandapam.area}, {mandapam.city}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 p-2.5 text-xs">
                    <p className="font-bold text-[#8B1E1E]">Today: {mandapam.todayAlankarana?.deviName || mandapam.deviName}</p>
                    <p className="mt-0.5 text-stone-600 text-[11px]">Annadanam: 12:30 PM–3:30 PM • Maha Harathi: 6:30 PM</p>
                  </div>

                  <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                    <Link to={`/navaratri/m/${mandapam.slug}`} className="rounded-xl bg-[#8B1E1E] px-4 py-2.5 text-center text-xs font-bold text-white hover:bg-[#781B1B] shadow transition-colors">
                      Open Mandapam Website
                    </Link>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Navigate to ${mandapam.name}`}
                      className="grid h-10 w-11 place-items-center rounded-xl border border-amber-300 bg-amber-50 text-[#8B1E1E] hover:bg-amber-100 transition-colors"
                    >
                      <Navigation className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. 9-DAY SACRED NAVARATRI CALENDAR & ALANKARANAS */}
      <section className="space-y-4 -mt-2 sm:-mt-3">
        <NineDaySchedule />
      </section>
    </div>
  );
};

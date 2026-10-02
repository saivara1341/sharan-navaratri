import { navaratriAsset } from "../utils/navaratriAssets";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../context/NavaratriLanguageContext";
import { TodayTomorrowView } from "../components/citizen/TodayTomorrowView";
import { NineDaySchedule } from "../components/citizen/NineDaySchedule";
import { ServiceBookingModal } from "../components/citizen/ServiceBookingModal";
import { PallakiSevaView } from "../components/citizen/PallakiSevaView";
import { DheekshaGuideView } from "../components/citizen/DheekshaGuideView";
import { NimarjanamView } from "../components/citizen/NimarjanamView";
import { CommunityQnA } from "../components/citizen/CommunityQnA";
import { ShareQrModal } from "../components/citizen/ShareQrModal";
import { SponsoredCard } from "../components/ads/SponsoredCard";
import { TempleArchFrame } from "../components/devotional/TempleArchFrame";
import { InstagramVerifiedBadge } from "../components/devotional/InstagramVerifiedBadge";
import {
  MapPin,
  Share2,
  Heart,
  QrCode,
  ShieldCheck,
  Phone,
  Clock,
  Utensils,
  Calendar,
  Flame,
  ShoppingBag,
  Bell,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

export const NavaratriMandapamDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    mandapams,
    alankaranas,
    daySettings,
    services,
    slots,
    activities,
    pallakiSevas,
    dheekshaPrograms,
    nimarjanamSchedules,
    announcements,
    questions,
    advertisements,
    toggleFollow,
    isFollowing,
    markScanned
  } = useNavaratriData();
  const { t } = useNavaratriLanguage();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [qrModalOpen, setQrModalOpen] = useState(false);

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
          Mandapam Not Found
        </h2>
        <p className="text-sm text-stone-600 max-w-md">
          We couldn't locate this specific mandapam page. It may have been updated or you can browse other active mandapams.
        </p>
        <Link
          to="/navaratri"
          className="px-6 py-2.5 rounded-xl bg-[#8B1E1E] text-white text-sm font-bold shadow-md hover:bg-[#9A241C]"
        >
          Explore All Mandapams
        </Link>
      </div>
    );
  }

  const todayAlankarana = alankaranas.find(a => a.mandapamId === mandapam.id);
  const todaySetting = daySettings.find(s => s.mandapamId === mandapam.id && s.dayNumber === 1);
  const tomorrowSetting = daySettings.find(s => s.mandapamId === mandapam.id && s.dayNumber === 2);
  const mandapamServices = services.filter(s => s.mandapamId === mandapam.id && s.enabled);
  const mandapamActivities = activities.filter(a => a.mandapamId === mandapam.id && a.published);
  const mandapamPallaki = pallakiSevas.filter(p => p.mandapamId === mandapam.id && p.published);
  const mandapamDheeksha = dheekshaPrograms.find(d => d.mandapamId === mandapam.id);
  const mandapamNimarjanam = nimarjanamSchedules.find(n => n.mandapamId === mandapam.id);
  const mandapamAnnouncements = announcements.filter(a => a.mandapamId === mandapam.id && a.published);
  const mandapamQuestions = questions.filter(q => q.mandapamId === mandapam.id && q.status === "PUBLISHED");
  const localAds = advertisements.filter(a => a.status === "ACTIVE" || a.status === "APPROVED");

  const handleFollowToggle = () => {
    toggleFollow(mandapam.id);
    if (!following) {
      toast.success(`You are now following ${mandapam.name}! It is now saved on your Home landing page.`);
    } else {
      toast.info(`Unfollowed ${mandapam.name}`);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${mandapam.name} - Navaratri Mandapam`,
        text: `Check out Today's Maa Darshan, Pooja timings, Annadanam and book services for ${mandapam.name}:`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Mandapam link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. MANDAPAM HEADER HERO WITH COVER & PROFILE */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-300 shadow-xl bg-white">
        {/* Cover Photo */}
        <div className="h-48 sm:h-64 w-full relative bg-[#8B1E1E]">
          <img
            src={mandapam.coverImageUrl || navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg")}
            alt={mandapam.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Quick Action Top Bar */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setQrModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-stone-900 text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors backdrop-blur-sm"
            >
              <QrCode className="w-3.5 h-3.5 text-[#8B1E1E]" />
              <span>Mandapam QR</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-md transition-colors backdrop-blur-sm"
              title="Share Mandapam"
            >
              <Share2 className="w-4 h-4 text-stone-800" />
            </button>
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="p-5 sm:p-6 bg-[#FDFBF7] relative -mt-12 mx-3 sm:mx-6 rounded-2xl border border-amber-200/90 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 border-2 border-amber-400 p-0.5 shadow-md shrink-0 overflow-hidden">
                <img
                  src={mandapam.logoUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg")}
                  alt="Logo"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif font-black text-xl sm:text-2xl text-[#8B1E1E] flex items-center gap-1.5">
                    <span>{mandapam.name}</span>
                    <InstagramVerifiedBadge className="w-5 h-5 shrink-0 drop-shadow-xs" title="Official Verified Mandapam" />
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[11px] font-bold flex items-center gap-1 border border-sky-300 shadow-xs">
                    <InstagramVerifiedBadge className="w-3.5 h-3.5" />
                    <span>{t.verifiedMandapam}</span>
                  </span>
                </div>

                <p className="text-xs text-stone-600 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{mandapam.address}, {mandapam.area}, {mandapam.city} - {mandapam.pincode}</span>
                </p>

                <p className="text-xs text-stone-700 pt-0.5 max-w-2xl leading-relaxed">
                  {mandapam.description}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <button
                onClick={handleFollowToggle}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 ${
                  following
                    ? "bg-amber-100 text-[#8B1E1E] border border-amber-400"
                    : "bg-[#8B1E1E] text-white hover:bg-[#9A241C]"
                }`}
              >
                <Heart className={`w-4 h-4 ${following ? "fill-current text-[#8B1E1E]" : ""}`} />
                <span>{following ? t.followingBtn : t.follow}</span>
              </button>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${mandapam.name}, ${mandapam.address}, ${mandapam.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-stone-800 border border-amber-300 text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#8B1E1E]" />
                <span>{t.directions}</span>
              </a>

              <a
                href={`tel:${mandapam.contactPhone}`}
                className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-colors"
                title="Call Mandapam Help Desk"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S MAA DARSHAN HERO & PHYSICAL ALANKARANA */}
      <section className="p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#FEF3C7] border-2 border-[#D97706]/40 shadow-lg space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#8B1E1E] text-white text-[11px] font-bold">
            <span>🪔</span> {t.todayDarshan} • Day 1
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#8B1E1E]">
            {todayAlankarana?.deviName || mandapam.deviName}
          </h2>
          <p className="text-xs text-stone-600">
            Concealed in sacred sanctum garlands, ornaments and traditional silk
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <TempleArchFrame
            imageUrl={todayAlankarana?.imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg")}
            title={todayAlankarana?.deviName || mandapam.deviName}
            subtitle={todayAlankarana?.title || "Daily Darshan"}
            badge="Actual Consecrated Idol"
            className="w-full max-w-sm"
          >
            <div className="text-center text-xs text-stone-600 pt-1">
              Photo uploaded directly by verified Mandapam committee
            </div>
          </TempleArchFrame>

          {/* Quick Timings & Today Offerings Card */}
          <div className="w-full max-w-md space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#8B1E1E]" />
                {t.poojaTimings} Today
              </span>
              <p className="text-xs text-stone-800 font-semibold leading-relaxed">
                {todaySetting?.customPoojaTimings || "Morning 07:30 AM (Kalash & Ganapathi) | Evening 06:30 PM (Maha Harathi)"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-[#B45309]" />
                {t.annadanamToday}
              </span>
              <p className="text-xs text-stone-800 leading-relaxed">
                Timings: <strong className="text-stone-900">12:30 PM - 03:30 PM</strong>
                <br />
                Location: {todaySetting?.annadanamLocation || "Dining Hall, Ground Floor"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                {t.naivedhyam} & {t.prasadam}
              </span>
              <p className="text-xs text-stone-800 leading-relaxed">
                {todaySetting?.customNaivedhyam || "Sweet Pongal (Chakkara Pongali), Cow Ghee, Honey, Fresh Bananas"}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedServiceId(undefined);
                setBookingModalOpen(true);
              }}
              className="w-full py-3 rounded-2xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{t.bookService} Online (Free Pass)</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. TODAY & TOMORROW PREPARATION VIEW */}
      <section>
        <TodayTomorrowView
          mandapam={mandapam}
          todaySetting={todaySetting}
          tomorrowSetting={tomorrowSetting}
          todayAlankarana={todayAlankarana}
          onBookServiceClick={(id) => {
            setSelectedServiceId(id);
            setBookingModalOpen(true);
          }}
        />
      </section>

      {/* 4. SERVICES & BOOKINGS ENGINE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
          <div>
            <h3 className="font-serif font-black text-xl text-[#8B1E1E] flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <span>Available Poojas & Special Sevas</span>
            </h3>
            <p className="text-xs text-stone-600">
              Reserve your individual participation slot in advance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mandapamServices.map((srv) => (
            <div
              key={srv.id}
              className="p-5 rounded-3xl bg-[#FFFDF9] border border-amber-300 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-[#8B1E1E] uppercase">
                    {srv.type}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {srv.durationMinutes} mins
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-[#8B1E1E]">
                  {srv.name}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {srv.description}
                </p>
                {srv.itemsRequired && (
                  <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200/60 mt-1">
                    <strong>Items to bring:</strong> {srv.itemsRequired}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">
                  Slots Open
                </span>
                <button
                  onClick={() => {
                    setSelectedServiceId(srv.id);
                    setBookingModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C] shadow transition-colors"
                >
                  Book Slot →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PALLAKI SEVA & DHEEKSHA */}
      <section className="space-y-6">
        <PallakiSevaView
          mandapam={mandapam}
          pallakiList={mandapamPallaki}
          onCarrierBookingClick={() => {
            setSelectedServiceId("srv-pallaki-seva-carrier");
            setBookingModalOpen(true);
          }}
        />

        <DheekshaGuideView
          mandapam={mandapam}
          dheeksha={mandapamDheeksha}
        />
      </section>

      {/* 6. NIMARJANAM (VISARJAN) SCHEDULE */}
      <section>
        <NimarjanamView
          mandapam={mandapam}
          nimarjanam={mandapamNimarjanam}
        />
      </section>

      {/* 7. ACTIVITIES & CULTURAL PROGRAMS */}
      {mandapamActivities.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
            <div>
              <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
                Activities, Competitions & Cultural Events
              </h3>
              <p className="text-xs text-stone-600">
                Bathukamma, Gita recitation, bhajans and community programs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mandapamActivities.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {act.category}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {act.date} • {act.startTime}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#8B1E1E]">{act.title}</h4>
                <p className="text-xs text-stone-700 leading-relaxed">{act.description}</p>
                {act.location && (
                  <p className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-700" />
                    <span>{act.location}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. OFFICIAL ANNOUNCEMENTS */}
      {mandapamAnnouncements.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#8B1E1E]" />
            <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
              Mandapam Announcements
            </h3>
          </div>

          <div className="space-y-2">
            {mandapamAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-300 shadow-sm"
              >
                <h4 className="font-bold text-xs text-[#8B1E1E]">{ann.title}</h4>
                <p className="text-xs text-stone-700 mt-1">{ann.message}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. 10-DAY FESTIVAL SCHEDULE (Mandapam-Specific with Custom Alankaranas & Settings) */}
      <section>
        <NineDaySchedule
          mandapam={mandapam}
          mandapamDaySettings={daySettings.filter(s => s.mandapamId === mandapam.id)}
        />
      </section>

      {/* 10. COMMUNITY Q&A */}
      <section>
        <CommunityQnA
          mandapam={mandapam}
          questions={mandapamQuestions}
        />
      </section>

      {/* 11. LOCAL SPONSORS & SUPPORTERS */}
      {localAds.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Local Supporters & Pooja Vendors Around Mandapam
            </span>
            <Link to="/navaratri/advertise" className="text-xs font-bold text-[#8B1E1E] hover:underline">
              Advertise Your Shop →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localAds.slice(0, 2).map((ad) => (
              <SponsoredCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      {/* SERVICE BOOKING MODAL */}
      <ServiceBookingModal
        mandapam={mandapam}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedServiceId={selectedServiceId}
      />

      {/* PERMANENT QR CODE MODAL */}
      <ShareQrModal
        mandapam={mandapam}
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
};

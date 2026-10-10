import { navaratriAsset } from "../utils/navaratriAssets";
import {
  Mandapam,
  Alankarana,
  MandapamDaySetting,
  Service,
  ServiceSlot,
  Booking,
  Activity,
  PallakiSeva,
  DheekshaProgram,
  NimarjanamSchedule,
  Announcement,
  CommunityQuestion,
  AdPackage,
  Advertisement,
  Season
} from "../types";

// ── Season ────────────────────────────────────────────────────────────────────
export const INITIAL_SEASON: Season = {
  id: "season-2026",
  name: "Sharan Navaratri 2026",
  year: 2026,
  startDate: "2026-10-11",
  endDate: "2026-10-20",
  status: "LIVE"
};

// ── Mandapams ─────────────────────────────────────────────────────────────────
export const INITIAL_MANDAPAMS: Mandapam[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Sri Sri Sri Devi Kanaka Durga Navaratri Utsava Samithi",
    slug: "hurdaya-raguram-youth",
    description: "Sri Sri Sri Devi Kanaka Durga Navaratri Utsava Samithi - Hurdaya raguram youth Navaratri Mandapam",
    deviName: "Sri Kanaka Durga Devi",
    address: "Nizamabad",
    area: "Nizamabad",
    city: "Nizamabad",
    state: "Telangana",
    pincode: "503001",
    latitude: 18.6725,
    longitude: 78.0941,
    verificationStatus: "VERIFIED",
    organizerName: "Hurdaya Raguram Youth",
    organizerMobile: "9848111781",
    organizerEmail: "naninikithota@gmail.com",
    contactPhone: "9848111781",
    whatsappNumber: "9848111781",
    logoUrl: "/uploads/hurdaya-raguram-youth-banner.png",
    coverImageUrl: "/uploads/hurdaya-raguram-youth-banner.png",
    cardBgImageUrl: "/uploads/hurdaya-raguram-youth-banner.png",
    createdAt: new Date().toISOString()
  }
];

// ── All dummy data arrays cleared ─────────────────────────────────────────────
export const INITIAL_DAY_SETTINGS: MandapamDaySetting[] = [];
export const INITIAL_ALANKARANAS: Alankarana[] = [];
export const INITIAL_SERVICES: Service[] = [];
export const INITIAL_SLOTS: ServiceSlot[] = [];
export const INITIAL_BOOKINGS: Booking[] = [];
export const INITIAL_PALLAKI_SEVAS: PallakiSeva[] = [];
export const INITIAL_DHEEKSHA_PROGRAMS: DheekshaProgram[] = [];
export const INITIAL_NIMARJANAM_SCHEDULES: NimarjanamSchedule[] = [];
export const INITIAL_ACTIVITIES: Activity[] = [];
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];
export const INITIAL_QUESTIONS: CommunityQuestion[] = [];

// ── Ad Packages (real pricing — used on /advertise page) ─────────────────────
export const INITIAL_AD_PACKAGES: AdPackage[] = [
  // ── Combinational / Shared Ads (Rotates every 6s with other business ads) ────
  {
    id: "pkg-starter",
    name: "1 Day Daily Booster",
    priceInr: 49,
    durationDays: 1,
    impressionLimit: 1500,
    estimatedImpressions: 1500,
    placementType: "HOME_NEAR_ME",
    description: "Ideal for flash offers & single-day pooja rush. Rotates every 6 seconds with other local business ads.",
    spaceType: "ROTATING",
    rotationSeconds: 6
  },
  {
    id: "pkg-growth",
    name: "3 Days Weekend Rush",
    priceInr: 129,
    durationDays: 3,
    impressionLimit: 5000,
    estimatedImpressions: 5000,
    placementType: "HOME_EXPLORE_NEARBY",
    description: "Peak Moola Nakshatram & weekend devotee crowds. Rotates every 6 seconds with other local business ads.",
    popular: true,
    spaceType: "ROTATING",
    rotationSeconds: 6
  },
  {
    id: "pkg-festival",
    name: "9 Days Maha Utsav Pass",
    priceInr: 349,
    durationDays: 9,
    impressionLimit: 18000,
    estimatedImpressions: 18000,
    placementType: "ALL_CITIZEN_PAGES",
    description: "Complete festival coverage through Vijaya Dashami. Rotates every 6 seconds with other local business ads.",
    bestValue: true,
    spaceType: "ROTATING",
    rotationSeconds: 6
  },

  // ── Exclusive 24/7 Solo Ad Space (Run their ad ONLY, 24/7 without other ads) ──
  {
    id: "pkg-solo-1",
    name: "1 Day Solo 24/7 Booster",
    priceInr: 149,
    durationDays: 1,
    impressionLimit: 4500,
    estimatedImpressions: 4500,
    placementType: "EXCLUSIVE_FRAME_24_7",
    description: "100% Dedicated to your business only. Shows 24/7 continuously with zero competing ads in your frame.",
    spaceType: "EXCLUSIVE"
  },
  {
    id: "pkg-solo-3",
    name: "3 Days Weekend Solo 24/7",
    priceInr: 399,
    durationDays: 3,
    impressionLimit: 15000,
    estimatedImpressions: 15000,
    placementType: "EXCLUSIVE_FRAME_24_7",
    description: "Peak festival crowds with undivided attention. Your ad runs non-stop 24/7 without other businesses in your frame.",
    popular: true,
    spaceType: "EXCLUSIVE"
  },
  {
    id: "pkg-solo-9",
    name: "9 Days Maha Utsav Solo VIP",
    priceInr: 999,
    durationDays: 9,
    impressionLimit: 55000,
    estimatedImpressions: 55000,
    placementType: "EXCLUSIVE_FRAME_24_7",
    description: "Ultimate VIP spotlight for all 9 sacred days. 24/7 dedicated banner ownership with zero competition.",
    bestValue: true,
    spaceType: "EXCLUSIVE"
  }
];

// ── Platform Sponsor Advertisements ───────────────────────────────────────────
// These three supplied partner creatives fill the site-wide 16:9 ad frames and rotate with
// any approved organizer advertisements. All campaigns retain click tracking.
export const INITIAL_ADVERTISEMENTS: Advertisement[] = [
  {
    id: "partner-printflow-doorstep",
    businessName: "PrintFlow",
    category: "Printing & delivery",
    phone: "",
    address: "India",
    city: "Nizamabad",
    packageId: "platform-sponsor",
    title: "Order prints at your doorstep.",
    description: "Business cards, flyers, posters and banners delivered fast.",
    imageUrl: "/navaratri/assets/ads/printflow-doorstep.jpg",
    ctaText: "Explore PrintFlow",
    ctaUrl: "https://printflows.in",
    targetCity: "All",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "ACTIVE",
    impressions: 0,
    clicks: 0,
    format: "BANNER",
    preferredFrame: "BOTH",
    createdAt: "2026-10-07T00:00:00.000Z"
  },
  {
    id: "partner-siddhi-google-rank",
    businessName: "Siddhi Dynamics LLP",
    category: "Google ranking & local SEO",
    phone: "",
    address: "India",
    city: "Nizamabad",
    packageId: "platform-sponsor",
    title: "Get your business at the top",
    description: "Google Search, Google Maps, SEO, AEO, GEO and website development services.",
    imageUrl: "/navaratri/assets/siddhi-google-rank-ad.jpg",
    ctaText: "Know More",
    ctaUrl: "https://siddhidynamics.in/submit?type=problem",
    targetCity: "All",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "ACTIVE",
    impressions: 0,
    clicks: 0,
    format: "BANNER",
    preferredFrame: "BOTH",
    createdAt: "2026-10-08T00:00:00.000Z"
  },
  {
    id: "partner-siddhi-custom-solutions",
    businessName: "Siddhi Dynamics LLP",
    category: "Custom software & automation",
    phone: "",
    address: "India",
    city: "Nizamabad",
    packageId: "platform-sponsor",
    title: "Save your time and money",
    description: "Custom software, websites, automations and business systems built for local businesses.",
    imageUrl: "/navaratri/assets/siddhi-custom-solutions-ad.jpg",
    ctaText: "Know More",
    ctaUrl: "https://siddhidynamics.in/submit?type=problem",
    targetCity: "All",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "ACTIVE",
    impressions: 0,
    clicks: 0,
    format: "BANNER",
    preferredFrame: "BOTH",
    createdAt: "2026-10-08T00:00:00.000Z"
  }
];

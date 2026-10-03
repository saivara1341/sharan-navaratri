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
// Only real, verified mandapams. All dummy entries removed.
export const INITIAL_MANDAPAMS: Mandapam[] = [
  {
    id: "mnp-178584",
    seasonId: "season-2026",
    name: "Hrudhaya Ragu Ram Youth",
    slug: "hrudhaya-ragu-ram-youth-nizamabad",
    description: "Grand Sharan Navaratri celebrations organized by Hrudhaya Ragu Ram Youth in Nizamabad with daily sacred Devi Alankaranas, Sahasranama Archana, and Maha Annadanam.",
    deviName: "Sri Bala Tripura Sundari Devi",
    address: "Near Municipal Office, Subhash Nagar Road",
    area: "Subhash Nagar",
    city: "Nizamabad",
    state: "Telangana",
    pincode: "503002",
    latitude: 18.6725,
    longitude: 78.0941,
    verificationStatus: "VERIFIED",
    organizerName: "Hrudhaya Ragu Ram Youth Committee",
    organizerMobile: "6303602743",
    organizerEmail: "hrudhaya.raguram@gmail.com",
    logoUrl: navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"),
    coverImageUrl: navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg"),
    contactPhone: "6303602743",
    whatsappNumber: "6303602743",
    passcode: "178584",
    createdAt: "2026-10-02T10:00:00Z"
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
  {
    id: "pkg-starter",
    name: "1 Day Daily Booster",
    priceInr: 49,
    durationDays: 1,
    impressionLimit: 1500,
    placementType: "HOME_NEAR_ME",
    description: "Ideal for flash offers, special pooja day rush, or 1-day sweet stall promo."
  },
  {
    id: "pkg-growth",
    name: "3 Days Weekend Rush",
    priceInr: 129,
    durationDays: 3,
    impressionLimit: 5000,
    placementType: "HOME_EXPLORE_NEARBY",
    description: "Perfect for Moola Nakshatram, Durgashtami, and weekend devotee peaks.",
    popular: true
  },
  {
    id: "pkg-festival",
    name: "9 Days Maha Utsav Pass",
    priceInr: 349,
    durationDays: 9,
    impressionLimit: 18000,
    placementType: "ALL_CITIZEN_PAGES",
    description: "Complete 9-day coverage throughout Navaratri and Vijaya Dashami festival."
  }
];

// ── Active Advertisements (real paid advertisers) ─────────────────────────────
export const INITIAL_ADVERTISEMENTS: Advertisement[] = [
  {
    id: "sponsor-printflow-2026",
    businessName: "PrintFlow",
    category: "Technology",
    phone: "9100000000",
    website: "https://printflows.in",
    email: "hello@printflows.in",
    address: "Nizamabad, Telangana",
    city: "Nizamabad",
    packageId: "premium",
    title: "PrintFlow — India's Print OS",
    description: "Manage quotations, GST billing, production tracking & online print orders. Print everything. Delivered fast. Built for Indian print businesses.",
    imageUrl: navaratriAsset("/navaratri/assets/ad-printflows.jpg"),
    ctaText: "Visit PrintFlow",
    ctaUrl: "https://printflows.in/",
    targetCity: "Nizamabad",
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    status: "ACTIVE" as const,
    impressions: 0,
    clicks: 0,
    paymentStatus: "PAID",
  },
  {
    id: "sponsor-siddhidynamics-2026",
    businessName: "Siddhi Dynamics LLP",
    category: "Technology",
    phone: "8938264789",
    website: "https://siddhidynamics.in",
    email: "ssaivaraprasad51@gmail.com",
    address: "Nizamabad, Telangana",
    city: "Nizamabad",
    packageId: "premium",
    title: "Siddhi Dynamics — Automate. Build. Rank. Grow.",
    description: "We don't just compete — we make you #1. AI Automations, Websites, SEO/AEO/GEO. 5-star rated deep-tech AI & software solutions. Serving Hyderabad & Nizamabad.",
    imageUrl: navaratriAsset("/navaratri/assets/ad-siddhidynamics.jpg"),
    ctaText: "Visit Siddhi Dynamics",
    ctaUrl: "https://siddhidynamics.in/",
    targetCity: "Nizamabad",
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    status: "ACTIVE" as const,
    impressions: 0,
    clicks: 0,
    paymentStatus: "PAID",
  },
];

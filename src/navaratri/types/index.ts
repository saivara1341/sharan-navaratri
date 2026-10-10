export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'ARCHIVED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'NO_SHOW' | 'COMPLETED';
export type BookingType = 'ONLINE' | 'WALK_IN';
export type SlotStatus = 'AVAILABLE' | 'FULL' | 'CANCELLED';
export type PriorityLevel = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type AdStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'PAUSED' | 'EXPIRED';
export type SeasonStatus = 'DRAFT' | 'REGISTRATION_OPEN' | 'LIVE' | 'ENDED' | 'ARCHIVED';
export type PallakiLiveStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
export type NimarjanamQueueStatus = 'WAITING' | 'ON_ROUTE' | 'AT_GHAT' | 'COMPLETED';

export interface Season {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  status: SeasonStatus;
}

export interface Mandapam {
  id: string;
  seasonId?: string;
  name: string;
  slug: string;
  description: string;
  deviName: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  googleMapsUrl?: string;
  verificationStatus: VerificationStatus;
  organizerName: string;
  organizerMobile: string;
  organizerEmail?: string;
  showOrganizerPublicly?: boolean;
  logoUrl?: string;
  coverImageUrl?: string;
  cardBgImageUrl?: string;
  contactPhone: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  passcode?: string;
  ownerUserId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SacredChantingDetails {
  moolaMantra: string;
  sloka: string;
  recommendedStotram: string;
  bestChantingGuide: string;
}

export interface SessionAlankaranaDetails {
  deviName: string;
  colorName: string;
  colorHex?: string;
  saree: string;
  ornaments: string;
}

export interface DualSessionInfo {
  isCommonlyDual?: boolean;
  morningAlankarana?: string;
  eveningAlankarana?: string;
  sessionGuide?: string;
  morningDetails?: SessionAlankaranaDetails;
  eveningDetails?: SessionAlankaranaDetails;
}

export interface BathukammaDayInfo {
  dayNumber: number;
  date: string;
  dayOfWeek: string;
  teluguName: string;
  englishName: string;
  description?: string;
}

export interface StandardFestivalDay {
  dayNumber: number;
  date: string;
  tithi?: string;
  morningAlankaram?: string;
  eveningTransition?: string;
  deviName: string;
  teluguDeviName: string;
  hindiDeviName: string;
  colorName: string;
  colorHex: string;
  description: string;
  whyWeCelebrate: string;
  sacredChanting: SacredChantingDetails;
  suggestedOfferings: string;
  suggestedItems: string;
  standardActivities: string;
  significance: string;
  imageUrl?: string;
  dualSessionNote?: DualSessionInfo;
  bathukammaDay?: BathukammaDayInfo;
}

export interface MandapamDaySetting {
  id: string;
  mandapamId: string;
  dayNumber: number;
  date: string;
  useStandardDevi: boolean;
  customDeviName?: string;
  isDualAlankarana?: boolean;
  morningDeviName?: string;
  eveningDeviName?: string;
  useStandardPooja: boolean;
  customPoojaTimings?: string;
  useStandardNaivedhyam: boolean;
  customNaivedhyam?: string;
  useStandardPrasadam: boolean;
  customPrasadam?: string;
  useStandardItems: boolean;
  customItemsToBring?: string;
  annadanamEnabled: boolean;
  annadanamStartTime?: string;
  annadanamEndTime?: string;
  annadanamLocation?: string;
  annadanamExpectedCount?: number;
  annadanamNotes?: string;
}

export interface Alankarana {
  id: string;
  mandapamId: string;
  seasonId?: string;
  date: string;
  title: string;
  deviName: string;
  description: string;
  imageUrl: string;
  published: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  mandapamId: string;
  type: string;
  name: string;
  description: string;
  instructions?: string;
  enabled: boolean;
  bookingEnabled: boolean;
  itemsRequired?: string;
  durationMinutes: number;
  capacityPerSlot: number;
  price?: number;
  date?: string;
  timeSlot?: string;
  targetAudience?: "ALL" | "COUPLES" | "FEMALES_ONLY" | "INDIVIDUALS" | "FAMILY";
  targetAudienceLabel?: string;
}

export interface ServiceSlot {
  id: string;
  serviceId: string;
  mandapamId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  walkinCount: number;
  status: SlotStatus;
}

export interface Booking {
  id: string;
  bookingCode: string;
  slotId: string;
  serviceId: string;
  mandapamId: string;
  name: string;
  mobile: string;
  quantity: number;
  bookingType: BookingType;
  status: BookingStatus;
  notes?: string;
  serviceName?: string;
  slotTime?: string;
  date: string;
  createdAt: string;
  gotram?: string;
  devoteeType?: "COUPLE" | "FEMALE" | "INDIVIDUAL" | "FAMILY" | "ALL";
  tokenNumber?: number;
  isVerified?: boolean;
  verifiedAt?: string;
}

export interface Activity {
  id: string;
  mandapamId: string;
  title: string;
  category: 'Pooja' | 'Annadanam' | 'Game' | 'Cultural Program' | 'Competition' | 'Bhajan' | 'Children Activity' | 'Special Program' | 'Pallaki Seva' | 'Nimarjanam' | 'Other';
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  capacity?: number;
  bookingEnabled: boolean;
  instructions?: string;
  published: boolean;
  fee?: string;
}

export interface PallakiSeva {
  id: string;
  mandapamId: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  routeDetails: string;
  darshanPoints: string;
  coordinatorName: string;
  coordinatorPhone: string;
  liveStatus: PallakiLiveStatus;
  published: boolean;
}

export interface DheekshaProgram {
  id: string;
  mandapamId: string;
  dheekshaName: string;
  malaDharanaDate: string;
  viramamDate: string;
  dailyNiyamas: string;
  irumudiPoojaDate: string;
  contactGuruName: string;
  contactGuruPhone: string;
  rulesList: string[];
}

export interface NimarjanamSchedule {
  id: string;
  mandapamId: string;
  nimarjanamDate: string;
  shobhaYatraStartTime: string;
  designatedGhat: string;
  city: string;
  vehicleType: string;
  vehiclePassNumber: string;
  queueStatus: NimarjanamQueueStatus;
  emergencyContact: string;
  routeGuidelines?: string;
}

export interface Announcement {
  id: string;
  mandapamId: string;
  title: string;
  message: string;
  priority: PriorityLevel;
  published: boolean;
  createdAt: string;
}

export interface CommunityAnswer {
  id: string;
  questionId: string;
  mandapamId: string;
  responderName: string;
  isOfficial: boolean;
  answer: string;
  language: string;
  createdAt: string;
}

export interface CommunityQuestion {
  id: string;
  mandapamId: string;
  askerName: string;
  question: string;
  language: string;
  status: 'PUBLISHED' | 'REPORTED' | 'HIDDEN';
  createdAt: string;
  answers: CommunityAnswer[];
}

export interface FollowRecord {
  id: string;
  mandapamId: string;
  deviceToken?: string;
  createdAt: string;
  notificationPreferences: {
    alankarana: boolean;
    announcements: boolean;
    reminders: boolean;
  };
}

export interface ReminderRecord {
  id: string;
  mandapamId: string;
  targetType: 'POOJA' | 'SERVICE' | 'ANNADANAM' | 'ACTIVITY' | 'PALLAKI';
  targetId: string;
  targetTitle: string;
  reminderMinutesBefore: 15 | 30 | 60;
  scheduledTime: string;
  status: 'PENDING' | 'SENT' | 'CANCELLED';
  createdAt: string;
}

export interface AdPackage {
  id: string;
  name: string;
  priceInr: number;
  durationDays: number;
  impressionLimit: number;
  estimatedImpressions?: number;
  placementType: string;
  description: string;
  popular?: boolean;
  bestValue?: boolean;
  spaceType?: "ROTATING" | "EXCLUSIVE";
  rotationSeconds?: number;
}

export interface Advertisement {
  id: string;
  businessName: string;
  category: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address: string;
  city: string;
  packageId: string;
  title: string;
  description: string;
  imageUrl?: string;
  logoUrl?: string;
  ctaText: string;
  ctaUrl?: string;
  targetCity: string;
  targetArea?: string;
  targetZone?: string;
  targetMandapamId?: string;
  startDate: string;
  endDate: string;
  status: AdStatus;
  rejectionReason?: string;
  impressions: number;
  clicks: number;
  paymentStatus?: "PAID" | "PENDING" | "PENDING_VERIFICATION";
  transactionId?: string;
  utrNumber?: string;
  paymentScreenshotUrl?: string;
  pricePaid?: number;
  format?: "BANNER" | "BUSINESS_CARD" | "TEXT_BULLETIN";
  contactPerson?: string;
  tagline?: string;
  bulletPoints?: string[];
  cardTheme?: "terracotta" | "maroon" | "gold" | "royal";
  spaceType?: "ROTATING" | "EXCLUSIVE";
  preferredFrame?: "TOP" | "BOTTOM" | "BOTH";
  createdAt: string;
}

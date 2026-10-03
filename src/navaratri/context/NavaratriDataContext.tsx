import React, { createContext, useContext, useState, useEffect } from "react";
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
  Season,
  BookingStatus,
  AdStatus,
  VerificationStatus,
  PallakiLiveStatus,
  NimarjanamQueueStatus
  , ReminderRecord
} from "../types";
import {
  INITIAL_SEASON,
  INITIAL_MANDAPAMS,
  INITIAL_DAY_SETTINGS,
  INITIAL_ALANKARANAS,
  INITIAL_SERVICES,
  INITIAL_SLOTS,
  INITIAL_BOOKINGS,
  INITIAL_PALLAKI_SEVAS,
  INITIAL_DHEEKSHA_PROGRAMS,
  INITIAL_NIMARJANAM_SCHEDULES,
  INITIAL_ACTIVITIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_QUESTIONS,
  INITIAL_AD_PACKAGES,
  INITIAL_ADVERTISEMENTS
} from "../data/mockNavaratriData";
import { STANDARD_NAVARATRI_DAYS } from "../data/standardNavaratriDays";
import { navaratriAsset } from "../utils/navaratriAssets";

export type UserRole = "devotee" | "organizer" | "admin";

interface NavaratriDataContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeMandapamId: string;
  setActiveMandapamId: (id: string) => void;
  season: Season;
  mandapams: Mandapam[];
  alankaranas: Alankarana[];
  daySettings: MandapamDaySetting[];
  services: Service[];
  slots: ServiceSlot[];
  bookings: Booking[];
  activities: Activity[];
  pallakiSevas: PallakiSeva[];
  dheekshaPrograms: DheekshaProgram[];
  nimarjanamSchedules: NimarjanamSchedule[];
  announcements: Announcement[];
  questions: CommunityQuestion[];
  adPackages: AdPackage[];
  advertisements: Advertisement[];
  followedIds: string[];
  scannedIds: string[];
  reminders: ReminderRecord[];
  userLocation: { lat: number; lng: number; city: string; area: string } | null;
  setUserLocation: (loc: { lat: number; lng: number; city: string; area: string } | null) => void;

  // Actions
  getMandapamBySlug: (slug: string) => Mandapam | undefined;
  getMandapamById: (id: string) => Mandapam | undefined;
  getAlankaranaForDate: (mandapamId: string, date: string) => Alankarana | undefined;
  getDaySetting: (mandapamId: string, dayNumber: number) => MandapamDaySetting | undefined;
  updateDaySetting: (setting: Partial<MandapamDaySetting> & { mandapamId: string; dayNumber: number }) => void;
  uploadAlankarana: (data: Omit<Alankarana, "id" | "createdAt">) => Alankarana;
  createBooking: (data: {
    slotId: string;
    serviceId: string;
    mandapamId: string;
    name: string;
    mobile: string;
    quantity: number;
    notes?: string;
  }) => { success: boolean; booking?: Booking; error?: string };
  addWalkIn: (data: {
    slotId: string;
    serviceId: string;
    mandapamId: string;
    name: string;
    mobile: string;
    quantity: number;
    notes?: string;
  }) => { success: boolean; booking?: Booking; error?: string };
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  toggleFollow: (mandapamId: string) => void;
  isFollowing: (mandapamId: string) => boolean;
  markScanned: (mandapamId: string) => void;
  addReminder: (reminder: Omit<ReminderRecord, "id" | "createdAt">) => void;
  publishAnnouncement: (data: Omit<Announcement, "id" | "createdAt">) => void;
  askQuestion: (mandapamId: string, askerName: string, question: string, language?: string) => void;
  answerQuestion: (questionId: string, responderName: string, answer: string, isOfficial?: boolean) => void;
  createService: (data: Omit<Service, "id">) => Service;
  updateService: (id: string, data: Partial<Service>) => void;
  deleteService: (id: string) => void;
  createSlot: (data: Omit<ServiceSlot, "id" | "bookedCount" | "walkinCount" | "status">) => ServiceSlot;
  updateSlot: (id: string, data: Partial<ServiceSlot>) => void;
  deleteSlot: (id: string) => void;
  registerMandapam: (data: Omit<Mandapam, "id" | "slug" | "verificationStatus" | "createdAt">) => { success: boolean; mandapam?: Mandapam; duplicateWarning?: string };
  verifyMandapam: (mandapamId: string, status: VerificationStatus) => void;
  updatePallakiStatus: (id: string, status: PallakiLiveStatus) => void;
  updateNimarjanamStatus: (id: string, status: NimarjanamQueueStatus) => void;
  createAdvertisement: (data: Omit<Advertisement, "id" | "impressions" | "clicks" | "status" | "createdAt">) => Advertisement;
  moderateAd: (adId: string, status: AdStatus, rejectionReason?: string) => void;
  recordAdImpression: (adId: string) => void;
  createActivity: (data: Omit<Activity, "id">) => Activity;
  updateActivity: (id: string, data: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  updateMandapam: (mandapamId: string, data: Partial<Mandapam>) => void;
  deleteMandapam: (mandapamId: string) => boolean;
}

const NavaratriDataContext = createContext<NavaratriDataContextType | null>(null);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`navaratri_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`navaratri_${key}`, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const NavaratriDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("devotee");
  const [activeMandapamId, setActiveMandapamId] = useState<string>("m-rr-nizamabad");
  const [season, setSeason] = useState<Season>(() => loadStorage("season", INITIAL_SEASON));
  const [mandapams, setMandapams] = useState<Mandapam[]>(() => {
    const loaded = loadStorage<Mandapam[]>("mandapams", INITIAL_MANDAPAMS);
    const merged = [...loaded];
    for (const initM of INITIAL_MANDAPAMS) {
      if (!merged.some(m => m.id === initM.id || (m.slug && initM.slug && m.slug.toLowerCase() === initM.slug.toLowerCase()))) {
        merged.push(initM);
      }
    }
    return merged.map(m => {
      if (!m.passcode) {
        const found = INITIAL_MANDAPAMS.find(im => im.id === m.id);
        return {
          ...m,
          passcode: found?.passcode || Math.floor(10000000 + Math.random() * 90000000).toString()
        };
      }
      return m;
    });
  });
  const [alankaranas, setAlankaranas] = useState<Alankarana[]>(() => {
    const loaded = loadStorage<Alankarana[]>("alankaranas", INITIAL_ALANKARANAS);
    const merged = [...loaded];
    for (const initA of INITIAL_ALANKARANAS) {
      if (!merged.some(a => a.id === initA.id || (a.mandapamId === initA.mandapamId && a.date === initA.date))) {
        merged.push(initA);
      }
    }
    return merged;
  });
  const [daySettings, setDaySettings] = useState<MandapamDaySetting[]>(() => {
    const loaded = loadStorage<MandapamDaySetting[]>("day_settings", INITIAL_DAY_SETTINGS);
    const merged = [...loaded];
    for (const initDs of INITIAL_DAY_SETTINGS) {
      if (!merged.some(s => s.id === initDs.id || (s.mandapamId === initDs.mandapamId && s.dayNumber === initDs.dayNumber))) {
        merged.push(initDs);
      }
    }
    return merged;
  });
  const [services, setServices] = useState<Service[]>(() => {
    const loaded = loadStorage<Service[]>("services", INITIAL_SERVICES);
    const cleaned = (loaded || []).filter(s => !(s.type === "Annadanam" || s.name.toLowerCase().includes("annadanam") || s.id === "srv-annadanam-seva"));
    const merged = [...cleaned];
    for (const initS of INITIAL_SERVICES) {
      if (!merged.some(s => s.id === initS.id)) {
        merged.push(initS);
      }
    }
    return merged;
  });
  const [slots, setSlots] = useState<ServiceSlot[]>(() => loadStorage("slots", INITIAL_SLOTS));
  const [bookings, setBookings] = useState<Booking[]>(() => loadStorage("bookings", []));
  const [activities, setActivities] = useState<Activity[]>(() => {
    const loaded = loadStorage<Activity[]>("activities", INITIAL_ACTIVITIES);
    const cleaned = (loaded || []).filter(a => !(a.mandapamId === "m-rr-nizamabad" && (a.category === "Annadanam" || a.title.toLowerCase().includes("annadanam"))));
    const merged = [...cleaned];
    for (const initA of INITIAL_ACTIVITIES) {
      if (!merged.some(a => a.id === initA.id)) {
        merged.push(initA);
      }
    }
    return merged;
  });
  const [pallakiSevas, setPallakiSevas] = useState<PallakiSeva[]>(() => loadStorage("pallaki", INITIAL_PALLAKI_SEVAS));
  const [dheekshaPrograms, setDheekshaPrograms] = useState<DheekshaProgram[]>(() => loadStorage("dheeksha", INITIAL_DHEEKSHA_PROGRAMS));
  const [nimarjanamSchedules, setNimarjanamSchedules] = useState<NimarjanamSchedule[]>(() => loadStorage("nimarjanam", INITIAL_NIMARJANAM_SCHEDULES));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadStorage("announcements", INITIAL_ANNOUNCEMENTS));
  const [questions, setQuestions] = useState<CommunityQuestion[]>(() => loadStorage("questions", INITIAL_QUESTIONS));
  const adPackages = INITIAL_AD_PACKAGES;
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => {
    const loaded = loadStorage("ads", INITIAL_ADVERTISEMENTS);
    return (loaded || []).filter(a => a && !a.id?.startsWith("ad-"));
  });
  const [followedIds, setFollowedIds] = useState<string[]>(() => loadStorage("followed_mandapams", []));
  const [scannedIds, setScannedIds] = useState<string[]>(() => loadStorage("scanned_mandapams", []));
  const [reminders, setReminders] = useState<ReminderRecord[]>(() => loadStorage("reminders", []));
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; city: string; area: string } | null>({
    lat: 18.6725,
    lng: 78.0941,
    city: "Nizamabad",
    area: "Subhash Nagar"
  });

  // Sync state to localStorage
  useEffect(() => saveStorage("mandapams", mandapams), [mandapams]);
  useEffect(() => saveStorage("alankaranas", alankaranas), [alankaranas]);
  useEffect(() => saveStorage("day_settings", daySettings), [daySettings]);
  useEffect(() => saveStorage("services", services), [services]);
  useEffect(() => saveStorage("slots", slots), [slots]);
  useEffect(() => saveStorage("bookings", bookings), [bookings]);
  useEffect(() => saveStorage("activities", activities), [activities]);
  useEffect(() => saveStorage("announcements", announcements), [announcements]);
  useEffect(() => saveStorage("questions", questions), [questions]);
  useEffect(() => saveStorage("followed_mandapams", followedIds), [followedIds]);
  useEffect(() => saveStorage("scanned_mandapams", scannedIds), [scannedIds]);
  useEffect(() => saveStorage("reminders", reminders), [reminders]);
  useEffect(() => saveStorage("ads", advertisements), [advertisements]);
  useEffect(() => saveStorage("pallaki", pallakiSevas), [pallakiSevas]);
  useEffect(() => saveStorage("nimarjanam", nimarjanamSchedules), [nimarjanamSchedules]);

  const getMandapamBySlug = (slug: string) => mandapams.find(m => m.slug.toLowerCase() === slug.toLowerCase());
  const getMandapamById = (id: string) => mandapams.find(m => m.id === id);

  const getAlankaranaForDate = (mandapamId: string, date: string) => {
    return alankaranas.find(a => a.mandapamId === mandapamId && a.date === date);
  };

  const getDaySetting = (mandapamId: string, dayNumber: number) => {
    return daySettings.find(s => s.mandapamId === mandapamId && s.dayNumber === dayNumber);
  };

  const updateDaySetting = (setting: Partial<MandapamDaySetting> & { mandapamId: string; dayNumber: number }) => {
    setDaySettings(prev => {
      const idx = prev.findIndex(s => s.mandapamId === setting.mandapamId && s.dayNumber === setting.dayNumber);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...setting };
        return updated;
      } else {
        const std = STANDARD_NAVARATRI_DAYS.find(d => d.dayNumber === setting.dayNumber);
        const newItem: MandapamDaySetting = {
          id: `ds-${Date.now()}`,
          mandapamId: setting.mandapamId,
          dayNumber: setting.dayNumber,
          date: std ? std.date : "2026-10-11",
          useStandardDevi: true,
          useStandardPooja: true,
          useStandardNaivedhyam: true,
          useStandardPrasadam: true,
          useStandardItems: true,
          annadanamEnabled: false,
          ...setting
        };
        return [...prev, newItem];
      }
    });
  };

  const uploadAlankarana = (data: Omit<Alankarana, "id" | "createdAt">): Alankarana => {
    const newAlankarana: Alankarana = {
      ...data,
      id: `alan-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAlankaranas(prev => {
      // Replace existing for this date or prepend
      const filtered = prev.filter(a => !(a.mandapamId === data.mandapamId && a.date === data.date));
      return [newAlankarana, ...filtered];
    });
    return newAlankarana;
  };

  const createBooking = (data: {
    slotId: string;
    serviceId: string;
    mandapamId: string;
    name: string;
    mobile: string;
    quantity: number;
    notes?: string;
  }) => {
    let slot = slots.find(s => s.id === data.slotId);
    if (!slot && data.serviceId) {
      slot = slots.find(s => s.serviceId === data.serviceId && s.mandapamId === data.mandapamId);
    }
    if (!slot) {
      slot = slots.find(s => s.mandapamId === data.mandapamId);
    }

    const service = services.find(s => s.id === data.serviceId);
    const capacityLimit = slot?.capacity || service?.capacityPerSlot || 4;

    if (!slot) {
      const autoSlot: ServiceSlot = {
        id: `slot-auto-${Date.now()}`,
        serviceId: data.serviceId,
        mandapamId: data.mandapamId,
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00 AM",
        endTime: "09:00 PM",
        capacity: capacityLimit,
        bookedCount: 0,
        walkinCount: 0,
        status: "AVAILABLE"
      };
      setSlots(prev => [...prev, autoSlot]);
      slot = autoSlot;
    }

    const currentTotal = slot.bookedCount + slot.walkinCount;
    if (currentTotal + data.quantity > slot.capacity) {
      return {
        success: false,
        error: `Booking quota reached! Available remaining slots: ${Math.max(0, slot.capacity - currentTotal)}.`
      };
    }

    const bookingCode = `NM-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode,
      slotId: slot.id,
      serviceId: data.serviceId,
      mandapamId: data.mandapamId,
      name: data.name,
      mobile: data.mobile,
      quantity: data.quantity,
      bookingType: "ONLINE",
      status: "CONFIRMED",
      notes: data.notes,
      serviceName: service ? service.name : (slot.serviceId ? (services.find(s => s.id === slot?.serviceId)?.name || "Devi Pooja Seva") : "Devi Pooja Seva"),
      slotTime: `${slot.startTime} - ${slot.endTime}`,
      date: slot.date,
      createdAt: new Date().toISOString()
    };

    // Update slot counts atomically
    setSlots(prev => prev.map(s => {
      if (s.id === slot!.id) {
        const newBooked = s.bookedCount + data.quantity;
        return {
          ...s,
          bookedCount: newBooked,
          status: newBooked + s.walkinCount >= s.capacity ? "FULL" : "AVAILABLE"
        };
      }
      return s;
    }));

    setBookings(prev => [newBooking, ...prev]);
    return { success: true, booking: newBooking };
  };

  const addWalkIn = (data: {
    slotId?: string;
    serviceId?: string;
    mandapamId: string;
    name: string;
    mobile: string;
    quantity: number;
    notes?: string;
  }) => {
    let slot = data.slotId ? slots.find(s => s.id === data.slotId) : undefined;
    if (!slot && data.serviceId) {
      slot = slots.find(s => s.serviceId === data.serviceId && s.mandapamId === data.mandapamId);
    }
    if (!slot) {
      slot = slots.find(s => s.mandapamId === data.mandapamId);
    }

    const service = data.serviceId ? services.find(s => s.id === data.serviceId) : undefined;
    const capacityLimit = slot?.capacity || service?.capacityPerSlot || 100;

    if (!slot) {
      const autoSlot: ServiceSlot = {
        id: `slot-counter-${Date.now()}`,
        serviceId: data.serviceId || `srv-counter-${data.mandapamId}`,
        mandapamId: data.mandapamId,
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00 AM",
        endTime: "09:00 PM",
        capacity: capacityLimit,
        bookedCount: 0,
        walkinCount: 0,
        status: "AVAILABLE"
      };
      setSlots(prev => [...prev, autoSlot]);
      slot = autoSlot;
    }

    const currentTotal = slot.bookedCount + slot.walkinCount;
    if (currentTotal + data.quantity > slot.capacity) {
      return {
        success: false,
        error: `Slot capacity reached! Available tokens remaining: ${Math.max(0, slot.capacity - currentTotal)}.`
      };
    }

    const bookingCode = `WI-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: `wi-${Date.now()}`,
      bookingCode,
      slotId: slot.id,
      serviceId: service?.id || slot.serviceId || `srv-counter-${data.mandapamId}`,
      mandapamId: data.mandapamId,
      name: data.name,
      mobile: data.mobile,
      quantity: data.quantity,
      bookingType: "WALK_IN",
      status: "CHECKED_IN",
      notes: data.notes || "Walk-in entry recorded at counter",
      serviceName: service ? service.name : (slot.serviceId ? (services.find(s => s.id === slot?.serviceId)?.name || "Mandapam Darshan & Pooja Token") : "Mandapam Darshan & Pooja Token"),
      slotTime: `${slot.startTime} - ${slot.endTime}`,
      date: slot.date,
      createdAt: new Date().toISOString()
    };

    setSlots(prev => prev.map(s => {
      if (s.id === slot!.id) {
        const newWalkin = s.walkinCount + data.quantity;
        return {
          ...s,
          walkinCount: newWalkin,
          status: s.bookedCount + newWalkin >= s.capacity ? "FULL" : "AVAILABLE"
        };
      }
      return s;
    }));

    setBookings(prev => [newBooking, ...prev]);
    return { success: true, booking: newBooking };
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  const toggleFollow = (mandapamId: string) => {
    setFollowedIds(prev =>
      prev.includes(mandapamId) ? prev.filter(id => id !== mandapamId) : [...prev, mandapamId]
    );
  };

  const isFollowing = (mandapamId: string) => followedIds.includes(mandapamId);

  const markScanned = (mandapamId: string) => {
    setScannedIds((previous) => previous.includes(mandapamId) ? previous : [mandapamId, ...previous]);
  };

  const addReminder = (reminder: Omit<ReminderRecord, "id" | "createdAt">) => {
    setReminders(prev => [{ ...reminder, id: `rem-${Date.now()}`, createdAt: new Date().toISOString() }, ...prev]);
  };

  const publishAnnouncement = (data: Omit<Announcement, "id" | "createdAt">) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const askQuestion = (mandapamId: string, askerName: string, question: string, language: string = "en") => {
    const newQ: CommunityQuestion = {
      id: `q-${Date.now()}`,
      mandapamId,
      askerName,
      question,
      language,
      status: "PUBLISHED",
      createdAt: new Date().toISOString(),
      answers: []
    };
    setQuestions(prev => [newQ, ...prev]);
  };

  const answerQuestion = (questionId: string, responderName: string, answer: string, isOfficial: boolean = true) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const newAns = {
          id: `ans-${Date.now()}`,
          questionId,
          mandapamId: q.mandapamId,
          responderName,
          isOfficial,
          answer,
          language: q.language,
          createdAt: new Date().toISOString()
        };
        return { ...q, answers: [...q.answers, newAns] };
      }
      return q;
    }));
  };

  const createService = (data: Omit<Service, "id">): Service => {
    const newService: Service = {
      ...data,
      id: `srv-${Date.now()}`
    };
    setServices(prev => [...prev, newService]);
    return newService;
  };

  const createSlot = (data: Omit<ServiceSlot, "id" | "bookedCount" | "walkinCount" | "status">): ServiceSlot => {
    const newSlot: ServiceSlot = {
      ...data,
      id: `slot-${Date.now()}`,
      bookedCount: 0,
      walkinCount: 0,
      status: "AVAILABLE"
    };
    setSlots(prev => [...prev, newSlot]);
    return newSlot;
  };

  const updateService = (id: string, data: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setSlots(prev => prev.filter(s => s.serviceId !== id));
  };

  const updateSlot = (id: string, data: Partial<ServiceSlot>) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteSlot = (id: string) => {
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  const registerMandapam = (data: Omit<Mandapam, "id" | "slug" | "verificationStatus" | "createdAt">) => {
    // Duplicate Detection check
    const normalizedName = data.name.toLowerCase().trim();
    const existing = mandapams.find(m => {
      const matchName = m.name.toLowerCase().includes(normalizedName) || normalizedName.includes(m.name.toLowerCase());
      const matchArea = m.area.toLowerCase() === data.area.toLowerCase() && m.city.toLowerCase() === data.city.toLowerCase();
      const matchMobile = m.organizerMobile.replace(/\D/g, '') === data.organizerMobile.replace(/\D/g, '');
      return (matchName && matchArea) || matchMobile;
    });

    let duplicateWarning: string | undefined;
    if (existing) {
      duplicateWarning = `A Mandapam with similar details (${existing.name} in ${existing.area}) already exists. Your registration has been submitted for Admin review.`;
    }

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + `-${data.city.toLowerCase()}`;

    const generatedPasscode =
      data.passcode && /^\d{8}$/.test(data.passcode.trim())
        ? data.passcode.trim()
        : Math.floor(10000000 + Math.random() * 90000000).toString();

    const shortId = `mnp-${Math.floor(100000 + Math.random() * 900000)}`;

    const newMandapam: Mandapam = {
      ...data,
      id: shortId,
      passcode: generatedPasscode,
      slug,
      verificationStatus: "VERIFIED", // auto-verified for immediate testing
      createdAt: new Date().toISOString()
    };

    // 1. Initialize all 10 standard days settings for the new mandapam
    const initialDaySettings: MandapamDaySetting[] = STANDARD_NAVARATRI_DAYS.map((d) => ({
      id: `ds-${shortId}-${d.dayNumber}`,
      mandapamId: shortId,
      dayNumber: d.dayNumber,
      date: d.date,
      useStandardDevi: true,
      customDeviName: d.deviName,
      isDualAlankarana: !!d.dualSessionNote,
      morningDeviName: d.dualSessionNote?.morningAlankarana || d.deviName,
      eveningDeviName: d.dualSessionNote?.eveningAlankarana || "",
      useStandardPooja: true,
      customPoojaTimings: d.dayNumber === 1
        ? "Morning 07:30 AM (Kalash & Ganapathi Sthapana) | Evening 06:30 PM (Maha Harathi)"
        : "Morning 08:00 AM (Daily Sahasranama Pooja) | Evening 06:30 PM (Maha Deeparadhana)",
      useStandardNaivedhyam: true,
      customNaivedhyam: d.suggestedOfferings,
      useStandardPrasadam: true,
      customPrasadam: `${d.suggestedOfferings} distributed to all visiting devotees`,
      useStandardItems: true,
      customItemsToBring: d.suggestedItems,
      annadanamEnabled: true,
      annadanamStartTime: "12:30 PM",
      annadanamEndTime: "03:30 PM",
      annadanamLocation: "Mandapam Annadanam Dining Hall",
      annadanamExpectedCount: 500,
      annadanamNotes: "Daily sacred Annaprasadam seva for all devotees"
    }));
    setDaySettings(prev => [...initialDaySettings, ...prev]);

    // 2. Initialize Day 1 Alankarana
    const initialAlankarana: Alankarana = {
      id: `alan-${shortId}-1`,
      mandapamId: shortId,
      date: "2026-10-11",
      title: "Day 1 Sacred Alankarana",
      deviName: data.deviName || STANDARD_NAVARATRI_DAYS[0].deviName,
      description: "Consecrated idol decorated with festive gold ornaments and traditional silks",
      imageUrl: data.coverImageUrl || STANDARD_NAVARATRI_DAYS[0].imageUrl || navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"),
      published: true,
      createdAt: new Date().toISOString()
    };
    setAlankaranas(prev => [initialAlankarana, ...prev]);

    // 3. Initialize Standard Temple Pooja Services & Slots
    const initialServices: Service[] = [
      {
        id: `srv-${shortId}-1`,
        mandapamId: shortId,
        name: "Sri Durga Devi Sahasranama Archana",
        description: "Sacred 1008 divine names archana with fresh red kumkum, bilva, and fragrant flowers for family well-being.",
        type: "POOJA",
        price: 0,
        currency: "INR",
        durationMinutes: 45,
        itemsRequired: "Coconuts, Betel leaves, Fresh flower garland, Bananas",
        enabled: true
      },
      {
        id: `srv-${shortId}-2`,
        mandapamId: shortId,
        name: "Sri Lalitha Sahasranama Kumkumarchana",
        description: "Special women's sacred Kumkuma puja invoking Maa Durga's divine protection and prosperity.",
        type: "KUMKUMARCHANA",
        price: 0,
        currency: "INR",
        durationMinutes: 30,
        itemsRequired: "Pure Sindoor/Kumkum, Fresh jasmine flowers, Turmeric",
        enabled: true
      },
      {
        id: `srv-${shortId}-3`,
        mandapamId: shortId,
        name: "Maha Deeparadhana & Harathi Darshan Pass",
        description: "Priority sanctum darshan during the divine evening Maha Mangala Harathi and sacred prasad distribution.",
        type: "HARATHI",
        price: 0,
        currency: "INR",
        durationMinutes: 20,
        itemsRequired: "Devotion and sacred offerings",
        enabled: true
      },
      {
        id: `srv-${shortId}-4`,
        mandapamId: shortId,
        name: "Chandi Parayanam & Homa Sankalpam",
        description: "Special sankalpam during the holy Navaratri Chandi Homam conducted by Vedic priests.",
        type: "HOMA",
        price: 0,
        currency: "INR",
        durationMinutes: 60,
        itemsRequired: "Gotram, Family names, Homa samagri",
        enabled: true
      }
    ];
    setServices(prev => [...initialServices, ...prev]);

    // 4. Initialize Slots for each service
    const initialSlots: ServiceSlot[] = [];
    initialServices.forEach(srv => {
      initialSlots.push({
        id: `slot-${srv.id}-morn`,
        serviceId: srv.id,
        mandapamId: shortId,
        date: "2026-10-11",
        startTime: "09:00 AM",
        endTime: "10:30 AM",
        capacity: 50,
        bookedCount: 0,
        walkinCount: 0,
        status: "AVAILABLE"
      });
      initialSlots.push({
        id: `slot-${srv.id}-eve`,
        serviceId: srv.id,
        mandapamId: shortId,
        date: "2026-10-11",
        startTime: "06:30 PM",
        endTime: "07:30 PM",
        capacity: 100,
        bookedCount: 0,
        walkinCount: 0,
        status: "AVAILABLE"
      });
    });
    setSlots(prev => [...initialSlots, ...prev]);

    // 5. Initialize Welcome Announcement
    const initialAnnouncement: Announcement = {
      id: `ann-${shortId}-1`,
      mandapamId: shortId,
      title: "Divine Navaratri 2026 Celebrations",
      message: `Welcome all devotees to ${data.name}! Join us daily for sacred Maa Darshan, Annadanam, and Evening Maha Harathi. Free Pooja booking passes are available online.`,
      priority: "HIGH",
      published: true,
      createdAt: new Date().toISOString()
    };
    setAnnouncements(prev => [initialAnnouncement, ...prev]);

    // 6. Initialize Activity
    const initialActivity: Activity = {
      id: `act-${shortId}-1`,
      mandapamId: shortId,
      title: "Maha Navami Dandiya Utsav & Bhajans",
      category: "Dandiya Night",
      date: "2026-10-19",
      startTime: "07:30 PM",
      endTime: "10:30 PM",
      location: `${data.area} Mandapam Grounds`,
      description: "Traditional Garba, Dandiya Ras, and spiritual bhajan sandhya celebrating Maa Durga.",
      bookingEnabled: true,
      published: true
    };
    setActivities(prev => [initialActivity, ...prev]);

    // 7. Initialize Nimarjanam / Visarjan Schedule
    const initialNimarjanam: NimarjanamSchedule = {
      id: `nim-${shortId}`,
      mandapamId: shortId,
      date: "2026-10-20",
      startTime: "02:00 PM",
      startLocation: `${data.address || data.name}`,
      destinationWaterBody: "Ashok Nagar Shobha Yatra Lake / Godavari River",
      routeDescription: `${data.area} Main Road -> Clock Tower -> Collectorate Road -> Lake Ghat`,
      queueStatus: "SCHEDULED",
      currentSlotTime: "04:30 PM",
      vehicleNumber: "TS-16-UT-2026",
      driverPhone: data.contactPhone || data.organizerMobile,
      assignedGhat: "Ghat 1 (Main Procession Deck)"
    };
    setNimarjanamSchedules(prev => [initialNimarjanam, ...prev]);

    setMandapams(prev => [newMandapam, ...prev]);
    return { success: true, mandapam: newMandapam, duplicateWarning };
  };

  const verifyMandapam = (mandapamId: string, status: VerificationStatus) => {
    setMandapams(prev => prev.map(m => m.id === mandapamId ? { ...m, verificationStatus: status } : m));
  };

  const updatePallakiStatus = (id: string, status: PallakiLiveStatus) => {
    setPallakiSevas(prev => prev.map(p => p.id === id ? { ...p, liveStatus: status } : p));
  };

  const updateNimarjanamStatus = (id: string, status: NimarjanamQueueStatus) => {
    setNimarjanamSchedules(prev => prev.map(n => n.id === id ? { ...n, queueStatus: status } : n));
  };

  const createAdvertisement = (data: Omit<Advertisement, "id" | "impressions" | "clicks" | "status" | "createdAt">): Advertisement => {
    const newAd: Advertisement = {
      ...data,
      id: `ad-${Date.now()}`,
      impressions: 0,
      clicks: 0,
      status: "PENDING_REVIEW", // Requires admin payment confirmation before going live
      paymentStatus: "PENDING_VERIFICATION",
      createdAt: new Date().toISOString()
    };
    setAdvertisements(prev => [newAd, ...prev]);
    return newAd;
  };

  const moderateAd = (adId: string, status: AdStatus, rejectionReason?: string) => {
    setAdvertisements(prev => prev.map(a => a.id === adId ? { ...a, status, rejectionReason } : a));
  };

  const recordAdImpression = (adId: string) => {
    setAdvertisements(prev => prev.map(a => a.id === adId ? { ...a, impressions: a.impressions + 1 } : a));
  };

  const recordAdClick = (adId: string) => {
    setAdvertisements(prev => prev.map(a => a.id === adId ? { ...a, clicks: a.clicks + 1 } : a));
  };

  const createActivity = (data: Omit<Activity, "id">): Activity => {
    const newAct: Activity = {
      ...data,
      id: `act-${Date.now()}`
    };
    setActivities(prev => [newAct, ...prev]);
    return newAct;
  };

  const updateActivity = (id: string, data: Partial<Activity>) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const deleteMandapam = (mandapamId: string): boolean => {
    setMandapams(prev => prev.filter(m => m.id !== mandapamId));
    setAlankaranas(prev => prev.filter(a => a.mandapamId !== mandapamId));
    setDaySettings(prev => prev.filter(d => d.mandapamId !== mandapamId));
    setServices(prev => prev.filter(s => s.mandapamId !== mandapamId));
    setSlots(prev => prev.filter(sl => sl.mandapamId !== mandapamId));
    setBookings(prev => prev.filter(b => b.mandapamId !== mandapamId));
    setActivities(prev => prev.filter(ac => ac.mandapamId !== mandapamId));
    setAnnouncements(prev => prev.filter(an => an.mandapamId !== mandapamId));
    setPallakiSevas(prev => prev.filter(p => p.mandapamId !== mandapamId));
    setNimarjanamSchedules(prev => prev.filter(n => n.mandapamId !== mandapamId));
    setFollowedIds(prev => prev.filter(id => id !== mandapamId));
    setScannedIds(prev => prev.filter(id => id !== mandapamId));
    return true;
  };

  const updateMandapam = (mandapamId: string, data: Partial<Mandapam>) => {
    setMandapams(prev =>
      prev.map(m => (m.id === mandapamId ? { ...m, ...data, updatedAt: new Date().toISOString() } : m))
    );
  };

  return (
    <NavaratriDataContext.Provider
      value={{
        role,
        setRole,
        activeMandapamId,
        setActiveMandapamId,
        season,
        mandapams,
        alankaranas,
        daySettings,
        services,
        slots,
        bookings,
        activities,
        pallakiSevas,
        dheekshaPrograms,
        nimarjanamSchedules,
        announcements,
        questions,
        adPackages,
        advertisements,
        followedIds,
        scannedIds,
        reminders,
        userLocation,
        setUserLocation,
        getMandapamBySlug,
        getMandapamById,
        getAlankaranaForDate,
        getDaySetting,
        updateDaySetting,
        uploadAlankarana,
        createBooking,
        addWalkIn,
        updateBookingStatus,
        toggleFollow,
        isFollowing,
        markScanned,
        addReminder,
        publishAnnouncement,
        askQuestion,
        answerQuestion,
        createService,
        updateService,
        deleteService,
        createSlot,
        updateSlot,
        deleteSlot,
        registerMandapam,
        verifyMandapam,
        updatePallakiStatus,
        updateNimarjanamStatus,
        createAdvertisement,
        moderateAd,
        recordAdImpression,
        recordAdClick,
        createActivity,
        updateActivity,
        deleteActivity,
        updateMandapam,
        deleteMandapam
      }}
    >
      {children}
    </NavaratriDataContext.Provider>
  );
};

export const useNavaratriData = () => {
  const context = useContext(NavaratriDataContext);
  if (!context) throw new Error("useNavaratriData must be used within a NavaratriDataProvider");
  return context;
};

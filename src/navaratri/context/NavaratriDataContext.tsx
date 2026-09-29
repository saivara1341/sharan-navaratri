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
  createSlot: (data: Omit<ServiceSlot, "id" | "bookedCount" | "walkinCount" | "status">) => ServiceSlot;
  registerMandapam: (data: Omit<Mandapam, "id" | "slug" | "verificationStatus" | "createdAt">) => { success: boolean; mandapam?: Mandapam; duplicateWarning?: string };
  verifyMandapam: (mandapamId: string, status: VerificationStatus) => void;
  updatePallakiStatus: (id: string, status: PallakiLiveStatus) => void;
  updateNimarjanamStatus: (id: string, status: NimarjanamQueueStatus) => void;
  createAdvertisement: (data: Omit<Advertisement, "id" | "impressions" | "clicks" | "status" | "createdAt">) => Advertisement;
  moderateAd: (adId: string, status: AdStatus, rejectionReason?: string) => void;
  recordAdImpression: (adId: string) => void;
  recordAdClick: (adId: string) => void;
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
    const loaded = loadStorage("mandapams", INITIAL_MANDAPAMS);
    return loaded.map(m => {
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
  const [alankaranas, setAlankaranas] = useState<Alankarana[]>(() => loadStorage("alankaranas", INITIAL_ALANKARANAS));
  const [daySettings, setDaySettings] = useState<MandapamDaySetting[]>(() => loadStorage("day_settings", INITIAL_DAY_SETTINGS));
  const [services, setServices] = useState<Service[]>(() => loadStorage("services", INITIAL_SERVICES));
  const [slots, setSlots] = useState<ServiceSlot[]>(() => loadStorage("slots", INITIAL_SLOTS));
  const [bookings, setBookings] = useState<Booking[]>(() => loadStorage("bookings", INITIAL_BOOKINGS));
  const [activities, setActivities] = useState<Activity[]>(() => loadStorage("activities", INITIAL_ACTIVITIES));
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
    const slot = slots.find(s => s.id === data.slotId);
    if (!slot) return { success: false, error: "Slot not found" };

    const currentTotal = slot.bookedCount + slot.walkinCount;
    if (currentTotal + data.quantity > slot.capacity) {
      return { success: false, error: "Slot capacity exceeded" };
    }

    const service = services.find(s => s.id === data.serviceId);
    const bookingCode = `NM-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode,
      slotId: data.slotId,
      serviceId: data.serviceId,
      mandapamId: data.mandapamId,
      name: data.name,
      mobile: data.mobile,
      quantity: data.quantity,
      bookingType: "ONLINE",
      status: "CONFIRMED",
      notes: data.notes,
      serviceName: service ? service.name : "Devi Pooja Seva",
      slotTime: `${slot.startTime} - ${slot.endTime}`,
      date: slot.date,
      createdAt: new Date().toISOString()
    };

    // Update slot counts atomically
    setSlots(prev => prev.map(s => {
      if (s.id === slot.id) {
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
    slotId: string;
    serviceId: string;
    mandapamId: string;
    name: string;
    mobile: string;
    quantity: number;
    notes?: string;
  }) => {
    const slot = slots.find(s => s.id === data.slotId);
    if (!slot) return { success: false, error: "Slot not found" };

    const service = services.find(s => s.id === data.serviceId);
    const bookingCode = `WI-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: `wi-${Date.now()}`,
      bookingCode,
      slotId: data.slotId,
      serviceId: data.serviceId,
      mandapamId: data.mandapamId,
      name: data.name,
      mobile: data.mobile,
      quantity: data.quantity,
      bookingType: "WALK_IN",
      status: "CHECKED_IN",
      notes: data.notes || "Walk-in entry recorded at counter",
      serviceName: service ? service.name : "Devi Pooja Seva",
      slotTime: `${slot.startTime} - ${slot.endTime}`,
      date: slot.date,
      createdAt: new Date().toISOString()
    };

    setSlots(prev => prev.map(s => {
      if (s.id === slot.id) {
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
      status: "APPROVED", // Auto-approved for immediate local preview
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

  const deleteMandapam = (mandapamId: string): boolean => {
    setMandapams(prev => prev.filter(m => m.id !== mandapamId));
    setAlankaranas(prev => prev.filter(a => a.mandapamId !== mandapamId));
    setDaySettings(prev => prev.filter(d => d.mandapamId !== mandapamId));
    setServices(prev => prev.filter(s => s.mandapamId !== mandapamId));
    setSlots(prev => prev.filter(sl => sl.mandapamId !== mandapamId));
    setBookings(prev => prev.filter(b => b.mandapamId !== mandapamId));
    setAnnouncements(prev => prev.filter(an => an.mandapamId !== mandapamId));
    setPallakiSevas(prev => prev.filter(p => p.mandapamId !== mandapamId));
    setNimarjanamSchedules(prev => prev.filter(n => n.mandapamId !== mandapamId));
    setFollowedIds(prev => prev.filter(id => id !== mandapamId));
    setScannedIds(prev => prev.filter(id => id !== mandapamId));
    return true;
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
        createSlot,
        registerMandapam,
        verifyMandapam,
        updatePallakiStatus,
        updateNimarjanamStatus,
        createAdvertisement,
        moderateAd,
        recordAdImpression,
        recordAdClick,
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

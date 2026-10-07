import { navaratriAsset } from "../utils/navaratriAssets";
import { getMandapamDirectionsUrl } from "../utils/mandapamMaps";
import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import {
  CalendarDays,
  Clock,
  Compass,
  MapPin,
  MapPinOff,
  Music2,
  Navigation,
  Search,
  PlusCircle,
  Trophy,
  Utensils,
  Flame,
  Info
} from "lucide-react";
import { DandiyaIcon } from "../components/devotional/DandiyaIcon";
import { MandapamIcon } from "../components/devotional/MandapamIcon";
import { PallakiIcon } from "../components/devotional/PallakiIcon";
import { PrasadBowlIcon } from "../components/devotional/PrasadBowlIcon";
import { HomaKundaIcon, isHomamEvent } from "../components/devotional/HomaKundaIcon";
import { toast } from "sonner";

type Category = "all" | "mandapams" | "annadanam" | "bhajans_pallaki" | "activities";

const GoogleMapsIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <path fill="#34A853" d="M4 5.5 12 2v24l-8 4V5.5Z" />
    <path fill="#4285F4" d="m12 2 8 4v24l-8-4V2Z" />
    <path fill="#FBBC04" d="m20 6 8-4v24l-8 4V6Z" />
    <path fill="#EA4335" d="M16 8.2c-3.1 0-5.6 2.4-5.6 5.5 0 4.1 5.6 10.1 5.6 10.1s5.6-6 5.6-10.1c0-3.1-2.5-5.5-5.6-5.5Zm0 7.6a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Z" />
  </svg>
);

export interface RegionConfig {
  name: string;
  state: string;
  lat: number;
  lng: number;
  defaultArea: string;
  areas: string[];
  areaCoordinates?: Record<string, { lat: number; lng: number }>;
}

export const REGIONS_DATA: Record<string, RegionConfig> = {
  Nizamabad: {
    name: "Nizamabad",
    state: "Telangana",
    lat: 18.6725,
    lng: 78.0941,
    defaultArea: "Subhash Nagar",
    areas: [
      "Subhash Nagar",
      "Khaleelwadi",
      "Gandhi Chowk",
      "Vinayak Nagar",
      "Kanteshwar",
      "Bodhan",
      "Armoor",
      "Banswada",
      "Kamareddy",
      "Dichpally",
      "Varni",
      "Bheemgal"
    ],
    areaCoordinates: {
      "Subhash Nagar": { lat: 18.6725, lng: 78.0941 },
      "Khaleelwadi": { lat: 18.6789, lng: 78.1012 },
      "Gandhi Chowk": { lat: 18.674, lng: 78.098 },
      "Vinayak Nagar": { lat: 18.683, lng: 78.092 },
      "Kanteshwar": { lat: 18.665, lng: 78.115 },
      "Bodhan": { lat: 18.665, lng: 77.898 },
      "Armoor": { lat: 18.79, lng: 78.29 },
      "Banswada": { lat: 18.384, lng: 77.882 },
      "Kamareddy": { lat: 18.32, lng: 78.34 },
      "Dichpally": { lat: 18.57, lng: 78.22 }
    }
  },
  Hyderabad: {
    name: "Hyderabad",
    state: "Telangana",
    lat: 17.385,
    lng: 78.4867,
    defaultArea: "Central Hyderabad",
    areas: [
      "Central Hyderabad",
      "Old City (Charminar)",
      "Subhash Nagar (Jeedimetla)",
      "Secunderabad",
      "Ameerpet",
      "Kukatpally",
      "Dilsukhnagar",
      "Madhapur / Hitec City",
      "Gachibowli",
      "Banjara Hills",
      "Jubilee Hills",
      "Begumpet",
      "LB Nagar",
      "Uppal",
      "Malkajgiri",
      "Mehdipatnam",
      "Kacheguda",
      "Himayatnagar"
    ],
    areaCoordinates: {
      "Central Hyderabad": { lat: 17.385, lng: 78.4867 },
      "Old City (Charminar)": { lat: 17.3616, lng: 78.4747 },
      "Old City": { lat: 17.3616, lng: 78.4747 },
      "Subhash Nagar (Jeedimetla)": { lat: 17.5146, lng: 78.4716 },
      "Secunderabad": { lat: 17.4399, lng: 78.4983 },
      "Ameerpet": { lat: 17.4375, lng: 78.4482 },
      "Kukatpally": { lat: 17.4947, lng: 78.3996 },
      "Dilsukhnagar": { lat: 17.3688, lng: 78.5247 },
      "Madhapur / Hitec City": { lat: 17.4483, lng: 78.3915 },
      "Gachibowli": { lat: 17.4401, lng: 78.3489 },
      "Begumpet": { lat: 17.4447, lng: 78.4664 },
      "LB Nagar": { lat: 17.3457, lng: 78.5522 },
      "Uppal": { lat: 17.4022, lng: 78.5595 }
    }
  },
  Warangal: {
    name: "Warangal",
    state: "Telangana",
    lat: 17.9689,
    lng: 79.5941,
    defaultArea: "Hanamkonda",
    areas: [
      "Hanamkonda",
      "Kazipet",
      "Subedari",
      "Warangal Chowrasta",
      "Narsampet",
      "Jangaon"
    ],
    areaCoordinates: {
      "Hanamkonda": { lat: 18.0125, lng: 79.5603 },
      "Kazipet": { lat: 17.9782, lng: 79.5167 },
      "Subedari": { lat: 18.005, lng: 79.555 },
      "Warangal Chowrasta": { lat: 17.9689, lng: 79.5941 }
    }
  },
  Karimnagar: {
    name: "Karimnagar",
    state: "Telangana",
    lat: 18.4386,
    lng: 79.1288,
    defaultArea: "Collectorate Road",
    areas: [
      "Collectorate Road",
      "Mankammathota",
      "Kothapalli",
      "Huzurabad",
      "Jagtial",
      "Sircilla",
      "Peddapalli",
      "Godavarikhani"
    ],
    areaCoordinates: {
      "Collectorate Road": { lat: 18.4386, lng: 79.1288 },
      "Mankammathota": { lat: 18.433, lng: 79.135 },
      "Kothapalli": { lat: 18.445, lng: 79.115 },
      "Huzurabad": { lat: 18.19, lng: 79.39 },
      "Jagtial": { lat: 18.79, lng: 78.91 }
    }
  },
  Khammam: {
    name: "Khammam",
    state: "Telangana",
    lat: 17.2473,
    lng: 80.1514,
    defaultArea: "Wyra Road",
    areas: [
      "Wyra Road",
      "Kothagudem",
      "Sathupalli",
      "Bhadrachalam",
      "Madhira"
    ]
  },
  Mahabubnagar: {
    name: "Mahabubnagar",
    state: "Telangana",
    lat: 16.7488,
    lng: 78.0035,
    defaultArea: "Clock Tower",
    areas: [
      "Clock Tower",
      "Jadcherla",
      "Wanaparthy",
      "Gadwal",
      "Nagarkurnool"
    ]
  },
  Nalgonda: {
    name: "Nalgonda",
    state: "Telangana",
    lat: 17.0577,
    lng: 79.2684,
    defaultArea: "Clock Tower",
    areas: [
      "Clock Tower",
      "Miryalaguda",
      "Suryapet",
      "Kodad",
      "Devarakonda",
      "Bhongir"
    ]
  },
  Adilabad: {
    name: "Adilabad",
    state: "Telangana",
    lat: 19.6641,
    lng: 78.532,
    defaultArea: "Main Road",
    areas: [
      "Main Road",
      "Nirmal",
      "Mancherial",
      "Bellampalli",
      "Mandamarri",
      "Kagaznagar"
    ]
  },
  Medak: {
    name: "Medak / Sangareddy",
    state: "Telangana",
    lat: 17.62,
    lng: 78.08,
    defaultArea: "Sangareddy",
    areas: [
      "Sangareddy",
      "Siddipet",
      "Gajwel",
      "Medak Town",
      "Zaheerabad",
      "Patancheru"
    ]
  },
  Siddipet: {
    name: "Siddipet",
    state: "Telangana",
    lat: 18.1018,
    lng: 78.852,
    defaultArea: "Siddipet Town",
    areas: [
      "Siddipet Town",
      "Gajwel",
      "Dubbak",
      "Husnabad"
    ]
  },
  Vijayawada: {
    name: "Vijayawada",
    state: "Andhra Pradesh",
    lat: 16.5062,
    lng: 80.648,
    defaultArea: "Governorpet",
    areas: [
      "Governorpet",
      "Benz Circle",
      "Gandhinagar",
      "One Town",
      "Patamata",
      "Auto Nagar",
      "Bhavanipuram"
    ],
    areaCoordinates: {
      "Governorpet": { lat: 16.5131, lng: 80.6325 },
      "Benz Circle": { lat: 16.4994, lng: 80.6558 }
    }
  },
  Visakhapatnam: {
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    lat: 17.6868,
    lng: 83.2185,
    defaultArea: "MVP Colony",
    areas: [
      "MVP Colony",
      "Jagadamba Junction",
      "Gajuwaka",
      "Madhurawada",
      "Dwaraka Nagar",
      "Rushikonda"
    ]
  },
  Tirupati: {
    name: "Tirupati",
    state: "Andhra Pradesh",
    lat: 13.6288,
    lng: 79.4192,
    defaultArea: "Alipiri",
    areas: [
      "Alipiri",
      "KT Road",
      "Chandragiri",
      "Renigunta",
      "Bhavani Nagar"
    ]
  },
  Guntur: {
    name: "Guntur",
    state: "Andhra Pradesh",
    lat: 16.3067,
    lng: 80.4365,
    defaultArea: "Brodipet",
    areas: [
      "Brodipet",
      "Arundelpet",
      "Pattabhipuram",
      "Kothapet",
      "Tenali"
    ]
  }
};

const distanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const NavaratriNearMe: React.FC = () => {
  const { mandapams, alankaranas, activities, userLocation, setUserLocation } = useNavaratriData();
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get("category");
  const searchQuery = searchParams.get("q")?.trim().toLowerCase() || "";

  const initialCategory: Category = useMemo(() => {
    if (queryCategory === "annadanam") return "annadanam";
    if (queryCategory === "bhajans_pallaki" || queryCategory === "pallaki" || queryCategory === "bhajans") {
      return "bhajans_pallaki";
    }
    if (queryCategory === "activities" || queryCategory === "dandiya") return "activities";
    if (queryCategory === "mandapams") return "mandapams";
    return "all";
  }, [queryCategory]);

  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const [manualCity, setManualCity] = useState(userLocation?.city && REGIONS_DATA[userLocation.city] ? userLocation.city : "Nizamabad");
  // Area is optional: selecting a district alone must show all Mandapams in it.
  const [manualArea, setManualArea] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationSource, setLocationSource] = useState<"default" | "manual" | "gps">("default");
  const [showAllOverride, setShowAllOverride] = useState(false);

  const applyManualLocation = () => {
    const region = REGIONS_DATA[manualCity] || REGIONS_DATA.Nizamabad;
    const areaTrimmed = manualArea.trim();
    const areaCoord = region.areaCoordinates?.[areaTrimmed];
    const lat = areaCoord ? areaCoord.lat : region.lat;
    const lng = areaCoord ? areaCoord.lng : region.lng;
    const finalArea = areaTrimmed;

    setManualArea(finalArea);
    setUserLocation({ lat, lng, city: manualCity, area: finalArea });
    setLocationSource("manual");
    setShowAllOverride(false);
    toast.success(finalArea ? `Showing results near ${finalArea}, ${manualCity}.` : `Showing all Mandapams in ${manualCity}.`);
  };

  const selectQuickArea = (selectedArea: string) => {
    setManualArea(selectedArea);
    const region = REGIONS_DATA[manualCity] || REGIONS_DATA.Nizamabad;
    const areaCoord = region.areaCoordinates?.[selectedArea];
    const lat = areaCoord ? areaCoord.lat : region.lat;
    const lng = areaCoord ? areaCoord.lng : region.lng;

    setUserLocation({ lat, lng, city: manualCity, area: selectedArea });
    setLocationSource("manual");
    setShowAllOverride(false);
    toast.success(`Showing results near ${selectedArea}, ${manualCity}.`);
  };

  const requestBrowserLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.info("GPS location is not supported by this browser. Choose a city and area instead.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordinateLabel = `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
        setUserLocation({
          lat: coords.latitude,
          lng: coords.longitude,
          city: "GPS location",
          area: coordinateLabel
        });
        setManualArea("");
        setLocationSource("gps");
        setShowAllOverride(false);
        setIsLocating(false);
        toast.success(`Accurate GPS detected within about ${Math.round(coords.accuracy)} metres.`);
      },
      (error) => {
        setIsLocating(false);
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Choose a city and area below."
            : "Your location could not be detected. Choose it manually below.";
        toast.info(message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // 1. Calculate proximity and filter strictly by selected location / region
  const nearList = useMemo(() => {
    if (showAllOverride) {
      const origin = userLocation || {
        lat: REGIONS_DATA.Nizamabad.lat,
        lng: REGIONS_DATA.Nizamabad.lng,
        city: "Nizamabad",
        area: "Subhash Nagar"
      };
      return mandapams
        .map((mandapam) => ({
          ...mandapam,
          distanceKm: distanceKm(origin.lat, origin.lng, mandapam.latitude, mandapam.longitude),
          todayAlankarana: alankaranas.find((item) => item.mandapamId === mandapam.id)
        }))
        .filter((mandapam) => {
          if (!searchQuery) return true;
          return [
            mandapam.name,
            mandapam.area,
            mandapam.city,
            mandapam.deviName
          ].some((value) => value.toLowerCase().includes(searchQuery));
        })
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }

    const origin = userLocation || {
      lat: REGIONS_DATA.Nizamabad.lat,
      lng: REGIONS_DATA.Nizamabad.lng,
      city: "Nizamabad",
      area: ""
    };

    const currentCity = (userLocation?.city || manualCity || "").trim().toLowerCase();
    const currentArea = (userLocation?.area || manualArea || "").trim().toLowerCase();

    return mandapams
      .map((mandapam) => ({
        ...mandapam,
        distanceKm: distanceKm(origin.lat, origin.lng, mandapam.latitude, mandapam.longitude),
        todayAlankarana: alankaranas.find((item) => item.mandapamId === mandapam.id)
      }))
      .filter((mandapam) => {
        // Global search input override
        if (searchQuery) {
          const matchQuery = [
            mandapam.name,
            mandapam.area,
            mandapam.city,
            mandapam.deviName
          ].some((value) => value.toLowerCase().includes(searchQuery));
          if (!matchQuery) return false;
        }

        // GPS detection mode: check if mandapam is within reasonable radius (25 km)
        if (locationSource === "gps") {
          return mandapam.distanceKm <= 25;
        }

        // Regional / Locality filtering
        const mandapamCity = mandapam.city.toLowerCase().trim();
        const mandapamArea = mandapam.area.toLowerCase().trim();

        const cityMatches = mandapamCity.includes(currentCity) || currentCity.includes(mandapamCity);
        if (!cityMatches) {
          return false;
        }

        // If user chose "All Areas" in that city, show all mandapams in that city
        if (
          !currentArea ||
          currentArea.includes("all areas") ||
          currentArea === `all ${currentCity}` ||
          currentArea === "all"
        ) {
          return true;
        }

        // If specific area matches directly
        if (mandapamArea.includes(currentArea) || currentArea.includes(mandapamArea)) {
          return true;
        }

        // If within 8km radius within the same municipal zone (e.g. Subhash Nagar & Khaleelwadi in Nizamabad town)
        // But not separate towns 20+ km away like Bodhan or Armoor
        return mandapam.distanceKm <= 8;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [
    alankaranas,
    mandapams,
    searchQuery,
    userLocation,
    manualCity,
    manualArea,
    locationSource,
    showAllOverride
  ]);

  const isPallakiOrBhajan = (cat: string = "", title: string = "") => {
    const c = cat.toLowerCase();
    const t = title.toLowerCase();
    return (
      c.includes("pallaki") ||
      c.includes("bhajan") ||
      t.includes("pallaki") ||
      t.includes("bhajan") ||
      t.includes("palanquin") ||
      t.includes("shobha") ||
      t.includes("rathotsavam")
    );
  };

  const isDandiyaOrActivity = (cat: string = "", title: string = "") => {
    if (cat === "Annadanam") return false;
    if (isPallakiOrBhajan(cat, title)) return false;
    return true;
  };

  // Only show activities from mandapams registered in this selected region
  const visibleActivities = useMemo(() => {
    const activeMandapamIds = new Set(nearList.map((m) => m.id));

    return activities
      .filter((activity) => {
        if (!activity.published) return false;
        if (!showAllOverride && !activeMandapamIds.has(activity.mandapamId)) return false;

        if (activeCategory === "bhajans_pallaki") {
          return isPallakiOrBhajan(activity.category, activity.title);
        }
        if (activeCategory === "activities") {
          return isDandiyaOrActivity(activity.category, activity.title);
        }
        if (activeCategory === "annadanam") {
          return activity.category === "Annadanam";
        }
        return true;
      })
      .map((activity) => ({
        ...activity,
        mandapam: mandapams.find((mandapam) => mandapam.id === activity.mandapamId)
      }));
  }, [activities, mandapams, activeCategory, nearList, showAllOverride]);

  const displayedMandapams = useMemo(() => {
    if (activeCategory === "annadanam") {
      return nearList.filter((mandapam) =>
        activities.some(
          (activity) =>
            activity.mandapamId === mandapam.id &&
            activity.category === "Annadanam" &&
            activity.published
        )
      );
    }
    if (activeCategory === "bhajans_pallaki") {
      return nearList.filter((mandapam) =>
        activities.some(
          (activity) =>
            activity.mandapamId === mandapam.id &&
            isPallakiOrBhajan(activity.category, activity.title) &&
            activity.published
        )
      );
    }
    if (activeCategory === "activities") {
      return nearList.filter((mandapam) =>
        activities.some(
          (activity) =>
            activity.mandapamId === mandapam.id &&
            isDandiyaOrActivity(activity.category, activity.title) &&
            activity.published
        )
      );
    }
    return nearList;
  }, [activeCategory, nearList, activities]);

  const categories: Array<{ id: Category; label: string; icon?: React.ReactNode }> = [
    { id: "all", label: "All Near Me" },
    { id: "mandapams", label: "Mandapams", icon: <MandapamIcon className="h-4 w-4" /> },
    { id: "annadanam", label: "Annadanam Near Me", icon: <PrasadBowlIcon className="h-5 w-5" /> },
    { id: "bhajans_pallaki", label: "Pallaki Seva & Bhajans", icon: <PallakiIcon className="h-4 w-4" /> },
    { id: "activities", label: "Dandiya & Activities", icon: <DandiyaIcon className="h-4 w-4" /> }
  ];

  const showMandapams =
    activeCategory === "all" ||
    activeCategory === "mandapams" ||
    activeCategory === "annadanam" || activeCategory === "bhajans_pallaki" || activeCategory === "activities";

  const showActivities =
    activeCategory === "all" ||
    activeCategory === "bhajans_pallaki" ||
    activeCategory === "activities" ||
    activeCategory === "annadanam";

  const currentDisplayArea = locationSource === "gps" ? userLocation?.area || "Current location" : manualArea;
  const currentDisplayCity = locationSource === "gps" ? userLocation?.city || "GPS" : manualCity;
  const displayLocation = currentDisplayArea ? `${currentDisplayArea}, ${currentDisplayCity}` : currentDisplayCity;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 space-y-6 pb-24 font-sans">
      {/* Location Filter Card (Compact Dimensions) */}
      <section className="rounded-2xl border border-amber-300 bg-white/95 p-3 sm:p-4 shadow-sm max-w-2xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#8B1E1E] text-white shadow-xs">
            <Navigation className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 leading-none">Showing results near</p>
            <p className="truncate text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
              {displayLocation}
            </p>
            {locationSource === "gps" && (
              <p className="text-[10px] font-semibold text-emerald-700 leading-tight">High-accuracy GPS detected</p>
            )}
            {showAllOverride && (
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-900">
                  Showing all regions
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllOverride(false)}
                  className="text-[9px] font-bold text-[#8B1E1E] underline hover:text-[#781B1B]"
                >
                  Reset to {currentDisplayArea}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* District is required; the area field is intentionally optional. */}
        <div className="mt-2.5 grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_1.2fr_auto_auto]">
          <select
            value={REGIONS_DATA[manualCity] ? manualCity : "Nizamabad"}
            onChange={(event) => {
              setManualCity(event.target.value);
              setManualArea("");
              setLocationSource("manual");
            }}
            aria-label="Choose district"
            className="col-span-2 h-10 rounded-xl border border-amber-300 bg-white px-3 text-xs font-semibold text-stone-900 outline-none focus:ring-2 focus:ring-amber-500 sm:col-span-1"
          >
            {Object.keys(REGIONS_DATA).map((city) => <option key={city} value={city}>{city} ({REGIONS_DATA[city].state})</option>)}
          </select>
          <div className="relative col-span-2 sm:col-span-1">
            <input list="area-suggestions" value={manualArea} onChange={(event) => setManualArea(event.target.value)} placeholder="Area or locality (optional)" aria-label="Area or locality (optional)" className="h-10 w-full rounded-xl border border-amber-300 bg-white px-3 text-xs font-semibold text-stone-900 outline-none focus:ring-2 focus:ring-amber-500" />
            <datalist id="area-suggestions">{(REGIONS_DATA[manualCity]?.areas || []).map((area) => <option key={area} value={area} />)}</datalist>
          </div>
          <button type="button" onClick={applyManualLocation} className="h-10 rounded-xl bg-[#8B1E1E] px-4 text-xs font-bold text-white shadow-xs hover:bg-[#781B1B] active:scale-[0.98] transition-all whitespace-nowrap">
            <Search className="mr-1.5 inline h-4 w-4" />Search
          </button>
          <button type="button" onClick={requestBrowserLocation} disabled={isLocating} aria-label="Use current GPS location" title="Use current GPS location" className="grid h-10 w-10 place-items-center rounded-xl border border-amber-300 bg-amber-50 text-[#8B1E1E] hover:bg-amber-100 disabled:opacity-60 transition-all">
            <MapPin className={`h-[18px] w-[18px] ${isLocating ? "animate-pulse" : ""}`} />
          </button>
        </div>
      </section>

      {/* Filter Category Pills */}
      <div className="relative mx-auto h-[325px] w-full max-w-[430px] overflow-visible sm:hidden">
        <img
          src={navaratriAsset("/navaratri/assets/sage-scroll-filter-frame-transparent.png")}
          alt=""
          className="absolute left-[-6%] top-2 h-auto w-[112%] max-w-none object-contain"
        />
        <div className="absolute left-[10%] right-[10%] top-[26%] grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`flex h-[52px] items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-center text-[10px] font-black leading-tight shadow-sm transition-all last:col-span-2 last:mx-auto last:w-[54%] ${
                activeCategory === category.id
                  ? "bg-[#8B1E1E] text-white ring-2 ring-amber-100"
                  : "border border-[#e9ddb9] bg-[#fffaf0]/90 text-[#465b28] backdrop-blur-[1px] hover:bg-white"
              }`}
            >
              <span className="shrink-0">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:flex sm:flex-wrap sm:justify-center sm:gap-2 rounded-2xl border-2 border-[#f1e2bd] bg-[#fff9ea] p-2 shadow-xs">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              activeCategory === category.id
                ? "bg-[#8B1E1E] text-white shadow-sm"
                : "border border-amber-300 bg-white text-stone-700 hover:bg-amber-50"
            }`}
          >
            {category.icon}
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* 1. MANDAPAMS LIST (FOR ALL OR MANDAPAM / ANNADANAM FILTERS) */}
      {showMandapams && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">
                {activeCategory === "annadanam" ? "Prasadam Venues" : "Sacred Shrines"}
              </p>
              <h2 className="font-serif text-xl font-black text-[#8B1E1E]">
                {activeCategory === "annadanam" ? "Annadanam Mandapams Near You" : "Mandapams Near You"}
              </h2>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-900">
              {displayedMandapams.length} Mandapams
            </span>
          </div>

          {/* IF NO MANDAPAMS ARE REGISTERED FROM THIS REGION */}
          {displayedMandapams.length === 0 ? (
            <div className="rounded-3xl border border-amber-300 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/60 p-6 sm:p-8 text-center shadow-sm space-y-4">
              <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-amber-100 text-[#8B1E1E] shadow-sm">
                <MapPinOff className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>

              <div className="space-y-1.5 max-w-lg mx-auto">
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  Location Notice
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-black text-[#8B1E1E]">
                  No registered mandapams from your region
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  No Durga Mandapams have been registered yet from{" "}
                  <span className="font-bold text-stone-900">
                    {displayLocation}
                  </span>.
                  {locationSource === "gps"
                    ? " No registered mandapams were found within 25 km of your GPS location."
                    : " Be the first to put your mandapam on the live festival map!"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-lg mx-auto">
                <Link
                  to="/navaratri/register"
                  className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#8B1E1E] px-5 text-xs font-bold text-white shadow hover:bg-[#781B1B] transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  Register Your Durga Mandapam
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setManualCity("Nizamabad");
                    setManualArea("Subhash Nagar");
                    setUserLocation({
                      lat: 18.6725,
                      lng: 78.0941,
                      city: "Nizamabad",
                      area: "Subhash Nagar"
                    });
                    setLocationSource("manual");
                    setShowAllOverride(false);
                    toast.success("Switched to Subhash Nagar, Nizamabad");
                  }}
                  className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 text-xs font-bold text-stone-700 hover:bg-amber-100 transition-all"
                >
                  <Compass className="h-4 w-4 text-amber-700" />
                  Show Nizamabad Mandapams
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAllOverride(true);
                    toast.info("Showing all registered mandapams across all locations");
                  }}
                  className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all"
                >
                  View All ({mandapams.length})
                </button>
              </div>

              <div className="pt-4 border-t border-amber-200/60 max-w-md mx-auto flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <Info className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                <span>
                  Mandapams update live automatically as local samithis register their committees.
                </span>
              </div>
            </div>
          ) : (
            displayedMandapams.map((item) => {
              const mapsUrl = getMandapamDirectionsUrl(item);
              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[1.75rem] border border-amber-300 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:p-5"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img
                      src={item.coverImageUrl || navaratriAsset("/navaratri/assets/royal-maroon-arch.jpg")}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-2xl border border-amber-300 object-cover shadow-sm sm:h-20 sm:w-20"
                    />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">
                          {item.distanceKm.toFixed(1)} km away
                        </span>
                        <span className="text-stone-500">
                          {item.area}, {item.city}
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-black text-[#8B1E1E] sm:text-lg">
                        {item.name}
                      </h3>
                      {item.todayAlankarana && (
                        <p className="text-xs font-semibold text-amber-900">
                          Today’s Maa Darshan: {item.todayAlankarana.deviName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      to={`/navaratri/m/${item.slug}`}
                      className="flex-1 rounded-xl bg-[#8B1E1E] py-2.5 text-center text-xs font-bold text-white hover:bg-[#781B1B]"
                    >
                      Open Mandapam
                    </Link>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Navigate to ${item.name}`}
                      title="Navigate to this exact mandapam location"
                      className="grid h-10 w-12 place-items-center rounded-xl border border-amber-300 bg-amber-50 text-[#8B1E1E] hover:bg-amber-100"
                    >
                      <GoogleMapsIcon className="h-5 w-5" />
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </section>
      )}

      {/* 2. ACTIVITIES & PROCESSIONS (PALLAKI SEVA, BHAJANS, DANDIYA, ETC.) */}
      {showActivities && (
        <section className="mt-7 space-y-3 border-t-2 border-amber-200/90 pt-5">
          <div className="flex items-end justify-between gap-3 border-b border-amber-200/80 pb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">
                {activeCategory === "bhajans_pallaki"
                  ? "Devotional Programs"
                  : activeCategory === "activities"
                  ? "Mandapam Celebrations"
                  : "Celebrations & Activities"}
              </p>
              <h2 className="font-serif text-xl font-black text-[#8B1E1E]">
                {activeCategory === "bhajans_pallaki"
                  ? "Pallaki Seva & Bhajans Near You"
                  : activeCategory === "activities"
                  ? "Dandiya, Garba & Mandapam Activities"
                  : "Mandapam Activities & Processions"}
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                {activeCategory === "bhajans_pallaki"
                  ? "Evening palanquin processions, shobha yatras & devotional bhajans added by Mandapams"
                  : activeCategory === "activities"
                  ? "Community Dandiya nights, Bathukamma, competitions & cultural programs added by Mandapams"
                  : "Programs, bhajans, pallaki seva & cultural events added by local Mandapams"}
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-900 shrink-0">
              {visibleActivities.length} activities
            </span>
          </div>

          {visibleActivities.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 text-center text-xs text-stone-600 space-y-1">
              <p className="font-bold text-stone-800">No events or activities found in this region yet.</p>
              <p>When Mandapams in {currentDisplayArea}, {currentDisplayCity} post Bhajans, Pallaki Seva, or Dandiya schedules, they will appear here live.</p>
            </div>
          ) : (
            visibleActivities.map((activity) => {
              const mandapam = activity.mandapam;
              const activityMapsUrl = mandapam ? getMandapamDirectionsUrl(mandapam) : undefined;
              return (
                <article
                  key={activity.id}
                  className="rounded-2xl border border-amber-300 bg-white/95 p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-[#8B1E1E]">
                      {isHomamEvent(activity) ? (
                        <HomaKundaIcon className="h-7 w-7" />
                      ) : activity.category === "Competition" ? (
                        <Trophy className="h-5 w-5" />
                      ) : activity.category === "Pallaki Seva" ? (
                        <PallakiIcon className="h-5 w-5" />
                      ) : activity.category === "Bhajan" ? (
                        <Music2 className="h-5 w-5" />
                      ) : (
                        <Music2 className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          {activity.category}
                        </span>
                        {mandapam && (
                          <span className="text-[10px] font-semibold text-stone-500">
                            • {mandapam.name}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-base font-black text-[#8B1E1E] mt-0.5">
                        {activity.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-600">
                        {activity.description}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-stone-600">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5 text-amber-700" />
                          {activity.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-amber-700" />
                          {activity.startTime}
                          {activity.endTime ? `–${activity.endTime}` : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-amber-700" />
                          {activity.location || mandapam?.area}
                        </span>
                      </div>
                    </div>
                    {activityMapsUrl && (
                      <a
                        href={activityMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Navigate to ${activity.title}`}
                        title="Directions to Mandapam"
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-300 bg-amber-50 text-[#8B1E1E] hover:bg-amber-100"
                      >
                        <Navigation className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </section>
      )}
    </div>
  );
};

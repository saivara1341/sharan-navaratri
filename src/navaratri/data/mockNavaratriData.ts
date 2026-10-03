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

export const INITIAL_SEASON: Season = {
  id: "season-2026",
  name: "Sharan Navaratri 2026",
  year: 2026,
  startDate: "2026-10-11",
  endDate: "2026-10-20",
  status: "LIVE"
};

export const INITIAL_MANDAPAMS: Mandapam[] = [
  {
    id: "m-rr-nizamabad",
    seasonId: "season-2026",
    name: "Sri Raja Rajeshwari Devi Utsav Mandapam",
    slug: "sri-raja-rajeshwari-nizamabad",
    description: "42nd Year Grand Navaratri Celebrations with daily Vedic Chandi Homam, Suvasini Pooja, Grand Maha Annadanam, and nightly Pallaki Seva.",
    deviName: "Sri Bala Tripura Sundari Devi",
    address: "Near Venkateshwara Temple, Subhash Nagar Road No. 3",
    area: "Subhash Nagar",
    city: "Nizamabad",
    state: "Telangana",
    pincode: "503002",
    latitude: 18.6725,
    longitude: 78.0941,
    verificationStatus: "VERIFIED",
    organizerName: "Subhash Nagar Utsav Committee (G. Ramesh & Team)",
    organizerMobile: "+91 94401 23456",
    organizerEmail: "utsav@rajeshwarimandapam.org",
    logoUrl: navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"),
    coverImageUrl: navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg"),
    contactPhone: "+91 94401 23456",
    whatsappNumber: "+91 94401 23456",
    passcode: "944012",
    createdAt: "2026-09-15T10:00:00Z"
  },
  {
    id: "m-kd-khaleelwadi",
    seasonId: "season-2026",
    name: "Sri Kanaka Durga Bhavani Mandapam",
    slug: "sri-kanaka-durga-khaleelwadi",
    description: "Sacred shrine with Golden Gopuram setup, Daily 1,116 Kumkumarchana, evening devotional dances, and Sri Chakra Archana.",
    deviName: "Sri Gayatri Devi",
    address: "Opposite Municipal Garden, Main Road",
    area: "Khaleelwadi",
    city: "Nizamabad",
    state: "Telangana",
    pincode: "503001",
    latitude: 18.6789,
    longitude: 78.1012,
    verificationStatus: "VERIFIED",
    organizerName: "Sri Kanaka Durga Bhakta Mandali",
    organizerMobile: "+91 98480 87654",
    organizerEmail: "durga@khaleelwadi.in",
    logoUrl: navaratriAsset("/navaratri/assets/golden-lotus-bg.jpg"),
    coverImageUrl: navaratriAsset("/navaratri/assets/sage-floral-bg.jpg"),
    contactPhone: "+91 98480 87654",
    whatsappNumber: "+91 98480 87654",
    passcode: "984808",
    createdAt: "2026-09-16T12:00:00Z"
  },
  {
    id: "m-bk-hyderabad",
    seasonId: "season-2026",
    name: "Sri Bhadrakali Navaratri Utsav Samithi",
    slug: "sri-bhadrakali-hyderabad",
    description: "Centuries-old community mandapam featuring authentic traditional Bathukamma festivities, Akhanda Deeparadhana, and Bhavani Dheeksha camp.",
    deviName: "Sri Mahalakshmi Devi",
    address: "Historic Temple Street, Near Charminar Heritage Zone",
    area: "Old City",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500002",
    latitude: 17.3616,
    longitude: 78.4747,
    verificationStatus: "VERIFIED",
    organizerName: "Pandit S. V. Sharma & Samithi Trustees",
    organizerMobile: "+91 98490 11223",
    organizerEmail: "bhadrakali@hyderabadutsav.org",
    logoUrl: navaratriAsset("/navaratri/assets/temple-arch-frame.jpg"),
    coverImageUrl: navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg"),
    contactPhone: "+91 98490 11223",
    whatsappNumber: "+91 98490 11223",
    passcode: "984901",
    createdAt: "2026-09-18T14:30:00Z"
  },
  {
    id: "m-ml-vijayawada",
    seasonId: "season-2026",
    name: "Maa Mahalakshmi Navaratri Pandal",
    slug: "maa-mahalakshmi-vijayawada",
    description: "Devotees gather for Suvarna Pushparchana, special Kanya Pooja with 108 girls, and sacred Krishna River Teertha Prasad.",
    deviName: "Sri Annapurna Devi",
    address: "Beside Canal Road, Governorpet",
    area: "Governorpet",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    pincode: "520002",
    latitude: 16.5131,
    longitude: 80.6325,
    verificationStatus: "VERIFIED",
    organizerName: "Vijayawada Mahila Mandali",
    organizerMobile: "+91 94900 33445",
    organizerEmail: "mahalakshmi@vijayawadapandal.org",
    logoUrl: navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"),
    coverImageUrl: navaratriAsset("/navaratri/assets/golden-lotus-bg.jpg"),
    contactPhone: "+91 94900 33445",
    whatsappNumber: "+91 94900 33445",
    passcode: "949003",
    createdAt: "2026-09-20T09:15:00Z"
  },
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

export const INITIAL_DAY_SETTINGS: MandapamDaySetting[] = [
  {
    id: "ds-rr-1",
    mandapamId: "m-rr-nizamabad",
    dayNumber: 1,
    date: "2026-10-11",
    useStandardDevi: true,
    useStandardPooja: false,
    customPoojaTimings: "Morning: 07:30 AM (Ganapathi & Kalash Sthapana) | Evening: 06:30 PM (Maha Harathi)",
    useStandardNaivedhyam: false,
    customNaivedhyam: "Chakkara Pongali, Ghee Appalu, Honey, Raw Cow Milk, Tender Coconuts",
    useStandardPrasadam: false,
    customPrasadam: "Chakkara Pongali Prasad cups distributed to all visiting devotees",
    useStandardItems: true,
    annadanamEnabled: true,
    annadanamStartTime: "12:30 PM",
    annadanamEndTime: "03:30 PM",
    annadanamLocation: "Kalyana Mandapam Ground Floor Hall",
    annadanamExpectedCount: 1200,
    annadanamNotes: "Pure satvik bhojanam with Pulihora, Sambar, Sweet, and Buttermilk."
  },
  {
    id: "ds-rr-2",
    mandapamId: "m-rr-nizamabad",
    dayNumber: 2,
    date: "2026-10-12",
    useStandardDevi: true,
    useStandardPooja: true,
    useStandardNaivedhyam: true,
    useStandardPrasadam: true,
    useStandardItems: true,
    annadanamEnabled: true,
    annadanamStartTime: "12:30 PM",
    annadanamEndTime: "03:00 PM",
    annadanamLocation: "Kalyana Mandapam Dining Hall",
    annadanamExpectedCount: 1000,
    annadanamNotes: "Satvik festival meal for all devotees."
  },
  {
    id: "ds-hr-1",
    mandapamId: "mnp-178584",
    dayNumber: 1,
    date: "2026-10-11",
    useStandardDevi: true,
    useStandardPooja: false,
    customPoojaTimings: "Morning: 07:30 AM (Kalash & Ganapathi Sthapana) | Evening: 06:30 PM (Maha Harathi)",
    useStandardNaivedhyam: false,
    customNaivedhyam: "Katte Pongali, Ghee Appalu, Honey, Bananas, Coconuts",
    useStandardPrasadam: false,
    customPrasadam: "Hot Pongali & Sweet Prasadam for all visiting devotees",
    useStandardItems: true,
    annadanamEnabled: true,
    annadanamStartTime: "12:30 PM",
    annadanamEndTime: "03:30 PM",
    annadanamLocation: "Mandapam Annadanam Pandal, Nizamabad",
    annadanamExpectedCount: 600,
    annadanamNotes: "Daily sacred Annaprasadam seva for all devotees"
  },
  {
    id: "ds-hr-2",
    mandapamId: "mnp-178584",
    dayNumber: 2,
    date: "2026-10-12",
    useStandardDevi: true,
    useStandardPooja: true,
    useStandardNaivedhyam: true,
    useStandardPrasadam: true,
    useStandardItems: true,
    annadanamEnabled: true,
    annadanamStartTime: "12:30 PM",
    annadanamEndTime: "03:00 PM",
    annadanamLocation: "Mandapam Annadanam Pandal, Nizamabad",
    annadanamExpectedCount: 500,
    annadanamNotes: "Daily sacred Annaprasadam seva for all devotees"
  }
];

export const INITIAL_ALANKARANAS: Alankarana[] = [
  {
    id: "alan-rr-today",
    mandapamId: "m-rr-nizamabad",
    seasonId: "season-2026",
    date: "2026-10-11",
    title: "Maa Sri Bala Tripura Sundari Alankarana (Day 1)",
    deviName: "Sri Bala Tripura Sundari Devi",
    description: "Adorned in pure golden yellow Kanchi silk saree with natural fragrant Madurai Jasmine garlands, gold crown, and abhaya hastam.",
    imageUrl: navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"),
    published: true,
    createdAt: "2026-10-11T06:00:00Z"
  },
  {
    id: "alan-kd-today",
    mandapamId: "m-kd-khaleelwadi",
    seasonId: "season-2026",
    date: "2026-10-11",
    title: "Sri Gayatri Devi Divya Darshanam",
    deviName: "Sri Gayatri Devi",
    description: "Divine form adorned with pearl ornaments, green silk vastram, holding the sacred scriptures and rosary.",
    imageUrl: navaratriAsset("/navaratri/assets/golden-lotus-bg.jpg"),
    published: true,
    createdAt: "2026-10-11T06:30:00Z"
  },
  {
    id: "alan-bk-today",
    mandapamId: "m-bk-hyderabad",
    seasonId: "season-2026",
    date: "2026-10-11",
    title: "Sri Mahalakshmi Devi Alankarana",
    deviName: "Sri Mahalakshmi Devi",
    description: "Magnificent lotus darshan with ruby necklace and sacred silver padukas.",
    imageUrl: navaratriAsset("/navaratri/assets/sage-floral-bg.jpg"),
    published: true,
    createdAt: "2026-10-11T07:00:00Z"
  },
  {
    id: "alan-hr-today",
    mandapamId: "mnp-178584",
    seasonId: "season-2026",
    date: "2026-10-11",
    title: "Sri Bala Tripura Sundari Devi Alankarana (Day 1)",
    deviName: "Sri Bala Tripura Sundari Devi",
    description: "Grand inaugural darshan with Ghatasthapana and Suprabhatha Seva to invoke the young, divine motherly form.",
    imageUrl: navaratriAsset("/navaratri/assets/bala-tripura-sundari-alankarana.jpg"),
    published: true,
    createdAt: "2026-10-11T06:00:00Z"
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: "srv-hr-archana",
    mandapamId: "mnp-178584",
    type: "Kumkum Archana",
    name: "Sri Durga Devi Sahasranama Archana",
    description: "Participate in person with individual pooja plate, sacred bilva archana, and receive holy Prasadam packet.",
    instructions: "Devotees are requested to wear traditional dress and arrive 15 minutes before the scheduled slot.",
    enabled: true,
    bookingEnabled: true,
    itemsRequired: "2 Yellow coconuts, Betel leaves, Fresh red flower garland, Bananas",
    durationMinutes: 45,
    capacityPerSlot: 50
  },
  {
    id: "srv-kumkumarchana",
    mandapamId: "m-rr-nizamabad",
    type: "Kumkum Archana",
    name: "Sahasra Nama Kumkumarchana",
    description: "Participate in person with individual pooja plate and receive energized silver dollar & prasadam pack.",
    instructions: "Devotees are requested to wear traditional dress (Dhoti/Kurta or Saree) and arrive 15 minutes before the slot.",
    enabled: true,
    bookingEnabled: true,
    itemsRequired: "2 Yellow coconuts, Betel leaves & nuts, 1 Red flower garland",
    durationMinutes: 60,
    capacityPerSlot: 40
  },
  {
    id: "srv-chandi-parayanam",
    mandapamId: "m-rr-nizamabad",
    type: "Special Pooja",
    name: "Sri Chandi Parayanam & Sankalpam",
    description: "Special family gotra namarchana and participation in daily Chandi Parayana ritual by scholarly Vedic priests.",
    instructions: "Provide family gotra, nakshatra, and names during booking.",
    enabled: true,
    bookingEnabled: true,
    itemsRequired: "Dry fruits, Pure Cow Ghee (500g), Purnahuti Samagri",
    durationMinutes: 90,
    capacityPerSlot: 25
  },
  {
    id: "srv-pallaki-seva-carrier",
    mandapamId: "m-rr-nizamabad",
    type: "Pallaki Seva",
    name: "Pallaki Seva - Palanquin Carrying Seva",
    description: "Sacred opportunity for devotees to carry the divine golden palanquin of Maa Durga through the sacred streets.",
    instructions: "Strict satvik discipline; barefoot participation during procession.",
    enabled: true,
    bookingEnabled: true,
    itemsRequired: "White angavastram, Chamara/Fan seva (optional)",
    durationMinutes: 90,
    capacityPerSlot: 30
  },
  {
    id: "srv-annadanam-seva",
    mandapamId: "m-rr-nizamabad",
    type: "Annadanam",
    name: "Annadanam Volunteer & Anna Seva",
    description: "Serve satvik bhojanam to fellow devotees or register family sponsorship (Nithya Annadanam Seva).",
    instructions: "Clean hands, cap/cloth for head covering provided at venue.",
    enabled: true,
    bookingEnabled: true,
    itemsRequired: "Voluntary enthusiasm to serve",
    durationMinutes: 120,
    capacityPerSlot: 20
  }
];

export const INITIAL_SLOTS: ServiceSlot[] = [
  {
    id: "slot-kk-morning",
    serviceId: "srv-kumkumarchana",
    mandapamId: "m-rr-nizamabad",
    date: "2026-10-11",
    startTime: "09:00 AM",
    endTime: "10:15 AM",
    capacity: 40,
    bookedCount: 32,
    walkinCount: 4,
    status: "AVAILABLE"
  },
  {
    id: "slot-kk-evening",
    serviceId: "srv-kumkumarchana",
    mandapamId: "m-rr-nizamabad",
    date: "2026-10-11",
    startTime: "05:30 PM",
    endTime: "06:45 PM",
    capacity: 40,
    bookedCount: 38,
    walkinCount: 2,
    status: "FULL"
  },
  {
    id: "slot-chandi-morning",
    serviceId: "srv-chandi-parayanam",
    mandapamId: "m-rr-nizamabad",
    date: "2026-10-11",
    startTime: "08:00 AM",
    endTime: "09:30 AM",
    capacity: 25,
    bookedCount: 18,
    walkinCount: 2,
    status: "AVAILABLE"
  },
  {
    id: "slot-pallaki-night",
    serviceId: "srv-pallaki-seva-carrier",
    mandapamId: "m-rr-nizamabad",
    date: "2026-10-11",
    startTime: "07:30 PM",
    endTime: "09:00 PM",
    capacity: 30,
    bookedCount: 22,
    walkinCount: 3,
    status: "AVAILABLE"
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "b-001",
    bookingCode: "NM-7842",
    slotId: "slot-kk-morning",
    serviceId: "srv-kumkumarchana",
    mandapamId: "m-rr-nizamabad",
    name: "Venkata Satyanarayana",
    mobile: "+91 98481 22334",
    quantity: 2,
    bookingType: "ONLINE",
    status: "CONFIRMED",
    notes: "Kashyapa Gotram, Rohini Nakshatram",
    serviceName: "Sahasra Nama Kumkumarchana",
    slotTime: "09:00 AM - 10:15 AM",
    date: "2026-10-11",
    createdAt: "2026-10-10T14:20:00Z"
  },
  {
    id: "b-002",
    bookingCode: "NM-9102",
    slotId: "slot-kk-morning",
    serviceId: "srv-kumkumarchana",
    mandapamId: "m-rr-nizamabad",
    name: "Lakshmi Prasanna",
    mobile: "+91 94411 55667",
    quantity: 1,
    bookingType: "WALK_IN",
    status: "CHECKED_IN",
    notes: "Walk-in registered at temple reception counter",
    serviceName: "Sahasra Nama Kumkumarchana",
    slotTime: "09:00 AM - 10:15 AM",
    date: "2026-10-11",
    createdAt: "2026-10-11T08:15:00Z"
  }
];

export const INITIAL_PALLAKI_SEVAS: PallakiSeva[] = [
  {
    id: "ps-rr-1",
    mandapamId: "m-rr-nizamabad",
    title: "Swarna Pallaki Shobha Seva (Golden Palanquin Procession)",
    date: "2026-10-11",
    startTime: "07:30 PM",
    endTime: "09:30 PM",
    routeDetails: "Subhash Nagar Mandapam -> NTR Circle -> Gandhi Chowk -> Main Market -> Returns via Municipal Colony",
    darshanPoints: "NTR Circle (7:50 PM), Gandhi Statue (8:20 PM), Old Market Corner (8:50 PM)",
    coordinatorName: "Sri Srinivas Goud & Youth Committee",
    coordinatorPhone: "+91 94405 67890",
    liveStatus: "SCHEDULED",
    published: true
  },
  {
    id: "ps-bk-1",
    mandapamId: "m-bk-hyderabad",
    title: "Maha Rathotsavam & Pallaki Seva",
    date: "2026-10-11",
    startTime: "08:00 PM",
    endTime: "10:30 PM",
    routeDetails: "Charminar Temple Arch -> Lad Bazaar -> Shalibanda Main Road -> Returns to Mandapam",
    darshanPoints: "Charminar Arch (8:15 PM), Shalibanda Junction (9:15 PM)",
    coordinatorName: "K. Mohan Rao",
    coordinatorPhone: "+91 98492 44556",
    liveStatus: "SCHEDULED",
    published: true
  }
];

export const INITIAL_DHEEKSHA_PROGRAMS: DheekshaProgram[] = [
  {
    id: "dh-rr-1",
    mandapamId: "m-rr-nizamabad",
    dheekshaName: "Sri Bhavani & Durga Shakti Dheeksha (41 Days / 9 Days)",
    malaDharanaDate: "2026-10-11",
    viramamDate: "2026-10-21",
    dailyNiyamas: "Pratah Snanam with cold water, Wearing Red/Ochre vastras, Japa of Sri Lalitha Trishati, strictly Ekabhuktam (single satvik meal), Ground sleeping on kusha mat.",
    irumudiPoojaDate: "2026-10-20",
    contactGuruName: "Guru Swamy K. Venkataiah",
    contactGuruPhone: "+91 98488 99887",
    rulesList: [
      "Awaken at Brahma Muhurtham (04:30 AM) and perform Sandhyavandanam or Stotram.",
      "Wear holy Rudraksha / Tulasi Mala blessed at Mandapam sanctum.",
      "Strict vegetarian food devoid of onion and garlic.",
      "Avoid footwear and leather items during entire dheeksha period.",
      "Attend evening Harathi and Chandi Parayanam daily at the Mandapam."
    ]
  }
];

export const INITIAL_NIMARJANAM_SCHEDULES: NimarjanamSchedule[] = [
  {
    id: "nim-rr-1",
    mandapamId: "m-rr-nizamabad",
    nimarjanamDate: "2026-10-21",
    shobhaYatraStartTime: "02:00 PM",
    designatedGhat: "Ashok Sagar Kalyani Lake - Ghat No. 2",
    city: "Nizamabad",
    vehicleType: "Decorated Open DCM Truck with Floral Canopy",
    vehiclePassNumber: "NZB-NIM-2026-084",
    queueStatus: "WAITING",
    emergencyContact: "Police Control Room: 100 / Mandapam Helpline: +91 94401 23456",
    routeGuidelines: "Follow police route via Bodhan Road bypass. High tension electric wire clearances verified by TSSPDCL. No bursting of harmful firecrackers near crowds."
  },
  {
    id: "nim-bk-1",
    mandapamId: "m-bk-hyderabad",
    nimarjanamDate: "2026-10-21",
    shobhaYatraStartTime: "01:00 PM",
    designatedGhat: "Hussain Sagar Crane No. 4 (Near People's Plaza)",
    city: "Hyderabad",
    vehicleType: "Heavy Trailer 40ft with Sound Decibel Compliance",
    vehiclePassNumber: "HYD-VIS-2026-1412",
    queueStatus: "WAITING",
    emergencyContact: "GHMC Control: 040-21111111 / ACP Traffic: 94906 17000",
    routeGuidelines: "Permitted convoy route: MJ Market -> Abids -> Basheerbagh -> Liberty -> Tank Bund Crane 4."
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    mandapamId: "m-rr-nizamabad",
    title: "Grand Bathukamma Celebrations with Folk Songs",
    category: "Cultural Program",
    description: "Women and young girls bring floral Bathukammas crafted with Gunugu, Tangedu, and Marigold flowers. Special prizes for best floral arrangements.",
    date: "2026-10-11",
    startTime: "05:00 PM",
    endTime: "07:30 PM",
    location: "Subhash Nagar Open Ground",
    capacity: 500,
    bookingEnabled: false,
    instructions: "Open to all families. Prasadam (Saddula Bathukamma maleeda) will be offered.",
    published: true
  },
  {
    id: "act-2",
    mandapamId: "m-rr-nizamabad",
    title: "Children's Devotional Sloka & Bhagavad Gita Competition",
    category: "Competition",
    description: "Children under 14 recite Chapter 12 (Bhakti Yoga) and Durga Saptashati slokas. Mementos & certificates for all participants.",
    date: "2026-10-14",
    startTime: "04:00 PM",
    endTime: "06:00 PM",
    location: "Mandapam Community Hall",
    capacity: 60,
    bookingEnabled: true,
    instructions: "Register child's name with age at the counter or online.",
    published: true
  },
  {
    id: "act-3",
    mandapamId: "m-rr-nizamabad",
    title: "Bhakti Sangeet & Sri Lalitha Sahasranama Parayanam",
    category: "Devotional Program",
    description: "Devotional group singing, divine stotra chanting, and flute recital by local youth and devotees.",
    date: "2026-10-15",
    startTime: "06:00 PM",
    endTime: "08:30 PM",
    location: "Mandapam Main Stage",
    capacity: 350,
    bookingEnabled: false,
    published: true
  },
  {
    id: "act-4",
    mandapamId: "m-rr-nizamabad",
    title: "Community Garba & Dandiya Night",
    category: "Cultural Program",
    description: "Open Garba circles followed by family Dandiya. Traditional attire is encouraged; beginners are welcome.",
    date: "2026-10-16",
    startTime: "07:30 PM",
    endTime: "10:00 PM",
    location: "Subhash Nagar Festival Ground",
    capacity: 800,
    bookingEnabled: false,
    instructions: "Bring personal dandiya sticks if available. Entry is free.",
    published: true
  },
  {
    id: "act-5",
    mandapamId: "m-rr-nizamabad",
    title: "Rangoli, Singing & Fancy Dress Competitions",
    category: "Competition",
    description: "Separate age groups for children and adults, with prizes for devotional themes and traditional presentation.",
    date: "2026-10-18",
    startTime: "03:30 PM",
    endTime: "06:30 PM",
    location: "Mandapam Community Hall",
    capacity: 120,
    bookingEnabled: true,
    instructions: "Register with the mandapam committee before the event starts.",
    published: true
  },
  {
    id: "act-6",
    mandapamId: "m-rr-nizamabad",
    title: "Swarna Pallaki Shobha Seva (Golden Palanquin Procession)",
    category: "Pallaki Seva",
    description: "Evening grand palanquin procession carrying Devi utsavamurti through Gandhi Chowk and Subhash Nagar with traditional mangala vadhyams and volunteer carrying seva.",
    date: "2026-10-11",
    startTime: "07:30 PM",
    endTime: "09:30 PM",
    location: "Subhash Nagar Mandapam -> Gandhi Chowk -> Main Market",
    capacity: 1000,
    bookingEnabled: false,
    instructions: "Devotees can join the carrying seva or offer harathi at designated checkpoints.",
    published: true
  },
  {
    id: "act-7",
    mandapamId: "m-rr-nizamabad",
    title: "Akhanda Lalitha Sahasranama & Devi Bhajans",
    category: "Bhajan",
    description: "Soulful choral bhajans, stotram parayanam, and devotional singing by community mahila mandali.",
    date: "2026-10-12",
    startTime: "06:30 PM",
    endTime: "08:30 PM",
    location: "Main Mandapam Sanctum",
    capacity: 250,
    bookingEnabled: false,
    instructions: "Open to all devotees. Songbooks and prasad will be distributed.",
    published: true
  },
  {
    id: "act-hr-1",
    mandapamId: "mnp-178584",
    title: "Maha Bathukamma Sambaralu & Floral Pooja",
    category: "Cultural Program",
    description: "Grand traditional Bathukamma festivities organized by Hrudhaya Ragu Ram Youth. Devotees and families gather with flowers, folk singing, and prizes for best decorated Bathukamma.",
    date: "2026-10-18",
    startTime: "05:00 PM",
    endTime: "08:00 PM",
    location: "Mandapam Festival Ground, Nizamabad",
    capacity: 600,
    bookingEnabled: true,
    instructions: "Free registration. Traditional attire encouraged. Saddula prasadam will be offered to all participants.",
    published: true
  },
  {
    id: "act-hr-2",
    mandapamId: "mnp-178584",
    title: "Children's Devi Vesha Dharana & Sloka Recitation",
    category: "Competition",
    description: "Children under 15 years dress up in sacred Navadurga divine forms and recite Devi slokas. Divine mementos & certificates for all participants.",
    date: "2026-10-16",
    startTime: "04:30 PM",
    endTime: "07:00 PM",
    location: "Mandapam Community Stage, Nizamabad",
    capacity: 100,
    bookingEnabled: true,
    instructions: "Free registration online or at counter. Parents please register participant names in advance.",
    published: true
  },
  {
    id: "act-hr-3",
    mandapamId: "mnp-178584",
    title: "Sri Lalitha Sahasranama Stotram Group Parayanam",
    category: "Pooja & Chanting",
    description: "Mass sacred chanting of Sri Lalitha Sahasranama with kumkuma archana for family prosperity, peace, and health.",
    date: "2026-10-15",
    startTime: "06:00 PM",
    endTime: "07:30 PM",
    location: "Main Mandapam Sanctum, Nizamabad",
    capacity: 300,
    bookingEnabled: true,
    instructions: "All devotees are welcome to join the parayanam. Stotram books provided.",
    published: true
  },
  {
    id: "act-hr-4",
    mandapamId: "mnp-178584",
    title: "Akhanda Dandiya & Kolatam Youth Night",
    category: "Cultural Program",
    description: "High-energy devotional Garba & Dandiya dance night by Hrudhaya Ragu Ram Youth. Pure devotional music, joyful celebration with prizes for best traditional dancers.",
    date: "2026-10-19",
    startTime: "07:00 PM",
    endTime: "10:30 PM",
    location: "Subhash Nagar Open Ground, Nizamabad",
    capacity: 800,
    bookingEnabled: true,
    instructions: "Open to youth and families. Entry is free with online registration.",
    published: true
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    mandapamId: "m-rr-nizamabad",
    title: "Maha Annadanam Timings Today: 12:30 PM to 03:30 PM",
    message: "Devotees arriving from nearby villages can avail seating in Kalyana Mandapam. Token counter opens at 12:00 noon.",
    priority: "HIGH",
    published: true,
    createdAt: "2026-10-11T07:15:00Z"
  },
  {
    id: "ann-2",
    mandapamId: "m-rr-nizamabad",
    title: "Pallaki Seva Route Notification for Tonight",
    message: "The procession will take the Subhash Nagar - NTR Circle - Market route starting sharply at 07:30 PM. Live tracking is active on this portal.",
    priority: "NORMAL",
    published: true,
    createdAt: "2026-10-11T08:30:00Z"
  },
  {
    id: "ann-3",
    mandapamId: "m-rr-nizamabad",
    title: "Kumkumarchana Devotee Preparation Note",
    message: "Kindly bring 2 yellow coconuts, turmeric roots, and betel leaves. Flower garlands will be provided by the committee.",
    priority: "NORMAL",
    published: true,
    createdAt: "2026-10-10T18:00:00Z"
  }
];

export const INITIAL_QUESTIONS: CommunityQuestion[] = [
  {
    id: "q-1",
    mandapamId: "m-rr-nizamabad",
    askerName: "Rajeshwar Rao",
    question: "What is the exact timing for Annadanam today and is vehicle parking available nearby?",
    language: "en",
    status: "PUBLISHED",
    createdAt: "2026-10-11T08:00:00Z",
    answers: [
      {
        id: "ans-1",
        questionId: "q-1",
        mandapamId: "m-rr-nizamabad",
        responderName: "Mandapam Secretary (G. Ramesh)",
        isOfficial: true,
        answer: "Namaskaram! Annadanam starts at 12:30 PM and runs until 03:30 PM. Dedicated two-wheeler and four-wheeler parking is available at the adjacent Zilla Parishad High School ground.",
        language: "en",
        createdAt: "2026-10-11T08:20:00Z"
      }
    ]
  },
  {
    id: "q-2",
    mandapamId: "m-rr-nizamabad",
    askerName: "Sunitha Reddy",
    question: "Do we need to bring our own silver coins or kumkum plate for evening Sahasranama Archana?",
    language: "en",
    status: "PUBLISHED",
    createdAt: "2026-10-11T08:45:00Z",
    answers: [
      {
        id: "ans-2",
        questionId: "q-2",
        mandapamId: "m-rr-nizamabad",
        responderName: "Priest Team (P. Sharma)",
        isOfficial: true,
        answer: "Archana kumkum cups and consecrated copper plates are supplied by the Mandapam. Devotees only need to bring yellow coconuts and betel leaves.",
        language: "en",
        createdAt: "2026-10-11T09:10:00Z"
      }
    ]
  }
];

export const INITIAL_AD_PACKAGES: AdPackage[] = [
  {
    id: "pkg-local",
    name: "LOCAL",
    priceInr: 49,
    durationDays: 1,
    impressionLimit: 2500,
    placementType: "HOME_NEAR_ME",
    description: "Ideal for small local flower vendors, sweet stalls, and neighborhood pooja samagri stores."
  },
  {
    id: "pkg-growth",
    name: "GROWTH",
    priceInr: 99,
    durationDays: 3,
    impressionLimit: 8000,
    placementType: "HOME_EXPLORE_NEARBY",
    description: "Broader local reach with area-based targeting and prominent business phone call action.",
    popular: true
  },
  {
    id: "pkg-festival",
    name: "FESTIVAL",
    priceInr: 199,
    durationDays: 9,
    impressionLimit: 25000,
    placementType: "ALL_CITIZEN_PAGES",
    description: "Full 9-day festival visibility across Home, Explore, and Darshan feeds for restaurants, silks, and sweet houses."
  },
  {
    id: "pkg-mandapam-area",
    name: "MANDAPAM AREA",
    priceInr: 299,
    durationDays: 9,
    impressionLimit: 40000,
    placementType: "MANDAPAM_PAGE_EXCLUSIVE",
    description: "Target devotees directly around selected Mandapams within 3 km radius with priority badge."
  }
];

export const INITIAL_ADVERTISEMENTS: Advertisement[] = [];

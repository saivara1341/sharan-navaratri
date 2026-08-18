import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
    MessageSquare,
    MapPin,
    FileText,
    AlertTriangle,
    Mic,
    Users,
    Building2,
    BookOpen,
    Palmtree,
    ArrowLeft,
    Search,
    ChevronRight,
    ArrowRight,
    CheckCircle2,
    Shield,
    Sparkles,
    Landmark,
    FileCheck2,
    Compass,
    PhoneCall,
    Send,
    HelpCircle,
    Vote,
    RefreshCw,
    FileSearch,
    BadgeCheck,
    Coins,
    Check,
    Cpu,
    Lock,
    Scale,
    Layers,
    Share2,
    TrendingUp,
    Volume2,
    ExternalLink
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { WaitlistModal } from '@/components/WaitlistModal';

// --- Sample Interactive Simulated Responses ---
const SIMULATED_PROMPTS = [
    {
        id: 'birth-cert',
        title: 'Birth Certificate Procedure',
        query: 'How do I apply for a birth certificate in Telangana?',
        category: 'Revenue & Municipal',
        badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        response: {
            title: 'Official Procedure: Birth Certificate (MeeSeva / GHMC)',
            source: 'Verified from Telangana Citizen Charter (Act No. 7 / MeeSeva SOP)',
            steps: [
                'Visit your nearest MeeSeva Center or login to the MeeSeva 2.0 Citizen Portal.',
                'Select "Revenue & Municipal Administration" → "Birth Certificate Application (Form 201)".',
                'Upload Hospital Birth Report / Discharge Slip along with Parents’ Aadhaar cards.',
                'Pay the nominal fee of ₹35. Track status with Reference ID (SLA: 3 to 7 working days).'
            ],
            actionText: 'Download Application Checklist (PDF)',
            status: 'Instant Verification'
        }
    },
    {
        id: 'pothole-report',
        title: 'Report Civic Hazard / Potholes',
        query: 'Report severe potholes and broken streetlight at MG Road junction, Nizamabad.',
        category: 'Grievance Redressal',
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        response: {
            title: 'Grievance Auto-Classified & Routed',
            source: 'Mapped to Nizamabad Municipal Corporation (Works & Electrical Division)',
            steps: [
                'Grievance Category: Municipal Engineering & Road Safety (Priority: P1 Urgent).',
                'Geo-Coordinates Tagged: 18.6725° N, 78.0941° E (Kotagally Ward 14).',
                'Generated Reference Ticket: #TG-NZB-CIVIC-2026-9482.',
                'Auto-dispatched to Executive Engineer (Roads) with a 48-Hour Resolution SLA.'
            ],
            actionText: 'Track Grievance Ticket Live',
            status: 'Dispatched to Officer'
        }
    },
    {
        id: 'patta-parser',
        title: 'Land Record & Patta Analysis',
        query: 'Scan and verify Survey No. 412/A ROR-1B land title document.',
        category: 'AI Document Parser',
        badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        response: {
            title: 'Multimodal Document Analysis Complete',
            source: 'Extracted via Gemini 1.5 Vision OCR against Dharani Land Registry Schema',
            steps: [
                'Survey Number: 412/A | Sub-division: P2 | Extent: 2 Acres 18 Guntas.',
                'Nature of Land: Agricultural (Patta Land - Dry/Wet mix).',
                'Encumbrance Status: Clear (No active bank mortgage or court injunctions registered).',
                'Passbook Reference: T1804008920 — Name & Aadhaar matching 100% verified.'
            ],
            actionText: 'View Encumbrance Certificate Summary',
            status: 'Title Verified'
        }
    },
    {
        id: 'voice-welfare',
        title: 'Voice Query (Telugu / Regional)',
        query: 'నాకు రైతు బంధు / రైతు భరోసా అర్హత వివరాలు చెప్పండి (Explain Rythu Bharosa eligibility in Telugu)',
        category: 'Voice-First AI',
        badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        response: {
            title: 'రైతు భరోసా సంపూర్ణ వివరాలు (Rythu Bharosa Official Guide)',
            source: 'Agriculture & Farmers Welfare Department (G.O. Ms. No. 12/2026)',
            steps: [
                'అర్హత: పట్టాదారు పాసుపుస్తకం కలిగి ఉన్న ప్రతి రైతు కుటుంబానికి వర్తిస్తుంది.',
                'సహాయం: ఎకరానికి సీజన్‌కు ₹7,500 చొప్పున సంవత్సరానికి ₹15,000 నేరుగా DBT ద్వారా జమ.',
                'కావాల్సిన పత్రాలు: ఆధార్ కార్డు, బ్యాంకు ఖాతా (NPCI లింక్ చేయబడింది), పట్టాదారు పాసుబుక్ నంబర్.',
                'సందేహాలు ఉంటే మీ మండల వ్యవసాయ అధికారి (AEO)ని సంప్రదించండి.'
            ],
            actionText: 'Listen in Audio Voice (Telugu)',
            status: 'Voice Transcribed'
        }
    }
];

// --- Simulated District Data ---
const DISTRICT_DATA = [
    {
        id: 'nizamabad',
        name: 'Nizamabad',
        ward: 'Kotagally (Ward 14)',
        state: 'Telangana',
        stats: {
            sanctionedBudget: '₹4.85 Cr',
            completedWorks: '86%',
            activeGrievances: '18 Resolved this week',
            avgResolutionTime: '2.8 Days'
        },
        rep: {
            mla: 'Dhanpal Suryanarayana Gupta (Nizamabad Urban)',
            corporator: 'S. Ramulu (Ward 14)',
            collector: 'District Collectorate Nizamabad',
            nodalOfficer: 'Municipal Commissioner, NMC'
        },
        recentWorks: [
            { name: 'CC Road & Underground Drainage Phase 2', cost: '₹1.20 Cr', status: 'In Progress (78%)' },
            { name: 'LED Smart Streetlight Modernization', cost: '₹45 Lakhs', status: 'Completed' },
            { name: 'Public Park & Open Gym at Kotagally', cost: '₹28 Lakhs', status: 'Sanctioned' }
        ]
    },
    {
        id: 'hyderabad',
        name: 'Hyderabad (GHMC)',
        ward: 'Khairatabad (Ward 95)',
        state: 'Telangana',
        stats: {
            sanctionedBudget: '₹18.40 Cr',
            completedWorks: '92%',
            activeGrievances: '142 Resolved this week',
            avgResolutionTime: '1.9 Days'
        },
        rep: {
            mla: 'Danam Nagender (Khairatabad AC)',
            corporator: 'P. Vijaya Reddy (Ward 95)',
            collector: 'Hyderabad District Collectorate',
            nodalOfficer: 'Zonal Commissioner, GHMC Central'
        },
        recentWorks: [
            { name: 'Nala Widening & Flood Mitigation Project', cost: '₹6.80 Cr', status: 'In Progress (90%)' },
            { name: 'Smart Footpaths & Junction Redesign', cost: '₹3.10 Cr', status: 'Completed' },
            { name: 'Basti Dawakhana Health Infrastructure Upgrade', cost: '₹85 Lakhs', status: 'Completed' }
        ]
    },
    {
        id: 'warangal',
        name: 'Warangal (GWMC)',
        ward: 'Hanamkonda (Ward 08)',
        state: 'Telangana',
        stats: {
            sanctionedBudget: '₹6.20 Cr',
            completedWorks: '81%',
            activeGrievances: '49 Resolved this week',
            avgResolutionTime: '3.1 Days'
        },
        rep: {
            mla: 'Naini Rajender Reddy (Warangal West)',
            corporator: 'M. Srilatha (Ward 08)',
            collector: 'Hanamkonda Collectorate',
            nodalOfficer: 'Commissioner, GWMC'
        },
        recentWorks: [
            { name: 'Drinking Water Pipeline Grid Integration', cost: '₹2.40 Cr', status: 'In Progress (65%)' },
            { name: 'Heritage Lake Restoration & Beautification', cost: '₹1.15 Cr', status: 'Sanctioned' },
            { name: 'Solid Waste Segregation Unit Installation', cost: '₹60 Lakhs', status: 'Completed' }
        ]
    }
];

const LetUsKnowLanding = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    // Interactive Demo State
    const [selectedPrompt, setSelectedPrompt] = useState(SIMULATED_PROMPTS[0]);
    const [isSimulatingTyping, setIsSimulatingTyping] = useState(false);
    const [customQuery, setCustomQuery] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState(DISTRICT_DATA[0]);
    const [activeDirectoryTab, setActiveDirectoryTab] = useState<'reps' | 'depts' | 'sops' | 'tourism'>('reps');
    const [activeFaq, setActiveFaq] = useState<number | null>(0);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePromptSelect = (prompt: typeof SIMULATED_PROMPTS[0]) => {
        setIsSimulatingTyping(true);
        setSelectedPrompt(prompt);
        setCustomQuery('');
        setTimeout(() => {
            setIsSimulatingTyping(false);
        }, 350);
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customQuery.trim()) return;

        setIsSimulatingTyping(true);
        const queryLower = customQuery.toLowerCase();
        let matched = SIMULATED_PROMPTS[0];

        if (queryLower.includes('road') || queryLower.includes('pothole') || queryLower.includes('light') || queryLower.includes('drain') || queryLower.includes('garbage')) {
            matched = {
                ...SIMULATED_PROMPTS[1],
                query: customQuery
            };
        } else if (queryLower.includes('land') || queryLower.includes('patta') || queryLower.includes('survey') || queryLower.includes('passbook') || queryLower.includes('document')) {
            matched = {
                ...SIMULATED_PROMPTS[2],
                query: customQuery
            };
        } else if (queryLower.includes('telugu') || queryLower.includes('scheme') || queryLower.includes('rythu') || queryLower.includes('pension')) {
            matched = {
                ...SIMULATED_PROMPTS[3],
                query: customQuery
            };
        } else {
            matched = {
                id: 'custom',
                title: 'Citizen Query Assistance',
                query: customQuery,
                category: 'Civic AI Assistant',
                badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
                response: {
                    title: `Verified Process for: "${customQuery.slice(0, 40)}..."`,
                    source: 'Verified against State Citizen Charter & MeeSeva Integrated Catalog',
                    steps: [
                        'Requirement analyzed and mapped to the appropriate nodal department.',
                        'Official documents needed: Aadhaar Card, Resident Proof, and Application Form.',
                        'Submission can be completed online via the State Portal or at any local MeeSeva center.',
                        'Estimated Service SLA: 3 to 5 business days with SMS tracking.'
                    ],
                    actionText: 'Initiate Official Application',
                    status: 'AI Verified'
                }
            };
        }

        setSelectedPrompt(matched);
        setTimeout(() => {
            setIsSimulatingTyping(false);
        }, 400);
    };

    const corePillars = [
        {
            icon: <MessageSquare className="w-8 h-8 text-cyan-400" />,
            title: t('letusknow_landing.features.chatbot.title', 'AI Civic Assistant'),
            desc: t('letusknow_landing.features.chatbot.desc', 'Ask complex queries like "How do I get an income certificate?" or "What are my land mutation steps?" and receive verified, step-by-step guidance instantly.'),
            tag: 'Official SOPs & Acts',
            glow: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10'
        },
        {
            icon: <MapPin className="w-8 h-8 text-rose-400" />,
            title: t('letusknow_landing.features.local.title', 'Hyperlocal Ward Focus'),
            desc: t('letusknow_landing.features.local.desc', 'Get information tailored down to your specific village, gram panchayat, or municipal ward with exact representative contacts and local development data.'),
            tag: 'Village & Ward Level',
            glow: 'hover:border-rose-500/50 hover:shadow-rose-500/10'
        },
        {
            icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
            title: t('letusknow_landing.features.report.title', 'Smart Grievance Redressal'),
            desc: t('letusknow_landing.features.report.desc', 'Voice or snap a photo of civic concerns (potholes, garbage, water leaks). AI auto-summarizes, tags GPS coordinates, and dispatches to the assigned public authority with SLA tracking.'),
            tag: 'Direct Department Dispatch',
            glow: 'hover:border-amber-500/50 hover:shadow-amber-500/10'
        },
        {
            icon: <FileText className="w-8 h-8 text-emerald-400" />,
            title: t('letusknow_landing.features.parser.title', 'AI Document & Gazette Parser'),
            desc: t('letusknow_landing.features.parser.desc', 'Upload complex government orders (GOs), land pattas, ROR-1B certificates, or court circulars. Gemini Vision extracts key facts and translates them into simple terms.'),
            tag: 'Multimodal Vision OCR',
            glow: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10'
        },
        {
            icon: <Mic className="w-8 h-8 text-purple-400" />,
            title: t('letusknow_landing.features.voice.title', 'Multi-Lingual Voice First'),
            desc: t('letusknow_landing.features.voice.desc', 'Built for true accessibility. Simply speak your issue in your mother tongue (Telugu, Hindi, Urdu, Marathi, Kannada, English) and our voice engine transcribes and processes it seamlessly.'),
            tag: '12+ Dialects Supported',
            glow: 'hover:border-purple-500/50 hover:shadow-purple-500/10'
        },
        {
            icon: <Coins className="w-8 h-8 text-blue-400" />,
            title: t('letusknow_landing.features.track.title', 'Public Works & Budget Audit'),
            desc: t('letusknow_landing.features.track.desc', 'Transparent tracking of sanctioned government funds, road works, drainage projects, contractor details, and real-time completion status in your neighbourhood.'),
            tag: 'Anti-Corruption Transparency',
            glow: 'hover:border-blue-500/50 hover:shadow-blue-500/10'
        }
    ];

    const workflowSteps = [
        {
            step: '01',
            title: 'Input in Any Format',
            desc: 'Speak in your native dialect, upload a photo of a broken street or document, or type a simple question.',
            icon: <Mic className="w-6 h-6 text-cyan-400" />
        },
        {
            step: '02',
            title: 'Gemini Multimodal Analysis',
            desc: 'Google Gemini 1.5 analyzes text, audio, and images to extract precise intent, GPS geolocation, and legal context.',
            icon: <Cpu className="w-6 h-6 text-purple-400" />
        },
        {
            step: '03',
            title: 'Official Cross-Verification',
            desc: 'Cross-referenced against official state gazettes, MeeSeva databases, CPGRAMS schemas, and municipal hierarchies.',
            icon: <BadgeCheck className="w-6 h-6 text-emerald-400" />
        },
        {
            step: '04',
            title: 'Actionable SLA Resolution',
            desc: 'Generates official petition tickets, notifies ward officers, and delivers real-time milestone updates to the citizen.',
            icon: <TrendingUp className="w-6 h-6 text-amber-400" />
        }
    ];

    const citizenPersonas = [
        {
            title: 'Farmers & Landowners',
            badge: 'Agriculture & Revenue',
            icon: <Palmtree className="w-6 h-6 text-emerald-400" />,
            benefits: [
                'Verify land survey numbers and patta passbooks instantly',
                'Check eligibility and disbursal status for Rythu Bharosa / PM-Kisan',
                'Real-time canal water release and agricultural power schedules'
            ]
        },
        {
            title: 'Urban Citizens & RWAs',
            badge: 'Municipal & Living',
            icon: <Building2 className="w-6 h-6 text-cyan-400" />,
            benefits: [
                'Instant photo-based reporting for potholes, garbage, and pipe bursts',
                'Track ward development budget and corporator expenditure',
                'Property tax calculator and trade license renewal steps'
            ]
        },
        {
            title: 'Students & Youth',
            badge: 'Education & Employment',
            icon: <BookOpen className="w-6 h-6 text-purple-400" />,
            benefits: [
                'Check government scholarship eligibility and application dates',
                'Step-by-step guides for caste, income, and residence certificates',
                'Notifications on TSPSC / State employment notifications'
            ]
        },
        {
            title: 'Seniors & Pensioners',
            badge: 'Social Welfare',
            icon: <Users className="w-6 h-6 text-rose-400" />,
            benefits: [
                'Aasara pension verification and life certificate submission guides',
                'Find nearby government hospitals and subsidized dialysis centers',
                'Doorstep service request options via voice assistance'
            ]
        }
    ];

    const directoryData = {
        reps: [
            { role: 'Member of Parliament (MP)', desc: 'Constituency level development projects (MPLADS fund) & policy representation', icon: <Landmark className="w-5 h-5 text-cyan-400" /> },
            { role: 'Member of Legislative Assembly (MLA)', desc: 'State assembly legislation, local road & water sanction funds (MLACDS)', icon: <Vote className="w-5 h-5 text-purple-400" /> },
            { role: 'Municipal Corporator / Councillor', desc: 'Ward level civic maintenance, sanitation, streetlights & local grievance hearings', icon: <Building2 className="w-5 h-5 text-emerald-400" /> },
            { role: 'Gram Panchayat Sarpanch & Secretary', desc: 'Village administration, drinking water supply, MGNREGA work allocation & local land records', icon: <Users className="w-5 h-5 text-amber-400" /> },
        ],
        depts: [
            { role: 'Revenue & Land Administration', desc: 'Patta passbooks, land mutation, caste/income certificates, and Tahsildar hearings', icon: <FileCheck2 className="w-5 h-5 text-emerald-400" /> },
            { role: 'Municipal Corporation / CDMA', desc: 'Building permissions, property tax, road maintenance, garbage disposal, and birth/death registry', icon: <Building2 className="w-5 h-5 text-cyan-400" /> },
            { role: 'Electricity DISCOMs (TSSPDCL / TSNPDCL)', desc: 'New meter connection, transformer repairs, billing discrepancies, and agriculture supply alerts', icon: <Cpu className="w-5 h-5 text-amber-400" /> },
            { role: 'Civil Supplies & Ration Dept', desc: 'Food security cards, ration dealer allotment, and monthly grain distribution status', icon: <Scale className="w-5 h-5 text-rose-400" /> },
        ],
        sops: [
            { role: 'Birth & Death Certificate (Form 201)', desc: 'Required: Hospital discharge slip & parents Aadhaar. SLA: 3 days. Fee: ₹35', icon: <FileText className="w-5 h-5 text-cyan-400" /> },
            { role: 'Integrated Caste & Income Certificate', desc: 'Required: Ration card, Aadhaar, Affidavit & previous caste certificates. SLA: 7 days.', icon: <BadgeCheck className="w-5 h-5 text-purple-400" /> },
            { role: 'Agriculture Land Title Mutation', desc: 'Required: Registered Sale Deed, Dharani Passbook, Pattadar consent. SLA: 15 days.', icon: <FileSearch className="w-5 h-5 text-emerald-400" /> },
            { role: 'Trade License & Signage Permission', desc: 'Required: Rental deed, property tax receipt, fire NOC if applicable. SLA: 7 days.', icon: <Building2 className="w-5 h-5 text-blue-400" /> },
        ],
        tourism: [
            { role: 'Historical Forts & Heritage Sites', desc: 'Nizamabad Fort, Golconda, Warangal Thousand Pillar Temple — timings & entry passes', icon: <Landmark className="w-5 h-5 text-amber-400" /> },
            { role: 'Eco-Tourism & Lake Sanctuaries', desc: 'Alisagar Deer Park, Ashok Sagar, Pakhal Lake — forest department ecotourism permits', icon: <Palmtree className="w-5 h-5 text-emerald-400" /> },
            { role: 'District Cultural & Handicrafts Hubs', desc: 'Armoor rock formations, Nirmal toys & paintings, Pembarthi metal craft locations', icon: <Compass className="w-5 h-5 text-purple-400" /> },
            { role: 'Pilgrimage & Temple Trust Portals', desc: 'Gnana Saraswathi Temple Basar, Yadagirigutta, Bhadrachalam — official sevas & darshan links', icon: <Building2 className="w-5 h-5 text-cyan-400" /> }
        ]
    };

    const faqs = [
        {
            q: 'Is Let Us Know affiliated with or endorsed by the government?',
            a: 'Let Us Know is an independent civic-tech platform developed by Siddhi Dynamics LLP. It utilizes publicly accessible, transparent government gazettes, citizen charters, and state open-data portals to verify procedures and guide citizens accurately.'
        },
        {
            q: 'How does the AI ensure the procedures and information are 100% verified?',
            a: 'Every response is grounded in official state legislation, Government Orders (G.O.s), and MeeSeva/CPGRAMS citizen service manuals. The AI explicitly provides the official legal reference, statutory timelines (SLAs), and official portal links with zero hallucination.'
        },
        {
            q: 'What languages and dialects are supported?',
            a: 'The platform is voice-first and supports 12+ Indian languages including Telugu, Hindi, Urdu, Marathi, Kannada, Tamil, and English. Citizens can speak naturally in their local rural dialects, and the system accurately transcribes and resolves their query.'
        },
        {
            q: 'How does grievance reporting work?',
            a: 'When you submit a civic issue (photo or voice note of a pothole, broken pipe, etc.), our AI extracts geo-coordinates, categorizes the department responsible, and formats an official petition with an assigned SLA. You receive an SMS/WhatsApp tracking ticket.'
        },
        {
            q: 'How is citizen privacy and personal data protected?',
            a: 'We adhere to strict zero-data-selling principles. All citizen submissions, documents, and identity proofs are end-to-end encrypted and used strictly for filing grievance petitions or procedure verification with explicit consent.'
        }
    ];

    return (
        <div className="min-h-screen font-sans bg-slate-950 text-foreground selection:bg-cyan-900 selection:text-cyan-100 overflow-x-hidden">
            <Helmet>
                <title>Let Us Know | AI-Powered Hyperlocal Civic Intelligence Platform</title>
                <meta name="description" content="An all-in-one AI platform that makes official government procedures, public budgets, citizen grievances, and land records transparent and actionable for every village and ward." />
            </Helmet>
            <Navbar />

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 origin-left z-50 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                style={{ scaleX }}
            />

            <main className="pt-24 sm:pt-28">
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pb-20">
                    {/* Glowing Ambient Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-950/80 to-slate-950 z-0 pointer-events-none" />
                    <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
                    <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

                    <div className="container mx-auto px-4 sm:px-6 relative z-10">
                        {/* Top Back Navigation */}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group mb-8 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>{t('letusknow_landing.hero.back', 'Back to Home')}</span>
                        </motion.button>

                        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                            {/* Left Column: Hero Copy & Value Proposition */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="lg:col-span-6 text-left"
                            >
                                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                                    </span>
                                    <Sparkles className="w-4 h-4 text-cyan-400" />
                                    AI For Civic Governance & Citizen Empowerment
                                </div>

                                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 font-display">
                                    Hyperlocal <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                                        Civic Intelligence
                                    </span>
                                </h1>

                                <p className="text-xl sm:text-2xl text-cyan-100/90 font-medium mb-4">
                                    Democratizing Official Governance for Every Citizen & Village.
                                </p>

                                <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
                                    {t(
                                        'letusknow_landing.hero.desc',
                                        'An all-in-one AI platform that makes official government information transparent, accessible, and actionable. Tailored down to your specific village or municipal ward, driven by Google Gemini AI.'
                                    )}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 mb-10">
                                    <button
                                        onClick={() => setIsWaitlistOpen(true)}
                                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-base sm:text-lg rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                                    >
                                        <MapPin className="w-5 h-5" />
                                        {t('letusknow_landing.hero.cta', 'Join Early Access Waitlist')}
                                    </button>

                                    <a
                                        href="#live-demo"
                                        className="px-7 py-4 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-base sm:text-lg rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="w-5 h-5 text-cyan-400" />
                                        Test Live Simulator
                                    </a>
                                </div>

                                {/* Trust Highlights */}
                                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 text-left">
                                    <div>
                                        <div className="text-xl sm:text-2xl font-bold text-cyan-400">100%</div>
                                        <div className="text-xs text-slate-400 font-medium">Verifiable Sources</div>
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-bold text-emerald-400">12+</div>
                                        <div className="text-xs text-slate-400 font-medium">Indian Dialects</div>
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-bold text-teal-400">&lt; 48h</div>
                                        <div className="text-xs text-slate-400 font-medium">Avg Redressal SLA</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Column: Interactive Live Civic AI Simulator */}
                            <motion.div
                                id="live-demo"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="lg:col-span-6 relative"
                            >
                                <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
                                    {/* Card Header with Status */}
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-600/30">
                                                <Landmark className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-base flex items-center gap-2">
                                                    Civic AI Copilot
                                                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                                                        Gemini 1.5 Pro
                                                    </span>
                                                </div>
                                                <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                    MeeSeva &amp; CPGRAMS Live Sync
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handlePromptSelect(SIMULATED_PROMPTS[0])}
                                            title="Reset Simulation"
                                            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Prompt Scenario Pills */}
                                    <div className="mb-4">
                                        <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                                            Select Demo Scenario:
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {SIMULATED_PROMPTS.map((p) => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => handlePromptSelect(p)}
                                                    className={`p-2 rounded-xl text-left text-xs font-medium transition-all border ${selectedPrompt.id === p.id
                                                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                                                        : 'bg-slate-800/60 border-slate-750 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <div className="truncate font-semibold">{p.title}</div>
                                                    <div className="text-[10px] text-slate-400 truncate">{p.category}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Simulated Chat Interface */}
                                    <div className="space-y-3 mb-5 min-h-[220px]">
                                        {/* User message */}
                                        <div className="flex justify-end">
                                            <div className="bg-cyan-950/60 border border-cyan-700/50 rounded-2xl rounded-tr-none px-4 py-3 text-cyan-100 text-xs sm:text-sm max-w-[85%] shadow-md">
                                                <p className="font-medium">{selectedPrompt.query}</p>
                                            </div>
                                        </div>

                                        {/* AI Response Card */}
                                        <div className="flex justify-start">
                                            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl rounded-tl-none p-4 text-slate-200 text-xs sm:text-sm w-full max-w-[95%] shadow-md">
                                                <AnimatePresence mode="wait">
                                                    {isSimulatingTyping ? (
                                                        <motion.div
                                                            key="typing"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex items-center gap-2 text-cyan-400 py-3"
                                                        >
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                            <span className="text-xs">Analyzing official gazette and routing ticket...</span>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="content"
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-700">
                                                                <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                                                                    <BadgeCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                                                                    {selectedPrompt.response.title}
                                                                </div>
                                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 shrink-0">
                                                                    {selectedPrompt.response.status}
                                                                </span>
                                                            </div>

                                                            <p className="text-[11px] text-slate-400 mb-2 italic">
                                                                {selectedPrompt.response.source}
                                                            </p>

                                                            <ul className="space-y-1.5 text-xs text-slate-300">
                                                                {selectedPrompt.response.steps.map((step, idx) => (
                                                                    <li key={idx} className="flex items-start gap-2">
                                                                        <span className="w-4 h-4 rounded-full bg-cyan-900/60 text-cyan-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                                                                            {idx + 1}
                                                                        </span>
                                                                        <span>{step}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>

                                                            <div className="mt-3 pt-2.5 border-t border-slate-700 flex items-center justify-between">
                                                                <button
                                                                    onClick={() => setIsWaitlistOpen(true)}
                                                                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
                                                                >
                                                                    <span>{selectedPrompt.response.actionText}</span>
                                                                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                                </button>
                                                                <span className="text-[10px] text-slate-500">
                                                                    Ref ID: TG-{Math.floor(1000 + Math.random() * 9000)}
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Query Input Form */}
                                    <form onSubmit={handleCustomSubmit} className="relative">
                                        <input
                                            type="text"
                                            value={customQuery}
                                            onChange={(e) => setCustomQuery(e.target.value)}
                                            placeholder="Ask anything (e.g. 'How to get caste certificate', 'Pothole on Main Rd')..."
                                            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl py-3.5 pl-4 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 rounded-lg font-bold hover:brightness-110 transition-all shadow-md"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>

                                {/* Background Glow */}
                                <div className="absolute -top-10 -right-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -z-10" />
                                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -z-10" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Hyperlocal District & Ward Explorer */}
                <section className="py-20 bg-slate-900/40 border-y border-slate-800 relative">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-3xl mx-auto mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                                <MapPin className="w-3.5 h-3.5" />
                                Hyperlocal Ward Data Engine
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                                Localized Governance Down to Your Ward
                            </h2>
                            <p className="text-slate-400 text-base sm:text-lg">
                                Switch between simulated regions to explore real-time municipal works, elected representative accountability, and resolution metrics.
                            </p>
                        </div>

                        {/* District Selector Tabs */}
                        <div className="flex flex-wrap justify-center gap-3 mb-10">
                            {DISTRICT_DATA.map((dist) => (
                                <button
                                    key={dist.id}
                                    onClick={() => setSelectedDistrict(dist)}
                                    className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2.5 border ${selectedDistrict.id === dist.id
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                        }`}
                                >
                                    <Landmark className={`w-4 h-4 ${selectedDistrict.id === dist.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                                    <span>{dist.name}</span>
                                    <span className="text-xs text-slate-500 font-normal">({dist.ward})</span>
                                </button>
                            ))}
                        </div>

                        {/* District Dashboard Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl max-w-5xl mx-auto">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-2xl sm:text-3xl font-bold text-white">
                                            {selectedDistrict.name} Municipal Portal
                                        </h3>
                                        <span className="px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
                                            Active Ward: {selectedDistrict.ward}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        Administered under {selectedDistrict.state} Municipal &amp; Panchayat Raj Administration
                                    </p>
                                </div>

                                <button
                                    onClick={() => setIsWaitlistOpen(true)}
                                    className="px-5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 text-sm font-semibold transition-colors flex items-center justify-center gap-2 self-start lg:self-auto"
                                >
                                    <span>Request Data for Your Area</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                                    <div className="text-xs text-slate-400 font-medium mb-1">Sanctioned Budget</div>
                                    <div className="text-xl sm:text-2xl font-bold text-cyan-400">{selectedDistrict.stats.sanctionedBudget}</div>
                                    <div className="text-[11px] text-slate-500 mt-1">FY 2025-26 Local Fund</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                                    <div className="text-xs text-slate-400 font-medium mb-1">Works Completed</div>
                                    <div className="text-xl sm:text-2xl font-bold text-emerald-400">{selectedDistrict.stats.completedWorks}</div>
                                    <div className="text-[11px] text-slate-500 mt-1">Audit Verified</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                                    <div className="text-xs text-slate-400 font-medium mb-1">Grievances Solved</div>
                                    <div className="text-xl sm:text-2xl font-bold text-teal-400">{selectedDistrict.stats.activeGrievances}</div>
                                    <div className="text-[11px] text-slate-500 mt-1">Direct Redressal</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                                    <div className="text-xs text-slate-400 font-medium mb-1">Average SLA</div>
                                    <div className="text-xl sm:text-2xl font-bold text-purple-400">{selectedDistrict.stats.avgResolutionTime}</div>
                                    <div className="text-[11px] text-slate-500 mt-1">Faster than state avg</div>
                                </div>
                            </div>

                            {/* Representatives & Sanctioned Works Grid */}
                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                                {/* Local Representatives */}
                                <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-cyan-400" />
                                        Assigned Ward Authorities
                                    </h4>
                                    <div className="space-y-3 text-xs">
                                        <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                                            <div>
                                                <div className="text-slate-400 font-medium">Elected MLA</div>
                                                <div className="text-white font-bold">{selectedDistrict.rep.mla}</div>
                                            </div>
                                            <span className="text-[10px] px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg font-semibold">Legislative</span>
                                        </div>
                                        <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                                            <div>
                                                <div className="text-slate-400 font-medium">Ward Corporator</div>
                                                <div className="text-white font-bold">{selectedDistrict.rep.corporator}</div>
                                            </div>
                                            <span className="text-[10px] px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg font-semibold">Local Body</span>
                                        </div>
                                        <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                                            <div>
                                                <div className="text-slate-400 font-medium">Administrative Nodal Officer</div>
                                                <div className="text-white font-bold">{selectedDistrict.rep.nodalOfficer}</div>
                                            </div>
                                            <span className="text-[10px] px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg font-semibold">Grievance SLA</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Sanctioned Works */}
                                <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <FileCheck2 className="w-4 h-4 text-emerald-400" />
                                        Active Public Works Tracker
                                    </h4>
                                    <div className="space-y-3 text-xs">
                                        {selectedDistrict.recentWorks.map((work, idx) => (
                                            <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                                                <div>
                                                    <div className="text-white font-semibold">{work.name}</div>
                                                    <div className="text-slate-400 text-[11px]">Sanction Amount: <span className="text-cyan-400 font-medium">{work.cost}</span></div>
                                                </div>
                                                <span className={`text-[10px] px-2 py-1 rounded-lg font-semibold whitespace-nowrap ${work.status.includes('Completed')
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    }`}>
                                                    {work.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6 Core Pillars of Civic Intelligence */}
                <section className="py-24 bg-slate-950 relative">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
                                Comprehensive Feature Ecosystem
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-display text-white">
                                {t('letusknow_landing.features.title', 'Empowering Citizens with Intelligent Governance')}
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 mx-auto rounded-full mt-4" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {corePillars.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-md transition-all duration-300 group hover:-translate-y-1.5 ${feature.glow}`}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center border border-slate-700/60 shadow-lg group-hover:scale-110 transition-transform">
                                            {feature.icon}
                                        </div>
                                        <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold">
                                            {feature.tag}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Interactive Workflow: How Let Us Know Works */}
                <section className="py-24 bg-slate-900/30 border-t border-slate-800 relative">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
                                Seamless Architecture
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                                How Let Us Know Works
                            </h2>
                            <p className="text-slate-400 text-base sm:text-lg">
                                From citizen voice input to official nodal department resolution in 4 intelligent stages.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {workflowSteps.map((ws, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 relative group hover:border-cyan-500/40 transition-colors"
                                >
                                    <div className="text-4xl font-extrabold text-slate-800 group-hover:text-cyan-500/30 transition-colors mb-4 font-display">
                                        {ws.step}
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 border border-slate-700">
                                        {ws.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{ws.title}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">{ws.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Citizen Personas & Use Cases */}
                <section className="py-24 bg-slate-950 relative">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
                                For Every Demographic
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                                Designed for Citizens Across Every Walk of Life
                            </h2>
                            <p className="text-slate-400 text-base sm:text-lg">
                                Whether you're a farmer checking land records or an RWA managing ward infrastructure, Let Us Know adapts to your needs.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                            {citizenPersonas.map((persona, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg"
                                >
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700">
                                                {persona.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-white">{persona.title}</h3>
                                        </div>
                                        <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300 font-semibold">
                                            {persona.badge}
                                        </span>
                                    </div>
                                    <ul className="space-y-2.5">
                                        {persona.benefits.map((b, idx) => (
                                            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Essential Directories & Public Guides */}
                <section className="py-20 border-t border-slate-800 bg-slate-900/50">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                                <div>
                                    <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                                        Official Contact Catalog
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-white">
                                        {t('letusknow_landing.directories.title', 'Essential Civic Directories & SOP Guides')}
                                    </h3>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Instant access to verified government authorities, departments, and service procedures.
                                    </p>
                                </div>

                                {/* Directory Category Switcher */}
                                <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
                                    <button
                                        onClick={() => setActiveDirectoryTab('reps')}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeDirectoryTab === 'reps'
                                            ? 'bg-cyan-500 text-slate-950 shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {t('letusknow_landing.directories.reps', 'Representatives')}
                                    </button>
                                    <button
                                        onClick={() => setActiveDirectoryTab('depts')}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeDirectoryTab === 'depts'
                                            ? 'bg-cyan-500 text-slate-950 shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {t('letusknow_landing.directories.depts', 'Departments')}
                                    </button>
                                    <button
                                        onClick={() => setActiveDirectoryTab('sops')}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeDirectoryTab === 'sops'
                                            ? 'bg-cyan-500 text-slate-950 shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {t('letusknow_landing.directories.guides', 'Service SOPs')}
                                    </button>
                                    <button
                                        onClick={() => setActiveDirectoryTab('tourism')}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeDirectoryTab === 'tourism'
                                            ? 'bg-cyan-500 text-slate-950 shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {t('letusknow_landing.directories.tourism', 'Heritage & Tourism')}
                                    </button>
                                </div>
                            </div>

                            {/* Directory Item Grid */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                {directoryData[activeDirectoryTab].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 shrink-0 group-hover:scale-105 transition-transform">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                                                    {item.role}
                                                </h4>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Privacy, Security & Democratic Integrity */}
                <section className="py-20 bg-slate-950 border-t border-slate-800 relative">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-emerald-950/30 border border-cyan-500/20 max-w-5xl mx-auto">
                            <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Zero-Data Selling</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Your identity and civic grievances are end-to-end encrypted. We never sell citizen data to advertisers or third parties.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                                        <BadgeCheck className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Verifiable Source Citations</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Every answer provides direct references to official State Acts, Gazettes, Government Orders, and MeeSeva service circulars.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                                        <Scale className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Non-Partisan &amp; Fair</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Independent civic-tech designed strictly to bridge communication between citizens and official governance institutions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Frequently Asked Questions (FAQ) */}
                <section className="py-24 bg-slate-950">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
                                Questions &amp; Answers
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-slate-400 text-base">
                                Everything you need to know about the Let Us Know civic platform.
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-4">
                            {faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
                                >
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base hover:text-cyan-300 transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronRight
                                            className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${activeFaq === i ? 'rotate-90 text-cyan-400' : ''
                                                }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {activeFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="px-5 pb-6 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-4"
                                            >
                                                {faq.a}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final High-Energy CTA */}
                <section className="py-24 sm:py-32 text-center bg-slate-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/30 via-slate-950 to-slate-950 z-0 pointer-events-none" />

                    <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            Next-Generation Democratic Technology
                        </div>

                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight font-display">
                            Your Personal AI Guide to Local Governance.
                        </h2>

                        <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of citizens, ward leaders, and community volunteers pioneering transparent, accountable, and accessible local democracy.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setIsWaitlistOpen(true)}
                                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 text-slate-950 font-extrabold text-lg sm:text-xl rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:scale-105 transition-all transform active:scale-95"
                            >
                                Get Early Access Now
                            </button>

                            <button
                                onClick={() => navigate('/submit-problem')}
                                className="w-full sm:w-auto px-8 py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2"
                            >
                                <AlertTriangle className="w-5 h-5 text-amber-400" />
                                Submit Civic Problem
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <FooterSection />

            {/* Waitlist Modal */}
            <WaitlistModal
                isOpen={isWaitlistOpen}
                onClose={() => setIsWaitlistOpen(false)}
                projectId="letusknow"
                projectName="Let Us Know (Civic AI)"
                accentColor="accent"
            />
        </div>
    );
};

export default LetUsKnowLanding;

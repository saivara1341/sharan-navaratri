import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { 
    Search, 
    Globe, 
    Bot, 
    MapPin, 
    TrendingUp, 
    CheckCircle, 
    Clock, 
    Calendar, 
    ShieldCheck, 
    RefreshCw, 
    MessageCircle, 
    Send, 
    Sparkles, 
    DollarSign, 
    CreditCard, 
    QrCode, 
    Download, 
    Building2, 
    Layers, 
    BarChart3, 
    FileText, 
    Users, 
    ExternalLink, 
    Copy, 
    Check, 
    LogOut,
    Sliders,
    Zap,
    AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

interface ClientBrand {
    id: string;
    name: string;
    industry: string;
    website: string;
    geoScore: number;
    seoScore: number;
    gbpScore: number;
    status: 'Active' | 'Optimizing' | 'Review';
    keywordsTracked: number;
    localRank: string;
}

export default function VMagneticMindsPortal() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string>("23eg510a07@anurag.edu.in");
    const [activeTab, setActiveTab] = useState<'overview' | 'seo-geo' | 'analytics' | 'clients' | 'billing' | 'chat'>('overview');
    
    // SLA & Plan state
    const [planDurationMonths] = useState(12);
    const [currentMonthIndex] = useState(1);
    const [planStartDate] = useState("2026-08-01");
    const [planEndDate] = useState("2027-08-01");

    // Copy helper
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(label);
        toast.success(`${label} copied!`);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    // Brands under V Magnetic Minds umbrella
    const [clientBrands, setClientBrands] = useState<ClientBrand[]>([
        { id: "cb-1", name: "Zenith Fitness Studio", industry: "Health & Wellness", website: "zenithfit.in", geoScore: 92, seoScore: 88, gbpScore: 96, status: "Active", keywordsTracked: 24, localRank: "#1 Local Map Pack" },
        { id: "cb-2", name: "Urban Luxe Apparel", industry: "E-Commerce / Fashion", website: "urbanluxe.co.in", geoScore: 89, seoScore: 91, gbpScore: 85, status: "Optimizing", keywordsTracked: 38, localRank: "#3 Local Search" },
        { id: "cb-3", name: "Nizamabad Spice Kitchen", industry: "Hospitality & Dining", website: "spicekitchennzb.in", geoScore: 95, seoScore: 84, gbpScore: 98, status: "Active", keywordsTracked: 19, localRank: "#1 GMB Nizamabad" },
        { id: "cb-4", name: "VMM Media Reel Hub", industry: "Digital Media / Content", website: "vmagneticminds.com", geoScore: 96, seoScore: 94, gbpScore: 92, status: "Active", keywordsTracked: 45, localRank: "#1 Digital Agency" }
    ]);
    const [selectedBrandId, setSelectedBrandId] = useState<string>("cb-4");

    const selectedBrand = clientBrands.find(b => b.id === selectedBrandId) || clientBrands[0];

    // Analytics Data (Month to Month)
    const analyticsMonths = [
        { month: "Aug 2026", impressions: "14,200", clicks: "1,850", ctr: "13.0%", conversions: "142", aiCitations: "28" },
        { month: "Sep 2026 (Est)", impressions: "21,500", clicks: "2,940", ctr: "13.6%", conversions: "210", aiCitations: "45" },
        { month: "Oct 2026 (Est)", impressions: "29,800", clicks: "4,120", ctr: "13.8%", conversions: "320", aiCitations: "68" }
    ];

    // Billing & UPI details
    const upiId = "6303602743@upi";
    const payeesName = "Siddhi Dynamics LLP";
    const upiName = "Siddhi Dynamics";

    // Monthly Plan Amount (admin-assigned, read-only for client)
    const monthlyFee = "₹25,000 / month";
    const total12MonthSla = "₹3,00,000";

    const [invoices] = useState([
        { id: "INV-VMM-001", month: "Month 1 (Aug 2026)", amount: "₹25,000", rawAmount: "25000", status: "Paid",    date: "2026-08-01", desc: "12-Month SLA Onboarding: SEO, GEO, AEO & GBP Setup" },
        { id: "INV-VMM-002", month: "Month 2 (Sep 2026)", amount: "₹25,000", rawAmount: "25000", status: "Pending",  date: "2026-09-01", desc: "Month 2 SEO/GEO Optimization & GA Monthly Report" },
        { id: "INV-VMM-003", month: "Month 3 (Oct 2026)", amount: "₹25,000", rawAmount: "25000", status: "Upcoming", date: "2026-10-01", desc: "Month 3 AI Search Citation Expansion & GBP Posts" }
    ]);

    // Payment proof form – amounts are admin-set and READ-ONLY for client
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);
    const [txnHash, setTxnHash] = useState("");
    const [submittingProof, setSubmittingProof] = useState(false);

    const openPayModal = (inv: typeof invoices[0]) => {
        setSelectedInvoice(inv);
        setTxnHash("");
        setPayModalOpen(true);
    };

    // Build a UPI deep-link (UPI Intent URI)
    const buildUpiLink = (app: string) => {
        const amt = selectedInvoice?.rawAmount || "25000";
        const base = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amt}&cu=INR&tn=${encodeURIComponent(selectedInvoice?.id || 'SLA Payment')}`;
        const schemes: Record<string, string> = {
            gpay:    `tez://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amt}&cu=INR`,
            phonepe: `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amt}&cu=INR`,
            paytm:   `paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amt}&cu=INR`,
            bhim:    `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amt}&cu=INR`,
            cred:    `credpay://pay?pa=${encodeURIComponent(upiId)}&am=${amt}`,
        };
        return schemes[app] || base;
    };

    const handleSubmitPaymentProof = (e: React.FormEvent) => {
        e.preventDefault();
        if (!txnHash.trim() || txnHash.trim().length < 8) {
            toast.error("Please enter a valid UPI UTR / Transaction Reference ID (min 8 digits).");
            return;
        }
        setSubmittingProof(true);
        setTimeout(() => {
            setSubmittingProof(false);
            setPayModalOpen(false);
            setTxnHash("");
            setSelectedInvoice(null);
            toast.success(`Payment proof for ${selectedInvoice?.id} submitted! saivaraprasad will verify within 2 hours.`);
        }, 1200);
    };

    // Chat with AI assistant
    const [chatMessages, setChatMessages] = useState<any[]>([
        { sender: "Siddhi AI", text: "Welcome V Magnetic Minds! I am your dedicated AI coordinator. How can I assist with your 12-month SEO, GEO, AEO, GBP optimizations or billing today?", time: "Just now", isAdmin: true }
    ]);
    const [chatInput, setChatInput] = useState("");

    const sendChatMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const msg = chatInput.trim();
        setChatInput("");
        setChatMessages(prev => [...prev, { sender: "V Magnetic Minds", text: msg, time: "Just now", isAdmin: false }]);

        setTimeout(() => {
            let aiReply = "Thank you for reaching out! I've logged your request regarding V Magnetic Minds SEO/GEO metrics. Our lead saivaraprasad will review your query.";
            if (msg.toLowerCase().includes("payment") || msg.toLowerCase().includes("upi") || msg.toLowerCase().includes("invoice")) {
                aiReply = "You can settle any monthly subscription invoice using our UPI ID: 6303602743@upi or by scanning the UPI QR code in the Billing tab. Tap any app icon (GPay, PhonePe, Paytm, BHIM) to open the payment directly. Once paid, submit your UTR number for instant status sync!";
            } else if (msg.toLowerCase().includes("seo") || msg.toLowerCase().includes("geo") || msg.toLowerCase().includes("gbp")) {
                aiReply = "Your GEO (Generative Engine Optimization) score is currently 94/100, and Google Business Profile score is 96/100 across client listings. Full monthly reports are available in the Analytics tab!";
            }
            setChatMessages(prev => [...prev, { sender: "Siddhi AI", text: aiReply, time: "Just now", isAdmin: true }]);
        }, 1000);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUserEmail(session.user.email || "23eg510a07@anurag.edu.in");
            }
            setLoading(false);
        });
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.info("Logged out of V Magnetic Minds Portal.");
        navigate("/portal");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05070B] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
            <Helmet>
                <title>V Magnetic Minds Portal | Siddhi Dynamics</title>
                <meta name="description" content="Executive Agency Command Center for V Magnetic Minds - SEO, GEO, AEO, GBP & 12-Month SLA Management." />
            </Helmet>

            <Navbar />

            {/* Top Partner Banner */}
            <div className="pt-24 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/40 via-cyan-900/30 to-slate-900 border border-cyan-500/30 p-6 md:p-8 backdrop-blur-xl shadow-2xl"
                >
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-start md:items-center gap-5">
                            {/* M² The Magnetic Minds Official Logo */}
                            <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-700 shrink-0">
                                <img 
                                    src="/v-magnetic-minds-logo.jpg" 
                                    alt="The Magnetic Minds Logo" 
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg"
                                />
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/40 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5" /> Media Agency Partner
                                    </span>
                                    <span className="px-3 py-1 text-xs font-semibold bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/40 flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Authorized: {userEmail}
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                                    The Magnetic Minds (M²)
                                    <span className="text-sm font-normal text-slate-400 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                                        Digital Media & Social Growth
                                    </span>
                                </h1>
                                <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-3xl">
                                    Dedicated Executive Command Center for 12-Month SLA: Search Engine Optimization (SEO), Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), Google Business Profile (GBP) & Google Analytics Reporting.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                            <button
                                onClick={() => setPayModalOpen(true)}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                            >
                                <QrCode className="w-4 h-4" /> Pay via UPI / QR
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                            >
                                <LogOut className="w-4 h-4" /> Exit
                            </button>
                        </div>
                    </div>

                    {/* SLA Contract Timeline Progress */}
                    <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Plan Duration
                            </div>
                            <div className="text-lg font-bold text-white">12-Month SLA</div>
                            <div className="text-[11px] text-cyan-400 mt-0.5">Aug 2026 – Aug 2027</div>
                        </div>

                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                                <Clock className="w-3.5 h-3.5 text-purple-400" /> Active Progress
                            </div>
                            <div className="text-lg font-bold text-white">Month {currentMonthIndex} of 12</div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full" style={{ width: `${(currentMonthIndex / planDurationMonths) * 100}%` }} />
                            </div>
                        </div>

                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SLA Services
                            </div>
                            <div className="text-lg font-bold text-emerald-400">SEO + GEO + AEO + GBP</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Continuous Monitoring</div>
                        </div>

                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                                <DollarSign className="w-3.5 h-3.5 text-yellow-400" /> Billing Status
                            </div>
                            <div className="text-lg font-bold text-white">Month 1 Paid</div>
                            <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">Up to date</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                            activeTab === 'overview' 
                                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
                        }`}
                    >
                        <Layers className="w-4 h-4" /> 12-Month Executive SLA
                    </button>

                    <button
                        onClick={() => setActiveTab('seo-geo')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                            activeTab === 'seo-geo' 
                                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
                        }`}
                    >
                        <Bot className="w-4 h-4 text-purple-400" /> SEO / GEO / AEO & GBP Hub
                    </button>

                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                            activeTab === 'analytics' 
                                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
                        }`}
                    >
                        <BarChart3 className="w-4 h-4 text-emerald-400" /> GA Monthly Reports
                    </button>

                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                            activeTab === 'clients' 
                                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
                        }`}
                    >
                        <Users className="w-4 h-4 text-blue-400" /> Client Portfolio ({clientBrands.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                            activeTab === 'billing' 
                                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
                        }`}
                    >
                        <CreditCard className="w-4 h-4 text-yellow-400" /> UPI Payments & Invoices
                    </button>

                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                            activeTab === 'chat' 
                                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
                        }`}
                    >
                        <MessageCircle className="w-4 h-4 text-cyan-400" /> AI Support Coordinator
                    </button>
                </div>
            </div>

            {/* TAB CONTENT AREA */}
            <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
                <AnimatePresence mode="wait">
                    {/* TAB 1: EXECUTIVE SLA OVERVIEW */}
                    {activeTab === 'overview' && (
                        <motion.div 
                            key="overview"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-8"
                        >
                            {/* Performance Metric Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition-all group">
                                    <div className="flex items-center justify-between text-slate-400 mb-2">
                                        <span className="text-xs uppercase tracking-wider font-semibold">GEO Readiness Index</span>
                                        <Bot className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="text-3xl font-extrabold text-white">94<span className="text-lg text-purple-400">/100</span></div>
                                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5" /> High AI search visibility on ChatGPT & Gemini
                                    </p>
                                </div>

                                <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition-all group">
                                    <div className="flex items-center justify-between text-slate-400 mb-2">
                                        <span className="text-xs uppercase tracking-wider font-semibold">SEO Organic Health</span>
                                        <Search className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="text-3xl font-extrabold text-white">91<span className="text-lg text-cyan-400">/100</span></div>
                                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5" /> 126+ tracked keywords in Top 10
                                    </p>
                                </div>

                                <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition-all group">
                                    <div className="flex items-center justify-between text-slate-400 mb-2">
                                        <span className="text-xs uppercase tracking-wider font-semibold">GBP Local Map Pack</span>
                                        <MapPin className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="text-3xl font-extrabold text-white">96<span className="text-lg text-rose-400">/100</span></div>
                                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5" /> Top 3 GMB Pack placement active
                                    </p>
                                </div>

                                <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition-all group">
                                    <div className="flex items-center justify-between text-slate-400 mb-2">
                                        <span className="text-xs uppercase tracking-wider font-semibold">AEO Answer Snippets</span>
                                        <Sparkles className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="text-3xl font-extrabold text-white">88<span className="text-lg text-amber-400">/100</span></div>
                                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5" /> FAQ schema & Voice Search ready
                                    </p>
                                </div>
                            </div>

                            {/* 12-Month Service Execution Plan */}
                            <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-cyan-400" /> 12-Month Optimization SLA Roadmap
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Structured 12-month deliverables executed by Siddhi Dynamics for V Magnetic Minds and client brands.
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                                        Active Contract SLA
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full pointer-events-none" />
                                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Phase 1: Months 1 – 4</span>
                                        <h4 className="text-base font-bold text-white mt-1">Foundation & GEO/GBP Setup</h4>
                                        <ul className="mt-3 space-y-2 text-xs text-slate-300">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>Audit & Setup Google Business Profile (GBP) for all client brands.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>Deploy Generative Engine (GEO) llms.txt & robots.txt rules.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>AEO FAQ & Knowledge Graph schema implementation.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full pointer-events-none" />
                                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Phase 2: Months 5 – 8</span>
                                        <h4 className="text-base font-bold text-white mt-1">AI Citation & Content Velocity</h4>
                                        <ul className="mt-3 space-y-2 text-xs text-slate-300">
                                            <li className="flex items-start gap-2">
                                                <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                                                <span>ChatGPT, Claude & Perplexity AI citation indexing.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                                                <span>Monthly reels SEO metadata optimization for VMM content.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                                                <span>High-DA backlink building & digital PR distribution.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Phase 3: Months 9 – 12</span>
                                        <h4 className="text-base font-bold text-white mt-1">Dominance & Conversion Engine</h4>
                                        <ul className="mt-3 space-y-2 text-xs text-slate-300">
                                            <li className="flex items-start gap-2">
                                                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                                <span>Local GMB #1 rank defense & review velocity automation.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                                <span>Month-to-month Google Analytics annual reporting suite.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                                <span>12-Month SLA renewal & performance scaling review.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 2: SEO, GEO, AEO & GBP HUB */}
                    {activeTab === 'seo-geo' && (
                        <motion.div 
                            key="seo-geo"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-8"
                        >
                            {/* Core Pillars */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pillar 1: GEO (Generative Engine Optimization) */}
                                <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Bot className="w-5 h-5 text-purple-400" /> GEO (Generative Engine Optimization)
                                        </h3>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300">
                                            AI Search Ready
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 mb-4">
                                        Optimizes V Magnetic Minds and client content so AI search engines (ChatGPT Search, Perplexity AI, Claude 3.5, Google Gemini) cite and recommend your services as authoritative answers.
                                    </p>

                                    <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">ChatGPT Search Citation Score:</span>
                                            <span className="font-bold text-purple-300">96 / 100</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Perplexity AI Indexing:</span>
                                            <span className="font-bold text-emerald-400">Verified & Cited</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">LLM System Context (llms.txt):</span>
                                            <span className="font-bold text-cyan-400">Deployed & Active</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pillar 2: GBP (Google Business Profile Optimization) */}
                                <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 hover:border-rose-500/40 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-rose-400" /> Google Business Profile (GBP / GMB)
                                        </h3>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300">
                                            Local Map Pack #1
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 mb-4">
                                        Maximizes local search visibility on Google Maps and Local Pack listings for V Magnetic Minds media agency and client physical locations.
                                    </p>

                                    <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Local Map Pack Rank:</span>
                                            <span className="font-bold text-rose-400">#1 Spot in Region</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Customer Review Score:</span>
                                            <span className="font-bold text-yellow-400">4.9 ★ (120+ Reviews)</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Reels & Media GMB Posts:</span>
                                            <span className="font-bold text-emerald-400">Weekly Auto-Sync</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pillar 3: SEO (Search Engine Optimization) */}
                                <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Search className="w-5 h-5 text-cyan-400" /> Traditional Google SEO
                                        </h3>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300">
                                            Organic Growth
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 mb-4">
                                        Technical on-page, speed optimization, high-DA backlinks, and targeted keyword domination across search engine result pages (SERPs).
                                    </p>

                                    <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Tracked Keywords in Top 10:</span>
                                            <span className="font-bold text-cyan-400">126 Keywords</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Domain Authority (DA):</span>
                                            <span className="font-bold text-white">42 / 100</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Active High-DA Backlinks:</span>
                                            <span className="font-bold text-emerald-400">180+ DoFollow Links</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pillar 4: AEO (Answer Engine Optimization) */}
                                <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-amber-400" /> AEO (Answer Engine Optimization)
                                        </h3>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300">
                                            Featured Snippets
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 mb-4">
                                        Structures question-and-answer content into JSON-LD FAQ schemas to capture Position 0 Google Featured Snippets and Siri/Alexa Voice Search.
                                    </p>

                                    <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Google Position 0 Snippets:</span>
                                            <span className="font-bold text-amber-400">18 Snippets Captured</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Voice Search Readiness:</span>
                                            <span className="font-bold text-emerald-400">100% Schema Valid</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Entity Relation Graph:</span>
                                            <span className="font-bold text-cyan-400">Verified Organization</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 3: MONTH-TO-MONTH GOOGLE ANALYTICS REPORTS */}
                    {activeTab === 'analytics' && (
                        <motion.div 
                            key="analytics"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-8"
                        >
                            <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-emerald-400" /> Month-to-Month Google Analytics Performance
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Comprehensive monthly traffic, impressions, click rates, and AI citation growth reports.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => toast.success("Downloading full August 2026 Google Analytics executive PDF report...")}
                                        className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-500/40 flex items-center gap-2 transition-colors self-start sm:self-auto"
                                    >
                                        <Download className="w-4 h-4" /> Download Monthly GA PDF Report
                                    </button>
                                </div>

                                {/* Month to month table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-300">
                                        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                                            <tr>
                                                <th className="py-3 px-4">Period</th>
                                                <th className="py-3 px-4">Organic Impressions</th>
                                                <th className="py-3 px-4">Organic Clicks</th>
                                                <th className="py-3 px-4">CTR %</th>
                                                <th className="py-3 px-4">Leads / Conversions</th>
                                                <th className="py-3 px-4">AI Citations (GEO)</th>
                                                <th className="py-3 px-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {analyticsMonths.map((m, idx) => (
                                                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                                    <td className="py-3.5 px-4 font-bold text-white">{m.month}</td>
                                                    <td className="py-3.5 px-4 font-medium text-cyan-400">{m.impressions}</td>
                                                    <td className="py-3.5 px-4 font-medium text-purple-300">{m.clicks}</td>
                                                    <td className="py-3.5 px-4">{m.ctr}</td>
                                                    <td className="py-3.5 px-4 font-bold text-emerald-400">{m.conversions}</td>
                                                    <td className="py-3.5 px-4 text-amber-300 font-medium">{m.aiCitations}</td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                                            idx === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                                                        }`}>
                                                            {idx === 0 ? 'Verified GA Data' : 'Projected SLA'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 4: MULTI-CLIENT BRAND PORTFOLIO */}
                    {activeTab === 'clients' && (
                        <motion.div 
                            key="clients"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-8"
                        >
                            <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Users className="w-5 h-5 text-blue-400" /> Multi-Client Brand Portfolio
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Manage individual client accounts under V Magnetic Minds. Click any client to inspect their SEO/GEO/GBP metrics.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {clientBrands.map((brand) => (
                                        <div 
                                            key={brand.id}
                                            onClick={() => setSelectedBrandId(brand.id)}
                                            className={`p-5 rounded-xl border transition-all cursor-pointer ${
                                                selectedBrandId === brand.id 
                                                    ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500 shadow-xl' 
                                                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                                    {brand.industry}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    brand.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'
                                                }`}>
                                                    {brand.status}
                                                </span>
                                            </div>

                                            <h4 className="text-lg font-bold text-white">{brand.name}</h4>
                                            <p className="text-xs text-cyan-400 mt-0.5 flex items-center gap-1">
                                                <Globe className="w-3.5 h-3.5" /> {brand.website}
                                            </p>

                                            <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                                                <div className="bg-slate-900 p-2 rounded-lg">
                                                    <div className="text-[10px] text-slate-400">GEO Score</div>
                                                    <div className="text-sm font-bold text-purple-300">{brand.geoScore}/100</div>
                                                </div>
                                                <div className="bg-slate-900 p-2 rounded-lg">
                                                    <div className="text-[10px] text-slate-400">SEO Score</div>
                                                    <div className="text-sm font-bold text-cyan-300">{brand.seoScore}/100</div>
                                                </div>
                                                <div className="bg-slate-900 p-2 rounded-lg">
                                                    <div className="text-[10px] text-slate-400">GBP Health</div>
                                                    <div className="text-sm font-bold text-rose-400">{brand.gbpScore}/100</div>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                                                <span>Tracked Keywords: <strong className="text-white">{brand.keywordsTracked}</strong></span>
                                                <span className="text-emerald-400 font-semibold">{brand.localRank}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 5: PAYMENTS & UPI BILLING HUB */}
                    {activeTab === 'billing' && (
                        <motion.div 
                            key="billing"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: UPI QR Card */}
                                <div className="bg-slate-900/80 p-6 rounded-2xl border border-cyan-500/40 shadow-2xl relative overflow-hidden flex flex-col">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full pointer-events-none" />

                                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                                        <QrCode className="w-5 h-5 text-cyan-400" /> UPI Payment Hub
                                    </h3>
                                    <p className="text-xs text-slate-400 mb-4">Scan QR or tap an app icon to pay instantly.</p>

                                    {/* Real QR Code image from PhonePe/BHIM */}
                                    <div className="bg-white p-3 rounded-2xl shadow-2xl border-2 border-cyan-500/30 max-w-[220px] mx-auto mb-4">
                                        <img
                                            src="/siddhi-upi-qr.jpg"
                                            alt="Scan to Pay – 6303602743@upi"
                                            className="w-full h-full object-contain rounded-xl"
                                        />
                                        <div className="mt-2 text-center">
                                            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Scan & Pay</div>
                                            <div className="text-xs font-bold text-slate-800 mt-0.5">{upiId}</div>
                                        </div>
                                    </div>

                                    {/* UPI ID copy strip */}
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-700 flex items-center justify-between mb-5">
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase font-semibold">UPI VPA</div>
                                            <div className="text-sm font-extrabold text-cyan-300">{upiId}</div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(upiId, "UPI ID")}
                                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                                        >
                                            {copiedKey === "UPI ID" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                            {copiedKey === "UPI ID" ? "Copied" : "Copy"}
                                        </button>
                                    </div>

                                    {/* UPI App Icon Buttons */}
                                    <div className="mt-auto">
                                        <p className="text-[10px] text-slate-400 uppercase font-semibold mb-3">Open in UPI App</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {/* GPay */}
                                            <a
                                                href={buildUpiLink('gpay')}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => toast.info("Opening Google Pay...")}
                                                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center shadow">
                                                    <svg viewBox="0 0 48 48" className="w-6 h-6">
                                                        <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                                        <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                                        <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                                    </svg>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-300 group-hover:text-white">GPay</span>
                                            </a>

                                            {/* PhonePe */}
                                            <a
                                                href={buildUpiLink('phonepe')}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => toast.info("Opening PhonePe...")}
                                                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/50 transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#5f259f] flex items-center justify-center shadow">
                                                    <svg viewBox="0 0 48 48" className="w-5 h-5" fill="white">
                                                        <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm5.5 27h-3.8l-7.4-9.6V31H15V17h3.8l7.4 9.6V17H29.5v14z"/>
                                                    </svg>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-300 group-hover:text-white">PhonePe</span>
                                            </a>

                                            {/* Paytm */}
                                            <a
                                                href={buildUpiLink('paytm')}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => toast.info("Opening Paytm...")}
                                                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#00BAF2] flex items-center justify-center shadow">
                                                    <svg viewBox="0 0 48 48" className="w-5 h-5" fill="white">
                                                        <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="900" fontFamily="Arial">P</text>
                                                    </svg>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-300 group-hover:text-white">Paytm</span>
                                            </a>

                                            {/* BHIM */}
                                            <a
                                                href={buildUpiLink('bhim')}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => toast.info("Opening BHIM UPI...")}
                                                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/50 transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-green-600 flex items-center justify-center shadow">
                                                    <svg viewBox="0 0 48 48" className="w-5 h-5" fill="white">
                                                        <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="900" fontFamily="Arial">B</text>
                                                    </svg>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-300 group-hover:text-white">BHIM</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: SLA Invoices & Payment Verification */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <CreditCard className="w-5 h-5 text-yellow-400" /> 12-Month SLA Payment Schedule
                                                </h3>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Contract Total: <strong className="text-white">{total12MonthSla}</strong> ({monthlyFee})
                                                    <span className="ml-2 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">⚙ Amounts set by admin – read only</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {invoices.map((inv) => (
                                                <div 
                                                    key={inv.id}
                                                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                                >
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-white">{inv.id}</span>
                                                            <span className="text-xs text-slate-400">• {inv.month}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-300 mt-1">{inv.desc}</p>
                                                        <div className="text-[11px] text-slate-500 mt-1">Due: {inv.date}</div>
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
                                                        <div className="text-right">
                                                            {/* Amount is admin-assigned and read-only */}
                                                            <div className="text-base font-extrabold text-white">{inv.amount}</div>
                                                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                                                inv.status === 'Paid'    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                                                inv.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                                                                           'bg-slate-800 text-slate-400'
                                                            }`}>
                                                                {inv.status}
                                                            </span>
                                                        </div>

                                                        {inv.status === 'Pending' && (
                                                            <button
                                                                onClick={() => openPayModal(inv)}
                                                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black text-xs font-extrabold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                                                            >
                                                                <QrCode className="w-3.5 h-3.5" /> Pay & Submit UTR
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quick UTR Submission strip */}
                                    <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
                                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-cyan-400" /> Quick UTR Submission
                                        </h4>
                                        <form onSubmit={handleSubmitPaymentProof} className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="text"
                                                placeholder="Paste UPI UTR / Transaction Reference (12 digits)"
                                                value={txnHash}
                                                onChange={(e) => setTxnHash(e.target.value)}
                                                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                                            />
                                            <button
                                                type="submit"
                                                disabled={submittingProof}
                                                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0"
                                            >
                                                {submittingProof ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Confirm Payment"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 6: AI COORDINATOR ASSISTANT */}
                    {activeTab === 'chat' && (
                        <motion.div 
                            key="chat"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="bg-slate-900/70 rounded-2xl border border-slate-800 flex flex-col h-[600px] overflow-hidden"
                        >
                            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-black font-bold">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Siddhi AI Virtual Lead</h3>
                                        <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Support for V Magnetic Minds
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400">Escalations Lead: saivaraprasad</span>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                {chatMessages.map((msg, idx) => (
                                    <div 
                                        key={idx}
                                        className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'}`}
                                    >
                                        <div className={`max-w-md p-3.5 rounded-2xl text-xs ${
                                            msg.isAdmin 
                                                ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none' 
                                                : 'bg-cyan-500 text-black font-medium rounded-tr-none'
                                        }`}>
                                            <div className="font-bold text-[10px] opacity-75 mb-1">{msg.sender}</div>
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                        </div>
                                        <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={sendChatMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ask Siddhi AI about your SEO/GEO reports, GBP optimizations, or billing..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                                >
                                    <Send className="w-4 h-4" /> Send
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* UPI PAYMENT MODAL – Full Featured */}
            <AnimatePresence>
                {payModalOpen && selectedInvoice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 20 }}
                            className="bg-[#0D1117] border border-cyan-500/40 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-cyan-900/40 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <QrCode className="w-5 h-5 text-cyan-400" />
                                    <div>
                                        <h3 className="text-base font-bold text-white">Pay via UPI</h3>
                                        <p className="text-[10px] text-slate-400">{selectedInvoice.id} · {selectedInvoice.month}</p>
                                    </div>
                                </div>
                                <button onClick={() => setPayModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Amount (read-only – admin assigned) */}
                                <div className="bg-slate-950 rounded-xl border border-slate-700 p-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Amount Due</div>
                                        <div className="text-2xl font-extrabold text-white mt-0.5">{selectedInvoice.amount}</div>
                                        <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"/> Admin-assigned · Not editable
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-slate-400 uppercase">Pay to</div>
                                        <div className="text-sm font-bold text-cyan-300">{upiId}</div>
                                        <div className="text-[10px] text-slate-400">{payeesName}</div>
                                    </div>
                                </div>

                                {/* QR Code – real image */}
                                <div className="flex gap-4 items-start">
                                    <div className="bg-white p-2.5 rounded-xl shadow-xl border-2 border-cyan-500/30 shrink-0">
                                        <img
                                            src="/siddhi-upi-qr.jpg"
                                            alt={`Pay ₹${selectedInvoice.rawAmount} via UPI`}
                                            className="w-36 h-36 object-contain rounded-lg"
                                        />
                                        <div className="text-[9px] font-bold text-slate-600 text-center mt-1.5 uppercase tracking-wide">Scan to Pay</div>
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        {/* UPI ID copy */}
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">UPI VPA</div>
                                            <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 flex items-center justify-between">
                                                <span className="text-sm font-bold text-cyan-300">{upiId}</span>
                                                <button onClick={() => copyToClipboard(upiId, "UPI ID")} className="ml-2 text-slate-400 hover:text-white transition-colors">
                                                    {copiedKey === "UPI ID" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* UPI App icon deep-link buttons */}
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Open in App</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <a href={buildUpiLink('gpay')} target="_blank" rel="noopener noreferrer"
                                                    onClick={() => toast.info('Opening Google Pay…')}
                                                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-slate-700 hover:border-blue-500/50 rounded-xl transition-all">
                                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                                                        <svg viewBox="0 0 48 48" className="w-4 h-4">
                                                            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                                            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                                            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-200">Google Pay</span>
                                                </a>

                                                <a href={buildUpiLink('phonepe')} target="_blank" rel="noopener noreferrer"
                                                    onClick={() => toast.info('Opening PhonePe…')}
                                                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-slate-700 hover:border-purple-500/50 rounded-xl transition-all">
                                                    <div className="w-6 h-6 rounded-full bg-[#5f259f] flex items-center justify-center shrink-0">
                                                        <svg viewBox="0 0 48 48" className="w-4 h-4" fill="white">
                                                            <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm5.5 27h-3.8l-7.4-9.6V31H15V17h3.8l7.4 9.6V17H29.5v14z"/>
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-200">PhonePe</span>
                                                </a>

                                                <a href={buildUpiLink('paytm')} target="_blank" rel="noopener noreferrer"
                                                    onClick={() => toast.info('Opening Paytm…')}
                                                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-slate-700 hover:border-sky-500/50 rounded-xl transition-all">
                                                    <div className="w-6 h-6 rounded-full bg-[#00BAF2] flex items-center justify-center shrink-0">
                                                        <span className="text-white font-extrabold text-[11px]">P</span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-200">Paytm</span>
                                                </a>

                                                <a href={buildUpiLink('bhim')} target="_blank" rel="noopener noreferrer"
                                                    onClick={() => toast.info('Opening BHIM UPI…')}
                                                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-slate-700 hover:border-orange-500/50 rounded-xl transition-all">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-green-600 flex items-center justify-center shrink-0">
                                                        <span className="text-white font-extrabold text-[11px]">B</span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-200">BHIM UPI</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* UTR Submission form – pre-filled with invoice context */}
                                <form onSubmit={handleSubmitPaymentProof} className="space-y-3 pt-2 border-t border-slate-800">
                                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                                        After paying, paste your UTR number below to confirm the transaction.
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase">UPI Transaction UTR / Ref ID</label>
                                            <input
                                                type="text"
                                                required
                                                minLength={8}
                                                placeholder="e.g. 623910481923"
                                                value={txnHash}
                                                onChange={(e) => setTxnHash(e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                                            />
                                        </div>
                                    </div>
                                    {/* Pre-filled read-only confirmation context */}
                                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                                        <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                                            <div className="text-slate-500">Invoice</div>
                                            <div className="text-slate-200 font-semibold">{selectedInvoice.id}</div>
                                        </div>
                                        <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                                            <div className="text-slate-500">Amount</div>
                                            <div className="text-white font-extrabold">{selectedInvoice.amount}</div>
                                        </div>
                                        <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 col-span-2">
                                            <div className="text-slate-500">Pay to</div>
                                            <div className="text-cyan-300 font-semibold">{upiId} · {payeesName}</div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submittingProof}
                                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                                    >
                                        {submittingProof
                                            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying…</>
                                            : <><Check className="w-4 h-4" /> Submit Payment Confirmation</>}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

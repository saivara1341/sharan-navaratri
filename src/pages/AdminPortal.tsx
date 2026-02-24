import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import {
    Users,
    MessageSquare,
    Target,
    ClipboardList,
    HelpCircle,
    Handshake,
    Filter,
    Search,
    LogOut,
    ChevronRight,
    Calendar,
    Mail,
    Briefcase,
    Building2,
    RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Submission {
    id: string;
    created_at: string;
    name: string;
    email: string;
    designation: string | null;
    organization: string | null;
    inquiry_type: string;
    message: string;
    status?: string;
    progress?: number;
    is_public?: boolean;
    bounty_reward?: string;
}

const AdminPortal = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // Check for admin session
    useEffect(() => {
        const isAdmin = localStorage.getItem("nexus_admin_session") === "true";
        if (!isAdmin) {
            toast.error("Unauthorized access. Identification required.");
            navigate("/auth");
        }
    }, [navigate]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("contact_submissions")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Supabase Error:", error);
                throw error;
            }
            setSubmissions(data || []);
        } catch (error: any) {
            const msg = error.message || "Unknown error";
            console.error("Fetch Failure:", error);

            if (msg.includes("Failed to fetch")) {
                toast.error("Network Error: Could not connect to Supabase. Check your internet or Supabase project status.");
            } else if (error.code === "PGRST301" || msg.includes("RLS")) {
                toast.error("Access Denied: Row Level Security is preventing data retrieval. Please check Supabase policies.");
            } else {
                toast.error("Failed to fetch submissions: " + msg);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const filteredSubmissions = submissions.filter(s => {
        const matchesFilter = filter === "all" || s.inquiry_type === filter;
        const matchesSearch =
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getInquiryIcon = (type: string) => {
        switch (type) {
            case "problem": return <Target className="w-5 h-5 text-red-400" />;
            case "requirement": return <ClipboardList className="w-5 h-5 text-blue-400" />;
            case "inquiry": return <HelpCircle className="w-5 h-5 text-yellow-400" />;
            case "investor": return <Handshake className="w-5 h-5 text-green-400" />;
            default: return <MessageSquare className="w-5 h-5 text-gray-400" />;
        }
    };

    const getInquiryLabel = (type: string) => {
        switch (type) {
            case "problem": return "Real-World Problem";
            case "requirement": return "Project Requirement";
            case "inquiry": return "General Inquiry";
            case "investor": return "Investors & Supporters";
            default: return type;
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold gradient-text glow-text mb-2"
                        >
                            Nexus Admin HQ
                        </motion.h1>
                        <p className="text-muted-foreground">Monitoring deep-tech innovations and inquiries.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchSubmissions}
                            className="p-3 rounded-xl glass-card hover:bg-white/5 transition-colors group"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem("nexus_admin_session");
                                navigate("/");
                            }}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Total Submissions", value: submissions.length, icon: <Users className="w-6 h-6 text-primary" /> },
                        { label: "Problems", value: submissions.filter(s => s.inquiry_type === "problem").length, icon: <Target className="w-6 h-6 text-red-400" /> },
                        { label: "Requirements", value: submissions.filter(s => s.inquiry_type === "requirement").length, icon: <ClipboardList className="w-6 h-6 text-blue-400" /> },
                        { label: "Investors", value: submissions.filter(s => s.inquiry_type === "investor").length, icon: <Handshake className="w-6 h-6 text-green-400" /> },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 electric-border flex items-center justify-between"
                        >
                            <div>
                                <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-3xl font-bold">{stat.value}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5">
                                {stat.icon}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, email or message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        {[
                            { id: "all", label: "All types", icon: <Filter className="w-4 h-4" /> },
                            { id: "problem", label: "Problems", icon: <Target className="w-4 h-4" /> },
                            { id: "requirement", label: "Requirements", icon: <ClipboardList className="w-4 h-4" /> },
                            { id: "inquiry", label: "Inquiries", icon: <HelpCircle className="w-4 h-4" /> },
                            { id: "investor", label: "Investors", icon: <Handshake className="w-4 h-4" /> },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setFilter(t.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === t.id
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                                    }`}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submissions List */}
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <RefreshCw className="w-10 h-10 animate-spin mb-4 text-primary" />
                                <p>Establishing link to deep-tech database...</p>
                            </div>
                        ) : filteredSubmissions.length === 0 ? (
                            <div className="text-center py-20 glass-card rounded-2xl border border-dashed border-white/10">
                                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-medium mb-2">No submissions found</h3>
                                <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            filteredSubmissions.map((sub, i) => (
                                <motion.div
                                    key={sub.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="glass-card overflow-hidden electric-border group hover:border-primary/50 transition-colors"
                                >
                                    <div className="p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        {getInquiryIcon(sub.inquiry_type)}
                                                        {getInquiryLabel(sub.inquiry_type)}
                                                    </span>
                                                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {format(new Date(sub.created_at || ""), "MMM dd, yyyy • HH:mm")}
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{sub.name}</h3>
                                                        {sub.status && (
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${sub.status === 'Analyzing' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                                sub.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                                    'bg-green-500/10 text-green-500 border border-green-500/20'
                                                                }`}>
                                                                {sub.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                                                        <a href={`mailto:${sub.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                                            <Mail className="w-4 h-4" />
                                                            {sub.email}
                                                        </a>
                                                        {sub.designation && (
                                                            <div className="flex items-center gap-2">
                                                                <Briefcase className="w-4 h-4" />
                                                                {sub.designation}
                                                            </div>
                                                        )}
                                                        {sub.organization && (
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="w-4 h-4" />
                                                                {sub.organization}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {sub.progress !== undefined && (
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                                                            <span>PROGRESS</span>
                                                            <span>{sub.progress}%</span>
                                                        </div>
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${sub.progress}%` }}
                                                                className="h-full bg-gradient-to-r from-primary to-accent"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 group-hover:bg-white/[0.07] transition-colors relative">
                                                    {sub.bounty_reward && (
                                                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/20 text-primary border border-primary/30 z-20">
                                                            <span className="text-xs font-bold tracking-tight">BOUNTY: {sub.bounty_reward}</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                        <MessageSquare className="w-12 h-12" />
                                                    </div>
                                                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap relative z-10">
                                                        {sub.message}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="shrink-0 flex md:flex-col gap-3">
                                                <button
                                                    onClick={() => window.open(`mailto:${sub.email}?subject=Regarding your ${getInquiryLabel(sub.inquiry_type)} on Siddhi Dynamics`)}
                                                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                    Reply Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />
            </div>
        </div>
    );
};

export default AdminPortal;

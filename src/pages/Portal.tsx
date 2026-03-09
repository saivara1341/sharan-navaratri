import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseService } from "@/services/supabaseService";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "sonner";
import {
    ClipboardList,
    MessageSquare,
    Clock,
    CheckCircle2,
    Circle,
    Send,
    LogOut,
    ChevronRight,
    ChevronDown,
    Sparkles
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const Portal = () => {
    const [user, setUser] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [waitlistEntries, setWaitlistEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'submissions' | 'waitlist'>('submissions');
    const [selectedSub, setSelectedSub] = useState<any | null>(null);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/auth");
            } else {
                setUser(user);
                fetchData(user);
            }
            setLoading(false);
        };
        checkUser();
    }, [navigate]);

    const fetchData = async (user: any) => {
        try {
            const [subData, waitData] = await Promise.all([
                supabaseService.getSubmissions(user.email),
                supabaseService.getWaitlistEntries(user.email)
            ]);

            if (subData) setSubmissions(subData);
            if (waitData) setWaitlistEntries(waitData);
        } catch (error) {
            console.error("Error fetching portal data:", error);
            toast.error("Failed to load your data. Please refresh.");
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return { text: "Good Morning", emoji: "☀️" };
        if (hour >= 12 && hour < 17) return { text: "Good Afternoon", emoji: "🌤️" };
        if (hour >= 17 && hour < 21) return { text: "Good Evening", emoji: "🌇" };
        return { text: "Good Night", emoji: "🌙" };
    };

    const [greeting, setGreeting] = useState(getGreeting());

    // Dynamically update greeting every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setGreeting(getGreeting());
        }, 60_000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            <Navbar />
            <Helmet>
                <title>Neural Hub | Siddhi Dynamics Portal</title>
                <meta name="description" content="Manage your AI project submissions and track real-time progress in the Siddhi Dynamics Neural Hub." />
            </Helmet>

            {/* Background patterns */}
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10 mx-auto px-6 pt-32 pb-20 flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text mb-2">Neural Hub</h1>
                        <p className="text-muted-foreground">
                            {greeting.emoji} {greeting.text}, <span className="text-foreground font-medium">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>!
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === 'submissions'
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "bg-white/5 text-muted-foreground hover:bg-white/10"
                            }`}
                    >
                        <ClipboardList className="w-5 h-5" />
                        <span>My Submissions</span>
                        {submissions.length > 0 && (
                            <span className="bg-white/20 px-2 rounded-full text-xs">{submissions.length}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('waitlist')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === 'waitlist'
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "bg-white/5 text-muted-foreground hover:bg-white/10"
                            }`}
                    >
                        <Clock className="w-5 h-5" />
                        <span>Waitlist</span>
                        {waitlistEntries.length > 0 && (
                            <span className="bg-white/20 px-2 rounded-full text-xs">{waitlistEntries.length}</span>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        {activeTab === 'submissions' ? (
                            submissions.length === 0 ? (
                                <div className="glass-card p-8 text-center bg-white/5 border-dashed">
                                    <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground">No submissions found</p>
                                </div>
                            ) : (
                                submissions.map((sub) => (
                                    <motion.button
                                        key={sub.id}
                                        onClick={() => setSelectedSub(sub)}
                                        className={`w-full text-left p-6 rounded-2xl glass-card transition-all relative overflow-hidden group ${selectedSub?.id === sub.id ? "electric-border bg-white/10" : "bg-white/5 hover:bg-white/8"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{sub.inquiry_type}</span>
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                {selectedSub?.id === sub.id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                            </div>
                                        </div>
                                        <h3 className="font-bold mb-1 line-clamp-1">{sub.message}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(sub.created_at).toLocaleDateString()}
                                        </p>
                                    </motion.button>
                                ))
                            )
                        ) : (
                            waitlistEntries.length === 0 ? (
                                <div className="glass-card p-8 text-center bg-white/5 border-dashed">
                                    <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground">Not on any waitlists yet</p>
                                </div>
                            ) : (
                                waitlistEntries.map((entry) => (
                                    <div key={entry.id} className="p-6 rounded-2xl glass-card bg-white/5 border border-white/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold">{entry.project_name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${entry.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                }`}>
                                                {entry.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <span>Joined {new Date(entry.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>

                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {selectedSub ? (
                                <motion.div
                                    key={selectedSub.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass-card p-8 electric-border h-full flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-8 pb-8 border-b border-white/5">
                                        <div>
                                            <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-2 block">Case Details</span>
                                            <h2 className="text-2xl font-bold">{selectedSub.inquiry_type.replace('_', ' ')}</h2>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Submitted</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8 flex-grow">
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-4">Initial Inquiry</label>
                                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 italic text-lg leading-relaxed">
                                                "{selectedSub.message}"
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-4">Milestones & Updates</label>

                                            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                                                <div className="relative">
                                                    <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                        <h4 className="text-sm font-bold mb-1">Receipt Confirmed</h4>
                                                        <p className="text-xs text-muted-foreground">Our agentic systems have indexed your request into the pipeline.</p>
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                                                        <Sparkles className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-white/10 border border-primary/20">
                                                        <h4 className="text-sm font-bold mb-1 text-primary">Intelligent Processing</h4>
                                                        <p className="text-xs text-muted-foreground">Neural assessment is currently evaluating technical feasibility.</p>
                                                        <div className="mt-4 flex items-center gap-4">
                                                            <div className="h-1 flex-grow bg-white/5 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-primary"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: "45%" }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-mono text-primary">45% COMPLETION</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                        <div className="flex gap-4 items-center">
                                            <div className="p-3 rounded-xl bg-primary/20">
                                                <Clock className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold mb-1">Estimated Review</h4>
                                                <p className="text-xs text-muted-foreground">Next algorithmic update expected within 24 hours.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full glass-card electric-border flex flex-col items-center justify-center p-12 text-center opacity-50 space-y-6">
                                    <div className="p-8 rounded-full bg-white/5 relative">
                                        <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-20" />
                                        <MessageSquare className="w-16 h-16 text-primary/50" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Neural Hub Offline</h2>
                                        <p className="text-muted-foreground max-w-sm mx-auto">Select a project or inquiry from the list to view its real-time processing status and neural roadmap.</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portal;

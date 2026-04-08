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
    Sparkles,
    User,
    ArrowRight,
    AlertCircle,
    GraduationCap,
    Rocket,
    Code2,
    BarChart3,
    Handshake,
    Lightbulb,
    Target,
    Briefcase,
    Globe,
    ExternalLink,
    Cpu,
    Zap,
    Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useTranslation } from "react-i18next";

const Portal = () => {
    const { t } = useTranslation();
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
                    <Link 
                        to="/profile"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all font-semibold"
                    >
                        <User className="w-5 h-5" />
                        <span>Profile Settings</span>
                    </Link>
                </div>

                {user?.user_metadata?.role && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Recommended for You</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(() => {
                                const roles = user.user_metadata.roles || [user.user_metadata.role];
                                const services: any[] = [];
                                
                                if (roles.includes('Student / Researcher')) {
                                    services.push(
                                        { title: t('footer.services.student.resume.title'), desc: t('footer.services.student.resume.desc'), icon: GraduationCap, color: "blue", link: "/nexus/resume-builder" },
                                        { title: t('footer.services.student.skills.title'), desc: t('footer.services.student.skills.desc'), icon: Target, color: "indigo", link: "/nexus/resource-hub?category=student" },
                                        { title: t('footer.services.student.jobs.title'), desc: t('footer.services.student.jobs.desc'), icon: Briefcase, color: "cyan", link: "/nexus/resource-hub?category=student" },
                                        { title: "Academic Hub", desc: "Access LeetCode, ArXiv & Nexus tools.", icon: Globe, color: "emerald", link: "/nexus/resource-hub?category=student" }
                                    );
                                }
                                if (roles.includes('Visionary Founder')) {
                                    services.push(
                                        { title: t('footer.services.founder.blueprint.title'), desc: t('footer.services.founder.blueprint.desc'), icon: Rocket, color: "orange", link: "/nexus/startup-blueprint" },
                                        { title: "Market & Growth", desc: "DPIIT schemes, grants & market analysis.", icon: BarChart3, color: "amber", link: "/nexus/resource-hub?category=founder" },
                                        { title: "Startup Sahayak", desc: "Razorpay & DPIIT official resources.", icon: Sparkles, color: "rose", link: "/nexus/resource-hub?category=founder" }
                                    );
                                }
                                if (roles.includes('Tech Architect')) {
                                    services.push(
                                        { title: t('footer.services.architect.design.title'), desc: t('footer.services.architect.design.desc'), icon: Code2, color: "emerald", link: "/nexus/resource-hub?category=architect" },
                                        { title: "System Design Pro", desc: "ByteByteGo & System Design Primer.", icon: Cpu, color: "blue", link: "/nexus/resource-hub?category=architect" },
                                        { title: t('footer.services.architect.tech.title'), desc: t('footer.services.architect.tech.desc'), icon: Lightbulb, color: "teal", link: "/nexus/resource-hub?category=architect" }
                                    );
                                }
                                if (roles.includes('Strategic Partner')) {
                                    services.push(
                                        { title: t('footer.services.partner.connect.title'), desc: t('footer.services.partner.connect.desc'), icon: Handshake, color: "purple", link: "/nexus/resource-hub?category=partner" },
                                        { title: "Business Growth", desc: "HubSpot Academy & Sales training.", icon: Zap, color: "amber", link: "/nexus/resource-hub?category=partner" }
                                    );
                                }
                                if (roles.includes('Venture Investor')) {
                                    services.push(
                                        { title: t('footer.services.investor.diligence.title'), desc: t('footer.services.investor.diligence.desc'), icon: BarChart3, color: "rose", link: "/nexus/resource-hub?category=investor" },
                                        { title: "Deal Flow Tools", desc: "AngelList, Affinity & Market data.", icon: Star, color: "yellow", link: "/nexus/resource-hub?category=investor" }
                                    );
                                }
                                if (roles.includes('Other')) {
                                    services.push(
                                        { title: t('footer.services.other.consult.title'), desc: t('footer.services.other.consult.desc'), icon: Sparkles, color: "primary", link: "#/submit" }
                                    );
                                }

                                // Default fallback if no specific services match or roles are unknown
                                if (services.length === 0) {
                                    services.push({ title: "Neural Analysis", desc: "Submit a problem for AI evaluation.", icon: MessageSquare, color: "primary", link: "/submit" });
                                }

                                return services.map((service, i) => (
                                    <Link
                                        key={service.title}
                                        to={service.link}
                                        className="block"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            className="group p-6 rounded-2xl glass-card bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/8 flex flex-col items-start gap-4 cursor-pointer h-full"
                                        >
                                            <div className={`p-3 rounded-xl bg-${service.color}-500/10 text-${service.color}-500 group-hover:scale-110 transition-transform`}>
                                                <service.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{service.title}</h3>
                                                <p className="text-sm text-muted-foreground">{service.desc}</p>
                                            </div>
                                            <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span>Access Resource</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </motion.div>
                                    </Link>
                                ));
                            })()}
                        </div>
                    </div>
                )}

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
                                <div className="glass-card p-10 text-center bg-white/5 border-dashed border-white/10 flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                        <MessageSquare className="w-8 h-8 text-primary/50" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No Submissions Yet</h3>
                                    <p className="text-muted-foreground mb-8 max-w-[250px] mx-auto">Start your journey by submitting your first AI architectural inquiry.</p>
                                    <Link 
                                        to="/submit"
                                        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all group"
                                    >
                                        <span>Start New Submission</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
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
                                                        <div className="mt-6">
                                                            <div className="flex justify-between items-center relative mb-2">
                                                                {[1, 2, 3, 4, 5].map((step) => (
                                                                    <div key={step} className="relative z-10">
                                                                        <div className={`w-2 h-2 rounded-full ${step <= 3 ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-white/10'}`} />
                                                                    </div>
                                                                ))}
                                                                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5 -translate-y-1/2" />
                                                                <div className="absolute top-1/2 left-0 w-1/2 h-[1px] bg-primary/50 -translate-y-1/2 transition-all duration-1000" />
                                                            </div>
                                                            <div className="flex justify-between text-[8px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                                                                <span>Phase I</span>
                                                                <span>Phase II</span>
                                                                <span>Phase III</span>
                                                                <span>Phase IV</span>
                                                                <span>Phase V</span>
                                                            </div>
                                                            <div className="mt-4 flex items-center justify-between">
                                                                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Current Stage: Neural Analysis</span>
                                                                <span className="text-[10px] font-mono text-muted-foreground/60">EST. STABILITY: 45%</span>
                                                            </div>
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

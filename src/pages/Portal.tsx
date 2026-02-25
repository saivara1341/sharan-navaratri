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

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            <Navbar />

            {/* Background decorations */}
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

            <main className="flex-grow container mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative">
                    <div className="absolute -top-12 right-0 md:-top-16 md:right-0">
                        <button
                            onClick={logout}
                            title="Sign Out"
                            className="p-3 rounded-full glass-card border border-border/50 hover:bg-destructive/10 hover:border-destructive/30 transition-all text-muted-foreground hover:text-destructive group"
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Collab Zone • Growth & Marketing Intelligence</p>
                        <h2 className="text-2xl font-bold gradient-text">Welcome, {user?.email?.split('@')[0]}</h2>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-3 space-y-3">
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${activeTab === 'submissions'
                                ? 'bg-primary/10 border border-primary/30 text-primary shadow-lg shadow-primary/10'
                                : 'hover:bg-card/50 border border-transparent text-muted-foreground'
                                }`}
                        >
                            <ClipboardList className="w-5 h-5" />
                            <span className="font-semibold">Submissions</span>
                            <span className="ml-auto bg-primary/20 text-xs px-2 py-1 rounded-md">{submissions.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('waitlist')}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${activeTab === 'waitlist'
                                ? 'bg-primary/10 border border-primary/30 text-primary shadow-lg shadow-primary/10'
                                : 'hover:bg-card/50 border border-transparent text-muted-foreground'
                                }`}
                        >
                            <Clock className="w-5 h-5" />
                            <span className="font-semibold">Waitlist</span>
                            <span className="ml-auto bg-primary/20 text-xs px-2 py-1 rounded-md">{waitlistEntries.length}</span>
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        {activeTab === 'submissions' ? (
                            <div className="space-y-4">
                                {submissions.length === 0 ? (
                                    <div className="glass-card p-12 text-center">
                                        <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-muted-foreground">No submissions found. Shared your first problem with us!</p>
                                    </div>
                                ) : (
                                    submissions.map((sub) => (
                                        <div key={sub.id} className="glass-card overflow-hidden group">
                                            <div
                                                onClick={() => {
                                                    setSelectedSub(selectedSub?.id === sub.id ? null : sub);
                                                }}
                                                className="p-6 cursor-pointer flex items-center justify-between hover:bg-primary/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sub.status === 'Resolved' ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'
                                                        }`}>
                                                        <MessageSquare className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-foreground capitalize">{sub.inquiry_type} Solution Tracking</h3>
                                                        <p className="text-sm text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-xs px-3 py-1 rounded-full border ${sub.status === 'Resolved'
                                                        ? 'border-green-500/30 bg-green-500/10 text-green-500'
                                                        : 'border-primary/30 bg-primary/10 text-primary'
                                                        }`}>
                                                        {sub.status || 'Analyzing'}
                                                    </span>
                                                    {selectedSub?.id === sub.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {selectedSub?.id === sub.id && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: "auto" }}
                                                        exit={{ height: 0 }}
                                                        className="overflow-hidden border-t border-border/30 bg-black/20"
                                                    >
                                                        <div className="p-8 space-y-8">
                                                            {/* Details */}
                                                            <div className="grid md:grid-cols-2 gap-8">
                                                                <div className="space-y-4">
                                                                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary/70">Original Message</h4>
                                                                    <p className="text-sm text-foreground/90 leading-relaxed bg-white/5 p-4 rounded-xl italic">
                                                                        "{sub.message}"
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <h4 className="text-sm font-bold uppercase tracking-widest text-accent/70">Our Reply</h4>
                                                                    <p className="text-sm text-foreground/90 leading-relaxed bg-accent/5 p-4 rounded-xl">
                                                                        {sub.response || "Our AI agents are currently analyzing your problem statement. We will provide a technical roadmap shortly."}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* AI Agent Analysis Integration */}
                                                            <div className="bg-[#1A1A1A] border border-primary/20 rounded-2xl p-6 relative overflow-hidden group/agent">
                                                                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover/agent:opacity-100 transition-opacity">
                                                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                                </div>

                                                                <div className="flex items-center gap-3 mb-6">
                                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-foreground">Siddhi Bot</h4>
                                                                        <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold">Marketing & Growth Strategist</p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-6">
                                                                    <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                                                                        <h5 className="text-xs font-bold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                                                                            <Clock className="w-3 h-3" /> Bot State: Crafting Campaign
                                                                        </h5>
                                                                        <p className="text-sm text-foreground/80 leading-relaxed italic">
                                                                            "I have analyzed your {sub.inquiry_type} submission. I am currently designing a high-impact social media strategy to maximize engagement. We are targeting viral growth vectors for '{sub.message.split(' ').slice(0, 3).join(' ')}...' on Instagram and LinkedIn."
                                                                        </p>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                        {[
                                                                            { label: 'Complexity', value: 'High', color: 'text-orange-400' },
                                                                            { label: 'Feasibility', value: 'Verified', color: 'text-green-400' },
                                                                            { label: 'Priority', value: 'Active', color: 'text-primary' }
                                                                        ].map((stat, i) => (
                                                                            <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5 text-center">
                                                                                <span className="text-[10px] text-muted-foreground block mb-1 uppercase font-bold">{stat.label}</span>
                                                                                <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary/70">Agentic Milestones</h4>
                                                                        <div className="space-y-4">
                                                                            {(sub.milestones || [
                                                                                { title: "Brand Voice Alignment", completed: true },
                                                                                { title: "Social Content Strategy", completed: sub.status !== 'Analyzing' },
                                                                                { title: "Viral Campaign Launch", completed: sub.status === 'In Progress' || sub.status === 'Resolved' },
                                                                                { title: "Growth & Analytics Report", completed: sub.status === 'Resolved' }
                                                                            ]).map((milestone: any, i: number) => (
                                                                                <div key={i} className="flex items-center gap-4">
                                                                                    {milestone.completed ? (
                                                                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                                                                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                                                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
                                                                                        </div>
                                                                                    )}
                                                                                    <span className={milestone.completed ? 'text-foreground font-medium text-sm' : 'text-muted-foreground italic text-sm'}>
                                                                                        {milestone.title}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* AI Agent Brainstorming - Clarity Followup */}
                                                            <div className="space-y-4 pt-6 border-t border-border/30">
                                                                <h4 className="text-sm font-bold uppercase tracking-widest text-accent/70 flex items-center gap-2">
                                                                    <Sparkles className="w-4 h-4" /> Agent Clarification Prompt
                                                                </h4>
                                                                <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
                                                                    <p className="text-sm text-foreground/80 leading-relaxed">
                                                                        <span className="text-accent font-bold">Bot Inquiry:</span> "To optimize your reach, which platform is your primary focus? I am currently tailoring the '{sub.message.split(' ').slice(0, 2).join(' ')}' campaign for maximum CTR."
                                                                    </p>
                                                                    <div className="mt-4 flex gap-3">
                                                                        <div className="flex-grow bg-black/40 rounded-lg px-4 py-2 text-xs text-muted-foreground italic border border-white/5">
                                                                            Responding to this clarity prompt will accelerate engineering...
                                                                        </div>
                                                                        <button
                                                                            onClick={() => toast.success("Clarity signal sent to engineering agents!")}
                                                                            className="px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg text-xs font-bold transition-all"
                                                                        >
                                                                            Signal Clarity
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {waitlistEntries.length === 0 ? (
                                    <div className="col-span-full glass-card p-12 text-center">
                                        <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-muted-foreground">You haven't joined any waitlists yet.</p>
                                    </div>
                                ) : (
                                    waitlistEntries.map((entry) => (
                                        <div key={entry.id} className="glass-card p-6 flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold font-display text-primary">{entry.project_name}</h3>
                                                    <p className="text-sm text-muted-foreground">Joined: {new Date(entry.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="bg-primary/10 px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase border border-primary/20">
                                                    Active
                                                </div>
                                            </div>

                                            {entry.comment && (
                                                <div className="bg-white/5 p-4 rounded-xl border border-border/30">
                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Your Feedback</span>
                                                    <p className="text-sm italic">"{entry.comment}"</p>
                                                </div>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-border/30 flex items-center gap-2 text-xs text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-accent" />
                                                We will notify you at launch
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer Branding */}
            <footer className="py-8 border-t border-border/10 text-center">
                <p className="text-xs text-muted-foreground/50 uppercase tracking-[0.3em]">
                    Growth & Marketing Intelligence • Siddhi Dynamics Collab
                </p>
            </footer>
        </div>
    );
};

export default Portal;

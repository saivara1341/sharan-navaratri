import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Briefcase, CheckCircle, Clock, AlertCircle, LogOut, ExternalLink, Calendar, ShieldCheck, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

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
    bounty_reward?: string;
}

export default function ClientPortal() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [clientEmail, setClientEmail] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientOrg, setClientOrg] = useState("");
    const [projects, setProjects] = useState<Submission[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const parseProjectMetadata = (bountyReward: string | null | undefined) => {
        try {
            if (bountyReward && bountyReward.trim().startsWith('{')) {
                return JSON.parse(bountyReward);
            }
        } catch (e) {
            console.error("Failed to parse project metadata:", e);
        }
        return {
            deadline: "",
            website_url: "",
            agreement: bountyReward || ""
        };
    };

    const fetchClientProjects = async (email: string) => {
        try {
            const { data, error } = await supabase
                .from('contact_submissions')
                .select('*')
                .eq('email', email.trim().toLowerCase())
                .order('created_at', { ascending: false });

            if (error) throw error;

            const clientProjects = data || [];
            setProjects(clientProjects);

            if (clientProjects.length > 0) {
                setClientName(clientProjects[0].name || "");
                setClientOrg(clientProjects[0].organization || "");
            }
        } catch (err: any) {
            console.error("Error loading client projects:", err);
            toast.error("Failed to fetch project roadmap details.");
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        if (clientEmail) {
            await fetchClientProjects(clientEmail);
        }
        setRefreshing(false);
        toast.success("Project status synchronized.");
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                toast.error("Please sign in to access your client portal.");
                navigate("/auth");
                return;
            }

            const email = session.user.email;
            if (email) {
                setClientEmail(email);
                fetchClientProjects(email).then(() => {
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center gap-4">
                <RefreshCw className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">Connecting to neural project gateway...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden">
            <Navbar />
            <Helmet>
                <title>Client Portal | Siddhi Dynamics</title>
                <meta name="description" content="Access your live project delivery tracking, contracts, requirements, and deployment configurations." />
            </Helmet>

            <main className="container mx-auto px-6 pt-32 pb-20 max-w-5xl relative z-10 space-y-12">
                
                {/* Portal Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="text-left">
                        <span className="text-xs uppercase font-bold text-primary tracking-[0.25em]">Siddhi Dynamics Portal</span>
                        <h1 className="text-3xl font-extrabold mt-1 text-white">
                            {clientOrg ? `${clientOrg} Dashboard` : "Your Project Workspace"}
                        </h1>
                        <p className="text-muted-foreground text-xs mt-1">
                            Authorized Representative: <span className="text-slate-300 font-semibold">{clientName || "Client"}</span> ({clientEmail})
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                            title="Sync Roadmap Progress"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5 text-slate-300 hover:text-red-400 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-white/10 space-y-4">
                        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto" />
                        <h3 className="text-xl font-medium text-white">No takeup projects found</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            We haven't linked a project roadmap to your email address ({clientEmail}) yet. Please contact your Siddhi Dynamics account manager to configure your dashboard.
                        </p>
                        <a
                            href="mailto:contact@siddhidynamics.in"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                            <Mail className="w-4 h-4" /> Contact Account Manager
                        </a>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Projects Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Workloads</span>
                                    <Briefcase className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-3xl font-extrabold text-white">{projects.length}</p>
                            </div>

                            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Active Roadmaps</span>
                                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                                </div>
                                <p className="text-3xl font-extrabold text-white">
                                    {projects.filter(p => p.status !== "Completed").length}
                                </p>
                            </div>

                            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Completed Milestones</span>
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                </div>
                                <p className="text-3xl font-extrabold text-white">
                                    {projects.filter(p => p.status === "Completed").length}
                                </p>
                            </div>
                        </div>

                        {/* Projects Breakdown List */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white tracking-wide text-left">Active Delivery Roadmaps</h2>
                            
                            {projects.map((proj) => {
                                const meta = parseProjectMetadata(proj.bounty_reward);
                                const progressVal = proj.progress || 0;
                                const currentPhase = Math.ceil(progressVal / 20) || 1;

                                return (
                                    <div key={proj.id} className="glass-card overflow-hidden border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 text-left hover:border-primary/30 transition-all">
                                        
                                        {/* Project Meta Header */}
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                    {proj.organization || "Custom Software Deployment"}
                                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                                                        proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                        proj.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                        'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                    }`}>{proj.status || 'Analyzing'}</span>
                                                </h3>
                                                <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mt-1">Roadmap ID: {proj.id.slice(0, 8)}</p>
                                            </div>

                                            {meta.website_url && (
                                                <a
                                                    href={meta.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs transition-all hover:scale-105 shadow-md shadow-primary/10"
                                                >
                                                    Launch Website / SaaS <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>

                                        {/* Requirements / Description */}
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Project Scope & Requirements</h4>
                                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                {proj.message}
                                            </div>
                                        </div>

                                        {/* Development Roadmap Progress */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Neural Developmental Roadmap</span>
                                                <span className="text-xs font-extrabold text-primary">PHASE {currentPhase} · {progressVal}% COMPLETED</span>
                                            </div>
                                            
                                            {/* Progress Bar slider representation */}
                                            <div className="space-y-2">
                                                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progressVal}%` }}
                                                        className="absolute left-0 h-full bg-gradient-to-r from-primary to-accent"
                                                    />
                                                </div>
                                                <div className="flex justify-between w-full text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                                                    <span>Phase 1: Architecture</span>
                                                    <span>Phase 2: Alpha</span>
                                                    <span>Phase 3: Integration</span>
                                                    <span>Phase 4: Validation</span>
                                                    <span>Phase 5: Deploy</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Metadata Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                                            {meta.deadline && (
                                                <div className="flex items-center gap-3 p-3 bg-white/2 rounded-xl border border-white/5">
                                                    <Calendar className="w-5 h-5 text-primary shrink-0" />
                                                    <div>
                                                        <p className="text-[9px] text-muted-foreground font-bold uppercase">Target Milestone Deadline</p>
                                                        <p className="text-sm font-bold text-slate-200">{meta.deadline}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {meta.agreement && (
                                                <div className="flex items-center gap-3 p-3 bg-white/2 rounded-xl border border-white/5">
                                                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                                                    <div>
                                                        <p className="text-[9px] text-muted-foreground font-bold uppercase">Contractual Agreement & Support SLA</p>
                                                        <p className="text-sm font-semibold text-slate-200 truncate max-w-xs" title={meta.agreement}>{meta.agreement}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

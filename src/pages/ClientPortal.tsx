import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { 
    Briefcase, 
    CheckCircle, 
    Clock, 
    AlertCircle, 
    ExternalLink, 
    Calendar, 
    ShieldCheck, 
    RefreshCw, 
    MessageCircle, 
    Send, 
    X, 
    Sparkles,
    DollarSign,
    CreditCard,
    Receipt,
    FileText,
    Download,
    FolderOpen
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import projectSubmissionIllustration from "@/assets/project-submission-empty-state.png";
import { GoogleReviewCard } from "@/components/GoogleReviewCard";

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
    const [projectTabs, setProjectTabs] = useState<Record<string, 'roadmap' | 'payments' | 'agreements'>>({});

    // Chat States
    const [chatOpen, setChatOpen] = useState<Submission | null>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [sendingMsg, setSendingMsg] = useState(false);

    const openClientChat = async (proj: Submission) => {
        setChatOpen(proj);
        setChatLoading(true);
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('submission_id', proj.id)
                .order('created_at', { ascending: true });
            if (error) throw error;
            setChatMessages(data || []);
        } catch (err: any) {
            console.error("Error loading chat:", err);
            toast.error("Could not load chat messages.");
        } finally {
            setChatLoading(false);
        }
    };

    useEffect(() => {
        if (!chatOpen) return;
        const channel = supabase
            .channel(`chat_${chatOpen.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `submission_id=eq.${chatOpen.id}`
                },
                (payload) => {
                    setChatMessages((prev) => {
                        if (prev.some(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new];
                    });
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatOpen]);

    const sendChatMessage = async () => {
        if (!chatInput.trim() || !chatOpen || !clientEmail) return;
        const userMsg = chatInput.trim();
        setChatInput("");
        setSendingMsg(true);

        try {
            // 1. Insert User Message
            const { data: userMsgData, error: userMsgError } = await supabase
                .from('chat_messages')
                .insert({
                    submission_id: chatOpen.id,
                    sender_email: clientEmail,
                    message: userMsg,
                    is_admin: false
                })
                .select();

            if (userMsgError) throw userMsgError;

            // 2. Generate embedding for query & query knowledge base
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('vite_gemini_api_key');
            if (!apiKey) {
                setSendingMsg(false);
                return;
            }

            // Generate query vector
            const embedResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'models/text-embedding-004',
                    content: { parts: [{ text: userMsg }] }
                })
            });
            if (!embedResponse.ok) throw new Error("Embedding generation failed");
            const embedData = await embedResponse.json();
            const queryVector = embedData.embedding.values;

            // Fetch context matching query vector
            const { data: matchedDocs, error: matchError } = await supabase.rpc('match_knowledge_base', {
                query_embedding: queryVector,
                match_threshold: 0.3,
                match_count: 3
            });

            const contextText = (matchedDocs || []).map((doc: any) => `Source Document: ${doc.file_name}\nContent:\n${doc.content}`).join('\n\n---\n\n');

            // Generate response via Gemini
            const systemInstruction = `You are Siddhi AI, the virtual coordinator for Siddhi Dynamics. 
Answer the client's questions about their project, requirements, pricing, or contract based ONLY on the provided Knowledge Base Context. 
Be professional, concise, and helpful. 
If the context does not contain enough information to resolve their query, reply: "I cannot verify this information. Let me escalate this to our team lead saivaraprasad for a direct response." and append "[ESCFLAG]" at the end.

---
KNOWLEDGE BASE CONTEXT:
${contextText || "No matching guidelines found."}
---
`;

            const historyPayload = chatMessages.slice(-6).map((m: any) => ({
                role: m.is_admin ? 'model' : 'user',
                parts: [{ text: m.message }]
            }));
            historyPayload.push({
                role: 'user',
                parts: [{ text: userMsg }]
            });

            const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: historyPayload,
                    systemInstruction: { parts: [{ text: systemInstruction }] }
                })
            });

            if (!geminiResponse.ok) throw new Error("Gemini AI generation failed");
            const geminiData = await geminiResponse.json();
            const aiText = geminiData.candidates[0].content.parts[0].text;

            const isEscalated = aiText.includes('[ESCFLAG]');
            const cleanAiText = aiText.replace('[ESCFLAG]', '').trim();

            // Insert AI Response into DB
            const { error: aiMsgError } = await supabase
                .from('chat_messages')
                .insert({
                    submission_id: chatOpen.id,
                    sender_email: 'ai@siddhidynamics.in',
                    message: cleanAiText,
                    is_admin: true
                });

            if (aiMsgError) throw aiMsgError;

            if (isEscalated) {
                // Update submission status to 'Analyzing'
                await supabase
                    .from('contact_submissions')
                    .update({ status: 'Analyzing' })
                    .eq('id', chatOpen.id);
                toast.info("AI escalated this query to our team lead saivaraprasad. We'll reply soon!");
            }
        } catch (err: any) {
            console.error("AI chat assistant failed:", err);
        } finally {
            setSendingMsg(false);
        }
    };

    const parseProjectMetadata = (bountyReward: string | null | undefined) => {
        try {
            if (bountyReward && bountyReward.trim().startsWith('{')) {
                const parsed = JSON.parse(bountyReward);
                return {
                    deadline: parsed.deadline || "",
                    website_url: parsed.website_url || "",
                    agreement: parsed.agreement || "",
                    budget_total: parsed.budget_total || "$12,500",
                    budget_paid: parsed.budget_paid || "$4,500",
                    invoices: parsed.invoices || [
                        { id: "INV-2026-001", description: "Initial Milestone: Discovery & Architecture Blueprint", amount: "$3,750", status: "Paid", date: "2026-06-10" },
                        { id: "INV-2026-002", description: "Second Milestone: Alpha Engine Core & DB Integration", amount: "$5,000", status: "Pending", date: "2026-07-25" },
                        { id: "INV-2026-003", description: "Final Milestone: Deployment, Handoff & Maintenance SLA", amount: "$3,750", status: "Upcoming", date: "2026-08-30" }
                    ],
                    agreements: parsed.agreements || [
                        { name: "Master Services Agreement (MSA) v1.4", date: "2026-06-01", status: "Signed", url: "#" },
                        { name: "Mutual Non-Disclosure Agreement (NDA)", date: "2026-05-28", status: "Signed", url: "#" }
                    ]
                };
            }
        } catch (e) {
            console.error("Failed to parse project metadata:", e);
        }
        return {
            deadline: "",
            website_url: "",
            agreement: bountyReward || "",
            budget_total: "$12,500",
            budget_paid: "$4,500",
            invoices: [
                { id: "INV-2026-001", description: "Initial Milestone: Discovery & Architecture Blueprint", amount: "$3,750", status: "Paid", date: "2026-06-10" },
                { id: "INV-2026-002", description: "Second Milestone: Alpha Engine Core & DB Integration", amount: "$5,000", status: "Pending", date: "2026-07-25" },
                { id: "INV-2026-003", description: "Final Milestone: Deployment, Handoff & Maintenance SLA", amount: "$3,750", status: "Upcoming", date: "2026-08-30" }
            ],
            agreements: [
                { name: "Master Services Agreement (MSA) v1.4", date: "2026-06-01", status: "Signed", url: "#" },
                { name: "Mutual Non-Disclosure Agreement (NDA)", date: "2026-05-28", status: "Signed", url: "#" }
            ]
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
                if (email.trim().toLowerCase() === '23eg510a07@anurag.edu.in') {
                    navigate("/portal/v-magnetic-minds");
                    return;
                }
                setClientEmail(email);
                fetchClientProjects(email).then(() => {
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
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
                <div className="rounded-3xl border border-border bg-card/90 px-6 py-7 shadow-sm md:px-8">
                    <div className="text-left">
                        <span className="text-xs uppercase font-bold text-primary tracking-[0.25em]">Siddhi Dynamics Portal</span>
                        <h1 className="text-3xl font-extrabold mt-1 text-foreground">
                            {clientOrg ? `${clientOrg} Dashboard` : "Your Project Workspace"}
                        </h1>
                        <p className="text-muted-foreground text-xs mt-1">
                            Authorized Representative: <span className="text-foreground font-semibold">{clientName || "Client"}</span> ({clientEmail})
                        </p>
                    </div>
                    
                    <div className="mt-5 flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="p-2.5 rounded-xl border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                            title="Sync Roadmap Progress"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>


                <GoogleReviewCard audience="client" name={clientName} compact />


                {projects.length === 0 ? (
                    <div className="text-center px-6 py-10 rounded-3xl border border-primary/20 bg-card shadow-sm space-y-6">
                        <img
                            src={projectSubmissionIllustration}
                            alt="Project roadmap ready for a new submission"
                            className="mx-auto w-full max-w-xl rounded-2xl object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => navigate('/submit?type=requirement')}
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                            Start Submitting Form
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Projects Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 rounded-2xl border border-border space-y-4 text-left">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Workloads</span>
                                    <Briefcase className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-3xl font-extrabold text-foreground">{projects.length}</p>
                            </div>

                            <div className="glass-card p-6 rounded-2xl border border-border space-y-4 text-left">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Active Roadmaps</span>
                                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <p className="text-3xl font-extrabold text-foreground">
                                    {projects.filter(p => p.status !== "Completed").length}
                                </p>
                            </div>

                            <div className="glass-card p-6 rounded-2xl border border-border space-y-4 text-left">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Completed Milestones</span>
                                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <p className="text-3xl font-extrabold text-foreground">
                                    {projects.filter(p => p.status === "Completed").length}
                                </p>
                            </div>
                        </div>

                        {/* Projects Breakdown List */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-foreground tracking-wide text-left">Active Delivery Roadmaps</h2>
                            
                            {projects.map((proj) => {
                                const meta = parseProjectMetadata(proj.bounty_reward);
                                const progressVal = proj.progress || 0;
                                const currentPhase = Math.ceil(progressVal / 20) || 1;

                                return (
                                    <div key={proj.id} className="glass-card overflow-hidden border border-border rounded-3xl p-6 md:p-8 space-y-6 text-left hover:border-primary/30 transition-all">
                                        
                                        {/* Project Meta Header */}
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                                    {proj.organization || "Custom Software Deployment"}
                                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                                                        proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                                        proj.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                                                        'bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border border-yellow-500/20'
                                                    }`}>{proj.status || 'Analyzing'}</span>
                                                </h3>
                                                <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mt-1">Roadmap ID: {proj.id.slice(0, 8)}</p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => openClientChat(proj)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-foreground font-semibold text-xs border border-border transition-all hover:scale-105"
                                                >
                                                    <MessageCircle className="w-3.5 h-3.5 text-primary" />
                                                    Chat Support / AI
                                                </button>
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
                                        </div>

                                        {/* Project Tabs Selector */}
                                        <div className="flex border-b border-border gap-6">
                                            {(['roadmap', 'payments', 'agreements'] as const).map((tab) => {
                                                const isActive = (projectTabs[proj.id] || 'roadmap') === tab;
                                                return (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setProjectTabs(prev => ({ ...prev, [proj.id]: tab }))}
                                                        className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                                            isActive
                                                                ? 'text-primary border-b-2 border-primary'
                                                                : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                    >
                                                        {tab === 'roadmap' ? 'Roadmap & Support' :
                                                         tab === 'payments' ? 'Budget & Payments' : 'Agreements & SLA'}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Tab Content Display */}
                                        <AnimatePresence mode="wait">
                                            {(projectTabs[proj.id] || 'roadmap') === 'roadmap' && (
                                                <motion.div
                                                    key="roadmap-tab"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-6"
                                                >
                                                    {/* Requirements / Description */}
                                                    <div className="space-y-2">
                                                        <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Project Scope & Requirements</h4>
                                                        <div className="bg-muted/50 rounded-2xl p-5 border border-border text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                                                            {proj.message}
                                                        </div>
                                                    </div>

                                                    {/* Development Roadmap Progress */}
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Neural Developmental Roadmap</span>
                                                            <span className="text-xs font-extrabold text-primary">PHASE {currentPhase} · {progressVal}% COMPLETED</span>
                                                        </div>
                                                        
                                                        {/* Progress Bar representation */}
                                                        <div className="space-y-2">
                                                            <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
                                                                <div
                                                                    className="absolute left-0 h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                                                                    style={{ width: `${progressVal}%` }}
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
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
                                                        {meta.deadline && (
                                                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                                                                <Calendar className="w-5 h-5 text-primary shrink-0" />
                                                                <div>
                                                                    <p className="text-[9px] text-muted-foreground font-bold uppercase">Target Milestone Deadline</p>
                                                                    <p className="text-sm font-bold text-foreground">{meta.deadline}</p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {meta.agreement && (
                                                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                                                                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                                <div>
                                                                    <p className="text-[9px] text-muted-foreground font-bold uppercase">Contractual Agreement & Support SLA</p>
                                                                    <p className="text-sm font-semibold text-foreground truncate max-w-xs" title={meta.agreement}>{meta.agreement}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {(projectTabs[proj.id] || 'roadmap') === 'payments' && (
                                                <motion.div
                                                    key="payments-tab"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-6"
                                                >
                                                    {/* Budget Stats Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-3.5">
                                                            <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                                                                <DollarSign className="w-5 h-5 text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Total Contract Value</p>
                                                                <p className="text-lg font-bold text-foreground mt-0.5">{meta.budget_total}</p>
                                                            </div>
                                                        </div>

                                                        <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-3.5">
                                                            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                                                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Milestones Disbursed</p>
                                                                <p className="text-lg font-bold text-foreground mt-0.5">{meta.budget_paid}</p>
                                                            </div>
                                                        </div>

                                                        <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-3.5">
                                                            <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                                                                <Receipt className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Retainer / Outstanding</p>
                                                                <p className="text-lg font-bold text-foreground mt-0.5">
                                                                    {`$${(parseInt(meta.budget_total.replace(/[^0-9]/g, '')) - parseInt(meta.budget_paid.replace(/[^0-9]/g, ''))).toLocaleString()}`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Invoices Table */}
                                                    <div className="space-y-2">
                                                        <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Milestone Disbursement Schedule</h4>
                                                        <div className="overflow-x-auto border border-border rounded-2xl bg-muted/30">
                                                            <table className="w-full text-left border-collapse">
                                                                <thead>
                                                                    <tr className="border-b border-border bg-muted/50 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                                                                        <th className="p-4">Invoice ID</th>
                                                                        <th className="p-4">Milestone Phase</th>
                                                                        <th className="p-4">Amount</th>
                                                                        <th className="p-4">Due Date</th>
                                                                        <th className="p-4">Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-border text-xs">
                                                                    {meta.invoices.map((inv: any, idx: number) => (
                                                                        <tr key={inv.id || idx} className="hover:bg-muted/30 transition-colors">
                                                                            <td className="p-4 font-mono text-foreground font-semibold">{inv.id}</td>
                                                                            <td className="p-4 text-foreground font-medium">{inv.description}</td>
                                                                            <td className="p-4 text-foreground font-bold">{inv.amount}</td>
                                                                            <td className="p-4 text-muted-foreground">{inv.date}</td>
                                                                            <td className="p-4">
                                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                                    inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                                                                    inv.status === 'Pending' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                                                                                    'bg-slate-500/10 text-muted-foreground border border-border'
                                                                                }`}>
                                                                                    {inv.status}
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

                                            {(projectTabs[proj.id] || 'roadmap') === 'agreements' && (
                                                <motion.div
                                                    key="agreements-tab"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-4 text-left"
                                                >
                                                    <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Executed Legal Agreements</h4>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {meta.agreements.map((doc: any, idx: number) => (
                                                            <div 
                                                                key={idx} 
                                                                className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted border border-border rounded-2xl transition-all"
                                                            >
                                                                <div className="flex items-center gap-3.5">
                                                                    <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                                                        <FileText className="w-5 h-5 text-emerald-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-foreground">{doc.name}</p>
                                                                        <p className="text-[10px] text-muted-foreground mt-0.5">Signed: {doc.date} · Secure Vault Executed</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/5 border border-emerald-500/20 rounded">
                                                                        {doc.status}
                                                                    </span>
                                                                    <button 
                                                                        onClick={() => toast.success(`Downloading ${doc.name} secure archive...`)}
                                                                        className="p-2 rounded-xl border border-border bg-muted/50 hover:bg-muted text-foreground hover:text-foreground transition-all cursor-pointer"
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            {/* ====== CLIENT CHAT PANEL ====== */}
            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                        onClick={() => setChatOpen(null)}
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-lg h-[75vh] bg-[#0a0a0f] border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl shadow-primary/10"
                        >
                            {/* Chat Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-sm text-foreground">Siddhi AI Support Hub</p>
                                        <p className="text-xs text-muted-foreground">{chatOpen.organization || "Project Workspace"}</p>
                                    </div>
                                </div>
                                <button onClick={() => setChatOpen(null)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#0b141a] no-scrollbar">
                                {chatLoading ? (
                                    <div className="flex items-center justify-center h-full text-[#8696a0]">
                                        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading chat...
                                    </div>
                                ) : chatMessages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-[#8696a0] text-center gap-2 px-6">
                                        <Sparkles className="w-10 h-10 text-primary animate-pulse mb-2" />
                                        <p className="font-semibold text-white">Welcome to Siddhi Support Hub</p>
                                        <p className="text-xs max-w-xs leading-relaxed text-center">Ask any questions about your project scope, targets, or custom requirements. Our AI assistant will answer based on our internal files.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {chatMessages.map((msg: any) => {
                                            const isAI = msg.sender_email === 'ai@siddhidynamics.in';
                                            const isAdminMsg = msg.is_admin && !isAI;
                                            const isUserMsg = !msg.is_admin;
                                            
                                            return (
                                                <div 
                                                    key={msg.id} 
                                                    className={`flex ${isUserMsg ? 'justify-end' : 'justify-start'} w-full`}
                                                >
                                                    <div className="flex items-start gap-2.5 max-w-[80%]">
                                                        {!isUserMsg && (
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                                                isAI ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'
                                                            }`}>
                                                                {isAI ? <Sparkles className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col text-left">
                                                            <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                                                                isUserMsg 
                                                                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                                                    : isAI
                                                                        ? 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
                                                                        : 'bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-tl-none'
                                                            }`}>
                                                                {msg.message}
                                                            </div>
                                                            <span className="text-[9px] text-muted-foreground/60 mt-1 self-start">
                                                                {format(new Date(msg.created_at), 'HH:mm')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                                <input
                                    type="text"
                                    placeholder={sendingMsg ? "AI is typing..." : "Type your message here..."}
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                                    disabled={sendingMsg}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                />
                                <button
                                    onClick={sendChatMessage}
                                    disabled={!chatInput.trim() || sendingMsg}
                                    className="bg-primary text-primary-foreground p-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center shrink-0"
                                >
                                    {sendingMsg ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

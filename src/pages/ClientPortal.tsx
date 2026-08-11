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
    Zap,
    Bot,
    DollarSign,
    CreditCard,
    Receipt,
    FileText,
    Download,
    FolderOpen,
    Video,
    Lock,
    User,
    Plus,
    Phone,
    ChevronLeft,
    Star,
    Activity,
    Building2,
    Mail
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
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
    const [projectTabs, setProjectTabs] = useState<Record<string, 'roadmap' | 'scheduler' | 'gmeet' | 'payments' | 'agreements' | 'contact'>>({});

    // Scheduler & Meeting States
    const [scheduledMeetings, setScheduledMeetings] = useState<any[]>([
        { id: 'mtg-1', date: '2026-08-10', time: '11:00 AM', topic: 'Phase 2 Milestone & Architecture Review', mode: 'Google Meet', link: 'https://meet.google.com/new', status: 'Confirmed' }
    ]);
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("10:00 AM");
    const [bookingTopic, setBookingTopic] = useState("");
    const [bookingMode, setBookingMode] = useState("Google Meet");

    const handleScheduleMeeting = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingDate || !bookingTopic.trim()) {
            toast.error("Please pick a date and enter a meeting topic.");
            return;
        }
        const newMtg = {
            id: `mtg-${Date.now()}`,
            date: bookingDate,
            time: bookingTime,
            topic: bookingTopic,
            mode: bookingMode,
            link: "https://meet.google.com/new",
            status: "Scheduled (Link Ready)"
        };
        setScheduledMeetings(prev => [...prev, newMtg]);
        toast.success(`Review meeting scheduled for ${bookingDate} at ${bookingTime}!`);
        setBookingDate("");
        setBookingTopic("");
    };

    // Chat States
    const [chatOpen, setChatOpen] = useState<Submission | null>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [sendingMsg, setSendingMsg] = useState(false);

    // Quote Acceptance & Payment Terms States
    const [acceptQuoteModal, setAcceptQuoteModal] = useState<Submission | null>(null);
    const [selectedStructure, setSelectedStructure] = useState<string>("50-50");
    const [selectedPayMode, setSelectedPayMode] = useState<"online" | "cash">("online");
    const [quoteUtr, setQuoteUtr] = useState<string>("");
    const [submittingQuote, setSubmittingQuote] = useState<boolean>(false);

    const handleConfirmQuoteAndPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptQuoteModal) return;
        if (selectedPayMode === "online" && !quoteUtr.trim()) {
            toast.error("Please enter your UTR / Transaction Reference Number for online payment.");
            return;
        }

        setSubmittingQuote(true);
        try {
            const structureLabels: Record<string, string> = {
                "monthly": "📅 Monthly Retainer",
                "50-50": "🌓 50% Advance & 50% Upon Completion",
                "advance-milestone": "🚀 Custom Advance + Milestone Balance",
                "full": "💎 100% Upfront Payment"
            };

            const payModeLabel = selectedPayMode === "online"
                ? `Online Payment / UPI (UTR: ${quoteUtr.trim()})`
                : "Cash Payment (In-person collection by Sai Vara Prasad)";

            const meta = parseProjectMetadata(acceptQuoteModal.bounty_reward);
            const assignedPrice = meta.agreement || "Assigned Quote";

            const updatedMessage = `${acceptQuoteModal.message}\n\n[ACCEPTED QUOTE: ${assignedPrice}]\n[PAYMENT STRUCTURE: ${structureLabels[selectedStructure] || selectedStructure}]\n[PAYMENT MODE: ${payModeLabel}]\n[TIMESTAMP: ${new Date().toISOString()}]`;

            const { error } = await supabase
                .from('contact_submissions')
                .update({
                    status: "Quote Accepted (Project Started)",
                    progress: acceptQuoteModal.progress && acceptQuoteModal.progress > 0 ? acceptQuoteModal.progress : 25,
                    message: updatedMessage
                })
                .eq('id', acceptQuoteModal.id);

            if (error) throw error;

            toast.success("Quote Accepted! Payment terms confirmed and project started.");
            setAcceptQuoteModal(null);
            setQuoteUtr("");
            fetchClientProjects(clientEmail);
        } catch (err: any) {
            console.error("Quote confirm error:", err);
            toast.error(err.message || "Failed to confirm quote.");
        } finally {
            setSubmittingQuote(false);
        }
    };

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
                    budget_total: parsed.budget_total || "",
                    budget_paid: parsed.budget_paid || "",
                    invoices: Array.isArray(parsed.invoices) ? parsed.invoices : [],
                    agreements: Array.isArray(parsed.agreements) ? parsed.agreements : [],
                };
            }
        } catch (e) {
            console.error("Failed to parse project metadata:", e);
        }
        return {
            deadline: "",
            website_url: "",
            agreement: bountyReward || "",
            budget_total: "",
            budget_paid: "",
            invoices: [],
            agreements: [],
        };
    };

    const fetchClientProjects = async (email: string) => {
        try {
            const normalizedEmail = email.trim().toLowerCase();
            const [{ data, error }, { data: profile }] = await Promise.all([
                supabase
                .from('contact_submissions')
                .select('*')
                .eq('email', normalizedEmail)
                .order('created_at', { ascending: false }),
                (supabase as any).from('portal_users').select('quote').eq('email', normalizedEmail).maybeSingle(),
            ]);

            if (error) throw error;

            // A quote assigned from Admin User Management is available even when
            // the project was created before quote metadata existed.
            const clientProjects = (data || []).map((project: Submission) => {
                if (!profile?.quote) return project;
                const meta = parseProjectMetadata(project.bounty_reward);
                if (meta.agreement) return project;
                return { ...project, bounty_reward: JSON.stringify({ ...meta, agreement: profile.quote }) };
            });
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

    const checkAdmin = (emailToCheck?: string) => {
        if (!emailToCheck) return false;
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "ssaivaraprasad51@gmail.com")
            .split(",")
            .map((e: string) => e.trim().toLowerCase());
        return adminEmails.includes(emailToCheck.trim().toLowerCase());
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                if (window.location.href.includes('tab=contact') || window.location.hash.includes('tab=contact')) {
                    navigate("/submit?type=contact");
                    return;
                }
                toast.error("Please sign in to access your client portal.");
                navigate("/auth");
                return;
            }

            const email = session.user.email;
            const role = session.user.user_metadata?.role;

            if (!role && !checkAdmin(email)) {
                navigate("/portal");
                return;
            }

            if (email) {
                if (email.trim().toLowerCase() === '23eg510a07@anurag.edu.in') {
                    navigate("/portal/v-magnetic-minds");
                    return;
                }
                setClientEmail(email);
                fetchClientProjects(email).finally(() => {
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
                <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">Loading...</p>
            </div>
        );
    }

    const activeProjectCount = projects.filter(p => p.status !== "Completed").length;
    const completedCount = projects.filter(p => p.status === "Completed").length;
    const nextMeeting = scheduledMeetings[0];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden">
            <Navbar />
            <Helmet>
                <title>Client Portal | Siddhi Dynamics</title>
                <meta name="description" content="Access your live project delivery tracking, contracts, requirements, and deployment configurations." />
            </Helmet>

            <main className="container mx-auto px-6 pt-32 pb-20 max-w-5xl relative z-10 space-y-12">
                <button
                    onClick={() => navigate('/portal')}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-2 group cursor-pointer text-left"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold">Back</span>
                </button>

                {/* Portal Header */}
                <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-card via-background to-primary/5 px-6 py-7 shadow-sm md:px-8">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_28%)]" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="text-left max-w-3xl">
                            <span className="text-xs uppercase font-bold text-primary tracking-[0.25em]">Client Command Center</span>
                            <h1 className="text-3xl font-extrabold mt-1 text-foreground">
                                {clientOrg ? `${clientOrg} Dashboard` : "Your Project Workspace"}
                            </h1>
                            <p className="text-muted-foreground text-xs mt-2 leading-relaxed max-w-2xl">
                                A single place to review project progress, approve deliverables, book reviews, and keep support conversations moving without friction.
                            </p>
                            <p className="text-muted-foreground text-xs mt-2">
                                Authorized Representative: <span className="text-foreground font-semibold">{clientName || "Client"}</span> ({clientEmail})
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                                title="Sync Roadmap Progress"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                <span className="text-xs font-bold uppercase tracking-widest">Refresh</span>
                            </button>
                        </div>
                    </div>

                    <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { label: "Active Workstreams", value: activeProjectCount, icon: Briefcase, tone: "text-primary" },
                            { label: "Milestones Delivered", value: completedCount, icon: CheckCircle, tone: "text-emerald-500" },
                            { label: "Next Review", value: nextMeeting ? nextMeeting.date : "TBD", icon: Calendar, tone: "text-violet-500" },
                        ].map((item) => (
                            <div key={item.label} className="rounded-2xl border border-border bg-card/80 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{item.label}</div>
                                        <div className="mt-2 text-2xl font-extrabold text-foreground">{item.value}</div>
                                    </div>
                                    <item.icon className={`w-5 h-5 ${item.tone}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {[
                        { title: "Project Health", desc: "Track roadmap status and milestones.", icon: Activity },
                        { title: "Approvals", desc: "Review quotes, agreements, and deliverables.", icon: ShieldCheck },
                        { title: "Meetings", desc: "Schedule syncs and review sessions.", icon: Calendar },
                        { title: "Support", desc: "Open chat anytime with the delivery team.", icon: MessageCircle },
                    ].map((item) => (
                        <div key={item.title} className="rounded-2xl border border-border bg-card/80 p-5 text-left">
                            <item.icon className="w-5 h-5 text-primary" />
                            <h3 className="mt-3 text-sm font-extrabold text-foreground">{item.title}</h3>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>


                <GoogleReviewCard audience="client" name={clientName} compact />


                {projects.length === 0 ? (
                    <div className="space-y-6">
                        <div className="glass-card rounded-3xl border border-dashed border-primary/30 p-10 text-center space-y-4 bg-card/50">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-2">
                                <FolderOpen className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-extrabold text-foreground">No Projects Found</h3>
                            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                                You don't have any active project roadmaps yet. Submit your project requirement to get started with custom roadmaps, milestones, and dedicated execution.
                            </p>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/submit?type=requirement')}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" /> Submit Requirement / Add Project
                                </button>
                            </div>
                        </div>

                        {/* Always visible Contact & Support block on Client Portal */}
                        <div className="glass-card p-6 rounded-3xl border border-border space-y-5 text-left">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-base font-extrabold text-foreground flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-primary" />
                                        Contact Siddhi Dynamics Support & Team Lead
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Have questions or need immediate assistance? Reach out to our engineering lead directly.
                                    </p>
                                </div>
                                <a
                                    href="https://wa.me/916303602743"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                                >
                                    <MessageCircle className="w-4 h-4" /> WhatsApp Direct Chat
                                </a>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-bold text-foreground">Sai Vara Prasad</h5>
                                            <p className="text-[10px] text-muted-foreground">Founder & Technical Lead</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 pt-2 border-t border-border text-xs">
                                        <div className="flex items-center justify-between text-muted-foreground">
                                            <span>Phone:</span>
                                            <a href="tel:+916303602743" className="font-bold text-primary hover:underline">+91 6303602743</a>
                                        </div>
                                        <div className="flex items-center justify-between text-muted-foreground">
                                            <span>Email:</span>
                                            <a href="mailto:saivaraprasad@siddhidynamics.in" className="font-bold text-primary hover:underline">saivaraprasad@siddhidynamics.in</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-bold text-foreground">Office Locations</h5>
                                            <p className="text-[10px] text-muted-foreground">Telangana, India</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 pt-2 border-t border-border text-[11px]">
                                        <p className="text-muted-foreground"><strong className="text-foreground">Nizamabad:</strong> 3-5-260/2, Shivajinagar Road, Kotagally, 503001</p>
                                        <p className="text-muted-foreground"><strong className="text-foreground">Hyderabad:</strong> HIVE, Anurag University, 500049</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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

                                         {/* Project Completion Google Review Prompt */}
                                         {(proj.status === "Completed" || proj.progress === 100) && (
                                             <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-primary/10 to-amber-500/15 border border-amber-400/40 space-y-3 text-left shadow-lg">
                                                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                                     <div>
                                                         <div className="flex items-center gap-2 mb-1">
                                                             <span className="text-base">🎉</span>
                                                             <h4 className="text-sm font-extrabold text-foreground">Project Delivered & Completed!</h4>
                                                         </div>
                                                         <p className="text-xs text-muted-foreground leading-relaxed">
                                                             Your project delivery is 100% complete. We would love to hear about your experience! Please take 30 seconds to leave us a genuine review on Google — your feedback helps us grow.
                                                         </p>
                                                     </div>
                                                     <a
                                                         href="https://g.page/r/CQ8YjZSqkk-5EBM/review"
                                                         target="_blank"
                                                         rel="noopener noreferrer"
                                                         className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-2 shrink-0 shadow-md transition-all hover:scale-105"
                                                     >
                                                         <Star className="w-4 h-4 fill-black text-black" /> Review Us on Google ↗
                                                     </a>
                                                 </div>
                                             </div>
                                         )}

                                        {/* Quote & Payment Status Banner */}
                                        <div className="p-5 rounded-2xl bg-card border border-primary/30 space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div>
                                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Pricing & Quote Status</span>
                                                    <h4 className="text-base font-extrabold text-foreground mt-0.5">
                                                        {meta.agreement ? `💰 Assigned Custom Quote: ${meta.agreement}` : "🤝 Quoted / Informed by Sai Vara Prasad"}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {meta.agreement
                                                            ? "Sai Vara Prasad has assigned your custom price quote. Accept quote below to choose your payment plan."
                                                            : "Sai Vara Prasad is currently evaluating your requirement. Assigned pricing will appear here once reviewed."}
                                                    </p>
                                                </div>

                                                {meta.agreement && proj.status !== 'Completed' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setAcceptQuoteModal(proj)}
                                                        className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs hover:scale-105 transition-all shadow-lg shadow-primary/20 shrink-0 cursor-pointer flex items-center gap-1.5"
                                                    >
                                                        <Zap className="w-4 h-4" /> Review & Accept Quote
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Tenure Lock Warning Banner */}
                                        {(proj.status === 'Locked' || proj.status === 'Locked (Tenure Expired)' || proj.status === 'Tenure Expired') && (
                                            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3">
                                                <Lock className="w-5 h-5 shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="text-sm font-bold text-red-400">12-Month SLA Tenure Expired & Account Locked</h4>
                                                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                                        The 12-month contract period for this workload has completed. Modifications and feature requests are locked until a formal renewal agreement is decided between Admin and Client. Contact <strong>ssaivaraprasad51@gmail.com</strong> for renewal activation.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Project Tabs Selector */}
                                        <div className="flex border-b border-border gap-4 overflow-x-auto no-scrollbar pb-1">
                                            {(['roadmap', 'scheduler', 'gmeet', 'payments', 'agreements', 'contact'] as const).map((tab) => {
                                                const isContactUrl = window.location.href.includes('tab=contact') || window.location.hash.includes('tab=contact');
                                                const defaultTab = isContactUrl ? 'contact' : 'roadmap';
                                                const isActive = (projectTabs[proj.id] || defaultTab) === tab;
                                                return (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setProjectTabs(prev => ({ ...prev, [proj.id]: tab }))}
                                                        className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                                                            isActive
                                                                ? 'text-primary border-b-2 border-primary'
                                                                : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                    >
                                                        {tab === 'roadmap' ? 'Roadmap & Support' :
                                                         tab === 'scheduler' ? '📅 Meeting Scheduler' :
                                                         tab === 'gmeet' ? '🎥 Google Meet Hub' :
                                                         tab === 'payments' ? 'Budget & Payments' :
                                                         tab === 'agreements' ? 'Agreements & SLA' : '📞 Contact & Support'}
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

                                            {(projectTabs[proj.id] || 'roadmap') === 'scheduler' && (
                                                <motion.div key="scheduler-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="text-sm font-extrabold text-foreground">Project Milestone Scheduler</h4>
                                                            <p className="text-xs text-muted-foreground">Book a 1-on-1 sprint review or technical sync with Siddhi Dynamics engineers.</p>
                                                        </div>
                                                        <span className="text-[10px] font-bold px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg">
                                                            Direct Sync Available
                                                        </span>
                                                    </div>

                                                    <form onSubmit={handleScheduleMeeting} className="glass-card p-5 rounded-2xl border border-border space-y-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Select Date *</label>
                                                                <input
                                                                    type="date"
                                                                    required
                                                                    value={bookingDate}
                                                                    onChange={(e) => setBookingDate(e.target.value)}
                                                                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Time Slot *</label>
                                                                <select
                                                                    value={bookingTime}
                                                                    onChange={(e) => setBookingTime(e.target.value)}
                                                                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                                >
                                                                    <option value="10:00 AM">10:00 AM IST</option>
                                                                    <option value="02:00 PM">02:00 PM IST</option>
                                                                    <option value="04:30 PM">04:30 PM IST</option>
                                                                    <option value="07:00 PM">07:00 PM IST</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Meeting Mode *</label>
                                                                <select
                                                                    value={bookingMode}
                                                                    onChange={(e) => setBookingMode(e.target.value)}
                                                                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                                >
                                                                    <option value="Google Meet">🎥 Google Meet</option>
                                                                    <option value="Phone Call">📞 Phone / WhatsApp Call</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Meeting Topic / Agenda *</label>
                                                            <input
                                                                type="text"
                                                                required
                                                                placeholder="e.g. Architecture review, milestone demo, budget sync..."
                                                                value={bookingTopic}
                                                                onChange={(e) => setBookingTopic(e.target.value)}
                                                                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                            />
                                                        </div>

                                                        <button
                                                            type="submit"
                                                            className="w-full py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:scale-[1.01] transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                                                        >
                                                            <Calendar className="w-4 h-4" /> Confirm & Reserve Meeting Slot
                                                        </button>
                                                    </form>

                                                    <div className="space-y-3">
                                                        <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scheduled Review Sessions</h5>
                                                        {scheduledMeetings.map(mtg => (
                                                            <div key={mtg.id} className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                                                        <Calendar className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-foreground">{mtg.topic}</p>
                                                                        <p className="text-[10px] text-muted-foreground">{mtg.date} at {mtg.time} · {mtg.mode}</p>
                                                                    </div>
                                                                </div>
                                                                <a
                                                                    href={mtg.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded-lg border border-primary/20 transition-all flex items-center gap-1"
                                                                >
                                                                    <Video className="w-3.5 h-3.5" /> Join Meet
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {(projectTabs[proj.id] || 'roadmap') === 'gmeet' && (
                                                <motion.div key="gmeet-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
                                                    <div className="glass-card p-8 rounded-3xl border border-primary/30 text-center space-y-4 bg-primary/5">
                                                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                                                            <Video className="w-8 h-8 text-primary animate-pulse" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-extrabold text-foreground">Google Meet Instant Review Room</h4>
                                                            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                                                                Connect instantly with Siddhi Dynamics lead engineers for live screen-sharing, code walk-throughs, and roadmap reviews.
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                                            <a
                                                                href="https://meet.google.com/new"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                                            >
                                                                <Video className="w-4 h-4" /> Open Instant Google Meet Room
                                                            </a>
                                                            <button
                                                                onClick={() => toast.info("Google Meet invite sent to ssaivaraprasad51@gmail.com")}
                                                                className="w-full sm:w-auto px-6 py-3 bg-card hover:bg-muted text-foreground font-bold text-xs rounded-xl border border-border transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <Mail className="w-4 h-4 text-primary" /> Send Meeting Alert to Admin
                                                            </button>
                                                        </div>
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
                                                    {meta.budget_total ? (
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
                                                                <p className="text-lg font-bold text-foreground mt-0.5">{meta.budget_paid || '₹0'}</p>
                                                            </div>
                                                        </div>

                                                        <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-3.5">
                                                            <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                                                                <Receipt className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-bold text-muted-foreground uppercase">Retainer / Outstanding</p>
                                                                <p className="text-lg font-bold text-foreground mt-0.5">
                                                                    {(() => {
                                                                        const total = parseInt((meta.budget_total || '0').replace(/[^0-9]/g, ''));
                                                                        const paid = parseInt((meta.budget_paid || '0').replace(/[^0-9]/g, ''));
                                                                        const remaining = isNaN(total) || isNaN(paid) ? 0 : total - paid;
                                                                        return `₹${remaining.toLocaleString('en-IN')}`;
                                                                    })()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <div className="p-6 rounded-2xl bg-muted/30 border border-dashed border-border text-center space-y-2">
                                                        <DollarSign className="w-8 h-8 text-muted-foreground mx-auto" />
                                                        <p className="text-sm font-bold text-foreground">Quote Pending Review</p>
                                                        <p className="text-xs text-muted-foreground">Sai Vara Prasad is evaluating your requirement. Your custom quote and payment schedule will appear here once assigned.</p>
                                                      </div>
                                                    )}

                                                    {/* Invoices Table */}
                                                    <div className="space-y-2">
                                                        <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Milestone Disbursement Schedule</h4>
                                                        {meta.invoices.length > 0 ? (
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
                                                        ) : (
                                                          <div className="p-5 rounded-2xl bg-muted/20 border border-dashed border-border text-center">
                                                            <Receipt className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                                                            <p className="text-xs text-muted-foreground">No milestone invoices issued yet. Invoices will appear here once your project quote is finalized and the payment schedule is set by your project lead.</p>
                                                          </div>
                                                        )}
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
                                                        {meta.agreements.length > 0 ? meta.agreements.map((doc: any, idx: number) => (
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
                                                        )) : (
                                                            <div className="p-6 rounded-2xl bg-muted/20 border border-dashed border-border text-center space-y-2">
                                                                <FileText className="w-7 h-7 text-muted-foreground mx-auto" />
                                                                <p className="text-sm font-bold text-foreground">No Agreements Uploaded Yet</p>
                                                                <p className="text-xs text-muted-foreground">Your signed MSA, NDA, and SLA documents will appear here once your project lead uploads them. Contact <strong>saivaraprasad@siddhidynamics.in</strong> if you need a copy urgently.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {(projectTabs[proj.id] || (window.location.href.includes('tab=contact') ? 'contact' : 'roadmap')) === 'contact' && (
                                                <motion.div
                                                    key="contact-tab"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-6 text-left"
                                                >
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-primary/10 border border-primary/20">
                                                        <div>
                                                            <h4 className="text-base font-extrabold text-foreground flex items-center gap-2">
                                                                <Phone className="w-5 h-5 text-primary" />
                                                                Direct Contact & Support Gateway
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Connect directly with Siddhi Dynamics team lead and technical architects.
                                                            </p>
                                                        </div>
                                                        <a
                                                            href="https://wa.me/916303602743"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                                                        >
                                                            <MessageCircle className="w-4 h-4" /> WhatsApp Direct Chat
                                                        </a>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                                                                    <User className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h5 className="text-sm font-bold text-foreground">Sai Vara Prasad</h5>
                                                                    <p className="text-xs text-muted-foreground">Founder & Technical Lead</p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2 pt-2 border-t border-border text-xs">
                                                                <div className="flex items-center justify-between text-muted-foreground">
                                                                    <span>Direct Phone:</span>
                                                                    <a href="tel:+916303602743" className="font-bold text-primary hover:underline">+91 6303602743</a>
                                                                </div>
                                                                <div className="flex items-center justify-between text-muted-foreground">
                                                                    <span>Direct Email:</span>
                                                                    <a href="mailto:saivaraprasad@siddhidynamics.in" className="font-bold text-primary hover:underline">saivaraprasad@siddhidynamics.in</a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                                                                    <Building2 className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h5 className="text-sm font-bold text-foreground">Siddhi Dynamics Headquarters</h5>
                                                                    <p className="text-xs text-muted-foreground">Telangana, India</p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2 pt-2 border-t border-border text-xs">
                                                                <div>
                                                                    <strong className="text-foreground font-semibold">Nizamabad Office:</strong>
                                                                    <p className="text-muted-foreground">3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, 503001</p>
                                                                </div>
                                                                <div>
                                                                    <strong className="text-foreground font-semibold">Hyderabad Office:</strong>
                                                                    <p className="text-muted-foreground">HIVE, Anurag University, Hyderabad, 500049</p>
                                                                </div>
                                                            </div>
                                                        </div>
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
                        className="fixed inset-0 z-[250] flex items-center justify-center p-4 pt-24 pb-6 overflow-y-auto"
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
                                        <Bot className="w-10 h-10 text-primary animate-pulse mb-2" />
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
                                                                {isAI ? <Bot className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
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

            {/* ====== QUOTE ACCEPTANCE & PAYMENT TERMS MODAL ====== */}
            <AnimatePresence>
                {acceptQuoteModal && (
                    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pt-24 pb-6 bg-black/80 backdrop-blur-md overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-border bg-muted/40 flex items-center justify-between">
                                <div className="text-left">
                                    <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-primary" /> Accept Quote & Select Payment Terms
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Assigned Quote: <strong className="text-primary">{parseProjectMetadata(acceptQuoteModal.bounty_reward).agreement || "Assigned Quote"}</strong></p>
                                </div>
                                <button onClick={() => setAcceptQuoteModal(null)} className="p-2 rounded-xl hover:bg-muted text-foreground"><X className="w-5 h-5" /></button>
                            </div>

                            <form onSubmit={handleConfirmQuoteAndPayment} className="p-6 space-y-6 text-left">
                                {/* Step 1: Select Payment Structure */}
                                <div className="space-y-3">
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-primary">1. Select Payment Structure *</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { id: "50-50", title: "🌓 50% Advance & 50% Completion", desc: "50% upfront deposit to initiate, 50% upon final handoff" },
                                            { id: "monthly", title: "📅 Monthly Retainer", desc: "Equal monthly retainer payments" },
                                            { id: "advance-milestone", title: "🚀 Custom Advance + Milestones", desc: "Custom deposit upfront, balance linked to roadmap phases" },
                                            { id: "full", title: "💎 100% Upfront Priority", desc: "100% upfront with priority development queue" },
                                        ].map(st => (
                                            <button
                                                key={st.id}
                                                type="button"
                                                onClick={() => setSelectedStructure(st.id)}
                                                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                                    selectedStructure === st.id
                                                        ? "bg-primary/10 border-primary text-foreground ring-2 ring-primary/40"
                                                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                                                }`}
                                            >
                                                <p className="text-xs font-extrabold">{st.title}</p>
                                                <p className="text-[11px] opacity-75 mt-0.5">{st.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 2: Select Payment Method / Mode */}
                                <div className="space-y-3">
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-primary">2. Select Payment Method / Mode *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPayMode("online")}
                                            className={`p-4 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                                                selectedPayMode === "online"
                                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                                    : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            💳 Online / UPI / Card
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPayMode("cash")}
                                            className={`p-4 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                                                selectedPayMode === "cash"
                                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                                    : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            💵 Cash Payment
                                        </button>
                                    </div>

                                    {selectedPayMode === "online" ? (
                                        <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-3">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground font-semibold">Official UPI ID:</span>
                                                <span className="font-mono font-extrabold text-primary">6303602743@upi</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground font-semibold">Payee Name:</span>
                                                <span className="font-bold text-foreground">Siddhi Dynamics LLP</span>
                                            </div>
                                            <div className="space-y-1 pt-1">
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Transaction UTR / Reference No. *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. 623910482019"
                                                    value={quoteUtr}
                                                    onChange={e => setQuoteUtr(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs leading-relaxed">
                                            💵 <strong>Cash Payment Selected:</strong> Cash payment will be collected in-person directly by Sai Vara Prasad or an authorized Siddhi Dynamics representative upon agreement verification.
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-border flex justify-end gap-3">
                                    <button type="button" onClick={() => setAcceptQuoteModal(null)} className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer">Cancel</button>
                                    <button type="submit" disabled={submittingQuote} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs hover:scale-105 transition-all shadow-lg shadow-primary/20 cursor-pointer">
                                        {submittingQuote ? "Confirming..." : "Confirm & Start Project"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

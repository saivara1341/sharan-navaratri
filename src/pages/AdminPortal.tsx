import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseService } from "@/services/supabaseService";

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
    RefreshCw,
    ArrowUpDown,
    MessageCircle,
    Send,
    X,
    Edit3,
    Paperclip,
    FileText,
    Download
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
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
    is_public?: boolean;
    bounty_reward?: string;
}

const AdminPortal = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [chatOpen, setChatOpen] = useState<Submission | null>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [sendingMsg, setSendingMsg] = useState(false);

    // Document attachments states & helper
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachmentDropdownOpen, setAttachmentDropdownOpen] = useState(false);

    const parseAttachment = (text: string) => {
        if (text && text.startsWith('[ATTACHMENT:')) {
            const match = text.match(/^\[ATTACHMENT:([^|]+)\|([^\]]+)\](.*)/s);
            if (match) {
                return {
                    isAttachment: true,
                    fileName: match[1],
                    fileUrl: match[2],
                    additionalText: match[3] ? match[3].trim() : ''
                };
            }
        }
        return { isAttachment: false, fileName: '', fileUrl: '', additionalText: text };
    };

    const handleAttachmentSelect = (fileName: string, fileUrl: string) => {
        setChatInput(`[ATTACHMENT:${fileName}|${fileUrl}] Here is the requested document for your project.`);
        setAttachmentDropdownOpen(false);
        toast.success(`Attached template: ${fileName}`);
    };

    const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const mockUrl = `https://siddhidynamics.com/uploads/${encodeURIComponent(file.name)}`;
        setChatInput(`[ATTACHMENT:${file.name}|${mockUrl}] Shared file: ${file.name}`);
        setAttachmentDropdownOpen(false);
        toast.success(`Custom file attached: ${file.name}`);
    };

    const [editOpen, setEditOpen] = useState<Submission | null>(null);
    const [editStatus, setEditStatus] = useState("");
    const [editProgress, setEditProgress] = useState(0);
    const [updatingSub, setUpdatingSub] = useState(false);

    const navigate = useNavigate();

    // Check for admin session strictly via Supabase Auth
    // Check for admin session strictly via Mock Service
    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("Please login to access the Admin HQ.");
                navigate("/auth");
                return;
            }

            const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "ssaivaraprasad51@gmail.com").split(",");
            if (!user.email || !adminEmails.includes(user.email)) {
                toast.error("Access Refused: You do not have administrative privileges.");
                navigate("/");
                return;
            }

            // Authorized
            fetchSubmissions();
        };

        checkAdmin();
    }, [navigate]);

    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchSubmissions = async () => {
        setLoading(true);
        setFetchError(null);

        try {
            // Add cache-buster to ensure we bypass any 'Invalid Key' cached responses
            const data = await supabaseService.getSubmissions(undefined, Date.now().toString());
            setSubmissions(data || []);
            if (!data || data.length === 0) {
                console.log("AdminHQ: Connection successful but database returned 0 records.");
            }
        } catch (error: any) {
            console.error("Fetch Failure:", error);
            setFetchError(error.message || "Unknown error");
            toast.error("Failed to fetch submissions");
        } finally {
            setLoading(false);
        }
    };

    // We call this inside the useEffect now

    const filteredSubmissions = submissions
        .filter(s => {
            const matchesFilter = filter === "all" || s.inquiry_type === filter;
            const matchesSearch =
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.message.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
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

    const openChat = async (sub: Submission) => {
        setChatOpen(sub);
        setChatLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase as any)
                .from('chat_messages')
                .select('*')
                .eq('submission_id', sub.id)
                .order('created_at', { ascending: true });
            if (error) throw error;
            setChatMessages(data || []);
        } catch {
            toast.error("Could not load chat. Make sure the chat_messages table exists in Supabase.");
        } finally {
            setChatLoading(false);
        }
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim() || !chatOpen) return;
        setSendingMsg(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase as any)
                .from('chat_messages')
                .insert([{
                    submission_id: chatOpen.id,
                    sender_email: (import.meta.env.VITE_ADMIN_EMAILS || "ssaivaraprasad51@gmail.com").split(",")[0],
                    message: chatInput.trim(),
                    is_admin: true
                }])
                .select();
            if (error) throw error;
            setChatMessages(prev => [...prev, ...(data || [])]);
            setChatInput("");
        } catch {
            toast.error("Failed to send message.");
        } finally {
            setSendingMsg(false);
        }
    };

    const openEdit = (sub: Submission) => {
        setEditOpen(sub);
        setEditStatus(sub.status || "Analyzing");
        setEditProgress(sub.progress || 0);
    };

    const handleUpdateSubmission = async () => {
        if (!editOpen) return;
        setUpdatingSub(true);
        try {
            await supabaseService.updateSubmission(editOpen.id, {
                status: editStatus,
                progress: editProgress
            });
            toast.success("Submission updated successfully");
            setEditOpen(null);
            fetchSubmissions(); // Refresh the list
        } catch (error: any) {
            toast.error(`Update failed: ${error.message}`);
        } finally {
            setUpdatingSub(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />
            <Helmet>
                <title>Nexus Admin HQ | Siddhi Dynamics</title>
                <meta name="description" content="Administrative control center for Siddhi Dynamics. Monitor deep-tech innovations and manage project inquiries." />
            </Helmet>

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
                    </div>
                </div>

                {/* Error Banner */}
                {fetchError && (
                    <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">⚠️</div>
                        <div className="flex-1">
                            <p className="font-semibold text-red-300 mb-1">Data Fetch Failed</p>
                            <pre className="text-xs whitespace-pre-wrap text-red-400/80 font-mono">{fetchError}</pre>
                        </div>
                        <button
                            onClick={() => setFetchError(null)}
                            className="shrink-0 text-red-400 hover:text-red-200 transition-colors text-lg leading-none"
                        >×</button>
                    </div>
                )}

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
                        <div className="relative group min-w-[140px]">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                className="w-full appearance-none bg-white/5 border border-white/10 text-foreground text-sm rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer hover:bg-white/10"
                            >
                                <option value="newest" className="bg-[#111] text-foreground">Sort: Newest</option>
                                <option value="oldest" className="bg-[#111] text-foreground">Sort: Oldest</option>
                            </select>
                            <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
                        </div>
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
                                                    <div className="space-y-3 py-2">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Development Phase</span>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                                                                PHASE {Math.ceil((sub.progress || 0) / 20) || 1}
                                                            </span>
                                                        </div>
                                                        <div className="relative h-6 flex items-center">
                                                            <div className="absolute left-0 right-0 h-[1px] bg-white/5 z-0" />
                                                            <div className="flex justify-between w-full relative z-10">
                                                                {[1, 2, 3, 4, 5].map((p) => {
                                                                    const isActive = p <= (sub.progress || 0) / 20;
                                                                    const isCurrent = p === Math.ceil((sub.progress || 0) / 20);
                                                                    return (
                                                                        <div key={p} className="flex flex-col items-center">
                                                                            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-white/10'
                                                                                } ${isCurrent ? 'scale-125' : ''}`} />
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${sub.progress}%` }}
                                                                className="absolute left-0 h-[1px] bg-primary/50 z-0"
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
                                                    onClick={() => openChat(sub)}
                                                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:scale-105 transition-transform text-sm"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    Chat
                                                </button>
                                                <button
                                                    onClick={() => openEdit(sub)}
                                                    className="px-5 py-2.5 rounded-xl bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground font-semibold flex items-center gap-2 transition-all text-sm border border-white/10"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => window.open(`mailto:${sub.email}?subject=Regarding your ${getInquiryLabel(sub.inquiry_type)} on Siddhi Dynamics`)}
                                                    className="px-5 py-2.5 rounded-xl bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground font-semibold flex items-center gap-2 transition-all text-sm border border-white/10"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                    Gmail
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

            {/* ====== IN-APP CHAT PANEL ====== */}
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
                                    <div>
                                        <p className="font-semibold text-sm text-foreground">{chatOpen.name}</p>
                                        <p className="text-xs text-muted-foreground">{chatOpen.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setChatOpen(null)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#0b141a]">
                                {chatLoading ? (
                                    <div className="flex items-center justify-center h-full text-[#8696a0]">
                                        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading chat...
                                    </div>
                                ) : chatMessages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-[#8696a0] text-center gap-2">
                                        <MessageCircle className="w-10 h-10 opacity-30 text-primary animate-pulse" />
                                        <p className="text-sm">No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    chatMessages.map((msg: any) => {
                                        const isSelf = msg.is_admin;
                                        const parsed = parseAttachment(msg.message);
                                        return (
                                            <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                                                {!isSelf && (
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20 text-[10px] font-bold text-primary mb-1">
                                                        {chatOpen.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className={`relative max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-md border-t ${
                                                    isSelf 
                                                        ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none border-emerald-500/10' 
                                                        : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border-white/5'
                                                }`}>
                                                    {parsed.isAttachment ? (
                                                        <div className="space-y-2">
                                                            {/* Attachment Card */}
                                                            <a 
                                                                href={parsed.fileUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-xl hover:bg-black/60 transition-colors cursor-pointer group text-left"
                                                            >
                                                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                                                                    <FileText className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-bold text-xs text-slate-200 line-clamp-1 group-hover:text-primary transition-colors">{parsed.fileName}</p>
                                                                    <p className="text-[10px] text-muted-foreground">PDF Document • Click to Open</p>
                                                                </div>
                                                                <div className="text-muted-foreground hover:text-foreground">
                                                                    <Download className="w-4 h-4" />
                                                                </div>
                                                            </a>
                                                            {parsed.additionalText && (
                                                                <p className="leading-relaxed whitespace-pre-wrap">{parsed.additionalText}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                                    )}
                                                    <div className="flex items-center justify-end gap-1 text-[9px] text-[#8696a0] mt-1 text-right">
                                                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        {isSelf && (
                                                            <span className="text-emerald-400 font-bold ml-1">✓✓</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-white/10 bg-[#1f2c34]">
                                <div className="flex items-center gap-3">
                                    {/* Paperclip Sharing Menu */}
                                    <div className="relative shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setAttachmentDropdownOpen(!attachmentDropdownOpen)}
                                            className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                                            title="Share Quotation or Document Template"
                                        >
                                            <Paperclip className={`w-4 h-4 ${attachmentDropdownOpen ? 'text-primary rotate-45' : ''} transition-transform`} />
                                        </button>

                                        {/* Sharing Dropdown list */}
                                        <AnimatePresence>
                                            {attachmentDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-30" onClick={() => setAttachmentDropdownOpen(false)} />
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 15 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 15 }}
                                                        className="absolute bottom-14 left-0 w-80 bg-[#111b21] border border-white/10 rounded-2xl shadow-2xl p-2.5 z-40 space-y-1"
                                                    >
                                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-2 py-1">Share Document or Quotation</p>
                                                        
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAttachmentSelect('Project_Development_Proposal_Quotation.pdf', 'https://siddhidynamics.com/templates/Quotation_Template.pdf')}
                                                            className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-200 hover:text-primary transition-colors flex items-center gap-2"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-primary" />
                                                            <span className="truncate">Project Proposal & Quotation.pdf</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleAttachmentSelect('Siddhi_Dynamics_Service_Agreement.pdf', 'https://siddhidynamics.com/templates/Service_Agreement.pdf')}
                                                            className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-200 hover:text-primary transition-colors flex items-center gap-2"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-primary" />
                                                            <span className="truncate">Dynamics Service Agreement.pdf</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleAttachmentSelect('Non_Disclosure_Agreement_NDA.pdf', 'https://siddhidynamics.com/templates/NDA_Siddhi_Dynamics.pdf')}
                                                            className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-200 hover:text-primary transition-colors flex items-center gap-2"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-primary" />
                                                            <span className="truncate">NDA Template (Siddhi).pdf</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleAttachmentSelect('System_Architecture_Blueprint.pdf', 'https://siddhidynamics.com/templates/Architecture_Blueprint.pdf')}
                                                            className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-200 hover:text-primary transition-colors flex items-center gap-2"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-primary" />
                                                            <span className="truncate">System Architecture Blueprint.pdf</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-200 hover:text-primary transition-colors flex items-center gap-2 border-t border-white/5"
                                                        >
                                                            <Paperclip className="w-3.5 h-3.5 text-accent" />
                                                            <span>Upload Custom Document...</span>
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                        {/* Hidden file selector */}
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleCustomFileUpload} 
                                            className="hidden" 
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Type your message or quote..."
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                                        className="flex-1 bg-[#2a3942] border-none text-[#e9edef] rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-muted-foreground/60 transition-all"
                                    />
                                    <button
                                        onClick={sendChatMessage}
                                        disabled={!chatInput.trim() || sendingMsg}
                                        className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                    >
                                        {sendingMsg ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ====== EDIT SUBMISSION PANEL ====== */}
            <AnimatePresence>
                {editOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                        onClick={() => setEditOpen(null)}
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl shadow-primary/10"
                        >
                            {/* Edit Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Edit3 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg text-foreground">Update Status</p>
                                        <p className="text-xs text-muted-foreground">{editOpen.name}</p>
                                    </div>
                                </div>
                                <button onClick={() => setEditOpen(null)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Edit Content */}
                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Stage</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Analyzing', 'Verifying', 'In Progress', 'Validated', 'Completed'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setEditStatus(s)}
                                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${editStatus === s
                                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Neural Roadmap Phase</label>
                                        <span className="text-lg font-bold text-primary">Phase {Math.ceil(editProgress / 20) || 1}</span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-3">
                                        {[1, 2, 3, 4, 5].map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setEditProgress(p * 20)}
                                                className={`py-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${Math.ceil(editProgress / 20) === p
                                                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                                                        : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                                                    }`}
                                            >
                                                <span className="text-[10px] font-bold">P{p}</span>
                                                <div className={`w-1.5 h-1.5 rounded-full ${Math.ceil(editProgress / 20) === p ? 'bg-primary' : 'bg-white/20'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground text-center italic">
                                        Refining the progress into corporate-grade developmental milestones.
                                    </p>
                                </div>
                            </div>

                            {/* Edit Actions */}
                            <div className="p-6 border-t border-white/10 bg-white/5 flex gap-3">
                                <button
                                    onClick={() => setEditOpen(null)}
                                    className="flex-1 py-3 rounded-xl bg-white/5 text-foreground font-semibold hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateSubmission}
                                    disabled={updatingSub}
                                    className="flex-[2] py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {updatingSub ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPortal;

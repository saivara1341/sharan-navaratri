import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { supabaseService } from "@/services/supabaseService";
import { 
  Users, 
  LogOut, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  Save, 
  User, 
  Briefcase, 
  Layers, 
  Sliders, 
  Search, 
  RefreshCw, 
  ChevronRight, 
  Activity, 
  Check, 
  SlidersHorizontal 
} from "lucide-react";
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

export default function EmployeePortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  
  // Tab states: 'workloads' or 'support'
  const [activeTab, setActiveTab] = useState<'workloads' | 'support'>('workloads');
  
  // Data states
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [syncing, setSyncing] = useState(false);

  // Roadmap Editor Modal states
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [editStatus, setEditStatus] = useState("Analyzing");
  const [editProgress, setEditProgress] = useState(0);
  const [editDeadline, setEditDeadline] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editAgreement, setEditAgreement] = useState("");
  const [editBudgetTotal, setEditBudgetTotal] = useState("");
  const [editBudgetPaid, setEditBudgetPaid] = useState("");
  const [savingRoadmap, setSavingRoadmap] = useState(false);

  // Chat Console states
  const [activeChatSub, setActiveChatSub] = useState<Submission | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);

  const fetchSubmissionsData = async () => {
    try {
      // Employees view all submissions to manage tasks
      const data = await supabaseService.getSubmissions();
      setSubmissions(data || []);
      
      // If we have an active chat open, sync its state
      if (activeChatSub) {
        const updatedChatSub = (data || []).find(s => s.id === activeChatSub.id);
        if (updatedChatSub) setActiveChatSub(updatedChatSub);
      }
    } catch (err: any) {
      console.error("Employee fetch error:", err);
      toast.error("Failed to sync workload submissions.");
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please sign in to access the Employee Workspace.");
        navigate("/auth");
        return;
      }

      setEmployeeEmail(session.user.email || "");
      setEmployeeName(session.user.user_metadata?.full_name || "Employee Representative");

      fetchSubmissionsData().then(() => {
        setLoading(false);
      });
    });
  }, [navigate]);

  const handleRefresh = async () => {
    setSyncing(true);
    await fetchSubmissionsData();
    setSyncing(false);
    toast.success("Synchronized project ledger.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Save changes to progress, status, and metadata details
  const handleSaveRoadmap = async () => {
    if (!selectedSub) return;
    setSavingRoadmap(true);
    try {
      const metaStr = JSON.stringify({
        deadline: editDeadline.trim(),
        website_url: editUrl.trim(),
        agreement: editAgreement.trim(),
        budget_total: editBudgetTotal.trim(),
        budget_paid: editBudgetPaid.trim()
      });
      await supabaseService.updateSubmission(selectedSub.id, {
        status: editStatus,
        progress: editProgress,
        bounty_reward: metaStr
      });
      toast.success("Roadmap milestones and contract details updated successfully.");
      setSelectedSub(null);
      await fetchSubmissionsData();
    } catch (err: any) {
      console.error("Roadmap save error:", err);
      toast.error("Failed to update roadmap parameters.");
    } finally {
      setSavingRoadmap(false);
    }
  };

  // Load chat transcript
  const loadChatMessages = async (subId: string) => {
    setChatLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('submission_id', subId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setChatMessages(data || []);
    } catch (err: any) {
      console.error("Chat loading failed:", err);
      toast.error("Could not load support transcript.");
    } finally {
      setChatLoading(false);
    }
  };

  // Subscribe to support channel in real time
  useEffect(() => {
    if (!activeChatSub) return;
    loadChatMessages(activeChatSub.id);

    const channel = supabase
      .channel(`chat_employee_${activeChatSub.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `submission_id=eq.${activeChatSub.id}`
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
  }, [activeChatSub]);

  // Send support message reply
  const sendSupportReply = async () => {
    if (!chatInput.trim() || !activeChatSub) return;
    const msg = chatInput.trim();
    setChatInput("");
    setSendingMsg(true);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          submission_id: activeChatSub.id,
          sender_email: employeeEmail,
          message: msg,
          is_admin: true
        });

      if (error) throw error;
      
      // Automatically update status to 'In Progress' if it was 'Analyzing' when replying
      if (activeChatSub.status === 'Analyzing') {
        await supabaseService.updateSubmission(activeChatSub.id, {
          status: 'In Progress'
        });
        await fetchSubmissionsData();
      }
    } catch (err: any) {
      console.error("Support message reply failed:", err);
      toast.error("Failed to send message.");
    } finally {
      setSendingMsg(false);
    }
  };

  const getInquiryLabel = (type: string) => {
    switch (type) {
      case "problem": return "Real-World Problem";
      case "requirement": return "Client Project";
      case "inquiry": return "General Inquiry";
      case "investor": return "Investor Lead";
      default: return type;
    }
  };

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
      agreement: bountyReward || "",
      budget_total: "",
      budget_paid: ""
    };
  };

  const openEditor = (sub: Submission) => {
    setSelectedSub(sub);
    setEditStatus(sub.status || "Analyzing");
    setEditProgress(sub.progress || 0);
    const meta = parseProjectMetadata(sub.bounty_reward);
    setEditDeadline(meta.deadline || "");
    setEditUrl(meta.website_url || "");
    setEditAgreement(meta.agreement || "");
    setEditBudgetTotal(meta.budget_total || "$12,500");
    setEditBudgetPaid(meta.budget_paid || "$4,500");
  };

  const selectChat = (sub: Submission) => {
    setActiveChatSub(sub);
    setChatMessages([]);
  };

  // Filtered workload submissions
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.organization || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || s.inquiry_type === filterType;
    return matchesSearch && matchesType;
  });

  // Calculate dynamic stats
  const totalInquiries = submissions.length;
  const activeProjects = submissions.filter(s => s.status === 'In Progress').length;
  const pendingReviews = submissions.filter(s => s.status === 'Analyzing' || !s.status).length;
  const completedMilestones = submissions.filter(s => s.status === 'Completed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">Connecting to Enterprise Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans">
      <Navbar />
      <Helmet>
        <title>Employee Workspace | Siddhi Dynamics</title>
        <meta name="description" content="Employee task dashboard, delivery roadmap progress tracking, and client support ticket console." />
      </Helmet>

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <main className="container mx-auto px-6 pt-32 pb-20 max-w-6xl relative z-10 space-y-12">
        
        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <div className="text-left">
            <span className="text-xs uppercase font-bold text-primary tracking-[0.25em]">Workspace Hub</span>
            <h1 className="text-4xl font-extrabold mt-1 text-white gradient-text glow-text">Employee Workspace</h1>
            <p className="text-muted-foreground text-xs mt-1">
              Authorized Operator: <span className="text-slate-300 font-semibold">{employeeName}</span> ({employeeEmail})
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={syncing}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              title="Sync Workspace Data"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5 text-slate-300 hover:text-red-400 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Google Review CTA */}
        <GoogleReviewCard audience="client" name={employeeName} compact />

        {/* Workspace Management Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Pipelines</span>
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">{totalInquiries}</p>
              <p className="text-[10px] text-muted-foreground font-bold mt-1">Ecosystem Submissions</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Active Roadmaps</span>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">{activeProjects}</p>
              <p className="text-[10px] text-blue-400 font-bold mt-1">In Development / Test</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Pending Analysis</span>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">{pendingReviews}</p>
              <p className="text-[10px] text-yellow-500 font-bold mt-1">Awaiting Technical Review</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Completed Deliveries</span>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">{completedMilestones}</p>
              <p className="text-[10px] text-emerald-400 font-bold mt-1">Production-Deployed</p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 gap-6 w-full">
          <button
            onClick={() => setActiveTab('workloads')}
            className={`pb-4 text-sm font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'workloads' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            Development Roadmaps ({filteredSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`pb-4 text-sm font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'support' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            Support & Escalations
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'workloads' ? (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-lg font-bold text-white tracking-wide text-left">Delivery Tasks Ledger</h3>
                
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Search */}
                  <div className="relative flex-grow md:flex-grow-0">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search Client or Project..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full md:w-60 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary text-white"
                    />
                  </div>

                  {/* Filter Type */}
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-primary text-slate-300"
                  >
                    <option value="all" className="bg-neutral-950">All Inquiries</option>
                    <option value="requirement" className="bg-neutral-950">Client Projects</option>
                    <option value="problem" className="bg-neutral-950">Problems</option>
                    <option value="inquiry" className="bg-neutral-950">General Inquiries</option>
                    <option value="investor" className="bg-neutral-950">Investor Leads</option>
                  </select>
                </div>
              </div>

              {/* Development Roadmaps Grid */}
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-white/10 space-y-4">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-medium text-white">No active roadmaps found</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Try searching with another keyword or adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {filteredSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-primary/20 transition-all"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{getInquiryLabel(sub.inquiry_type)}</span>
                            <h4 className="text-lg font-bold text-white mt-0.5">{sub.organization || "Independent Project"}</h4>
                          </div>
                          <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded ${
                            sub.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            sub.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          }`}>
                            {sub.status || 'Analyzing'}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-300">{sub.name} ({sub.email})</p>
                          {sub.designation && <p className="text-[10px] text-muted-foreground">{sub.designation}</p>}
                        </div>

                        <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                          {sub.message}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex-grow max-w-[70%] space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
                            <span>Development Progress</span>
                            <span>{sub.progress || 0}%</span>
                          </div>
                          <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="absolute h-full bg-gradient-to-r from-primary to-accent left-0" style={{ width: `${sub.progress || 0}%` }} />
                          </div>
                        </div>
                        <button
                          onClick={() => openEditor(sub)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold transition-all cursor-pointer"
                        >
                          Update <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Live Chat Support Queue */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px] text-left">
              {/* Chat Sidebar */}
              <div className="glass-card border border-white/10 rounded-3xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/2">
                  <h4 className="text-sm font-bold text-white">Active Support Channels</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Select a client thread to manage</p>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                  {submissions
                    .filter(s => s.inquiry_type === 'requirement' || s.inquiry_type === 'problem' || s.inquiry_type === 'investor')
                    .map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => selectChat(sub)}
                        className={`w-full p-4 text-left transition-all cursor-pointer flex justify-between items-center ${
                          activeChatSub?.id === sub.id 
                            ? 'bg-primary/5 border-l-2 border-primary' 
                            : 'hover:bg-white/2'
                        }`}
                      >
                        <div className="space-y-1 pr-2 max-w-[80%]">
                          <p className="text-xs font-bold text-white truncate">{sub.organization || sub.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{sub.email}</p>
                          <span className="text-[9px] uppercase font-bold text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                            {getInquiryLabel(sub.inquiry_type)}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="lg:col-span-2 glass-card border border-white/10 rounded-3xl flex flex-col justify-between overflow-hidden relative">
                {activeChatSub ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{activeChatSub.organization || activeChatSub.name}</h4>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            activeChatSub.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            activeChatSub.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          }`}>{activeChatSub.status || 'Analyzing'}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Rep: {activeChatSub.name} ({activeChatSub.email})</p>
                      </div>

                      {/* Fast Status Toggles */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            await supabaseService.updateSubmission(activeChatSub.id, { status: "Completed", progress: 100 });
                            toast.success("Marked as Completed.");
                            await fetchSubmissionsData();
                          }}
                          className="px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg hover:bg-emerald-500/20 transition-all cursor-pointer"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={async () => {
                            await supabaseService.updateSubmission(activeChatSub.id, { status: "In Progress" });
                            toast.success("Set to In Progress.");
                            await fetchSubmissionsData();
                          }}
                          className="px-2.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-lg hover:bg-blue-500/20 transition-all cursor-pointer"
                        >
                          Set In Progress
                        </button>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-xs text-muted-foreground gap-2 font-semibold">
                          <RefreshCw className="w-5 h-5 animate-spin text-primary" /> Loading transcript history...
                        </div>
                      ) : chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
                          <MessageSquare className="w-10 h-10 text-primary/20" />
                          <p className="text-xs font-bold text-slate-400">No Messages Logged Yet</p>
                          <p className="text-[10px] text-muted-foreground max-w-xs">Reply to initiate conversation. This matches in real-time on the client's gateway dashboard.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {chatMessages.map(m => {
                            const isStaff = m.is_admin;
                            return (
                              <div key={m.id} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                                  isStaff 
                                    ? 'bg-primary text-primary-foreground font-medium rounded-tr-none text-right' 
                                    : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none text-left'
                                }`}>
                                  {m.message}
                                </div>
                                <span className="text-[8px] text-muted-foreground/60 font-bold uppercase mt-1 px-1">
                                  {isStaff ? `Staff (${m.sender_email.split('@')[0]})` : "Client / AI"} · {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-white/5 bg-white/2">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          sendSupportReply();
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type reply and send directly to client..."
                          disabled={sendingMsg || chatLoading}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          disabled={!chatInput.trim() || sendingMsg || chatLoading}
                          className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:scale-105 disabled:hover:scale-100 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center text-xs text-slate-500 space-y-3">
                    <MessageSquare className="w-12 h-12 text-white/5" />
                    <p className="font-semibold text-slate-400">Support Chat Gateway Offline</p>
                    <p className="max-w-xs leading-relaxed">Select an active client support channel from the left menu to view, reply, and resolve escalated chat messages in real time.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Development Roadmap Progress Editor Modal */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 bg-[#020204]/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0c10] border border-white/10 rounded-3xl w-full max-w-md p-6 relative text-left"
            >
              <button
                onClick={() => setSelectedSub(null)}
                className="absolute right-4 top-4 p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-xl font-bold text-white mb-1">Update Development Roadmap</h3>
              <p className="text-xs text-muted-foreground mb-6">Modify project delivery stage and milestone progress metrics.</p>

              <div className="space-y-6">
                {/* Project Details */}
                <div className="bg-white/2 rounded-2xl p-4 border border-white/5 text-xs space-y-2">
                  <p className="font-bold text-slate-200">Organization: <span className="font-normal text-slate-400">{selectedSub.organization || "Individual"}</span></p>
                  <p className="font-bold text-slate-200">Representative: <span className="font-normal text-slate-400">{selectedSub.name} ({selectedSub.email})</span></p>
                </div>
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 no-scrollbar">
                  {/* Status Selector */}
                  <div className="space-y-2 text-xs">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Delivery Stage</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary text-white"
                    >
                      <option value="Analyzing" className="bg-neutral-950">Analyzing (Phase 1)</option>
                      <option value="In Progress" className="bg-neutral-950">In Progress (Phase 2-4)</option>
                      <option value="Completed" className="bg-neutral-950">Completed (Phase 5)</option>
                    </select>
                  </div>

                  {/* Progress Bar slider */}
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-300">
                      <span className="uppercase tracking-wider">Milestone Completion</span>
                      <span className="text-primary">{editProgress}%</span>
                    </div>
                    
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={editProgress}
                      onChange={(e) => setEditProgress(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    
                    <div className="flex justify-between w-full text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Target Milestone Deadline */}
                  <div className="space-y-2 text-xs">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Target Milestone Deadline</label>
                    <input
                      type="text"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                      placeholder="e.g. 2026-08-30 or Phase 3 Release"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary text-white"
                    />
                  </div>

                  {/* Demo / Live Website URL */}
                  <div className="space-y-2 text-xs">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Demo / Live Website URL</label>
                    <input
                      type="text"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="e.g. https://clientapp.siddhidynamics.in"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary text-white"
                    />
                  </div>

                  {/* SLA & Agreement Summary */}
                  <div className="space-y-2 text-xs">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Agreement SLA Summary</label>
                    <input
                      type="text"
                      value={editAgreement}
                      onChange={(e) => setEditAgreement(e.target.value)}
                      placeholder="e.g. SLA signed v1.1 - 99.9% uptime"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary text-white"
                    />
                  </div>

                  {/* Total Contract Budget */}
                  <div className="space-y-2 text-xs">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Total Contract Budget</label>
                    <input
                      type="text"
                      value={editBudgetTotal}
                      onChange={(e) => setEditBudgetTotal(e.target.value)}
                      placeholder="e.g. $15,000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary text-white"
                    />
                  </div>

                  {/* Milestones Disbursed Amount */}
                  <div className="space-y-2 text-xs">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Milestones Disbursed Amount</label>
                    <input
                      type="text"
                      value={editBudgetPaid}
                      onChange={(e) => setEditBudgetPaid(e.target.value)}
                      placeholder="e.g. $6,000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary text-white"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/5 flex gap-3">
                  <button
                    onClick={handleSaveRoadmap}
                    disabled={savingRoadmap}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:scale-102 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {savingRoadmap ? <RefreshCw className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
                    Save Milestones
                  </button>
                  <button
                    onClick={() => setSelectedSub(null)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

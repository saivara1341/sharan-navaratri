import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { 
  TrendingUp, 
  LogOut, 
  Briefcase, 
  DollarSign, 
  BarChart3, 
  Search, 
  Sparkles, 
  MessageCircle, 
  Send, 
  X, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  Mail, 
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  LineChart
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

interface StartupProject {
  id: string;
  name: string;
  category: string;
  stage: string;
  traction: string;
  roi: string;
  progress: number;
  status: string;
  description: string;
  website_url?: string;
  milestones: string[];
}

export default function InvestorPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [investorEmail, setInvestorEmail] = useState("");
  const [investorName, setInvestorName] = useState("");
  
  // Projects states (mock database portfolio + user submission data)
  const [portfolio, setPortfolio] = useState<StartupProject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  
  // Selected project for detailed view modal
  const [selectedProject, setSelectedProject] = useState<StartupProject | null>(null);
  
  // Chat support states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [investorSubmissionId, setInvestorSubmissionId] = useState<string | null>(null);

  // Hardcoded premium startup portfolio
  const basePortfolio: StartupProject[] = [
    {
      id: "mock-proj-1",
      name: "Siddhi ERP Suite",
      category: "Enterprise Software",
      stage: "Seed",
      traction: "+28% MoM Growth",
      roi: "2.4x Projection",
      progress: 65,
      status: "In Progress",
      description: "Cloud-native ERP platform built for Indian small-to-medium manufacturing firms. Solves compliance, inventory, and supply chain automation in one dashboard.",
      website_url: "https://siddhidynamics.in/services/erp",
      milestones: ["Phase 1: Architecture (100% Completed)", "Phase 2: Alpha Testing (100% Completed)", "Phase 3: Integration (60% Completed)", "Phase 4: Validation (Pending)", "Phase 5: Deploy (Pending)"]
    },
    {
      id: "mock-proj-2",
      name: "WishO Landing",
      category: "Developer Tools / AI",
      stage: "Pre-seed",
      traction: "5k+ Developer Waitlist",
      roi: "3.1x Projection",
      progress: 100,
      status: "Completed",
      description: "AI-powered landing page builder featuring micro-interactions and smart conversions. Enables zero-code high-performance website generation.",
      website_url: "https://siddhidynamics.in/project/wish-o",
      milestones: ["Phase 1: Architecture (100%)", "Phase 2: Alpha (100%)", "Phase 3: Integration (100%)", "Phase 4: Validation (100%)", "Phase 5: Deploy (100%)"]
    },
    {
      id: "mock-proj-3",
      name: "EcoGrid AI",
      category: "Deep Tech / Clean Energy",
      stage: "Series A",
      traction: "3 Pilot Agreements Signed",
      roi: "1.8x Projection",
      progress: 20,
      status: "Analyzing",
      description: "Machine learning analytics for real-time power grid stabilization. Intended to assist green microgrids in routing power dynamically to minimize transmission waste.",
      milestones: ["Phase 1: Architecture (80% Completed)", "Phase 2: Alpha (Pending)", "Phase 3: Integration (Pending)", "Phase 4: Validation (Pending)", "Phase 5: Deploy (Pending)"]
    },
    {
      id: "mock-proj-4",
      name: "ArchPlan Smart Core",
      category: "PropTech",
      stage: "Seed",
      traction: "15 architectural firm pilots",
      roi: "2.2x Projection",
      progress: 45,
      status: "In Progress",
      description: "Real-time CAD metadata indexing engine that uses AI to detect load-bearing anomalies and compliance issues directly in blueprints.",
      website_url: "https://siddhidynamics.in/project/archplan",
      milestones: ["Phase 1: Architecture (100% Completed)", "Phase 2: Alpha (60% Completed)", "Phase 3: Integration (Pending)", "Phase 4: Validation (Pending)", "Phase 5: Deploy (Pending)"]
    }
  ];

  // Fetch real-time contact submissions and combine them with the startup portfolio
  const fetchPortfolioData = async (email: string) => {
    try {
      // Fetch submissions
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.message !== "Policy prevents reading") {
        console.error("Error reading database submissions:", error);
      }

      const submissions = data || [];
      
      // Look for the investor's support submission, or create it if missing
      const invSub = submissions.find(s => s.email === email && s.inquiry_type === "investor");
      if (invSub) {
        setInvestorSubmissionId(invSub.id);
      } else {
        // Create an investor record dynamically so they can use chat messages
        const { data: newSub, error: insertErr } = await supabase
          .from('contact_submissions')
          .insert({
            name: investorName || "Investor Representative",
            email: email,
            inquiry_type: "investor",
            message: "Investor gateway session created for real-time assistance and communications.",
            organization: "Venture Fund",
            designation: "General Partner",
            status: "Analyzing",
            progress: 0
          })
          .select();
        
        if (!insertErr && newSub && newSub.length > 0) {
          setInvestorSubmissionId(newSub[0].id);
        }
      }

      // Convert other client submissions of type 'requirement' or 'problem' into startup projects list
      const dbStartups: StartupProject[] = submissions
        .filter(s => s.inquiry_type === 'requirement' || s.inquiry_type === 'problem')
        .map((s, idx) => {
          // Attempt to parse bounty details
          let website = "";
          let deadlineText = "";
          try {
            if (s.bounty_reward && s.bounty_reward.trim().startsWith('{')) {
              const meta = JSON.parse(s.bounty_reward);
              website = meta.website_url || "";
              deadlineText = meta.deadline ? `Target: ${meta.deadline}` : "";
            }
          } catch (e) {
            // Ignored
          }

          return {
            id: s.id,
            name: s.organization || `Project ${s.name}`,
            category: s.inquiry_type === 'problem' ? "Deep Tech Innovation" : "Custom Solution",
            stage: "Pre-seed",
            traction: "Development Active",
            roi: "N/A Development",
            progress: s.progress || 10,
            status: s.status || "Analyzing",
            description: s.message || "No description provided.",
            website_url: website,
            milestones: [
              `Phase 1: Architecture (${s.progress && s.progress >= 20 ? '100%' : 'In Progress'})`,
              `Phase 2: Alpha (${s.progress && s.progress >= 40 ? '100%' : s.progress && s.progress >= 20 ? 'In Progress' : 'Pending'})`,
              `Phase 3: Integration (${s.progress && s.progress >= 60 ? '100%' : s.progress && s.progress >= 40 ? 'In Progress' : 'Pending'})`,
              `Phase 4: Validation (${s.progress && s.progress >= 80 ? '100%' : s.progress && s.progress >= 60 ? 'In Progress' : 'Pending'})`,
              `Phase 5: Deploy (${s.progress && s.progress === 100 ? '100%' : s.progress && s.progress >= 80 ? 'In Progress' : 'Pending'})`
            ]
          };
        });

      // Merge mock portfolio and real database entries
      setPortfolio([...basePortfolio, ...dbStartups]);
    } catch (err) {
      console.error("Portfolio retrieval exception:", err);
      setPortfolio(basePortfolio); // Fallback to premium mock list
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please sign in to access the Investor Portal.");
        navigate("/auth");
        return;
      }

      const email = session.user.email || "";
      const name = session.user.user_metadata?.full_name || "Venture Partner";
      setInvestorEmail(email);
      setInvestorName(name);

      fetchPortfolioData(email).then(() => {
        setLoading(false);
      });
    });
  }, [navigate]);

  // Load chat messages when the chat panel is opened
  const loadChatMessages = async () => {
    if (!investorSubmissionId) return;
    setChatLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('submission_id', investorSubmissionId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setChatMessages(data || []);
    } catch (err: any) {
      console.error("Could not load chat messages:", err);
    } finally {
      setChatLoading(false);
    }
  };

  // Subscribe to real-time chat updates
  useEffect(() => {
    if (!chatOpen || !investorSubmissionId) return;
    loadChatMessages();

    const channel = supabase
      .channel(`chat_investor_${investorSubmissionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `submission_id=eq.${investorSubmissionId}`
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
  }, [chatOpen, investorSubmissionId]);

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !investorSubmissionId || !investorEmail) return;
    const msg = chatInput.trim();
    setChatInput("");
    setSendingMsg(true);

    try {
      // 1. Insert User message
      const { error: userErr } = await supabase
        .from('chat_messages')
        .insert({
          submission_id: investorSubmissionId,
          sender_email: investorEmail,
          message: msg,
          is_admin: false
        });

      if (userErr) throw userErr;

      // 2. Generate Gemini response
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('vite_gemini_api_key');
      if (!apiKey) {
        setSendingMsg(false);
        return;
      }

      const systemInstruction = `You are Siddhi Investor Relations Assistant, an AI advisor representing Siddhi Dynamics. 
Answer the investor's questions about the venture portfolio, active project roadmaps, and technological architectures.
Be professional, analytical, and informative. Frame your answers with financial and strategic intelligence.
If asked about a specific project, you can refer to:
- Siddhi ERP Suite: custom software scaling MoM.
- WishO Landing: waitlist of developers, landing generator.
- EcoGrid AI: deep tech clean grid pilot programs.
If you cannot answer based on our tech stack, say: "I will escalate this question directly to our executive team lead saivaraprasad for detailed parameters." and append "[ESCFLAG]".`;

      const historyPayload = chatMessages.slice(-6).map((m: any) => ({
        role: m.is_admin ? 'model' : 'user',
        parts: [{ text: m.message }]
      }));
      historyPayload.push({
        role: 'user',
        parts: [{ text: msg }]
      });

      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: historyPayload,
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });

      if (!geminiResponse.ok) throw new Error("Gemini API call failed");
      const geminiData = await geminiResponse.json();
      const aiText = geminiData.candidates[0].content.parts[0].text;

      const isEscalated = aiText.includes('[ESCFLAG]');
      const cleanAiText = aiText.replace('[ESCFLAG]', '').trim();

      // Insert AI reply
      await supabase
        .from('chat_messages')
        .insert({
          submission_id: investorSubmissionId,
          sender_email: 'ir_assistant@siddhidynamics.in',
          message: cleanAiText,
          is_admin: true
        });

      if (isEscalated) {
        toast.info("Your strategic query was flagged for founder saivaraprasad. A direct response will follow.");
      }
    } catch (err) {
      console.error("AI IR assistant failed:", err);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Sync / Refresh data
  const handleSyncData = async () => {
    setLoading(true);
    await fetchPortfolioData(investorEmail);
    setLoading(false);
    toast.success("Venture portfolio records synchronized.");
  };

  // Filtered startups lists
  const filteredPortfolio = portfolio.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesStage = stageFilter === "all" || item.stage.toLowerCase() === stageFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesStage;
  });

  // Calculate dynamic dashboard stats
  const totalProjects = portfolio.length;
  const activeRoadmaps = portfolio.filter(p => p.status === "In Progress").length;
  const completedProjects = portfolio.filter(p => p.status === "Completed").length;
  const avgProgress = totalProjects > 0 
    ? Math.round(portfolio.reduce((sum, p) => sum + p.progress, 0) / totalProjects) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-10 h-10 animate-spin text-accent" />
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">Connecting to Venture Ledger...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans">
      <Navbar />
      <Helmet>
        <title>Venture & Investor Dashboard | Siddhi Dynamics</title>
        <meta name="description" content="Siddhi Dynamics active deep-tech startup portfolio, traction analytics, and investor relations console." />
      </Helmet>

      {/* Decorative background grid and glow */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <main className="container mx-auto px-6 pt-32 pb-20 max-w-6xl relative z-10 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <div className="text-left">
            <span className="text-xs uppercase font-bold text-accent tracking-[0.25em]">Venture & Capital</span>
            <h1 className="text-4xl font-extrabold mt-1 text-white gradient-text glow-text">Investor Portal</h1>
            <p className="text-muted-foreground text-xs mt-1">
              Active Strategic Account: <span className="text-slate-300 font-semibold">{investorName}</span> ({investorEmail})
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncData}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer animate-none"
              title="Sync Portfolio Ledger"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 border border-accent/20 bg-accent/5 hover:bg-accent/10 text-accent px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> AI Support / Chat
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5 text-slate-300 hover:text-red-400 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Strategic Metrics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Overall Traction</span>
              <LineChart className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">+24%</p>
              <p className="text-[10px] text-accent/80 font-bold mt-1">▲ Portfolio MoM Growth</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Venture Startups</span>
              <Briefcase className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">{totalProjects}</p>
              <p className="text-[10px] text-muted-foreground font-bold mt-1">{activeRoadmaps} in Active Incubation</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Capital Allocated</span>
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">$1.85M</p>
              <p className="text-[10px] text-emerald-400 font-bold mt-1">100% Milestone-Gated</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Avg Tech Milestone</span>
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">{avgProgress}%</p>
              <div className="relative h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="absolute h-full bg-accent left-0" style={{ width: `${avgProgress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Table and Filters */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-bold text-white tracking-wide text-left">Ecosystem Active Startup Projects</h2>
            
            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search startup..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-60 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent text-white"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-accent text-slate-300"
              >
                <option value="all" className="bg-neutral-950">All Statuses</option>
                <option value="Analyzing" className="bg-neutral-950">Analyzing</option>
                <option value="In Progress" className="bg-neutral-950">In Progress</option>
                <option value="Completed" className="bg-neutral-950">Completed</option>
              </select>

              {/* Stage Filter */}
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-accent text-slate-300"
              >
                <option value="all" className="bg-neutral-950">All Stages</option>
                <option value="Pre-seed" className="bg-neutral-950">Pre-seed</option>
                <option value="Seed" className="bg-neutral-950">Seed</option>
                <option value="Series A" className="bg-neutral-950">Series A</option>
              </select>
            </div>
          </div>

          {/* Startup Catalog */}
          {filteredPortfolio.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-white/10 space-y-4">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-medium text-white">No startups match filter</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                No ecosystem startup projects fit the active search parameters. Try adjusting filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {filteredPortfolio.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.01, border: "1px solid rgba(234, 179, 8, 0.25)" }}
                  className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between cursor-pointer group transition-all"
                  onClick={() => setSelectedProject(item)}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-accent tracking-widest">{item.category}</span>
                        <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors mt-0.5">{item.name}</h3>
                      </div>
                      <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded ${
                        item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        item.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Stats mini bar */}
                    <div className="grid grid-cols-3 gap-2 bg-white/2 rounded-xl p-3 border border-white/5 text-center text-xs">
                      <div>
                        <p className="text-[10px] text-muted-foreground/80 uppercase font-bold tracking-wider">Stage</p>
                        <p className="font-bold text-slate-200 mt-0.5">{item.stage}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/80 uppercase font-bold tracking-wider">Traction</p>
                        <p className="font-bold text-emerald-400 mt-0.5">{item.traction.split(" ")[0]}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/80 uppercase font-bold tracking-wider">Projection</p>
                        <p className="font-bold text-accent mt-0.5">{item.roi.split(" ")[0]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex-grow max-w-[70%] space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
                        <span>Milestone Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="absolute h-full bg-gradient-to-r from-accent to-yellow-600 left-0" style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                    <span className="flex items-center text-xs font-bold text-accent group-hover:translate-x-1 transition-transform">
                      Details <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 bg-[#020204]/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0c10] border border-white/10 rounded-3xl w-full max-w-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto relative text-left"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-6 top-6 p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold text-accent tracking-widest">{selectedProject.category}</span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">{selectedProject.name}</h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-300">
                      Funding Stage: {selectedProject.stage}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-500/5 border border-emerald-500/20 rounded text-emerald-400">
                      Traction: {selectedProject.traction}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-accent/5 border border-accent/20 rounded text-accent">
                      ROI Target: {selectedProject.roi}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Executive Abstract</h4>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-white/2 rounded-2xl p-5 border border-white/5">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Progress bar details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                    <span className="uppercase tracking-wider">Milestone Verification Gate</span>
                    <span className="text-accent">{selectedProject.progress}% Completed</span>
                  </div>
                  <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="absolute h-full bg-gradient-to-r from-accent to-yellow-600 left-0" style={{ width: `${selectedProject.progress}%` }} />
                  </div>
                  
                  {/* Milestones list */}
                  <div className="space-y-2 mt-4 bg-white/2 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Development Roadmap Phases</p>
                    {selectedProject.milestones.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          m.includes("100%") ? "bg-emerald-400" :
                          m.includes("Completed") ? "bg-emerald-400" :
                          m.includes("In Progress") ? "bg-blue-400" : "bg-neutral-700"
                        }`} />
                        <span className={m.includes("Pending") ? "text-slate-500" : "text-slate-300"}>
                          {m}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-3">
                  {selectedProject.website_url && (
                    <a
                      href={selectedProject.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-neutral-950 font-bold text-xs hover:scale-105 transition-all shadow-lg shadow-accent/15"
                    >
                      Open Live Portal / Demo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      setChatOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-all hover:scale-105 cursor-pointer"
                  >
                    Request pitch deck / Meeting via IR Support
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide-out Investor Support Drawer */}
      <AnimatePresence>
        {chatOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            {/* Dismiss overlay */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setChatOpen(false)} />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-full max-w-md h-full bg-[#0a0a0f] border-l border-white/10 flex flex-col justify-between shadow-2xl z-10"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/2">
                <div className="flex items-center gap-2 text-left">
                  <div className="p-2 bg-accent/10 rounded-xl"><Sparkles className="w-5 h-5 text-accent animate-pulse" /></div>
                  <div>
                    <h3 className="text-base font-bold text-white">Siddhi Strategic AI</h3>
                    <p className="text-[10px] text-muted-foreground">Investor Relations Advisory Console</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat history */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {chatLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground text-xs font-semibold">
                    <RefreshCw className="w-6 h-6 animate-spin text-accent" /> Loading strategic transcript...
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-xs text-slate-500 space-y-3 p-6">
                    <ShieldCheck className="w-10 h-10 text-accent/30" />
                    <p className="font-semibold text-slate-400">Vault Secure Connection Established</p>
                    <p className="leading-relaxed">Inquire regarding venture portfolios, funding allocation parameters, growth reports, or request a meeting with founder saivaraprasad.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((m: any) => {
                      const isAdmin = m.is_admin;
                      return (
                        <div key={m.id} className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}>
                          <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                            isAdmin 
                              ? 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none text-left' 
                              : 'bg-accent text-neutral-950 font-medium rounded-tr-none text-right shadow-md shadow-accent/5'
                          }`}>
                            {m.message}
                          </div>
                          <span className="text-[8px] text-muted-foreground/60 font-bold uppercase mt-1 px-1">
                            {isAdmin ? "Siddhi Dynamics IR AI" : "You"} · {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
                    {sendingMsg && (
                      <div className="flex flex-col items-start">
                        <div className="bg-white/5 text-slate-400 border border-white/5 rounded-2xl rounded-tl-none p-4 text-xs flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent" /> Calculating investment projection...
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/5 bg-white/2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendChatMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Enter investment query..."
                    disabled={sendingMsg || chatLoading}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || sendingMsg || chatLoading}
                    className="p-2.5 rounded-xl bg-accent text-neutral-950 hover:scale-105 disabled:hover:scale-100 transition-all font-bold disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
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

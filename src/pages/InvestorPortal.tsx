import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { generateContent } from "@/lib/geminiClient";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";
import { 
  TrendingUp, 
  LogOut, 
  Briefcase, 
  DollarSign, 
  BarChart3, 
  Search, 
  Zap, 
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
  LineChart,
  Check,
  Activity,
  Award,
  Star,
  Globe,
  PieChart,
  Layers,
  Building,
  Users,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Lock,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { InvestorPipelineRollup } from "@/components/requirements/InvestorPipelineRollup";

export interface StartupProject {
  id: string;
  name: string;
  category: string;
  stage: string;
  traction: string;
  roi: string;
  progress: number;
  status: string;
  holding_type: 'we_hold' | 'doing' | 'completed';
  equity_held: string;
  current_valuation_inr: string;
  description: string;
  metrics: Record<string, any>;
  highlights: string[];
  website_url?: string;
  docs_url?: string;
  milestones: string[];
  tam?: string;
  sam?: string;
  som?: string;
  businessModel?: string;
  pitch?: string;
}

export default function InvestorPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [investorEmail, setInvestorEmail] = useState("");
  const [investorName, setInvestorName] = useState("");
  
  // Navigation tabs: 'overview' | 'projects' | 'financials' | 'journey'
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'financials' | 'journey'>('overview');
  
  // Project category segregation filter: 'all' | 'we_hold' | 'doing' | 'completed'
  const [holdingFilter, setHoldingFilter] = useState<'all' | 'we_hold' | 'doing' | 'completed'>('all');
  
  // Projects states
  const [portfolio, setPortfolio] = useState<StartupProject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Curated portfolio with high-contrast segregation
  const basePortfolio: StartupProject[] = [
    // ── 1. Projects We Hold (Proprietary IP) ─────────────────────────────────
    {
      id: "hold-proj-1",
      name: "Siddhi ERP Suite",
      category: "Enterprise Operations & ERP",
      stage: "Seed",
      traction: "₹24L ARR · 14 Manufacturing Firms",
      roi: "3.5x Projection",
      progress: 75,
      status: "In Progress",
      holding_type: "we_hold",
      description: "Proprietary cloud-native ERP platform built for Indian small-to-medium manufacturing firms. Solves GST e-invoicing compliance, real-time raw material inventory, and automated shop floor workflow scheduling in one high-availability system.",
      website_url: "https://siddhidynamics.in/services/erp",
      milestones: ["Phase 1: Architecture & RLS (100% Completed)", "Phase 2: Alpha GST Engine (100% Completed)", "Phase 3: Inventory IoT Sync (75% Active)", "Phase 4: Multi-unit Handover (Pending)", "Phase 5: Commercial Deployment (Q3)"],
      tam: "₹1,050 Cr ($12.8B APAC)",
      sam: "₹120 Cr (Indian SME Manufacturers)",
      som: "₹18 Cr (Target Year 2)",
      businessModel: "B2B SaaS subscription (₹15,000/mo base) + custom on-premise migration packages",
      pitch: "Transforming manual spreadsheet chaos in Indian manufacturing hubs into automated, GST-compliant real-time production analytics."
    },
    {
      id: "hold-proj-2",
      name: "WishO Landing",
      category: "Developer Tools / Generative Web",
      stage: "Growth",
      traction: "5,200+ Waitlist · 100% In-house IP",
      roi: "4.2x Projection",
      progress: 100,
      status: "Completed",
      holding_type: "we_hold",
      description: "AI-powered landing page engine featuring native micro-interactions, conversion telemetry, and high-performance WebP animations. Generates production-ready, accessible web applications in under 60 seconds.",
      website_url: "https://siddhidynamics.in/project/wish-o",
      milestones: ["Phase 1: Core Compiler (100%)", "Phase 2: Animation Engine (100%)", "Phase 3: AI Copy Integration (100%)", "Phase 4: Global CDN Handover (100%)", "Phase 5: Public Production (100%)"],
      tam: "₹3,400 Cr ($4.2B Global Web Dev)",
      sam: "₹680 Cr (No-Code Agencies)",
      som: "₹85 Cr (Indian Digital Agencies)",
      businessModel: "Product-led SaaS: Free starter tier, Pro at ₹1,499/mo, Agency White-label at ₹6,999/mo",
      pitch: "Allowing agencies and startups to deploy state-of-the-art interactive web experiences without months of front-end engineering."
    },
    {
      id: "hold-proj-3",
      name: "ArchPlan Smart Core",
      category: "PropTech & Architectural AI",
      stage: "Seed",
      traction: "15 Architectural Firm Pilots",
      roi: "2.8x Projection",
      progress: 60,
      status: "In Progress",
      holding_type: "we_hold",
      description: "Real-time CAD metadata indexing engine utilizing automated computer vision algorithms to detect municipal building code anomalies, setbacks, and load-bearing constraints directly from architectural blueprints.",
      website_url: "https://siddhidynamics.in/project/archplan",
      milestones: ["Phase 1: DXF/DWG Parser (100%)", "Phase 2: Anomaly Detection AI (80%)", "Phase 3: Municipal Rulebook Sync (40%)", "Phase 4: Firm Verification (Pending)", "Phase 5: Commercial Handover (Q4)"],
      tam: "₹5,200 Cr ($6.5B Global CAD)",
      sam: "₹780 Cr (BIM Compliance India & ME)",
      som: "₹65 Cr (Top 250 Design Firms)",
      businessModel: "Enterprise seat licensing (₹6,500/seat/mo) + automated municipal plan audit API fees",
      pitch: "Slashing architectural municipal compliance review times from 3 weeks to 90 seconds."
    },
    {
      id: "hold-proj-4",
      name: "EcoGrid AI",
      category: "Deep Tech & Sustainable Energy",
      stage: "Series A Prep",
      traction: "3 Commercial Microgrid MOUs",
      roi: "3.0x Projection",
      progress: 40,
      status: "In Progress",
      holding_type: "we_hold",
      description: "Dynamic machine learning grid telemetry platform for microgrid stabilization and automated surplus solar/wind dispatch, minimizing transmission waste for commercial industrial parks.",
      milestones: ["Phase 1: Sensor Gateway Architecture (100%)", "Phase 2: Predictive Dispatch Models (60%)", "Phase 3: Hardware Field Sprints (20%)", "Phase 4: Regulatory Sandbox (Pending)", "Phase 5: Grid Handover (Pending)"],
      tam: "₹14,500 Cr ($18.4B Smart Grid)",
      sam: "₹1,600 Cr (Indian Industrial Microgrids)",
      som: "₹140 Cr (SEZ & Tech Parks)",
      businessModel: "Enterprise SaaS + Performance-based energy savings sharing (12% of recorded grid savings)",
      pitch: "Algorithmic load management preventing peak power tariffs and optimizing renewable energy consumption for high-capacity industrial hubs."
    },
    {
      id: "hold-proj-5",
      name: "PrintFlow Commerce",
      category: "B2B Commerce & Web-to-Print",
      stage: "Seed",
      traction: "Live Beta · 12 Commercial Printers",
      roi: "3.2x Projection",
      progress: 85,
      status: "In Progress",
      holding_type: "we_hold",
      description: "Comprehensive print commerce and operations platform tailored for the Indian print and packaging ecosystem. Features real-time sheet-nesting calculators, dynamic proof approvals, and automated vendor job routing.",
      website_url: "https://printflows.in",
      milestones: ["Phase 1: Nesting Engine (100%)", "Phase 2: Vendor Routing (100%)", "Phase 3: Payment Proof & Banking (90%)", "Phase 4: Multi-city Sprints (70%)", "Phase 5: National Launch (Q3)"],
      tam: "₹8,000 Cr ($9.8B Web-to-Print)",
      sam: "₹950 Cr (Indian Commercial Printing)",
      som: "₹90 Cr (Metros & Regional Clusters)",
      businessModel: "Transaction take-rate (2.5%) + Monthly Print Shop Operating System fee",
      pitch: "Digitizing India's highly fragmented printing press operations into an integrated, on-demand digital commerce network."
    },

    // ── 2. Projects Doing (Active Client & Enterprise Sprints) ───────────────
    {
      id: "doing-proj-1",
      name: "Enterprise Logistics Control Core",
      category: "Supply Chain Automation",
      stage: "Execution",
      traction: "Active Sprint 3 · Contract Value ₹18.5L",
      roi: "Contracted Retainer",
      progress: 65,
      status: "In Progress",
      holding_type: "doing",
      description: "Custom telematics and multi-hub dispatch software connecting 45 fleet vehicles across South Indian freight corridors with real-time GPS verification, temperature tracking, and automated consignment handovers.",
      milestones: ["Phase 1: Architecture & API (100%)", "Phase 2: Telemetry Ingestion (100%)", "Phase 3: Route Optimization (65%)", "Phase 4: Fleet Driver App Handover (Pending)", "Phase 5: Production Go-Live (Target: 3 Weeks)"],
      tam: "₹3,500 Cr (Indian Cold Chain Logistics)",
      businessModel: "Milestone-Gated Custom Enterprise Delivery + Annual Maintenance SLA",
      pitch: "Real-time cold chain telematics preventing perishable goods degradation in transit."
    },
    {
      id: "doing-proj-2",
      name: "Healthcare Telemetry & EHR Platform",
      category: "HealthTech & Tele-Consultation",
      stage: "Execution",
      traction: "Alpha Integration · Contract Value ₹14L",
      roi: "Contracted Retainer",
      progress: 45,
      status: "In Progress",
      holding_type: "doing",
      description: "HIPAA & ABDM-compliant electronic health records (EHR) and multi-specialty clinic patient booking engine with automated WhatsApp appointment reminders and encrypted digital prescription vaults.",
      milestones: ["Phase 1: Security & Compliance Design (100%)", "Phase 2: ABDM Gateway Integration (70%)", "Phase 3: Doctor Console (20%)", "Phase 4: Clinical Handover (Pending)", "Phase 5: Multi-center Rollout (Pending)"],
      tam: "₹4,200 Cr (Indian Digital Healthcare)",
      businessModel: "Enterprise build contract + monthly clinic maintenance retainer",
      pitch: "Bridging provincial clinics with national digital health standards through friction-free record management."
    },
    {
      id: "doing-proj-3",
      name: "Multi-Store Retail POS & Cloud Sync",
      category: "Retail Tech & Inventory",
      stage: "Execution",
      traction: "Testing Sandbox · Contract Value ₹11L",
      roi: "Contracted Retainer",
      progress: 55,
      status: "In Progress",
      holding_type: "doing",
      description: "High-speed offline-first point-of-sale terminal software with continuous background cloud synchronization across 8 retail apparel outlets, featuring integrated UPI QR display and automated daily reconciliation.",
      milestones: ["Phase 1: Offline SQLite Sync (100%)", "Phase 2: Hardware Printer & Barcode Drivers (100%)", "Phase 3: Multi-outlet Inventory Sync (55%)", "Phase 4: Store Staff Training (Pending)", "Phase 5: Final Production Deployment (Pending)"],
      tam: "₹2,800 Cr (Organized Retail Tech)",
      businessModel: "Fixed Turnkey Implementation + Ongoing Cloud Sync SLA",
      pitch: "Zero-latency retail billing resilient to intermittent internet connectivity."
    },

    // ── 3. Projects Completed (Production Delivered) ─────────────────────────
    {
      id: "comp-proj-1",
      name: "VMagnetic Minds Brand Engine",
      category: "Marketing Tech & Agency Portal",
      stage: "Production",
      traction: "Live in Production · 24 Client Brands Active",
      roi: "Delivered & Verified",
      progress: 100,
      status: "Completed",
      holding_type: "completed",
      description: "Dedicated digital agency command center featuring client brand management, automated Google Analytics 4 ingestion, GBP review monitors, and real-time commission tracking for partner referrals.",
      website_url: "https://siddhidynamics.in/agency-portal",
      milestones: ["Phase 1: Architecture (100%)", "Phase 2: Multi-Tenant Agency Portals (100%)", "Phase 3: GA4 & Search Console APIs (100%)", "Phase 4: Client Approval Handover (100%)", "Phase 5: Production Deployment (100%)"],
      tam: "₹1,800 Cr (Digital Marketing Ops)",
      businessModel: "Agency Strategic Partnership + Commission Revenue Share",
      pitch: "Empowering partner agencies with an automated executive dashboard to manage multiple high-value client accounts."
    },
    {
      id: "comp-proj-2",
      name: "NeoEstate Real-Estate Brokerage CRM",
      category: "PropTech & Lead Automation",
      stage: "Production",
      traction: "₹95 Cr Property Inventory Managed",
      roi: "Delivered & Verified",
      progress: 100,
      status: "Completed",
      holding_type: "completed",
      description: "Custom lead capture and property walkthrough portal for a premier Hyderabad luxury developer. Integrates automated WhatsApp brochures, dynamic site visit scheduling, and broker commission ledger.",
      milestones: ["Phase 1: Architecture & UI (100%)", "Phase 2: CRM & Lead Scoring (100%)", "Phase 3: WhatsApp Cloud API (100%)", "Phase 4: User Acceptance Testing (100%)", "Phase 5: Full Launch (100%)"],
      tam: "₹3,200 Cr (Real Estate CRM)",
      businessModel: "Turnkey Development + Annual Maintenance Retainer",
      pitch: "Accelerating real estate lead turnaround time from 24 hours to instant sub-minute WhatsApp engagement."
    },
    {
      id: "comp-proj-3",
      name: "Industrial IoT Telemetry Gateway",
      category: "Industrial Automation & Hardware",
      stage: "Production",
      traction: "2.4M Sensor Events Processed Daily",
      roi: "Delivered & Verified",
      progress: 100,
      status: "Completed",
      holding_type: "completed",
      description: "Edge telemetry gateway capturing vibration, temperature, and motor power load data from CNC machinery, streaming anomaly alerts to plant floor dashboards with sub-second latency.",
      milestones: ["Phase 1: Modbus Protocol Drivers (100%)", "Phase 2: MQTT Broker Pipeline (100%)", "Phase 3: Timescale Telemetry Database (100%)", "Phase 4: Plant Handover & QA (100%)", "Phase 5: Production Live (100%)"],
      tam: "₹6,100 Cr (Industrial IoT Analytics)",
      businessModel: "Turnkey Execution + Enterprise Maintenance SLA",
      pitch: "Preventing costly CNC spindle breakdowns through proactive predictive vibration telemetry."
    }
  ];

  // Fetch real-time submissions and merge with portfolio
  const fetchPortfolioData = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.message !== "Policy prevents reading") {
        console.error("Error reading database submissions:", error);
      }

      const submissions = data || [];
      
      const invSub = submissions.find(s => s.email === email && s.inquiry_type === "investor");
      if (invSub) {
        setInvestorSubmissionId(invSub.id);
      } else {
        const { data: newSub, error: insertErr } = await supabase
          .from('contact_submissions')
          .insert({
            name: investorName || "Venture Representative",
            email: email,
            inquiry_type: "investor",
            message: "Investor gateway session created for real-time strategic assistance and communications.",
            organization: "Venture Capital Partner",
            designation: "Strategic Partner",
            status: "Analyzing",
            progress: 0
          })
          .select();
        
        if (!insertErr && newSub && newSub.length > 0) {
          setInvestorSubmissionId(newSub[0].id);
        }
      }

      // Convert client submissions into dynamic portfolio additions
      const dbStartups: StartupProject[] = submissions
        .filter(s => s.inquiry_type === 'requirement' || s.inquiry_type === 'problem')
        .map((s) => {
          let website = "";
          let tam = "₹450 Cr (Indian Market)";
          let sam = "₹60 Cr (Addressable Segment)";
          let som = "₹8 Cr (Initial Target)";
          let businessModel = "B2B SaaS / Enterprise Turnkey Solution";
          let pitch = "Advanced automated solution built to streamline client operations.";
          
          try {
            if (s.bounty_reward && s.bounty_reward.trim().startsWith('{')) {
              const meta = JSON.parse(s.bounty_reward);
              website = meta.website_url || "";
              if (meta.tam) tam = meta.tam;
              if (meta.sam) sam = meta.sam;
              if (meta.som) som = meta.som;
              if (meta.business_model) businessModel = meta.business_model;
              if (meta.pitch) pitch = meta.pitch;
            }
          } catch (e) {
            // Ignored
          }

          const isDone = s.status === 'Completed' || (s.progress && s.progress >= 100);

          return {
            id: s.id,
            name: s.organization || `Project ${s.name}`,
            category: s.inquiry_type === 'problem' ? "Deep Tech Innovation" : "Custom Solution",
            stage: isDone ? "Production" : "Execution",
            traction: isDone ? "Delivered & Live" : "Active Development",
            roi: isDone ? "Completed" : "Contracted Milestone",
            progress: s.progress || 25,
            status: s.status || "In Progress",
            holding_type: isDone ? "completed" : "doing",
            description: s.message || "Custom enterprise software engineering sprint.",
            website_url: website,
            milestones: [
              `Phase 1: Architecture (${s.progress && s.progress >= 20 ? '100%' : 'In Progress'})`,
              `Phase 2: Alpha Testing (${s.progress && s.progress >= 40 ? '100%' : 'Pending'})`,
              `Phase 3: Integration (${s.progress && s.progress >= 60 ? '100%' : 'Pending'})`,
              `Phase 4: Client Verification (${s.progress && s.progress >= 80 ? '100%' : 'Pending'})`,
              `Phase 5: Production Handover (${s.progress === 100 ? '100%' : 'Pending'})`
            ],
            tam,
            sam,
            som,
            businessModel,
            pitch
          };
        });

      setPortfolio([...basePortfolio, ...dbStartups]);
    } catch (err) {
      console.error("Portfolio retrieval exception:", err);
      setPortfolio(basePortfolio);
    }
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
      const email = session?.user?.email || "investor@siddhidynamics.in";
      const name = session?.user?.user_metadata?.full_name || (email.includes('@') ? email.split('@')[0] : "Venture Partner");
      setInvestorEmail(email);
      setInvestorName(name);

      fetchPortfolioData(email).finally(() => {
        setLoading(false);
      });
    });
  }, [navigate]);

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
    } catch (err) {
      console.error("Failed to load chat messages:", err);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (chatOpen && investorSubmissionId) {
      loadChatMessages();
      const channel = supabase
        .channel(`investor-chat-${investorSubmissionId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `submission_id=eq.${investorSubmissionId}` },
          (payload) => {
            setChatMessages(prev => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [chatOpen, investorSubmissionId]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !investorSubmissionId) return;

    const msg = chatInput.trim();
    setChatInput("");
    setSendingMsg(true);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          submission_id: investorSubmissionId,
          sender_email: investorEmail,
          message: msg,
          is_admin: false
        });

      if (error) throw error;

      const systemInstruction = `You are the Executive Investor Relations AI Assistant for Siddhi Dynamics (siddhidynamics.in).
Founder & Technical Director: Sai Vara Prasad.
Enterprise Valuation / Market Cap: ₹20 Crore ($2.4M USD).
Ecosystem ARR: ₹1.24 Crore ($150k USD). MRR: ₹10.3 Lakhs. Gross Margins: 68%.
Core Portfolio Pillars:
1. Projects We Hold (Proprietary In-house IP): Siddhi ERP Suite (manufacturing/GST compliance), WishO Landing (AI landing page generator), ArchPlan Smart Core (CAD architectural anomaly detection), EcoGrid AI (clean energy microgrid dispatch), PrintFlow Commerce (web-to-print operations).
2. Projects Doing: Custom enterprise logistics, ABDM healthtech telemetry, offline-first multi-store retail POS.
3. Projects Completed: VMagnetic Minds digital agency engine, luxury PropTech CRM, industrial CNC IoT gateway.
Industry Standings: 4.9/5.0★ verified satisfaction, 99.98% Cloudflare edge uptime SLA, top 5% B2B tech search benchmark.
Key Features: Direct banking & UPI QR codes (zero payment gateway fee deductions), strict admin gating of team/interns, free onboarding for clients/partners/investors.
Always respond with crisp, authoritative, high-contrast financial clarity. If the query asks for confidential term sheets or direct founder calls, flag with [ESCFLAG].`;

      const historyPayload = chatMessages.slice(-8).map(m => ({
        role: m.is_admin ? 'model' : 'user',
        parts: [{ text: m.message }]
      }));

      historyPayload.push({
        role: 'user',
        parts: [{ text: msg }]
      });

      const aiText = await generateContent(historyPayload, systemInstruction);
      const isEscalated = aiText.includes('[ESCFLAG]');
      const cleanAiText = aiText.replace('[ESCFLAG]', '').trim();

      await supabase
        .from('chat_messages')
        .insert({
          submission_id: investorSubmissionId,
          sender_email: 'ir_assistant@siddhidynamics.in',
          message: cleanAiText,
          is_admin: true
        });

      if (isEscalated) {
        toast.info("Your query has been escalated to founder Sai Vara Prasad. A direct follow-up will be scheduled.");
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

  const handleSyncData = async () => {
    setLoading(true);
    await fetchPortfolioData(investorEmail);
    setLoading(false);
    toast.success("Venture portfolio records synchronized.");
  };

  // Filtered portfolio list based on search, stage, and 3-way holding type
  const filteredPortfolio = portfolio.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHolding = holdingFilter === 'all' || item.holding_type === holdingFilter;
    const matchesStage = stageFilter === "all" || item.stage.toLowerCase() === stageFilter.toLowerCase();
    
    return matchesSearch && matchesHolding && matchesStage;
  });

  // Project counts across the 3 segregated categories
  const countWeHold = portfolio.filter(p => p.holding_type === 'we_hold').length;
  const countDoing = portfolio.filter(p => p.holding_type === 'doing').length;
  const countCompleted = portfolio.filter(p => p.holding_type === 'completed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] text-stone-900 flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-10 h-10 animate-spin text-stone-900" />
        <p className="text-stone-600 text-xs font-bold tracking-widest uppercase">Loading Investor Command Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#29251d] relative overflow-x-hidden font-sans selection:bg-stone-300">
      <Navbar />
      <Helmet>
        <title>Venture & Investor Dashboard | Siddhi Dynamics</title>
        <meta name="description" content="Siddhi Dynamics active enterprise startup portfolio, Cap Table, ARR analytics, and accredited investor relations console." />
      </Helmet>

      <main className="container mx-auto px-4 sm:px-6 pt-28 pb-24 max-w-6xl relative z-10 space-y-8">
        <InvestorPipelineRollup />

        {/* ── Header Bar ────────────────────────────────────────────────────── */}
        <div className="rounded-[28px] bg-[#292a22] text-white p-6 sm:p-8 shadow-xl shadow-stone-900/10 border border-stone-800">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-stone-800/80 text-lime-300 font-extrabold text-[11px] uppercase tracking-wider border border-lime-400/20">
                  Accredited Investor Console
                </span>
                <span className="px-3 py-1 rounded-full bg-stone-800/80 text-stone-300 font-extrabold text-[11px] uppercase tracking-wider border border-stone-700">
                  Enterprise ₹20 Cr Cap
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mt-2 text-white tracking-tight">
                Siddhi Dynamics Investor Portal
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 font-medium">
                Venture Partner: <span className="text-lime-300 font-bold">{investorName}</span> · <span className="text-stone-400 font-mono">{investorEmail}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                onClick={handleSyncData}
                className="p-3 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-white font-bold transition-all flex items-center gap-2 text-xs cursor-pointer shadow-xs"
                title="Sync Portfolio Ledger"
              >
                <RefreshCw className="w-4 h-4 text-lime-300" />
                <span className="hidden sm:inline">Sync Data</span>
              </button>

              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center gap-2 bg-lime-300 hover:bg-lime-400 text-stone-950 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-stone-950" /> IR AI Assistant
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-stone-700 hover:bg-stone-800 text-stone-300 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* ── High-Impact Strategic KPI Banner (Clean White Cards) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-left space-y-3 shadow-sm text-stone-900">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-600 font-bold uppercase tracking-wider">Enterprise Valuation</span>
              <Building className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <p className="text-3xl font-black text-stone-900 tracking-tight">₹20.0 Cr</p>
              <p className="text-xs text-emerald-700 font-bold mt-1">▲ $2.4M USD · Seed Valuation</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-left space-y-3 shadow-sm text-stone-900">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-600 font-bold uppercase tracking-wider">Annual Run Rate (ARR)</span>
              <TrendingUp className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <p className="text-3xl font-black text-stone-900 tracking-tight">₹1.24 Cr</p>
              <p className="text-xs text-stone-700 font-bold mt-1">▲ ₹10.3L MRR · +24% MoM</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-left space-y-3 shadow-sm text-stone-900">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-600 font-bold uppercase tracking-wider">Gross Operating Margin</span>
              <DollarSign className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <p className="text-3xl font-black text-stone-900 tracking-tight">68.4%</p>
              <p className="text-xs text-amber-700 font-bold mt-1">High-Efficiency SaaS & Retainers</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-left space-y-3 shadow-sm text-stone-900">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-600 font-bold uppercase tracking-wider">Client Retention Rate</span>
              <Award className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <p className="text-3xl font-black text-stone-900 tracking-tight">94.2%</p>
              <p className="text-xs text-emerald-700 font-bold mt-1">4.9/5.0★ Google Satisfaction</p>
            </div>
          </div>
        </div>

        {/* ── Main Tab Navigation Bar ────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'overview', label: 'Executive Overview & Cap Table', icon: PieChart },
            { id: 'projects', label: `Projects Portfolio (${portfolio.length})`, icon: Briefcase },
            { id: 'financials', label: 'Revenue Engine & Unit Economics', icon: BarChart3 },
            { id: 'journey', label: 'Roadmap & Key Milestones', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                  isSel 
                    ? 'bg-stone-900 text-white shadow-md font-extrabold' 
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/90 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSel ? 'text-lime-300' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: EXECUTIVE OVERVIEW, CAP TABLE & WHAT WE DO ─────────────── */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
            
            {/* Cap Table & Valuation Structure */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 space-y-6 shadow-sm text-stone-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-stone-900" />
                    <h2 className="text-2xl font-black text-stone-900">Enterprise Capitalization Table (Cap Table)</h2>
                  </div>
                  <p className="text-stone-600 text-xs sm:text-sm mt-1">
                    Current pre-money valuation benchmark: <span className="text-stone-900 font-extrabold">₹20,00,00,000 (₹20 Cr / $2.4M USD)</span>. Unencumbered clean cap structure.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                    Seed Growth Round
                  </span>
                </div>
              </div>

              {/* Cap Table Breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-stone-50 text-stone-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-stone-200">
                    <tr>
                      <th className="p-4">Stakeholder Group</th>
                      <th className="p-4">Equity Holding (%)</th>
                      <th className="p-4">Implicit Valuation (₹)</th>
                      <th className="p-4">Share Class</th>
                      <th className="p-4">Governance Rights</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800 font-medium">
                    <tr className="hover:bg-stone-50 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-stone-900 text-sm">Founders & Leadership Team</div>
                        <div className="text-stone-500 text-xs">Sai Vara Prasad & Core Engineering Operators</div>
                      </td>
                      <td className="p-4 font-black text-emerald-700 text-base">70.0%</td>
                      <td className="p-4 font-extrabold text-stone-900">₹14,00,00,000 (₹14.0 Cr)</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-bold text-xs border border-stone-200">Class A Common</span></td>
                      <td className="p-4 text-stone-700">Full Board & Voting Majority</td>
                    </tr>
                    <tr className="hover:bg-stone-50 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-stone-900 text-sm">Strategic Angel & Early Investors</div>
                        <div className="text-stone-500 text-xs">Domain Mentors, Ecosystem Partners & Advisors</div>
                      </td>
                      <td className="p-4 font-black text-emerald-700 text-base">15.0%</td>
                      <td className="p-4 font-extrabold text-stone-900">₹3,00,00,000 (₹3.0 Cr)</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">Series Seed Pref</span></td>
                      <td className="p-4 text-stone-700">Information & Tag-Along Rights</td>
                    </tr>
                    <tr className="hover:bg-stone-50 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-stone-900 text-sm">Employee & Engineering Stock Option Pool (ESOP)</div>
                        <div className="text-stone-500 text-xs">Reserved for Principal Architects & Key Technical Hires</div>
                      </td>
                      <td className="p-4 font-black text-amber-700 text-base">10.0%</td>
                      <td className="p-4 font-extrabold text-stone-900">₹2,00,00,000 (₹2.0 Cr)</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">ESOP Trust</span></td>
                      <td className="p-4 text-stone-700">4-Year Vesting with 1-Year Cliff</td>
                    </tr>
                    <tr className="hover:bg-stone-50 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-stone-900 text-sm">Treasury & Strategic Advisory Reserve</div>
                        <div className="text-stone-500 text-xs">Unallocated Ecosystem Liquidity Buffer</div>
                      </td>
                      <td className="p-4 font-black text-stone-900 text-base">5.0%</td>
                      <td className="p-4 font-extrabold text-stone-900">₹1,00,00,000 (₹1.0 Cr)</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-bold text-xs border border-stone-200">Treasury Reserve</span></td>
                      <td className="p-4 text-stone-700">Board Discretionary Allocation</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-stone-100 text-stone-900 font-black border-t-2 border-stone-200">
                    <tr>
                      <td className="p-4 text-stone-900 uppercase tracking-wider text-xs font-bold">Total Authorized Share Capital</td>
                      <td className="p-4 text-emerald-700 text-base">100.0%</td>
                      <td className="p-4 text-stone-900 text-base">₹20,00,00,000 (₹20 Cr)</td>
                      <td className="p-4" colSpan={2}>100% Fully Diluted Basis</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* ── What We Do: 4 Core Technology Pillars ───────────────────────── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-stone-900" />
                <h2 className="text-2xl font-black text-stone-900">What We Do: Enterprise Technology Architecture</h2>
              </div>
              <p className="text-stone-600 text-sm">
                Siddhi Dynamics operates at the convergence of modern cloud engineering, proprietary SaaS software, and automated operational intelligence.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-sm text-stone-900">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-stone-900">Enterprise SaaS & Next-Gen ERP</h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    Building robust, GST-compliant enterprise software suites (e.g. Siddhi ERP) that replace fragmented paper workflows in Indian manufacturing, logistics, and supply chain hubs with real-time analytics.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-sm text-stone-900">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-stone-900">AI Agent Workflows & Intelligent RAG</h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    Deploying stateful multi-agent systems and retrieval-augmented generation pipelines that automate client support, code verification, contract validation, and real-time operational telemetry.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-sm text-stone-900">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center font-bold">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-stone-900">SEO, GEO & Generative Engine Optimization</h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    Pioneering algorithmic visibility across AI search engines (Perplexity, ChatGPT Search, Google AI Overviews) and local Google Business Profile dominance for B2B brands and enterprise leaders.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-sm text-stone-900">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-stone-900">Zero-Intermediary Direct Payout Engine</h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    Operating direct UPI QR and SBI corporate banking verification that eliminates standard 2-3% payment gateway fee leakage, ensuring 100% of revenue flows directly into corporate treasuries.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Our Industry Standing & Verified Rankings ──────────────────── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 space-y-6 shadow-sm text-stone-900">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h2 className="text-2xl font-black text-stone-900">Our Industry Standing & Verified Benchmarks</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-2xl font-black text-stone-900">4.9 / 5.0</p>
                  <p className="text-xs text-stone-700 font-bold">Google Business Review Score</p>
                  <p className="text-[11px] text-stone-500">Verified by executive client reviews</p>
                </div>

                <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <Globe className="w-5 h-5 text-stone-700" />
                  <p className="text-2xl font-black text-stone-900">99.98%</p>
                  <p className="text-xs text-stone-700 font-bold">Cloudflare Edge Uptime SLA</p>
                  <p className="text-[11px] text-stone-500">Distributed multi-region infrastructure</p>
                </div>

                <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <p className="text-2xl font-black text-stone-900">Top 5%</p>
                  <p className="text-xs text-stone-700 font-bold">AEO & GEO Search Benchmark</p>
                  <p className="text-[11px] text-stone-500">Dominating Indian B2B tech search queries</p>
                </div>

                <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <ShieldCheck className="w-5 h-5 text-stone-700" />
                  <p className="text-2xl font-black text-stone-900">100%</p>
                  <p className="text-xs text-stone-700 font-bold">Milestone-Gated Handover</p>
                  <p className="text-[11px] text-stone-500">Zero unverified scope deliverables</p>
                </div>
              </div>
            </div>

            {/* ── Key Achievements & Governance Milestones ─────────────────────── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 space-y-5 shadow-sm text-stone-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-2xl font-black text-stone-900">Institutional Milestones & Governance Achievements</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Multi-Role Ecosystem Gating",
                    desc: "Implemented strict Admin permission controls for Intern and Employee portals, while maintaining friction-free instant onboarding for Clients, Agency Partners, and Investors."
                  },
                  {
                    title: "Agency Commission & Non-Commission Engine",
                    desc: "Admin-governed partnership model supporting both configurable percentage commissions (10%-25%) and direct retainer non-commission agency operations."
                  },
                  {
                    title: "Zero-Deduction Direct Banking",
                    desc: "Dynamic UPI QR code (`siddhidynamics@sbi`) and SBI current account wire system with admin UTR proof verification, saving thousands in gateway surcharges."
                  },
                  {
                    title: "Client-to-Agency Self-Transformation",
                    desc: "Seamless pathway allowing satisfied enterprise clients to upgrade into regional Agency Partners without losing project histories or credentials."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-sm">{item.title}</h4>
                      <p className="text-stone-600 text-xs mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* ── TAB 2: PROJECTS PORTFOLIO (3-WAY SEGREGATION) ─────────────────── */}
        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
            
            {/* Header with Segregated Filter Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">Ecosystem Project Portfolio</h2>
                <p className="text-stone-600 text-xs mt-0.5">Segregated across Proprietary Assets (We Hold), Active Sprints (Doing), and Verified Launches (Completed).</p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search project or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900 shadow-xs"
                />
              </div>
            </div>

            {/* 3-Way Category Segregation Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setHoldingFilter('all')}
                className={`p-3 rounded-xl border text-left font-extrabold text-xs transition-all cursor-pointer flex items-center justify-between ${
                  holdingFilter === 'all'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>All Projects</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${holdingFilter === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700'}`}>{portfolio.length}</span>
              </button>

              <button
                onClick={() => setHoldingFilter('we_hold')}
                className={`p-3 rounded-xl border text-left font-extrabold text-xs transition-all cursor-pointer flex items-center justify-between ${
                  holdingFilter === 'we_hold'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="flex items-center gap-1.5">🛡️ Projects We Hold</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${holdingFilter === 'we_hold' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700'}`}>{countWeHold}</span>
              </button>

              <button
                onClick={() => setHoldingFilter('doing')}
                className={`p-3 rounded-xl border text-left font-extrabold text-xs transition-all cursor-pointer flex items-center justify-between ${
                  holdingFilter === 'doing'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="flex items-center gap-1.5">⚡ Projects Doing</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${holdingFilter === 'doing' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700'}`}>{countDoing}</span>
              </button>

              <button
                onClick={() => setHoldingFilter('completed')}
                className={`p-3 rounded-xl border text-left font-extrabold text-xs transition-all cursor-pointer flex items-center justify-between ${
                  holdingFilter === 'completed'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="flex items-center gap-1.5">✅ Projects Completed</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${holdingFilter === 'completed' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700'}`}>{countCompleted}</span>
              </button>
            </div>

            {/* Project Cards Grid */}
            {filteredPortfolio.length === 0 ? (
              <div className="p-16 rounded-3xl bg-white border border-dashed border-stone-200 text-center space-y-3 shadow-sm">
                <Briefcase className="w-12 h-12 text-stone-400 mx-auto" />
                <h3 className="text-lg font-bold text-stone-900">No projects found in this view</h3>
                <p className="text-stone-500 text-xs max-w-md mx-auto">Try resetting filters or searching for another term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredPortfolio.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedProject(item)}
                    className="p-6 rounded-3xl bg-white border border-stone-200 hover:border-stone-400 flex flex-col justify-between cursor-pointer transition-all shadow-sm group space-y-4 text-stone-900"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded border ${
                              item.holding_type === 'we_hold' ? 'bg-stone-900 text-white border-stone-900' :
                              item.holding_type === 'doing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {item.holding_type === 'we_hold' ? '🛡️ We Hold (IP)' :
                               item.holding_type === 'doing' ? '⚡ Active Sprint' : '✅ Production Live'}
                            </span>
                            <span className="text-[11px] text-stone-500 font-semibold">{item.category}</span>
                          </div>
                          <h3 className="text-xl font-black text-stone-900 group-hover:text-stone-700 transition-colors mt-1.5">
                            {item.name}
                          </h3>
                        </div>

                        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium">
                        {item.description}
                      </p>

                      {/* Mini Telemetry Grid */}
                      <div className="grid grid-cols-3 gap-2 bg-stone-50 rounded-2xl p-3 border border-stone-200 text-center text-xs">
                        <div>
                          <p className="text-[10px] text-stone-500 uppercase font-extrabold">Stage</p>
                          <p className="font-bold text-stone-900 mt-0.5">{item.stage}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-500 uppercase font-extrabold">Traction</p>
                          <p className="font-bold text-emerald-700 mt-0.5 truncate px-1">{item.traction.split('·')[0] || item.traction}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-500 uppercase font-extrabold">TAM / Market</p>
                          <p className="font-bold text-stone-900 mt-0.5 truncate px-1">{item.tam?.split('(')[0] || '₹500 Cr+'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Modal Trigger */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-[10px] font-extrabold text-stone-600">
                          <span>Milestone Completion</span>
                          <span className="text-stone-900 font-mono font-bold">{item.progress}%</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                          <div
                            className="h-full bg-stone-900 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>

                      <span className="text-xs font-black text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                        View Dossier <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </motion.div>
        )}

        {/* ── TAB 3: REVENUE ENGINE & FINANCIALS ────────────────────────────── */}
        {activeTab === 'financials' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
            
            {/* Top Revenue Statistics */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 space-y-6 shadow-sm text-stone-900">
              <div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-stone-900" />
                  <h2 className="text-2xl font-black text-stone-900">Revenue Architecture & Capital Efficiency</h2>
                </div>
                <p className="text-stone-600 text-xs sm:text-sm mt-1">
                  Financial figures verified across corporate accounts and active milestone receivables.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <p className="text-xs text-stone-500 font-extrabold uppercase tracking-wider">Current ARR</p>
                  <p className="text-3xl font-black text-stone-900">₹1.24 Cr</p>
                  <p className="text-xs text-emerald-700 font-bold">▲ +12% QoQ Growth</p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <p className="text-xs text-stone-500 font-extrabold uppercase tracking-wider">Monthly Recurring (MRR)</p>
                  <p className="text-3xl font-black text-stone-900">₹10.3 Lakhs</p>
                  <p className="text-xs text-stone-700 font-bold">Predictable Retainer Income</p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <p className="text-xs text-stone-500 font-extrabold uppercase tracking-wider">Gross Profit Margin</p>
                  <p className="text-3xl font-black text-stone-900">68.4%</p>
                  <p className="text-xs text-amber-700 font-bold">Lean Cloud Infrastructure</p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <p className="text-xs text-stone-500 font-extrabold uppercase tracking-wider">Capital Allocated</p>
                  <p className="text-3xl font-black text-stone-900">100%</p>
                  <p className="text-xs text-stone-700 font-bold">Milestone-Gated Handover</p>
                </div>
              </div>
            </div>

            {/* Revenue Streams Breakdown */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 space-y-5 shadow-sm text-stone-900">
              <h3 className="text-xl font-black text-stone-900">Diversified Revenue Stream Composition</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold text-stone-900 mb-1.5">
                    <span>1. Enterprise Software & Next-Gen ERP Retainers</span>
                    <span className="text-emerald-700">48% of Gross ARR</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div className="h-full bg-stone-900 w-[48%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold text-stone-900 mb-1.5">
                    <span>2. SEO, GEO & AEO Organic Marketing Engine</span>
                    <span className="text-stone-700">27% of Gross ARR</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div className="h-full bg-stone-700 w-[27%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold text-stone-900 mb-1.5">
                    <span>3. AI Agent Architecture & Cloud Engineering Sprints</span>
                    <span className="text-stone-700">15% of Gross ARR</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div className="h-full bg-stone-600 w-[15%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold text-stone-900 mb-1.5">
                    <span>4. Proprietary Product Licensing (WishO & PrintFlow)</span>
                    <span className="text-amber-700">10% of Gross ARR</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div className="h-full bg-amber-600 w-[10%]" />
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* ── TAB 4: ROADMAP & JOURNEY ───────────────────────────────────────── */}
        {activeTab === 'journey' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl mx-auto text-left">
            <div className="text-center py-2">
              <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-800 font-extrabold text-xs uppercase tracking-wider border border-stone-200">
                Institutional Milestones
              </span>
              <h3 className="text-3xl font-black text-stone-900 mt-2">Strategic Execution Timeline</h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-1">
                Tracing our architectural roadmap from early prototyping to multi-portal enterprise scale.
              </p>
            </div>

            {/* Timeline Vertical Track */}
            <div className="relative border-l-2 border-stone-300 ml-4 sm:ml-28 space-y-8 pt-4 pb-8">
              
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-stone-900 border-2 border-white" />
                <span className="absolute -left-28 top-0.5 text-xs font-black text-stone-900 hidden sm:block">2025 Q3</span>
                <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-sm text-stone-900">
                  <span className="text-[10px] font-black text-stone-900 uppercase sm:hidden">2025 Q3</span>
                  <h4 className="text-base font-extrabold text-stone-900">Architecture Formulation & Core Mandate</h4>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    Siddhi Dynamics launched its core mission: delivering ultra-modern enterprise software, zero-latency frontend applications, and GST-ready ERP automation for Indian manufacturing firms.
                  </p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-stone-900 border-2 border-white" />
                <span className="absolute -left-28 top-0.5 text-xs font-black text-stone-900 hidden sm:block">2026 Q1</span>
                <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-sm text-stone-900">
                  <span className="text-[10px] font-black text-stone-900 uppercase sm:hidden">2026 Q1</span>
                  <h4 className="text-base font-extrabold text-stone-900">Database Migration & Security Hardening</h4>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    Executed robust Row-Level Security (RLS) migrations and anti-spam constraints across Supabase PostgreSQL databases, securing multi-portal data isolation.
                  </p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-lime-400 border-2 border-stone-900 animate-pulse" />
                <span className="absolute -left-28 top-0.5 text-xs font-black text-stone-900 hidden sm:block">2026 Q2 (Current)</span>
                <div className="p-5 rounded-2xl bg-white border border-stone-300 space-y-1.5 shadow-sm text-stone-900">
                  <span className="text-[10px] font-black text-stone-900 uppercase sm:hidden">2026 Q2</span>
                  <h4 className="text-base font-extrabold text-stone-900">Unified Portal Gateway & Zero-Fee Banking</h4>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-medium">
                    Launched full direct UPI QR deposits, Admin-governed role gating (with intern/employee approval queues), client-to-agency transformations, and accredited investor relations consoles.
                  </p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-stone-400 border-2 border-white" />
                <span className="absolute -left-28 top-0.5 text-xs font-black text-stone-500 hidden sm:block">2026 Q3-Q4</span>
                <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1.5 text-stone-900 shadow-sm">
                  <span className="text-[10px] font-black text-stone-500 uppercase sm:hidden">2026 Q3-Q4</span>
                  <h4 className="text-base font-extrabold text-stone-700">Scale Incubation & Commercial Pilot Expansions</h4>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    National commercial deployments of Siddhi ERP across Gujarat and Telangana manufacturing corridors, coupled with Web-to-print rollouts for PrintFlow Commerce.
                  </p>
                </div>
              </div>

            </div>

          </motion.div>
        )}

        <div className="pt-8">
          <FooterSection />
        </div>
      </main>

      {/* ── PROJECT DOSSIER MODAL ───────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[250] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-left shadow-2xl text-stone-900"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-stone-100 text-stone-800 border border-stone-200 uppercase">
                      {selectedProject.category}
                    </span>
                    <span className="text-xs font-bold text-stone-500">{selectedProject.stage} Stage</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                    {selectedProject.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-900 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pitch Summary */}
              {selectedProject.pitch && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 text-sm font-semibold italic">
                  "{selectedProject.pitch}"
                </div>
              )}

              {/* Comprehensive Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Solution Architecture & Scope</h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                  {selectedProject.description}
                </p>
              </div>

              {/* Business Model & Market Sizing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Total Addressable (TAM)</p>
                  <p className="font-extrabold text-stone-900 text-sm mt-0.5">{selectedProject.tam || "₹500 Cr+"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Serviceable (SAM)</p>
                  <p className="font-extrabold text-stone-900 text-sm mt-0.5">{selectedProject.sam || "₹60 Cr"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Obtainable (SOM)</p>
                  <p className="font-extrabold text-emerald-700 text-sm mt-0.5">{selectedProject.som || "₹12 Cr"}</p>
                </div>
              </div>

              {/* Monetization Model */}
              {selectedProject.businessModel && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Monetization Engine</p>
                  <p className="text-xs sm:text-sm text-stone-800 font-medium">{selectedProject.businessModel}</p>
                </div>
              )}

              {/* Milestones Audit Trail */}
              {selectedProject.milestones && selectedProject.milestones.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Verified Milestone Deliverables</h4>
                  <div className="space-y-2">
                    {selectedProject.milestones.map((ms, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs text-stone-800">
                        <span className="font-semibold">{ms}</span>
                        <span className="text-emerald-700 font-bold font-mono">Verified</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.website_url && (
                <div className="pt-2">
                  <a
                    href={selectedProject.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>Launch Live Prototype / Website</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── AI INVESTOR RELATIONS CHAT DRAWER ──────────────────────────────── */}
      <AnimatePresence>
        {chatOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[270] flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full sm:w-[450px] h-full bg-white border-l border-stone-200 flex flex-col shadow-2xl text-stone-900"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 text-lime-300 flex items-center justify-center font-bold">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-extrabold text-stone-900 text-base">Executive IR Assistant</h3>
                    <p className="text-[11px] text-emerald-700 font-bold">● Active Strategy & Financial Intelligence</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-2 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-900 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-left">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 leading-relaxed font-medium">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">IR Protocol</span>
                  Welcome <span className="font-bold text-stone-900">{investorName}</span>. I can answer inquiries regarding our ₹20 Cr Cap Table, ARR growth engine, proprietary projects (*Siddhi ERP*, *WishO*, *ArchPlan*), or connect you directly with founder Sai Vara Prasad.
                </div>

                {chatMessages.map((msg, i) => (
                  <div
                    key={msg.id || i}
                    className={`flex flex-col ${msg.is_admin ? 'items-start' : 'items-end'}`}
                  >
                    <span className="text-[10px] font-bold text-stone-400 mb-1">
                      {msg.is_admin ? 'Siddhi IR Assistant' : 'You'}
                    </span>
                    <div
                      className={`p-4 rounded-2xl max-w-[85%] leading-relaxed text-xs sm:text-sm ${
                        msg.is_admin
                          ? 'bg-stone-100 text-stone-900 border border-stone-200 font-medium'
                          : 'bg-stone-900 text-white font-semibold shadow-xs'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}

                {sendingMsg && (
                  <div className="flex items-center gap-2 text-stone-500 text-xs italic">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-stone-700" />
                    <span>Analyzing venture model...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendChat} className="p-4 border-t border-stone-200 bg-stone-50 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about valuation, unit economics, projects..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-800 border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  disabled={sendingMsg || !chatInput.trim()}
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



    </div>
  );
}

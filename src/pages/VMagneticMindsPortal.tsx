import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { GoogleReviewCard } from "@/components/GoogleReviewCard";
import {
  Search, Globe, Bot, MapPin, TrendingUp, CheckCircle, Clock, Calendar,
  ShieldCheck, RefreshCw, MessageCircle, Send, Sparkles, CreditCard, QrCode,
  Download, Building2, BarChart3, FileText, Users, Copy, Check, LogOut,
  AlertCircle, Plus, X, ChevronRight, Phone, Mail, Instagram, Youtube,
  Facebook, Linkedin, Target, Image, Briefcase, Star
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'seo-geo' | 'analytics' | 'clients' | 'billing' | 'chat';

interface ClientBrand {
  id: string;
  businessName: string;
  brandName: string;
  category: string;
  description: string;
  website: string;
  contactName: string;
  mobile: string;
  email: string;
  address: string;
  goals: string[];
  socialFb: string;
  socialIg: string;
  socialLi: string;
  socialYt: string;
  addedAt: string;
}

const BUSINESS_GOALS = [
  "More Calls", "More Leads", "More Website Traffic",
  "More Walk-in Customers", "Better Google Search Visibility",
  "Better Google Maps Visibility", "Better AI Search Visibility"
];

const TABS: { id: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'overview',  label: '12-Month Executive SLA',    icon: <Calendar className="w-5 h-5" />,      desc: 'Contract & roadmap progress' },
  { id: 'seo-geo',   label: 'SEO / GEO / AEO & GBP Hub', icon: <Search className="w-5 h-5" />,        desc: 'Search & AI optimisation' },
  { id: 'analytics', label: 'GA Monthly Reports',         icon: <BarChart3 className="w-5 h-5" />,     desc: 'Traffic & conversion data' },
  { id: 'clients',   label: 'Client Portfolio',           icon: <Users className="w-5 h-5" />,         desc: 'Add & manage client brands' },
  { id: 'billing',   label: 'UPI Payments & Invoices',    icon: <CreditCard className="w-5 h-5" />,    desc: 'Pay & track invoices' },
  { id: 'chat',      label: 'AI Support Coordinator',     icon: <Bot className="w-5 h-5" />,           desc: 'Siddhi AI assistant' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function VMagneticMindsPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("23eg510a07@anurag.edu.in");
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ── UPI / billing ──────────────────────────────────────────────────────────
  const upiId      = "6303602743@upi";
  const payeeName  = "Siddhi Dynamics LLP";
  const upiName    = "Siddhi Dynamics";
  const monthlyFee = "₹25,000";

  // All pending – no payment received yet
  const [invoices] = useState([
    { id: "INV-VMM-001", month: "Month 1 (Aug 2026)", amount: "₹25,000", rawAmount: "25000", status: "Pending",  date: "2026-08-01", desc: "12-Month SLA Onboarding: SEO, GEO, AEO & GBP Setup" },
    { id: "INV-VMM-002", month: "Month 2 (Sep 2026)", amount: "₹25,000", rawAmount: "25000", status: "Upcoming", date: "2026-09-01", desc: "Month 2 SEO/GEO Optimisation & GA Monthly Report" },
    { id: "INV-VMM-003", month: "Month 3 (Oct 2026)", amount: "₹25,000", rawAmount: "25000", status: "Upcoming", date: "2026-10-01", desc: "Month 3 AI Search Citation Expansion & GBP Posts" },
  ]);

  const [payModalOpen,   setPayModalOpen]   = useState(false);
  const [selInvoice,     setSelInvoice]     = useState<typeof invoices[0] | null>(null);
  const [utrInput,       setUtrInput]       = useState("");
  const [submittingUtr,  setSubmittingUtr]  = useState(false);

  const buildUpiLink = (app: string) => {
    const amt = selInvoice?.rawAmount || "25000";
    const base = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amt}&cu=INR&tn=${encodeURIComponent(selInvoice?.id || 'SLA')}`;
    const map: Record<string, string> = {
      gpay:    `tez://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amt}&cu=INR`,
      phonepe: `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amt}&cu=INR`,
      paytm:   `paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amt}&cu=INR`,
      bhim:    base,
    };
    return map[app] || base;
  };

  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (utrInput.trim().length < 8) { toast.error("Enter a valid UTR (min 8 digits)"); return; }
    setSubmittingUtr(true);
    setTimeout(() => {
      setSubmittingUtr(false);
      setPayModalOpen(false);
      setUtrInput("");
      toast.success(`UTR for ${selInvoice?.id} submitted. saivaraprasad will verify within 2 hrs.`);
    }, 1200);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ── Clients ────────────────────────────────────────────────────────────────
  const [clients, setClients] = useState<ClientBrand[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [clientForm, setClientForm] = useState({
    businessName: "", brandName: "", category: "", description: "",
    yearEst: "", website: "", services: "", hours: "",
    contactName: "", mobile: "", whatsapp: "", email: "",
    address: "", mapsLink: "", landmark: "", serviceAreas: "",
    brandColors: "", fbLink: "", igLink: "", liLink: "", ytLink: "",
    testimonials: "",
  });
  const [savingClient, setSavingClient] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const cf = (key: keyof typeof clientForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setClientForm(prev => ({ ...prev, [key]: e.target.value }));

  const toggleGoal = (g: string) =>
    setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.businessName.trim() || !clientForm.contactName.trim()) {
      toast.error("Business name and contact name are required."); return;
    }
    setSavingClient(true);
    setTimeout(() => {
      const newClient: ClientBrand = {
        id: `client-${Date.now()}`,
        businessName: clientForm.businessName,
        brandName:    clientForm.brandName || clientForm.businessName,
        category:     clientForm.category,
        description:  clientForm.description,
        website:      clientForm.website,
        contactName:  clientForm.contactName,
        mobile:       clientForm.mobile,
        email:        clientForm.email,
        address:      clientForm.address,
        goals:        selectedGoals,
        socialFb:     clientForm.fbLink,
        socialIg:     clientForm.igLink,
        socialLi:     clientForm.liLink,
        socialYt:     clientForm.ytLink,
        addedAt:      new Date().toISOString(),
      };
      setClients(prev => [...prev, newClient]);
      setSavingClient(false);
      setShowClientForm(false);
      setClientForm({
        businessName: "", brandName: "", category: "", description: "",
        yearEst: "", website: "", services: "", hours: "",
        contactName: "", mobile: "", whatsapp: "", email: "",
        address: "", mapsLink: "", landmark: "", serviceAreas: "",
        brandColors: "", fbLink: "", igLink: "", liLink: "", ytLink: "",
        testimonials: "",
      });
      setSelectedGoals([]);
      toast.success(`${newClient.businessName} added to your portfolio!`);
    }, 800);
  };

  // ── Chat ───────────────────────────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "Siddhi AI", text: "Welcome V Magnetic Minds! I'm your dedicated AI coordinator for your 12-month SEO, GEO, AEO & GBP programme. How can I help today?", time: "Now", isAdmin: true }
  ]);
  const [chatInput, setChatInput] = useState("");

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "V Magnetic Minds", text: msg, time: "Now", isAdmin: false }]);
    setTimeout(() => {
      let reply = "Thank you! I've logged your request. saivaraprasad will review and respond.";
      if (/payment|upi|invoice|billing/i.test(msg))
        reply = `Pay via UPI ID: ${upiId} or scan the QR in the Billing tab. After paying, submit your UTR reference there.`;
      else if (/seo|geo|gbp|aeo|rank/i.test(msg))
        reply = "Your GEO score is being built out. The first full SEO/GEO/GBP audit will be completed in Month 1 and shared in the Analytics tab.";
      else if (/client|add|portfolio/i.test(msg))
        reply = "Head to the Client Portfolio tab to add your client brands using the detailed information form. Each client gets full SEO/GEO/GBP treatment.";
      setChatMessages(prev => [...prev, { sender: "Siddhi AI", text: reply, time: "Now", isAdmin: true }]);
    }, 900);
  };

  // ── Auth ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) setUserEmail(session.user.email);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info("Logged out of V Magnetic Minds Portal.");
    navigate("/portal");
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <RefreshCw className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  // ─── Input helper styles ───────────────────────────────────────────────────
  const inp = "w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
  const lbl = "block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>V Magnetic Minds Portal | Siddhi Dynamics</title>
        <meta name="description" content="Executive Agency Portal for V Magnetic Minds – 12-Month SEO, GEO, AEO & GBP Management." />
      </Helmet>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">

        {/* ── Header Banner ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl border border-border p-6 md:p-8 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-border flex items-center justify-center shrink-0 overflow-hidden">
                <img src="/v-magnetic-minds-logo.jpg" alt="V Magnetic Minds Logo"
                  className="w-full h-full object-contain"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">M² The Magnetic Minds</span>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">Agency Partner</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">V Magnetic Minds Portal</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{userEmail} · 12-Month SLA Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-muted-foreground">Monthly Retainer</div>
                <div className="text-xl font-extrabold text-foreground">{monthlyFee}<span className="text-xs text-muted-foreground font-normal"> / mo</span></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Billing Alert ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/30">
          <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">Payment Pending — Month 1 Invoice Due</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              No payment has been received yet. Please clear <strong>INV-VMM-001 (₹25,000)</strong> via UPI to activate your full SLA services.
              Go to the <button onClick={() => setActiveTab('billing')} className="underline text-primary font-semibold">Billing tab</button> to pay now.
            </p>
          </div>
        </motion.div>

        {/* ── 2-Column Tab Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TABS.map((tab, i) => (
            <motion.button key={tab.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-start gap-2 p-4 rounded-2xl border text-left transition-all group ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'glass-card border-border hover:border-primary/40 hover:shadow-sm'
              }`}>
              <div className={`${activeTab === tab.id ? 'text-primary-foreground' : 'text-primary'}`}>
                {tab.icon}
              </div>
              <div>
                <div className={`text-xs font-extrabold leading-tight ${activeTab === tab.id ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {tab.label}
                </div>
                <div className={`text-[10px] mt-0.5 ${activeTab === tab.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {tab.desc}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Tab Content ────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ═══ OVERVIEW ══════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Plan Duration", value: "12 Months", sub: "Aug 2026 – Aug 2027", icon: <Calendar className="w-5 h-5 text-primary" />, accent: "border-primary/20" },
                  { label: "Current Month", value: "Month 1", sub: "Onboarding & Setup", icon: <Clock className="w-5 h-5 text-amber-500" />, accent: "border-amber-500/20" },
                  { label: "SLA Status",     value: "Active", sub: "Payment pending", icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, accent: "border-emerald-500/20" },
                ].map(s => (
                  <div key={s.label} className={`glass-card rounded-2xl border ${s.accent} p-5 flex items-start gap-4`}>
                    <div className="p-2.5 bg-muted rounded-xl">{s.icon}</div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</div>
                      <div className="text-xl font-extrabold text-foreground mt-0.5">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 3-Phase Roadmap */}
              <div className="glass-card rounded-2xl border border-border p-6">
                <h3 className="text-base font-extrabold text-foreground mb-5 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> 12-Month SEO/GEO/AEO/GBP Execution Roadmap
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { phase: "Phase 1 · Months 1–4", title: "Foundation & Audit", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", tasks: ["GBP setup & optimisation", "Full SEO technical audit", "GEO keyword mapping", "Schema & structured data"] },
                    { phase: "Phase 2 · Months 5–8", title: "Growth & Visibility",  color: "text-violet-500", bg: "bg-violet-500/10 border-violet-500/20", tasks: ["AI search (GEO) citation building", "Link acquisition campaigns", "Monthly GA reporting", "AEO featured snippet targeting"] },
                    { phase: "Phase 3 · Months 9–12", title: "Dominance & Scale",  color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", tasks: ["Local Map Pack #1 defence", "Review velocity automation", "Annual analytics report", "SLA renewal & scaling review"] },
                  ].map(p => (
                    <div key={p.phase} className={`rounded-xl border ${p.bg} p-5`}>
                      <div className={`text-[10px] font-bold uppercase tracking-wider ${p.color} mb-1`}>{p.phase}</div>
                      <div className="text-sm font-extrabold text-foreground mb-3">{p.title}</div>
                      <ul className="space-y-2">
                        {p.tasks.map(t => (
                          <li key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground/50" />{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <GoogleReviewCard audience="client" name="V Magnetic Minds" compact />
            </motion.div>
          )}

          {/* ═══ SEO / GEO ═════════════════════════════════════════════════ */}
          {activeTab === 'seo-geo' && (
            <motion.div key="seo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "GEO · Generative Engine Optimisation", icon: <Bot className="w-5 h-5 text-violet-500" />, border: "border-violet-500/30", score: "Pending audit", desc: "Optimises content so AI platforms (ChatGPT, Perplexity, Gemini) cite your brand as an authoritative answer.", items: ["ChatGPT Search citation strategy", "Perplexity AI indexing", "LLMs.txt deployment", "Brand authority schema"] },
                  { title: "SEO · Organic Search Optimisation",    icon: <Search className="w-5 h-5 text-cyan-500" />, border: "border-cyan-500/30",   score: "Pending audit", desc: "Technical + content SEO to dominate Google organic results for your target keywords.", items: ["Technical site audit", "Keyword research & mapping", "On-page optimisation", "Backlink acquisition"] },
                  { title: "AEO · Answer Engine Optimisation",     icon: <Sparkles className="w-5 h-5 text-amber-500" />, border: "border-amber-500/30", score: "Pending audit", desc: "Targets featured snippets, People Also Ask, and voice search so your brand answers questions first.", items: ["FAQ schema markup", "Voice search readiness", "Featured snippet targeting", "Position Zero strategy"] },
                  { title: "GBP · Google Business Profile",        icon: <MapPin className="w-5 h-5 text-rose-500" />, border: "border-rose-500/30",  score: "Pending setup", desc: "Full GBP setup, weekly posts, photo uploads, Q&A management, and Local Map Pack ranking.", items: ["GBP creation / optimisation", "Weekly post calendar", "Review management", "Local Map Pack tracking"] },
                ].map(card => (
                  <div key={card.title} className={`glass-card rounded-2xl border ${card.border} p-6`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-muted rounded-xl">{card.icon}</div>
                        <h3 className="text-sm font-extrabold text-foreground">{card.title}</h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-muted rounded-lg text-muted-foreground border border-border">{card.score}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{card.desc}</p>
                    <ul className="space-y-2">
                      {card.items.map(item => (
                        <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="glass-card rounded-2xl border border-border p-6">
                <p className="text-sm text-center text-muted-foreground">
                  📋 Full audit scores and live dashboards will be available after <strong>Month 1 payment is cleared</strong> and onboarding is completed.
                </p>
              </div>
            </motion.div>
          )}

          {/* ═══ ANALYTICS ═════════════════════════════════════════════════ */}
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="glass-card rounded-2xl border border-border p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-extrabold text-foreground mb-2">Analytics Reports — Month 1 in Progress</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Your first GA monthly report will be generated and published here at the end of <strong>August 2026</strong> once onboarding is complete and tracking pixels are installed.
                </p>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["Organic Impressions", "Organic Clicks", "CTR %", "AI Citations (GEO)"].map(m => (
                    <div key={m} className="bg-muted rounded-xl p-4 text-center border border-border">
                      <div className="text-2xl font-extrabold text-foreground">—</div>
                      <div className="text-[10px] text-muted-foreground mt-1">{m}</div>
                    </div>
                  ))}
                </div>
                <button className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted border border-border text-sm font-semibold text-muted-foreground cursor-not-allowed opacity-60">
                  <Download className="w-4 h-4" /> Download Report (Available Month 2)
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ CLIENTS ═══════════════════════════════════════════════════ */}
          {activeTab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Client Portfolio</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{clients.length} client brand{clients.length !== 1 ? 's' : ''} added</p>
                </div>
                <button onClick={() => setShowClientForm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-primary/20">
                  <Plus className="w-4 h-4" /> Add Client Brand
                </button>
              </div>

              {clients.length === 0 ? (
                <div className="glass-card rounded-2xl border border-dashed border-border p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 border border-border">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-base font-extrabold text-foreground mb-2">No client brands yet</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                    Add your clients' business details so Siddhi Dynamics can begin their SEO, GEO, AEO & GBP optimisation.
                  </p>
                  <button onClick={() => setShowClientForm(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-sm font-extrabold rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-primary/20">
                    <Plus className="w-4 h-4" /> Add First Client Brand
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clients.map(c => (
                    <div key={c.id} className="glass-card rounded-2xl border border-border p-5 hover:border-primary/40 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-extrabold text-foreground">{c.businessName}</h4>
                          {c.brandName !== c.businessName && <p className="text-xs text-muted-foreground">{c.brandName}</p>}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">{c.category || "—"}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{c.description || "No description provided."}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {c.goals.map(g => <span key={g} className="text-[10px] bg-muted px-2 py-0.5 rounded-full border border-border text-muted-foreground">{g}</span>)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground border-t border-border pt-3">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.mobile || "—"}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{c.email || "—"}</span>
                        {c.website && <span className="flex items-center gap-1 col-span-2"><Globe className="w-3 h-3" />{c.website}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ BILLING ═══════════════════════════════════════════════════ */}
          {activeTab === 'billing' && (
            <motion.div key="billing" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* QR & UPI */}
                <div className="glass-card rounded-2xl border border-border p-6 flex flex-col gap-5">
                  <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-primary" /> UPI Payment Hub
                  </h3>

                  <div className="bg-white p-3 rounded-2xl border-2 border-primary/20 shadow-md max-w-[200px] mx-auto">
                    <img src="/siddhi-upi-qr.jpg" alt="Scan to Pay" className="w-full h-full object-contain rounded-xl" />
                    <div className="text-center mt-2">
                      <div className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Scan & Pay</div>
                      <div className="text-[11px] font-bold text-slate-800 mt-0.5">{upiId}</div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-xl border border-border p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-semibold uppercase">UPI VPA</div>
                      <div className="text-sm font-extrabold text-foreground">{upiId}</div>
                    </div>
                    <button onClick={() => copyText(upiId, "UPI ID")}
                      className="p-2 hover:bg-border rounded-lg transition-colors">
                      {copiedKey === "UPI ID" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Open in App</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { app: 'gpay',    label: 'GPay',    bg: 'bg-white',         svg: <svg viewBox="0 0 48 48" className="w-5 h-5"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg> },
                        { app: 'phonepe', label: 'PhonePe', bg: 'bg-[#5f259f]',     svg: <svg viewBox="0 0 48 48" className="w-4 h-4" fill="white"><path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm5.5 27h-3.8l-7.4-9.6V31H15V17h3.8l7.4 9.6V17H29.5v14z"/></svg> },
                        { app: 'paytm',   label: 'Paytm',   bg: 'bg-[#00BAF2]',     svg: <span className="text-white font-extrabold text-sm">P</span> },
                        { app: 'bhim',    label: 'BHIM',    bg: 'bg-gradient-to-br from-orange-500 to-green-600', svg: <span className="text-white font-extrabold text-sm">B</span> },
                      ].map(({ app, label, bg, svg }) => (
                        <a key={app} href={buildUpiLink(app)} target="_blank" rel="noopener noreferrer"
                          onClick={() => toast.info(`Opening ${label}…`)}
                          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-muted hover:bg-border border border-border transition-all group">
                          <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shadow-sm`}>{svg}</div>
                          <span className="text-[9px] font-bold text-muted-foreground group-hover:text-foreground">{label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Invoices */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="glass-card rounded-2xl border border-border p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-primary" /> 12-Month SLA Payment Schedule
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Contract total: <strong>₹3,00,000</strong> · ₹25,000/month · <span className="text-amber-500 font-semibold">0 of 12 paid</span>
                        </p>
                      </div>
                      <span className="text-[10px] px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg font-bold">⚙ Admin-set · Read only</span>
                    </div>
                    <div className="space-y-3">
                      {invoices.map(inv => (
                        <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted border border-border">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-foreground">{inv.id}</span>
                              <span className="text-xs text-muted-foreground">· {inv.month}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{inv.desc}</p>
                            <p className="text-[11px] text-muted-foreground/60 mt-0.5">Due: {inv.date}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="text-base font-extrabold text-foreground">{inv.amount}</div>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                inv.status === 'Pending'  ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30' :
                                inv.status === 'Paid'     ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                                                             'bg-muted text-muted-foreground border border-border'
                              }`}>{inv.status}</span>
                            </div>
                            {inv.status === 'Pending' && (
                              <button onClick={() => { setSelInvoice(inv); setPayModalOpen(true); }}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-primary/20">
                                <QrCode className="w-3.5 h-3.5" /> Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick UTR */}
                  <div className="glass-card rounded-2xl border border-border p-5">
                    <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> Quick UTR Submission
                    </h4>
                    <form onSubmit={handleSubmitUtr} className="flex gap-3">
                      <input type="text" placeholder="Paste UPI UTR / Transaction Reference"
                        value={utrInput} onChange={e => setUtrInput(e.target.value)}
                        className={`flex-1 ${inp}`} />
                      <button type="submit" disabled={submittingUtr}
                        className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] transition-all disabled:opacity-60 shrink-0">
                        {submittingUtr ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Confirm"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ CHAT ═══════════════════════════════════════════════════════ */}
          {activeTab === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card rounded-2xl border border-border overflow-hidden flex flex-col h-[580px]">
              <div className="flex items-center justify-between px-5 py-4 bg-muted border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">Siddhi AI Coordinator</p>
                    <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active · V Magnetic Minds
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">Escalations: saivaraprasad</span>
              </div>
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.isAdmin ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-sm px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      m.isAdmin ? 'bg-muted border border-border text-foreground rounded-tl-none' : 'bg-primary text-primary-foreground rounded-tr-none'
                    }`}>
                      <div className="font-bold opacity-60 text-[10px] mb-1">{m.sender}</div>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendChat} className="flex gap-3 p-4 bg-muted border-t border-border">
                <input type="text" placeholder="Ask about SEO/GEO reports, billing, client onboarding…"
                  value={chatInput} onChange={e => setChatInput(e.target.value)}
                  className={`flex-1 ${inp} bg-card`} />
                <button type="submit"
                  className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] transition-all flex items-center gap-1.5 shrink-0">
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ════ PAY MODAL ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {payModalOpen && selInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-card border border-border rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 bg-muted border-b border-border">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-extrabold text-foreground">Pay via UPI</p>
                    <p className="text-[10px] text-muted-foreground">{selInvoice.id} · {selInvoice.month}</p>
                  </div>
                </div>
                <button onClick={() => setPayModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-border hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Amount row */}
                <div className="bg-muted rounded-2xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">Amount Due</div>
                    <div className="text-2xl font-extrabold text-foreground">{selInvoice.amount}</div>
                    <div className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Admin-assigned · Not editable
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground uppercase">Pay to</div>
                    <div className="text-sm font-extrabold text-primary">{upiId}</div>
                    <div className="text-[10px] text-muted-foreground">{payeeName}</div>
                  </div>
                </div>

                {/* QR + apps */}
                <div className="flex gap-4 items-start">
                  <div className="bg-white p-2.5 rounded-xl border-2 border-primary/20 shrink-0 shadow-md">
                    <img src="/siddhi-upi-qr.jpg" alt="Scan to pay" className="w-32 h-32 object-contain rounded-lg" />
                    <div className="text-[9px] font-bold text-slate-600 text-center mt-1 uppercase tracking-wide">Scan to Pay</div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="bg-muted border border-border rounded-xl px-3 py-2 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-primary">{upiId}</span>
                      <button onClick={() => copyText(upiId, "UPI ID")} className="ml-2 text-muted-foreground hover:text-foreground">
                        {copiedKey === "UPI ID" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { app: 'gpay', label: 'Google Pay' }, { app: 'phonepe', label: 'PhonePe' },
                        { app: 'paytm', label: 'Paytm' }, { app: 'bhim', label: 'BHIM UPI' }
                      ].map(({ app, label }) => (
                        <a key={app} href={buildUpiLink(app)} target="_blank" rel="noopener noreferrer"
                          onClick={() => toast.info(`Opening ${label}…`)}
                          className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-border border border-border rounded-xl transition-all text-xs font-semibold text-muted-foreground hover:text-foreground">
                          <ChevronRight className="w-3.5 h-3.5 text-primary" />{label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* UTR form */}
                <form onSubmit={handleSubmitUtr} className="space-y-3 pt-2 border-t border-border">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" /> After paying, paste your UTR number to confirm.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {[["Invoice", selInvoice.id], ["Amount", selInvoice.amount], ["Pay to", `${upiId} · ${payeeName}`]].map(([k, v]) => (
                      <div key={k} className={`bg-muted px-3 py-2 rounded-xl border border-border ${k === "Pay to" ? "col-span-2" : ""}`}>
                        <div className="text-muted-foreground">{k}</div>
                        <div className="font-extrabold text-foreground">{v}</div>
                      </div>
                    ))}
                  </div>
                  <input type="text" required minLength={8} placeholder="e.g. 623910481923"
                    value={utrInput} onChange={e => setUtrInput(e.target.value)} className={inp} />
                  <button type="submit" disabled={submittingUtr}
                    className="w-full py-3 bg-primary text-primary-foreground font-extrabold text-sm rounded-xl hover:scale-[1.01] transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60">
                    {submittingUtr ? <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying…</> : <><Check className="w-4 h-4" /> Submit Payment Confirmation</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════ ADD CLIENT MODAL ═════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showClientForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.94, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-muted border-b border-border shrink-0">
                <div>
                  <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" /> Add Client Brand
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Siddhi Dynamics LLP — Client Information Required for SEO, GEO, AEO & GBP</p>
                </div>
                <button onClick={() => setShowClientForm(false)}
                  className="w-9 h-9 rounded-full bg-border hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable form body */}
              <div className="overflow-y-auto flex-1 px-6 py-6" ref={formRef}>
                <form id="client-form" onSubmit={handleSaveClient} className="space-y-8">

                  {/* ▸ Business Information */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Business Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className={lbl}>Business Name *</label><input required placeholder="e.g. Zenith Fitness Studio" className={inp} value={clientForm.businessName} onChange={cf('businessName')} /></div>
                      <div><label className={lbl}>Brand Name (if different)</label><input placeholder="e.g. ZenFit" className={inp} value={clientForm.brandName} onChange={cf('brandName')} /></div>
                      <div><label className={lbl}>Business Category</label><input placeholder="e.g. Health & Wellness, F&B" className={inp} value={clientForm.category} onChange={cf('category')} /></div>
                      <div><label className={lbl}>Year of Establishment</label><input placeholder="e.g. 2019" className={inp} value={clientForm.yearEst} onChange={cf('yearEst')} /></div>
                      <div className="sm:col-span-2"><label className={lbl}>Short Business Description</label><textarea rows={2} placeholder="Briefly describe the business…" className={inp} value={clientForm.description} onChange={cf('description')} /></div>
                      <div><label className={lbl}>Website URL</label><input placeholder="https://example.com" className={inp} value={clientForm.website} onChange={cf('website')} /></div>
                      <div><label className={lbl}>Business Working Hours</label><input placeholder="e.g. Mon–Sat 9am–8pm" className={inp} value={clientForm.hours} onChange={cf('hours')} /></div>
                      <div className="sm:col-span-2"><label className={lbl}>List of Services / Products</label><textarea rows={2} placeholder="Comma-separated or one per line…" className={inp} value={clientForm.services} onChange={cf('services')} /></div>
                    </div>
                  </section>

                  {/* ▸ Contact Details */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Contact Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className={lbl}>Contact Person Name *</label><input required placeholder="Full name" className={inp} value={clientForm.contactName} onChange={cf('contactName')} /></div>
                      <div><label className={lbl}>Mobile Number</label><input placeholder="+91 XXXXX XXXXX" className={inp} value={clientForm.mobile} onChange={cf('mobile')} /></div>
                      <div><label className={lbl}>WhatsApp Number</label><input placeholder="Same as mobile or different" className={inp} value={clientForm.whatsapp} onChange={cf('whatsapp')} /></div>
                      <div><label className={lbl}>Email Address</label><input type="email" placeholder="contact@brand.com" className={inp} value={clientForm.email} onChange={cf('email')} /></div>
                    </div>
                  </section>

                  {/* ▸ Business Location */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Business Location
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2"><label className={lbl}>Complete Business Address</label><textarea rows={2} placeholder="Door no., Street, Area, City, State, PIN" className={inp} value={clientForm.address} onChange={cf('address')} /></div>
                      <div><label className={lbl}>Google Maps Location / Pin URL</label><input placeholder="https://maps.app.goo.gl/…" className={inp} value={clientForm.mapsLink} onChange={cf('mapsLink')} /></div>
                      <div><label className={lbl}>Landmark</label><input placeholder="Near XYZ" className={inp} value={clientForm.landmark} onChange={cf('landmark')} /></div>
                      <div className="sm:col-span-2"><label className={lbl}>Service Areas (if applicable)</label><input placeholder="e.g. Nizamabad, Hyderabad, All of Telangana" className={inp} value={clientForm.serviceAreas} onChange={cf('serviceAreas')} /></div>
                    </div>
                  </section>

                  {/* ▸ Branding Assets */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Image className="w-4 h-4" /> Branding Assets
                    </h3>
                    <div className="bg-muted rounded-xl border border-dashed border-border p-4 text-center mb-3">
                      <p className="text-xs text-muted-foreground">📎 High-Resolution Logo (PNG/SVG), Cover Image/Banner — share via WhatsApp or email to <span className="font-semibold text-foreground">saivaraprasad@siddhidynamics.in</span></p>
                    </div>
                    <div><label className={lbl}>Brand Colors (hex codes or description)</label><input placeholder="e.g. #FF5733 (orange), #2C3E50 (dark)" className={inp} value={clientForm.brandColors} onChange={cf('brandColors')} /></div>
                  </section>

                  {/* ▸ Photos & Media */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4" /> Photos & Media
                    </h3>
                    <div className="bg-muted rounded-xl border border-dashed border-border p-4">
                      <p className="text-xs text-muted-foreground text-center">📸 Please share via WhatsApp or email: <strong>Exterior, Interior, Team, Product/Service, Owner/Founder photos</strong> and any <strong>short videos</strong>.<br />Send to: <span className="text-foreground font-semibold">saivaraprasad@siddhidynamics.in</span> or WhatsApp <span className="text-foreground font-semibold">+91 63036 02743</span></p>
                    </div>
                  </section>

                  {/* ▸ Business Documents */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Business Documents
                    </h3>
                    <div className="bg-muted rounded-xl border border-dashed border-border p-4">
                      <p className="text-xs text-muted-foreground text-center">📄 Share if available: <strong>Business Brochure/Catalogue, Price List, Business Registration Certificates, Certificates & Awards</strong>.<br />Send to: <span className="text-foreground font-semibold">saivaraprasad@siddhidynamics.in</span></p>
                    </div>
                  </section>

                  {/* ▸ Social Media */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Social Media
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-500 shrink-0" /><input placeholder="Facebook Page Link" className={inp} value={clientForm.fbLink} onChange={cf('fbLink')} /></div>
                      <div className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500 shrink-0" /><input placeholder="Instagram Profile Link" className={inp} value={clientForm.igLink} onChange={cf('igLink')} /></div>
                      <div className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-600 shrink-0" /><input placeholder="LinkedIn Page Link" className={inp} value={clientForm.liLink} onChange={cf('liLink')} /></div>
                      <div className="flex items-center gap-2"><Youtube className="w-4 h-4 text-red-500 shrink-0" /><input placeholder="YouTube Channel Link" className={inp} value={clientForm.ytLink} onChange={cf('ytLink')} /></div>
                    </div>
                  </section>

                  {/* ▸ Business Credibility */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Business Credibility
                    </h3>
                    <div><label className={lbl}>Customer Testimonials / Reviews (if available)</label>
                      <textarea rows={3} placeholder="Paste any existing testimonials or Google review links…" className={inp} value={clientForm.testimonials} onChange={cf('testimonials')} />
                    </div>
                  </section>

                  {/* ▸ Business Goal */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4" /> Business Goal
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">Select your primary objectives (choose all that apply):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {BUSINESS_GOALS.map(g => (
                        <button key={g} type="button" onClick={() => toggleGoal(g)}
                          className={`text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            selectedGoals.includes(g)
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                              : 'bg-muted border-border text-muted-foreground hover:border-primary/40'
                          }`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </section>
                </form>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-muted border-t border-border flex gap-3 shrink-0">
                <button type="submit" form="client-form" disabled={savingClient}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-extrabold text-sm rounded-xl hover:scale-[1.01] transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60">
                  {savingClient ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</> : <><Check className="w-4 h-4" /> Save Client Brand</>}
                </button>
                <button type="button" onClick={() => setShowClientForm(false)}
                  className="px-5 py-3 border border-border text-muted-foreground hover:text-foreground font-semibold text-sm rounded-xl hover:border-primary/40 transition-all">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

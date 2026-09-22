import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Loader2, 
  LogOut, 
  Zap, 
  Building2,
  GraduationCap,
  Sparkles,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

export default function PortalGateway() {
  const navigate = useNavigate();
  
  // Auth state
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Modal for employee/intern selection
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      setSession(activeSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setLoading(false);
    toast.success("Signed out successfully.");
  };

  // 4 portal cards: Client, Agency, Employee/Intern, Investor
  const portals = [
    {
      id: "client",
      title: "Client Workspace",
      roleBadge: "Client Portal",
      description: "Track project milestones, schedule GMeet reviews, manage quote approvals, and inspect invoice disbursements.",
      path: "/portal/client",
      icon: Briefcase,
      tags: ["Milestone Tracker", "GMeet Reviews", "Quotes & Invoices"],
      accentColor: "#6b7c45",  // olive
    },
    {
      id: "agency",
      title: "Agency / Partner Portal",
      roleBadge: "Marketing Agency",
      description: "Partner ecosystem hub. Onboard client portfolios, inspect SEO & GBP metrics, request digital sprints, and track partner revenue.",
      path: "/portal/agency",
      icon: Building2,
      tags: ["Self Projects", "Client Projects", "Payments"],
      accentColor: "#6b7c45",
    },
    {
      id: "team",
      title: "Employee & Intern Hub",
      roleBadge: "Team Workspace",
      description: "Unified team hub for project execution, sprint task management, proof of work submissions, and certificate issuance.",
      path: null, // opens modal
      icon: GraduationCap,
      tags: ["Task Ledger", "Sprint Tracking", "Certificates"],
      accentColor: "#6b7c45",
    },
    {
      id: "investor",
      title: "Venture / Investor Desk",
      roleBadge: "Strategic Partner",
      description: "Direct access to strategic pitch decks, growth metrics, financial summaries, founder briefings, and investor chat rooms.",
      path: "/portal/investor",
      icon: TrendingUp,
      tags: ["Pitch Decks", "Traction Metrics", "Direct Founder Chat"],
      accentColor: "#6b7c45",
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] text-[#29251d] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-stone-800" />
        <p className="text-stone-500 text-sm font-semibold tracking-widest uppercase">Loading Portals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#29251d] relative overflow-x-hidden font-sans flex flex-col portal-unified-root">
      <Navbar />
      <Helmet>
        <title>Unified Portals & Workspaces | Siddhi Dynamics</title>
        <meta name="description" content="Access Siddhi Dynamics client dashboards, agency partner tools, employee workspaces, intern hub, or investor desk directly." />
      </Helmet>

      <main className="flex-grow container mx-auto px-4 sm:px-6 pt-28 pb-20 max-w-7xl relative z-10 flex flex-col justify-center">
        <div className="space-y-10">
          
          {/* Hero Header Card */}
          <div className="rounded-[28px] bg-[#1a1c14] p-8 sm:p-10 text-white shadow-xl border border-[#3d4230] text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2a2d1e] border border-[#4a5230] text-[11px] font-extrabold uppercase tracking-widest text-[#a0b550] shadow-sm">
              <Zap className="w-3.5 h-3.5 text-[#a0b550]" /> Direct Workspace Access
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Select Your Portal Workspace
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Choose your workspace below to enter your personalized dashboard.
            </p>

            {/* Active Session Status */}
            {session?.user && (
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#2a2d1e] border border-[#4a5230] text-xs text-stone-300 mt-2">
                <span>Active session: <strong className="text-[#a0b550]">{session.user.email}</strong></span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3" /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* 4 Portals Grid — 1 row on desktop, 2 col on tablet, 1 col on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            {portals.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.025, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (p.id === 'team') {
                      setShowRoleModal(true);
                    } else if (p.path) {
                      navigate(p.path);
                    }
                  }}
                  className="relative overflow-hidden p-6 rounded-2xl border border-stone-200 bg-white hover:border-[#6b7c45]/60 hover:shadow-lg transition-all flex flex-col justify-between min-h-[300px] text-left group cursor-pointer shadow-sm"
                >
                  {/* Olive accent top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6b7c45] to-[#a0b550] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl border border-[#6b7c45]/20 bg-[#6b7c45]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                        <Icon className="w-6 h-6 text-[#6b7c45]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#6b7c45]/10 border border-[#6b7c45]/20 text-[#6b7c45]">
                        {p.roleBadge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#6b7c45] group-hover:text-[#4a5a2a] transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 mt-4 space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-[#6b7c45]/8 text-[#6b7c45] border border-[#6b7c45]/15">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 bg-[#1a1c14] group-hover:bg-[#6b7c45] text-white shadow-xs group-hover:shadow-md">
                      <span>Enter Workspace</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick tips footer */}
          <div className="text-center pt-4">
            <p className="text-xs text-stone-500 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#6b7c45]" />
              <span>All portals are role-protected and sync directly with the Siddhi Dynamics database.</span>
            </p>
          </div>

        </div>
      </main>

      {/* Employee / Intern Role Selection Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowRoleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-6 border border-stone-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-[#1a1c14]">Who are you entering as?</h2>
                  <p className="text-xs text-stone-500 mt-1">Select your role to enter the correct workspace.</p>
                </div>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setShowRoleModal(false); navigate('/portal/employee'); }}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-[#6b7c45]/30 bg-[#6b7c45]/5 hover:border-[#6b7c45] hover:bg-[#6b7c45]/10 transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#6b7c45]/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-[#6b7c45]" />
                  </div>
                  <div className="text-center">
                    <p className="font-extrabold text-[#1a1c14] text-sm">Employee</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Engineering & Builder Hub</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setShowRoleModal(false); navigate('/portal/intern'); }}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-[#6b7c45]/30 bg-[#6b7c45]/5 hover:border-[#6b7c45] hover:bg-[#6b7c45]/10 transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#6b7c45]/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-7 h-7 text-[#6b7c45]" />
                  </div>
                  <div className="text-center">
                    <p className="font-extrabold text-[#1a1c14] text-sm">Intern</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Growth Fellow Workspace</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterSection />
    </div>
  );
}

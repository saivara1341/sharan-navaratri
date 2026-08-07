import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  LogOut, 
  ShieldAlert, 
  Zap,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Activity,
  ArrowLeft,
  Building2
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

export default function PortalGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auth state
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Form input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Role metadata states
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if admin email
  const checkAdmin = (emailToCheck?: string) => {
    if (!emailToCheck) return false;
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "ssaivaraprasad51@gmail.com")
      .split(",")
      .map((e: string) => e.trim().toLowerCase());
    return adminEmails.includes(emailToCheck.trim().toLowerCase());
  };

  const syncSessionData = async (activeSession: any) => {
    setSession(activeSession);
    if (activeSession?.user) {
      const emailVal = activeSession.user.email?.trim().toLowerCase();
      const adminCheck = checkAdmin(emailVal);
      setIsAdmin(adminCheck);

      if (adminCheck) {
        setLoading(false);
        navigate('/admin-hq-nexus');
        return;
      }

      // Auto-redirect V Magnetic Minds partner immediately – no role selection needed
      if (emailVal === '23eg510a07@anurag.edu.in') {
        setLoading(false);
        navigate('/portal/agency');
        return;
      }
      
      let roleVal = activeSession.user.user_metadata?.role || null;
      setUserRole(roleVal);

      // Auto-redirect OAuth logins (URLs with #access_token= or ?code=) straight to role workspace
      if (typeof window !== 'undefined' && (window.location.hash.includes('access_token') || window.location.search.includes('code'))) {
        setLoading(false);
        if (roleVal === 'partner') navigate('/portal/agency');
        else if (roleVal === 'employee') navigate('/portal/employee');
        else if (roleVal === 'investor') navigate('/portal/investor');
        else navigate('/portal/client');
        return;
      }
    } else {
      setSession(null);
      setUserRole(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const hasHashToken = typeof window !== 'undefined' && (window.location.hash.includes('access_token') || window.location.search.includes('code'));

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      if (activeSession) {
        syncSessionData(activeSession).then(() => setLoading(false));
      } else if (!hasHashToken) {
        setLoading(false);
      }
    });

    // Listen for auth state changes (e.g. OAuth token exchange completion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      if (activeSession) {
        syncSessionData(activeSession).then(() => setLoading(false));
      } else if (!hasHashToken) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Google Login Flow
  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + "/portal"
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Google Auth Failure:", error);
      toast.error(error.message || "Google Authentication failed");
      setAuthLoading(false);
    }
  };

  // Handle Email & Password Auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
        toast.success("Successfully logged in!");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: fullName.trim(),
            }
          }
        });
        if (error) throw error;
        toast.success("Registration successful! You can now log in.");
        setAuthMode('login');
      }
    } catch (error: any) {
      console.error("Authentication error details:", error);
      toast.error(error.message || "Authentication process failed");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Role Selection (New User Onboarding)
  const handleRoleSelect = async (role: string) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { role }
      });
      if (error) throw error;
      
      setUserRole(role);
      toast.success(`Welcome aboard! Set up completed for role: ${role}`);
      
      // Redirect to correct portal
      if (role === 'partner') {
        navigate('/portal/v-magnetic-minds');
      } else {
        navigate(`/portal/${role}`);
      }
    } catch (err: any) {
      console.error("Role update failed:", err);
      toast.error("Could not configure user role. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    syncSessionData(null);
    setLoading(false);
    toast.success("Logged out successfully.");
  };

  const getLaunchPath = () => {
    if (session?.user?.email?.trim().toLowerCase() === '23eg510a07@anurag.edu.in') return "/portal/v-magnetic-minds";
    if (isAdmin) return "/admin-hq-nexus";
    if (userRole === 'partner') return "/portal/v-magnetic-minds";
    if (userRole === 'employee') return "/portal/employee";
    if (userRole === 'client') return "/portal/client";
    if (userRole === 'investor') return "/portal/investor";
    return null;
  };

  const getRoleBadge = () => {
    if (session?.user?.email?.trim().toLowerCase() === '23eg510a07@anurag.edu.in') return "The Magnetic Minds (M²) Partner";
    if (isAdmin) return "God-Mode Admin";
    if (userRole === 'partner') return "Agency Partner";
    if (userRole === 'employee') return "Employee / Builder";
    if (userRole === 'client') return "Client";
    if (userRole === 'investor') return "Venture / Investor";
    return "Member";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">Loading...</p>
      </div>
    );
  }

  const launchPath = getLaunchPath();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans flex flex-col">
      <Navbar />
      <Helmet>
        <title>Portal Gateway | Siddhi Dynamics</title>
        <meta name="description" content="Siddhi Dynamics Unified Gateways. Access client dashboards, track investment metrics, or manage internal tasks." />
      </Helmet>

      {/* Decorative patterns */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <main className="flex-grow container mx-auto px-6 pt-32 pb-20 max-w-5xl relative z-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* STATE 1: LOGGED IN WITH VALID ROLE */}
          {session && (userRole || isAdmin) && launchPath && (
            <motion.div
              key="logged-in"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl mx-auto glass-card p-8 border border-white/10 rounded-3xl relative text-center space-y-8"
            >
              <div className="space-y-3">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 shadow-lg shadow-primary/5">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <span className="text-[10px] uppercase font-bold text-primary tracking-[0.25em]">{getRoleBadge()}</span>
                <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
                <p className="text-slate-400 text-sm">
                  Active Session: <span className="text-slate-200 font-semibold">{session.user.user_metadata?.full_name || "Member"}</span> ({session.user.email})
                </p>
              </div>

              {/* Status information */}
              <div className="bg-white/2 rounded-2xl p-5 border border-white/5 text-left text-xs text-slate-400 leading-relaxed">
                <p className="font-semibold text-slate-300 mb-1">Ecosystem Gateway Secure</p>
                You are currently signed in with verified access parameters. Launching your workspace will dynamically populate all active roadmaps, contracts, and support pipelines associated with your account.
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate(launchPath)}
                  className="w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm hover:scale-[1.02] transition-all shadow-lg shadow-primary/15 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Enter Your Workspace <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-3.5 px-6 rounded-xl border border-red-500/20 hover:border-red-500/40 bg-red-500/5 text-slate-300 hover:text-red-400 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Switch Account / Logout
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 2: LOGGED IN BUT NO ROLE YET (Onboarding) */}
          {session && !userRole && !isAdmin && (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-6xl mx-auto"
            >
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-extrabold uppercase tracking-widest text-primary">
                  <Zap className="w-3.5 h-3.5" /> Welcome to Siddhi Dynamics Ecosystem
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">Select Your Portal Workspace</h1>
                <p className="text-muted-foreground text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
                  Choose your authorized role below to set up your tailored workspace and access your dashboard.
                </p>
              </div>

              {/* Selection cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left">
                {/* 🏢 Client Card */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('client')}
                  className="relative overflow-hidden p-6 rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 via-card/80 to-card hover:border-primary flex flex-col justify-between h-full min-h-[300px] text-left transition-all group cursor-pointer shadow-lg hover:shadow-primary/10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">Client Workspace</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                        Client
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Track project roadmaps, schedule GMeet reviews, manage quote approvals, and view invoice disbursements.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 mt-4 space-y-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">Roadmaps</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">GMeet</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">Quotes & Invoices</span>
                    </div>
                    <div className="w-full py-2.5 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground text-primary font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-primary/20">
                      Enter Client Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>

                {/* 🏬 Partner Card */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('partner')}
                  className="relative overflow-hidden p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-500/10 via-card/80 to-card hover:border-purple-500 flex flex-col justify-between h-full min-h-[300px] text-left transition-all group cursor-pointer shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <Building2 className="w-6 h-6 text-purple-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Agency Partner</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-foreground group-hover:text-purple-400 transition-colors">
                        Agency / Partner
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        For partner agencies & executive partners. Onboard client portfolios, request services, and manage SLAs.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 mt-4 space-y-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">Multi-Client</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">Branding</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">SLA Tracking</span>
                    </div>
                    <div className="w-full py-2.5 rounded-xl bg-purple-500/10 group-hover:bg-purple-500 group-hover:text-white text-purple-400 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-purple-500/20">
                      Enter Partner Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>

                {/* 💻 Employee / Builder Card */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('employee')}
                  className="relative overflow-hidden p-6 rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-500/10 via-card/80 to-card hover:border-blue-500 flex flex-col justify-between h-full min-h-[300px] text-left transition-all group cursor-pointer shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Team Builder</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-foreground group-hover:text-blue-400 transition-colors">
                        Employee / Team
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Internal team hub for project task lists, development pipelines, GitHub sync, and support ticketing.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 mt-4 space-y-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">Task Board</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">GitHub</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">Tickets</span>
                    </div>
                    <div className="w-full py-2.5 rounded-xl bg-blue-500/10 group-hover:bg-blue-500 group-hover:text-white text-blue-400 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-blue-500/20">
                      Enter Employee Hub <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>

                {/* 📈 Investor Card */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('investor')}
                  className="relative overflow-hidden p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-card/80 to-card hover:border-emerald-500 flex flex-col justify-between h-full min-h-[300px] text-left transition-all group cursor-pointer shadow-lg hover:shadow-emerald-500/10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Investor Desk</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-foreground group-hover:text-emerald-400 transition-colors">
                        Venture / Investor
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Access strategic pitch decks, growth metrics, cap table summaries, and founder communication history.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 mt-4 space-y-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">Pitch Decks</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">Metrics</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">Cap Tables</span>
                    </div>
                    <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white text-emerald-400 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-emerald-500/20">
                      Enter Investor Desk <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Secondary actions */}
              <div className="pt-6 border-t border-border flex justify-center">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-muted/50 hover:bg-muted border border-border text-xs font-bold text-muted-foreground hover:text-red-400 transition-all cursor-pointer shadow-sm"
                >
                  <LogOut className="w-4 h-4" /> Cancel Onboarding & Sign Out
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 3: UNAUTHENTICATED (Intro to portals + Sign In) */}
          {!session && (
            <motion.div
              key="auth-gateway"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md mx-auto"
            >
                  <div className="glass-card bg-card/80 p-6 md:p-8 rounded-3xl border border-border shadow-xl flex flex-col justify-center relative">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold text-foreground">
                        {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                      </h1>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                      <AnimatePresence mode="wait">
                        {authMode === 'signup' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1"
                          >
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your Full Name"
                                className="w-full bg-background border border-input rounded-xl py-2.5 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-background border border-input rounded-xl py-2.5 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-background border border-input rounded-xl py-2.5 pl-10 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
                      >
                        {authLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          authMode === 'login' ? 'Sign In' : 'Sign Up'
                        )}
                      </button>
                    </form>

                    {/* Google Auth Divider */}
                    <div className="relative my-6 text-center">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                      <span className="relative bg-card px-3 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Or</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={authLoading}
                      className="w-full py-3 border border-border bg-background hover:bg-muted text-foreground font-bold text-xs rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.74 0 3.3.6 4.53 1.77l3.39-3.39C17.85 1.5 15.17 0 12 0 7.31 0 3.25 2.69 1.25 6.61l3.92 3.04c.93-2.79 3.52-4.61 6.83-4.61z" />
                        <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.71-4.94 3.71-8.6z" />
                        <path fill="#FBBC05" d="M5.17 9.65c-.24-.71-.37-1.47-.37-2.25s.13-1.54.37-2.25L1.25 6.61C.45 8.21 0 10.02 0 12s.45 3.79 1.25 5.39l3.92-3.04c-.24-.71-.37-1.47-.37-2.25s.13-1.54.37-2.25z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.31 0-5.9-1.82-6.83-4.61L1.25 17.75C3.25 21.31 7.31 24 12 24z" />
                      </svg>
                      Continue with Google
                    </button>

                    {/* Mode Toggle link */}
                    <p className="text-center text-xs text-muted-foreground mt-6">
                      {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                      <button
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                        className="text-red-600 dark:text-red-400 font-bold hover:text-red-700 dark:hover:text-red-300 hover:underline cursor-pointer"
                      >
                        {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                      </button>
                    </p>
                  </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

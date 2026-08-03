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
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Activity,
  ArrowLeft
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
      const emailVal = activeSession.user.email;
      const adminCheck = checkAdmin(emailVal);
      setIsAdmin(adminCheck);
      
      const roleVal = activeSession.user.user_metadata?.role || null;
      setUserRole(roleVal);

      // If user is logged in but doesn't have an explicit role in metadata, check if email exists in database
      if (!roleVal && !adminCheck && emailVal) {
        try {
          const { data } = await supabase
            .from('contact_submissions')
            .select('id')
            .eq('email', emailVal.trim().toLowerCase())
            .limit(1);

          if (data && data.length > 0) {
            // Set role to client and update metadata
            const { data: updatedUser } = await supabase.auth.updateUser({
              data: { role: 'client' }
            });
            setUserRole('client');
          }
        } catch (err) {
          console.error("Failed to check database client records:", err);
        }
      }
    } else {
      setSession(null);
      setUserRole(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      syncSessionData(activeSession).then(() => {
        setLoading(false);
      });
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, activeSession) => {
      syncSessionData(activeSession).then(() => {
        setLoading(false);
      });
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
      navigate(`/portal/${role}`);
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
    if (userRole === 'employee') return "/portal/employee";
    if (userRole === 'client') return "/portal/client";
    if (userRole === 'investor') return "/portal/investor";
    return null;
  };

  const getRoleBadge = () => {
    if (session?.user?.email?.trim().toLowerCase() === '23eg510a07@anurag.edu.in') return "The Magnetic Minds (M²) Partner";
    if (isAdmin) return "God-Mode Admin";
    if (userRole === 'employee') return "Employee / Builder";
    if (userRole === 'client') return "Client / Partner";
    if (userRole === 'investor') return "Venture / Investor";
    return "Member";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">Initializing Secure Portal Hub...</p>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl mx-auto glass-card bg-card/80 p-8 border border-border shadow-xl rounded-3xl relative text-center space-y-8"
            >
              <div className="space-y-2">
                <div className="p-2.5 bg-primary/10 rounded-xl w-fit mx-auto border border-primary/20"><Sparkles className="w-6 h-6 text-primary animate-pulse" /></div>
                <h1 className="text-3xl font-extrabold text-foreground">Welcome to Siddhi Dynamics</h1>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Please select how you'll be using our platform to set up your dashboard.
                </p>
              </div>

              {/* Selection cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Client card */}
                <motion.button
                  whileHover={{ scale: 1.02, border: "1px solid rgba(251, 146, 60, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('client')}
                  className="p-6 rounded-2xl border border-border bg-background/70 hover:bg-muted flex flex-col justify-between h-64 text-left transition-all group cursor-pointer shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Startup / Client</h3>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Manage your projects, custom specifications, milestone payments, and track active developmental roadmaps.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                    Claim Path <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.button>

                {/* Investor card */}
                <motion.button
                  whileHover={{ scale: 1.02, border: "1px solid rgba(234, 179, 8, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('investor')}
                  className="p-6 rounded-2xl border border-border bg-background/70 hover:bg-muted flex flex-col justify-between h-64 text-left transition-all group cursor-pointer shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">Venture / Investor</h3>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Discover ecosystem startup projects, view portfolio metrics, run due diligence audits, and contact founders.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-accent flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                    Claim Path <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.button>

                {/* Employee card */}
                <motion.button
                  whileHover={{ scale: 1.02, border: "1px solid rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('employee')}
                  className="p-6 rounded-2xl border border-border bg-background/70 hover:bg-muted flex flex-col justify-between h-64 text-left transition-all group cursor-pointer shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-transform">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Employee / Builder</h3>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Access internal system task lists, manage delivery schedules, and reply to escalated client support tickets.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                    Claim Path <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.button>
              </div>

              {/* Secondary actions */}
              <div className="pt-6 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Cancel Onboarding & Logout
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

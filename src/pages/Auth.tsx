import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Loader2, Briefcase, TrendingUp, Users, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { emailService } from "@/services/emailService";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  const navigate = useNavigate();

  const checkAdmin = (emailToCheck?: string) => {
    if (!emailToCheck) return false;
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "ssaivaraprasad51@gmail.com")
      .split(",")
      .map((e: string) => e.trim().toLowerCase());
    return adminEmails.includes(emailToCheck.trim().toLowerCase());
  };

  const checkRoleAndRedirect = async (user: any) => {
    if (!user) return;
    const email = user.email;
    if (checkAdmin(email)) {
      navigate("/admin-hq-nexus");
      return;
    }

    const role = user.user_metadata?.role;
    if (role === 'employee') {
      navigate("/portal/employee");
      return;
    } else if (role === 'client') {
      navigate("/portal/client");
      return;
    } else if (role === 'investor') {
      navigate("/portal/investor");
      return;
    } else if (role === 'partner') {
      navigate("/portal/v-magnetic-minds");
      return;
    }

    // If user has no role set yet (e.g. first-time Google login), redirect to Portal Gateway to choose role
    navigate("/portal");
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkRoleAndRedirect(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkRoleAndRedirect(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address first.");
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + "/auth?reset=true",
      });
      if (error) throw error;
      toast.success(`Password reset link sent to ${email.trim()}! Check your inbox.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();


    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;
        toast.success("Welcome back!");
        // Fire security login alert asynchronously
        emailService.loginAlert(email.trim(), data.user?.user_metadata?.full_name || email.split('@')[0]);
        // The onAuthStateChange will handle redirection
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: { full_name: fullName.trim() }
          }
        });

        if (error) throw error;

        toast.success("Account created!");
        if (data.user?.email) {
          try {
            await (supabase as any).from('portal_users').upsert({
              auth_user_id: data.user.id,
              email: data.user.email.toLowerCase().trim(),
              name: fullName.trim() || data.user.email.split('@')[0],
              role: 'client',
              confirmed: Boolean(data.user.email_confirmed_at),
              created_at: new Date().toISOString()
            }, { onConflict: 'email' });
          } catch (_) {}
        }
        // Send welcome email
        emailService.welcome(email.trim(), fullName.trim() || email.split('@')[0]);
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("AUTH_FAILURE_DETAIL:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + "/portal"
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("GOOGLE_AUTH_FAILURE:", error);
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = async (role: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { role }
      });
      if (error) throw error;
      
      toast.success(`Role set to ${role}`);
      if (data.user?.email) {
        try {
          await (supabase as any).from('portal_users').upsert({
            auth_user_id: data.user.id,
            email: data.user.email.toLowerCase().trim(),
            role,
            updated_at: new Date().toISOString()
          }, { onConflict: 'email' });
        } catch (_) {}
      }
      checkRoleAndRedirect(data.user);
    } catch (err: any) {
      console.error("ROLE_UPDATE_ERROR:", err);
      toast.error("Failed to set your role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (needsRoleSelection) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
        <Navbar />
        <Helmet>
          <title>Select Your Role | Siddhi Dynamics</title>
        </Helmet>
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
        <div className="flex-grow container relative z-10 mx-auto px-6 pt-32 pb-20 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl glass-card p-8 electric-border relative text-center"
          >
            <h1 className="text-3xl font-bold gradient-text glow-text mb-2 pt-4">Welcome to Siddhi Dynamics</h1>
            <p className="text-muted-foreground text-base mb-12">Please select how you'll be using our platform to set up your dashboard.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection('client')}
                className="p-6 rounded-2xl border-2 border-border/50 hover:border-primary/50 bg-background/50 flex flex-col items-center text-center transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">Client</h3>
                <p className="text-xs text-muted-foreground">Manage your projects, payments, GMeet booking, and track roadmaps.</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection('partner')}
                className="p-6 rounded-2xl border-2 border-border/50 hover:border-purple-500/50 bg-background/50 flex flex-col items-center text-center transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">Agency Partner</h3>
                <p className="text-xs text-muted-foreground">Manage agency client portfolios, custom branding, and SLAs.</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection('investor')}
                className="p-6 rounded-2xl border-2 border-border/50 hover:border-accent/50 bg-background/50 flex flex-col items-center text-center transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">Venture / Investor</h3>
                <p className="text-xs text-muted-foreground">Discover active ecosystem projects, track traction, and ROI metrics.</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection('employee')}
                className="p-6 rounded-2xl border-2 border-border/50 hover:border-blue-500/50 bg-background/50 flex flex-col items-center text-center transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">Employee / Builder</h3>
                <p className="text-xs text-muted-foreground">Access internal tasks, project delivery, and team communications.</p>
              </motion.button>
            </div>
            
            {loading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar />
      <Helmet>
        <title>{isLogin ? "Login" : "Sign Up"} | Siddhi Dynamics Portal</title>
        <meta name="description" content="Access the Siddhi Dynamics innovation portal to track your projects and collaborate with our AI team." />
      </Helmet>

      {/* Background patterns */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="flex-grow container relative z-10 mx-auto px-6 pt-32 pb-20 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-card p-8 electric-border relative"
        >
          {/* Back Arrow */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center mb-8 pt-4">
            <h1 className="text-3xl font-bold gradient-text glow-text mb-2 pt-8">
              {isLogin ? "Welcome Back" : "Join the Future"}
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              {isLogin
                ? "Log in to track your submissions and collaborate."
                : "Create an account to start your journey with us."}
            </p>

            {/* Mode Selection Buttons */}
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 mb-2">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${isLogin
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Login Now
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isLogin
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Create Account
              </button>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Name"
                      className="input-premium py-3 pl-12"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-premium py-3 pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-premium py-3 pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {isLogin && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>



            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-3.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? "Login Now" : "Create Account"
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 border border-gray-300 rounded-lg transition-colors shadow-sm"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>

          <div className="mt-8 text-center border-t border-border/30 pt-6 space-y-4">
            <div className="flex justify-center gap-4 text-[10px] text-muted-foreground/40 font-medium">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

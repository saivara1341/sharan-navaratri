import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Connection Diagnostic State
  const [connectionStatus, setConnectionStatus] = useState<"testing" | "ok" | "failed">("testing");
  const [debugInfo, setDebugInfo] = useState<string>("");

  const navigate = useNavigate();

  // ISP Bypass / System Status Test
  const testConnection = async () => {
    setConnectionStatus("testing");
    try {
      // 1. Check if backend proxy is alive (ISP Bypass check)
      const statusResp = await fetch("/api/status").catch(() => null);
      if (statusResp && statusResp.ok) {
        const statusData = await statusResp.json();
        setDebugInfo(`ISP Proxy active. Key: ${statusData.key_preview}`);
        setConnectionStatus("ok");
        return;
      }

      // 2. Fallback check for direct Supabase
      const testUrl = import.meta.env.DEV ? "/supabase-api/rest/v1" : `${(supabase as any).supabaseUrl}/rest/v1`;
      const resp = await fetch(testUrl, {
        headers: { 'apikey': (supabase as any).supabaseKey || import.meta.env.VITE_SUPABASE_ANON_KEY }
      });

      if (resp.status === 200 || resp.status === 401 || resp.status === 404) {
        setConnectionStatus("ok");
        setDebugInfo(`Direct connection active. ISP Bypass not detected.`);
      } else {
        setConnectionStatus("failed");
        setDebugInfo(`Connection Error ${resp.status}.`);
      }
    } catch (e: any) {
      setConnectionStatus("failed");
      setDebugInfo(`Network Failure. API unreachable.`);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (session.user.email === "ssaivaraprasad51@gmail.com") {
          navigate("/admin-hq-nexus");
        } else {
          navigate("/portal");
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        if (session.user.email === "ssaivaraprasad51@gmail.com") {
          navigate("/admin-hq-nexus");
        } else {
          navigate("/portal");
        }
      }
    });

    testConnection();

    return () => subscription.unsubscribe();
  }, [navigate]);

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

        if (email.trim().toLowerCase() === "ssaivaraprasad51@gmail.com") {
          toast.success("Welcome back, Commander.");
          navigate("/admin-hq-nexus");
        } else {
          toast.success("Welcome back!");
          navigate("/portal");
        }
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
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("AUTH_FAILURE_DETAIL:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar />

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
                  placeholder="name@company.com"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-3.5 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? "Login Now" : "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-border/30 pt-6">
            <p className="text-xs text-muted-foreground/50 uppercase tracking-[0.2em] mb-4">
              Engineering Agentic Intelligence
            </p>

            <div className={`text-[10px] p-2 rounded-lg border flex items-center gap-2 justify-center ${connectionStatus === "ok" ? "bg-green-500/5 border-green-500/20 text-green-500/80" :
              connectionStatus === "failed" ? "bg-red-500/5 border-red-500/20 text-red-500/80" :
                "bg-white/5 border-white/10 text-muted-foreground/50"
              }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus === "ok" ? "bg-green-500 animate-pulse" :
                connectionStatus === "failed" ? "bg-red-500" : "bg-white/20"
                }`} />
              <span className="truncate">{debugInfo || "Checking System..."}</span>
              <button
                onClick={(e) => { e.preventDefault(); testConnection(); }}
                className="ml-2 hover:text-primary transition-colors underline"
              >
                Retry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

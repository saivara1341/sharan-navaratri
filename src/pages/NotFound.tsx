import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, LayoutDashboard, ArrowLeft, Search, Bot } from "lucide-react";
import siddhiLogo from "@/assets/siddhi-logo.png";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground relative overflow-hidden px-4">
      {/* Glow Orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full glass-card rounded-3xl border border-border p-8 md:p-10 text-center shadow-2xl space-y-6 relative z-10"
      >
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-lg shadow-primary/10">
          <img src={siddhiLogo} alt="Siddhi Dynamics" className="w-12 h-12 object-contain" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            404 · Page Not Found
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-3 text-foreground">
            Lost in AI Space?
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
            The page <code className="text-primary font-bold bg-muted px-2 py-0.5 rounded border border-border">{location.pathname}</code> does not exist or has been moved.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xs shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" /> Return to Home
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="px-5 py-3 rounded-2xl bg-muted hover:bg-border text-foreground font-bold text-xs border border-border transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Contact Us
          </button>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-foreground font-bold transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>
          <span className="font-medium">Siddhi Dynamics Ecosystem</span>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

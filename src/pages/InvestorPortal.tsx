import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { TrendingUp, LogOut } from "lucide-react";

export default function InvestorPortal() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold gradient-text glow-text">Investor Portal</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-2xl electric-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-accent/10 rounded-xl"><TrendingUp className="w-6 h-6 text-accent" /></div>
              <h3 className="text-lg font-semibold">Overall Traction</h3>
            </div>
            <p className="text-3xl font-bold">+24%</p>
          </div>
          {/* Add more metrics cards as requested in task.md */}
        </div>
        
        <div className="glass-card p-8 rounded-2xl border border-border/50">
          <h2 className="text-2xl font-bold mb-6">Siddhi Dynamics Active Projects</h2>
          <p className="text-muted-foreground">List of startup projects and their statuses will appear here.</p>
        </div>
      </div>
    </div>
  );
}

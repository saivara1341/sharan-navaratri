import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Users, LogOut } from "lucide-react";

export default function EmployeePortal() {
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
          <h1 className="text-4xl font-bold gradient-text glow-text">Employee Workspace</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-2xl electric-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl"><Users className="w-6 h-6 text-primary" /></div>
              <h3 className="text-lg font-semibold">Assigned Tasks</h3>
            </div>
            <p className="text-3xl font-bold">12</p>
          </div>
        </div>
        
        <div className="glass-card p-8 rounded-2xl border border-border/50">
          <h2 className="text-2xl font-bold mb-6">Internal Task Management</h2>
          <p className="text-muted-foreground">Your assignments and team communications will appear here.</p>
        </div>
      </div>
    </div>
  );
}

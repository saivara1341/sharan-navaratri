import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  Building2, 
  Briefcase, 
  RefreshCw, 
  LogOut, 
  ArrowRight, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FooterSection } from '@/components/sections/FooterSection';

interface Props {
  userEmail: string;
  userName?: string;
  role: 'intern' | 'employee' | string;
  onRefresh?: () => void;
  onLogout?: () => void;
}

export const PendingCeoApprovalScreen: React.FC<Props> = ({
  userEmail,
  userName,
  role,
  onRefresh,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const roleLabel = role === 'employee' ? 'Employee / Team Workspace' : 'Intern / Growth Fellow Workspace';
  const roleName = role === 'employee' ? 'Employee & Engineering Staff' : 'Internship Candidate';

  const handleCheckStatus = async () => {
    setChecking(true);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => {
      setChecking(false);
      toast.info('Status checked: Your account is currently in the CEO approval queue. Please check back shortly.');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-8">
      {/* Top Navbar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-border/60 mb-8">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary group-hover:scale-105 transition-transform">
            SD
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-foreground block">Siddhi Dynamics</span>
            <span className="text-[10px] text-muted-foreground block -mt-0.5">Enterprise Portal Gateway</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onLogout && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-xs gap-1.5 border-border/80 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </Button>
          )}
        </div>
      </header>

      {/* Main Status Container */}
      <main className="max-w-3xl mx-auto w-full space-y-8 my-auto">
        {/* Header Alert Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xl text-center relative overflow-hidden space-y-6">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/80 to-secondary" />

          {/* Animated Status Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Awaiting CEO & Founder Approval</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome, {userName || userEmail.split('@')[0]}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your registration for the <span className="font-semibold text-foreground">{roleLabel}</span> has been received and is currently under review by <span className="font-semibold text-foreground">Founder & CEO Sarugu Sai Vara Prasad</span>.
            </p>
          </div>

          {/* Verification Status Details */}
          <div className="bg-muted/40 rounded-2xl p-4 sm:p-5 border border-border text-left grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Account</span>
              <span className="font-medium text-foreground truncate block mt-0.5" title={userEmail}>
                {userEmail}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Requested Access</span>
              <span className="font-semibold text-foreground block mt-0.5">
                {roleName}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-amber-500 mt-0.5">
                <Clock className="w-3.5 h-3.5" /> Pending Approval
              </span>
            </div>
          </div>

          {/* Real-time Status Refresh Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={handleCheckStatus}
              disabled={checking}
              className="gap-2 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs px-6"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking Status...' : 'Check Approval Status'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/portal')}
              className="w-full sm:w-auto text-xs border-border text-muted-foreground hover:text-foreground"
            >
              Switch Role / View Portals
            </Button>
          </div>
        </div>

        {/* While You Wait: Discovery & Opportunities Section */}
        <div className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="text-base font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
              While you wait for CEO approval:
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Explore our engineering publications, company story, or apply for other open technical roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Read Tech Blogs */}
            <div 
              onClick={() => navigate('/blog')}
              className="rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  Read Our Tech Blogs
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Discover deep-dives on distributed edge systems, AI workflows, and enterprise automation built by Siddhi Dynamics.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-primary gap-1 pt-2">
                <span>Explore Blogs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Read About Us */}
            <div 
              onClick={() => navigate('/about')}
              className="rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  About Siddhi Dynamics
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Learn about our founding story, leadership, core pillars, and high-impact software missions across India.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-primary gap-1 pt-2">
                <span>Our Story</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Apply for Other Open Roles */}
            <div 
              onClick={() => navigate('/careers')}
              className="rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  Apply for Other Roles
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Haven't submitted your formal resume yet or want to explore other openings? Check out positions in AI, Web, and BD.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-primary gap-1 pt-2">
                <span>View Openings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

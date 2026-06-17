import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import ClientPortal from "./pages/ClientPortal";
import InvestorPortal from "./pages/InvestorPortal";
import EmployeePortal from "./pages/EmployeePortal";
import NexusLanding from "./pages/projects/NexusLanding";
import NilayamLanding from "./pages/projects/NilayamLanding";
import ArchPlanLanding from "./pages/projects/ArchPlanLanding";
import LetUsKnowLanding from "./pages/projects/LetUsKnowLanding";
import WishOLanding from "./pages/projects/WishOLanding";
import AdminPortal from "./pages/AdminPortal";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import PromoPopup from "./components/PromoPopup";
import WomensDayCelebration from "./components/WomensDayCelebration";
import RamzanCelebration from "./components/RamzanCelebration";

// Specialized Service Pages
import ResourceHub from "@/pages/services/ResourceHub";
import ResumeBuilder from "@/pages/services/ResumeBuilder";
import StartupBlueprint from "@/pages/services/StartupBlueprint";

// New SEO Pages
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import BusinessAutomation from "@/pages/services/BusinessAutomation";
import WebsiteDevelopment from "@/pages/services/WebsiteDevelopment";
import SaaSPlatforms from "@/pages/services/SaaSPlatforms";
import ERPSolutions from "@/pages/services/ERPSolutions";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = (email?: string) => {
      if (!email) return false;
      const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "ssaivaraprasad51@gmail.com")
        .split(",")
        .map((e: string) => e.trim().toLowerCase());
      return adminEmails.includes(email.trim().toLowerCase());
    };

    // Check initial session - ONLY redirect if user is on the auth page
    // This allows logged-in users to visit the home page freely.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && (location.pathname === '/auth' || location.pathname === '/auth/')) {
        const role = session.user.user_metadata?.role;
        if (checkAdmin(session.user.email)) {
          navigate("/admin-hq-nexus");
        } else if (role === 'employee') {
          navigate("/portal/employee");
        } else if (role === 'client') {
          navigate("/portal/client");
        } else if (role === 'investor') {
          navigate("/portal/investor");
        } else {
          // If they don't have a role, keep them on /auth where Auth.tsx shows the role selector
        }
      }
    });

    // Listen for auth changes (like login success)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && (location.pathname === '/auth' || location.pathname === '/auth/')) {
        const role = session.user.user_metadata?.role;
        if (checkAdmin(session.user.email)) {
          navigate("/admin-hq-nexus");
        } else if (role === 'employee') {
          navigate("/portal/employee");
        } else if (role === 'client') {
          navigate("/portal/client");
        } else if (role === 'investor') {
          navigate("/portal/investor");
        } else {
          // Stay on /auth for role selection
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return null;
};

const App = () => {
  const [ramzanDone, setRamzanDone] = useState(false);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WomensDayCelebration />
          <RamzanCelebration onClose={() => setRamzanDone(true)} />
          <PromoPopup allowed={ramzanDone} />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthRedirectHandler />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vision" element={<Index />} />
              <Route path="/projects" element={<Index />} />
              <Route path="/submit" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/portal/client" element={<ClientPortal />} />
              <Route path="/portal/investor" element={<InvestorPortal />} />
              <Route path="/portal/employee" element={<EmployeePortal />} />
              <Route path="/project/nexus" element={<NexusLanding />} />
              <Route path="/project/nilayam" element={<NilayamLanding />} />
              <Route path="/project/archplan" element={<ArchPlanLanding />} />
              <Route path="/project/letusknow" element={<LetUsKnowLanding />} />
              <Route path="/project/wish-o" element={<WishOLanding />} />
              <Route path="/admin-hq-nexus" element={<AdminPortal />} />
              <Route path="/nexus/resource-hub" element={<ResourceHub />} />
              <Route path="/nexus/market-research" element={<ResourceHub />} />
              <Route path="/nexus/resume-builder" element={<ResumeBuilder />} />
              <Route path="/nexus/startup-blueprint" element={<StartupBlueprint />} />
              <Route path="/nexus/skills-analysis" element={<ResourceHub />} />
              <Route path="/nexus/jobs" element={<ResourceHub />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              {/* SEO Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/services/business-automation" element={<BusinessAutomation />} />
              <Route path="/services/website-development" element={<WebsiteDevelopment />} />
              <Route path="/services/saas" element={<SaaSPlatforms />} />
              <Route path="/services/erp" element={<ERPSolutions />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
